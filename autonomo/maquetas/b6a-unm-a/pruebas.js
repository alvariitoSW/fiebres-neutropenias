// Apuesta, «encuentra el error» y caso. Las respuestas viven aquí, no en el HTML. Cada opción falsa dice qué le pasaría al paciente.
export const APUESTA = {
  preset: 'mel', titulo: 'Apuesta antes de tocar',
  antes: 'Melquíades, 62 años, peso ideal 70 kg, K⁺ 6,1. Urgente: rocuronio 1 mg/kg (70 mg). Cormack 4: no se consigue intubar.',
  pregunta: '¿Qué pasa si esperas y qué das, a qué dosis?',
  ops: [
    { t: 'Despierta en unos 10 minutos: el rocuronio es corto y basta con ventilarlo con mascarilla.', ok: false, por: 'Dura 50-70 min (Tabla 46.7): sin vía aérea queda apneico una hora, desatura y entra en parada hipóxica (p. 29-30).' },
    { t: 'Queda apneico casi una hora: sugammadex 16 mg/kg (1.120 mg), que lo revierte en 2-3 min.', ok: true, por: 'Justo tras la intubación la dosis es 16 mg/kg, sin efecto colinérgico (p. 30-31).' },
    { t: 'Neostigmina 70 µg/kg, igual de rápida.', ok: false, por: 'Tarda 8-45 min y solo revierte un bloqueo moderado: sigue apneico y desatura (p. 31).' }],
  orden: [0, 1, 2], tras: (a) => { a.hacer('roc'); a.hacer('roc'); a.hacer('t', { v: 5 }); },
};
export const ERROR = {
  preset: 'sera', titulo: 'Encuentra el error (hay 0, 1 o 2)',
  antes: 'Serapio, miastenia, neumonía. CV 1.260 mL (18 mL/kg) y PIM −30. El R1 escribe la orden: juzga cada línea.',
  frases: [
    { t: 'Neumonía: se añade gentamicina al tratamiento.', error: true, por: 'Error: los aminoglucósidos están en la Tabla 46.5 de fármacos que empeoran la miastenia; la fuerza cae y puede llevar a la intubación (p. 24).' },
    { t: 'Aún no cumple criterio de intubar: se vigilan la CV y la PIM de cerca.', error: false, por: 'Cierto: se intuba con CV ≤15 mL/kg (o <1 L) o PIM −20; aquí hay 18 mL/kg y −30, pero sin esperar al in extremis (p. 25).' },
    { t: 'Piridostigmina para mejorar la fuerza mientras respira bien.', error: false, por: 'Cierto: solo se evita en el fracaso respiratorio por las secreciones; aquí no lo hay (p. 26).' },
    { t: 'Si empeora, plasmaféresis antes que inmunoglobulina.', error: false, por: 'Cierto: la plasmaféresis actúa antes (IgIV tarda 4-5 días) (p. 26).' }],
};
export const CASO = {
  preset: 'mel', titulo: 'Melquíades, 62 años · intubación urgente y relajación',
  pasos: [
    { enun: 'Intubación urgente. K⁺ 6,1 mEq/L, sin vía aérea. ¿Qué relajante eliges?', orden: [0, 1, 2],
      ops: [{ t: 'Succinilcolina 1 mg/kg, la más rápida.', ok: false, por: 'Contraindicada con hiperpotasemia: suma +0,5 mEq/L de K⁺ y puede dar una arritmia mortal (p. 30).', haz: (a) => a.hacer('suc') },
        { t: 'Rocuronio 1 mg/kg (70 mg) de peso ideal, sin contraindicaciones.', ok: true, por: 'Actúa en 1,5-3 min y no tiene contraindicaciones (Tabla 46.7, p. 29-30).', haz: (a) => { a.hacer('roc'); a.hacer('roc'); } },
        { t: 'Cisatracurio 0,15 mg/kg, ideal porque no tiene contraindicaciones ni usa riñón.', ok: false, por: 'Tarda 5-7 min en actuar: en una urgencia el paciente sigue sin vía aérea (p. 29).', haz: (a) => { for (let i = 0; i < 3; i++) a.hacer('cis'); } }] },
    { enun: 'Cormack 4: no se intuba y la SpO₂ es 86 %. ¿Qué haces?', orden: [0, 1, 2],
      ops: [{ t: 'Esperar ventilando con mascarilla a que pase.', ok: false, por: 'El bloqueo dura 50-70 min y la hipoxemia no espera (p. 29-30).' },
        { t: 'Neostigmina 70 µg/kg, que revierte igual de bien un bloqueo recién puesto y es más barata.', ok: false, por: 'Solo revierte un bloqueo moderado y tarda 8-45 min: el paciente sigue apneico y desatura (p. 31).', haz: (a) => { a.hacer('neo'); a.hacer('neo'); } },
        { t: 'Sugammadex 16 mg/kg (1.120 mg), el que revierte el rocuronio recién puesto.', ok: true, por: 'Tras el rocuronio, 16 mg/kg revierte en 2-3 min sin efecto colinérgico: respira (p. 31).', haz: (a) => { a.hacer('sug', { v: 16 }); a.hacer('t', { v: 3 }); } }] },
    { enun: 'Se intuba con fibroscopio. SDRA: relajación con cisatracurio 0,15 mg/kg y perfusión de 1-3 µg/kg/min. ¿Qué TOF buscas?', orden: [0, 1, 2],
      ops: [{ t: '1-2 respuestas de 4, ajustando la perfusión a ese punto final.', ok: true, por: 'La perfusión se ajusta a ese punto final (p. 30); el cisatracurio no depende de riñón ni hígado (p. 29).', haz: (a) => { a.hacer('via', { v: true }); for (let i = 0; i < 3; i++) a.hacer('cis'); a.hacer('perf', { v: 2 }); a.hacer('t', { v: 10 }); } },
        { t: '0 de 4 respuestas, para que no se mueva nada.', ok: false, por: 'Es un bloqueo excesivo y más paralizado de lo necesario: el objetivo son 1-2 respuestas (p. 30).', haz: (a) => { a.hacer('via', { v: true }); for (let i = 0; i < 3; i++) a.hacer('cis'); a.hacer('perf', { v: 3 }); a.hacer('t', { v: 10 }); } },
        { t: '4 de 4 respuestas: queda un margen de seguridad.', ok: false, por: 'Con 4 de 4 no hay bloqueo útil: el paciente sigue luchando con el respirador (p. 30).', haz: (a) => { a.hacer('via', { v: true }); a.hacer('perf', { v: 0 }); } }] },
    { enun: 'Día 4: abre los ojos bajo el relajante, TOF 1/4. ¿Qué falta?', orden: [0, 1, 2],
      ops: [{ t: 'Subir la perfusión de relajante hasta TOF 0.', ok: false, por: 'Sigue despierto y paralizado, con más complicaciones y sin poder valorarlo sin EEG (p. 31).', haz: (a) => a.hacer('t', { v: 5760 }) },
        { t: 'Sedación profunda y analgesia, siempre.', ok: true, por: 'Es horrible y doloroso estar despierto y paralizado, y sin EEG no se evalúa la sedación (p. 31).', haz: (a) => { a.hacer('t', { v: 5760 }); a.hacer('sed', { v: true }); } },
        { t: 'Nada: abrir los ojos bajo el relajante es un reflejo del tronco.', ok: false, por: 'Abrir los ojos bajo el relajante indica sedación insuficiente (p. 31).', haz: (a) => a.hacer('t', { v: 5760 }) }] },
    { enun: 'Día 9: al retirar el relajante sigue flácido y con hiporreflexia. ¿Qué es?', orden: [0, 1, 2],
      ops: [{ t: 'Una miastenia gravis: anticuerpos contra el receptor, como en Serapio.', ok: false, por: 'En la miastenia hay fatiga y ptosis, con reflejos conservados; aquí la lesión no está en la placa (p. 24, 28).' },
        { t: 'Sugammadex residual: se repite 16 mg/kg.', ok: false, por: 'El cisatracurio no se revierte con sugammadex: solo aminoesteroides (p. 31).', haz: (a) => a.hacer('sug', { v: 16 }) },
        { t: 'Miopatía del crítico: inflamación, inmovilidad y corticoides.', ok: true, por: 'Flácida con hiporreflexia, sin tratamiento; el 50 % recupera en meses (p. 28, 31).', haz: (a) => { a.hacer('perf', { v: 0 }); a.hacer('t', { v: 4320 }); } }] },
  ],
};
export const LLEVAS = {
  apuesta: [['Rocuronio = apnea de 50-70 min; justo después, sugammadex 16 mg/kg (2-3 min).', '31:mn-bnm-sugammadex'], ['La neostigmina tarda 8-45 min y no pasa de 70 µg/kg.', '31:mn-bnm-neostigmina']],
  error: [['Aminoglucósidos y magnesio empeoran la miastenia (Tabla 46.5).', '24:mn-mg-farmaco'], ['Intubar con CV ≤15 mL/kg, <1 L o PIM −20; piridostigmina no en el fracaso respiratorio.', '25:mn-mg-intubacion']],
  caso: [['Con K⁺ alto, nunca succinilcolina; rocuronio 1 mg/kg, y sugammadex 16/4/2 mg/kg según profundidad.', '30:mn-bnm-contra'], ['TOF 1-2 respuestas y nunca paralizado sin sedación y analgesia.', '30:mn-bnm-monitor'], ['Flácido tras relajar: miopatía del crítico.', '28:mn-pnc-mcc']],
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
