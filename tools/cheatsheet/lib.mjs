// Evaluates real Strudel code (same transpiler + core as strudel.cc) and renders SVG visualizations.
import * as core from '@strudel/core';
import * as mini from '@strudel/mini';
import * as tonal from '@strudel/tonal';
import { transpiler } from '@strudel/transpiler';

await core.evalScope(core, mini, tonal);
const { Pattern, silence, noteToMidi } = core;

// ---- REPL stubs (things that only make sense in the browser) ----
let registry = {};
let anon = 0;
Pattern.prototype.p = function (id) {
  if (typeof id === 'string' && (id.startsWith('_') || id.endsWith('_'))) return silence;
  if (id.includes('$')) id = `$${anon++}`;
  registry[id] = this;
  return this;
};
for (const m of ['pianoroll', 'punchcard', 'scope', 'tscope', 'fscope', 'spectrum', 'spiral', 'pitchwheel', 'wordfall', '_pianoroll', '_punchcard', '_scope', '_spiral', 'color']) {
  Pattern.prototype[m] = function () { return this; };
}
export const meta = { cps: 0.5 };
Object.assign(globalThis, {
  samples: () => {},
  setcpm: (c) => (meta.cps = c / 60),
  setcps: (c) => (meta.cps = c),
  initHydra: async () => {},
  H: () => () => 0,
  hush: () => {},
  osc: () => new Proxy({}, { get: (t, k) => () => t }),
});

export const errors = [];
export function run(code) {
  registry = {};
  anon = 0;
  let result;
  try {
    const { output } = transpiler(code, { wrapAsync: false, addReturn: false, emitMiniLocations: false, emitWidgets: false });
    result = (0, eval)(output);
  } catch (e) {
    errors.push(`${code}\n  -> ${e.message}`);
    return {};
  }
  if (Object.keys(registry).length) return { ...registry };
  if (result instanceof Pattern) return { main: result };
  errors.push(`${code}\n  -> no pattern returned`);
  return {};
}
export function transpile(code) {
  return transpiler(code, { wrapAsync: false, addReturn: false, emitMiniLocations: false, emitWidgets: false }).output;
}

export function haps(pat, from = 0, to = 1) {
  return pat
    .queryArc(from, to)
    .filter((h) => h.hasOnset())
    .map((h) => ({ b: h.whole.begin.valueOf(), e: h.whole.end.valueOf(), v: h.value }))
    .sort((a, b) => a.b - b.b);
}

const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
export const PAL = ['#3ee6d1', '#ff4fa3', '#ffb547', '#9b7bff', '#b6f24a', '#5ab0ff', '#ff7a59', '#f2e94e'];

function valLabel(v) {
  if (v == null) return '';
  if (typeof v !== 'object') return String(v);
  if (v.s !== undefined) return v.n !== undefined ? `${v.s}:${v.n}` : v.s;
  if (v.note !== undefined) return v.note;
  if (v.n !== undefined) return v.n;
  const k = Object.keys(v)[0];
  return `${k}:${typeof v[k] === 'number' ? +v[k].toFixed(2) : v[k]}`;
}
function rowKey(v) {
  if (v == null) return '';
  if (typeof v !== 'object') return String(v);
  if (v.s !== undefined) return v.s;
  return valLabel(v);
}

