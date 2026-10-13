# Hubs, banners and presentation addendum

Status: **definitive addendum v1, 2026-10-13**

This document resolves the apparent conflict between region-based exploration
and game-by-game Worlds. It also defines what a finished summon, result card
and battle actor must contain. Where it conflicts with earlier language about
characters waiting for their source World, this document wins.

## 1. The hybrid structure

**LOCKED:** stages are title-specific; collection is franchise-wide.

```text
Library
└── Hub / Saga                           player-facing destination
    ├── Saga Archive                    every released fighter in that Saga
    ├── Super Mario Bros.               title-specific World/campaign
    │   └── three five-stage Areas
    ├── Super Mario Bros. 3             later title-specific World
    └── Super Mario 64                  later title-specific World
```

The existing `Saga` record remains the stable data object. The Atlas may render
it as a more evocative **Hub**—Mushroom Kingdom, Dream Land, Hyrule, 20XX or
Arcade Hall—without adding another save hierarchy. This keeps the committed
schema stable while giving the player the region feeling requested.

- A **World** owns story stages, environments, enemy vocabulary, bosses,
  encounter mechanics and a source-game visual treatment.
- A **Saga Archive** owns the permanent collection pool for already released
  fighters from that franchise, even when their source World is not yet built.
- A **World Spotlight** focuses characters and Supply tied to the current game.
- A fighter always declares `sourceGameId`, `familyId`, visual treatment and
  kit references. Releasing it early does not pretend it came from SMB1.
- A crossover party can enter any World. Story authenticity applies to the
  World and its enemies, not to the player's four-person team.

This means the first Mushroom Kingdom section can offer Classic Mario and a
later Mario iteration without putting Mario 64 enemies into an SMB1 stage.
When the Mario 64 World eventually ships, that iteration receives a focused
rerun and its most compatible Power-Ups; ownership is never reset.

### 1.1 Naming examples

| Data Saga | Atlas/collection Hub | Example Worlds |
| --- | --- | --- |
| `mario` | Mushroom Kingdom | SMB1, SMB3, Super Mario World, Mario 64, Luigi's Mansion |
| `kirby` | Dream Land | Kirby's Adventure, Kirby Super Star, Amazing Mirror |
| `zelda` | Hyrule | Zelda 1, A Link to the Past, Minish Cap |
| `mega-man` | 20XX | Mega Man 1, Mega Man 2, Mega Man X |
| `arcade` | Arcade Hall | Pac-Man, Donkey Kong, Dig Dug |

“Hub” is intentionally flexible. It can be a place, era, collection shelf or
machine room; the system does not force every franchise into literal geography.

## 2. Release is separate from campaign production

The old rule “a character waits for its World” is replaced by a stricter but
more useful rule:

> A fighter can release before its source World only when its complete kit,
> battle sprite, result art and provenance pass the same asset gate it would
> have passed with that World.

This makes early favorites possible without turning the Archive into a list of
static placeholders. A silhouette may advertise a candidate, but it is not in
the pull table until production-ready.

### 2.1 Opening Mario banner set

After stage 5, the Summon Ledger exposes two Fighter pages:

1. **Overworld Spotlight** — the compact SMB1 pool already specified, with
   Hammer Bro focus and Bowser as its SSR.
2. **Mushroom Kingdom Archive** — every production-ready Mario Saga fighter.
   Its first expansion targets Yoshi and Mario 64 so a second Mario iteration
   and a mechanically expressive favorite are available during the opening
   World rather than many campaigns later.

The player may spend the first ten-pull on either page. The beginner guarantee
is data-driven per banner:

- no natural SSR result is ever replaced;
- if the ten-pull has no new SR or better, the Spotlight inserts Hammer Bro;
- the Archive inserts one of its owned-check-safe welcome SRs, initially
  Hammer Bro or Yoshi;
- if neither welcome SR has production-ready assets, the Archive remains
  visible for inspection but cannot accept the beginner ten-pull.

This changes pool availability, not the existing rarity rates or channel pity.

### 2.2 Archive growth

