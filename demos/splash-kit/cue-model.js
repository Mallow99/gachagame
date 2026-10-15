// Presentation samples only. No result generation, saves or economy rules live here.
export const TIERS = ['R', 'SR', 'SSR', 'UR'];
export const COLOURS = ['#65ccff', '#dce4ef', '#ffcf49', '#c5afff'];
export const CUE = Object.freeze({ launch: 1.1, orbit: 2, orbitEnd: 6.2, silver: 2.5, gold: 3.85, rainbow: 5.2, approach: 6.2, contact: 7.1, impact: 7.35, reveal: 8.1, spacing: .095 });
export const clamp = x => Math.max(0, Math.min(1, x));
export const ease = x => { const t = clamp(x); return t * t * (3 - 2 * t); };

export function upgradeAt(time, tier) {
  const ceiling = TIERS.indexOf(tier);
  const beats = [0, CUE.silver, CUE.gold, CUE.rainbow];
  let rank = 0;
  while (rank < ceiling && time >= beats[rank + 1]) rank++;
  return { rank, blend: rank ? ease((time - beats[rank]) / .45) : 1, pulse: rank ? 1 - clamp((time - beats[rank]) / .8) : 0 };
}

// Match position, velocity AND acceleration at both ends of a bridge. The old
// launch met the orbit at a right angle and its depth also jumped at the join.
function bridge(t, seconds, [from, speedIn, accelIn], [to, speedOut, accelOut]) {
  const v = speedIn * seconds, a = accelIn * seconds * seconds / 2;
  const distance = to - from - v - a, speed = speedOut * seconds - v - 2 * a;
  const accel = accelOut * seconds * seconds - 2 * a;
  return from + v * t + a * t ** 2 + (10 * distance - 4 * speed + accel / 2) * t ** 3
    + (-15 * distance + 7 * speed - accel) * t ** 4 + (6 * distance - 3 * speed + accel / 2) * t ** 5;
}
const orbitSpeed = Math.PI * 2 / (CUE.orbitEnd - CUE.orbit);
const orbitX = [.15, 0, .35 * orbitSpeed ** 2];
const orbitY = [.5, -.24 * orbitSpeed, -.035 * orbitSpeed ** 2];
const orbitDepth = [1, -.22 * orbitSpeed, 0];

export function flightPoint(time) {
  if (time < CUE.orbit) {
    const t = clamp((time - CUE.launch) / (CUE.orbit - CUE.launch));
    const seconds = CUE.orbit - CUE.launch;
    return { x: bridge(t, seconds, [.5, 0, 0], orbitX), y: bridge(t, seconds, [.76, 0, 0], orbitY), scale: bridge(t, seconds, [1, 0, 0], orbitDepth), approach: 0 };
  }
  if (time < CUE.approach) {
    const angle = (time - CUE.orbit) * orbitSpeed;
    return { x: .5 - .35 * Math.cos(angle), y: .5 - .24 * Math.sin(angle) - .035 * (1 - Math.cos(angle)), scale: 1 - .22 * Math.sin(angle), approach: 0 };
  }
  const t = clamp((time - CUE.approach) / (CUE.contact - CUE.approach));
  const seconds = CUE.contact - CUE.approach;
  return { x: bridge(t, seconds, orbitX, [.5, 0, 0]), y: bridge(t, seconds, orbitY, [.48, .3, 0]), scale: bridge(t, seconds, orbitDepth, [16, 50, 100]), approach: t };
}

export function sampleLights(time, tier, count, reduced = false) {
  return Array.from({ length: count }, (_, index) => {
    const local = time - index * CUE.spacing;
    const signal = index === count - 1;
    const upgrade = upgradeAt(local, signal ? tier : 'R');
    const point = reduced ? { x: count === 1 ? .5 : .12 + index * .76 / 9, y: .48, scale: 1, approach: 0 } : flightPoint(local);
    return { ...point, ...upgrade, signal, index, local, alpha: clamp(local / .6) * (reduced ? 1 : 1 - ease((local - CUE.contact) / .12)) };
  });
}

export function makeTimeline(results, cueTier, { highOnly = false } = {}) {
  const delay = (results.length - 1) * CUE.spacing;
  let cursor = CUE.reveal + delay;
  const segments = results.map((result, index) => {
    const high = TIERS.indexOf(result.rarity) >= 2;
    const dedede = high && result.id === 'king-dedede';
    const ur = high && cueTier === 'UR';
    const quote = high ? ur ? 4.8 : 4 : 0;
    const screen = dedede ? .6 : 0;
    const entrance = dedede ? .45 : high ? .5 : result.rarity === 'SR' ? .45 : .35;
    const close = dedede ? 1.15 : high ? ur ? 1.25 : 1 : 0;
    const pull = dedede ? 2.15 : high ? .75 : 0;
    const settle = dedede ? .45 : high ? .22 : 0;
    const stamp = dedede ? 1.2 : high ? .6 : .3;
    const nameDelay = dedede ? .8 : .25, nameDuration = dedede ? 1 : .25;
    const linger = dedede ? 2.5 : high ? .8 : result.rarity === 'SR' ? .7 : .45;
    const skipped = highOnly && results.length > 1 && !high;
    const duration = skipped ? 0 : quote + screen + entrance + close + pull + settle + stamp + linger;
    const segment = { index, result, high, skipped, payoff: dedede ? 'dedede' : null, music: dedede ? 'dedede-theme' : null, start: cursor, quote, screen, entrance, close, pull, settle, stamp, nameDelay, nameDuration, linger, end: cursor + duration };
    cursor = segment.end;
    return segment;
  });
  return { delay, impact: CUE.impact + delay, reveal: CUE.reveal + delay, segments, resultCount: results.length, lineup: cursor, total: cursor + 1.5 };
}

