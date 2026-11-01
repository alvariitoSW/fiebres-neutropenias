// Barrido de la PEEP en atelectrauma-zeep + cifras de los otros estados del racimo sdra (antes/después).
// Uso: node atel-barrido.mjs http://localhost:PUERTO/ [solo-otros|solo-atel]  (monitor de la app a 390 px)
import { chromium, devices } from '/opt/node22/lib/node_modules/playwright/index.mjs';
const BASE = process.argv[2].replace(/\/?$/, '/'), MODO = process.argv[3] || '';
const b = await chromium.launch();
const p = await (await b.newContext({ ...devices['iPhone 12'], viewport: { width: 390, height: 844 }, hasTouch: true, isMobile: true })).newPage();
const err = []; p.on('pageerror', e => err.push(e.message));
await p.goto(BASE, { waitUntil: 'networkidle' }); await p.waitForTimeout(800);
const abrir = estado => p.evaluate(e => { const x = document.createElement('button'); x.dataset.especialidad = 'libros'; x.dataset.view = 'pulmonVivo'; x.dataset.pulmonVivo = e; document.body.append(x); x.click(); x.remove(); }, estado);
const leer = () => p.evaluate(() => { window.__pulPruebas?.().llenar?.(); const f = {}; for (const e of document.querySelectorAll('.pul-raiz [data-fila]')) f[e.dataset.fila] = (e.querySelector('.v, .g')?.textContent.trim() || ''); const r = document.querySelector('.pul-raiz'); const t = r?.innerText || ''; const sello = [...document.querySelectorAll('.pul-raiz *')].some(e => e.offsetParent && e.children.length === 0 && /Abre y cierra cada ciclo/.test(e.textContent)); const atel = document.getElementById('pul-esc-atel'); return `meseta ${f.meseta} · pico ${f.pico} · Vt ${f.vt} · Cstat ${f.cstat} · dP ${f.dp} | sello:${sello ? 'SI' : 'no'} esc-atel:${atel && !atel.hasAttribute('hidden') ? 'SI' : 'no'}`; });
const mando = async (k, v) => { await p.evaluate(() => { if (!document.querySelector('#pul-dock-panel input[data-m]')) [...document.querySelectorAll('button, summary, [role=button]')].find(b => /MANDOS/.test(b.textContent) && b.offsetParent)?.click(); }); await p.waitForTimeout(400); await p.evaluate(([k, v]) => { const i = document.querySelector(`#pul-dock-panel input[data-m="${k}"]`); if (!i) throw new Error('no hay mando ' + k); if (+v > +i.max) v = i.max; i.value = v; i.dispatchEvent(new Event('input', { bubbles: true })); i.dispatchEvent(new Event('change', { bubbles: true })); }, [k, v]); await p.waitForTimeout(5000); };
if (MODO !== 'solo-otros') {
  await abrir('atelectrauma-zeep'); await p.waitForTimeout(3500);
  console.log('== atelectrauma-zeep: inicio (PEEP 0): ' + await leer());
  for (const v of [0, 2, 4, 5, 8, 99]) { try { await mando('peep', v); console.log(`  peep=${v}: ` + await leer()); } catch (e) { console.log('  ' + e.message.slice(0, 80)); } }
}
if (MODO !== 'solo-atel') for (const e of ['sdra-rigido', 'sdra-protector', 'volutrauma', 'mejor-peep', 'prono']) { await abrir(e); await p.waitForTimeout(4500); console.log(`== ${e}: ` + await leer()); }
console.log('errores:', JSON.stringify(err.slice(0, 3)));
await b.close();
