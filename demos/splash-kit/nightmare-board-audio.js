import { CUE, TIERS } from './cue-model.js';

// Authored beat times drive both playback and offline verification. The shared
// mixer owns every scheduled source, including future starts, so seeking stops all.
export function storyboardAudioEvents(board) {
  const events = [{ at: .05, kind: 'confirm' }, { at: .25, kind: 'gather' }, { at: CUE.launch, kind: 'launch' },
    { at: CUE.approach + board.delay, kind: 'approach' }];
  for (const [i, result] of board.receipt.results.entries()) {
    for (const [rank, kind, at] of [[1, 'silver', CUE.silver], [2, 'gold', CUE.gold], [3, 'rainbow', CUE.rainbow]]) {
      if (TIERS.indexOf(result.rarity) >= rank) events.push({ at: at + i * CUE.spacing, kind });
    }
  }
  let musicStart = .12;
  function areaUntil(end) { if (end > musicStart) events.push({ at: musicStart, end, anchor: musicStart, kind: 'music', track: 'dream' }); }
  areaUntil(CUE.contact + board.delay - .35);
  musicStart = board.reveal + .1;
  for (const b of board.beats) {
    const add = (kind, offset = 0, extra = {}) => events.push({ at: b.start + offset, kind, ...extra });
    if (b.phase === 'impact') add('impact');
    if (b.phase === 'arrival') add('arrival', 0, { rarity: b.result.rarity });
    if (b.phase === 'call') {
      areaUntil(b.start - .18);
      const showcase = board.beats.filter(beat => beat.result === b.result).at(-1);
      const end = board.receipt.results.length === 1 ? board.total : showcase.end;
      musicStart = end;
      if (b.result.rarity === 'SSR') add('voice', 0, { track: 'dedede', segment: { quote: b.duration } });
      else add('omen', .25);
      const theme = { anchor: b.end, track: b.result.rarity === 'SSR' ? 'dedede-theme' : 'nightmare-theme', kind: 'music' };
      if (b.result.rarity === 'UR') {
        const face = board.beats.find(beat => beat.result === b.result && beat.phase === 'face');
        events.push({ ...theme, at: b.end + .08, end: face.start, level: .24 });
        events.push({ ...theme, at: face.start, end });
      } else events.push({ ...theme, at: b.end + .08, end });
    }
    if (['sweep', 'open', 'wrap'].includes(b.phase)) {
      add('cloth', 0, { pan: -.65, duration: Math.min(1.2, b.duration) });
      add('cloth', .1, { pan: .65, duration: Math.min(1.2, b.duration) });
    }
    if (b.phase === 'hands') { add('grab', .7, { pan: -.45 }); add('grab', .92, { pan: .45 }); }
    if (b.phase === 'emerge') add('visor', b.duration * .55);
    if (b.phase === 'ssr-screen') add('curtain');
    if (b.phase === 'ssr-shower') {
      add('lock', .22);
      for (let i = 0; i < 6; i++) add('fall', .3 + i * .15, { pitch: i });
    }
    if (['face', 'pullback', 'ssr-face', 'ssr-pullback'].includes(b.phase)) add('camera');
    if (['lock', 'ssr-lock'].includes(b.phase)) add('lock');
    if (['rarity', 'ssr-rarity'].includes(b.phase)) for (let i = 0; i < (b.phase === 'rarity' ? 2 : 3); i++) add('letter', i * .3, { letter: i });
    if (['name', 'ssr-name'].includes(b.phase)) add('name', 0, { rarity: b.result.rarity });
    if (b.phase === 'lineup' && board.receipt.results.length > 1) add('lineup');
  }
  areaUntil(board.total);
  return events.sort((a, b) => a.at - b.at);
}
