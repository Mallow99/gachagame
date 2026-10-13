# UI flow and wireframes

The interface has two deliberately different moods:

- the always-visible strip is nearly invisible except for actors, effects and
  a compact status tab;
- management is a worn field manual: paper, ink, stamps, tabs and marginalia;
- summoning breaks out of the paper into saturated full-screen theater.

The Manual motif is structure, not an excuse for illegibility. Body text stays
clean, controls keep normal interaction states, and texture never sits behind
small text.

## Desktop strip states

### Running

```text
 [SMB · 1-1] [wave 2/4]                         [···] [hide]

        Mario        Luigi        Toad          Peach
        ▰▰▰▱          ▰▰▱          ▰▱▱           ▰▰▰▱
 ───────────────────────────────────────────────────── ground
                                  Goomba   Goomba
```

- height remains close to the current strip;
- no opaque full-width background;
- only the HUD pill, actors, telegraphs, effects and one-pixel ground cue take
  input/visual space;
- actor gauges fill independently; no `NEXT` or initiative row;
- hovering an actor temporarily accepts clicks and shows name/HP/action;
- clicking the HUD pill opens management and pauses only if the setting says so.

### Inter-wave

```text
                    WAVE CLEAR
              next group in 1.5 seconds
```

The strip stays transparent. Rewards fly toward the HUD ledger without opening
a modal.

### Lost / stalled

```text
 [REPORT: PARTY RETREATED] [Rank 4 recommended] [Retry] [Open Manual]
```

Auto-repeat stops after three consecutive losses. A loss offers the concrete
reason from telemetry: `front line fell`, `not enough range`, `timeout`, or
`boss attack not interrupted`. It never says only “Power too low.”

### Hidden

No stage progresses while manually hidden unless `continue while hidden` is
explicitly enabled. The menu-bar star shows `Paused · SMB 1-3`; hotkey and menu
restore immediately.

## Management frame

```text
 ┌─ POCKET FIELD MANUAL ───────────── Coins 1,280 · ✦ 740 · Tickets 6 ┐
 │ [ATLAS] [PARTY] [SUMMON] [MANUAL]                         [close] │
 ├──────────────────────────────────────────────────────────────────┤
 │                                                                  │
 │                         active page                              │
 │                                                                  │
 ├──────────────────────────────────────────────────────────────────┤
 │ SMB 1-3 · wave 2/4      Training Rank 3        strip: RUNNING    │
 └──────────────────────────────────────────────────────────────────┘
```

Primary navigation never exceeds four tabs. Collection is inside Party;
Archive is inside Summon; settings live behind the title/gear. The persistent
footer is the bridge back to the strip.

## First-session flow

1. A three-panel paper intro says: characters roam automatically; each acts
   when ready; the strip can be hidden at any time.
2. The player receives Mario, Luigi, Toad and Peach together. This is a story
   grant, not four fake pulls.
3. Party opens with their positions already legal. Player can swap front/back
   but may immediately press `DEPLOY`.
4. Stage 1 runs in the strip. Only the HUD and hide controls are taught.
5. Clear rewards stamp into the ledger; Training unlocks with one free Rank.
6. Stage 3 unlocks the first Power-Up slot and grants Super Mushroom.
7. Stage 5 unlocks Summon and gives exactly enough cumulative Starlight for one
   ten-pull. Supply and the Field Desk unlock with their earned tickets/first
   Order folder.

No banner, inbox, daily checklist or sale interrupts the first fight.

## Atlas page

```text
 ┌─ ATLAS / SHELF 01: CLASSIC WORLDS ───────────────────────────────┐
 │                                                                 │
 │              [ Super Mario Bros. ]                              │
 │                 8 / 15 · active                                 │
 │                       │                                         │
 │               finale grants 1 Key                              │
 │          ┌────────────┼─────────────┬────────────┐               │
 │       [SMB3]      [Kirby's Adv.] [Mega Man 2] [Pac-Man]         │
 │       25 stg        20 stg       20 stg      5 stg              │
 │       available after opener · Threat snapshot 16               │
 └─────────────────────────────────────────────────────────────────┘
```

