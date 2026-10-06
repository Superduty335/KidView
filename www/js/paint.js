// Drawing surface for coloring pages. Three stacked canvases:
//   paint  – the child's colors on white
//   stroke – the marker stroke in progress (merged into paint on lift)
//   lines  – the coloring page outline, always drawn on top so lines stay crisp
// All canvases use a fixed 1000x1000 internal size and are scaled with CSS.

const W = 1000, H = 1000;

export const TOOLS = {
  finger: { label: 'Finger paint', sizes: [28, 46, 72] },
  brush: { label: 'Brush', sizes: [8, 18, 34] },
  crayon: { label: 'Crayon', sizes: [10, 18, 30] },
  marker: { label: 'Marker', sizes: [10, 20, 36] },
  fill: { label: 'Fill', sizes: [0, 0, 0] },
  eraser: { label: 'Eraser', sizes: [16, 36, 70] },
};

// Tools whose tip is lifted above a finger on touch screens, so the finger
// doesn't hide where the color goes. Finger paint and fill stay under the finger.
const LIFT_TOOLS = new Set(['brush', 'crayon', 'marker', 'eraser']);
const LIFT_PX = 56; // CSS pixels between fingertip and drawing tip

// On-screen utensils. Each is drawn pointing at its tip, which sits at (4, 60)
// in a 64x64 box; the body leans up and to the right.
function utensilSvg(tool, color) {
  const ink = 'stroke="#1b2554" stroke-width="2.4" stroke-linejoin="round"';
  const parts = {
    crayon: `<path d="M0,0 L15,-8 L15,8 Z" fill="${color}" ${ink}/><rect x="15" y="-8" width="56" height="16" rx="2" fill="${color}" ${ink}/><rect x="28" y="-8" width="30" height="16" fill="#fff" opacity=".35"/><path d="M28,-8 V8 M58,-8 V8" ${ink}/>`,
    marker: `<path d="M0,-3 L11,-7 L11,7 L0,3 Z" fill="${color}" ${ink}/><rect x="11" y="-8" width="9" height="16" fill="#3a4470" ${ink}/><rect x="20" y="-10" width="52" height="20" rx="5" fill="#fff" ${ink}/><rect x="50" y="-10" width="10" height="20" fill="${color}" ${ink}/>`,
    brush: `<path d="M0,0 Q6,-8 18,-7 L18,7 Q6,8 0,0 Z" fill="${color}" ${ink}/><rect x="18" y="-6" width="11" height="12" fill="#c9ced9" ${ink}/><path d="M29,-5 L74,-3 Q77,0 74,3 L29,5 Z" fill="#c98a4b" ${ink}/>`,
    eraser: `<rect x="0" y="-11" width="22" height="22" rx="4" fill="#ff9db8" ${ink}/><rect x="22" y="-11" width="24" height="22" rx="2" fill="#7fb8ff" ${ink}/>`,
  };
  if (!parts[tool]) return '';
  return `<svg class="pc-utensil" viewBox="0 0 64 64" aria-hidden="true"><g transform="translate(4 60) rotate(-45)">${parts[tool]}</g></svg>`;
}

function hexToRgb(hex) {
  const n = parseInt(hex.slice(1), 16);
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
}
const rgbStr = ([r, g, b], a = 1) => `rgba(${r | 0},${g | 0},${b | 0},${a})`;
function hslToRgb(h, s, l) {
  const k = (n) => (n + h / 30) % 12;
  const a = s * Math.min(l, 1 - l);
  const f = (n) => l - a * Math.max(-1, Math.min(k(n) - 3, Math.min(9 - k(n), 1)));
  return [f(0) * 255, f(8) * 255, f(4) * 255];
}

// Paper grain shared by every crayon stroke so texture lines up across strokes.
let grain = null;
function getGrain() {
  if (grain) return grain;
  grain = new Float32Array(W * H);
  const coarse = new Float32Array(Math.ceil(W / 4) * Math.ceil(H / 4)).map(() => Math.random());
  const cw = Math.ceil(W / 4);
  for (let y = 0; y < H; y++) for (let x = 0; x < W; x++) {
    grain[y * W + x] = 0.55 * Math.random() + 0.45 * coarse[(y >> 2) * cw + (x >> 2)];
  }
  return grain;
}

