import { page, card, pre, ex, hl, esc } from './h.mjs';
import { grid, roll, transpile, run, haps, sig } from './lib.mjs';

const HELLO = `setcpm(124/4)
drums: s("bd*4, [~ hh]*4, ~ cp").bank("RolandTR909")
bass:  note("<c2 c2 eb2 g1>*8").s("sawtooth").lpf(600)
chords: chord("<Cm9 Fm9>").voicing().s("triangle")
  .struct("~ x ~ ~").room(.5)
mel:   n("0 2 4 <7 6>").scale("C:minor").s("sine")
  .late(1/8).delay(.4)`;
export function cover() {
  const anatomy = `<div class="anat">
<span class="seg" style="background:#9b7bff33;color:#c7b6ff">lead:</span> <span class="seg" style="background:#ff4fa333;color:#ff9ccc">note("c3 eb3 g3 bb3")</span><span class="seg" style="background:#ffb54733;color:#ffd28a">.s("sawtooth")</span><span class="seg" style="background:#5ab0ff33;color:#a8d4ff">.lpf(800).lpq(6)</span><span class="seg" style="background:#ffb54722;color:#ffd28a">.attack(.01).release(.3)</span><span class="seg" style="background:#3ee6d133;color:#9ff5ea">.struct("x ~ x x")</span><span class="seg" style="background:#b6f24a2a;color:#d6ff8f">.room(.4).delay(.25)</span><span class="seg" style="background:#ffffff1a;color:#fff">.gain(.8)</span>
</div>`;
  const flow = `<div class="flow" style="margin-top:4px">
${[
    ['js', 'NOMBRE', 'lead:', 'canal / pista'],
    ['arm', 'QUÉ', 'note() n() chord()', 'alturas y armonía'],
    ['sin', 'CON QUÉ', '.s() .bank()', 'oscilador o sample'],
    ['fx', 'TIMBRE', '.lpf() .lpq() .lpenv()', 'filtro = VCF'],
    ['sin', 'FORMA', '.attack() .decay()…', 'envolvente = VCA'],
    ['rit', 'CUÁNDO', '.struct() .fast() …', 'ritmo y estructura'],
    ['hy', 'ESPACIO', '.room() .delay() .pan()', 'efectos (sends)'],
    ['text', 'MEZCLA', '.gain() .postgain()', 'volumen'],
  ].map(([c, b, code, d], i) => `${i ? '<span class="ar">›</span>' : ''}<div class="st" style="--sc:var(--${c})"><b>${b}</b><code>${esc(code)}</code><span class="dim small">${d}</span></div>`).join('')}
</div>`;
  const toc = [
    ['rit', 'Anatomía y modelo mental', 'la fórmula que se repite en todo tema'],
    ['js', 'Strudel por dentro (JS)', 'Pattern, Hap, register(), transpilador'],
    ['rit', 'Mini-notación', 'el lenguaje dentro de las comillas'],
    ['rit', 'Ritmo I · transformaciones', 'fast, off, euclid, iter, swing…'],
    ['rit', 'Ritmo II · grooves por género', '10 patrones de batería calculados'],
    ['arm', 'Armonía I · notas, escalas, modos', 'n().scale(), teclado, intervalos'],
    ['arm', 'Armonía II · acordes y progresiones', 'chord().voicing(), arp, bajos'],
    ['sin', 'Síntesis I · fuente y envolventes', 'osciladores, ADSR, filtro, FM'],
    ['fx', 'Síntesis II · efectos y cadena', 'orden real de superdough, sidechain'],
    ['js', 'Azar y modulación', 'señales, rand, seed, ribbon, LFOs'],
    ['arm', 'Estilos I', 'house, techno, dub techno, acid, ambient'],
    ['arm', 'Estilos II', 'DnB, trap, dembow, UK garage, lo-fi'],
    ['sin', 'Disección: el lead del video', 'línea por línea, con lo que ejecuta'],
    ['hy', 'Hydra · visuales', 'cómo se conecta con Strudel'],
    ['js', 'Referencia de fuentes + ruta', 'función → archivo:línea, plan de práctica'],
  ];
  return page('', '', 'js', `
  <div style="display:grid;grid-template-columns:1.25fr 1fr;gap:14px;flex:1">
    <div class="col" style="gap:8px;justify-content:space-between">
      <div>
        <div class="mono" style="color:var(--rit);font-size:8pt;letter-spacing:2px">LIVE CODING · MÚSICA ELECTRÓNICA · JAVASCRIPT</div>
        <div class="cover-title grad" style="margin-top:6px">STRUDEL</div>
        <div class="cover-title" style="font-size:28pt;letter-spacing:-1px;margin-top:2px">cheat sheet <span style="color:var(--dim)">de ritmo,</span><br>armonía <span style="color:var(--dim)">y</span> síntesis</div>
        <p style="color:var(--dim);font-size:8.6pt;margin-top:8px;max-width:150mm">Cada concepto musical, conectado con el método de Strudel que lo controla y con el archivo JavaScript donde vive. Todos los diagramas de patrones de este documento fueron <b style="color:var(--text)">calculados ejecutando el motor real de Strudel</b>: no son dibujos aproximados.</p>
      </div>
      ${card('La fórmula: un patrón + una cadena de métodos', `${anatomy}${flow}
      <p class="small" style="margin-top:3px">Leelo como un sinte modular de izquierda a derecha. Cada <code>.método()</code> recibe el patrón de la izquierda, le agrega una propiedad a cada evento y devuelve un patrón nuevo. Por eso podés agregar, sacar o reordenar eslabones sin romper nada.</p>`, { c: 'rit', tag: 'CLAVE' })}
      ${card('Tu primer tema: 4 capas en 7 líneas', `<div class="row" style="gap:8px;align-items:stretch"><div style="flex:1.1">${pre(HELLO)}</div><div style="flex:1" class="col">${(() => { const P = run(HELLO); return grid({ drums: P.drums }, { steps: 16, w: 300, rowH: 10, labelW: 18, order: ['bd', 'cp', 'hh'] }) + roll({ bass: P.bass, chords: P.chords, mel: P.mel }, { cycles: 2, w: 300, h: 70, names: false, colors: [1, 3, 2] }) + '<p class="small dim" style="font-size:6.4pt">arriba la batería (1 ciclo) · abajo el piano roll (2 ciclos): <span style="color:var(--arm)">bajo</span>, <span style="color:var(--js)">acordes</span>, <span style="color:var(--sin)">melodía</span></p>'; })()}</div></div>`, { c: 'arm', tag: 'START' })}
      <div class="row" style="gap:5px">
        ${card('Tempo', `<p><code>setcpm(124/4)</code> = 124 BPM en 4/4. Por defecto: <code>0.5 cps</code>, o sea 1 ciclo = 2 s ≈ 120 BPM.</p>`, { c: 'sin', style: 'flex:1' })}
        ${card('Probar', `<p>Abrí <b>strudel.cc</b>, pegá un ejemplo y apretá <code>Ctrl+Enter</code>. Con <code>Ctrl+.</code> frenás todo.</p>`, { c: 'fx', style: 'flex:1' })}
        ${card('Colores', `<div class="legend"><span class="chip" style="background:var(--rit)">ritmo</span><span class="chip" style="background:var(--arm)">armonía</span><span class="chip" style="background:var(--sin)">síntesis</span><span class="chip" style="background:var(--fx)">efectos</span><span class="chip" style="background:var(--js)">código</span><span class="chip" style="background:var(--hy)">hydra</span></div>`, { style: 'flex:1.3' })}
      </div>
    </div>
    <div class="col" style="gap:6px">
      ${card('Contenido', `<div class="toc" style="grid-template-columns:1fr">${toc.map(([c, t, d], i) => `<div><span class="n" style="color:var(--${c})">${String(i + 2).padStart(2, '0')}</span><span class="t">${t}</span><span class="d">${d}</span></div>`).join('')}</div>`, { c: 'js' })}
      ${card('Cómo usar este PDF', `<ul class="tight"><li>Primero entendé el <b>modelo mental</b> (pág. 2–3): todo lo demás son variaciones.</li><li>En cada página, el código de la izquierda produce el gráfico de la derecha. Cambiá un número y escuchá.</li><li>Los grises <span class="mono" style="color:var(--faint)">pattern.mjs:1905</span> indican dónde está la función en el código fuente de Strudel, para leerla.</li><li>Las recetas de estilos (pág. 12–13) son plantillas: copiá, rompé, rearmá.</li></ul>`, { c: 'rit' })}
      ${card('Recursos', `<div class="kv"><code>strudel.cc</code><span>el REPL: editor + motor de audio en el navegador</span><code>strudel.cc/learn</code><span>docs oficiales con ejemplos que suenan</span><code>codeberg.org/uzu/strudel</code><span>código fuente (se mudó desde GitHub)</span><code>npm @strudel/core</code><span>los paquetes que se citan acá, versión 1.2.6</span><code>hydra.ojack.xyz</code><span>Hydra: visuales en vivo (pág. 15)</span></div>`, { c: 'fx' })}
    </div>
  </div>`, { noHeader: true, acc2: 'arm' });
}

