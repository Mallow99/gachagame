# Content catalog

Everything beyond the first five stages is a **CANDIDATE** until its assets and
kit pass production gates. This document provides coherent homes and ordering
for ideas; it does not authorize mass asset work.

## 1. Content rule: one game, one World by default

A Saga is a franchise. A World normally adapts one specific game and preserves
its visual era, locations, enemy vocabulary and major bosses. This gives the
Library a clear historical progression from older sprite sets to newer/custom
treatments.

Exceptions are explicit:

- a tiny arcade game may be a 5- or 10-stage World;
- a very large game may be split into multiple Worlds;
- a game without five named bosses can promote an original elite into a labeled
  `Remix Boss` rather than borrowing a famous boss from another title;
- a crossover party may enter any World; the active party is not forced to
  reenact the source plot;
- a character may release early through its franchise Archive when its full
  sprite, art, kit and provenance are production-ready; its card still names
  the real source game. Fame alone does not move King Boo into an SMB1 stage.

The Atlas renders a Saga as an evocative Hub such as Mushroom Kingdom or Dream
Land. See `13_HUBS_BANNERS_AND_PRESENTATION.md`: title-specific Worlds preserve
history, while the Saga Archive can offer released iterations across titles.

## 2. Opening complete Worlds: recommended production path

There is no global “first 50” track. Production finishes complete Worlds and
the player chooses among shipped destinations after the opener. The recommended
first two builds total 35 local stages: 15 for *Super Mario Bros.* and 20 for
*Kirby's Adventure*. Shortening the source games is preferable to manufacturing
filler merely to hit 25.

## World 1 — Super Mario Bros. (1985), stages 1–15

The source has eight short Worlds but few unique named bosses. Fifteen stages
preserve its complete enemy/environment arc without inventing five modern-style
guardians. The initially imagined airship moves to *Super Mario Bros. 3*;
Goomba King, King Bob-omb, King Boo and Bowser Jr. wait for their proper games
as story enemies. A production-ready fighter iteration may appear in the Mario
Archive earlier without changing these stages. Target first-clear time is 3–5
active hours including Camp, management and early pulls.

### Area 1: Overworld, stages 1–5

| Stage | Encounter purpose | Enemy/wave plan | Environment/rule | Unlock/reward |
| ---: | --- | --- | --- | --- |
| 1 | teach approach and stomp | Goombas; final Goomba pair | grass, blocks, no hazard | Training, Camp |
| 2 | teach shells/body blocking | Goomba + green/red Koopa Troopa | low pipes, shell ricochet tell | party rows |
| 3 | teach fixed hazard target | Piranha Plants behind Koopa line | pipes periodically close/open | first Power-Up slot |
| 4 | teach arcing projectiles | one Hammer Bro elite plus fodder | brick tiers, safe gaps | boss hint/report |
| 5 | Area exam | staggered Hammer Bros.; phase two enrages survivor | long bridge, falling hammers | first ten-pull, Supply page |

Boss identity: the brothers alternate jumps and hammer fans until one falls;
the survivor gains Haste and a ground-pound. Ranged access is helpful but the
free party can win through Training and sustain.

### Area 2: Open Water and High Roads, stages 6–10

| Stage | Encounter purpose | Enemy/wave plan | Environment/rule | Unlock/reward |
| ---: | --- | --- | --- | --- |
| 6 | armored target | Buzzy Beetles + Koopas | underground ceiling weakens high arcs | Guard Break tutorial |
| 7 | aquatic movement | Cheep-cheeps in schools | water drag; projectiles curve slowly | Aquatic trait shown |
| 8 | vertical pressure | Bloopers + Cheep-cheeps | swim bands and ink tell | Assist charge tutorial |
| 9 | airborne priority | Paratroopas, Spinies and one Lakitu | bridge/sky transition | target-rule tutorial |
| 10 | Lakitu Area boss | armored cloud, Spiny rain, cloud dive | high road with safe windows | Lakitu focus, preset 2 |

Boss identity: breaking the cloud's stagger meter drops Lakitu into melee range.
Airborne specialists speed the fight; a balanced free team can weather it.

### Area 3: Dark World and Bowser's Castle, stages 11–15

| Stage | Encounter purpose | Enemy/wave plan | Environment/rule | Unlock/reward |
| ---: | --- | --- | --- | --- |
| 11 | night remix | faster Goombas/Koopas + Piranhas | dusk palette, shorter tells | Mastery preview |
| 12 | projectile gauntlet | Hammer Bros. + Bullet Bills | tiered brick approach | anti-projectile Supply trial |
| 13 | lava discipline | Buzzy Beetles, Podoboos, fire bars | rotating safe bands | Fire mitigation hint |
| 14 | castle endurance | mixed elites; final wave is an Impostor Bowser | looping corridor, bridge stagger | finale preview, elite chest |
| 15 | Bowser World boss | phase 1 fire/leaps; phase 2 hammers/flame; bridge stagger finale | lava bridge, phase floor | Bowser pool, Atlas Key, Archive |

