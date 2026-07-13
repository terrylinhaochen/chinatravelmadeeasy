create extension if not exists pgcrypto with schema extensions;
create extension if not exists pgmq;
create schema if not exists ctme_private;
revoke all on schema ctme_private from anon, authenticated;

create type public.video_platform as enum ('tiktok', 'instagram');
create type public.publication_state as enum ('queued', 'processing', 'published', 'rejected', 'removed');
create type public.resolution_state as enum ('resolved', 'probable', 'unresolved');
create type public.evidence_type as enum ('location_tag', 'address', 'caption', 'description', 'transcript', 'ocr', 'visual', 'editorial');
create type public.experience_verdict as enum ('worth_it', 'mixed', 'skip');

create table public.videos (
  id uuid primary key default gen_random_uuid(),
  platform public.video_platform not null,
  external_video_id text not null,
  canonical_url text not null,
  slug text unique,
  title text,
  creator_name text,
  city text,
  source_published_at timestamptz,
  metadata_checked_at timestamptz,
  metadata_cache_expires_at timestamptz,
  embed_state text not null default 'unknown' check (embed_state in ('unknown','embeddable','link_only','unavailable')),
  poster_url text,
  experience_label public.experience_verdict,
  summary text,
  publication_state public.publication_state not null default 'queued',
  extraction_version text,
  metadata_hash text,
  submit_count integer not null default 1 check (submit_count > 0),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (platform, external_video_id)
);

