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

test('Xi’an city handoff keeps entrances, nested sites, museum branches, and Lintong separate', () => {
  const result = extractTripPlaces({
    title: 'Xi’an field-guide places',
    text: "1. Xi’an City Wall at Yongning Gate / 西安城墙（永宁门） — Xi'an — Save the chosen south entrance, not the wall center.\n2. Great Mosque of Xi’an / 西安化觉巷清真大寺 — Xi'an — Keep the place of worship distinct from the food district.\n3. Shaanxi History Museum — main museum / 陕西历史博物馆（本馆） — Xi'an — Do not substitute the Qin–Han branch.\n4. Da Ci’en Temple and Big Wild Goose Pagoda / 大慈恩寺（大雁塔） — Xi'an — Preserve the temple and nested pagoda identity.\n5. Xi’an Museum and Small Wild Goose Pagoda / 西安博物院（小雁塔） — Xi'an — Keep the shared campus together.\n6. Emperor Qinshihuang’s Mausoleum Site Museum / 秦始皇帝陵博物院 — Xi'an — Keep the Lintong transfer and two-site visit attached.",
  });
  assert.equal(result.places.length, 6);
  assert.deepEqual(result.places.map((place) => place.localName), [
    '西安城墙（永宁门）',
    '西安化觉巷清真大寺',
    '陕西历史博物馆（本馆）',
    '大慈恩寺（大雁塔）',
    '西安博物院（小雁塔）',
    '秦始皇帝陵博物院',
  ]);
  assert.deepEqual(result.places.map((place) => place.city), Array(6).fill("Xi'an"));
  assert.deepEqual(result.places.map((place) => place.category), Array(6).fill('See'));
});

test('Guangzhou city handoff keeps route entrances and museum campuses as six separate identities', () => {
  const result = extractTripPlaces({
    title: 'Guangzhou field-guide places',
    text: "1. Guangdong Folk Arts Museum at Chen Clan Academy / 广东民间工艺博物馆（陈家祠） — Guangzhou — Preserve the museum and historic building identity.\n2. Cantonese Opera Art Museum / 粤剧艺术博物馆 — Guangzhou — Use the venue as the fixed Enning Road anchor.\n3. Shamian Island at the East Bridge / 沙面岛（东桥入口） — Guangzhou — Start at the east bridge instead of an arbitrary island center.\n4. Nanyue King Museum — King’s Tomb Exhibition Area / 南越王博物院（王墓展区） — Guangzhou — Keep the paid tomb branch and current closure notice attached.\n5. Nanyue King Museum — Palace Exhibition Area / 南越王博物院（王宫展区） — Guangzhou — Keep the free palace branch and east entrance separate.\n6. Guangdong Museum / 广东省博物馆 — Guangzhou — Preserve the timed provincial-museum identity.",
  });
  assert.equal(result.places.length, 6);
  assert.deepEqual(result.places.map((place) => place.localName), [
    '广东民间工艺博物馆（陈家祠）',
    '粤剧艺术博物馆',
    '沙面岛（东桥入口）',
    '南越王博物院（王墓展区）',
    '南越王博物院（王宫展区）',
    '广东省博物馆',
  ]);
  assert.deepEqual(result.places.map((place) => place.city), Array(6).fill('Guangzhou'));
  assert.deepEqual(result.places.map((place) => place.category), Array(6).fill('See'));
});

test('Shenzhen city handoff keeps nested venues, route entrances, and the border checkpoint separate', () => {
  const result = extractTripPlaces({
    title: 'Shenzhen field-guide places',
    text: '1. Shenzhen Reform and Opening-Up Exhibition Hall / 深圳改革开放展览馆（深圳市当代艺术与城市规划馆内） — Shenzhen — Keep the hall nested inside the correct museum building.\n2. Lianhua Hill Park south gate / 莲花山公园南门 — Shenzhen — Continue from the Civic Center through the chosen entrance.\n3. Nantou Ancient Town Museum at the south gate / 南头古城博物馆（南门外） — Shenzhen — Begin with the museum outside the surviving gate.\n4. Sea World Culture and Arts Center / 海上世界文化艺术中心 — Shenzhen — Do not substitute the commercial district or cruise terminal.\n5. Dafen Art Museum / 大芬美术馆 — Shenzhen — Use the museum as the working painting district anchor.\n6. Futian Checkpoint / 福田口岸 — Shenzhen — Preserve the mainland side of the Lok Ma Chau Spur Line crossing.',
  });
  assert.equal(result.places.length, 6);
  assert.deepEqual(result.places.map((place) => place.localName), [
    '深圳改革开放展览馆（深圳市当代艺术与城市规划馆内）',
    '莲花山公园南门',
    '南头古城博物馆（南门外）',
    '海上世界文化艺术中心',
    '大芬美术馆',
    '福田口岸',
  ]);
  assert.deepEqual(result.places.map((place) => place.city), Array(6).fill('Shenzhen'));
  assert.deepEqual(result.places.map((place) => place.category), ['See', 'See', 'See', 'See', 'See', 'Move']);
});

