// La posición prono (estado `prono`, Marino cap. 24 pp. 43-45). Funciones puras para el mando de horas y la posición, y el
// dibujo de las dos mitades del racimo (dorsal / ventral). Origen: indicación, ≥16 h, evaluación a las 4 h y contraindicaciones
// absolutas: ficha. Compliance, P/F y alvéolos que se airean por hora: ilustrativo (la ficha solo dice «aumenta la distensibilidad»).
import * as D from '../../../data/pulmon-vivo-data.js';
const { PRONO, C } = D;
const f0 = (n) => String(Math.round(n));
export const limitarHoras = (h) => Math.max(0, Math.min(PRONO.tope, Math.round(h)));
// Todo lo que cambia con las horas: `post` = vuelto a supino y esperado 4 h (la mejoría que persiste)
export function lectura(h, post = false) {
  const x = limitarHoras(h) / PRONO.tope, k = post ? PRONO.persiste : 1, q = x * k;
  const pf = Math.round(PRONO.pf[0] + (PRONO.pf[1] - PRONO.pf[0]) * q), c = Math.round((PRONO.c[0] + (PRONO.c[1] - PRONO.c[0]) * q) * 10) / 10;
  return { h: limitarHoras(h), post, prono: h > 0 && !post, c, pf, pao2: Math.round(pf * PRONO.fio2 / 100), cons: Math.round(PRONO.alvCons * (1 - q)) };
}
export function avisoHoras(lec) {
  if (!lec.prono || lec.h >= PRONO.tope) return null;
  return { nivel: 'aviso', titulo: 'Menos de 16 h', texto: `${lec.h} h es menos de lo que aconseja Marino para un paciente ventilado: al menos 16 h al día. Con ${lec.h} h el P/F de Isidro está en ${lec.pf} y la compliance del pulmón sube a ${String(lec.c).replace('.', ',')} (ilustrativo).`, cita: C.pronoComo, origen: 'ficha, cap. 24 p. 45 · P/F y compliance: ilustrativo' };
}
export function selloHoras(pedido, lec) {
  return { k: 'prono-tope', titulo: 'El mando termina en 16 h', texto: `Pides ${f0(pedido)} h y el mando llega a ${PRONO.tope}, el mínimo diario que aconseja Marino con ventilación mecánica. La fuente no da un máximo ni dice que más horas mejoren la oxigenación: a ${PRONO.tope} h Isidro está en P/F ${lec.pf} (PaO₂ ${lec.pao2} con FiO₂ ${PRONO.fio2} %) y compliance ${String(lec.c).replace('.', ',')} mL/cmH₂O; las complicaciones de estar boca abajo (úlceras por presión, plexo braquial, salida del tubo) no se modelan.`, cita: C.pronoComo, origen: 'ficha, cap. 24 p. 45 · P/F y compliance: ilustrativo' };
}
export function selloContra(ci, lec) {
  const et = PRONO.contra.find((x) => x.k === ci)?.et ?? ci;
  return { k: 'prono-contra', titulo: 'Contraindicación absoluta: no se gira', texto: `Con «${et}» Isidro no puede ponerse en prono (Tabla 24.4): sigue en supino con P/F ${lec.pf}, PaO₂ ${lec.pao2} con FiO₂ ${PRONO.fio2} % y compliance ${String(lec.c).replace('.', ',')} mL/cmH₂O. El mando de horas queda apagado hasta quitar la contraindicación.`, cita: C.tabla244, origen: 'ficha, cap. 24 p. 44 (Tabla 24.4) · P/F y compliance: ilustrativo' };
}
// Los mandos del dock: posición, horas y las cinco contraindicaciones absolutas (`desl` es el de la página)
export function mandosHtml(est, desl) {
  const p = est.prono, ci = est.ci || {}, bloq = Object.values(ci).some(Boolean), sel = p.post ? 'post' : p.prono ? 'prono' : 'supino';
  const b = (v, t, s) => `<button type="button" data-m="pos" data-v="${v}" aria-pressed="${sel === v}">${t}<small>${s}</small></button>`;
  let h = `<p class="dock-nota dock-grupo"><b>Posición de Isidro</b>: SDRA con P/F ${p.pf} (PaO₂ ${p.pao2} con FiO₂ ${PRONO.fio2} %)</p>`;
  h += `<div class="seg">${b('supino', 'Supino', 'boca arriba')}${b('prono', 'Prono', 'boca abajo')}${b('post', 'Supino, 4 h después', 'tras el prono')}</div>`;
  h += desl('horas', 'Horas en prono', p.h, 0, PRONO.tope, 1, 'h', `tope ${PRONO.tope}: lo mínimo al día con ventilación mecánica (Marino cap. 24 p. 45) · el efecto por hora: ilustrativo`);
  h += `<details class="dock-nota-det"${bloq ? ' open' : ''}><summary>Contraindicaciones absolutas (Tabla 24.4)</summary><div class="rejilla" style="--n:2">${PRONO.contra.map((x) => `<button type="button" class="tog" data-m="ci" data-v="${x.k}" aria-pressed="${!!ci[x.k]}">${x.et}</button>`).join('')}</div></details>`;
  return h;
}
// Las dos mitades del racimo: la dorsal (abajo en supino, arriba en prono) lleva alvéolos consolidados que se airean con las horas
export function pintarRacimo(svg, lec) {
  const alv = [...svg.querySelectorAll('.esc-alv')]; let et = svg.querySelector('#pul-esc-prono-et');
  if (!lec) { alv.forEach((a) => a.classList.remove('prono-cons')); et?.setAttribute('hidden', ''); return; }
  if (!et) { et = document.createElementNS('http://www.w3.org/2000/svg', 'g'); et.id = 'pul-esc-prono-et'; et.innerHTML = '<text class="esc-et" x="300" data-pr="d" text-anchor="middle"></text><text class="esc-et" x="300" data-pr="v" text-anchor="middle"></text>'; svg.append(et); }
  et.removeAttribute('hidden');
  const dorsal = lec.prono ? [9, 10, 11, 0, 1, 2] : [3, 4, 5, 6, 7, 8];   // el racimo gira con el paciente: dorsal = abajo en supino
  alv.forEach((a, i) => a.classList.toggle('prono-cons', dorsal.indexOf(i) >= 0 && dorsal.indexOf(i) < lec.cons));
  const d = et.querySelector('[data-pr="d"]'), v = et.querySelector('[data-pr="v"]');
  d.setAttribute('y', lec.prono ? 126 : 236); v.setAttribute('y', lec.prono ? 236 : 126);
  d.textContent = `dorsal · ${lec.cons} de ${PRONO.alvCons} consolidados`; v.textContent = 'ventral · aireada';
}