export function anatomy() {
  const bars = grid(`$: s("bd*4")
$: s("~ cp ~ cp")
$: s("[~ hh]*4")`, { steps: 16, w: 300, rowH: 16, labelW: 22, order: ['bd', 'cp', 'hh'], hit: true, colorMap: { bd: '#3ee6d1', cp: '#ff7a59', hh: '#ffb547' } });
  return page('Anatomía y modelo mental', 'Cuatro ideas explican el 90% de cualquier código de Strudel. Si entendés esta página, cualquier tema se vuelve legible.', 'rit', `
  <div class="grid" style="grid-template-columns:1fr 1fr 1fr;grid-template-rows:auto 1fr auto">
    ${card('1 · El ciclo es la unidad de tiempo', `<p>No hay compases ni negras: hay <b>ciclos</b>. Todo lo que escribís entre comillas se reparte <b>dentro de un ciclo</b>. Más elementos no significa más tiempo, significa elementos más cortos.</p>
    ${ex('s("bd sd")', '2 por ciclo', grid('s("bd sd")', { steps: 8, rows: 'single', w: 300, rowH: 14 }))}
    ${ex('s("bd sd hh cp")', '4 por ciclo', grid('s("bd sd hh cp")', { steps: 8, rows: 'single', w: 300, rowH: 14 }))}
    ${ex('s("bd sd hh cp bd sd hh cp")', '8 por ciclo', grid('s("bd sd hh cp bd sd hh cp")', { steps: 8, rows: 'single', w: 300, rowH: 14 }))}
    <p class="small dim">Con <code>setcpm(bpm/4)</code>, 1 ciclo = 1 compás de 4/4. Entonces "8 por ciclo" son corcheas y "16 por ciclo" semicorcheas.</p>`, { c: 'rit', tag: 'TIEMPO' })}
    ${card('2 · Un evento es un diccionario', `<p>Cada golpe o nota es un <b>Hap</b>: un intervalo de tiempo más un objeto de valores. Los métodos solo <b>agregan claves</b> a ese objeto. Este código:</p>
    ${pre(`note("c3 g3").s("sawtooth").lpf(800)`)}
    <p>produce, en el ciclo 0, estos dos eventos (salida real de <code>queryArc(0,1)</code>):</p>
    ${pre(haps(Object.values(run('note("c3 g3").s("sawtooth").lpf(800)'))[0], 0, 1).map((h) => `${h.b}→${h.e}  ${JSON.stringify(h.v)}`).join('\n'))}
    <p>El motor de audio (<b>superdough</b>) lee ese objeto y arma el sinte: <code>s</code> elige el oscilador, <code>cutoff</code> configura el filtro, etc. Fijate que <code>.lpf</code> se guarda como <code>cutoff</code>: muchos métodos son <b>alias</b> de un mismo parámetro.</p>`, { c: 'js', tag: 'DATOS' })}
    ${card('3 · Todo argumento puede ser un patrón', `<p>Donde va un número, también puede ir un string de mini-notación o una señal. Así se automatiza cualquier parámetro sin tocar la estructura:</p>
    ${pre(`.lpf(800)               // fijo
.lpf("<400 800 1600>")  // uno por ciclo
.lpf("400 2000")        // 2 por ciclo
.lpf(sine.range(300,3000).slow(8))
                        // LFO de 8 ciclos
.lpf(rand.range(200,1000)) // al azar`)}
    <p class="small">Esto pasa porque <code>register()</code> convierte todos los argumentos con <code>reify()</code> (los "patronifica") antes de aplicar la función. Lo ves en <span class="mono dim">pattern.mjs:1605</span>.</p>`, { c: 'arm', tag: 'PATRONES' })}
    ${card('4 · Capas en paralelo', `<p>Cada línea con <code>nombre:</code> (o <code>$:</code>) es una pista que suena a la vez que las demás. Si le ponés <code>_</code> adelante o atrás (<code>_hats:</code>), la silenciás.</p>
    ${pre(`kick:  s("bd*4")
clap:  s("~ cp ~ cp")
hats:  s("[~ hh]*4")
_bass: note("c2*8").s("sawtooth") // muteado`)}
    ${bars}
    <p class="small dim">La alternativa sin etiquetas es <code>stack()</code>, que da el mismo resultado:</p>
    ${pre(`stack(
  s("bd*4"),
  s("~ cp ~ cp"),
  s("[~ hh]*4")
)`)}
    <p class="small">Las etiquetas tienen una ventaja en vivo: cada capa se mutea por separado y se lee mejor.</p>`, { c: 'js', tag: 'CAPAS', style: 'grid-row:span 2' })}
    ${card('Del sinte de hardware a Strudel', `<table class="tight-t">
      <tr><th>Módulo</th><th>Strudel</th><th>Qué hace</th></tr>
      <tr><td>VCO / oscilador</td><td class="m">.s("sawtooth")</td><td>fuente de sonido; forma de onda = armónicos</td></tr>
      <tr><td>Sampler</td><td class="m">.s("bd").bank("RolandTR909")</td><td>reproduce grabaciones</td></tr>
      <tr><td>Teclado / secuenciador</td><td class="m">note() n() .struct()</td><td>alturas y cuándo suenan</td></tr>
      <tr><td>VCF (filtro)</td><td class="m">.lpf .hpf .bpf .lpq</td><td>esculpe el timbre</td></tr>
      <tr><td>Env. de filtro</td><td class="m">.lpenv .lpa .lpd .lps .lpr</td><td>mueve el cutoff en cada nota</td></tr>
      <tr><td>VCA + ADSR</td><td class="m">.attack .decay .sustain .release</td><td>volumen en el tiempo</td></tr>
      <tr><td>LFO</td><td class="m">sine.range(a,b).slow(n)</td><td>modulación lenta de cualquier parámetro</td></tr>
      <tr><td>FX sends</td><td class="m">.room .delay .orbit</td><td>reverb y eco por bus</td></tr>
      <tr><td>Mixer</td><td class="m">.gain .pan .postgain</td><td>nivel y posición</td></tr>
      <tr><td>Fuente de ruido</td><td class="m">s("white") s("pink") s("brown")</td><td>hats sintéticos, risers, textura</td></tr>
      <tr><td>FM / operadores</td><td class="m">.fm(4).fmh(1.5)</td><td>timbres metálicos y campanas</td></tr>
      <tr><td>Drive / saturación</td><td class="m">.distort(2) .crush(6)</td><td>calor, suciedad, lo-fi</td></tr>
      <tr><td>Arpegiador</td><td class="m">.arp("0 1 2") · n().chord().voicing()</td><td>recorre las notas del acorde</td></tr>
      <tr><td>Sample &amp; hold</td><td class="m">rand.segment(8)</td><td>valor al azar que se sostiene por paso</td></tr>
      <tr><td>Mute / solo</td><td class="m">_nombre:  ·  comentar con //</td><td>armar y desarmar el tema en vivo</td></tr>
    </table>`, { c: 'sin', tag: 'MAPA', style: 'grid-column:span 2' })}
    ${card('Cómo leer código ajeno en 3 pasadas', `<div class="row" style="gap:10px;align-items:flex-start">
      <div style="flex:1"><p><b style="color:var(--js)">1 · Capas.</b> Buscá las etiquetas <code>nombre:</code> / <code>$:</code> o los <code>stack()</code>. Cada una es un instrumento. Muteá todas menos una (<code>_nombre:</code>) y escuchala sola.</p></div>
      <div style="flex:1"><p><b style="color:var(--arm)">2 · Esqueleto.</b> En cada capa, encontrá el <b>QUÉ</b> (<code>note/n/chord/s</code>), el <b>CON QUÉ</b> (<code>.s()</code>) y el <b>CUÁNDO</b> (mini-notación, <code>struct</code>, <code>fast</code>). Eso ya es la canción.</p></div>
      <div style="flex:1"><p><b style="color:var(--sin)">3 · Adornos.</b> Lo demás es timbre (filtro, envolvente), espacio (room, delay) y variación (<code>rand</code>, <code>sometimes</code>, <code>every</code>). Borrá adornos de a uno para entender qué aporta cada uno.</p></div>
    </div>`, { c: 'js', tag: 'MÉTODO', style: 'grid-column:span 2' })}
  </div>`);
}

