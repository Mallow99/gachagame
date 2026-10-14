# Metroid Saga planner

Status: **candidate museum and World spine v1, 2026-10-14; not in production**

Metroid should feel different from Mario and Zelda. Its roster is smaller and
heavier, its equipment catalog is naturally excellent, and its Worlds derive
variety from hostile biomes, pursuit, destructible projectiles and enormous
bosses. Suits and beams are usually Power-Ups; Samus versions become fighters
only when movement, weapon grammar and silhouette materially change.

## 1. Scale

- **Core Story spine:** 190 stages across nine Worlds.
- **Optional Hunters/Other M branches:** 30 additional stages.
- **Curated fighter museum:** 44 cards; 4.32 core Story stages per card.
- **Supply direction:** 24 Power-Ups and 15 Assist Pages.
- **First production World:** *Super Metroid*, 25 stages and 9–12 releases.

This is intentionally less fighter-dense than Mario. Do not solve that by
turning every beam color into another Samus.

## 2. Samus family — 12 versions

All use `familyId: samus`.

| Version | Rarity | Movement / kit thesis | Ultimate thesis | Home World |
| --- | --- | --- | --- | --- |
| NES Samus | R | deliberate run, jump Shot, bombs and short Morph Ball route | Mother Brain Escape: missile rush then timed evacuation Charge | *Metroid* |
| Zero Mission Samus | R | faster ledge routes, Power Grip and compact bomb jumps | Fully Powered Suit recovery burst | *Zero Mission* |
| Samus Returns | SSR | free aim, melee counter and Aeion resource | Lightning Armor into Beam Burst | *Samus Returns* |
| Super Metroid Samus | SSR | floaty space jump, charge Shot, Morph Ball and wall jump | Hyper Beam: sustained line Beam with recoil and finale blast | *Super Metroid* |
| Fusion Suit Samus | SSR | fast ladders/ledges, Ice Missiles and Core-X absorb | Omega Suit: temporary restored power and Ice Beam | *Fusion* |
| Zero Suit Samus | SSR | acrobatic Combo, Paralyzer Shot and whip tether | Power Suit Retrieval: ship-delivered armor barrage, then returns | *Zero Mission* |
| Prime Samus | SSR | lock-on strafe, visor marks and beam charging | Artifact Overload: beam-combo sequence | *Metroid Prime* |
| Dark Suit Samus | SSR | slow armored routing, Dark/Light ammo stance | Annihilator Beam field | *Prime 2* |
| PED Samus | SSR | Hypermode risk meter and corruption cleanse | Phazon Overdrive with forced safe shutdown | *Prime 3* |
| Other M Samus | SR | SenseMove counter, concentration and close-range missile punish | Overblast/Power Bomb sequence | *Other M* |
| Dread Samus | SSR | slide, Flash Shift, counter and Speed Booster route | Shinespark Chain into Omega Cannon | *Metroid Dread* |
| Metroid Suit Samus | UR | energy-drain claw, Hyper Beam and predatory hover | Itorash Consumption: full Metroid state for a bounded window | *Metroid Dread* |

The Metroid Suit is a separate UR because its normal movement, contact rules
and attack source change for the entire actor. Varia, Gravity and ordinary beam
upgrades stay effect-only equipment.

## 3. Hunters and rivals — 12 fighters

| Fighter | Family | Rarity | Distinct combat identity | Ultimate |
| --- | --- | --- | --- | --- |
| Dark Samus | `dark-samus` | UR | Phazon hover, duplicate echoes and corrosive Beam | Phazon Singularity |
| SA-X | `sa-x` | SSR | relentless Samus-mirror pursuit and Ice Beam punishment | Restricted Lab Hunt |
| Raven Beak | `raven-beak` | UR | Chozo cannon, wing dash, counters and sun orb | Mawkin Ascension |
| Sylux | `sylux` | SSR | Shock Coil tether and Lockjaw bombs | Delano 7 Ambush |
| Rundas | `rundas` | SR | ice surfing, freeze Shot and shard spear | Cryosphere Break |
| Ghor | `ghor` | SR | armored Charge, plasma cannon and detachable body | Machine Fusion |
| Gandrayda | `gandrayda` | SSR | agile electric lashes and bounded copied-skill table | Shapeshifter Parade |
| Weavel | `weavel` | SR | halfturret split actor and Battlehammer Lob | Body/Turret Crossfire |
| Noxus | `noxus` | SR | Judicator freeze, spinning close-range control | Vhoscythe Lock |
| Spire | `spire` | SR | rock armor, Magmaul bounce and wall grip | Diamont Quake |
| Trace | `trace` | SSR | long-range Imperialist mark and invisible perch | Kriken Sniper Nest |
| Kanden | `kanden` | SR | Volt Driver homing Shot and Stinglarva form | Bioweapon Swarm |

