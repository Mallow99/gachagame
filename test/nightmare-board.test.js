import test from 'node:test';
import assert from 'node:assert/strict';
import { storyboardReceipt, makeStoryboard, sampleStoryboard, sampleResultLights, sampleDededeRain } from '../demos/splash-kit/nightmare-board-model.js';
import { storyboardAudioEvents } from '../demos/splash-kit/nightmare-board-audio.js';
import { readFileSync } from 'node:fs';
import { createHash } from 'node:crypto';
import { CUE } from '../demos/splash-kit/cue-model.js';

test('Nightmare storyboard explicitly uses immutable authored fixtures, not transactions or odds', () => {
  assert.throws(() => storyboardReceipt(2));
  const receipt = storyboardReceipt(10);
  assert.equal(receipt.source, 'authored-storyboard'); assert.equal(receipt.results.length, 10);
  assert.equal(receipt.results[5].name, 'King Dedede'); assert.equal(receipt.results[5].rarity, 'SSR');
  assert.equal(receipt.results[7].name, 'Nightmare'); assert.equal(receipt.results[7].rarity, 'UR');
  assert.equal(receipt.results[9].rarity, 'R');
  assert.ok(Object.isFrozen(receipt) && Object.isFrozen(receipt.results) && receipt.results.every(Object.isFrozen));
});

test('Nightmare board retains shared flight times and gives the new UR explicit action/camera gates', () => {
  for (const count of [1, 10]) {
    const board = makeStoryboard(storyboardReceipt(count));
    assert.equal(board.beats.find(b => b.id === 'silver').start, CUE.silver + board.delay);
    assert.equal(board.beats.find(b => b.id === 'gold').start, CUE.gold + board.delay);
    assert.equal(board.beats.find(b => b.id === 'rainbow').start, CUE.rainbow + board.delay);
    assert.equal(board.beats.find(b => b.id === 'impact').start, CUE.impact + board.delay);
    const ur = board.beats.filter(b => b.result?.rarity === 'UR');
    assert.deepEqual(ur.map(b => b.phase), ['call', 'sweep', 'covered', 'hands', 'open', 'dark', 'emerge', 'wrap', 'face', 'pullback', 'adjust', 'lock', 'rarity', 'name', 'hold', ...(count === 10 ? ['resume'] : [])]);
    assert.equal(ur[0].duration, 4.8); assert.equal(ur.find(b => b.phase === 'pullback').duration, 2.6);
    board.beats.forEach((beat, i) => {
      assert.ok(beat.duration > 0); assert.equal(beat.start, i ? board.beats[i - 1].end : 0);
      assert.ok(beat.visual && beat.music && beat.sound && beat.camera);
    });
  }
});

test('curtains expose only darkness before emergence, then face/pullback precede identity', () => {
  const board = makeStoryboard(storyboardReceipt(1));
  const sample = phase => { const b = board.beats.find(b => b.phase === phase); return sampleStoryboard(b.start + b.duration * .5, board); };
  for (const phase of ['call', 'sweep', 'covered', 'hands', 'open', 'dark']) assert.equal(sample(phase).nightmareVisible, false);
  for (const phase of ['open', 'dark', 'emerge', 'wrap', 'face', 'pullback', 'adjust', 'lock']) { assert.equal(sample(phase).identity, false); assert.equal(sample(phase).rarity, false); }
  assert.equal(sample('rarity').rarity, true); assert.equal(sample('rarity').identity, false);
  assert.equal(sample('name').identity, true); assert.ok(sample('face').roll > 0);
  const emergence = board.beats.find(b => b.phase === 'emerge');
  assert.ok(sampleStoryboard(emergence.start + .1, board).faceY > sampleStoryboard(emergence.end - .1, board).faceY);
  assert.equal(sample('emerge').faceOnly, true); assert.equal(sample('emerge').zoom, 1);
  assert.ok(sample('wrap').wrap > 0 && sample('wrap').wrap < 1);
  const adjust = board.beats.find(b => b.phase === 'adjust');
  assert.ok(sampleStoryboard(adjust.start + .1, board).poseY > sampleStoryboard(adjust.end - .1, board).poseY);
  assert.equal(sample('lock').poseY, -18); assert.equal(sample('name').poseY, -18);
  const pull = board.beats.find(b => b.phase === 'pullback');
  assert.ok(sampleStoryboard(pull.start + .1, board).zoom > sampleStoryboard(pull.end - .1, board).zoom);
  for (const phase of ['emerge', 'face', 'pullback']) { const b = board.beats.find(b => b.phase === phase); const s = sampleStoryboard(b.start + .1, board, true); assert.equal(s.zoom, 1); assert.equal(s.roll, 0); }
});

