// Prototype balance values live here while the runtime is migrated from the
// legacy data facade. Imports from data.js remain compatible for old views.

export const PULL_COST = 100;
export const SSR_RATE = 0.03;
export const SR_RATE = 0.15;
export const SOFT_PITY = 50;
export const SOFT_PITY_STEP = 0.03;
export const HARD_PITY = 70;
export const SR_PITY = 10;

export const START_GEMS = 1600;
export const START_GOLD = 500;
export const IDLE_GEMS_PER_MIN = 3;
export const OFFLINE_GEMS_PER_MIN = 1;
export const OFFLINE_CAP_MIN = 480;
export const DAILY_GEMS = 500;

export const MAX_ASC = 5;
export const MAX_PARTY = 4;
export const ENEMY_GROWTH = 1.045;
export const WORLD_LENGTH = 50;
export const STAGE_WAVES = 3;

export const CLASSES = {
  Warrior: { hp: 120, atk: 16, def: 12, spd: 8 },
  Mage: { hp: 80, atk: 26, def: 5, spd: 10 },
  Rogue: { hp: 90, atk: 20, def: 7, spd: 15 },
  Cleric: { hp: 100, atk: 14, def: 9, spd: 9 },
  Ranger: { hp: 95, atk: 19, def: 7, spd: 12 },
};

export const CLASS_BLURB = {
  Warrior: "Tanky. Soaks hits so others don't have to.",
  Mage: 'Hits the hardest. Folds like paper.',
  Rogue: 'Goes for the weakest foe. Crits a lot.',
  Cleric: "Heals whoever's hurting most.",
  Ranger: 'Fast and steady, with a decent crit.',
};

export const RARITY_MULT = { 3: 1.0, 4: 1.3, 5: 1.7 };
