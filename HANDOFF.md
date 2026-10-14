# Pocket Gacha: handoff

## Current playable branch — 2026-10-14

The v1 implementation is on local `codex/v1-playable` from the latest planning
push (`ef450706`). Read [the build report](docs/V1_BUILD_REPORT.md) and
[README](README.md) before the historical notes below. SaveV4, roaming combat,
both complete first Worlds, 28 fighters, Source Spotlights/Supply, the Paper
Manual and reveal theater are implemented. Archives remain previews; source
art and some signatures/audio remain provisional. The current sprite pass
replaces mismatched versions, fixes body scaling/clip playback, adds source-game
pull art and passes actual Chromium flow/360 × 600 CSS checks. Read
[the sprite review](docs/SPRITE_REVIEW.md). A native M2 pass remains required. No PR
was opened. Run `npm test` and `npm run validate:v1 -- --seeds 50 --write`.

The follow-up interaction pass aligns stomp/crash damage with landing, gives
multi-pass charges physical routes, fixes Cape Counter's duplicate fallback
damage and delays ranged finishers until projectile contact. Native throws
repeat at releases without hit flashes hiding them. Hammer Bro/Buzzy gained
faithful classic expansions; Parasol uses articulated native layers. Pull art
covers 24 fighters. Actual Chromium motion review covers sixteen moves at
`/docs/validation/sprite-review/combat.html`, with stationary target limits
documented in its results. This is local review evidence, not human approval
of final feel or a native macOS pass.

The follow-up Supply/summon pass adds twenty-nine sourced illustrations and
small display copies, a sixty-collectible isolated gallery, native approved
Mario reveal audio with independent channels/cleanup, physical single-charge
contact, locked lob impact zones and cleanup of flying objects at combat end.
All thirty-two SR/SSR gallery reveals pass Chromium layout/image checks without
changing local storage. Source portraits now identify printed Assist entrances.
The fresh twenty-account progression run clears 35/35 in 2.6–3.2 hours with two
retreats. The source hash matches the 175 reference-fight report. Real Electron
testing uses `POCKET_GACHA_PROFILE_DIR` to isolate QA data from the normal save.
The actual Electron check now passes Training/pull/save IPC and persisted
relaunch on a Linux virtual display. Evidence is in
`docs/validation/desktop-review/results.json`; this is not an M2 hardware pass.
Sprite readiness now includes loading all 75 small atlases; the total decoded
RGBA estimate is 9.75 MiB. This removes first-use Copy/enemy image gaps. Auto-next
waits while Pause/Hide is active. The sixteen-actor Chromium profile is recorded
in `docs/validation/render-performance.json`, without claiming M2 CPU/power.
Dream Land SSR artwork arrivals now play the original 1993 Adventure short
fanfare; recordings, hashes, composer credits and processing are retained in
`assets/audio/reveal/SOURCES.md`. The actual browser summon review verifies both
Hub themes and stops them on skip. Wider voices and the procedural flight and
ordinary Dream rarity chimes remain polish work.

Lakitu now uses a reviewed classic-row expansion by yiey20, with authored
rider/cloud assembly and a palette mapping to the retained original NES rip.
Later costumes and large clouds are excluded. Native Spiny eggs replace generic
projectile dots. Single ranged throws, as well as repeated ones, reach their
release pose at the real spawn marker. The added motion examples include both
Storm Cloud and one Spiny Egg. No kit, rarity, ownership or balance changed.

Fighter art now uses whole-composition display/thumbnail copies (0.71/0.33 MiB)
instead of loading original scans/renders into the theater and profile header.
All twenty-four originals and credited hashes are preserved. Reveal images
preload during flight; arrival/hold timing waits for decode, and Skip aborts the
wait. Controlled Chromium delays/failures verify no late result overwrite and
readable native-icon/printed-symbol fallbacks without changing storage. Run
`tools/browser-reveal-loading.mjs` for that check. The full suite has 111 tests.
Real Electron also passes the source-art WebP preview through file URLs, along
with IPC/persistence. Its harness waits for the paid modal to close before the
next visual fixture and cleans up the app if a check fails.