test('each travelling light upgrades only to its own pre-decided rarity without sorting results', () => {
  const results = storyboardReceipt(10).results, original = JSON.stringify(results), delay = 9 * CUE.spacing;
  const ranks = time => sampleResultLights(time, results).map(l => l.rank);
  assert.deepEqual(ranks(1.5), Array(10).fill(0));
  assert.deepEqual(ranks(CUE.silver + delay + .1), [0, 0, 1, 0, 0, 1, 0, 1, 1, 0]);
  assert.deepEqual(ranks(CUE.gold + delay + .1), [0, 0, 1, 0, 0, 2, 0, 2, 1, 0]);
  assert.deepEqual(ranks(CUE.rainbow + delay + .1), [0, 0, 1, 0, 0, 2, 0, 3, 1, 0]);
  const lights = sampleResultLights(6.1, results);
  assert.deepEqual(lights.map(l => l.result), results); assert.equal(lights[7].result.name, 'Nightmare');
  assert.equal(lights[9].rank, 0); assert.equal(JSON.stringify(results), original);
  // A different already-decided order drives the cue, not hard-coded slot six/eight.
  const reordered = [results[7], results[2], ...results.filter((_, i) => ![7, 2].includes(i))];
  assert.deepEqual(sampleResultLights(6.1, reordered).map(l => l.rank), reordered.map(r => ({ R: 0, SR: 1, SSR: 2, UR: 3 })[r.rarity]));
  assert.equal(sampleResultLights(6.1, storyboardReceipt(1).results)[0].rank, 3);
  assert.ok(sampleResultLights(6.1, results, true).every(l => l.scale === 1));
});

test('R/SR filtering and skips preserve SSR/UR windows and the complete ten-pull fixture', () => {
  const receipt = storyboardReceipt(10), original = JSON.stringify(receipt);
  const all = makeStoryboard(receipt), filtered = makeStoryboard(receipt, { highOnly: true });
  assert.ok(filtered.total < all.total);
  assert.equal(filtered.beats.filter(b => b.phase === 'arrival').length, 0);
  assert.equal(filtered.beats.find(b => b.phase === 'ssr-pullback').duration, 1.5);
  assert.equal(filtered.beats.filter(b => b.phase.startsWith('ssr-')).length, 8);
  assert.equal(filtered.beats.filter(b => b.phase === 'call').length, 2);
  for (const board of [all, filtered]) {
    assert.equal(sampleStoryboard(board.total, board).phase, 'lineup');
    assert.deepEqual(sampleStoryboard(board.total, board).results, receipt.results);
    const resume = board.beats.find(b => b.phase === 'resume'), next = board.beats[board.beats.indexOf(resume) + 1];
    assert.equal(next.result?.slot ?? 9, 9);
  }
  assert.equal(JSON.stringify(receipt), original);
});

test('Dedede action is separately storyboarded, deterministic and settles before identity', () => {
  const board = makeStoryboard(storyboardReceipt(10));
  const phases = board.beats.filter(b => b.result?.rarity === 'SSR').map(b => b.phase);
  assert.deepEqual(phases, ['call', 'ssr-screen', 'ssr-face', 'ssr-shower', 'ssr-pullback', 'ssr-lock', 'ssr-rarity', 'ssr-name', 'ssr-hold']);
  assert.deepEqual(sampleDededeRain(.9), sampleDededeRain(.9));
  assert.ok(sampleDededeRain(.9).filter(d => d.visible).length > 5);
  assert.ok(sampleDededeRain(4).every(d => !d.visible));
  assert.deepEqual(sampleDededeRain(.2, true), sampleDededeRain(1.5, true));
  const sprite = JSON.parse(readFileSync(new URL('../demos/splash-kit/assets/board/SOURCES.json', import.meta.url)))['waddle-dee'];
  assert.equal(createHash('sha256').update(readFileSync(new URL('../demos/splash-kit/assets/board/waddle-dee.png', import.meta.url))).digest('hex'), sprite.sha256);
  assert.ok(sprite.sourcePage && sprite.credit && sprite.sourceFiles.length);
});

test('two-sided closure matches the covered pose; wrap and face share the same camera endpoint', () => {
  const board = makeStoryboard(storyboardReceipt(1));
  const at = (phase, p) => { const b = board.beats.find(b => b.phase === phase); return sampleStoryboard(b.start + b.duration * p, board); };
  assert.ok(at('sweep', .1).curtainSpread > at('sweep', .9).curtainSpread);
  assert.ok(at('sweep', .99999).curtainSpread < 1e-8);
  assert.equal(at('covered', 0).curtainSpread, 0);
  const end = at('wrap', .99999), start = at('face', 0);
  assert.ok(Math.abs(end.zoom - start.zoom) < 1e-8); assert.equal(end.roll, start.roll);
  assert.ok(end.wrap > .99999); assert.equal(end.faceY, start.faceY);
});

test('audio follows individual light tiers and real beat times; no theme overlaps concealed calls', () => {
  for (const count of [1, 10]) {
    const board = makeStoryboard(storyboardReceipt(count)), events = storyboardAudioEvents(board), beds = events.filter(e => e.kind === 'music');
    const calls = board.beats.filter(b => b.phase === 'call');
    for (const call of calls) {
      assert.ok(beds.every(m => m.end <= call.start || m.at >= call.end));
      assert.equal(events.find(e => e.at === call.start)?.kind, call.result.rarity === 'SSR' ? 'voice' : undefined);
    }
    assert.equal(events.filter(e => e.kind === 'voice').length, count === 10 ? 1 : 0);
    assert.ok(events.some(e => e.kind === 'omen'));
    assert.ok(beds.some(e => e.track === 'nightmare-theme'));
    const rankCounts = { silver: count === 10 ? 4 : 1, gold: count === 10 ? 2 : 1, rainbow: 1 };
    for (const [kind, n] of Object.entries(rankCounts)) assert.equal(events.filter(e => e.kind === kind).length, n);
    assert.ok(events.every(e => e.at >= 0 && e.at < board.total && (!e.end || e.end > e.at)));
    const impact = board.beats.find(b => b.phase === 'impact');
    assert.ok(beds.every(m => m.end < impact.start || m.at > impact.start + .3));
  }
});
