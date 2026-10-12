# Pocket Gacha

A tiny gacha RPG that lives in the corner of your screen. Pull for heroes, level
them up, send a party of three through auto-battles. No store, no real money.

Plain HTML/CSS/JavaScript (no framework, no build step) in an Electron window.
The same code also runs as a normal web page.

## Run it

```bash
npm install
npm start        # desktop widget (Electron)
npm run web      # or play in a browser at http://localhost:8080
```

The desktop window is frameless, floats above other apps (including full-screen
ones on macOS), and starts in the bottom-right corner.

## Playing

- **Drag** the gems/gold bar to move the window. `–` collapses it to just the bar;
  `×` saves and quits.
- **Summon:** 100 gems per pull, 1000 for ten. SSR 3%, SR 15%, R 82%. SSR odds
  start climbing after 50 pulls, and pull 70 is a guaranteed SSR. Every 10 pulls
  guarantees an SR or better.
- **Dupes** raise a hero's Ascension (max 5): +10% stats and +10 level cap each.
  Dupes after that turn into gold.
- **Heroes:** click a hero to level them up with gold and add or remove them from the party (max 3).
- **Adventure:** auto-battle the current stage. Wins pay gems and gold and unlock
  the next stage. Every 5th stage is a boss. Losses still pay a little gold.
- **Free gems:** +3/min while open, +1/min while closed (up to 8 hours), 500 daily,
  and stage clears.
- Sound starts **off**. Turn it on with the SFX button.

## Where things live

| File | What it does |
| --- | --- |
| `src/data.js` | All the numbers (rates, pity, costs, income) and the roster |
| `src/game.js` | Rules and state: gacha, levels, battles, saving (no UI) |
| `src/main.js` | Window shell: top bar, tabs, toasts, collapse |
| `src/views/summon.js`, `reveal.js` | Banner screen and the pull animation |
| `src/views/heroes.js` | Collection, party, level-ups |
| `src/views/adventure.js` | Stages and battle playback |
| `src/sprites.js` | Placeholder pixel sprites (replaced by real art when a hero has `art.icon`) |
| `src/sfx.js` | Procedural sound effects |
| `electron/` | The desktop window (frameless, always on top, collapse) |

The save lives in the app's local storage. To start over, open DevTools
(View → Toggle Developer Tools in Electron, or the browser's) and run
`localStorage.clear()`.
