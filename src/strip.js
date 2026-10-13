// The always-on-top combat strip. It reuses the real game simulation and save,
// then gives each of the seven attack styles a distinct piece of movement.
import { game } from './game.js';
import * as D from './data.js';
import { h, sleep, sprite } from './ui.js';

const desktop = window.desktop;
const root = document.getElementById('strip');
const stage = document.getElementById('stage');
const hud = document.getElementById('hud');
const announce = document.getElementById('announce');
const locationLabel = document.getElementById('location');
const stageLabel = document.getElementById('stage-label');
const actionLabel = document.getElementById('action-label');
const gemsLabel = document.getElementById('gems');
const goldLabel = document.getElementById('gold');
const ACTION_MS = 230;

let alive = true;
let widgets = [[], []];

document.documentElement.classList.toggle('desktop', !!desktop);
hud.addEventListener('click', () => {
  game.save();
  desktop?.openManager();
});
window.addEventListener('beforeunload', () => { alive = false; game.save(); });
window.addEventListener('resize', reportInteractiveRect);
game.addEventListener('changed', updateHud);

function reportInteractiveRect() {
  if (!desktop?.reportInteractiveRect) return;
  const r = hud.getBoundingClientRect();
  desktop.reportInteractiveRect({ x: Math.round(r.x), y: Math.round(r.y), width: Math.round(r.width), height: Math.round(r.height) });
}

function updateHud() {
  const info = D.stageInfo(game.stage);
  locationLabel.textContent = `${info.worldName} · ${info.area.name}`;
  stageLabel.textContent = `Stage ${info.worldStage}${info.boss ? ' · BOSS' : ''}`;
  gemsLabel.textContent = Math.floor(game.gems);
  goldLabel.textContent = Math.floor(game.gold);
}

function renderBattle(heroes, enemies) {
  widgets = [
    heroes.map((u, i) => makeUnit(u, 0, i)),
    enemies.map((u, i) => makeUnit(u, 1, i)),
  ];
  stage.replaceChildren(...widgets.flat().map((w) => w.el));
}

function makeUnit(unit, side, index) {
  const size = unit.boss ? 94 : 64;
  const fighter = h('div.fighter', sprite(unit, size));
  const fill = h('div.hp-fill');
  const el = h(`div.unit.${side ? 'enemy' : 'hero'}`,
    fighter, h('div.name', unit.name), h('div.hp', fill));
  const left = side ? 72 + index * 9 : 9 + index * 9;
  el.style.left = `${left}%`;
  el.style.bottom = `${27 + (index % 2) * 7}px`;
  return { unit, el, fighter, fill };
}

async function battleLoop() {
  game.welcome();
  updateHud();
  requestAnimationFrame(reportInteractiveRect);
  while (alive) {
    const info = D.stageInfo(game.stage);
    root.className = `area-${info.area.id}`;
    const heroes = game.partyUnits();
    const enemies = game.makeEnemies(game.stage);
    renderBattle(heroes, enemies);
    updateHud();
    showAnnouncement(info.boss ? `${info.area.boss[0]} · BOSS` : `${info.area.name} · ${info.areaStage}/10`);
    await sleep(info.boss ? 1100 : 650);

    const sim = game.simulate(heroes, enemies);
    for (const event of sim.events) {
      if (!alive) return;
      await playEvent(event);
    }

    const reward = game.finishBattle(sim.win);
    updateHud();
    actionLabel.textContent = sim.win ? `Victory · +${reward.gold} gold` : 'Defeat · regrouping';
    showAnnouncement(sim.win ? `VICTORY · +${reward.gems} ◆` : 'DEFEAT');
    await sleep(sim.win ? 1200 : 1700);
  }
}

async function playEvent(event) {
  const actor = widgets[event.side][event.idx];
  const target = widgets[event.tSide][event.tIdx];
  if (!actor || !target || actor.el.classList.contains('dead')) return;

  const style = event.kind === 'heal' ? 'support' : actor.unit.attackStyle || 'melee';
  actionLabel.textContent = `${actor.unit.name} · ${style.toUpperCase()}`;
  root.dataset.lastAttack = style;
  await animateAttack(style, actor, target);

  target.fill.style.width = `${Math.max(0, 100 * event.tHp / target.unit.maxHp)}%`;
  floatText(target, `${event.kind === 'heal' ? '+' : '−'}${event.amount}`, event.kind === 'heal' ? 'heal' : event.crit ? 'crit' : '');
  if (event.kind !== 'heal') {
    target.fighter.animate([
      { filter: 'brightness(3)', transform: 'translateX(0)' },
      { filter: 'brightness(1)', transform: `translateX(${event.side ? -7 : 7}px)` },
      { transform: 'translateX(0)' },
    ], { duration: 180 });
    impactAt(target);
  }
  if (event.tHp <= 0) target.el.classList.add('dead');
  await sleep(70);
}

