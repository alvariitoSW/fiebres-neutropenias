// Recorre la Mayéutica del pulmón a 390 y 360 px: abre, contesta las preguntas, entra en los 3 casos; vigila errores,
// desborde lateral (0 px), NaN y que el monitor se tape en «predice». Uso: node m-may-prueba.mjs http://localhost:PUERTO/ [carpeta-capturas]
import { chromium } from '/opt/node22/lib/node_modules/playwright/index.mjs';
const BASE = (process.argv[2] || 'http://localhost:8000/').replace(/\/?$/, '/'), CAP = process.argv[3] ? process.argv[3].replace(/\/?$/, '/') : null;
const b = await chromium.launch(); let fallos = 0;
for (const W of [390, 360]) {
  const p = await (await b.newContext({ viewport: { width: W, height: 844 }, deviceScaleFactor: 2 })).newPage();
  const err = []; p.on('console', (m) => { if (m.type() === 'error' && !/favicon/.test(m.text())) err.push(m.text()); }); p.on('pageerror', (e) => err.push('PAGE ' + e.message));
  const ok = (c, t) => { console.log(`${c ? '✅' : '❌'} ${W}: ${t}`); if (!c) fallos++; };
  const desb = () => p.evaluate(() => document.documentElement.scrollWidth - innerWidth);
  await p.goto(BASE, { waitUntil: 'networkidle' }); await p.waitForTimeout(500);
  await p.evaluate(() => { const t = document.createElement('button'); Object.assign(t.dataset, { especialidad: 'libros', view: 'pulmonVivo', pulmonVivo: 'sdra-rigido' }); document.body.append(t); t.click(); t.remove(); });
  await p.waitForSelector('#pmy-det', { timeout: 8000 }); await p.waitForTimeout(800);
  await p.evaluate(() => { document.getElementById('pmy-det').open = true; }); await p.waitForTimeout(400);
  await p.locator('#pmy-det [data-ir="recorrido"]').click(); await p.waitForTimeout(500);
  ok((await desb()) <= 0, 'desborde 0 al abrir la Mayéutica');
  let vistas = 0, tapadas = 0;
  for (let i = 0; i < 13; i++) {
    await p.waitForTimeout(450);
    const q = await p.evaluate(() => ({ t: document.querySelector('#pmy-zona .pmy-pregunta')?.textContent?.slice(0, 40), vela: document.getElementById('pul-raiz').classList.contains('pmy-vela') }));
    if (!q.t) break; vistas++; if (q.vela) tapadas++;
    if (CAP && i === 0) await p.screenshot({ path: `${CAP}may-pregunta-${W}.png` });
    // contestar: «Ya lo tengo», una opción, un punto o una frase
    const ya = p.locator('#pmy-zona button', { hasText: /Ya lo tengo|Ver las opciones|Ver opciones/ }).first();
    if (await ya.count()) { await ya.click(); await p.waitForTimeout(300); }
    const op = p.locator('#pmy-zona .pmy-op button.pmy-b').first();
    if (await op.count()) { await op.click(); }
    else {
      for (const c of await p.locator('#pmy-zona input[type=checkbox]').all()) await c.check();
      const fin = p.locator('#pmy-zona button', { hasText: /^(Hecho|Comprobar|Corregir|Listo|Ver)/ }).first(); if (await fin.count()) await fin.click();
    }
    await p.waitForTimeout(300);
    const comp = p.locator('#pmy-zona [data-comprueba]'); if (await comp.count()) { await comp.first().click(); await p.waitForTimeout(500); }
    if (CAP && i === 0) await p.screenshot({ path: `${CAP}may-respuesta-${W}.png` });
    if ((await desb()) > 0) ok(false, `desborde en la pregunta ${i + 1}`);
    const sig = p.locator('#pmy-zona button', { hasText: /Siguiente|Seguir|Continuar/ }).first(); if (await sig.count()) await sig.click(); else break;
  }
  ok(vistas >= 12, `recorrió ${vistas} preguntas (tapó el monitor en ${tapadas})`);
  ok(!(await p.evaluate(() => /NaN|undefined|Infinity/.test(document.getElementById('pmy-zona').innerText))), 'sin NaN/undefined en la Mayéutica');
  ok(err.length === 0, 'sin errores de consola ' + err.slice(0, 3).join(' | '));
  await b.contexts()[b.contexts().length - 1].close();
}
await b.close(); process.exit(fallos ? 1 : 0);
