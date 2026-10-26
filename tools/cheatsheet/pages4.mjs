// Páginas de teoría de bolsillo y trigonometría del sonido.
// Los valores que dicen "del motor" se calculan acá con run()/queryArc, igual que el resto del PDF.
import { page, card, pre, hl, esc } from './h.mjs';
import { run, haps, notesAt, keyboard, circle, spectrum, filterCurve, PAL } from './lib.mjs';

const NAMES = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];
const SOLFEO = { C: 'Do', D: 'Re', E: 'Mi', F: 'Fa', G: 'Sol', A: 'La', B: 'Si' };
const hz = (m) => 440 * 2 ** ((m - 69) / 12);
const fmt = (x, d = 1) => x.toFixed(d).replace('.', ',');

// valor de un patrón continuo en el tiempo t (en ciclos)
const at = (code, t) => Number(Object.values(run(code))[0].queryArc(t, t + 1e-6)[0]?.value);

// Gráfico de funciones. series: [{ f: t => y, color, dash, w }] o { code } para consultar al motor.
function plot(series, o = {}) {
  const { w = 300, h = 80, x0 = 0, x1 = 1, y0 = -1, y1 = 1, N = 300, ticks = [], hlines = [], labels = [] } = o;
  const X = (t) => ((t - x0) / (x1 - x0)) * w;
  const Y = (v) => h - 4 - ((v - y0) / (y1 - y0)) * (h - 8);
  let s = `<svg class="viz" viewBox="0 0 ${w} ${h}" width="100%"><rect width="${w}" height="${h}" rx="4" fill="var(--cell)"/>`;
  if (y0 < 0 && y1 > 0) s += `<line x1="0" x2="${w}" y1="${Y(0)}" y2="${Y(0)}" stroke="var(--muted)" stroke-width=".6"/>`;
  ticks.forEach(([t, txt]) => (s += `<line x1="${X(t)}" x2="${X(t)}" y1="0" y2="${h}" stroke="var(--muted)" stroke-width=".4" stroke-dasharray="2 2"/><text x="${X(t) + 2}" y="${h - 3}" class="vc" style="font-size:5.4px">${txt}</text>`));
  hlines.forEach(([v, txt, c]) => (s += `<line x1="0" x2="${w}" y1="${Y(v)}" y2="${Y(v)}" stroke="${c || 'var(--faint)'}" stroke-width=".7" stroke-dasharray="3 2"/><text x="${w - 3}" y="${Y(v) - 2}" text-anchor="end" class="as" style="fill:${c || 'var(--dim)'}">${txt}</text>`));
  series.forEach(({ f, code, color = PAL[2], dash, sw = 1.6 }) => {
    const pts = [];
    for (let i = 0; i <= N; i++) {
      const t = x0 + ((x1 - x0) * i) / N;
      const v = code ? at(code, t) : f(t);
      if (Number.isFinite(v)) pts.push(`${X(t).toFixed(1)},${Y(v).toFixed(1)}`);
    }
    s += `<polyline fill="none" stroke="${color}" stroke-width="${sw}" ${dash ? `stroke-dasharray="${dash}"` : ''} stroke-linejoin="round" points="${pts.join(' ')}"/>`;
  });
  labels.forEach(([t, v, txt, c]) => (s += `<text x="${X(t)}" y="${Y(v)}" class="as" style="fill:${c || 'var(--dim)'}">${txt}</text>`));
  return s + '</svg>';
}
const leg = (items) => `<div class="row small" style="gap:8px;flex-wrap:wrap">${items.map(([c, t]) => `<span><span style="display:inline-block;width:9px;height:3px;border-radius:2px;background:${c};vertical-align:middle;margin-right:3px"></span>${t}</span>`).join('')}</div>`;

