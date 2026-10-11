import path from 'path';
import { pathToFileURL } from 'url';
import { chromium } from 'playwright';
const b = await chromium.launch({ ...(process.env.CHROME_PATH ? { executablePath: process.env.CHROME_PATH } : {}), args: ['--use-gl=swiftshader', '--enable-webgl', '--ignore-gpu-blocklist'] });
const p = await b.newPage({ viewport: { width: 320, height: 200 } });
p.on('console', m => console.log('console:', m.text()));
p.on('pageerror', e => console.log('pageerror:', e.message));
await p.goto(pathToFileURL(path.resolve('hy/run.html')).href);
const recipes = {
  kaleid: `osc(30, 0.1, 1.2).kaleid(H(6)).rotate(() => time * .1).modulate(noise(3), .2).out()`,
  techno: `shape(4, .25, .01).repeat(4, 4).scale(H(1.2)).rotate(.3).color(.2, 1, .8).out()`,
  ambient: `noise(2, .05).color(.4, .6, .9).modulate(osc(1), .3).blend(o0, .9).out()`,
  dub: `src(o0).scale(1.01).rotate(.01).blend(osc(20, .1).kaleid(5), .1).out()`,
  voronoi: `voronoi(5, .3, .3).color(1, .3, .8).modulateScale(osc(8), .5).out()`,
  colorama: `osc(10, .1, 2).colorama(.3).pixelate(40, 25).out()`,
};
for (const [k, code] of Object.entries(recipes)) {
  await p.evaluate(([c]) => window.go(c, 1.3), [code]);
  await p.waitForTimeout(150);
  await p.screenshot({ path: `hy/${k}.png` });
  console.log('ok', k);
}
await b.close();
