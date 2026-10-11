// Ambient — 70 BPM
// ADN: sin bombo: el tiempo flota · acordes largos (attack/release lentos) · notas sueltas con azar y mucho espacio
// En vivo: cambiá la escala de las campanas (lydian → dorian) y escuchá cómo cambia el color
// Pegar en https://strudel.cc y Ctrl+Enter

setcpm(70/4)
pad: chord("<D^9 Bm11 G^7#11 A6>/2")
  .voicing().s("supersaw")
  .attack(2).release(4).lpf(1200)
  .room(.9).roomsize(8).gain(.5)
bells: n("0 4 7 <9 11>")
  .scale("D:lydian").s("triangle")
  .slow(2).degradeBy(.3)
  .delay(.6).room(.8)
  .pan(perlin.range(.2, .8))
drone: note("d2").s("sine").gain(.4)
