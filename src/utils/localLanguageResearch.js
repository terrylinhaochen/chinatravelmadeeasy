export const LOCAL_RESEARCH_PIPELINE_VERSION = 'local-research-v1';

export const localResearchStages = [
  {
    id: 'query',
    title: 'Think in the destination language',
    body: 'Generate native search patterns for the trip intent—not a literal translation of “hidden gems.”',
  },
  {
    id: 'retrieve',
    title: 'Retrieve local-source evidence',
    body: 'Search accessible local-language web sources now, then authenticated platforms such as Xiaohongshu and Dianping when their adapters are connected.',
  },
  {
    id: 'explain',
    title: 'Translate the reason, not just the name',
    body: 'Preserve the original identity and evidence while explaining timing, route role, caveats, and why the recommendation fits the traveler.',
  },
  {
    id: 'resolve',
    title: 'Prove the map handoff',
    body: 'Match the local name, city, branch, address, and provider identities before a recommendation becomes a saveable pin.',
  },
];

export const shanghaiNativeQueries = [
  '上海 本地人 周末 citywalk 路线',
  '上海 小马路 散步 路线 起点 终点',
  '上海 杨浦滨江 工业遗产 citywalk',
  '上海 周末 去哪 避雷 预约 交通',
];

export function summarizeAgentResearch(candidates = []) {
  const sourceUrls = new Set(candidates.map((candidate) => candidate.sourceUrl).filter(Boolean));
  const states = { resolved: 0, probable: 0, unresolved: 0 };
  candidates.forEach((candidate) => {
    const state = candidate.providerMatch?.state;
    if (state in states) states[state] += 1;
  });
  return {
    candidateCount: candidates.length,
    sourceCount: sourceUrls.size,
    states,
    autoSaveCount: states.resolved,
    needsReviewCount: states.probable + states.unresolved,
  };
}

export function validateAgentResearchCandidate(candidate) {
  const errors = [];
  if (!candidate?.id) errors.push('missing-id');
  if (!candidate?.name || !candidate?.originalName) errors.push('missing-bilingual-identity');
  if (!candidate?.hook || !candidate?.detail) errors.push('missing-traveler-context');
  if (!candidate?.sourceLabel || !/^https:\/\//.test(candidate?.sourceUrl || '')) errors.push('missing-source-provenance');
  if (!candidate?.providerMatch?.state) errors.push('missing-resolution-state');
  return { valid: errors.length === 0, errors };
}

export function sourceAdapterState() {
  return [
    {
      name: 'Chinese local web',
      state: 'reviewed',
      detail: 'Shanghai municipal sources and Shanghai BendiBao are present in the current evidence snapshot.',
    },
    {
      name: 'Xiaohongshu',
      state: 'not-connected',
      detail: 'The authenticated Xiaohongshu connection is not set up yet, so no result in this snapshot is attributed to it.',
    },
    {
      name: 'Dianping',
      state: 'planned',
      detail: 'Provider adapter and policy review are still required; no Dianping result is represented as retrieved.',
    },
  ];
}
