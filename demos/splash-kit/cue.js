import { CUE, TIERS, COLOURS, clamp, makeTimeline, sampleReveal } from './cue-model.js';
import { cueRenderer } from './cue-renderer.js';

const $ = id => document.getElementById(id);
const gameRoot = new URL(document.querySelector('meta[name="game-root"]').content, location.href);
const reduced = matchMedia('(prefers-reduced-motion: reduce)');
let tier = 'UR', count = 10, elapsed = 0, playing = false, frame = 0, last = 0, ready = false, revision = 0;
let receipt, timeline, renderer, portraits, cutouts, content, gacha, saves, lastPhase = '', previewState, chapterList = [];

function pause() { playing = false; cancelAnimationFrame(frame); }
function seek(time) { pause(); elapsed = Math.max(0, Math.min(timeline.total, time)); render(); }

// Forced previews use the same transaction and pool as the live game, on a fresh
// disposable save. Choosing an illustrated result makes this an art/camera study.
function previewReceipt() {
  const save = saves.defaultSave(0);
  const area = $('area').value;
  const worldId = area === 'dream' ? saves.KIRBY_WORLD : saves.FIRST_WORLD;
  const saga = area === 'dream' ? 'kirby' : 'mario';
  save.progression.worlds[worldId] = { ...saves.worldProgress(), highestStageCleared: 20, firstClearEncounterIds: [area === 'dream' ? 'ka-01' : 'smb1-01'] };
  save.progression.hubWelcome[saga] = { pulls: 20, newSr: true };
  save.inventory.starlight = 1e6;
  const banner = content.banners.get(area === 'dream' ? 'ka-fighter' : 'smb1-overworld-fighter');
  const pool = gacha.bannerPool(banner, save);
  const target = tier === 'UR' ? 'SSR' : tier;
  const desired = count === 1 ? [target] : ['R', 'R', 'SR', 'R', 'R', target === 'SSR' ? 'SSR' : 'R', 'R', 'SR', 'R', 'R'];
  const rolls = [];
  desired.forEach((rarity, i) => {
    rolls.push({ R: .9, SR: .1, SSR: .001 }[rarity]);
    let candidates = pool.filter(e => e.rarity === rarity);
    if (rarity === 'SSR') {
      const featured = candidates.filter(e => banner.featured.some(f => f.itemId === e.itemId));
      // The transaction only draws a 50/50 when an off-banner SSR exists.
      if (featured.length < candidates.length) rolls.push(.1);
      candidates = featured;
    }
    const illustrated = candidates.filter(e => portraits[e.itemId]);
    if (!illustrated.length) throw Error(`No sourced ${rarity} illustration is available.`);
    const chosen = illustrated[(i * 3) % illustrated.length];
    const before = candidates.slice(0, candidates.indexOf(chosen)).reduce((sum, e) => sum + (e.weight || 1), 0);
    const total = candidates.reduce((sum, e) => sum + (e.weight || 1), 0);
    rolls.push((before + (chosen.weight || 1) / 2) / total);
  });
  let index = 0;
  return gacha.drawPulls(save, banner, count, () => {
    if (index >= rolls.length) throw Error('Preview random sequence exhausted.');
    return rolls[index++];
  }, 1000).receipt;
}

function portraitUrl(id) { return cutouts[id] ? new URL(`assets/cue-fighters/${cutouts[id].url}`, import.meta.url).href : new URL(portraits[id].url, gameRoot).href; }
async function loadImage(url) { const image = new Image(); image.src = url; await image.decode(); return image; }

