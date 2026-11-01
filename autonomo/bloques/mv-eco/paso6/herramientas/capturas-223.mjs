// 223 · capturas de la mitral con el dibujo nuevo: eje corto mitral, A4C, A2C y PLAX, abierta (fase F, llenado rápido) y cerrada (fase C).
// uso: node autonomo/bloques/mv-eco/paso6/herramientas/capturas-223.mjs  → autonomo/bloques/mv-eco/paso6/festones-223-capturas/
import { createServer } from 'node:http';
import { readFile, writeFile } from 'node:fs/promises';
import { join, extname, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
const RAIZ = join(dirname(fileURLToPath(import.meta.url)), '..', '..', '..', '..', '..');
const OUT = join(RAIZ, 'autonomo/bloques/mv-eco/paso6/festones-223-capturas');
const TIPOS = { '.html': 'text/html', '.mjs': 'text/javascript', '.js': 'text/javascript', '.css': 'text/css', '.jpg': 'image/jpeg', '.png': 'image/png' };
let pw; for (const r of ['playwright', '/opt/node22/lib/node_modules/playwright/index.mjs']) { try { pw = await import(r); break; } catch {} }
const srv = createServer(async (req, res) => { try { const r = join(RAIZ, decodeURIComponent(new URL(req.url, 'http://x').pathname)); if (!r.startsWith(RAIZ)) throw 0;
  res.writeHead(200, { 'content-type': TIPOS[extname(r)] || 'application/octet-stream' }); res.end(await readFile(r)); } catch { res.writeHead(404); res.end(); } });
await new Promise(r => srv.listen(0, '127.0.0.1', r));
const base = `http://127.0.0.1:${srv.address().port}/js/modules/eco/laboratorio.html`;
const nav = await pw.chromium.launch({ args: ['--use-gl=swiftshader', '--enable-unsafe-swiftshader'] });
// clave, escenario, g (null = sin mando), vista, dibujo
import { mkdir } from 'node:fs/promises';
await mkdir(OUT, { recursive: true });
const errores = [];
for (const vista of (process.env.VISTAS || 'psaxMv,a4c,a2c,plax').split(',')) for (const fase of (process.env.FASES || 'F,C').split(',')) {
  const pg = await nav.newPage({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 2, hasTouch: true, isMobile: true });
  pg.on('pageerror', e => errores.push(`${vista}: ${e.message}`)); pg.on('console', m => m.type() === 'error' && errores.push(`${vista}: ${m.text()}`));
  await pg.goto(`${base}?depuracion=1&dibujo=2`); await pg.waitForTimeout(1500);
  await pg.waitForFunction(() => window.__ultimoDibujo?.eco, null, { timeout: 60000 });
  await pg.evaluate((v) => window.__eco.vista(v), vista);
  await pg.waitForSelector(`#cv-ciclo button[data-fase="${fase}"]`, { timeout: 60000 });
  await pg.click(`#cv-ciclo button[data-fase="${fase}"]`); await pg.waitForTimeout(1500);
  await pg.evaluate(() => new Promise(r => requestAnimationFrame(() => requestAnimationFrame(r))));
  const lienzo = pg.locator('#cv-eco'); await lienzo.scrollIntoViewIfNeeded();
  await lienzo.screenshot({ path: join(OUT, `${vista}-${fase}.png`) });
  console.log(vista, fase, await pg.evaluate(() => document.getElementById('cv-eco-fase')?.textContent.trim()));
  await pg.close();
}
await nav.close(); srv.close(); console.log('errores:', errores);
