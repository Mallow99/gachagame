---
name: splash-rig
description: Build or tune Pocket Gacha's animated gacha presentation (banner key art, Warp Star summon, SSR splash reveal) with demos/splash-kit. Use when adding a fighter splash, choosing splash art or backgrounds, or changing summon tiers.
---

# Splash rigs and summon presentation

Read `demos/splash-kit/FEEDBACK.md` first; it holds the owner's verdicts. Then read `demos/splash-kit/README.md` for
the pipeline: `SOURCES.json` → `tools/splash-kit/prepare_art.py` → `rigs/<id>.js` → `test/splash-kit.test.js`.

## Owner rules learned so far

- **Storyboard 04 annotations (2026-10-15):** Nightmare's lens-covering cloth
  must close from BOTH sides. Returning cloak/hands must gather back up into
  the SAME close-up figure, not cut to a replacement sprite. Dedede needs
  explicit action beats (try falling native Waddle Dee sprites), not one slow
  zoom over his entire showcase. Owner authorizes audio in this pass; keep
  music clear of calls. Nightmare ball form is optional for later sprite work.

- **Latest Nightmare correction (2026-10-15):** ten-pull per-result cues are
  liked; preserve them. Only the face slowly rises UP from cloak-darkness, then
  cloak returns/wraps him, close-up, pullback/upward pose adjustment, lock and UR
  identity. No body drawn during face-rise; no transparent-body substitute.
  Owner invited gentle course correction (`AGENTS.md`): finish this bounded
  review gate before parallel character/editor/economy branches. Banner/currency
  brainstorm is saved in `docs/GACHA_ECONOMY_BACKLOG.md`, not approved rules.

- **Owner authoring / narrow AI exception (2026-10-15):** future rough-storyboard
  tool should let the owner show the ideal, followed by an explicit sprite/rig
  feasibility review before production. AI images may supply brief 1–2-second
  transitional inserts such as a missing back view. This does not approve AI
  backgrounds or persistent showcase art. See `docs/STORYBOARD_AUTHORING_BACKLOG.md`.

- **Storyboard 02 correction (2026-10-15):** owner strongly likes Nightmare
  pulling back curtains on himself. Open them onto empty darkness FIRST, then
  looming cloak shadow / face emergence, close-up and pullback. For the ten-pull
  they offered either a coloured leader or per-result light tiers; current board
  tests per-result cues in original order. This supersedes the tenth-only rule
  below for new work; old cue 04 is a historical comparison. Bespoke UR actions
  need individual storyboards; SSR-specific actions may too. Do not roll this
  into a roster-wide batch or final rig before the current board's verdict.

- **Nightmare follow-up (2026-10-15):** no AI-generated background. Before
  building out the new UR payoff/banner flow, return to storyboard iteration
  and re-read `docs/PULL_PRESENTATION_BLUEPRINT.md`. Existing shared-cue progress
  is not approval of a new character's action. Use neutral sequence placeholders
  and sourced game background art; do not publish the rejected generated sky.

- **Never visibly warp a flat render.** Bending a single image (robe waves, sway, stretch) was rejected twice. For
  real motion, cut the art into layers and paint in what each part hides. Otherwise keep the character almost still
  and let the effects carry the life.
- **Confirm which version of the character before sourcing art.** The modern Dedede render was wrong for the Kirby's
  Adventure unit. Ask; do not assume.
- **Life comes from what surrounds the character**, as in the Phantom Parade Aoi Todo card
  (`docs/validation/animated-reveal-research/`): streaks, particles, rim light, smoke, a background grade, a camera
  push-in, then a flash.
- **Current direction (2026-10-15):** cumulative blue → silver/grey at SR → gold area carrier at SSR → rainbow at UR,
  then a screen strike. Higher tiers pass through earlier upgrades. Dream Land uses Fountain/Warp Star; Mushroom
  Kingdom uses pipe/Question Block. A ten-pull has ten travelling lights, with the cue on the tenth; result order
  stays committed. Every fighter gets a character arrival. Keep this unless the owner says otherwise.
- **Camera before identity:** after the concealed quote, frame SSR/UR from different angles/slants, pull fully
  back, let the character/lineup click into place, THEN show rarity letters and the name. A static held zoom was
  not what the owner meant. Keep tap-through and an option to skip R/SR entrances without removing results.
- **Dedede showcase (cue 04 request):** the SSR payoff was still too quick. Use a screen-effect entrance,
  centered face close-up and slower pullback, then slower name timing. Switch to related character music
  while Dedede is displayed, keeping his native call clear. This request does not itself authorize a new rig.
- **Let reveals breathe:** the owner explicitly corrected their timing complaint: the quote time was fine.
  Keep the current 4 s SSR / 4.8 s UR windows unless they request another change. Rainbow is UR only; default
  reviews should show gold SSR, with any SSR art used for UR clearly labelled as an effects stand-in.
- **Area music and smooth travel:** each area should have its own game music, not the same synth figure
  transposed. Keep music clear of calls/impact. Travel must join launch, lap and approach smoothly; the
  ten-light thread follows the actual curve, not straight cornered chords.
- **Keep from earlier studies:** the Fountain of Dreams setting, a small KING above a large DEDEDE, and the visible
  source game and year.
- **Native character sounds are valid.** The owner prefers the current nonverbal calls given the scarcity of
  voice lines. Keep captions honest; a spoken quote is optional, not a mandatory sourcing task. Never change
  rarity, units or banner data without the owner.

## Working method

- Pull through the game's real `drawPulls` (see `demos/splash-kit/banner.js`). Do not fake rates.
- Every image gets a URL, SHA-256 and credit in `SOURCES.json`. Bake with the script, never by hand.
- Before showing the owner, verify with the `pocket-gacha-verify` skill.
- Publish one small labelled iteration, then record the verdict (see the `owner-review` skill).

## Cutting flat art into riggable layers

Treat automatic cutting as a preparation aid, not a finished rig:

1. Confirm the exact character version and source art first. A perfect cut of the wrong costume is still wrong.
2. Prefer a layered PSD or transparent source. Record URL, credit and SHA-256 in `assets/SOURCES.json` before processing.
3. For a simple background, `tools/splash-kit/prepare_art.py` supports `removeBackground: "u2netp"`, `trimAlpha` and
   `trimPadding`. The small U2Net model is the practical default here; the 1 GB BRIA model exceeded this workspace's
   memory during the v3 study.
4. Separate only parts with defensible boundaries. A moving part needs the surface hidden beneath it painted in.
   If that surface does not exist, keep the character rigid and animate camera depth, blink, light and effects.
5. Use rigid transforms for cut pieces first. Do not add mesh deformation merely because the runtime supports it.

Online tooling checked during v3:

- [`image2live2d`](https://github.com/Wzhang3912/image2live2d) can auto-rig an existing PSD/layer folder and export
  nijilive or Live2D data. Its flat-image path uses See-through and an NVIDIA/CUDA service with substantial model
  storage, so it is a future offline authoring option, not a game dependency or an M2 runtime feature.
- [SAM 2](https://github.com/facebookresearch/sam2) can make prompted masks but does not reconstruct hidden surfaces.
- [Inochi Creator](https://github.com/Inochi2D/inochi-creator) remains a viable open authoring GUI after layers exist.
