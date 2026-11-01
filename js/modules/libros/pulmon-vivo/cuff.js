// La fuga del cuff y el estridor (estado `fuga-cuff`, Marino cap. 28 pp. 21-22 y cap. 30 pp. 59-60). Funciones puras: de la presión
// del cuff, el edema, el esteroide y el paso (intubado / extubado / 30 min después) salen la fuga, los ajustes del motor, el aviso y el sello.
// Origen: tope 25, fuga = inspirado − espirado, corte de 110 mL, riesgo ×7, metilpred 20 mg/4 h desde 12 h antes, estridor en 30 min: ficha.
// Las fugas por presión, la probabilidad (22 → 3 %), la SpO₂ y el aplanamiento del flujo: ilustrativo.
import * as D from '../../../data/pulmon-vivo-data.js';
const { CUFF, C } = D;
const f0 = (n) => String(Math.round(n));
export const limitar = (p) => Math.max(0, Math.min(CUFF.tope, Math.round(p)));
// Fuga (mL): la que da el cuff a 0, repartida hasta 25 (sin fuga a 25)
export const fuga = (p, edema) => Math.round((edema ? CUFF.fugaEdema0 : CUFF.fuga0) * (1 - limitar(p) / CUFF.tope));
export const estado0 = () => ({ p: CUFF.inicio, edema: false, ester: false, ext: null });
const estridor = (c) => c.ext === '30' && c.edema && !c.ester;