// Teclado grande con nombre, solfeo, MIDI y Hz en cada tecla blanca
function bigKeyboard(from = 48, to = 72, o = {}) {
  const { w = 600, h = 96 } = o;
  const whites = [];
  for (let m = from; m <= to; m++) if (![1, 3, 6, 8, 10].includes(m % 12)) whites.push(m);
  const ww = w / whites.length;
  let s = `<svg class="viz" viewBox="0 0 ${w} ${h}" width="100%">`;
  whites.forEach((m, i) => {
    const n = NAMES[m % 12], oct = Math.floor(m / 12) - 1;
    const isA = n === 'A', isC = n === 'C';
    s += `<rect x="${i * ww + 0.5}" y="0" width="${ww - 1}" height="${h}" rx="2.5" fill="${m === 60 ? '#ffd28a' : m === 69 ? '#9ff5ea' : '#d9dce6'}"/>`;
    const t = (y, txt, st) => `<text x="${i * ww + ww / 2}" y="${y}" text-anchor="middle" style="${st}">${txt}</text>`;
    s += t(h - 30, `${n}${oct}`, "font:700 7.4px 'Space Grotesk';fill:#11131a");
    s += t(h - 22, SOLFEO[n], "font:600 5.6px 'JetBrains Mono';fill:#3a3f52");
    s += t(h - 13, m, `font:600 5.6px 'JetBrains Mono';fill:${isC ? '#c2185b' : '#3a3f52'}`);
    s += t(h - 5, fmt(hz(m), hz(m) < 100 ? 1 : 0), `font:500 5px 'JetBrains Mono';fill:${isA ? '#00796b' : '#5a6075'}`);
  });
  for (let m = from; m <= to; m++) {
    if (![1, 3, 6, 8, 10].includes(m % 12)) continue;
    const i = whites.filter((x) => x < m).length;
    s += `<rect x="${i * ww - ww * 0.32}" y="0" width="${ww * 0.64}" height="${h * 0.5}" rx="2" fill="#1a1d27" stroke="#0b0d12" stroke-width=".6"/>`;
    const n = NAMES[m % 12];
    s += `<text x="${i * ww}" y="${h * 0.5 - 13}" text-anchor="middle" style="font:600 4.6px 'JetBrains Mono';fill:#c9cfdd">${n}</text><text x="${i * ww}" y="${h * 0.5 - 6}" text-anchor="middle" style="font:600 4.6px 'JetBrains Mono';fill:#8b93aa">${NAMES[(m + 1) % 12]}b</text>`;
  }
  return s + '</svg>';
}

// Pentagrama con notas en líneas y espacios (clave de sol o de fa)
function staff(clef, o = {}) {
  const { w = 280, h = 56 } = o;
  // posición 0 = 1ª línea (abajo). Sol: Mi4; Fa: Sol2
  const seq = clef === 'sol' ? ['Mi', 'Fa', 'Sol', 'La', 'Si', 'Do', 'Re', 'Mi', 'Fa'] : ['Sol', 'La', 'Si', 'Do', 'Re', 'Mi', 'Fa', 'Sol', 'La'];
  const let_ = { Do: 'C', Re: 'D', Mi: 'E', Fa: 'F', Sol: 'G', La: 'A', Si: 'B' };
  const gap = 6.4, base = 40;
  let s = `<svg class="viz" viewBox="0 0 ${w} ${h}" width="100%"><rect width="${w}" height="${h}" rx="4" fill="var(--cell)"/>`;
  for (let l = 0; l < 5; l++) s += `<line x1="8" x2="${w - 8}" y1="${base - l * gap}" y2="${base - l * gap}" stroke="var(--dim)" stroke-width=".7"/>`;
  s += `<text x="12" y="${base - 1.2 * gap}" style="font:700 ${clef === 'sol' ? 30 : 22}px serif;fill:var(--text)">${clef === 'sol' ? '𝄞' : '𝄢'}</text>`;
  seq.forEach((n, i) => {
    const x = 44 + i * ((w - 56) / seq.length);
    const y = base - (i * gap) / 2;
    const line = i % 2 === 0;
    s += `<ellipse cx="${x}" cy="${y}" rx="3.6" ry="2.7" fill="${line ? PAL[1] : PAL[2]}" transform="rotate(-18 ${x} ${y})"/>`;
    s += `<text x="${x}" y="${h - 3}" text-anchor="middle" style="font:600 5.2px 'JetBrains Mono';fill:${line ? PAL[1] : PAL[2]}">${n}·${let_[n]}</text>`;
  });
  return s + '</svg>';
}

