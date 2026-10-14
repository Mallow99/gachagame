# Next build handoff

Status: **executable handoff v1, 2026-10-14**

This is the short path from the current PG-001/PG-002 branch to a working,
fun first version. The larger rosters are specifications and production queues;
they are not permission to postpone the game loop while hundreds of records are
typed.

## 1. Honest target for the next working build

The next owner-visible build should:

- boot old saves through SaveV4 migration;
- open a transparent, hideable strip;
- run authored SMB1 stage 1 as a deterministic four-wave roaming fight;
- show Classic Mario jumping on Goombas and Goombas flattening;
- show provisional Luigi, Toad and Peach behavior when enabled in a developer
  party: Luigi jumps higher, Toad physically combos/delivers and Peach floats;
- show an action gauge on every actor with no turn-order queue;
- take 90–150 seconds at the reference Rank rather than clearing in seconds;
- open the Paper Manual and explain the exact live formulas/events;
- keep all spendable banners disabled and visibly labeled until their pools
  pass release gates.

That is a working game slice. Twenty-two Mushroom fighters, twenty-two Dream
Land fighters and final summon art are subsequent production, not tomorrow's
definition of success.

## 2. Current repository state

- PG-001 and PG-002 are complete.
- Tests cover the current content seams, seeded randomness and compatibility.
- Four provisional production unit records exist: Classic Mario, Classic
  Luigi, Toad and Princess Peach.
- SMB1 stages 1–5 have data records, but the live prototype does not yet prove
  the complete authored roaming loop.
- SaveV4, continuous gauges, authored stage adapter and final Paper Manual shell
  remain the critical path.

## 3. Coding order

### Build A — PG-003: SaveV4 and migration

Implement exactly `08_DATA_AND_SAVE_CONTRACTS.md` §SaveV4.

**Files:**

```text
src/save/default-save.js
src/save/migrate.js
src/save/storage.js
src/game.js
test/save-v4.test.js
```

**Required outcomes:**

- v3 fixture migrates idempotently;
- only Classic Mario is granted on a new authored save;
- old dev units move to `collection.legacyUnits`;
- currencies, pity value and duplicate value never disappear;
- invalid party/family conflicts repair deterministically;
- a timestamped local pre-migration backup is retained.

Do not alter combat feel in this build.

### Build B — PG-004: continuous roaming combat

**Files:** `src/combat.js`, `src/strip.js`, `strip.html`, `strip.css`, balance
config and combat tests.

**Required outcomes:**

- remove every player-facing `NEXT`/initiative queue;
- every actor fills and resolves its own gauge;
- two actors may resolve in the same visual beat;
- encounter data controls 1–8 waves and inter-wave breath;
- event logs record movement, windup, marker, hit, heal, condition, knockout,
  idle/out-of-range time and wave transition;
- the strip's height and transparent click-through regions do not regress.

This build should expose marker/state APIs needed by Mario and Goomba, without
adding character-named physics branches.

### Build C — actor/encounter adapter

Connect `src/content` records to live combat.

**Required interfaces:**

```text
content unit -> combat actor stats/kit/animation IDs
encounter wave -> deterministic spawn schedule
combat event -> strip animation marker
stage result -> SaveV4 progression/reward transaction
```

The simulation owns timers and outcomes. Animation consumes events and may
recover after a dropped frame; an animation callback never owns authoritative
damage or state exit.

### Build D — PG-006: SMB1 stage 1

Use the authored four waves already specified in `07` and the encounter module.

**Actor requirements:**

- Mario: run, rise, apex, fall, foot-contact damage, rebound, hurt, knockout;
- Goomba: walk, headbutt/squash, hurt, flattened defeat;
- contact shadows and ground anchors remain stable under different strip widths;
- if provisional art is used, the collection and Manual display
  `PROVISIONAL ART`; the fight itself is not covered by a modal warning.

**Acceptance:**

- seeded median solo Mario wins below 50% HP with no knockout;
- stage duration is 90–150 seconds at Rank 1;
- no legal target leaves Mario idle more than 2 s;
- damage happens on visible contact and every defeated Goomba visibly flattens;
- replaying the seed reproduces event and reward order.

