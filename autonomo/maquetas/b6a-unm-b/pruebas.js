// Apuesta, «encuentra el error» y caso. Las respuestas viven aquí, no en el HTML. Cada opción falsa dice qué le pasaría al paciente.
export const APUESTA = {
  preset: 'flor', titulo: 'Apuesta antes de tocar',
  antes: 'Florentina, 52 años: debilidad simétrica desde hace 2 semanas, tras una diarrea. No tiene ptosis y los reflejos están ausentes.',
  pregunta: '¿Dónde está la lesión y qué verás en la conducción y el LCR?',
  ops: [
    { t: 'En la mielina del nervio: conducción lenta, proteínas altas en el LCR y reflejos disminuidos.', ok: true, por: 'Es el Guillain-Barré: Tabla 46.6. Pulsa el estímulo y mira el destello avanzar a saltos (p. 27).' },
    { t: 'En la placa motora, por anticuerpos contra los receptores: conducción normal, LCR normal y fatiga con el esfuerzo repetido.', ok: false, por: 'Sería una miastenia: tendría ptosis y fatiga, y los reflejos estarían conservados. Con arreflexia y sin ojo afectado el tratamiento sería otro (p. 24, 27).' },
    { t: 'En el músculo, por una miopatía, con conducción normal, LCR normal y reflejos conservados.', ok: false, por: 'La miopatía del crítico se ve en pacientes ventilados con sepsis o relajantes, no tras una diarrea; y no explica la conducción lenta (p. 27-28).' },
  ], orden: [2, 0, 1], tras: (a) => a.hacer('estim', { v: 'unico' }),
};
export const ERROR = {
  preset: 'flor', titulo: 'Encuentra el error (hay 0, 1 o 2)',
  antes: 'Florentina, Guillain-Barré, 60 kg. Plan del R1: juzga cada línea.',
  frases: [
    { t: 'CV 900 mL (15 mL/kg) → BiPAP y reevaluar mañana.', error: true, por: 'Error: con CV ≤15 mL/kg o <1 L se piensa en intubar; la BiPAP solo vale si mejora en días (p. 25, 27).' },
    { t: 'IgIV 2 g/kg repartidos en 5 días.', error: false, por: 'Cierto: IgIV o plasmaféresis sin preferencia (p. 27).' },
    { t: 'Gabapentina 300 mg cada 8 horas para el dolor neuropático.', error: false, por: 'Cierto (p. 28).' },
    { t: 'Reflejos ausentes y proteínas altas en el LCR apoyan el diagnóstico.', error: false, por: 'Cierto: Tabla 46.6 (p. 27).' },
    { t: 'Prueba del hielo para confirmar el diagnóstico.', error: true, por: 'Error: el hielo es de la miastenia; el Guillain-Barré no tiene debilidad ocular (p. 24-25, 27).' }],
};
export const CASO = {
  preset: 'flor', titulo: 'Florentina, 52 años · del Guillain-Barré a la UCI',
  pasos: [
    { enun: 'Dos semanas tras una diarrea por Campylobacter: debilidad simétrica ascendente, arreflexia, sin ptosis. CV 1.100 mL (60 kg), PIM −26. ¿Qué haces con la respiración?', orden: [0, 1, 2],
      ops: [{ t: 'Intubar ya: el Guillain-Barré obliga a ventilar a todo paciente desde el primer día de la debilidad.', ok: false, por: 'Con 18 mL/kg y más de 1 L aún no se cumple ningún criterio; intubarla sin necesidad la expone a la ventilación (p. 25).' },
        { t: 'Medir CV y PIM cada pocas horas e intubar si cae de 15 mL/kg, de 1 L o a PIM −20.', ok: true, por: 'Es la regla de Marino para la debilidad neuromuscular (p. 25, 27).', haz: (a) => a.hacer('est', { v: 'gbs' }) },
        { t: 'Piridostigmina para mejorar la fuerza respiratoria.', ok: false, por: 'Es un tratamiento de la miastenia y aumenta las secreciones; no corrige la desmielinización (p. 26-27).' }] },
    { enun: 'Dos días después, CV 850 mL. ¿Qué haces?', orden: [2, 0, 1],
      ops: [{ t: 'BiPAP y reevaluar en 24 horas.', ok: false, por: 'La BiPAP solo vale si hay mejoría en días; con CV <1 L y en bajada, el cansancio ventilatorio llega antes (p. 25, 27).', haz: (a) => a.hacer('dia', { v: 2 }) },
        { t: 'Esperar a que la PaCO₂ suba y aparezcan signos de agotamiento antes de decidir.', ok: false, por: 'Marino insiste en no esperar a la insuficiencia respiratoria extrema (p. 25).', haz: (a) => a.hacer('dia', { v: 2 }) },
        { t: 'Intubar: la CV es menor de 1 L, unos 14 mL/kg.', ok: true, por: 'Cumple el criterio y no hay mejoría que justifique la BiPAP (p. 25, 27).', haz: (a) => a.hacer('dia', { v: 2 }) }] },
    { enun: '¿Qué tratamiento específico pautas?', orden: [1, 2, 0],
      ops: [{ t: 'IgIV 2 g/kg en 5 días, o plasmaféresis: sin preferencia.', ok: true, por: 'Marino no prefiere una a otra en el Guillain-Barré (p. 27).', haz: (a) => a.hacer('igiv') },
        { t: 'Plasmaféresis solo si la IgIV falla; la IgIV siempre primero.', ok: false, por: 'Marino no establece ese orden en el Guillain-Barré; retrasar una de las dos opciones sin base alarga la progresión (p. 27).' },
        { t: 'Ninguno: se resuelve solo en el 80 %.', ok: false, por: 'Se resuelve solo en cerca del 80 % pero con secuelas; con fracaso respiratorio hay que tratar (p. 27).' }] },
    { enun: 'Día 4: la FC va de 40 a 140 y la PA de 80/40 a 190/100. ¿Qué es?', orden: [0, 2, 1],
      ops: [{ t: 'Una crisis miasténica sobreañadida.', ok: false, por: 'La inestabilidad autonómica distingue al Guillain-Barré de la miastenia (Tabla 46.6, p. 27).', haz: (a) => a.hacer('dia', { v: 4 }) },
        { t: 'Inestabilidad autonómica propia del Guillain-Barré.', ok: true, por: 'Está en la Tabla 46.6 (p. 27) y en el monitor se ve oscilar.', haz: (a) => a.hacer('dia', { v: 4 }) },
        { t: 'Un efecto adverso de la IgIV que obliga a pararla y cambiar a plasmaféresis.', ok: false, por: 'La inestabilidad autonómica es una característica de la enfermedad, no del tratamiento (p. 27).', haz: (a) => a.hacer('dia', { v: 4 }) }] },
    { enun: 'Día 20: no se desteta y tiene una sepsis por catéter. ¿Qué añade la sepsis?', orden: [0, 2, 1],
      ops: [{ t: 'Otra dosis de IgIV, porque el Guillain-Barré recayó.', ok: false, por: 'Una debilidad que sigue días después, con sepsis, apunta a polineuropatía o miopatía del crítico, que no se trata con IgIV (p. 28).', haz: (a) => a.hacer('est', { v: 'pnc' }) },
        { t: 'Cinco sesiones de plasmaféresis, por si hay una recaída.', ok: false, por: 'No hay tratamiento para ese cuadro: se espera y se rehabilita (p. 28).', haz: (a) => a.hacer('est', { v: 'pnc' }) },
        { t: 'Posible polineuropatía del enfermo crítico: sin tratamiento, y la mitad recupera en meses.', ok: true, por: 'PNC axonal sensitivo-motora de la sepsis; el mando de tratamiento se apaga (p. 28).', haz: (a) => a.hacer('est', { v: 'pnc' }) }] },
  ],
};
export const LLEVAS = {
  apuesta: [['Guillain-Barré: mielina, conducción lenta y proteínas altas en el LCR.', '27:mn-tabla-46-6'], ['Miastenia: placa, fatiga y reflejos conservados.', '24:mn-mg-anticuerpos']],
  error: [['Con CV ≤15 mL/kg o <1 L se piensa en intubar, no en BiPAP.', '25:mn-mg-intubacion'], ['El hielo es de la miastenia, no del Guillain-Barré.', '24:mn-mg-hielo']],
  caso: [['Intubar sin esperar al extremo: CV ≤15 mL/kg, <1 L o PIM −20.', '25:mn-mg-intubacion'], ['IgIV o plasmaféresis, sin preferencia.', '27:mn-gbs-tratamiento'], ['Inestabilidad autonómica: del Guillain-Barré.', '27:mn-tabla-46-6'], ['Polineuropatía del crítico: sin tratamiento.', '28:mn-pnc-manejo']],
};
export function opciones(caja, ops, alResponder, orden0) {
  caja.textContent = ''; const orden = orden0 || ops.map((o, i) => i); delete caja.dataset.hecho;
  for (const i of orden) {
    const b = document.createElement('button'); b.type = 'button'; b.className = 'op'; b.textContent = ops[i].t;
    b.addEventListener('click', () => {
      if (caja.dataset.hecho) return; caja.dataset.hecho = '1';
      [...caja.querySelectorAll('.op')].forEach((x, j) => { x.disabled = true; x.classList.add(ops[orden[j]].ok ? 'bien' : (x === b ? 'mal' : 'neutra')); });
      const p = document.createElement('p'); p.className = 'por ' + (ops[i].ok ? 'ok' : 'no'); p.textContent = (ops[i].ok ? 'Bien. ' : 'No. ') + ops[i].por; caja.append(p);
      alResponder(ops[i], i);
    });
    caja.append(b);
  }
}