// Step-sequencer style grid. rows: 'auto' (by sound), or 'single'. Accepts code string or {label: pattern}.
export function grid(src, o = {}) {
  const { cycles = 1, steps = 8, w = 300, rowH = 16, labelW = 34, rows = 'auto', showText = true, colorBy = 'row', title } = o;
  const pats = typeof src === 'string' ? run(src) : src;
  let lanes = [];
  const layerNames = Object.keys(pats);
  layerNames.forEach((name, li) => {
    const hs = haps(pats[name], 0, cycles);
    if (rows === 'single' || (rows === 'layer')) {
      lanes.push({ name: rows === 'layer' ? name : '', hs, ci: li });
    } else {
      const keys = [...new Set(hs.map((h) => rowKey(h.v)))];
      keys.forEach((k) => lanes.push({ name: k, hs: hs.filter((h) => rowKey(h.v) === k), ci: lanes.length }));
      if (!keys.length) lanes.push({ name: '—', hs: [], ci: li });
    }
  });
  if (o.order) lanes.sort((a, b) => o.order.indexOf(a.name) - o.order.indexOf(b.name));
  const lw = lanes.some((l) => l.name) ? labelW : 0;
  const gw = w - lw;
  const H = lanes.length * rowH + 12;
  let s = `<svg class="viz" viewBox="0 0 ${w} ${H}" width="100%" xmlns="http://www.w3.org/2000/svg">`;
  const total = steps * cycles;
  for (let i = 0; i < total; i++) {
    const x = lw + (i / total) * gw;
    const beat = i % (steps / (steps % 4 === 0 ? 4 : steps)) === 0;
    s += `<rect x="${x + 0.5}" y="0" width="${gw / total - 1}" height="${lanes.length * rowH}" rx="2" fill="${beat ? 'var(--cell2)' : 'var(--cell)'}"/>`;
  }
  for (let c = 0; c <= cycles; c++) {
    const x = lw + (c / cycles) * gw;
    s += `<line x1="${x}" x2="${x}" y1="-2" y2="${lanes.length * rowH + 2}" stroke="var(--muted)" stroke-width="${c % cycles === 0 ? 0 : 1}" stroke-dasharray="2 2"/>`;
  }
  lanes.forEach((l, r) => {
    const y = r * rowH;
    if (l.name) s += `<text x="${lw - 4}" y="${y + rowH * 0.68}" text-anchor="end" class="vl">${esc(l.name)}</text>`;
    l.hs.forEach((h) => {
      const x = lw + (h.b / cycles) * gw;
      const ww = o.hit ? Math.max(2, gw / total - 1.5) : Math.max(2, ((h.e - h.b) / cycles) * gw - 1.5);
      const col = o.colorMap?.[l.name] || PAL[(colorBy === 'row' ? l.ci : 0) % PAL.length];
      const vel = typeof h.v === 'object' && (h.v.velocity ?? h.v.gain);
      const op = vel != null ? 0.35 + 0.65 * Math.min(1, vel) : 1;
      s += `<rect x="${x + 0.75}" y="${y + 2}" width="${ww}" height="${rowH - 4}" rx="3" fill="${col}" opacity="${op}"/>`;
      if (showText && rows !== 'auto') {
        const t = String(valLabel(h.v));
        if (t && ww > t.length * 4.2) s += `<text x="${x + 3}" y="${y + rowH * 0.68}" class="vt">${esc(t)}</text>`;
      }
    });
  });
  // cycle numbers
  for (let c = 0; c < cycles; c++) s += `<text x="${lw + ((c + 0.5) / cycles) * gw}" y="${H - 1}" text-anchor="middle" class="vc">ciclo ${c}</text>`;
  if (cycles === 1) s = s.replace(/<text[^>]*class="vc">ciclo 0<\/text>/, '');
  return s + '</svg>';
}

function pitchOf(v) {
  if (typeof v !== 'object') return typeof v === 'number' ? v : noteToMidi(String(v));
  if (v.note !== undefined) return typeof v.note === 'number' ? v.note : noteToMidi(v.note);
  if (v.n !== undefined) return 48 + Number(v.n);
  if (v.freq !== undefined) return 69 + 12 * Math.log2(v.freq / 440);
  return null;
}
const NAMES = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];
export const midiName = (m) => NAMES[((Math.round(m) % 12) + 12) % 12] + (Math.floor(Math.round(m) / 12) - 1);

