# Video-to-map release benchmark

The production adapter is intentionally limited to official metadata and native embeds until this gate passes. A passing product build does **not** mean the extraction benchmark has passed.

## Labeled set

- 60 manually reviewed public links: 30 TikTok and 30 Instagram Reels.
- Include multi-place lists, chains, ambiguous branches, missing cities, bilingual names, promotional posts, negative experiences, and disabled embeds.
- Store only source URLs, labels, short evidence excerpts, provider identities, and expected outcomes. Do not download or rehost third-party media.
- The TikTok seed videos in `src/data/communityVideos.ts` are product fixtures, not the complete benchmark. The three Hong Kong fixtures deliberately cover a resolved venue, a missing restaurant branch, and archival footage that differs from the modern destination.

## Promotion gate

| Measure | Required |
| --- | ---: |
| Precision for published POI mentions | >= 95% |
| Recall across labeled mentions | >= 80% |
| Correct branch and provider identity | >= 90% |
| Falsely auto-published resolved POIs | < 2% |
| Supported-link success for experimental adapter | >= 90% |
| Experimental recall improvement | >= 10 percentage points |

The experimental multimodal adapter also requires a written platform and copyright review. A lower-priority OCR or visual inference can never override an explicit location tag, address, caption, or description.

## Current status

**Blocked from promotion:** the 60-link labeled set, AMap credentials, Apple Maps Server credentials, Turnstile keys, a deployed and scheduled dedicated Supabase project, approved Instagram credentials, and retrieval-policy approval are not yet present. The official metadata worker now exists for TikTok and configurable Instagram oEmbed, but it intentionally stops at `metadata_ready`; it does not extract or publish places. The deterministic contract tests cover URL deduplication, evidence precedence, resolution thresholds, publication gating, short-form-only production URL parsing, adapter failure classes, and queue state boundaries; they do not substitute for the benchmark. All seven Edge Function entrypoints type-check, but the migrations, RLS roles, queue, and functions still have not been exercised together because the local Docker server was unavailable during the July 14–15 dogfood pass.
