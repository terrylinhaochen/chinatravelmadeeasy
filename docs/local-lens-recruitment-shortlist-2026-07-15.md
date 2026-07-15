# Local Lens recruitment shortlist

Date: 2026-07-15

Status: production study is live; participant evidence remains at zero.

Participant hub: <https://chinatravelmadeeasy.com/research/local-lens/>

## Recruitment principle

Recruit people who already have a real Shanghai or Seoul draft. Do not recruit with “authentic,” “hidden gems,” “locals know,” or a promise that the second set is better. Those phrases reveal and prime the hypothesis.

Public itinerary posts prove that the eligible audience exists; they are not permission to target the authors. Do not reply with a study pitch or send unsolicited direct messages. Ask community moderators for permission to make one transparent recruitment post.

## Current audience evidence

| Channel | Evidence of fit | Permission state | Recommended use |
| --- | --- | --- | --- |
| `r/travelchina` | Recent travelers are deciding whether Shanghai belongs in a real itinerary, asking what to swap, and showing multi-stop drafts. See [Shanghai worth-it decision, 2026-06-23](https://www.reddit.com/r/travelchina/comments/1udbfv6/china_itinerary_is_shanghai_worth_it/), [food-focused October itinerary, 2026-05-12](https://www.reddit.com/r/travelchina/comments/1tb1gsf/travel_to_china_in_october_2026_itinerary/), and [overpacked itinerary discussion, 2026-04-30](https://www.reddit.com/r/travelchina/comments/1szl4w3/is_this_itinerary_too_much/). | Survey and self-promotion rules were not readable from the anonymous public rules page. Ask moderators before posting. | Strongest Shanghai community candidate after approval. Use one standalone recruitment post, never replies under individual itineraries. |
| `r/KoreaTravel` | Recent posts contain dated Seoul plans, existing stops, constraints, and explicit requests for additions or swaps. See [first-trip itinerary, 2026-06-23](https://www.reddit.com/r/koreatravel/comments/1udsyv7/need_itinerary_advicehelp_for_my_first_trip/), [Chuseok itinerary, 2026-07-04](https://www.reddit.com/r/koreatravel/comments/1unk35f/seoul_during_chuseok_2026_is_this_itinerary/), and [next-year draft, 2026-04-24](https://www.reddit.com/r/koreatravel/comments/1su52n6/initial_itinerary_planning/). | Ask moderators before posting. The community AutoModerator explicitly routes quick questions to `r/KoreaTravelAdvice`, chat to the KoreaTravel Discord, and provides a moderator-contact path. | Strongest Seoul community candidate after approval. Ask whether the study belongs in the main community, advice community, or Discord. |
| `r/KoreaTravelAdvice` and KoreaTravel Discord | `r/KoreaTravel` AutoModerator presents these as its quick-question and chat surfaces. | Not independently verified for research recruitment. Ask the same moderator team where a participant request is acceptable. | Secondary Seoul channels only after explicit approval. Do not cross-post the same request simultaneously. |
| China Travel Made Easy Discover | The production Discover page now asks Shanghai or Seoul planners with at least three saved places to join the blinded study. | Owned surface; already live. | Keep as the always-on, low-volume intercept. Review funnel events weekly. |
| Warm traveler network | A direct invitation from someone the traveler knows avoids community self-promotion and gives faster moderated-session scheduling. | Invite only known contacts; do not scrape or infer personal contact data. | Recruit the first three eligible sessions per city here to expose study friction before wider posting. |

Reddit’s own spam guidance says promotional norms are community-specific and that some communities use a roughly 10% self-promotional-content rule. That is a floor, not permission to post this study; moderator approval remains the gate. See [Reddit Help: keeping spam out of a community](https://support.reddithelp.com/hc/en-us/articles/28012014962580-How-do-I-keep-spam-out-of-my-community).

## Moderator permission request

> Hi — I’m running a small, non-commercial itinerary study for people actively planning Shanghai or Seoul. It compares two recommendation sets without showing their source language until after the traveler decides what they would add or replace. It takes about five minutes, requires no account, and does not transmit the itinerary or result automatically. Would one transparent participant-recruitment post be appropriate in your community? I will not contact individual posters, cross-post without permission, or frame it as “hidden gems.” Study design and privacy details: [participant hub].

Replace `[participant hub]` with the campaign-attributed link for that community.

## Approved-post copy

### Shanghai

**Planning Shanghai with at least three places already saved? Help compare two itinerary sets.**

I’m looking for travelers planning Shanghai within the next six months, or people who returned within the last three months and still have their draft. You will choose from two recommendation sets before seeing their source ecosystem, then say whether any idea would actually add to or replace something in your plan.

It takes about five minutes. No account is required. Your itinerary and result stay in your browser unless you choose to copy, download, or email the result at the end. There are no right answers, and “none of these change my plan” is useful evidence.

<https://chinatravelmadeeasy.com/research/local-lens/?campaign=reddit-travelchina>

### Seoul

**Planning Seoul with at least three places already saved? Help compare two itinerary sets.**

I’m looking for travelers planning Seoul within the next six months, or people who returned within the last three months and still have their draft. You will choose from two recommendation sets before seeing their source ecosystem, then say whether any idea would actually add to or replace something in your plan.

It takes about four minutes. No account is required. Your itinerary and result stay in your browser unless you choose to copy, download, or email the result at the end. There are no right answers, and “none of these change my plan” is useful evidence.

<https://chinatravelmadeeasy.com/research/local-lens/?campaign=reddit-koreatravel>

## Campaign links

The participant hub carries a bounded anonymous `campaign` value into the selected city study. The value is stored in the downloaded record and counted only among eligible participants in the analyzer.

| Source | Link |
| --- | --- |
| Warm Shanghai outreach | <https://chinatravelmadeeasy.com/research/local-lens/?campaign=warm-shanghai> |
| Warm Seoul outreach | <https://chinatravelmadeeasy.com/research/local-lens/?campaign=warm-seoul> |
| `r/travelchina` approved post | <https://chinatravelmadeeasy.com/research/local-lens/?campaign=reddit-travelchina> |
| `r/KoreaTravel` approved post | <https://chinatravelmadeeasy.com/research/local-lens/?campaign=reddit-koreatravel> |
| KoreaTravel Discord approved post | <https://chinatravelmadeeasy.com/research/local-lens/?campaign=discord-koreatravel> |

Do not put usernames, email addresses, dates, or free text in the `campaign` value.

## Funnel and evidence handling

The static study emits aggregate analytics events without itinerary text:

- `local_lens_recruitment_hub`
- `local_lens_started`
- `local_lens_completed`
- `local_lens_feedback`
- `local_lens_result_downloaded`

Events include destination, bounded recruitment source, and primary-cohort eligibility where available. The full plan and candidate decisions remain on-device until the participant knowingly copies, downloads, or prepares an email.

For emailed/downloaded records:

1. save the untouched JSON in a private evidence folder;
2. keep contact information outside the result file;
3. run the correct destination analyzer;
4. report structurally valid, eligible, and exploratory counts separately;
5. never convert pageviews, starts, positive comments, or `Maybe` into decision change.

## First recruitment gate

1. Recruit three eligible moderated sessions per city from known travelers.
2. Correct confusing copy, eligibility failures, or submission friction without changing the frozen recommendation sets.
3. Ask moderators for permission with the message above.
4. If approved, post once in the destination-appropriate channel and preserve the campaign link.
5. Review after five eligible results per city for candidate misunderstanding, false replacements, or map-handoff collapse.
6. Continue toward 20 eligible Shanghai and 10 eligible Seoul sessions only if the instrument is producing interpretable records.

No outreach has been sent as part of this work.
