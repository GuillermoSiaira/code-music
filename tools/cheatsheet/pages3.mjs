import { page, card, pre, ex, hl, esc } from './h.mjs';
import fs from 'fs';
const img = (k) => 'data:image/png;base64,' + fs.readFileSync(`hy/${k}.png`).toString('base64');
import { grid, roll, run, haps, sig, notesAt, keyboard, PAL, transpile, meta } from './lib.mjs';

const DRUMC = { bd: '#3ee6d1', sd: '#ff4fa3', cp: '#ff7a59', rim: '#9b7bff', hh: '#ffb547', oh: '#f2e94e', crackle: '#6c7690' };
const DRUM = new Set(['bd', 'sd', 'cp', 'rim', 'hh', 'oh', 'crackle', 'pink']);

export const STYLES1 = [
  { name: 'House', bpm: 124, c: 'rit', dna: ['bombo en negras (four-on-the-floor)', 'acordes m7/m9 a contratiempo', 'bajo en la corchea "y"'], live: 'abrí el filtro de los acordes de a poco; sacá el bombo 1 compás antes del drop', code: `setcpm(124/4)
drums: s("bd*4, [~ oh]*4, ~ cp")
  .bank("RolandTR909")
hats: s("hh*16").bank("RolandTR909")
  .gain(.35)
bass: note("<c2 c2 f1 g1>")
  .struct("[~ x]*4").s("sawtooth")
  .lpf(400).decay(.2).sustain(.3)
chords: chord("<Cm9 Cm9 Fm9 G7b9>")
  .voicing().struct("~ [~ x] ~ x")
  .s("sawtooth").room(.4)
  .lpf(sine.range(800, 3000).slow(16))` },
  { name: 'Techno', bpm: 132, c: 'rit', dna: ['bombo fuerte y seco', 'rumble: bajo pegado al bombo', 'stabs con delay, poca armonía'], live: 'cambiá el .slow() del LFO del rumble; poné .degradeBy(.3) en los hats para el break', code: `setcpm(132/4)
kick: s("bd*4").bank("RolandTR909")
hats: s("[~ hh hh hh]*4")
  .bank("RolandTR909").gain(.4)
clap: s("cp").beat("4,12", 16)
  .room(.3)
rumble: note("c1*16").s("sawtooth")
  .decay(.12).sustain(0)
  .lpf(sine.range(150, 600).slow(8))
stab: chord("Cm").voicing()
  .s("square").beat("2,6,9", 16)
  .decay(.1).sustain(0)
  .delay(.5).room(.5)` },
  { name: 'Dub Techno', bpm: 118, c: 'fx', dna: ['un acorde m7 que se repite y se disuelve', 'mucho delay con feedback y reverb', 'filtro que respira (perlin)'], live: 'subí delayfeedback hacia .8 y bajalo; movés todo el "dub" con un número', code: `setcpm(118/4)
kick: s("bd*4").gain(.9)
hats: s("[~ hh]*4").gain(.35)
chord: chord("<Cm7 Cm7 Fm7 Cm7>")
  .voicing().s("sawtooth")
  .struct("~ x ~ ~ ~ ~ ~ ~")
  .lpf(perlin.range(400, 1500))
  .decay(.15).sustain(0)
  .delay(.7).delaytime(.33)
  .delayfeedback(.7).room(.8)
hiss: s("pink").gain(.03)` },
  { name: 'Acid', bpm: 128, c: 'sin', dna: ['línea 303: saw + filtro ladder resonante', 'la envolvente de filtro hace el "squelch"', 'octavas y acentos aleatorios'], live: 'mové lpq entre 5 y 20 y el LFO del cutoff: eso ES el acid', code: `setcpm(128/4)
drums: s("bd*4, [~ hh]*4, ~ cp")
  .bank("RolandTR909")
acid: note("c2 c2 c3 c2 eb2 c2 bb1 [c2 g2]")
  .s("sawtooth").ftype('ladder')
  .lpf(sine.range(300, 2000).slow(8))
  .lpq(12).lpenv("<2 4>").lpd(.15)
  .decay(.2).sustain(.2)
  .sometimes(x => x.add(note(12)))` },
  { name: 'Ambient', bpm: 70, c: 'hy', dna: ['sin bombo: el tiempo flota', 'acordes largos (attack/release lentos)', 'notas sueltas con azar y mucho espacio'], live: 'cambiá la escala de las campanas (lydian → dorian) y escuchá cómo cambia el color', code: `setcpm(70/4)
pad: chord("<D^9 Bm11 G^7#11 A6>/2")
  .voicing().s("supersaw")
  .attack(2).release(4).lpf(1200)
  .room(.9).roomsize(8).gain(.5)
bells: n("0 4 7 <9 11>")
  .scale("D:lydian").s("triangle")
  .slow(2).degradeBy(.3)
  .delay(.6).room(.8)
  .pan(perlin.range(.2, .8))
drone: note("d2").s("sine").gain(.4)` },
];

