# v1 implementation status and current queue

Updated **2026-10-14, America/Chicago** for the owner's fresh-chat handoff.
This is the current execution/status addendum to plans 01–25. It supersedes
their stale “PG-003 next” / “four provisional units” / “Kirby not started”
statements, while preserving their longer-term design and balance contracts.
The owner authorized a broader playable-v1 pass after those tickets were written.

Continue GitHub branch **`codex/v1-playable`**, not the planning-only branch.
Read [NEXT_CHAT](../NEXT_CHAT.md) for the latest owner decisions and exact
Dedede feedback. Technical implementation and human acceptance are separate.

## Completed functional v1 work

- [x] Modular content/config, stable IDs, validation and deterministic tests.
- [x] SaveV4 migration, timestamped raw backups, repair/import/export and retained
  ownership/currency/pity; paid receipt saved before presentation.
- [x] Reward/save failure recovery and retry, desktop quit/save acknowledgement,
  isolated Electron persistence/relaunch check.
- [x] Independent 30 Hz roaming actors; seven attack patterns, movement,
  projectiles, physical landing/contact timing, finite conditions and stagger.
- [x] First SMB Area, including Mario/Goomba, shell, pipe/Plant, Hammer Bro and
  paired boss behavior. Reference opener takes 90–150 seconds.
- [x] All **15 SMB** courses, Bowser and repeatable Camps/rewards.
- [x] All **20 Adventure** courses, Whispy/Kracko/Dedede/Nightmare boss states,
  Kirby unlock and separate finale Star Rod loan.
- [x] Seven encounter Copy profiles; no-Copy Game Boy Kirby, boss/elite/fodder
  distinctions and out-of-library fallback.
- [x] Training, stars/Echoes, mastery/Notes, four fighters, one-family lock,
  saved loadouts, one Power-Up per fighter and one party-wide Assist.
- [x] Live Source Spotlights and separate Supply pages, welcome guarantees,
  shared channel pity, featured guarantee, rates/history and atomic results.
- [x] **28 current fighter records (10 Mushroom / 18 Dream)**, **16 Power-Ups**
  and **16 Assists**. This is not either final 22-fighter Archive.
- [x] Paper Manual Atlas/Party/Summon/Manual, actual formulas, reports, earned
  Orders, kit/gear/formation inspection and recovery hints.
- [x] Atlas Key/Threat progression into Dream Land; mixed-Hub Endless through
  completed courses with increasing Threat and a saved best streak.
- [x] Offline Camp earnings capped at 12 hours, renewable Patrol Marks and
  stackable earned Order folders.
- [x] Transparent strip/observer Manual/hide/tray/shortcut and safe quit
  implemented; Linux Electron transport verified.
- [x] Source-game sprite replacements, distinct iteration atlases, fixed body
  sizes/feet, pose/release timing, readiness and source provenance retained.
- [x] Functional summon preload/decode, fallback, Skip/replay/reduced motion,
  independent audio controls, receipt restoration and results inspection.
- [x] 111 automated tests passed at the latest game checkpoint; browser flows,
  controlled image failures, 175 reference fights, 20-account progression and
  Linux Electron evidence retained in `docs/validation/`.
- [x] Rejected wide Dedede study and its source/evidence saved; real JJK card
  references and official-sample Cubism runtime remain available privately.

## Still required before calling v1 finished

- [ ] **Owner-approved pull presentation.** Both the narrow game theater and
  Dedede iteration 03 failed visual acceptance; browser checks do not close it.
- [ ] **Better animated splash art:** improve the central character and
  coordinated motion. Investigate limited/layered/open-source approaches; do
  not repeat the old isolated hammer rotation or assume Cubism is mandatory.
- [ ] **Rarity buildup:** meaningful blue/violet/gold/prismatic progression,
  satisfying visible/audible transitions, Warp Star formation for SSR and a
  rainbow Warp Star for UR. Provide a comparison proof without changing pools.
