// Entrar a la nefrona viva desde mr-fra-nefrotoxicos y volver; también K urgente con k0 desde el enlace.
import { chromium, devices } from '/opt/node22/lib/node_modules/playwright/index.mjs';
const BASE = (process.argv[2] || 'http://localhost:8421/').replace(/\/?$/, '/');
const b = await chromium.launch(); const ctx = await b.newContext({ ...devices['iPhone 12'] }); const p = await ctx.newPage();
const err = []; p.on('pageerror', e => err.push(e.message));
await p.goto(BASE + 'index.html', { waitUntil: 'networkidle' }); await p.waitForTimeout(800);
const ir = (esp, view, panel, tab, extra = '') => p.evaluate(([esp, view, panel, tab, extra]) => { const x = document.createElement('button'); Object.assign(x.dataset, { especialidad: esp, view, panel, tab }); document.body.append(x); x.click(); x.remove(); }, [esp, view, panel, tab]);
await ir('libros', 'marinoRenal', 'panel-marino-renal-tabs', 'mr-fra-nefrotoxicos'); await p.waitForTimeout(600);
await p.evaluate(() => document.querySelector('#mr-fra-nefrotoxicos [data-nefrona-viva="rabdo"]').click()); await p.waitForTimeout(800);
const vb = await p.evaluate(() => { const v = document.querySelector('#nefro-menu-view .btn-volver-nefro-kidney'); return { t: v.textContent, tab: v.dataset.tab, vis: !!v.offsetParent, sit: document.querySelector('#nv-avisos')?.textContent.slice(0, 60) }; });
console.log('en nefrona', JSON.stringify(vb));
await p.evaluate(() => document.querySelector('#nefro-menu-view .btn-volver-nefro-kidney').click()); await p.waitForTimeout(800);
console.log('tras volver', JSON.stringify(await p.evaluate(() => { const t = document.getElementById('mr-fra-nefrotoxicos'); const v = document.querySelector('#nefro-menu-view .btn-volver-nefro-kidney'); return { fichaVisible: !!t.offsetParent, active: t.classList.contains('active'), volverTxt: v.textContent }; })));
// K urgente con k0
await p.evaluate(() => { const x = document.createElement('button'); Object.assign(x.dataset, { especialidad: 'libros', view: 'marinoRenal', panel: 'panel-marino-renal-tabs', tab: 'mr-trr', filtroVivo: 'k-urgente,k0=6.4' }); x.id = 'tmpk'; document.body.append(x); x.click(); });
await p.waitForTimeout(1200);
console.log('k0', await p.evaluate(() => [...document.querySelectorAll('[data-fv-out="k0"]')].map(x => x.textContent + (x.offsetParent ? ' vis' : '')).join(' | ')), '| medidor K:', await p.evaluate(() => [...document.querySelectorAll('.nv-medidor-nombre span:first-child')].filter(x => x.offsetParent && /K⁺ sérico/.test(x.textContent)).map(x => x.textContent).join(',')));
console.log('errores', err);
await b.close();
