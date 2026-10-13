const WORLD_ID = 'super-mario-bros-1985';
const AREA_ID = 'smb1-overworld';
const FREE_TEAM = {
  id: 'free-rank-1',
  unitIds: ['classic-mario', 'classic-luigi', 'toad', 'princess-peach'],
  trainingRank: 1,
  stars: 0,
  powerupIds: [null, null, null, null],
  assistId: null,
};

function encounter(localStage, name, recommendedTrainingRank, waves, firstClear, extra = {}) {
  return {
    id: `smb1-${String(localStage).padStart(2, '0')}`,
    worldId: WORLD_ID,
    localStage,
    areaId: AREA_ID,
    name,
    recommendedTrainingRank,
    environment: { sceneId: 'smb1-overworld-day', groundRule: 'flat', modifiers: [] },
    waves,
    clearRules: { type: 'defeat-all-waves', timeLimitSeconds: null },
    rewards: { firstClear, repeat: [{ type: 'coins', amount: 25 + (localStage - 1) * 5 }] },
    referenceTeams: [{
      ...FREE_TEAM,
      expected: {
        clearSeconds: [localStage === 5 ? 240 : 90, localStage === 1 ? 150 : localStage === 5 ? 300 : 180],
        winRate: [localStage === 5 ? 0.75 : 0.9, 1],
      },
    }],
    productionStatus: 'slice',
    ...extra,
  };
}

export const SMB1_ENCOUNTERS = [
  encounter(1, 'First Steps', 1, [
    wave('w1', spawn('goomba', 3, { spacing: 46 })),
    wave('w2', spawn('goomba', 2, { spacing: 52 }), spawn('goomba', 1, { entry: 'left', delaySeconds: 2.2 })),
    wave('w3', spawn('goomba', 4, { spacing: 82 })),
    wave('w4', spawn('goomba', 2, { spacing: 56 }), spawn('goomba', 1, { variantId: 'veteran-goomba', delaySeconds: 1.2 })),
  ], [{ type: 'starlight', amount: 60 }, { type: 'coins', amount: 40 }]),

  encounter(2, 'Shell Lessons', 2, [
    wave('w1', spawn('goomba', 2), spawn('koopa-troopa', 1, { variantId: 'green' })),
    wave('w2', spawn('koopa-troopa', 2, { variantId: 'green', spacing: 70 })),
    wave('w3', spawn('goomba', 3, { spacing: 50 }), spawn('koopa-troopa', 1, { variantId: 'red', delaySeconds: 1.4 })),
    wave('w4', spawn('koopa-troopa', 2, { variantId: 'green' }), spawn('goomba', 2, { delaySeconds: 1 })),
  ], [{ type: 'starlight', amount: 60 }, { type: 'coins', amount: 45 }]),

  encounter(3, 'Pipe Windows', 3, [
    wave('w1', spawn('goomba', 2), spawn('piranha-plant', 1, { entry: 'fixed' })),
    wave('w2', spawn('piranha-plant', 2, { entry: 'fixed', spacing: 120 })),
    wave('w3', spawn('koopa-troopa', 1, { variantId: 'green' }), spawn('piranha-plant', 2, { entry: 'fixed' })),
    wave('w4', spawn('piranha-plant', 3, { entry: 'fixed' }), spawn('goomba', 1, { delaySeconds: 1.5 })),
  ], [{ type: 'starlight', amount: 60 }, { type: 'coins', amount: 50 }, { type: 'powerup', itemId: 'super-mushroom', amount: 1 }, { type: 'supply-ticket', amount: 1 }]),

  encounter(4, 'Hammer Weather', 4, [
    wave('w1', spawn('goomba', 3, { spacing: 52 })),
    wave('w2', spawn('koopa-troopa', 1, { variantId: 'green' }), spawn('piranha-plant', 1, { entry: 'fixed' })),
    wave('w3', spawn('hammer-bro', 1, { variantId: 'elite' })),
    wave('w4', spawn('koopa-troopa', 2, { variantId: 'green' }), spawn('hammer-bro', 1, { delaySeconds: 1.2 })),
    wave('w5', spawn('hammer-bro', 1), spawn('hammer-bro', 1, { delaySeconds: 2.3 })),
  ], [{ type: 'starlight', amount: 60 }, { type: 'coins', amount: 55 }]),

  encounter(5, 'Hammer Bros. Stand', 6, [
    wave('w1', spawn('goomba', 2), spawn('koopa-troopa', 2, { variantId: 'green', delaySeconds: 0.8 })),
    wave('w2', spawn('piranha-plant', 2, { entry: 'fixed' }), spawn('goomba', 2, { delaySeconds: 1 })),
    wave('w3', spawn('hammer-bro', 1), spawn('goomba', 2, { delaySeconds: 1.4 })),
    wave('w4', spawn('hammer-bro', 1), spawn('hammer-bro', 1, { delaySeconds: 2 })),
    wave('w5', spawn('hammer-bro', 2, { variantId: 'boss-pair', spacing: 170 })),
  ], [{ type: 'starlight', amount: 760 }, { type: 'coins', amount: 250 }, { type: 'supply-ticket', amount: 4 }], {
    boss: {
      staggerMax: 100,
      staggerDurationSeconds: 5,
      controlResistance: 0.65,
      phases: [
        { id: 'paired-pattern', startsAtHpRatio: 1, attackIds: ['hammer-fan', 'high-jump'], environmentChanges: [] },
        { id: 'survivor-enrage', startsWhen: 'partner-defeated', attackIds: ['hammer-fan', 'ground-pound'], modifiers: { haste: 0.25, attack: 0.15 } },
      ],
    },
  }),
];

function wave(id, ...spawns) {
  return { id, delaySeconds: 0, spawns, clearRule: 'defeat-all' };
}

function spawn(enemyId, count, overrides = {}) {
  return { enemyId, count, entry: 'right', spacing: 46, ...overrides };
}
