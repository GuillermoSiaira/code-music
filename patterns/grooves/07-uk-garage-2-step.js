// UK Garage / 2-step — 132 BPM
// bombo que saltea el 3 y hats con swing marcado.

setcpm(132/4)

$: s("bd").beat("0,10", 16)
$: s("~ sd ~ sd")
$: s("hh*8").swingBy(1/3, 4)

// Sumale un bajo o acordes:
$: chord("<Fm9 Bbm9>")
  .voicing().s("sawtooth")
  .struct("~ x ~ ~ x ~ ~ ~")
  .lpf(1500)
