# Multilingual local-knowledge experiment

Date: 2026-07-14

Destination slice: Shanghai

Status: exploratory evidence; not yet a causal user test

## Decision

China Travel Made Easy should lead with access to local information ecosystems, not with saving pins.

The working promise is:

> See the city locals see. Discover places from local-language sources, understand why they matter, and open the correct place in a map you can use.

The Shanghai comparison supports the wedge, but with an important correction: **changing the query language alone is not the product**. The larger difference came from changing the source ecosystem. A translated generic web search can still return the same international SEO layer. The useful product work is retrieving from local-language sources, preserving their evidence, and resolving their place identities.

## What was tested

The matched intent was: places worth visiting beyond the major attractions, including neighborhoods and food recommended by locals.

Queries:

- English: `Shanghai places worth visiting beyond major attractions neighborhoods food recommended by locals`
- Chinese: `上海 值得去的地方 避开热门景点 本地人 推荐 街区 美食`
- Korean: `상하이 유명 관광지 말고 현지인 추천 동네 맛집 가볼 곳`

The test used two layers:

1. **Matched-language search:** run the same intent in each language and inspect the ranked web results.
2. **Ecosystem follow-through:** inspect accessible sources native to or bridging into the destination's local ecosystem. For this snapshot those were Chinese official tourism routes, Shanghai BendiBao, Dianping-indexed material, and Korean travel writing that cites or imports Dianping, Xiaohongshu, and local-resident knowledge.

The candidate-level evidence is recorded in [multilingual-discovery-shanghai-2026-07-14.csv](./multilingual-discovery-shanghai-2026-07-14.csv).

## Rubric

“Authentic” is too vague to score. Every candidate is instead evaluated on:

- **Provenance:** traveler SEO, first-person community evidence, local platform, local publication, or official local source.
- **Specificity:** unnamed category, district, street, exact street segment, route, venue, or branch.
- **Map readiness:** `0` cannot be safely saved; `1` recognizable but missing a local alias, endpoint, or branch; `2` has enough local identity to resolve and review.
- **Context depth:** `0` name only; `1` generic reason; `2` a concrete reason, use, timing, route role, or caveat.
- **Novelty:** whether the candidate changes the English baseline rather than merely translating it.
- **Decision potential:** whether it could add, replace, or remove a stop from a real itinerary.
- **Freshness and status:** when the source was checked and whether the place is still open and accessible.

Publication requires evidence and a correct provider identity. Novelty never overrides an explicit address, closure status, branch ambiguity, or a weak match.

## Snapshot results

### Search-language effect

The English query returned a clean but repetitive result set. Its first page was dominated by travel SEO pages using similar “beyond the Bund,” “authentic,” and “locals' favorites” framing. The recommendations were often districts or categories rather than exact places: Changning, Jing'an, Huangpu, local teahouses, wet markets, or unnamed dumpling shops. The English community results were more specific than the SEO results, surfacing Zhujiajiao, the Dianshan Lake cycling loop, Xisha Wetland Park, and West Bund.

