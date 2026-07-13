import { strict as assert } from 'node:assert';
import test from 'node:test';
import {
  createSharedWorkspace,
  decodeSharedWorkspace,
  encodeSharedWorkspace,
  findWorkspaceConflicts,
  sequenceKeptPlaces,
} from '../src/utils/sharedLocationTask.js';

const source = {
  url: 'https://www.instagram.com/reel/ChinaTrip/',
  platform: 'Instagram',
  text: 'Lunch at 佳家汤包, then walk to 外滩.',
};

test('shared task links retain bilingual identities, evidence, decisions, reasons, and constraints', () => {
  const workspace = createSharedWorkspace({
    title: '上海 friends day',
    source,
    constraints: { base: "Jing'an", time: 'Tuesday afternoon', pace: 'relaxed', mustDo: 'Soup dumplings', needs: 'Vegetarian option' },
    places: [
      { name: 'Jia Jia Tang Bao', localName: '佳家汤包', city: 'Shanghai', confidence: 'known place', note: 'Lunch at 佳家汤包', decision: 'keep', decisionReason: 'Must-do' },
      { name: 'The Bund', localName: '外滩', city: 'Shanghai', confidence: 'known place', note: 'walk to 外滩', decision: 'maybe', decisionReason: 'Weather dependent' },
    ],
  });
  const reopened = decodeSharedWorkspace(encodeSharedWorkspace(workspace));
  assert.deepEqual(reopened, workspace);
});

test('invalid or oversized task payloads are rejected', () => {
  assert.equal(decodeSharedWorkspace('not-valid-base64'), null);
  assert.equal(decodeSharedWorkspace('x'.repeat(16001)), null);
});

test('conflicts expose missing identity, weak matches, and multi-city day plans', () => {
  const workspace = createSharedWorkspace({
    places: [
      { name: 'The Bund', localName: '外滩', city: 'Shanghai', confidence: 'known place', decision: 'keep' },
      { name: 'Some Tea House', city: 'Chengdu', confidence: 'text match', decision: 'maybe' },
    ],
  });
  const messages = findWorkspaceConflicts(workspace).map((conflict) => conflict.message).join(' ');
  assert.match(messages, /spans 2 cities/);
  assert.match(messages, /Chinese name is missing/);
  assert.match(messages, /heuristic text match/);
});

test('route sequence includes kept places only and splits cities', () => {
  const groups = sequenceKeptPlaces(createSharedWorkspace({
    places: [
      { name: 'A', city: 'Shanghai', decision: 'keep' },
      { name: 'B', city: 'Shanghai', decision: 'drop' },
      { name: 'C', city: 'Chengdu', decision: 'keep' },
    ],
  }));
  assert.deepEqual(groups.map((group) => [group.city, group.places.map((place) => place.name)]), [
    ['Shanghai', ['A']],
    ['Chengdu', ['C']],
  ]);
});
