const scenarios = {
  r: {
    label: 'Single R', tier: 'R', duration: 4100,
    beats: [
      [0, 'commit', 'The transaction is committed', 'Receipt locks before theater', 'The button answers immediately; presentation cannot reroll the result.', 'Dry confirmation hit · music ducks 2 dB'],
      [260, 'gather', 'Shared opening', 'The Fountain wakes', 'Water and star fragments gather into one neutral blue mote.', 'Water reverse · glass flecks · low pulse'],
      [760, 'launch', 'Shared opening', 'The mote chooses a path', 'A hesitation gives the player time to look for an omen.', 'Pitch climb · two acceleration ticks'],
      [1380, 'flight', 'Shared opening', 'Flight establishes the rhythm', 'The ordinary route stays clean and readable.', 'Travel wind · music returns underneath'],
      [2150, 'omen', 'R warning', 'Nothing interrupts the blue', 'No false danger and no expensive-looking fakeout.', 'Stable travel tone · no rarity accent'],
      [2850, 'impact', 'Contact', 'A small star answers', 'The ordinary result gets punctuation without pretending to be rare.', 'Light white-blue pop'],
      [3220, 'card', 'Payoff', 'Reveal the result card', 'R appears immediately after the ordinary impact.', 'Card flip · short settle'],
      [3900, 'hold', 'Player control', 'Result holds', 'Continue only when the player asks.', 'Quiet loop'],
    ],
  },
  sr: {
    label: 'Single SR', tier: 'SR', duration: 4550,
    beats: [
      [0, 'commit', 'The transaction is committed', 'Receipt locks before theater', 'The button answers immediately; presentation cannot reroll the result.', 'Dry confirmation hit · music ducks 2 dB'],
      [260, 'gather', 'Shared opening', 'The Fountain wakes', 'The same blue mote keeps rarity language learnable.', 'Water reverse · glass flecks · low pulse'],
      [760, 'launch', 'Shared opening', 'The mote chooses a path', 'The opening does not reveal the tier too early.', 'Pitch climb · acceleration ticks'],
      [1380, 'flight', 'Shared opening', 'Flight establishes the rhythm', 'The player watches for a change to the known route.', 'Travel wind · music returns underneath'],
      [2100, 'omen', 'SR warning', 'Cursed energy becomes Dream current', 'Cyan-violet current and one deliberate screen desync promise at least SR.', 'Charged crackle · one sync tear · music lifts'],
      [2900, 'impact', 'Charged contact', 'Energy hits harder', 'Blue and gold flash sharply, without using the SSR blackout.', 'Layered snap · medium sub hit'],
      [3380, 'card', 'Payoff', 'SR seal opens', 'The result holds long enough for the rarity upgrade to register.', 'Higher card flip · SR two-note badge'],
      [4250, 'hold', 'Player control', 'Result holds', 'Continue only when the player asks.', 'Quiet loop'],
    ],
  },
  ssr: {
    label: 'Single SSR', tier: 'SSR', duration: 5800,
    beats: [
      [0, 'commit', 'The transaction is committed', 'Receipt locks before theater', 'The button answers immediately; presentation cannot reroll the result.', 'Dry confirmation hit · music ducks 2 dB'],
      [260, 'gather', 'Shared opening', 'The Fountain wakes', 'The same neutral blue mote begins every pull.', 'Water reverse · glass flecks · low pulse'],
      [760, 'launch', 'Shared opening', 'The mote chooses a path', 'The hesitation leaves room for anticipation.', 'Pitch climb · acceleration ticks'],
      [1380, 'flight', 'Shared opening', 'Flight establishes the rhythm', 'The ordinary route gives the transformation meaning.', 'Travel wind · music returns underneath'],
      [2100, 'omen', 'SSR warning', 'The mote becomes a Warp Star', 'Gold replaces blue before the identity is known.', 'Transformation chime · engine flare'],
      [2850, 'blackout', 'SSR interruption', 'Everything is taken away', 'A short true blackout breaks the learned rhythm.', 'Music and ambience cut · 180–240 ms silence'],
      [3050, 'impact', 'SSR contact', 'The star hits back', 'Near-black becomes a compact gold-white impact, not a long bloom.', 'Sub hit · crack · water shock'],
      [3280, 'afterimage', 'Space after impact', 'Let the hit decay', 'Darkness returns so the voice does not fight the flash.', 'Impact tail only'],
      [3520, 'voice', 'Identity withheld', 'The voice leads the reveal', 'Written words arrive while Dedede remains completely concealed.', 'Music -9 dB · clean voice centered · sparse sparks'],
      [4350, 'hint', 'Final word', 'A silhouette answers the line', 'Only a hammer edge or robe shape crosses on the decisive word.', 'One cloth or hammer whoosh'],
      [4620, 'art', 'Character entrance', 'Dedede enters solidly', 'Approved layered art lands; no translucent feet, global warp or cosmetic shine.', 'Entrance hit · short character sting'],
      [5050, 'plate', 'Identity confirmed', 'KING / DEDEDE', 'Rarity, name, source and year appear after the character.', 'Theme resolves after the voice'],
      [5480, 'hold', 'Player control', 'The splash breathes', 'Effects settle and the player decides when to continue.', 'Low loop only'],
    ],
  },
  featured: {
    label: 'Featured SSR', tier: 'FEATURED', duration: 6100,
    beats: [
      [0, 'commit', 'The transaction is committed', 'Receipt locks before theater', 'The strongest omen still describes a result already committed.', 'Dry confirmation hit · music ducks 2 dB'],
      [260, 'gather', 'Shared opening', 'The Fountain wakes', 'The neutral start prevents the special cue from becoming background noise.', 'Water reverse · glass flecks · low pulse'],
      [760, 'launch', 'Shared opening', 'The mote chooses a path', 'The player waits for the route to change.', 'Pitch climb · acceleration ticks'],
      [1380, 'flight', 'Shared opening', 'Flight establishes the rhythm', 'The ordinary route remains recognizable.', 'Travel wind · music returns underneath'],
      [1850, 'featured', 'Rare featured omen', 'The Fountain reflects a hammer', 'A brief character-family clue promises the featured result without showing Dedede.', 'Low crown tone · distant wooden knock'],
      [2250, 'omen', 'SSR warning', 'The mote becomes a Warp Star', 'Gold transformation confirms the SSR floor.', 'Transformation chime · engine flare'],
      [2920, 'blackout', 'Featured interruption', 'Everything is taken away', 'The strongest route earns a slightly longer breath before impact.', 'Music and ambience cut · 220 ms silence'],
      [3150, 'impact', 'SSR contact', 'The star hits back', 'The same SSR grammar remains readable.', 'Sub hit · crack · delayed crown tone'],
      [3400, 'afterimage', 'Space after impact', 'Let the hit decay', 'Voice space is protected.', 'Impact tail only'],
      [3650, 'voice', 'Identity withheld', 'The voice leads the reveal', 'Written words appear, but no character art yet.', 'Music -9 dB · clean voice centered'],
      [4510, 'hint', 'Final word', 'The hammer silhouette commits', 'The entrance begins only on the decisive word.', 'Hammer whoosh'],
      [4770, 'art', 'Featured entrance', 'Dedede enters solidly', 'Layered art and one authored action, not global deformation.', 'Entrance hit · featured sting'],
      [5230, 'plate', 'Identity confirmed', 'KING / DEDEDE', 'Name, rarity, source and year arrive after the body.', 'Theme resolves'],
      [5700, 'hold', 'Player control', 'The splash breathes', 'The player owns the linger.', 'Low loop only'],
    ],
  },
  ten: {
    label: 'Ten-pull + SSR', tier: 'TEN', duration: 10200,
    rarities: ['R', 'R', 'SR', 'R', 'R', 'SSR', 'R', 'SR', 'R', 'R'],
    beats: [
      [0, 'commit', 'Ten results commit together', 'One transaction, one opening', 'All ten outcomes are fixed before the first visual cue.', 'Dry confirmation hit · music ducks 2 dB', 0],
      [300, 'gather', 'Shared opening', 'The Fountain gathers once', 'A ten-pull does not repeat ten full launches.', 'Water reverse · wider particle gather', 0],
      [850, 'launch', 'Shared opening', 'One launch carries the set', 'The highest committed rarity controls the omen floor.', 'Pitch climb · three acceleration ticks', 0],
      [1500, 'flight', 'Shared opening', 'The set crosses the sky', 'The travel duration stays familiar.', 'Travel wind · music returns', 0],
      [2150, 'omen', 'Highest tier warning', 'A gold Warp Star promises SSR', 'The player knows the set contains at least one SSR, but not where.', 'Transformation chime · engine flare', 0],
      [2850, 'impact', 'Set contact', 'The Warp Star breaks into ten seals', 'One impact starts the result cadence.', 'Heavy impact · ten glass pings', 0],
      [3250, 'seals', 'Ten-pull board', 'Ten closed results take their places', 'Order is stable and unopened slots remain visible.', 'Seals land left to right', 0],
      [3750, 'reveal', 'Fast cadence', 'Slot 1 · R', 'Ordinary results move briskly.', 'Short flip', 1],
      [4070, 'reveal', 'Fast cadence', 'Slot 2 · R', 'The rhythm becomes learnable.', 'Short flip', 2],
      [4420, 'reveal', 'Raised cadence', 'Slot 3 · SR', 'SR receives a stronger hit without stopping the set.', 'Charged flip · SR badge', 3],
      [4920, 'reveal', 'Fast cadence', 'Slot 4 · R', 'Return to the established pace.', 'Short flip', 4],
      [5240, 'reveal', 'Fast cadence', 'Slot 5 · R', 'The next interruption can now break a stable rhythm.', 'Short flip', 5],
      [5650, 'blackout', 'SSR interruption', 'Slot 6 stops the board', 'Unopened seals dim; the character remains concealed.', 'Cadence cuts · 180 ms silence', 5],
      [5850, 'impact', 'SSR contact', 'The sixth seal hits back', 'The first SSR earns the elevated interruption.', 'Sub hit · crack · water shock', 5],
      [6120, 'voice', 'Identity withheld', 'Voice before character', 'The quote appears while the result board remains hidden.', 'Music -9 dB · clean voice centered', 5],
      [6900, 'art', 'SSR entrance', 'Dedede enters', 'The approved character entrance pays off the interruption.', 'Entrance hit · short sting', 6],
      [7420, 'plate', 'Identity confirmed', 'KING / DEDEDE', 'A condensed plate confirms the sixth result.', 'Theme resolves briefly', 6],
      [7850, 'reveal', 'Cadence resumes', 'Slot 7 · R', 'The result board returns at the established ordinary pace.', 'Short flip', 7],
      [8170, 'reveal', 'Raised cadence', 'Slot 8 · SR', 'The second SR still receives its readable accent.', 'Charged flip · SR badge', 8],
      [8670, 'reveal', 'Fast cadence', 'Slot 9 · R', 'The set keeps moving after the elevated result.', 'Short flip', 9],
      [8990, 'reveal', 'Fast cadence', 'Slot 10 · R', 'The last seal opens before the complete grid replaces it.', 'Short flip', 10],
      [9650, 'results', 'Complete set', 'All ten results remain inspectable', 'NEW, duplicate and Echo information survive the theater.', 'Result-settle chord', 10],
    ],
  },
};

