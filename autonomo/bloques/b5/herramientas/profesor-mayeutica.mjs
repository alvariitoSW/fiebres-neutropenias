// Profesor (b5, juicio de la Mayéutica de los modelos vivos): recorre el modo «Preguntas» del hepatocito vivo y del termostato vivo
// a 390 px, falla a propósito algunas preguntas, y vuelca en texto lo que ve el residente (enunciado, orden de opciones, respuesta,
// «Compruébalo» y su frase, repaso, pasos de los casos con lo nuevo marcado y «Lo que te llevas»). Hace ≤5 capturas por modelo.
// Uso: node autonomo/bloques/b5/herramientas/profesor-mayeutica.mjs <hpv|tmv> <carpeta-capturas> [puerto]
import { chromium, devices } from '/opt/node22/lib/node_modules/playwright/index.mjs';
const [P, DIR, PORT = '8741'] = process.argv.slice(2);
const datos = P === 'hpv' ? '../../../../js/data/hepatocito-vivo-mayeutica.js' : '../../../../js/data/termostato-vivo-mayeutica.js';
const { PREGUNTAS, CASOS } = await import(new URL(datos, import.meta.url));
const FALLAR = P === 'hpv' ? new Set(['hpv-g4', 'hpv-e3', 'hpv-e4']) : new Set(['tmv-g1', 'tmv-g4', 'tmv-e3']);
const CAPS = P === 'hpv' ? { 'hpv-g4': 'g4-fallada', 'hpv-e3': 'e3-rl-fallada' } : { 'tmv-g4': 'g4-fallada', 'tmv-e3': 'e3-error' };
const txt = h => String(h).replace(/<[^>]+>/g, '').replace(/\s+/g, ' ').trim();
const errores = []; const b = await chromium.launch();
const ctx = await b.newContext({ ...devices['iPhone 12'], viewport: { width: 390, height: 844 }, deviceScaleFactor: 2 }); const p = await ctx.newPage();
p.on('console', m => m.type() === 'error' && !m.text().startsWith('Failed to load') && errores.push(m.text())); p.on('pageerror', e => errores.push(String(e)));
await p.addInitScript(() => { localStorage.removeItem('hepatocito-vivo-mayeutica-v1'); localStorage.removeItem('termostato-vivo-mayeutica-v1'); });
await p.goto(`http://localhost:${PORT}/index.html`, { waitUntil: 'networkidle' }); await p.waitForTimeout(1200);
await p.evaluate((P) => { const t = document.createElement('button'); Object.assign(t.dataset, P === 'hpv' ? { especialidad: 'libros', view: 'hepatocitoVivo', hepatocitoVivo: '' } : { especialidad: 'libros', view: 'termostatoVivo', termostatoVivo: '' }); document.body.append(t); t.click(); t.remove(); }, P);
await p.waitForFunction((P) => window['__' + P], P, { timeout: 8000 }); await p.waitForTimeout(800);
const cont = `#${P}-preg`, esp = ms => p.waitForTimeout(ms);
const clic = sel => p.evaluate(s => { const e = document.querySelector(s); if (!e || e.disabled) return false; e.click(); return true; }, sel);
const hay = sel => p.evaluate(s => { const e = document.querySelector(s); return !!e && e.getClientRects().length > 0; }, sel);
const ver = (n = 1400) => p.evaluate(([s, n]) => (document.querySelector(s)?.innerText || '').replace(/\s+/g, ' ').trim().slice(0, n), [cont, n]);
const monitor = () => p.evaluate((P) => (document.getElementById(P + '-monitor')?.innerText || '').replace(/\s+/g, ' ').trim().slice(0, 140), P);
const cap = async n => { await p.evaluate(() => window.scrollTo(0, 0)); await p.screenshot({ path: `${DIR}/${P}-${n}.png` }); };
const out = []; const log = s => { out.push(s); console.log(s); };
await clic(`#${P}-modo-preguntas`); await esp(600);
log(`== INICIO ==\n${await ver(700)}`); await cap('0-inicio');
await clic(`${cont} [data-ir="recorrido"]`); await esp(400);
async function contestar(q, bien, et) {
  const cab = await ver(260);
  log(`\n--- ${et} [${q.tipo}${q.predice ? ', predice' : ''}${q.sinModelo ? ', sin modelo' : ''}] monitor: «${await monitor()}» | visible ${await hay(`#${P}-monitor`)}\n${cab}`);
  if (q.tipo === 'test') {
    await clic(`${cont} [data-accion="ops"]`); await esp(200);
    const ops = await p.evaluate(s => [...document.querySelectorAll(s + ' [data-op]')].map(b => b.textContent.trim()), cont);
    const buena = txt(q.opciones.find(o => o.ok).t); const iOk = ops.findIndex(t => txt(t) === buena);
    log(`opciones (correcta en pos ${iOk + 1}; largos ${ops.map(o => o.length).join('/')})`);
    const i = bien ? iOk : ops.findIndex((t, k) => k !== iOk);
    await p.evaluate(([s, i]) => document.querySelector(`${s} [data-op="${i}"]`).click(), [cont, i]);
  } else if (q.tipo === 'destapa') {
    await clic(`${cont} [data-accion="destapa"]`); await esp(200);
    await p.evaluate(([s, bien]) => document.querySelectorAll(`${s} input[data-p]`).forEach((x, i) => { if (bien || i === 0) x.checked = true; }), [cont, bien]);
    await clic(`${cont} [data-accion="puntos"]`);
  } else {
    await p.evaluate(([s, mal, bien]) => document.querySelectorAll(`${s} [data-fr]`).forEach((b, i) => { if (bien ? mal[i] : !mal[i] && i === 0) b.click(); }), [cont, q.frases.map(f => f.mal), bien]);
    await clic(`${cont} [data-accion="corregir"]`); await esp(150);
    log(`error, tras corregir (antes de «ver»): ${(await ver(1600)).slice(-700)}`);
    await p.evaluate(s => document.querySelectorAll(`${s} [data-ver]`).forEach(b => b.click()), cont);
  }
  await esp(350);
  const r1 = await ver(2200); log(`respuesta (${bien ? 'bien' : 'MAL a propósito'}): …${r1.slice(Math.max(0, r1.indexOf(bien ? '✓' : '✗') - 10), r1.indexOf(bien ? '✓' : '✗') + 650)}`);
  if (CAPS[q.id]) await cap(CAPS[q.id]);
  if (await hay(`${cont} [data-mando]`)) {
    const m0 = await monitor();
    await p.evaluate(s => { const m = document.querySelector(`${s} [data-mando]`); m.scrollIntoView({ block: 'center' }); m.click(); }, cont);
    await p.waitForFunction(s => document.querySelector(`${s} [data-accion="sig"]`), cont, { timeout: 15000 }).catch(() => log('!! tras Compruébalo no sale Siguiente'));
    await esp(600);
    const r2 = await ver(2600); const k = r2.indexOf('Compru');
    log(`COMPRUÉBALO: monitor antes «${m0}» → después «${await monitor()}»\n  texto: ${r2.slice(k, k + 520)}`);
    if (CAPS[q.id + '-c']) await cap(CAPS[q.id + '-c']);
  }
  const citas = await p.evaluate(s => [...document.querySelectorAll(`${s} [data-resaltar]`)].map(b => b.dataset.resaltar + (document.querySelector(b.dataset.resaltar) ? '' : ' (ROTA)')), cont);
  log(`citas: ${citas.join(', ') || 'NINGUNA'}`);
}
for (let i = 0; i < PREGUNTAS.length; i++) { const q = PREGUNTAS[i]; await contestar(q, !FALLAR.has(q.id), `${i + 1}/${PREGUNTAS.length} ${q.num} ${q.corto}`); await clic(`${cont} [data-accion="sig"]`); await esp(350); }
log(`\n== REPASO ==\n${await ver(900)}`); await cap('repaso');
const chips = await p.evaluate(s => [...document.querySelectorAll(s + ' [data-rep]')].map(b => b.dataset.rep), cont);
for (const id of chips) { await clic(`${cont} [data-rep="${id}"]`); await esp(300); await contestar(PREGUNTAS.find(q => q.id === id), true, `repaso ${id}`); await clic(`${cont} [data-accion="sig"]`); await esp(300); }
log(`\n== TRAS REPASO ==\n${await ver(400)}`);
await clic(`${cont} [data-ir="casos"]`); await esp(300); log(`\n== CASOS ==\n${await ver(600)}`);
for (let k = 0; k < CASOS.length; k++) {
  const C = CASOS[k]; if (k) { await clic(`${cont} [data-fin="otro"]`); await esp(300); }
  await clic(`${cont} [data-caso="${k}"]`); await esp(500);
  for (let i = 0; i < C.pasos.length; i++) {
    const st = C.pasos[i];
    const nuevos = await p.evaluate((P) => [...document.querySelectorAll(`#${P}-preg .${P}-cambia`)].map(x => x.textContent.trim()), P);
    log(`\n### ${C.corto} paso ${i + 1} «${st.momento}» · en rojo: ${JSON.stringify(nuevos)} · ficha: ${JSON.stringify(st.datos)}`);
    const mal = (k === 0 && i === 2) || (k === 1 && i === 1);
    await contestar({ ...st.pregunta, predice: st.pregunta.predice }, !mal, `${C.corto} ${i + 1}`);
    if ((k === 0 && i === 3) || (k === 1 && i === 2)) { await p.evaluate(s => document.querySelector(s + ' [data-accion="sig"]')?.scrollIntoView({ block: 'end' }), cont); await esp(200); await p.screenshot({ path: `${DIR}/${P}-caso-${C.corto}-${i + 1}.png` }); }
    await clic(`${cont} [data-accion="sig"]`); await esp(450);
  }
  log(`\n== FIN ${C.corto} ==\n${await ver(1200)}`);
  if (k === 0) await cap(`fin-${C.corto}`);
}
log(`\nerrores de consola: ${errores.length ? errores.join(' | ') : 'ninguno'}`);
await b.close();
const fs = await import('node:fs'); fs.writeFileSync(`${DIR}/${P}-texto.txt`, out.join('\n'));
