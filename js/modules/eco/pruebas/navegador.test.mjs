// Prueba rápida en un navegador real (Playwright + Chromium). Si Playwright no está instalado, se omite.
// Sirve el repositorio con un servidor propio en un puerto libre (la página del laboratorio carga el CSS de la app):
// no hace falta arrancar nada.
import { test, before, after } from 'node:test';
import assert from 'node:assert/strict';
import { createServer } from 'node:http';
import { readFile } from 'node:fs/promises';
import { join, extname, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const RAIZ = join(dirname(fileURLToPath(import.meta.url)), '..', '..', '..', '..');
const TIPOS = { '.html': 'text/html', '.mjs': 'text/javascript', '.js': 'text/javascript', '.css': 'text/css', '.jpg': 'image/jpeg', '.png': 'image/png' };
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
  const { pg, errores } = await abrir('js/modules/eco/laboratorio.html');
  const img = await pg.locator('#cv-gl').screenshot();
  assert.ok(img.length > 40000, `el lienzo parece vacío (${img.length} bytes)`);
  assert.equal(await pg.locator('#cv-estatico').isVisible(), false);
  assert.ok(!(await pg.evaluate(() => document.documentElement.scrollWidth > document.documentElement.clientWidth)), 'desborda en horizontal');
  assert.deepEqual(errores, []);
  await pg.close();
});

test('la barra del ciclo tiene las 7 fases y tocar una lleva a ella', { skip: omitir }, async () => {
  const { pg, errores } = await abrir('js/modules/eco/laboratorio.html');
  assert.equal(await pg.locator('#cv-ciclo button').count(), 7);
  for (const f of ['C', 'F', 'A']) { await pg.locator(`#cv-ciclo button[data-fase="${f}"]`).tap(); await pg.waitForTimeout(150);
    assert.ok((await pg.textContent('#cv-l-fase')).startsWith(f), `tras tocar ${f}: ${await pg.textContent('#cv-l-fase')}`); }
  assert.deepEqual(errores, []);
  await pg.close();
});

test('deslizar en vertical sobre el corazón mueve la página; en horizontal lo gira', { skip: omitir }, async () => {
  const { pg } = await abrir('js/modules/eco/laboratorio.html');
  // el corazón no está arriba del todo: se lleva a la pantalla antes de deslizar sobre él
  await pg.locator('.cv-escena').scrollIntoViewIfNeeded(); await pg.waitForTimeout(150);
  const cdp = await pg.context().newCDPSession(pg), b = await pg.locator('.cv-escena').boundingBox(), y0 = await pg.evaluate(() => scrollY);
  const deslizar = async (x0, y0, dx, dy) => { await cdp.send('Input.dispatchTouchEvent', { type: 'touchStart', touchPoints: [{ x: x0, y: y0 }] });
    for (let i = 1; i <= 8; i++) await cdp.send('Input.dispatchTouchEvent', { type: 'touchMove', touchPoints: [{ x: x0 + dx * i / 8, y: y0 + dy * i / 8 }] });
    await cdp.send('Input.dispatchTouchEvent', { type: 'touchEnd', touchPoints: [] }); await pg.waitForTimeout(250); };
  await deslizar(b.x + 100, b.y + Math.min(300, b.height - 40), 0, -240);
  assert.ok(await pg.evaluate(() => scrollY) > y0 + 100, 'la página no se ha desplazado');
  await pg.locator('.cv-escena').scrollIntoViewIfNeeded(); await pg.waitForTimeout(150);
  const b2 = await pg.locator('.cv-escena').boundingBox(), yaw0 = await pg.evaluate(() => window.__cam.yaw);
  await deslizar(b2.x + 60, b2.y + 150, 200, 2);
  assert.ok(Math.abs(await pg.evaluate(() => window.__cam.yaw) - yaw0) > 1, 'no ha girado');
  await pg.close();
});