World cards show title, year, length, Areas, key cost, projected Threat,
production state and signature unlock silhouettes. `PLANNED` cards cannot be
selected. Spending a Key asks once and explains that other choices remain
available; it never implies a permanent route lock.

The Atlas page separates:

- **Active:** unlocked and currently progressed;
- **Available:** shipped choices the player can unlock with a Key;
- **Library:** completed Worlds and Mastery tiers;
- **Planned shelf:** optional previews the owner can hide.

### Field Desk and optional Sorties

Field Desk is a binder divider inside Atlas, not a fifth permanent top-level
tab.

```text
 ┌─ FIELD DESK · 2 FOLDERS STORED ─────────────────────────────────┐
 │ Complete any 3                                                │
 │ [✓] Clear 20 waves                             +75 ✦ +100 Coin │
 │ [ ] Trigger an Assist twice                    +75 ✦ +1 Ticket │
 │ [ ] Defeat a Wanted target                     +75 ✦ +Assist XP│
 │ [ ] Run one Supply Route                       optional        │
 │ [ ] Clear three different Camps                optional        │
 │ Progress 1/3 · folder bonus +175 ✦              [VIEW SORTIES] │
 ├─ SORTIES ───────────────────────────────────────────────────────┤
 │ Coin Course · Fighter Practice · Assist Study · Supply Route   │
 │ Starfall Route · Wanted Hunt                                   │
 └────────────────────────────────────────────────────────────────┘
```

An Order card names its legal solution and exact reward before deployment. If
the player's collection changes and invalidates it, the card regenerates
without consuming progress. Sortie cards show `daily bonus remaining`, normal
repeat rewards, recommended Rank and auto-repeat state; none uses stamina.

Wanted targets appear as stamped case files. A random discovery animation may
introduce one after a Camp wave, but discovered Hunts remain directly selectable
so the player never waits on the same random spawn twice.

## Party / collection page

```text
 ┌─ PARTY: MAIN ────────────────────────────────────────────────────┐
 │ Training Rank 7     next: 130 Coins     [TRAIN EVERYONE]         │
 │                                                                 │
 │ FRONT     [Mario R ★0] [Luigi R ★0] [Toad R ★0]                │
 │ BACK      [Peach R ★0] [empty]                                  │
 │ Assist    [none]             Mythic slot [empty]                 │
 │                                                                 │
 │ Selected: Mario · Bruiser · Stomp                               │
 │ Power-Up [Super Mushroom]       [kit] [exact stats]              │
 │ Family: Mario — only one Mario iteration may deploy             │
 ├─ COLLECTION ───────────────── filters: Saga · role · rarity ─────┤
```

Dropping a conflicting family member highlights both units and offers `Replace
Classic Mario`; it does not silently eject anyone. A pulled unit displays
`Already trained to Rank 7` to make the account-wide system obvious.

The exact-stats drawer shows base, Training, stars, Supply and encounter
modifiers as separate rows. “Power” may summarize but never replace them.

## Summon page

```text
 ┌─ SUMMON LEDGER ──────────────────────────────────────────────────┐
 │ [Fighter] [Supply] [Mythic] [Archive]                            │
 │                                                                 │
 │ OVERWORLD SPOTLIGHT                          progress-based      │
 │ Hammer Bro SR · Classic party · enemy recruits                  │
 │ SSR chance 3% · soft 50 · guaranteed by 70                      │
 │ pity 8/50                                     ✦ 1,000           │
 │                   [1 PULL] [10 PULLS]                           │
 │ Pool / rates / duplicate value / Archive destination            │
 └─────────────────────────────────────────────────────────────────┘
```

The banner key art is not the result splash. Pull ceremony uses source-specific
objects, then a black quote/voice screen only for the rarities that actually
have those assets. `Skip` always reaches an accessible results grid.

The Fighter tab can show the active title Spotlight beside the permanent Saga
Archive. The Archive may include production-ready iterations from games whose
Worlds are not built; each result card states its real source game. The full
timing, rarity treatments, card fields, crash-safe result commitment and
reduced-motion behavior live in `13_HUBS_BANNERS_AND_PRESENTATION.md`.

