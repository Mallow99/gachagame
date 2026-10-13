# Implementation sequence

This is the coding order. It protects the user's central request—build the
game before producing a giant cast—while making the first real banners arrive
soon enough to judge the complete loop.

Effort estimates are relative slices, not calendar promises. A phase is done
only when its acceptance checks pass. Later phases do not begin because a file
exists; they begin because the preceding loop is playable.

## Phase map

| Phase | Deliverable | Relative effort | Depends on |
| --- | --- | ---: | --- |
| 0 | Baseline, instrumentation and contracts | 1 | current prototype |
| 1 | Data spine and save migration | 2 | 0 |
| 2 | Real-time roaming combat and desktop shell | 4 | 1 |
| 3 | Training, rewards, failure and offline loop | 2 | 2 |
| 4 | Super Mario Bros. stages 1–5 | 4 | 2–3 |
| 5 | Fighter/Supply banners and team building | 3 | 1, 3–4 |
| 6 | Super Mario Bros. stages 6–15 | 4 | 4–5 |
| 7 | Atlas choice and Kirby's Adventure (20 stages) | 6 | 6 |
| 8 | Repeatable World production pipeline | ongoing | 7 |

The first meaningful owner review is after Phase 2; the first complete
vertical-slice review is after Phase 5.

## Phase 0 — preserve and measure the current prototype

Purpose: prevent a rebuild from silently losing the few things that already
work.

### Work

- Record current `src/data.js`, `src/game.js`, `src/combat.js`, window behavior
  and save schema as migration input, not future architecture.
- Put the old roster and generic enemies behind `devFixtures`; never delete
  them until real content can boot every view and run combat.
- Add a local debug overlay or log export for:
  - stage and wave time;
  - each actor's damage, healing, actions and time idle/out of range;
  - damage taken and deaths;
  - ultimate uses;
  - rewards earned;
  - retry count and reason for a loss.
- Add a deterministic seed to combat and pulls in development mode. Production
  remains random; test fixtures can replay the same fight.
- Capture baseline screenshots of hidden, strip and management states.

### Acceptance

- A current v3 save can be exported and restored unchanged.
- The same seeded fight creates the same event log twice.
- Telemetry is local only and can be cleared with the save.
- No player-facing behavior changes in this phase.

## Phase 1 — data spine and save v4

Purpose: make a World, encounter, unit or banner an independent content record
instead of another conditional in `game.js`.

### Recommended first layout

```text
src/
  config/balance.js
  content/
    index.js
    units.js
    enemies.js
    powerups.js
    assists.js
    worlds.js
    banners.js
    encounters/smb1.js
    dev-fixtures.js
  systems/combat/
  systems/progression/
  systems/gacha/
  systems/atlas/
  save/
assets/manifest.json
```

The current app has no bundler or typed build step, so the first production
records stay in ordinary ES modules with JSDoc-shaped contracts. This is a
boundary, not a framework rewrite. Once the authoring model stabilizes, a
validator/export tool may emit JSON and formal schemas without changing the
runtime contracts. Do not make the first fight wait for a fetch/loader system.

### Stable record rules

- IDs never change after a build ships. Display names and files may change.
- Saves store IDs and values, never array indexes or whole content objects.
- A missing content ID becomes a visible migration warning and a safe fallback,
  not a crash or silent deletion.
- Cross-record references are validated before packaging.
- Every numeric tunable is in balance data, not copied across views.
- Every value shown in the Field Manual comes from the same config or formula
  used by the simulation.

### Minimum unit contract

```js
{
  id, familyId, sagaId, sourceGameId,
  name, title, rarity, role, rowPreference,
  baseStats: { hp, attack, guard, moveSpeed, haste, critChance },
  basic: { pattern, coefficient, interval, range, targetRule, effects },
  passive, skill, ultimate,
  traits, powerupCompatibility,
  artId, spriteId, releaseId,
  productionStatus
}
```

`pattern` is one of `strike`, `shot`, `combo`, `charge`, `stomp`, `lob` or
`beam`. `traits` such as Fire, Airborne, Ghost or Mechanical are encounter
vocabulary, not a universal damage triangle.

### Minimum enemy contract

```js
{
  id, sourceGameId, archetype, size,
  baseStats, movement, attacks, telegraphs, traits,
  threatCost, rewardWeight,
  spriteId, productionStatus
}
```

Bosses use the same actor contract plus phases, phase gates, break rules and
camera presentation. A boss is not implemented as a giant ordinary enemy.

### Minimum World and encounter contract

