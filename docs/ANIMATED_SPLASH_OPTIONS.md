# Animated splash art: current investigation

**Updated 2026-10-14 (America/Chicago).** Dedede reveal v3 now proves the bounded
rigid-character route in `demos/splash-kit/`: sourced illustrated art, no mesh
deformation, active surrounding layers and a real voice beat. It awaits owner
review and is not production approval.

The target is a short **animated illustration**, not necessarily a full
interactive puppet or a complete gameplay model. A held pose can gain life from
coordinated chest/head/hand/cloth motion, scene depth, changing light and active
character-specific effects. The old isolated hammer rotation failed that goal.

## Promising routes to verify

| Route | Evidence found | Why it may fit / remaining work |
| --- | --- | --- |
| **PixiJS layered sprites + selected meshes/filters** | [Official mesh guide](https://pixijs.com/8.x/guides/components/scene-objects/mesh), [official plane example](https://pixijs.com/7.x/examples/basic/simple-plane), [displacement API](https://api.pixijs.io/@pixi/filter-displacement/PIXI/filters/DisplacementFilter.html). | Code-driven Web/Electron composition, no Cubism authoring/export requirement. Pin/verify one compatible version. Use small local deformation only where the art supports it; one waving plane over the whole fighter would reproduce the rejected stretching. A candidate, not yet selected or proved. |
| **Blender 2.5D image planes + shape keys + compositing** | [Documented free-software animated-photo workflow](https://patdavid.net/2014/02/25d-parallax-animated-photo-tutorial/), [Blender Studio animated illustration source](https://studio.blender.org/training/grease-pencil-fundamentals/5ea9befb6f97366013bd7c83/). | Can author a fixed short splash and export video, keeping the game player simple. Blender's 3D character rig is not required for layered image planes. Still needs suitable layers, clean revealed areas and authored movement; setup/export and output memory must be tested here. |
| **Inochi Creator / Inochi2D** | [Official Linux/macOS/Windows downloads](https://inochi2d.com/download/), [Creator source](https://github.com/Inochi2D/inochi-creator), [SDK source](https://github.com/Inochi2D/inochi2d). | Open-source mesh/layer authoring on Linux avoids the Cubism Editor platform block. It is still a puppet workflow and may exceed the needs of one splash. Current SDK README describes WebAssembly support requiring its toolchain/patched runtime; do not assume drop-in JS integration. Not installed/tested. |
| **DragonBones / newer LoongBones leads** | [DragonBones JS runtime](https://github.com/DragonBones/DragonBonesJS) is MIT; [official legacy download page](https://dragonbones.github.io/en/download.html); search also found [LoongBones documentation](https://www.dragonbones.cn/doc/en/). | Potential free skeletal/mesh route. Verify current editor availability, maintenance, export format and runtime compatibility before choosing it. The runtime being open source does not prove every editor is available/open source. Do not claim the whole project is discontinued: the search exposed newer activity that was not yet inspected. |
| **image2live2d + See-through** | [`image2live2d`](https://github.com/Wzhang3912/image2live2d) accepts PSD/layer folders and exports nijilive plus optional Live2D files; its documented single-image path uses the Apache-2.0 [See-through](https://github.com/shitagaki-lab/see-through) decomposer. | The closest match found for automatic cutting plus rigging. Existing layers are practical; flat-image decomposition requires an NVIDIA/CUDA service and about 20 GiB model volume in its documented setup, so it is not a runtime dependency or a fit for the owner's M2-only workflow without another GPU authoring machine. |
| **SAM 2 masks** | [Meta's Apache-2.0 SAM 2](https://github.com/facebookresearch/sam2) provides promptable image segmentation. | Useful for assisted masks, but it does not infer clean hidden body/cloth surfaces. It solves selection, not finished layer art. |

Search also surfaced [Stretchy Studio](https://stretchy.studio/) and Blender
image-plane add-ons. These are **unverified leads**, not acquired tools or a
recommendation based on known pricing/licensing. OpenToonz was suggested by a
secondary animated-splash discussion; its plastic/mesh workflow still needs a
primary-source check. No accounts, paid plans or trials were activated.

The first two routes are plausible ways to avoid a full rig for v1. This is a
working hypothesis, not a claim of equal output quality or a final tool choice.
Changing libraries will not rescue unsuitable source art or disconnected motion.

## Voice and art searches at the stopping point

- Myinstants' [Dedede search](https://www.myinstants.com/en/search/?name=dedede)
  exposed existing short clips including `king-dedede.mp3`,
  `king-dedede-laugh.mp3`, and `i-am-a-superstar-warrior_8UrG5U5.mp3` under its
  `/media/sounds/` path. They were **not downloaded, auditioned or selected**.
  A search for a clobber line was started but not completed.
- The anime's real line **“I need a monster to clobber that there Kirby!”** is a
  possible source lead; the [song reference](https://kirby.fandom.com/wiki/Kirby%3A_Right_Back_at_Ya!_%28song%29)
  identifies it. No clean clip has been acquired. The old prototype's invented
  “This here kingdom's got one king!” has no matching acquired recording. Use
  the actual clip's words/timing, credit its real source, and do not pretend
  an anime clip originated in the 1993 game.
- A Safebooru query for `king_dedede solo -gloves -mittens -humanization -cosplay
  -1girl` returned 22 mixed candidates, many from Forgotten Land or other
  versions. **None was visually approved or downloaded for use.** Do not pick
  a different costume just to get an easier image. The old 1993 source art is
  rejected as the final splash even though its source attribution is correct.
- One richer illustration generation attempt in the preceding turn failed.
  No generated replacement image is part of the project.

## Required next proof, regardless of tool

- [ ] Better central character art and coordinated body/hand/cloth motion.
- [ ] Preserve the liked fountain setting and KING / DEDEDE / source-title layout.
- [ ] Visible and audible buildup into the quote, rather than an empty cut.
- [ ] A real sourced voice clip, matching subtitles and intentional music timing.
- [ ] A distinct low-rarity signal and progressive blue/violet/gold/prismatic
  tiers, with Warp Star formation for SSR and rainbow Warp Star for UR.
- [ ] Compare tier signals without changing any existing unit's live rarity.
- [ ] Keep reduced motion, pause, Skip, replay and committed outcomes safe.
- [ ] Publish the small iteration for feedback before roster-wide work.

## Older parked model study (not selected)

An original-2011 Bandana Dee study was explored before the Cubism direction.
The original archive is retained in Git at
`assets/sprites/sources/faithful/bandana-model.zip` (TSR Models 287336;
John2k4 / MightyJetters). It has 40 skeleton joints, five skinned controllers
and no source animation clips. It was not published or selected as the SSR
solution. The cache-only scene is nonessential and may disappear in a fresh
workspace; do not report it as shipped character animation.

Useful reconstruction findings: source coordinates are Z-up and face +X;
rotate the model X by -π/2, then its wrapper Y by -π/2. Textures require
MirroredRepeatWrapping on S and RepeatWrapping on T; the wrong wrap caused
missing/upside-down eyes. Load the images before traversing materials.
Source .01/.02 face textures provide half/closed eyelids. Three.js 0.180's
Collada loader was used only in the parked study. This alternative still
requires suitable source-era assets and authored motion; do not swap the
current Adventure Dedede for a later design without the owner's decision.
