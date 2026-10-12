// Game state and rules: currencies, collection, gacha rolls, battles, saving.
// No DOM in here. Screens read from `game` and listen for 'changed', which
// keeps the rules reusable if an online mode ever happens.
import * as D from './data.js';

const SAVE_KEY = 'pocketgacha.save.v1';

const rand = () => Math.random();
const randRange = (a, b) => a + Math.random() * (b - a);
const randInt = (a, b) => a + Math.floor(Math.random() * (b - a + 1));
const pick = (arr) => arr[Math.floor(Math.random() * arr.length)];

class Game extends EventTarget {
  constructor() {
    super();
    this.byId = Object.fromEntries(D.ROSTER.map((h) => [h.id, h]));
    this.newGame();
    this.load();
    this.idle = 0;
    setInterval(() => this.tick(1), 1000);
    setInterval(() => this.save(), 30000);
    window.addEventListener('beforeunload', () => this.save());
  }

  newGame() {
    this.gems = D.START_GEMS;
    this.gold = D.START_GOLD;
    this.pitySsr = 0;
    this.pitySr = 0;
    this.stage = 1;
    this.owned = { bob: { lvl: 1, asc: 0 } };
    this.party = ['bob'];
    this.totalPulls = 0;
    this.muted = true;
    this.lastSeen = 0;
    this.lastDaily = '';
  }

  emit() {
    this.dispatchEvent(new Event('changed'));
  }

  toast(text) {
    this.dispatchEvent(new CustomEvent('toast', { detail: text }));
  }

  tick(seconds) {
    this.idle += (seconds * D.IDLE_GEMS_PER_MIN) / 60;
    if (this.idle >= 1) {
      const g = Math.floor(this.idle);
      this.idle -= g;
      this.gems += g;
      this.emit();
    }
  }

  /** Called once the UI is listening: offline gems, daily bonus, welcome. */
  welcome() {
    const now = Date.now();
    if (!this.lastSeen) {
      this.toast(`Welcome! Here's ${this.gems} gems. Go pull.`);
    } else {
      const mins = Math.min((now - this.lastSeen) / 60000, D.OFFLINE_CAP_MIN);
      const g = Math.floor(mins * D.OFFLINE_GEMS_PER_MIN);
      if (g > 0) {
        this.gems += g;
        this.toast(`While you were away: +${g} gems`);
      }
    }
    const today = new Date().toDateString();
    if (today !== this.lastDaily) {
      this.lastDaily = today;
      this.gems += D.DAILY_GEMS;
      this.toast(`Daily bonus: +${D.DAILY_GEMS} gems`);
    }
    this.save();
    this.emit();
  }

  // --- Heroes ---------------------------------------------------------------

  hero(id) {
    return this.byId[id];
  }

  heroesOfRarity(r) {
    return D.ROSTER.filter((h) => h.rarity === r);
  }

  level(id) {
    return this.owned[id]?.lvl ?? 1;
  }

  asc(id) {
    return this.owned[id]?.asc ?? 0;
  }

  maxLevel(id) {
    return 20 + 10 * this.asc(id);
  }

  levelCost(id) {
    return 30 * (this.hero(id).rarity - 2) * this.level(id);
  }

  stats(id) {
    const h = this.hero(id);
    const base = D.CLASSES[h.cls];
    const m = D.RARITY_MULT[h.rarity] * (1 + 0.08 * (this.level(id) - 1)) * (1 + 0.1 * this.asc(id));
    return {
      hp: Math.round(base.hp * m),
      atk: Math.round(base.atk * m),
      def: Math.round(base.def * m),
      spd: base.spd + this.asc(id),
    };
  }

  levelUp(id) {
    if (!this.owned[id] || this.level(id) >= this.maxLevel(id)) return false;
    const cost = this.levelCost(id);
    if (this.gold < cost) return false;
    this.gold -= cost;
    this.owned[id].lvl += 1;
    this.emit();
    return true;
  }

  toggleParty(id) {
    if (this.party.includes(id)) {
      if (this.party.length === 1) return false; // always keep someone to fight
      this.party = this.party.filter((p) => p !== id);
    } else if (this.owned[id] && this.party.length < D.MAX_PARTY) {
      this.party.push(id);
    } else {
      return false;
    }
    this.save();
    this.emit();
    return true;
  }

