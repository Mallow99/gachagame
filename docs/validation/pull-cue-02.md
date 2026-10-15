# Visual cue 02 verification — 2026-10-15 UTC

What this change does: corrects the camera to three slanted framings followed
by pullback, lock, rarity letters and name. It preserves quote holds, adds
tap/keyboard advance and optional R/SR reveal skipping, improves light effects
and Fountain alignment, and adds a stoppable music/effects/native-call mix.

Checks completed:

- `npm test`: 122 passed, 0 failed. The subsequent no-SSR filter edge assertion
  also passes in the seven-test cue suite.
- `tools/browser-pull-cue.mjs`: passed in Chromium at 1280px and 390px, with
  no page/console errors, failed responses, horizontal overflow or storage writes.
- Default SSR stays gold. Only the explicit UR effects preview reaches rainbow;
  the first nine lights remain blue. Cue ownership does not reorder the receipt.
- Quote windows remain 4 s SSR / 4.8 s UR. Art is concealed throughout. Three
  opposing/centered slants and pullback keep rarity/name hidden until lock.
- Stage click, Enter, Advance, pause, Skip, R/SR filtering, all four single
  tiers, both areas, still reduced motion and readable asset failure passed.
  Filtering retains all ten results, with the example SSR still in slot six.
- Both native calls fetch/decode and the actual Web Audio context runs after
  user input. Pause, advance, Skip and mute clear scheduled sources. A separate
  exported-site check confirms replay/pause, both areas and both native calls.
- The same scheduler rendered the single-SSR mix offline: 19.47 s including
  tail, peak 0.58994, RMS 0.02636 at default volume. The ten-pull mix rendered
  separately: 30.925 s, peak 0.59043, RMS 0.02187. Neither reaches clipping.
  Music events leave a .65 s lead before each concealed call window; short
  lower-tier name accents finish before the next call.
- Retained original WAV and playback MP3 hashes, credits, archive URL/hash and
  source member paths are checked. No pitch/tempo change or invented dialogue.
- Desktop/phone screenshots inspected: Fountain emission, tier escalation,
  camera crops, concealed quote, badge-before-name, both carriers and ten fighters
  in the responsive two-row phone lineup. Evidence and mix WAV are workspace
  captures under `/workspace/scratch/cue02-scenes`, not runtime dependencies.
- The self-contained export loads with `game-root="./"`, both areas, both
  calls and no page errors. Original game save/economy/content modules unchanged.

Review scope: one user running a private presentation proof. The controller,
timeline, Canvas renderer, audio scheduler, disposable receipt setup, asset
pipeline, controls, export and connected tests were read together. Review found
and fixed a floating-point beat-boundary jump and an overlong lower-tier sound
tail. Software-rendered screenshot/phase races were removed from the QA flow;
the 2D browser check uses CPU rendering. No remaining correctness/bloat findings
for this scope.

Looks good. Ship for owner review.

Not checked: subjective listening quality (audio input unavailable here), native
iPhone/M2 performance, final spoken quote selection, genuine character layers/
actions, production save/router integration or owner visual approval. Current
character illustrations remain rigid framing stand-ins. Native SSBU calls are
nonverbal and credited as such, not claimed to originate in Adventure/SMB1.