// Piano roll (pitch vs time), layered.
export function roll(src, o = {}) {
  const { cycles = 2, w = 300, h = 120, labelW = 30, names = true } = o;
  const pats = typeof src === 'string' ? run(src) : src;
  const layers = Object.entries(pats).map(([k, p], i) => ({ k, hs: haps(p, 0, cycles).map((x) => ({ ...x, m: pitchOf(x.v) })).filter((x) => x.m != null && !isNaN(x.m)), ci: i }));
  const all = layers.flatMap((l) => l.hs.map((x) => x.m));
  if (!all.length) return '<svg/>';
  let lo = Math.floor(Math.min(...all)) - 1, hi = Math.ceil(Math.max(...all)) + 1;
  if (hi - lo < 12) { const mid = (hi + lo) / 2; lo = Math.floor(mid - 6); hi = Math.ceil(mid + 6); }
  const rows = hi - lo + 1;
  const rh = h / rows;
  const gw = w - labelW;
  let s = `<svg class="viz" viewBox="0 0 ${w} ${h + 4}" width="100%" xmlns="http://www.w3.org/2000/svg">`;
  for (let m = lo; m <= hi; m++) {
    const y = (hi - m) * rh;
    const black = [1, 3, 6, 8, 10].includes(((m % 12) + 12) % 12);
    s += `<rect x="${labelW}" y="${y}" width="${gw}" height="${rh}" fill="${black ? 'var(--cell)' : 'var(--cell2)'}"/>`;
    if (m % 12 === 0 || rows <= 16 || (rows <= 26 && !black)) s += `<text x="${labelW - 3}" y="${y + rh * 0.8}" text-anchor="end" class="vl" style="font-size:${Math.min(7, rh * 1.1)}px">${midiName(m)}</text>`;
  }
  for (let c = 0; c <= cycles * 4; c++) {
    const x = labelW + (c / (cycles * 4)) * gw;
    s += `<line x1="${x}" x2="${x}" y1="0" y2="${h}" stroke="var(--bg)" stroke-width="${c % 4 === 0 ? 1.6 : 0.6}"/>`;
  }
  layers.forEach((l) => l.hs.forEach((x) => {
    const X = labelW + (x.b / cycles) * gw, W = Math.max(2, ((x.e - x.b) / cycles) * gw - 1);
    const y = (hi - x.m) * rh;
    s += `<rect x="${X + 0.5}" y="${y + 0.5}" width="${W}" height="${Math.max(2, rh - 1)}" rx="1.5" fill="${PAL[(o.colors?.[l.ci] ?? l.ci) % PAL.length]}"/>`;
    if (names && W > 14 && rh > 5) s += `<text x="${X + 2}" y="${y + rh * 0.78}" class="vn" style="font-size:${Math.min(6.5, rh * 0.85)}px">${esc(midiName(x.m))}</text>`;
  }));
  return s + '</svg>';
}

// Continuous signal plot (queried at many points)
export function sig(code, o = {}) {
  const { cycles = 2, w = 140, h = 46, color = PAL[0], N = 200, lo = 0, hi = 1, dots = false } = o;
  const pat = Object.values(typeof code === 'string' ? run(code) : code)[0];
  const pts = [];
  if (dots) {
    haps(pat, 0, cycles).forEach((x) => pts.push([x.b, Number(typeof x.v === 'object' ? (x.v.n ?? x.v.note ?? Object.values(x.v)[0]) : x.v), x.e]));
  } else {
    for (let i = 0; i < N; i++) {
      const t = (i / N) * cycles;
      const hp = pat.queryArc(t, t + 1e-6)[0];
      if (hp) pts.push([t, Number(hp.value)]);
    }
  }
  const X = (t) => (t / cycles) * w, Y = (v) => h - 3 - ((v - lo) / (hi - lo)) * (h - 6);
  let s = `<svg class="viz" viewBox="0 0 ${w} ${h}" width="100%" xmlns="http://www.w3.org/2000/svg"><rect width="${w}" height="${h}" rx="4" fill="var(--cell)"/>`;
  for (let c = 1; c < cycles; c++) s += `<line x1="${X(c)}" x2="${X(c)}" y1="0" y2="${h}" stroke="var(--muted)" stroke-dasharray="2 2" stroke-width=".6"/>`;
  if (dots) pts.forEach(([t, v, e]) => (s += `<line x1="${X(t)}" x2="${X(e) - 1}" y1="${Y(v)}" y2="${Y(v)}" stroke="${color}" stroke-width="2.4" stroke-linecap="round"/>`));
  else s += `<polyline fill="none" stroke="${color}" stroke-width="1.6" stroke-linejoin="round" points="${pts.map(([t, v]) => `${X(t).toFixed(1)},${Y(v).toFixed(1)}`).join(' ')}"/>`;
  return s + '</svg>';
}

