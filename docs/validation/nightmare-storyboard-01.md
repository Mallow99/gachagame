# Nightmare storyboard 01 — design and verification

Scope: one private sequence review, not a production banner, real pull, finished
rig or audio animatic. Source plan: `docs/PULL_PRESENTATION_BLUEPRINT.md`.
No generated images/backgrounds or parked experiment are used.

Design before implementation: retain Lilita display / Barlow controls. Dream
ink #080611, cloth #211f43, diagram silver #b9bfd4, fountain cyan #65ccff, SSR
gold #ffcf49, warm type #fff7df. Prismatic colours only signal UR. One broad
banner/stage, left-aligned text, a horizontal beat strip and written audio /
camera lanes below. No fighter cards, statistics dashboard or final-art claims.

```
Nightmare storyboard 01                    existing cue / blueprint
| Banner copy                  schematic Nightmare |
| single review                   ten-pull review  |
|              same stage becomes the sequence    |
Previous / Play / Next / Skip / Back      time + scrub
Current beat / what changes / written audio / camera
[opening beats] [Nightmare action beats] [lineup]
```

Review against the brief: the memorable moment is a screen-wide cloak closing
and opening with two hand gestures, not an expensive painted sky. Use simple
separate vector pieces and camera guides as blocking. Preserve the existing
smooth Fountain/Warp Star route and blue → silver → gold → rainbow timings.
Nightmare is the fighter payoff, not a second summon branch. A ten-pull contains
an SSR at six and UR at eight, then resumes the untouched result order.

Sequence approval is the next gate. Sound is written only; final background
must be sourced game art with provenance. Do not resume the stashed rig before
the owner reviews the action and camera order.

## Verification

- `npm test`: 129 passed / 0 failed, including four new model regressions.
- `tools/browser-nightmare-board.mjs`: source and self-contained exported build.
  Desktop 1280px, mobile 390/420px; no page/console errors, missing responses,
  horizontal overflow or localStorage changes.
- Confirmation / cancel / Escape-after-prior-confirmation, single and ten,
  play/pause, previous/next, scrub, Skip/replay and unchanged fixture order.
- Shared cumulative silver/gold/rainbow timings and tenth-only upgrade; SSR at
  six, UR at eight, slot nine resumes after UR. R/SR filter preserves all results
  and maps a skipped current slot forward by result index rather than old time.
- Concealed call (4.8 s UR), cloak cover, independent hand action, slanted
  cast/face blocking, continuous 2.6 s pullback, lock before rarity/name.
- Reduced motion yields identical Canvas frames within sweep/hands/open/cast/
  face/pullback beats and removes camera zoom/roll. Final results still resolve.
- Fifteen PNGs inspected in `/workspace/scratch/nightmare-board-01`. Fixed a
  duplicate pair of hands during the opening, premature opening-stage roster,
  a mobile Next button covering slots, and made the active beat stay in view.
- Export contains no Nightmare generated image/music assets from the parked
  experiment. The existing cue 04 model/renderer/audio are unchanged.

Internal review, one private owner: read the complete model → controller →
Canvas scene flow, tests and export. No real transaction/storage surface exists;
fixtures are deeply frozen and marked authored, no fake odds. Playback has one
owned RAF and stops on pause/seek/back/visibility. Existing shared cue logic is
imported, not forked. No new packages or speculative production infrastructure.
No remaining blocking findings. Ship for sequence review, not final acceptance.

Not checked: native iPhone/M2 performance, subjective audio quality (the board
intentionally has no playable audio), final illustration or production rig.
