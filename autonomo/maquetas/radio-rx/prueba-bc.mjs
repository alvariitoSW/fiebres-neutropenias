// Prueba de las maquetas B y C (motor-radio). Uso: node autonomo/maquetas/radio-rx/prueba-bc.mjs
// 1) Lógica: 5000 pacientes al azar nunca son imposibles; cada pregunta tiene su correcta; tensión siempre con desvío.
// 2) R1 (Playwright): radio-rx-a/b/c.html a 390×844 y 360×800: todos los mandos, un recorrido entero y 3 pacientes.
import { generar, preguntas, informe } from './caso.js';
import { normalizar, MAX_PATOLOGIAS } from './estados.js';
import { spawn } from 'node:child_process';
import { createRequire } from 'node:module';
import { mkdirSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const fallos = []; const mal = (m) => fallos.push(m);
const vistos = new Set();
for (let i = 0; i < 5000; i++) {
  const p = generar(), { d } = normalizar(p.e);
  if (d.imposible || d.encendidas.length > MAX_PATOLOGIAS) mal('paciente imposible: ' + JSON.stringify(p.e));
  if (p.e.ntx === 'tension' && d.desvio >= 0) mal('tensión sin desvío');
  if (p.e.tubo === 'selectivo' && p.e.atel !== 'pulmon') mal('selectivo sin atelectasia');
  if (p.e.ntx !== 'no' && p.e.atel !== 'no') mal('neumotórax y atelectasia del mismo lado');
  const qs = preguntas(p), inf = informe(qs);
  if (qs.length !== 5) mal('no hay 5 letras');
  for (const q of qs) { if (!q.opciones.some(o => o.id === q.correcta)) mal('sin correcta en ' + q.letra); if (q.opciones.length < 3) mal('menos de 3 chips en ' + q.letra); vistos.add(q.letra + q.correcta); }
  const n = inf.filter(x => x.error).length; if (n > 2) mal('más de 2 errores');
  vistos.add('err' + n);
}
if (![...vistos].includes('err0') || !vistos.has('err1') || !vistos.has('err2')) mal('el informe no genera 0, 1 y 2 errores');
console.log(`Lógica C: 5000 pacientes, ${fallos.length} fallos.`);

const raiz = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../../..');
const require = createRequire(path.join(raiz, 'package.json'));
const { chromium } = require('playwright');
const PUERTO = 8000 + Math.floor(Math.random() * 900) + 100;
const srv = spawn('python3', ['-m', 'http.server', String(PUERTO), '--bind', '127.0.0.1'], { cwd: raiz, stdio: 'ignore' });
console.log(`PUERTO=${PUERTO} PID=${srv.pid}`);
const CAP = '/tmp/plan-socialista/motor-radio/capturas'; mkdirSync(CAP, { recursive: true });
await new Promise(r => setTimeout(r, 900));
const nav = await chromium.launch();
try {
  for (const [w, h] of [[390, 844], [360, 800]]) {
    const ctx = await nav.newContext({ viewport: { width: w, height: h }, deviceScaleFactor: 2 });
    const url = (f) => `http://127.0.0.1:${PUERTO}/autonomo/maquetas/${f}`;
    const abrir = async (f) => {
      const pag = await ctx.newPage(); const errs = [];
      pag.on('console', m => { if (m.type() === 'error') errs.push(m.text()); }); pag.on('pageerror', e => errs.push(String(e)));
      await pag.goto(url(f), { waitUntil: 'networkidle' });
      const mide = async (q) => { const x = await pag.evaluate(() => ({ sw: document.documentElement.scrollWidth, iw: innerWidth })); if (x.sw > x.iw) mal(`${w}px ${f} ${q}: desborda ${x.sw}>${x.iw}`); };
      return { pag, errs, mide, foto: async (n, full) => { if (w === 390) await pag.screenshot({ path: `${CAP}/${n}.png`, fullPage: !!full }); } };
    };
    // ---- A: humo (la pieza común no cambió salvo el mediastino ancho) ----
    { const { pag, errs, mide } = await abrir('radio-rx-a.html');
      await pag.click('#rx-chip-via'); await pag.click('#rx-via-pared'); await mide('via pared');
      if (errs.length) mal(`${w}px A: ${errs}`); await pag.close(); }
    // ---- B ----
    { const { pag, errs, mide, foto } = await abrir('radio-rx-b.html');
      await foto('b-erguido-aire');
      for (const post of ['erguido', 'supino']) for (const que of ['aire', 'liquido', 'nada']) for (const cu of ['pequeno', 'grande']) for (const alt of ['vertice', 'hilios', 'bases']) {
        await pag.click(`#rx-postura-${post}`); await pag.click(`#rx-que-${que}`); if (que !== 'nada') await pag.click(`#rx-cuanto-${cu}`); await pag.click(`#rx-altura-${alt}`);
        await pag.waitForTimeout(40);
        await mide(`${post}/${que}/${cu}/${alt}`);
        if (post === 'supino' && que === 'aire' && cu === 'grande' && alt === 'bases') { await pag.waitForTimeout(700); await foto('b-supino-aire'); await foto('b-bases', true); }
        if (post === 'supino' && que === 'liquido' && cu === 'grande' && alt === 'bases') { await pag.waitForTimeout(700); await foto('b-supino-liquido'); }
      }
      // el aire viaja: el elemento del pulmón izquierdo cambia de medida entre sentado y tumbado
      await pag.click('#rx-que-aire'); await pag.click('#rx-cuanto-grande'); await pag.click('#rx-altura-bases');
      await pag.click('#rx-postura-erguido'); await pag.waitForTimeout(700);
      const a1 = await pag.evaluate(() => document.querySelectorAll('#rx-corte ellipse')[5].getAttribute('ry'));
      await pag.click('#rx-postura-supino'); await pag.waitForTimeout(700);
      const a2 = await pag.evaluate(() => document.querySelectorAll('#rx-corte ellipse')[5].getAttribute('ry'));
      await pag.click('#rx-postura-erguido'); await pag.waitForTimeout(700); await foto('b-bases-erguido');
      if (Math.abs(a1 - a2) < 3) mal('B: el aire no viaja');
      if (!/50 %/.test(await (async () => { await pag.click('#rx-postura-supino'); return pag.$eval('#rx-cifras', e => e.textContent); })())) mal('B: falta la cifra del 50 % en supino con aire');
      await pag.click('summary'); await pag.waitForTimeout(500);
      const nw = await pag.$$eval('.rx-figs img', is => is.map(i => i.naturalWidth)); if (nw.some(x => !(x > 0))) mal(`${w}px B: figura sin cargar ${nw}`);
      const min = await pag.evaluate(() => Math.min(...[...document.querySelectorAll('#rx-corte text')].map(t => { const r = t.getBoundingClientRect(); return parseFloat(t.getAttribute('font-size')) * (document.getElementById('rx-corte').getBoundingClientRect().width / 390); })));
      if (min < 7.5) mal(`${w}px B: rótulo de ${min.toFixed(1)} px`);
      // reducir movimiento: estado final inmediato
      await pag.emulateMedia({ reducedMotion: 'reduce' }); await pag.click('#rx-postura-erguido'); const r1 = await pag.evaluate(() => document.querySelectorAll('#rx-corte ellipse')[5].getAttribute('ry'));
      await pag.click('#rx-postura-supino'); const r2 = await pag.evaluate(() => document.querySelectorAll('#rx-corte ellipse')[5].getAttribute('ry')); if (r1 === r2) mal('B: con reducir movimiento no cambia el corte');
      if (errs.length) mal(`${w}px B: ${errs}`); await pag.close(); }
    // ---- C ----
    { const { pag, errs, mide, foto } = await abrir('radio-rx-c.html');
      await foto('c-inicio');
      for (let pac = 0; pac < 3; pac++) {
        if (pac) await pag.click('#rx-otro');
        for (let l = 0; l < 5; l++) {
          const visibles = await pag.$$eval('#rx-opciones button:not([hidden])', bs => bs.length); if (visibles < 3) mal(`${w}px C: ${visibles} chips`);
          await pag.click(`#rx-op-${pac === 1 && l === 1 ? 0 : l % visibles}`);
          await mide(`paciente ${pac} letra ${l}`);
          if (pac === 0 && l === 1) await foto('c-letra-B', true);
          if (await pag.$eval('#rx-siguiente', e => e.hidden)) mal(`${w}px C: sin botón siguiente`);
          await pag.click('#rx-siguiente');
        }
        // no se salta letras: en «Error» no hay chips del recorrido
        if (!(await pag.$eval('#rx-recorrido', e => e.hidden))) mal('C: el recorrido sigue visible en el error');
        await pag.click('#rx-inf-0'); if (pac === 0) await foto('c-error', true);
        await pag.click('#rx-comprobar'); await mide('error'); if (pac === 0) await foto('c-error-resuelto', true);
        await pag.click('#rx-ver-resumen'); await mide('resumen'); if (pac === 0) await foto('c-resumen', true);
      }
      const ls = await pag.evaluate(() => JSON.stringify(localStorage).length + document.cookie.length); if (ls > 2) mal('C: guarda algo');
      if (errs.length) mal(`${w}px C: ${errs}`); await pag.close(); }
    await ctx.close(); console.log(`R1 ${w}px: hecho.`);
  }
} finally { await nav.close(); process.kill(srv.pid); }
if (fallos.length) { console.log('FALLOS:\n- ' + fallos.join('\n- ')); process.exit(1); }
console.log('Todo en verde.');
