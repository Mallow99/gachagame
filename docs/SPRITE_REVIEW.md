# Source-game sprite pass — 2026-10-14

The opening roster now has distinct, game-specific sprite records. Every one
of the 28 fighters is checked against its declared source game. No rarities,
owned records, pity or banner pools changed in this pass.

Open the [animated comparison](validation/sprite-review/index.html) through
`npm run web`: `/docs/validation/sprite-review/index.html`. It uses the actual
SpriteBank, source pixels and game-relative body heights. The original sheets,
URLs, credits and hashes stay in
[the intake](../assets/sprites/sources/faithful/INTAKE.json).

## Selected treatments

| Version | Selected source | Treatment |
| --- | --- | --- |
| SMB Mario/Luigi, Toad/Peach, enemies | Original 1985 NES sheets; Superjustinbros | Native palettes and poses. NPCs retain their actual single rescue pose. |
| Current classic Bowser | Captain / FungiCaptain expansion of the actual boar-like SMB1 body, compared with native NES and five other custom candidates | Faithful expanded 2D treatment: walk, skid, jump, swimming, fire and defeat. Later-design NES-style sheets were rejected. |
| Classic Hammer Bro / Buzzy Beetle | PixelatedPete (PlugItIn&Pete) / Side Steppa expanded SMB1 sheets | Hammer Bro uses the original 24-pixel costume/body row, excluding compressed ROM-hack and later-game variants. Buzzy keeps the exact native brown/peach palette, with four walk and four roll frames. |
| Adventure Kirby and seven Copy profiles | Original 1993 NES sheet; Drshnaps/Jermungandr, QuadFactor, UltraHype97 | Native neutral/weapon/action cells. NES Fire/Spark/Cutter do not get invented modern hats. Ice uses the sheet's actual Ice palette. |
| Dream Land Kirby | Original 1992 Game Boy sheet; Sonikku/thejohnston7 | Separate body/atlas, native grayscale, separate motions. |
| Adventure Meta Knight/Dedede | Original 1993 NES sheets; someguy/Jermungandr and Drshnaps/Jermungandr | Actual sword/guard/spin in the native blue duel palette, and hammer/inhale/jump poses replace later-game wings and boss derivatives. |
| Adventure ordinary enemies and bosses | Original 1993 sheets; Drshnaps/Jermungandr | Sword and Blade Knight are separate bodies. Kracko's native eye/body layers are assembled. Whispy uses reconstructed native scene layers. |
| Knuckle Joe/Bio Spark | Original 1996 SNES Super Star helper sheets; Drshnaps/Jermungandr | Real jab/uppercut/knife/dash/hurt poses. Loose effect cells are kept out of body clips. |
| Return to Dream Land Bandana Dee | gameboy09 complete spear sheet, in Super Star Ultra pixel style | Faithful 2D adaptation: native sheet thrust, throw, Waddle Copter and landing. |

For Bandana Dee, both treatments were actually inspected. The original Wii
model/textures were downloaded and rendered. That archive contains no
animation tracks. The complete 2D sheet provides the stronger playable
treatment now, while the model remains in the comparison. The adaptation is
labeled as such; it is not claimed as a ripped 2011 sprite.

## Scale and animation corrections

Frames keep one source pixel scale per character. A raised hammer or long spear
cannot shrink the body. Frames align their feet to one shared pivot. Mario's
body height is 48 and Kirby's is 24; Meta Knight 28, Dedede 54 and Bandana Dee
26. Held weapons can extend beyond that body height.

Movement loops; finite attacks/hurt/defeat clips hold their end frame. Skill
and ultimate clips follow the active ability, including ranged ultimates and
Bandana's landing. Meta Knight's spin and Bandana's copter can loop during
their continuous actions. Projectile flight stays on the combat clock, with
visual origins adjusted to the actual source and target body heights.

Illustrations now cover 24 fighter reveals, including all current SSRs. Toad
joins the original source-era art; Koopa uses Nintendo's 2020 redraw of the
walking-on-all-fours 1985 design, with that provenance stated explicitly.
Dedede/Meta Knight use Adventure illustrations; Bandana uses his original
Return to Dream Land render. Backgrounds and featured banner art are separate
from the reveal pieces. Reveals display their depicted version year. Reduced
motion keeps rare art readable instead of flashing it for 300 ms.

