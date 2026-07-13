import materializedVideos from './communityVideoSnapshots.json';
import { nativeEmbedUrl } from '../utils/videoEmbed.js';
export { nativeEmbedUrl };

export type ExperienceVerdict = 'worth_it' | 'mixed' | 'skip';
export type ResolutionState = 'resolved' | 'probable' | 'unresolved';

export interface CommunityPlace {
  id: string; slug: string; name: string; localName: string; city: string; category: string; address: string;
  latitude: number; longitude: number; amapPoiId?: string; applePlaceId?: string; resolution: ResolutionState;
  confidence: number; evidence: string; evidenceType: 'caption' | 'description' | 'title' | 'editorial'; sourceFreshness: string;
}

export interface CommunityVideo {
  id: string; slug: string; platform: 'tiktok' | 'instagram'; externalId: string; sourceUrl: string; title: string;
  collectionSlug?: string;
  creator: string; city: string; poster: string; publishedAt: string; checkedAt: string; durationSeconds: number;
  verdict: ExperienceVerdict; summary: string; views?: number; likes?: number; comments?: number; saves: number;
  wentCount: number; helpfulCount: number; places: CommunityPlace[];
  destinationSlug?: string;
  guideTitle?: string;
  guideBody?: string;
  guideFacts?: { label: string; value: string }[];
  contextSources?: { title: string; url: string }[];
}

const place = (id: string, name: string, localName: string, city: string, category: string, address: string, latitude: number, longitude: number, evidence: string, evidenceType: CommunityPlace['evidenceType'] = 'caption', confidence = 0.94): CommunityPlace => ({
  id, slug: id, name, localName, city, category, address, latitude, longitude,
  resolution: confidence >= 0.9 ? 'resolved' : confidence >= 0.75 ? 'probable' : 'unresolved', confidence, evidence, evidenceType,
  sourceFreshness: 'Official source metadata and place context checked July 12, 2026',
});

