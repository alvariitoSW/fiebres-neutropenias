// Las 4 recetas de la disección EN LA APP (390 px): pulsa los botones reales y lee el monitor. Uso: node g5-app.mjs http://localhost:PUERTO/ [carpeta-capturas]
import { chromium } from '/opt/node22/lib/node_modules/playwright/index.mjs';
const BASE = process.argv[2].replace(/\/?$/, '/'), CAP = process.argv[3] ? process.argv[3].replace(/\/?$/, '/') : null;
const b = await chromium.launch(); const p = await (await b.newContext({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 2 })).newPage();
const err = []; p.on('console', m => { if (m.type() === 'error' && !/favicon/.test(m.text())) err.push(m.text()); }); p.on('pageerror', e => err.push('PAGE ' + e.message));
await p.goto(BASE, { waitUntil: 'networkidle' }); await p.waitForTimeout(600);
await p.evaluate(() => { const t = document.createElement('button'); Object.assign(t.dataset, { especialidad: 'libros', view: 'shockVivo', shockVivo: 'diseccion' }); document.body.append(t); t.click(); t.remove(); });
await p.waitForTimeout(2500);
const clic = (ds, v) => p.evaluate(([ds, v]) => { const e = document.querySelector(`#shv-dock-panel [data-ds="${ds}"]${v != null ? `[data-v="${v}"]` : ''}`); if (!e) throw new Error('no hay ' + ds); if (e.disabled) return false; e.click(); return true; }, [ds, v]);
const lee = async (n) => { await p.waitForTimeout(1500); const r = await p.evaluate(() => { const c = window.__shvPruebas(); const R = c.R; return { pas: R.pas, pad: R.pad, pam: R.pam, fc: R.fc, ic: R.ic, estado: document.querySelector('#shv-frase-txt .estado')?.textContent, frase: document.querySelector('#shv-frase-txt')?.textContent.slice(0, 160), sellos: [...document.querySelectorAll('#shv-raiz [class*="tope-sello"]')].filter(e => e.getClientRects().length).map(e => e.textContent.replace(/\s+/g, ' ').trim().slice(0, 40)), avisos: [...document.querySelectorAll('#shv-raiz .tope-aviso')].filter(e => e.getClientRects().length).map(e => e.textContent.replace(/\s+/g, ' ').trim().slice(0, 40)), desborde: document.documentElement.scrollWidth - innerWidth }; });
  console.log(n.padEnd(26), JSON.stringify(r)); if (CAP) await p.screenshot({ path: `${CAP}${n.replace(/\W+/g, '-')}.png` }); return r; };
await lee('base');
await clic('ni-sube'); await clic('ni-sube'); await clic('ni-sube');
await lee('nicardipino solo');
await clic('cero');
await clic('es-bolo'); await clic('es-sube'); for (let i = 0; i < 2; i++) { await clic('es-bolo'); await clic('es-sube'); }
await lee('esmolol 100');
await clic('ni-sube'); await clic('ni-sube'); await lee('esmolol 100 + nic 7,5');
await clic('opioide'); await lee('+ opioide');
console.log('errores', err.length ? err : 'ninguno');
await b.close();
