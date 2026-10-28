// Lee en el navegador (app servida en localhost:8000, 390 px) las constantes reales del shock vivo para la maqueta A: Amparo
// con la sepsis al 100 %, con noradrenalina (5/10/25/30), tras 1.750 mL a la hora 0 y 1, y pasado el tope de volumen.
// Uso: node autonomo/ideas/educacion-pionera/herramientas/lee-shock.mjs  (salida: una línea JSON por estado; 28/10/2026).
import { chromium } from '/opt/node22/lib/node_modules/playwright/index.mjs';
const b = await chromium.launch(); const ctx = await b.newContext({ viewport: { width: 390, height: 844 } }); const p = await ctx.newPage();
const espera = ms => p.waitForTimeout(ms);
const clic = sel => p.evaluate(s => { const e = document.querySelector(s); if (!e) throw new Error('no hay ' + s); e.click(); }, s => s);
const abrir = k => p.evaluate(k => { const t = document.createElement('button'); Object.assign(t.dataset, { especialidad: 'libros', view: 'shockVivo', shockVivo: k }); document.body.append(t); t.click(); t.remove(); }, k);
const q = async (sel) => { await p.evaluate(s => { const e = document.querySelector(s); if (!e) throw new Error('no hay ' + s); e.click(); }, sel); await espera(500); };
const rango = async (id, v) => { await p.evaluate(([id, v]) => { const d = document.getElementById(id); d.value = v; d.dispatchEvent(new Event('input', { bubbles: true })); d.dispatchEvent(new Event('change', { bubbles: true })); }, [id, v]); await espera(900); };
const S = async (t) => { const r = await p.evaluate(() => { const c = window.__shvPruebas(), r = c.R; const o = {}; for (const k of ['pam','pas','pad','fc','pvc','pcp','ic','irvs','ven','gap','spo2','lact','diur']) if (r[k] != null) o[k] = typeof r[k] === 'number' ? +r[k].toFixed(1) : r[k]; o.estado = document.querySelector('#shv-frase-txt .estado')?.textContent || ''; o.frase = document.querySelector('#shv-frase-txt')?.textContent.replace(/\s+/g,' ').slice(0, 220); o.na = c.cab.ajuste.na; o.cris = c.cab.infundido.cris; o.h = c.est.horas; o.sellos = [...document.querySelectorAll('#shv-raiz [class*="tope-sello"]')].filter(e => e.getClientRects().length).map(e => e.textContent.trim().slice(0, 50)).filter(Boolean); o.avisos = [...document.querySelectorAll('#shv-raiz .tope-aviso')].filter(e => e.getClientRects().length).map(e => e.textContent.trim().slice(0, 80)); return o; }); console.log(t, JSON.stringify(r)); };
await p.goto('http://localhost:8000/', { waitUntil: 'networkidle' }); await espera(800);
await abrir('septico'); await espera(2000); await q('#shv-pacientes [data-pac="amparo"]'); await q('#shv-dock-tabs [data-pest="grav"]'); await rango('shv-d-grav', 100);
await q('#shv-dock-tabs [data-pest="far"]');
await q('#shv-dock-panel [data-na="5"]'); await espera(1200); await S('Amparo g100 NA5');
await q('#shv-dock-panel [data-na="10"]'); await espera(1200); await S('Amparo g100 NA10');
await q('#shv-dock-panel [data-na="25"]'); await espera(1200); await S('Amparo g100 NA25');
await q('#shv-dock-panel [data-na="30"]'); await espera(1200); await S('Amparo g100 NA30');
await abrir('septico'); await espera(1200); await q('#shv-pacientes [data-pac="amparo"]'); await q('#shv-dock-tabs [data-pest="grav"]'); await rango('shv-d-grav', 100); await q('#shv-dock-tabs [data-pest="vol"]');
for (const v of [500, 500, 500, 250]) { await q(`#shv-dock-panel [data-vol="${v}"]`); }
await espera(800); await S('Amparo +1750 h0');
await q('#shv-dock-tabs [data-pest="reloj"]'); await q('#shv-dock-panel [data-h="1"]'); await espera(1500); await S('Amparo +1750 h1');
await q('#shv-dock-tabs [data-pest="far"]'); await q('#shv-dock-panel [data-na="10"]'); await espera(1200); await S('Amparo +1750 h1 NA10');
await q('#shv-dock-tabs [data-pest="vol"]'); for (let i = 0; i < 3; i++) await q('#shv-dock-panel [data-vol="2000"]'); await espera(800); await S('Amparo +1750+6000');
await b.close();
