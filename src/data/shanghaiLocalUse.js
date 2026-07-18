export const shanghaiLocalUseCollection = {
  id: 'local-lens-yangpu-everyday-weekend',
  slug: 'what-yangpu-residents-use-on-a-slow-day',
  title: 'What Yangpu residents use on a slow day',
  city: 'Shanghai',
  destinationSlug: 'shanghai',
  neighborhood: 'Yangpu',
  checkedAt: '2026-07-17',
  intent: 'Find public places with evidence of ordinary local use, then keep the resident signal, practical context, and map confidence attached.',
  summary: 'Four Yangpu public spaces surfaced through Chinese-language resident reporting and local public sources. Direct testimony, community-use evidence, and provider confidence remain separate so “local” never becomes an unsupported label.',
  methodNote: 'This reviewed slice searched accessible Chinese-local web sources. The Xiaohongshu and Dianping adapters were not connected, so no candidate is attributed to either platform.',
  sourceAccess: {
    chineseLocalWeb: 'reviewed',
    xiaohongshu: 'not-connected',
    dianping: 'not-connected',
  },
  sourceNotes: [
    {
      id: 'yangpu-student-family-green-hill',
      platform: 'Chinese local reporting',
      title: 'A Yangpu student returns to Green Hill with her brother',
      originalLanguage: 'Chinese',
      originalCue: '每隔一两周',
      cueMeaning: 'Repeat use, not one-off sightseeing',
      localSignal: 'Repeat resident use turns an architecture landmark into a family-accessible riverfront stop.',
      candidateIds: ['green-hill-local-use'],
      retrievedAt: '2026-07-17',
      sources: [
        {
          label: 'Chinese Youth Daily · resident interviews and usage counts',
          type: 'resident-reporting',
          url: 'https://k.sina.cn/article_1726918143_66eeadff02001n24w.html?from=news&subch=onews',
        },
      ],
    },
    {
      id: 'yangpu-child-friendly-waterfront',
      platform: 'District community evidence',
      title: 'Child-friendly waterfront spaces connect museum, factory, and river walk',
      originalLanguage: 'Chinese',
      originalCue: '儿童友好示范点',
      cueMeaning: 'Part of a resident-facing public-space network',
      localSignal: 'The useful travel idea is not one viral pin; it is a slower Yangpu waterfront day with indoor fallbacks.',
      candidateIds: ['worldskills-museum-local-use', 'soap-dream-space-local-use'],
      retrievedAt: '2026-07-17',
      sources: [
        {
          label: 'Chinese Youth Daily · child-friendly waterfront network',
          type: 'local-use-reporting',
          url: 'https://k.sina.cn/article_1726918143_66eeadff02001n24w.html?from=news&subch=onews',
        },
        {
          label: 'WorldSkills Museum · current visitor contract',
          type: 'official-operations',
          url: 'https://worldskillsmuseum.com/visit/',
        },
        {
          label: 'Yangpu government · soap factory public-space identity',
          type: 'official-identity',
          url: 'https://www.shyp.gov.cn/shypq/ggfw-bmgg/20220104/400267.html',
        },
      ],
    },
    {
      id: 'fuxing-island-neighborhood-walk',
      platform: 'Shanghai community attraction review',
      title: 'Fuxing Island Park is used for quiet walks and neighborhood air',
      originalLanguage: 'Chinese',
      originalCue: '市民散步、观景、寻幽',
      cueMeaning: 'A quiet local walking role, not a marquee detour',
      localSignal: 'Local use changes the itinerary role: this is a slow finish, not a marquee detour.',
      candidateIds: ['fuxing-island-park-local-use'],
      retrievedAt: '2026-07-17',
      sources: [
        {
          label: 'Shanghai government · community-use evidence and address',
          type: 'community-attraction-review',
          url: 'https://www.shanghai.gov.cn/nw17239/20260126/6d318188a95549e182af3feda8d499e3.html',
        },
      ],
    },
  ],
  candidates: [
    {
      id: 'green-hill-local-use',
      name: 'Green Hill',
      localName: '绿之丘',
      slug: 'green-hill-yangpu',
      address: '杨树浦路1500号, Yangpu, Shanghai',
      latitude: 31.254825,
      longitude: 121.538809,
      evidenceGrade: 'resident-direct',
      evidenceLabel: 'Direct resident testimony',
      originalCue: '每隔一两周',
      cueMeaning: 'The source describes repeat family use.',
      localUse: 'A repeat family activity stop and an accessible river overlook, rather than only an architecture photo.',
      tripRole: 'Use as the opening overlook for a Yangpu waterfront half-day when family access, ramps, or industrial architecture matter.',
      travelerAction: 'Review before saving: the local story is strong, but the persistent AMap POI still needs confirmation.',
      evidence: 'Chinese Youth Daily interviewed a Yangpu student who returns with her brother every one or two weeks. The women-and-children center reported more than 300 programs and 60,000 visits, while local disability representatives described independently using the waterfront.',
      travelerContext: 'Best for a family, accessibility-conscious, or industrial-architecture afternoon. Check the current activity calendar separately; the public building and a scheduled program are different promises.',
      resolutionState: 'probable',
      resolutionNote: 'The official address and persistent Apple identity agree. A persistent AMap POI was not confirmed, so this remains review-before-save.',
      providerLinks: {
        amap: 'https://uri.amap.com/search?keyword=%E7%BB%BF%E4%B9%8B%E4%B8%98%20%E6%9D%A8%E6%B5%A6%20%E4%B8%8A%E6%B5%B7&city=310000&callnative=1',
        apple: 'https://maps.apple.com/place?_provider=57879&place-id=H2710I3F9268ED09EE6',
      },
      sources: [
        {
          label: 'Chinese Youth Daily · resident interviews and usage counts',
          type: 'resident-reporting',
          url: 'https://k.sina.cn/article_1726918143_66eeadff02001n24w.html?from=news&subch=onews',
        },
        {
          label: 'Yangpu government · address and public-space identity',
          type: 'official-identity',
          url: 'https://www.shyp.gov.cn/shypq/shxd-db/20231128/442713.html',
        },
      ],
    },
    {
      id: 'worldskills-museum-local-use',
      name: 'WorldSkills Museum',
      localName: '世界技能博物馆',
      slug: 'worldskills-museum-shanghai',
      address: '杨树浦路1578号（正门面向安浦路）, Yangpu, Shanghai',
      latitude: 31.255879,
      longitude: 121.541547,
      evidenceGrade: 'local-use-corroborated',
      evidenceLabel: 'Local-use signal',
      originalCue: '25个滨江沿线特色室内户外空间场馆',
      cueMeaning: 'The museum appears in a waterfront network, not as an isolated attraction claim.',
      localUse: 'An indoor, interactive family stop that can carry the hottest or wettest part of a waterfront day.',
      tripRole: 'Use as the weather-proof middle of a Yangpu riverfront day, especially with kids or visitors who need an indoor reset.',
      travelerAction: 'Review before saving: confirm the exact provider identity and current reservation path before treating it as a pin.',
      evidence: 'Yangpu reporting includes the museum in the district’s child-friendly waterfront network. Its official visitor information confirms free entry, interactive exhibits, wheelchair access, the Anpu Road entrance, and a separate reservation path for visitors without WeChat.',
      travelerContext: 'Use it for two to three indoor hours, not as a quick photo stop. Recheck the current reservation rule and Monday closure before leaving.',
      resolutionState: 'probable',
      resolutionNote: 'The official address and persistent Apple identity agree. The public-web review did not confirm a persistent AMap identity for the museum rather than its parking lot.',
      providerLinks: {
        amap: 'https://uri.amap.com/search?keyword=%E4%B8%96%E7%95%8C%E6%8A%80%E8%83%BD%E5%8D%9A%E7%89%A9%E9%A6%86%20%E4%B8%8A%E6%B5%B7&city=310000&callnative=1',
        apple: 'https://maps.apple.com/place?auid=1118418027443630&lsp=57879',
      },
      sources: [
        {
          label: 'Chinese Youth Daily · child-friendly waterfront network',
          type: 'local-use-reporting',
          url: 'https://k.sina.cn/article_1726918143_66eeadff02001n24w.html?from=news&subch=onews',
        },
        {
          label: 'WorldSkills Museum · current visitor contract',
          type: 'official-operations',
          url: 'https://worldskillsmuseum.com/visit/',
        },
      ],
    },
    {
      id: 'soap-dream-space-local-use',
      name: 'Soap Dream Space',
      localName: '皂梦空间',
      slug: 'soap-dream-space-yangpu',
      address: '平定路1号, Yangpu, Shanghai',
      latitude: 31.269899,
      longitude: 121.557848,
      evidenceGrade: 'local-use-proxy',
      evidenceLabel: 'Community-program proxy',
      originalCue: '皂梦空间（原制皂厂）',
      cueMeaning: 'The local source preserves the factory-space identity, but not direct visitor testimony.',
      localUse: 'A small industrial-history pause inside the public waterfront network, especially relevant to families using the child-friendly corridor.',
      tripRole: 'Treat as a conditional pause between stronger Yangpu anchors, not as a standalone reason to cross town.',
      travelerAction: 'Keep as inspiration only until current public access and provider identity are verified.',
      evidence: 'Local reporting lists the former soap factory among 25 child-friendly demonstration spaces. Municipal material preserves its industrial identity and address, but the current slice did not retrieve direct resident testimony about this specific stop.',
      travelerContext: 'Treat it as a conditional pause, not the reason to cross Shanghai. Confirm current public access and opening before building the day around it.',
      resolutionState: 'probable',
      resolutionNote: 'The official address is specific, but persistent AMap and Apple place identities were not confirmed. Search results remain a review handoff, not an automatic pin.',
      providerLinks: {
        amap: 'https://uri.amap.com/search?keyword=%E7%9A%82%E6%A2%A6%E7%A9%BA%E9%97%B4%20%E6%9D%A8%E6%B5%A6%20%E4%B8%8A%E6%B5%B7&city=310000&callnative=1',
        apple: 'https://maps.apple.com/?q=%E7%9A%82%E6%A2%A6%E7%A9%BA%E9%97%B4%20%E6%9D%A8%E6%B5%A6%20%E4%B8%8A%E6%B5%B7',
      },
      sources: [
        {
          label: 'Chinese Youth Daily · child-friendly corridor evidence',
          type: 'local-use-reporting',
          url: 'https://k.sina.cn/article_1726918143_66eeadff02001n24w.html?from=news&subch=onews',
        },
        {
          label: 'Yangpu government · official address and industrial identity',
          type: 'official-identity',
          url: 'https://www.shyp.gov.cn/shypq/ggfw-bmgg/20220104/400267.html',
        },
      ],
    },
    {
      id: 'fuxing-island-park-local-use',
      name: 'Fuxing Island Park',
      localName: '复兴岛公园',
      slug: 'fuxing-island-park',
      address: '共青路386号, Yangpu, Shanghai',
      latitude: 31.286431,
      longitude: 121.562352,
      evidenceGrade: 'local-use-corroborated',
      evidenceLabel: 'Community-use evidence',
      originalCue: '市民散步、观景、寻幽',
      cueMeaning: 'The source frames the park around everyday quiet use.',
      localUse: 'A quiet neighborhood walk for trees, river air, and a slower finish away from the central sightseeing circuit.',
      tripRole: 'Save as the slow finish for a Yangpu local-use day when the goal is neighborhood air rather than marquee sightseeing.',
      travelerAction: 'Save now: AMap and Apple agree on the park identity at 共青路386号.',
      evidence: 'Shanghai’s 2026 community-attraction review describes the park as a place residents use for walking, views, and quiet time. The source supplies the current address and explains the park’s water, woodland, and neighborhood role.',
      travelerContext: 'Use the island as a separate slow finish, not as an implied continuation of every Yangpu waterfront walk. Check current access and the return before dusk.',
      resolutionState: 'resolved',
      resolutionNote: 'AMap and Apple identify the same park at 共青路386号. This is the only candidate in the slice eligible for automatic save.',
      providerLinks: {
        amap: 'https://www.amap.com/place/B00154DQQ7',
        apple: 'https://maps.apple.com/place?_provider=57879&place-id=H2710I3F80D8CC0908F',
      },
      sources: [
        {
          label: 'Shanghai government · community-use evidence and address',
          type: 'community-attraction-review',
          url: 'https://www.shanghai.gov.cn/nw17239/20260126/6d318188a95549e182af3feda8d499e3.html',
        },
        {
          label: 'AMap and Apple Maps · matching provider identities',
          type: 'provider-resolution',
          url: 'https://www.amap.com/place/B00154DQQ7',
        },
      ],
    },
  ],
};

