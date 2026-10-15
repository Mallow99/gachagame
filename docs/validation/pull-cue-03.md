# Visual cue 03 verification — 2026-10-15 UTC

What this change does: gives Dream Land and Mushroom Kingdom their own sourced
game music, smooths the launch/lap/approach joins and makes the ten-light thread
follow the curve. Native calls and reveal timing/camera order remain unchanged.

Checks completed:

- `npm test`: 124 passed, 0 failed.
- `tools/browser-pull-cue.mjs`: passed at 1280px and 390px, with no page/console
  errors, failed asset responses, horizontal overflow or local-storage changes.
- New finite-difference regressions verify continuous position, velocity,
  acceleration and scale at launch, lap entry and screen approach. The full
  route stays in bounds at 120 Hz sampling. All ten lights keep unique positions.
- Both game music recordings and both native calls fetch/decode. Runtime audio
  state switches from Dream Land to Mushroom Kingdom; stopping or rebuilding
  clears the old schedule. Both area's on-page music titles match their sources.
- Music uses continuous source offsets between its audible windows, not the
  former repeated/transposed synth figure. Window bounds exclude native calls
  and the screen impact; 120 ms fades avoid hard gate clicks. Music tempo and
  pitch are unchanged even with slower visual playback.
- Actual single-SSR mixer rendered offline for both areas at default volume:
  Dream Land peak 0.58994, RMS 0.04856; Mushroom peak 0.50241, RMS 0.04792.
  Dream Land audition length including tail is 19.47 s. Neither mix clips.
- The music bake verifies full-download SHA-256 before processing. Bundled
  playback hashes, credits, original URLs, source games and duration coverage
  for the current slower ten-pull fixture are tested. Full downloads stay in
  the rebuild cache; the runtime contains two compact 48-second beds.
- Quote holds remain 4 s SSR / 4.8 s UR. Concealment, slanted camera shots,
  pullback/lock before rarity/name, click/Enter/Advance, R/SR reveal filtering,
  all tiers, UR-only rainbow, both area carriers, still reduced motion and
  readable portrait-failure state pass. All receipt results/order remain intact.
- Desktop/phone screenshots inspected: smooth entry/exit thread, escalation,
  native-call concealment, camera crops, names, both carriers, the area-track
  label and the two-row phone lineup. Workspace evidence and offline WAV are
  under `/workspace/scratch/cue03-scenes`.
- The exported private-site bundle loads with relative `game-root="./"`, plays
  both area tracks/calls, stops on Skip, and replays/pauses at 390px without page
  errors. A blocked music download still allows visual playback and displays
  an audio failure message instead of hanging the preview.

Review scope: one user's private presentation proof. Read the timeline and all
its callers, renderer/trails, audio event and source lifetimes, source bake/
provenance, controller, export and connected tests. No remaining correctness or
bloat findings for this scope. The automated Advance check now pauses a known
camera shot before clicking so it does not race the short automatic sequence.

Looks good. Ship for owner review.

Not checked: subjective listening quality, native iPhone/M2 performance, final
character layers/actions, production theater integration or owner approval.
The finite music beds cover the authored preview fixture; this is not a claim
of production music looping for arbitrary future receipts. The next proposed
gate is one genuine classic Dedede action/layer proof, not a roster rollout.
