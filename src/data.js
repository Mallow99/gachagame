// Compatibility facade for the current prototype. New production content is
// indexed under src/content; old screens keep these imports until their
// individual migration tickets land.

export * from './config/balance.js';

import { WORLD_LENGTH } from './config/balance.js';
import {
  DEV_MUSHROOM_KINGDOM,
  DEV_ROSTER,
  devAttackStyleFor,
} from './content/dev-fixtures.js';

export const ROSTER = DEV_ROSTER;
export const MUSHROOM_KINGDOM = DEV_MUSHROOM_KINGDOM;

export function attackStyleFor(hero) {
  return devAttackStyleFor(hero);
}

/** World/area metadata for any absolute prototype stage. */
export function stageInfo(stage) {
  const safe = Math.max(1, Math.floor(stage));
  const world = Math.floor((safe - 1) / WORLD_LENGTH) + 1;
  const worldStage = ((safe - 1) % WORLD_LENGTH) + 1;
  const areaIndex = Math.floor((worldStage - 1) / 10);
  const areaStage = ((worldStage - 1) % 10) + 1;
  return {
    stage: safe,
    world,
    worldStage,
    areaStage,
    boss: areaStage === 10,
    worldName: world === 1 ? 'Mushroom Kingdom' : `Mushroom Kingdom · Loop ${world}`,
    area: MUSHROOM_KINGDOM[areaIndex],
  };
}
