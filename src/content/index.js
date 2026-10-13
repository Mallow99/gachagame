import { BANNERS } from './banners.js';
import { ENEMIES } from './enemies.js';
import { SMB1_ENCOUNTERS } from './encounters/smb1.js';
import { UNITS } from './units.js';
import { AREAS, SAGAS, WORLDS } from './worlds.js';

export const CONTENT_VERSION = 1;

const DEFAULT_RECORDS = {
  units: UNITS,
  enemies: ENEMIES,
  sagas: SAGAS,
  areas: AREAS,
  worlds: WORLDS,
  encounters: SMB1_ENCOUNTERS,
  banners: BANNERS,
};

export function createContentIndex(records = DEFAULT_RECORDS) {
  return {
    units: index(records.units),
    enemies: index(records.enemies),
    powerups: new Map(),
    assists: new Map(),
    sagas: index(records.sagas),
    areas: index(records.areas),
    worlds: index(records.worlds),
    encounters: index(records.encounters),
    banners: index(records.banners),
    missions: new Map(),
    sorties: new Map(),
    records,
  };
}

export const content = createContentIndex();

export const getUnit = (id) => content.units.get(id);
export const getEnemy = (id) => content.enemies.get(id);
export const getWorld = (id) => content.worlds.get(id);
export const getEncounter = (id) => content.encounters.get(id);

export function getPlayerUnits() {
  return [...content.units.values()].filter((unit) => unit.productionStatus !== 'dev');
}

export class ContentValidationError extends Error {
  constructor(errors) {
    super(`Content validation failed:\n${errors.map((error) => `- ${error}`).join('\n')}`);
    this.name = 'ContentValidationError';
    this.errors = errors;
  }
}

