import { CUE, clamp, ease, sampleLights, upgradeAt } from './cue-model.js';

// Authored review fixtures, not drop rates, production units or transactions.
const fighter = (slot, rarity, name) => Object.freeze({ slot, rarity, name, id: `board-${slot}` });
const ONE = Object.freeze([fighter(1, 'UR', 'Nightmare')]);
const TEN = Object.freeze(['R', 'R', 'SR', 'R', 'R', 'SSR', 'R', 'UR', 'SR', 'R'].map((rarity, i) =>
  fighter(i + 1, rarity, i === 5 ? 'King Dedede' : i === 7 ? 'Nightmare' : `${rarity} fighter ${i + 1}`)));
export function storyboardReceipt(count) {
  if (![1, 10].includes(count)) throw Error('Storyboard count must be 1 or 10.');
  return Object.freeze({ id: `storyboard-${count}`, source: 'authored-storyboard', results: count === 1 ? ONE : TEN });
}

// Reuse the shared route/spacing, but each pre-decided result owns its cue.
// Nothing is sorted: a UR in slot eight is still the eighth travelling light.
export function sampleResultLights(time, results, reduced = false) {
  return sampleLights(time, 'R', results.length, reduced).map((light, index) => ({
    ...light, ...upgradeAt(light.local, results[index].rarity), signal: true, result: results[index],
  }));
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
  opening('silver', 'Each result finds its silver', CUE.gold + delay, 'Every SR-or-higher light turns silver in its original result slot. R lights stay blue.', 'Area theme continues.', 'Metallic SR accents follow the corresponding lights.');
  opening('gold', 'Only SSR and UR become stars', CUE.rainbow + delay, 'SSR and UR lights continue to gold Warp Stars. SR lights remain silver; no results move.', 'Area theme rises slightly.', 'Gold accents for SSR-or-higher lights.');
  opening('rainbow', 'Only the UR becomes rainbow', CUE.approach + delay, receipt.results.length === 1 ? 'The single UR reaches rainbow only after silver and gold.' : 'Light eight is Nightmare UR and turns rainbow. Light six stays gold, three and nine silver, ten blue.', 'Area music drains before contact.', 'Prismatic UR accent.');
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
    add('open', 'open', 'The curtains open onto nothing', 1.8, 'His hands separate the cloak panels, revealing only black. No face, body, backdrop or name is behind them yet.', 'The theme pickup stays suspended.', 'Cloth release, then the rush dies.', 'Hold the lens at the curtain; do not expose the fighter.');
    add('dark', 'dark', 'Wait in the darkness', .75, 'The opening is empty black. The hands and cloth remain at the edges, leaving the middle completely empty.', 'One sparse low note; no triumphant reveal yet.', 'A short empty-room hush.', 'Still frontal void; give the absence a beat.');
    add('emerge', 'emerge', 'He emerges from his own shadow', 1.8, 'A huge cloak silhouette fills the frame. The horned face and visor emerge from the darkness; keep the body indistinct.', 'Nightmare’s own theme resolves with his emergence.', 'Low pressure rises; a small visor / face accent.', 'Low slant into an oversized face, framed by the cloak shadow.');
    add('face', 'face', 'A slanted look at the face', 1.35, 'The face becomes clear against the looming cloak shadow. A slight head turn answers the opposite camera slant.', 'Theme gets space; no new call over it.', 'A brief camera / cloth accent.', 'High opposite slant. No UR letters or name.');
    add('pullback', 'pullback', 'Pull all the way back', 2.6, 'Reveal the full cloak and both hands. The huge shadow remains behind him while the character settles into the roster.', 'Character theme opens up.', 'Long receding rush, not another impact.', 'Continuous 2.6 s pullback from face to full figure.');
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
  if (phase === 'emerge') { zoom = 2.15; roll = -7 * (1 - ease(p) * .4); }
  if (phase === 'face') { zoom = 2.15; roll = 7 - ease(p) * 3; }
  if (phase === 'pullback') { zoom = 1 + 1.15 * (1 - ease(p)); roll = 4 * (1 - ease(p)); }
  const nightmareVisible = ['emerge', 'face', 'pullback', 'lock', 'rarity', 'name', 'hold', 'resume'].includes(phase) || phase === 'lineup' && board.receipt.results.length === 1;
  const identity = ['name', 'hold', 'resume', 'lineup'].includes(phase);
  return { beat, phase, progress: p, time: t, zoom: reduced ? 1 : zoom, roll: reduced ? 0 : roll,
    nightmareVisible, emergence: phase === 'emerge' ? reduced ? 1 : ease(p) : nightmareVisible ? 1 : 0,
    identity, rarity: identity || phase === 'rarity', previous,
    results: phase === 'lineup' ? board.receipt.results : previous };
}
