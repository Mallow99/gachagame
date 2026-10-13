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
    return isSaveV3Shape(data) ? data : null;
  } catch {
    return null;
  }
}

function isSaveV3Shape(data) {
  if (!isRecord(data) || !isRecord(data.owned) || !Array.isArray(data.party)) return false;
  if (data.saveVersion !== undefined && (!Number.isInteger(data.saveVersion) || data.saveVersion < 0 || data.saveVersion > SAVE_VERSION)) return false;
  for (const key of ['gems', 'gold', 'pitySsr', 'pitySr', 'totalPulls', 'lastSeen']) {
    if (data[key] !== undefined && (!Number.isFinite(data[key]) || data[key] < 0)) return false;
  }
  if (data.stage !== undefined && (!Number.isFinite(data.stage) || data.stage < 1)) return false;
  if (data.muted !== undefined && typeof data.muted !== 'boolean') return false;
  if (data.lastDaily !== undefined && typeof data.lastDaily !== 'string') return false;
  if (!data.party.every((id) => typeof id === 'string')) return false;
  for (const [id, owned] of Object.entries(data.owned)) {
    if (!id || !isRecord(owned)) return false;
    if (owned.lvl !== undefined && (!Number.isFinite(owned.lvl) || owned.lvl < 1)) return false;
    if (owned.asc !== undefined && (!Number.isFinite(owned.asc) || owned.asc < 0)) return false;
  }
  return true;
}

function isRecord(value) {
  return value !== null && typeof value === 'object' && !Array.isArray(value);
}
