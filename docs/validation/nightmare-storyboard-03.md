# Nightmare storyboard 03 — design before implementation

Owner likes the per-result ten-pull. Keep that behavior and the fixture intact.
Refine the UR: only the face slowly rises out of cloak-darkness, then cloth
returns and wraps around him, then close-up, upward pose adjustment and full UR.
Do not branch into other URs or an editor before this sequence is reviewed.

Keep Lilita / Barlow, the broad stage, inspector and light ledger. Existing
ink #080611, void #04030b, cloth #211f43, diagram silver #b9bfd4, blue #65ccff
and gold #ffcf49 remain. No new art/background or UI framework. The dramatic
change is physical upward head motion and returning cloth, not fading a body.

```
curtains → empty black → face rises alone
→ cloth returns around him → close-up → full pullback
→ slight upward pose adjustment → lock → UR / name
```

Use the same schematic head primitive independently of the complete figure.
Mask its lower edge with darkness rather than making parts translucent. Return
the cloth along explicit paths below the face before the full-body drawing.
Reduced motion uses a stable endpoint pose for each new beat. This is blocking,
not a final production rig. Audio stays written until sequence acceptance.

## Verification and internal review

- `npm test`: 130 passed / 0 failed. Focused Nightmare/gacha suite: 19 passed.
- Source and self-contained exported browser checks: no page/console errors,
  missing assets, horizontal overflow at 390/420px, or localStorage changes.
- Visor-pixel centroid moves up between 62% and 92% of face-rise (425.6 → 302.2
  desktop pixels). Camera zoom stays 1. Lower body region is actual black;
  the renderer calls only the standalone head primitive during this shot.
- Empty curtain gap remains black, rise precedes wrap, wrap precedes close-up,
  upward adjustment precedes lock/letters/name. Continuous 2.6 s pullback stays.
- Same frozen receipt / ten-light caps / original order / slot-nine resume,
  confirmation/cancel, step/scrub/pause/replay/Skip and R/SR filtering.
- Reduced motion produces identical frames within all new rise/wrap/adjust
  beats, no camera zoom/roll, and retains complete results.
- Twenty-four screenshots inspected in `/workspace/scratch/nightmare-board-03`.
  Review improved the wrap from a flat horizontal curtain edge to two curved
  panels gathering at the neck. No AI assets or production rig were added.
- Read-only economy check: fighter/supply each returned nine R then SR under
  forced low rolls. Current `srHard:10` protection includes singles; no batch
  rate bonus was added or claimed. `src/gacha.js` / `rules.js` are unchanged.

One-owner review: read model → scene/controller → tests/export. Extracted and
reused the same head primitive; removed obsolete whole-body emergence alpha.
No new dependencies, speculative rig framework or transaction writes. Existing
cue 04 and per-result signal logic remain unchanged. No blocking findings for
sequence review; not a claim of finished art/animation or owner acceptance.

Not checked: native phone/M2 performance, subjective audio (none plays here),
production rig quality or new economy balance. Next gate is the owner's verdict.
