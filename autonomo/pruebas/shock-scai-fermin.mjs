// Mide en la app (390 px) las cifras de Fermín y de Aurelio con ECMO para los textos de la Mayéutica. Uso: node shock-scai-fermin.mjs <url>
import { chromium } from '/opt/node22/lib/node_modules/playwright/index.mjs';
const BASE = (process.argv[2] || 'http://localhost:8731/').replace(/\/?$/, '/');
const b = await chromium.launch(); const p = await (await b.newContext({ viewport: { width: 390, height: 844 } })).newPage();
await p.goto(BASE, { waitUntil: 'networkidle' });
await p.evaluate(() => { const t = document.createElement('button'); Object.assign(t.dataset, { especialidad: 'libros', view: 'shockVivo', shockVivo: 'cardio' }); document.body.append(t); t.click(); t.remove(); });
await p.waitForTimeout(1800);
const sl = (m) => p.waitForTimeout(m);
const leer = () => p.evaluate(() => { const c = window.__shvPruebas(), R = c.R; return { pam: R.pam, pas: R.pas, pad: R.pad, fc: R.fc, pvc: R.pvc, pcp: R.pcp, ic: R.ic, ao: R.aoAbre + '/' + R.aoDe, lact: +c.est.lab.lact.toFixed(1), diur: R.diur, sc: document.getElementById('shv-scai-r').textContent }; });
const pac = async (k) => { await p.click(`#shv-pacientes [data-pac="${k}"]`); await sl(900); };
const aj = async (o) => { await p.evaluate((o) => window.__shvPruebas().cab.ajustar(o), o); await sl(900); };
const vol = async (v) => { await p.evaluate((v) => window.__shvPruebas().cab.volumen(v), v); await sl(1500); };
const h = async (n) => { await p.evaluate(() => document.querySelector('#shv-dock-tabs [data-pest="reloj"]').click()); await sl(150); await p.evaluate((n) => document.querySelector(`[data-h="${n}"]`)?.click(), n); await sl(900); };
const grav = async (v) => { await p.evaluate(() => { const d = document.getElementById('shv-dock'); if (d.classList.contains('dock-plegado')) d.querySelector('.dock-asa').click(); document.querySelector('#shv-dock-tabs [data-pest="grav"]').click(); }); await sl(100); await p.evaluate((v) => { const d = document.getElementById('shv-d-grav'); d.value = v; d.dispatchEvent(new Event('input')); d.dispatchEvent(new Event('change')); }, v); await sl(700); };
const G = process.argv[3] === 'base';
if (process.argv[3] === 'mas') {
await pac('fermin'); await grav(100); await aj({ na: 5 }); await h(5); console.log('F g100 NA5 +5h', JSON.stringify(await leer()));
await pac('aurelio'); await grav(100); console.log('A g100 nada', JSON.stringify(await leer()));
await aj({ dobuta: true }); await h(5); console.log('A g100 dobu +5h', JSON.stringify(await leer()));
} else if (G) {
await pac('fermin'); console.log('Fermín base', JSON.stringify(await leer()));
await vol(250); console.log('+250', JSON.stringify(await leer())); await vol(250); console.log('+500', JSON.stringify(await leer()));
await pac('fermin'); await aj({ na: 5 }); console.log('NA5', JSON.stringify(await leer()));
await pac('fermin'); await aj({ dobuta: true }); console.log('dobu', JSON.stringify(await leer())); await h(5); console.log('dobu +5h', JSON.stringify(await leer()));
} else {
await pac('fermin'); await grav(100); console.log('g100', JSON.stringify(await leer()));
await vol(250); console.log('g100 +250', JSON.stringify(await leer()));
await pac('fermin'); await grav(100); await aj({ na: 5 }); console.log('g100 NA5', JSON.stringify(await leer())); 
await pac('fermin'); await grav(100); await aj({ dobuta: true }); console.log('g100 dobu', JSON.stringify(await leer())); await h(5); console.log('g100 dobu +5h', JSON.stringify(await leer()));
await pac('fermin'); await grav(100); await aj({ soporte: 'impella' }); console.log('g100 impella', JSON.stringify(await leer()));
await pac('fermin'); await grav(100); await aj({ dobuta: true, soporte: 'impella' }); await h(5); console.log('g100 dobu+imp +5h', JSON.stringify(await leer()));
}
await b.close();
