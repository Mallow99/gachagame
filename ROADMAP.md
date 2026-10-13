# Pocket Gacha: roadmap

Read this first. `HANDOFF.md` has the history and technical detail; this file
says what we are building and in what order.

**Goal:** maximum gacha dopamine from something that is **easy, simple, cheap
and fast** to build and play. Polish where it pays off (pulls, SSRs), "charming
jank" everywhere else. Personal use only.

**Where we are:** Roadmap 0 is done except for the open decisions marked
**OPEN**. The next step is Roadmap 1.

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

**Rarity:** R / SR / SSR as letters. Stars show duplicates.
- For variant families like Mario: base form is R, power-ups are SR, and
  overpowered forms (Super Star, Mega, maybe Cappy) are SSR.
- Only SSRs get the full ceremony: the long draw, the in-flight
  transformation, the quote card and voice line, and the theme music. R and
  SR go straight to the art with name and title.

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
- Type advantages and bosses keep weaker units useful.
- "While you were away" earnings when you come back.

---

## Roadmap 0: planning (now)

Decided: everything in the section above.

**OPEN, to discuss when we get there:**

1. **Types.** Three types in a rock-paper-scissors triangle, with neutral for
   oddballs. Gamer / Meme / Real Person was rejected: there aren't many memes,
   and someone like Omni-Man doesn't fit. Options:
   - *By how they fight:* **Power / Brains / Chaos.** Omni-Man is Power,
     Walter is Brains, Sahur is Chaos. Works for any origin. Claude's lean.
   - *By where they come from:* **Game / Screen / Internet** (TV and film are
     Screen; memes and brainrot are Internet). Easy to assign, but the roster
     is mostly Screen.
   - Something the owner names.
2. **Prestige** (reset the stage for a permanent multiplier). It fits idle
   games, but the owner finds it a bit lame. Decide in Roadmap 4; bosses and
   new areas may be enough on their own.
3. **The first vertical slice:** which 10–15 characters get full treatment
   first.
4. **Variants:** is "Mario" one unit with forms, or are Mario / Bubble Mario /
   Superstar Mario separate units? This decides how duplicates and stars work.
5. **Earn rates:** how often a pull is affordable (tune by feel in Roadmap 4).

---

## Roadmap 1: foundation (data and pipeline)

Make adding a character mostly data entry.

**In progress:** the owner-facing Pixiv picker is built. It produces a local,
bookmark-ranked gallery (60 works by default), supports filtering and ordered
favorites, remembers the selection, and exports `picks.json`. The generated
page was visually checked at desktop and phone widths with the six approved
Mario works. Live Pixiv search returned HTTP 403 from the Codex cloud on
2026-10-12, so its live API path still needs a run on the owner's normal
connection. Character JSON and processing integration are next, after the
relevant OPEN decisions below.

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

- An Electron window that is transparent, always on top, sits along the
  bottom of the screen and passes clicks through.
- **Procedural stages:**
  - waves of enemies, with a boss every 10th stage
  - a new area every 50 stages (background tint plus a new enemy set)
  - enemy stats that keep scaling
- **Combat from the data files:** stats, 1–2 basic attacks, a passive, and an
  ultimate meter that fires with a cut-in of the character's art. Type
  multipliers. Front and back row.
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
- **Done when:** currency earned in the strip buys pulls, and a newly pulled
  unit shows up in the strip.

## Roadmap 4: progression and team building

- Levels bought with coins, stars from duplicates, four team slots with front
  and back rows, types.
- A collection log (who you have, who's missing as silhouettes).
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

## Planned attack types

Every kit is built from these parts. Each one has a cheap way to look good in
the strip.

**Basic attacks (each unit has 1–2):**

| Type | What it does | How it looks |
|---|---|---|
| Melee | Hits the nearest enemy | Lean back, lunge, flash, knockback |
| Ranged shot | Fires at an enemy from the back row | Muzzle flash and tracer |
| Combo | Several small hits in a row | Quick lunges with numbers popping |
| Charge | Dashes through the enemy line, hitting everything it passes | Stretch, then a fast slide |
| Stomp | Jumps onto one target | Arc jump, the target flattens |
| Lob | An arcing projectile that splashes | A thrown object, then a burst |
| Beam | A line that hits everything in a row | A stretched glow |

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