export const STYLES2 = [
  { name: 'Drum & Bass', bpm: 174, c: 'rit', dna: ['breaks rápidos: two-step a 170–175', 'bajo reese (saws desafinados)', 'pads oscuros a medio tiempo'], live: 'poné .every(4, x => x.ply(2)) en la caja para los fills', code: `setcpm(174/4)
kick: s("bd").beat("0,10", 16)
snare: s("sd").beat("4,12", 16)
hats: s("hh*8").gain("[.6 .3]*4")
reese: note("<c1 c1 eb1 g0>")
  .s("supersaw").detune(.6)
  .lpf(sine.range(200, 700).slow(4))
  .lpq(6).gain(.7)
pad: chord("<Cm9 Ab^7>/2").voicing()
  .s("triangle").attack(.5)
  .release(2).room(.7).gain(.4)` },
  { name: 'Trap / Hip-hop', bpm: 140, c: 'arm', dna: ['half-time: caja en el 3', 'hats con redobles (ply)', '808 con golpe de pitch y cola larga'], live: 'cambiá los .ply() de los hats (son el alma del trap) y sumá .bank("RolandTR808") a la batería', code: `setcpm(140/4)
kick: s("bd").beat("0,7,10", 16)
snare: s("sd").beat("8", 16)
hats: s("hh*8")
  .ply("<1 [1 1 1 2] 1 [1 3 1 1]>")
bass808: note("<c1 c1 eb1 g0>")
  .beat("0,7,10", 16).s("sine")
  .penv(12).pdecay(.04)
  .decay(.9).sustain(0)
mel: n("0 ~ 2 3 ~ 4 3 2")
  .scale("C:harmonic:minor")
  .s("triangle").room(.5).gain(.5)` },
  { name: 'Dembow / Reggaetón', bpm: 95, c: 'arm', dna: ['tresillo 3-3-2 en la caja', 'progresión menor (i–VI–III–VII)', 'bajo que sigue el tresillo'], live: 'sacá la caja 1 compás con mask("<1 1 1 0>") antes del coro', code: `setcpm(95/4)
drums: s("bd*4, [~ ~ ~ sd ~ ~ sd ~]*2")
  .bank("RolandTR808")
hats: s("hh*8").bank("RolandTR808")
  .gain(.5)
bass: note("<a1 f1 c2 g1>")
  .struct("x ~ ~ x ~ ~ x ~")
  .s("sawtooth").lpf(500)
chords: chord("<Am F C G>").voicing()
  .struct("~ x ~ x").s("square")
  .decay(.15).sustain(0)
  .lpf(2000).gain(.5)` },
  { name: 'UK Garage', bpm: 132, c: 'fx', dna: ['bombo que saltea, caja en 2 y 4', 'swing fuerte en los hats', 'acordes m9 cortados y sincopados'], live: 'variá el swing: .swingBy(1/6, 4) sutil, 1/3 bien garage', code: `setcpm(132/4)
kick: s("bd").beat("0,10", 16)
  .bank("RolandTR909")
snare: s("~ sd ~ sd").bank("RolandTR909")
hats: s("hh*8").swingBy(1/3, 4)
  .gain(.5)
organ: chord("<Fm9 Bbm9 Ebm9 Ab^7>")
  .voicing().s("square")
  .struct("~ x ~ ~ x ~ x ~")
  .decay(.12).sustain(0).lpf(2500)
bass: note("<f1 bb1 eb1 ab1>")
  .struct("x ~ ~ x ~ ~ x ~").s("sine")` },
  { name: 'Lo-fi Hip-hop', bpm: 80, c: 'sin', dna: ['acordes maj7/m7 (ii–V–I) en piano', 'batería con swing, todo un poco "sucio"', 'crackle de vinilo y filtro pasa-bajos'], live: 'bajá el lpf de los keys a 1200 para el puente; subí el crackle', code: `setcpm(80/4)
drums: s("bd ~ ~ bd ~ ~ bd ~, ~ sd")
  .bank("RolandTR808").swingBy(1/6, 4)
hats: s("hh*8").swingBy(1/6, 4)
  .gain(rand.range(.2, .5))
keys: chord("<F^7 Em7 Dm7 C^7>")
  .voicing().s("piano")
  .struct("x ~ ~ [~ x] ~ ~ x ~")
  .lpf(2000).room(.4)
bass: chord("<F^7 Em7 Dm7 C^7>")
  .rootNotes(2).s("sine")
vinyl: s("crackle").gain(.1)` },
];

