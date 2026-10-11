// UK Garage — 132 BPM
// ADN: bombo que saltea, caja en 2 y 4 · swing fuerte en los hats · acordes m9 cortados y sincopados
// En vivo: variá el swing: .swingBy(1/6, 4) sutil, 1/3 bien garage
// Pegar en https://strudel.cc y Ctrl+Enter

setcpm(132/4)
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
  .struct("x ~ ~ x ~ ~ x ~").s("sine")
