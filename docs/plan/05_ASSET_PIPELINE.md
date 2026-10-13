# Asset and sprite production plan

Assets are the likely long-term bottleneck. A named character is not a roster
commitment until its strip animation and pull-art routes are both credible.

This plan is for a personal-use project. It is not legal advice and public
availability is not permission to redistribute copyrighted art or sprite rips.

## 1. Current repository audit

As of 2026-10-13:

- `assets/` is about 9.5 MB with 168 files;
- `assets/characters/` contains roughly 50 processed splash/icon/battle-art
  folders, mostly the earlier meme/crossover candidate set;
- those `battle.webp` files are generally cut-out art, not complete sprite
  animation sheets;
- `incoming/` contains only its instructions, not the proposed manually
  downloaded sheets;
- `tools/art/sprite-batch.json` and `docs/SPRITE_FIRST_BATCH.md` scout 12
  sprite-friendly crossover units and Bowser, but that batch predates the new
  game-first/title-based plan;
- the Mario pull demo has useful presentation/art experiments but does not
  supply the roaming combat roster.

Nothing should be deleted. The earlier 12-unit batch becomes a scouting queue
for later Sagas. It is **not** the production order. Super Mario Bros. enemies,
the four free Library fighters and the Hammer Bros. boss now come first.

## 2. Two independent asset grades

A unit can have beautiful banner art and terrible combat animation, or the
reverse. Track both.

### Sprite grade

| Grade | Minimum evidence | Typical work | Production meaning |
| --- | --- | --- | --- |
| A | idle/move, 2+ attacks, hurt/KO, clean extraction | 2–6 hours import, timing, effects | ready to schedule |
| B | solid move + attack; 1–2 states can be reconstructed | 0.5–2 focused days | acceptable with written gap plan |
| C | battle pose/static/turn-based sheet but recognizable | 2–5 days rigging, redrawing or effect substitution | do not schedule casually |
| D | no coherent 2D source or incompatible perspective | a week+ custom work/commission | park unless milestone-defining |

Simple NES enemies can be B despite few frames when code animation honestly
supplies the missing motion: squash, hop, shell spin, recoil or shadow. A major
fighter with one idle image is C/D, because an attack VFX cannot hide every
missing reaction.

### Art grade

| Grade | Pull/profile route | Meaning |
| --- | --- | --- |
| A | licensed/approved cohesive hero image with clean high resolution | SSR/UR capable |
| B | strong official/fan image with known source, crop and manageable cleanup | R–SSR capable depending on rights/status |
| C | composite background + cut-out needs substantial matching | use only with planned production time |
| D | low resolution, unknown source, watermark or inconsistent style | reject/replace |

R/SR need one solid image reused for reveal/profile. SSR needs a composition
that survives its ceremony and face crop. UR needs SSR quality plus a credible
motion/effect extension; it does not automatically require a second painting.

## 3. Required animation contract

Every playable fighter must map source frames or procedural treatments to:

```text
idle
move_forward
move_back
basic_windup
basic_resolve
skill_or_secondary
hurt
knockout
ultimate_entry
```

Optional states:

```text
airborne, block, heal, cast, transform, summon, victory
```

A state may reuse frames with timing/offset/VFX changes, but the manifest says
so. Mirroring is allowed only when asymmetry (shield hand, text, weapon shape)
does not make it visibly wrong.

Bosses additionally require:

- two attack telegraphs;
- phase-change/recovery;
- stagger/vulnerable state;
- defeat transition;
- summon/hazard assets where applicable.

No sheet enters runtime as unexplained pixel coordinates scattered through
code. Frame rectangles, pivots, timing, events and source sheet live in one
sprite definition.

## 4. Visual-era rules

The title-based World structure makes sprite history part of the appeal.

1. World backgrounds, ordinary enemies and bosses default to their source
   game's visual era.
2. A fighter iteration retains its own source style when visiting another
   World. Mixed styles are expected crossover charm.
3. Pixel art uses integer or nearest-neighbor scale; do not blur it to force
   uniformity.
4. Normalize feet to a shared ground line, perceived height to a character
   scale class and lighting with a small contact shadow—not by redrawing every
   character into one style.
