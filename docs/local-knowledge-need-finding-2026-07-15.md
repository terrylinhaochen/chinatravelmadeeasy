# Local-knowledge need finding: China, South Korea, and Japan

Date: 2026-07-15

Status: public-evidence synthesis; not participant validation

## Research question

The product hypothesis is narrower than “travelers like local recommendations”:

> When travelers do not participate in a destination's local-language information ecosystem, does bridging that ecosystem into a map they can use change a real travel decision?

This pass looked for the failure modes before that decision can happen: discovery, interpretation, place identity, saving, reopening, routing, booking, and visiting. The coded source ledger is in [`local-knowledge-need-finding-evidence.csv`](./local-knowledge-need-finding-evidence.csv).

## Method and limits

The evidence set contains 23 public traveler discussions: eight China, seven South Korea, and eight Japan records. Sources were found through public web indexing on 2026-07-15. The authenticated social-research router was unavailable, so this is **not** a claim about top-ranked Reddit, Xiaohongshu, Naver, Instagram, or TikTok content.

The rows are purposive need-finding evidence, not a representative sample. Forum posters self-select for problems, replies can be wrong, and a workaround described in a comment is not the same as an observed session. Product mentions are retained only as workflow evidence, never as endorsements. Dates are month-level where the indexed page did not expose a stable full timestamp.

Strength rubric:

- **3 — behavior:** a traveler describes a workaround, abandonment, booking, visit failure, or maintained multi-app system.
- **2 — active pain:** the barrier occurs in a real planning context, but the resulting behavior or consequence is incomplete.
- **1 — opinion:** generic advice or preference without a concrete trip. No strength-1 rows are used in the synthesis.

`decision_change_evidence=yes` is reserved for an explicit candidate assessment, booking, replacement, abandonment, or visit outcome. A laborious workaround alone does not prove the core hypothesis.

## Finding 1: China breaks the whole discovery-to-execution chain

