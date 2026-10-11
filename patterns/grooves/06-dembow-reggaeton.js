// Dembow / Reggaetón — 95 BPM
// bombo en negras + caja en tresillo 3-3-2 (x··x··x·).

setcpm(95/4)

$: s("bd*4")
$: s("[~ ~ ~ sd ~ ~ sd ~]*2")
$: s("hh*8").gain(.5)

// Sumale un bajo o acordes:
$: note("<a1 f1 c2 g1>")
  .s("sawtooth").lpf(600)
  .struct("x ~ ~ x ~ ~ x ~")