5. If original frames are insufficient, an official remake sheet may be used
   as an `enhanced` treatment. The card and manifest identify the source rather
   than pretending it is the original sprite.
6. Large bosses may occupy the background plane; playable versions use a
   declared scale treatment or do not ship as fighters.

For example, Kirby's Adventure enemies can retain NES styling while a later
Kirby Super Star iteration uses its richer native sheet. A KSSU sheet is not
silently labeled “1993 Kirby.”

## 5. Asset manifest

Every original file and derived output has a record similar to:

```js
{
  id: "sprite-smb1-mario-nes",
  subjectId: "mario-classic",
  kind: "sprite-sheet",
  sourceGameId: "super-mario-bros-1985",
  provider: "owner-manual-import",
  pageUrl: "...",
  originalUrl: null,
  creatorOrRipper: "...",
  copyrightOwner: "...",
  license: "unknown/proprietary",
  rightsStatus: "personal-use-only",
  delivery: "manual_download",
  originalFilename: "...",
  sha256: "...",
  importedAt: "...",
  transformations: ["crop", "transparent-cleanup", "nearest-4x"],
  spriteGrade: "B",
  artGrade: null,
  approvedByOwner: true,
  notes: "..."
}
```

Required rules:

- preserve page URL, creator/ripper credit and hash even when a source later
  disappears;
- never call an asset “licensed” because its code repository uses MIT/AGPL;
  code licensing does not grant rights to Pokémon, Nintendo or other art;
- store an explicit `unknown` instead of inventing a license;
- generated/commissioned art records model/tool/artist, prompt/brief and terms;
- keep originals out of distributable packages when permission does not allow
  redistribution;
- a shipping/export command must be able to list or exclude all
  `personal-use-only` material.

## 6. Source handling

### The Spriters Resource and similar archives

Treat these as discovery/manual-intake pages. The owner downloads selected
assets through the browser into `incoming/`. Automation validates, slices and
transforms the supplied file; it does not bypass human checks or crawl the site.
The page is evidence of provenance, not a redistribution license.

### Pokémon sprite repositories

PokéAPI publicly hosts a very large organized sprite repository and explicitly
documents cloning/downloading its contents. Its GitHub license field is
`NOASSERTION`, and many images remain Pokémon IP. Pokémon Showdown client code
is AGPL, but that does not make every sprite freely relicensable. Record the
art source/right separately from the repository's software license.

### Fan art and authenticated sources

- use the local picker/manifest workflow and retain artist/source links;
- do not commit account cookies, tokens, usernames, passwords or private API
  keys;
- if the owner later runs a large authenticated search, credentials remain in
  the OS keychain or ignored local environment and the owner runs it on their
  machine;
- scraping volume, cache and site rules are reviewed per provider;
- owner selection/permission status is stored with the pick, not inferred from
  a bookmark count.

### Open art

OpenGameArt and similar libraries can supply generic effects, UI ornament or
temporary backgrounds when each asset's actual license/credit is recorded.
They are not substitutes for named franchise characters.

## 7. Intake workflow

```text
candidate record
→ source pages and rights note
→ owner/manual original intake
→ hash and quarantine scan
→ sprite/art grade
→ frame/contact-sheet preview
→ owner visual approval
→ slicing/pivots/timing
→ in-engine sandbox
→ 10-minute behavior soak
→ package-sized derivatives
→ manifest lock
```

### Automated checks

- file exists and hash matches manifest;
- dimensions/format are supported;
- alpha bounds and frame rectangles are valid;
- frame events occur within clip duration;
- no empty animation state;
- pivot/ground line does not jump beyond tolerance;
- output respects texture dimension and memory budget;
- every runtime file has a provenance parent.

### Visual checks

- nearest-neighbor scaling is crisp at compact and normal strip sizes;
- attacks face the correct direction;
- hit frame and simulation impact coincide;
- transparent cleanup does not erase white eyes/gloves/effects;
- silhouette remains readable over every Area background;
- fighter scale feels intentional beside the free party;
- KO/phase transitions do not snap to missing frames.

## 8. First production queue

This queue is deliberately smaller than a complete launch banner.

### Gate A — engine proxies

Use geometric/dev fixtures to prove all seven attack patterns. No art search is
allowed to block combat architecture.

### Gate B — Super Mario Bros. enemies

