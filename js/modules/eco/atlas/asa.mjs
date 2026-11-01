// Atlas · 07 Asa presión-volumen: el asa del VI del motor del latido de la app, sin barorreflejo (para ver el efecto
// puro de cada cambio). Reconstruido sobre nuestro motor (idea de The Heart by Ultrasound, cap. 07, sin su modelo).
// Cada mando cambia un parámetro del motor, y el motor corre hasta asentarse: la nueva asa sale de la circulación
// entera (precarga, poscarga y contractilidad interactúan), no de una fórmula aparte.
//   · contractilidad: Ees del VI (mmHg/mL) · rigidez: B de la curva diastólica del VI · poscarga: resistencia
//     sistémica · precarga: volumen de sangre añadido o quitado a las venas
//   · insuficiencia mitral: orificio regurgitante del motor (eroaMitral), con la remodelación crónica del VI
// Las magnitudes de cada ajuste son ilustrativas; las direcciones son las del texto del capítulo.
import { crearMotor, BASE } from '../motor.mjs';
import { crearDiagramas, estadoRevision, escalas, eesLatido, LADOS } from '../diagramas.mjs';
import { deslizador, segmentos, lecturas, enVivo, animar, reducirMovimiento, coma } from './figura.mjs';

export const PRESETS = {
  normal: { nombre: 'Normal', ees: BASE.vi.ees, rigidez: 1, poscarga: 1, volumen: 0 },
  hfref: { nombre: 'Hipocontráctil', ees: 1.0, rigidez: 1, poscarga: 1, volumen: 600 },
  hfpef: { nombre: 'Rígido', ees: BASE.vi.ees, rigidez: 1.7, poscarga: 1.25, volumen: 700 },
  presion: { nombre: 'Sobrecarga de presión', ees: BASE.vi.ees, rigidez: 1.3, poscarga: 1.9, volumen: 0 },
  im: { nombre: 'Sobrecarga de volumen (IM)', ees: BASE.vi.ees, rigidez: 0.7, poscarga: 1, volumen: 500, eroa: 0.6, v0: 40 },
};

/** Motor asentado con unos ajustes. Puro: lo usan la figura y las pruebas. */
export function asentar(a, segundos = 14) {
  const m = crearMotor({ barorreflejo: false, eroaMitral: a.eroa || 0,
    vi: { ees: a.ees, b: BASE.vi.b * a.rigidez, v0: a.v0 ?? BASE.vi.v0 }, rSis: BASE.rSis * a.poscarga });
  m.s.vven += a.volumen;
  m.correr(segundos);
  return m;
}

/** Medidas del asa del último latido. Ea = Pts ÷ VS total; FE teórica = Ees ÷ (Ees + Ea) (V0 = 0). */
export function medidasAsa(m) {
  const u = m.ultimo, o = m.onda;
  const ts = o.reduce((a, b) => (Math.abs(b.t - u.tS2) < Math.abs(a.t - u.tS2) ? b : a));     // telesístole: cierre aórtico
  // Ees: la de un latido (desde V0 hasta la esquina telesistólica, como la ESPVR que se dibuja); el parámetro del
  // motor es la elastancia máxima, algo mayor por el efecto de la eyección
  const vsTotal = u.edv - u.esv, pts = ts.pvi, ea = pts / vsTotal, ees = eesLatido(o, LADOS.izquierdo, m.p.vi.v0) ?? m.p.vi.ees;
  let area = 0;                                                                         // trabajo sistólico (área del asa)
  for (let i = 0; i < o.length; i++) { const a = o[i], b = o[(i + 1) % o.length]; area += (a.vvi * b.pvi - b.vvi * a.pvi) / 2; }
  // contracción isovolumétrica: cuánto volumen pierde el VI entre el cierre mitral y la apertura aórtica
  const b = o.filter(x => x.t >= u.tS1 && x.t <= u.tAoAbre), caidaB = b.length ? b[0].vvi - b[b.length - 1].vvi : 0;
  return { edv: u.edv, esv: u.esv, vsTotal, vsAorta: u.vs, fe: u.feTotal, ptd: u.ptdvi, pts, vts: ts.vvi, ea, ees,
    feTeorica: ees / (ees + ea), trabajo: Math.abs(area) * 1.333e-4, acoplamiento: ea / ees, vReg: u.vReg, fr: u.fr, caidaB };
}

