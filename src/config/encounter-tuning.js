// First seeded v1 pass. Solo openings use conservative incoming damage;
// larger parties get authored durability budgets instead of party scaling.
export const ENCOUNTER_TUNING = {
  'smb1-01':{enemyDamageScale:0.4}, 'smb1-02':{enemyDamageScale:0.55},
  'smb1-03':{enemyHpScale:1.3,enemyDamageScale:0.8}, 'smb1-04':{enemyHpScale:1.6,enemyDamageScale:0.85},
  'smb1-05':{enemyHpScale:1.4,bossHpScale:3.5,enemyDamageScale:0.55},
  'smb1-06':{enemyHpScale:1.6}, 'smb1-07':{enemyHpScale:1.7,enemyDamageScale:0.8},
  'smb1-08':{enemyHpScale:1.8}, 'smb1-09':{enemyHpScale:1.5,enemyDamageScale:0.8},
  'smb1-10':{enemyHpScale:1.2,bossHpScale:2}, 'smb1-11':{enemyHpScale:2},
  'smb1-12':{enemyHpScale:1.8}, 'smb1-13':{enemyHpScale:1.8},
  'smb1-14':{enemyHpScale:1.5,bossHpScale:2}, 'smb1-15':{enemyHpScale:1.4,bossHpScale:2},
  'ka-01':{enemyHpScale:2.2,enemyDamageScale:0.5},'ka-02':{enemyHpScale:1.8,enemyDamageScale:0.6},
  'ka-03':{enemyHpScale:1.8,enemyDamageScale:0.6},'ka-04':{enemyHpScale:2.5,enemyDamageScale:0.6},
  'ka-05':{enemyHpScale:2,bossHpScale:3,enemyDamageScale:0.55},
  'ka-06':{enemyHpScale:3.2,enemyDamageScale:0.7},'ka-07':{enemyHpScale:3,enemyDamageScale:0.65},
  'ka-08':{enemyHpScale:4,enemyDamageScale:0.65},'ka-09':{enemyHpScale:3.5,enemyDamageScale:0.7},
  'ka-10':{enemyHpScale:2,bossHpScale:3,enemyDamageScale:0.6},
  'ka-11':{enemyHpScale:2.8,enemyDamageScale:0.65},'ka-12':{enemyHpScale:3.6,enemyDamageScale:0.65},
  'ka-13':{enemyHpScale:2.8,enemyDamageScale:0.65},'ka-14':{enemyHpScale:3,enemyDamageScale:0.65},
  'ka-15':{enemyHpScale:2,bossHpScale:3.5,enemyDamageScale:0.75},
  'ka-16':{enemyHpScale:3,enemyDamageScale:0.65},'ka-17':{enemyHpScale:3.5,enemyDamageScale:0.65},
  'ka-18':{enemyHpScale:3,enemyDamageScale:0.65},'ka-19':{enemyHpScale:2,bossHpScale:3.5,enemyDamageScale:0.75},
  'ka-20':{enemyHpScale:2,bossHpScale:2,enemyDamageScale:0.55},
};
