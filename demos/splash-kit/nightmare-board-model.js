import { CUE, clamp, ease } from './cue-model.js';

// Authored review fixtures, not drop rates, production units or transactions.
const fighter = (slot, rarity, name) => Object.freeze({ slot, rarity, name, id: `board-${slot}` });
const ONE = Object.freeze([fighter(1, 'UR', 'Nightmare')]);
const TEN = Object.freeze(['R', 'R', 'SR', 'R', 'R', 'SSR', 'R', 'UR', 'SR', 'R'].map((rarity, i) =>
  fighter(i + 1, rarity, i === 5 ? 'King Dedede' : i === 7 ? 'Nightmare' : `${rarity} fighter ${i + 1}`)));
export function storyboardReceipt(count) {
  if (![1, 10].includes(count)) throw Error('Storyboard count must be 1 or 10.');
  return Object.freeze({ id: `storyboard-${count}`, source: 'authored-storyboard', results: count === 1 ? ONE : TEN });
}

export function makeStoryboard(receipt, { highOnly = false } = {}) {
  const delay = (receipt.results.length - 1) * CUE.spacing, beats = [];
  let cursor = 0;
  function beat(id, phase, title, duration, visual, music, sound, camera, extra = {}) {
    const item = { id, phase, title, start: cursor, end: cursor + duration, duration, visual, music, sound, camera, ...extra };
    beats.push(item); cursor = item.end;
  }
  const opening = (id, title, end, visual, music, sound) => beat(id, 'flight', title, end - cursor, visual, music, sound, 'Wide, level view of the fountain.', { group: 'Shared opening' });
  opening('commit', 'The pull locks', .3, 'Button answers. The result is fixed before the animation starts.', 'Area theme lowers.', 'Dry confirmation.', '');
  opening('gather', 'Gather at the fountain', CUE.launch, 'A neutral blue mote gathers at the bowl’s lip.', 'Dream Land area bed.', 'Water / glass gathering.', '');
  opening('launch', 'Leave the fountain', CUE.orbit, 'The light rises from the bowl and curves left into the lap.', 'Area theme continues.', 'Lift and travel wind.', '');
  opening('blue', 'One lap, not a corner detour', CUE.silver + delay, 'The carrier follows the established smooth orbit. Ten lights trail the same route.', 'Area theme continues.', 'Soft travel ticks.', '');
  opening('silver', 'Blue becomes silver', CUE.gold + delay, 'The signal gains a silver shell. In ten-pulls only light ten upgrades.', 'Area theme continues.', 'Metallic SR accent.', '');
  opening('gold', 'Silver becomes gold', CUE.rainbow + delay, 'The silver shell resolves into a gold Warp Star. The earlier upgrades remain cumulative.', 'Area theme rises slightly.', 'Gold SSR accent.', '');
  opening('rainbow', 'Gold becomes rainbow', CUE.approach + delay, 'Only now does the star split the spectrum: this set contains a UR.', 'Area music drains before contact.', 'Prismatic UR accent.', '');
  opening('approach', 'The star returns toward you', CUE.contact + delay, 'The full lap resolves into the existing continuous screen approach.', 'Music drops away.', 'Approach rush.', '');
  beat('blackout', 'blackout', 'A breath before impact', CUE.impact - CUE.contact, 'The screen goes dark. No character or name yet.', 'Silence.', 'Rush cuts out.', 'Hold the screen still.', { group: 'Shared opening' });
  beat('impact', 'impact', 'Screen strike', CUE.reveal - CUE.impact, 'A restrained prismatic fracture introduces the result stage.', 'No theme over the strike.', 'One deep impact, then decay.', 'Short screen response; reduced motion stays still.', { group: 'Shared opening' });
  receipt.results.forEach((result, index) => {
    const extra = { result, index, group: result.rarity === 'UR' ? 'Nightmare UR' : `Slot ${result.slot}` };
    const add = (id, phase, title, duration, visual, music, sound, camera) => beat(`${result.slot}-${id}`, phase, title, duration, visual, music, sound, camera, extra);
    if (['R', 'SR'].includes(result.rarity)) {
      if (!highOnly) add('arrival', 'arrival', `Slot ${result.slot}: ${result.rarity} entrance`, result.rarity === 'SR' ? 1.2 : .85,
        'A full fighter silhouette arrives, then remains in the roster. Never a card.', 'Area music resumes quietly.', 'Arrival / settle.', 'Wide; no cinematic repeat.');
      return;
    }
    if (result.rarity === 'SSR') {
      add('call', 'call', 'Dedede: concealed laugh', 4, 'The roster dims. Dedede and his name remain hidden for the existing call window.', 'Music clears the native sound.', 'Dedede’s laugh; written cue only here.', 'Dark, no character art.');
      add('ssr', 'ssr', 'Dedede: established SSR payoff', 8.5, 'Keep cue 04’s gold screen opening, face view, pullback, lock and slower name. This board compresses the drawing, not the timing.', 'Dedede’s related theme replaces the area bed.', 'Screen opening, camera, lock and name accents.', 'Cue 04 camera timing is retained; no new rig is implied.');
      return;
    }
    add('call', 'call', 'Something speaks from the dark', 4.8, 'Nightmare’s art, silhouette and name remain concealed. A clean native sound is preferred; no invented quote.', 'Area music is absent.', 'Nightmare character sound: not selected yet.', 'Black hold. Tap may advance.');
    add('sweep', 'sweep', 'The cloak takes the whole screen', 1.25, 'A cloth edge crosses the lens. The star pattern grows until the cloak obscures the entire stage.', 'A low character-theme pickup follows the sound.', 'Heavy cloth rush, low pressure.', 'Stay close enough that this reads as cloth, not a flat fade.');
    add('covered', 'covered', 'Trapped inside the cloak', .65, 'The cloak fills all four edges. No body or identity is exposed yet.', 'One suspended musical beat.', 'Cloth settles; the room falls away.', 'Full-frame cover; no zoom out yet.');
    add('hands', 'hands', 'Hands find the edges', 1.2, 'Two separate hands rise into frame and take the cloak’s edges. The independent gesture must be visible.', 'Nightmare’s theme begins to resolve.', 'Two soft grabs, left then right.', 'Close frontal view; hands are the subject.');
    add('open', 'open', 'Pull the nightmare open', 1.8, 'Hands separate and cloak panels open. A game-sourced final-boss backdrop replaces the fountain; geometry here is not the proposed art.', 'Nightmare’s own theme takes over.', 'Cloth release and a deep magic bloom.', 'Dolly through the opening. Keep the name hidden.');
    add('cast', 'cast', 'Nightmare casts into the frame', 1.5, 'One palm reaches forward; the other points. Magic travels into the screen edges, not across his face.', 'Character theme continues.', 'Charge, release, then edge crackle.', 'Low three-quarter angle at the hands and shoulders.');
    add('face', 'face', 'A slanted look at the face', 1.35, 'Cut from the casting hand to the horned face. The head turns slightly; do not substitute a static held zoom.', 'Theme gets space; no new call over it.', 'A brief camera / cloth accent.', 'High opposite slant. No UR letters or name.');
    add('pullback', 'pullback', 'Pull all the way back', 2.6, 'Reveal the full cloak and both hands. Screen-edge effects frame the silhouette and leave the center clear.', 'Character theme opens up.', 'Long receding rush, not another impact.', 'Continuous 2.6 s pullback from face to full figure.');
    add('lock', 'lock', 'Everything clicks into place', .6, 'The full figure and roster align. Let the composition settle before any identity text.', 'Theme sustains.', 'One grounded lock accent.', 'Wide, level; camera has stopped.');
    add('rarity', 'rarity', 'U, then R', 1.25, 'Prismatic rarity letters arrive after the camera lock. The name is still absent.', 'Character theme continues.', 'Two deliberate letter accents.', 'Hold the full character.');
    add('name', 'name', 'Nightmare', 1.25, 'The name builds beside the character, with Kirby’s Adventure and 1993. No red featured tier.', 'Character theme continues.', 'Name accent follows the letters.', 'Wide; do not cover the face or hands.');
    add('hold', 'hold', 'Let the UR breathe', 2.5, 'A quiet held pose with modest hand / cloak motion. The final result remains until the player moves on.', 'Nightmare theme, below effects.', 'Sparse edge shimmer only.', 'Steady full figure.');
    if (receipt.results.length > 1) add('resume', 'resume', 'Return to the same ten-pull', .8, 'The cloak withdraws to the result slot. Continue with slot nine; do not replay the shared opening or reroll.', 'Character theme fades; area music returns.', 'Soft roster settle.', 'Wide lineup; preserve all previous fighters.');
  });
  beat('lineup', 'lineup', receipt.results.length === 1 ? 'Your UR stays on screen' : 'All ten fighters remain', 1.5,
    'Player-controlled exit. Skipped lower-tier entrances are still present; acquisition details will come from the real receipt in production.',
    receipt.results.length === 1 ? 'Nightmare’s theme holds.' : 'Area music holds after the final fighter.', 'No repeated impact.', 'Stable full result view.', { group: 'Results' });
  return { receipt, beats, total: cursor, delay, highOnly, reveal: CUE.reveal + delay };
}

