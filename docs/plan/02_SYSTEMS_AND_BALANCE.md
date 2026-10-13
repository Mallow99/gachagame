# Systems and balance specification

All numbers marked **TRIAL** are the first values to implement and simulate.
They are deliberately centralized so tuning does not alter content data. The
relationships are more important than any one number.

## 1. Combat model

### 1.1 Real-time readiness

**LOCKED:** there are no turns and no initiative queue. Each actor owns a state
machine and an action gauge. When recovery finishes, that actor chooses and
performs its next legal action.

```text
acquire → approach/aim → windup → resolve → recovery → acquire
```

Control, displacement or a phase transition may interrupt states only when the
action explicitly allows it. The UI can therefore say exactly why someone is
waiting: `moving`, `aiming`, `0.4 s windup`, `stunned` or `1.2 s recovery`.

`Move Speed` controls pixels/second. `Haste` controls action time:

```text
actual interval = base interval / (1 + Haste)
```

**TRIAL:** Haste is capped at +100% and Slow at -50%. A +25% Haste effect makes
a 2.0-second interval 1.6 seconds; it does not create an opaque speed stat.

Every fighter has one always-legal basic action, one automatic skill and one
energy ultimate. **TRIAL:** ordinary skill cooldowns are 8–14 seconds, begin a
fight half charged, and pause while the owner is knocked out. When a skill and
basic are both ready, the unit evaluates the skill's declared use condition
first; if it is not useful (for example, no ally needs healing), it performs a
basic without consuming the skill. This avoids fixed “every third turn” logic
while keeping exact readiness visible.

### 1.2 Roles are not attack types

Roles describe stat/AI expectations; attack patterns describe what is animated.
A unit can be a Support with a shot or a Vanguard with a charge.

| Role | HP | Attack | Guard | Move | Haste | Purpose |
| --- | ---: | ---: | ---: | ---: | ---: | --- |
| Vanguard | 1,250 | 78 | 65 | 110 | 0% | holds front, taunts or protects |
| Bruiser | 1,050 | 96 | 42 | 118 | 0% | durable close damage |
| Striker | 820 | 122 | 24 | 130 | 5% | fast single-target damage |
| Artillery | 760 | 115 | 20 | 105 | 0% | long range and area damage |
| Controller | 850 | 92 | 28 | 112 | 2% | disruption and setup |
| Support | 900 | 80 | 34 | 115 | 4% | healing, shields and buffs |

These are **TRIAL** level-1 R baselines before a unit's authored kit offsets.
Individual units may move roughly ±15% across stats while preserving their
total rarity budget.

### 1.3 The seven attack patterns

The patterns are deliberately near one another in single-target throughput.
Their value comes from range, movement, crowd coverage and kit effects.

| Pattern | Base interval | Coefficient | Range/shape | Distinct cost or advantage |
| --- | ---: | ---: | --- | --- |
| Strike | 1.80 s | 1.00 | one target, 58 px | must close distance |
| Shot | 1.65 s | 0.92 | one target, 420 px | projectile travel/can be blocked |
| Combo | 2.25 s | 0.42 × 3 | one target, 64 px | later hits can lose target |
| Charge | 2.50 s | 1.40 | 300 px line | repositions into danger |
| Stomp | 2.35 s | 1.20 + 0.35 splash | jump to 300 px | air time and landing tell |
| Lob | 2.40 s | 0.90 + 0.55 splash | ground circle, 390 px | can miss a moving cluster |
| Beam | 2.70 s | 0.72/0.54/0.40 | first three in line | 1.05 against a lone boss |

**TRIAL:** coefficients are before the unit's authored move multiplier. Combo
sub-hits resolve separately. Beam falloff prevents it from also being the best
boss pattern. Stomp and charge movement are part of their animation state, not
instant teleports.

### 1.4 Stats and formulas

Account Training Rank `L` grows HP and Attack for every owned fighter:

```text
Growth(L) = 1.045 ^ (L - 1)

HP = round(base HP × Growth(L) × rarity multiplier × star multiplier × modifiers)
Attack = round(base Attack × Growth(L) × rarity multiplier × star multiplier × modifiers)

mitigation = Guard / (100 + Guard)
raw damage = Attack × action coefficient × outgoing modifiers
damage = max(1, round(raw damage × 100 / (100 + target Guard) × variance))
```

