import { page, card, pre, ex, hl, esc } from './h.mjs';
import { grid, roll, run, haps, sig, notesAt, keyboard, circle, wave, spectrum, adsr, filterCurve, filterEnv, probBar, PAL, midiName } from './lib.mjs';

const kb = (notes, o = {}) => keyboard(notes, { from: 48, to: 72, w: 230, h: 30, ...o });

export function harmony1() {
  const SC = [
    ['major', 'mayor / jónico', 'luminoso, pop, house "feliz"'],
    ['minor', 'menor natural / eólico', 'oscuro, techno, trance, DnB'],
    ['dorian', 'dórico', 'menor con 6ª mayor: funk, deep house, jazz'],
    ['phrygian', 'frigio', '2ª menor: tenso, flamenco, dark techno'],
    ['lydian', 'lidio', '4ª aumentada: flotante, ambient, cine'],
    ['mixolydian', 'mixolidio', 'mayor con 7ª menor: rock, blues, disco'],
    ['minor:pentatonic', 'pentatónica menor', '5 notas: no hay notas "malas"'],
    ['harmonic:minor', 'menor armónica', '7ª mayor: dramática, oriental'],
  ];
  const scaleCard = ([sc, name, mood], i) => {
    const notes = notesAt(`n("0 1 2 3 4 5 6 7").scale("C:${sc}")`);
    return `<div style="background:var(--panel2);border-radius:5px;padding:3px 5px" class="col"><div class="row" style="justify-content:space-between"><code style="background:none;padding:0;font-weight:600">"C:${sc}"</code><span class="small" style="color:var(--arm)">${name}</span></div>${keyboard(notes.slice(0, sc.includes('penta') ? 5 : 7), { from: 48, to: 60, w: 200, h: 34, color: PAL[i % PAL.length], root: 48 })}<span class="small dim" style="line-height:1.2">${mood}</span></div>`;
  };
  const intervals = [
    [0, 'unísono', 'P1', 'misma nota'], [1, '2ª menor', 'm2', 'tensión, terror'], [2, '2ª mayor', 'M2', 'paso, suspenso'], [3, '3ª menor', 'm3', 'triste → acorde menor'], [4, '3ª mayor', 'M3', 'alegre → acorde mayor'], [5, '4ª justa', 'P4', 'abierta, "himno"'], [6, 'tritono', 'TT', 'inestable, disonante'], [7, '5ª justa', 'P5', 'poder, "power chord"'], [8, '6ª menor', 'm6', 'melancólica'], [9, '6ª mayor', 'M6', 'dulce'], [10, '7ª menor', 'm7', 'blues, funk, groove'], [11, '7ª mayor', 'M7', 'soñadora, jazz/lo-fi'], [12, 'octava', 'P8', 'la misma nota, más aguda'],
  ];
  return page('Armonía I · notas, intervalos, escalas', 'De la teoría al código: note() da alturas absolutas; n() + .scale() da GRADOS dentro de una escala, y así nunca desafinás.', 'arm', `
  <div class="grid" style="grid-template-columns:1fr 1fr 1.15fr;grid-template-rows:auto 1fr">
    ${card('note() vs n() vs freq()', `<div class="kv">
      <code>note("c3 eb3 g3")</code><span>nombre + octava. <code>#</code> y <code>b</code> para alteraciones: <code>"f#3"</code> = <code>"gb3"</code>.</span>
      <code>note("48 51 55")</code><span>lo mismo en números MIDI. C4 = 60; cada número es un semitono.</span>
      <code>n("0 2 4")</code><span><b>índice</b>: con <code>.scale()</code> es un grado de la escala; con samples elige el número de sample (<code>s("bd").n(3)</code>).</span>
      <code>freq("220 330")</code><span>frecuencia en Hz, para microtonalidad.</span>
    </div>
    ${kb(['C4', 'E4', 'G4'], { root: 60, from: 48, to: 72 })}
    <p class="small dim">Arriba: <code>note("c4 e4 g4")</code> = MIDI 60, 64, 67. El punto marca la tónica. <span class="mono">controls.mjs:366 (n) · :388 (note)</span></p>`, { c: 'arm', tag: 'ALTURA' })}
    ${card('Intervalos: la distancia lo es todo', `<table><tr><th>st</th><th>nombre</th><th></th><th>carácter</th></tr>${intervals.map(([s, n, a, d]) => `<tr><td class="m">${s}</td><td>${n}</td><td class="f">${a}</td><td class="small">${d}</td></tr>`).join('')}</table>
    <p class="small">Sumás semitonos con <code>.transpose(7)</code> o <code>.add(note(7))</code>. Una 3ª menor es <code>note("c3 eb3")</code>.</p>
    <div class="row" style="gap:8px;align-items:center;margin-top:auto"><div style="width:52%">${circle({ w: 220 })}</div><div class="col small" style="flex:1"><b style="color:var(--arm)">Círculo de quintas</b><span>Afuera las tonalidades mayores y adentro sus <b>relativas menores</b> (mismas notas). Los vecinos comparten 6 de 7 notas, así que <b>suenan bien juntos</b>: en C, los acordes de F, C y G (y Dm, Am, Em) son la "familia". Para modular suave, movete un paso; para un cambio dramático, cruzá el círculo.</span><span class="dim">Ej.: <code>chord("&lt;C G Am F&gt;")</code> usa solo la zona marcada.</span></div></div>`, { c: 'arm', tag: 'SEMITONOS', style: 'grid-row:span 2' })}
    ${card('Escalas y modos: <code style="background:none">n("0 .. 7").scale("C:…")</code>', `<div style="display:grid;grid-template-columns:1fr 1fr;gap:4px">${SC.map(scaleCard).join('')}</div>
    <p class="small dim" style="margin-top:2px">Notas reales que devuelve Strudel para los grados 0–6. Más escalas: <code>blues</code>, <code>major:pentatonic</code>, <code>melodic:minor</code>, <code>whole:tone</code>, <code>locrian</code>, <code>chromatic</code>… (son los nombres de tonal.js) · <span class="mono">tonal.mjs:268</span></p>
    <table style="margin-top:3px"><tr><th>Estilo</th><th>Escalas típicas</th><th>Por qué</th></tr>
      <tr><td>Techno / Acid</td><td class="m">minor · phrygian</td><td class="small">oscuro; la 2ª menor del frigio da tensión</td></tr>
      <tr><td>Deep house</td><td class="m">dorian · minor</td><td class="small">menor pero cálido (6ª mayor)</td></tr>
      <tr><td>Trance / EDM</td><td class="m">minor · harmonic:minor</td><td class="small">épico; la 7ª mayor empuja a resolver</td></tr>
      <tr><td>Ambient</td><td class="m">lydian · major:pentatonic</td><td class="small">sin tensiones fuertes, flota</td></tr>
      <tr><td>Hip-hop / Lo-fi</td><td class="m">minor:pentatonic · dorian</td><td class="small">melodías que nunca chocan</td></tr>
      <tr><td>Reggaetón</td><td class="m">minor · harmonic:minor</td><td class="small">progresión andaluza (pág. 8)</td></tr>
    </table>`, { c: 'arm', tag: 'MODOS', style: 'grid-row:span 2' })}
    ${card('Grados: cómo piensa n().scale()', `${pre(`n("0 2 4 <6 7> 9 7 4 -1")
  .scale("<C:minor F:dorian>")
  .s("triangle")`)}
    ${roll('n("0 2 4 <6 7> 9 7 4 -1").scale("<C:minor F:dorian>")', { cycles: 2, w: 260, h: 150 })}
    <ul class="tight small">
      <li>El grado <b>0</b> es la tónica (en octava 3). <b>7</b> es la tónica una octava arriba y los <b>negativos</b> bajan.</li>
      <li>La escala también es un patrón: cambiala por ciclo y la melodía "se adapta" sola.</li>
      <li><code>.scaleTranspose(1)</code> sube un <i>grado</i> · <code>.transpose(1)</code> sube un <i>semitono</i> (<span class="mono">tonal.mjs:167 · :114</span>).</li>
    </ul>`, { c: 'arm', tag: 'GRADOS' })}
  </div>`);
}

