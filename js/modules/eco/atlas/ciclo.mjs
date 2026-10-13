// Atlas · 06 Ciclo cardíaco: el Wiggers y el asa del motor del latido de la app (el mismo que mueve el corazón 3D del
// simulador), con un cursor de tiempo tras la onda R. Reconstruido sobre nuestro motor (idea de The Heart by
// Ultrasound, cap. 06, sin su modelo): las duraciones de las fases salen del motor y se comparan con Alhakak 2025,
// que el motor cumple desde la calibración de octubre de 2026 (referencias.mjs).
import { crearMotor, FASES } from '../motor.mjs';
import { crearDiagramas, estadoRevision, segmentosFase } from '../diagramas.mjs';
import { REFERENCIAS } from '../referencias.mjs';
import { deslizador, casilla, lecturas, enVivo, animar, reducirMovimiento, coma } from './figura.mjs';

/** Duraciones del último latido (ms) y aporte auricular al llenado. Pura: la usan la figura y las pruebas. */
export function duraciones(m) {
  const u = m.ultimo, o = m.onda;
  const finA = o.find(x => x.fase !== 'A'), inicio = o[0];
  const llenado = u.edv - u.esv, auricular = finA && inicio ? finA.vvi - inicio.vvi : NaN;
  return { tciv: (u.tAoAbre - u.tS1) * 1000, eyeccion: (u.tS2 - u.tAoAbre) * 1000, triv: (u.tMitAbre - u.tS2) * 1000,
    fc: u.fc, aporteAuricular: auricular / llenado };
}

const REF = Object.fromEntries(REFERENCIAS.filter(r => ['tcivol', 'teyec', 'trivol'].includes(r.id)).map(r => [r.id, r]));

export function montar(el) {
  const m = crearMotor(); m.correr(12);
  const st = { animar: false, tR: 0.03 };
  const mandos = document.createElement('div'); mandos.className = 'at-mandos'; el.appendChild(mandos);
  const T = () => m.ultimo.periodo;
  const cursor = deslizador(mandos, { etiqueta: 'Tiempo tras la onda R', min: 0, max: Math.round(T() * 1000), paso: 1, valor: 30,
    fmt: (v) => `${v} ms`, marcas: ['onda R', 'sístole', 'diástole', 'siguiente R'], onInput: (v) => { st.tR = v / 1000; st.animar = false; anima.el.checked = false; pintar(); } });
  const anima = casilla(mandos, { etiqueta: 'Animar el ciclo', valor: false, onChange: (v) => { st.animar = v; } });
  const cajaW = document.createElement('div'); cajaW.className = 'at-diag'; el.appendChild(cajaW);
  const cw = document.createElement('canvas'), cp = document.createElement('canvas');
  cw.setAttribute('aria-label', 'Diagrama de Wiggers del motor: presiones de aorta, VI y AI y volumen del VI, con el cursor en el instante elegido');
  cp.setAttribute('aria-label', 'Asa presión-volumen del VI del mismo latido, con el punto del instante elegido');
  cw.className = 'at-lienzo'; cp.className = 'at-lienzo at-lienzo-asa'; cajaW.append(cw, cp);
  const D = crearDiagramas(cw, cp);
  const lect = lecturas(el), vivo = enVivo(el);
  const ajustar = () => { const dpr = Math.min(3, devicePixelRatio || 1), w = Math.max(280, cw.clientWidth || 340);
    const a = Math.round(w * dpr); if (cw.width !== a) { cw.width = a; cw.height = Math.round(w * 0.78 * dpr); cp.width = a; cp.height = Math.round(w * 0.72 * dpr); D.invalidar(); } };

  // el tiempo del latido del motor empieza en la activación auricular; la onda R es el inicio de la ventricular (pr)
  const tLatido = () => (st.tR + m.p.pr) % T();
  const evento = (t) => {
    const u = m.ultimo, cerca = (x) => x != null && Math.abs(t - x) < 0.012;
    return cerca(u.tS1) ? 'cierre mitral (S1)' : cerca(u.tAoAbre) ? 'apertura aórtica' : cerca(u.tS2) ? 'cierre aórtico (S2)' : cerca(u.tMitAbre) ? 'apertura mitral' : '';
  };

  function pintar() {
    ajustar();
    const e = estadoRevision(m.onda, tLatido());
    if (!e) return;
    D.pintar(e, m, 'izquierdo');
    const d = duraciones(m), ev = evento(e.tLatido);
    const fila = (r, v) => ({ k: r.nombre, v: coma(v, 0), u: `ms · ref. ${r.texto}`, aviso: !(v >= r.min && v <= r.max), fuente: 'motor frente a Alhakak 2025' });
    lect.pintar([
      { k: 'Fase', v: `${e.fase} · ${FASES[e.fase]}`, u: ev ? `· ${ev}` : '' },
      fila(REF.tcivol, d.tciv), fila(REF.teyec, d.eyeccion), fila(REF.trivol, d.triv),
      { k: 'Frecuencia', v: coma(d.fc, 0), u: 'lpm' },
      { k: 'Aporte de la contracción auricular', v: coma(d.aporteAuricular * 100, 0), u: '% del llenado · ref. ~1/5', fuente: 'motor' },
    ]);
    const txt = {
      A: 'La aurícula se contrae y completa el llenado (onda A del Doppler mitral, tras la onda P).',
      B: 'Las dos válvulas izquierdas están cerradas: la presión del VI sube sin cambio de volumen. Empezó con el cierre mitral (S1).',
      C: 'La presión del VI supera a la aórtica, la aórtica se abre y el VI expulsa deprisa.',
      D: 'La presión del VI ya baja, pero la sangre sigue saliendo por inercia hasta que la aórtica se cierra.',
      E: 'Las dos válvulas izquierdas vuelven a estar cerradas: la presión cae sin cambio de volumen. Empezó con el cierre aórtico (S2).',
      F: 'La mitral se abre y el VI se llena deprisa (onda E del Doppler mitral, tras la onda T).',
      G: 'Diástasis: la presión de la AI y del VI casi se igualan y el llenado se frena.',
    }[e.fase];
    vivo.pintar(`<b>${coma(st.tR * 1000, 0)} ms tras la onda R · fase ${e.fase}.</b> ${txt} Es el mismo motor que mueve el corazón del simulador, a ${coma(d.fc, 0)} lpm.`);
  }

  pintar();
  const anim = reducirMovimiento() ? null : animar(cw, (dt) => {
    if (!st.animar) return;
    st.tR = (st.tR + dt * 0.35) % T();             // a un tercio de la velocidad real, para seguirlo con la vista
    cursor.set(Math.round(st.tR * 1000)); pintar();
  });
  const ro = new ResizeObserver(() => pintar()); ro.observe(cw);
  return { parar() { anim?.parar(); ro.disconnect(); }, motor: m, segmentos: () => segmentosFase(m.onda, T()) };
}
