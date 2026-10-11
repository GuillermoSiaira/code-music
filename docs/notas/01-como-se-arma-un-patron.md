# Cómo se arma un patrón en Strudel

## La fórmula: un patrón + una cadena de métodos

```js
note("c3 eb3 g3 bb3")   // 1. QUÉ suena: el patrón (notas y ritmo)
  .s("sawtooth")         // 2. CON QUÉ suena: oscilador o sample
  .lpf(800)              // 3. TIMBRE: filtro
  .attack(0.01)          // 4. FORMA: envolvente
  .decay(0.2).sustain(0.3).release(0.5)
  .room(0.4)             // 5. ESPACIO: efectos
  .gain(0.8)             // 6. MEZCLA: volumen
```

Cada `.metodo()` toma el patrón de la izquierda, le agrega una propiedad a cada evento y
devuelve un patrón nuevo (*method chaining*). Es un sinte modular leído de izquierda a derecha:
oscilador → filtro → amplificador → efectos.

## Los valores también pueden ser patrones

```js
.lpf("<400 800 1600>")              // uno por ciclo
.lpf(sine.range(300, 2000).slow(4)) // un LFO
```

`register()` (pattern.mjs:1605) "patronifica" todos los argumentos con `reify()`.

## Dos familias de métodos

- **De sonido** (controles): `.s .lpf .attack .room .gain .pan`. Solo escriben una clave
  en el diccionario del evento (controls.mjs).
- **De tiempo/estructura**: `.fast .slow .rev .every .sometimes .jux .ply`. Reescriben cuándo
  suenan los eventos (pattern.mjs, signal.mjs).

## ADSR (envolvente de volumen)

| Parámetro | Qué es | Unidad | Default synth |
|---|---|---|---|
| `.attack` | tiempo hasta el máximo | segundos | 0.001 |
| `.decay` | tiempo hasta el nivel de sustain | segundos | 0.05 |
| `.sustain` | **nivel** mientras la nota sigue | 0–1 | 0.6 |
| `.release` | cola después del note-off | segundos | 0.01 |

(defaults: superdough synth.mjs:50)

El ADSR da forma al **volumen en el tiempo**. La forma de la **onda** la elige el oscilador
(`sine`, `square`, `sawtooth`, `triangle`) y el **contenido de armónicos** lo recorta el filtro.
El filtro tiene su propia envolvente: `.lpattack .lpdecay .lpsustain .lprelease` + `.lpenv`
(cuánto se mueve, en octavas).