**TRIAL:** variance is 0.95–1.05, not the current 0.90–1.10. Critical hits
multiply final pre-rounded damage by 1.50. Guard is a rating and does not scale
with Training Rank; this keeps its percentage readable rather than approaching
100% as account numbers grow. Guard is capped at 180 (64.3% mitigation) before
temporary blocking effects.

Growth reference:

| Training Rank | Growth | Training Rank | Growth |
| ---: | ---: | ---: | ---: |
| 1 | 1.000× | 30 | 3.584× |
| 10 | 1.486× | 50 | 8.644× |
| 20 | 2.308× | 75 | 25.978× |
| 25 | 2.876× | 100 | 78.075× |

Large displayed values use stable abbreviations, but the Field Manual exposes
the underlying number. Growth applies to enemy HP/Attack through Threat Rank as
well, so time-to-kill stays controlled.

### 1.5 Rarity and stars

Rarity should be felt before the ultimate animation plays.

| Rarity | HP/Attack multiplier | Kit-budget guide | Intended relationship |
| --- | ---: | ---: | --- |
| R | 1.00× | 100 | complete introductory kit, eventually replaceable |
| SR | 1.15× | 118 | specialist can beat SSR in its favorable job |
| SSR | 1.38× | 145 | generally superior signature version or boss |
| UR | 1.68× | 180 | exceptional anchor; multi-UR parties are legal |

The kit budget is a review index, not a runtime multiplier. Range, healing,
control, survivability, targeting and uptime all spend it. It prevents an SSR
from receiving both 38% higher stats and five unpriced advantages.

First copy unlocks the complete kit. Duplicates add stars but never hold the
core passive or ultimate hostage.

| Stars after duplicates | HP/Attack multiplier | Additional reward |
| ---: | ---: | --- |
| 0 | 1.00× | complete base kit |
| 1 | 1.04× | minor star-quality node |
| 2 | 1.08× | skill quality improvement |
| 3 | 1.13× | passive quality improvement |
| 4 | 1.18× | ultimate quality improvement |
| 5 | 1.25× | cosmetic frame/title and final node |

Quality improvements change a bounded duration, radius or reliability; they do
not replace the ability. Stars are per fighter iteration, not shared across the
family. Family collection milestones may award profile cosmetics and Echoes,
not another hidden combat multiplier.

### 1.6 Energy and ultimates

**TRIAL:** ultimate meter is 100.

- resolving a basic action: 8 energy;
- resolving a skill: its data-defined 10–14 energy;
- taking damage: up to 6 energy per hit, proportional to max-HP loss;
- securing a kill: 3 energy;
- a unit cannot gain energy during its own transformation unless stated.

### 1.6.1 Ultimate value floor

**LOCKED:** an ultimate is not a normal action with a larger animation. Review
its complete single-target value against that fighter's ordinary basic cycle:

```text
basic-action equivalents = ultimate combat value / one complete basic cycle
```

Damage, healing, shields, control, party buffs and transformation uptime all
count, using conservative conversion values recorded by the simulator. Area
damage is evaluated against one target first; hitting a crowd cannot conceal a
weak boss result.

| Rarity | Trial minimum at Mastery 1 | Typical direct-damage coefficient | Purpose |
| --- | ---: | ---: | --- |
| R | 4.0–5.5 basic actions | 4.5–6.0× ATK | satisfying complete starter |
| SR | 5.5–7.0 basic actions | 6.0–8.0× ATK | specialist's defining payoff |
| SSR | 7.0–9.0 basic actions | 8.0–11.0× ATK | battle-swinging signature moment |
| UR | 10+ actions or 18–26 over a form | 12–18× burst equivalent | temporary team anchor that feels unfair |

These are value bands, not a demand that every support deal damage. A Peach
ultimate can meet the R band through healing, shielding, cleanse and Haste. A
Vanguard may trade damage for taunt, protection and stagger. The calculation
must be written down rather than excused by spectacle.

- An ultimate's cast/animation time is included as lost basic-action time.
- Multi-hit ultimates state their total coefficient, not only the per-hit value.
- Transformations state entry damage, stat changes, replacement actions, end
  damage and duration. A form with only a 10% basic increase fails automatically.
- SSR/UR presentation does not buy mechanical budget; the kit must also pass.
- Boss phase floors still preserve mechanics, but never reduce the numbers or
  feedback shown to the player. Excess becomes capped phase damage/stagger.

