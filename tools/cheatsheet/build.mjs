import fs from 'fs';
import { errors } from './lib.mjs';
import * as p1 from './pages1.mjs';
const p2 = await import('./pages2.mjs');
const p3 = await import('./pages3.mjs');
const order = ['cover','anatomy','internals','mininotation','rhythm1','rhythm2','harmony1','harmony2','synth1','synth2','random','styles1','styles2','dissect','hydra','reference'];
const all = { ...p1, ...p2, ...p3 };
const pages = order.filter(k => all[k]).map(k => all[k]());
const html = `<!doctype html><html lang="es"><head><meta charset="utf-8"><title>Strudel Cheat Sheet</title><link rel="stylesheet" href="style.css"></head><body>${pages.join('\n')}</body></html>`;
fs.writeFileSync('cheatsheet.html', html);
if (errors.length) { console.error('EVAL ERRORS:\n' + errors.join('\n')); }
console.log('pages', pages.length);
