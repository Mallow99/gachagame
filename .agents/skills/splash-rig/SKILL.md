---
name: splash-rig
description: Build or tune Pocket Gacha's animated gacha presentation (banner key art, Warp Star summon, SSR splash reveal) with demos/splash-kit. Use when adding a fighter splash, choosing splash art or backgrounds, or changing summon tiers.
---

# Splash rigs and summon presentation

Read `demos/splash-kit/FEEDBACK.md` first; it holds the owner's verdicts. Then read `demos/splash-kit/README.md` for
the pipeline: `SOURCES.json` → `tools/splash-kit/prepare_art.py` → `rigs/<id>.js` → `test/splash-kit.test.js`.

## Owner rules learned so far

- **Never visibly warp a flat render.** Bending a single image (robe waves, sway, stretch) was rejected twice. For
  real motion, cut the art into layers and paint in what each part hides. Otherwise keep the character almost still
  and let the effects carry the life.
- **Confirm which version of the character before sourcing art.** The modern Dedede render was wrong for the Kirby's
  Adventure unit. Ask; do not assume.
- **Life comes from what surrounds the character**, as in the Phantom Parade Aoi Todo card
  (`docs/validation/animated-reveal-research/`): streaks, particles, rim light, smoke, a background grade, a camera
  push-in, then a flash.
- **Approved direction:** the banner shows off the featured SSR, and the summon escalates from a blue mote to gold
  at SR, a Warp Star at SSR, and a rainbow Warp Star at UR. Keep it unless the owner says otherwise.
- **Keep from earlier studies:** the Fountain of Dreams setting, a small KING above a large DEDEDE, and the visible
  source game and year.
- **Quotes need a real recording.** The current Dedede quote was invented and has none. Never change rarity, units
  or banner data without the owner.

## Working method

- Pull through the game's real `drawPulls` (see `demos/splash-kit/banner.js`). Do not fake rates.
- Every image gets a URL, SHA-256 and credit in `SOURCES.json`. Bake with the script, never by hand.
- Before showing the owner, verify with the `pocket-gacha-verify` skill.
- Publish one small labelled iteration, then record the verdict (see the `owner-review` skill).
