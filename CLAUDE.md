# Contexto para Claude

Repo personal de aprendizaje de live coding musical (Strudel + Hydra). El usuario toca
sintetizadores y está aprendiendo Strudel; conversa en español rioplatense.

- Guardar apuntes nuevos en `docs/notas/NN-tema.md` y código en `patterns/` (un archivo por idea,
  con comentario de cabecera: nombre, BPM, qué practicar).
- Validar cualquier patrón nuevo con el motor real antes de guardarlo:
  `cd tools/cheatsheet && npm install && node val.mjs` (o reutilizar `run()`/`haps()` de `lib.mjs`).
- Versión de referencia: @strudel/* 1.2.6, superdough 1.3.0. Citar fuentes como `archivo.mjs:línea`.
- No inventar métodos: verificar en `node_modules/@strudel/*/` (ej. `.pg` no existe en 1.2.6).
