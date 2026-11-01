// P5-0 · movimiento (4 fases), modo M (TAPSE) y Doppler con el dibujo nuevo (?dibujo=2), 390×844, y sus cifras en texto del monitor.
// uso: node capturas-mov-doppler.mjs [movimiento|tapse|doppler]   (sin argumento, las tres)
//  SOLO=clave1,clave2  → solo esas capturas.   IT_PRESET=<data-muestra de la IT CW> (por defecto «regtricus»): si el botón no existe, se avisa y se salta.
// salida: autonomo/bloques/mv-eco/capturas-realismo/mov/<clave>.png y cifras-mov-doppler.md
import { createServer } from 'node:http';
import { readFile, writeFile, mkdir } from 'node:fs/promises';
import { join, extname, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
const RAIZ = join(dirname(fileURLToPath(import.meta.url)), '..', '..', '..', '..');
const OUT = join(RAIZ, 'autonomo/bloques/mv-eco/capturas-realismo/mov'); await mkdir(OUT, { recursive: true });
const TIPOS = { '.html': 'text/html', '.mjs': 'text/javascript', '.js': 'text/javascript', '.css': 'text/css', '.jpg': 'image/jpeg', '.png': 'image/png' };
let pw; for (const r of ['playwright', '/opt/node22/lib/node_modules/playwright/index.mjs']) { try { pw = await import(r); break; } catch {} }
const srv = createServer(async (req, res) => { try { const r = join(RAIZ, decodeURIComponent(new URL(req.url, 'http://x').pathname)); if (!r.startsWith(RAIZ)) throw 0;
  res.writeHead(200, { 'content-type': TIPOS[extname(r)] || 'application/octet-stream' }); res.end(await readFile(r)); } catch { res.writeHead(404); res.end(); } });
await new Promise(r => srv.listen(0, '127.0.0.1', r));
console.log('PUERTO=' + srv.address().port);
const base = `http://127.0.0.1:${srv.address().port}/js/modules/eco/laboratorio.html`;
const nav = await pw.chromium.launch({ args: ['--use-gl=swiftshader', '--enable-unsafe-swiftshader'] });
const QUE = process.argv[2], SOLO = process.env.SOLO?.split(','), IT = process.env.IT_PRESET || 'regtricus';
const quiere = (tipo, clave) => (!QUE || QUE === tipo) && (!SOLO || SOLO.includes(clave));
const errores = []; let md = '# Cifras de la app en cada captura de movimiento y Doppler (dibujo 2, 390 px)\nOrigen: «monitor» = texto que enseña la app (#cv-l-vi, #cv-d-resultado, #cv-m-resultado, #cv-l-lat); «derivado» = cuenta sobre cifras del monitor; «anatomia.mjs» = tapseDeLatido(motor.ultimo) porque la app solo lo enseña al poner calibres.\n\n';
async function abrir(clave, esc, g, vista) {
  const pg = await nav.newPage({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 2, hasTouch: true, isMobile: true });
  pg.on('pageerror', e => errores.push(`${clave}: ${e.message}`)); pg.on('console', m => m.type() === 'error' && errores.push(`${clave}: ${m.text()}`));
  await pg.goto(`${base}?depuracion=1&dibujo=2`); await pg.waitForTimeout(1500);
  await pg.waitForFunction(() => window.__ultimoDibujo?.eco, null, { timeout: 60000 });
  if (esc !== 'normal') { await pg.click(`[data-c="${esc}"]`);
    if (g != null) await pg.evaluate((g) => { const r = document.querySelector('#cv-grav'); r.value = g * 100; r.dispatchEvent(new Event('input')); r.dispatchEvent(new Event('change')); }, g); }
  await pg.waitForTimeout(1500);
  await pg.evaluate(() => { const d = document.querySelector('#cv-plegable-cifras'); if (d) d.open = true; });   // el monitor solo se pinta con «cifras» abierto
  if (vista) await pg.evaluate((v) => window.__eco.vista(v), vista);
  return pg;
}
const t = (pg, id) => pg.evaluate((id) => document.getElementById(id)?.innerText.replace(/\s+/g, ' ').trim(), id);
const tapseApp = (pg) => pg.evaluate(async () => { const { tapseDeLatido } = await import('./anatomia.mjs'); const u = window.__motor.ultimo; return u ? +tapseDeLatido(u).toFixed(1) : null; });
const vol = (s) => +(/(\d+) mL/.exec(s || '')?.[1] ?? NaN);
// recorte: del lienzo B al final de la zona del modo activo (M o D), sin esperar a que el elemento «esté quieto»
async function recorte(pg, ruta) {
  const trozos = [];
  for (const sel of ['#cv-eco', '#cv-m-zona:not([hidden]) #cv-m,#cv-d-zona:not([hidden]) #cv-d', '#cv-m-zona:not([hidden]) #cv-m-resultado,#cv-d-zona:not([hidden]) #cv-d-resultado']) { const l = pg.locator(sel).first(); await l.scrollIntoViewIfNeeded(); trozos.push((await l.screenshot({ animations: 'disabled', timeout: 60000 })).toString('base64')); }
  const h = await nav.newPage({ viewport: { width: 390, height: 800 }, deviceScaleFactor: 2 });
  await h.setContent(`<body style="margin:0;background:#000">${trozos.map(b => `<img style="width:390px;display:block;margin-bottom:4px" src="data:image/png;base64,${b}">`).join('')}</body>`);
  await h.waitForTimeout(300); await h.locator('body').screenshot({ path: ruta }); await h.close();
}
const secc = (clave, desc, lineas) => { md += `## ${clave} (${desc})\n` + lineas.map(([k, v, o]) => `- ${k}: ${v}${o ? `  _[${o}]_` : ''}`).join('\n') + '\n\n'; };

// 1. Movimiento: A, C (sístole media: eyección rápida), D (fin de sístole: eyección lenta), F (llenado rápido)
const FASES4 = [['A', 'A · telediástole'], ['C', 'C · sístole media'], ['D', 'D · fin de sístole'], ['F', 'F · llenado rápido']];
for (const [clave, esc, g, vista] of [['mov-normal-a4c', 'normal', null, 'a4c'], ['mov-normal-psax', 'normal', null, 'psaxPm'], ['mov-hp-psax', 'hpcronica', 1, 'psaxPm'], ['mov-tep-a4c', 'tep', 1, 'a4c']]) {
  if (!quiere('movimiento', clave)) continue;
  const pg = await abrir(clave, esc, g, vista); const trozos = [], L = [];
  await pg.waitForSelector('#cv-ciclo button[data-fase="A"]', { timeout: 60000 });
  for (const [f, rot] of FASES4) {
    await pg.click(`#cv-ciclo button[data-fase="${f}"]`); await pg.waitForTimeout(1200);
    await pg.evaluate(() => new Promise(r => requestAnimationFrame(() => requestAnimationFrame(r))));
    const lienzo = pg.locator('#cv-eco'); await lienzo.scrollIntoViewIfNeeded();
    trozos.push((await lienzo.screenshot()).toString('base64'));
    L.push([rot, `VI ${await t(pg, 'cv-l-vi')} · VD ${await t(pg, 'cv-l-vd')} · Ao ${await t(pg, 'cv-l-ao')} · rótulo «${await t(pg, 'cv-eco-fase')}»`, 'monitor']);
  }
  const edv = vol(L[0][1]), esv = vol(L[2][1]);
  L.push(['VTD (VI, fase A)', edv + ' mL', 'monitor'], ['VTS (VI, fase D)', esv + ' mL', 'monitor'], ['FEVI', Math.round((edv - esv) / edv * 100) + ' %', 'derivado (VTD−VTS)/VTD'],
    ['Último latido', await t(pg, 'cv-l-lat'), 'monitor'], ['TAPSE', (await tapseApp(pg)) + ' mm', 'anatomia.mjs']);
  secc(clave, `${esc}${g != null ? ', g=' + g : ''}, ${vista}; recortes izquierda→derecha, arriba→abajo: A, C, D, F`, L);
  const h = await nav.newPage({ viewport: { width: 800, height: 800 } });
  await h.setContent(`<body style="margin:0;background:#000;display:grid;grid-template-columns:1fr 1fr;gap:4px;width:792px">${trozos.map(b => `<img style="width:100%" src="data:image/png;base64,${b}">`).join('')}</body>`);
  await h.waitForTimeout(300); await h.locator('body').screenshot({ path: join(OUT, `${clave}.png`) }); await h.close(); await pg.close(); console.log(clave);
}

// 2. Modo M: TAPSE (A4C, línea sobre el anillo tricuspídeo lateral)
for (const [clave, esc, g] of [['m-tapse-normal', 'normal', null], ['m-tapse-tep', 'tep', 1]]) {
  if (!quiere('tapse', clave)) continue;
  const pg = await abrir(clave, esc, g, 'a4c');
  await pg.evaluate(() => { window.__eco.modo('M'); window.__eco.medir('tapse'); });
  await pg.waitForTimeout(4500);   // el barrido de 2 s dibuja un trazado completo
  await recorte(pg, join(OUT, `${clave}.png`));
  secc(clave, `${esc}${g != null ? ', g=' + g : ''}, A4C, modo M, medir TAPSE`, [['TAPSE', (await tapseApp(pg)) + ' mm', 'anatomia.mjs (el calibre no se coloca solo: la app lo mide al poner dos puntos)'],
    ['Texto del modo M', await t(pg, 'cv-m-resultado'), 'monitor'], ['Guía', await t(pg, 'cv-m-guia'), 'monitor'], ['Último latido', await t(pg, 'cv-l-lat'), 'monitor']]);
  await pg.close(); console.log(clave);
}

// 3. Doppler: clave, escenario, g, preajuste (data-muestra)
const DOP = [['d-mitral-normal', 'normal', null, 'mitral'], ['d-mitral-dilatada', 'dilatada', 1, 'mitral'], ['d-mitral-fallo', 'fallo', 1, 'mitral'], ['d-mitral-hipertrofia', 'hipertrofia', 1, 'mitral'],
  ['d-tsvi-normal', 'normal', null, 'tsvi'], ['d-regmitral-dilatada', 'dilatada', 1, 'regmitral'], ['d-regmitral-fallo', 'fallo', 1, 'regmitral'],
  ['d-it-cw-normal', 'normal', null, IT], ['d-it-cw-hpcronica', 'hpcronica', 1, IT], ['d-it-cw-tep', 'tep', 1, IT]];
for (const [clave, esc, g, pre] of DOP) {
  if (!quiere('doppler', clave)) continue;
  try {
  const pg = await abrir(clave, esc, g, null);
  if (clave.startsWith('d-it-') && !(await pg.$(`[data-muestra="${pre}"]`))) { md += `## ${clave}\n- NO CAPTURADA: no hay botón [data-muestra="${pre}"] (la IT CW aún no está en doppler.mjs). Lánzala con IT_PRESET=<nombre> cuando exista.\n\n`; console.log('SALTADA', clave, '(IT CW no existe aún)'); await pg.close(); continue; }
  await pg.evaluate((p) => { if (p === 'regtricus') window.__motor.p.eroaTricus = 0.1; window.__eco.modo('D'); window.__eco.doppler.muestra(p); }, pre);   // IT: eroaTricus = 0,1 como eroaMitral para la IM (wt/p5f)
  try { await pg.waitForFunction(() => !/^Midiendo/.test(document.getElementById('cv-d-resultado')?.innerText || 'Midiendo'), null, { timeout: 25000 }); } catch { errores.push(`${clave}: el Doppler no terminó de medir`); }
  await pg.waitForTimeout(3500);
  await recorte(pg, join(OUT, `${clave}.png`));
  const med = await pg.evaluate(() => { const m = window.__eco.doppler.medidas(), f = window.__eco.doppler.fuente(); return { m, n: f?.n }; });
  secc(clave, `${esc}${g != null ? ', g=' + g : ''}, preajuste ${pre}`, [['Resultado del Doppler', await t(pg, 'cv-d-resultado'), 'monitor'], ['Medidas internas (E, A, E/A, TDE/DT, pico, ITV)', JSON.stringify(med.m, (k, v) => typeof v === 'number' ? +v.toFixed(2) : v), 'monitor interno de la app (__eco.doppler.medidas); e′ no la da hoy'],
    ['Último latido', await t(pg, 'cv-l-lat'), 'monitor'], ['TAPSE', (await tapseApp(pg)) + ' mm', 'anatomia.mjs']]);
  await pg.close(); console.log(clave);
  } catch (e) { errores.push(`${clave}: ${e.message.split('\n')[0]}`); console.log('FALLO', clave); }
}
md += `## Errores de consola\n${errores.length ? errores.map(e => '- ' + e).join('\n') : 'ninguno'}\n`;
await writeFile(join(OUT, QUE || SOLO ? 'cifras-mov-doppler-parcial.md' : 'cifras-mov-doppler.md'), md);
await nav.close(); srv.close(); console.log('errores:', errores);