export function summarizeShanghaiLocalUse(collection = shanghaiLocalUseCollection) {
  const candidates = collection.candidates || [];
  return {
    candidateCount: candidates.length,
    sourceNoteCount: (collection.sourceNotes || []).length,
    directResidentCount: candidates.filter((candidate) => candidate.evidenceGrade === 'resident-direct').length,
    resolvedCount: candidates.filter((candidate) => candidate.resolutionState === 'resolved').length,
    sourceCount: new Set(candidates.flatMap((candidate) => candidate.sources.map((source) => source.url))).size,
  };
}

export function validateShanghaiLocalUseCandidate(candidate) {
  const errors = [];
  if (!candidate?.name || !candidate?.localName) errors.push('missing-bilingual-identity');
  if (!candidate?.localUse || !candidate?.tripRole || !candidate?.travelerAction || !candidate?.evidence || !candidate?.travelerContext) errors.push('missing-use-context');
  if (!candidate?.originalCue || !candidate?.cueMeaning) errors.push('missing-original-language-cue');
  if (!['resident-direct', 'local-use-corroborated', 'local-use-proxy'].includes(candidate?.evidenceGrade)) errors.push('invalid-evidence-grade');
  if (!['resolved', 'probable', 'unresolved'].includes(candidate?.resolutionState)) errors.push('invalid-resolution-state');
  if (!Array.isArray(candidate?.sources) || candidate.sources.length < 2) errors.push('insufficient-provenance');
  if (candidate?.resolutionState === 'resolved') {
    if (!candidate.providerLinks?.amap?.includes('/place/')) errors.push('resolved-without-amap-place');
    if (!candidate.providerLinks?.apple?.includes('/place')) errors.push('resolved-without-apple-place');
  }
  return { valid: errors.length === 0, errors };
}

export function validateShanghaiLocalUseSourceNote(note, collection = shanghaiLocalUseCollection) {
  const errors = [];
  const candidateIds = new Set((collection.candidates || []).map((candidate) => candidate.id));
  if (!note?.id || !note?.title) errors.push('missing-source-note-identity');
  if (!note?.platform || !note?.originalLanguage) errors.push('missing-source-context');
  if (!note?.originalCue || !note?.cueMeaning) errors.push('missing-original-language-cue');
  if (!note?.localSignal) errors.push('missing-local-signal');
  if (!Array.isArray(note?.candidateIds) || note.candidateIds.length === 0) errors.push('missing-candidate-links');
  if ((note?.candidateIds || []).some((id) => !candidateIds.has(id))) errors.push('unknown-candidate-link');
  if (note?.retrievedAt && Number.isNaN(Date.parse(note.retrievedAt))) errors.push('invalid-retrieved-date');
  if (!Array.isArray(note?.sources) || note.sources.length === 0) errors.push('missing-source-note-evidence');
  if ((note?.sources || []).some((source) => !source?.label || !source?.type || !source?.url?.startsWith('https://'))) errors.push('invalid-source-note-evidence');
  return { valid: errors.length === 0, errors };
}
