# Mushroom Kingdom production packet

Status: **opening roster spec-ready; asset/code production packet v1, 2026-10-14**

This file is the handoff for implementing Mushroom Kingdom without rereading
the entire candidate museum. It does not mark 110 fighters ready. It freezes a
high-quality opening set, supplies the missing equipment/support depth and maps
the larger museum to enough future games that the Saga can grow coherently.

Numerical fighter cards remain authoritative in plans `14` and `16`. Encounter
numbers remain authoritative in plans `02`, `04` and `12`. This packet owns the
opening production manifest and Mushroom Supply catalog.

## 1. What “ready to write” means

The opening set is **spec-ready**, not art-complete. Code may begin when a row
has a stable ID, complete card, named primitives and deterministic acceptance
case. A fighter may enter a spendable banner only after its sprite/art manifests
pass plan `05`.

The first production target remains SMB1 stages 1–5. Do not attempt to author
all 22 actors before Mario, Goomba, Koopa, Piranha Plant and Hammer Bro make
that slice genuinely fun.

## 2. Exact 22-fighter opening Archive

Classic Mario is the sole free starter. The other 21 are pull records. The
source column names the full numerical card; this table names the implementation
reason each fighter exists.

| Fighter | Rarity | Pattern / movement identity | Required runtime primitive | Visual acceptance | Card source |
| --- | --- | --- | --- | --- | --- |
| Classic Mario | R | Stomp; committed run and rebound | jump arc, landing marker, squash response | feet contact before damage; eligible enemies flatten; Mario bounces | `14` §3 |
| Classic Luigi | R | Charge; higher floatier arc and long recovery slide | asymmetric arc, retreat anchor | silhouette/timing remain distinct from Mario with color and sound muted | `14` §3 |
| Toad | R | Combo support; short rapid courier route | multi-hit markers, ally delivery | three physical contacts read before the delivery toss/heal | `14` §3 |
| Princess Peach | R | Lob support; controlled float | airborne state, hover timeout, turnip projectile | clears a low hazard without becoming permanently untargetable | `14` §3 |
| Koopa Troopa | R | Strike vanguard; shell state | retract, kickable secondary actor, re-emerge timer | shell can be kicked through two enemies and never stalls the wave | `14` §3 |
| Princess Daisy | R | close-range sparkle striker | hop chain, radial burst | footwork and flower/spark impact stay visible at strip scale | `14` §5 |
| Captain Toad | R | no-jump Lob pathfinder | ground-only routing, mine/turnip arcs | never uses the generic jump escape; backpack weight affects turns | `16` §4 |
| Dry Bones | R | reassembling vanguard | knockout substate, bone scatter/rebuild | collapse, invulnerable rebuild tell and legal final defeat are distinct | `16` §4 |
| Birdo | R | egg artillery | mouth anchor, arcing egg, returning pickup | egg visibly leaves the snout and may be intercepted as a secondary actor | `16` §4 |
| Shy Guy | R | masked Charge courier | lane dash, carried object fallback | feet churn before a committed dash; mask never behaves as a loose face | `16` §4 |
| Hammer Bro | SR | jumping Lob artillery | ballistic projectile, jump perch, fan pattern | hammer spin and landing recoveries expose readable attack windows | `14` §3 |
| Yoshi | SR | tongue tether and egg Shot | grab eligibility, store/release, egg actor | licks/swallow on fodder; boss fallback makes an egg without swallowing | `14` §4 |
| Bowser Jr. | SR | hovering Lob controller | hover band, Clown Car secondary weapons | body remains anchored in the car; projectiles emerge from visible ports | `14` §5 |
| Dr. Mario | SR | capsule Shot/support | two-color projectile, status cleanse/heal | capsules rotate and resolve colors; healing is not recolored damage | `16` §4 |
| Builder Mario | SR | construction bruiser | temporary block actor, hammer collision | built blocks have placement, lifetime and destruction tells | `16` §4 |
| Kamek | SR | flying Lob controller | broom hover, transform/status table | wand cast visibly changes a target/prop; no generic purple missile substitute | `16` §4 |
| Tanooki Mario | SR | airborne tail striker | P-Meter state, tail arc, statue substate | run builds flight; statue has a bounded exit and impact response | `16` §4 |
| Bowser | SSR | heavy Charge/Beam boss fighter | flame ticks, weight class, grab fallback | breath ticks match damage; landings shake props without hiding telegraphs | `14` §3 |
| Mario 64 | SSR | acrobatic Combo | punch chain, triple-jump counter, dive | broad stance, recoil and escalating jumps read as 64 rather than Classic | `14` §4 |
| Cappy Mario | SSR | cap Shot/Striker | outbound/returning cap, bounce anchor, bounded capture echo | cap is a real secondary actor; capture never steals a boss permanently | `16` §4 |
| Dry Bowser | SSR | skeletal bruiser/blue flame | collapse/reassembly, piercing flame | reassembly is not a free revive loop; blue flame owns distinct timing | `16` §4 |
| Poltergust Luigi | SSR | pull Beam controller | tether force, Gooigi helper, slam eligibility | hose/nozzle owns the suction anchor; Heavy targets use stagger fallback | `16` §4 |