test('Hangzhou city handoff keeps route starts, reservation complexes, museum branches, and heritage systems separate', () => {
  const result = extractTripPlaces({
    title: 'Hangzhou field-guide places',
    text: '1. Broken Bridge and Bai Causeway start / 断桥残雪（白堤东端） — Hangzhou — Use a fixed start instead of a generic West Lake pin.\n2. Lingyin–Feilai Peak Scenic Area main entrance / 灵隐飞来峰景区入口 — Hangzhou — Keep the timed scenic-area reservation attached to the entrance.\n3. China National Tea Museum — Shuangfeng Branch / 中国茶叶博物馆（双峰馆区） — Hangzhou — Preserve the chosen campus rather than the whole tea region.\n4. Southern Song Deshou Palace Site Museum / 南宋德寿宫遗址博物馆 — Hangzhou — Separate archaeological fabric from reconstructed interpretation.\n5. China Beijing–Hangzhou Grand Canal Museum / 中国京杭大运河博物馆 — Hangzhou — Do not substitute the similarly named Yangzhou museum.\n6. Liangzhu Museum / 良渚博物院 — Hangzhou — Keep the museum separate from the archaeological park five kilometers away.',
  });
  assert.equal(result.places.length, 6);
  assert.deepEqual(result.places.map((place) => place.localName), [
    '断桥残雪（白堤东端）',
    '灵隐飞来峰景区入口',
    '中国茶叶博物馆（双峰馆区）',
    '南宋德寿宫遗址博物馆',
    '中国京杭大运河博物馆',
    '良渚博物院',
  ]);
  assert.deepEqual(result.places.map((place) => place.city), Array(6).fill('Hangzhou'));
  assert.deepEqual(result.places.map((place) => place.category), ['See', 'See', 'Tea', 'See', 'See', 'See']);
});

test('Kunming city handoff keeps history branches, flower trade, seasonal ecology, and the Stone Forest transfer separate', () => {
  const result = extractTripPlaces({
    title: 'Kunming field-guide places',
    text: '1. Green Lake Park south gate / 翠湖公园南门 — Kunming — Begin the old-center morning at a fixed entrance.\n2. Kunming City Museum / 昆明市博物馆 — Kunming — Keep the city museum distinct from the provincial institution.\n3. Yunnan Provincial Museum / 云南省博物馆 — Kunming — Use the current Guangfu Road building.\n4. Kunming Dounan Flower Market main hall / 昆明斗南花卉市场（主场馆） — Kunming — Ground the working flower district at the main building.\n5. Haigeng Dam viewing section / 海埂大坝（观景路观鸥段） — Kunming — Preserve the seasonal bird-viewing section rather than generic Dianchi.\n6. Stone Forest Scenic Area visitor center / 石林风景区游客中心 — Kunming — Resolve the arrival beyond Shilin West station.',
  });
  assert.equal(result.places.length, 6);
  assert.deepEqual(result.places.map((place) => place.localName), [
    '翠湖公园南门',
    '昆明市博物馆',
    '云南省博物馆',
    '昆明斗南花卉市场（主场馆）',
    '海埂大坝（观景路观鸥段）',
    '石林风景区游客中心',
  ]);
  assert.deepEqual(result.places.map((place) => place.city), Array(6).fill('Kunming'));
  assert.deepEqual(result.places.map((place) => place.category), Array(6).fill('See'));
});