  // --- Gacha ----------------------------------------------------------------

  /** SSR chance for the *next* pull, including soft and hard pity. */
  ssrChance() {
    const n = this.pitySsr + 1;
    if (n >= D.HARD_PITY) return 1;
    if (n > D.SOFT_PITY) return D.SSR_RATE + 0.06 * (n - D.SOFT_PITY);
    return D.SSR_RATE;
  }

  /** Spends gems; returns one result per pull, or [] if you can't afford it. */
  pull(n) {
    if (this.gems < D.PULL_COST * n) return [];
    this.gems -= D.PULL_COST * n;
    const results = [];
    for (let i = 0; i < n; i++) results.push(this.rollOne());
    this.totalPulls += n;
    this.save();
    this.emit();
    return results;
  }

  rollOne() {
    const ssr = this.ssrChance();
    const roll = rand();
    let rarity = 3;
    if (roll < ssr) rarity = 5;
    else if (this.pitySr + 1 >= D.SR_PITY || roll < ssr + D.SR_RATE) rarity = 4;
    this.pitySsr = rarity === 5 ? 0 : this.pitySsr + 1;
    this.pitySr = rarity >= 4 ? 0 : this.pitySr + 1;

    const h = pick(this.heroesOfRarity(rarity));
    const res = { id: h.id, rarity, isNew: false, ascUp: false, refund: 0 };
    if (!this.owned[h.id]) {
      this.owned[h.id] = { lvl: 1, asc: 0 };
      res.isNew = true;
      if (this.party.length < D.MAX_PARTY) this.party.push(h.id);
    } else if (this.asc(h.id) < D.MAX_ASC) {
      this.owned[h.id].asc += 1;
      res.ascUp = true;
    } else {
      res.refund = 100 * (rarity - 2) ** 2;
      this.gold += res.refund;
    }
    return res;
  }

  // --- Battles --------------------------------------------------------------

  stageRewards(s) {
    return { gems: 40 + 8 * s, gold: 80 + 25 * s };
  }

  makeEnemies(s) {
    const p = D.ENEMY_GROWTH ** (s - 1);
    if (s % 5 === 0) {
      const [name, color] = D.BOSSES[(s / 5 - 1) % D.BOSSES.length];
      return [unit(name, color, 300 * p, 15 * p, 7 * p, 9, true)];
    }
    const count = s === 1 ? 1 : s < 4 ? 2 : 3;
    return Array.from({ length: count }, () => {
      const [name, color] = pick(D.ENEMIES);
      return unit(name, color, 60 * p, 11 * p, 4 * p, randInt(6, 13), false);
    });
  }

  partyUnits() {
    return this.party.map((id) => {
      const h = this.hero(id);
      const s = this.stats(id);
      return { id, name: h.name, color: h.color, cls: h.cls, boss: false, hero: true,
        hp: s.hp, maxHp: s.hp, atk: s.atk, def: s.def, spd: s.spd };
    });
  }

  teamPower(units) {
    return units.reduce((t, u) => t + Math.floor(u.maxHp / 4 + u.atk * 2 + u.def * 2 + u.spd), 0);
  }

  /** Runs the whole fight up front; the battle screen replays the events. */
  simulate(heroes, enemies) {
    const sides = [structuredClone(heroes), structuredClone(enemies)];
    const events = [];
    let winner = -1;
    for (let round = 0; round < 50 && winner === -1; round++) {
      const order = [];
      sides.forEach((units, s) => units.forEach((_, i) => order.push([s, i])));
      order.sort(() => rand() - 0.5);
      order.sort((a, b) => sides[b[0]][b[1]].spd - sides[a[0]][a[1]].spd);
      for (const [side, idx] of order) {
        const me = sides[side][idx];
        if (me.hp <= 0) continue;
        const ev = act(side, idx, me, sides[side], sides[1 - side]);
        if (ev) events.push(ev);
        if (sides[1 - side].every((u) => u.hp <= 0)) {
          winner = side;
          break;
        }
      }
    }
    return { win: winner === 0, events };
  }

