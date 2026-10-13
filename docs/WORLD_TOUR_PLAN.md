# Pocket Gacha: World Tour content plan

This document extends `ROADMAP.md`. It records the scalable content structure
for the game without replacing the immediate goal: make the roaming desktop
combat fun with one polished five-stage slice before producing hundreds of
characters.

## 1. The library model

Content is organized in five layers:

1. **Library** — the whole game and the account-wide collection.
2. **Shelf** — a browsing category, not a combat rule or progression gate.
3. **Saga** — one franchise or coherent anthology, such as Mario or Arcade Hall.
4. **World** — a complete 25-stage campaign inside a Saga.
5. **Area** — five stages with one environment, enemy family and final boss.

Example: `Library > Mario Saga > Mushroom Kingdom > Haunted House > Stage 13`.

Every World has five Areas and ends at stage 25. Stages 26–100 on that World
are optional Mastery remixes, not 75 more environments. A Saga can also grow
to 100 authored stages by receiving four different Worlds over time.

This distinction keeps a 25-stage campaign satisfying while leaving room for
large franchises to return repeatedly.

### Shelves

Shelves make a very large library readable. A Saga may appear under more than
one filter.

- **Action and platform:** Mario, Kirby, Mega Man, Sonic, Metroid,
  Castlevania, Doom and Hollow Knight.
- **Adventure and RPG:** Zelda, Dragon Quest, Final Fantasy, Pokemon, Fire
  Emblem and EarthBound.
- **Arcade Hall:** Pac-Man, Donkey Kong, Dig Dug, Galaga and other games best
  represented as shorter cabinets inside one anthology Saga.
- **Fighting Circuit:** Street Fighter first, with room for other fighting
  games whose sprite sheets are especially good for this combat system.
- **Modern shelf:** Minecraft, Terraria, Hollow Knight, Henry Stickmin,
  Among Us and Bloons TD6.
- **Oddities drawer:** meme, live-action and deliberately strange crossover
  batches after the game is established.

Shelves do not create type bonuses, shared banners or mandatory play order.

## 2. Release pattern

New franchises and expansions to existing franchises alternate. The working
content order is:

1. Mario World I — Mushroom Kingdom
2. Kirby World I — Dream Land
3. Mario World II — Koopalings' Grand Tour
4. Mega Man World I
5. Kirby World II
6. Sonic World I
7. Mario World III — Luigi's Mansion
8. Continue outward according to sprite readiness and playtest interest

Finishing a World unlocks its Mastery track and, when available, both the next
World in that Saga and the next Saga. The player can choose whether to continue
the familiar Saga or begin the new one. World progress is saved separately.

The production order is deliberately different from the imagined final
library. Franchises with ready-to-use side-view action sheets come first.

### Sprite-readiness groups

- **Group A, naturally suited:** Mario, Kirby, Mega Man and Sonic.
- **Group B, strong combat sheets:** fighting games, Castlevania, Metroid,
  Doom and Arcade Hall.
- **Group C, plentiful but adaptation-heavy:** Zelda, Pokemon, Final Fantasy,
  Dragon Quest, Fire Emblem and EarthBound.
- **Group D, custom or modern treatment:** Minecraft, Terraria, Hollow Knight,
  Henry Stickmin, Among Us, Bloons TD6 and Oddities.

This grouping is a production estimate, not a judgment about which Saga is
more important. An asset audit may move a Saga earlier or later.

## 3. First 50 authored stages

The first 50 handcrafted stages are two complete Worlds rather than half of
one giant linear route:

- **Mario / Mushroom Kingdom:** 25 stages.
- **Kirby / Dream Land:** 25 stages.

The UI displays local World stages 1–25. Account-wide Library progress records
the total number of unique clears separately.

### Mushroom Kingdom

| Stages | Area | Enemies introduced | Boss |
| --- | --- | --- | --- |
| 1–5 | Mushroom Grasslands | Goomba, Koopa, Piranha Plant, Paratroopa | Goomba King |
| 6–10 | Underground Mines | Swooper, Buzzy Beetle, Spike, Bob-omb | King Bob-omb |
| 11–15 | Haunted House | Boo, Dry Bones, Peepa, Big Boo | King Boo |
| 16–20 | Koopa Airship | Bullet Bill, Lakitu, Spiny, Hammer Bro, Magikoopa | Bowser Jr. |
| 21–25 | Bowser's Castle | Lava Bubble, Thwomp, elite Koopa troops | Bowser |

Each enemy needs one readable mechanical identity, not merely different art.
Bosses need phase or battlefield behavior that reflects the character:

