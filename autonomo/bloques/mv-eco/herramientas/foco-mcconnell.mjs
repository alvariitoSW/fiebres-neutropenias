// Foco VD · McConnell a 390 px. Desplazamiento en px CSS (390 px de ancho) de tres puntos de la pared libre del VD (base 0,10 · media 0,45 · ápex 0,85
// del largo), de telediástole a telesístole, proyectados en el plano de la vista (in-plane), en el TEP g=1 y en la vista dada.
// La escala es la del ecógrafo (G.k: la que cabe en el lienzo) con el tamaño del lienzo medido abriendo el laboratorio a 390 px. uso: node foco-mcconnell.mjs [a4c|a4cVd]
import { createServer } from 'node:http'; import { readFile } from 'node:fs/promises'; import { join, extname, dirname } from 'node:path'; import { fileURLToPath } from 'node:url';
import { crearMotor } from '../../../../js/modules/eco/motor.mjs';
import { ESCENARIOS, ASENTAR_FORMA } from '../../../../js/modules/eco/escenarios.mjs';
import { estadoGeo, extraDeMotor } from '../../../../js/modules/eco/formas.mjs';
import { baseGeometrica, usarDibujo } from '../../../../js/modules/eco/corazon-geo.mjs';
import { planoVista, enPlano } from '../../../../js/modules/eco/ecografia.mjs';
usarDibujo(2);
const RAIZ = join(dirname(fileURLToPath(import.meta.url)), '..', '..', '..', '..'), VISTA = process.argv[2] || 'a4cVd', TIPOS = { '.html': 'text/html', '.mjs': 'text/javascript', '.js': 'text/javascript', '.css': 'text/css' };
// escala px CSS por mm en la app
let pw; for (const r of ['playwright', '/opt/node22/lib/node_modules/playwright/index.mjs']) { try { pw = await import(r); break; } catch {} }
const srv = createServer(async (q, s) => { try { const r = join(RAIZ, decodeURIComponent(new URL(q.url, 'http://x').pathname)); s.writeHead(200, { 'content-type': TIPOS[extname(r)] || 'application/octet-stream' }); s.end(await readFile(r)); } catch { s.writeHead(404); s.end(); } });
await new Promise(r => srv.listen(0, '127.0.0.1', r));
const nav = await pw.chromium.launch({ args: ['--use-gl=swiftshader', '--enable-unsafe-swiftshader'] });
const pg = await nav.newPage({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 1 });
await pg.goto(`http://127.0.0.1:${srv.address().port}/js/modules/eco/laboratorio.html?depuracion=1&dibujo=2`);
await pg.waitForFunction(() => window.__ultimoDibujo?.eco, null, { timeout: 90000 });
await pg.evaluate((v) => window.__eco.vista(v), VISTA); await pg.waitForTimeout(2500);
const cv = await pg.evaluate(() => { const c = document.querySelector('#cv-eco'); return { w: c.width, h: c.height, css: c.clientWidth }; });
await nav.close(); srv.close();
const m = crearMotor(); m.correr(12); ESCENARIOS.tep.aplicar(m, 1); m.correr(ASENTAR_FORMA);
const ex = extraDeMotor(m), o = m.onda, iTd = o.reduce((b, x, i) => x.vvd > o[b].vvd ? i : b, 0), iTs = o.reduce((b, x, i) => x.vvd < o[b].vvd ? i : b, 0);
const gs = [iTd, iTs].map(i => baseGeometrica({ ...estadoGeo(o[i], ex), mcconnell: ex.mcconnell })), P = planoVista(VISTA, estadoGeo(o[iTd], ex));
const k = Math.min((cv.h - 8) / P.prof, (cv.w - 6) / (2 * P.prof * Math.sin(P.mitad))) * cv.css / cv.w;   // misma cuenta que crearEcografo (ecografia.mjs, G.k), en px CSS
const ZOOM = +(process.env.ZOOM || 1), kz = k * ZOOM;   // ZOOM=2: el botón «Zoom ×2» (mismo fotograma ampliado)
const sal = { vista: VISTA, zoom: ZOOM, pxPorMm: +kz.toFixed(2) };
for (const [seg, fz] of [['base', 0.10], ['media', 0.45], ['apice', 0.85]]) {
  // el ángulo de la pared libre que mejor cae en el plano: el que maximiza el desplazamiento visible (barrido) con el punto en el plano (|n| < 3 mm)
  let mejor = null;
  for (let f = 1.4; f <= 3.6; f += 0.05) { const ps = gs.map(G => G.endoVd(-G.Lvd * fz, f)), q = enPlano(P, ps[0]);
    if (Math.abs(q[2]) > 3) continue; const a = enPlano(P, ps[0]), b = enPlano(P, ps[1]), d = Math.hypot(a[0] - b[0], a[1] - b[1]);
    if (!mejor || d > mejor.d) mejor = { f, d }; }
  sal[seg] = mejor ? +(mejor.d * kz).toFixed(1) : null;
}
sal.dif_apice_menos_media_px = sal.apice != null && sal.media != null ? +(sal.apice - sal.media).toFixed(1) : null;
console.log(JSON.stringify(sal));
