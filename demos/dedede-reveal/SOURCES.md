# King Dedede: one-character SSR proof

Private review only. This prototype does not load or modify a game account,
generate a result, spend currency, change rarity or change the character kit.

## Art and sound

- **King Dedede:** original **Kirby's Adventure (NES, 1993)** official artwork,
  Nintendo / HAL Laboratory. Unmodified original retained as
  `assets/dedede-adventure.png` (899 × 864).
  [WiKirby source](https://cdn.wikirby.com/d/dc/KA_Dedede_artwork.png).
  SHA-256 `5d21e7d42dfa42cc22ddf94dbfdab5eb5739539b2a230f2d7c64e6b1d8a7d2e3`.
- **Fountain scene:** new SVG environment drawn in code for this study, inspired
  by the source game's dream spring, pastel architecture, water and stars.
  It is an adaptation, not extracted official scenery. It contains no other
  fighters or later-version costumes.
- **Music:** original Adventure short fanfare, Hirokazu Ando / Jun Ishikawa,
  Nintendo / HAL Laboratory; existing credited game intake from Zophar's Domain.
  [Full original intake and processing](../../assets/audio/reveal/SOURCES.md).
  No new voice recording is claimed. Low landing/flight tones are procedural.
- **Fonts:** Lilita One and Barlow Condensed, retained from the approved Mario
  demo; their original attribution/license material remains with that demo.

## What actually moves

The original image is separated into body, hammer-and-arm, and foreground head
with runtime canvas masks. A small filled robe patch prepares the concealed
shoulder. The arm/hand/hammer rotate together around the shoulder, preserving
their grip. The head is redrawn above the hammer to preserve source occlusion.
There is no mesh, face warp, scale-based breathing or newly compiled Cubism rig.
The short flourish is authored for this proof, not ripped source-game motion.

Landing stars, water ripples, foreground particles and light are independent
scene elements. The full sequence preserves the planned unnamed quote,
weighted landing, separately timed S/S/R and player-controlled final hold.
Sound is opt-in. Pause, Skip, reduced motion and hidden-page suspension are
available. The animation canvas is capped at 1600 × 900 and approximately 30 Hz.

## Review gate and follow-up

This is a bounded shortcut toward the owner's Phantom Parade references.
The original flat illustration is a visible quality limit. A richer central
painting and properly authored Cubism rig are deferred until after a palatable
playable v1; see `docs/ANIMATED_PULL_ART_AND_CUBISM.md`. Review this one character
before applying the technique to more SSRs. Browser checks prove loading and
controls, not the owner's visual approval or M2 performance.