export function validateContent(candidate = content) {
  const errors = [];
  const warnings = [];
  const records = candidate.records || DEFAULT_RECORDS;
  const allowedBehaviors = new Set(['strike', 'shot', 'combo', 'charge', 'stomp', 'lob', 'beam']);
  const allowedRarities = new Set(['R', 'SR', 'SSR', 'UR']);
  const allowedRoles = new Set(['vanguard', 'bruiser', 'striker', 'artillery', 'controller', 'support']);
  const allowedTargets = new Set(['nearest', 'frontmost', 'backmost', 'lowest-hp', 'lowest-hp-ally', 'cluster', 'party']);
  const allowedLengths = new Set([5, 10, 15, 20, 25]);
  const allowedProductionStates = new Set(['dev', 'provisional', 'approved', 'slice', 'planned', 'backlog']);

  for (const [namespace, items] of Object.entries(records)) {
    const seen = new Set();
    for (const item of items || []) {
      if (!item?.id) errors.push(`${namespace} contains a record without an id`);
      else if (seen.has(item.id)) errors.push(`${namespace} contains duplicate id "${item.id}"`);
      else seen.add(item.id);
    }
  }

  for (const unit of candidate.units.values()) {
    if (!unit.familyId) errors.push(`unit ${unit.id}.familyId is required`);
    if (!candidate.sagas.has(unit.sagaId)) errors.push(`unit ${unit.id}.sagaId references missing saga "${unit.sagaId}"`);
    if (!candidate.worlds.has(unit.sourceGameId)) errors.push(`unit ${unit.id}.sourceGameId references missing world "${unit.sourceGameId}"`);
    if (!allowedRarities.has(unit.rarity)) errors.push(`unit ${unit.id}.rarity is illegal: "${unit.rarity}"`);
    if (!allowedRoles.has(unit.role)) errors.push(`unit ${unit.id}.role is illegal: "${unit.role}"`);
    validateAbility(unit.basic, `unit ${unit.id}.basic`);
    validateAbility(unit.skill, `unit ${unit.id}.skill`);
    validateAbility(unit.ultimate, `unit ${unit.id}.ultimate`);
    validateStats(unit.baseStats, `unit ${unit.id}.baseStats`);
    validateProductionState(unit, `unit ${unit.id}`);
    if (unit.productionStatus === 'dev') errors.push(`production unit ${unit.id} is marked dev`);
    if (unit.productionStatus === 'provisional') warnings.push(`unit ${unit.id} uses provisional art`);
  }

  for (const enemy of candidate.enemies.values()) {
    if (!candidate.worlds.has(enemy.sourceGameId)) errors.push(`enemy ${enemy.id}.sourceGameId references missing world "${enemy.sourceGameId}"`);
    validateStats(enemy.baseStats, `enemy ${enemy.id}.baseStats`);
    for (const [attackIndex, attack] of enemy.attacks.entries()) validateAbility(attack, `enemy ${enemy.id}.attacks[${attackIndex}]`);
    for (const [attackIndex, attack] of (enemy.elite?.attacks || []).entries()) validateAbility(attack, `enemy ${enemy.id}.elite.attacks[${attackIndex}]`);
    for (const [variantIndex, variant] of (enemy.variants || []).entries()) {
      for (const [attackIndex, attack] of (variant.attacks || []).entries()) validateAbility(attack, `enemy ${enemy.id}.variants[${variantIndex}].attacks[${attackIndex}]`);
    }
    validateProductionState(enemy, `enemy ${enemy.id}`);
    if (enemy.productionStatus === 'dev') errors.push(`production enemy ${enemy.id} is marked dev`);
  }

  for (const saga of candidate.sagas.values()) {
    validateProductionState(saga, `saga ${saga.id}`);
    for (const [i, worldId] of saga.worldIds.entries()) requireRef(candidate.worlds, worldId, `saga ${saga.id}.worldIds[${i}]`, 'world');
  }

  for (const world of candidate.worlds.values()) {
    validateProductionState(world, `world ${world.id}`);
    requireRef(candidate.sagas, world.sagaId, `world ${world.id}.sagaId`, 'saga');
    if (!allowedLengths.has(world.length)) errors.push(`world ${world.id}.length must be 5, 10, 15, 20 or 25`);
    for (const [i, areaId] of world.areaIds.entries()) requireRef(candidate.areas, areaId, `world ${world.id}.areaIds[${i}]`, 'area');
    for (const [i, bannerId] of world.bannerIds.entries()) requireRef(candidate.banners, bannerId, `world ${world.id}.bannerIds[${i}]`, 'banner');
    for (const [i, encounterId] of world.implementedEncounterIds.entries()) requireRef(candidate.encounters, encounterId, `world ${world.id}.implementedEncounterIds[${i}]`, 'encounter');
  }

  for (const area of candidate.areas.values()) {
    validateProductionState(area, `area ${area.id}`);
    requireRef(candidate.worlds, area.worldId, `area ${area.id}.worldId`, 'world');
    const [first, last] = area.stageRange;
    if (last - first !== 4) errors.push(`area ${area.id}.stageRange must contain exactly five stages`);
    for (const [i, encounterId] of area.encounterIds.entries()) requireRef(candidate.encounters, encounterId, `area ${area.id}.encounterIds[${i}]`, 'encounter');
    if (area.productionStatus === 'slice' && area.encounterIds.length !== 5) errors.push(`area ${area.id}.encounterIds must contain five implemented stages`);
  }

  const stagesByWorld = new Map();
  for (const encounter of candidate.encounters.values()) {
    validateProductionState(encounter, `encounter ${encounter.id}`);
    requireRef(candidate.worlds, encounter.worldId, `encounter ${encounter.id}.worldId`, 'world');
    requireRef(candidate.areas, encounter.areaId, `encounter ${encounter.id}.areaId`, 'area');
    const stageKey = `${encounter.worldId}:${encounter.localStage}`;
    if (stagesByWorld.has(stageKey)) errors.push(`encounter ${encounter.id}.localStage duplicates ${stagesByWorld.get(stageKey)}`);
    else stagesByWorld.set(stageKey, encounter.id);
    if (encounter.waves.length < 1 || encounter.waves.length > 8) errors.push(`encounter ${encounter.id}.waves must contain 1–8 waves`);
    for (const [waveIndex, waveRecord] of encounter.waves.entries()) {
      const wavePath = `encounter ${encounter.id}.waves[${waveIndex}]`;
      if (!waveRecord.spawns.length) errors.push(`${wavePath}.spawns must not be empty`);
      if (waveRecord.clearRule !== 'defeat-all') errors.push(`${wavePath}.clearRule is unknown: "${waveRecord.clearRule}"`);
      for (const [spawnIndex, spawnRecord] of waveRecord.spawns.entries()) {
        requireRef(candidate.enemies, spawnRecord.enemyId, `${wavePath}.spawns[${spawnIndex}].enemyId`, 'enemy');
        if (!Number.isInteger(spawnRecord.count) || spawnRecord.count < 1) errors.push(`${wavePath}.spawns[${spawnIndex}].count must be a positive integer`);
        const enemy = candidate.enemies.get(spawnRecord.enemyId);
        if (enemy && spawnRecord.variantId) {
          const variantIds = new Set([enemy.elite?.id, ...(enemy.variants || []).map((variant) => variant.id)].filter(Boolean));
          if (!variantIds.has(spawnRecord.variantId)) errors.push(`${wavePath}.spawns[${spawnIndex}].variantId references missing variant "${spawnRecord.variantId}" on enemy "${spawnRecord.enemyId}"`);
        }
      }
    }
    for (const [teamIndex, team] of encounter.referenceTeams.entries()) {
      for (const [unitIndex, unitId] of team.unitIds.entries()) requireRef(candidate.units, unitId, `encounter ${encounter.id}.referenceTeams[${teamIndex}].unitIds[${unitIndex}]`, 'unit');
    }
    validateRewards(encounter.rewards.firstClear, `encounter ${encounter.id}.rewards.firstClear`);
    validateRewards(encounter.rewards.repeat, `encounter ${encounter.id}.rewards.repeat`);
    if (encounter.boss && (!encounter.boss.staggerMax || !encounter.boss.phases?.length)) errors.push(`encounter ${encounter.id}.boss requires staggerMax and phases`);
  }

  for (const banner of candidate.banners.values()) {
    validateProductionState(banner, `banner ${banner.id}`);
    if (banner.unlock?.encounterId) requireRef(candidate.encounters, banner.unlock.encounterId, `banner ${banner.id}.unlock.encounterId`, 'encounter');
    for (const [i, entry] of banner.pool.entries()) {
      if (banner.channel === 'fighter') requireRef(candidate.units, entry.itemId, `banner ${banner.id}.pool[${i}].itemId`, 'unit');
    }
    if (banner.archiveBannerId === banner.id) errors.push(`banner ${banner.id}.archiveBannerId points to itself`);
  }

  if (errors.length) throw new ContentValidationError(errors);
  return { warnings };

  function requireRef(map, id, path, kind) {
    if (!map.has(id)) errors.push(`${path} references missing ${kind} "${id}"`);
  }

  function validateAbility(ability, path) {
    if (!ability) return;
    if (!allowedBehaviors.has(ability.behavior)) errors.push(`${path}.behavior is illegal: "${ability.behavior}"`);
    if (ability.targetRule && !allowedTargets.has(ability.targetRule)) errors.push(`${path}.targetRule is illegal: "${ability.targetRule}"`);
    for (const key of ['coefficient', 'intervalSeconds', 'cooldownSeconds', 'range']) {
      if (ability[key] !== undefined && ability[key] < 0) errors.push(`${path}.${key} must not be negative`);
    }
  }

  function validateStats(stats, path) {
    for (const [key, value] of Object.entries(stats || {})) {
      if (typeof value !== 'number' || value < 0) errors.push(`${path}.${key} must be a non-negative number`);
    }
  }

  function validateRewards(rewards, path) {
    for (const [i, reward] of rewards.entries()) {
      if (typeof reward.amount === 'number' && reward.amount < 0) errors.push(`${path}[${i}].amount must not be negative`);
    }
  }

  function validateProductionState(record, path) {
    if (!allowedProductionStates.has(record.productionStatus)) errors.push(`${path}.productionStatus is illegal: "${record.productionStatus}"`);
  }
}

function index(records = []) {
  return new Map(records.map((record) => [record.id, record]));
}
