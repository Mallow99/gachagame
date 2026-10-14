export const SAVE_VERSION = 4;
export const SAVE_KEY = 'pocketgacha.save.v4';
export const LEGACY_KEY = 'pocketgacha.save.v1';
export const FIRST_WORLD = 'super-mario-bros-1985';
export const KIRBY_WORLD = 'kirbys-adventure-1993';
export const ownership = (now = Date.now()) => ({ stars: 0, masteryRank: 1, masteryXp: 0, discoveredAt: now });
export const pity = () => ({ sinceSsr: 0, sinceSr: 0, totalPulls: 0, featuredGuarantee: false });
export const worldProgress = (threatSnapshot = 1, state = 'unlocked') => ({ state, threatSnapshot, highestStageCleared: 0, firstClearEncounterIds: [], masteryTier: 0 });
export function defaultSave(now = Date.now()) {
  return {
    saveVersion: 4, contentVersion: 3,
    profile: { createdAt: now, lastSeenAt: now, activePlaySeconds: 0, muted: true, stripHidden: false,
      tutorialsSeen: [], dismissedNotices: [], reducedMotion: false, audio: { music: 0.25, voice: 0.6, sfx: 0.35 }, fps: 30 },
    progression: { training: { rank: 1 }, atlas: { rank: 0, areaXp: 0, keys: 0 },
      orders: { storedFolders: [], patrolMarks: 0, lastFolderDate: '' },
      sorties: { dailyBonusDate: '', bonusClearsById: {}, discoveredWantedIds: [] },
      worlds: { [FIRST_WORLD]: worldProgress() }, availableWorldIds: [FIRST_WORLD], endlessUnlockedBySaga: { mario: false, kirby: false },
      hubWelcome: { mario: { pulls: 0, newSr: false }, kirby: { pulls: 0, newSr: false } },
    },
    collection: { units: { 'classic-mario': ownership(now) }, powerups: {}, assists: {}, legacyUnits: {} },
    loadouts: { activePresetId: 'mario-story', presets: { 'mario-story': { name: 'Mushroom Party', mode: 'story', sagaId: 'mario',
      unitIds: ['classic-mario'], rows: ['front'], powerupIds: [null], assistId: null } } },
    inventory: { coins: 300, starlight: 0, supplyTickets: 0, echoes: 0, materials: { techniqueNotes: 0 } },
    banners: { fighter: pity(), supply: pity(), mythic: { sinceUr: 0, totalPulls: 0, featuredGuarantee: false }, history: [], pendingReveal: null },
    content: { migrationsApplied: [], missingIds: [] },
    session: { worldId: FIRST_WORLD, encounterId: 'smb1-01', campId: null, mode: 'story', auto: false, seedCounter: 0, endlessRound:0, endlessBest:0,endlessThreatSnapshot:16,pendingBattleReward:null },
    telemetry: { clears: {}, totalWaves: 0, totalKills: 0, totalBosses: 0, totalAssists: 0, recentReports: [], rewardedRunIds: [] },
  };
}
