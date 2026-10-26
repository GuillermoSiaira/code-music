# code-music

Aprendizaje de **live coding de música electrónica**: Strudel (sonido) y Hydra (visuales).

## Estructura

```
code-music/
├── docs/
│   ├── strudel-cheatsheet.pdf      cheat sheet de 19 págs: ritmo, teoría, armonía, síntesis, trigonometría, estilos, Hydra
│   └── notas/                      apuntes de cada sesión (markdown)
├── patterns/                       código listo para pegar en https://strudel.cc
│   ├── estilos/                    10 plantillas completas por género
│   ├── grooves/                    10 patrones de batería + bajo
│   └── estudios/                   ejercicios y análisis (ej. el lead del video)
└── tools/cheatsheet/               generador del PDF (Node + motor real de Strudel)
```

## Usar los patrones

Abrí https://strudel.cc, pegá el contenido de un `.js` de `patterns/` y apretá `Ctrl+Enter`.
`Ctrl+.` para todo. Todos los patrones fueron evaluados con @strudel/core 1.2.6
(generan eventos sin errores; el sonido no se pudo probar en el entorno donde se crearon).

## Regenerar el PDF

Requisitos: Node 20+.

```powershell
cd tools\cheatsheet
npm install                 # corre fix.mjs automáticamente (parchea dependencias para Node)
npx playwright install chromium
npm run validate            # evalúa todos los ejemplos con Strudel
npm run pdf                 # escribe docs\strudel-cheatsheet.pdf
npm run hydra-shots         # (opcional) regenera las capturas de Hydra de la pág. 18
```

Para usar un Chrome ya instalado en lugar del de Playwright: `$env:CHROME_PATH="C:\ruta\chrome.exe"`.

- `lib.mjs` evalúa código de Strudel (transpilador + core) y dibuja grillas, piano rolls y señales en SVG.
- `pages1.mjs` … `pages3.mjs` tienen el contenido de las páginas. `style.css`, el diseño.
- `fix.mjs` corrige los paquetes `@strudel/*` 1.2.6 para importarlos desde Node.

## Notas

- Código fuente de Strudel: https://codeberg.org/uzu/strudel (se mudó desde GitHub).
- Las referencias `archivo.mjs:línea` del PDF corresponden a los paquetes npm `@strudel/*` 1.2.6
  y `superdough` 1.3.0.
