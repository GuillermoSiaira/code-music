// Drum & Bass — 174 BPM
// two-step: bombo en el 1 y en el "y" del 3, caja en 2 y 4.

setcpm(174/4)

$: s("bd").beat("0,10", 16)
$: s("sd").beat("4,12", 16)
$: s("hh*8")

// Sumale un bajo o acordes:
$: note("<c1 eb1>/2")
  .s("supersaw")
  .lpf(300).lpq(5) // reese
