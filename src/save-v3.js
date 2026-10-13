// Pure SaveV3 parsing and serialization. Keeping this module free of browser
// globals lets compatibility tests run without Electron, a DOM or storage.

export const SAVE_KEY = 'pocketgacha.save.v1';
export const SAVE_VERSION = 3;

export function toSaveV3(state, lastSeen = Date.now()) {
  return {
    saveVersion: SAVE_VERSION,
    gems: state.gems,
    gold: state.gold,
    pitySsr: state.pitySsr,
    pitySr: state.pitySr,
    stage: state.stage,
    owned: state.owned,
    party: state.party,
    totalPulls: state.totalPulls,
    muted: state.muted,
    lastSeen,
    lastDaily: state.lastDaily,
  };
}

export function serializeSaveV3(state, lastSeen = Date.now()) {
  return JSON.stringify(toSaveV3(state, lastSeen));
}

export function parseSaveV3(raw) {
  if (typeof raw !== 'string' || raw.length === 0) return null;
  try {
    const data = JSON.parse(raw);
    return data && typeof data === 'object' && !Array.isArray(data) ? data : null;
  } catch {
    return null;
  }
}