The stage-14 impostor is a miniboss wave, not a fourth Area boss. Filling bridge
stagger creates the axe opening and reveals the disguised original enemy.

Bowser is an SSR boss fighter candidate, scaled to party size when playable.
His focused rate unlocks after defeat; UR status is not awarded merely for
being the first final boss.

### Super Mario Bros. release set

The World is intentionally compact. Enemy recruits help its banner without
inventing unrelated variants.

| Availability | Fighters | Supply |
| --- | --- | --- |
| Library prologue | R Classic Mario, R Classic Luigi, R Toad, R Princess Peach; SSR Bowser advertised in the base pool | R Super Mushroom, R Flagpole Rush Page |
| Area 1 | R Koopa Troopa; SR Hammer Bro | SR Fire Flower, R Toad Retainer Page |
| Area 2 | R Blooper; SR Buzzy Beetle specialist; SR Lakitu after defeat | SR Underwater Breather, SR Cloud Ride, SR Princess's Wish Page |
| Area 3 | SSR Bowser gains his featured focus after defeat | SR Castle Axe Page, SSR Bowser's Bridge Page; UR Super Star Mythic candidate |

`Classic Mario` and later complete Mario iterations share `familyId: mario`.
Fire Mario is initially Mario plus Fire Flower, not another fighter. Peach and
Toad use reconstructed era-coherent sheets if no honest battle sheet exists;
their production grade must not be hidden.

### First-slice fighter blueprints

These are **TRIAL** kits for engine/data planning. A move may change if the
approved sheet cannot animate it; rarity and combat job should remain stable.
The exact current cards and corrected ultimate coefficients in
`14_MARIO_KIRBY_CHARACTER_BIBLE.md` supersede older numbers in this compact
summary.

| Fighter | Role/pattern | Level-1 R stats or rarity basis | Basic and skill | Passive and ultimate |
| --- | --- | --- | --- | --- |
| Classic Mario (R, free) | Bruiser / Stomp | HP 1,100; ATK 99; Guard 42; Move 123; Haste 0% | 1.15-coefficient stomp; `Brick Break` every 10 s splashes and adds boss stagger | +10% Coin from his kills; `Course Clear` runs through the line, stomps backmost target and grants team +15% Haste for 8 s |
| Classic Luigi (R, free) | Controller / Charge | HP 980; ATK 94; Guard 36; Move 132; Haste 3% | 1.08 high-jump charge; `Evasive Retreat` every 9 s hits for 0.90 and slides him to safety | movement grants 8 Guard; `Backline Bound` chains three 1.20 stomps into a 2.20 landing plus 0.60 splash |
| Toad (R, free) | Striker / Combo | HP 900; ATK 102; Guard 30; Move 138; Haste 4% | three 0.40 hits; `Emergency Delivery` every 12 s heals the lowest ally for 60% ATK | +8% Haste for each wave's first 6 s; `Retainer Rush` deals six 0.85 hits plus a 1.20 finisher |
| Princess Peach (R, free) | Support / Lob | HP 940; ATK 88; Guard 34; Move 112; Haste 0% | 0.82 turnip plus 0.35 splash; `Royal Shield` every 11 s shields the lowest ally for 80% ATK | heals party for 18% ATK after waves; `Princess's Wish` cleanses, heals 220%, shields 150% and grants Haste |
| Koopa Troopa (R) | Vanguard / Strike | HP 1,280; ATK 80; Guard 67; Move 108; Haste 0% | 1.00 shell jab; `Shell Guard` taunts and gains 45 Guard for 4 s | low HP creates a kickable shell; `Ricochet Route` makes four 1.25 passes plus a 2.00 exit hit |
| Hammer Bro (SR) | Artillery / Lob | HP 897; ATK 129; Guard 28; Move 108; Haste 0% | 0.90 arc plus 0.40 splash; `Hammer Fan` sends three 0.62 hammers | +35% damage to Airborne; `Hammer Storm` deals eight 0.90 impacts plus a 1.20 center hit |
| Blooper (R) | Controller / Combo | Controller baseline; Aquatic | pulsing tentacle combo; `Ink Cloud` reduces enemy range/accuracy for 4 s | faster movement in Aquatic encounters; `Deep Ink` marks all enemies and dives the backline |
| Buzzy Beetle (SR) | Vanguard / Charge | Vanguard stats × SR; +20 Guard, -12 Move | shell charge; `Ceiling Drop` targets farthest enemy where legal | takes 35% less Projectile damage; `Unbreakable Shell` blocks then reflects bounded damage |
| Lakitu (SR) | Artillery / Lob | Artillery stats × SR; Airborne | Spiny Egg lob; `Spiny Rain` summons two short-lived Spinies | remains at extreme range until cloud staggered; `Storm Cloud` Slows and strikes marked zones |
| Bowser (SSR, signature) | Vanguard / Charge | HP 1,960; ATK 126; Guard 72; Move 92; Haste -2% | two 0.58 claws; `Royal Flame` deals four 0.34 ticks and Burn every 11 s | 45% of control converts to stagger; `King of the Koopas` deals 2.40 impact plus eight 0.75 flame ticks |

