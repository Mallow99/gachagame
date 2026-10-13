export const ENEMIES = [
  {
    id: 'goomba', sourceGameId: 'super-mario-bros-1985', name: 'Goomba', archetype: 'walker', size: 'small', traits: ['grounded'],
    baseStats: { hp: 420, attack: 42, guard: 5, moveSpeed: 78, haste: 0 },
    movement: { mode: 'approach', preferredRange: 35 },
    attacks: [{ id: 'headbutt', behavior: 'strike', coefficient: 1, intervalSeconds: 2.3, range: 42, targetRule: 'nearest', effects: [] }],
    elite: { id: 'veteran-goomba', hpMultiplier: 1.8, attackMultiplier: 1.2, attacks: [{ id: 'veteran-hop', behavior: 'stomp', coefficient: 1.1, intervalSeconds: 4.8, range: 150, targetRule: 'frontmost', effects: [] }] },
    telegraphs: [], threatCost: 15, rewardWeight: 1, spriteId: 'goomba-battle', productionStatus: 'provisional',
  },
  {
    id: 'koopa-troopa', sourceGameId: 'super-mario-bros-1985', name: 'Koopa Troopa', archetype: 'tank', size: 'small', traits: ['grounded', 'shell'],
    baseStats: { hp: 820, attack: 45, guard: 45, moveSpeed: 68, haste: 0 },
    movement: { mode: 'approach', preferredRange: 38 },
    attacks: [{ id: 'shell-jab', behavior: 'strike', coefficient: 1, intervalSeconds: 2.8, range: 45, targetRule: 'nearest', effects: [] }],
    variants: [{ id: 'green', effects: [{ type: 'shell-return', count: 1 }] }, { id: 'red', baseStats: { hp: 760, attack: 50, guard: 40 }, effects: [{ type: 'lane-guard' }, { type: 'knockback', amount: 20 }] }],
    telegraphs: [], threatCost: 45, rewardWeight: 1.4, spriteId: 'koopa-troopa-battle', productionStatus: 'provisional',
  },
  {
    id: 'piranha-plant', sourceGameId: 'super-mario-bros-1985', name: 'Piranha Plant', archetype: 'ranged', size: 'medium', traits: ['grounded', 'fixed'],
    baseStats: { hp: 540, attack: 62, guard: 10, moveSpeed: 0, haste: 0 },
    movement: { mode: 'fixed', preferredRange: 260 },
    attacks: [{ id: 'pipe-bite', behavior: 'strike', coefficient: 1.05, intervalSeconds: 3, range: 58, targetRule: 'nearest', effects: [] }, { id: 'short-fireball', behavior: 'shot', coefficient: 0.85, intervalSeconds: 3.6, range: 310, targetRule: 'nearest', effects: [] }],
    telegraphs: [{ id: 'pipe-rise', durationSeconds: 1 }], threatCost: 30, rewardWeight: 1.25, spriteId: 'piranha-plant-battle', productionStatus: 'provisional',
  },
  {
    id: 'hammer-bro', sourceGameId: 'super-mario-bros-1985', name: 'Hammer Bro', archetype: 'elite', size: 'medium', traits: ['grounded', 'armored'],
    baseStats: { hp: 1300, attack: 75, guard: 30, moveSpeed: 82, haste: 0 },
    movement: { mode: 'band-hop', preferredRange: 220 },
    attacks: [{ id: 'hammer-fan', behavior: 'lob', coefficient: 0.9, intervalSeconds: 3.3, range: 380, targetRule: 'cluster', effects: [{ type: 'zones', count: 3 }] }, { id: 'high-jump', behavior: 'stomp', coefficient: 1.1, intervalSeconds: 5.4, range: 280, targetRule: 'nearest', effects: [] }],
    variants: [
      { id: 'elite', hpMultiplier: 1.8, attackMultiplier: 1.2, attacks: [{ id: 'ground-pound', behavior: 'stomp', coefficient: 1.25, intervalSeconds: 6, range: 180, targetRule: 'nearest', effects: [{ type: 'interruptible' }] }] },
      { id: 'boss-pair', baseStats: { hp: 2900 }, effects: [{ type: 'shared-presentation' }] },
    ],
    telegraphs: [{ id: 'falling-hammer-zones', durationSeconds: 0.9 }], threatCost: 75, rewardWeight: 2, spriteId: 'hammer-bro-battle', productionStatus: 'provisional',
  },
];
