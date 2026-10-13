# Mario and Kirby character bible

Status: **core kit and behavior baseline v2, 2026-10-13**

This is the first roster bible, not a promise to build every entry at once.
It answers what each planned fighter actually does, what animation sells that
identity and which releases belong near the front of the game. Numerical values
are **TRIAL** and must be simulated; identity behaviors are the stronger
commitment.

## 1. Reading the cards

- Listed HP and Attack are displayed Training Rank 1, zero-star values after
  the rarity multiplier. Guard, Move, Haste and Crit use their authored values.
- Ultimate coefficients below are Technique Mastery 1 values. Mastery 5 adds
  25% ultimate potency or two seconds to a transformation, never both by
  default. A first copy must already feel complete.
- Cooldowns begin half charged under the common combat rules.
- `Small` means a non-boss enemy whose record permits grab/swallow. Elites and
  bosses always use the stated fallback; no kit silently deletes them.
- Damage resolves on named animation markers. A unit that cannot visually
  perform its signature remains a candidate, not a released fighter.
- Source game identifies the main iteration/art treatment. Kit references may
  honestly name another canonical appearance where needed.

## 2. Release waves

| Wave | Fighters | Purpose |
| --- | --- | --- |
| SMB1 slice — engine gate | Classic Mario, Classic Luigi, Toad, Peach, Koopa Troopa, Hammer Bro, Bowser | complete stages 1–5 and prove the first real banner |
| Mushroom opening Archive | this packet's Yoshi/Mario 64 plus the opening-floor additions in plan `16` | reach 22 production-ready normal fighters before the first Archive pull |
| Mushroom breadth shelf | Wario, Waluigi, Paper Mario, Sunshine Mario, Rosalina, King Boo plus plan `16` additions | deepen the first playable region before producing another franchise roster |
| Mushroom Mythic | Fury Bowser | high-production UR after multi-UR fixtures exist |
| Dream Land opening Archive | the *Kirby's Adventure* cast here plus plan `16` additions | reach 22 production-ready normal fighters before the first Archive pull |
| Dream Land breadth/Mythic | Star Rod Power-Up, RTDL Kirby and later cast in plans `16`–`18` | complete Copy/Super Ability/Hypernova choices before Mega Man production |

An item can move later when its assets fail. Do not replace it with a motionless
card merely to preserve the table. Plan
`16_MARIO_KIRBY_ARCHIVE_EXPANSION.md` supplies the expanded release floors and
34 additional complete cards; this file remains authoritative for the original
30 cards, Copy contract, enemy states and acceptance scenarios.

# Part I — Mushroom Kingdom

## 3. Opening fighters

### Classic Mario — Course One Classic · R

**Source:** *Super Mario Bros.* visual treatment; broader platforming motion.
**Role:** Bruiser / Stomp, front. **Stats:** HP 1,100; ATK 99; Guard 42;
Move 123; Haste 0%; Crit 8%.

- **Basic — Classic Stomp:** jumps to the nearest target for 1.15× damage,
  2.8 s interval, then rebounds instead of landing inside the enemy.
- **Skill — Brick Break, 10 s:** rises under a brick marker and slams through
  the target for 1.20× plus 0.35× splash and 18 boss stagger.
- **Passive — Coin Hunter:** his kills add 10% to that encounter's Coin drop;
  this is visible as coins following his rebound.
- **Ultimate — Course Clear, 100 energy:** runs through the line for 1.60× to
  each crossed target, stomps the backmost target for 3.40×, hits the flag pose
  and gives the party 15% Haste for 8 s. Single-target total: **5.00×**.
- **Reveal:** brick dust / warm red; quote “Let's-a go!”
- **Must feel right:** run precedes takeoff; rise/apex/fall are distinct; damage
  occurs at foot contact; a successful stomp squashes eligible enemies and
  visibly bounces Mario upward. A diagonal lunge with jump frames fails.

### Classic Luigi — High-Jump Hero · R

**Source:** SMB1 palette; high jump and slippery recovery reference *The Lost
Levels* and *Super Mario Bros. 2*. **Role:** Controller / Charge, front.
**Stats:** HP 980; ATK 94; Guard 36; Move 132; Haste 3%; Crit 9%.

- **Basic — High-Jump Charge:** takes a narrow, high arc through the nearest
  target for 1.08× and applies a light 12% Slow for 2 s.
- **Skill — Evasive Retreat, 9 s:** vaults over the target for 0.90× and slides
  100 px back to safety.
- **Passive — Green Momentum:** moving grants 8 Guard for 2 s; renewed only
  after meaningful displacement.
- **Ultimate — Backline Bound:** chains three rising stomps at 1.20× each, then
  clears the front line and lands on the backmost target for 2.20× plus 0.60×
  splash. Maximum primary-target total: **5.80×**.
- **Reveal:** green speed streak / nervous inhale; quote “Here we go!”
- **Must feel right:** apex is at least 25% higher and hang time about 20%
  longer than Mario's at the same distance. He skids or windmills on landing;
  he cannot read as green Mario with identical timing.

### Toad — Castle Courier · R

**Source:** SMB1 look with playable motion references from *Super Mario Bros.
2*. **Role:** Striker / Combo, front. **Stats:** HP 900; ATK 102; Guard 30;
Move 138; Haste 4%; Crit 12%.

- **Basic — Courier Combo:** three quick body/head strikes at 0.40× each.
- **Skill — Emergency Delivery, 12 s:** dashes to the lowest-HP ally, throws a
  Mushroom parcel and heals 60% ATK before returning to his lane.
- **Passive — Quick Feet:** gains 8% Haste for the first 6 s of every wave.
- **Ultimate — Retainer Rush:** ricochets through priority enemies six times at
  0.85×, then finishes the lowest-HP survivor for 1.20×. Later hits retarget if
  a victim falls. Maximum single-target total: **6.30×**.
