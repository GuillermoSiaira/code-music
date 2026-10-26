# 05 · Que suene armónico, que se vea bien, y cómo meter material propio

Patrones: `patterns/estudios/05-octava-armonica.js` y `06-voces-y-kepler.js`. Los dos se validaron con el motor 1.2.6, y el 06 se probó en strudel.cc con la imagen y las muestras cargando.

## 1. Por qué el 04 no sonaba armónico

El 04 usaba frecuencias "crudas": 136,10 · 147,85 · 183,58 · 221,23 Hz. Cada una cae a una cantidad distinta de *cents* de una nota (−31, +12, −13, +10). **Entre sí no forman intervalos simples**: no hay una tónica común, así que el oído oye un batido desafinado.

**La regla que lo arregla: las órbitas al ritmo, la altura a una escala.**

| Qué | Dónde va | Ejemplo |
|---|---|---|
| Las razones orbitales (8:13, 2:5) | **Ritmo**: cuántos golpes por ciclo | `n(run(13))` contra `n("[0 4]*4")` |
| La altura | **Una tónica y una escala** | `.scale("C#3:minor pentatonic")` |
| La tónica "cósmica" | Elegila una sola vez | C#, la nota del Om (136,10 Hz) |

Otras herramientas de armonía, de la más simple a la más fina:
1. **Pentatónica.** No tiene semitonos, así que cualquier combinación suena bien. Ideal para arpegios generativos como el de Venus.
2. **Acordes con `chord().voicing()`.** Strudel elige la disposición de las notas. Una progresión de 4 acordes (i–VI–III–VII en el 05) da sensación de viaje y vuelta.
3. **Bajo que sigue la raíz.** Es lo que "ata" la armonía. En el 05, `n("<0 5 2 6>/2").scale("C#2:minor")` sigue a C#m, A, E y B.
4. **Registro.** Bajo abajo (octava 1–2), pad en el medio, melodía arriba (4–5). Si todo cae en la misma octava, embarra.
5. **Pocas voces a la vez.** Tres o cuatro capas con rol claro (pulso, bajo, armonía, melodía) suenan mejor que diez.
6. **Si querés afinación "pura", como Kayser y el Lambdoma:** partí de la tónica y multiplicá por razones simples. Con 136,10 Hz: unísono 1, segunda 9/8 = 153,11, tercera 5/4 = 170,13, quinta 3/2 = 204,15, sexta 5/3 = 226,83, octava 2 = 272,20. Todo lo que sale de **una sola tónica por razones simples** es consonante. Es la "música de las esferas" bien hecha.

## 2. Que se vea bien (Hydra)

Las visuales "bonitas pero genéricas" salen de usar todo a la vez. Las que se ven bien siguen pocas reglas:
- **Una fuente con contenido.** Una foto, un video o un grabado como el de Kepler valen más que `osc()` solo. Hydra transforma: dale algo que transformar.
- **Una sola familia de color.** `.color(1, .82, .55)` (sepia), `.saturate(.3)` o `.luma()`. Pocos colores se ven más profesionales.
- **El movimiento atado a la música.** `H("<1 1.04 1.08>")` hace que la imagen "respire" en cada ciclo. Si se mueve todo el tiempo sin relación con el audio, cansa.
- **Contraste y espacio vacío.** `.contrast(1.3)`, `.mask(shape(...))` para recortar, `.thresh()` para convertir en blanco y negro gráfico.
- **Realimentación con medida.** `.blend(src(o0), .25)` deja estela. Más de .5 lo convierte en barro, como pasó en el primer intento del 04.

## 3. Tu material propio

### Sonido: voces, temas, remixes → sí, Strudel lo hace

**Cómo cargar tus archivos:**
- **Desde tu compu:** en strudel.cc, **sounds → import-sounds → "import sounds folder"**. Elegís una carpeta y cada subcarpeta se vuelve un sonido. Por ejemplo, `samples/voz/` se usa como `s("voz")` y `samples/voz/` con 3 archivos se usa como `s("voz:0")`, `s("voz:1")`, etc. Quedan en tu navegador.
- **Desde internet** (para compartir el código): subí los archivos a un repo de GitHub y usá `samples('github:tu-usuario/tu-repo')`, o una URL directa: `samples({ voz: 'https://…/voz.wav' })`.

**Las cuatro técnicas de remix** (las cuatro existen en 1.2.6; `pattern.mjs` las define):

| Función | Qué hace | Para qué |
|---|---|---|
| `.slice(8, "0 1 3 2")` | Corta el audio en 8 partes y las dispara en el orden que digas | Reordenar un break o una frase |
| `.splice(8, "…")` | Igual, pero ajusta la velocidad de cada parte a su paso | Que el trozo calce justo en el tempo |
| `.chop(16)` | Lo parte en 16 granos seguidos | Textura granular: voces que se vuelven pads |
| `.fit()` / `.loopAt(4)` | Estira el sample para que dure lo que dura el ciclo | Poner un tema entero en tu tempo |

Además: `.begin(.25).end(.5)` toca solo un tramo, `.speed(-1)` lo da vuelta y `.speed(2)` lo sube una octava.

Ejemplo con un tema tuyo (`tema.wav`, cargado como `tema`):
```js
setcpm(124/4)
remix: s("tema").loopAt(8).splice(16, "<0 4 8 12> [2 3] 6 <14 15>").gain(.8)
pulso: s("bd*4").bank("RolandTR909")
```

**Derechos:** remixar temas ajenos para practicar en tu casa está bien. Para publicar, hacen falta permisos o material libre (Creative Commons, Freesound, dominio público).

### Imagen: fotos y videos → sí, Hydra lo hace

```js
await initHydra()
s1.initImage('https://…/foto.jpg')     // una foto
s2.initVideo('https://…/clip.mp4')     // un video (loopea solo)
// s3.initCam()                        // tu cámara en vivo
src(s1).blend(src(s2), H("<0 .5 1 .5>")).out()   // mezcla foto y video al ritmo
```

Tres detalles que hacen la diferencia (los encontré al probarlo):
1. **URLs con comillas simples.** En Strudel, las comillas dobles son mini-notación, y la `/` de la URL rompe el parser. Es el error más común.
2. **El archivo tiene que estar en un servidor que permita cargarlo desde otra página (CORS).** Funcionan GitHub (`raw.githubusercontent.com`) y Wikimedia. Para archivos de tu disco: `npx http-server --cors` en la carpeta, y usás `http://localhost:8080/foto.jpg`.
3. **Usá `s1`, `s2` y `s3`.** `s0` lo reserva Strudel si activás `feedStrudel`.

**Cortar y editar antes:** Hydra no recorta clips. Para elegir el tramo de un video, cortalo antes; con `ffmpeg -ss 00:01:10 -t 8 -i original.mp4 -an clip.mp4` sacás 8 segundos sin audio. En vivo hacés lo demás: mezclar, recortar con `.mask()`, colorear, deformar con `.modulate()` y repetir con `.repeat()`.

## 4. Un camino de práctica sugerido

1. **05-octava-armonica:** muteá capas y cambiá la escala (`minor` → `dorian`). Escuchá cómo cambia el color.
2. **06-voces-y-kepler:** cambiá el orden del `slice` y los granos del `chop`.
3. **Primer material tuyo:** grabá tu voz diciendo una frase, cargala con "import sounds folder" y troceala con `chop`.
4. **Primera foto tuya** en Hydra, con una sola paleta y movimiento atado al ciclo.
5. **Unir todo:** tu voz, una foto tuya, armonía en C# y las razones de Venus en el ritmo. Ya es una pieza tuya.
