# Terraria Saga planner

Status: **candidate museum and two-World spine v1, 2026-10-14; not in production**

Terraria is a systems-led Saga. It has hundreds of items and enemies but few
named humanoid combatants. The correct adaptation is not eighty palette-swap
Terrarians. Player armor/class milestones become a carefully limited family of
fighters, major bosses become scale-controlled recruits, NPCs become Assist
Pages and accessories fill the Power-Up slot.

## 1. Scale

- **Story:** 50 stages: 25 pre-Hardmode and 25 Hardmode.
- **Fighter museum:** 32 cards: 15 Terrarian versions and 17 bosses.
- **Depth:** 1.56 Story stages per fighter, inside the healthy density band.
- **Supply:** 25 Accessories and 16 NPC Assist Pages.
- **Production rule:** each World releases at most fifteen fighters through
  Story/focus; remaining boss recruits enter Wanted Hunts or later Archive
  shelves rather than flooding one banner.

Native sprites lower the asset risk, but effects and projectiles are expensive.
The battle strip must cap minions, particles and segmented boss bodies.

## 2. Terrarian family — 15 versions

All use `familyId: terrarian`. Armor is not enough: every row owns a distinct
pattern, movement route, secondary resource and ultimate.

| Version | Rarity | Class / movement grammar | Kit thesis | Ultimate |
| --- | --- | --- | --- | --- |
| Copper Adventurer | R | hybrid Strike, grounded | shortsword/pickaxe basics, wood bow skill, potion discipline | First Night: campfire heal then mixed-tool rush |
| Shadow Charger | SR | melee Charge, fast grounded | Ball O' Hurt arc, Demonite dash and attack-speed ramp | Eater's Shadow Rush |
| Crimson Berserker | SR | melee Combo, lifesteal risk | Blood Butcherer, Panic dash and bounded regeneration | Crimson Heartbeat |
| Molten Vanguard | SR | melee Strike, heavy | Fiery Greatsword, Sunfury Lob and lava armor | Underworld Eruption |
| Necro Ranger | SR | Shot, mobile back line | Minishark stream, Molten Fury mark and ammo rhythm | Bone Barrage |
| Jungle Mage | SR | Beam/Lob, hover burst | Vilethorn line, Water Bolt bounce and mana-star recovery | Nature's Gift Storm |
| Bee Summoner | SR | summon controller, evasive | Imp/Hornet capped minions, Bee Gun and whip mark | Queen's Swarm |
| Hallowed Knight | SSR | melee Combo, short flight | Excalibur arcs, Light Disc secondary actor and Holy Protection | Hallowed Blade Dance |
| Hallowed Ranger | SSR | Shot artillery, wing route | Megashark, Daedalus arrows and ammo conversion | Holy Arrow Monsoon |
| Hallowed Mage | SSR | Beam/Lob caster, wing route | Crystal Storm, Rainbow Rod route and mana economy | Prism Constellation |
| Hallowed Summoner | SSR | minion/whip conductor | Optic Staff capped duo, Durendal mark and ally tempo | Twin-Eye Stampede |
| Solar Terrarian | UR | melee heavy/flight | Solar Eruption tether, Daybreak spears and shield dash | Solar Flare Awakening |
| Vortex Terrarian | UR | ranged stealth/flight | Phantasm sequence, Vortex Beater and stealth multiplier | Vortex Singularity |
| Nebula Terrarian | UR | magic support/flight | Nebula Blaze, Arcanum orbit and booster pickups | Nebula Cascade |
| Stardust Terrarian | UR | summon commander/flight | Stardust Dragon segmented summon and cell marks | Guardian of Stardust |

Minion counts are bounded secondary actors, not extra party members. Endgame
URs are legal together only across different families; the Terrarian family
lock forces the player to choose one class identity.

## 3. Boss fighters — 17 cards

Story bosses retain their true scale. Pullable records declare `large` or
`background` treatment and never reuse boss collision data directly.

