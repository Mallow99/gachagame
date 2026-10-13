# Mario and Kirby Archive expansion

Status: **regional breadth baseline v1, 2026-10-13**

This packet corrects an earlier production-priority mistake. The next roster
work deepens Mushroom Kingdom and Dream Land rather than moving immediately to
Mega Man. Plan `15` remains valid future content, but this packet comes first.

The goal is not an enormous preview catalog. It is two early regional Archives
with enough released, mechanically distinct fighters that twenty pulls begin a
collection instead of nearly completing one.

## 1. Early-pool breadth rule

**LOCKED:** a finished regional Archive accepts its first Fighter pull only
when it contains at least:

| Archive | Normal-banner floor | R | SR | SSR | Separate Mythic candidates |
| --- | ---: | ---: | ---: | ---: | ---: |
| Mushroom Kingdom | 22 | 10 | 7 | 5 | Fury Bowser |
| Dream Land | 20 | 8 | 7 | 5 | Star Rod Kirby, Hypernova Kirby |

The floor counts only production-ready fighters with a complete battle actor,
card and kit. Advertised silhouettes and unreleased candidates do not count.
UR fighters remain on the Mythic page and do not pad the ordinary Archive. A
labeled engine preview may run non-spendable test pulls or the compact SMB1
Spotlight earlier, but it cannot call a sub-floor regional Archive finished.

At the common 80% R / 17% SR / 3% SSR rates, a 100,000-account seeded baseline
with equal within-rarity weights and each ten-pull's SR floor produced a mean
12.29 and median 12 Mushroom fighters owned after twenty pulls, including the
four free R starters; its 10th–90th-percentile band was 11–14. The comparable
Dream Land baseline produced mean 10.58, median 11 and a 9–12 band. Exact focus
weights and the beginner owned-safe SR can move these values, so the production
simulator reruns the distribution and enforces the 75% median ceiling.

The pool continues growing before renewable income catches it:

| Checkpoint | Mushroom normal pool | Dream Land normal pool | Baseline median owned |
| --- | ---: | ---: | --- |
| first Archive pull | 22 | 20 | measured after pull 20: 12 / 11 |
| before regional pull 40 | at least 28 | at least 26 | measured after pull 40: 16 / 15 |
| before a third Hub roster | full 32 | full 29 | rerun with final focus weights |

The 40-pull baseline used 10/10/8 Mushroom and 9/9/8 Dream Land rarity counts;
its 90th-percentile ownership was 18/28 and 17/26. These are release gates, not
an instruction to withhold already finished fighters.

This is a minimum, not a target to freeze forever. The complete rosters after
this packet are:

| Hub | Existing detailed | Added here | Total | Normal / UR |
| --- | ---: | ---: | ---: | ---: |
| Mushroom Kingdom | 18 | 15 | 33 | 32 / 1 |
| Dream Land | 12 | 19 | 31 | 29 / 2 |

No post-beginner system guarantees a new fighter every ten-pull. Duplicates
retain star/Echo value, while focus shelves and selectors solve dilution after
an Archive exceeds 18 fighters. This preserves collection runway without making
the owner feel that every duplicate is a dead result.

## 2. Fighter iteration and form rule

An ordinary temporary power-up remains a Power-Up. A form or era becomes a
separate fighter only when it passes all five checks:

1. its silhouette or equipment is identifiable before effects play;
2. it owns a different basic, skill, passive and ultimate;
3. its movement/state grammar differs in battle;
4. it can sustain a full actor sheet rather than one transformation cut-in;
5. family lock creates a meaningful choice against other versions.

Fire Mario normally fails; a Fire Flower can modify several Mario iterations.
Tanooki Mario passes through flight, tail combat and statue state. Cappy Mario
passes through cap travel, bounce and bounded capture. Kirby's ordinary Copy
Abilities remain swappable profiles, while a Super Ability passes only when it
supports a full oversized moveset. Every Mario form uses `familyId: mario` and
every Kirby form uses `familyId: kirby`; variants enlarge choice, not party size.

## 3. Mushroom Kingdom release shelves

### Opening Archive floor — live when the Archive accepts its first pull

| R | SR | SSR |
| --- | --- | --- |
| Classic Mario, Classic Luigi, Toad, Peach, Koopa Troopa, Daisy, Captain Toad, Dry Bones, Birdo, Shy Guy | Hammer Bro, Yoshi, Bowser Jr., Dr. Mario, Builder Mario, Kamek, Tanooki Mario | Bowser, Mario 64, Cappy Mario, Dry Bowser, Poltergust Luigi |

The four classic heroes remain free. The other eighteen records supply enough
breadth for the first Archive. If asset review blocks one, another approved
fighter of the same rarity must replace it before the first Archive pull;
an empty silhouette does not satisfy the floor.

### Mushroom breadth shelf — parallel follow-up before any third Hub

Wario, Waluigi, Nabbit, Swordfighter Peach, Wiggler, Paper Mario, Sunshine
Mario, Rosalina, King Boo and Petey Piranha join through permanent Archive focus
shelves. Fury Bowser becomes the first Mario Mythic after the one-slot test is
implemented. This order may follow asset readiness, but Mega Man production
does not jump ahead of the shelf as a whole.

## 4. New Mushroom Kingdom fighter cards

All stats are displayed Training Rank 1, zero-star values after rarity. All
ultimate values are Technique Mastery 1 and obey the common value protocol.

### Captain Toad — No-Jump Pathfinder · R

**Source:** *Captain Toad: Treasure Tracker*. **Family:** `toad`.
**Role:** Vanguard / Lob, front. **Stats:** HP 1,180; ATK 82; Guard 60;
Move 92; Haste -2%; Crit 5%.

