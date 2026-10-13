# Pocket Gacha definitive plan

Status: **planning baseline v5, 2026-10-13**

Scope: the game to build over the next several weeks, not a promise to produce
the entire crossover catalog immediately.

This directory is the source of truth for new work. `ROADMAP.md` remains the
short task queue, `HANDOFF.md` remains the project history, and
`docs/WORLD_TOUR_PLAN.md` remains the earlier design exploration. If they
disagree with this directory, this directory wins.

## Read order

1. [`01_IMPLEMENTATION.md`](01_IMPLEMENTATION.md) — what gets coded, in
   dependency order, and how each milestone is accepted.
2. [`02_SYSTEMS_AND_BALANCE.md`](02_SYSTEMS_AND_BALANCE.md) — exact trial
   combat, progression, rarity, gacha, economy and difficulty rules.
3. [`03_PLAYER_PATH.md`](03_PLAYER_PATH.md) — what a player sees from minute
   one through 190+ active hours.
4. [`04_CONTENT_CATALOG.md`](04_CONTENT_CATALOG.md) — the 15-stage opener,
   title-based Worlds, release rosters, enemies, bosses and long-range Saga map.
5. [`05_ASSET_PIPELINE.md`](05_ASSET_PIPELINE.md) — sprite suitability,
   manifests, provenance and production budgets.
6. [`06_RESEARCH_AND_AUDIT.md`](06_RESEARCH_AND_AUDIT.md) — research sources,
   rejected alternatives, contradictions, risks and change tests.
7. [`07_TODAY_BUILD_TICKETS.md`](07_TODAY_BUILD_TICKETS.md) — the exact next
   coding tickets, dependencies, cut line and acceptance tests.
8. [`08_DATA_AND_SAVE_CONTRACTS.md`](08_DATA_AND_SAVE_CONTRACTS.md) — stable
   content records, SaveV4, migration rules, event logs and validation.
9. [`09_UI_FLOW_AND_WIREFRAMES.md`](09_UI_FLOW_AND_WIREFRAMES.md) — strip,
   paper-Manual management, summon and failure-state flows.
10. [`10_ATLAS_AND_WORLD_MATRIX.md`](10_ATLAS_AND_WORLD_MATRIX.md) — exact
    choice tiers, title branches, World lengths, Threat and production waves.
11. [`11_ECONOMY_AND_SIMULATION.md`](11_ECONOMY_AND_SIMULATION.md) — first-World
    ledger, pulls, Training, active time, reference teams and simulator cases.
12. [`12_FIRST_RELEASE_CONTENT.md`](12_FIRST_RELEASE_CONTENT.md) — all 15 SMB1
    encounters, enemy/boss behavior, release pools and immediate World packets.
13. [`13_HUBS_BANNERS_AND_PRESENTATION.md`](13_HUBS_BANNERS_AND_PRESENTATION.md)
    — the Hub/World hybrid, regional Archives, finished summons, cards and
    behavior-first sprite rules.
14. [`14_MARIO_KIRBY_CHARACTER_BIBLE.md`](14_MARIO_KIRBY_CHARACTER_BIBLE.md)
    — exact opening Mario/Kirby kits, signature motion, enemy states and
    acceptance scenarios.
15. [`15_MEGA_MAN_CHARACTER_BIBLE.md`](15_MEGA_MAN_CHARACTER_BIBLE.md) — the
    deferred Mega Man 2 roster, Special Weapons and 20XX Archive additions.
16. [`16_MARIO_KIRBY_ARCHIVE_EXPANSION.md`](16_MARIO_KIRBY_ARCHIVE_EXPANSION.md)
    — the current roster priority: 34 additional Mario/Kirby cards, opening
    Archive floors, form rules and model-derived actor policy.

## The one-sentence game

Pocket Gacha is an unobtrusive transparent desktop strip where four collected
game characters physically roam and auto-fight in real time, feeding a
paper-manual-like management window with progression, banners and a branching
atlas of video-game Worlds.

## Decision language

