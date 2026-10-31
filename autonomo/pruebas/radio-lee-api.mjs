// Prueba de montarLectura (API genérica): zonas, error, validaciones. Uso: node autonomo/pruebas/radio-lee-api.mjs <url-base>
import { chromium } from '/opt/node22/lib/node_modules/playwright/index.mjs';
const BASE = (process.argv[2] || 'http://localhost:8123/').replace(/\/?$/, '/');
const b = await chromium.launch(); const fallos = [];
for (const w of [390, 360]) {
  const p = await (await b.newContext({ viewport: { width: w, height: 844 }, hasTouch: true, isMobile: true })).newPage();
  const errs = []; p.on('console', m => m.type() === 'error' && errs.push(m.text()));
  await p.goto(BASE); await p.waitForSelector('#radio-f6-ejercicios', { state: 'attached' });
  const r = await p.evaluate(async () => {
    const { montarLectura } = await import('./js/modules/pif-radio/radio-lee.js');
    const h = document.createElement('div'); document.body.appendChild(h);
    const base = { img: 'js/modules/neumologia/img/neumo-fig28-1-radiografia-tubo-et.jpg', alt: 'x', pie: 'pie' };
    const f = { texto: 'Marino fig', pdf: 'docs/x.pdf', pagina: 3 };
    const ej = { ...base, id: 'prueba-z', fuente: f, zonas: [{ id: 'a', forma: 'rect', x: 40, y: 20, w: 20, h: 10, rotulo: 'A', cita: 'pie' }, { id: 'b', forma: 'circulo', x: 50, y: 60, r: 2, rotulo: 'B', cita: 'pie' }],
      error: { enunciado: '¿Cuál está mal?', opciones: [{ texto: 'L1', esError: false, explicacion: 'e1' }, { texto: 'L2', esError: true, explicacion: 'e2' }, { texto: 'L3', esError: false, explicacion: 'e3' }] } };
    const ok = montarLectura(h, ej);
    const dup = montarLectura(h, ej);
    const sinLic = montarLectura(h, { ...base, id: 'prueba-c', fuente: { texto: 't', url: 'https://commons.wikimedia.org/x' } });
    return { ok: !!ok, dup, sinLic };
  });
  if (!r.ok || r.dup !== null || r.sinLic !== null) fallos.push(`${w} montaje/validación ${JSON.stringify(r)}`);
  if (errs.filter(e => /id repetido|sin licencia/.test(e)).length !== 2) fallos.push(`${w} console.error esperado x2: ${errs}`);
  const img = p.locator('#rl-prueba-z-img'); await img.scrollIntoViewIfNeeded(); const bb = await img.boundingBox();
  await p.touchscreen.tap(bb.x + bb.width * .5, bb.y + bb.height * .25);
  let vis = await p.evaluate(() => !document.getElementById('rl-prueba-z-zt-a').hidden);
  if (!vis) fallos.push(`${w} tocar zona rect no destapa`);
  await p.touchscreen.tap(bb.x + bb.width * .5 + 10, bb.y + bb.height * .6 + 10);   // 10 px fuera del centro: diana ≥32 px
  vis = await p.evaluate(() => !document.getElementById('rl-prueba-z-zt-b').hidden);
  if (!vis) fallos.push(`${w} diana de zona circular demasiado pequeña`);
  await p.locator('#rl-prueba-z-tapar').tap();
  if (await p.evaluate(() => !document.getElementById('rl-prueba-z-zt-a').hidden)) fallos.push(`${w} Tapar no oculta`);
  await p.locator('#rl-prueba-z-destapar').tap();
  const dt = await p.evaluate(() => ({ rot: document.querySelectorAll('#rl-prueba-z [id*="-zt-"]:not([hidden])').length, marcos: document.querySelectorAll('#rl-prueba-z .radio-zona:not([hidden])').length, lista: document.querySelectorAll('#rl-prueba-z-lista li').length, listaVisible: !document.getElementById('rl-prueba-z-lista').hidden }));
  if (dt.rot !== 0 || dt.marcos !== 2 || dt.lista !== 2 || !dt.listaVisible) fallos.push(`${w} Destapar todo: marcos numerados y lista, sin rótulos sobre la imagen ${JSON.stringify(dt)}`);
  await p.touchscreen.tap(bb.x + bb.width * .5, bb.y + bb.height * .25);
  if (await p.evaluate(() => document.getElementById('rl-prueba-z-zt-a').hidden)) fallos.push(`${w} tras Destapar todo, tocar una zona no saca su rótulo`);
  // error con 1 fallo: marcar la falsa y corregir; con la 'Todas son correctas' se falla
  await p.locator('#rl-prueba-z-eops button').nth(1).tap(); await p.locator('#rl-prueba-z-corregir').tap(); await p.waitForTimeout(100);
  const e = await p.evaluate(() => ({ ok: document.getElementById('rl-prueba-z-res').dataset.ok, n: document.querySelectorAll('#rl-prueba-z-errres li').length, dw: document.documentElement.scrollWidth - innerWidth }));
  if (e.ok !== 'true' || e.n !== 3 || e.dw > 0) fallos.push(`${w} error: ${JSON.stringify(e)}`);
  // pregunta + error (tubo y vía): las opciones de lectura llaman a listo(); el error sale tras «Comprobar» y puede haber 0 errores
  const q = await p.evaluate(async () => {
    const { montarLectura } = await import('./js/modules/pif-radio/radio-lee.js');
    const h = document.createElement('div'); document.body.appendChild(h);
    document.getElementById('rl-prueba-z')?.remove();
    const o = (t, e) => ({ texto: t, esError: e, explicacion: 'x' });
    montarLectura(h, { id: 'prueba-q', img: 'js/modules/neumologia/img/neumo-fig28-1-radiografia-tubo-et.jpg', alt: 'x', pie: 'pie', fuente: { texto: 'M', pdf: 'docs/x.pdf', pagina: 3 },
      pregunta: { enunciado: 'Lectura', elecciones: ['a', 'b'], correcta: 0, explicacion: 'ex' }, error: { enunciado: 'e', opciones: [o('L1', false), o('L2', false)] } });
    return true;
  });
  const comp = p.locator('#rl-prueba-q-comprobar'); await comp.scrollIntoViewIfNeeded();
  if (!(await comp.isDisabled())) fallos.push(`${w} Comprobar activo antes de elegir`);
  await p.locator('#rl-prueba-q-ops button').nth(0).tap();
  if (await comp.isDisabled()) fallos.push(`${w} pregunta+error: elegir lectura no activa Comprobar`);
  if (await p.locator('#rl-prueba-q-eops').count()) fallos.push(`${w} el error sale antes de Comprobar`);
  await comp.tap(); await p.waitForTimeout(100);
  if (!(await p.locator('#rl-prueba-q-eops button').count())) fallos.push(`${w} el error no sale tras Comprobar`);
  await p.locator('#rl-prueba-q-eops button').nth(2).tap(); await p.locator('#rl-prueba-q-corregir').tap(); await p.waitForTimeout(100);
  const z = await p.evaluate(() => ({ ok: document.getElementById('rl-prueba-q-errres')?.dataset.ok, dw: document.documentElement.scrollWidth - innerWidth }));
  if (z.ok !== 'true' || z.dw > 0) fallos.push(`${w} 0 errores con «Todas son correctas»: ${JSON.stringify(z)}`);
}
await b.close();
if (fallos.length) { console.log('❌ radio-lee-api\n' + fallos.join('\n')); process.exit(1); } else console.log('✅ radio-lee-api: zonas, dianas, error y validaciones');
