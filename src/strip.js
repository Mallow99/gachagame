// Transparent real-time desk battle. This deliberately follows the approved
// roaming prototype: frontliners run to threats, ranged units hold the back,
// and attacks happen in the world instead of replaying an RPG turn list.
import { game } from './game.js';
import * as D from './data.js';
import { ATTACK_STYLES, actionSeconds, damageAmount, healAmount, stageModifier } from './combat.js';
import { validateContent } from './content/index.js';
import { createRandom } from './random.js';
import { heroImage } from './sprites.js';

validateContent();

const desktop = window.desktop;
const root = document.getElementById('strip');
const canvas = document.getElementById('stage');
const ctx = canvas.getContext('2d');
const controls = document.getElementById('controls');
const hud = document.getElementById('hud');
const hideButton = document.getElementById('hide-strip');
const announce = document.getElementById('announce');
const turnOrder = document.querySelector('#turn-order span');
const locationLabel = document.getElementById('location');
const stageLabel = document.getElementById('stage-label');
const waveLabel = document.getElementById('wave-label');
const modifierLabel = document.getElementById('modifier-label');
const gemsLabel = document.getElementById('gems');
const goldLabel = document.getElementById('gold');

const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
const lerp = (a, b, t) => a + (b - a) * t;
const ease = (t) => 1 - (1 - clamp(t, 0, 1)) ** 3;
const params = new URLSearchParams(location.search);
const random = createRandom(params.get('seed'));
const rand = (a, b) => a + random() * (b - a);
const TIME_SCALE = clamp(Number(params.get('speed')) || 1, 0.25, 12);

let W = 0;
let H = 0;
let DPR = 1;
let ground = 0;
let last = performance.now();
let alive = true;
let heroes = [];
let enemies = [];
let effects = [];
let texts = [];
let info;
let modifier;
let wave = 0;
let phase = 'boot';
let phaseTimer = 0;
let stageStartedAt = 0;
let lastResult = null;
let announceTimer;
const imageCache = new Map();

document.documentElement.classList.toggle('desktop', !!desktop);
hud.addEventListener('click', () => { game.save(); desktop?.openManager(); });
hideButton.addEventListener('click', () => { game.save(); desktop?.hideStrip?.(); });
window.addEventListener('resize', resize);
window.addEventListener('beforeunload', () => { alive = false; game.save(); });
game.addEventListener('changed', updateHud);

function resize() {
  const oldW = W || innerWidth;
  const rect = canvas.getBoundingClientRect();
  DPR = Math.min(2, devicePixelRatio || 1);
  W = rect.width;
  H = rect.height;
  ground = H - 12;
  canvas.width = Math.round(W * DPR);
  canvas.height = Math.round(H * DPR);
  ctx.setTransform(DPR, 0, 0, DPR, 0, 0);
  const scale = W / oldW;
  for (const p of [...heroes, ...enemies]) {
    p.x *= scale;
    p.home *= scale;
  }
  reportInteractiveRect();
}

function reportInteractiveRect() {
  if (!desktop?.reportInteractiveRect) return;
  const r = controls.getBoundingClientRect();
  desktop.reportInteractiveRect({ x: Math.round(r.x), y: Math.round(r.y), width: Math.round(r.width), height: Math.round(r.height) });
}

function updateHud() {
  info = D.stageInfo(game.stage);
  modifier = stageModifier(game.stage, info.boss);
  root.className = `area-${info.area.id}`;
  locationLabel.textContent = info.area.name.toUpperCase();
  stageLabel.textContent = `STAGE ${info.worldStage}${info.boss ? ' · BOSS' : ''}`;
  waveLabel.textContent = `${Math.max(1, wave)}/${D.STAGE_WAVES}`;
  modifierLabel.textContent = modifier.name.toUpperCase();
  modifierLabel.title = modifier.detail;
  gemsLabel.textContent = Math.floor(game.gems);
  goldLabel.textContent = Math.floor(game.gold);
}