Ordinary ultimates should first occur about 22–40 seconds into a sustained
fight and recur less often after wave downtime. Fast-energy specialists may
beat that range only when their ultimate budget pays for the frequency. AI use
conditions are explicit: boss present, allies below a threshold, at least N
targets, or immediate.
Management settings allow `Auto`, `Hold for boss` and eventually manual trigger;
the strip never requires twitch input.

Transformations target 12–18 seconds. Boss phase gates limit any single damage
event or transformation window to 35% of boss maximum HP unless the encounter
explicitly supports a one-shot. UR should crush ordinary waves without erasing
all authored boss behavior.

### 1.7 Conditions and traits

There is no global elemental triangle. Traits are nouns used by individual
kits and encounters:

```text
Armored, Airborne, Aquatic, Ghost, Mechanical, Giant,
Fire, Ice, Electric, Explosive, Magic, Projectile, Summoned
```

Example: an SR with `+40% damage to Airborne` can outperform a general SSR in
a sky Area. Story may expect that mechanic, but a mandatory reaction must have
a bounded deterministic item, selector or alternative-family route under plan
`18` §7.2; one exact unguaranteed SR is never the only answer.

First supported conditions:

| Condition | Trial behavior |
| --- | --- |
| Burn | 12% of applier Attack per second for 5 s; refreshes, no stack |
| Slow | -25% Haste and -20% Move Speed for 4 s |
| Stun | state interruption for 1.25 s; bosses gain resistance after each use |
| Guard Break | -25 Guard for 5 s, floor 0 |
| Mark | next three allied hits receive the authored bonus |
| Shield | separate temporary HP; does not change Guard |
| Knockback | spatial displacement; bosses convert it to brief stagger buildup |

Freeze, poison, revive, charm and elaborate reaction systems are **DEFERRED**
until these can be read clearly in a short strip.

## 2. Encounter and difficulty model

### 2.1 World threat snapshot

**LOCKED:** enemies do not scale to the exact current party.

- Atlas Rank starts at 0 and rises by one for each five-stage Area first-cleared.
- `Atlas floor = 1 + 5 × Atlas Rank`.
- When a set of Atlas choices is revealed, each new World snapshots its starting
  Story Threat from that floor, clamped to the World's supported band.
- Every choice revealed together receives the same snapshot. Entering every
  node early cannot manipulate difficulty.
- `stage Threat = snapshotted start + story stage - 1` unless an encounter
  explicitly offsets it.
- A World never moves the goalposts during its first story clear.
- Old Story remains easy. Mastery creates a separate current-rank version.

The opening 15 stages use Threat 1–15. Clearing their three Areas sets Atlas
Rank 3 and reveals Tier A at Threat 16. A 10-stage World adds two Atlas Ranks;
a 25-stage World adds five. A short side story may set `rankReward` or
`keyReward` to zero only when explicitly labeled as non-advancing bonus content.

### 2.2 Authored encounter budget

Threat Rank scales HP/Attack. Composition comes from an authored point budget,
so later stages add interesting enemies rather than only multiplying health.

| Enemy archetype | Trial points | Job |
| --- | ---: | --- |
| Fodder | 15 | simple body, dies quickly |
| Skirmisher | 25 | mobile melee or dive |
| Ranged | 30 | backline pressure/projectiles |
| Tank | 45 | body-blocking or Guard |
| Specialist | 50 | control, heal, summon or hazard |
| Elite | 75 | combined behavior, visible entrance |
| Area boss | 300–500 | phases and adds outside ordinary budget |
| World boss | 600–900 | multi-phase finale |

A **TRIAL** neutral Threat-1 stat library gives encounter authors a starting
point. Per-enemy data can move ±20% while retaining its archetype budget.

| Archetype | HP | Attack | Guard | Basic interval |
| --- | ---: | ---: | ---: | ---: |
| Fodder | 560 | 42 | 5 | 2.30 s |
| Skirmisher | 650 | 58 | 12 | 1.90 s |
| Ranged | 520 | 62 | 8 | 2.20 s |
| Tank | 1,100 | 45 | 60 | 2.50 s |
| Specialist | 700 | 50 | 20 | 2.40 s |
| Elite | 1,400 | 75 | 35 | 2.10 s |

