// Dream Land banner demo. The game's own pull transaction (src/gacha.js drawPulls)
// decides every result; this file only stages it: banner -> summon theater ->
// splash or card reveal -> ten-pull results -> banner. The demo save lives in memory.
import { createSplash } from './splash/engine.js';
import { playSummon } from './summon.js';
import dededeRig from './rigs/king-dedede.js';

// One splash rig per fighter id. A fighter without a rig gets the card reveal.
const RIGS = { [dededeRig.unitId]: dededeRig };
const FEATURED_RIG = dededeRig;
const BANNER_ID = 'ka-fighter';
const START_STARLIGHT = 3000;
const RANK = { R: 0, SR: 1, SSR: 2, UR: 3 };

const $ = id => document.getElementById(id);
const stage = $('stage'), summonCanvas = $('summon');
const kitBase = new URL('./', import.meta.url);
const gameRoot = new URL(document.querySelector('meta[name="game-root"]').content, location.href);
const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
const sleep = ms => new Promise(r => setTimeout(r, ms));
const pct = x => `${(x * 100).toFixed(2)}%`;

let save, banner, engine, content, saveMod, gacha, RULES, portraits, summonBg;
let busy = false, soundOn = false, onContinue = null, onSkip = null;
const fanfare = new Audio(new URL('assets/audio/reveal/kirby-adventure-fanfare.mp3', gameRoot));
fanfare.volume = 0.6;
const voice = new Audio(new URL(FEATURED_RIG.voice, kitBase));
voice.volume = 0.9;

function toast(text) {
  const el = $('toast'); el.textContent = text; el.classList.add('on');
  clearTimeout(toast.t); toast.t = setTimeout(() => el.classList.remove('on'), 2600);
}

function demoSave() {
  const s = saveMod.defaultSave();
  s.progression.worlds[saveMod.KIRBY_WORLD] = { ...saveMod.worldProgress(), highestStageCleared: 20, firstClearEncounterIds: ['ka-01'] };
  s.progression.availableWorldIds.push(saveMod.KIRBY_WORLD);
  // Skip the first-pull welcome SR so the demo shows ordinary odds.
  s.progression.hubWelcome.kirby = { pulls: 1, newSr: true };
  s.inventory.starlight = START_STARLIGHT;
  return s;
}

function sourceLabel(sourceGameId) {
  const world = content.worlds.get(sourceGameId);
  if (world) return `${world.name} · ${world.releaseYear}`;
  const m = sourceGameId.match(/^(.*)-(\d{4})$/);
  if (!m) return sourceGameId;
  const name = m[1].split('-').map(w => w === 'kirbys' ? "Kirby's" : ['to', 'of', 'the'].includes(w) ? w : w[0].toUpperCase() + w.slice(1)).join(' ');
  return `${name} · ${m[2]}`;
}

const portrait = (id, thumb = false) => {
  const p = portraits[id];
  return p ? new URL(thumb ? p.thumbnailUrl : p.url, gameRoot).href : '';
};

function renderBanner() {
  $('bannerTitle').textContent = banner.name;
  $('bannerDesc').textContent = banner.description;
  const rates = gacha.publishedRates(banner, save);
  const featured = rates.find(r => r.itemId === FEATURED_RIG.unitId);
  $('featuredNote').textContent = `${pct(featured.probability)} per summon · takes half of every SSR`;
  $('starlight').textContent = save.inventory.starlight.toLocaleString('en-US');
  const p = save.banners.fighter;
  $('pityLine').textContent = `SSR guaranteed within ${RULES.fighter.hard - p.sinceSsr} summons` + (p.featuredGuarantee ? ' · next SSR is King Dedede' : '');
  $('pull1').disabled = save.inventory.starlight < RULES.fighter.cost;
  $('pull10').disabled = save.inventory.starlight < RULES.fighter.cost * 10;

  const body = $('ratesBody'); body.textContent = '';
  for (const tier of ['SSR', 'SR', 'R']) {
    const rows = rates.filter(r => r.rarity === tier);
    const h = document.createElement('h3');
    h.textContent = `${tier} · ${pct(rows.reduce((n, r) => n + r.probability, 0))}`;
    const table = document.createElement('table');
    for (const r of rows) {
      const tr = table.insertRow();
      tr.insertCell().textContent = content.units.get(r.itemId).name + (r.itemId === FEATURED_RIG.unitId ? ' (rate up)' : '');
      tr.insertCell().textContent = pct(r.probability);
    }
    body.append(h, table);
  }
  const note = document.createElement('p');
  note.textContent = `SSR chance rises after ${RULES.fighter.soft} summons without one; summon ${RULES.fighter.hard} guarantees it. Every ${RULES.fighter.srHard}th summon is at least SR. Losing the SSR 50/50 guarantees King Dedede next time.`;
  body.append(note);
}

function setState(state) { stage.dataset.state = state; }

/** Resolves when the player clicks, taps, or presses Space/Enter. A press before
 *  `readyAfter` ms calls `onEarly` (show everything now) instead of leaving. */
