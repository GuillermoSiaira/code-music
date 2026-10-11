// House — 124 BPM
// ADN: bombo en negras (four-on-the-floor) · acordes m7/m9 a contratiempo · bajo en la corchea "y"
// En vivo: abrí el filtro de los acordes de a poco; sacá el bombo 1 compás antes del drop
// Pegar en https://strudel.cc y Ctrl+Enter

setcpm(124/4)
drums: s("bd*4, [~ oh]*4, ~ cp")
  .bank("RolandTR909")
hats: s("hh*16").bank("RolandTR909")
  .gain(.35)
bass: note("<c2 c2 f1 g1>")
  .struct("[~ x]*4").s("sawtooth")
  .lpf(400).decay(.2).sustain(.3)
chords: chord("<Cm9 Cm9 Fm9 G7b9>")
  .voicing().struct("~ [~ x] ~ x")
  .s("sawtooth").room(.4)
  .lpf(sine.range(800, 3000).slow(16))
