# Today's build tickets

This is the executable queue for the next coding session. It translates the
larger plan into changes that fit the existing vanilla-JavaScript/Electron app.
The goal is not to finish the gacha today; it is to leave a playable first
encounter on architecture that can support the rest of the first World.

## First implementation milestone

A development build boots old saves, shows only the four planned free fighters
to a new player, loads **Super Mario Bros. stage 1** from authored content, and
runs a deterministic four-wave roaming battle with no turn-order queue. The
strip can still hide, pass clicks through and open management. A developer can
change the encounter without editing combat code.

This target is intentionally asset-tolerant. Placeholder sprites are acceptable
behind visible `PROVISIONAL ART` labels; fake characters are not acceptable in
the player-facing collection.

## Ticket order

### PG-001 — Freeze and test the current rules

**Purpose:** establish a safety net before changing saves and content.

**Files:** `package.json`, new `test/`, small exports from `src/combat.js` and
`src/game.js` as needed.

**Work:**

- add `npm test` using Node's built-in test runner; do not add a framework;
- test `actionSeconds`, damage boundaries and every attack-behavior lookup;
- extract a seedable random function for tests and development replays;
- capture a v3 save fixture with currencies, owned fixtures, party and pity;
- add a serialization test that never touches Electron or the DOM.

**Acceptance:**

- `npm test` runs without Electron;
- the same seed produces the same first 20 random values and battle outcomes;
- current v3 fixture parses and no baseline behavior changes;
- `npm start` and `npm run web` still boot.

**Estimate:** 1–2 focused hours. **Depends on:** nothing.

### PG-002 — Introduce the content and balance seams

**Purpose:** stop adding new constants and roster records to `src/data.js`.

**Files:**

```text
src/config/balance.js
src/content/index.js
src/content/units.js
src/content/enemies.js
src/content/worlds.js
src/content/encounters/smb1.js
src/content/banners.js
src/content/dev-fixtures.js
```

**Work:**

- move new trial formulas into `balance.js`, leaving compatibility re-exports
  in `data.js` until old views are migrated;
- add stable records for the four free fighters, Goomba, Koopa Troopa,
  Piranha Plant, Hammer Bro, the SMB1 World and stages 1–5;
- keep Walter White, Tung Tung Sahur and generic heroes in `dev-fixtures.js`;
- expose `getUnit`, `getEnemy`, `getWorld` and `getEncounter` lookups;
- add a validator that checks duplicate IDs and broken references at startup in
  development and in tests.

**Acceptance:**

- importing content has no DOM or local-storage side effects;
- a bad enemy reference makes the validator name the exact stage and field;
- stage 1 can change waves by editing only `smb1.js`;
- player-facing queries exclude every dev fixture.

**Estimate:** 2–3 hours. **Depends on:** PG-001.

### PG-003 — Save v4 and migration

**Purpose:** replace global stage and individual levels before more systems
depend on them.

**Files:** new `src/save/default-save.js`, `src/save/migrate.js`,
`src/save/storage.js`; adapt `src/game.js`.

**Work:**

- implement the exact `SaveV4` contract in `08_DATA_AND_SAVE_CONTRACTS.md`;
- migrate v3 gems to Starlight, gold to Coins and pity to Fighter pity;
- map the current stage to a completed legacy/dev World record rather than
  pretending the player cleared authored SMB1;
- derive one conservative Training Rank from the old party's median level,
  capped at 10 for prototype saves;
- retain old owned units under `collection.legacyUnits`, not the live Library;
- keep a timestamped pre-migration backup string in local storage;
- repair invalid party IDs and family conflicts deterministically.

**Acceptance:**

- migration is idempotent;
- new save, v3 fixture, corrupt JSON and missing-content fixtures all load;
- migration never deletes currency, decreases total owned duplicate value or
  grants authored World clears;
- save round-trip equality is tested after volatile timestamps are omitted.

**Estimate:** 3–4 hours. **Depends on:** PG-001 and the ID list from PG-002.

### PG-004 — Remove turn-order residue and lengthen stages

**Purpose:** make the strip communicate readiness directly.

**Files:** `src/strip.js`, `strip.html`, `strip.css`, `src/combat.js`.

**Work:**

- remove the `NEXT` queue and any initiative copy;
- show a small action gauge on or below each actor;
- let all actors fill gauges continuously and resolve when ready;
- support authored 4–6-wave encounters instead of the global three-wave rule;
- add a 1.5-second inter-wave breath and an optional boss-intro pause;
- display World, local stage, wave count and concise encounter modifier;
- log action, damage, healing, knockout and idle/out-of-range time.

**Acceptance:**

- two ready actors can act in the same visual beat without waiting for a queue;
- stage 1 lasts 90–150 seconds at the reference rank in deterministic tests;
- all seven behaviors still look mechanically different;
- strip height does not grow and its transparent regions remain click-through.