export function sampleStoryboard(time, board, reduced = false) {
  const t = Math.max(0, Math.min(time, board.total));
  const beat = board.beats.find(b => t >= b.start && t < b.end) || board.beats.at(-1);
  const p = clamp((t - beat.start) / beat.duration), phase = beat.phase;
  const previous = board.receipt.results.filter((_, i) => i < (beat.index ?? (phase === 'lineup' ? board.receipt.results.length : 0)));
  let zoom = 1, roll = 0;
  if (phase === 'cast') { zoom = 1.55; roll = -8; }
  if (phase === 'face') { zoom = 2.15; roll = 7 - ease(p) * 3; }
  if (phase === 'pullback') { zoom = 1 + 1.15 * (1 - ease(p)); roll = 4 * (1 - ease(p)); }
  const nightmareVisible = ['open', 'cast', 'face', 'pullback', 'lock', 'rarity', 'name', 'hold', 'resume'].includes(phase) || phase === 'lineup' && board.receipt.results.length === 1;
  const identity = ['name', 'hold', 'resume', 'lineup'].includes(phase);
  return { beat, phase, progress: p, time: t, zoom: reduced ? 1 : zoom, roll: reduced ? 0 : roll,
    nightmareVisible, identity, rarity: identity || phase === 'rarity', previous,
    results: phase === 'lineup' ? board.receipt.results : previous };
}
