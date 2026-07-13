import { strict as assert } from 'node:assert';
import test from 'node:test';
import {
  CTME_CORRECTIONS_KEY,
  CTME_EXPERIENCES_KEY,
  getPlaceCorrections,
  getPlaceExperiences,
  savePlaceCorrection,
  savePlaceExperience,
} from '../src/utils/communityMap.js';

const values = new Map();
globalThis.localStorage = {
  getItem(key) { return values.has(key) ? values.get(key) : null; },
  setItem(key, value) { values.set(key, String(value)); },
  removeItem(key) { values.delete(key); },
  clear() { values.clear(); },
};

test.beforeEach(() => values.clear());

test('visited evidence is idempotent across callback retries', () => {
  const first = savePlaceExperience({
    clientRequestId: 'visit-1',
    placeId: 'tst-east-promenade',
    verdict: 'worth_it',
    note: 'Go before the afternoon heat.',
  });
  const retried = savePlaceExperience({
    clientRequestId: 'visit-1',
    placeId: 'tst-east-promenade',
    verdict: 'worth_it',
    note: 'Go early and verify event barriers.',
  });

  assert.equal(first.id, retried.id);
  assert.equal(JSON.parse(localStorage.getItem(CTME_EXPERIENCES_KEY)).length, 1);
  assert.equal(getPlaceExperiences('tst-east-promenade')[0].note, 'Go early and verify event barriers.');
  assert.deepEqual(getPlaceExperiences('another-place'), []);
});

test('place corrections remain attached to one place and retry without duplication', () => {
  savePlaceCorrection({
    clientRequestId: 'correction-1',
    placeId: 'tst-east-promenade',
    type: 'address',
    proposedValue: 'Use the current event entrance.',
  });
  savePlaceCorrection({
    clientRequestId: 'correction-1',
    placeId: 'tst-east-promenade',
    type: 'address',
    proposedValue: 'Use the organizer entrance for the current year.',
  });
  savePlaceCorrection({
    clientRequestId: 'correction-2',
    placeId: 'the-bund-shanghai',
    type: 'wrong_place',
    proposedValue: 'This is the east bank, not the Bund promenade.',
  });

  assert.equal(JSON.parse(localStorage.getItem(CTME_CORRECTIONS_KEY)).length, 2);
  assert.equal(getPlaceCorrections('tst-east-promenade').length, 1);
  assert.equal(getPlaceCorrections('tst-east-promenade')[0].proposedValue, 'Use the organizer entrance for the current year.');
});
