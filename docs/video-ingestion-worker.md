# Official video metadata worker

`process-video-jobs` is the first server-side stage after `submit-video`. It handles TikTok and Instagram short-form links only; YouTube and uploaded video files are intentionally outside the contract.

## State boundary

```text
queued -> processing -> metadata_ready
                    \-> retryable
                    \-> failed
```

`metadata_ready` is an internal ingestion-job state. The public video remains `processing`, exposes no place evidence, and cannot appear in published cards. Evidence extraction, China relevance, moderation, bilingual POI resolution, and the publication gate remain separate work.

The worker:

1. claims at most five messages through a service-role-only RPC;
2. fetches official provider metadata without downloading or rehosting media;
3. stores the raw provider response in `ctme_private` and the normalized title, creator, poster, embed state, cache expiry, and metadata hash on `public.videos`;
4. archives the queue message only after the database completion transaction succeeds;
5. moves temporary provider failures back to a delayed retry and archives terminal unavailable-source failures.

## Required secrets

- `SUPABASE_URL`
- `SUPABASE_SERVICE_ROLE_KEY`
- `VIDEO_INGESTION_WORKER_SECRET` for a dedicated cron/manual invocation secret; the service-role bearer is also accepted for controlled server-side invocation
- `INSTAGRAM_OEMBED_ENDPOINT` pointing to the approved `https://graph.facebook.com/.../instagram_oembed` version used by the project
- `INSTAGRAM_OEMBED_ACCESS_TOKEN`

Do not expose any of these values in Astro `PUBLIC_*` variables. TikTok oEmbed does not currently require a token. The submitted TikTok creator path is preserved because the fabricated `@i/video/{id}` form is rejected by the official endpoint.

## Invoke and verify

After applying migrations and deploying the function to the dedicated CTME Supabase project:

```sh
curl -X POST \
  -H "x-worker-secret: $VIDEO_INGESTION_WORKER_SECRET" \
  -H "content-type: application/json" \
  -d '{"batchSize":3}' \
  "$SUPABASE_URL/functions/v1/process-video-jobs"
```

Schedule the same call with Supabase Cron only after the database suite passes. The response reports claimed, metadata-ready, retryable, and failed counts without returning raw provider payloads or secrets.

Required release evidence:

1. `supabase db reset` applies every migration;
2. `supabase test db` passes all role and queue assertions;
3. `npm run test:supabase-functions` passes helper tests and all seven type checks;
4. one real TikTok submission reaches `metadata_ready` and remains unpublished;
5. one Instagram submission either reaches `metadata_ready` with approved credentials or reports the explicit retryable credential state;
6. security and performance advisors are clean enough to release.

Queue behavior follows Supabase’s [Edge Function consumer guidance](https://supabase.com/docs/guides/queues/consuming-messages-with-edge-functions) and [Queues API](https://supabase.com/docs/guides/queues/api). Cron scheduling is documented in [Supabase Cron](https://supabase.com/docs/guides/cron).