function waitContinue(readyAfter, onEarly) {
  return new Promise(resolve => {
    let ready = false;
    const timer = setTimeout(() => { ready = true; }, readyAfter);
    onContinue = () => {
      if (!ready) { ready = true; clearTimeout(timer); onEarly?.(); return; }
      onContinue = null; resolve();
    };
  });
}

function fadeOutSummon() {
  if (summonCanvas.hidden) return;
  summonCanvas.classList.add('fading');
  setTimeout(() => { summonCanvas.hidden = true; summonCanvas.classList.remove('fading'); }, 460);
}

async function showSplash(result) {
  const unit = content.units.get(result.id), rig = RIGS[result.id];
  const ui = $('splashUi'), plate = $('plate'), quote = $('quote'), hint = $('splashHint');
  plate.classList.remove('on'); quote.classList.remove('on'); hint.classList.remove('on');
  $('plateRarity').textContent = result.rarity;
  $('plateNew').textContent = result.isNew ? 'NEW!' : `★${result.stars} · +${result.echoes} Echoes`;
  $('plateSmall').textContent = rig.nameplate.small;
  $('plateBig').textContent = rig.nameplate.big;
  $('plateTitle').textContent = unit.title;
  $('plateSource').textContent = sourceLabel(unit.sourceGameId);
  $('credit').textContent = rig.credit;
  quote.textContent = '';
  const words = (rig.quote || unit.presentation?.quote || '').split(' ').map(w => { const s = document.createElement('span'); s.textContent = w + ' '; quote.append(s); return s; });

  setState('splash'); ui.hidden = false;
  engine.setCharacterAlpha(1); engine.setMode('splash', { instant: true }); engine.setRunning(true);
  fadeOutSummon();

  const timers = [];
  const showAll = () => {
    timers.forEach(clearTimeout); engine.skipIntro();
    plate.classList.add('on'); quote.classList.add('on'); words.forEach(w => w.classList.add('in')); hint.classList.add('on');
  };
  if (reduced) showAll();
  else {
    engine.playIntro(() => plate.classList.add('on'));
    timers.push(setTimeout(() => quote.classList.add('on'), 1400));
    words.forEach((w, i) => timers.push(setTimeout(() => w.classList.add('in'), 1580 + i * 125)));
    if (soundOn) {
      voice.currentTime = 0; fanfare.currentTime = 0;
      timers.push(setTimeout(() => voice.play().catch(() => {}), 1350));
      timers.push(setTimeout(() => fanfare.play().catch(() => {}), 3850));
    }
    timers.push(setTimeout(() => hint.classList.add('on'), 5200));
  }
  onSkip = () => onContinue?.();
  await waitContinue(reduced ? 0 : 5200, showAll);
  ui.hidden = true; onSkip = null;
}

async function showCard(result, { urPreview = false } = {}) {
  const ui = $('cardUi'), img = $('cardImg');
  const rarity = urPreview ? 'UR' : result.rarity;
  ui.className = `card-ui r-${rarity}`;
  $('cardRarity').className = `chip r-${rarity}`; $('cardRarity').textContent = rarity;
  if (urPreview) {
    img.hidden = true;
    $('cardName').textContent = 'UR effect preview';
    $('cardTitle').textContent = 'No UR fighters exist yet. This shows the rainbow Warp Star tier only.';
    $('cardNew').textContent = '';
  } else {
    const unit = content.units.get(result.id);
    img.hidden = false; img.src = portrait(result.id); img.alt = unit.name;
    $('cardName').textContent = unit.name; $('cardTitle').textContent = unit.title;
    $('cardNew').textContent = result.isNew ? 'NEW!' : `★${result.stars} · +${result.echoes} Echoes`;
  }
  const card = $('card'); card.style.animation = 'none'; void card.offsetWidth; card.style.animation = '';
  setState('card'); ui.hidden = false;
  engine.setCharacterAlpha(0); engine.setRunning(true);
  fadeOutSummon();
  onSkip = () => onContinue?.();
  await waitContinue(reduced ? 0 : 450);
  ui.hidden = true; onSkip = null;
}

async function showResults(results) {
  const grid = $('resultsGrid'); grid.textContent = '';
  results.forEach((r, i) => {
    const unit = content.units.get(r.id);
    const li = document.createElement('li'); li.className = `result r-${r.rarity}`; li.style.animationDelay = `${i * 70}ms`;
    li.innerHTML = '<div class="result-art"><img alt=""></div><div class="result-text"><span class="chip"></span><p class="result-name"></p></div>';
    li.querySelector('img').src = portrait(r.id, true); li.querySelector('img').alt = unit.name;
    const chip = li.querySelector('.chip'); chip.className = `chip r-${r.rarity}`; chip.textContent = r.rarity;
    li.querySelector('.result-name').textContent = unit.name;
    if (r.isNew) { const n = document.createElement('span'); n.className = 'result-new'; n.textContent = 'NEW'; li.append(n); }
    grid.append(li);
  });
  setState('results'); $('resultsUi').hidden = false; $('skipBtn').hidden = true;
  engine.setCharacterAlpha(0); engine.setRunning(true);
  fadeOutSummon();
  await new Promise(resolve => { onContinue = null; $('resultsDone').onclick = resolve; $('resultsDone').focus(); });
  $('resultsUi').hidden = true;
}

