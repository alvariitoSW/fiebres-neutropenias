// Juicio rápido v3 · pulmón (M3): estados, cifras, guía por estado, mandos, Mayéutica entera, capturas, desborde.
import { chromium, devices } from '/opt/node22/lib/node_modules/playwright/index.mjs';
const ANCHO = +(process.argv[2] || 390), ALTO = ANCHO === 390 ? 844 : 780;
const BASE = `http://127.0.0.1:${process.env.PUERTO || 8795}/autonomo/maquetas/b3-pulmon.html`, CAP = '/tmp/plan-socialista/b3/capturas-v3/pulmon/';
const fallos = [], errores = []; const ok = (c, m) => { if (!c) fallos.push(m); };
const browser = await chromium.launch();
const ctx = await browser.newContext({ ...devices['iPhone 12'], viewport: { width: ANCHO, height: ALTO }, deviceScaleFactor: 2, hasTouch: true, isMobile: true });
const page = await ctx.newPage();
page.on('console', (m) => { if (m.type() === 'error') errores.push(m.text()); }); page.on('pageerror', (e) => errores.push('pageerror: ' + e.message));
const desb = async (t) => { const d = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth); ok(d <= 0, `desborde ${d} px en ${t}`); };
const cap = (n) => page.screenshot({ path: `${CAP}${n}-${ANCHO}.png` });
const tap = async (sel) => { if (sel === '#btn-guia' && await page.evaluate(() => document.getElementById('dock').classList.contains('dock-plegado'))) { await page.locator('.dock-asa').tap(); await page.waitForTimeout(300); }   // dock plegado: el primer toque lo despliega (comun/dock.js) y el click de Guía se pierde
  const el = page.locator(sel).first(); await el.evaluate((n) => n.scrollIntoView({ block: 'center', behavior: 'instant' })); await el.tap(); await page.waitForTimeout(150); };