function loadImage(src) {
  if (imageCache.has(src)) return imageCache.get(src);
  const promise = new Promise((resolve, reject) => {
    const image = new Image();
    image.onload = () => resolve(image);
    image.onerror = reject;
    image.src = src;
  });
  imageCache.set(src, promise);
  return promise;
}

function silhouette(image) {
  const c = document.createElement('canvas');
  c.width = image.naturalWidth || image.width;
  c.height = image.naturalHeight || image.height;
  const g = c.getContext('2d');
  g.drawImage(image, 0, 0);
  g.globalCompositeOperation = 'source-in';
  g.fillStyle = '#fff';
  g.fillRect(0, 0, c.width, c.height);
  return c;
}

async function makeFighter(unit, side, index) {
  const image = await loadImage(heroImage(unit));
  const alt = unit.art?.alt ? await loadImage(unit.art.alt) : null;
  const hasArt = Boolean(unit.art?.icon);
  const height = unit.boss ? 112 : hasArt ? (unit.id === 'mario' ? 88 : 108) : 55;
  const home = side === 0 ? W * (0.08 + index * 0.105) : W + 45 + index * 64;
  const style = unit.attackStyle || 'melee';
  const ranged = ['shot', 'lob', 'beam'].includes(style);
  const cap = side ? 0.98 : ranged ? 0.3 : Math.min(0.62, 0.47 + index * 0.045);
  return {
    unit, side, style, slot: index, cap, image, alt, sil: silhouette(image), altSil: alt ? silhouette(alt) : null,
    pixel: !hasArt, h: height, x: home, home, z: side ? rand(-3, 4) : -5 + index * 3,
    face: side ? -1 : 1, hp: unit.hp, maxHp: unit.maxHp, gauge: index * 0.08,
    action: null, walkTo: null, t: rand(0, 6), lift: 0, lean: 0, squash: 0,
    flash: 0, alpha: 1, dead: false, deadT: 0, kb: 0, rot: 0, pose: 'main',
    moveSpeed: 42 + unit.spd * 4.5,
  };
}

async function startStage() {
  phase = 'loading';
  wave = 0;
  info = D.stageInfo(game.stage);
  modifier = stageModifier(game.stage, info.boss);
  root.className = `area-${info.area.id}`;
  effects = [];
  texts = [];
  enemies = [];
  heroes = await Promise.all(game.partyUnits().map((unit, i) => makeFighter(unit, 0, i)));
  stageStartedAt = performance.now();
  phase = 'between';
  phaseTimer = 1.2;
  updateHud();
  showAnnouncement(`${info.area.name} · ${modifier.name}`);
}

async function spawnWave() {
  if (phase === 'loading') return;
  phase = 'loading';
  wave += 1;
  const isBoss = info.boss && wave === D.STAGE_WAVES;
  const baseCount = 1 + wave;
  const count = isBoss ? 1 : Math.min(6, baseCount + modifier.count);
  const units = game.makeEnemies(game.stage, { boss: isBoss, count, modifier, random });
  enemies = await Promise.all(units.map((unit, i) => makeFighter(unit, 1, i)));
  phase = 'battle';
  updateHud();
  showAnnouncement(isBoss ? info.area.boss[0] : `Wave ${wave} of ${D.STAGE_WAVES}`);
}

function updateWorld(dt) {
  for (const p of [...heroes, ...enemies]) updateFighter(p, dt);
  enemies = enemies.filter((p) => !p.dead || p.deadT < 0.75);

  if (phase === 'between' || phase === 'result') {
    phaseTimer -= dt;
    if (phaseTimer <= 0) {
      if (phase === 'between') spawnWave();
      else startStage();
    }
    return;
  }
  if (phase !== 'battle') return;

  if (heroes.every((p) => p.dead)) {
    endStage(false);
    return;
  }
  if (enemies.length === 0) {
    if (wave >= D.STAGE_WAVES) endStage(true);
    else {
      phase = 'between';
      phaseTimer = 2.2;
      for (const hero of heroes) {
        if (hero.dead) continue;
        hero.hp = Math.min(hero.maxHp, hero.hp + Math.round(hero.maxHp * 0.12));
        hero.gauge = Math.max(hero.gauge, 0.2);
      }
      showAnnouncement('Wave clear · catch your breath');
    }
  }
}

