import { assertEquals, assertMatch, assertRejects } from "jsr:@std/assert@1";
import { buildOfficialMetadataUrl, fetchOfficialMetadata, MetadataAdapterError } from "./videoMetadata.ts";

const tiktokJob = {
  platform: "tiktok" as const,
  canonical_url: "https://www.tiktok.com/@traveler/video/7412345678901234567",
};

Deno.test("TikTok metadata requests preserve the creator path required by oEmbed", () => {
  const url = buildOfficialMetadataUrl(tiktokJob);
  assertEquals(url.origin + url.pathname, "https://www.tiktok.com/oembed");
  assertEquals(url.searchParams.get("url"), tiktokJob.canonical_url);
});

Deno.test("official TikTok metadata is normalized without publishing or resolving a place", async () => {
  const metadata = await fetchOfficialMetadata(
    tiktokJob,
    {},
    async () => new Response(JSON.stringify({
      title: "A precise China field note",
      author_name: "Traveler",
      thumbnail_url: "https://p16.example.test/poster.jpg",
      html: "<blockquote></blockquote>",
      cache_age: 7200,
    }), { status: 200, headers: { "content-type": "application/json" } }),
    new Date("2026-07-15T00:00:00.000Z"),
  );
  assertEquals(metadata.provider, "tiktok_oembed");
  assertEquals(metadata.embedState, "embeddable");
  assertEquals(metadata.cacheExpiresAt, "2026-07-15T02:00:00.000Z");
  assertMatch(metadata.metadataHash, /^[0-9a-f]{64}$/);
});

Deno.test("Instagram remains retryable until approved oEmbed credentials are configured", async () => {
  const error = await assertRejects(
    () => fetchOfficialMetadata({ platform: "instagram", canonical_url: "https://www.instagram.com/reel/ABC_123/" }),
    MetadataAdapterError,
    "provider_credentials_missing",
  );
  assertEquals(error.terminal, false);
  assertEquals(error.retryAfterSeconds, 3600);
});

Deno.test("deleted official sources fail terminally while provider outages retry", async () => {
  const deleted = await assertRejects(
    () => fetchOfficialMetadata(tiktokJob, {}, async () => new Response("", { status: 404 })),
    MetadataAdapterError,
    "source_unavailable",
  );
  const outage = await assertRejects(
    () => fetchOfficialMetadata(tiktokJob, {}, async () => new Response("", { status: 503 })),
    MetadataAdapterError,
    "provider_temporarily_unavailable",
  );
  assertEquals(deleted.terminal, true);
  assertEquals(outage.terminal, false);
});
