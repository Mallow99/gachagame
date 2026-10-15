# Nightmare storyboard 04 / audio animatic

## Bounded design plan

Keep the existing Lilita / Barlow type, broad stage, horizontal beat rail and
left-aligned inspector. Palette stays void #04030b, ink #0c0b19, cloth #211f38,
diagram silver #c3bfdc, cue blue #65ccff and SSR gold #ffcf49. Rainbow is UR only.
No page redesign or generated backdrop. Spend the visual change on the owner’s
annotated actions: two-sided cloth cover, returning hands, Dedede’s sprite shower.

```
Dedede: laugh → gold entrance / face → hammer / Waddle Dees
        → 1.5 s pullback → lock → SSR letters → name → hold
Nightmare: two-sided cover → hands / empty void → face rises alone
           → cloak + hands gather upward → SAME close-up figure
           → pullback / lift / lock → UR letters → name
```

The king remains a recognizable vector blocking proxy, not finished source art.
Nightmare reuses the exact head, cloak panels and hands across the wrap/face
boundary. Whole-figure transforms match the standalone face’s position/scale;
an opaque moving mask reveals the body behind returning cloth. No transparent
body fade or replacement full-sprite cut. Native Adventure Waddle Dee atlas is
copied by `prepare-board-art.mjs`, with its retained URL, credits and SHA.

Audio uses one beat-derived event list and the existing stoppable Web Audio
mixer, not another timer/scheduler. Area and character beds are mutually
exclusive. Native Dedede laugh has no music beneath it; Nightmare’s concealed
omen is honestly procedural, not a falsely attributed voice. Nightmare music
stays low through the cloth action, then opens up at the face shot. Native music
recording provenance and reproducible bake are retained, with no tempo change.

## Checks and internal review

- `npm test`: 133 pass / 0 fail. New tests cover Dedede beat order / deterministic
  sprite shower / atlas hash, closure and wrap camera endpoints, individual cue
  sounds, music windows and no false Nightmare voice event.
- Source and exported-site browser checks: single/ten confirmation/cancel,
  unchanged fixed results/order and per-result light caps, skip/filter/replay,
  slot-eight UR → slot-nine resume, no storage writes, no missing assets or JS
  errors, 390/420px no overflow.
- Pixel checks: cloth enters from both edges; closure matches the covered
  endpoint (subpixel antialias tolerance). Wrap and close-up match in the head
  / upper-body region. Empty void stays actual black; visor travels upward.
- Reduced-motion frames stay identical within each action/camera beat,
  including the Waddle Dee shower. Identity still follows camera lock.
- All six audio buffers decode; area / Dedede / Nightmare tracks switch at
  authored beats. Pause, seek and mute stop every scheduled source. Offline
  ten-pull mix: peak 0.59075, RMS 0.04512, exactly zero samples during the clean
  post-laugh hold. This is an objective check, not subjective listening approval.
- Thirty source screenshots inspected, desktop and mobile, in
  `out/nightmare-board-04`. Inspection prompted the fully overlapping curtain
  seam and clearer hammer-down position. Export QA repeats functional/pixel/
  audio checks without duplicating the screenshot set.
- Controlled sprite/audio manifest failures retain a usable silent storyboard
  and clearly labeled sprite fallback instead of failing page startup.

One-owner review: traced model → renderer/controller → audio event builder →
shared mixer and legacy cue caller → tests/export. Kept one source-lifecycle
owner and the original cue defaults. No new dependency, rig framework, pull
transaction, odds, currency, save or production roster mutation. No blocking
findings for this review iteration; not final art/rig or owner acceptance.

Not checked: native phone/M2 performance, subjective audio balance and final
character art/rig quality. Next gate: owner’s sequence/audio verdict, then a
Nightmare separated-layer/action proof if accepted. Ball form remains optional.
