# Data and save contracts

These are the implementation contracts for the first slice. They use ordinary
JavaScript modules and JSDoc-compatible objects because the repository has no
build step. JSON export and formal JSON Schema can be added after the records
stabilize; combat must not care which storage format supplied them.

## ID and version rules

- IDs are lowercase kebab-case and globally stable inside their namespace.
- IDs describe identity, not rarity or balance: `classic-mario`, not
  `r-mario-v1`.
- a unit's `familyId` is the identity lock (`mario`, `luigi`, `bowser`);
- `sourceGameId` is the title record (`super-mario-bros-1985`);
- display names, rarity, stats, filenames and release banners may change
  without changing the ID;
- saves contain content IDs and player state, never imported content objects;
- `contentVersion` changes when records or compatibility change;
- `saveVersion` changes only when serialized player structure changes.

## Runtime content index

```js
export const content = {
  units: new Map(),
  enemies: new Map(),
  powerups: new Map(),
  assists: new Map(),
  sagas: new Map(),
  worlds: new Map(),
  encounters: new Map(),
  banners: new Map(),
  missions: new Map(),
  sorties: new Map(),
};
```

Arrays may be used in source files for authoring, but they are indexed exactly
once. A lookup returns `undefined` for an unknown ID and the caller chooses an
explicit fallback. It must never silently substitute the first record.

The prototype calls `strike` behavior `melee`. During migration,
`LEGACY_BEHAVIOR_ALIASES = { melee: 'strike' }` is allowed only in the legacy
adapter/dev-fixture loader. New records, logs and Manual copy use `strike` so a
temporary implementation name does not become an eighth attack type.

## Unit contract

The stable mechanical record below is extended by `presentation` and
`animation` metadata in `13_HUBS_BANNERS_AND_PRESENTATION.md`. Shell, grab,
swallow, Copy and transform behaviors use declared effect/state vocabularies;
they must not be implemented as callbacks hidden inside content records.

```js
{
  id: 'classic-mario',
  familyId: 'mario',
  sagaId: 'mario',
  sourceGameId: 'super-mario-bros-1985',
  name: 'Mario',
  title: 'Course One Classic',
  rarity: 'R',                    // R | SR | SSR | UR
  role: 'bruiser',                // vanguard | bruiser | striker | artillery | controller | support
  rowPreference: 'front',         // front | back | either
  traits: ['heroic', 'grounded'],
  baseStats: {
    hp: 1100,
    attack: 99,
    guard: 42,
    moveSpeed: 123,
    haste: 0,
    critChance: 0.08,
  },
  basic: {
    id: 'classic-stomp',
    behavior: 'stomp',            // strike | shot | combo | charge | stomp | lob | beam
    coefficient: 1.15,
    intervalSeconds: 2.8,
    range: 300,
    targetRule: 'nearest',
    hitCount: 1,
    effects: [],
  },
  skill: {
    id: 'brick-break',
    cooldownSeconds: 10,
    behavior: 'stomp',
    coefficient: 1.2,
    targetRule: 'nearest',
    effects: [{ type: 'splash', coefficient: 0.35, radius: 54 },
              { type: 'stagger', amount: 18 }],
  },
  passive: {
    id: 'coin-hunter',
    trigger: 'on-kill',
    effects: [{ type: 'reward-multiplier', currency: 'coins', value: 0.10 }],
  },
  ultimate: {
    id: 'course-clear',
    energyCost: 100,
    behavior: 'charge',
    targetRule: 'backmost',
    coefficient: 3.4,
    declaredTotalCoefficient: 5,
    effects: [{ type: 'line-damage', coefficient: 1.6 },
              { type: 'party-haste', value: 0.15, durationSeconds: 8 }],
  },
  techniqueMasteryPolicyId: 'fighter-standard-v1',
  techniqueMasteryNodes: {
    4: { effect: 'passive-quality', id: 'coin-hunter-radius' },
    5: { effect: 'ultimate-potency', value: 0.25 },
  },
  acquisition: { type: 'hub-starter', sagaId: 'mario' },
  copyLibrary: undefined, // present only on Copy-capable Kirby versions
  artId: 'classic-mario-portrait',
  spriteId: 'classic-mario-battle',
  releaseId: 'smb1-prologue',
  productionStatus: 'provisional', // dev | provisional | approved
}
```

For today's stage, passive/skill/ultimate records may be parsed but visually
disabled behind a `COMING IN SLICE 2` stamp. The engine must not invent their
effects from display text.

