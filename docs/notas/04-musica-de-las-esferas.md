# 04 · La música de las esferas: de Pitágoras a Strudel

Patrón asociado: `patterns/estudios/04-octava-cosmica.js` (sonido + Hydra), validado con el motor 1.2.6 y probado en strudel.cc.

## De qué se trata

La idea tiene 2.500 años y una sola tesis: **los intervalos musicales y los ciclos del cielo obedecen a las mismas proporciones numéricas.**

| Quién | Qué aportó |
|---|---|
| **Pitágoras** (s. VI a.C.) | Descubre que las consonancias son razones simples de longitudes de cuerda: octava 1:2, quinta 2:3, cuarta 3:4. Si el número ordena el sonido, también ordena el cosmos: los planetas "suenan" según sus distancias |
| **Boecio** (s. VI) | Tres músicas: *mundana* (la de los astros), *humana* (la del cuerpo y el alma), *instrumentalis* (la que se toca). La escolástica la enseña durante mil años |
| **Kepler**, *Harmonices Mundi* (1619) | El primero que lo mide en serio. Compara las velocidades angulares de cada planeta en el perihelio y en el afelio, y encuentra intervalos: Saturno, una tercera mayor (4:5); Júpiter, una tercera menor (5:6); la Tierra, un semitono (15:16, "mi-fa": *miseria y hambre*, escribe). **Buscando esas armonías encuentra su tercera ley** ($T^2 \propto a^3$). Es un error fértil: la música lo llevó a una ley física verdadera |
| **Hans Kayser** (1891–1964) | *Orpheus*, *Klang der Welt*, *Lehrbuch der Harmonik* (1950), *Akroasis* (1946). Retoma el **Lambdoma** pitagórico, una tabla de razones *m/n* que contiene todos los intervalos, y la usa como herramienta para leer proporciones en cristales, plantas, arquitectura y órbitas. Llama a su método **Harmonik**: la objetividad del número más la vivencia del oído. "Akroasis" significa *escucha* |
| **Hans Cousto**, *Die kosmische Oktave* (1978) | La versión que se puede tocar hoy. Toma cualquier período astronómico, lo convierte en ciclos por segundo y lo sube por octavas hasta el rango audible. El año terrestre da **136,10 Hz**, el "Om" que usan los cuencos y diapasones "planetarios" |
| **Ruff y Rodgers** (1979) | Hacen sonar en sintetizador las armonías de Kepler con datos reales de las órbitas |

### Kayser en *Akroasis*
En *Akroasis* (p. 86) cuenta que en 1920 leyó la *Harmonice Mundi* de Kepler y descubrió el Lambdoma, y que desde ahí su vida giró hacia la armónica. En la p. 70 traduce las distancias planetarias a notas y encuentra un carácter "mayor" en los planetas interiores (tercera, cuarta, quinta) y una tendencia "disonante que pide resolución" en los exteriores.

## Lo que es y lo que no es (honestidad)

- **Los planetas no emiten sonido.** Es una **correspondencia de proporciones**, no una acústica. Lo que se puede medir son razones y períodos.
- **Las frecuencias de Cousto son una convención.** Cualquier período subido por octavas da *alguna* nota. Lo que tiene interés no es la nota absoluta, sino **las razones entre ciclos**.
- **Las razones entre órbitas sí son reales:**
  - **Venus:Tierra ≈ 8:13.** En 8 años terrestres, Venus da 13 vueltas y dibuja un **pentágono** casi perfecto en el cielo.
  - **Júpiter:Saturno ≈ 2:5.** Es la "gran desigualdad"; se conjuntan cada ~20 años: la gran conjunción.
  - **Neptuno:Plutón = 2:3.** Es una resonancia orbital estricta, como una quinta.
- **5, 8 y 13 son números de Fibonacci.** Las resonancias del sistema solar están llenas de razones simples. Eso es física de órbitas, y es también lo que hace que suenen bien.

**Como arte y como pedagogía es legítimo y potente. Como ciencia, la parte que se sostiene son las resonancias.**

## Las frecuencias (octava cósmica, calculadas)

| Período | Hz | Nota aprox. |
|---|---|---|
| Día solar | 194,18 | G3 −16¢ |
| Luna (sinódico) | 210,42 | G#3 +23¢ |
| Mercurio | 141,27 | C#3 +33¢ |
| Venus | 221,23 (110,61 una octava abajo) | A3 +10¢ |
| **Tierra (año)** | **136,10** | **C#3 −31¢** |
| Marte | 144,72 | D3 −25¢ |
| Júpiter | 183,58 | F#3 −13¢ |
| Saturno | 147,85 | D3 +12¢ |

## Qué hace el patrón `04-octava-cosmica.js`

- Un drone de la Tierra y del día.
- Polirritmos con las razones reales (13 golpes de Venus contra 8 de la Tierra; 2 de Júpiter contra 5 de Saturno).
- Hydra con un caleidoscopio que pasa por **5 → 8 → 13 lados** sincronizado con la música (`H("<5 8 13>")`), modulado por el pentágono de Venus y con realimentación que deja estela, como el trazo de Venus en 8 años.

## Para practicar con el patrón

- Muteá `venus:` y `anio:` por separado y después juntos: el 8:13 se oye como un "giro" que se completa cada ciclo.
- Cambiá `H("<5 8 13>")` por `H("<2 5>")` y sincronizalo con la gran conjunción.
- Probá `freq(136.10*1.5)`: la quinta del Om (204,15 Hz). Es el intervalo más consonante después de la octava.
