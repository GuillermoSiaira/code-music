// Breakbeat (Amen-ish) — 136 BPM
// bombo sincopado y caja desplazada: el corazón del jungle y el big beat.

setcpm(136/4)

$: s("bd").beat("0,2,10,11", 16)
$: s("sd").beat("4,7,9,12,15", 16)
$: s("hh*8")

// Sumale un bajo o acordes:
$: note("<c2 [~ c2] bb1 g1>")
  .s("square").lpf(800)
