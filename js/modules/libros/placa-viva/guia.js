// Explicación guiada por paciente: 3-5 pasos que encienden una zona del dibujo. Cada paso: t texto · z zonas · p página · o origen · haz [acción, opciones o repeticiones].
export const GUIAS = {
  flor: ['Florentina · Guillain-Barré', [
    { t: 'El impulso viaja por el axón, cruza la placa, activa la fibra y mueve el pulgar. En el Guillain-Barré la mielina está dañada: pulsa «Único» y mira el destello avanzar a saltos lentos.', z: ['axon'], p: '27:mn-tabla-46-6', o: 'ficha (conducción lenta)', haz: ['estim', { v: 'unico' }], btn: 'Estímulo único' },
    { t: 'Cuando el impulso llega, la placa responde entera y no se fatiga: con el estímulo repetido las diez sacudidas salen iguales.', z: ['barras', 'pulgar'], p: '27:mn-tabla-46-6', o: 'ficha', haz: ['estim', { v: 'rep' }], btn: 'Repetido ×10' },
    { t: 'La Tabla 46.6 enciende su columna: sin debilidad ocular, sin fatiga, reflejos disminuidos, inestabilidad autonómica, conducción lenta y proteínas altas en el LCR.', z: ['tabla'], p: '27:mn-tabla-46-6', o: 'ficha' },
    { t: 'Se intuba con CV ≤15 mL/kg, CV <1 L o PIM −20, sin esperar al extremo. Pasa dos días sin tratar y mira el pulmón.', z: ['pulmon'], p: '25:mn-mg-intubacion', o: 'ficha; −3 puntos de fuerza al día ilustrativo', haz: ['dia', 2], btn: 'Día +1 ×2' }]],
  sera: ['Serapio · miastenia', [
    { t: 'En la miastenia el nervio está sano: lo que falla es la placa, con pocos receptores por los anticuerpos. Abre la lupa.', z: ['placa', 'lupa'], p: '24:mn-mg-anticuerpos', o: 'ficha' },
    { t: 'Con estímulos repetidos la respuesta decae: es la fatiga. Pulsa «Repetido ×10».', z: ['barras'], p: '24:mn-mg-clinica', o: 'ficha; caída ilustrativa', haz: ['estim', { v: 'rep' }], btn: 'Repetido ×10' },
    { t: 'El hielo sobre el ojo cerrado 2 minutos recupera la ptosis (+2 mm es positivo). El mecanismo no lo da Marino.', z: ['barras'], p: '24:mn-mg-hielo', o: 'ficha', haz: ['hielo'], btn: 'Hielo 2 min' },
    { t: 'Un aminoglucósido dificulta la transmisión (Tabla 46.5): la fuerza cae. Pulsa «Gentamicina».', z: ['placa', 'lupa'], p: '24:mn-tabla-46-5', o: 'ficha; caída ilustrativa', haz: ['farm', { v: 'gent' }], btn: 'Gentamicina' }]],
  pnc: ['Polineuropatía del crítico', [
    { t: 'Es una neuropatía axonal difusa, sensitiva y motora, frecuente en la sepsis grave y el shock séptico. El daño está en el axón: mira la lesión marcada.', z: ['axon'], p: '28:mn-pnc-pnc', o: 'ficha' },
    { t: 'Produce parálisis flácida de miembros y tronco, con hiporreflexia o arreflexia. Suele pasar inadvertida hasta que el paciente no se despega del respirador.', z: ['pulgar', 'pulmon'], p: '28:mn-pnc-pnc', o: 'ficha' },
    { t: 'Se confirma con estudios de conducción nerviosa: conducción lenta en fibras sensitivas y motoras. El tratamiento no existe.', z: ['axon', 'barras'], p: '28:mn-pnc-pnc', o: 'ficha', haz: ['estim', { v: 'unico' }], btn: 'Estímulo único' },
    { t: 'Cerca de la mitad se recupera por completo, pero tarda meses. Mientras, no se puede retirar la ventilación.', z: ['pulmon'], p: '29:mn-pnc-manejo', o: 'ficha' }]],
  mcc: ['Miopatía del crítico', [
    { t: 'Es una miopatía inflamatoria difusa de miembros y tronco. El nervio y la placa están sanos: la lesión está en la fibra muscular.', z: ['fibra'], p: '28:mn-pnc-mcc', o: 'ficha' },
    { t: 'Se favorece por sepsis grave, shock séptico, inmovilidad (p. ej. la parálisis con relajantes) e hiperglucemia.', z: ['placa', 'fibra'], p: '28:mn-pnc-mcc', o: 'ficha' },
    { t: 'La electromiografía muestra cambio miopático y la biopsia, pérdida de filamentos de miosina e infiltrado inflamatorio.', z: ['fibra', 'barras'], p: '28:mn-pnc-mcc', o: 'ficha' },
    { t: 'No hay tratamiento; la prevención propuesta (movilización precoz, nutrición) no está validada. Se nota al no poder retirar el respirador.', z: ['pulmon'], p: '29:mn-pnc-manejo', o: 'ficha' }]],
  mel: ['Melquíades · relajante', [
    { t: 'Con K⁺ 6,1 la succinilcolina está contraindicada: sube otros 0,5 mEq/L. Mira el aviso; si la pulsas, sale el sello.', z: ['placa'], p: '30:mn-bnm-contra', o: 'ficha' },
    { t: 'Rocuronio 1 mg/kg tapa los receptores: empieza en 1,5-3 min (al principio el TOF sigue 4/4) y cae a 0/4. Pulsa «Rocuronio» y pasa el reloj.', z: ['pulgar', 'lupa'], p: '29:mn-relajantes', o: 'ficha', haz: ['roc'], btn: 'Rocuronio' },
    { t: 'Si no se intuba, a los 3 minutos dura una hora. Sugammadex 16 mg/kg lo revierte en 2-3 minutos.', z: ['pulgar'], p: '31:mn-bnm-sugammadex', o: 'ficha', haz: ['min', 3], btn: '+10 min ×3' },
    { t: 'En la perfusión el objetivo es 1-2 respuestas del TOF, no 0.', z: ['pulgar'], p: '30:mn-bnm-monitor', o: 'ficha' }]],
};
export function crearGuia({ caja, hacer, cita, setFoco }) {
  let g = null, i = 0;
  const cerrar = () => { caja.hidden = true; g = null; setFoco([]); };
  function paso(k) {
    i = Math.max(0, Math.min(g[1].length - 1, k)); const p = g[1][i]; caja.hidden = false; setFoco(p.z);
    caja.innerHTML = `<h3>${g[0]} · paso ${i + 1} de ${g[1].length}</h3><p class="enun">${p.t} <span class="org">${p.o}</span> ${cita(p.p)}</p><div class="fila-g">${p.haz ? `<button type="button" class="b prim" data-g="haz">Hazlo: ${p.btn}</button>` : ''}<button type="button" data-g="ant" ${i ? '' : 'disabled'}>‹ Anterior</button><button type="button" data-g="sig">${i < g[1].length - 1 ? 'Siguiente ›' : 'Cerrar'}</button></div>`;
  }
  caja.addEventListener('click', (ev) => {
    const b = ev.target.closest('[data-g]'); if (!b || !g) return; const a = b.dataset.g, p = g[1][i];
    if (a === 'ant') paso(i - 1); else if (a === 'sig') { if (i < g[1].length - 1) paso(i + 1); else cerrar(); }
    else if (a === 'haz') { const [acc, op] = p.haz; if (typeof op === 'number') for (let n = 0; n < op; n++) hacer(acc); else hacer(acc, op || {}); setFoco(p.z); }
  });
  // previos: al abrir en el paso k, se hacen antes los «haz» de los pasos 1..k-1 (el modelo queda como si se hubieran hecho)
  return { abrir: (c, k = 0, previos = false) => { if (!GUIAS[c]) return cerrar(); g = GUIAS[c]; if (previos) for (const q of g[1].slice(0, k)) if (q.haz) { const [acc, op] = q.haz; if (typeof op === 'number') for (let n = 0; n < op; n++) hacer(acc); else hacer(acc, op || {}); } paso(k); }, cerrar };
}
