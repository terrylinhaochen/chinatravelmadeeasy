-- Queue access stays behind four narrowly scoped service-role RPCs. The pgmq and
-- ctme_private schemas remain outside the Data API.
-- Place-match corrections have a different consumer and must never be mistaken for
-- a fresh official-metadata job.
select pgmq.create('place_reresolution');

create or replace function public.enqueue_place_reresolution(
  p_video_id uuid,
  p_correction_id uuid
) returns boolean
language plpgsql security definer set search_path = '' as $$
declare
  v_rows integer;
  v_idempotency_key text := 'correction:' || p_correction_id::text;
begin
  if not exists (
    select 1
    from public.place_corrections as c
    where c.id = p_correction_id
      and (
        exists (
          select 1 from public.video_place_mentions as m
          where m.id = c.video_mention_id and m.video_id = p_video_id
        )
        or exists (
          select 1 from public.video_place_mentions as m
          where m.place_id = c.place_id and m.video_id = p_video_id
        )
      )
  ) then
    raise exception using errcode = '22023', message = 'correction_video_mismatch';
  end if;

  insert into ctme_private.ingestion_jobs(video_id, idempotency_key, pipeline_version)
  values (p_video_id, v_idempotency_key, 'correction-v1')
  on conflict (idempotency_key) do nothing;
  get diagnostics v_rows = row_count;

  if v_rows = 1 then
    perform pgmq.send(
      'place_reresolution',
      pg_catalog.jsonb_build_object(
        'video_id', p_video_id,
        'correction_id', p_correction_id,
        'idempotency_key', v_idempotency_key,
        'kind', 'reresolution'
      )
    );
  end if;
  return v_rows = 1;
end
$$;
revoke all on function public.enqueue_place_reresolution(uuid, uuid) from public, anon, authenticated;
grant execute on function public.enqueue_place_reresolution(uuid, uuid) to service_role;

create or replace function public.claim_video_ingestion_jobs(
  p_limit integer default 3,
  p_visibility_seconds integer default 120
) returns table (
  message_id bigint,
  read_count bigint,
  video_id uuid,
  idempotency_key text,
  platform public.video_platform,
  canonical_url text,
  attempts integer,
  pipeline_version text
)
language plpgsql security definer set search_path = '' as $$
declare
  v_message pgmq.message_record;
  v_job ctme_private.ingestion_jobs%rowtype;
  v_video public.videos%rowtype;
  v_video_id_text text;
  v_archived boolean;
begin
  if p_limit is null or p_limit < 1 or p_limit > 5
    or p_visibility_seconds is null or p_visibility_seconds < 30 or p_visibility_seconds > 600 then
    raise exception using errcode = '22023', message = 'invalid_worker_batch';
  end if;

  for v_message in select * from pgmq.read('video_ingestion', p_visibility_seconds, p_limit)
  loop
    v_video_id_text := v_message.message ->> 'video_id';
    if v_video_id_text is null
      or v_video_id_text !~ '^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[1-5][0-9a-fA-F]{3}-[89abAB][0-9a-fA-F]{3}-[0-9a-fA-F]{12}$'
      or v_message.message ->> 'idempotency_key' is null then
      select pgmq.archive('video_ingestion', v_message.msg_id) into v_archived;
      continue;
    end if;

    select j.* into v_job
    from ctme_private.ingestion_jobs as j
    where j.video_id = v_video_id_text::uuid
      and j.idempotency_key = v_message.message ->> 'idempotency_key'
    for update;

    if not found then
      select pgmq.archive('video_ingestion', v_message.msg_id) into v_archived;
      continue;
    end if;

    if v_job.status in ('metadata_ready', 'failed') then
      select pgmq.archive('video_ingestion', v_message.msg_id) into v_archived;
      continue;
    end if;

    select v.* into v_video
    from public.videos as v
    where v.id = v_job.video_id
    for update;

    if not found or v_video.publication_state not in ('queued', 'processing') then
      update ctme_private.ingestion_jobs
      set status = 'failed', last_error = 'video_not_processable', updated_at = now()
      where id = v_job.id;
      select pgmq.archive('video_ingestion', v_message.msg_id) into v_archived;
      continue;
    end if;

    update ctme_private.ingestion_jobs
    set status = 'processing', attempts = attempts + 1, last_error = null, updated_at = now()
    where id = v_job.id
    returning * into v_job;

    update public.videos
    set publication_state = 'processing', updated_at = now()
    where id = v_video.id and publication_state in ('queued', 'processing');

    message_id := v_message.msg_id;
    read_count := v_message.read_ct;
    video_id := v_video.id;
    idempotency_key := v_job.idempotency_key;
    platform := v_video.platform;
    canonical_url := v_video.canonical_url;
    attempts := v_job.attempts;
    pipeline_version := v_job.pipeline_version;
    return next;
  end loop;
