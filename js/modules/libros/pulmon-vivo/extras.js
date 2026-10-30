// El pulmón con respirador, piezas del ciclo (E1b): las 4 decisiones de cada respiración, el árbol «el pico sube: ¿y la
// meseta?» y la calculadora de PBW, Vt/kg, Cstat y ΔP. Se montan desde pagina.js; los botones se crean una vez y solo se repintan.
// Origen de cada cifra: el rótulo `org` de cada línea (ficha, fisiología general o ilustrativo).
import { instalarCss } from '../../../core/dibujo-iso.js';
import { calcVentilacion, C_TUBULADURA, CSTAT, DP } from '../../../data/ventilacion-data.js';
import * as D from '../../../data/pulmon-vivo-data.js';

const { C } = D;
const CSS = `
#pul-ciclo4 { display: grid; gap: 4px; }
#pul-ciclo4 .c4 { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 4px; }
#pul-ciclo4 .c4 > div { background: var(--bg-card); border: 1px solid var(--border-color); border-radius: 8px; padding: 5px 7px; font-size: .74rem; line-height: 1.3; color: var(--text-dim); min-width: 0; overflow-wrap: anywhere; }
#pul-ciclo4 .c4 b { display: block; color: var(--text-main); font-size: .78rem; }
#pul-ciclo4 .c4 .n { color: var(--accent-yellow); margin-right: 3px; }
.pul-e1b-caja { display: grid; gap: 6px; padding: 6px 2px; font-size: .8rem; line-height: 1.35; color: var(--text-dim); }
.pul-e1b-caja .e1b-f { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 6px; }
.pul-e1b-caja label { display: grid; gap: 2px; font-size: .72rem; min-width: 0; }
.pul-e1b-caja input, .pul-e1b-caja select { min-height: 40px; width: 100%; box-sizing: border-box; background: var(--bg-main); color: var(--text-main); border: 1px solid var(--border-color); border-radius: 6px; padding: 0 8px; font: inherit; }
.pul-e1b-caja button { min-height: 44px; border-radius: 8px; border: 1px solid var(--border-color); background: var(--bg-card); color: var(--text-main); font: inherit; font-weight: 600; cursor: pointer; padding: 0 10px; }
.pul-e1b-caja button[aria-pressed="true"] { border-color: var(--accent-yellow); color: var(--accent-yellow); }
.pul-e1b-caja .res { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 4px; }
.pul-e1b-caja .res > div { background: var(--bg-card); border: 1px solid var(--border-color); border-radius: 8px; padding: 5px 7px; min-width: 0; }
.pul-e1b-caja .res b { display: block; font-size: 1.05rem; color: var(--text-main); font-variant-numeric: tabular-nums; }
.pul-e1b-caja .res small { display: block; font-size: .66rem; color: var(--text-dim); }
.pul-e1b-caja .org { white-space: normal !important; display: inline-block; max-width: 100%; overflow-wrap: anywhere; }
.pul-e1b-caja .aviso { color: var(--accent-yellow); font-weight: 600; }
.pul-e1b-caja .concl { background: var(--bg-card); border-left: 3px solid var(--accent-yellow); border-radius: 6px; padding: 6px 8px; }
`;
const f1 = (n) => (n == null || !isFinite(n) ? '—' : String(Math.round(n * 10) / 10).replace('.', ','));