**Estimate:** 3–5 hours. **Depends on:** PG-001. Can overlap PG-002.

### PG-005 — Account-wide Training Rank

**Purpose:** ensure every new pull is immediately usable.

**Files:** `src/game.js`, `src/config/balance.js`, collection/party/Manual views.

**Work:**

- replace fighter `lvl` in combat calculations with `training.rank`;
- implement `round5(80 × 1.085^(rank−1))` as the trial next-rank Coin cost;
- show current and next-rank team-wide gains before purchase;
- keep stars/ascension as an independent per-unit record;
- show reference team Rank and recommended Rank on encounter details.

**Acceptance:**

- pulling a new unit gives it exactly the account's combat rank;
- buying one rank updates every owned unit's displayed stats;
- the Manual formula and the simulation use one shared function;
- the UI never offers an individual level-up button.

**Estimate:** 2–3 hours. **Depends on:** PG-003.

### PG-006 — Authored SMB1 stage 1

**Purpose:** prove the data path with a real roaming encounter.

**Files:** SMB1 content modules, combat actor adapter, provisional sprite map.

**Encounter:**

1. three Goombas with staggered entry;
2. two Goombas, then a late third from the opposite edge;
3. four-Goomba pressure wave with wider spacing;
4. Goomba pair plus one sturdier Veteran Goomba elite.

No unique boss appears. Pipes and blocks are non-colliding foreground/background
props in this ticket; collision terrain is deferred until the movement loop is
proven.

**Acceptance:**

- the free Rank-1 party wins the fixed reference seed with 1–2 members below
  50% HP and no knockout in the median run;
- auto-targeting does not leave a unit idle for more than two seconds while a
  legal target exists;
- Mario visibly stomps, Luigi charges/jumps, Peach lobs and Toad combos/heals;
- replaying the seed reproduces rewards and event-log order.

**Estimate:** 2–4 hours after PG-002/004. **Depends on:** PG-002 and PG-004.

### PG-007 — Paper Manual shell

**Purpose:** remove the generic dashboard feeling without waiting for final art.

**Files:** `index.html`, `styles.css`, `src/main.js`, view modules.

**Work:**

- use an off-white paper field, dark ink, muted red stamps, tabbed dividers and
  restrained halftone texture;
- establish four primary tabs: `Atlas`, `Party`, `Summon`, `Manual`;
- make currencies a narrow ledger, not oversized glass cards;
- add clear provisional-art and locked-feature stamps;
- keep summon ceremonies saturated and theatrical so they contrast the Manual.

**Acceptance:**

- the app reads as a game field guide at first glance;
- every current action has keyboard focus, hover and disabled states;
- no important status relies only on color;
- at 360×600 there is no horizontal scroll.

**Estimate:** 3–5 hours. **Depends on:** none; wireframes in `09`.

## Today's cut line

**Minimum safe stopping point:** PG-001 and PG-002. At that point the existing
prototype still runs, tests protect its math, and the real SMB1 records are
separate from dev fixtures.

**Visible session target:** the core of PG-004 followed by PG-006. That produces
the real four-wave stage-1 fight. If time runs out between them, keep the old
combat adapter working and do not claim the new encounter is playable.

**Good stretch:** PG-003, then PG-005. These prevent future progression debt.

**Visual stretch:** PG-007. It can begin independently, but it must not delay a
real authored fight.

**Do not start today:** full gacha ceremony, final sprite scrape, stages 2–15,
Kirby, UR implementation, Mastery, real-time events, payments or social systems.

## Next tickets after the first session

| Ticket | Outcome | Dependency |
| --- | --- | --- |
| PG-008 | SMB1 stages 2–4 with Koopa, pipe and Hammer Bro behaviors | PG-006 |
| PG-009 | stage 5 Hammer Bros. boss and first ten-pull reward | PG-008 |
| PG-010 | Party builder, family lock and two saved presets | PG-003/005 |
| PG-011 | Fighter Spotlight with permanent pity | PG-003/010 |
| PG-012 | Supply Spotlight and one Power-Up/Assist slot | PG-010 |
| PG-013 | SMB1 stages 6–10 and Lakitu | PG-009/012 |
| PG-014 | SMB1 stages 11–15, Bowser and credits card | PG-013 |
| PG-015 | Atlas Key choice screen and Threat snapshot | PG-014 |
| PG-016 | Field Desk, legal Order generator and Coin/Fighter Practice Sorties | PG-003/006 |
| PG-017 | Assist Proficiency, Assist Study and first SMB1 Wanted Hunts | PG-012/016 |

## Definition of done for any ticket

- test or deterministic fixture covers the new rule;
- the Manual describes the exact shipped behavior;
- content/config owns tunable values;
- save compatibility is considered explicitly;
- keyboard and 360×600 layouts are checked;
- the strip's hide/click-through/full-screen behavior is rechecked;
- provisional content is labeled rather than implied to be final.