Enemy HP and Attack multiply by `Growth(Threat Rank)`; Guard, interval and
spatial behavior do not. Area/boss records then apply authored multipliers and
phase health. This table is a simulator seed, not permission to make every
Goomba and Waddle Dee statistically identical.

A normal stage has 4–6 waves. **TRIAL** wave budgets begin around 75, 90, 105
and 120 points and grow through composition plus modest Area multipliers.
Spawns are capped by screen readability; surplus budget upgrades an actor to an
elite rather than filling the strip with tiny bodies.

### 2.3 Time targets

| Encounter | Minimum target | Typical target | Maximum before review |
| --- | ---: | ---: | ---: |
| early normal stage | 90 s | 120–165 s | 210 s |
| later normal stage | 120 s | 165–210 s | 270 s |
| Area boss stage | 180 s | 240–300 s | 360 s |
| World finale | 240 s | 300–420 s | 480 s |

These include wave movement and short celebration, not management time. A
strong account may beat minimums, but bosses retain phase floors. A failed
attempt should usually reveal its outcome within 60–120 seconds rather than
wasting eight minutes.

`Advance` moves to the next story stage. `Camp` repeats a cleared stage. On an
Advance loss, the game returns to the selected Camp and presents the battle
report; it does not spam the unwinnable encounter forever.

### 2.4 Reference teams and success envelopes

Every encounter stores four versioned team fixtures at its recommended rank.
Run at least 2,000 seeded simulations after a balance change.

| Team | Construction | Normal-stage target | Boss target |
| --- | --- | --- | --- |
| Pull minimum | one Hub starter plus expected ordinary R/SR pulls, 0–1 stars, earned Supply | ≥90% clear | 75–90% clear |
| Typical | ordinary R/SR + one SSR-equivalent value | ≥97% | 90–98% |
| Premium | SSR-heavy, no required featured unit | ~100%, faster | ≥98% |
| UR check | one UR anchor, otherwise typical | fast | shows every mandatory phase |

A boss below 75% free-team success is reviewed for numerical or mechanic
failure. A boss above 98% when the free team is five Training Ranks below
recommendation is probably too weak. Randomness should vary texture and time,
not turn an adequate auto-battle team into a coin flip.

### 2.5 Boss construction

Every Area boss needs:

- a 3–5 second establishing entrance;
- at least two clearly named actions with pre-hit telegraphs;
- a counterplay vector expressible through composition or Power-Ups;
- one change at 60–40% HP (new move, arena rule, adds or vulnerability);
- bounded control resistance instead of total immunity;
- a phase floor if an overpowered team would skip its identity;
- a post-fight unlock/reward that explains why the fight mattered.

Inflating HP is the last adjustment, not the first design step.

## 3. Roster progression

### 3.1 Account-wide Training Rank

**LOCKED:** owned fighters do not have separate levels. Every fighter uses the
account's Training Rank immediately.

This is the largest departure from the prototype and is necessary for a game
that may contain hundreds of pullable iterations. It removes three failures:
new pulls being unusable, route-specific specialists being too expensive to
try, and the owner leveling the same Mario family repeatedly.

**TRIAL** Coin cost to raise Rank `L` to `L+1`:

```text
cost(L) = round_to_5(80 × 1.085 ^ (L - 1))
```

Reference cumulative spend (including the listed purchase):

| Purchase at rank | Cost | Cumulative from rank 1 |
| ---: | ---: | ---: |
| 1 | 80 | 80 |
| 10 | 165 | 1,180 |
| 25 | 565 | 6,275 |
| 50 | 4,355 | 54,640 |
| 75 | 33,490 | 426,490 |
| 100 | 257,415 | 3,284,855 |

The economy targets roughly one Training Rank per new story stage early, then
uses Camp repeats and World rewards to close gaps. There is no hard level cap in
the first implementation; severe overleveling is controlled by Coin supply.
If it becomes a problem, use a visible soft surcharge above the highest
unlocked Threat, not a hidden ceiling.

### 3.2 Individual investment

Fighters retain identity through:

- 0–5 duplicate stars;
- a five-rank Technique Mastery track earned by fielding the unit or applying
  universal Technique Notes;
- one Hub-scoped Power-Up, with cross-Hub combinations allowed in Endless;
- party composition and one Assist Page;
- optional cosmetic frames/titles.

Every first copy starts at Technique Mastery 1 with its complete, newly buffed
kit. Technique progression makes a favorite better; it never makes an unusable
fighter become functional.

