// Procedural pixel critters: a mirrored random 10x10 body seeded by the
// character's id, so every hero and enemy always gets the same sprite.
// Once a character has real art (unit.art.icon), that's used instead.

const GRID = 10;
const cache = new Map();

export function heroImage(unit, silhouette = false) {
  if (unit.art?.icon && !silhouette) return unit.art.icon;
  return generate(unit.id, unit.color, silhouette);
}

function generate(id, hex, silhouette) {
  const key = `${id}|${hex}|${silhouette}`;
  if (cache.has(key)) return cache.get(key);

  const rnd = mulberry32(fnv1a(id));
  // 0 empty, 1 body, 2 light, 3 dark, 4 eye
  const cells = Array.from({ length: GRID }, () => Array(GRID).fill(0));
  const half = GRID / 2;
  for (let y = 0; y < GRID; y++) {
    for (let x = 0; x < half; x++) {
      let p = x >= 2 ? 0.55 : 0.3;
      if (y === 0 || y === GRID - 1) p *= 0.6;
      if (x === half - 1 && y >= 2 && y <= 7) p = 1; // solid spine keeps it in one piece
      if (rnd() < p) {
        const r = rnd();
        const shade = r < 0.2 ? 2 : r < 0.4 ? 3 : 1;
        cells[y][x] = shade;
        cells[y][GRID - 1 - x] = shade;
      }
    }
  }
  // Eyes, with body around them so they never float.
  for (const ex of [3, GRID - 4]) {
    for (const [dx, dy] of [[-1, 0], [1, 0], [0, -1], [0, 1]]) {
      if (cells[3 + dy][ex + dx] === 0) cells[3 + dy][ex + dx] = 1;
    }
    cells[3][ex] = 4;
  }

  const base = hexToRgb(hex);
  const shadow = [0, 0, 0, 150];
  const palette = silhouette
    ? { 1: shadow, 2: shadow, 3: shadow, 4: shadow }
    : { 1: [...base, 255], 2: [...mix(base, [255, 255, 255], 0.3), 255],
      3: [...mix(base, [0, 0, 0], 0.25), 255], 4: [255, 255, 255, 255] };
  const outline = silhouette ? [255, 255, 255, 20] : [...mix(base, [0, 0, 0], 0.75), 255];

  const size = GRID + 2;
  const canvas = document.createElement('canvas');
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext('2d');
  const img = ctx.createImageData(size, size);
  const set = (x, y, c) => img.data.set(c, (y * size + x) * 4);
  const filled = (x, y) => x >= 0 && y >= 0 && x < GRID && y < GRID && cells[y][x] !== 0;

  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      const cx = x - 1;
      const cy = y - 1;
      if (filled(cx, cy)) set(x, y, palette[cells[cy][cx]]);
      else if (filled(cx - 1, cy) || filled(cx + 1, cy) || filled(cx, cy - 1) || filled(cx, cy + 1)) {
        set(x, y, outline);
      }
    }
  }
  ctx.putImageData(img, 0, 0);
  const url = canvas.toDataURL();
  cache.set(key, url);
  return url;
}

function hexToRgb(hex) {
  const n = parseInt(hex.slice(1), 16);
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
}

function mix(a, b, t) {
  return a.map((v, i) => Math.round(v + (b[i] - v) * t));
}

function fnv1a(str) {
  let hash = 2166136261;
  for (let i = 0; i < str.length; i++) {
    hash ^= str.charCodeAt(i);
    hash = Math.imul(hash, 16777619);
  }
  return hash >>> 0;
}

function mulberry32(seed) {
  return () => {
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
