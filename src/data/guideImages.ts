export type GuideImage = {
  src: string;
  alt: string;
};

const GUIDE_IMAGES: Record<string, GuideImage> = {
  '7-day-china-itinerary': {
    src: '/images/great-wall.jpg',
    alt: 'The Great Wall near Beijing, a classic first-trip stop in China',
  },
  'alipay-wechat-pay-foreign-cards': {
    src: '/images/china-street-food.jpg',
    alt: 'A Chinese street food stall where mobile payment is commonly used',
  },
  'china-high-speed-trains': {
    src: '/images/china-high-speed-train.jpg',
    alt: 'Chinese high-speed train at a station platform',
  },
  'china-pre-departure-checklist': {
    src: '/images/china-immigration.jpg',
    alt: 'China immigration inspection sign at an airport',
  },
  'china-visa-free-2026': {
    src: '/images/china-immigration.jpg',
    alt: 'China immigration inspection sign for entry and visa planning',
  },
  'didi-metro-getting-around': {
    src: '/images/china-high-speed-train.jpg',
    alt: 'Rail platform in China with a high-speed train',
  },
  'festivals-and-local-experiences': {
    src: '/images/chinese-lanterns.jpg',
    alt: 'Red Chinese lanterns glowing at night',
  },
  'food-ordering-dietary': {
    src: '/images/china-street-food.jpg',
    alt: 'Chinese street food stall with signs and visible dishes',
  },
  'hotels-foreigners-china': {
    src: '/images/china-hotel-lobby.jpg',
    alt: 'Modern hotel lobby in China',
  },
  'internet-esim-vpn-blocked-apps': {
    src: '/images/shanghai-skyline.jpg',
    alt: 'Shanghai skyline representing connected city travel in China',
  },
  'neighborhoods-beyond-landmarks': {
    src: '/images/beijing-hutong.jpg',
    alt: 'Lived-in Beijing hutong lane with plants and scooters',
  },
  'street-food-night-markets': {
    src: '/images/china-street-food.jpg',
    alt: 'Night street food stall in China',
  },
  'tea-houses-and-rituals': {
    src: '/images/chengdu-tea-shop.jpg',
    alt: 'Traditional tea shop in Chengdu with lanterns and signs',
  },
  'translation-language-survival': {
    src: '/images/china-street-signs.jpg',
    alt: 'Chinese and English street signs useful for navigation and translation',
  },
};

const FALLBACK_IMAGE: GuideImage = {
  src: '/images/shanghai-skyline.jpg',
  alt: 'China city skyline at night',
};

export function getGuideImage(id: string): GuideImage {
  return GUIDE_IMAGES[id] ?? FALLBACK_IMAGE;
}
