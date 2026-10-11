// Trap / Hip-hop — 140 BPM
// ADN: half-time: caja en el 3 · hats con redobles (ply) · 808 con golpe de pitch y cola larga
// En vivo: cambiá los .ply() de los hats (son el alma del trap) y sumá .bank("RolandTR808") a la batería
// Pegar en https://strudel.cc y Ctrl+Enter

setcpm(140/4)
kick: s("bd").beat("0,7,10", 16)
snare: s("sd").beat("8", 16)
hats: s("hh*8")
  .ply("<1 [1 1 1 2] 1 [1 3 1 1]>")
bass808: note("<c1 c1 eb1 g0>")
  .beat("0,7,10", 16).s("sine")
  .penv(12).pdecay(.04)
  .decay(.9).sustain(0)
mel: n("0 ~ 2 3 ~ 4 3 2")
  .scale("C:harmonic:minor")
  .s("triangle").room(.5).gain(.5)
