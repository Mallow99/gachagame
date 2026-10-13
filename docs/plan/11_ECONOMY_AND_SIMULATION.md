# Economy and simulation plan

This document turns the system targets into an exact first-World ledger and a
repeatable validation plan. Every number is **TRIAL**. The game is personal and
has no paid currency, stamina sale or monetization target; pacing exists to make
progress and pulls satisfying rather than instant noise.

## New account grant

| Resource | Amount | Reason |
| --- | ---: | --- |
| Coins | 300 | enough to demonstrate Training, not skip the first Area |
| Starlight | 0 | the first ten-pull is visibly earned by stage 5 |
| Supply Tickets | 0 | Supply appears after its purpose is taught |
| Echoes | 0 | duplicates explain this later |
| Atlas Keys | 0 | first World is free; its finale awards the first Key |

The four R starters are a story grant. They do not consume pull value and are
not staged as lucky results.

## Exact SMB1 first-clear ledger

### Starlight

| Milestone | Per-stage/bonus | Running total | Fighter pulls funded |
| --- | ---: | ---: | ---: |
| stages 1–4 | 60 each | 240 | 2.4 |
| stage 5 | 160 | 400 | 4.0 |
| Area 1 mission | 600 | **1,000** | **10.0** |
| stages 6–9 | 75 each | 1,300 | 13.0 |
| stage 10 | 200 | 1,500 | 15.0 |
| Area 2 mission | 300 | 1,800 | 18.0 |
| stages 11–14 | 100 each | 2,200 | 22.0 |
| stage 15 | 300 | 2,500 | 25.0 |
| World completion | 500 | **3,000** | **30.0** |

Stage 5 therefore unlocks Summon at exactly one ten-pull. The complete World
funds 30 pulls before renewable play and ordinary reports. The tutorial
ten-pull guarantees Hammer Bro if the batch contains no new SR-or-better
fighter. It does not replace or suppress the normal SSR roll.

### Coins

| Milestone | Per-stage/bonus | World Coins | Account total before spending |
| --- | ---: | ---: | ---: |
| stages 1–4 | 40, 45, 50, 55 | 190 | 490 |
| stage 5 | 100 | 290 | 590 |
| Area 1 report | 150 | **440** | **740** |
| stages 6–9 | 75 each | 740 | 1,040 |
| stage 10 | 180 | 920 | 1,220 |
| Area 2 report | 250 | **1,170** | **1,470** |
| stages 11–14 | 110 each | 1,610 | 1,910 |
| stage 15 | 250 | 1,860 | 2,160 |
| World completion | 400 | **2,260** | **2,560** |

The table excludes repeat wave drops. A normal first clear plus two to four Camp
runs should support Rank 15–18 by the finale. A player who spends every possible
minute farming can overlevel Story; that is acceptable because Mastery, not
rubber-banding, is the challenge path.

### Supply and structural rewards

| Milestone | Supply Tickets | Other |
| --- | ---: | --- |
| stage 3 | 1 | Super Mushroom granted directly |
| stage 5 / Area 1 | 4 | Supply unlocked; Hammer Bro focus |
| stages 6–10 / Area 2 | 7 | second party preset, Aquatic report |
| stages 11–15 / Area 3 | 7 | Bowser featured focus, finale Page |
| stage 15 | included above | Atlas Key, Rank 3, Archives, Mythic page unlock |
| **World total** | **19** | complete first Atlas loop |

Directly granted Super Mushroom is not random. The first party can use the
Supply system even if every ticket produces a duplicate.

## Training cost and first-World ranks

The purchase from Rank `L` to `L+1` costs:

```text
round_to_5(80 × 1.085 ^ (L - 1)) Coins
```

| Target Rank | Cumulative Coins from Rank 1 | Intended point |
| ---: | ---: | --- |
| 5 | 360 | stages 3–4 |
| 7 | 590 | Area 1 boss |
| 10 | 1,015 | stages 8–10 |
| 15 | 2,000 | World finale recommendation |
| 16 | 2,250 | comfortable Bowser retry |
| 20 | 3,480 | first Tier-A Area |
| 25 | 5,710 | later Tier-A progression |
| 30 | 9,065 | multiple Worlds |
| 40 | 21,705 | mature account |

The first-clear ledger plus starting Coins is 2,560. Rank 15 costs 2,000, leaving
560; Rank 16 costs 2,250, leaving 310. Camp drops make Rank 17–18 plausible.
Reference fights test Rank 15 as the free-team target and Rank 18 as the
comfort ceiling. Bowser must not assume the player spent all Coins optimally.

## First-World pull outcomes

Fighter rate uses 3% SSR, soft pity after pull 50 and hard pity at 70. The World
funds 30 pulls before renewable income:

| Pulls | Chance of at least one SSR before featured guarantees |
| ---: | ---: |
| 10 | 26.3% |
| 20 | 45.6% |
| 22 | 48.8% |
| 23 | 50.4% |
| 26 | 54.7% |
| 30 | 59.9% |
| 40 | 70.4% |
| 45 | 74.6% |
| 50 | 78.2% |
| 56 | 91.0% |

The opener should therefore feel exciting whether or not it produces an SSR:
the guaranteed SR must be useful, the free party must remain viable, and
Bowser's defeat—not lucky rarity—is the gate. First clears, one daily report
and normal renewable combat target **35–45 pulls by hour 5**. That is beyond
the median SSR point without making one mandatory; an unusually fast no-Camp
clear still earns 30.

Nineteen Supply pulls have roughly a 62% chance to contain at least one natural
SSR at the base 5% rate, before the 10-pull SR guarantees and soft pity. Again,
the direct Mushroom and authored Area rewards ensure the system works at the
low outcome.

## Daily, repeat and away income

### Three stackable daily reports

One report is stored per day up to three. It asks for ordinary play and awards:

| Completion | Reward |
| --- | --- |
| clear or simulate 12 waves | 100 Starlight, 100 Coins |
| change/use one legal loadout and clear 4 waves | 100 Starlight, 1 Supply Ticket |
| defeat/replay an Area boss | 100 Starlight, 150 Coins, 1 Supply Ticket |
| all three | no extra currency; a visible report stamp |

Total: 300 Starlight, 250 Coins and 2 Supply Tickets. No login streak resets.
The loadout goal auto-completes if the account owns no alternative legal item.

### Active Camp target

At an on-rank cleared Camp, the target after bounded chests is:

- 90–160 Coins/hour early, growing with Threat;
- 150–250 Starlight/hour (1.5–2.5 Fighter pulls);
- 0.8–1.5 Supply Tickets/hour;
- no Atlas Rank, Key or story first-clear reward.

Renewable Starlight is visible rather than hidden in a rare chest:

- each repeat wave awards 1 Starlight;
- every 20 repeat waves completes a Field Report for 25 Starlight;
- Area-boss rematches add a bounded 25-Starlight report once per clear cycle;
- later Mastery Orders add harder repeatable reports without replacing Camp.

At measured 60–110 waves per hour, direct wave/report income supplies the
target range forever. It has no daily hard cap. Repeatedly camping one stage
reduces only its optional chest chance; direct Starlight, enemy Coins and the
Field Report meter never shut off.

### Away target

- uses the selected Camp's measured median clear time, never a fabricated power
  score;
- caps at 12 hours;
- pays 60% of expected active Coins and 25% of active Starlight/report pace;
- converts chance drops into a deterministic fractional accumulator;
- never clears Story, spends currency, pulls, uses a Key or expires a banner.

## 15-stage active-time budget

| Activity | Target |
| --- | ---: |
| 12 normal stage fights × 2–3.5 min | 24–42 min |
| 2 Area bosses × 4–5 min + Bowser 5–7 min | 13–17 min |
| retries and Camp clears | 35–90 min |
| reports, Training, Party and Supply decisions | 45–90 min |
| pull ceremonies and collection review | 15–30 min |
| ambient strip time/interruptions | 45–90 min |
| **expected complete World** | **3–5 active hours** |

This time budget yields roughly 5–12 renewable pulls depending on how much of
the session is Camp combat, plus the 30 first-clear pulls and up to 3 daily
pulls. The end-of-opener target is therefore 35–45, not twenty.

Raw combat is not padded to three hours. The full loop takes time because the
player makes decisions, watches new behavior, changes teams and occasionally
fails. Telemetry separately records fight time, management time and hidden idle
time so these cannot be confused.

## Difficulty simulation matrix

Every stage ships with four versioned reference teams and at least 2,000 seeds.

| Fixture | SMB1 composition | Rank/stars | Expected envelope |
| --- | --- | --- | --- |
| free-minimum | Mario, Luigi, Toad, Peach; granted Mushroom only | recommended Rank, 0 stars | normals ≥90%; Area bosses 75–90%; Bowser 75–85% |
| free-comfort | same party with earned SR Supply | +2 Ranks, 0 stars | bosses ≥92%; no mandatory phase skipped |
| typical | three starters + one ordinary SR/SSR-equivalent value | recommended Rank, 0–1 stars | normals ≥97%; bosses 90–98% |
| premium | two SSRs, two ordinary units, legal Supply | recommended Rank | near 100%, 20–35% faster |
| Mythic | one UR item, otherwise typical | recommended Rank | ordinary waves crushed; every boss identity still appears |

