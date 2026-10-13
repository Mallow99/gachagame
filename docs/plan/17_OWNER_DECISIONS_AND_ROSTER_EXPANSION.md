# Owner decisions and roster expansion

Status: **owner-directed baseline v1, 2026-10-13**

This packet records decisions the owner made directly while reviewing plans
`02`–`16`. Where it conflicts with an earlier file, **this file wins**. Part I
is the rule set; Part II is the expanded roster, built so every relevant main
and side character has multiple versions. Part III lists exactly which earlier
sections must be rewritten to match.

Roster entries are **CANDIDATE** unless marked `existing` (a card already in
plans `14`–`16`). Kit hooks are identity commitments, not numbers; every new
card still needs the full stat block and must clear the ultimate value floor in
`02` §1.6.1 before release.

# Part I — Rules

## 1. Pulls are the progression

**OWNER DECISION — replaces README pillar 13 and every "clearable without
pulls" rule.**

Pulling is the game. Story stages may be tuned so that a roster of free and
early pulls cannot clear them. A player who is walled grinds replays of the
same region, or another region's story, for currency and pulls again. Slow
progress through repeated play is acceptable; a wall is not a design failure.

- The player starts each Hub with **one** fighter: Classic Mario, Kirby
  (*Kirby's Adventure*) or Mega Man (*Mega Man 2*). No free four-person team.
  Classic Luigi, Toad and Peach become ordinary R pulls.
- Replays must always pay renewable currency so a walled player is never
  stuck with zero income. Exact rates belong in `11`.
- Boss weaknesses may depend on owning the right pull. That is intended.
- Early stages are tuned for a one- or two-fighter party until the first
  ten-pull.

## 2. Region lock, then Endless

**OWNER DECISION — replaces `13` §1 "a crossover party can enter any World".**

- A World's story stages accept only fighters from that World's Hub
  (Mushroom Kingdom fighters in Mario Worlds, Dream Land fighters in Kirby
  Worlds, 20XX fighters in Mega Man Worlds). Any version in the Hub's Archive
  is allowed, so Cappy Mario can play SMB1.
- Clearing a World unlocks that Hub's fighters for **Endless mode**, which
  accepts any unlocked fighter from any Hub with any items.
- **Interpretation to confirm with the owner:** the unlock trigger is the
  first cleared World finale in that Hub (for example, beating all 25 stages
  of the Hub's first World).

## 3. Power-Ups are effect-only items, scoped by region

**OWNER DECISION — replaces `02` §6.1 and every card's "Power-Ups:" line.**

- A Power-Up adds **one trait plus one stat lean**. Example: Fire Flower gives
  Fire damage (hits can Burn and count as Fire for encounter rules) and a small
  ranged-damage increase.
- Power-Ups never require new sprites. They add a hit/projectile particle
  overlay and an icon. When a wearer's own sheet already has a matching look
  (Fire Mario palette, Mega Man's weapon palettes, a Kirby copy hat), it may
  use it; that art is a bonus, never a requirement.
- Item pools belong to a Hub. During story, the region lock means only that
  Hub's fighters can equip them. In Endless, anything can equip anything:
  Meta Knight with a Fire Flower is allowed. It is nonsense, and that is fine.
- Mega Man's Special Weapons are 20XX items. Each Robot Master **drops** its
  weapon on first defeat; weapons are not Supply pulls.
- Traits only mean something where an enemy, boss or stage declares a
  reaction (Freezies melt to Fire, for example). They never become a universal
  type chart.
- Delete `powerupCompatibility` from unit records and loadout validation.

### 3.1 Hub UR items

| Hub | UR item | Effect direction |
| --- | --- | --- |
| Mushroom Kingdom | Super Star | at full wearer energy, 12 s invulnerable contact-damage state; rainbow shader, no new sprite |
| Dream Land | Star Rod | at full wearer energy, 15 s of piercing star-bolt volleys and a final comet strike from the wearer; replaces the old Star Rod Kirby fighter |
| 20XX | CANDIDATE: Energy Element or Super Adapter part | owner to choose |

Star Rod Kirby is **removed as a fighter**. The finale Star Rod granted during
the Nightmare encounter (`14` §9) remains an encounter mechanic.

## 4. The equippable layers

| Layer | What lives there | Rule |
| --- | --- | --- |
| Fighter version | a character as they play in one game | passes the five-check rule in `16` §2 |
| Ultimate | a temporary power unique to that game | Super Abilities, Robobot Armor, Giga Bell, Mega Mushroom, Double Cherry, Wonder Flower, Yarn transformations |
| Family mechanic | a series-defining system | Kirby's Copy |
| Power-Up | a recurring pickup | effect-only, Hub-scoped (§3) |
| Assist Page | a supporting character who helps rather than fights | unchanged from `02` §6.2 |

One identity, one home: nothing appears in two layers. Tanooki Mario is a
fighter, so the SMB3 Supply drops the Super Leaf; Cat Mario becomes a fighter
(§Part II), so the Super Bell stays a plain effect item; and FLUDD and Cappy
remain fighter kits, never Assists.

## 5. Kirby's Copy

- Copy is a `kirby`-family mechanic, not a Power-Up. The "Copy Ability pages"
  Power-Up line is deleted.
- Each Kirby version declares a **copy library**: the abilities its source game
  has that also have art in its sheet. Mechanics come from the one shared Copy
  balance table in `14` §7; the hats and animation come from that version's
  game. Copying an ability outside the library produces the existing fallback
  (three boosted Star Shots).
- A new Kirby version ships with at least three copy sets.
- Versions whose kit **is** a held power do not copy: Hypernova Kirby and
  *Kirby's Dream Land* (Game Boy) Kirby.
- Versions with a transformation ultimate copy normally and **spend** the held
  ability when the ultimate fires.

## 6. URs

**OWNER DECISION.**

- Any number of URs may exist per Hub, including side characters (a Luigi UR
  is fine). They release across **separate Mythic banners** so each stays rare.
- **Only one UR Kirby.** Recommended pick: *Return to Dream Land* Kirby
  (Part II). The other Kirby UR ideas drop to SSR.
- **One-Mythic-slot rule removed.** The family lock already costs a player
  every other version of that character. Late content may be tuned so that it
  expects UR fighters. Revisit only if UR stacking breaks the simulator's
  late-World budgets.
- `02` §4.4's "UR Power-Up or UR fighter" exclusivity is gone; a UR item is
  limited only by one item per fighter.

## 7. Rarity guidance

Rarity follows kit power **and** character popularity. A beloved side
character (Bandana Waddle Dee, King Dedede, Meta Knight) can sit at SSR even
when a lesser version of them exists at R or SR. Fighters still need their
ultimate to clear the rarity floor in `02` §1.6.1.

# Part II — Roster

Columns: **Version** (and source game), **Rarity**, **Status**, **Identity
hook** (what the basic/skill/passive revolve around) and **Ultimate** (for new
entries, the game-unique power it showcases).

## 8. Mushroom Kingdom

### 8.1 Mario — `mario`

| Version | Rarity | Status | Identity hook | Ultimate |
| --- | --- | --- | --- | --- |
| Classic Mario (*Super Mario Bros.*) | R | existing; Hub starter | stomp, brick break | Course Clear |
| Jumpman (*Donkey Kong*, 1981) | R | new | barrel hops, ladder climbs | Hammer: the DK hammer pickup, smashing everything it touches |
| Mario Bros. Mario (*Mario Bros.*, 1983) | R | new | knocks enemies over from below, then kicks them away | POW Block: flips every grounded enemy |
| Super Mario Land Mario | R | new | Superball bounce shots | Sky Pop / Marine Pop: boards the plane or sub for a strafing run |
| SMB2 Mario (*Super Mario Bros. 2*) | SR | new | pluck and throw vegetables, stack enemies | Magic Potion: opens a Subspace door; enemies hit inside drop coins |
| Tanooki Mario (*Super Mario Bros. 3*) | SR | existing | tail, P-Meter flight, statue | Sky-to-Statue |
| Super Mario World Mario | SR | new | Cape spin and glide | Cape Dive: ground slam whose quake hits every grounded enemy |
| Dr. Mario | SR | existing | capsule healing | Megavitamin Sweep |
| Builder Mario (*Super Mario Maker 2*) | SR | existing | construction setups | Course Maker |
| Kart Mario (*Mario Kart* series) | SR | new | drives through lanes, drops bananas, fires shells | Bullet Bill: becomes a Bullet Bill and rockets through the line |
| NSMB Mario (*New Super Mario Bros.*) | SSR | new | wall-jump, Blue Shell slide | Mega Mushroom: grows huge and crushes the field |
| Cat Mario (*Super Mario 3D World*) | SSR | new; replaces "Power-Up first" | claw combos, wall climb, pounce dive | Double Cherry: splits into clones that copy every action |
| Mario 64 | SSR | existing | punches, triple jump, dive | Acrobatic Course Clear |
| Sunshine Mario | SSR | existing | FLUDD | existing ultimate |
| Galaxy Mario (*Super Mario Galaxy*) | SSR | promoted candidate | spin, Launch Star repositioning | Rainbow Star: invincible high-speed contact burst |
| Paper Mario (N64) | SSR | existing | partner tactics | existing ultimate |
| Cappy Mario (*Super Mario Odyssey*) | SSR | existing | cap throw, capture echo | Odyssey Tour |
| Mario & Luigi Mario (*Superstar Saga*) | SSR | new | timed jump/hammer action commands | Bros. Attack: Luigi appears as a non-actor cut-in partner |
| Wonder Mario (*Super Mario Bros. Wonder*) | UR | new; recommended Mario UR | Elephant trunk swings and water spray | Wonder Flower: rewrites the battlefield for 14 s (pipes walk, enemies stampede, gravity flips) |
| Bowser's Fury Mario | UR | candidate | cat pounce, Shines | Giga Bell: Giga Cat Mario at background scale |

### 8.2 Luigi — `luigi`

| Version | Rarity | Status | Identity hook | Ultimate |
| --- | --- | --- | --- | --- |
| Classic Luigi | R | existing; now a pull | high jump | existing ultimate |
| SMB2 Luigi | SR | new | flutter-kick high jump, vegetable throws | POW Block quake |
| Dr. Luigi (*Dr. Luigi*) | SR | new | L-shaped capsules that clear two lines | Operation L: a capsule cascade |
| *New Super Luigi U* Luigi | SR | new | floaty super jump, long slide | Speedrun: rushes the whole line before the timer runs out |
| Poltergust Luigi (*Luigi's Mansion 3*) | SSR | existing | Poltergust, Gooigi backup | existing ultimate |
| Mario & Luigi Luigi | SSR | new | Thunderhand, timed counters | Luigi Scramble-style rush, Mario as a cut-in partner |
| Mr. L (*Super Paper Mario*) | UR | new; Luigi UR | Green Thunder masked brawler | Brobot L-type: pilots the mech for 15 s |

### 8.3 Peach — `peach`

| Version | Rarity | Status | Identity hook | Ultimate |
| --- | --- | --- | --- | --- |
| Princess Peach | R | existing; now a pull | float, turnip | existing ultimate |
| SMB2 Peach | SR | new | long float, pluck and throw | Subspace bloom: vegetables rain from Subspace |
| Cat Peach (*Super Mario 3D World*) | SR | new | float plus claw climb | Cat Rush: pounce chain |
| Swordfighter Peach (*Princess Peach: Showtime!*) | SR | existing | blade | existing ultimate |
| Ninja Peach (*Showtime!*) | SR | new | stealth, shuriken | Shadow Stage: vanishes and strikes from every lane |
| Mighty Peach (*Showtime!*) | SSR | new | flying superhero punches, lifts heavy objects | Mighty Finale: carries the biggest enemy into the sky and slams it |
| *Super Princess Peach* Peach | SSR | new | Perry the umbrella, Vibe moods | Vibe Surge: Joy (whirlwind), Rage (fire stomp), Gloom (fast tears) or Calm (heal), chosen by situation |

### 8.4 Daisy — `daisy`

| Version | Rarity | Status | Identity hook | Ultimate |
| --- | --- | --- | --- | --- |
| Princess Daisy (*Super Mario Land*) | R | existing | sparkle kicks | existing ultimate |
| Sporty Daisy (*Mario Strikers* / *Tennis*) | SR | new | shots, slides, flower burst | Flower Strike: power shot through the line |
| Wonder Daisy (*Super Mario Bros. Wonder*) | SR | new | Bubble flower shots that trap Small enemies | Bubble Bloom |

### 8.5 Toad and Toadette — `toad`, `toadette`

| Version | Rarity | Status | Identity hook | Ultimate |
| --- | --- | --- | --- | --- |
| Toad | R | existing; now a pull | courier support | existing ultimate |
| Captain Toad (*Treasure Tracker*) | R | existing | no-jump pathing | existing ultimate |
| SMB2 Toad | R | new | fastest pluck, rapid throws | Sprint Haul: throws a stream of vegetables |
| *Wario's Woods* Toad | SR | new | lifts and stacks monsters and bombs | Stack Clear: detonates every stacked enemy |
| Toadette (`toadette`) | R | new | quick digging and pickaxe | Peachette: the Super Crown turns her into Peachette for a float-and-sparkle burst |

### 8.6 Yoshi — `yoshi`

| Version | Rarity | Status | Identity hook | Ultimate |
| --- | --- | --- | --- | --- |
| Yoshi (*Super Mario World*) | SR | existing | tongue, eggs, flutter | Egg Relay |
| Blue Yoshi (*Super Mario World*) | SR | new | holding a shell grants flight | Wing Sweep |
| Red Yoshi (*Super Mario World*) | SR | new | shells become fireball spreads | Triple Flame |
| Yellow Yoshi (*Super Mario World*) | SR | new | shells cause ground-pound quakes | Quake Stomp |
| Woolly Yoshi (*Yoshi's Woolly World*) | SR | new | yarn balls that bind | Knit Wall |
| Yoshi's Island Yoshi | SSR | new | aimed egg throws while carrying Baby Mario | Super Baby Mario: the Star turns Baby Mario caped and wall-running for a full-field rush |

### 8.7 Wario and Waluigi — `wario`, `waluigi`

| Version | Rarity | Status | Identity hook | Ultimate |
| --- | --- | --- | --- | --- |
| Wario (*Wario Land 4*) | SR | existing | shoulder bash | Hurry Up! |
| *Wario Land* (SML3) Wario | SR | new | garlic-powered charges | Hat Change: Bull, Jet or Dragon hat, chosen by situation |
| *Wario Land II/3* Wario | SR | new | reacts to hits by transforming (Flat, Fat, Puffy, Fire) | Status Rampage: chains three transformations |
| *Wario Land: Shake It!* Wario | SR | new | shakes enemies for coins | Shake Down |
| WarioWare Wario | SSR | new | Wario Bike, Wario Waft | Microgame: a four-second random effect from the microgame table |
| Waluigi (*Mario Tennis*) | SR | existing | court cheat | existing ultimate |

### 8.8 Rosalina, Pauline and Galaxy cast — `rosalina`, `pauline`

| Version | Rarity | Status | Identity hook | Ultimate |
| --- | --- | --- | --- | --- |
| Rosalina (*Super Mario Galaxy*) | SSR | existing | comet guardian | existing ultimate |
| Rosalina (*Super Mario 3D World*) | SR | new | spin attack platformer kit | Star Spin |
| Comet Observatory Rosalina (*Galaxy* finale) | UR | new | Luma squadron | Rebirth of the Cosmos: collapses and rebuilds the field |
| Pauline (*Super Mario Odyssey*) | SR | new | mayor and singer support | Jump Up, Super Star!: festival buff to the whole party |

### 8.9 Bowser, Bowser Jr. and Koopalings

| Version | Family | Rarity | Status | Identity hook | Ultimate |
| --- | --- | --- | --- | --- | --- |
| Bowser (*Super Mario Bros.*) | `bowser` | SSR | existing | claws, fire | King of the Koopas |
| Dry Bowser (NSMB) | `bowser` | SSR | existing | blue flame, reassembly | existing ultimate |
| Clown Car Bowser (*Super Mario World*) | `bowser` | SSR | new | Koopa Clown Car hovering | Mechakoopa Swarm |
| *Bowser's Inside Story* Bowser | `bowser` | SSR | new | punches, Vacuum inhale | Giant Bowser: background-scale brawl |
| Meowser (*Super Mario 3D World*) | `bowser` | SSR | new | cat pounce, clone bells | Cat Bell Rampage |
| Fury Bowser | `bowser` | UR | existing | Fury gauge | Lake Lapcat Awakening |
| Dark Bowser (*Bowser's Inside Story*) | `dark-bowser` | UR | candidate | dark fire, Dark Star energy | Dark Star Core |
| Bowser Jr. (NSMB) | `bowser-jr` | SR | existing | Clown Car | existing ultimate |
| Shadow Mario (*Super Mario Sunshine*) | `bowser-jr` | SR | new | Magic Brush graffiti goop | Graffiti Flood |
| Larry Koopa | `larry` | SR | new | wand blasts, hops | Wand Barrage |
| Morton Koopa Jr. | `morton` | SR | new | ground pound stuns | Tremor |
| Wendy O. Koopa | `wendy` | SR | new | bouncing candy rings | Ring Cage |
| Iggy Koopa | `iggy` | SR | new | erratic wand hops | Wild Spiral |
| Roy Koopa | `roy` | SR | new | bully charges, ground pound | Bully Quake |
| Lemmy Koopa | `lemmy` | SR | new | balancing on a ball, bouncing balls | Circus Bounce |
| Ludwig von Koopa | `ludwig` | SSR | new | multi-shot wand, shell spin | Grand Overture |

### 8.10 Bosses, enemies and the Paper cast

| Version | Family | Rarity | Status | Identity hook | Ultimate |
| --- | --- | --- | --- | --- | --- |
| Goomba | `goomba` | R | new | headbutt line | Goomba Tower: a stack of Goombas topples onto the target |
| Koopa Troopa | `koopa-troopa` | R | existing | shell states | Ricochet Route |
| Dry Bones | `dry-bones` | R | existing | reassembly | Fossil Frenzy |
| Shy Guy | `shy-guy` | R | existing | mask line | Masked Stampede |
| Boo | `boo` | R | new | advances while unwatched | Boo Swarm |
| Piranha Plant | `piranha-plant` | R | new | rooted bites, fireballs | Ptooie Barrage |
| Bob-omb | `bob-omb` | R | new | walks in and detonates, then reforms | Chain Blast |
| Birdo | `birdo` | R | existing | eggs | Egg Parade |
| Wiggler | `wiggler` | R | existing | anger state | Angry Orchard |
| Lakitu | `lakitu` | SR | new | cloud flight, Spiny drops | Spiny Storm |
| Hammer Bro | `hammer-bro` | SR | existing | hammer arcs | Hammer Storm |
| Boomerang Bro | `boomerang-bro` | SR | new | returning boomerangs | Boomerang Cross |
| Fire Bro | `fire-bro` | SR | new | bouncing fireballs | Fire Volley |
| Sledge Bro | `sledge-bro` | SR | new | stomps that stun grounded enemies | Earthshaker |
| Boom Boom | `boom-boom` | SR | new | spinning flails, flight | Tantrum Spin |
| Pom Pom | `pom-pom` | SR | new | shuriken, decoy clones | Clone Ambush |
| Kamek | `kamek` | SR | existing | Magikoopa magic | Magikoopa Rewrite |
| Kammy Koopa (*Paper Mario*) | `kammy` | SR | new | builds blocks, broom | Magic Block Barrage |
| Nabbit | `nabbit` | SR | existing | thief | Great Escape |
| Petey Piranha | `petey-piranha` | SSR | existing | goop, flight | Sunshine Rampage |
| King Bob-omb (*Super Mario 64*) | `king-bob-omb` | SSR | new | grabs and throws | Big Bomb Toss |
| King Boo | `king-boo` | SSR | existing | gallery | Gallery Trap |
| Goombario (*Paper Mario*) | `goombario` | SR | new | Tattle (reveals weaknesses), headbonk | Multibonk |
| Kooper (*Paper Mario*) | `kooper` | SR | new | Shell Toss | Fire Shell |
| Bombette (*Paper Mario*) | `bombette` | SR | new | blasts open guarded targets | Power Bomb |
| Parakarry (*Paper Mario*) | `parakarry` | R | new | airborne courier strikes | Air Raid |
| Lady Bow (*Paper Mario*) | `bow` | SR | new | slaps, Outta Sight | Spook |
| Watt (*Paper Mario*) | `watt` | SR | new | ignores defense | Mega Shock |
| Sushie (*Paper Mario*) | `sushie` | R | new | water squirts | Tidal Wave |
| Lakilester (*Paper Mario*) | `lakilester` | SR | new | Spiny Flip, cloud ride | Hurricane |
| Goombella (*The Thousand-Year Door*) | `goombella` | SR | new | Tattle, Rally Wink | Multibonk |
| Koops (*Thousand-Year Door*) | `koops` | SR | new | Shell Shield | Power Shell |
| Flurrie (*Thousand-Year Door*) | `flurrie` | SR | new | Gale Force | Lip Lock |
| Vivian (*Thousand-Year Door*) | `vivian` | SSR | new | Shade Fist, Veil | Infatuate |
| Admiral Bobbery (*Thousand-Year Door*) | `bobbery` | SR | new | bombs | Bob-ombast |
| Ms. Mowz (*Thousand-Year Door*) | `ms-mowz` | SR | new | steals items, Kiss Thief | Smooch |

## 9. Dream Land

Owner rarity changes: Parasol Waddle Dee R → SR; Bandana Waddle Dee R → SSR;
*Kirby's Adventure* Meta Knight SSR → SR (a stronger Meta Knight version takes
SSR). King Dedede stays SSR. Rolly was Wheelie, already SR.

**Opening-floor recount (8 R / 7 SR / 5 SSR in `16` §1):** R loses Bandana and
Parasol Waddle Dee, refilled by plain Waddle Dee and *Kirby's Dream Land* Kirby.
SR gains Parasol Waddle Dee and Meta Knight (9 total). SSR loses Meta Knight
and Ultra Sword Kirby, refilled by Bandana Waddle Dee and *Kirby Super Star*
Meta Knight.

### 9.1 Kirby — `kirby`

| Version | Rarity | Status | Copies? | Identity hook | Ultimate |
| --- | --- | --- | --- | --- | --- |
| Kirby (*Kirby's Adventure*) | R | existing; Hub starter | yes | inhale, Copy | Warp Star Crash |
| *Kirby's Dream Land* Kirby (Game Boy) | R | new | **no** | inhale and spit only; Game Boy-era sprite | Spicy Curry: continuous fire breath; Mint Leaf (puff barrage) as alternative |
| *Kirby's Dream Land 2* Kirby | SR | new | yes | Copy | Rainbow Sword |
| *Amazing Mirror* Kirby | SR | new | yes | Copy | Cell Phone: three colored Kirbys arrive and attack |
| *Squeak Squad* Kirby | SR | new | yes | stores items and abilities in his stomach | Ability Mix: combines two stored abilities |
| *Kirby Mass Attack* Kirby | SR | new | no | a swarm of up to ten small Kirbys | Pile-On: all ten land on one target |
| Yarn Kirby (*Epic Yarn*) | SR | new | no | yarn whip, unravelling | Yarn transformation: Tankbot, UFO or Weight, chosen by situation |
| Air Ride Kirby (*Kirby Air Ride*) | SR | new | no | always on the Warp Star; charge then boost | Dragoon: the legendary machine rams the whole line |
| *Team Kirby Clash* Kirby | SR | candidate | no | class chosen at loadout: Sword Hero, Hammer Lord, Beam Mage or Doctor Healmore | class finisher |
| *Kirby Super Star* Kirby | SSR | new | yes | Copy with full movesets | Helper: releases the held ability as its Helper actor for 12 s |
| Hypernova Kirby (*Triple Deluxe*) | SSR | existing; UR → SSR | **no** | Hypernova the entire time: constant suction | Hypernova Maw rescaled to a single giant inhale burst in the SSR band |
| Robobot Kirby (*Planet Robobot*) | SSR | promoted from ledger | yes | Copy outside the Armor | Robobot Armor: scans the held ability into a Mode |
| *Star Allies* Kirby | SSR | new | yes | Friend Hearts | Friend Ability: coats every ally's basics in his held element |
| *Forgotten Land* Kirby | SSR | new | yes | evolved copy abilities | Mouthful Mode: Car, Vending or Cone, chosen by situation |
| *Return to Dream Land* Kirby | **UR** | new; the one UR Kirby; replaces five Super Ability SSRs | yes | Copy | Super Ability form for 14 s, picked by the held ability: Sword → Ultra Sword, Fire → Monster Flame, Beam → Flare Beam, Hammer → Grand Hammer, Ice → Snow Bowl; anything else → Ultra Sword. Consumes the held ability. |

The five Super Ability cards in `16` §6 become this UR's five ultimate
variants, rescaled from SSR bursts to the UR transformation band.

**UR Kirby alternatives (not chosen):** Robobot Kirby and *Star Allies* Kirby.

### 9.2 Waddle Dee line — `waddle-dee`, `bandana-waddle-dee`, `waddle-doo`

| Version | Family | Rarity | Status | Identity hook | Ultimate |
| --- | --- | --- | --- | --- | --- |
| Waddle Dee | `waddle-dee` | R | new | plain walker, spear poke | Waddle Dee Parade |
| Parasol Waddle Dee | `waddle-dee` | SR | existing; R → SR | parasol guard | existing ultimate |
| Bandana Waddle Dee (*Return to Dream Land*) | `bandana-waddle-dee` | SSR | existing; R → SSR | spear, copter spear | Spear Barrage |
| Bandana Waddle Dee (*Star Allies*) | `bandana-waddle-dee` | SSR | new | Dream Friend parasol and spear | Waddle Dee Army: a squad charges through the line |
| Waddle Doo | `waddle-doo` | R | new | eye beam whip | Beam Cyclone |
| Captain Waddle Doo (*Kirby Super Star*) | `waddle-doo` | SR | new | Halberd crew leader | All Hands: the Halberd crew charges |

### 9.3 King Dedede — `dedede`

| Version | Rarity | Status | Identity hook | Ultimate |
| --- | --- | --- | --- | --- |
| King Dedede (*Kirby's Adventure*) | SSR | existing | hammer, inhale, pounce | existing ultimate |
| Hammer Dedede (*Return to Dream Land*) | SR | new | playable hammer, jet hammer charge | Jet Hammer Blast |
| Drum Dash Dedede (*Dedede's Drum Dash*) | SR | new | rhythm-timed drum bounces | Drum Finale |
| Possessed Dedede (*Kirby's Dream Land 2/3*, *Kirby 64*) | SSR | new | Dark Matter's belly mouth | Dark Matter Burst |
| Masked Dedede (*Kirby Super Star Ultra* / *Triple Deluxe*) | SSR | new | mechanical hammer with missiles | Hammer Missile Barrage |
| Beast-Pack Dedede (*Forgotten Land*) | SSR | new | feral hammer rush | Beast Frenzy |

### 9.4 Meta Knight and the knights

| Version | Family | Rarity | Status | Identity hook | Ultimate |
| --- | --- | --- | --- | --- | --- |
| Meta Knight (*Kirby's Adventure*) | `meta-knight` | SR | existing; SSR → SR | sword strings, tornado | existing ultimate |
| Meta Knight (*Kirby Super Star*) | `meta-knight` | SSR | new; the "better Meta Knight" | Meta Knightmare moveset, cape teleport | Halberd: main-cannon barrage ending in Galaxia Darkness |
| Meta Knight (*Return to Dream Land*) | `meta-knight` | SSR | candidate | playable rapid-sword kit | Mach Tornado Finale |
| Dark Meta Knight (*Amazing Mirror*) | `dark-meta-knight` | SSR | existing | mirror clones | Dimensional Mirror |
| Galacta Knight (*Kirby Super Star Ultra*) | `galacta-knight` | UR | new | lance, shield, pink feather wings | Galactic Lance Storm |
| Morpho Knight | `morpho-knight` | UR | ledger candidate | butterfly blade | Morpho Eclipse |
| Sword Knight (*Kirby's Adventure*) | `sword-knight` | R | new | fencing | Blade Rush |
| Blade Knight | `blade-knight` | R | existing | patient guard | Sword Formation |
| Axe Knight (*Kirby Super Star*) | `axe-knight` | R | new | axe hops | Axe Spin |
| Mace Knight (*Kirby Super Star*) | `mace-knight` | R | new | mace flail | Iron Ball Crash |
| Trident Knight (*Kirby Super Star*) | `trident-knight` | R | new | trident throws | Trident Rain |
| Javelin Knight (*Kirby Super Star*) | `javelin-knight` | R | new | rocket javelins | Javelin Volley |
| Captain Vul (*Kirby Super Star*) | `vul` | SR | new | Halberd commands, cannon calls | Fire the Main Cannon |

### 9.5 Kirby villains and story cast

| Version | Family | Rarity | Status | Identity hook | Ultimate |
| --- | --- | --- | --- | --- | --- |
| Magolor (*Return to Dream Land Deluxe*) | `magolor` | SSR | existing | dimension magic | existing ultimate |
| Epilogue Magolor (*Magolor Epilogue*) | `magolor` | SR | new | regains magic as he levels | Black Hole |
| Magolor Soul | `magolor` | UR | new; owner pick | Master Crown power | Crown Collapse |
| Nightmare (*Kirby's Adventure*) | `nightmare` | UR | new; owner pick; playable Wizard form at declared scale | cloak teleports, star shots | Power Orb Pursuit |
| Marx (*Kirby Super Star*) | `marx` | SSR | existing | wish trickster | Nova Betrayal |
| Marx Soul (*Kirby Super Star Ultra*) | `marx` | UR | new | soul form | Soul Split |
| Queen Sectonia (*Triple Deluxe*) | `sectonia` | UR | new | four-armed staff duelist | Royal Sting |
| Taranza (*Triple Deluxe*) | `taranza` | SR | existing | web puppeteer | Dreamstalk Web |
| Daroach (*Squeak Squad*) | `daroach` | SSR | existing | Squeak Squad master | Squeak Raid |
| Spinni (*Squeak Squad*) | `spinni` | SR | new | ninja claws, clones | Claw Flurry |
| Storo (*Squeak Squad*) | `storo` | R | new | brawler | Tackle Rush |
| Doc (*Squeak Squad*) | `doc` | SR | new | UFO mech | Laser Sweep |
| Susie (*Planet Robobot*) | `susie` | SR | new | business-suit drone mech | Hostile Takeover |
| President Haltmann (*Planet Robobot*) | `haltmann` | SSR | new | Haltmann Works machinery | Star Dream Call |
| Francisca (*Star Allies*) | `francisca` | SR | new | ice | Frozen Halberd |
| Flamberge (*Star Allies*) | `flamberge` | SR | new | fire | Inferno Sword |
| Zan Partizanne (*Star Allies*) | `zan-partizanne` | SSR | new | lightning | Thunder Spear |
| Hyness (*Star Allies*) | `hyness` | SSR | new | Jamba rituals | Dark Ritual |
| Elfilin (*Forgotten Land*) | `elfilin` | SR | new | support teleport | Warp Rescue |
| Clawroline (*Forgotten Land*) | `clawroline` | SR | new | Beast Pack lieutenant | Claw Storm |
| Sillydillo (*Forgotten Land*) | `sillydillo` | SR | new | rolling armadillo | Toybox Roll |
| Dark Matter Swordsman (*Kirby's Dream Land 2*) | `dark-matter` | SSR | new | humanoid swordsman form | Dark Slash |
| Shadow Kirby (*Amazing Mirror*) | `shadow-kirby` | SR | new | mirrors Kirby's moves | Mirror Bomb |
| Gooey | `gooey` | SR | existing | mock matter | Dark-Matter Pretend |
| Adeleine (*Kirby's Dream Land 3* / *Kirby 64*) | `adeleine` | SR | new | paints enemies into existence | Painted Ambush |
| Ribbon (*Kirby 64*) | `ribbon` | SR | new | Crystal Shard fairy | Crystal Gun Volley |
| Prince Fluff (*Epic Yarn*) | `prince-fluff` | SR | new | yarn whip | Yarn Transformation |
| Lololo & Lalala | `lololo-lalala` | SR | DEFERRED duo | box pushers | Box Stampede |

### 9.6 Animal friends, helpers and enemies

| Version | Family | Rarity | Status | Identity hook | Ultimate |
| --- | --- | --- | --- | --- | --- |
| Rick (*Kirby's Dream Land 2*) | `rick` | R | new | ground hamster | Rick Rush |
| Kine (*Kirby's Dream Land 2*) | `kine` | R | new | swimming fish | Tidal Slap |
| Coo (*Kirby's Dream Land 2*) | `coo` | SR | new | owl flight | Talon Dive |
| Nago (*Kirby's Dream Land 3*) | `nago` | R | new | cat triple jump | Kitty Pounce |
| ChuChu (*Kirby's Dream Land 3*) | `chuchu` | R | new | ceiling cling | Bow Swing |
| Pitch (*Kirby's Dream Land 3*) | `pitch` | R | new | small bird | Feather Volley |
| Poppy Bros. Jr. | `poppy-bros-jr` | R | existing | bombs | existing ultimate |
| Knuckle Joe | `knuckle-joe` | R | existing | rising break | Smash Combination |
| Chilly | `chilly` | R | existing | snow | Whiteout Waltz |
| Bio Spark | `bio-spark` | R | existing | ninja | Ninja Downpour |
| Broom Hatter | `broom-hatter` | R | existing | caretaker | Spring Cleaning |
| Bronto Burt | `bronto-burt` | R | new | swooping flight | Dive Squadron |
| Scarfy | `scarfy` | R | new | turns monstrous when inhaled or provoked | Rage Face |
| Simirror | `simirror` | R | new | mirror clones | Reflect Force |
| Sir Kibble, Hot Head, Wheelie, Sparky, Rocky, Bonkers | each own | SR | existing | — | — |
| Chef Kawasaki | `chef-kawasaki` | SR | existing | cook | Cook Festival |
| Mr. Frosty (*Kirby Super Star*) | `mr-frosty` | SR | new | ice block toss | Frozen Slide |
| Bugzzy (*Kirby Super Star*) | `bugzzy` | SR | new | suplex grabs | Bug Suplex |

## 10. 20XX

Mega Man's eight MM2 Special Weapons are 20XX items dropped by their Robot
Masters (§3).

### 10.1 Mega Man — `mega-man`

| Version | Rarity | Status | Identity hook | Ultimate |
| --- | --- | --- | --- | --- |
| Mega Man (*Mega Man 2*) | R | existing; Hub starter | Mega Buster | Buster Overdrive |
| Mega Man (*Mega Man 9/10*) | R | new | no slide or charge; precise retro shots | Retro Barrage |
| Mega Man (*Mega Man 3*) | SR | new | slide | Rush Jet: strafing flight run |
| Mega Man (*Mega Man 4*) | SR | new | New Mega Buster charge | Full-Charge Chain |
| Mega Man (*Mega Man 8*) | SR | new | Mega Ball | Mega Ball Volley |
| Mega Man (*Mega Man 6*) | SSR | new | Rush adapters | Power or Jet Adapter, chosen by situation |
| Mega Man (*Mega Man 11*) | SSR | new | Double Gear | Double Gear: Speed and Power Gear together |
| Super Adapter Mega Man (*Mega Man 7*) | UR | new | Rush-fused armor | Super Rocket Buster |

### 10.2 Side cast

| Version | Family | Rarity | Status | Identity hook | Ultimate |
| --- | --- | --- | --- | --- | --- |
| Roll (*Mega Man Powered Up*) | `roll` | R | existing | workshop support | Workshop Rescue |
| Proto Man (*Mega Man 3*) | `proto-man` | SSR | existing | shield, whistle | Blues Breakthrough |
| Break Man (*Mega Man 3*) | `proto-man` | SR | new | disguised rival duels | Whistle Ambush |
| Bass (*Mega Man & Bass*) | `bass` | SSR | new | rapid seven-direction fire, dash | Treble Boost burst |
| Treble-Fused Bass (*Mega Man 7*) | `bass` | UR | new | fused flight | Gospel Fusion |
| Dr. Wily | `wily` | SSR | existing | Wily Machine | Alien Projection |
| King (*Mega Man & Bass*) | `king` | SSR | new | axe, shield | Royal Destruction |
| Dr. Cossack (*Mega Man 4*) | `cossack` | SR | new | Cossack Citadel machinery | Citadel Crane |
| Quint (*Mega Man II*, Game Boy) | `quint` | SR | new | Sakugarne pogo jackhammer | Jackhammer Quake |
| Enker (*Mega Man*, Game Boy) | `enker` | SR | new | absorbs shots into his spear | Mirror Buster |
| Punk (*Mega Man III*, Game Boy) | `punk` | SR | new | spinning screw crusher | Screw Crusher |
| Ballade (*Mega Man IV*, Game Boy) | `ballade` | SR | new | bombs, power mode | Ballade Cracker |
| Sunstar (*Mega Man V*, Game Boy) | `sunstar` | UR | new | solar Stardroid | Solar Overload |
| Sniper Joe | `sniper-joe` | R | existing | shield line | Formation Advance |
| Rush, Beat, Eddie, Dr. Light, Auto | — | — | Assist Pages | — | — |

### 10.3 Robot Master shelves (SR unless noted)

| Game | Robot Masters | Notes |
| --- | --- | --- |
| *Mega Man 2* | Bubble, Air, Quick, Crash, Flash, Metal, Wood, Heat | existing cards |
| *Mega Man* / *Powered Up* | Cut, Guts, Ice, Bomb, Fire, Elec, Time, Oil | Time Man and Oil Man come from *Powered Up* |
| *Mega Man 3* | Needle, Magnet, Gemini, Hard, Top, Snake, Spark, Shadow | Gemini Man's clone and Shadow Man's ninja kit are SSR candidates |

Later games (4–11) supply eight masters each; release them in shelves per
World rather than all at once.

### 10.4 X series — separate families inside 20XX

| Version | Family | Rarity | Status | Identity hook | Ultimate |
| --- | --- | --- | --- | --- | --- |
| X (*Mega Man X*) | `x` | SSR | new | armor parts, X-Buster | Hadouken |
| Ultimate Armor X (*Mega Man X4+*) | `x` | UR | new | Nova Strike armor | Nova Strike |
| Zero (*Mega Man X4*) | `zero` | SSR | new | Z-Saber, Z-Buster | Rekkoha |
| MegaMan.EXE (*Battle Network*) | `megaman-exe` | SSR | candidate | Battle Chips | Program Advance |

## 11. UR summary

| Hub | UR fighters | UR item |
| --- | --- | --- |
| Mushroom Kingdom | Fury Bowser, Wonder Mario, Mr. L, Comet Observatory Rosalina; candidates Bowser's Fury Mario, Dark Bowser | Super Star |
| Dream Land | *Return to Dream Land* Kirby, Nightmare, Magolor Soul, Galacta Knight, Morpho Knight, Marx Soul, Queen Sectonia | Star Rod |
| 20XX | Super Adapter Mega Man, Treble-Fused Bass, Sunstar, Ultimate Armor X | candidate |

Each UR gets its own Mythic banner rotation. Release order follows asset
readiness.

# Part III — Plan files to rewrite

| File | Section | Change |
| --- | --- | --- |
| `README.md` | pillars 10–13 | Power-Ups are effect-only items (10); pulls are progression, story may require pulls (13); one-Mythic-slot rule removed (12) |
| `02` | §3.2, §4.4, §6.1 | remove one Mythic slot; effect-only Hub-scoped Power-Ups; drop compatibility tags |
| `03`, `04`, `12` | starters and Supply lists | one starter per Hub; Super Leaf out of SMB3 Supply; Special Weapons as boss drops; Star Rod Page removed |
| `08` | unit and loadout records | delete `powerupCompatibility`; add `copyLibrary` per Kirby version; add Hub `endlessUnlocked` save flag |
| `11` | economy | replay income for walled players; Mythic banner per UR |
| `13` | §1 | region lock for story; Endless mode for cross-Hub parties |
| `14` | Power-Ups lines, §7, Star Rod card, Dream Land rarities | delete Power-Ups lines; copy library per version; Star Rod Kirby removed; Meta Knight SR; Parasol SR |
| `15` | §2 | Special Weapons are Robot Master drops, effect-only for non-Mega Man wearers |
| `16` | §1 floors, §5 shelves, §6 Super Ability cards, Hypernova card | five Super Abilities become one UR's variants; Hypernova SSR; Bandana SSR; floor recount |

## 12. Open questions for the owner

1. Region lock unlock trigger: first World finale in the Hub, or every World?
2. 20XX UR item.
3. Mega Man growth: rarity prestige via a boss rush, or weapons as his growth
   with the MM2 Wily teleporter rush unlocking mid-fight weapon swapping.
4. Whether Bowser's Fury Mario and Dark Bowser join as URs or stay candidates.
5. Whether `galacta-knight` and `morpho-knight` share a family lock.