// ------------------------------------------------------------------ Teoría de bolsillo
export function theory() {
  const ladder = (name, steps, degs, color, scale) => {
    const notes = notesAt(`n("0 1 2 3 4 5 6 7").scale("${scale}")`);
    return `<div class="col" style="gap:2px;background:var(--panel2);border-radius:5px;padding:3px 5px">
      <div class="row" style="justify-content:space-between"><b style="font:700 8pt 'Space Grotesk';color:${color}">${name}</b><code style="background:none;padding:0">"${scale}"</code></div>
      <div style="display:grid;grid-template-columns:repeat(15,1fr);align-items:center;text-align:center;gap:0">${notes.map((n, i) => `<div class="col" style="gap:0"><span style="font:700 7.2pt 'Space Grotesk'">${String(n).replace(/\d/, '')}</span><span class="mono" style="font-size:5.4pt;color:var(--faint)">${degs[i]}</span></div>${i < 7 ? `<span class="mono" style="font:700 7pt 'JetBrains Mono';color:${steps[i] === 'T' ? color : 'var(--warn)'}">${steps[i]}</span>` : ''}`).join('')}</div>
      ${keyboard(notes.slice(0, 7), { from: scale.startsWith('A') ? 57 : 48, to: scale.startsWith('A') ? 69 : 60, w: 220, h: 18, color })}
    </div>`;
  };
  const MAJ = ['1', '2ªM', '3ªM', '4ªJ', '5ªJ', '6ªM', '7ªM', '8ª'];
  const MIN = ['1', '2ªM', '3ªm', '4ªJ', '5ªJ', '6ªm', '7ªm', '8ª'];
  // acordes diatónicos: triadas apiladas en terceras, calculadas por Strudel
  const triad = (sc, d) => notesAt(`n("[${d},${d + 2},${d + 4}]").scale("${sc}")`).map((n) => String(n).replace(/\d/, ''));
  const DIA = [
    ['I', 'C', 'T'], ['ii', 'Dm', 'S'], ['iii', 'Em', 'T'], ['IV', 'F', 'S'], ['V', 'G', 'D'], ['vi', 'Am', 'T'], ['vii°', 'Bo', 'D'],
  ];
  const FUN = { T: ['tónica', 'reposo', 'var(--rit)'], S: ['subdominante', 'se aleja', 'var(--sin)'], D: ['dominante', 'tensión → vuelve a I', 'var(--arm)'] };
  const RAT = [[0, 'unísono', 1, 1], [1, '2ª menor', 16, 15], [2, '2ª mayor', 9, 8], [3, '3ª menor', 6, 5], [4, '3ª mayor', 5, 4], [5, '4ª justa', 4, 3], [6, 'tritono', 45, 32], [7, '5ª justa', 3, 2], [8, '6ª menor', 8, 5], [9, '6ª mayor', 5, 3], [10, '7ª menor', 16, 9], [11, '7ª mayor', 15, 8], [12, 'octava', 2, 1]];
  const ratTable = (rows) => `<table class="tight-t"><tr><th>st</th><th>intervalo</th><th>razón</th><th>justa</th><th>temp.</th><th>dif.</th></tr>${rows.map(([st, n, a, b]) => { const cj = 1200 * Math.log2(a / b); const d = st * 100 - cj; return `<tr><td class="m">${st}</td><td class="small">${n}</td><td class="m" style="color:var(--arm)">${a}:${b}</td><td class="f">${fmt(cj, 0)}</td><td class="f">${st * 100}</td><td class="f" style="color:${Math.abs(d) > 10 ? 'var(--warn)' : 'var(--faint)'}">${d > 0 ? '+' : ''}${fmt(d, 0)}</td></tr>`; }).join('')}</table>`;
  return page('Teoría de bolsillo · teclado, escalas, tonalidad', 'La "alfombra del productor": todo lo que conviene tener a la vista mientras tocás. Escalas y acordes calculados con @strudel/tonal; Hz con afinación A4 = 440.', 'arm', `
  <div class="grid" style="grid-template-columns:1.25fr 1fr 1fr;grid-template-rows:auto auto 1fr;grid-template-areas:'kb kb circ' 'esc dia circ' 'rat rat staff'">
    ${card('Teclado: nombre, solfeo, número MIDI y frecuencia', `${bigKeyboard(48, 72, { w: 600, h: 92 })}
    <div class="row" style="gap:10px;align-items:flex-start;margin-top:2px">
      <p class="small" style="flex:1.2"><b>f = 440 · 2<sup>(m − 69)/12</sup></b>. Cada semitono multiplica la frecuencia por <b>2<sup>1/12</sup> ≈ 1,0595</b> y cada octava la <b>duplica</b>: A2 110 · A3 220 · <b style="color:var(--rit)">A4 440</b> · A5 880 Hz. Es una función exponencial: los semitonos son iguales para el oído, no para los Hz.</p>
      <p class="small" style="flex:1">En Strudel son lo mismo: <code>note("a4")</code> = <code>note(69)</code> = <code>freq(440)</code>. El <b style="color:var(--sin)">Do central</b> es <code>c4</code> = MIDI 60 (amarillo). Teclas negras: <code>"c#4"</code> = <code>"db4"</code>.</p>
    </div>`, { c: 'arm', tag: 'ALTURA', style: 'grid-area:kb' })}
    ${card('Construir escalas: tonos (T) y semitonos (S)', `${ladder('Mayor (jónica)', ['T', 'T', 'S', 'T', 'T', 'T', 'S'], MAJ, PAL[2], 'C:major')}
    ${ladder('Menor natural (eólica)', ['T', 'S', 'T', 'T', 'S', 'T', 'T'], MIN, PAL[5], 'A:minor')}
    <ul class="tight small">
      <li><b>T</b> = tono = 2 semitonos (saltear una tecla) · <b style="color:var(--warn)">S</b> = semitono (la tecla de al lado).</li>
      <li>La fórmula sirve desde cualquier nota: <code>"F#:major"</code>, <code>"Eb:minor"</code>. Strudel la aplica sola.</li>
      <li><b>Relativas:</b> A menor tiene <b>las mismas notas</b> que C mayor: empieza en su 6º grado. Mismo material, otro centro.</li>
    </ul>`, { c: 'arm', tag: 'ESCALAS', style: 'grid-area:esc' })}
    ${card('Acordes de una tonalidad (C mayor)', `<table class="tight-t"><tr><th>grado</th><th>acorde</th><th>notas (Strudel)</th><th>función</th></tr>${DIA.map(([g, c, f], i) => `<tr><td class="m">${g}</td><td class="m" style="color:${FUN[f][2]}">${c}</td><td class="f" style="color:var(--dim)">${triad('C:major', i).join(' ')}</td><td class="small" style="color:${FUN[f][2]}">${FUN[f][0]}</td></tr>`).join('')}</table>
    <p class="small">Triadas apiladas en terceras: <code>n("[0,2,4]").scale("C:major")</code> y subís el grado. Mayúscula = mayor, minúscula = menor, ° = disminuido. <b>T → S → D → T</b> es el viaje básico: <code>chord("&lt;C F G C&gt;")</code>. En A menor los mismos acordes empiezan en <b>Am</b> (vi pasa a ser i).</p>`, { c: 'arm', tag: 'TONALIDAD', style: 'grid-area:dia' })}
    ${card('Círculo de quintas y armaduras', `${circle({ w: 250 })}
    <div class="kv small">
      <code>♯ en orden</code><span>Fa Do Sol Re La Mi Si (F C G D A E B)</span>
      <code>♭ en orden</code><span>Si Mi La Re Sol Do Fa (al revés)</span>
      <code>vecinos</code><span>IV · I · V de la tonalidad (zona marcada). Cada paso horario suma un ♯ y sube una 5ª (+7 st)</span>
      <code>adentro</code><span>relativa menor: mismas notas, 3 st abajo</span>
    </div>
    <p class="small dim">Una 5ª es la razón <b>3:2</b>. Doce quintas casi vuelven a la nota de partida (la "coma pitagórica"): por eso el círculo cierra solo con afinación temperada.</p>`, { c: 'arm', tag: 'QUINTAS', style: 'grid-area:circ' })}
    ${card('Intervalos: semitonos, razones y cents', `<div class="row" style="gap:10px;align-items:flex-start"><div style="flex:1">${ratTable(RAT.slice(0, 7))}</div><div class="col" style="flex:1;gap:2px">${ratTable(RAT.slice(7))}
      <p class="small"><b>Justa</b> = razón simple (notas 04–05). <b>Temperada</b> = 2<sup>st/12</sup> (piano, <code>note()</code>). <b>dif.</b> en cents (rojo &gt; 10). Justo: <code>freq(220 * 5/4)</code>.</p></div></div>`, { c: 'fx', tag: 'RAZONES', style: 'grid-area:rat' })}
    ${card('Pentagrama: líneas y espacios', `<span class="small dim">clave de sol (melodía, mano derecha)</span><div style="width:100%">${staff('sol')}</div>
    <span class="small dim">clave de fa (bajo, mano izquierda)</span><div style="width:100%">${staff('fa')}</div>
    <p class="small"><span style="color:${PAL[1]}">●</span> línea · <span style="color:${PAL[2]}">●</span> espacio. Sol: <b>Mi Sol Si Re Fa</b> / <b>Fa La Do Mi</b>. Fa: <b>Sol Si Re Fa La</b> / <b>La Do Mi Sol</b>.</p>`, { c: 'sin', tag: 'LECTURA', style: 'grid-area:staff' })}
  </div>`);
}

