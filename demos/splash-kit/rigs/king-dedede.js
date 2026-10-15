// King Dedede v3 splash rig. The illustrated character is deliberately rigid:
// v2 bent a single flat render and the owner rejected the rubbery result.
// Coordinates were checked against assets/king-dedede-v3/rig-grid.jpg.
export default {
  unitId: 'king-dedede',
  nameplate: { small: 'KING', big: 'DEDEDE' },
  quote: 'I am a superstar warrior!',
  voice: 'assets/audio/dedede-superstar.mp3',
  credit: 'Dedede: Wide Mouth Ink · Stage: Super Smash Bros. Ultimate, Fountain of Dreams',

  art: { src: 'assets/king-dedede-v3/render.png', grid: [48, 48], motion: 'rigid' },
  background: { src: 'assets/fountain-of-dreams/background.jpg', focus: [0.43, 0.47], cover: 1.12 },

  // No per-vertex deformation. Camera depth, blink, light, particles and smoke
  // carry the motion until a painted multi-layer source is available.
  deformers: [],

  // The eye ellipses protect the source drawing while the shader paints a brief
  // purple lid sampled from the brow; gold beak/hat pixels remain untouched.
  eyes: [
    { center: [0.425, 0.412], radius: [0.037, 0.043] },
    { center: [0.493, 0.407], radius: [0.039, 0.048] },
  ],
  blink: {
    every: 4.1, length: 0.16, doubleEvery: 4,
    skinUV: [0.472, 0.385],
    keep: { min: [0.55, 0, 0], max: [1, 1, 0.48] },
  },

  framing: {
    splash: { charPos: [0.34, -0.04], charScale: 1.06, cam: [0, 0, 0], drift: 0.75, heat: 0, streaks: 1.15, particles: 1, smoke: 1, dim: 0 },
    banner: { charPos: [0.43, -0.08], charScale: 0.98, cam: [0, 0, 0], drift: 0.45, heat: 0, streaks: 0.36, particles: 0.72, smoke: 0.48, dim: 0.12 },
  },

  fx: {
    grade: { shadow: [0.043, 0.024, 0.094], light: [0.92, 0.74, 1.0], mix: 0.45, gain: 0.7 },
    glow: [1.0, 0.69, 0.35],
    glowOffset: [-0.02, 0.04],
    streaks: [[1.0, 0.83, 0.48], [0.48, 0.85, 1.0]],
    rim: { light: [1.0, 0.83, 0.42], shadow: [0.48, 0.85, 1.0], shade: [0.82, 0.71, 0.96], offset: [0.007, 0.006] },
    smoke: [0.035, 0.012, 0.08],
    leak: [0.52, 0.38, 1.0],
    colors: { star: [1.0, 0.84, 0.35], twinkle: [1.0, 0.96, 0.84], twinkle2: [0.48, 0.84, 1.0], ember: [1.0, 0.38, 0.46], foreground: [0.035, 0.01, 0.08] },
    particles: { stars: 54, twinkles: 30, embers: 34, foreground: 5, burst: 58 },
  },
};