| Fighter | Rarity | Playable grammar | Ultimate |
| --- | --- | --- | --- |
| King Slime | R | elastic Stomp, gel bounce and small-slime spawns | Royal Gel Crash |
| Eye of Cthulhu | R | airborne Charge with phase-two teeth rush | Servant Swarm |
| Eater of Worlds | SR | capped segmented burrow actor; split segments become timed hazards | Corruption Devour |
| Brain of Cthulhu | SR | teleport, Creeper orbit and clone phase | Crimson Confusion |
| Queen Bee | SR | aerial Charge, stinger Shot and bee summons | Hive Frenzy |
| Skeletron | SSR | background head with two targetable hand actors | Dungeon Curse |
| Wall of Flesh | SSR | background edge advances, eye Beams and Hungry tethers | Underworld Sweep |
| Queen Slime | SR | crystal Stomp, bouncing projectiles and wing phase | Hallow Downpour |
| The Destroyer | SSR | capped segmented background route and probe spawns | Mechanical Coil |
| The Twins | SSR | duo card: Retinazer Beam and Spazmatism flame Charge | Mechanical Crossfire |
| Skeletron Prime | SSR | head plus chosen two-arm loadout, not four permanent actors | Prime Spin Protocol |
| Plantera | SSR | rooted hook movement, seed Shot and enraged mouth phase | Jungle Overgrowth |
| Golem | SSR | heavy fists as returning actors and detached-head Beam | Lihzahrd Awakening |
| Duke Fishron | SSR | water-air Charges, sharknado hazards and phase blur | Razorblade Typhoon |
| Empress of Light | UR | prismatic lance patterns, flight and daytime-risk passive | Ethereal Daybreak |
| Lunatic Cultist | SSR | ritual clones, elemental attacks and summon failure tell | Celestial Ritual |
| Moon Lord | UR | background hands/head zones, eye Beams and leech tether | Phantasmal Apocalypse |

Segmented bosses have a strict decoded-memory and actor-count budget. If a
pullable treatment cannot preserve their silhouette inside it, they remain
boss-only instead of becoming a tiny generic worm.

## 4. Accessories — 25 Power-Ups

Terraria labels the shared Power-Up slot `Accessory`. The game still permits
one per fighter, not Terraria's native multi-accessory loadout; this preserves
Pocket Gacha's readable team-building rules.

| Rarity | Accessories | Effect direction |
| --- | --- | --- |
| R | Hermes Boots; Cloud in a Bottle; Band of Regeneration; Shackle; Aglet; Magiluminescence | Move, low-air hop, healing, Guard, acceleration, target visibility |
| SR | Obsidian Shield; Feral Claws; Magic Cuffs; Warrior Emblem; Ranger Emblem; Sorcerer Emblem; Summoner Emblem; Frog Gear; Bundle of Balloons; Worm Scarf; Brain of Confusion; Hive Pack | knockback/fire guard, Combo speed, energy on hit, class damage leans, route traits, mitigation/evasion, bee proc |
| SSR | Ankh Shield; Master Ninja Gear; Celestial Shell; Fire Gauntlet; Sniper Scope; Papyrus Scarab | condition resist, dodge/dash, adaptive stats, melee Burn, backline crit, summon cap/potency |
| UR | Celestial Starboard | post-ultimate flight Awakening with star-bolt trail |

Class Emblems grant a pattern/stat lean, not a compatibility lock. A mage can
equip a Warrior Emblem in Endless if the player accepts the weaker synergy.

## 5. NPC Assist Pages — 16

NPCs stay useful without pretending each can sustain four combat moves.

| Assist | Rarity | Trigger | Intervention |
| --- | --- | --- | --- |
| Guide | R | first unfamiliar boss phase | reveals reactions and safest band for 10 s |
| Merchant | R | first party member below 40% HP | throws a Lesser Healing Potion and coin shield |
| Nurse | R | two allies below 35% HP | large heal with a long once-stage lockout |
| Angler | R | aquatic wave starts | grants Aquatic trait and marks a reward fish target |
| Demolitionist | R | four enemies group | throws one telegraphed grenade Lob |
| Arms Dealer | R | backline is pressured | covering Minishark fire and 8 s ranged Haste |
| Dryad | SR | second condition lands | Dryad's Blessing cleanses and raises Guard |
| Goblin Tinkerer | SR | a Power-Up proc is spent | reforges it, reducing that proc's cooldown once/stage |
| Mechanic | SR | mechanical boss exposes a zone | wires a trap that adds stagger on the next three hits |
| Witch Doctor | SR | summon actor is defeated | restores one capped summon and grants summon Haste |
| Wizard | SR | party energy falls below 25% | mana star shower grants energy over visible pickups |
| Steampunker | SR | stage hazard persists 8 s | Clentaminator clears one hazard lane |
| Cyborg | SSR | boss add wave begins | rocket barrage across marked lanes |
| Pirate | SSR | elite chest/reward carrier enters | cannon broadside and bonus Coin mark, bounded once/stage |
| Truffle | SSR | party takes repeated contact damage | mushroom field heals and applies confusion to Small enemies |
| Princess | SSR | final boss phase starts | Resonance Scepter pulse grants shield, Haste and condition resist |