- **Reveal:** paper route map / blue spots; quote “Leave it to me!”
- **Must feel right:** tiny stride cycles quickly, parcel exists in his hands,
  heal lands on delivery, and the combo is scrappy rather than sword-like.

### Princess Peach — Mushroom Kingdom Hope · R

**Source:** classic reconstruction; float/turnip references *Super Mario Bros.
2*. **Role:** Support / Lob, back. **Stats:** HP 940; ATK 88; Guard 34;
Move 112; Haste 0%; Crit 7%.

- **Basic — Turnip Lob:** pulls, aims and throws for 0.82× plus 0.35× splash.
- **Skill — Royal Shield, 11 s:** floats to sight of the lowest-HP ally and
  grants a shield equal to 80% ATK.
- **Passive — Gentle Recovery:** after each wave, heals the party for 18% ATK.
- **Ultimate — Princess's Wish:** floats above the party, cleanses one control
  condition, heals everyone for 220% ATK, shields for 150% ATK and grants 15%
  Haste for 6 s. Its conservative support value clears the R ultimate floor.
- **Reveal:** petals and soft star light; quote “I can do this on my own.”
- **Must feel right:** her reposition uses a short hover and slow descent; skirt
  and shadow separate from the floor; she can clear low ground hazards during
  the float but is not permanently Airborne. Turnips are pulled before thrown.

### Koopa Troopa — Shell-Line Regular · R

**Source:** *Super Mario Bros.* **Role:** Vanguard / Strike, front.
**Stats:** HP 1,280; ATK 80; Guard 67; Move 108; Haste 0%; Crit 5%.

- **Basic — Shell Jab:** closes behind its shell for 1.00× damage.
- **Skill — Shell Guard, 11 s:** retracts for 4 s, gains 45 Guard, taunts nearby
  enemies and becomes immune to ordinary knockback.
- **Passive — Kick Start:** once per wave below 45% HP, enters a 1.4 s loose
  shell state. The next allied Stomp or Charge that crosses it kicks the shell
  through the enemy line for 1.10× Koopa ATK. If untouched, Koopa self-launches
  at reduced 0.75× power so AI composition cannot brick it.
- **Ultimate — Ricochet Route:** retracts, crosses the line four times for
  1.25× per pass, then exits the shell for a 2.00× impact and returns to its
  original front position. Maximum single-target total: **7.00×**.
- **Reveal:** green checker trail; quote “One kick changes the whole course.”
- **Must feel right:** walking body becomes a separate spinning-shell state;
  kick direction comes from the ally's contact; impacts occur at collision,
  and Koopa re-emerges rather than teleporting upright. Enemy Koopas use the
  same state grammar with encounter-specific recovery.

### Hammer Bro — Arc-Line Veteran · SR

**Source:** *Super Mario Bros.* **Role:** Artillery / Lob, back.
**Stats:** HP 897; ATK 129; Guard 28; Move 108; Haste 0%; Crit 10%.

- **Basic — Hammer Arc:** lobs one hammer at the densest legal ground cluster
  for 0.90× plus 0.40× splash.
- **Skill — Hammer Fan, 10 s:** marks three offset landing circles, then sends
  three 0.62× hammers so moving targets can evade part of the fan.
- **Passive — Look Up:** deals 35% more damage and 20% more stagger to Airborne
  enemies, but cannot receive that bonus against a grounded lone boss.
- **Ultimate — Hammer Storm:** leaps between brick tiers while eight
  telegraphed hammers fall for 0.90× each; the final center impact deals an
  additional 1.20×. Maximum focused total: **8.40×**.
- **Reveal:** violet brick silhouette / spinning hammer; quote “Heads up!”
- **Must feel right:** release happens at the apex, hammers rotate along real
  arcs, and paired Bros stagger their throws. Projectiles cannot appear from an
  idle hand or track a target after the landing circle locks.

### Bowser — King of the Koopas · SSR

**Source:** SMB1 boss translated into a playable scale; later canonical weight
and fire motion may fill missing frames. **Role:** Vanguard / Charge, front.
**Stats:** HP 1,960; ATK 126; Guard 72; Move 92; Haste -2%; Crit 6%.

- **Basic — Royal Claw:** two heavy swipes at 0.58× each, with high hit recoil.
- **Skill — Royal Flame, 11 s:** inhales for 0.8 s, braces and sweeps a Beam for
  0.34× × 4; applies Burn for 5 s.
- **Passive — Unbowed:** 45% of incoming control duration converts to stagger
  buildup instead. At full stagger he still falls; he is not control-immune.
- **Ultimate — King of the Koopas:** leaps away, crashes down for 2.40× splash,
  then breathes eight 0.75× flame ticks across two lanes before returning to
  the front. Focused total: **8.40×**, plus Burn.
- **Reveal:** screen blackout warms red, eyes and furnace breath emerge; quote
  “Showtime!” before the separate S/S/R impacts.
- **Must feel right:** every step carries weight; fire has inhale, ignition and
  mouth origin; his shadow grows before landing; playable scale is smaller than
  the boss without speeding him into a lightweight fighter.

## 4. First regional Archive expansion

### Yoshi — Dinosaur Land Partner · SR

**Source:** *Super Mario World*. **Role:** Bruiser / Shot-tether, front/either.
**Stats:** HP 1,208; ATK 115; Guard 42; Move 126; Haste 2%; Crit 8%.

- **Basic — Tongue Snap:** uses the Shot timing family but renders as a tether;
  it extends to 250 px, deals 0.86× and pulls a Small
  target 70 px. Against larger targets Yoshi pulls himself partway forward.
- **Skill — Gulp and Lay, 12 s:** a Small non-boss below 35% HP is swallowed
  and converted into an egg, then the egg is thrown for 1.35× plus 0.45×
  splash. Against an ineligible target, the tongue deals 0.75×, adds 22 stagger
  and creates a weaker debris egg; the cooldown is never wasted.