const cifras = () => page.evaluate(() => { const g = (k) => document.querySelector(`[data-fila="${k}"]`)?.textContent.replace(/\s+/g, ' ').trim(); return ['pico', 'flujofin', 'vt', 'meseta', 'pres', 'peeptot', 'cstat', 'dp', 'vtkg', 'vm', 'ie'].map(g).join(' | ') + ' || ' + document.getElementById('consola').textContent.trim().slice(0, 80); });
const frase = () => page.evaluate(() => document.getElementById('frase-txt').textContent.replace(/\s+/g, ' ').slice(0, 220) + ' ## ' + document.getElementById('ficha-pac').textContent);
const mando = async (k, v) => { await page.evaluate(([k, v]) => { const i = document.querySelector(`input[data-m="${k}"]`); if (!i) return; i.value = v; i.dispatchEvent(new Event('input', { bubbles: true })); }, [k, v]); await page.waitForTimeout(2600); };
await page.goto(BASE, { waitUntil: 'networkidle' }); await page.waitForTimeout(2500);
await desb('inicio'); await cap('00-primera');
console.log('alto página', await page.evaluate(() => document.documentElement.scrollHeight), 'dock', await page.evaluate(() => document.getElementById('dock').offsetHeight), 'escena top/alto', await page.evaluate(() => { const r = document.getElementById('escena').getBoundingClientRect(); return [Math.round(r.top), Math.round(r.height)]; }), 'monitor top/alto', await page.evaluate(() => { const r = document.querySelector('.monitor, #monitor').getBoundingClientRect(); return [Math.round(r.top), Math.round(r.height)]; }));
const minF = await page.evaluate(() => { let m = 99, who = ''; for (const t of document.querySelectorAll('svg text')) { const r = t.getBoundingClientRect(); if (!r.width || !r.height) continue; const sv = t.ownerSVGElement; const vb = sv.viewBox.baseVal; const esc = vb && vb.width ? sv.getBoundingClientRect().width / vb.width : 1; const fs = parseFloat(getComputedStyle(t).fontSize) * esc; if (fs < m) { m = fs; who = t.textContent.slice(0, 20) + '@' + (sv.id || ''); } } return [Math.round(m * 10) / 10, who]; }); console.log('fuente mínima SVG', minF);
const estados = await page.evaluate(() => [...document.querySelectorAll('#leyenda [data-estado]')].map((b) => b.dataset.estado)); console.log('estados', estados);
for (const k of estados) {
  await tap(`[data-estado="${k}"]`); await page.waitForTimeout(3200);
  console.log(`\n[${k}] ${await frase()}`); console.log('   ' + await cifras()); await desb(k);
  await cap('10-' + k);
  // guía completa
  await tap('#btn-guia'); await page.waitForTimeout(500);
  let n = 0; const pasos = [];
  for (let i = 0; i < 7; i++) {
    const t = await page.evaluate(() => ({ txt: document.querySelector('.guia-txt')?.textContent.replace(/\s+/g, ' ').slice(0, 150), cita: !!document.querySelector('#dock-guia .cita, #dock-guia [data-resaltar], #dock-guia a'), anillos: document.querySelectorAll('.guia-anillo').length, tramos: document.querySelectorAll('[data-tramo]').length, marcos: document.querySelectorAll('.guia-marco').length, n: document.querySelector('.guia-n')?.textContent }));
    pasos.push(`${t.n}: señal a${t.anillos}/t${t.tramos}/m${t.marcos} cita:${t.cita} · ${t.txt}`);
    ok(t.anillos + t.tramos + t.marcos > 0, `${k} guía ${t.n}: no señala nada`);
    if (i === 1) { await cap('11-guia-' + k); await desb(k + ' guía'); }
    n++; const b = page.locator('#guia-sig'); const lab = await b.innerText(); if (process.env.DBG) console.log('DBG', n, await page.evaluate(() => [innerHeight, JSON.stringify(document.getElementById('dock').getBoundingClientRect()), JSON.stringify(document.getElementById('guia-sig').getBoundingClientRect())])); if (await page.evaluate(() => { const r = document.getElementById('guia-sig').getBoundingClientRect(); return r.right > innerWidth; })) { console.log('AVISO guía: «' + lab + '» se sale por la derecha a ' + ANCHO + ' px (' + k + ')'); await b.evaluate((n) => n.click()); } else await b.tap(); await page.waitForTimeout(250); if (/hecho/i.test(lab)) break;
  }
  console.log('   guía ' + n + ' pasos\n   ' + pasos.join('\n   '));
}
// mandos: normal-vcv, barrido
await tap('[data-estado="normal-vcv"]'); await page.waitForTimeout(1500);
await tap('[data-pest="resp"]');
for (const [k, v] of [['vt', 800], ['vt', 300], ['flujo', 30], ['flujo', 100], ['fr', 35], ['peep', 20]]) { await mando(k, v); console.log(`mando ${k}=${v}: ${await cifras()}`); await desb(`${k}=${v}`); }
await tap('[data-estado="normal-vcv"]'); await page.waitForTimeout(800); await tap('[data-pest="pulmon"]');
for (const [k, v] of [['c', 15], ['c', 100], ['r', 40]]) { await mando(k, v); console.log(`mando ${k}=${v}: ${await cifras()}`); }
await tap('[data-m="fesp"][data-v="3"]'); await page.waitForTimeout(2600); console.log(`esp ×3 (R 40): ${await cifras()}`); await cap('12-mandos-r40');
await tap('[data-estado="normal-pcv"]'); await page.waitForTimeout(800); await tap('[data-pest="resp"]'); for (const [k, v] of [['pinsp', 30], ['pinsp', 5]]) { await mando(k, v); console.log(`PCV ${k}=${v}: ${await cifras()}`); }
await tap('[data-estado="sdra-rigido"]'); await page.waitForTimeout(800); await tap('[data-pest="man"]'); await tap('[data-m="pausa"]'); await page.waitForTimeout(3500); console.log(`sdra + pausa: ${await cifras()}`); await tap('[data-m="oclusion"]'); await page.waitForTimeout(6500); console.log(`sdra + pausa + oclusión: ${await cifras()}`); await cap('13-sdra-maniobras');
// Mayéutica entera, fallando a propósito (op 1 vs 3)
await tap('#modo-may'); await page.waitForTimeout(700); await desb('may'); await cap('20-may-primera');
console.log('velo', await page.evaluate(() => !document.getElementById('velo-mon').hidden), 'preg top', await page.evaluate(() => document.getElementById('zona-may').getBoundingClientRect().top));
let pasos = 0; const vistos = []; let destapa = 0, errorTxt = 0; const textos = [];
for (let i = 0; i < 90; i++) {
  pasos++;
  const num = await page.evaluate(() => (document.querySelector('.cab-preg .num') || {}).textContent); if (num && num !== vistos[vistos.length - 1]) { vistos.push(num); textos.push(num + ' · ' + await page.evaluate(() => (document.querySelector('#zona-may .enun, #zona-may p') || {}).textContent?.replace(/\s+/g, ' ').slice(0, 110))); }
  if (await page.locator('[data-mm="destapar"]:visible').count()) destapa++;
  if (await page.locator('[data-fr]:visible').count()) errorTxt++;
  if ([1, 4, 8, 12, 16, 20].includes(i)) await cap('21-may-' + String(i).padStart(2, '0'));
  const clicked = await page.evaluate((i) => {
    const q = (s) => [...document.querySelectorAll(s)].find((e) => e.offsetParent !== null && !e.disabled);
    let e = q('[data-mm="ops"]') || q('[data-mm="destapar"]'); if (e) { e.click(); return 'a'; }
    const ops = [...document.querySelectorAll('[data-op]')].filter((e) => e.offsetParent !== null && !e.disabled); if (ops.length) { ops[i % 3 === 1 ? ops.length - 1 : 0].click(); return 'op'; }
    const fr = [...document.querySelectorAll('[data-fr]')].filter((e) => e.offsetParent !== null); if (fr.length) { fr[0].click(); e = q('[data-mm="corregir"]'); e && e.click(); return 'fr'; }
    for (const t of document.querySelectorAll('[data-tenia]')) if (t.offsetParent !== null) t.click();
    e = q('[data-mm="tocar"]') || q('[data-mm="destapado"]') || q('[data-mm="sig"]') || q('[data-mm="otra"]') || q('[data-mm="comprueba"]'); if (e) { e.click(); return 'n'; } return null;
  }, i);
  await page.waitForTimeout(250); await desb('may paso ' + i);
  const txt = await page.evaluate(() => document.body.innerText); ok(!/undefined|NaN/.test(txt), `may paso ${i}: undefined/NaN`);
  if (!clicked) break;
  if (await page.locator('text=Lo que te llevas').count()) { await cap('22-may-final'); break; }
}
console.log('may pasos', pasos, 'vistos', vistos.join(','), 'destapa', destapa, 'error', errorTxt); console.log(textos.join('\n'));
await cap('23-may-ultima');
const vuelta = page.locator('[data-mm="modelo"], button:has-text("modelo")'); if (await vuelta.count()) { await vuelta.first().tap(); await page.waitForTimeout(800); console.log('vuelta al modelo:', await frase()); await cap('24-vuelta'); }
await browser.close();
console.log('\nERRORES', errores.length, errores.slice(0, 4)); console.log('FALLOS', fallos.length); for (const f of fallos) console.log(' ✗', f);
