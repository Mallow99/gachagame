# Splash kit (Dedede reveal v2)

A Dream Land banner you can actually pull on, a rarity-escalating Warp Star
summon, and an animated SSR splash for King Dedede. The pulls run the game's
real transaction (`src/gacha.js` `drawPulls`) on an in-memory demo save, so the
pool, rates, pity and 50/50 are the game's own.

```sh
npm run web                                  # then open http://localhost:8080/demos/splash-kit/
node --test test/splash-kit.test.js          # rig sanity checks
python3 tools/splash-kit/prepare_art.py      # re-download, verify and re-bake all art
node tools/splash-kit/export-artifact.mjs out/splash-kit   # self-contained copy for hosting
```

Status: **Dedede reveal v2, reviewed 2026-10-15.** The owner approved the banner and summon direction. The splash is not approved: wrong Dedede for this pull, and the warped render still looks weird. Owner feedback, inherited and new, is in [FEEDBACK.md](FEEDBACK.md); read it first. Nothing here is wired into
the production summon theater yet.

## Files

| Path | What it is |
| --- | --- |
| `index.html`, `kit.css` | The stage and review controls. One 16:9 stage, sized in `cqw`, shared by every state. |
| `banner.js` | Flow: banner → summon → splash or card → ten-pull results → banner. Owns the demo save. |
| `summon.js` | Canvas 2D summon. `summonRenderer(canvas, opts).render(t)` draws any moment; `playSummon` plays it. |
| `splash/engine.js` | WebGL splash renderer: background grade, streaks, particles, rigged character, smoke, flash. No per-fighter code. |
| `splash/deform.js` | The rig maths: mask weights and per-vertex deformers. Pure, tested in Node. |
| `rigs/king-dedede.js` | Everything Dedede-specific: art, deformers, eyes, framing, palette. |
| `assets/SOURCES.json` | Source URLs, SHA-256 and credits for every image. `prepare_art.py` bakes from it. |

## How the splash works

One flat, high-quality render is laid on a grid mesh (46×52 cells) trimmed to
its silhouette. Deformers move the mesh vertices every frame; the texture
follows, so the art bends instead of splitting. This is the core idea of Live2D
warp deformers, without layered art. Life comes mostly from what surrounds the
character, as in the Phantom Parade cards: drifting stars, twinkles, embers,
out-of-focus foreground shapes, speed streaks, rim light, smoke and a slow
camera drift.

The limit is deliberate: one flat image can only bend a little before it looks
stretched. Keep amplitudes small. Large independent motion (hair, capes,
an arm crossing the body) needs the art cut into layers first.

## Adding a fighter splash

1. **Pick the art.** It should be a clean official render with a transparent background, at least 1000 px tall, in a
   strong pose. Add it to `assets/SOURCES.json` with its URL, SHA-256 and credit. Add a background the same way. A
   detailed stage reads best because the engine blurs and grades it.
2. **Bake:** `python3 tools/splash-kit/prepare_art.py`.
3. **Grid:** `python3 tools/splash-kit/prepare_art.py --grid <id>` writes `assets/<id>/rig-grid.jpg`. Read pivot and
   mask coordinates (UV, v down) off it.
4. **Eyes:** `python3 tools/splash-kit/prepare_art.py --eyes <id> u0 v0 u1 v1` prints ellipses for the eye whites inside
   that box. Paste them into `eyes`. Set `blink.skinUV` to a pixel of eyelid-coloured skin. Set `blink.keep` to a colour
   box for anything that overlaps the eyes, such as a hat brim or beak.
5. **Copy `rigs/king-dedede.js`** and change the art, deformers, eyes, framing and palette. Register the rig in `RIGS`
   in `banner.js` and in `test/splash-kit.test.js`.
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

- No voice clip yet; the fanfare plays when sound is on.
- The R/SR card reveal and the results grid use the existing source-era
  portraits, which are flat 1993 manual art.
- Each rig needs its own WebGL canvas; only Dedede exists, so `banner.js` uses one.
