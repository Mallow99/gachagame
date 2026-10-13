# Pocket Gacha: roadmap

Read this first. `HANDOFF.md` has the history and technical detail; this file
says what we are building and in what order.

**Goal:** maximum gacha dopamine from something that is **easy, simple, cheap
and fast** to build and play. Polish where it pays off (pulls, SSRs), "charming
jank" everywhere else. Personal use only.

**Where we are:** build the playable game first. Character production and the
art picker are paused until the strip loop works. The current step is Roadmap 2.
The approved long-term content structure is now recorded in
[`docs/WORLD_TOUR_PLAN.md`](docs/WORLD_TOUR_PLAN.md): a branching Atlas of
franchise Sagas. Major Worlds can be 25 stages, smaller destinations can be
5–20, and a Saga has no fixed stage cap. Mario and Kirby are first.

---

## Rules for any AI picking this up

- The owner is the author. Do the current step only. Don't build pieces that
  weren't asked for, and don't "improve" things on the side; ask first.
- Settle each **OPEN** decision with the owner when its roadmap step comes up,
  not before and not on your own.
- Check visually (Playwright screenshots) before saying something works, and
  say what you couldn't check (sound, real-time motion).
- Keep token use low: small sessions with one goal each. The AI may shortlist
  and choose art when the owner delegates it; use the picker when the owner
  wants the final visual choice. Keep this file and `HANDOFF.md` current.

---

## What the game is (decided)

**A desk strip plus a big window.**

- **The strip:** a transparent, always-on-top window along the bottom of the
  screen; clicks pass through except on game elements. Your team of four
  auto-battles through endless procedural stages there while you work, and
  earns coins and pull currency. It's an auto-battler, like *Desktop Raid*
  or *Desktop Heroes*.
- **The big window:** opens when you click the strip, or when a pull is ready.
  This is where you pull (banner, single, 10-pull, the reveal), manage your
  roster, level and star up, and build your team.
- **The loop:** the strip earns → you pull in the window → your team gets
  stronger and new units appear in the strip → repeat.

**Rarity:** R / SR / SSR / UR as letters. Stars show duplicates.
- For variant families like Mario: base form is normally R, specialized
  iterations and lieutenants are SR, signature forms and bosses are SSR, and
  peak versions are UR. An R may be replaced by a higher-rarity family member;
  SR remains valuable through specialization. UR is not limited to temporary
  transformations, although transformations are one important UR mechanic.
- Only SSRs get the full ceremony: the long draw, the in-flight
  transformation, the quote card and voice line, and the theme music. R and
  SR go straight to the art with name and title. UR extends the SSR ceremony.

**Forms and equipment:** complete eras or movesets are pullable fighter
iterations. Ordinary Fire/Ice/Tanooki/Cat-style changes are usually equippable
Power-Ups instead of separate Marios. Power-Ups and party-wide Assist Pages use
a cheaper Supply gacha with separately earned tickets, so they do not compete
with saving for fighters. A party has one Mythic slot shared by an UR fighter,
UR Power-Up or future UR Assist Page.

**Art per character.** One good image is reused for the reveal, the profile
and the ultimate cut-in. Three routes:
1. A single cohesive piece: Pixiv fan art (`tools/art/pixiv.py`), or official
   key art and posters for live-action characters.
2. A background plus a cut-out of the character in a pose, colour-matched,
   with a ground shadow.
3. SSR extra: an animated version (GIF or short loop) for the reveal and a
   face close-up, where one exists. Pixiv animated works (うごイラ) and short
   clips from the show are the sources to try.

**In the strip:**
- Real 2D sprites where they exist: game characters, from The Spriters
  Resource. The owner downloads these by hand into `incoming/`.
- Otherwise a code-animated cut-out puppet (see `demos/strip/`).
- Two poses where they're easy to get (Mario has run + jump).
- Mixed styles are fine; that's part of the charm.

**Dopamine plan:**
- Pulls are frequent and cheap.
- Rewards are random: chests, drops, rare bosses, the SSR fake-out.
- Duplicates raise stars, so pulls stay meaningful after you've collected
  everything.
