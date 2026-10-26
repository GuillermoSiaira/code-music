// Ritmo y mini-notación — semana 1 (ejercicios 1 a 4 de la práctica)
// BPM: 120 (setcpm(120/4): 1 ciclo = 1 compás de 4 negras)
// Qué se practica: pasos parejos, [ ] y *, silencio (- o ~), < > por ciclo, euclidianos (k,n,rot)
// En vivo: arrancá con las pistas sin _, después sacale el _ a una variante por vez
//          (Alt+Enter) y volvé a ponérselo. Mirá la consola si algo no suena.

setcpm(120/4)

// 1. Pasos parejos: 8 pasos = corcheas. Bombo en 1-2-5-6, redoblante en 3 y 7
_$: s("bd bd sd hh bd bd sd hh")

// 2. [ ] y * subdividen UN paso: corchea, corchea, tresillo, semicorcheas
_$: s("hh*2 hh*2 hh*3 hh*4")
_$: s("bd hh*2 sd sd*4")                    // redoble al final del compás

// 3. Base house: bombo a negras, backbeat en 2 y 4, hat a contratiempo
$:  s("<bd*4 [bd bd bd [bd bd]]>")          // < >: un compás recto, otro con empujón
$:  s("- sd - sd")
$:  s("- hh - hh - hh - hh")
$:  s("- - - <- - - [sd sd sd sd]>")        // redoble de semicorcheas cada 4 compases

// 4. Euclidianos: (golpes, pasos, rotación)
_$: s("bd(<3 5>,8)")                        // tresillo / cinquillo, alternando por compás
_$: s("rim(3,8,3)")                         // mismo dibujo corrido 3 pasos: contesta al bombo
