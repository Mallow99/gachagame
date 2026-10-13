# Loadout, Copy and progression audit

Status: **definitive reconciliation v1, 2026-10-13**

This file audits the owner decisions in plan `17`, resolves their implementation
gaps and turns the equipment discussion into one buildable contract. It does not
reverse the owner's direction. Where plans `01`–`16` still describe four free
fighters, unrestricted crossover story parties, compatibility-limited Power-Ups
or a shared Mythic slot, this file and plan `17` replace those statements.

## 1. Locked answer to the equipment question

There are two separate equippable systems because they answer different fantasy
and team-building questions.

| Slot | Quantity | What it represents | Examples |
| --- | ---: | --- | --- |
| Fighter Power-Up | one on each fighter | a portable pickup that adds one trait and one statistical lean | Fire Flower, Super Leaf, Maxim Tomato, Metal Blade |
| Party Assist Page | one for the party | a supporting character who briefly intervenes | Professor E. Gadd, Elline, Rush |

They are not merged. A player can field four Power-Ups and one Assist. Power-Ups
never create an extra actor; an Assist never becomes permanent equipment on one
fighter.

The third apparent equipment category is not equipment:

- Kirby's ordinary **Copy** is a `kirby` family mechanic acquired from an
  encounter target;
- a **Super Ability** is the transformation ultimate of *Return to Dream Land*
  Kirby;
- a complete game-specific character form may be a fighter version when it
  passes the iteration test in `13` §3 and `16` §2.

This preserves Cat Mario, Tanooki Mario, Hypernova Kirby and other complete
actors without requiring a Fire Flower or Copy Ability inventory to carry an
entire alternate moveset.

## 2. Fighter, Power-Up, family mechanic or Assist

Use this decision order for every future idea:

1. **Can the idea sustain a different basic, skill, passive, ultimate, movement
   grammar and readable actor sheet?** If yes, it may be a fighter version.
2. **Is it a recurring pickup whose fantasy can be expressed with one trait,
   one stat lean and effects?** It is a Power-Up.
3. **Is it a signature rule shared by versions of one family?** It is a family
   mechanic implemented by the fighter kit, not an inventory item.
4. **Is it a character whose job is a brief intervention rather than a complete
   on-strip combat loop?** It is an Assist Page.
5. Otherwise it is an ultimate scene, cosmetic treatment, encounter mechanic or
   backlog idea.

### 2.1 Resolved examples

| Idea | Home | Why |
| --- | --- | --- |
| Fire Flower / Ice Flower | Power-Up | portable pickup; effect-only treatment |
| Super Leaf | Power-Up | grants `airborne` interaction plus Move lean; it does not grant the Tanooki kit |
| Tanooki Mario | fighter | tail combat, P-Meter flight and statue state form a complete actor |
| Super Bell | Power-Up | portable Feline trait and Crit lean |
| Cat Mario | fighter | claws, climb, pounce and Double Cherry form a complete actor |
| Giga Bell | Bowser's Fury Mario ultimate | temporary game-specific transformation |
| Copy Ability Star | encounter state | Kirby acquires it through Copy; it is not owned inventory |
| five Super Abilities | one UR Kirby ultimate table | dynamic versions of one transformation, not five duplicate fighters |
| Hypernova Kirby | SSR fighter | the held form changes the whole normal combat grammar |
| Star Rod | UR Power-Up | any Dream Land fighter may wield the collection item |
| Professor E. Gadd | Assist Page | scan/gadget intervention, no persistent fifth actor |

"One identity, one home" applies to collectible records, not to source-game
objects. Cat Mario and a Super Bell may both exist because the bell does not
turn another fighter into the Cat Mario record or borrow Cat Mario's kit. When
an equipped Power-Up grants a trait the fighter already has, the trait does not
stack; the item's stat lean still applies.

## 3. Power-Up contract

### 3.1 Mechanical limits

Every normal Power-Up supplies exactly:

- one `grantedTrait`, which stages and enemies may react to;
- one `statLean`, applied multiplicatively after Training and fighter rarity;
- at most one small proc that expresses the granted trait.

It does not replace a basic, skill, passive or ultimate. It never requires a
new fighter sheet. A matching palette, hat or weapon frame already present in
the source sheet is optional polish, never a release dependency.

Trial stat bands:

| Rarity | Stat lean | Proc budget |
| --- | ---: | --- |
| R | 6–8% | simple defensive or every-fourth-action effect |
| SR | 9–13% | one bounded status, projectile or movement effect |
| SSR | 14–18% | stronger identity proc with an internal cooldown |
| UR | 18–25% | normal trait/stat plus one once-per-stage Awakening |

