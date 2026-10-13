// Stage preview and the animated auto-battle. World 1 crosses five Mushroom
// Kingdom areas, with a themed boss at the end of each ten-stage run.
import { game } from '../game.js';
import * as D from '../data.js';
import { sfx } from '../sfx.js';
import { h, sleep, sprite } from '../ui.js';

export function AdventureView() {
  let enemies = game.makeEnemies(game.stage);
  let fighting = false;
  let fast = false;
  let units = [[], []];

  const worldLabel = h('div.world-title');
  const stageLabel = h('div.stage-title');
  const areaLabel = h('div.area-title');
  const progressFill = h('div.area-progress-fill');
  const progress = h('div.area-progress', progressFill);
  const heroPreview = h('div.preview');
  const enemyPreview = h('div.preview');
  const powerLabel = h('div.center.small');
  const rewardLabel = h('div.muted.small.center');
  const prep = h('div.prep',
    worldLabel, stageLabel, areaLabel, progress,
    h('div.muted.tiny.center', 'Your party'), heroPreview,
    h('div.vs', 'VS'),
    enemyPreview,
    powerLabel, rewardLabel,
    h('div.grow'),
    h('button.btn.big.red', { onclick: fight }, 'FIGHT!'));

  const heroCol = h('div.side');
  const enemyCol = h('div.side');
  const speedBtn = h('button.btn.small.speed', { onclick: () => {
    fast = !fast;
    speedBtn.textContent = fast ? '×2' : '×1';
  } }, '×1');
  const resultTitle = h('div.result-title');
  const resultBody = h('div.result-body');
  const result = h('div.result', { hidden: true },
    h('div.result-panel', resultTitle, resultBody,
      h('button.btn', { onclick: next }, 'Continue')));
  const arena = h('div.arena', { hidden: true }, speedBtn, h('div.sides', heroCol, enemyCol), result);

  const root = h('section.view.adventure', prep, arena);

  function refresh() {
    if (fighting) return;
    const s = game.stage;
    const info = D.stageInfo(s);
    root.className = `view adventure area-${info.area.id}`;
    worldLabel.textContent = `World ${info.world} · ${info.worldName}`;
    stageLabel.textContent = info.boss ? `Stage ${info.worldStage} · BOSS` : `Stage ${info.worldStage}`;
    areaLabel.textContent = `${info.area.name} · ${info.areaStage}/10`;
    progressFill.style.width = `${info.areaStage * 10}%`;
    const heroes = game.partyUnits();
    fillPreview(heroPreview, heroes, true);
    fillPreview(enemyPreview, enemies, false);
    const mine = game.teamPower(heroes);
    const theirs = game.teamPower(enemies);
    powerLabel.textContent = `Power ${mine}  vs  ${theirs}`;
    powerLabel.className = `center small ${mine >= theirs ? 'good' : 'bad'}`;
    const r = game.stageRewards(s);
    rewardLabel.textContent = `Win: +${r.gems} gems, +${r.gold} gold`;
  }

  function fillPreview(box, list, heroes) {
    box.replaceChildren(...list.map((u) =>
      h('div.preview-unit',
        sprite(u, u.boss ? 72 : 48),
        h('div.tiny.muted', heroes ? `Lv ${game.level(u.id)}` : u.name))));
  }

  function unitWidget(u) {
    const img = sprite(u, u.boss ? 64 : 44);
    const fill = h('div.fill');
    const el = h(`div.unit${u.hero ? '.hero' : '.enemy'}`,
      img, h('div.hp', fill), h('div.tiny.muted.name', u.name));
    el.img = img;
    el.fill = fill;
    el.maxHp = u.maxHp;
    return el;
  }

  async function fight() {
    if (fighting) return;
    fighting = true;
    sfx.click();
    const heroes = game.partyUnits();
    const sim = game.simulate(heroes, enemies);
    units = [heroes.map(unitWidget), enemies.map(unitWidget)];
    heroCol.replaceChildren(...units[0]);
    enemyCol.replaceChildren(...units[1]);
    prep.hidden = true;
    result.hidden = true;
    arena.hidden = false;
    await sleep(400);

    for (const ev of sim.events) await playEvent(ev);

    const r = game.finishBattle(sim.win);
    if (sim.win) {
      sfx.win();
      resultTitle.textContent = 'VICTORY!';
      resultTitle.className = 'result-title win';
      resultBody.textContent = `+${r.gems} gems   +${r.gold} gold\nOn to stage ${game.stage}.`;
    } else {
      sfx.lose();
      resultTitle.textContent = 'Defeat';
      resultTitle.className = 'result-title lose';
      resultBody.textContent = `+${r.gold} gold for trying.\nLevel up your heroes or pull for better ones.`;
    }
    result.hidden = false;
  }

  async function playEvent(ev) {
    const step = fast ? 120 : 240;
    root.style.setProperty('--step', `${step}ms`);
    const actor = units[ev.side][ev.idx];
    const target = units[ev.tSide][ev.tIdx];
    if (ev.kind === 'hit') replay(actor.img, ev.side === 0 ? 'lunge-r' : 'lunge-l');
    await sleep(step / 2);

    target.fill.style.width = `${(100 * ev.tHp) / target.maxHp}%`;
    if (ev.kind === 'heal') {
      sfx.heal();
      replay(target.img, 'healed');
      floatText(target, `+${ev.amount}`, 'heal');
    } else {
      sfx.hit();
      replay(target.img, 'hurt');
      floatText(target, `${ev.amount}${ev.crit ? '!' : ''}`, ev.crit ? 'crit' : '');
    }
    if (ev.tHp <= 0) target.classList.add('dead');
    await sleep(step);
  }

  function floatText(target, text, kind) {
    const f = h(`div.float${kind ? `.${kind}` : ''}`, text);
    f.addEventListener('animationend', () => f.remove());
    target.append(f);
  }

  function next() {
    sfx.click();
    fighting = false;
    arena.hidden = true;
    prep.hidden = false;
    enemies = game.makeEnemies(game.stage);
    refresh();
  }

  game.addEventListener('changed', refresh);
  refresh();
  return root;
}

function replay(el, cls) {
  el.classList.remove(cls);
  void el.offsetWidth;
  el.classList.add(cls);
}