- **Passive — Flutter Step:** once every 8 s, a long approach or knockback
  triggers a flutter that clears low ground hazards and grants 15% dodge while
  airborne.
- **Ultimate — Egg Relay:** lays and kicks three colored eggs through priority
  targets for 1.60× each; the last bursts for an additional 2.00× splash.
  Maximum focused total: **6.80×**.
- **Reveal:** egg spots and leaf confetti; quote “Yoshi!”
- **Must feel right:** tongue tip is the hitbox, sticks to the target, and
  retracts with it; cheeks/body show the swallow; the egg exists as a persistent
  object before the throw. Bosses are never swallowed. Flutter uses rapid leg
  motion and a slower fall rather than generic levitation.

### Mario 64 — Castle Acrobat · SSR

**Source:** *Super Mario 64*, using an approved 2D/fighting-style treatment.
**Role:** Striker / Combo, front. **Stats:** HP 1,449; ATK 149; Guard 38;
Move 134; Haste 4%; Crit 12%.

- **Basic — Punch, Punch, Kick:** three hits at 0.36×, 0.36× and 0.58×. The
  finisher pushes Small targets and advances Mario slightly.
- **Skill — Triple Jump Pound, 12 s:** three increasingly high jumps cross up
  to 320 px, then a ground pound deals 1.35× plus 0.45× splash and 24 stagger.
- **Passive — Momentum Route:** completing a move without being interrupted
  grants one Momentum stack, up to three; each gives 4% Move and Crit. Taking
  a heavy hit drops one stack, not all three.
- **Ultimate — Acrobatic Course Clear:** long-jumps through the line for 2.20×,
  wall-kicks back for 1.80× and dives onto the highest-HP target for 5.20×.
  Maximum focused total: **9.20×**.
- **Reveal:** castle painting ripples, red cap silhouette dives through; quote
  “Here we go!”
- **Must feel right:** attacks use the broad 64 stance and recoil; jump one,
  two and three have distinct height/sound; dive lands belly-first into a roll.
  It must not be Classic Mario with higher numbers and a smoother sprite.

## 5. Mario Archive B

### Princess Daisy — Sarasaland Spark · R

**Source:** *Super Mario Land* identity with sports-era motion references.
**Role:** Striker / Charge, front. **Stats:** HP 900; ATK 110; Guard 30;
Move 134; Haste 5%; Crit 11%.

- **Basic — Flower Dash:** shoulder-checks through one target for 1.08×.
- **Skill — Petal Uppercut, 9 s:** launches a Small target and follows for
  1.25×; bosses receive 20 stagger instead.
- **Passive — Competitive Spirit:** gains 10% Haste for 5 s whenever another
  ally reaches full ultimate energy first, once per ally/wave.
- **Ultimate — Sarasaland Rally:** crosses the field three times for 1.10× per
  pass, finishes for 1.50×, then gives allies 15% Move and Crit for 8 s.
  Focused total: **4.80×**, plus the party buff.
- **Reveal/feel:** orange petals, loud arrival, planted athletic turns; quote
  “Hi, I'm Daisy!” She charges confidently and never borrows Peach's float.

### Bowser Jr. — Clown-Car Commander · SR

**Source:** *New Super Mario Bros.* era. **Role:** Artillery / Lob, back;
Airborne. **Stats:** HP 943; ATK 129; Guard 30; Move 118; Haste 1%; Crit 9%.

- **Basic — Cannonball Pop:** fires a 0.92× Shot that briefly rolls after its
  first ground impact.
- **Skill — Mechakoopa Delivery, 12 s:** lobs a walker that seeks the backmost
  enemy and explodes for 1.25× plus 0.40× splash; it can be destroyed.
- **Passive — Clown-Car Cover:** the first hit every 8 s is reduced 35%; the car
  visibly dents and repairs during cooldown.
- **Ultimate — Junior's Crash Course:** paints three danger marks, bombards
  each for 1.60×, then rams the lowest-HP target for 2.70×. Maximum focused
  total: **7.50×**.
- **Reveal/feel:** crayon marks and propeller smoke; quote “My turn!” Car tilt,
  recoil and propeller acceleration must drive every movement.

### Wario — Shoulder-First Treasure Hunter · SR

**Source:** *Wario Land 4*. **Role:** Bruiser / Charge, front.
**Stats:** HP 1,288; ATK 122; Guard 46; Move 118; Haste 0%; Crit 10%.

- **Basic — Shoulder Bash:** 1.35× line charge that stops on the first heavy
  target and launches Small targets.
- **Skill — Ground Pound, 10 s:** short hop into 1.20× splash; cracked ground
  applies Guard Break for 5 s.
- **Passive — Treasure Nose:** the first chest/coin-bearing enemy each wave is
  Marked; Wario deals 20% more damage to it and its defeat adds a small bounded
  Coin bonus.
- **Ultimate — Hurry Up!:** the stage alarm sounds; for 10 s Wario gains 45%
  ATK, 35% Haste and knockback immunity, replacing basics with 1.10× line
  bashes. He ends with a 2.00× ground slam. The form targets **8–12 normal
  basic-action equivalents** depending on travel time.
- **Reveal/feel:** garlic, coins and screen shake; quote “Have a rotten day!”
  Acceleration, shoulder contact and belly recovery carry his weight.

### Waluigi — Court-Side Cheat · SR

**Source:** *Mario Tennis* era. **Role:** Controller / Shot, back/either.
**Stats:** HP 943; ATK 129; Guard 24; Move 136; Haste 5%; Crit 13%.

- **Basic — Topspin Serve:** curved 0.92× projectile that favors the farthest
  reachable enemy.
- **Skill — Crooked Line, 11 s:** plants a false court line; the next two
  enemies crossing it trip, taking 0.55× and Slow for 4 s.
