# Dogfood audit — 2026-07-12

## Product conclusion

The clearest differentiated value proposition is:

> Turn scattered China recommendations into reviewed places that retain local identity, source context, and the practical fallback needed to use them — then hand the same set to a friend or map app.

This is narrower and stronger than “China travel guides” or “AI itinerary planner.” Generic planners already offer collaborative itineraries and Google Maps pins. China’s unresolved problem is interoperability: recommendations arrive as captions, screenshots, chats, and English names, while the traveler must execute in a Chinese map/payment/booking environment.

## What travelers are trying to solve

Recent demand evidence:

- A July 2026 traveler says Google Maps lacks many desired China locations and English searches in AMap often fail: <https://www.reddit.com/r/travelchina/comments/1ud8fke/what_tools_and_apps_to_plan_china_itinerary/>
- A June 2026 traveler asks how to organize an itinerary in a map app because Google Maps is limited and alternatives are hard to use: <https://www.reddit.com/r/chinatravel/comments/1tvrdfw/how_to_organize_itinery_in_maps_app/>
- First-trip threads repeatedly converge on pre-arrival setup, Chinese hotel addresses, payments, connectivity, and map fallbacks rather than destination inspiration alone: <https://www.reddit.com/r/travelchina/comments/1sfkuff/first_time_in_china_do_these_5_things_before_you/>
- Wanderlog already pins places to a Google-Maps-based trip and supports collaboration, so “shared itinerary” alone is not a wedge: <https://play.google.com/store/apps/details?id=com.wanderlog.android>
- Newer group planners add chat agents, voting, and shared maps; the opportunity is not another feature checklist but China-specific place resolution and execution: <https://tripjam.app/>

## Claim-by-claim dogfood result

| Claim or user story | Before this audit | Result |
| --- | --- | --- |
| Static site builds | Build completed | Functional |
| Paste a caption or note and preview known places | Sample found four Shanghai places | Functional for a narrow dictionary and some regex patterns |
| Paste a previously processed TikTok or Instagram URL | No video-link entry existed; a bare URL in the text extractor returned zero places | Gap addressed and browser-verified: the click-to-expand entry under Add Places recognizes the canonical short-form identity, returns cached field-note and Curated links immediately, and keeps zero-pin research leads distinct from resolved collections |
| Paste an unseen TikTok, Instagram, or Google Maps URL | Returned zero places because the page does not fetch remote content | Still not an ingestion story: unseen supported short-form links now receive an explicit caption/OCR fallback; Google Maps URLs remain unsupported; YouTube is intentionally rejected |
| Upload a screenshot | Only the filename was inspected; pixels were not read | Not functional; input is now limited to text exports and OCR text |
| Parse an arbitrary numbered English place list | Returned zero places before parser changes | Gap addressed; needs regression coverage |
| Parse Chinese free text | Produced duplicates and noisy prefixes | Partial; known-place aliases and cleanup improved, but unknown Chinese POIs still need a real resolver |
| Review and remove weak matches | Copy claimed editable/remixable lists but no controls existed | Gap addressed in the review UI |
| Save a reviewed list | Saved to browser local storage | Functional on one browser only |
| Save from the homepage through sign-in | The hero and Add Places each had a separate fake email form that wrote `ctme-map-user` directly, bypassing the shared magic-link callback | Gap addressed and browser-verified: both now use the global auth flow, stage one idempotent pending action, resume it after a callback-style reload, and expose the chosen map handoff instead of losing the action |
| Choose a mainland execution map | Homepage and destination entry actions defaulted to Apple Maps; onboarding still promised Google Maps route export | Gap addressed: AMap is the explicit mainland default, Apple Maps remains a second check, Hong Kong/Macau/Taiwan retain Apple-first entry, and unsupported Google route-export claims were removed |
| Reopen an uploaded list from Profile | Profile showed inert chips | Gap addressed: Profile reconstructs the saved places and constraints as an editable task |
| Collect a curated map | Local collection code existed, but the Curated index kept the selected city only in the page's unresolved promise | Gap addressed and browser-verified: the exact collection is written as a pending action before magic-link sign-in, resumes after a callback-style reload, clears the pending record, and appears on Profile |
| Share a location task | “Copy” produced text only; no recipient workflow | Static end-to-end example complete: the URL retains bilingual identity, source evidence, keep/maybe/drop, reasons, and constraints; live shared state is still open |
| Use short-form video as destination evidence | Video discovery initially lived on a detached `/videos/` surface | Hong Kong, Shanghai, Beijing, and Chongqing now place TikTok/Instagram-capable field notes inside destination guides and/or the city discovery system; Discover searches their creator, experience, evidence, and resolved places; each resolved note is also a creator-attributed Curated city collection with bilingual AMap and Apple handoffs |
| Hand a structured destination set into review | Supporting editorial prose could be re-extracted as extra pins | Gap addressed: explicit bilingual lines now take precedence; Shanghai remains exactly six places, Chongqing preserves six level/entrance/route identities, and Guangzhou keeps two Nanyue campuses plus a chosen island entrance separate |
| Plan a passport-bound attraction | Advice was scattered and the itinerary falsely implied one passport-reservation workflow for every sight | Gap addressed with a source-dated cross-city guide that separates booking type, ticket product, identity, channel, entrance, and sold-out recovery, then hands six operational identities into review |
| Stage a place from its detail page | The page emitted module imports inside a classic inline script, so the interaction never initialized | Gap addressed and browser-verified: place staging now writes the resolved place to the local map state |
| Submit visited evidence | A detached form asked readers to restate “Worth it / Mixed / Skip” after the source already carried the traveler's experience | Removed by product decision: place pages now show the source story and its context directly; destination pages collect only lightweight product/editorial feedback, while place-match corrections remain structured |
| Correct a wrong place match | The page displayed a disabled “Needs correction” button but exposed no correction workflow | Gap addressed and browser-verified: every place accepts a typed 280-character correction, preserves it through magic-link sign-in, displays submitted corrections on the place, and invokes the backend review function for provider-backed UUID places |
| Cross-device account | Supabase email callback exists, while lists remain browser-local | Not complete |
| Save or collect immediately before magic-link sign-in | Pending action was held only in page memory and vanished on callback | Gap addressed: pending map saves and city collections—including Collect from the Curated index—survive callback and resume after the session is established |
| Traveler-facing agent skill | No project skill existed; only an operator sourcing adapter | Added `skills/china-travel-companion` |

