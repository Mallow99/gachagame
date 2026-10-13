import assert from 'node:assert/strict';
import test from 'node:test';

import { ATTACK_STYLES, damageAmount } from '../src/combat.js';
import { createSeededRandom } from '../src/random.js';

test('the same seed reproduces the first 20 values', () => {
  const first = createSeededRandom('stage-1-reference');
  const second = createSeededRandom('stage-1-reference');
  assert.deepEqual(
    Array.from({ length: 20 }, () => first()),
    Array.from({ length: 20 }, () => second()),
  );
});

test('the same seed reproduces battle damage and the winner', () => {
  const run = () => {
    const random = createSeededRandom(104729);
    const actors = [
      { id: 'hero', hp: 240, atk: 32, def: 9, cls: 'Rogue' },
      { id: 'enemy', hp: 275, atk: 29, def: 11, cls: '' },
    ];
    const events = [];
    for (let turn = 0; actors.every((actor) => actor.hp > 0) && turn < 40; turn += 1) {
      const attacker = actors[turn % 2];
      const target = actors[(turn + 1) % 2];
      const style = Object.keys(ATTACK_STYLES)[turn % Object.keys(ATTACK_STYLES).length];
      const result = damageAmount(attacker, target, style, random);
      target.hp = Math.max(0, target.hp - result.amount);
      events.push({ turn, source: attacker.id, target: target.id, style, ...result, remainingHp: target.hp });
    }
    return { winner: actors.find((actor) => actor.hp > 0)?.id, actors, events };
  };
  assert.deepEqual(run(), run());
});
