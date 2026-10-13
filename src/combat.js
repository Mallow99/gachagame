// Exact combat rules shared by the live strip and the in-game mechanics page.

export const ATTACK_STYLES = {
  melee: { label: 'Melee', power: 1, cooldown: 1, range: 58, summary: 'Runs into close range and hits one target.' },
  shot: { label: 'Shot', power: 0.92, cooldown: 0.9, range: 420, summary: 'Stays in the back line and fires quickly at one target.' },
  combo: { label: 'Combo', power: 0.38, hits: 3, cooldown: 1.1, range: 62, summary: 'Closes in and lands three smaller hits.' },
  charge: { label: 'Charge', power: 1.18, cooldown: 1.2, range: 290, summary: 'Dashes across the field for a heavy hit and knockback.' },
  stomp: { label: 'Stomp', power: 1.3, cooldown: 1.25, range: 300, summary: 'Jumps onto one target for the strongest single hit.' },
  lob: { label: 'Lob', power: 0.82, splash: 0.45, cooldown: 1.15, range: 390, summary: 'Arcs a projectile; nearby enemies take splash damage.' },
  beam: { label: 'Beam', power: 0.72, cooldown: 1.25, range: 460, summary: 'Hits every living enemy in a line.' },
};

export const CLASS_CRIT = { Warrior: 0.1, Mage: 0.1, Rogue: 0.25, Cleric: 0.1, Ranger: 0.2 };

export function actionSeconds(speed, style = 'melee') {
  return (18 / Math.max(1, speed)) * (ATTACK_STYLES[style]?.cooldown || 1);
}

export function damageAmount(attacker, target, style = 'melee', random = Math.random, powerOverride) {
  const rules = ATTACK_STYLES[style] || ATTACK_STYLES.melee;
  const variance = 0.9 + random() * 0.2;
  const crit = random() < (CLASS_CRIT[attacker.cls] || 0.08);
  const power = powerOverride ?? rules.power;
  let amount = Math.max(1, attacker.atk * power * variance - target.def * 0.5);
  if (crit) amount *= 1.6;
  return { amount: Math.round(amount), crit };
}

export function healAmount(attacker, random = Math.random) {
  return Math.round(attacker.atk * 1.25 * (0.9 + random() * 0.2));
}

const MODIFIERS = [
  { id: 'standard', name: 'Open Field', detail: 'No enemy bonus.', hp: 1, atk: 1, def: 1, spd: 1, count: 0 },
  { id: 'rush', name: 'Rush Hour', detail: 'Enemies move and act 18% faster.', hp: 1, atk: 1, def: 1, spd: 1.18, count: 0 },
  { id: 'armored', name: 'Hard Shells', detail: 'Enemies have 30% more defence.', hp: 1, atk: 1, def: 1.3, spd: 1, count: 0 },
  { id: 'swarm', name: 'Swarm', detail: 'Two extra enemies appear with 25% less HP.', hp: 0.75, atk: 0.9, def: 1, spd: 1, count: 2 },
  { id: 'elite', name: 'Heavy Hitter', detail: 'Enemies have 35% more HP and 15% more attack.', hp: 1.35, atk: 1.15, def: 1, spd: 0.92, count: 0 },
];

export function stageModifier(stage, boss = false) {
  if (boss) return { id: 'boss', name: 'Boss Stage', detail: 'Two approach waves, then the area boss.', hp: 1, atk: 1, def: 1, spd: 1, count: 0 };
  return MODIFIERS[(Math.max(1, Math.floor(stage)) - 1) % MODIFIERS.length];
}
