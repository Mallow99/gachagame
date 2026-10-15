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
    return { x: .5 - .35 * t * t, y: .76 - .28 * Math.sin(t * Math.PI / 2), scale: 1, approach: 0 };
  }
  if (time < CUE.approach) {
    const lap = clamp((time - CUE.orbit) / (CUE.orbitEnd - CUE.orbit));
    return { x: .5 - .35 * Math.cos(lap * Math.PI * 2), y: .48 - .24 * Math.sin(lap * Math.PI * 2), scale: .85 + .25 * (1 - Math.cos(lap * Math.PI * 2)), approach: 0 };
  }
  const t = clamp((time - CUE.approach) / (CUE.contact - CUE.approach));
  return { x: .15 + .35 * ease(t), y: .48 - .18 * Math.sin(t * Math.PI), scale: 1 + 15 * t ** 3, approach: t };
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

export function makeTimeline(results, cueTier) {
  const delay = (results.length - 1) * CUE.spacing;
  let cursor = CUE.reveal + delay;
  const segments = results.map((result, index) => {
    const high = TIERS.indexOf(result.rarity) >= 2;
    const ur = high && cueTier === 'UR';
    const quote = high ? ur ? 4.8 : 4 : 0;
    const entrance = high ? 1 : result.rarity === 'SR' ? .8 : .65;
    const push = high ? .9 : 0;
    const close = high ? ur ? 2.1 : 1.7 : 0;
    const pull = high ? 1.4 : 0;
    const settle = high ? ur ? 1.6 : 1.3 : result.rarity === 'SR' ? 1.6 : 1.15;
    const segment = { index, result, high, start: cursor, quote, entrance, push, close, pull, settle, end: cursor + quote + entrance + push + close + pull + settle };
    cursor = segment.end;
    return segment;
  });
  return { delay, impact: CUE.impact + delay, reveal: CUE.reveal + delay, segments, lineup: cursor, total: cursor + 1.5 };
}

export function sampleReveal(time, timeline, reduced = false) {
  const segment = timeline.segments.find(s => time >= s.start && time < s.end);
  if (!segment) return { phase: time >= timeline.lineup ? 'lineup' : 'flight', revealed: time >= timeline.lineup ? timeline.segments.length : 0, zoom: 1, roster: time >= timeline.lineup ? 1 : 0 };
  const age = time - segment.start;
  if (age < segment.quote) return { phase: 'quote', segment, revealed: segment.index, zoom: 1, roster: 0 };
  const arrival = age - segment.quote;
  const pushAt = segment.entrance;
  const pullAt = pushAt + segment.push + segment.close;
  const wideAt = pullAt + segment.pull;
  let zoom = 1;
  let phase = arrival < pushAt ? 'entrance' : 'wide';
  if (segment.high && arrival >= pushAt && arrival < pullAt) { phase = 'closeup'; zoom = 1 + .55 * ease((arrival - pushAt) / segment.push); }
  if (segment.high && arrival >= pullAt && arrival < wideAt) { phase = 'pullback'; zoom = 1.55 - .55 * ease((arrival - pullAt) / segment.pull); }
  return { phase, segment, revealed: segment.index + 1, zoom: reduced ? 1 : zoom, entrance: reduced ? 1 : ease(arrival / .7), roster: segment.high ? ease((arrival - pullAt) / Math.max(.1, segment.pull)) : 1 };
}
