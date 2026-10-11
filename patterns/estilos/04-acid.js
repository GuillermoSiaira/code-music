// Acid — 128 BPM
// ADN: línea 303: saw + filtro ladder resonante · la envolvente de filtro hace el "squelch" · octavas y acentos aleatorios
// En vivo: mové lpq entre 5 y 20 y el LFO del cutoff: eso ES el acid
// Pegar en https://strudel.cc y Ctrl+Enter

setcpm(128/4)
drums: s("bd*4, [~ hh]*4, ~ cp")
  .bank("RolandTR909")
acid: note("c2 c2 c3 c2 eb2 c2 bb1 [c2 g2]")
  .s("sawtooth").ftype('ladder')
  .lpf(sine.range(300, 2000).slow(8))
  .lpq(12).lpenv("<2 4>").lpd(.15)
  .decay(.2).sustain(.2)
  .sometimes(x => x.add(note(12)))
