// Cráneo A «La caja cerrada»: datos, fuentes y notas. Marino 2024, caps. 45-47 (PDF = página del PDF).
export const PDF = '../../docs/marino-2024-neurologia-caps45-47.pdf';
// página del PDF → id del párrafo de la ficha (js/modules/libros/marino-neuro.html) para «Ver en la ficha»
export function fichaDe(p) {
  p = +p;
  if (p <= 11) return 'mn-tabla-45-4'; if (p <= 13) return 'mn-coma-oculocefalico'; if (p <= 16) return 'mn-me-definicion';
  if (p <= 37) return 'mn-ictus-soporte'; if (p <= 40) return 'mn-ictus-complicaciones'; if (p === 41) return 'mn-hiper-calc';
  if (p <= 44) return 'mn-hic-datos'; if (p === 45) return 'mn-hic-ppc'; return 'mn-hsa-pic';
}
export const PEND = 'otra fuente pendiente';
export const IDEA = ['El cráneo es una caja cerrada: si una masa ocupa sitio, primero se va el LCR y la sangre venosa y la presión casi no sube; cuando ya no cabe nada, se dispara y la PPC (PAM − PIC) se hunde.', 45];
export const P = { picAviso: 20, ppcMin: 50, ppcMax: 70, naMax: 155, naBolo: 5, vpp: 3, drenajeMax: 3 };
// Todo lo que el libro no trae va rotulado; las cifras del modelo son ilustrativas.
export const PRESETS = {
  segismundo: { nombre: 'Segismundo', s: { tipo: 'hv', m: 66, pam: 95, na: 140, ictus: false },
    txt: 'Segismundo, 71 años, warfarina, hematoma de ganglios basales con sangre ventricular (Fig. 47.3): PAM 95 y PIC 30.' },
  abundio: { nombre: 'Abundio', s: { tipo: 'hematoma', m: 62, pam: 95, na: 140, ictus: false },
    txt: 'Abundio, 23 años, TCE con hematoma subdural: PAM 95 y PIC en torno a 28.' },
  clotilde: { nombre: 'Clotilde', s: { tipo: 'edema', m: 60, pam: 100, na: 138, ictus: true },
    txt: 'Clotilde, 66 años, infarto de más de un tercio del hemisferio derecho: edema, Na⁺ 138; el ictus no se monitoriza con PIC (p. 40), aquí es la caja ilustrada.' },
};
export const FUENTES = [
  ['PIC <20 mmHg, PPC = PAM − PIC, objetivo 50-70 en la HIC; PIC <20 drenando LCR; monitorizar con GCS ≤8, sangre ventricular o midriasis unilateral', 45],
  ['La PIC sube «hasta detener el flujo cerebral»; muerte encefálica = sin función del tronco, siempre irreversible', 14],
  ['Pupilas: una dilatada y fija = masa en expansión; dilatadas fijas = lesión difusa o compresión del tronco/HTIC; medias fijas = muerte encefálica entre otras (Tabla 45.4)', 10],
  ['Presión positiva: sube la PIC y baja la PPC', 35], ['Hipertónico más eficaz que el manitol, en bolos, Na⁺ 145-155 (Tabla 47.3)', 41],
  ['Ictus: hipotensión, corregir ya, PAM >65', 37], ['Edema citotóxico y vasogénico', 40],
  ['HIC: revertir ya (Tabla 47.4), PAS <140, sin profilaxis anticonvulsiva, EEG continuo si la consciencia empeora', 42],
];
export const NOTAS = [
  ['fuente no lo dice', 'Marino no trae Monro-Kellie, la curva presión-volumen ni la autorregulación (solo una mención, p. 45). La forma de la curva y todos los volúmenes son <b>ilustrativos</b> (sin cifras de volumen); ' + PEND + '.'],
  ['fuente no lo dice', 'Cuánto baja la PIC cada drenaje, cada bolo de hipertónico o el tiempo: magnitudes <b>ilustrativas</b>; el libro solo dice «baja».'],
  ['fuente no lo dice', 'PaCO₂ alta sube la PIC: <b>fisiología general</b>, ' + PEND + '. La hiperventilación transitoria 30-35 viene del Manual UMI de la app (umi-pic), no de Marino.'],
  ['fuente no lo dice', 'El objetivo de PPC 50-70 es el de la HIC (p. 45); en el ictus isquémico Marino no lo da. Aquí el semáforo sale de ese rango y lo decimos.'],
  ['fuentes discrepan', 'Marino: tras una HIC la PAS objetivo es <140 (p. 44). El Manual UMI da cifras de PPC (<70 pronóstico, <50 evitar) para el TCE: no son el mismo supuesto y se muestran las dos.'],
];
export const PROFUNDIZAR = ['Monro-Kellie y la curva presión-volumen con cifras: ' + PEND + '.', 'Herniación uncal y del tronco (se cuenta, no se ve en este corte): pupilas, Tabla 45.4 (p. 10-11).', 'Hemicraniectomía en el ictus (p. 40) y la PIC en la HSA (p. 48): ficha de ictus y HSA.'];