test('Dali city handoff keeps arrival, heritage, corridor, and cableway identities separate', () => {
  const result = extractTripPlaces({
    title: 'Dali field-guide places',
    text: '1. Dali Ancient City South Gate Visitor Center / 大理古城南门游客中心 — Dali — Preserve the Xiaguan-to-old-city arrival handoff.\n2. Dali City Museum / 大理市博物馆 — Dali — Keep the municipal museum distinct from the prefecture museum.\n3. Chongsheng Temple Three Pagodas Cultural Tourism Area entrance / 崇圣寺三塔文化旅游区入口 — Dali — Attach the ticket and original-versus-reconstructed context to the entrance.\n4. Yan Family Courtyard Museum / 喜洲严家大院博物馆 — Dali — Ground Xizhou merchant architecture at the exact courtyard.\n5. Longkan entrance to the Erhai Ecological Corridor / 洱海生态廊道龙龛入口 — Dali — Use a named slow-mobility route start rather than generic Erhai.\n6. Cangshan Grand Cableway lower station / 苍山大索道下站（天龙八部影视城） — Dali — Do not substitute Gantong or Zhonghe cableways.',
  });
  assert.equal(result.places.length, 6);
  assert.deepEqual(result.places.map((place) => place.localName), [
    '大理古城南门游客中心',
    '大理市博物馆',
    '崇圣寺三塔文化旅游区入口',
    '喜洲严家大院博物馆',
    '洱海生态廊道龙龛入口',
    '苍山大索道下站（天龙八部影视城）',
  ]);
  assert.deepEqual(result.places.map((place) => place.city), Array(6).fill('Dali'));
  assert.deepEqual(result.places.map((place) => place.category), ['See', 'See', 'See', 'See', 'See', 'Move']);
});

test('Lijiang handoff keeps three heritage components and exact mountain products separate', () => {
  const result = extractTripPlaces({
    title: 'Lijiang field-guide places',
    text: '1. Lijiang Ancient City Museum at Mufu / 丽江古城博物院（木府） — Lijiang — Ground Dayan in the Mu ruling-house story.\n2. Black Dragon Pool Park south gate / 黑龙潭公园南门 — Lijiang — Preserve the water-system walk and exact pickup gate.\n3. Shuhe Ancient Town north gate / 束河古镇北门 — Lijiang — Keep Shuhe distinct from Dayan and Baisha.\n4. Baisha Murals Scenic Area ticket office / 白沙壁画景区售票处 — Lijiang — Resolve the protected mural complex, not a generic cafe pin.\n5. Jade Dragon Snow Mountain new visitor service center / 玉龙雪山新游客服务中心 — Lijiang — Separate scenic admission from optional products.\n6. Glacier Park Cableway lower station / 冰川公园索道下站 — Lijiang — Do not substitute Spruce Meadow or Yak Meadow ropeways.',
  });
  assert.equal(result.places.length, 6);
  assert.deepEqual(result.places.map((place) => place.localName), [
    '丽江古城博物院（木府）',
    '黑龙潭公园南门',
    '束河古镇北门',
    '白沙壁画景区售票处',
    '玉龙雪山新游客服务中心',
    '冰川公园索道下站',
  ]);
  assert.deepEqual(result.places.map((place) => place.city), Array(6).fill('Lijiang'));
  assert.deepEqual(result.places.map((place) => place.category), ['See', 'See', 'See', 'See', 'See', 'Move']);
});

test('Fuzhou handoff keeps the old city, mountain gateway, and Mawei museum separate', () => {
  const result = extractTripPlaces({
    title: 'Fuzhou field-guide places',
    text: '1. Fuzhou Railway Station / 福州站 — Fuzhou — Keep the central station separate from Fuzhou South.\n2. Sanfang Qixiang Visitor Center / 三坊七巷游客中心 — Fuzhou — Use one fixed planning anchor for the lane network.\n3. Lin Zexu Memorial Hall / 福州市林则徐纪念馆 — Fuzhou — Do not substitute the separately reopened former residence.\n4. Fujian Museum / 福建博物院 — Fuzhou — Keep the provincial museum distinct from the municipal museum.\n5. Drum Mountain Visitor Center at Lower Courtyard / 鼓山旅游景区游客中心（下院） — Fuzhou — Ground the mountain route at the city-side gateway.\n6. China Shipbuilding Culture Museum / 中国船政文化博物馆 — Fuzhou — Preserve the museum inside the wider Mawei heritage complex.',
  });
  assert.equal(result.places.length, 6);
  assert.deepEqual(result.places.map((place) => place.localName), [
    '福州站',
    '三坊七巷游客中心',
    '福州市林则徐纪念馆',
    '福建博物院',
    '鼓山旅游景区游客中心（下院）',
    '中国船政文化博物馆',
  ]);
  assert.deepEqual(result.places.map((place) => place.city), Array(6).fill('Fuzhou'));
  assert.deepEqual(result.places.map((place) => place.category), ['Move', 'See', 'See', 'See', 'See', 'See']);
});