## 4. Boss and creature recruits — 20 fighters

These use playable scale classes. Their Story bosses keep separate records and
larger hit zones.

| Fighter | Family | Rarity | Playable grammar | Ultimate |
| --- | --- | --- | --- | --- |
| Ridley | `ridley` | SSR | aerial tail Combo, fireballs and pounce carry | Ceres Station Raid |
| Meta Ridley | `ridley` | SSR | armored flight, missiles and ground laser | Frigate Orpheon Bombardment |
| Kraid | `kraid` | SSR | background-scale belly spikes and claw Lob; does not roam normally | Brinstar Breakout |
| Phantoon | `phantoon` | SSR | phase visibility, blue flames and enraged eye window | Wrecked Ship Blackout |
| Draygon | `draygon` | SR | swim bands, grab drag and electric-environment fallback | Maridia Undertow |
| Crocomire | `crocomire` | SR | heavy shove duel and acid-edge pressure | Last Stand at Norfair |
| Nightmare | `nightmare` | SSR | gravity field changes projectile arcs and exposed-face phase | Sector 5 Gravity Collapse |
| Serris | `serris` | SR | high-speed water-lane Charge and segmented route | Aqua Circuit |
| Yakuza | `yakuza` | SR | ceiling grab, fire spit and leg vulnerability | Boiler Web Drop |
| B.O.X. | `box-security` | SR | quadruped pursuit, grenade arcs and broken-frame phase | Security Breach |
| Larval Metroid | `metroid` | R | float, latch-drain and freeze vulnerability | Colony Rush |
| Alpha Metroid | `metroid` | SR | horn Charge and short hover | Metroid Evolution I |
| Gamma Metroid | `metroid` | SR | electric arcs and ceiling retreat | Metroid Evolution II |
| Zeta Metroid | `metroid` | SSR | grounded claws, acid Lob and wall leap | Metroid Evolution III |
| Omega Metroid | `metroid` | SSR | heavyweight bite, beam mouth and armor plates | Omega Rampage |
| Metroid Queen | `metroid` | UR | background head/neck zones and spawned eggs | Nest Sovereign |
| Torizo | `torizo` | R | Chozo statue hops, orb toss and held-item bait | Statue Awakening |
| Golden Torizo | `torizo` | SR | projectile catch, high leap and armor break | Golden Chozo Trial |
| E.M.M.I. | `emmi` | SSR | wall-crawling pursuit, pin counter and zone scan | Central Unit Override |
| Experiment Z-57 | `experiment-z57` | SSR | wall-scale limbs, sweeping Beam and wind tunnel | Cataris Meltdown |

Mother Brain remains boss-only until a persistent playable body can be designed
without pretending a jar is a normal roaming fighter. The same rule applies to
planet-sized threats.

## 5. Power-Ups — 24-item direction

Metroid presents the shared slot as `Suit Upgrade`. It still grants one trait,
one stat lean and at most one bounded proc.

| Rarity | Upgrades | Direction |
| --- | --- | --- |
| R | Energy Tank; Missile Tank; Morph Ball; Bomb; Reserve Tank | HP, ranged lean, low-route trait, hazard break, low-HP heal |
| SR | Charge Beam; Ice Beam; Wave Beam; Spazer Beam; Super Missile; Power Bomb; Varia Suit; Gravity Suit; Hi-Jump Boots; Speed Booster; Grapple Beam; X-Ray Scope | charge proc, Slow, pierce, spread, armor break, wave blast, Fire/Gravity protection, jump, Charge route, tether, hidden-target reveal |
| SSR | Plasma Beam; Space Jump; Screw Attack; Spider Ball; Boost Ball; Dark Beam | line pierce, Airborne chain, contact damage cooldown, wall route, burst Charge, Dark trait |
| UR | Phazon Suit | after first ultimate, bounded Hypermode Awakening with corruption shutdown |

