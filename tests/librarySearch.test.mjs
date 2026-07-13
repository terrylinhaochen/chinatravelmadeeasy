import { strict as assert } from 'node:assert';
import test from 'node:test';
import { libraryTerms, rankLibraryItems } from '../src/utils/librarySearch.js';
import { guideSearchText } from '../src/utils/guideSearchText.js';

const items = [
  {
    id: 'internet',
    title: 'Internet in China: Verify Your eSIM, Roaming, Wi-Fi & App Access',
    summary: 'Prepare Android or iPhone and recover when mobile data fails after landing.',
    label: 'Internet & Apps',
    searchText: 'esim no data google maps roaming hotspot phone support',
  },
  {
    id: 'maps',
    title: 'China Maps, Didi, and Metro',
    summary: 'Resolve a Chinese place and open it in a local map.',
    label: 'Transport',
    searchText: 'google maps amap didi metro station',
  },
  {
    id: 'visa',
    title: 'China Visa-Free Entry',
    summary: 'Choose the correct entry route for a passport.',
    label: 'Visas & Entry',
    searchText: 'passport visa transit',
  },
  {
    id: 'translation',
    title: 'China Without Chinese: Offline Translation, Camera Menus & Address Cards',
    summary: 'Translate a QR menu screenshot offline and preserve official Chinese place identities.',
    label: 'Language',
    searchText: 'offline translate translation camera qr menu screenshot chinese address iphone android',
  },
  {
    id: 'food',
    title: 'Ordering Food in China: QR Menus, Dietary Cards & Delivery Recovery',
    summary: 'Assess peanut allergy, celiac cross-contact, QR-menu ordering, and restaurant delivery failures.',
    label: 'Food',
    searchText: 'celiac gluten peanut nut allergy allergen cross contact chef card vegetarian vegan halal delivery menu translation',
  },
  {
    id: 'street-food',
    title: 'China Street Food & Night Markets: City Routes, Stall Evidence & Safer Ordering',
    summary: 'Distinguish a dish idea, market route, and resolved stall before handing it to a map.',
    label: 'Food',
    searchText: 'tiktok instagram street food jianbing xian stall vendor market route resolved chinese storefront pin',
  },
  {
    id: 'tea',
    title: 'Tea in China: Teahouse Sessions, Tea-Country Routes & Buying Without Guesswork',
    summary: 'Resolve the venue, confirm tasting and room charges, and avoid invitation scams.',
    label: 'Food',
    searchText: 'tea ceremony teahouse stranger invitation scam bund tasting charge price weight heming longjing maliandao',
  },
  {
    id: 'neighborhoods',
    title: 'China Neighborhood Walks: Public Routes, Residential Boundaries & Reliable Exits',
    summary: 'Turn a hutong, longtang, park, or neighborhood Reel into a bounded public route with an accessible exit.',
    label: 'Places',
    searchText: 'hutong courtyard longtang neighborhood reel private resident wheelchair step free route exit photography wudaoying wukang yulin',
  },
  {
    id: 'festivals',
    title: 'China Festivals & Nightlife: Verify the Date, Event Zone, Ticket and Last Ride',
    summary: 'Resolve the current event, ticketed zone, entrance, closure, crowd fallback, and final transport.',
    label: 'Authentic China',
    searchText: 'yuyuan lantern festival ticket zone gucheng park event date entrance closure last metro harbin ice weather temple fair dragon boat ktv bathhouse',
  },
];

test('natural-language filler does not become a guide-search requirement', () => {
  assert.deepEqual(libraryTerms('My eSIM has no data after landing and I need Google Maps'), ['esim', 'data', 'landing', 'google', 'maps']);
  assert.deepEqual(libraryTerms("Xi'an and Xi’an"), ['xian', 'xian']);
});

