// House / Disco — 124 BPM
// four-on-the-floor, palmas en 2 y 4, hat abierto a contratiempo. Probá .bank("RolandTR909").

setcpm(124/4)

$: s("bd*4")
$: s("~ cp ~ cp")
$: s("[~ oh]*4")
$: s("hh*16").gain(.4)

// Sumale un bajo o acordes:
$: note("[~ c2]*4")
  .s("sawtooth").lpf(500)