- [ ] **Real voice quotes:** acquire/audition a fitting actual clip, match the
  words and timing, and make its transition into the theme deliberate. Dedede
  currently has an unvoiced invented quote and no chosen replacement clip.
- [ ] Integrate the accepted wide presentation with the existing saved-receipt,
  ten-pull, Skip/replay, reduced-motion and result-grid contracts.
- [ ] Human play/feel pass: readability, rewards, pacing, combat feedback and
  enjoyment. Bots clearing the game do not prove it is fun.
- [ ] Remaining sparse SR pose sets, authored effects, missing illustrations,
  some Assist bodies and wider sound/music polish.
- [ ] Native **M2 MacBook Air / 8 GB** acceptance: tray/Spaces/click-through,
  positioning, sound, actual performance/power and playable progression.

## Longer-term gates that remain open

- [ ] **22 production-ready Mushroom fighters** and collection-growth gates
  from plan 20; the current ten-record Source Spotlight does not meet them.
- [ ] **22 production-ready Dream fighters at the specified rarity mix** and
  growth gates from plan 21; the current 18 records do not meet them.
- [ ] Enable regional Archives only after their full pool/asset/kit gates pass.
  They correctly remain non-spendable previews now.
- [ ] Complete later source-game iterations such as Yoshi/Mario 64 and the
  remaining full regional production packets; do not replace them with aliases.
- [ ] Full optional Practice/Study/Wanted-Hunt Sorties and dedicated Endless
  remixes. Earned Orders and Assist proficiency alone do not finish these.
- [ ] Full Cubism character production/comparison after a palatable playable v1.
  Official Haru playback is a technical experiment, not an authored game rig.
- [ ] Further franchises, full Atlas choice portfolio, owned UR transformations
  and the larger museum remain deferred/candidate work.

## Map to the original implementation plan

| Original phase/ticket | Current status |
| --- | --- |
| Phases 0–1 / PG-001–003 | Functional foundation, data and SaveV4 implemented and tested. |
| Phase 2 / PG-004 | Roaming engine and shell implemented. Human visual/fun and native M2 acceptance remain. |
| Phase 3 / PG-005 | Training/rewards/failure/offline implemented; full optional Sorties remain. |
| Phase 4 / PG-006, PG-008–009 | First five courses and their actor/boss primitives run; asset/feel approval is not automatic. |
| Phase 5 / PG-007, PG-010–012 | Manual, party, Source Spotlights, Supply and receipt lifecycle work. Final animated summons and full Archive gates remain. |
| Phase 6 / PG-013–014 | All 15 SMB courses/Lakitu/Bowser run. Do not infer every historical acceptance/detail, such as a final credits presentation, from stage completion alone. |
| Phase 7 / PG-015 | Two-world progression, Key/Threat, Adventure and mixed Endless work. The full branching multi-World portfolio is not built. |
| PG-016 | Earned legal Order folders implemented; Coin/Practice Sorties are not complete. |
| PG-017 | Assist proficiency implemented; Assist Study and Wanted Hunts remain. |
| Phase 8 / broad packets 16, 20–24 | Production/expansion queue. Not completed by the smaller v1 roster. |

## Immediate next queue

1. Bounded animated-splash workflow/source-art research, using the exact
   feedback in `docs/NEXT_CHAT.md` and preliminary links in
   `docs/ANIMATED_SPLASH_OPTIONS.md`.
2. One visibly better Dedede/SSR proof with tiered buildup and actual voice.
   Keep the liked fountain background and KING / DEDEDE / source-game label.
3. Publish the small iteration for feedback before expanding the technique.
4. Integrate the accepted presentation, finish v1 feel/audio/sprite polish,
   then perform the M2 playtest. Keep subsequent commits pushed to GitHub.

Do not restart PG-003, disable working Source Spotlights because an old first-day
ticket prohibited pulls, silently demote Dedede, or mark presentation complete
because deterministic/browser tests pass.