Mario, Luigi, Toad and Peach are granted; their later duplicates can still
star them. Enemy fighters join only after the relevant encounter. Bowser is the
declared signature-antagonist exception so the opening pool has an honest SSR;
his featured focus begins after defeat. His playable kit is scaled to the strip
and does not reuse the World-boss HP/phase record.

### First-slice Supply blueprints

| Supply | Rarity/type | Trial effect |
| --- | --- | --- |
| Super Mushroom | R Power-Up | +8% max HP; first heal received each stage is 20% stronger |
| Fire Flower | SR Power-Up | compatible basic gains Fire; every fourth basic launches a 0.65 shot and Burn |
| Cloud Ride | SR Power-Up | compatible fighter becomes Airborne and gains +15% Move; loses 10 Guard |
| Flagpole Rush | R Assist Page | +8% Move; clearing a wave grants 5 energy to the party |
| Toad Retainers | R Assist Page | first knockout attempt instead heals that ally for 60% ATK-equivalent; once/stage |
| Princess's Wish | SR Assist Page | at 40 s and every 40 s, shield the two lowest-HP allies for 80% support-scale Attack |
| Castle Axe | SR Assist Page | boss stagger damage +20%; no effect on ordinary damage |
| Super Star | UR Power-Up / Mythic | at full wearer energy, 12 s invulnerable contact-damage state; consumes the party Mythic slot |

Exact compatibility and scaling source are data fields. The Super Star is not
obtainable during the five-stage slice; it is the first post-World Mythic test.

## World 2 — Kirby's Adventure (1993), stages 1–20

This is the second recommended production World because it proves flight,
copy-ability Power-Ups, guarded bosses and a different silhouette while staying
sprite-friendly. Twenty stages fit its useful variety without requiring every
original level or miniboss to become a separate Area. The Saga can be titled
Dream Land in the Atlas; the World card names the specific game.

### Area 1: Vegetable Valley, stages 1–5

| Stage | Encounter purpose | Enemy/wave plan | Environment/rule | Boss/reward |
| ---: | --- | --- | --- | --- |
| 1 | establish Dream Land pace | Waddle Dee, Bronto Burt | rolling hills, softer knockback | Kirby copy slot |
| 2 | introduce copy traits | Hot Head, Sir Kibble | Fire/Cutter pickups as Supply preview | Fire/Cutter trial |
| 3 | mixed altitude | Parasol Waddle Dee + Poppy Bros. Jr. | drifting landings | aerial targeting |
| 4 | apple telegraph | Rocky + Waddle Doo elite | tree canopy hazards | boss hint |
| 5 | Whispy Woods | apple drops, breath push, root adds | fixed giant background boss | Whispy Page/focus |

### Area 2: Butter Building and Grape Garden, stages 6–10

| Stage | Encounter purpose | Enemy/wave plan | Environment/rule | Boss/reward |
| ---: | --- | --- | --- | --- |
| 6 | gallery remix | Paint Roller drawings + mixed copy enemies | spawned icons telegraph | Assist preview |
| 7 | vertical tower | Rocky, Sword Knight | elevator bands | Sword focus |
| 8 | speed lanes | Wheelie, Laser Ball | rotating tower parallax | Haste report |
| 9 | ascent survival | Kracko Jr., Bronto Burt, lightning | upward-scroll illusion | boss hint |
| 10 | Kracko | orbit, lightning lanes, Waddle Doo drops | storm ceiling | Kracko Page/focus |

### Area 3: Yogurt Yard and Orange Ocean, stages 11–15

| Stage | Encounter purpose | Enemy/wave plan | Environment/rule | Boss/reward |
| ---: | --- | --- | --- | --- |
| 11 | heavy melee | Bonkers + Rocky | slopes, ground shock | Hammer Power-Up |
| 12 | water/land swap | aquatic enemies + Sir Kibble | tide bands | formation preset 3 |
| 13 | knight formation | Blade/Axe/Mace/Spear Knights | disciplined rows | Guard-break exam |
| 14 | duel etiquette | Meta-Knight squad and offered sword motif | reduced frontal boss damage | Sword loan |
| 15 | Meta Knight | sword strings, tornado, cape reposition | moonlit arena | SSR Meta Knight focus |

