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
    name: 'Guangzhou',
    slug: 'guangzhou',
    type: 'City',
    summary: 'Cantonese foodways, port history, Xiguan, and the Pearl River',
    why: 'Guangzhou is best read as a trading city whose old neighborhoods, museums, food rituals, and modern riverfront explain one another—not as a Canton Tower photo stop or a list of dim sum chains.',
    featured: true,
    guideIds: ['street-food-night-markets', 'food-ordering-dietary', 'china-high-speed-trains', 'china-attraction-tickets-reservations', 'alipay-wechat-pay-foreign-cards'],
    mapQuery: '广州市 广东省',
    editorial: {
      dek: 'Guangzhou makes sense when you follow the city’s exchanges: river trade, overseas communities, clan networks, Cantonese opera, morning tea, and a modern business district built on the opposite bank. Keep Xiguan, the old political center, and Zhujiang New Town as three distinct city readings instead of commuting between isolated landmarks.',
      sections: [
        {
          title: 'Begin in Xiguan, where the city still works at walking speed',
          body: 'Start at the Chen Clan Academy for the wood, stone, ceramic, plaster, and iron craft that turn a clan hall into an argument about regional skill and patronage. Then move west to the Cantonese Opera Art Museum and walk a bounded section of Enning Road toward Yongqing Fang or Lychee Bay. The museum is the fixed cultural anchor; Enning Road is a living street, not one attraction pin, so cafes, noodle shops, and restored compounds should be saved separately only after their Chinese storefronts are confirmed.',
        },
        {
          title: 'Day one: Chen Clan Academy to Shamian without a heritage checklist',
          body: 'Give the morning to the Chen Clan Academy, then continue to Enning Road and the Cantonese Opera Art Museum. From there, take transit or a deliberate longer walk toward Shamian Island. Enter at the east bridge so the route has a real beginning, then cross the compact island once while reading its former concession buildings alongside the river and nearby trading districts. Weekend and holiday crowding is a known constraint; if the island is saturated, stay with the Xiguan walk and use Lychee Bay as the recovery route rather than forcing a photo circuit.',
        },
        {
          title: 'Day two: keep the two Nanyue King Museum campuses separate',
          body: 'The King’s Tomb Exhibition Area on Jiefang North Road and the Palace Exhibition Area on Zhongshan Fourth Road are different archaeological sites with different addresses and ticket rules. Begin at the Tomb branch for the royal burial and excavated collection, but note that the original tomb chamber has been closed for preventive conservation since October 2025 while the other galleries remain open. Use the free Palace branch later for the excavated palace, garden, waterworks, and the old-city layer near Beijing Road. Never let a search for “Nanyue King Museum” choose the campus for you.',
        },
        {
          title: 'Day three: use the modern riverfront to read the city’s change of scale',
          body: 'Reserve the Guangdong Museum, enter through the current individual-visitor gate, and give its regional history, art, natural history, and temporary exhibitions enough time to carry the day. Walk Huacheng Square afterward and look across the Pearl River toward Canton Tower before deciding whether the paid tower experience adds anything. The skyline is the conclusion to a trade-city story, not proof that the old neighborhoods are past tense. In heat or thunderstorms, protect the museum slot and shorten the exposed square rather than abandoning the whole day.',
        },
        {
          title: 'Treat morning tea as a format, not a famous-chain recommendation',
          body: 'A useful dim sum note names the Chinese restaurant, branch, floor or hotel, serving period, queue method, tea charge, and whether a small party can order sensibly. “Tao Tao Ju,” “Guangzhou Restaurant,” or “best dim sum in Guangzhou” is not yet a resolved place because long-lived brands have many branches with different menus and operating patterns. The same rule applies to roast goose, claypot rice, wonton noodles, and dessert shops. Save the exact storefront; keep a dish-only Reel as an eating lead until the branch is grounded.',
        },
        {
          title: 'Stay for the city you want, not the station printed on the ticket',
          body: 'Liwan or Yuexiu is the stronger first base for Xiguan, old-city walks, and food, while Zhujiang New Town suits travelers prioritizing the museum, modern riverfront, or business appointments. Guangzhou South Railway Station is a major Panyu hub, not a useful default neighborhood; Guangzhou, Guangzhou East, Guangzhou Baiyun, and Guangzhou South are separate stations whose services are changing. Save the exact station in Chinese and build the hotel transfer from that identity, not from the word “Guangzhou.”',
        },
        {
          title: 'Resolve the airport terminal before the arrival ride',
          body: 'Baiyun Airport now has three terminals. As of the July 2026 check, international and regional flights use Terminal 3, Spring Airlines also uses T3, and several domestic operations remain split across T1 and T2. T3 does not have a direct metro stop: the official route uses the free shuttle from Gaozeng, an intercity connection from Airport North at T2, or a correctly addressed road transfer. Confirm the live airline terminal, carry the hotel’s Chinese name and address, and preserve enough time for a free inter-terminal shuttle if the arrival information changes.',
        },
      ],
      quickFacts: [
        { label: 'Useful minimum', value: 'Three full days: Xiguan and Shamian, two Nanyue archaeology campuses, then the modern riverfront' },
        { label: 'Best first base', value: 'Liwan or Yuexiu for old-city walks; Zhujiang New Town for the museum, riverfront, and business trips' },
        { label: 'Food-map rule', value: 'A dish or chain name is a lead; save the current Chinese branch, serving period, and queue method' },
        { label: 'Museum identity', value: '南越王博物院（王墓展区） and 南越王博物院（王宫展区） are separate places and reservations' },
        { label: 'Closure recovery', value: 'Chen Clan Academy closes Tuesday; most major museums close Monday; preserve one outdoor neighborhood route' },
        { label: 'Arrival rule', value: 'Save the exact rail station or CAN terminal; T3 currently needs a shuttle, intercity connection, or road transfer' },
      ],
      checkedAt: '2026-07-13',
      sources: [
        { title: 'Guangzhou culture guide: current Xiguan route, Chen Clan Academy, and Cantonese Opera Art Museum hours', url: 'https://www.gz.gov.cn/zt/jrshts/2026n/nwzgz/nwgz/content/post_10686807.html' },
        { title: 'Liwan government: Cantonese Opera Art Museum identity and address', url: 'https://www.lw.gov.cn/zwgkk/gzjg/qjdbsc/dbj/hldb/content/post_9730490.html' },
        { title: 'Nanyue King Museum: two campuses, admission, overseas visitor entry, and current hours', url: 'https://www.nywmuseum.org.cn/News/VisitIndex/Visit' },
        { title: 'Nanyue King Museum: Tomb chamber conservation closure while other galleries remain open', url: 'https://www.nywmuseum.org.cn/News/Details/tzgg?nid=12496' },
        { title: 'Guangdong Museum: current real-name reservation rules and weekly hours', url: 'https://www.gdmuseum.com/col88/index' },
        { title: 'Guangzhou airport: January 2026 airline moves and current T1/T3 split', url: 'https://www.gz.gov.cn/guangzhouinternational/home/bulletin/content/post_10660392.html' },
        { title: 'Guangzhou airport: T3 ground transport and free inter-terminal shuttle', url: 'https://www.gz.gov.cn/guangzhouinternational/home/headline/content/post_10509533.html' },
        { title: 'Guangzhou railway: January 2026 service changes at Guangzhou Station', url: 'https://www.gz.gov.cn/guangzhouinternational/home/citynews/content/post_10663571.html' },
      ],
    },
  },
  {
    name: 'Shenzhen',
    slug: 'shenzhen',
    type: 'City',
    summary: 'Migration, design, border crossings, villages, and a polycentric coast',
    why: 'Shenzhen is most rewarding when you read the city as a chain of arrivals—from Xin’an county and fishing settlements to factories, migration, design, and cross-border infrastructure—not as a blank skyline or a Hong Kong shopping day.',
    featured: true,
    guideIds: ['china-high-speed-trains', 'didi-metro-getting-around', 'internet-esim-vpn-blocked-apps', 'neighborhoods-beyond-landmarks', 'hotels-foreigners-china'],
    mapQuery: '深圳市 广东省',
    editorial: {
      dek: 'Shenzhen is not one downtown and it is not a city without history. Build the trip across three urban chapters: Futian’s reform-era civic center, older Nanshan and port-facing Shekou, then one production landscape such as Dafen. The border crossing, rail station, and neighborhood you choose determine the route more than a ranked attraction list.',
      sections: [
        {
          title: 'Start with the city Shenzhen says it became',
          body: 'Begin at the Shenzhen Reform and Opening-Up Exhibition Hall inside the Museum of Contemporary Art and Urban Planning. The nested identity matters: this is not the Shenzhen Museum History and Folk Culture branch on Jintian Road, nor every temporary exhibition in the shared MoCAUP building. Continue across the Civic Center axis, then enter Lianhua Hill Park from the south and climb only if the weather and energy make the city view useful. Together the hall, public square, and park explain planning, political memory, and the scale of Futian better than a skyscraper observation deck.',
        },
        {
          title: 'Day one: use Futian as a civic route, not a mall circuit',
          body: 'Give the exhibition hall enough time to understand the special economic zone, labor migration, housing, infrastructure, and the city’s compressed growth. Cross the public Civic Center space, then take the south route into Lianhua Hill Park for the summit plaza or stay with the lawns and lower paths in heat or rain. Huaqiangbei can be an evening commerce stop, but “the electronics market” is not one store: a useful buying recommendation needs the Chinese building, floor, stall, product, testing method, warranty, and return terms.',
        },
        {
          title: 'Day two: separate old Nanshan from port-era Shekou',
          body: 'Start at the Nantou Ancient Town Museum outside the south gate, then walk through the gate and use the old county history to read temples, walls, institutions, rebuilt lanes, and contemporary businesses without pretending every surface is ancient. Shekou is a separate metro ride, not the next block. At the Sea World Culture and Arts Center, choose the current exhibition before paying and use the waterfront and industrial-port context as the wider visit. Sea World station, the arts center, and Shekou Cruise Homeport are three different destinations.',
        },
        {
          title: 'Day three: let Dafen explain production and authorship',
          body: 'Dafen is useful because it complicates the easy “creative city” story. Begin at Dafen Art Museum for the village’s shift from export reproduction and workshop labor toward original practice, then enter the surrounding public lanes with a clearer view of what galleries, frame shops, studios, and painters are doing. Do not treat the residential-production district as a theme park or photograph workers and interiors without consent. A commissioned portrait or artwork needs a named studio, size, medium, price, completion time, pickup or shipping plan, and evidence of which artist will make it.',
        },
        {
          title: 'Eat like this is a migrant city, not a cuisine vacuum',
          body: 'Shenzhen’s food map is Cantonese, Hakka, Chaoshan, Hunan, Sichuan, Dongbei, and much more because the city was built by repeated migration. That makes “local Shenzhen food” a weak search instruction, not proof that the city lacks food culture. Choose a neighborhood and meal format first, then resolve the exact Chinese restaurant branch, mall level, serving period, queue method, and dietary constraints. A Dianping list or short video is evidence for discovery; it is not a branch match by itself.',
        },
        {
          title: 'Choose the base from the border and the west-east day split',
          body: 'Futian is the strongest first base for a short mixed trip, fast West Kowloon rail, and the civic-center day. Nanshan or Shekou works better when Nantou, design, the coast, or an airport-side arrival dominates. Luohu is useful for Luohu Checkpoint, Dongmen, and eastern routes, but it is no longer the geometric center of what most visitors save. Shenzhen North Railway Station is an excellent national rail hub and a poor default hotel area unless an early departure is the reason. Save the hotel’s Chinese branch and the exact arrival station or port before booking the transfer.',
        },
        {
          title: 'Treat every Hong Kong crossing as a different transport product',
          body: 'Futian Checkpoint connects on foot to Hong Kong’s Lok Ma Chau Spur Line and currently operates 06:30–22:30; those two names describe opposite sides of the same crossing. Luohu connects to Lo Wu, Shenzhen Bay uses road and metro access with passenger clearance currently ending at midnight, and cross-border high-speed rail clears at Hong Kong West Kowloon before reaching Futian or Shenzhen North. Airport arrivals use Bao’an Terminal 3 and Metro Line 11’s Airport (T3) station—not Line 1’s Airport East. Check the live port, ticket, last connection, visa or entry basis, and post-clearance ride before leaving either side.',
        },
      ],
      quickFacts: [
        { label: 'Useful minimum', value: 'Three days: Futian civic history, Nantou plus Shekou, and one production landscape such as Dafen' },
        { label: 'Best first base', value: 'Futian for a mixed first trip; Nanshan or Shekou for western city days; Luohu for the eastern border and routes' },
        { label: 'Distance rule', value: 'Futian, Nanshan, Shekou, Luohu, Longgang, the airport, and Shenzhen North are separate planning zones' },
        { label: 'Border identity', value: '福田口岸 is the mainland side of Lok Ma Chau Spur Line; it is not Huanggang or Futian Railway Station' },
        { label: 'Market rule', value: 'Resolve the building, floor, stall, product, test, warranty, and return terms before buying electronics' },
        { label: 'Airport rule', value: 'Use 深圳宝安国际机场T3航站楼 and Line 11 Airport (T3), not the legacy-sounding Airport East station' },
      ],
      checkedAt: '2026-07-13',
      sources: [
        { title: 'Shenzhen Government: July–August 2026 museum hours by exact Shenzhen Museum branch', url: 'https://www.sz.gov.cn/en_szgov/news/notices/content/post_12882475.html' },
        { title: 'Shenzhen Government: Museum of Contemporary Art and Urban Planning identity, address, and regular hours', url: 'https://www.sz.gov.cn/en_szgov/news/infocus/SZCitywalk/Explore/Attractions/content/post_12404821.html' },
        { title: 'Shenzhen parks: Lianhua Hill Park address, opening window, and route context', url: 'https://www.sz.gov.cn/en_szgov/news/infocus/park/csgy/content/post_11190503.html' },
        { title: 'Shenzhen Government: Nantou historical sites and south-gate context', url: 'https://www.sz.gov.cn/en_szgov/news/infocus/SZCitywalk/Explore/Districts/NanshanDistrict/content/mpost_11889388.html' },
        { title: 'Shenzhen Government: Nantou Ancient Town Museum address and regular hours', url: 'https://www.sz.gov.cn/szzt2010/szwtt/wtcg/whcg/content/post_11132704.html' },
        { title: 'Shenzhen Government: Sea World Culture and Arts Center address and venue hours', url: 'https://www.sz.gov.cn/szzt2010/szwtt/wtcg/whcg/content/post_11131232.html' },
        { title: 'Shenzhen Government: Dafen production history and current museum hours', url: 'https://www.sz.gov.cn/en_szgov/aboutsz/photos/content/post_12264255.html' },
        { title: 'Shenzhen Port Office: current Futian Checkpoint identity and operating hours', url: 'https://ka.sz.gov.cn/bmfw/katgfw/ftkazt/' },
        { title: 'Hong Kong Immigration Department: current control-point modes and operating hours', url: 'https://www.immd.gov.hk/eng/contactus/control_points.html' },
        { title: 'Shenzhen Government: current rail-station identities and connections', url: 'https://www.sz.gov.cn/en_szgov/life/transport/trains/' },
        { title: 'Shenzhen Government: 2026 metro lines, Airport (T3), border, and neighborhood stations', url: 'https://www.sz.gov.cn/en_szgov/life/transport/metro/content/post_12583635.html' },
      ],
    },
  },
  {
    name: 'Hangzhou',
    slug: 'hangzhou',
    type: 'City',
    summary: 'A designed lake, working tea hills, and three layers of water-built history',
    why: 'Hangzhou becomes more than a pretty Shanghai add-on when West Lake is read as designed public infrastructure, tea as a living production landscape, and the Southern Song capital, Grand Canal, and Liangzhu as different histories rather than one heritage label.',
    featured: true,
    guideIds: ['tea-houses-and-rituals', 'china-high-speed-trains', 'china-attraction-tickets-reservations', 'neighborhoods-beyond-landmarks', 'food-ordering-dietary'],
    mapQuery: '杭州市 浙江省',
    editorial: {
      dek: 'Hangzhou is not one lake pin. Its best trips follow how people reshaped water and land: poet-officials dredged causeways, tea growers worked the western hills, a Southern Song capital grew against the lake, and the Grand Canal ended in a trading city. Choose one coherent line each day instead of circling every famous name.',
      sections: [
        {
          title: 'Read West Lake as a made landscape, not a natural photo backdrop',
          body: 'The lake’s causeways, islands, bridges, planted views, temples, and tea hills were shaped over centuries to turn water management into a cultural landscape. That is the useful key to Hangzhou: Bai Causeway and Su Causeway are both beautiful and engineered, and the view changes because each bridge and planted edge frames it. Begin at Broken Bridge on the east end of Bai Causeway, cross toward Solitary Hill, and stop often enough to notice the sequence. A complete lap is not the achievement; understanding one shore is.',
        },
        {
          title: 'Day one: choose the north-lake line before the crowd chooses it for you',
          body: 'Start at Broken Bridge early, follow Bai Causeway to Solitary Hill, then decide whether the day needs a museum, a boat, or more walking. Do not attach every lake name to one route: Three Pools Mirroring the Moon is an island-and-boat product, Leifeng Pagoda is on the south shore, and Su Causeway is another long crossing. On a hot, wet, or holiday-crowded afternoon, use the current lake-loop bus or leave for a shaded museum rather than forcing the whole perimeter. Save an exact pier only after choosing the current operator and route.',
        },
        {
          title: 'Day two: reserve Lingyin first, then let tea become more than a sales stop',
          body: 'Book the Lingyin–Feilai Peak complex before fixing the day. Since December 2025 the scenic area, Lingyin Temple, Yongfu Temple, and Taoguang Temple are free, but entry is still real-name and timed; since February 2026 the old walk-up queue has been replaced by an online waitlist. Enter for the cliff carvings and religious landscape, not just an incense photograph. Afterward, use the China National Tea Museum’s Shuangfeng branch for the local Longjing story. It is one museum with two campuses: Shuangfeng on Longjing Road interprets Chinese tea and West Lake Longjing, while the hillier Longjing branch at Wengjiashan is a separate destination.',
        },
        {
          title: 'Day three: choose one historical city, not two rushed museum checklists',
          body: 'For the Southern Song city, reserve the Deshou Palace Site Museum, begin with the exposed archaeological remains, and treat the reconstructed halls as interpretation rather than surviving palace fabric. Continue through the older street network only as far as energy and commercial crowds allow. For the canal city, use the China Beijing–Hangzhou Grand Canal Museum beside Gongchen Bridge, then cross the bridge and walk the public river edge and Qiaoxi lanes. The Hangzhou museum is not the similarly named China Grand Canal Museum in Yangzhou.',
        },
        {
          title: 'A fourth day earns Liangzhu; it does not fit in a spare afternoon',
          body: 'Liangzhu Museum is a substantial northwest-Hangzhou trip and the best first explanation of the jade, water management, settlement, and social order behind the archaeological city. The museum and Archaeological Ruins of Liangzhu City Park are different reservations about five kilometers apart; the park also needs several hours and its own transport inside. Choose the museum alone for a focused half-day, or give the museum and ruins park a dedicated day. Do not book “Liangzhu village” and assume that covers either entrance.',
        },
        {
          title: 'Buy tea only after separating origin, grade, producer, and hospitality',
          body: 'A view of tea bushes does not authenticate a packet, and a hosted tasting is not automatically free. Ask whether the quoted charge is for a seat, room, brewing service, tea by weight, food, or a minimum purchase before water is poured. For leaves, record the producer, cultivar, harvest date and picking standard, origin area, net weight, grade, sealed packaging, and return terms. Use the museum to learn what changes between tea types; use a named producer and receipt to decide what to buy.',
        },
        {
          title: 'Stay east of the lake, and preserve the station name on every ticket',
          body: 'For a first visit, the east edge between Fengqi Road, Longxiangqiao, and Wushan Square gives the cleanest balance of metro access, early lake walks, and evening food. A tea-hill or Lingyin stay trades transport simplicity for atmosphere. Hangzhou East is the dominant high-speed hub for many Shanghai services, Hangzhou West is a separate western hub, Hangzhou Railway Station is the central city station, and Hangzhou South is across the river in Xiaoshan. The airport has Metro Lines 1, 7, and 19; Line 19 is the useful fast cross-city link through East and West hubs. Match the Chinese station on the ticket before choosing the hotel transfer.',
        },
      ],
      quickFacts: [
        { label: 'Useful minimum', value: 'Three full days; add a fourth for Liangzhu or for both the Southern Song and Grand Canal routes' },
        { label: 'Best first base', value: 'The east lake edge near 凤起路, 龙翔桥, or 吴山广场 for metro access and early walks' },
        { label: 'Lake rule', value: 'Save a route start, route end, and chosen pier—not one generic West Lake pin or an automatic full circuit' },
        { label: 'Lingyin rule', value: 'Free does not mean walk-in: reserve 杭州灵隐飞来峰 at least one day ahead or use the online waitlist' },
        { label: 'Tea rule', value: '中国茶叶博物馆 has separate 双峰 and 龙井 campuses; this guide chooses Shuangfeng for West Lake Longjing context' },
        { label: 'Station rule', value: '杭州东站, 杭州西站, 杭州站, and 杭州南站 are different arrival products—copy the exact Chinese name from the ticket' },
      ],
      checkedAt: '2026-07-13',
      sources: [
        { title: 'UNESCO: West Lake as a designed cultural landscape of causeways, islands, temples, and tea hills', url: 'https://whc.unesco.org/en/list/1334' },
        { title: 'Hangzhou: 2026 peak-crowd reporting on the Broken Bridge–Bai Causeway route', url: 'https://www.ehangzhou.gov.cn/2026-04/07/c_297210.htm' },
        { title: 'Hangzhou West Lake administration: Lingyin–Feilai Peak free-entry and timed reservation rules', url: 'https://www.hzxcw.gov.cn/content_46075.html' },
        { title: 'Hangzhou: February 2026 Lingyin online waitlist, cancellation, and no-show rules', url: 'https://www.hzxcw.gov.cn/content_46785.html' },
        { title: 'China National Tea Museum: two-campus identity, current hours, and Tuesday closure', url: 'https://www.teamuseum.cn/mobile/basicIntroduction.htm' },
        { title: 'Hangzhou release: Deshou Palace free timed reservation process', url: 'https://www.hzzx.gov.cn/cshz/content/2023-07/12/content_8577399.htm' },
        { title: 'Hangzhou culture and tourism: Southern Song, Grand Canal, and Liangzhu city-walk routes', url: 'https://wgly.hangzhou.gov.cn/cw/cn/index.html' },
        { title: 'Hangzhou: China Beijing–Hangzhou Grand Canal Museum identity beside Gongchen Bridge', url: 'https://www.ehangzhou.gov.cn/2023-09/05/c_286548.htm' },
        { title: 'Liangzhu official visit guide: museum and archaeological park reservations, hours, and separate addresses', url: 'https://www.liangzhusite.com/Web/Visit/59' },
        { title: 'Hangzhou: June 2026 program linking West Lake, the Grand Canal, and Liangzhu as three heritage systems', url: 'https://www.ehangzhou.gov.cn/2026-06/12/c_298008.htm' },
        { title: 'Hangzhou Xiaoshan Airport: current Metro Lines 1, 7, and 19 service', url: 'https://www.hzairport.cn/en/guide/metro.html' },
        { title: 'Hangzhou railway: current reminder to verify the specific departure station among multiple hubs', url: 'https://www.ehangzhou.gov.cn/2026-04/03/c_297157.htm' },
      ],
    },
  },
  {
    name: 'Kunming',
    slug: 'kunming',
    type: 'City',
    summary: 'Plateau-city history, living flower trade, Dianchi ecology, and the route into Yunnan',
    why: 'Kunming earns more than a flight connection when its museums, working markets, lake ecology, and rail geography are read together—and when Stone Forest is treated as a separate excursion rather than a spare-hour add-on.',
    featured: true,
    guideIds: ['china-high-speed-trains', 'china-attraction-tickets-reservations', 'food-ordering-dietary', 'neighborhoods-beyond-landmarks', 'didi-metro-getting-around'],
    mapQuery: '昆明市 云南省',
    editorial: {
      dek: 'Kunming is not merely the airport before Dali or Lijiang. It is a high plateau city shaped by the Dianchi basin, southwest trade and migration, a remarkable flower economy, and transport routes that now extend across Yunnan and into Southeast Asia. Give the city three days before deciding what belongs to the rest of the province.',
      sections: [
        {
          title: 'Begin with the basin, not the “eternal spring” slogan',
          body: 'Kunming sits around 1,900 meters above sea level beside Dianchi, with older streets and institutions north of the main railway station and newer districts stretching south toward Chenggong. That geography explains the trip better than a list of flowers and mild-weather claims. Start at Green Lake, where the public park, former military academy, university streets, and nearby old-city fabric can form one slow morning. Then use a museum to connect the Dian Kingdom, later southwest kingdoms, wartime routes, and the modern border region instead of treating Yunnan’s cultures as decorative costumes.',
        },
        {
          title: 'Day one: let the compact city reveal its different histories',
          body: 'Enter Green Lake through the south gate early, when exercise, music, and ordinary park life are still the main event. Walk the lake and choose one adjacent institution rather than collecting every courtyard. Later, take the metro or a short ride to Kunming City Museum on Tuodong Road: the ancient Dali-Kingdom pagoda, Dianchi bronze material, city photographs, and Flying Tigers history belong to different periods, but together they make Kunming legible as a city rather than a transfer point. The museum normally closes Monday; confirm the live notice before fixing the day.',
        },
        {
          title: 'Day two: put provincial history before the souvenir version of Yunnan',
          body: 'Yunnan Provincial Museum is in Guandu, far south of Green Lake and close enough to Guandu Old Town to make one coherent day. Use the permanent sequence—from prehistory and Dian bronzes through Nanzhao–Dali, later imperial rule, and modern Yunnan—to understand why the province cannot be reduced to one “ethnic” aesthetic. Admission and reservation rules can change around holidays, so use the museum’s current official channel and carry the same physical passport used in the booking. If the galleries run long, skip the old town rather than rushing both.',
        },
        {
          title: 'See Dounan when flowers are work, not only decoration',
          body: 'Dounan is a wholesale and logistics system as well as a visitor market. Go in the late afternoon or evening, after the museum day or as its own Chenggong trip, and pay attention to grading, bundling, auctions, cold-chain movement, and the difference between wholesale halls and retail displays. Metro Line 1 reaches Dounan, but the market complex is larger than one exit. Save the main flower-market building and confirm the return train rather than assuming a 24-hour trade cycle means every visitor hall, stall, or metro service runs all night.',
        },
        {
          title: 'Make Dianchi a seasonal ecology day',
          body: 'Haigeng Dam is most distinctive during the red-billed gull season, roughly October into the following spring; a summer clip promising the same spectacle is stale evidence. At any time, read Dianchi as a heavily managed plateau-lake system with restored wetlands and a still-visible urban edge. Use Metro Line 5 and a short walk or transfer, keep to public paths, and follow the current civilized bird-viewing rules: do not chase, touch, trap, frighten, or feed unsuitable food. Western Hills can extend the day, but its cableways, gates, and return route are separate products—check them before crossing the lake or climbing.',
        },
        {
          title: 'Give Stone Forest a full excursion and preserve every transfer',
          body: 'Stone Forest is in Shilin Yi Autonomous County, roughly 70–80 kilometers from central Kunming. The correct pin is the main scenic-area visitor center, not a generic county label, Naigu Stone Forest, or a hotel called “Stone Forest.” High-speed trains use Kunming South and Shilin West, but Shilin West is still well outside the main entrance and needs a current onward shuttle, bus, or car. Coaches use a different terminal and timetable. Choose one complete chain, leave early, retain the return buffer, and do not attempt the trip during a short airport layover simply because the rail segment looks brief.',
        },
        {
          title: 'Stay in the old center, and never shorten the station name',
          body: 'For a first visit, stay between Green Lake, Dongfeng Square, and Tangzixiang: the old center remains walkable while Lines 2, 3, and 6 make museum and airport connections manageable. Kunming Railway Station (昆明站) is the central conventional and intercity station; Kunming South (昆明南站) is the large high-speed hub in Chenggong and can be roughly an hour away by metro. Changshui Airport uses Line 6 from Airport Center to Tangzixiang, not a direct train to Kunming South. Copy the exact Chinese station from every ticket before booking a hotel, transfer, or same-day excursion.',
        },
        {
          title: 'Treat wild-mushroom season as food with a safety protocol',
          body: 'Seasonal mushrooms are a real pleasure, but “locals eat it” and a viral hallucination joke are not safety evidence. Use an established restaurant, do not buy or forage unfamiliar wild mushrooms to cook yourself, let the kitchen finish its required cooking time, avoid mixing many unknown species, and do not combine the meal with alcohol. If dizziness, nausea, vomiting, abdominal pain, diarrhea, agitation, or hallucinations appear, seek medical care immediately and tell the clinician what was eaten; do not wait for the experience to become a story.',
        },
      ],
      quickFacts: [
        { label: 'Useful minimum', value: 'Three full city days; add a fourth for Stone Forest rather than squeezing it into an arrival day' },
        { label: 'Best first base', value: 'Green Lake–Dongfeng Square–Tangzixiang for walkable evenings and airport/metro connections' },
        { label: 'History sequence', value: 'Green Lake and Kunming City Museum first; Yunnan Provincial Museum gets a separate south-city half-day' },
        { label: 'Lake rule', value: 'Red-billed gulls are seasonal; keep bird welfare and current access rules attached to every Dianchi clip' },
        { label: 'Excursion rule', value: '昆明南站 → 石林西站 is only the rail segment; resolve the visitor-center transfer and return too' },
        { label: 'Station rule', value: '昆明站, 昆明南站, and 长水机场 are different products—never plan from the shortened word “Kunming”' },
      ],
      checkedAt: '2026-07-13',
      sources: [
        { title: 'Kunming official tourism: Green Lake Park and seasonal red-billed gulls', url: 'https://chinakunming.travel/en/listings/item/31421/green-lake-park' },
        { title: 'Kunming City Museum: current regular hours, Monday closure, and Tuodong Road address', url: 'https://m.kmmuseum.com/zl_info.asp?id=21' },
        { title: 'Yunnan Provincial Museum: official permanent exhibition on later Yunnan history', url: 'https://www.ynmuseum.org/detail/642.html' },
        { title: 'Kunming official tourism: Yunnan Provincial Museum collection and permanent-gallery sequence', url: 'https://chinakunming.travel/en/blog/item/4570/yunnan-provincial-museum-a-glimpse-into-yunnan-s-history' },
        { title: 'Kunming government: Dounan Flower Market scale, identity, and Metro Line 1 access', url: 'https://en.www.km.gov.cn/2021-06/02/c_629372.htm' },
        { title: 'Kunming government: Dianchi wetland restoration and bird diversity', url: 'https://en.www.km.gov.cn/2023-10/09/c_927552.htm' },
        { title: 'Kunming civil rule: prohibited behavior while viewing red-billed gulls', url: 'https://www.kmrd.gov.cn/c/2023-10-20/527187.shtml' },
        { title: 'Kunming official tourism: Yunnan Stone Forest GeoPark identity and distance', url: 'https://chinakunming.travel/en/destinations/item/33807/yunnan-stone-forest-geopark' },
        { title: 'Kunming official tourism: Stone Forest rail and coach dependency chain', url: 'https://chinakunming.travel/html/180427/1005.html' },
        { title: 'Kunming Airport: Metro Line 6 terminus, transfers, and B2 boarding point', url: 'https://km.ynairport.com/zhjt/5749.jhtml' },
        { title: 'Yunnan CDC: June 2026 wild-mushroom poisoning and cooking warning', url: 'https://ynsjkj.yn.gov.cn/html/2026/jikongkepu_0606/2117.html' },
      ],
    },
  },
  {
    name: 'Dali',
    slug: 'dali',
    type: 'City',
    summary: 'Cangshan weather, Erhai slow travel, Bai merchant towns, and an old city that needs context',
    why: 'Dali becomes a coherent trip when Xiaguan, the old city, Cangshan, the west-shore corridor, and Xizhou are treated as different places with different transport and recovery plans—not as one scenic lake loop.',
    featured: true,
    guideIds: ['china-high-speed-trains', 'china-attraction-tickets-reservations', 'neighborhoods-beyond-landmarks', 'didi-metro-getting-around', 'food-ordering-dietary'],
    mapQuery: '大理市 云南省',
    editorial: {
      dek: 'Dali occupies a narrow inhabited shelf between Cangshan and Erhai. The railway station and airport serve Xiaguan to the south; the old city sits below the mountain; Xizhou is farther up the west shore; and Shuanglang is across the lake. Four days let those distances become a journey instead of a rushed circuit.',
      sections: [
        {
          title: 'Read Dali as a landscape with several centers',
          body: '“Dali” can mean the prefecture, modern Xiaguan, Dali Old Town, or a much wider ring around Erhai. That ambiguity causes the first planning failure. Dali Railway Station is in Xiaguan, well south of the old city. Cangshan rises immediately west of the old city, while Xizhou continues north on the west shore and Shuanglang faces it from the east. Save the exact Chinese destination at every transfer; a generic Dali or Erhai pin is not an executable plan.',
        },
        {
          title: 'Day one: enter the old city through evidence, not atmosphere',
          body: 'Use the South Gate visitor center as the arrival anchor, then walk north on Fuxing Road to Dali City Museum, only about 200 meters inside the gate. The museum occupies the former Du Wenxiu Marshal Mansion and makes the city’s Nanzhao–Dali, imperial, Muslim-rebellion, and modern histories available before the lanes become shops and nightlife. It currently lists free admission Tuesday–Sunday, 09:00–17:00, last entry 16:30, a 1,000-person daily limit, and valid-ID collection of a same-day ticket; confirm the live notice.',
        },
        {
          title: 'Day two: choose one Cangshan product and keep a recovery day',
          body: 'Cangshan is not one cable car. Gantong, Zhonghe, and the Cangshan Grand Cableway use different lower stations and lead to different routes. This guide resolves the Grand Cableway lower station at Tianlongbabu Film City; its upper Ximatan landscape is close to 4,000 meters and can close for wind, ice, storms, maintenance, or fire control. Use only an officially open entrance, check the same-day notice, carry layers and water, descend if altitude symptoms build, and never replace a closure with an unregistered trail suggested by a clip.',
        },
        {
          title: 'Read the Three Pagodas before the reconstructed temple',
          body: 'Chongsheng Temple’s three brick pagodas are the surviving historic core and among southwest China’s most important Buddhist monuments. Much of the temple complex behind them is a modern reconstruction after the original buildings were lost. That distinction makes the visit better: begin with the pagoda ensemble, conservation displays, and Cangshan–Erhai alignment, then decide how much of the large reconstructed axis you want. The cultural-tourism area has its own entrance, ticket, and closing time; it is not a walk-through extension of the old city.',
        },
        {
          title: 'Use Erhai as a protected corridor, not a race around water',
          body: 'The west-shore ecological corridor is a lake-buffer and village landscape as much as a cycle path. Start at the named Longkan entrance and choose a return point that matches daylight, weather, and your bicycle. Current enforcement prohibits motor vehicles and electric vehicles from entering the corridor casually and targets unauthorized rentals, camping, cooking, fishing, and roadside obstruction. A 15-second lake-loop clip does not prove a legal or safe route; use compliant shared bicycles or official services and keep the road-based east-shore circuit as a separate transport decision.',
        },
        {
          title: 'Give Xizhou a heritage half-day of its own',
          body: 'Xizhou is not an old-town cafe annex. Its courtyard houses record Bai building craft, agriculture, education, and the merchant networks that connected western Yunnan to wider trade. Anchor the visit at Yan Family Courtyard Museum off Sifang Street, then walk slowly enough to notice thresholds, screen walls, painted beams, working courtyards, fields, and newer visitor businesses without confusing them. The city’s current protection plan explicitly frames the courtyard as a museum for Xizhou’s commercial tradition and Confucian merchant culture; check live opening and ticket information locally.',
        },
        {
          title: 'Stay for the trip you are actually taking',
          body: 'The old city is the easiest first base for walkable evenings, Cangshan, and Three Pagodas. Xiaguan is better for a late train, early flight, or modern-city errands. Xizhou rewards a quieter north-shore stay but adds transfers to the station and mountain entrances. Shuanglang is a separate east-shore base, not a convenient substitute for all three. Four days works well: old city and museum; Cangshan with weather recovery; Longkan corridor plus Three Pagodas; and Xizhou. Add an east-shore day instead of compressing it into the same loop.',
        },
      ],
      quickFacts: [
        { label: 'Useful minimum', value: 'Four days; keep one mountain day movable because Cangshan access is weather-dependent' },
        { label: 'Best first base', value: 'Dali Old Town for walkable evenings and west-side sights; Xiaguan only when station or airport logistics dominate' },
        { label: 'Arrival rule', value: '大理站 is in Xiaguan, not inside 大理古城—save the exact South Gate handoff before boarding' },
        { label: 'Mountain rule', value: '甘通索道, 中和索道, and 苍山大索道 are different products; never follow a generic “Cangshan cable car” pin' },
        { label: 'Lake rule', value: 'Choose a named ecological-corridor entrance and return point; do not turn one Erhai pin into an automatic motorized circuit' },
        { label: 'Heritage rule', value: 'The ancient Three Pagodas and reconstructed Chongsheng Temple fabric require different historical readings' },
      ],
      checkedAt: '2026-07-13',
      sources: [
        { title: 'Dali City Museum: current opening hours, ID ticket, daily cap, address, and South Gate walking route', url: 'https://www.yndali.gov.cn/dlsrmzf/c106762/pc/content/2014593247609982976/content_2014593247609982976.html' },
        { title: 'Dali Old Town: South Gate visitor-center arrival and station, airport, and Xiaguan connections', url: 'https://www.dali.gov.cn/dlzrmzf/c101724/pc/content/1968887474976559104/content_1968887474976559104.html' },
        { title: 'Dali 2026 mountain-safety notice: 11 authorized Cangshan routes and separate cableway coordinates', url: 'https://www.dali.gov.cn/dlzrmzf/c101532/pc/content/2019595656597901312/content_2019595656597901312.html' },
        { title: 'Dali government: Ximatan altitude and Cangshan landscape identity', url: 'https://www.dali.gov.cn/dlzrmzf/c101724/pc/content/1968887167324360704/content_1968887167324360704.html' },
        { title: 'Dali government: Three Pagodas history, protected area, and reconstructed temple complex', url: 'https://www.dali.gov.cn/dlzrmzf/c101724/pc/content/1968887530844688384/content_1968887530844688384.html' },
        { title: 'Dali 2025 heritage plan: Xizhou architecture and Yan Family Courtyard merchant-history museum', url: 'https://www.yndali.gov.cn/dlsrmzf/c106679/pc/content/1983711388713979904/content_1983711388713979904.html' },
        { title: 'Dali west-shore corridor enforcement: Longkan entrance, vehicle access, rentals, camping, cooking, and fishing', url: 'https://www.yndali.gov.cn/dlsrmzf/c106724/pc/content/1983764619263578112/content_1983764619263578112.html' },
        { title: 'Dali government: 129-kilometer ecological-corridor system as lake buffer and village landscape', url: 'https://www.dali.gov.cn/dlzrmzf/c101533/pc/content/2001909677783355392/content_2001909677783355392.html' },
        { title: 'Dali 2026 e-bike safety initiative: illegal battery, motor, and speed modifications around Erhai', url: 'https://www.dali.gov.cn/dlzrmzf/c101532/pc/content/2031282521012998144/content_2031282521012998144.html' },
        { title: 'Dali Railway Station: current new-building passenger guidance and 12306 checks', url: 'https://www.dali.gov.cn/dlzrmzf/c101532/pc/content/2015703305571897344/content_2015703305571897344.html' },
      ],
    },
  },
  {
    name: 'Lijiang',
    slug: 'lijiang',
    type: 'City',
    summary: 'Three heritage towns, a living water system, and a snow-mountain day that needs an exact ticket product',
    why: 'Lijiang becomes more than lantern lanes when Dayan, Shuhe, and Baisha are read as different parts of one World Heritage property—and Jade Dragon Snow Mountain is planned through exact entrances, ropeways, weather, and altitude limits.',
    featured: true,
    guideIds: ['china-attraction-tickets-reservations', 'china-high-speed-trains', 'neighborhoods-beyond-landmarks', 'didi-metro-getting-around', 'food-ordering-dietary'],
    mapQuery: '丽江市 云南省',
    editorial: {
      dek: 'Lijiang is a living highland city, not one photogenic old town. Four days let you follow Dayan’s water system, distinguish Shuhe from Baisha, and approach Jade Dragon Snow Mountain with the correct admission, ropeway, weather, and altitude plan.',
      sections: [
        {
          title: 'The World Heritage site has three towns',
          body: 'UNESCO’s Old Town of Lijiang is a serial property: Dayan, including Black Dragon Pool; the Shuhe housing cluster; and the older Baisha housing cluster. They are not interchangeable branches of the same shopping street. Dayan is the dense commercial and administrative center, Shuhe grew along the Tea Horse Road northwest of it, and Baisha preserves an older settlement pattern and a mural complex farther north. Save all three Chinese identities before deciding which actually belongs in your trip.',
        },
        {
          title: 'Day one: follow the water through Dayan',
          body: 'Begin at Mufu for the Mu ruling house and the political story behind the old city, then use the lanes as a water route rather than a souvenir circuit. Follow canals and wells north toward Black Dragon Pool, the source landscape UNESCO includes in the Dayan component. The fixed pins are the museum complex and the park’s south gate; a broad “Lijiang Old Town” center pin cannot tell a driver where to meet you or preserve the direction of the walk. Recheck Mufu and park notices before relying on an interior visit.',
        },
        {
          title: 'Day two: Shuhe and Baisha are not interchangeable',
          body: 'Use Shuhe’s north gate as one clear arrival, then walk into the old streets instead of accepting the first parking-lot or e-cart substitute. Continue to Baisha only if you have time to read it slowly. The map-ready anchor there is the Baisha Murals ticket office, not a cafe using the town name. The murals and surviving religious complex preserve centuries of Naxi, Tibetan, Bai, and Han exchange. Shuhe can exceed 30,000 daily visits in peak periods, so “quieter than Dayan” is a relative claim, not a promise; go early and keep either town as a half-day rather than stacking every northern stop.',
        },
        {
          title: 'Day three: book a product, not “the snow mountain”',
          body: 'Jade Dragon Snow Mountain admission and a ropeway are not the same purchase. For 2026, scenic-area admission is sold up to seven days ahead through the official 玉龙雪山服务 mini program, with offline service at the new visitor center. Glacier Park, Spruce Meadow, and Yak Meadow are three separate ropeways with different lower stations, scenery, operating conditions, and capacity. The official operator has used seven-day real-name sales for ropeways; confirm the current release notice and never let a generic “cable car” clip choose the product for you.',
        },
        {
          title: 'Keep every optional mountain product unbundled',
          body: 'A May 2026 scenic-area notice says the ropeways, Impression Lijiang show, sightseeing train, and electric-cart products at Blue Moon Valley and Spruce Meadow are voluntary purchases rather than mandatory bundles. Compare the exact product names and prices before paying a hotel, driver, or reseller. Local authorities have specifically warned against unlicensed operators and false “guaranteed Glacier Park ropeway” claims. Use the official service center and official operator channels; if your chosen ropeway sells out, choose a different open product intentionally rather than buying an invented system ticket.',
        },
        {
          title: 'Treat Glacier Park as an altitude day, not a costume change',
          body: 'Dayan is already around 2,400 meters, while the Glacier Park visitor route reaches 4,680 meters. Keep the first two city days easy enough to notice how you are adapting, make the mountain day physically light, and do not ascend with altitude symptoms. If symptoms worsen at elevation, descend and seek help; travelers with relevant heart, lung, or other medical conditions should discuss high-altitude travel with a qualified clinician. The Glacier Park lower-station pin preserves the ropeway identity, but it is not an independent road entrance: follow the scenic-area transport and timed product instructions from the visitor center.',
        },
        {
          title: 'Weather changes the plan; it does not open a shortcut',
          body: 'Wind, snow, icing, lightning, fire control, or maintenance can stop a ropeway after you have planned the day. Check the official scenic-area and Lijiang Tourism Group channels again that morning and keep the original purchase channel for refunds. A closure is a signal to use a lower-elevation Dayan, Shuhe, Baisha, or museum day—not to follow a video into an undeveloped route. Lijiang authorities warn that entering unopened mountain areas can bring rescue costs and administrative penalties.',
        },
        {
          title: 'Stay at the road edge your luggage can actually reach',
          body: 'Dayan is the easiest first base for evening walks and city transport, but deep cobbled lanes turn a romantic address into a long luggage carry. Choose a named road-edge meeting point and confirm whether the property can collect you. Shuhe is a more spread-out base with additional road transfers; Baisha is slowest and farthest north, with fewer late options. Lijiang Station has direct rail links toward Dali and Shangri-La, but Tiger Leaping Gorge remains a separate onward-route decision—do not compress it into the snow-mountain day.',
        },
      ],
      quickFacts: [
        { label: 'Useful minimum', value: 'Four days: Dayan water route; Shuhe and Baisha; one movable mountain day; one recovery or onward day' },
        { label: 'Best first base', value: 'The road edge of Dayan for a first visit—confirm the exact luggage handoff before booking a deep old-town lane' },
        { label: 'Heritage rule', value: '大研古城, 束河古镇, and 白沙古镇 are three distinct World Heritage components, not duplicate old-town pins' },
        { label: 'Ticket rule', value: '玉龙雪山门票 is separate from 冰川公园索道, 云杉坪索道, 牦牛坪索道, shows, trains, and electric carts' },
        { label: 'Altitude rule', value: 'The city is near 2,400 m and Glacier Park reaches 4,680 m—keep the day light and descend if symptoms worsen' },
        { label: 'Recovery rule', value: 'If weather closes the chosen ropeway, keep the official refund path and switch to a lower-elevation heritage day' },
      ],
      checkedAt: '2026-07-13',
      sources: [
        { title: 'UNESCO: Dayan, Black Dragon Pool, Baisha, Shuhe, water system, murals, and living heritage', url: 'https://whc.unesco.org/en/list/811/' },
        { title: 'China World Heritage monitoring center: current protected-property scope across Dayan, Shuhe, and Baisha', url: 'https://www.wochmoc.org.cn/contents/32/2246.html' },
        { title: 'Yunnan Xinhua: 2026 Jade Dragon admission, seven-day official mini-program purchase, and new visitor center', url: 'https://www.yn.news.cn/20251223/2ec236a557984b6e8bef8acc5d07b7b9/c.html' },
        { title: 'Jade Dragon scenic-area notice: 2026 optional products must not be forced into ticket bundles', url: 'https://www.lijiang.cn/article/172717.html' },
        { title: 'Yunnan Xinhua: Glacier Park, Spruce Meadow, and Yak Meadow are three separately booked ropeways', url: 'https://www.yn.xinhuanet.com/20250711/d900e7710f4c40d48c2f75069b9d3c8c/c.html' },
        { title: 'Lijiang public-credit notice: unlicensed tours and false guaranteed Glacier Park ropeway claims', url: 'https://credit.lijiang.gov.cn/466b0067d6f645c689396bd2c7ec46cd.html' },
        { title: 'Lijiang public-credit notice: undeveloped mountain areas, rescue costs, and penalties', url: 'https://credit.lijiang.gov.cn/top_dxal.html' },
        { title: 'Jade Dragon service report: staffed support and the 4,680-metre Glacier Park visitor point', url: 'https://www.lijiang.cn/Appx/dislayArticlePage/ctype/article/cid/165320/' },
        { title: 'CDC Yellow Book 2026: acclimatization, symptoms, descent, and high-altitude medical guidance', url: 'https://www.cdc.gov/yellow-book/hcp/environmental-hazards-risks/high-altitude-travel-and-altitude-illness.html' },
        { title: 'Yunnan transport department: current Lijiang rail links and city-to-station tourism routes', url: 'https://jtyst.yn.gov.cn/html/2025/xingyexinwen_1113/3135630.html' },
        { title: 'Lijiang public-credit report: peak Shuhe volume and current visitor-management measures', url: 'https://credit.lijiang.gov.cn/ebcff3e78f99468e9ae6b46cbf6e8975.html' },
      ],
    },
  },
  {
    name: 'Guilin',
    slug: 'guilin',
    type: 'City',
    summary: 'A karst city, Ming royal history, cave geology, and the upstream half of a one-way Li River journey',
    why: 'Guilin is worth two grounded city days before the river: read how tower karst shaped the basin, put the Ming princes back into the center, then choose the exact cruise terminal that turns the city stay into a Yangshuo transfer.',
    featured: true,
    guideIds: ['china-attraction-tickets-reservations', 'china-high-speed-trains', 'neighborhoods-beyond-landmarks', 'didi-metro-getting-around', 'hotels-foreigners-china'],
    mapQuery: '桂林市 广西壮族自治区',
    editorial: {
      dek: 'Guilin is not the airport before Yangshuo. Two city days reveal the lowland tower-karst landscape, a Ming princely city, and the underground system; a third morning becomes a one-way river transfer only after the ticket, terminal, luggage, and weather dependencies are explicit.',
      sections: [
        {
          title: 'Read the city before boarding the river',
          body: 'UNESCO describes Guilin Karst as the best-known continental fenglin landscape: isolated towers and clustered peaks developed together in a low basin fed by water from the surrounding hills. That is why the city feels threaded between rock, river, cave, road, and ordinary neighborhoods. Start with the landscape as a system instead of collecting one elephant-shaped photo and leaving for Yangshuo.',
        },
        {
          title: 'Arrival half-day: use the museum to separate city from scenery',
          body: 'Guilin Museum’s current building is in Lingui, west of the historic center, not at its former downtown address. Its city-history, folk-culture, Jingjiang-princes, and international-exchange displays give the region a chronology before the landscape becomes a slogan. The museum normally lists free admission Tuesday–Sunday, 09:00–17:00, with last entry at 16:30 and Monday closure; verify the current notice and group it with an airport or west-side arrival rather than pretending it sits beside the river sights.',
        },
        {
          title: 'Day one: put the Ming city back inside modern Guilin',
          body: 'Enter the Duxiu Peak–Jingjiang Princes’ City scenic area through Zhengyang Gate. The walled compound, princely history, examination culture, cliff inscriptions, and Solitary Beauty Peak explain why this was a political center, not merely a viewpoint behind a shopping street. Walk south through the public city to Elephant Trunk Hill’s Gate 1 as a second, separate identity. The hill is a compact river landmark; it does not replace the royal-city visit or the larger karst story.',
        },
        {
          title: 'Day two: read one cave as part of the same water system',
          body: 'Reed Flute Cave is northwest of the center and has its own visitor center, timed interior, steps, lighting, and transport requirement. Its official route is roughly 500 meters inside a 240-meter-deep cave. Treat the formations as evidence of dissolution and deposition inside the same limestone landscape seen above ground. Check the live opening and ticket notice; combine it with a slow city afternoon rather than stacking several similar caves or buying an undefined “Guilin caves” package.',
        },
        {
          title: 'Day three: the Li River cruise is a base change',
          body: 'The official classic cruise runs roughly four hours and about 60 kilometers downstream, ending at Yangshuo Longtoushan Wharf; it does not return to Guilin. The ticket does not include transport from the city to the departure port or onward transport after arrival, and the official guidance says there is no luggage-storage service because the boats run one way. Pack for the next hotel, leave Guilin early enough for ticket and security checks, and do not build the day around a same-city return assumption.',
        },
        {
          title: 'Choose the terminal that matches the ticket',
          body: 'Three-star boats leave from Mopan Mountain Passenger Port; four-star boats leave from Zhujiang Passenger Port. The official guide places the ports about 6.5 kilometers apart and roughly 40–50 minutes from central Guilin. They are not two names for the same jetty. Preserve the Chinese terminal from the confirmed ticket, allow about ninety minutes from the city, and reject a driver’s claim that either port is close enough when boarding has already begun.',
        },
        {
          title: 'Water level is a dependency, not a footnote',
          body: 'Heavy rain, high water, low water, fog, or a maritime-control notice can change or stop navigation. In July 2026 the official operator suspended and then restored the classic and Xingping routes as water conditions changed. Check the official notice again on departure morning and keep the purchase channel for refunds or rebooking. Your recovery day is still a complete Guilin day—museum, royal city, cave, or public lakeside walk—not an unlicensed boat sold outside the terminal.',
        },
        {
          title: 'Stay for the route you are actually taking',
          body: 'The historic center between Wangcheng and Shan Lake is the easiest first base for walking and food. Lingui is practical for the museum, airport, or west-side errands but not for every central sight. Guilin, Guilin North, and Guilin West are different railway stations; save the exact Chinese station from 12306. Longji Rice Terraces require their own long transfer and are better treated as an overnight or a separate route, not squeezed between a cave and the morning cruise.',
        },
      ],
      quickFacts: [
        { label: 'Useful minimum', value: 'Two city days, then a third morning for a one-way Li River transfer to Yangshuo' },
        { label: 'Best first base', value: 'Central Guilin between 王城 and 杉湖 for walkable evenings; use Lingui only when west-side logistics dominate' },
        { label: 'Karst rule', value: 'Read the city towers, cave interior, and Li River as one water-shaped limestone system—not three unrelated photo stops' },
        { label: 'Cruise rule', value: '磨盘山客运港 serves three-star boats; 竹江客运港 serves four-star boats; both end at 阳朔龙头山码头' },
        { label: 'Luggage rule', value: 'The classic cruise is one way and has no luggage storage—board with the luggage plan for your Yangshuo stay' },
        { label: 'Weather rule', value: 'Check the official maritime notice on departure morning and keep a complete city-day recovery route' },
      ],
      checkedAt: '2026-07-13',
      sources: [
        { title: 'UNESCO: Guilin tower and cone karst as a world-reference lowland landscape', url: 'https://whc.unesco.org/en/list/1248/' },
        { title: 'Guilin Museum: current Lingui building, history collections, opening pattern, and address', url: 'https://govt.chinadaily.com.cn/s/201905/30/WS5cef978d498e079e68022101/guilin-museum.html' },
        { title: 'Duxiu Peak–Jingjiang Princes’ City official site: compound, inscriptions, archaeology, and visitor notices', url: 'https://www.glwangcheng.com/' },
        { title: 'Two Rivers and Four Lakes–Elephant Hill official site: authenticated Elephant Trunk Hill visitor information', url: 'https://www.glljsh.com/category/xbs.html' },
        { title: 'Reed Flute Cave official site: cave identity and interior route', url: 'https://wptour.cn/' },
        { title: 'Li River official guide: one-way cruise, ticket identity, luggage, transport, and refund rules', url: 'https://www.liriver.com.cn/page/article/zxlj.jqdt/126' },
        { title: 'Li River official transport guide: Mopan versus Zhujiang ports and Longtoushan arrival', url: 'https://www.liriver.com.cn/mobile/article/lyfw.jtcx' },
        { title: 'Li River official 2026 pricing and route table', url: 'https://www.liriver.com.cn/mobile/article/lyfw.pwxx' },
        { title: 'Li River official July 2026 notice: navigation restored after water-level control', url: 'https://www.liriver.com.cn/page/article/zxlj.tzgg/192' },
        { title: 'Li River official 2026 holiday release window and official booking channel', url: 'https://www.liriver.com.cn/mobile/article/zxlj.tzgg/176' },
      ],
    },
  },
  {
    name: 'Yangshuo',
    slug: 'yangshuo',
    type: 'Traveler search region',
    summary: 'A county with three different bases, two river systems, and outdoor days that depend on exact stations, wharves, and return points',
    why: 'Yangshuo works when the county town, Xingping, and the Yulong River are treated as separate bases and products—not as one scooter loop with a “bamboo raft” pin somewhere in the middle.',
    featured: true,
    guideIds: ['china-high-speed-trains', 'china-attraction-tickets-reservations', 'neighborhoods-beyond-landmarks', 'didi-metro-getting-around', 'hotels-foreigners-china'],
    mapQuery: '阳朔县 桂林市 广西壮族自治区',
    editorial: {
      dek: 'Yangshuo is a county, not a compact old town. Four days let the county town, Xingping, and the Yulong River keep different jobs: arrival and evenings, Li River geology and heritage, and one bounded slow-mobility or bamboo-raft route with a real endpoint.',
      sections: [
        {
          title: 'Choose among three bases, not one “Yangshuo” pin',
          body: 'Yangshuo town is the main lodging and evening base; Xingping is a separate historic town upstream on the Li River; the Yulong River corridor runs west and south through villages, bridges, paths, and several raft wharves. Yangshuo Railway Station is in Xingping, not beside West Street or the county-town hotels. Decide which base owns each day before booking a room or accepting an app’s generic county-center result.',
        },
        {
          title: 'Arrival can mean a station or a downstream wharf',
          body: 'High-speed rail arrives at 阳朔站 in Xingping. The full Guilin cruise arrives at 龙头山码头 in Yangshuo town. Those are different entry stories and should produce different first days. From the station, keep Xingping or transfer onward by a confirmed bus or car; from Longtoushan, walk or transfer to the actual hotel with your luggage. Neither arrival proves that a nearby “ancient town,” viewpoint, or boat product is included.',
        },
        {
          title: 'Day one: let the county town be useful without mistaking it for the whole county',
          body: 'Use Yangshuo town for check-in, food, laundry, onward bookings, and a public evening walk. West Street is lively but noisy and visitor-facing; staying a few streets away preserves walkability without making the commercial strip the trip’s only identity. If you arrived by the one-way cruise, keep the afternoon light. A river day already includes an early road transfer, security, four hours on the water, and a luggage handoff.',
        },
        {
          title: 'Day two: Xingping is both geology and a transport problem',
          body: 'Xingping is a 1,700-year-old town inside the Guilin Karst landscape, but the station, old streets, Li River bank, and Chaobanshan Wharf are separate locations. Use the wharf only for the exact officially sold Xingping boat or raft route. The famous ¥20-banknote landscape is a river section, not permission to trespass across fields or climb an unmarked limestone hill. Keep the station transfer and last ride back to your chosen base explicit.',
        },
        {
          title: 'Do not let “bamboo raft” hide the river or route',
          body: 'An Xingping Li River sightseeing raft is not a Yulong River bamboo raft. Even within the Yulong system, each ticket has a named start, endpoint, distance, weirs, capacity, and return problem. This guide resolves 骥马码头 to the 工农桥综合码头 for the official six-kilometer middle-to-lower route. The operator describes nine weirs on that section. If you want the upper river or a shorter loop, buy that named route instead—never assume every wharf is interchangeable.',
        },
        {
          title: 'Day three: build one Yulong route with an exit',
          body: 'Begin a slow day at Jiuxian’s Shuangliu Ferry Pavilion or at Jima Wharf, not at an abstract Yulong River center pin. Walk or cycle only the public route you can finish in daylight, and preserve the return or pickup point before starting. The official detailed plan treats Jima, Jinlong Bridge, and Gongnong Bridge as major wharves and plans separate walking, cycling, shuttle, and vehicle networks. That is the right mental model: a corridor with controlled access and transfers, not an unrestricted e-bike trail through every village courtyard.',
        },
        {
          title: 'Weather changes both rivers differently',
          body: 'Rain and water level can suspend Li River navigation or change Yulong operations while roads remain open. Check the Li River and Yulong official channels separately on the morning of use. If a raft closes, keep the public greenway, village route, county-town day, or Xingping streets only where conditions remain safe. Do not replace a closure with an unofficial raft, improvised crossing, cave, or steep social-video viewpoint.',
        },
        {
          title: 'Four days should change pace, not multiply products',
          body: 'A useful rhythm is arrival and county town; one Xingping day; one Yulong route; and one flexible outdoor or recovery day. Add climbing only with a reputable local operator, suitable equipment, and a route matched to your experience. Add Longji as a separate overnight from Guilin, not a day attached to Yangshuo. The strongest trip alternates boat, foot, bicycle, and rest instead of booking a cave, show, raft, cruise, scooter, and viewpoint into every daylight hour.',
        },
      ],
      quickFacts: [
        { label: 'Useful minimum', value: 'Four days: arrival and county town; Xingping; one bounded Yulong route; one outdoor or weather-recovery day' },
        { label: 'Base rule', value: '阳朔镇, 兴坪镇, and 遇龙河沿线 solve different trips; choose the base before choosing the hotel' },
        { label: 'Rail rule', value: '阳朔站 is in Xingping, not beside West Street—preserve the onward transfer to the county town or your river base' },
        { label: 'River rule', value: '漓江兴坪排筏 and 遇龙河竹筏 are different products; every Yulong ticket also needs a named start and endpoint' },
        { label: 'Route rule', value: 'A one-way raft or ride is incomplete until the endpoint, return vehicle, daylight, and luggage plan are saved' },
        { label: 'Safety rule', value: 'Use official wharves and public routes; weather closure never validates an unofficial raft or unmarked karst climb' },
      ],
      checkedAt: '2026-07-13',
      sources: [
        { title: 'UNESCO: Guilin Karst’s Lijiang and Putao components, tower karst, and river landscape', url: 'https://whc.unesco.org/en/list/1248/' },
        { title: 'Guangxi civil-affairs department: Xingping history, place identity, and Li River setting', url: 'https://mzt.gxzf.gov.cn/bgdmwhxlzb/gxdmwhyc/t16833316.shtml' },
        { title: 'Guangxi natural-resources record: Yangshuo Station is a rail facility in Xingping', url: 'https://dnr.gxzf.gov.cn/www/expro/searchExproIframe?address=&adminRegionCode=450321&approvalCode=&pageNum=9&pageSize=4&projectName=&publishTime=' },
        { title: 'Li River official transport guide: Longtoushan is the one-way Guilin cruise arrival', url: 'https://www.liriver.com.cn/mobile/article/lyfw.jtcx' },
        { title: 'Li River official ticket guide: Xingping products use a separate water-tour platform', url: 'https://www.liriver.com.cn/mobile/article/lyfw.pwxx' },
        { title: 'Yangshuo Li River operator: Chaobanshan Wharf and named Xingping raft routes', url: 'https://ljjq.com/' },
        { title: 'Yulong River official site: Jima-to-Gongnong route, distance, weirs, and endpoints', url: 'https://www.ysylh.cn/matou/2023/jimamatouView.shtml' },
        { title: 'Yulong River official site: Jinlong Bridge route and access identity', url: 'https://www.ysylh.cn/matou/2025/jinglongqiaoView.shtml' },
        { title: 'Yulong River detailed plan: major wharves and separate walking, cycling, shuttle, and road networks', url: 'https://lyj.gxzf.gov.cn/zfxxgkzl/fdzdgknr/gggs/P020230823401747754653.pdf' },
        { title: 'Li River official July 2026 navigation notice: suspension and restoration are water-condition dependent', url: 'https://www.liriver.com.cn/page/article/zxlj.tzgg/192' },
        { title: 'Guangxi natural-resources department: current karst protection and geohazard work', url: 'https://dnr.gxzf.gov.cn/zfxxgk/fdzdgknr/xxgk/jytadf/t20719314.shtml' },
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
  guangzhou: { x: 59, y: 80 },
  shenzhen: { x: 60, y: 81 },
  hangzhou: { x: 70, y: 65 },
  kunming: { x: 43, y: 76 },
  dali: { x: 39, y: 75 },
  lijiang: { x: 40, y: 72 },
  guilin: { x: 53, y: 76 },
  yangshuo: { x: 54, y: 78 },
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
