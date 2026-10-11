// Techno — 132 BPM
// bombo continuo, hats en semicorcheas con hueco en el tiempo, rim sincopado.

setcpm(132/4)

$: s("bd*4")
$: s("cp").beat("4,12", 16)
$: s("[~ hh hh hh]*4")
$: s("rim").beat("2,7,10", 16)

// Sumale un bajo o acordes:
$: note("c1*16").s("sawtooth")
  .lpf(sine.range(200,800)
    .slow(8))
  .decay(.1).sustain(0)
