# Dream Land production packet

## Current implementation checkpoint — 2026-10-14

- [x] 20 Adventure courses implemented with reference-fight/progression evidence.
- [x] Current v1 subset: **18 fighter records**, plus eight Power-Ups and
  eight Assists for this Hub; live Source Spotlights/Supply are implemented.
- [ ] This packet's **full 22-fighter opening Archive** and growth gates.
- [ ] Final sprite/signature/pull-art quality acceptance for the complete packet.
- [ ] Owner-approved summon presentation and native M2/human playtest.

The regional Archive correctly remains a non-spendable preview. Read
[plan 26](26_V1_STATUS_AND_CURRENT_QUEUE.md) for current status; the packet below
is the complete longer-term target, not a shipped-roster claim.


Status: **opening roster spec-ready after three-card correction; production packet v1, 2026-10-14**

Dream Land is the second implementation Saga because it proves flight, inhale,
Copy, fast Charge movement and large background bosses. This packet closes the
three complete-card holes in the exact opening Archive, supplies real Power-Up
and Assist depth and gives the 91-card museum enough source-game Story.

Plans `14`, `16` and `18` remain authoritative for existing numerical cards,
Copy and progression. This packet owns the corrected opening manifest and the
three missing cards below.

## 1. The audit correction

Plan `18` correctly names an opening Archive of 22 fighters, but only nineteen
of those had complete numerical cards. These three were roster rows, not
implementation-ready designs:

- *Kirby's Dream Land* Kirby;
- Waddle Dee;
- *Kirby Super Star Ultra* Meta Knight.

The cards in §2 resolve that gap. Dream Land now has an exact **8 R / 9 SR / 5
SSR** opening set on paper. Asset and runtime gates still decide when its banner
can accept currency.

## 2. Missing complete cards

### Kirby's Dream Land Kirby — Hungry Hero · R

**Source:** *Kirby's Dream Land* (Game Boy treatment). **Family:** `kirby`.
**Role:** Controller / Shot, either. **Stats:** HP 1,050; ATK 100; Guard 38;
Move 122; Haste 1%; Crit 7%.

- **Basic — Puff Star:** hops or floats to range and spits a 1.05× Star Shot.
- **Skill — Inhale and Spit, 9 s:** pulls one eligible Small target below its
  execute threshold, swallows it and fires a 1.90× piercing star through the
  priority target. An elite or boss instead takes four 0.35× suction ticks and
  sheds a 0.70× fallback star; a projectile can be swallowed and returned for
  1.50×. This version never copies an ability.
- **Passive — Six Puffs:** may remain Airborne for 3 s while routing over a low
  hazard. Landing grants 8 Guard for 3 s; repeated hovering does not refresh it.
- **Ultimate — Spicy Curry:** the pickup sends eight visible 0.55× fire-breath
  ticks through the line, then Kirby spits a 1.10× star. Focused total:
  **5.50×**. Mint Leaf is a cosmetic/source-accurate alternate presentation,
  not a second mechanical ultimate.
- **Reveal/feel:** monochrome silhouette gains Game Boy green before colorless
  stars scatter; quote “Poyo!” Mouth, suction cone, swallowed object and star
  origin share one anchor. A generic vacuum circle fails.

### Waddle Dee — Persistent Walker · R

**Source:** *Kirby's Adventure*. **Family:** `waddle-dee`. **Role:** Vanguard /
Charge, front. **Stats:** HP 1,090; ATK 91; Guard 48; Move 116; Haste 1%;
Crit 6%.

- **Basic — Headlong Bump:** walks into a short 1.05× body check and recoils one
  step rather than sliding through the target.
- **Skill — Tumble Rush, 9 s:** trips into a 1.80× rolling Charge. Small enemies
  are pushed to the next legal band; elites and bosses take 18 stagger instead.
- **Passive — Keep Walking:** the first forced displacement each wave becomes a
  tumble recovery and grants 12 Guard for 4 s instead of interrupting the next
  action.