test('Quanzhou handoff keeps the rail arrival, old-city anchors, museum campus, and bridge entrance separate', () => {
  const result = extractTripPlaces({
    title: 'Quanzhou field-guide places',
    text: '1. Quanzhou Railway Station / 泉州站 — Quanzhou — Do not substitute Quanzhou South or East.\n2. Quanzhou West Street Visitor Service Center / 泉州西街游客服务中心 — Quanzhou — It is more executable than saving the middle of a crowded food street.\n3. Quanzhou Kaiyuan Temple / 泉州开元寺 — Quanzhou — Keep the living monastery separate from West Street.\n4. Qingjing Mosque / 清净寺 — Quanzhou — Preserve current worship and visitor rules.\n5. Quanzhou Maritime Museum / 泉州海外交通史博物馆 — Quanzhou — Use the East Lake main campus, not the ancient-ship gallery.\n6. Luoyang Bridge Visitor Center — south end / 洛阳桥游客中心（桥南） — Quanzhou — Start on the Quanzhou side instead of dropping a pin into the river.',
  });
  assert.equal(result.places.length, 6);
  assert.deepEqual(result.places.map((place) => place.localName), [
    '泉州站',
    '泉州西街游客服务中心',
    '泉州开元寺',
    '清净寺',
    '泉州海外交通史博物馆',
    '洛阳桥游客中心（桥南）',
  ]);
  assert.deepEqual(result.places.map((place) => place.city), Array(6).fill('Quanzhou'));
  assert.deepEqual(result.places.map((place) => place.category), ['Move', 'See', 'See', 'See', 'See', 'See']);
});

test('Tianjin handoff keeps the central arrival, city districts, local museum, and Binhai day separate', () => {
  const result = extractTripPlaces({
    title: 'Tianjin field-guide places',
    text: '1. Tianjin Railway Station / 天津站 — Tianjin — Do not substitute Tianjin West, South, Binhai, or Binhai West.\n2. Wudadao Cultural Tourism Area Visitor Service Center / 天津五大道文化旅游区游客服务中心 — Tianjin — Use the Minyuan Square model before the architecture walk.\n3. Tianjin Museum / 天津博物馆 — Tianjin — Start with the permanent city-history displays, not an adjacent museum.\n4. Tianjin Tianhou Palace / 天津天后宫 — Tianjin — Keep the living Mazu institution separate from the commercial food street around it.\n5. Liang Qichao Memorial Hall / 天津梁启超纪念馆 — Tianjin — Ground the former Italian concession in a specific life and institution.\n6. National Maritime Museum of China / 国家海洋博物馆 — Tianjin — Treat Binhai as a reserved day with a protected return.',
  });
  assert.equal(result.places.length, 6);
  assert.deepEqual(result.places.map((place) => place.localName), [
    '天津站',
    '天津五大道文化旅游区游客服务中心',
    '天津博物馆',
    '天津天后宫',
    '天津梁启超纪念馆',
    '国家海洋博物馆',
  ]);
  assert.deepEqual(result.places.map((place) => place.city), Array(6).fill('Tianjin'));
  assert.deepEqual(result.places.map((place) => place.category), ['Move', 'See', 'See', 'See', 'See', 'See']);
});

