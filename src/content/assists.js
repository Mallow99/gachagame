// Party-wide supporting characters. An Assist briefly enters, resolves its
// authored intervention and leaves; it never occupies a fifth fighter slot.

import { EXTRA_ASSISTS } from './opening-supply.js';
export const ASSISTS = [
  {
    id: 'toadsworth-tea-service', sagaId: 'mario', familyId: 'toadsworth',
    name: 'Toadsworth', title: 'Tea Service', rarity: 'R',
    trigger: { type: 'ally-below-hp', hpRatio: 0.3, cooldownSeconds: 30, usesPerWave: 1 },
    effects: [{ type: 'heal', coefficient: 0.65, targetRule: 'lowest-hp-ally' }],
    proficiencyPolicyId: 'assist-five-rank-v1', artId: 'toadsworth-assist-card', animationId: 'toadsworth-tea-entry', productionStatus: 'planned',
  },
  {
    id: 'sprixie-wave-blessing', sagaId: 'mario', familyId: 'sprixie-princess',
    name: 'Sprixie Princess', title: 'Wave Blessing', rarity: 'R',
    trigger: { type: 'wave-clear', cooldownSeconds: 0, usesPerStage: 4 },
    effects: [{ type: 'party-energy', amount: 5 }],
    proficiencyPolicyId: 'assist-five-rank-v1', artId: 'sprixie-assist-card', animationId: 'sprixie-wave-entry', productionStatus: 'planned',
  },
  {
    id: 'pianta-lifeguard-rescue', sagaId: 'mario', familyId: 'pianta-lifeguard',
    name: 'Pianta Lifeguard', title: 'Hazard Rescue', rarity: 'R',
    trigger: { type: 'ally-in-ground-hazard', cooldownSeconds: 24, usesPerStage: 2 },
    effects: [{ type: 'clear-nearest-ground-hazard' }, { type: 'heal', coefficient: 0.35, targetRule: 'triggering-ally' }],
    proficiencyPolicyId: 'assist-five-rank-v1', artId: 'pianta-lifeguard-assist-card', animationId: 'pianta-rescue-entry', productionStatus: 'planned',
  },
  {
    id: 'e-gadd-field-notes', sagaId: 'mario', familyId: 'e-gadd',
    name: 'Professor E. Gadd', title: 'Field Notes', rarity: 'SR',
    trigger: { type: 'boss-phase-start', cooldownSeconds: 30, usesPerStage: 2 },
    effects: [{ type: 'reveal-weakness', durationSeconds: 12 }, { type: 'boss-stagger', amount: 20 }],
    proficiencyPolicyId: 'assist-five-rank-v1', artId: 'e-gadd-assist-card', animationId: 'e-gadd-scan-entry', productionStatus: 'planned',
  },
  {
    id: 'tiara-projectile-catch', sagaId: 'mario', familyId: 'tiara',
    name: 'Tiara', title: 'Royal Catch', rarity: 'SR',
    trigger: { type: 'marked-projectile', cooldownSeconds: 20, usesPerStage: 3 },
    effects: [{ type: 'destroy-triggering-projectile' }, { type: 'shield-row', row: 'back', coefficient: 0.7 }],
    proficiencyPolicyId: 'assist-five-rank-v1', artId: 'tiara-assist-card', animationId: 'tiara-catch-entry', productionStatus: 'planned',
  },
  {
    id: 'lubba-emergency-orbit', sagaId: 'mario', familyId: 'lubba',
    name: 'Lubba', title: 'Emergency Orbit', rarity: 'SSR',
    trigger: { type: 'ally-lethal-telegraph', cooldownSeconds: 60, usesPerStage: 1 },
    effects: [{ type: 'rescue-lowest-hp-ally' }, { type: 'heal', coefficient: 1.1, targetRule: 'lowest-hp-ally' }, { type: 'energy', amount: 20, targetRule: 'lowest-hp-ally' }],
    proficiencyPolicyId: 'assist-five-rank-v1', artId: 'lubba-assist-card', animationId: 'lubba-orbit-entry', productionStatus: 'planned',
  },
];
ASSISTS.push(...EXTRA_ASSISTS);
for (const assist of ASSISTS) if (assist.id!=='pianta-lifeguard-rescue') {assist.productionStatus='provisional';assist.usable=true;}
ASSISTS.find(a=>a.id==='toadsworth-tea-service').effects[0].coefficient=1.2;
ASSISTS.find(a=>a.id==='toadsworth-tea-service').effects.push({type:'cleanse-slow',targetRule:'lowest-hp-ally'});
ASSISTS.find(a=>a.id==='sprixie-wave-blessing').effects.push({type:'shield-party',coefficient:.35});
for(const [id,key]of [['kabu','kabu'],['whispy-woods-page','whispy'],['kracko-page','kracko']])ASSISTS.find(a=>a.id===id).spriteKey=key;
ASSISTS.find(a=>a.id==='lubba-emergency-orbit').trigger={type:'low-energy',afterSeconds:45,usesPerStage:1,cooldownSeconds:60};
ASSISTS.find(a=>a.id==='lubba-emergency-orbit').effects=[{type:'party-energy',amount:12},{type:'party-haste',value:0.12,durationSeconds:8}];
