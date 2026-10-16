import { storyboardReceipt, makeStoryboard, sampleStoryboard, sampleResultLights } from './nightmare-board-model.js';
import { COLOURS, TIERS } from './cue-model.js';
import { storyboardScene } from './nightmare-board-scene.js';
import { cueAudio } from './cue-audio.js';
import { storyboardAudioEvents } from './nightmare-board-audio.js';
import { loadNightmareNative } from './nightmare-native.js';

const $ = id => document.getElementById(id);
const reduced = matchMedia('(prefers-reduced-motion: reduce)');
const waddleDee = new Image(); waddleDee.src = new URL('assets/board/waddle-dee.png', import.meta.url);
const spriteReady = await waddleDee.decode().then(() => true).catch(() => false);
const nativeRig = await loadNightmareNative().catch(() => null);
const draw = storyboardScene($('boardScene'), waddleDee, nativeRig);
$('boardNative').disabled = !nativeRig;
if (!nativeRig) { $('boardNative').checked = false; $('layerStatus').textContent = 'Native pieces could not load; the approved schematic remains usable.'; }
if (new URLSearchParams(location.search).get('art') === 'schematic') $('boardNative').checked = false;
if (new URLSearchParams(location.search).get('art') === 'native' && nativeRig) $('boardNative').checked = true;
const audioBase = new URL('assets/audio/cue02/', import.meta.url), musicBase = new URL('assets/audio/areas/', import.meta.url);
const [calls, music] = await Promise.all([audioBase, musicBase].map(async base => {
  try { const r = await fetch(new URL('SOURCES.json', base)); if (!r.ok) return {}; return await r.json(); } catch { return {}; }
}));
const audio = cueAudio(calls, audioBase, { manifest: music, base: musicBase }, storyboardAudioEvents);
let sound = false;
let receipt, board, current = 0, playing = false, frame = 0, previousFrame = 0, pendingCount = 1, banner = true, railBeat;

