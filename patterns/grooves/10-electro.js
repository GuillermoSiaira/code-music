// Electro — 128 BPM
// herencia de la 808: bombo sincopado, caja en 2 y 4, hats acentuados.

setcpm(128/4)

$: s("bd").beat("0,3,6,10", 16)
$: s("~ sd ~ sd")
$: s("hh*16").gain("[.4 .8]*8")

// Sumale un bajo o acordes:
$: note("c2 c2 [c3 c2] eb2")
  .s("square").lpf(1200)
  .decay(.2).sustain(0)
