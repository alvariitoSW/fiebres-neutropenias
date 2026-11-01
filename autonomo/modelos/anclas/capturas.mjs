// Capturas congeladas de las anclas de 10 del profesor (REGLAS §7 «Cómo se juzga»).
// Uso, desde la raíz del repositorio:  node autonomo/modelos/anclas/capturas.mjs [nombre-parcial ...]
// Levanta su propio servidor en un puerto libre, abre la app a 390x844 y guarda JPEG q70 (<=200 KB) aquí al lado.
import { spawn } from 'node:child_process';
import { createServer } from 'node:net';
import { get as httpGet } from 'node:http';
import { fileURLToPath } from 'node:url';
import { dirname, resolve, join } from 'node:path';
import { statSync, existsSync } from 'node:fs';
import { createRequire } from 'node:module';

const AQUI = dirname(fileURLToPath(import.meta.url));
const RAIZ = resolve(AQUI, '../../..');
const require = createRequire(import.meta.url);
let chromium;
try { ({ chromium } = require('playwright')); } catch { ({ chromium } = await import('/opt/node22/lib/node_modules/playwright/index.mjs')); }
const filtro = process.argv.slice(2);

const puertoLibre = () => new Promise(ok => { const s = createServer(); s.listen(0, () => { const p = s.address().port; s.close(() => ok(p)); }); });
const puerto = await puertoLibre();
const srv = spawn('python3', ['-m', 'http.server', String(puerto)], { cwd: RAIZ, stdio: 'ignore' });
const BASE = `http://localhost:${puerto}/`;
const responde = () => new Promise(ok => { const r = httpGet(BASE, x => { x.resume(); ok(x.statusCode === 200); }); r.on('error', () => ok(false)); });
for (let i = 0; i < 50 && !(await responde()); i++) await new Promise(r => setTimeout(r, 200));
process.on('exit', () => srv.kill());

const browser = await chromium.launch();
const falta = [];
async function pagina(ancho = 390) {
  const ctx = await browser.newContext({ viewport: { width: ancho, height: 844 }, deviceScaleFactor: 1, isMobile: true, hasTouch: true });
  const page = await ctx.newPage();
  await page.goto(BASE, { waitUntil: 'load' });
  await page.waitForFunction(() => document.querySelectorAll('[data-include]').length === 0 || !!document.getElementById('merino-trombocitopenia'), null, { timeout: 30000 });
  await page.waitForTimeout(1500);
  return page;
}
// Enlace cruzado: crea un botón con los data-* y lo pulsa (lo resuelve el listener de home/index.js).
const ir = (page, d) => page.evaluate(d => { const b = document.createElement('button'); Object.assign(b.dataset, d); document.body.appendChild(b); b.click(); b.remove(); }, d);
const ver = (page, sel, bloque = 'start') => page.evaluate(([s, b]) => { const e = document.querySelector(s); e?.scrollIntoView({ block: b }); return !!e && e.offsetParent !== null; }, [sel, bloque]);

async function guardar(page, nombre) {
  const f = join(AQUI, nombre);
  let alto = 844;
  for (;;) {
    await page.screenshot({ path: f, type: 'jpeg', quality: 70, clip: { x: 0, y: 0, width: page.viewportSize().width, height: alto } });
    if (statSync(f).size <= 200 * 1024 || alto <= 400) break;
    alto -= 80;
  }
  console.log(`${nombre}  ${(statSync(f).size / 1024).toFixed(0)} KB  (${alto} px de alto)`);
}

