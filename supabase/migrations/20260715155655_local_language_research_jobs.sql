-- Local Lens is an agent-run research pipeline. Travelers request a destination
-- brief; a service worker retrieves destination-language evidence, resolves
-- places, and returns an owner-only result. Raw provider payloads never enter the
-- exposed schema.

create type public.local_research_status as enum (
  'queued',
  'researching',
  'resolving_places',
  'completed',
  'failed'
);

create table public.local_research_jobs (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users on delete cascade,
  destination text not null check (char_length(destination) between 2 and 120),
  destination_language text not null check (destination_language ~ '^[a-z]{2}(?:-[A-Z]{2})?$'),
  intent text not null check (char_length(intent) between 8 and 500),
  constraints text check (char_length(constraints) <= 1000),
  request_hash text not null check (request_hash ~ '^[0-9a-f]{64}$'),
  status public.local_research_status not null default 'queued',
  pipeline_version text not null,
  source_count integer not null default 0 check (source_count >= 0),
  candidate_count integer not null default 0 check (candidate_count >= 0),
  failure_code text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  completed_at timestamptz
);

create table public.local_research_candidates (
  id uuid primary key default gen_random_uuid(),
  job_id uuid not null references public.local_research_jobs on delete cascade,
  rank integer not null check (rank between 1 and 20),
  name_en text not null check (char_length(name_en) between 1 and 200),
  name_local text not null check (char_length(name_local) between 1 and 200),
  recommendation text not null check (char_length(recommendation) between 20 and 1200),
  traveler_caveat text check (char_length(traveler_caveat) <= 800),
  source_platform text not null check (source_platform ~ '^[a-z0-9_-]{2,40}$'),
  source_language text not null check (source_language ~ '^[a-z]{2}(?:-[A-Z]{2})?$'),
  source_url text not null check (source_url ~ '^https://'),
  source_title text check (char_length(source_title) <= 500),
  source_published_at timestamptz,
  source_retrieved_at timestamptz not null,
  evidence_excerpt text not null check (char_length(evidence_excerpt) between 1 and 800),
  native_query text not null check (char_length(native_query) between 2 and 500),
  evidence_confidence numeric(4,3) not null check (evidence_confidence between 0 and 1),
  resolution_state public.resolution_state not null,
  place_id uuid references public.places on delete set null,
  map_evidence jsonb not null default '{}'::jsonb check (jsonb_typeof(map_evidence) = 'object'),
  created_at timestamptz not null default now(),
  unique (job_id, rank)
);

