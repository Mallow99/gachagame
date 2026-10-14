# v1 playable build evidence

Base: the latest merged planning push, `codex/pg001-pg002`, commit
`ef450706ee74c709c7630b6e4ab94d7fa93be362`, 2026-10-14. Work is on isolated
local `codex/v1-playable`. The original planning corpus remains intact.

## Implemented

- SaveV4 migration/raw backups, retained legacy and unknown ownership, repaired
  parties/reports/Orders, independent currencies/pity, import/export and atomic
  paid receipts. Failed battle reward writes remain exportable and retry once.
- Independent 30 Hz roaming actors, seven patterns, persistent projectiles,
  timed contacts, stagger recovery, finite substates and bounded reports.
- All 15 SMB and 20 Adventure courses, bosses/phase changes, first-clear
  rewards, Camps, Atlas Key/Threat snapshots, Kirby unlock and mixed Endless.
- 28 numeric fighter records: 10 Mushroom and 18 Dream Land. Source Spotlights
  widen through story and remain smaller than the final regional Archives.
- Seven encounter Copy profiles, projectile inhale, elite Ability Stars,
  out-of-library fallback, no-Copy Game Boy Kirby and a separate finale loan.
- Eight normal Power-Ups and eight Assists per Hub, equipment/family/Hub
  checks, bounded procs, Training, stars, Technique Notes and fielding mastery.
  Mastery upgrades apply to secondary contacts, heals and shields exactly once;
  Assist proficiency adds at most 5% effect strength with complete rank-one kits.
- Assists reserve an entrance, resolve after arrival, and exit without taking a
  fighter slot. Tea healing/cleansing travels in a parcel; Tiara catches the
  actual back-row projectile. Kabu/Whispy/Kracko use sourced entrance bodies;
  other entrances use provisional printed-page symbols. Combat notices expire
  after victory independently of the stopped simulation clock.
- Paper Manual Atlas/Party/Summon/Manual, kit/formation/policy inspection,
  per-result rates, reports, Orders, recovery hints and separate audio controls.
- Banner art distinct from reveal art; 4.8-second flight/late rarity signal;
  SSR blackout/unnamed typed quote/separate letters; committed grid,
  skip/replay/reduced motion and restored pending reveals.
- Transparent strip and separate 360 × 600 observer Manual. Opening the Manual
  keeps simulation alive; hide pauses, fighter hotspots inspect, tray/shortcut
  restore, hidden-state restoration, and quit waits for a matching renderer save
  response. Write failure or timeout cancels quit and opens export recovery.

## Evidence

`npm test` covers deterministic combat, actual contact effects/substates,
migration/repair, save-write rollback, welcome/pity/featured rules, Supply
duplicates, Camps/Orders and the real Mushroom-to-Dream unlock path. Current
command output is the authority on test counts, not historical handoff counts.

`npm run validate:v1 -- --seeds 50 --write` runs the actual Battle engine for
50 seeds per course. `validation/v1-latest.json` records the exact parties,
ranks, durations and HP. Later Mushroom uses four classic R fighters; later
Dream uses Kirby, Parasol Dee, Sir Kibble and Hot Head. This proves the recorded
reference compositions without SSRs; it does not prove every pull outcome,
Rank, composition or hardware performance budget.

`node tools/simulate-player-path.mjs --accounts 20 --write` starts each account
with only Mario, 300 Coins and zero Starlight. The bot chooses owned legal
parties, spends earned rewards, equips owned Supply, trains, claims earned
Orders, farms measured Camps and retries after retreat. All 20 accounts cleared
35/35 stages in 2.5–3.3 simulated active hours, with 109–156 Camp clears,
81–86 Fighter pulls and five total retreats. `validation/player-path.json`
contains every stage and recovery path. Bot decisions are more systematic than
a new player's decisions; this is progression evidence, not a human playtest.

`validation/live-gacha.json` records one million production rarity decisions
per channel plus separate base-rate decisions. Fighter base SSR was 2.9963%;
Supply 5.0312%. Largest observed gaps matched 70/45 SSR and ten SR-or-better
results. Ownership, welcome replacements and paid receipts have separate tests.

The actual UI DOM was smoke-tested with a temporary LinkeDOM harness:
deploy → real clear → Training → paid pull → skip → saved results → party →
kit → Manual formulas. That does not prove CSS geometry. Native captures in
`validation/captures/` run the actual BattleView at field/strip sizes, including
360 pixels, Whispy and an SSR ultimate. The optional capture tool uses
`@napi-rs/canvas`, which is not a game runtime dependency.

## Material limits and next production work

This managed Linux sandbox refuses local socket operations: Chromium/Electron
terminate during socket setup and the HTTP server cannot bind here. A real
browser/M2 smoke pass remains required for the 360 × 600 CSS layout, keyboard
dialogs, audio timing, tray/shortcut, full-screen spaces, click-through,
dragging, pause/resume and save-on-quit. No browser/Mac screenshot or Mac
performance pass is claimed.

Source treatments remain provisional Grade B, including reused poses, palette
reconstructions and enhanced boss/NPC sheets. Bandana now uses sourced walk,
jab, jump and throw poses with separate held/thrown spear sources. Its copter
and ultimate motion remain provisional. The 58-atlas source manifest
records hashes/paths; original-game and artist authorship still need review.
Supply symbols without approved art are original printed UI symbols. Full
portraits, voice quotes and music are unfinished. Audio uses procedural
effects/stings and the retained Mario demo clip.

Regional Archives remain non-spendable until their exact 22-fighter rarity and
quality gates and growth queues pass. Mythics, owned Star Rod Awakening,
Hypernova/Super Ability characters, wanted sorties and further franchises are
not shipped. Endless interleaves courses from completed Hubs, rotates after each
clear, snapshots Atlas Threat at the start of a run and retains a personal best.
There are no generated Endless maps or dedicated Endless boss remixes yet.

Recheck balance after kit, movement, equipment or boss changes. Verify weak
welcome parties and compare protective/healing builds with damage builds;
the recorded reference sweep does not replace actually playing the game.