// Notes of a chord pattern at cycle c (for chord tables)
export function notesAt(code, c = 0) {
  const pat = Object.values(run(code))[0];
  if (!pat) return [];
  return haps(pat, c, c + 1).filter((x) => x.b === c || x.b < c + 1).map((x) => (typeof x.v === 'object' ? x.v.note : x.v));
}

// Keyboard with highlighted pitch classes / midi notes
export function keyboard(notes = [], o = {}) {
  const { from = 48, to = 72, w = 260, h = 46, color = PAL[1], root } = o;
  const midis = notes.map((n) => (typeof n === 'number' ? n : noteToMidi(n)));
  const pcs = o.pc ? midis.map((m) => ((m % 12) + 12) % 12) : null;
  const on = (m) => (pcs ? pcs.includes(((m % 12) + 12) % 12) : midis.includes(m));
  const whites = [];
  for (let m = from; m <= to; m++) if (![1, 3, 6, 8, 10].includes(m % 12)) whites.push(m);
  const ww = w / whites.length;
  let s = `<svg class="viz" viewBox="0 0 ${w} ${h}" width="100%" xmlns="http://www.w3.org/2000/svg">`;
  whites.forEach((m, i) => {
    const isRoot = root != null && m % 12 === root % 12 && on(m);
    s += `<rect x="${i * ww + 0.5}" y="0" width="${ww - 1}" height="${h}" rx="2" fill="${on(m) ? color : '#d9dce6'}"/>`;
    if (isRoot) s += `<circle cx="${i * ww + ww / 2}" cy="${h * 0.78}" r="${Math.min(ww * 0.22, 3)}" fill="#0b0d12"/>`;
    if (m % 12 === 0 && !(root != null && on(m))) s += `<text x="${i * ww + ww / 2}" y="${h - 3}" text-anchor="middle" style="font:600 5.5px 'JetBrains Mono';fill:#11131a">C${m / 12 - 1}</text>`;
  });
  for (let m = from; m <= to; m++) {
    if (![1, 3, 6, 8, 10].includes(m % 12)) continue;
    const i = whites.filter((x) => x < m).length;
    const isRoot = root != null && m % 12 === root % 12 && on(m);
    s += `<rect x="${i * ww - ww * 0.32}" y="0" width="${ww * 0.64}" height="${h * 0.6}" rx="1.5" fill="${on(m) ? color : '#1a1d27'}" stroke="#0b0d12" stroke-width=".6"/>`;
    if (isRoot) s += `<circle cx="${i * ww}" cy="${h * 0.45}" r="${Math.min(ww * 0.18, 2.4)}" fill="#0b0d12"/>`;
  }
  return s + '</svg>';
}

// Oscillator waveform + harmonic spectrum
export function wave(type, o = {}) {
  const { w = 120, h = 40, color = PAL[2] } = o;
  const f = {
    sine: (t) => Math.sin(2 * Math.PI * t),
    triangle: (t) => 1 - 4 * Math.abs(((t + 0.25) % 1) - 0.5),
    square: (t) => (t % 1 < 0.5 ? 1 : -1),
    sawtooth: (t) => 2 * (t % 1) - 1,
    supersaw: (t) => [0, 0.011, -0.013, 0.021, -0.019].reduce((a, d, i) => a + (2 * ((t * (1 + d) + i * 0.17) % 1) - 1), 0) / 3.2,
    noise: () => Math.random() * 2 - 1,
  }[type];
  let pts = [];
  const N = type === 'noise' ? 160 : 240;
  for (let i = 0; i <= N; i++) {
    const t = (i / N) * 2;
    pts.push(`${((i / N) * w).toFixed(1)},${(h / 2 - f(t) * (h / 2 - 4)).toFixed(1)}`);
  }
  return `<svg class="viz" viewBox="0 0 ${w} ${h}" width="100%"><rect width="${w}" height="${h}" rx="4" fill="var(--cell)"/><line x1="0" x2="${w}" y1="${h / 2}" y2="${h / 2}" stroke="var(--muted)" stroke-width=".5"/><polyline fill="none" stroke="${color}" stroke-width="1.6" stroke-linejoin="round" points="${pts.join(' ')}"/></svg>`;
}
export function spectrum(type, o = {}) {
  const { w = 120, h = 30, color = PAL[2] } = o;
  const amp = (k) => ({ sine: k === 1 ? 1 : 0, triangle: k % 2 ? 1 / (k * k) : 0, square: k % 2 ? 1 / k : 0, sawtooth: 1 / k, supersaw: 1 / k, noise: 0.55 + 0.25 * Math.sin(k * 7.3) }[type]);
  let s = `<svg class="viz" viewBox="0 0 ${w} ${h}" width="100%">`;
  const K = 16, bw = w / K;
  for (let k = 1; k <= K; k++) {
    const a = amp(k);
    const bh = Math.max(0, a) * (h - 4);
    s += `<rect x="${(k - 1) * bw + 1}" y="${h - bh}" width="${bw - 2}" height="${bh}" rx="1" fill="${color}" opacity="${0.35 + 0.65 * a}"/>`;
    if (type === 'supersaw') s += `<rect x="${(k - 1) * bw + 1 + bw * 0.55}" y="${h - bh * 0.8}" width="${bw * 0.3}" height="${bh * 0.8}" fill="${color}" opacity=".35"/>`;
  }
  return s + '</svg>';
}