```js
{
  world: {
    id, sagaId, sourceGameId, length, areaIds,
    atlasPrerequisites, atlasChoices, minThreat, maxThreat,
    rankReward, keyReward, bannerIds
  },
  encounter: {
    id, worldId, storyStage, areaId, waves,
    environment, modifiers, clearRules, rewards,
    recommendedTrainingRank, referenceTeams
  }
}
```

### Save v4

Save sections are independent and versioned:

```text
profile       settings, seen tutorials, play clocks
progression   training rank, atlas rank/xp, unlocked Worlds, per-World progress
collection    owned units, stars, mastery, family discoveries
loadouts      parties, Power-Ups, Assist Page, saved presets
inventory     coins, Starlight, Supply Tickets, Echoes, materials
banners       pity and guarantee state by banner channel
content       last compatible content version and migrations applied
```

Migration v3 → v4 maps the current global stage to the legacy prototype World,
converts individual levels into a conservative initial Training Rank, preserves
currencies and ownership, and leaves old units as dev/legacy collection entries.
It must not award a high rank from one abnormally leveled fixture.

### Acceptance

- Validation rejects duplicate IDs, broken references, illegal patterns,
  impossible family IDs and invalid World lengths.
- A content record can be added without editing the combat engine.
- Save v3 migrates, reloads and produces the same or greater owned value.
- A round trip through save/load is structurally identical.

## Phase 2 — roaming combat and desktop shell

Purpose: prove the game is fun to watch before adding content systems.

### Simulation

- Separate simulation state from rendering. The simulation uses a fixed step;
  interpolation makes movement smooth.
- Every actor independently cycles through acquire target → move/aim → windup
  → resolve → recovery. Gauges show readiness; there is no `NEXT` queue.
- Frontliners physically close distance. Ranged units hold preferred range and
  step away when threatened. Stomp units arc onto a target. Charges cross the
  lane. Projectiles have travel time when visually useful.
- Target rules are explicit: nearest, lowest HP, backmost, highest threat,
  marked target or area centroid.
- Hit, miss, block, heal, critical and status events originate in simulation
  and are rendered once. Animation never decides whether damage occurred.
- Collision is lane-based and forgiving. Characters may overlap slightly;
  pathfinding must not become a project.
- Actors re-enter formation between waves rather than snapping constantly.
- Ultimate energy exists in the model, but Phase 2 may use a plain debug effect
  before finished cut-ins.

### Seven pattern primitives

Implement each once and drive it from data:

1. `strike` — close-range single hit.
2. `shot` — ranged projectile, usually one target.
3. `combo` — several timed sub-hits, interruptible only when explicitly tagged.
4. `charge` — actor traverses through/to a target and may cleave a line.
5. `stomp` — jump arc plus impact radius.
6. `lob` — arcing projectile with splash at a ground point.
7. `beam` — line/piercing resolution with a readable warning.

These are animation and spatial mechanics. Fire or Ice may decorate any one of
them without changing the global matchup chart.

### Desktop behavior

- Transparent full-width strip, with no opaque panel behind the fight.
- Empty pixels pass pointer input to the desktop. Interactive HUD elements do
  not.
- One visible compact button and `Cmd/Ctrl+Shift+G` toggle hide/show.
- Menu-bar/tray control can restore a completely hidden strip.
- Strip does not cover the Dock/taskbar and is absent over full-screen spaces
  where the OS permits.
- Management window opens by clicking a deliberate game control, not any empty
  point in the strip.
- HUD contains World/Area/stage, wave, four compact health/action/ultimate
  indicators, rewards pending, menu and hide. No decorative full-height card.
- `Reduced motion`, `mute`, `pause combat`, `30/60 fps` and scale settings are
  available early.

### Management-window art direction

**LOCKED:** the management application should look authored for this game, not
like a generic dark AI dashboard.

- The home/roster/rules shell is a **field manual and collector's binder**:
  warm off-white paper, printed ink, tab dividers, taped/stamped source-game
  notes, small diagrams and marginal annotations. Texture remains subtle enough
  for small text.
- Main chapters are `Atlas`, `Party`, `Archive`, `Summon` and `Manual`. Use
  icon plus visible label; do not hide essential navigation in mystery glyphs.
- Mechanics pages look like real technical manual spreads: formula, labeled
  diagram, worked example and last-battle evidence. They do not describe exact
  systems with vague bars alone.
- World pages may borrow a restrained accent/pattern from the current source
  game while the manual's paper/ink frame keeps the application coherent.
- The Summon chapter deliberately breaks out of the quiet manual into a
  saturated gacha poster/theater. Banner art, pull object and reveal each have
  different compositions. Closing Summon returns to the binder.
- Roster cards lead with art, name, rarity and attack-pattern silhouette. Avoid
  nested rounded rectangles, glass blur, neon purple gradients, excessive
  pills, stock sparkles and emoji as final iconography.
