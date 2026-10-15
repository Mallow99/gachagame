import test from 'node:test';
import assert from 'node:assert/strict';
import { existsSync } from 'node:fs';
import { deformerWeights, deformRig, shapeWeight } from '../demos/splash-kit/splash/deform.js';
import dedede from '../demos/splash-kit/rigs/king-dedede.js';
import { content } from '../src/content/index.js';

const RIGS = [dedede];
const TYPES = new Set(['rotate', 'scale', 'stretchY', 'translate', 'wave']);
const kit = path => new URL(`../demos/splash-kit/${path}`, import.meta.url);

function grid(n) {
  const uv = [];
  for (let j = 0; j <= n; j++) for (let i = 0; i <= n; i++) uv.push(i / n, j / n);
  return new Float32Array(uv);
}

for (const rig of RIGS) {
  test(`${rig.unitId} rig is complete and points at real content`, () => {
    const unit = content.units.get(rig.unitId);
    assert.ok(unit, 'unitId must be a fighter in src/content');
    assert.ok(unit.presentation?.quote, 'the splash shows the fighter quote');
    assert.ok(existsSync(kit(rig.art.src)) && existsSync(kit(rig.background.src)), 'baked art exists; run tools/splash-kit/prepare_art.py');
    const ids = new Set();
    for (const d of rig.deformers) {
      assert.ok(TYPES.has(d.type), `${d.id}: type`);
      assert.ok(!ids.has(d.id), `${d.id}: duplicate id`); ids.add(d.id);
      assert.ok(d.mask.length > 0, `${d.id}: mask`);
      for (const ref of d.minus || []) assert.ok(rig.deformers.some(x => x.id === ref), `${d.id}: minus ${ref}`);
      if (d.type !== 'translate' && d.type !== 'wave') assert.equal(d.pivot.length, 2, `${d.id}: pivot`);
    }
    assert.deepEqual(Object.keys(rig.framing.banner).sort(), Object.keys(rig.framing.splash).sort(), 'framings must tween key for key');
    assert.ok(rig.eyes.length <= 2);
  });

  test(`${rig.unitId} rig does not visibly bend a flat render`, () => {
    const aspect = 1017 / 1000, uv = grid(40), out = new Float32Array(uv.length), rest = new Float32Array(uv.length);
    const weights = deformerWeights(rig, uv, aspect);
    const still = { ...rig, deformers: rig.deformers.map(d => ({ ...d, amount: 0, amplitude: [0, 0] })) };
    deformRig(still, weights, uv, rest, 0, aspect, [0, 0], 1);
    let maxMove = 0, feetMove = 0;
    for (let t = 0; t < 6; t += 0.25) {
      deformRig(rig, weights, uv, out, t, aspect, [0, 0], 1);
      for (let i = 0; i < uv.length / 2; i++) {
        const d = Math.hypot(out[i * 2] - rest[i * 2], out[i * 2 + 1] - rest[i * 2 + 1]);
        maxMove = Math.max(maxMove, d);
        if (uv[i * 2 + 1] === 1) feetMove = Math.max(feetMove, d);
      }
    }
    assert.ok(feetMove < 0.002, `bottom edge drifted ${feetMove}`);
    if (rig.art.motion === 'rigid') assert.ok(maxMove < 0.002, `rigid art warped by ${maxMove} render heights`);
    else assert.ok(maxMove > 0.005 && maxMove < 0.06, `largest vertex travel ${maxMove} (render heights)`);
  });
}

test('mask shapes fall off smoothly', () => {
  assert.equal(shapeWeight({ circle: [0.5, 0.5, 0.2] }, 0.5, 0.5, 1), 1);
  assert.equal(shapeWeight({ circle: [0.5, 0.5, 0.2] }, 0.9, 0.5, 1), 0);
  const mid = shapeWeight({ rect: [0.2, 0.2, 0.8, 0.8], soft: 0.05 }, 0.2, 0.5, 1);
  assert.ok(mid > 0.4 && mid < 0.6);
  assert.equal(shapeWeight({ capsule: [0.1, 0.1, 0.9, 0.9, 0.1] }, 0.5, 0.5, 1), 1);
});

test('the featured Dream Land fighter has a splash rig', () => {
  const banner = content.banners.get('ka-fighter');
  for (const f of banner.featured) assert.ok(RIGS.some(r => r.unitId === f.itemId), `${f.itemId} needs a rig in demos/splash-kit/rigs`);
});
