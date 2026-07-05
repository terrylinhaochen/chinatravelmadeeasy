import { requireGeneratedImage } from './generatedImages';

export interface DestinationImage {
  src: string;
  alt: string;
  source: string;
  title: string;
}

export interface Destination {
  name: string;
  slug: string;
  type: 'Municipality' | 'Province' | 'Autonomous region' | 'Special administrative region' | 'Traveler search region';
  summary: string;
  why: string;
  featured?: boolean;
  guideIds: string[];
  mapQuery: string;
  image: DestinationImage;
}

const defaultGuideIds = [
  'china-pre-departure-checklist',
  'alipay-wechat-pay-foreign-cards',
  'internet-esim-vpn-blocked-apps',
  'translation-language-survival',
];

const destinationRecords: Omit<Destination, 'image'>[] = [
  {
    name: 'Hong Kong',
    slug: 'hong-kong',
    type: 'Special administrative region',
    summary: 'Visa-free exit point, food, transit, skyline',
    why: 'Hong Kong is one of the easiest add-ons to a mainland China trip and a practical exit point for transit-visa routing.',
    featured: true,
    guideIds: ['china-visa-free-2026', 'china-pre-departure-checklist', 'street-food-night-markets', 'internet-esim-vpn-blocked-apps'],
    mapQuery: 'Hong Kong',
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
    guideIds: ['7-day-china-itinerary', 'neighborhoods-beyond-landmarks', 'food-ordering-dietary', 'alipay-wechat-pay-foreign-cards'],
    mapQuery: 'Shanghai China',
  },
  {
    name: 'Beijing',
    slug: 'beijing',
    type: 'Municipality',
    summary: 'Imperial sights, hutongs, Great Wall access',
    why: "Beijing anchors classic first trips because it combines Forbidden City logistics, hutong neighborhoods, Great Wall day trips, and high-speed rail links to Xi'an and Shanghai.",
    featured: true,
    guideIds: ['7-day-china-itinerary', 'neighborhoods-beyond-landmarks', 'china-high-speed-trains', 'china-visa-free-2026'],
    mapQuery: 'Beijing China',
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
    guideIds: ['7-day-china-itinerary', 'china-high-speed-trains', 'street-food-night-markets', 'food-ordering-dietary'],
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

export const destinations: Destination[] = destinationRecords.map((destination) => {
  const generated = requireGeneratedImage(`region:${destination.slug}`);
  const image = {
    src: generated.src,
    alt: generated.alt,
    source: generated.source,
    title: generated.title,
  };
  return { ...destination, image };
});

export const featuredDestinations = destinations.filter((destination) => destination.featured);

export function getDestination(slug: string) {
  return destinations.find((destination) => destination.slug === slug);
}