function styleCard(st) {
  const P = run(st.code);
  const drums = {}, mel = {};
  for (const [k, p] of Object.entries(P)) {
    const hs = haps(p, 0, 1);
    if (hs.length && hs.every((h) => DRUM.has(h.v.s))) drums[k] = p;
    else mel[k] = p;
  }
  const dviz = Object.keys(drums).length ? grid(drums, { steps: 16, w: 300, rowH: 10, labelW: 28, order: ['bd', 'sd', 'cp', 'rim', 'oh', 'hh', 'crackle'], colorMap: DRUMC, hit: true }) : '';
  const mviz = Object.keys(mel).length ? roll(mel, { cycles: 2, w: 300, h: 80, names: false, colors: Object.keys(mel).map((_, i) => [1, 3, 2, 5, 4][i % 5]) }) : '';
  const legend = Object.keys(mel).map((k, i) => `<span style="color:${PAL[[1, 3, 2, 5, 4][i % 5]]}">${k}</span>`).join(' · ');
  return card(st.name, `<div class="row" style="gap:6px;align-items:stretch">
      <div style="flex:1.12;min-width:0" class="col">${pre(st.code)}</div>
      <div style="flex:1;min-width:0" class="col" style="gap:2px">${dviz}${mviz}<span class="small dim" style="font-size:6.3pt">batería 1 ciclo · piano roll 2 ciclos: ${legend}</span>
        <p class="small" style="line-height:1.25"><b style="color:var(--${st.c})">ADN:</b> ${st.dna.join(' · ')}</p></div></div>
      <div class="note" style="--c:var(--${st.c});margin-top:auto"><b>En vivo:</b> ${st.live}</div>`, { c: st.c, cls: 'genre' }).replace('</h3>', `<span class="bpm">${st.bpm} BPM</span></h3>`);
}

export function styles1() {
  return page('Estilos I · house, techno, dub, acid, ambient', 'Plantillas completas para copiar en strudel.cc. Cada una fue evaluada con el motor real: los gráficos muestran lo que suena. Usan samples y sintes por defecto.', 'arm', `
  <div class="grid" style="grid-template-columns:1fr 1fr;grid-template-rows:1fr 1fr 1fr">
    ${STYLES1.map(styleCard).join('')}
    ${card('Cómo construir un tema desde cero', `<ol class="small" style="padding-left:14px;display:flex;flex-direction:column;gap:2px">
      <li><b>Tempo y tonalidad:</b> <code>setcpm(bpm/4)</code> y elegí una escala (pág. 8).</li>
      <li><b>Bombo:</b> el esqueleto. Escuchalo solo 8 compases.</li>
      <li><b>Bajo:</b> que <i>dialogue</i> con el bombo (en los huecos) y en la tónica.</li>
      <li><b>Hats/percusión:</b> el movimiento; acá entra el swing.</li>
      <li><b>Armonía:</b> 1–4 acordes. Menos es más.</li>
      <li><b>Lead/textura:</b> una idea melódica corta + azar controlado.</li>
      <li><b>Espacio:</b> room y delay en sends; <code>.hpf()</code> para limpiar.</li>
      <li><b>Forma:</b> muteá y desmuteá capas (<code>_nombre:</code>) cada 8 o 16 compases.</li>
    </ol>`, { c: 'arm', tag: 'PROCESO' })}
  </div>`);
}