The page explicitly distinguishes currencies and guarantees:

- Fighter uses Starlight;
- Supply uses Supply Tickets;
- Mythic uses its own unlocked route and persistent pity;
- Archives do not expire and inherit the appropriate channel pity.

An Archive above 18 released fighters adds rarity/source filters and rotating
focus shelves without hiding the complete pool. The banner header shows
`owned / released` and the full rate table—not misleading silhouette totals.

## Manual page

Manual is both help and balance truth. Its sections are generated from live
configuration where practical:

1. battle timing and the seven behaviors;
2. damage/healing/stagger formulas with a worked current-party example;
3. Training cost and exact next five costs;
4. rarity multipliers, stars and family/Mythic restrictions;
5. current banner rates, soft/hard pity and featured guarantee;
6. World Threat, recommended Rank and Mastery scaling;
7. reward sources, Field Orders, optional Sorties and offline behavior;
8. glossary of traits such as Airborne, Aquatic, Fire and Mechanical.

The fighter detail page also shows Technique Mastery 1–5, current XP, the exact
next node and an `Apply Technique Notes` control. Rank 1 displays the complete
kit; the UI never labels an unfinished move as unlocked only after duplicates.

Every rule marks `TRIAL` where tuning remains open. The Manual shows build and
content versions for bug reports.

## Encounter report

After each first clear, a half-page report shows:

```text
 CLEAR · FIRST STEPS · 02:03
 party Rank 1 / recommended 1

 Damage        Mario 34% · Toad 29% · Luigi 25% · Peach 12%
 Support       Peach 420 shield/heal · Toad 110 heal
 Trouble       Luigi spent 8.2 s out of range
 Rewards       60 Starlight · 100 Coins

 [continue] [details] [change party]
```

Details expose actions and deaths, not raw thousands of log events. Developer
mode can export the deterministic event log.

## Required non-happy states

| State | Required behavior |
| --- | --- |
| no save | grant starter party and begin intro |
| v3 save | migrate, show one concise migration note and preserve backup |
| corrupt save | offer fresh start or copy raw backup; never loop/crash |
| missing content ID | substitute an `Unavailable Record`, preserve ownership and report ID |
| no eligible target | actor repositions; telemetry marks idle reason |
| insufficient currency | disabled pull/train button shows exact shortage |
| banner empty/locked | show unlock condition, never a blank card |
| provisional art | visible stamp in management; strip placeholder remains unobtrusive |
| repeated defeat | stop repeat after three, show failure evidence and recommended action |
| app loses focus | strip keeps running unless paused by setting; management does not steal focus |
| fullscreen app | strip hides according to current Electron behavior |

## Visual token starting point

These are implementation values, not a final brand bible.

| Token | Trial value | Use |
| --- | --- | --- |
| paper | `#eee6d2` | main field |
| paper shadow | `#c8bda5` | dividers/inset edges |
| ink | `#24201b` | text and line art |
| muted ink | `#6f675a` | secondary copy |
| stamp red | `#a43d32` | first clear, warnings, active tab |
| ledger green | `#566b55` | positive resource deltas |
| summon night | `#101326` | ceremony base only |
| focus | `#2d68a7` | accessible keyboard ring |

Use one serif/display face for headings and a highly readable system or bundled
sans face for body text. Avoid gradients, floating glass cards, neon outlines
and excessive rounded rectangles in management. Small physical imperfections
belong in borders/stamps, not in alignment or text rendering.

## Responsive and input checks

- primary target: 360×600 management window;
- keyboard order follows tabs → page actions → footer;
- Escape closes a detail sheet before closing management;
- Enter/Space activate focused controls;
- reduced motion skips camera shakes, parallax and letter slams but preserves
  timing information;
- 200% text zoom keeps pull rates, Training cost and encounter actions visible;
- every icon has text or an accessible name;
- actor/telegraph contrast is checked over every World background.
