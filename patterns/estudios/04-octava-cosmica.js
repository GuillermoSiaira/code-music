// La octava cósmica — 68 BPM
// Idea: Hans Cousto (1978) toma el período de cada planeta, lo pasa a ciclos por segundo y lo sube
// por octavas (×2, ×2, ×2…) hasta que se oye. Las razones entre órbitas se vuelven polirritmos:
// Venus:Tierra ≈ 8:13 (el pentágono de Venus), Júpiter:Saturno ≈ 2:5 (la gran conjunción).
// Practicar: freq() en Hz en lugar de note() · polirritmo = dos capas con subdivisiones distintas
// En vivo: muteá con _ (ej. _venus:) para oír cada razón por separado
// Hydra: 5, 8 y 13 son Fibonacci y son las cifras de Venus (5 pétalos, 8 años, 13 órbitas)
// Pegar en https://strudel.cc y Ctrl+Enter

setcpm(68/4)

// ---- Visuales (Hydra) ----
await initHydra()
osc(13.61, .03, 1.36)                    // 13,61 = la frecuencia de la Tierra / 10: el color "late" con el Om
  .kaleid(H("<5 8 13>"))                 // pétalos sincronizados con la música: 5 → 8 → 13
  .rotate(() => time * .0813)            // gira a la razón Venus:Tierra (8/13 ≈ 0,615 → .0813 rad/s)
  .modulate(shape(5, .4, .2).rotate(() => -time * .13), .15)  // el pentágono de Venus deforma la luz
  .blend(src(o0).scale(1.01), .3)        // realimentación: cada órbita deja estela, como el trazo de Venus en 8 años
  .contrast(1.4)
  .out()

// Tierra: el año trópico, 32 octavas arriba = 136,10 Hz (el "Om" de Cousto, ~C#3 −31 cents)
om:      freq(136.10).s("sine").gain(.35).room(.7).roomsize(6)
// El día solar, 24 octavas arriba = 194,18 Hz (~G3)
dia:     freq(194.18).s("triangle").attack(2).release(3).gain(.12).slow(2)

// Venus:Tierra ≈ 8:13 → 13 golpes de Venus (221,23 Hz) contra 8 de la Tierra por ciclo
venus:   freq("221.23*13").s("sine").decay(.08).sustain(0).gain(.22).pan(.7)
anio:    freq("136.10*8").s("sine").decay(.15).sustain(0).gain(.3).pan(.3)

// Júpiter:Saturno ≈ 2:5 → la gran conjunción, cada 2 ciclos se reencuentran
jupiter: freq("183.58*2").s("sawtooth").lpf(600).decay(.5).sustain(0).gain(.25).slow(2)
saturno: freq("147.85*5").s("square").lpf(350).decay(.2).sustain(0).gain(.18).slow(2)
