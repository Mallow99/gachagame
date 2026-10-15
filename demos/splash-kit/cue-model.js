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

export function flightPoint(time) {
  if (time < CUE.orbit) {
    const t = clamp((time - CUE.launch) / (CUE.orbit - CUE.launch));
    return { x: .5 - .35 * t * t, y: .76 - .26 * Math.sin(t * Math.PI / 2), scale: 1, approach: 0 };
  }
  if (time < CUE.approach) {
    const lap = clamp((time - CUE.orbit) / (CUE.orbitEnd - CUE.orbit));
    const angle = (lap + .07 * Math.sin(lap * Math.PI * 2)) * Math.PI * 2;
    return { x: .5 - .35 * Math.cos(angle), y: .5 - .24 * Math.sin(angle) - .035 * (1 - Math.cos(angle)), scale: .95 - .26 * Math.sin(angle), approach: 0 };
  }
  const t = clamp((time - CUE.approach) / (CUE.contact - CUE.approach));
  return { x: .15 + .35 * ease(t), y: .5 - .02 * ease(t) - .18 * Math.sin(t * Math.PI), scale: 1 + 15 * t ** 3, approach: t };
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
    const ur = high && cueTier === 'UR';
    const quote = high ? ur ? 4.8 : 4 : 0;
    const entrance = high ? .5 : result.rarity === 'SR' ? .45 : .35;
    const close = high ? ur ? 1.25 : 1 : 0;
    const pull = high ? .75 : 0;
    const settle = high ? .22 : 0;
    const stamp = high ? .6 : .3;
    const linger = high ? .8 : result.rarity === 'SR' ? .7 : .45;
    const skipped = highOnly && results.length > 1 && !high;
    const duration = skipped ? 0 : quote + entrance + close + pull + settle + stamp + linger;
    const segment = { index, result, high, skipped, start: cursor, quote, entrance, close, pull, settle, stamp, linger, end: cursor + duration };
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
  const pullAt = segment.entrance + segment.close;
  const wideAt = pullAt + segment.pull;
  const stampAt = wideAt + segment.settle;
  let zoom = 1, x = 0, y = 0, roll = 0;
  let phase = arrival < segment.entrance ? 'entrance' : 'wide';
  if (segment.high && arrival < pullAt) {
    const shot = clamp(arrival / pullAt);
    phase = shot < .34 ? 'angle-low' : shot < .68 ? 'angle-high' : 'angle-center';
    if (shot < .34) { zoom = 1.95 + shot * .2; x = -9; y = 16; roll = -8; }
    else if (shot < .68) { zoom = 1.8 + (shot - .34) * .2; x = 7; y = -8; roll = 7; }
    else { zoom = 1.62; x = -2; y = -3; roll = -3; }
  }
  if (segment.high && arrival >= pullAt && arrival < wideAt) {
    phase = 'pullback'; const t = 1 - ease((arrival - pullAt) / segment.pull);
    zoom = 1 + .62 * t; x = -2 * t; y = -3 * t; roll = -3 * t;
  }
  if (arrival >= wideAt && arrival < stampAt) phase = 'settle';
  if (arrival >= stampAt && arrival < stampAt + segment.stamp) phase = 'stamp';
  const plate = clamp((arrival - stampAt) / segment.stamp);
  const name = clamp((arrival - stampAt - .25) / .25);
  return { phase, segment, revealed: segment.index + 1, zoom: reduced ? 1 : zoom, x: reduced ? 0 : x, y: reduced ? 0 : y, roll: reduced ? 0 : roll, plate, name, entrance: reduced || segment.high ? 1 : ease(arrival / .35), roster: segment.high ? ease((arrival - pullAt) / Math.max(.1, segment.pull)) : 1 };
}

export function advanceTime(time, timeline) {
  const state = sampleReveal(time, timeline);
  const s = state.segment;
  if (!s) return time < timeline.reveal ? timeline.reveal : timeline.total;
  // Land just inside the next beat, not on a floating-point sum that can still
  // sample as the preceding phase when the preview is paused or throttled.
  const inside = .0001;
  if (state.phase === 'quote') return s.start + s.quote + inside;
  if (state.phase.startsWith('angle')) return s.start + s.quote + s.entrance + s.close + inside;
  if (['pullback', 'settle'].includes(state.phase)) return s.start + s.quote + s.entrance + s.close + s.pull + s.settle + inside;
  const next = timeline.segments.find(next => next.index > s.index && !next.skipped);
  return next ? next.start : timeline.lineup;
}
