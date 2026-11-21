// Point cloud under the pointer (formations hero, client request 2026-11-21, after a hover
// effect seen on another training site). The ground is a jittered grid of survey points,
// invisible at rest. The mouse scans it like a photogrammetry drone: the points near the
// pointer light up and join into a triangulated mesh, a few become ground control targets,
// and the mesh fades behind the pointer. sweep() passes a scan line across the hero (used
// when the path changes, in the new colour).
// Mouse only (no touch), never under reduced motion: the caller checks before calling.

export type PointCloud = { setColour: (hex: string) => void; sweep: () => void };

const SPACING = 28; // px between survey points
const RADIUS = 150; // px lit around the pointer
const DECAY = 0.95; // heat kept per frame once the pointer has moved on
const LINK = 0.22; // heat above which two neighbours are linked

// Small seeded generator: the same jitter on every load.
function seeded(seed: number) {
  return () => {
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const toRgb = (hex: string) => {
  const m = /^#?([\da-f]{2})([\da-f]{2})([\da-f]{2})$/i.exec(hex.trim());
  return m ? `${parseInt(m[1], 16)} ${parseInt(m[2], 16)} ${parseInt(m[3], 16)}` : '255 255 255';
};

export function pointCloud(host: HTMLElement, canvas: HTMLCanvasElement, colour: string): PointCloud | null {
  const ctx = canvas.getContext('2d');
  if (!ctx) return null;

  let rgb = toRgb(colour);
  let w = 0;
  let h = 0;
  let cols = 0;
  let rows = 0;
  let xs = new Float32Array(0);
  let ys = new Float32Array(0);
  let heat = new Float32Array(0);
  let target = new Uint8Array(0);
  let pointer: { x: number; y: number } | null = null;
  let sweepStart = 0;
  let raf = 0;

  const layout = () => {
    const r = canvas.getBoundingClientRect();
    w = r.width;
    h = r.height;
    const dpr = Math.min(2, devicePixelRatio || 1);
    canvas.width = Math.round(w * dpr);
    canvas.height = Math.round(h * dpr);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    cols = Math.ceil(w / SPACING) + 1;
    rows = Math.ceil(h / SPACING) + 1;
    const n = cols * rows;
    xs = new Float32Array(n);
    ys = new Float32Array(n);
    heat = new Float32Array(n);
    target = new Uint8Array(n);
    const rand = seeded(1306);
    for (let j = 0; j < rows; j++) {
      for (let i = 0; i < cols; i++) {
        const k = j * cols + i;
        xs[k] = i * SPACING + SPACING / 2 + (rand() - 0.5) * 10;
        ys[k] = j * SPACING + SPACING / 2 + (rand() - 0.5) * 10;
        target[k] = rand() < 0.035 ? 1 : 0;
      }
    }
  };

  // Raise the heat of the points within r of (x, y).
  const warm = (x: number, y: number, r: number, strength: number) => {
    const i0 = Math.max(0, Math.floor((x - r) / SPACING));
    const i1 = Math.min(cols - 1, Math.ceil((x + r) / SPACING));
    const j0 = Math.max(0, Math.floor((y - r) / SPACING));
    const j1 = Math.min(rows - 1, Math.ceil((y + r) / SPACING));
    for (let j = j0; j <= j1; j++) {
      for (let i = i0; i <= i1; i++) {
        const k = j * cols + i;
        const d = Math.hypot(xs[k] - x, ys[k] - y);
        if (d < r) heat[k] = Math.max(heat[k], (1 - d / r) ** 1.5 * strength);
      }
    }
  };

  const link = (a: number, b: number) => {
    const m = Math.min(heat[a], heat[b]);
    if (m < LINK) return;
    ctx.globalAlpha = (m - LINK) * 0.75;
    ctx.beginPath();
    ctx.moveTo(xs[a], ys[a]);
    ctx.lineTo(xs[b], ys[b]);
    ctx.stroke();
  };

  // Draws one frame; returns whether another one is needed.
  const frame = (now: number) => {
    let busy = false;
    if (sweepStart) {
      const p = (now - sweepStart) / 1500;
      if (p < 1) {
        busy = true;
        const x = -80 + p * (w + 160);
        for (let y = 0; y < h + 60; y += 56) warm(x, y, 90, 0.6);
      } else sweepStart = 0;
    }
    if (pointer) warm(pointer.x, pointer.y, RADIUS, 1);

    ctx.clearRect(0, 0, w, h);
    const colourFill = `rgb(${rgb})`;

    // A soft glow under the pointer, like the light of a sensor.
    if (pointer) {
      const g = ctx.createRadialGradient(pointer.x, pointer.y, 0, pointer.x, pointer.y, RADIUS * 1.3);
      g.addColorStop(0, `rgb(${rgb} / 0.1)`);
      g.addColorStop(1, `rgb(${rgb} / 0)`);
      ctx.globalAlpha = 1;
      ctx.fillStyle = g;
      ctx.fillRect(pointer.x - RADIUS * 1.3, pointer.y - RADIUS * 1.3, RADIUS * 2.6, RADIUS * 2.6);
    }

    // Mesh: each cell is split along a diagonal that alternates, as in a terrain model.
    ctx.lineWidth = 1;
    ctx.strokeStyle = colourFill;
    for (let j = 0; j < rows; j++) {
      for (let i = 0; i < cols; i++) {
        const k = j * cols + i;
        if (heat[k] < LINK) continue;
        if (i + 1 < cols) link(k, k + 1);
        if (j + 1 < rows) {
          link(k, k + cols);
          if ((i + j) % 2 === 0 && i + 1 < cols) link(k, k + cols + 1);
          if ((i + j) % 2 === 1 && i > 0) link(k, k + cols - 1);
        }
      }
    }

    // Points, ground control targets, and the fading trail.
    ctx.fillStyle = colourFill;
    for (let k = 0; k < heat.length; k++) {
      const t = heat[k];
      if (t <= 0) continue;
      ctx.globalAlpha = 0.08 + t * 0.85;
      ctx.beginPath();
      ctx.arc(xs[k], ys[k], 0.8 + t * 2, 0, Math.PI * 2);
      ctx.fill();
      if (target[k] && t > 0.35) {
        // Ground control target: a square with a cross, in white.
        const s = 4 + t * 5;
        ctx.globalAlpha = t * 0.9;
        ctx.strokeStyle = '#fff';
        ctx.strokeRect(xs[k] - s, ys[k] - s, s * 2, s * 2);
        ctx.beginPath();
        ctx.moveTo(xs[k] - s, ys[k]);
        ctx.lineTo(xs[k] + s, ys[k]);
        ctx.moveTo(xs[k], ys[k] - s);
        ctx.lineTo(xs[k], ys[k] + s);
        ctx.stroke();
        ctx.strokeStyle = colourFill;
      }
      // Points out of the pointer's reach cool down.
      if (!pointer || Math.hypot(xs[k] - pointer.x, ys[k] - pointer.y) > RADIUS) {
        heat[k] = t * DECAY;
        if (heat[k] < 0.01) heat[k] = 0;
        else busy = true;
      }
    }
    ctx.globalAlpha = 1;
    return busy;
  };

  const tick = (now: number) => {
    raf = 0;
    if (frame(now)) raf = requestAnimationFrame(tick);
  };
  const kick = () => {
    if (!raf) raf = requestAnimationFrame(tick);
  };

  host.addEventListener('pointermove', (e) => {
    if (e.pointerType !== 'mouse') return;
    const r = canvas.getBoundingClientRect();
    pointer = { x: e.clientX - r.left, y: e.clientY - r.top };
    kick();
  });
  const away = () => {
    pointer = null;
    kick();
  };
  host.addEventListener('pointerleave', away);
  addEventListener('scroll', away, { passive: true });
  // The hero's height follows its content (fonts, viewport): redraw the grid whenever the
  // canvas changes size (also runs once at start).
  new ResizeObserver(() => {
    layout();
    kick();
  }).observe(canvas);

  return {
    setColour: (hex) => {
      rgb = toRgb(hex);
      kick();
    },
    sweep: () => {
      sweepStart = performance.now();
      kick();
    },
  };
}