| Subject | Expected grade | Cheap motion plan | Risk |
| --- | --- | --- | --- |
| Goomba | B | two-frame walk + squash/hop | low |
| Koopa Troopa/shell | B | walk, retract, shell spin | low |
| Piranha Plant | B | pipe rise/bite/recoil | low |
| Hammer Bro | B | walk/jump/throw; projectile separate | medium timing |
| Buzzy Beetle | B | walk/shell/flip | low |
| Cheep-cheep | B | swim/leap, palette variants | low |
| Blooper | B | pulse swim + ink VFX | low |
| Lakitu/Spiny | B | cloud hover/throw, separate egg | medium multi-actor |
| Bullet Bill/Podoboo/fire bar | A–B | hazard primitives | low |
| Impostor Bowser/Bowser | B | limited original frames plus authored tells/VFX | high boss expressiveness |

The richer Bowser's Inside Story sheet already scouted can prototype boss
timing, but the final *Super Mario Bros.* World should use an original-era or
deliberately declared enhanced treatment. Prototype source and shipped source
do not have to be identical.

### Gate C — free party

| Fighter | Expected grade | Plan |
| --- | --- | --- |
| Classic Mario | A/B | source-era run/jump/fire frames; punch/stomp timing from engine |
| Classic Luigi | B | distinct timing/height, not only a palette swap; reconstructed ranged identity |
| Toad | B/C | locate a coherent battle-capable sheet or keep support effects simple |
| Princess Peach | B/C | source a coherent run/cast/hurt set; no static cut-out pretending to run |

If Toad or Peach remains C, use temporary clearly marked fixtures and delay the
banner-facing claim. Do not pull unrelated polished characters into World 1 to
hide the gap.

### Gate D — World 1 banner additions

Koopa Troopa, Hammer Bro, Blooper, Buzzy Beetle, Lakitu and Bowser can reuse
their enemy animation definitions with controlled playable scaling and extra
victory/ultimate effects. This makes the title's modest cast affordable.

### Gate E — Kirby's Adventure

Only after World 1 works: Kirby, Waddle Dee, copy enemies, five bosses and the
first ability Power-Ups. Audit original NES sheets against the already scouted
KSSU assets; choose original or explicitly enhanced treatment per unit.

## 9. Work budget per release

Before freezing a World, estimate:

| Asset type | A | B | C/D |
| --- | ---: | ---: | ---: |
| ordinary enemy | 2–4 h | 0.5–1 d | replace/reduce |
| playable fighter sprite | 0.5–1 d | 1–2 d | 3–7+ d |
| Area boss | 1–2 d | 2–4 d | redesign encounter/source |
| R/SR pull art | 1–3 h processing | 0.5–1 d | replace |
| SSR/UR presentation | 0.5–1 d | 1–3 d | do not schedule |
| Area background kit | 0.5–1 d | 1–2 d | simplify layout |

These are planning weights, not promises. If a 25-stage World needs 12 grade-C
fighters, it fails the asset gate regardless of how exciting its roster list is.

## 10. Memory and package budget

For the M2 Air target:

- strip sprites use trimmed atlases, not original giant sheets;
- load current party, current encounter and imminent boss, not the Library;
- release previous World textures after transition;
- pull art is loaded only in management/reveal and has size-specific WebP/PNG
  derivatives;
- audio streams rather than decoding the whole catalog;
- particle textures are shared;
- maintain a debug readout of loaded texture count and estimated bytes.

**TRIAL:** keep ordinary strip atlases under 4 MB decoded per fighter and under
2 MB per enemy family; keep a normal fight's total decoded image budget below
128 MB. Measure rather than trusting compressed file size.

## 11. Asset gate checklist

A unit may move from `candidate` to `scheduled` only if:

- source game and family ID are fixed;
- sprite grade A/B is evidenced by a contact sheet;
- missing states have a written reconstruction plan;
- pull-art grade is sufficient for assigned rarity;
- source/provenance record exists;
- kit fits available motions instead of requesting imaginary frames;
- silhouette/scale was checked in the actual strip;
- estimated work fits the currently frozen slice.

Failing a gate means park, reclassify as Assist/Power-Up, choose another source
or change rarity/presentation. It does not mean silently borrowing a random GIF.
