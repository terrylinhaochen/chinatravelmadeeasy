import { assertEquals, assertThrows } from "jsr:@std/assert@1";
import { nativeQueryGuidance, parseLocalResearchRequest } from "./localResearch.ts";

Deno.test("local research requests preserve traveler intent and destination language", () => {
  assertEquals(parseLocalResearchRequest({
    destination: " Shanghai ",
    destinationLanguage: "zh-CN",
    intent: " Quiet neighborhood walks with food stops ",
    constraints: "No transfers longer than 45 minutes",
  }), {
    destination: "Shanghai",
    destinationLanguage: "zh-CN",
    intent: "Quiet neighborhood walks with food stops",
    constraints: "No transfers longer than 45 minutes",
  });
  assertEquals(nativeQueryGuidance("zh-CN").includes("避雷"), true);
});

Deno.test("local research rejects invented language ecosystems and vague prompts", () => {
  assertThrows(() => parseLocalResearchRequest({ destination: "Shanghai", destinationLanguage: "en-US", intent: "food" }));
  assertThrows(() => parseLocalResearchRequest({ destination: "X", destinationLanguage: "zh-CN", intent: "some places" }));
});
