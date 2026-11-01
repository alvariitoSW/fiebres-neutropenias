// Comprueba que el Estudiar de las 3 fichas del 6H monta sin avisos y que el botón del eje vivo lleva a su paciente. Uso: node montaje-6h.mjs <url-base>
import { chromium, devices } from '/opt/node22/lib/node_modules/playwright/index.mjs';
const BASE = (process.argv[2] || 'http://localhost:8766/').replace(/\/?$/, '/');
const b = await chromium.launch(); const p = await (await b.newContext({ ...devices['iPhone 12'], viewport: { width: 390, height: 800 } })).newPage();
const avisos = []; p.on('console', m => { if (['warning', 'error'].includes(m.type())) avisos.push(m.text().slice(0, 200)); }); p.on('pageerror', e => avisos.push('ERR ' + e.message));
await p.goto(BASE + 'index.html', { waitUntil: 'networkidle' }); await p.waitForTimeout(1200);
const r = await p.evaluate(() => ['mu-suprarrenal', 'mu-tiroides', 'mu-hipotiroidismo'].map(id => { const t = document.getElementById(id); return [id, !!t?.querySelector('.est-cabeza, .may-raiz, [class*=est-]'), t?.querySelectorAll('.may-profundizar').length]; }));
console.log(JSON.stringify(r)); console.log('avisos:', JSON.stringify(avisos));
await p.evaluate(() => { const x = document.createElement('button'); Object.assign(x.dataset, { especialidad: 'libros', view: 'ejeVivo', ejeVivo: 'lucrecia:3' }); x.className = 'especialidad-link'; document.body.appendChild(x); x.click(); });
await p.waitForTimeout(800); console.log('eje:', await p.evaluate(() => window.__eje.s.pac + ' paso?'));
await b.close();