// Todo lo que sale de los mandos: p ya limitada, fuga, ajustes del motor, SpO₂ y el aviso / sello (`pedido` puede pasar de 25)
export function evaluar(c, pedido) {
  const p = limitar(pedido), intub = !c.ext, f = intub ? fuga(p, c.edema) : 0, est = estridor(c), vtI = CUFF.vt;
  const resp = intub ? { modo: 'vcv', vt: vtI, fr: 16, peep: 6, flujo: 60, pmus: 0 }
    : { modo: 'psv', ps: 0, peep: 0, pmus: CUFF.esp.pmus, tin: CUFF.esp.tin[est ? 1 : 0], frEsp: CUFF.esp.fr[est ? 1 : 0], frNeural: CUFF.esp.fr[est ? 1 : 0] };
  const pulmon = { c: 45, r: intub ? 10 : CUFF.esp.r[est ? 1 : 0], rEsp: 10 };
  const lec = { p, fuga: f, vtI, vtE: vtI - f, estridor: est, spo2: CUFF.spo2[est ? 1 : 0] };
  let aviso = null, sello = null;
  const t = `Vt inspirado ${f0(vtI)} − espirado ${f0(lec.vtE)} mL`;
  if (pedido > CUFF.tope) sello = { k: 'cuff-tope', titulo: 'Presión del cuff por encima del tope', texto: `Pides ${f0(pedido)} cmH₂O y el mando se queda en ${CUFF.tope}: por encima, el cuff comprime los capilares de la pared de la tráquea (unos 25 mmHg) y la mucosa se isquemia. A ${CUFF.tope} cmH₂O Benito no tiene fuga (${t}) y la presión no daña la tráquea; el mando no pasa de ahí.`, cita: C.cuffPresion, origen: 'ficha, cap. 28 p. 21-22 (25 mmHg y 25 cmH₂O: nota de fuentes) · fuga: ilustrativo' };
  else if (est) sello = { k: 'estridor', titulo: 'Estridor: reintubar sin demora', texto: `A los 30 min de extubar sin esteroide, Benito tiene estridor inspiratorio: el flujo inspiratorio se aplana, respira a ${CUFF.esp.fr[1]} por minuto con un Vt corto y la SpO₂ cae a ${lec.spo2} %. Marino manda reintubar de inmediato ante signos de fallo: un retraso hace difícil asegurar la vía aérea.`, cita: C.cuffManejo, origen: 'ficha, cap. 30 p. 60 · FR, Vt y SpO₂: ilustrativo' };
  else if (c.ext === '30') aviso = { nivel: 'aviso', titulo: 'Sin estridor a los 30 min', texto: c.edema ? `Con el esteroide dado 12 h antes, el riesgo de edema laríngeo baja de ${CUFF.riesgo[0]} % a ${CUFF.riesgo[1]} % (ilustrativo; Marino: siete veces menos) y Benito respira sin ruido, SpO₂ ${lec.spo2} %.` : `Con la laringe sana la fuga fue grande y Benito respira sin ruido, SpO₂ ${lec.spo2} %.`, cita: C.cuffEster, origen: 'ficha, cap. 30 p. 59-60 · cifras: ilustrativo' };
  else if (c.ext === 'recien') aviso = { nivel: 'aviso', titulo: 'Extubado: vigila 30 minutos', texto: 'El estridor aparece en la mayoría de los casos antes de 30 minutos. Si hubo fuga <110 mL, la ventilación no invasiva va desde el primer momento (no sirve una vez instalado el fallo respiratorio).', cita: C.cuffManejo, origen: 'ficha, cap. 30 p. 59-60' };
  else if (p === 0 && f < CUFF.corte && !c.ester) sello = { k: 'cuff-fuga-baja', titulo: 'Fuga baja: riesgo ×7 de edema laríngeo', texto: `Con el cuff desinflado la fuga es de ${f0(f)} mL (${t}), por debajo de 110: el riesgo de edema tras extubar se multiplica por 7. Marino pide metilprednisolona 20 mg cada 4 h (la primera dosis 12 h antes de extubar) y ventilación no invasiva inmediata al extubar.`, cita: C.cuffRecom, origen: 'ficha, cap. 30 p. 59-60 · 80 mL: ilustrativo' };
  else if (p === 0 && f < CUFF.corte) aviso = { nivel: 'aviso', titulo: 'Fuga baja, con esteroide puesto', texto: `La fuga sigue en ${f0(f)} mL (<110), pero Benito lleva la metilprednisolona desde 12 h antes: extubar con ventilación no invasiva inmediata.`, cita: C.cuffEster, origen: 'ficha, cap. 30 p. 59-60' };
  else if (p === 0) aviso = { nivel: 'aviso', titulo: 'Fuga >110 mL: extubar, nada más', texto: `Con el cuff desinflado la fuga es de ${f0(f)} mL (${t}): por encima de 110 se elimina el riesgo de edema laríngeo con un 95 % de certeza aproximada y no hace falta nada más antes de extubar.`, cita: C.cuffRecom, origen: 'ficha, cap. 30 p. 59 · 200 mL: ilustrativo' };
  else if (p >= CUFF.aviso) aviso = { nivel: 'aviso', titulo: 'Cuff cerca del tope', texto: `${f0(p)} cmH₂O está cerca del límite de ${CUFF.tope}; por encima la mucosa traqueal se isquemia. Fuga: ${f0(f)} mL.`, cita: C.cuffPresion, origen: 'ficha, cap. 28 p. 21 · fuga: ilustrativo' };
  else if (f > 0) aviso = { nivel: 'aviso', titulo: 'Fuga audible: el cuff no sella', texto: `${t} (fuga ${f0(f)} mL). Con el cuff a medias no es la prueba: solo dice que el sello falla. Para la prueba hay que desinflarlo del todo.`, cita: C.cuffFuga, origen: 'ficha, cap. 28 p. 22 · fuga: ilustrativo' };
  return { p, lec, resp, pulmon, aviso, sello };
}
// La lectura del respirador con la fuga: lo espirado es lo inspirado menos lo que se escapa (el motor no modela la fuga)
export function conFuga(l, c) {
  if (!l || c.ext) return l;
  const vtE = Math.max(0, l.vtIns - fuga(c.p, c.edema));
  return { ...l, vtExh: vtE, vm: vtE * (l.frReal || 16) / 1000, fuga: l.vtIns - vtE };
}
// La celda de cifras «Fuga del cuff»
export function celda(c, l, celdaFn) {
  const extub = !!c.ext, f = l?.vtIns != null && !extub ? Math.round(l.vtIns - l.vtExh) : null;
  const cls = extub || c.p !== 0 || f == null ? '' : f > CUFF.corte ? 'si' : 'no';
  return celdaFn('fuga', 'Fuga del cuff', f == null ? '—' : f0(f), extub ? 'sin tubo' : f == null ? 'mL' : `mL · insp. ${f0(l.vtIns)} − esp. ${f0(l.vtExh)}`, cls);
}
// Los mandos del dock: presión del cuff, edema, esteroide y los pasos (desinflar, extubar, esperar, reintubar)
export function mandosHtml(c, desl) {
  const ext = !!c.ext, b = (k, t, s, extra = '') => `<button type="button" class="tog" data-m="${k}"${extra}>${t}<small>${s}</small></button>`;
  let h = `<p class="dock-nota dock-grupo"><b>Benito, día 7</b>: ${ext ? 'extubado, respira solo (sin tubo)' : 'intubado, en volumen control (410 mL)'}</p>`;
  h += desl('cuff', 'Presión del cuff', c.p, 0, CUFF.max, 1, 'cmH₂O', `tope ${CUFF.tope} (Marino cap. 28 p. 21-22: isquemia de la mucosa) · la fuga por presión: ilustrativo`);
  h += `<div class="rejilla" style="--n:2"><button type="button" class="tog" data-m="edema" aria-pressed="${c.edema}"${ext ? ' disabled' : ''}>Edema laríngeo<small>${c.edema ? 'sí' : 'no'}</small></button><button type="button" class="tog" data-m="ester" aria-pressed="${c.ester}"${ext ? ' disabled' : ''}>Metilpred. 12 h antes<small>20 mg cada 4 h (cap. 30 p. 59)</small></button></div>`;
  h += `<div class="rejilla" style="--n:2">${b('apagar', 'Desinflar el cuff', 'a 0: mide la fuga', ext ? ' disabled' : '')}${b('extubar', 'Extubar', 'solo con el cuff a 0', ext || c.p !== 0 ? ' disabled' : '')}</div>`;
  h += `<div class="rejilla" style="--n:2">${b('esperar', 'Dejar pasar 30 min', 'busca el estridor', c.ext !== 'recien' ? ' disabled' : '')}${b('reintubar', 'Reintubar', 'vuelve al respirador', ext ? '' : ' disabled')}</div>`;
  return h;
}