// Las 4 decisiones de cada respiración, por modo: [rótulo, qué pasa, cita]
const CUATRO = {
  vcv: [
    ['Disparo', 'Por tiempo (la FR que fijas) o por el paciente: presión negativa de 2 a 3 cmH₂O.', C.disparo],
    ['Límite', 'Flujo constante: el respirador entrega el volumen marcado.', C.vcv],
    ['Ciclado', 'Termina cuando entra el volumen marcado.', C.vcv],
    ['Espiración', 'Pasiva: se abre la válvula y el pulmón se vacía hasta la PEEP.', C.fig271],
  ],
  pcv: [
    ['Disparo', 'Por tiempo (la FR que fijas) o por el paciente: presión negativa de 2 a 3 cmH₂O.', C.disparo],
    ['Límite', 'Presión fija: el flujo es alto al principio y decae hasta cero.', C.pcv],
    ['Ciclado', 'Por tiempo: el tiempo inspiratorio que preseleccionas.', C.pcv],
    ['Espiración', 'Pasiva: se abre la válvula y el pulmón se vacía hasta la PEEP.', C.fig271],
  ],
  psv: [
    ['Disparo', 'Siempre del paciente: su esfuerzo baja la presión 2 a 3 cmH₂O.', C.disparo],
    ['Límite', 'Presión de soporte fija; el flujo sigue lo que pide el paciente.', C.psv4],
    ['Ciclado', 'Por flujo: acaba cuando cae al 25 % del flujo pico.', C.psv4],
    ['Espiración', 'Pasiva: se abre la válvula y el pulmón se vacía hasta la PEEP.', C.fig271],
  ],
};

// Las fuentes de las notas del dock (ventilar, oxigenar, vigilar el lado no garantizado, constante de tiempo)
const EXTRA = (m) => [['Vigila el lado que no está garantizado', null, m === 'vcv' ? C.vcv : m === 'pcv' ? C.pcvPros : C.psv4], ['Oxigenar frente a ventilar', null, C.mejorPeep], ['Constante de tiempo y auto-PEEP', null, C.tau]];

