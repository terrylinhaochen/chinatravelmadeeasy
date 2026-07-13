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
    "save-map-items",
    "place-experience",
    "place-correction",
    "report-content",
  ].map((name) => read(`supabase/functions/${name}/index.ts`)));

  assert.match(config, /schemas\s*=\s*\["public",\s*"graphql_public"\]/);
  assert.doesNotMatch(config, /schemas\s*=\s*\[[^\]]*ctme_private/);
  for (const source of edgeFiles) assert.doesNotMatch(source, /\.schema\(["']ctme_private["']\)/);
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
  assert.match(status, /publication_state !== "published"[^;]+places: \[\]/s);
  assert.match(status, /\.eq\("resolution_state", "resolved"\)/);
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