// ADSR envelope diagram
export function adsr(o = {}) {
  const { a = 0.15, d = 0.2, s = 0.6, r = 0.35, hold = 0.35, w = 300, h = 110, color = PAL[2], labels = true } = o;
  const T = a + d + hold + r;
  const X = labels ? (t) => 16 + (t / T) * (w - 26) : (t) => 3 + (t / T) * (w - 6);
  const Y = labels ? (v) => h - 18 - v * (h - 34) : (v) => h - 3 - v * (h - 7);
  const p = [[0, 0], [a, 1], [a + d, s], [a + d + hold, s], [T, 0]];
  let g = `<svg class="viz" viewBox="0 0 ${w} ${h}" width="100%"><rect width="${w}" height="${h}" rx="6" fill="var(--cell)"/>`;
  g += `<path d="M${p.map(([t, v]) => `${X(t)},${Y(v)}`).join(' L')} L${X(T)},${Y(0)} Z" fill="${color}" opacity=".14"/>`;
  g += `<polyline fill="none" stroke="${color}" stroke-width="2.4" stroke-linejoin="round" points="${p.map(([t, v]) => `${X(t)},${Y(v)}`).join(' ')}"/>`;
  [a, a + d, a + d + hold].forEach((t) => (g += `<line x1="${X(t)}" x2="${X(t)}" y1="${Y(0)}" y2="${Y(1) - 4}" stroke="var(--muted)" stroke-dasharray="2 3" stroke-width=".7"/>`));
  g += `<line x1="${X(0)}" x2="${X(T)}" y1="${Y(0)}" y2="${Y(0)}" stroke="var(--muted)" stroke-width=".8"/>`;
  if (labels) {
    const L = (t, txt, sub, y = h - 5) => `<text x="${X(t)}" y="${y}" text-anchor="middle" class="al">${txt}<tspan class="as"> ${sub}</tspan></text>`;
    g += L(a / 2, 'A', '.attack') + L(a + d / 2, 'D', '.decay') + L(a + d + hold / 2, 'S', '.sustain (nivel)') + L(a + d + hold + r / 2, 'R', '.release');
    g += `<text x="${X(a + d + hold / 2)}" y="${Y(s) - 5}" text-anchor="middle" class="as">nota sostenida</text>`;
    g += `<text x="${X(a + d + hold)}" y="${Y(1) - 6}" text-anchor="middle" class="as">note off ↓</text>`;
  }
  return g + '</svg>';
}

