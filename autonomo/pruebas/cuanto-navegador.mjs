// Abre cada ficha del grupo 6E en Estudiar a 390 px: Piensa (1.ª pregunta) y 1.er paso del caso; sin errores ni desborde.
import { chromium } from '/opt/node22/lib/node_modules/playwright/index.mjs';
const BASE = process.argv[2] || 'http://localhost:8766/', OUT = process.argv[3] || '/tmp/plan-socialista/b6b-6e/cap/';
const b = await chromium.launch(); let fallos = 0;
for (const W of [390, 360]) {
  const p = await (await b.newContext({ viewport: { width: W, height: 844 } })).newPage(); const errs = [];
  p.on('console', m => { if (m.type() === 'error' && !/favicon/.test(m.text())) errs.push(m.text()); }); p.on('pageerror', e => errs.push(e.message));
  await p.goto(BASE + 'index.html'); await p.waitForFunction(() => document.getElementById('mu-tiamina')?.querySelector(':scope > .vista-estudiar'), null, { timeout: 15000 });
  const click = s => p.evaluate(x => { const e = document.querySelector(x); if (!e) throw new Error('no hay ' + x); e.click(); }, s);
  const dsb = () => p.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
  for (const f of ['mu-gasto-energetico', 'mu-sustratos', 'mu-tiamina', 'mu-vitaminas-oligo']) {
    await p.evaluate(t => { const x = document.createElement('button'); Object.assign(x.dataset, { especialidad: 'libros', view: 'marinoNutricion', panel: 'panel-marino-nutri-tabs', tab: t }); document.body.append(x); x.click(); x.remove(); }, f);
    await p.waitForTimeout(500);
    await click(`#${f} > .vista-toggle [data-vista="estudiar"]`); await p.waitForTimeout(400);
    const res = await p.evaluate(x => [...document.querySelectorAll(`#${x} .est-ir b`)].map(e => e.textContent).join('|'), f);
    await click(`#${f} .est-ir[data-ir-paso="piensa"]`); await p.waitForTimeout(300);
    const responder = async Z => {   // contesta lo que haya: test, destapa o error
      await p.evaluate(z => { const q = s => document.querySelector(z + ' ' + s);
        if (q('[data-accion="ops"]')) q('[data-accion="ops"]').click();
        if (q('[data-op="0"]')) q('[data-op="0"]').click();
        else if (q('[data-accion="destapa"]')) { q('[data-accion="destapa"]').click(); document.querySelectorAll(z + ' .may-pts input').forEach(c => { c.checked = true; }); q('[data-accion="puntos"]').click(); }
        else if (q('[data-fr="0"]')) { q('[data-fr="0"]').click(); q('[data-accion="corregir"]').click(); } }, Z);
      await p.waitForTimeout(350);
      return p.evaluate(z => !!document.querySelector(z + ' .may-res [data-accion="sig"]'), Z); };
    const Z = `#${f} .est-paso[data-paso="piensa"] .may-zona`;
    await click(`${Z} [data-ir="seguir"]`); await p.waitForTimeout(250);
    const sig = await responder(Z);
    const d1 = await dsb();
    await click(`#${f} .est-ir[data-ir-paso="caso"]`); await p.waitForTimeout(300);
    const C = `#${f} .est-paso[data-paso="caso"] .may-zona`;
    await click(`${C} [data-caso="0"]`); await p.waitForTimeout(200);
    const sigC = await responder(C);
    const caso = await p.evaluate(z => document.querySelector(z).textContent.slice(0, 120).replace(/\s+/g, ' '), C);
    const d2 = await dsb();
    if (W === 390) await p.screenshot({ path: `${OUT}${f}.png` });
    const ok = res.includes('Piensa') && sig && sigC && d1 <= 0 && d2 <= 0; if (!ok) fallos++;
    console.log(ok ? 'OK ' : 'MAL', W, f, '|', res, '| sig', sig, '| desborde', d1, d2, '|', caso.slice(0, 70));
  }
  console.log(W, 'errores de consola:', errs.length, errs.slice(0, 3)); if (errs.length) fallos++;
}
await b.close(); process.exit(fallos ? 1 : 0);