export function internals() {
  const code = `lead: s("saw").chord("G#m9").voicing()
  .lpf(rand.seed(3).range(200, 1000))`;
  const out = transpile(code).replace(/;$/, '');
  return page('Strudel por dentro: el JavaScript', 'Lo que pasa entre que apretás Ctrl+Enter y suena. Saber esto explica por qué el código se escribe como se escribe.', 'js', `
  <div class="grid" style="grid-template-columns:1.05fr 1fr 1fr;grid-template-rows:auto auto 1fr;grid-template-areas:'pipe trans class' 'sig meth ctrl' 'sig pkg pkg'">
    ${card('El viaje de tu código', `<div class="flow" style="flex-direction:column;gap:3px">
      ${[
        ['js', '1 · Transpilador', '@strudel/transpiler', 'Reescribe tu código antes de ejecutarlo. Convierte <code>"…"</code> y <code>`…`</code> en <code>mini(…)</code> y <code>lead:</code> en <code>.p("lead")</code>.'],
        ['rit', '2 · Mini-notación', '@strudel/mini · krill.pegjs', 'Una gramática PEG parsea el texto <code>"bd*2 [sd hh]"</code> a un árbol, y <code>patternifyAST</code> lo convierte en Pattern.'],
        ['arm', '3 · Pattern', '@strudel/core · pattern.mjs', 'Un Pattern es <b>una función</b> <code>query(span) → Hap[]</code>. No guarda eventos: los <b>calcula</b> cuando alguien pregunta.'],
        ['fx', '4 · Scheduler', 'cyclist.mjs', 'Cada ~50 ms pregunta "¿qué eventos hay en esta ventana?" con <code>queryArc(t0, t1)</code>.'],
        ['sin', '5 · superdough', 'superdough.mjs · synth.mjs', 'Recibe el objeto <code>{s, note, cutoff…}</code> y construye nodos de WebAudio: oscilador, filtro, envolvente, efectos.'],
      ].map(([c, t, f, d]) => `<div class="st" style="--sc:var(--${c})"><b>${t} <span class="mono" style="font-size:5.6pt;color:var(--faint);font-weight:400">${f}</span></b><span class="small">${d}</span></div>`).join('')}
    </div>`, { c: 'js', tag: 'PIPELINE', style: 'grid-area:pipe' })}
    ${card('Lo que escribís vs. lo que se ejecuta', `${pre(code)}
    <p class="small dim">↓ salida real de <code>transpiler()</code>:</p>
    ${pre(out.replace(/\)\./g, ')\n  .'))}
    <ul class="tight small">
      <li><code>"comillas dobles"</code> y <code>\`backticks\`</code> se convierten en <b>mini-notación</b> (<code>m()</code>).</li>
      <li><code>'comillas simples'</code> quedan como <b>string normal</b> de JS. Sirve para nombres, por ejemplo <code>.ftype('ladder')</code>.</li>
      <li>Los backticks permiten patrones multilínea, como en el video.</li>
      <li><code>nombre:</code> es una <i>label</i> de JS; el transpilador la cambia por <code>.p('nombre')</code>, que registra la pista en el REPL (<span class="mono">repl.mjs:171</span>).</li>
    </ul>`, { c: 'rit', tag: 'TRANSPILER', src: 'transpiler.mjs:71-118', style: 'grid-area:trans' })}
    ${card('Las clases', `<div class="kv">
      <code>Pattern</code><span>La clase central. <code>new Pattern(query)</code>. Todos los métodos viven en <code>Pattern.prototype</code>. <span class="mono dim">pattern.mjs:45</span></span>
      <code>Hap</code><span>Un evento: <code>whole</code> (duración completa), <code>part</code> (fragmento visible), <code>value</code> (el diccionario), <code>context</code>. Se llama "Hap" porque <i>Event</i> ya existe en JS. <span class="mono dim">hap.mjs:9</span></span>
      <code>TimeSpan</code><span>Intervalo [begin, end) en ciclos. <span class="mono dim">timespan.mjs:9</span></span>
      <code>Fraction</code><span>Los tiempos son <b>fracciones exactas</b> (1/3 es 1/3, no 0.333…). Así no hay deriva. <span class="mono dim">fraction.mjs</span></span>
      <code>State</code><span>Contexto de la consulta: controles, semillas. <span class="mono dim">state.mjs:7</span></span>
      <code>Cyclist</code><span>El reloj/scheduler (cps por defecto 0.5). <span class="mono dim">cyclist.mjs:10</span></span>
    </div>`, { c: 'arm', tag: 'CLASES', style: 'grid-area:class' })}
    ${card('¿Cómo nace un método? register()', `${pre(`// pattern.mjs:1905 — así está definido .ply()
export const ply = register('ply',
  function (factor, pat) {
    const result = pat
      .fmap((x) => pure(x)._fast(factor))
      .squeezeJoin();
    ...
  });`)}
    <p class="small"><code>register(nombre, fn)</code> hace tres cosas: (1) crea la función suelta <code>ply(2, pat)</code>, (2) agrega el método <code>pat.ply(2)</code> al prototipo, y (3) "patronifica" los argumentos para que <code>.ply("&lt;1 2 4&gt;")</code> funcione. El <b>último argumento siempre es el patrón</b>; por eso <code>.rarely(ply(2))</code> anda: <code>ply(2)</code> sin patrón devuelve una función que espera uno (currying).</p>`, { c: 'js', tag: 'MÉTODOS', src: 'pattern.mjs:1605', style: 'grid-area:meth' })}
    ${card('Controles: registerControl()', `${pre(`// controls.mjs:1204
export const { cutoff, ctf, lpf, lp } =
  registerControl(['cutoff','resonance','lpenv'],
                  'ctf', 'lpf', 'lp');`)}
    <p class="small">Los <b>controles</b> (sonido, filtro, efectos) son métodos que solo escriben una clave en el diccionario del evento. <code>lpf</code>, <code>lp</code> y <code>ctf</code> son <b>alias</b> de <code>cutoff</code>. La lista <code>['cutoff','resonance','lpenv']</code> permite escribir <code>.lpf("800:10:4")</code> para cargar cutoff, resonancia y envolvente de una sola vez.</p>
    <div class="note" style="--c:var(--rit)"><b>Composers.</b> <code>.set .add .sub .mul .keep .keepif</code> combinan dos patrones. Con <code>.in</code>, <code>.out</code>, <code>.mix</code>, <code>.squeeze</code> o <code>.reset</code> elegís <b>de cuál sale el ritmo</b>. <code>.set.out(p)</code> = "tomá los valores de p <b>y también su ritmo</b>" (<span class="mono">pattern.mjs:1020</span>).</div>`, { c: 'fx', tag: 'CONTROLES', src: 'controls.mjs:63', style: 'grid-area:ctrl' })}
    ${card('Señales: patrones continuos', `${pre(`// signal.mjs
const signal = (func) => …            // :18
const saw  = signal((t) => t % 1)     // :35
const sine = sine2.fromBipolar()      // :80
const rand = signal((t, ctl) =>       // :449
  getRandsAtTime(t, 1, …))`)}
    <p class="small">Una señal no tiene eventos: es un <b>valor para cada instante</b>. Toma la forma del patrón al que la aplicás (<code>.lpf(sine…)</code> lee la señal en el inicio de cada nota) o la discretizás con <code>.segment(16)</code>. <code>rand</code> no es <code>Math.random()</code>: es un <b>hash del tiempo</b>. El mismo instante da siempre el mismo valor, y por eso <code>.seed()</code> y <code>.ribbon()</code> pueden "congelar" el azar.</p>
    <div style="display:grid;grid-template-columns:repeat(3,1fr);gap:4px">${[['sine', 'sine', 0], ['saw', 'saw', 2], ['rand.segment(16)', 'rand.segment(16)', 1]].map(([c, l, i]) => `<div><code class="small" style="background:none;padding:0">${l}</code>${sig(c, { cycles: 2, w: 120, h: 40, color: ['#3ee6d1', '#ff4fa3', '#ffb547'][i], dots: c.includes('segment') })}</div>`).join('')}</div>
    <p class="small dim">2 ciclos de cada señal, consultadas a Strudel. Rango 0..1; con <code>.range(a,b)</code> lo llevás a cualquier escala.</p>`, { c: 'arm', tag: 'SEÑALES', style: 'grid-area:sig' })}
    ${card('El ecosistema: paquetes npm', `<div style="display:grid;grid-template-columns:1fr 1fr;gap:0 12px"><div class="small" style="font-size:6.7pt;line-height:1.3"><code style="background:none;padding:0;color:var(--js);font-weight:600">@strudel/core</code> · Pattern, tiempo, controles, señales, azar <span class="mono" style="color:var(--faint);font-size:6.2pt">fast stack every rand sine s note lpf</span></div><div class="small" style="font-size:6.7pt;line-height:1.3"><code style="background:none;padding:0;color:var(--js);font-weight:600">@strudel/mini</code> · parser de mini-notación (PEG) <span class="mono" style="color:var(--faint);font-size:6.2pt">mini m "…"</span></div><div class="small" style="font-size:6.7pt;line-height:1.3"><code style="background:none;padding:0;color:var(--js);font-weight:600">@strudel/transpiler</code> · reescribe tu código (strings → mini, labels → .p) <span class="mono" style="color:var(--faint);font-size:6.2pt">transpiler evaluate</span></div><div class="small" style="font-size:6.7pt;line-height:1.3"><code style="background:none;padding:0;color:var(--js);font-weight:600">@strudel/tonal</code> · teoría musical (usa tonal.js) <span class="mono" style="color:var(--faint);font-size:6.2pt">scale chord voicing transpose arp rootNotes</span></div><div class="small" style="font-size:6.7pt;line-height:1.3"><code style="background:none;padding:0;color:var(--js);font-weight:600">superdough</code> · el sinte/sampler de WebAudio y los efectos <span class="mono" style="color:var(--faint);font-size:6.2pt">osciladores, ADSR, filtros, reverb, delay</span></div><div class="small" style="font-size:6.7pt;line-height:1.3"><code style="background:none;padding:0;color:var(--js);font-weight:600">@strudel/webaudio</code> · conecta los patrones con superdough · osciloscopios <span class="mono" style="color:var(--faint);font-size:6.2pt">scope spectrum samples</span></div><div class="small" style="font-size:6.7pt;line-height:1.3"><code style="background:none;padding:0;color:var(--js);font-weight:600">@strudel/draw</code> · visualizaciones en canvas <span class="mono" style="color:var(--faint);font-size:6.2pt">pianoroll punchcard spiral pitchwheel</span></div><div class="small" style="font-size:6.7pt;line-height:1.3"><code style="background:none;padding:0;color:var(--js);font-weight:600">@strudel/hydra</code> · puente con Hydra (visuales) <span class="mono" style="color:var(--faint);font-size:6.2pt">initHydra H</span></div></div>`, { c: 'js', tag: 'PAQUETES', style: 'grid-area:pkg' })}
  </div>`);
}

export function mininotation() {
  const items = [
    ['s("bd sd hh")', 'secuencia: divide el ciclo en partes iguales', 1, 'seq(s("bd"), s("sd"), s("hh"))'],
    ['s("bd [sd sd] hh")', '[ ] subdivide un paso', 1, 'seq(s("bd"), seq(s("sd"), s("sd")), s("hh"))'],
    ['s("bd sd . hh hh hh")', '. agrupa sin corchetes', 1, 's("[bd sd] [hh hh hh]")'],
    ['s("bd*2 sd")', '*n repite más rápido', 1, 'seq(s("bd").fast(2), s("sd"))'],
    ['s("bd sd/2")', '/n más lento: aparece cada n ciclos', 2, 'seq(s("bd"), s("sd").slow(2))'],
    ['s("<bd sd cp>")', '< > alterna uno por ciclo', 3, 'cat(s("bd"), s("sd"), s("cp"))'],
    ['s("bd ~ sd -")', '~ o - silencio', 1, 'seq(s("bd"), silence, s("sd"), silence)'],
    ['s("bd _ _ sd")', '_ estira el evento anterior', 1, 's("bd@3 sd")'],
    ['s("bd@3 sd")', '@n peso (duración relativa)', 1, 'stepcat([3, s("bd")], [1, s("sd")])'],
    ['s("bd!3 sd")', '!n replica el paso n veces', 1, 'seq(s("bd"), s("bd"), s("bd"), s("sd"))'],
    ['s("hh*16?")', '? 50% de probabilidad (?0.2 = 20%)', 1, 's("hh*16").degradeBy(0.5)'],
    ['s("bd(3,8)")', '(k,n) ritmo euclídeo: k golpes en n pasos', 1, 's("bd").euclid(3, 8)'],
    ['s("bd(3,8,2)")', '(k,n,r) euclídeo rotado r pasos', 1, 's("bd").euclidRot(3, 8, 2)'],
    ['s("bd*4, hh*8")', ', apila capas (polifonía)', 1, 'stack(s("bd*4"), s("hh*8"))'],
    ['s("{bd sd, hh hh hh}")', '{ } polimetría: alinea el paso, no el ciclo', 2, 'stack(s("bd sd").pace(2), s("hh hh hh").pace(2))'],
    ['s("{bd sd hh}%4")', '{ }%n n pasos por ciclo, recorre la lista', 2, 's("bd sd hh").pace(4)'],
    ['n("0 .. 3")', '.. rango de números', 1, 'n(run(4))'],
    ['s("bd | sd | cp")', '| elige una opción al azar por ciclo', 4, '≈ randcat(…) (azar por ciclo)'],
  ];

  const cell = ([c, d, cy, eq]) => {
    const multi = /, |\{bd sd,/.test(c);
    return `<div class="ex" style="background:var(--panel);border:1px solid #1f2535;border-radius:7px;padding:4px 6px;align-content:start;gap:2px;display:flex;flex-direction:column"><code style="background:none;padding:0;font-size:8pt;font-weight:600">${hl(c)}</code><span class="small dim" style="line-height:1.2">${d}</span>${grid(c, { cycles: cy, steps: cy > 2 ? 4 : 8, rows: multi ? 'auto' : 'single', w: 230, rowH: multi ? 15 : 34, labelW: multi ? 16 : 0 })}<div style="margin-top:auto;padding-top:2px;border-top:1px dashed #262e42"><span class="mono" style="font-size:5.8pt;color:var(--faint)">JS ≡ </span><code style="background:none;padding:0;font-size:6.4pt">${hl(eq)}</code></div></div>`;
  };
  return page('Mini-notación', 'El lenguaje que va entre comillas dobles. Cada caja muestra el símbolo y los eventos reales que genera (cada rectángulo es un evento; el ancho es su duración).', 'rit', `
  <div class="grid" style="grid-template-columns:repeat(4,1fr);grid-template-rows:repeat(5,1fr);gap:5px">
    ${items.map(cell).join('')}
    ${card('Valores con ":"', `<p class="small dim" style="margin-bottom:2px">verificado: cada equivalencia JS ≡ produce exactamente los mismos eventos.</p><p><code>"bd:3"</code> elige el sample nº 3 del banco <i>bd</i>. <code>"c3:0.5"</code> + <code>.as("note:gain")</code> carga dos parámetros a la vez.</p>`, { c: 'rit' })}
    ${card('Anidar', `<p>Todo se combina: <code>"&lt;bd [bd bd]&gt;*2 [~ sd]@2 hh(3,8)"</code>. Un <code>&lt; &gt;</code> adentro de <code>[ ]</code> alterna en cada pasada.</p>${grid('s("<bd [bd bd]>*2 [~ sd]@2 hh(3,8)")', { cycles: 2, steps: 8, w: 230, rowH: 14, labelW: 16 })}`, { c: 'rit' })}
  </div>`);
}

export function rhythm1() {
  const T = (c, d, o = {}) => card(`<code style="background:none;padding:0;color:var(--text);font-size:7pt">${hl(c)}</code>`, `<p class="small dim">${d}</p>${grid(c, { cycles: o.cy || 1, steps: o.steps || 8, rows: o.rows || 'single', w: 240, rowH: o.rowH || 26, labelW: 0 })}`, { c: 'rit', src: o.src });
  const base = 's("bd sd hh cp")';
  return page('Ritmo I · transformaciones temporales', 'Métodos que reescriben el CUÁNDO. Todos toman un patrón y devuelven otro, así que se encadenan. Gráficos calculados con Strudel.', 'rit', `
  <div class="grid" style="grid-template-columns:repeat(4,1fr);grid-template-rows:repeat(4,1fr) auto;gap:4px">
    ${T(base, 'el original: 4 pasos por ciclo', { src: 'patrón base' })}
    ${T(base + '.fast(2)', 'comprime ×2: entra dos veces por ciclo', { src: 'pattern.mjs:1924' })}
    ${T(base + '.slow(2)', 'estira ×2: ocupa dos ciclos', { cy: 2, src: 'pattern.mjs:1958' })}
    ${T(base + '.rev()', 'invierte el orden dentro del ciclo', { src: 'pattern.mjs:2259' })}
    ${T(base + '.ply(2)', 'cada evento se repite n veces en su lugar', { src: 'pattern.mjs:1905' })}
    ${T(base + '.iter(4)', 'rota el comienzo en cada ciclo', { cy: 2, src: 'pattern.mjs:2499' })}
    ${T(base + '.every(2, x=>x.fast(2))', 'aplica la función cada n ciclos (alias de firstOf)', { cy: 2, src: 'pattern.mjs:2022' })}
    ${T(base + '.palindrome()', 'ida y vuelta: alterna normal y rev', { cy: 2, src: 'pattern.mjs:2340' })}
    ${T('s("bd*4").struct("x ~ x x")', 'impone un ritmo: x = suena, ~ = silencio', { src: 'composers' })}
    ${T('s("hh*8").mask("1 0 1 1")', 'apaga zonas sin cambiar la grilla', { src: 'composers' })}
    ${T('s("hh*8").swingBy(1/3, 4)', 'swing: atrasa la 2ª mitad de cada 1/4', { src: 'pattern.mjs:2184' })}
    ${T('s("bd sd").late(0.125)', 'corre todo hacia atrás (early = adelanta)', { src: 'pattern.mjs:2081' })}
    ${T('s("bd").euclid(5, 8)', 'k golpes repartidos en n pasos (Bjorklund)', { src: 'euclid.mjs:138' })}
    ${T('s("bd").beat("0,3,6,10,12", 16)', 'golpes en posiciones exactas de una grilla', { steps: 16, src: 'pattern.mjs:3521' })}
    ${T(base + '.linger(0.25)', 'repite el primer cuarto: efecto "stutter"', { src: 'pattern.mjs:2151' })}
    ${T('n("0 1 2 3").chunk(4, x=>x.add(n(7)))', 'transforma 1 de n trozos, uno distinto por ciclo', { cy: 2, src: 'pattern.mjs:2571' })}
    ${card('Desfase y capas', `${pre(`n("0 2 4 6")
  .off(1/8, x=>x.add(n(7)))
  .scale("C:minor")`)}${roll('n("0 2 4 6").off(1/8, x=>x.add(n(7))).scale("C:minor")', { cycles: 1, h: 110, w: 240 })}
    <p class="small">Copia el patrón corrido 1/8 de ciclo y 7 grados más arriba (= una octava en una escala de 7 notas). </p><p class="small dim"><code>off</code> = <code>superimpose</code> + <code>late</code> (<span class="mono">pattern.mjs:2236</span>). <code>jux(rev)</code> pone el original a la izquierda y la versión transformada a la derecha (<span class="mono">:2379</span>).</p>`, { c: 'rit', tag: 'CAPAS' })}
    ${card('Parámetros que cambian por ciclo', `${pre(`s("bd sd hh cp")
  .fast("<1 2 4>")  // ×1, ×2, ×4`)}${grid('s("bd sd hh cp").fast("<1 2 4>")', { cycles: 3, steps: 4, rows: 'single', w: 240, rowH: 22 })}
    ${pre(`s("bd*4").every(4, x=>x.ply(2))`)}${grid('s("bd*4").every(4, x=>x.ply(2))', { cycles: 2, steps: 8, rows: 'single', w: 240, rowH: 18 })}`, { c: 'rit', tag: 'PATRONES' })}
    ${card('Reglas de oro del ritmo', `<ul class="tight">
      <li><b>fast/slow</b> cambian la densidad; <b>ply</b> cambia la densidad <i>sin</i> mover los golpes.</li>
      <li><b>struct</b> y <b>mask</b> separan el <i>qué</i> del <i>cuándo</i>: definís notas por un lado y ritmo por el otro (eso hace el <code>.set.out</code> del video).</li>
      <li><b>every / iter / chunk / palindrome</b> generan variación por ciclo: evitan que un loop canse.</li>
      <li>Los argumentos también son patrones: <code>.fast("&lt;1 2 [4 8]&gt;")</code>.</li>
      <li>Ojo: <code>.add(7)</code> sobre <code>n(...)</code> no funciona (es un "control pattern"). Usá <code>.add(n(7))</code> o sumá adentro: <code>n("0 2".add(7))</code>.</li>
    </ul>
    <table style="margin-top:4px">
      <tr><th>Figura</th><th>Fracción de ciclo</th><th>Mini-notación (1 ciclo = 1 compás)</th><th>Método</th></tr>
      <tr><td>Redonda</td><td class="m">1</td><td class="m">"bd"</td><td class="m">.slow(1)</td></tr>
      <tr><td>Negras</td><td class="m">1/4</td><td class="m">"bd*4"</td><td class="m">.fast(4)</td></tr>
      <tr><td>Corcheas</td><td class="m">1/8</td><td class="m">"hh*8" · contratiempo: "[~ hh]*4"</td><td class="m">.late(1/8)</td></tr>
      <tr><td>Semicorcheas</td><td class="m">1/16</td><td class="m">"hh*16"</td><td class="m">.ply(2) sobre corcheas</td></tr>
      <tr><td>Tresillos de negra</td><td class="m">1/6</td><td class="m">"hh*6" · "[hh hh hh]*2"</td><td class="m">.fast(6)</td></tr>
      <tr><td>Puntillo (3+3+2)</td><td class="m">3/8 3/8 2/8</td><td class="m">"bd@3 bd@3 bd@2" = "bd(3,8)"</td><td class="m">.euclid(3,8)</td></tr>
      <tr><td>Compás de 3/4</td><td class="m">1/3</td><td class="m">"bd hh hh" + setcpm(bpm/3)</td><td class="m">—</td></tr>
    </table>`, { c: 'rit', tag: 'TIPS', style: 'grid-column:span 2' })}
  </div>`);
}

