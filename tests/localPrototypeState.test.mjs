import { strict as assert } from 'node:assert';
import test from 'node:test';
import { mergeSavedPinLists, splitPinListByCity } from '../src/utils/localPrototypeState.js';

test('multi-city uploads split into city lists with shared provenance', () => {
  const result = splitPinListByCity({
    id: 'upload:friends-food',
    name: 'Friends food list',
    places: [
      { name: 'A', city: 'Shanghai' },
      { name: 'B', city: 'Shanghai' },
      { name: 'C', city: 'Beijing' },
    ],
  });
  assert.equal(result.length, 2);
  assert.deepEqual(result.map((item) => item.city), ['Shanghai', 'Beijing']);
  assert.deepEqual(result.map((item) => item.places.length), [2, 1]);
  assert.equal(result.every((item) => item.sourceCollectionId === 'upload:friends-food'), true);
});

test('single-city uploads retain their original id', () => {
  const [result] = splitPinListByCity({
    id: 'upload:shanghai',
    name: 'Shanghai saves',
    places: [{ name: 'A', city: 'Shanghai' }],
  });
  assert.equal(result.id, 'upload:shanghai');
  assert.equal(result.name, 'Shanghai saves');
});

test('a callback retry replaces the same pending homepage save instead of duplicating it', () => {
  const first = splitPinListByCity({
    id: '6a3e9ac0-d4b4-40bb-ae49-e689716c439d',
    clientRequestId: '6a3e9ac0-d4b4-40bb-ae49-e689716c439d',
    name: 'Shanghai Museum',
    places: [{ name: 'Shanghai Museum', city: 'Shanghai' }],
  });
  const retried = splitPinListByCity({ ...first[0], savedAt: '2026-07-13T00:00:00.000Z' });
  const result = mergeSavedPinLists(first, retried);
  assert.equal(result.length, 1);
  assert.equal(result[0].id, '6a3e9ac0-d4b4-40bb-ae49-e689716c439d');
  assert.equal(result[0].savedAt, '2026-07-13T00:00:00.000Z');
});