export function harmony2() {
  const CH = [
    ['C', 'mayor', '1-3-5', 'estable, pop'], ['Cm', 'menor', '1-♭3-5', 'oscuro'], ['C7', 'dominante', '+♭7', 'tensión → resuelve'], ['C^7', 'maj7', '+7', 'soñador, lo-fi'],
    ['Cm7', 'm7', '+♭7', 'deep house'], ['Cm9', 'm9', '+♭7+9', 'house, garage'], ['Csus', 'sus4', '1-4-5', 'abierto, trance'], ['Co', 'disminuido', '1-♭3-♭5', 'inquietante'],
    ['Ch7', 'semidism. ø', '1-♭3-♭5-♭7', 'jazz, cine'], ['C6', 'sexta', '+6', 'retro, bossa'], ['Cadd9', 'add9', '+9', 'brillante, indie'], ['C7b9', '7♭9', 'dom. alterado', 'tensión máxima'],
  ];
  const chordCell = ([sym, name, form, mood], i) => {
    const notes = notesAt(`chord("${sym}").voicing()`);
    return `<div style="background:var(--panel2);border-radius:5px;padding:3px 5px" class="col"><div class="row" style="justify-content:space-between"><code style="background:none;padding:0;font-weight:700;color:var(--arm);font-size:8pt">${sym}</code><span class="small dim">${name} · ${form}</span></div>${keyboard(notes, { from: 48, to: 76, w: 230, h: 36, color: PAL[i % PAL.length] })}<span class="small" style="line-height:1.15"><span class="mono" style="font-size:6pt;color:var(--faint)">${notes.join(' ')}</span> · ${mood}</span></div>`;
  };
  const PROG = [
    ['i – VI – III – VII', '<Am F C G>', 'EDM, trance, pop: la más usada'],
    ['ii – V – I', '<Dm7 G7 C^7 C^7>', 'jazz, lo-fi, neo-soul'],
    ['i – ♭VII – ♭VI – V', '<Am G F E>', 'andaluza: reggaetón, flamenco'],
    ['i9 – ♭VII9', '<Fm9 Ebm9>', 'deep house, garage (2 acordes)'],
  ];
  return page('Armonía II · acordes, voicings, progresiones', 'chord("…").voicing() convierte un símbolo de cifrado en notas bien distribuidas. Notas y piano rolls calculados con @strudel/tonal.', 'arm', `
  <div class="grid" style="grid-template-columns:1.25fr 1fr;grid-template-rows:auto 1fr">
    ${card('Diccionario de acordes (cifrado americano, raíz C)', `<div style="display:grid;grid-template-columns:repeat(4,1fr);gap:4px">${CH.map(chordCell).join('')}</div>
    <p class="small dim" style="margin-top:2px">Notas reales que devuelve <code>chord("X").voicing()</code> (diccionario <code>ireal</code> por defecto; anclado debajo de C5). Alias aceptados: <code>m</code> = <code>-</code>, <code>^7</code> = maj7, <code>h7</code> = ø, <code>o</code> = dim. <span class="mono">voicings.mjs:196 · ireal.mjs</span></p>`, { c: 'arm', tag: 'ACORDES' })}
    ${card('Controlar el voicing', `${pre(`chord("<C Am F G>")
  .anchor("c5")   // nota tope de referencia
  .mode("below")  // below · above · duck · root
  .dict("ireal")  // diccionario: ireal · lefthand
  .voicing()`)}
    <div class="row" style="gap:6px;align-items:flex-start"><div style="flex:1"><span class="small dim">anchor c5 (default)</span>${roll('chord("<C Am F G>").voicing()', { cycles: 4, w: 160, h: 70, names: false })}</div><div style="flex:1"><span class="small dim">anchor("g4")</span>${roll('chord("<C Am F G>").anchor("g4").voicing()', { cycles: 4, w: 160, h: 70, names: false, colors: [1] })}</div></div>
    <p class="small">El voicing busca <b>la inversión más cercana</b> al ancla, así los acordes se mueven poco (<i>voice leading</i>). Con <code>n("0 1 2 3").chord(…).voicing()</code> recorrés las notas del acorde como una escala: es un arpegiador.</p>`, { c: 'arm', tag: 'VOICING' })}
    ${card('Progresiones clásicas · acordes + bajo (rootNotes)', `<div style="display:grid;grid-template-columns:1fr 1fr;gap:5px">${PROG.map(([rom, p, d], i) => `<div class="col" style="gap:1px"><div class="row" style="justify-content:space-between"><b style="font:700 8pt 'Space Grotesk';color:var(--arm)">${rom}</b><code style="background:none;padding:0">${hl('"' + p + '"')}</code></div>${roll({ chords: Object.values(run(`chord("${p}").voicing()`))[0], bass: Object.values(run(`chord("${p}").rootNotes(2)`))[0] }, { cycles: 4, w: 260, h: 118, names: false, colors: [3, 0] })}<span class="small dim">${d}</span></div>`).join('')}</div>
    ${pre(`$: chord("<Am F C G>").voicing().s("sawtooth").lpf(1500)
$: chord("<Am F C G>").rootNotes(2).s("square").lpf(400)  // bajo = raíz en octava 2`)}`, { c: 'arm', tag: 'PROGRESIONES' })}
    ${card('Arpegios y melodías sobre acordes', `${pre(`chord("<Cm7 Fm7>").voicing()
  .arp("0 [1 2] 3 2")    // índices de nota del acorde`)}
    ${roll('chord("<Cm7 Fm7>").voicing().arp("0 [1 2] 3 2")', { cycles: 2, w: 260, h: 80 })}
    ${pre(`n("0 2 4 7 4 2").chord("<Cm7 Fm7>").voicing()  // voicing como escala`)}
    ${roll('n("0 2 4 7 4 2").chord("<Cm7 Fm7>").voicing()', { cycles: 2, w: 260, h: 80, colors: [2] })}
    <ul class="tight small"><li><b>Números romanos:</b> I = acorde sobre el grado 1. Mayúscula = mayor, minúscula = menor.</li><li><b>Tensión → reposo:</b> V7 → I. En menor, usá E7 (no Em) para volver a Am con fuerza.</li><li><b>Truco house:</b> un solo acorde m9 con <code>.struct("~ x ~ ~")</code> y filtro que se abre = 8 compases resueltos.</li></ul>`, { c: 'arm', tag: 'ARP', src: 'pattern.mjs:966' })}
  </div>`);
}

