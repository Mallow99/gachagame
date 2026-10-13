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
    coefficient: 1.8,
    effects: [{ type: 'party-haste', value: 0.15, durationSeconds: 8 }],
  },
  powerupCompatibility: ['mushroom', 'flower', 'star'],
  artId: 'classic-mario-portrait',
  spriteId: 'classic-mario-battle',
  releaseId: 'smb1-prologue',
  productionStatus: 'provisional', // dev | provisional | approved
}
```

For today's stage, passive/skill/ultimate records may be parsed but visually
disabled behind a `COMING IN SLICE 2` stamp. The engine must not invent their
effects from display text.

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
  bannerIds: ['smb1-fighter-archive', 'smb1-supply-archive'],
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
    firstClear: [{ type: 'starlight', amount: 60 },
                 { type: 'coins', amount: 40 }],
    repeat: [{ type: 'coins', amount: 25 }],
  },
  referenceTeams: [{
    id: 'free-rank-1',
    unitIds: ['classic-mario', 'classic-luigi', 'toad', 'princess-peach'],
    trainingRank: 1,
    stars: 0,
    powerupIds: ['super-mushroom', null, null, null],
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
  unlock: { type: 'stage-clear', encounterId: 'smb1-05' },
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
}
```

Pity belongs to the channel policy, not an individual temporary banner. Moving
content to an Archive must not reset or strand pity.

## SaveV4

```js
{
  saveVersion: 4,
  contentVersion: 1,
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
  },
  collection: {
    units: {
      'classic-mario': { stars: 0, masteryXp: 0, discoveredAt: 0 },
    },
    powerups: {},
    assists: {},
    legacyUnits: {},
  },
  loadouts: {
    activePresetId: 'preset-1',
    presets: {
      'preset-1': {
        name: 'Main Party',
        unitIds: ['classic-mario', 'classic-luigi', 'toad', 'princess-peach'],
        rows: ['front', 'front', 'front', 'back'],
        powerupIds: [null, null, null, null],
        assistId: null,
      },
    },
  },
  inventory: {
    coins: 300,
    starlight: 0,
    supplyTickets: 0,
    echoes: 0,
    materials: {},
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
- a boss without a stagger rule or phase;
- production-facing content marked `dev`.

Warnings, rather than errors, cover provisional art, missing optional sound,
unusually long estimated combat and a title with no UR candidate.