The old prototype descriptions and PG-003 “next” tickets below are historical.
Longer-term plans remain authoritative; the latest user instruction authorized
the broader v1 implementation pass.

**Start with `ROADMAP.md`, then `docs/plan/README.md`**: the roadmap says what
is next and the plan directory is the definitive design/balance/content source.
This file is the history and technical detail behind them.

Repo: `Mallow99/gachagame`. Branch `codex/pg001-pg002` now contains the merged
definitive planning corpus, the stable PG-001/PG-002 coding foundation and the
owner decisions/audit in plans `17`–`18`. Do not return to
`claude/stoic-archimedes-h3m7qt`; it predates the merged implementation branch.
`npm test` currently covers 19 deterministic/content/save/pool checks. The owner
is a programming beginner who wants the fun result.
Explain choices briefly and don't drown them in options.

---

## 1. What this is

A personal, free-to-play desktop gacha auto-battler that runs as a small
always-on-top strip (Electron) on the owner's **M2 MacBook Air (8 GB)**. You
pull for characters and watch four of them physically roam and fight while you
work. There is no money involved. The first production Library is gaming-first
so real sprites can carry the combat; the earlier meme/live-action roster is a
future Oddities candidate and remains only in dev fixtures/assets for now. It is
**personal use only**; public distribution of third-party IP/assets may draw
takedowns and requires a separate rights review.

The current focus is the playable game loop. The definitive long-term structure
is in `docs/plan/`: a Saga is shown as a franchise Hub, its permanent Archive
can contain production-ready iterations from several games, and a World adapts
one specific game, making visual history from old to newer sprites explicit.
Worlds can be 5–25 stages according to their material, and Sagas have no stage
cap.
Super Mario Bros. is the first planned 15-stage World and Kirby's Adventure is
the recommended second 20-stage World; the player chooses eligible destinations
with Atlas Keys rather than following the production order.
Fighter iterations, equippable Power-Ups, party-wide Assist Pages, SSRs and URs
are separate systems. There is no Mythic loadout cap; multi-UR parties are
legal and must be simulated. One account-wide Training Rank replaces
individual fighter levels. Atlas Rank snapshots a set of newly revealed Worlds
instead of hard level-syncing the player's exact party. Build the real strip and
one polished five-stage Super Mario Bros. slice before producing the larger
roster. SMB1 first clears target 30 Fighter pulls, 35–45 by hour 5 with ordinary
play, then repeatable Camp/Patrol Reports keep pulls renewable. Stackable Field
Orders and optional resource/XP/Wanted-Hunt Sorties make the generous daily
bundle something the player earns instead of a login claim. The signed-off
Mario pull demo remains the reveal reference.

Plan addenda `13_HUBS_BANNERS_AND_PRESENTATION.md` through
`18_LOADOUT_COPY_AND_PROGRESSION_AUDIT.md` are authoritative for the regional Archive,
summon timing/card content, Mario and Kirby kits, Copy, Goomba flatten, shell
kicks, float, tongue and all signature-animation acceptance tests. Yoshi (SMW)
and Mario 64 are the first post-slice engine proofs, followed by the regional
pool floors and breadth shelves in plan `16`.
Plan `15_MEGA_MAN_CHARACTER_BIBLE.md` is a complete future roster packet for
Mega Man 2, all eight Robot Masters, Wily, Roll and Proto Man.

**Priority correction:** plan `16_MARIO_KIRBY_ARCHIVE_EXPANSION.md` now comes
before plan `15` in production. “Bigger roster” means deeper Mushroom Kingdom
and Dream Land pools, not reaching another franchise sooner. Plans `17`–`18`
reclassify the five Super Ability cards into one Return-to-Dream-Land Kirby UR,
move Hypernova to SSR and Star Rod to a UR Power-Up, and expand the candidate
museum. The opening normal-banner floor is 22 fighters for both Mushroom and
Dream Land before each Archive's first real pull. Mega Man remains designed but
is deferred.