- **Ultimate — Waddle Dee Parade:** ten Waddle Dees cross the strip for 0.50×
  each, alternating entry sides. Focused total: **5.00×** with bounded Small
  displacement.
- **Reveal/feel:** one pair of feet walks across the empty card before the body
  appears; quote “Wanya.” The charm is deliberate persistence—walk, trip,
  recover—not a featureless oval firing particles.

### Super Star Ultra Meta Knight — Halberd Commander · SSR

**Source:** *Kirby Super Star Ultra*. **Family:** `meta-knight`. **Role:**
Striker / Combo, front/either. **Stats:** HP 1,284; ATK 168; Guard 40;
Move 148; Haste 7%; Crit 16%.

- **Basic — Galaxia Rush:** three 0.42× sword contacts advance through the
  target, then cape-reposition to a legal flank. Total **1.26×**.
- **Skill — Mach Tornado, 10 s:** five 0.50× visible spins travel down the line
  and end at the nearest safe anchor. Heavy targets stop travel but not the
  remaining contacts.
- **Passive — Knightmare Tempo:** completing every basic contact reduces the
  skill cooldown 1 s and grants 5 energy. Missing, blocking or interruption
  grants neither.
- **Ultimate — Halberd Command:** the Main Cannon lands eight 0.80× shots, then
  Meta Knight crosses the priority target with a 3.20× Galaxia Darkness slash.
  Focused total: **9.60×** (**7.62 basic-action equivalents**).
- **Reveal/feel:** the Halberd crosses behind the card before cape and mask
  emerge; quote “Come.” Cannon markers precede impacts; teleport entry/exit and
  sword contacts remain readable. Adventure Meta Knight is the defensive SR;
  this is the visibly faster, more complete attacker.

## 3. Exact 22-fighter opening Archive

Kirby is the sole free starter. The remaining 21 are pulls.

| Fighter | Rarity | Signature system / quality check | Complete card |
| --- | --- | --- | --- |
| Adventure Kirby | R | inhale plus seven-profile Copy; hat and moves swap immediately | `14` §8 |
| Dream Land Kirby | R | inhale/spit only; Game Boy treatment and no accidental Copy | this file §2 |
| Waddle Dee | R | persistent walker, physical tumble and parade | this file §2 |
| Poppy Bros. Jr. | R | bomb Lob with bounce/fuse actor | `14` §8 |
| Knuckle Joe | R | planted four-hit punches and Rising Break | `16` §6 |
| Blade Knight | R | frontal guard into answer slash | `16` §6 |
| Chilly | R | breath ticks, ice shield and thaw | `16` §6 |
| Bio Spark | R | told vanish locations and anchored crossing slash | `16` §6 |
| Parasol Waddle Dee | SR | held parasol guard, glide and splash | `14` §8 |
| Adventure Meta Knight | SR | guarded duel/counter; mask-break boss language | `14` §8 |
| Sir Kibble | SR | outbound and catchable returning cutter | `14` §8 |
| Hot Head | SR | continuous mouth flame and overheat recovery | `14` §8 |
| Wheelie | SR | accelerated Charge, collision turn and skid | `14` §8 |
| Sparky | SR | stored radial charge and discharge | `14` §8 |
| Rocky | SR | bounded Stone substate and impact shadow | `14` §8 |
| Bonkers | SR | weighted hammer recoil and charge tell | `14` §8 |
| Gooey | SR | tongue tether and legal allied-skill echo | `16` §6 |
| Bandana Waddle Dee | SSR | spear contacts, thrown weapon and copter route | `16` §6 |
| King Dedede | SSR | hammer, inhale fallback, pounce and exhausted recovery | `14` §8 |
| Daroach | SSR | marked teleport, bomb and Squeak projectile raid | `16` §6 |
| Magolor | SSR | persistent portals and curved magic actors | `16` §6 |
| Super Star Ultra Meta Knight | SSR | offensive Galaxia chain and Halberd cannon | this file §2 |

## 4. Copy production boundary

Adventure Kirby launches with Fire, Cutter, Spark, Ice, Sword, Hammer and Beam.
Each profile needs:

- a visible hat/palette state;
- a distinct copied basic and skill;
- acquisition from at least one declared enemy;
- dropped-star and boss-stagger acquisition fixtures;
- an out-of-library fallback;
- save-independent encounter cleanup.

Copy profiles are not pulls and do not enter Supply. Dream Land Kirby cannot
Copy. Return to Dream Land Kirby consumes a held profile to choose a Super
Ability ultimate. Hypernova Kirby does not use ordinary Copy while Hypernova is
active. These boundaries prevent one family system from silently becoming
three item systems.

## 5. Opening Supply pages

### 5.1 Opening Power-Up Cache

| Power-Up | Rarity | Trait / lean | Proc | Source direction |
| --- | --- | --- | --- | --- |
| Maxim Tomato | R | Nourished; +8% max HP | first wave-clear heal is 20% stronger | opening grant/pool |
| Energy Drink | R | Refreshed; +7% healing received | below 40% HP, next basic grants 4 energy, once/wave | opening pool |
| 1-Up | R | Persistent; +6% Guard | first revive/heal-after-KO effect gains a 50% ATK shield; does not itself revive | opening pool |
| Friend Heart | SR | Friendly; +10% Haste | first Assist activation grants a party shield | *Star Allies* preview |
| Energy Sphere | SR | Dimensional; +10% skill damage | every third skill hit returns 3 energy, 8 s cooldown | *Return to Dream Land* preview |
| Sun Stone | SR | Radiant; +11% ranged damage | first hit on a newly entered enemy adds 10 stagger | *Triple Deluxe* preview |
| Invincibility Candy | SSR | Radiant; +15% Move | 4 s invulnerability below 25% HP, once/stage | opening rare slot |
| Rare Stone | SSR | Forged; +16% skill damage | first skill after an ultimate gains 25% area, once/wave | *Forgotten Land* preview |

Star Rod is the separate UR Mythic item. It never pads the normal page.

### 5.2 Opening Assist Call

| Assist | Rarity | Trigger | Intervention | Visual requirement |
| --- | --- | --- | --- | --- |
| Tokkori | R | first Airborne enemy enters | gust forces it to a lower legal band and applies 15% Slow | flies through and visibly argues/squawks at target |
| Kabu | R | first ally is cornered | warps that ally to the safest party anchor and grants 8 Guard | face opens as a doorway; ally exits the paired Kabu |
| Wise Waddle Dee | R | 20 s pass without a boss stagger | exposes the boss's next safe window and grants 12 stagger | telescope line points at a real zone |
| Mr. Star | R | first wave begins below 50 party energy | drops five small stars worth 2 energy each | stars travel to actors; no silent meter grant |
| Elline | SR | two allies fall below 50% HP | paints a 100% Assist ATK shield across the party | brush stroke physically connects the shields |
| Queen Ripple | SR | party receives a second condition | cleanses one condition and adds Crystal trait for 8 s | crystal fairies enter, cleanse, depart |
| Whispy Woods | SSR | first large add wave | roots Small enemies for 2 s, drops three healing apples and deals 2.0× | background trunk grows in; apples are pickup actors |
| Kracko | SSR | boss becomes staggered | storm deals six 0.60× lightning contacts and extends stagger 1 s | cloud occupies upper band; bolts use telegraphed ground marks |

### 5.3 Full Dream Land shelves

| Shelf | R | SR | SSR | UR |
| --- | --- | --- | --- | --- |
| Power-Ups | Maxim Tomato; Energy Drink; 1-Up; Food Box | Friend Heart; Rainbow Drop; Heart Star; Crystal Shard; Magic Yarn; Energy Sphere; Sun Stone; Code Cube; Blueprint | Invincibility Candy; Rare Stone; Dragoon Part; Dimensional Mirror Shard | Star Rod |
| Assists | Tokkori; Kabu; Wise Waddle Dee; Mr. Star; Sailor Waddle Dee | Elline; Queen Ripple; Fairy Queen; Lor Starcutter; Paint Roller | Whispy Woods; Kracko; Dyna Blade; Landia; Galactic Nova | — |