// ------------------------------------------------------------------ Trigonometría I
export function trig1() {
  const R = 'sine.range(200, 1000)';
  const vals = [0, 1 / 8, 1 / 4, 3 / 8, 1 / 2, 5 / 8, 3 / 4, 7 / 8].map((t) => Math.round(at(R, t)));
  const PI = [[0, '0'], [0.25, 'π/2'], [0.5, 'π'], [0.75, '3π/2'], [1, '2π']];
  const TR = [
    ['sen(2x)', '2a', 'π → ½ ciclo', 'sine.fast(2)'],
    ['2·sen(½x) + 1', '2b', '4π → 2 ciclos · imagen [−1; 3]', 'sine.slow(2).range(-1, 3)'],
    ['sen(x + π/6)', '2c', 'fase π/6 → 1/12 de ciclo', 'sine.early(1/12)'],
    ['5·sen(x + π/2)', '2e', '= 5·cos x', 'cosine.range(-5, 5)'],
    ['−2·sen(2x) − 3', '2g', 'A < 0: la onda se invierte', 'sine.fast(2).range(-1, -5)'],
  ];
  TR.forEach((r) => run(r[3])); // verificación: si algo no existe, errors[] lo registra
  return page('Trigonometría I · la sinusoide', 'f(x) = A·sen(Bx + C) + D es, literalmente, cómo se escribe un oscilador o un LFO. En Strudel 1 ciclo = 2π. Curvas consultadas al motor (signal.mjs).', 'sin', `
  <div class="grid" style="grid-template-columns:1.15fr 1fr 1fr;grid-template-rows:auto 1fr;grid-template-areas:'form img rad' 'puls ej rad'">
    ${card('La fórmula de la guía, parámetro por parámetro', `<table class="wrapm"><tr><th>guía</th><th>oscilador (sonido)</th><th>LFO (movimiento)</th><th>Strudel</th></tr>
      <tr><td class="m">|A| amplitud</td><td class="small">volumen</td><td class="small">cuánto se mueve la perilla</td><td class="m">.gain() · ancho de .range()</td></tr>
      <tr><td class="m">B pulsación</td><td class="small">altura: f = B/2π</td><td class="small">velocidad</td><td class="m">note() freq() · .fast() .slow()</td></tr>
      <tr><td class="m">período 2π/|B|</td><td class="small">1/f (A4: 2,27 ms)</td><td class="small">cuántos ciclos dura una vuelta</td><td class="m">.slow(4) = 4 ciclos</td></tr>
      <tr><td class="m">fase −C/B</td><td class="small">sola no se oye; al sumar dos ondas, sí</td><td class="small">dónde arranca</td><td class="m">.early() .late()</td></tr>
      <tr><td class="m">D desplazamiento</td><td class="small">—</td><td class="small">valor central</td><td class="m">centro de .range()</td></tr>
      <tr><td class="m">imagen</td><td class="small">—</td><td class="small">entre qué valores va</td><td class="m">.range(mín, máx)</td></tr></table>
    <p class="small">Un <b>oscilador</b> va a cientos de Hz: se oye como altura. Un <b>LFO</b> es la misma función a menos de ~20 Hz: no se oye, <b>mueve</b> algo (filtro, volumen, paneo).</p>
    <p class="small dim">En un sinte A y D <b>tienen unidades</b> (Hz, semitonos, volumen 0–1).</p>`, { c: 'sin', tag: 'A·SEN(BX+C)+D', style: 'grid-area:form' })}
    ${card('Imagen = <code style="background:none">.range(mín, máx)</code>', `${plot([{ code: R, color: PAL[2], sw: 2 }], { h: 96, y0: 100, y1: 1100, ticks: PI, hlines: [[1000, 'D + |A| = 1000', PAL[1]], [600, 'D = 600', PAL[0]], [200, 'D − |A| = 200', PAL[1]]] })}
    <p class="small"><code>.range(a, b)</code> es <code>pat.mul(b − a).add(a)</code> sobre <code>sine</code> ∈ [0, 1] (<span class="mono">pattern.mjs:1771</span>). Da <b>D = (a + b)/2</b> y <b>|A| = (b − a)/2</b>: <code>sine.range(200, 1000)</code> = 400·sen(2πt) + 600.</p>
    <p class="small">Del motor, cada 1/8 de ciclo: <span class="mono" style="color:var(--sin)">${vals.join(' · ')}</span></p>
    <div class="note" style="--c:var(--sin)"><b>Ecuación trigonométrica con sonido.</b> ¿Cuándo pasa el filtro por 800 Hz? 400·sen(2πt) + 600 = 800 → sen(2πt) = ½ → t = <b>1/12</b> y <b>5/12</b> de ciclo. El motor da ${Math.round(at(R, 1 / 12))} y ${Math.round(at(R, 5 / 12))} Hz en esos instantes.</div>`, { c: 'sin', tag: 'IMAGEN', style: 'grid-area:img' })}
    ${card('Circunferencia, radianes y ciclos', `<div class="row" style="gap:6px;align-items:center"><div style="width:42%">${(() => {
      const W = 120, c = 60, r = 46, a = Math.PI / 6;
      const px = c + r * Math.cos(a), py = c - r * Math.sin(a);
      return `<svg class="viz" viewBox="0 0 ${W} ${W}" width="100%"><rect width="${W}" height="${W}" rx="5" fill="var(--cell)"/><line x1="8" x2="112" y1="${c}" y2="${c}" stroke="var(--muted)" stroke-width=".6"/><line x1="${c}" x2="${c}" y1="8" y2="112" stroke="var(--muted)" stroke-width=".6"/><circle cx="${c}" cy="${c}" r="${r}" fill="none" stroke="var(--dim)" stroke-width="1"/><line x1="${c}" y1="${c}" x2="${px}" y2="${py}" stroke="var(--text)" stroke-width="1.2"/><line x1="${px}" y1="${py}" x2="${px}" y2="${c}" stroke="${PAL[1]}" stroke-width="2"/><line x1="${c}" y1="${c}" x2="${px}" y2="${c}" stroke="${PAL[0]}" stroke-width="2"/><circle cx="${px}" cy="${py}" r="2.6" fill="${PAL[2]}"/><path d="M${c + 12},${c} A12,12 0 0 0 ${c + 12 * Math.cos(a)},${c - 12 * Math.sin(a)}" fill="none" stroke="${PAL[2]}"/><text x="${px + 3}" y="${(py + c) / 2 + 2}" style="font:600 6px 'JetBrains Mono';fill:${PAL[1]}">sen θ</text><text x="${(c + px) / 2 - 8}" y="${c + 8}" style="font:600 6px 'JetBrains Mono';fill:${PAL[0]}">cos θ</text><text x="${c + 15}" y="${c - 3}" style="font:600 5.5px 'JetBrains Mono';fill:${PAL[2]}">θ</text></svg>`;
    })()}</div><p class="small" style="flex:1">Un oscilador es <b>un punto que gira</b> en la circunferencia unitaria: su altura es el seno, su abscisa el coseno. <b>Una vuelta = 2π = 1 período</b>; la frecuencia es cuántas vueltas por segundo.</p></div>
    <table class="tight-t"><tr><th>radianes</th><th>grados</th><th>ciclos</th><th>Strudel</th></tr>
      <tr><td class="m">π/6</td><td class="f">30°</td><td class="m">1/12</td><td class="m">.early(1/12)</td></tr>
      <tr><td class="m">π/2</td><td class="f">90°</td><td class="m">1/4</td><td class="m">cosine = sine.early(1/4)</td></tr>
      <tr><td class="m">π</td><td class="f">180°</td><td class="m">1/2</td><td class="m">.early(1/2) = invertir</td></tr>
      <tr><td class="m">2π</td><td class="f">360°</td><td class="m">1</td><td class="m">una vuelta = 1 ciclo</td></tr></table>
    <p class="small"><b>ciclos = radianes / 2π</b>. En el oscilador de audio, el ciclo es un período de la onda; en un LFO, un ciclo de Strudel (un compás).</p>
    <p class="small" style="margin-top:2px"><b style="color:var(--fx)">Así lo define Strudel</b> (<span class="mono">signal.mjs</span>):</p>
    ${pre(`// :70  sen(2πt), con t en ciclos
const sine2 = signal((t) =>
  Math.sin(Math.PI * 2 * t))
// :80  llevado de [−1, 1] a [0, 1]
const sine = sine2.fromBipolar()
// :91  cos x = sen(x + π/2): ¼ de ciclo antes
const cosine = sine._early(Fraction(1).div(4))`)}
    <p class="small">Ojo: <code>sine</code> va de 0 a 1 (cómodo para perillas); <code>sine2</code> y <code>cosine2</code>, de −1 a 1 como en la guía.</p>
    <div class="note" style="--c:var(--fx)"><b>¿Y la tangente?</b> Período π, pero con asíntotas: valores infinitos, no sirve como oscilador. Para saturar se usan curvas en forma de S, como <b>tanh</b> (otra función).</div>`, { c: 'fx', tag: 'RADIANES', style: 'grid-area:rad' })}
    ${card('Pulsación B y fase C: velocidad y desplazamiento', `${plot([{ code: 'sine2.slow(2)', color: PAL[5] }, { code: 'sine2', color: PAL[2], sw: 2 }, { code: 'sine2.fast(2)', color: PAL[1] }], { x1: 2, h: 72, ticks: [[1, '1 ciclo'], [2, '2']] })}
    ${leg([[PAL[2], 'sine2 (B = 2π)'], [PAL[5], '.slow(2): período 2'], [PAL[1], '.fast(2): período ½']])}
    ${plot([{ code: 'sine2', color: PAL[2], sw: 2 }, { code: 'sine2.early(1/12)', color: PAL[4] }, { code: 'cosine2', color: PAL[0], dash: '3 2' }], { x1: 1, h: 64, ticks: [[1 / 12, '1/12'], [0.25, '¼']] })}
    ${leg([[PAL[2], 'sen(2πt)'], [PAL[4], '.early(1/12) = sen(x + π/6)'], [PAL[0], 'cosine2 = sen(x + π/2)']])}
    <p class="small">Adelantar (<code>early</code>) corre la curva a la <b>izquierda</b>: C &gt; 0. <code>late</code>, a la derecha. Fase π (½ ciclo) invierte: sen x + sen(x + π) = 0, dos ondas así <b>se cancelan</b>.</p>`, { c: 'js', tag: 'B · C', style: 'grid-area:puls' })}
    ${card('Ejercicios de la guía, traducidos', `<table class="tight-t"><tr><th>f(x)</th><th>ej.</th><th>qué cambia</th><th>Strudel (verificado)</th></tr>${TR.map(([f, e, q, c]) => `<tr><td class="m">${esc(f)}</td><td class="f">${e}</td><td class="small">${q}</td><td class="m" style="white-space:normal">${hl(c)}</td></tr>`).join('')}</table>
    ${pre(`// cualquiera de esas, aplicada a un filtro:
$: note("c2*8").s("sawtooth")
     .lpf(sine.slow(2).range(300, 2000)) // 2b en Hz
     ._scope()`)}`, { c: 'sin', tag: 'GUÍA 2', style: 'grid-area:ej' })}
  </div>`);
}

