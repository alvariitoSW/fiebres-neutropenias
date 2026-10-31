// Profesor b3d: neumotórax paso a paso (cifras en texto), Herminia H2 tras «Compruébalo», paso de caso con ficha
// y primera pantalla del shock vivo. Uso: node profesor-b3d.mjs http://localhost:PUERTO/ /carpeta/salida/
import { chromium, devices } from '/opt/node22/lib/node_modules/playwright/index.mjs';
const BASE = (process.argv[2] || 'http://localhost:8000/').replace(/\/?$/, '/'), OUT = (process.argv[3] || '/tmp').replace(/\/?$/, '/');
const b = await chromium.launch();
const ctx = await b.newContext({ ...devices['iPhone 12'], viewport: { width: 390, height: 844 }, deviceScaleFactor: 2, hasTouch: true, isMobile: true });
const p = await ctx.newPage(); const errores = []; p.on('pageerror', (e) => errores.push(e.message)); p.on('console', (m) => { if (m.type() === 'error') errores.push(m.text()); });
await p.goto(BASE, { waitUntil: 'networkidle' }); await p.waitForTimeout(800);
const abrir = async (view, k) => { await p.evaluate(([view, k]) => { const t = document.createElement('button'); Object.assign(t.dataset, { especialidad: 'libros', view }); if (k) t.dataset[view === 'pulmonVivo' ? 'pulmonVivo' : 'shockVivo'] = k; document.body.append(t); t.click(); t.remove(); }, [view, k]); await p.waitForTimeout(1500); };
const txt = (s) => p.evaluate((s) => (document.querySelector(s) || {}).textContent?.trim() ?? '—', s);
const fila = async (k) => txt(`[data-fila="${k}"] .v`);

// 1) neumotórax: dejar pasar respiraciones hasta el tope
await abrir('pulmonVivo', 'neumotorax-tension');
await p.evaluate(() => window.__pulPruebas?.().llenar?.());
console.log('NEUMOTÓRAX (presión · VS · GC · PAM · SpO₂ · sello/frase)');
let capt1 = false, capt2 = false;
for (let i = 0; i < 12; i++) {
  const fr = await txt('#pul-frase-txt'); const est = (fr.match(/^[^.:]{0,80}/) || [''])[0];
  console.log(`  paso ${i}: p=${await fila('neumo-p')} · VS=${await fila('cor-vs')} · GC=${await fila('cor-gc')} · PAM=${await fila('cor-pam')} · SpO₂=${await fila('neumo-spo2')} · «${est}»`);
  if (!capt1 && /shock/i.test(fr)) { capt1 = true; await p.evaluate(() => document.querySelector('[data-fila="cor-vs"]').scrollIntoView({ block: 'center' })); await p.waitForTimeout(400); await p.screenshot({ path: `${OUT}prof-neumo-primer-sello-390.png` }); }
  const hab = await p.evaluate(() => { const e = document.querySelector('[data-nx="pasar"]'); return e && !e.disabled; });
  if (!hab) { console.log('  botón «Dejar pasar» apagado en el paso', i); break; }
  await p.evaluate(() => document.querySelector('[data-nx="pasar"]').click()); await p.waitForTimeout(2500); await p.evaluate(() => window.__pulPruebas?.().llenar?.());
}
// descomprimir
await p.evaluate(() => { [...document.querySelectorAll('#pul-neumo button')].find((e) => /5\.º espacio/.test(e.textContent))?.click(); });
await p.waitForTimeout(300); await p.evaluate(() => { [...document.querySelectorAll('#pul-neumo button')].find((e) => /Descomprimir/.test(e.textContent))?.click(); });
await p.waitForTimeout(3000); await p.evaluate(() => window.__pulPruebas?.().llenar?.());
console.log(`  tras descomprimir: p=${await fila('neumo-p')} · VS=${await fila('cor-vs')} · GC=${await fila('cor-gc')} · PAM=${await fila('cor-pam')} · SpO₂=${await fila('neumo-spo2')} · «${(await txt('#pul-frase-txt')).slice(0, 120)}»`);
await p.evaluate(() => document.querySelector('[data-fila="cor-vs"]').scrollIntoView({ block: 'center' })); await p.waitForTimeout(300);
await p.screenshot({ path: `${OUT}prof-neumo-descomprimido-390.png` });

