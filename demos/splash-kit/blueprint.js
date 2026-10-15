// Storyboard receipts only. This page never spends currency or creates fighters.
const palette = { R: '#58cfff', SR: '#dbe5f0', SSR: '#ffd34f', UR: '#c2a7ff' };
const areas = {
  dream: { name: 'Dream Land', origin: 'Fountain', carrier: 'Warp Star', travel: 'Water reverse · glass flecks', fighter: 'KING\nDEDEDE' },
  mushroom: { name: 'Mushroom Kingdom', origin: 'pipe', carrier: 'Question Block', travel: 'Pipe resonance · coin flecks', fighter: 'MARIO' },
};

function opening(tier) {
  const omen = {
    R: ['The blue stays steady', 'The mote completes its orbit in blue.', 'Stable travel tone'],
    SR: ['Silver current wraps the mote', 'A silver edge and charged wake promise at least SR.', 'Metallic shimmer · charged snap'],
    SSR: ['Gold becomes the area’s carrier', 'The mote becomes a gold {carrier}. The fighter is still unknown.', 'Transformation chime · engine flare'],
    UR: ['The carrier splits the spectrum', 'A prismatic {carrier} and spectral trails promise UR.', 'Spectrum rise · deep resonance'],
  }[tier];
  return [
    [0, 'commit', 'Committed result', 'The receipt locks first', 'The button answers immediately; the sequence follows the saved result.', 'Dry confirmation hit · music ducks 2 dB'],
    [260, 'gather', 'Area origin', 'The {origin} wakes', 'Fragments gather into the same neutral blue mote.', '{travel} · low pulse'],
    [760, 'launch', 'Rise from the origin', 'Rise out, then enter the orbit', 'The mote rises out of the {origin}, then bends left into the visible orbit.', 'Pitch climb · acceleration ticks'],
    [1350, 'orbit', 'Around the area', 'Cross the far side, then circle back', 'The carrier travels around the scene. The drawn loop shows the complete route.', 'Travel wind · area ambience'],
    [2150, 'omen', `${tier} warning`, ...omen],
    [3000, 'approach', 'Turn toward the player', 'Curve out of the orbit into the screen', 'After one complete lap, the carrier turns inward and grows as it approaches the camera.', 'Approach rush · music drains'],
  ];
}

