// Prueba rápida en un navegador real (Playwright + Chromium). Si Playwright no está instalado, se omite.
// Sirve la carpeta lab/circulacion con un servidor propio en un puerto libre: no hace falta arrancar nada.
import { test, before, after } from 'node:test';
import assert from 'node:assert/strict';
import { createServer } from 'node:http';
import { readFile } from 'node:fs/promises';
import { join, extname, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const RAIZ = join(dirname(fileURLToPath(import.meta.url)), '..');
const TIPOS = { '.html': 'text/html', '.mjs': 'text/javascript', '.js': 'text/javascript', '.jpg': 'image/jpeg', '.png': 'image/png' };
let pw = null;
for (const ruta of ['playwright', '/opt/node22/lib/node_modules/playwright/index.mjs']) { try { pw = await import(ruta); break; } catch { /* siguiente */ } }
const omitir = pw ? false : 'Playwright no está disponible';
// WebGL por software en entornos sin GPU (en un navegador normal no hace falta)
const ARGS = ['--use-gl=swiftshader', '--enable-unsafe-swiftshader'];

let servidor, base, nav;
before(async () => {
  if (!pw) return;
  servidor = createServer(async (req, res) => {
    try { const ruta = join(RAIZ, decodeURIComponent(new URL(req.url, 'http://x').pathname));
      if (!ruta.startsWith(RAIZ)) throw new Error('fuera');
      res.writeHead(200, { 'content-type': TIPOS[extname(ruta)] || 'application/octet-stream' }); res.end(await readFile(ruta));
    } catch { res.writeHead(404); res.end(); }
  });
  await new Promise(r => servidor.listen(0, '127.0.0.1', r));
  base = `http://127.0.0.1:${servidor.address().port}/`;
  nav = await pw.chromium.launch({ args: ARGS });
});
after(async () => { await nav?.close(); servidor?.close(); });

async function abrir(pagina, opciones = {}, navegador = nav) {
  const pg = await navegador.newPage({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 2, hasTouch: true, isMobile: true, ...opciones });
  const errores = []; pg.on('pageerror', e => errores.push(e.message)); pg.on('console', m => m.type() === 'error' && errores.push(m.text()));
  await pg.goto(base + pagina); await pg.waitForTimeout(1500);
  return { pg, errores };
}

test('el corazón se dibuja con WebGL, sin errores y sin desbordar a 390 px', { skip: omitir }, async () => {
  const { pg, errores } = await abrir('corazon-3d.html');
  const img = await pg.locator('#gl').screenshot();
  assert.ok(img.length > 40000, `el lienzo parece vacío (${img.length} bytes)`);
  assert.equal(await pg.locator('#estatico').isVisible(), false);
  assert.ok(!(await pg.evaluate(() => document.documentElement.scrollWidth > document.documentElement.clientWidth)), 'desborda en horizontal');
  assert.deepEqual(errores, []);
  await pg.close();
});

test('la barra del ciclo tiene las 7 fases y tocar una lleva a ella', { skip: omitir }, async () => {
  const { pg, errores } = await abrir('corazon-3d.html');
  assert.equal(await pg.locator('#ciclo button').count(), 7);
  for (const f of ['C', 'F', 'A']) { await pg.locator(`#ciclo button[data-fase="${f}"]`).tap(); await pg.waitForTimeout(150);
    assert.ok((await pg.textContent('#lFase')).startsWith(f), `tras tocar ${f}: ${await pg.textContent('#lFase')}`); }
  assert.deepEqual(errores, []);
  await pg.close();
});

test('deslizar en vertical sobre el corazón mueve la página; en horizontal lo gira', { skip: omitir }, async () => {
  const { pg } = await abrir('corazon-3d.html');
  const cdp = await pg.context().newCDPSession(pg), b = await pg.locator('.escena').boundingBox();
  const deslizar = async (x0, y0, dx, dy) => { await cdp.send('Input.dispatchTouchEvent', { type: 'touchStart', touchPoints: [{ x: x0, y: y0 }] });
    for (let i = 1; i <= 8; i++) await cdp.send('Input.dispatchTouchEvent', { type: 'touchMove', touchPoints: [{ x: x0 + dx * i / 8, y: y0 + dy * i / 8 }] });
    await cdp.send('Input.dispatchTouchEvent', { type: 'touchEnd', touchPoints: [] }); await pg.waitForTimeout(250); };
  await deslizar(b.x + 100, b.y + 300, 0, -240);
  assert.ok(await pg.evaluate(() => scrollY) > 100, 'la página no se ha desplazado');
  await pg.evaluate(() => scrollTo(0, 0)); await pg.waitForTimeout(150);
  const b2 = await pg.locator('.escena').boundingBox(), yaw0 = await pg.evaluate(() => window.__cam.yaw);
  await deslizar(b2.x + 60, b2.y + 150, 200, 2);
  assert.ok(Math.abs(await pg.evaluate(() => window.__cam.yaw) - yaw0) > 1, 'no ha girado');
  await pg.close();
});

test('un escenario de la página cambia la circulación (hemorragia: sube la FC)', { skip: omitir }, async () => {
  const { pg, errores } = await abrir('corazon-3d.html');
  await pg.click('[data-c="hemorragia"]'); for (let i = 0; i < 3; i++) await pg.click('#avanzar');
  const fc = +(await pg.textContent('#lLat')).match(/FC (\d+)/)[1];
  assert.ok(fc > 80, `FC tras la hemorragia: ${fc}`);
  assert.deepEqual(errores, []);
  await pg.close();
});

test('sin WebGL se ve la imagen fija con su aviso y las cifras siguen vivas', { skip: omitir }, async () => {
  const sinGL = await pw.chromium.launch({ args: ['--disable-webgl', '--disable-3d-apis'] });
  const { pg, errores } = await abrir('corazon-3d.html', {}, sinGL);
  assert.ok(await pg.locator('#estatico').isVisible(), 'no se ve la imagen fija');
  assert.ok(await pg.locator('#sinwebgl').isVisible(), 'no se ve el aviso');
  assert.equal(await pg.locator('#gl').isVisible(), false);
  const t0 = await pg.evaluate(() => window.__motor.s.t); await pg.waitForTimeout(600);
  assert.ok(await pg.evaluate(() => window.__motor.s.t) > t0, 'el motor no avanza');
  assert.equal(await pg.locator('#ciclo button').count(), 7);
  assert.deepEqual(errores, []);
  await sinGL.close();
});

test('la página del latido calcula en vivo y ninguna cifra queda fuera de su referencia sin estar marcada', { skip: omitir }, async () => {
  const { pg, errores } = await abrir('latido.html');
  const filas = await pg.locator('#tabla tr').count();
  assert.ok(filas > 25, `filas: ${filas}`);
  assert.equal(await pg.locator('#tabla td.bad').count(), 0, 'hay cifras fuera de rango sin marca de pendiente');
  assert.deepEqual(errores, []);
  await pg.close();
});