test('un escenario de la página cambia la circulación (hemorragia: sube la FC)', { skip: omitir }, async () => {
  const { pg, errores } = await abrir('js/modules/eco/laboratorio.html');
  await pg.click('[data-c="hemorragia"]'); for (let i = 0; i < 3; i++) await pg.click('#cv-avanzar');
  const fc = +(await pg.textContent('#cv-l-lat')).match(/FC (\d+)/)[1];
  assert.ok(fc > 80, `FC tras la hemorragia: ${fc}`);
  assert.deepEqual(errores, []);
  await pg.close();
});

test('mando de gravedad: aparece en los escenarios que lo tienen, se aplica al soltar y el derrame a fondo colapsa el VD', { skip: omitir }, async () => {
  const { pg, errores } = await abrir('js/modules/eco/laboratorio.html?depuracion=1');
  assert.equal(await pg.locator('#cv-gravedad').isHidden(), true, 'oculto en el escenario normal');
  await pg.click('[data-c="vasoplejia"]'); assert.equal(await pg.locator('#cv-gravedad').isHidden(), true, 'la vasoplejía no tiene mando');
  await pg.click('[data-c="derrame"]');
  assert.equal(await pg.locator('#cv-gravedad').isVisible(), true);
  assert.match(await pg.textContent('#cv-grav-txt'), /260 mL de derrame/);
  const poner = async (v) => { await pg.$eval('#cv-grav', (el, x) => { el.value = x; el.dispatchEvent(new Event('input', { bubbles: true })); el.dispatchEvent(new Event('change', { bubbles: true })); }, v); await pg.waitForTimeout(300); };
  await poner(100); assert.match(await pg.textContent('#cv-grav-txt'), /388 mL de derrame/);
  const pam = await pg.evaluate(() => window.__motor.ultimo.pam), liq = await pg.evaluate(() => window.__motor.p.liquidoPeri);
  assert.ok(Math.abs(liq - 388) < 1e-6, `líquido ${liq}`); assert.ok(pam >= 45 && pam <= 60, `PAM ${pam}`);
  await poner(0); assert.equal(await pg.evaluate(() => window.__motor.p.liquidoPeri), 0);
  await pg.click('[data-c="hemorragia"]'); assert.match(await pg.textContent('#cv-grav-txt'), /1000 mL perdidos/);
  assert.ok(await pg.evaluate(() => document.documentElement.scrollWidth <= innerWidth), 'sin desborde');
  assert.deepEqual(errores, []);
  await pg.close();
});

// La regla de la sincronización: en cada fotograma, el corazón, el cursor del Wiggers y el punto del asa
// salen del mismo estado (window.__ultimoDibujo lo guarda al dibujar).
const ultimoDibujo = (pg) => pg.evaluate(() => new Promise(r => requestAnimationFrame(() => requestAnimationFrame(() => {
  const d = window.__ultimoDibujo; r({ t: d.estado.tLatido, vvi: d.estado.vvi, fase: d.estado.fase, rev: !!d.estado.revisando, estVvi: d.est?.vvi, cur: d.cursor }); }))));

test('Wiggers y asa: en tiempo real el corazón y el cursor leen el mismo instante en cada fotograma', { skip: omitir }, async () => {
  const { pg, errores } = await abrir('js/modules/eco/laboratorio.html');
  for (const id of ['#cv-wig', '#cv-pvc']) { const img = await pg.locator(id).screenshot(); assert.ok(img.length > 15000, `${id} parece vacío (${img.length} bytes)`); }
  for (let i = 0; i < 5; i++) {
    const d = await ultimoDibujo(pg);
    assert.equal(d.rev, false);
    assert.equal(d.estVvi, d.vvi, 'el corazón y el diagrama leen volúmenes distintos');
    assert.equal(d.cur.t, d.t); assert.equal(d.cur.v, d.vvi);
  }
  assert.ok(!(await pg.evaluate(() => document.documentElement.scrollWidth > document.documentElement.clientWidth)), 'desborda en horizontal');
  assert.deepEqual(errores, []);
  await pg.close();
});