### Area 4: Rainbow Resort and Fountain of Dreams, stages 16–20

| Stage | Encounter purpose | Enemy/wave plan | Environment/rule | Boss/reward |
| ---: | --- | --- | --- | --- |
| 16 | memory remix | fast combinations of earlier enemies | shifting palettes | full copy Archive |
| 17 | dream distortion | mirrored spawns and Scarfy pressure | labeled target decoys | Nightmare hint |
| 18 | fountain defense | Meta-Knights + dream hazards | Star Rod charges between waves | finale Supply focus |
| 19 | Dedede's warning | King Dedede: hammer, inhale and pounce | ring arena | SSR Dedede focus |
| 20 | Nightmare | Power Orb chase then vulnerable-cloak Wizard | falling sky → moon finale | UR Star Rod Kirby candidate, Key |

The finale follows the source's logic: Dedede was containing Nightmare. Dedede
is a stage-19 miniboss encounter so Nightmare receives a complete two-phase
World finale.

### Kirby's Adventure release set

| Availability | Fighters | Supply |
| --- | --- | --- |
| World unlock | R Kirby, R Parasol Waddle Dee, R Poppy Bros. Jr. | R Parasol, R Beam, R Dream Spring Page |
| Area 1 | SR Sir Kibble, SR Hot Head | SR Cutter, SR Fire, Whispy's Apples Page |
| Area 2 | SR Wheelie, SR Sparky, SR Rocky | SR Ice, SR Spark, Kracko Storm Page |
| Area 3 | SR Bonkers; SSR Meta Knight after defeat | SR Hammer, SSR Sword, Halberd Knights Page |
| Area 4 | SSR King Dedede; boss-only Nightmare unless animation works | SSR Star Rod Page; UR Star Rod Kirby fighter candidate |

Copy abilities are normally Power-Ups. Star Rod Kirby can be a separate UR
because the complete finale movement/attack set and identity justify a fighter,
not because every copied hat deserves a unit.

## 3. Mario Saga title map

These Worlds preserve the ideas already requested while placing them in a
coherent source game.

| World/source game | Length | Five-stage Area direction | Signature bosses/finale | Roster and Supply hooks |
| --- | ---: | --- | --- | --- |
| Super Mario Bros. | 15 | Overworld; Open Water/High Roads; Dark World/Bowser Castle | Hammer Bros.; Lakitu; Impostor miniboss/Bowser | Classic cast, Fire Flower, Super Star |
| Super Mario Bros. 3 | 25 | Grass/Desert; Sea/Giant; Sky; Ice/Pipe; Dark Land | Boom Boom; Angry Sun remix; Giant guardian; Koopaling airship; Bowser | Koopalings SR batch, R Daisy candidate only if justified, Tanooki/Leaf/Hammer suits |
| Super Mario World | 20 | Yoshi's Island/Donut; Vanilla Dome; Forest; Chocolate/Valley | Iggy; Reznor; Big Boo; Koopaling gauntlet/Bowser | Yoshi/color specialists, Cape/Feather, Switch Palace Pages |
| Super Mario 64 | 20 | Bob-omb/Whomp; Jolly/Lethal Lava; Big Boo; clock/castle finale | King Bob-omb; Whomp King; Big Bully/Big Boo; Bowser | 64 Mario iteration, Metal/Wing/Vanishing Caps |
| Paper Mario | 20 | Goomba/Koopa; Dry Dry; Boo Mansion; Star Haven/Bowser | Goomba King/Koopa Bros.; Tutankoopa; Tubba Blubba; Bowser | Paper Mario, partners as fighters/Assists, badges as Supply |
| Luigi's Mansion | 15 | foyer/portrait rooms; basement/roof; altar | Chauncey; Bogmire/Boolossus; King Boo | Poltergust Luigi, E. Gadd Page, elemental medals; King Boo SSR |
| Super Mario Sunshine | 20 | Bianco/Ricco; Pinna; Noki/Sirena; Corona | Petey/Gooper; Mecha-Bowser; Eely/Phantamanta; Bowser Jr./Bowser | Sunshine Mario, FLUDD kits, Shadow Mario, Pianta Pages |
| Super Mario Galaxy | 25 | Good Egg; Honeyhive; Battlerock; Engine Room; Center | Dino Piranha; Bugaboom; Topmaniac; Bowser Jr. machine; Bowser | Galaxy Mario, Rosalina, Luma Assists, Bee/Spring/Boo Power-Ups |
| Super Mario 3D World | 15 | Sprixie fields; carnival/train; castle | Boom Boom/Pom Pom; Hisstocrats/Motley; Meowser | Cat/Super Bell, Double Cherry, Captain Toad iteration |
| Super Mario Odyssey | 25 | Cascade; Sand; Wooded/Lake; Metro/Luncheon; Moon | Madame Broode; Hariet; Torkdrift; Mechawiggler; Broodals/Bowser | Cappy Mario iteration, captures as skills/Assists, regional Pages |
| Bowser's Fury | 10 | Lake islands; Ruins/Lapcat | Fury Shadow remix; Fury Bowser | Fury Bowser UR, Giga Bell UR Power-Up, Bowser Jr. Assist |
| Super Mario Bros. Wonder | 20 | Flower Kingdom biomes; Wonder gauntlets | authored title bosses and Bowser finale | Elephant/Bubble/Drill Power-Ups, Wonder Pages |

