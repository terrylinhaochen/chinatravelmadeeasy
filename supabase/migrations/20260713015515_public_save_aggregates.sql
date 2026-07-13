create table public.video_save_counts (
  video_id uuid primary key references public.videos on delete cascade,
  save_count bigint not null default 0 check (save_count >= 0),
  updated_at timestamptz not null default now()
);
alter table public.video_save_counts enable row level security;
create policy video_save_counts_public_read on public.video_save_counts for select using (exists (select 1 from public.videos v where v.id = video_id and v.publication_state = 'published'));

create or replace function ctme_private.update_video_save_count() returns trigger
language plpgsql security definer set search_path = '' as $$
begin
  if tg_op = 'INSERT' and new.source_video_id is not null then
    insert into public.video_save_counts(video_id, save_count) values (new.source_video_id, 1)
    on conflict (video_id) do update set save_count = public.video_save_counts.save_count + 1, updated_at = now();
  elsif tg_op = 'DELETE' and old.source_video_id is not null then
    update public.video_save_counts set save_count = greatest(0, save_count - 1), updated_at = now() where video_id = old.source_video_id;
  end if;
  return coalesce(new, old);
end
$$;
revoke all on function ctme_private.update_video_save_count() from public, anon, authenticated;
create trigger map_items_video_save_count after insert or delete on public.map_items for each row execute function ctme_private.update_video_save_count();

create or replace view public.published_video_cards with (security_invoker = true) as
select v.id, v.slug, v.platform, v.external_video_id, v.canonical_url, v.title, v.creator_name, v.city, v.poster_url, v.experience_label, v.summary, v.metadata_checked_at,
  count(m.id) filter (where m.resolution_state = 'resolved')::integer as resolved_place_count,
  coalesce(sc.save_count, 0)::integer as ctme_save_count
from public.videos v
left join public.video_place_mentions m on m.video_id = v.id
left join public.video_save_counts sc on sc.video_id = v.id
where v.publication_state = 'published'
group by v.id, sc.save_count;

revoke all on public.video_save_counts from anon, authenticated;
grant select on public.video_save_counts, public.published_video_cards to anon, authenticated;
