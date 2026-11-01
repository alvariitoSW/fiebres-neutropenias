// Apuesta, «encuentra el error» y caso (Segismundo, 71). Las respuestas viven aquí, no en el HTML. Cada falsa dice qué le pasaría al paciente.
export const APUESTA = {
  preset: 'segismundo', pag: 45,
  antes: 'Segismundo, 71 años, hematoma de ganglios basales con sangre ventricular. PAM 95 y PIC 30.',
  pregunta: '¿Está su PPC en objetivo? Y si subes la PAM a 110, ¿qué pasa con la PPC y qué arriesgas?',
  ops: [
    { t: 'PPC 65: en objetivo (50-70). Con PAM 110 sube a 80, por encima de 70, y la PIC sigue ≥20: antes hay que drenar LCR.', ok: true, por: 'PPC = PAM − PIC (p. 45). Subir la PAM sin bajar la PIC no arregla la caja y la deja por encima del rango.' },
    { t: 'PPC 65 está bien y subir la PAM a 110 la mejora: más presión, más flujo y la PIC no se mueve.', ok: false, por: 'Segismundo quedaría con PPC 80, fuera del 50-70, con la PIC sin tratar: más sangre en una caja que ya no cabe nada.' },
    { t: 'PPC 30: está en peligro porque la PIC de 30 se resta dos veces.', ok: false, por: 'La resta es una vez: 95 − 30 = 65. Con esa cifra errónea pondrías vasopresores que no necesita y empeorarías el sangrado.' }],
  orden: [1, 0, 2], tras: (a) => a.hacer('pam', 15),
};
export const ERROR = {
  preset: 'segismundo', pag: 42,
  antes: 'Segismundo, hemorragia intracerebral con warfarina (INR 3,2). El plan que escribe el R1: juzga cada frase.',
  frases: [
    { t: 'Vitamina K 10 mg IV y plasma fresco hasta normalizar el INR.', error: true, por: 'Falso: se revierte con vitamina K 10 mg + concentrado de complejo protrombínico, 25 U/kg si el INR es 2-4 (p. 42-44). El plasma tarda y sobrecarga volumen mientras el hematoma crece.' },
    { t: 'PAS objetivo <160.', error: true, por: 'Falso: el objetivo de la ficha es PAS <140 (p. 44). Con 160 el hematoma puede seguir creciendo.' },
    { t: 'Compresión neumática, sin levetiracetam profiláctico y EEG continuo si la consciencia empeora.', error: false, por: 'Cierto (p. 44): sin profilaxis anticonvulsiva y EEG continuo si hay consciencia alterada.' }],
};
export const CASO = {
  preset: 'segismundo', pag: 45, titulo: 'Segismundo, 71 años · warfarina, INR 3,2, PA 196/104, GCS 13',
  pasos: [
    { enun: 'TC: hematoma de ganglios basales con sangre ventricular (Fig. 47.3). Pesa 80 kg. ¿Qué es lo primero?', antes: { preset: 'segismundo', oculto: true }, orden: [1, 0, 2], pag: 42,
      ops: [{ t: 'Revertir ya: vitamina K 10 mg + CCP 25 U/kg (2.000 U), y bajar la PAS a <140.', ok: true, por: 'INR 2-4: CCP 25 U/kg (Tabla 47.4); el hematoma crece mientras esperas (p. 42-44).' },
        { t: 'Plasma fresco hasta que el INR baje de 1,5 y reevaluar mañana.', ok: false, por: 'Horas de retraso con INR 3,2: el hematoma sigue creciendo y la caja se llena (p. 42).' },
        { t: 'Esperar a ver cómo evoluciona: GCS 13 es leve.', ok: false, por: 'La hemiparesia brusca con INR 3,2 es la ventana de crecimiento del hematoma: perderla empeora el pronóstico (p. 42).' }] },
    { enun: 'A las 6 h: GCS 7 con sangre en los ventrículos. ¿Qué haces con la presión dentro de la cabeza?', antes: { estado: { m: 63, pam: 100 }, oculto: true }, orden: [0, 2, 1], pag: 45,
      ops: [{ t: 'Monitorizar la PIC con un catéter ventricular: GCS ≤8 y sangre ventricular.', ok: true, por: 'Son dos de las tres indicaciones de la p. 45 (GCS ≤8, sangre ventricular, midriasis unilateral); además drena.' },
        { t: 'No monitorizo: en el hematoma basta mirar las pupilas.', ok: false, por: 'Cuando la pupila se dilata ya hay herniación; sin PIC no ves la PPC ni el drenaje (p. 45, 10).' },
        { t: 'Subo la PAM a 150 por si el cerebro pide más flujo.', ok: false, por: 'Más presión con la PIC alta no cabe en la caja: más sangrado y PPC sobre 70.' }] },
    { enun: 'PIC 26 con PAM 100: PPC 74. PIC ≥20. ¿Qué haces?', pag: 45, antes: { oculto: false }, orden: [2, 0, 1],
      ops: [{ t: 'Drenar LCR por el catéter (un tramo) y bajar la PAM a 80: la PIC cede y la PPC queda en 50-70.', ok: true, por: 'PIC <20 se consigue drenando LCR y la PPC objetivo es 50-70 (p. 45): con la PIC en torno a 14 y la PAM en 80, la PPC es de unos 66 (cifras del modelo, ilustrativas).', haz: (a) => { a.hacer('dren', 1); a.hacer('pam', -20); } },
        { t: 'Hiperventilar a PaCO₂ 25 para bajar la PIC ya.', ok: false, por: 'Solo moderada y transitoria (30-35), no las primeras 24 h: el vasoespasmo empeora el flujo (Manual UMI).' },
        { t: 'Poner presión positiva alta para mejorar la oxigenación del cerebro.', ok: false, por: 'La presión positiva sube la PIC y baja la PPC (p. 35).' }] },
    { enun: 'Día 3: hidrocefalia en la TC, la sangre ventricular bloquea el LCR. ¿Y ahora?', antes: { h: 72 }, orden: [1, 2, 0], pag: 45,
      ops: [{ t: 'Drenaje ventricular continuo para mantener la PIC <20.', ok: true, por: 'Sangre ventricular → hidrocefalia obstructiva → catéter (p. 45).', haz: (a) => a.hacer('dren', 1) },
        { t: 'Retirar el catéter: lleva tres días y se infecta.', ok: false, por: 'Sin drenaje el LCR retenido sube la PIC y el cuadro vuelve a empeorar.' },
        { t: 'Hipertónico en bolos hasta Na⁺ 160.', ok: false, por: 'Sobrepasa el objetivo 145-155 (p. 41) y no resuelve un LCR retenido.' }] },
  ],
};
export function opciones(caja, ops, alResponder, orden0) {
  caja.textContent = '';
  const orden = orden0 || ops.map((o, i) => i);
  for (const i of orden) {
    const b = document.createElement('button'); b.type = 'button'; b.className = 'op'; b.textContent = ops[i].t;
    b.addEventListener('click', () => {
      if (caja.dataset.hecho) return; caja.dataset.hecho = '1';
      [...caja.children].forEach((x, j) => { if (x.tagName !== 'BUTTON') return; x.disabled = true; x.classList.add(ops[orden[j]].ok ? 'bien' : (x === b ? 'mal' : 'neutra')); });
      const p = document.createElement('p'); p.className = 'por ' + (ops[i].ok ? 'ok' : 'no'); p.textContent = (ops[i].ok ? 'Bien. ' : 'No. ') + ops[i].por; caja.append(p);
      alResponder(ops[i], i);
    });
    caja.append(b);
  }
  delete caja.dataset.hecho;
}
export const LLEVAS = {
  apuesta: [['PPC = PAM − PIC, objetivo 50-70; con PIC ≥20 se drena antes de subir la PAM.', 45]],
  error: [['Revertir con vitamina K y CCP, no con plasma.', 42], ['PAS objetivo <140 en la HIC.', 44]],
  caso: [['Revertir ya es lo primero en la HIC con anticoagulante.', 42], ['GCS ≤8 y sangre ventricular: monitorizar la PIC; PIC <20 drenando LCR.', 45], ['La presión positiva sube la PIC y baja la PPC.', 35]],
};