export function styles2() {
  const rows = [
    ['House', '120–128', '4/4 negras', 'menor · dórico', 'saws filtrados, órganos'],
    ['Techno', '128–140', '4/4 seco', 'menor · frigio', 'rumble, stabs, ruido'],
    ['Dub techno', '115–125', '4/4 suave', 'menor (m7)', 'acorde + delay + reverb'],
    ['Acid', '125–135', '4/4', 'menor', 'saw + ladder + resonancia'],
    ['Ambient', '60–90', 'libre', 'lidio · pentatónica', 'pads, campanas, drones'],
    ['DnB', '160–180', 'two-step / breaks', 'menor', 'reese, sub, breaks'],
    ['Trap', '130–150 (½)', 'half-time', 'menor · m. armónica', '808, hats rolls'],
    ['Reggaetón', '88–100', 'dembow 3-3-2', 'menor · andaluza', '808, plucks, square'],
    ['UK Garage', '130–135', '2-step + swing', 'menor (m9)', 'órgano, chops, sub'],
    ['Lo-fi', '70–90', 'boom-bap + swing', 'maj7/m7 (ii–V–I)', 'piano, crackle, lpf'],
  ];
  return page('Estilos II · DnB, trap, dembow, garage, lo-fi', 'Más plantillas evaluadas. La tabla del final resume el ADN de cada género: tempo, groove, escala y paleta de sonidos.', 'arm', `
  <div class="grid" style="grid-template-columns:1fr 1fr;grid-template-rows:1fr 1fr 1fr">
    ${STYLES2.map(styleCard).join('')}
    ${card('ADN de los géneros', `<table class="tight-t" style="font-size:6.7pt;line-height:1.15"><tr><th>Género</th><th>BPM</th><th>Groove</th><th>Escala</th><th>Paleta</th></tr>${rows.map((r) => `<tr><td><b>${r[0]}</b></td><td class="m">${r[1]}</td><td class="small">${r[2]}</td><td class="small">${r[3]}</td><td class="small dim">${r[4]}</td></tr>`).join('')}</table>`, { c: 'arm', tag: 'TABLA' })}
  </div>`);
}

