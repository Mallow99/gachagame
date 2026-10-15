# Splash kit (Dedede reveal v3)

A Dream Land banner you can actually pull on, a rarity-escalating Warp Star
summon, and an animated SSR splash for King Dedede. The pulls run the game's
real transaction (`src/gacha.js` `drawPulls`) on an in-memory demo save, so the
pool, rates, pity and 50/50 are the game's own.

```sh
npm run web                                  # then open http://localhost:8080/demos/splash-kit/index.html
node --test test/splash-kit.test.js          # rig sanity checks
node tools/browser-pull-blueprint.mjs out/pull-blueprint-02  # storyboard QA; server must be running
python3 tools/splash-kit/prepare_art.py      # re-download, verify and re-bake all art
node tools/splash-kit/export-artifact.mjs out/splash-kit   # self-contained copy for hosting
```

Status: **Dedede reveal v3 rejected (2026-10-14 America/Chicago).** The illustration was acceptable, but the reveal
regressed from v2: translucent shoes, generic shine and blink instead of meaningful motion, weak/overlapping audio,
and no voice-led anticipation. The next approved step is plan-first, not v4 implementation. Review
`blueprint.html` and [the full pull blueprint](../../docs/PULL_PRESENTATION_BLUEPRINT.md), then record the verdict in
[FEEDBACK.md](FEEDBACK.md). Nothing here is wired into the production summon theater yet.

## Files

| Path | What it is |
| --- | --- |
| `index.html`, `kit.css` | The stage and review controls. One 16:9 stage, sized in `cqw`, shared by every state. |
| `blueprint.html`, `blueprint.css`, `blueprint.js` | Blueprint 02: R/SR/SSR/UR character entrances, full orbit, ten-character cadence and switchable Dream Land / Mushroom Kingdom assets. Placeholder art and written audio cues; awaiting owner review. |
| `banner.js` | Flow: banner → summon → splash or card → ten-pull results → banner. Owns the demo save. |
| `summon.js` | Canvas 2D summon. `summonRenderer(canvas, opts).render(t)` draws any moment; `playSummon` plays it. |
| `splash/engine.js` | WebGL splash renderer: background grade, streaks, particles, character, smoke, flash. No per-fighter code. |
| `splash/deform.js` | Optional rig maths retained for future genuinely layered art. v3 applies no character deformers. |
| `rigs/king-dedede.js` | Everything Dedede-specific: art, blink, framing, palette, quote and voice. |
| `assets/SOURCES.json` | Source URLs, SHA-256 and credits for every image. `prepare_art.py` bakes from it. |

## How the v3 splash works

The credited Dedede illustration is separated from its original flat background
with the small U2Net model, trimmed, and laid on a static WebGL mesh. It does
**not** bend, breathe, sway or stretch. A brief shader blink preserves the
source drawing; drifting stars, twinkles, embers, foreground shapes, speed
streaks, rim light, smoke, background parallax and the reveal camera provide
the life. This follows the owner's accepted “nearly still character, active
surroundings” option and the Phantom Parade Todo reference.

Large independent motion still needs purpose-painted layers and completed
hidden surfaces. The runtime retains its old deformer support for future layered
art, but a flat render must opt into `art.motion: 'rigid'` and tests enforce that
its vertices remain fixed.

## Adding a fighter splash

1. **Pick the art.** It should be an approved version in a strong pose, preferably transparent or layered, at least
   1000 px tall. Add it to `assets/SOURCES.json` with URL, SHA-256 and credit. A detailed stage reads best because
   the engine blurs and grades it. For simple backgrounds, `removeBackground: "u2netp"`, `trimAlpha` and
   `trimPadding` make a reproducible cutout.
2. **Bake:** `python3 tools/splash-kit/prepare_art.py`.
3. **Grid:** `python3 tools/splash-kit/prepare_art.py --grid <id>` writes `assets/<id>/rig-grid.jpg`. Read pivot and
   mask coordinates (UV, v down) off it.
4. **Eyes:** `python3 tools/splash-kit/prepare_art.py --eyes <id> u0 v0 u1 v1` prints ellipses for the eye whites inside
   that box. Paste them into `eyes`. Set `blink.skinUV` to a pixel of eyelid-coloured skin. Set `blink.keep` to a colour
   box for anything that overlaps the eyes, such as a hat brim or beak.
5. **Copy `rigs/king-dedede.js`** and change the art, eyes, framing and palette. Keep `deformers: []` and
   `art.motion: 'rigid'` for a flat illustration. Only add part motion after separate layers and their concealed
   surfaces exist. Register the rig in `RIGS` in `banner.js` and in `test/splash-kit.test.js`.
6. **Check it in the page:** use the Preview tier buttons, and set **Rig view** to each deformer to see its weight heat
   map (blue is 0, red is 1). A mask that bleeds onto a neighbouring part is the most common mistake.

### Rig fields

- `deformers[]` are applied in order, so later ones move the result of earlier ones. List children before parents.
  - `type`: `rotate` (pivot, radians), `scale` (pivot, fraction), `stretchY` (pivot, fraction), `translate` (`direction`
    in render heights, y up) or `wave` (`amplitude`, `spatial` UV frequencies; use sparingly).
  - `amount * sin(t * freq + phase)` drives every type except `wave`. Shared frequencies (2.1 for breathing, half that
    for head sway) make the motion read as one body.
  - `mask`: any mix of `{ circle: [u, v, r] }`, `{ capsule: [u1, v1, u2, v2, r] }`, `{ rect: [u0, v0, u1, v1], soft }`
    and `{ all: true }`. Radii are in render heights. The highest weight wins.
  - `minus: ['id']` removes another deformer's region, for example so the head does not tilt the hammer.
- `framing.splash` / `framing.banner` set where the character sits and how busy the effects are. The engine tweens
  between them, so both need the same keys.
- `fx` holds the palette: background grade, glow, streak colours, rim light and particle counts.

## Summon tiers

Every pull starts as the same blue mote rising from the fountain. Higher tiers
add beats on top: **SR** turns it gold, **SSR** turns the gold mote into a Warp
Star that dives at the camera, and **UR** turns that Warp Star rainbow. The
highest result of a ten-pull sets the tier. R takes 2.0 s, SR 2.75 s, SSR 4.0 s
and UR 4.6 s, and Skip or Esc cuts straight to the reveal. No UR fighters
exist; the UR button only previews the effect.

## Known gaps

- The new voice clip is an anime performance, accurately captioned and credited; it is not presented as 1993 game audio.
- The chosen classic-design fan illustration still needs the owner's visual approval and may not be the final art.
- True limb/hammer motion remains deferred until the source art has separated pieces and painted hidden surfaces.
- The R/SR card reveal and the results grid use the existing source-era
  portraits, which are flat 1993 manual art.
- Each rig needs its own WebGL canvas; only Dedede exists, so `banner.js` uses one.
