// La octava cósmica, armónica — 68 BPM
// La lección del 04: Hz "crudos" (136,10 · 147,85 · 183,58 · 221,23) no comparten afinación → suenan desafinados entre sí.
// Regla: las órbitas van al RITMO; la ALTURA va a una sola tónica + una escala.
// Tónica: C# (la nota del Om de la Tierra, 136,10 Hz ≈ C#3) · Escala: C# menor
// Practicar: run(13) para 13 notas por ciclo · chord().voicing() · bajo que sigue la raíz de cada acorde
// Pegar en https://strudel.cc y Ctrl+Enter

setcpm(68/4)

// Armonía: C#m9 → A^7 → E^7 → B6 (i – VI – III – VII), dos ciclos cada uno
pad:    chord("<C#m9 A^7 E^7 B6>/2").voicing()
          .s("supersaw").attack(1.5).release(3).lpf(1400)
          .room(.8).roomsize(6).gain(.3)
bajo:   n("<0 5 2 6>/2").scale("C#2:minor")
          .s("sine").attack(.05).release(.8).gain(.55)

// Venus:Tierra = 13:8, ahora dentro de la escala
venus:  n(run(13)).scale("C#4:minor pentatonic")       // 13 notas por ciclo: el arpegio de Venus
          .s("triangle").decay(.12).sustain(0)
          .gain(.18).pan(sine.range(.3, .7)).delay(.3)
tierra: n("[0 4]*4").scale("C#3:minor pentatonic")     // 8 por ciclo
          .s("sine").decay(.2).sustain(0).gain(.25)

// Júpiter:Saturno = 2:5 como percusión (sin altura: no puede desafinar)
gran:   s("bd*2, rim*5").bank("RolandTR909").slow(2).gain(.55)