Mario releases normally focus with their source Worlds, but approved iterations
may enter the Mushroom Kingdom Archive earlier. The opening expansion targets
Yoshi (SMW) and Mario 64 so multiple eras are visible during the first Hub. The
plan still does not front-load every Koopaling, color and iteration into launch.

### Mario family/rarity guide

- R introductions: Mario, Luigi, Peach, Toad and Daisy when their base entry ships.
- SR specialists: Hammer Bro, Lakitu, Captain Toad, colored Yoshis with real kit
  differences, base Yoshi's tongue/egg kit, Koopalings, Kamek, Bowser Jr.,
  Wario, Waluigi and Petey Piranha.
- SSR signatures/bosses: Bowser, King Bob-omb, King Boo, Paper Mario, Sunshine
  Mario, major era bosses.
- UR candidates: Fury Bowser, Star-powered/Invincible Mario only if a full kit
  exists, a peak Galaxy/Rosalina treatment, or another truly build-defining
  interpretation. Retro status alone is not an UR qualification.

## 4. Other classic Sagas

### Kirby Saga / Dream Land shelf

| Source game | Length | Area spine | Major unlocks |
| --- | ---: | --- | --- |
| Kirby's Adventure | 20 | detailed above | base Kirby, Meta Knight, Dedede, ability Supply, Star Rod UR |
| Kirby Super Star | 25 | Spring Breeze; Dyna Blade; Great Cave; Revenge; Milky Way | Marx, Dyna Blade, Helper fighters/Assists, copy expansions |
| Kirby & the Amazing Mirror | 15 | mirror regions; Dark Meta path; Dimension Mirror | colored Kirby treatment, Dark Meta Knight, mirror Assists |
| Return to Dream Land | 20 | Cookie; Raisin; Onion; Halcandra | Magolor, Super Abilities, Landia finale |
| Planet Robobot | 20 | mechanized Popstar districts | Robobot Armor Power-Up/iteration, Susie, Haltmann |
| Kirby and the Forgotten Land | 25 | plains; coast; carnival; winter; Lab Discovera | Bandana Dee, Mouthful effects, Clawroline, Fecto Elfilis |

### Mega Man Saga

The exact *Mega Man 2* fighter cards, Special Weapon rule and 20XX regional
Archive additions are specified in `15_MEGA_MAN_CHARACTER_BIBLE.md`.

| Source game | Length | Area spine | Boss/roster plan |
| --- | ---: | --- | --- |
| Mega Man 2 | 20 | four Robot Master pairs; Wily Fortress | eight Robot Masters grouped in pairs; Wily multi-phase; weapons as Power-Ups |
| Mega Man 3 | 20 | four Master pairs; Doc Robot/Wily | Proto Man, Rush Assists, Robot Masters |
| Mega Man X | 20 | Highway/Maverick pairs; Sigma Fortress | X, Zero, eight Mavericks, armor parts as Supply |
| Mega Man X4 | 20 | Repliforce regions and Final Weapon | X/Zero iterations, Iris Page, Sigma |
| Mega Man Zero | 20 | Resistance missions; Neo Arcadia | Zero iteration, Ciel Assist, Copy X |
| Mega Man Battle Network | 15–20 | internet areas and WWW | adaptation-heavy; NetNavis need bespoke movement plan |

Capcom's own Legacy Collection material counts 81 classic Robot Masters across
the collections; this is a deep long-term Saga, not a reason to release them
all in one banner.

### Sonic Saga

| Source game | Length | Area spine | Boss/roster plan |
| --- | ---: | --- | --- |
| Sonic the Hedgehog | 15 | Green Hill/Marble; Spring Yard/Labyrinth; Star Light/Scrap Brain | Sonic, Eggman machines, shield Supply |
| Sonic the Hedgehog 2 | 20 | Emerald/Chemical; Aquatic/Casino; Hill/Metropolis; Wing Fortress/Death Egg | Tails, Mecha Sonic, Super Sonic UR candidate |
| Sonic 3 & Knuckles | 20 | Angel/Hydrocity; Carnival/IceCap; Launch Base; Doomsday | Knuckles, elemental shields, Mecha Sonic/Super forms |
| Sonic Mania | 20 | remixed classic zones plus Studiopolis/Press Garden | Mighty/Ray candidates, Hard-Boiled Heavies |
| Sonic Adventure | 25 | Station Square; Mystic Ruins; carrier; Chaos path; Perfect Chaos | 3D/custom sprite burden; Amy, Gamma, Big, Chaos |

