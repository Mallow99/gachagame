# Content density and franchise portfolio

Status: **planning contract v1, 2026-10-14**

This document answers a simple owner requirement: roster size, playable Story
length and production effort must look like they belong to the same game. A
Saga with fourteen credible fighters must not pretend it can support eighty
stages of new content, and a hundred-card museum must not sit behind one
fifteen-stage World.

This is a planning constraint, not a demand that every franchise have the same
size. *Terraria* should lean on items, NPC Assists and enemies. Zelda can support
many game-specific iterations. Metroid has fewer recurring heroes and should
not manufacture palette fighters merely to match Mario.

## 1. Count the right things

Four counts are kept separate:

| Count | Meaning | May enter a live banner? |
| --- | --- | --- |
| museum candidate | a sourced idea with a home World and distinct behavior pitch | no |
| kit-ready fighter | complete stats, basic, skill, passive, ultimate, AI fallbacks and animation contract | only after assets |
| production-ready fighter | kit-ready plus approved sprite/art manifests and deterministic fixtures | yes |
| released fighter | production-ready and reachable through Story, banner or deterministic grant | yes |

The 251-card Mario/Kirby/20XX museum is not 251 finished fighters. Plans
`14`–`16` provide 72 complete cards; plan `21` adds the three missing Dream
Land opening cards for **75 complete numerical kits**. Plans `20`–`21` own the
opening production manifests.

Every fighter candidate must name:

1. one source game and home World;
2. a stable family lock;
3. a movement grammar visible with effects muted;
4. a basic, skill, passive and ultimate that are not four differently colored
   damage events;
5. at least one signature animation/state requirement;
6. boss/elite and invalid-target fallbacks;
7. an honest sprite route and scale class.

A row that only says “uses sword” or “big explosion” does not count toward a
roster target.

## 2. World-sized release budgets

World length still follows source material. These bands prevent a long World
from feeling collectible-poor and a tiny World from dumping an implausible
banner.

| Story length | New fighter cards supported | Normal Supply records | Distinct enemy families | Boss packets | Typical use |
| ---: | ---: | ---: | ---: | ---: | --- |
| 5 | 1–3 | 2–4 | 3–6 | 1 | cabinet or focused side story |
| 10 | 3–6 | 4–7 | 6–10 | 2 | short title or expansion |
| 15 | 5–9 | 6–10 | 8–14 | 3 | compact classic |
| 20 | 7–12 | 8–14 | 12–18 | 4 | mechanically broad classic |
| 25 | 9–15 | 10–18 | 15–24 | 5 | flagship game |

“New fighter cards” means cards first released by that World or its concurrent
Archive focus. Returning cards do not consume the budget. A source-valid boss
may remain enemy-only; a World never needs to make every boss pullable.

Exceptions require a note:

- an anthology may share an Archive while each cabinet keeps its own budget;
- a fighting game can exceed the fighter band by up to 50% because its cast
  arrives with unusually complete battle animation, but it must still provide
  encounters and opponents for them;
- a systems-heavy survival game may sit below the fighter band when Supply,
  Assists and enemy behaviors carry the variety;
- an opening regional Archive may release cross-title fighters early for gacha
  breadth, but every early card still needs a mapped future home World.

## 3. Saga-level proportionality

At each production freeze, compute:

```text
storyDepth = planned or shipped Story stages in the Saga
rosterDepth = kit-ready or released fighter versions in the Saga
depthRatio = storyDepth / rosterDepth
```

- **Healthy target:** 1.25–4.0 Story stages per fighter version.
- **Review below 0.75:** too many cards are competing for too little playable
  context; defer candidates or add their real source Worlds.
- **Review above 5.0:** the Saga risks eighty stages built around fourteen
  fighters; add credible fighters, shorten the route or explicitly make it a
  systems/enemy-led exception.
- Museum-only ideas are audited against the complete mapped roadmap. Released
  fighters are audited against shipped plus currently frozen Worlds.

Supply has a separate floor. Per five-stage Area, plan at least one Power-Up or
one Assist release. A normal 15–25-stage World should add at least three of each
category across its Story and Supply focus unless its source genuinely lacks
supporting characters.

## 4. Current audit

| Saga | Mapped Story stages | Fighter target | Current museum | Depth result | Required correction |
| --- | ---: | ---: | ---: | --- | --- |
| Mushroom Kingdom | 360 core; 380–400 with optional branches | 90–120 | 110 | healthy when every card receives a source home; opening 22 are the only production freeze | finish Supply/Assist catalogs and keep later cards parked by World |
| Dream Land | 275–300 across 17 source games | 75–100 | 91 | healthy only after the missing historical Worlds are mapped | replace the old six-World outline with plan `21`'s full Saga spine |
| 20XX | 115–140 across classic, X, Zero and Battle Network | 45–65 | 50 | healthy candidate depth; production deferred | do not release 24 Robot Masters through one *Mega Man 2* World |

The opening Archives are deliberately front-loaded at 22 normal fighters each,
so twenty pulls do not nearly complete them. That exception is bounded: only
the source-game Spotlight subset appears as Story-native, and the remaining
cards keep honest future home Worlds.

## 5. Portfolio targets

