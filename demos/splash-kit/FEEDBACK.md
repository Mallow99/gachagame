# Owner feedback log

One entry per reviewed iteration. Record what the owner liked, what they
disliked, and what is still needed, in their words where possible. Read this
before changing anything here.

## Visual cue 01 — reviewed 2026-10-15 UTC

Verdict: a good step in the right direction; continue with camera corrections,
visual polish and audio, not final production approval.

Liked:
- “then yeah, you did a good job, im happy with it!”
- “I do like how the mario kingdom has the warp pipe”.
- Latest correction: “okay, i think i overstated it the qoute time is actually fine, that ones on me”.

Disliked:
- “i think you missunderstood the close up. I meant where the camera looks in at it at different angles/slants before zooming all the way back out and having everything click into place, THEN having the S S R and name appear. As it stands right now its kinda eh.”
- “maybe make the visual with the orbs look a bit better, whether that means more effects or a bit more of a dynamic animation, i saw the story boards as the idea and assumed wed build off of it.”

Still needed:
- “aslong as you can click through this its fine”.
- “THere should also be a way to skip the r and sr pulls and just see the ssr pulls.”
- “rainbow is meant to be reserved for ur?”
- “i wish the dreamland would have the fountain a bit lower so it looks like its coming out of the fountain.”
- “Maybe fix this and do audio at the same time in the next pass?”

Visual cue 02 keeps the quote windows at 4 s SSR / 4.8 s UR and changes the
camera to three slants, pullback, lock, rarity letters, then name. Tap/keyboard
advance and an R/SR-reveal filter preserve every committed result. The fountain
rim now aligns with emission; longer trails, depth and sparks build the orb cue.
The default is gold SSR; rainbow requires the explicit UR effects preview.
Procedural music/effects and retained native Dedede/Bowser calls play from a
single stoppable schedule, with music absent during the concealed call window.
Nonverbal call captions are not a finished spoken quote. Art remains a rigid
source-era framing stand-in, not an authored character layer animation.
**Visual cue 02 awaits owner review.**

## Pull blueprint 02 — reviewed 2026-10-15 America/Chicago

Verdict: **“Okay alot better”**; proceed to the visual cue with escalation and pacing changes.

Liked:
- “Other than that, looks good, move onto the visual cue in this next pass”.

Disliked:
- “oh yeah also its all too fast, maybe slow it down a bit, and definitely slow down the time between the qoute and the character.”

Still needed:
- “i want something alot more with it, maybe gradually escalating things, so like it would turn grey, then yellow, THEN rainbow, then it would smash into the screen.”
- “And for 10 pull it would  be trailed out by smaller dots and have a 10 line, but the visual cue is on the 10th one.”
- “plus on ssr and ur, zoom into the character aswell briefly before zooming out to them all, dont speedrun it.”

Visual cue 01 interprets this as cumulative upgrades capped by the earned tier,
a leader and nine trailing lights with the signal on the tenth/rearmost light,
and a slower character sequence. The tenth signal describes the set's maximum;
it does not reorder the receipt or guarantee that result slot ten is rare.
SSR quotes get 4 s and UR framing 4.8 s before any art. Close-ups hold for
1.7 / 2.1 s before a 1.4 s pullback. Existing source-era art is a framing stand-in;
the quote is still a labelled timing placeholder and no audio plays in this pass.
**Visual cue 01 verdict is recorded above.**

## Pull blueprint 01 — reviewed 2026-10-15

Verdict: **revise before approval.** The owner supplied six corrections.

Liked:
- “I do like the warp star for being the signifier”.
- On circling the area then returning toward the screen: “if it is, thats cool”.

Disliked:
- “id rather things didnt get folded into cards, id much prefer it if everyone had a character even if the quality really goes into the ssrs as thats what you want to see. Cards flattens things to such a big extent. Items can be a bit different.”
- “I think we should change colors of things, either making sr silver, or adjusting for the idea that UR is a thing, hich also btw isnt included in this.”
- “right now it just looks like it arbitrarily is going into the corner then slamming into the screen, which is kind of weird.”
- “it is a bit odd that its a warp star everytime even in this”.
- “we dont really need something seperate for the specific characters” and “the fact its red also makes it confusing for me”.

Still needed:
- “maybe instead just having a placeholder because like for mario maybe that would be a question block? infact, maybe we try and customize the assets depending on the area, like for mario we could have the effect come out of a pipe, here we can have it come out of the dream fountain, elsewhere we can do similar things.”
- “if we want the extra flourish of having a special signal if its the banners character we can”, with the JJKPP Gojo animation as a possible reference.
- “obvi add a ur thing”.

Blueprint 02 addresses these with character arrivals for all fighter tiers, blue /
silver / gold / prismatic cues, a drawn full orbit followed by a camera approach,
switchable Fountain/Warp Star and pipe/Question Block profiles, an optional banner
flourish described separately from rarity, and an interactive UR path. Placeholder
geometry and written audio cues remain deliberate at this sequence-review stage.
**Awaiting owner verdict; not approved for final production.**

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