### Build E — PG-007: Paper Manual shell

Implement the off-white paper/ink/stamp treatment and four primary tabs. The
Manual must show live values from shared config, not copied prose.

Minimum pages for this slice:

- Atlas: SMB1 stages 1–5, only stage 1 launchable;
- Party: Classic Mario and labeled provisional preview actors;
- Summon: visible but non-spendable Fighter/Supply previews with release-gate
  explanation;
- Manual: action interval, damage, role/pattern, event log and art status.

## 4. Immediate follow-up to complete Area 1

| Ticket | Content | New primitive | Boss/exam proof |
| --- | --- | --- | --- |
| PG-008a | stage 2: Goomba + Koopa | shell substate and kickable actor | shell hits two enemies and exits/re-emerges legally |
| PG-008b | stage 3: pipes + Piranha | fixed hazard target and timed hide | no attack targets a hidden Plant |
| PG-008c | stage 4: Hammer Bro elite | ballistic Lob, perch jump | visible hammer fan and punish recovery |
| PG-009 | stage 5: Hammer Bros. | paired boss phases and survivor enrage | boss intro, stagger, enrage and defeat transition |

After stage 5 passes, implement the first deterministic Fighter result and the
Power-Up/Assist preview interactions. Do not enable the regional Archive until
all 22 normal fighters are actually production-ready.

## 5. Content-writing batches after the slice

The 22 Mushroom fighters are best implemented by shared systems:

1. `shell/state`: Koopa, Dry Bones, Tanooki statue;
2. `airborne/routes`: Luigi, Peach, Daisy, Hammer Bro, Kamek;
3. `secondary actors`: Birdo, Dr. Mario, Builder Mario, Bowser Jr., Cappy;
4. `grab/tether`: Yoshi, Poltergust Luigi;
5. `heavy/boss`: Bowser, Dry Bowser;
6. `complex acrobat`: Mario 64;
7. `simple authored bodies`: Toad, Captain Toad, Shy Guy.

Dream Land begins only after the Mushroom opening pool and stage slice are
honest. Its first batch is Kirby, Waddle Dee, Poppy Bros. Jr., Sir Kibble, Hot
Head and Whispy Woods, followed by the seven Copy profiles.

## 6. Source map for a coding agent

| Question | Authoritative file |
| --- | --- |
| what to code next | this file and `07_TODAY_BUILD_TICKETS.md` |
| combat math/ultimate floors | `02_SYSTEMS_AND_BALANCE.md` |
| data and SaveV4 shape | `08_DATA_AND_SAVE_CONTRACTS.md` |
| first 15 encounters/rewards | `12_FIRST_RELEASE_CONTENT.md` |
| exact Mushroom cards | `14_MARIO_KIRBY_CHARACTER_BIBLE.md`, `16_MARIO_KIRBY_ARCHIVE_EXPANSION.md` |
| Mushroom production manifest/Supply | `20_MUSHROOM_KINGDOM_PRODUCTION_PACKET.md` |
| exact Dream opening/three corrected cards | `21_DREAM_LAND_PRODUCTION_PACKET.md` |
| sprite states/provenance | `05_ASSET_PIPELINE.md` |
| UI flows | `09_UI_FLOW_AND_WIREFRAMES.md` |

If an older file conflicts with plans `17`–`25`, the newer reconciliation wins.
Do not silently choose whichever number is easiest.

## 7. Stop conditions

Stop and repair the current slice if:

- the stage becomes a stationary exchange of themed particles;
- a new fighter needs a character-specific engine hack rather than a declared
  primitive;
- placeholder art is presented as final;
- the banner accepts currency below its pool/content gate;
- stage 1 again clears in seconds;
- strip transparency, hide/show or click-through breaks;
- tests become nondeterministic.

## 8. Verification command set

Run after every build batch:

```bash
npm test
npm run web
npm start
```

`npm test` is automated. `npm run web` and `npm start` require visual/manual
checks for the page and Electron strip. Record a screenshot or short capture at
the real strip size for actor-feel acceptance; a headless pass alone cannot
prove Mario actually jumps on a Goomba.