## Extraction test evidence

Baseline representative inputs before the parser changes:

- Bare TikTok URL: 0 places.
- Product sample caption: 4 places.
- Numbered list containing Shanghai Museum, Xintiandi, and Longhua Temple: 0 places.
- Natural English recommendation: 3 candidates, including one false Bund match inside a hotel name.
- Chinese itinerary text: 5 candidates, including duplicates and prefixes such as “第一天”.
- Shared Google Maps short link: 0 places.

The page must continue to expose “probable” versus “resolved” rather than presenting heuristic extraction as AI certainty.

## Guide quality audit

The existing guides are unusually detailed and often have good failure-mode advice, but they had no outbound source links at all. A fresh-looking `updated` date therefore did not prove that fast-changing facts were checked.

Two concrete stale claims were found:

- The visa guide said 60 eligible ports and roughly 54 countries. The current National Immigration Administration policy says 65 ports and 55 countries: <https://en.nia.gov.cn/n147418/n147463/c183412/content.html>
- The hotel guide said private-home registration meant visiting a police station. Since March 20, 2026, the NIA has piloted legally equivalent online registration in seven provincial-level regions: <https://english.www.gov.cn/services/visitchina/202603/21/content_WS69ce124cc6d00ca5f9a0a368.html>

The new quality bar requires decision clarity, traveler applicability, failure recovery, primary evidence, true recency, actionability, and honesty. Every legacy guide now has a decision summary and dated primary sources: visa, payments, hotels, rail, connectivity, translation, food ordering and dietary needs, street food and night markets, tea houses and tea-country routes, neighborhood walks, festivals and local experiences, the pre-departure/first-24-hours guide, the maps/Didi/metro execution guide, and the seven-day itinerary. A new attraction-ticket guide applies the same standard across Beijing, Shanghai, and Xi'an.

The connectivity audit removed a more subtle stale absolute: **eSIM is a profile format, not a routing guarantee**. The previous guide said travel eSIMs inherently bypass mainland filtering, named VPN brands with an invented reliability percentage, and published price ranges without product evidence. The replacement makes travelers verify the exact plan's mainland coverage, routing claim, activation trigger, hotspot rule, number type, and support path; it gives separate iPhone, Android, laptop, and first-hour recovery workflows without recommending unlicensed services.

