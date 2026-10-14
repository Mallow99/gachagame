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

Original source-game art now covers 22 fighter reveals, including all current
SSRs. Dedede/Meta Knight use Adventure illustrations; Bandana uses his original
Return to Dream Land render. Backgrounds and featured banner art are separate
from the reveal pieces. Reveals display their own version year. Reduced motion
keeps rare art readable instead of flashing it for 300 ms.

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

Sparse NES pose sets still limit Hammer Bro, Lakitu, Buzzy Beetle and Parasol Dee; Bowser now has a fuller faithful expansion.
Their source fidelity does not by itself prove final SR/SSR animation quality.
Some simple effects, recoil/KO motion, Whispy's assembled tree silhouette and
Assist entrances remain authored reconstructions. The high-tier presentation
gates still need a stricter interaction/motion review. Buzzy Beetle and Parasol
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