// Filter magnitude response (approx. 12/24 dB slope + resonance bump), log freq axis
export function filterCurve(type = 'lpf', o = {}) {
  const { fc = 1000, q = 1, w = 140, h = 52, color = PAL[2], slope = 12, fc2 } = o;
  const fx = (x) => 20 * Math.pow(1000, x); // 20 Hz .. 20 kHz
  const mag = (f, c) => {
    const r = f / c;
    const reso = q * Math.exp(-Math.pow(Math.log2(r) * 2.2, 2)) * 0.5;
    let m;
    if (type === 'lpf') m = 1 / Math.sqrt(1 + Math.pow(r, (slope / 6) * 2));
    else if (type === 'hpf') m = 1 / Math.sqrt(1 + Math.pow(1 / r, (slope / 6) * 2));
    else m = Math.exp(-Math.pow(Math.log2(r) * (0.6 + q * 0.3), 2));
    return Math.min(1.6, m + (type === 'bpf' ? 0 : reso));
  };
  let pts = [];
  for (let i = 0; i <= 140; i++) {
    const x = i / 140;
    pts.push(`${(x * w).toFixed(1)},${(h - 4 - (mag(fx(x), fc) / 1.6) * (h - 8)).toFixed(1)}`);
  }
  let s = `<svg class="viz" viewBox="0 0 ${w} ${h}" width="100%"><rect width="${w}" height="${h}" rx="4" fill="var(--cell)"/>`;
  [100, 1000, 10000].forEach((f) => { const x = (Math.log10(f / 20) / 3) * w; s += `<line x1="${x}" x2="${x}" y1="0" y2="${h}" stroke="var(--muted)" stroke-width=".4"/><text x="${x + 2}" y="${h - 3}" class="vc" style="font-size:5px">${f >= 1000 ? f / 1000 + 'k' : f}</text>`; });
  if (fc2) { const pts2 = []; for (let i = 0; i <= 140; i++) { const x = i / 140; pts2.push(`${(x * w).toFixed(1)},${(h - 4 - (mag(fx(x), fc2) / 1.6) * (h - 8)).toFixed(1)}`); } s += `<polyline fill="none" stroke="${color}" stroke-width="1.2" stroke-dasharray="2 2" opacity=".6" points="${pts2.join(' ')}"/>`; }
  s += `<polyline fill="none" stroke="${color}" stroke-width="1.8" points="${pts.join(' ')}"/>`;
  return s + '</svg>';
}

// Filter envelope over time: cutoff moves from lpf up lpenv octaves and back
export function filterEnv(o = {}) {
  const { w = 300, h = 90, color = PAL[1] } = o;
  const base = 300, env = 4, a = 0.05, d = 0.25, s = 0, r = 0.1, hold = 0.3;
  const T = a + d + hold + r + 0.1;
  const X = (t) => 26 + (t / T) * (w - 34);
  const Y = (oct) => h - 14 - (oct / (env + 0.4)) * (h - 26);
  const seg = [[0, 0], [a, env], [a + d, s * env], [a + d + hold, s * env], [a + d + hold + r, 0], [T, 0]];
  let g = `<svg class="viz" viewBox="0 0 ${w} ${h}" width="100%"><rect width="${w}" height="${h}" rx="6" fill="var(--cell)"/>`;
  for (let oc = 0; oc <= env; oc++) g += `<line x1="26" x2="${w - 6}" y1="${Y(oc)}" y2="${Y(oc)}" stroke="var(--muted)" stroke-width=".35"/><text x="23" y="${Y(oc) + 2}" text-anchor="end" class="vc" style="font-size:5.5px">${base * 2 ** oc}</text>`;
  g += `<polyline fill="none" stroke="${color}" stroke-width="2.2" points="${seg.map(([t, v]) => `${X(t)},${Y(v)}`).join(' ')}"/>`;
  g += `<text x="${X(a) + 8}" y="${Y(env) + 12}" class="as">pico = lpf × 2^lpenv = ${base}×2⁴ = ${base * 16} Hz</text>`;
  g += `<text x="${X(a + d + hold / 2)}" y="${Y(0) - 4}" text-anchor="middle" class="as">vuelve a .lpf(${base})</text>`;
  g += `<text x="${X(a / 2)}" y="${h - 3}" text-anchor="middle" class="al">lpa</text><text x="${X(a + d / 2)}" y="${h - 3}" text-anchor="middle" class="al">lpd</text><text x="${X(a + d + hold / 2)}" y="${h - 3}" text-anchor="middle" class="al">lps</text><text x="${X(a + d + hold + r / 2)}" y="${h - 3}" text-anchor="middle" class="al">lpr</text>`;
  g += `<text x="6" y="10" class="vc" style="font-size:5.5px">Hz</text>`;
  return g + '</svg>';
}

