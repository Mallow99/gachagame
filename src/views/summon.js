// Banner screen: rates, pity counters, pull buttons.
import { game } from '../game.js';
import * as D from '../data.js';
import { sfx } from '../sfx.js';
import { h, sprite } from '../ui.js';

export function SummonView(onPull) {
  const pity = h('div.pity');
  const srPity = h('div.muted.small');
  const total = h('div.muted.tiny.center');
  const one = h('button.btn.big', { onclick: () => pull(1) },
    'Pull ×1', h('small', `${D.PULL_COST} gems`));
  const ten = h('button.btn.big.gold', { onclick: () => pull(10) },
    'Pull ×10', h('small', `${D.PULL_COST * 10} gems`));

  const showcase = h('div.showcase', game.heroesOfRarity(5).map((hero, i) => {
    const img = sprite(hero, 56);
    img.style.animationDelay = `${-i * 0.35}s`;
    return img;
  }));

  const root = h('section.view.summon',
    h('div.banner',
      h('div.banner-title', 'STANDARD BANNER'),
      h('div.muted.small', `SSR ${D.SSR_RATE * 100}%  ·  SR ${D.SR_RATE * 100}%  ·  R ${Math.round((1 - D.SSR_RATE - D.SR_RATE) * 100)}%`),
      showcase,
      h('div.muted.tiny', 'Every SSR, always. No limited banners, no FOMO, no wallet.')),
    h('div.pitybox', pity, srPity),
    h('div.grow'),
    h('div.row', one, ten),
    total);

  function refresh() {
    pity.textContent = `SSR guaranteed within ${D.HARD_PITY - game.pitySsr} pulls`;
    srPity.textContent = `SR or better within ${D.SR_PITY - game.pitySr}`;
    one.disabled = game.gems < D.PULL_COST;
    ten.disabled = game.gems < D.PULL_COST * 10;
    total.textContent = `${game.totalPulls} pulls so far  ·  +${D.IDLE_GEMS_PER_MIN} gems/min while open  ·  stage clears pay more`;
  }

  function pull(n) {
    const results = game.pull(n);
    if (!results.length) {
      sfx.error();
      return;
    }
    onPull(results);
  }

  game.addEventListener('changed', refresh);
  refresh();
  return root;
}