test('Macau handoff keeps four non-interchangeable arrivals and two scheduled cultural anchors separate', () => {
  const result = extractTripPlaces({
    title: 'Macau field-guide places',
    text: '1. Border Gate Checkpoint / 關閘邊檢大樓 — Macau — Preserve the Gongbei crossing and its 06:00–01:00 clock.\n2. Hong Kong–Zhuhai–Macao Bridge Macao Port / 港珠澳大橋澳門口岸 — Macau — Keep the Hong Kong and Zhuhai passenger halls distinct.\n3. Outer Harbour Ferry Terminal / 外港客運碼頭 — Macau — Use the peninsula terminal printed on the sailing.\n4. Taipa Ferry Terminal / 氹仔客運碼頭 — Macau — Do not substitute Outer Harbour when the ticket lands at Pac On.\n5. Macao Museum at Mount Fortress / 澳門博物館（大炮台） — Macau — Keep the museum distinct from the fortress, Ruins, and public heritage streets.\n6. Taipa Houses / 龍環葡韻 — Macau — Resolve the five-house complex and each separately scheduled use.',
  });
  assert.equal(result.places.length, 6);
  assert.deepEqual(result.places.map((place) => place.localName), [
    '關閘邊檢大樓',
    '港珠澳大橋澳門口岸',
    '外港客運碼頭',
    '氹仔客運碼頭',
    '澳門博物館（大炮台）',
    '龍環葡韻',
  ]);
  assert.deepEqual(result.places.map((place) => place.city), Array(6).fill('Macau'));
  assert.deepEqual(result.places.map((place) => place.category), ['Move', 'Move', 'Move', 'Move', 'See', 'See']);

  const freeText = extractTripPlaces({ text: 'We arrive at Taipa Ferry Terminal, then visit Taipa Houses and Macao Museum.' });
  assert.deepEqual(freeText.places.map((place) => place.name), ['Taipa Ferry Terminal', 'Taipa Houses', 'Macao Museum at Mount Fortress']);
});

test('Guilin handoff keeps the city context and two classic-cruise ports separate', () => {
  const result = extractTripPlaces({
    title: 'Guilin field-guide places',
    text: '1. Guilin Museum — Lingui building / 桂林博物馆（临桂馆） — Guilin — Keep the current museum separate from its former address.\n2. Duxiu Peak–Jingjiang Princes’ City at Zhengyang Gate / 独秀峰王城景区（正阳门） — Guilin — Enter the royal city at its operational gate.\n3. Elephant Trunk Hill Scenic Area Gate 1 / 象鼻山景区1号门 — Guilin — Use one exact city-river entrance.\n4. Reed Flute Cave visitor center / 芦笛岩景区游客中心 — Guilin — Ground the cave ticket and return transport.\n5. Mopan Mountain Passenger Port / 磨盘山客运港码头 — Guilin — Preserve the three-star cruise departure.\n6. Zhujiang Passenger Port / 竹江客运港码头 — Guilin — Preserve the separate four-star cruise departure.',
  });
  assert.equal(result.places.length, 6);
  assert.deepEqual(result.places.map((place) => place.localName), [
    '桂林博物馆（临桂馆）',
    '独秀峰王城景区（正阳门）',
    '象鼻山景区1号门',
    '芦笛岩景区游客中心',
    '磨盘山客运港码头',
    '竹江客运港码头',
  ]);
  assert.deepEqual(result.places.map((place) => place.city), Array(6).fill('Guilin'));
  assert.deepEqual(result.places.map((place) => place.category), ['See', 'See', 'See', 'See', 'Move', 'Move']);
});

test('Yangshuo handoff separates Xingping rail and Li River products from the Yulong route', () => {
  const result = extractTripPlaces({
    title: 'Yangshuo field-guide places',
    text: '1. Yangshuo Railway Station / 阳朔站 — Yangshuo — Keep the Xingping rail arrival separate from the county town.\n2. Xingping Chaobanshan Wharf / 兴坪朝板山码头 — Yangshuo — Preserve the local Li River product.\n3. Yangshuo Longtoushan Wharf / 阳朔龙头山码头 — Yangshuo — Ground the one-way Guilin cruise arrival.\n4. Jima Wharf on the Yulong River / 遇龙河景区骥马码头 — Yangshuo — Start one named bamboo-raft route.\n5. Gongnong Bridge comprehensive wharf / 工农桥综合码头 — Yangshuo — Preserve the route endpoint and pickup.\n6. Shuangliu Ferry Pavilion in Jiuxian / 旧县村双流义渡亭 — Yangshuo — Anchor a bounded public cycling route.',
  });
  assert.equal(result.places.length, 6);
  assert.deepEqual(result.places.map((place) => place.localName), [
    '阳朔站',
    '兴坪朝板山码头',
    '阳朔龙头山码头',
    '遇龙河景区骥马码头',
    '工农桥综合码头',
    '旧县村双流义渡亭',
  ]);
  assert.deepEqual(result.places.map((place) => place.city), Array(6).fill('Yangshuo'));
  assert.deepEqual(result.places.map((place) => place.category), ['Move', 'Move', 'Move', 'Move', 'Move', 'See']);
});

