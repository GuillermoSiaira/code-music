// Lead del video (captura, líneas 69–81) — versión ejecutable
// Cambios respecto del original:
//   .pg(0.2)  -> .postgain(0.2)   (pg no existe en @strudel/core 1.2.6; seguramente es un alias propio)
//   se omitió el .delay(…), que en la captura aparece cortado
// Análisis línea por línea: docs/notas/02-analisis-lead-del-video.md

lead: s("saw").chord("G#m9").voicing()
  .lpf(rand.seed(3).range(200, 1000)).lpe(8)
  .lpa(wchoose(
    [rand.seed("2")
      .range(0.05, 0.1).rib(22, 1), 2],
    ["0", 4],
  ))
  .lpd(rand.range(0.1, 0.7).rib(29, 1))
  .set.out(`<
  ~ ~ 1 _ ~ ~ 1 ~ ~ 1 _ _
>*8`.as("vel"))
  .room(0.4).pan(rand.range(0.4, 0.6))
  .compressor(-10).postgain(0.2).rarely(ply(2))

// Ejercicios (cambiá una cosa por vez):
// 1. .chord("<G#m9 Em9>")              dos acordes
// 2. .lpe(2)                           menos "squelch"
// 3. .set.out("<1 ~ 1 1>*4".as("vel")) otro ritmo
// 4. .rib(23, 1)                       otro azar (era 22)
// 5. .s("supersaw").detune(.3)         más ancho
