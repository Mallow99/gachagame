# Gacha presentation reset — 2026-10-14

**Newer owner clarification:** read
[animated pull art and Cubism](ANIMATED_PULL_ART_AND_CUBISM.md) first. The owner
wants animated character presence, depth and signature effects, with Phantom
Parade’s exact card examples as the motion reference. A well-rigged character
in a coherent animated scene is valid. The earlier rejection was of a poor
Mario rig/background, not the technique itself. Ensemble paintings are now
better candidates for memories / party bonuses. The wide layout still applies;
the single-complete-painting recommendation below records the earlier direction.

The owner rejected the current 360 × 600 pull presentation. It squeezes the
celebration into the Manual, substitutes isolated catalogue illustrations for
full art, and makes SSRs feel like small mobile reward cards. Technical checks
proved that the UI worked; they did not establish the requested visual quality.

The approved [Mario demo](../demos/mario-pull/index.html) remains the primary
reference. [Open the earlier private browser comparison](https://pocket-gacha-reveal-review.berryowlet9.chatgpt.site/references/)
with the owner's ChatGPT account. The [local comparison](validation/reveal-redesign/index.html)
also works through `npm run web`. These are research pages and do not load a
game account or spend currency.

The owner requested visible iterations for sign-off before further extensive
presentation work. Start with one SSR proof, incorporate feedback, then extend
the accepted treatment. The current review separates the established Mario
layout reference from two Kirby artwork moods: dramatic battle and bright
adventure. Both paintings remain examples, pending exact-game/focal-character
checks for production use.

## Review delivery

The chat file viewer could not open the original linked HTML. A self-contained
export also failed in that viewer despite working in Chromium. The owner-facing
initial review used an owner-private Sites deployment, with eighteen local image
assets and no application scripts. Image comparison controls and the source
gallery work without JavaScript. All twenty image elements decode in actual
Chromium on both the project server and the standalone export; the export
makes no network requests. This browser evidence does not prove compatibility
with the chat's file viewer.

The separate hosting checkout is `/workspace/sites/gacha-reveal-review`.
Its Site identity is persisted in `.openai/hosting.json`; reuse that Site for
review iterations and preserve owner-only access. Only review HTML and image
assets were initially deployed, with credits and source links; game saves were excluded.
[Deployment evidence](validation/reveal-redesign/hosted-preview.json) records
the successful private publication. The game repository remains local.

For a downloadable single-file copy, run `node tools/build-reveal-preview.mjs`.
The default export is `/workspace/gacha-reveal-preview.html`; opening that file
in a normal browser is supported, but chat file-preview delivery is unverified.

## What the approved example does differently

| Element | Rejected game presentation | Approved Mario reference |
| --- | --- | --- |
| Stage | 360 × 600 management window | A wide 16:9 stage |
| Artwork | Standalone character drawing on generic rays | One complete authored illustration with lighting, action and context |
| Portrait pieces | Small centered image above stacked labels | Whole composition on the right; a subdued copy supplies the surrounding atmosphere |
| Reveal | Art and rarity labels arrive together | Impact/blackout, quote, camera reveal, then individual rarity impacts and name |
| End | Short automatic hold | Player can linger on the finished artwork |
| Banner | Featured result portrait over unrelated background | Separate group/environment artwork that sells the Hub's adventure |

“Full art” describes the composition, not simply full body or high resolution.
A portrait illustration can work beautifully in a wide theater. A larger
encyclopedia cutout still misses the requested result.

## External references and implications

- **Genshin:** [this actual Jean reveal screenshot](https://www.hoyolab.com/article/10307975)
  shows a wide composition where the character and her painted wind effects
  occupy the stage; the identity occupies a separate region. This is a visual
  observation of the screenshot, not a claim about the designers' intent.
- **Star Rail:** [the splash-art gallery](https://genshindb.org/honkai-star-rail/character-splash-arts)
  is useful for character-specific props, effects and context in one illustrated
  asset. The page describes the assets' use in pulls and ultimates; its roster
  snapshot is historical rather than a current completeness reference.
- **Phantom Parade:** [these official-broadcast captures](https://dengekionline.com/article/202405/5522)
  show SSR character illustrations with strong poses and authored visual effects.
  The owner's earlier Phantom Parade comparison belongs alongside Mario as an
  art reference. These promotional captures are not measured summon timings.
- **Hearthstone:** [Blizzard's effects artist](https://hearthstone.blizzard.com/en-gb/news/22552047/developer-insights-the-art-behind-the-science)
  describes choosing effects from a card's art, lore and the specific event.
  My application: give each SSR a signature impact and sound rather than
  swapping a portrait into identical gold rays.
- [Ben Thompson's pack-design interview](https://toucharcade.com/2017/04/04/designing-hearthstone-card-packs-animations-iterations-ungoro-and-more-with-art-director-ben-thompson)
  is useful for the relationship between the illustrated object, physical
  movement and opening effects. My application: build a short, readable action
  with a satisfying impact, instead of extending an arbitrary loading-like wait.

## Recommended implementation

1. Give summons a temporary wide in-app theater, around 1200 × 675, fitted to
   the display. The Manual can remain compact between pulls. Optional fullscreen
   should be a player choice. [Electron supports independently sized windows](https://www.electronjs.org/docs/latest/api/browser-window).
2. Source the three current SSRs' full illustrations first: Bowser, Dedede and
   Bandana Dee. Choose dynamic, cohesive pieces with the pulled fighter as the
   clear focal point. Check the depicted outfit, weapon and iteration; artwork
   publication year alone is insufficient. Keep separate banner key art.
   Rare Supply results also need composed item/Assist presentation with their
   collectible type clear; a studio icon alone is not the full-art target.
3. Preserve a piece's composition. Use portrait/full-scene staging like the
   approved demo or full-frame landscape art; avoid forcing every piece into
   the same crop. Put identity and rarity in deliberate safe areas.
4. Use the approved sequence: Hub journey → rare signal/impact → unnamed
   quote/voice → brief artwork camera reveal → S / S / R impacts → name/stars →
   player-controlled hold. Keep common results quicker and the ten-pull rail
   efficient. Skip/replay continue to use the already committed receipt.
5. Begin motion with a restrained whole-image pan/zoom and timed effects. Add
   parallax only when real layers can preserve edges. Tie sound, light and
   particles to the character. Reduced motion keeps the artwork and pacing.

## Concrete research evidence

The approved Mario scene runs in a real, separate Electron window with a
**1198 × 674 stage**, decoded artwork and no page errors. See
[the native proof](validation/reveal-redesign/native-wide-theater-proof.png)
and [its measured bounds](validation/reveal-redesign/native-sizing-results.json).
This proves the space is feasible in the application. It does not implement
production receipt routing, introduce Superstar Mario to the roster, or verify
native Mac behavior/performance.

**すびかか / Suyasuyabi427** is a useful sourcing lead: the existing Mario
[source notes](../demos/mario-pull/SOURCES.md) credit すびかか, and
[the artist's public attribution](https://twiman.net/user/893511590393159680/illust/2048725109364732015)
connects that name to Suyasuyabi427. Their Kirby paintings offer the same
complete-scene quality. The search reviewed 78 artist entries and retains
twelve candidate previews, including alternate uploads of two paintings.
The research gallery retains these composition candidates
with source links; they are not assigned to fighters. A beautiful ensemble
can still fail as a specific SSR splash if another character dominates it or
the depicted version differs.

The cropped box-art banner experiment is retained as a comparison only and
removed from the live code. The next quality checkpoint is one fully staged
SSR with suitable artwork, viewed at the actual wide size before broad rollout.