test('Zhangjiajie handoff preserves the rail arrival, two park gates, vertical transport, and separate Tianmen product', () => {
  const result = extractTripPlaces({
    title: 'Zhangjiajie field-guide places',
    text: '1. Zhangjiajie West Railway Station / 张家界西站 — Zhangjiajie — Keep the rail arrival separate from the Wulingyuan base.\n2. Wulingyuan East Gate at the landmark gate / 武陵源标志门（东门） — Zhangjiajie — Start the Tianzi and Yuanjiajie circuit at its booked gate.\n3. Zhangjiajie National Forest Park South Gate / 张家界国家森林公园南门（森林公园门票站） — Zhangjiajie — Ground the Huangshizhai and Golden Whip Stream day.\n4. Tianzi Mountain Cableway lower station / 天子山索道下站 — Zhangjiajie — Preserve the East Gate ascent product.\n5. Bailong Elevator lower station / 百龙天梯下站 — Zhangjiajie — Keep the Yuanjiajie vertical handoff and its queue.\n6. Tianmen Mountain Cableway lower station / 天门山索道下站 — Zhangjiajie — Keep the separate Yongding mountain ticket out of Wulingyuan.',
  });
  assert.equal(result.places.length, 6);
  assert.deepEqual(result.places.map((place) => place.localName), [
    '张家界西站',
    '武陵源标志门（东门）',
    '张家界国家森林公园南门（森林公园门票站）',
    '天子山索道下站',
    '百龙天梯下站',
    '天门山索道下站',
  ]);
  assert.deepEqual(result.places.map((place) => place.city), Array(6).fill('Zhangjiajie'));
  assert.deepEqual(result.places.map((place) => place.category), ['Move', 'See', 'See', 'Move', 'Move', 'Move']);
});

test('Suzhou handoff preserves the central rail arrival, separate reservations, garden identities, and Tiger Hill gate', () => {
  const result = extractTripPlaces({
    title: 'Suzhou field-guide places',
    text: '1. Suzhou Railway Station / 苏州站 — Suzhou — Keep the central arrival separate from Suzhou North.\n2. Humble Administrator’s Garden entrance / 拙政园入口（东北街178号） — Suzhou — Preserve the timed garden ticket and exact entrance.\n3. Suzhou Museum main building / 苏州博物馆本馆 — Suzhou — Keep the free museum reservation separate from the garden next door.\n4. Master-of-the-Nets Garden / 网师园 — Suzhou — Compare a compact residential garden with the larger first-day garden.\n5. Lingering Garden entrance / 留园入口（留园路338号） — Suzhou — Preserve the western garden identity and reservation.\n6. Tiger Hill Scenic Area South Gate / 虎丘山风景名胜区南门 — Suzhou — Navigate to the paid hill entrance rather than the district or metro station.',
  });
  assert.equal(result.places.length, 6);
  assert.deepEqual(result.places.map((place) => place.localName), [
    '苏州站',
    '拙政园入口（东北街178号）',
    '苏州博物馆本馆',
    '网师园',
    '留园入口（留园路338号）',
    '虎丘山风景名胜区南门',
  ]);
  assert.deepEqual(result.places.map((place) => place.city), Array(6).fill('Suzhou'));
  assert.deepEqual(result.places.map((place) => place.category), ['Move', 'See', 'See', 'See', 'See', 'See']);
});