export class Painter {
  constructor(host, { onChange } = {}) {
    this.host = host;
    this.onChange = onChange || (() => {});
    host.classList.add('painter');
    host.innerHTML = '';
    const mk = (cls) => {
      const cv = document.createElement('canvas');
      cv.width = W; cv.height = H; cv.className = cls;
      host.appendChild(cv);
      return cv;
    };
    this.paint = mk('pc-paint');
    this.stroke = mk('pc-stroke');
    this.lines = mk('pc-lines');
    this.cursor = document.createElement('div');
    this.cursor.className = 'pc-cursor';
    this.cursor.hidden = true;
    host.appendChild(this.cursor);
    this.lift = true; // raise the tip above a finger on touch screens
    this.ctx = this.paint.getContext('2d', { willReadFrequently: true });
    this.sctx = this.stroke.getContext('2d');
    this.lctx = this.lines.getContext('2d');
    this.mask = null; // Uint8Array, 1 where a page line blocks the fill tool
    this.tool = 'finger';
    this.color = '#ff4d4d';
    this.sizeIdx = 1;
    this.undoStack = [];
    this.pointers = new Map();
    this.hue = 0;
    this.ctx.fillStyle = '#fff';
    this.ctx.fillRect(0, 0, W, H);
    this._bind();
  }

  async load(svg, paintBlob) {
    this.ctx.fillStyle = '#fff';
    this.ctx.fillRect(0, 0, W, H);
    this.lctx.clearRect(0, 0, W, H);
    this.mask = null;
    if (svg) {
      const img = await loadImage('data:image/svg+xml;charset=utf-8,' + encodeURIComponent(svg));
      const tmp = document.createElement('canvas');
      tmp.width = W; tmp.height = H;
      const t = tmp.getContext('2d', { willReadFrequently: true });
      t.fillStyle = '#fff'; t.fillRect(0, 0, W, H);
      t.drawImage(img, 0, 0, W, H);
      const src = t.getImageData(0, 0, W, H);
      const out = this.lctx.createImageData(W, H);
      this.mask = new Uint8Array(W * H);
      for (let i = 0, j = 0; i < src.data.length; i += 4, j++) {
        const lum = (src.data[i] + src.data[i + 1] + src.data[i + 2]) / 3;
        const a = 255 - lum;
        out.data[i] = out.data[i + 1] = out.data[i + 2] = 20;
        out.data[i + 3] = a;
        if (a > 110) this.mask[j] = 1;
      }
      this.lctx.putImageData(out, 0, 0);
    }
    if (paintBlob) {
      const url = URL.createObjectURL(paintBlob);
      try { this.ctx.drawImage(await loadImage(url), 0, 0, W, H); } finally { URL.revokeObjectURL(url); }
    }
    this.undoStack = [];
  }

  setTool(t) { this.tool = t; this._cursorArt(); }
  setColor(c) { this.color = c; this._cursorArt(); }
  setSize(i) { this.sizeIdx = i; this._cursorArt(); }
  setLift(on) { this.lift = on; }

  _cursorArt() {
    const col = this.color === 'rainbow' ? '#e63946' : this.color;
    const ring = this.tool === 'fill' ? '<span class="pc-cross"></span>' : '<span class="pc-ring"></span>';
    this.cursor.innerHTML = ring + utensilSvg(this.tool, col);
    this._cursorKey = this.tool;
  }
  _showCursor(ev) {
    if (!this._cursorKey) this._cursorArt();
    const r = this.lines.getBoundingClientRect();
    const scale = r.width / W;
    const pt = this._pos(ev);
    const d = Math.max(10, this.size * scale);
    const c = this.cursor;
    c.style.transform = `translate(${(pt.x * scale).toFixed(1)}px, ${(pt.y * scale).toFixed(1)}px)`;
    c.style.setProperty('--d', d.toFixed(1) + 'px');
    c.classList.toggle('touching', ev.pointerType === 'touch');
    c.hidden = false;
    clearTimeout(this._hideT);
  }
  _hideCursor(delay = 0) {
    clearTimeout(this._hideT);
    this._hideT = setTimeout(() => { this.cursor.hidden = true; }, delay);
  }
  get size() { return TOOLS[this.tool].sizes[this.sizeIdx]; }

  pushUndo() {
    this.undoStack.push(this.ctx.getImageData(0, 0, W, H));
    if (this.undoStack.length > 12) this.undoStack.shift();
  }
  undo() {
    const s = this.undoStack.pop();
    if (s) { this.ctx.putImageData(s, 0, 0); this.onChange(); }
    return !!s;
  }
  clear() {
    this.pushUndo();
    this.ctx.fillStyle = '#fff';
    this.ctx.fillRect(0, 0, W, H);
    this.onChange();
  }

  exportPaint() { return toBlob(this.paint); }
  exportImage(maxSize = W) {
    const c = document.createElement('canvas');
    c.width = c.height = maxSize;
    const x = c.getContext('2d');
    x.drawImage(this.paint, 0, 0, maxSize, maxSize);
    x.drawImage(this.lines, 0, 0, maxSize, maxSize);
    return toBlob(c, 'image/jpeg', 0.85);
  }