- **Passive — Long Reach:** gains 20% range and can intercept one projectile
  every 10 s with a racket return at 70% original power.
- **Ultimate — Waluigi Time:** rose-petal pose, then five 0.90× trick serves
  alternate front/back targets and end with a 2.20× smash. Maximum focused
  total: **6.70×**.
- **Reveal/feel:** purple court lines and roses; quote “Everyone's cheating but
  me!” His exaggerated limbs and theatrical recovery are the point.

### Paper Mario — Star-Bound Tactician · SSR

**Source:** *Paper Mario* (Nintendo 64). **Role:** Controller / Strike, either.
**Stats:** HP 1,283; ATK 141; Guard 34; Move 118; Haste 2%; Crit 10%.

- **Basic — Hammer Tap:** 1.00× Strike; alternates with a 1.05× jump against
  backline/Airborne targets when a safe path exists.
- **Skill — Power Bounce, 12 s:** up to five 0.42× bounces. The first three are
  guaranteed; four/five require the target to remain alive and Mario not to be
  interrupted, recreating action-command escalation without twitch input.
- **Passive — Partner Plan:** at wave start chooses one visible need: lowest
  enemy Guard gets `Goombario Mark`, projectiles enable `Kooper Cover`, or a
  hurt party enables `Tattle Aid`. Only one bounded plan is active per wave.
- **Ultimate — Star Storm:** five Star Spirits cross the stage for 1.40× each,
  cleanse one control condition from the party and grant 10 energy to allies.
  Focused total: **7.00×**, plus cleanse and energy.
- **Reveal/feel:** page turn, paper fold shadow and star trails; quote “Every
  story needs someone willing to take the first jump.” He flips edge-on while
  dodging and attacks on flat animation beats.

### Sunshine Mario — Isle Delfino Custodian · SSR

**Source:** *Super Mario Sunshine*. **Role:** Controller / Shot, either.
**Stats:** HP 1,352; ATK 144; Guard 38; Move 124; Haste 2%; Crit 8%.

- **Basic — FLUDD Spray:** 0.30× × 3 water hits; pushes Small targets and builds
  10 stagger per burst but has lower raw damage than other SSR basics.
- **Skill — Hover Nozzle, 10 s:** hovers over the front line while spraying a
  1.15× water lane; avoids ground hazards and lands at a selected safe anchor.
- **Passive — Clean Getaway:** enemies hit by six water ticks become Soaked for
  5 s: -15% Move and +20% incoming Electric effect, a local kit interaction,
  not a global elemental triangle.
- **Ultimate — Rocket Nozzle:** charges, launches beyond the top of the strip
  and ground-pounds for 5.50× plus 2.00× splash and 60 stagger. Primary-target
  total: **7.50×**.
- **Reveal/feel:** sun glare, water droplets and nozzle silhouette; quote “Let's
  clean this place up!” Water must push, pool and refract; FLUDD animates as an
  attached device, not a blue beam emitted from Mario's chest.

## 6. Mario signature goals

### Rosalina — Guardian of the Comet · SSR

**Source:** *Super Mario Galaxy*. **Role:** Support / Beam, back.
**Stats:** HP 1,242; ATK 119; Guard 35; Move 110; Haste 3%; Crit 7%.

- **Basic — Luma Ray:** Luma fires 0.72×/0.54×/0.40× through up to three.
- **Skill — Gravity Well, 12 s:** pulls enemies toward a marked center, deals
  0.65× and Slows 25% for 4 s.
- **Passive — Luma Orbit:** Luma alternates between intercepting one projectile
  every 9 s and empowering Rosalina's next basic by 25%.
- **Ultimate — Grand Star Passage:** shields the party for 180% ATK, lifts them
  over ground hazards for 4 s, grants 20 energy and drops star fragments for
  3.50× total damage. Its support value meets the SSR floor.
- **Reveal/feel:** observatory silhouette, comet arc, restrained zero-gravity
  drift; quote “May the stars shine down on you.” Rosalina barely runs—Luma and
  gravity carry her positioning.

### King Boo — Master of the Gallery · SSR

**Source:** *Luigi's Mansion*. **Role:** Controller / Beam, back.
**Stats:** HP 1,270; ATK 138; Guard 30; Move 116; Haste 4%; Crit 9%.

- **Basic — Crown Lightning:** a 1.05× spectral Shot jumps once for 0.45×.
- **Skill — Vanish Behind You, 11 s:** fades untargetable for 1.2 s, reappears
  behind the backmost enemy for 1.20× and applies Slow; bosses gain stagger.
- **Passive — Lights Out:** every third enemy projectile dims the arena for
  2.5 s, granting Ghost allies 15% dodge; a visible counter sits by his crown.
- **Ultimate — Gallery Trap:** frames the enemy field, pulls Small targets into
  portraits for 2 s, deals four 0.60× spectral ticks and releases them for
  6.00×. Focused total: **8.40×**. Bosses remain visible and take damage plus
  continuous stagger instead of being removed.
- **Reveal/feel:** total darkness, crown gem and grin appear before the body;
  quote “No one escapes my gallery.” Movement is squashy hover/phase, never a
  ground walk.

### Fury Bowser — Night Over Lake Lapcat · UR

**Source:** *Bowser's Fury*. **Role:** Vanguard / Beam-transform, front.
**Stats:** HP 2,486; ATK 188; Guard 78; Move 105; Haste 0%; Crit 7%.

- **Basic — Fury Claw:** two 0.62× swipes with heavy knockback conversion.
- **Skill — Dark Flame, 10 s:** 0.28× × 6 Beam ticks, Burn and 20 stagger.
- **Passive — The Storm Returns:** damage dealt/taken fills a separate Fury
  gauge. At 100, the ultimate becomes available even if normal energy is 80+;
  Fury cannot refill during transformation.
