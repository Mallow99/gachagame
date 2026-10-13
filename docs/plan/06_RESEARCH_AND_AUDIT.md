# Research notes and plan audit

Research date: **2026-10-13**. Links are references for design reasoning and
content verification, not evidence that third-party art may be redistributed.
Community sources are labeled; production should verify details against the
source game/manual when an encounter is frozen.

## 1. Repository and prototype audit

### What exists

- Electron already creates a bottom desktop strip and management view.
- `src/combat.js` has roaming melee/ranged logic and seven actions: melee,
  shot, combo, charge, stomp, lob and beam.
- Actors act on individual cooldowns, but `src/strip.js` still renders a
  redundant `NEXT` presentation.
- The strip supports transparency/hiding, and the management Rules view exposes
  many current formulas.
- Current data contains one 50-stage Mushroom sequence in five 10-stage visual
  regions, three waves per stage and a small placeholder roster.
- Save version is 3; family locking already exists.
- The pull prototype uses 3% SSR, 15% SR, soft pity 50 (+3 points per pull),
  hard pity 70 and SR pity 10.
- Current rarity multipliers are R 1.0, SR 1.3 and SSR 1.7; individual unit
  levels multiply stats additively and cap through ascension.
- Enemies use one global `1.045 ^ (stage - 1)` scale; normal and boss records
  are largely generic.
- Existing current-formula damage is `max(1, Attack × coefficient × 0.9–1.1 -
  0.5 × Defense)` with 1.6× criticals.
- Stages currently give large direct gem/gold rewards and advance too quickly
  with the granted fixtures, matching the owner's stage-14 feedback.
- There was no `tests/` directory in the audited worktree.
- `assets/` has processed presentation art but `incoming/` has no manually
  supplied production sheets yet.

### What is retained

- independent actor readiness;
- seven spatial/animation patterns;
- family lock;
- pull rate baseline as the Fighter trial;
- save migration discipline;
- transparent desktop/application split;
- Mario pull presentation experiments;
- dev fixtures until real content is playable.

### What is replaced

- the visible `NEXT` queue;
- per-character leveling;
- one global absolute stage route;
- exponential enemy power tied directly to that stage number;
- generic enemies/boss stats as content;
- public Walter White/Tung Tung Sahur/example roster;
- mixed-title Mushroom bosses in the opening World;
- three-wave stages that evaporate in seconds.

## 2. Gacha research

### Official/primary references