The translation audit removed another false comfort layer. The previous guide said an English-only visitor could travel “comfortably,” treated camera output as good enough to order confidently, compared Apple and Google quality without evidence, and encouraged approximate spoken phrases while offering no safe boundary for allergies, medicine, or ticket identity. The replacement is organized by traveler task, requires a real Airplane Mode test, keeps official Chinese place names separate from machine translation, and adds typed, offline, human-confirmation, and emergency recovery paths.

The food audit exposed the same identity problem at higher stakes. The previous guide converted every QR code into a smooth WeChat-or-Alipay flow, called crowds a street-food safety signal, claimed foreign-card delivery would work, and suggested rice or clear broth as a gluten-free fallback. The replacement distinguishes dish ideas from resolved restaurant branches, makes QR submission and payment recoverable, separates preferences from allergy and celiac requirements, applies CDC traveler guidance, and explains that China’s stronger prepackaged-food allergen standard starts in 2027 and does not cover restaurant food.

The street-food pass exposed how quickly weak editorial shortcuts become bad map data. The old guide treated a dish, a market district, and an exact stall as interchangeable; recommended pork roujiamo inside Xi'an's Muslim Quarter; promised that walking away from a landmark halves prices; called local queues a safety test; and framed mobile payment as universal while cash was unreliable. The replacement distinguishes route anchors from storefronts, gives Xi'an, Kaifeng, Chengdu, and Shanghai different operating contexts, preserves dated source prices rather than publishing fake universal ranges, applies CDC visible-risk guidance, and keeps both mobile wallet and RMB cash fallbacks.

The tea pass found four different products hiding behind one romantic category: a Chengdu park teahouse, a Hangzhou production landscape, a hosted tasting, and a Beijing shopping district. The old guide published universal session and retail prices, treated “full of locals” as legitimacy, called tasting free by default, dismissed cash, gave one etiquette script as national, and said sealed loose-leaf tea passes customs in most countries. The replacement resolves each place type separately, requires all seat, room, service, tea-weight, and minimum-purchase charges before brewing, documents the stranger-led invitation scam pattern, and routes travelers to destination-country agriculture and customs rules.

The neighborhood pass removed a more extractive definition of “authentic.” The old guide encouraged travelers to read laundry, plumbing, open courtyard doors, pajama-clad residents, matchmaking notices, and market activity as attraction signals; promised universal activity hours and easy participation; and treated getting lost as the method. The replacement only maps named public streets, museums, parks, businesses, and exits; provides bounded Beijing, Shanghai, and Chengdu route contracts; keeps residents and private thresholds out of the extraction surface; and makes surface, toilets, seating, traffic, daylight, and early-exit needs part of the plan.

The festival pass found the final legacy guide collapsing public holidays, transport-rush periods, named events, permanent venues, temporary zones, and informal nightlife into one “yes-list.” It published universal prices and hospitality choreography, treated a park pin as an event, and implied a past festival category supplied a future schedule. The replacement uses current 2026 Yuyuan, Qinhuai, Harbin, Ditan, and Guangzhou worked examples to show the correct object: operator, Gregorian date, zone, ticket, entrance, closure change, last ride, and fallback attached to a permanent bilingual place. KTV, bathhouse, park-group, late-food, and hospitality sections now preserve price, privacy, consent, health, and exit boundaries instead of promising language-free participation.

The Beijing pass found another consequential stale absolute: the seven-day itinerary said there were no same-day Forbidden City tickets. Beijing’s official help still makes advance passport booking the safe default, while repeated 2026 foreign-passport reports describe capacity-dependent assistance at the Meridian Gate service window. The guide now states both layers without turning the community workaround into guaranteed policy, and separates the Palace Museum entrance from Tian’anmen Square’s reservation workflow.

## Highest-priority content gaps