Every important rule is labeled so later agents do not mistake a test number
for an eternal commitment.

- **LOCKED:** a product direction that should not change without the owner's
  explicit decision.
- **TRIAL:** the first implementation value. Put it in data, instrument it and
  tune it after play rather than debating it indefinitely.
- **DEFERRED:** intentionally absent from the current milestone.
- **CANDIDATE:** researched content that has not passed its asset and kit gate.

## Locked product pillars

1. **The strip is the game.** Combat is visible movement, jumping, charging,
   projectiles, hits and boss behavior on the desktop—not a menu RPG whose
   results happen to be shown at the bottom.
2. **The strip stays out of the way.** Its background is transparent, empty
   areas pass clicks through, it has instant hide/show controls, and full-screen
   applications are respected. The management window is opened deliberately.
3. **No turn order.** Every fighter and enemy acts when its own gauge is ready.
   The seven attack types are visible behaviors—strike, shot, combo, charge,
   stomp, lob and beam—not a rock-paper-scissors type triangle.
4. **Saga means franchise; World normally means one game.** Each World is
   anchored to one specific title, such as *Super Mario Bros.*, *Kirby's
   Adventure* or *Mega Man 2*. Five-stage Areas are recognizable
   locations or chapters from that title. This makes the historical march from
   old sprites to newer visual styles legible.
5. **Length serves the source material.** Twenty-five stages is the flagship
   size, not a quota. A small title becomes a 5-, 10-, 15- or 20-stage World
   rather than being padded. A very large game may get more than one World.
6. **The player chooses routes.** The production order is linear; the Atlas is
   not. Finales grant Atlas Keys, and two to four eligible Worlds are presented
   at a time. Unchosen Worlds remain available.
7. **New pulls are immediately usable.** Account-wide Training Rank replaces
   individual character levels. A new character inherits current training;
   individual investment is stars, mastery and kit choices. A hundred-character
   collection must encourage swapping rather than demand a hundred leveling
   grinds.
8. **Rarity is allowed to matter.** R is an introduction and can be replaced;
   SR is a specialist; SSR is a conspicuous general upgrade; UR is an
   exceptional anchor. Balance does not pretend base R Mario must equal a peak
   Mario forever.
9. **One family member per party.** Separate iterations of Mario, Link, Sonic
   or another identity can be pulled, but only one from that family can fight
   at once. The player chooses a version instead of fielding four Marios.
10. **Forms are not all fighters.** A complete era or moveset can be a fighter;
    an ordinary Fire Flower, Ice Flower or Super Star is normally a Power-Up.
    This prevents variant spam and impossible sprite workloads.
11. **Support collectibles do not tax character savings.** Power-Ups and one
    party-wide Assist Page use Supply Tickets, not fighter currency. Fighters
    never share their banner with memories or equipment.
12. **UR has a real opportunity cost.** One Mythic slot is shared by an UR
    fighter, UR Power-Up or future UR Assist Page. This stays a trial through
    the first UR playtest but is the implementation baseline.
13. **No normal story pull check.** Traits and specialist kits may make an
    encounter easier, but every story stage is clearable by an expected free
    or ordinary-pull roster. Pulling strength buys speed and consistency, not
    permission to continue.
14. **Banners archive instead of vanishing.** Area spotlights are initially
    progress-based. Their contents move into permanent Saga and Supply Archives.
    The personal desktop game does not punish the owner for closing it.
15. **Build one excellent slice before manufacturing a Library.** Systems and
    Mushroom Overworld stages 1–5 come before mass character acquisition.
16. **Pulls stay renewable.** Story gives the largest bursts, but Camp waves
    and repeatable Patrol Reports continue funding roughly 1.5–2.5 Fighter
    pulls per active hour after available Story is exhausted. There is no daily
    hard cap on the core collection loop.
17. **Daily generosity is played, not claimed.** Stackable Field Order folders
    offer five account-legal missions and require any three. Optional Coin,
    Fighter Practice, Assist Study, Supply, Starfall and Wanted-Hunt Sorties let
    the player choose useful rewards without stamina or exact-pull checks.
