import { strict as assert } from 'node:assert';
import { readFile } from 'node:fs/promises';
import test from 'node:test';
import {
  shanghaiLocalUseCollection,
  summarizeShanghaiLocalUse,
  validateShanghaiLocalUseCandidate,
  validateShanghaiLocalUseSourceNote,
} from '../src/data/shanghaiLocalUse.js';
import {
  reviewedLocalUgcPackets,
  summarizeReviewedLocalUgcPackets,
  validateReviewedLocalUgcPacket,
} from '../src/data/reviewedLocalUgcPackets.js';

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
  assert.match(profilePage, /firstPlace\.sourceBoundary/);
  assert.match(profilePage, /UGC boundary:/);
  assert.match(profilePage, /firstPlace\.sourceEvidence/);
  assert.match(profilePage, /Source evidence:/);
  assert.match(profilePage, /firstPlace\.reviewedAt/);
  assert.match(profilePage, /provider checked/);
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
  assert.match(profilePage, /Account setup/);
  assert.match(profilePage, /Set up a map profile/);
  assert.match(profilePage, /My map workspace/);
  assert.match(profilePage, /Account email:/);
  assert.match(profilePage, /Local dogfood profile/);
  assert.match(profilePage, /Use a different email/);
  assert.match(profilePage, /Save only pins that survived local-grid review/);
  assert.match(profilePage, /AMap is the mainland handoff; Apple Maps remains the fallback/);
  assert.match(profilePage, /data-profile-map-ready-stat/);
  assert.match(profilePage, /data-profile-review-lead-stat/);
  assert.match(profilePage, /countProviderHandoffPins/);
  assert.match(profilePage, /countReviewFirstLeads/);
  assert.match(baseLayout, /function isLocalPrototypeHost\(\)/);
  assert.match(baseLayout, /\['localhost', '127\.0\.0\.1', '::1'\]\.includes\(window\.location\.hostname\)/);
  assert.match(baseLayout, /authProvider: 'localhost-preview'/);
  assert.match(baseLayout, /local dogfood profile saves in this browser only/);
  assert.match(baseLayout, /production still uses the email link/);
  assert.match(discoverPage, /const localGuideContributionHref = '\/map-import\/\?contributionCity=Shanghai&contributionLanguage=Chinese&contributionPlatform=xiaohongshu&contributionKind=place#contribute'/);
  assert.match(discoverPage, /const localGuideEvidenceHref = `\$\{localGuideHref\}#source-notes-heading`/);
  assert.match(discoverPage, /reviewedLocalUgcPackets/);
  assert.match(discoverPage, /summarizeReviewedLocalUgcPackets/);
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
  assert.match(discoverPage, /Reviewed UGC packet/);
  assert.match(discoverPage, /Seeded locally/);
  assert.match(discoverPage, /operator-reviewed Chinese UGC packet/);
  assert.match(discoverPage, /local-grid cells/);
  assert.match(discoverPage, /Local grid mapping/);
  assert.match(discoverPage, /UGC boundary/);
  assert.match(discoverPage, /Packet reviewed/);
  assert.match(discoverPage, /Provider checked/);
  assert.match(discoverPage, /packet\.sourceBoundary/);
  assert.match(discoverPage, /packet\.reviewedAt/);
  assert.match(discoverPage, /packet\.providerCheckedAt/);
  assert.match(discoverPage, /saveable cell/);
  assert.match(discoverPage, /review cell/);
  assert.match(discoverPage, /candidate\.gridCell\.sourceEvidence/);
  assert.match(discoverPage, /candidate\.gridCell\.localUseFit/);
  assert.match(discoverPage, /candidate\.gridCell\.providerIdentity/);
  assert.match(discoverPage, /candidate\.gridCell\.travelerDecision/);
  assert.match(discoverPage, /Not live platform retrieval/);
  assert.match(discoverPage, /Compare with reviewed grid/);
  assert.match(discoverPage, /Add similar UGC lead/);
  assert.match(discoverPage, /localUgcSavePayloads/);
  assert.match(discoverPage, /data-local-ugc-save/);
  assert.match(discoverPage, /Save UGC-mapped pin/);
  assert.match(discoverPage, /ctme-pending-reviewed-ugc-save/);
  assert.match(discoverPage, /ctme-local-knowledge-contributions-v1/);
  assert.match(discoverPage, /save the UGC-mapped local pin to your profile/);
  assert.match(discoverPage, /Saved ' \+ payload\.safePlaceCount \+ ' UGC-mapped pin to Profile/);
  assert.match(discoverPage, /Keep review note/);
  assert.match(discoverPage, /Kept review-only UGC note in Profile/);
  assert.match(discoverPage, /0 map-ready pins were saved/);
  assert.match(discoverPage, /createLocalKnowledgeSubmission/);
  assert.match(discoverPage, /reviewedPacketId/);
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

