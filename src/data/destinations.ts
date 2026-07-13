import { requireGeneratedImage } from './generatedImages';
import { backpackerPlaces, type BackpackerPlace } from './backpackerPlaces';

export interface DestinationImage {
  src: string;
  alt: string;
  source: string;
  title: string;
}

export interface Destination {
  name: string;
  slug: string;
  type: 'City' | 'Municipality' | 'Province' | 'Autonomous region' | 'Special administrative region' | 'Traveler search region';
  summary: string;
  why: string;
  featured?: boolean;
  guideIds: string[];
  mapQuery: string;
  mapPin: {
    x: number;
    y: number;
  };
  places: BackpackerPlace[];
  editorial?: {
    dek: string;
    sections: Array<{
      title: string;
      body: string;
    }>;
    quickFacts: Array<{
      label: string;
      value: string;
    }>;
    sources: Array<{
      title: string;
      url: string;
    }>;
    checkedAt?: string;
  };
  image: DestinationImage;
}

const defaultGuideIds = [
  'china-pre-departure-checklist',
  'alipay-wechat-pay-foreign-cards',
  'internet-esim-vpn-blocked-apps',
  'translation-language-survival',
];

const destinationRecords: Omit<Destination, 'image' | 'mapPin'>[] = [
  {
    name: 'Hong Kong',
    slug: 'hong-kong',
    type: 'Special administrative region',
    summary: 'Visa-free exit point, food, transit, skyline',
    why: 'Hong Kong is one of the easiest add-ons to a mainland China trip and a practical exit point for transit-visa routing.',
    featured: true,
    guideIds: ['china-visa-free-2026', 'china-pre-departure-checklist', 'street-food-night-markets', 'internet-esim-vpn-blocked-apps'],
    mapQuery: 'Hong Kong',
    editorial: {
      dek: 'Hong Kong is not a skyline stop between flights. Read it as two dense urban shores stitched together by ferries, trains, trams, and buses, with beaches and hiking ridges close enough to reset the trip in half a day.',
      sections: [
        {
          title: 'Read the city across the harbour',
          body: 'Kowloon is the stronger first base for street-level Hong Kong: Yau Ma Tei and Jordan put markets, old apartment blocks, noodle shops, and the harbour within one continuous walk. Hong Kong Island is the vertical counterpoint—Central and Sheung Wan climb from ferry piers through trading streets, temples, galleries, and residential slopes. Cross by Star Ferry at least once instead of treating the harbour as scenery seen through glass.',
        },
        {
          title: 'Build two days with contrast',
          body: 'Give the first day to the working city: breakfast and markets in Sham Shui Po, a slow southbound wander through Mong Kok and Yau Ma Tei, then Temple Street after dark. On the second day, ride the tram across the north side of Hong Kong Island, walk Sheung Wan and Sai Ying Pun, and choose one change of pace—a ridge hike such as Dragon’s Back, a ferry island, or a beach. The pleasure comes from changing speed, not collecting attractions.',
        },
        {
          title: 'Stay where evenings remain walkable',
          body: 'Yau Ma Tei and Jordan are the value choice for a first visit: airport and rail connections are simple, rooms are often cheaper than Central, and late meals do not require another cross-city journey. Tsim Sha Tsui works for harbour views but feels more visitor-facing. Sheung Wan and Sai Ying Pun cost more, yet reward travelers who want cafes, old streets, and an easier start on Hong Kong Island.',
        },
        {
          title: 'Reset your mainland-China setup',
          body: 'Hong Kong has separate immigration, currency, transport payment, and mobile-service habits from mainland China. Keep your passport and onward booking available when crossing the boundary. Buy or add a tourist Octopus for MTR, buses, ferries, trams, and small purchases; do not assume a mainland-only Alipay or WeChat setup replaces it everywhere. English signage is common, but saving the Chinese place name still helps with older restaurants and taxis.',
        },
        {
          title: 'Use food videos to choose a neighborhood, then resolve the shop',
          body: 'A clip of snake soup, egg tarts, roast meat, or a dai pai dong is useful first as a reason to spend time in Central, Sham Shui Po, Jordan, or Kowloon City. It becomes a reliable stop only when the storefront, Chinese name, branch, and opening pattern agree. If the creator names only the dish, keep it as an eating brief and find a grounded option nearby; do not silently substitute the most famous search result.',
        },
        {
          title: 'Give Kowloon City a real half-day',
          body: 'Kowloon Walled City footage needs a time correction: the settlement shown in archival video no longer survives as a walkable district. Visit the park for its preserved traces and interpretation, then use the surrounding Kowloon City streets for a separate food stop you can identify by name. This pairing is stronger than treating the park as a backdrop or promising visitors the dense alleys they saw online.',
        },
        {
          title: 'Build a weather-and-energy escape into every day',
          body: 'Hong Kong distances look small while heat, humidity, stairs, flyovers, and station transfers quietly add load. Keep one air-conditioned pause, one simple exit by MTR or taxi, and one indoor alternative for each outdoor block. On a ridge or island day, carry water and turn around before the return connection becomes the problem; in the urban core, use ferries and trams as recovery time rather than treating every transfer as dead time.',
        },
      ],
      quickFacts: [
        { label: 'Best first base', value: 'Yau Ma Tei or Jordan for food, transit, and late walks' },
        { label: 'Transport default', value: 'Octopus plus MTR; use buses, trams, and ferries for the city itself' },
        { label: 'Plan length', value: 'Three full days; add one for a hike, beach, or island' },
        { label: 'Mainland handoff', value: 'Treat border, payments, maps, and mobile data as a separate setup check' },
        { label: 'Video-to-map rule', value: 'Resolve the storefront or venue; keep an unnamed dish as a lead, not a false pin' },
        { label: 'Daily recovery', value: 'One indoor pause and one simple MTR, ferry, tram, or taxi exit' },
      ],
      checkedAt: '2026-07-12',
      sources: [
        { title: 'Hong Kong Tourism Board: getting around', url: 'https://www.discoverhongkong.com/eng/travel-guide/traveller-essentials/getting-around.html' },
        { title: 'MTR: using Octopus', url: 'https://www.mtr.com.hk/en/customer/tickets/about_octopus.html' },
        { title: 'Hong Kong Tourism Board: Sham Shui Po and Mei Ho House', url: 'https://www.discoverhongkong.com/eng/place-to-go/travel.guide-yha-mei-ho-house-youth-hostel.html' },
        { title: 'Hong Kong Tourism Board: Tin Hau Temple, Yau Ma Tei', url: 'https://www.discoverhongkong.com/eng/place-to-go/travel.guide-tin-hau-temple-at-yau-ma-tei.html' },
        { title: 'Hong Kong Tourism Board: Tsim Sha Tsui Promenade', url: 'https://www.discoverhongkong.com/eng/place-to-go/travel.guide-tsim-sha-tsui-promenade.html' },
        { title: 'Hong Kong Tourism Board: Man Mo Temple', url: 'https://www.discoverhongkong.com/eng/place-to-go/travel.guide-man-mo-temple.html' },
        { title: 'Hong Kong Tourism Board: Kowloon Walled City Park', url: 'https://www.discoverhongkong.com/eng/place-to-go/travel.guide-kowloon-walled-city-park.html' },
        { title: "Hong Kong Tourism Board: Dragon's Back route", url: 'https://www.discoverhongkong.com/eng/interactive-map/dragon-s-back-hike.html' },
      ],
    },
  },
  {
    name: 'Taiwan',
    slug: 'taiwan',
    type: 'Traveler search region',
    summary: 'Often searched with Greater China travel planning',
    why: 'Taiwan is often planned alongside mainland China, Hong Kong, Macau, Korea, or Japan routes, especially when travelers compare food, transport, and entry logistics.',
    featured: true,
    guideIds: ['china-visa-free-2026', 'internet-esim-vpn-blocked-apps', 'translation-language-survival', 'food-ordering-dietary'],
    mapQuery: 'Taiwan',
  },
  {
    name: 'Shanghai',
    slug: 'shanghai',
    type: 'Municipality',
    summary: 'Arrival logistics, skyline, longtang lanes',
    why: 'Shanghai is the easiest first landing point for many visitors: strong international flight access, modern metro coverage, nearby water towns, and useful contrast with older neighborhoods.',
    featured: true,
    guideIds: ['china-attraction-tickets-reservations', '7-day-china-itinerary', 'neighborhoods-beyond-landmarks', 'food-ordering-dietary', 'alipay-wechat-pay-foreign-cards'],
    mapQuery: 'Shanghai China',
    editorial: {
      dek: 'Shanghai makes sense when you stop asking whether it is “old China” or “future China.” The rewarding trip moves between the trading-city architecture on the Huangpu, the residential and retail streets west of the river, working parks and food counters, and one serious museum or art district.',
      sections: [
        {
          title: 'Read the city from the west bank',
          body: 'Start with the Bund, but face both ways: Pudong is the skyline; the Bund is the older commercial city that made that skyline possible. Cross to Lujiazui only for a specific museum, tower, or river view. Otherwise keep the first day in Puxi, where Yuyuan, Rockbund, Suzhou Creek, East Nanjing Road, and the Bund can form one continuous story instead of five disconnected pins.',
        },
        {
          title: 'Day one: old city to river after dark',
          body: 'Begin early around Yuyuan, deciding whether you want the paid garden or only the surrounding old-city streets and bazaar. Continue north through the Bund architecture or along Suzhou Creek, pause rather than shop your way down East Nanjing Road, and reach the promenade before dusk. The order matters: daylight reveals the façades, blue hour joins both banks, and the lights become the ending rather than the entire experience.',
        },
        {
          title: 'Day two: use one viral corner as a doorway',
          body: 'Start at Wukang Building, then leave the photo crowd for Wukang, Anfu, Wuyuan, Yongfu, or the streets toward Fuxing Park. This is a four-to-six-hour walk, not a chain of cafes to queue for. Add one meal you can identify in Chinese and one public space. Xintiandi is useful for seeing restored shikumen form, but its luxury finish should not be mistaken for ordinary lane life.',
        },
        {
          title: 'Give the third day a point of view',
          body: 'Choose culture, not leftovers. Shanghai Museum East is the high-value collection day and currently admits individual visitors without advance reservation, but it closes Tuesday. M50 plus Suzhou Creek works for smaller galleries and industrial reuse. A clear day can justify Pudong architecture; rain or extreme heat should push the museum higher. Add Suzhou or Hangzhou only after Shanghai has had roughly three full days.',
        },
        {
          title: 'Stay for the city you want after dinner',
          body: 'Jing’an is the easiest all-round first base: central metro access, food, shopping, and short rides in several directions. Xuhui or the edge of the former concession rewards walkers and cafe-led mornings. People’s Square is efficient for a very short landmark visit. Deep Pudong can be excellent for business or a specific venue, but it is a poor default if most evenings end west of the river.',
        },
        {
          title: 'Make arrival part of the itinerary',
          body: 'Pudong Airport is vast enough to deserve its own buffer. Save the terminal, hotel’s Chinese name and address, and intended ride before landing. If mobile payment, connectivity, or transport setup fails, use the International Services Shanghai center in the public arrivals hall before leaving. AMap now has multilingual navigation and ride-hailing, but the Chinese POI remains the best identity check when an English result is vague.',
        },
      ],
      quickFacts: [
        { label: 'Best first base', value: 'Jing’an for all-round access; Xuhui for street-led days' },
        { label: 'Useful minimum', value: 'Three full days: river city, neighborhood city, then one culture day' },
        { label: 'Map default', value: 'AMap plus the Chinese POI; use Apple Maps as a second provider check' },
        { label: 'Crowd correction', value: 'Use Wukang Building and East Nanjing Road as gateways, not whole-day destinations' },
        { label: 'Rain or heat plan', value: 'Shanghai Museum East; it is closed Tuesday, so recheck before travel' },
        { label: 'Arrival fallback', value: 'Use the airport one-stop center before leaving with an unworkable phone or payment setup' },
      ],
      checkedAt: '2026-07-12',
      sources: [
        { title: 'Shanghai government: Huangpu riverside route', url: 'https://english.shanghai.gov.cn/en-CityTour/20250527/0ed4212054564179be6a914ba23c32b1.html' },
        { title: 'Shanghai government: Wukang–Anfu city walk', url: 'https://english.shanghai.gov.cn/en-FAQs-StudyinShanghai/20251124/9f1658ae899240d19c52784bddfed782.html' },
        { title: 'Shanghai Museum East visitor guide', url: 'https://english.shanghai.gov.cn/en-MuseumsGalleries/20241205/756c96bd7dd940378b9ac056f11429e2.html' },
        { title: 'Shanghai government: multilingual AMap', url: 'https://english.shanghai.gov.cn/en-Latest-WhatsNew/20250711/8f2fcf3c6b624a56a6b2c0d8152ea2f2.html' },
        { title: 'Shanghai government: Pudong airport services', url: 'https://english.shanghai.gov.cn/en-Latest-WhatsNew/20260424/88cde5e96ef242daa534102069450a03.html' },
      ],
    },
  },
  {
    name: 'Beijing',
    slug: 'beijing',
    type: 'Municipality',
    summary: 'Imperial sights, hutongs, Great Wall access',
    why: "Beijing anchors classic first trips because it combines Forbidden City logistics, hutong neighborhoods, Great Wall day trips, and high-speed rail links to Xi'an and Shanghai.",
    featured: true,
    guideIds: ['china-attraction-tickets-reservations', '7-day-china-itinerary', 'neighborhoods-beyond-landmarks', 'china-high-speed-trains', 'china-visa-free-2026'],
    mapQuery: 'Beijing China',
    editorial: {
      dek: 'Beijing rewards travelers who read it as a city of axes, gates, walls, parks, and lived lanes—not as a race between imperial superlatives. The hard part is sequencing: reservations and one-way entrances determine the central day; distance determines the Wall day; weather, closures, and walking load determine everything else.',
      sections: [
        {
          title: 'Build the trip around dependencies, not rankings',
          body: 'Place the Palace Museum reservation first, keep its Monday closure in view, then build the central-axis day south to north: Tian’anmen if separately cleared, Meridian Gate, the palace courtyards, Shenwu Gate, and Jingshan. This is one long, exposed walking sequence with security checks—not five nearby pins. Keep the physical passport used for every booking and do not schedule a timed lunch across town.',
        },
        {
          title: 'Day one: use the imperial axis once, properly',
          body: 'Enter the Palace Museum through Meridian Gate and resist spending equal time in every courtyard. Read the progression of thresholds, choose one side-hall collection, and leave enough energy for Jingshan. The view from Wanchun Pavilion explains the geometry better than another hour inside. Tian’anmen Square is adjacent but operationally separate: reserve it rather than assuming a palace ticket or a same-day walk-up will clear every checkpoint.',
        },
        {
          title: 'Day two: see ritual become ordinary city life',
          body: 'Reach the Temple of Heaven near opening, when exercise groups and walkers make the surrounding park as important as the paid halls. Then change scale completely: choose Gulou–Shichahai for the northern axis or Xisi–White Pagoda for quieter west-city lanes. One neighborhood walked slowly is stronger than Nanluoguxiang, Qianmen, and Wangfujing compressed into a retail crawl.',
        },
        {
          title: 'Day three: give the Great Wall the whole day',
          body: 'Mutianyu is in Huairou, not “outside downtown” in the casual sense. Resolve the scenic-area entrance, outbound service, transfer or pickup, shuttle, cable-car direction, and last return before leaving the hotel. Weather changes the value of the trip: haze reduces the long views, rain makes stone slick, and summer heat makes an early ascent worth more than a late discount. Treat the toboggan as an optional descent, not the reason to choose the section.',
        },
        {
          title: 'Use the fourth day to choose a Beijing',
          body: 'Choose palace landscape at the Summer Palace, contemporary reuse at 798, or a deeper neighborhood-and-museum day; do not call all three “free time.” The Summer Palace needs half a day and a route around Kunming Lake. 798 is strongest when current exhibitions justify the cross-city ride. A hutong day is not empty time: pair a defined walk with one temple, small museum, meal, and park so the city’s domestic scale can compete with its monuments.',
        },
        {
          title: 'Stay for the first departure, not the last landmark',
          body: 'Dongsi or Zhangzizhonglu is the balanced first base for hutongs, multiple metro lines, and evenings with ordinary restaurants. Dongzhimen is operationally excellent for the airport and Huairou-bound transport. Wangfujing and Qianmen simplify the central sights but can feel visitor-facing after dinner. A hotel near Beijing South only makes sense when a very early train outweighs three days of extra city travel.',
        },
        {
          title: 'Keep a closure-and-booking recovery day',
          body: 'Do not let one sold-out ticket collapse Beijing. Jingshan, Beihai, municipal parks, neighborhood walks, and many smaller museums or temples have on-site or lower-friction entry. Put the Great Wall, parks, or hutongs on Monday when the Palace Museum and many interiors close. If the official Palace allocation is gone, the Meridian Gate service window has recently assisted foreign-passport visitors, but capacity is not promised—arrive with a real alternative rather than treating a community workaround as policy.',
        },
      ],
      quickFacts: [
        { label: 'Useful minimum', value: 'Four full days: central axis, park plus neighborhood, Great Wall, and one chosen depth day' },
        { label: 'Best first base', value: 'Dongsi/Zhangzizhonglu for balance; Dongzhimen for airport and Wall logistics' },
        { label: 'Booking priority', value: 'Palace Museum first; handle Tian’anmen as a separate reservation dependency' },
        { label: 'Entrance identity', value: 'Save 故宫博物院（午门入口）, not only a map center for “Forbidden City”' },
        { label: 'Monday recovery', value: 'Great Wall, parks, and hutong walks; verify every indoor venue separately' },
        { label: 'Walking reality', value: 'Central-axis and palace days are long, exposed, and security-check heavy' },
      ],
      checkedAt: '2026-07-12',
      sources: [
        { title: 'Beijing 12345: Palace Museum and Tian’anmen booking for foreign visitors', url: 'https://english.beijing.gov.cn/12345hotline/faqs/index.html?v=jt' },
        { title: 'Beijing government: Tian’anmen Square visitor information', url: 'https://english.beijing.gov.cn/travellinginbeijing/attractions/202603/t20260325_4566110.html' },
        { title: 'Beijing government: Temple of Heaven tickets and interior access', url: 'https://english.beijing.gov.cn/specials/ticketing/parks/202407/t20240719_3753312.html' },
        { title: 'Beijing government: Mutianyu identity and public transport', url: 'https://english.beijing.gov.cn/travellinginbeijing/attractions/202603/t20260325_4566115.html' },
        { title: 'Beijing government: 2026 hutong and city-walk routes', url: 'https://english.beijing.gov.cn/travellinginbeijing/routes/202606/t20260611_4696224.html' },
      ],
    },
  },
  {
    name: 'Tianjin',
    slug: 'tianjin',
    type: 'Municipality',
    summary: 'Port-city architecture and Beijing side trips',
    why: 'Tianjin works best as a short rail side trip from Beijing, especially for architecture, riverside walks, and food.',
    guideIds: ['china-high-speed-trains', 'didi-metro-getting-around', ...defaultGuideIds],
    mapQuery: 'Tianjin China',
  },
  {
    name: 'Chongqing',
    slug: 'chongqing',
    type: 'Municipality',
    summary: 'Mountain city, hotpot, Yangtze gateway',
    why: 'Chongqing is a high-impact food and city-form destination, but stairs, hills, spicy food, and airport-to-hotel logistics need extra planning.',
    guideIds: ['street-food-night-markets', 'food-ordering-dietary', 'didi-metro-getting-around', 'translation-language-survival'],
    mapQuery: 'Chongqing China',
    editorial: {
      dek: 'Chongqing is not difficult because it is chaotic; it is difficult because an ordinary two-dimensional map hides the city’s real structure. Streets stack above streets, bridges arrive at upper floors, trains cut through slopes, and a five-minute route can end at the right building on the wrong level.',
      sections: [
        {
          title: 'Learn the vertical city before collecting landmarks',
          body: 'Use the first daylight hours to understand one Yuzhong slope. Ride Line 2 to Liziba, watch the train from the dedicated platform, then travel rather than walk to a second level-change anchor such as Kuixinglou or the Huangguan escalator. Save the entrance, exit, bridge, or plaza shown in a video—not only the attraction name—and expect AMap’s walking route to need a visual check at the final hundred metres.',
        },
        {
          title: 'Day one: Yuzhong from upper city to river',
          body: 'Begin around Jiaochangkou and walk down through Shibati while legs and daylight are on your side. Reset with a meal away from the busiest photo streets, then continue toward Jiefangbei, Kuixinglou, and the Jialing river edge. See Hongya Cave after dark from a deliberate exterior viewpoint; entering the complex, photographing its façade, and crossing it as a route are three different tasks.',
        },
        {
          title: 'Day two: choose ordinary neighborhoods over another montage',
          body: 'Take a ferry, rail line, or bridge to change perspective, then commit to one district such as Shapingba and Ciqikou, Nan’an’s hillside streets, or a quieter residential-and-food route outside the Jiefangbei core. Ciqikou is most readable early, before its main commercial lane fills; leave the central strip for side lanes and a tea break. Do not spend the second day reproducing the same skyline shot from six viewpoints.',
        },
        {
          title: 'Eat hotpot with a branch, not a superlative',
          body: 'A creator saying “best hotpot in Chongqing” is evidence for a meal category, not yet a place. Resolve the Chinese storefront name, branch, current address, queue system, broth choice, and whether the restaurant works for a solo diner or dietary restriction. Order a split pot if heat tolerance varies, add cooling and non-spicy dishes, and keep the hotel address ready for the trip home after a late meal.',
        },
        {
          title: 'Stay where the last level change is manageable',
          body: 'Jiaochangkou is the practical first base for metro access and walking into Shibati or Jiefangbei. Lianglukou works for transport and a less polished local context. River-view hotels can be dramatic while placing the lobby, taxi drop-off, and metro on different levels, so confirm the Chinese hotel name, road entrance, and nearest usable station exit before booking—not just the straight-line distance.',
        },
        {
          title: 'Give Wulong its own transport chain',
          body: 'Three Natural Bridges lies in Wulong District, far beyond central Chongqing. A workable day links the correct departure station, arrival in Wulong, onward transport to Xiannüshan Town or the visitor center, scenic shuttle, substantial walking and stairs, and a protected return. Weather and daylight matter more here than a viral ranking. If any connection is uncertain, stay near Xiannüshan Town rather than compressing the karst between two city nights.',
        },
        {
          title: 'Read traveler video as evidence, not teleportation',
          body: 'Chongqing clips are unusually good at showing scale, sound, crowd energy, and impossible-looking transitions. They are unusually bad at showing the walking load between cuts. Open the cited place, compare the Chinese identity and district, retain the creator’s warning or context, and reject any route that silently joins two levels or jumps from central Chongqing to Wulong.',
        },
      ],
      quickFacts: [
        { label: 'Useful minimum', value: 'Three city days; add a full day or overnight for Wulong' },
        { label: 'Best first base', value: 'Jiaochangkou for the core; confirm the hotel road entrance and lobby level' },
        { label: 'Map rule', value: 'Save level, entrance, station exit, and Chinese POI—not only longitude and latitude' },
        { label: 'First route', value: 'One daylight vertical-city lesson, then Yuzhong from upper streets toward the river' },
        { label: 'Food rule', value: 'Resolve the current Chinese branch before turning a dish or superlative into a pin' },
        { label: 'Wulong rule', value: 'Treat rail, onward transfer, visitor center, scenic shuttle, and return as one dependency chain' },
      ],
      checkedAt: '2026-07-12',
      sources: [
        { title: 'Chongqing government: current Yuzhong city walk through Kuixinglou and Shibati', url: 'https://english.cq.gov.cn/latestnews/Editor/202606/t20260608_15735957.html' },
        { title: 'Chongqing culture and tourism: international visitor route including Liziba and central Chongqing', url: 'https://whlyw.cq.gov.cn/zwxx_221/ztzl/cqgjwlzc/202601/t20260104_15287364.html' },
        { title: 'Chongqing culture and tourism: Hongya Cave identity and address', url: 'https://whlyw.cq.gov.cn/zjwl/yzq/jqjd_1/202203/t20220304_10463056.html' },
        { title: 'Chongqing culture and tourism: Shibati district context', url: 'https://whlyw.cq.gov.cn/zwxx_221/ztzl/wlcy/zxcq/202601/t20260121_15342877.html' },
        { title: 'Chongqing culture and tourism: Ciqikou historic district context', url: 'https://whlyw.cq.gov.cn/zwxx_221/wlyw/202409/t20240914_13633682.html' },
        { title: 'iChongqing: Wulong Karst and Three Natural Bridges', url: 'https://www.ichongqing.info/attraction/wulong-karst-national-geology-park/amp/' },
      ],
    },
  },
  {
    name: 'Chengdu',
    slug: 'chengdu',
    type: 'City',
    summary: 'Tea houses, Sichuan food, pandas, lived-in neighborhoods',
    why: 'Chengdu works when pandas and famous food become entry points to a slower city of parks, temples, museums, river walks, and neighborhood evenings—not the whole itinerary.',
    featured: true,
    guideIds: ['tea-houses-and-rituals', 'street-food-night-markets', 'food-ordering-dietary', 'neighborhoods-beyond-landmarks', 'didi-metro-getting-around'],
    mapQuery: '成都市 四川省',
    editorial: {
      dek: 'Chengdu’s reputation for being relaxed is easy to turn into a checklist of pandas, hotpot, and reconstructed shopping streets. A better trip protects time to sit, builds around one early reservation, and uses exact Chinese identities to separate a park from its teahouse, a dish from a restaurant branch, and Chengdu itself from a Sichuan day trip.',
      sections: [
        {
          title: 'Build the trip around one early start and one long sit',
          body: 'The Panda Base is the only city essential that should dictate a morning. Give it the early slot and carry the original ID used for the real-name reservation. Give a different day to People’s Park and Heming Tea House, where the point is not to photograph a covered bowl and leave but to sit long enough to notice cards, conversation, matchmaking notices, and the ordinary use of public space. Those two rhythms—early and deliberate, then slow and open-ended—explain Chengdu better than a ranked attraction list.',
        },
        {
          title: 'Day one: learn the city before consuming its image',
          body: 'Start at Chengdu Museum for the Jinsha-era foundations, shadow puppetry, and urban history that make later temples and neighborhoods legible. Walk or take the metro to People’s Park, then decide whether Heming Tea House is the experience you want or merely the most famous table. Continue toward the Kuanzhai area only as a short architectural and commercial contrast; do not give the reconstructed retail lanes the time that belongs to the park, museum, or an ordinary dinner street.',
        },
        {
          title: 'Day two: treat the Panda Base as a campus, not a pin',
          body: 'The base covers roughly 238 hectares and has South and West gates, internal zones, museums, and a sightseeing-bus network. Save the gate you intend to enter, not only the campus center. Reserve a dated morning or afternoon slot, arrive with the same passport or identity document, and accept that animals may choose indoor spaces or rotate away from high-traffic enclosures. After the visit, use Wenshu Monastery as a quiet, central counterweight rather than squeezing another outlying attraction into the same day.',
        },
        {
          title: 'Day three: choose neighborhood life over a second tourist street',
          body: 'Use Yulin West Road as a bounded evening area rather than one magic pin: start near Fangcao Street, walk the side streets, and choose a cafe, bar, noodle shop, or restaurant only after confirming the Chinese storefront and current branch. Wuhou Shrine is the stronger paid stop when Three Kingdoms history matters; adjacent Jinli is the commercial afterword, not a second historical site. If that history does not interest you, keep the day for Yulin, a park, and one food mission instead.',
        },
        {
          title: 'Eat by format, branch, and tolerance—not fame',
          body: 'Hotpot, chuanchuan, tianshuimian, mapo tofu, rabbit, and small snacks describe different meal formats and risks. A short video naming only “Chengdu hotpot” is a lead, not a resolved place. Confirm the Chinese restaurant name, branch, queue method, broth, portion pattern, and whether the group can share spice and dietary constraints. For a medical allergy, a vegan diet, or celiac disease, do not infer safety from “not spicy”; stock, oils, sauces, and shared cooking surfaces are separate questions.',
        },
        {
          title: 'Choose the airport before choosing the hotel',
          body: 'Chengdu has both Tianfu International Airport and Shuangliu International Airport. They are not interchangeable arrival labels. Save the airport code, terminal, hotel’s Chinese name, and planned ride before landing; Tianfu in particular can turn a late arrival or short layover into a distance problem. For a first city stay, the central belt around Tianfu Square, People’s Park, and the metro is operationally easier than choosing a room from a straight-line map view.',
        },
        {
          title: 'Keep Sichuan excursions outside the city edition',
          body: 'Leshan, Dujiangyan and Mount Qingcheng, Sanxingdui, Jiuzhaigou, and western Sichuan are not extra Chengdu pins. Each creates its own booking, station, last-mile, weather, and return chain. Add one only after the city has at least two full days, and save it to a separate day or collection so a creator’s quick montage cannot hide the transfer. This is the practical difference between a Chengdu map and a Sichuan wish list.',
        },
      ],
      quickFacts: [
        { label: 'Useful minimum', value: 'Three full city days; add a separate day for each Sichuan excursion' },
        { label: 'Best first base', value: 'Tianfu Square or the central People’s Park belt for metro access and a workable first arrival' },
        { label: 'Panda rule', value: 'Reserve with the carried ID and save South or West Gate—not a generic campus center' },
        { label: 'Tea rule', value: 'People’s Park and Heming Tea House are nested identities; sit before deciding what the experience was worth' },
        { label: 'Food rule', value: 'A dish or “best hotpot” claim remains a lead until the current Chinese branch is confirmed' },
        { label: 'Airport rule', value: 'Confirm TFU or CTU, terminal, hotel Chinese name, and the full arrival ride before landing' },
      ],
      checkedAt: '2026-07-13',
      sources: [
        { title: 'Chengdu Museum: current visitor guide and opening pattern', url: 'https://www.cdmuseum.com/en/zhinan/' },
        { title: 'Chengdu Panda Base: real-name reservations and entry periods', url: 'https://www.panda.org.cn/en/service/ticket/' },
        { title: 'Chengdu Panda Base: campus scale and visitor zones', url: 'https://www.panda.org.cn/en/about/introduction/' },
        { title: 'Chengdu Panda Base: South and West gate visitor services', url: 'https://m.panda.org.cn/en/service/notice/' },
        { title: 'GoChengdu: first-trip bases, two airports, and city transport', url: 'https://www.gochengdu.cn/en/article/column_164618479376578/919' },
        { title: 'GoChengdu city guide: Wenshu Monastery and Heming Tea House', url: 'https://file.gochengdu.cn/file/20230418/72d8a7cf129f5d5027a132a6c7af3d93.pdf' },
        { title: 'Chengdu People’s Park: Heming Tea House history', url: 'https://cdpeoplespark.cn/go-c120.htm' },
        { title: 'Chengdu Wuhou Shrine Museum: official site and address', url: 'https://www.wuhouci.net.cn/' },
      ],
    },
  },
  {
    name: 'Xi’an',
    slug: 'xian',
    type: 'City',
    summary: 'City walls, Tang Chang’an, Muslim foodways, Qin archaeology',
    why: 'Xi’an is more useful as a three-day city with one separate Lintong archaeology day than as a compressed list of dynasties, towers, pagodas, and food streets.',
    featured: true,
    guideIds: ['china-attraction-tickets-reservations', '7-day-china-itinerary', 'street-food-night-markets', 'china-high-speed-trains', 'food-ordering-dietary'],
    mapQuery: '西安市 陕西省',
    editorial: {
      dek: 'Xi’an becomes legible when you separate three cities that occupy the same map: the walled Ming city people still cross every day, the much larger Tang capital interpreted by museums and pagodas, and the Qin imperial landscape out in Lintong. Give each scale its own day instead of turning 2,000 years into a taxi checklist.',
      sections: [
        {
          title: 'Begin with the wall as a piece of city, not a panorama ride',
          body: 'Use Yongning Gate as the deliberate first entrance because it fixes the south side of the walled city and connects naturally to Shuyuanmen, the Bell Tower axis, and the lanes west of the Drum Tower. Walk one meaningful section before deciding whether a bicycle adds anything; a full circuit is exposed and repetitive in heat, wind, rain, or poor air. The useful question is how the wall still sets street direction and scale—not whether you completed every kilometre.',
        },
        {
          title: 'Day one: Yongning Gate to the Great Mosque',
          body: 'Start on the wall early or near dusk, leave enough time for the streets at ground level, and walk north toward the Bell and Drum towers. Treat the Bell Tower as an orientation point rather than an automatic paid interior. Enter the Great Mosque through Huajue Lane as a functioning religious complex, then continue through Dapiyuan, Xiyangshi, or Sajinqiao only if you still have appetite and attention. “Muslim Quarter” is a district lead: every restaurant, bakery, and snack stall needs its own Chinese storefront and current branch before it becomes a saved place.',
        },
        {
          title: 'Day two: let one museum explain Tang Chang’an',
          body: 'Make the Shaanxi History Museum main building the first choice when you secure its timed reservation. It is the provincial collection beside Xiaozhai—not the separate Qin–Han museum in Xixian—and the original passport used for booking must match at entry. Continue east to Da Ci’en Temple and the Big Wild Goose Pagoda to connect Xuanzang, translation, and the Tang capital’s southern scale. The evening entertainment district nearby is optional; the museum and temple carry the historical argument without a costume-show checklist.',
        },
        {
          title: 'Give Lintong a full archaeology day',
          body: 'The Emperor Qinshihuang’s Mausoleum Site Museum is not one downtown pin. Its ticket covers the Terracotta Warriors Museum and Lishan Garden archaeological park, which the official guide says each need about ninety minutes, with a free shuttle between them. Add the city-to-Lintong ride, security, queues, walking, and return before promising another major sight that evening. Reserve through the official museum channel with the carried passport, save the exact museum identity in Chinese, and confirm the final return before leaving the city.',
        },
        {
          title: 'Use Xi’an Museum as the sold-out or closed-day recovery',
          body: 'Xi’an Museum and the Small Wild Goose Pagoda share one quieter campus at Youyi West Road. It is not a lesser version of the Shaanxi History Museum: the city collection, Jianfu Temple landscape, and surviving Tang pagoda make a coherent half-day without pretending the two museums are interchangeable. The campus normally closes Tuesday rather than Monday, so it can rescue a museum plan on the provincial museum’s closed day; recheck the current notice and reservation channel before travel.',
        },
        {
          title: 'Stay where the first morning and last meal both work',
          body: 'Inside the wall near Yongning Gate gives the easiest first arrival, metro access, and evening walks without forcing every meal through the busiest visitor streets. The Xiaozhai–Dayanta area is better when museums and the southern Tang sites matter more than late old-city walks. A hotel near Xi’an North Railway Station saves one early departure but is not a good default city base. Save the hotel’s Chinese name, street address, and the correct rail station before arrival.',
        },
        {
          title: 'Build the itinerary around reservation failure, heat, and distance',
          body: 'Reserve the Terracotta Warriors and Shaanxi History Museum first, then place the wall and outdoor streets around weather and energy. If the provincial museum is sold out, do not buy a vague third-party bundle or silently substitute its distant Qin–Han branch: use Xi’an Museum, a smaller museum, or the wall and mosque day. In summer, move exposed wall time to morning or evening; in rain or poor air, protect one indoor anchor and a simple metro or taxi exit. Keep the passport used for reservations on every controlled-entry day.',
        },
      ],
      quickFacts: [
        { label: 'Useful minimum', value: 'Three full days: walled city, Tang museum-and-pagoda day, and a separate Lintong day' },
        { label: 'Best first base', value: 'Inside or just south of the wall near Yongning Gate; Xiaozhai for museum-led days' },
        { label: 'Booking priority', value: 'Terracotta Warriors and Shaanxi History Museum main building, using the passport you will carry' },
        { label: 'Museum identity', value: '陕西历史博物馆 is not 陕西历史博物馆秦汉馆; check the site, address, and entry rule' },
        { label: 'Food-map rule', value: '回民街 is an area lead; save an exact Chinese storefront and branch for every meal' },
        { label: 'Closed-day recovery', value: 'Xi’an Museum and Small Wild Goose Pagoda share one campus and normally close Tuesday' },
      ],
      checkedAt: '2026-07-13',
      sources: [
        { title: 'Emperor Qinshihuang’s Mausoleum Site Museum: reservations, two-site visit, and passport entry', url: 'https://www.bmy.com.cn/guide/' },
        { title: 'Shaanxi History Museum: 2026 hours, five-day reservation window, passport support, and separate branches', url: 'https://www.sxhm.com/guide.html' },
        { title: 'Shaanxi History Museum: English visitor information and weekly closures', url: 'https://www.sxhm.com/en/visit.html' },
        { title: 'Xi’an Museum: official reservation and closure notice', url: 'https://www.xabwy.com/index.html' },
        { title: 'Xi’an government: 2026 attraction names and addresses', url: 'https://www.xa.gov.cn/ztzl/ztzl/lzledc/ywdc/1824366329290301442.html' },
        { title: 'Xi’an local gazetteer: Great Mosque identity and history', url: 'https://xadfz.xa.gov.cn/xadq/rwxa/1861327952662859777.html' },
        { title: 'Shaanxi government: Small Wild Goose Pagoda and Xi’an Museum campus context', url: 'https://en.shaanxi.gov.cn/tourism/ms/201705/t20170516_1594578.html' },
      ],
    },
  },
  {
    name: 'Anhui',
    slug: 'anhui',
    type: 'Province',
    summary: 'Huangshan, villages, ink-painting landscapes',
    why: 'Anhui is strongest for Huangshan, old villages, and slower scenic routes that pair well with Shanghai or Hangzhou.',
    guideIds: ['china-high-speed-trains', 'neighborhoods-beyond-landmarks', ...defaultGuideIds],
    mapQuery: 'Anhui China',
  },
  {
    name: 'Fujian',
    slug: 'fujian',
    type: 'Province',
    summary: 'Xiamen, tulou, tea mountains',
    why: 'Fujian is a food, coast, tulou, and tea destination where route planning matters more than a simple city checklist.',
    guideIds: ['tea-houses-and-rituals', 'street-food-night-markets', 'china-high-speed-trains', 'food-ordering-dietary'],
    mapQuery: 'Fujian China',
  },
  {
    name: 'Gansu',
    slug: 'gansu',
    type: 'Province',
    summary: 'Dunhuang, desert Silk Road, grottoes',
    why: 'Gansu is for Silk Road planning, desert distances, grottoes, and seasonal logistics rather than a casual first-week add-on.',
    guideIds: ['china-high-speed-trains', 'china-visa-free-2026', ...defaultGuideIds],
    mapQuery: 'Gansu China',
  },
  {
    name: 'Guangdong',
    slug: 'guangdong',
    type: 'Province',
    summary: 'Cantonese food, Shenzhen, Guangzhou',
    why: 'Guangdong pairs naturally with Hong Kong and Macau, especially for Cantonese food, trade-city energy, and easy rail hops.',
    guideIds: ['street-food-night-markets', 'food-ordering-dietary', 'china-high-speed-trains', 'alipay-wechat-pay-foreign-cards'],
    mapQuery: 'Guangdong China',
  },
  {
    name: 'Guizhou',
    slug: 'guizhou',
    type: 'Province',
    summary: 'Karst landscapes and minority villages',
    why: 'Guizhou rewards travelers who want landscapes and villages, but transport time and respectful local travel need more planning.',
    guideIds: ['china-high-speed-trains', 'neighborhoods-beyond-landmarks', ...defaultGuideIds],
    mapQuery: 'Guizhou China',
  },
  {
    name: 'Hainan',
    slug: 'hainan',
    type: 'Province',
    summary: 'Tropical beaches and resort travel',
    why: 'Hainan is the beach-and-resort counterpoint to city China, useful for travelers who want a softer landing or warm-weather break.',
    guideIds: ['china-visa-free-2026', 'hotels-foreigners-china', ...defaultGuideIds],
    mapQuery: 'Hainan China',
  },
  {
    name: 'Hebei',
    slug: 'hebei',
    type: 'Province',
    summary: 'Great Wall sections and Beijing surrounds',
    why: 'Hebei matters because several Great Wall and Beijing-side routes are technically outside Beijing but planned as part of the same trip.',
    guideIds: ['7-day-china-itinerary', 'china-high-speed-trains', 'didi-metro-getting-around', 'china-visa-free-2026'],
    mapQuery: 'Hebei China',
  },
  {
    name: 'Heilongjiang',
    slug: 'heilongjiang',
    type: 'Province',
    summary: 'Harbin winter, Russian-influenced streets',
    why: 'Heilongjiang is a winter-first destination: Harbin ice, cold-weather packing, and long-distance routing all matter.',
    guideIds: ['china-high-speed-trains', 'hotels-foreigners-china', ...defaultGuideIds],
    mapQuery: 'Heilongjiang China',
  },
  {
    name: 'Henan',
    slug: 'henan',
    type: 'Province',
    summary: 'Luoyang, Shaolin, ancient capitals',
    why: "Henan is useful for ancient-capital history, Shaolin side trips, and rail routes between Beijing, Xi'an, and central China.",
    guideIds: ['china-high-speed-trains', '7-day-china-itinerary', ...defaultGuideIds],
    mapQuery: 'Henan China',
  },
  {
    name: 'Hubei',
    slug: 'hubei',
    type: 'Province',
    summary: 'Wuhan, Yangtze, central China rail hub',
    why: 'Hubei is a central-China connector with Wuhan as the major rail and food hub.',
    guideIds: ['china-high-speed-trains', 'didi-metro-getting-around', 'street-food-night-markets', ...defaultGuideIds],
    mapQuery: 'Hubei China',
  },
  {
    name: 'Hunan',
    slug: 'hunan',
    type: 'Province',
    summary: 'Zhangjiajie, spicy food, mountain scenery',
    why: 'Hunan is for dramatic scenery and spicy food, with Zhangjiajie requiring more transport and hotel planning than big-city routes.',
    guideIds: ['street-food-night-markets', 'food-ordering-dietary', 'china-high-speed-trains', 'hotels-foreigners-china'],
    mapQuery: 'Hunan China',
  },
  {
    name: 'Jiangsu',
    slug: 'jiangsu',
    type: 'Province',
    summary: 'Suzhou, Nanjing, canals, gardens',
    why: 'Jiangsu is one of the easiest add-ons from Shanghai, especially for Suzhou gardens, Nanjing history, and short high-speed rail hops.',
    guideIds: ['china-high-speed-trains', 'neighborhoods-beyond-landmarks', '7-day-china-itinerary', ...defaultGuideIds],
    mapQuery: 'Jiangsu China',
  },
  {
    name: 'Jiangxi',
    slug: 'jiangxi',
    type: 'Province',
    summary: 'Jingdezhen, Lushan, porcelain culture',
    why: 'Jiangxi is a slower culture-and-scenery destination, especially for porcelain, mountains, and routes between bigger eastern cities.',
    guideIds: ['china-high-speed-trains', 'neighborhoods-beyond-landmarks', ...defaultGuideIds],
    mapQuery: 'Jiangxi China',
  },
  {
    name: 'Jilin',
    slug: 'jilin',
    type: 'Province',
    summary: 'Changbai Mountain and northeast winter',
    why: 'Jilin is strongest for Changbai Mountain and northeast winter travel, which needs seasonal and transport planning.',
    guideIds: ['china-high-speed-trains', 'hotels-foreigners-china', ...defaultGuideIds],
    mapQuery: 'Jilin China',
  },
  {
    name: 'Liaoning',
    slug: 'liaoning',
    type: 'Province',
    summary: 'Dalian, Shenyang, northeast coast',
    why: 'Liaoning gives travelers northeast history and coast without going as far as Harbin or Changbai Mountain.',
    guideIds: ['china-high-speed-trains', 'didi-metro-getting-around', ...defaultGuideIds],
    mapQuery: 'Liaoning China',
  },
  {
    name: 'Qinghai',
    slug: 'qinghai',
    type: 'Province',
    summary: 'Highland lakes and Tibetan plateau routes',
    why: 'Qinghai is a plateau route where altitude, distances, and season shape the trip more than a normal city itinerary.',
    guideIds: ['china-high-speed-trains', 'china-visa-free-2026', ...defaultGuideIds],
    mapQuery: 'Qinghai China',
  },
  {
    name: 'Shaanxi',
    slug: 'shaanxi',
    type: 'Province',
    summary: "Xi'an, Terracotta Warriors, noodles",
    why: "Shaanxi is the classic first-trip extension from Beijing or Shanghai because Xi'an is easy by rail and high in cultural payoff.",
    guideIds: ['china-attraction-tickets-reservations', '7-day-china-itinerary', 'china-high-speed-trains', 'street-food-night-markets', 'food-ordering-dietary'],
    mapQuery: 'Shaanxi China',
  },
  {
    name: 'Shandong',
    slug: 'shandong',
    type: 'Province',
    summary: 'Qingdao, Qufu, Mount Tai',
    why: 'Shandong works for beer, coast, Confucian history, and Mount Tai routes from Beijing or Shanghai.',
    guideIds: ['china-high-speed-trains', 'street-food-night-markets', ...defaultGuideIds],
    mapQuery: 'Shandong China',
  },
  {
    name: 'Shanxi',
    slug: 'shanxi',
    type: 'Province',
    summary: 'Pingyao, Datong, old temples',
    why: 'Shanxi is one of the strongest old-China routes, but temple distances and transfers make planning important.',
    guideIds: ['china-high-speed-trains', 'neighborhoods-beyond-landmarks', ...defaultGuideIds],
    mapQuery: 'Shanxi China',
  },
  {
    name: 'Sichuan',
    slug: 'sichuan',
    type: 'Province',
    summary: 'Chengdu, pandas, teahouses, Jiuzhaigou',
    why: 'Sichuan combines Chengdu food and tea culture with major nature routes, so it can be a whole trip rather than a side stop.',
    guideIds: ['tea-houses-and-rituals', 'street-food-night-markets', 'food-ordering-dietary', 'neighborhoods-beyond-landmarks'],
    mapQuery: 'Sichuan China',
  },
  {
    name: 'Yunnan',
    slug: 'yunnan',
    type: 'Province',
    summary: 'Dali, Lijiang, Kunming, ethnic regions',
    why: 'Yunnan is a slower scenic and cultural route with different altitude, climate, and local-transport assumptions from coastal China.',
    guideIds: ['china-high-speed-trains', 'hotels-foreigners-china', 'neighborhoods-beyond-landmarks', ...defaultGuideIds],
    mapQuery: 'Yunnan China',
  },
  {
    name: 'Zhejiang',
    slug: 'zhejiang',
    type: 'Province',
    summary: 'Hangzhou, tea, water towns, coast',
    why: 'Zhejiang is one of the easiest Shanghai add-ons, especially for Hangzhou tea, water towns, and short rail trips.',
    guideIds: ['tea-houses-and-rituals', 'china-high-speed-trains', 'neighborhoods-beyond-landmarks', ...defaultGuideIds],
    mapQuery: 'Zhejiang China',
  },
  {
    name: 'Guangxi',
    slug: 'guangxi',
    type: 'Autonomous region',
    summary: 'Guilin, Yangshuo, karst river scenery',
    why: 'Guangxi is a high-value scenery region, especially if travelers want Guilin and Yangshuo without a fully remote western-China route.',
    guideIds: ['china-high-speed-trains', 'hotels-foreigners-china', 'neighborhoods-beyond-landmarks', ...defaultGuideIds],
    mapQuery: 'Guangxi China',
  },
  {
    name: 'Inner Mongolia',
    slug: 'inner-mongolia',
    type: 'Autonomous region',
    summary: 'Grasslands, desert routes, big distances',
    why: 'Inner Mongolia requires realistic distance planning: grasslands and deserts are not quick city-center attractions.',
    guideIds: ['china-high-speed-trains', 'china-visa-free-2026', ...defaultGuideIds],
    mapQuery: 'Inner Mongolia China',
  },
  {
    name: 'Ningxia',
    slug: 'ningxia',
    type: 'Autonomous region',
    summary: 'Wine country and compact northwest routes',
    why: 'Ningxia can be a compact northwest route for travelers who want wine, desert-edge landscapes, and fewer obvious tourist circuits.',
    guideIds: ['china-high-speed-trains', 'street-food-night-markets', ...defaultGuideIds],
    mapQuery: 'Ningxia China',
  },
  {
    name: 'Tibet',
    slug: 'tibet',
    type: 'Autonomous region',
    summary: 'Permit-led travel and high-altitude planning',
    why: 'Tibet is not a casual add-on: permits, altitude, tour requirements, and seasons should be researched before flights or hotels.',
    guideIds: ['china-visa-free-2026', 'hotels-foreigners-china', 'internet-esim-vpn-blocked-apps', 'translation-language-survival'],
    mapQuery: 'Tibet China',
  },
  {
    name: 'Xinjiang',
    slug: 'xinjiang',
    type: 'Autonomous region',
    summary: 'Silk Road cities and long overland routes',
    why: 'Xinjiang is huge and route-led, with Silk Road cities, desert distances, and long transfers that need careful itinerary design.',
    guideIds: ['china-high-speed-trains', 'china-visa-free-2026', ...defaultGuideIds],
    mapQuery: 'Xinjiang China',
  },
  {
    name: 'Macau',
    slug: 'macau',
    type: 'Special administrative region',
    summary: 'Easy add-on for food, history, and transit',
    why: 'Macau is a compact add-on from Hong Kong or Guangdong, strongest for food, old streets, and a simple cross-border planning question.',
    guideIds: ['china-visa-free-2026', 'street-food-night-markets', 'china-pre-departure-checklist', 'alipay-wechat-pay-foreign-cards'],
    mapQuery: 'Macau',
  },
];