- Goomba King commands adds and creates body-slam shockwaves.
- King Bob-omb leaves explosives that either side can trigger.
- King Boo uses false copies, vanishing and backline pressure.
- Bowser Jr. changes altitude and uses Clown Car hazards.
- Bowser breaks safe ground and changes moves in phase two.

### Dream Land

| Stages | Area | Enemy direction | Boss |
| --- | --- | --- | --- |
| 1–5 | Green Greens | Waddle Dee, Bronto Burt, Sir Kibble, Poppy Bros. Jr. | Whispy Woods |
| 6–10 | Castle Dedede | Waddle Doo, Broom Hatter, Rocky, Bonkers | King Dedede |
| 11–15 | Cloudy Park | Parasol units, Scarfy, Birdon and storm hazards | Kracko |
| 16–20 | Halberd | Axe Knight, Mace Knight and mechanical enemies | Meta Knight |
| 21–25 | Fountain of Dreams | mirror and nightmare variants | Nightmare |

The second World must prove that the systems are genuinely data-driven. It
should not be a Mario reskin: Kirby copy forms, flying enemies and dream-state
hazards need their own movement and presentation.

## 4. Mario as a 100-stage Saga

Bowser is still defeated at stage 25. Later Worlds are sequels and expansions,
not a stretched first campaign.

### World I — Mushroom Kingdom, stages 1–25

Grasslands, Underground Mines, Haunted House, Koopa Airship and Bowser's
Castle. Bosses: Goomba King, King Bob-omb, King Boo, Bowser Jr. and Bowser.

### World II — Koopalings' Grand Tour, stages 26–50

Desert/Coast, Mountains/Mines, Frozen Factory, Storm Fortress and Dark Land.
All seven Koopalings receive proper fights, sometimes as coordinated pairs.
Dry Bowser is the final boss.

### World III — Luigi's Mansion, stages 51–75

Abandoned Mansion, Haunted Grounds, Boo Ballroom, Last Resort and Paranormal
Rift. Boss direction: Chauncey, Bogmire, Boolossus, Hellen Gravely and an
Ascendant King Boo. This World introduces possession, darkness, traps and
ghost-control mechanics along with E. Gadd and Polterpup support content.

### World IV — Beyond the Kingdom, stages 76–100

Isle Delfino, Odyssey Kingdoms, Sprixie Kingdom, Galaxy and Lake Lapcat.
Boss direction: Shadow Mario/Petey Piranha, Mechawiggler, Meowser, Cosmic
Bowser and Fury Bowser. This is the home of the most extreme forms and the
conclusion of the first Mario Saga arc.

## 5. Rarity and roster rules

Variants are individually collectible. Only one unit from a character family
may be in a party, so Mario and Fire Mario cannot deploy together while Mario
and Luigi can.

Rarity expresses the type of fantasy a unit delivers:

- **R:** base identities with direct, reliable kits and inexpensive growth.
- **SR:** power-ups, alternate fighting styles, lieutenants and minibosses.
- **SSR:** signature forms, landmark bosses and units with major mechanics.
- **UR:** rare, screen-dominating transformations with a high-impact power
  window.

Higher rarity is stronger, but it must not turn the rest of the collection
into trash. Target endgame power bands before situational advantages are
approximately R 85–90%, SR 93–97%, SSR 100%, and UR 105–115% averaged over a
whole fight. R and SR units can still be best-in-slot because of action speed,
targeting, support or a particular enemy mechanic.

Rarity is not assigned from story title alone. A fun Goomba King commander
may be SR even though he is a boss; King Boo can be SSR because his playable
kit supports a signature mechanic. New balance numbers remain drafts until
combat playtesting.

### Candidate Mario roster by role

The full Mario Saga can support more than 50 units, but they arrive with their
relevant Worlds rather than entering one launch banner.

- **Base R candidates:** Mario, Luigi, Peach, Daisy, Toad, Toadette, Yoshi,
  Birdo, Wario, Waluigi, Rosalina and Pauline.
- **SR form candidates:** Fire/Tanooki/Cat Mario, Ice/Poltergust Luigi, Cat
  Peach, Captain Toad and mechanically distinct Yoshi colors.
- **SR enemy candidates:** Bowser Jr., Kamek, Petey Piranha, Boom Boom, Pom
  Pom and the seven Koopalings.
- **SSR candidates:** Giant or Metal Mario, Bowser, King Bob-omb, King Boo,
  Dry Bowser, Meowser, Cosmic Bowser, Boolossus and Hellen Gravely.
- **UR candidates:** Invincible Mario, Fury Bowser and Giga Cat Mario.