async function animateAttack(style, actor, target) {
  const a = centerOf(actor);
  const t = centerOf(target);
  const dx = t.x - a.x;
  const direction = Math.sign(dx) || 1;
  const options = { duration: ACTION_MS, easing: 'cubic-bezier(.2,.8,.25,1)' };

  if (style === 'support') {
    await target.fighter.animate([
      { filter: 'drop-shadow(0 0 0 #68ef91)', transform: 'scale(1)' },
      { filter: 'drop-shadow(0 0 18px #68ef91)', transform: 'scale(1.14)' },
      { filter: 'drop-shadow(0 0 0 #68ef91)', transform: 'scale(1)' },
    ], options).finished;
    return;
  }
  if (style === 'shot') {
    await projectile(a, t, false);
    return;
  }
  if (style === 'lob') {
    await projectile(a, t, true);
    return;
  }
  if (style === 'beam') {
    await beam(a, t);
    return;
  }
  if (style === 'combo') {
    await actor.fighter.animate([
      { transform: 'translateX(0)' }, { transform: `translateX(${direction * 28}px) rotate(-7deg)` },
      { transform: 'translateX(0)' }, { transform: `translateX(${direction * 34}px) rotate(7deg)` },
      { transform: 'translateX(0)' }, { transform: `translateX(${direction * 42}px)` },
      { transform: 'translateX(0)' },
    ], { duration: ACTION_MS * 1.35, easing: 'ease-in-out' }).finished;
    return;
  }
  if (style === 'charge') {
    await actor.fighter.animate([
      { transform: 'translateX(0) scaleX(1)' },
      { transform: `translateX(${dx * .72}px) scaleX(1.3)`, offset: .55 },
      { transform: `translateX(${dx * .78}px) scaleX(.8)`, offset: .65 },
      { transform: 'translateX(0) scaleX(1)' },
    ], { duration: ACTION_MS * 1.4, easing: 'cubic-bezier(.2,.8,.2,1)' }).finished;
    return;
  }
  if (style === 'stomp') {
    await actor.fighter.animate([
      { transform: 'translate(0, 0) scale(1)' },
      { transform: `translate(${dx * .45}px, -82px) scale(1.08)`, offset: .45 },
      { transform: `translate(${dx * .88}px, 8px) scale(1.18,.75)`, offset: .72 },
      { transform: 'translate(0, 0) scale(1)' },
    ], { duration: ACTION_MS * 1.7, easing: 'ease-in-out' }).finished;
    return;
  }
  await actor.fighter.animate([
    { transform: 'translateX(0) rotate(0)' },
    { transform: `translateX(${-direction * 10}px) rotate(${-direction * 5}deg)`, offset: .25 },
    { transform: `translateX(${direction * 48}px) rotate(${direction * 7}deg)`, offset: .58 },
    { transform: 'translateX(0) rotate(0)' },
  ], options).finished;
}

function centerOf(widget) {
  const r = widget.fighter.getBoundingClientRect();
  const s = stage.getBoundingClientRect();
  return { x: r.left - s.left + r.width / 2, y: r.top - s.top + r.height * .45 };
}

async function projectile(from, to, lobbed) {
  const p = h(`div.projectile${lobbed ? '.lob' : ''}`);
  p.style.left = `${from.x}px`;
  p.style.top = `${from.y}px`;
  stage.append(p);
  const dx = to.x - from.x;
  const dy = to.y - from.y;
  const frames = lobbed
    ? [{ transform: 'translate(0,0)' }, { transform: `translate(${dx * .5}px, ${dy * .5 - 72}px)` }, { transform: `translate(${dx}px, ${dy}px)` }]
    : [{ transform: 'translate(0,0) scaleX(1)' }, { transform: `translate(${dx}px, ${dy}px) scaleX(1.8)` }];
  await p.animate(frames, { duration: lobbed ? ACTION_MS * 1.4 : ACTION_MS * .8, easing: lobbed ? 'ease-in' : 'linear' }).finished;
  p.remove();
}

async function beam(from, to) {
  const dx = to.x - from.x;
  const dy = to.y - from.y;
  const b = h('div.beam');
  b.style.left = `${from.x}px`;
  b.style.top = `${from.y}px`;
  b.style.width = `${Math.hypot(dx, dy)}px`;
  b.style.transform = `rotate(${Math.atan2(dy, dx)}rad)`;
  stage.append(b);
  await b.animate([
    { opacity: 0, scale: '0 1' },
    { opacity: 1, scale: '1 1', offset: .25 },
    { opacity: 1, scale: '1 1', offset: .7 },
    { opacity: 0, scale: '1 .2' },
  ], { duration: ACTION_MS * 1.2, easing: 'ease-out' }).finished;
  b.remove();
}

function impactAt(widget) {
  const p = centerOf(widget);
  const impact = h('div.impact');
  impact.style.left = `${p.x}px`;
  impact.style.top = `${p.y}px`;
  stage.append(impact);
  impact.addEventListener('animationend', () => impact.remove(), { once: true });
}

function floatText(widget, text, kind) {
  const label = h(`div.float${kind ? `.${kind}` : ''}`, text);
  widget.el.append(label);
  label.addEventListener('animationend', () => label.remove(), { once: true });
}

let announceTimer;
function showAnnouncement(text) {
  clearTimeout(announceTimer);
  announce.textContent = text;
  announce.classList.add('show');
  announceTimer = setTimeout(() => announce.classList.remove('show'), 900);
}

battleLoop();
