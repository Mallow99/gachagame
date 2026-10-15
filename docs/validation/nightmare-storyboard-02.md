# Nightmare storyboard 02 — design before implementation

Owner likes the self-curtain reveal and the overall storyboard. Requested:
curtains open onto darkness first, then Nightmare emerges, a face close-up and
pullback, with a very large cloak shadow. Ten lights should either have the
coloured leader in front OR correlate individually with their decided results.
This pass tries the latter, not both rules at once.

Keep Lilita / Barlow, the broad banner and left-aligned inspector. Existing ink
#080611, cloth #211f43, silver #b9bfd4, blue #65ccff, gold #ffcf49 remain. Spend
the visual change on a true black void #04030b and the screen-filling silhouette,
not new decorative UI or a painted sky. Same neutral schematic art; no AI assets.

```
hands on cloth → open onto black → empty black hold
→ looming cloak / face emerges → opposite face slant
→ continuous full pullback → lock → UR letters → name
```

Review against the brief: keep his own curtain action, but remove the immediate
full-body reveal behind it. No extra casting cut before the face. Per-result
lights stay in receipt order and upgrade cumulatively only to their own tier:
R blue, SR silver, SSR gold, UR rainbow. Numbers / a small result-order legend
make that correspondence inspectable. No moving the UR into slot one or ten.
Preserve the current route, reveal controls and production isolation.

The broader workflow note is recorded: individual UR actions need storyboards;
SSR-specific actions may need them too. This does not request a roster-wide
storyboard batch now. Await this bounded pass's verdict before audio/rig work.

## Verification and review

- `npm test`: 130 passed / 0 failed. New regressions cover per-result caps,
  reordered fixture inputs (not hard-coded slots), unchanged receipt order,
  empty opening before emergence, camera/identity order and reduced motion.
- Source and self-contained exported build checked through
  `tools/browser-nightmare-board.mjs`: 1280px desktop and 390/420px layouts,
  no console/page errors, missing responses, horizontal overflow or storage writes.
- Actual Canvas pixels in the opening/dark gap are `[4,3,11,255]`: empty black,
  not a character hidden under a DOM label. No identity before camera lock.
- DOM light ledger matches the sampled cues at blue/silver/gold/rainbow beats;
  each SR/SSR/UR caps at its own tier, and the tenth R stays blue. Fixture order
  and slot-nine resume remain unchanged after Skip/replay/R-SR filtering.
- Nineteen screenshots inspected in `/workspace/scratch/nightmare-board-02`:
  banner, concealed call, cloak/hands, open/dark/emergence/face/pullback/name,
  per-result rainbow stage and key, SSR baseline, full lineup and mobile scenes.
- Reduced motion keeps sweep/hands/open/dark/emerge/face/pullback still within
  each beat and removes camera zoom/roll. All results still resolve.
- Screenshot review caught per-part alpha exposing hidden drawing lines during
  emergence; replaced it with a black veil over opaque character shapes. No
  generated assets or production rig/deformation were introduced.

Internal review: one owner's presentation study. Read the model, all callers,
controller ledger, Canvas scene, exports and connected tests. Shared cue motion
is reused, old cue 04 behavior is unchanged, fixtures remain frozen and no
transaction/storage path was added. No remaining blocking findings for review.

Not checked: native phone/M2 performance, subjective audio (no playable audio
in this board), final art/rig quality or owner acceptance of the new sequence.
