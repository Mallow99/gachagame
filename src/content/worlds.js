export const SAGAS = [
  { id: 'mario', name: 'Mushroom Kingdom', worldIds: ['super-mario-bros-1985'], productionStatus: 'slice' },
  { id: 'kirby', name: 'Dream Land', worldIds: ['kirbys-adventure-1993'], productionStatus: 'slice' },
];

export const AREAS = [
  { id: 'smb1-overworld', worldId: 'super-mario-bros-1985', name: 'Mushroom Overworld', stageRange: [1, 5], encounterIds: ['smb1-01', 'smb1-02', 'smb1-03', 'smb1-04', 'smb1-05'], productionStatus: 'slice' },
  { id: 'smb1-high-roads', worldId: 'super-mario-bros-1985', name: 'Open Water & High Roads', stageRange: [6, 10], encounterIds: [6,7,8,9,10].map(n=>'smb1-'+String(n).padStart(2,'0')), productionStatus: 'slice' },
  { id: 'smb1-dark-world', worldId: 'super-mario-bros-1985', name: "Dark World & Bowser's Castle", stageRange: [11, 15], encounterIds: [11,12,13,14,15].map(n=>'smb1-'+n), productionStatus: 'slice' },
  ...['Vegetable Valley','Butter Building & Grape Garden','Yogurt Yard & Orange Ocean','Rainbow Resort & Fountain of Dreams'].map((name,i)=>({
    id:['ka-valley','ka-garden','ka-ocean','ka-resort'][i],worldId:'kirbys-adventure-1993',name,stageRange:[i*5+1,i*5+5],
    encounterIds:Array.from({length:5},(_,j)=>'ka-'+String(i*5+j+1).padStart(2,'0')),productionStatus:'slice'})),
];

export const WORLDS = [
  {
    id: 'super-mario-bros-1985', sagaId: 'mario', name: 'Super Mario Bros.', releaseYear: 1985, length: 15,
    areaIds: ['smb1-overworld', 'smb1-high-roads', 'smb1-dark-world'],
    atlas: { rankRequired: 0, prerequisiteWorldIds: [], keyCost: 0, keyReward: 1 },
    threat: { authoredMin: 1, authoredMax: 15 },
    bannerIds: ['smb1-overworld-fighter', 'smb1-overworld-powerup-cache', 'smb1-overworld-assist-call'],
    implementedEncounterIds: Array.from({length:15},(_,i)=>'smb1-'+String(i+1).padStart(2,'0')),
    productionStatus: 'slice',
  },
];
WORLDS.push({ id:'kirbys-adventure-1993',sagaId:'kirby',name:"Kirby's Adventure",releaseYear:1993,length:20,
  areaIds:['ka-valley','ka-garden','ka-ocean','ka-resort'],atlas:{rankRequired:3,prerequisiteWorldIds:[],keyCost:1,keyReward:1},
  threat:{authoredMin:16,authoredMax:35},bannerIds:['ka-fighter','ka-powerup-cache','ka-assist-call'],
  implementedEncounterIds:Array.from({length:20},(_,i)=>'ka-'+String(i+1).padStart(2,'0')),productionStatus:'slice' });
for (const [id,name,year,length] of [['kirbys-dream-land-1992',"Kirby's Dream Land",1992,10],['kirby-super-star-1996','Kirby Super Star',1996,25],['kirbys-return-to-dream-land-2011',"Kirby's Return to Dream Land",2011,25]]) {
  WORLDS.push({id,sagaId:'kirby',name,releaseYear:year,length,areaIds:[],atlas:{rankRequired:12,keyCost:1,keyReward:1},threat:{authoredMin:16,authoredMax:80},bannerIds:[],implementedEncounterIds:[],productionStatus:'planned'});
}
