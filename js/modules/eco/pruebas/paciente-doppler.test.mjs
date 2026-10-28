// J1 «Doppler de paciente posible» y J2 «sin recorte»: cada forma en cada punto de su mando debe ser un paciente
// que existe (bandas con libro y página en bandas-paciente.mjs) y caber en el dibujo (LIMITES de corazon-geo.mjs).
// PENDIENTES: lo que hoy falla y arregla eco-calibra-a (cada arreglo quita sus claves; al cerrar, vacío).
// Una prueba de PENDIENTES que ya pasa lo dice: hay que quitarla de la lista.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { medirForma } from './medir-forma.mjs';
import { BANDAS, HUECO_MINIMOS, UNIDADES } from './bandas-paciente.mjs';

const PENDIENTES = new Set([
  // causa (e′ por forma, hipertrofia con mando, dilatada con la restitución de e′, hpcronica y E>0 a fondo ya pasan en la s2):
  // fallo:def E/e′ 13,4 (≥14) y S/D 1,42 (<1): pide rigidez con la gravedad, que rompe 9 pruebas del fallo (s2-dilfallo.md); fallo:1 E/e′ 8,5
  // (fusión a FC 120). J2 por abajo ya pasa en todas las formas: sin suelo de VD, y con LIMITES.vd[0] = 20 mL el dibujo admite el VD vacío (s2-vd.md).
  'J1:fallo:def', 'J1:fallo:1',
]);
const todo = { todo: 'eco-calibra-a' };

const punto = (clave) => { const [k, p] = clave.split(':'); return [k, p === undefined ? undefined : p === 'def' ? 'def' : Number(p)]; };
const dentro = (v, b) => Number.isFinite(v) && (b.min_excl ? v > b.min : v >= b.min) && (b.max_excl ? v < b.max : v <= b.max);
const banda = (b) => `${b.min_excl ? '>' : '≥'}${b.min} y ${b.max_excl ? '<' : '≤'}${b.max}`;
const fmt = (v) => Number.isFinite(v) ? (Math.round(v * 100) / 100) : String(v);

const cache = new Map();
const medida = (clave) => { if (!cache.has(clave)) cache.set(clave, medirForma(...punto(clave))); return cache.get(clave); };

function fallosJ1(clave) {
  const r = medida(clave), fallos = [], diagn = [];
  for (const b of [...HUECO_MINIMOS.map(x => ({ ...x, min_excl: true })), ...BANDAS[clave]]) {
    const v = r[b.medida], ok = (b.min_excl || b.max_excl ? dentro(v, b) : (Number.isFinite(v) && v >= b.min && v <= b.max));
    const txt = `${b.medida} ${fmt(v)} ${UNIDADES[b.medida] ?? ''} fuera de ${banda(b)} (${b.fuente}${b.nota ? '; ' + b.nota : ''})`;
    if (!ok) (b.diagnostico ? diagn : fallos).push(txt);
  }
  return { fallos, diagn };
}

const hayTodo = (nombre, clave, fn) => {
  const pend = PENDIENTES.has(clave);
  test(nombre, pend ? todo : {}, () => {
    const mal = fn();
    if (pend && !mal) console.log(`  AVISO: «${nombre}» ya pasa: quítala de PENDIENTES`);
    if (!pend) assert.equal(mal, '', mal);
    else if (!mal) return;
  });
};

for (const clave of Object.keys(BANDAS)) {
  hayTodo(`J1 Doppler · ${clave}`, 'J1:' + clave, () => {
    const { fallos, diagn } = fallosJ1(clave);
    if (diagn.length) console.log(`  diagnóstico ${clave}: ${diagn.join(' | ')}`);
    return fallos.join('\n');
  });
  hayTodo(`J2 sin recorte · ${clave}`, 'J2:' + clave, () => {
    const f = medida(clave).fuera;
    return f.length ? `${clave}: muestras fuera de LIMITES del dibujo: ${f.join(', ')}` : '';
  });
}
