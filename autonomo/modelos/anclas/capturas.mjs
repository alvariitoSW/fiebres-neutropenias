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
  ['7-1-13-atlas-im.jpg', 390, async p => {
    await ir(p, { especialidad: 'eco', ecoAtlas: 'mr' });
    await p.waitForTimeout(3500);
    await p.evaluate(() => { const h = [...document.querySelectorAll('#eco-view h4')].find(e => e.offsetParent && /En 30 segundos/.test(e.textContent)); window.scrollTo(0, h.getBoundingClientRect().top + scrollY - 560); });
    await p.waitForTimeout(400);
    return p.evaluate(() => [...document.querySelectorAll('#eco-view h4')].some(e => e.offsetParent && /En 30 segundos/.test(e.textContent)));
  }],
  ['7-7-atlas-im-360.jpg', 360, async p => {
    await ir(p, { especialidad: 'eco', ecoAtlas: 'mr' });
    await p.waitForTimeout(3500);
    await p.evaluate(() => { const h = [...document.querySelectorAll('#eco-view h4')].find(e => e.offsetParent && /En 30 segundos/.test(e.textContent)); window.scrollTo(0, h.getBoundingClientRect().top + scrollY - 560); });
    await p.waitForTimeout(400);
    return p.evaluate(() => document.documentElement.scrollWidth <= 360);
  }],
  ['7-3-4ts.jpg', 390, async p => {
    await ir(p, { especialidad: 'home', view: 'merinoHemato', panel: 'panel-merino-tabs', tab: 'merino-trombocitopenia' });
    await p.waitForTimeout(800);
    await ver(p, '#merino-trombocitopenia', 'start'); await p.evaluate(() => window.scrollTo(0, document.querySelector('#merino-trombocitopenia').getBoundingClientRect().top + scrollY - 70));
    return p.evaluate(() => document.getElementById('merino-trombocitopenia').offsetParent !== null);
  }],
  ['7-2-4ts-manejo.jpg', 390, async p => {
    await ir(p, { especialidad: 'home', view: 'merinoHemato', panel: 'panel-merino-tabs', tab: 'merino-trombocitopenia' });
    await p.waitForTimeout(800);
    await p.evaluate(() => { const e = document.getElementById('mh-hit-manejo').previousElementSibling; window.scrollTo(0, e.getBoundingClientRect().top + scrollY - 80); });
    await p.waitForTimeout(300);
    return p.evaluate(() => document.getElementById('mh-hit-manejo').offsetParent !== null);
  }],
  // Calculadora 4Ts en riesgo alto: 8 puntos, cada select por su texto.
  ['7-3-4ts-calculadora.jpg', 390, async p => {
    await ir(p, { especialidad: 'home', view: 'merinoHemato', panel: 'panel-merino-tabs', tab: 'merino-trombocitopenia' });
    await p.waitForTimeout(800);
    await p.evaluate(() => {
      const pon = (id, re) => { const s = document.getElementById(id); s.selectedIndex = [...s.options].findIndex(o => re.test(o.textContent)); s.dispatchEvent(new Event('change', { bubbles: true })); };
      pon('ts4-trombo', /Caída >50%/); pon('ts4-tiempo', /^5-10 días tras/); pon('ts4-trombosis', /^Nueva trombosis/); pon('ts4-otras', /^Ninguna otra/);
      window.scrollTo(0, document.getElementById('mh-4ts').getBoundingClientRect().top + scrollY - 70);
    });
    return p.evaluate(() => document.getElementById('mh-4ts').offsetParent !== null);
  }],
  ['7-6-visual-4ts.jpg', 390, async p => {
    await ir(p, { especialidad: 'home', view: 'merinoHemato', panel: 'panel-merino-tabs', tab: 'merino-trombocitopenia' });
    await p.waitForTimeout(800);
    // En esta ficha la vista Visual es el paso «Mira» de Estudiar.
    await p.evaluate(() => document.querySelector('#merino-trombocitopenia button[data-vista="estudiar"]')?.click());
    await p.waitForTimeout(600);
    await p.evaluate(() => document.querySelector('#merino-trombocitopenia [data-ir-paso="mira"]')?.click());
    await p.waitForTimeout(1200);
    // Toca el nodo «Fibrina» para abrir su detalle y «Ver en el texto ↓».
    await p.evaluate(() => { const n = [...document.querySelectorAll('#merino-trombocitopenia .vk-nodo')].find(b => /Fibrina/.test(b.textContent)); n?.click(); n?.scrollIntoView({ block: 'start' }); window.scrollBy(0, -90); });
    await p.waitForTimeout(700);
    return p.evaluate(() => [...document.querySelectorAll('#merino-trombocitopenia button')].some(b => b.offsetParent && /Ver en el texto/.test(b.textContent)));
  }],
  ['7-4-nefrona.jpg', 390, async p => {
    await ir(p, { especialidad: 'nefrologia', view: 'nefrona', nefronaViva: 'normal|furosemida' });
    await p.waitForTimeout(3500);
    await p.evaluate(() => { const v = document.getElementById('nv-situaciones'); window.scrollTo(0, v.getBoundingClientRect().top + scrollY - 70); });
    await p.waitForTimeout(500);
    return p.evaluate(() => document.getElementById('nv-situaciones').offsetParent !== null);
  }],
  ['7-5-nefrona-frase.jpg', 390, async p => {
    await ir(p, { especialidad: 'nefrologia', view: 'nefrona', nefronaViva: 'normal|furosemida' });
    await p.waitForTimeout(3500);
    await p.evaluate(() => { const v = document.getElementById('nv-explica-titulo'); window.scrollTo(0, v.getBoundingClientRect().top + scrollY - 70); });
    await p.waitForTimeout(500);
    return p.evaluate(() => document.getElementById('nv-explica').offsetParent !== null);
  }],
  ['7-5-atlas-vd-signos.jpg', 390, async p => {
    await ir(p, { especialidad: 'eco', ecoAtlas: 'rv' });
    await p.waitForTimeout(3500);
    await p.evaluate(() => { const f = document.querySelector('.at-figura[data-figura="vd"]'); [...f.querySelectorAll('button')].find(b => /TEP agudo/.test(b.textContent))?.click(); const r = f.querySelector('input[type=range]'); if (r) { r.value = Math.round((+r.min + +r.max) * 0.66); r.dispatchEvent(new Event('input', { bubbles: true })); } });
    await p.waitForTimeout(1500);
    await p.evaluate(() => { const h = [...document.querySelectorAll('#eco-view h4')].find(e => /Signos de sobrecarga del VD/.test(e.textContent)); window.scrollTo(0, h.getBoundingClientRect().top + scrollY - 80); });
    await p.waitForTimeout(300);
    return p.evaluate(() => [...document.querySelectorAll('#eco-view h4')].some(e => e.offsetParent && /Signos de sobrecarga del VD/.test(e.textContent)));
  }],
  ['7-9-10-capilar.jpg', 390, async p => {
    await ir(p, { especialidad: 'libros', view: 'capilarVivo', capilarVivo: 'anemia-compensada' });
    await p.waitForTimeout(3500);
    await p.evaluate(() => window.scrollTo(0, document.getElementById('capilar-vivo-view').getBoundingClientRect().top + scrollY));
    return p.evaluate(() => document.getElementById('capilar-vivo-view').offsetParent !== null);
  }],
  ['7-10-capilar-explicame.jpg', 390, async p => {
    await ir(p, { especialidad: 'libros', view: 'capilarVivo', capilarVivo: 'anemia-compensada' });
    await p.waitForTimeout(3500);
    await p.evaluate(() => document.querySelector('#capilar-vivo-view [data-cpv-guia]')?.click());
    await p.waitForTimeout(800);
    await p.evaluate(() => [...document.querySelectorAll('button')].find(b => b.offsetParent && /^Siguiente/.test(b.textContent.trim()))?.click());
    await p.waitForTimeout(1500);
    return p.evaluate(() => /PASO 2 DE 4/i.test(document.body.innerText));
  }],
  ['mecanismo-receptores.jpg', 390, async p => {
    await ir(p, { especialidad: 'cardiologia', view: 'merinoCardiologia', panel: 'panel-merino-cardio-tabs', tab: 'mc-vasopresores' });
    await p.waitForTimeout(800);
    await p.evaluate(() => { const s = document.getElementById('mc-receptor-farmaco'); s.value = 'norepi'; s.dispatchEvent(new Event('change', { bubbles: true })); });
    await p.waitForTimeout(1200);
    await p.evaluate(() => { const d = document.getElementById('mc-receptor-dosis'); if (d && d.options.length > 1) { d.selectedIndex = d.options.length - 1; d.dispatchEvent(new Event('change', { bubbles: true })); } });
    await p.waitForTimeout(500);
    // Paso a paso: al paso 4 de 5, con la cascada encendida.
    await p.waitForTimeout(12000); // acaba la reproducción solo al cambiar la dosis; luego se retrocede al paso 4
    await p.evaluate(() => document.querySelector('#mc-recep-anim [data-ra="prev"]')?.click()); await p.waitForTimeout(2500);
    await p.evaluate(() => window.scrollTo(0, document.getElementById('mc-recep-anim').getBoundingClientRect().top + scrollY - 40));
    return p.evaluate(() => /Paso 4 de 5/.test(document.getElementById('mc-recep-anim').textContent));
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
  // Examen de b1-fluidos contestado mal a propósito: prueba cada opción hasta que falle.
  ['8-examen-fallado.jpg', 390, async p => {
    const abre = async () => {
      await ir(p, { especialidad: 'libros', view: 'marinoFundamentos', panel: 'panel-marino-fund-tabs', tab: 'mar-cristaloides' });
      await p.waitForTimeout(1000);
      await p.evaluate(() => document.querySelector('#mar-cristaloides button[data-vista="mayeutica"]')?.click()); await p.waitForTimeout(600);
      await p.evaluate(() => document.querySelector('#mar-cristaloides [data-ir-paso="examen"]')?.click()); await p.waitForTimeout(700);
      await p.evaluate(() => [...document.querySelectorAll('#mar-cristaloides .may-zona button')].find(b => b.offsetParent && /Empezar|Comenzar/.test(b.textContent))?.click()); await p.waitForTimeout(600);
    };
    await abre();
    for (const s of ['#mar-cristaloides [data-accion="ops"]']) { await p.evaluate(s => document.querySelector(s)?.click(), s); await p.waitForTimeout(500); }
    for (let k = 0; k < 4; k++) {
      await p.evaluate(k => [...document.querySelectorAll('#mar-cristaloides [data-op]')].find(b => b.offsetParent && b.dataset.op === String(k))?.click(), k);
      await p.waitForTimeout(700);
      const mal = await p.evaluate(() => !!document.querySelector('#mar-cristaloides .may-op.mal, #mar-cristaloides .may-op[class*="mal"], #mar-cristaloides .may-op.fallo'));
      if (mal) break;
      await abre(); await p.evaluate(() => document.querySelector('#mar-cristaloides [data-accion="ops"]')?.click()); await p.waitForTimeout(500);
    }
    await p.evaluate(() => { const z = [...document.querySelectorAll('#mar-cristaloides .may-zona')].find(z => z.offsetParent); window.scrollTo(0, z.getBoundingClientRect().top + scrollY - 120); });
    return true;
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
  // Paso «encuentra el error» del caso, ya corregido (con las correcciones a la vista).
  ['8-caso-error.jpg', 390, async p => {
    await p.goto(BASE + 'autonomo/modelos/preguntas-para-estudiar.html');
    await p.waitForSelector('#caso-paso');
    for (let i = 0; i < 15 && !(await p.evaluate(() => !!document.querySelector('#caso-paso .frase'))); i++) {
      await p.evaluate(() => { const c = document.querySelector('#caso-paso'); (c.querySelector('[data-accion="ops"]') || c.querySelector('[data-accion="destapa"]')) ?.click(); c.querySelector('[data-op="0"]')?.click(); c.querySelector('[data-accion="puntos"]')?.click(); c.querySelector('[data-accion="sig"]')?.click(); });
      await p.waitForTimeout(250);
    }
    await p.evaluate(() => { document.querySelector('#caso-paso .frase[data-fr="0"]')?.click(); document.querySelector('#caso-paso [data-accion="corregir"]')?.click(); });
    await p.waitForTimeout(300);
    await p.evaluate(() => window.scrollTo(0, document.getElementById('caso').getBoundingClientRect().top + scrollY - 10));
    return p.evaluate(() => !!document.querySelector('#caso-paso .frase.fallo, #caso-paso .frase.acierto'));
  }],
  ['8-caso-final.jpg', 390, async p => {
    await p.goto(BASE + 'autonomo/modelos/preguntas-para-estudiar.html');
    await p.waitForSelector('#caso-paso');
    for (let i = 0; i < 25 && !(await p.evaluate(() => !!document.querySelector('#caso-paso .lleva'))); i++) {
      await p.evaluate(() => { const c = document.querySelector('#caso-paso'); (c.querySelector('[data-accion="ops"]') || c.querySelector('[data-accion="destapa"]'))?.click(); c.querySelector('[data-op="0"]')?.click(); c.querySelector('[data-accion="puntos"]')?.click(); c.querySelector('[data-accion="corregir"]')?.click(); c.querySelector('[data-accion="sig"]')?.click(); });
      await p.waitForTimeout(250);
    }
    await p.evaluate(() => window.scrollTo(0, document.getElementById('caso').getBoundingClientRect().top + scrollY - 10));
    return p.evaluate(() => !!document.querySelector('#caso-paso .lleva'));
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