- **Basic — Turnip Toss:** pulls and lobs a turnip for 0.90× plus 0.25× splash.
- **Skill — Pickaxe Sprint, 10 s:** equips the pickaxe for three 0.65× contacts
  while marching through the front line; he cannot jump over hazards.
- **Passive — Heavy Pack:** gains 15 Guard against frontal hits and reveals one
  hidden pickup/target each wave. Launch effects move him farther, not higher.
- **Ultimate — Power Star Expedition:** the headlamp Marks enemies, a minecart
  crosses twice for 1.40× each and Captain Toad finishes with a 2.40× pickaxe
  strike. Focused total: **5.20×**.
- **Reveal/feel:** headlamp searches darkness before the backpack silhouette;
  quote “Adventure is this way!” He waddles, braces under the pack and never
  borrows Mario's jump arc.

### Dry Bones — Reassembling Regular · R

**Source:** *Super Mario World* visual base with later reassembly behavior.
**Family:** `dry-bones`. **Role:** Vanguard / Lob, front. **Stats:** HP 1,050;
ATK 82; Guard 58; Move 104; Haste 0%; Crit 6%.

- **Basic — Bone Return:** throws a bone for 0.85× outward and 0.25× returning.
- **Skill — Rib-Roll, 10 s:** collapses under one incoming hit, then rolls as a
  pile through the nearest target for 1.75× before rebuilding.
- **Passive — Pull Yourself Together:** once per wave at 25% HP, collapses for
  1.5 s, becomes untargetable and rebuilds with a 15% max-HP heal. A visible
  bone pile and timer prevent the state from reading as a vanished actor.
- **Ultimate — Fossil Frenzy:** bone rings strike five times for 0.85× before a
  1.25× reassembly kick. Focused total: **5.50×**.
- **Reveal/feel:** pieces clatter into silhouette; quote is a jaw-click rhythm.
  Every collapse preserves bone positions and reforms from the floor outward.

### Birdo — Egg-Line Headliner · R

**Source:** *Super Mario Bros. 2*. **Family:** `birdo`. **Role:** Artillery /
Shot, back. **Stats:** HP 860; ATK 108; Guard 28; Move 114; Haste 2%; Crit 9%.

- **Basic — Egg Shot:** inhales, then fires a 1.00× egg that can be intercepted.
- **Skill — Catch and Return, 10 s:** catches one weak frontal projectile and
  returns it at 180% power; the no-projectile fallback fires a 1.45× giant egg.
- **Passive — Egg Chain:** every third basic leaves a bouncing shell fragment
  that deals 0.35× to the next enemy crossing it.
- **Ultimate — Egg Parade:** five 0.90× eggs bounce through alternating heights
  before a 1.00× heart-burst finisher. Focused total: **5.50×**.
- **Reveal/feel:** an egg cracks into the card and the bow appears last; quote
  “Ready for an encore?” Mouth recoil precedes every projectile.

### Shy Guy — Mask-Line Courier · R

**Source:** *Super Mario Bros. 2* with movement references from *Yoshi's
Island*. **Family:** `shy-guy`. **Role:** Striker / Charge, front/either.
**Stats:** HP 830; ATK 110; Guard 26; Move 134; Haste 5%; Crit 10%.

- **Basic — Turnip Tackle:** carries a turnip into a 1.05× shoulder charge.
- **Skill — Fly Guy Relay, 9 s:** a Fly Guy lifts him over the front target;
  the carried turnip drops for 1.65× splash before he lands behind the line.
- **Passive — Mask Courage:** below 50% HP, gains 12% Haste and 10 Guard for
  6 s, once per wave. The mask shakes before the burst of courage.
- **Ultimate — Masked Stampede:** five Shy Guy runners cross for 0.90× each and
  the owner finishes with a 1.00× giant turnip. Focused total: **5.50×**.
- **Reveal/feel:** masks light one by one; quote “...” followed by a rally
  whistle. Helpers are real crossing actors, not red afterimages.

### Wiggler — Very Bad Mood · R

**Source:** *Super Mario World*. **Family:** `wiggler`. **Role:** Bruiser /
Combo, front. **Stats:** HP 1,120; ATK 95; Guard 44; Move 120; Haste 1%; Crit 7%.

- **Basic — Four-Step March:** four body contacts at 0.30× each.
- **Skill — Garden Crossing, 11 s:** stretches across the lane for 1.80× and
  moves Small enemies to the far side.
- **Passive — Temper:** the first Heavy hit or Stomp each wave turns Wiggler
  red for 8 s, granting 20% ATK and Haste. Antennae, face and gait all change.
- **Ultimate — Angry Orchard:** makes four 1.10× red passes and finishes with a
  1.60× body drop. Focused total: **6.00×**.
- **Reveal/feel:** flower falls from the head before the card flashes red;
  quote “Now you've done it!” Calm and angry locomotion use separate timings.

### Dr. Mario — Capsule-Room Clinician · SR

**Source:** *Dr. Mario*. **Family:** `mario`. **Role:** Support / Shot, either.
**Stats:** HP 1,035; ATK 110; Guard 40; Move 112; Haste 2%; Crit 8%.

- **Basic — Megavitamin Pair:** two capsule halves hit for 0.55× each and add
  one Dose, up to three, to the primary enemy.
- **Skill — Correct Prescription, 10 s:** three Doses burst for 2.20× and Guard
  Break; with fewer Doses, he instead heals the weakest ally for 100% ATK and
  adds the missing Doses to his next target.
- **Passive — Triage Order:** healing an ally below 35% HP advances that ally's
  skill by 1.5 s, once per ally per wave.
- **Ultimate — Megavitamin Sweep:** seven capsules strike for 0.80× each, then
  the party receives a 120% ATK heal and one-condition cleanse. Focused damage:
  **5.60×**, with support value above the SR floor.
- **Reveal/feel:** virus silhouettes align and disappear before the coat reveal;
  quote “Let's clear this up.” Capsules rotate and obey collision lanes.