end
$$;
revoke all on function public.claim_video_ingestion_jobs(integer, integer) from public, anon, authenticated;
grant execute on function public.claim_video_ingestion_jobs(integer, integer) to service_role;

create or replace function public.complete_video_metadata_stage(
  p_message_id bigint,
  p_video_id uuid,
  p_idempotency_key text,
  p_provider text,
  p_provider_payload jsonb,
  p_title text,
  p_creator_name text,
  p_poster_url text,
  p_embed_state text,
  p_metadata_hash text,
  p_cache_expires_at timestamptz
) returns boolean
language plpgsql security definer set search_path = '' as $$
declare
  v_job ctme_private.ingestion_jobs%rowtype;
  v_platform public.video_platform;
  v_archived boolean;
begin
  if p_message_id is null or p_video_id is null or p_idempotency_key is null
    or p_provider is null or p_provider not in ('tiktok_oembed', 'instagram_oembed')
    or p_provider_payload is null or pg_catalog.jsonb_typeof(p_provider_payload) <> 'object'
    or pg_catalog.octet_length(p_provider_payload::text) > 262144
    or char_length(coalesce(p_title, '')) > 500
    or char_length(coalesce(p_creator_name, '')) > 200
    or char_length(coalesce(p_poster_url, '')) > 2048
    or p_embed_state is null or p_embed_state not in ('embeddable', 'link_only', 'unavailable')
    or p_metadata_hash is null or p_metadata_hash !~ '^[0-9a-f]{64}$'
    or p_cache_expires_at is null or p_cache_expires_at <= now() then
    raise exception using errcode = '22023', message = 'invalid_metadata_completion';
  end if;

  select j, v.platform into v_job, v_platform
  from ctme_private.ingestion_jobs as j
  join public.videos as v on v.id = j.video_id
  where j.video_id = p_video_id and j.idempotency_key = p_idempotency_key
  for update of j, v;

  if not found or v_job.status <> 'processing'
    or (v_platform = 'tiktok' and p_provider <> 'tiktok_oembed')
    or (v_platform = 'instagram' and p_provider <> 'instagram_oembed') then
    raise exception using errcode = '22023', message = 'metadata_job_mismatch';
  end if;

  update public.videos
  set title = nullif(pg_catalog.btrim(p_title), ''),
      creator_name = nullif(pg_catalog.btrim(p_creator_name), ''),
      poster_url = nullif(pg_catalog.btrim(p_poster_url), ''),
      embed_state = p_embed_state,
      metadata_checked_at = now(),
      metadata_cache_expires_at = p_cache_expires_at,
      metadata_hash = p_metadata_hash,
      extraction_version = v_job.pipeline_version,
      publication_state = 'processing',
      updated_at = now()
  where id = p_video_id and publication_state in ('queued', 'processing');

  if not found then
    raise exception using errcode = '22023', message = 'video_not_processable';
  end if;

  insert into ctme_private.provider_payloads(video_id, provider, payload)
  values (p_video_id, p_provider, p_provider_payload);

  update ctme_private.ingestion_jobs
  set status = 'metadata_ready', last_error = null, updated_at = now()
  where id = v_job.id;

  select pgmq.archive('video_ingestion', p_message_id) into v_archived;
  if not coalesce(v_archived, false) then
    raise exception using errcode = '55000', message = 'queue_archive_failed';
  end if;
  return true;
