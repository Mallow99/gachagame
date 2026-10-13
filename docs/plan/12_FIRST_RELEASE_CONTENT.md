# First release content specification

This is the implementation-facing content plan for the first complete World
and the backlog immediately after it. Names, coefficients and stats are
**TRIAL**; identities, behavior jobs and stage lessons are the stable part.

## Super Mario Bros. encounter sheet

Every stage uses the World Threat `1–15`. Enemy HP/Attack grow with Threat;
wave composition below is authored. `E` means the enemy record's elite variant,
not an unrelated recolor.

| Stg | Rank | Waves | Authored sequence | First-clear reward | Test purpose |
| ---: | ---: | ---: | --- | --- | --- |
| 1 | 1 | 4 | `3 Goomba`; `2+late 1`; `4 spread`; `2 + Veteran Goomba E` | 60 Starlight, 40 Coins | approach, target reacquisition, stomp readability |
| 2 | 2 | 4 | `2 Goomba+1 Green Koopa`; `2 Koopas`; `Goomba line+Red Koopa`; `2 Koopas+2 Goombas` | 60, 45 | shells body-block and ricochet after defeat |
| 3 | 3 | 4 | `2 Goomba+1 Plant`; `2 Plants`; `Koopa+2 Plants`; `3 Plants+Goomba screen` | 60, 50, Super Mushroom, 1 Ticket | fixed targets open/close; ranged value |
| 4 | 4 | 5 | `3 Goomba`; `Koopa+Plant`; `Hammer Bro E`; `2 Koopas+Bro`; `2 Bros staggered` | 60, 55 | arcing telegraph and safe gaps |
| 5 | 6 | 5 | mixed approach; Plant cover; one Bro; paired Bros; paired boss phase | 160, 100, Area bonus | first boss, survivor enrage, ten-pull |
| 6 | 7 | 4 | Koopas; Buzzy Beetles; ceiling drop; mixed armored elite | 75, 75 | Guard and Projectile resistance |
| 7 | 8 | 4 | Cheep school; alternating schools; Koopa+Cheeps; giant Cheep E | 75, 75 | Aquatic movement and crossing targets |
| 8 | 9 | 5 | Cheeps; Blooper; two Bloopers; ink+school; Blooper E | 75, 75 | curved travel, reduced range/accuracy |
| 9 | 10 | 5 | Paratroopas; Spiny line; Lakitu flyby; mixed altitude; Lakitu E retreat | 75, 75 | airborne target priority and cloud stagger |
| 10 | 10 | 5 | armored road; Spiny rain; cloud escort; Lakitu Jr.; Lakitu boss | 200, 180, Area bonus | force landing window without hard ranged check |
| 11 | 11 | 4 | fast Goombas; night Koopas; Plants+Paratroopas; mixed E | 100, 110 | familiar rules with shorter tells |
| 12 | 12 | 5 | Bullet Bill lanes; Hammer Bro; alternating Bills; double Bro; artillery E | 100, 110 | projectile pressure and backline safety |
| 13 | 13 | 5 | Podoboo timing; Buzzy+fire bar; Koopa bridge; two safe bands; lava E | 100, 110 | hazard movement and Fire mitigation |
| 14 | 14 | 6 | Goomba/Koopa remix; Plants; Bros+Bills; Buzzy lava; elite mix; Impostor Bowser | 100, 110, elite chest | endurance and bridge stagger |
| 15 | 15 | 6 | castle guard; Bills; Bros; fire-bar hall; Bowser phase 1; phase 2/axe | 300, 250, World bonus | finale: fire, leap, hammer and vulnerability |

Area bonuses are the ledger values in `11_ECONOMY_AND_SIMULATION.md`: stage 5
adds 600 Starlight/150 Coins/4 Tickets; stage 10 adds 300/250/7; stage 15 adds
500/400/7 plus the Atlas Key and Archive transitions.

## Enemy behavior records

The numeric baseline is at Threat 1. Elite variants multiply HP by 1.8, Attack
by 1.2 and add the listed move; they do not simply change color.

