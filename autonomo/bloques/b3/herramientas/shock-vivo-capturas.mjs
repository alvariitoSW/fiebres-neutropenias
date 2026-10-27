// Capturas del shock vivo para tachar la lista R2 (autonomo/bloques/b3/lista-shock.md). node shock-vivo-capturas.mjs <url-base> <carpeta> [ancho]
import { chromium } from '/opt/node22/lib/node_modules/playwright/index.mjs';
const BASE = (process.argv[2] || 'http://localhost:8793/').replace(/\/?$/, '/'), DIR = (process.argv[3] || '/tmp/plan-socialista/b3/shock/').replace(/\/?$/, '/'), W = +(process.argv[4] || 390);
const b = await chromium.launch(); const ctx = await b.newContext({ viewport: { width: W, height: 844 }, deviceScaleFactor: 2 }); const p = await ctx.newPage();
const err = []; p.on('console', m => { if (m.type() === 'error') err.push(m.text()); }); p.on('pageerror', e => err.push(e.message));
await p.goto(BASE, { waitUntil: 'networkidle' });
const abrir = k => p.evaluate(k => { const t = document.createElement('button'); Object.assign(t.dataset, { especialidad: 'libros', view: 'shockVivo', shockVivo: k }); document.body.append(t); t.click(); t.remove(); }, k);
const clic = s => p.evaluate(s => document.querySelector(s).click(), s);
const ver = s => p.evaluate(s => document.querySelector(s).scrollIntoView({ block: 'start' }), s);
const cap = async n => { await p.waitForTimeout(500); await p.screenshot({ path: `${DIR}r2-${n}-${W}.png` }); };
await abrir('septico'); await p.waitForTimeout(1500); await clic('#shv-obj-umi'); await p.waitForTimeout(500); await cap('S05-umi-discrepa');
await ver('#shv-pleg-lab'); await p.evaluate(() => { document.querySelector('#shv-dock').classList.add('dock-plegado'); }); await cap('S07-laboratorio');
await clic('#shv-dock-tabs [data-pest="reloj"]'); await clic('#shv-dock-panel [data-h="5"]'); await p.waitForTimeout(400); await ver('#shv-pleg-lab'); await cap('S07-tendencias-5h');
await p.evaluate(() => document.querySelectorAll('#shv-abajo details').forEach(d => d.open = true));
for (const [n, id] of [['fuentes', 'shv-fuentes'], ['notas', 'shv-notas'], ['tira', 'shv-tira'], ['profundizar', 'shv-profundizar']]) { await p.evaluate(id => document.getElementById(id).closest('details').scrollIntoView({ block: 'start' }), id); await cap('S08-' + n); }
await clic('#shv-tira [data-lam="0"]'); await cap('S08-visor'); await p.evaluate(() => document.getElementById('shv-visor').close());
await abrir('tapon'); await p.waitForTimeout(1800); await ver('#shv-escena'); await cap('S06-eco');
await clic('#shv-esc-pest [data-vista="paciente"]'); await cap('S06-corazon');
await abrir('balon'); await p.waitForTimeout(1500); await ver('#shv-pierna'); await cap('S06-pierna');
await clic('#shv-pierna [data-pi="pulso"]'); await clic('#shv-pierna [data-pi="func"]'); await cap('S06-pierna-isquemia');
await ver('#shv-iabp'); await cap('S31-consola');
await abrir('impella'); await p.waitForTimeout(1500); await ver('#shv-escena'); await cap('S24-impella-dentro');
await clic('#shv-esc-pest [data-plano="despiece"]'); await cap('S28-despiece-impella'); await clic('#shv-leyenda [data-ley="3"]'); await cap('S28-despiece-pieza');
await abrir('cardio'); await p.waitForTimeout(1500); await ver('#shv-monitor'); await cap('S03-cuna-pcp');
await abrir('hemo'); await p.waitForTimeout(1500); await cap('S02-S04-pacientes-calculo'); await clic('#shv-dock-tabs [data-pest="grav"]'); await cap('S17-gravedad');
await clic('#shv-dock-tabs [data-pest="far"]'); await cap('S22-farmacos'); await clic('#shv-dock-tabs [data-pest="sop"]'); await cap('S24-soporte');
await clic('#shv-btn-guia'); await cap('S09-guia');
console.log('errores', err.length, err.slice(0, 3)); await b.close();
