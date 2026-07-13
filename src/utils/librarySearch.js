const STOP_WORDS = new Set([
  'a', 'an', 'and', 'are', 'at', 'after', 'before', 'can', 'check', 'do', 'for', 'free', 'from', 'has', 'have', 'how', 'i', 'in', 'is', 'it',
  'me', 'my', 'near', 'need', 'no', 'of', 'on', 'only', 'or', 'say', 'says', 'should', 'the', 'to', 'want', 'what', 'when', 'where',
  'which', 'with', 'without',
]);

function normalizeSearchText(value) {
  return String(value || '').toLowerCase().replace(/[\u2018\u2019']/g, '');
}

export function libraryTerms(value) {
  return normalizeSearchText(value)
    .split(/[^a-z0-9\u3400-\u9fff]+/)
    .filter((term) => term.length > 1 && !STOP_WORDS.has(term));
}

export function rankLibraryItems(items, query) {
  const terms = libraryTerms(query);
  if (!terms.length) return [];
  const minimumMatchedTerms = terms.length <= 2 ? 1 : Math.ceil(terms.length / 2);

  return items
    .map((item, sourceIndex) => {
      const title = normalizeSearchText(item.title);
      const label = normalizeSearchText(item.label);
      const summary = normalizeSearchText(item.summary);
      const search = normalizeSearchText(item.searchText);
      let matchedTerms = 0;
      const score = terms.reduce((total, term) => {
        const matched = title.includes(term) || label.includes(term) || summary.includes(term) || search.includes(term);
        if (matched) matchedTerms += 1;
        return total
          + (title.includes(term) ? 6 : 0)
          + (label.includes(term) ? 4 : 0)
          + (summary.includes(term) ? 2 : 0)
          + (search.includes(term) ? 1 : 0);
      }, 0);
      const coverageBonus = matchedTerms === terms.length ? 8 : matchedTerms >= Math.ceil(terms.length / 2) ? 3 : 0;
      return { item, score: score + coverageBonus, matchedTerms, sourceIndex };
    })
    .filter((entry) => entry.score > 0 && (entry.matchedTerms >= minimumMatchedTerms || (entry.matchedTerms >= 2 && entry.score >= 8)))
    .sort((a, b) => b.score - a.score || b.matchedTerms - a.matchedTerms || a.sourceIndex - b.sourceIndex);
}