const mapPins: Record<string, Destination['mapPin']> = {
  'hong-kong': { x: 61, y: 82 },
  taiwan: { x: 75, y: 79 },
  shanghai: { x: 73, y: 61 },
  beijing: { x: 67, y: 35 },
  tianjin: { x: 69, y: 37 },
  chongqing: { x: 51, y: 64 },
  chengdu: { x: 45, y: 62 },
  xian: { x: 53, y: 51 },
  anhui: { x: 65, y: 59 },
  fujian: { x: 68, y: 75 },
  gansu: { x: 43, y: 43 },
  guangdong: { x: 59, y: 80 },
  guizhou: { x: 50, y: 73 },
  hainan: { x: 55, y: 91 },
  hebei: { x: 65, y: 39 },
  heilongjiang: { x: 78, y: 13 },
  henan: { x: 61, y: 50 },
  hubei: { x: 59, y: 60 },
  hunan: { x: 58, y: 68 },
  jiangsu: { x: 70, y: 57 },
  jiangxi: { x: 64, y: 68 },
  jilin: { x: 80, y: 22 },
  liaoning: { x: 75, y: 31 },
  qinghai: { x: 37, y: 58 },
  shaanxi: { x: 53, y: 51 },
  shandong: { x: 68, y: 45 },
  shanxi: { x: 59, y: 43 },
  sichuan: { x: 45, y: 65 },
  yunnan: { x: 42, y: 79 },
  zhejiang: { x: 70, y: 66 },
  guangxi: { x: 52, y: 78 },
  'inner-mongolia': { x: 55, y: 25 },
  ningxia: { x: 49, y: 45 },
  tibet: { x: 25, y: 67 },
  xinjiang: { x: 20, y: 38 },
  macau: { x: 60, y: 83 },
};

export const destinations: Destination[] = destinationRecords.map((destination) => {
  const generated = requireGeneratedImage(`region:${destination.slug}`);
  const image = {
    src: generated.src,
    alt: generated.alt,
    source: generated.source,
    title: generated.title,
  };
  return { ...destination, mapPin: mapPins[destination.slug], places: backpackerPlaces[destination.slug] ?? [], image };
});

export const featuredDestinations = destinations.filter((destination) => destination.featured);

export function getDestination(slug: string) {
  return destinations.find((destination) => destination.slug === slug);
}