- New release batches append to the permanent Saga Archive.
- A later World Spotlight improves focus odds; it does not create a second copy
  of the same fighter record.
- Planned characters appear only in a clearly labeled preview catalog and have
  no rate until approved.
- Archives can become large. Once a Saga exceeds 18 fighters, its Archive adds
  rotating focus shelves or selectors while retaining the complete rate table.
- An iteration's source World is a card filter and provenance field, not an
  ownership prerequisite.

## 3. Fighter iteration test

A separate fighter iteration is justified only when all four answers are yes:

1. Does it move or fight differently before equipment is considered?
2. Can a player identify the source iteration from its silhouette or motion?
3. Can it support a complete basic, skill, passive and ultimate without
   borrowing an ordinary temporary power-up as its entire identity?
4. Is the animation burden credible enough to clear the asset gate?

Mario 64 passes: punches, kicks, triple jump, dive and ground pound form a
complete moveset. Fire Mario normally fails: the Fire Flower can modify several
Mario iterations. Paper Mario, Sunshine Mario and Cappy Mario pass. A palette
swap does not.

Every iteration shares its identity `familyId`; only one can deploy in a party.
Different Yoshi colors may become fighters only when the kit differs, not just
the hue. Otherwise color is a cosmetic or a Power-Up treatment.

## 4. Three distinct pieces of summon art

**LOCKED:** banner, summon animation and result reveal are not the same image.

| Layer | Purpose | Required treatment |
| --- | --- | --- |
| Banner key art | sells the fantasy and shows several possible results | group/environment composition, rates and focus readable over it |
| Summon route | creates suspense without identifying the result | Hub-specific object and journey: Super Star, Warp Star, capsule, cartridge, etc. |
| Result splash/card | celebrates one exact fighter | cohesive hero image, source effects, face crop and card crop |

The result splash is reused for profile, collection detail and tall ten-pull
card crops. The banner may use separate approved key art or a deliberately
authored multi-character composition. It may not merely enlarge the featured
fighter's result splash.

## 5. Summon ceremony

The production ceremony is an in-application management view. A website demo
can remain a reference, but the game does not send the player to a browser.

### 5.1 Shared draw

One pull and ten-pulls begin with the same Hub-specific draw:

1. **Commit, 0.0–0.5 s:** the ledger stamp lands and currency visibly leaves.
2. **Departure, 0.5–2.0 s:** the summon object launches from the manual page.
3. **Flight, 2.0–4.2 s:** speed, particles and music build. The best rarity is
   hinted but not fully disclosed.
4. **Upgrade chance, 3.2–4.2 s:** color can fracture upward once so a gold/UR
   result can surprise rather than being known from frame one.
5. **Impact, 4.2–4.8 s:** object reaches the Hub, screen flashes, results begin.

Trial rarity language: R blue-white, SR violet, SSR gold, UR prismatic. Color is
reinforced by shape, label and sound so color vision is never required.

### 5.2 Per-result treatment

| Rarity | Target duration | Treatment |
| --- | ---: | --- |
| R | 1.0–1.8 s | silhouette wipe, name/title/card, one signature sound |
| SR | 2.2–3.5 s | emblem break, signature motion, fuller card and stars |
| SSR | 6–10 s | hard blackout, typed quote + voice, musical sting, detail/silhouette, full splash, separate **S / S / R** impacts |
| UR | 10–14 s | SSR sequence plus unique transformation/world event and separate **U / R** seal |

The rare blackout contains only the quote. Do not print the speaker beneath it;
the uncertainty is part of the reveal. The quote completes even when audio is
muted, voice subtitles are enabled by default, and a missing licensed voice
clip never blocks the fighter.

SSR/UR splashes use restrained parallax, layered particles or a short authored
motion pass. A pasted cutout over an unrelated background fails the art gate.
Depth effects must be checked for edge tearing at the actual management-window
size; an unwarped pan/zoom is better than visibly broken displacement.

### 5.3 Ten-pull flow