test('deslizar sobre el Wiggers revisa ese instante del último latido: corazón, cursor, fase y cifras a la vez', { skip: omitir }, async () => {
  const { pg, errores } = await abrir('js/modules/eco/laboratorio.html');
  await pg.locator('#cv-wig').scrollIntoViewIfNeeded();
  const b = await pg.locator('#cv-wig').boundingBox();
  await pg.mouse.move(b.x + b.width * 0.2, b.y + b.height * 0.5); await pg.mouse.down();
  await pg.mouse.move(b.x + b.width * 0.6, b.y + b.height * 0.5, { steps: 6 }); await pg.mouse.up();
  const d = await ultimoDibujo(pg), T = await pg.evaluate(() => window.__motor.ultimo.periodo);
  assert.equal(d.rev, true, 'no ha entrado en revisión');
  assert.ok(d.t > 0.45 * T && d.t < 0.65 * T, `t revisado ${d.t.toFixed(3)} de ${T.toFixed(3)}`);
  assert.equal(d.estVvi, d.vvi, 'el corazón no muestra el instante revisado');
  assert.equal(d.cur.t, d.t);
  assert.ok((await pg.textContent('#cv-l-fase')).startsWith(d.fase));
  assert.match(await pg.textContent('#cv-hud'), /revisando/);
  // en revisión el motor no avanza
  const t0 = await pg.evaluate(() => window.__motor.s.t); await pg.waitForTimeout(300);
  assert.equal(await pg.evaluate(() => window.__motor.s.t), t0);
  // Reanudar vuelve al tiempo real
  await pg.click('#cv-pausa'); const d2 = await ultimoDibujo(pg);
  assert.equal(d2.rev, false); assert.equal(d2.estVvi, d2.vvi);
  assert.deepEqual(errores, []);
  await pg.close();
});

test('tocar el asa revisa el instante más cercano; el lado derecho también se dibuja', { skip: omitir }, async () => {
  const { pg, errores } = await abrir('js/modules/eco/laboratorio.html');
  await pg.locator('#cv-pvc').scrollIntoViewIfNeeded();
  const b = await pg.locator('#cv-pvc').boundingBox();
  await pg.mouse.click(b.x + b.width * 0.5, b.y + b.height * 0.3);
  const d = await ultimoDibujo(pg);
  assert.equal(d.rev, true); assert.equal(d.estVvi, d.vvi);
  await pg.click('[data-lado="derecho"]');
  const v = await pg.evaluate(() => new Promise(r => requestAnimationFrame(() => requestAnimationFrame(() => r(window.__ultimoDibujo)))));
  assert.equal(v.cursor.v, v.estado.vvd, 'el lado derecho no sigue al VD');
  assert.deepEqual(errores, []);
  await pg.close();
});

test('con el latido estable se usan las formas precalculadas, sin perder la sincronía; con corte o sin ellas, geometría exacta', { skip: omitir }, async () => {
  const { pg, errores } = await abrir('js/modules/eco/laboratorio.html');
  await pg.waitForFunction(() => window.__tabla.lista && window.__ultimoDibujo?.modo === 'mezcla', null, { timeout: 40000 });
  for (let i = 0; i < 3; i++) { const d = await ultimoDibujo(pg); assert.equal(d.estVvi, d.vvi); assert.equal(d.cur.t, d.t); }
  assert.match(await pg.textContent('#cv-fps'), /formas/);
  const modo = () => pg.evaluate(() => new Promise(r => requestAnimationFrame(() => requestAnimationFrame(() => r(window.__ultimoDibujo.modo)))));
  // revisar un instante del último latido también usa la mezcla
  await pg.evaluate(() => window.__revisar(0.3)); assert.equal(await modo(), 'mezcla');
  await pg.click('#cv-formas'); assert.equal(await modo(), 'exacta');
  await pg.click('#cv-formas'); await pg.waitForFunction(() => window.__tabla.lista, null, { timeout: 40000 }); assert.equal(await modo(), 'mezcla');
  await pg.click('[data-v="4c"]'); assert.equal(await modo(), 'exacta', 'con corte cambia la topología');
  assert.deepEqual(errores, []);
  await pg.close();
});