1. **English-to-Chinese place resolution for maps** — branch identity, Chinese name, and city are a larger execution problem than generic itinerary generation.
2. **First 24 hours contingency pack** — the guide now covers the hotel identity card, offline screenshots, payment fallback, airport-to-hotel recovery, accommodation registration, and emergency phrases. A dedicated printable/offline export remains open.
3. **Attraction reservation workflows** — the new cross-city guide now covers booking types, passport-name traps, product/channel ambiguity, entrances, and an honest sold-out ladder. Live inventory checks and more city-specific worked examples remain open.
4. **Android map workflow** — realistic setup and handoff when Apple Maps is unavailable and AMap English search misses the POI.
5. **Healthcare, pharmacy, and emergency navigation** — what to do when translation, payment, and facility choice all matter at once.
6. **Accessibility, older travelers, and families** — walking load, station scale, elevators, toilets, seating, and child ticket rules.
7. **Small-city and rural execution** — weaker English support, hotel registration, last-mile transport, and cash/card fallbacks.

## Field-guide content debt — explicitly not complete

The destination template is functional, but the editorial field guide is not yet a complete product. Hong Kong, Shanghai, Beijing, Chongqing, Chengdu, Xi’an, Guangzhou, Shenzhen, Hangzhou, Kunming, Dali, Lijiang, Guilin, and Yangshuo now have full narrative treatment: a point of view, paced day structures, stay advice, execution risks, map-ready bilingual places, and dated official sources. The first four also carry short-form video evidence that is interpreted rather than merely embedded. Beijing adds explicit dependency modeling for separate reservations, directional entrances, Monday recovery, and the city-to-Huairou transport chain. Chongqing models level and entrance ambiguity, branch-level food evidence, and the complete city-to-Wulong dependency chain instead of collapsing viral shots into generic pins. Chengdu proves that a non-municipality city can be a first-class destination record rather than a label inside its province: it separates two airports, a chosen panda gate, nested park/teahouse identity, a bounded Yulin walk, and Sichuan excursions. Xi’an separates the walled Ming city, Tang museum-and-pagoda context, and the Qin archaeology day in Lintong; it also prevents the Shaanxi History Museum’s main building and distant Qin–Han branch from collapsing into one search result. Guangzhou separates a broad province record into a city edition, distinguishes both Nanyue museum campuses, grounds Shamian at a chosen entrance, and treats airport terminal, rail-station, restaurant-branch, and museum-closure ambiguity as first-class planning data. Shenzhen makes border-product, rail-station, airport-terminal, and city-polycentricity errors part of the guide rather than footnotes: Futian Checkpoint stays distinct from Lok Ma Chau, Futian Station stays distinct from Shenzhen North, and Airport on Line 11 stays distinct from Airport East. Hangzhou reads West Lake as a designed landscape instead of one attraction pin, incorporates the current free-but-reservation-gated Lingyin system, and keeps tea-museum campuses, canal museums, station hubs, and Liangzhu museum/park identities separate. Kunming treats the city as more than an airport by connecting plateau geography, city and provincial museums, the flower trade, Dianchi ecology, and the complete Stone Forest transfer chain. Dali treats Xiaguan, the old city, Cangshan, the west-shore corridor, Xizhou, and the east shore as different planning objects rather than one lake-loop montage. Lijiang separates Dayan, Shuhe, and Baisha as three World Heritage components and distinguishes scenic admission, the new visitor center, and the exact Glacier Park ropeway from the other mountain products. Guilin keeps the urban karst and heritage city distinct from the downstream cruise product, including the two departure ports and the one-way arrival in Yangshuo. Yangshuo treats the county town, Xingping, and the Yulong River as different bases and transport systems rather than one scenic label. Verified Chengdu, Xi’an, Guangzhou, Shenzhen, Hangzhou, Kunming, Dali, Lijiang, Guilin, or Yangshuo TikTok/Instagram evidence remains a visible supply gap and was not fabricated. The remaining region pages mostly contain starter pins, a short summary, matched guides, and QA. Template coverage must not be reported as content completeness.

The next editorial pass should work city-first, not province-first:

1. Zhangjiajie next, followed by another city-first slice such as Suzhou or Nanjing.
2. For each city: a point of view, who it is for, a two- or three-day rhythm, where to stay by traveler type, specific map-ready places with Chinese names, practical failure modes, and dated sources.
3. Expand to province routes only after the constituent city editions are useful on their own.
4. Score every page against `skills/china-travel-companion/references/quality-bar.md`; “Lonely Planet quality” means editorial selection and situational judgment, not a longer attraction list.

This is deliberately recorded for a later content sprint. It is not silently filled with generic prose in this implementation.

## Map-ready discovery and community loop

The four homepage modes are filters of one discovery system, not four unrelated destinations:

- **Places** prioritizes destination starter pins, neighborhood guides, and city editions.
- **Eating** prioritizes food streets, markets, tea houses, dietary help, and contributed food lists.
- **Traveling** prioritizes stations, entrances, transport guides, and address handoffs.
- **Hospitality** prioritizes workable neighborhoods, foreign-passport lodging, and arrival addresses.

The product should distinguish the **discovery source** (a guide, TikTok, Instagram, Dianping, a friend, or a community list) from the **execution surface** (AMap, Apple Maps in China, Didi, or another locally useful map). Its wedge is the identity-preserving conversion between them:

`source artifact → place candidate → English/Chinese identity → city and branch review → map query → saved/shared city set`

The Hong Kong destination digest now tests that information architecture directly. The homepage places three click-to-expand traveler stories immediately under Add Places and deliberately draws them from different destinations; Discover treats their titles, creators, context, and resolved locations as searchable destination content. On video-backed destination pages, the traveler story replaces the stock cover and opens directly into the editorial narrative and its places. Each resolved story also becomes a creator-attributed city collection that can enter the existing Keep/Maybe/Drop task. Hong Kong carries six exact Traditional Chinese handoffs—Mei Ho House, Tin Hau Temple in Yau Ma Tei, the Clock Tower end of the Tsim Sha Tsui promenade, Man Mo Temple, Kowloon Walled City Park, and the To Tei Wan Dragon's Back trailhead—rather than sending a traveler to broad district labels. `/videos/` is only a noindex compatibility path, and old per-video links return to the exact expanded story inside the destination.

The Chongqing slice stress-tests the same system against a city where ordinary coordinates are insufficient. Six TikTok field notes now sit inside the destination page and open into creator-attributed city collections. The guide replaces the former broad “Liziba and Kuixinglou walks” and “Jiefangbei to Hongya Cave” pins with six separate bilingual execution anchors: the Liziba viewing platform, Kuixinglou Square, Huangguan Crown Escalator, Hongya Cave scenic complex, Shibati district, and the Three Natural Bridges visitor center in Wulong. The video interpretation explicitly restores what the edit removes: elevation, bridge or entrance level, branch identity, intercity transfer, scenic shuttle, walking load, and return plan.

The Chengdu slice closes the city-versus-province architecture gap. `/regions/chengdu/` is now a true `City` destination with seven editorial decisions and six bilingual execution anchors: Heming Tea House nested inside People’s Park, Chengdu Museum, Wenshu Monastery, the Panda Base South Gate, a bounded Yulin West Road start, and Wuhou Shrine kept distinct from adjacent Jinli. `/regions/` now presents city editions before wider regions, while Sichuan remains available for multi-city and excursion planning. The same six identities survive the map-review handoff in regression coverage. No Chengdu field-note rail renders until a real TikTok or Instagram source passes the evidence bar.

The Xi’an slice applies the same bar to a city where historical period, modern geography, and ticket product are easy to collapse. `/regions/xian/` structures three days around the walled city, Tang Chang’an, and Lintong rather than a ranked attraction list. Its six bilingual anchors preserve Yongning Gate as a chosen wall entrance, the Great Mosque as a place of worship rather than a food-district synonym, the Shaanxi History Museum main building as distinct from its Qin–Han branch, Da Ci’en Temple as the container for Big Wild Goose Pagoda, Xi’an Museum and Small Wild Goose Pagoda as one campus, and the official two-site Qin mausoleum museum identity. The same records survive structured extraction in regression coverage. No Xi’an traveler-story rail renders until a verified short-form source passes the evidence bar.

The Guangzhou slice tests whether the same system survives a city whose familiar English labels hide multiple execution objects. `/regions/guangzhou/` now builds three days across Xiguan, the old political center, and Zhujiang New Town. Its six bilingual anchors preserve the Chen Clan building/museum identity, the Cantonese Opera museum as the fixed Enning Road anchor, the east bridge as the start of a Shamian route, both Nanyue King Museum campuses as separate reservations and addresses, and Guangdong Museum as a timed modern-riverfront anchor. Current reporting also captures the Tomb chamber conservation closure, Monday-versus-Tuesday museum recovery, Guangzhou’s changing rail-station roles, and the three-terminal Baiyun Airport handoff. No restaurant chain, dish, or Guangzhou traveler-story rail becomes a pin until a current branch or verified TikTok/Instagram source passes the evidence bar.

