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
      add('call', 'call', 'Dedede: concealed laugh', 4, 'The roster dims. Dedede and his name remain hidden for the existing call window.', 'Music clears the native sound.', 'Native Dedede laugh, without music beneath it.', 'Dark, no character art.');
      const ssr = (id, title, duration, visual, sound, camera) => add(id, `ssr-${id}`, title, duration, visual, 'Dedede’s related Super Star theme replaces the area bed.', sound, camera);
      ssr('screen', 'Dedede: gold screen opening', .55, 'A gold star opens onto his face; no identity yet.', 'Gold screen rush.', 'Short entrance into the close framing.');
      ssr('face', 'The king sizes you up', .65, 'His beak, cap and raised hammer establish the king, not an anonymous silhouette.', 'A small camera accent.', 'Close face view with a slight slant.');
      ssr('shower', 'A royal shower of Waddle Dees', 1.5, 'Dedede brings the hammer down. Native Adventure Waddle Dee sprites tumble in a staggered shower around him; gold star chips mark the hit.', 'Hammer thump, then little falling whistles.', 'A brief wider action view; the shower carries through the pullback.');
      ssr('pullback', 'Pull back through the falling Dees', 1.5, 'The king resolves into his full pose while the last Waddle Dees fall past the edges. No eight-second zoom.', 'One receding camera rush and soft falling accents.', 'Continuous 1.5 s pullback, then stop.');
      ssr('lock', 'Dedede lands in place', .4, 'The camera and hammer stop before the identity arrives.', 'A grounded settle.', 'Wide, level and still.');
      ssr('rarity', 'S, S, R', .9, 'Gold letters arrive in order after the camera locks. Name stays hidden.', 'Three spaced letter accents.', 'Hold full character.');
      ssr('name', 'King Dedede', 1.1, 'The name and source appear beside the settled king.', 'A softer name accent.', 'No further camera zoom.');
      ssr('hold', 'A moment for the king', 1.8, 'Let the final composition breathe before the next result.', 'Theme only; no repeated hit.', 'Still full pose.');
      return;
    }
    add('call', 'call', 'Something stirs in the dark', 4.8, 'Nightmare’s art, silhouette and name remain concealed. An authored low omen stands in for a character sound; no invented voice or quote.', 'Area music is absent.', 'Low pressure / spectral omen; not a native voice clip.', 'Black hold. Tap may advance.');
    add('sweep', 'sweep', 'Both sides of the cloak close in', 1.25, 'Two star-patterned cloth panels close from opposite edges and meet at the same seam used by the next shot. No one-sided wipe or cut to a new cloak.', 'A low character-theme pickup follows the omen.', 'Paired heavy cloth rushes, low pressure.', 'Symmetric lens cover with continuous panel positions.');
    add('covered', 'covered', 'Trapped inside the cloak', .65, 'The cloak fills all four edges. No body or identity is exposed yet.', 'One suspended musical beat.', 'Cloth settles; the room falls away.', 'Full-frame cover; no zoom out yet.');
    add('hands', 'hands', 'Hands find the edges', 1.2, 'Two separate hands rise into frame and take the cloak’s edges. The independent gesture must be visible.', 'Nightmare’s theme begins to resolve.', 'Two soft grabs, left then right.', 'Close frontal view; hands are the subject.');
    add('open', 'open', 'The curtains open onto nothing', 1.8, 'His hands separate the cloak panels, revealing only black. No face, body, backdrop or name is behind them yet.', 'The theme pickup stays suspended.', 'Cloth release, then the rush dies.', 'Hold the lens at the curtain; do not expose the fighter.');
    add('dark', 'dark', 'Wait in the darkness', .75, 'The opening is empty black. The hands and cloth remain at the edges, leaving the middle completely empty.', 'One sparse low note; no triumphant reveal yet.', 'A short empty-room hush.', 'Still frontal void; give the absence a beat.');
    add('emerge', 'emerge', 'Only his face rises', 2.8, 'The horned face slowly travels UP out of the cloak-darkness. No body, pauldrons, necklace or hands appear with it.', 'Nightmare’s theme begins to resolve, held low.', 'Low pressure rises beneath a sparse visor accent.', 'Steady frontal face framing. The head moves upward; this is not a body fade.');
    add('wrap', 'wrap', 'Hands gather the cloak back to him', 2.1, 'Both hands return from the edges and rise into his own shoulder-level pose, drawing the cloth around the face. The same hands, head and cloak continue into the close-up—no replacement figure cut.', 'The character theme gathers with the cloth.', 'Two returning cloth sweeps and a soft wrap.', 'Face stays anchored; cloth and hands converge into the close-up pose.');
    add('face', 'face', 'Close-up after the wrap', 1.35, 'Without a cut, the wrapped figure gives a slight face slant. His hands remain connected to the cloth. No rarity or name yet.', 'Theme gets space; no new call over it.', 'A brief camera / cloth accent.', 'Continuous from the wrap’s final face position and scale.');
    add('pullback', 'pullback', 'Pull all the way back', 2.6, 'Reveal the full cloak and both hands. The huge shadow remains behind him while the character settles into the roster.', 'Character theme opens up.', 'Long receding rush, not another impact.', 'Continuous 2.6 s pullback from face to full figure.');
    add('adjust', 'adjust', 'Lift into the final pose', .75, 'He adjusts upward slightly and squares his cloak into the final full-character UR composition. The camera is already wide.', 'Theme reaches its resolved phrase.', 'Small cloth adjustment; no new impact.', 'Level wide shot. The figure lifts, not the entire camera.');
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
  const closeZoom = 1.35 / .76;
  if (phase === 'wrap' || phase === 'face') zoom = closeZoom;
  if (phase === 'face') roll = 4 * ease(p);
  if (phase === 'pullback') { zoom = 1 + (closeZoom - 1) * (1 - ease(p)); roll = 4 * (1 - ease(p)); }
  const nightmareVisible = ['emerge', 'wrap', 'face', 'pullback', 'adjust', 'lock', 'rarity', 'name', 'hold', 'resume'].includes(phase) || phase === 'lineup' && board.receipt.results.length === 1;
  const identity = ['name', 'hold', 'resume', 'lineup'].includes(phase);
  const rise = phase === 'emerge' ? reduced ? 1 : ease(p) : nightmareVisible ? 1 : 0;
  const lift = phase === 'adjust' ? reduced ? 1 : ease(p) : ['lock', 'rarity', 'name', 'hold', 'resume', 'lineup'].includes(phase) ? 1 : 0;
  return { beat, phase, progress: p, time: t, zoom: reduced ? 1 : zoom, roll: reduced ? 0 : roll,
    curtainSpread: phase === 'sweep' ? reduced ? 0 : 1 - ease(p) : phase === 'open' ? reduced ? 1 : ease(p) : phase === 'dark' ? 1 : 0,
    dededeVisible: phase.startsWith('ssr-'),
    nightmareVisible, faceOnly: phase === 'emerge', faceY: 700 - rise * 375,
    wrap: phase === 'wrap' ? reduced ? 1 : ease(p) : 0, poseY: -18 * lift,
    identity, rarity: identity || phase === 'rarity', previous,
    results: phase === 'lineup' ? board.receipt.results : previous };
}

// Fixed sprite shower: no random particles, so scrubbing/replay keep the action.
export function sampleDededeRain(time, reduced = false) {
  return Array.from({ length: 12 }, (_, i) => {
    const age = reduced ? .8 : time - i * .115;
    return { x: 80 + (i * 173 % 850) + Math.sin(age * 2 + i) * 25,
      y: -80 + age * 150 + age * age * 170, size: i % 4 === 0 ? 86 : 58,
      angle: reduced ? 0 : Math.sin(age * 3 + i) * .35, frame: reduced ? 0 : Math.floor(Math.max(0, age) * 6) % 2,
      visible: age >= 0 && age < 1.9 };
  });
}