export function synth1() {
  const W = ['sine', 'triangle', 'square', 'sawtooth', 'supersaw', 'noise'];
  const WD = { sine: ['seno', 'solo la fundamental: subgraves, 808, pads puros'], triangle: ['triangular', 'armónicos impares débiles: suave, flauta'], square: ['cuadrada', 'impares fuertes: hueco, chiptune, bajos 8-bit. Con .pw() es pulse'], sawtooth: ['diente de sierra', 'todos los armónicos: brillante. La favorita para filtrar'], supersaw: ['supersaw', 'varios saws desafinados (.unison .detune .spread): trance, EDM'], noise: ['ruido', 'white · pink · brown · crackle: hats, risers, viento'] };
  return page('Síntesis I · fuente, envolventes, filtro', 'Así se ve tu sintetizador por dentro. Lo que en hardware son perillas, acá son métodos, y cada uno acepta patrones y señales.', 'sin', `
  <div class="grid" style="grid-template-columns:1.1fr 1fr 1fr;grid-template-rows:auto 1fr;grid-template-areas:'vco adsr adsr' 'fm vcf fenv'">
    ${card('Osciladores: <code style="background:none">.s("…")</code>', `<div style="display:grid;grid-template-columns:1fr 1fr;gap:4px 8px">${W.map((w, i) => `<div class="col" style="gap:1px"><div class="row" style="justify-content:space-between"><code style="background:none;padding:0;font-weight:700">"${w === 'noise' ? 'white' : w}"</code><span class="small" style="color:var(--sin)">${WD[w][0]}</span></div>${wave(w, { w: 130, h: 30, color: PAL[(i + 2) % PAL.length] })}${spectrum(w, { w: 130, h: 16, color: PAL[(i + 2) % PAL.length] })}<span class="small dim" style="line-height:1.15">${WD[w][1]}</span></div>`).join('')}</div>
    <p class="small dim" style="margin-top:3px">Forma de onda (arriba) y armónicos 1–16 (abajo). Alias: <code>saw</code>, <code>tri</code>, <code>sqr</code> (<span class="mono">synth.mjs:23-27</span>). Un timbre brillante tiene muchos armónicos, y el filtro está para sacárselos.</p>`, { c: 'sin', tag: 'VCO', style: 'grid-area:vco' })}
    ${card('ADSR: la envolvente de volumen (VCA)', `<div class="row" style="gap:8px;align-items:flex-start"><div style="flex:1" class="col">${adsr({ w: 300, h: 120 })}
      <div style="display:grid;grid-template-columns:repeat(4,1fr);gap:4px">${[['pluck', { a: 0.01, d: 0.25, s: 0, r: 0.05, hold: 0.3 }], ['pad', { a: 0.5, d: 0.2, s: 0.8, r: 0.6, hold: 0.4 }], ['órgano', { a: 0.01, d: 0.01, s: 1, r: 0.02, hold: 0.8 }], ['bajo', { a: 0.01, d: 0.3, s: 0.4, r: 0.1, hold: 0.4 }]].map(([n, e], i) => `<div><span class="small" style="color:var(--sin)">${n}</span>${adsr({ ...e, w: 90, h: 34, labels: false, color: PAL[(i + 2) % PAL.length] })}</div>`).join('')}</div>
      ${pre(`note("c3 eb3 g3 bb3").s("sawtooth")
  .attack(0).decay(.15).sustain(0) // pluck
  .release("<.1 1>")              // por ciclo`)}</div><div style="flex:1.15"><table><tr><th>Parámetro</th><th>Unidad</th><th>Default synth</th><th>Usos</th></tr>
      <tr><td class="m">.attack(a) .att</td><td>segundos</td><td class="m">0.001</td><td class="small">0 = golpe · 1+ = pad que entra lento</td></tr>
      <tr><td class="m">.decay(d) .dec</td><td>segundos</td><td class="m">0.05</td><td class="small">cuánto tarda en caer al sustain</td></tr>
      <tr><td class="m">.sustain(s) .sus</td><td><b>nivel 0–1</b></td><td class="m">0.6</td><td class="small">0 = percusivo (pluck)</td></tr>
      <tr><td class="m">.release(r) .rel</td><td>segundos</td><td class="m">0.01</td><td class="small">cola después del note-off</td></tr>
    </table>
    <p class="small" style="margin-top:3px">Atajo: <code>.adsr(".01:.2:.5:.3")</code> (<span class="mono">controls.mjs:2572</span>). Defaults reales: <span class="mono">synth.mjs:50</span>. La duración de la nota (cuándo llega el note-off) la manejan <code>.clip()</code>/<code>.legato()</code>.</p>
    <div class="note" style="--c:var(--sin);margin-top:4px"><b>Diferencia con tu sinte de hardware:</b> en Strudel <b>cada nota</b> crea su propia voz, con oscilador, filtro y envolventes propios. La polifonía es prácticamente ilimitada (hasta 128 voces por defecto, <span class="mono">superdough.mjs:33</span>), y cada nota puede tener <i>otros</i> valores: <code>.attack("0 .5")</code> alterna golpe y fade entre notas.</div>
</div></div>`, { c: 'sin', tag: 'VCA', style: 'grid-area:adsr' })}
    ${card('Filtros: esculpir armónicos (VCF)', `<div style="display:grid;grid-template-columns:repeat(3,1fr);gap:4px">
      <div><code class="small" style="background:none;padding:0;font-weight:700">.lpf(1000)</code>${filterCurve('lpf', { fc: 1000, q: 0.2, w: 110, h: 54, fc2: 300 })}<span class="small dim">pasa-bajos: oscurece (punteado: 300 Hz)</span></div>
      <div><code class="small" style="background:none;padding:0;font-weight:700">.hpf(1000)</code>${filterCurve('hpf', { fc: 1000, q: 0.2, w: 110, h: 54, color: PAL[5] })}<span class="small dim">pasa-altos: adelgaza</span></div>
      <div><code class="small" style="background:none;padding:0;font-weight:700">.bpf(1000)</code>${filterCurve('bpf', { fc: 1000, q: 1, w: 110, h: 54, color: PAL[1] })}<span class="small dim">pasa-banda: "teléfono"</span></div>
    </div>
    <div class="row" style="gap:6px;margin-top:3px"><div style="flex:1"><code class="small" style="background:none;padding:0;font-weight:700">.lpf(1000).lpq(10)</code>${filterCurve('lpf', { fc: 1000, q: 1.6, w: 170, h: 50, color: PAL[3] })}</div><div style="flex:1"><code class="small" style="background:none;padding:0;font-weight:700">.lpf(sine.range(300,3000).slow(4))</code>${sig('sine.range(300,3000).slow(4)', { cycles: 4, w: 170, h: 50, lo: 0, hi: 3200, color: PAL[5] })}<span class="small dim">barrido automático (LFO)</span></div></div>
    <div class="kv small" style="margin-top:3px"><code>.lpq(10)</code><span>resonancia: realza la frecuencia de corte (el "chillido" acid)</span><code>.ftype('ladder')</code><span>tipo de filtro: <code>12db</code>, <code>ladder</code> (más agresivo), <code>24db</code></span><code>.lpf("800:10")</code><span>cutoff y resonancia juntos, separados por <code>:</code></span><code>.vowel("a e i")</code><span>filtro de formantes: suena como una voz</span></div>`, { c: 'fx', tag: 'VCF', src: 'controls.mjs:1204', style: 'grid-area:vcf' })}
    ${card('Envolvente de filtro: el "wow"', `${filterEnv({ w: 300, h: 84 })}
    ${pre(`note("c2*8").s("sawtooth")
  .lpf(300).lpenv(4)    // sube 4 octavas
  .lpa(.05).lpd(.25)    // A y D del filtro
  .lps(0)               // S del filtro`)}
    <p class="small"><code>lpenv</code> se mide en <b>octavas</b> (<code>2 ** env</code> en <span class="mono">helpers.mjs:261</span>). Defaults del filtro: A .005 · D .14 · S 0 · R .1. También: <code>.hpenv</code>, <code>.bpenv</code>.</p>`, { c: 'arm', tag: 'FENV', style: 'grid-area:fenv' })}
    ${card('FM, pitch y más fuentes', `<div class="kv small">
      <code>.fm(2) .fmh(1.5)</code><span>FM: un oscilador modula la frecuencia de otro. <code>fm</code> = índice (brillo, metal), <code>fmh</code> = relación de armónicos (enteros = armónico; decimales = campana)</span>
      <code>.fmenv .fmattack</code><span>envolvente propia de la FM: ataques metálicos que se apagan</span>
      <code>.penv(12).pdecay(.1)</code><span>envolvente de <b>pitch</b> en semitonos: el "pew" del láser o el golpe del bombo 808</span>
      <code>.vib(4).vibmod(.5)</code><span>vibrato: frecuencia (Hz) y profundidad (semitonos)</span>
      <code>.unison .detune .spread</code><span>voces, desafinación y apertura estéreo del supersaw</span>
      <code>.coarse .crush</code><span>lo-fi: baja la frecuencia de muestreo / los bits</span>
    </div>`, { c: 'sin', tag: 'MÁS', src: 'controls.mjs:473-1914', style: 'grid-area:fm' })}
  </div>`);
}

