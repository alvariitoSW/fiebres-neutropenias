// Profesor (b5, rejuicio): captura g6 del hepatocito, «Día 6 · la nota del R1» de Jacinta y la parada de Honorato a 390 px. Uso: python3 -m http.server 8742 y node este-archivo (capturas en /tmp/plan-socialista/b5/cap-rejuicio).
import { chromium, devices } from '/opt/node22/lib/node_modules/playwright/index.mjs';
const DIR = '/tmp/plan-socialista/b5/cap-rejuicio', PORT = 8742;
const b = await chromium.launch();
async function abrir(P) {
  const ctx = await b.newContext({ ...devices['iPhone 12'], viewport: { width: 390, height: 844 }, deviceScaleFactor: 2 }); const p = await ctx.newPage();
  await p.addInitScript(() => { localStorage.removeItem('hepatocito-vivo-mayeutica-v1'); localStorage.removeItem('termostato-vivo-mayeutica-v1'); });
  await p.goto(`http://localhost:${PORT}/index.html`, { waitUntil: 'networkidle' }); await p.waitForTimeout(1200);
  await p.evaluate((P) => { const t = document.createElement('button'); Object.assign(t.dataset, P === 'hpv' ? { especialidad: 'libros', view: 'hepatocitoVivo', hepatocitoVivo: '' } : { especialidad: 'libros', view: 'termostatoVivo', termostatoVivo: '' }); document.body.append(t); t.click(); t.remove(); }, P);
  await p.waitForFunction((P) => window['__' + P], P, { timeout: 8000 }); await p.waitForTimeout(800);
  const cont = `#${P}-preg`;
  const clic = sel => p.evaluate(s => { const e = document.querySelector(s); if (!e || e.disabled) return false; e.click(); return true; }, sel);
  const cap = async (n, y = 0) => { await p.evaluate(y => window.scrollTo(0, y), y); await p.waitForTimeout(300); await p.screenshot({ path: `${DIR}/${P}-${n}.png` }); };
  const ok = async (q) => { // contesta bien un test/destapa/error
    if (q.tipo === 'test') { await clic(`${cont} [data-accion="ops"]`); await p.waitForTimeout(200);
      const ops = await p.evaluate(s => [...document.querySelectorAll(s + ' [data-op]')].map(b => b.textContent.trim()), cont);
      const buena = String(q.opciones.find(o => o.ok).t).replace(/<[^>]+>/g, '').replace(/\s+/g, ' ').trim(); const i = ops.findIndex(t => t.replace(/\s+/g, ' ') === buena);
      await p.evaluate(([s, i]) => document.querySelector(`${s} [data-op="${i}"]`).click(), [cont, i]); }
    else if (q.tipo === 'destapa') { await clic(`${cont} [data-accion="destapa"]`); await p.waitForTimeout(200); await p.evaluate(s => document.querySelectorAll(`${s} input[data-p]`).forEach(x => x.checked = true), cont); await clic(`${cont} [data-accion="puntos"]`); }
    else { await p.evaluate(([s, mal]) => document.querySelectorAll(`${s} [data-fr]`).forEach((b, i) => { if (mal[i]) b.click(); }), [cont, q.frases.map(f => f.mal)]); await clic(`${cont} [data-accion="corregir"]`); await p.waitForTimeout(150); await p.evaluate(s => document.querySelectorAll(`${s} [data-ver]`).forEach(b => b.click()), cont); }
    await p.waitForTimeout(350);
    if (await p.evaluate(s => !!document.querySelector(`${s} [data-mando]`), cont)) { await p.evaluate(s => { const m = document.querySelector(`${s} [data-mando]`); m.scrollIntoView({ block: 'center' }); m.click(); }, cont); await p.waitForFunction(s => document.querySelector(`${s} [data-accion="sig"]`), cont, { timeout: 15000 }).catch(() => {}); await p.waitForTimeout(600); }
  };
  const sig = async () => { await clic(`${cont} [data-accion="sig"]`); await p.waitForTimeout(450); };
  const monitor = () => p.evaluate((P) => (document.getElementById(P + '-monitor')?.innerText || '').replace(/\s+/g, ' ').trim().slice(0, 120), P);
  return { p, cont, clic, cap, ok, sig, monitor };
}
{ const { PREGUNTAS } = await import('/home/user/fiebres-neutropenias/js/data/hepatocito-vivo-mayeutica.js');
  const A = await abrir('hpv'); await A.clic('#hpv-modo-preguntas'); await A.p.waitForTimeout(600); await A.clic(`${A.cont} [data-ir="recorrido"]`); await A.p.waitForTimeout(400);
  for (let i = 0; i < 5; i++) { await A.ok(PREGUNTAS[i]); await A.sig(); }
  await A.clic(`${A.cont} [data-accion="ops"]`); await A.p.waitForTimeout(300); await A.cap('g6-opciones', 0);
  const y = await A.p.evaluate(s => document.querySelector(s).getBoundingClientRect().top + window.scrollY - 40, A.cont); await A.cap('g6-opciones-preg', y);
  await A.ok(PREGUNTAS[5]); await A.cap('g6-comprobado', 0); console.log('hpv g6 monitor:', await A.monitor()); }
{ const { CASOS } = await import('/home/user/fiebres-neutropenias/js/data/termostato-vivo-mayeutica.js');
  const A = await abrir('tmv'); await A.clic('#tmv-modo-preguntas'); await A.p.waitForTimeout(600); await A.clic(`${A.cont} [data-ir="casos"]`); await A.p.waitForTimeout(300);
  await A.clic(`${A.cont} [data-caso="0"]`); await A.p.waitForTimeout(500);
  for (let i = 0; i < 2; i++) { await A.ok(CASOS[0].pasos[i].pregunta); await A.sig(); }
  console.log('Jacinta paso 3 monitor:', await A.monitor()); await A.cap('jacinta-3-nota', 0);
  const y = await A.p.evaluate(s => document.querySelector(s).getBoundingClientRect().top + window.scrollY - 40, A.cont); await A.cap('jacinta-3-nota-preg', y);
  await A.p.goto(`http://localhost:${PORT}/index.html`); const B = await abrir('tmv'); await B.clic('#tmv-modo-preguntas'); await B.p.waitForTimeout(600); await B.clic(`${B.cont} [data-ir="casos"]`); await B.p.waitForTimeout(300);
  console.log('caso 1 directo:', await B.clic(`${B.cont} [data-caso="1"]`)); await B.p.waitForTimeout(500);
  for (let i = 0; i < 3; i++) { await B.ok(CASOS[1].pasos[i].pregunta); await B.sig(); }
  console.log('Honorato paso 4 monitor:', await B.monitor()); await B.cap('honorato-4-parada', 0); }
await b.close();