  _pos(ev) {
    const r = this.lines.getBoundingClientRect();
    const lifted = this.lift && ev.pointerType === 'touch' && LIFT_TOOLS.has(this.tool) ? LIFT_PX : 0;
    return { x: ((ev.clientX - r.left) * W) / r.width, y: ((ev.clientY - lifted - r.top) * H) / r.height, p: ev.pressure || 0.5, t: ev.timeStamp };
  }

  _strokeColor(st) {
    if (this.color === 'rainbow') {
      st.hue = (st.hue + 1.2) % 360;
      return hslToRgb(st.hue, 0.9, 0.55);
    }
    return hexToRgb(this.color);
  }

  _bind() {
    const el = this.host;
    el.addEventListener('pointerdown', (ev) => {
      ev.preventDefault();
      this._showCursor(ev);
      const pt = this._pos(ev);
      if (this.tool === 'fill') {
        this.pushUndo();
        this._fill(pt.x | 0, pt.y | 0);
        this.onChange();
        return;
      }
      el.setPointerCapture?.(ev.pointerId);
      if (this.pointers.size === 0) this.pushUndo();
      const st = { ...pt, hue: (this.hue += 47), w: this.size, load: null, n: 0 };
      this.pointers.set(ev.pointerId, st);
      this._segment(st, pt, true);
    });
    const move = (ev) => {
      const st = this.pointers.get(ev.pointerId);
      if (st || ev.pointerType !== 'touch') this._showCursor(ev);
      if (!st) return;
      const evs = ev.getCoalescedEvents ? ev.getCoalescedEvents() : [ev];
      for (const e of (evs.length ? evs : [ev])) {
        const pt = this._pos(e);
        this._segment(st, pt, false);
        Object.assign(st, { x: pt.x, y: pt.y, t: pt.t, p: pt.p });
      }
    };
    el.addEventListener('pointermove', move);
    el.addEventListener('pointerleave', (ev) => { if (ev.pointerType !== 'touch' && !this.pointers.size) this._hideCursor(); });
    const end = (ev) => {
      if (ev.pointerType === 'touch' && this.pointers.size <= 1) this._hideCursor(500);
      if (!this.pointers.has(ev.pointerId)) return;
      this.pointers.delete(ev.pointerId);
      if (this.tool === 'marker' && ![...this.pointers.values()].length) this._commitMarker();
      this.onChange();
    };
    el.addEventListener('pointerup', end);
    el.addEventListener('pointercancel', end);
    el.addEventListener('lostpointercapture', end);
  }

  _segment(st, pt, first) {
    const { ctx } = this;
    const x0 = first ? pt.x - 0.01 : st.x, y0 = first ? pt.y : st.y;
    const dist = Math.hypot(pt.x - x0, pt.y - y0);
    const size = this.size;
    switch (this.tool) {
      case 'brush': {
        const dt = Math.max(1, pt.t - st.t);
        const speed = first ? 0 : dist / dt;
        const target = size * (1.2 - Math.min(speed, 2.4) / 4);
        st.w = st.w * 0.7 + target * 0.3;
        ctx.lineCap = 'round'; ctx.lineJoin = 'round';
        ctx.strokeStyle = rgbStr(this._strokeColor(st), 0.95);
        ctx.lineWidth = st.w;
        ctx.beginPath(); ctx.moveTo(x0, y0); ctx.lineTo(pt.x, pt.y); ctx.stroke();
        break;
      }
      case 'marker': {
        const s = this.sctx;
        s.lineCap = 'round'; s.lineJoin = 'round';
        s.strokeStyle = rgbStr(this._strokeColor(st));
        s.lineWidth = size;
        s.beginPath(); s.moveTo(x0, y0); s.lineTo(pt.x, pt.y); s.stroke();
        break;
      }
      case 'eraser': {
        ctx.lineCap = 'round'; ctx.strokeStyle = '#fff'; ctx.lineWidth = size;
        ctx.beginPath(); ctx.moveTo(x0, y0); ctx.lineTo(pt.x, pt.y); ctx.stroke();
        break;
      }
      case 'crayon': {
        const g = getGrain();
        const col = this._strokeColor(st);
        ctx.fillStyle = rgbStr(col, 0.6);
        const steps = Math.max(1, Math.ceil(dist / 1.5));
        const dots = Math.ceil(size * 0.7);
        const rad = size / 2;
        for (let i = 0; i <= steps; i++) {
          const cx = x0 + ((pt.x - x0) * i) / steps, cy = y0 + ((pt.y - y0) * i) / steps;
          for (let k = 0; k < dots; k++) {
            const a = Math.random() * Math.PI * 2, rr = Math.sqrt(Math.random()) * rad;
            const x = cx + Math.cos(a) * rr, y = cy + Math.sin(a) * rr;
            if (x < 0 || y < 0 || x >= W || y >= H) continue;
            if (g[(y | 0) * W + (x | 0)] > 0.32 + Math.random() * 0.18) ctx.fillRect(x, y, 1.8, 1.8);
          }
        }
        break;
      }
      case 'finger': {
        // Soft, wet stamps. The paint picks up a little of the color underneath,
        // so dragging through wet colors smears them together.
        const dt = Math.max(1, pt.t - st.t);
        const speed = first ? 0 : dist / dt;
        const r = (size / 2) * (1.1 - Math.min(speed, 3) / 8);
        const gap = Math.max(2, r * 0.18);
        const steps = Math.max(1, Math.ceil(dist / gap));
        const base = this._strokeColor(st);
        if (!st.load) st.load = base.slice();
        for (let i = 1; i <= steps; i++) {
          const cx = x0 + ((pt.x - x0) * i) / steps, cy = y0 + ((pt.y - y0) * i) / steps;
          if (++st.n % 6 === 0 && cx >= 0 && cy >= 0 && cx < W && cy < H) {
            const d = ctx.getImageData(cx | 0, cy | 0, 1, 1).data;
            const white = d[0] > 240 && d[1] > 240 && d[2] > 240;
            for (let j = 0; j < 3; j++) st.load[j] = white ? st.load[j] * 0.9 + base[j] * 0.1 : st.load[j] * 0.8 + d[j] * 0.1 + base[j] * 0.1;
          }
          const gr = ctx.createRadialGradient(cx, cy, 0, cx, cy, r);
          gr.addColorStop(0, rgbStr(st.load, 0.45));
          gr.addColorStop(0.65, rgbStr(st.load, 0.3));
          gr.addColorStop(1, rgbStr(st.load, 0));
          ctx.fillStyle = gr;
          ctx.beginPath(); ctx.arc(cx, cy, r, 0, Math.PI * 2); ctx.fill();
        }
        break;
      }
    }
  }