async function rebuild() {
  const version = ++revision;
  pause(); ready = false; elapsed = 0;
  $('play').disabled = $('skip').disabled = $('seek').disabled = true;
  $('loading').hidden = false; $('loading').textContent = 'Preparing the stage…';
  $('hero').hidden = $('cueQuote').hidden = $('complete').hidden = true;
  $('roster').replaceChildren();
  document.querySelectorAll('[data-count]').forEach(b => b.setAttribute('aria-pressed', String(Number(b.dataset.count) === count)));
  document.querySelectorAll('[data-tier]').forEach(b => { b.setAttribute('aria-pressed', String(b.dataset.tier === tier)); b.disabled = count === 10 && b.dataset.tier === 'R'; });
  try {
    const next = previewReceipt();
    await Promise.all([...new Set(next.results.map(r => r.id))].map(id => loadImage(portraitUrl(id))));
    if (version !== revision) return;
    receipt = next; timeline = makeTimeline(receipt.results, tier);
    $('seek').max = timeline.total;
    receipt.results.forEach(result => {
      const li = document.createElement('li'), img = document.createElement('img');
      img.src = portraitUrl(result.id); img.alt = ''; li.setAttribute('aria-label', 'Unopened result');
      li.style.setProperty('--result-colour', COLOURS[TIERS.indexOf(result.rarity)]);
      li.append(img); $('roster').append(li);
    });
    buildChapters(); ready = true; $('loading').hidden = true;
    $('play').disabled = $('skip').disabled = $('seek').disabled = false;
    render();
  } catch (error) {
    if (version !== revision) return;
    $('loading').textContent = `Could not prepare the preview. Reload to retry. ${error.message}`;
  }
}

function buildChapters() {
  const delay = timeline.delay;
  chapterList = [['Blue', 1.6 + delay]];
  for (const [rank, title, at] of [[1, 'Silver', CUE.silver], [2, 'Gold', CUE.gold], [3, 'Rainbow', CUE.rainbow]]) if (TIERS.indexOf(tier) >= rank) chapterList.push([title, at + .55 + delay]);
  chapterList.push(['Screen strike', timeline.impact + .05]);
  const high = timeline.segments.find(s => s.high);
  if (high) chapterList.push(['Quote', high.start + .5], ['Close-up', high.start + high.quote + high.entrance + high.push + .5], ['Pullback', high.start + high.quote + high.entrance + high.push + high.close + .7]);
  chapterList.push(['Full lineup', timeline.lineup + .2]);
  $('chapters').replaceChildren();
  for (const [title, time] of chapterList) {
    const button = document.createElement('button'); button.type = 'button'; button.textContent = title;
    button.addEventListener('click', () => seek(time)); $('chapters').append(button);
  }
}

function render() {
  if (!ready) return;
  const reveal = sampleReveal(elapsed, timeline, reduced.matches);
  const result = renderer.render(elapsed, { tier, count, area: $('area').value, reduced: reduced.matches, timeline, reveal });
  const phase = reveal.phase;
  const segment = reveal.segment || timeline.segments.at(-1);
  const character = content.units.get(segment.result.id);
  $('cueStage').dataset.phase = phase;
  $('cueQuote').hidden = phase !== 'quote';
  $('quoteNote').textContent = `${segment.quote.toFixed(1)} seconds for the line and its pause. Character and name stay concealed.`;
  const showHero = !['flight', 'quote'].includes(phase) && !(phase === 'lineup' && count === 10);
  $('hero').hidden = !showHero;
  if (showHero) {
    const src = portraitUrl(character.id);
    if ($('heroArt').getAttribute('src') !== src) $('heroArt').src = src;
    $('heroArt').alt = character.name;
    $('hero').style.setProperty('--zoom', reveal.zoom);
    $('hero').style.setProperty('--close', (reveal.zoom - 1) / .55);
    $('hero').style.setProperty('--arrival', reveal.entrance ?? 1);
    $('hero').style.setProperty('--plate', phase === 'entrance' ? clamp((reveal.entrance - .5) * 2) : 1);
    $('hero').style.setProperty('--hero-colour', COLOURS[TIERS.indexOf(segment.result.rarity)]);
    $('heroRarity').textContent = tier === 'UR' && segment.high ? 'SSR · UR framing preview' : segment.result.rarity;
    $('heroPrefix').hidden = character.id !== 'king-dedede';
    $('heroName').textContent = character.id === 'king-dedede' ? 'Dedede' : character.name;
    const world = content.worlds.get(character.sourceGameId);
    $('heroSource').textContent = `${world.name} · ${world.releaseYear}`;
  }
  const roster = $('roster');
  roster.hidden = count === 1;
  roster.style.setProperty('--roster', reveal.roster);
  [...roster.children].forEach((li, i) => {
    const open = i < reveal.revealed;
    li.classList.toggle('revealed', open);
    li.setAttribute('aria-label', open ? content.units.get(receipt.results[i].id).name : 'Unopened result');
  });
  $('complete').hidden = phase !== 'lineup';
  $('clock').textContent = `${elapsed.toFixed(1)} / ${timeline.total.toFixed(1)} s`;
  $('seek').value = elapsed;
  $('play').textContent = playing ? 'Pause' : elapsed >= timeline.total ? 'Replay' : elapsed > 0 ? 'Resume' : 'Play visual cue';
  const key = `${phase}-${result.rank}-${segment.index}`;
  if (key !== lastPhase) {
    lastPhase = key;
    $('caption').textContent = phase === 'flight' ? `${TIERS[result.rank]} cue${count === 10 ? ' on light ten; the other nine stay blue' : ''}. Each upgrade builds on the last before the screen strike.` : phase === 'quote' ? 'The line gets room to finish. No character or name appears yet.' : phase === 'closeup' ? 'Hold the close-up and let the character register.' : phase === 'pullback' ? 'Ease back to the full character and the gathered lineup.' : phase === 'lineup' ? 'The full lineup holds until you choose to replay.' : `${character.name} gets a character entrance and time to settle.`;
  }
  previewState = { tier, count, area: $('area').value, elapsed, phase, zoom: reveal.zoom, revealed: reveal.revealed, lights: result.lights.map(l => ({ index: l.index + 1, rank: l.rank, signal: l.signal, x: l.x, y: l.y })), results: receipt.results };
}

