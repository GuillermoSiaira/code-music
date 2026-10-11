# `$:` y `_` al comienzo de una línea

Verificado en el código fuente (@strudel/core 1.2.6 y @strudel/transpiler 1.2.6).

## `$:` = pista anónima

`nombre:` es una *label* de JavaScript. El transpilador (transpiler.mjs:118) la convierte en
`.p('nombre')`. En `.p()` (repl.mjs:171):

```js
if (id.includes('$')) {
  id = `${id}${anonymousIndex}`;   // '$' → '$0', '$1', '$2'…
  anonymousIndex++;
}
pPatterns[id] = this;
```

Varias líneas `$:` suenan en paralelo sin pisarse. Dos líneas con el mismo nombre (`kick:`)
sí se pisan: queda la última.

## `_nombre:` o `nombre_:` = mute

```js
if (id.startsWith('_') || id.endsWith('_')) return silence;
```

## Otros significados de `_`

| Dónde | Significa |
|---|---|
| al principio del nombre de pista | mute |
| dentro de comillas (mini-notación) | estira la nota anterior: `"c3 _ _ e3"` |
| al principio de un método | visualizador en línea: `._pianoroll()` vs `.pianoroll()` |

Ejemplo ejecutable: `patterns/estudios/03-pistas-dolar-y-mute.js`.