test('la ecografía corta el corazón en el mismo instante, en cada vista, y sigue la revisión', { skip: omitir }, async () => {
  const { pg, errores } = await abrir('js/modules/eco/laboratorio.html');
  await pg.waitForFunction(() => window.__ultimoDibujo?.eco, null, { timeout: 30000 });
  const tras = (fn) => pg.evaluate(fn => new Promise(r => requestAnimationFrame(() => requestAnimationFrame(() => r(eval(fn))))), fn);
  // en pausa (sin throttle que espere), la imagen y el corazón leen el mismo estado
  for (const v of ['a4c', 'plax', 'psaxMv', 'a2c']) {
    await pg.evaluate((v) => { window.__eco.vista(v); window.__revisar(0.2 + Math.random() * 0.4); }, v);
    await pg.waitForTimeout(150);
    const d = await tras('({ t: window.__ultimoDibujo.estado.tLatido, eco: window.__eco.info() })');
    assert.equal(d.eco.vista, v); assert.equal(d.eco.t, d.t, `${v}: la ecografía va en otro instante`);
    assert.equal(d.eco.abiertos, 0, `${v}: pared sin cerrar`);
    // en el eje corto mitral, en sístole, la base baja por debajo del corte y puede no haber VI
    if (v !== 'psaxMv') assert.ok(d.eco.rotulos.includes('VI'), `${v}: no se rotula el VI`); else assert.ok(d.eco.rotulos.length, `${v}: sin rótulos`);
  }
  const img = await pg.locator('#cv-eco').screenshot(); assert.ok(img.length > 30000, `la imagen parece vacía (${img.length} bytes)`);
  // con corte, la ecografía usa su propia geometría completa (el corte no la recorta)
  // (fuera de la pantalla no se calcula: el clic baja la página, así que se vuelve a la ecografía)
  await pg.click('[data-v="4c"]'); await pg.locator('#cv-eco').scrollIntoViewIfNeeded(); await pg.evaluate(() => window.__revisar(0.35)); await pg.waitForTimeout(400);
  const c = await tras('({ ...window.__eco.info(), tCorazon: window.__ultimoDibujo.estado.tLatido })');
  assert.equal(c.propia, true); assert.equal(c.t, c.tCorazon); assert.ok(Math.abs(c.t - 0.35) < 0.003); assert.equal(c.abiertos, 0);
  assert.ok(!(await pg.evaluate(() => document.documentElement.scrollWidth > document.documentElement.clientWidth)), 'desborda en horizontal');
  assert.deepEqual(errores, []);
  await pg.close();
});

test('sin WebGL se ve la imagen fija con su aviso y las cifras siguen vivas', { skip: omitir }, async () => {
  const sinGL = await pw.chromium.launch({ args: ['--disable-webgl', '--disable-3d-apis'] });
  const { pg, errores } = await abrir('js/modules/eco/laboratorio.html', {}, sinGL);
  assert.ok(await pg.locator('#cv-estatico').isVisible(), 'no se ve la imagen fija');
  assert.ok(await pg.locator('#cv-sinwebgl').isVisible(), 'no se ve el aviso');
  assert.equal(await pg.locator('#cv-gl').isVisible(), false);
  const t0 = await pg.evaluate(() => window.__motor.s.t); await pg.waitForTimeout(600);
  assert.ok(await pg.evaluate(() => window.__motor.s.t) > t0, 'el motor no avanza');
  assert.equal(await pg.locator('#cv-ciclo button').count(), 7);
  assert.equal(await pg.locator('#cv-tarjeta-eco .cv-eco').isVisible(), false, 'sin WebGL no hay ecografía');
  assert.deepEqual(errores, []);
  await sinGL.close();
});

