// Prueba de la pantalla del respirador (comun/respirador.js en b3-pulmon): primera pantalla, mandos redondos al tope,
// teclas de maniobra (EIP, PEEP total), alarmas en la barra y casilla en rojo, modos apagados, «Detener ventilación»,
// la guía a 360 y el dock al primer toque. Uso: PUERTO=8811 node respirador-prueba.mjs [390|360]
import { chromium, devices } from '/opt/node22/lib/node_modules/playwright/index.mjs';
const ANCHO = +(process.argv[2] || 390), ALTO = ANCHO === 390 ? 844 : 780;
const BASE = `http://127.0.0.1:${process.env.PUERTO || 8811}/autonomo/maquetas/b3-pulmon.html`, CAP = '/tmp/plan-socialista/b3/capturas-resp/';
const fallos = [], errores = []; const ok = (c, m) => { if (!c) fallos.push(m); };
const browser = await chromium.launch();
const ctx = await browser.newContext({ ...devices['iPhone 12'], viewport: { width: ANCHO, height: ALTO }, deviceScaleFactor: 2, hasTouch: true, isMobile: true });
const page = await ctx.newPage();
page.on('console', (m) => { if (m.type() === 'error') errores.push(m.text()); }); page.on('pageerror', (e) => errores.push('pageerror: ' + e.message));
const desb = async (t) => { const d = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth); ok(d <= 0, `desborde ${d} px en ${t}`); };
const nan = async (t) => { const x = await page.evaluate(() => /NaN|undefined/.test(document.getElementById('monitor').innerText)); ok(!x, `NaN/undefined en ${t}`); };
const cap = (n) => page.screenshot({ path: `${CAP}${n}-${ANCHO}.png` });
const tap = async (sel) => { const el = page.locator(sel).first(); await el.evaluate((n) => n.scrollIntoView({ block: 'center', behavior: 'instant' })); await el.tap(); await page.waitForTimeout(200); };
const cas = () => page.evaluate(() => Object.fromEntries([...document.querySelectorAll('#monitor .resp-c')].map((c) => [c.dataset.fila, c.querySelector('.v').textContent + (c.classList.contains('al-alarma') ? '!' : c.classList.contains('al-aviso') ? '~' : '') + (c.querySelector('.sub').textContent ? ' (' + c.querySelector('.sub').textContent + ')' : '')])));
const barra = () => page.evaluate(() => document.getElementById('resp-alarma').textContent.trim());
const rueda = async (k, v) => { if (!(await page.evaluate((k) => document.querySelector(`[data-rm="${k}"]`).getAttribute('aria-pressed') === 'true', k))) await tap(`[data-rm="${k}"]`);
  const r = await page.evaluate(([v]) => { const i = document.querySelector('#monitor [data-rd]'); if (!i) return null; const x = Math.min(+i.max, Math.max(+i.min, v)); i.value = x; i.dispatchEvent(new Event('input', { bubbles: true })); return [i.dataset.rd, x]; }, [v]); await page.waitForTimeout(250); return r; };