- Paper ornaments, chapter icons, rarity frames, stamps, pointers and diagrams
  are their own small UI-art asset set. They are not assembled from random
  franchise screenshots.
- Animations are page turns, sliding index cards, ink stamps and brief poster
  flourishes. Reduced Motion replaces them with fades while preserving timing
  and information.
- At 360×600, every primary screen has one obvious action and no horizontal
  scrolling. Long stat detail belongs on a readable page, not a tooltip maze.

Before accepting the art direction, compare five representative screens side
by side—home, party, unit detail, Atlas and banner. They must look like one
physical collection with a special summon theater, not five generated mockups.

### Performance budget

- Target 30 fps by default on the owner's M2 MacBook Air; 60 is optional.
- Throttle to 10 fps when the fight is paused/settled and suspend rendering
  when hidden. Progress is calculated from timestamps rather than rendering.
- No continuous particle allocation, unbounded DOM nodes or uncompressed
  full-resolution pull art in the strip.
- A 30-minute run should show stable memory rather than monotonic growth.

### Acceptance

- A four-unit fixture party visibly demonstrates melee closing, ranged spacing,
  stomp, charge, lob and beam behavior.
- A seeded five-wave fight lasts within its configured target and no actor
  stalls forever outside range.
- Hide/show works from the strip, shortcut and menu after a complete hide.
- Normal browser/app interaction beneath empty strip pixels still works.
- A screenshot at rest reads as characters on the desktop, not a dashboard.
- Thirty minutes of repeat combat has no crash, runaway memory or duplicate-hit
  event.

## Phase 3 — progression, rewards and being stuck productively

Purpose: turn a combat toy into a loop without adding gacha yet.

### Work

- Replace individual level purchasing with account-wide Training Rank.
- Award Coins continuously through enemy/wave clears; award Starlight primarily
  through first clears, bosses, missions and chests.
- Add `Advance` and `Camp` modes. Advance challenges the next uncleared stage;
  Camp repeats the selected cleared stage for resources.
- On defeat, return to the most recent camp stage, show the exact reason in the
  Field Manual/battle report and retry only after its configured delay.
- Add the first daily page without streak loss: three small goals, all
  completable in normal play, with an accumulating three-day buffer.
- Add away earnings based on the best cleared camp stage. Cap at 12 hours for
  the trial; active play remains more rewarding because it can advance, open
  chests and complete goals.
- Build the Field Manual from live config: formulas, pattern timings, status
  definitions, current enemy data and a last-battle breakdown.

### Acceptance

- A new unit fixture at hour ten inherits the same Training Rank as the party.
- A player who loses has at least two visible routes: train/farm or change
  composition; the game does not loop an unwinnable fight every few seconds.
- Offline rewards for 1, 6, 12 and 24 hours match the documented cap exactly.
- The Field Manual's displayed damage example reproduces an actual seeded hit.

## Phase 4 — Super Mario Bros. Overworld, stages 1–5

Purpose: replace fixtures with one small piece of the real game.

### Content freeze

- Four normal enemy families: Goomba, Koopa Troopa, Piranha Plant and Hammer
  Bro.
- One boss: a two-Hammer-Brothers encounter with staggered jumps, hammer arcs
  and an enrage when one falls.
- Five authored stages with 4–6 waves each; stage 5 has a boss phase.
- One background kit with parallax grass, blocks, pipes and a distant castle;
  variation comes from layout, time and hazards rather than five backgrounds.
- Four story-ready fighters plus enough banner candidates to test rarity after
  Phase 5. Exact production roster is gated by `05_ASSET_PIPELINE.md`.
- One universal Fire Flower test Power-Up and one Assist Page test.

### Acceptance

- All five stages are beatable by the free reference party at the expected
  Training Rank with no random pull.
- A typical clear takes 90–210 seconds; stage 5 takes 180–360 seconds. An
  overbuilt party is faster but cannot skip boss phase gates.
- Goomba, Koopa, Piranha and Hammer Bro can be identified by behavior with
  placeholder labels hidden.
- Hammer arcs and landing danger are telegraphed early enough to react through
  team building, not manual twitch controls.
- The real content can replace fixtures without deleting fixtures from tests.

## Phase 5 — banners, collection and team building

Purpose: close the strip → reward → pull → stronger/different strip loop.

### Work

- Implement three independent banner channels: Fighter, Supply and Mythic.
  Mythic remains locked/empty in the first slice but its save namespace exists.
- Port the approved pull presentation into the management application. The
  banner poster is not the reveal art.