### Builder Mario — Course-Maker Foreman · SR

**Source:** *Super Mario Maker 2*. **Family:** `mario`. **Role:** Bruiser /
Strike, front. **Stats:** HP 1,185; ATK 124; Guard 50; Move 112; Haste 0%;
Crit 8%.

- **Basic — Builder Hammer:** a deliberate 1.25× overhead Strike.
- **Skill — Hard Block, 10 s:** places one destructible party-side block, then
  knocks it forward for 1.60× when it expires or a second block would be made.
- **Passive — Salvage:** a destroyed block reduces the next skill cooldown by
  2 s and grants 12 Guard for 4 s; only Builder-created blocks qualify.
- **Ultimate — Course Maker:** three marked blocks fall for 1.20× each before a
  3.40× hammer launch sends the center block through the line. Focused total:
  **7.00×**, plus temporary cover.
- **Reveal/feel:** graph paper becomes a playable course; quote “Let's build!”
  Blocks occupy space, cast shadows and break into authored pieces.

### Kamek — Stage-Rewriting Magikoopa · SR

**Source:** *Yoshi's Island*. **Family:** `kamek`. **Role:** Controller / Lob,
back. **Stats:** HP 978; ATK 118; Guard 32; Move 118; Haste 4%; Crit 10%.

- **Basic — Shape Magic:** a circle, square or triangle bolt deals 0.95× and
  uses a visibly matching projectile.
- **Skill — Make It Bigger, 12 s:** enlarges the highest-ATK ally for 6 s,
  granting 20% ATK and reach but not collision invulnerability.
- **Passive — Wand Hex:** every third basic Marks the target for two allied
  hits at +18% damage.
- **Ultimate — Magikoopa Rewrite:** four transformed blocks crash for 1.20×,
  then a 2.00× wand burst briefly turns eligible Small enemies into harmless
  shapes. Focused total: **6.80×**; bosses receive 50 stagger instead.
- **Reveal/feel:** colored geometry redraws the frame; quote “A little editing!”
  The broom has acceleration and every transformed object remains targetable.

### Tanooki Mario — P-Meter Trickster · SR

**Source:** *Super Mario Bros. 3*. **Family:** `mario`. **Role:** Striker /
Combo, front/either. **Stats:** HP 1,093; ATK 130; Guard 42; Move 132;
Haste 5%; Crit 11%.

- **Basic — Tail Turn:** two 0.55× tail hits can reflect one weak projectile.
- **Skill — P-Meter Flight, 9 s:** runs to speed, takes off through the line for
  2.10× and remains Airborne for 3 s before a readable descent.
- **Passive — Statue Drop:** once per skill cycle, a Heavy incoming hit during
  descent turns him to stone, reducing it 60% and dealing 0.70× on landing.
- **Ultimate — Sky-to-Statue:** five 0.90× flight contacts end in a 3.10× statue
  impact and 45 stagger. Focused total: **7.60×**.
- **Reveal/feel:** the P-meter fills across black; quote “Full speed!” Tail,
  flight and statue require separate silhouettes—not a brown Mario tint.

### Nabbit — Everything-in-the-Bag Bandit · SR

**Source:** *New Super Luigi U*. **Family:** `nabbit`. **Role:** Striker /
Charge, either. **Stats:** HP 966; ATK 135; Guard 28; Move 150; Haste 7%;
Crit 14%.

- **Basic — Sack Swipe:** a 1.15× running swipe that preserves momentum.
- **Skill — Grab and Go, 8 s:** steals one weak projectile or loose secondary
  actor, then charges its owner for 2.00×; empty-field fallback steals 10 energy
  from the target and deals 1.55×.
- **Passive — Can't Catch Me:** after using the skill, gains 25% dodge during
  movement for 3 s. He is not permanently contact-immune.
- **Ultimate — Great Escape:** six 0.90× cross-field swipes end in a 2.00× sack
  burst. Focused total: **7.40×**.
- **Reveal/feel:** the sack passes first and ears follow; quote “Catch me!”
  Stolen objects remain visibly inside or attached to the sack until released.

### Swordfighter Peach — Theater's First Blade · SR

**Source:** *Princess Peach: Showtime!*. **Family:** `peach`. **Role:** Striker /
Combo, front. **Stats:** HP 1,047; ATK 128; Guard 38; Move 130; Haste 5%;
Crit 13%.

- **Basic — Ribbon Foil:** three fencing contacts at 0.42× each.
- **Skill — Spotlight Parry, 9 s:** holds a 0.7 s counter and answers a hit for
  2.10×; the no-hit fallback advances with a 1.10× lunge.
- **Passive — Perfect Cue:** a successful counter grants the party 12% Crit for
  4 s, once per skill cycle.
- **Ultimate — Showtime Finale:** six 0.90× dashes surround the target before a
  2.40× rose-cut finisher. Focused total: **7.80×**.
- **Reveal/feel:** theater curtains and ribbon become the rapier line; quote
  “My stage, my rules.” This actor fences and pivots—she never uses base
  Peach's float/turnip cycle.

### Cappy Mario — Odyssey's Capture Artist · SSR

**Source:** *Super Mario Odyssey*. **Family:** `mario`. **Role:** Striker /
Shot, either. **Stats:** HP 1,304; ATK 164; Guard 38; Move 146; Haste 7%;
Crit 14%.

- **Basic — Cap Return:** Cappy deals 0.82× outward and 0.48× returning; a
  clean catch shortens the next basic interval 8%.
- **Skill — Cap Bounce, 9 s:** leaves Cappy as a 1.2 s platform, dives through
  the priority target for 2.35× and lands at a safe anchor. Interruption can
  forfeit the catch bonus but never strands the cap.
