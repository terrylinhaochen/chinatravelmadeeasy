# Local Lens recruitment and interview protocol

Version: 1.1

Date: 2026-07-15

Applies to: Shanghai Local Lens and Seoul Local Lens

Runnable participant entry: `/research/local-lens/`

## Decision this study must make

Continue investing in local-language discovery only if access to the second source ecosystem causes relevant travelers to add or replace a real stop, and the chosen candidate survives the map-provider handoff.

This is not a concept-preference interview. Do not ask whether participants want “authentic,” “local,” or “hidden” recommendations. Observe a current plan, a blinded choice, and the resulting map action.

## Cohorts and sample

### Primary traveler cohort

Include participants who:

- are actively planning Shanghai or Seoul within the next six months, or returned within the last three months and can show the plan they used;
- do not read the destination language well enough to search local sources comfortably;
- have at least three current candidate stops, a saved map, itinerary, notes document, or message thread;
- normally use a traveler-facing source such as Google Maps, Apple Maps, Reddit, TikTok, Instagram, a guidebook, or a travel planner.

Track but do not pool fluent readers, residents, and local-app power users. They are valuable expert interviews but answer a different question.

The self-guided v2 intake records trip window, destination-language comfort, and existing-stop count before revealing recommendations. Structurally complete but ineligible responses remain available as exploratory records and are excluded from the primary denominator by the analyzer.

Targets:

- Shanghai: 20–30 valid primary-cohort sessions.
- Seoul: 10 directional primary-cohort sessions.
- Do not pool destination rates. The provider stacks and treatment candidates differ.

## Screener

Ask without naming the hypothesis:

1. Which destination and approximate travel dates are you planning?
2. Is this a real trip, a likely trip, or general inspiration?
3. Show or describe what you have already saved. How many places are in it?
4. What sources did you use for the last three places you added?
5. Which map or itinerary product will you actually use during the trip?
6. How comfortable are you reading and searching Chinese or Korean?
7. Have you used Xiaohongshu, Dianping, AMap, Naver Map, or KakaoMap before? For what task?
8. Are there constraints that could rule places out: mobility, dietary needs, children, budget, opening times, reservations, or trip geography?

Exclude from the primary denominator when the trip is hypothetical, no existing plan artifact exists, or the participant is fluent enough to use the treatment ecosystem independently. Record the exclusion reason.

## Recruitment message

### Shanghai

> Planning Shanghai in the next six months? We are comparing two sets of place ideas and testing whether either is useful enough to change a real itinerary. The 35–45 minute session uses your current plan or saved list. You do not need to know Chinese, and there are no right answers. We will not ask you to book or buy anything.

### Seoul

> Planning Seoul in the next six months? We are comparing two sets of place ideas and testing whether either is useful enough to change a real itinerary. The 35–45 minute session uses your current plan or saved list. You do not need to know Korean, and there are no right answers. We will not ask you to book or buy anything.

Do not recruit with “local secrets,” “authentic city,” “hidden gems,” or “recommendations locals love.” Those phrases prime the treatment.

## Pre-session request

Ask the participant to bring the plan they would use without this study. A screenshot is sufficient. Tell them they may hide names, hotel addresses, confirmation numbers, or anything personal.

Prepare:

- the correct frozen study version (`shanghai-local-lens-v2` or `seoul-local-lens-v2`);
- a participant ID with no name or email embedded;
- a screen recorder only if separately consented;
- the participant log template;
- a private contact sheet stored separately from study results when follow-up is permitted.

## Moderated session: 35–45 minutes

### 1. Establish the current behavior — 8 minutes

Ask the participant to show their current plan and narrate the last place they added.

- Where did this recommendation come from?
- What made it credible enough to save?
- What exact place record did you save?
- Could you reopen it now?
- What would make you remove or replace it?

Record the current number of stops and the actual planning/map products. Do not introduce the product or the local-language hypothesis.

### 2. Observe one current handoff — 5 minutes

Choose one place already in the participant's plan that came from a video, post, guide, or message. Ask them to get from the source to the exact record they would navigate to during the trip.

Observe without helping:

- search terms and language;
- app switching;
- copied names, addresses, screenshots, or phone numbers;
- branch or entrance uncertainty;
- whether the reopened pin is recognizably the same place;
- time to a usable destination.