create table ctme_private.local_research_worker_jobs (
  id uuid primary key default gen_random_uuid(),
  job_id uuid not null unique references public.local_research_jobs on delete cascade,
  idempotency_key text not null unique,
  status text not null default 'queued' check (status in ('queued','researching','retryable','completed','failed')),
  attempts integer not null default 0 check (attempts >= 0),
  last_error text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table ctme_private.local_research_provider_payloads (
  id bigint generated always as identity primary key,
  job_id uuid not null references public.local_research_jobs on delete cascade,
  provider text not null,
  payload jsonb not null check (jsonb_typeof(payload) in ('object','array')),
  fetched_at timestamptz not null default now()
);

create index local_research_jobs_owner_created_idx
  on public.local_research_jobs(user_id, created_at desc);
create index local_research_candidates_job_rank_idx
  on public.local_research_candidates(job_id, rank);

alter table public.local_research_jobs enable row level security;
alter table public.local_research_candidates enable row level security;

create policy local_research_jobs_owner_read
  on public.local_research_jobs for select to authenticated
  using ((select auth.uid()) = user_id);

create policy local_research_candidates_owner_read
  on public.local_research_candidates for select to authenticated
  using (
    exists (
      select 1
      from public.local_research_jobs as job
      where job.id = job_id and job.user_id = (select auth.uid())
    )
  );

revoke all on public.local_research_jobs, public.local_research_candidates from anon, authenticated;
grant select on public.local_research_jobs, public.local_research_candidates to authenticated;

select pgmq.create('local_language_research');

create or replace function public.register_local_research_job(
  p_user_id uuid,
  p_destination text,
  p_destination_language text,
  p_intent text,
  p_constraints text,
  p_pipeline_version text default 'local-research-v1'
) returns table (
  local_research_job_id uuid,
  local_research_status public.local_research_status,
  cached boolean
)
language plpgsql security definer set search_path = '' as $$
declare
  v_destination text := pg_catalog.btrim(p_destination);
  v_intent text := pg_catalog.btrim(p_intent);
  v_constraints text := nullif(pg_catalog.btrim(coalesce(p_constraints, '')), '');
  v_hash text;
  v_job public.local_research_jobs%rowtype;
  v_idempotency_key text;
begin
  if p_user_id is null
    or char_length(v_destination) not between 2 and 120
    or p_destination_language !~ '^[a-z]{2}(?:-[A-Z]{2})?$'
    or char_length(v_intent) not between 8 and 500
    or char_length(coalesce(v_constraints, '')) > 1000
    or p_pipeline_version !~ '^[a-z0-9._-]{3,80}$' then
    raise exception using errcode = '22023', message = 'invalid_research_request';
  end if;

  v_hash := encode(extensions.digest(
    pg_catalog.lower(v_destination) || E'\n' || p_destination_language || E'\n' ||
    pg_catalog.lower(v_intent) || E'\n' || pg_catalog.lower(coalesce(v_constraints, '')),
    'sha256'
  ), 'hex');
  perform pg_catalog.pg_advisory_xact_lock(pg_catalog.hashtextextended(p_user_id::text || ':' || v_hash, 0));

  select * into v_job
  from public.local_research_jobs
  where user_id = p_user_id
    and request_hash = v_hash
    and pipeline_version = p_pipeline_version
    and created_at >= now() - interval '7 days'
    and status in ('queued','researching','resolving_places','completed')
  order by created_at desc
  limit 1;

  if found then
    local_research_job_id := v_job.id;
    local_research_status := v_job.status;
    cached := true;
    return next;
    return;
  end if;

  insert into public.local_research_jobs(
    user_id, destination, destination_language, intent, constraints,
    request_hash, pipeline_version
  ) values (
    p_user_id, v_destination, p_destination_language, v_intent, v_constraints,
    v_hash, p_pipeline_version
  ) returning * into v_job;

  v_idempotency_key := 'local-research:' || v_job.id::text;
  insert into ctme_private.local_research_worker_jobs(job_id, idempotency_key)
  values (v_job.id, v_idempotency_key);
  perform pgmq.send(
    'local_language_research',
    pg_catalog.jsonb_build_object(
      'job_id', v_job.id,
      'idempotency_key', v_idempotency_key,
      'pipeline_version', p_pipeline_version
    )
  );

  local_research_job_id := v_job.id;
  local_research_status := v_job.status;
  cached := false;
  return next;
end
$$;
revoke all on function public.register_local_research_job(uuid, text, text, text, text, text) from public, anon, authenticated;
grant execute on function public.register_local_research_job(uuid, text, text, text, text, text) to service_role;

create or replace function public.claim_local_research_jobs(
  p_limit integer default 2,
  p_visibility_seconds integer default 300
) returns table (
  message_id bigint,
  read_count bigint,
  job_id uuid,
  idempotency_key text,
  destination text,
  destination_language text,
  intent text,
  constraints text,
  pipeline_version text,
  attempts integer
)
language plpgsql security definer set search_path = '' as $$
declare
  v_message pgmq.message_record;
  v_worker ctme_private.local_research_worker_jobs%rowtype;
  v_job public.local_research_jobs%rowtype;
  v_job_id_text text;
  v_archived boolean;
begin
  if p_limit is null or p_limit < 1 or p_limit > 5
    or p_visibility_seconds is null or p_visibility_seconds < 60 or p_visibility_seconds > 1800 then
    raise exception using errcode = '22023', message = 'invalid_research_worker_batch';
  end if;

  for v_message in select * from pgmq.read('local_language_research', p_visibility_seconds, p_limit)
  loop
    v_job_id_text := v_message.message ->> 'job_id';
    if v_job_id_text is null
      or v_job_id_text !~ '^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[1-5][0-9a-fA-F]{3}-[89abAB][0-9a-fA-F]{3}-[0-9a-fA-F]{12}$' then
      select pgmq.archive('local_language_research', v_message.msg_id) into v_archived;
      continue;
    end if;

    select * into v_worker
    from ctme_private.local_research_worker_jobs
    where job_id = v_job_id_text::uuid
      and idempotency_key = v_message.message ->> 'idempotency_key'
    for update;
    select * into v_job
    from public.local_research_jobs
    where id = v_job_id_text::uuid
    for update;

    if v_worker.id is null or v_job.id is null
      or v_worker.status in ('completed','failed')
      or v_job.status in ('completed','failed') then
      select pgmq.archive('local_language_research', v_message.msg_id) into v_archived;
      continue;
    end if;

    update ctme_private.local_research_worker_jobs
    set status = 'researching', attempts = attempts + 1, last_error = null, updated_at = now()
    where id = v_worker.id
    returning * into v_worker;
    update public.local_research_jobs
    set status = 'researching', failure_code = null, updated_at = now()
    where id = v_job.id
    returning * into v_job;

    message_id := v_message.msg_id;
    read_count := v_message.read_ct;
    job_id := v_job.id;
    idempotency_key := v_worker.idempotency_key;
    destination := v_job.destination;
    destination_language := v_job.destination_language;
    intent := v_job.intent;
    constraints := v_job.constraints;
    pipeline_version := v_job.pipeline_version;
    attempts := v_worker.attempts;
    return next;
  end loop;
end
$$;
revoke all on function public.claim_local_research_jobs(integer, integer) from public, anon, authenticated;
grant execute on function public.claim_local_research_jobs(integer, integer) to service_role;

create or replace function public.complete_local_research_job(
  p_message_id bigint,
  p_job_id uuid,
  p_idempotency_key text,
  p_source_count integer,
  p_candidates jsonb,
  p_provider_payloads jsonb default '[]'::jsonb
) returns boolean
language plpgsql security definer set search_path = '' as $$
declare
  v_worker ctme_private.local_research_worker_jobs%rowtype;
  v_candidate jsonb;
  v_count integer;
  v_archived boolean;
  v_rank integer := 0;
begin
  v_count := pg_catalog.jsonb_array_length(coalesce(p_candidates, '[]'::jsonb));
  if p_message_id is null or p_job_id is null or p_idempotency_key is null
    or p_source_count is null or p_source_count < 1 or p_source_count > 500
    or pg_catalog.jsonb_typeof(p_candidates) <> 'array' or v_count < 1 or v_count > 20
    or pg_catalog.jsonb_typeof(p_provider_payloads) <> 'array'
    or pg_catalog.octet_length(p_provider_payloads::text) > 1048576 then
    raise exception using errcode = '22023', message = 'invalid_research_completion';
  end if;

  select * into v_worker
  from ctme_private.local_research_worker_jobs
  where job_id = p_job_id and idempotency_key = p_idempotency_key and status = 'researching'
  for update;
  if not found then
    raise exception using errcode = '22023', message = 'research_job_mismatch';
  end if;

  delete from public.local_research_candidates where job_id = p_job_id;
  for v_candidate in select value from pg_catalog.jsonb_array_elements(p_candidates)
  loop
    v_rank := v_rank + 1;
    if coalesce(v_candidate ->> 'nameEn', '') = ''
      or coalesce(v_candidate ->> 'nameLocal', '') = ''
      or char_length(coalesce(v_candidate ->> 'recommendation', '')) not between 20 and 1200
      or coalesce(v_candidate ->> 'sourceUrl', '') !~ '^https://'
      or coalesce(v_candidate ->> 'sourceLanguage', '') !~ '^[a-z]{2}(?:-[A-Z]{2})?$'
      or coalesce(v_candidate ->> 'resolutionState', '') not in ('resolved','probable','unresolved') then
      raise exception using errcode = '22023', message = 'invalid_research_candidate';
    end if;

    insert into public.local_research_candidates(
      job_id, rank, name_en, name_local, recommendation, traveler_caveat,
      source_platform, source_language, source_url, source_title,
      source_published_at, source_retrieved_at, evidence_excerpt, native_query,
      evidence_confidence, resolution_state, place_id, map_evidence
    ) values (
      p_job_id,
      v_rank,
      v_candidate ->> 'nameEn',
      v_candidate ->> 'nameLocal',
      v_candidate ->> 'recommendation',
      nullif(v_candidate ->> 'travelerCaveat', ''),
      v_candidate ->> 'sourcePlatform',
      v_candidate ->> 'sourceLanguage',
      v_candidate ->> 'sourceUrl',
      nullif(v_candidate ->> 'sourceTitle', ''),
      nullif(v_candidate ->> 'sourcePublishedAt', '')::timestamptz,
      (v_candidate ->> 'sourceRetrievedAt')::timestamptz,
      v_candidate ->> 'evidenceExcerpt',
      v_candidate ->> 'nativeQuery',
      (v_candidate ->> 'evidenceConfidence')::numeric,
      (v_candidate ->> 'resolutionState')::public.resolution_state,
      nullif(v_candidate ->> 'placeId', '')::uuid,
      coalesce(v_candidate -> 'mapEvidence', '{}'::jsonb)
    );
  end loop;

  insert into ctme_private.local_research_provider_payloads(job_id, provider, payload)
  select p_job_id, coalesce(item.value ->> 'provider', 'unknown'), coalesce(item.value -> 'payload', '{}'::jsonb)
  from pg_catalog.jsonb_array_elements(p_provider_payloads) as item(value);

  update ctme_private.local_research_worker_jobs
  set status = 'completed', last_error = null, updated_at = now()
  where id = v_worker.id;
  update public.local_research_jobs
  set status = 'completed', source_count = p_source_count, candidate_count = v_count,
      failure_code = null, completed_at = now(), updated_at = now()
  where id = p_job_id;

  select pgmq.archive('local_language_research', p_message_id) into v_archived;
  if not coalesce(v_archived, false) then
    raise exception using errcode = '55000', message = 'research_queue_archive_failed';
  end if;
  return true;
end
$$;
revoke all on function public.complete_local_research_job(bigint, uuid, text, integer, jsonb, jsonb) from public, anon, authenticated;
grant execute on function public.complete_local_research_job(bigint, uuid, text, integer, jsonb, jsonb) to service_role;

create or replace function public.fail_local_research_job(
  p_message_id bigint,
  p_job_id uuid,
  p_idempotency_key text,
  p_error_code text,
  p_terminal boolean default false,
  p_retry_delay_seconds integer default 900
) returns boolean
language plpgsql security definer set search_path = '' as $$
declare
  v_worker_id uuid;
  v_archived boolean;
  v_updated_message_id bigint;
begin
  if p_message_id is null or p_job_id is null or p_idempotency_key is null
    or p_error_code !~ '^[a-z0-9_:-]{1,120}$'
    or p_retry_delay_seconds not between 60 and 86400 then
    raise exception using errcode = '22023', message = 'invalid_research_failure';
  end if;
  select id into v_worker_id
  from ctme_private.local_research_worker_jobs
  where job_id = p_job_id and idempotency_key = p_idempotency_key and status = 'researching'
  for update;
  if not found then
    raise exception using errcode = '22023', message = 'research_job_mismatch';
  end if;

  if p_terminal then
    update ctme_private.local_research_worker_jobs
    set status = 'failed', last_error = p_error_code, updated_at = now()
    where id = v_worker_id;
    update public.local_research_jobs
    set status = 'failed', failure_code = p_error_code, updated_at = now()
    where id = p_job_id;
    select pgmq.archive('local_language_research', p_message_id) into v_archived;
    if not coalesce(v_archived, false) then
      raise exception using errcode = '55000', message = 'research_queue_archive_failed';
    end if;
  else
    update ctme_private.local_research_worker_jobs
    set status = 'retryable', last_error = p_error_code, updated_at = now()
    where id = v_worker_id;
    update public.local_research_jobs
    set status = 'queued', failure_code = p_error_code, updated_at = now()
    where id = p_job_id;
    select q.msg_id into v_updated_message_id
    from pgmq.set_vt('local_language_research', p_message_id, p_retry_delay_seconds) as q;
    if v_updated_message_id is null then
      raise exception using errcode = '55000', message = 'research_queue_retry_failed';
    end if;
  end if;
  return true;
end
$$;
revoke all on function public.fail_local_research_job(bigint, uuid, text, text, boolean, integer) from public, anon, authenticated;
grant execute on function public.fail_local_research_job(bigint, uuid, text, text, boolean, integer) to service_role;

comment on table public.local_research_jobs is
  'User-owned requests for agent research in a destination language and source ecosystem.';
comment on table public.local_research_candidates is
  'Owner-only translated recommendations with original-language evidence and explicit map-resolution state.';
comment on table ctme_private.local_research_provider_payloads is
  'Unexposed raw retrieval payloads from web and authenticated local-platform adapters.';
