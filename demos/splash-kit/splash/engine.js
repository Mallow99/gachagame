// Splash engine: one rigged character render over a graded background, with
// streaks, particles, smoke and a pull-in intro. Everything character-specific
// lives in a rig file (../rigs/*.js); this file should not need edits per fighter.
//
// Coordinates: the stage is 1 unit tall and `aspect` units wide, origin at the
// centre, y up. Rig UVs are 0..1 over the render with v down (as in image editors).

import { deformerWeights, deformRig } from './deform.js';

const CAM = `
uniform vec4 uCam; uniform float uAsp;
vec2 toClip(vec2 w, float par){
  float z = 1.0 + (uCam.z - 1.0) * par; float a = uCam.w * par;
  vec2 p = w - uCam.xy * par; float s = sin(a), c = cos(a);
  p = vec2(c*p.x - s*p.y, s*p.x + c*p.y) * z;
  return p / vec2(uAsp * 0.5, 0.5);
}
vec2 fromScreen(vec2 sc, float par){
  float z = 1.0 + (uCam.z - 1.0) * par; float a = -uCam.w * par;
  vec2 p = sc / z; float s = sin(a), c = cos(a);
  return vec2(c*p.x - s*p.y, s*p.x + c*p.y) + uCam.xy * par;
}`;

const QUAD_VS = `attribute vec2 aP; varying vec2 vC; void main(){ vC = aP; gl_Position = vec4(aP, 0.0, 1.0); }`;

const BG_FS = `precision highp float;
varying vec2 vC; uniform sampler2D uBg; uniform float uT, uHeat, uDim; uniform vec2 uGlowPos, uBgAsp;
uniform vec4 uBgFrame; uniform vec3 uShadow, uLight, uGlow, uStreakA, uStreakB; uniform float uGrade, uGain, uStreaks;
${CAM}
float h1(float n){ return fract(sin(n * 127.1) * 43758.5453); }
vec3 streaks(vec2 ws, float density, float thresh, float t){
  vec2 d = normalize(vec2(1.0, -0.38)); vec2 pp = vec2(-d.y, d.x);
  float v = dot(ws, pp) * density; float id = floor(v); float f = fract(v);
  float h = h1(id), h2 = h1(id + 31.7);
  float speed = (0.9 + h2 * 1.6) * (1.0 + 3.5 * uHeat);
  float u = fract(dot(ws, d) * (0.8 + h * 1.2) - t * speed * 0.6 + h2 * 10.0);
  float dash = smoothstep(0.0, 0.06, u) * (1.0 - smoothstep(0.2 + 0.3 * h, 0.55 + 0.35 * h, u));
  float band = pow(max(0.0, 1.0 - abs(f - 0.5) * 2.0), 2.0 + h2 * 6.0);
  vec3 col = h2 > 0.72 ? uStreakB : mix(uStreakA, vec3(1.0), h2 * 0.6);
  return col * step(thresh, h) * dash * band;
}
void main(){
  vec2 sc = vec2(vC.x * uAsp * 0.5, vC.y * 0.5);
  vec2 w = fromScreen(sc, 0.35);
  // uBgFrame: focus u, focus v, coverage (stage heights the image spans), unused
  float bh = uBgFrame.z, bw = bh * uBgAsp.x;
  vec2 uv = vec2(uBgFrame.x + w.x / bw, uBgFrame.y - w.y / bh);
  vec3 c = texture2D(uBg, clamp(uv, 0.001, 0.999)).rgb;
  float l = dot(c, vec3(0.3, 0.59, 0.11));
  vec3 graded = mix(uShadow, uLight, smoothstep(0.05, 0.95, l));
  c = mix(c, graded, uGrade) * uGain * (1.0 - uDim);
  vec2 wc = fromScreen(sc, 1.0);
  float gd = length((wc - uGlowPos) * vec2(0.85, 1.0));
  c += uGlow * 0.5 * exp(-gd * 2.6) * (0.85 + 0.15 * sin(uT * 2.1)) * (1.0 - uDim * 0.6);
  float boost = uStreaks * (0.6 + 1.2 * uHeat);
  c += streaks(fromScreen(sc, 0.7), 70.0, 0.72, uT) * boost;
  c += streaks(fromScreen(sc, 0.5), 16.0, 0.8, uT * 0.7) * 0.22 * boost;
  gl_FragColor = vec4(c, 1.0);
}`;