- **Passive — Capture Window:** enemies may declare `capturableEchoId`. Hitting
  a staggered eligible target stores one bounded signature action for 8 s;
  bosses instead yield a Capture Spark granting 20% damage/stagger to the next
  skill. Mario never permanently steals a boss body or full enemy stat block.
- **Ultimate — Odyssey Tour:** six 1.00× cap/capture contacts circle the field
  before a 4.00× Moon dive. Focused total: **10.00×**.
- **Reveal/feel:** globe route, ship sail and Cappy eyes emerge in stages;
  quote “Cappy, let's go!” The cap is a persistent outbound/returning actor,
  and captures visibly borrow a silhouette rather than recoloring Mario.

### Dry Bowser — Blue-Flame Remnant · SSR

**Source:** *New Super Mario Bros.* era. **Family:** `bowser`. **Role:**
Vanguard / Beam, front. **Stats:** HP 1,780; ATK 156; Guard 82; Move 104;
Haste -1%; Crit 8%.

- **Basic — Bone King Claw:** two skeletal swipes at 0.70× each.
- **Skill — Blue-Flame Rake, 11 s:** five 0.42× Beam ticks apply Burn and Guard
  Break; the jaw opens before ignition.
- **Passive — Still Standing:** once per encounter at lethal damage, collapses
  for 2 s and rebuilds at 25% HP, permanently losing 25 Guard. Phase damage and
  a visible bone counter prevent repeated or ambiguous revives.
- **Ultimate — Skeletal Siege:** a 2.50× bone rain, six 0.85× blue-flame ticks
  and a 2.90× reassembly slam total **10.50×**, plus Burn.
- **Reveal/feel:** blue flame illuminates bones one piece at a time; quote is a
  dry roar. Gaps between bones, jaw recoil and collapse matter more than glow.

### Poltergust Luigi — Last Resort Ghost Hunter · SSR

**Source:** *Luigi's Mansion 3*. **Family:** `luigi`. **Role:** Controller /
Charge, either. **Stats:** HP 1,394; ATK 144; Guard 50; Move 126; Haste 4%;
Crit 10%.

- **Basic — Suction Shot:** plunger hits for 0.95× and pulls light targets into
  a 0.35× vacuum contact.
- **Skill — Slam Cycle, 10 s:** Strobulb exposes the target, then Poltergust
  pulls and slams eligible enemies twice for 1.20× each. Bosses stay in place
  and receive the damage plus 35 stagger.
- **Passive — Gooigi Backup:** once per wave below 40% HP, Gooigi appears for
  6 s as a 120% ATK decoy shield and mirrors one basic at 50% power. Water or
  Fire removes him early with a readable dissolve.
- **Ultimate — Hotel Cleanup:** Strobulb deals 1.50×, six suction ticks deal
  0.55× each and three alternating slams deal 1.55× each. Focused total:
  **9.45×**, plus grouping and stagger.
- **Reveal/feel:** flashlight cone finds Luigi before the ghost silhouettes;
  quote “O-okay... here we go!” Hose tension, vacuum direction and terrified
  footwork make this different from high-jump Luigi.

### Petey Piranha — Polluted-Garden Terror · SSR

**Source:** *Super Mario Sunshine*. **Family:** `petey-piranha`. **Role:**
Vanguard / Lob, front. **Stats:** HP 1,904; ATK 142; Guard 62; Move 90;
Haste -2%; Crit 6%.

- **Basic — Petal Headbutt:** a 1.35× heavy Strike with wide recoil.
- **Skill — Goop Gale, 12 s:** inhales, then sprays a lane for 1.80× and leaves
  a five-second puddle dealing up to 1.00×. Water effects clear the puddle.
- **Passive — Rooted Appetite:** while grounded, gains 20 Guard and cannot be
  displaced by ordinary wind. Water/Ice removes the bonus for 4 s and opens
  the mouth for bonus stagger.
- **Ultimate — Sunshine Rampage:** wing gusts hit four times for 0.70×, a goop
  wave deals 2.20× and two body slams deal 2.50× each. Focused total: **10.00×**.
- **Reveal/feel:** polluted petals unfold around the mouth; quote is a bellow.
  Flight is labored, belly weight leads landings and goop persists physically.

## 5. Dream Land release shelves

### Dream Land opening floor — live when the Archive accepts its first pull

| R | SR | SSR |
| --- | --- | --- |
| Kirby, Parasol Waddle Dee, Poppy Bros. Jr., Bandana Waddle Dee, Knuckle Joe, Blade Knight, Chilly, Bio Spark | Sir Kibble, Hot Head, Wheelie, Sparky, Rocky, Bonkers, Gooey | Meta Knight, King Dedede, Daroach, Magolor, Ultra Sword Kirby |

Kirby is the story grant. The World Spotlight may focus source-appropriate
fighters, while the Archive contains this broader release-ready shelf.

### Dream Land breadth shelf

Broom Hatter, Chef Kawasaki, Taranza, Marx, Dark Meta Knight and all five Super
Ability Kirby forms join next. Star Rod Kirby remains tied to the Nightmare
finale; Hypernova Kirby may enter the Mythic rotation once its model-derived
actor and giant suction states pass review. Neither requires waiting for a
fifth franchise.

## 6. New Dream Land fighter cards

### Bandana Waddle Dee — Spear-Line Loyalist · R

**Source:** *Kirby's Return to Dream Land*. **Family:** `bandana-waddle-dee`.
**Role:** Striker / Combo, front. **Stats:** HP 930; ATK 105; Guard 34;
Move 128; Haste 4%; Crit 10%.

- **Basic — Spear Thrusts:** three 0.40× contacts with a short step between hits.
- **Skill — Waddle Copter, 9 s:** spins upward through the target for 1.80× and
  clears one low hazard before descending.
