# Nightmare sprite pass 02 — 2026-10-16 UTC

Replaces rejected native-layer proof 01. Owner asked “Retry this time” after
rejecting mismatched parts, schematic curtains and unconvincing hand contact.
This is a new review iteration, not an owner-approved final art style.

## Artwork

- Complete raised-hand Adventure pose is the assembly reference: 82×76.
  Body, masked head and both hands retain their native positions. Reassembly
  is pixel-identical to the palette-corrected source pose.
- The ripper’s replaceable pink maps to the source violet ramp. No source
  silhouette is stretched or independently enlarged. Final idle uses three
  complete native poses rather than moving disconnected crops.
- New pixel-art curtain/wrap atlases have eight frames each. Vertical folds,
  stars, stepped hems and gathered creases use the source colour ramp.
- Palm is behind cloth; curled fingers are in front. Both panels and hands
  use the same contact anchors through opening and return. Open hands then
  release into their exact original pose as the cloth tucks away.
- Sprite mode replaces the entire Nightmare shot before schematic drawing;
  there are no old vector hands or curtains underneath it.
- One 160-pixel-wide stage preserves proportions across desktop and phone
  ratios. The sourced battlefield is cropped, never stretched; no AI art.
- Face-only mask excludes pauldrons, pendant, torso and hands. Wrap continues
  into the same close-up, with a small face push/slant before the 2.6s pullback.
- Sprite mode is default. Unchecking it retains the historical storyboard.
  Other fighters/shared opening are still explicitly storyboard material.

## Checks

- 139 Node tests pass. New tests cover shared contacts over 101 samples per
  phase at both aspect ratios, exact native hand endpoints, all camera joins,
  upward head travel, stable reduced motion, asset dimensions/hashes/provenance.
- Bake asserts exact native-pose reassembly. Browser independently compares
  every assembled pixel. Central wrap-end/close-up pixel difference: 0.
- Native browser checks: 11 desktop/390px captures inspected; 420px overflow
  check; no page errors/missing assets; empty void and face-only rise; reduced
  motion, guide toggle, fallback on a failed asset, music and stop/cleanup.
- Full accepted-board regression: single/ten, cues and slot order, concealed
  holds, SSR/UR filtering, replay/skip/resume and unchanged storage. Durations
  remain 35.25 / 56.805s. Offline audio peak .59075, RMS .04345; silence clear.
- Historical cue regression passes, including both area audio mixes.
- Source and exported runtime checked. Production pools, currency, saves and
  transaction code untouched. No native phone/M2 performance or subjective
  listening approval claimed.

## Lean review

What this change does: replaces independent cutouts and schematic cloth with a
matched native sprite composition and explicit pixel-art contact frames.
Reviewed loader, controller, fallback, render path, bake, model and tests for the
expected single-user review load. No new dependency or generic rig framework.
Looks good. Ship for owner review; final visual acceptance remains theirs.
