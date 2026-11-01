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
    { enun: 'Dos semanas tras una diarrea por Campylobacter: debilidad simétrica ascendente, arreflexia, sin ptosis. CV 1.092 mL (18,2 mL/kg; 60 kg), PIM −26. ¿Qué haces con la respiración?', orden: [0, 1, 2],
      ops: [{ t: 'Intubar ya: el Guillain-Barré obliga a ventilar a todo paciente desde el primer día de la debilidad.', ok: false, por: 'Con 18 mL/kg y más de 1 L aún no se cumple ningún criterio; intubarla sin necesidad la expone a la ventilación (p. 25).' },
        { t: 'Medir CV y PIM de forma seriada e intubar si cae de 15 mL/kg, de 1 L o a PIM −20.', ok: true, por: 'Es la regla de Marino para la debilidad neuromuscular (p. 25, 27).', haz: (a) => a.hacer('est', { v: 'gbs' }) },
        { t: 'Piridostigmina para mejorar la fuerza respiratoria.', ok: false, por: 'Es un tratamiento de la miastenia y aumenta las secreciones; no corrige la desmielinización (p. 26-27).' }] },
    { enun: 'Dos días después, CV 840 mL (14 mL/kg), PIM −20. ¿Qué haces?', orden: [2, 0, 1],
      ops: [{ t: 'BiPAP y reevaluar en 24 horas.', ok: false, por: 'La BiPAP solo vale si hay mejoría en días; con CV <1 L y en bajada, el cansancio ventilatorio llega antes (p. 25, 27).', haz: (a) => a.hacer('dia', { v: 2 }) },
        { t: 'Esperar a que la PaCO₂ suba y aparezcan signos de agotamiento antes de decidir.', ok: false, por: 'Marino insiste en no esperar a la insuficiencia respiratoria extrema (p. 25).', haz: (a) => a.hacer('dia', { v: 2 }) },
        { t: 'Intubar: la CV es menor de 1 L, 14 mL/kg.', ok: true, por: 'Cumple el criterio y no hay mejoría que justifique la BiPAP (p. 25, 27).', haz: (a) => { a.hacer('dia', { v: 2 }); a.hacer('via'); } }] },
    { enun: '¿Qué tratamiento específico pautas?', orden: [1, 2, 0],
      ops: [{ t: 'IgIV 2 g/kg en 5 días, o plasmaféresis: sin preferencia.', ok: true, por: 'Marino no prefiere una a otra en el Guillain-Barré (p. 27).', haz: (a) => a.hacer('igiv') },
        { t: 'Plasmaféresis solo si la IgIV falla; la IgIV siempre primero.', ok: false, por: 'Marino no establece ese orden en el Guillain-Barré; por eso no hay base en Marino para ponerlas en orden (p. 27).' },
        { t: 'Ninguno: se resuelve solo en el 80 %.', ok: false, por: 'Se resuelve solo en cerca del 80 % pero con secuelas; con fracaso respiratorio hay que tratar (p. 27).' }] },
    { enun: 'Día 4: FC 132 y PA 80/40; el día anterior eran FC 48 y PA 190/100 (cifras ilustrativas). ¿Qué es?', orden: [0, 2, 1],
      ops: [{ t: 'Una crisis miasténica sobreañadida.', ok: false, por: 'La inestabilidad autonómica distingue al Guillain-Barré de la miastenia (Tabla 46.6, p. 27).', haz: (a) => a.hacer('dia', { v: 4 }) },
        { t: 'Inestabilidad autonómica propia del Guillain-Barré.', ok: true, por: 'Está en la Tabla 46.6 (p. 27) y en el monitor se ve oscilar.', haz: (a) => a.hacer('dia', { v: 4 }) },
        { t: 'Un efecto adverso de la IgIV que obliga a pararla y cambiar a plasmaféresis.', ok: false, por: 'La inestabilidad autonómica figura en la Tabla 46.6 como rasgo del Guillain-Barré (p. 27); Marino no la atribuye a la IgIV.', haz: (a) => a.hacer('dia', { v: 4 }) }] },
    { enun: 'Día 20: no se desteta y tiene una sepsis por catéter. ¿Qué añade la sepsis?', orden: [0, 2, 1],
      ops: [{ t: 'Otra dosis de IgIV, porque el Guillain-Barré recayó.', ok: false, por: 'Una debilidad que sigue días después, con sepsis, apunta a polineuropatía o miopatía del crítico, que no se trata con IgIV (p. 28).', haz: (a) => a.hacer('est', { v: 'pnc' }) },
        { t: 'Cinco sesiones de plasmaféresis, por si hay una recaída.', ok: false, por: 'No hay tratamiento para ese cuadro: se espera y se rehabilita (p. 28).', haz: (a) => a.hacer('est', { v: 'pnc' }) },
        { t: 'Posible polineuropatía del enfermo crítico: sin tratamiento, y la mitad recupera en meses.', ok: true, por: 'PNC axonal sensitivo-motora de la sepsis; el mando de tratamiento se apaga (p. 28); la mitad recupera en meses (p. 29).', haz: (a) => a.hacer('est', { v: 'pnc' }) }] },
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
// ---- Segundo juego de pruebas (de la opción A, pasado al motor de B): Melquíades y Serapio. a = { hacer, poner, via } de pagina.js.
export const APUESTA2 = {
  preset: 'mel', titulo: 'Apuesta antes de tocar · Melquíades',
  antes: 'Melquíades, 62 años, peso ideal 70 kg, K⁺ 6,1. Urgente: rocuronio 1 mg/kg (70 mg). Cormack 4: no se consigue intubar.',
  pregunta: '¿Qué pasa si esperas y qué das, a qué dosis?',
  ops: [
    { t: 'Despierta en unos 10 minutos: el rocuronio es corto y basta con ventilarlo con mascarilla.', ok: false, por: 'Dura 50-70 min (Tabla 46.7): sin vía aérea queda apneico una hora, desatura y entra en parada hipóxica (p. 29-30).' },
    { t: 'Queda apneico casi una hora: sugammadex 16 mg/kg (1.120 mg), que lo revierte en 2-3 min.', ok: true, por: 'Justo tras la intubación la dosis es 16 mg/kg, sin efecto colinérgico (p. 30-31).' },
    { t: 'Neostigmina 70 µg/kg, igual de rápida.', ok: false, por: 'Tarda 8-45 min y solo revierte un bloqueo moderado: sigue apneico y desatura (p. 31).' }],
  orden: [0, 1, 2], tras: (a) => { a.hacer('roc'); a.poner({ min: 5 }); },
};
export const ERROR2 = {
  preset: 'sera', titulo: 'Encuentra el error (hay 0, 1 o 2) · Serapio',
  antes: 'Serapio, miastenia, neumonía. CV 1.260 mL (18 mL/kg) y PIM −30. El R1 escribe la orden: juzga cada línea.',
  frases: [
    { t: 'Neumonía: se añade gentamicina al tratamiento.', error: true, por: 'Error: los aminoglucósidos están en la Tabla 46.5 de fármacos que empeoran la miastenia; la fuerza cae y puede llevar a la intubación (p. 24).' },
    { t: 'Aún no cumple criterio de intubar: se vigilan la CV y la PIM de cerca.', error: false, por: 'Cierto: se intuba con CV ≤15 mL/kg (o <1 L) o PIM −20; aquí hay 18 mL/kg y −30, pero sin esperar al in extremis (p. 25).' },
    { t: 'Piridostigmina para mejorar la fuerza mientras respira bien.', error: false, por: 'Cierto: solo se evita en el fracaso respiratorio por las secreciones; aquí no lo hay (p. 26).' },
    { t: 'Si empeora, plasmaféresis antes que inmunoglobulina.', error: false, por: 'Cierto: la plasmaféresis actúa antes (IgIV tarda 4-5 días) (p. 26).' }],
};
export const CASO2 = {
  preset: 'mel', titulo: 'Melquíades, 62 años · intubación urgente y relajación',
  pasos: [
    { enun: 'Intubación urgente. K⁺ 6,1 mEq/L, sin vía aérea. ¿Qué relajante eliges?', orden: [0, 1, 2],
      ops: [{ t: 'Succinilcolina 1 mg/kg, la más rápida.', ok: false, por: 'Contraindicada con hiperpotasemia: suma +0,5 mEq/L de K⁺ y puede dar una arritmia mortal (p. 30).', haz: (a) => a.hacer('succi') },
        { t: 'Rocuronio 1 mg/kg (70 mg) de peso ideal, sin contraindicaciones.', ok: true, por: 'Actúa en 1,5-3 min y no tiene contraindicaciones (Tabla 46.7, p. 29-30).', haz: (a) => a.hacer('roc') },
        { t: 'Cisatracurio 0,15 mg/kg, ideal porque no tiene contraindicaciones ni usa riñón.', ok: false, por: 'Tarda 5-7 min en actuar: en una urgencia el paciente sigue sin vía aérea (p. 29).', haz: (a) => a.hacer('cis') }] },
    { enun: 'Cormack 4: no se intuba y la SpO₂ es 86 %. ¿Qué haces?', orden: [0, 1, 2],
      ops: [{ t: 'Esperar ventilando con mascarilla a que pase.', ok: false, por: 'El bloqueo dura 50-70 min y la hipoxemia no espera (p. 29-30).', haz: (a) => a.poner({ min: 20 }) },
        { t: 'Neostigmina 70 µg/kg, que revierte igual de bien un bloqueo recién puesto y es más barata.', ok: false, por: 'Solo revierte un bloqueo moderado y tarda 8-45 min: el paciente sigue apneico y desatura (p. 31).', haz: (a) => { a.poner({ min: 3 }); a.hacer('neo'); a.hacer('neo'); } },
        { t: 'Sugammadex 16 mg/kg (1.120 mg), el que revierte el rocuronio recién puesto.', ok: true, por: 'Tras el rocuronio, 16 mg/kg revierte en 2-3 min sin efecto colinérgico: respira (p. 31).', haz: (a) => { a.poner({ min: 1 }); a.hacer('sug', { v: 16 }); } }] },
    { enun: 'Se intuba con fibroscopio. SDRA: relajación con cisatracurio 0,15 mg/kg y perfusión de 1-3 µg/kg/min. ¿Qué TOF buscas?', orden: [0, 1, 2],
      ops: [{ t: '1-2 respuestas de 4, ajustando la perfusión a ese punto final.', ok: true, por: 'La perfusión se ajusta a ese punto final (p. 30); el cisatracurio no depende de riñón ni hígado (p. 29).', haz: (a) => { a.via(); a.hacer('cis'); a.hacer('perfMas'); a.hacer('perfMas'); a.poner({ min: 60 }); } },
        { t: '0 de 4 respuestas, para que no se mueva nada.', ok: false, por: 'Es un bloqueo excesivo y más paralizado de lo necesario: el objetivo son 1-2 respuestas (p. 30).', haz: (a) => { a.via(); a.hacer('cis'); for (let i = 0; i < 3; i++) a.hacer('perfMas'); a.poner({ min: 60 }); } },
        { t: '4 de 4 respuestas: queda un margen de seguridad.', ok: false, por: 'Con 4 de 4 no hay bloqueo útil: el paciente sigue luchando con el respirador (p. 30).', haz: (a) => { a.via(); } }] },
    { enun: 'Día 4: abre los ojos bajo el relajante, TOF 1/4. ¿Qué falta?', orden: [0, 1, 2],
      ops: [{ t: 'Subir la perfusión de relajante hasta TOF 0.', ok: false, por: 'Sigue despierto y paralizado, con más complicaciones y sin poder valorarlo sin EEG (p. 31).', haz: (a) => a.poner({ min: 5760 }) },
        { t: 'Sedación profunda y analgesia, siempre.', ok: true, por: 'Es horrible y doloroso estar despierto y paralizado, y sin EEG no se evalúa la sedación (p. 31).', haz: (a) => a.poner({ min: 5760 }) },
        { t: 'Nada: abrir los ojos bajo el relajante es un reflejo del tronco.', ok: false, por: 'Marino describe al paciente despierto y paralizado y pide sedación profunda con analgesia (p. 31); que abrir los ojos signifique poca sedación es inferencia del autor.', haz: (a) => a.poner({ min: 5760 }) }] },
    { enun: 'Día 9: al retirar el relajante, tras días de sepsis y corticoides, sigue flácido, con hiporreflexia y con la sensibilidad conservada. ¿Qué es?', orden: [0, 1, 2],
      ops: [{ t: 'Una miastenia gravis: anticuerpos contra el receptor, como en Serapio.', ok: false, por: 'En la miastenia hay fatiga y ptosis, con reflejos conservados; aquí la lesión no está en la placa (p. 24, 28).' },
        { t: 'Sugammadex residual: se repite 16 mg/kg.', ok: false, por: 'El cisatracurio no se revierte con sugammadex: solo aminoesteroides (p. 31).', haz: (a) => a.hacer('sug', { v: 16 }) },
        { t: 'Miopatía del crítico: inflamación e inmovilidad tras días de relajante.', ok: true, por: 'Debilidad flácida con la sensibilidad conservada apunta a la fibra muscular (la polineuropatía es sensitivo-motora, p. 28); en la práctica suelen coexistir y no se distinguen sin neurofisiología (p. 28). Sin tratamiento; la mitad recupera en meses (p. 29).', haz: (a) => a.hacer('est', { v: 'mcc' }) }] },
  ],
};
LLEVAS.apuesta2 = [['Rocuronio = apnea de 50-70 min; justo después, sugammadex 16 mg/kg (2-3 min).', '31:mn-bnm-sugammadex'], ['La neostigmina tarda 8-45 min y no pasa de 70 µg/kg.', '31:mn-bnm-neostigmina']];
LLEVAS.error2 = [['Aminoglucósidos y magnesio empeoran la miastenia (Tabla 46.5).', '24:mn-mg-farmaco'], ['Intubar con CV ≤15 mL/kg, <1 L o PIM −20; piridostigmina no en el fracaso respiratorio.', '25:mn-mg-intubacion']];
LLEVAS.caso2 = [['Con K⁺ alto, nunca succinilcolina; rocuronio 1 mg/kg, y sugammadex 16/4/2 mg/kg según profundidad.', '30:mn-bnm-contra'], ['TOF 1-2 respuestas y nunca paralizado sin sedación y analgesia.', '30:mn-bnm-monitor'], ['Flácido tras relajar: miopatía del crítico.', '28:mn-pnc-mcc']];