- New character batches arrive as new banners. This is the biggest lever.
- Boss mechanics and team roles keep weaker units useful. Type matchups are
  deferred until the core loop works and playtesting shows they add choices.
- "While you were away" earnings when you come back.

---

## Roadmap 0: planning (now)

Decided: everything in the section above.

**OPEN, to discuss when we get there:**

1. **Prestige** (reset the stage for a permanent multiplier). It fits idle
   games, but the owner finds it a bit lame. Decide in Roadmap 4; bosses and
   new areas may be enough on their own.
2. **The first vertical slice roster:** Mushroom Grasslands with 8–12 playable
   candidates, four enemy families and Goomba King. Exact membership still
   waits for an animation-sheet audit.
3. **Earn rates:** how often a pull is affordable (tune by feel in Roadmap 4).

Decided: meaningful fighter iterations are separate pullable units. A team may
equip only one unit from the same family, so it cannot be filled with four
Marios. Ordinary power-up changes are equipment unless the form supports a
complete distinct fighter kit.

---

## Roadmap 1: foundation (data and pipeline)

Make adding a character mostly data entry.

**Paused after its first tool:** the Pixiv picker produces a local,
bookmark-ranked gallery (60 works by default), supports filtering and ordered
favorites, remembers the selection, and exports `picks.json`. The generated
page was visually checked at desktop and phone widths with the six approved
Mario works. Live Pixiv search returned HTTP 403 from the Codex cloud on
2026-10-12, so its live API path still needs a run on the owner's normal
connection. Do not continue character production until the playable strip is
working.

- **Character data template:** one JSON file per unit, with:
  - id, name, title, family, tier, type, stats
  - attacks, passive, ultimate
  - art route, art files, sprite or puppet
  - SSR only: quote, voice, music
- **Picker page:** for a given Japanese tag or artist, generate a local page
  of about 60 thumbnails ranked by bookmarks. It saves ordered favorites to
  `picks.json`. The owner can use it directly or delegate the choice to the AI.
- **Processing:** download the originals, cut out, resize, and write files
  into `assets/characters/<id>/`. Handle all three art routes and import
  sprites from `incoming/`.
- **Done when:** a new character takes one picker run plus one JSON file, and
  no code.

## Roadmap 2: the strip (the playable core)

**In progress:** Electron now starts as the real full-width bottom strip and
switches to management when its HUD is clicked. Combat was rebuilt from the
approved `demos/strip/` prototype: frontliners roam, Walter-style ranged units
hold back and Mario-style stomp units jump onto targets. Visible action gauges
already expose readiness; the redundant NEXT queue is scheduled for removal.
Stages have three waves and five rotating encounter rules. The strip is
transparent, click-through, hidden by `×`, menu bar or `Cmd+Shift+G`, and absent
from full-screen spaces. The management window has an exact Field Manual for
every current formula. Passives, ultimate meters/cut-ins, transformations,
Assist Pages and reward drops are still pending.

- An Electron window that is transparent, always on top, sits along the
  bottom of the screen and passes clicks through.
- **Authored Worlds with scalable Mastery:**
  - three-wave stages, with an Area boss every fifth story stage
  - Worlds may contain 5, 10, 15, 20 or 25 stages; 25 is for flagship campaigns
  - World 1 is 25 Mushroom Kingdom stages: Grasslands, Underground Mines,
    Haunted House, Koopa Airship and Bowser's Castle
  - themed bosses on stages 5/10/15/20, then Bowser on stage 25
  - Dream Land is the second planned flagship, but later the player spends
    Atlas Keys to choose among a small set of eligible Worlds
  - the account's Atlas Rank sets a new World's authored Threat Band when the
    player first enters it; it does not rubber-band to the exact party or move
    the goalposts during the campaign
  - Casual replay permits farming; Mastery remixes completed content upward
- **Combat from the data files:** stats, one basic action, a passive, and an
  ultimate meter that fires with a cut-in of the character's art. Front and
  back row. No type multipliers in the first build.
- **Rewards:** coin drops, pull currency from bosses, occasional chests.
- **Performance:** it must stay light on an 8 GB M2 Air. Lower the frame rate
  when nothing is happening, and keep images small.