function endStage(win) {
  if (phase !== 'battle') return;
  const elapsed = (performance.now() - stageStartedAt) / 1000;
  const reward = game.finishBattle(win);
  lastResult = { win, elapsed, stage: win ? game.stage - 1 : game.stage };
  phase = 'result';
  phaseTimer = win ? 3.2 : 4;
  showAnnouncement(win ? `Stage clear · +${reward.gold} coins` : 'Defeated · retrying this stage');
  updateHud();
}

function updateFighter(p, dt) {
  p.t += dt;
  p.flash = Math.max(0, p.flash - dt * 5);
  p.squash *= Math.pow(0.025, dt);
  if (p.dead) {
    p.deadT += dt;
    p.alpha = clamp(1 - p.deadT / 0.7, 0, 1);
    p.lift -= 70 * dt;
    p.rot += (p.side ? -1 : 1) * dt * 2.2;
    return;
  }
  if (p.kb) {
    p.x += p.kb * dt;
    p.kb *= Math.pow(0.01, dt);
    if (Math.abs(p.kb) < 2) p.kb = 0;
  }
  if (p.action) {
    updateAction(p, dt);
    return;
  }

  p.gauge = Math.min(1, p.gauge + dt / actionSeconds(p.unit.spd, p.style));
  const foes = p.side ? heroes : enemies;
  const allies = p.side ? enemies : heroes;
  const livingFoes = foes.filter((f) => !f.dead);
  if (!livingFoes.length || phase !== 'battle') {
    wander(p, dt);
    return;
  }

  if (p.unit.cls === 'Cleric' && p.gauge >= 1) {
    const hurt = allies.filter((a) => !a.dead).sort((a, b) => a.hp / a.maxHp - b.hp / b.maxHp)[0];
    if (hurt && hurt.hp / hurt.maxHp < 0.68) {
      startAction(p, hurt, 'support');
      return;
    }
  }

  const target = p.unit.cls === 'Rogue'
    ? livingFoes.reduce((best, f) => f.hp < best.hp ? f : best)
    : livingFoes.reduce((best, f) => Math.abs(f.x - p.x) < Math.abs(best.x - p.x) ? f : best);
  const distance = Math.abs(target.x - p.x);
  const rules = ATTACK_STYLES[p.style] || ATTACK_STYLES.melee;
  const ranged = ['shot', 'lob', 'beam'].includes(p.style);
  const leap = ['charge', 'stomp'].includes(p.style);
  const attackRange = Math.min(rules.range, W * 0.38);
  const holdRange = ranged ? Math.min(attackRange * 0.78, W * 0.3) : 52;

  if (p.gauge >= 1 && distance <= attackRange) {
    startAction(p, target, p.style);
    return;
  }
  if (ranged && distance < 120) {
    const retreat = p.side ? Math.min(W - 24, p.x + p.moveSpeed * dt) : Math.max(24, p.x - p.moveSpeed * dt);
    walk(p, retreat, dt);
  } else if (distance > holdRange || (leap && distance > 90)) {
    const direction = Math.sign(target.x - p.x) || (p.side ? -1 : 1);
    const desired = target.x - direction * holdRange;
    walk(p, desired, dt);
  } else {
    idle(p, dt);
  }
}

function wander(p, dt) {
  if (p.side || p.dead) return idle(p, dt);
  if (p.walkTo == null && random() < dt * 0.32) p.walkTo = clamp(p.home + rand(-55, 55), 25, W * 0.56);
  if (p.walkTo != null) {
    walk(p, p.walkTo, dt);
    if (Math.abs(p.x - p.walkTo) < 4) p.walkTo = null;
  } else idle(p, dt);
}

function walk(p, destination, dt) {
  const min = p.side ? W * 0.34 : 22;
  const max = p.side ? W + 90 : W * p.cap;
  const dest = clamp(destination, min, max);
  const direction = Math.sign(dest - p.x);
  if (!direction) return idle(p, dt);
  p.face = direction;
  p.x += direction * Math.min(Math.abs(dest - p.x), p.moveSpeed * dt);
  p.lift = Math.abs(Math.sin(p.t * 8.5)) * Math.min(7, p.h * 0.07);
  p.lean += (direction * 0.12 - p.lean) * Math.min(1, dt * 9);
}