function tick(now) {
  if (!playing) return;
  elapsed = Math.min(timeline.total, elapsed + (now - last) / 1000 * Number($('speed').value)); last = now;
  if (elapsed >= timeline.total) pause();
  render(); if (playing) frame = requestAnimationFrame(tick);
}

$('play').addEventListener('click', () => {
  if (playing) { pause(); render(); return; }
  if (elapsed >= timeline.total) elapsed = 0;
  playing = true; last = performance.now(); render(); frame = requestAnimationFrame(tick);
});
$('skip').addEventListener('click', () => seek(timeline.total));
$('seek').addEventListener('input', () => seek(Number($('seek').value)));
document.querySelectorAll('[data-count]').forEach(b => b.addEventListener('click', () => { count = Number(b.dataset.count); if (count === 10 && tier === 'R') tier = 'SR'; rebuild(); }));
document.querySelectorAll('[data-tier]').forEach(b => b.addEventListener('click', () => { tier = b.dataset.tier; rebuild(); }));
$('area').addEventListener('change', rebuild);
reduced.addEventListener('change', render);
document.addEventListener('visibilitychange', () => { if (document.hidden) { pause(); render(); } });
new ResizeObserver(() => render()).observe($('cueStage'));
window.cueReview = { get state() { return { ...previewState, ready }; }, get timeline() { return timeline; }, get chapters() { return chapterList; }, seek };

try {
  const [contentModule, saveModule, gachaModule, manifest, prepared, background] = await Promise.all([
    import(new URL('src/content/index.js', gameRoot)), import(new URL('src/save/default-save.js', gameRoot)), import(new URL('src/gacha.js', gameRoot)),
    fetch(new URL('assets/portraits/source-era/manifest.json', gameRoot)).then(r => { if (!r.ok) throw Error('Portrait manifest unavailable.'); return r.json(); }),
    fetch(new URL('assets/cue-fighters/manifest.json', import.meta.url)).then(r => { if (!r.ok) throw Error('Cue cutout manifest unavailable.'); return r.json(); }),
    loadImage(new URL('assets/fountain-of-dreams/background.jpg', import.meta.url)),
  ]);
  content = contentModule.content; saves = saveModule; gacha = gachaModule; portraits = manifest; cutouts = prepared;
  renderer = cueRenderer($('cueCanvas'), background); await rebuild();
} catch (error) { $('loading').textContent = `Could not prepare the stage. Reload to retry. ${error.message}`; }