- **Ultimate — Lake Lapcat Awakening:** leaps off-screen and crashes back for
  3.00×, then remains giant for 15 s with **+80% ATK, +40% Haste, +60 Guard,
  +40% reach and 50% shorter control**. Basics become 0.80× × 3 claw waves;
  the skill becomes a sweeping 0.55× × 8 fire beam. A 5.00× final slam ends
  the form. It targets **18–26 normal-action equivalents** before crowd value;
  Fury cannot gain energy during it and boss phase floors remain respected.
- **Reveal/feel:** black rain, lighthouse pulse, giant silhouette and roar; no
  written speaker name is needed. Scale change affects shadow, camera framing,
  collision lanes and sound—not just sprite zoom.

### Additional Mario iteration ledger

Plan `16` promotes Cappy and Builder Mario to complete cards. The remaining
rows are named homes, not build commitments:

| Candidate | Rarity direction | Distinct identity required before approval |
| --- | --- | --- |
| Galaxy Mario | SSR | spin, gravity/Launch Star movement; cannot be Rosalina-lite |
| Cappy Mario | SSR · approved in plan `16` | cap throw plus bounded capture echo; never permanently steals a boss |
| Builder Mario | SR · approved in plan `16` | hammer/block construction used as spatial setup, not Fire Mario recolor |
| Cat Mario | Power-Up first | becomes fighter only if a complete 3D World iteration exceeds the Power-Up kit |
| Invincible Mario | UR Power-Up first | 45–60 s is too long for trial; begin at 12–18 s and tune by boss floors |
| Retro/Arcade Mario | separate family iteration candidate | hammer, ladder and barrel response from *Donkey Kong*, not SMB1 stomp kit |

# Part II — Dream Land

## 7. Kirby's copy contract

Kirby's fantasy is non-negotiable, so Copy is a bounded engine system rather
than a flavor buff.

Ordinary Copy profiles remain this encounter-acquired system. Plans `17`–`18`
replace the five separate Super Ability fighters with one *Return to Dream
Land* Kirby UR whose held Copy chooses the transformation ultimate. Hypernova
Kirby is a separate SSR because suction changes its whole ordinary grammar.

1. Enemies explicitly declare `copyAbilityId` or `null`.
2. Kirby holds one copied ability at a time. Copy lasts until replaced, Kirby
   is knocked out, or the encounter ends.
3. Small eligible targets can be swallowed only below an authored execute
   threshold. Elites shed an Ability Star; bosses expose one during a stagger or
   phase event. Nothing important disappears because Kirby pressed a skill.
4. Auto-copy priority is player-configurable: `recommended`, a named favorite,
   or `never replace`. Recommended chooses healing/survival when required,
   encounter-tag advantage next, then highest neutral output.
5. Hats/palette and the basic/skill animation change immediately. A text icon
   without a visible Kirby change is not a complete Copy implementation.
6. Every Copy-capable version declares `copyLibrary`. An out-of-library ability
   produces three boosted Star Shots and refunds 40% of Copy cooldown rather
   than showing an invisible or borrowed hat.
7. A version with a transformation ultimate may spend the held Copy when it
   fires. The record declares the deterministic no-Copy fallback.

### Launch copy library

| Ability | Copied basic | Copied skill | Visual requirement |
| --- | --- | --- | --- |
| Fire | 0.24× × 4 short Beam, Burn | 1.20× Fireball charge | fire crown, continuous mouth flame |
| Cutter | 0.90× out + 0.45× return Shot | three-target Cutter Fan | cutter cap, catch/recovery frame |
| Spark | 0.72× radial pulse | 75% ATK shield + Electric burst | spark crown and held charge |
| Ice | 0.20× × 4 breath, Slow | 1.10× sliding tackle | ice crown, frost breath and skid |
| Sword | 0.40× × 3 Combo | 1.35× rising slash | green cap, held blade arcs |
| Hammer | 1.35× slow Strike | 1.60× Hammer Flip, 25 stagger | headband, recoil and charged flame |
| Beam | common line Beam | sweeping Wave Beam | jester cap and segmented wave |

Copy uses a fixed balance table. Enemy damage numbers are never imported into
Kirby's player kit. Adventure Kirby launches with all seven profiles above;
future versions need at least three complete profiles. *Return to Dream Land*
Kirby requires Sword, Fire, Beam, Hammer and Ice for its five ultimate routes.

## 8. Dream Land fighters

### Kirby — Copy-Capable Hero · R

**Source:** *Kirby's Adventure*. **Role:** Controller / Shot, either.
**Stats:** HP 920; ATK 90; Guard 28; Move 122; Haste 3%; Crit 8%.

- **Basic — Inhale and Spit:** pulls an eligible projectile or Small target. A
  projectile returns at 1.00×; a low-HP Small enemy becomes a 1.25× Star Shot;
  otherwise inhale deals 0.55× and pulls, followed by a 0.55× air pellet.
- **Skill — Copy, 14 s:** acquires the target's declared ability under the copy
  contract. If none is legal, produces three boosted Star Shots and refunds
  40% of the cooldown.
- **Passive — Air Puff:** can inflate for up to 4 s while crossing hazards or
  reaching Airborne targets; Move drops 15% while floating and exhale ends it.
- **Ultimate — Warp Star Crash:** rides across the enemy line twice for 1.60×
  per pass, then lands for 1.50× splash. Focused total: **4.70×**.
- **Reveal:** Warp Star trail and inhale silhouette; quote “Hii!”
- **Must feel right:** suction moves particles, projectiles and eligible bodies;
  cheeks inflate; star shape exits the mouth; copied hat and actions swap on a
  single synchronized state boundary. Floating has flap/puff cadence.

### Parasol Waddle Dee — Rain-or-Shine Guard · SR

**Source:** *Kirby's Adventure*. **Role:** Vanguard / Strike, front.
**Stats:** HP 1,265; ATK 87; Guard 62; Move 112; Haste 1%; Crit 5%.