test('la página del latido calcula en vivo y ninguna cifra queda fuera de su referencia sin estar marcada', { skip: omitir }, async () => {
  const { pg, errores } = await abrir('js/modules/eco/latido.html');
  const filas = await pg.locator('#tabla tr').count();
  assert.ok(filas > 25, `filas: ${filas}`);
  assert.equal(await pg.locator('#tabla td.bad').count(), 0, 'hay cifras fuera de rango sin marca de pendiente');
  assert.deepEqual(errores, []);
  await pg.close();
});

test('modo M: cada columna sale de la imagen B del mismo instante, la pausa congela el trazado y los calibres miden', { skip: omitir }, async () => {
  const { pg, errores } = await abrir('js/modules/eco/laboratorio.html');
  await pg.evaluate(() => document.querySelectorAll('#cv-sim details').forEach(d => { d.open = false; }));
  await pg.locator('[data-modo="M"]').tap(); await pg.locator('[data-medir="tapse"]').tap();
  await pg.waitForFunction(() => window.__eco.modoM.estado.tEscrito != null, null, { timeout: 20000 });
  // la última columna escrita es la del instante de la última imagen B
  for (let i = 0; i < 3; i++) {
    const d = await pg.evaluate(() => new Promise(r => requestAnimationFrame(() => r({ t: window.__eco.info().tMotor, m: window.__eco.modoM.estado.tEscrito, vista: window.__eco.info().vista }))));
    assert.equal(d.vista, 'a4c'); assert.equal(d.m, d.t, 'el modo M va en otro instante que la imagen B');
    await pg.waitForTimeout(200);
  }
  await pg.click('#cv-pausa'); await pg.waitForTimeout(200);
  const t0 = await pg.evaluate(() => window.__eco.modoM.estado.tEscrito); await pg.waitForTimeout(500);
  assert.equal(await pg.evaluate(() => window.__eco.modoM.estado.tEscrito), t0, 'en pausa el trazado sigue escribiéndose');
  // calibres: 10 % de la altura del trazado = 17 mm de profundidad en el 4 cámaras (170 mm)
  await pg.evaluate(() => window.__eco.modoM.ponerCalibres({ x: 0.3, y: 0.5 }, { x: 0.4, y: 0.6 }));
  assert.match(await pg.textContent('#cv-m-resultado'), /TAPSE medido: 17,0 mm/);
  // diámetros del VI: cambia al eje largo y, con LVDd y LVSd guardados, aparece el paso a la calculadora de FS
  await pg.locator('[data-medir="vi"]').tap();
  await pg.click('#cv-pausa'); await pg.waitForFunction(() => window.__eco.info()?.vista === 'plax', null, { timeout: 10000 }); await pg.click('#cv-pausa');
  await pg.evaluate(() => window.__eco.modoM.ponerCalibres({ x: 0.2, y: 0.4 }, { x: 0.2, y: 0.7 })); await pg.click('#cv-m-lvdd');
  await pg.evaluate(() => window.__eco.modoM.ponerCalibres({ x: 0.3, y: 0.45 }, { x: 0.3, y: 0.6 })); await pg.click('#cv-m-lvsd');
  assert.match(await pg.textContent('#cv-m-resultado'), /FS \d+%/);
  assert.equal(await pg.locator('#cv-m-a-fs').count(), 1);
  assert.ok(!(await pg.evaluate(() => document.documentElement.scrollWidth > document.documentElement.clientWidth)), 'desborda en horizontal');
  assert.deepEqual(errores, []);
  await pg.close();
});