- one shared draw animation, colored by the best result only near impact;
- R cards can settle quickly into the result rail;
- SR steps forward with its short treatment;
- each SSR/UR receives its complete ceremony in result order;
- `Skip` jumps to a keyboard-readable results grid without changing RNG;
- tapping a revealed card opens its complete fighter card;
- duplicates show `NEW` or star/Echo conversion only after the identity reveal;
- no result is generated during animation. The committed outcome and updated
  pity are saved before presentation begins, making a crash or skip harmless.

Reduced-motion mode replaces flight/parallax/shake with fades and still keeps
quote, rarity and result timing legible. A master mute, music/voice/SFX sliders,
replay ceremony button and summon-history ledger are required before polish is
called finished.

## 6. Finished fighter card

The card is not flavor text over a power number. It is the player's contract
for what the unit does.

### Front

- result splash, rarity, name and unique title;
- source game and release year;
- role, row preference and primary attack behavior;
- family lock warning where relevant;
- displayed HP, Attack, Guard, Move, Haste and Crit at current Training Rank;
- `Already trained to Rank N` for a new acquisition;
- stars, mastery and equipped Power-Up.

### Kit page

- basic, skill, passive and ultimate names;
- exact coefficient, interval/cooldown, energy, duration and target rule;
- plain-language explanation before formula details;
- interaction rules such as `small enemies can be swallowed; bosses cannot`;
- compatible Power-Up categories and Assist hooks;
- 2–4 second in-engine preview clip for the signature behavior when available.

### Identity / production page

- one-sentence character fantasy and combat job;
- source sprite treatment and any additional games referenced by the kit;
- summon quote, voice/theme status and visual effect motif;
- art and sprite credits/provenance link;
- production badge visible in developer builds: `dev`, `provisional`, or
  `approved`.

The card never says only `Deals massive damage`. It states enough for the owner
to predict who acts, where they move and why a team succeeds.

## 7. Behavior-first actor contract

The generic animation list in `05_ASSET_PIPELINE.md` is necessary but not
sufficient. Every fighter and meaningful enemy now declares five signatures:

```text
movementSignature     how it crosses the strip
basicSignature        recognizable ordinary attack
skillSignature        authored behavior/state change
hitDefeatSignature    reaction and knockout language
interactionSignature  special relationship with actors or the arena
```

Examples:

- Mario uses a real rise, apex, fall, contact and rebound—not a sprite tweened
  diagonally through a target.
- Luigi's jump has a higher apex, longer hang time and less tidy landing.
- Peach can float to extend descent and uses her dress/umbrella silhouette.
- Goomba compresses flat on a stomp/KO, holds for readability, then clears.
- Koopa loses its walking body into a persistent shell state; a later hit can
  kick the shell through other enemies.
- Yoshi's tongue extends, connects, retracts with its target, and resolves into
  swallow/egg or boss stagger instead of a generic ranged hit.
- Bowser visibly inhales, braces and sweeps fire; flame damage cannot originate
  from an idle frame.
- Kirby's inhale pulls eligible targets and projectiles, stores or copies a
  declared ability, and visibly changes state.

These are gameplay events synchronized to animation markers. They are not VFX
that play after the damage has already happened invisibly.

### 7.1 Production acceptance

A playable actor passes only when:

- its feet/pivot remain stable at 1× and 2× scale;
- movement, windup, hit frame and recovery correspond to logged combat events;
- the signature remains readable at the normal strip height;
- hit flash, shadow and particles do not erase the source sprite;
- KO/retreat cannot be mistaken for an idle actor;
- a ten-minute soak produces no stuck airborne, shell, swallow, transform or
  off-screen state;
- reduced effects still communicate every mechanically important state.

## 8. Sprite source policy, including Rivals of Aether

Source priority is:

1. source-game or official remake sheets with the needed actions;
2. official crossover/fighting-game sprites that genuinely cover the kit;
3. creator-approved fan sheets or commissioned/custom additions;
4. reconstruction from a credible partial sheet;
5. a temporary procedural placeholder, never mislabeled as final.

Rivals of Aether and Workshop sheets can be excellent motion references and
may provide unusually complete combat actions. They are not a blanket free
asset library. Each candidate still needs creator, page URL, permission/license,
hash, original game/Workshop attribution and redistribution status recorded.
If permission is unclear, use it only as a private prototype/reference or seek
another route. Rivals-scale proportions also need an in-engine contact sheet;
do not distort a sheet simply to match NES actor height.

