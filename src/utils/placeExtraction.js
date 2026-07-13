const knownPlaces = [
  { name: 'Wukang Road', localName: '武康路', city: 'Shanghai', category: 'See', aliases: ['wukang road', 'wukang lu', '武康路'] },
  { name: 'Anfu Road', localName: '安福路', city: 'Shanghai', category: 'See', aliases: ['anfu road', '安福路'] },
  { name: 'Jia Jia Tang Bao', localName: '佳家汤包', city: 'Shanghai', category: 'Eat', aliases: ['jia jia tang bao', '佳家汤包'] },
  { name: "People's Square", localName: '人民广场', city: 'Shanghai', category: 'See', aliases: ["people's square", '人民广场'] },
  { name: 'The Bund', localName: '外滩', city: 'Shanghai', category: 'See', aliases: ['the bund', 'bund', '外滩'] },
  { name: 'Huanghe Road', localName: '黄河路', city: 'Shanghai', category: 'Eat', aliases: ['huanghe road', '黄河路'] },
  { name: "Jing'an Temple", localName: '静安寺', city: 'Shanghai', category: 'Stay', aliases: ["jing'an temple", 'jing an temple', '静安寺'] },
  { name: "People's Park", localName: '人民公园', city: 'Chengdu', category: 'Tea', aliases: ["people's park", '人民公园'] },
  { name: 'Heming Tea House', localName: '鹤鸣茶社', city: 'Chengdu', category: 'Tea', aliases: ['heming tea house', '鹤鸣茶社'] },
  { name: 'Chengdu Museum', localName: '成都博物馆', city: 'Chengdu', category: 'See', aliases: ['chengdu museum', '成都博物馆'] },
  { name: 'Wenshu Monastery', localName: '文殊院', city: 'Chengdu', category: 'See', aliases: ['wenshu monastery', 'wenshu temple', '文殊院'] },
  { name: 'Chengdu Panda Base', localName: '成都大熊猫繁育研究基地', city: 'Chengdu', category: 'See', aliases: ['chengdu panda base', 'panda research base', '成都大熊猫繁育研究基地'] },
  { name: 'Yulin West Road', localName: '玉林西路', city: 'Chengdu', category: 'Eat', aliases: ['yulin west road', 'yulin road', '玉林西路', '玉林路'] },
  { name: 'Chengdu Wuhou Shrine Museum', localName: '成都武侯祠博物馆', city: 'Chengdu', category: 'See', aliases: ['wuhou shrine', 'wuhou temple', '成都武侯祠博物馆', '武侯祠'] },
  { name: 'Xiaolongkan Hotpot', localName: '小龙坎火锅', city: 'Chengdu', category: 'Eat', aliases: ['小龙坎火锅', 'xiaolongkan hotpot', 'xiao long kan'] },
  { name: 'Xi’an City Wall at Yongning Gate', localName: '西安城墙（永宁门）', city: "Xi'an", category: 'See', aliases: ['xi’an city wall at yongning gate', "xi'an city wall at yongning gate", 'yongning gate', '永宁门', '西安城墙'] },
  { name: 'Great Mosque of Xi’an', localName: '西安化觉巷清真大寺', city: "Xi'an", category: 'See', aliases: ['great mosque of xi’an', "great mosque of xi'an", 'huajue lane mosque', '化觉巷清真大寺', '西安化觉巷清真大寺'] },
  { name: 'Shaanxi History Museum — main museum', localName: '陕西历史博物馆（本馆）', city: "Xi'an", category: 'See', aliases: ['shaanxi history museum', '陕西历史博物馆', '陕西历史博物馆（本馆）'] },
  { name: 'Da Ci’en Temple and Big Wild Goose Pagoda', localName: '大慈恩寺（大雁塔）', city: "Xi'an", category: 'See', aliases: ['da ci’en temple', "da ci'en temple", 'big wild goose pagoda', '大慈恩寺', '大雁塔'] },
  { name: 'Xi’an Museum and Small Wild Goose Pagoda', localName: '西安博物院（小雁塔）', city: "Xi'an", category: 'See', aliases: ['xi’an museum', "xi'an museum", 'small wild goose pagoda', '西安博物院', '小雁塔'] },
  { name: 'Emperor Qinshihuang’s Mausoleum Site Museum', localName: '秦始皇帝陵博物院', city: "Xi'an", category: 'See', aliases: ["emperor qinshihuang's mausoleum site museum", 'emperor qinshihuang’s mausoleum site museum', 'terracotta warriors museum', 'terracotta army museum', '秦始皇帝陵博物院', '兵马俑'] },
  { name: 'Forbidden City', localName: '故宫', city: 'Beijing', category: 'See', aliases: ['forbidden city', '故宫'] },
  { name: 'Temple of Heaven', localName: '天坛', city: 'Beijing', category: 'See', aliases: ['temple of heaven', '天坛'] },
  { name: 'Mutianyu Great Wall', localName: '慕田峪长城', city: 'Beijing', category: 'See', aliases: ['mutianyu', '慕田峪'] },
  { name: 'Shanghai Museum', localName: '上海博物馆', city: 'Shanghai', category: 'See', aliases: ['shanghai museum', '上海博物馆'] },
  { name: 'Xintiandi', localName: '新天地', city: 'Shanghai', category: 'See', aliases: ['xintiandi', '新天地'] },
  { name: 'Longhua Temple', localName: '龙华寺', city: 'Shanghai', category: 'See', aliases: ['longhua temple', '龙华寺'] },
  { name: 'Yu Garden', localName: '豫园', city: 'Shanghai', category: 'See', aliases: ['yu garden', 'yuyuan', '豫园'] },
  { name: 'Nanjing Road Pedestrian Street', localName: '南京路步行街', city: 'Shanghai', category: 'See', aliases: ['nanjing road', '南京路步行街'] },
  { name: 'City God Temple', localName: '城隍庙', city: 'Shanghai', category: 'Eat', aliases: ['city god temple', '城隍庙'] },
];