const CHAR_VS = `precision highp float;
attribute vec2 aPos; attribute vec2 aUV; attribute float aW;
varying vec2 vUV; varying float vW;
${CAM}
void main(){ vUV = aUV; vW = aW; gl_Position = vec4(toClip(aPos, 1.0), 0.0, 1.0); }`;

const CHAR_FS = `precision highp float;
varying vec2 vUV; varying float vW;
uniform sampler2D uTex; uniform float uBlink, uView, uFade;
uniform vec4 uEye[2]; uniform vec2 uSkinUV; uniform vec3 uKeepMin, uKeepMax;
uniform vec3 uRimLight, uRimShadow, uShade; uniform vec2 uRimOffset;
void lid(inout vec3 col, vec4 src, vec4 eye, vec3 skin){
  if (eye.z <= 0.0 || uBlink <= 0.0) return;
  vec2 q = (vUV - eye.xy) / eye.zw;
  if (length(q) > 1.0) return;
  // Pixels inside the keep box belong to whatever overlaps the eye (brim, beak): leave them.
  if (all(greaterThanEqual(src.rgb, uKeepMin)) && all(lessThanEqual(src.rgb, uKeepMax))) return;
  float line = mix(-1.15, 1.05, uBlink);
  if (q.y < line) col = skin * (0.78 + 0.22 * clamp((q.y + 1.0) * 0.5, 0.0, 1.0));
  col *= 1.0 - 0.55 * (1.0 - smoothstep(0.0, 0.16, abs(q.y - line)));
}
void main(){
  if (uView > 1.5) { gl_FragColor = vec4(mix(vec3(0.15, 0.35, 1.0), vec3(1.0, 0.2, 0.25), vW), 1.0) * (0.15 + 0.6 * vW); return; }
  if (uView > 0.5) { gl_FragColor = vec4(1.0, 0.82, 0.35, 1.0) * 0.35; return; }
  vec4 s = texture2D(uTex, vUV);
  if (s.a < 0.004) discard;
  vec3 col = s.rgb;
  vec3 skin = texture2D(uTex, uSkinUV).rgb;
  lid(col, s, uEye[0], skin);
  lid(col, s, uEye[1], skin);
  float sh = smoothstep(0.25, 1.15, vUV.x * 0.6 + vUV.y * 0.8);
  col *= mix(1.06, 0.68, sh);
  col = mix(col, col * uShade, sh * 0.5);
  float aL = texture2D(uTex, vUV - uRimOffset).a;
  float aR = texture2D(uTex, vUV + uRimOffset * 1.1).a;
  col += uRimLight * s.a * (1.0 - aL) * 0.9;
  col += uRimShadow * s.a * (1.0 - aR) * 0.8;
  gl_FragColor = vec4(col * s.a, s.a) * uFade;
}`;

