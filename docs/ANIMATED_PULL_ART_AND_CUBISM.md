# Animated fighter art and Cubism — owner direction, 2026-10-14

## Latest owner review: animated splash, iteration 03 rejected

Read [the fresh-chat handoff](NEXT_CHAT.md) and
[the preliminary simpler-tool investigation](ANIMATED_SPLASH_OPTIONS.md) first.
The owner clarified that the target is **animated splash art**, and asked to
investigate easier/free/open-source routes rather than assuming a whole rig or
Cubism is necessary. Full Cubism production stays deferred until after a
palatable playable v1. No replacement workflow has been selected or proved.

**Dedede iteration 03 failed visual acceptance:** poor image/isolated hammer
swing, static remaining body, flat flight-to-quote transition, missing voice,
awkward music entry and insufficient colour/rarity distinction. Keep the Warp
Star idea, small KING / larger DEDEDE, source-game label and fountain setting.
Next proof should start with a lower-tier signal, build through rarity colours,
form a Warp Star for SSR and a rainbow Warp Star for UR. Find a real matching
voice and improve coordinated character life. These are recorded requirements,
not completed changes. No rarity reassignment is authorized.

The prototype, seven JJK clips and Haru test remain preserved as evidence and
references. Passing their browser checks did not make the rejected splash
acceptable. Do not roll it across the roster. This latest review supersedes
the older preferred-Cubism wording in the research history below.

## Earlier production decision — 2026-10-14

