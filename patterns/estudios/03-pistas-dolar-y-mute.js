// $: y _ al comienzo de una línea
//   nombre:  pista con nombre    -> el transpilador lo convierte en .p('nombre')
//   $:       pista anónima       -> .p('$') y repl.mjs:171 la renombra $0, $1, $2…
//   _nombre: o nombre_:          -> muteada (.p() devuelve silence)

kick: s("bd*4")
$:    s("[~ hh]*4")
$:    s("~ cp")
_bass: note("c2*8").s("sawtooth").lpf(500)   // sacale el _ y reevaluá (Ctrl+Enter)

// Ojo: dentro de las comillas, _ significa otra cosa: estira la nota anterior.
// "c3 _ _ e3"  ->  c3 dura 3 pasos