function forcedRandom(tier) {
  // drawPulls calls random() for the tier roll, then (for SSR) the 50/50, then the pick.
  const sequence = { R: [0.9], SR: [0.1], SSR: [0.001, 0.1], UR: [0.001, 0.1] }[tier];
  let i = 0;
  return () => (i < sequence.length ? sequence[i++] : Math.random());
}

async function pull(count, force = null) {
  if (busy) return;
  let results;
  try {
    if (force) {
      const preview = structuredClone(save);
      preview.inventory.starlight = 1e6; preview.banners.fighter = saveMod.pity();
      results = gacha.drawPulls(preview, banner, 1, forcedRandom(force)).receipt.results;
    } else {
      const out = gacha.drawPulls(save, banner, count);
      save = out.save; results = out.receipt.results;
    }
  } catch (e) { toast(e.message); return; }
  busy = true; $('rates').hidden = true;
  renderBanner();

  const tier = force === 'UR' ? 'UR' : results.reduce((best, r) => RANK[r.rarity] > RANK[best] ? r.rarity : best, 'R');
  setState('summon');
  engine.setRunning(false);
  summonCanvas.hidden = false;
  $('skipBtn').hidden = false;
  const run = playSummon(summonCanvas, { tier, background: summonBg, reducedMotion: reduced });
  onSkip = () => run.skip();
  await run.done;
  onSkip = null;

  if (force === 'UR') await showCard(null, { urPreview: true });
  else {
    const reveals = count === 10 ? results.filter(r => RANK[r.rarity] >= RANK.SSR) : results;
    for (const r of reveals) await (RIGS[r.id] ? showSplash(r) : showCard(r));
    if (count === 10) await showResults(results);
  }

  $('skipBtn').hidden = true;
  engine.setCharacterAlpha(1); engine.setRunning(true); engine.setMode('banner');
  setState('banner');
  busy = false;
}

function wireControls() {
  $('pull1').addEventListener('click', () => pull(1));
  $('pull10').addEventListener('click', () => pull(10));
  $('ratesBtn').addEventListener('click', () => { $('rates').hidden = false; });
  $('ratesClose').addEventListener('click', () => { $('rates').hidden = true; });
  $('skipBtn').addEventListener('click', e => { e.stopPropagation(); onSkip?.(); });
  for (const id of ['splashUi', 'cardUi']) $(id).addEventListener('click', () => onContinue?.());
  document.querySelectorAll('[data-force]').forEach(b => b.addEventListener('click', () => pull(1, b.dataset.force)));
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape') onSkip?.();
    else if ((e.key === ' ' || e.key === 'Enter') && onContinue && !(e.target instanceof HTMLButtonElement)) { e.preventDefault(); onContinue(); }
  });
  const view = $('rigView');
  for (const id of engine.deformers) view.add(new Option(`Weights: ${id}`, id));
  view.addEventListener('change', () => engine.setView(view.value));
  $('pauseBtn').addEventListener('click', e => {
    engine.setPaused(!engine.paused);
    e.currentTarget.setAttribute('aria-pressed', String(engine.paused)); e.currentTarget.textContent = engine.paused ? 'Play' : 'Pause';
  });
  $('soundBtn').addEventListener('click', e => {
    soundOn = !soundOn;
    e.currentTarget.setAttribute('aria-pressed', String(soundOn)); e.currentTarget.textContent = soundOn ? 'Sound on' : 'Sound off';
  });
  $('resetBtn').addEventListener('click', () => { save.inventory.starlight = START_STARLIGHT; renderBanner(); toast('Starlight reset to 3,000.'); });
}

async function main() {
  [gacha, saveMod, { content }, { RULES }] = await Promise.all([
    import(new URL('src/gacha.js', gameRoot)), import(new URL('src/save/default-save.js', gameRoot)),
    import(new URL('src/content/index.js', gameRoot)), import(new URL('src/config/rules.js', gameRoot)),
  ]);
  portraits = await fetch(new URL('assets/portraits/source-era/manifest.json', gameRoot)).then(r => r.json());
  banner = content.banners.get(BANNER_ID);
  save = demoSave();
  summonBg = new Image(); summonBg.src = new URL(FEATURED_RIG.background.src, kitBase).href;
  engine = await createSplash($('splash'), FEATURED_RIG, kitBase);
  await summonBg.decode();
  engine.setMode('banner', { instant: true });
  renderBanner();
  wireControls();
  $('stageMsg').textContent = '';
  setState('banner');
}

main().catch(err => {
  console.error(err);
  $('stageMsg').textContent = `The banner could not start: ${err.message}`;
});
