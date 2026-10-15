# Start the next chat here

Checkpoint: **2026-10-14, America/Chicago**. The owner explicitly requested this
handoff before starting a new chat. Pause presentation implementation here.

## Open the correct code

- Repository: **Mallow99/gachagame**. Continue **`codex/v1-playable`** on GitHub.
  The previous complete checkpoint is `c44dc431c92943008ad4f7ed45da118cc0a5607e`;
  the handoff commit containing this file is newer. Fetch the remote branch and
  read its actual HEAD. Do not return to `work`, the older Claude branch, or the
  planning-only `codex/pg001-pg002` (`ef450706`). No PR has been opened.
- Read this file, [the current plan checklist](plan/26_V1_STATUS_AND_CURRENT_QUEUE.md),
  [the animated-splash research](ANIMATED_SPLASH_OPTIONS.md), and
  [the build evidence](V1_BUILD_REPORT.md) first. Then read the relevant design
  packets. The older PG-003-is-next text is historical, not an instruction to
  rebuild completed systems.
- `src/runtime.js`, `src/combat/`, `src/content/`, `src/save/` and
  `src/presentation/` are the live implementation. Old `src/views/` and some
  original prototype modules remain compatibility fixtures.

## The goal and current scope

Finish a fun, palatable v1 of a private Electron desktop gacha auto-battler for
an **M2 MacBook Air, 8 GB**: Mushroom Kingdom / Super Mario Bros., Dream Land /
Kirby's Adventure, the fighters needed for at least their first halves,
source-faithful combat sprites, banners and satisfying pulls. Both complete
first Worlds and the functional progression/gacha loop are implemented. Human
fun/visual approval and a native M2 pass are still outstanding; v1 is not
declared finished.

The owner agreed to finish playable v1 before full Cubism production. Their
latest clarification is that the desired result is an **animated splash** or
living illustration. Investigate simpler/free/open-source ways to get it;
Cubism is one possible later tool, not a requirement for every current card.
Do not spend another long pass making a full rig before a short visible proof.

## Last review: Dedede iteration 03 was rejected

Live private review:
<https://pocket-gacha-reveal-review.berryowlet9.chatgpt.site/?v=dedede-03>.
Source: `demos/dedede-reveal/`. This is **separate from the production theater**,
and is technically working but **not visually approved**. Do not roll it out.

The owner's exact issues, in priority order:

1. The image is bad; the isolated hammer swing looks wrong beside the rest.
2. The flight-to-quote cut has no satisfying animation, buildup or noise.
3. There is no actual voice clip for the quote; the silence followed by music
   feels awkward. The written line currently has no acquired matching voice.
4. Only the hammer moves, making the rest of Dedede feel strange/static.
5. The summon looks flat, lacks colour and does not distinguish R/SR/SSR.
   The owner suggested starting blue (or yellow), upgrading in tiers, and
   **transforming into a Warp Star for SSR**, then a **rainbow Warp Star for UR**.
   Do not start every rarity as an already-formed Warp Star. Include a way to
   compare the tiers in the next proof; this does not authorize new UR units.

Keep the parts they liked:

- the **Warp Star idea**;
- small **KING** beside/above larger **DEDEDE**;
- the visible **source-game name/year**;
- the **Fountain of Dreams setting**: its connection to Dedede makes sense.

They observed that this classic Dedede might not deserve SSR, but explicitly
set that aside. **No rarity, unit ID, ownership or banner changes are approved.**
Earlier classic-R/newer-SR/SSR variants were only an idea to weigh.

No revised visual implementation was made after this feedback. The next turn
only began art/audio searches and animated-splash tool research, then the owner
asked to stop for this handoff. No voice was downloaded/chosen, no new tool was
installed, and no alternative splash workflow was proved.

## The intended art quality

The original rejected Mario was a generic character poorly rigged on a poor
background. The owner did **not** reject a well-executed central character with
coherent surroundings, effects and restrained animation. They also rejected
the narrow 360 × 600 gacha treatment and source catalogue cutouts as final SSR
art. Preserve the approved Mario demo's **wide stage, space, suspense, quote,
rarity/name timing and player-controlled linger**, not necessarily its art
technique. `demos/mario-pull/` and plans 13–14 retain that reference.

Ensemble paintings may be memories / party bonuses. A fighter splash needs a
strong central fighter. Prepared 2D art, models, or a limited animated
illustration are acceptable if they look good. Different iterations need
distinct matching assets. Combat body sizes must remain canonical (Mario about
twice Kirby), with stable feet and weapon-frame bounds. SR/SSR/UR need better
assets and interactions than a tolerated low-rarity placeholder.

Phantom Parade references the owner selected:

