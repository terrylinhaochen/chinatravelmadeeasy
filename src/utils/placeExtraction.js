const knownPlaces = [
  { name: '武康路', city: 'Shanghai', category: 'See', aliases: ['wukang road', 'wukang lu'] },
  { name: 'Anfu Road', city: 'Shanghai', category: 'See', aliases: ['anfu road'] },
  { name: 'Jia Jia Tang Bao', city: 'Shanghai', category: 'Eat', aliases: ['jia jia tang bao', '佳家汤包'] },
  { name: "People's Square", city: 'Shanghai', category: 'See', aliases: ["people's square", '人民广场'] },
  { name: 'The Bund', city: 'Shanghai', category: 'See', aliases: ['the bund', 'bund', '外滩'] },
  { name: 'Huanghe Road', city: 'Shanghai', category: 'Eat', aliases: ['huanghe road', '黄河路'] },
  { name: "Jing'an Temple", city: 'Shanghai', category: 'Stay', aliases: ["jing'an temple", 'jing an temple', '静安寺'] },
  { name: "People's Park", city: 'Chengdu', category: 'Tea', aliases: ["people's park", '人民公园'] },
  { name: 'Heming Tea House', city: 'Chengdu', category: 'Tea', aliases: ['heming tea house', '鹤鸣茶社'] },
  { name: '小龙坎火锅', city: 'Chengdu', category: 'Eat', aliases: ['小龙坎火锅', 'xiaolongkan hotpot', 'xiao long kan'] },
  { name: 'Forbidden City', city: 'Beijing', category: 'See', aliases: ['forbidden city', '故宫'] },
  { name: 'Temple of Heaven', city: 'Beijing', category: 'See', aliases: ['temple of heaven', '天坛'] },
  { name: 'Mutianyu Great Wall', city: 'Beijing', category: 'See', aliases: ['mutianyu', '慕田峪'] }
];

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
  return { url: decodedUrl, text: bits.map(compact).filter(Boolean).join('\n'), platform: detectPlatform(decodedUrl) };
}

export function extractTripPlaces(source) {
  const raw = typeof source === 'string' ? normalizeSource({ url: source }) : normalizeSource(source);
  const text = raw.text;
  const results = [];
  for (const place of knownPlaces) {
    const haystack = text.toLowerCase();
    if ([place.name, ...place.aliases].some((alias) => haystack.includes(alias.toLowerCase()))) {
      add({ ...place, confidence: 'known place', sourceUrl: raw.url, sourcePlatform: raw.platform, note: evidenceLine(text, place) });
    }
  }
  const lines = text.split(/\n|。|；|;|•|·/).map((line) => line.trim()).filter(Boolean);
  const chinesePlace = /([\u4e00-\u9fa5A-Za-z0-9'’&·\-\s]{2,28}?(?:路|街|巷|寺|站|机场|公园|广场|市场|博物馆|酒店|饭店|餐厅|茶社|茶馆|火锅|小吃|面馆|咖啡|书店|中心|外滩))/g;
  const englishSignals = /(?:at|near|around|inside|to|from|on|visited|stay near|walk to|lunch at|sunset at|save|recommend(?:ed|ing)?)\s+([A-Z][A-Za-z'’&\-.]+(?:\s+[A-Z][A-Za-z'’&\-.]+){0,5})/g;
  for (const line of lines) {
    for (const match of line.matchAll(chinesePlace)) addCandidate(match[1], line, raw);
    for (const match of line.matchAll(englishSignals)) addCandidate(match[1], line, raw);
  }
  return { source: raw, places: results.slice(0, 8), needsMoreText: Boolean(raw.url && results.length === 0) };

  function addCandidate(rawName, line, sourceMeta) {
    const name = cleanName(rawName);
    if (!name) return;
    add({ name, city: inferCity(line), category: inferCategory(line), confidence: 'text match', sourceUrl: sourceMeta.url, sourcePlatform: sourceMeta.platform, note: cleanNote(line) });
  }
  function add(place) {
    if (!place.name || place.name.length < 2 || place.name.length > 42) return;
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
export function displayName(place) { return [place.name, place.city].filter(Boolean).join(', '); }

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
    .trim();
}
function inferCity(text) {
  if (/上海|Shanghai|Bund|Jing'an|Wukang|Anfu|People's Square|Huanghe|外滩|静安寺|武康路/i.test(text)) return 'Shanghai';
  if (/成都|Chengdu|Heming|People's Park|小龙坎|鹤鸣|人民公园/i.test(text)) return 'Chengdu';
  if (/北京|Beijing|Forbidden|Temple of Heaven|Mutianyu|故宫|天坛|慕田峪/i.test(text)) return 'Beijing';
  if (/西安|Xi'an|Terracotta|Muslim Quarter/i.test(text)) return "Xi'an";
  return '';
}
function inferCategory(text) {
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
  return [place.name, ...(place.aliases || [])].map((alias) => String(alias || '').toLowerCase()).filter(Boolean);
}
function cleanNote(line) { return compact(String(line || '').replace(/^[-\s]+/, '')).slice(0, 150); }
function compact(value) { return String(value || '').replace(/%20/g, ' ').replace(/[+_]+/g, ' ').replace(/\s+/g, ' ').trim(); }
function safeDecode(value) { try { return decodeURIComponent(String(value || '')); } catch { return String(value || ''); } }