export function dissect() {
  const lead = `lead: s("saw").chord("G#m9").voicing()
  .lpf(rand.seed(3).range(200, 1000)).lpe(8)
  .lpa(wchoose(
    [rand.seed("2")
      .range(0.05, 0.1).rib(22, 1), 2],
    ["0", 4],
  ))
  .lpd(rand.range(0.1, 0.7).rib(29, 1))
  .set.out(\`<
  ~ ~ 1 _ ~ ~ 1 ~ ~ 1 _ _
>*8\`.as("vel"))
  .room(0.4).pan(rand.range(0.4, 0.6))
  .compressor(-10).postgain(0.2).rarely(ply(2))`;
  const P = run(lead);
  const L = P.lead;
  const lines = [
    ['69', 'lead: s("saw")', 'js', 'Pista <b>lead</b>. Oscilador diente de sierra (alias de <code>sawtooth</code>).'],
    ['69', '.chord("G#m9").voicing()', 'arm', 'Acorde de Sol# menor 9; el voicing elige las notas (abajo, en el teclado).'],
    ['70', '.lpf(rand.seed(3).range(200,1000))', 'fx', 'Cutoff aleatorio por nota, entre 200 y 1000 Hz. Con <code>seed(3)</code> es reproducible.'],
    ['70', '.lpe(8)', 'fx', 'Envolvente de filtro de <b>8 octavas</b>: el cutoff se multiplica por 2⁸ = 256, así que llega al tope (20 kHz) y en cada nota el filtro se abre del todo.'],
    ['71-75', '.lpa(wchoose([…rib(22,1), 2], ["0", 4]))', 'sin', 'Attack del filtro: con peso 2 un valor aleatorio entre 0.05 y 0.1 "congelado" con <code>rib</code>; con peso 4, ataque 0 (seco). 2 de cada 6 notas "se abren" más suave.'],
    ['76', '.lpd(rand.range(0.1,0.7).rib(29,1))', 'sin', 'Decay del filtro aleatorio, pero en loop de 1 ciclo desde el ciclo 29: el mismo "dibujo" de squelch se repite.'],
    ['77-79', '.set.out(`<~ ~ 1 _ …>*8`.as("vel"))', 'rit', '<b>El ritmo.</b> <code>.out</code> = la estructura la manda el patrón de adentro. 12 pasos a 8 por ciclo: la frase dura 1,5 ciclos (polirritmo 12:8).'],
    ['80', '.room(.4).pan(rand.range(.4,.6)).delay(…)', 'hy', 'Reverb, paneo levemente aleatorio por nota y delay.'],
    ['81', '.compressor(-10).pg(0.2)', 'fx', '<code>pg</code> <b>no existe</b> en @strudel/core 1.2.6. Es casi seguro un alias propio de <code>postgain</code>; acá lo reemplazamos por <code>.postgain(0.2)</code>.'],
    ['81', '.rarely(ply(2))', 'rit', '25% de las veces, cada nota se duplica (redoble).'],
  ];
  const vel = Object.values(run('`<~ ~ 1 _ ~ ~ 1 ~ ~ 1 _ _>*8`.as("vel")'))[0];
  return page('Disección: el lead del video', 'El código de la captura (líneas 69–81), ejecutado y desarmado. Cada fila dice qué hace el método y por qué está ahí.', 'sin', `
  <div class="grid" style="grid-template-columns:1.05fr 1.2fr 1fr;grid-template-rows:auto 1fr">
    ${card('El código (versión ejecutable)', `${pre(lead)}<p class="small dim">Copiado de la captura, con <code>.pg</code> → <code>.postgain</code> y sin el <code>.delay</code>, que en pantalla aparece cortado.</p>
    <p class="small" style="margin-top:3px"><b style="color:var(--js)">Lo que ejecuta Strudel</b> (salida real del transpilador, abreviada):</p>
    ${pre(transpile(lead).replace(/;$/, '').replace(/\)\./g, ')\n  .').split('\n').slice(0, 14).join('\n') + '\n  …\n  .p(\'lead\')', '').replace('<pre class="">', '<pre style="--c:var(--js)">')}`, { c: 'sin', tag: 'FUENTE', style: 'grid-row:span 2' })}
    ${card('Método por método', `<table style="table-layout:fixed"><colgroup><col style="width:7%"><col style="width:37%"><col style="width:56%"></colgroup>${lines.map(([ln, code, c, d]) => `<tr><td class="f">${ln}</td><td><code style="background:none;padding:0;color:var(--${c});font-size:6.6pt;white-space:normal;overflow-wrap:anywhere">${esc(code)}</code></td><td class="small">${d}</td></tr>`).join('')}</table>
    <p class="small" style="margin-top:5px"><b style="color:var(--sin)">Ejercicios con este lead</b>. Cambiá una cosa por vez y escuchá:</p>
    ${pre(`.chord("<G#m9 Em9>")         // 1. dos acordes
.lpe(2)                       // 2. menos "squelch"
.set.out("<1 ~ 1 1>*4".as("vel")) // 3. otro ritmo
.rib(23, 1)                   // 4. otro azar (era 22)
.s("supersaw").detune(.3)     // 5. más ancho`)}`, { c: 'sin', tag: 'LÍNEA A LÍNEA', style: 'grid-row:span 2' })}
    ${card('El ritmo: 12 pasos sobre una grilla de 8', `${grid({ vel }, { cycles: 3, steps: 8, w: 300, rowH: 22, rows: 'single', showText: false, hit: false })}
    <p class="small">3 ciclos del patrón <code>&lt;~ ~ 1 _ ~ ~ 1 ~ ~ 1 _ _&gt;*8</code>. Los grupos son <b>4+3+5</b> pasos: los acentos caen en lugares distintos de cada compás y la frase recién se repite cada 3 compases (12 y 8 coinciden cada 24 pasos).</p>
    ${pre(transpile('`<~ ~ 1 _ ~ ~ 1>*8`.as("vel")').replace(/;$/, ''))}
    <p class="small dim">↑ los backticks también pasan por mini-notación (salida real del transpilador).</p>`, { c: 'rit', tag: 'POLIRRITMO' })}
    ${card('La armonía y el resultado', `${keyboard(notesAt('chord("G#m9").voicing()'), { from: 52, to: 76, w: 280, h: 40, color: PAL[1] })}
    <p class="small"><code>G#m9</code> → <b>${notesAt('chord("G#m9").voicing()').join(' · ')}</b>: son G# B D# F# A# escritas con bemoles (enarmónicos).</p>
    ${roll({ lead: L }, { cycles: 3, w: 300, h: 70, names: false, colors: [1] })}
    <p class="small dim">Piano roll de 3 ciclos del lead completo: el acorde entero suena con el ritmo del patrón de velocity.</p>
    <div class="note" style="--c:var(--sin)"><b>Lo que podés robar:</b> (1) timbre y ritmo por separado, unidos con <code>set.out</code>; (2) azar en el filtro pero congelado con <code>rib</code>; (3) <code>wchoose</code> para que la mayoría de las notas sean "normales" y algunas especiales.</div>`, { c: 'arm', tag: 'RESULTADO' })}
  </div>`);
}

