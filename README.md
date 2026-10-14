# Pocket Gacha

A personal desktop gacha RPG. Four fighters roam and fight along the bottom of
your screen while you work. The Paper Manual holds the Atlas, party, summon
pages and live rules. No store and no real money.

The v1 playable branch adapts **Super Mario Bros. (15 stages)** and **Kirby's
Adventure (20 stages)**, with 28 fighter records, separate Power-Ups and
Assists, renewable Camps and saved progression. Plain HTML/CSS/JavaScript in
Electron; the same game runs in a browser without a build step.

## Run

Use Node 22 or newer.

```bash
npm install
npm start       # transparent strip + 360 × 600 Paper Manual
npm run web     # browser: http://localhost:8080
```

The desktop strip starts the opening fight. Open **Manual** to manage it; the
fight continues while the Manual is visible. Click a fighter to inspect it.
Clicks pass through outside its controls and fighter hotspots. Hide or restore
it with the menu-bar star or **⌘⇧G** / **Ctrl+Shift+G**. Hiding pauses combat.
Sound starts off; enable it in Manual → Settings.

## First expedition

1. Mario is the only starter. Clear the four-wave opener for 100 Starlight.
2. Open Summon → Fighters. The first pull gives a new family and fills an empty
   party slot. Training raises every owned and future fighter's HP and Attack.
3. Advance through courses, or Camp at a cleared course for Coins and Patrol
   Marks. Ten Marks become 100 Starlight. The first five courses fund ten pulls.
4. Power-Ups open after stage 3; Assists after stage 5. Equip one Power-Up per
   fighter and one Assist for the party. Keep one fighter per family.
5. Clear Bowser's Castle, spend its Atlas Key, and enter Dream Land. Kirby joins
   as that Hub's starter. Story parties and Supply match their Hub; a completed
   Hub can contribute fighters to mixed-Hub Endless.

Skills start half charged, each actor has an independent readiness gauge, and
ultimates use 100 energy. Kirby acquires seven Copy profiles from encounter
enemies; Dream Land Kirby never copies. Nightmare lends the Star Rod during
the finale, separately from ownership and Copy.

Summons save results before animation. Skip, close/reopen, or replay the theater
without rerolling. Fighter pages share Fighter pity; Power-Up and Assist pages
share separate Supply pity. Individual rates, Echoes and history appear on each
page. **Regional Archives remain previews:** the smaller Source Spotlights are
live; the final 22-fighter Archive and growth gates are still production work.

Endless rotates through the courses of completed Hubs, raises Threat each round
and saves your best streak. Build a crossover party in Atlas → Endless.

## Saves

SaveV4 upgrades the old prototype locally, retains timestamped raw backups and
preserves currency, pity and the original prototype ownership records. Export
or import a JSON backup in Manual → Settings. Unknown owned records stay in the
save. Away earnings use a cleared Camp's measured pace, capped at 12 hours;
they pay Coins and Starlight and never clear story stages.
If a save write fails after a clear, its pending rewards remain in exported
backups. Use **Save now** to retry. Desktop quit cancels if saving fails or the
strip does not acknowledge the request.

After the first Area boss, complete three Field Order stamps for 400 Starlight,
250 Coins and two Supply Tickets. Up to three unclaimed folders can be stored.

## Verification

```bash
npm test
npm run validate:v1 -- --seeds 50 --write
node tools/simulate-live-gacha.mjs --write
node tools/simulate-player-path.mjs --accounts 20 --write
```

See [the build report](docs/V1_BUILD_REPORT.md), [balance evidence](docs/validation/v1-latest.json),
[source credits](assets/sprites/PROVENANCE.md), and [sprite contact sheet](assets/sprites/v1/contact-sheet.png).
Game-specific sprite replacements, source-game pull art and an animated
[sprite review](docs/SPRITE_REVIEW.md) are now included. Native captures use the
actual BattleView; Chromium checks cover the playable flow and 360 × 600 Manual.
Sparse pose sets, some signatures/audio and a real M2 desktop pass remain work.
The animated comparison runs at `/docs/validation/sprite-review/index.html`.
Play, pause and scrub fourteen actual attacks at
`/docs/validation/sprite-review/combat.html`; the review uses isolated encounters
and does not change your save.

| Path | Responsibility |
| --- | --- |
| `src/game.js`, `src/save/` | Account, progression, atomic paid draws, migration and backups |
| `src/combat/engine.js`, `src/config/rules.js` | Deterministic roaming actors, contacts, conditions and formulas |
| `src/content/` | Fighter kits, enemy actors, 35 authored courses and summon pools |
| `src/render/`, `src/runtime.js` | Source clips, fixed-step simulation and canvas presentation |
| `src/main.js`, `src/presentation/` | Paper Manual, summon pages, theater and art |
| `electron/`, `src/strip.js` | Authoritative strip, observer Manual and desktop controls |

The old prototype data/views/combat remain compatibility fixtures and are not
the live v1 runtime. Read [the plan index](docs/plan/README.md) for the definitive
longer-term design and [HANDOFF.md](HANDOFF.md) for history.
