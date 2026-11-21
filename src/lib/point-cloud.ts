// Point cloud under the pointer (client request 2026-11-21, after a hover effect seen on
// another training site). Tried on the dark formations hero first, then moved to every white
// section of the page ("too busy on the black part"; "put it on all the white parts, and fade
// them out where they touch the black parts").
//
// The white areas share ONE survey grid aligned on the page, so the points and the mesh run
// on from one white section into the next without a seam. Faint at rest; the mouse scans it
// like a photogrammetry drone: the points near the pointer light up and join into a
// triangulated mesh, a few become ground control targets, and the mesh fades behind the
// pointer. Where an area meets a dark section, its points shrink and fade over FADE px.
//
// Each area has a canvas the size of the screen that sticks to it while it scrolls by
// (PointCloudLayer.astro), so a tall section never needs a huge canvas; it is only allocated
// while the area is on screen.
// Mouse only (no touch), never under reduced motion: the caller checks before calling.

export type PointCloudOptions = {
  /** Colour of the lit points and mesh (hex), read again each time the mouse comes in. */
  colour: () => string;
  /** Colour of the points at rest and of the ground control targets (hex). */
  ink?: string;
};

const SPACING = 28; // px between survey points
const RADIUS = 150; // px lit around the pointer
const DECAY = 0.95; // heat kept per frame once the pointer has moved on
const LINK = 0.22; // heat above which two neighbours are linked
const REST_ALPHA = 0.09;
const FADE = 220; // px over which the points fade out towards a dark section

type Area = {
  section: HTMLElement;
  canvas: HTMLCanvasElement;
  ctx: CanvasRenderingContext2D;
  visible: boolean;
  top: number; // page coordinates of the section
  bottom: number;
  fadeTop: boolean;
  fadeBottom: boolean;
  j0: number; // first grid row covered (page grid)
  cols: number;
  rows: number;
  xs: Float32Array;
  ys: Float32Array;
  heat: Float32Array;
  target: Uint8Array;
  sweepStart: number;
};

// Integer hash → [0, 1): the jitter of a point depends only on its place in the page grid.
const hash = (i: number, j: number, s: number) => {
  let h = (i * 73856093) ^ (j * 19349663) ^ (s * 83492791);
  h = Math.imul(h ^ (h >>> 13), 0x5bd1e995);
  h ^= h >>> 15;
  return (h >>> 0) / 4294967296;
};

const toRgb = (hex: string) => {
  const m = /^#?([\da-f]{2})([\da-f]{2})([\da-f]{2})$/i.exec(hex.trim());
  return m ? `${parseInt(m[1], 16)} ${parseInt(m[2], 16)} ${parseInt(m[3], 16)}` : '0 0 0';
};

const smooth = (t: number) => {
  const x = Math.min(1, Math.max(0, t));
  return x * x * (3 - 2 * x);
};