export function hydra() {
  return page('Hydra · visuales en vivo', 'Hydra (de Olivia Jack) es a los visuales lo que Strudel es al sonido: funciones encadenadas que generan video en la GPU. Strudel ya la trae integrada.', 'hy', `
  <div class="grid" style="grid-template-columns:1fr 1fr 1fr;grid-template-rows:auto auto 1fr">
    ${card('Misma gramática, otro medio', `<table>
      <tr><th>Idea</th><th>Strudel (audio)</th><th>Hydra (video)</th></tr>
      <tr><td>fuente</td><td class="m">s("sawtooth")</td><td class="m">osc(10, .1, 1)</td></tr>
      <tr><td>transformar</td><td class="m">.lpf(800).fast(2)</td><td class="m">.kaleid(4).rotate(.2)</td></tr>
      <tr><td>modular</td><td class="m">.lpf(sine.range(…))</td><td class="m">.modulate(noise(3), .2)</td></tr>
      <tr><td>mezclar</td><td class="m">stack(a, b)</td><td class="m">.add(src) .blend(src)</td></tr>
      <tr><td>salida</td><td class="m">(implícita)</td><td class="m">.out(o0)</td></tr>
      <tr><td>tiempo</td><td class="m">ciclos (cps)</td><td class="m">time (segundos)</td></tr>
      <tr><td>valor vivo</td><td class="m">"&lt;1 2 4&gt;"</td><td class="m">[1,2,4].fast(1) · () =&gt; …</td></tr>
    </table>
    <p class="small">Se dice <b>"Hydra"</b> (/ˈhaɪdrə/ en inglés, "Hidra" en castellano), como la criatura de muchas cabezas.</p>`, { c: 'hy', tag: 'GRAMÁTICA' })}
    ${card('Activarla dentro de Strudel', `${pre(`await initHydra()          // crea el canvas de fondo

osc(30, 0.1, 1.2)          // fuente: ondas de color
  .kaleid(H("<3 4 6 8>"))  // ← un patrón de Strudel
  .rotate(() => time * .1)
  .modulate(noise(3), .2)
  .out()

$: s("bd*4, [~ hh]*4")
$: n("<0 2 4 7>*4").scale("C:minor").s("sawtooth")`)}
    <p class="small"><code>H(pat)</code> devuelve una función que Hydra llama en cada frame; esa función <b>consulta el patrón en el tiempo actual del scheduler</b>. Por eso el caleidoscopio cambia de 3 a 8 lados <b>sincronizado</b> con la música. <span class="mono">hydra.mjs:51</span></p>`, { c: 'hy', tag: 'H()', src: 'hydra.mjs:7' })}
    ${card('Opciones de initHydra', `<div class="kv small">
      <code>feedStrudel: 1</code><span>manda el canvas de Strudel (pianoroll, spiral, scope…) a <code>s0</code> para procesarlo con Hydra</span>
      <code>detectAudio: true</code><span>opción de Hydra: análisis FFT en <code>a.fft[0..n]</code>. Escucha la entrada de audio (micrófono); en Strudel viene apagada</span>
      <code>pixelRatio</code><span>resolución (1 = normal, .5 = más rápido)</span>
      <code>src</code><span>URL de hydra-synth (por defecto unpkg)</span>
    </div>
    ${pre(`await initHydra({ feedStrudel: 1 })
src(s0).kaleid(4).modulate(osc(4), .1).out()
$: note("c a f e").s("sawtooth").pianoroll()`)}
    <p class="small dim"><code>clearHydra()</code> lo apaga. <span class="mono">hydra.mjs:7–51</span></p>`, { c: 'hy', tag: 'OPCIONES' })}
    ${card('Vocabulario de Hydra', `<div class="kv small">
      <code>FUENTES</code><span><code>osc(freq, sync, offset)</code> · <code>noise(scale, offset)</code> · <code>voronoi()</code> · <code>shape(lados, radio, suavizado)</code> · <code>gradient()</code> · <code>solid(r,g,b)</code> · <code>src(o0|s0)</code></span>
      <code>GEOMETRÍA</code><span><code>rotate</code> · <code>scale</code> · <code>kaleid(n)</code> · <code>repeat(x,y)</code> · <code>pixelate(x,y)</code> · <code>scrollX/Y</code></span>
      <code>COLOR</code><span><code>color(r,g,b)</code> · <code>colorama</code> · <code>hue</code> · <code>saturate</code> · <code>invert</code> · <code>brightness</code> · <code>contrast</code> · <code>posterize</code> · <code>thresh</code> · <code>luma</code></span>
      <code>MEZCLA</code><span><code>add</code> · <code>sub</code> · <code>mult</code> · <code>diff</code> · <code>blend</code> · <code>layer</code> · <code>mask</code></span>
      <code>MODULAR</code><span><code>modulate</code> · <code>modulateScale</code> · <code>modulateRotate</code> · <code>modulateKaleid</code> · <code>modulatePixelate</code> · <code>modulateHue</code></span>
      <code>SALIDA</code><span><code>.out(o0…o3)</code> · <code>render()</code> muestra las 4 salidas</span>
    </div>`, { c: 'hy', tag: 'API' })}
    ${card('Recetas por estilo', `${pre(`// techno: rejilla que late con el bombo
shape(4, .25, .01).repeat(4, 4)
  .scale(H("<1 1.2>*4")).rotate(.3)
  .color(.2, 1, .8).out()

// ambient: nubes lentas
noise(2, .05).color(.4, .6, .9)
  .modulate(osc(1), .3).blend(o0, .9).out()

// dub: feedback (la salida vuelve a entrar)
src(o0).scale(1.01).rotate(.01)
  .blend(osc(20, .1).kaleid(5), .1).out()`)}`, { c: 'hy', tag: 'RECETAS' })}
    ${card('Puentes mentales', `<ul class="tight small">
      <li><b>Valores que cambian:</b> en Hydra <code>[1, 2, 4]</code> recorre la lista (como <code>"&lt;1 2 4&gt;"</code>) y <code>() =&gt; Math.sin(time)</code> es un LFO (como <code>sine</code>).</li>
      <li><b>Sincronía real:</b> usá <code>H()</code> con los <i>mismos</i> strings de mini-notación que tu música. Así todo lo audiovisual comparte un único reloj.</li>
      <li><b>Feedback:</b> <code>src(o0)</code> dentro de <code>.out(o0)</code> es el equivalente visual del <code>delayfeedback</code>: ecos que se acumulan.</li>
      <li><b>Documentación:</b> hydra.ojack.xyz (editor y docs) y strudel.cc/learn/hydra.</li>
    </ul>`, { c: 'hy', tag: 'TIPS' })}
    ${card('Galería: capturas reales de hydra-synth 1.4 (H() fijado en un valor para la foto)', `<div style="display:grid;grid-template-columns:repeat(6,1fr);gap:6px">${[['kaleid', 'osc(30,.1,1.2).kaleid(H(…))\n.rotate(…).modulate(noise(3),.2)'], ['techno', 'shape(4,.25,.01).repeat(4,4)\n.rotate(.3).color(.2,1,.8)'], ['ambient', 'noise(2,.05).color(.4,.6,.9)\n.modulate(osc(1),.3).blend(o0,.9)'], ['dub', 'src(o0).scale(1.01).rotate(.01)\n.blend(osc(20,.1).kaleid(5),.1)'], ['voronoi', 'voronoi(5,.3,.3).color(1,.3,.8)\n.modulateScale(osc(8),.5)'], ['colorama', 'osc(10,.1,2).colorama(.3)\n.pixelate(40,25)']].map(([k, c]) => `<div class="col" style="gap:2px"><img src="${img(k)}" style="width:100%;border-radius:5px;display:block"/><code style="background:none;padding:0;font-size:5.9pt;white-space:pre-line;color:var(--dim)">${esc(c)}</code></div>`).join('')}</div>`, { c: 'hy', tag: 'GALERÍA', style: 'grid-column:span 3' })}
  </div>`);
}

