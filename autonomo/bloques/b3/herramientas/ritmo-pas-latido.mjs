// Lecturas del corazón eléctrico latido a latido, con el tiempo de la simulación avanzado a mano (`__ritmo.avanzarHasta`,
// como hace autonomo/pruebas/ritmo-vivo.mjs): en headless el bucle no corre solo, por eso ritmo-lecturas.mjs leía siempre lo mismo.
// Uso: python3 -m http.server 8796 && node autonomo/bloques/b3/herramientas/ritmo-pas-latido.mjs
// Devuelve, por estado: FC, pulso, ART del monitor, y los últimos latidos mecánicos (RR previo → amplitud): ¿cae la PAS tras el latido corto?
import { chromium, devices } from '/opt/node22/lib/node_modules/playwright/index.mjs';
const browser = await chromium.launch();
const ctx = await browser.newContext({ ...devices['iPhone 12'], viewport: { width: 390, height: 844 }, hasTouch: true, isMobile: true });
const p = await ctx.newPage(); const errs = []; p.on('pageerror', e => errs.push(e.message));
await p.goto('http://127.0.0.1:8796/', { waitUntil: 'networkidle' }); await p.waitForTimeout(1200);
await p.evaluate(() => { const t = document.createElement('button'); Object.assign(t.dataset, { especialidad: 'libros', view: 'ritmoVivo', ritmoVivo: 'fa' }); document.body.append(t); t.click(); t.remove(); });
await p.waitForFunction(() => window.__ritmo && window.__ritmo.leer && window.__ritmo.avanzarHasta, null, { timeout: 15000 }); await p.waitForTimeout(800);
const leer = async (nombre, fn, seg = 8) => {
  try { await p.evaluate(fn); } catch (e) { console.log(nombre, 'ERROR', e.message); return; }
  await p.evaluate(s => window.__ritmo.avanzarHasta(window.__ritmo.simT + s), seg); await p.waitForTimeout(150);
  const r = await p.evaluate(() => {
    const R = window.__ritmo, L = R.leer(R.simT), S = R.S;
    const lat = (R.latidos ? R.latidos(R.simT) : R.mo.latidosMecanicos(R.simT - 4, R.simT)).slice(-6).map(b => `${b.rr.toFixed(2)}s→${Math.round(b.amp)}`);
    const cif = [...document.querySelectorAll('#rtv-mon-cifras .cifra')].map(c => c.innerText.replace(/\s+/g, ' ').trim()).join(' | ');
    return { fc: L.fc, pul: L.pul, pas: L.pas, pad: L.pad, qtc: L.qtc && +L.qtc.toFixed(2), far: S.farmaco, h: S.horas, llen: S.llenadoMalo, clave: S.clave, lat, cif };
  });
  console.log(nombre.padEnd(22), JSON.stringify(r));
};
await leer('sinusal', () => __ritmo.ponerEstado('sinusal', {}));
await leer('fa 138', () => __ritmo.ponerEstado('fa', {}));
await leer('fa 148', () => __ritmo.ponerEstado('fa', { fcFA: 148 }));
await leer('fa 148 llenadoMalo', () => __ritmo.ponerEstado('fa', { fcFA: 148, llenadoMalo: true }));
await leer('fa 104 llenadoMalo', () => __ritmo.ponerEstado('fa', { fcFA: 104, llenadoMalo: true }));
await leer('fa 148 + accion llenado', () => { __ritmo.ponerEstado('fa', { fcFA: 148 }); __ritmo.accion('llenado'); });
await leer('fa 104 + accion llenado', () => { __ritmo.ponerEstado('fa', { fcFA: 104 }); __ritmo.accion('llenado'); });
await leer('fa:amio h1', () => { __ritmo.ponerEstado('fa', {}); __ritmo.S.farmaco = 'amio'; __ritmo.S.horas = 1; __ritmo.aplicarFarmacoFA(); });
await leer('fa:amio h6', () => { __ritmo.S.horas = 6; __ritmo.aplicarFarmacoFA(); });
await leer('fa:dilt h2', () => { __ritmo.S.farmaco = 'dilt'; __ritmo.S.horas = 2; __ritmo.aplicarFarmacoFA(); });
await leer('fa + cv-fa', () => { __ritmo.ponerEstado('fa', {}); __ritmo.avanzarHasta(__ritmo.simT + 3); __ritmo.accion('cv-fa'); }, 6);
await leer('torsade', () => __ritmo.ponerEstado('torsade', {}));
await leer('torsade tdp', () => __ritmo.ponerEstado('torsade', { tdp: true }), 4);
await leer('tv', () => __ritmo.ponerEstado('tv', {}));
console.log('errores:', errs.slice(0, 3).join(' | ') || 'ninguno');
await browser.close();
