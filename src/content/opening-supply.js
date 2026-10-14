function item(id,name,sagaId,rarity,trait,stat,multiplier,proc) {
  return {id,name,sagaId,rarity,grantedTrait:trait,statLean:{stat,multiplier},proc,awakening:null,
    duplicatePolicyId:'powerup-echoes-v1',artId:id+'-item',productionStatus:'provisional',usable:true};
}
const p=(trigger,effects,extra={})=>({trigger,effects,...extra});
export const EXTRA_POWERUPS = [
  item('life-mushroom','Life Mushroom','mario','R','vital','healingReceived',1.07,p('wave-clear',[{type:'heal-bonus',value:0.2}],{usesPerWave:1})),
  item('mini-mushroom','Mini Mushroom','mario','R','tiny','moveSpeed',1.08,p('heavy-hit',[{type:'damage-reduction',value:0.2}],{usesPerWave:1})),
  item('metal-cap','Metal Cap','mario','SSR','metal','guard',1.18,p('below-hp',[{type:'control-immunity',durationSeconds:4}],{hpRatio:0.35,usesPerStage:1})),
  item('maxim-tomato','Maxim Tomato','kirby','R','nourished','maxHp',1.08,p('wave-clear',[{type:'heal-bonus',value:0.2}],{usesPerWave:1})),
  item('energy-drink','Energy Drink','kirby','R','refreshed','healingReceived',1.07,p('basic-below-hp',[{type:'energy',amount:4}],{hpRatio:0.4,usesPerWave:1})),
  item('dream-one-up','1-Up','kirby','R','persistent','guard',1.06,p('heal-after-ko',[{type:'shield-self',coefficient:0.5}],{usesPerStage:1})),
  item('friend-heart','Friend Heart','kirby','SR','friendly','haste',1.1,p('assist',[{type:'shield-party',coefficient:0.5}],{usesPerWave:1})),
  item('energy-sphere','Energy Sphere','kirby','SR','dimensional','skillDamage',1.1,p('third-skill',[{type:'energy',amount:3}],{cooldownSeconds:8})),
  item('sun-stone','Sun Stone','kirby','SR','radiant','rangedDamage',1.11,p('new-target',[{type:'stagger',amount:10}])),
  item('invincibility-candy','Invincibility Candy','kirby','SSR','radiant','moveSpeed',1.15,p('below-hp',[{type:'invulnerable',durationSeconds:4}],{hpRatio:0.25,usesPerStage:1})),
  item('rare-stone','Rare Stone','kirby','SSR','forged','skillDamage',1.16,p('skill-after-ultimate',[{type:'area-bonus',value:0.25}],{usesPerWave:1})),
];
function assist(id,name,sagaId,rarity,familyId,trigger,effects,description) {
  return {id,name,sagaId,rarity,familyId,title:description,trigger,effects,description,
    proficiencyPolicyId:'assist-five-rank-v1',artId:id+'-card',animationId:id+'-entry',productionStatus:'provisional',usable:true};
}
export const EXTRA_ASSISTS = [
  assist('toad-brigade','Toad Brigade','mario','R','toad-brigade',{type:'elite-enters',usesPerStage:2,cooldownSeconds:30},[{type:'target-stagger',amount:12},{type:'mark',value:0.12,count:3}],'Telescope marks an elite for the party.'),
  assist('talkatoo','Talkatoo','mario','R','talkatoo',{type:'long-lived-target',afterSeconds:18,usesPerWave:1,cooldownSeconds:30},[{type:'party-haste',value:0.08,durationSeconds:6}],'Calls out a target that has survived 18 seconds.'),
  assist('plessie','Plessie','mario','SSR','plessie',{type:'crowd',count:6,usesPerStage:2,cooldownSeconds:45},[{type:'line-damage',coefficient:3.2},{type:'knockback',amount:70}],'Charges through a large crowd or boss add wave.'),
  assist('tokkori','Tokkori','kirby','R','tokkori',{type:'airborne-enters',usesPerWave:1,cooldownSeconds:25},[{type:'slow',value:0.15,durationSeconds:4},{type:'boss-stagger',amount:15}],'A squawking gust interrupts an airborne enemy.'),
  assist('kabu','Kabu','kirby','R','kabu',{type:'ally-below-hp',hpRatio:0.35,usesPerWave:1,cooldownSeconds:30},[{type:'rescue-lowest-hp-ally'},{type:'party-guard',amount:8,durationSeconds:4}],'A doorway moves a cornered ally to safety.'),
  assist('wise-waddle-dee','Wise Waddle Dee','kirby','R','waddle-dee',{type:'long-lived-target',targetKind:'boss',afterSeconds:20,usesPerWave:1,cooldownSeconds:30},[{type:'boss-stagger',amount:12}],'Telescope reveals a boss stagger window.'),
  assist('mr-star','Mr. Star','kirby','R','mr-star',{type:'wave-start',usesPerWave:1,cooldownSeconds:0},[{type:'party-energy',amount:10}],'Drops five small energy stars at wave entry.'),
  assist('elline','Elline','kirby','SR','elline',{type:'allies-below-hp',hpRatio:0.5,count:2,usesPerWave:1,cooldownSeconds:35},[{type:'shield-party',coefficient:1}],'Paints a shield across an injured party.'),
  assist('queen-ripple','Queen Ripple','kirby','SR','queen-ripple',{type:'party-condition',count:2,usesPerWave:1,cooldownSeconds:30},[{type:'cleanse-party',count:1},{type:'shield-party',coefficient:0.5}],'Crystal fairies cleanse and protect the party.'),
  assist('whispy-woods-page','Whispy Woods','kirby','SSR','whispy',{type:'crowd',count:5,usesPerStage:2,cooldownSeconds:45},[{type:'line-damage',coefficient:2},{type:'heal-party',coefficient:1.2},{type:'slow',value:0.5,durationSeconds:2}],'Roots a crowd and drops healing apples.'),
  assist('kracko-page','Kracko','kirby','SSR','kracko',{type:'boss-staggered',usesPerStage:3,cooldownSeconds:35},[{type:'line-damage',coefficient:3.6},{type:'boss-stagger',amount:20}],'Lightning strikes during a boss stagger window.'),
];