- **Passive — Loyal Guard:** intercepting a hit aimed at an ally below 35% HP
  grants 20 Guard for 4 s, once per ally each wave.
- **Ultimate — Spear Barrage:** six 0.70× thrust/throws end in a 1.20× downward
  spear. Focused total: **5.40×**.
- **Reveal/feel:** spear plants before the bandana ties itself; quote “Wanya!”
  The weapon remains gripped or visibly thrown—never an unattached effect.

### Knuckle Joe — Rising-Break Rookie · R

**Source:** *Kirby Super Star*. **Family:** `knuckle-joe`. **Role:** Striker /
Combo, front. **Stats:** HP 880; ATK 110; Guard 28; Move 135; Haste 5%; Crit 12%.

- **Basic — Vulcan Jab:** four 0.30× punches at close range.
- **Skill — Rising Break, 9 s:** uppercuts for 1.70× and follows Airborne
  targets into one 0.45× kick.
- **Passive — Fighting Spirit:** completing every basic hit grants 4 energy;
  whiffed or interrupted strings grant none.
- **Ultimate — Smash Combination:** six 0.70× rush contacts finish with a
  1.30× Smash Punch. Focused total: **5.50×**.
- **Reveal/feel:** wrapped fist breaks the panel; quote “Come on!” Feet plant,
  hips turn and hit-stop sells contact instead of projectile-shaped punches.

### Blade Knight — Patient Edge Guard · R

**Source:** *Kirby's Adventure*. **Family:** `blade-knight`. **Role:** Vanguard /
Strike, front. **Stats:** HP 1,080; ATK 96; Guard 52; Move 112; Haste 0%;
Crit 8%.

- **Basic — Short Sword:** a 1.05× measured Strike.
- **Skill — Upper Cutter, 10 s:** blocks during a 0.5 s windup, then rises for
  2.00×. A blocked hit adds 20 stagger to the answer.
- **Passive — Helmet Line:** frontal Projectile damage is reduced 20% while not
  recovering from a swing.
- **Ultimate — Sword Formation:** five 0.85× ally-blade crossings end in a
  1.00× owner slash. Focused total: **5.25×**.
- **Reveal/feel:** eye slit opens under a descending helmet; quote “Hold the
  line.” Shielding posture and exposed recovery are distinct states.

### Chilly — Snow-Cap Stopper · R

**Source:** *Kirby's Adventure*. **Family:** `chilly`. **Role:** Controller /
Beam, front/either. **Stats:** HP 1,040; ATK 88; Guard 48; Move 104; Haste 0%;
Crit 6%.

- **Basic — Cold Breath:** four 0.22× ticks apply 10% Slow for 2 s.
- **Skill — Ice Guard, 11 s:** gains a 90% ATK shield, then bursts for 1.20×
  when it breaks or expires.
- **Passive — Snow-Cap:** hitting the same target with eight breath ticks makes
  its next action 20% slower; bosses receive 15 stagger instead of Freeze.
- **Ultimate — Whiteout Waltz:** eight 0.50× ice pulses and a 1.00× body burst
  total **5.00×**, applying 35% Slow for 4 s.
- **Reveal/feel:** frost reveals the face from inside outward; quote “Brrr!”
  Breath, shield and melt states use different edges and shadows.

### Bio Spark — Hidden-Leaf Infiltrator · R

**Source:** *Kirby Super Star*. **Family:** `bio-spark`. **Role:** Striker /
Shot, either. **Stats:** HP 820; ATK 112; Guard 24; Move 145; Haste 6%; Crit 14%.

- **Basic — Kunai Fan:** two 0.48× thrown blades favor separate targets.
- **Skill — Vanish Slash, 9 s:** disappears for 0.7 s, crosses the backmost
  target for 1.90× and returns to the nearest safe band.
- **Passive — Smoke Exit:** leaving untargetable state grants 20% Crit to the
  next hit; periodic damage still resolves and cannot be cleansed by vanishing.
- **Ultimate — Ninja Downpour:** eight 0.55× kunai hits end in a 1.00× crossing
  slash. Focused total: **5.40×**.
- **Reveal/feel:** leaf and smoke obscure the card for one beat; quote “Gone.”
  Entry/exit puffs identify location so vanish never reads as teleport damage.

### Broom Hatter — Dream Land Caretaker · R

**Source:** *Kirby's Dream Land 3*. **Family:** `broom-hatter`. **Role:** Support /
Combo, either. **Stats:** HP 920; ATK 80; Guard 34; Move 120; Haste 5%; Crit 7%.

- **Basic — Tidy Sweep:** three 0.40× broom contacts lightly push Small enemies.
- **Skill — Clean Path, 10 s:** sweeps through allies, cleansing Burn/Slow and
  healing each for 80% ATK; unhurt allies receive a 40% ATK shield instead.
- **Passive — Dustpan Find:** the first expired hazard each wave drops a snack
  that heals the weakest ally for 35% ATK.
- **Ultimate — Spring Cleaning:** a 2.50× enemy-field sweep, 180% party heal,
  100% party shield and one-condition cleanse. Its realized support value must
  clear the R floor in the emergency fixture.
- **Reveal/feel:** dust clears to a spotless card; quote is a cheerful hum.
  Dirt/hazards visibly move toward the broom rather than simply disappearing.

### Gooey — Mock-Matter Friend · SR

**Source:** *Kirby's Dream Land 3*. **Family:** `gooey`. **Role:** Controller /
Strike, either. **Stats:** HP 1,047; ATK 118; Guard 38; Move 125; Haste 4%;
Crit 9%.

- **Basic — Tongue Snap:** extends for 1.00× and pulls eligible Small targets.
- **Skill — Mock Copy, 12 s:** repeats the last Copy-tag allied skill at 75%
  coefficient. With no legal record, fires three 0.65× Dark Orbs.
