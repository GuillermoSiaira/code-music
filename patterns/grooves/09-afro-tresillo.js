// Afro / Tresillo — 120 BPM
// el tresillo (3,8) y la clave de son (5,16): ritmos euclídeos.

setcpm(120/4)

$: s("bd(3,8)")
$: s("rim(5,16,2)")
$: s("hh*8")

// Sumale un bajo o acordes:
$: n("0 2 4 [2 4]")
  .scale("D:dorian")
  .s("triangle").fast(2)
