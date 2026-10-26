// Voces, breaks y una imagen — 90 BPM
// Cómo meter MATERIAL PROPIO: samples troceados en Strudel + una imagen (o foto, o video) dentro de Hydra.
// Acá con material público para que funcione tal cual:
//   · audio: los samples de Tidal (breaks y voces "speech")
//   · imagen: el modelo del sistema solar de Kepler (Mysterium Cosmographicum, 1596, dominio público)
// Con lo tuyo: cambiá las URLs (ver docs/notas/05-armonia-visuales-y-material-propio.md)
// Practicar: slice (reordenar un break) · chop (granular una voz) · src(s1) (una imagen como fuente de Hydra)
// Pegar en https://strudel.cc y Ctrl+Enter

samples('github:tidalcycles/dirt-samples')
setcpm(90/4)

// ---- Visuales: la imagen de Kepler, viva con la música ----
await initHydra()
// OJO: URLs con comillas SIMPLES. En Strudel las dobles son mini-notación y la "/" rompe el parser
s1.initImage('https://upload.wikimedia.org/wikipedia/commons/1/19/Kepler-solar-system-1.png')
src(s1)
  .scale(H("<1 1.04 1.08 1.04>"))                       // "respira" con cada ciclo
  .modulate(osc(6, .05).rotate(() => time * .05), H("<0 .01 .03 .01>"))
  .color(1, .82, .55)                                   // paleta sepia: una sola familia de color
  .contrast(1.3)
  .blend(src(o0), .25)
  .out()

// ---- Sonido ----
// Un break de batería troceado en 8 partes y reordenado (el ABC del remix)
breaks: s("breaks165").fit().slice(8, "0 1 <2 2*2> 3 [4 0] 5 6 7").gain(.8)
// Una voz granulada: 16 granos por ciclo, algunos al revés
voz:    s("speech:2").chop(16).sometimesBy(.3, x => x.speed(-1))
          .room(.6).gain(.6).slow(2)
// Armonía mínima para que la voz tenga dónde apoyarse
bajo:   n("<0 0 3 4>").scale("A1:minor").s("sawtooth").lpf(400).gain(.5)