### Zelda Saga

| Source game | Length | Area spine | Boss/roster plan |
| --- | ---: | --- | --- |
| A Link to the Past | 25 | Light World; Eastern/Desert; Death Mountain; Dark World; Ganon's Tower | Link, Zelda Assist, Sahasrahla Page, Agahnim/Ganon |
| Link's Awakening | 20 | Mabe/woods; prairie; bay; Tal Tal/Egg | Marin Assist, dungeon bosses, Wind Fish Page |
| Ocarina of Time | 25 | child forest; Death Mountain; Zora; adult temples; Ganon | era Link iterations, Sheik, sages as Assists |
| Majora's Mask | 20 | Clock Town; swamp; mountain; ocean/moon | transformation masks as Power-Ups, Skull Kid/Majora |
| The Minish Cap | 15 | Hyrule/Minish; mountain; palace | Ezlo Assist, Vaati, size-change mechanic |
| Breath of the Wild | 25 | plateau; four regions; castle | custom sprite grade, Champions, runes, Calamity Ganon |
| Tears of the Kingdom | 25 | surface; sky; depths; temples; finale | highest custom-art burden; Sages and Zonai Supply |

Base Link iterations share a family. Masks, rods and equipment are Supply unless
they create an entire independent move set.

### Metroid Saga

| Source game | Length | Area spine | Boss/roster plan |
| --- | ---: | --- | --- |
| Metroid | 20 | Brinstar; Norfair; Kraid; Tourian | Samus, Kraid, Ridley, Mother Brain; beam/suit Supply |
| Super Metroid | 25 | Crateria; Brinstar; Norfair; Wrecked Ship/Maridia; Tourian | signature Samus iteration, four major bosses |
| Metroid Fusion | 20 | station sectors and restricted lab | Fusion Suit Samus, SA-X, Nightmare, X traits |
| Metroid Dread | 25 | Artaria through Itorash grouped by route | custom/converted sprite need, E.M.M.I. hazards, Raven Beak |

### Castlevania Saga

| Source game | Length | Area spine | Boss/roster plan |
| --- | ---: | --- | --- |
| Castlevania | 15 | grounds/halls; caverns; keep | Simon, subweapons, Medusa, Death, Dracula |
| Castlevania III | 20 | branching Wallachia route | Trevor, Sypha, Grant, Alucard, Dracula |
| Symphony of the Night | 25 | entrance; chapel; library; caverns; inverted keep | Alucard, Richter, Maria, Death, Dracula/Shaft |
| Aria of Sorrow | 20 | castle sectors and Chaos | Soma, soul Power-Ups, Julius, Graham/Chaos |

### Doom Saga

| Source game | Length | Area spine | Boss/roster plan |
| --- | ---: | --- | --- |
| Doom | 20 | Knee-Deep; Shores; Inferno; Thy Flesh/finale | Doomguy, weapon Supply, Barons, Cyberdemon, Spider Mastermind |
| Doom II | 25 | starport; city; hell; fortress; Icon | expanded demons, Super Shotgun, Icon of Sin |
| Doom 64 | 20 | bases; temples; hell; Mother Demon | Doom 64 Marine iteration, Unmaker |
| Doom (2016) | 25 | UAC; Foundry; Argent; Hell; VEGA/finale | bespoke modern sprites, Praetor suit, Cyberdemon/Spider Mastermind |

## 5. RPG and strategy Sagas

These have plentiful battle sprites but often lack running/hit/roaming frames.
They remain later than the naturally animated platform/fighting Sagas.

### Pokémon Saga

**Working unit model:** Pokémon are fighters; Trainers are Assist Pages and
banner art partners. Evolution lines share a family lock where simultaneous
forms would feel like duplicate versions. This is cheaper and more animated
than making static trainers physically attack. Revisit only after a prototype.

| Source game | Length | Area spine | Boss/roster plan |
| --- | ---: | --- | --- |
| Red/Blue | 25 | Pallet/Pewter; Cerulean/Vermilion; Celadon/Fuchsia; Saffron/Cinnabar; League | starters, Pikachu, gym Assists, Giovanni, rival, Mewtwo Mythic candidate |
| Gold/Silver | 25 | early Johto; coast; Ecruteak; Rockets; League/Mt. Silver | Johto starters, beasts, Lugia/Ho-Oh candidates |
| Emerald | 25 | Hoenn routes; seas; magma/aqua; sky; League | weather teams, Rayquaza UR candidate |
| Platinum | 25 | Sinnoh regions; lakes; Galactic; Distortion; League | Cynthia Assist, Giratina candidate |
| Black/White | 25 | Unova route; cities; Plasma; castle | N Assist/fighter question, dragons, animated Gen V sheets |