The Shenzhen slice applies the rubric to a city that is often reduced to technology, malls, or a Hong Kong day trip. `/regions/shenzhen/` instead reads the city through reform-era Futian, older Nanshan and port-era Shekou, and Dafen’s production landscape. Its six bilingual anchors preserve the Reform and Opening-Up Exhibition Hall inside the Museum of Contemporary Art and Urban Planning, a specific Lianhua Hill entrance, Nantou Museum outside the old south gate, the Sea World Culture and Arts Center rather than the surrounding commercial district, Dafen Art Museum rather than the whole village, and Futian Checkpoint as a transport object distinct from the Hong Kong-side Lok Ma Chau station. Current reporting also separates Shenzhen North from Futian Station, Airport on Line 11 from Airport East, and each Hong Kong crossing’s name and operating window. No restaurant, broad district, or Shenzhen traveler-story rail becomes a pin until an exact branch or verified TikTok/Instagram source passes the evidence bar.

The Hangzhou slice turns the former Zhejiang-only starter card into a separate city edition. `/regions/hangzhou/` now reads the city through water and land deliberately reshaped over time: West Lake’s causeways and planted views, the Lingyin religious landscape, working tea hills, the Southern Song capital, the Grand Canal terminus, and Liangzhu’s older water-engineering system. Its six bilingual anchors preserve Broken Bridge as a chosen Bai Causeway start, the Lingyin–Feilai Peak complex as the object governed by the current free timed reservation, the Shuangfeng tea-museum campus rather than a generic Longjing field, Deshou Palace archaeology versus reconstruction, the Hangzhou canal museum rather than the similarly named Yangzhou institution, and Liangzhu Museum rather than the separate ruins park five kilometers away. Current reporting also captures Lingyin’s February 2026 online-waitlist rule, the tea museum’s unusual Tuesday closure, Deshou Palace’s short reservation window, and Hangzhou’s four distinct rail hubs. No tea shop, broad village, pier, or Hangzhou traveler-story rail becomes a pin until a current branch, operator, or verified TikTok/Instagram source passes the evidence bar.

The Kunming slice separates the Yunnan gateway city from the province-level starter page. `/regions/kunming/` now uses the Dianchi basin and the city’s north-to-south expansion as the planning frame: a Green Lake and municipal-history day, a provincial-museum and Guandu day, the Dounan flower trade, a seasonal Dianchi ecology day, and a deliberately separate Stone Forest excursion. Its six bilingual anchors preserve Green Lake’s south gate as a route start, Kunming City Museum and Yunnan Provincial Museum as different institutions and addresses, Dounan’s main market hall rather than the whole district, Haigeng’s public gull-viewing section rather than generic Dianchi, and the Stone Forest visitor center beyond Shilin West station. Current reporting also captures seasonal gull evidence, bird-welfare rules, the 2026 wild-mushroom warning, and the differences among Kunming Station, Kunming South, and Airport Line 6. No market stall, mushroom restaurant, broad lake label, or Kunming traveler-story rail becomes a pin until an exact venue or verified TikTok/Instagram source passes the evidence bar.

The Dali slice applies the rubric to a destination whose English name can refer to a prefecture, modern Xiaguan, the old city, or the entire Erhai basin. `/regions/dali/` now gives the city four movable days and six exact bilingual anchors: the South Gate visitor center as the Xiaguan-to-old-city handoff, Dali City Museum rather than the prefecture museum, the Three Pagodas cultural-tourism entrance with ancient-versus-reconstructed context, Yan Family Courtyard Museum as the Xizhou merchant-architecture anchor, Longkan as a named west-shore ecological-corridor entrance, and the Cangshan Grand Cableway lower station at Tianlongbabu Film City rather than a generic mountain cable car. Current reporting also distinguishes the three Cangshan cableways, keeps a weather and altitude recovery plan, treats the ecological corridor as protected slow-mobility infrastructure rather than an unrestricted motorized loop, and separates Old Town, Xiaguan, Xizhou, and Shuanglang as different bases. No unnamed guesthouse, bakery, broad Erhai pin, or Dali traveler-story rail becomes a pin until an exact venue or verified TikTok/Instagram source passes the evidence bar.