Mixed sprite eras are a feature of the crossover party. Consistency comes from
integer scaling, ground anchors, readable shadows, effect palette and UI—not
from blurring every character into one artificial style.

## 9. Data additions

These fields extend rather than replace the stable unit/banner contracts:

```js
unit.presentation = {
  fantasy: 'one-sentence job',
  quote: '...',
  voiceAssetId: null,
  themeAssetId: null,
  effectMotif: 'brick-dust',
  cardArtId: '...',
  resultSplashId: '...',
  kitReferenceGameIds: ['...'],
};

unit.animation = {
  movementSignature: 'high-jump',
  basicSignature: 'stomp-bounce',
  skillSignature: '...',
  hitDefeatSignature: '...',
  interactionSignature: '...',
  acceptanceIds: ['...'],
};

banner.presentation = {
  hubId: 'mushroom-kingdom',
  keyArtId: '...',
  summonRouteId: 'super-star-flight',
  musicAssetId: '...',
};

banner.beginnerGuarantee = {
  pullCount: 10,
  condition: 'no-new-sr-or-better',
  replacementPool: ['hammer-bro', 'yoshi-smw'],
};
```

Exact mechanical interactions such as shell, swallow and copy use declared
effect/state vocabularies in content data; records must not embed executable
callbacks. `sourceGameId` describes the principal iteration and art source.
`kitReferenceGameIds` honestly records canonical behaviors borrowed from other
appearances when a classic visual treatment alone does not supply a full kit.

## 10. Immediate implementation boundary

This addendum does not pull all Mario/Kirby art into the current five-stage
engine milestone. The next code sequence remains:

1. finish deterministic movement/combat and the real four-person free party;
2. implement Goomba flatten and Koopa shell state in stages 1–2;
3. finish the five SMB1 encounters and strip/Manual acceptance;
4. port the in-application summon route and result-card schema;
5. produce Yoshi and Mario 64 as the first regional Archive expansion;
6. begin Kirby only after the copy-state design has a test harness.

The detailed roster in `14_MARIO_KIRBY_CHARACTER_BIBLE.md` is a specification
queue, not permission to substitute breadth for a finished opening slice.

## 11. Decision audit

| Question | Result |
| --- | --- |
| Does a region-only campaign preserve recognizable games? | No. Mixed enemies and locations weaken source identity, so Worlds remain title-specific. |
| Does strict game-order character release surface favorites soon enough? | No. It can postpone iconic iterations for dozens of campaigns, so the Saga Archive may release approved fighters early. |
| Can early cross-title fighters corrupt SMB1? | Not when separation is enforced: source-game cards and party crossover are allowed; SMB1 encounter actors/backgrounds remain SMB1. |
| Does this require a save/schema rewrite? | No. Existing Saga is the Hub record and World remains the campaign. Presentation fields extend stable unit/banner IDs. |
| Will the Archive become unusably diluted? | Not immediately. At 18 fighters it gains focus shelves/selectors without deleting the complete pool or pity. |
| Do complex signature kits become one-off engine debt? | Not if implemented through the shared primitives in the character bible: arcs, persistent actors, grabs, substates, profile swap and transforms. |
| Does the new roster derail today's build? | No. Yoshi/Mario 64 begin only after the five-stage acceptance gate; Kirby begins after their reusable state primitives exist. |
| Is Rivals of Aether a reliable automatic source? | No. It is a candidate/reference route that still needs creator rights, provenance and style review. |
| Does rarity still feel meaningful? | Yes. R/SR reveal quickly; SSR/UR receive the blackout/quote ceremony and visibly stronger kit budgets. |

Remaining **TRIAL** decisions belong to play/asset evidence, not more abstract
planning: the exact day-one Archive pool after sprite review, individual
coefficients after simulation, whether Mario 64 has an acceptable approved 2D
treatment, voice/theme availability, and the one-Mythic-slot rule after two URs
exist. None requires changing the Hub/World structure.
