# Plan: trigonometría, síntesis y groove

Eje paralelo al plan de 8 semanas del PDF. Pensado para arrancar en un chat nuevo:
*"Leé CLAUDE.md, este plan y docs/notas/06-practica-ritmo.md, y arrancamos la sesión 1".*

## Para qué

- Doy clases de trigonometría (5° año): quiero entender el sonido desde
  **f(x) = A·sen(Bx + C) + D** y usar la música como ejemplo en clase.
- Objetivo musical: entender cómo se construye un tema que **haga bailar**. Cómo se pone a
  "cabalgar" el groove, cómo se levanta y se suelta, cómo se van sumando voces y sonidos.
- Referencias que me gustan: **Underworld, The Chemical Brothers, Daft Punk, The Prodigy
  (Liam Howlett), Deep Dish, Nick Warren**, algo de trance (Tiësto). Lo progressive y el deep
  house plano me aburren un poco: quiero entender qué hace la diferencia.
- Todo con código (Strudel + Hydra), sin DAW: construcción artesanal del sonido.

Material de clase (fuera del repo): `Downloads/1.Radianes.pdf`, `2. Funciones seno y coseno.pdf`,
`3. Función tangente y ecuaciones trigonométricas.pdf`.

Antecedente en el repo (otra sesión): `docs/notas/04-musica-de-las-esferas.md` y
`05-armonia-visuales-y-material-propio.md` (Pitágoras, razones de frecuencia, octava cósmica,
Hydra, material propio), con los patrones `patterns/estudios/04-` a `06-`. La sesión 3 parte de ahí.

En el PDF (`docs/strudel-cheatsheet.pdf`): pág. 7 *Teoría de bolsillo*, págs. 12–13 *Trigonometría I y II*.

## Diccionario guía ↔ sinte (ya verificado en el código)

| Guía | Oscilador (sonido) | LFO (movimiento) | Strudel |
|---|---|---|---|
| \|A\| amplitud | volumen | cuánto se mueve la perilla | `.gain()` / ancho de `.range()` |
| B pulsación, período 2π/\|B\| | altura (nota) | velocidad | `freq()`, `note()` / `.slow()`, `.fast()` |
| fase −C/B | se oye al sumar 2 ondas | dónde arranca el barrido | `.early()`, `.late()` (pattern.mjs:2061, 2081) |
| D desplazamiento | — | valor central | centro de `.range()` |
| imagen [−\|A\|+D ; \|A\|+D] | — | entre qué valores se mueve | `.range(mín, máx)` = `mul(max-min).add(min)` (pattern.mjs:1771) |

- **1 ciclo = 2π**: `sine2 = sin(2πt)`, t en ciclos (signal.mjs:70). `sine` va de 0 a 1 (signal.mjs:80).
  Pasar de la guía: **ciclos = radianes / 2π**.
- `cosine = sine._early(1/4)` (signal.mjs:91) → cos x = sen(x + π/2).
- Probado en el motor: `sine.range(200,1000)` en un ciclo da 600, 883, 1000, 883, 600, 317, 200, 317.

## Sesiones

Cada una: teoría de la guía → experimento en strudel.cc (yo escucho y cuento) → patrón validado en
`patterns/estudios/trig/` → nota `docs/notas/NN-tema.md` → commit.

1. **Radianes, ciclos y la circunferencia.** Oscilador = punto que gira; período, frecuencia,
   `freq()` y `note()`. Ejercicios de la guía 1 pasados a ciclos. `._scope()` para ver la onda.
2. **A·sen(Bx+C)+D como LFO.** Ejercicios 2 y 5 de la guía 2 (ej. `2·sen(½x)+1` → `.slow(2)`,
   `sen(x+π/6)` → `.early(1/12)`) aplicados a filtro, volumen y paneo. Ecuaciones trigonométricas
   como "¿cuándo pasa el filtro por 800 Hz?".
3. **Suma de senos: armonía y batimiento.** Razones 2:1, 3:2, 4:3; `freq("220,222")` y la identidad
   suma-producto; sen²+cos²=1 y el paneo de igual potencia.
4. **Síntesis aditiva y Fourier.** Sierra = Σ sen(nωt)/n (superdough synth.mjs:466-468);
   `.n(k)` limita los parciales (synth.mjs:503); `.partials([...])` (pattern.mjs:3720) para dibujar
   espectros propios.
5. **Sustractiva, FM y AM.** Onda rica + `lpf` y su envolvente; FM = la fase C pasa a ser otra
   sinusoide (`.fm()`, `.fmh()`, controls.mjs:473-498); AM y la identidad producto-suma. Tangente:
   por qué no sirve como oscilador (y la diferencia con tanh, que sí se usa para saturar).
6. **Hydra.** `osc(freq, sync, offset)` = `sin((x + time·sync)·freq)`, una onda viajera
   (hydra-synth glsl-functions.js:24-27). Mismas sinusoides en el espacio, sincronizadas con el audio.

## Después: groove y forma (lo que hace bailar)

Escuchar temas de las referencias y desarmarlos (yo escucho, Claude propone qué buscar y cómo
reconstruirlo en Strudel):

- **Groove:** síncopa, swing (`.swing()`, `.swingBy()`, pattern.mjs:2184-2193), hats y percusión que
  "empujan", breakbeats (Chemical Brothers, Prodigy) contra 4/4 recto (Underworld, Daft Punk).
- **Tensión y suelta:** subidas con filtro que se abre (un LFO o rampa lenta: otra vez la sinusoide),
  redobles, quitar el bombo y devolverlo; sidechain / ducking (`.duckorbit()`, controls.mjs:959).
- **Forma:** frases de 4/8/16 compases, capas que entran y salen, `arrange()` (pattern.mjs:1469).
  Meta: temas de ~3 minutos tocados en vivo.
- **Melodía y armonía:** qué hace que una melodía sea pegadiza (repetición con variación, escalas,
  tensión-resolución). Se cruza con las semanas de escalas y acordes del PDF.