- [Genshin Impact wish guarantee — HoYoverse
  support](https://support.hoyoverse.com/hc/en-us/articles/50333940684953-How-does-the-Wish-guarantee-system-work):
  character-event five-star guarantee within 90 wishes and shared guarantee
  behavior among banners of the same type.
- [Genshin legacy wish details — HoYoverse
  webstatic](https://webstatic-sea.hoyoverse.com/genshin/event/e20190909gacha/index.html?gacha_id=fecafa7b6560db5f3182222395d88aaa6aaac1bc&lang=en&region=os_asia):
  documents a 0.6% base five-star rate, 1.6% consolidated rate, 90 hard pity and
  duplicate conversion in that published ruleset.
- [Honkai: Star Rail pity by banner type — HoYoverse
  support](https://support.hoyoverse.com/hc/en-us/articles/50913710696217-How-does-the-pity-system-work-for-different-banners-and-reruns):
  pity carries among the same event-warp type, supporting separate persistent
  channels rather than one hidden global counter.
- [Honkai: Star Rail Light Cone guarantee — HoYoverse
  support](https://support.hoyoverse.com/hc/en-us/articles/50913708153625-How-does-the-guarantee-system-work-for-the-Light-Cone-Event-Warp-and-does-my-pity-carry-over):
  an equipment banner can use a different hard-pity value (80), evidence that
  banner categories need not share rates.
- [Fire Emblem Heroes beginner/new-feature guide — Nintendo/Intelligent
  Systems](https://new-guide.fire-emblem-heroes.com/en-US/feh-2020.html):
  examples include focus selection after 40 summons and multiple focus
  selection milestones on eligible banners.
- [Fire Emblem Heroes summoning-event notices — official
  site](https://fire-emblem-heroes.com/en/include/topics_detail.html):
  published examples of 3% focus plus 3% regular five-star starts and rate
  increases after runs without a five-star.
- [Pokémon Masters EX level/sync-pair guide —
  Pokémon.com](https://www.pokemon.com/us/features/pokemon-masters-ex-level-caps-sync-grids-move-level-evolution-and-more):
  treats a trainer and Pokémon as a Sync Pair and explains story-acquired
  characters and move-gauge combat. This informed, but did not dictate, the
  Pokémon roster options.

### Secondary references

- [Pokémon Masters scout summary — community
  wiki](https://pokemon-masters-ex-game.fandom.com/wiki/Sync_Pair_Scout):
  records common 7%/20%/73% five-/four-/three-star distributions and scout-point
  selectors; used only as a comparative generosity point.
- [Jujutsu Kaisen Phantom Parade beginner guide — community
  wiki](https://jjk-phantom-parade.fandom.com/wiki/Beginner%27s_Guide), plus
  [JJKPP recollection-bit database](https://www.jjkppdb.com/recollection-bits/40244):
  Recollection Bits show a memory/equipment category. The design lesson is to
  give this category its own earned tickets rather than dilute character pulls.

### Derived decisions

- Separate persistent Fighter, Supply and Mythic pity state is legible and
  industry-proven.
- A selector or guaranteed path is healthier than local-save rerolling.
- The project's 3% base SSR is already much more generous than 0.6% examples;
  keeping the current 70-pull curve for the trial fits “frequent and cheap.”
- Supply must not share a mixed result pool with fighters.
- Pity rules and odds are shown before spending, with pull history.

### Our curve calculations

Exact survival-probability calculation, not Monte Carlo:

| Curve | Expected pulls | Median | 80th | 90th | 95th |
| --- | ---: | ---: | ---: | ---: | ---: |
| Fighter: 3%, soft 50 +3 points, hard 70 | 27.40 | 23 | 52 | 56 | 59 |
| Supply: 5%, soft 30 +5 points, hard 45 | 16.68 | 14 | 31 | 34 | 36 |
| Mythic: 0.8%, soft 55 +3.5 points, hard 80 | 48.61 | 59 | 63 | 64 | 66 |

The Mythic median exceeding its mean is a consequence of a small early lucky
tail plus a steep soft-pity cluster. These values must be verified by automated
distribution tests once implemented.

## 3. Large-roster and idle research

### Roster leveling

- [AFK Journey Resonating Hall overview — community
  guide](https://www.afk.global/afk-journey/news/afk-journey-resonating-hall)
  and [AFK Journey hero/resonance summary — community
  wiki](https://afk-journey.fandom.com/wiki/Hero): roster-wide inheritance from
  a small leveled set illustrates how collection games avoid leveling every
  hero separately.
- [NIKKE September 2025 developer note —
  official](https://nikke.gg/september-2025-developers-note/) and [Synchro
  Device guide — community](https://nikke.gg/synchro-device-and-leveling-guide/):
  the Synchro Device is another example of making a large roster inherit usable
  levels; developer discussion also shows that slot friction can become its own
  annoyance.

**Decision:** go one step simpler than a five-unit resonance device. One
account-wide Training Rank applies to every fighter. No slot management is
needed to make a new pull usable.

### Desktop/idle posture

- [Rusty's Retirement — official Steam
  listing](https://store.steampowered.com/app/2666510/Rusty%27s_Retirement/):
  explicitly presents an idle game designed to sit at the bottom of the screen,
  validating unobtrusiveness as a core feature rather than presentation polish.
- [Shift Heroes Auto Battler — official
  site](https://www.shiftheroesautobattler.com/index.php): another visible
  desktop auto-battle reference.
- [Taskbar Hero — official site](https://tbhtaskbarhero.com/) and [Desktop
  Heroes — developer page](https://www.blackburnegames.com/game/7086763):
  reference points for taskbar-scale play and long-running progression.
- [Melvor Idle v0.21 notes — official
  wiki](https://wiki.melvoridle.com/w/V0.21), [beginner guide](https://wiki.melvoridle.com/index.php?title=Beginners_Guide)
  and [FAQ](https://wiki.melvoridle.com/index.php/FAQ): examples of substantial
  offline windows and offline combat calculations.
- [AFK Arena leveling/offline guide — community](https://www.afk.global/afk-arena/guides/leveling)
  and [feature unlocks](https://www.afk.global/feature-unlocks): comparative
  evidence for 12-hour offline caps and campaign-based feature rollout.

**Decision:** trial a 12-hour cap, deterministic return bundle and no offline
story advancement. More importantly, a desktop idle game that blocks normal
work has failed regardless of its reward math.

## 4. Content/source-game research

These sources established title boundaries, boss pools and chronology. Exact
stage adaptations remain original design work.

### Mario and Kirby

- [Super Mario Bros. — Super Mario
  Wiki](https://www.mariowiki.com/Super_Mario_Bros.) documents its 1985 release,
  enemies, repeated impostor Bowsers and the final real Bowser. This supports
  original-enemy remixes instead of importing later kings.
- [Mario bosses by game — Super Mario
  Wiki](https://www.mariowiki.com/List_of_bosses_by_game) is the working index
  for keeping King Bob-omb, King Boo, Bowser Jr. and others with the proper
  title.
- [Super Mario Odyssey — Super Mario
  Wiki](https://www.mariowiki.com/Super_Mario_Odyssey) and [Bowser's
  Fury](https://www.mariowiki.com/Bowser%27s_Fury) support later title-specific
  World candidates.
- [Kirby's Adventure — WiKirby](https://wikirby.com/wiki/Kirby%27s_Adventure)
  records the game's areas, copy-ability debut context and boss sequence,
  including Dedede's attempt to contain Nightmare.
- [Kirby boss index — WiKirby](https://wikirby.com/wiki/Boss#Kirby%27s_Adventure)
  provides behavior references for Whispy, Kracko, Meta Knight, Dedede and
  Nightmare.
- [Kirby Super Star manual — Nintendo
  PDF](https://www.nintendo.co.jp/clvs/manuals/common/pdf/CLV-P-SAAQE.pdf) is a
  primary reference for a later Kirby World.

### Mega Man, Sonic and Zelda

- [Mega Man Robot Master recap vol. 1 — Capcom](https://news.capcomusa.com/lets/browse/mega-man-legacy-collection-12-robot-recap-vol-1)
  and [vol. 3](https://news.capcomusa.com/lets/browse/mega-man-legacy-collection-1-2-robot-recap-vol-3):
  Capcom counts 81 Robot Masters across the two classic collections, supporting
  multiple title Worlds rather than one roster dump.
- [Sonic Origins manual — Sega](https://manuals.sega.com/origins/en/?pid=7):
  primary series/gameplay reference; original zones naturally divide into
  title Worlds.
- [Sonic Zone 0: Green Hill](https://www.soniczone0.com/games/sonic1/greenhill/)
  and [Chemical Plant](https://www.soniczone0.com/games/sonic2/chemicalplant/):
  community-level research for eventual encounter layout, not an asset license.
- [Zelda history — Nintendo](https://www.nintendo.com/jp/character/zelda/en/history/index.html)
  and [Zelda series overview — Nintendo](https://zelda.nintendo.com/about/?cid=C1055-1%3Ach%3Dsotw):
  official chronology supports one-game World cards and visible era progression.

### Pokémon, Metroid and Castlevania

- [Gym Leader](https://bulbapedia.bulbagarden.net/wiki/Gym_Leader) and [Elite
  Four](https://bulbapedia.bulbagarden.net/wiki/Elite_Four) — Bulbapedia:
  community indexes for a 25-stage regional circuit.
- [Metroid Dread Report Vol. 4 — Nintendo](https://metroid.nintendo.com/dread/ca/news/metroid-dread-report-vol-4/)
  and [Vol. 3](https://metroid.nintendo.com/dread/news/metroid-dread-report-vol-3/):
  official series-history/timeline references.
- [Castlevania history — Konami](https://www.konami.com/games/castlevania/us/en-us/history)
  and [Anniversary Collection summary — Konami
  support](https://eu-support.konami.com/hc/en-gb/articles/9647814215063-Castlevania-Anniversary-Collection):
  official title catalog/context.

### Final Fantasy, Dragon Quest, Fire Emblem and Doom

- [Final Fantasy titles](https://na.finalfantasy.com/titles) and [series
  history](https://na.finalfantasy.com/histories) — Square Enix: official title
  separation supports numbered-game Worlds.
- [What is Dragon Quest? — Square Enix](https://www.dragonquest.jp/about/) and
  [Dragon Quest Monsters: The Dark Prince — official](https://www.dragonquest.com/dqmtww/en_US/):
  series/monster-recruit context.
- [Fire Emblem character catalog — Nintendo](https://www.nintendo.com/jp/fe/characters/index.html)
  and [Fire Emblem Heroes system — official](https://fire-emblem-heroes.com/en/sp/system/):
  evidence for an enormous cross-title roster that should be released per game.
- [DOOM + DOOM II — Bethesda](https://doom.bethesda.net/en-US/doom_doomii),
  [DOOM: The Dark Ages](https://doom.bethesda.net/en-US/the-dark-ages) and [The
  Art of DOOM: Demons — Bethesda](https://bethesda.net/en-EU/news/the-art-of-doom-demons):
  official game/demon references.

### Arcade and modern games

- [PAC-MAN MUSEUM+ — Bandai Namco](https://www.bandainamcoent.com/games/pac-man-museum-plus):
  official collection describes 14 games across more than 40 years, supporting
  Arcade Hall as short independent cabinets.
- [Arcade Archives Donkey Kong — Nintendo](https://www.nintendo.com/us/store/products/arcade-archives-donkey-kong-switch/):
  official listing for the original cabinet.
- [Hollow Knight — Team Cherry](https://www.hollowknight.com/): official
  description emphasizes a large world, creatures and boss fights; native 2D
  animation makes it a strong later candidate.
- [Among Us](https://www.innersloth.com/games/among-us/) and [The Henry Stickmin
  Collection](https://www.innersloth.com/games/the-henry-stickmin-collection/) —
  Innersloth: official game references.
- [Bloons TD6 — Ninja Kiwi](https://ninjakiwi.com/Games/Mobile/Bloons-TD-6.html):
  official page distinguishes 25 Monkey Towers, 17 Heroes, Paragons, Powers and
  Insta Monkeys as of access; this supports using many towers as summons/Supply
  rather than forcing all to roam.
- [Minecraft fan/creator usage guidelines — Mojang/Microsoft](https://www.minecraft.net/en-us/usage-guidelines):
  a mandatory review before any Minecraft-derived release or distribution.

## 5. Sprite and rights research

- [PokéAPI sprites repository](https://github.com/PokeAPI/sprites): documents a
  large downloadable organized sprite set, including game versions, animated
  GIFs and Showdown/community work. GitHub reports `NOASSERTION` for the repo
  license; do not infer free art rights.
- [Pokémon Showdown client](https://github.com/smogon/pokemon-showdown-client):
  client code is AGPLv3 and its README requests contact for other relicensing.
  This software license is not a blanket Pokémon-art license.
- [OpenGameArt FAQ](https://opengameart.org/content/faq): explains that assets
  carry individual licenses/credit requirements, supporting per-asset manifests.
- [The Spriters Resource](https://www.spriters-resource.com/): useful manual
  discovery/intake index. Source pages and ripper credits are retained; the
  project does not treat the site as a license grant.

**Decision:** provenance and rights status are data. Authenticated acquisition
stays owner-run and secrets never enter Git. No mass scrape precedes the first
slice.

## 6. Alternatives deliberately rejected

| Rejected direction | Reason | Replacement |
| --- | --- | --- |
| every franchise gets exactly 50/100 stages | pads small games and delays variety | variable 5–25-stage title Worlds |
| every 25 stages freely mixes a franchise's history | spends later bosses early and hides sprite progression | one source game per World by default |
| strict chronological railroad | favorite characters arrive far too late | chronology within Saga plus cross-Saga Atlas choices |
| one global stage number and 1.045 exponential forever | branches become impossible to balance and saves become brittle | per-World threat snapshot + authored budgets |
| individual levels on every pull | makes a huge roster expensive to try | account Training Rank |
| visible turn/initiative order | contradicts real-time independent attacks | per-actor gauges and explicit state |
| seven attack patterns as damage types | mostly changes animation and creates fake complexity | spatial patterns plus optional traits |
| universal elemental triangle | makes content require counters before core combat is proven | kit-specific traits and encounter advantages |
| every Mario power-up is a fighter | floods family roster and multiplies sheets | iterations + equippable Power-Ups |
| Fighter/Assist mixed banner | support pulls feel like failed character pulls | Supply Tickets and separate banner |
| support banner uses premium fighter currency | rational player ignores it | separately earned Supply Tickets |
| real-time expiration first | punishes a personal idle game for being closed | progress-based Spotlight then Archive |
| one literal minute of invincibility | trivializes a typical stage | 8–15-second UR window |
| prestige at launch | resets authored progress before proving a need | Worlds + Mastery; revisit only on evidence |
| delete placeholder roster immediately | risks an unbootable game before art exists | hide as dev fixtures until replacements pass |

## 7. Contradiction audit

### 7.1 One title per World versus enough bosses

**Problem:** Super Mario Bros. does not have five distinct modern-style named
bosses.

**Resolution:** variable World lengths are allowed. SMB1 is shortened to 15
stages and three Areas: Hammer Bros., Lakitu and Bowser. Impostor Bowser remains
a stage-14 miniboss wave rather than being promoted to pad the Area count. It
does not borrow Goomba King/King Bob-omb/King Boo/Bowser Jr.; those later bosses
now make their source Worlds stronger.

**Audit result:** coherent if remix labels remain honest and sparse games are
shortened rather than endlessly enlarged.

### 7.2 One title per World versus banner size

**Problem:** early games may have only two hero characters.

**Resolution:** enemy recruits and defeated bosses can be pullable when their
animation works; the permanent Saga Archive remains alongside the current
title and can add a production-ready cross-title iteration; Supply provides
collectibles without fake fighter variants; not every Area needs three new
fighters. World stages remain source-specific.

**Audit result:** coherent, but a title must be allowed to ship a small banner.
Never invent five Marios to meet a quota.

### 7.3 Historical order versus the 190-hour requirement

**Problem:** a strict series chronology could postpone Zelda, Sonic or modern
characters for hundreds of hours.

**Resolution:** history structures each Saga, while Atlas tiers open multiple
Sagas. All shelves are visible immediately; major classic Sagas are eligible by
roughly 50–75 active hours and modern candidates by 100.

**Audit result:** coherent. Production availability remains the real limit and
must be labeled honestly.

### 7.4 Strong rarity versus specialist relevance

**Problem:** if SSR gets +70% stats, SR specialization cannot realistically
catch it; if gaps are tiny, SSR feels cosmetic.

**Resolution:** trial gaps are +15% SR, +38% SSR and +68% UR, with separately
reviewed kit budgets. A +40% conditional SR bonus can beat a general SSR in the
right encounter, while R is openly allowed to retire.

**Audit result:** numerically plausible but requires simulator evidence. The
current prototype's +70% SSR baseline should not be copied blindly.

### 7.5 Retired R units versus dead pulls

**Problem:** allowing R to become obsolete can make 80% of pulls feel worthless.

**Resolution:** R is useful during collection growth, duplicate stars improve
it quickly, every duplicate grants Echoes, max duplicates grant more, and
rarity-limited/Mastery objectives can revisit it without pretending it is an
SSR.

**Audit result:** direction is coherent; Echo shop prices remain a playtest
dependency.

### 7.6 Account Training Rank versus character attachment

**Problem:** removing individual levels can make units feel unowned or flat.

**Resolution:** stars, bounded Technique Mastery, kit pages, Power-Ups, art,
family collection and party presets retain identity. Mastery is capped at 4–8
ordinary or 2–4 focused hours and about 8–12% sustained power so it does not
recreate leveling. Universal Technique Notes accelerate any favorite without
adding character-specific materials.

**Audit result:** stronger than per-unit leveling for a swapping-heavy game.

### 7.6.1 Ultimate spectacle versus real value

**Problem:** a three-times-ATK cut-in sounds large, but when an actor freely
performs a one-times basic every few seconds it may equal only three ordinary
actions. The animation then promises more than the combat delivers. Scaling HP
and Attack with Training Rank cannot fix the ratio because it scales both moves.

**Resolution:** every ultimate is audited in complete basic-action equivalents
at Mastery 1: R 4+, SR 5.5+, SSR 7+, UR 10+ or 18–26 across a transformation.
First copies meet the floor. Mastery 5 adds 25% potency or two form seconds;
duplicates add bounded quality rather than rescuing the move.

**Audit result:** coherent and measurable. Simulator reports must include cast
time, first-use timing, support conversion and transform exit state. The
current paper audit has 35 direct/combat-value ultimates above their rarity
floor; eight support or transformation ultimates require the paired scenario
simulation rather than receiving an unmeasured presentation exemption.

### 7.7 Branch choice versus fair scaling

**Problem:** scaling at entry can be gamed by opening every node, while scaling
to current party makes upgrades meaningless.

**Resolution:** all choices are snapshotted when revealed, from Atlas Rank—not
on click and not from party power. They never rescale during Story. Mastery is
the current-rank track.

**Audit result:** coherent and cheap to reroute.

### 7.8 UR power versus boss mechanics

**Problem:** UR should feel outrageous without deleting every boss before its
identity appears.

**Superseded resolution (plans `17`–`18`):** no Mythic loadout cap. Keep the
68% trial base gap, powerful 12–18-second windows and boss phase floors/max
burst windows. Ordinary enemies may be obliterated; late simulation must
compare zero-, one- and four-UR parties.

### 7.9 Power-Up variety versus sprite cross-product

**Problem:** six Power-Ups across ten Mario iterations could imply sixty sheets.

**Resolution:** effect-only Power-Ups grant one trait, one stat lean and at most
one proc. There is no compatibility matrix or sprite cross-product; optional
matching frames remain polish.

**Audit result:** coherent only if the first slice implements very few authored
combinations.

### 7.10 Boss collection versus scale

**Problem:** Whispy Woods, Mother Brain and other bosses cannot roam beside
Mario honestly.

**Resolution:** boss defeat unlocks a candidate, not a guarantee. Use smaller
forms, declared playable scale, Assist/summon, or boss-only status.

**Audit result:** resolved by refusing a universal “every boss pullable” rule.

### 7.11 Many systems versus a readable manual

**Problem:** fighters, stars, Training, Power-Ups, Assists, Atlas, Threat,
Mastery, four currencies and three banner channels can become AI-designed
clutter.

**Resolution:** staged unlocks, one live formula source, a paper/manual visual
language, four visible currencies maximum and no speculative crafting system.

**Audit result:** still a presentation risk. Usability review is an acceptance
gate, not final polish.

### 7.12 Ambitious content versus actual assets

**Problem:** the catalog contains years of potential work and copyrighted IP.

**Resolution:** candidate status, asset grades, provenance, manual intake,
personal-use boundary, fixed five-stage freeze and no production commitment
without A/B animation evidence.

**Audit result:** the plan is feasible only as a modular long-term catalog. It
is not feasible as one launch roster.

### 7.13 Generous gacha versus finite Story rewards

**Problem:** 20–30 one-time pulls make the banner visible but leave a gacha
game feeling exhausted as soon as the player finishes available Story.

**Resolution:** SMB1 first clears fund 30 pulls, ordinary combat completes
repeatable Patrol Reports, and on-rank Camp targets 1.5–2.5 Fighter pulls per
active hour without a daily hard cap. Away play earns a smaller share. New
Worlds remain the fastest burst, not the only renewable source.

**Audit result:** coherent for a personal non-monetized game. The rate still
needs telemetry so the reveal remains exciting without making the strip feel
like a slow pull-vending timer.

### 7.14 Generous daily rewards versus chore lists

**Problem:** a large free login bundle has nothing to play, while a rigid daily
checklist turns a background game into chores and can demand characters the
player never pulled.

**Resolution:** Field Order folders stack for three days, offer five validated
missions and require any three. Optional resource/XP/Wanted Sorties let the
player choose a useful activity. Exact-unit, rarity, social and manual-timing
requirements are forbidden. Camp remains renewable after the folder is done.

**Audit result:** coherent if Order generation is tested against real saves and
the four-pull daily bundle replaces rather than stacks with the old flat daily
grant.

### 7.15 Generous pulls versus a tiny regional pool

**Problem:** a 9–14 fighter Archive can be functionally complete after twenty
pulls, especially when four R fighters are free. Renewable currency then
produces mostly known low-rarity cards before the collection fantasy has room
to breathe.

**Resolution:** Mushroom requires 22 normal fighters (10 R / 7 SR / 5 SSR) and
Dream Land requires 22 (8 / 9 / 5) before the Archive's first real pull.
Simulation rejects median ownership above 75% after twenty pulls. The full expansion in
plan `16` reaches 33 Mario and 31 Kirby fighters including Mythics, then uses
focus shelves/selectors after 18 rather than deleting the complete Archive.

**Audit result:** this adds a serious art workload but directly fixes early
collection saturation. The five-stage engine slice remains first and is labeled
an engine preview until the content floor passes.

### 7.16 Pixel-only identity versus modern forms

**Problem:** requiring native 2D sheets forever excludes Cappy, Poltergust,
Swordfighter Peach, Hypernova and many later games; dropping live 3D models into
the strip without treatment could make the game visually incoherent.

**Resolution:** approved 3D models may be baked through a fixed camera/light
pipeline into transparent atlases that obey the normal sprite contract. Native
live 3D remains a candidate after performance, click-through, z-order and art
tests; it is not forbidden or required.

**Audit result:** model-derived sprites are the default bridge. Provenance and
animation quality remain the gate, so “a model exists” is not enough.

## 8. Remaining trial decisions

These are not planning omissions; they require a real build or owner asset
choice.

1. Whether Toad and Peach have acceptable era-coherent battle sheets for their
   pullable R records or need temporary fixtures/reconstruction.
2. Whether every specified first-slice pullable has a sufficient sheet after
   contact-sheet audit; failed units keep their stable IDs parked.
3. Tuning the specified Coin/Starlight ledger after measured clear times.
4. Whether original or explicitly enhanced sheets are better for individual
   early units.
5. Whether unrestricted multi-UR parties exceed the tested late-stage budgets.
6. Whether UR Super Star is satisfying enough to introduce Mythic before the
   first UR fighter.
7. Final strip scale, FPS and click-through behavior on the owner's M2 Air.
8. Whether a 12-hour away cap feels generous; increasing it to 24 hours is a
   low-coupling config change.

## 9. Final audit conclusion

The plan is internally coherent under six conditions:

1. the engine and five-stage slice remain ahead of mass character production;
2. title Worlds may be shorter or use honest remixes instead of padding;
3. Training Rank is account-wide and World threat snapshots at reveal;
4. content remains data-driven with stable IDs and independent save sections;
5. every roster promise passes animation, art, provenance and workload gates;
6. generous pull income is not enabled against a regional pool below its
   declared breadth floor.

The user's game-by-game structure makes the catalog stronger, not merely
larger. It preserves the Mushroom Kingdom, Dream Land and other recognizable
destinations while creating an intelligible historical path through Mario,
Kirby, Mega Man, Zelda and the rest. The plan deliberately leaves tuning knobs
open where only play can answer them, but the coding order, formulas, complete
15-stage opener, Atlas path and content homes are concrete enough to guide
weeks of implementation without forcing a rewrite when one idea changes.