const $ = id => document.getElementById(id);
const stage = $('stage');
const buttons = $('scenarioButtons');
const scrubber = $('scrubber');
const playBtn = $('playBtn');
const seals = $('seals');
const resultCard = $('resultCard');
let key = 'ssr';
let current = 0;
let playing = false;
let startedAt = 0;
let frame = 0;

function beatObject(values) {
  const [at, phase, kicker, title, visual, sound, revealed = 0] = values;
  return { at, phase, kicker, title, visual, sound, revealed };
}

for (const [scenarioKey, scenario] of Object.entries(scenarios)) {
  scenario.beats = scenario.beats.map(beatObject);
  const button = document.createElement('button');
  button.type = 'button';
  button.textContent = scenario.label;
  button.dataset.scenario = scenarioKey;
  button.addEventListener('click', () => selectScenario(scenarioKey));
  buttons.append(button);
}

function selectScenario(next) {
  key = next;
  playing = false;
  cancelAnimationFrame(frame);
  current = 0;
  const scenario = scenarios[key];
  scrubber.max = scenario.duration;
  scrubber.value = 0;
  $('duration').textContent = `/ ${(scenario.duration / 1000).toFixed(2)} s`;
  buildRail();
  buildSeals();
  render();
}

function buildSeals() {
  seals.textContent = '';
  const scenario = scenarios[key];
  if (!scenario.rarities) return;
  scenario.rarities.forEach(rarity => {
    const seal = document.createElement('i');
    seal.dataset.rarity = rarity;
    seals.append(seal);
  });
}