const PT_VS = `precision highp float;
attribute vec4 aS; attribute float aK;
uniform float uT, uIntroT, uPx, uLayer, uAmount; uniform vec2 uBurst;
uniform vec3 uColStar, uColSpark, uColSpark2, uColEmber, uColFg;
varying float vK, vA, vRot; varying vec3 vCol;
${CAM}
void main(){
  float k = aK; vec2 w; float par = 1.0, size = 0.0, a = 1.0, front = 0.0; vec3 col = vec3(1.0);
  float X = uAsp * 0.5 * 1.35, Y = 0.5 * 1.35;
  if (k < 0.5) {            // drifting stars
    w = vec2((fract(aS.x + uT * 0.025 * (0.4 + aS.z)) - 0.5) * 2.0 * X, (fract(aS.y - uT * 0.01 * (0.4 + aS.z)) - 0.5) * 2.0 * Y);
    par = 0.5 + aS.z * 0.9; size = 7.0 + aS.w * 20.0; col = uColStar;
    a = (0.55 + 0.45 * sin(uT * 3.0 + aS.x * 40.0)) * uAmount; front = step(0.6, aS.z);
  } else if (k < 1.5) {     // twinkles
    w = vec2((aS.x - 0.5) * 2.0 * X, (aS.y - 0.5) * 2.0 * Y); par = 0.6 + aS.z * 0.6; size = 18.0 + aS.w * 34.0;
    a = pow(max(0.0, sin(uT * (1.3 + aS.z * 1.7) + aS.w * 30.0)), 10.0) * uAmount;
    col = mix(uColSpark, uColSpark2, step(0.7, aS.w)); front = step(0.5, aS.z);
  } else if (k < 2.5) {     // embers
    w = vec2((fract(aS.x + uT * 0.06 * (0.5 + aS.z)) - 0.5) * 2.0 * X, (fract(aS.y - uT * 0.025 * (0.5 + aS.z) + 0.02 * sin(uT * 2.0 + aS.w * 20.0)) - 0.5) * 2.0 * Y);
    par = 0.7 + aS.z * 0.6; size = 3.0 + aS.w * 6.0; col = uColEmber;
    a = (0.6 + 0.4 * sin(uT * 9.0 + aS.x * 90.0)) * uAmount; front = step(0.5, aS.z);
  } else if (k < 3.5) {     // out-of-focus foreground silhouettes, kept to top and bottom bands
    float band = aS.y < 0.55 ? -0.47 - aS.y * 0.2 : 0.44 + (aS.y - 0.55) * 0.25;
    w = vec2((fract(aS.x + uT * 0.045 * (0.6 + aS.z)) - 0.5) * 2.0 * X * 1.2, band + 0.03 * sin(uT * 0.8 + aS.w * 9.0));
    par = 1.7; size = 90.0 + aS.w * 130.0; col = uColFg; a = 0.5 * uAmount; front = 1.0;
  } else {                  // pull burst
    float e = 1.0 - pow(1.0 - clamp(uIntroT / 1.3, 0.0, 1.0), 3.0);
    float ang = aS.x * 6.2832; float dist = (0.35 + aS.y * 0.9) * e;
    w = uBurst + vec2(cos(ang), sin(ang)) * dist * vec2(1.2, 1.0); size = (14.0 + aS.w * 26.0) * (1.0 - 0.5 * e);
    col = uColStar; a = 1.0 - smoothstep(0.6, 1.6, uIntroT); front = 1.0;
  }
  if (abs(front - uLayer) > 0.5 || a <= 0.001) { gl_Position = vec4(2.0, 2.0, 2.0, 1.0); gl_PointSize = 0.0; return; }
  gl_Position = vec4(toClip(w, par), 0.0, 1.0);
  gl_PointSize = size * uPx * (1.0 + (uCam.z - 1.0) * par);
  vK = k; vA = a; vCol = col; vRot = uT * (aS.z - 0.5) * 2.5 + aS.w * 6.0;
}`;

const PT_FS = `precision highp float;
varying float vK, vA, vRot; varying vec3 vCol;
float star5(vec2 p, float f){ float a = atan(p.y, p.x); float st = 0.21 + 0.27 * pow(abs(cos(2.5 * a)), 4.0); return 1.0 - smoothstep(st - f, st + f, length(p)); }
void main(){
  vec2 p = gl_PointCoord - 0.5; float s = sin(vRot), c = cos(vRot); p = vec2(c*p.x - s*p.y, s*p.x + c*p.y);
  float r = length(p);
  if (vK < 0.5 || vK > 3.5) { float m = star5(p, 0.025) + exp(-r * r * 18.0) * 0.5; gl_FragColor = vec4(vCol * m * vA, 0.0); }
  else if (vK < 1.5) { float a = atan(p.y, p.x); float sp = 0.02 + 0.46 * pow(abs(cos(2.0 * a)), 30.0); float m = 1.0 - smoothstep(sp * 0.6, sp, r) + exp(-r * r * 120.0); gl_FragColor = vec4(vCol * m * vA, 0.0); }
  else if (vK < 2.5) { gl_FragColor = vec4(vCol * exp(-r * r * 40.0) * vA * 1.4, 0.0); }
  else { float m = star5(p, 0.12) * vA; gl_FragColor = vec4(vCol * m, m); }
}`;