export function synth2() {
  const chain = [
    ['sin', 'Fuente', 's · note · bank\nattack…release'],
    ['fx', 'Filtros', 'lpf → hpf → bpf'],
    ['arm', 'Color', 'vowel · coarse\ncrush · shape · distort'],
    ['js', 'Modulación', 'tremolo'],
    ['rit', 'Dinámica', 'compressor'],
    ['hy', 'Estéreo', 'pan · phaser'],
    ['text', 'Nivel', 'postgain'],
    ['fx', 'Sends (orbit)', 'delay · room\n→ djf → salida'],
  ];
  return page('Síntesis II · efectos, cadena de señal, mezcla', 'El orden de los efectos no lo elegís vos: superdough lo fija. Este es el orden real, leído del código fuente.', 'fx', `
  <div class="grid" style="grid-template-columns:1fr 1fr 1fr;grid-template-rows:auto auto 1fr">
    ${card('La cadena real de superdough (orden fijo)', `<div class="flow">${chain.map(([c, t, d], i) => `${i ? '<span class="ar">›</span>' : ''}<div class="st" style="--sc:var(--${c})"><b>${t}</b><code style="white-space:pre-line;display:block;font-size:6.6pt">${d}</code></div>`).join('')}</div>
    <p class="small">Leído de <span class="mono">superdough.mjs:682–963</span>. Cada evento crea su propia cadena; <b>delay y reverb son buses compartidos</b> por <code>orbit</code>: <code>.room()</code> y <code>.delay()</code> son cuánto mandás (send) al bus, no efectos por nota. Por eso en el código da igual dónde escribas <code>.room()</code>: el orden es siempre este.</p>`, { c: 'fx', tag: 'CADENA', style: 'grid-column:span 3' })}
    ${card('Espacio: reverb y delay', `<div class="kv small">
      <code>.room(.4)</code><span>cuánto mandás a la reverb (0–1)</span>
      <code>.roomsize(4) .size</code><span>tamaño 0–10 (también <code>.roomfade</code>, <code>.roomlp</code>, <code>.roomdim</code>)</span>
      <code>.delay(.5)</code><span>cuánto mandás al delay</span>
      <code>.delaytime(.375) .dt</code><span>tiempo en segundos. Si no lo ponés, usa <b>3/16 de ciclo</b> (corchea con puntillo, sincronizado al tempo) · <span class="mono">superdough.mjs:194</span></span>
      <code>.delayfeedback(.6) .dfb</code><span>repeticiones (&lt; 1, o se autooscila)</span>
      <code>.delay(".5:.375:.6")</code><span>los tres juntos</span>
      <code>.orbit(2)</code><span>bus separado: otra reverb y otro delay</span>
    </div>`, { c: 'fx', tag: 'ESPACIO', src: 'controls.mjs:1733 · 2196' })}
    ${card('Color: saturación y lo-fi', `<div class="kv small">
      <code>.distort(2)</code><span>waveshaper (útil de 0 a 10); <code>"2:.5"</code> = cantidad:volumen de salida</span>
      <code>.shape(.5)</code><span>versión vieja (deprecada): preferí <code>distort</code></span>
      <code>.crush(4)</code><span>bitcrusher: 1 = destruido, 16 = limpio</span>
      <code>.coarse(8)</code><span>divide el sample rate (1 = original): aliasing, chiptune</span>
      <code>.vowel("a")</code><span>formantes: a e i o u</span>
      <code>.phaser(2)</code><span>phaser (velocidad); <code>.phaserdepth(0–1)</code></span>
      <code>.tremolo(4)</code><span>modulación de volumen (velocidad en Hz)</span>
    </div>`, { c: 'arm', tag: 'COLOR', src: 'controls.mjs:858–2323' })}
    ${card('Mezcla y dinámica', `<div class="kv small">
      <code>.gain(.8)</code><span>volumen de entrada (antes de la cadena)</span>
      <code>.velocity(.7)</code><span>intensidad 0–1; se multiplica con gain (<span class="mono">superdough.mjs:611</span>)</span>
      <code>.postgain(1.2)</code><span>volumen final, después de los efectos</span>
      <code>.pan(.3)</code><span>0 = izquierda · .5 = centro · 1 = derecha</span>
      <code>.compressor(…)</code><span><code>"-20:20:10:.002:.02"</code> = umbral:ratio:knee:ataque:release</span>
      <code>.jux(rev)</code><span>L = original, R = transformado: estéreo instantáneo</span>
    </div>
    <div class="note" style="--c:var(--warn)"><b>Ojo con la suma.</b> Diez capas a gain 1 saturan. Empezá con el bombo en <code>.gain(1)</code> y el resto entre .3 y .7.</div>`, { c: 'rit', tag: 'MIX', src: 'controls.mjs:411–2364' })}
    ${card('Sidechain / ducking: el "bombeo" del house', `${pre(`pad:  chord("<Cm9 Fm9>").voicing()
        .s("supersaw").lpf(1200)
        .orbit(2)            // bus 2
kick: s("bd*4").duckorbit(2) // cada bombo lo baja
        .duckattack(.2).duckdepth(1)`)}
    ${(() => { let d = 'M0,8'; const pts = []; for (let i = 0; i < 4; i++) { const x = 6 + i * 72; d += ` L${x},8 L${x + 1},42 C${x + 14},42 ${x + 22},10 ${x + 40},8`; pts.push(x); } d += ' L300,8'; return `<svg class="viz" viewBox="0 0 300 58" width="100%"><rect width="300" height="58" rx="4" fill="var(--cell)"/><path d="${d}" fill="none" stroke="#9b7bff" stroke-width="2"/>${pts.map((x) => `<rect x="${x - 2}" y="47" width="6" height="8" rx="1.5" fill="#3ee6d1"/>`).join('')}<text x="296" y="20" text-anchor="end" class="as">volumen del pad</text><text x="296" y="54" text-anchor="end" class="as">bd*4</text></svg>`; })()}
    <p class="small"><code>duckorbit</code> baja el volumen de otro orbit en cada golpe; <code>duckattack</code> es el tiempo que tarda en volver y <code>duckdepth</code> cuánto baja (<span class="mono">controls.mjs:971–1038</span>).</p>`, { c: 'js', tag: 'SIDECHAIN' })}
    ${card('Recetas de timbre', `<table><tr><th>Sonido</th><th>Cadena</th><th>Idea</th></tr>
      <tr><td><b>pluck</b></td><td class="m">.s("sawtooth").decay(.15).sustain(0).lpf(2000)</td><td class="small">sin sustain = percusivo</td></tr>
      <tr><td><b>pad</b></td><td class="m">.s("supersaw").attack(1).release(2).lpf(1500).room(.8)</td><td class="small">entra y sale lento, mucho espacio</td></tr>
      <tr><td><b>acid</b></td><td class="m">.s("sawtooth").lpf(400).lpq(12).lpenv(3).ftype('ladder')</td><td class="small">resonancia + envolvente de filtro</td></tr>
      <tr><td><b>sub</b></td><td class="m">note("c1 c2").s("sine").lpf(200)</td><td class="small">octavas 1–2, sin armónicos</td></tr>
      <tr><td><b>reese</b></td><td class="m">.s("supersaw").detune(.5).lpf(300).lpq(5)</td><td class="small">saws desafinados: DnB</td></tr>
      <tr><td><b>stab</b></td><td class="m">.s("square").decay(.1).sustain(0).delay(.5).room(.6)</td><td class="small">corto + eco = dub</td></tr>
      <tr><td><b>bell</b></td><td class="m">.s("sine").fm(4).fmh(3.5).decay(1).sustain(0)</td><td class="small">FM con relación no entera = metal</td></tr>
      <tr><td><b>808</b></td><td class="m">.s("sine").penv(12).pdecay(.05).decay(.8).sustain(0)</td><td class="small">golpe de pitch + cola larga</td></tr>
      <tr><td><b>lo-fi</b></td><td class="m">.crush(6).coarse(4).lpf(3000)</td><td class="small">menos bits, menos sample rate</td></tr>
    </table>
    <p class="small" style="margin-top:4px"><b style="color:var(--sin)">Mapa de frecuencias:</b> cada instrumento tiene "su" zona. Limpiá lo que no le corresponde con <code>.hpf()</code> o <code>.lpf()</code> y la mezcla se aclara sola.</p>
    ${(() => { const bands = [[20, 60, 'sub', 'bombo · 808 · sub', '#3ee6d1'], [60, 250, 'graves', 'bajo · cuerpo del bombo', '#5ab0ff'], [250, 2000, 'medios', 'acordes · voces · leads', '#9b7bff'], [2000, 6000, 'presencia', 'ataque · caja · claridad', '#ff4fa3'], [6000, 20000, 'aire', 'hats · brillo · reverb', '#ffb547']]; const X = (f) => 6 + (Math.log10(f / 20) / 3) * 588; let s = '<svg class="viz" viewBox="0 0 600 64" width="100%"><rect width="600" height="64" rx="5" fill="var(--cell)"/>'; bands.forEach(([a, b, n, d, c]) => { s += `<rect x="${X(a)}" y="6" width="${X(b) - X(a) - 2}" height="34" rx="4" fill="${c}" opacity=".85"/><text x="${(X(a) + X(b)) / 2}" y="21" text-anchor="middle" style="font:700 9px 'Space Grotesk';fill:#0b0d12">${n}</text><text x="${(X(a) + X(b)) / 2}" y="33" text-anchor="middle" style="font:500 6.4px 'JetBrains Mono';fill:#0b0d12">${a >= 1000 ? a / 1000 + 'k' : a}–${b >= 1000 ? b / 1000 + 'k' : b} Hz</text><text x="${(X(a) + X(b)) / 2}" y="54" text-anchor="middle" class="as" style="font-size:7px">${d}</text>`; }); return s + '</svg>'; })()}
    <p class="small dim">Ej.: <code>.hpf(150)</code> en pads y acordes deja lugar al bajo; <code>.lpf(8000)</code> en la reverb evita que chille.</p>`, { c: 'sin', tag: 'PRESETS', style: 'grid-column:span 2' })}
  </div>`);
}

