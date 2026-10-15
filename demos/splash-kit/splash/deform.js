// Rig deformation, evaluated per mesh vertex on the CPU every frame.
// Pure functions (no DOM), so tests can run them in Node.
//
// Rig space: x = u * aspect, y = 1 - v, so 1 unit is the render's height and
// rotations do not shear. Masks are evaluated once on the rest pose.

const smooth = (a, b, x) => { const t = Math.min(1, Math.max(0, (x - a) / (b - a))); return t * t * (3 - 2 * t); };

function segmentDistance(px, py, ax, ay, bx, by) {
  const pax = px - ax, pay = py - ay, bax = bx - ax, bay = by - ay;
  const h = Math.min(1, Math.max(0, (pax * bax + pay * bay) / (bax * bax + bay * bay)));
  return Math.hypot(pax - bax * h, pay - bay * h);
}

/** Weight 0..1 of one mask shape at UV (u, v). Shapes are documented in ../README.md. */
export function shapeWeight(shape, u, v, aspect) {
  const px = u * aspect, py = 1 - v;
  if (shape.circle) {
    const [cu, cv, r] = shape.circle;
    return 1 - smooth(0.45, 1, Math.hypot(px - cu * aspect, py - (1 - cv)) / r);
  }
  if (shape.capsule) {
    const [u1, v1, u2, v2, r] = shape.capsule;
    return 1 - smooth(r * 0.5, r, segmentDistance(px, py, u1 * aspect, 1 - v1, u2 * aspect, 1 - v2));
  }
  if (shape.rect) {
    const [u0, v0, u1, v1] = shape.rect, f = shape.soft ?? 0.04;
    return smooth(u0 - f, u0 + f, u) * (1 - smooth(u1 - f, u1 + f, u)) * smooth(v0 - f, v0 + f, v) * (1 - smooth(v1 - f, v1 + f, v));
  }
  if (shape.all) return 1;
  throw new Error(`Unknown mask shape: ${JSON.stringify(shape)}`);
}

/** Per-deformer weight arrays for every vertex. `minus` removes another deformer's region. */
export function deformerWeights(rig, uv, aspect) {
  const n = uv.length / 2, list = [], byId = {};
  for (const d of rig.deformers) {
    const w = new Float32Array(n);
    for (let i = 0; i < n; i++) {
      let m = 0;
      for (const s of d.mask) m = Math.max(m, shapeWeight(s, uv[i * 2], uv[i * 2 + 1], aspect));
      w[i] = m * (d.strength ?? 1);
    }
    list.push(w); byId[d.id] = w;
  }
  rig.deformers.forEach((d, k) => {
    for (const other of d.minus || []) {
      const o = byId[other];
      if (!o) throw new Error(`${d.id}: minus refers to unknown deformer ${other}`);
      for (let i = 0; i < n; i++) list[k][i] *= 1 - Math.min(1, o[i]);
    }
  });
  return { list, byId };
}

/** Writes world-space positions for time t into `out` (same length as `uv`). */
export function deformRig(rig, weights, uv, out, t, aspect, charPos, charScale) {
  const ds = rig.deformers, n = uv.length / 2;
  const vals = ds.map(d => d.amount * Math.sin(t * d.freq + (d.phase || 0)));
  const piv = ds.map(d => d.pivot ? [d.pivot[0] * aspect, 1 - d.pivot[1]] : null);
  for (let i = 0; i < n; i++) {
    const u = uv[i * 2], v = uv[i * 2 + 1];
    let x = u * aspect, y = 1 - v;
    for (let k = 0; k < ds.length; k++) {
      const w = weights.list[k][i];
      if (w < 1e-4) continue;
      const d = ds[k], val = vals[k] * w, p = piv[k];
      switch (d.type) {
        case 'rotate': {
          const s = Math.sin(val), c = Math.cos(val), dx = x - p[0], dy = y - p[1];
          x = p[0] + c * dx - s * dy; y = p[1] + s * dx + c * dy; break;
        }
        case 'scale': x = p[0] + (x - p[0]) * (1 + val); y = p[1] + (y - p[1]) * (1 + val); break;
        case 'stretchY': y = p[1] + (y - p[1]) * (1 + val); break;
        case 'translate': x += d.direction[0] * val; y += d.direction[1] * val; break;
        case 'wave': {
          const ph = t * d.freq + u * d.spatial[0] + v * d.spatial[1];
          x += w * d.amplitude[0] * Math.sin(ph); y += w * d.amplitude[1] * Math.sin(ph * 0.87 + 1.3); break;
        }
        default: throw new Error(`${d.id}: unknown deformer type ${d.type}`);
      }
    }
    out[i * 2] = charPos[0] + (x - aspect * 0.5) * charScale;
    out[i * 2 + 1] = charPos[1] + (y - 0.5) * charScale;
  }
}