The Lijiang slice applies the same rubric to a destination that short-form media routinely collapses into old-town lanterns and a generic snow-mountain cable car. `/regions/lijiang/` now gives the city four movable days and six exact bilingual anchors: Lijiang Ancient City Museum at Mufu for Dayan’s political context, Black Dragon Pool’s south gate as the water-system endpoint, Shuhe’s north gate as a reproducible heritage-component arrival, the Baisha Murals ticket office rather than a generic village or cafe pin, the new Jade Dragon visitor center for 2026 admission and product decisions, and the Glacier Park lower station rather than the Spruce Meadow or Yak Meadow ropeways. The guide separates the three World Heritage components; separates scenic admission, ropeways, shows, trains, carts, and shuttles; preserves a weather/refund recovery path; treats 4,680 metres as an altitude constraint; and warns against illegal “guaranteed ticket” sellers and unopened mountain routes. No generic old-town coordinate, hotel pickup, Blue Moon Valley photo pin, or Lijiang traveler-story rail becomes evidence until the exact identity or verified TikTok/Instagram source passes the same bar.

The Guilin slice applies the rubric to the part of the Guangxi trip that is too often treated as an airport or cruise pickup. `/regions/guilin/` now reads the lowland tower-karst city through the Ming princes’ compound, the municipal museum, Elephant Trunk Hill, and Reed Flute Cave before making the Li River a deliberate one-way base change. Its six bilingual anchors preserve the Guilin Museum’s Lingui building, Zhengyang Gate at the Duxiu Peak–Jingjiang Princes’ City complex, Elephant Hill Gate 1, the Reed Flute Cave visitor center, and both Mopan Mountain and Zhujiang passenger ports as separate products. The guide records the port-to-city transfer, the lack of ordinary luggage storage, Longtoushan arrival in Yangshuo, and a water-level recovery path. No generic Guilin coordinate, unidentified cave entrance, river bend, or traveler-story rail becomes a pin until the exact identity or verified TikTok/Instagram source passes the evidence bar.

The Yangshuo slice then prevents the downstream county from collapsing into one town pin or a generic “bamboo raft” recommendation. `/regions/yangshuo/` separates Yangshuo County town, Xingping, and the Yulong River corridor as three different base and transport decisions. Its six bilingual anchors preserve Yangshuo Railway Station in Xingping, the Xingping Chaobanshan cruise wharf, the Longtoushan arrival wharf in the county town, Jima and Gongnong as the endpoints of one named Yulong route, and the Shuangliu Ferry Pavilion in Jiuxian as a heritage anchor. The guide distinguishes the motorized Li River sightseeing product from the non-motorized Yulong experience and gives river conditions independent recovery paths. No broad “Yangshuo,” “20-yuan view,” hotel bike pickup, unnamed raft dock, or traveler-story rail becomes a pin until the exact identity or verified TikTok/Instagram source passes the same bar.

With explicit consent, a reviewed private set can also enter a community loop:

`reviewed contribution → city split → duplicate/evidence check → ranked city collection → search and guide discovery → more saves and corrections`

Private inputs remain private by default. Contribution must be opt-in, strip personal context, preserve provenance at an appropriate level, and expose corrections. The useful success metrics are resolved-place rate, successful map handoffs, saves, corrections, and city coverage—not raw social links ingested.

## AI-native shared-location task

The shared object should be a decision workspace, not a generated itinerary:

1. Each person drops captions, OCR text, notes, or lists.
2. The agent extracts candidates and preserves each source line.
3. It resolves English/local names and deduplicates branches.
4. Unresolved items become targeted questions, not silent guesses.
5. Travelers mark each candidate `keep`, `maybe`, or `drop` and add hard constraints.
6. The agent flags distance, reservation, closed-day, pace, and duplicate-experience conflicts.
7. Only then does it propose a route from the kept places.
8. It creates device-specific map queries and says which items still need manual verification.

The static implementation now hands off a versioned reviewed workspace by URL, flags deterministic identity/multi-city conflicts, sequences kept places by city and source order, and creates separate AMap/Apple query handoffs. It explicitly labels this as a snapshot. A complete story still requires shared server state, participant identity, concurrent decisions and history, geographic route optimization, current closures/reservations, and a real POI resolver.