function idle(p, dt) {
  p.lift *= Math.pow(0.03, dt);
  p.lean *= Math.pow(0.04, dt);
}

function startAction(actor, target, style) {
  const durations = { melee: 0.58, shot: 0.5, combo: 0.9, charge: 0.78, stomp: 0.92, lob: 0.78, beam: 0.82, support: 0.7 };
  actor.gauge = 0;
  actor.face = Math.sign(target.x - actor.x) || actor.face;
  actor.action = {
    style, target, t: 0, duration: durations[style] || 0.6, x0: actor.x,
    tx: target.x - actor.face * Math.max(22, target.h * 0.2), hits: new Set(),
  };
}

function updateAction(actor, dt) {
  const action = actor.action;
  const target = action.target;
  action.t += dt;
  const k = clamp(action.t / action.duration, 0, 1);
  const direction = actor.face;
  const moveOut = k < 0.62 ? ease(k / 0.62) : 1 - ease((k - 0.62) / 0.38);

  if (action.style === 'stomp') {
    actor.pose = 'alt';
    actor.x = lerp(action.x0, action.tx, moveOut);
    actor.lift = Math.sin(k * Math.PI) * Math.min(104, H * 0.58);
    actor.rot = direction * Math.sin(k * Math.PI) * 0.1;
    triggerHit(actor, action, 0, 0.57);
  } else if (action.style === 'charge') {
    actor.x = lerp(action.x0, action.tx, moveOut);
    actor.lean = direction * 0.55;
    actor.squash = -0.08;
    triggerHit(actor, action, 0, 0.5);
  } else if (action.style === 'melee') {
    actor.x = lerp(action.x0, action.x0 + direction * 48, Math.sin(k * Math.PI));
    actor.lean = direction * Math.sin(k * Math.PI) * 0.55;
    triggerHit(actor, action, 0, 0.48);
  } else if (action.style === 'combo') {
    actor.x = lerp(action.x0, action.tx, moveOut * 0.92);
    actor.lean = direction * Math.sin(k * Math.PI * 6) * 0.45;
    triggerHit(actor, action, 0, 0.28);
    triggerHit(actor, action, 1, 0.47);
    triggerHit(actor, action, 2, 0.66);
  } else {
    actor.lean = -direction * Math.sin(k * Math.PI) * 0.15;
    triggerHit(actor, action, 0, action.style === 'support' ? 0.52 : 0.42);
  }

  if (k >= 1) {
    actor.x = action.x0;
    actor.action = null;
    actor.pose = 'main';
    actor.lift = 0;
    actor.lean = 0;
    actor.rot = 0;
    actor.squash = 0;
  }
}

function triggerHit(actor, action, index, threshold) {
  if (action.hits.has(index) || action.t / action.duration < threshold) return;
  action.hits.add(index);
  const target = action.target;
  if (action.style === 'support') {
    if (!target.dead) {
      const amount = healAmount(actor.unit, random);
      target.hp = Math.min(target.maxHp, target.hp + amount);
      target.flash = 0.5;
      popText(target.x, ground - target.h - 18, `+${amount}`, '#6ff29a');
      effects.push({ kind: 'heal', x: target.x, y: ground - target.h * 0.45, t: 0, life: 0.55 });
    }
    return;
  }
  if (target.dead) return;

  if (action.style === 'beam') {
    effects.push({ kind: 'beam', x: actor.x, y: ground - actor.h * 0.55, x2: target.x, y2: ground - target.h * 0.52, t: 0, life: 0.35 });
    for (const foe of (actor.side ? heroes : enemies).filter((f) => !f.dead)) dealDamage(actor, foe, 'beam');
    return;
  }
  if (action.style === 'lob') {
    effects.push({ kind: 'lob', x: actor.x, y: ground - actor.h * 0.6, x2: target.x, y2: ground - target.h * 0.5, t: 0, life: 0.48 });
    dealDamage(actor, target, 'lob');
    const foes = actor.side ? heroes : enemies;
    for (const foe of foes) if (foe !== target && !foe.dead && Math.abs(foe.x - target.x) < 145) dealDamage(actor, foe, 'lob', ATTACK_STYLES.lob.splash);
    return;
  }
  if (action.style === 'shot') {
    effects.push({ kind: 'tracer', x: actor.x, y: ground - actor.h * 0.58, x2: target.x, y2: ground - target.h * 0.52, t: 0, life: 0.18 });
  }
  const power = action.style === 'combo' ? ATTACK_STYLES.combo.power : undefined;
  dealDamage(actor, target, action.style, power);
}