const seedCommunityVideos: CommunityVideo[] = [
  {
    id: 'tiktok-7515400928065768712', slug: 'hong-kong-dragon-boats-and-egg-tarts', collectionSlug: 'dragon-boats-harbour-heat-and-egg-tarts', platform: 'tiktok', externalId: '7515400928065768712',
    sourceUrl: 'https://www.tiktok.com/@chang._.a/video/7515400928065768712', title: 'Dragon boats, harbour heat, and egg tarts',
    creator: '창하 CHANGHA', city: 'Hong Kong', destinationSlug: 'hong-kong', poster: 'https://p19-common-sign.tiktokcdn-us.com/tos-alisg-p-0037/o4EvPUIgUYAFKEBICkR67TfbAFDfBCAQYAqobY~tplv-tiktokx-origin.image?dr=9636&x-expires=1784084400&x-signature=gv%2FOrMFu4acabstJBJRFo1KA94E%3D&t=4d5b0474&ps=13740610&shp=81f88b70&shcp=43f4a2f9&idc=useast5',
    publishedAt: '2025-06-14', checkedAt: '2026-07-12', durationSeconds: 0, verdict: 'worth_it',
    summary: 'A June field note that combines the harbour-side dragon boat races with the food-and-street rhythm of a hot Hong Kong day.',
    guideTitle: 'Race day along the Tsim Sha Tsui waterfront',
    guideBody: 'The useful itinerary is a Tsim Sha Tsui waterfront day: arrive by MTR or Star Ferry, watch from the East Promenade, then walk the harbour edge after the races. The egg tart is part of the experience, but the caption does not identify a bakery branch, so it stays a food idea rather than becoming a false pin.',
    guideFacts: [
      { label: 'Shape of the outing', value: 'A half-day harbour plan, not a standalone race pin' },
      { label: 'Useful sequence', value: 'Tsim Sha Tsui East promenade → harbour walk → Star Ferry' },
      { label: 'Verify for your year', value: 'Race date, viewing zone, weather plan, and last transport' },
      { label: 'Deliberately not pinned', value: 'The egg-tart branch; the post never identifies it' },
    ],
    contextSources: [
      { title: 'TikTok oEmbed metadata', url: 'https://www.tiktok.com/oembed?url=https://www.tiktok.com/@chang._.a/video/7515400928065768712' },
      { title: 'HKTB — 2025 race venue at Tsim Sha Tsui East Promenade', url: 'https://www.discoverhongkong.com/content/dam/dhk/intl/corporate/about-hktb/tender-notice/tender-in-progress/eng/2025/01-2025-IDBR-Venue-Setup-Deco-en.pdf' },
    ],
    saves: 41, wentCount: 12, helpfulCount: 36,
    places: [place('tst-east-promenade', 'Tsim Sha Tsui East Promenade', '尖沙咀東部海濱花園', 'Hong Kong', 'Waterfront and event venue', 'Tsim Sha Tsui East, Kowloon, Hong Kong', 22.2947, 114.1775, 'The caption explicitly names the Hong Kong International Dragon Boat Races. Event context places the harbour races on the Tsim Sha Tsui waterfront; the egg-tart shop is not identified and is intentionally not resolved.', 'editorial', 0.91)],
  },
  {
    id: 'tiktok-7511732620582063365', slug: 'hong-kong-snake-soup-needs-a-branch', platform: 'tiktok', externalId: '7511732620582063365',
    sourceUrl: 'https://www.tiktok.com/@araya_vlogs/video/7511732620582063365', title: 'Snake soup after dark—with the shop still a mystery',
    creator: 'Araya Vlogs', city: 'Hong Kong', destinationSlug: 'hong-kong', poster: 'https://p16-common-sign.tiktokcdn-us.com/tos-maliva-p-0068/oAfVQCjzo6n8pREfIdBZQsXCQHFPBoAwP0DJwE~tplv-tiktokx-origin.image?dr=9636&x-expires=1784084400&x-signature=t8qhSoa61jFz3jxYXJbDlKLb33Y%3D&t=4d5b0474&ps=13740610&shp=81f88b70&shcp=43f4a2f9&idc=useast5',
    publishedAt: '2025-06-04', checkedAt: '2026-07-12', durationSeconds: 0, verdict: 'mixed',
    summary: 'The dish is explicit, but neither the caption nor the official metadata names the restaurant or branch.',
    guideTitle: 'Snake soup after dark, with no shop to return to',
    guideBody: 'Save this as a dish to research, not a destination. A trustworthy match needs the storefront, Chinese restaurant name, neighborhood, or address. The tourism board documents Ser Wong Fun in Central as a century-old snake-soup specialist, but that makes it a grounded alternative—not proof that it is the shop in this video.',
    guideFacts: [
      { label: 'What the post proves', value: 'The creator ate snake soup in Hong Kong' },
      { label: 'What it does not prove', value: 'Restaurant, branch, neighborhood, or street address' },
      { label: 'Resolve next', value: 'Capture the storefront, Chinese name, receipt, or creator location tag' },
      { label: 'Safe use now', value: 'Keep it as a dish lead; do not publish a guessed restaurant pin' },
    ],
    contextSources: [
      { title: 'TikTok oEmbed metadata', url: 'https://www.tiktok.com/oembed?url=https://www.tiktok.com/@araya_vlogs/video/7511732620582063365' },
      { title: 'HKTB — Ser Wong Fun snake soup', url: 'https://www.discoverhongkong.com/eng/place-to-go/travel.guide-ser-wong-fun.html' },
    ],
    saves: 18, wentCount: 3, helpfulCount: 14, places: [],
  },
  {
    id: 'tiktok-7330337336170990853', slug: 'kowloon-walled-city-archival-context', platform: 'tiktok', externalId: '7330337336170990853',
    sourceUrl: 'https://www.tiktok.com/@art.arch/video/7330337336170990853', title: 'The lost city behind today’s quiet park',
    creator: 'Art Arch', city: 'Hong Kong', destinationSlug: 'hong-kong', poster: 'https://p19-common-sign.tiktokcdn-us.com/tos-maliva-p-0068/oAE8QJ0fpvVIrCERVlulkEFUET5DZeQBAtju6B~tplv-tiktokx-origin.image?dr=9636&x-expires=1784084400&x-signature=liP9h55%2FphWQh4LqII6NdqA6Yko%3D&t=4d5b0474&ps=13740610&shp=81f88b70&shcp=43f4a2f9&idc=useast5',
    publishedAt: '2024-01-31', checkedAt: '2026-07-12', durationSeconds: 0, verdict: 'mixed',
    summary: 'Compelling historical footage, but the dense settlement in the clip no longer exists; today’s visit is a landscaped park with preserved traces.',
    guideTitle: 'What remains after the Walled City',
    guideBody: 'The correct modern handoff is Kowloon Walled City Park, not a promise that the filmed streets survive. Treat the clip as historical context, then explain what remains, what was reconstructed, and why the park is still worth pairing with the surrounding Kowloon City food scene.',
    guideFacts: [
      { label: 'What the clip is', value: 'Archival context for the former settlement' },
      { label: 'What you can visit', value: 'Kowloon Walled City Park and the traces interpreted there' },
      { label: 'Pair it with', value: 'A separate, named Kowloon City food stop after the park' },
      { label: 'Expectation check', value: 'The dense streets in the footage are not the place visitors see today' },
    ],
    contextSources: [
      { title: 'TikTok oEmbed metadata', url: 'https://www.tiktok.com/oembed?url=https://www.tiktok.com/@art.arch/video/7330337336170990853' },
      { title: 'HKTB — what survives at Kowloon Walled City Park', url: 'https://www.discoverhongkong.com/eng/place-to-go/travel.guide-kowloon-walled-city-park.html' },
    ],
    saves: 27, wentCount: 6, helpfulCount: 25,
    places: [place('kowloon-walled-city-park', 'Kowloon Walled City Park', '九龍寨城公園', 'Hong Kong', 'Historic park', 'Tung Tsing Road, Kowloon City, Hong Kong', 22.3321, 114.1901, 'The title explicitly identifies the former Kowloon Walled City. The current visitor destination is the park on its site, but the video is historical footage rather than evidence of what the park looks like today.', 'editorial', 0.88)],
  },
  {
    id: 'tiktok-7458991420246887686', slug: 'shanghai-bund-west-bank-handoff', collectionSlug: 'the-bund-shanghai-which-side-should-you-save', platform: 'tiktok', externalId: '7458991420246887686',
    sourceUrl: 'https://www.tiktok.com/@dazzling_diamondz97/video/7458991420246887686', title: 'Sunset on the Bund: stone façades behind, neon across the river',
    creator: 'Dazzling', city: 'Shanghai', destinationSlug: 'shanghai',
    poster: 'https://p19-common-sign.tiktokcdn-us.com/tos-maliva-p-0068/o4kfhAfiJgIAEqRCEtQCEXFEy1ApAnDSDFB6CK~tplv-tiktokx-dmt-logom:tos-useast2a-v-0068/osIjeGQHtEudAfGTEgeGLmASAJIulAvbC1BPUI.image?dr=9634&x-expires=1784088000&x-signature=WaiJkZ%2Bp8EY0aDdLsBqBsSNjZUQ%3D&t=4d5b0474&ps=13740610&shp=81f88b70&shcp=43f4a2f9&idc=useast5',
    publishedAt: '2025-01-12', checkedAt: '2026-07-12', durationSeconds: 0, verdict: 'worth_it',
    summary: 'The caption explicitly identifies the Bund, but the useful pin is the west-bank promenade—not a generic skyline point somewhere in Lujiazui.',
    guideTitle: 'Blue hour from the west bank of the Huangpu',
    guideBody: 'The Pudong towers are what the camera faces; the Bund promenade is where the classic view is made. Save 外滩 on Zhongshan East 1st Road, arrive before dusk, and read the historic façades behind you as part of the same visit. A generic “Shanghai skyline” result can otherwise land you on the wrong side of the river.',
    contextSources: [
      { title: 'TikTok oEmbed metadata', url: 'https://www.tiktok.com/oembed?url=https://www.tiktok.com/@dazzling_diamondz97/video/7458991420246887686' },
      { title: 'Shanghai tourism — Huangpu riverside route', url: 'https://english.shanghai.gov.cn/en-CityTour/20250527/0ed4212054564179be6a914ba23c32b1.html' },
      { title: 'OpenStreetMap place identity', url: 'https://www.openstreetmap.org/relation/2142077' },
    ],
    saves: 0, wentCount: 0, helpfulCount: 0,
    places: [place('the-bund-shanghai', 'The Bund promenade', '外滩', 'Shanghai', 'Waterfront and architecture', 'Zhongshan East 1st Road, Huangpu District, Shanghai', 31.2353356, 121.4876320, 'The caption explicitly says “The Bund, Shanghai.” Shanghai tourism identifies the Bund as the historic west-bank architecture route, and the provider identity matches 外滩 in Huangpu.', 'caption', 0.96)],
  },
  {
    id: 'tiktok-7584113343821106445', slug: 'pudong-airport-is-part-of-the-route', collectionSlug: 'pudong-airport-is-an-arrival-task-not-a-doorway', platform: 'tiktok', externalId: '7584113343821106445',
    sourceUrl: 'https://www.tiktok.com/@diana_inseektravel/video/7584113343821106445', title: 'Landing at Pudong after the city has gone to sleep',
    creator: 'Diana_InSeekTravel', city: 'Shanghai', destinationSlug: 'shanghai',
    poster: 'https://p16-common-sign.tiktokcdn-us.com/tos-useast5-p-0068-tx/ocAqXLf4GQCjGA2xAsLAItGfeJeAlAOIIXAHRA~tplv-tiktokx-origin.image?dr=9636&x-expires=1784088000&x-signature=NjE1SIsqk%2BvsbnGXKrQ8oRVVtok%3D&t=4d5b0474&ps=13740610&shp=81f88b70&shcp=43f4a2f9&idc=useast5',
    publishedAt: '2025-12-15', checkedAt: '2026-07-12', durationSeconds: 0, verdict: 'worth_it',
    summary: 'A practical warning about the airport’s scale becomes useful only when it changes the arrival buffer and preserves the exact terminal-to-hotel handoff.',
    guideTitle: 'The long road from Pudong arrivals to a hotel bed',
    guideBody: 'The actionable version is not “PVG is huge.” Save 上海浦东国际机场, your terminal, and the hotel’s Chinese address before landing. Budget for immigration, baggage, terminal or satellite-concourse movement, and the long ride into central Shanghai. If payment, SIM, or transport setup fails, use the International Services Shanghai center in public arrivals before committing to a pickup.',
    contextSources: [
      { title: 'TikTok oEmbed metadata', url: 'https://www.tiktok.com/oembed?url=https://www.tiktok.com/@diana_inseektravel/video/7584113343821106445' },
      { title: 'Shanghai government — 2026 Pudong airport services', url: 'https://english.shanghai.gov.cn/en-Latest-WhatsNew/20260424/88cde5e96ef242daa534102069450a03.html' },
      { title: 'OpenStreetMap place identity', url: 'https://www.openstreetmap.org/relation/19842271' },
    ],
    saves: 0, wentCount: 0, helpfulCount: 0,
    places: [place('shanghai-pudong-airport', 'Shanghai Pudong International Airport', '上海浦东国际机场', 'Shanghai', 'Airport and arrival services', 'Pudong New Area, Shanghai', 31.1427359, 121.8041131, 'The caption explicitly names Shanghai Pudong International Airport and describes its terminal scale. Shanghai Airport Group confirms the arrival-service context, and the bilingual map identity agrees.', 'caption', 0.98)],
  },
  {
    id: 'tiktok-7535834091829169431', slug: 'shanghai-montage-needs-real-place-names', platform: 'tiktok', externalId: '7535834091829169431',
    sourceUrl: 'https://www.tiktok.com/@shadowzoneops/video/7535834091829169431', title: 'Skyscrapers, street food, and a skyline with no names',
    creator: 'ShadowZone oPs', city: 'Shanghai', destinationSlug: 'shanghai',
    poster: 'https://p16-common-sign.tiktokcdn-us.com/tos-no1a-p-0037-no/o8mqTAzM0OCGRrkUA4iiwPBkCSAI7NyIEbfcyl~tplv-tiktokx-origin.image?dr=9636&x-expires=1784088000&x-signature=eFYu5ey6dtTAFobp0UN4t3P2lmA%3D&t=4d5b0474&ps=13740610&shp=81f88b70&shcp=43f4a2f9&idc=useast5',
    publishedAt: '2025-08-07', checkedAt: '2026-07-12', durationSeconds: 0, verdict: 'mixed',
    summary: 'The official caption offers experience categories but no restaurant, viewpoint, address, neighborhood, or branch that can safely become a pin.',
    guideTitle: 'A beautiful Shanghai with nowhere to go',
    guideBody: 'Keep the clip as mood and ask three targeted questions: which river bank produced the skyline, which food stall or restaurant was filmed, and which street held the walking sequence? Until the caption, storefront, OCR, or location tag answers one of them, publishing guessed landmarks would make the city collection less useful.',
    contextSources: [
      { title: 'TikTok oEmbed metadata', url: 'https://www.tiktok.com/oembed?url=https://www.tiktok.com/@shadowzoneops/video/7535834091829169431' },
      { title: 'Shanghai tourism — official city routes for grounded alternatives', url: 'https://english.shanghai.gov.cn/en-CityTour/' },
    ],
    saves: 0, wentCount: 0, helpfulCount: 0, places: [],
  },
  {
    id: 'tiktok-7579246330086771975', slug: 'beijing-forbidden-city-needs-an-entrance', collectionSlug: 'inside-the-forbidden-city-but-where-does-the-visit-actually-begin', platform: 'tiktok', externalId: '7579246330086771975',
    sourceUrl: 'https://www.tiktok.com/@spaaiki04/video/7579246330086771975', title: 'Through Meridian Gate and into the Forbidden City',
    creator: 'Spaaiki', city: 'Beijing', destinationSlug: 'beijing',
    poster: 'https://p16-common-sign.tiktokcdn-us.com/tos-alisg-p-0037/okeuM8DzRQ1wQG5RaHkAXFeuQaG4AENecGgfZc~tplv-tiktokx-origin.image?dr=9636&x-expires=1784088000&x-signature=Fto9weIKDs6IWARq%2FErLg0YmUxA%3D&t=4d5b0474&ps=13740610&shp=81f88b70&shcp=43f4a2f9&idc=useast5',
    publishedAt: '2025-12-02', checkedAt: '2026-07-12', durationSeconds: 0, verdict: 'worth_it',
    summary: 'The caption explicitly places the creator inside Beijing’s Forbidden City, but a useful pin must preserve the museum identity, passport booking, and south-side entrance.',
    guideTitle: 'The south-to-north walk through the Forbidden City',
    guideBody: 'Save 故宫博物院（午门入口）. The Palace Museum is traversed south to north, and official guidance sends foreign visitors with passport bookings through the manual channel at Meridian Gate. “Forbidden City” at map-center level does not tell you which side starts the visit, whether Tian’anmen needs its own clearance, or what document becomes the ticket.',
    contextSources: [
      { title: 'TikTok oEmbed metadata', url: 'https://www.tiktok.com/oembed?url=https://www.tiktok.com/@spaaiki04/video/7579246330086771975' },
      { title: 'Beijing 12345 — foreign-passport Palace Museum entry', url: 'https://english.beijing.gov.cn/12345hotline/faqs/index.html?v=jt' },
    ],
    saves: 0, wentCount: 0, helpfulCount: 0,
    places: [place('palace-museum-meridian-gate', 'Palace Museum via Meridian Gate', '故宫博物院（午门入口）', 'Beijing', 'Museum and required entrance', 'No. 4 Jingshan Front Street, Dongcheng District; visitor entrance at Meridian Gate, Beijing', 39.9174311, 116.3907817, 'The caption explicitly identifies the Forbidden City in Beijing. Official visitor guidance identifies the Palace Museum and directs foreign passport holders to the manual ticket-check channel at Meridian Gate.', 'caption', 0.97)],
  },
  {
    id: 'tiktok-7500919377684860168', slug: 'mutianyu-slide-is-not-the-whole-route', collectionSlug: 'the-mutianyu-slide-is-memorable-the-transport-chain-is-essential', platform: 'tiktok', externalId: '7500919377684860168',
    sourceUrl: 'https://www.tiktok.com/@lili_in_china/video/7500919377684860168', title: 'Riding down from Mutianyu after the Wall',
    creator: 'Lili in China', city: 'Beijing', destinationSlug: 'beijing',
    poster: 'https://p16-common-sign.tiktokcdn-us.com/tos-alisg-p-0037/oEAIUQPegA5LBgwERFfgJoDC4AG8iEElNARvAx~tplv-tiktokx-origin.image?dr=9636&x-expires=1784088000&x-signature=xhECNKeC0OwX40k8XkztdppES9U%3D&t=4d5b0474&ps=13740610&shp=81f88b70&shcp=43f4a2f9&idc=useast5',
    publishedAt: '2025-05-05', checkedAt: '2026-07-12', durationSeconds: 0, verdict: 'worth_it',
    summary: 'The caption names Mutianyu Great Wall and foregrounds the downhill slide, but the traveler still needs the scenic-area entrance and a complete return plan from Huairou.',
    guideTitle: 'The ride down is the easy part of Mutianyu',
    guideBody: 'The safe identity is 慕田峪长城景区 in Mutianyu Village. Decide the city-to-Huairou leg, local transfer or direct service, scenic shuttle, ascent and descent products, and last return before treating the toboggan as a choice. A tour pickup pin, cable-car station, and Great Wall scenic-area entrance are not interchangeable.',
    contextSources: [
      { title: 'TikTok oEmbed metadata', url: 'https://www.tiktok.com/oembed?url=https://www.tiktok.com/@lili_in_china/video/7500919377684860168' },
      { title: 'Beijing government — Mutianyu identity and public transport', url: 'https://english.beijing.gov.cn/travellinginbeijing/attractions/202603/t20260325_4566115.html' },
    ],
    saves: 0, wentCount: 0, helpfulCount: 0,
    places: [place('mutianyu-scenic-area', 'Mutianyu Great Wall scenic-area entrance', '慕田峪长城景区', 'Beijing', 'Great Wall scenic area', 'Mutianyu Village, Bohai Town, Huairou District, Beijing', 40.4344246, 116.5634560, 'The caption explicitly uses the Mutianyu Great Wall tag. Beijing’s official attraction page confirms the scenic area in Mutianyu Village and the Huairou public-transport transfer.', 'caption', 0.98)],
  },
  {
    id: 'tiktok-7536091928375463181', slug: 'beijing-jianbing-needs-a-stall', platform: 'tiktok', externalId: '7536091928375463181',
    sourceUrl: 'https://www.tiktok.com/@travelingsolovlogs/video/7536091928375463181', title: 'A hot jianbing breakfast from an unnamed griddle',
    creator: 'Traveling Solo Vlogs', city: 'Beijing', destinationSlug: 'beijing',
    poster: 'https://p16-common-sign.tiktokcdn-us.com/tos-useast5-p-0068-tx/oEEKAkGKnLCAHEyAERIGg2eqIA2aAbfOHkVber~tplv-tiktokx-origin.image?dr=9636&x-expires=1784088000&x-signature=YbxtJwJZlXaMbArteu6NjZqpgsY%3D&t=4d5b0474&ps=13740610&shp=81f88b70&shcp=43f4a2f9&idc=useast5',
    publishedAt: '2025-08-08', checkedAt: '2026-07-12', durationSeconds: 0, verdict: 'worth_it',
    summary: 'The dish and city are explicit, but the caption supplies no stall name, storefront, neighborhood, address, or location tag.',
    guideTitle: 'Beijing breakfast at an unnamed street griddle',
    guideBody: 'Keep 煎饼 as a breakfast instruction: look for a working griddle near the hotel or a morning market, order the crisp cracker and preferred egg or filling, and compare the storefront with the clip if the creator later supplies it. Do not resolve “best Chinese street food” to a famous restaurant merely because the algorithm wants a pin.',
    contextSources: [
      { title: 'TikTok oEmbed metadata', url: 'https://www.tiktok.com/oembed?url=https://www.tiktok.com/@travelingsolovlogs/video/7536091928375463181' },
    ],
    saves: 0, wentCount: 0, helpfulCount: 0, places: [],
  },
  {
    id: 'tiktok-7303869151976639751', slug: 'chongqing-which-floor-is-ground', collectionSlug: 'which-floor-is-the-ground-floor-in-chongqing', platform: 'tiktok', externalId: '7303869151976639751',
    sourceUrl: 'https://www.tiktok.com/@hughchongqing/video/7303869151976639751', title: 'The plaza where street level is twenty floors up',
    creator: 'Hugh Chongqing', city: 'Chongqing', destinationSlug: 'chongqing', poster: 'https://p19-common-sign.tiktokcdn-us.com/tos-alisg-p-0037/oEEeJyEgQ4AFcEIjN3RyqXfuPyDGBBcInCklRc~tplv-tiktokx-origin.image?dr=9636&x-expires=1784080800&x-signature=pefOkIlyYYGAVeVdlHE82pxTUD8%3D&t=4d5b0474&ps=13740610&shp=81f88b70&shcp=43f4a2f9&idc=useast5',
    publishedAt: '2023-11-20', checkedAt: '2026-07-12', durationSeconds: 0, verdict: 'worth_it',
    summary: 'The viral walk where an ordinary-looking plaza turns out to be more than twenty floors above another street.',
    guideTitle: 'A plaza suspended above another street',
    guideBody: 'Kuixinglou is not a generic Chongqing viewpoint. The field note is valuable because it shows a real pedestrian failure mode: a bridge and plaza can meet one road while another sits far below. Save 魁星楼广场, check the next destination’s Chinese identity before leaving, and use the video to anticipate elevation rather than to reproduce one camera move.',
    guideFacts: [
      { label: 'What the clip proves', value: 'The filmed level change occurs at Kuixinglou Square' },
      { label: 'What the map misses', value: 'Which bridge, plaza level, and building side connect to the next street' },
      { label: 'Route role', value: 'A short city-form lesson between Linjiangmen, Jiefangbei, and the river slope' },
      { label: 'Save with it', value: 'The next entrance or station exit in Chinese, not only another attraction name' },
    ],
    contextSources: [
      { title: 'TikTok oEmbed metadata', url: 'https://www.tiktok.com/oembed?url=https://www.tiktok.com/@hughchongqing/video/7303869151976639751' },
      { title: 'Chongqing government — Yuzhong walk and Kuixing Tower illusion', url: 'https://english.cq.gov.cn/latestnews/Editor/202606/t20260608_15735957.html' },
    ],
    saves: 214, wentCount: 38, helpfulCount: 126,
    places: [place('kuixinglou-square', 'Kuixinglou Square', '魁星楼广场', 'Chongqing', 'Viewpoint', 'Linjiangmen, Yuzhong District, Chongqing', 29.5607, 106.5790, 'The caption asks which floor is ground in Chongqing. Independent place reporting identifies Hugh’s filmed plaza as Kuixinglou.', 'editorial', 0.95)],
  },
  {
    id: 'tiktok-7321071010869038344', slug: 'chongqing-paid-crown-escalator', collectionSlug: 'why-do-you-pay-for-an-escalator-ride-in-chongqing', platform: 'tiktok', externalId: '7321071010869038344',
    sourceUrl: 'https://www.tiktok.com/@hughchongqing/video/7321071010869038344', title: 'Riding the escalator that works like a hillside train',
    creator: 'Hugh Chongqing', city: 'Chongqing', destinationSlug: 'chongqing', poster: 'https://p16-common-sign.tiktokcdn-us.com/tos-alisg-p-0037/ab76794cab5547348ed2544d5c61ddc9_1704569721~tplv-tiktokx-origin.image?dr=9636&x-expires=1784080800&x-signature=nN1F6rNL67iltdPopvEFhOPZ1q0%3D&t=4d5b0474&ps=13740610&shp=81f88b70&shcp=43f4a2f9&idc=useast5',
    publishedAt: '2024-01-06', checkedAt: '2026-07-12', durationSeconds: 0, verdict: 'worth_it',
    summary: 'A useful explanation of why Chongqing’s famous escalator behaves more like hillside public transport than a mall escalator.',
    guideTitle: 'An everyday commute on one of the world’s longest escalators',
    guideBody: 'The Huangguan escalator makes the mountain city legible because it links Lianglukou with the lower railway-station area. Its value is the connection and the everyday commute—not completing a viral-attraction checklist. Recheck the operating notice and payment on arrival, and do not use an old fare or opening time as if it were permanent.',
    guideFacts: [
      { label: 'Correct identity', value: '皇冠大扶梯 at Lianglukou, not any long mall escalator' },
      { label: 'Route role', value: 'A paid slope connection between upper and lower transport levels' },
      { label: 'Verify on the day', value: 'Operating status, direction, fare, and the usable entrance' },
      { label: 'Skip when', value: 'It creates a detour instead of solving the level change in your route' },
    ],
    contextSources: [
      { title: 'TikTok oEmbed metadata', url: 'https://www.tiktok.com/oembed?url=https://www.tiktok.com/@hughchongqing/video/7321071010869038344' },
      { title: 'Chongqing culture and tourism — international visitor route', url: 'https://whlyw.cq.gov.cn/zwxx_221/ztzl/cqgjwlzc/202601/t20260104_15287364.html' },
    ],
    saves: 97, wentCount: 22, helpfulCount: 71,
    places: [place('huangguan-crown-escalator', 'Huangguan Crown Escalator', '皇冠大扶梯', 'Chongqing', 'Urban transport', 'Lianglukou, Yuzhong District, Chongqing', 29.5545, 106.54538, 'The caption explicitly describes Chongqing’s paid escalator. Hugh’s route materials identify it as Huangguan Mountain Escalator.', 'caption', 0.96)],
  },
  {
    id: 'tiktok-7569176738006158610', slug: 'chongqing-city-to-wulong', collectionSlug: 'chongqing-city-lights-to-wulong-karst', platform: 'tiktok', externalId: '7569176738006158610',
    sourceUrl: 'https://www.tiktok.com/@beetrip01/video/7569176738006158610', title: 'City lights tonight, Wulong karst tomorrow',
    creator: 'Bee trip', city: 'Chongqing', destinationSlug: 'chongqing', poster: 'https://p16-common-sign.tiktokcdn-us.com/tos-alisg-p-0037/o8qBcvWVisDCIiiw0VIAAHYfY71IAtChLEAM7n~tplv-tiktokx-origin.image?dr=9636&x-expires=1784080800&x-signature=SiKzwpnekPqtz12N%2Fl3wj3FAJLI%3D&t=4d5b0474&ps=13740610&shp=81f88b70&shcp=43f4a2f9&idc=useast5',
    publishedAt: '2025-10-14', checkedAt: '2026-07-12', durationSeconds: 0, verdict: 'worth_it',
    summary: 'A short-form pairing of central Chongqing at night with the dramatically different Wulong karst day trip.',
    guideTitle: 'One evening in Yuzhong, one full day in Wulong',
    guideBody: 'Hongya Cave and Three Natural Bridges are both valid pins, but they do not belong to one continuous city route. The montage jumps from central Yuzhong to Wulong District. Keep the night landmark in a Chongqing day, then build Wulong around the correct departure, arrival transfer, Xiannüshan Town visitor center, scenic shuttle, walking load, and protected return—or stay overnight.',
    guideFacts: [
      { label: 'City half', value: 'Hongya Cave is in central Yuzhong and works as an evening exterior-view decision' },
      { label: 'Karst half', value: 'Three Natural Bridges is a separate Wulong excursion' },
      { label: 'Missing between cuts', value: 'Intercity travel, onward transfer, ticketing, scenic shuttle, stairs, and return' },
      { label: 'Minimum allocation', value: 'A full day for Wulong; overnight if the connection chain is fragile' },
    ],
    contextSources: [
      { title: 'TikTok oEmbed metadata', url: 'https://www.tiktok.com/oembed?url=https://www.tiktok.com/@beetrip01/video/7569176738006158610' },
      { title: 'Chongqing culture and tourism — Hongya Cave identity', url: 'https://whlyw.cq.gov.cn/zjwl/yzq/jqjd_1/202203/t20220304_10463056.html' },
      { title: 'iChongqing — Wulong Karst and Three Natural Bridges', url: 'https://www.ichongqing.info/attraction/wulong-karst-national-geology-park/amp/' },
    ],
    saves: 142, wentCount: 31, helpfulCount: 88,
    places: [
      place('hongya-cave', 'Hongya Cave', '洪崖洞', 'Chongqing', 'Night landmark', 'Jialing River Road, Yuzhong District, Chongqing', 29.5650738, 106.5753425, 'The caption explicitly names Hongyadong as the illuminated mountain-side night district.'),
      place('wulong-three-natural-bridges', 'Three Natural Bridges', '武隆天生三桥', 'Chongqing', 'Karst landscape', 'Xiannüshan Town, Wulong District, Chongqing', 29.4375, 107.7972, 'The caption explicitly names Wulong and Tian Sheng San Qiao as the natural-stone-bridge day trip.'),
    ],
  },
  {
    id: 'tiktok-7547945126371314951', slug: 'hongyadong-motorbike-behind-scenes', collectionSlug: 'behind-a-chongqing-motorbike-video', platform: 'tiktok', externalId: '7547945126371314951',
    sourceUrl: 'https://www.tiktok.com/@chollaaly/video/7547945126371314951', title: 'How the Hongya Cave motorbike shot was made', creator: 'Chollaaly', city: 'Chongqing', destinationSlug: 'chongqing',
    poster: 'https://p19-common-sign.tiktokcdn-us.com/tos-alisg-p-0037/oIAA2QA5fEiAEtwsDlI2JLfRGGBGvAAQZIeFJe~tplv-tiktokx-origin.image?dr=9636&x-expires=1784080800&x-signature=11kVpwOV2qY3k0rjnh3r6Y%2BSFeg%3D&t=4d5b0474&ps=13740610&shp=81f88b70&shcp=43f4a2f9&idc=useast5',
    publishedAt: '2025-08-18', checkedAt: '2026-07-12', durationSeconds: 0, verdict: 'mixed',
    summary: 'Behind-the-scenes context for a highly stylized Chongqing motorbike clip, useful for separating the filmed experience from the landmark itself.',
    guideTitle: 'The making of a neon-lit motorbike scene',
    guideBody: 'The caption supports Hongya Cave as the location, but a staged motorbike sequence does not establish a public ride, safe filming route, or normal price. Use the post to understand how the image was made, then plan Hongya Cave as a pedestrian night stop with a deliberate exterior viewpoint and crowd exit.',
    contextSources: [
      { title: 'TikTok oEmbed metadata', url: 'https://www.tiktok.com/oembed?url=https://www.tiktok.com/@chollaaly/video/7547945126371314951' },
      { title: 'Chongqing culture and tourism — Hongya Cave identity and address', url: 'https://whlyw.cq.gov.cn/zjwl/yzq/jqjd_1/202203/t20220304_10463056.html' },
    ],
    saves: 58, wentCount: 9, helpfulCount: 34,
    places: [place('hongya-cave', 'Hongya Cave', '洪崖洞', 'Chongqing', 'Night landmark', 'Jialing River Road, Yuzhong District, Chongqing', 29.5650738, 106.5753425, 'The caption includes #hongyadong and asks for the filming location and cost.', 'caption', 0.94)],
  },
  {
    id: 'tiktok-7561015351270591762', slug: 'hongyadong-chongqing-highlights', collectionSlug: 'chongqing-highlights-with-hongyadong', platform: 'tiktok', externalId: '7561015351270591762',
    sourceUrl: 'https://www.tiktok.com/@nexttripholiday/video/7561015351270591762', title: 'Hongya Cave after dark, between spectacle and crowds', creator: 'Next Trip Holiday', city: 'Chongqing', destinationSlug: 'chongqing',
    poster: 'https://p19-common-sign.tiktokcdn-us.com/tos-alisg-p-0037/oIeJO8FceA4WMCAQAByQAdJQLGuXI3LfjUfWAH~tplv-tiktokx-origin.image?dr=9636&x-expires=1784080800&x-signature=A1GZ%2Fy6xD2TS8Rg8NatgCMZ71Yo%3D&t=4d5b0474&ps=13740610&shp=81f88b70&shcp=43f4a2f9&idc=useast5',
    publishedAt: '2025-09-27', checkedAt: '2026-07-12', durationSeconds: 0, verdict: 'mixed',
    summary: 'A promotional city montage retained because it explicitly identifies Hongyadong; commercial framing is shown rather than hidden.',
    guideTitle: 'Hongya Cave as an evening stop, not a whole itinerary',
    guideBody: 'The explicit Hongyadong tag is enough to preserve the place identity, while the promotional pacing is not evidence that the featured city sequence is comfortable or independent. Keep 洪崖洞民俗风貌区 as one evening option, then rebuild the surrounding route using levels, walking load, and the actual interests of the traveler.',
    contextSources: [
      { title: 'TikTok oEmbed metadata', url: 'https://www.tiktok.com/oembed?url=https://www.tiktok.com/@nexttripholiday/video/7561015351270591762' },
      { title: 'Chongqing culture and tourism — Hongya Cave identity and address', url: 'https://whlyw.cq.gov.cn/zjwl/yzq/jqjd_1/202203/t20220304_10463056.html' },
    ],
    saves: 46, wentCount: 7, helpfulCount: 19,
    places: [place('hongya-cave', 'Hongya Cave', '洪崖洞', 'Chongqing', 'Night landmark', 'Jialing River Road, Yuzhong District, Chongqing', 29.5650738, 106.5753425, 'The caption explicitly includes Hongyadong among the highlighted Chongqing stops.')],
  },
  {
    id: 'tiktok-7497255231420452113', slug: 'tuntunzai-capybara-shibati', collectionSlug: 'a-capybara-themed-stop-inside-shibati', platform: 'tiktok', externalId: '7497255231420452113',
    sourceUrl: 'https://www.tiktok.com/@khaminnsroaming/video/7497255231420452113', title: 'Capybaras and steep lanes inside Shibati', creator: 'khaminnsroaming', city: 'Chongqing', destinationSlug: 'chongqing',
    poster: 'https://p19-common-sign.tiktokcdn-us.com/tos-alisg-p-0037/oIUPwAoGQEMaf0bLIAAzcAI4IDgXeFaAUjQfAt~tplv-tiktokx-origin.image?dr=9636&x-expires=1784080800&x-signature=muaSrp8M26mB5BS4eo9WXcTfFKQ%3D&t=4d5b0474&ps=13740610&shp=81f88b70&shcp=43f4a2f9&idc=useast5',
    publishedAt: '2025-03-30', checkedAt: '2026-07-12', durationSeconds: 0, verdict: 'worth_it',
    summary: 'A rare branch-level caption: the creator names Tuntunzai and places it inside Shibati rather than only tagging Chongqing.',
    guideTitle: 'A capybara shop on Shibati’s steep descent',
    guideBody: 'The caption is specific enough to keep 豚豚仔（十八梯） as a shop lead inside the restored district. That specificity also prevents a common error: a theme shop does not become the reason to pin the entire historical area, and the district does not prove the shop is still open. Verify the current storefront, then use Shibati as the larger downhill walking route.',
    contextSources: [
      { title: 'TikTok oEmbed metadata', url: 'https://www.tiktok.com/oembed?url=https://www.tiktok.com/@khaminnsroaming/video/7497255231420452113' },
      { title: 'Chongqing culture and tourism — Shibati district context', url: 'https://whlyw.cq.gov.cn/zwxx_221/ztzl/wlcy/zxcq/202601/t20260121_15342877.html' },
    ],
    saves: 83, wentCount: 14, helpfulCount: 42,
    places: [place('tuntunzai-shibati', 'Tuntunzai, Shibati', '豚豚仔（十八梯）', 'Chongqing', 'Theme shop', 'Shibati Traditional Scenic Area, Yuzhong District, Chongqing', 29.5537658, 106.5696236, 'The caption explicitly names Tuntunzai and says it is inside Shibati, Chongqing.', 'caption', 0.91)],
  },
];

export const communityVideos: CommunityVideo[] = materializedVideos.length ? (materializedVideos as CommunityVideo[]) : seedCommunityVideos;
export const allCommunityPlaces = Array.from(new Map(communityVideos.flatMap((video) => video.places).map((item) => [item.id, item])).values());
export const getCommunityVideo = (slug: string) => communityVideos.find((video) => video.slug === slug);
export const getCommunityPlace = (slug: string) => allCommunityPlaces.find((item) => item.slug === slug);
export const videosForPlace = (placeId: string) => communityVideos.filter((video) => video.places.some((item) => item.id === placeId));
export function formatMetric(value?: number) { if (!value) return '—'; return new Intl.NumberFormat('en-US', { notation: 'compact', maximumFractionDigits: 1 }).format(value); }
export function verdictLabel(verdict: ExperienceVerdict) { return verdict === 'worth_it' ? 'Worth it' : verdict === 'skip' ? 'Skip' : 'Mixed'; }