export const GROOVES = [
  ['House / Disco', 124, 'four-on-the-floor, palmas en 2 y 4, hat abierto a contratiempo. Probá .bank("RolandTR909").', `$: s("bd*4")
$: s("~ cp ~ cp")
$: s("[~ oh]*4")
$: s("hh*16").gain(.4)`, `note("[~ c2]*4")
  .s("sawtooth").lpf(500)`],
  ['Techno', 132, 'bombo continuo, hats en semicorcheas con hueco en el tiempo, rim sincopado.', `$: s("bd*4")
$: s("cp").beat("4,12", 16)
$: s("[~ hh hh hh]*4")
$: s("rim").beat("2,7,10", 16)`, `note("c1*16").s("sawtooth")
  .lpf(sine.range(200,800)
    .slow(8))
  .decay(.1).sustain(0)`],
  ['Breakbeat (Amen-ish)', 136, 'bombo sincopado y caja desplazada: el corazón del jungle y el big beat.', `$: s("bd").beat("0,2,10,11", 16)
$: s("sd").beat("4,7,9,12,15", 16)
$: s("hh*8")`, `note("<c2 [~ c2] bb1 g1>")
  .s("square").lpf(800)`],
  ['Drum & Bass', 174, 'two-step: bombo en el 1 y en el "y" del 3, caja en 2 y 4.', `$: s("bd").beat("0,10", 16)
$: s("sd").beat("4,12", 16)
$: s("hh*8")`, `note("<c1 eb1>/2")
  .s("supersaw")
  .lpf(300).lpq(5) // reese`],
  ['Trap / Hip-hop', 140, 'half-time: la caja cae en el 3. Los hats hacen redobles con ply.', `$: s("bd").beat("0,7,10", 16)
$: s("sd").beat("8", 16)
$: s("hh*8")
  .ply("<1 [1 1 1 2] 1 [1 3]>")`, `note("c1").beat("0,7,10",16)
  .s("sine") // 808
  .decay(.8).sustain(0)`],
  ['Dembow / Reggaetón', 95, 'bombo en negras + caja en tresillo 3-3-2 (x··x··x·).', `$: s("bd*4")
$: s("[~ ~ ~ sd ~ ~ sd ~]*2")
$: s("hh*8").gain(.5)`, `note("<a1 f1 c2 g1>")
  .s("sawtooth").lpf(600)
  .struct("x ~ ~ x ~ ~ x ~")`],
  ['UK Garage / 2-step', 132, 'bombo que saltea el 3 y hats con swing marcado.', `$: s("bd").beat("0,10", 16)
$: s("~ sd ~ sd")
$: s("hh*8").swingBy(1/3, 4)`, `chord("<Fm9 Bbm9>")
  .voicing().s("sawtooth")
  .struct("~ x ~ ~ x ~ ~ ~")
  .lpf(1500)`],
  ['Dub Techno', 118, 'bombo suave y hats a contratiempo; el groove lo dan los acordes con delay (pág. 12).', `$: s("bd*4")
$: s("[~ hh]*4")
$: s("rim").beat("6", 16)`, `chord("Cm7").voicing()
  .s("sawtooth").lpf(700)
  .struct("~ x ~ ~")
  .delay(.6).room(.7)`],
  ['Afro / Tresillo', 120, 'el tresillo (3,8) y la clave de son (5,16): ritmos euclídeos.', `$: s("bd(3,8)")
$: s("rim(5,16,2)")
$: s("hh*8")`, `n("0 2 4 [2 4]")
  .scale("D:dorian")
  .s("triangle").fast(2)`],
  ['Electro', 128, 'herencia de la 808: bombo sincopado, caja en 2 y 4, hats acentuados.', `$: s("bd").beat("0,3,6,10", 16)
$: s("~ sd ~ sd")
$: s("hh*16").gain("[.4 .8]*8")`, `note("c2 c2 [c3 c2] eb2")
  .s("square").lpf(1200)
  .decay(.2).sustain(0)`],
];
const DRUMC = { bd: '#3ee6d1', sd: '#ff4fa3', cp: '#ff7a59', rim: '#9b7bff', hh: '#ffb547', oh: '#f2e94e' };
export function rhythm2() {
  const order = ['bd', 'sd', 'cp', 'rim', 'hh', 'oh'];
  return page('Ritmo II · grooves por género', 'Patrones de batería en una grilla de 16 pasos (1 ciclo = 1 compás). Las columnas claras marcan los tiempos 1-2-3-4. La opacidad indica el gain.', 'rit', `
  <div class="grid" style="grid-template-columns:repeat(5,1fr);grid-template-rows:1fr 1fr auto;gap:4px">
    ${GROOVES.map(([name, bpm, d, code, add]) => card(name, `${grid(code, { steps: 16, w: 200, rowH: 15, labelW: 17, order, colorMap: DRUMC, hit: true })}${pre(code)}<p class="small dim">${d}</p><p class="small" style="margin-top:auto"><b style="color:var(--arm)">Sumale un bajo o acordes:</b></p>${pre(add).replace('<pre class="">', '<pre style="--c:var(--arm)">')}`, { c: 'rit', cls: 'genre', tag: '', style: '--c:var(--rit)' }).replace('</h3>', `<span class="bpm">${bpm} BPM</span></h3>`)).join('')}
    ${card('Cómo sonar a máquina real', `<div class="row" style="gap:14px;align-items:flex-start"><ul class="tight" style="flex:1"><li><code>.bank("RolandTR909")</code> house y techno · <code>"RolandTR808"</code> trap, electro y dembow · <code>"LinnDrum"</code> pop 80s. Por ejemplo: <code>s("bd*4").bank("RolandTR909")</code>.</li><li>Las abreviaturas son estándar: <code>bd</code> bombo, <code>sd</code> caja, <code>hh</code>/<code>oh</code> hat cerrado/abierto, <code>cp</code> palmas, <code>rim</code> aro, <code>lt mt ht</code> toms, <code>cr rd</code> platos.</li></ul><ul class="tight" style="flex:1"><li><b>Velocity humana:</b> <code>.gain("[.8 .5 .7 .5]*4")</code> o <code>.velocity(rand.range(.6,1))</code>.</li><li><b>Groove:</b> <code>.swingBy(1/6, 4)</code> sutil, <code>1/3</code> marcado. <code>.nudge(0.01)</code> retrasa unos milisegundos.</li><li><b>Variación:</b> <code>.sometimes(x=>x.ply(2))</code>, <code>.every(4, x=>x.fast(2))</code> para el fill del 4º compás.</li></ul><ul class="tight" style="flex:1"><li><b>Sidechain:</b> <code>.duckorbit(2)</code> en el bombo hace "respirar" a lo que suena en el orbit 2 (pág. 10).</li><li><b>BPM:</b> <code>setcpm(132/4)</code> al principio del código.</li><li>La grilla de 16 pasos es solo una convención: <code>"bd(5,12)"</code> también vale.</li></ul></div>`, { c: 'rit', tag: 'TIPS', style: 'grid-column:span 5' })}
  </div>`);
}
