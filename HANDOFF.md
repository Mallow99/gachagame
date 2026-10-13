# Pocket Gacha: handoff

**Start with `ROADMAP.md`**: it says what we're building and in what order.
This file is the history and technical detail behind it.

Repo: `Mallow99/gachagame`. Latest work is on branch
`claude/stoic-archimedes-h3m7qt` (built on `claude/admiring-maxwell-nmj2ha`). The owner is a programming beginner who wants the fun result.
Explain choices briefly and don't drown them in options.

---

## 1. What this is

A personal, free-to-play gacha RPG that runs as a small always-on-top desktop
widget (Electron) on the owner's **M2 MacBook Air (8 GB)**. You pull for
characters, level them, and auto-battle stages. There's no money involved; it's
purely for the dopamine. The roster is a deliberately absurd crossover (Walter
White, Omni-Man, Kirby, Ronald McDonald, Tung Tung Tung Sahur, ...) using
ripped or official art. It's **personal use only**; the owner accepts that public
distribution could draw takedowns.

The current focus is the playable game loop. The long-term structure is now a
branching Atlas of franchise Sagas; see `docs/WORLD_TOUR_PLAN.md`. Worlds can be
5–25 stages according to their material, and Sagas have no stage cap. Mushroom
Kingdom and Dream Land remain the first planned 25-stage flagships, but later
the player chooses eligible destinations with Atlas Keys. Fighter iterations,
equippable Power-Ups, party-wide Assist Pages, SSRs and one-per-team URs are
separate systems; the refined rule is one Mythic slot shared across an UR
fighter, UR Power-Up or future UR Assist. Atlas Rank sets a new World's Threat
Band when it is first entered instead of hard level-syncing the player's team.
Build the real Electron desk strip and one polished
five-stage Mario slice before producing the larger roster. The Mario pull demo
is already signed off and remains the future reveal reference.

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
mechanics test team now uses the approved Mario, Walter and Sahur cut-outs from
`demos/strip/`; the remaining test roster still uses placeholder pixel sprites.
**Batch 1 art in `assets/characters/` is not wired into the game yet.**

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
- **Variants by tier**: e.g. plain Mario (R) → power-up Marios (Fire, Ice,
  Tanuki, Propeller, Penguin; SR) → Superstar/invincible Mario (SSR).
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
