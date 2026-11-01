// Las preguntas y los casos de la Mayéutica del eje hormonal vivo (Marino cap. 51, docs/marino-2024-nutricion-endocrino-caps45-53.pdf).
// Solo datos; el motor es js/core/mayeutica-motor.js. El contenido (apuestas, «encuentra el error», casos con giro) vive una sola vez
// en eje-vivo-pruebas.js y aquí se pone en la forma del motor. Las respuestas viven aquí: el HTML no las lleva hasta que se contesta.
// Cada cita es 'página|id del párrafo de la ficha'. Las cifras de la ficha del paciente salen del monitor (leer), nunca a mano.
import { APUESTAS, ERRORES, CASOS as CASOS_BRUTOS } from './eje-vivo-pruebas.js';
import { nuevo, leer, acthVals } from '../modules/libros/eje-vivo/modelo.js';
import { PRES, cita } from './eje-vivo-data.js';
const coma = (v, d = 1) => (+v).toFixed(d).replace('.', ',');
const pg = (n) => ` (p. ${n})`;
const estadoDe = (e) => ({ ...nuevo(e.pac), ...(e.set || {}) });
const leerEn = (e) => leer(estadoDe(e));
const fuentes = (lista) => [...new Set(lista.map((o) => `${o[3]}|${o[4]}`))];
// Opción del motor: la buena sin texto (su porqué es la explicación); la mala, con lo que le pasaría al paciente y su página.
const op = (o) => (o[1] ? { t: o[0], ok: true } : { t: o[0], porque: o[2] + pg(o[3]) });
const buena = (ops) => ops.find((o) => o[1]);
const CORTO = { G1: 'Toribio: PA 78/40', G2: 'Bibiana: cortisol 22', E1: 'nota de Obdulia', E2: 'nota de Lucrecia' };

// Guía socrática: las dos apuestas (predices y compruebas en el modelo).
const TOCAR = {
  toribio: { txt: 'Compruébalo: pon la hidrocortisona', patch: { pac: 'toribio', set: { hc: 1, hcD: 0 } },
    cuenta: (a, d) => `la PA de Toribio pasa de ${a.pas}/${a.pad} a ${d.pas}/${d.pad} con la noradrenalina igual (0,4 µg/kg/min) y 3 L de suero.` },
  bibiana: { txt: 'Compruébalo: haz la prueba de la ACTH', patch: { pac: 'bibiana', set: { acth: true } },
    cuenta: () => { const v = acthVals({ pac: 'bibiana' }); return `el cortisol de Bibiana pasa de ${v.b} a ${v.post} µg/dL: aumento de ${v.d}, menor de 9 µg/dL, la glándula no responde.`; } },
};
const guia = APUESTAS.map((A, i) => ({
  grupo: 'guia', num: 'G' + (i + 1), predice: true, corto: CORTO['G' + (i + 1)], estado: { pac: A.p, lup: PRES[A.p].lup, vista: A.vista },
  enunciado: A.enun.replace(/ Decide antes de ver qué pasa\.$/, '') + ' <b>Elige antes de ver nada.</b>',
  opciones: A.ops.map(op), explicacion: buena(A.ops)[2] + pg(buena(A.ops)[3]), fuente: fuentes(A.ops), tocar: TOCAR[A.p],
}));
// Examen: las dos notas con «encuentra el error».
const examen = ERRORES.map((E, i) => ({
  grupo: 'examen', num: 'E' + (i + 1), tipo: 'error', corto: CORTO['E' + (i + 1)], estado: { pac: E.p, lup: E.lup, vista: 'eje' },
  enunciado: E.enun.replace(/ Toca la.*$/, '') + ' <b>Puede haber 0, 1 o 2 errores.</b> Toca las frases que creas falsas.',
  frases: E.fr.map((f) => ({ t: f[0], mal: f[1], c: f[1] ? f[2].replace(/^Error: /, '') + pg(f[3]) : '' })), fuente: fuentes(E.fr),
}));
export const PREGUNTAS = [...guia, ...examen].map((q) => ({ ...q, id: 'ejm-' + q.num.toLowerCase() + (q.num === 'G1' ? 'a' : ''), tipo: q.tipo || 'test' }));

// Casos: la ficha del paciente sale del monitor del modelo en cada paso.
const MOMENTOS = { obdulia: ['Día 0 · urgencias', 'Día 1 · el laboratorio', 'Día 2 · el cambio de turno', 'Día 3 · el mantenimiento'], toribio: ['Día 1 · el cortisol', 'Día 3 · la retirada', 'Día 5 · tras la retirada brusca'] };
const SUB = { obdulia: 'Del mixedema a la hormona y la hidrocortisona', toribio: 'Del shock séptico a la retirada de la hidrocortisona' };
const VUELTA = { obdulia: 'mu-hipo-coma-tto', toribio: 'mu-sr-retirada' };
const filas = (pac, e) => { const s = estadoDe({ pac, set: e }), L = leer(s);
  return [['PA', `${L.pas}/${L.pad} mmHg`], ['FC', `${L.fc} lpm`], ['T central', `${coma(L.t)} °C`], ['Na⁺', `${L.na} mEq/L`], ...(pac === 'toribio' ? [['Lactato', `${coma(L.lact)} mmol/L`], ['Noradrenalina', `${coma(s.na)} µg/kg/min`]] : []), ['Día', String(s.dia)]]; };
export const CASOS = CASOS_BRUTOS.map((C) => {
  const dic = (f) => Object.fromEntries(f), P = PRES[C.pac];
  return {
    id: 'ejm-' + C.pac, titulo: C.titulo.replace(/ \(seguimiento\)$/, ''), sub: SUB[C.pac], corto: P.n, abrir: { pac: C.pac, paso: 0 },
    paciente: dic([['Paciente', `${P.n}, ${P.e} años · ${P.caso}`], ...filas(C.pac, C.pasos[0].e)]),
    pasos: C.pasos.map((s, i) => {
      const f = filas(C.pac, s.e), antes = i ? filas(C.pac, C.pasos[i - 1].e) : [];
      return {
        momento: MOMENTOS[C.pac][i], estado: { pac: C.pac, lup: C.lup, vista: s.vista, set: s.e }, datos: i ? dic(f) : {},
        nuevo: i ? f.filter(([k, v]) => k === 'Día' || antes.find((x) => x[0] === k)?.[1] !== v).map((x) => x[0]) : [],
        pregunta: { id: `ejm-${C.pac}-${i + 1}${C.pac === 'obdulia' && i < 2 ? 'a' : ''}`,   // la letra reparte la posición de la buena al barajar
         tipo: 'test', corto: `paso ${i + 1}`, enunciado: s.enun, opciones: s.ops.map(op), explicacion: buena(s.ops)[2] + pg(buena(s.ops)[3]), fuente: fuentes(s.ops) },
      };
    }),
    lleva: C.llevas.map(([t, p, id]) => `${t} ${cita(p, id)}`), volver: { nombre: 'Suprarrenal y tiroides en el crítico (Marino, cap. 51)', ancla: VUELTA[C.pac] },
  };
});
