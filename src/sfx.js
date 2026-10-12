// Procedural sound effects with WebAudio, so there are no audio files.
// Each sound is a list of [startHz, endHz, seconds] notes. Respects game.muted.
import { game } from './game.js';

let ctx;

function play(notes, vol = 0.3) {
  if (game.muted) return;
  ctx ??= new AudioContext();
  if (ctx.state === 'suspended') ctx.resume();
  let t = ctx.currentTime + 0.01;
  for (const [f0, f1, dur] of notes) {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(f0, t);
    osc.frequency.linearRampToValueAtTime(f1, t + dur);
    gain.gain.setValueAtTime(0.0001, t);
    gain.gain.linearRampToValueAtTime(vol * 0.5, t + 0.008);
    gain.gain.exponentialRampToValueAtTime(0.0001, t + dur);
    osc.connect(gain).connect(ctx.destination);
    osc.start(t);
    osc.stop(t + dur + 0.02);
    t += dur;
  }
}

export const sfx = {
  click: () => play([[1000, 1000, 0.03]], 0.12),
  tick: () => play([[1400, 1400, 0.025]], 0.1),
  error: () => play([[200, 150, 0.15]], 0.2),
  charge: () => play([[180, 700, 0.7]], 0.2),
  ding: (r) => {
    const f = r === 5 ? 988 : r === 4 ? 784 : 660;
    play([[f, f, 0.25]]);
  },
  upgrade: () => play([[600, 1400, 0.25], [1400, 1400, 0.2]]),
  reveal: (r) => {
    if (r === 5) play([[523, 523, 0.07], [659, 659, 0.07], [784, 784, 0.07], [1047, 1047, 0.5]]);
    else if (r === 4) play([[523, 523, 0.07], [659, 659, 0.07], [784, 784, 0.25]]);
    else play([[523, 523, 0.08], [659, 659, 0.15]], 0.2);
  },
  star: (i) => {
    const f = 880 * 1.12 ** i;
    play([[f, f * 1.05, 0.08]], 0.2);
  },
  hit: () => play([[220, 80, 0.08]], 0.25),
  heal: () => play([[700, 1000, 0.12]], 0.2),
  win: () => play([[523, 523, 0.1], [659, 659, 0.1], [784, 784, 0.1], [1047, 1047, 0.4]]),
  lose: () => play([[392, 392, 0.2], [330, 330, 0.2], [262, 200, 0.4]]),
};