  _commitMarker() {
    const { ctx } = this;
    ctx.save();
    ctx.globalAlpha = 0.62;
    ctx.globalCompositeOperation = 'multiply';
    ctx.drawImage(this.stroke, 0, 0);
    ctx.restore();
    this.sctx.clearRect(0, 0, W, H);
  }

  // Fill the shape under the tap. With a coloring page, page lines are the
  // walls (so it fills even over earlier paint); on a blank page it fills
  // the area of matching color.
  _fill(x, y) {
    if (x < 0 || y < 0 || x >= W || y >= H) return;
    const img = this.ctx.getImageData(0, 0, W, H);
    const d = img.data;
    const mask = this.mask;
    const start = (y * W + x);
    if (mask && mask[start]) return;
    const sr = d[start * 4], sg = d[start * 4 + 1], sb = d[start * 4 + 2];
    const open = mask
      ? (i) => !mask[i]
      : (i) => Math.abs(d[i * 4] - sr) + Math.abs(d[i * 4 + 1] - sg) + Math.abs(d[i * 4 + 2] - sb) < 60;
    const region = new Uint8Array(W * H);
    const stack = [start];
    region[start] = 1;
    while (stack.length) {
      const i = stack.pop();
      const px = i % W;
      if (px > 0 && !region[i - 1] && open(i - 1)) { region[i - 1] = 1; stack.push(i - 1); }
      if (px < W - 1 && !region[i + 1] && open(i + 1)) { region[i + 1] = 1; stack.push(i + 1); }
      if (i >= W && !region[i - W] && open(i - W)) { region[i - W] = 1; stack.push(i - W); }
      if (i < W * (H - 1) && !region[i + W] && open(i + W)) { region[i + W] = 1; stack.push(i + W); }
    }
    // Grow the region a few pixels under the lines so no white halo remains.
    if (mask) for (let pass = 0; pass < 3; pass++) {
      const add = [];
      for (let i = 0; i < region.length; i++) {
        if (region[i] || !mask[i]) continue;
        const px = i % W;
        if ((px > 0 && region[i - 1] === 1) || (px < W - 1 && region[i + 1] === 1) || region[i - W] === 1 || region[i + W] === 1) add.push(i);
      }
      for (const i of add) region[i] = 1;
    }
    const col = this.color === 'rainbow' ? hslToRgb((this.hue += 47) % 360, 0.9, 0.55) : hexToRgb(this.color);
    for (let i = 0; i < region.length; i++) {
      if (!region[i]) continue;
      d[i * 4] = col[0]; d[i * 4 + 1] = col[1]; d[i * 4 + 2] = col[2]; d[i * 4 + 3] = 255;
    }
    this.ctx.putImageData(img, 0, 0);
  }
}

function loadImage(src) {
  return new Promise((res, rej) => {
    const img = new Image();
    img.onload = () => res(img);
    img.onerror = rej;
    img.src = src;
  });
}
function toBlob(canvas, type = 'image/png', q) {
  return new Promise((res) => canvas.toBlob(res, type, q));
}