export function probBar(items, o = {}) {
  const { w = 300, h = 16 } = o;
  let s = `<svg class="viz" viewBox="0 0 ${w} ${items.length * (h + 3)}" width="100%">`;
  items.forEach(([name, p], i) => {
    const y = i * (h + 3);
    s += `<rect x="78" y="${y}" width="${w - 110}" height="${h}" rx="3" fill="var(--cell)"/><rect x="78" y="${y}" width="${Math.max(1, (w - 110) * p)}" height="${h}" rx="3" fill="${PAL[(i + 3) % PAL.length]}"/>`;
    s += `<text x="74" y="${y + h * 0.7}" text-anchor="end" class="vl" style="font-size:7px">.${name}()</text><text x="${w - 28}" y="${y + h * 0.7}" class="vl" style="font-size:7px;text-anchor:start">${Math.round(p * 100)}%</text>`;
  });
  return s + '</svg>';
}

// Circle of fifths
export function circle(o = {}) {
  const { w = 220, color = PAL[1] } = o;
  const maj = ['C', 'G', 'D', 'A', 'E', 'B', 'F#', 'Db', 'Ab', 'Eb', 'Bb', 'F'];
  const min = ['Am', 'Em', 'Bm', 'F#m', 'C#m', 'G#m', 'Ebm', 'Bbm', 'Fm', 'Cm', 'Gm', 'Dm'];
  const acc = ['', '1♯', '2♯', '3♯', '4♯', '5♯', '6♯/6♭', '5♭', '4♭', '3♭', '2♭', '1♭'];
  const c = w / 2, R1 = w * 0.46, R2 = w * 0.33, R3 = w * 0.2;
  let s = `<svg class="viz" viewBox="0 0 ${w} ${w}" width="100%">`;
  const arc = (r0, r1, i, fill, op) => {
    const a0 = ((i - 0.5) / 12) * 2 * Math.PI - Math.PI / 2, a1 = ((i + 0.5) / 12) * 2 * Math.PI - Math.PI / 2;
    const p = (r, a) => `${(c + r * Math.cos(a)).toFixed(1)},${(c + r * Math.sin(a)).toFixed(1)}`;
    return `<path d="M${p(r1, a0)} A${r1},${r1} 0 0 1 ${p(r1, a1)} L${p(r0, a1)} A${r0},${r0} 0 0 0 ${p(r0, a0)} Z" fill="${fill}" opacity="${op}" stroke="var(--bg)" stroke-width="1.2"/>`;
  };
  const hi = o.highlight ?? [11, 0, 1]; // F C G neighborhood
  for (let i = 0; i < 12; i++) {
    const on = hi.includes(i);
    s += arc(R2, R1, i, on ? color : 'var(--cell2)', on ? 0.9 : 1) + arc(R3, R2, i, on ? color : 'var(--cell)', on ? 0.55 : 1);
    const a = (i / 12) * 2 * Math.PI - Math.PI / 2;
    const t = (r, txt, cls, st = '') => `<text x="${(c + r * Math.cos(a)).toFixed(1)}" y="${(c + r * Math.sin(a) + 3).toFixed(1)}" text-anchor="middle" style="font:${cls};${st}">${txt}</text>`;
    s += t((R1 + R2) / 2, maj[i], `700 ${w * 0.05}px 'Space Grotesk'`, `fill:${on ? '#0b0d12' : 'var(--text)'}`);
    s += t((R2 + R3) / 2, min[i], `700 ${w * 0.04}px 'JetBrains Mono'`, `fill:${on ? '#0b0d12' : 'var(--dim)'}`);
    s += t(R1 + w * 0.035, acc[i], `500 ${w * 0.026}px 'JetBrains Mono'`, 'fill:var(--faint)');
  }
  s += `<text x="${c}" y="${c - 2}" text-anchor="middle" style="font:700 ${w * 0.045}px 'Space Grotesk';fill:var(--text)">quintas</text><text x="${c}" y="${c + w * 0.05}" text-anchor="middle" style="font:500 ${w * 0.03}px 'JetBrains Mono';fill:var(--dim)">→ horario +7 st</text>`;
  return s + '</svg>';
}
