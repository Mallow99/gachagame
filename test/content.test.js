import assert from 'node:assert/strict';
import test from 'node:test';

import {
  content,
  createContentIndex,
  getEncounter,
  getEnemy,
  getPlayerUnits,
  getUnit,
  getWorld,
  validateContent,
} from '../src/content/index.js';
import { getDevFixture } from '../src/content/dev-fixtures.js';

test('the first-slice content index validates and exposes stable lookups', () => {
  assert.doesNotThrow(() => validateContent());
  assert.equal(getUnit('classic-mario').familyId, 'mario');
  assert.equal(getEnemy('goomba').attacks[0].behavior, 'strike');
  assert.equal(getWorld('super-mario-bros-1985').length, 15);
  assert.equal(getEncounter('smb1-01').waves.length, 4);
});

test('player-facing unit queries exclude every development fixture', () => {
  const playerIds = getPlayerUnits().map((unit) => unit.id);
  assert.deepEqual(playerIds, ['classic-mario', 'classic-luigi', 'toad', 'princess-peach']);
  assert.equal(getUnit('walter'), undefined);
  assert.equal(getUnit('sahur'), undefined);
  assert.equal(getUnit('bob'), undefined);
  assert.equal(getDevFixture('walter').name, 'Walter White');
});

test('a broken enemy reference names the exact stage and field', () => {
  const records = cloneRecords(content.records);
  records.encounters[0].waves[2].spawns[0].enemyId = 'missing-enemy';
  const broken = createContentIndex(records);
  assert.throws(
    () => validateContent(broken),
    /encounter smb1-01\.waves\[2\]\.spawns\[0\]\.enemyId references missing enemy "missing-enemy"/,
  );
});

test('duplicate ids are rejected before a map can hide them', () => {
  const records = cloneRecords(content.records);
  records.units.push({ ...records.units[0] });
  assert.throws(() => validateContent(createContentIndex(records)), /units contains duplicate id "classic-mario"/);
});

function cloneRecords(records) {
  return structuredClone(records);
}
