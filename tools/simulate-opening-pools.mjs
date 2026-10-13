import { pathToFileURL } from 'node:url';

import { createSeededRandom } from '../src/random.js';

export const OPENING_POOLS = {
  mushroom: { R: 10, SR: 7, SSR: 5 },
  dreamLand: { R: 8, SR: 9, SSR: 5 },
};

export function simulateOpeningPool({ counts, seed, trials = 100_000, pulls = 20 }) {
  const random = createSeededRandom(seed);
  const pool = Object.fromEntries(
    Object.entries(counts).map(([rarity, count]) => [
      rarity,
      Array.from({ length: count }, (_, index) => `${rarity}-${index}`),
    ]),
  );
  const uniqueCounts = [];

  for (let trial = 0; trial < trials; trial += 1) {
    const owned = new Set([pool.R[0]]);
    let blockHasSrOrBetter = false;
    let welcomeHasNewSrOrBetter = false;

    for (let pull = 1; pull <= pulls; pull += 1) {
      const blockPosition = ((pull - 1) % 10) + 1;
      let rarity = rollRarity(random);
      if (blockPosition === 10 && !blockHasSrOrBetter && rarity === 'R') rarity = 'SR';

      let candidates = pool[rarity].filter((itemId) => !(pull === 1 && owned.has(itemId)));
      let itemId = pick(candidates, random);
      let isNew = !owned.has(itemId);

      // The first ten results form one welcome sequence even when spent as
      // singles. Result ten becomes an owned-safe SR only when needed.
      if (pull === 10 && !welcomeHasNewSrOrBetter && (rarity === 'R' || !isNew)) {
        rarity = 'SR';
        candidates = pool.SR.filter((candidateId) => !owned.has(candidateId));
        itemId = pick(candidates.length ? candidates : pool.SR, random);
        isNew = !owned.has(itemId);
      }

      owned.add(itemId);
      if (rarity !== 'R') blockHasSrOrBetter = true;
      if (pull <= 10 && rarity !== 'R' && isNew) welcomeHasNewSrOrBetter = true;
      if (blockPosition === 10) blockHasSrOrBetter = false;
    }

    uniqueCounts.push(owned.size);
  }

  uniqueCounts.sort((left, right) => left - right);
  const percentile = (fraction) => uniqueCounts[Math.floor((uniqueCounts.length - 1) * fraction)];
  const poolSize = Object.values(counts).reduce((total, count) => total + count, 0);
  const median = percentile(0.5);
  return {
    trials,
    pulls,
    poolSize,
    mean: uniqueCounts.reduce((total, count) => total + count, 0) / trials,
    p10: percentile(0.1),
    median,
    p90: percentile(0.9),
    medianShare: median / poolSize,
  };
}

function rollRarity(random) {
  const value = random();
  if (value < 0.03) return 'SSR';
  if (value < 0.2) return 'SR';
  return 'R';
}

function pick(items, random) {
  return items[Math.floor(random() * items.length)];
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  for (const [name, counts] of Object.entries(OPENING_POOLS)) {
    const result = simulateOpeningPool({ counts, seed: `opening-pools-v1-${name}` });
    console.log(JSON.stringify({ name, counts, ...result }));
  }
}
