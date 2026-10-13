# Sprite-first vertical slice

The first production batch is deliberately made of characters whose existing
game sprites can carry the desk strip. This saves animation work for the pull
ceremony and combat effects, where polish pays off most.

This is a source plan, not permission to redistribute the files. The game is
for personal use. The owner downloads Spriters Resource assets in a browser
and places them in `incoming/`; automation must not bypass that site's human
check.

## Batch 1: 12 pullable units

| Unit | Sprite source | Why it made the cut | Strip role |
|---|---|---|---|
| Mario | [Mario (Battle), Bowser's Inside Story](https://www.spriters-resource.com/ds_dsi/marioandluigi3/asset/76348/) | Purpose-built battle acting plus a separate overworld sheet | Stomp + melee; coin passive |
| Kirby | [Kirby Super Star Ultra](https://www.spriters-resource.com/ds_dsi/kssu/asset/14758/) | Base sheet plus many complete ability sheets | Melee/ranged flex; copy-style ultimate |
| Sonic | [Sonic Mania](https://www.spriters-resource.com/pc_computer/sonicmania/asset/95304/) | Large production sheet with expressive movement and damage states | Charge; speed/haste passive |
| Mega Man X | [Mega Man X](https://www.spriters-resource.com/snes/mmx/asset/1225/) | Complete player sheet and a separate effects sheet | Ranged shot + charged beam |
| Link | [The Minish Cap](https://www.spriters-resource.com/game_boy_advance/thelegendofzeldatheminishcap/asset/6369/) | Large all-purpose sheet with sword and item actions | Melee + lob; shield passive |
| Samus | [Metroid: Zero Mission](https://www.spriters-resource.com/game_boy_advance/metzero/asset/106418/) | Polished run, aim, damage and movement set; effects are available separately | Ranged shot + beam |
| Ryu | [Street Fighter Alpha 3](https://www.spriters-resource.com/arcade/streetfighteralpha3/asset/560863/) | Fighting-game sheet already contains combat timing, hurt and KO acting | Combo + Hadouken |
| Cuphead | [Cuphead](https://www.spriters-resource.com/pc_computer/cupheaddontdealwiththedevil/asset/108720/) | Separated production frames with unusually expressive animation | Ranged shot; EX burst ultimate |
| Shovel Knight | [Shovel Knight Dig](https://www.spriters-resource.com/pc_computer/shovelknightdig/asset/184333/) | Archive contains hundreds of named frames, including attacks and movement | Melee + lob; treasure passive |
| Alucard | [Symphony of the Night](https://www.spriters-resource.com/playstation/cvsotn/asset/163758/) | Centered, engine-ready sheet; bat, mist and wolf transformations also exist | Melee; transformation ultimate |
| Susie | [Deltarune](https://www.spriters-resource.com/pc_computer/deltarunedemo/asset/110471/) | Large playable-character sheet with axe and battle poses | Heavy melee + area spell |
| Marshadow | [Smogon / Pokémon Showdown sprites](https://github.com/smogon/sprites) | Animated front/back/pixel GIFs are already processed in this repo | Combo; shadow-strike ultimate |

## First boss

Bowser is the Roadmap 2 boss prototype. His
[Bowser's Inside Story battle sheet](https://www.spriters-resource.com/ds_dsi/marioandluigi3/asset/19548/)
is unusually large and gives the boss enough tells, reactions and attacks to
test the whole animation system without drawing anything new.

## Selection logic

Every chosen unit has:

- a recognizable full-art route for reveal/profile art;
- at least one credible source for idle/move/attack/hurt states;
- a distinct combat silhouette and kit niche;
- assets that can be kept small enough for an always-on M2 Air desk strip.

Candidates intentionally deferred: Steve's available motion is charming but
not as expressive; Futaba is not a direct fighter; Aigis needs a consistent
2D source; Luigi overlaps Mario before the variant/family rule is settled.

The machine-readable intake list is `tools/art/sprite-batch.json`. Run
`python3 tools/art/sprites.py status` after dropping the files into `incoming/`.
