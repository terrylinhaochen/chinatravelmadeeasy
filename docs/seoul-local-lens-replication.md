# Seoul Local Lens replication

Date: 2026-07-15

Status: runnable exploratory replication; no participant results yet

Route: `/research/local-lens/seoul/`

## Why Seoul

The Shanghai study tests an English-speaking traveler borrowing from a Chinese-language information ecosystem. Seoul reverses the destination and provider assumptions while keeping the traveler-language relationship: an English-speaking traveler judges Korean-language local evidence that they would not normally retrieve.

This is a generalization test for the product mechanism, not a claim that Korean recommendations are more authentic or better.

## Source snapshot

The matched English search surfaced recognizable neighborhoods and destinations: Bukchon, Yeonnam-dong, Euljiro, Seongsu-dong, Seongbuk-dong, Mangwon Market, Naksan Park, and a Han River evening. The Korean public-web search surfaced more bounded or sequenced experiences: Hongjerak-gil into Baeksasil Valley, Seonyudo Park to Mangwon Market, Seoul Forest to Eungbongsan, a Maebongsan heritage sequence, Mangwoo History & Culture Park, Mullae's art-card walk, a Seongbuk-dong cultural-house route, and a usable segment of the Gyeongchun Line Forest.

The candidate-level coding is in [multilingual-discovery-seoul-2026-07-15.csv](./multilingual-discovery-seoul-2026-07-15.csv).

For this small purposive set:

| Measure | English traveler/community web | Korean citizen-reporter civic editorial |
| --- | ---: | ---: |
| Exact venue or bounded route/sequence | 4/8 | 7/8 |
| Map-ready enough to review | 4/8 | 7/8 |
| Concrete use, timing, access, or caveat | 3/8 | 8/8 |
| Semantically overlaps the other set | 3/8 | 3/8 |

These are hand-coded directional counts, not estimates of the English or Korean internet. The source-ecosystem difference is confounded with editorial format: the Korean treatment set comes from Seoul citizen-reporter articles, while the English baseline mixes travel editorial and one community thread.

## What the runnable study holds constant

- The source ecosystem is hidden until after every decision.
- Candidate order is deterministically randomized per local session.
- The same `add`, `replace`, `maybe`, and `not for me` rubric is used as Shanghai.
- Replacements require a named stop.
- The final counterfactual asks whether an idea would have entered without the second set.
- The result is device-local unless the participant downloads, copies, or prepares an email.

## Provider policy

Korea cannot inherit a China-specific AMap policy. The reveal uses Naver Map and KakaoMap as the local-provider searches, with Apple Maps as a traveler handoff.

Every treatment candidate currently remains preview-only:

- 7 `probable`
- 1 `unresolved`
- 0 `resolved`

A Seoul place may be marked `resolved` only after a persistent Naver place identity and persistent Kakao place identity agree on the reviewed address and coordinates. A search URL is not a verified identity. Routes remain routes and expose endpoint searches rather than fabricated midpoint pins.

## Limits

- Agent Reach's authenticated platform router was not installed, so this snapshot does not claim Naver Blog, Instagram, TikTok, or Korean community in-app rankings.
- The Korean sources are civic-local editorial, not a representative sample of resident opinion.
- The English and Korean sets are matched for broad trip intent, not perfectly matched place-for-place.
- Provider links have not received two-provider persistent-ID review.
- No traveler has completed this replication yet, so it demonstrates a test protocol rather than validates the hypothesis.

## Evidence gate

Run this replication with at least 10 active or recent Seoul planners before comparing it directionally with Shanghai. Do not combine the two studies into one headline rate. Report:

1. decision-change rate by study;
2. replacement rate by study;
3. counterfactual novelty among changed plans;
4. reasons, especially `route-ready` versus `map-uncertain`;
5. provider-review completion for candidates that participants choose.

The product wedge weakens if the Korean set earns curiosity but not itinerary time, or if a strong English guide performs as well with less map-resolution effort.

Analyze downloaded result files with:

```bash
npm run study:local-lens:analyze:seoul -- /private/path/to/results/*.json
```