- Implement single and ten-pull, skip-to-results, pity, featured guarantee,
  stars, max-star conversion and pull history.
- Fighter pulls use Starlight; Supply uses Tickets; the two never share a draw.
- Ten-pull guarantees SR-or-better. SSR/UR each receive their proper ceremony;
  R/SR reveals stay brisk.
- Implement roster filters, exact stats, kit pages, family lock, party presets,
  one Power-Up per fighter and one Assist Page per party.
- The first story party is granted outside gacha. The first ten-pull is earned
  through play and grants Hammer Bro if it contains no new SR-or-better fighter,
  so the banner always changes the account without suppressing natural SSRs.

### Acceptance

- Rates from a one-million seeded-draw test match configured probabilities
  within statistical tolerance and never violate hard pity.
- Pity/guarantee state persists separately by channel and survives reload.
- Two fighters from one family cannot be saved to one party, including through
  a stale preset.
- A freshly pulled fighter can be fielded immediately at current Training Rank.
- Duplicate and max-star conversions are explained before the player pulls.
- Currency earned in the strip buys a pull; that pull can visibly change the
  next strip fight.

## Phase 6 — finish the Super Mario Bros. World

Build the remaining two Areas from the exact stage sheet in
`04_CONTENT_CATALOG.md`. Add underground/high-road, water and castle
movement/hazards; Blooper, Lakitu, Impostor Bowser and Bowser; full Area
Spotlights; World finale; Atlas Key; Mastery replay data.

The World remains anchored to the 1985 game. Later characters are not borrowed
as bosses merely because they are famous. A clearly marked remix may enlarge an
original enemy where the source title lacks a suitable named boss.

### Acceptance

- Stages 1–15 form three visually/mechanically distinct Areas from one coherent
  title.
- Free-reference clear, typical clear, premium clear and internal-UR check all
  meet the balance envelopes in `02_SYSTEMS_AND_BALANCE.md`.
- Bowser demonstrates at least two phases even against a strong SSR party.
- The final reward reveals the Atlas and grants one actual choice, not a menu
  whose alternatives are disabled.
- Area banners archive correctly when their progress window ends.

## Phase 7 — Atlas and Kirby's Adventure

Purpose: prove that the architecture handles route choice and a mechanically
different game rather than becoming a Mario-specific engine.

- Implement Atlas nodes, key spending, reveal-time Threat snapshots and
  unchosen-route persistence.
- Offer at least Kirby's Adventure, Super Mario Bros. 3 and an Arcade cabinet
  route after the opening World, even if only the chosen production-ready route
  can initially launch. Never consume a key for unshipped content.
- Build Kirby's Adventure as the second 20-stage World: copy-ability Supply
  content, aerial enemies, guarded Meta Knight, Nightmare vulnerability and a
  different movement silhouette.
- Add Mastery I to the completed Mario World rather than appending generic
  stages 26–100.

### Acceptance

- A route choice survives save/load; no unchosen node disappears.
- New content does not reference Mario-specific hazards, currencies or UI.
- Kirby's first Area can be swapped into the same simulator and Field Manual.
- A World added to content data does not require a save-schema change.

## Phase 8 — repeatable production

After two Sagas prove the abstractions, production becomes a repeating gate:

1. approve a title-based World pitch;
2. audit sprite/animation availability;
3. freeze Areas, enemies, bosses, roster and Supply set;
4. validate all content data;
5. implement one Area at a time;
6. simulate four reference-team envelopes;
7. perform visual/window/performance QA;
8. release the World and archive its source manifest.

No World enters active production if its boss set, four-person free path or
animation plan is unresolved.

## Test matrix required for every release

| Layer | Automated | Manual |
| --- | --- | --- |
| Data | schema, references, stable IDs, asset existence | names, title fidelity |
| Combat | seeded outcomes, formulas, status stacking, no stalls | readability, charm, pacing |
| Balance | thousands of reference-team runs | strongest/weakest plausible builds |
| Save | migration fixtures, round trips, missing content | owner backup/restore |
| Gacha | distribution, pity, guarantee, conversion | ceremony, skip, expectation clarity |
| Desktop | window-state integration where possible | M2 Air click-through/full-screen/hide |
| Performance | long-run counters and memory sample | heat, battery, other-app annoyance |
| Accessibility | keyboard routes, reduced-motion state | legibility at chosen strip scale |

## Definition of “done” for claims to the owner

Do not say a phase works because it compiled. Report:

- the commit and files changed;
- the automated checks run and their results;
- the exact manual states visually inspected, with screenshots when possible;
- anything that could not be verified in the current environment, especially
  macOS window behavior, audio and long-running motion;
- the next owner-visible choice, if one is actually required.