No Assist trigger requires owning a particular fighter or rolling a specific
Accessory. Daily missions may ask for broad class, rarity or pattern tags only.

## 6. Pre-Hardmode World — 25 stages

| Area | Stages | Environments / encounter lessons | Boss packet | Releases |
| --- | ---: | --- | --- | --- |
| A New World | 1–5 | forest night, caves, desert, slimes, zombies and falling stars | King Slime → Eye of Cthulhu finale | Copper Adventurer, King Slime, Eye; basic Accessories/Guide |
| Corruption or Crimson | 6–10 | player chooses evil route; chasms, hearts/orbs, eater/face enemies | Eater of Worlds or Brain; unchosen route remains replayable | Shadow Charger, Crimson Berserker, both bosses through route focus |
| Jungle and Hive | 11–15 | poison, hornets, spores, Goblin Army interlude | Queen Bee | Jungle Mage, Bee Summoner; Dryad/Witch Doctor Pages |
| Dungeon and Ocean | 16–20 | cursed skulls, traps, water bands and rescue routes | Skeletron | Necro Ranger, Skeletron; Mechanic/Angler Pages |
| Underworld | 21–25 | lava lanes, imps, voodoo protection and moving-edge pressure | Wall of Flesh | Molten Vanguard, Wall; Obsidian/Emblem Supply |

This World releases fourteen fighters if both evil-route bosses/armors are
eventually completed, inside the 25-stage budget. The player need not clear both
routes to unlock Hardmode; the unchosen branch remains selectable.

## 7. Hardmode World — 25 stages

| Area | Stages | Environments / encounter lessons | Boss packet | Releases |
| --- | ---: | --- | --- | --- |
| Hallow and New Evil | 1–5 | biome conversion, mimic elites and crystal hazards | Queen Slime | four Hallowed class fighters roll out through focused shelves |
| Mechanical Night | 6–10 | probe management, duo targeting and rotating limbs | Destroyer/Twins/Prime gauntlet | three mech bosses; class Accessories |
| Jungle Awakens | 11–15 | bulbs, enraged surface rule and temple key | Plantera | Plantera; later-class focus begins |
| Temple, Ocean and Daylight | 16–20 | traps, water Charges and prismatic pattern exam | Golem; optional Duke/Empress Hunts | Golem in Story; Duke and Empress via permanent Wanted Hunts |
| Celestial End | 21–25 | cult ritual, four pillar rule and background target zones | Cultist → Moon Lord | Cultist, Moon Lord; four endgame Terrarians across Mythic rotations |

Hardmode has eighteen candidate fighters. Fifteen may release through Story and
concurrent focus; Duke, Empress and one endgame rotation may remain permanent
post-World Hunts so the banner does not exceed the World budget.

## 8. Runtime systems this Saga requires

1. capped minion ownership and deterministic summon replacement;
2. segmented actors with one health owner and bounded visible segments;
3. boss zones/hands that share a background body;
4. world-side advancing hazards for Wall of Flesh;
5. player-route choice that keeps the other route replayable;
6. class/pattern tags for Accessory synergy without compatibility locks;
7. severe particle, projectile and decoded-atlas budgets;
8. day/night and biome rules expressed in encounter data, not global hacks.

## 9. Production freeze

When Terraria eventually enters production, freeze stages 1–5 with Copper
Adventurer, basic slimes/zombies, King Slime and Eye of Cthulhu. Prove minions
only after ordinary projectiles and secondary actors are stable. Do not begin
Moon Lord, four UR class sheets or a bulk item import as the first task.

Numerical cards remain deferred until the Saga enters production Wave. Every
museum entry above must still pass sprite-state and strip-scale review.

## 10. Research/provenance notes

Boss progression and names were cross-checked against the Official Terraria
Wiki on 2026-10-14. Native game assets are not automatically licensed for this
project; every import still needs source, hash, rights status and owner approval.

Reference: <https://terraria.wiki.gg/wiki/Bosses>