- **Passive — Elastic Friend:** displacement stretches Gooey instead of
  interrupting once every 8 s; the body then snaps to the legal anchor.
- **Ultimate — Dark-Matter Pretend:** a six-hit 0.80× eye laser ends in a 2.00×
  tongue-launched star. Focused total: **6.80×**.
- **Reveal/feel:** tongue licks color onto the silhouette; quote “Goo!” Body
  deformation, eye shape and tongue anchor must remain readable at strip size.

### Chef Kawasaki — Festival Cook · SR

**Source:** *Kirby Super Star*. **Family:** `chef-kawasaki`. **Role:** Support /
Strike, front/either. **Stats:** HP 1,265; ATK 100; Guard 55; Move 100;
Haste -1%; Crit 5%.

- **Basic — Ladle Check:** a 1.15× pan/ladle Strike.
- **Skill — Supper Pot, 12 s:** pulls eligible loose projectiles/food into the
  pot, dealing 1.40× to nearby enemies and healing the party for 110% ATK.
- **Passive — Snack Service:** every third wave drops two visible food pickups;
  AI routes them to the lowest-HP allies rather than adding inventory items.
- **Ultimate — Cook Festival:** the pot pulses six times for 0.75×, then feeds
  the party for a 180% heal and 100% shield. Focused damage: **4.50×**, with
  emergency support value above the SR floor.
- **Reveal/feel:** ingredients orbit the black pot before the lid pops; quote
  “Dinner's ready!” Targets circle into the pot and food travels to allies.

### Taranza — Royal-Web Puppeteer · SR

**Source:** *Kirby: Triple Deluxe*. **Family:** `taranza`. **Role:** Controller /
Shot, back. **Stats:** HP 989; ATK 125; Guard 30; Move 122; Haste 4%; Crit 11%.

- **Basic — Web Orb:** a 0.90× Shot applies 10% Slow for 2 s.
- **Skill — Silken Snare, 11 s:** cocoons eligible Small enemies for 2 s and
  deals 1.60×; elites/bosses receive 40 stagger and 25% Slow instead.
- **Passive — Six-Handed Focus:** while no enemy is within 100 px, gains 15%
  projectile speed and 10% Haste. Closing enemies visibly breaks the stance.
- **Ultimate — Dreamstalk Web:** six 0.80× web lances converge into a 2.00×
  magic blossom. Focused total: **6.80×**, plus the legal control fallback.
- **Reveal/feel:** puppet strings lower the frame; quote “Her Majesty watches.”
  Hands cast distinct threads and his float has no ground-walk fallback.

### Daroach — Squeak-Squad Master · SSR

**Source:** *Kirby: Squeak Squad*. **Family:** `daroach`. **Role:** Striker /
Shot, either. **Stats:** HP 1,256; ATK 158; Guard 34; Move 145; Haste 8%;
Crit 15%.

- **Basic — Triple Star:** three 0.44× star bolts fan toward priority targets.
- **Skill — Ice Bomb Heist, 10 s:** teleports to a marked safe point and leaves
  a bomb that bursts for 2.20× plus Slow. The destination is shown before exit.
- **Passive — Treasure Sense:** chest/coin enemies begin Marked; defeating one
  advances his skill 3 s but does not multiply account rewards.
- **Ultimate — Squeak Raid:** eight 0.85× Squeak/projectile hits finish with a
  2.80× Triple Star laser. Focused total: **9.60×**.
- **Reveal/feel:** treasure chest snaps shut, then cape and hat emerge; quote
  “The prize is mine.” Bombs, wand and teleport tells remain separate.

### Marx — Wish-Twisting Jester · SSR

**Source:** *Kirby Super Star*. **Family:** `marx`. **Role:** Artillery / Beam,
back. **Stats:** HP 1,325; ATK 160; Guard 30; Move 140; Haste 7%; Crit 14%.

- **Basic — Crescent Cutter:** two arcing 0.62× blades cross at the target.
- **Skill — Black-Hole Prank, 12 s:** opens a 1.2 s pull zone, then bursts for
  2.30×. Bosses ignore displacement but take 35 stagger.
- **Passive — Split Smile:** every fourth basic splits into two half-damage
  angles; a lone boss receives both only when both paths visibly intersect.
- **Ultimate — Nova Betrayal:** thorn seeds, cutters and laser contacts total
  **9.60×**, ending in a bounded black-hole pull rather than an instant kill.
- **Reveal/feel:** harmless ball silhouette tears into wings and grin; quote
  “Just one little wish!” Movement flips between bouncing and true flight.

### Magolor — Another-Dimension Wayfarer · SSR

**Source:** *Kirby's Return to Dream Land Deluxe*. **Family:** `magolor`.
**Role:** Controller / Lob, back. **Stats:** HP 1,394; ATK 151; Guard 42;
Move 126; Haste 5%; Crit 12%.

- **Basic — Magic Spheres:** two 0.60× curving orbs seek separate targets.
- **Skill — Dimensional Rift, 11 s:** opens paired portals; three 0.80× bolts
  enter one and exit behind the priority target. Portals remain visible actors.
- **Passive — Magic Barrier:** every 12 s, a 55% ATK shield blocks one hit and
  converts its break into 8 energy.
- **Ultimate — Master Crown Echo:** six 0.95× spheres, a 1.50× rift collapse and
  a 2.00× beam total **9.20×**. It references the Crown without granting the
  permanent corrupted boss form.
- **Reveal/feel:** Lor Starcutter outline opens a portal; quote “A deal's a
  deal!” Hands, ears and portal orientation sell every cast.

### Dark Meta Knight — Mirror-World Rival · SSR

**Source:** *Kirby & the Amazing Mirror*. **Family:** `dark-meta-knight`.
**Role:** Striker / Combo, front/either. **Stats:** HP 1,284; ATK 166;
Guard 38; Move 142; Haste 6%; Crit 15%.

