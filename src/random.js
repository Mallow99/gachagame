// Shared randomness seam. Runtime callers get Math.random by default; tests
// and development replays can supply any string or number as a stable seed.

function seedToUint32(seed) {
  if (typeof seed === 'number' && Number.isFinite(seed)) return seed >>> 0;
  const text = String(seed);
  let hash = 2166136261;
  for (let i = 0; i < text.length; i += 1) {
    hash ^= text.charCodeAt(i);
    hash = Math.imul(hash, 16777619);
  }
  return hash >>> 0;
}

/** Mulberry32: small, deterministic and sufficient for local game replays. */
export function createSeededRandom(seed) {
  let state = seedToUint32(seed);
  return function seededRandom() {
    state = (state + 0x6d2b79f5) >>> 0;
    let value = state;
    value = Math.imul(value ^ (value >>> 15), value | 1);
    value ^= value + Math.imul(value ^ (value >>> 7), value | 61);
    return ((value ^ (value >>> 14)) >>> 0) / 4294967296;
  };
}

export function createRandom(seed) {
  return seed === undefined || seed === null || seed === ''
    ? Math.random
    : createSeededRandom(seed);
}

export function randomInt(min, max, random = Math.random) {
  return min + Math.floor(random() * (max - min + 1));
}

export function pickRandom(items, random = Math.random) {
  return items[Math.floor(random() * items.length)];
}