test('reviewed Chinese UGC packets are visible without claiming live platform retrieval', () => {
  const summary = summarizeReviewedLocalUgcPackets();
  assert.deepEqual(summary, {
    packetCount: 2,
    candidateCount: 4,
    resolvedCandidateCount: 1,
    gridCellCount: 4,
    livePlatformRetrievalCount: 0,
  });

  for (const packet of reviewedLocalUgcPackets) {
    const result = validateReviewedLocalUgcPacket(packet);
    assert.equal(result.valid, true, `${packet.id}: ${result.errors.join(', ')}`);
    assert.equal(packet.livePlatformRetrieval, false);
    assert.equal(packet.reviewedAt, '2026-07-18');
    assert.equal(packet.providerCheckedAt, '2026-07-18');
    assert.match(packet.sourceBoundary, /No live (Xiaohongshu|Douyin) retrieval/);
    assert.match(packet.originalCue, /[\u3400-\u9fff]/u);
    assert.match(packet.evidenceText, /[\u3400-\u9fff]/u);
    assert.ok(packet.reviewGates.some((gate) => gate.label === 'Provider identity'));
    assert.ok(packet.candidates.some((candidate) => candidate.resolutionState !== 'resolved'));
    assert.ok(packet.candidates.every((candidate) => candidate.gridCell.sourceEvidence && candidate.gridCell.localUseFit));
    assert.ok(packet.candidates.every((candidate) => candidate.gridCell.providerIdentity && candidate.gridCell.travelerDecision));
    const resolved = packet.candidates.find((candidate) => candidate.resolutionState === 'resolved');
    if (resolved) {
      assert.match(resolved.gridCell.providerIdentity, /Resolved/);
      assert.ok(resolved.providerLinks.amap.includes('/place/'));
      assert.ok(resolved.providerLinks.apple.includes('/place'));
    } else {
      assert.ok(packet.reviewGates.some((gate) => gate.state.includes('0 resolved')));
      assert.ok(packet.candidates.every((candidate) => !candidate.providerLinks));
    }
    assert.ok(packet.candidates
      .filter((candidate) => candidate.resolutionState !== 'resolved')
      .every((candidate) => /do not save|not safe|not a pin|context only/i.test(candidate.gridCell.travelerDecision + ' ' + candidate.gridCell.providerIdentity)));
    assert.ok(packet.candidates.filter((candidate) => candidate.resolutionState !== 'resolved').every((candidate) => candidate.providerLinks === undefined));
  }

  const caution = reviewedLocalUgcPackets.find((packet) => packet.id === 'yangpu-waterfront-rain-caution-seeded-packet');
  assert.ok(caution);
  assert.match(caution.title, /weather and return route/);
  assert.match(caution.originalCue, /下雨天风大/);
  assert.equal(caution.candidates.filter((candidate) => candidate.resolutionState === 'resolved').length, 0);
  assert.ok(caution.candidates.every((candidate) => /Do not save|not safe|not a pin|context only/i.test(candidate.gridCell.travelerDecision)));
});

test('the local UGC MFP acceptance record states the proven and unproven boundaries', async () => {
  const [acceptanceDoc, readme, stories] = await Promise.all([
    readFile(new URL('../docs/local-ugc-mfp-acceptance-2026-07-18.md', import.meta.url), 'utf8'),
    readFile(new URL('../README.md', import.meta.url), 'utf8'),
    readFile(new URL('../docs/product-user-stories.md', import.meta.url), 'utf8'),
  ]);

  assert.match(acceptanceDoc, /static\/manual local Chinese evidence/);
  assert.match(acceptanceDoc, /static\/manual local Chinese evidence \+ two seeded reviewed Chinese UGC packets → evidence-graded guide candidates → one provider-resolved saved pin/);
  assert.match(acceptanceDoc, /Reviewed UGC is discoverable before save/);
  assert.match(acceptanceDoc, /UGC save follows the grid decision/);
  assert.match(acceptanceDoc, /Review-only UGC insight can still be kept/);
  assert.match(acceptanceDoc, /review-only UGC note-to-Profile/);
  assert.match(acceptanceDoc, /UGC provenance remains visible after saving/);
  assert.match(acceptanceDoc, /Save UGC-mapped pin/);
  assert.match(acceptanceDoc, /reviewed UGC safe-pin save-to-Profile/);
  assert.match(acceptanceDoc, /Not live platform retrieval/);
  assert.match(acceptanceDoc, /A slow Yangpu riverfront day instead of a skyline checklist/);
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
  assert.match(acceptanceDoc, /npm run test:local-ugc-mfp/);
  assert.match(acceptanceDoc, /complete local MFP gate/);
  assert.match(acceptanceDoc, /npm run test:local-ugc-mfp:rendered/);
  assert.match(acceptanceDoc, /repeatable rendered acceptance gate/);
  assert.match(readme, /docs\/local-ugc-mfp-acceptance-2026-07-18\.md/);
  assert.match(readme, /one seeded reviewed Chinese UGC packet/);
  assert.match(readme, /only the one provider-resolved pin can be saved to Profile/);
  assert.match(stories, /As a traveler using the Chinese local-source MFP/);
  assert.match(stories, /prepare it as a UGC review packet, classify the local-use signal behind the lead/);
  assert.match(stories, /The Chinese local-source MFP is static\/manual/);
});
