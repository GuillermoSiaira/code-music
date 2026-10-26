# Práctica de ritmo y mini-notación (semana 1)

Primera práctica guiada en strudel.cc. Patrón con todo lo hecho:
`patterns/estudios/07-ritmo-semana1.js`.

## Tempo: `setcpm`

- Strudel mide en **ciclos**, no en pulsos. `setcpm` = ciclos por minuto. No existe `setbpm`.
- Si 1 ciclo = 1 compás de 4/4: **`setcpm(BPM/4)`**. Ej.: `setcpm(120/4)`, `setcpm(174/4)`.
  Lo dice el propio código: `setcpm(140/4) // =140 bpm in 4/4` (repl.mjs:129).
- Por dentro pasa todo a ciclos por segundo: `scheduler.setCps(cpm / 60)` (repl.mjs:132).
  `setcps(0.5)` = `setcpm(30)` = 120 BPM en 4/4 (el default).
- El tempo es **global**. Cada pista "desdobla" el tiempo a su manera: más pasos, `*`, `.fast()`
  (pattern.mjs:1925), `.slow()` (pattern.mjs:1958). Un solo metrónomo, cada instrumento toca su figura.

## Atajos de strudel.cc (@strudel/codemirror 1.2.6, codemirror.mjs:104-120)

| Atajo | Qué hace |
|---|---|
| `Ctrl+Enter` / `Alt+Enter` | **evaluar**: arranca, o aplica cambios sin cortar |
| `Ctrl+.` / `Alt+.` | parar |

Ctrl+Enter **no es play/pausa**: reevalúa. Probado: en mi teclado andan las cuatro.
El paquete codemirror no está en el repo: https://unpkg.com/@strudel/codemirror@1.2.6/codemirror.mjs

## Lo que practiqué

| # | Tema | Ejemplo | Lo que entendí |
|---|---|---|---|
| 1 | pasos parejos | `s("bd hh sd hh bd hh sd hh")` | 8 pasos = corcheas. Suena "más rápido" por la subdivisión y porque el sd pasa del 3 (half-time) al 2 y 4 (backbeat) |
| 2 | `[ ]` y `*` | `s("hh*2 hh*2 hh*3 hh*4")` | subdividen **un paso**. 12 golpes por ciclo = tresillos de corchea |
| 3 | `-`/`~` y `< >` | `s("<bd*4 [bd bd bd [bd bd]]>")` | `< >` = uno por **ciclo** (lista de compases). Los `[ ]` agrupan un compás como un solo elemento |
| 4 | euclidianos | `s("bd(<3 5>,8)")`, `s("rim(3,8,3)")` | (golpes, pasos, rotación). La rotación corre el dibujo a la derecha: `rotate(b, -rotation)` (euclid.mjs:133) |

- `-` es silencio igual que `~` (mini.mjs:157). Es una sola tecla, más cómodo en vivo.
  `~` en teclado latinoamericano: `AltGr` + `+`.
- `[ ]` reparte el espacio que le toca: dentro de un paso da semicorcheas; si `< >` le da el ciclo
  entero, da negras.
- `< >` rota entre **las opciones que tenga adentro**: 2 opciones = cada 2 compases, 4 = cada 4
  (fin de frase).

## Errores comunes (me pasaron)

1. **Dos líneas sueltas sin `$:` → suena solo la última.** El transpilador le pone `return` solo a la
   última expresión. Solución: una pista por línea con `$:`.
2. **`_s("bd")` no mutea, es un error** (`_s is not defined`) y no se evalúa nada. El `_` mutea
   **pistas**: `_$:` o `_nombre:`.
3. **`-sd` pegado** → busca un sample llamado "-sd" (`sound -sd not found`). El silencio necesita
   espacio: `- sd`. Con corchetes no hace falta: `<-[sd sd]>` funciona.
4. **`" sd  sd"`** son 2 pasos (los espacios de más no cuentan): sd en 1 y 3. El backbeat es `- sd - sd`.
5. **Error de parseo** (`parse error at line N`) → el código nuevo no entra y **sigue sonando lo
   anterior**. Hábito: si algo no cambia, mirar la pestaña *console*.

## Dudas que salieron en el camino

- **¿Dónde busco `archivo.mjs:línea`?** Los paquetes `core`, `mini`, `tonal` y `transpiler` están en
  `tools/cheatsheet/node_modules/@strudel/`. `codemirror` y `superdough` no están en el repo: se
  ven en `https://unpkg.com/<paquete>@<versión>/<archivo>`.
- **¿Strudel tiene sintes visuales como Serum?** No: el sonido se arma con código. Para ver hay
  visualizadores (`.pianoroll()`, `.punchcard()`, `.scope()`, `.fscope()`, `.spiral()`; con `_`
  adelante se dibujan en la línea) y faders en el código con `slider(valor, mín, máx)`
  (transpiler.mjs:412). Visuales generativas: Hydra.
- **Wavetables (video "Strudel Live Coding #43", Serum 2):** Strudel corta un .wav en ondas de 2048
  muestras (superdough wavetable.mjs:48-61), solo acepta .wav (wavetable.mjs:160), el nombre debe
  empezar con `wt_` (sampler.mjs:362) y `.wt(0..1)` elige la posición (controls.mjs:121). Por eso
  "Export All" en un solo archivo. Probar: `s("squelch").bank("wt_digital").note("F1").wt(sine.range(0,1).slow(4))`.
- **Trigonometría y sonido:** da para un eje propio → `docs/plan-trigonometria-y-sintesis.md`.

## Pendiente de la semana 1

- [ ] Ejercicio 5: capas con nombre (`kick:`, `hats:`, `bass:`) y mute por nombre (`_kick:`).
- [ ] Ejercicio 6: copiar y modificar `patterns/grooves/01-house-disco.js`.
- [ ] Desafío final: house de 3 capas escrito de memoria, guardado en `patterns/estudios/`.
- [ ] Probar los visualizadores `._scope()` y `._pianoroll()` y un `slider()`.
