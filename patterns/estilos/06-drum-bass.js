// Drum & Bass — 174 BPM
// ADN: breaks rápidos: two-step a 170–175 · bajo reese (saws desafinados) · pads oscuros a medio tiempo
// En vivo: poné .every(4, x => x.ply(2)) en la caja para los fills
// Pegar en https://strudel.cc y Ctrl+Enter

setcpm(174/4)
kick: s("bd").beat("0,10", 16)
snare: s("sd").beat("4,12", 16)
hats: s("hh*8").gain("[.6 .3]*4")
reese: note("<c1 c1 eb1 g0>")
  .s("supersaw").detune(.6)
  .lpf(sine.range(200, 700).slow(4))
  .lpq(6).gain(.7)
pad: chord("<Cm9 Ab^7>/2").voicing()
  .s("triangle").attack(.5)
  .release(2).room(.7).gain(.4)
