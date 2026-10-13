// Presentation shells only. Pools arrive with their dedicated banner tickets;
// empty preview pools prevent unimplemented fighters or Supply from leaking in.
export const BANNERS = [
  {
    id: 'smb1-overworld-fighter', channel: 'fighter', lifecycle: 'progress',
    unlock: { type: 'stage-clear', encounterId: 'smb1-05' }, pool: [], featured: [],
    pityPolicyId: 'fighter-standard-v1', duplicatePolicyId: 'fighter-stars-v1',
    archiveBannerId: null, availability: 'preview', productionStatus: 'slice',
  },
  {
    id: 'smb1-overworld-supply', channel: 'supply', lifecycle: 'progress',
    unlock: { type: 'stage-clear', encounterId: 'smb1-03' }, pool: [], featured: [],
    pityPolicyId: 'supply-standard-v1', duplicatePolicyId: 'supply-stars-v1',
    archiveBannerId: null, availability: 'preview', productionStatus: 'slice',
  },
];
