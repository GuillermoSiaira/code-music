// Lo-fi Hip-hop — 80 BPM
// ADN: acordes maj7/m7 (ii–V–I) en piano · batería con swing, todo un poco "sucio" · crackle de vinilo y filtro pasa-bajos
// En vivo: bajá el lpf de los keys a 1200 para el puente; subí el crackle
// Pegar en https://strudel.cc y Ctrl+Enter

setcpm(80/4)
drums: s("bd ~ ~ bd ~ ~ bd ~, ~ sd")
  .bank("RolandTR808").swingBy(1/6, 4)
hats: s("hh*8").swingBy(1/6, 4)
  .gain(rand.range(.2, .5))
keys: chord("<F^7 Em7 Dm7 C^7>")
  .voicing().s("piano")
  .struct("x ~ ~ [~ x] ~ ~ x ~")
  .lpf(2000).room(.4)
bass: chord("<F^7 Em7 Dm7 C^7>")
  .rootNotes(2).s("sine")
vinyl: s("crackle").gain(.1)
