# Local-language research agent

Date: 2026-07-15

## Product correction

Local Lens is not a participant-sourcing program. The product should do the hard work:

`traveler intent → native-language research → source claims → translation and context → provider resolution → traveler decision`

Travelers may evaluate, correct, save, or reject the result. They should not need to know which Chinese or Korean query to run, find the original post, or manually reconcile a foreign-language listing with a map.

## What is functional now

- `/research/local-lens/` accepts a destination, destination language, trip intent, and constraints.
- The browser calls the authenticated `submit-local-research` Edge Function when a Supabase backend is configured.
- The function registers an idempotent seven-day research request and enqueues it in `local_language_research`.
- `local-research-status/:id` returns only the signed-in owner’s job and, after completion, its evidence-backed candidates.
- Service-only database functions claim, complete, retry, or fail queue jobs.
- Raw retrieval payloads live in `ctme_private`; the exposed schema contains only bounded evidence and traveler-ready explanations.
- The page shows a reviewed Shanghai Chinese-web snapshot and labels Xiaohongshu and Dianping as unavailable rather than implying they were searched.

The hosted Supabase project and external research worker are not connected in the local static build. Submitting the form therefore shows the reviewed Shanghai contract without pretending a live run occurred.

## Worker responsibility

The long-running research worker must run outside an Edge Function. Hosted Edge Functions are suitable for short request, queue, and provider-call transitions, but their CPU and wall-clock limits are not suitable for authenticated browser retrieval and multi-source research.

For each claimed job the worker must:

1. Turn the traveler intent into multiple native-intent queries. Avoid literal translations of English travel clichés.
2. Retrieve within each enabled source ecosystem independently.
3. Capture source URL, title, language, retrieval time, publication time when available, and the exact supporting span.
4. Extract place or route claims without allowing a lower-priority visual or model inference to override explicit text.
5. Translate the reason and caveat while preserving the original place identity.
6. Resolve the local provider first, then secondary traveler-usable providers.
7. Mark every result `resolved`, `probable`, or `unresolved`; only `resolved` candidates can auto-save.
8. Submit at most 20 ranked candidates through `complete_local_research_job` and archive the queue message atomically.

## Adapter policy

| Adapter | Current state | Production rule |
| --- | --- | --- |
| Chinese local web | Reviewed snapshot available | Retrieve directly, preserve URLs and dates, and review source type separately from resident sentiment. |
| Xiaohongshu | Capture bridge exists; authenticated runtime not connected | Use Agent Reach/OpenCLI or an approved equivalent with operator login state. Never label web search results as Xiaohongshu evidence. |
| Dianping | Planned | Require platform-access and policy review plus branch-aware place resolution. |
| Korean local web | Reviewed Seoul snapshot available | Use Korean-native query forms and Naver/Kakao place identities. |

Local-platform rankings, engagement, and personalization are volatile. Cache raw responses privately, store retrieval dates, and do not claim that a small purposive result set represents the platform’s universal “top places.”

## Evaluation role

The Shanghai and Seoul blinded exercises remain useful only after the agent has produced a candidate set. Their job is to answer:

- Did a researched recommendation enter the itinerary?
- Did it replace an existing stop?
- Was the source evidence persuasive?
- Did the map handoff work?
- What correction should improve the next run?

They are not the discovery engine, recruitment is not required for product operation, and user submissions are a fallback source of leads rather than the primary supply model.