Public sprite repositories make Pokémon technically abundant, but public access
does not grant IP permission. Every imported source remains in the provenance
manifest.

### Dragon Quest Saga

| Source game | Length | Area spine | Boss/roster plan |
| --- | ---: | --- | --- |
| Dragon Quest III | 25 | Aliahan; desert; seas; Baramos; Alefgard/Zoma | Hero/party vocations, Slime recruits, Baramos/Zoma |
| Dragon Quest V | 20 | childhood; travel; family; underworld | Hero family, monster recruits, Nimzo |
| Dragon Quest VIII | 25 | Farebury; abbey; kingdom; dark ruins; Rhapthorne | Eight, Yangus, Jessica, Angelo; tension Supply |
| Dragon Quest XI | 25 | Erdrea regions; academy; world tree; altered world; finale | later/custom sprite burden, Luminary party |

### Final Fantasy Saga

Each numbered title is its own World line rather than one 25-stage collage.

| Source game | Length | Area spine | Boss/roster plan |
| --- | ---: | --- | --- |
| Final Fantasy I | 20 | four crystals and Chaos shrine | Warrior of Light/jobs, Fiends, Chaos |
| Final Fantasy IV | 25 | Baron; Fabul; underworld; moon; core | Cecil iterations share family, Kain/Rydia/Rosa, Golbez/Zeromus |
| Final Fantasy VI | 25 | Narshe; Returners; Empire; Floating Continent; World of Ruin | Terra, Locke, Celes, Sabin, Kefka; huge roster released gradually |
| Final Fantasy VII | 25 | Midgar; world route; Gold Saucer; crater approach; finale | Cloud party, materia Supply, Sephiroth |
| Final Fantasy IX | 25 | Mist; kingdoms; outer continent; Terra; Memoria | Zidane party, Eidolon Assists, Kuja/Necron |

### Fire Emblem Saga

| Source game | Length | Area spine | Boss/roster plan |
| --- | ---: | --- | --- |
| The Blazing Blade | 25 | Lyn; Eliwood; Hector; Black Fang; Dragon's Gate | lords, cavaliers, mages, Nergal/dragon |
| The Sacred Stones | 20 | twins' split routes and Grado | Eirika/Ephraim parties, Lyon/Fomortiis |
| Path of Radiance | 25 | Crimea escape; laguz; Begnion; Daein; Ashnard | Ike party, laguz transformation, Black Knight |
| Awakening | 25 | Plegia; Valm; future; Grima | custom sprite motion, pair-up Assist concept |

Weapon triangle is source flavor in individual kits, not a universal rule
forced onto every Saga.

### EarthBound Saga

| Source game | Length | Area spine | Boss/roster plan |
| --- | ---: | --- | --- |
| EarthBound Beginnings | 15–20 | towns; zoo/factory; desert; mountain | Ninten party, PSI effects, Giegue |
| EarthBound | 25 | Onett; Twoson/Threed; Fourside; Scaraba; Cave of the Past | Ness, Paula, Jeff, Poo; Sanctuary Assists; Giygas finale |
| Mother 3 | 25 | village; factory; islands; tower; final needle | Lucas party, Masked Man, Porky |

Turn-based source sprites require custom locomotion/effects. EarthBound should
not jump ahead of Sagas whose battle sheets already satisfy the strip.

## 6. Arcade Hall and Fighting Circuit

### Arcade Hall anthology

Small cabinets are allowed to stay small.

| Cabinet/source | Length | Encounter translation | Major unlocks |
| --- | ---: | --- | --- |
| Pac-Man | 5–10 | scrolling maze lanes, pellets, frightened windows | Pac-Man, four Ghost behaviors, Power Pellet Supply |
| Donkey Kong | 5 | girder lanes, barrels, springs, rivets | Arcade Mario iteration candidate, Donkey Kong boss |
| Dig Dug | 5 | dirt lanes, pump/rock hazards | Dig Dug, Pooka, Fygar |
| Galaga | 5–10 | formations, dives and tractor beam | Fighter ship unit/Assist, Boss Galaga |
| Bubble Bobble | 10 | bubbles, vertical waves, Baron pressure | Bub/Bob, bubble Power-Up |
| Ghosts 'n Goblins | 10–15 | graveyard through castle | Arthur, armor Power-Ups, Astaroth |

Cabinets can share an Arcade Hall presentation and Archive while retaining
separate World IDs, Threat snapshots and source manifests.

### Fighting Circuit

Fighting sheets are often excellent for roaming attacks and hit reactions.