| Mastery | Upgrade |
| ---: | --- |
| 1 | full base kit and full-strength ultimate |
| 2 | basic coefficient/healing +8% |
| 3 | skill coefficient/healing/shield +12%; cooldown -5% |
| 4 | authored passive quality node; no new trigger requirement |
| 5 | ultimate potency +25%, or transformation duration +2 s, plus its signature cosmetic stamp |

**TRIAL:** full Technique Mastery takes 4–8 active hours through normal fielding
or about 2–4 focused hours using Fighter Practice rewards. Its average sustained
combat increase targets 8–12%; the larger ultimate number is intermittent.
Mastery can be completed in any valid World and cannot recreate individual
character levels by another name.

**Technique Notes** are a universal inventory material, not a fifth top-bar
currency. Fighter Practice, bosses, Field Orders and the Echo shop award them;
one Note grants Mastery XP to any owned fighter. There are no Mario Notes,
rarity-colored dusts or character-specific promotion items. Duplicate stars
remain separate and never substitute for Technique Mastery.

### 3.3 Family lock

One fighter per `familyId` in a party. `mario-classic`, `mario-paper` and
`mario-galaxy` may be separate fighter IDs but all use `familyId: mario`.

Power-Ups do not change family. Duo units declare every occupied family and are
**DEFERRED**, because their lock, art and animation costs are not free.

## 4. Gacha and collection economy

### 4.1 Currency ceiling

The launch economy has four visible currencies:

1. **Coins** — account Training Rank and basic upgrades.
2. **Starlight** — Fighter and Mythic pulls; 100 per pull.
3. **Supply Tickets** — one Supply pull each; cannot be spent on fighters.
4. **Echoes** — duplicate/archive shop value.

Upgrade ingredients may be reward items only when a concrete sink ships. Do
not add colored dusts, elemental stones or Saga coins as speculative clutter.

### 4.2 Fighter banner

**TRIAL:**

| Rule | Value |
| --- | ---: |
| R | 80% |
| SR | 17% |
| SSR | 3% |
| SR-or-better guarantee | every 10 pulls |
| SSR soft pity | after 50 pulls without SSR |
| soft-pity increase | +3 percentage points each pull |
| hard pity | pull 70 |
| rate-up share on SSR | 50% |
| featured guarantee | next SSR after a non-featured SSR |

The current curve has an expected 27.4 pulls per SSR; 50% of accounts hit by
pull 23, 80% by 52, 90% by 56 and 95% by 59. The sharp soft-pity curve is
generous by design for a personal game. Pity and the featured guarantee carry
across Fighter Spotlights.

The first ten-pull is earned by stage 5. If it contains no new SR-or-better
fighter, the selected banner's beginner pool replaces one R result: Hammer Bro
on the SMB1 Spotlight, or a production-ready welcome SR (initially Hammer Bro
or Yoshi) in the Mushroom Kingdom Archive. Natural SSR rolls are never removed.
This deterministic floor is cleaner than making the owner restart a local save.

**LOCKED:** a finished regional Archive does not accept its first pull below
its breadth floor: Mushroom Kingdom 22 normal fighters (10 R / 7 SR / 5 SSR),
Dream Land 22 (8 / 9 / 5). A smaller pool may exist only in a labeled engine
preview using non-spendable test pulls or the source-specific Spotlight. The
twenty-pull simulation must keep median ownership at or below 75% of the live
normal pool.

Before regional pull 40, Mushroom expands to at least 28 normal fighters and
Dream Land to at least 26. This second checkpoint keeps renewable currency from
turning the Archive into mostly duplicates immediately after the opening test.

### 4.3 Supply banner

**TRIAL:**

| Rule | Value |
| --- | ---: |
| R | 75% |
| SR | 20% |
| SSR | 5% |
| SR-or-better guarantee | every 10 pulls |
| soft pity | after 30 pulls, +5 points/pull |
| hard pity | pull 45 |
| expected SSR | 16.7 pulls |

Supply uses two selectable pages: a Power-Up Cache containing only Power-Ups
and an Assist Call containing only Assist Pages. They share Supply Tickets and
channel pity, but a result set never mixes categories. Each Area should award
5–8 Tickets during first clear and 1–3 through repeat goals. Permanent Archives
are always available after their six-record release gates pass.

### 4.4 Mythic banner

Mythic unlocks after the first World finale but has no candidate until one has
been earned through the relevant boss/achievement condition.