18. **Worlds preserve games; Hubs preserve possibility.** Story campaigns,
    enemies and backgrounds belong to a specific source game. A franchise Hub
    and its permanent Archive may offer any production-ready iteration from
    that Saga, so favorites do not have to wait for their eventual campaign.
19. **Animation is mechanics.** Stomps bounce, Goombas flatten, Koopas become
    kickable shells, Peach floats, Yoshi grabs and Kirby inhales/copies. A
    generic attack with themed particles is not a finished character.
20. **An ultimate must swing the fight.** R/SR/SSR/UR ultimates target at least
    4/5.5/7/10 ordinary basic-action equivalents before crowd value. First
    copies meet that floor; Technique Mastery and duplicates only improve an
    already complete move.
21. **Early Archives need collection runway.** Their first real pull waits for
    at least 22 production-ready Mushroom fighters or 20 Dream Land fighters.
    A median account cannot already own over 75% after twenty pulls, and pool
    growth reaches 28/26 before regional pull 40.

## First playable promise

The first production slice is **Super Mario Bros. — Overworld, stages 1–5**.
It proves:

- independent action gauges and all required movement primitives;
- a 4–6-wave stage that takes minutes rather than seconds;
- Goomba, Koopa Troopa, Piranha Plant and Hammer Bro behaviors;
- a Hammer Bros. boss encounter with readable telegraphs;
- one real four-person party, family locking and inherited Training Rank;
- one Fighter Spotlight and one Supply Spotlight in the management window;
- transparent, hideable, click-through desktop behavior;
- the Field Manual showing the exact math the build is using.

The old Walter White, Tung Tung Sahur and generic test units remain dev fixtures
until real replacements keep the build playable. They do not appear in the
player-facing roster.

## Content model

```text
Library
└── Shelf (filter only)
    └── Saga / Hub (stable franchise record; player-facing destination)
        ├── permanent Saga Archive (released fighters across its games)
        └── World (normally one specific game/era)
            └── Area (five stages and a boss)
                └── Encounter (authored waves, rules and rewards)
```

Examples:

```text
Mario Saga > Super Mario Bros. > Dark World > Stage 14
Mario Saga > Luigi's Mansion > Hidden Mansion > Stage 13
Kirby Saga > Kirby's Adventure > Yogurt Yard > Stage 13
Mega Man Saga > Mega Man 2 > Wily Fortress > Stage 19
```

An anthology such as Arcade Hall may treat each cabinet as a short World. A
game with radically different acts may use multiple Worlds. These are declared
exceptions, not reasons to return to arbitrary mixed-franchise campaigns.

## Change isolation

The plan is deliberately cheap to reroute.

| If this changes | Edit here | What should remain untouched |
| --- | --- | --- |
| Pull rates or pity | `02_SYSTEMS_AND_BALANCE.md`, banner data | Combat, stage content, art manifests |
| A unit's rarity or kit | unit data and its release table in `04` | World graph and engine |
| A World is added, removed or shortened | World data and `04` | Global stage numbers, other Worlds |
| Route availability | Atlas graph in `03` | Production order and encounter files |
| Stat curve | balance config and simulator cases in `02` | Unit identity and animation files |
| Asset source fails | asset manifest and substitute in `05` | Unit ID, kit, save ownership |
| One system misses the milestone | phase scope in `01` | Parked later phases |

Stable IDs, data-driven definitions and migrations are mandatory. Never key
saves to array positions, global stage numbers or asset filenames.

## Current freeze

Until the first five stages pass their acceptance tests:

- no second Saga is implemented;
- no obtainable UR is implemented;
- no real-time banner expiration is implemented;
- no elemental weakness triangle is implemented;
- no prestige/reset loop is implemented;
- no guild, PvP, social or paid-store system is designed;
- no mass sprite scrape is run;
- no roster beyond the slice is promised as production-ready.

The remaining catalog is a researched queue. Its purpose is to stop good ideas
from being lost and to reveal dependencies—not to pull work into the present.