- **Basic — Parasol Poke:** 0.95× Strike with enough reach to hold the line.
- **Skill — Parasol Shield, 10 s:** opens upward for 4 s, blocking 55% of
  projectile damage to allies directly behind it.
- **Passive — Gentle Descent:** knockback launches become controlled floats;
  landing grants 20 Guard for 2 s.
- **Ultimate — Circus Toss:** spins the parasol for 0.65× × 6, lifts Small
  enemies, then drops them for 1.50×. Focused total: **5.40×**; bosses gain
  stagger instead of the lift.
- **Reveal/feel:** raindrops reverse upward; quote “The weather won't stop me.”
  The parasol opens/closes and catches impacts; generic Waddle Dee is an enemy,
  not padded into a fighter with invented punches.

### Poppy Bros. Jr. — Bomb-Bounce Rookie · R

**Source:** *Kirby's Adventure*. **Role:** Artillery / Lob, back.
**Stats:** HP 760; ATK 115; Guard 20; Move 118; Haste 2%; Crit 9%.

- **Basic — Bouncing Bomb:** 0.86× plus 0.45× splash after one visible bounce.
- **Skill — Fuse Choice, 10 s:** alternates a short-fuse front bomb and a long-
  fuse back bomb, each 1.15×; locked circles allow movement counterplay.
- **Passive — Juggler:** catching his own rebound every third basic reduces the
  next skill cooldown 2 s; interruption visibly drops the bomb and the bonus.
- **Ultimate — Poppy Festival:** juggles five bombs into staggered lanes for
  0.90× each, ending with a 1.50× center burst. Maximum focused total:
  **6.00×**.
- **Reveal/feel:** juggling silhouette and fuse sparks; quote “Up it goes!”

### Sir Kibble — Return-Arc Knight · SR

**Source:** *Kirby's Adventure*. **Role:** Striker / Shot, either.
**Stats:** HP 920; ATK 129; Guard 30; Move 124; Haste 4%; Crit 12%.

- **Basic — Cutter Return:** 0.90× outbound and 0.45× return damage; positioning
  can hit different targets.
- **Skill — Final Cutter, 9 s:** leaps and sends a ground wave for 1.35× plus
  Guard Break for 5 s.
- **Passive — Clean Catch:** catching the returning blade grants 8% Haste for
  4 s; control that prevents the catch forfeits it.
- **Ultimate — Crescent Circuit:** three large cutters orbit through the enemy
  half for up to six 1.00× hits, then converge for 1.50×. Maximum focused
  total: **7.50×**.
- **Reveal/feel:** blade splits the card and returns to his hand; quote “Every
  arc comes back.” The boomerang path and catch are physical states.

### Hot Head — Furnace Breath · SR

**Source:** *Kirby's Adventure*. **Role:** Artillery / Beam, back.
**Stats:** HP 897; ATK 130; Guard 24; Move 110; Haste 1%; Crit 8%.

- **Basic — Flame Breath:** 0.25× × 4 short Beam ticks and Burn.
- **Skill — Searing Leap, 11 s:** arcs over the front line and leaves a 5 s
  flame patch worth up to 1.40×.
- **Passive — Stoke:** hitting a Burning target increases flame width 20% for
  the next action, not raw damage.
- **Ultimate — Furnace Line:** inhales, then sweeps two fire lanes for ten
  0.65× ticks. Maximum focused total: **6.50×**, plus Burn.
- **Reveal/feel:** cheeks expand before a continuous flame tongue; quote “Feel
  the heat!” No idle-frame projectile spawn.

### Wheelie — Full-Throttle Friend · SR

**Source:** *Kirby's Adventure*. **Role:** Striker / Charge, front.
**Stats:** HP 1,093; ATK 120; Guard 38; Move 155; Haste 4%; Crit 9%.

- **Basic — Tire Rush:** accelerates into a 1.35× line charge.
- **Skill — Brake Turn, 8 s:** passes the backmost target, skids around and hits
  back through the line for 0.80× twice.
- **Passive — RPM:** gains one RPM per uninterrupted charge, up to three; each
  adds 6% Move and 4% damage. Stun or collision with a Heavy enemy drops one.
- **Ultimate — Grand Prix:** becomes untargetable only while crossing the outer
  lane five times for 1.20× each, crashes through the largest target for 1.50×,
  then overheats for 1.5 s. Focused total: **7.50×**.
- **Reveal/feel:** tire track tears across the result; quote “No brakes!” Spin
  rate, dust, acceleration and skid direction must correspond to speed.

### Sparky — Stored Thunder · SR

**Source:** *Kirby's Adventure*. **Role:** Controller / Beam, either.
**Stats:** HP 978; ATK 120; Guard 31; Move 112; Haste 2%; Crit 8%.

- **Basic — Spark Ring:** 0.72× radial pulse at close range.
- **Skill — Stored Charge, 10 s:** roots for 0.9 s, gains a 75% ATK shield and
  discharges 1.20× Electric damage when it breaks/expires.
- **Passive — Conductor:** projectiles intercepted by the shield add 10% to the
  discharge, capped at +40%.
- **Ultimate — Thunderhead:** calls four readable 1.20× bolts at priority
  targets and a final 1.80× center ring. Maximum focused total: **6.60×**.
- **Reveal/feel:** charge crawls around the outline before the flash; quote
  “Hold it... now!”

### Rocky — No-Hurry Heavyweight · SR

**Source:** *Kirby's Adventure*. **Role:** Vanguard / Stomp, front.
**Stats:** HP 1,438; ATK 90; Guard 78; Move 82; Haste -3%; Crit 5%.

- **Basic — Rock Drop:** short hop/stomp for 1.20× plus 0.30× splash.
- **Skill — Stone, 11 s:** becomes immobile and nearly invulnerable for 2.5 s;
  landing/exit deals 1.10× and taunts. Cannot stall after all allies fall.
