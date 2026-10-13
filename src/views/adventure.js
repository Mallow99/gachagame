// Field status for the real-time strip. Battles themselves only happen in the
// desk strip; this screen explains the current run instead of duplicating it as
// a turn-based RPG fight.
import { game } from '../game.js';
import * as D from '../data.js';
import { stageModifier } from '../combat.js';
import { h } from '../ui.js';

export function AdventureView() {
  const desktop = window.desktop;
  const world = h('div.field-world');
  const stage = h('div.field-stage');
  const area = h('div.field-area');
  const ruleName = h('strong');
  const ruleDetail = h('span.muted.small');
  const reward = h('div.field-reward');
  const route = h('div.field-route');
  const team = h('div.field-team');
  const returnButton = h('button.btn.big.field-return', { onclick: () => {
    game.save();
    if (desktop?.openStrip) desktop.openStrip();
    else location.href = 'strip.html';
  } }, 'Return to the battle strip');
  const root = h('section.view.field-status',
    h('div.field-heading', world, stage, area),
    route,
    h('div.field-rule', h('span.field-rule-label', 'STAGE RULE'), ruleName, ruleDetail),
    h('div.field-waves',
      h('div.wave-card', h('b', 'WAVE 1'), h('span', 'Approach')),
      h('div.wave-link', '›'),
      h('div.wave-card', h('b', 'WAVE 2'), h('span', 'Pressure')),
      h('div.wave-link', '›'),
      h('div.wave-card', h('b', 'WAVE 3'), h('span', 'Finish'))),
    h('div.section-label', 'ACTIVE TEAM'), team,
    reward,
    h('div.grow'), returnButton);

  function refresh() {
    const info = D.stageInfo(game.stage);
    const modifier = stageModifier(game.stage, info.boss);
    root.className = `view field-status area-${info.area.id}`;
    world.textContent = `WORLD ${info.world} · ${info.worldName.toUpperCase()}`;
    stage.textContent = `STAGE ${info.worldStage}${info.boss ? ' · BOSS' : ''}`;
    area.textContent = `${info.area.name} · ${info.areaStage}/10`;
    ruleName.textContent = modifier.name;
    ruleDetail.textContent = modifier.detail;
    const stageReward = game.stageRewards(game.stage);
    reward.textContent = `CLEAR REWARD  ◆ ${stageReward.gems}   ● ${stageReward.gold}`;
    route.replaceChildren(...D.MUSHROOM_KINGDOM.map((item, index) => {
      const active = item.id === info.area.id;
      const complete = index < D.MUSHROOM_KINGDOM.indexOf(info.area);
      return h(`span${active ? '.active' : complete ? '.complete' : ''}`, { title: `${item.name} ${item.range}` }, index + 1);
    }));
    team.replaceChildren(...game.party.map((id) => {
      const hero = game.hero(id);
      const stats = game.stats(id);
      return h('div.field-unit',
        h('b', hero.name),
        h('span', `${D.attackStyleFor(hero).toUpperCase()} · SPD ${stats.spd}`));
    }));
  }

  game.addEventListener('changed', refresh);
  refresh();
  return root;
}