Percentages are starting budgets, not promises that every stat is equally
valuable. Haste, Crit and mitigation require simulator-normalized values.

### 3.2 UR Awakening rule

UR Power-Ups do **not** steal or replace fighter ultimate energy. Their
Awakening triggers immediately after the wearer's first ultimate resolves and
is once per stage unless the record says once per run. This avoids a second
button and prevents the item from suppressing the fighter's signature moment.

- **Super Star:** after the first ultimate, 12 seconds of invulnerability,
  contact damage and +25% Move; no energy generation while invulnerable.
- **Star Rod:** after the first ultimate, 15 seconds of piercing star-bolt
  volleys followed by a comet strike; the finale Star Rod used inside the
  Nightmare boss remains an encounter loan and does not require ownership.

There is no Mythic loadout cap. Four UR fighters with four UR Power-Ups are
legal if owned. Late-balance fixtures must therefore include zero-, one- and
four-UR parties; family lock is not falsely treated as a cap on different UR
families.

### 3.3 Acquisition and duplicates

- Power-Ups belong to a Saga/Hub Supply pool.
- Story permits only the current Hub's Power-Ups on that Hub's fighters.
- Endless ignores the Hub restriction: Meta Knight with a Fire Flower is
  legal.
- Mega Man Special Weapons are first-defeat Robot Master drops, not Supply
  pulls. They still use the Power-Up slot.
- A Power-Up is complete at first acquisition and has no XP or star track.
- Duplicate Power-Ups convert directly to Echoes at the declared rarity rate.

The save keeps `powerupIds` because that field already describes the slot. Unit
records delete `powerupCompatibility`; validation uses story mode, Hub and slot
rules instead.

### 3.4 First catalog direction

| Hub | Power-Up | Rarity | Trait | Stat lean | Proc / Awakening |
| --- | --- | --- | --- | --- | --- |
| Mushroom | Super Mushroom | R | Enlarged | +8% max HP | ignores the first minor knockback each wave |
| Mushroom | Fire Flower | SR | Fire | +11% ranged damage | every fourth basic applies a light Burn |
| Mushroom | Ice Flower | SR | Ice | +10% Guard | every fourth basic applies 18% Slow for 2 s |
| Mushroom | Penguin Suit | SSR | Ice | +15% Move | slide through one ground hazard every 10 s |
| Mushroom | Super Leaf | SR | Airborne | +10% Move | movement may cross low hazards; no P-Meter or tail kit |
| Mushroom | Super Bell | SR | Feline | +8 Crit points | first backline contact every 9 s pounces for bonus stagger |
| Mushroom | Super Star | UR | Radiant | +25% Move | once-per-stage Awakening in §3.2 |
| Dream Land | Maxim Tomato | R | Nourished | +8% max HP | first wave-clear heal is 20% stronger |
| Dream Land | Invincibility Candy | SSR | Radiant | +15% Move | 4 s invulnerability after falling below 25% HP, once/stage |
| Dream Land | Friend Heart | SR | Friendly | +10% Haste | first Assist activation grants party shield |
| Dream Land | Star Rod | UR | Star | +20% ranged damage | once-per-stage Awakening in §3.2 |

These are mechanical records, not a requirement to draw every listed form on
every fighter.

## 4. Assist Page contract

The party equips one Assist Page. It appears only for its authored entrance,
effect and exit; it does not occupy a fighter position or family slot.

```js
{
  id: 'e-gadd-field-notes',
  sagaId: 'mario',
  familyId: 'e-gadd',
  rarity: 'SR',
  trigger: { type: 'boss-phase-start', cooldownSeconds: 30, usesPerStage: 2 },
  effects: [{ type: 'reveal-weakness', durationSeconds: 12 },
            { type: 'boss-stagger', amount: 20 }],
  proficiencyPolicyId: 'assist-five-rank-v1',
  artId: 'e-gadd-assist-card',
  animationId: 'e-gadd-scan-intervention'
}
```

Rules:

- proficiency has five ranks, but rank 1 contains the complete behavior;
- later ranks improve numbers, cooldown or one bounded quality-of-life detail;
- an Assist with a `familyId` cannot be equipped when that same family is in
  the active party;
- a supporting character chosen as an Assist is not also released as a fighter
  without an explicit owner-directed reclassification and save migration;
- story uses the current Hub's Assists; Endless permits any unlocked Assist.

Good Assist candidates are characters with a memorable intervention but an
unconvincing full combat loop: E. Gadd, Toadsworth, a Sprixie Princess, Elline,
Queen Ripple, Rush, Beat, Eddie, Dr. Light and Auto. Cappy, FLUDD and Elfilin
are not Assists while their identities already live in fighter kits/records.

## 5. Supply presentation