Ultimate coefficients in the character bibles were rebalanced after the owner
correctly identified that the old 2–3× totals were barely normal attacks. The
current floor is measured in basic-action equivalents: 4+ R, 5.5+ SR, 7+ SSR
and 10+ UR or 18–26 over a transformation. Technique Mastery has five ranks;
universal Technique Notes accelerate it, while the first copy retains the full
kit and a strong ultimate.

---

## 2. Repo map

```
index.html, styles.css         Management page (plain HTML/CSS/JS, no build step)
strip.html, strip.css          Real transparent battle-strip page
src/
  data.js                      All tunables + roster (rates, pity, costs, classes)
  game.js                      Rules/state: gacha, levels, enemies, save (no DOM)
  combat.js                    Exact action timing, damage and encounter rules
  main.js                      Widget shell: top bar, tabs, toasts, collapse
  strip.js                     Roaming real-time strip combat adapted from the prototype
  ui.js, sprites.js, sfx.js    DOM helpers, placeholder pixel sprites, WebAudio sfx
  views/summon.js reveal.js    Banner screen + (old, basic) pull animation
  views/heroes.js adventure.js Collection/level-up, field status
  views/mechanics.js           Exact in-game Field Manual and live party stats
  views/particles.js           Canvas particle bursts
electron/main.js, preload.js   Always-on-top strip/manager modes + click-through IPC
tools/serve.mjs                Static server: `npm run web` -> http://localhost:8080
assets/characters/<id>/        Batch 1 art: splash.webp, battle.webp, icon.webp
assets/characters/CATALOG.md   Per-character grade, source, processing, animations
assets/characters/gallery.html Visual review page for batch 1
tools/art/                     Art pipeline scripts (see section 5)
docs/CHARACTER_SPEC.md         Target pull sequence, asset checklist, kit structure
docs/plan/                     Definitive implementation, balance, path, content,
                               assets, research and audit documents
demos/mario-pull/              The Mario showcase pull (section 4); open index.html
demos/strip/                   Desk strip prototype: cut-out puppets auto-battling
                               along the bottom of a mock desktop
ROADMAP.md                     What we're building and in what order
```

Run the game: `npm install && npm start` (Electron) or `npm run web` (browser).
Electron now starts in the real bottom battle strip; click its HUD to open the
360×600 management view. The same window switches modes so both use one save.
The strip is transparent except for fighters/effects/a faint ground line. Hide
or restore it with its `×`, the menu-bar star, or `Cmd+Shift+G`; it does not
follow the user into macOS full-screen spaces.
Run the Mario demo: serve `demos/mario-pull/` over HTTP, e.g.
`python3 -m http.server -d demos/mario-pull 8000`. It fetches files, so opening
it as `file://` won't work. It's also published as a Claude artifact the owner
views: https://claude.ai/artifact/7aSgKuTJpH6J7pxLpPMRUe (version 4, signed off by the owner: six Pixiv illustrations as separate pulls across R/SR/SSR, `PULLS` array in index.html; only the SSR gets the quote, voice and Starman theme). The strip prototype is at https://claude.ai/artifact/FaXzvANwXa628a8m1A9e1K.

The main game still uses its own simple reveal (`src/views/reveal.js`). The
mechanics test team currently uses Mario, Walter and Sahur cut-outs from
`demos/strip/`; these are dev fixtures, not the planned player-facing roster.
The remaining test roster uses placeholder pixel sprites. **Batch 1 art in
`assets/characters/` is not wired into the game yet.** Do not delete fixtures
until the real one-starter/pulled-party path and enemies can boot every view and
run combat.

---

## 3. What the owner wants (requirements, in their words where possible)