const CAPTURAS = [
  ['7-1-3-13-4ts.jpg', 390, async p => {
    await ir(p, { especialidad: 'home', view: 'merinoHemato', panel: 'panel-merino-tabs', tab: 'merino-trombocitopenia' });
    await p.waitForTimeout(800);
    await ver(p, '#merino-trombocitopenia', 'start'); await p.evaluate(() => window.scrollTo(0, document.querySelector('#merino-trombocitopenia').getBoundingClientRect().top + scrollY - 70));
    return p.evaluate(() => document.getElementById('merino-trombocitopenia').offsetParent !== null);
  }],
  ['7-1-3-13-4ts-calculadora.jpg', 390, async p => {
    await ir(p, { especialidad: 'home', view: 'merinoHemato', panel: 'panel-merino-tabs', tab: 'merino-trombocitopenia' });
    await p.waitForTimeout(800);
    await p.evaluate(() => { const c = document.getElementById('mh-4ts'); c.querySelectorAll('select').forEach(s => { s.selectedIndex = 3; s.dispatchEvent(new Event('change', { bubbles: true })); }); window.scrollTo(0, c.getBoundingClientRect().top + scrollY - 70); });
    return p.evaluate(() => document.getElementById('mh-4ts').offsetParent !== null);
  }],
  ['7-7-4ts-360.jpg', 360, async p => {
    await ir(p, { especialidad: 'home', view: 'merinoHemato', panel: 'panel-merino-tabs', tab: 'merino-trombocitopenia' });
    await p.waitForTimeout(800);
    await p.evaluate(() => { const c = document.getElementById('mh-4ts'); window.scrollTo(0, c.getBoundingClientRect().top + scrollY - 70); });
    return p.evaluate(() => document.getElementById('mh-4ts').offsetParent !== null && document.documentElement.scrollWidth <= 360);
  }],
  ['7-6-visual-4ts.jpg', 390, async p => {
    await ir(p, { especialidad: 'home', view: 'merinoHemato', panel: 'panel-merino-tabs', tab: 'merino-trombocitopenia' });
    await p.waitForTimeout(800);
    // En esta ficha la vista Visual es el paso «Mira» de Estudiar.
    await p.evaluate(() => document.querySelector('#merino-trombocitopenia button[data-vista="estudiar"]')?.click());
    await p.waitForTimeout(600);
    await p.evaluate(() => document.querySelector('#merino-trombocitopenia [data-ir-paso="mira"]')?.click());
    await p.waitForTimeout(1200);
    await p.evaluate(() => { const v = document.querySelector('#merino-trombocitopenia .est-paso[data-paso="mira"]'); window.scrollTo(0, v.getBoundingClientRect().top + scrollY - 90); });
    return p.evaluate(() => { const v = document.querySelector('#merino-trombocitopenia .est-paso[data-paso="mira"]'); return !!v && !v.hidden && v.offsetParent !== null; });
  }],
  ['7-4-nefrona.jpg', 390, async p => {
    await ir(p, { especialidad: 'nefrologia', view: 'nefrona', nefronaViva: 'normal|furosemida' });
    await p.waitForTimeout(3500);
    await p.evaluate(() => { const v = document.getElementById('nefrona-viva'); window.scrollTo(0, v.getBoundingClientRect().top + scrollY - 60); });
    await p.waitForTimeout(500);
    return p.evaluate(() => document.getElementById('nefrona-viva').offsetParent !== null);
  }],
  ['7-5-8-atlas-vd.jpg', 390, async p => {
    await ir(p, { especialidad: 'eco', ecoAtlas: 'rv' });
    await p.waitForTimeout(3500);
    await p.evaluate(() => { const f = document.querySelector('.at-figura[data-figura="vd"]'); [...f.querySelectorAll('button')].find(b => /TEP agudo/.test(b.textContent))?.click(); const r = f.querySelector('input[type=range]'); if (r) { r.value = Math.round((+r.min + +r.max) * 0.66); r.dispatchEvent(new Event('input', { bubbles: true })); } });
    await p.waitForTimeout(1500);
    await p.evaluate(() => { const h = [...document.querySelectorAll('#eco-view *')].find(e => e.offsetParent && /ventr[ií]culo derecho|VD/i.test(e.textContent) && e.children.length === 0); h?.scrollIntoView({ block: 'start' }); });
    return p.evaluate(() => document.getElementById('eco-view')?.offsetParent !== null || !!document.querySelector('svg, canvas'));
  }],
  ['7-9-10-capilar.jpg', 390, async p => {
    await ir(p, { especialidad: 'libros', view: 'capilarVivo', capilarVivo: 'anemia-compensada' });
    await p.waitForTimeout(3500);
    await p.evaluate(() => window.scrollTo(0, document.getElementById('capilar-vivo-view').getBoundingClientRect().top + scrollY));
    return p.evaluate(() => document.getElementById('capilar-vivo-view').offsetParent !== null);
  }],
  ['mecanismo-receptores.jpg', 390, async p => {
    await ir(p, { especialidad: 'cardiologia', view: 'merinoCardiologia', panel: 'panel-merino-cardio-tabs', tab: 'mc-vasopresores' });
    await p.waitForTimeout(800);
    await p.evaluate(() => { const s = document.getElementById('mc-receptor-farmaco'); s.value = 'norepi'; s.dispatchEvent(new Event('change', { bubbles: true })); });
    await p.waitForTimeout(1200);
    await p.evaluate(() => { const d = document.getElementById('mc-receptor-dosis'); if (d && d.options.length > 2) { d.selectedIndex = 2; d.dispatchEvent(new Event('change', { bubbles: true })); } });
    await p.waitForTimeout(1300); // a mitad de la animación
    await p.evaluate(() => window.scrollTo(0, document.getElementById('mc-recep-anim').getBoundingClientRect().top + scrollY - 40));
    return p.evaluate(() => document.getElementById('mc-receptores').offsetParent !== null);
  }],
  ['8-estudiar-b1.jpg', 390, async p => {
    await ir(p, { especialidad: 'libros', view: 'marinoFundamentos', panel: 'panel-marino-fund-tabs', tab: 'mar-cristaloides' });
    await p.waitForTimeout(1000);
    await p.evaluate(() => document.querySelector('#mar-cristaloides button[data-vista="mayeutica"]')?.click());
    await p.waitForTimeout(800);
    // Contesta la primera pregunta de la Guía socrática: «Ya lo tengo», una opción.
    await p.evaluate(() => [...document.querySelectorAll('#mar-cristaloides .may-zona button')].find(b => /Empezar/.test(b.textContent))?.click()); await p.waitForTimeout(600);
    for (const s of ['#mar-cristaloides [data-accion="ops"]', '#mar-cristaloides [data-op="0"]']) { await p.evaluate(s => document.querySelector(s)?.click(), s); await p.waitForTimeout(600); }
    await p.evaluate(() => { const z = document.querySelector('#mar-cristaloides .may-zona'); window.scrollTo(0, z.getBoundingClientRect().top + scrollY - 120); });
    return p.evaluate(() => [...document.querySelectorAll('#mar-cristaloides .may-zona')].some(z => z.offsetParent));
  }],
  ['8-caso-clinico.jpg', 390, async p => {
    await p.goto(BASE + 'autonomo/modelos/preguntas-para-estudiar.html');
    await p.waitForSelector('#caso-paso');
    for (let i = 0; i < 12; i++) {
      const t = await p.evaluate(() => !!document.querySelector('#caso-paso [data-accion="ops"]'));
      if (t) break;
      await p.evaluate(() => document.querySelector('#caso-paso [data-accion="sig"]')?.click());
      await p.waitForTimeout(150);
    }
    await p.evaluate(() => document.querySelector('#caso-paso [data-accion="ops"]')?.click());
    await p.evaluate(() => document.querySelector('#caso-paso [data-op="0"]')?.click());
    await p.waitForTimeout(300);
    await p.evaluate(() => window.scrollTo(0, document.getElementById('caso').getBoundingClientRect().top + scrollY - 10));
    return true;
  }],
];

try {
  for (const [nombre, ancho, fn] of CAPTURAS) {
    if (filtro.length && !filtro.some(f => nombre.includes(f))) continue;
    const page = await pagina(ancho).catch(e => { falta.push(`${nombre}: no arrancó (${e.message})`); return null; });
    if (!page) continue;
    try {
      const ok = await fn(page);
      await page.waitForTimeout(300);
      await guardar(page, nombre);
      if (!ok) falta.push(`${nombre}: guardada, pero la comprobación de «está visible» falló`);
    } catch (e) { falta.push(`${nombre}: ${e.message.split('\n')[0]}`); }
    await page.context().close();
  }
} finally {
  await browser.close();
  srv.kill();
}
if (falta.length) { console.log('\nREVISAR:\n' + falta.join('\n')); process.exitCode = 1; }