**TRIAL:** UR 0.8%, SSR 3.2%, SR 16%, R 80%; soft pity after 55 at +3.5 points
per pull; hard pity 80. Expected UR is 48.6 pulls; median 59 and 95th percentile
66 because the steep soft-pity ramp dominates. A non-featured UR makes the next
UR featured. Mythic pity is persistent and separate from Fighter pity.

Mythic uses Starlight so choosing to chase an UR is a conscious fighter choice,
not a fifth currency routine. World finales and achievements may grant free
pulls directly to the Mythic counter. A selectable unlocked UR is awarded by a
major Atlas milestone no later than the 120-active-hour target; luck is not the
only path to the defining rarity.

There is no Mythic loadout slot or point cap. Family lock prevents multiple
versions of one identity, not different UR identities. Zero-, one- and four-UR
fixtures are mandatory once enough UR content exists, including UR Power-Ups;
the simulator—not a hidden restriction—must expose unhealthy stacking.

### 4.5 Duplicates and Echoes

Every duplicate below five stars raises the owned unit by one star and grants:

| Rarity | Echoes with star | Echoes after max |
| --- | ---: | ---: |
| R | 2 | 10 |
| SR | 8 | 40 |
| SSR | 30 | 150 |
| UR | 120 | 600 |

**TRIAL** shop sinks are Supply Tickets, mastery acceleration, rotating R/SR
selectors and slowly accumulated SSR selector fragments. The shop does not sell
random combat stats. Prices are set only after simulated pull volume exists.

### 4.6 Spotlight lifecycle

- A permanent Saga Archive lists every released, production-ready fighter in
  that franchise, regardless of whether its source World has been built.
- A World banner appears when its World is unlocked.
- Area focus entries appear when the Area is reached.
- A defeated boss normally joins its focus only after the first victory. A
  declared signature-antagonist exception may exist in the base pool earlier;
  SMB1 Bowser uses this so the opening banner has an honest SSR pool.
- The current Spotlight remains until the next World finale, not a real-world
  clock. A clear warning shows the progress trigger.
- When it ends, every entry moves to the Saga Archive at standard odds.
- Reruns improve focus odds/selector access; they do not rescue otherwise
  unobtainable content.

Stage 1 unlocks the first Hub Fighter pages and guarantees that the first result
is new, excluding the owned starter. Stages 1–4 grant 100 Starlight each and
stage 5 grants 600, funding ten total results. If the first ten contain no new
SR or better, result ten is replaced from that page's owned-safe welcome pool.
The player may spend those results singly or together; the welcome counter and
channel pity are shared and never depend on the chosen page.

Real-time limited banners are **DEFERRED**. They add anxiety without improving
the private desktop loop.

## 5. Reward and time economy

### 5.1 Targets before exact drop tables

Reward formulas must be fitted to these experience targets:

| Period | Fighter pulls | Supply pulls | Training |
| --- | ---: | ---: | --- |
| tutorial through stage 5 | 10 total | 3–5 | rank 5–7 |
| ordinary five-stage Area after the tutorial | 4–8 | 5–8 | about +5 ranks |
| 15-stage compact World first clear | 30 total including tutorial | 15–22 | about rank 15–18 |
| 25-stage flagship first clear | 20–30 after tutorial | 25–40 | about +25 ranks |
| repeat farming, active | 1.5–2.5/hour | 0.8–1.5/hour | useful Coin progress |
| daily Field Order folder | 4 | 2–3 | one meaningful Coin bundle plus direct XP |

The first-clear pace is intentionally generous; a content game should let the
owner interact with banners. Repeat income is slower so new Worlds remain the
best reward source.

### 5.2 Stage rewards

Each encounter has separate components:

- enemy/wave Coins, repeatable;
- Camp completion chest, repeatable with diminishing duplicate-stage value;
- first-clear Coins and Starlight;
- boss/Area mission Starlight and Supply Tickets;
- rare chest roll, bounded per active hour;
- World-finale Atlas Key, banner unlocks and major rewards.

Do not hide all Starlight behind unattended minutes. Progress, bosses and goals
should visibly fund pulls.