function single(tier) {
  const cinematic = ['SSR', 'UR'].includes(tier);
  const ur = tier === 'UR';
  const beats = opening(tier);
  if (cinematic) {
    const delay = ur ? 300 : 0;
    beats.push(
      [3400, 'blackout', `${tier} interruption`, 'The room goes silent', 'A true blackout separates approach from impact. No character or name.', `Music and ambience cut · ${ur ? 500 : 200} ms silence`],
      [3600 + delay, 'impact', `${tier} contact`, ur ? 'Spectrum fractures across the screen' : 'The carrier strikes the screen', ur ? 'A white core splits into spectral edges, then collapses to darkness.' : 'A compact gold-white hit answers the approach.', ur ? 'Deep hit · crystalline fracture · delayed sub' : 'Sub hit · crack · area shock'],
      [3830 + delay, 'afterimage', 'Make room for the voice', 'Let the impact decay', 'The screen darkens again; the fighter remains concealed.', 'Impact tail only'],
      [4070 + delay, 'voice', 'Identity withheld', 'Voice and quote lead the entrance', 'Only the line appears. The character and name are still completely hidden.', 'Clean voice centered · music -9 dB · sparse ambience'],
      [4900 + delay, 'hint', 'On the decisive word', 'A silhouette answers the line', 'The first character edge arrives on the chosen word.', 'One timed character whoosh'],
      [5170 + delay, 'art', `${tier} character entrance`, ur ? 'The UR fighter takes the stage' : 'The fighter lands solidly', ur ? 'A longer entrance reserves space for an authored character action.' : 'The full character lands with a camera response and active surroundings.', ur ? 'Entrance hit · extended character sting' : 'Entrance hit · short character sting'],
      [5600 + delay, 'plate', 'Identity confirmed', 'Name follows the character', 'Rarity, name, source and year arrive after the body.', 'Theme resolves after the voice'],
      [ur ? 7100 : 6200, 'hold', 'Player control', 'The character stays with you', 'The player decides when to continue.', 'Low loop only'],
    );
  } else {
    beats.push(
      [3400, 'impact', `${tier} contact`, tier === 'SR' ? 'A silver impact opens the stage' : 'A light blue impact opens the stage', 'The impact leads straight into a solid character arrival.', tier === 'SR' ? 'Charged snap · medium hit' : 'Light blue pop'],
      [3650, 'art', 'Every fighter appears', 'A character entrance at every rarity', tier === 'SR' ? 'Silver energy frames a stronger entrance and a short character action.' : 'The fighter enters quickly, settles and remains fully visible.', tier === 'SR' ? 'Character whoosh · silver two-note accent' : 'Quick entrance whoosh · footfall'],
      [tier === 'SR' ? 4150 : 4000, 'plate', 'Identity confirmed', 'A name beside the fighter', 'A floating name and rarity identify the character on the stage.', 'Short name accent'],
      [tier === 'SR' ? 4800 : 4450, 'hold', 'Player control', 'The fighter remains on stage', 'A shorter entrance still ends with a character you can look at.', 'Quiet area loop'],
    );
  }
  return { label: `Single ${tier}`, tier, duration: ur ? 7500 : cinematic ? 6500 : tier === 'SR' ? 5000 : 4700, beats };
}

const scenarios = {
  r: single('R'), sr: single('SR'), ssr: single('SSR'), ur: single('UR'),
  ten: {
    label: 'Ten-pull + SSR', tier: 'SSR', duration: 14300,
    rarities: ['R', 'R', 'SR', 'R', 'R', 'SSR', 'R', 'SR', 'R', 'R'],
    beats: [
      ...opening('SSR'),
      [3400, 'impact', 'One opening for the set', 'Ten lights leave the carrier', 'All ten committed results take their places in order.', 'Heavy impact · ten glass pings'],
      [3750, 'seals', 'Roster stage', 'Ten closed lights wait', 'Each light opens into a character. Unopened positions stay visible.', 'Lights settle left to right'],
      [4250, 'arrival', 'Slot 1 · R', 'First fighter enters', 'A quick character entrance leaves a small fighter on the roster stage.', 'Whoosh · footfall', 1],
      [4950, 'arrival', 'Slot 2 · R', 'Second fighter enters', 'Every fighter gets the same basic entrance.', 'Whoosh · footfall', 2],
      [5650, 'arrival', 'Slot 3 · SR', 'Silver frames the third fighter', 'A stronger entrance gets a little more time.', 'Silver accent · character landing', 3],
      [6650, 'arrival', 'Slot 4 · R', 'Fourth fighter enters', 'Return to the quick character rhythm.', 'Whoosh · footfall', 4],
      [7350, 'arrival', 'Slot 5 · R', 'Fifth fighter enters', 'The established rhythm gives the SSR interruption weight.', 'Whoosh · footfall', 5],
      [8050, 'blackout', 'Slot 6 · SSR', 'The roster stage goes quiet', 'The sixth fighter is still concealed.', 'Cadence cuts · 200 ms silence', 5],
      [8250, 'impact', 'SSR contact', 'The sixth light hits back', 'The elevated interruption earns a stronger impact.', 'Sub hit · crack · area shock', 5],
      [8500, 'voice', 'Identity withheld', 'Voice before character', 'The quote leads while the roster and character remain hidden.', 'Clean voice centered · music -9 dB', 5],
      [9300, 'art', 'Slot 6 · SSR entrance', 'The SSR fighter enters', 'The full character pays off the interruption.', 'Entrance hit · character sting', 6],
      [9750, 'plate', 'Identity confirmed', 'Name follows the character', 'The sixth result settles before the roster resumes.', 'Theme resolves briefly', 6],
      [10300, 'arrival', 'Slot 7 · R', 'Seventh fighter enters', 'The roster returns with the first six characters retained.', 'Whoosh · footfall', 7],
      [11000, 'arrival', 'Slot 8 · SR', 'Another silver entrance', 'SR still receives its own stronger arrival.', 'Silver accent · character landing', 8],
      [12000, 'arrival', 'Slot 9 · R', 'Ninth fighter enters', 'Every result becomes a character on the stage.', 'Whoosh · footfall', 9],
      [12700, 'arrival', 'Slot 10 · R', 'The final fighter enters', 'Let the final arrival settle before the overview.', 'Whoosh · footfall', 10],
      [13700, 'results', 'Complete roster', 'Ten characters stay inspectable', 'The final roster preserves NEW, duplicate and Echo details in the finished game.', 'Result-settle chord', 10],
    ],
  },
};