### Opening roster invariants

- The pool is exactly **10 R / 7 SR / 5 SSR**; UR does not pad it.
- `mario`, `luigi`, `peach` and `bowser` family locks are validated before a
  stage launches, not after actors spawn.
- Every conditional action declares `Small`, elite, boss and no-target behavior.
- No fighter is approved from particles alone. Movement and contact timing are
  part of its mechanics.
- The 22 cards need 22 collection/reveal records, but common runtime primitives
  are shared; do not make one-off physics classes named after characters.

## 3. Implementation primitive order

| Order | Primitive | Opening users | Headless proof |
| ---: | --- | --- | --- |
| 1 | marker-driven jump/land/rebound | Mario, Luigi, Peach, Daisy, Hammer Bro | damage cannot occur before the `land` marker |
| 2 | persistent secondary actors | Koopa shell, eggs, hammers, capsules, cap, blocks | actor lifetime and ownership survive target knockout |
| 3 | grab/tether/store/release | Yoshi, Poltergust Luigi | four fixtures: fodder, projectile, elite and boss |
| 4 | bounded substates | shell, statue, collapse, hover, float | every state has duration, interrupt and recovery exit |
| 5 | terrain/hazard reactions | Captain Toad, Peach, Tanooki | ground-only and airborne routes choose legal anchors |
| 6 | multi-actor helpers | Gooigi, capture echo | helper cannot become a fifth party fighter or own rewards |
| 7 | giant/boss weight rules | Bowser and later URs | push/grab/knockback fallbacks are deterministic |

## 4. Opening Supply pages

The first spendable `Power-Up Cache` and `Assist Call` each launch with eight
normal records. That comfortably clears the six-record floor while leaving
growth room. Supply uses Supply Tickets and shared Supply pity; it never spends
Fighter currency.

### 4.1 Opening Power-Up Cache

| Power-Up | Rarity | Trait / lean | Proc | First source |
| --- | --- | --- | --- | --- |
| Super Mushroom | R | Enlarged; +8% max HP | ignore first minor knockback each wave | SMB1 stage 3 grant |
| Life Mushroom | R | Vital; +7% healing received | first wave-clear heal gains 20% | *Galaxy* Archive focus |
| Mini Mushroom | R | Tiny; +8% Move | first Heavy hit each wave is reduced 20%, then Tiny breaks for 4 s | *New Super Mario Bros.* focus |
| Fire Flower | SR | Fire; +11% ranged damage | every fourth basic applies light Burn | SMB1 Area 1 Supply |
| Ice Flower | SR | Ice; +10% Guard | every fourth basic applies 18% Slow for 2 s | SMB1 Area 2 Supply |
| Super Leaf | SR | Airborne; +10% Move | crosses low hazards; grants no tail/P-Meter kit | SMB1 Area 2 Supply |
| Penguin Suit | SSR | Ice; +15% Move | slide through one ground hazard every 10 s | SMB1 finale Supply focus |
| Metal Cap | SSR | Metal; +18% Guard | 4 s control immunity below 35% HP, once/stage | Mario 64 preview focus |

