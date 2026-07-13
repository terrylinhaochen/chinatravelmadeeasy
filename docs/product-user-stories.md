# Product User Stories

## Core Prototype Loop

1. As a new user, I can sign in with an email so saved lists and collected maps have one visible home.
2. As a signed-in user, I can paste a caption, OCR text, or place list and preview extracted pins before saving; a bare social URL must not be presented as extracted content.
3. As a signed-in user, I can save an uploaded pin list and find it later on Profile.
4. As a traveler browsing Curated, I can collect another person's city map and find it later on Profile.
5. As a traveler reviewing Profile, I can see uploaded lists and collected city maps separately, then reopen the source city or map-ready pins.
6. As a user opening a Supabase email link, the app exchanges the callback payload before reading the profile user, so the profile should not render a `null` session after redirect.
7. As a traveler reviewing extracted places, I can correct names and cities, remove weak matches, and see which candidates still need review.
8. As a traveler planning with someone else, I can mark every place Keep, Maybe, or Drop, add a reason and hard constraints, then copy a snapshot link that reopens the bilingual identities, source evidence, decisions, reasons, and constraints as an editable version.
9. As a traveler uploading a multi-city collection, I see one saved list per city while the original source collection remains traceable.
10. As a traveler who starts a save or Collect action before email-link sign-in, I return to the same page after authentication and the pending action completes instead of disappearing.
11. As a traveler handing places to a map, I can copy separate AMap and Apple Maps queries for kept places, grouped by city, without the product claiming it wrote to either provider.
12. As a traveler reading a city guide, I can open a TikTok or Instagram traveler story in place, see the exact traveler claim separated from the editor's interpretation, and send only sufficiently resolved bilingual place identities into the same review task used by pasted and curated lists.
13. As a traveler planning a timed attraction, I can distinguish the attraction identity, ticket product, passport requirement, booking channel, entrance, and fallback before handing the place to a map.
14. As a traveler choosing China connectivity, I can distinguish the eSIM format from the plan's actual routing, then verify device lock, activation, app access, hotspot, number type, and an independent fallback before paying.
15. As a traveler who does not speak Chinese, I can prepare and test an offline task-specific translation workflow, preserve official Chinese place identities, and recognize when allergy, medical, legal, or ticket details require human confirmation.
16. As a traveler following a food recommendation, I can distinguish a dish idea from a resolved restaurant branch, complete or recover from a QR-menu order, and separate dietary preference from medical allergy or celiac risk before trusting translation or delivery.
17. As a traveler following a street-food clip, I can distinguish a dish idea, a market route, and a resolved stall, then verify Chinese identity, ordering units, payment, and food-safety boundaries without treating popularity as proof.
18. As a traveler following a tea recommendation, I can distinguish a named teahouse, tea-country route, museum campus, and shopping district, then confirm the session format, every charge and product unit, invitation risk, and return-border rule before paying.
19. As a traveler following a neighborhood video, I can turn only named public places into a bounded walk with start, pause, and exit anchors, while private courtyards, residents, personal notices, and unverified shortcuts remain outside the map.
20. As a traveler using Discover, I can find a destination by a story's creator, experience, or resolved place; old video URLs return to the exact expanded destination story instead of reopening a detached video feed.
21. As a traveler following a festival or nightlife video, I can separate the public holiday, travel-rush period, named event, permanent venue, temporary zone, ticket, entrance, closing change, and last ride before deciding whether the experience belongs in my route.
22. As a traveler reading the Hong Kong destination digest, I can move from editorial route judgment and short-form traveler stories to six exact Traditional Chinese anchors, then reopen those same identities in one city review task without losing provenance.
23. As a traveler browsing Curated, I see China video-derived city collections first, with the creator and source evidence attached; unrelated imported maps remain clearly labeled as an archive rather than masquerading as China recommendations.
24. As a signed-in traveler opening Profile, I see only lists and city maps I reviewed or collected; the community catalog does not appear as if it already belongs to my personal map.
25. As a reader of a destination digest, I can say whether it was useful, identify a missing route or weak match, retain a local backup, and open a prepared email to the editorial team.
26. As a traveler who finds a wrong name, address, entrance, closure, duplicate, or place match, I can submit a correction that survives sign-in and remains visible as pending review.
27. As a traveler using Chongqing videos, I can distinguish the filmed level or branch from the broader district, then keep Wulong as a separate full transport chain instead of accepting a montage as an executable route.
28. As a traveler saving from the homepage, I use the same account flow as Curated and map review; my pending place survives the email-link return exactly once, with AMap as the mainland default and Apple Maps still available as a second check.
29. As a traveler holding a TikTok or Instagram URL, I can expand one entry under Add Places and immediately reopen a previously processed traveler story and its Curated city collection; an unseen link clearly asks for the caption instead of fabricating extraction or silently returning zero places.
30. As a traveler planning Chengdu, I can open a first-class city edition rather than a broad Sichuan page, distinguish TFU from CTU and South Gate from a panda-campus center, then review six exact bilingual city anchors without mixing in Leshan, Dujiangyan, or other province excursions.

## Not yet complete

- Saved lists and group decisions do not sync across browsers or devices.
- Shared task links are reopenable snapshots; they do not provide live multi-user state, participant identity, concurrent voting, or decision history.
- Unknown places are still resolved heuristically; a production version needs a bilingual POI resolver.
- The static site does not fetch arbitrary social posts or perform image OCR.
- Chengdu has a complete editorial and map-ready destination digest but no verified TikTok or Instagram traveler stories yet; the page intentionally does not invent a media rail.

## Local Prototype State

- `ctme-map-user`: browser-local signed-in user.
- `ctme-map-saved-places`: uploaded or extracted pin lists.
- `ctme-collected-curated`: curated maps collected from other people.

This is intentionally local-only until there is a backend account system.

## Supabase Email Links

The callback page is `/auth/confirm/`. It handles Supabase `token_hash`, PKCE `code`, and implicit `access_token` links, constrains the return path to this site, then writes the confirmed user into the same profile state used by the local prototype. Map saves and city-collection actions are serialized before sign-in and resumed after the callback returns.
