// Rejuicio b6a (profesor): mnr-g4 → Compruébalo → mel:4 (TOF, fuerza, estado) y la caja de guía visible sin scroll en mel:4 y segismundo:2.
// Uso: node autonomo/bloques/b6a/herramientas/rejuicio-enganche.mjs <url-base> [capturas=0|1]
import { chromium } from '/opt/node22/lib/node_modules/playwright/index.mjs';
const { barajar } = await import(new URL('../../../../js/core/mayeutica-motor.js', import.meta.url));
const mods = await Promise.all(['b6a-placa', 'b6a-craneo-1'].map(f => import(new URL(`../../../../js/data/mayeutica/${f}.js`, import.meta.url))));
const todo = Object.assign({}, ...mods.map(m => Object.values(m)[0]));
const BASE = (process.argv[2] || 'http://localhost:8761/').replace(/\/?$/, '/'); const CAP = process.argv[3] === '1';
const CASOS = [['mn-relajantes', 'mnr-g4', 'placa-viva-view', 'plv', /Melqu/], ['mn-hic', null, 'craneo-vivo-view', 'crv', /Segismundo/]];
const b = await chromium.launch(); let mal = 0;
for (const [ficha, qid, vista, pre, re] of CASOS) {
  const p = await (await b.newContext({ viewport: { width: 390, height: 844 }, reducedMotion: 'reduce' })).newPage();
  const err = []; p.on('console', m => { if (m.type() === 'error' && !/favicon/.test(m.text())) err.push(m.text()); }); p.on('pageerror', e => err.push(e.message));
  const click = sel => p.evaluate(s => { const e = document.querySelector(s); if (!e) throw new Error('no hay ' + s); e.click(); }, sel);
  await p.goto(BASE + 'index.html'); await p.waitForFunction(f => document.getElementById(f)?.querySelector(':scope > .vista-estudiar'), ficha, { timeout: 15000 });
  await p.evaluate(t => { const x = document.createElement('button'); Object.assign(x.dataset, { especialidad: 'libros', view: 'marinoNeuro', panel: 'panel-marino-neuro-tabs', tab: t }); document.body.append(x); x.click(); x.remove(); }, ficha);
  await p.waitForTimeout(400);
  await p.evaluate(f => [...document.querySelectorAll(`#${f} > .vista-toggle button`)].find(x => x.textContent === 'Mayéutica').click(), ficha); await p.waitForTimeout(300);
  const Z = `#${ficha} .est-paso[data-paso="piensa"] .may-zona`;
  await click(`${Z} [data-ir="seguir"]`);
  const guia = todo[ficha].guia; const idx = qid ? guia.findIndex(q => q.id === qid) : guia.findIndex(q => q.modelo && /:/.test(Object.values(q.modelo)[0]));
  for (let i = 0; i <= idx; i++) {
    const q = guia[i];
    await click(`${Z} [data-accion="ops"]`); await click(`${Z} [data-op="${barajar(q.opciones, q.id).findIndex(o => o.ok)}"]`); await p.waitForTimeout(80);
    if (i < idx) await click(`${Z} [data-accion="sig"]`);
  }
  const attrs = await p.evaluate(z => { const e = [...document.querySelectorAll(z + " .may-res .may-modelo[data-craneo-vivo], " + z + " .may-res .may-modelo[data-placa-viva]")].filter(x => x.offsetParent).pop(); return e && { t: e.textContent, a: (e.dataset.craneoVivo || e.dataset.placaViva) }; }, Z);
  await p.evaluate(z => [...document.querySelectorAll(z + " .may-res .may-modelo[data-craneo-vivo], " + z + " .may-res .may-modelo[data-placa-viva]")].filter(x => x.offsetParent).pop().click(), Z); await p.waitForTimeout(1800);
  const r = await p.evaluate(([v, pre]) => {
    const e = document.getElementById(v); const g = document.getElementById(pre + '-guia'); const rg = g && !g.hidden ? g.getBoundingClientRect() : null;
    const mon = ['m-tof', 'm-f', 'm-cv', 'm-pim', 'm-cond'].map(k => [k, document.getElementById(pre + '-' + k)?.textContent]).filter(x => x[1]);
    const S = window.__plv?.s; const est = S ? { rel: S.rel, min: S.min, perf: S.perf, k: S.k, via: S.via } : (window.__craneo ? window.__craneo.leer() : null);
    const top = window.__plv ? window.__plv.leer() : null;
    return { visible: !!e && !!e.offsetParent, guia: g ? g.textContent.slice(0, 260) : 'no caja', rect: rg && { top: Math.round(rg.top), bottom: Math.round(rg.bottom) }, scrollY: Math.round(scrollY), mon, est, top: top && { tof: top.tof, f: top.f, cv: Math.round(top.cv) }, texto: e?.textContent.slice(0, 3000) || '', sc: document.documentElement.scrollWidth - innerWidth };
  }, [vista, pre]);
  const cajaVisible = r.rect && r.rect.top >= 0 && r.rect.bottom <= 844;
  const ok = attrs && r.visible && re.test(r.texto) && !err.length && r.sc <= 0 && cajaVisible; if (!ok) mal++;
  console.log(`${ok ? '✅' : '❌'} ${ficha} ${qid || ''} -> ${JSON.stringify(attrs)}\n   modelo visible=${r.visible} paciente=${re.test(r.texto)} desborde=${r.sc} errores=${err.join(';') || 'ninguno'}\n   caja: ${JSON.stringify(r.rect)} scrollY=${r.scrollY} visibleSinScroll=${cajaVisible}\n   guía: ${r.guia}\n   monitor: ${JSON.stringify(r.mon)} estado: ${JSON.stringify(r.est)} leer: ${JSON.stringify(r.top)}`);
  // hipótesis: la rAF de index.js (raiz.scrollIntoView start) pisa la de pagina.js (guia center). Reabriendo solo pagina.abrirEstado:
  const r2 = await p.evaluate(([pre, a]) => { (window.__plv || window.__craneo).abrirEstado(a); return new Promise(res => requestAnimationFrame(() => requestAnimationFrame(() => { const g = document.getElementById(pre + '-guia'); const rg = g.getBoundingClientRect(); res({ top: Math.round(rg.top), bottom: Math.round(rg.bottom), scrollY: Math.round(scrollY) }); }))); }, [pre, attrs.a]);
  console.log('   solo pagina.abrirEstado (sin la rAF de index.js): ' + JSON.stringify(r2));
  if (CAP) await p.screenshot({ path: `/tmp/plan-socialista/b6a/cons/rej-${ficha}.png` });
}
await b.close(); process.exit(mal ? 1 : 0);
