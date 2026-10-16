# Nightmare native-layer proof 01 — design and scope

Owner approves storyboard 04's action/audio direction: “ur is ALOT better” /
“the music is good” / “i think we are ready to move on.” Keep the choreography.
Corrections: smoother transitions, distinct banner/pull music, tracks consistent
with the character actually shown. Next bounded gate is layer/action feasibility,
not production integration, other URs or the editor.

Preserve Lilita / Barlow, the broad stage and left-aligned beat inspector.
Palette: void #04030b, ink #0c0b19, native cloak blue #0040ff, frost #b8d8ff,
SSR gold #ffcf49 and diagram silver #c3bfdc. No new site framework or AI art.
Native art is an explicit optional preview; the approved schematic remains
available in the same review. A small layer inspection strip shows what moves
independently and calls out the reconstructed opaque cloth interior.

```
banner theme → pull/fountain theme → clean concealed call
→ character's OWN source-game theme → area / results

native sheet → head + left hand + right hand + torso
            + complete opaque cloak panels → same approved action timeline
```

The original Adventure sheet intentionally makes black transparent. Cutting it
is not enough to obtain a screen-covering opaque cloak. Use a clearly labeled,
hand-authored cloth interior behind the native pieces, with complete coverage;
do not stretch a full image or quietly call this final illustration work.
Source palette / pixel edges are retained; the native head and hands move as
independent rigid parts. No generated background. Use the sourced battlefield
in the native preview only after darkness / emergence has completed.

## Verification and internal review

- `npm test`: 135 pass / 0 fail. Added native source/part hash checks and a
  continuous character-theme window / source-era music / level-ramp test.
- Source and self-contained export native-browser checks pass with zero page
  errors or missing responses. Thirteen source PNGs inspected, including the
  source-piece gallery, face rise, returning hands, final pose, exploded view,
  and mobile/full-page layout. Both 390 and 420px have no horizontal overflow.
- Inspection caught the rip's near-black (4,2,4) backdrop and sheet separator;
  removed those exactly and excluded blue shoulder/arm fringes from the rising
  head. Browser checks now assert real alpha, not merely black rectangles.
- Native wrap → face figure-region pixel difference is exactly 0 at the join.
  Screen-edge camera accents are independently authored and intentionally begin
  with the close-up. Darkness stays empty; lower-body region stays black during
  face-only rise. All native action/camera phases have stable reduced-motion
  frames. Exploded inspection changes pieces without changing the receipt.
- Confirmed banner title theme → pull/Fountain → character's source-game boss
  track; crossfade retires its prior mix after .7 s, with at most one old mix.
  Pause and mute stop current AND retiring sources immediately. Asset failures
  retain a usable schematic/silent review rather than breaking initialization.
- Accepted-board export regression passes: same receipt/order, original lights,
  skip/filter/replay/resume, camera-before-identity, reduced motion, storage
  unchanged, eight decoded buffers. Offline ten mix peak .59075 / RMS .04345;
  post-laugh hold peak 0. Historical cue browser/audio checks also pass, keeping
  its original Super Star comparison intact.
- Music context checked against [Adventure's track list](https://www.zophar.net/music/nintendo-nes-nsf/kirbys-adventure)
  and [Dedede's game-specific music note](https://kirby.fandom.com/wiki/King_Dedede).
  Title, Boss!, Fountain and Nightmare are all Adventure (1993) recordings.

One-owner code review: traced source bake → asset loader → renderer/inspection
→ controller/transport → shared mixer → old cue caller → tests/export. One
audio lifecycle owner; continuous Nightmare music replaces duplicate windows.
Retiring sources are bounded, canceled on stop/mute/seek, and cleaned up after
fade. No new runtime dependencies, speculative rig editor, production data,
rates, currency, save mutation or generated image. No blocking findings for a
clearly labeled feasibility review. This does not approve final art quality.

Not checked: native phone/M2 performance, subjective music transitions / banner
loop seam, or final illustrated rig quality. Next gate is the owner's verdict
on the native-pixel + reconstructed-cloth route, not another character batch.