test('sonda libre: los mandos mueven el corte, se reconoce la vista y el reto se cumple al llegar', { skip: omitir }, async () => {
  const { pg, errores } = await abrir('js/modules/eco/laboratorio.html');
  await pg.evaluate(() => document.querySelectorAll('#cv-sim details').forEach(d => { d.open = false; }));
  await pg.click('#cv-sonda-toggle'); assert.equal(await pg.locator('#cv-sonda').isVisible(), true);
  const plano = () => pg.evaluate(() => new Promise(r => setTimeout(() => r(window.__eco.info()), 400)));
  const p0 = await plano();
  // un deslizador real: rotar
  await pg.locator('#cv-sonda-rot').fill('76'); await pg.locator('#cv-sonda-incl').fill('12');
  const p1 = await plano();
  assert.equal(p1.sonda.rot, 76); assert.ok(Math.abs(p1.plano.n[0] - p0.plano.n[0]) + Math.abs(p1.plano.n[1] - p0.plano.n[1]) > 0.3, 'el plano no se ha movido');
  assert.match(await pg.textContent('#cv-sonda-estado'), /se parece más a A2C/);
  assert.match(await pg.textContent('#cv-eco-titulo'), /sonda libre/);
  // reto de pasar del 4 al 2 cámaras: con la sonda en su sitio se cumple
  await pg.evaluate(() => { window.__eco.sonda({}); window.__eco.reto({ objetivo: 'a2c', desde: 'a4c' }); });
  await pg.waitForTimeout(400); assert.match(await pg.textContent('#cv-sonda-reto-txt'), /Te faltan/);
  await pg.evaluate(() => window.__eco.sonda({ rot: 76, incl: 12 })); await pg.waitForTimeout(400);
  assert.match(await pg.textContent('#cv-sonda-reto-txt'), /Encontrada/);
  // cambiar de vista vuelve a la estándar y cancela el reto
  await pg.click('[data-eco="plax"]'); await pg.waitForTimeout(400);
  assert.equal(await pg.inputValue('#cv-sonda-rot'), '0'); assert.equal(await pg.locator('#cv-sonda-reto-txt').isVisible(), false);
  assert.ok(!(await pg.evaluate(() => document.documentElement.scrollWidth > document.documentElement.clientWidth)), 'desborda en horizontal');
  assert.deepEqual(errores, []);
  await pg.close();
});

test('Doppler: la muestra en la mitral escribe el espectro y da E/A; el color pinta píxeles; el abdomen se oculta y vuelve', { skip: omitir }, async () => {
  const { pg, errores } = await abrir('js/modules/eco/laboratorio.html');
  await pg.locator('[data-modo="D"]').tap(); await pg.waitForTimeout(300);
  assert.equal(await pg.locator('#cv-d-zona').isVisible(), true);
  await pg.locator('[data-muestra="mitral"]').tap(); await pg.waitForTimeout(3500);
  const info = await pg.evaluate(() => window.__eco.info());
  assert.equal(info.fuente, 'Mitral'); assert.equal(info.medidas.tipo, 'llenado');
  assert.match(await pg.textContent('#cv-d-resultado'), /E\/A/);
  // el espectro tiene columnas escritas (píxeles claros)
  const claros = await pg.evaluate(() => { const c = document.getElementById('cv-d'), d = c.getContext('2d').getImageData(0, 0, c.width, c.height).data; let n = 0; for (let i = 0; i < d.length; i += 4) if (d[i] > 150) n++; return n; });
  assert.ok(claros > 200, `espectro casi vacío (${claros})`);
  // TSVI: cambia a A3C y da el ITV
  await pg.locator('[data-muestra="tsvi"]').tap(); await pg.waitForTimeout(3000);
  assert.equal(await pg.evaluate(() => window.__eco.info().vista), 'a3c');
  assert.match(await pg.textContent('#cv-d-resultado'), /ITV/);
  // color en diástole, en A4C: hay píxeles rojos (hacia la sonda)
  await pg.locator('#cv-color').check(); await pg.evaluate(() => { window.__eco.vista('a4c'); window.__revisar(0.6); }); await pg.waitForTimeout(1200);
  const rojos = await pg.evaluate(() => { const c = document.getElementById('cv-eco'), d = c.getContext('2d').getImageData(0, 0, c.width, c.height).data; let n = 0; for (let i = 0; i < d.length; i += 4) if (d[i] > 150 && d[i + 2] < 40 && d[i + 1] < 120) n++; return n; });
  assert.ok(rojos > 300, `sin color (${rojos})`);
  // abdomen: en el HUD con la VCI; al quitar «Hígado y diafragma» la VCI sigue (es la entrada de la AD)
  assert.match(await pg.textContent('#cv-hud'), /VCI \d+ mm/);
  const nombres = () => pg.evaluate(() => window.__ultimoDibujo.abdomen3d.map(x => x[0]));
  assert.ok((await nombres()).includes('Hígado'));
  await pg.locator('#cv-abdomen').uncheck(); await pg.waitForTimeout(400);
  assert.match(await pg.textContent('#cv-hud'), /VCI \d+ mm/);
  assert.deepEqual(await nombres(), ['Vena cava inferior']);
  assert.ok(!(await pg.evaluate(() => document.documentElement.scrollWidth > document.documentElement.clientWidth)), 'desborda en horizontal');
  assert.deepEqual(errores, []);
  await pg.close();
});

