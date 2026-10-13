export const SAGAS = [
  { id: 'mario', name: 'Mario Saga', worldIds: ['super-mario-bros-1985'], productionStatus: 'slice' },
];

export const AREAS = [
  { id: 'smb1-overworld', worldId: 'super-mario-bros-1985', name: 'Mushroom Overworld', stageRange: [1, 5], encounterIds: ['smb1-01', 'smb1-02', 'smb1-03', 'smb1-04', 'smb1-05'], productionStatus: 'slice' },
  { id: 'smb1-high-roads', worldId: 'super-mario-bros-1985', name: 'High Roads', stageRange: [6, 10], encounterIds: [], productionStatus: 'planned' },
  { id: 'smb1-dark-world', worldId: 'super-mario-bros-1985', name: 'Dark World', stageRange: [11, 15], encounterIds: [], productionStatus: 'planned' },
];

export const WORLDS = [
  {
    id: 'super-mario-bros-1985', sagaId: 'mario', name: 'Super Mario Bros.', releaseYear: 1985, length: 15,
    areaIds: ['smb1-overworld', 'smb1-high-roads', 'smb1-dark-world'],
    atlas: { rankRequired: 0, prerequisiteWorldIds: [], keyCost: 0, keyReward: 1 },
    threat: { authoredMin: 1, authoredMax: 15 },
    bannerIds: ['smb1-overworld-fighter', 'smb1-overworld-supply'],
    implementedEncounterIds: ['smb1-01', 'smb1-02', 'smb1-03', 'smb1-04', 'smb1-05'],
    productionStatus: 'slice',
  },
];
