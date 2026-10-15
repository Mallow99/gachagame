# Pull presentation blueprint 02

Status: **revised from Blueprint 01 feedback; awaiting owner review.**
The interactive storyboard is `demos/splash-kit/blueprint.html`. It uses
placeholder geometry and written audio cues. This is sequence review, before
final audio, character layers or production integration.

## Quality floor and owner corrections

Claude's v2 is the comparison baseline. V3 was rejected. The original source-era
Dedede art remains valid; the implementation was the principal failure.

- Every fighter gets a character entrance at every rarity. Production effort
  concentrates on SSR and UR. Fighters never collapse into cards.
- R is blue, SR silver, SSR gold, UR prismatic. Featured is a banner property,
  not a red rarity or a separate character-specific pull branch.
- The carrier makes one full orbit around the area, then curves toward the
  camera and strikes the screen. The storyboard draws that route explicitly.
- Area assets vary: Dream Land uses the Fountain and Warp Star; Mushroom
  Kingdom uses a pipe and Question Block. Both are selectable in the proof.
- A rare featured-banner cameo can be added as an optional flourish, with the
  same tier colour and core sequence. It must match the committed result.
- Items can use an object reveal, seal, icon or turntable rather than the
  fighter entrance treatment.

Voice and written quote must begin while the character and name are concealed.
Music leaves space for speech. A moving character requires separated pieces
and painted hidden surfaces; global bending, translucent shoes and cosmetic
shine/blink do not meet the quality goal.

## One director, area assets, fighter payoff

| Owner | Responsibility |
| --- | --- |
| Shared pull director | Committed receipt, one/ten timing, rarity promises, order, interruptions, voice-before-art, music ducking, Skip, replay, reduced motion |
| Area presentation profile | Origin, carrier, route styling, palette, impact treatment, audio family; Fountain/Warp Star or pipe/Question Block |
| Fighter payoff data | Approved character art/layers, entrance action, clean voice or character sound, quote, name and source label |
| Item payoff data | Item object, icon or illustration and its reveal treatment |

Fighter payoff data does not add a special summon branch for every character.
The optional banner cameo belongs to banner presentation data and is independent
of rarity. The storyboard only describes that future option; no cameo is authored
in this iteration.

The playable demo still uses the real `drawPulls` transaction. The blueprint is
a presentation-only timeline and does not call transactions or change pools,
rarities, ownership, pity or currency. UR uses a generic preview fighter; it
does not promote Dedede or add a UR unit.

## Shared opening and spatial route

| Time | Picture | Sound lane |
| ---: | --- | --- |
| 0.00–0.26 | Button answers; committed receipt is locked | Dry confirmation; music ducks 2 dB |
| 0.26–0.76 | Area origin gathers fragments into a neutral blue mote | Water/glass or pipe/coin family; low pulse |
| 0.76–1.35 | Mote rises out of origin, then bends left into the orbit | Pitch climb; acceleration ticks |
| 1.35–2.15 | Start a full lap from the left; cross the far side toward the right | Travel wind and area ambience |
| 2.15–3.00 | Tier cue transforms the carrier during the return side of the lap | Rarity accent |
| 3.00–3.40 | Complete the lap; curve inward and grow toward the camera | Approach rush; music drains |
| 3.40+ | Tier impact and character payoff | Impact, entrance and voice lanes below |

Positions are derived from storyboard time, so scrubbing and playback follow
the same full ellipse and final approach. The drawn orbit is explanatory
geometry, not a requirement for a visible dashed line in final production.

## Rarity language and character arrival

| Tier | Omen | Character payoff |
| --- | --- | --- |
| R | Blue mote stays steady; small blue-white hit | Quick solid entrance, name and player-controlled hold |
| SR | Silver current and metallic edge; charged silver hit | Stronger entrance, short character action and silver accent |
| SSR | Gold area carrier; 200 ms blackout before impact | Voice first, silhouette on the chosen word, full entrance, then name |
| UR | Prismatic carrier and spectral trails; 500 ms blackout | Longer voice-led entrance with space for an authored action and spectrum effects |

The omen promises a minimum tier already present in the receipt. An SSR or UR
does not require a special featured signal. A future featured cameo may promise
the featured fighter only when the committed result contains that fighter.

## Cinematic single-pull timing

| Beat | SSR | UR |
| --- | ---: | ---: |
| Blackout begins | 3.40 s | 3.40 s |
| Impact | 3.60 s | 3.90 s |
| Dark afterimage / impact decay | 3.83 s | 4.13 s |
| Voice and written line; no fighter or name | 4.07 s | 4.37 s |
| First silhouette on decisive word | 4.90 s | 5.20 s |
| Solid character entrance | 5.17 s | 5.47 s |
| Name, rarity, source and year | 5.60 s | 5.90 s |
| Player-controlled hold | 6.20 s | 7.10 s |

R enters at 3.65 s, shows its name at 4.00 s and holds from 4.45 s.
SR enters at 3.65 s, shows its name at 4.15 s and holds from 4.80 s.
Final timing will follow the auditioned voice phrase rather than forcing a
recording into these provisional intervals.

## Ten-pull structure

One opening carries the set, using its highest committed tier for the omen.
The contact creates ten closed lights in result order. Each light becomes a
character and remains on the roster stage after its entrance.

| Time | Beat |
| ---: | --- |
| 0.00–3.75 | Shared orbit, SSR warning, approach and set impact |
| 3.75–4.25 | Ten closed lights settle |
| 4.25–8.05 | Slots 1–5: R, R, SR, R, R; 0.70 s per R and 1.00 s for SR |
| 8.05–10.30 | Slot 6: blackout, impact, voice, SSR entrance and name |
| 10.30–13.70 | Slots 7–10: R, SR, R, R; each gets a character arrival |
| 13.70+ | Complete ten-character roster and player-controlled exit |

Later SSRs use a shorter cinematic entrance rather than repeating the long
opening. UR retains its larger payoff. These multiple-high-tier variants still
need an audio animatic; the current interactive example has one SSR.

The final result view must retain NEW, duplicate and Echo information. The
storyboard silhouettes demonstrate character presence, not finished roster art.

## Audio and control contracts

- Audition the voice in isolation. If no clean clip exists, use a sourced
  character sound and text rather than poor-quality speech.
- Music ducks 6–9 dB beneath speech and major impacts. The theme resolves
  after the voice. Sparse ambience leaves room for the line.
- Give gather, launch, omen, approach, impact, entrance and result settle one
  deliberate readable sound each. Preserve the pre-impact silence.
- Check phone speakers and headphones; keep final peaks at or below -1 dBFS.
- Sound-off, Skip, replay and reduced motion reach the same committed results.
  The blueprint provides Skip/replay and suppresses travel/arrival movement
  with reduced motion; it intentionally has no playable audio yet.

## Next review steps

1. Owner reviews Blueprint 02 route, tier colours and character cadence.
2. Audio animatic with temporary geometry and an auditioned mix.
3. Character layer sheet with completed hidden surfaces.
4. Single SSR proof compared directly with v2 on phone and desktop.
5. Ten-pull proof including multiple SSRs and UR interruption.
6. Production integration, then wider game UI/code work.

Record each verdict as Liked, Disliked and Still needed in `FEEDBACK.md`.