`Super Star` unlocks Mythic eligibility after the SMB1 finale and does not count
toward the eight-record normal page.

### 4.2 Opening Assist Call

| Assist | Rarity | Trigger | Intervention | Entrance/exit requirement |
| --- | --- | --- | --- | --- |
| Toadsworth | R | first ally below 30% HP, once/wave | tea heals 120% Assist ATK and cleanses Slow | walks in, cup reaches ally, bows out |
| Sprixie Princess | R | wave clear | grants party 5 energy and a 35% shield | bottle opens; fairy circles party and leaves upward |
| Toad Brigade | R | first elite enters | marks it for 8 s and grants 12 boss/elite stagger on party basics | brigade sights target through telescope |
| Talkatoo | R | legal target has survived 18 s | calls out priority target; party gains 8% Haste against it for 6 s | speech icon points to the real target, never UI-only flavor |
| Professor E. Gadd | SR | boss phase start, twice/stage | reveals reactions for 12 s and adds 20 stagger | scanner sweep travels across the boss before values appear |
| Tiara | SR | first marked projectile aimed at back row | catches it and grants a 70% Assist ATK shield | hat arcs from offscreen, catches, returns |
| Plessie | SSR | six enemies are alive or a boss add wave starts | line charge deals 3.2× Assist ATK and carries Small enemies | visible entry lane and splash exit; no instant screen wipe |
| Lubba | SSR | party falls below 35 total energy after 45 s | grants 12 energy each and 12% Haste for 8 s, once/stage | Starship portal opens, Lubba rallies, portal closes |

### 4.3 Full Mushroom Power-Up shelf

Opening records above are included in this 25-item long-term shelf.

| Rarity | Power-Ups | Home Worlds / identity boundary |
| --- | --- | --- |
| R | Super Mushroom; Life Mushroom; Mini Mushroom | survivability, healing and evasive-size traits only |
| SR | Fire Flower; Ice Flower; Super Leaf; Cape Feather; Frog Suit; Hammer Suit; Boomerang Flower; Propeller Mushroom; Cloud Flower; Super Bell; Bubble Flower; Drill Mushroom; Rock Mushroom; Bee Mushroom | each grants one trait/stat/proc; none replaces a fighter kit or ultimate |
| SSR | 1-Up Mushroom; Penguin Suit; P-Wing; Metal Cap; Wing Cap; Vanish Cap; Gold Flower | stronger once-per-stage or internally cooled effects; 1-Up prevents one knockout at 1 HP rather than granting a second fighter |
| UR | Super Star | post-ultimate 12 s Awakening from plan `18`; no second energy bar |

Explicit boundaries:

- Super Bell does not turn its wearer into Cat Mario.
- Super Leaf does not grant Tanooki Mario's tail, statue or P-Meter moves.
- Giga Bell, Wonder Flower, Mega Mushroom and Double Cherry stay inside the
  relevant fighter ultimates and are not separate inventory records.

### 4.4 Full Mushroom Assist shelf

| Rarity | Assist Pages | Intervention direction |
| --- | --- | --- |
| R | Toadsworth; Sprixie Princess; Toad Brigade; Talkatoo; Noki Elder; Gearmo Crew | small heal/cleanse, wave energy, elite mark, priority call, water cleanse, hazard repair |
| SR | Professor E. Gadd; Tiara; Luma; Prince Florian; Polari; Stuffwell; Tippi; Star Spirits | scans, interception, comet shield, hazard warning, gravity control, item rescue, hidden-target reveal, party blessing |
| SSR | Plessie; Jaxi; Lubba; Dorrie; TEC-XX; Honey Queen | full-lane rides, boss-window burst, energy rally, water rescue, tactical rewrite, swarm shield |

Each receives a full trigger/effect/cooldown record only when its home World
enters production. None of these characters is simultaneously a fighter in the
current museum. Reclassification requires a stable-ID migration.

## 5. Story depth that supports 110 museum cards

The candidate museum is justified by a long Saga, not by bloating SMB1. The
core spine below totals **360 stages**; optional arcade/sports/creator branches
add 20–40 more. At 110 museum cards, that is roughly 3.27 core Story stages per
candidate.

