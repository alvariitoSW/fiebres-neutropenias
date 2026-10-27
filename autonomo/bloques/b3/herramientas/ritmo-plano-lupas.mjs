import { chromium } from '/opt/node22/lib/node_modules/playwright/index.mjs';
const b = await chromium.launch(); const p = await (await b.newContext({ viewport: { width: 390, height: 844 } })).newPage();
await p.goto('http://localhost:8731/index.html'); await p.waitForFunction(() => document.getElementById('rtv-raiz'));
await p.evaluate(() => { const t = document.createElement('button'); Object.assign(t.dataset, { especialidad: 'libros', view: 'ritmoVivo', ritmoVivo: 'nodal' }); document.body.append(t); t.click(); t.remove(); }); await p.waitForTimeout(1000);
const ab = () => p.evaluate(() => { const c = document.querySelector('.pg-cab'); if (!c) return 'no existe'; const caja = c.parentElement; const r = caja.getBoundingClientRect(); return (caja.hidden || r.height === 0) ? 'cerrado' : `ABIERTO (${caja.id || caja.className}, top ${Math.round(r.top)}, pos ${getComputedStyle(caja).position})`; });
await p.click('#rtv-lupas-grandes'); await p.waitForTimeout(400); console.log('tras abrir:', await ab());
await p.keyboard.press('Escape'); await p.waitForTimeout(200); console.log('tras Escape:', await ab());
await p.click('#rtv-lupas-grandes').catch(() => {}); await p.waitForTimeout(300); console.log('reabierto:', await ab());
await p.click('#rtv-modo-preguntas'); await p.waitForTimeout(500); console.log('en Mayéutica:', await ab());
await p.click('#rtv-modo-explorar'); await p.waitForTimeout(500); console.log('vuelta Explorar:', await ab());
await p.evaluate(() => window.__ritmo.ponerEstado('fv', {})); await p.waitForTimeout(300); console.log('tras cambiar a FV:', await ab());
await p.evaluate(() => document.getElementById('rtv-volver').click()); await p.waitForTimeout(500); console.log('tras VOLVER:', await ab(), '| vista:', await p.evaluate(() => [...document.querySelectorAll('[id$="-view"]')].filter(v => v.offsetParent !== null).map(v => v.id).join(',')));
await p.evaluate(() => { const t = document.createElement('button'); Object.assign(t.dataset, { especialidad: 'libros', view: 'ritmoVivo', ritmoVivo: 'tv' }); document.body.append(t); t.click(); t.remove(); }); await p.waitForTimeout(800); console.log('al reabrir el modelo:', await ab());
// ¿se cierra con su ×?
await p.click('#rtv-lupas-grandes').catch(() => {}); await p.waitForTimeout(300); await p.click('.pg-x').catch(e => console.log('× no clicable:', e.message.slice(0, 80))); await p.waitForTimeout(200); console.log('tras ×:', await ab());
await b.close();