export function montarExtras({ $, P, est, leer, PBW, cita, org, hacerPausa }) {
  instalarCss('pul-e1b', CSS);

  // ---------------------------------------------------------------- las 4 decisiones del ciclo
  const c4 = document.createElement('section'); c4.id = 'pul-ciclo4'; c4.setAttribute('aria-label', 'Las cuatro decisiones de cada respiración');
  $('calc').insertAdjacentElement('beforebegin', c4);
  let modoVisto = null;
  function pintarCuatro() {
    const m = P.S.resp.modo; if (m === modoVisto) return; modoVisto = m;
    const L4 = CUATRO[m] || CUATRO.vcv;
    c4.innerHTML = `<p class="pul-e1b-caja" style="padding:2px">Dos mandos distintos. <b>Ventilar</b> saca el CO₂: volumen minuto = Vt × FR ${org('fisiología general')}. <b>Oxigenar</b> sube la PaO₂ con la FiO₂ y la PEEP; la PEEP solo sube el PaO₂/FiO₂ si recluta alvéolos, y si no se queda igual o baja ${org('ficha · cap. 27 pp. 10-12 · sin gases en el modelo')}. Vigila el lado que no está garantizado: en volumen control, la presión; en presión control y en soporte, el volumen. Un mando movido a mitad de una respiración entra en la siguiente.</p><div class="c4">${L4.map(([t, x], i) => `<div data-decision="${i + 1}"><b><span class="n">${i + 1}</span>${t}</b>${x}</div>`).join('')}</div>
      <details class="plegable"><summary>Fuentes: las 4 decisiones y los mandos</summary><ul class="lista">${[...L4, ...EXTRA(m)].map(([t, , c]) => `<li><span>${t}: ${D.FICHA[c.f][4]}, ${c.sitio}</span>${cita(c)}</li>`).join('')}</ul></details>`;
  }

  // ---------------------------------------------------------------- el árbol «el pico sube: ¿y la meseta?»
  const arbol = document.createElement('details'); arbol.className = 'plegable'; arbol.id = 'pul-arbol';
  arbol.innerHTML = `<summary>El pico sube: ¿y la meseta?</summary><div class="pul-e1b-caja">
    <p>Pico = presión de resistencia + presión elástica (Ec. 27.1). La pausa inspiratoria las separa: la meseta es la presión elástica y pico − meseta es la de resistencia. ${cita(C.ec271)}</p>
    <div class="res"><div><b id="pul-arbol-pico">—</b><small>pico, cmH₂O</small></div><div><b id="pul-arbol-meseta">—</b><small>meseta, cmH₂O</small></div><div><b id="pul-arbol-pres">—</b><small>pico − meseta (resistencia)</small></div></div>
    <button type="button" id="pul-arbol-pausa" aria-pressed="false">Hacer la pausa inspiratoria</button>
    <p id="pul-arbol-pasos">1. Haz la pausa para ver la meseta. 2. Compara con la de antes: ¿se movió?</p>
    <div class="e1b-f"><button type="button" data-arbol="igual">La meseta no se movió</button><button type="button" data-arbol="sube">La meseta también subió</button></div>
    <p class="concl" id="pul-arbol-concl" hidden></p>
    <p>Ejemplo: pico 28 → 42 con meseta 24. La resistencia pasó de 28 − 24 = 4 a 42 − 24 = 18 y la meseta no cambió: sube la resistencia. ${org('ilustrativo')} ${cita(C.meseta)}</p>
    <p>${org('la fuente no lo dice')} Las páginas citadas no enumeran las causas clínicas de un pico alto; el árbol solo reparte entre resistencia y elasticidad. <button type="button" class="nota-ir" data-nota="causas-pico">Ver la nota →</button></p></div>`;
  const CONCL = {
    igual: `Sube la parte de resistencia (pico − meseta, Ec. 27.3): algo dificulta el paso del aire por la vía aérea; la presión que llega al alvéolo no cambió. ${cita(C.meseta)}`,
    sube: `Sube la parte elástica (la meseta es la presión alveolar, Ec. 27.2): el pulmón y el tórax se distienden peor con el mismo volumen, y el pico sube por arrastre. Ojo con el límite de 30 en la meseta. ${cita(C.riesgo)}`,
  };
  arbol.addEventListener('click', (ev) => {
    const b = ev.target.closest('[data-arbol]'); if (b) { const k = b.dataset.arbol, c = $('arbol-concl'); c.innerHTML = CONCL[k]; c.hidden = false; return; }
    if (ev.target.closest('#pul-arbol-pausa')) hacerPausa();
  });
  function pintarArbol() {
    const l = leer() || {}, r = P.S.resp, psv = r.modo === 'psv';
    $('arbol-pico').textContent = f1(l.pico); $('arbol-meseta').textContent = l.meseta == null ? '—' : f1(l.meseta);
    $('arbol-pres').textContent = l.meseta == null ? '—' : f1(l.pico - l.meseta);
    const bt = $('arbol-pausa'); bt.setAttribute('aria-pressed', String(!!P.S.man.pausa)); bt.disabled = psv;
    bt.textContent = psv ? 'En PSV no hay pausa (el paciente respira solo)' : P.S.man.pausa ? 'Quitar la pausa inspiratoria' : 'Hacer la pausa inspiratoria';
  }

  // ---------------------------------------------------------------- la calculadora PBW · Vt/kg · Cstat · ΔP
  const cal = document.createElement('details'); cal.className = 'plegable'; cal.id = 'pul-cv';
  cal.innerHTML = `<summary>Calculadora: peso ideal, Vt/kg, Cstat y presión de conducción</summary><div class="pul-e1b-caja">
    <div class="e1b-f"><label>Talla (cm)<input id="pul-cv-talla" type="number" inputmode="decimal" min="120" max="210" step="1" placeholder="175"></label>
      <label>Sexo<select id="pul-cv-sexo"><option value="v">Varón</option><option value="m">Mujer</option></select></label>
      <label>Vt (mL)<input id="pul-cv-vt" type="number" inputmode="decimal" min="100" max="1000" step="10" placeholder="420"></label>
      <label>Meseta (cmH₂O)<input id="pul-cv-meseta" type="number" inputmode="decimal" min="5" max="60" step="1" placeholder="28"></label>
      <label>PEEP (cmH₂O)<input id="pul-cv-peep" type="number" inputmode="decimal" min="0" max="30" step="1" placeholder="10"></label></div>
    <button type="button" id="pul-cv-actual">Copiar el paciente de la pantalla</button>
    <div class="res"><div><b id="pul-cv-r-pbw">—</b><small>peso ideal (PBW), kg · ${org('ficha · cap. 27 p. 14', false)}</small></div>
      <div><b id="pul-cv-r-vtkg">—</b><small>Vt por kg de PBW, mL/kg · ${org('ficha · cap. 24 p. 48', false)}</small></div>
      <div><b id="pul-cv-r-dp">—</b><small>ΔP = meseta − PEEP, cmH₂O · ${org('ficha · sin objetivo', false)}</small></div>
      <div><b id="pul-cv-r-cstat">—</b><small>Cstat, mL/cmH₂O, con −${C_TUBULADURA} mL por cmH₂O de tubuladura · ${org('ficha · cap. 27 p. 6-7', false)}</small></div></div>
    <p class="aviso" id="pul-cv-avisos" hidden></p>
    <p id="pul-cv-lectura"></p>
    <p>${org('la fuente no lo dice')} Marino no da un objetivo para la presión de conducción: la calculadora no pone ninguno. <button type="button" class="nota-ir" data-nota="dp-sin-objetivo">Ver la nota →</button> ${cita(C.cstat)}</p></div>`;
  function calcular() {
    const v = (k) => $('cv-' + k).value, r = calcVentilacion({ talla: v('talla'), sexo: v('sexo'), vt: v('vt'), meseta: v('meseta'), peep: v('peep') });
    $('cv-r-pbw').textContent = f1(r.pbw); $('cv-r-vtkg').textContent = f1(r.vtkg); $('cv-r-dp').textContent = f1(r.dp); $('cv-r-cstat').textContent = f1(r.cstat);
    $('cv-avisos').textContent = r.avisos.join(' '); $('cv-avisos').hidden = !r.avisos.length;
    // el veredicto se compara redondeado (el resultado no contradice lo que se ve)
    const cs = r.cstat == null ? null : Math.round(r.cstat);
    $('cv-lectura').textContent = cs == null ? 'Rellena los campos que tengas: lo que falte queda en blanco, no vale 0.'
      : cs < CSTAT.bajo ? `Cstat ${cs}: por debajo de ${CSTAT.bajo}, típica del SDRA (cap. 27 p. 6).` : cs >= CSTAT.normalMin && cs <= CSTAT.normalMax ? `Cstat ${cs}: dentro de lo normal (${CSTAT.normalMin}-${CSTAT.normalMax}, cap. 27 p. 6).` : `Cstat ${cs}: entre el SDRA (<${CSTAT.bajo}) y lo normal (${CSTAT.normalMin}-${CSTAT.normalMax}).`;
  }
  cal.addEventListener('input', calcular);
  cal.addEventListener('click', (ev) => {
    if (ev.target.closest('#pul-cv-actual')) {
      const l = leer() || {}, p = est.pac;
      $('cv-talla').value = p.talla; $('cv-sexo').value = p.sexo; $('cv-vt').value = l.vtExh != null ? Math.round(l.vtExh) : P.S.resp.vt;
      $('cv-meseta').value = l.meseta != null ? Math.round(l.meseta * 10) / 10 : ''; $('cv-peep').value = l.peepTot != null ? Math.round(l.peepTot * 10) / 10 : P.S.resp.peep;
      calcular();
    }
  });
  // los dos van al principio de «Las fuentes», dentro de lo de abajo
  const abajo = $('abajo'); abajo.insertBefore(cal, abajo.firstChild); abajo.insertBefore(arbol, abajo.firstChild);
  calcular();
  return { pintar() { pintarCuatro(); pintarArbol(); } };
}