## Power-Up and Assist contracts

Power-Ups are Hub-scoped, effect-only records. There is no unit compatibility
list.

```js
{
  id: 'fire-flower', sagaId: 'mario', name: 'Fire Flower', rarity: 'SR',
  grantedTrait: 'fire',
  statLean: { stat: 'rangedDamage', multiplier: 1.11 },
  proc: { trigger: 'every-nth-basic', count: 4,
          effects: [{ type: 'burn', durationSeconds: 5 }] },
  awakening: null,
  duplicatePolicyId: 'powerup-echoes-v1',
  artId: 'fire-flower-item', productionStatus: 'provisional'
}
```

UR `awakening` records use `after-first-ultimate`, `usesPerStage: 1`; they do
not spend fighter energy. Assists declare `sagaId`, `familyId`, a trigger,
bounded uses/cooldown, effects and `assist-five-rank-v1`. An Assist family may
not match an active fighter family. See plan `18` §§3–4.

## Enemy and boss contracts

```js
{
  id: 'goomba',
  sourceGameId: 'super-mario-bros-1985',
  name: 'Goomba',
  archetype: 'walker',
  size: 'small',
  traits: ['grounded'],
  baseStats: { hp: 420, attack: 42, guard: 5, moveSpeed: 78, haste: 0 },
  movement: { mode: 'approach', preferredRange: 35 },
  attacks: [{
    id: 'headbutt', behavior: 'strike', coefficient: 1,
    intervalSeconds: 3.4, range: 42, targetRule: 'nearest', effects: [],
  }],
  telegraphs: [],
  threatCost: 1,
  rewardWeight: 1,
  spriteId: 'goomba-battle',
  productionStatus: 'provisional',
}
```

A boss uses the same actor fields plus:

```js
{
  boss: {
    staggerMax: 100,
    staggerDurationSeconds: 6,
    controlResistance: 0.65,
    phases: [{
      id: 'paired-pattern',
      startsAtHpRatio: 1,
      attackIds: ['hammer-fan', 'high-jump'],
      environmentChanges: [],
    }, {
      id: 'survivor-enrage',
      startsWhen: 'partner-defeated',
      attackIds: ['hammer-fan', 'ground-pound'],
      modifiers: { haste: 0.25 },
    }],
  }
}
```

Boss phase conditions use a small declared vocabulary. No content record
contains executable callbacks.

## World, Area and encounter contracts

```js
{
  id: 'super-mario-bros-1985',
  sagaId: 'mario',
  name: 'Super Mario Bros.',
  releaseYear: 1985,
  length: 15,
  areaIds: ['smb1-overworld', 'smb1-high-roads', 'smb1-dark-world'],
  atlas: {
    rankRequired: 0,
    prerequisiteWorldIds: [],
    keyCost: 0,
    keyReward: 1,
  },
  threat: { authoredMin: 1, authoredMax: 15 },
  bannerIds: ['smb1-overworld-fighter', 'smb1-overworld-powerup-cache',
              'smb1-overworld-assist-call'],
  productionStatus: 'slice',
}
```

```js
{
  id: 'smb1-01',
  worldId: 'super-mario-bros-1985',
  localStage: 1,
  areaId: 'smb1-overworld',
  name: 'First Steps',
  recommendedTrainingRank: 1,
  environment: {
    sceneId: 'smb1-overworld-day',
    groundRule: 'flat',
    modifiers: [],
  },
  waves: [{
    id: 'w1',
    delaySeconds: 0,
    spawns: [
      { enemyId: 'goomba', count: 3, entry: 'right', spacing: 46 },
    ],
    clearRule: 'defeat-all',
  }],
  clearRules: { type: 'defeat-all-waves', timeLimitSeconds: null },
  rewards: {
    firstClear: [{ type: 'starlight', amount: 100 },
                 { type: 'coins', amount: 40 }],
    repeat: [{ type: 'coins', amount: 25 },
             { type: 'patrol-mark', amount: 1 }],
  },
  referenceTeams: [{
    id: 'starter-solo',
    acquisitionEnvelope: 'hub-starter',
    unitIds: ['classic-mario'],
    trainingRank: 1,
    stars: 0,
    powerupIds: [null],
    assistId: null,
    expected: { clearSeconds: [90, 150], winRate: [0.90, 1] },
  }],
  productionStatus: 'slice',
}
```