const $ = id => document.getElementById(id);
const stage = $('stage');
const scrubber = $('scrubber');
const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)');
let key = 'ssr', current = 0, playing = false, startedAt = 0, frame = 0;

for (const [scenarioKey, scenario] of Object.entries(scenarios)) {
  scenario.beats = scenario.beats.map(([at, phase, kicker, title, visual, sound, revealed = 0]) => ({ at, phase, kicker, title, visual, sound, revealed }));
  const button = document.createElement('button');
  button.type = 'button';
  button.textContent = scenario.label;
  button.dataset.scenario = scenarioKey;
  button.addEventListener('click', () => selectScenario(scenarioKey));
  $('scenarioButtons').append(button);
}

function textFor(value) {
  const area = areas[$('areaSelect').value];
  return value.replace(/\{(origin|carrier|travel)\}/g, (_, name) => area[name]);
}

function pause() {
  playing = false;
  cancelAnimationFrame(frame);
}

function selectScenario(next) {
  pause(); key = next; current = 0;
  const scenario = scenarios[key];
  scrubber.max = scenario.duration;
  $('duration').textContent = `/ ${(scenario.duration / 1000).toFixed(2)} s`;
  $('seals').replaceChildren();
  for (const rarity of scenario.rarities || []) {
    const seal = document.createElement('i');
    seal.dataset.rarity = rarity;
    seal.style.setProperty('--seal', palette[rarity]);
    $('seals').append(seal);
  }
  buildRail(); render();
}

function buildRail() {
  $('beatRail').replaceChildren();
  scenarios[key].beats.forEach(beat => {
    const item = document.createElement('li');
    const button = document.createElement('button');
    button.type = 'button';
    const time = document.createElement('span');
    time.textContent = `${(beat.at / 1000).toFixed(2)} s`;
    const title = document.createElement('b');
    title.textContent = textFor(beat.title);
    button.append(time, title);
    button.addEventListener('click', () => { pause(); current = beat.at; render(); });
    item.append(button); $('beatRail').append(item);
  });
}

