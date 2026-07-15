import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const root = new URL("../", import.meta.url);
const read = (path) => readFile(new URL(path, root), "utf8");

test("private operational schema stays outside the Data API", async () => {
  const config = await read("supabase/config.toml");
  const edgeFiles = await Promise.all([
    "submit-video",
    "video-status",
    "process-video-jobs",
    "submit-local-research",
    "local-research-status",
    "save-map-items",
    "place-experience",
    "place-correction",
    "report-content",
  ].map((name) => read(`supabase/functions/${name}/index.ts`)));

  assert.match(config, /schemas\s*=\s*\["public",\s*"graphql_public"\]/);
  assert.doesNotMatch(config, /schemas\s*=\s*\[[^\]]*ctme_private/);
  for (const source of edgeFiles) assert.doesNotMatch(source, /\.schema\(["']ctme_private["']\)/);
});

test("local-language research is an owner-only queued agent workflow", async () => {
  const submit = await read("supabase/functions/submit-local-research/index.ts");
  const status = await read("supabase/functions/local-research-status/index.ts");
  const migration = await read("supabase/migrations/20260715155655_local_language_research_jobs.sql");

  assert.match(submit, /requireUser\(req\)/);
  assert.match(submit, /rpc\("register_local_research_job"/);
  assert.match(status, /from\("local_research_jobs"\)/);
  assert.match(status, /job\.status !== "completed"[\s\S]+candidates: \[\]/);
  assert.match(migration, /pgmq\.create\('local_language_research'\)/);
  assert.match(migration, /alter table public\.local_research_jobs enable row level security/);
  assert.match(migration, /local_research_jobs_owner_read[\s\S]+auth\.uid\(\)/);
  assert.match(migration, /local_research_candidates_owner_read[\s\S]+auth\.uid\(\)/);
  assert.match(migration, /create table ctme_private\.local_research_provider_payloads/);
  assert.doesNotMatch(submit, /xiaohongshu|dianping/i);
  for (const fn of ["register_local_research_job", "claim_local_research_jobs", "complete_local_research_job", "fail_local_research_job"]) {
    assert.match(migration, new RegExp(`revoke all on function public\\.${fn}[^;]+from public, anon, authenticated;`, "s"));
    assert.match(migration, new RegExp(`grant execute on function public\\.${fn}[^;]+to service_role;`, "s"));
  }
});

test("video submission uses atomic service-only RPCs", async () => {
  const submit = await read("supabase/functions/submit-video/index.ts");
  const migration = await read("supabase/migrations/20260713072317_backend_contract_hardening.sql");

  assert.match(submit, /rpc\("consume_submission_rate_limit"/);
  assert.match(submit, /rpc\("register_video_submission"/);
  assert.match(migration, /create or replace function public\.register_video_submission/);
  assert.match(migration, /pg_advisory_xact_lock/);
  assert.match(migration, /insert into ctme_private\.ingestion_jobs/);
  assert.match(migration, /perform pgmq\.send/);
  assert.match(migration, /grant execute on function public\.register_video_submission[^;]+to service_role;/s);
  assert.match(migration, /revoke all on function public\.register_video_submission[^;]+from public, anon, authenticated;/s);
});

test("unpublished extraction evidence is not returned by video status", async () => {
  const status = await read("supabase/functions/video-status/index.ts");
  assert.match(status, /publication_state !== "published"[\s\S]+?places: \[\]/);
  assert.match(status, /\.eq\("resolution_state", "resolved"\)/);
});

test("official metadata worker consumes the private queue through service-only RPCs", async () => {
  const worker = await read("supabase/functions/process-video-jobs/index.ts");
  const adapter = await read("supabase/functions/_shared/videoMetadata.ts");
  const migration = await read("supabase/migrations/20260715055019_video_ingestion_worker.sql");

  assert.match(worker, /rpc\("claim_video_ingestion_jobs"/);
  assert.match(worker, /fetchOfficialMetadata/);
  assert.match(worker, /rpc\("complete_video_metadata_stage"/);
  assert.match(worker, /rpc\("fail_video_ingestion_job"/);
  assert.match(adapter, /https:\/\/www\.tiktok\.com\/oembed/);
  assert.doesNotMatch(adapter, /youtube/i);
  assert.doesNotMatch(worker, /publication_state[^\n]+published/);
  for (const fn of ["claim_video_ingestion_jobs", "complete_video_metadata_stage", "fail_video_ingestion_job", "get_video_processing_status"]) {
    assert.match(migration, new RegExp(`revoke all on function public\\.${fn}[^;]+from public, anon, authenticated;`, "s"));
    assert.match(migration, new RegExp(`grant execute on function public\\.${fn}[^;]+to service_role;`, "s"));
  }
  assert.match(migration, /set publication_state = 'processing'/);
  assert.doesNotMatch(migration, /set publication_state = 'published'/);
  assert.match(migration, /pgmq\.create\('place_reresolution'\)/);
  assert.match(migration, /pgmq\.send\(\s*'place_reresolution'/s);
});

test("TikTok canonical identity remains usable by the official oEmbed adapter", async () => {
  const shared = await read("supabase/functions/_shared/ctme.ts");
  const pipeline = await read("pipeline/video_ingestion_contract.mjs");
  assert.doesNotMatch(shared, /@i\/video/);
  assert.doesNotMatch(pipeline, /@i\/video/);
  assert.match(shared, /url\.pathname\.replace/);
});

test("public feedback surface omits identity and idempotency fields", async () => {
  const migration = await read("supabase/migrations/20260713072317_backend_contract_hardening.sql");
  const view = migration.match(/create or replace view public\.published_place_experiences[\s\S]+?where moderation_state = 'published';/)?.[0] ?? "";

  assert.ok(view);
  assert.doesNotMatch(view, /user_id/);
  assert.doesNotMatch(view, /client_request_id/);
  assert.match(migration, /revoke all on public\.place_experiences from anon, authenticated;/);
  assert.match(migration, /drop policy if exists experiences_owner_insert/);
});
