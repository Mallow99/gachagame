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
  Landings now match contact; repeated charges travel through targets; Cape
  Counter replaces its fallback hit and answers after a visible exit/return.
  Ranged finishers fly before damaging, and throw poses repeat at releases.
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
50 seeds per course when requested. The current sprite pass rechecked five
seeds per course (175 fights), all clear; the earlier build checked 50.
`validation/v1-latest.json` records the current exact parties,
ranks, durations and HP. Later Mushroom uses four classic R fighters; later
Dream uses Kirby, Parasol Dee, Sir Kibble and Hot Head. This proves the recorded
reference compositions without SSRs; it does not prove every pull outcome,
Rank, composition or hardware performance budget.

`node tools/simulate-player-path.mjs --accounts 20 --write` starts each account
with only Mario, 300 Coins and zero Starlight. The bot chooses owned legal
parties, spends earned rewards, equips owned Supply, trains, claims earned
Orders, farms measured Camps and retries after retreat. All 20 accounts cleared
35/35 stages in 2.5–3.3 simulated active hours, with 109–157 Camp clears,
81–86 Fighter pulls and three total retreats in the current interaction pass.
`validation/player-path.json`
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

The network restrictions were removed during this sprite pass. Actual Chromium
now passes the fresh playable flow, keyboard dialog dismissal, the 360 × 600
observer CSS layout and three SSR source-art reveals. Evidence is in
`validation/sprite-review/browser/results.json` and its screenshots. The
observer bridge in that test is a local layout fixture; native M2 tray/shortcut,
full-screen spaces, click-through, dragging, audio and performance still need
an actual macOS pass.

The opening fighter sprites now match their declared games; Game Boy Kirby and
Blade Knight have separate atlases. Bandana uses the complete gameboy09 spear
adaptation, selected after comparison with a rendered original Wii model whose
archive has no animation tracks. Bowser uses Captain/FungiCaptain's expansion
of the actual classic NES design. Bodies keep one source-pixel scale and a
shared foot anchor across weapon poses. Finite clips hold their end frames;
skills/ultimates and source projectile effects use the appropriate clips.
Illustrations cover 24 pulls, including every current SSR, with actual version
years and readable reduced-motion reveal times. Koopa's official 2020 redraw
depicts the original 1985 body and is credited as a redraw. Hammer Bro/Buzzy
have fuller faithful expanded sheets; Parasol's native body and umbrella
articulate separately. The combat review at
`/docs/validation/sprite-review/combat.html` offers fourteen real-engine moves
with playback/seek/speed controls. Chromium motion evidence and frame sequences
are in `validation/sprite-review/motion/results.json`; source validation preserves
443 frames across 65 extracted atlases. The full manifest has 74 atlases.
See [the sprite review](SPRITE_REVIEW.md), current manifest and credited intake.

Source fidelity is not final human approval of feel. Sparse SR pose sets,
some authored signature effects, Whispy's assembled silhouette, remaining pull
illustrations and non-sourced Assist symbols still need polish. Full voice
quotes and music remain unfinished; audio uses procedural effects/stings and
the retained Mario demo clip. Rarity/version changes were weighed and recorded,
but ownership, rarity and banner balance were preserved in this pass.

Regional Archives remain non-spendable until their exact 22-fighter rarity and
quality gates and growth queues pass. Mythics, owned Star Rod Awakening,
Hypernova/Super Ability characters, wanted sorties and further franchises are
not shipped. Endless interleaves courses from completed Hubs, rotates after each
clear, snapshots Atlas Threat at the start of a run and retains a personal best.
There are no generated Endless maps or dedicated Endless boss remixes yet.

Recheck balance after kit, movement, equipment or boss changes. Verify weak
welcome parties and compare protective/healing builds with damage builds;
the recorded reference sweep does not replace actually playing the game.