| Enemy | Class / points | HP / ATK / Guard | Behavior and telegraph | Elite addition |
| --- | --- | --- | --- | --- |
| Goomba | Fodder / 15 | 420 / 42 / 5 | walks to nearest and headbutts every 2.3 s | `Veteran Hop`: short visible leap over the front target |
| Green Koopa | Tank / 45 | 820 / 45 / 45 | advances and shell-jabs; defeat leaves a kickable shell | shell returns once from edge |
| Red Koopa | Tank / 45 | 760 / 50 / 40 | guards a lane and turns at edges; shell hits nearest cluster | shell applies small knockback |
| Piranha Plant | Ranged / 30 | 540 / 62 / 10 | fixed in pipe; 1.0 s rise tell, bite/short fireball, retreats | two-shot fan after a missed bite |
| Hammer Bro | Elite / 75 | 1,300 / 75 / 30 | hops between two bands; falling hammer zones show 0.9 s early | three-zone fan plus interruptible ground-pound |
| Buzzy Beetle | Tank / 45 | 1,000 / 48 / 75 | slow shell body-block; 35% Projectile reduction | ceiling silhouette then farthest-target drop |
| Cheep-cheep | Skirmisher / 25 | 500 / 58 / 10 | swims/flys across lane in an arc and bites on crossing | turns for a second pass |
| Blooper | Specialist / 50 | 680 / 50 / 20 | pulses vertically, tentacle combo, 0.8 s ink cone tell | ink also Slows for 2 s |
| Paratroopa | Skirmisher / 25 | 600 / 55 / 18 | Airborne until staggered; dives backmost legal target | regains wings once at 40% HP |
| Spiny | Tank / 45 | 700 / 52 / 60 | advances slowly; contact damages Stomp attackers unless broken | rolls briefly after shell breaks |
| Lakitu | Specialist / 50 | 700 / 52 / 22 | stays at extreme range and drops telegraphed Spiny Eggs | cloud dive on stagger recovery |

`Bullet Bill`, `Podoboo` and fire bars begin as environment hazards with source,
target zone, telegraph and damage events. They become actors only if testing
proves targeting/destroying them is fun.

## Boss records

### Hammer Bros., stage 5

- two 2,900-HP partners at Threat 5, shared boss presentation but independent
  targeting;
- alternating high jump and three-zone hammer fan;
- landing during windup interrupts the fan and adds 25 stagger;
- when one falls, the survivor gains 25% Haste, ground-pound and 15% Attack;
- stagger lasts 5 seconds and prevents chain-stunning either partner;
- free-team counterplay: Peach/Toad sustain while Mario/Luigi chase landings;
- target: 4–5 minutes, 75–90% Rank-6 free-team success.

### Lakitu, stage 10

- armored cloud has 7,500 HP and 100 stagger at Threat 10;
- drops Spiny Eggs at marked locations, then crosses the strip with a cloud
  dive after every third drop;
- hits against the cloud build stagger; at 100, Lakitu falls for 7 seconds,
  loses Projectile reduction and takes +20% damage;
- 45% HP begins lightning-marked safe lanes and faster egg cycles;
- a fully melee free party can win through landing windows; ranged units only
  improve consistency;
- target: 4–6 minutes, 75–88% Rank-10 free-team success.

### Impostor Bowser, stage 14

- one 4,800-HP castle elite, intentionally shorter than a full boss;
- uses slow fire breath and heavy jump; filling bridge stagger opens the axe;
- axe defeat reveals the source enemy and drops the elite chest;
- no fighter release and no boss banner treatment.

### Bowser, stage 15

- phase 1: 9,000 HP, claw/charge, three-height fire breath and telegraphed leap;
- at 60%, bridge breaks into safe bands and Bowser adds hammer fans;
- phase 2 has 6,000 HP and a 35%-of-phase damage gate per ultimate window;
- attacks add 12–25 bridge stagger when interrupted or avoided correctly;
- at full stagger, the axe is exposed for a 7-second vulnerability; the second
  axe window can finish the fight;
- control durations convert 65% into stagger rather than doing nothing;
- target: 5–7 minutes, 75–85% Rank-15 free-team success and ≥92% at Rank 17.

Playable Bowser uses ordinary fighter stats, a smaller sprite/collision box and
no bridge phases. Sharing art/identity does not mean importing boss health.

## SMB1 fighter release records

| ID | Rarity | Availability | Job | Implementation order |
| --- | --- | --- | --- | ---: |
| `classic-mario` | R | prologue grant/pool | Stomp bruiser, stagger and team Haste | 1 |
| `classic-luigi` | R | prologue grant/pool | Charge controller, retreats/Slows, evasive movement | 1 |
| `toad` | R | prologue grant/pool | Combo striker with small emergency delivery heal | 1 |
| `princess-peach` | R | prologue grant/pool | Lob support, shields and party recovery | 1 |
| `koopa-troopa` | R | stage 2 seen; stage 5 pool | defensive Strike, taunt and ricochet | 2 |
| `hammer-bro` | SR | stage 5 defeat; SMB1 first-ten safeguard if needed | anti-Airborne Lob artillery | 2 |
| `blooper` | R | stage 8 seen; Area-2 focus | Combo controller and ink | 3 |
| `buzzy-beetle` | SR | stage 6 seen; Area-2 focus | Projectile-resistant Charge vanguard | 3 |
| `lakitu` | SR | stage 10 defeat; Area-2 focus | Airborne Lob artillery/summoner | 3 |
| `bowser` | SSR | advertised in World banner; focus improves after stage 15 | Charge vanguard, flame line and control conversion | 4 |