- **Passive — Bedrock:** ground knockback immunity; Airborne attacks deal 15%
  more to Rocky so the strength has readable counterplay.
- **Ultimate — Mountain Fall:** rises slowly, shadow telegraphs a large circle,
  then lands for 4.80×, 2.20× splash and 60 stagger. Primary-target total:
  **7.00×**.
- **Reveal/feel:** the card appears to crack under his weight; quote “...”
  Stone state changes silhouette, collision and sound rather than tint alone.

### Bonkers — Wild Hammer · SR

**Source:** *Kirby's Adventure*. **Role:** Bruiser / Strike, front.
**Stats:** HP 1,265; ATK 121; Guard 48; Move 112; Haste 0%; Crit 9%.

- **Basic — Hammer Swing:** deliberate 1.25× Strike with wide recoil.
- **Skill — Hammer Flip, 12 s:** charges in place, then 1.65× fire-edged impact
  and 28 stagger; interruption before release spends half cooldown.
- **Passive — Enraged Rhythm:** taking 12% max HP within 3 s grants 12% Haste
  for 5 s, with an 8 s internal cooldown.
- **Ultimate — Coconut Quake:** leaps, throws two 1.40× explosive coconuts,
  then ground-pounds for 4.20× splash. Maximum focused total: **7.00×**.
- **Reveal/feel:** hammer head lands before the name plate; quote “Bonk first!”
  Windup, weight transfer and rebound distinguish him from a generic bruiser.

### Meta Knight — Masked Swordsman · SR

**Source:** *Kirby's Adventure* with later official motion references where the
NES sheet is incomplete. **Role:** Striker / Combo, front/either.
**Stats:** HP 1,059; ATK 131; Guard 38; Move 142; Haste 7%; Crit 14%.

- **Basic — Galaxia Sequence:** 0.34× × 3, ending with a short sword wave if the
  target moved out of reach.
- **Skill — Cape Counter, 10 s:** guards for 0.8 s; on hit, vanishes and answers
  behind the attacker for 1.45×. With no hit, lunges for 0.80× so it is useful
  but not optimal.
- **Passive — Knight's Tempo:** every clean third action grants one 20% dodge
  charge; taking an unguarded hit resets the count.
- **Ultimate — Mach Tornado:** opens his wings, crosses the line in a tornado
  for eight 0.80× hits, then ends in a 2.20× Galaxia slash. Maximum focused
  total: **8.60×**—about 8.4 normal Galaxia combos before crowd value.
- **Reveal:** black quote screen, eye slit, cape sweep, Galaxia line; quote
  “Come. Let us test your strength.”
- **Must feel right:** cape teleport has exit/entry tells, wings support real
  glide frames, sword arcs precede hit sparks, and he pauses in his guarded
  duel posture instead of vibrating at generic Striker speed.

### King Dedede — Dream Land's Heavy King · SSR

**Source:** *Kirby's Adventure*. **Role:** Vanguard / Strike, front.
**Stats:** HP 1,932; ATK 127; Guard 70; Move 96; Haste -1%; Crit 7%.

- **Basic — Royal Hammer:** 0.70× overhead plus 0.55× ground shock.
- **Skill — King-Size Inhale, 12 s:** pulls projectiles and Small enemies;
  projectiles are spat for 1.10×, while enemies take 0.85× and are displaced.
  Bosses receive 20 stagger and cannot be swallowed.
- **Passive — Belly Armor:** front-facing projectile damage is reduced 25%; a
  hit from behind or during hammer recovery ignores it.
- **Ultimate — Super Dedede Jump:** crouches, launches off-strip and lands on
  the largest cluster for 6.00× plus 2.75× splash and 60 stagger. Primary-target
  total: **8.75×**.
- **Reveal:** hammer silhouette, robe pattern and heavy landing; quote “This
  here kingdom's got one king!” before S/S/R.
- **Must feel right:** inhale deforms cheeks and pulls real objects; hammer drags
  through anticipation; jump shadow warns the landing; recovery stays heavy.

### Archived Star Rod Kirby reference — reclassified as UR Power-Up

This is not a pullable fighter and does not count toward a roster floor. Keep
the motion, VFX and value notes below as input for the Star Rod Awakening; the
final Power-Up contract is plan `18` §3.2.

**Source:** *Kirby's Adventure* finale. **Role:** Artillery / Beam, either.
**Stats:** HP 1,613; ATK 188; Guard 34; Move 132; Haste 5%; Crit 12%.

- **Basic — Star Rod Bolt:** 1.00× piercing Shot; each third bolt bursts for
  0.45× splash.
- **Skill — Fountain Arc, 9 s:** sweeps a 0.28× × 5 Beam and cleanses Slow/Stun
  from Kirby.
- **Passive — Nightmare's End:** deals 25% more stagger to bosses and gains a
  20% ATK shield at each phase transition. It is useful but not mandatory.
- **Ultimate — Starlight Pursuit:** deals 2.50× on takeoff, then mounts the Warp
  Star for 15 s with **+70% ATK, +35% Haste, +30% dodge and permanent Airborne**.
  Basics become 0.75× × 3 star volleys and the skill becomes a 3.20× charged
  Star Rod blast. A final 4.50× comet hit ends the form. It targets **18–24
  normal-action equivalents** and cannot generate energy during the form.
- **Reveal/feel:** Fountain goes dark, quote “Dreams belong to everyone,” Star
  Rod ignites, flight begins and U/R seals land. This requires a full airborne
  moveset; a glowing base Kirby sprite fails the UR gate.

## 9. Enemy and boss behavior ledger

These behaviors are part of stage identity and must be implemented before HP
inflation is used to create difficulty.

### SMB1