const OV_FS = `precision highp float;
varying vec2 vC; uniform float uT, uFlash, uAsp, uSmoke; uniform vec3 uSmokeCol, uLeak;
float hash(vec2 p){ return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }
float noise(vec2 p){ vec2 i = floor(p), f = fract(p); f = f * f * (3.0 - 2.0 * f);
  return mix(mix(hash(i), hash(i + vec2(1, 0)), f.x), mix(hash(i + vec2(0, 1)), hash(i + vec2(1, 1)), f.x), f.y); }
float fbm(vec2 p){ float v = 0.0, a = 0.5; for (int i = 0; i < 5; i++) { v += a * noise(p); p *= 2.03; a *= 0.5; } return v; }
void main(){
  vec2 sc = vec2(vC.x * uAsp * 0.5, vC.y * 0.5);
  float vg = smoothstep(0.6, 1.35, length(vC * vec2(1.0, 0.9)));
  float n = fbm(sc * 3.0 + vec2(uT * 0.12, -uT * 0.05));
  float smokeL = smoothstep(-0.42, -0.9, sc.x + (n - 0.5) * 0.6);
  float n2 = fbm(sc * 2.5 - vec2(uT * 0.08, uT * 0.04) + 7.0);
  float smokeB = smoothstep(-0.28, -0.52, sc.y + (n2 - 0.5) * 0.35) * smoothstep(-0.3, 0.6, sc.x);
  float dark = clamp(max(vg * 0.85, max(smokeL * 0.9, smokeB * 0.75) * uSmoke), 0.0, 1.0);
  vec3 add = vec3(1.0, 0.97, 0.92) * uFlash;
  add += uLeak * 0.1 * (0.5 + 0.5 * sin(uT * 0.7)) * exp(-length(sc - vec2(-0.9, 0.5)) * 2.0);
  add += vec3(hash(gl_FragCoord.xy + fract(uT) * 91.0)) * 0.03;
  gl_FragColor = vec4(uSmokeCol * dark + add, dark);
}`;

const clamp01 = x => Math.min(1, Math.max(0, x));
const easeOutExpo = x => x >= 1 ? 1 : 1 - Math.pow(2, -10 * x);
const easeInOut = x => x < .5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2;
const lerp = (a, b, t) => a + (b - a) * t;
const lerpArr = (a, b, t) => a.map((v, i) => lerp(v, b[i], t));

function loadImage(url) {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = () => reject(new Error(`Could not load ${url}`));
    img.src = url;
  });
}

/**
 * @param {HTMLCanvasElement} canvas
 * @param {object} rig       a rig module's default export
 * @param {URL|string} base  URL the rig's art paths are relative to
 */
