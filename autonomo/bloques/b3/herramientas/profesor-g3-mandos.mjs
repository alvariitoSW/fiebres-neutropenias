// Profesor G3 · complemento: abre cada estado desde el paso «Juega» de la ficha, abre el dock de mandos, mueve el mando que
// enseña (data-m) y lee monitor, frase y sellos antes y después. Uso: node profesor-g3-mandos.mjs http://localhost:PUERTO/ /carpeta/
import { chromium, devices } from '/opt/node22/lib/node_modules/playwright/index.mjs';
const BASE = process.argv[2].replace(/\/?$/, '/'), OUT = process.argv[3].replace(/\/?$/, '/');
const PLAN = [
  ['neumo-sdra-ventilacion', 'volutrauma', [['vt', 420], ['vt', 350]], false],
  ['neumo-sdra-ventilacion', 'atelectrauma-zeep', [['peep', 5]], true],
  ['neumo-sdra-ventilacion', 'sdra-protector', [['fr', 35]], false],
  ['neumo-sdra-no-ventilatorio', 'p-sili', [['pmus', 4], ['pmus', 9]], false],
  ['neumo-sdra-no-ventilatorio', 'hfno', [['canula', 50], ['canula', 60]], true],
  ['neumo-sdra-no-ventilatorio', 'prono', [['horas', 16], ['horas', 0]], true],
];
const b = await chromium.launch();
const p = await (await b.newContext({ ...devices['iPhone 12'], viewport: { width: 390, height: 844 }, hasTouch: true, isMobile: true })).newPage();
const err = []; p.on('pageerror', e => err.push(e.message)); p.on('console', m => m.type() === 'error' && err.push(m.text()));
await p.goto(BASE, { waitUntil: 'networkidle' }); await p.waitForTimeout(800);
const NAV = { especialidad: 'neumologia', view: 'merinoNeumologia', panel: 'panel-merino-neumo-tabs' };
const abrir = tab => p.evaluate(([t, nav]) => { const x = document.createElement('button'); Object.assign(x.dataset, { ...nav, tab: t }); document.body.append(x); x.click(); x.remove(); }, [tab, NAV]);
const pulsar = sel => p.evaluate(s => { const e = document.querySelector(s); if (!e) throw new Error('no hay ' + s); e.scrollIntoView({ block: 'center' }); e.click(); }, sel);
const leer = () => p.evaluate(() => { const f = [...document.querySelectorAll('.pul-raiz [data-fila]')].map(e => e.dataset.fila + '=' + (e.querySelector('.v')?.textContent.trim() || e.textContent.trim().slice(0, 14))).filter(x => /^(pico|meseta|peeptot|fr|vt|vm|fio2|cstat|dp|vtkg|neumo-spo2|frespon)=/.test(x)); const sellos = [...document.querySelectorAll('.pul-raiz [class*="sello"]')].filter(e => e.offsetParent && e.textContent.trim()).map(e => e.textContent.trim().slice(0, 90)); const pos = [...document.querySelectorAll('[data-m="pos"]')].map(b => b.dataset.v + (b.getAttribute('aria-pressed') === 'true' ? '*' : '')).join('/'); const outs = [...document.querySelectorAll('.deslizador output')].map(o => o.textContent.trim().replace(/\s+/g, ' ').slice(0, 60)); const pf = [...document.querySelectorAll('.pul-raiz *')].map(e => e.childElementCount === 0 ? e.textContent : '').filter(t => /P\/F|PaO₂\/FiO₂/.test(t)).slice(0, 2).map(t => t.trim().slice(0, 60)); return { estado: document.querySelector('#pul-leyenda [aria-pressed="true"]')?.textContent.trim(), frase: document.getElementById('pul-frase-txt')?.textContent.trim().slice(0, 220), filas: f.join(' · '), sellos: [...new Set(sellos)].join(' | ') || '—', pos, mandos: outs.join(' · '), pf: pf.join(' | ') }; });
const mover = async (k, v) => { const r = await p.evaluate(([k, v]) => { const i = document.querySelector(`input[type=range][data-m="${k}"]`); if (!i) return 'sin mando ' + k; i.value = v; i.dispatchEvent(new Event('input', { bubbles: true })); i.dispatchEvent(new Event('change', { bubbles: true })); return `ok (min ${i.min} max ${i.max})`; }, [k, v]); await p.waitForTimeout(2300); await p.evaluate(() => window.__pulPruebas?.().llenar?.()); return r; };
for (const [ficha, estado, mandos, fotoSi] of PLAN) {
  await abrir(ficha); await p.waitForTimeout(500);
  await pulsar(`#${ficha} > .vista-toggle [data-vista="estudiar"]`); await p.waitForTimeout(500);
  await pulsar(`#${ficha} .est-ir[data-ir-paso="juega"]`); await p.waitForTimeout(300);
  await pulsar(`#${ficha} .est-paso[data-paso="juega"] .est-juega[data-pulmon-vivo="${estado}"]`); await p.waitForTimeout(2500);
  await p.evaluate(() => window.__pulPruebas?.().llenar?.());
  try { await pulsar('#dock-tabs button[data-pest="resp"]'); } catch (e) { console.log('  dock: ' + e.message.slice(0, 60)); } await p.waitForTimeout(400);
  const a = await leer();
  console.log(`\n== ${estado} (desde Juega de ${ficha}) · estado «${a.estado}» · pos ${a.pos || '—'}`);
  console.log(`  frase: ${a.frase}`); console.log(`  monitor: ${a.filas}`); console.log(`  mandos: ${a.mandos}`); console.log(`  sellos: ${a.sellos} · P/F: ${a.pf || '—'}`);
  if (fotoSi) { await p.evaluate(() => document.getElementById('esc-svg')?.scrollIntoView({ block: 'start' })); await p.waitForTimeout(300); await p.screenshot({ path: `${OUT}juega-${estado}.png` }); }
  for (const [k, v] of mandos) {
    if (k === 'horas' && v > 0) { try { await pulsar('[data-m="pos"][data-v="prono"]'); await p.waitForTimeout(800); } catch (e) { console.log('  girar: ' + e.message.slice(0, 60)); } }
    const ok = await mover(k, v); const d = await leer();
    console.log(`  tras ${k}=${v} [${ok}] · estado «${d.estado}» · pos ${d.pos || '—'}`); console.log(`    frase: ${d.frase}`); console.log(`    monitor: ${d.filas}`); console.log(`    sellos: ${d.sellos} · P/F: ${d.pf || '—'}`);
    if (fotoSi && mandos.indexOf(mandos.find(m => m[0] === k && m[1] === v)) === 0) { await p.evaluate(() => document.getElementById('esc-svg')?.scrollIntoView({ block: 'start' })); await p.waitForTimeout(300); await p.screenshot({ path: `${OUT}juega-${estado}-tras.png` }); }
    if (k === 'horas' && v === 0) { try { await pulsar('[data-m="pos"][data-v="supino"]'); await p.waitForTimeout(800); const s = await leer(); console.log(`  vuelta a supino · pos ${s.pos} · monitor: ${s.filas} · P/F: ${s.pf || '—'}`); } catch (e) { console.log('  supino: ' + e.message.slice(0, 60)); } }
  }
  const desb = await p.evaluate(() => document.documentElement.scrollWidth - window.innerWidth); console.log(`  desborde ${desb} px`);
  await p.evaluate(() => [...document.querySelectorAll('button')].find(b => /VOLVER/.test(b.textContent) && b.offsetParent)?.click()); await p.waitForTimeout(800);
}
console.log(`\nerrores de consola: ${JSON.stringify(err.slice(0, 4))}`);
await b.close();