test('revisión, corte, cambio de vista y escala: VCI quieta al revisar, VCI recortada, muestra y calibres que se reinician', { skip: omitir }, async () => {
  const { pg, errores } = await abrir('js/modules/eco/laboratorio.html');
  // revisar el último latido no mueve la respiración: misma VCI en dos instantes del latido
  const insp = async (t) => { await pg.evaluate((t) => window.__revisar(t), t); await pg.waitForTimeout(250); return pg.evaluate(() => window.__ultimoDibujo.vci); };
  const a = await insp(0.05), b = await insp(0.6);
  assert.equal(a.inspiracion, b.inspiracion, `${a.inspiracion} frente a ${b.inspiracion}`);
  // con el corte, en el 3D queda solo la VCI, recortada como el corazón (menos triángulos que entera)
  const entera = (await pg.evaluate(() => window.__ultimoDibujo.abdomen3d)).find(x => x[0] === 'Vena cava inferior')[1];
  await pg.locator('#cv-corte').check(); await pg.waitForTimeout(500);
  const conCorte = await pg.evaluate(() => window.__ultimoDibujo.abdomen3d);
  assert.equal(conCorte.length, 1); assert.equal(conCorte[0][0], 'Vena cava inferior');
  // girando el corte: según el ángulo la VCI se queda entera, se recorta (el plano la atraviesa) o se va con la AD
  const tris = [];
  for (let phi = 0; phi <= 620; phi += 20) {
    await pg.evaluate((v) => { const r = document.getElementById('cv-phi'); r.value = v; r.dispatchEvent(new Event('input', { bubbles: true })); }, phi);
    await pg.waitForTimeout(150); tris.push(await pg.evaluate(() => (window.__ultimoDibujo.abdomen3d.find(x => x[0] === 'Vena cava inferior') || [0, 0])[1]));
  }
  assert.ok(tris.some(n => n > 0 && n < entera), `${tris} frente a ${entera}`);
  await pg.locator('#cv-corte').uncheck();
  // Doppler: la muestra de la mitral no se queda en otra vista; en A3C va al TSVI
  await pg.evaluate(() => window.__eco.modo('D')); await pg.locator('[data-muestra="mitral"]').tap(); await pg.waitForTimeout(300);
  const enA4c = await pg.evaluate(() => window.__eco.info().muestra);
  await pg.evaluate(() => window.__eco.vista('plax')); await pg.waitForTimeout(300);
  assert.notDeepEqual(await pg.evaluate(() => window.__eco.info().muestra), enA4c);
  assert.equal(await pg.locator('[data-muestra].on').count(), 0);
  await pg.evaluate(() => window.__eco.vista('a3c')); await pg.waitForTimeout(300);
  assert.equal(await pg.locator('[data-muestra="tsvi"].on').count(), 1);
  // mover la sonda: el preajuste deja de estar marcado y las medidas vuelven a empezar
  await pg.waitForTimeout(2500); const antes = await pg.textContent('#cv-d-resultado');
  await pg.evaluate(() => window.__eco.sonda({ rot: 20 })); await pg.waitForTimeout(300);
  assert.equal(await pg.locator('[data-muestra].on').count(), 0);
  assert.notEqual(await pg.textContent('#cv-d-resultado'), antes);   // medidas rehechas con la sonda nueva
  // calibres del espectro: cambiar la escala los borra (medían con la anterior)
  await pg.evaluate(() => window.__eco.doppler.espectro.ponerCalibres({ x: 0.2, y: 0.3 }, { x: 0.4, y: 0.4 }));
  assert.equal(await pg.locator('#cv-d-calibres').isVisible(), true);
  await pg.selectOption('#cv-d-escala', '60'); await pg.waitForTimeout(100);
  assert.equal(await pg.evaluate(() => window.__eco.doppler.espectro.estado.vmax), 60);
  assert.equal(await pg.locator('#cv-d-calibres').isVisible(), false);
  assert.equal(await pg.evaluate(() => window.__eco.doppler.espectro.medida()), null);
  assert.deepEqual(errores, []);
  await pg.close();
});