await page.goto(BASE, { waitUntil: 'networkidle' }); await page.waitForTimeout(2500);
await desb('inicio'); await nan('inicio'); await cap('01-pantalla');
console.log('primera', JSON.stringify(await cas()), '|', await barra());
// congelar (lecturas estables), Rafael
await tap('#pausa'); await tap('[data-pac="rafael"]'); await page.waitForTimeout(300);
// la pausa inspiratoria: la EIP aparece
ok((await cas()).meseta.startsWith('—'), 'EIP no está vacía sin pausa');
await tap('[data-rt="inspmant"]'); await page.waitForTimeout(400); const c1 = await cas(); console.log('insp. mantenida', JSON.stringify(c1)); ok(/^\d/.test(c1.meseta), 'la EIP no aparece con Insp. mantenida');
await page.locator('#monitor').evaluate((n) => n.scrollIntoView({ block: 'start', behavior: 'instant' })); await cap('03-pausa-eip');
await tap('[data-rt="inspmant"]');
// Jacinto: espiración mantenida → PEEP total y oculta
await tap('[data-pac="jacinto"]'); await page.waitForTimeout(300); if (await page.evaluate(() => document.querySelector('[data-rt="espmant"]').getAttribute('aria-pressed') !== 'true')) await tap('[data-rt="espmant"]'); await page.waitForTimeout(400); const c2 = await cas(); console.log('jacinto esp. mantenida', JSON.stringify(c2)); ok(/total/.test(c2.peeptot), 'la PEEP total no aparece con Esp. mantenida');
await tap('[data-rt="espmant"]');
// todos los mandos redondos al tope (y al mínimo), Rafael en VC-AC y en PC-AC
for (const modo of ['vcv', 'pcv']) {
  await tap('[data-pac="rafael"]'); await page.waitForTimeout(300); if (modo === 'pcv') await tap('[data-rmodo="pcv"]');
  for (const k of ['fio2', 'vt', 'ti', 'fr', 'peep', 'flujo', 'pinsp', 'pmax']) for (const v of [9999, -9999]) {
    const r = await rueda(k, v); const c = await cas(); console.log(`${modo} ${k}=${r ? r.join(':') : 'apagado'} → Ppico ${c.pico} EIP ${c.meseta} VTe ${c.vt} VMe ${c.vm} I:E ${c.ie} | ${await barra()}`);
    await nan(`${modo} ${k} ${v}`); await desb(`${modo} ${k} ${v}`);
  }
}
// alarmas: Pmáx 30 en VCV con VT alto → Pmáx alcanzada, casilla Ppico en rojo
await tap('[data-pac="isidro"]'); await page.waitForTimeout(300); await tap('[data-rmodo="vcv"]'); await rueda('vt', 800); await rueda('flujo', 100); await rueda('pmax', 30); await page.waitForTimeout(300);
const c3 = await cas(), b3 = await barra(); console.log('alarma Pmáx', JSON.stringify(c3), '|', b3); ok(/Pmáx alcanzada/.test(b3) && c3.pico.includes('!'), 'Pmáx alcanzada sin alarma');
await page.locator('#monitor').evaluate((n) => n.scrollIntoView({ block: 'start', behavior: 'instant' })); await cap('02-alarma');
// modos apagados y detener
await page.evaluate(() => document.querySelector('[data-rmodo="simv"]').click()); ok(/no en este modelo/.test(await page.evaluate(() => document.querySelector('#monitor .resp-info').textContent)), 'VC-SIMV apagado sin rótulo');
await tap('[data-rmodo="detener"]'); await page.waitForTimeout(300); const c4 = await cas(); console.log('detenida', JSON.stringify(c4), '|', await barra(), '| sello', await page.evaluate(() => [...document.querySelectorAll('.tope-sello')].map((e) => e.textContent.slice(0, 40)).join('|')));
ok(/detenida/.test(await barra()), 'Detener sin alarma'); await tap('[data-rmodo="detener"]');
// Vistas y Alarmas
await tap('[data-rt="vistas"]'); await tap('[data-rt="vistas"]'); await tap('[data-rt="alarmas"]'); await desb('teclas');
// dock: Guía al primer toque con el dock plegado
await tap('[data-rt="congelar"]');
await tap('[data-estado="sdra-protector"]'); await page.waitForTimeout(400);
const plegado = await page.evaluate(() => document.getElementById('dock').classList.contains('dock-plegado'));
await page.locator('#btn-guia').tap(); await page.waitForTimeout(400);
ok(!(await page.evaluate(() => document.getElementById('dock-guia').hidden)), `la Guía no abre al primer toque (plegado: ${plegado})`);
for (const k of ['sdra-protector', 'pausa-inspiratoria']) {
  if (k !== 'sdra-protector') { await page.evaluate(() => document.getElementById('guia-x')?.click()); await tap(`[data-estado="${k}"]`); await page.locator('#btn-guia').tap(); await page.waitForTimeout(400); }
  for (let i = 0; i < 7; i++) {
    const fuera = await page.evaluate(() => { const d = document.getElementById('dock').getBoundingClientRect(); return [...document.querySelectorAll('#dock-guia button')].filter((b) => { const r = b.getBoundingClientRect(); return r.right > innerWidth + 0.5 || r.left < -0.5 || r.bottom > innerHeight + 0.5 || r.top < d.top - 0.5; }).map((b) => b.textContent.trim()); });
    ok(!fuera.length, `${k} guía paso ${i + 1}: se sale ${fuera.join(',')}`);
    if (i === 1) { await cap('04-guia-' + k); if (process.env.DBG) console.log('DOCK', await page.evaluate(() => JSON.stringify([...document.getElementById('dock').querySelectorAll(':scope > *, #dock-guia > * > *')].map((c) => [c.id || c.className, c.offsetHeight]).concat([[innerHeight, document.getElementById('dock').getBoundingClientRect().top]])))); }
    if (process.env.DBG) console.log('DBG', k, i, await page.evaluate(() => JSON.stringify([innerHeight, document.getElementById('dock').getBoundingClientRect(), document.getElementById('guia-sig').getBoundingClientRect(), scrollY])));
    const lab = await page.locator('#guia-sig').innerText(); await page.locator('#guia-sig').tap(); await page.waitForTimeout(250); if (/hecho/i.test(lab)) break;
  }
}
await desb('final');
await browser.close();
console.log('\nERRORES', errores.length, errores.slice(0, 4)); console.log('FALLOS', fallos.length); for (const f of fallos) console.log(' ✗', f);