Color variants are only separate units when they play differently. Red, Blue
and Yellow Yoshi can justify separate kits through fire, flight and ground
shockwaves; a palette swap with the same actions cannot.

The first 25-stage World should eventually contain roughly 10 R, 10–14 SR,
5–7 SSR, and 6–10 support pages. UR acquisition does not open until the first
World is complete. Exact membership waits for an animation-sheet audit.

## 6. Ultimates and UR transformations

Every fighter can have an ultimate, but a transformation ultimate replaces a
unit's sprite, actions and targeting for a limited period rather than applying
only a numerical buff.

- Fury Bowser leaps away, smashes back into the stage at giant scale, gains a
  new flame/shockwave move set, then returns to normal.
- Invincible Mario activates a Super Star, gains extreme movement and contact
  damage, resists control, then returns to normal.

The target transformation window is 12–20 seconds. A full minute would occupy
most of a normal stage and erase the rest of the party. Only one UR may deploy
in a party, its ultimate charges slowly, and challenge stages may reward teams
that clear without one. A UR should carry a dangerous section of the fight,
not permanently automate every fight.

Large transformations use the strip's background plane and camera effects so
they feel enormous without turning the transparent desktop strip into a solid,
obstructive window.

## 7. Assist Pages

Characters or scenes with good illustration but insufficient battle sprites
become **Assist Pages** in the Field Manual. A party equips one page. It grants
one passive and one charged or conditional intervention.

Examples include E. Gadd's Laboratory, Toadsworth's Advice, Luma's Guidance,
Peach's Tea Time, Cappy's Intervention, FLUDD Emergency Spray and Polterpup.

Assist Pages may use character art without requiring a roaming sprite. They
do not consume a fighter slot and do not conflict with a deployed character's
family. They also do not dilute fighter banners: they use stage rewards,
dedicated support tickets and, later, a separate support banner.

The first implementation has one party-wide Assist Page. Per-character cards
or four equipment slots are deferred until the simpler version proves useful.

## 8. Banner progression

Every Saga has a permanent Archive and illustrated featured banners. A boss
enters the playable pool only after the player defeats that boss once.

Suggested Mushroom Kingdom progression:

- **Mushroom Beginnings:** base heroes and early power-ups.
- **Royal Trouble, after stage 5:** Goomba King and grassland additions.
- **Bombs Below, after stage 10:** King Bob-omb and underground additions.
- **Haunting Hour, after stage 15:** King Boo, Poltergust Luigi and ghost kits.
- **Koopa Armada, after stage 20:** Bowser Jr., Kamek and airship kits.
- **Final Showdown, after stage 25:** Bowser and final-World additions.

The current 3% SSR, soft pity at 50 and hard pity at 70 remain the baseline to
playtest. URs use a separate banner unlocked after a World clear; their rate
and pity are not locked yet. Stage 100 should award a selectable Saga UR so
that the strongest forms are not obtainable only through luck.

## 9. Asset acceptance

Every planned fighter receives an animation-readiness grade before production:

- **A:** movement, attack, hit and defeat animation are ready.
- **B:** strong base sheet; needs effects or a few reconstructed frames.
- **C:** mostly static; requires substantial custom animation.
- **D:** no suitable source; requires original sprite work.

The content catalog records source game, dimensions, directions, animation
names, frame counts, missing actions and attribution notes. Prototype assets
can prove the private game loop; a public build would need original, licensed
or commissioned replacements.

## 10. Build order

### Foundation

- Replace the single absolute stage route with Library/Saga/World progress.
- Remove the NEXT initiative display; independent action gauges are sufficient.
- Preserve the seven attack behaviors and give each one real targeting or
  movement consequences rather than elemental multipliers.
- Add data fields for rarity tier, family, ultimate form and Assist Page.
- Establish the illustrated World Tour Field Manual UI.

### Polished five-stage slice

- Mushroom Grasslands stages 1–5.
- At least 10–12 playable candidates available for banner/team testing.
- Four themed normal enemy families and Goomba King.
- One finished banner, four Assist Pages and one internal transformation test.
- Final-quality stage pacing and transparent-strip presentation.

The old test roster remains available behind development fixtures until this
slice can replace it without breaking saves or leaving the game unplayable.

### First World

- Finish Mushroom Kingdom stages 6–25, all bosses and banner milestones.
- Unlock Mastery, the UR system and Dream Land.

### Second World

- Finish Dream Land stages 1–25 and prove that movement, hazards, banners and
  progression are not hard-coded to Mario.

Only after this foundation is proven should production expand into the full
franchise list.
