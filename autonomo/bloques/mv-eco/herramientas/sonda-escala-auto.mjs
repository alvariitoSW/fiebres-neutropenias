// Sonda: escala automática del CW de la IM/IT. uso: node sonda-escala-auto.mjs <escenario> <g> <preset>  (imprime la escala elegida)
import { createServer } from 'node:http'; import { readFile } from 'node:fs/promises'; import { join, extname, dirname } from 'node:path'; import { fileURLToPath } from 'node:url';
const RAIZ = join(dirname(fileURLToPath(import.meta.url)), '..', '..', '..', '..');
let pw; for (const r of ['playwright', '/opt/node22/lib/node_modules/playwright/index.mjs']) { try { pw = await import(r); break; } catch {} }
const T = { '.html': 'text/html', '.js': 'text/javascript', '.mjs': 'text/javascript', '.css': 'text/css' };
const srv = createServer(async (q, r) => { try { const f = join(RAIZ, decodeURIComponent(new URL(q.url, 'http://x').pathname)); r.writeHead(200, { 'content-type': T[extname(f)] || 'application/octet-stream' }); r.end(await readFile(f)); } catch { r.writeHead(404); r.end(); } });
await new Promise(r => srv.listen(0, '127.0.0.1', r)); console.log('PUERTO=' + srv.address().port);
const [esc, g, pre] = process.argv.slice(2);
const nav = await pw.chromium.launch({ args: ['--use-gl=swiftshader', '--enable-unsafe-swiftshader'] });
const pg = await nav.newPage({ viewport: { width: 390, height: 844 } });
pg.on('pageerror', e => console.log('ERR', e.message));
await pg.goto(`http://127.0.0.1:${srv.address().port}/js/modules/eco/laboratorio.html?depuracion=1&dibujo=2`); await pg.waitForFunction(() => window.__ultimoDibujo?.eco, null, { timeout: 60000 });
if (esc !== 'normal') { await pg.click(`[data-c="${esc}"]`); await pg.evaluate((g) => { const r = document.querySelector('#cv-grav'); r.value = g * 100; r.dispatchEvent(new Event('input')); r.dispatchEvent(new Event('change')); }, +g); }
await pg.waitForTimeout(1500);
await pg.evaluate((p) => { const m = window.__motor.p; if (p === 'regtricus') m.eroaTricus = 0.1; if (p === 'regmitral' && !(m.eroaMitral > 0)) m.eroaMitral = 0.2; window.__eco.modo('D'); window.__eco.doppler.muestra(p); }, pre);
for (let i = 0; i < 6; i++) { await pg.waitForTimeout(2500); console.log(await pg.evaluate(() => { const e = window.__eco.doppler.espectro.estado; return { vmax: e.vmax, sel: document.getElementById('cv-d-escala').value, m: JSON.stringify(window.__eco.doppler.medidas()) }; })); }
await nav.close(); srv.close();