Morph Ball equipment does not replace a Samus kit or give Kraid a literal ball
sheet. It grants a low-route/evasion trait with a compact shared effect. A
fighter that already owns the state receives the stat lean without stacking.

## 6. Assist Pages — 15-character direction

| Rarity | Assists | Intervention direction |
| --- | --- | --- |
| R | Etecoons; Dachoras; Federation Marines; Chozo Elder; Luminoth Sentinel | wall-route rescue, speed-route rescue, covering fire, item blessing, light shield |
| SR | Adam Malkovich; Anthony Higgs; U-Mos; Quiet Robe; Aurora Unit 242; Samus's Gunship | target order, plasma save, light/dark cleanse, E.M.M.I. shutdown, hack/stagger, missile flyby |
| SSR | Baby Metroid; Metroid Queen's Hatchling; Galactic Federation Fleet; Thoha Choir | lethal rescue/drain, controlled latch, screen bombardment, Metroid pacification |

Adam's biological and network appearances share one Assist family. Baby
Metroid cannot be equipped beside a `metroid`-family fighter. Gunship is a
support actor, not a fifth fighter.

## 7. World spine

| World | Stages | Area direction | Signature bosses / systems |
| --- | ---: | --- | --- |
| Metroid | 15 | Brinstar; Norfair; Tourian | Kraid; Ridley; Mother Brain, password-era treatment |
| Metroid II / Samus Returns | 20 | surface; ruins; depths; nest | Metroid evolution ladder and Queen |
| Super Metroid | 25 | Crateria; Brinstar; Norfair; Wrecked Ship/Maridia; Tourian | Kraid; Crocomire; Phantoon/Draygon; Ridley; Mother Brain |
| Metroid Fusion | 20 | station sectors; aquatic/reactor; restricted lab; escape | Serris; B.O.X./Yakuza; Nightmare; SA-X/Omega |
| Zero Mission | 15 | Zebes route; Tourian; Space Pirate mothership | Kraid; Ridley; Mecha Ridley, Zero Suit segment |
| Metroid Prime | 25 | Tallon; ruins; caverns; mines; crater | Flaahgra; Thardus; Omega Pirate; Meta Ridley; Metroid Prime |
| Metroid Prime 2 | 25 | Temple Grounds; Agon; Torvus; Sanctuary; Sky Temple | Amorbis; Chykka; Quadraxis; Emperor Ing/Dark Samus |
| Metroid Prime 3 | 20 | Norion/Bryyo; Elysia; Pirate Homeworld; Phaaze | Hunter battles; Mogenar; Omega Ridley; Dark Samus |
| Metroid Dread | 25 | Artaria/Cataris; Dairon/Burenia; Ghavoran/Ferenia; Hanubia; Itorash | E.M.M.I.; Kraid; Z-57; Chozo Elites; Raven Beak |

Optional later Worlds:

- *Metroid Prime Hunters* — 15 stages and the six non-Samus hunters;
- *Metroid: Other M* — 15 stages only after its cinematic/3D-to-sprite cost is
  justified by approved actors.

## 8. First production packet: Super Metroid

The initial freeze contains:

- fighters: Super Metroid Samus; Larval Metroid; Torizo/Golden Torizo; Kraid;
  Crocomire; Phantoon; Draygon; Ridley; one enemy recruit only if its normal
  actor already passes the fighter animation gate;
- Power-Ups: Energy Tank, Missile Tank, Charge Beam, Varia Suit, Gravity Suit,
  Speed Booster, Space Jump and Screw Attack;
- Assists: Etecoons, Dachoras, Baby Metroid and Gunship;
- engine proofs: aimable Shot, charged projectile, Morph Ball route, wall jump,
  breakable projectiles, boss zones, visibility phases and background-scale
  targets;
- boss rule: every huge boss has a playable-scale record or stays enemy-only;
  code never rescales the Story actor and calls it a fighter.

No numerical cards are frozen until Metroid enters production Wave. The museum
is a design/research queue.

## 9. Research/provenance notes

The *Super Metroid* area and boss spine was cross-checked against Metroid Wiki
on 2026-10-14. Animation availability and legal use remain unapproved.

Reference: <https://www.metroidwiki.org/wiki/Super_Metroid>
