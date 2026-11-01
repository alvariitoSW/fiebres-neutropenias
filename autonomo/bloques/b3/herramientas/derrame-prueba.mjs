// Prueba del estado `derrame-paraneumonico` del pulmón vivo (390 px): recorre los botones del líquido, el tubo, el mando de horas
// hasta el tope y el segundo tubo; mide desborde y errores de consola y devuelve un resumen en texto.
// node derrame-prueba.mjs <url-base> <carpeta-capturas>
import { chromium } from '/opt/node22/lib/node_modules/playwright/index.mjs';
const [base, dir] = [process.argv[2], process.argv[3]];
const b = await chromium.launch(); const p = await (await b.newContext({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 2 })).newPage();
const errores = []; p.on('pageerror', (e) => errores.push(e.message)); p.on('console', (m) => { if (m.type() === 'error') errores.push(m.text()); });
await p.goto(base); await p.waitForTimeout(2500);
await p.evaluate(() => { const t = document.createElement('button'); Object.assign(t.dataset, { especialidad: 'libros', view: 'pulmonVivo', pulmonVivo: 'derrame-paraneumonico' }); document.body.append(t); t.click(); t.remove(); });
await p.waitForTimeout(1200);
const c = async (s) => { await p.evaluate((s) => document.querySelector('#pul-derrame ' + s).click(), s); await p.waitForTimeout(150); };
const horas = async (h) => { await p.evaluate((h) => { const r = document.querySelector('#pul-derrame input[type=range]'); r.value = h; r.dispatchEvent(new Event('input', { bubbles: true })); }, h); await p.waitForTimeout(250); };
const leer = () => p.evaluate(() => {
  const q = (s) => document.querySelector('#pul-derrame ' + s), tx = (s) => (q(s)?.textContent || '').trim().replace(/\s+/g, ' ');
  const r = q('input[type=range]'); const sellos = [...document.querySelectorAll('[class*="tope"],[class*="sello"],[data-tope]')].map((e) => e.textContent.trim().replace(/\s+/g, ' ').slice(0, 120)).filter((t) => /Drenaje|drenaje/.test(t));
  return { cat: tx('#pul-derrame-cat'), liq: tx('[data-fila="der-liq"] .v'), spo2: tx('[data-fila="der-spo2"] .v'), h: r.value, hMax: r.max, hDis: r.disabled, tubo: tx('[data-dr="tubo"]'), seg: q('[data-dr="seg"]').hidden ? 'oculto' : 'visible', msg: tx('#pul-derrame-msg').slice(0, 140), tl: tx('#pul-dr-tl'), sellos,
    desborde: document.documentElement.scrollWidth - document.documentElement.clientWidth, minPx: Math.min(...[...document.querySelectorAll('#pul-derrame *')].filter((e) => e.textContent.trim() && e.children.length === 0).map((e) => parseFloat(getComputedStyle(e).fontSize))) };
});
const out = []; const paso = async (n) => { const s = await leer(); out.push(`${n}: ${JSON.stringify(s)}`); return s; };
await paso('inicio (libre, sin infección)');
await c('[data-g="tam"][data-v="peq"]'); await paso('<10 mm');
await c('[data-g="tam"][data-v="libre"]'); await c('[data-g="ph"][data-v="bajo"]'); await paso('libre + pH bajo (mezcla sin definir)');
await c('[data-g="ph"][data-v="alto"]'); await c('[data-dr="tubo"]'); await paso('categoría 2 + tubo (sin indicación)');
await c('[data-dr="tubo"]');
await c('[data-g="tam"][data-v="locu"]'); await c('[data-g="ph"][data-v="bajo"]'); await c('[data-g="glu"][data-v="baja"]'); await c('[data-g="gram"][data-v="pos"]'); await paso('categoría 3 loculado');
await c('[data-dr="tubo"]'); await paso('cat 3 + tubo 0 h');
await p.locator('#pul-derrame').scrollIntoViewIfNeeded(); await p.locator('#pul-derrame').screenshot({ path: dir + '/der-cat3-tubo-390.png' });
await horas(24); await paso('cat 3 + 24 h'); await horas(48); await paso('cat 3 + 48 h');
await p.screenshot({ path: dir + '/der-48h-pantalla-390.png', fullPage: false });
await horas(72); await paso('cat 3 + 72 h (tope)'); await horas(500); await paso('cat 3 + 500 h (pasarse)');
await c('[data-dr="seg"]'); await paso('segundo tubo');
await p.locator('#pul-derrame').screenshot({ path: dir + '/der-segundo-tubo-390.png' });
// libre infectado → pus (cat 4), tubo, drena
await c('[data-g="tam"][data-v="libre"]'); await c('[data-g="pus"][data-v="si"]'); await paso('libre + pus = cat 4');
await c('[data-dr="tubo"]'); await horas(24); await paso('cat 4 libre + tubo 24 h'); await horas(72); await paso('cat 4 libre + 72 h');
await c('[data-g="pus"][data-v="no"]'); await paso('quitar pus con tubo puesto (libre infectado = sin definir)');
// guía
const guia = await p.evaluate(() => [...document.querySelectorAll('#pulmon-vivo-view [class*="guia"] button, #pulmon-vivo-view button')].map((b) => b.textContent.trim()).filter((t) => /gu[ií]a|paso|siguiente/i.test(t)).slice(0, 6));
out.push('botones de guía: ' + JSON.stringify(guia));
out.push('errores de consola: ' + JSON.stringify(errores));
console.log(out.join('\n'));
await b.close();
