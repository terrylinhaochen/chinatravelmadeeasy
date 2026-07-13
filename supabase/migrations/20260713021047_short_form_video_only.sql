alter table public.videos
  add constraint videos_short_form_platform_only
  check (platform in ('tiktok'::public.video_platform, 'instagram'::public.video_platform));

comment on constraint videos_short_form_platform_only on public.videos is
  'CTME accepts only TikTok and Instagram short-form video. YouTube is intentionally excluded.';
