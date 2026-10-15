# Visual cue 01 verification — 2026-10-15 America/Chicago

What this change does: adds a visual pull study with cumulative silver, gold
and rainbow upgrades, a cue on the tenth travelling light, and slower character
entrances with a quote hold, close-up and pullback. Preview receipts use the
existing `drawPulls` on disposable saves, with the example SSR still in slot six.

Checks completed:

- `npm test`: 119 passed, 0 failed.
- `tools/browser-pull-cue.mjs`: Chromium desktop at 1280px and phone layout at
  390px, with no console/page errors, failed asset responses or horizontal
  overflow. Local storage stayed unchanged.
- Single R/SR/SSR/UR and ten-pull tier caps, all earlier upgrade stages,
  ninth-versus-tenth cue ownership, quote-before-art, held 1.55× close-up and
  gradual pullback. SSR quote hold is 4 s; UR framing hold is 4.8 s.
- Skip, replay, pause, beat jumps, still reduced motion and a readable retry
  message after a blocked character image.
- Desktop and phone screenshots inspected: ten-light colours and separation,
  voice placeholder with concealed art, close-up, pullback, all ten fighters,
  both area carriers and the responsive two-row phone lineup.
- Eight cue-only cutouts rebuild from credited originals with verified source
  and output hashes. The game's portrait library is unchanged.

Review scope: one user running a local/private presentation proof. The director
model, Canvas renderer, disposable receipt setup, asset loading/error path,
export paths, controls and connected tests were read together. No remaining
correctness or bloat findings were identified for this scope.

Looks good. Ship for owner review.

Not checked: final audio (this pass is silent with a labelled timing quote),
authored character layers/actions, native iPhone or M2 performance, or production
save/router integration. Visual approval still belongs to the owner.