| Actor | Required readable behavior | Defeat/state requirement |
| --- | --- | --- |
| Goomba | steady approach and headbutt; veteran version hops low attacks | stomp/KO compresses flat for 0.45–0.7 s, then poofs; ordinary damage can tumble but still ends flattened where appropriate |
| Green Koopa | walks off its safe range; first break retracts to loose shell | shell persists, can be kicked by either side, ricochets through bodies, then re-emerges if encounter data permits |
| Red Koopa | patrols/turns at authored ledge markers | same shell grammar, shorter patrol and safer recovery |
| Piranha Plant | pipe closes, stem rises, bite telegraph, retreats | cannot be targeted while fully inside pipe; defeat wilts/retracts rather than falling sideways |
| Buzzy Beetle | armored crawl; ceiling variant drops on a locked shadow | shell spin on break; Projectile resistance is visible as a hard spark |
| Cheep-cheep | school arcs or water lanes, not ground walking | flips/bobs out of its lane on defeat |
| Blooper | pulse-pause swimming with readable vertical drift | ink shrinks accuracy/range and dissipates from the outside inward |
| Lakitu | cloud keeps long range, throws Spiny Eggs and dives when staggered | breaking cloud drops Lakitu to a grounded vulnerable state |
| Hammer Bro | tier jump and alternating hammer arcs | paired boss enrages survivor; hammer drops and body falls separately |
| False Bowser | uses a bounded subset of Bowser actions | axe defeat reveals its declared source enemy before the chest |
| Bowser boss | fire inhale/sweep, heavy leap, later hammer pattern, bridge stagger | phase floor preserves each tell; axe/bridge finale is authored, not a generic HP-zero fade |

The shell object is a reusable actor state, not a particle. It owns velocity,
team attribution, hit cooldown per target, collision, wall/edge response and a
bounded lifetime/re-emergence rule.

### Kirby's Adventure

| Actor | Required readable behavior | Copy/boss requirement |
| --- | --- | --- |
| Waddle Dee | simple walk/fall/body bump | no ability; flatten/tumble remains quick fodder language |
| Bronto Burt | wave flight and short dive | Airborne until staggered; no copy ability |
| Hot Head | inhale then fire breath | grants Fire Ability Star under copy rules |
| Sir Kibble | outbound/returning cutter and catch | grants Cutter; blade remains an interceptable projectile |
| Sparky | roots and charges before radial burst | grants Spark; charge can be interrupted |
| Rocky | hop, shadow, stone drop | grants Stone; invulnerability has a fixed end |
| Wheelie | acceleration lane, brake turn and overrun tell | grants Wheel; cannot pivot instantly |
| Bonkers | hammer anticipation and coconut/landing mix | miniboss sheds Hammer Star only during vulnerability |
| Whispy Woods | fixed giant with face/crown hit zones, apple drops and gust | cannot be inhaled; apples can become Star Shots |
| Paint Roller | draws hazards that animate into the lane | painting is telegraphed and targetable/interceptable where declared |
| Kracko | vertical lanes, rain/bolt marks and eye recovery | phase change alters altitude; stagger opens a grounded damage window |
| Meta-Knights | distinct weapon silhouettes and formation entry | each grants its declared Ability Star; readability beats mob count |
| Meta Knight boss | guarded duel, cape reposition, sword wave, offered-Sword rule | control builds duel stagger; victory includes mask break/retreat beat |
| King Dedede boss | hammer, inhale, super jump and exhausted recovery | narrative fight uses boss stats; playable record remains separate |
| Nightmare Orb/Wizard | pursuit phase then cloak/body vulnerability cycle | two forms are separate phase records; Star Rod is encounter-granted, not pull-required |

## 10. Data/state primitives this roster requires

Implement these in dependency order instead of adding one-off character code:

1. animation markers (`windup`, `projectileSpawn`, `hit`, `land`, `recover`);
2. airborne arcs, shadows, hover/float and ground-hazard clearance;
3. persistent secondary actors (shells, eggs, bombs, cutters, Mechakoopas);
4. grab/pull/store/release eligibility for tongue and inhale;
5. actor substates with bounded exits (`shell`, `stone`, `guard`, `vanish`);
6. ability-profile swap for Kirby Copy;
7. summon/companion anchors for Luma and later partners;
8. scale/camera/collision treatment for giant transformations;
9. deterministic AI predicates and fallbacks for every conditional skill;
10. replayable event logs that name state transitions, not just damage.

No state can depend on an animation finishing successfully. The simulation owns
time and state; rendering consumes markers and can recover after a dropped frame.

## 11. Acceptance scenarios

Before Mario Archive A is approved:

- Mario stomps three Goombas at normal strip height and all flatten on contact;
- Luigi and Mario jump side by side and are distinguishable with silhouettes
  and sound muted;
- an enemy Koopa enters a shell, Mario kicks it, it hits two enemies and either
  exits or re-emerges according to the encounter record;
- Peach floats over a low hazard without remaining permanently untargetable;
- Bowser's flame damage aligns with visible breath ticks;
- Yoshi swallows one legal fodder, makes an egg, and uses the non-swallow boss
  fallback in the same deterministic test;
- Classic Mario and Mario 64 cannot deploy together, but both cards and kits
  remain independently owned and inspectable.

Before Kirby's Adventure is approved:

- Kirby inhales a projectile, a fodder enemy, an ineligible elite and a boss,
  producing four correct distinct outcomes;
- Copy swaps among Fire, Cutter and Sword with visible hats and no stuck state;
- returning Cutter can miss its catch after control and the passive responds;
- Wheelie can collide/turn without leaving the strip;
- Meta Knight counter has hit and no-hit fallbacks;
- Dedede cannot swallow a boss or stall forever in inhale;
- Star Rod transformation ends cleanly at 15 s and respects a boss phase floor.

All scenarios run headless from seeded simulation events and receive a visual
capture pass on the M2 Mac at the real strip size. Passing only one side is not
enough: simulation proves rules; the capture proves character feel.
