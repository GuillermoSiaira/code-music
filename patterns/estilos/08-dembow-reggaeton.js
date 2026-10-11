// Dembow / Reggaetón — 95 BPM
// ADN: tresillo 3-3-2 en la caja · progresión menor (i–VI–III–VII) · bajo que sigue el tresillo
// En vivo: sacá la caja 1 compás con mask("<1 1 1 0>") antes del coro
// Pegar en https://strudel.cc y Ctrl+Enter

setcpm(95/4)
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
  .lpf(2000).gain(.5)
