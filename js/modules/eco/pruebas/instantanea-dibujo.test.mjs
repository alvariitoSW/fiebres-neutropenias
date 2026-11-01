// Instantánea «antes = después» del dibujo del corazón (paso 3 de mv-eco-2a5, opción A: la imagen solo lee del corazón).
// Para cada forma de ESCENARIOS (las 6 con mando × g = 0, defecto, 1; las 3 sin mando, un punto) guarda un resumen numérico de
// construirCorazon(estadoGeo(latido, extraDeMotor(m))) en telediástole y telesístole, y las salidas de medirForma.
// Los datos congelados están en instantanea-dibujo.json, hechos con el código de ANTES de mover tapseDeLatido/LIMITES.
// Regenerar (solo si se cambia el dibujo a propósito, paso 4):  node js/modules/eco/pruebas/instantanea-dibujo.test.mjs --congelar
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import os from 'node:os';
import { Worker, isMainThread, parentPort, workerData } from 'node:worker_threads';
import { crearMotor } from '../motor.mjs';
import { ESCENARIOS, ASENTAR_FORMA } from '../escenarios.mjs';
import { construirCorazon, usarDibujo } from '../corazon-geo.mjs';
usarDibujo(1);   // esta instantánea congela el dibujo de antes (también en los hilos)
import { estadoGeo, extraDeMotor } from '../formas.mjs';
import { medirForma, CASOS_FORMA, claveCaso } from './medir-forma.mjs';

const RUTA = fileURLToPath(new URL('./instantanea-dibujo.json', import.meta.url));

function resumen({ partes, descenso, descensoVd, anilloTricLateral }) {
  let n = 0, sx = 0, sy = 0, sz = 0, pond = 0, ni = 0;
  const por = {};
  for (const p of partes) {
    if (!p.pos) { const l = p.lineas; let a = 0; for (let i = 0; i < l.length; i++) a += l[i] * (i % 5 + 1); por[p.nombre] = [l.length / 3, a]; continue; }
    let a = 0, b = 0, c = 0, w = 0;
    for (let i = 0; i < p.pos.length; i += 3) { a += p.pos[i]; b += p.pos[i + 1]; c += p.pos[i + 2]; w += (p.pos[i] + 2 * p.pos[i + 1] + 3 * p.pos[i + 2]) * ((i / 3) % 13 + 1); }
    n += p.pos.length / 3; ni += p.idx.length; sx += a; sy += b; sz += c; pond += w;
    por[p.nombre] = [p.pos.length / 3, a, b, c, w];
  }
  return { n, ni, sx, sy, sz, pond, descenso, descensoVd, anilloTricLateral, por };
}

function instantanea(k, g) {
  const m = crearMotor(); m.correr(12);
  if (k !== 'normal') {
    if (g === 'def' || g === undefined) ESCENARIOS[k].aplicar(m); else ESCENARIOS[k].aplicar(m, g);
    m.correr(ESCENARIOS[k].forma ? ASENTAR_FORMA : 40);
  }
  const o = m.onda, extra = extraDeMotor(m);
  const td = o.reduce((a, b) => (b.vvi > a.vvi ? b : a)), ts = o.reduce((a, b) => (b.vvi < a.vvi ? b : a));
  const medida = medirForma(k, g);
  delete medida.fuera;
  return { td: resumen(construirCorazon(estadoGeo(td, extra))), ts: resumen(construirCorazon(estadoGeo(ts, extra))), medida };
}

const aplanar = (x, ruta, out) => {
  if (typeof x === 'number') out.push([ruta, x]);
  else if (x && typeof x === 'object') for (const k of Object.keys(x)) aplanar(x[k], ruta + '.' + k, out);
  else out.push([ruta, x]);
  return out;
};

// Rápida: reparte los 21 puntos entre hilos (cada punto son ~2 s de motor y doppler).
function enHilos() {
  const n = Math.min(os.cpus().length, 6), res = {};
  return Promise.all(Array.from({ length: n }, (_, h) => new Promise((ok, mal) => {
    const w = new Worker(fileURLToPath(import.meta.url), { workerData: CASOS_FORMA.filter((_, i) => i % n === h) });
    w.on('message', (r) => Object.assign(res, r)); w.on('error', mal); w.on('exit', () => ok());
  }))).then(() => res);
}

if (!isMainThread) {
  const r = {};
  for (const [k, g] of workerData) r[claveCaso(k, g)] = instantanea(k, g);
  parentPort.postMessage(r);
} else if (process.argv.includes('--congelar')) {
  const datos = await enHilos();
  writeFileSync(RUTA, JSON.stringify(datos));
  console.log('congelado', Object.keys(datos).length, 'casos');
} else {
  test('el dibujo de hoy no cambia: 9 formas × (0, defecto, 1), telediástole y telesístole + medirForma', async () => {
    const datos = JSON.parse(readFileSync(RUTA, 'utf8')), nuevos = await enHilos();
    let comparados = 0;
    for (const [k, g] of CASOS_FORMA) {
      const ahora = new Map(aplanar(nuevos[claveCaso(k, g)], '', [])), antes = aplanar(datos[claveCaso(k, g)], '', []);
      for (const [ruta, v] of antes) {
        const w = ahora.get(ruta);
        if (typeof v === 'number') assert.ok(Math.abs(w - v) <= 1e-9 * Math.max(1, Math.abs(v)), `${claveCaso(k, g)}${ruta}: antes ${v}, ahora ${w}`);
        else assert.equal(w, v, `${claveCaso(k, g)}${ruta}`);
        comparados++;
      }
    }
    assert.ok(comparados > 1000);
  });
}
