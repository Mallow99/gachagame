// First-slice production fighters. These records are not wired into the
// playable prototype until the later save/combat tickets migrate consumers.

export const UNITS = [
  {
    id: 'classic-mario', familyId: 'mario', sagaId: 'mario', sourceGameId: 'super-mario-bros-1985',
    name: 'Mario', title: 'Course One Classic', rarity: 'R', role: 'bruiser', rowPreference: 'front',
    traits: ['heroic', 'grounded'],
    baseStats: { hp: 1100, attack: 99, guard: 42, moveSpeed: 123, haste: 0, critChance: 0.08 },
    basic: { id: 'classic-stomp', behavior: 'stomp', coefficient: 1.15, intervalSeconds: 2.8, range: 300, targetRule: 'nearest', hitCount: 1, effects: [] },
    skill: { id: 'brick-break', cooldownSeconds: 10, behavior: 'stomp', coefficient: 1.2, targetRule: 'nearest', effects: [{ type: 'splash', coefficient: 0.35, radius: 54 }, { type: 'stagger', amount: 18 }] },
    passive: { id: 'coin-hunter', trigger: 'on-kill', effects: [{ type: 'reward-multiplier', currency: 'coins', value: 0.1 }] },
    ultimate: { id: 'course-clear', energyCost: 100, behavior: 'charge', targetRule: 'backmost', coefficient: 3.4, declaredTotalCoefficient: 5, declaredBasicActionEquivalents: 4.35, effects: [{ type: 'line-damage', coefficient: 1.6 }, { type: 'party-haste', value: 0.15, durationSeconds: 8 }] },
    acquisition: { type: 'hub-starter', sagaId: 'mario' }, artId: 'classic-mario-portrait', spriteId: 'classic-mario-battle', releaseId: 'smb1-prologue', productionStatus: 'provisional',
  },
  {
    id: 'classic-luigi', familyId: 'luigi', sagaId: 'mario', sourceGameId: 'super-mario-bros-1985',
    name: 'Luigi', title: 'High-Jump Hero', rarity: 'R', role: 'controller', rowPreference: 'front',
    traits: ['heroic', 'grounded', 'evasive'],
    baseStats: { hp: 980, attack: 94, guard: 36, moveSpeed: 132, haste: 0.03, critChance: 0.09 },
    basic: { id: 'high-jump-charge', behavior: 'charge', coefficient: 1.08, intervalSeconds: 2.65, range: 320, targetRule: 'nearest', hitCount: 1, effects: [{ type: 'slow', value: 0.12, durationSeconds: 2 }] },
    skill: { id: 'evasive-retreat', cooldownSeconds: 9, behavior: 'charge', coefficient: 0.9, targetRule: 'nearest', effects: [{ type: 'retreat', distance: 100 }] },
    passive: { id: 'green-momentum', trigger: 'after-move', effects: [{ type: 'guard', value: 0.08, durationSeconds: 2 }] },
    ultimate: { id: 'backline-bound', energyCost: 100, behavior: 'stomp', targetRule: 'backmost', coefficient: 2.2, declaredTotalCoefficient: 5.8, declaredBasicActionEquivalents: 5.37, effects: [{ type: 'multi-hit', count: 3, coefficient: 1.2 }, { type: 'splash', coefficient: 0.6, radius: 64 }] },
    acquisition: { type: 'fighter-banner' }, artId: 'classic-luigi-portrait', spriteId: 'classic-luigi-battle', releaseId: 'smb1-prologue', productionStatus: 'provisional',
  },
  {
    id: 'toad', familyId: 'toad', sagaId: 'mario', sourceGameId: 'super-mario-bros-1985',
    name: 'Toad', title: 'Castle Courier', rarity: 'R', role: 'striker', rowPreference: 'front',
    traits: ['heroic', 'grounded', 'retainer'],
    baseStats: { hp: 900, attack: 102, guard: 30, moveSpeed: 138, haste: 0.04, critChance: 0.12 },
    basic: { id: 'courier-combo', behavior: 'combo', coefficient: 0.4, intervalSeconds: 2.45, range: 64, targetRule: 'nearest', hitCount: 3, effects: [] },
    skill: { id: 'emergency-delivery', cooldownSeconds: 12, behavior: 'lob', coefficient: 0, targetRule: 'lowest-hp-ally', effects: [{ type: 'heal', coefficient: 0.6 }] },
    passive: { id: 'quick-feet', trigger: 'wave-start', effects: [{ type: 'haste', value: 0.08, durationSeconds: 6 }] },
    ultimate: { id: 'retainer-rush', energyCost: 100, behavior: 'combo', targetRule: 'lowest-hp', coefficient: 0.85, hitCount: 6, declaredTotalCoefficient: 6.3, declaredBasicActionEquivalents: 5.25, effects: [{ type: 'finisher', coefficient: 1.2 }, { type: 'retarget-on-defeat' }] },
    acquisition: { type: 'fighter-banner' }, artId: 'toad-portrait', spriteId: 'toad-battle', releaseId: 'smb1-prologue', productionStatus: 'provisional',
  },
  {
    id: 'princess-peach', familyId: 'peach', sagaId: 'mario', sourceGameId: 'super-mario-bros-1985',
    name: 'Princess Peach', title: 'Mushroom Kingdom Hope', rarity: 'R', role: 'support', rowPreference: 'back',
    traits: ['heroic', 'grounded', 'royal'],
    baseStats: { hp: 940, attack: 88, guard: 34, moveSpeed: 112, haste: 0, critChance: 0.07 },
    basic: { id: 'turnip-lob', behavior: 'lob', coefficient: 0.82, intervalSeconds: 2.9, range: 390, targetRule: 'nearest', hitCount: 1, effects: [{ type: 'splash', coefficient: 0.35, radius: 58 }] },
    skill: { id: 'royal-shield', cooldownSeconds: 11, behavior: 'lob', coefficient: 0, targetRule: 'lowest-hp-ally', effects: [{ type: 'shield', coefficient: 0.8 }] },
    passive: { id: 'gentle-recovery', trigger: 'wave-clear', effects: [{ type: 'heal-party', coefficient: 0.18 }] },
    ultimate: { id: 'princess-wish', energyCost: 100, behavior: 'lob', targetRule: 'party', coefficient: 0, declaredTotalCoefficient: 0, declaredBasicActionEquivalents: 4.5, effects: [{ type: 'cleanse-party', count: 1 }, { type: 'heal-party', coefficient: 2.2 }, { type: 'shield-party', coefficient: 1.5 }, { type: 'party-haste', value: 0.15, durationSeconds: 6 }] },
    acquisition: { type: 'fighter-banner' }, artId: 'princess-peach-portrait', spriteId: 'princess-peach-battle', releaseId: 'smb1-prologue', productionStatus: 'provisional',
  },
];
