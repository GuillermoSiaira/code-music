// Dub Techno — 118 BPM
// ADN: un acorde m7 que se repite y se disuelve · mucho delay con feedback y reverb · filtro que respira (perlin)
// En vivo: subí delayfeedback hacia .8 y bajalo; movés todo el "dub" con un número
// Pegar en https://strudel.cc y Ctrl+Enter

setcpm(118/4)
kick: s("bd*4").gain(.9)
hats: s("[~ hh]*4").gain(.35)
chord: chord("<Cm7 Cm7 Fm7 Cm7>")
  .voicing().s("sawtooth")
  .struct("~ x ~ ~ ~ ~ ~ ~")
  .lpf(perlin.range(400, 1500))
  .decay(.15).sustain(0)
  .delay(.7).delaytime(.33)
  .delayfeedback(.7).room(.8)
hiss: s("pink").gain(.03)