test('Nanjing handoff keeps the rail hub, museum, memorial entrance, mountain products, and city-wall section separate', () => {
  const result = extractTripPlaces({
    title: 'Nanjing field-guide places',
    text: '1. Nanjing South Railway Station / 南京南站 — Nanjing — Keep the main high-speed arrival separate from Nanjing Station.\n2. Nanjing Museum / 南京博物院 — Nanjing — Preserve the provincial museum rather than the municipal institution.\n3. Nanjing Massacre history exhibition at Gate 1 / 侵华日军南京大屠杀遇难同胞纪念馆（南京大屠杀史实展1号门） — Nanjing — Keep the separately reserved history exhibition and exact entrance.\n4. Sun Yat-sen Mausoleum at Bo’ai Square / 中山陵（博爱广场入口） — Nanjing — Attach the free reservation to the mausoleum approach.\n5. Ming Xiaoling Scenic Area Gate 3 / 明孝陵景区3号门 — Nanjing — Preserve the separate paid World Heritage product and metro-side gate.\n6. Nanjing City Wall at Zhonghua Gate Barbican / 南京城墙中华门瓮城景区 — Nanjing — Use the paid southern wall section rather than a generic old-city pin.',
  });
  assert.equal(result.places.length, 6);
  assert.deepEqual(result.places.map((place) => place.localName), [
    '南京南站',
    '南京博物院',
    '侵华日军南京大屠杀遇难同胞纪念馆（南京大屠杀史实展1号门）',
    '中山陵（博爱广场入口）',
    '明孝陵景区3号门',
    '南京城墙中华门瓮城景区',
  ]);
  assert.deepEqual(result.places.map((place) => place.city), Array(6).fill('Nanjing'));
  assert.deepEqual(result.places.map((place) => place.category), ['Move', 'See', 'See', 'See', 'See', 'See']);
});

test('Wuhan handoff keeps the rail hub, museum gate, greenway portal, tower gate, ferry terminal, and customs museum separate', () => {
  const result = extractTripPlaces({
    title: 'Wuhan field-guide places',
    text: '1. Wuhan Railway Station / 武汉站 — Wuhan — Keep the high-speed arrival separate from Hankou and Wuchang stations.\n2. Hubei Provincial Museum South Gate / 湖北省博物馆南门 — Wuhan — Preserve the individual-visitor entrance and the provincial institution.\n3. East Lake Greenway at Lake Light Prelude / 东湖绿道湖光序曲驿站 — Wuhan — Save one named portal rather than the whole lake.\n4. Yellow Crane Tower Park South Gate / 黄鹤楼公园南门 — Wuhan — Keep paid park admission separate from the metro photo wall.\n5. Zhonghua Road No. 1 Ferry Terminal / 中华路1号码头 — Wuhan — Preserve the numbered Wuchang endpoint of the ordinary ferry.\n6. Wuhan Customs House Museum / 江汉关博物馆 — Wuhan — Keep the museum separate from the adjacent ferry terminal and Wuhan Museum.',
  });
  assert.equal(result.places.length, 6);
  assert.deepEqual(result.places.map((place) => place.localName), [
    '武汉站',
    '湖北省博物馆南门',
    '东湖绿道湖光序曲驿站',
    '黄鹤楼公园南门',
    '中华路1号码头',
    '江汉关博物馆',
  ]);
  assert.deepEqual(result.places.map((place) => place.city), Array(6).fill('Wuhan'));
  assert.deepEqual(result.places.map((place) => place.category), ['Move', 'See', 'See', 'See', 'Move', 'See']);
});