World length must equal the highest local stage and every Area contains five
consecutive stages. Short Worlds contain fewer Areas; they do not redefine an
Area's size.

## Banner contract

```js
{
  id: 'smb1-overworld-fighter',
  channel: 'fighter',             // fighter | supply | mythic
  lifecycle: 'progress',          // progress | archive | rotation
  unlock: { type: 'stage-clear', encounterId: 'smb1-01' },
  pool: [
    { itemId: 'classic-mario', rarity: 'R', weight: 1 },
    { itemId: 'classic-luigi', rarity: 'R', weight: 1 },
    { itemId: 'toad', rarity: 'R', weight: 1 },
    { itemId: 'princess-peach', rarity: 'R', weight: 1 },
    { itemId: 'koopa-troopa', rarity: 'R', weight: 1 },
    { itemId: 'hammer-bro', rarity: 'SR', weight: 1 },
    { itemId: 'bowser', rarity: 'SSR', weight: 1 },
  ],
  featured: [{ itemId: 'hammer-bro', shareOfRarity: 0.5 }],
  pityPolicyId: 'fighter-standard-v1',
  duplicatePolicyId: 'fighter-stars-v1',
  archiveBannerId: 'mario-saga-fighter-archive',
  releaseGate: null, // Archives use { minimumLivePool, minimumByRarity }
  growthGates: [],   // e.g. [{ beforeRegionalPull: 40, minimumLivePool: 28 }]
}
```

Pity belongs to the channel policy, not an individual temporary banner. Moving
content to an Archive must not reset or strand pity.

The finished Mushroom Archive declares
`releaseGate: { minimumLivePool: 22, minimumByRarity: { R: 10, SR: 7, SSR: 5 } }`;
Dream Land declares `22` and `{ R: 8, SR: 9, SSR: 5 }`. Preview catalogs do not
count toward these fields. Development may bypass the gate only with an
explicit non-spendable test-pull mode that cannot alter the production save.
Mushroom and Dream Land additionally declare pull-40 growth floors of 28 and
26 normal fighters.

## Mission and Sortie contracts

```js
{
  id: 'order-clear-waves',
  cadence: 'daily-folder',        // daily-folder | repeatable | milestone
  objective: { type: 'clear-waves', count: 20, modeIds: ['story', 'camp', 'sortie'] },
  eligibility: { solutionPolicy: 'owned-any', requiredTags: [] },
  rewards: [{ type: 'starlight', amount: 75 },
            { type: 'coins', amount: 100 }],
  fallbackMissionId: 'order-clear-waves-basic',
}
```

```js
{
  id: 'smb1-assist-study',
  worldId: 'super-mario-bros-1985',
  category: 'assist-proficiency',
  unlock: { type: 'stage-clear', encounterId: 'smb1-05' },
  encounterId: 'smb1-sortie-assist-01',
  rewards: {
    firstDailyClears: 3,
    bonus: [{ type: 'assist-xp-equipped', amount: 40 },
            { type: 'supply-ticket', amount: 1 }],
    repeatProfileId: 'sortie-standard-v1',
  },
  autoRepeatAfterFirstClear: true,
}
```

Mission objectives use a declared vocabulary: `clear-waves`, `clear-stage`,
`deploy-role`, `equip-supply`, `trigger-assist`, `defeat-boss`,
`defeat-wanted`, `clear-distinct-camps` and `clear-sortie`. Generation validates
against the live collection; it never embeds executable predicates.

XP rewards name their destination and apply immediately. Fighter Mastery XP and
Assist Proficiency XP are progression values, not inventory items. Universal
Technique Notes are the explicit exception: they live in `materials` until the
player applies them to any owned fighter. A Wanted Hunt is a Sortie record
referencing an encountered enemy/miniboss variant and a Manual discovery entry.

## SaveV4

