// The pull animation: orb drops, its color teases the rarity (sometimes
// upgrading mid-reveal), flash, then the card(s). Tap to skip, tap to close.
import { game } from '../game.js';
import * as D from '../data.js';
import { sfx } from '../sfx.js';
import { h, sleep, stars, setStarsShown, sprite, RARITY_NAME } from '../ui.js';
import { Particles } from './particles.js';

const RARITY_COLOR = { 3: '#5aa9ff', 4: '#c77dff', 5: '#ffc93c' };

export class Reveal {
  constructor(parent) {
    this.orb = h('div.orb');
    this.layer = h('div.reveal-layer');
    this.flash = h('div.flash');
    this.hint = h('div.reveal-hint');
    this.canvas = h('canvas.particles');
    this.root = h('div.reveal', { hidden: true, onclick: () => this.tap() },
      this.layer, this.orb, this.canvas, this.flash, this.hint);
    parent.append(this.root);
    this.particles = new Particles(this.canvas);
    this.skip = false;
    this.done = false;
  }

  wait(ms) {
    return this.skip ? Promise.resolve() : sleep(ms);
  }

  tap() {
    if (this.done) this.close();
    else this.skip = true;
  }

  async play(results) {
    this.skip = false;
    this.done = false;
    this.layer.replaceChildren();
    this.root.hidden = false;
    this.root.classList.remove('closing');
    this.particles.resize();
    this.hint.textContent = 'tap to skip';
    const best = Math.max(...results.map((r) => r.rarity));

    // Orb drops in.
    this.setOrb('#ffffff');
    this.orb.hidden = false;
    restartAnimation(this.orb, 'drop');
    sfx.charge();
    await this.wait(800);

    // Tease: sometimes show a lower rarity first, then upgrade.
    let tease = best;
    if (best === 5 && Math.random() < 0.4) tease = 4;
    else if (best === 4 && Math.random() < 0.25) tease = 3;
    this.setOrb(RARITY_COLOR[tease]);
    if (!this.skip) sfx.ding(tease);
    await this.wait(650);
    if (tease !== best && !this.skip) {
      this.flashOnce(0.6);
      this.setOrb(RARITY_COLOR[best]);
      this.burstAt(this.orb, RARITY_COLOR[best], 40);
      sfx.upgrade();
      await this.wait(750);
    }

    this.flashOnce(1);
    this.burstAt(this.orb, RARITY_COLOR[best], best === 5 ? 110 : 60);
    if (best === 5) restartAnimation(this.root, 'shake');
    this.orb.hidden = true;

    if (results.length === 1) await this.showSingle(results[0]);
    else await this.showMulti(results);
    this.done = true;
    this.hint.textContent = 'tap to close';
  }

  async showSingle(res) {
    const card = this.card(res, true);
    const row = card.querySelector('.stars');
    setStarsShown(row, 0);
    this.layer.append(h('div.single', card));
    card.classList.add('pop');
    if (!this.skip) sfx.reveal(res.rarity);
    await this.wait(400);
    for (let i = 0; i < res.rarity; i++) {
      setStarsShown(row, i + 1);
      if (!this.skip) sfx.star(i);
      await this.wait(160);
    }
    setStarsShown(row, res.rarity);
  }

  async showMulti(results) {
    const cards = results.map((r) => this.card(r, false));
    this.layer.append(h('div.multi', cards));
    for (let i = 0; i < cards.length; i++) {
      const r = results[i].rarity;
      cards[i].classList.add('pop');
      if (r >= 4 && !this.skip) {
        this.burstAt(cards[i], RARITY_COLOR[r], r === 5 ? 40 : 16);
        sfx.reveal(r);
        await this.wait(r === 5 ? 500 : 280);
      } else {
        if (!this.skip) sfx.tick();
        await this.wait(120);
      }
    }
  }

  card(res, big) {
    const hero = game.hero(res.id);
    let tag = null;
    if (res.isNew) tag = h('div.tag.new', 'NEW!');
    else if (res.ascUp) tag = h('div.tag.asc', big ? `Ascension ${game.asc(res.id)}/${D.MAX_ASC}` : 'ASC+1');
    else if (res.refund) tag = h('div.tag.refund', `+${res.refund} gold`);
    return h(`div.card.r${res.rarity}${big ? '.big' : ''}`,
      sprite(hero, big ? 128 : 44),
      stars(res.rarity),
      h('div.name', hero.name),
      tag,
      big && h('div.muted.small', `${RARITY_NAME[res.rarity]}  ·  ${hero.cls}`));
  }

  setOrb(color) {
    this.orb.style.setProperty('--c', color);
  }

  flashOnce(strength) {
    this.flash.style.transition = 'none';
    this.flash.style.opacity = strength;
    void this.flash.offsetWidth;
    this.flash.style.transition = 'opacity .35s ease-out';
    this.flash.style.opacity = 0;
  }

  burstAt(el, color, count) {
    const a = el.getBoundingClientRect();
    const b = this.root.getBoundingClientRect();
    this.particles.burst(a.left - b.left + a.width / 2, a.top - b.top + a.height / 2, color, count);
  }

  async close() {
    this.done = false;
    this.root.classList.add('closing');
    await sleep(150);
    this.root.hidden = true;
  }
}

function restartAnimation(el, cls) {
  el.classList.remove(cls);
  void el.offsetWidth;
  el.classList.add(cls);
}
