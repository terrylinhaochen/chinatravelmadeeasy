-- Keep the operational tables outside PostgREST while still adding defense-in-depth RLS.
alter table ctme_private.ingestion_jobs enable row level security;
alter table ctme_private.provider_payloads enable row level security;
alter table ctme_private.rate_limit_counters enable row level security;
alter table ctme_private.moderation_decisions enable row level security;

do $$
begin
  if not exists (
    select 1 from pg_constraint
    where conname = 'rate_limit_counters_bucket_check'
      and conrelid = 'ctme_private.rate_limit_counters'::regclass
  ) then
    alter table ctme_private.rate_limit_counters
      add constraint rate_limit_counters_bucket_check check (bucket in ('hour', 'day'));
  end if;
  if not exists (
    select 1 from pg_constraint
    where conname = 'rate_limit_counters_count_check'
      and conrelid = 'ctme_private.rate_limit_counters'::regclass
  ) then
    alter table ctme_private.rate_limit_counters
      add constraint rate_limit_counters_count_check check (count > 0);
  end if;
  if not exists (
    select 1 from pg_constraint
    where conname = 'place_corrections_single_target_check'
      and conrelid = 'public.place_corrections'::regclass
  ) then
    alter table public.place_corrections
      add constraint place_corrections_single_target_check
      check (not (place_id is not null and video_mention_id is not null));
  end if;
  if not exists (
    select 1 from pg_constraint
    where conname = 'place_corrections_type_check'
      and conrelid = 'public.place_corrections'::regclass
  ) then
    alter table public.place_corrections
      add constraint place_corrections_type_check
      check (correction_type in ('wrong_place', 'local_name', 'address', 'address_entrance', 'closed', 'duplicate'));
  end if;
  if not exists (
    select 1 from pg_constraint
    where conname = 'content_reports_reason_length_check'
      and conrelid = 'public.content_reports'::regclass
  ) then
    alter table public.content_reports
      add constraint content_reports_reason_length_check
      check (char_length(trim(reason)) between 1 and 80);
  end if;
end $$;

-- The helper remains private and now requires both a real user and immutable app metadata.
create or replace function ctme_private.is_ctme_admin() returns boolean
language sql stable security definer set search_path = '' as $$
  select (select auth.uid()) is not null
    and coalesce((auth.jwt() -> 'app_metadata' ->> 'ctme_admin')::boolean, false)
$$;

create or replace function public.is_ctme_admin() returns boolean
language sql stable security definer set search_path = '' as $$
  select (select auth.uid()) is not null
    and coalesce((auth.jwt() -> 'app_metadata' ->> 'ctme_admin')::boolean, false)
$$;

drop policy if exists corrections_admin_update on public.place_corrections;
create policy corrections_admin_update on public.place_corrections
for update to authenticated
using ((select ctme_private.is_ctme_admin()))
with check ((select ctme_private.is_ctme_admin()));

-- Edge Functions cannot query ctme_private through supabase-js because it is intentionally not
-- an exposed Data API schema. These narrowly granted RPCs keep each private operation atomic.
create or replace function public.consume_submission_rate_limit(
  p_fingerprint_hash text,
  p_hour_start timestamptz,
  p_day_start timestamptz
) returns table (
  allowed boolean,
  limit_bucket text,
  retry_after_seconds integer,
  hour_count integer,
  day_count integer
)
language plpgsql security definer set search_path = '' as $$
declare
  v_hour_count integer;
  v_day_count integer;
begin
  if p_fingerprint_hash is null or char_length(p_fingerprint_hash) <> 64 then
    raise exception using errcode = '22023', message = 'invalid_fingerprint';
  end if;

  insert into ctme_private.rate_limit_counters(fingerprint_hash, bucket_start, bucket, count)
  values (p_fingerprint_hash, p_hour_start, 'hour', 1)
  on conflict (fingerprint_hash, bucket_start, bucket)
  do update set count = ctme_private.rate_limit_counters.count + 1
  returning count into v_hour_count;

  insert into ctme_private.rate_limit_counters(fingerprint_hash, bucket_start, bucket, count)
  values (p_fingerprint_hash, p_day_start, 'day', 1)
  on conflict (fingerprint_hash, bucket_start, bucket)
  do update set count = ctme_private.rate_limit_counters.count + 1
  returning count into v_day_count;

  return query select
    v_hour_count <= 3 and v_day_count <= 10,
    case when v_hour_count > 3 then 'hour' when v_day_count > 10 then 'day' else null end,
    case when v_hour_count > 3 then 3600 when v_day_count > 10 then 86400 else 0 end,
    v_hour_count,
    v_day_count;
