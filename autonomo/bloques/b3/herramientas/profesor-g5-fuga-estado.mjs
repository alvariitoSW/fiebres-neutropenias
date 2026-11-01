// Profesor G5: ¿se cuela la presión del neumotórax (o el corazón) de un estado a otro del pulmón vivo? Abre neumotorax-tension,
// deja pasar 3 veces, y luego abre sbt-ok y fuga-cuff: lee neumo-p, si #pul-neumo y el panel del corazón están ocultos, y la SpO₂.
// También mide el Juega de cada ficha (botones .est-juega u otros) y la calculadora de un paso del caso. Uso: node … http://localhost:PUERTO/
import { chromium, devices } from '/opt/node22/lib/node_modules/playwright/index.mjs';
const BASE = process.argv[2].replace(/\/?$/, '/');
const b = await chromium.launch();
const p = await (await b.newContext({ ...devices['iPhone 12'], viewport: { width: 390, height: 844 }, hasTouch: true, isMobile: true })).newPage();
const err = []; p.on('pageerror', e => err.push(e.message));
await p.goto(BASE, { waitUntil: 'networkidle' }); await p.waitForTimeout(800);
const abrir = estado => p.evaluate(e => { const x = document.createElement('button'); x.dataset.especialidad = 'libros'; x.dataset.view = 'pulmonVivo'; x.dataset.pulmonVivo = e; document.body.append(x); x.click(); x.remove(); }, estado);
const leer = () => p.evaluate(() => { window.__pulPruebas?.().llenar?.(); const f = {}; for (const e of document.querySelectorAll('.pul-raiz [data-fila], #pul-neumo [data-fila]')) f[e.dataset.fila] = (e.querySelector('.v, .g')?.textContent.trim() || ''); const vis = s => { const e = document.querySelector(s); return e ? (!e.hidden && !!e.offsetParent) : null; }; return `neumo-p=${f['neumo-p']} (#pul-neumo visible ${vis('#pul-neumo')}) · cor-pam=${f['cor-pam']} (corazón visible ${vis('[data-fila="cor-pam"]')}) · spo2=${f.spo2} · vt=${f.vt} · fr=${f.frespon} · sellos: ${[...document.querySelectorAll('.tope-sello:not([hidden])')].filter(e => e.offsetParent).map(e => e.textContent.trim().slice(0, 50)).join(' | ') || '—'}`; });
await abrir('neumotorax-tension'); await p.waitForTimeout(2500); console.log('neumotorax-tension inicio: ' + await leer());
for (let i = 0; i < 3; i++) { await p.evaluate(() => document.querySelector('#pul-neumo [data-nx="pasar"]').click()); await p.waitForTimeout(4500); }
console.log('tras 3 × pasar: ' + await leer());
for (const e of ['sbt-ok', 'fuga-cuff', 'normal-vcv']) { await abrir(e); await p.waitForTimeout(2500); console.log(`${e} después: ` + await leer()); }
// Juega y calculadoras
const NAV = { especialidad: 'neumologia', view: 'merinoNeumologia', panel: 'panel-merino-neumo-tabs' };
for (const f of ['neumo-vias-artificiales', 'neumo-cuidado-barotrauma', 'neumo-sbt', 'neumo-weaning-extubacion', 'neumo-nav-prevencion', 'neumo-derrame-antimicrobiano']) {
  await p.evaluate(([t, nav]) => { const x = document.createElement('button'); Object.assign(x.dataset, { ...nav, tab: t }); document.body.append(x); x.click(); x.remove(); }, [f, NAV]); await p.waitForTimeout(500);
  await p.evaluate(f => document.querySelector(`#${f} > .vista-toggle [data-vista="estudiar"]`).click(), f); await p.waitForTimeout(500);
  await p.evaluate(f => document.querySelector(`#${f} .est-ir[data-ir-paso="juega"]`).click(), f); await p.waitForTimeout(400);
  const j = await p.evaluate(f => { const s = document.querySelector(`#${f} .est-paso[data-paso="juega"]`); return { oculto: s.hidden, botones: [...s.querySelectorAll('button')].map(b => (b.dataset.pulmonVivo || b.dataset.capilarVivo || '') + '«' + b.textContent.trim().slice(0, 50) + '»'), texto: s.textContent.replace(/\s+/g, ' ').slice(0, 220) }; }, f);
  console.log(`\n${f} · Juega oculto ${j.oculto} · botones: ${j.botones.join(' · ') || 'ninguno'}\n  texto: ${j.texto}`);
  await p.evaluate(f => document.querySelector(`#${f} .est-ir[data-ir-paso="caso"]`).click(), f); await p.waitForTimeout(300);
  await p.evaluate(f => document.querySelector(`#${f} .est-paso[data-paso="caso"] .may-zona [data-caso="0"]`)?.click(), f); await p.waitForTimeout(300);
  const c = await p.evaluate(f => { const z = document.querySelector(`#${f} .est-paso[data-paso="caso"] .may-zona`); return { calc: [...z.querySelectorAll('button, a')].filter(b => /calculadora|checklist|predictores|clasificador|fuga del manguito|tamaño/i.test(b.textContent)).map(b => b.textContent.trim().slice(0, 60)), dia: z.querySelector('.may-dia')?.textContent }; }, f);
  console.log(`  caso paso 1 (${c.dia}): botones de calculadora: ${c.calc.join(' · ') || 'ninguno'}`);
}
console.log('\nerrores:', JSON.stringify(err.slice(0, 3)));
await b.close();
