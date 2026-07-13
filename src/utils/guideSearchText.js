export function guideSearchText(guide) {
  const data = guide?.data ?? guide ?? {};
  const decision = data.decision ?? {};
  const faqs = Array.isArray(data.faqs) ? data.faqs : [];

  return [
    data.title,
    data.description,
    data.category,
    decision.bestFor,
    decision.doThis,
    decision.watchFor,
    ...faqs.flatMap((faq) => [faq?.q, faq?.a]),
    guide?.body ?? data.body,
  ]
    .filter(Boolean)
    .join(' ');
}