  /** Pays out and advances the stage on a win. Losses still pay a little gold. */
  finishBattle(win) {
    let r = { gems: 0, gold: 15 * this.stage };
    if (win) {
      r = this.stageRewards(this.stage);
      this.stage += 1;
    }
    this.gems += r.gems;
    this.gold += r.gold;
    this.save();
    this.emit();
    return r;
  }

  // --- Saving ---------------------------------------------------------------

  save() {
    this.lastSeen = Date.now();
    const data = {
      gems: this.gems, gold: this.gold, pitySsr: this.pitySsr, pitySr: this.pitySr,
      stage: this.stage, owned: this.owned, party: this.party, totalPulls: this.totalPulls,
      muted: this.muted, lastSeen: this.lastSeen, lastDaily: this.lastDaily,
    };
    try {
      localStorage.setItem(SAVE_KEY, JSON.stringify(data));
    } catch {
      // storage unavailable (private window etc.); the game still runs
    }
  }

  load() {
    let data;
    try {
      data = JSON.parse(localStorage.getItem(SAVE_KEY));
    } catch {
      data = null;
    }
    if (!data || typeof data !== 'object') return;
    const num = (v, d) => (Number.isFinite(v) ? v : d);
    this.gems = num(data.gems, this.gems);
    this.gold = num(data.gold, this.gold);
    this.pitySsr = num(data.pitySsr, 0);
    this.pitySr = num(data.pitySr, 0);
    this.stage = Math.max(1, num(data.stage, 1));
    this.totalPulls = num(data.totalPulls, 0);
    this.muted = data.muted !== false;
    this.lastSeen = num(data.lastSeen, 0);
    this.lastDaily = typeof data.lastDaily === 'string' ? data.lastDaily : '';
    const owned = {};
    for (const [id, o] of Object.entries(data.owned || {})) {
      if (this.byId[id] && o) owned[id] = { lvl: num(o.lvl, 1), asc: num(o.asc, 0) };
    }
    if (Object.keys(owned).length) {
      this.owned = owned;
      const party = (Array.isArray(data.party) ? data.party : []).filter((id) => owned[id]);
      this.party = [...new Set(party)].slice(0, D.MAX_PARTY);
      if (!this.party.length) this.party = [Object.keys(owned)[0]];
    }
  }
}

function unit(name, color, hp, atk, def, spd, boss) {
  return { id: name, name, color, cls: '', boss, hero: false,
    hp: Math.round(hp), maxHp: Math.round(hp), atk: Math.round(atk), def: Math.round(def), spd };
}

/** Index of the living unit with the least HP (or HP ratio), -1 if all dead. */
function lowest(units, byRatio) {
  let best = -1;
  let bestV = Infinity;
  units.forEach((u, i) => {
    if (u.hp <= 0) return;
    const v = byRatio ? u.hp / u.maxHp : u.hp;
    if (v < bestV) {
      bestV = v;
      best = i;
    }
  });
  return best;
}

function act(side, idx, me, allies, foes) {
  if (me.cls === 'Cleric') {
    const hurt = lowest(allies, true);
    if (hurt !== -1 && allies[hurt].hp / allies[hurt].maxHp < 0.7) {
      const t = allies[hurt];
      const amount = Math.round(me.atk * 1.3 * randRange(0.9, 1.1));
      t.hp = Math.min(t.maxHp, t.hp + amount);
      return { side, idx, tSide: side, tIdx: hurt, kind: 'heal', amount, crit: false, tHp: t.hp };
    }
  }
  const alive = foes.map((u, i) => (u.hp > 0 ? i : -1)).filter((i) => i !== -1);
  if (!alive.length) return null;
  const ti = me.cls === 'Rogue' ? lowest(foes, false) : pick(alive);
  const target = foes[ti];
  const critChance = me.cls === 'Rogue' ? 0.25 : me.cls === 'Ranger' ? 0.2 : 0.1;
  const crit = rand() < critChance;
  let dmg = Math.max(1, me.atk * randRange(0.85, 1.15) - target.def * 0.5);
  if (crit) dmg *= 1.6;
  const amount = Math.round(dmg);
  target.hp = Math.max(0, target.hp - amount);
  return { side, idx, tSide: 1 - side, tIdx: ti, kind: 'hit', amount, crit, tHp: target.hp };
}

export const game = new Game();