export async function createSplash(canvas, rig, base) {
  const gl = canvas.getContext('webgl', { antialias: true, alpha: false, premultipliedAlpha: true });
  if (!gl) throw new Error('WebGL is unavailable in this browser.');

  const shader = (type, src) => {
    const s = gl.createShader(type); gl.shaderSource(s, src); gl.compileShader(s);
    if (!gl.getShaderParameter(s, gl.COMPILE_STATUS)) throw new Error(gl.getShaderInfoLog(s));
    return s;
  };
  const program = (vs, fs) => {
    const p = gl.createProgram();
    gl.attachShader(p, shader(gl.VERTEX_SHADER, vs)); gl.attachShader(p, shader(gl.FRAGMENT_SHADER, fs));
    gl.linkProgram(p);
    if (!gl.getProgramParameter(p, gl.LINK_STATUS)) throw new Error(gl.getProgramInfoLog(p));
    const u = {}, a = {};
    for (let i = 0, n = gl.getProgramParameter(p, gl.ACTIVE_UNIFORMS); i < n; i++) {
      const name = gl.getActiveUniform(p, i).name.replace('[0]', '');
      u[name] = gl.getUniformLocation(p, name);
    }
    for (let i = 0, n = gl.getProgramParameter(p, gl.ACTIVE_ATTRIBUTES); i < n; i++) {
      const name = gl.getActiveAttrib(p, i).name; a[name] = gl.getAttribLocation(p, name);
    }
    return { p, u, a };
  };
  const texture = img => {
    const t = gl.createTexture(); gl.bindTexture(gl.TEXTURE_2D, t);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, img);
    for (const [k, v] of [[gl.TEXTURE_MIN_FILTER, gl.LINEAR], [gl.TEXTURE_MAG_FILTER, gl.LINEAR], [gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE], [gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE]])
      gl.texParameteri(gl.TEXTURE_2D, k, v);
    return t;
  };

  const bgP = program(QUAD_VS, BG_FS), chP = program(CHAR_VS, CHAR_FS);
  const ptP = program(PT_VS, PT_FS), ovP = program(QUAD_VS, OV_FS);
  const [bgImg, artImg] = await Promise.all([
    loadImage(new URL(rig.background.src, base)), loadImage(new URL(rig.art.src, base)),
  ]);
  const bgTex = texture(bgImg), artTex = texture(artImg);
  const artAspect = artImg.width / artImg.height;

  // Mesh: a grid over the render, trimmed to cells that touch opaque pixels.
  const [GX, GY] = rig.art.grid;
  const probe = document.createElement('canvas'); probe.width = GX * 2; probe.height = GY * 2;
  const pctx = probe.getContext('2d', { willReadFrequently: true });
  pctx.drawImage(artImg, 0, 0, probe.width, probe.height);
  const alpha = pctx.getImageData(0, 0, probe.width, probe.height).data;
  const solid = (i, j) => {
    for (let y = Math.max(0, j * 2 - 1); y <= Math.min(probe.height - 1, j * 2 + 2); y++)
      for (let x = Math.max(0, i * 2 - 1); x <= Math.min(probe.width - 1, i * 2 + 2); x++)
        if (alpha[(y * probe.width + x) * 4 + 3] > 8) return true;
    return false;
  };
  const uvs = [];
  for (let j = 0; j <= GY; j++) for (let i = 0; i <= GX; i++) uvs.push(i / GX, j / GY);
  const tris = [], lines = [], vid = (i, j) => j * (GX + 1) + i;
  for (let j = 0; j < GY; j++) for (let i = 0; i < GX; i++) {
    if (!solid(i, j)) continue;
    const a = vid(i, j), b = vid(i + 1, j), c = vid(i, j + 1), d = vid(i + 1, j + 1);
    tris.push(a, b, c, b, d, c); lines.push(a, b, a, c, b, c, b, d, c, d);
  }
  const uvArr = new Float32Array(uvs);
  const weights = deformerWeights(rig, uvArr, artAspect);
  const posArr = new Float32Array(uvArr.length);
  const mkBuf = (target, data, usage = gl.STATIC_DRAW) => { const b = gl.createBuffer(); gl.bindBuffer(target, b); gl.bufferData(target, data, usage); return b; };
  const uvBuf = mkBuf(gl.ARRAY_BUFFER, uvArr);
  const posBuf = mkBuf(gl.ARRAY_BUFFER, posArr, gl.DYNAMIC_DRAW);
  const wBuf = mkBuf(gl.ARRAY_BUFFER, new Float32Array(uvArr.length / 2), gl.DYNAMIC_DRAW);
  const triBuf = mkBuf(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(tris));
  const lineBuf = mkBuf(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(lines));
  const quadBuf = mkBuf(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]));

  // Particles: [kind, count] from rig.fx.particles
  const pData = []; let seed = 7;
  const rnd = () => (seed = (seed * 16807) % 2147483647) / 2147483647;
  const kinds = { stars: 0, twinkles: 1, embers: 2, foreground: 3, burst: 4 };
  for (const [name, count] of Object.entries(rig.fx.particles))
    for (let i = 0; i < count; i++) pData.push(rnd(), rnd(), rnd(), rnd(), kinds[name]);
  const pCount = pData.length / 5;
  const pBuf = mkBuf(gl.ARRAY_BUFFER, new Float32Array(pData));

  const fx = rig.fx;
  const frames = rig.framing;
  let mode = 'splash', fromFrame = frames.splash, toFrame = frames.splash, frameAt = -1, frameDur = 0.8;
  let clock0 = performance.now(), introAt = -99, paused = false, pausedAt = 0, running = true;
  let view = 'off', viewWeights = null, characterAlpha = 1, raf = 0, onReveal = null, revealed = true;

  const time = () => ((paused ? pausedAt : performance.now()) - clock0) / 1000;
  const frameNow = t => {
    const k = frameAt < 0 ? 1 : easeInOut(clamp01((t - frameAt) / frameDur));
    const out = {};
    for (const key of Object.keys(toFrame)) out[key] = Array.isArray(toFrame[key]) ? lerpArr(fromFrame[key], toFrame[key], k) : lerp(fromFrame[key], toFrame[key], k);
    return out;
  };

  function resize() {
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const w = Math.max(1, Math.round(canvas.clientWidth * dpr)), h = Math.max(1, Math.round(canvas.clientHeight * dpr));
    if (canvas.width !== w || canvas.height !== h) { canvas.width = w; canvas.height = h; }
  }

  const blinkAt = t => {
    const { every, length, doubleEvery } = rig.blink;
    const ph = (t + 1.3) % every, cycle = Math.floor((t + 1.3) / every);
    if (ph < length) return Math.sin(ph / length * Math.PI);
    if (doubleEvery && cycle % doubleEvery === 1 && ph > length * 1.6 && ph < length * 2.6) return Math.sin((ph - length * 1.6) / length * Math.PI);
    return 0;
  };

  function draw() {
    raf = requestAnimationFrame(draw);
    if (!running) return;
    resize();
    const t = time(), f = frameNow(t), ti = t - introAt;
    const e = easeOutExpo(clamp01(ti / 1.5));
    if (!revealed && ti > 1.1) { revealed = true; onReveal?.(); }
    const asp = canvas.width / canvas.height;
    const cam = [
      f.drift * 0.015 * Math.sin(t * 0.5) + 0.07 * (1 - e) + f.cam[0],
      f.drift * 0.01 * Math.sin(t * 0.37) - 0.03 * (1 - e) + f.cam[1],
      1 + f.drift * 0.012 * Math.sin(t * 0.3) + 0.45 * (1 - e) + f.cam[2],
      f.drift * 0.004 * Math.sin(t * 0.4) - 0.09 * (1 - e),
    ];
    const heat = Math.max(1 - e, f.heat);
    const flash = Math.pow(clamp01(1 - ti / 0.6), 2);

    deformRig(rig, weights, uvArr, posArr, t, artAspect, f.charPos, f.charScale);
    gl.bindBuffer(gl.ARRAY_BUFFER, posBuf); gl.bufferSubData(gl.ARRAY_BUFFER, 0, posArr);

    gl.viewport(0, 0, canvas.width, canvas.height);
    gl.enable(gl.BLEND); gl.blendFunc(gl.ONE, gl.ONE_MINUS_SRC_ALPHA);
    const cam4 = (pr) => { gl.uniform4fv(pr.u.uCam, cam); gl.uniform1f(pr.u.uAsp, asp); };
    const attr = (pr, name, buf, size, stride = 0, offset = 0) => {
      const loc = pr.a[name]; if (loc === undefined) return;
      gl.bindBuffer(gl.ARRAY_BUFFER, buf); gl.enableVertexAttribArray(loc); gl.vertexAttribPointer(loc, size, gl.FLOAT, false, stride, offset);
    };
    const off = pr => Object.values(pr.a).forEach(l => gl.disableVertexAttribArray(l));
    const glowPos = [f.charPos[0] + fx.glowOffset[0] * f.charScale, f.charPos[1] + fx.glowOffset[1] * f.charScale];

    // 1. background, glow, streaks
    gl.useProgram(bgP.p); cam4(bgP);
    gl.uniform1f(bgP.u.uT, t); gl.uniform1f(bgP.u.uHeat, heat); gl.uniform1f(bgP.u.uDim, f.dim);
    gl.uniform2f(bgP.u.uGlowPos, glowPos[0], glowPos[1]); gl.uniform2f(bgP.u.uBgAsp, bgImg.width / bgImg.height, 0);
    gl.uniform4f(bgP.u.uBgFrame, rig.background.focus[0], rig.background.focus[1], rig.background.cover, 0);
    gl.uniform3fv(bgP.u.uShadow, fx.grade.shadow); gl.uniform3fv(bgP.u.uLight, fx.grade.light);
    gl.uniform1f(bgP.u.uGrade, fx.grade.mix); gl.uniform1f(bgP.u.uGain, fx.grade.gain);
    gl.uniform3fv(bgP.u.uGlow, fx.glow); gl.uniform3fv(bgP.u.uStreakA, fx.streaks[0]); gl.uniform3fv(bgP.u.uStreakB, fx.streaks[1]);
    gl.uniform1f(bgP.u.uStreaks, f.streaks);
    gl.activeTexture(gl.TEXTURE0); gl.bindTexture(gl.TEXTURE_2D, bgTex); gl.uniform1i(bgP.u.uBg, 0);
    attr(bgP, 'aP', quadBuf, 2); gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4); off(bgP);

    const points = layer => {
      gl.useProgram(ptP.p); cam4(ptP);
      gl.uniform1f(ptP.u.uT, t); gl.uniform1f(ptP.u.uIntroT, ti); gl.uniform1f(ptP.u.uPx, canvas.height / 720);
      gl.uniform1f(ptP.u.uLayer, layer); gl.uniform1f(ptP.u.uAmount, f.particles); gl.uniform2f(ptP.u.uBurst, glowPos[0], glowPos[1]);
      for (const [u, c] of [['uColStar', fx.colors.star], ['uColSpark', fx.colors.twinkle], ['uColSpark2', fx.colors.twinkle2], ['uColEmber', fx.colors.ember], ['uColFg', fx.colors.foreground]])
        gl.uniform3fv(ptP.u[u], c);
      attr(ptP, 'aS', pBuf, 4, 20, 0); attr(ptP, 'aK', pBuf, 1, 20, 16);
      gl.drawArrays(gl.POINTS, 0, pCount); off(ptP);
    };
    points(0);

    // 2. character
    if (characterAlpha > 0) {
      gl.useProgram(chP.p); cam4(chP);
      gl.uniform1f(chP.u.uBlink, blinkAt(t)); gl.uniform1f(chP.u.uFade, characterAlpha); gl.uniform1f(chP.u.uView, 0);
      const eyes = new Float32Array(8);
      rig.eyes.slice(0, 2).forEach((eye, i) => eyes.set([...eye.center, ...eye.radius], i * 4));
      gl.uniform4fv(chP.u.uEye, eyes); gl.uniform2fv(chP.u.uSkinUV, rig.blink.skinUV);
      gl.uniform3fv(chP.u.uKeepMin, rig.blink.keep.min); gl.uniform3fv(chP.u.uKeepMax, rig.blink.keep.max);
      gl.uniform3fv(chP.u.uRimLight, fx.rim.light); gl.uniform3fv(chP.u.uRimShadow, fx.rim.shadow);
      gl.uniform3fv(chP.u.uShade, fx.rim.shade); gl.uniform2fv(chP.u.uRimOffset, fx.rim.offset);
      gl.bindTexture(gl.TEXTURE_2D, artTex); gl.uniform1i(chP.u.uTex, 0);
      attr(chP, 'aPos', posBuf, 2); attr(chP, 'aUV', uvBuf, 2); attr(chP, 'aW', wBuf, 1);
      gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, triBuf); gl.drawElements(gl.TRIANGLES, tris.length, gl.UNSIGNED_SHORT, 0);
      if (view !== 'off') {
        if (viewWeights) { gl.uniform1f(chP.u.uView, 2); gl.drawElements(gl.TRIANGLES, tris.length, gl.UNSIGNED_SHORT, 0); }
        gl.uniform1f(chP.u.uView, 1); gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, lineBuf); gl.drawElements(gl.LINES, lines.length, gl.UNSIGNED_SHORT, 0);
      }
      off(chP);
    }
    points(1);

    // 3. smoke, vignette, flash, grain
    gl.useProgram(ovP.p);
    gl.uniform1f(ovP.u.uT, t); gl.uniform1f(ovP.u.uFlash, flash); gl.uniform1f(ovP.u.uAsp, asp); gl.uniform1f(ovP.u.uSmoke, f.smoke);
    gl.uniform3fv(ovP.u.uSmokeCol, fx.smoke); gl.uniform3fv(ovP.u.uLeak, fx.leak);
    attr(ovP, 'aP', quadBuf, 2); gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4); off(ovP);
  }
  raf = requestAnimationFrame(draw);

  return {
    deformers: rig.deformers.map(d => d.id),
    /** Switch framing ('splash' or 'banner'); eases over 0.8 s unless instant. */
    setMode(next, { instant = false } = {}) {
      const t = time();
      fromFrame = instant ? frames[next] : frameNow(t); toFrame = frames[next]; frameAt = instant ? -1 : t; mode = next;
    },
    get mode() { return mode; },
    /** Flash, zoom and star burst; calls `onRevealed` about 1.1 s in. */
    playIntro(onRevealed) { introAt = time(); revealed = false; onReveal = onRevealed; },
    skipIntro() { introAt = time() - 5; },
    setPaused(p) {
      if (p === paused) return;
      if (p) pausedAt = performance.now(); else clock0 += performance.now() - pausedAt;
      paused = p;
    },
    get paused() { return paused; },
    setRunning(r) { running = r; },
    setCharacterAlpha(a) { characterAlpha = a; },
    /** 'off', 'mesh', or a deformer id to heat-map its weights over the mesh. */
    setView(v) {
      view = v; viewWeights = weights.byId[v] || null;
      gl.bindBuffer(gl.ARRAY_BUFFER, wBuf);
      gl.bufferSubData(gl.ARRAY_BUFFER, 0, viewWeights || new Float32Array(uvArr.length / 2));
    },
    dispose() { cancelAnimationFrame(raf); },
  };
}