The most direct China evidence is not a request for “hidden gems.” It is a traveler trying to reproduce a familiar planning behavior—save attractions and restaurants in one map, see what is near each other, and organize days—and discovering that English Google data and English AMap search do not carry the places under consideration. The public replies reconstruct the missing system as separate products: Xiaohongshu for tips, Dianping or Meituan for discovery, and AMap or Baidu for navigation. [Active China itinerary problem](https://www.reddit.com/r/travelchina/comments/1ud8fke/what_tools_and_apps_to_plan_china_itinerary/)

Another traveler describes the handoff itself as the failure: recommendations found on blogs, Reddit, and TripAdvisor cannot be saved into AMap or Apple Maps; Chinese text is sometimes not selectable; and an English name returns no result. The workarounds in the same thread include Trip.com as a handoff layer, screenshot OCR, manually moving the map to the destination city, and waiting until arrival because the search behaves differently in-country. [Copy-paste planning failure](https://www.reddit.com/r/chinatravel/comments/1rt3vtw/the_copypaste_struggle_is_ruining_my_china_trip/)

This supports a destination-specific product problem:

`foreign source → missing Chinese identity → provider mismatch → no durable saved place`

It does **not** yet prove that a Xiaohongshu or Dianping candidate displaces an English-ecosystem stop. The evidence shows the bridge is painful and sometimes unusable; the Shanghai Local Lens study must still measure the downstream decision.

## Finding 2: South Korea reproduces the identity problem, with a different provider stack

The Korea evidence is unusually concrete. Travelers describe searching Google for the English place, copying only the Hangul, pasting it into Naver, shortening or reordering addresses, using a phone number when names fail, adding English nicknames, and keeping Kakao as a fallback. One respondent had pre-mapped three trips across seven areas using that parallel system. [Naver workflow discussion](https://www.reddit.com/r/koreatravel/comments/1j7ilew/advice_on_how_to_use_naver_maps_efficiently/)

Desktop planning introduces another discontinuity: Naver's web product lacks a complete English locale, menu and stop translation is inconsistent, and adding pins is harder than on desktop products travelers already use. A traveler works around this by favoriting every candidate on a laptop, assigning English nicknames, and altering address punctuation until the local provider resolves it. [Naver desktop planning](https://www.reddit.com/r/koreatravel/comments/1lmbdig/naver_website_in_english_translate_function_or/)

The key product difference from China is not lower pain; it is a different identity contract:

`English or social recommendation → Hangul identity → Naver and Kakao identities → recognizable saved place`

The Seoul Local Lens replication is therefore valid, but its provider gate must require persistent Naver and Kakao identities. A search URL is only a recovery path.

## Finding 3: Japan is the counterexample that sharpens the wedge

Japan shows a local-language discovery gap without the same map-system collapse. Travelers commonly find a restaurant in Google Maps, then cross-check Tabelog or Japanese food blogs because ratings and audience composition differ. One discussion explicitly says Google translation usually finds the place regardless of query language, while Tabelog area search is hard without Japanese. [Google versus Tabelog workflow](https://www.reddit.com/r/JapanTravelTips/comments/1cuqt4j/google_maps_the_best_way_to_research_restaurants/)

The local-source comparison can still change decisions. A traveler treated a very highly rated, English-review-heavy Asakusa restaurant as a tourist trap after finding sparse and conflicting Tabelog evidence. Other participants still used Google Maps for nearby search because it worked. [Cross-ecosystem restaurant assessment](https://www.reddit.com/r/JapanTravelTips/comments/1ju4ust/how_well_does_google_work_for_restaurant/)

A separate first-time visitor used Tabelog's local rating system to book four restaurants and plan a fifth, which is direct evidence that local-source access can change a trip. The same thread also contains a traveler forwarding TikToks into an existing map product, showing that generic video-to-map behavior is already served and is not the differentiator. [Restaurant decision workflows](https://www.reddit.com/r/JapanTravelTips/comments/1sfnfcg/how_do_you_usually_decide_where_to_eat_when/)

Japan suggests two boundaries:

1. Local-language evidence can change **judgment** even when place resolution is easy.
2. A useful local place can still fail later because booking requires a Japanese call, domestic service, or hotel concierge. [Reservation handoff](https://www.reddit.com/r/JapanTravelTips/comments/1o2vptk/how_do_locals_usually_make_restaurant/)

## Jobs and consequences across the evidence set

| Job | China | South Korea | Japan | Product implication |
|---|---|---|---|---|
| Discover | Local corpus sits in Xiaohongshu, Dianping, and Meituan | Review depth and current listings concentrate in Naver/Kakao | Tabelog and Japanese blogs alter restaurant judgment | Preserve source ecosystem and explain why the candidate is present |
| Interpret | Chinese text may be unselectable or untranslated | English shells do not translate every name, menu, or saved label | Rating norms and Japanese-only policies need context | Translate the decision context, not only the noun |
| Resolve | English names and out-of-country AMap search fail | Hangul, address order, or phone number may be required | Google usually resolves the place | Resolution policy must vary by destination |
| Save/reopen | Travelers resort to notes, screenshots, Trip.com, or in-country pinning | Travelers add English nicknames and maintain parallel lists | Google remains a workable saved map | The saved object needs local and traveler-facing identities |
| Route | AMap/Baidu execution is separate from discovery | Naver/Kakao execution is separate from Google/Wanderlog planning | Google remains viable | Do not force one global provider model |
| Transact/visit | Not yet well represented in this set | Not yet well represented in this set | Local calls and language policies can still break the visit | Provider identity is necessary but not sufficient for an end-to-end result |

## What the product can and cannot claim

The evidence supports:

- Travelers actively maintain parallel language and map systems in China and South Korea.
- Place-name translation is insufficient because provider identity, address format, review corpus, and saved-list behavior also differ.
- Japan has meaningful local-source divergence even though the traveler-facing map handoff is less broken.
- A source-to-place product should be destination-aware and retain provenance, local identity, and execution-provider identity separately.

The evidence does not yet support:

- “See the city locals see.” That overstates authenticity and treats local communities as one voice.
- “The top local places.” This pass did not collect authenticated platform rankings.
- “Local-language recommendations change most travelers' plans.” Only the Japan evidence contains clear public examples; Shanghai and Seoul still have zero collected participant records.
- “Resolved in AMap/Naver/Kakao/Apple.” A search link is not a persistent provider match.

The defensible working promise is:

> Compare what different travel communities recommend, understand the evidence, and carry the correct place into the map you can use.

## Product decisions from the evidence

1. **Keep Local Lens destination-specific.** China should use Chinese source ecosystems and AMap/Apple handoffs; Korea should use Korean sources and Naver/Kakao/Apple. Japan should begin as an evidence-comparison layer, not a replacement map.
2. **Rank confidence separately.** Source relevance, editorial usefulness, place identity, and provider match are different scores.
3. **Require an explicit counterfactual.** “Interesting” and “authentic” are not outcomes. A participant must name the added or displaced stop.
4. **Preserve the failed candidates.** Unresolved and probable records expose the hard product work and must not become silent pins.
5. **Measure the entire handoff.** A changed decision only counts as an end-to-end result after the person reopens the saved place and reaches the intended provider identity.

## Next evidence gate

Run the linked [`local-lens-recruitment-interview-protocol.md`](./local-lens-recruitment-interview-protocol.md):

- Shanghai: at least 20 valid planning sessions before interpreting the pre-registered 15% falsification threshold.
- Seoul: 10 directional sessions, reported separately rather than pooled with Shanghai.
- Each participant brings a real draft plan or saved list, completes the blinded comparison, names any displaced stop, and attempts the local-provider handoff.
- Recontact changed-plan participants after 7–14 days and after travel when possible.

Until those results exist, the correct status is **problem evidence is strong; decision-change validation is open**.