test('Qingdao handoff keeps the rail arrival, maritime temple, residence museum, brewery, supervised beach, and Laoshan gateway separate', () => {
  const result = extractTripPlaces({
    title: 'Qingdao field-guide places',
    text: "1. Qingdao Railway Station / 青岛站 — Qingdao — Keep the old-city arrival separate from Qingdao North and West.\n2. Qingdao Tianhou Temple / 青岛天后宫 — Qingdao — Preserve the pre-colonial maritime-history anchor.\n3. Qingdao German Governor's Residence Museum / 青岛德国总督楼旧址博物馆 — Qingdao — Keep the residence separate from the Governor's Office and Signal Hill.\n4. Tsingtao Brewery Museum / 青岛啤酒博物馆 — Qingdao — Preserve the historic industrial museum rather than a bar or festival.\n5. Qingdao First Bathing Beach / 青岛第一海水浴场 — Qingdao — Keep supervised seasonal swimming separate from a generic coast pin.\n6. Laoshan Scenic Area Visitor Service Center at Dahedong / 崂山游客服务中心（大河东） — Qingdao — Preserve the Taiqing ticket and sightseeing-bus handoff.",
  });
  assert.equal(result.places.length, 6);
  assert.deepEqual(result.places.map((place) => place.localName), [
    '青岛站',
    '青岛天后宫',
    '青岛德国总督楼旧址博物馆',
    '青岛啤酒博物馆',
    '青岛第一海水浴场',
    '崂山游客服务中心（大河东）',
  ]);
  assert.deepEqual(result.places.map((place) => place.city), Array(6).fill('Qingdao'));
  assert.deepEqual(result.places.map((place) => place.category), ['Move', 'See', 'See', 'See', 'See', 'See']);
});

test('Changsha handoff keeps the high-speed arrival, provincial museum, academy ticket, island route, slips museum, and river pavilion separate', () => {
  const result = extractTripPlaces({
    title: 'Changsha field-guide places',
    text: '1. Changsha South Railway Station / 长沙南站 — Changsha — Keep the high-speed arrival separate from Changsha Station and the maglev platform.\n2. Hunan Museum / 湖南博物院 — Changsha — Preserve the Mawangdui collection venue rather than the tomb site or city museum.\n3. Yuelu Academy / 岳麓书院 — Changsha — Keep the paid academy reservation separate from the free mountain and university campus.\n4. Orange Isle Scenic Area / 橘子洲景区 — Changsha — Preserve the long island route rather than one monument or metro pin.\n5. Changsha Bamboo Slips Museum / 长沙简牍博物馆 — Changsha — Keep the Tuesday-closed old-city museum separate from Hunan Museum.\n6. Du Fu Pavilion / 杜甫江阁 — Changsha — Preserve the ticketed riverfront interior rather than the whole promenade or an assumed fireworks schedule.',
  });
  assert.equal(result.places.length, 6);
  assert.deepEqual(result.places.map((place) => place.localName), [
    '长沙南站',
    '湖南博物院',
    '岳麓书院',
    '橘子洲景区',
    '长沙简牍博物馆',
    '杜甫江阁',
  ]);
  assert.deepEqual(result.places.map((place) => place.city), Array(6).fill('Changsha'));
  assert.deepEqual(result.places.map((place) => place.category), ['Move', 'See', 'See', 'See', 'See', 'See']);
});

test('Xiamen handoff keeps the rail arrival, ferry wharves, museum, temple, and garden gate separate', () => {
  const result = extractTripPlaces({
    title: 'Xiamen field-guide places',
    text: '1. Xiamen North Railway Station / 厦门北站 — Xiamen — Keep the mainland high-speed arrival separate from Xiamen Station.\n2. Xiamen International Cruise Center Gulangyu Wharf / 邮轮中心厦鼓码头（东渡客运码头） — Xiamen — Preserve the booked daytime visitor departure wharf.\n3. Sanqiutian Wharf / 鼓浪屿三丘田码头 — Xiamen — Keep the visitor arrival and return pier distinct from Neicuo’ao and Piano wharves.\n4. Overseas Chinese Museum / 华侨博物院 — Xiamen — Preserve the migration-history institution rather than the municipal museum.\n5. Nanputuo Temple / 南普陀寺 — Xiamen — Keep the living monastery separate from the university campus and rear hill.\n6. Xiamen Botanical Garden West Gate / 厦门园林植物园西大门 — Xiamen — Use the official main entrance rather than a mountain center pin.',
  });
  assert.equal(result.places.length, 6);
  assert.deepEqual(result.places.map((place) => place.localName), [
    '厦门北站',
    '邮轮中心厦鼓码头（东渡客运码头）',
    '鼓浪屿三丘田码头',
    '华侨博物院',
    '南普陀寺',
    '厦门园林植物园西大门',
  ]);
  assert.deepEqual(result.places.map((place) => place.city), Array(6).fill('Xiamen'));
  assert.deepEqual(result.places.map((place) => place.category), ['Move', 'Move', 'Move', 'See', 'See', 'See']);
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
