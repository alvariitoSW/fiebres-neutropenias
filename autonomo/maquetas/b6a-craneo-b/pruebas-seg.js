// Segundo caso y segundo error: Segismundo (de la maqueta A, importado; no se copia). Se adapta al formato de B: [texto, ok, por, pág, ficha].
// Cada paso lleva el estado de B que da las cifras que dice el enunciado (se comprueban en autonomo/bloques/b6a/herramientas/craneo-b.mjs).
import { ERROR as EA, CASO as CA, LLEVAS as LA } from '../b6a-craneo-a/pruebas.js';
const FICHA = { 35: 'mn-isq-vm', 41: 'mn-isq-edema-manejo', 42: 'mn-hic-warfarina', 44: 'mn-hic-datos', 45: 'mn-hic-ppc' };
const pagDe = (por, p0) => { const m = /\(p\. (\d+)/.exec(por); return FICHA[m ? +m[1] : p0] ? (m ? +m[1] : p0) : p0; };
const fila = (p0, t, ok, por) => { const p = pagDe(por, p0); return [t, ok, por, p, FICHA[p]]; };
export const ERROR_SEG = { p: 'segismundo', enun: 'Segismundo, hemorragia intracerebral con warfarina (INR 3,2). El plan que escribe el R1: hay 0, 1 o 2 frases falsas. Toca las que contienen un error; si crees que no hay más, pulsa «No hay más errores».',
  fr: EA.frases.map((f, i) => { const p = [42, 44, 44][i]; return [f.t, f.error, f.por, p, FICHA[p]]; }),
  nada: ['Hay errores: una de las frases falsas sigue sin tocar. Vuelve a leerlas con calma.', 'Ahora sí: ya has encontrado los dos errores.'] };
const E = [{ tipo: 'ventricular', masa: 52, pas: 196, anti: 'warfarina' }, { tipo: 'ventricular', masa: 73, pas: 190, anti: 'warfarina', rev: true }, { tipo: 'ventricular', masa: 61, pas: 143, anti: 'warfarina', rev: true }, { tipo: 'ventricular', masa: 61, pas: 114, anti: 'warfarina', rev: true, drenaje: 1 }];
const EF = [{}, {}, { dren: 1, pas: 114 }, { dren: 1 }];
const ENUN = ['Paso 1 · TC: hematoma de ganglios basales con sangre ventricular (Fig. 47.3). Segismundo, 71 años, warfarina, INR 3,2, PA 196/108, GCS 13. Pesa 80 kg. ¿Qué es lo primero?', 'Paso 2 · A las 6 h: GCS 6 con sangre en los ventrículos. ¿Qué haces con la presión dentro de la cabeza?', 'Paso 3 · PIC 26 con PAM 100: PPC 74. PIC ≥20. ¿Qué haces?', 'Paso 4 · Día 3: hidrocefalia en la TC, la sangre ventricular bloquea el LCR. ¿Y ahora?'];
const POR3 = 'PIC <20 se consigue drenando LCR y la PPC objetivo es 50-70 (p. 45): con la PIC en torno a 18 y la PAM en 80, la PPC es de unos 62 (cifras del modelo, ilustrativas).';
export const CASO_SEG = { p: 'segismundo', titulo: 'Segismundo 71 años', pasos: CA.pasos.map((p, k) => ({ e: E[k], enun: ENUN[k],
  ops: p.ops.map((o, i) => [...fila(p.pag, o.t, o.ok, k === 2 && i === 0 ? POR3 : o.por), o.ok ? EF[k] : {}]) })),
  llevas: [['Revertir ya es lo primero en la HIC con anticoagulante.', 42], ['GCS ≤8 y sangre ventricular: monitorizar la PIC; PIC <20 drenando LCR.', 45], ['La presión positiva sube la PIC y baja la PPC.', 35]] };
void LA;
