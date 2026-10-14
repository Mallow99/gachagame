// Authoritative fixed-step combat. Rendering never decides hits or state exits.
import { content } from '../content/index.js';
import { COPY_PROFILES } from '../content/opening-roster.js';
import { RULES, PATTERNS, fighterStats, growth, hitDamage, interval, techniqueAbility, techniqueQuality } from '../config/rules.js';
import { createSeededRandom } from '../random.js';
import { ENCOUNTER_TUNING } from '../config/encounter-tuning.js';
import { ENCOUNTER_LOANS } from '../content/encounter-loans.js';
const clamp=(x,a,b)=>Math.max(a,Math.min(b,x));
const alive=a=>a.hp>0;
const small=a=>a.definition.size==='small'&&!a.boss;
const has=(a,trait)=>a.definition.traits?.includes(trait)||a.powerup?.grantedTrait===trait||COPY_PROFILES[a.copy]?.trait===trait;

export class Battle {
  constructor({encounter,party,rank=1,threat=1,owned={},powerupIds=[],rows=[],assistId=null,assistProficiencyRank=1,seed='battle',width=1000,mode='story',runId=seed,eventSink=null}) {
    if(!encounter?.waves?.length)throw new Error('An authored encounter is required.');
    if(!party.length||party.length>4)throw new Error('Deploy one to four fighters.');
    this.encounter={...encounter,...ENCOUNTER_TUNING[encounter.id]};this.rank=rank;this.threat=threat;this.random=createSeededRandom(seed);this.seed=seed;this.runId=runId;
    this.width=width;this.mode=mode;this.time=0;this.waveIndex=-1;this.waveTime=0;this.pending=[];this.wait=0.3;
    this.actors=[];this.projectiles=[];this.shells=[];this.events=[];this.sequence=0;this.eventSink=eventSink;
    this.done=false;this.win=false;this.kills=0;this.wavesCleared=0;this.ultimates=0;this.counter=0;
    this.assistProficiencyRank=clamp(assistProficiencyRank,1,5);this.assistStrength=1+(this.assistProficiencyRank-1)*.0125;
    this.assist=content.assists.get(assistId);this.assistUses=0;this.assistWaveUses=0;this.assistReadyAt=0;
    this.stats={damage:{},healing:{},actions:{},knockouts:[],firstUltimate:{},idle:{},damageTaken:{},conditions:0,assists:0,bossPhases:[]};
    const families=new Set(),saga=content.worlds.get(encounter.worldId)?.sagaId;
    party.forEach((id,i)=>{
      const u=content.units.get(id);if(!u)throw new Error('Unknown fighter '+id);
      if(families.has(u.familyId))throw new Error('Only one '+u.familyId+' family member can deploy.');families.add(u.familyId);
      if(mode!=='endless'&&u.sagaId!==saga)throw new Error('Story parties must match the Hub.');
      const p=content.powerups.get(powerupIds[i]);
      if(p&&mode!=='endless'&&p.sagaId!==saga)throw new Error('Story Power-Ups must match the Hub.');
      const a=this.actor(u,true,fighterStats(u,rank,owned[id],p),100+i*72);
      a.row=rows[i]||u.rowPreference;a.partyIndex=i;a.powerup=p;a.mastery=owned[id]?.masteryRank||1;
      a.anchor=90+i*72;a.readyIn=0.2+i*0.12;a.maxReady=interval(u.basic.intervalSeconds,this.haste(a));
      a.skillIn=u.skill.cooldownSeconds/2;a.ultimatePolicy=owned[id]?.ultimatePolicy||'auto';a.copyPolicy=owned[id]?.copyPolicy||'recommended';
      this.stats.damage[id]=0;this.stats.healing[id]=0;this.stats.actions[id]=0;this.stats.idle[id]=0;this.stats.damageTaken[id]=0;
      this.actors.push(a);this.log('spawn',a,null,{x:a.x,hero:true});
    });
    if(this.assist&&(families.has(this.assist.familyId)||(mode!=='endless'&&this.assist.sagaId!==saga)))throw new Error('This Assist conflicts with the party.');
  }
  actor(definition,hero,stats,x) {
    return {uid:(hero?definition.id:'enemy-'+definition.id)+'#'+this.counter++,id:definition.id,definition,hero,
      name:definition.name,spriteKey:definition.spriteKey||definition.spriteId,
      ...stats,maxHp:stats.hp,hp:stats.hp,x,y:0,direction:hero?1:-1,anchor:x,
      readyIn:0.4,maxReady:2.5,skillIn:5,energy:0,shield:0,shieldUntil:0,statuses:{},state:'idle',action:null,basicActions:0,skillHits:0,
      copy:null,copyFallbackShots:0,actions:0,skills:0,ults:0,momentum:0,hitAt:-9,defeatedAt:null,
      hidden:false,boss:definition.size==='boss',stagger:0,phase:0,phaseAt:0,spawnAt:this.time,stoneUntil:0};
  }
  log(type,source=null,target=null,values={},tags=[]) {
    const e={sequence:++this.sequence,atMs:Math.round(this.time*1000),type,sourceId:source?.uid||null,targetId:target?.uid||null,
      abilityId:Object.hasOwn(values,'abilityId')?values.abilityId:source?.action?.ability.id||null,values,tags};
    this.events.push(e);if(this.events.length>3000)this.events.shift();this.eventSink?.(e);return e;
  }
  living(hero){return this.actors.filter(a=>alive(a)&&a.hero===hero&&!a.hidden&&!(a.vanishUntil>this.time));}
  step(dt=RULES.step) {
    if(this.done)return;
    this.time+=dt;this.waveTime+=dt;
    if(!this.actors.some(a=>a.hero&&alive(a))){this.end(false,'The front line fell.');return;}
    if(this.time>(this.encounter.clearRules.timeLimitSeconds||600)){this.end(false,'The encounter timed out.');return;}
    if(this.wait>0){this.wait-=dt;if(this.wait<=0)this.nextWave();}
    const due=this.pending.filter(p=>p.at<=this.waveTime);this.pending=this.pending.filter(p=>p.at>this.waveTime);
    for(const spawn of due)this.spawn(spawn);
    for(const a of [...this.actors]) {
      if(!alive(a))continue;
      this.updateConditions(a,dt);
      if(!alive(a))continue;
      a.skillIn=Math.max(0,a.skillIn-dt);a.readyIn=Math.max(0,a.readyIn-dt);
      if(a.definition.movement?.mode==='fixed'&&!a.boss){
        const hidden=(this.waveTime+Number(a.uid.split('#')[1])*0.7)%6<1.3;
        if(hidden!==a.hidden){a.hidden=hidden;this.log('move-state',a,null,{state:hidden?'pipe-hidden':'pipe-rise'});}
      }
      if(a.hidden){a.state='hidden';a.action=null;continue;}
      if(a.stoneUntil>this.time||a.statuses.stun?.until>this.time){a.state=a.stoneUntil>this.time?'stone':'staggered';continue;}
      if(a.action){this.updateAction(a,dt);continue;}
      const opponents=this.living(!a.hero);
      if(!opponents.length){a.state='idle';a.y=0;this.approach(a,a.anchor,dt,0.6);continue;}
      if(a.retreatTo!==undefined&&Math.abs(a.retreatTo-a.x)>10){a.state='moving-back';this.approach(a,a.retreatTo,dt,1.25);a.y=has(a,'airborne')?28:0;continue;}
      delete a.retreatTo;
      const ability=this.chooseAbility(a),target=this.target(a,ability,opponents);
      if(!target){a.state='idle';if(a.hero)this.stats.idle[a.id]+=dt;continue;}
      const distance=Math.abs(target.x-a.x),range=ability.range||PATTERNS[ability.behavior].range;
      const safeRange=['strike','combo'].includes(ability.behavior)?range:Math.min(range,310);
      if(ability.targetRule!=='party'&&ability.targetRule!=='lowest-hp-ally'&&distance>range){
        a.state='moving';a.direction=Math.sign(target.x-a.x)||a.direction;this.approach(a,target.x-a.direction*safeRange*0.8,dt);a.y=0;
      }else if(a.readyIn<=0){this.startAction(a,ability,target);}
      else {
        a.state='recovery';a.y=Math.max(0,a.y-dt*160);
        if(a.row==='back'&&distance<85&&!has(a,'fixed'))this.approach(a,a.x-a.direction*70,dt,0.5);
      }
    }
    this.updateProjectiles(dt);this.updateShells(dt);this.checkAssist();
    if(this.encounter.hazard&&this.waveIndex>=0&&this.wait<=0&&Math.floor(this.time*30)%180===0)this.hazard();
    if(this.waveIndex>=0&&this.wait<=0&&!this.pending.length&&!this.actors.some(a=>!a.hero&&alive(a)))this.clearWave();
    // Retain defeated bodies just long enough for a readable flatten/tumble.
    this.actors=this.actors.filter(a=>alive(a)||a.hero||this.time-a.defeatedAt<1.2);
  }
  advance(seconds){for(let t=0;t<seconds&&!this.done;t+=RULES.step)this.step();return this;}
  nextWave() {
    this.waveIndex++;if(this.waveIndex>=this.encounter.waves.length){this.end(true);return;}
    this.waveTime=0;this.assistWaveUses=0;
    for(const a of this.living(true)){a.procWave=false;a.shellUsed=false;a.rareStoneArmed=false;a.rareStoneUsed=false;a.y=0;a.state='idle';this.passive(a,'wave-start');}
    const wave=this.encounter.waves[this.waveIndex];this.pending=[];
    const loan=ENCOUNTER_LOANS[this.encounter.encounterLoan];
    if(loan&&this.waveIndex===loan.startsAtWave){const wearer=this.living(true).find(a=>a.definition.familyId===loan.wearerFamily)||this.living(true)[0];
      if(wearer){wearer.encounterLoan=this.encounter.encounterLoan;this.log('encounter-loan-start',wearer,null,{id:wearer.encounterLoan,name:loan.name});}
    }
    for(const group of wave.spawns)for(let i=0;i<group.count;i++)this.pending.push({...group,index:i,at:(group.delaySeconds||0)+i*0.28});
    this.log('wave-start',null,null,{wave:this.waveIndex+1,total:this.encounter.waves.length});
    this.checkAssist('wave-start');
  }
  spawn(spawn) {
    const base=content.enemies.get(spawn.enemyId);if(!base)throw new Error('Unknown enemy '+spawn.enemyId);
    const def=structuredClone(base),variant=spawn.variantId===base.elite?.id?base.elite:base.variants?.find(v=>v.id===spawn.variantId);
    const stats={...def.baseStats,...variant?.baseStats};const m=growth(this.threat);
    stats.hp=Math.round(stats.hp*m*(variant?.hpMultiplier||1)*(spawn.hpMultiplier||1)*(this.encounter.enemyHpScale||1));
    stats.attack=Math.round(stats.attack*m*(variant?.attackMultiplier||1)*(this.encounter.enemyDamageScale||1));
    if(variant?.attacks?.length)def.attacks=[...def.attacks,...variant.attacks];
    if(spawn.variantId==='boss-pair'){def.size='boss';def.boss=this.encounter.boss;}
    if(def.size==='boss')stats.hp=Math.round(stats.hp*(this.encounter.bossHpScale||1));
    const x=spawn.entry==='left'?40+spawn.index*36:clamp(640+spawn.index*(spawn.spacing||66),420,950);
    const a=this.actor(def,false,stats,def.movement?.mode==='fixed'?clamp(620+spawn.index*110,520,920):x);
    a.readyIn=0.7+spawn.index*0.25;a.maxReady=def.attacks[0].intervalSeconds;
    if(has(a,'airborne'))a.y=28;
    this.actors.push(a);this.log('spawn',a,null,{x:a.x,enemy:true,boss:a.boss,variant:spawn.variantId});
    if(a.boss){this.log('boss-intro',a,null,{name:a.name,phase:a.definition.boss.phases[0].id});a.readyIn=RULES.bossIntro;this.stats.bossPhases.push(a.name+': opening');}
    this.checkAssist(a.boss?'boss-phase-start':has(a,'airborne')?'airborne-enters':def.size==='elite'?'elite-enters':'spawn');
  }
  approach(a,x,dt,multiplier=1) {
    if(has(a,'fixed'))return;
    const slow=a.statuses.slow?.value||0,speed=a.moveSpeed*(1+(a.momentumMove||0)*a.momentum)*(1-slow*0.8)*multiplier;
    const delta=clamp(x-a.x,-speed*dt,speed*dt);a.x=clamp(a.x+delta,30,970);
  }
  chooseAbility(a) {
    if(!a.hero){const cycle=a.definition.boss?.phases[a.phase]?.attackCycle;return a.definition.attacks[cycle?cycle[a.actions%cycle.length]:a.actions%a.definition.attacks.length];}
    const u=a.definition,copy=ENCOUNTER_LOANS[a.encounterLoan]||COPY_PROFILES[a.copy];
    if(a.energy>=100&&(a.ultimatePolicy!=='boss'||this.living(false).some(e=>e.boss)))return {...u.ultimate,kind:'ultimate'};
    const sk=copy?.skill||u.skill;
    if(a.skillIn<=0){
      if(copy&&u.copyLibrary&&a.copyPolicy!=='never-replace'){
        const candidate=this.living(false).find(e=>e.definition.copyAbilityId!==a.copy&&u.copyLibrary.includes(e.definition.copyAbilityId)&&e.hp/e.maxHp<0.4);
        if(candidate&&(a.copyPolicy==='recommended'||candidate.definition.copyAbilityId===a.copyPolicy))return {...u.skill,kind:'skill'};
      }
      const healer=sk.targetRule==='lowest-hp-ally';
      if(!healer||this.living(true).some(ally=>ally.hp<ally.maxHp*0.85||sk.effects.some(e=>e.type==='shield')))return {...sk,kind:'skill'};
    }
    return {...(copy?.basic||u.basic),kind:'basic'};
  }
  target(a,ability,candidates=this.living(!a.hero)) {
    if(ability.targetRule==='party')return a;
    if(ability.targetRule==='lowest-hp-ally')return this.living(a.hero).sort((x,y)=>x.hp/x.maxHp-y.hp/y.maxHp)[0]||a;
    if(ability.effects?.some(e=>e.type==='copy')) {
      const options=candidates.filter(e=>e.definition.copyAbilityId&&(!a.copy||a.copyPolicy!=='never-replace'));
      const favorite=options.find(e=>e.definition.copyAbilityId===a.copyPolicy);
      if(favorite)return favorite;if(options.length)return options.sort((x,y)=>x.hp/x.maxHp-y.hp/y.maxHp)[0];
    }
    const taunter=candidates.find(e=>e.statuses.taunt?.until>this.time);if(taunter)return taunter;
    if(ability.targetRule==='lowest-hp')return [...candidates].sort((x,y)=>x.hp-y.hp)[0];
    if(ability.targetRule==='backmost')return [...candidates].sort((x,y)=>(a.hero?y.x-x.x:x.x-y.x))[0];
    const claims=e=>this.actors.filter(other=>other!==a&&other.hero===a.hero&&other.action?.targetUid===e.uid).length;
    return [...candidates].sort((x,y)=>Math.abs(x.x-a.x)+claims(x)*55-Math.abs(y.x-a.x)-claims(y)*55)[0];
  }
  startAction(a,ability,target) {
    ability=techniqueAbility(ability,a.mastery,ability.kind||'basic');
    if(a.nextAreaScale){ability.areaScale=a.nextAreaScale;a.nextAreaScale=0;}
    if(ability.kind==='skill'&&a.rareStoneArmed){ability.areaScale=(ability.areaScale||1)*1.25;a.rareStoneUsed=true;}
    const behavior=ability.behavior,movement=a.definition.animation?.movementSignature||a.definition.movement?.mode;
    const contacts=Array(ability.hitCount||1).fill(ability.coefficient||0);
    for(const e of ability.effects||[])if(e.type==='multi-hit')contacts.push(...Array(e.count).fill(e.coefficient));
    const hits=contacts.length,jumping=behavior==='stomp'||behavior==='charge'&&movement==='high-jump';
    let duration=behavior==='stomp'?1.1:behavior==='charge'?0.85:behavior==='combo'?0.45+hits*0.16:behavior==='beam'?0.7+hits*0.18:0.45+hits*0.16;
    if(movement==='high-jump')duration*=1.25;
    if(ability.kind==='ultimate')duration=Math.max(duration,1.4);
    const marker=jumping?duration*0.64:behavior==='charge'?0.34:behavior==='beam'?0.6:0.3;
    duration=Math.max(duration,marker+(hits-1)*0.16+0.18);
    if(ability.kind==='basic'&&a.powerup?.proc?.trigger==='every-nth-basic'&&(a.basicActions+1)%(a.powerup.proc.count||4)===0)ability={...ability,procEffects:a.powerup.proc.effects};
    const vanish=ability.effects?.find(e=>e.type==='vanish');
    a.action={ability,targetUid:target.uid,start:this.time,from:a.x,to:target.x,duration,marker:vanish?Math.max(marker,vanish.durationSeconds+.04):marker,nextHit:0,hits,contacts,effectsDone:false,movement,landedHits:0};
    a.state='windup';a.direction=Math.sign(target.x-a.x)||a.direction;
    if(ability.kind==='skill'){a.skillIn=ability.cooldownSeconds;a.skills++;}
    const block=ability.effects?.find(e=>e.type==='windup-block');if(block){a.blockUntil=this.time+block.durationSeconds;a.blockStagger=block.stagger;}
    if(vanish){a.vanishUntil=this.time+vanish.durationSeconds;this.log('vanish-start',a,null,{x:a.x,duration:vanish.durationSeconds});}
    if(ability.kind==='ultimate'){
      a.energy=0;a.ults++;this.ultimates++;if(!this.stats.firstUltimate[a.id])this.stats.firstUltimate[a.id]=this.time;
      this.log('ultimate',a,target,{name:ability.name||ability.id,spriteKey:a.spriteKey,rarity:a.definition.rarity});
      if(a.powerup?.proc?.trigger==='skill-after-ultimate'&&!a.rareStoneUsed)a.rareStoneArmed=true;
    }
    this.log('action-start',a,target,{behavior,kind:ability.kind||'basic',duration,from:a.x,to:target.x});
    if(!a.hero&&['lob','beam','stomp'].includes(behavior))this.log('telegraph',a,target,{x:target.x,radius:behavior==='beam'?105:55,until:this.time+marker+0.45,behavior});
  }
  updateAction(a,dt) {
    const act=a.action,t=this.time-act.start,p=clamp(t/act.duration,0,1),ability=act.ability,behavior=ability.behavior;
    const target=this.actors.find(e=>e.uid===act.targetUid);
    if(behavior==='stomp'||(behavior==='charge'&&act.movement==='high-jump')) {
      const height=act.movement==='high-jump'?87:a.boss||act.movement==='heavy'?72:62;
      if(p<0.72){const jump=p/0.72;a.x=clamp(act.from+(act.to-act.from)*jump,30,970);a.y=Math.sin(Math.PI*jump)*height;a.state=jump<0.5?'rise':'fall';}
      else {a.y=Math.sin((p-0.72)/0.28*Math.PI)*26;a.state='rebound';}
    }else if(behavior==='charge') {
      a.x=clamp(act.from+(act.to-act.from)*Math.sin(p*Math.PI/2),30,970);a.y=act.movement==='arc'?Math.sin(p*Math.PI)*52:has(a,'airborne')?28+Math.sin(p*Math.PI)*18:0;a.state='charge';
    }else if(behavior==='combo'||behavior==='strike') {
      this.approach(a,act.to-a.direction*(30+(a.partyIndex||0)*8),dt,1.3);a.state=p<0.25?'windup':'resolve';a.y=0;
    }else {a.state=p<0.35?'windup':'cast';a.y=['float','pulse-float'].includes(act.movement)?Math.sin(p*Math.PI)*34:act.movement==='puff'?Math.sin(p*Math.PI)*(a.mastery>=4?46:38):['perch-jump','band-hop','hop'].includes(act.movement)?Math.sin(p*Math.PI)*24:has(a,'airborne')?30:0;}
    while(act.nextHit<act.hits&&t>=act.marker+act.nextHit*0.16) {
      const hit=act.nextHit++;let victim=target&&alive(target)&&!target.hidden?target:this.target(a,ability);
      if((behavior==='lob'||ability.targetRule==='cluster')&&act.hits>1){const candidates=this.living(!a.hero);victim=candidates[hit%candidates.length]||victim;}
      if(!victim)continue;
      const delivery=['shot','lob'].includes(behavior)&&ability.coefficient===0&&ability.targetRule==='lowest-hp-ally';
      this.log('animation-marker',a,victim,{marker:behavior==='stomp'||act.movement==='high-jump'?'land':['shot','lob'].includes(behavior)?'projectileSpawn':'hit',index:hit,x:a.x,y:a.y});
      if(!act.effectsDone){if(!delivery)this.actionEffects(a,victim,ability);act.effectsDone=true;}
      const coefficient=act.contacts[hit];
      if(delivery)this.projectile(a,victim,{...ability,deliveryEffects:ability.effects},0);
      else if(coefficient>0) {
        if(['shot','lob'].includes(behavior))this.projectile(a,victim,ability,coefficient);
        else {
          this.damage(a,victim,coefficient,ability);
          for(const e of ability.effects||[])if(e.type==='splash')for(const other of this.living(!a.hero).filter(x=>x!==victim&&Math.abs(x.x-victim.x)<(e.radius||60)*(ability.areaScale||1)))this.damage(a,other,e.coefficient,{...ability,effects:[]});
          if(behavior==='beam')for(const [i,e] of this.living(!a.hero).filter(e=>e!==victim&&Math.abs(e.x-a.x)<460*(ability.areaScale||1)).slice(0,2).entries())this.damage(a,e,coefficient*[0.65,0.45][i],ability);
        }
      }
      if(behavior==='stomp')for(const shell of this.shells)if(!shell.kicked&&Math.abs(shell.x-a.x)<95)this.kickShell(shell,a);
    }
    if(t>=act.duration) {
      for(const e of ability.effects||[]) {
        if(['finisher','line-damage'].includes(e.type)) {
          const victims=e.splash||e.type!=='finisher'?this.living(!a.hero):[this.target(a,ability)].filter(Boolean);
          for(const v of victims)this.damage(a,v,e.coefficient,ability);
        }
      }
      a.actions++;if(ability.kind==='basic')a.basicActions++;if(a.hero){this.stats.actions[a.id]++;a.energy=clamp(a.energy+(ability.kind==='skill'?12:ability.kind==='ultimate'?0:8),0,100);}
      if(a.hero&&a.powerup)this.itemProc(a,target,ability);
      this.passive(a,'after-action',target);
      if(ability.kind==='basic'&&act.landedHits>=act.hits)this.passive(a,'complete-basic',target);
      if(ability.kind==='basic'&&a.basicActions%3===0)this.passive(a,'third-basic',target);
      if(['stomp','charge'].includes(behavior))this.passive(a,'after-move',target);
      if(ability.kind==='skill'&&a.rareStoneArmed){a.rareStoneArmed=false;this.log('powerup-proc',a,target,{id:a.powerup.id});}
      if(ability.kind==='ultimate'&&a.powerup?.awakening&&!a.awakened){a.awakened=true;this.status(a,'invulnerable',a.powerup.awakening.durationSeconds,1);}
      a.maxReady=interval((a.definition.basic?.intervalSeconds||ability.intervalSeconds||2.8),this.haste(a));
      a.readyIn=Math.max(0.12,a.maxReady-act.duration);a.y=has(a,'airborne')?28:0;
      if(act.movement==='high-jump')a.x=clamp(a.x-a.direction*65,30,970);
      if(ability.effects?.some(e=>e.type==='retreat'))a.x=clamp(a.x-a.direction*100,30,970);
      if(a.hero&&ability.kind!=='basic'&&['shot','lob','beam'].includes(a.definition.basic.behavior)&&target&&target.hero!==a.hero&&Math.abs(target.x-a.x)<(a.row==='back'?160:90))a.retreatTo=clamp(target.x-a.direction*(a.row==='back'?210:125),30,970);
      a.action=null;a.state='recovery';this.log('action-end',a,null,{readyIn:a.readyIn});
    }
  }
  haste(a){const aquatic=a.definition.passive?.trigger==='aquatic'&&/water/.test(this.encounter.environment?.sceneId)?(a.definition.passive.effects.find(e=>e.type==='haste')?.value||0)*techniqueQuality(a.mastery):0;return (a.haste||0)+aquatic+(a.statuses.haste?.value||0)-(a.statuses.slow?.value||0);}
  projectile(a,target,ability,coefficient,returning=false) {
    const p={id:'projectile-'+this.counter++,sourceUid:a.uid,targetUid:target.uid,from:a.x,to:target.x,x:a.x,y:a.y+25,start:this.time,
      duration:Math.max(0.25,Math.abs(target.x-a.x)/(ability.behavior==='lob'?460:620)),coefficient,ability,hero:a.hero,
      kind:ability.deliveryEffects?'parcel':a.encounterLoan?'star':ability.effects?.some(e=>e.type==='apple')?'apple':a.copy||a.definition.presentation?.effectMotif||a.definition.spriteKey||ability.behavior,
      originHeight:a.y+(ability.projectileOrigin||25),endHeight:target.y+25,
      lob:ability.behavior==='lob',returning,done:false};
    this.projectiles.push(p);this.log('projectile-spawn',a,target,{id:p.id,from:p.from,to:p.to,duration:p.duration,kind:p.kind});
  }
  updateProjectiles(dt) {
    for(const p of this.projectiles) {
      if(p.done)continue;
      const a=this.actors.find(x=>x.uid===p.sourceUid),target=this.actors.find(x=>x.uid===p.targetUid);
      const t=clamp((this.time-p.start)/p.duration,0,1);if(target&&alive(target)){p.to=target.x;p.endHeight=target.y+25;}
      p.x=p.from+(p.to-p.from)*t;p.y=p.originHeight+(p.endHeight-p.originHeight)*t+(p.lob?Math.sin(t*Math.PI)*55:0);
      if(p.returning&&a)for(const victim of this.living(!a.hero))if(Math.abs(victim.x-p.x)<25&&!p.hitUids.includes(victim.uid)){p.hitUids.push(victim.uid);this.damage(a,victim,p.coefficient,p.ability);}
      const pierce=p.ability.effects?.find(e=>e.type==='piercing');
      if(pierce&&a){p.hitUids||=[];for(const victim of this.living(!a.hero))if(victim!==target&&Math.abs(victim.x-p.x)<22&&!p.hitUids.includes(victim.uid)){p.hitUids.push(victim.uid);this.damage(a,victim,pierce.coefficient,{...p.ability,effects:[]});}}
      if(t>=1){p.done=true;
        if(p.returning){if(a&&alive(a)&&!(a.statuses.stun?.until>this.time)){this.log('projectile-catch',a,null,{id:p.id});this.passive(a,'catch');}else this.log('projectile-miss',a,null,{id:p.id,reason:'catch-interrupted'});continue;}
        if(a&&target&&alive(target)&&!target.hidden){this.log('animation-marker',a,target,{marker:'projectileHit',id:p.id,x:p.x,abilityId:p.ability.id||null});
          if(p.ability.deliveryEffects){for(const e of p.ability.deliveryEffects)this.applyEffect(a,target,e);continue;}
          this.damage(a,target,p.coefficient,p.ability);
          for(const e of p.ability.effects||[])if(e.type==='splash')for(const other of this.living(!a.hero).filter(x=>x!==target&&Math.abs(x.x-target.x)<(e.radius||60)*(p.ability.areaScale||1)))this.damage(a,other,e.coefficient,p.ability);
          const ret=p.ability.effects?.find(e=>e.type==='return-shot');
          if(ret&&!p.returning&&alive(a)){this.projectiles.push({...p,id:'return-'+this.counter++,from:p.to,to:a.x,x:p.to,start:this.time,
            duration:Math.max(0.25,Math.abs(a.x-p.to)/620),originHeight:p.y,endHeight:a.y+25,targetUid:a.uid,coefficient:ret.coefficient,returning:true,hitUids:[],done:false});this.log('projectile-return',a,target,{id:p.id});}
        }else this.log('projectile-miss',a,target,{id:p.id});
      }
    }
    this.projectiles=this.projectiles.filter(p=>!p.done);
  }
  damage(source,target,coefficient,ability={}) {
    if(!alive(target)||target.hidden)return;
    if(target.vanishUntil>this.time&&ability.behavior!=='burn'){this.log('miss',source,target,{reason:'untargetable'});return;}
    if(target.blockUntil>this.time){target.answerStagger=target.blockStagger;this.log('block',target,source,{reason:'windup-guard'});return;}
    if(target.statuses.invulnerable?.until>this.time||target.stoneUntil>this.time){this.log('block',target,source,{reason:'invulnerable'});return;}
    if(!source.hero&&['strike','combo','charge'].includes(ability.behavior)&&target.y>24){this.log('miss',source,target,{reason:'airborne'});return;}
    let bonus=1+source.momentum*(source.momentumValue||.04);
    if(has(target,'airborne')&&source.definition.passive?.trigger==='airborne-target')bonus*=1+(source.definition.passive.effects.find(e=>e.type==='damage-bonus')?.value||0)*(source.mastery>=4?1.2:1);
    if(['shot','lob','beam'].includes(ability.behavior))bonus*=source.rangedDamage||1;
    if(ability.kind==='skill')bonus*=source.skillDamage||1;
    if(source.copyFallbackShots>0&&ability.kind==='basic'){bonus*=1.4;source.copyFallbackShots--;}
    if(target.statuses.weakness?.until>this.time)bonus*=1+target.statuses.weakness.value;
    if(['shot','lob'].includes(ability.behavior))bonus*=1-(target.definition.resistProjectile||Math.min(.8,(target.definition.passive?.effects?.find(e=>e.type==='reduce-projectile')?.value||0)*(target.mastery>=4?1.2:1)));
    if(target.statuses.mark?.count>0){bonus*=1+target.statuses.mark.value;target.statuses.mark.count--;}
    const guard=target.guard+(target.statuses.guard?.value||0)-(target.statuses['guard-break']?.value||0);
    const hit=hitDamage(source.nextCrit&&ability.behavior!=='burn'?{...source,critChance:Math.min(1,source.critChance+source.nextCrit)}:source,{guard},coefficient*bonus,this.random);let damage=hit.final;
    if(ability.behavior!=='burn')source.nextCrit=0;
    if(target.boss) {
      const phases=target.definition.boss.phases, next=phases[target.phase+1];
      if(next&&Number.isFinite(next.startsAtHpRatio)&&this.time-target.phaseAt<2)damage=Math.min(damage,Math.max(0,target.hp-Math.ceil(target.maxHp*next.startsAtHpRatio)));
      damage=Math.min(damage,target.maxHp*0.35);
    }
    if(target.powerup?.grantedTrait==='tiny'&&(source.boss||has(source,'heavy'))&&!target.procWave){damage=Math.round(damage*0.8);target.procWave=true;this.log('powerup-proc',target,source,{id:target.powerup.id});}
    const absorbed=Math.min(target.shield,damage);target.shield-=absorbed;damage-=absorbed;target.hp=Math.max(0,target.hp-damage);target.hitAt=this.time;
    if(absorbed>0)this.passive(target,'shield-hit',source);
    this.log('damage',source,target,{...hit,final:damage,absorbed,hp:target.hp,abilityId:ability.id||null},[ability.behavior||'effect']);
    if(source.hero)this.stats.damage[source.id]=(this.stats.damage[source.id]||0)+damage;
    if(source.action&&ability.id&&source.action.ability.id===ability.id)source.action.landedHits++;
    if(ability.kind==='basic'&&source.definition.passive?.trigger==='eight-target-hits'){
      source.breathTicks||={};source.breathTicks[target.uid]=(source.breathTicks[target.uid]||0)+1;
      if(source.breathTicks[target.uid]%8===0){if(target.boss)this.addStagger(target,15,source);else this.status(target,'slow',3,.2,source);}
    }
    if(ability.kind==='skill'&&source.answerStagger){this.addStagger(target,source.answerStagger,source);source.answerStagger=0;}
    if(target.hero){this.stats.damageTaken[target.id]+=damage;target.energy=clamp(target.energy+Math.min(6,damage/target.maxHp*120),0,100);}
    if(ability.behavior!=='burn'&&target.statuses.burn&&source.definition.passive?.trigger==='burning-target'){
      this.passive(source,'burning-target',target);
    }
    for(const e of ability.effects||[])if(['burn','slow','guard-break','mark'].includes(e.type))this.applyEffect(source,target,e);
    if(ability.behavior==='charge'&&has(target,'heavy')&&source.momentumMove&&source.momentum>0){source.momentum--;this.log('momentum-lost',source,target,{stacks:source.momentum,reason:'heavy-collision'});}
    if(ability.procEffects&&!ability.procApplied){ability.procApplied=true;for(const e of ability.procEffects)this.applyEffect(source,target,e);this.log('powerup-proc',source,target,{id:source.powerup.id});}
    if(ability.kind==='skill'&&source.powerup?.proc?.trigger==='third-skill'){source.skillHits++;if(source.skillHits%3===0&&this.time>=(source.procReadyAt||0)){source.energy=clamp(source.energy+3,0,100);source.procReadyAt=this.time+8;this.log('powerup-proc',source,target,{id:source.powerup.id});}}
    if(source.powerup?.proc?.trigger==='new-target'){
      target.itemHitBy||=[];if(!target.itemHitBy.includes(source.uid)){target.itemHitBy.push(source.uid);this.addStagger(target,10,source);}
    }
    if(target.hero&&target.hp>0)this.itemProc(target,source,{kind:'damage'});
    if(ability.behavior==='stomp'||source.action?.movement==='high-jump'){
      target.squashUntil=this.time+0.15;
      this.log('squash',source,target,{duration:0.15});
      if(has(target,'spiked')&&!target.statuses['guard-break'])source.hp=Math.max(1,source.hp-Math.round(source.maxHp*0.015));
    }
    if(target.boss||target.definition.size==='elite'){this.addStagger(target,ability.behavior==='stomp'?12:ability.kind==='ultimate'?8:4,source);if(target.boss)this.phase(target);}
    if(target.statuses.counter&&source.hero!==target.hero&&target.statuses.counter.until>this.time){const counter=target.statuses.counter;delete target.statuses.counter;target.x=clamp(source.x-40,30,970);this.log('counter',target,source,{x:target.x});this.damage(target,source,counter.value,{behavior:'strike'});}
    if(!alive(target))this.knockout(target,source,ability);
  }
  knockout(target,source,ability={}) {
    if(target.defeatedAt!==null)return;
    target.defeatedAt=this.time;target.action=null;target.state='knockout';target.copy=null;target.y=0;
    this.log('knockout',source,target,{x:target.x,flatten:target.id==='goomba'||ability.behavior==='stomp',spriteKey:target.spriteKey});
    if(target.hero)this.stats.knockouts.push(target.id);
    else {this.kills++;if(source?.hero){source.energy=clamp(source.energy+3,0,100);this.passive(source,'on-kill',target);}
      if(has(target,'shell'))this.shells.push({id:'shell-'+this.counter++,x:target.x,y:0,start:this.time,sourceUid:source?.uid,hero:source?.hero||false,attack:target.attack*2,kicked:false,velocity:0,hits:[],bounces:0});
      if(source?.definition.copyLibrary&&target.definition.copyAbilityId&&source.action?.ability.effects?.some(e=>e.type==='copy'))this.copy(source,target);
      if(target.definition.size==='elite'&&target.definition.copyAbilityId){
        this.log('ability-star',target,null,{ability:target.definition.copyAbilityId});
        for(const kirby of this.living(true).filter(a=>a.definition.copyLibrary))this.copy(kirby,{...target,stagger:100});
      }
      if(target.definition.size==='boss')for(const partner of this.living(false).filter(a=>a.definition.id===target.definition.id)){
        this.status(partner,'haste',99,0.25);partner.attack*=1.15;partner.phase++;partner.phaseAt=this.time;
        this.log('boss-phase',partner,null,{phase:'survivor-enrage'});this.stats.bossPhases.push(partner.name+': survivor-enrage');
      }
    }
  }
  actionEffects(a,target,ability) {
    for(const e of ability.effects||[]) {
      if(e.type==='copy')this.copy(a,target);
      else if(e.type==='inhale')this.inhale(a,target,e,ability);
      else if(e.type==='entry-stomp'){for(const victim of this.living(!a.hero))this.damage(a,victim,e.coefficient,{...ability,effects:[]});this.log('entry-impact',a,target,{x:a.x});}
      else if(e.type==='airborne-followup'&&has(target,'airborne'))this.damage(a,target,e.coefficient,{...ability,effects:[]});
      else if(!['splash','finisher','line-damage','entry-stomp','multi-hit','burn','slow','guard-break','mark','return-shot','retarget-on-defeat','vanish','windup-block','airborne-followup'].includes(e.type))this.applyEffect(a,target,e);
    }
  }
  copy(a,target) {
    if(!a.definition.copyLibrary)return;
    const id=target.definition.copyAbilityId;
    const eligible=small(target)&&(target.hp/target.maxHp<0.4||!alive(target))||target.stagger>=70||target.statuses.stun?.until>this.time;
    if(id&&eligible&&a.definition.copyLibrary.includes(id)&&(!a.copy||a.copyPolicy!=='never-replace')){
      if(a.copyPolicy!=='recommended'&&COPY_PROFILES[a.copyPolicy]&&a.copy&&id!==a.copyPolicy)return;
      a.copy=id;a.copyFallbackShots=0;this.log('copy-acquired',a,target,{ability:id,spriteKey:COPY_PROFILES[id].spriteKey});
    }else if(!id||!a.definition.copyLibrary.includes(id)){
      a.copyFallbackShots=3;a.skillIn*=0.6;this.log('copy-fallback',a,target,{ability:id||'none',shots:3,refund:0.4});
    }
  }
  inhale(a,target,e,ability) {
    this.log('inhale',a,target,{from:target.x,to:a.x,eligible:small(target),duration:0.6});
    for(const p of this.projectiles.filter(p=>p.hero!==a.hero&&Math.abs(p.x-a.x)<220)){
      p.done=true;this.log('projectile-consume',a,null,{id:p.id});this.projectile(a,target,{behavior:'shot',effects:[]},1.5);
    }
    if(small(target)){target.x=clamp(target.x-a.direction*(e.pull||65),30,970);
      if(e.threshold>0&&target.hp/target.maxHp<=e.threshold){this.copy(a,target);target.hp=0;this.log('swallow',a,target,{ability:target.definition.copyAbilityId});this.knockout(target,a,ability);}
    }else {this.addStagger(target,18,a);this.log('inhale-fallback',a,target,{reason:target.boss?'boss':'elite',star:true});}
  }
  applyEffect(source,target,e) {
    const allies=this.living(source.hero),enemies=this.living(!source.hero), duration=e.durationSeconds||4;
    switch(e.type) {
      case 'heal':this.heal(source,target,e.coefficient);break;
      case 'heal-party':for(const a of allies)this.heal(source,a,e.coefficient);break;
      case 'shield':target.shield+=source.attack*e.coefficient;target.shieldUntil=this.time+10;this.log('shield',source,target,{amount:Math.round(source.attack*e.coefficient)});break;
      case 'shield-self':source.shield+=source.attack*e.coefficient;source.shieldUntil=this.time+8;this.log('shield',source,source,{amount:Math.round(source.attack*e.coefficient)});break;
      case 'shield-burst':this.applyEffect(source,source,{type:'shield-self',coefficient:e.coefficient});source.shieldBurst={until:this.time+duration,coefficient:e.burstCoefficient};break;
      case 'shield-party':for(const a of allies)this.applyEffect(source,a,{type:'shield',coefficient:e.coefficient});break;
      case 'burn':this.status(target,'burn',e.durationSeconds||5,source.attack*0.12,source);break;
      case 'slow':this.status(target,'slow',duration,e.value||0.25,source);break;
      case 'guard-break':this.status(target,'guard-break',duration,25,source);break;
      case 'mark':target.statuses.mark={until:this.time+8,value:e.value||0.15,count:e.count||3};break;
      case 'party-haste':for(const a of allies)this.status(a,'haste',duration,e.value||0.15);break;
      case 'haste':this.status(source,'haste',duration,e.value);break;
      case 'guard':this.status(source,'guard',duration,e.amount||8);break;
      case 'party-guard':for(const a of allies)this.status(a,'guard',duration,e.amount);break;
      case 'party-energy':for(const a of allies){a.energy=clamp(a.energy+e.amount,0,100);this.log('energy',source,a,{amount:e.amount});}break;
      case 'energy':source.energy=clamp(source.energy+e.amount,0,100);break;
      case 'next-crit':source.nextCrit=e.value;break;
      case 'cleanse-party':for(const a of allies)for(const name of ['slow','stun','burn'])delete a.statuses[name];this.log('cleanse',source,null,{party:true});break;
      case 'cleanse-self':for(const name of ['slow','stun'])delete source.statuses[name];this.log('cleanse',source,source,{party:false});break;
      case 'stagger':this.addStagger(target,e.amount,source);break;
      case 'boss-stagger':for(const a of enemies.filter(x=>x.boss))this.addStagger(a,e.amount,source);break;
      case 'target-stagger':this.addStagger(target,e.amount,source);break;
      case 'reveal-weakness':for(const a of enemies.filter(x=>x.boss))this.status(a,'weakness',duration,0.12,source);break;
      case 'knockback':if(target.powerup?.proc?.effects?.some(e=>e.type==='ignore-minor-knockback')&&!target.procWave){target.procWave=true;this.log('powerup-proc',target,source,{id:target.powerup.id});break;}if(target.boss)this.addStagger(target,12,source);else target.x=clamp(target.x+source.direction*(e.amount||40),30,970);break;
      case 'stone':source.stoneUntil=this.time+duration;this.log('move-state',source,null,{state:'stone',until:source.stoneUntil});break;
      case 'shell-guard':this.status(source,'guard',duration,e.guard||45);this.status(source,'taunt',duration,1);source.stoneUntil=this.time+1;this.log('move-state',source,null,{state:'shell',until:this.time+duration});break;
      case 'counter':this.status(source,'counter',duration,e.coefficient||1.45);this.status(source,'guard',duration,80);break;
      case 'momentum':source.momentum=Math.min(e.max||3,source.momentum+1);source.momentumValue=e.value||.04;source.momentumMove=e.movePerStack||0;break;
      case 'next-action-area':source.nextAreaScale=1+e.value;break;
      case 'cooldown-refund':source.skillIn=Math.max(0,source.skillIn-e.seconds);break;
      case 'summon':if(enemies.length<8&&this.actors.filter(x=>x.id===e.enemyId&&!x.hero&&alive(x)).length<(e.limit||2))this.spawn({enemyId:e.enemyId,index:0,entry:'right'});break;
      case 'rescue-lowest-hp-ally':{const a=allies.sort((a,b)=>a.hp/a.maxHp-b.hp/b.maxHp)[0];if(a){a.x=a.anchor;a.action=null;this.log('rescue',source,a,{x:a.x});}}break;
      case 'line-damage':for(const a of enemies)this.damage(source,a,e.coefficient,{behavior:'charge'});break;
    }
  }
  heal(source,target,coefficient) {
    const amount=Math.min(target.maxHp-target.hp,Math.round(source.attack*coefficient*(target.healingReceived||1)));
    target.hp+=amount;this.log('heal',source,target,{amount});if(source.hero)this.stats.healing[source.id]=(this.stats.healing[source.id]||0)+amount;
    if(amount>0&&this.stats.knockouts.length&&target.powerup?.proc?.trigger==='heal-after-ko'&&!target.procUsed){target.procUsed=true;this.applyEffect(target,target,target.powerup.proc.effects[0]);this.log('powerup-proc',target,null,{id:target.powerup.id});}
  }
  status(a,type,duration,value,source=null) {
    if(['slow','stun'].includes(type)){
      const resistance=Math.min(1,(a.definition.passive?.effects?.find(e=>e.type==='control-resist')?.value||0)*(a.mastery>=4?1.2:1));
      if(a.statuses['control-immunity']?.until>this.time||resistance>=1){this.log('block',a,source,{reason:'control-immunity'});return;}
      duration*=1-resistance;
    }
    if(type==='stun'&&a.momentumMove&&a.momentum>0){a.momentum--;this.log('momentum-lost',a,null,{stacks:a.momentum,reason:'stun'});}
    a.statuses[type]={until:this.time+duration,value,sourceUid:source?.uid};this.log('status-add',source||a,a,{type,duration,value});if(a.hero&&['burn','slow','stun'].includes(type))this.stats.conditions++;
  }
  updateConditions(a,dt) {
    for(const [name,s] of Object.entries(a.statuses)) {
      if(s.until<=this.time){delete a.statuses[name];if(name==='stun')a.stagger=0;this.log('status-remove',a,null,{type:name});}
      else if(name==='burn'){s.tick=(s.tick||0)+dt;if(s.tick>=1){s.tick-=1;const source=this.actors.find(x=>x.uid===s.sourceUid);if(source)this.damage(source,a,s.value/source.attack,{behavior:'burn'});}}
    }
    if(a.shieldUntil<this.time)a.shield=0;
    if(a.shieldBurst&&(a.shield<=0||a.shieldBurst.until<=this.time)){
      const burst=a.shieldBurst;delete a.shieldBurst;this.log('shield-burst',a,null,{x:a.x});
      for(const enemy of this.living(!a.hero).filter(e=>Math.abs(e.x-a.x)<140))this.damage(a,enemy,burst.coefficient,{behavior:'beam',kind:'skill'});
    }
    if(a.vanishUntil&&a.vanishUntil<=this.time){a.vanishUntil=0;this.log('vanish-end',a,null,{x:a.x});this.passive(a,'vanish-end');}
    if(a.shellKickAt&&this.time>=a.shellKickAt){a.shellKickAt=null;
      const shell={id:'shell-'+this.counter++,x:a.x,y:0,start:this.time,hero:a.hero,sourceUid:a.uid,kicked:false,hits:[],bounces:0};this.shells.push(shell);this.kickShell(shell,a);
    }
    if(a.hero&&a.hp/a.maxHp<0.45&&!a.shellUsed&&a.definition.passive?.effects?.some(e=>e.type==='loose-shell')) {
      a.shellUsed=true;a.stoneUntil=this.time+(a.mastery>=4?1.68:1.4);a.shellKickAt=a.stoneUntil;this.log('move-state',a,null,{state:'shell',until:a.stoneUntil});
    }
    if(a.hero&&a.definition.passive?.trigger==='low-hp'&&a.hp/a.maxHp<.4&&!(a.statuses.haste?.until>this.time))this.passive(a,'low-hp');
    if(a.hero&&a.definition.passive?.trigger==='low-ally'&&this.living(true).some(ally=>ally!==a&&ally.hp/ally.maxHp<.4)&&!(a.statuses.guard?.until>this.time))this.passive(a,'low-ally');
  }
  passive(a,trigger,target) {
    const p=a.definition.passive;if(!p||p.trigger!==trigger)return;
    for(const e of techniqueAbility(p,a.mastery,'passive').effects)this.applyEffect(a,target||a,e);
  }
  itemProc(a,target,ability) {
    const p=a.powerup?.proc;if(!p||!target||!alive(target))return;
    const low=['below-hp','basic-below-hp'].includes(p.trigger)&&a.hp/a.maxHp<(p.hpRatio||0.4)&&!(p.usesPerWave?a.procWave:a.procUsed)&&(p.trigger!=='basic-below-hp'||ability.kind==='basic');
    if(low){if(p.usesPerWave)a.procWave=true;else a.procUsed=true;for(const e of p.effects){if(e.type==='invulnerable')this.status(a,'invulnerable',e.durationSeconds,1);else if(e.type==='control-immunity')this.status(a,'control-immunity',e.durationSeconds,1);else this.applyEffect(a,a,e);}this.log('powerup-proc',a,target,{id:a.powerup.id});}
  }
  addStagger(a,amount,source) {
    if((!a.boss&&a.definition.size!=='elite')||!alive(a)||a.statuses.stun?.until>this.time)return;
    a.stagger=clamp(a.stagger+amount,0,100);this.log('stagger',source,a,{amount,total:a.stagger});
    if(a.stagger>=100){this.status(a,'stun',a.definition.boss?.staggerDurationSeconds||5,1);a.action=null;a.phaseAt=this.time;a.y=0;this.log(a.boss?'boss-staggered':'elite-staggered',a,null,{duration:5});if(a.boss)this.checkAssist('boss-staggered');
      if(a.definition.copyAbilityId)for(const kirby of this.living(true).filter(k=>k.definition.copyLibrary))this.copy(kirby,{...a,stagger:100});
    }
  }
  phase(a) {
    const phases=a.definition.boss.phases,next=phases[a.phase+1];
    if(next&&a.hp/a.maxHp<=next.startsAtHpRatio){a.phase++;a.phaseAt=this.time;a.action=null;a.readyIn=1.5;this.stats.bossPhases.push(a.name+': '+next.id);this.log('boss-phase',a,null,{phase:next.id});
      if(next.guardChange)a.guard=Math.max(0,a.guard+next.guardChange);
      if(next.attackMultiplier)a.attack*=next.attackMultiplier;
      if(next.hasteBonus)a.haste=(a.haste||0)+next.hasteBonus;
      for(const add of next.adds||[])for(let i=0;i<add.count;i++)this.spawn({enemyId:add.enemyId,index:i,entry:'right'});
      this.checkAssist('boss-phase-start');
      for(const hero of this.living(true))if(hero.definition.copyLibrary&&a.definition.copyAbilityId)this.copy(hero,{...a,stagger:100});
    }
  }
  kickShell(s,a) {s.kicked=true;s.sourceUid=a.uid;s.hero=a.hero;s.velocity=a.direction*330;this.log('shell-kick',a,null,{id:s.id,x:s.x,direction:a.direction});}
  updateShells(dt) {
    for(const s of this.shells) {
      if(!s.kicked&&this.time-s.start>0.6){const a=this.living(s.hero).sort((a,b)=>Math.abs(a.x-s.x)-Math.abs(b.x-s.x))[0];if(a)this.kickShell(s,a);}
      if(!s.kicked)continue;s.x+=s.velocity*dt;
      const source=this.actors.find(x=>x.uid===s.sourceUid);
      if(source)for(const a of this.living(!s.hero))if(Math.abs(a.x-s.x)<34&&!s.hits.includes(a.uid)){s.hits.push(a.uid);this.log('shell-collision',source,a,{id:s.id});this.damage(source,a,1.1,{behavior:'charge'});}
      if((s.x<30||s.x>970)&&s.bounces<1){s.velocity*=-1;s.x=clamp(s.x,30,970);s.bounces++;}
    }
    this.shells=this.shells.filter(s=>this.time-s.start<4&&s.x>-20&&s.x<1020);
  }
  checkAssist(trigger='tick') {
    const assist=this.assist;if(!assist||this.time<this.assistReadyAt)return;
    const t=assist.trigger;
    if(t.usesPerStage&&this.assistUses>=t.usesPerStage||t.usesPerWave&&this.assistWaveUses>=t.usesPerWave)return;
    const allies=this.living(true),enemies=this.living(false);
    let ready=t.type===trigger;
    if(t.type==='ally-below-hp')ready=allies.some(a=>a.hp/a.maxHp<t.hpRatio);
    if(t.type==='allies-below-hp')ready=allies.filter(a=>a.hp/a.maxHp<t.hpRatio).length>=t.count;
    if(t.type==='crowd')ready=enemies.length>=t.count;
    if(t.type==='long-lived-target')ready=enemies.some(e=>(!t.targetKind||e.definition.size===t.targetKind)&&this.time-e.spawnAt>=t.afterSeconds);
    if(t.type==='low-energy')ready=this.time>=t.afterSeconds&&allies.reduce((sum,a)=>sum+a.energy,0)<35;
    if(t.type==='party-condition')ready=allies.filter(a=>a.statuses.burn||a.statuses.slow).length>=t.count;
    if(t.type==='marked-projectile')ready=this.projectiles.some(p=>!p.hero);
    if(!ready||!allies.length)return;
    this.assistUses++;this.assistWaveUses++;this.assistReadyAt=this.time+(t.cooldownSeconds??20);this.stats.assists++;
    const source={uid:'assist-'+assist.id,id:assist.id,hero:true,attack:allies.reduce((s,a)=>s+a.attack,0)/allies.length*this.assistStrength,direction:1,energy:0,statuses:{},definition:{},momentum:0,critChance:0};
    this.log('assist',source,null,{id:assist.id,name:assist.name,effects:assist.effects});
    const target=enemies[0]||allies[0];for(const raw of assist.effects){const e={...raw};if(e.amount)e.amount*=this.assistStrength;if(e.value)e.value*=this.assistStrength;
      if(e.type==='heal')this.applyEffect(source,[...allies].sort((a,b)=>a.hp/a.maxHp-b.hp/b.maxHp)[0],e);else if(e.type==='destroy-triggering-projectile')this.projectiles=this.projectiles.filter(p=>p.hero);else if(e.type==='shield-row')for(const a of allies.filter(a=>a.row==='back'))this.applyEffect(source,a,{type:'shield',coefficient:e.coefficient});else this.applyEffect(source,target,e);
    }
    for(const ally of allies)if(ally.powerup?.proc?.trigger==='assist'&&!ally.procWave){ally.procWave=true;for(const e of ally.powerup.proc.effects)this.applyEffect(ally,ally,e);this.log('powerup-proc',ally,target,{id:ally.powerup.id});}
  }
  hazard() {
    for(const a of this.living(true))if(a.y<12&&!has(a,'airborne')){
      const avoidance=a.powerup?.proc?.effects?.some(e=>e.type==='slide-through-hazard'||e.type==='ignore-low-hazard');
      if(avoidance&&this.time>=(a.hazardProcAt||0)){a.hazardProcAt=this.time+(a.powerup.proc.cooldownSeconds||8);this.log('powerup-proc',a,null,{id:a.powerup.id,hazard:true});continue;}
      const damage=Math.round(a.maxHp*(has(a,'fire')?0.005:0.015));a.hp=Math.max(1,a.hp-damage);this.log('hazard-hit',null,a,{amount:damage,x:a.x});}
  }
  clearWave() {
    this.wavesCleared++;this.log('wave-clear',null,null,{wave:this.waveIndex+1});
    this.checkAssist('wave-clear');
    for(const a of this.living(true)){
      const bonus=a.powerup?.proc?.trigger==='wave-clear'?(a.powerup.proc.effects.find(e=>e.type==='heal-bonus')?.value||0):0;
      this.heal(a,a,0.5*(1+bonus));this.passive(a,'wave-clear');a.y=0;
      if(bonus)this.log('powerup-proc',a,null,{id:a.powerup.id});
    }
    if(this.waveIndex===this.encounter.waves.length-1)this.end(true);
    else this.wait=RULES.waveBreath;
  }
  end(win,reason='') {
    this.done=true;this.win=win;this.reason=reason;this.log('battle-end',null,null,{win,reason,seconds:this.time});
    for(const a of this.actors){if(a.encounterLoan)this.log('encounter-loan-end',a,null,{id:a.encounterLoan});a.action=null;a.copy=null;a.encounterLoan=null;a.state=win?'victory':'knockout';a.y=0;}
  }
  report() {return {runId:this.runId,encounterId:this.encounter.id,mode:this.mode,win:this.win,reason:this.reason,seconds:Math.round(this.time),
    rank:this.rank,threat:this.threat,waves:this.wavesCleared,kills:this.kills,stats:structuredClone(this.stats),seed:this.seed,
    assistId:this.assist?.id||null,coinBonus:Math.max(0,...this.actors.filter(a=>a.hero).map(a=>(a.definition.passive?.effects?.find(e=>e.type==='reward-multiplier'&&e.currency==='coins')?.value||0)*(a.mastery>=4?1.2:1))),
    party:this.actors.filter(a=>a.hero).map(a=>({id:a.id,hp:Math.round(a.hp),maxHp:a.maxHp,secondsFielded:Math.round(a.defeatedAt??this.time)})),events:this.events.slice(-160)};}
}