function dealDamage(actor, target, style, power) {
  const { amount, crit } = damageAmount(actor.unit, target.unit, style, random, power);
  target.hp = Math.max(0, target.hp - amount);
  target.flash = 1;
  target.squash = style === 'stomp' ? 0.55 : 0.16;
  const direction = Math.sign(target.x - actor.x) || 1;
  target.kb += direction * (style === 'charge' ? 180 : style === 'stomp' ? 65 : 34);
  popText(target.x, ground - target.h - 17, `${amount}${crit ? '!' : ''}`, crit ? '#ffd43b' : '#fff', crit ? 18 : 14);
  burst(target.x, ground - target.h * 0.45, crit ? 11 : 6, crit ? '#ffd43b' : '#fff2b0');
  if (target.hp <= 0) {
    target.dead = true;
    target.deadT = 0;
    target.gauge = 0;
    target.action = null;
    effects.push({ kind: 'poof', x: target.x, y: ground - target.h * 0.35, t: 0, life: 0.55 });
  }
}

function burst(x, y, count, color) {
  for (let i = 0; i < count; i++) {
    const angle = rand(0, Math.PI * 2);
    const speed = rand(45, 130);
    effects.push({ kind: 'spark', x, y, vx: Math.cos(angle) * speed, vy: Math.sin(angle) * speed - 45, color, t: 0, life: rand(0.3, 0.55) });
  }
}

function popText(x, y, text, color, size = 14) {
  texts.push({ x, y, text, color, size, t: 0, life: 0.75 });
}

function drawEnvironment() {
  const styles = getComputedStyle(root);
  const area = styles.getPropertyValue('--area').trim();
  const dark = styles.getPropertyValue('--area-dark').trim();
  const gradient = ctx.createLinearGradient(0, ground - 13, 0, H);
  gradient.addColorStop(0, 'transparent');
  gradient.addColorStop(0.35, `${area}55`);
  gradient.addColorStop(1, `${dark}cc`);
  ctx.fillStyle = gradient;
  ctx.fillRect(0, ground - 13, W, H - ground + 13);
  ctx.strokeStyle = `${area}99`;
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(0, ground + 0.5);
  ctx.lineTo(W, ground + 0.5);
  ctx.stroke();

  ctx.globalAlpha = 0.34;
  ctx.strokeStyle = area;
  ctx.fillStyle = area;
  if (info?.area.id === 'grassland') {
    for (let x = 35; x < W; x += 91) {
      ctx.beginPath(); ctx.moveTo(x, ground); ctx.lineTo(x - 4, ground - 8); ctx.moveTo(x, ground); ctx.lineTo(x + 5, ground - 6); ctx.stroke();
    }
  } else if (info?.area.id === 'underground') {
    for (let x = 0; x < W; x += 38) ctx.strokeRect(x, ground - 7 - (x % 76 ? 0 : 5), 34, 8);
  } else if (info?.area.id === 'cloudtops') {
    for (let x = 70; x < W; x += 210) { ctx.beginPath(); ctx.ellipse(x, ground - 9, 42, 9, 0, 0, Math.PI * 2); ctx.fill(); }
  } else if (info?.area.id === 'airship') {
    ctx.fillRect(0, ground - 5, W, 7);
    for (let x = 12; x < W; x += 58) { ctx.beginPath(); ctx.arc(x, ground - 2, 2, 0, Math.PI * 2); ctx.fill(); }
  } else if (info?.area.id === 'castle') {
    ctx.fillStyle = '#ff5a21';
    for (let x = 20; x < W; x += 54) { ctx.beginPath(); ctx.arc(x, ground + 3, 13, Math.PI, 0); ctx.fill(); }
  }
  ctx.globalAlpha = 1;
}

