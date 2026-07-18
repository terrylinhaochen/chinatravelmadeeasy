import { strict as assert } from 'node:assert';
import { readFile } from 'node:fs/promises';
import test from 'node:test';
import {
  shanghaiLocalUseCollection,
  summarizeShanghaiLocalUse,
  validateShanghaiLocalUseCandidate,
  validateShanghaiLocalUseSourceNote,
} from '../src/data/shanghaiLocalUse.js';

test('the Yangpu collection publishes a small, source-backed local-use slice', () => {
  const summary = summarizeShanghaiLocalUse();
  assert.deepEqual(summary, {
    candidateCount: 4,
    sourceNoteCount: 3,
    directResidentCount: 1,
    resolvedCount: 1,
    sourceCount: 6,
  });
  assert.equal(shanghaiLocalUseCollection.sourceAccess.chineseLocalWeb, 'reviewed');
  assert.equal(shanghaiLocalUseCollection.sourceAccess.xiaohongshu, 'not-connected');
  assert.equal(shanghaiLocalUseCollection.sourceAccess.dianping, 'not-connected');
});

test('source notes link local evidence to candidates without implying all are map-ready', () => {
  const candidateById = new Map(shanghaiLocalUseCollection.candidates.map((candidate) => [candidate.id, candidate]));

  for (const note of shanghaiLocalUseCollection.sourceNotes) {
    const result = validateShanghaiLocalUseSourceNote(note);
    assert.equal(result.valid, true, `${note.id}: ${result.errors.join(', ')}`);
    assert.equal(note.originalLanguage, 'Chinese');
    assert.ok(note.originalCue, `${note.id}: missing original-language cue`);
    assert.ok(note.cueMeaning, `${note.id}: missing original-language cue meaning`);
    assert.ok(note.candidateIds.every((id) => candidateById.has(id)));
    assert.ok(note.sources.length >= 1);
    assert.ok(note.sources.every((source) => source.url.startsWith('https://')));
  }

  const linkedCandidates = shanghaiLocalUseCollection.sourceNotes.flatMap((note) => note.candidateIds.map((id) => candidateById.get(id)));
  assert.ok(linkedCandidates.some((candidate) => candidate.resolutionState === 'probable'));
  assert.equal(linkedCandidates.filter((candidate) => candidate.resolutionState === 'resolved').length, 1);
});

test('every local-use candidate preserves bilingual identity, traveler context, and provenance', () => {
  for (const candidate of shanghaiLocalUseCollection.candidates) {
    const result = validateShanghaiLocalUseCandidate(candidate);
    assert.equal(result.valid, true, `${candidate.id}: ${result.errors.join(', ')}`);
    assert.match(candidate.address, /[\u3400-\u9fff]/u);
    assert.match(candidate.originalCue, /[\u3400-\u9fff]/u);
    assert.ok(candidate.cueMeaning.length >= 24);
    assert.ok(candidate.tripRole.length >= 40);
    assert.ok(candidate.travelerAction.length >= 40);
    assert.ok(candidate.sources.every((source) => source.url.startsWith('https://')));
  }
});

test('only a provider-resolved candidate is eligible for an automatic map save', () => {
  const resolved = shanghaiLocalUseCollection.candidates.filter((candidate) => candidate.resolutionState === 'resolved');
  const reviewRequired = shanghaiLocalUseCollection.candidates.filter((candidate) => candidate.resolutionState === 'probable');

  assert.deepEqual(resolved.map((candidate) => candidate.id), ['fuxing-island-park-local-use']);
  assert.equal(reviewRequired.length, 3);
  assert.ok(resolved[0].providerLinks.amap.includes('/place/'));
  assert.ok(resolved[0].providerLinks.apple.includes('/place'));
  assert.ok(reviewRequired.every((candidate) => /review/i.test(candidate.resolutionNote)));
});

test('the published collection keeps research candidates separate from safe pins', () => {
  const summary = summarizeShanghaiLocalUse();
  const savedCollectionPayload = {
    candidateCount: summary.candidateCount,
    placeCount: summary.resolvedCount,
    safePlaceCount: summary.resolvedCount,
  };

  assert.deepEqual(savedCollectionPayload, {
    candidateCount: 4,
    placeCount: 1,
    safePlaceCount: 1,
  });
});