function buildRail() {
  const rail = $('beatRail');
  rail.textContent = '';
  scenarios[key].beats.forEach((beat, index) => {
    const item = document.createElement('li');
    const button = document.createElement('button');
    button.type = 'button';
    button.innerHTML = `<span>${(beat.at / 1000).toFixed(2)} s</span><b>${beat.title}</b>`;
    button.addEventListener('click', () => {
      playing = false;
      current = beat.at;
      scrubber.value = current;
      render();
    });
    item.append(button);
    item.dataset.index = index;
    rail.append(item);
  });
}

function activeBeat() {
  const beats = scenarios[key].beats;
  let index = 0;
  for (let i = 1; i < beats.length && beats[i].at <= current; i++) index = i;
  return { beat: beats[index], index };
}

function scopeFor(phase, scenario) {
  if (['commit', 'blackout', 'afterimage'].includes(phase)) return 'Shared pull director';
  if (['seals', 'reveal', 'interrupt', 'results', 'card'].includes(phase)) return 'Shared result director';
  if (phase === 'hold' && ['R', 'SR'].includes(scenario.tier)) return 'Shared result director';
  if (['voice', 'hint', 'art', 'plate', 'hold'].includes(phase)) return 'Dedede reveal profile';
  return 'Dream Land presentation profile';
}