The full shelves are 18 Power-Ups and 15 Assists. Later items receive exact
effects only with their home World. Sailor/Wise Waddle Dee Assist records use
their own support identities and lock against active `waddle-dee` family actors.
None is quietly duplicated as a fighter.

## 6. Story depth that supports 91 museum cards

The full spine is **290 stages**, or 3.19 planned Story stages per museum card.
Only *Kirby's Adventure* enters production after the Mushroom slice.

| Source World | Stages | Roster / mechanical home |
| --- | ---: | --- |
| Kirby's Dream Land | 10 | Dream Land Kirby, Dedede origin, inhale fundamentals |
| Kirby's Adventure | 20 | Adventure Kirby/Meta, Nightmare, core Copy enemies |
| Kirby's Dream Land 2 | 15 | animal friends, Dark Matter Swordsman, Rainbow Sword |
| Kirby Super Star Ultra | 25 | Helpers, Dedede/Meta upgrades, Marx, Halberd knights |
| Kirby's Dream Land 3 | 15 | Gooey, animal friends, Adeleine direction |
| Kirby 64: The Crystal Shards | 20 | Ribbon/Adeleine, possessed Dedede, Crystal systems |
| Kirby & the Amazing Mirror | 15 | Mirror Kirby, Dark Meta Knight and mirror routing |
| Kirby: Squeak Squad | 15 | Daroach, Spinni, Storo, Doc and treasure waves |
| Kirby's Epic Yarn | 15 | Yarn Kirby, Prince Fluff and yarn transformations |
| Kirby's Return to Dream Land Deluxe | 25 | Bandana Dee, Magolor, Super Abilities and Landia |
| Kirby: Triple Deluxe | 20 | Hypernova, Taranza, Sectonia and Dreamstalk |
| Kirby: Planet Robobot | 20 | Robobot Kirby, Susie, Haltmann and machine modes |
| Kirby Star Allies | 20 | Friend Heart, Mage-Sisters, Hyness and ally systems |
| Kirby and the Forgotten Land | 25 | evolved abilities, Beast Pack, Elfilin and Mouthful |
| Kirby Mass Attack | 10 | swarm Kirby and group-path hazards |
| Kirby Air Ride | 10 | Air Ride Kirby, machines and Dragoon event |
| Team Kirby Clash | 10 | four class treatment and compact boss ladder |

## 7. Kirby's Adventure production freeze

When Dream Land production begins, freeze this first:

- stage actors: Adventure Kirby, Waddle Dee, Poppy Bros. Jr., Sir Kibble and
  Hot Head;
- Copy profiles: Fire and Cutter first, then Spark, Ice, Sword, Hammer, Beam;
- enemies: Waddle Dee, Bronto Burt, Hot Head, Sir Kibble, Sparky, Rocky;
- boss: Whispy Woods with background scale, target zone and apple actors;
- Power-Up: Maxim Tomato;
- Assist: Whispy Woods stays preview-only until his boss actor passes; use
  Tokkori as the first deterministic Assist fixture.

The remaining opening Archive is produced in shared-primitive batches: Charge
and Stone, guard/weapon fighters, tether/control fighters, then portal/large
boss-grade actors.

## 8. Acceptance before Dream Land is called finished

- all 22 opening cards validate at 8/9/5 and only Kirby is free;
- Adventure Kirby passes projectile, fodder, elite and boss inhale fixtures;
- Dream Land Kirby cannot acquire Copy under any event path;
- all seven launch profiles visibly change hat, basic and skill;
- Wheelie turns without leaving the strip; Rocky exits Stone; Meta Knight
  counters and teleports have hit/no-hit fallbacks;
- Waddle Dee's simple motion still reads as authored character behavior;
- Whispy, Kracko, Dedede and Nightmare have boss telegraphs, stagger windows,
  phase/recovery and defeat transitions;
- opening Power-Up and Assist pages contain only usable, described records;
- Star Rod, Copy and Super Abilities remain three separate systems in data,
  UI copy and combat logs.