test('a connectivity failure ranks the actionable connectivity guide above a generic map guide', () => {
  const ranked = rankLibraryItems(items, 'My eSIM has no data after landing and I need Google Maps');
  assert.equal(ranked[0].item.id, 'internet');
  assert.deepEqual(ranked.map((entry) => entry.item.id), ['internet', 'maps']);
});

test('an offline QR-menu problem ranks the task-specific translation guide first', () => {
  const ranked = rankLibraryItems(items, 'I need to translate a QR menu offline');
  assert.equal(ranked[0].item.id, 'translation');
});

test('a medical dietary-risk question ranks food safety above generic translation', () => {
  const ranked = rankLibraryItems(items, 'I have celiac and a peanut allergy; can I trust the menu translation?');
  assert.equal(ranked[0].item.id, 'food');
});

test('a vague social street-food recommendation ranks the identity workflow', () => {
  const ranked = rankLibraryItems(items, 'The TikTok only says jianbing in Xi\'an; which stall should I save?');
  assert.equal(ranked[0].item.id, 'street-food');
  assert.deepEqual(ranked.map((entry) => entry.item.id), ['street-food']);
});

test('a stranger-led tea invitation ranks the tea-session safety workflow', () => {
  const ranked = rankLibraryItems(items, 'A stranger near the Bund invited me to a free tea ceremony; what charges should I check?');
  assert.equal(ranked[0].item.id, 'tea');
});

test('a residential-access neighborhood question ranks the bounded public-route workflow', () => {
  const ranked = rankLibraryItems(items, 'A Reel shows an open hutong courtyard. Can I go inside with a wheelchair?');
  assert.equal(ranked[0].item.id, 'neighborhoods');
});

test('an event-zone question ranks the festival execution workflow', () => {
  const ranked = rankLibraryItems(items, 'The Reel says Yuyuan lantern festival, but which zone needs a ticket and when does it close?');
  assert.equal(ranked[0].item.id, 'festivals');
  assert.deepEqual(ranked.map((entry) => entry.item.id), ['festivals']);
});

test('production guide search includes decision context and long-form body evidence', () => {
  const foodGuide = {
    body: 'For celiac disease, soy sauce and a shared wok can be unsafe. Peanut allergy requires cross-contact review.',
    data: {
      title: 'Ordering Food in China: QR Menus, Dietary Cards & Delivery Recovery',
      description: 'Complete or recover from a restaurant order.',
      category: 'Food',
      decision: {
        bestFor: 'Travelers with medical dietary restrictions.',
        doThis: 'Verify the kitchen.',
        watchFor: 'Translation is not an ingredient list.',
      },
      faqs: [],
    },
  };
  const translationGuide = {
    body: 'Use screenshot translation for a menu.',
    data: {
      title: 'China Without Chinese: Offline Translation, Camera Menus & Address Cards',
      description: 'Translate routine text.',
      category: 'Language',
      faqs: [],
    },
  };
  const productionItems = [
    { id: 'translation', title: translationGuide.data.title, summary: translationGuide.data.description, label: translationGuide.data.category, searchText: guideSearchText(translationGuide) },
    { id: 'food', title: foodGuide.data.title, summary: foodGuide.data.description, label: foodGuide.data.category, searchText: guideSearchText(foodGuide) },
  ];

  assert.match(guideSearchText(foodGuide), /celiac disease/);
  const ranked = rankLibraryItems(productionItems, 'I have celiac and a peanut allergy; can I trust the menu translation?');
  assert.equal(ranked[0].item.id, 'food');
  assert.deepEqual(ranked.map((entry) => entry.item.id), ['food', 'translation']);
});

test('long natural-language searches exclude incidental one-term overlaps', () => {
  const ranked = rankLibraryItems(
    [...items, { id: 'incidental', title: 'Neighborhood Walks', summary: 'Carry a translation app.', label: 'Places', searchText: 'translation' }],
    'I have celiac and a peanut allergy; can I trust the menu translation?'
  );
  assert.equal(ranked.some((entry) => entry.item.id === 'incidental'), false);
});