export function pointClouds(layers: HTMLElement[], opts: PointCloudOptions) {
  const ink = `rgb(${toRgb(opts.ink ?? '#000000')})`;
  let rgb = toRgb(opts.colour());
  let pointer: { x: number; y: number } | null = null; // page coordinates
  let client: { x: number; y: number } | null = null;
  let raf = 0;

  const areas: Area[] = [];
  for (const layer of layers) {
    const canvas = layer.querySelector('canvas');
    const ctx = canvas?.getContext('2d');
    if (!canvas || !ctx || !layer.parentElement) continue;
    layer.classList.add('is-on');
    areas.push({
      section: layer.parentElement,
      canvas,
      ctx,
      visible: false,
      top: 0,
      bottom: 0,
      fadeTop: true,
      fadeBottom: true,
      j0: 0,
      cols: 0,
      rows: 0,
      xs: new Float32Array(0),
      ys: new Float32Array(0),
      heat: new Float32Array(0),
      target: new Uint8Array(0),
      sweepStart: 0,
    });
  }
  if (!areas.length) return null;

  // Where the sections are now; rebuild an area's grid when its rows or width change.
  const measure = () => {
    for (const a of areas) {
      const r = a.section.getBoundingClientRect();
      a.top = r.top + scrollY;
      a.bottom = r.bottom + scrollY;
      const j0 = Math.floor(a.top / SPACING) - 1;
      const rows = Math.ceil(a.bottom / SPACING) + 1 - j0 + 1;
      const cols = Math.ceil(r.width / SPACING) + 1;
      if (j0 === a.j0 && rows === a.rows && cols === a.cols) continue;
      a.j0 = j0;
      a.rows = rows;
      a.cols = cols;
      const n = rows * cols;
      a.xs = new Float32Array(n);
      a.ys = new Float32Array(n);
      a.heat = new Float32Array(n);
      a.target = new Uint8Array(n);
      for (let r2 = 0; r2 < rows; r2++) {
        const j = j0 + r2;
        for (let i = 0; i < cols; i++) {
          const k = r2 * cols + i;
          a.xs[k] = i * SPACING + SPACING / 2 + (hash(i, j, 1) - 0.5) * 10;
          a.ys[k] = j * SPACING + SPACING / 2 + (hash(i, j, 2) - 0.5) * 10;
          a.target[k] = hash(i, j, 3) < 0.035 ? 1 : 0;
        }
      }
    }
    // An edge fades unless another white area starts or ends right there.
    for (const a of areas) {
      a.fadeTop = !areas.some((o) => o !== a && Math.abs(o.bottom - a.top) < 3);
      a.fadeBottom = !areas.some((o) => o !== a && Math.abs(o.top - a.bottom) < 3);
    }
  };

  const fadeAt = (a: Area, y: number) => {
    let f = 1;
    if (a.fadeTop) f = Math.min(f, smooth((y - a.top) / FADE));
    if (a.fadeBottom) f = Math.min(f, smooth((a.bottom - y) / FADE));
    return f;
  };

  // Raise the heat of an area's points within r of (x, y) (page coordinates).
  const warm = (a: Area, x: number, y: number, r: number, strength: number) => {
    const i0 = Math.max(0, Math.floor((x - r) / SPACING));
    const i1 = Math.min(a.cols - 1, Math.ceil((x + r) / SPACING));
    const r0 = Math.max(0, Math.floor((y - r) / SPACING) - a.j0);
    const r1 = Math.min(a.rows - 1, Math.ceil((y + r) / SPACING) - a.j0);
    for (let r2 = r0; r2 <= r1; r2++) {
      for (let i = i0; i <= i1; i++) {
        const k = r2 * a.cols + i;
        const d = Math.hypot(a.xs[k] - x, a.ys[k] - y);
        if (d < r) a.heat[k] = Math.max(a.heat[k], (1 - d / r) ** 1.5 * strength);
      }
    }
  };

  // Draws one area; returns whether it needs another frame.
  const draw = (a: Area, now: number) => {
    const { ctx, canvas } = a;
    const box = canvas.getBoundingClientRect();
    const dpr = Math.min(2, devicePixelRatio || 1);
    const W = Math.round(box.width * dpr);
    const H = Math.round(box.height * dpr);
    if (canvas.width !== W || canvas.height !== H) {
      canvas.width = W;
      canvas.height = H;
    }
    const ox = box.left + scrollX;
    const oy = box.top + scrollY;
    // Draw in page coordinates.
    ctx.setTransform(dpr, 0, 0, dpr, -ox * dpr, -oy * dpr);
    ctx.clearRect(ox, oy, box.width, box.height);

    let busy = false;
    if (a.sweepStart) {
      const p = (now - a.sweepStart) / 1600;
      if (p < 1) {
        busy = true;
        const x = -80 + p * (box.width + 160);
        for (let y = oy - 60; y < oy + box.height + 60; y += 56) warm(a, x, y, 90, 0.55);
      } else a.sweepStart = 0;
    }
    const near = pointer && pointer.y > a.top - RADIUS && pointer.y < a.bottom + RADIUS ? pointer : null;
    if (near) warm(a, near.x, near.y, RADIUS, 1);

    const colour = `rgb(${rgb})`;
    // A soft glow under the pointer, like the light of a sensor.
    if (near) {
      const g = ctx.createRadialGradient(near.x, near.y, 0, near.x, near.y, RADIUS * 1.3);
      g.addColorStop(0, `rgb(${rgb} / ${0.07 * fadeAt(a, near.y)})`);
      g.addColorStop(1, `rgb(${rgb} / 0)`);
      ctx.globalAlpha = 1;
      ctx.fillStyle = g;
      ctx.fillRect(near.x - RADIUS * 1.3, near.y - RADIUS * 1.3, RADIUS * 2.6, RADIUS * 2.6);
    }

    // Only the rows on screen are drawn.
    const v0 = Math.max(0, Math.floor(oy / SPACING) - a.j0 - 1);
    const v1 = Math.min(a.rows - 1, Math.ceil((oy + box.height) / SPACING) - a.j0 + 1);
    const { xs, ys, heat, target, cols } = a;

    // Points at rest: a faint survey grid, shrinking towards dark sections.
    ctx.fillStyle = ink;
    for (let r2 = v0; r2 <= v1; r2++) {
      const f = fadeAt(a, ys[r2 * cols]);
      if (f <= 0.02) continue;
      ctx.globalAlpha = REST_ALPHA * f;
      const s = 0.4 + 1.2 * f;
      for (let i = 0; i < cols; i++) {
        const k = r2 * cols + i;
        if (heat[k] < 0.05) ctx.fillRect(xs[k] - s / 2, ys[k] - s / 2, s, s);
      }
    }

    // Mesh: each cell is split along a diagonal that alternates, as in a terrain model.
    ctx.lineWidth = 1;
    ctx.strokeStyle = colour;
    const link = (p: number, q: number) => {
      const m = Math.min(heat[p], heat[q]);
      if (m < LINK) return;
      const f = Math.min(fadeAt(a, ys[p]), fadeAt(a, ys[q]));
      if (f <= 0.02) return;
      ctx.globalAlpha = (m - LINK) * 0.7 * f;
      ctx.beginPath();
      ctx.moveTo(xs[p], ys[p]);
      ctx.lineTo(xs[q], ys[q]);
      ctx.stroke();
    };
    for (let r2 = v0; r2 <= v1; r2++) {
      for (let i = 0; i < cols; i++) {
        const k = r2 * cols + i;
        if (heat[k] < LINK) continue;
        if (i + 1 < cols) link(k, k + 1);
        if (r2 + 1 < a.rows) {
          link(k, k + cols);
          const parity = (i + a.j0 + r2) % 2;
          if (parity === 0 && i + 1 < cols) link(k, k + cols + 1);
          if (parity !== 0 && i > 0) link(k, k + cols - 1);
        }
      }
    }

    // Lit points, ground control targets, and the fading trail.
    for (let k = 0; k < heat.length; k++) {
      const t = heat[k];
      if (t <= 0) continue;
      const r2 = (k / cols) | 0;
      if (r2 >= v0 && r2 <= v1) {
        const f = fadeAt(a, ys[k]);
        if (f > 0.02) {
          ctx.fillStyle = colour;
          ctx.globalAlpha = (0.1 + t * 0.85) * f;
          ctx.beginPath();
          ctx.arc(xs[k], ys[k], (0.8 + t * 2) * (0.4 + 0.6 * f), 0, Math.PI * 2);
          ctx.fill();
          if (target[k] && t > 0.35 && f > 0.6) {
            // Ground control target: a square with a cross.
            const s = 4 + t * 5;
            ctx.globalAlpha = t * 0.85 * f;
            ctx.strokeStyle = ink;
            ctx.strokeRect(xs[k] - s, ys[k] - s, s * 2, s * 2);
            ctx.beginPath();
            ctx.moveTo(xs[k] - s, ys[k]);
            ctx.lineTo(xs[k] + s, ys[k]);
            ctx.moveTo(xs[k], ys[k] - s);
            ctx.lineTo(xs[k], ys[k] + s);
            ctx.stroke();
            ctx.strokeStyle = colour;
          }
        }
      }
      // Points out of the pointer's reach cool down.
      if (!near || Math.hypot(xs[k] - near.x, ys[k] - near.y) > RADIUS) {
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
    measure();
    let busy = false;
    for (const a of areas) if (a.visible && draw(a, now)) busy = true;
    if (busy) raf = requestAnimationFrame(tick);
  };
  const kick = () => {
    if (!raf) raf = requestAnimationFrame(tick);
  };
  const place = () => {
    pointer = client ? { x: client.x + scrollX, y: client.y + scrollY } : null;
  };

  addEventListener('pointermove', (e) => {
    if (e.pointerType !== 'mouse') return;
    if (!client) rgb = toRgb(opts.colour());
    client = { x: e.clientX, y: e.clientY };
    place();
    if (areas.some((a) => a.visible)) kick();
  });
  document.documentElement.addEventListener('pointerleave', () => {
    client = null;
    place();
    kick();
  });
  // The canvases stick to the screen while the sections scroll: redraw on scroll.
  addEventListener(
    'scroll',
    () => {
      place();
      if (areas.some((a) => a.visible)) kick();
    },
    { passive: true },
  );
  addEventListener('resize', kick);
  // Sections change size or order (the chosen path's catalogue moves first).
  const ro = new ResizeObserver(kick);
  areas.forEach((a) => ro.observe(a.section));
  new MutationObserver(() => {
    rgb = toRgb(opts.colour());
    kick();
  }).observe(document.documentElement, { attributes: true, attributeFilter: ['data-famille'] });

  // A canvas only exists (in memory) while its area is on screen.
  const io = new IntersectionObserver((entries) => {
    for (const e of entries) {
      const a = areas.find((x) => x.section === e.target);
      if (!a) continue;
      a.visible = e.isIntersecting;
      if (!a.visible) {
        a.heat.fill(0);
        a.canvas.width = 0;
        a.canvas.height = 0;
      }
    }
    kick();
  });
  areas.forEach((a) => io.observe(a.section));

  return {
    /** Passes a scan line across an area (index in the list given). */
    sweep: (index: number) => {
      const a = areas[index];
      if (!a) return;
      rgb = toRgb(opts.colour());
      a.sweepStart = performance.now();
      kick();
    },
  };
}
