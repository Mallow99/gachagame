// The live v1 rules. Legacy prototype tuning stays in balance.js for fixtures.
export const RULES = Object.freeze({
  step: 1 / 30, growth: 1.045, partySize: 4, energy: 100,
  waveBreath: 1.5, bossIntro: 3, guardCap: 180, variance: [0.95, 1.05], critMultiplier: 1.5,
  basicEnergy: 8, skillEnergy: 12, killEnergy: 3,
  starMultipliers: [1, 1.04, 1.08, 1.13, 1.18, 1.25],
  rarityMultipliers: { R: 1, SR: 1.15, SSR: 1.38, UR: 1.68 },
  echoes: { R: [2, 10], SR: [8, 40], SSR: [30, 150], UR: [120, 600] },
  exchange: {ticket:40,note:8},
  fighter: { cost: 100, sr: 0.17, ssr: 0.03, soft: 50, step: 0.03, hard: 70, srHard: 10 },
  supply: { cost: 1, sr: 0.20, ssr: 0.05, soft: 30, step: 0.05, hard: 45, srHard: 10 },
  mythic: { cost: 100, ur: 0.008, ssr: 0.032, sr: 0.16, soft: 55, step: 0.035, hard: 80 },
  offlineCap: 12 * 3600, patrolMarksPerPull: 10, masteryThresholds: [0, 120, 360, 720, 1200],
});
export const PATTERNS = {
  strike: { interval: 1.8, range: 58, coefficient: 1, label: 'Strike' },
  shot: { interval: 1.65, range: 420, coefficient: 0.92, label: 'Shot' },
  combo: { interval: 2.25, range: 64, coefficient: 0.42, hits: 3, label: 'Combo' },
  charge: { interval: 2.5, range: 300, coefficient: 1.4, label: 'Charge' },
  stomp: { interval: 2.35, range: 300, coefficient: 1.2, label: 'Stomp' },
  lob: { interval: 2.4, range: 390, coefficient: 0.9, label: 'Lob' },
  beam: { interval: 2.7, range: 390, coefficient: 1.05, label: 'Beam' },
};
export const growth = rank => RULES.growth ** (Math.max(1, rank) - 1);
export const trainingCost = rank => Math.round(80 * 1.085 ** (Math.max(1, rank) - 1) / 5) * 5;
export const interval = (base, haste = 0) => base / (1 + Math.max(-0.5, Math.min(1, haste)));
export const rarityRank = rarity => ['R', 'SR', 'SSR', 'UR'].indexOf(rarity);
export const techniquePotency=(rank,kind)=>kind==='basic'&&rank>=2?1.08:kind==='skill'&&rank>=3?1.12:kind==='ultimate'&&rank>=5?1.25:1;
export const techniqueCooldown=rank=>rank>=3?.95:1;
export const techniqueQuality=rank=>rank>=4?1.2:1;

// Shared by combat and the Manual: each coefficient is upgraded exactly once.
export function techniqueAbility(ability,rank=1,kind='basic') {
  const potency=kind==='passive'?techniqueQuality(rank):techniquePotency(rank,kind);
  const adjusted={...ability,effects:(ability.effects||[]).map(effect=>{
    const e={...effect};
    for(const key of kind==='passive'?['coefficient','amount','value','durationSeconds','seconds','radius','movePerStack']:['coefficient','burstCoefficient'])
      if(typeof e[key]==='number')e[key]*=potency;
    return e;
  })};
  if(typeof ability.coefficient==='number')adjusted.coefficient=ability.coefficient*potency;
  if(kind==='skill'&&ability.cooldownSeconds!==undefined)adjusted.cooldownSeconds=ability.cooldownSeconds*techniqueCooldown(rank);
  return adjusted;
}

export function fighterStats(unit, rank = 1, owned = {}, powerup = null) {
  // Bible stats are displayed Rank-1 values, already including rarity.
  const m = growth(rank) * RULES.starMultipliers[Math.max(0, Math.min(5, owned.stars || 0))];
  const b = unit.baseStats;
  const s = { hp: Math.round(b.hp * m), attack: Math.round(b.attack * m), guard: b.guard,
    moveSpeed: b.moveSpeed, haste: b.haste || 0, critChance: b.critChance || 0.08, rangedDamage: 1, skillDamage: 1, healingReceived: 1 };
  const lean = powerup?.statLean;
  if (lean) {
    const key = lean.stat === 'maxHp' ? 'hp' : lean.stat;
    s[key] = lean.multiplier ? (s[key] ?? 1) * lean.multiplier : (s[key] || 0) + lean.additive;
  }
  s.hp = Math.round(s.hp); s.guard = Math.min(RULES.guardCap, s.guard);
  return s;
}

export function hitDamage(attacker, target, coefficient, random = Math.random) {
  const variance = RULES.variance[0] + random() * (RULES.variance[1] - RULES.variance[0]);
  const crit = random() < (attacker.critChance || 0);
  const raw = attacker.attack * coefficient * (crit ? RULES.critMultiplier : 1);
  const guard = Math.max(0, Math.min(RULES.guardCap, target.guard));
  return { raw, final: Math.max(1, Math.round(raw * 100 / (100 + guard) * variance)), crit };
}