Additional stress cases:

- all melee against Lakitu must be slow but possible through stagger windows;
- no healer against Bowser must be possible at +2 Rank with defensive Supply;
- strongest legal Mario-family iteration cannot deploy beside Classic Mario;
- four R units five Ranks over recommendation should win comfortably;
- an UR five Ranks under recommendation must not bypass lethal telegraphs;
- deterministic seeds test simultaneous readiness, target death during a combo,
  projectile interception, boss phase transitions and a last-frame heal.

## Economy simulator outputs

The planned `tools/simulate.mjs` accepts seed, hours, route and account profile.
It does not need graphics or Electron. One run outputs:

```text
route and World snapshots
Training Rank over active time
first-clear and repeat currencies
pull count, rarity results, pity and duplicates
collection breadth by rarity/family
stage clear rates/times by reference team
stalls longer than 30 active minutes
first SSR, first UR and selector timing
unused Supply and Echo balances
```

Required batches:

1. 10,000 fresh accounts through SMB1 with median play behavior;
2. 2,000 each for high-farm, low-management and unlucky-pull profiles;
3. every Tier-A route ordering through Atlas Rank 10;
4. 190-hour projections with no lucky UR, median luck and 95th-percentile luck;
5. sensitivity at ±15% Coin income, Starlight income, enemy HP and stage time.

The simulator is a planning tool, not proof of fun. Visual readability and
roaming behavior still require actual Electron playtests.

## Economy guardrails

A balance change fails review if it causes any of these:

- the first ten-pull arrives before the player clears stage 5 or after it;
- the free party requires a random SSR to reach stage 15;
- a new unit enters more than two effective Ranks below the account;
- renewable active income falls below 1.5 Fighter pulls/hour at an on-rank Camp
  or shuts off behind a daily cap;
- ordinary daily income exceeds the entire SMB1 first-clear income in under
  five days, making new content feel irrelevant;
- an unlucky account cannot obtain any useful new fighter by stage 10;
- Supply competes for Starlight or Fighter pity;
- a timer removes content or pity while the app is closed;
- the guaranteed UR milestone exceeds 120 active hours for a normal route;
- one short five-stage World yields the same Atlas Rank or total first-clear
  currency as a 25-stage flagship;
- repeated farming is the only rational action for more than 30 active minutes.

## Mastery replay model

Story never rescales after its reveal snapshot. Completing a World unlocks a
separate Mastery card that snapshots again from the current Atlas floor each
time a new tier is first entered.

| Tier | Encounter treatment | First-clear emphasis |
| ---: | --- | --- |
| I · Veteran | Story composition at current Threat; one disclosed modifier | Supply Tickets, Echoes, profile stamp |
| II · Expert | +15% composition budget; one authored elite substitution | mastery material/selector progress |
| III · Remix | +30% budget; two compatible modifiers; boss move remix | Starlight, SSR fragment progress, frame |
| IV · Mythic | +45% budget; authored boss phase variant; Mythic slot expected | Mythic pull credits, title effect |
| V · Chronicle | +60% budget; full-World endurance order, no healing reset abuse | cosmetic crown and repeat-order unlock |

Percentages affect encounter point budget, not a blanket hidden damage
multiplier. Enemy HP/Attack still follow the snapshotted Threat formula. A tier
must name its modifiers before deployment and remains fixed until cleared.

After Mastery I, the World offers repeatable three-encounter Orders. An Order
chooses one normal stage, one elite remix and one Area boss; completion adds
100–200 Starlight based on target time, 1–2 Supply Tickets and ordinary Coins.
Orders can be repeated without a daily cap, but rotating among Worlds gives a
small chest bonus. Their Starlight is included in—not added on top of—the
1.5–2.5 active-pulls/hour economy target.

Mastery never grants Atlas Rank, additional first-clear Keys or duplicate Story
Starlight. A failed Mastery run does not block Story or the player's next World.
Each World needs only Tier I for initial release; II–V are authored when its
encounters have enough measured data to remix intelligently.

## UR acquisition path

- stage 15 opens the Mythic page and makes Super Star eligible; it does not
  grant the UR;
- Mythic pulls use Starlight, retain their own pity forever and never reset on
  rotation;
- World achievements may award direct Mythic pull credits without adding a
  fifth visible currency;
- first clearing 20 Areas **or** reaching 120 active hours, whichever occurs
  first, grants one selector among UR candidates actually unlocked by the
  account;
- if only one candidate is unlocked, the selector can be held indefinitely;
- one Mythic slot means a first UR remains a meaningful loadout choice after
  another arrives.

The time fallback is based on active simulation time and requires at least five
complete Worlds so leaving the strip open on stage 1 is not a selector farm.
