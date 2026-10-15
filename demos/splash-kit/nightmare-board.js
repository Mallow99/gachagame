import { storyboardReceipt, makeStoryboard, sampleStoryboard } from './nightmare-board-model.js';
import { storyboardScene } from './nightmare-board-scene.js';

const $ = id => document.getElementById(id);
const reduced = matchMedia('(prefers-reduced-motion: reduce)');
const draw = storyboardScene($('boardScene'));
let receipt, board, current = 0, playing = false, frame = 0, previousFrame = 0, pendingCount = 1, banner = true, railBeat;

function pause() { playing = false; cancelAnimationFrame(frame); }
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
  pause(); banner = true; render(); document.querySelector('[data-pull="1"]').focus({ preventScroll: true });
}
function startReview(count) {
  pause(); receipt = storyboardReceipt(count); board = makeStoryboard(receipt, { highOnly: $('boardHighOnly').checked });
  current = 0; banner = false; railBeat = null; buildRail();
  $('boardHighOnly').disabled = count === 1;
  $('resultList').replaceChildren();
  receipt.results.forEach(result => { const li = document.createElement('li'); li.textContent = `${result.name}${result.name.includes('fighter') ? '' : ` · ${result.rarity}`}`; $('resultList').append(li); });
  render(); play(); $('boardStage').scrollIntoView({ block: 'start', behavior: 'instant' }); $('boardPlay').focus({ preventScroll: true });
}
function play() {
  if (banner || !board) return;
  if (playing) { pause(); render(); return; }
  if (current >= board.total) current = 0;
  playing = true; previousFrame = performance.now(); render(); frame = requestAnimationFrame(tick);
}
function tick(now) {
  if (!playing) return;
  current = Math.min(board.total, current + (now - previousFrame) / 1000); previousFrame = now;
  if (current >= board.total) pause();
  render(); if (playing) frame = requestAnimationFrame(tick);
}
function render() {
  $('bannerCopy').hidden = $('bannerActions').hidden = !banner;
  $('boardTransport').hidden = $('beatInspector').hidden = $('beatRail').hidden = $('tapAdvance').hidden = banner;
  $('boardResult').hidden = true;
  $('boardIdentity').hidden = $('concealedCall').hidden = true;
  if (banner) { $('boardStage').dataset.phase = 'banner'; $('sceneLabel').textContent = 'Banner composition · not final art'; draw(null, null, { banner: true }); return; }
  const state = sampleStoryboard(current, board, reduced.matches), b = state.beat;
  draw(state, board, { reduced: reduced.matches, guides: $('cameraGuides').checked });
  $('boardStage').dataset.phase = state.phase;
  $('boardStage').dataset.count = receipt.results.length;
  $('sceneLabel').textContent = `${b.group} · schematic blocking only`;
  $('beatGroup').textContent = `${b.group} · ${b.duration.toFixed(1)} s`;
  $('beatTitle').textContent = b.title; $('beatVisual').textContent = b.visual;
  $('cameraLane').textContent = b.camera; $('musicLane').textContent = b.music; $('soundLane').textContent = b.sound;
  $('concealedCall').hidden = state.phase !== 'call';
  $('callLabel').textContent = b.result?.rarity === 'SSR' ? 'A familiar laugh in the dark' : 'A character sound in the dark';
  // SSR timing is already reviewed in cue 04. The board keeps identity after
  // its compressed camera drawing; the new UR has separate explicit beats.
  const ssrIdentity = state.phase === 'ssr' && state.progress > .7;
  const showIdentity = (state.nightmareVisible && state.rarity) || ssrIdentity;
  $('boardIdentity').hidden = !showIdentity;
  $('boardIdentity').dataset.rarity = ssrIdentity ? 'SSR' : 'UR';
  $('identityRarity').textContent = ssrIdentity ? 'S S R' : state.phase === 'rarity' && state.progress < .5 ? 'U' : 'U R';
  const showName = ssrIdentity || state.identity;
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
  $('confirmDescription').textContent = pendingCount === 1 ? 'A fixed Nightmare UR shows the complete entrance, camera and identity sequence.' : 'A fixed ten-character lineup: Dedede SSR in slot six, Nightmare UR in slot eight. The tenth travelling light signals the set’s UR; it does not reorder results.';
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
document.addEventListener('visibilitychange', () => { if (document.hidden) { pause(); render(); } });
reduced.addEventListener('change', render); new ResizeObserver(render).observe($('boardStage'));
window.nightmareBoard = { get state() { return { banner, playing, time: current, count: receipt?.results.length, receipt, board, reduced: reduced.matches, sample: board && sampleStoryboard(current, board, reduced.matches) }; }, seek, next: goNext };
render();