function render() {
  const scenario = scenarios[key];
  const area = areas[$('areaSelect').value];
  let index = 0;
  while (index + 1 < scenario.beats.length && scenario.beats[index + 1].at <= current) index++;
  const beat = scenario.beats[index];
  const fighterTier = scenario.rarities && beat.revealed ? scenario.rarities[beat.revealed - 1] : scenario.tier;
  stage.dataset.phase = beat.phase;
  stage.dataset.tier = scenario.tier;
  stage.dataset.fighterTier = fighterTier;
  stage.dataset.area = $('areaSelect').value;
  stage.dataset.batch = String(Boolean(scenario.rarities));
  stage.dataset.signal = String(current >= 2150);
  stage.dataset.character = fighterTier === 'SSR' ? $('areaSelect').value : 'generic';
  stage.style.setProperty('--fighter-tier', palette[fighterTier]);
  $('stageScope').textContent = ['art', 'plate', 'hold', 'arrival'].includes(beat.phase) ? 'Fighter entrance' : current >= 3750 && scenario.rarities ? 'Shared result director' : `${area.name} · shared sequence`;
  for (const [id, value] of [['stageKicker', beat.kicker], ['stageTitle', beat.title], ['stageVisual', beat.visual], ['soundCue', beat.sound]]) $(id).textContent = textFor(value);
  $('clock').textContent = (current / 1000).toFixed(2);
  scrubber.value = current;
  $('playBtn').textContent = playing ? 'Pause storyboard' : current >= scenario.duration ? 'Replay storyboard' : 'Play storyboard';
  document.querySelectorAll('[data-scenario]').forEach(button => button.setAttribute('aria-pressed', String(button.dataset.scenario === key)));
  [...$('beatRail').children].forEach((item, i) => item.classList.toggle('active', i === index));
  $('nameplate').querySelector('span').textContent = fighterTier;
  $('nameplate').querySelector('b').textContent = fighterTier === 'SSR' ? area.fighter : `${fighterTier}\nFIGHTER`;
  $('figureLabel').textContent = ['SSR', 'UR'].includes(fighterTier) ? 'layered character art' : 'full character entrance';
  const figure = stage.querySelector('.figure');
  if (['art', 'arrival'].includes(beat.phase) && !reducedMotion.matches) {
    const settle = 1 - Math.min(1, (current - beat.at) / 220);
    figure.style.transform = `translate(${settle * 15}%, ${settle * 8}%)`;
  } else figure.style.removeProperty('transform');
  [...$('seals').children].forEach((seal, i) => {
    seal.classList.toggle('revealed', i < beat.revealed);
    seal.classList.toggle('current', i === beat.revealed - 1 && beat.phase === 'arrival');
  });
  // Rise out of the origin, complete a full lap, then curve toward the camera.
  // Time-derived positions also work when scrubbing.
  const launch = Math.max(0, Math.min(1, (current - 760) / 590));
  const lap = Math.max(0, Math.min(1, (current - 1350) / 1650));
  const approach = Math.max(0, Math.min(1, (current - 3000) / 400));
  let x = 50 - 33 * Math.cos(lap * Math.PI * 2);
  let y = 58 - 23 * Math.sin(lap * Math.PI * 2);
  if (current < 1350) { x = 50 - 33 * launch ** 2; y = 81 - 23 * Math.sin(launch * Math.PI / 2); }
  if (approach) { x = 17 + 33 * approach; y = 58 - 10 * approach - 7 * Math.sin(approach * Math.PI); }
  if (reducedMotion.matches) { x = 50; y = 65; }
  const mote = stage.querySelector('.mote');
  mote.style.left = `${x}%`; mote.style.top = `${y}%`;
  mote.style.transform = reducedMotion.matches ? 'translate(-50%, -50%)' : `translate(-50%, -50%) rotate(${lap * 360}deg) scale(${1 + approach * 8})`;
}

function tick(now) {
  if (!playing) return;
  current = Math.min(scenarios[key].duration, now - startedAt);
  if (current >= scenarios[key].duration) pause();
  render();
  if (playing) frame = requestAnimationFrame(tick);
}

$('playBtn').addEventListener('click', () => {
  if (playing) { pause(); render(); return; }
  if (current >= scenarios[key].duration) current = 0;
  playing = true; startedAt = performance.now() - current;
  frame = requestAnimationFrame(tick);
});
$('skipBtn').addEventListener('click', () => { pause(); current = scenarios[key].duration; render(); });
scrubber.addEventListener('input', () => { pause(); current = Number(scrubber.value); render(); });
$('areaSelect').addEventListener('change', () => { pause(); buildRail(); render(); });
selectScenario(key);