- **Basic — Mirror Galaxia:** three 0.40× cuts leave a delayed 0.20× reflection.
- **Skill — Reflection Break, 10 s:** creates a mirror clone that crosses from
  the opposite side; owner and clone deal 1.20× each.
- **Passive — Dark Reflection:** intercepts one weak projectile every 10 s and
  sends a 65%-power mirrored copy toward its source.
- **Ultimate — Dimensional Mirror:** eight paired-angle 0.95× contacts and a
  2.80× shattering slash total **10.40×**.
- **Reveal/feel:** the card cracks before the masked reflection moves; quote
  “Face what follows you.” Clone hitboxes always correspond to visible copies.

### Ultra Sword Kirby — Super-Ability Cleaver · SSR

**Source:** *Kirby's Return to Dream Land*. **Family:** `kirby`. **Role:**
Bruiser / Strike, front. **Stats:** HP 1,373; ATK 164; Guard 48; Move 118;
Haste 1%; Crit 12%.

- **Basic — Ultra Edge:** a slow 1.40× sword sweep reaches through two targets.
- **Skill — Great Blade Change, 11 s:** cycles to cleaver/fanblade for a 3.00×
  marked arc. The weapon is chosen for target height, not random decoration.
- **Passive — Dimensional Cut:** breaking a shield, armor plate or destructible
  object grants 15% Haste for 5 s; ordinary fodder does not trigger it.
- **Ultimate — Ultra Sword Cataclysm:** three 2.00× enormous weapon cuts and a
  4.20× dimensional finisher total **10.20×**.
- **Reveal/feel:** the sword outgrows the card before Kirby appears; quote
  “Hii-yaa!” Each oversized blade has anticipation, contact and ground response.

### Monster Flame Kirby — Super-Ability Dragon · SSR

**Source:** *Kirby's Return to Dream Land*. **Family:** `kirby`. **Role:**
Artillery / Beam, either. **Stats:** HP 1,304; ATK 168; Guard 36; Move 126;
Haste 3%; Crit 11%.

- **Basic — Dragon Breath:** five 0.25× flame ticks and Burn.
- **Skill — Flame Dragon Run, 10 s:** a dragon head travels through the line for
  2.60× and leaves two 0.35× fire patches.
- **Passive — Scorch Trail:** Burning enemies lose 12 Guard against Monster
  Flame attacks; it does not create a global elemental reaction.
- **Ultimate — Monster Flame Eruption:** two circling dragons deal eight 0.90×
  hits before a 2.80× crossing explosion. Focused total: **10.00×**, plus Burn.
- **Reveal/feel:** dragon jaws close around the card; quote “Fwoosh!” The flame
  creature has a head, body path and exit instead of functioning as a red beam.

### Flare Beam Kirby — Super-Ability Conductor · SSR

**Source:** *Kirby's Return to Dream Land*. **Family:** `kirby`. **Role:**
Controller / Beam, either. **Stats:** HP 1,270; ATK 162; Guard 34; Move 130;
Haste 5%; Crit 12%.

- **Basic — Beam Whip:** four curved 0.34× contacts trace from Kirby to the
  target; the path can pass through one additional enemy at reduced power.
- **Skill — Orb Route, 11 s:** steers a visible energy sphere through three
  player-configured AI anchors for 0.80× each and 12 stagger per contact.
- **Passive — Conductor Loop:** touching three distinct enemies or boss zones
  with one action grants the next skill 20% radius and 15% Haste. A lone boss
  can satisfy it only through three declared target zones.
- **Ultimate — Flare Beam Constellation:** ten 0.78× routed contacts draw a
  star before a 2.40× center discharge. Focused total: **10.20×**, plus 45
  stagger.
- **Reveal/feel:** the controllable orb draws the card border in light; quote
  “Bzzzt!” The beam bends through actual anchors and never tracks as a generic
  homing projectile.

### Grand Hammer Kirby — Super-Ability Breaker · SSR

**Source:** *Kirby's Return to Dream Land*. **Family:** `kirby`. **Role:**
Bruiser / Strike, front. **Stats:** HP 1,587; ATK 170; Guard 62; Move 100;
Haste -2%; Crit 10%.

- **Basic — Grand Swing:** a slow 1.50× Strike with wide recoil and 8 stagger.
- **Skill — Triple Charge, 12 s:** charges through three visible sizes; AI
  releases early at 1.60× if interruption is imminent or fully at 3.20× and 35
  stagger when safe.
- **Passive — Unbudging Grip:** gains 25 Guard and 50% control resistance while
  charging, but an interrupted charge still spends half the cooldown.
- **Ultimate — Grand Hammer Fault:** three 2.25× crater hits lead into a 4.50×
  dimensional stake-breaker. Focused total: **11.25×**, plus 70 stagger.
- **Reveal/feel:** hammer heads grow through stone, metal and ornate forms;
  quote “Bonk!” Weight deforms the ground and recovery remains deliberately slow.

### Snow Bowl Kirby — Super-Ability Avalanche · SSR

**Source:** *Kirby's Return to Dream Land*. **Family:** `kirby`. **Role:**
Vanguard / Charge, front/either. **Stats:** HP 1,450; ATK 158; Guard 54;
Move 150; Haste 4%; Crit 11%.

- **Basic — Snow Roll:** curls into a 1.35× line Charge and uncurls at the first
  Heavy target or stage anchor.
- **Skill — Avalanche Bank, 10 s:** circles the outer band for 2.60×, gathering
  Small enemies and applying 25% Slow for 4 s when the snowball breaks.
- **Passive — Gathering Snow:** each uninterrupted rolling contact adds 8%
  size/damage, up to three; a wall, Stun or Heavy collision breaks the stack.
