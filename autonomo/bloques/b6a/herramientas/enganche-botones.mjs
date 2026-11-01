// Prueba del enganche (b6a): en 3 fichas, contesta la pregunta con modelo, pulsa «Compruébalo» y mira que el modelo abre en su paciente.
// Uso: node autonomo/bloques/b6a/herramientas/enganche-botones.mjs <url-base>
import { chromium } from '/opt/node22/lib/node_modules/playwright/index.mjs';
const { barajar } = await import(new URL('../../../../js/core/mayeutica-motor.js', import.meta.url));
const { MAYEUTICA_B6A_PLACA } = await import(new URL('../../../../js/data/mayeutica/b6a-placa.js', import.meta.url));
const { MAYEUTICA_B6A_CRANEO1 } = await import(new URL('../../../../js/data/mayeutica/b6a-craneo-1.js', import.meta.url)).catch(() => ({}));
const mods = await Promise.all(['b6a-craneo-1', 'b6a-despierto'].map(f => import(new URL(`../../../../js/data/mayeutica/${f}.js`, import.meta.url))));
const todo = Object.assign({}, MAYEUTICA_B6A_PLACA, ...mods.map(m => Object.values(m)[0]));
const BASE = (process.argv[2] || 'http://localhost:8761/').replace(/\/?$/, '/');
const CASOS = [['mn-miastenia', 0, 'placa-viva-view', /Serapio/], ['mn-hic', 0, 'craneo-vivo-view', /Segismundo/], ['mn-consciencia', 1, 'craneo-vivo-view', /Leovigildo/]];
const b = await chromium.launch(); let mal = 0;
for (const ancho of [390]) for (const [ficha, idx, vista, re] of CASOS) {
  const p = await (await b.newContext({ viewport: { width: ancho, height: 844 }, reducedMotion: 'reduce' })).newPage();
  const err = []; p.on('console', m => { if (m.type() === 'error' && !/favicon/.test(m.text())) err.push(m.text()); }); p.on('pageerror', e => err.push(e.message));
  const click = sel => p.evaluate(s => { const e = document.querySelector(s); if (!e) throw new Error('no hay ' + s); e.click(); }, sel);
  await p.goto(BASE + 'index.html'); await p.waitForFunction(f => document.getElementById(f)?.querySelector(':scope > .vista-estudiar'), ficha, { timeout: 15000 });
  await p.evaluate(t => { const x = document.createElement('button'); Object.assign(x.dataset, { especialidad: 'libros', view: 'marinoNeuro', panel: 'panel-marino-neuro-tabs', tab: t }); document.body.append(x); x.click(); x.remove(); }, ficha);
  await p.waitForTimeout(400);
  await p.evaluate(f => [...document.querySelectorAll(`#${f} > .vista-toggle button`)].find(x => x.textContent === 'Mayéutica').click(), ficha); await p.waitForTimeout(300);
  const Z = `#${ficha} .est-paso[data-paso="piensa"] .may-zona`;
  await click(`${Z} [data-ir="seguir"]`);
  for (let i = 0; i <= idx; i++) {
    const q = todo[ficha].guia[i];
    await click(`${Z} [data-accion="ops"]`); await click(`${Z} [data-op="${barajar(q.opciones, q.id).findIndex(o => o.ok)}"]`); await p.waitForTimeout(80);
    if (i < idx) await click(`${Z} [data-accion="sig"]`);
  }
  const attrs = await p.evaluate(z => { const e = [...document.querySelectorAll(z + " .may-res .may-modelo[data-craneo-vivo], " + z + " .may-res .may-modelo[data-placa-viva]")].filter(x => x.offsetParent).pop(); return e && { t: e.textContent, a: Object.keys(e.dataset).join(',') + ' = ' + (e.dataset.craneoVivo || e.dataset.placaViva) }; }, Z);
  await p.evaluate(z => [...document.querySelectorAll(z + " .may-res .may-modelo[data-craneo-vivo], " + z + " .may-res .may-modelo[data-placa-viva]")].filter(x => x.offsetParent).pop().click(), Z); await p.waitForTimeout(1500);
  const r = await p.evaluate(([v, ficha]) => { const e = document.getElementById(v); return { visible: !!e && !!e.offsetParent, texto: e?.textContent.slice(0, 4000) || '', sc: document.documentElement.scrollWidth - innerWidth }; }, [vista, ficha]);
  const ok = attrs && r.visible && re.test(r.texto) && !err.length && r.sc <= 0; if (!ok) mal++;
  console.log(`${ok ? '✅' : '❌'} ${ficha} -> ${JSON.stringify(attrs)} | modelo visible=${r.visible} paciente=${re.test(r.texto)} desborde=${r.sc} errores=${err.join(';')}`);
  if (ficha === 'mn-miastenia') await p.screenshot({ path: '/tmp/plan-socialista/b6a/cons/placa.png' });
  if (ficha === 'mn-hic') await p.screenshot({ path: '/tmp/plan-socialista/b6a/cons/craneo.png' });
}
await b.close(); process.exit(mal ? 1 : 0);
