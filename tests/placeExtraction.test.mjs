import { strict as assert } from 'node:assert';
import test from 'node:test';
import { DEFAULT_MAINLAND_MAP_PROVIDER, displayName, extractTripPlaces, mapProviderUrl } from '../src/utils/placeExtraction.js';

test('mainland map handoffs default to AMap without hiding the Apple alternative', () => {
  const place = { name: 'Kuixinglou Square', localName: '魁星楼广场', city: 'Chongqing', latitude: 29.5607, longitude: 106.5790 };
  assert.equal(DEFAULT_MAINLAND_MAP_PROVIDER, 'amap');
  assert.match(mapProviderUrl(DEFAULT_MAINLAND_MAP_PROVIDER, place), /^https:\/\/uri\.amap\.com\/marker/);
  assert.match(mapProviderUrl('apple', place), /^https:\/\/maps\.apple\.com\//);
});

test('a bare social URL is not presented as extracted content', () => {
  const result = extractTripPlaces('https://www.tiktok.com/@china/video/1234567890');
  assert.equal(result.places.length, 0);
  assert.equal(result.needsMoreText, true);
});

test('numbered lists resolve known places and preserve local names', () => {
  const result = extractTripPlaces({ text: '1. Shanghai Museum\n2. Xintiandi\n3. Longhua Temple' });
  assert.deepEqual(result.places.map((place) => place.name), ['Shanghai Museum', 'Xintiandi', 'Longhua Temple']);
  assert.match(displayName(result.places[0]), /上海博物馆/);
});

test('line normalization does not merge adjacent list items', () => {
  const result = extractTripPlaces({ text: '1. Shanghai Museum\n2. Xintiandi' });
  assert.deepEqual(result.places.map((place) => place.name), ['Shanghai Museum', 'Xintiandi']);
});

test('a hotel containing Bund is not mistaken for the attraction', () => {
  const result = extractTripPlaces({ text: 'We stayed near Campanile Shanghai Bund Hotel.' });
  assert.equal(result.places.some((place) => place.name === 'The Bund'), false);
  assert.equal(result.places.some((place) => place.name === 'Campanile Shanghai Bund Hotel'), true);
});

test('Chinese list items resolve without ordinal noise', () => {
  const result = extractTripPlaces({ text: '1. 武康路\n2. 豫园\n3. 南京路步行街' });
  assert.equal(result.places.some((place) => /^第|^[123]\./.test(place.name)), false);
  assert.equal(result.places.some((place) => place.localName === '豫园'), true);
});

test('guide handoffs keep one bilingual place per numbered line', () => {
  const result = extractTripPlaces({
    title: 'Street food places',
    text: "1. Xi'an Muslim Quarter / 回民街 — Xi'an — Compare the side streets\n2. Sajin Bridge / 洒金桥 — Xi'an\n3. Drum Tower Night Market / 鼓楼夜市 — Kaifeng\n4. Jianshe Road / 建设路 — Chengdu\n5. City God Temple / 城隍庙 — Shanghai",
  });
  assert.equal(result.places.length, 5);
  assert.deepEqual(result.places.map((place) => place.name), [
    "Xi'an Muslim Quarter",
    'Sajin Bridge',
    'Drum Tower Night Market',
    'Jianshe Road',
    'City God Temple',
  ]);
  assert.deepEqual(result.places.map((place) => place.localName), ['回民街', '洒金桥', '鼓楼夜市', '建设路', '城隍庙']);
  assert.deepEqual(result.places.map((place) => place.city), ["Xi'an", "Xi'an", 'Kaifeng', 'Chengdu', 'Shanghai']);
});

test('supporting prose inside a structured handoff cannot create extra known-place pins', () => {
  const result = extractTripPlaces({
    title: 'Shanghai field-guide places',
    text: '1. Wukang Building / 武康大楼 — Shanghai — Continue toward Xintiandi after the walk.\n2. Shanghai Museum East / 上海博物馆东馆 — Shanghai — Choose this over the older Shanghai Museum on a rain day.',
  });
  assert.deepEqual(result.places.map((place) => place.name), ['Wukang Building', 'Shanghai Museum East']);
});

test('Beijing destination handoff preserves six operational identities without collapsing entrances', () => {
  const result = extractTripPlaces({
    title: 'Beijing field-guide places',
    text: "1. Palace Museum via Meridian Gate / 故宫博物院（午门入口） — Beijing — Carry the booked passport.\n2. Tian'anmen Square / 天安门广场 — Beijing — Handle the separate reservation.\n3. Jingshan Park south gate / 景山公园南门 — Beijing — Continue north after the palace.\n4. Temple of Heaven east gate / 天坛公园东门 — Beijing — Use the metro-side entrance.\n5. Mutianyu Great Wall scenic-area entrance / 慕田峪长城景区 — Beijing — Do not substitute a tour pickup.\n6. Beijing Drum Tower / 北京鼓楼 — Beijing — Start a neighborhood walk here.",
  });
  assert.equal(result.places.length, 6);
  assert.deepEqual(result.places.map((place) => place.localName), [
    '故宫博物院（午门入口）',
    '天安门广场',
    '景山公园南门',
    '天坛公园东门',
    '慕田峪长城景区',
    '北京鼓楼',
  ]);
});

test('Hong Kong destination handoff keeps traditional Chinese identities and operational anchors', () => {
  const result = extractTripPlaces({
    title: 'Hong Kong field-guide places',
    text: "1. Heritage of Mei Ho House / 美荷樓生活館 — Hong Kong — Begin with the public-housing story.\n2. Tin Hau Temple, Yau Ma Tei / 油麻地天后廟 — Hong Kong — Keep the temple distinct from the market.\n3. Tsim Sha Tsui Promenade at the Clock Tower / 尖沙咀海濱花園（鐘樓起點） — Hong Kong — Use the west end as the promenade start.\n4. Man Mo Temple / 文武廟 — Hong Kong — Enter as a place of worship.\n5. Kowloon Walled City Park / 九龍寨城公園 — Hong Kong — The archival settlement no longer exists.\n6. Dragon's Back trailhead at To Tei Wan / 龍脊（土地灣起點） — Hong Kong — Save the bus-stop trailhead rather than the broad ridge.",
  });
  assert.equal(result.places.length, 6);
  assert.deepEqual(result.places.map((place) => place.localName), [
    '美荷樓生活館',
    '油麻地天后廟',
    '尖沙咀海濱花園（鐘樓起點）',
    '文武廟',
    '九龍寨城公園',
    '龍脊（土地灣起點）',
  ]);
  assert.deepEqual(result.places.map((place) => place.city), Array(6).fill('Hong Kong'));
});

test('Chongqing destination handoff keeps levels, entrances, and Wulong as six separate identities', () => {
  const result = extractTripPlaces({
    title: 'Chongqing field-guide places',
    text: '1. Liziba Station viewing platform / 李子坝轨道穿楼观景平台 — Chongqing — Save the viewing platform, not a broad district.\n2. Kuixinglou Square / 魁星楼广场 — Chongqing — Preserve the plaza level behind the ground-floor video.\n3. Huangguan Crown Escalator / 皇冠大扶梯 — Chongqing — Keep the Lianglukou transport connection separate.\n4. Hongya Cave Folklore Scenic Area / 洪崖洞民俗风貌区 — Chongqing — Choose the complex, façade view, or route deliberately.\n5. Shibati Traditional Scenic Area / 十八梯传统风貌区 — Chongqing — Resolve any shop inside it as another branch-level pin.\n6. Three Natural Bridges visitor center / 天生三桥游客中心 — Chongqing — Keep the Wulong transfer and scenic-shuttle chain attached.',
  });
  assert.equal(result.places.length, 6);
  assert.deepEqual(result.places.map((place) => place.localName), [
    '李子坝轨道穿楼观景平台',
    '魁星楼广场',
    '皇冠大扶梯',
    '洪崖洞民俗风貌区',
    '十八梯传统风貌区',
    '天生三桥游客中心',
  ]);
  assert.deepEqual(result.places.map((place) => place.city), Array(6).fill('Chongqing'));
});

test('Chengdu city handoff keeps nested venues, a chosen panda gate, and the neighborhood start separate', () => {
  const result = extractTripPlaces({
    title: 'Chengdu field-guide places',
    text: "1. Heming Tea House in People's Park / 鹤鸣茶社（成都市人民公园内） — Chengdu — Preserve the venue inside the public park.\n2. Chengdu Museum / 成都博物馆 — Chengdu — Use the Tianfu Square west-side museum identity.\n3. Wenshu Monastery / 文殊院 — Chengdu — Keep the temple distinct from surrounding snack streets.\n4. Chengdu Panda Base South Gate / 成都大熊猫繁育研究基地南大门 — Chengdu — Save the chosen entrance, not a campus center.\n5. Yulin West Road at Fangcao Street / 玉林西路（芳草街起点） — Chengdu — Treat Yulin as a bounded neighborhood walk.\n6. Chengdu Wuhou Shrine Museum / 成都武侯祠博物馆 — Chengdu — Keep the museum distinct from adjacent Jinli.",
  });
  assert.equal(result.places.length, 6);
  assert.deepEqual(result.places.map((place) => place.localName), [
    '鹤鸣茶社（成都市人民公园内）',
    '成都博物馆',
    '文殊院',
    '成都大熊猫繁育研究基地南大门',
    '玉林西路（芳草街起点）',
    '成都武侯祠博物馆',
  ]);
  assert.deepEqual(result.places.map((place) => place.city), Array(6).fill('Chengdu'));
});

test('attraction guide handoff preserves ticket products, entrances, and cities as six exact places', () => {
  const result = extractTripPlaces({
    title: 'China Attraction Tickets: Passport Booking, Release Windows & Sold-Out Recovery places',
    text: "1. Palace Museum via Meridian Gate / 故宫博物院（午门入口） — Beijing — Advance passport booking; south entrance; paid galleries are separate products\n2. Tian'anmen Square / 天安门广场 — Beijing — Separate free real-name reservation\n3. Temple of Heaven east gate / 天坛公园东门 — Beijing — Confirm park admission versus the interior-sights combo ticket\n4. Shanghai Museum East B1 east gate / 上海博物馆东馆B1东门 — Shanghai — Individual visitors currently enter without advance reservation\n5. Emperor Qinshihuang's Mausoleum Site Museum / 秦始皇帝陵博物院 — Xi'an — Use the official real-name passport reservation\n6. Mutianyu Great Wall scenic-area entrance / 慕田峪长城景区 — Beijing — Separate admission from shuttle, cable car, toboggan, and city transport",
  });
  assert.equal(result.places.length, 6);
  assert.equal(result.places.some((place) => place.name === 'Tickets'), false);
  assert.deepEqual(result.places.map((place) => place.localName), [
    '故宫博物院（午门入口）',
    '天安门广场',
    '天坛公园东门',
    '上海博物馆东馆B1东门',
    '秦始皇帝陵博物院',
    '慕田峪长城景区',
  ]);
  assert.deepEqual(result.places.map((place) => place.city), ['Beijing', 'Beijing', 'Beijing', 'Shanghai', "Xi'an", 'Beijing']);
});