// 2) Mayéutica: caso Herminia, paso 2 (H2) con «Compruébalo»
await abrir('pulmonVivo', 'cpap-eap');
const may = await p.evaluate(() => { const d = document.getElementById('pmy-det'); if (d) { d.open = true; d.scrollIntoView(); } return !!d; });
console.log('Mayéutica presente:', may);
await p.waitForTimeout(500);
const clickTxt = (re, scope = '#pmy-det') => p.evaluate(([re, scope]) => { const b = [...document.querySelectorAll(scope + ' button')].find((e) => e.offsetParent && new RegExp(re).test(e.textContent)); if (b) { b.click(); return b.textContent.trim().slice(0, 60); } return null; }, [re, scope]);
console.log('  tab casos:', await clickTxt('Ir a los casos')); await p.waitForTimeout(400);
console.log('  caso:', await p.evaluate(() => { const b = document.querySelector('#pmy-det [data-caso="2"]'); if (b) { b.click(); return b.textContent.trim().slice(0, 50); } return null; })); await p.waitForTimeout(600);
await p.evaluate(() => document.getElementById('pmy-zona')?.scrollIntoView({ block: 'start' })); await p.waitForTimeout(300);
await p.screenshot({ path: `${OUT}prof-caso-herminia-paso1-390.png` });
// responder H1 (opción correcta: «25 %») y pasar
await clickTxt('Ya lo tengo'); await p.waitForTimeout(300);
await p.evaluate(() => { const o = [...document.querySelectorAll('#pmy-det [data-op]')].find((e) => /25 %/.test(e.textContent)); o?.click(); }); await p.waitForTimeout(500);
console.log('  sig:', await clickTxt('Siguiente|Sig')); await p.waitForTimeout(800);
console.log('  paso 2 ficha:', (await p.evaluate(() => document.getElementById('pmy-zona')?.innerText.replace(/\s+/g, ' ').slice(0, 400))));
await clickTxt('Ya lo tengo'); await p.waitForTimeout(300);
await p.evaluate(() => { const o = [...document.querySelectorAll('#pmy-det [data-op]')].find((e) => /^Sube/.test(e.textContent.trim())); o?.click(); }); await p.waitForTimeout(500);
console.log('  comprueba:', await clickTxt('Pon la CPAP|Compru')); await p.waitForTimeout(4500); await p.evaluate(() => window.__pulPruebas?.().llenar?.());
console.log('  tras comprobar: VS=' + await fila('cor-vs') + ' GC=' + await fila('cor-gc') + ' PAM=' + await fila('cor-pam'));
console.log('  texto comprobación:', (await p.evaluate(() => [...document.querySelectorAll('#pmy-det *')].filter((e) => e.offsetParent && /antes|después|→/.test(e.textContent) && e.children.length < 6).map((e) => e.textContent.replace(/\s+/g, ' ').trim()).slice(-4).join(' | '))).slice(0, 500));
await p.evaluate(() => document.getElementById('pmy-zona')?.scrollIntoView({ block: 'start' })); await p.waitForTimeout(300);
await p.screenshot({ path: `${OUT}prof-caso-herminia-h2-comprobado-390.png` });

// 3) shock vivo: primera pantalla
await abrir('shockVivo', null); await p.evaluate(() => window.scrollTo(0, 0)); await p.waitForTimeout(800);
await p.screenshot({ path: `${OUT}prof-shock-vivo-primera-390.png` });
// 4) pulmón: primera pantalla hoy
await abrir('pulmonVivo', 'normal-vcv'); await p.evaluate(() => window.scrollTo(0, 0)); await p.waitForTimeout(2500);
await p.screenshot({ path: `${OUT}prof-pulmon-primera-390.png` });
console.log('ERRORES', errores.length, errores.slice(0, 3));
await b.close();