end
$$;
revoke all on function public.consume_submission_rate_limit(text, timestamptz, timestamptz) from public, anon, authenticated;
grant execute on function public.consume_submission_rate_limit(text, timestamptz, timestamptz) to service_role;

drop function if exists public.enqueue_video_ingestion(jsonb);

create or replace function public.register_video_submission(
  p_platform public.video_platform,
  p_external_video_id text,
  p_canonical_url text,
  p_pipeline_version text default 'official-v1'
) returns table (
  video_id uuid,
  video_slug text,
  status public.publication_state,
  cached boolean
)
language plpgsql security definer set search_path = '' as $$
declare
  v_video public.videos%rowtype;
  v_idempotency_key text;
begin
  if p_external_video_id is null or p_external_video_id !~ '^[A-Za-z0-9_-]{6,40}$' then
    raise exception using errcode = '22023', message = 'invalid_external_video_id';
  end if;
  if p_canonical_url is null or p_canonical_url !~ '^https://' or char_length(p_canonical_url) > 2048 then
    raise exception using errcode = '22023', message = 'invalid_canonical_url';
  end if;
  if p_pipeline_version is null or char_length(p_pipeline_version) > 100 then
    raise exception using errcode = '22023', message = 'invalid_pipeline_version';
  end if;

  perform pg_catalog.pg_advisory_xact_lock(
    pg_catalog.hashtextextended(p_platform::text || ':' || p_external_video_id, 0)
  );

  select v.* into v_video
  from public.videos as v
  where v.platform = p_platform and v.external_video_id = p_external_video_id
  for update;

  if found then
    update public.videos
    set submit_count = submit_count + 1, updated_at = now()
    where id = v_video.id
    returning * into v_video;

    -- Repair a queued row left behind by an older, non-atomic submit implementation.
    if v_video.publication_state = 'queued' then
      v_idempotency_key := p_platform::text || ':' || p_external_video_id || ':' || p_pipeline_version;
      insert into ctme_private.ingestion_jobs(video_id, idempotency_key, pipeline_version)
      values (v_video.id, v_idempotency_key, p_pipeline_version)
      on conflict (idempotency_key) do nothing;
      if found then
        perform pgmq.send(
          'video_ingestion',
          pg_catalog.jsonb_build_object('video_id', v_video.id, 'idempotency_key', v_idempotency_key)
        );
      end if;
    end if;

    return query select v_video.id, v_video.slug, v_video.publication_state, true;
    return;
  end if;

  insert into public.videos(platform, external_video_id, canonical_url, publication_state)
  values (p_platform, p_external_video_id, p_canonical_url, 'queued')
  returning * into v_video;

  v_idempotency_key := p_platform::text || ':' || p_external_video_id || ':' || p_pipeline_version;
  insert into ctme_private.ingestion_jobs(video_id, idempotency_key, pipeline_version)
  values (v_video.id, v_idempotency_key, p_pipeline_version);

  perform pgmq.send(
    'video_ingestion',
    pg_catalog.jsonb_build_object('video_id', v_video.id, 'idempotency_key', v_idempotency_key)
  );

  return query select v_video.id, v_video.slug, v_video.publication_state, false;
end
$$;
revoke all on function public.register_video_submission(public.video_platform, text, text, text) from public, anon, authenticated;
grant execute on function public.register_video_submission(public.video_platform, text, text, text) to service_role;

create or replace function public.save_place_experience(
  p_user_id uuid,
  p_place_id uuid,
  p_client_request_id uuid,
  p_verdict public.experience_verdict,
  p_note text default null,
  p_visit_month date default null,
  p_season text default null,
  p_context_tags text[] default '{}'
) returns table (id uuid, created_at timestamptz)
language plpgsql security definer set search_path = '' as $$
declare
  v_id uuid;
  v_created_at timestamptz;