- **Ultimate — Snow Bowl Strike:** eight 1.00× rolling contacts end in a 2.50×
  giant snowburst. Focused total: **10.50×**, plus Slow and displacement.
- **Reveal/feel:** snowball rolls across and erases the card before Kirby pops
  out; quote “Wheee!” Rotation, acceleration, collected bodies and unroll point
  must all agree.

### Hypernova Kirby — Miracle-Fruit Devourer · UR

**Source:** *Kirby: Triple Deluxe*. **Family:** `kirby`. **Role:** Controller /
Beam-transform, either. **Stats:** HP 1,647; ATK 184; Guard 40; Move 130;
Haste 5%; Crit 12%.

- **Basic — Star Inhale:** pulls projectiles and eligible Small targets before
  firing a 1.40× piercing Star Shot; invalid targets take two 0.70× suction hits.
- **Skill — Miracle Pull, 10 s:** channels suction for five 0.42× ticks, moves
  secondary actors toward Kirby and deals 35 stagger to a boss that cannot move.
- **Passive — Bottomless Breath:** suction strength and cone width rise 20% for
  each distinct object inhaled that wave, capped at three. The bonus resets on
  wave transition and never consumes permanent inventory.
- **Ultimate — Hypernova Maw:** Miracle Fruit transforms Kirby for 14 s with
  **+70% ATK, +40% Haste, +50% suction width and 40% damage reduction while
  channeling**. Basics become five 0.55× vacuum ticks plus a 1.50× Star Shot;
  the skill creates a screen-spanning legal pull and 80 boss stagger. A 4.50×
  giant Star Shot ends the form. It targets **20–28 normal-action equivalents**
  and at least 2.5× normal active DPS without crowd credit.
- **Reveal/feel:** Miracle Fruit color floods Kirby's mouth and the foreground
  bends inward; quote “Poyo!” Suction moves dust, actors, projectiles and UI-safe
  foreground fragments toward a real mouth anchor. Scaling only the sprite fails.

## 7. Ultimate floor audit

The 30 new direct or mixed-damage ultimates clear their raw Mastery-1 rarity
ratio before crowd credit:

| Rarity | Lowest new direct ratio | Highest new direct ratio | Required floor |
| --- | ---: | ---: | ---: |
| R | 4.50 basic actions | 5.78 | 4.00 |
| SR | 5.60 basic actions | 7.56 | 5.50 |
| SSR | 7.27 basic actions | 8.00 | 7.00 |
| UR transform | 20–28 total; ≥2.5× active DPS | — | 10+ / 18–26 form target |

Dr. Mario, Broom Hatter and Chef Kawasaki require the emergency support
fixture because their realized heal/shield/cleanse value matters. Hypernova
Kirby requires the paired 14-second transformation simulation. None receives a
pass merely from its animation, and all ratios still pay any actor-only cast
time once runtime timing exists.

## 8. Remaining high-form ledger

All five *Return to Dream Land* Super Abilities now have complete fighter cards.
Other major forms still wait for a distinct full kit:

| Candidate | Direction | Approval requirement |
| --- | --- | --- |
| Robobot Armor Kirby | SSR/UR form | machinery, scan/copy slot and pilot/armor damage states |
| Mouthful Kirby | SSR form set | one coherent iteration with bounded object profiles, not ten shallow cards |
| Morpho Knight | UR candidate | full boss-grade sword/butterfly grammar and Mythic opportunity-cost test |

## 9. Model-derived actor policy

Lack of a native pixel sheet no longer automatically disqualifies a fighter.
The asset record supports:

```text
renderMode: native-sprite | model-baked-sprite | live-3d
```

**Preferred bridge:** an approved 3D model and animation set is rendered from a
fixed orthographic/low-perspective camera into transparent atlases. The bake
standard fixes ground plane, facing, light direction, shadow softness, frame
rate, outline treatment and pixel/downsample scale. The result uses the same
animation-marker and collision pipeline as native sprites.

This route is suitable for Cappy Mario, Poltergust Luigi, Swordfighter Peach
and Hypernova Kirby when a good native sheet does not exist. It preserves the
desktop strip's coherent 2D composition while opening the modern-game roster.

`live-3d` remains **CANDIDATE**, not forbidden. It must first prove transparent
Electron performance, deterministic animation markers, click-through behavior,
correct z-order beside 2D sprites and an art treatment that does not look like
an unrelated model viewer. A fighter never receives weaker mechanics because
its rendering route is harder.

Every model or derived render still requires provenance, permission status,
source version, extraction/conversion notes and an approval record. “Available
online” is not provenance.

## 10. Production order and acceptance

The first five-stage combat slice remains the engine gate, but the roster order
after it changes:

1. free classic party and SMB1 enemy behaviors;
2. Yoshi/Mario 64 primitives already queued;
3. complete the 22-fighter Mushroom opening floor in asset-ready batches;
4. build Kirby Copy plus the 20-fighter Dream Land opening floor;
5. complete both Mushroom and Dream Land breadth/Mythic shelves;
6. only then begin a third Hub roster such as Mega Man.

The opening Archive fails acceptance if:

- a real Archive pull is enabled while its live normal pool is below the floor;
- regional pull 40 is earnable below the 28-fighter Mushroom or 26-fighter
  Dream Land growth checkpoint;
- two forms share the same movement/basic/skill and differ mainly in numbers;
- a model-derived actor lacks the same markers and collision tests as sprites;
- the family lock is omitted from variant-heavy parties;
- the owner reaches twenty pulls with a median simulated collection above 75%
  of the normal Archive;
- an advertised fighter cannot be inspected with exact stats, kit and source;
- a high-rarity form misses the corrected ultimate value floor.

Pool breadth does not excuse a generic actor. If twenty-two finished fighters
cannot exist yet, the build is an engine preview—not the content-complete gacha
experience—and should be labeled honestly.