Bowser is the initial **SMB1 Spotlight's** only SSR so its published 3% SSR rate is honest.
Pulling the playable version before the finale is allowed; stage 15 unlocks his
50% SSR focus and Saga Archive entry rather than his basic existence. Other
bosses normally join after defeat unless their banner record declares this
signature-antagonist exception.

On the SMB1 Spotlight, the tutorial ten-pull guarantees the first copy of
Hammer Bro if it contains no new SR-or-better fighter. On the regional Archive,
the equivalent safeguard uses that banner's approved welcome-SR pool. This
replaces rerolling and ensures a non-story recruit; natural SSRs remain intact.

## SMB1 banner lifecycle

| Milestone | Fighter page | Supply page |
| --- | --- | --- |
| start | preview only; exact rates/pool visible | locked with stage-3 condition |
| stage 3 | unchanged | Mushroom granted; Overworld Supply preview |
| stage 5 | Overworld Spotlight opens; Mushroom Kingdom Archive accepts pulls only at its 22-fighter plan-`16` floor | Overworld Supply opens |
| stage 10 | adds Blooper, Buzzy Beetle and Lakitu focus | High Roads items added |
| stage 15 | Bowser becomes featured; completed SMB1 entries settle into the Archive | Castle items and Archive open |
| next World finale | progress Spotlight closes into Mario Archive | progress Supply closes into Archive |

No item leaves permanent availability. Pity belongs to Fighter/Supply channel,
not these presentation changes.

## Supply implementation order

| Item | First usable | Exact first-pass effect |
| --- | --- | --- |
| Super Mushroom R | stage 3 grant | +8% max HP; first heal received each stage +20% |
| Flagpole Rush R | stage 5 pool | +8% Move; clearing a wave grants party 5 energy |
| Toad Retainers R | stage 5 pool | first knockout instead heals 60% support-scale Attack, once/stage |
| Fire Flower SR | stage 5 pool | compatible basic gains Fire; every fourth basic fires 0.65 shot + Burn |
| Princess's Wish SR | stage 5 pool | every 40 s shield two lowest allies for 80% support-scale Attack |
| Underwater Breather SR | stage 7 | negates 60% Aquatic Move penalty; +10% Guard in water |
| Cloud Ride SR | stage 10 | compatible unit gains Airborne/+15 Move and loses 10 Guard |
| Castle Axe SR | stage 14 | +20% boss stagger dealt; no ordinary damage bonus |
| Bowser's Bridge SSR | stage 15 | first boss phase transition grants shield and 20 energy |
| Super Star UR | Mythic eligibility after stage 15 | 12 s invulnerable contact-damage state at full energy; uses Mythic slot |

## Art and animation minimum for the first slice

| Actor | Required states for stages 1–5 |
| --- | --- |
| Mario | idle, run, jump rise/fall, stomp impact, hit, knockout |
| Luigi | idle, run, high-jump/charge, retreat, hit, knockout |
| Toad | idle, run, three combo poses, delivery toss, hit, knockout |
| Peach | idle, float/walk, turnip lob, shield cast, hit, knockout |
| Goomba | walk, headbutt squash, hit, flatten/defeat |
| Koopa | walk, jab, shell idle, shell slide, hit, defeat |
| Piranha | hidden pipe, rise, bite, shot, hit, retreat |
| Hammer Bro | idle, jump, throw, ground-pound, hit, defeat |

If a polished sheet lacks a required state, prefer a small authored transition,
rotation/squash effect or honest provisional sprite over changing the unit's
combat job invisibly. Portrait art is not cut into a battle puppet unless its
source and visual quality support it.

## SMB1 optional Sorties and Wanted Hunts

These unlock after their source behavior has appeared. They reuse approved
actors/background kits with new compositions, so they add things to do without
padding the 15-stage Story or demanding another art batch.

| Unlock | Side stage | Primary reward | Authored twist |
| --- | --- | --- | --- |
| stage 3 | Coin Course: Pipe Run | Coins | fragile Goombas carry coins; Plants control safe collection windows |
| stage 5 | Fighter Practice: Jump School | deployed Fighter Mastery XP | distant targets reward movement/target reacquisition rather than raw damage |
| stage 5 | Supply Route: Toad's Delivery | 1–2 Supply Tickets during daily bonus | protect a moving chest/Toad marker through four waves |
| first Assist equipped | Assist Study: Royal Signal | equipped Assist Proficiency XP | survival waves create reliable intervention triggers |
| stage 5 | Starfall Route: Brick Rush | Starlight | defeat marked bonus targets before they retreat |
| stage 10 | Wanted: Lakitu's Spiny Storm | mixed Field Order reward | stagger Lakitu while capped Spiny waves pressure the party |
| stage 14 | Wanted: False Bowser | mixed reward and Manual entry | bridge stagger reveals a rotating encountered enemy beneath the disguise |

