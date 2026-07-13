import { assertEquals, assertThrows } from "jsr:@std/assert@1";
import { isUuid, parseVideoUrl } from "./ctme.ts";

Deno.test("the production parser accepts TikTok and Instagram short-form URLs only", () => {
  assertEquals(
    parseVideoUrl("https://www.tiktok.com/@traveler/video/7412345678901234567").platform,
    "tiktok",
  );
  assertEquals(
    parseVideoUrl("https://www.instagram.com/reel/ABC_123/").canonicalUrl,
    "https://www.instagram.com/reel/ABC_123/",
  );
  assertThrows(
    () => parseVideoUrl("https://www.youtube.com/watch?v=4OJcNbiixEQ"),
    Error,
    "unsupported_host",
  );
});

Deno.test("feedback idempotency keys require a real UUID", () => {
  assertEquals(isUuid("7d3605f2-70df-42f9-93be-2e61faf282df"), true);
  assertEquals(isUuid("correction-1"), false);
  assertEquals(isUuid(""), false);
});
