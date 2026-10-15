# Owner feedback log

One entry per reviewed iteration. Record what the owner liked, what they
disliked, and what is still needed, in their words where possible. Read this
before changing anything here.

## Inherited from ChatGPT's Dedede study 03 (rejected, `demos/dedede-reveal/`)

Source: `docs/NEXT_CHAT.md` and `docs/ANIMATED_SPLASH_OPTIONS.md`.

| Owner note | Status in splash-kit 01 |
| --- | --- |
| Disliked: bad image; the hammer swing looked wrong next to everything else | Replaced with the Return to Dream Land Deluxe render. Hammer, fist, head and breath move together on shared timing. |
| Disliked: flight-to-quote cut had no buildup or noise | Warp Star dive, whiteout, pull-in zoom, star burst, then the quote word by word. There is no sound design beyond the fanfare. |
| Disliked: no voice; silence then music felt awkward | **Open.** No clip acquired. The quote in `src/content` was invented by the earlier study and has no recording. |
| Disliked: only the hammer moved | Six coordinated deformers plus blink. |
| Disliked: flat summon, no colour, no rarity distinction | Blue mote, gold at SR, Warp Star at SSR, rainbow Warp Star at UR, with tier preview buttons. |
| Liked: Warp Star idea | Kept as the SSR/UR beat. |
| Liked: small KING over large DEDEDE | Kept on the splash plate and banner. |
| Liked: visible source-game name and year | Kept: "Kirby's Adventure · 1993", from the unit's `sourceGameId`. |
| Liked: Fountain of Dreams setting | Kept, using the Smash Ultimate stage art. |
| Open question: classic Dedede may not deserve SSR | Set aside by the owner. Not changed. |

## Dedede reveal v2 — Claude's splash kit (reviewed 2026-10-15)

Verdict: **right direction, not complete.** "A MUCH better direction as a
banner": it shows off the featured SSR right away, and the summoning is "a lot
better". As a demo it is accepted; the splash itself is not approved.

Liked:
- The banner treatment: the featured SSR is the banner, with live rates, pity and pull buttons.
- The summon: the blue → gold → Warp Star → rainbow escalation and the tier preview buttons.
- From the earlier standalone splash: the image quality, the blink, and how much better it looks than study 03.

Disliked:
- **Wrong Dedede for this pull.** The Return to Dream Land Deluxe render is not the Dedede the owner wants for
  this unit. Confirm which version and which art before sourcing. Do not assume.
- **The warped render still looks weird.** The owner had already said the warping looked wrong ("waves in the
  wind"). Claude removed only the robe flutter and body sway and kept the rest of the mesh warp. That was too narrow
  a reading. Treat any visible bending of a flat render as rejected.

Still needed:
- The right Dedede art for this unit, chosen with the owner.
- Character life that does not come from warping one flat image. Options: art cut into layers with the hidden areas
  painted in, so parts move without bending; or a character that stays almost still, with the life carried by the
  FX layers, as in the Todo card.
- A real voice clip with matching subtitles. The current quote is invented and has no recording.
- Wiring into the production summon theater, keeping committed receipts, Skip, replay and reduced motion.

## Dedede reveal v3 — rigid illustrated treatment (rejected 2026-10-14)

Verdict: **rejected; a regression from v2.** The owner said it was “no better
than last attempt quality wise besides for the fact it has a voiceline” and
“worse then Claude's version.” Technical correctness and a different image did
not make it a better reveal.

Liked / clarified:
- The v3 illustration “would be a good image” and was “not horrid.”
- The original source-era image was also fine. Its apparent flatness was mainly
  an implementation failure, not an instruction to replace the art.
- V3's image is an acceptable alternative, not an inherently superior fix.

Disliked:
- The voice and written quote do not precede Dedede's entrance; they fail to
  create the requested anticipation before the character appears.
- The voice recording is low quality and overlaps the music.
- The rest of the sequence is missing sound design.
- The character treatment looks bad: translucent shoes, a generic shine, and a
  blink are not meaningful animation.
- The pass failed to build on v2's stronger presentation despite having that
  work available as a baseline.

Still needed:
- Plan the complete pull language before making another splash iteration.
- Study Phantom Parade's one-pull and ten-pull structure: a Black Flash warns
  of an SSR item, while a cursed-energy flash warns of SR.
- Storyboard R/SR/SSR/featured anticipation, the ten-result cadence, voice and
  quote order, and the reveal payoff before implementing final art.
- Give every major visual beat intentional audio. Duck music beneath speech and
  impacts rather than stacking everything at full volume.
- If the character moves, separate real pieces and paint hidden surfaces. Do
  not use translucency, global mesh warping, or a blink as the primary motion.