| Source World | Stages | Primary roster homes / build focus |
| --- | ---: | --- |
| Super Mario Bros. | 15 | Classic Mario/Luigi, base cast, Koopa, Hammer Bro, Bowser |
| Super Mario Land | 10 | Land Mario, Daisy, Sarasaland enemies |
| Super Mario Bros. 2 | 15 | SMB2 Mario/Luigi/Peach/Toad, Birdo, Shy Guy |
| Super Mario Bros. 3 | 25 | Tanooki Mario, Boom Boom, Koopalings, Dark Land Bowser |
| Super Mario World | 20 | cape-era Mario, colored Yoshis, Koopalings, Clown Car Bowser |
| Yoshi's Island | 20 | Yoshi's Island Yoshi, Kamek, Baby-Mario mechanics |
| Wario Land line | 20 | four Wario identities and treasure/status systems |
| Super Mario 64 | 20 | Mario 64, King Bob-omb, movement caps |
| Paper Mario | 20 | Paper Mario and eight original partners |
| The Thousand-Year Door | 20 | six partner fighters and stage/audience systems |
| Luigi's Mansion line | 15 | Poltergust Luigi, King Boo, portrait ghosts and E. Gadd Supply |
| Super Mario Sunshine | 20 | Sunshine Mario, Shadow Mario, Petey, Bowser Jr. and goop |
| Super Mario Galaxy | 25 | Galaxy Mario, Rosalina versions, Luma/Gearmo support |
| New Super Mario Bros. line | 15 | NSMB Mario, Dry Bowser, Bowser Jr., movement items |
| Super Mario 3D World | 15 | Cat Mario/Peach, Rosalina, Boom Boom/Pom Pom, Meowser |
| Super Mario Odyssey | 25 | Cappy Mario, Pauline, captures as bounded encounter actors |
| Bowser's Fury | 10 | Fury Bowser, Bowser's Fury Mario and Lake Lapcat systems |
| Super Mario Bros. Wonder | 20 | Wonder Mario/Daisy, Prince Florian support, Bowser finale |
| Princess Peach: Showtime! | 15 | Swordfighter/Ninja/Mighty Peach identities |
| Mario & Luigi / Super Paper branch | 15 | Mario/Luigi RPG iterations, Mr. L and Bros. timing |

The 1981 *Donkey Kong*, 1983 *Mario Bros.*, *Dr. Mario*, Kart, sports, Maker,
Treasure Tracker, WarioWare and Wario's Woods candidates live in optional
5–10-stage Worlds or Arcade Hall cross-shelves. They do not get inserted into
unrelated Story stages merely to make the museum available sooner.

## 6. SMB1 code freeze

The code-writing agent may implement only this content before the five-stage
slice passes:

- fighters: Classic Mario, Luigi, Toad and Peach as provisional party records;
- enemies: Goomba, Koopa Troopa, Piranha Plant and Hammer Bro;
- encounters: authored SMB1 stages 1–5;
- items: Super Mushroom grant plus preview records for Fire Flower;
- Assist: Toadsworth preview plus one deterministic test activation;
- banner: non-spendable preview until all release gates are true.

After stage 5 feels good, schedule the remaining opening actors in primitive
batches rather than rarity order: shells/state actors, airborne actors,
grab/tether actors, then heavy/secondary-helper actors.

## 7. Acceptance before Mushroom is called finished

- all 22 numerical cards validate and share no accidental family conflicts;
- every card has a sprite-state checklist and provisional/approved label;
- the eight-record Power-Up and Assist pages validate but stay non-spendable
  until every displayed record has usable art and behavior;
- stages 1–5 run 90–150 seconds at their reference rank and show visible actor
  movement rather than menu-RPG exchanges;
- Mario stomp, Koopa shell, Yoshi tongue, Peach float, Luigi high jump,
  Bowser flame and Poltergust pull pass both headless and captured-strip tests;
- the management window explains exact stats, coefficients, triggers, family
  lock and asset status for every obtainable result;
- no museum-only candidate leaks into runtime or banner validation.
