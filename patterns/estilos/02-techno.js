// Techno — 132 BPM
// ADN: bombo fuerte y seco · rumble: bajo pegado al bombo · stabs con delay, poca armonía
// En vivo: cambiá el .slow() del LFO del rumble; poné .degradeBy(.3) en los hats para el break
// Pegar en https://strudel.cc y Ctrl+Enter

setcpm(132/4)
kick: s("bd*4").bank("RolandTR909")
hats: s("[~ hh hh hh]*4")
  .bank("RolandTR909").gain(.4)
clap: s("cp").beat("4,12", 16)
  .room(.3)
rumble: note("c1*16").s("sawtooth")
  .decay(.12).sustain(0)
  .lpf(sine.range(150, 600).slow(8))
stab: chord("Cm").voicing()
  .s("square").beat("2,6,9", 16)
  .decay(.1).sustain(0)
  .delay(.5).room(.5)
