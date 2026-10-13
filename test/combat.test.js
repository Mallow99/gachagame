import assert from 'node:assert/strict';
import test from 'node:test';

import { ROSTER, attackStyleFor } from '../src/data.js';
import { ATTACK_STYLES, actionSeconds, damageAmount } from '../src/combat.js';

test('actionSeconds applies speed, style cooldowns and safe fallbacks', () => {
  assert.equal(actionSeconds(18, 'melee'), 1);
  assert.equal(actionSeconds(9, 'shot'), 1.8);
  assert.equal(actionSeconds(0, 'beam'), 22.5);
  assert.equal(actionSeconds(18, 'unknown'), 1);
});

test('damage stays inside the non-critical variance boundaries', () => {
  const attacker = { atk: 100, cls: 'Warrior' };
  const target = { def: 20 };
  const low = damageAmount(attacker, target, 'melee', sequence(0, 0.99));
  const high = damageAmount(attacker, target, 'melee', sequence(0.999999, 0.99));
  assert.deepEqual(low, { amount: 80, crit: false });
  assert.deepEqual(high, { amount: 100, crit: false });
  assert.deepEqual(
    damageAmount({ atk: 1, cls: 'Mage' }, { def: 999 }, 'melee', sequence(0, 0.99)),
    { amount: 1, crit: false },
  );
});

test('critical damage uses the same bounded base amount', () => {
  const result = damageAmount(
    { atk: 100, cls: 'Rogue' },
    { def: 20 },
    'melee',
    sequence(0, 0),
  );
  assert.deepEqual(result, { amount: 128, crit: true });
});

test('every prototype attack behavior resolves to a declared rule', () => {
  assert.deepEqual(Object.keys(ATTACK_STYLES).sort(), ['beam', 'charge', 'combo', 'lob', 'melee', 'shot', 'stomp']);
  for (const hero of ROSTER) {
    const style = attackStyleFor(hero);
    assert.ok(ATTACK_STYLES[style], `${hero.id} resolved to unknown style ${style}`);
  }
  assert.equal(attackStyleFor({ id: 'unknown-fixture' }), 'melee');
});

function sequence(...values) {
  let index = 0;
  return () => values[index++];
}