- One **high-quality full art piece per character**, reused for the banner,
  the pull reveal and the profile ("that one image is quality, so it feels good
  repeatedly", like JJK Phantom Parade).
- Bring that art to life with motion: crop pieces and animate them, parallax,
  subtle idle movement. "Bonus points if it's slightly animated."
- Pull sequence: suspenseful draw, then a **black screen** with the character's
  **quote typed in and a voice line**, plus a rendition of their **iconic music**,
  then a transition into the high-quality image, then **S / S / R slamming in**
  as separate letters, then stars, name and details.
- **Variants by tier, refined later**: complete game-era movesets can be
  separate fighter iterations. Recurring pickups such as Fire/Ice Flowers are
  effect-only Power-Ups; Tanooki and Cat versions pass the current full-fighter
  test. Base versions are normally R, specialists SR,
  signatures/bosses SSR and truly exceptional anchors UR.
- Later: kits per character (basic, skill, ultimate, passive) with
  animations and effects.
- Widescreen is fine; mobile aspect isn't required.
- Quality bar: "just polished enough to give the same dopamine as a gacha game."

### Feedback on the current Mario demo (take 2): this is the to-do list

1. **The banner must differ from the reveal.** The banner should hype the pull:
   e.g. several characters across the Mushroom Kingdom, or Mario shown
   differently, so the final reveal *pops* as something new. Right now both use
   the same scene.
2. **Mario looks pasted on.** He's a separate 3D render over a 2D background,
   and it reads as an overlay. Find a **single cohesive art piece** (character
   painted *into* the scene), or at least match lighting and scale and add a
   ground shadow and color grade.
3. **Search harder for art.** "Look more for better images instead of just
   picking the first that you see." Compare several candidates side by side
   before choosing.
4. **Depth parallax is good but buggy.** The displacement shows visible seams
   and stretching ("clear scenes"). Reduce strength, fix the depth edges
   (dilate or blur the foreground mask), or move to real layered cut-outs.
5. **The draw is too fast.** Make the pre-reveal animation longer with more
   suspense, and **color it by tier** (e.g. blue for R, purple for SR, gold for SSR,
   with SSRs sometimes "upgrading" mid-animation as a fake-out).
6. **Remove "— MARIO" under the quote** on the black screen. Leaving the
   speaker unnamed adds suspense.
7. Sound hasn't been reviewed yet (owner couldn't listen). Revisit later.

Take 1 (a ? Block, a warp pipe, a cut-out Mario) was rejected as "jank". Don't go
back to composing scenes out of separate small cut-outs.

---

## 4. How the Mario demo works (`demos/mario-pull/index.html`)

A single self-contained page, 16:9, with three layers stacked in `.screen`:

1. **`#gl` WebGL canvas.** Two shader programs:
   - *Background*: draws `bg.webp` cover-fit and offsets UVs by `bg-depth.png`
     (white = near) for parallax. Inputs: `uPan` (slow drift), `uCam` (camera
     drift plus mouse), `uZoom`/`uFocus` (pull-out zoom). The **seams in feedback
     #4 come from this shader**: the iterative depth lookup has no occlusion
     handling.
   - *Character*: `mario.webp` drawn on a 24×24 grid mesh. The vertex shader
     sways and breathes the upper body (a cheap Live2D-style effect). `charState`
     controls alpha, sway and bounce.
2. **`#fx` 2D canvas** for particles (bursts, stars, dust, rings, speed lines),
   the night sky, and the meteor (`drawMeteor`) during the wish.
3. **DOM UI**: banner text, quote card, result plate (rarity letters, stars,
   name, chips, buttons).

