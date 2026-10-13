// A deliberately explicit rulebook. If a number affects a fight, it should be
// visible here rather than hidden behind vague "power" labels.
import { game } from '../game.js';
import * as D from '../data.js';
import { ATTACK_STYLES, CLASS_CRIT, actionSeconds, stageModifier } from '../combat.js';
import { h } from '../ui.js';

const pct = (n) => `${Math.round(n * 100)}%`;

export function MechanicsView() {
  const partyRows = h('div.rules-party');
  const currentRule = h('div.rule-current');
  const styleRows = h('div.rules-grid');
  for (const [id, style] of Object.entries(ATTACK_STYLES)) {
    const extra = id === 'combo' ? ` · ${style.hits} hits` : id === 'lob' ? ` · ${Math.round(style.splash * 100)}% splash power` : id === 'beam' ? ' · all enemies' : '';
    styleRows.append(h('div.rule-row',
      h('b', style.label),
      h('span', `${Math.round(style.power * 100)}% ATK · timer ×${style.cooldown.toFixed(2)}${extra}`),
      h('small', style.summary)));
  }

  const root = h('section.view.mechanics',
    h('div.rules-title', 'FIELD MANUAL', h('span', 'Every live combat rule, without mystery numbers.')),
    h('div.rules-scroll',
      h('h3', 'Your active team'), partyRows,
      h('h3', 'Who acts next'),
      h('p', 'The yellow bar under every fighter is its action gauge. The NEXT readout orders fighters by the exact time remaining until their gauge fills.'),
      h('div.formula', 'SECONDS PER ACTION = (18 ÷ SPEED) × ATTACK COOLDOWN'),
      h('h3', 'Damage'),
      h('div.formula', 'DAMAGE = max(1, ATK × MOVE POWER × random 0.90–1.10 − DEF × 0.50)'),
      h('p', 'Critical hits multiply the final damage by 1.60. Crit chance: Warrior 10%, Mage 10%, Rogue 25%, Cleric 10%, Ranger 20%.'),
      h('p', 'A Cleric heals when the lowest-health living ally falls below 68% HP. Healing = ATK × 1.25 × random 0.90–1.10.'),
      h('h3', 'The seven attack styles'), styleRows,
      h('h3', 'Movement and targeting'),
      h('p', 'Melee and combo fighters run to the front. Shot, lob and beam fighters hold range and retreat if crowded. Charge and stomp fighters approach, then cross the field when their gauge is full. Rogues target the lowest-HP enemy; everyone else targets the nearest threat.'),
      h('h3', 'Stages'),
      currentRule,
      h('p', `Each stage has ${D.STAGE_WAVES} waves. Heroes keep damage between waves and recover 12% max HP after waves 1 and 2. Enemy base stats multiply by ${D.ENEMY_GROWTH.toFixed(3)} each stage. Every 10th stage ends with the area boss.`),
      h('p', 'Normal enemy base: 60 HP, 11 ATK, 4 DEF. Boss base: 300 HP, 15 ATK, 7 DEF. Clear reward = 25 + 5 × stage gems, and 60 + 18 × stage coins. Bosses add 75 gems and 120 coins. A loss gives 15 × stage coins.'),
      h('div.rules-modifiers',
        ruleLine('Open Field', 'No enemy bonus.'),
        ruleLine('Rush Hour', '+18% enemy speed.'),
        ruleLine('Hard Shells', '+30% enemy defence.'),
        ruleLine('Swarm', '+2 enemies, −25% HP and −10% attack.'),
        ruleLine('Heavy Hitter', '+35% HP, +15% attack, −8% speed.')),
      h('h3', 'Progression'),
      h('p', 'Hero level multiplier: +8% base stats per level after level 1. Each duplicate raises Ascension by 1, adding +10% stats and +10 maximum levels. Level cost = 30 × rarity step × current level.'),
      h('h3', 'Pulls'),
      h('p', `R ${pct(1 - D.SSR_RATE - D.SR_RATE)} · SR ${pct(D.SR_RATE)} · SSR ${pct(D.SSR_RATE)}. SR is guaranteed by pull ${D.SR_PITY}. After ${D.SOFT_PITY} misses, SSR chance gains ${pct(D.SOFT_PITY_STEP)} per pull; pull ${D.HARD_PITY} is guaranteed.`)));

  function refresh() {
    partyRows.replaceChildren(...game.party.map((id) => {
      const hero = game.hero(id);
      const stats = game.stats(id);
      const style = D.attackStyleFor(hero);
      return h('div.rule-party-row',
        h('b', hero.name),
        h('span', `HP ${stats.hp} · ATK ${stats.atk} · DEF ${stats.def} · SPD ${stats.spd}`),
        h('small', `${ATTACK_STYLES[style].label} · acts every ${actionSeconds(stats.spd, style).toFixed(2)}s · crit ${pct(CLASS_CRIT[hero.cls] || 0.08)}`));
    }));
    const info = D.stageInfo(game.stage);
    const modifier = stageModifier(game.stage, info.boss);
    currentRule.textContent = `Current: Stage ${info.worldStage}, ${modifier.name} — ${modifier.detail}`;
  }

  game.addEventListener('changed', refresh);
  refresh();
  return root;
}

function ruleLine(name, text) {
  return h('div', h('b', name), h('span', text));
}