begin
  if p_user_id is null or p_place_id is null or p_client_request_id is null then
    raise exception using errcode = '22023', message = 'missing_experience_identity';
  end if;
  if char_length(coalesce(p_note, '')) > 280
    or char_length(coalesce(p_season, '')) > 40
    or cardinality(coalesce(p_context_tags, '{}')) > 8
    or not coalesce((select bool_and(char_length(tag) <= 40) from unnest(coalesce(p_context_tags, '{}')) as tag), true) then
    raise exception using errcode = '22023', message = 'invalid_experience_details';
  end if;

  insert into public.place_experiences(
    user_id, place_id, client_request_id, verdict, note, visit_month, season, context_tags
  ) values (
    p_user_id, p_place_id, p_client_request_id, p_verdict, nullif(trim(p_note), ''),
    p_visit_month, nullif(trim(p_season), ''), coalesce(p_context_tags, '{}')
  )
  on conflict (user_id, client_request_id) do update set
    verdict = excluded.verdict,
    note = excluded.note,
    visit_month = excluded.visit_month,
    season = excluded.season,
    context_tags = excluded.context_tags,
    updated_at = now()
  returning public.place_experiences.id, public.place_experiences.created_at
  into v_id, v_created_at;

  return query select v_id, v_created_at;
end
$$;
revoke all on function public.save_place_experience(uuid, uuid, uuid, public.experience_verdict, text, date, text, text[]) from public, anon, authenticated;
grant execute on function public.save_place_experience(uuid, uuid, uuid, public.experience_verdict, text, date, text, text[]) to service_role;

create or replace function public.save_place_correction(
  p_user_id uuid,
  p_place_id uuid,
  p_video_mention_id uuid,
  p_client_request_id uuid,
  p_correction_type text,
  p_proposed_value jsonb
) returns table (id uuid, status text)
language plpgsql security definer set search_path = '' as $$
declare
  v_id uuid;
  v_status text;
begin
  if p_user_id is null or p_client_request_id is null
    or ((p_place_id is not null)::integer + (p_video_mention_id is not null)::integer) <> 1
    or p_correction_type not in ('wrong_place', 'local_name', 'address', 'address_entrance', 'closed', 'duplicate')
    or p_proposed_value is null or char_length(p_proposed_value::text) > 600 then
    raise exception using errcode = '22023', message = 'invalid_correction';
  end if;

  insert into public.place_corrections(
    user_id, place_id, video_mention_id, client_request_id, correction_type, proposed_value
  ) values (
    p_user_id, p_place_id, p_video_mention_id, p_client_request_id, p_correction_type, p_proposed_value
  )
  on conflict (user_id, client_request_id) do update set
    correction_type = excluded.correction_type,
    proposed_value = excluded.proposed_value
  returning public.place_corrections.id, public.place_corrections.status
  into v_id, v_status;

  return query select v_id, v_status;
end
$$;
revoke all on function public.save_place_correction(uuid, uuid, uuid, uuid, text, jsonb) from public, anon, authenticated;
grant execute on function public.save_place_correction(uuid, uuid, uuid, uuid, text, jsonb) to service_role;

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
      'video_ingestion',
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

-- Anonymous readers may inspect useful visit evidence, but never the owning user or callback key.
create or replace view public.published_place_experiences with (security_invoker = true) as
select id, place_id, verdict, note, visit_month, season, context_tags, created_at, updated_at
from public.place_experiences
where moderation_state = 'published';

drop policy if exists experiences_owner_insert on public.place_experiences;
drop policy if exists experiences_owner_update on public.place_experiences;
drop policy if exists corrections_owner_insert on public.place_corrections;

revoke all on public.place_experiences from anon, authenticated;
grant select (
  id, place_id, verdict, note, visit_month, season, context_tags, moderation_state, created_at, updated_at
) on public.place_experiences to anon, authenticated;
grant select on public.published_place_experiences to anon, authenticated;

revoke all on public.place_corrections from anon, authenticated;
grant select on public.place_corrections to authenticated;
grant update (status) on public.place_corrections to authenticated;

comment on function public.register_video_submission(public.video_platform, text, text, text) is
  'Service-only atomic video deduplication, job creation, and durable queue send.';
comment on view public.published_place_experiences is
  'Public visit evidence without user_id or client_request_id.';
