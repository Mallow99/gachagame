import assert from 'node:assert/strict';
import test from 'node:test';

import * as data from '../src/data.js';

test('the prototype data facade preserves its existing balance and roster', () => {
  assert.equal(data.PULL_COST, 100);
  assert.equal(data.SSR_RATE, 0.03);
  assert.equal(data.ENEMY_GROWTH, 1.045);
  assert.equal(data.STAGE_WAVES, 3);
  assert.deepEqual(
    data.ROSTER.slice(0, 4).map((hero) => hero.id),
    ['mario', 'walter', 'sahur', 'aurelia'],
  );
  assert.deepEqual(data.stageInfo(10), {
    stage: 10,
    world: 1,
    worldStage: 10,
    areaStage: 10,
    boss: true,
    worldName: 'Mushroom Kingdom',
    area: data.MUSHROOM_KINGDOM[0],
  });
});