- **Done when:** a team of four, built from data, fights forever with bosses,
  and earns currency.

## Roadmap 3: pulls inside the game

- **The big window:**
  - the banner screen
  - single pull and 10-pull
  - the reveal ported from `demos/mario-pull/`, driven by data
  - the SSR ceremony (animated art and a face close-up where available)
  - pity and duplicates → stars
- **10-pull:** one shared draw, coloured by the best result in the batch.
  Then a results grid, where SR and up step forward one at a time, any SSR
  gets its full ceremony, and there's a "skip to results" button.
- **Banner skins:** each featured banner swaps the shooting star for its own
  object (Super Star for Mario, a Warp Star for Kirby, a blue crystal for
  Breaking Bad).
- **Progressive pools:** Area Spotlights unlock during their Worlds, then their
  contents move into a permanent Saga Archive. UR/Mythic banners stay separate,
  cycle among unlocked candidates and keep persistent pity.
- **Supply gacha:** a cheaper, separately earned ticket banner for Power-Ups
  and Assist Pages. Area Supply Spotlights also move into a permanent Archive.
- **Done when:** currency earned in the strip buys pulls, and a newly pulled
  unit shows up in the strip.

## Roadmap 4: progression and team building

- Levels bought with coins, stars from duplicates, four team slots with front
  and back rows, and one equipped variant per character family.
- A collection log (who you have, who's missing as silhouettes).
- One party-wide **Assist Page** with a passive and a charged or conditional
  intervention, plus one compatible **Power-Up** slot per fighter. Supply
  collectibles use their own rewards/tickets and never dilute fighter banners.
- Atlas Keys earned from final bosses open one of a small set of eligible
  destinations. Choices never permanently lock the unchosen Worlds.
- "While you were away" earnings.
- Decide on prestige (OPEN #2). Tune earn rates (OPEN #5).

## Roadmap 5: roster production

- The first vertical slice (OPEN #3) at full quality, then the rest of the
  roster in batches.
- **Order of effort:** SSRs first (animated art, quote, voice, theme), then
  SRs and Rs (art, title, kit).
- Each batch ships as a new banner.

## Roadmap 6: dopamine polish

- Sounds for hits, drops, level-ups and pull-ready.
- Chests and "pull ready" pop-ups above the strip.
- Achievements and milestones, rare bosses, small events.

## Someday

- Better sprites once tools can make good ones on the first try.
- Reddit and Bluesky as art sources (needs the owner's API keys; see
  `HANDOFF.md` §6).
- Live2D-style animated splashes.

---

## Combat actions

Every kit is built from these parts. Each one has a cheap way to look good in
the strip.

The seven styles share one damage formula but now have small, visible mechanical
differences. Exact powers and action timers live in `src/combat.js` and are
shown inside the game's Rules tab.

| Outcome | What it does |
|---|---|---|
| Strike | Damage one target |
| Burst | Damage several targets |
| Support | Heal, shield, buff or control |

**Effects** (abilities, passives and ultimates combine these):
- **Crowd control:** area damage, knockback / launch, stun
- **Damage over time:** burn / poison
- **Support:** heal, shield, team buff (attack up / haste)
- **Debuffs:** enemy defence down / slow
- **Other:** summon, execute (bonus damage on low-HP enemies), lifesteal,
  taunt, revive once

**Passives** are always on: a chance on hit, a team aura, a bonus against a
type, extra coins, a first strike.

**Ultimates:**
- A meter fills from hits.
- When it's full: a quick full-width cut-in of the character's art (face
  close-up for SSRs), then a big effect.

**Example kits:**
- **Mario:** stomp, plus a melee punch. Passive: coin bonus. Ultimate:
  Super Star (invincible plus contact damage for a few seconds).
- **Walter White:** ranged shot. Passive: poisons targets ("chemistry").
  Ultimate: "Say my name." (stuns all enemies, then a big area-damage burst).
- **Tung Tung Tung Sahur:** combo (TUNG TUNG TUNG). Passive: the third hit
  stuns. Ultimate: "SAHUR!" (launches every enemy off the screen).
- **Omni-Man:** charge. Passive: takes less damage. Ultimate: flies through
  the whole wave.
