import { cita } from '../../../data/craneo-vivo-data.js';
const EA = {
  
  antes: 'Segismundo, hemorragia intracerebral con warfarina (INR 3,2). El plan que escribe el R1: juzga cada frase.',
  frases: [
    { t: 'Vitamina K 10 mg IV y plasma fresco hasta normalizar el INR.', error: true, por: 'Falso: se revierte con vitamina K 10 mg + concentrado de complejo protrombínico, 25 U/kg si el INR es 2-4 (p. 42-44). El plasma tarda y sobrecarga volumen mientras el hematoma crece.' },
    { t: 'PAS objetivo <160.', error: true, por: 'Falso: el objetivo de la ficha es PAS <140 (p. 45). Con 160 el hematoma puede seguir creciendo.' },
    { t: 'Compresión neumática, sin levetiracetam profiláctico y EEG continuo si la consciencia empeora.', error: false, por: 'Cierto (p. 45): sin profilaxis anticonvulsiva y EEG continuo si hay consciencia alterada.' }],
};
const CA = {
  preset: 'segismundo', pag: 45, titulo: 'Segismundo, 71 años · warfarina, INR 3,2, PA 196/104, GCS 13',
  pasos: [
    { enun: 'TC: hematoma de ganglios basales con sangre ventricular (Fig. 47.3). Pesa 80 kg. ¿Qué es lo primero?', orden: [1, 0, 2], pag: 42,
      ops: [{ t: 'Revertir ya: vitamina K 10 mg + CCP 25 U/kg (2.000 U), y bajar la PAS a <140.', ok: true, por: 'INR 2-4: CCP 25 U/kg (Tabla 47.4); el hematoma crece mientras esperas (p. 42-44).' },
        { t: 'Plasma fresco hasta que el INR baje de 1,5 y reevaluar mañana.', ok: false, por: 'Horas de retraso con INR 3,2: el hematoma sigue creciendo y la caja se llena (p. 42).' },
        { t: 'Esperar a ver cómo evoluciona: GCS 13 es leve.', ok: false, por: 'La hemiparesia brusca con INR 3,2 es la ventana de crecimiento del hematoma: perderla empeora el pronóstico (p. 42).' }] },
    { enun: 'A las 6 h: GCS 7 con sangre en los ventrículos. ¿Qué haces con la presión dentro de la cabeza?', orden: [0, 2, 1], pag: 45,
      ops: [{ t: 'Monitorizar la PIC con un catéter ventricular: GCS ≤8 y sangre ventricular.', ok: true, por: 'Son dos de las tres indicaciones de la p. 45 (GCS ≤8, sangre ventricular, midriasis unilateral); además drena.' },
        { t: 'No monitorizo: en el hematoma basta mirar las pupilas.', ok: false, por: 'Cuando la pupila se dilata ya hay herniación; sin PIC no ves la PPC ni el drenaje (p. 45, 10).' },
        { t: 'Subo la PAM a 150 por si el cerebro pide más flujo.', ok: false, por: 'Más presión con la PIC alta no cabe en la caja: más sangrado y PPC sobre 70.' }] },
    { enun: 'PIC 26 con PAM 100: PPC 74. PIC ≥20. ¿Qué haces?', pag: 45, orden: [2, 0, 1],
      ops: [{ t: 'Drenar LCR por el catéter (un tramo) y bajar la PAM a 80: la PIC cede y la PPC queda en 50-70.', ok: true, por: 'PIC <20 se consigue drenando LCR y la PPC objetivo es 50-70 (p. 45): con la PIC en torno a 14 y la PAM en 80, la PPC es de unos 66 (cifras del modelo, ilustrativas).', },
        { t: 'Hiperventilar a PaCO₂ 25 para bajar la PIC ya.', ok: false, por: 'Solo moderada y transitoria (30-35), no las primeras 24 h: el vasoespasmo empeora el flujo (Manual UMI).' },
        { t: 'Poner presión positiva alta para mejorar la oxigenación del cerebro.', ok: false, por: 'La presión positiva sube la PIC y baja la PPC (p. 35).' }] },
    { enun: 'Día 3: hidrocefalia en la TC, la sangre ventricular bloquea el LCR. ¿Y ahora?', orden: [1, 2, 0], pag: 45,
      ops: [{ t: 'Drenaje ventricular continuo para mantener la PIC <20.', ok: true, por: 'Sangre ventricular → hidrocefalia obstructiva → catéter (p. 45).', haz: (a) => a.hacer('dren', 1) },
        { t: 'Retirar el catéter: lleva tres días y se infecta.', ok: false, por: 'Sin drenaje el LCR retenido sube la PIC y el cuadro vuelve a empeorar.' },
        { t: 'Hipertónico en bolos hasta Na⁺ 160.', ok: false, por: 'Sobrepasa el objetivo 145-155 (p. 41) y no resuelve un LCR retenido.' }] },
  ],
};
// Segundo caso y segundo error: Segismundo (de la maqueta A, importado; no se copia). Se adapta al formato de B: [texto, ok, por, pág, ficha].
// Cada paso lleva el estado de B que da las cifras que dice el enunciado (se comprueban en autonomo/bloques/b6a/herramientas/craneo-b.mjs).
const FICHA = { 35: 'mn-isq-vm', 41: 'mn-isq-edema-manejo', 42: 'mn-hic-warfarina', 44: 'mn-hic-datos', 45: 'mn-hic-ppc' };
const pagDe = (por, p0) => { const m = /\(p\. (\d+)/.exec(por); return FICHA[m ? +m[1] : p0] ? (m ? +m[1] : p0) : p0; };
const fila = (p0, t, ok, por) => { const p = pagDe(por, p0); return [t, ok, por, p, FICHA[p]]; };
export const ERROR_SEG = { p: 'segismundo', enun: 'Segismundo, hemorragia intracerebral con warfarina (INR 3,2). El plan que escribe el R1: hay 0, 1 o 2 frases falsas. Toca las que contienen un error; si crees que no hay más, pulsa «No hay más errores».',
  fr: EA.frases.map((f, i) => { const p = [42, 45, 45][i]; return [f.t, f.error, f.por, p, FICHA[p]]; }),
  nada: ['Hay errores: una de las frases falsas sigue sin tocar. Vuelve a leerlas con calma.', 'Ahora sí: ya has encontrado los dos errores.'] };
const E = [{ tipo: 'ventricular', masa: 52, pas: 196, anti: 'warfarina' }, { tipo: 'ventricular', masa: 73, pas: 190, anti: 'warfarina', rev: true }, { tipo: 'ventricular', masa: 61, pas: 143, anti: 'warfarina', rev: true }, { tipo: 'ventricular', masa: 61, pas: 114, anti: 'warfarina', rev: true, drenaje: 1 }];
const EF = [{}, {}, { dren: 1, pas: 114 }, { dren: 1 }];
const ENUN = ['Paso 1 · TC: hematoma de ganglios basales con sangre ventricular (Fig. 47.3). Segismundo, 71 años, warfarina, INR 3,2, PA 196/108, GCS 13. Pesa 80 kg. ¿Qué es lo primero?', 'Paso 2 · A las 6 h: GCS 6 con sangre en los ventrículos. ¿Qué haces con la presión dentro de la cabeza?', 'Paso 3 · PIC 26 con PAM 100: PPC 74. PIC ≥20. ¿Qué haces?', 'Paso 4 · Día 3: hidrocefalia en la TC, la sangre ventricular bloquea el LCR. ¿Y ahora?'];
const POR3 = 'PIC <20 se consigue drenando LCR y la PPC objetivo es 50-70 (p. 45): con la PIC en torno a 18 y la PAM en 80, la PPC es de unos 62 (cifras del modelo, ilustrativas).';
export const CASO_SEG = { p: 'segismundo', titulo: 'Segismundo 71 años', pasos: CA.pasos.map((p, k) => ({ e: E[k], enun: ENUN[k],
  ops: p.ops.map((o, i) => [...fila(p.pag, o.t, o.ok, k === 2 && i === 0 ? POR3 : o.por), o.ok ? EF[k] : {}]) })),
  llevas: [['Revertir ya es lo primero en la HIC con anticoagulante.', 42], ['GCS ≤8 y sangre ventricular: monitorizar la PIC; PIC <20 drenando LCR.', 45], ['La presión positiva sube la PIC y baja la PPC.', 35]] };