function pause() { playing = false; cancelAnimationFrame(frame); audio.stop(); }
function startAudio(transition = 0) {
  if (!sound) return;
  const options = { area: 'dream', volume: Number($('boardVolume').value), transition };
  if (banner) audio.banner({ ...options, track: 'dream-banner' });
  else if (playing) audio.play(current, board, options);
}
function seek(time) { if (!board || banner) return; pause(); current = Math.max(0, Math.min(board.total, time)); render(); }
function goNext() {
  if (!board || banner) return;
  const index = board.beats.indexOf(sampleStoryboard(current, board).beat);
  seek(board.beats[index + 1]?.start ?? board.total);
}
function goPrevious() {
  const index = board.beats.indexOf(sampleStoryboard(current, board).beat);
  seek(board.beats[Math.max(0, index - 1)].start);
}
function buildRail() {
  $('beatRail').replaceChildren();
  for (const beat of board.beats) {
    const button = document.createElement('button'), time = document.createElement('small');
    button.type = 'button'; button.dataset.beat = beat.id; time.textContent = `${beat.start.toFixed(1)} s · ${beat.duration.toFixed(1)} s hold`;
    button.append(time, document.createTextNode(beat.title)); button.addEventListener('click', () => seek(beat.start)); $('beatRail').append(button);
  }
  $('boardSeek').max = board.total;
}
function showBanner() {
  playing = false; cancelAnimationFrame(frame); banner = true; if (sound) startAudio(.7); else audio.stop();
  render(); document.querySelector('[data-pull="1"]').focus({ preventScroll: true });
}
function startReview(count) {
  playing = false; cancelAnimationFrame(frame); receipt = storyboardReceipt(count); board = makeStoryboard(receipt, { highOnly: $('boardHighOnly').checked });
  current = 0; banner = false; railBeat = null; buildRail();
  $('boardHighOnly').disabled = count === 1;
  $('resultList').replaceChildren();
  $('lightOrder').replaceChildren();
  receipt.results.forEach(() => $('lightOrder').append(document.createElement('li')));
  receipt.results.forEach(result => { const li = document.createElement('li'); li.textContent = `${result.name}${result.name.includes('fighter') ? '' : ` · ${result.rarity}`}`; $('resultList').append(li); });
  render(); play({ transition: .7 }); $('boardStage').scrollIntoView({ block: 'start', behavior: 'instant' }); $('boardPlay').focus({ preventScroll: true });
}
function play({ transition = 0 } = {}) {
  if (banner || !board) return;
  if (playing) { pause(); render(); return; }
  if (current >= board.total) current = 0;
  playing = true; previousFrame = performance.now(); startAudio(transition); render(); frame = requestAnimationFrame(tick);
}
function tick(now) {
  if (!playing) return;
  current = Math.min(board.total, current + (now - previousFrame) / 1000); previousFrame = now;
  if (current >= board.total) pause();
  render(); if (playing) frame = requestAnimationFrame(tick);
}
function render() {
  const native = $('boardNative').checked && !!nativeRig, explode = $('boardExplode').checked;
  $('boardExplode').disabled = !native; $('nativePieces').hidden = !native;
  const track = music[audio.state.musicTrack];
  $('musicNow').textContent = sound && track ? `${track.title} · ${track.game} (${track.year})` : sound ? 'Music clears for the call / impact, or playback is paused.' : 'Sound off';
  $('bannerCopy').hidden = $('bannerActions').hidden = !banner;
  $('boardTransport').hidden = $('beatInspector').hidden = $('beatRail').hidden = $('tapAdvance').hidden = banner;
  $('boardResult').hidden = true;
  $('boardIdentity').hidden = $('concealedCall').hidden = true;
  $('lightKey').hidden = true;
  if (banner) { $('boardStage').dataset.phase = 'banner'; $('sceneLabel').textContent = native ? 'Native-layer feasibility proof · not final art' : 'Approved schematic · not final art'; draw(null, null, { banner: true, native, explode }); return; }
  const state = sampleStoryboard(current, board, reduced.matches), b = state.beat;
  draw(state, board, { reduced: reduced.matches, guides: $('cameraGuides').checked, native, explode });
  $('boardStage').dataset.phase = state.phase;
  $('boardStage').dataset.count = receipt.results.length;
  $('lightKey').hidden = state.phase !== 'flight' || receipt.results.length === 1;
  if (state.phase === 'flight') sampleResultLights(current, receipt.results, reduced.matches).forEach((light, i) => {
    const item = $('lightOrder').children[i]; item.textContent = `${i + 1} ${TIERS[light.rank]}`;
    item.style.setProperty('--light-colour', COLOURS[light.rank]); item.dataset.rank = light.rank;
  });
  $('sceneLabel').textContent = `${b.group} · ${native && (state.nightmareVisible || ['hands', 'open', 'dark'].includes(state.phase)) ? 'native-layer proof' : 'schematic blocking'}${state.dededeVisible && !spriteReady ? ' · sprite fallback' : ''}`;
  $('beatGroup').textContent = `${b.group} · ${b.duration.toFixed(1)} s`;
  $('beatTitle').textContent = b.title; $('beatVisual').textContent = b.visual;
  $('cameraLane').textContent = b.camera; $('musicLane').textContent = b.music; $('soundLane').textContent = b.sound;
  $('concealedCall').hidden = state.phase !== 'call';
  $('callLabel').textContent = b.result?.rarity === 'SSR' ? 'A familiar laugh in the dark' : 'Something stirs in the dark';
  const ssrIdentity = ['ssr-rarity', 'ssr-name', 'ssr-hold'].includes(state.phase);
  const showIdentity = (state.nightmareVisible && state.rarity) || ssrIdentity;
  $('boardIdentity').hidden = !showIdentity;
  $('boardIdentity').dataset.rarity = ssrIdentity ? 'SSR' : 'UR';
  $('identityRarity').textContent = ssrIdentity ? state.phase === 'ssr-rarity' ? ['S', 'S S', 'S S R'][Math.min(2, Math.floor(state.progress * 3))] : 'S S R' : state.phase === 'rarity' && state.progress < .5 ? 'U' : 'U R';
  const showName = ['ssr-name', 'ssr-hold'].includes(state.phase) || state.identity;
  $('identityName').hidden = $('identitySource').hidden = !showName;
  $('identityName').textContent = ssrIdentity ? 'King Dedede' : 'Nightmare';
  $('boardClock').textContent = `${current.toFixed(1)} / ${board.total.toFixed(1)} s`; $('boardSeek').value = current;
  $('boardPlay').textContent = playing ? 'Pause' : current >= board.total ? 'Replay storyboard' : current > 0 ? 'Resume' : 'Play storyboard';
  $('previous').disabled = current === 0; $('next').disabled = current >= board.total; $('tapAdvance').disabled = current >= board.total;
  $('boardResult').hidden = state.phase !== 'lineup';
  if (railBeat !== b.id) {
    railBeat = b.id;
    [...$('beatRail').children].forEach(button => button.setAttribute('aria-current', button.dataset.beat === b.id ? 'step' : 'false'));
    const active = $('beatRail').querySelector('[aria-current="step"]');
    $('beatRail').scrollLeft = active.offsetLeft - $('beatRail').clientWidth / 2 + active.offsetWidth / 2;
  }
}