export const DEFAULT_MAINLAND_MAP_PROVIDER = 'amap';

export function mapProviderUrl(provider, place) {
  return provider === 'apple' ? appleMapsUrl(place) : amapUrl(place);
}

export function sourceFromShareOrLink(locationSearch, pastedLink) {
  const params = new URLSearchParams(locationSearch || '');
  const title = params.get('title') || '';
  const text = params.get('text') || '';
  const url = params.get('url') || pastedLink || '';
  return normalizeSource({ title, text, url });
}

export function normalizeSource({ title = '', text = '', url = '' } = {}) {
  const decodedUrl = safeDecode(url);
  const bits = [title, text, decodedUrl, textFromUrl(decodedUrl)].filter(Boolean);
  return { url: decodedUrl, text: bits.map(compactLines).filter(Boolean).join('\n'), platform: detectPlatform(decodedUrl) };
}

export function extractTripPlaces(source) {
  const raw = typeof source === 'string' ? normalizeSource({ url: source }) : normalizeSource(source);
  const text = raw.text;
  const results = [];
  let structuredCount = 0;
  for (const line of text.split(/\r?\n/).map((item) => item.trim()).filter(Boolean)) {
    const structured = line.match(/^\s*\d{1,2}[.)、:]\s+(.+?)\s*\/\s*([\p{Script=Han}A-Za-z0-9·（）()\-\s]+?)\s+[—–-]\s+([A-Za-z][A-Za-z'’ .\-]+?)(?:\s+[—–-]\s+(.+))?$/u);
    if (!structured) continue;
    structuredCount += 1;
    add({
      name: cleanName(structured[1]),
      localName: cleanName(structured[2]),
      city: cleanName(structured[3]),
      category: inferCategory(line),
      confidence: 'structured list',
      sourceUrl: raw.url,
      sourcePlatform: raw.platform,
      note: cleanNote(line),
    });
  }
  if (!structuredCount) {
    for (const place of knownPlaces) {
      const haystack = text.toLowerCase();
      if ([place.name, ...place.aliases].some((alias) => aliasMentioned(haystack, alias))) {
        add({ ...place, confidence: 'known place', sourceUrl: raw.url, sourcePlatform: raw.platform, note: evidenceLine(text, place) });
      }
    }
  }
  const lines = text.split(/\n|。|；|;|•|·/).map((line) => line.trim()).filter(Boolean);
  const chinesePlace = /([\u4e00-\u9fa5A-Za-z0-9'’&·\-\s]{2,28}?(?:路|街|巷|寺|站|机场|公园|广场|市场|博物馆|酒店|饭店|餐厅|茶社|茶馆|火锅|小吃|面馆|咖啡|书店|中心|外滩))/g;
  const englishSignals = /\b(?:at|near|around|inside|to|from|on|visited|stay near|walk to|lunch at|sunset at|save|recommend(?:ed|ing)?)\s+([A-Z][A-Za-z'’&\-.]+(?:\s+[A-Z][A-Za-z'’&\-.]+){0,5})/g;
  for (const line of lines) {
    if (/^\s*\d{1,2}[.)、:]\s+.+?\s*\/\s*[\p{Script=Han}].+?\s+[—–-]\s+/u.test(line)) continue;
    for (const match of line.matchAll(chinesePlace)) addCandidate(match[1], line, raw);
    for (const match of line.matchAll(englishSignals)) addCandidate(match[1], line, raw);
    const listItem = line.match(/^(?:\s*(?:\d{1,2}[.)、:]|[-*]))\s+(.{2,64})$/);
    if (listItem) {
      const candidate = listItem[1].split(/\s+(?:[-–—]|near|in)\s+/i)[0].trim();
      if (candidate.length <= 42 && (/\p{Script=Han}/u.test(candidate) || /^[A-Z][A-Za-z0-9'’&.\- ]+$/.test(candidate))) {
        addCandidate(candidate, line, raw);
      }
    }
  }
  results.sort((a, b) => sourceIndex(text, a) - sourceIndex(text, b));
  return { source: raw, places: results.slice(0, 8), needsMoreText: Boolean(raw.url && results.length === 0) };

  function addCandidate(rawName, line, sourceMeta) {
    const name = cleanName(rawName);
    if (!name) return;
    add({ name, city: inferCity(line), category: inferCategory(line), confidence: 'text match', sourceUrl: sourceMeta.url, sourcePlatform: sourceMeta.platform, note: cleanNote(line) });
  }
  function add(place) {
    const maxNameLength = place.confidence === 'structured list' ? 72 : 42;
    if (!place.name || place.name.length < 2 || place.name.length > maxNameLength) return;
    if (/^(day|start|in|for|the|near|then|lunch|sunset|stay|china|shanghai|beijing|chengdu|xi'an)$/i.test(place.name)) return;
    const key = String(place.name).toLowerCase() + '|' + String(place.city || '').toLowerCase();
    const candidateAliases = aliasesFor(place);
    const duplicate = results.some((item) => {
      if (String(item.name).toLowerCase() + '|' + String(item.city || '').toLowerCase() === key) return true;
      if (item.city && place.city && String(item.city).toLowerCase() !== String(place.city).toLowerCase()) return false;
      return aliasesFor(item).some((alias) => candidateAliases.includes(alias));
    });
    if (!duplicate) results.push(place);
  }
}

function sourceIndex(text, place) {
  const indexes = aliasesFor(place)
    .map((alias) => String(text || '').toLowerCase().indexOf(alias))
    .filter((index) => index >= 0);
  return indexes.length ? Math.min(...indexes) : Number.MAX_SAFE_INTEGER;
}

export function appleMapsUrl(place) {
  const coordinate = coordinateForPlace(place);
  if (coordinate) {
    const label = encodeURIComponent(displayName(place));
    return 'https://maps.apple.com/?ll=' + coordinate.lat + ',' + coordinate.lon + '&q=' + label;
  }
  return 'https://maps.apple.com/?q=' + encodeURIComponent(displayName(place));
}
export function amapUrl(place) {
  const coordinate = coordinateForPlace(place);
  if (coordinate) {
    const label = encodeURIComponent(displayName(place));
    return 'https://uri.amap.com/marker?position=' + coordinate.lon + ',' + coordinate.lat + '&name=' + label + '&src=chinatravelmadeeasy&coordinate=gaode&callnative=1';
  }
  return 'https://uri.amap.com/search?keyword=' + encodeURIComponent(displayName(place)) + '&view=map&src=chinatravelmadeeasy&callnative=1';
}
export function displayName(place) {
  const names = Array.from(new Set([place.name, place.localName].filter(Boolean)));
  return [names.join(' / '), place.city].filter(Boolean).join(', ');
}

function coordinateForPlace(place) {
  const lat = Number(place?.latitude ?? place?.lat);
  const lon = Number(place?.longitude ?? place?.lon ?? place?.lng);
  if (!Number.isFinite(lat) || !Number.isFinite(lon)) return null;
  return { lat: lat.toFixed(5), lon: lon.toFixed(5) };
}

function textFromUrl(url) {
  if (!url) return '';
  try {
    const parsed = new URL(url);
    const params = ['q', 'query', 'keyword', 'keywords', 'caption', 'title', 'text', 'description', 'place', 'poi'].map((key) => parsed.searchParams.get(key)).filter(Boolean);
    const slug = parsed.pathname.split(/[\/_.-]+/).filter((part) => part && !/^\d+$/.test(part) && part.length > 1).join(' ');
    return compact([...params, slug].join(' '));
  } catch { return url; }
}
function detectPlatform(url) {
  if (/douyin|tiktok/i.test(url)) return 'TikTok/Douyin';
  if (/reddit/i.test(url)) return 'Reddit';
  if (/instagram/i.test(url)) return 'Instagram';
  if (/google|maps\.apple|amap/i.test(url)) return 'Map link';
  return url ? 'Web link' : 'Pasted text';
}
function cleanName(value) {
  return String(value || '')
    .replace(/^[\s:：,，.。\-–—]+|[\s:：,，.。\-–—]+$/g, '')
    .replace(/^(?:the|at|near|around|inside|to|from|on|walk to|lunch at|sunset at|save|recommend(?:ed|ing)?)\s+/i, '')
    .replace(/^(?:start|then|go|visit|visited|stay|lunch|dinner|morning walk|sunset)\s+(?:at|on|near|around|inside|to)\s+/i, '')
    .replace(/^.*\b(?:kept recommending|kept mentioning|mentioned|mentions|recommend|recommended|suggested)\s+/i, '')
    .replace(/^.*?\b(?:at|near|around|inside|to|from|on)\s+(?=[\u4e00-\u9fa5])/i, '')
    .replace(/^(?:第?[一二三四五六七八九十0-9]+天|早上|上午|中午|下午|晚上|先去|再去|然后去|去)+\s*/u, '')
    .replace(/^(?:and|then)\s+/i, '')
    .trim();
}
function inferCity(text) {
  if (/上海|Shanghai|Bund|Jing'an|Wukang|Anfu|People's Square|Huanghe|外滩|静安寺|武康路/i.test(text)) return 'Shanghai';
  if (/成都|Chengdu|Heming|People's Park|Wenshu|Panda Base|Wuhou|Yulin|小龙坎|鹤鸣|人民公园|文殊院|熊猫繁育|武侯祠|玉林西路/i.test(text)) return 'Chengdu';
  if (/北京|Beijing|Forbidden|Temple of Heaven|Mutianyu|故宫|天坛|慕田峪/i.test(text)) return 'Beijing';
  if (/西安|Xi'an|Terracotta|Muslim Quarter/i.test(text)) return "Xi'an";
  return '';
}
function inferCategory(text) {
  const subject = String(text || '')
    .replace(/^\s*\d{1,2}[.)、:]\s+/, '')
    .split(/\s+\/\s+|\s+[—–-]\s+/)[0];
  if (/food|lunch|snack|restaurant|hotpot|bao|noodle|bakery|market|小吃|火锅|餐厅|饭店|面馆|咖啡|汤包|市场/i.test(subject)) return 'Eat';
  if (/hotel|stay|lobby|酒店|民宿/i.test(subject)) return 'Stay';
  if (/station|airport|metro|train|站|机场/i.test(subject)) return 'Move';
  if (/tea|tea house|teahouse|茶社|茶馆|茶/i.test(subject)) return 'Tea';
  if (/museum|mosque|temple|pagoda|wall|monastery|shrine|garden|park|promenade|trail|博物馆|清真|寺|塔|城墙|公园|花园|海滨|步道/i.test(subject)) return 'See';
  if (/food|lunch|snack|restaurant|hotpot|bao|小吃|火锅|餐厅|饭店|面馆|咖啡|汤包/i.test(text)) return 'Eat';
  if (/hotel|stay|lobby|酒店|民宿/i.test(text)) return 'Stay';
  if (/station|airport|metro|train|站|机场/i.test(text)) return 'Move';
  if (/tea|茶/i.test(text)) return 'Tea';
  return 'See';
}
function evidenceLine(text, place) {
  const aliases = [place.name, ...place.aliases].map((alias) => alias.toLowerCase());
  return cleanNote(text.split(/\n|。|；|;|•/).find((line) => !/^https?:/i.test(line.trim()) && aliases.some((alias) => line.toLowerCase().includes(alias))) || 'Found in the shared link metadata.');
}
function aliasesFor(place) {
  return [place.name, place.localName, ...(place.aliases || [])].map((alias) => String(alias || '').toLowerCase()).filter(Boolean);
}
function aliasMentioned(haystack, alias) {
  const needle = String(alias || '').toLowerCase();
  if (!needle) return false;
  if (/\p{Script=Han}/u.test(needle)) return haystack.includes(needle);
  if (needle === 'bund' && /\bbund\s+(?:hotel|hostel|inn|residence)\b/i.test(haystack) && !/\bthe bund\b/i.test(haystack)) return false;
  const escaped = needle.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  return new RegExp('(?:^|[^a-z0-9])' + escaped + '(?:$|[^a-z0-9])', 'i').test(haystack);
}
function cleanNote(line) { return compact(String(line || '').replace(/^[-\s]+/, '')).slice(0, 150); }
function compactLines(value) { return String(value || '').split(/\r?\n/).map(compact).filter(Boolean).join('\n'); }
function compact(value) { return String(value || '').replace(/%20/g, ' ').replace(/[+_]+/g, ' ').replace(/\s+/g, ' ').trim(); }
function safeDecode(value) { try { return decodeURIComponent(String(value || '')); } catch { return String(value || ''); } }
