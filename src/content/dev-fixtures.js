// The playable prototype still consumes these records through data.js. They
// are deliberately absent from the production index and player-facing queries.

export const DEV_ROSTER = [
  { id: 'mario', name: 'Mario', rarity: 3, cls: 'Warrior', family: 'mario', attackStyle: 'stomp', color: '#e44736', art: { icon: 'demos/strip/mario.webp', alt: 'demos/strip/mario-jump.webp' } },
  { id: 'walter', name: 'Walter White', rarity: 3, cls: 'Ranger', family: 'walter-white', attackStyle: 'shot', color: '#b9b3a0', art: { icon: 'demos/strip/walter.webp' } },
  { id: 'sahur', name: 'Tung Tung Tung Sahur', rarity: 3, cls: 'Warrior', family: 'sahur', attackStyle: 'combo', color: '#9b623d', art: { icon: 'demos/strip/sahur.webp' } },
  { id: 'aurelia', name: 'Aurelia Dawnblade', rarity: 5, cls: 'Warrior', color: '#ffcc33' },
  { id: 'vex', name: 'Vex the Unbound', rarity: 5, cls: 'Mage', color: '#b04cff' },
  { id: 'kiri', name: 'Kiri Nightstep', rarity: 5, cls: 'Rogue', color: '#3dd6c8' },
  { id: 'oriel', name: 'Saint Oriel', rarity: 5, cls: 'Cleric', color: '#fff3a0' },
  { id: 'juno', name: 'Juno Skypiercer', rarity: 5, cls: 'Ranger', color: '#66e070' },
  { id: 'brakka', name: 'Brakka Ironjaw', rarity: 4, cls: 'Warrior', color: '#c0623a' },
  { id: 'thorne', name: 'Thorne', rarity: 4, cls: 'Warrior', color: '#8c8cac' },
  { id: 'lumen', name: 'Lumen', rarity: 4, cls: 'Mage', color: '#6fa8ff' },
  { id: 'grimble', name: 'Grimble', rarity: 4, cls: 'Mage', color: '#9a7aff' },
  { id: 'pip', name: 'Pip Quickfingers', rarity: 4, cls: 'Rogue', color: '#e07ab8' },
  { id: 'marisol', name: 'Sister Marisol', rarity: 4, cls: 'Cleric', color: '#f0e6d0' },
  { id: 'fen', name: 'Fen Mossbow', rarity: 4, cls: 'Ranger', color: '#7cab4a' },
  { id: 'bob', name: 'Bob', rarity: 3, cls: 'Warrior', color: '#c9a27a' },
  { id: 'chad', name: 'Chad', rarity: 3, cls: 'Warrior', color: '#e09a6a' },
  { id: 'dave', name: 'Dave the Wizard', rarity: 3, cls: 'Mage', color: '#7e8fd1' },
  { id: 'steve', name: 'Stevebeard', rarity: 3, cls: 'Mage', color: '#a0a0b8' },
  { id: 'pete', name: 'Sneaky Pete', rarity: 3, cls: 'Rogue', color: '#8a6f9e' },
  { id: 'moth', name: 'Moth Boy', rarity: 3, cls: 'Rogue', color: '#b8b29a' },
  { id: 'gary', name: 'Brother Gary', rarity: 3, cls: 'Cleric', color: '#d6c7a1' },
  { id: 'nana', name: 'Nana Potts', rarity: 3, cls: 'Cleric', color: '#e6b8c8' },
  { id: 'archie', name: 'Archie', rarity: 3, cls: 'Ranger', color: '#a3b86c' },
  { id: 'twig', name: 'Twig', rarity: 3, cls: 'Ranger', color: '#9ac078' },
];

const DEV_ATTACK_STYLE_BY_HERO = {
  aurelia: 'melee', vex: 'beam', kiri: 'combo', oriel: 'lob', juno: 'shot',
  brakka: 'charge', thorne: 'stomp', lumen: 'beam', grimble: 'lob', pip: 'combo',
  marisol: 'shot', fen: 'shot', bob: 'melee', chad: 'charge', dave: 'beam',
  steve: 'lob', pete: 'combo', moth: 'charge', gary: 'shot', nana: 'lob',
  archie: 'shot', twig: 'stomp',
};

export function devAttackStyleFor(hero) {
  return hero.attackStyle || DEV_ATTACK_STYLE_BY_HERO[hero.id] || 'melee';
}

export const DEV_MUSHROOM_KINGDOM = [
  { id: 'grassland', name: 'Grassland', range: '1–10', enemies: [['Goomba', '#9b5a32'], ['Koopa Troopa', '#7fbd42'], ['Shy Guy', '#e34d4d'], ['Piranha Plant', '#52a447']], boss: ['Goomba King', '#a65f32'] },
  { id: 'underground', name: 'Underground', range: '11–20', enemies: [['Swooper', '#7555a5'], ['Dry Bones', '#ded7c4'], ['Buzzy Beetle', '#365273'], ['Spike', '#4f9b50']], boss: ['King Boo', '#eee8ff'] },
  { id: 'cloudtops', name: 'Cloudtops', range: '21–30', enemies: [['Paratroopa', '#e65e4f'], ['Lakitu', '#f2cf45'], ['Spiny', '#d8473d'], ['Fuzzy', '#292634']], boss: ['Thunder Lakitu', '#f3c72e'] },
  { id: 'airship', name: 'Airship Fleet', range: '31–40', enemies: [['Bob-omb', '#30313b'], ['Rocky Wrench', '#a76b41'], ['Bullet Bill', '#252633'], ['Mechakoopa', '#e5ad45']], boss: ['Boom Boom', '#d29a56'] },
  { id: 'castle', name: "Bowser's Castle", range: '41–50', enemies: [['Dry Bones', '#ded7c4'], ['Podoboo', '#ff6b24'], ['Hammer Bro', '#4ca34d'], ['Thwomp', '#88909b']], boss: ['Bowser', '#d6782f'] },
];

const DEV_FIXTURES_BY_ID = new Map(DEV_ROSTER.map((record) => [record.id, record]));

export function getDevFixture(id) {
  return DEV_FIXTURES_BY_ID.get(id);
}