The generic Chinese query did **not** automatically unlock local knowledge. It still returned international travel pages, translated content, and generic “hidden gem” articles. Targeting Chinese-local sources changed the output much more: [Shanghai BendiBao's 40 street list](https://sh.bendibao.com/tour/20231120/279779.shtm) gives walkable street segments, while the [Shanghai municipal Yangpu river route](https://www.meet-in-shanghai.net/cn/news/in-yangpu-riverside-feel-the-warmth-of-the-peoples-city-a-great-place-to-visit-on-your-doorstep-the-citywalk-line-034188/) sequences micro-POIs such as Green Hill, Soap Dream Space, the Yangshupu Power Plant Relic Park, and Fuxing Island Park.

The Korean matched query was the noisiest in this search snapshot. It returned fewer relevant Shanghai results and more wrong-city collisions. The relevant Korean sources were nevertheless unusually useful bridges. [Triple's local-hotspot guide](https://triple.guide/articles/74e6e787-8383-400c-bd5c-2c6cdac73ec3) surfaces current venues partly through Xiaohongshu and Instagram evidence, while a [Korean Shanghai resident's City Walk guide](https://blsg.tistory.com/79) explicitly imports Dianping routes and preserves several Chinese names.

### Candidate-set effect

For the 10-candidate exploratory sets in the CSV:

| Measure | English traveler web | Chinese local-language web | Korean bridge-language web |
| --- | ---: | ---: | ---: |
| Exact venue, attraction, or grounded route/segment | 4/10 | 9/10 | 9/10 |
| Fully map-ready before provider verification | 3/10 | 9/10 | 3/10 |
| Concrete context rather than a generic “local” claim | 5/10 | 9/10 | 10/10 |
| Semantically overlaps the English set | baseline | 0/10 | 3/10 |

These counts are hand-coded from a small purposive sample, so they are directional rather than population estimates. They show two product-relevant effects:

1. **Discovery changes:** 17 of the 20 Chinese and Korean candidates were not represented in the English set.
2. **Handoff remains broken:** Korean sources can surface specific current venues yet still omit the Chinese listing identity needed to find the correct AMap POI. Translation reveals the idea; entity resolution makes it usable.

The most important result is therefore not “Chinese recommendations are better.” It is that the source ecosystems produce materially different candidate sets and different kinds of evidence. The product earns its place by making those differences legible and actionable.

## Product experiment

Build a **Local Lens** test for Shanghai before broadening the destination catalog.

The first runnable version is available at `/research/local-lens/shanghai/`. It deliberately hides source-language and ecosystem labels during selection, randomizes candidate order per local session, requires a decision on all ten treatment candidates, records `add`, `replace`, `maybe`, and `not for me` separately, and reveals original names and provenance only after the choice. The final form now captures the counterfactual promised by this protocol. Results stay on the participant's device and can be downloaded as structured JSON, copied, or prepared as an email; no response is transmitted without a participant action. Use the [pilot runbook](./local-lens-pilot-runbook.md) to recruit, moderate, collect, and analyze responses without changing the study version mid-pilot.

### Experience

1. Ask a traveler for trip dates, neighborhood base, interests, constraints, and a rough existing itinerary.
2. Show 10 conventional English-web candidates with source labels hidden. Ask the traveler to keep up to five.
3. Show 10 reviewed local-language candidates, translated and explained, again with source labels hidden. Ask the traveler to keep up to five and mark each as `add`, `replace an existing stop`, `maybe`, or `not for me`.
4. Reveal the original-language evidence, source ecosystem, local name, freshness, and map-match confidence.
5. Let the traveler open the AMap or Apple Maps identity and place kept candidates into a day or neighborhood cluster.
6. Ask one final counterfactual: “Without the local-language set, would this place have entered your trip?”

Do not label the treatment “authentic,” “hidden,” or “local favorite” during selection. Those labels create demand effects. Let the recommendation and its evidence stand on their own.

### Pilot sample

- Recruit 20 to 30 people actively planning Shanghai or recently returned from it.
- Balance first-time and repeat visitors.
- Include travelers with food, culture, family, nightlife, accessibility, and low-planning-effort intents.
- Run the same candidate pool first, then repeat with a personalized pool once the baseline is understood.

This is a directional need-finding pilot, not a statistically powered A/B test. If it produces a strong signal, test the experience on at least 200 destination-planning sessions with randomized ordering.

### Primary metric

**Decision-change rate:** the share of travelers who add or replace at least one itinerary stop because of the reviewed local-language set.

Supporting metrics:

- incremental kept places per traveler;
- replacement rate, not just additive saves;
- correct-provider handoff rate;
- “would not have found this otherwise” response;
- evidence-open rate before save;
- place-match corrections per 100 candidates;
- later map reopen and visited-place confirmation;
- time from discovery to a usable day plan.

### Falsification criteria

Reconsider the wedge if, after controlling for category and distance:

- fewer than 15% of pilot participants change a stop;
- treatment candidates are saved but not reopened or placed into a day;
- novelty comes mostly from impractical distance, closed venues, or promotional sources;
- correct POI/branch resolution falls below 90%;
- source-language provenance does not increase trust once recommendation quality is held constant;
- travelers prefer a strong editorial English guide just as often and with less effort.

## Short-term community supply

Until authenticated local-platform retrieval is available, collect evidence rather than asking for generic recommendations.

The first runnable intake lives at `/map-import/#contribute`, inside the same Add Places workflow travelers already use. It preserves the original source, language, place-versus-route shape, local name, decision-changing reason, optional map link, and sharing consent, then produces a reviewer-ready JSON or email packet. It does not auto-publish or transmit in the background. Use the [contribution runbook](./local-knowledge-contribution-runbook.md) for the record contract, reviewer aggregation command, and initial 20-submission gate.

Accepted submissions:

- a public Xiaohongshu, Dianping, Instagram, or TikTok link;
- pasted caption or screenshot OCR text;
- a local map share link;
- an original-language place name plus why it was recommended.

The review flow should be:

`submitted evidence → language and city detection → candidate place mentions → translation with original preserved → local-provider lookup → alias/branch/address comparison → human review → published place card`

Every published recommendation needs:

- original wording and source;
- translated meaning, not just literal text;
- the concrete reason it belongs in a trip;
- original and English place names;
- source and checked dates;
- AMap identity for mainland China and Apple Maps handoff when available;
- separate retrieval, translation, and place-match confidence;
- correction and takedown paths.

Reward submitters for **resolved, useful evidence**, not submission volume or likes. Duplicate submissions should strengthen provenance on an existing place rather than create duplicate cards.

## What multilingual LLM research changes

The model should transform and explain retrieved evidence; it should not invent the local discovery layer.

| Research finding | Product implication |
| --- | --- |
| [MIRACL](https://arxiv.org/abs/2210.09984) required native-speaker relevance judgments across 18 languages, underscoring that multilingual retrieval must be evaluated per language rather than assumed from English performance. | Maintain language-specific retrieval test sets and judge Chinese and Korean results with native or expert reviewers. |
| [MMTEB](https://arxiv.org/abs/2502.13595) covers more than 500 tasks and 250 languages and finds that model quality varies by task and language subset. | Choose embeddings using travel-entity retrieval tests in the target languages, not a single aggregate leaderboard score. |
| [Do Multilingual Language Models Think Better in English?](https://aclanthology.org/2024.naacl-short.46/) finds that self-translation improved performance across five tasks. | It can be useful to reason over an English translation, but original-language evidence must remain authoritative for names, addresses, and claims. |
| [CulturalBench](https://aclanthology.org/2025.acl-long.1247/) reports a large gap between human and model cultural knowledge and sensitivity to question format. | Do not use an LLM's latent “local knowledge” as source evidence. Retrieve first and make provenance visible. |
| [GlobalOpinionQA](https://www.anthropic.com/research/towards-measuring-the-representation-of-subjective-global-opinions-in-language-models) finds that translating a question does not necessarily make a model's answer resemble the opinions of that language community. | Language switching is not a substitute for accessing the community's actual content. |
| [Do Large Language Models Have an English Accent?](https://aclanthology.org/2025.acl-long.193/) finds English-influenced lexical and syntactic patterns in Chinese and French outputs. | Review user-facing translations for naturalness and explain local concepts rather than flattening them into traveler clichés. |

### Recommended pipeline

1. Generate several **native-intent queries** per ecosystem. A literal translation of “hidden gems” is not enough; query forms should reflect local behaviors such as City Walk, weekend routes, seasonal outings, queues, closures, or branch choice.
2. Retrieve within each source ecosystem before cross-lingual merging.
3. Extract place claims with their exact source span and date.
4. Translate the claim while preserving names, addresses, qualifiers, and negative evidence.
5. Resolve bilingual aliases and provider identities independently.
6. Rank by trip fit, evidence strength, freshness, and distance—not by an opaque “authenticity score.”
7. Ask a human to review low-confidence or high-impact cases and continuously benchmark corrections.

## Limitations and next evidence

- This was a search snapshot, not a controlled Google-versus-Baidu-versus-Naver experiment. Locale, personalization, and index coverage were not controlled.
- The authenticated Agent Reach backends for Xiaohongshu, Instagram, Reddit, and Naver were unavailable, so no claim is made about their true in-app rankings.
- The 30 candidates were selected to compare useful result types, not randomly sampled from all recommendations.
- Official local tourism content is locally specific but is not equivalent to resident sentiment. Dianping and community evidence should be tested separately.
- Place openness, branch identity, coordinates, and map handoff have not yet been verified for this research set.

The first [provider audit](./shanghai-local-lens-provider-audit.md) found that only one of the ten treatment records currently meets the two-provider resolved threshold; four are bounded routes rather than POIs, four are probable places, and one is an unresolved street. The next evidence gate is therefore two parallel tracks: collect 20 recent Xiaohongshu/Dianping submissions for Shanghai, and finish route/provider review before interpreting the blind decision-change test as evidence for the full discovery-to-map chain.

The smaller [Seoul replication](./seoul-local-lens-replication.md) is now runnable at `/research/local-lens/seoul/`. It compares an English traveler/community baseline with Korean citizen-reporter civic editorial, uses the same blinded decision rubric, and switches the local-provider policy from AMap to Naver Map and KakaoMap. It currently has no participant evidence and no two-provider-resolved candidates, so it is a generalization protocol rather than a positive result.