test('the city collection save payload carries only map-ready local pins into Profile', async () => {
  const [cityPage, curatedIndex, profilePage, mapComponent, mapImportPage, discoverPage] = await Promise.all([
    readFile(new URL('../src/pages/curated/[owner]/[collection]/[city].astro', import.meta.url), 'utf8'),
    readFile(new URL('../src/pages/curated/index.astro', import.meta.url), 'utf8'),
    readFile(new URL('../src/pages/profile.astro', import.meta.url), 'utf8'),
    readFile(new URL('../src/components/CuratedCollectionMap.astro', import.meta.url), 'utf8'),
    readFile(new URL('../src/pages/map-import.astro', import.meta.url), 'utf8'),
    readFile(new URL('../src/pages/discover.astro', import.meta.url), 'utf8'),
  ]);
  const baseLayout = await readFile(new URL('../src/layouts/Base.astro', import.meta.url), 'utf8');

  assert.match(cityPage, /const saveablePlaces = isLocalResearch[\s\S]+resolutionState === 'resolved'/);
  assert.match(cityPage, /places: saveablePlaces\.map/);
  assert.match(cityPage, /providerLinks: place\.providerLinks/);
  assert.match(cityPage, /originalCue: place\.originalCue/);
  assert.match(cityPage, /cueMeaning: place\.cueMeaning/);
  assert.match(cityPage, /Save \$\{resolvedCount\} map-ready pin/);
  assert.match(cityPage, /Profile saves only the provider-resolved pin/);
  assert.match(cityPage, /save the map-ready local pin to your profile/);
  assert.match(cityPage, /Saved ' \+ \(payload\.safePlaceCount \|\| payload\.placeCount \|\| 0\) \+ ' map-ready pin to Profile/);
  assert.match(cityPage, /stayed review-first/);
  assert.match(cityPage, /Local evidence rubric/);
  assert.match(cityPage, /“Locals use it” has to be graded\./);
  assert.match(cityPage, /Provider check is separate\./);
  assert.match(cityPage, /resolvedCount\} of \{places\.length\} candidates is currently map-ready/);
  assert.match(cityPage, /Direct resident testimony/);
  assert.match(cityPage, /Corroborated local-use signal/);
  assert.match(cityPage, /Community-program proxy/);
  assert.match(cityPage, /UGC intake/);
  assert.match(cityPage, /Review packet only/);
  assert.match(cityPage, /Found a Chinese post locals actually use\?/);
  assert.match(cityPage, /const localContributionHref = `\/map-import\/\?contributionCity=\$\{encodeURIComponent\(meta\.city\)\}&contributionLanguage=Chinese&contributionPlatform=xiaohongshu&contributionKind=place#contribute`/);
  assert.match(cityPage, /href=\{localContributionHref\}/);
  assert.match(cityPage, /Prepare local evidence/);
  assert.match(mapImportPage, /id="contribute"/);
  assert.match(mapImportPage, /window\.location\.hash === '#contribute'[\s\S]+contributionDetails\.open = true/);
  assert.match(mapImportPage, /function applyContributionPrefill\(params\)/);
  assert.match(mapImportPage, /allowedPlatforms = new Set\(\['xiaohongshu', 'dianping'/);
  assert.match(mapImportPage, /contributionForm\.elements\.namedItem\(name\)/);
  assert.match(mapImportPage, /Run Chinese local sample/);
  assert.match(mapImportPage, /xiaohongshu-yangpu/);
  assert.match(mapImportPage, /Green Hill \/ 绿之丘/);
  assert.match(mapImportPage, /Fuxing Island Park \/ 复兴岛公园/);
  assert.match(mapImportPage, /source-derived candidates, not provider-verified pins/);
  assert.match(mapImportPage, /Structured source line · verify provider/);
  assert.match(mapImportPage, /Known name match · verify provider/);
  assert.match(mapImportPage, /Started a scoped local-source review packet/);
  assert.match(mapImportPage, /What local-use signal does the source show\?/);
  assert.match(mapImportPage, /localUseSignal: formData\.get\('localUseSignal'\)/);
  assert.match(mapImportPage, /Local-use signal:/);
  assert.match(mapImportPage, /data-contribution-stage-list/);
  assert.match(mapImportPage, /Local grid review/);
  assert.match(mapImportPage, /data-contribution-grid-review/);
  assert.match(mapImportPage, /localKnowledgeGridReview\(submission\)/);
  assert.match(mapImportPage, /localKnowledgeReviewStages\(submission\)/);
  assert.match(mapImportPage, /UGC evidence packet/);
  assert.match(mapImportPage, /Map-ready pin/);
  assert.match(mapImportPage, /View in Profile/);
  assert.match(cityPage, /Evidence ledger/);
  assert.match(cityPage, /Original-language cue/);
  assert.match(cityPage, /Trip role:/);
  assert.match(cityPage, /Next action:/);
  assert.match(cityPage, /place\.tripRole/);
  assert.match(cityPage, /place\.travelerAction/);
  assert.match(cityPage, /place\.originalCue/);
  assert.match(cityPage, /place\.cueMeaning/);
  assert.match(cityPage, /linkedCandidates: linkedCandidates\.map/);
  assert.match(cityPage, /Follow this evidence to the map/);
  assert.match(cityPage, /href=\{`#\$\{candidate\.id\}`\}/);
  assert.match(cityPage, /candidate\.resolutionState === 'resolved' \? 'map-ready' : 'needs review'/);
  assert.match(cityPage, /id=\{place\.id\}/);
  assert.match(cityPage, /scroll-mt-24/);
  assert.match(cityPage, /Retrieved \{note\.retrievedAt\}/);
  assert.match(cityPage, /\(note\.sources \?\? \[\]\)\.map/);
  assert.match(curatedIndex, /const collectPayloads = Object\.fromEntries/);
  assert.match(curatedIndex, /type: isLocalResearch \? 'local-research' : 'curated'/);
  assert.match(curatedIndex, /places: saveablePlaces\.map/);
  assert.match(curatedIndex, /collectPayloads\[button\.dataset\.curatedCollect\]/);
  assert.match(profilePage, /map-ready pin/);
  assert.match(profilePage, /Open saved AMap pin/);
  assert.match(profilePage, /Open saved Apple pin/);
  assert.match(profilePage, /Why this pin survived review/);
  assert.match(profilePage, /Trip role:/);
  assert.match(profilePage, /Next action:/);
  assert.match(profilePage, /firstPlace\.tripRole/);
  assert.match(profilePage, /firstPlace\.travelerAction/);
  assert.match(profilePage, /firstPlace\.originalCue/);
  assert.match(profilePage, /firstPlace\.cueMeaning/);
  assert.match(profilePage, /reviewLeadCount = Math\.max/);
  assert.match(profilePage, /Review ' \+ reviewLeadCount \+ ' unresolved local lead/);
  assert.match(profilePage, /evidenceHref = \(collection\.href \|\| '\/curated\/'\) \+ \(isLocalResearch \? '#source-notes-heading' : ''\)/);
  assert.match(profilePage, /Local evidence packets/);
  assert.match(profilePage, /ctme-local-knowledge-contributions-v1/);
  assert.match(profilePage, /function renderLocalEvidence\(packets\)/);
  assert.match(profilePage, /localKnowledgeGridReview\(packet\)/);
  assert.match(profilePage, /gridReview\.verdict/);
  assert.match(profilePage, /Local grid review/);
  assert.match(profilePage, /localKnowledgeReviewStages\(packet\)/);
  assert.match(profilePage, /stageCopy/);
  assert.match(profilePage, /localReviewGridHref\(packet\)/);
  assert.match(profilePage, /Compare with reviewed local grid/);
  assert.match(profilePage, /Local-use signal:/);
  assert.match(profilePage, /function localUseSignalLabel\(value\)/);
  assert.match(profilePage, /what-yangpu-residents-use-on-a-slow-day\/shanghai\/#source-notes-heading/);
  assert.match(profilePage, /Provider match pending/);
  assert.match(profilePage, /Saved on this device only\. It is not submitted until you send it for review\./);
  assert.match(profilePage, /function formatLocalEvidencePacket\(packet\)/);
  assert.match(profilePage, /Send for review/);
  assert.match(profilePage, /mailto:hello@chinatravelmadeeasy\.com/);
  assert.match(profilePage, /translation, provider resolution, duplicate review, and editorial approval/);
  assert.match(profilePage, /Add another source like this/);
  assert.match(profilePage, /Open original source/);
  assert.match(profilePage, /Open local map/);
  assert.match(baseLayout, /function isLocalPrototypeHost\(\)/);
  assert.match(baseLayout, /\['localhost', '127\.0\.0\.1', '::1'\]\.includes\(window\.location\.hostname\)/);
  assert.match(baseLayout, /authProvider: 'localhost-preview'/);
  assert.match(baseLayout, /production still uses the email link/);
  assert.match(discoverPage, /const localGuideContributionHref = '\/map-import\/\?contributionCity=Shanghai&contributionLanguage=Chinese&contributionPlatform=xiaohongshu&contributionKind=place#contribute'/);
  assert.match(discoverPage, /const localGuideEvidenceHref = `\$\{localGuideHref\}#source-notes-heading`/);
  assert.match(discoverPage, /Add Chinese source/);
  assert.match(discoverPage, /Try the local-to-map loop/);
  assert.match(discoverPage, /Start with what Shanghai locals use, then save only the pin that survives review/);
  assert.match(discoverPage, /Open evidence ledger/);
  assert.match(discoverPage, /Save reviewed pin/);
  assert.match(discoverPage, /Add it as a UGC review packet first/);
  assert.match(discoverPage, /local wording and provider identity are checked/);
  assert.match(discoverPage, /From Chinese source to map-ready pin/);
  assert.match(discoverPage, /const localMfpStatus = \[/);
  assert.match(discoverPage, /MFP status/);
  assert.match(discoverPage, /What is actually functional today\?/);
  assert.match(discoverPage, /Reviewed Chinese local grid/);
  assert.match(discoverPage, /UGC review packets/);
  assert.match(discoverPage, /Map-ready save/);
  assert.match(discoverPage, /Live Chinese-platform retrieval/);
  assert.match(discoverPage, /Production provider resolver/);
  assert.match(discoverPage, /Not live yet/);
  assert.match(discoverPage, /Chinese local source/);
  assert.match(discoverPage, /Evidence-graded candidate/);
  assert.match(discoverPage, /Original cue:/);
  assert.match(discoverPage, /note\.originalCue/);
  assert.match(discoverPage, /review leads stay visible/);
  assert.match(discoverPage, /scoped review packet/);
  assert.match(mapComponent, /<a[\s\S]+href=\{`#\$\{place\.id\}`\}/);
  assert.match(mapComponent, /aria-label=\{`Open \$\{place\.name\} candidate details/);
  assert.match(mapComponent, /data-resolution=\{isLocalResearch \? cell\.resolutionState : undefined\}/);
  assert.match(mapComponent, /mapReadyCount.*map-ready/s);
  assert.match(mapComponent, /reviewCount.*needs review/s);
  assert.match(mapComponent, /data-local-grid-place/);
  assert.match(mapComponent, /Local candidate resolution grid/);
  assert.match(mapComponent, /Local candidate grid/);
  assert.match(mapComponent, /place\.localName/);
  assert.match(mapComponent, /Save eligible/);
  assert.match(mapComponent, /Provider review first/);
});

test('direct resident testimony is not inferred from official or community-program sources', () => {
  const residentDirect = shanghaiLocalUseCollection.candidates.filter((candidate) => candidate.evidenceGrade === 'resident-direct');
  assert.deepEqual(residentDirect.map((candidate) => candidate.id), ['green-hill-local-use']);
  assert.ok(residentDirect[0].sources.some((source) => source.type === 'resident-reporting'));
  assert.ok(shanghaiLocalUseCollection.candidates
    .filter((candidate) => candidate.evidenceGrade !== 'resident-direct')
    .every((candidate) => !candidate.evidenceLabel.toLowerCase().includes('direct resident')));
});

test('the local UGC MFP acceptance record states the proven and unproven boundaries', async () => {
  const [acceptanceDoc, readme, stories] = await Promise.all([
    readFile(new URL('../docs/local-ugc-mfp-acceptance-2026-07-18.md', import.meta.url), 'utf8'),
    readFile(new URL('../README.md', import.meta.url), 'utf8'),
    readFile(new URL('../docs/product-user-stories.md', import.meta.url), 'utf8'),
  ]);

  assert.match(acceptanceDoc, /static\/manual local Chinese evidence/);
  assert.match(acceptanceDoc, /static\/manual local Chinese evidence → evidence-graded guide candidates → one provider-resolved saved pin/);
  assert.match(acceptanceDoc, /UGC enters as a review packet only/);
  assert.match(acceptanceDoc, /Local evidence becomes a traveler decision/);
  assert.match(acceptanceDoc, /Trip role/);
  assert.match(acceptanceDoc, /Next action/);
  assert.match(acceptanceDoc, /UGC intake grades localness explicitly/);
  assert.match(acceptanceDoc, /UGC packets enter the same local-grid rubric/);
  assert.match(acceptanceDoc, /source evidence, local-use fit, provider identity, and traveler-decision gates/);
  assert.match(acceptanceDoc, /local-use signal/);
  assert.match(acceptanceDoc, /UGC intake persists into the traveler workspace/);
  assert.match(acceptanceDoc, /A clean rendered browser can prepare a Xiaohongshu-style packet/);
  assert.match(acceptanceDoc, /Compare with reviewed local grid/);
  assert.match(acceptanceDoc, /Live Xiaohongshu, Dianping, or Douyin retrieval/);
  assert.match(acceptanceDoc, /Production AMap POI API and Apple Maps Server resolution/);
  assert.match(readme, /docs\/local-ugc-mfp-acceptance-2026-07-18\.md/);
  assert.match(readme, /only the one provider-resolved pin can be saved to Profile/);
  assert.match(stories, /As a traveler using the Chinese local-source MFP/);
  assert.match(stories, /prepare it as a UGC review packet, classify the local-use signal behind the lead/);
  assert.match(stories, /The Chinese local-source MFP is static\/manual/);
});
