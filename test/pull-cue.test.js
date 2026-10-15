import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { createHash } from 'node:crypto';
import { CUE, sampleLights, makeTimeline, sampleReveal } from '../demos/splash-kit/cue-model.js';

test('rarity cues accumulate through silver and gold before rainbow, without false upgrades', () => {
  const ranks = [1.5, 3.1, 4.4, 5.8].map(t => sampleLights(t, 'UR', 1)[0].rank);
  assert.deepEqual(ranks, [0, 1, 2, 3]);
  assert.equal(sampleLights(6, 'R', 1)[0].rank, 0);
  assert.equal(sampleLights(6, 'SR', 1)[0].rank, 1);
  assert.equal(sampleLights(6, 'SSR', 1)[0].rank, 2);
  assert.ok(CUE.approach > CUE.rainbow + .45, 'The final upgrade settles before the screen approach.');
});

test('only the tenth travelling light carries the set cue and receipt order stays intact', () => {
  const lights = sampleLights(6.1, 'UR', 10);
  assert.equal(lights.length, 10);
  assert.ok(lights.slice(0, 9).every(l => l.rank === 0 && !l.signal));
  assert.equal(lights[9].rank, 3);
  assert.equal(lights[9].signal, true);
  assert.equal(new Set(lights.map(l => `${l.x.toFixed(5)},${l.y.toFixed(5)}`)).size, 10, 'The orbit turn must not bunch multiple lights into one point.');
  assert.notDeepEqual([lights[0].x, lights[0].y], [lights[9].x, lights[9].y]);
  const results = ['R', 'R', 'SR', 'R', 'R', 'SSR', 'R', 'SR', 'R', 'R'].map((rarity, id) => ({ id, rarity }));
  const timeline = makeTimeline(results, 'UR');
  assert.deepEqual(timeline.segments.map(s => s.result), results);
  assert.equal(timeline.segments[5].result.rarity, 'SSR');
  assert.equal(timeline.segments[9].result.rarity, 'R');
});

test('SSR and UR protect the quote, hold a close-up, then reveal the full lineup', () => {
  for (const tier of ['SSR', 'UR']) {
    const timeline = makeTimeline([{ id: 'fixture', rarity: 'SSR' }], tier);
    const s = timeline.segments[0];
    assert.ok(s.quote >= (tier === 'UR' ? 4.8 : 4));
    for (const age of [.1, s.quote - .01]) {
      const state = sampleReveal(s.start + age, timeline);
      assert.equal(state.phase, 'quote'); assert.equal(state.revealed, 0);
    }
    const closeAt = s.start + s.quote + s.entrance + s.push;
    assert.ok(s.close >= 1.7);
    assert.equal(sampleReveal(closeAt + .1, timeline).zoom, 1.55);
    assert.equal(sampleReveal(closeAt + s.close - .1, timeline).zoom, 1.55);
    const pullAt = closeAt + s.close;
    assert.ok(sampleReveal(pullAt + .2, timeline).zoom > sampleReveal(pullAt + s.pull - .2, timeline).zoom);
    assert.equal(sampleReveal(pullAt + .2, timeline, true).zoom, 1);
    assert.equal(sampleReveal(timeline.total, timeline).phase, 'lineup');
    assert.equal(sampleReveal(timeline.total, timeline).revealed, 1);
  }
  assert.ok(sampleLights(3, 'UR', 10, true).every(l => l.scale === 1));
});

test('cue cutouts retain verified source provenance and reproducible output hashes', () => {
  const root = new URL('../', import.meta.url);
  const dir = new URL('demos/splash-kit/assets/cue-fighters/', root);
  const manifest = JSON.parse(readFileSync(new URL('manifest.json', dir)));
  assert.equal(Object.keys(manifest).length, 8);
  for (const asset of Object.values(manifest)) {
    const hash = file => createHash('sha256').update(readFileSync(file)).digest('hex');
    assert.equal(hash(new URL(asset.source.path, root)), asset.source.sha256);
    assert.equal(hash(new URL(asset.url, dir)), asset.sha256);
    assert.ok(asset.source.url && asset.source.credit);
  }
});