## Combat interaction pass

Open [the actual combat review](validation/sprite-review/combat.html) through
`npm run web`: `/docs/validation/sprite-review/combat.html`. Fourteen isolated
moves can be paused, replayed, scrubbed and played at quarter speed. It uses
the real Battle engine and BattleView without reading or writing saves.

- Stomp bodies reach the floor at the first hit marker. Dedede's primary hit
  and quake share the landing, followed by recovery instead of a late extra hit.
- Bowser leaps and crashes before his eight flame ticks. Native flame begins
  after landing, extends to actual forward-lane targets and does not hit behind
  his mouth. Spark instead affects close enemies around its owner.
- Repeated charges follow physical passes through targets and retarget after
  defeat. Meta Knight spins, then uses his native sword-finisher frames.
- Cape Counter guards first, shows exit/return tells and answers after arrival.
  It replaces the fallback strike; burn cannot trigger the teleport.
- Repeated native throw poses align with projectile releases. Ranged finishers
  travel too; Bandana's final spear damages only at contact. Hit flashes retain
  the active attack pose instead of hiding the release.
- Parasol Dee's original body and umbrella can move as separate native layers
  for pokes/spins. Those additional motions are authored, not claimed as ripped
  frames. The original whole-body idle and sparse body poses remain intact.
- Single charges reach their locked destination at the hit marker. Native
  Wheelie/Waddle/Buzzy charge poses loop during travel. Dedede's jump poses
  reach the final frame at landing, and Bandana's exit follows actual recovery.
- Hammers/bombs lock their landing circles on release and hit bodies in that
  zone. Parcels retain their recipient tracking. Combat end clears outstanding
  projectiles/shells, and Counter stays vanished until its return.

## Supply artwork and summon review

[The pull gallery](validation/summon-review/index.html) previews all sixty
opening collectibles through the actual reveal, without reading or writing a
save. Filter by Hub, kind and tier. Original illustrations now cover twenty-nine
Supply records; the remaining three simple R records use native icons. Every
SR/SSR Supply reveal has an illustration or source-model rendering. Their own
depicted games/years and credits appear on the reveal and inspection card.

Metal Cap uses the original Mario 64 cap geometry and emblem with an approximate
studio metal material. Optional Wing Cap parts are excluded. This is an authored
source-model illustration, not an official artwork rip; its source archives,
texture and render script are retained. The gallery compares it with the small
original reference. Adjacent-game Buzzy/Parasol illustrations remain comparison
candidates, with their different origins stated; they are not active fighter art.

Whole original downloads stay intact. Display copies cap at 896 pixels,
thumbnails at 256. The twenty-nine Supply displays total about 1.34 MiB and
thumbnails 0.38 MiB, instead of loading the 32 MiB originals into result grids.
The twenty-four fighter illustrations likewise preserve whole originals,
with 896-pixel displays totaling 0.71 MiB and 256-pixel profile thumbnails
totaling 0.33 MiB. Their combined display decode estimate is 18.77 MiB rather
than 40.26 MiB for the originals. Profiles now reuse these illustrations.
The theater preloads the current receipt's images during the flight and waits
for decode before starting artwork arrival/hold timing. Skip cancels that wait;
failed or stalled art has a bounded native-icon/printed-symbol fallback.
Assist pages use source portraits for their printed field entrances where no
native animated body is available; this does not claim full character rigging.

The Mushroom theater now uses the approved demo's coin/power-up sounds and its
original NES Starman theme for rare arrivals. Music/voice/effects have separate
volume controls. Skip/results/close cancel native clips and queued theater tones;
battle tones continue independently. Dream Land SSR artwork arrivals now use
the original 1993 Adventure short fanfare, with its complete recordings,
composer credits and processing retained in [audio sources](../assets/audio/reveal/SOURCES.md).
Reduced-motion mode gives the complete tune time to finish. Flight stings and
ordinary Dream rarity chimes remain procedural; the wider voice library is
unfinished.