export function random() {
  const SIGS = [['sine', 0], ['cosine', 5], ['saw', 1], ['isaw', 6], ['tri', 2], ['square', 3], ['perlin', 4], ['rand', 7]];
  return page('Azar y modulación', 'LFOs, aleatoriedad y probabilidad: lo que hace que un loop de 1 compás suene vivo durante 5 minutos. Señales consultadas a Strudel (2 ciclos).', 'js', `
  <div class="grid" style="grid-template-columns:1.1fr 1fr 1fr;grid-template-rows:auto 1fr;grid-template-areas:'lfo rnd prob' 'lfo rib form'">
    ${card('Señales continuas (rango 0..1)', `<div style="display:grid;grid-template-columns:1fr 1fr;gap:4px 8px">${SIGS.map(([s, i]) => `<div><div class="row" style="justify-content:space-between"><code style="background:none;padding:0;font-weight:700">${s}</code><span class="mono" style="font-size:5.8pt;color:var(--faint)">signal.mjs</span></div>${sig(s, { cycles: 2, w: 150, h: 38, color: PAL[i % PAL.length], N: s === 'rand' ? 400 : 200 })}</div>`).join('')}</div>
    ${pre(`.lpf(sine.range(300, 3000).slow(8))   // LFO de 8 ciclos
.pan(perlin.range(.2, .8))              // deriva orgánica
.gain(saw.range(.2, 1).fast(4))         // rampa por negra`)}
    <p class="small"><code>.range(a,b)</code> escala · <code>.slow(n)</code> baja la frecuencia del LFO · <code>.segment(n)</code> lo convierte en n escalones · <code>.rangex</code> escala exponencial (ideal para Hz).</p>
    <p class="small" style="margin-top:3px"><b style="color:var(--js)">La señal toma la forma del patrón:</b> se lee en el inicio de cada evento. Acá, <code>s("hh*16").gain(saw.fast(2))</code>. La opacidad es el gain que recibió cada hat:</p>
    ${grid('s("hh*16").gain(saw.fast(2))', { steps: 16, w: 300, rowH: 22, rows: 'single', hit: true, showText: false })}
    ${grid('s("hh*16").gain(sine.slow(2))', { cycles: 2, steps: 16, w: 300, rowH: 22, rows: 'single', hit: true, showText: false, colorMap: { '': '#ff4fa3' } })}
    <p class="small dim">abajo: <code>.gain(sine.slow(2))</code> durante 2 ciclos: un "swell" de volumen.</p>`, { c: 'js', tag: 'LFO', style: 'grid-area:lfo' })}
    ${card('Azar discreto', `<div class="col" style="gap:3px">
      ${ex('s("hh*8").n(irand(8))', 'entero al azar 0–7', sig('s("hh*8").n(irand(8))', { cycles: 2, w: 240, h: 34, lo: 0, hi: 8, dots: true, color: PAL[1] }))}
      ${ex('s("hh*8").n(choose(0, 3, 7))', 'uno de la lista', sig('s("hh*8").n(choose(0,3,7))', { cycles: 2, w: 240, h: 34, lo: 0, hi: 8, dots: true, color: PAL[2] }))}
      ${ex('s("hh*8").n(wchoose([0,3],[4,2],[7,1]))', 'con pesos 3 : 2 : 1', sig('s("hh*8").n(wchoose([0,3],[4,2],[7,1]))', { cycles: 2, w: 240, h: 34, lo: 0, hi: 8, dots: true, color: PAL[3] }))}
      ${ex('n("0 1 2 3 4 5 6 7").shuffle(8)', 'permuta sin repetir', sig('n("0 1 2 3 4 5 6 7").shuffle(8)', { cycles: 2, w: 240, h: 34, lo: 0, hi: 8, dots: true, color: PAL[4] }))}
    </div><p class="small dim">También: <code>randcat(a,b,c)</code> elige un patrón por ciclo · <code>.scramble(n)</code> sortea con repetición.</p>`, { c: 'arm', tag: 'RANDOM', src: 'signal.mjs:488–624', style: 'grid-area:rnd' })}
    ${card('Probabilidad: aplicar una función a veces', `${probBar([['never', 0], ['almostNever', 0.1], ['rarely', 0.25], ['sometimes', 0.5], ['often', 0.75], ['almostAlways', 0.9], ['always', 1]], { w: 300, h: 13 })}
    ${pre(`s("hh*16").sometimes(x => x.speed(2))
s("bd*4").rarely(ply(2))             // del video
s("hh*8").sometimesBy(.3, x => x.gain(.3))
s("hh*16").degradeBy(.4)             // quita ~40%
n("0 2 4").someCycles(x => x.rev())  // decide por ciclo`)}
    <p class="small dim">Valores leídos de <span class="mono">signal.mjs:783–923</span>. Abajo, <code>s("hh*16").degradeBy(.4)</code> en 2 ciclos: el azar se decide <b>por evento</b>.</p>
    ${grid('s("hh*16").degradeBy(.4)', { cycles: 2, steps: 16, w: 300, rowH: 20, rows: 'single', hit: true, showText: false, colorMap: { '': '#3ee6d1' } })}
    ${grid('s("hh*16").sometimes(x => x.speed(2))', { cycles: 2, steps: 16, w: 300, rowH: 0, rows: 'single' }).replace(/.*/s, '')}`, { c: 'rit', tag: 'PROB', style: 'grid-area:prob' })}
    ${card('Forma del tema: arrange y mask', `${pre(`arrange(
  [4, s("bd*4")],                   // intro
  [8, stack(s("bd*4"), s("hh*8"))], // A
  [4, s("~ cp")]                    // break
)`)}
    ${grid('arrange([4, s("bd*4")], [8, stack(s("bd*4"), s("hh*8"))], [4, s("~ cp")])', { cycles: 16, steps: 1, w: 300, rowH: 13, labelW: 16, hit: false, order: ['bd', 'hh', 'cp'] }).replace(/<text[^>]*class="vc">ciclo \d+<\/text>/g, '')}
    <p class="small dim">16 ciclos de un vistazo (cada columna es un ciclo).</p>
    ${pre(`// los hats entran en el ciclo 5:
hats: s("hh*8").mask("<0!4 1!12>")
// el bajo entra en el ciclo 9:
bass: note("c2*8").mask("<0!8 1!8>")`)}
    <p class="small">En vivo lo más común es comentar y descomentar capas (<code>_bass:</code>). <code>arrange()</code> y <code>mask()</code> sirven para dejar la estructura <b>escrita</b> (<span class="mono">pattern.mjs:1469</span>).</p>`, { c: 'fx', tag: 'ESTRUCTURA', style: 'grid-area:form' })}
    ${card('Congelar el azar: seed y ribbon', `${pre(`n(irand(8).segment(4)).scale("C:minor")
  .ribbon(1337, 2)  // loop de 2 ciclos desde el 1337`)}
    ${roll('n(irand(8).segment(4)).scale("C:minor").ribbon(1337, 2)', { cycles: 4, w: 260, h: 56, names: false })}
    <ul class="tight small">
      <li><code>rand</code> depende del tiempo: el ciclo 1337 siempre suena igual. <code>ribbon(offset, ciclos)</code> = <code>early(offset)</code> + reinicio en loop (<span class="mono">pattern.mjs:2678</span>).</li>
      <li><code>.seed(n)</code> cambia la "semilla": otra secuencia, igual de reproducible.</li>
      <li><b>Flujo de trabajo:</b> generá con azar → probá offsets → quedate con el que te gusta. Es lo que hace la autora del video con <code>rib(22,1)</code> y <code>rib(29,1)</code>.</li>
    </ul>`, { c: 'sin', tag: 'RIBBON', style: 'grid-area:rib' })}
  </div>`);
}
