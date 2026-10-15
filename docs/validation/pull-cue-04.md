# Visual cue 04 verification — 2026-10-15 UTC

What this change does: gives King Dedede a screen entrance, centered face
framing, slower pullback, slower identity build and related character music.
His Adventure artwork, concealed call timing and all pull results stay unchanged.

Design: retain the purple night, gold SSR and cream type, with Lilita display /
Barlow labels. The screen star opens at the face; camera pulls to character-right
and identity builds on the left only after lock. Gold frame rays stay subtle.
On phones the identity panel is raised to clear the retained character lineup.

Checks completed:

- `npm test`: 125 passed, 0 failed. New regressions verify Dedede-only timings,
  centered face framing, 2.15 s pullback, delayed 1 s name build, click completion
  of the partial name, reduced motion and character/area music windows.
- `tools/browser-pull-cue.mjs` against the self-contained export: desktop 1280px
  and phone 390px, with no console/page errors, failed responses, horizontal
  overflow or storage changes. All ten results retain their committed order.
- Screen iris, face/slants, pullback, lock, letters, half-built and complete name
  checked through deterministic timing. Art stays hidden for the original 4 s
  SSR / 4.8 s UR call. The new post-call showcase spans 8.5 s.
- Stage/Enter/Advance, partial-name completion, R/SR filtering, Skip/pause,
  all tiers and area carriers pass. Reduced motion keeps both Canvas layers
  still and suppresses iris, zoom and roll. Portrait failure remains readable.
- The actual Web Audio context fetches/decodes five assets: two native calls,
  two area tracks and Dedede's theme. His theme begins after the call, seeks from
  a character-local offset, stops on pause/Skip/rebuild, and returns to area music
  after his ten-pull segment. A single keeps his theme through the final hold.
- Independent exported-site playback verifies Dedede theme → Dream Land area
  return, Mushroom music, all five decodes, Skip and unchanged relative imports.
- Offline single-SSR mixer: 24.1 s including tail, peak 0.58994, RMS 0.05132.
  Bowser comparison peak 0.50241, RMS 0.04792. Neither clips at default volume.
- Original and baked character-theme hashes, URLs, credits, source year and
  duration are tested. The two previous area outputs retain identical hashes.
  King Dedede's Theme is from Super Star (1996), explicitly credited as related
  music; the artwork/unit source remains Adventure (1993).
- Screenshots inspected at desktop and phone sizes: star opening, face, pullback,
  rarity/name sequence, original call concealment, all tier cues and both areas.
  Phone source label and roster boxes are asserted non-overlapping. Evidence /
  audition WAV live in `/workspace/scratch/cue04-scenes`, not runtime assets.

Review scope: one user's private presentation proof. Read the model, renderer
and foreground composition, controller, audio event/source lifetimes, music bake,
export, all callers and connected tests. Found/fixed the phone source/roster
overlap and partial-name click-through edge. No remaining correctness or bloat
findings for this scope.

Looks good. Ship for owner review.

Not checked: subjective listening quality, native iPhone/M2 performance, final
owner approval or production-theater integration. Artwork remains rigid;
authored body/hammer layers are not part of this screen/camera/music pass.