// ------------------------------------------------------------------ Trigonometría II
export function trig2() {
  const saw = (n) => (t) => { let s = 0; for (let k = 1; k <= n; k++) s += Math.sin(2 * Math.PI * k * t) / k; return s * (2 / Math.PI); };
  const SYN = [
    ['Aditiva', 'sumar senos: Σ Aₙ·sen(nωt)', '.s("user").partials([…])', 'órgano Hammond, Kawai K5'],
    ['Sustractiva', 'onda rica − armónicos (filtro)', '.s("sawtooth").lpf(800)', 'Minimoog, Juno, MS-20'],
    ['FM', 'la fase pasa a ser otra senoide', '.fm(4).fmh(1.5)', 'Yamaha DX7'],
    ['AM / trémolo', 'multiplicar por una senoide', '.tremolo(4)', 'trémolo de amplificador'],
    ['Wavetable', 'recorrer una pila de períodos', '.wt(sine.slow(4))', 'PPG, Serum, Vital'],
    ['Samples', 'audio grabado, troceado', 's("breaks165").slice(8, …)', 'MPC, Akai S950'],
  ];
  return page('Trigonometría II · sumar, multiplicar, modular', 'Cada tipo de síntesis es una operación con senos. Las identidades de la guía describen lo que se oye. Fórmulas leídas de superdough 1.3.0 (synth.mjs, helpers.mjs).', 'arm', `
  <div class="grid" style="grid-template-columns:1fr 1fr 1fr;grid-template-rows:auto auto 1fr">
    ${card('Fourier: toda onda es una suma de senos', `${plot([{ f: saw(1), color: PAL[5] }, { f: saw(3), color: PAL[3] }, { f: saw(12), color: PAL[2], sw: 2 }], { x1: 2, h: 78, y0: -1.3, y1: 1.3, N: 500 })}
    ${leg([[PAL[5], '1 término = seno'], [PAL[3], '3 términos'], [PAL[2], '12 términos ≈ sierra']])}
    <p class="small"><b>Σ Aₙ·sen(n·ωt)</b>: superdough arma cada onda con esta serie (<span class="mono">synth.mjs:466-468</span>):</p>
    ${pre(`sawtooth: (n) => [0, -1 / n]
square:   (n) => [0, n % 2 === 0 ? 0 : 1 / n]
triangle: (n) => [n % 2 === 0 ? 0 : 1/(n*n), 0]`)}
    <p class="small dim">sierra: todos los armónicos, 1/n · cuadrada: solo impares, 1/n · triangular: impares, 1/n².</p>
    ${pre(`// n = cuántos términos de la serie (synth.mjs:503)
note("a2").s("sawtooth").n("<1 2 4 8 16>")
// o elegís cada Aₙ a mano
note("a2").s("user").partials([1, 0, .5, 0, .25])`)}`, { c: 'sin', tag: 'ADITIVA', src: 'synth.mjs:457-528' })}
    ${card('Sustractiva: Fourier con un filtro', `<div class="row" style="gap:6px;align-items:center"><div style="flex:1"><span class="small dim">sierra: armónicos 1/n</span>${spectrum('sawtooth', { w: 140, h: 34, color: PAL[2] })}</div><span class="big3 dim">×</span><div style="flex:1"><span class="small dim">.lpf(): ganancia por frecuencia</span>${filterCurve('lpf', { fc: 600, q: 0.4, w: 140, h: 34, color: PAL[5] })}</div></div>
    <p class="small">El filtro <b>multiplica cada Aₙ</b> por su ganancia en la frecuencia n·f. Abrirlo de a poco (un LFO o una rampa en el cutoff) es la <b>subida</b> típica del house y del techno.</p>
    ${pre(`$: note("c2*8").s("sawtooth")
     // el filtro tarda 16 compases en abrirse
     .lpf(saw.range(200, 4000).slow(16))
     .lpq(6)`)}
    <p class="small" style="margin-top:3px"><b style="color:var(--sin)">La cuadrada = signo del seno</b>: +1 en C₊, −1 en C₋. Por eso solo tiene armónicos impares. Las raíces son los <b>cruces por cero</b>: cortar una onda ahí evita el "click".</p>
    ${plot([{ f: (t) => Math.sin(2 * Math.PI * 2 * t), color: PAL[5] }, { f: (t) => Math.sign(Math.sin(2 * Math.PI * 2 * t)) * 0.9, color: PAL[2], sw: 2 }], { x1: 1, h: 50, N: 600 })}`, { c: 'fx', tag: 'SUSTRACTIVA' })}
    ${card('Suma → producto: el batimiento', `${plot([{ f: (t) => Math.sin(2 * Math.PI * 20 * t) + Math.sin(2 * Math.PI * 22 * t), color: PAL[2], sw: 1 }, { f: (t) => 2 * Math.cos(Math.PI * 2 * t), color: PAL[1], dash: '3 2' }, { f: (t) => -2 * Math.cos(Math.PI * 2 * t), color: PAL[1], dash: '3 2' }], { x1: 1, h: 70, y0: -2.2, y1: 2.2, N: 600 })}
    <p class="small"><b>sen α + sen β = 2·cos((α − β)/2)·sen((α + β)/2)</b>. Dos senos casi iguales suenan como uno solo con una envolvente coseno lenta: el volumen <b>late |f₁ − f₂|</b> veces por segundo.</p>
    ${pre(`// late 2 veces por segundo
$: freq("220,222").s("sine")`)}
    <p class="small">Probá <code>"220,221"</code> y <code>"220,224"</code>: 1 y 4 latidos por segundo. Así se afina de oído: cuando el latido desaparece, las dos cuerdas están iguales.</p>`, { c: 'js', tag: 'BATIMIENTO' })}
    ${card('FM: la fase C(t) es otra senoide', `${plot([{ f: (t) => Math.sin(2 * Math.PI * 3 * t), color: PAL[5] }, { f: (t) => Math.sin(2 * Math.PI * 3 * t + 4 * Math.sin(2 * Math.PI * 3 * t)), color: PAL[1], sw: 1.4 }], { x1: 1, h: 64, N: 500 })}
    ${leg([[PAL[5], 'I = 0: seno puro'], [PAL[1], 'I = 4, razón 1']])}
    <p class="small"><b>y = sen(ω<sub>c</sub>t + I·sen(ω<sub>m</sub>t))</b>. Superdough suma al oscilador una senoide de frecuencia <b>f<sub>m</sub> = f<sub>c</sub>·fmh</b> con amplitud <b>fmi·f<sub>m</sub></b> (<span class="mono">helpers.mjs:408-412 · :470-474</span>): eso es exactamente índice I = <code>.fm()</code>, razón = <code>.fmh()</code>. Razón entera → armónico; no entera → campana, metal.</p>`, { c: 'arm', tag: 'FM', src: 'controls.mjs:473-498' })}
    ${card('Producto → suma: AM y trémolo', `${plot([{ f: (t) => Math.sin(2 * Math.PI * 24 * t) * (0.6 + 0.4 * Math.sin(2 * Math.PI * 2 * t)), color: PAL[3], sw: 1 }, { f: (t) => 0.6 + 0.4 * Math.sin(2 * Math.PI * 2 * t), color: PAL[2], dash: '3 2' }], { x1: 1, h: 64, N: 600 })}
    <p class="small"><b>sen a · sen b = ½[cos(a − b) − cos(a + b)]</b>. Multiplicar por una senoide lenta es el <b>trémolo</b> (<code>.tremolo(4)</code>, <span class="mono">controls.mjs:880</span>); si la moduladora es rápida, aparecen dos frecuencias nuevas, a − b y a + b: el sonido metálico del <i>ring mod</i>.</p>
    <p class="small dim">Ojo: <code>.gain(sine)</code> no hace AM de audio: la señal se lee <b>una vez por nota</b>, al empezar el evento.</p>`, { c: 'js', tag: 'AM' })}
    ${card('sen² + cos² = 1: paneo de igual potencia', `${plot([{ f: (t) => Math.cos((t * Math.PI) / 2), color: PAL[0], sw: 2 }, { f: (t) => Math.sin((t * Math.PI) / 2), color: PAL[1], sw: 2 }, { f: () => 1, color: PAL[4], dash: '3 2' }], { x1: 1, h: 64, y0: 0, y1: 1.15, ticks: [[0.5, 'centro']] })}
    ${leg([[PAL[0], 'izq = cos θ'], [PAL[1], 'der = sen θ'], [PAL[4], 'potencia = cos² + sen² = 1']])}
    <p class="small">Para mover un sonido de izquierda a derecha sin que baje en el medio, cada canal usa una de las dos funciones (θ de 0 a π/2): por Pitágoras la potencia total no cambia. Superdough usa el <code>StereoPannerNode</code> de Web Audio, que funciona así (<span class="mono">superdough.mjs:844</span>).</p>`, { c: 'rit', tag: 'PANEO' })}
    ${card('Panorama: tipos de síntesis', `<table class="tight-t"><tr><th>tipo</th><th>operación</th><th>Strudel</th><th>clásicos</th></tr>${SYN.map(([n, op, c, cl]) => `<tr><td><b>${n}</b></td><td class="small">${op}</td><td class="m">${hl(c)}</td><td class="small dim">${cl}</td></tr>`).join('')}</table>
`, { c: 'arm', tag: 'MAPA', style: 'grid-column:span 2' })}
    ${card('Hydra: la misma senoide, en el espacio', `${pre(`// hydra-synth glsl-functions.js:24-27 (osc)
float g = sin((st.x + time*sync) * freq) * 0.5 + 0.5;`)}
    <p class="small"><b>sen(kx + ωt)</b>: una onda viajera. <code>st.x</code> = posición en pantalla, <code>freq</code> = cuántas franjas, <code>sync</code> = velocidad. <code>offset</code> desfasa rojo, verde y azul: de ahí salen los colores. Lo que en audio es tiempo, acá es espacio.</p>
    ${pre(`await initHydra()
osc(10, .1, 1.2).out()   // franjas que viajan`)}`, { c: 'hy', tag: 'HYDRA' })}
  </div>`);
}
