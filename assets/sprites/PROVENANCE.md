# Sprite and art intake for the private v1 build

The live fighter/enemy pipeline uses reviewed game-specific sheets, with
faithful adaptations labeled explicitly. Source review is separate from final
human approval of motion and interaction quality. Original source files and
credits remain intact.

See [the sprite review](../../docs/SPRITE_REVIEW.md) for selection, animation,
scale, comparison evidence, remaining quality work and the rarity proposal.

## Current sources

| Source | Credit | Use |
| --- | --- | --- |
| Original SMB NES sheets on The Spriters Resource | Superjustinbros / Nintendo | Mario, Luigi, rescue NPCs, ordinary enemies and native weapons |
| Original Adventure NES sheets on The Spriters Resource | Drshnaps (Jermungandr) / HAL Laboratory | Kirby, Copy poses, enemies, bosses, weapons and effects |
| Adventure Kirby additions | QuadFactor, UltraHype97 | Additional source Kirby poses |
| Adventure Meta Knight sheet | someguy, Jermungandr / HAL Laboratory | Walk, slash, guard and spin |
| Dream Land Game Boy sheet | Sonikku, thejohnston7 / HAL Laboratory | Distinct original Game Boy Kirby |
| Super Star SNES helper sheets | Drshnaps (Jermungandr) / HAL Laboratory | Knuckle Joe and Bio Spark, matching their 1996 records |
| Expanded original-design SMB1 Bowser | Captain / FungiCaptain, Nintendo original sprite | Faithful classic body with walk, skid, jump, swimming, fire and defeat; selected over later-design NES-style candidates |
| Expanded original-design SMB1 Hammer Bro | PixelatedPete (PlugItIn&Pete); original rip Superjustinbros / Nintendo | Original 24-pixel costume/body row, walk, throw, jump, skid and defeat. Compressed ROM-hack and later-game variants excluded. |
| Expanded original-design SMB1 Buzzy Beetle | Side Steppa / Nintendo original character | Four walk and four roll poses in the exact original brown/peach palette; winged variants excluded. |
| Complete Bandana Dee spear adaptation | gameboy09 / HAL Laboratory character | Super Star Ultra pixel style, faithfully supporting the Return to Dream Land spear kit |
| Original Wii Bandana Dee model | John2k4; export/post Mighty Jetters; TSR uploader Garamonde | Comparison render only. This archive supplies no animation tracks. |
| Source-game reveal illustrations | Nintendo / HAL Laboratory, via Mario Wiki and WiKirby | Original SMB, Dream Land, Adventure, Super Star and Return to Dream Land artwork |
| Classic Koopa reveal illustration | Nintendo, via Mario Wiki | Official 2020 SMB35 redraw of the original walking-on-all-fours 1985 design; illustration date and depicted version recorded separately. |

[sources/faithful/INTAKE.json](sources/faithful/INTAKE.json) records downloaded
sheets/model archives, public source pages, credited contributors and SHA-256.
[The palette checks](sources/faithful/PALETTES.json) retain independent native
Adventure references. [Portrait intake](../portraits/source-era/INTAKE.json)
records artwork URLs, game identity, dimensions and hashes. Some old game art
is an opaque scan; it is displayed as a printed illustration without altering
the original artwork. Featured banner and reveal art remain separate pieces.

`v1/manifest.json` records source game, source page, credits, original source
rectangles, foot anchors, fixed pixel scale, clips, body height, world height
and output hashes. `python tools/art/import-v1-sprites.py` rebuilds legacy
items/scenes and then applies the reviewed game-specific imports. Directly
rerun the current pass with `python tools/art/import-faithful-sprites.py`.
Development dependencies are Pillow, numpy and scipy; the game runtime has
none of those dependencies.

`python tools/art/validate-faithful-sprites.py` verifies source/atlas pixel
counts for every extracted frame. Native layered bosses are assembled
explicitly and reviewed in the renderer captures. The contact sheet and pose
boards show current output, not the earlier enhanced treatment.
Parasol Dee's body and umbrella are extracted separately for authored poke/spin
motion; its original whole-body idle is retained. No new frames are claimed as
native rips. The combat review and browser frame sequences expose the resulting
interactions for human review.

## Retained earlier intake

`SOURCES.json` remains the registry for older GitHub downloads, including
SkyanUltra remastered NPCs, cstack Kirby derivatives, Happiiz/KirboMod bosses,
and Arisotura rank-set animations. Their `active` flags now reflect the actual
runtime manifest plus retained scenes/props. Replaced fighter bodies are kept
as historical candidates, not described as native live sprites.

The Mario banner retains the approved `pull-flower.webp` by **maribou**, now
beneath classic featured artwork. [Demo sources](../../demos/mario-pull/SOURCES.md)
retain artist links. Classic Mario's reveal now uses his source-game artwork;
the approved **しかばね** demo and Smash Kirby portrait remain historical intake.

Audio is still procedural prototype sound plus the retained Mario voice clip.
It is not a finished character-quote or franchise-music library.
