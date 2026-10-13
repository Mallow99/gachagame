import assert from 'node:assert/strict';
import test from 'node:test';

import { OPENING_POOLS, simulateOpeningPool } from '../tools/simulate-opening-pools.mjs';

test('opening pools retain collection runway after twenty welcome pulls', () => {
  for (const [name, counts] of Object.entries(OPENING_POOLS)) {
    const result = simulateOpeningPool({ counts, seed: `test-${name}`, trials: 20_000 });
    assert.ok(result.medianShare <= 0.75, `${name} median ownership exceeds the release ceiling`);
    assert.equal(result.pulls, 20);
  }
});
