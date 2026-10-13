// Game state and rules: currencies, collection, gacha rolls, battles, saving.
// No DOM in here. Screens read from `game` and listen for 'changed', which
// keeps the rules reusable if an online mode ever happens.
import * as D from './data.js';
import { createRandom, pickRandom, randomInt } from './random.js';
import { parseSaveV3, SAVE_KEY, SAVE_VERSION, serializeSaveV3 } from './save-v3.js';

const runtimeRandom = createRandom();

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
    this.owned = Object.fromEntries(['mario', 'walter', 'sahur', 'bob'].map((id) => [id, { lvl: 1, asc: 0 }]));
    this.party = ['mario', 'walter', 'sahur', 'bob'];
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
    } else if (this.owned[id] && this.party.length < D.MAX_PARTY && !this.partyFamilyConflict(id)) {
      this.party.push(id);
    } else {
      return false;
    }
    this.save();
    this.emit();
    return true;
  }

  /** Variants are separate units, but only one member of a family can fight. */
  partyFamilyConflict(id) {
    const hero = this.hero(id);
    const family = hero?.family;
    if (!family) return null;
    return this.party.find((member) => member !== id && this.hero(member)?.family === family) || null;
  }

  // --- Gacha ----------------------------------------------------------------

  /** SSR chance for the *next* pull, including soft and hard pity. */
  ssrChance() {
    const n = this.pitySsr + 1;
    if (n >= D.HARD_PITY) return 1;
    if (n > D.SOFT_PITY) return Math.min(1, D.SSR_RATE + D.SOFT_PITY_STEP * (n - D.SOFT_PITY));
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
    const roll = runtimeRandom();
    let rarity = 3;
    if (roll < ssr) rarity = 5;
    else if (this.pitySr + 1 >= D.SR_PITY || roll < ssr + D.SR_RATE) rarity = 4;
    this.pitySsr = rarity === 5 ? 0 : this.pitySsr + 1;
    this.pitySr = rarity >= 4 ? 0 : this.pitySr + 1;

    const h = pickRandom(this.heroesOfRarity(rarity), runtimeRandom);
    const res = { id: h.id, rarity, isNew: false, ascUp: false, refund: 0 };
    if (!this.owned[h.id]) {
      this.owned[h.id] = { lvl: 1, asc: 0 };
      res.isNew = true;
      if (this.party.length < D.MAX_PARTY && !this.partyFamilyConflict(h.id)) this.party.push(h.id);
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
    const boss = D.stageInfo(s).boss;
    return { gems: 25 + 5 * s + (boss ? 75 : 0), gold: 60 + 18 * s + (boss ? 120 : 0) };
  }

  makeEnemies(s, options = {}) {
    const info = D.stageInfo(s);
    const p = D.ENEMY_GROWTH ** (s - 1);
    const boss = options.boss ?? info.boss;
    const mod = options.modifier || {};
    const random = options.random || runtimeRandom;
    const hpMod = mod.hp || 1;
    const atkMod = mod.atk || 1;
    const defMod = mod.def || 1;
    const spdMod = mod.spd || 1;
    if (boss) {
      const [name, color] = info.area.boss;
      return [unit(name, color, 300 * p * hpMod, 15 * p * atkMod, 7 * p * defMod, 9 * spdMod, true, 'charge', enemyArt(name))];
    }
    const baseCount = info.worldStage === 1 ? 1 : info.areaStage < 4 ? 2 : 3;
    const count = options.count ?? baseCount;
    return Array.from({ length: count }, () => {
      const [name, color] = pickRandom(info.area.enemies, random);
      return unit(name, color, 60 * p * hpMod, 11 * p * atkMod, 4 * p * defMod, randomInt(6, 13, random) * spdMod, false, 'melee', enemyArt(name));
    });
  }

  partyUnits() {
    return this.party.map((id) => {
      const h = this.hero(id);
      const s = this.stats(id);
      return { id, name: h.name, color: h.color, cls: h.cls, art: h.art, attackStyle: D.attackStyleFor(h), boss: false, hero: true,
        hp: s.hp, maxHp: s.hp, atk: s.atk, def: s.def, spd: s.spd };
    });
  }

  teamPower(units) {
    return units.reduce((t, u) => t + Math.floor(u.maxHp / 4 + u.atk * 2 + u.def * 2 + u.spd), 0);
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
    try {
      localStorage.setItem(SAVE_KEY, serializeSaveV3(this, this.lastSeen));
    } catch {
      // storage unavailable (private window etc.); the game still runs
    }
  }

  load() {
    try {
      const data = parseSaveV3(localStorage.getItem(SAVE_KEY));
      this.applySave(data);
    } catch {
      // storage unavailable (private window etc.); keep the fresh game
    }
  }

  applySave(data) {
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
    // Replace the placeholder-only starter team with the three characters from
    // the approved roaming prototype. Keep every unit and level already earned.
    const oldStarters = new Set(['bob', 'dave', 'pete', 'gary']);
    const onlyOldStarters = Object.keys(owned).length > 0 && Object.keys(owned).every((id) => oldStarters.has(id));
    if ((data.saveVersion || 0) < SAVE_VERSION && onlyOldStarters) {
      for (const id of ['mario', 'walter', 'sahur']) owned[id] = { lvl: 1, asc: 0 };
      data.party = ['mario', 'walter', 'sahur', 'bob'];
    }
    if (Object.keys(owned).length) {
      this.owned = owned;
      const party = [...new Set((Array.isArray(data.party) ? data.party : []).filter((id) => owned[id]))];
      this.party = [];
      for (const id of party) {
        if (this.party.length >= D.MAX_PARTY) break;
        if (!this.partyFamilyConflict(id)) this.party.push(id);
      }
      if (!this.party.length) this.party = [Object.keys(owned)[0]];
    }
  }
}

function unit(name, color, hp, atk, def, spd, boss, attackStyle, art) {
  return { id: name, name, color, cls: '', art, attackStyle, boss, hero: false,
    hp: Math.round(hp), maxHp: Math.round(hp), atk: Math.round(atk), def: Math.round(def), spd };
}

function enemyArt(name) {
  return /goomba/i.test(name) ? { icon: 'demos/strip/goomba.webp' } : undefined;
}

export const game = new Game();