| Source game | Length | Structure | Major unlocks |
| --- | ---: | --- | --- |
| Street Fighter II | 20 | world circuit; rivals; Shadaloo four | Ryu, Chun-Li, Guile, Cammy-era constraints, Balrog/Vega/Sagat/Bison |
| Street Fighter Alpha 3 | 20 | character routes grouped into regions | expanded cast, supers as ultimates |
| The King of Fighters '98 | 15–20 | team brackets and Orochi finale remix | team Assists, broad sprite-ready roster |
| Samurai Shodown II | 15 | travel duels and Mizuki finale | weapon-range identities |
| Guilty Gear XX | 15–20 | branch fights and final bosses | high-quality sheets, complex VFX budget |

Do not combine unrelated publishers into a single pull pool merely because they
are fighting games. Fighting Circuit is a shelf/presentation, not a rights or
balance shortcut.

## 7. Modern shelf

Modern games enter after the engine and asset approach are proven. Some already
use 2D sprites; others need custom reconstructions.

| Saga/source game | Length | Area spine | Roster/boss plan | Asset risk |
| --- | ---: | --- | --- | --- |
| Minecraft | 25 | Overworld; caves; ocean/nether; stronghold; End | Steve/Alex, mobs, Wither, Ender Dragon; tools/armor Supply | B: simple custom animation, strict usage review |
| Terraria pre-Hardmode | 25 | forest/desert; corruption; jungle; dungeon; underworld | player archetypes, Eye/Eater/Skeletron/Wall of Flesh | A–B: native sprites, many items |
| Terraria Hardmode | 25 | Hallow; mech; jungle temple; dungeon; Moon | mech bosses, Plantera, Golem, Moon Lord | A–B, effect-heavy |
| Hollow Knight | 25 | Crossroads; Greenpath; City; Deepnest; Temple | Knight, Hornet, Quirrel Assist, Mantis Lords, Hollow Knight/Radiance | A–B: strong native animation, sheet extraction/provenance |
| Among Us | 10 | Skeld; sabotages | Crewmate roles, Impostor boss, task Assists | B: simple, limited combat vocabulary |
| Henry Stickmin | 10–15 | prison; airship; complex; mission | Henry iterations, Ellie/Charles Assists, choice-failure gags | B–C: reconstruct animation |
| Bloons TD6 | 15–20 | beginner maps; military; magic; factories; boss event | Heroes/fighter towers, Bloon waves, Boss Bloons | B–C: adapt stationary towers to roaming or summons |

For Bloons, many towers are better summons/Assist Pages than fighters. The
official game itself distinguishes Monkey Towers, Heroes, Paragons, Powers and
Insta Monkeys; the adaptation should preserve those categories instead of
forcing everything to walk.

## 8. Roster construction rules

### A title release is healthy when it contains

- 3–6 accessible R introductions or enemy recruits;
- 2–5 SR specialists/lieutenants;
- 1–3 SSR signature units or defeated bosses;
- 0–1 UR candidate, often none;
- 4–10 Power-Ups and Assist Pages tied to actual mechanics;
- at least one free/story path to a complete four-unit team across the early
  Library, not necessarily four freebies per World.

These are ranges, not quotas. A five-stage cabinet can release two fighters and
two Supply items. A Final Fantasy World can hold most of its cast for reruns or
later Worlds rather than shipping 14 half-finished units.

### A fighter iteration must pass all five tests

1. distinct full move set, not one recolor or buff;
2. recognizable source-game identity;
3. family-lock choice changes a build;
4. usable animation plan at grade A/B or funded custom work;
5. release home and rarity budget exist.

If it fails, make it a Power-Up, Assist Page, skin, boss-only actor or park it.

### Boss-to-fighter rule

Defeating a boss may unlock it for a banner, but not every boss should become a
fighter. Giant/static bosses require one of:

- a canonical smaller form;
- a deliberately scaled playable version whose silhouette still reads;
- an Assist Page/summon;
- boss-only status.

Nightmare, Whispy Woods, Mother Brain and similar actors are not forced into a
four-person party just because gacha could sell them.

## 9. Character visibility before acquisition

To make the Library feel rich without requiring 190 hours or finished sprites:

- Atlas World cards preview their signature cast as silhouettes and names;
- the Field Manual records encountered enemies/bosses;
- banner Archives show missing slots and their unlock condition;
- boss entrances and NPC Assist art introduce characters before pulls;
- a title-history shelf shows shipped Worlds in release chronology;
- locked future content is labeled `planned`, not presented as playable.

The user can see that Yoshi belongs to *Super Mario World*, King Bob-omb to
*Mario 64*, and Fury Bowser to *Bowser's Fury* before those Worlds are built.
An entry is pullable early only after its assets pass production gates; planned
silhouettes never pretend a fighter already exists.
