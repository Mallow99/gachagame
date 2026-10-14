const SMB = 'super-mario-bros-1985', KA = 'kirbys-adventure-1993';
export const spawn = (enemyId,count=1,extra={}) => ({enemyId,count,entry:'right',spacing:66,...extra});
export const wave = (...spawns) => ({id:'wave',delaySeconds:0,spawns,clearRule:'defeat-all'});
function encounter(worldId,stage,name,areaId,sceneId,waves,options={}) {
  const boss = [5,10,15,20].includes(stage) || options.boss;
  const {boss: bossOption, ...rest} = options;
  const kirby = worldId===KA;
  const starlight = stage<=4?100:stage===5?600:stage<=9?75:stage===10?500:stage<=14?100:stage===15?(kirby?350:800):stage===20?800:100;
  const coins = stage<=4?40+(stage-1)*5:stage===5?250:stage<=9?75:stage===10?430:stage<=14?110:stage===15?(kirby?360:650):stage===20?750:140;
  const tickets = stage===3?1:stage===5?4:stage===10||stage===15?7:stage===20?8:0;
  return {id:(kirby?'ka':'smb1')+'-'+String(stage).padStart(2,'0'),worldId,localStage:stage,areaId,name,
    recommendedTrainingRank:(stage===5?6:stage)+(kirby?15:0),environment:{sceneId,groundRule:sceneId.includes('water')?'water':'flat',modifiers:[]},
    waves:waves.map((w,i)=>({...w,id:'w'+(i+1)})),clearRules:{type:'defeat-all-waves',timeLimitSeconds:600},
    rewards:{firstClear:[{type:'starlight',amount:starlight},{type:'coins',amount:coins},...(tickets?[{type:'supply-ticket',amount:tickets}]:[])],
      repeat:[{type:'coins',amount:25+stage*5},{type:'patrol-mark',amount:1}]},
    referenceTeams:[],productionStatus:'slice',...(boss?{boss:{staggerMax:100,staggerDurationSeconds:5,phases:[{id:'opening',startsAtHpRatio:1},{id:'phase-two',startsAtHpRatio:0.5}]}}:{}),...rest};
}
const s=spawn,w=wave;
export const SMB1_LATER_ENCOUNTERS = [
  encounter(SMB,6,'Hard Shells','smb1-high-roads','smb1-underground',[w(s('koopa-troopa',2)),w(s('buzzy-beetle',2)),w(s('buzzy-beetle',2),s('goomba',2,{entry:'left'})),w(s('buzzy-beetle',2),s('koopa-troopa',2))]),
  encounter(SMB,7,'Crossing Schools','smb1-high-roads','smb1-water',[w(s('cheep-cheep',4)),w(s('cheep-cheep',3),s('cheep-cheep',2,{entry:'left',delaySeconds:2})),w(s('koopa-troopa',1),s('cheep-cheep',4)),w(s('cheep-cheep',2,{hpMultiplier:2}),s('cheep-cheep',2))]),
  encounter(SMB,8,'Ink in the Deep','smb1-high-roads','smb1-water',[w(s('cheep-cheep',3)),w(s('blooper',1),s('cheep-cheep',2)),w(s('blooper',2)),w(s('blooper',2),s('cheep-cheep',3)),w(s('blooper',1,{hpMultiplier:2}),s('cheep-cheep',2))]),
  encounter(SMB,9,'Look Up','smb1-high-roads','smb1-sky',[w(s('paratroopa',3)),w(s('spiny',3)),w(s('lakitu',1),s('goomba',2)),w(s('paratroopa',2),s('spiny',2)),w(s('lakitu',1,{hpMultiplier:2}),s('paratroopa',2))]),
  encounter(SMB,10,'Lakitu Above','smb1-high-roads','smb1-sky',[w(s('buzzy-beetle',2),s('koopa-troopa',1)),w(s('spiny',3)),w(s('lakitu',1),s('paratroopa',2)),w(s('lakitu',1,{hpMultiplier:2})),w(s('lakitu-boss',1))]),
  encounter(SMB,11,'After Sundown','smb1-dark-world','smb1-night',[w(s('goomba',4)),w(s('koopa-troopa',3)),w(s('piranha-plant',2,{entry:'fixed'}),s('paratroopa',2)),w(s('hammer-bro',1),s('goomba',3))]),
  encounter(SMB,12,'Bullet Lanes','smb1-dark-world','smb1-castle',[w(s('bullet-bill',3)),w(s('hammer-bro',1),s('goomba',2)),w(s('bullet-bill',4,{entry:'left'})),w(s('hammer-bro',2)),w(s('hammer-bro',1,{variantId:'elite'}),s('bullet-bill',2))]),
  encounter(SMB,13,'Lava Discipline','smb1-dark-world','smb1-lava',[w(s('podoboo',3)),w(s('buzzy-beetle',2),s('podoboo',2)),w(s('koopa-troopa',3)),w(s('hammer-bro',1),s('podoboo',3)),w(s('podoboo',2,{hpMultiplier:2}))],{hazard:'fire-bar'}),
  encounter(SMB,14,'False King','smb1-dark-world','smb1-castle',[w(s('goomba',2),s('koopa-troopa',2)),w(s('piranha-plant',3,{entry:'fixed'})),w(s('hammer-bro',2),s('bullet-bill',2)),w(s('buzzy-beetle',2),s('podoboo',2)),w(s('hammer-bro',1,{variantId:'elite'}),s('spiny',2)),w(s('impostor-bowser',1))],{boss:true}),
  encounter(SMB,15,"Bowser's Castle",'smb1-dark-world','smb1-castle',[w(s('koopa-troopa',3),s('goomba',2)),w(s('bullet-bill',3)),w(s('hammer-bro',2)),w(s('podoboo',3),s('buzzy-beetle',1)),w(s('hammer-bro',1),s('piranha-plant',2,{entry:'fixed'})),w(s('bowser-boss',1))],{finale:true,hazard:'fire-bar'}),
];
const kirbyStages = [
  ['First Puff','valley',[[s('waddle-dee',3)],[s('waddle-dee',2),s('bronto-burt',1)],[s('bronto-burt',2),s('waddle-dee',2)],[s('waddle-dee',2),s('bronto-burt',1,{hpMultiplier:1.8})]]],
  ['A Taste of Fire','valley',[[s('hot-head',1),s('waddle-dee',2)],[s('sir-kibble',2)],[s('hot-head',2),s('bronto-burt',2)],[s('sir-kibble',2),s('hot-head',1)]]],
  ['Rain or Shine','valley',[[s('parasol-dee',2),s('waddle-dee',2)],[s('poppy-bros',2)],[s('parasol-dee',2),s('bronto-burt',2)],[s('poppy-bros',2),s('hot-head',1)]]],
  ['Under the Canopy','valley',[[s('rocky',2)],[s('waddle-doo',2),s('waddle-dee',2)],[s('sparky',2),s('rocky',1)],[s('waddle-doo',1,{hpMultiplier:2}),s('rocky',2)]]],
  ['Whispy Woods','valley',[[s('waddle-dee',3)],[s('hot-head',1),s('sir-kibble',1)],[s('rocky',2)],[s('whispy-woods',1)]]],
  ['Painted Trouble','tower',[[s('paint-roller',1)],[s('hot-head',1),s('chilly',1)],[s('sir-kibble',2),s('waddle-doo',1)],[s('paint-roller',1),s('sparky',1)]]],
  ['Sword in the Tower','tower',[[s('rocky',2)],[s('sword-knight',2)],[s('chilly',2),s('rocky',1)],[s('sword-knight',3)]]],
  ['No Brakes','tower',[[s('wheelie',2)],[s('laser-ball',2)],[s('wheelie',2),s('sparky',1)],[s('wheelie',3,{entry:'left'})]]],
  ['Storm Ascent','storm',[[s('bronto-burt',3)],[s('kracko-jr',1)],[s('waddle-doo',2),s('bronto-burt',2)],[s('kracko-jr',1),s('laser-ball',1)]]],
  ['Eye of the Storm','storm',[[s('waddle-doo',2),s('bronto-burt',2)],[s('sparky',2)],[s('kracko-jr',1)],[s('kracko',1)]]],
  ['Hammer Country','yard',[[s('rocky',2),s('waddle-dee',2)],[s('bonkers',1)],[s('chilly',2),s('hot-head',1)],[s('bonkers',1),s('rocky',1)]]],
  ['Orange Ocean','water',[[s('bronto-burt',3)],[s('sir-kibble',2),s('chilly',1)],[s('parasol-dee',2),s('wheelie',1)],[s('sir-kibble',2),s('poppy-bros',2)]]],
  ['Knight Formation','moon',[[s('blade-knight',2)],[s('sword-knight',3)],[s('blade-knight',2),s('sir-kibble',1)],[s('sword-knight',2),s('bonkers',1)]]],
  ['An Offered Sword','moon',[[s('sword-knight',2)],[s('blade-knight',2),s('waddle-doo',1)],[s('sword-knight',3)],[s('blade-knight',1,{hpMultiplier:2}),s('sword-knight',2)]]],
  ['The Masked Duel','moon',[[s('sword-knight',2)],[s('blade-knight',2)],[s('bonkers',1)],[s('meta-knight-boss',1)]]],
  ['Rainbow Memories','dream',[[s('hot-head',2),s('chilly',1)],[s('wheelie',2),s('rocky',1)],[s('sparky',2),s('sir-kibble',1)],[s('sword-knight',2),s('poppy-bros',2)]]],
  ['Dream Distortion','dream',[[s('scarfy',3)],[s('waddle-dee',2,{entry:'left'}),s('bronto-burt',2)],[s('scarfy',2),s('laser-ball',2)],[s('scarfy',1,{hpMultiplier:2}),s('wheelie',2)]]],
  ['Fountain Defense','fountain',[[s('blade-knight',2),s('sword-knight',1)],[s('waddle-doo',3)],[s('hot-head',2),s('scarfy',2)],[s('bonkers',1),s('sword-knight',2)]]],
  ["Dedede's Warning",'fountain',[[s('waddle-dee',4)],[s('parasol-dee',2),s('poppy-bros',2)],[s('bonkers',1)],[s('dedede-boss',1)]]],
  ['Nightmare at the Fountain','nightmare',[[s('scarfy',3)],[s('blade-knight',2),s('hot-head',1)],[s('nightmare-orb',1)],[s('nightmare-wizard',1)]]],
];
export const KIRBY_ENCOUNTERS = kirbyStages.map(([name,scene,groups],i) => encounter(KA,i+1,name,
  ['ka-valley','ka-garden','ka-ocean','ka-resort'][Math.floor(i/5)],'ka-'+scene,groups.map(g=>w(...g)),
  { ...(i===0?{enemyHpScale:2,enemyDamageScale:0.5}:{}), ...(i===18?{boss:true}:{}), ...(i===19?{finale:true,encounterLoan:'star-rod'}:{}),
    ...(i===2?{rewards:{firstClear:[{type:'starlight',amount:100},{type:'coins',amount:50},{type:'powerup',itemId:'maxim-tomato',amount:1},{type:'supply-ticket',amount:1}],repeat:[{type:'coins',amount:40},{type:'patrol-mark',amount:1}]}}:{}) }));