**LOCKED:** Fighter pulls remain renewable after all shipped Story is cleared.
Each cleared Camp awards one Patrol Mark; ten Marks convert automatically into
100 Starlight. At the 3–4-minute replay target this yields roughly 1.5–2 pulls
per active hour with no daily hard cap. Failed Advance attempts award no Marks
and return to a selected cleared Camp. Mastery may add alternate Orders; it
never replaces or disables this basic route.

Daily Field Orders and optional Sorties provide a more directed layer above
that baseline. A player completes any three of five legal Orders for four pulls
plus Coins/Supply, while Coin, Fighter Practice, Assist Study, Supply, Starfall
and Wanted-Hunt Sorties let them choose the progression resource they need.
This is earned generosity, not a second flat login grant.

### 5.3 Away earnings

**TRIAL:** 12-hour cap, calculated from the selected cleared Camp stage.

- 60% of active Camp Coin rate;
- 25% of repeat chest expectation, converted to a deterministic bundle;
- no story advancement, boss first clear, Atlas Key or live rare boss;
- Supply/Starlight can appear in the deterministic chest bundle at their normal
  bounded rate;
- closing the application never advances a banner-expiration clock.

The return panel shows elapsed time, capped time, simulated clears and each
reward source. A player should understand the number without trusting magic.

## 6. Power-Ups and Assist Pages

### 6.1 Power-Ups

One per fighter. A normal Power-Up supplies exactly one `grantedTrait`, one
`statLean` and at most one bounded proc expressing the trait. It never replaces
a fighter basic, skill, passive or ultimate and never requires a new sprite.
Matching palette/hat frames already present in a source sheet are optional
polish.

Power-Ups are scoped to their Hub in Story and universal in Endless. Unit
records have no `powerupCompatibility`. Re-granting a trait already on the
fighter does not stack it; the stat lean still applies.

**TRIAL rarity budgets:** R 6–8%, SR 9–13%, SSR 14–18%, UR 18–25% plus one
once-per-stage Awakening. A UR Awakening begins after the wearer's first
ultimate resolves and does not spend or replace fighter energy. Power-Ups have
no XP/star track; duplicates become Echoes. See plan `18` §3 for the exact
contract and first catalogs.

### 6.2 Assist Pages

One per party. Each has:

- a small always-on passive; and
- one charged or conditional intervention with a visible cooldown.

An Assist should change a plan—first emergency heal, anti-projectile screen,
coin/chest bias, summon or boss stagger—not merely add another invisible +3%.
Minor NPCs and baby companions with poor combat sheets belong here.

Assist records declare a `familyId`; the Assist cannot equip while that family
is in the active party. Story permits the current Hub's Assists and Endless
permits any unlocked Assist. A character does not occupy both Fighter and
Assist collections without an explicit reclassification/migration.

Equipped Assists earn five short Proficiency ranks through normal combat or
Assist Study Sorties. The complete behavior exists at rank 1; later ranks add at
most 5% total effect/reliability and mostly unlock Manual stamps, art or lore.
Proficiency is applied XP, not a fifth inventory currency.

## 7. Failure, farming and Mastery

### Story failure

The battle report ranks likely causes using actual telemetry:

- front line collapsed before first ultimate;
- insufficient ranged access to backline;
- too much projectile damage taken;
- fight timed out from low damage;
- boss mechanic triggered N times;
- party below recommended Training Rank.

It then links to party, Training, Field Manual or Camp. It never says only
“Power too low.”

### Mastery

Completed Worlds gain optional Mastery rather than automatic stages 26–100.
Mastery snapshots current Atlas floor and adds authored rule combinations.
Rewards emphasize Echoes, Supply Tickets, cosmetics and selector progress;
first-clear story Starlight is not infinitely recreated.

**DEFERRED:** prestige/reset. New Worlds, Mastery and collection already provide
long-term movement. Prestige is reconsidered only if playtests show a real
endgame dead end.

## 8. Balance telemetry and tuning rules

Store aggregate local counters, not personal analytics:

- clear/lose and clear time by encounter;
- damage/healing/tanking by fighter;
- action counts, target downtime and ultimate timing;
- Training Rank delta from recommendation;
- party rarities and stars;
- pulls to rarity and currency earned/spent;
- time in Advance, Camp, management and hidden states.

When tuning:

1. fix a broken mechanic or AI rule before stats;
2. adjust encounter composition before multiplying every enemy;
3. adjust one axis at a time;
4. rerun all reference fixtures, not only the failing team;
5. keep migration/save values stable where possible;
6. record the reason beside the config change.
