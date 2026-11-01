// zoom2 · movimiento (4 fases), modo M (TAPSE) y Doppler con el dibujo nuevo (?dibujo=2), 390×844, y sus cifras en texto del monitor.
// uso: node capturas-mov-doppler.mjs [movimiento|tapse|doppler]   (sin argumento, las tres)
//  SOLO=clave1,clave2  → solo esas capturas.   IT_PRESET=<data-muestra de la IT CW> (por defecto «regtricus»): si el botón no existe, se avisa y se salta.
// salida: autonomo/bloques/mv-eco/capturas-realismo/mov/<clave>.png y cifras-mov-doppler.md
import { createServer } from 'node:http';
import { readFile, writeFile, mkdir } from 'node:fs/promises';
import { join, extname, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
const RAIZ = join(dirname(fileURLToPath(import.meta.url)), '..', '..', '..', '..');
const OUT = process.env.OUT || join(RAIZ, 'autonomo/bloques/mv-eco/capturas-realismo/mov'); await mkdir(OUT, { recursive: true });
const TIPOS = { '.html': 'text/html', '.mjs': 'text/javascript', '.js': 'text/javascript', '.css': 'text/css', '.jpg': 'image/jpeg', '.png': 'image/png' };
let pw; for (const r of ['playwright', '/opt/node22/lib/node_modules/playwright/index.mjs']) { try { pw = await import(r); break; } catch {} }
const srv = createServer(async (req, res) => { try { const r = join(RAIZ, decodeURIComponent(new URL(req.url, 'http://x').pathname)); if (!r.startsWith(RAIZ)) throw 0;
  res.writeHead(200, { 'content-type': TIPOS[extname(r)] || 'application/octet-stream' }); res.end(await readFile(r)); } catch { res.writeHead(404); res.end(); } });
await new Promise(r => srv.listen(0, '127.0.0.1', r));
console.log('PUERTO=' + srv.address().port);
const base = `http://127.0.0.1:${srv.address().port}/js/modules/eco/laboratorio.html`;
const nav = await pw.chromium.launch({ args: ['--use-gl=swiftshader', '--enable-unsafe-swiftshader'] });
const _QUE = process.argv[2], SOLO = process.env.SOLO?.split(','), IT = process.env.IT_PRESET || 'regtricus';
const quiere = (tipo, clave) => (!QUE || QUE === tipo) && (!SOLO || SOLO.includes(clave));
const errores = []; const OUT2 = join(RAIZ, 'autonomo/bloques/mv-eco/paso6/zoom2-capturas'); await mkdir(OUT2, { recursive: true });
for (const [w, h] of [[390, 844], [360, 800]]) for (const [esc, g, nom] of [['normal', null, 'normal'], ['tep', 1, 'tep']]) {
  const pg = await nav.newPage({ viewport: { width: w, height: h }, deviceScaleFactor: 2, hasTouch: true, isMobile: true });
  pg.on('pageerror', e => errores.push(`${w} ${nom}: ${e.message}`)); pg.on('console', m => m.type() === 'error' && errores.push(`${w} ${nom}: ${m.text()}`));
  await pg.goto(`${base}?depuracion=1&dibujo=2`); await pg.waitForTimeout(1500);
  await pg.waitForFunction(() => window.__ultimoDibujo?.eco, null, { timeout: 60000 });
  if (esc !== 'normal') { await pg.click(`[data-c="${esc}"]`); await pg.evaluate((g) => { const r = document.querySelector('#cv-grav'); r.value = g * 100; r.dispatchEvent(new Event('input')); r.dispatchEvent(new Event('change')); }, g); }
  await pg.waitForTimeout(1500);
  await pg.evaluate(() => window.__eco.vista('a4cVd')); await pg.waitForTimeout(800);
  const w0 = await pg.evaluate(() => document.querySelector('#cv-eco').width);
  await pg.click('#cv-zoom'); await pg.waitForTimeout(2500);
  const r = await pg.evaluate(() => { const c = document.querySelector('#cv-eco'); return { w: c.width, tr: c.style.transform, desb: document.documentElement.scrollWidth > innerWidth, pulsado: document.querySelector('#cv-zoom').getAttribute('aria-pressed') }; });
  console.log(w, nom, 'ancho lienzo', w0, '->', r.w, r.tr, 'desborde', r.desb, r.pulsado);
  if (w === 390) await (await pg.$('.cv-eco')).screenshot({ path: join(OUT2, `${nom}-zoom-a4cvd.png`) });
  await pg.click('#cv-zoom'); await pg.waitForTimeout(800); console.log(' quitar:', await pg.evaluate(() => document.querySelector('#cv-eco').width), await pg.evaluate(() => document.querySelector('#cv-eco').style.transform || 'sin transform'));
  await pg.close();
}
console.log('errores', errores.length, errores.slice(0, 5)); await nav.close(); srv.close();