document.querySelectorAll('[data-pull]').forEach(button => button.addEventListener('click', () => {
  pendingCount = Number(button.dataset.pull);
  $('confirmTitle').textContent = pendingCount === 1 ? 'Review a single pull?' : 'Review a ten-pull?';
  $('confirmDescription').textContent = pendingCount === 1 ? 'A fixed Nightmare UR shows the complete entrance, camera and identity sequence.' : 'A fixed ten-character lineup: Dedede SSR in slot six, Nightmare UR in slot eight. Each travelling light upgrades to its own result’s rarity, without changing result order.';
  $('pullConfirm').returnValue = '';
  $('pullConfirm').showModal();
}));
$('pullConfirm').addEventListener('close', () => { if ($('pullConfirm').returnValue === 'play') startReview(pendingCount); });
$('boardPlay').addEventListener('click', play); $('next').addEventListener('click', goNext); $('previous').addEventListener('click', goPrevious);
$('tapAdvance').addEventListener('click', goNext); $('backBanner').addEventListener('click', showBanner);
$('boardScene').addEventListener('click', () => { if (!banner) goNext(); });
$('boardSkip').addEventListener('click', () => seek(board.total));
$('boardSeek').addEventListener('input', () => seek(Number($('boardSeek').value)));
$('cameraGuides').addEventListener('change', render);
$('boardNative').addEventListener('change', () => { if (!banner) pause(); render(); });
$('boardExplode').addEventListener('change', () => { if (!banner) pause(); render(); });
$('boardSound').addEventListener('click', async () => {
  if (sound) { sound = false; audio.stop(); $('boardSound').textContent = 'Enable sound'; $('boardSound').setAttribute('aria-pressed', 'false'); render(); return; }
  $('boardSound').disabled = true; $('audioStatus').textContent = 'Loading verified game recordings…';
  try {
    if (!calls.dedede || !music.dream || !music['nightmare-theme']) throw Error('Audio manifest unavailable');
    await audio.enable(); sound = true; $('boardSound').textContent = 'Mute sound'; $('boardSound').setAttribute('aria-pressed', 'true'); $('audioStatus').textContent = 'Title theme on the banner; Fountain theme during the pull; source-game boss music for each showcase.'; startAudio(); render();
  }
  catch { $('audioStatus').textContent = 'Audio could not load. The silent storyboard still works; reload the page to retry.'; }
  finally { $('boardSound').disabled = false; }
});
$('boardVolume').addEventListener('input', () => audio.volume(Number($('boardVolume').value)));
$('boardHighOnly').addEventListener('change', () => {
  const old = sampleStoryboard(current, board).beat; pause();
  board = makeStoryboard(receipt, { highOnly: $('boardHighOnly').checked }); buildRail();
  current = board.beats.find(b => b.id === old.id)?.start ?? board.beats.find(b => b.index > old.index)?.start ?? board.beats.at(-1).start;
  railBeat = null; render();
});
document.addEventListener('keydown', event => {
  if (banner || $('pullConfirm').open || event.target.closest('button,input,a,select')) return;
  if (['ArrowRight', ' ', 'Enter'].includes(event.key)) { event.preventDefault(); goNext(); }
  if (event.key === 'ArrowLeft') { event.preventDefault(); goPrevious(); }
});
document.addEventListener('visibilitychange', () => { if (document.hidden) pause(); else if (banner) startAudio(.7); render(); });
reduced.addEventListener('change', render); new ResizeObserver(render).observe($('boardStage'));
window.nightmareBoard = { get state() { return { banner, playing, time: current, count: receipt?.results.length, receipt, board, sound, native: $('boardNative').checked, audio: audio.state, reduced: reduced.matches, sample: board && sampleStoryboard(current, board, reduced.matches) }; }, seek, next: goNext,
  audition: () => audio.audition(board, { area: 'dream', volume: Number($('boardVolume').value) }) };
render();
