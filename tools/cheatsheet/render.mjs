import path from 'path';
import fs from 'fs';
import { pathToFileURL } from 'url';
import { chromium } from 'playwright';
const b = await chromium.launch(process.env.CHROME_PATH ? { executablePath: process.env.CHROME_PATH } : {});
fs.mkdirSync('shots', { recursive: true });
const p = await b.newPage({ viewport: { width: 1123, height: 794 }, deviceScaleFactor: 1.6 });
await p.goto(pathToFileURL(path.resolve('cheatsheet.html')).href);
await p.evaluate(() => document.fonts.ready);
const n = await p.$$eval('.page', (els) => els.length);
const only = process.argv[2]?.split(',').map(Number);
for (let i = 0; i < n; i++) { if (only && !only.includes(i+1)) continue; const el = (await p.$$('.page'))[i]; await el.screenshot({ path: `shots/p${i + 1}.png` }); }
// overflow check
const of = await p.$$eval('.card', els => els.filter(e => e.scrollHeight > e.clientHeight + 2 || e.scrollWidth > e.clientWidth + 2).map(e => { const pg=[...document.querySelectorAll('.page')].indexOf(e.closest('.page'))+1; return pg + ': ' + e.querySelector('h3')?.textContent.slice(0,40) + ` (${e.scrollHeight}>${e.clientHeight})`; }));
console.log('overflow:', of);
if (process.argv.includes('--pdf')) await p.pdf({ path: path.resolve('../../docs/strudel-cheatsheet.pdf'), width: '297mm', height: '210mm', printBackground: true, preferCSSPageSize: true });
await b.close();