The sequence is the `pull()` async function: banner fades, `mode='wish'` (night
sky), meteor (`meteor.dur` = 1.5 s, **lengthen this for feedback #5**),
impact burst and flash, then the quote card (`#quote`, `#speaker`; **remove the
speaker for #6**), flash into the reveal with a camera pull-out
(`tween(1500, …cam.zoom…)`), then SSR stamp, stars and plate. `skipping` makes
every wait resolve instantly (tap to skip).

Audio: `letsago.mp3`, `coin.mp3`, `powerup.mp3` are real clips (from myinstants.com).
The overworld theme is **synthesized** (note arrays `MEL/HAR/BAS/TAIL`, square
and triangle oscillators), because none of the downloaded clips matched the
theme's opening notes when analyzed.

Assets were made with: Super Mario Wiki API (art), `tools/art/depth.py`
(depth map), Pillow (trim/resize), ffmpeg (audio re-encode; one clip had
embedded cover art that broke decoding).

Testing note: in a headless container, WebGL runs on SwiftShader at about 0.5 fps,
so check stills with Playwright
(`--use-gl=angle --use-angle=swiftshader --enable-unsafe-swiftshader`), but
motion can only be judged on real hardware.

---

## 5. Art pipeline (`tools/art/`)

`pip install -r tools/art/requirements.txt` (rembg downloads its models,
about 180 MB, on first run).

| Script | What it does |
|---|---|
| `wiki.py` | MediaWiki/Fandom API helper. `search`, `files` (search File: namespace with sizes), `page` (images on a page), `get HOST OUTDIR "File:X"...`, `dl`, `sheet OUT imgs...` (labeled contact sheet for reviewing candidates) |
| `candidates.py` | For each id in `specs.json` (wiki host + page), ranks that page's images and downloads the top 15 into `cand/<id>/` with a contact sheet |
| `scrape.py` | Pulls og:image / large `<img>` files from arbitrary web pages |
| `process.py` | Reads `picks.json` (chosen file, crop, cutout yes/no, keep background, combine) → `splash.webp` (≤900 px tall), `battle.webp` (220 px), `icon.webp` (160²). Background removal uses rembg (`isnet-anime` for drawn art, `isnet-general-use` for photos) |
| `pixiv.py` | Pixiv tag search / artist portfolio → ranked by bookmarks → download (`search`, `artist`, `dl`) |
| `depth.py` | Depth Anything V2 Small (ONNX) → depth map PNG for parallax |

`picks.json` paths point into `cand/` and `cand2/` download folders that were
**not committed** (raw downloads are large). Re-run `candidates.py` to
regenerate them, or edit picks to point at new files.

Workflow: generate candidates, **look at the contact sheets**, record picks,
process, review in `assets/characters/gallery.html`.

---

## 6. Sources: what works and what doesn't

| Source | Status |
|---|---|
| Fandom / MediaWiki APIs (`*.fandom.com/api.php`, mariowiki.com, bulbapedia, minecraft.wiki, wikirby.com) | ✅ Main source. Use the API; the HTML pages sit behind a Cloudflare challenge. Super Mario Wiki has huge official renders (3000–4000 px). |
| `static.wikia.nocookie.net` image URLs from the API | ✅ |
| **Pixiv** (`tools/art/pixiv.py`) | ✅ **Best source for Mario art.** Japanese tag search and artwork details work without login (popularity sort is paywalled; use `マリオ1000users入り`-style tags or rank by `bookmarkCount`). Mining the portfolios of recurring artists (yamari, maribou, platiniridium, ゴンザレス) beats tag search. Images need a pixiv.net Referer. `picker` now generates the Roadmap 1 owner-facing, bookmark-ranked selection page and exports `picks.json`. Pixiv returned HTTP 403 from the Codex cloud on 2026-10-12; retry searches from the owner's normal connection, or use `--input` to rebuild saved results. Reviewed finalists: https://claude.ai/artifact/7sH6PVS2LaeniLRkzwykud |
| yande.re / Konachan / Gelbooru | ⚠️ Reachable, but mostly Pixiv reposts skewed to crossovers/NSFW. Danbooru 403. |
| Chinese sites (Duitang, Lofter, Bilibili) | ❌ Duitang API works but returns phone wallpapers and AI art; Lofter needs JS; Bilibili blocks. |
| DeviantArt search RSS `https://backend.deviantart.com/rss.xml?type=deviation&q=...` | ✅ Returns direct image URLs. Good for high-quality fan art. |
| Pokémon Showdown animated sprites `play.pokemonshowdown.com/sprites/ani/<name>.gif` | ✅ |
| myinstants.com (voice lines, meme sounds) | ✅ Search page HTML contains `play('/media/sounds/x.mp3')` |
| KHInsider (game music) | ⚠️ Search works; album pages returned 403 |
| Wikipedia API | ⚠️ Rate-limits (429) quickly; space out requests |
| The Spriters Resource / The Sounds Resource | ❌ Cloudflare human check. The owner downloads in a browser and drops files into an `incoming/` folder for processing. Don't try to bypass the check. |
| Reddit | ❌ Public JSON 403. Plan: official API with a "script" app. The owner will add `REDDIT_CLIENT_ID`, `REDDIT_CLIENT_SECRET`, `REDDIT_USERNAME`, `REDDIT_PASSWORD` as environment secrets (never pasted into chat). |
| Bluesky | ⚠️ Public post/profile reads work without login; search needs auth. Plan: `BSKY_HANDLE` + `BSKY_APP_PASSWORD` (app password). |
| X / Twitter | ❌ Paid API, and logged-in scraping risks the owner's account. The owner pastes image links instead. |

The owner believes social media (Reddit, Bluesky, X) has the best art for
banners and splashes. Prioritize the Reddit and Bluesky API routes once those
credentials exist.

---

## 7. Roster status (batch 1)

53 of ~60 characters have processed art in `assets/characters/`, graded in
`CATALOG.md`: 19 A, 29 B, 5 C (Kool-Aid Man, Scrubby, Professor X, Chick-fil-A
cow, Inventory Curse need better sources). Real animations exist only for
Marshadow (Showdown GIFs), Kirby and Steve.

Missing, with open questions for the owner:
- **Tung Tung Tung Saheaven**: a heavenly variant of Sahur. No source found yet; ask for a link.
- **Obama (Electoral Carnage)**: a fighting game with presidents. Not found online; ask for a link.
- **The Very Hungry Caterpillar, The Little Engine That Could**: easy; Wikipedia was rate-limited.
- **Sally (sells seashells)**: no canonical character; the owner needs to pick an image.
- **Stickman Rope Hero (2018)**: many look-alike games; ask for the store link.

Removed by the owner: Gilbert, Bonnie Blue, "the little red line".
The owner is also considering a **Nintendo / game-characters batch** because sprite and art
availability is excellent there.

Note: batch 1 was gathered *before* the quality bar was set. Most of it is a
single cut-out per character, which is the "pasted on" look the owner rejected
for Mario. Expect to re-source the important characters to the new standard
(one cohesive full art piece each).

---

## 8. Recommended next steps (superseded by `ROADMAP.md`; kept for history)

1. **Mario demo take 3**, addressing every item in section 3's feedback list:
   - Banner: a different, busier composition (e.g. the *Super Mario Bros.
     Wonder* key art with the whole cast, or a group shot), with the reveal
     using a distinct hero piece of Mario alone.
   - Reveal art: one cohesive piece with Mario integrated into the scene. Search
     the Mario Wiki file namespace, DeviantArt RSS, and (once credentials exist)
     Reddit and Bluesky. Build a contact sheet of 10+ candidates and choose
     deliberately.
   - Longer, tier-colored draw with a fake-out upgrade; remove "— MARIO".
   - Fix the parallax seams.
2. Get owner sign-off on take 3, then turn it into a **data-driven template**:
   per character `{ banner, splash, depth, quote, voice, theme, tierColor,
   title, chips }`, and wire it into the game's `src/views/reveal.js` (Electron
   window is 360×600; the reveal may need its own larger window or a
   fullscreen overlay).
3. Re-source top characters to the new standard; build Mario tier variants.
4. Kits and battle animations (see `docs/CHARACTER_SPEC.md`).

## 9. Conventions

- Commit to the branch you were given; don't open a PR unless asked.
- Plain JS, no framework, no build step. Keep `src/game.js` free of DOM.
- Verify visually (Playwright screenshots) before claiming something works,
  and tell the owner what you couldn't verify (e.g. audio, real-time smoothness).