function drawFighter(p) {
  const image = p.pose === 'alt' && p.alt ? p.alt : p.image;
  const sil = p.pose === 'alt' && p.altSil ? p.altSil : p.sil;
  const height = p.h * (1 - p.squash);
  const width = height * image.width / image.height * (1 + p.squash * 0.65);
  const y = ground + p.z - p.lift;
  const shadow = clamp(1 - p.lift / 100, 0.25, 1);
  ctx.fillStyle = `rgba(0,0,0,${0.24 * shadow * p.alpha})`;
  ctx.beginPath();
  ctx.ellipse(p.x, ground + p.z + 2, width * 0.34 * shadow, 4 * shadow, 0, 0, Math.PI * 2);
  ctx.fill();

  ctx.save();
  ctx.globalAlpha = p.alpha;
  ctx.translate(p.x, y);
  ctx.rotate(p.rot);
  ctx.scale(p.face, 1);
  if (p.pixel) {
    ctx.imageSmoothingEnabled = false;
    ctx.drawImage(image, -width / 2, -height, width, height);
    if (p.flash) { ctx.globalAlpha = p.alpha * p.flash; ctx.drawImage(sil, -width / 2, -height, width, height); }
  } else {
    const slices = 18;
    const sh = image.height / slices;
    const dh = height / slices;
    for (let i = 0; i < slices; i++) {
      const ratio = (slices - i) / slices;
      const bend = p.lean * ratio ** 1.5 * height * 0.2 + Math.sin(p.t * 2.2 + ratio) * ratio * height * 0.006;
      const sy = i * sh;
      const dy = -height + i * dh;
      ctx.drawImage(image, 0, sy, image.width, sh + 0.5, -width / 2 + bend, dy, width, dh + 0.5);
      if (p.flash) {
        ctx.globalAlpha = p.alpha * p.flash;
        ctx.drawImage(sil, 0, sy, image.width, sh + 0.5, -width / 2 + bend, dy, width, dh + 0.5);
        ctx.globalAlpha = p.alpha;
      }
    }
  }
  ctx.restore();
  drawStatus(p, width, y - height);
}

function drawStatus(p, width, top) {
  if (p.alpha < 0.15) return;
  const barWidth = clamp(width * 0.9, 38, 72);
  const left = p.x - barWidth / 2;
  const y = Math.max(36, top - 14);
  ctx.globalAlpha = p.alpha;
  ctx.fillStyle = 'rgba(0,0,0,.72)';
  ctx.fillRect(left - 1, y - 1, barWidth + 2, 8);
  ctx.fillStyle = p.side ? '#e85e56' : '#5bda76';
  ctx.fillRect(left, y, barWidth * clamp(p.hp / p.maxHp, 0, 1), 3);
  ctx.fillStyle = '#ffd43b';
  ctx.fillRect(left, y + 4, barWidth * p.gauge, 2);
  ctx.font = '700 9px ui-monospace, monospace';
  ctx.textAlign = 'center';
  ctx.fillStyle = 'rgba(255,255,255,.9)';
  ctx.shadowColor = '#000';
  ctx.shadowBlur = 3;
  if (p.action || p.unit.boss) ctx.fillText(p.unit.name, p.x, y - 3);
  ctx.shadowBlur = 0;
  ctx.globalAlpha = 1;
}