Atlases now load before the first automatic fight; the bounded 75-image set is
about 0.14 MiB compressed / 9.75 MiB decoded. This also warms Copy/enemy forms
before their first use. [Rendering timings](validation/render-performance.json)
measure a real sixteen-actor scene in Chromium: drawing p95 0.4–0.8 ms, with
simultaneous hit-flash p95 up to 3.3 ms. These are cloud measurements, not M2
CPU/power evidence. Auto-next respects Pause and Hide instead of restarting
combat during a pause.

## Evidence and remaining quality work

- `npm test` includes source-version identity, distinct Kirby/Knight records,
  fixed pixel scale, relative heights and finite/ability-aware playback.
- [Chromium results](validation/sprite-review/browser/results.json): actual
  fresh deploy/clear/train/pull/results/inspect/Escape, 360 × 600 observer CSS,
  no horizontal overflow/page errors, and three SSR art fixtures. The desktop
  bridge here is a layout fixture; this is not native macOS verification.
- [Renderer captures](validation/sprite-review/game-captures/index.json) and
  pose boards use the current atlases. These are development evidence, not
  human approval of final production animation.
- [Motion browser results](validation/sprite-review/motion/results.json) cover
  sixteen completed moves, eleven frame sequences, transparent/reduced modes
  and a narrow review page with no errors or missing assets.
- Source-pixel validation preserves 447 frames in 66 extracted atlases; this
  includes explicit Lakitu rider/cloud source layers. Three layered boss records
  are reviewed separately. The full manifest has 75 atlases.
- [Summon browser review](validation/summon-review/results.json) checks native
  MP3 playback, ten-result scroll/inspection, unchanged replay value and both
  Supply kinds. [Rare gallery results](validation/summon-review/gallery-results.json)
  decode all thirty-two SR/SSR collectibles at 360 × 600, check name/art bounds
  and confirm gallery preview activity leaves local storage unchanged.
- [Image loading review](validation/summon-review/image-loading-results.json)
  deliberately delays/fails image requests in Chromium: decode before arrival,
  no late overwrite after Skip, fighter/Supply fallbacks and unchanged storage.

Lakitu now uses yiey20's expanded classic green-goggled rider and small cloud,
selected after comparing five sheets. Later orange/outlined costumes and big
clouds are excluded. The original download stays intact; the classic green and
orange map to the retained SMB1 rip's actual palette. Rider/cloud assembly is
authored, with one fixed cloud anchor and four distinct composites. His native
1985 Spiny eggs fly on the authoritative lob paths and have a small impact cue.
Single ranged actions now reach their release pose at the actual spawn marker,
as repeated throws already did. No collectible kit or damage balance changed.

Sparse NES pose sets still limit Parasol Dee. Lakitu's classic face remains
simple even with its authored cloud assembly; Hammer Bro, Buzzy and Bowser have
fuller faithful expansions.
Their source fidelity does not by itself prove final SR/SSR animation quality.
Some simple effects, recoil/KO motion, Whispy's assembled tree silhouette and
Assist entrances remain authored reconstructions. The high-tier presentation
gates still need human interaction/motion review. Buzzy Beetle and Parasol
Dee need better source-faithful pull illustrations. Native macOS behavior,
audio timing and a human fun/feel pass remain unverified.

## Rarity recommendation to discuss

Classic R bosses are a good option. R can describe a simpler playable version
of Bowser, Dedede or Meta Knight; it does not require their story boss encounter
to be weak. Encounter stats and collectible stats are independent.

Use a version's kit, versatility and animation budget to set rarity. Release
date alone should not decide it: a classic with a rich native kit can deserve
SR, and a later character can still be R. The useful pattern is "simple classic
version at R, fuller later version at SR/SSR," while keeping every version
recognizable and fun.

Add and verify the later SR/SSR replacements before moving existing classics.
Demoting the current Bowser immediately would remove Mushroom Kingdom's only
SSR. Demoting Dedede would also invalidate his current featured SSR page.
Preserve existing ownership/stars/mastery with an explicit migration if
existing records change. Keep the family lock across rarities and versions.
This is a recommendation, not an implemented roster change.
