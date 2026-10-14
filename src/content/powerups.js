// Effect-only equipment records. A Power-Up grants one trait, one stat lean
// and at most one bounded proc. Matching sprite frames are optional polish;
// these records never replace a fighter's kit.

import { EXTRA_POWERUPS } from './opening-supply.js';
export const POWERUPS = [
  {
    id: 'super-mushroom', sagaId: 'mario', name: 'Super Mushroom', rarity: 'R',
    grantedTrait: 'enlarged',
    statLean: { stat: 'maxHp', multiplier: 1.08 },
    proc: { trigger: 'wave-start', usesPerWave: 1, effects: [{ type: 'ignore-minor-knockback' }] },
    awakening: null,
    duplicatePolicyId: 'powerup-echoes-v1', artId: 'super-mushroom-item', productionStatus: 'provisional',
  },
  {
    id: 'fire-flower', sagaId: 'mario', name: 'Fire Flower', rarity: 'SR',
    grantedTrait: 'fire',
    statLean: { stat: 'rangedDamage', multiplier: 1.11 },
    proc: { trigger: 'every-nth-basic', count: 4, effects: [{ type: 'burn', durationSeconds: 5 }] },
    awakening: null,
    duplicatePolicyId: 'powerup-echoes-v1', artId: 'fire-flower-item', productionStatus: 'planned',
  },
  {
    id: 'ice-flower', sagaId: 'mario', name: 'Ice Flower', rarity: 'SR',
    grantedTrait: 'ice',
    statLean: { stat: 'guard', multiplier: 1.1 },
    proc: { trigger: 'every-nth-basic', count: 4, effects: [{ type: 'slow', value: 0.18, durationSeconds: 2 }] },
    awakening: null,
    duplicatePolicyId: 'powerup-echoes-v1', artId: 'ice-flower-item', productionStatus: 'planned',
  },
  {
    id: 'super-leaf', sagaId: 'mario', name: 'Super Leaf', rarity: 'SR',
    grantedTrait: 'airborne',
    statLean: { stat: 'moveSpeed', multiplier: 1.1 },
    proc: { trigger: 'cross-low-hazard', cooldownSeconds: 8, effects: [{ type: 'ignore-low-hazard' }] },
    awakening: null,
    duplicatePolicyId: 'powerup-echoes-v1', artId: 'super-leaf-item', productionStatus: 'planned',
  },
  {
    id: 'super-bell', sagaId: 'mario', name: 'Super Bell', rarity: 'SR',
    grantedTrait: 'feline',
    statLean: { stat: 'critChance', additive: 0.08 },
    proc: { trigger: 'backline-contact', cooldownSeconds: 9, effects: [{ type: 'stagger', amount: 16 }] },
    awakening: null,
    duplicatePolicyId: 'powerup-echoes-v1', artId: 'super-bell-item', productionStatus: 'planned',
  },
  {
    id: 'penguin-suit', sagaId: 'mario', name: 'Penguin Suit', rarity: 'SSR',
    grantedTrait: 'ice',
    statLean: { stat: 'moveSpeed', multiplier: 1.15 },
    proc: { trigger: 'ground-hazard-contact', cooldownSeconds: 10, effects: [{ type: 'slide-through-hazard' }] },
    awakening: null,
    duplicatePolicyId: 'powerup-echoes-v1', artId: 'penguin-suit-item', productionStatus: 'planned',
  },
  {
    id: 'super-star', sagaId: 'mario', name: 'Super Star', rarity: 'UR',
    grantedTrait: 'radiant',
    statLean: { stat: 'moveSpeed', multiplier: 1.25 },
    proc: null,
    awakening: {
      trigger: 'after-first-ultimate', usesPerStage: 1, durationSeconds: 12,
      effects: [{ type: 'invulnerable' }, { type: 'contact-damage', coefficient: 0.7 }, { type: 'disable-energy-gain' }],
    },
    duplicatePolicyId: 'powerup-echoes-v1', artId: 'super-star-item', productionStatus: 'planned',
  },
];
POWERUPS.push(...EXTRA_POWERUPS);
for (const item of POWERUPS) if (!['super-star','super-bell'].includes(item.id)) {item.productionStatus='provisional';item.usable=true;}
POWERUPS.find(p=>p.id==='friend-heart').statLean={stat:'haste',additive:0.1};
