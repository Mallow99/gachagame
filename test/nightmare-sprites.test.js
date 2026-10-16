import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { createHash } from 'node:crypto';
import { sampleSpriteScene, posePoint, HANDS, NATIVE_POSE } from '../demos/splash-kit/nightmare-sprite-model.js';

test('sprite curtain and finger contacts stay attached throughout opening and return', () => {
  for (const height of [90, 120]) for (const phase of ['hands', 'open', 'dark', 'wrap']) for (let i = 0; i <= 100; i++) {
    const scene = sampleSpriteScene({ phase, progress: i / 100 }, height);
    for (const grip of scene.grips) {
      assert.deepEqual(grip.handContact, grip.clothContact);
      assert.ok(Number.isFinite(grip.anchor.x) && Number.isFinite(grip.anchor.y));
    }
  }
});
test('return ends at the exact source pose hands and the same close-up camera', () => {
  const wrap = sampleSpriteScene({ phase: 'wrap', progress: 1 });
  const face = sampleSpriteScene({ phase: 'face', progress: 0 });
  assert.deepEqual(wrap.camera, face.camera); assert.equal(wrap.bodyReveal, 1); assert.equal(wrap.clothFrame, 7); assert.equal(wrap.release, 1);
  for (const grip of wrap.grips) {
    const h = HANDS[grip.side];
    assert.deepEqual(grip.anchor, posePoint(face.camera, h.origin[0] + h.grip[0], h.origin[1] + h.grip[1]));
    assert.equal(grip.scale, face.camera.scale);
  }
  assert.deepEqual(sampleSpriteScene({ phase: 'face', progress: 1 }).camera, sampleSpriteScene({ phase: 'pullback', progress: 0 }).camera);
  assert.deepEqual(sampleSpriteScene({ phase: 'pullback', progress: 1 }).camera, sampleSpriteScene({ phase: 'adjust', progress: 0 }).camera);
  assert.deepEqual(sampleSpriteScene({ phase: 'adjust', progress: 1 }).camera, sampleSpriteScene({ phase: 'lock', progress: 0 }).camera);
});
test('native face rises alone and reduced-motion framing remains stable', () => {
  assert.ok(sampleSpriteScene({ phase: 'emerge', progress: .1 }).headY > sampleSpriteScene({ phase: 'emerge', progress: .9 }).headY);
  for (const phase of ['hands', 'emerge', 'wrap', 'face', 'pullback', 'hold']) assert.deepEqual(sampleSpriteScene({ phase, progress: .2 }, 120, true), sampleSpriteScene({ phase, progress: .8 }, 120, true));
});
test('all native and authored sprite files retain dimensions, provenance and hashes', () => {
  const base = new URL('../demos/splash-kit/assets/nightmare-sprites/', import.meta.url);
  const manifest = JSON.parse(readFileSync(new URL('SOURCES.json', base)));
  assert.deepEqual(manifest.poseSize, [NATIVE_POSE.width, NATIVE_POSE.height]); assert.deepEqual(manifest.headPivot, NATIVE_POSE.pivot);
  for (const [name, asset] of Object.entries(manifest.assets)) {
    const bytes = readFileSync(new URL(asset.url, base));
    assert.equal(createHash('sha256').update(bytes).digest('hex'), asset.sha256, name);
    assert.deepEqual([bytes.readUInt32BE(16), bytes.readUInt32BE(20)], asset.dimensions, name);
    assert.ok(['native', 'authored', 'derived-native'].includes(asset.origin));
  }
  for (const side of ['left', 'right']) {
    assert.deepEqual(manifest.hands[side].rect.slice(0, 2), HANDS[side].origin);
    assert.deepEqual(manifest.hands[side].grip, HANDS[side].grip);
  }
});
