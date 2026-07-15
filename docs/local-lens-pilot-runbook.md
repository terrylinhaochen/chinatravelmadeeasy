# Shanghai Local Lens pilot runbook

## What this pilot can answer

The pilot tests one behavioral question:

> Does a reviewed set from Shanghai's Chinese-language information ecosystem cause travelers to add or replace an itinerary stop?

It does not establish that the recommendations are more “authentic,” that a language community has one shared taste, or that an added place was later visited. Those require provider verification and follow-up evidence.

## Recruit 20–30 relevant participants

Recruit people actively planning Shanghai or who returned recently enough to reconstruct a real draft. Balance:

- first-time and repeat visitors;
- two-day and four-plus-day trips;
- food, neighborhood, culture, family, nightlife, and accessibility needs;
- high-planning and low-planning travelers.

Do not recruit by promising “hidden gems” or “the real Shanghai.” Invite participants to compare two recommendation sets and help test whether either changes a practical itinerary.

Suggested invitation:

> Planning Shanghai, or recently back? We are testing whether a different information ecosystem changes a real itinerary. It takes about five minutes. You will compare two unlabeled recommendation sets, make choices, and see the sources afterward.

Share `/research/local-lens/shanghai/` from the same deployment being evaluated. Keep one study version for the full pilot.

## Moderator protocol

1. Ask the participant to enter a real neighborhood base, trip length, constraints, and existing stops.
2. Do not explain which ecosystem produced either set.
3. Ask them to keep up to five places from set one.
4. Ask them to decide on every set-two candidate: `add`, `replace`, `maybe`, or `not for me`.
5. If they choose `replace`, require the exact stop it displaces.
6. Let the participant reveal and inspect original names, sources, and map searches.
7. Require the final counterfactual: without set two, would any of those places have entered the trip?
8. Ask the participant to download the JSON result and send it to the researcher. Do not collect names in the result file.

Avoid coaching, praising local-language sources, or describing a recommendation as authentic. Record confusion and correction needs separately from preference.

## Collect and analyze results

Keep downloaded JSON files in a private research folder outside the public repository. The files contain free-text trip context and notes even though they do not ask for a name.

Analyze one or many exports:

```sh
npm run study:local-lens:analyze -- /private/path/to/results/*.json
```

For a machine-readable aggregate:

```sh
npm run study:local-lens:analyze -- --json /private/path/to/results/*.json
```

The analyzer:

- rejects partial, malformed, or wrong-version records;
- keeps only the latest result for a duplicated session;
- calculates the pre-registered decision-change rate;
- separates additions from replacements;
- calculates counterfactual novelty only when a participant changed the plan and said the place probably or definitely would not have entered otherwise;
- reports candidate-level decisions and the participant's structured reasons.

## Read the evidence conservatively

The pre-registered falsification signal is a decision-change rate below 15% after at least 20 valid participants. Clearing that threshold is not product validation on its own.

Before claiming the value chain works, also verify:

- at least 90% of selected treatment places resolve to the correct AMap POI or intended route segment;
- map handoffs open the intended place, not merely a search query;
- additions survive into a day plan or map reopen;
- a later follow-up confirms whether the participant visited, skipped, or replaced the place;
- novelty is not explained mainly by distance, closures, or unmatched categories.

The current Shanghai set still uses AMap and Apple Maps search handoffs. Provider identities and coordinates require a separate review before testing the full map-location claim.