The Shanghai destination digest also proved an important ingestion contract: once a guide hands off explicit numbered `English / Chinese — city` records, nearby narrative prose is evidence, not another extraction surface. Violating that boundary silently turned six reviewed anchors into eight pins. Structured identities now win, and a regression test protects the behavior.

## Destination digest rubric audit

Every one of the 44 destination records is now evaluated against the same six criteria: editorial point of view, usable trip rhythm, execution and recovery advice, bilingual map-ready identities, dated planning sources, and grounded traveler media. The first five criteria gate full-digest treatment; traveler media is tracked independently because missing supply must not be replaced with fabricated UGC.

- **Full destination digests:** Hong Kong, Shanghai, Beijing, Chongqing, Chengdu, Xi’an, Guangzhou, Shenzhen, Hangzhou, Kunming, Dali, Lijiang, Guilin, and Yangshuo.
- **Starter briefs:** Taiwan, Tianjin, Anhui, Fujian, Gansu, Guangdong, Guizhou, Hainan, Hebei, Heilongjiang, Henan, Hubei, Hunan, Jiangsu, Jiangxi, Jilin, Liaoning, Qinghai, Shaanxi, Shandong, Shanxi, Sichuan, Yunnan, Zhejiang, Guangxi, Inner Mongolia, Ningxia, Tibet, Xinjiang, and Macau.

Starter briefs use the same page structure but are explicitly modest, remain `noindex`, and explain what reporting is missing. They are not styled or described as finished Lonely Planet-quality guides. The destination index and Discover surface full digests first, use grounded traveler posters as cover media where available, and label the remaining pages as starter briefs.

## Backend verification boundary

The six Supabase Edge Function entrypoints now pass Deno type checking, and the production URL parser has an executable Deno test proving that TikTok and Instagram are accepted while YouTube is rejected. The source-level backend contract also has four Node tests covering private-schema isolation, atomic submission RPC use, unpublished-evidence privacy, and removal of user/idempotency fields from public visit evidence.

This pass found and corrected a blocking implementation defect: `submit-video` and `place-correction` queried `ctme_private` through `supabase-js`, but that schema is intentionally absent from the Data API's exposed schemas. Those calls could not work even with the service key. Private rate-limit, ingestion-job, correction, and feedback operations now run through narrowly granted service-only `security definer` RPCs. Video registration, durable job creation, and `pgmq.send` share one transaction; duplicate submissions take an advisory lock, increment once, and repair a queued record left without a job by the older non-atomic implementation. Rate limiting now increments atomically. Unpublished status checks no longer return extraction evidence, and the public experience surface omits `user_id` and `client_request_id`.

`supabase/tests/backend_security_test.sql` now contains 21 pgTAP assertions for public/private RLS, function privileges, column privacy, direct-write revocation, hourly rate limiting, duplicate registration, one-job idempotency, and one-message queueing. This is an executable acceptance suite, not evidence that the database passed it on this machine.

The complete local Supabase story is **not yet verified**. On this machine, Docker Desktop's server socket still did not answer a bounded check and the data volume had roughly 4 GB free, so applying the migrations, running the pgTAP suite, exercising all roles/functions against Postgres, consuming the queue, and running database advisors could not be completed. The installed Supabase CLI is also 2.30.4 while 2.109.1 is current. More importantly, there is no production ingestion worker or AMap/Apple/platform credential set: `submit-video` can atomically queue a job once the database exists, but the repository cannot truthfully claim that an arbitrary link proceeds from queued to resolved and published today.

The non-database verification boundary is green: 58 Node tests, two Deno parser tests, all six Edge Function type checks, 64 image-asset checks, and a Node 24 Astro build producing 136 static pages. The build deliberately skips live video snapshot materialization when dedicated Supabase public credentials are absent.

## Next product milestones

1. Add durable browser-flow tests for the remaining auth and provider-handoff claims; extraction and shared-task contracts now have automated coverage.
2. Replace regex-only unknown-place extraction with a resolver that returns canonical bilingual identity and confidence.
3. Store lists and decisions in the authenticated account, not browser local storage.
4. Replace snapshot task links with authenticated invite workspaces, participants, and decision history.
5. Extend the completed quality standard city-first to Zhangjiajie, then another high-demand city such as Suzhou or Nanjing.
6. Free local disk space and restore Docker, then run migration reset, role-by-role RLS tests, all six Edge Functions, a real queue consumer, and Supabase security/performance advisors before calling the backend functional.
