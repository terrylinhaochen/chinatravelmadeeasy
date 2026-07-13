drop policy if exists reports_admin_read on public.content_reports;
drop policy if exists corrections_admin_update on public.place_corrections;
drop function if exists public.is_ctme_admin();

create or replace function ctme_private.is_ctme_admin() returns boolean
language sql stable security definer set search_path = '' as $$
  select coalesce((auth.jwt() -> 'app_metadata' ->> 'ctme_admin')::boolean, false)
$$;
revoke all on function ctme_private.is_ctme_admin() from public, anon;
grant usage on schema ctme_private to authenticated;
grant execute on function ctme_private.is_ctme_admin() to authenticated;

create policy reports_admin_read on public.content_reports for select to authenticated using ((select ctme_private.is_ctme_admin()));
create policy corrections_admin_update on public.place_corrections for update to authenticated using ((select ctme_private.is_ctme_admin()));

drop policy collections_owner_all on public.map_collections;
create policy collections_owner_all on public.map_collections for all to authenticated using (user_id = (select auth.uid())) with check (user_id = (select auth.uid()));
drop policy map_items_owner_all on public.map_items;
create policy map_items_owner_all on public.map_items for all to authenticated using (exists (select 1 from public.map_collections c where c.id = collection_id and c.user_id = (select auth.uid()))) with check (exists (select 1 from public.map_collections c where c.id = collection_id and c.user_id = (select auth.uid())));
drop policy experiences_owner_insert on public.place_experiences;
create policy experiences_owner_insert on public.place_experiences for insert to authenticated with check (user_id = (select auth.uid()));
drop policy experiences_owner_update on public.place_experiences;
create policy experiences_owner_update on public.place_experiences for update to authenticated using (user_id = (select auth.uid())) with check (user_id = (select auth.uid()));
drop policy votes_owner_all on public.helpful_votes;
create policy votes_owner_all on public.helpful_votes for all to authenticated using (user_id = (select auth.uid())) with check (user_id = (select auth.uid()));
drop policy corrections_owner_insert on public.place_corrections;
create policy corrections_owner_insert on public.place_corrections for insert to authenticated with check (user_id = (select auth.uid()));
drop policy corrections_owner_read on public.place_corrections;
create policy corrections_owner_read on public.place_corrections for select to authenticated using (user_id = (select auth.uid()));

create index if not exists provider_matches_place_idx on public.place_provider_matches(place_id);
create index if not exists metrics_video_idx on public.video_metric_snapshots(video_id);
create index if not exists map_items_place_idx on public.map_items(place_id);
create index if not exists map_items_source_video_idx on public.map_items(source_video_id) where source_video_id is not null;
create index if not exists experiences_user_idx on public.place_experiences(user_id);
create index if not exists helpful_votes_experience_idx on public.helpful_votes(experience_id);
create index if not exists corrections_user_idx on public.place_corrections(user_id);
create index if not exists corrections_place_idx on public.place_corrections(place_id) where place_id is not null;
create index if not exists corrections_mention_idx on public.place_corrections(video_mention_id) where video_mention_id is not null;
create index if not exists reports_reporter_idx on public.content_reports(reporter_user_id) where reporter_user_id is not null;
create index if not exists ingestion_jobs_video_idx on ctme_private.ingestion_jobs(video_id);
create index if not exists provider_payloads_video_idx on ctme_private.provider_payloads(video_id);
create index if not exists moderation_video_idx on ctme_private.moderation_decisions(video_id);