function drawEffects(dt) {
  for (let i = effects.length - 1; i >= 0; i--) {
    const f = effects[i];
    f.t += dt;
    const k = f.t / f.life;
    if (k >= 1) { effects.splice(i, 1); continue; }
    ctx.globalAlpha = 1 - k;
    if (f.kind === 'spark') {
      f.vy += 330 * dt; f.x += f.vx * dt; f.y += f.vy * dt;
      ctx.fillStyle = f.color; ctx.fillRect(f.x, f.y, 3, 3);
    } else if (f.kind === 'tracer' || f.kind === 'beam') {
      ctx.strokeStyle = f.kind === 'beam' ? '#b68cff' : '#fff5a7';
      ctx.lineWidth = f.kind === 'beam' ? 6 * Math.sin(k * Math.PI) + 1 : 2;
      ctx.beginPath(); ctx.moveTo(f.x, f.y); ctx.lineTo(f.x2, f.y2); ctx.stroke();
    } else if (f.kind === 'lob') {
      const x = lerp(f.x, f.x2, k); const y = lerp(f.y, f.y2, k) - Math.sin(k * Math.PI) * 60;
      ctx.fillStyle = '#d88cff'; ctx.beginPath(); ctx.arc(x, y, 6, 0, Math.PI * 2); ctx.fill();
    } else if (f.kind === 'poof') {
      ctx.strokeStyle = '#fff'; ctx.lineWidth = 3; ctx.beginPath(); ctx.arc(f.x, f.y, 8 + k * 24, 0, Math.PI * 2); ctx.stroke();
    } else if (f.kind === 'heal') {
      ctx.strokeStyle = '#6ff29a'; ctx.lineWidth = 2; ctx.beginPath(); ctx.arc(f.x, f.y, 8 + k * 30, 0, Math.PI * 2); ctx.stroke();
    }
    ctx.globalAlpha = 1;
  }
  for (let i = texts.length - 1; i >= 0; i--) {
    const text = texts[i];
    text.t += dt;
    const k = text.t / text.life;
    if (k >= 1) { texts.splice(i, 1); continue; }
    ctx.globalAlpha = 1 - k;
    ctx.font = `900 ${text.size}px ui-monospace, monospace`;
    ctx.textAlign = 'center';
    ctx.lineWidth = 3;
    ctx.strokeStyle = 'rgba(0,0,0,.75)';
    ctx.strokeText(text.text, text.x, text.y - ease(k) * 25);
    ctx.fillStyle = text.color;
    ctx.fillText(text.text, text.x, text.y - ease(k) * 25);
    ctx.globalAlpha = 1;
  }
}

function updateTurnOrder() {
  const active = [...heroes, ...enemies].filter((p) => !p.dead && !p.action);
  active.sort((a, b) => {
    const aTime = (1 - a.gauge) * actionSeconds(a.unit.spd, a.style);
    const bTime = (1 - b.gauge) * actionSeconds(b.unit.spd, b.style);
    return aTime - bTime;
  });
  turnOrder.textContent = active.slice(0, 4).map((p) => p.unit.name).join('  ›  ') || '—';
}

function showAnnouncement(text) {
  clearTimeout(announceTimer);
  announce.textContent = text;
  announce.classList.add('show');
  announceTimer = setTimeout(() => announce.classList.remove('show'), 1200 / TIME_SCALE);
}

function frame(now) {
  if (!alive) return;
  const dt = Math.min(0.05, (now - last) / 1000) * TIME_SCALE;
  last = now;
  ctx.clearRect(0, 0, W, H);
  drawEnvironment();
  updateWorld(dt);
  const fighters = [...enemies, ...heroes].sort((a, b) => a.z - b.z);
  for (const p of fighters) drawFighter(p);
  drawEffects(dt);
  updateTurnOrder();
  requestAnimationFrame(frame);
}

window.stripDebug = {
  state: () => ({
    stage: game.stage, wave, phase, modifier: modifier?.id,
    heroes: heroes.map((p) => ({ id: p.unit.id, hp: p.hp, x: p.x, gauge: p.gauge, action: p.action?.style || null })),
    enemies: enemies.map((p) => ({ id: p.unit.id, hp: p.hp, x: p.x, gauge: p.gauge, action: p.action?.style || null })),
    lastResult,
  }),
};

resize();
game.welcome();
updateHud();
startStage();
requestAnimationFrame((time) => { last = time; frame(time); });
