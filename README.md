# Pocket Gacha

> Picking this up? Read [HANDOFF.md](HANDOFF.md) first.

A tiny gacha RPG that fights along the bottom of your screen. Pull for heroes,
level them up, and send a party of four through auto-battles. No store, no real money.

Plain HTML/CSS/JavaScript (no framework, no build step) in an Electron window.
The same code also runs as a normal web page.

## Run it

```bash
npm install
npm start        # desktop widget (Electron)
npm run web      # or play in a browser at http://localhost:8080
```

The desktop app starts as a transparent, always-on-top battle strip along the
bottom of the screen. Click **MANAGE** to open the full game window; its `–`
button returns to the strip. Outside the HUD, strip clicks pass through to the
app underneath it.

## Playing

- **Strip:** battles run continuously. The HUD shows the current area, stage,
  action and rewards; click **MANAGE** to pull or change the team.
- **Management:** drag the gems/gold bar to move the window. `–` returns to the
  strip; `×` saves and quits.
- **Summon:** 100 gems per pull, 1000 for ten. SSR 3%, SR 15%, R 82%. SSR odds
  start climbing after 50 pulls, and pull 70 is a guaranteed SSR. Every 10 pulls
  guarantees an SR or better.
- **Dupes** raise a hero's Ascension (max 5): +10% stats and +10 level cap each.
  Dupes after that turn into gold.
- **Heroes:** click a hero to level them up with gold and add or remove them from the party (max 4). Variants are separate pulls, but only one member of a character family can be equipped at once.
- **Adventure:** auto-battle the current stage. Wins pay gems and gold and unlock
  the next stage. The first 50 stages cross five Mushroom Kingdom areas, each
  ending in a boss. Losses still pay a little gold.
- **Free gems:** +3/min while open, +1/min while closed (up to 8 hours), 500 daily,
  and stage clears.
- Sound starts **off**. Turn it on with the SFX button.

## Where things live

| File | What it does |
| --- | --- |
| `src/data.js` | All the numbers (rates, pity, costs, income) and the roster |
| `src/game.js` | Rules and state: gacha, levels, battles, saving (no UI) |
| `src/main.js` | Window shell: top bar, tabs, toasts, collapse |
| `strip.html`, `strip.css`, `src/strip.js` | Always-on-top auto-battle strip and its seven attack animations |
| `src/views/summon.js`, `reveal.js` | Banner screen and the pull animation |
| `src/views/heroes.js` | Collection, party, level-ups |
| `src/views/adventure.js` | Stages and battle playback |
| `src/sprites.js` | Placeholder pixel sprites (replaced by real art when a hero has `art.icon`) |
| `src/sfx.js` | Procedural sound effects |
| `electron/` | Strip/management window switching and click-through behavior |

The save lives in the app's local storage. To start over, open DevTools
(View → Toggle Developer Tools in Electron, or the browser's) and run
`localStorage.clear()`.
