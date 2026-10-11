# Análisis: el lead del video

Fuente: captura de https://youtu.be/7GcSgrJRcIw (líneas 69–81). Código ejecutable en
`patterns/estudios/02-lead-del-video.js`.

| Línea | Método | Qué hace |
|---|---|---|
| 69 | `lead: s("saw")` | pista "lead", oscilador diente de sierra |
| 69 | `.chord("G#m9").voicing()` | acorde de Sol# menor 9 → Ab3 B3 Eb4 Gb4 Bb4 |
| 70 | `.lpf(rand.seed(3).range(200,1000))` | cutoff aleatorio por nota, reproducible |
| 70 | `.lpe(8)` | envolvente de filtro de 8 octavas: abre el filtro hasta el tope |
| 71–75 | `.lpa(wchoose([...rib(22,1), 2], ["0", 4]))` | attack del filtro: 2/6 suave y "congelado", 4/6 seco |
| 76 | `.lpd(rand.range(0.1,0.7).rib(29,1))` | decay del filtro al azar, en loop de 1 ciclo |
| 77–79 | `` .set.out(`<~ ~ 1 _ ~ ~ 1 ~ ~ 1 _ _>*8`.as("vel")) `` | **el ritmo**: `.out` = la estructura la manda el patrón de adentro |
| 80 | `.room(.4).pan(rand.range(.4,.6)).delay(…)` | reverb, paneo levemente aleatorio, delay |
| 81 | `.compressor(-10).pg(0.2)` | `pg` **no existe** en @strudel/core 1.2.6: casi seguro un alias propio de `postgain` |
| 81 | `.rarely(ply(2))` | 25% de las notas se duplican |

## El ritmo es un polirritmo

12 pasos (`~ ~ 1 _ | ~ ~ 1 | ~ ~ 1 _ _` = grupos 4+3+5) leídos a 8 por ciclo: la frase dura
1,5 ciclos y recién vuelve a coincidir con el compás cada 3 ciclos (24 pasos).

## Lo que se puede robar

1. Timbre y ritmo por separado, unidos con `set.out`.
2. Azar en el filtro, pero congelado con `rib`.
3. `wchoose` con pesos: la mayoría de las notas "normales", algunas especiales.