export function sampleReveal(time, timeline, reduced = false) {
  const segment = timeline.segments.find(s => time >= s.start && time < s.end);
  if (!segment) return { phase: time >= timeline.lineup ? 'lineup' : 'flight', revealed: time >= timeline.lineup ? timeline.resultCount : 0, zoom: 1, x: 0, y: 0, roll: 0, plate: time >= timeline.lineup ? 1 : 0, roster: time >= timeline.lineup ? 1 : 0 };
  const age = time - segment.start;
  if (age < segment.quote) return { phase: 'quote', segment, revealed: segment.index, zoom: 1, roster: 0 };
  const arrival = age - segment.quote;
  const cameraAge = arrival - segment.screen;
  const camera = segment.entrance + segment.close;
  const pullAt = segment.screen + camera;
  const wideAt = pullAt + segment.pull;
  const stampAt = wideAt + segment.settle;
  let zoom = 1, x = 0, y = 0, roll = 0;
  let phase = arrival < segment.entrance ? 'entrance' : 'wide';
  if (segment.high && arrival < pullAt) {
    const shot = clamp(cameraAge / camera);
    phase = shot < .34 ? 'angle-low' : shot < .68 ? 'angle-high' : 'angle-center';
    if (segment.payoff === 'dedede') {
      zoom = 2.15; x = -29; y = -4;
      roll = shot < .25 ? -5 * (1 - ease(shot / .25)) : shot < .5 ? 4 * Math.sin((shot - .25) * Math.PI * 4) ** 2 : 0;
      phase = shot < .25 ? 'angle-low' : shot < .5 ? 'angle-high' : 'angle-center';
    }
    else if (shot < .34) { zoom = 1.95 + shot * .2; x = -9; y = 16; roll = -8; }
    else if (shot < .68) { zoom = 1.8 + (shot - .34) * .2; x = 7; y = -8; roll = 7; }
    else { zoom = 1.62; x = -2; y = -3; roll = -3; }
  }
  if (segment.high && arrival >= pullAt && arrival < wideAt) {
    phase = 'pullback'; const t = 1 - ease((arrival - pullAt) / segment.pull);
    const dedede = segment.payoff === 'dedede';
    zoom = 1 + (dedede ? 1.15 : .62) * t; x = (dedede ? -29 : -2) * t; y = (dedede ? -4 : -3) * t; roll = dedede ? 0 : -3 * t;
  }
  if (arrival < segment.screen) phase = 'screen';
  if (arrival >= wideAt && arrival < stampAt) phase = 'settle';
  if (arrival >= stampAt && arrival < stampAt + segment.stamp) phase = 'stamp';
  const plate = clamp((arrival - stampAt) / segment.stamp);
  const nameProgress = (arrival - stampAt - segment.nameDelay) / segment.nameDuration;
  const name = segment.payoff ? ease(nameProgress) : clamp(nameProgress);
  return { phase, segment, revealed: segment.index + 1, zoom: reduced ? 1 : zoom, x: reduced ? 0 : x, y: reduced ? 0 : y, roll: reduced ? 0 : roll, plate, name, screen: reduced || !segment.screen ? 1 : clamp(arrival / segment.screen), entrance: reduced || segment.high ? 1 : ease(arrival / .35), roster: segment.high ? ease((arrival - pullAt) / Math.max(.1, segment.pull)) : 1 };
}

export function advanceTime(time, timeline) {
  const state = sampleReveal(time, timeline);
  const s = state.segment;
  if (!s) return time < timeline.reveal ? timeline.reveal : timeline.total;
  // Land just inside the next beat, not on a floating-point sum that can still
  // sample as the preceding phase when the preview is paused or throttled.
  const inside = .0001;
  if (state.phase === 'quote') return s.start + s.quote + inside;
  if (state.phase === 'screen') return s.start + s.quote + s.screen + inside;
  if (state.phase.startsWith('angle')) return s.start + s.quote + s.screen + s.entrance + s.close + inside;
  if (['pullback', 'settle'].includes(state.phase)) return s.start + s.quote + s.screen + s.entrance + s.close + s.pull + s.settle + inside;
  if (s.payoff && ['stamp', 'wide'].includes(state.phase) && state.name < 1) return s.start + s.quote + s.screen + s.entrance + s.close + s.pull + s.settle + s.nameDelay + s.nameDuration + inside;
  const next = timeline.segments.find(next => next.index > s.index && !next.skipped);
  return next ? next.start : timeline.lineup;
}