Veteran Goomba, Red Shell Patrol and Hammer Bro Pair are smaller Wanted files
that can appear in Field Orders before the two authored Hunt stages. Discovery
may happen through a rare final Camp wave, but afterward the Hunt is always
selectable directly.

Sortie repeat rewards use the common economy profile. Only the first three
featured clears receive the daily category bonus; no Sortie consumes stamina,
Atlas Keys or a separate entry ticket.

## Kirby's Adventure production backlog

Kirby follows SMB1 because it exercises new engine capabilities without adding
a new economy. Its 20 encounters are specified in `04_CONTENT_CATALOG.md`.

| Priority | Content | Engine proof |
| ---: | --- | --- |
| 1 | Kirby, Waddle Dee, Bronto Burt, Hot Head, Sir Kibble | persistent flight and copy-compatible Supply |
| 2 | Whispy Woods | fixed giant/background boss with targetable zones |
| 3 | Paint Roller, Wheelie, Rocky, Kracko | spawned hazards, fast lanes, vertical boss |
| 4 | Bonkers, Meta-Knights, Meta Knight | offered weapon rule and duel posture |
| 5 | Dedede, Nightmare Orb/Wizard | narrative miniboss plus two-form finale |

First release fighters: R Kirby/Parasol Waddle Dee/Poppy Bros. Jr.; SR Sir Kibble/Hot
Head/Wheelie/Sparky/Rocky/Bonkers; SSR Meta Knight/Dedede. Ability hats are
Supply. Star Rod Kirby is the single UR candidate and ships only if it has a
complete fighter sheet and kit.

That list is the *Kirby's Adventure* World/Spotlight cast, not the whole early
Dream Land Archive. Before its first real pull, the permanent Archive must
reach the 20-fighter floor in plan `16`, adding sprite-ready helpers,
rivals and Super Ability forms without inserting them into this title's stages.

## Tier-A production packets

These are enough to estimate work and maintain route coherence; full encounter
tables wait until their World enters production.

### Super Mario Bros. 3 — 25 stages

- Areas: Grass/Desert; Sea/Giant; Sky; Ice/Pipe; Dark Land.
- Free/accessible additions: R Toad-house/support candidates and source-valid
  enemy recruits; SR Boom Boom, Koopalings released in small batches, Kamek only
  if source treatment is justified; SSR Bowser iteration or signature finale.
- Supply: Super Leaf/Tanooki, Frog Suit, Hammer Suit, P-Wing, Music Box Page.
- Boss packet: Boom Boom → Angry Sun/remix → Giant guardian → Koopaling
  airship → Bowser. The airship mechanic belongs here, not in SMB1.
- Engineering: moving platform/airship background, large actors and more complex
  Power-Up compatibility.

### Mega Man 2 — 20 stages

- four Areas pair two Robot Masters each; fifth-like Wily material is folded
  into stages 16–20 without exceeding four five-stage Areas;
- R Mega Man and support bots if their movement is complete; SR Robot Masters
  with strong niches; SSR Proto/signature candidates only when source-valid;
- eight weapons are primarily Power-Ups, preventing eight shallow Mega Man
  fighter forms;
- finale: Wily machine phases and alien illusion;
- engineering: targetable projectiles, weakness hints without a universal
  triangle, destructible shots and boss-room transitions.

Detailed release packet: R Mega Man story grant and Sniper Joe; all eight Robot
Masters as SR specialists; SSR Wily; then R Roll and SSR Proto Man as honest
cross-title 20XX Archive additions. See `15_MEGA_MAN_CHARACTER_BIBLE.md`.

### Pac-Man — 5 stages

- stages teach pellets/lanes, Pinky/Inky/Clyde pressure, frightened windows and
  one complete Blinky-led finale;
- R Pac-Man fighter, Ghosts as distinct enemy behaviors/Assist candidates;
  SSR/UR is not required for this tiny World;
- Power Pellet is Supply and changes a timed contact state;
- engineering: lane-following movement and reversible predator/prey state;
- rewards scale to one Area: 4–7 Fighter pulls, 5–8 Supply pulls and one Atlas
  Rank, not a flagship payout.

## Content cut rules

Cut or park a planned item when any of these is true:

- it needs a new engine subsystem used by only one minor encounter;
- its only available battle art cannot show idle, move, attack, hit and defeat;
- it duplicates a family member without a complete distinct move set;
- it exists only to fill a rarity quota or make a World reach 25 stages;
- its specialist trait would become a mandatory pull check;
- its source/provenance cannot be recorded;
- implementing it delays the complete stages 1–5 loop.

The default response is to turn the idea into Supply, an Assist, a boss-only
actor or a later World—not to discard it permanently.
