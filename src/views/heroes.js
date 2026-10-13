// Collection grid, party picker, and a detail panel for levelling heroes.
import { game } from '../game.js';
import * as D from '../data.js';
import { sfx } from '../sfx.js';
import { h, stars, sprite, RARITY_NAME } from '../ui.js';

export function HeroesView() {
  const partyRow = h('div.party-row');
  const count = h('span.muted.small');
  const power = h('div.muted.small');
  const grid = h('div.grid');
  let detailId = null;

  const d = {
    sprite: h('div.detail-sprite'),
    name: h('div.detail-name'),
    stars: h('div.center'),
    info: h('div.muted.small.center'),
    blurb: h('div.muted.small.center'),
    stats: h('div.stats'),
    level: h('button.btn.gold', { onclick: () => {
      if (game.levelUp(detailId)) sfx.star(game.level(detailId) % 5);
      else sfx.error();
    } }),
    party: h('button.btn', { onclick: () => {
      sfx.click();
      game.toggleParty(detailId);
    } }),
  };
  const detail = h('div.detail', { hidden: true },
    h('button.btn.small.back', { onclick: () => {
      sfx.click();
      detailId = null;
      detail.hidden = true;
    } }, '‹ Back'),
    d.sprite, d.name, d.stars, d.info, d.blurb, d.stats,
    h('div.grow'), d.level, d.party);

  const root = h('section.view.heroes',
    h('div.row.head', h('span.label', 'Party'), partyRow, h('div.grow'), count),
    power,
    h('div.scroll', grid),
    detail);

  function refresh() {
    partyRow.replaceChildren(...Array.from({ length: D.MAX_PARTY }, (_, i) => {
      const id = game.party[i];
      return id ? sprite(game.hero(id), 30) : h('div.slot');
    }));
    count.textContent = `${Object.keys(game.owned).length}/${D.ROSTER.length} collected`;
    power.textContent = `Team power ${game.teamPower(game.partyUnits())}  ·  ${game.gold} gold`;

    const list = [...D.ROSTER].sort((a, b) => {
      const ao = !!game.owned[a.id];
      const bo = !!game.owned[b.id];
      if (ao !== bo) return ao ? -1 : 1;
      if (a.rarity !== b.rarity) return b.rarity - a.rarity;
      return game.level(b.id) - game.level(a.id);
    });
    grid.replaceChildren(...list.map(cell));
    refreshDetail();
  }

  function cell(hero) {
    const have = !!game.owned[hero.id];
    const inParty = game.party.includes(hero.id);
    let label = '???';
    if (have) {
      label = `Lv ${game.level(hero.id)}`;
      if (game.asc(hero.id)) label += `  A${game.asc(hero.id)}`;
    }
    return h(`div.cell.r${hero.rarity}${have ? '' : '.locked'}${inParty ? '.in-party' : ''}`,
      { onclick: () => have && open(hero.id), title: have ? hero.name : '' },
      sprite(hero, 48, !have),
      stars(hero.rarity),
      h('div.tiny', label));
  }

  function open(id) {
    sfx.click();
    detailId = id;
    detail.hidden = false;
    refreshDetail();
  }

  function refreshDetail() {
    if (!detailId) return;
    const id = detailId;
    const hero = game.hero(id);
    const s = game.stats(id);
    d.sprite.replaceChildren(sprite(hero, 112));
    d.name.textContent = hero.name;
    d.stars.replaceChildren(stars(hero.rarity));
    d.info.textContent = `${RARITY_NAME[hero.rarity]}  ·  ${hero.cls}  ·  Lv ${game.level(id)}/${game.maxLevel(id)}  ·  Asc ${game.asc(id)}/${D.MAX_ASC}`;
    d.blurb.textContent = D.CLASS_BLURB[hero.cls];
    d.stats.replaceChildren(
      ...[['HP', s.hp], ['ATK', s.atk], ['DEF', s.def], ['SPD', s.spd]].map(([k, v]) =>
        h('div', h('span.muted', k), ' ', h('b', v))));

    if (game.level(id) >= game.maxLevel(id)) {
      d.level.textContent = 'Max level (dupes raise the cap)';
      d.level.disabled = true;
    } else {
      const cost = game.levelCost(id);
      d.level.textContent = `Level up  —  ${cost} gold`;
      d.level.disabled = game.gold < cost;
    }

    const inParty = game.party.includes(id);
    const conflict = game.partyFamilyConflict(id);
    if (inParty) {
      d.party.textContent = 'Remove from party';
      d.party.disabled = game.party.length === 1;
    } else if (conflict) {
      d.party.textContent = `Choose one ${hero.family} variant (${game.hero(conflict).name} equipped)`;
      d.party.disabled = true;
    } else if (game.party.length < D.MAX_PARTY) {
      d.party.textContent = 'Add to party';
      d.party.disabled = false;
    } else {
      d.party.textContent = 'Party full (remove someone first)';
      d.party.disabled = true;
    }
  }

  game.addEventListener('changed', refresh);
  refresh();
  return root;
}
