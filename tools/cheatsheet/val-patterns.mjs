// Valida los .js de patterns/ con el motor real: sin errores y cada capa con eventos.
// Uso: node val-patterns.mjs [archivo-o-carpeta ...]   (por defecto: ../../patterns)
import { readFileSync, readdirSync, statSync } from 'node:fs';
import { join, relative } from 'node:path';
import { run, haps, errors } from './lib.mjs';

// Hydra no corre en Node: stub encadenable (osc(...).kaleid(...).rotate(...).out()) para evaluar solo el audio
const chain = new Proxy(function () {}, { get: () => chain, apply: () => chain });
for (const k of ['osc', 'shape', 'src', 'noise', 'voronoi', 'gradient', 'solid', 'render']) globalThis[k] = chain;
for (const k of ['o0', 'o1', 'o2', 'o3', 's0', 's1', 's2', 's3']) globalThis[k] = chain;

const root = new URL('../../', import.meta.url).pathname.replace(/^\/([A-Za-z]:)/, '$1');
const walk = (p) => (statSync(p).isDirectory() ? readdirSync(p).flatMap((f) => walk(join(p, f))) : p.endsWith('.js') ? [p] : []);
const args = process.argv.slice(2);
const files = (args.length ? args : [join(root, 'patterns')]).flatMap(walk);

let fails = 0;
for (const f of files) {
  const before = errors.length;
  // strudel.cc acepta await al nivel superior y el transpilador agrega await a samples(); run() evalúa
  // sincrónico, así que se sacan (los stubs no esperan nada). globalThis.samples evita que lo reescriba.
  const src = readFileSync(f, 'utf8').replace(/\bawait\s+/g, '').replace(/(^|[^.\w])samples\(/g, '$1globalThis.samples(');
  const r = run(src);
  const name = relative(root, f);
  if (errors.length > before) { fails++; console.log(`ERROR  ${name}\n  ${errors.at(-1).split('\n').at(-1)}`); continue; }
  const empty = Object.entries(r).filter(([, p]) => !haps(p, 0, 4).length).map(([k]) => k);
  if (empty.length) { fails++; console.log(`VACÍA  ${name}: ${empty.join(', ')}`); continue; }
  console.log(`ok     ${name}: ${Object.keys(r).join(', ')}`);
}
console.log(fails ? `\n${fails} archivo(s) con problemas` : `\nTodo ok (${files.length} archivos)`);
process.exitCode = fails ? 1 : 0;
