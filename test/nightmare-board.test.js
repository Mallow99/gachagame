import test from 'node:test';
import assert from 'node:assert/strict';
import { storyboardReceipt, makeStoryboard, sampleStoryboard } from '../demos/splash-kit/nightmare-board-model.js';
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
    assert.deepEqual(ur.map(b => b.phase), ['call', 'sweep', 'covered', 'hands', 'open', 'cast', 'face', 'pullback', 'lock', 'rarity', 'name', 'hold', ...(count === 10 ? ['resume'] : [])]);
    assert.equal(ur[0].duration, 4.8); assert.equal(ur.find(b => b.phase === 'pullback').duration, 2.6);
    board.beats.forEach((beat, i) => {
      assert.ok(beat.duration > 0); assert.equal(beat.start, i ? board.beats[i - 1].end : 0);
      assert.ok(beat.visual && beat.music && beat.sound && beat.camera);
    });
  }
});

test('Nightmare stays concealed until the cloak opens, identity follows lock, and reduced motion removes camera travel', () => {
  const board = makeStoryboard(storyboardReceipt(1));
  const sample = phase => { const b = board.beats.find(b => b.phase === phase); return sampleStoryboard(b.start + b.duration * .5, board); };
  for (const phase of ['call', 'sweep', 'covered', 'hands']) assert.equal(sample(phase).nightmareVisible, false);
  for (const phase of ['open', 'cast', 'face', 'pullback', 'lock']) { assert.equal(sample(phase).identity, false); assert.equal(sample(phase).rarity, false); }
  assert.equal(sample('rarity').rarity, true); assert.equal(sample('rarity').identity, false);
  assert.equal(sample('name').identity, true); assert.ok(sample('cast').roll < 0 && sample('face').roll > 0);
  const pull = board.beats.find(b => b.phase === 'pullback');
  assert.ok(sampleStoryboard(pull.start + .1, board).zoom > sampleStoryboard(pull.end - .1, board).zoom);
  for (const phase of ['cast', 'face', 'pullback']) { const b = board.beats.find(b => b.phase === phase); const s = sampleStoryboard(b.start + .1, board, true); assert.equal(s.zoom, 1); assert.equal(s.roll, 0); }
});

test('R/SR filtering and skips preserve SSR/UR windows and the complete ten-pull fixture', () => {
  const receipt = storyboardReceipt(10), original = JSON.stringify(receipt);
  const all = makeStoryboard(receipt), filtered = makeStoryboard(receipt, { highOnly: true });
  assert.ok(filtered.total < all.total);
  assert.equal(filtered.beats.filter(b => b.phase === 'arrival').length, 0);
  assert.equal(filtered.beats.find(b => b.phase === 'ssr').duration, 8.5);
  assert.equal(filtered.beats.filter(b => b.phase === 'call').length, 2);
  for (const board of [all, filtered]) {
    assert.equal(sampleStoryboard(board.total, board).phase, 'lineup');
    assert.deepEqual(sampleStoryboard(board.total, board).results, receipt.results);
    const resume = board.beats.find(b => b.phase === 'resume'), next = board.beats[board.beats.indexOf(resume) + 1];
    assert.equal(next.result?.slot ?? 9, 9);
  }
  assert.equal(JSON.stringify(receipt), original);
});