The owner authorized finishing a palatable, playable v1 before returning to
full Cubism art production. Build **King Dedede (Kirby's Adventure, 1993)** as
one representative wide SSR reveal, then get visual feedback before expanding
the treatment. Try bounded shortcuts toward animated-card presentation:
prepared separate weapon/arm layers, small rigid rotations, an authored impact,
coherent near/far scenery, moving atmosphere and character-specific light.
Avoid large body warps, sliding facial features or a generic cutout sway.

**Deferred follow-up:** revisit Cubism after the playable v1. Author one proper
hero rig with concealed surfaces, expressions, local deformation and physics;
compare it against the accepted v1 reveal before deciding on roster-wide work.
The official Haru playback test proves runtime feasibility, not a custom rig.
Preserve the layer/source files from the Dedede proof for that later work.

### Dedede shortcut proof — technically verified, visually rejected

`demos/dedede-reveal/index.html` is the first reviewable implementation, exported
to the [private review site](https://pocket-gacha-reveal-review.berryowlet9.chatgpt.site/?v=dedede-03).
It uses the credited official Adventure illustration with runtime body,
weapon-arm and foreground-head masks. Concealed robe and hammer material closes
the overlaps during a bounded rigid rotation. The face keeps its source shape;
an improvised eyelid pass was removed after its edges failed visual review.
New coded spring scenery, water ripples, near/far star particles, moving light,
landing shockwaves and a recurring hammer flourish supply independent motion.
A richer illustration generation attempt failed; no generated illustration is
included or misrepresented as official art.

The full ceremony has Warp Star flight, the unnamed planned quote, a weighted
landing, separately timed S/S/R, the Adventure fanfare (opt-in), and a held
result. Replay, flourish, pause, Skip, reduced motion and letterboxed fullscreen
work in actual Chromium. `tools/browser-dedede-reveal.mjs` also checks failed-art
fallback, native audio cancellation, system motion preferences, a narrow
viewport and unchanged local storage. Evidence is in
`docs/validation/dedede-reveal/`. It does not establish visual approval, native
M2 performance, or integration with committed game receipts. The original flat
art remains a visible quality limit. Do not roll the treatment across the roster
or replace the production theater before the owner's feedback.

Earlier Phantom Parade clips remain at `/motion-references/index.html`; the
official Haru test remains at `/cubism/index.html`.

## Current direction

The owner clarified that the rejected rigged Mario was a poor execution of a
valid idea. A good central character, an appropriate rig, coherent surroundings
and signature effects can satisfy the desired pull presentation. A single
painted ensemble is not a requirement. The earlier ensemble paintings are
better candidates for memories / party bonuses. Preserve the wide Mario
stage, suspense, identity timing and final hold, while revisiting the artwork
and animation technique.

Cubism is now the preferred 2D technique to investigate. This is a direction
for one reviewable fighter proof, not approval of a finished rig or of a
wholesale replacement of the current game presentation.

The owner’s exact animation references are:

| Character/card | Owner’s preference / observed use |
| --- | --- |
| Aoi Todo — Are You Really Okay With That? | Especially liked for active effects. The inspected loop has strong foreground streaks, shifting coloured light and fragments around its central pose. |
| Mahito — Unbridled Soul | Breathing and hand movement with smoke/debris in the surroundings; useful for a quieter character-life loop. |
| Yuta Okkotsu — Lend Me Your Power | Sword light, surrounding swirls and Rika supporting the hero’s action. A companion can reinforce the hero rather than making the piece an ensemble memory. |
| Yuji Itadori — An Entrusted Life | Owner’s dramatic-clash reference, with confrontation and impact. |
| Megumi Fushiguro — Incomplete Domain | Owner’s simpler example that still feels alive. |
| Satoru Gojo — The Strongest Blue | Owner’s simpler acceptable character treatment. |
| Satoru Gojo — Domain Expansion of 0.2 Seconds | Owner’s acceptable baseline, below the richer effects treatments. |

All seven actual public card previews are playable in the
[private motion-reference board](https://pocket-gacha-reveal-review.berryowlet9.chatgpt.site/motion-references/index.html).
Their source pages, original asset URLs, file sizes and SHA-256 hashes are in
[cards.json](validation/animated-reveal-research/cards.json). Chromium verified
that all seven decode and play. These clips are card-art loops, not evidence of
the complete summon sequence, in-game banner interactions or the proprietary
rigging choices for each card. Only the first three have detailed sampled-frame
observations here; the simpler cards’ descriptions retain the owner’s assessment.

## What Cubism contributes

[Live2D’s own Phantom Parade showcase](https://www.live2d.com/en/showcase/title/jujutsuphanpara-2/)
identifies Cubism 4 and its Unity SDK. Our browser/Electron stack can use the Web
runtime instead of switching game engines.

[The deformer manual](https://docs.live2d.com/en/cubism-editor-manual/deformer/)
explains local warp and rotation controls. Rotation can move a rigid part
without the shrinkage caused by interpolating a large rotation through vertex
positions. This gives an author precise control; it does not make every
deformation attractive automatically. Expressions, key poses, draw order,
clipping and authored curves are part of making stable movement. Physics adds
secondary movement such as hair or cloth; it is not a substitute for the main
gesture’s animation.

Cubism also starts with separated artwork.
[Its preparation guide](https://docs.live2d.com/en/cubism-editor-manual/divide-the-material/)
explicitly includes drawing areas exposed when another part moves. A finished
PNG has neither those hidden surfaces nor separate eyelids, hands, weapon,
cloth and background layers. Cutting alone is insufficient. Large changes of
pose may need extra drawings rather than stronger distortion.

Our inference from the inspected cards: movement, effects and composition
work together. Cubism is appropriate for the character rig, while the scene
also needs independently animated foreground/background elements, light and
character-specific effects. It cannot generate Todo’s entire treatment simply
by importing a static image.

## Authoring and playback are separate tasks

[Embedded exports](https://docs.live2d.com/en/cubism-editor-manual/export-moc3-motion3-files/)
include a compiled `.moc3`, `.model3.json`, texture atlases, motion data and
optional physics/pose/expression data. The SDK plays these outputs. It does
not create a new finished rig from a PNG.

[The supported Editor requirements](https://www.live2d.com/en/cubism/download/spec/)
cover Windows and macOS, with an Apple Silicon build and an 8 GB minimum on
Mac. The owner’s M2 is a supported CPU family, subject to the OS requirements;
this has not been tested on their hardware. This Linux execution workspace
has no supported Cubism Editor. I can prepare integration, references, asset
briefs and playback here; a new rig’s authoring/export needs the supported
Editor or an existing suitable exported model. The documented
[external Editor API](https://docs.live2d.com/en/cubism-editor-manual/external-application-integration-api-list/)
exposes parameter/document access, not a complete headless rig-creation and
MOC3 compilation pipeline.

[FREE/PRO comparison](https://www.live2d.com/en/cubism/comparison/): FREE supports
basic work with limits, and a 42-day PRO trial is offered. No software was
purchased or trial activated. The runtime does not require the player to have
the Editor installed. [SDK terms](https://www.live2d.com/en/sdk/license/) allow
development verification without an initial SDK publication fee and describe
an individual/small-enterprise exemption, with an expandable-application
exception; this research is not a license determination for a future release.

Two playback routes remain viable: live Web SDK rendering for parameter-driven
interaction, or a Cubism-authored video for a fixed reveal/loop. Video export is
listed in the Editor requirements. Choosing exported video would preserve the
authored rig’s motion; it would not turn the asset back into a static painting.
The exact memory/CPU tradeoff still needs a representative character asset.

## Concrete runtime evidence

[Open the real Cubism test](https://pocket-gacha-reveal-review.berryowlet9.chatgpt.site/cubism/index.html).
It runs Live2D’s official **Haru** compiled sample with official **Cubism Core**,
through PixiJS 6.5.10 and pixi-live2d-display 0.4.0. It displays 42 parameters and
84 drawables. Chromium verified rendering, authored gesture playback,
expressions, face-turn control, physics setup and pause, without missing assets
or browser errors. Sample voices are omitted in the review manifest. This is
technical evidence, not a Nintendo character design or a completed game pull.

The adapter’s Cubism 4 renderer did not work with the latest 5.3 Core: it
expected the older drawable render-order API. The published technical test
pins the official versioned `core/05/` download, compatible with the tested
sample. It is not evidence that this adapter supports new 5.3 blending/offscreen
features. Select the official current Web Framework for a production path
requiring those features, or explicitly target compatible exports; avoid
silently upgrading Core. The failed draft was never published.

Source files and attribution are in
[the runtime source notes](validation/animated-reveal-research/SOURCES.md).
[Browser evidence](validation/animated-reveal-research/cubism-results.json)
records the narrow verification limits. An additional
[authenticated hosted check](validation/animated-reveal-research/hosted-browser-results.json)
verifies the deployed Todo movie and Cubism gesture playback. Response bytes
and the deployed CSP are preserved; the legitimate owner QA authorization
stays server-side. Canonical redirects are followed only within the Site origin.
Native Electron integration, M2
performance, device-loss cleanup and a custom character rig remain unverified.

## One-character production brief

Start with one current SSR and one approved hero-focused image/rig. Keep the
exact source-game design: clothing, colours, equipment and silhouette. Review
the proposed source art before substantial rigging.

Prepare a neutral hero pose plus the forms needed for a short signature
gesture. Separate rigid weapon pieces from the moving hand/arm; preserve a
clean grip and volume. Keep eyes and facial details on controlled layers.
Draw concealed areas, then test the extreme poses for gaps, sliding features,
shrinking parts and broken silhouettes before adding effects.

Useful signature studies: Bowser’s breath/roar with fire light and embers;
Dedede’s weighted hammer preparation with a contact shockwave; Bandana Dee’s
spear gesture with a trail and cloth follow-through. These are proposed motion
briefs, not changes to their kits or claims of original game animations. The
background should fit the fighter’s version and share its lighting.

Review a short loop on the actual wide stage, then the introduction/impact and
identity timing. Preserve the committed receipt, skip, reduced motion and
replay contracts. Extend the accepted proof only after owner feedback.

Asset search found a [free Kirby Cubism lead](https://ko-fi.com/s/db6c5ea42e)
and an [artist’s Mario Live2D project](https://princess_corona.artstation.com/projects/0QNxY).
Neither has supplied a verified suitable rig for the current SSRs. Do not
report them as acquired production assets or contact artists without the
owner’s instruction.

A bounded original-2011 Bandana 3D motion study was also explored before the
Cubism clarification. Its 40-joint source skeleton is real, but the archive has
no original animation clips and its Wii textures remain low-resolution.
The study is parked at `/workspace/.cache/bandana-motion-study`; it was not
published or selected as the new SSR direction.
