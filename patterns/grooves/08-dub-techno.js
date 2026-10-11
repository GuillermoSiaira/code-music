// Dub Techno — 118 BPM
// bombo suave y hats a contratiempo; el groove lo dan los acordes con delay (pág. 12).

setcpm(118/4)

$: s("bd*4")
$: s("[~ hh]*4")
$: s("rim").beat("6", 16)

// Sumale un bajo o acordes:
$: chord("Cm7").voicing()
  .s("sawtooth").lpf(700)
  .struct("~ x ~ ~")
  .delay(.6).room(.7)
