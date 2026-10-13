import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import test from 'node:test';

import { parseSaveV3, SAVE_VERSION, serializeSaveV3 } from '../src/save-v3.js';

const fixtureUrl = new URL('./fixtures/save-v3.json', import.meta.url);

test('the captured SaveV3 fixture parses without browser globals', async () => {
  const raw = await readFile(fixtureUrl, 'utf8');
  const save = parseSaveV3(raw);
  assert.equal(save.saveVersion, SAVE_VERSION);
  assert.equal(save.gems, 2375);
  assert.deepEqual(save.party, ['mario', 'walter', 'sahur', 'vex']);
  assert.equal(save.owned.mario.asc, 2);
  assert.equal(save.pitySsr, 31);
});

test('SaveV3 serialization round-trips currencies, ownership, party and pity', async () => {
  const fixture = parseSaveV3(await readFile(fixtureUrl, 'utf8'));
  const roundTrip = parseSaveV3(serializeSaveV3(fixture, fixture.lastSeen));
  assert.deepEqual(roundTrip, fixture);
});

test('invalid or missing SaveV3 input is ignored', () => {
  assert.equal(parseSaveV3(null), null);
  assert.equal(parseSaveV3('not-json'), null);
  assert.equal(parseSaveV3('[]'), null);
});