This task supplies a baseline for the product handoff. Failure is data, not a reason to coach the participant.

### 3. Run the blinded Local Lens comparison — 15 minutes

Open the correct study page. Confirm that source-language and ecosystem labels are hidden. Have the participant complete the baseline and treatment decisions without revealing provenance.

For every `Add` or `Replace` choice, ask:

- Where would this fit in the trip?
- What evidence made it actionable?
- If it replaces something, name the exact stop being displaced.
- What remaining uncertainty could reverse the choice?

Do not praise treatment choices or use the word “local.” Require all decisions before source reveal.

### 4. Reveal provenance and test map execution — 8 minutes

After every decision is recorded, reveal original names, sources, and map options.

For the strongest added or replacement candidate:

1. ask the participant to open the intended provider;
2. verify the local name and destination city;
3. verify branch, entrance, or route boundary where applicable;
4. ask whether they would save this exact record to the map used on the trip;
5. ask them to reopen it from the saved collection.

Record provider states separately:

- `resolved`: persistent identity in both required providers, reviewed coordinates, and city/branch agreement;
- `probable`: plausible search result but missing persistent two-provider agreement;
- `unresolved`: city, branch, or provider identity is missing or contradictory.

A search URL does not become resolved because the participant likes the candidate.

### 5. Capture the counterfactual — 4 minutes

Use the study's structured feedback section, then ask:

- Without this comparison, would this exact place have entered the plan?
- What existing stop, if any, changed status?
- Was the difference the place itself, the explanation, the source evidence, or the map confidence?
- What would you do next if this product did not exist?

Download the JSON result. The study stores results on-device and does not transmit them automatically. The participant must knowingly send or upload the file to the researcher.

## Outcome coding

Primary outcome:

- `changed_plan = true` only when at least one treatment candidate is `Add` or `Replace`.

Stronger counterfactual outcome:

- `counterfactual_novel = true` only when `changed_plan = true` and the participant says the exact place probably or definitely would not have entered otherwise.

Replacement quality:

- `replacement_named = true` only when the participant names the displaced stop or planned activity.

Execution outcome:

- `provider_handoff_completed = true` only when the participant opens the intended provider identity and can reopen the saved place.

Do not convert `Maybe`, positive comments, time spent reading, or “this feels authentic” into decision change.

## Falsification and continuation gates

Shanghai's pre-registered directional falsification signal remains:

- decision-change rate below 15% after at least 20 valid primary-cohort participants.

Clearing 15% is not product validation. Continue only when the changed-plan records also show:

- named replacements or credible additions tied to the real itinerary;
- evidence that the place would not otherwise have entered;
- a provider handoff that does not silently change branch or identity;
- no concentration in one misleading treatment candidate.

Report Seoul separately after 10 valid sessions. A lower or higher Seoul result may reflect source selection or provider friction rather than a universal language effect.

Stop or redesign when:

- participants like the editorial stories but do not change the plan;
- choices collapse after provenance reveal;
- treatment candidates are repeatedly rejected because they are geographically unusable;
- probable/unresolved candidates drive most apparent change;
- participants already find the same candidates in their normal ecosystem;
- handoff failures erase the value of discovery.

## Follow-up

For each changed-plan participant who consents, recontact after 7–14 days:

- Is the candidate still saved?
- Did it keep or lose its place in the itinerary?
- Was it shared with a travel companion?
- Did provider identity, opening hours, booking, or distance change the decision?

After travel, when feasible:

- visited;
- attempted but failed;
- deliberately skipped;
- replaced before the trip;
- wrong place or wrong branch;
- no longer remembers the recommendation.

The post-trip result is the strongest evidence. Keep it separate from the initial choice rate.

## Research record and privacy

Use [`local-lens-participant-log-template.csv`](./local-lens-participant-log-template.csv) for session status and coded outcomes. Keep contact information in a separate access-controlled sheet keyed only by participant ID. Do not place names, emails, hotel addresses, booking references, or precise live location in downloaded study JSON.

Publish aggregate counts and de-identified examples only. Negative outcomes and failed handoffs are required evidence, not cleanup cases.
