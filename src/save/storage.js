import { defaultSave, SAVE_KEY, LEGACY_KEY } from './default-save.js';
import { migrateSave } from './migrate.js';

export function loadSave(storage, now = Date.now()) {
  if (!storage) return { save: defaultSave(now), notice: '' };
  let raw;
  try {raw = storage.getItem(SAVE_KEY) || storage.getItem(LEGACY_KEY);}
  catch {return {save:defaultSave(now),volatile:true,notice:'Browser storage is unavailable. This session stays in memory; export a backup before closing.'};}
  if (!raw) return { save: defaultSave(now), notice: '' };
  try {
    const data = JSON.parse(raw);
    if (data.saveVersion !== 4) {
      storage.setItem(`pocketgacha.save.v3.backup.${now}`, raw);
      if (!storage.getItem('pocketgacha.save.v3.backup')) storage.setItem('pocketgacha.save.v3.backup', raw);
    }
    const save = migrateSave(data, now);
    return { save, notice: data.saveVersion === 4 ? '' : 'Save upgraded. Your currency, pity and prototype collection are backed up and preserved.' };
  } catch (error) {
    try { storage.setItem(`pocketgacha.save.recovery.${now}`, raw); } catch {}
    return { save: defaultSave(now), notice: `Save recovery: ${error.message} A raw backup was retained.`, recovery: raw };
  }
}
export function writeSave(storage, save, now = Date.now()) {
  save.profile.lastSeenAt = now;
  if (!storage) return;
  storage.setItem(SAVE_KEY, JSON.stringify(save));
}
