import { CUE, TIERS, COLOURS, clamp, makeTimeline, sampleReveal, advanceTime } from './cue-model.js';
import { cueRenderer } from './cue-renderer.js';
import { cueAudio } from './cue-audio.js';

const $ = id => document.getElementById(id);
const gameRoot = new URL(document.querySelector('meta[name="game-root"]').content, location.href);
const reduced = matchMedia('(prefers-reduced-motion: reduce)');
let tier = 'SSR', count = 10, elapsed = 0, playing = false, frame = 0, last = 0, ready = false, revision = 0, playAttempt = 0;
let receipt, timeline, renderer, portraits, cutouts, content, gacha, saves, mix, voiceManifest, lastPhase = '', previewState, chapterList = [];

function pause() { playing = false; playAttempt++; cancelAnimationFrame(frame); mix?.stop(); }
function seek(time) { pause(); elapsed = Math.max(0, Math.min(timeline.total, time)); render(); }
function audioOptions() { return { tier, area: $('area').value, rate: Number($('speed').value), volume: Number($('volume').value) / 100 }; }
async function start() {
  if (!ready) return;
  const attempt = ++playAttempt;
  if (elapsed >= timeline.total) elapsed = 0;
  if ($('sound').checked) {
    $('audioStatus').textContent = 'Preparing audio…';
    try { await mix.enable(); if (attempt !== playAttempt) return; $('audioStatus').textContent = 'Music, effects and native character calls on.'; }
    catch { $('audioStatus').textContent = 'Audio could not start; visual preview is available.'; }
  }
  if (attempt !== playAttempt || !ready) return;
  if ($('sound').checked) mix.play(elapsed, timeline, audioOptions());
  playing = true; last = performance.now(); render(); frame = requestAnimationFrame(tick);
}
function advance() {
  if (!ready || elapsed >= timeline.lineup) return;
  const next = advanceTime(elapsed, timeline);
  pause(); elapsed = next; render();
  if (elapsed < timeline.lineup) start();
}

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
  $('play').disabled = $('advance').disabled = $('skip').disabled = $('seek').disabled = true;
  $('loading').hidden = false; $('loading').textContent = 'Preparing the stage…';
  $('hero').hidden = $('cueQuote').hidden = $('complete').hidden = true;
  $('roster').replaceChildren();
  document.querySelectorAll('[data-count]').forEach(b => b.setAttribute('aria-pressed', String(Number(b.dataset.count) === count)));
  document.querySelectorAll('[data-tier]').forEach(b => { b.setAttribute('aria-pressed', String(b.dataset.tier === tier)); b.disabled = count === 10 && b.dataset.tier === 'R'; });
  try {
    const next = previewReceipt();
    await Promise.all([...new Set(next.results.map(r => r.id))].map(id => loadImage(portraitUrl(id))));
    if (version !== revision) return;
    receipt = next; timeline = makeTimeline(receipt.results, tier, { highOnly: $('highOnly').checked });
    $('highOnly').disabled = count === 1;
    $('urNotice').hidden = tier !== 'UR';
    lastPhase = '';
    $('seek').max = timeline.total;
    receipt.results.forEach(result => {
      const li = document.createElement('li'), img = document.createElement('img');
      img.src = portraitUrl(result.id); img.alt = ''; li.setAttribute('aria-label', 'Unopened result');
      li.style.setProperty('--result-colour', COLOURS[TIERS.indexOf(result.rarity)]);
      li.append(img); $('roster').append(li);
    });
    buildChapters(); ready = true; $('loading').hidden = true;
    $('play').disabled = $('advance').disabled = $('skip').disabled = $('seek').disabled = false;
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
  if (high) {
    const artAt = high.start + high.quote, camera = high.entrance + high.close;
    chapterList.push(['Quote / call', high.start + .3], ['Low slant', artAt + camera * .15], ['High slant', artAt + camera * .5], ['Centered shot', artAt + camera * .83], ['Pullback', artAt + camera + high.pull * .5], ['SSR / name', artAt + camera + high.pull + high.settle + .5]);
  }
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
  $('quoteText').textContent = voiceManifest[$('area').value === 'dream' ? 'dedede' : 'bowser'].caption;
  $('quoteNote').textContent = 'A character call from the dark.';
  const showHero = !['flight', 'quote'].includes(phase) && !(phase === 'lineup' && count === 10);
  $('hero').hidden = !showHero;
  if (showHero) {
    const src = portraitUrl(character.id);
    if ($('heroArt').getAttribute('src') !== src) $('heroArt').src = src;
    $('heroArt').alt = reveal.name > 0 || phase === 'lineup' ? character.name : 'Character camera study';
    $('hero').style.setProperty('--zoom', reveal.zoom);
    $('hero').style.setProperty('--cam-x', reveal.x || 0);
    $('hero').style.setProperty('--cam-y', reveal.y || 0);
    $('hero').style.setProperty('--cam-roll', reveal.roll || 0);
    $('hero').style.setProperty('--arrival', reveal.entrance ?? 1);
    $('hero').style.setProperty('--name', reveal.name ?? 1);
    $('hero').style.setProperty('--hero-colour', COLOURS[TIERS.indexOf(segment.result.rarity)]);
    $('heroPlate').hidden = !(reveal.plate > 0 || phase === 'lineup');
    $('heroIdentity').hidden = !(reveal.name > 0 || phase === 'lineup');
    const badge = tier === 'UR' && segment.high ? 'UR' : segment.result.rarity;
    if ($('heroRarity').dataset.badge !== badge) {
      $('heroRarity').dataset.badge = badge; $('heroRarity').replaceChildren();
      $('heroRarity').setAttribute('aria-label', badge);
      for (const letter of badge) { const span = document.createElement('span'); span.className = 'rarity-letter'; span.textContent = letter; $('heroRarity').append(span); }
    }
    [...$('heroRarity').children].forEach((letter, i) => letter.style.setProperty('--letter', phase === 'lineup' ? 1 : clamp((reveal.plate - i * .15) / .35)));
    $('heroPrefix').hidden = character.id !== 'king-dedede';
    $('heroName').textContent = character.id === 'king-dedede' ? 'Dedede' : character.name;
    const world = content.worlds.get(character.sourceGameId);
    $('heroSource').textContent = `${world.name} · ${world.releaseYear}${tier === 'UR' && segment.high ? ' · SSR art stand-in for UR effects' : ''}`;
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
  $('play').textContent = playing ? 'Pause' : elapsed >= timeline.total ? 'Replay' : elapsed > 0 ? 'Resume' : $('sound').checked ? 'Play with sound' : 'Play visual cue';
  const key = `${phase}-${result.rank}-${segment.index}`;
  if (key !== lastPhase) {
    lastPhase = key;
    $('caption').textContent = phase === 'flight' ? `${TIERS[result.rank]} cue${count === 10 ? ' on light ten; the other nine stay blue' : ''}. Rainbow appears only in the UR effects preview.` : phase === 'quote' ? 'The character call leads; all art and names stay concealed. Tap to advance.' : phase.startsWith('angle') ? 'Camera slants change the framing. Rarity and name stay hidden.' : phase === 'pullback' ? 'Pull back and align the character with the lineup before showing any name.' : phase === 'settle' ? 'Everything clicks into place.' : phase === 'stamp' ? 'The rarity letters land, then the name follows.' : phase === 'lineup' ? 'All results are retained, including any skipped R/SR entrances.' : `${character.name} settles on the stage.`;
  }
  previewState = { tier, count, area: $('area').value, elapsed, phase, zoom: reveal.zoom, roll: reveal.roll || 0, plate: reveal.plate || 0, name: reveal.name || 0, revealed: reveal.revealed, highOnly: $('highOnly').checked, lights: result.lights.map(l => ({ index: l.index + 1, rank: l.rank, signal: l.signal, x: l.x, y: l.y })), results: receipt.results };
}

function tick(now) {
  if (!playing) return;
  elapsed = Math.min(timeline.total, elapsed + (now - last) / 1000 * Number($('speed').value)); last = now;
  if (elapsed >= timeline.total) pause();
  render(); if (playing) frame = requestAnimationFrame(tick);
}

$('play').addEventListener('click', () => {
  if (playing) { pause(); render(); return; }
  start();
});
$('advance').addEventListener('click', advance);
$('cueStage').addEventListener('click', advance);
$('cueStage').addEventListener('keydown', event => { if (['Enter', ' '].includes(event.key)) { event.preventDefault(); advance(); } });
$('skip').addEventListener('click', () => seek(timeline.total));
$('seek').addEventListener('input', () => seek(Number($('seek').value)));
document.querySelectorAll('[data-count]').forEach(b => b.addEventListener('click', () => { count = Number(b.dataset.count); if (count === 10 && tier === 'R') tier = 'SR'; rebuild(); }));
document.querySelectorAll('[data-tier]').forEach(b => b.addEventListener('click', () => { tier = b.dataset.tier; rebuild(); }));
$('area').addEventListener('change', rebuild);
$('highOnly').addEventListener('change', () => { if (!ready) return; pause(); elapsed = 0; timeline = makeTimeline(receipt.results, tier, { highOnly: $('highOnly').checked }); $('seek').max = timeline.total; buildChapters(); render(); });
$('sound').addEventListener('change', () => { const wasPlaying = playing; pause(); $('audioStatus').textContent = $('sound').checked ? 'Sound enabled. Press Play.' : 'Muted.'; if (wasPlaying) start(); else render(); });
$('volume').addEventListener('input', () => mix?.volume(Number($('volume').value) / 100));
$('speed').addEventListener('change', () => { if (playing) { pause(); start(); } });
reduced.addEventListener('change', render);
document.addEventListener('visibilitychange', () => { if (document.hidden) { pause(); render(); } });
new ResizeObserver(() => render()).observe($('cueStage'));
window.cueReview = { get state() { return { ...previewState, ready, playing, audio: mix?.state }; }, get timeline() { return timeline; }, get chapters() { return chapterList; }, seek, advance, async audition() { await mix.enable(); return mix.audition(timeline, audioOptions()); } };

try {
  const [contentModule, saveModule, gachaModule, manifest, prepared, calls, background] = await Promise.all([
    import(new URL('src/content/index.js', gameRoot)), import(new URL('src/save/default-save.js', gameRoot)), import(new URL('src/gacha.js', gameRoot)),
    fetch(new URL('assets/portraits/source-era/manifest.json', gameRoot)).then(r => { if (!r.ok) throw Error('Portrait manifest unavailable.'); return r.json(); }),
    fetch(new URL('assets/cue-fighters/manifest.json', import.meta.url)).then(r => { if (!r.ok) throw Error('Cue cutout manifest unavailable.'); return r.json(); }),
    fetch(new URL('assets/audio/cue02/SOURCES.json', import.meta.url)).then(r => { if (!r.ok) throw Error('Native call manifest unavailable.'); return r.json(); }),
    loadImage(new URL('assets/fountain-of-dreams/background.jpg', import.meta.url)),
  ]);
  content = contentModule.content; saves = saveModule; gacha = gachaModule; portraits = manifest; cutouts = prepared; voiceManifest = calls;
  mix = cueAudio(calls, new URL('assets/audio/cue02/', import.meta.url));
  renderer = cueRenderer($('cueCanvas'), background); await rebuild();
} catch (error) { $('loading').textContent = `Could not prepare the stage. Reload to retry. ${error.message}`; }