create table public.places (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  name_en text not null,
  name_zh text not null,
  city_en text not null,
  city_zh text,
  category text,
  editorial_status text not null default 'reviewed' check (editorial_status in ('reviewed','needs_review','removed')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.place_provider_matches (
  id uuid primary key default gen_random_uuid(),
  place_id uuid not null references public.places on delete cascade,
  provider text not null check (provider in ('amap','apple')),
  provider_place_id text not null,
  provider_name text,
  provider_address text,
  latitude double precision not null,
  longitude double precision not null,
  coordinate_system text not null,
  match_score numeric(4,3) not null check (match_score between 0 and 1),
  checked_at timestamptz not null default now(),
  stale_after timestamptz not null default now() + interval '30 days',
  unique (provider, provider_place_id)
);

create table public.video_place_mentions (
  id uuid primary key default gen_random_uuid(),
  video_id uuid not null references public.videos on delete cascade,
  place_id uuid references public.places on delete set null,
  mention_en text,
  mention_zh text,
  stated_city text,
  evidence_type public.evidence_type not null,
  evidence_text text not null,
  evidence_timestamp_seconds integer,
  confidence numeric(4,3) not null check (confidence between 0 and 1),
  resolution_state public.resolution_state not null,
  created_at timestamptz not null default now(),
  unique (video_id, place_id, evidence_type, evidence_timestamp_seconds)
);

create table public.video_metric_snapshots (
  id bigint generated always as identity primary key,
  video_id uuid not null references public.videos on delete cascade,
  captured_at timestamptz not null default now(),
  views bigint, likes bigint, comments bigint, shares bigint,
  source text not null default 'platform',
  check (coalesce(views, likes, comments, shares) is not null)
);

create table public.map_collections (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users on delete cascade,
  name text not null default 'My China map',
  local_migration_key text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (user_id, local_migration_key)
);

create table public.map_items (
  id uuid primary key default gen_random_uuid(),
  collection_id uuid not null references public.map_collections on delete cascade,
  place_id uuid not null references public.places on delete cascade,
  source_video_id uuid references public.videos on delete set null,
  created_at timestamptz not null default now(),
  unique (collection_id, place_id)
);

create table public.place_experiences (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users on delete cascade,
  place_id uuid not null references public.places on delete cascade,
  verdict public.experience_verdict not null,
  note text check (char_length(note) <= 280),
  visit_month date,
  season text,
  context_tags text[] not null default '{}',
  moderation_state text not null default 'published' check (moderation_state in ('published','held','removed')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.helpful_votes (
  user_id uuid not null references auth.users on delete cascade,
  experience_id uuid not null references public.place_experiences on delete cascade,
  helpful boolean not null,
  created_at timestamptz not null default now(),
  primary key (user_id, experience_id)
);

create table public.place_corrections (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users on delete cascade,
  place_id uuid references public.places on delete set null,
  video_mention_id uuid references public.video_place_mentions on delete set null,
  correction_type text not null,
  proposed_value jsonb not null,
  status text not null default 'open' check (status in ('open','accepted','rejected')),
  created_at timestamptz not null default now()
);

create table public.content_reports (
  id uuid primary key default gen_random_uuid(),
  reporter_user_id uuid references auth.users on delete set null,
  target_type text not null check (target_type in ('video','place','experience')),
  target_id uuid not null,
  reason text not null,
  detail text check (char_length(detail) <= 500),
  fingerprint_hash text,
  status text not null default 'open' check (status in ('open','reviewing','resolved','dismissed')),
  created_at timestamptz not null default now()
);

create table ctme_private.ingestion_jobs (
  id uuid primary key default gen_random_uuid(),
  video_id uuid not null references public.videos on delete cascade,
  idempotency_key text not null unique,
  status text not null default 'queued',
  attempts integer not null default 0,
  pipeline_version text not null,
  last_error text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create table ctme_private.provider_payloads (id bigint generated always as identity primary key, video_id uuid references public.videos on delete cascade, provider text not null, payload jsonb not null, fetched_at timestamptz not null default now());
create table ctme_private.rate_limit_counters (fingerprint_hash text not null, bucket_start timestamptz not null, bucket text not null, count integer not null default 1, primary key (fingerprint_hash, bucket_start, bucket));
create table ctme_private.moderation_decisions (id bigint generated always as identity primary key, video_id uuid references public.videos on delete cascade, decision text not null, checks jsonb not null, decided_at timestamptz not null default now());

select pgmq.create('video_ingestion');

create or replace function public.enqueue_video_ingestion(message jsonb) returns bigint
language sql security definer set search_path = '' as $$
  select pgmq.send('video_ingestion', message)
$$;
revoke all on function public.enqueue_video_ingestion(jsonb) from public, anon, authenticated;
grant execute on function public.enqueue_video_ingestion(jsonb) to service_role;

create index video_mentions_video_idx on public.video_place_mentions(video_id);
create index video_mentions_place_idx on public.video_place_mentions(place_id);
create index map_items_collection_idx on public.map_items(collection_id);
create index experiences_place_idx on public.place_experiences(place_id) where moderation_state = 'published';

alter table public.videos enable row level security;
alter table public.places enable row level security;
alter table public.place_provider_matches enable row level security;
alter table public.video_place_mentions enable row level security;
alter table public.video_metric_snapshots enable row level security;
alter table public.map_collections enable row level security;
alter table public.map_items enable row level security;
alter table public.place_experiences enable row level security;
alter table public.helpful_votes enable row level security;
alter table public.place_corrections enable row level security;
alter table public.content_reports enable row level security;

create policy videos_published_read on public.videos for select using (publication_state = 'published');
create policy places_public_read on public.places for select using (editorial_status = 'reviewed');
create policy provider_matches_public_read on public.place_provider_matches for select using (exists (select 1 from public.places p where p.id = place_id and p.editorial_status = 'reviewed'));
create policy mentions_published_read on public.video_place_mentions for select using (exists (select 1 from public.videos v where v.id = video_id and v.publication_state = 'published'));
create policy metrics_published_read on public.video_metric_snapshots for select using (exists (select 1 from public.videos v where v.id = video_id and v.publication_state = 'published'));
create policy collections_owner_all on public.map_collections for all to authenticated using (user_id = auth.uid()) with check (user_id = auth.uid());
create policy map_items_owner_all on public.map_items for all to authenticated using (exists (select 1 from public.map_collections c where c.id = collection_id and c.user_id = auth.uid())) with check (exists (select 1 from public.map_collections c where c.id = collection_id and c.user_id = auth.uid()));
create policy experiences_public_read on public.place_experiences for select using (moderation_state = 'published');
create policy experiences_owner_insert on public.place_experiences for insert to authenticated with check (user_id = auth.uid());
create policy experiences_owner_update on public.place_experiences for update to authenticated using (user_id = auth.uid()) with check (user_id = auth.uid());
create policy votes_owner_all on public.helpful_votes for all to authenticated using (user_id = auth.uid()) with check (user_id = auth.uid());
create policy corrections_owner_insert on public.place_corrections for insert to authenticated with check (user_id = auth.uid());
create policy corrections_owner_read on public.place_corrections for select to authenticated using (user_id = auth.uid());

create or replace function public.is_ctme_admin() returns boolean language sql stable security definer set search_path = '' as $$
  select coalesce((auth.jwt() -> 'app_metadata' ->> 'ctme_admin')::boolean, false)
$$;
revoke all on function public.is_ctme_admin() from public;
grant execute on function public.is_ctme_admin() to authenticated;
create policy reports_admin_read on public.content_reports for select to authenticated using ((select public.is_ctme_admin()));
create policy corrections_admin_update on public.place_corrections for update to authenticated using ((select public.is_ctme_admin()));

create or replace view public.published_video_cards with (security_invoker = true) as
select v.id, v.slug, v.platform, v.external_video_id, v.canonical_url, v.title, v.creator_name, v.city, v.poster_url, v.experience_label, v.summary, v.metadata_checked_at,
  count(m.id) filter (where m.resolution_state = 'resolved')::integer as resolved_place_count,
  coalesce((select count(*) from public.map_items mi where mi.source_video_id = v.id), 0)::integer as ctme_save_count
from public.videos v left join public.video_place_mentions m on m.video_id = v.id
where v.publication_state = 'published' group by v.id;

create or replace view public.place_community_aggregates with (security_invoker = true) as
select p.id, p.slug, p.name_en, p.name_zh, p.city_en, p.city_zh, p.category,
  count(e.id) filter (where e.moderation_state = 'published')::integer as went_count,
  count(e.id) filter (where e.verdict = 'worth_it' and e.moderation_state = 'published')::integer as worth_it_count,
  count(e.id) filter (where e.verdict = 'mixed' and e.moderation_state = 'published')::integer as mixed_count,
  count(e.id) filter (where e.verdict = 'skip' and e.moderation_state = 'published')::integer as skip_count
from public.places p left join public.place_experiences e on e.place_id = p.id
where p.editorial_status = 'reviewed' group by p.id;

revoke all on all tables in schema public from anon, authenticated;
grant select on public.videos, public.places, public.place_provider_matches, public.video_place_mentions, public.video_metric_snapshots, public.place_experiences, public.published_video_cards, public.place_community_aggregates to anon, authenticated;
grant select, insert, update, delete on public.map_collections, public.map_items, public.helpful_votes to authenticated;
grant select, insert, update on public.place_experiences to authenticated;
grant select, insert on public.place_corrections to authenticated;
grant select on public.content_reports to authenticated;

comment on schema ctme_private is 'Never exposed through the Data API. Raw provider payloads, queues, rate limits, and moderation only.';
comment on table public.video_metric_snapshots is 'Dated source-platform metrics. No platform dislikes are modeled because major platforms do not expose reliable dislike counts.';
