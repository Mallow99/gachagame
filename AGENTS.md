# Pocket Gacha: agent guide

A private desktop gacha auto-battler built with plain HTML, CSS and JavaScript ES modules in Electron. There is no
build step, and the game also runs in a browser. It is personal and non-commercial.

## Start here

- `docs/NEXT_CHAT.md`: the current state, the owner's latest verdicts, and what to do next. Its top section is the
  newest.
- `docs/plan/26_V1_STATUS_AND_CURRENT_QUEUE.md`: the checked status and queue.
- `demos/splash-kit/FEEDBACK.md`: owner feedback on the summon and splash presentation.
- Branch: **`codex/v1-playable`**. Commit and push there unless the owner says otherwise.

## Commands

```sh
npm install
npm run web          # browser build at http://localhost:8080
npm start            # Electron strip plus the Paper Manual
npm test             # if your Node rejects --test-isolation: node --test test/*.test.js
python3 tools/splash-kit/prepare_art.py          # rebuild splash art from SOURCES.json (needs Pillow, NumPy)
node tools/splash-kit/export-artifact.mjs <dir>  # self-contained copy of the splash demo for hosting
```

## Layout

- `src/runtime.js`, `src/combat/`, `src/content/`, `src/save/`, `src/presentation/`: the live game.
  `src/views/` and some older modules are compatibility fixtures.
- `src/gacha.js` `drawPulls` is the only pull transaction. Receipts are saved before any animation plays.
- `demos/splash-kit/`: the current banner, summon and splash proof (Dedede reveal v2). `demos/dedede-reveal/` and
  `demos/mario-pull/` are older reference studies.
- `assets/`: every external asset has its provenance recorded (`INTAKE.json`, `SOURCES.md`, `SOURCES.json`).

## Rules

- Never change a unit's rarity, IDs, ownership, banners or economy without the owner's explicit decision.
- Record the source, credit and SHA-256 for every downloaded asset. Bake assets with scripts, not by hand.
- Keep combat sizes canonical: Mario is about twice Kirby's size, with stable feet and weapon frames.
- Do not leave Skip, replay, reduced motion or committed receipts broken.
- Before saying something works, verify it, including looking at screenshots. Report what you could not check.

## Skills

Shared skills live in `.agents/skills/` (Codex reads them there; Claude Code through `.claude/skills`):

- `pocket-gacha-verify`: tests plus headless screenshots.
- `splash-rig`: banner, summon and splash work, with the owner's rules.
- `owner-review`: small iterations, the feedback log, and handoffs.
- `ponytail` and `ponytail-review` / `-audit` / `-debt` / `-help`: write the least code that solves the task, and
  review diffs for bloat. Run `ponytail-review` before pushing a large change.
- `frontend-design`: deliberate visual design for UI work.

See `.agents/skills/VENDORED.md` for where the vendored skills came from and how to update them.
