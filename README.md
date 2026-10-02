# Pocket Gacha

A tiny gacha RPG that lives in the corner of your screen. Pull for heroes, level
them up, send a party of three through auto-battles. No store, no real money.

Built with [Godot 4.5](https://godotengine.org) (free). Everything is code,
with no art or sound files: the pixel sprites and sound effects are generated at runtime.

## Run it (Mac)

1. Download **Godot 4.5 or newer** (the standard build, not .NET) from
   godotengine.org and drag it into Applications.
2. Get this project onto your Mac (clone the repo, or download it as a ZIP from GitHub).
3. Open Godot → **Import** → pick `project.godot` in this folder.
4. Press **Play** (⌘B).
   If the game opens inside the editor's **Game** tab instead of as its own
   window, turn off "Embed Game on Next Play" in that tab and hit Play again.
   It should pop up as a small borderless window in the bottom-right corner.

### Make it a real app

1. **Editor → Manage Export Templates → Download and Install** (one time).
2. **Project → Export → Add… → macOS**. Set a bundle identifier
   (e.g. `com.yourname.pocketgacha`) and leave code signing on the default (ad-hoc).
3. **Export Project** → `Pocket Gacha.app`. Drop it in Applications.

## Playing

- **Drag** the top bar to move the window. **Double-click** it (or press `_`) to
  collapse it to just the bar. `x` saves and quits.
- **Summon:** 100 gems per pull, 1000 for ten. SSR 3%, SR 15%, R 82%. SSR odds
  start climbing after 50 pulls, and pull 70 is a guaranteed SSR. Every 10 pulls
  guarantees an SR or better.
- **Dupes** raise a hero's Ascension (max 5): +10% stats and +10 level cap each.
  Dupes after that turn into gold.
- **Heroes:** tap a hero to level them up with gold and add or remove them from the party (max 3).
- **Adventure:** auto-battle the current stage. Wins pay gems and gold and unlock
  the next stage. Every 5th stage is a boss. Losses still pay a little gold.
- **Free gems:** +3/min while the game is open, +1/min while it's closed (up to 8 hours),
  500 daily, and stage clears.
- Sound starts **off**. Turn it on with the SFX button.

Your save lives at `~/Library/Application Support/Godot/app_userdata/Pocket Gacha/save.json`.

## Tweaking

All the numbers (rates, pity, costs, gem income, hero roster, enemy scaling)
are constants at the top of `scripts/game.gd`.

| File | What it does |
| --- | --- |
| `scripts/game.gd` | Rules and state: gacha, levels, battles, saving (no UI) |
| `scripts/main.gd` | The window: drag/collapse, tabs, toasts |
| `scripts/summon_view.gd` / `reveal.gd` | Banner screen and the pull animation |
| `scripts/heroes_view.gd` | Collection, party, level-ups |
| `scripts/adventure_view.gd` | Stages and the battle playback |
| `scripts/sprite_gen.gd` | Procedural pixel sprites |
| `scripts/sfx.gd` | Procedural sound effects |