end
$$;
revoke all on function public.complete_video_metadata_stage(bigint, uuid, text, text, jsonb, text, text, text, text, text, timestamptz) from public, anon, authenticated;
grant execute on function public.complete_video_metadata_stage(bigint, uuid, text, text, jsonb, text, text, text, text, text, timestamptz) to service_role;

create or replace function public.fail_video_ingestion_job(
  p_message_id bigint,
  p_video_id uuid,
  p_idempotency_key text,
  p_error_code text,
  p_terminal boolean default false,
  p_retry_delay_seconds integer default 300
) returns boolean
language plpgsql security definer set search_path = '' as $$
declare
  v_job_id uuid;
  v_archived boolean;
  v_updated_message_id bigint;
begin
  if p_message_id is null or p_video_id is null or p_idempotency_key is null
    or p_error_code is null or p_error_code !~ '^[a-z0-9_:-]{1,120}$'
    or p_terminal is null
    or p_retry_delay_seconds is null or p_retry_delay_seconds < 30 or p_retry_delay_seconds > 86400 then
    raise exception using errcode = '22023', message = 'invalid_ingestion_failure';
  end if;

  select id into v_job_id
  from ctme_private.ingestion_jobs
  where video_id = p_video_id and idempotency_key = p_idempotency_key and status = 'processing'
  for update;
  if not found then
    raise exception using errcode = '22023', message = 'ingestion_job_mismatch';
  end if;

  if p_terminal then
    update ctme_private.ingestion_jobs
    set status = 'failed', last_error = p_error_code, updated_at = now()
    where id = v_job_id;
    update public.videos
    set publication_state = 'rejected', updated_at = now()
    where id = p_video_id and publication_state in ('queued', 'processing');
    select pgmq.archive('video_ingestion', p_message_id) into v_archived;
    if not coalesce(v_archived, false) then
      raise exception using errcode = '55000', message = 'queue_archive_failed';
    end if;
  else
    update ctme_private.ingestion_jobs
    set status = 'retryable', last_error = p_error_code, updated_at = now()
    where id = v_job_id;
    update public.videos
    set publication_state = 'processing', updated_at = now()
    where id = p_video_id and publication_state in ('queued', 'processing');
    select q.msg_id into v_updated_message_id
    from pgmq.set_vt('video_ingestion', p_message_id, p_retry_delay_seconds) as q;
    if v_updated_message_id is null then
      raise exception using errcode = '55000', message = 'queue_retry_failed';
    end if;
  end if;
  return true;
end
$$;
revoke all on function public.fail_video_ingestion_job(bigint, uuid, text, text, boolean, integer) from public, anon, authenticated;
grant execute on function public.fail_video_ingestion_job(bigint, uuid, text, text, boolean, integer) to service_role;

create or replace function public.get_video_processing_status(p_video_id uuid)
returns table (job_status text, attempts integer, error_code text, checked_at timestamptz)
language sql stable security definer set search_path = '' as $$
  select j.status, j.attempts,
    case when j.last_error ~ '^[a-z0-9_:-]{1,120}$' then j.last_error when j.last_error is null then null else 'processing_error' end,
    j.updated_at
  from ctme_private.ingestion_jobs as j
  where j.video_id = p_video_id
  order by j.created_at desc
  limit 1
$$;
revoke all on function public.get_video_processing_status(uuid) from public, anon, authenticated;
grant execute on function public.get_video_processing_status(uuid) to service_role;

comment on function public.claim_video_ingestion_jobs(integer, integer) is
  'Service-only queue claim. Marks each durable job processing and never publishes a video.';
comment on function public.complete_video_metadata_stage(bigint, uuid, text, text, jsonb, text, text, text, text, text, timestamptz) is
  'Service-only official metadata completion. Archives the queue message but leaves the video processing for evidence and place resolution.';
