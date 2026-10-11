// Parche post-install (Node, multiplataforma). Los paquetes @strudel/* 1.2.6 publicados en npm
// tienen "exports" que no permiten importar el código fuente .mjs desde Node, @strudel/core importa
// @kabelsalat/web (solo navegador) y varios @tonaljs/* apuntan a archivos dist inexistentes.
// Correr después de cada `npm install`:  node fix.mjs   (npm lo hace solo vía "postinstall").
import fs from 'fs';
import path from 'path';

const nm = 'node_modules';
const writeJSON = (f, j) => fs.writeFileSync(f, JSON.stringify(j, null, 2));

// 1. stub de @kabelsalat/web
const kab = path.join(nm, '@kabelsalat', 'web');
fs.rmSync(kab, { recursive: true, force: true });
fs.mkdirSync(kab, { recursive: true });
writeJSON(path.join(kab, 'package.json'), { name: '@kabelsalat/web', type: 'module', exports: './index.mjs' });
fs.writeFileSync(path.join(kab, 'index.mjs'), 'export class SalatRepl {}\nexport default {};\n');

// 2. @strudel/*: exponer los .mjs fuente
for (const p of ['core', 'mini', 'tonal', 'transpiler']) {
  const f = path.join(nm, '@strudel', p, 'package.json');
  if (!fs.existsSync(f)) continue;
  const j = JSON.parse(fs.readFileSync(f, 'utf8'));
  j.exports = { '.': './index.mjs', './*': './*' };
  writeJSON(f, j);
}

// 3. @tonaljs/*: corregir main/exports (también los anidados)
const walk = (dir) => {
  if (!fs.existsSync(dir)) return;
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    if (!e.isDirectory()) continue;
    const d = path.join(dir, e.name);
    if (d.includes(`${path.sep}@tonaljs${path.sep}`) && fs.existsSync(path.join(d, 'package.json')) && !d.endsWith(`${path.sep}dist`)) {
      const f = path.join(d, 'package.json');
      const j = JSON.parse(fs.readFileSync(f, 'utf8'));
      const ex = (p) => fs.existsSync(path.join(d, p));
      if (!ex(j.main || 'x')) for (const c of ['dist/index.cjs', 'dist/index.js']) if (ex(c)) { j.main = c; break; }
      if (j.module && !ex(j.module)) delete j.module;
      j.exports = { '.': { import: ex('dist/index.mjs') ? './dist/index.mjs' : './' + j.main, require: './' + j.main } };
      writeJSON(f, j);
    }
    walk(d);
  }
};
walk(nm);
console.log('fix.mjs: dependencias parcheadas');