- **Aoi Todo — Are You Really Okay With That?**: favourite for active effects.
- **Mahito — Unbridled Soul**: breathing/hand movement, atmosphere/debris.
- **Yuta Okkotsu — Lend Me Your Power**: sword/Rika/effects.
- **Yuji Itadori — An Entrusted Life**: dramatic clash/impact.
- Simpler liked: **Gojo — The Strongest Blue**, **Megumi — Incomplete Domain**.
- Acceptable baseline: **Gojo — Domain Expansion of 0.2 Seconds**.

All seven actual animated card loops are retained in
`docs/validation/animated-reveal-research/`, with provenance in `cards.json`.
They play at the private Site's `/motion-references/index.html`. The official
Haru Cubism test is `/cubism/index.html`; old Mario/static comparisons are
`/references/index.html`. No custom Nintendo Cubism rig exists. The supported
Cubism Editor was unavailable on Linux; the Web runtime was genuinely verified.
Do not confuse a sample-runtime success with authored character quality.

## What the game already does

- 35 courses: 15 SMB + 20 Adventure, bosses/phases, Camps, Patrol Marks,
  earned Orders, Training, Atlas Key/Threat, Kirby unlock, mixed-Hub Endless.
- 28 fighters: 10 Mushroom / 18 Dream; 16 Power-Ups + 16 Assists, family and
  Hub checks, seven Copy profiles, separate finale Star Rod loan.
- Live Source Spotlights and Supply pages, independent pity/welcome/featured
  rules, Echoes/stars/mastery; **22-fighter regional Archives remain previews**.
- SaveV4 migration/backups, committed paid receipts before animation,
  write-failure/export/retry recovery, desktop save acknowledgement and relaunch.
- 30 Hz roaming battle, physical projectile/landing contacts, finite special
  states, typed kits and a Paper Manual using live formulas.
- 75 sourced sprite atlases with size/feet fixes; 24 source-era fighter
  illustrations, 29 Supply illustrations, decode-before-arrival and fallbacks.
  These counts are implementation evidence, not blanket art approval.

Latest **111 game tests pass**; Dedede's browser/hosted lifecycle checks also
pass. The owner still rejected its art and pacing. Existing 175-reference-fight,
20-fresh-account and Linux Electron evidence is in `docs/validation/`; the build
report states the limits. No native M2 human playtest has been claimed.

## Resume sensibly

1. Read the recorded feedback and bounded tool comparison. Pick a practical
   animated-splash approach; improve the central artwork before adding more
   isolated rotation. Prepared layers and clean hidden surfaces still matter.
2. Improve one proof: coordinated character life, tiered colourful summon,
   SSR/UR star transformation, buildup/impact, a real sourced voice with matching
   subtitle and intentional music entry. R/SR should retain their shorter pace.
3. Publish a small visible iteration for owner feedback. Then integrate the
   approved treatment with the existing committed-receipt/Skip/replay contracts.
4. Return to fun/feedback/progression polish and the M2 acceptance pass. Keep
   full Cubism production as a later comparison, not the v1 critical path.

The user dislikes long invisible work, repeated permission questions, and
ending on general research with no tangible progress. Communicate frequently,
make bounded working proofs, keep actual status honest, and checkpoint to GitHub.
Do not leave them a chat-file HTML attachment: that viewer failed. Use the
existing owner-private hosted preview for visual iterations.

## Run, verify and rebuild the review

```sh
npm install
npm start       # Electron strip + observer Manual
npm run web     # http://localhost:8080
npm test
```

Additional checks: `tools/browser-dedede-reveal.mjs` (the old rejected proof),
`tools/browser-smoke.mjs`, `tools/browser-summon.mjs`,
`tools/browser-motion.mjs`, `tools/browser-reveal-loading.mjs`,
`tools/desktop-smoke.mjs`. Browser tools accept `POCKET_PLAYWRIGHT_MODULE` and
`PLAYWRIGHT_BROWSERS_PATH`. Use `POCKET_GACHA_PROFILE_DIR` for isolated Electron
QA. Re-run balance after combat/content changes, not for documentation alone.

The GitHub checkout contains all runtime assets and review sources; no cache
file is required for the current game or deployed Dedede scene. Rebuild the
complete static review with `node tools/export-review-site.mjs <output-directory>`.
Hosting identity and safe workflow notes are in `docs/PRIVATE_REVIEW_HOSTING.md`.
No account saves, auth tokens or credentials belong in Git.

Environment note for a continuing cloud session: outbound Node fetches needed
`--use-env-proxy --use-system-ca`; curl/git/Python urllib already used the proxy.
The previous browser module was
`/opt/codex/runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright`
and Chromium was cached under `/workspace/.cache/pocket-browser`. Detect those
before downloading replacements. Xvfb used for Linux Electron was a cache-only
tool, not a runtime dependency of the Mac game. Occasional exec-server transport
disconnects were workspace failures, not game errors; a retry/restarted
environment restored the tracked files. Do not diagnose them as broken saves.
