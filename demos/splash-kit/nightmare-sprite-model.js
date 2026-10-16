// One native coordinate system. No independent face/torso proportions.
import { ease, clamp } from './cue-model.js';

export const NATIVE_POSE = Object.freeze({ width: 82, height: 76, pivot: [39, 18] });
export const HANDS = Object.freeze({ left: { origin: [12, 0], grip: [2, 9] }, right: { origin: [58, 0], grip: [7, 9] } });
const mix = (a, b, p) => a + (b - a) * p;
export function posePoint(camera, x, y) {
  const dx = (x - 39) * camera.scale, dy = (y - 18) * camera.scale;
  return { x: camera.x + dx * Math.cos(camera.roll) - dy * Math.sin(camera.roll), y: camera.y + dx * Math.sin(camera.roll) + dy * Math.cos(camera.roll) };
}
export function sampleSpriteScene(state, height = 90, reduced = false) {
  const { phase, progress: p = 0 } = state;
  const close = { x: 80, y: height * .39, scale: 2.5, roll: 0 };
  const final = { x: 115, y: (height - 76) / 2 + 18, scale: 1, roll: 0 };
  let camera = { ...final, y: final.y + 3 };
  if (['emerge', 'wrap', 'face'].includes(phase)) camera = { ...close };
  if (phase === 'face' && !reduced) { camera.roll = ease(p) * .055; camera.scale = 2.5 + ease(p); }
  if (phase === 'pullback' && !reduced) {
    const q = ease(p); camera = { x: mix(close.x, final.x, q), y: mix(close.y, final.y + 3, q), scale: mix(3.5, 1, q), roll: .055 * (1 - q) };
  }
  if (phase === 'adjust') camera.y = final.y + (reduced ? 0 : 3 * (1 - ease(p)));
  if (['lock', 'rarity', 'name', 'hold', 'resume', 'lineup', 'banner'].includes(phase)) camera = { ...final };
  const reveal = reduced ? 1 : ease(p);
  const spread = phase === 'sweep' ? reduced ? 0 : 1 - reveal : phase === 'open' ? reveal : ['dark', 'emerge', 'wrap'].includes(phase) ? 1 : 0;
  const wrap = phase === 'wrap' ? reveal : 0;
  const grips = ['left', 'right'].map((side, i) => {
    const hand = HANDS[side], x = i ? 78 + 80 * spread : 82 - 80 * spread, y = Math.min(62, height * (i ? .39 : .55));
    const native = posePoint(close, hand.origin[0] + hand.grip[0], hand.origin[1] + hand.grip[1]);
    const anchor = { x: mix(x, native.x, wrap), y: mix(y, native.y, wrap) };
    // Both the cloth and the hand consume this *same* contact, not parallel paths.
    return { side, anchor, clothContact: anchor, handContact: anchor, scale: mix(1.5, close.scale, wrap),
      held: ['open', 'dark', 'wrap'].includes(phase) || phase === 'hands' && (reduced || p >= .55),
      lift: phase === 'hands' ? reduced ? 1 : ease(clamp(p / .55)) : 1 };
  });
  return { camera, grips, wrap, clothFrame: Math.min(7, Math.floor(phase === 'wrap' ? wrap * 8 : spread * 7)),
    headY: phase === 'emerge' ? mix(height + 45, close.y, reveal) : close.y,
    bodyReveal: phase === 'wrap' ? clamp((wrap - .12) / .75) : 1,
    release: phase === 'wrap' ? clamp((wrap - .84) / .16) : 0 };
}