function render() {
  const scenario = scenarios[key];
  const { beat, index } = activeBeat();
  stage.dataset.phase = beat.phase;
  stage.dataset.tier = scenario.tier;
  $('stageScope').textContent = scopeFor(beat.phase, scenario);
  $('stageKicker').textContent = beat.kicker;
  $('stageTitle').textContent = beat.title;
  $('stageVisual').textContent = beat.visual;
  $('soundCue').textContent = beat.sound;
  $('clock').textContent = (current / 1000).toFixed(2);
  scrubber.value = current;
  playBtn.textContent = playing ? 'Pause storyboard' : current >= scenario.duration ? 'Replay storyboard' : 'Play storyboard';
  document.querySelectorAll('[data-scenario]').forEach(button => button.setAttribute('aria-pressed', String(button.dataset.scenario === key)));
  document.querySelectorAll('#beatRail li').forEach((item, i) => item.classList.toggle('active', i === index));

  const badge = resultCard.querySelector('span');
  const name = resultCard.querySelector('b');
  if (scenario.tier === 'R' || scenario.tier === 'SR') {
    badge.textContent = scenario.tier;
    name.innerHTML = 'RESULT<br>CARD';
  } else {
    badge.textContent = 'SSR';
    name.innerHTML = 'KING<br>DEDEDE';
  }

  if (scenario.rarities) {
    [...seals.children].forEach((seal, i) => {
      const rarity = scenario.rarities[i];
      seal.classList.toggle('revealed', i < beat.revealed);
      seal.style.setProperty('--seal', rarity === 'SSR' ? '#ffd34f' : rarity === 'SR' ? '#58cfff' : '#8ed7ff');
    });
  }
}

function tick(now) {
  if (!playing) return;
  const scenario = scenarios[key];
  current = Math.min(scenario.duration, now - startedAt);
  render();
  if (current >= scenario.duration) {
    playing = false;
    render();
    return;
  }
  frame = requestAnimationFrame(tick);
}

playBtn.addEventListener('click', () => {
  const scenario = scenarios[key];
  if (playing) {
    playing = false;
    cancelAnimationFrame(frame);
    render();
    return;
  }
  if (current >= scenario.duration) current = 0;
  playing = true;
  startedAt = performance.now() - current;
  render();
  frame = requestAnimationFrame(tick);
});

scrubber.addEventListener('input', event => {
  playing = false;
  cancelAnimationFrame(frame);
  current = Number(event.target.value);
  render();
});

selectScenario(key);