test('fase 5: vistas subcostales y supraesternal, la VCI medida en modo M y la suprahepática en el Doppler', { skip: omitir }, async () => {
  const { pg, errores } = await abrir('js/modules/eco/laboratorio.html');
  for (const k of ['sc4c', 'scVci', 'sse']) assert.equal(await pg.locator(`[data-eco="${k}"]`).count(), 1, k);
  await pg.locator('[data-eco="sse"]').tap(); await pg.waitForTimeout(500);
  assert.ok((await pg.evaluate(() => window.__eco.info().rotulos)).includes('Arco'));
  // VCI: la medida guiada pasa a la subcostal VCI con un barrido de 6 s
  await pg.locator('[data-modo="M"]').tap(); await pg.locator('[data-medir="vci"]').tap(); await pg.waitForTimeout(500);
  assert.equal(await pg.evaluate(() => window.__eco.info().vista), 'scVci');
  assert.equal(await pg.evaluate(() => window.__eco.modoM.estado.barrido), 6);
  assert.equal(await pg.locator('#cv-m-vci').isVisible(), true);
  // 10 % y 8 % de la altura del trazado = 17 y 13,6 mm de profundidad (170 mm): colapso del 20 %
  await pg.evaluate(() => window.__eco.modoM.ponerCalibres({ x: 0.2, y: 0.5 }, { x: 0.2, y: 0.6 })); await pg.click('#cv-m-dmax');
  await pg.evaluate(() => window.__eco.modoM.ponerCalibres({ x: 0.5, y: 0.5 }, { x: 0.5, y: 0.58 })); await pg.click('#cv-m-dmin');
  const txt = await pg.textContent('#cv-m-resultado');
  assert.match(txt, /colapso 20%/); assert.match(txt, /En el modelo, con PVC/);
  assert.equal(await pg.locator('#cv-m-a-vci').count(), 1);
  // Doppler: la suprahepática da S, D y A
  await pg.locator('[data-modo="D"]').tap(); await pg.locator('[data-muestra="suprahep"]').tap(); await pg.waitForTimeout(3000);
  const info = await pg.evaluate(() => window.__eco.info());
  assert.match(info.fuente, /suprahepática/); assert.equal(info.medidas.tipo, 'hepatica');
  assert.ok(!(await pg.evaluate(() => document.documentElement.scrollWidth > document.documentElement.clientWidth)), 'desborda en horizontal');
  assert.deepEqual(errores, []);
  await pg.close();
});