```js
{
  saveVersion: 4,
  contentVersion: 2,
  profile: {
    createdAt: 0,
    lastSeenAt: 0,
    activePlaySeconds: 0,
    muted: true,
    stripHidden: false,
    tutorialsSeen: [],
    dismissedNotices: [],
  },
  progression: {
    training: { rank: 1 },
    atlas: { rank: 0, areaXp: 0, keys: 0 },
    orders: { storedFolders: [], patrolMarks: 0 },
    sorties: { dailyBonusDate: '', bonusClearsById: {}, discoveredWantedIds: [] },
    worlds: {
      'super-mario-bros-1985': {
        state: 'unlocked',        // locked | available | unlocked | complete
        threatSnapshot: 1,
        highestStageCleared: 0,
        firstClearEncounterIds: [],
        masteryTier: 0,
      },
    },
    availableWorldIds: ['super-mario-bros-1985'],
    endlessUnlockedBySaga: { mario: false },
  },
  collection: {
    units: {
      'classic-mario': { stars: 0, masteryRank: 1, masteryXp: 0, discoveredAt: 0 },
    },
    powerups: {}, // { [powerupId]: { discoveredAt } }; duplicates become Echoes
    assists: {}, // { [assistId]: { proficiencyRank, proficiencyXp, discoveredAt } }
    legacyUnits: {},
  },
  loadouts: {
    activePresetId: 'preset-1',
    presets: {
      'preset-1': {
        name: 'Main Party',
        mode: 'story',
        unitIds: ['classic-mario'],
        rows: ['front'],
        powerupIds: [null],
        assistId: null,
      },
    },
  },
  inventory: {
    coins: 300,
    starlight: 0,
    supplyTickets: 0,
    echoes: 0,
    materials: { techniqueNotes: 0 },
  },
  banners: {
    fighter: { sinceSsr: 0, sinceSr: 0, totalPulls: 0, featuredGuarantee: false },
    supply: { sinceSsr: 0, sinceSr: 0, totalPulls: 0, featuredGuarantee: false },
    mythic: { sinceUr: 0, totalPulls: 0, featuredGuarantee: false },
    history: [],
  },
  content: {
    migrationsApplied: [],
    missingIds: [],
  },
}
```

## v3 → v4 migration table

| v3 field | v4 destination | Rule |
| --- | --- | --- |
| `gems` | `inventory.starlight` | preserve 1:1 |
| `gold` | `inventory.coins` | preserve 1:1 |
| `pitySsr`, `pitySr`, `totalPulls` | `banners.fighter` | preserve counters within new caps |
| `muted`, `lastSeen`, `lastDaily` | `profile` | preserve; daily marker becomes notice metadata |
| owned `lvl` | `progression.training.rank` | median owned level, floor, clamp 1–10 |
| owned `asc` | `collection.legacyUnits` | preserve exact values for fixtures |
| `party` | legacy preset only | do not expose unapproved fixtures to a new authored party |
| `stage` | legacy World progress note | do not convert into SMB1 clears |

Every migration clones input, applies once, validates output and preserves a raw
backup under `pocketgacha.save.v3.backup`. A failed migration loads a fresh v4
save only after keeping the backup and displaying a recoverable warning.

## Combat event log

Deterministic simulation and the Manual use a shared append-only event shape:

```js
{
  sequence: 42,
  atMs: 13850,
  type: 'damage',
  sourceId: 'classic-mario#0',
  targetId: 'goomba#2',
  abilityId: 'classic-stomp',
  values: { raw: 112, mitigated: 8, final: 104, crit: false },
  tags: ['stomp'],
}
```

Allowed initial event types are `spawn`, `move-state`, `action-ready`,
`action-start`, `damage`, `heal`, `status-add`, `status-remove`, `stagger`,
`knockout`, `wave-clear`, `reward` and `battle-end`. Rendering may skip events;
simulation may not depend on animation callbacks to complete them.

## Validation invariants

The content validator must reject:

- duplicate IDs within a namespace;
- a missing saga, World, Area, enemy, unit, banner or asset reference;
- illegal rarity, behavior, role, target rule or production state;
- World length outside 5/10/15/20/25 or an Area not exactly five stages;
- duplicate/missing local stage numbers;
- an obtainable unit with no family ID;
- an encounter with fewer than 1 or more than 8 waves;
- a wave with no spawns or an unknown clear rule;
- a negative reward, coefficient, interval or stat;
- an ordinary story reference team containing UR or unavailable content;
- an Archive destination that points back to itself;
- a content-ready regional Archive below its declared `minimumLivePool` or
  rarity-floor counts while real Archive pulls are enabled;
- a boss without a stagger rule or phase;
- an Order with no legal fallback or an exact-unit requirement;
- a Sortie that awards Atlas Rank/Keys or references an unshipped encounter;
- XP whose destination type is missing from the save contract;
- production-facing content marked `dev`.

Warnings, rather than errors, cover provisional art, missing optional sound,
unusually long estimated combat and a title with no UR candidate.
