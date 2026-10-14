// The Nightmare finale lends a weapon, never a collectible or a Kirby form.
export const ENCOUNTER_LOANS={
  'star-rod':{
    name:'Star Rod',spriteKey:'star-rod',startsAtWave:2,wearerFamily:'kirby',
    basic:{id:'loan-star-bolt',name:'Star Rod Bolt',behavior:'shot',coefficient:1,intervalSeconds:1.65,range:440,hitCount:1,targetRule:'nearest',effects:[{type:'piercing',coefficient:.45}]},
    skill:{id:'loan-fountain-arc',name:'Fountain Arc',behavior:'beam',coefficient:.28,hitCount:5,cooldownSeconds:9,range:440,targetRule:'nearest',effects:[{type:'cleanse-self'},{type:'stagger',amount:12}]},
  },
};