export function reference() {
  const REF = [
    ['Estructura', [['stack', 'pattern.mjs:1321'], ['cat / slowcat', ':1454 · :1399'], ['seq / fastcat', ':1535 · :1505'], ['arrange', ':1469'], ['stepcat / timecat', ':3244'], ['polymeter', ':2847'], ['silence · pure · reify', ':1247 · :1260 · :1285']]],
    ['Tiempo', [['fast · slow', 'pattern.mjs:1924 · :1958'], ['early · late', ':2061 · :2081'], ['ply', ':1905'], ['every / firstOf', ':2022'], ['iter · palindrome', ':2499 · :2340'], ['chunk', ':2571'], ['swingBy · swing', ':2184 · :2193'], ['linger · segment', ':2151 · :2173'], ['off · jux · rev', ':2236 · :2379 · :2259'], ['ribbon / rib', ':2678'], ['beat', ':3521'], ['euclid · euclidRot', 'euclid.mjs:138 · :150']]],
    ['Azar y señales', [['signal · saw · sine', 'signal.mjs:18 · :35 · :80'], ['rand · irand · perlin', ':449 · :488 · :661'], ['choose · wchoose', ':532 · :608'], ['seed · shuffle', ':436 · :392'], ['degradeBy', ':699'], ['sometimes / rarely…', ':800 · :867'], ['range · rangex', 'pattern.mjs:1771 · :1786']]],
    ['Armonía', [['note · n', 'controls.mjs:388 · :366'], ['scale', 'tonal.mjs:268'], ['transpose · scaleTranspose', 'tonal.mjs:114 · :167'], ['chord · anchor · mode · dict', 'controls.mjs:2130–2181'], ['voicing · rootNotes', 'voicings.mjs:196 · :166'], ['arp', 'pattern.mjs:966']]],
    ['Sonido', [['s / sound · bank', 'controls.mjs:110 · :707'], ['attack…release · adsr', ':453–758 · :2572'], ['lpf · hpf · bpf', ':1204 · :1682 · :772'], ['lpq · lpenv · lpa · lpd', ':1705 · :1218 · :1257 · :1296'], ['ftype · vowel', ':1425 · :2447'], ['fm · fmh', ':473–498'], ['gain · velocity · postgain', ':421 · :411 · :431'], ['room · delay · orbit', ':2196 · :1733 · :2047'], ['distort · crush · coarse', ':2323 · :858 · :868'], ['duckorbit (duck)', ':971'], ['as (batch)', ':2773']]],
    ['Sistema', [['Pattern · queryArc', 'pattern.mjs:45 · :414'], ['register()', 'pattern.mjs:1605'], ['registerControl()', 'controls.mjs:63'], ['Hap · TimeSpan', 'hap.mjs:9 · timespan.mjs:9'], ['composers (set/out/…)', 'pattern.mjs:1020'], ['.p() / labels', 'repl.mjs:171 · transpiler.mjs:118'], ['setcpm', 'repl.mjs:132'], ['initHydra · H', 'hydra.mjs:7 · :51'], ['cadena de audio', 'superdough.mjs:682–963']]],
  ];
  const plan = [
    ['1', 'Ritmo', 'mini-notación + 3 grooves de la pág. 6', 'reescribí un groove sin mirar'],
    ['2', 'Transformar', 'fast, ply, every, iter, euclid', 'un loop de 1 compás que dure 3 min sin aburrir'],
    ['3', 'Escalas', 'n().scale(), grados, modos', 'misma melodía en 4 modos: anotá cómo cambia'],
    ['4', 'Acordes', 'chord().voicing(), progresiones, rootNotes', 'tema de 4 acordes con bajo'],
    ['5', 'Síntesis', 'ADSR, filtro, lpenv, FM', 'recreá 3 sonidos de tu sinte de hardware'],
    ['6', 'Azar', 'rand, rib, sometimes, perlin', 'un lead "vivo" a lo autora del video'],
    ['7', 'Mezcla + forma', 'orbit, duck, hpf, arrange, mask', 'tema completo de 3 minutos'],
    ['8', 'Hydra', 'initHydra, H(), feedStrudel', 'tu tema con visuales sincronizados'],
    ['+', 'Trigonometría', 'págs. 12–13 · docs/plan-trigonometria-y-sintesis.md', 'eje paralelo: la guía de A·sen(Bx+C)+D en el sinte'],
  ];
  return page('Referencia de fuentes + ruta de aprendizaje', 'Dónde vive cada función en el código (paquetes npm @strudel/* 1.2.6; repo: codeberg.org/uzu/strudel, carpeta packages/). Abrí el archivo y leé la función: tiene la doc y ejemplos encima.', 'js', `
  <div class="grid" style="grid-template-columns:1fr 1fr 1fr;grid-template-rows:auto auto 1fr">
    ${REF.map(([cat, items], i) => card(cat, `<table>${items.map(([f, loc]) => `<tr><td class="m" style="white-space:normal">${f}</td><td class="f" style="text-align:right">${loc}</td></tr>`).join('')}</table>`, { c: ['js', 'rit', 'arm', 'arm', 'sin', 'fx'][i] })).join('')}
    ${card('Ruta sugerida: 8 semanas, 20 minutos por día', `<table><tr><th>Sem</th><th>Tema</th><th>Qué estudiar</th><th>Desafío</th></tr>${plan.map((r) => `<tr><td class="m">${r[0]}</td><td><b>${r[1]}</b></td><td class="small">${r[2]}</td><td class="small dim">${r[3]}</td></tr>`).join('')}</table>`, { c: 'js', tag: 'PLAN', style: 'grid-column:span 2' })}
    ${card('Glosario express', `<div class="kv small">
      <code>ciclo</code><span>unidad de tiempo de Strudel (≈ 1 compás)</span>
      <code>cps / cpm</code><span>ciclos por segundo / minuto (tempo)</span>
      <code>hap</code><span>un evento: tiempo + valores</span>
      <code>control</code><span>parámetro de sonido (s, lpf, room…)</span>
      <code>señal</code><span>patrón continuo (sine, rand)</span>
      <code>voicing</code><span>disposición de las notas de un acorde</span>
      <code>orbit</code><span>bus de efectos compartido</span>
      <code>cutoff</code><span>frecuencia de corte del filtro</span>
      <code>resonancia</code><span>realce en el cutoff (Q)</span>
      <code>envolvente</code><span>curva en el tiempo (ADSR)</span>
      <code>LFO</code><span>oscilador lento que modula un parámetro</span>
    </div>`, { c: 'fx', tag: 'GLOSARIO' })}
  </div>`);
}
