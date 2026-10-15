// King Dedede splash rig. Every number here was placed against
// assets/king-dedede/rig-grid.jpg (UV 0..1, v down) and checked with the
// in-page "Rig view" heat map. See ../README.md for the field reference.
export default {
  unitId: 'king-dedede',
  nameplate: { small: 'KING', big: 'DEDEDE' },
  credit: "Render: Kirby's Return to Dream Land Deluxe · Stage: Super Smash Bros. Ultimate, Fountain of Dreams",

  art: { src: 'assets/king-dedede/render.png', grid: [46, 52] },
  background: { src: 'assets/fountain-of-dreams/background.jpg', focus: [0.43, 0.47], cover: 1.12 },

  // Applied in order; later deformers move the result of earlier ones (child before parent).
  deformers: [
    { id: 'belly-breath', type: 'scale', pivot: [0.68, 0.58], mask: [{ circle: [0.68, 0.58, 0.34] }],
      amount: 0.02, freq: 2.1 },
    { id: 'fist-pump', type: 'rotate', pivot: [0.2, 0.52], mask: [{ circle: [0.2, 0.32, 0.24] }],
      amount: 0.06, freq: 2.1, phase: 0.6 },
    { id: 'hammer-windup', type: 'rotate', pivot: [0.84, 0.37],
      mask: [{ rect: [0.29, -1, 2, 0.205], soft: 0.045 }, { capsule: [0.66, 0.28, 0.99, 0.45, 0.1] }, { circle: [0.85, 0.36, 0.2] }],
      amount: 0.05, freq: 2.1, phase: -0.5 },
    { id: 'head-tilt', type: 'rotate', pivot: [0.56, 0.48], mask: [{ circle: [0.53, 0.31, 0.3] }], minus: ['hammer-windup'],
      amount: 0.025, freq: 1.05 },
    { id: 'head-bob', type: 'translate', direction: [0, 1], mask: [{ circle: [0.53, 0.31, 0.3] }], minus: ['hammer-windup'],
      amount: 0.005, freq: 2.1, phase: 1 },
    { id: 'body-breath', type: 'stretchY', pivot: [0.62, 0.97], mask: [{ rect: [-1, -1, 2, 0.81], soft: 0.19 }],
      amount: 0.008, freq: 2.1 },
  ],

  // From `prepare_art.py --eyes king-dedede 0.44 0.26 0.62 0.40`.
  eyes: [
    { center: [0.513, 0.332], radius: [0.05, 0.04] },
    { center: [0.581, 0.316], radius: [0.025, 0.028] },
  ],
  blink: {
    every: 3.7, length: 0.18, doubleEvery: 3,
    skinUV: [0.445, 0.345],                              // lid colour is sampled here
    keep: { min: [0.55, 0, 0], max: [1, 1, 0.42] },     // yellow brim and beak stay in front of the lid
  },

  framing: {
    splash: { charPos: [0.3, -0.07], charScale: 1.2, cam: [0, 0, 0], drift: 1, heat: 0, streaks: 1, particles: 1, smoke: 1, dim: 0 },
    banner: { charPos: [0.44, -0.1], charScale: 1.1, cam: [0, 0, 0], drift: 0.6, heat: 0, streaks: 0.4, particles: 0.7, smoke: 0.55, dim: 0.12 },
  },

  fx: {
    grade: { shadow: [0.05, 0.02, 0.13], light: [1.0, 0.8, 0.96], mix: 0.42, gain: 0.66 },
    glow: [1.0, 0.62, 0.3],
    glowOffset: [0, 0.05],
    streaks: [[1.0, 0.82, 0.6], [0.45, 1.0, 0.86]],
    rim: { light: [1.0, 0.86, 0.56], shadow: [1.0, 0.32, 0.72], shade: [0.84, 0.74, 1.0], offset: [0.008, 0.007] },
    smoke: [0.04, 0.0, 0.08],
    leak: [0.65, 0.45, 1.0],
    colors: { star: [1.0, 0.85, 0.35], twinkle: [1.0, 0.95, 0.85], twinkle2: [0.6, 0.85, 1.0], ember: [1.0, 0.45, 0.75], foreground: [0.05, 0.0, 0.08] },
    particles: { stars: 46, twinkles: 26, embers: 40, foreground: 5, burst: 44 },
  },
};