export function montar(el) {
  const st = { ...PRESETS.normal, preset: 'normal', t: 0 };
  let m = asentar(st), med = medidasAsa(m), espera = 0;
  const mandos = document.createElement('div'); mandos.className = 'at-mandos'; el.appendChild(mandos);
  const ctrl = {};
  const recalcular = () => { clearTimeout(espera); espera = setTimeout(() => { m = asentar(st); med = medidasAsa(m); D.invalidar(); pintar(); }, 120); };
  segmentos(mandos, { etiqueta: 'Corazón', valor: 'normal', opciones: Object.entries(PRESETS).map(([k, p]) => [k, p.nombre]),
    onChange: (k) => { Object.assign(st, { eroa: 0, v0: undefined }, PRESETS[k], { preset: k });
      ctrl.ees.set(st.ees); ctrl.rig.set(st.rigidez); ctrl.pos.set(st.poscarga); ctrl.vol.set(st.volumen); recalcular(); } });
  const tocar = () => { st.preset = 'personal'; };
  ctrl.vol = deslizador(mandos, { etiqueta: 'Precarga (volemia)', min: -800, max: 1200, paso: 50, valor: 0, fmt: (v) => `${v > 0 ? '+' : ''}${v} mL`, onInput: (v) => { st.volumen = v; tocar(); recalcular(); } });
  ctrl.pos = deslizador(mandos, { etiqueta: 'Poscarga (resistencia sistémica)', min: 0.5, max: 2.5, paso: 0.05, valor: 1, fmt: (v) => `×${coma(v, 2)}`, onInput: (v) => { st.poscarga = v; tocar(); recalcular(); } });
  ctrl.ees = deslizador(mandos, { etiqueta: 'Contractilidad (Ees)', min: 0.6, max: 5, paso: 0.1, valor: st.ees, fmt: (v) => `${coma(v, 1)} mmHg/mL`, onInput: (v) => { st.ees = v; tocar(); recalcular(); } });
  ctrl.rig = deslizador(mandos, { etiqueta: 'Rigidez de la cámara', min: 0.6, max: 3, paso: 0.1, valor: 1, fmt: (v) => `×${coma(v, 1)}`, onInput: (v) => { st.rigidez = v; tocar(); recalcular(); } });

  const caja = document.createElement('div'); caja.className = 'at-diag'; el.appendChild(caja);
  const cp = document.createElement('canvas'), cw = document.createElement('canvas');
  cp.className = 'at-lienzo at-lienzo-asa'; cw.className = 'at-lienzo';
  cp.setAttribute('aria-label', 'Asa presión-volumen del VI con la ESPVR, la EDPVR y la recta de Ea');
  cw.setAttribute('aria-label', 'Wiggers del mismo latido');
  caja.append(cp, cw);
  const D = crearDiagramas(cw, cp);
  const lect = lecturas(el), vivo = enVivo(el);
  const ajustar = () => { const dpr = Math.min(3, devicePixelRatio || 1), w = Math.max(280, cp.clientWidth || 340), a = Math.round(w * dpr);
    if (cp.width !== a) { cp.width = a; cp.height = Math.round(w * 0.82 * dpr); cw.width = a; cw.height = Math.round(w * 0.7 * dpr); D.invalidar(); } };

  function pintar() {
    ajustar();
    const e = estadoRevision(m.onda, (st.t % m.ultimo.periodo));
    if (!e) return;
    D.pintar(e, m, 'izquierdo');
    // recta de Ea: del VTD en el eje de volumen al punto telesistólico (la misma caja que dibuja diagramas.mjs)
    const esc = escalas(m.onda, 'izquierdo', m.ultimo.periodo), h = cp.getContext('2d'), k = cp.width / (cp.clientWidth || 340);
    const x0 = 32 * k, x1 = cp.width - 10 * k, y0 = 14 * k, y1 = cp.height - 34 * k;
    const xV = (v) => x0 + (v / esc.pvVMax) * (x1 - x0), yP = (p) => y1 - (p / esc.pvPMax) * (y1 - y0);
    h.save(); h.setLineDash([5 * k, 4 * k]); h.strokeStyle = getComputedStyle(cp).getPropertyValue('--y').trim(); h.lineWidth = 1.5 * k;
    h.beginPath(); h.moveTo(xV(med.edv), yP(0)); h.lineTo(xV(med.vts), yP(med.pts)); h.stroke(); h.setLineDash([]);
    h.fillStyle = h.strokeStyle; h.font = `${10 * k}px Georgia`; h.textAlign = 'right'; h.fillText('Ea (poscarga)', x1 - 6 * k, y0 + 42 * k);
    h.restore();

    const im = med.vReg > 1;
    lect.pintar([
      { k: 'VTD / VTS', v: `${coma(med.edv, 0)} / ${coma(med.esv, 0)}`, u: 'mL' },
      { k: 'Volumen sistólico', v: coma(med.vsTotal, 0), u: im ? `mL (a la aorta, ${coma(med.vsAorta, 0)})` : 'mL' },
      { k: 'Fracción de eyección', v: coma(med.fe * 100, 0), u: '%' },
      { k: 'PTDVI', v: coma(med.ptd, 1), u: 'mmHg' },
      { k: 'Ees (contractilidad)', v: coma(med.ees, 1), u: `mmHg/mL · máxima del motor ${coma(m.p.vi.ees, 1)}`, fuente: 'de un latido' },
      { k: 'Ea = Pts ÷ VS', v: coma(med.ea, 2), u: `mmHg/mL (Pts ${coma(med.pts, 0)})` },
      { k: 'Ea/Ees', v: coma(med.acoplamiento, 2), u: 'ref. ~0,5-1,0', aviso: med.acoplamiento > 1.3 },
      { k: 'FE = Ees ÷ (Ees + Ea)', v: coma(med.feTeorica * 100, 0), u: '% (V0 = 0)', fuente: 'fórmula' },
      { k: 'Trabajo sistólico', v: coma(med.trabajo, 2), u: 'J (área del asa)' },
      ...(im ? [{ k: 'Volumen regurgitante', v: coma(med.vReg, 0), u: `mL · fracción ${coma(med.fr * 100, 0)}%`, aviso: true },
        { k: 'Contracción isovolumétrica', v: `el VI pierde ${coma(med.caidaB, 0)} mL`, u: 'antes de abrir la aórtica', aviso: true }] : []),
    ]);
    const txt = {
      normal: 'Asa normal: el VI se llena siguiendo la EDPVR (la curva morada discontinua), contrae sin cambio de volumen, expulsa y relaja. La anchura es el volumen sistólico y el área, el trabajo sistólico.',
      hfref: 'Con una Ees baja, la ESPVR se tumba: el VI se dilata (con la retención de líquidos) y expulsa una fracción pequeña de su volumen.',
      hfpef: 'Con una EDPVR empinada, la presión de llenado es alta con un volumen casi normal, y la FE se conserva.',
      presion: 'Con una Ea alta (estenosis aórtica, hipertensión), el asa sube hasta presiones sistólicas altas y se estrecha.',
      im: 'Insuficiencia mitral crónica grave: el VI expulsa a la AI desde el inicio de la contracción, así que no hay contracción isovolumétrica; el asa es ancha y está desplazada a la derecha, y solo una parte del volumen sistólico va a la aorta.',
      personal: 'Ajustes propios: mira cómo se mueven a la vez la ESPVR, la EDPVR y la recta de Ea, y la FE con ellas.',
    }[st.preset];
    vivo.pintar(`${txt} <span class="cv-muted">La FE de la fórmula supone V0 = 0; la del motor (V0 = ${coma(m.p.vi.v0, 0)} mL, con tabique y pericardio) es la real del latido.</span>`);
  }

  pintar();
  const anim = reducirMovimiento() ? null : animar(cp, (dt) => { st.t += dt * 0.5; pintar(); });
  const ro = new ResizeObserver(() => pintar()); ro.observe(cp);
  return { parar() { anim?.parar(); ro.disconnect(); clearTimeout(espera); } };
}
