import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { createHash } from 'node:crypto';
import { CUE, sampleLights, makeTimeline, sampleReveal, advanceTime } from '../demos/splash-kit/cue-model.js';
import { cueAudioEvents } from '../demos/splash-kit/cue-audio.js';

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

test('SSR and UR preserve the quote, change slants, then lock before rarity and name', () => {
  for (const tier of ['SSR', 'UR']) {
    const timeline = makeTimeline([{ id: 'fixture', rarity: 'SSR' }], tier);
    const s = timeline.segments[0];
    assert.ok(s.quote >= (tier === 'UR' ? 4.8 : 4));
    for (const age of [.1, s.quote - .01]) {
      const state = sampleReveal(s.start + age, timeline);
      assert.equal(state.phase, 'quote'); assert.equal(state.revealed, 0);
    }
    const artAt = s.start + s.quote, camera = s.entrance + s.close;
    const low = sampleReveal(artAt + camera * .15, timeline);
    const high = sampleReveal(artAt + camera * .5, timeline);
    assert.ok(low.roll < 0 && high.roll > 0);
    for (const fraction of [.15, .5, .83]) {
      const shot = sampleReveal(artAt + camera * fraction, timeline);
      assert.equal(shot.plate, 0); assert.equal(shot.name, 0);
    }
    const pullAt = artAt + camera;
    assert.ok(sampleReveal(pullAt + .2, timeline).zoom > sampleReveal(pullAt + s.pull - .2, timeline).zoom);
    assert.equal(sampleReveal(pullAt + .2, timeline, true).zoom, 1);
    assert.equal(sampleReveal(pullAt + .2, timeline, true).roll, 0);
    const lockAt = pullAt + s.pull;
    assert.equal(sampleReveal(lockAt + .1, timeline).plate, 0);
    const stamp = sampleReveal(lockAt + s.settle + .1, timeline);
    assert.ok(stamp.plate > 0); assert.equal(stamp.name, 0);
    assert.equal(sampleReveal(timeline.total, timeline).phase, 'lineup');
    assert.equal(sampleReveal(timeline.total, timeline).revealed, 1);
  }
  assert.ok(sampleLights(3, 'UR', 10, true).every(l => l.scale === 1));
});

test('SSR-only filtering and click-through preserve all ten receipt results', () => {
  const results = ['R', 'R', 'SR', 'R', 'R', 'SSR', 'R', 'SR', 'R', 'R'].map((rarity, id) => ({ id, rarity }));
  const original = JSON.stringify(results);
  const all = makeTimeline(results, 'SSR'), filtered = makeTimeline(results, 'SSR', { highOnly: true });
  assert.ok(filtered.total < all.total);
  assert.equal(filtered.segments.filter(s => !s.skipped).length, 1);
  assert.equal(sampleReveal(filtered.reveal, filtered).segment.index, 5);
  assert.equal(sampleReveal(filtered.total, filtered).revealed, 10);
  const s = filtered.segments[5];
  const art = advanceTime(s.start + .1, filtered);
  assert.equal(sampleReveal(art, filtered).phase, 'angle-low');
  assert.equal(sampleReveal(advanceTime(art, filtered), filtered).phase, 'pullback');
  assert.equal(sampleReveal(advanceTime(advanceTime(art, filtered), filtered), filtered).phase, 'stamp');
  assert.equal(JSON.stringify(results), original);
  const ordinary = makeTimeline(results.filter(r => r.rarity !== 'SSR'), 'SR', { highOnly: true });
  assert.equal(sampleReveal(advanceTime(0, ordinary), ordinary).phase, 'lineup');
  assert.equal(sampleReveal(ordinary.total, ordinary).revealed, 9);
});

test('audio keeps music outside voice and blackout windows and reserves rainbow for UR', () => {
  const timeline = makeTimeline([{ rarity: 'SSR' }], 'SSR');
  const events = cueAudioEvents(timeline, 'SSR'), segment = timeline.segments[0];
  assert.equal(events.filter(e => e.kind === 'voice').length, 1);
  assert.ok(!events.some(e => e.kind === 'rainbow'));
  assert.ok(cueAudioEvents(timeline, 'UR').some(e => e.kind === 'rainbow'));
  assert.ok(!events.some(e => e.kind === 'music' && e.at > segment.start - .65 && e.at < segment.start + segment.quote));
  assert.ok(!events.some(e => e.kind === 'music' && e.at > CUE.contact - .7 && e.at < CUE.impact + .5));
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

test('native character calls retain credited originals and verified playback assets', () => {
  const root = new URL('../', import.meta.url);
  const dir = new URL('demos/splash-kit/assets/audio/cue02/', root);
  const manifest = JSON.parse(readFileSync(new URL('SOURCES.json', dir)));
  assert.deepEqual(Object.keys(manifest).sort(), ['bowser', 'dedede']);
  for (const asset of Object.values(manifest)) {
    const hash = file => createHash('sha256').update(readFileSync(file)).digest('hex');
    assert.equal(hash(new URL(asset.source.path, root)), asset.source.sha256);
    assert.equal(hash(new URL(asset.url, dir)), asset.sha256);
    assert.ok(asset.source.url && asset.source.page && asset.source.credit && asset.source.archiveSha256);
    assert.ok(asset.duration > 1 && asset.duration < 2);
    assert.match(asset.caption, /^\[.+\]$/);
  }
});