Power-Ups and Assists use the same renewable **Supply Ticket** currency and one
channel pity counter, but appear on two selectable pages:

1. `Power-Up Cache` — contains only Power-Ups;
2. `Assist Call` — contains only Assist Pages.

A result set never mixes the two categories. The player chooses what they are
building, while shared pity prevents a second optimization routine. Switching
pages does not reset pity. Each page displays its complete pool, duplicate
conversion, equipped ownership and next pity result.

An earning-enabled Supply page needs at least six live records with at least
three at R, two at SR and one at SSR. Until then it is a labeled, non-spendable
preview. UR items use their Hub's Mythic rotation and ordinary item slot; they
do not pad this six-record floor.

## 6. Kirby Copy contract

Copy is implemented once and referenced by every Copy-capable Kirby version.

1. An enemy declares `copyAbilityId` or `null`.
2. Each Kirby version declares `copyLibrary`, the profile IDs its sheet can
   visibly perform.
3. A legal Copy replaces Kirby's basic and skill, adds the ability trait and
   changes the visible hat/palette. Passive and ultimate remain that version's
   own unless the fighter record explicitly says otherwise.
4. A copied ability lasts until replaced, spent by a transformation ultimate,
   Kirby is knocked out or the stage ends.
5. Small targets may be swallowed below their authored threshold. Elites drop
   an Ability Star on break; bosses expose one at a phase/stagger gate.
6. Copy outside that version's library produces three boosted Star Shots and a
   40% skill-cooldown refund. It never silently equips an invisible ability.
7. Player policy is `recommended`, one named favorite, or `never-replace`.

The shared launch library remains Fire, Cutter, Spark, Ice, Sword, Hammer and
Beam. A new Copy-capable Kirby needs at least three complete visual profiles to
release; *Return to Dream Land* Kirby needs Sword, Fire, Beam, Hammer and Ice
because they route his ultimate.

### 6.1 Return to Dream Land Kirby

The five former Super Ability fighter cards are removed. There is one UR
*Return to Dream Land* Kirby whose first ultimate transforms for 14 seconds:

| Held Copy | Form | Combat promise |
| --- | --- | --- |
| Sword | Ultra Sword | enormous marked arcs and cleave |
| Fire | Monster Flame | dragon-shaped line passes and Burn |
| Beam | Flare Beam | guided energy sphere with multi-hit control |
| Hammer | Grand Hammer | charge levels ending in the largest focused stagger |
| Ice | Snow Bowl | rolling contact route ending in a frozen burst |
| none / other | Ultra Sword | deterministic fallback, so the UR always functions |

The cast spends the held Copy, opens with a 2.5 basic-action-equivalent hit,
uses a form-specific transformed basic/skill, ends with a 4.5–6.0 equivalent
finisher and targets **18–24 normal-action equivalents** over the full window.
The form gains +80% ATK, +35% Haste and strong control resistance, cannot gain
ultimate energy, and returns to neutral Kirby after the finale. Exact contacts
are tuned in the simulator; the value band is not reduced to three ordinary
actions.

Hypernova Kirby remains a separate SSR with an 8.5–11 equivalent burst
ultimate. Star Rod Kirby remains deleted because the Star Rod is now a Hub UR
Power-Up.

## 7. Pull-led progression without an infinite luck lock

The owner decision that pulls are progression remains locked. It does not mean
an exact unguaranteed identity may block the account forever.

### 7.1 New-Hub opening

- Entering a Hub for the first time grants exactly one starter: Classic Mario,
  *Kirby's Adventure* Kirby or *Mega Man 2* Mega Man.
- Stage 1 is tuned for that one fighter.
- Stage 1 grants 100 Starlight and unlocks the Hub Archive. The first Fighter
  result is guaranteed new and excludes the owned starter.
- Stages 2–4 expect two to four ordinary pulls. The first-clear Starlight
  schedule is 100 each.
- Stage 5 grants the remaining 600 Starlight. The first ten Fighter results in
  that Hub form one welcome sequence; if none is a new SR or better, result ten
  is replaced by a declared owned-safe welcome SR.

The player may save instead of pulling, but the UI explicitly labels the next
stage's expected roster size. A save-first challenge can be harder; it is not
the reference balance target.

### 7.2 Hard-check safety rule

A story encounter may demand pulled **strength, breadth or a mechanic**, but a
mandatory reaction must have at least one deterministic route before the wall:

- a first-clear Power-Up;
- a boss-dropped item;
- an owned-safe welcome/selector result;
- the Hub starter's kit; or
- two different ordinary-pool families that satisfy the same reaction.

An exact random fighter is never the sole legal answer. A banner selector that
guarantees one of several solutions within at most 20 regional Fighter pulls is
also valid. This keeps pulls important while bounding bad luck.

