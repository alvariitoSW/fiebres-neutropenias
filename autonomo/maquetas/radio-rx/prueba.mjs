// Prueba de la Rx dibujada (motor-radio). Uso: node autonomo/maquetas/radio-rx/prueba.mjs [--sin-navegador]
// 1) Lógica: cada estado de ESTADOS da frase, cifras con origen y sello si es peligroso; coherencia y tope de 3.
// 2) R1 (Playwright): radio-rx-a.html a 390×844 y 360×800, todos los estados; sin errores, sin desborde, imágenes cargadas.
import { ESTADOS, MANDOS, ESTADO_INICIAL, describir, normalizar, marcado } from './escena.js';
import { spawn } from 'node:child_process';
import { createRequire } from 'node:module';
import { mkdirSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const fallos = [];
const mal = (m) => fallos.push(m);
const ORIGENES = new Set(['ficha', 'fisiología general', 'ilustrativo']);
let n = 0;
for (const k of MANDOS) for (const s of ESTADOS[k].estados) for (const postura of ['erguido', 'supino']) {
  const e = { ...ESTADO_INICIAL, postura, [k]: s.id, foco: k, senal: k };
  const r = describir(e); n++;
  const q = `${k}=${s.id} (${postura})`;
  if (!r.frase || r.frase.length < 20) mal(`${q}: sin frase`);
  if (!r.cifras.length) mal(`${q}: sin cifras`);
  for (const c of r.cifras) {
    if (!ORIGENES.has(c.origen)) mal(`${q}: origen raro «${c.origen}»`);
    if (c.origen === 'ficha' && !/^(\.\.\/\.\.\/docs\/.+\.pdf#page=\d+|https:\/\/www\.ncbi\.nlm\.nih\.gov\/sites\/books\/NBK\d+\/)$/.test(c.href || '')) mal(`${q}: cifra de ficha sin enlace válido (${c.texto})`);
  }
  if (s.peligro && !r.sello) mal(`${q}: peligroso sin sello`);
  if (s.aviso && !r.aviso && k !== 'atel') mal(`${q}: sin aviso al 80 %`);
  const m = marcado(e);
  if (!m.includes('>R</text>') || !m.includes('AP portátil, en la cama')) mal(`${q}: faltan R o rótulo`);
  if (/\b(NaN|undefined)\b/.test(m)) mal(`${q}: NaN en el dibujo`);
}
// Coherencia (§3)
const sel = normalizar({ tubo: 'selectivo' });
if (sel.e.atel !== 'pulmon' || sel.d.desvio <= 0) mal('tubo selectivo no fuerza atelectasia izquierda con desvío hacia ella');
const ten = normalizar({ ntx: 'tension' });
if (ten.d.desvio >= 0 || ten.d.cupulaIzq <= 0) mal('tensión sin desvío contralateral o sin cúpula deprimida');
const cuatro = describir({ ntx: 'grande', derrame: 'medio', patron: 'edema', consol: 'si', foco: 'consol' });
if (!/Placa imposible/.test(cuatro.sello || '')) mal('4 patologías sin sello «placa imposible»');
if (marcado({ ntx: 'pequeno' }) === marcado({ ntx: 'pequeno', postura: 'supino' })) mal('neumotórax: erguido y supino iguales');
if (marcado({ derrame: 'medio' }) === marcado({ derrame: 'medio', postura: 'supino' })) mal('derrame: erguido y supino iguales');
console.log(`Lógica: ${n} estados recorridos, ${fallos.length} fallos.`);

if (!process.argv.includes('--sin-navegador')) {
  const raiz = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../../..');
  const require = createRequire(path.join(raiz, 'package.json'));
  const { chromium } = require('playwright');
  const PUERTO = 8000 + Math.floor(Math.random() * 900) + 100;
  const srv = spawn('python3', ['-m', 'http.server', String(PUERTO), '--bind', '127.0.0.1'], { cwd: raiz, stdio: 'ignore' });
  console.log(`PUERTO=${PUERTO} PID=${srv.pid}`);
  const CAP = '/tmp/plan-socialista/motor-radio/capturas';
  mkdirSync(CAP, { recursive: true });
  await new Promise(r => setTimeout(r, 900));
  const nav = await chromium.launch();
  try {
    for (const [w, h] of [[390, 844], [360, 800]]) {
      const pag = await nav.newPage({ viewport: { width: w, height: h }, deviceScaleFactor: 2 });
      const errores = [];
      pag.on('console', m => { if (m.type() === 'error') errores.push(m.text()); });
      pag.on('pageerror', e => errores.push(String(e)));
      await pag.goto(`http://127.0.0.1:${PUERTO}/autonomo/maquetas/radio-rx-a.html`, { waitUntil: 'networkidle' });
      const toca = async (k, id, bloqueado) => { await pag.click(`#rx-chip-${k}`); if (id) await (bloqueado ? pag.$eval(`#rx-${k}-${id}`, b => b.click()) : pag.click(`#rx-${k}-${id}`)); };
      const mide = async (q) => {
        const x = await pag.evaluate(() => ({ sw: document.documentElement.scrollWidth, iw: innerWidth }));
        if (x.sw > x.iw) mal(`${w}px ${q}: desborda (${x.sw} > ${x.iw})`);
      };
      const foto = async (nombre) => { if (w === 390) await pag.screenshot({ path: `${CAP}/a-${nombre}.png` }); };
      await foto('erguido-normal');
      for (const k of MANDOS) for (const s of ESTADOS[k].estados) {
        await pag.click('#rx-sano'); await toca(k, s.id); await mide(`${k}=${s.id}`);
        if (s.peligro && await pag.$eval('#rx-sello', el => el.hidden)) mal(`${w}px ${k}=${s.id}: sin sello en pantalla`);
        if (s.figura) {
          await pag.$eval('#rx-fig-img', el => el.scrollIntoView());
          await pag.waitForFunction(() => { const i = document.getElementById('rx-fig-img'); return i.complete; });
          const nw = await pag.$eval('#rx-fig-img', el => el.naturalWidth);
          if (!(nw > 0)) mal(`${w}px ${k}=${s.id}: figura sin cargar`);
          await pag.evaluate(() => scrollTo(0, 0));
        }
      }
      // Rótulos de la placa: tamaño en pantalla ≥ 8 px.
      await pag.click('#rx-sano'); await toca('tubo', 'bien'); await pag.click('#rx-senalalo');
      const minimo = await pag.evaluate(() => Math.min(...[...document.querySelectorAll('#rx-placa text')].map(t => t.getBoundingClientRect().height * 0.8)));
      if (minimo < 8) mal(`${w}px: rótulo de la placa de ${minimo.toFixed(1)} px`);
      await pag.click('#rx-senalalo');
      // Las capturas pedidas.
      await pag.click('#rx-sano'); await toca('ntx', 'grande'); await foto('neumotorax-erguido');
      await toca('postura', 'supino'); await toca('ntx'); await foto('neumotorax-supino');
      await pag.click('#rx-sano'); await toca('ntx', 'tension'); await foto('tension');
      await pag.click('#rx-sano'); await toca('postura', 'supino'); await toca('derrame', 'grande'); await foto('derrame-supino');
      await pag.click('#rx-sano'); await toca('tubo', 'selectivo'); await pag.click('#rx-senalalo'); await foto('tubo-selectivo'); await pag.click('#rx-senalalo');
      for (const [k, id, nom] of [['ntx', 'tension', 'tension-entera'], ['via', 'pared', 'via-pared'], ['sng', 'bronquio', 'sonda-bronquio'], ['derrame', 'grande', 'derrame-erguido']]) {
        await pag.click('#rx-sano'); await toca(k, id); await pag.click('#rx-senalalo');
        if (w === 390) await pag.screenshot({ path: `${CAP}/a-${nom}.png`, fullPage: true });
        await pag.click('#rx-senalalo');
      }
      // Tope de 3 patologías: el cuarto no se aplica y sale el sello.
      await pag.click('#rx-sano'); await toca('ntx', 'pequeno'); await toca('derrame', 'pequeno'); await toca('patron', 'edema'); await toca('consol', 'si', true);
      const imp = await pag.$eval('#rx-sello', el => el.textContent);
      if (!/Placa imposible/.test(imp)) mal(`${w}px: el cuarto mando no saca «placa imposible»`);
      if (w === 390) await pag.screenshot({ path: `${CAP}/a-placa-imposible.png`, fullPage: true });
      await mide('final');
      if (errores.length) mal(`${w}px: errores de consola: ${errores.join(' | ')}`);
      console.log(`R1 ${w}px: hecho.`);
      await pag.close();
    }
  } finally {
    await nav.close();
    process.kill(srv.pid);
  }
}
if (fallos.length) { console.log('FALLOS:\n- ' + fallos.join('\n- ')); process.exit(1); }
console.log('Todo en verde.');
