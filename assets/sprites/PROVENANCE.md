# Sprite and art intake for the private v1 build

Every battle sprite is provisional. These assets are source sprites or declared
derivatives; the project does not claim new ownership or clearance to distribute
Nintendo characters, games, voices or fan art. The original files remain intact.

`SOURCES.json` records each downloaded file's repository, path, Git blob SHA,
SHA-256 and whether the build currently uses it. `v1/manifest.json` records the
derived atlas hash, shared foot pivot, nine clips, treatment, grade and notes.
Run `python tools/art/import-v1-sprites.py` to reproduce the atlases. Open
`v1/contact-sheet.png` to review their identities.

| Intake | Source and credit | Treatment in this build |
| --- | --- | --- |
| SMB sprites and tiles | [meth-meth-method/super-mario](https://github.com/meth-meth-method/super-mario), Nintendo's *Super Mario Bros.* source graphics | Native NES Mario and enemies, nearest-neighbor atlas extraction |
| Luigi, Toad, Peach, Podoboo | [SkyanUltra/Super-Mario-Bros.-Remastered-Public](https://github.com/SkyanUltra/Super-Mario-Bros.-Remastered-Public) | Declared remastered/classic reconstruction; unused green palette masks are retained as intake, never rendered as characters |
| Kirby and Copy poses | [cstack/kirby-clone](https://github.com/cstack/kirby-clone) | Enhanced sheet with unverified original-game provenance; seven visible Copy treatments, with Spark and Ice palette reconstructions |
| Kirby enemy palette sheet and Valley backgrounds | The same repository; sheet credits **Drshnaps**, HAL Laboratory / Nintendo, *Kirby's Adventure* (NES) | Native indexed enemy source, declared fire/stone/laser palette reconstructions; full scene strips extracted without the sheet labels |
| Kirby enemies and bosses | [Happiiz/KirboMod](https://github.com/Happiiz/KirboMod) | Enhanced/custom treatment; source animation indexes inspected for Dedede, Bonkers and Whispy. Original/custom authorship still needs review |
| Meta Knight, Paint Roller, Sparky, Knuckle Joe, Bio Spark | [Arisotura/Blargboard-extras](https://github.com/Arisotura/Blargboard-extras/tree/master/ranksets/kirby) animated Kirby rank set | Animated source poses plus marker-driven motion. Their source-game/artist provenance is unverified; enhanced treatment, no final NES claim |
| Bandana Waddle Dee and spear | Happiiz/KirboMod, `Projectiles/BandanaDee/` | Source idle, six walk, three jab, jump and two throw poses; separately sourced held/thrown spears. Copter and ultimate motion remain provisional; original-game/artist review pending |
| Star Rod | Happiiz/KirboMod, `Items/Weapons/StarRod.png` | Finale-only encounter prop. No Star Rod fighter or paid Mythic pool is shipped |

Grade **B** means the prototype declares reused poses and procedural motion.
It does not mean final visual approval. The regional Archives stay locked until
their roster and production gates pass. An earlier Meta Knight reconstruction
and attack-only VFX intake were rejected; the live actor now uses the source
wing poses. The rank-set `rocky.gif` was also rejected as the wrong treatment;
the live Rocky uses the labeled NES sheet with a gray palette reconstruction.

Summon art uses separate banner and reveal pieces. Classic Mario's reveal uses
the already approved `demos/mario-pull/pull-block.webp` by **しかばね**; the
Mushroom banner uses `pull-flower.webp` by **maribou**. Artist links and original
intake notes remain in [the demo sources](../../demos/mario-pull/SOURCES.md).
Kirby's enhanced reveal portrait is Nintendo / HAL Laboratory's Smash render,
retained from [ConnorBryan/smashcombos](https://github.com/ConnorBryan/smashcombos/blob/master/static/img/kirby.png).
It is presentation art, not a claim that the 1993 fighter has a Smash kit.

Current audio is procedural prototype sound, plus the already retained Mario
voice clip. It is not a finished library of character quotes or franchise music.