### 7.3 Renewable earning

Camp clears award one **Patrol Mark** in addition to Coins. Ten Marks convert
automatically into 100 Starlight, with no lifetime or daily cap. At the 3–4
minute replay target this produces roughly 1.5–2 Fighter pulls per active hour,
inside plan `11`'s existing target. Daily Field Orders and rotating Sorties are
bonuses, not the only renewable source.

Only a cleared Camp earns Marks. Failed Advance attempts return the player to a
chosen Camp and show the fastest available route to Training, Supply or Fighter
progress. This prevents both zero-income walls and loss-farming exploits.

## 8. Story lock and Endless unlock

The first cleared World finale in a Hub sets that Hub's `endlessUnlocked` flag.
This resolves plan `17`'s open interpretation.

- Story parties contain only fighters whose `sagaId` matches the World.
- Story equipment follows the same Hub rule.
- Once `endlessUnlocked` is true, that Hub's owned fighters and items may enter
  Endless with content from any other unlocked Hub.
- Clearing later Worlds does not relock or separately unlock individual
  fighter versions.
- Party presets store their mode; an invalid cross-Hub Story preset is shown
  but cannot launch until repaired.

## 9. Opening Archive recount and pull audit

Mushroom remains **22 normal fighters: 10 R / 7 SR / 5 SSR**, with Classic
Mario as the only free starter.

Dream Land is corrected to **22 normal fighters: 8 R / 9 SR / 5 SSR**, not the
contradictory `20` and `8 / 7 / 5` written beside the revised rarity list in
plan `17`.

### 9.1 Exact Dream Land opening shelf

| R (8) | SR (9) | SSR (5) |
| --- | --- | --- |
| Adventure Kirby; Dream Land Kirby; Waddle Dee; Poppy Bros. Jr.; Knuckle Joe; Blade Knight; Chilly; Bio Spark | Parasol Waddle Dee; Adventure Meta Knight; Sir Kibble; Hot Head; Wheelie; Sparky; Rocky; Bonkers; Gooey | Bandana Waddle Dee; King Dedede; Daroach; Magolor; Super Star Ultra Meta Knight |

The former Ultra Sword SSR slot is gone. The stronger Meta Knight source is
*Kirby Super Star Ultra*, where the playable Meta Knightmare treatment exists.

A 100,000-run audit at 80% R / 17% SR / 3% SSR, a conditional SR floor every
tenth result, equal within-rarity weights, one owned starter, the guaranteed-new
first result and the owned-safe welcome rule produced:

| Pool | Mean unique after 20 | Median | 10th–90th percentile | Median share |
| --- | ---: | ---: | ---: | ---: |
| Mushroom 10/7/5 | 11.73 | 12 | 10–13 | 54.5% |
| Dream Land 8/9/5 | 10.75 | 11 | 9–12 | 50.0% |

Both remain safely below the 75% collection ceiling. Changing focus weights or
welcome replacement rules requires rerunning the checked-in simulator.

## 10. Roster scope audit

Plan `17` is a candidate museum, not one release batch. A name in its Part II
does not enter a live banner until its complete kit, sprite/model, card art,
provenance and balance fixture pass the release gate.

Production order remains:

1. exact 22-fighter Mushroom opening Archive;
2. exact 22-fighter Dream Land opening Archive;
3. Mushroom and Dream Land growth shelves before regional pull 40;
4. 20XX opening Archive;
5. later versions grouped with their source World's production when practical.

The following plan `17` entries need source/provenance review before kit work:
Captain Waddle Doo's exact game role, the playable treatment for *Kirby Super
Star* Meta Knight (use *Super Star Ultra* unless stronger evidence exists), and
any NPC/boss interpretation whose moves are mostly invented. `CANDIDATE` means
research is still permitted to reject it.

## 11. Required implementation changes

Before PG-003 begins, the content foundation must:

- add `powerups.js` and `assists.js` to the content index;
- validate Supply pool entry kind and referenced namespace;
- delete `powerupCompatibility` from production units;
- encode `copyLibrary` only on Copy-capable Kirby versions;
- encode one starter acquisition per Hub;
- make the first Fighter page unlock after stage 1, not stage 5;
- replace four-free-party reference fixtures with one-starter and expected-pull
  fixtures;
- represent `declaredTotalCoefficient` on ultimates so the validator can enforce
  rarity floors;
- reject malformed v3 save objects instead of accepting any parsed object;
- add `endlessUnlockedBySaga` in SaveV4, not in the temporary v3 schema.

PG-003's migration must keep old prototype characters under
`collection.legacyUnits`; this audit does not silently rewrite live v3 saves.