These are capacity envelopes, not promises to manufacture every card. A Saga
grows only when the previous production slice is playable.

| Saga / shelf | Mapped World direction | Planned stages | Fighter envelope | Power-Up envelope | Assist envelope | Character-density note |
| --- | --- | ---: | ---: | ---: | ---: | --- |
| Mushroom Kingdom | arcade origins through *Wonder*, plus Wario/Yoshi branches | 360 core; 380–400 extended | 90–120 | 24–36 | 20–30 | current 110-card museum fits only as a long multi-World Saga |
| Dream Land | *Dream Land* through *Forgotten Land*, including side titles | 275–300 | 75–100 | 18–28 | 18–28 | current 91-card museum receives seventeen source homes in plan `21` |
| 20XX | classic 1–11, X, Zero and Battle Network branches | 115–140 initial | 45–65 | 30–45 | 14–22 | Robot Masters supply both bosses and specialist fighters |
| Zelda | 2D origins, *Ocarina*, *Majora*, *Wind Waker*, *Twilight*, Wild era | 300 | 65–85 | 28–40 | 22–32 | many Link/Zelda iterations, companions and bosses, but masks/items stay Supply unless they pass the actor test |
| Metroid | original/Zero Mission, II, Super, Fusion, Prime branch, Dread | 160–200 | 38–55 | 24–34 | 12–20 | fewer heroes; suits/beams are mostly Supply and bosses provide roster breadth |
| Terraria | pre-Hardmode and Hardmode | 50 | 24–36 | 18–28 | 12–18 | two large systems-led Worlds; NPCs mostly Assist Pages, armor-class Terrarians and scaled bosses are fighters |
| Sonic | classic trilogy, Mania and Adventure | 90–110 | 35–50 | 18–28 | 14–22 | strong native motion supports a denser roster |
| Pokémon | selected generations as separate Worlds | 125+ | 60–90 | 20–30 | 25–40 | Pokémon are fighters; trainers are Assists; evolution-family locks prevent same-line stacking |
| Castlevania | I, III, *Symphony*, *Aria* | 75–90 | 30–45 | 20–30 | 12–20 | weapons and relics carry much of the buildcraft |
| Final Fantasy | numbered-title Worlds | 115–140 initial | 40–65 | 25–40 | 20–35 | party casts support roster density; locomotion/art remains expensive |
| Dragon Quest | III, V, VIII, XI | 90–105 | 28–42 | 20–30 | 18–28 | heroes/monsters fight; supporting party/NPC choices are source-specific |
| Fighting Circuit | publisher-separated fighting-game Worlds | 80–100 | 50–75 | 12–20 | 15–25 | allowed density exception due complete combat sheets |
| Fire Emblem | selected title campaigns | 90–105 | 40–60 | 18–28 | 20–30 | large casts, but only actors with readable roaming treatment ship |
| Doom | I, II, 64, 2016 | 80–95 | 20–32 | 20–30 | 10–16 | demons and weapons matter more than dozens of Marine variants |
| EarthBound | Beginnings, *EarthBound*, *Mother 3* | 65–75 | 18–28 | 16–24 | 14–22 | deliberately smaller cast; custom locomotion is the limiting factor |
| Arcade Hall | 5–10-stage cabinet Worlds | 45–70 initial | 20–32 | 16–24 | 12–20 | each cabinet obeys the five-stage budget even with a shared Archive |
| Minecraft | Overworld and Nether/End Worlds | 35–50 | 18–28 | 20–35 | 12–18 | equipment and mobs carry variety; do not make every tool a fighter |
| Hollow Knight | base pilgrimage plus optional Godhome expansion | 25–35 | 12–20 | 12–20 | 10–16 | one polished native cast; bosses are selective recruits |
| Henry Stickmin | one compact branching World | 10–15 | 7–12 | 6–10 | 8–12 | failure gags and Assists carry more content than fighter variants |
| Among Us | Skeld plus optional second-map expansion | 10–15 | 6–10 | 6–10 | 8–12 | roles belong in kits/items; colors are cosmetics, not fighters |
| Bloons | map tour and boss-event Worlds | 20–30 | 18–28 | 14–22 | 10–16 | Heroes can roam; most Towers are summons, Power-Ups or Assists |

## 6. Release-wave rule

For every Saga:

1. freeze one complete five-stage Area;
2. schedule only the fighters and Supply needed to make that Area fun;
3. pass battle-animation and deterministic-test gates;
4. finish the source World;
5. grow its Archive within the World budget;
6. only then schedule the next source game or Saga.

A planner may research a hundred future cards. It may not mark them
`production-ready`, publish their banner or start a mass scrape merely because
their names exist in a table.

## 7. Change-isolation rule

Every future Saga planner owns four independent tables:

- `World spine`: source games, lengths, Areas and bosses;
- `fighter museum`: versions, family locks, identities and home Worlds;
- `Supply catalog`: Power-Ups and Assist Pages;
- `production freeze`: the small subset currently authorized for code/assets.

Changing one fighter does not renumber stages. Shortening one World changes its
reward ledger but does not delete unrelated museum candidates. Reclassifying a
fighter as an Assist requires one stable-ID migration and does not rewrite the
whole Saga.
