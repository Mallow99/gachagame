import assert from 'node:assert/strict';
import test from 'node:test';

import {
  content,
  createContentIndex,
  getAssist,
  getEncounter,
  getEnemy,
  getPlayerUnits,
  getPowerUp,
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
  assert.deepEqual(getEncounter('smb1-01').referenceTeams[0].unitIds, ['classic-mario']);
  assert.equal(getEncounter('smb1-03').referenceTeams[0].powerupIds[0], 'super-mushroom');
});

test('player-facing unit queries exclude every development fixture', () => {
  const playerIds = getPlayerUnits().map((unit) => unit.id);
  assert.ok(playerIds.includes('adventure-kirby'));
  assert.ok(playerIds.includes('bowser'));
  assert.deepEqual(
    getPlayerUnits().filter((unit) => unit.acquisition.type === 'hub-starter').map((unit) => unit.id),
    ['classic-mario','adventure-kirby'],
  );
  assert.equal(getUnit('walter'), undefined);
  assert.equal(getUnit('sahur'), undefined);
  assert.equal(getUnit('bob'), undefined);
  assert.equal(getDevFixture('walter').name, 'Walter White');
});

test('the opening Area funds ten welcome pulls and every Camp stays renewable', () => {
  const encounters = Array.from({ length: 5 }, (_, index) => getEncounter(`smb1-0${index + 1}`));
  const starlight = encounters.flatMap((encounter) => encounter.rewards.firstClear)
    .filter((reward) => reward.type === 'starlight')
    .reduce((total, reward) => total + reward.amount, 0);
  assert.equal(starlight, 1000);
  assert.ok(encounters.every((encounter) => encounter.rewards.repeat.some((reward) => reward.type === 'patrol-mark' && reward.amount === 1)));
});

test('Power-Ups and Assists are separate validated equipment namespaces', () => {
  const flower = getPowerUp('fire-flower');
  const eGadd = getAssist('e-gadd-field-notes');
  assert.equal(flower.grantedTrait, 'fire');
  assert.equal(flower.statLean.multiplier, 1.11);
  assert.equal(eGadd.familyId, 'e-gadd');
  assert.equal(eGadd.proficiencyPolicyId, 'assist-five-rank-v1');
  assert.ok(getPlayerUnits().every((unit) => !Object.hasOwn(unit, 'powerupCompatibility')));

  const supplyPages = content.records.banners.filter((banner) => banner.channel === 'supply');
  for(const sagaId of ['mario','kirby'])assert.deepEqual(supplyPages.filter(b=>b.sagaId===sagaId).map(b=>b.poolKind),['powerup','assist']);
  assert.ok(supplyPages.every((banner) => banner.pityPolicyId === 'supply-standard-v1'));
  assert.equal(content.banners.get('smb1-overworld-fighter').unlock.encounterId, 'smb1-01');
});

test('every coded ultimate declares and clears its rarity value floor', () => {
  const floors = { R: 4, SR: 5.5, SSR: 7, UR: 10 };
  for (const unit of getPlayerUnits()) {
    assert.ok(
      unit.ultimate.declaredBasicActionEquivalents >= floors[unit.rarity],
      `${unit.id} ultimate is below its ${unit.rarity} floor`,
    );
  }
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

test('a Supply page cannot mix Power-Ups and Assists', () => {
  const records = cloneRecords(content.records);
  records.banners.find((banner) => banner.poolKind === 'powerup').pool.push({
    itemId: 'e-gadd-field-notes', itemType: 'assist', rarity: 'SR', weight: 1,
  });
  assert.throws(
    () => validateContent(createContentIndex(records)),
    /mixes assist into powerup results/,
  );
});

function cloneRecords(records) {
  return structuredClone(records);
}
