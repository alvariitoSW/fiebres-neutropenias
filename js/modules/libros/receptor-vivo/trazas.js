// El monitor del receptor (maqueta b3-receptor): curvas, cifras y el estado compartido (R, pausa, tapa).
import { crearMonitor, pintarCifras as pintarColumna, ecgLatido } from '../../../core/monitor.js';
import { $ } from './util.js';
import { C, OBJETIVOS, chip, cita, coma, org, sat } from '../../../data/receptor-vivo-data.js';
import { L, seguir } from './lupa.js';
import { ST, medirDock } from './pagina.js';
/* ============================================================
   8. El monitor de cabecera: la pieza común (js/core/monitor.js), en su forma corta (ECG y ART) o con las 5 curvas.
   Aquí, qué lee cada curva: formas ilustrativas (el ECG, el latido común de la pieza); las cifras salen de efecto().
   ============================================================ */
export const gauss = (x, m, s) => Math.exp(-((x - m) * (x - m)) / (2 * s * s));
export function artF(tau, T, R) {
  const pas = R.pas, pad = R.pad, pp = pas - pad, k = Math.min(1, T / 0.8), up = 0.11 * k, notch = 0.33 * k;
  let p;
  if (tau < up) p = pad + pp * Math.sin((tau / up) * Math.PI / 2);
  else if (tau < notch) p = pas - pp * 0.32 * Math.pow((tau - up) / (notch - up), 1.4);
  else { const pn = pas - pp * 0.36; p = pad + (pn + pp * 0.06 * gauss(tau, notch + 0.04 * k, 0.02) - pad) * Math.exp(-(tau - notch) / (0.55 * T)); }
  if (R.P.obj === 'sepsis' || R.P.obj === 'anafilaxia') p -= pp * 0.08 * gauss(tau, notch, 0.03);
  return p;
}
export function plethF(tau, T, R) { const f = ((tau - 0.18) / T + 1) % 1; return (Math.sin(Math.min(1, f / 0.25) * Math.PI / 2) * (f < 0.25 ? 1 : Math.exp(-(f - 0.25) / 0.45)) + 0.12 * gauss(f, 0.45, 0.04)) * (R.P.obj === 'cardio' ? 0.45 : 0.9); }
export function pvcF(tau, T, resp, R) { const f = tau / T; return R.pvc + 1.6 * gauss(f, 0.12, 0.05) + 0.8 * gauss(f, 0.3, 0.04) + 1.3 * gauss(f, 0.62, 0.06) - 1.8 * Math.max(0, Math.sin(resp * 2 * Math.PI)); }
export const respF = resp => 0.5 - 0.5 * Math.cos(resp * 2 * Math.PI);
export const CANALES = [
  { k: 'ecg', rot: 'II', alto: 37, col: 'var(--accent-green)', base: 0.72, gan: 0.62 },
  { k: 'art', rot: 'ART', alto: 56, col: 'var(--accent-red)', min: 20, max: 150, lineas: [{ k: '65', v: 65, clase: 'mon-65', rot: '65' }, { k: 'pam', v: () => R.pam, clase: 'mon-pam', rot: 'PAM' }] },
  { k: 'pleth', rot: 'Pleth', alto: 34, col: 'var(--accent-yellow)', base: 0.94, gan: 0.72, oculto: true },
  { k: 'pvc', rot: 'PVC', alto: 36, col: 'var(--accent-purple)', min: 0, max: 30, oculto: true },
  { k: 'resp', rot: 'Resp', alto: 42, col: 'var(--text-dim)', base: 0.92, gan: 0.62, oculto: true },
];
export const monitor = crearMonitor($('trazas'), { canales: CANALES, margen: 30, hueco: 6, borrar: 7, anchoMin: 150 });
export let cinco = false, faseResp = 0, tauLat = 0, pausado = false, R = null;
export const setPausado = v => { pausado = v; };
export const setR = v => { R = v; };
export const SEG = 4.2;
export const montarTrazas = () => monitor.ver(cinco ? CANALES.map(c => c.k) : ['ecg', 'art']);
export function valores(dt) {
  const T = 60 / R.fc, Tr = 60 / R.fr;
  tauLat += dt; if (tauLat >= T) tauLat -= T;
  faseResp = (faseResp + dt / Tr) % 1;
  return { ecg: ecgLatido(tauLat, T, 0.185 * Math.min(1, T / 0.8)), art: artF(tauLat, T, R), pleth: plethF(tauLat, T, R), pvc: pvcF(tauLat, T, faseResp, R), resp: respF(faseResp) };
}
export const muestra = dt => monitor.empujar(valores(dt));
export const pintarTrazas = () => monitor.pintar();
export function llenarEstatico() { monitor.llenar(() => valores(SEG / monitor.NP)); pintarTrazas(); }
$('cinco').addEventListener('click', () => {
  cinco = !cinco;
  $('monitor').classList.toggle('rcv-cinco', cinco); $('cinco').setAttribute('aria-pressed', String(cinco)); $('cinco').textContent = cinco ? '2 curvas' : '5 curvas';
  $('trazas').setAttribute('aria-label', cinco ? 'Curvas del monitor: ECG, presión arterial, pletismografía, PVC y respiración' : 'Curvas del monitor: ECG y presión arterial');
  montarTrazas(); llenarEstatico(); pintarCifras(); medirDock();
});
export let tapado = false;
export const setTapado = v => { tapado = v; };
export function marcaObj(k, v) {
  const o = OBJETIVOS[R.P.obj]?.filas[k]; if (!o || typeof v !== 'number') return { cls: '', txt: '' };
  return o[1](+v.toFixed(k === 'ic' || k === 'irvs' || k === 'lact' ? 1 : 0)) ? { cls: 'si', txt: '<span class="marca si">✓</span>' } : { cls: 'no', txt: '<span class="marca no">✗</span>' };
}
// El lactato no cambia de golpe: tarda horas. Aquí, en segundos (ilustrativo): sigue a su destino con una constante de tiempo
export let lactVis = null, lactClave = '';
export function seguirLactato(dt) {
  if (!R || typeof R.lact !== 'number') { lactVis = null; return; }
  const clave = ST.id + '|' + ST.pac;
  if (lactVis == null || clave !== lactClave) { lactVis = R.lact; lactClave = clave; return; }
  const antes = lactVis; lactVis = seguir(lactVis, R.lact, dt, 0.3);
  if (Math.abs(lactVis - antes) > 0.004 && Math.round(lactVis * 10) !== Math.round(antes * 10)) pintarCifras();
}
export function pintarCifras() {
  const tap = tapado, pa = Math.round(R.pam), mp = marcaObj('pa', R.pam), al = k => monitor.altoDe(k);
  const filas = [
    { k: 'fc', cls: 'c-ecg', et: 'FC', u: 'lpm', v: Math.round(R.fc), alto: al('ecg') },
    { k: 'pa', cls: 'c-art', et: 'ART', u: 'mmHg', v: `${Math.round(R.pas)}/${Math.round(R.pad)}<small>(${pa})</small>`, obj: OBJETIVOS[R.P.obj] ? `${mp.txt} PAM ≥65` : 'sin objetivo', alto: al('art') },
  ];
  if (cinco) filas.push({ k: 'spo2', cls: 'c-sat', et: 'SpO₂', u: '%', v: R.spo2, alto: al('pleth') }, { k: 'pvc', cls: 'c-pvc', et: 'PVC', u: 'mmHg', v: Math.round(R.pvc), alto: al('pvc') },
    { k: 'fr', cls: 'c-resp', et: 'FR', u: 'rpm', v: R.fr, obj: `T ${coma(R.t, 1)} °C`, alto: al('resp') });
  pintarColumna($('cifras'), filas, { tapado: tap });
  const o = OBJETIVOS[R.P.obj], S = R.S;
  const celdas = [{ k: 'ic', et: 'IC', u: 'L/min/m²', d: 1 }, { k: 'irvs', et: 'IRVS', u: 'UW·m²', d: 1 }, { k: 'pvc', et: 'PVC', u: 'mmHg', d: 0 },
    { k: 'lact', et: 'Lactato', u: 'mmol/L', d: 1 }, R.P.base.k != null ? { k: 'k', et: 'K⁺', u: 'mmol/L', d: 1 } : { k: 'glu', et: 'Glucemia', u: 'mg/dL', d: 0 }];
  $('perfusion').innerHTML = celdas.map(p => {
    const v = p.k === 'lact' && typeof R.lact === 'number' && lactVis != null ? lactVis : R[p.k]; let val, t, cls = '';
    if (p.k === 'lact' || p.k === 'glu' || p.k === 'k') {
      const sube = p.k === 'lact' ? R.A.sist.lact > 0 : p.k === 'glu' ? R.A.sist.glu > 0 : R.A.sist.k !== 0;
      if (v == null) { val = '—'; t = 'no la mueve'; cls = 'rcv-apagada'; }
      else if (v === 'sube') { val = '↑'; t = p.k === 'lact' ? 'producción aeróbica' : (S.f.adrenalina && S.f.glucagon ? 'adrenalina y glucagón' : S.f.glucagon ? 'glucagón' : 'el α frena la insulina'); cls = 'encendida'; }
      else { val = coma(v, p.d); t = sube ? (p.k === 'lact' ? 'producción aeróbica' : p.k === 'glu' ? (S.f.glucagon ? 'glucagón' : 'el α frena la insulina') : 'baja: albuterol') : 'de partida'; cls = sube ? 'encendida' : 'apagada'; }
    } else { val = coma(v, p.d); const ob = o?.filas[p.k]; t = ob ? 'obj. ' + ob[0] : p.u; }
    const m = tap || typeof v !== 'number' ? { cls: '', txt: '' } : marcaObj(p.k, v);
    return `<button type="button" class="rcv-celda ${m.cls} ${tap ? 'rcv-oculto' : cls}" data-fila="${p.k}"><span class="rcv-k"><span>${p.et}</span>${m.txt}</span><span class="rcv-g">${tap ? '?' : val}</span><span class="rcv-t">${tap ? '' : t}</span></button>`;
  }).join('');
  $('mon-pie').innerHTML = `${org('curvas y cambios: ilustrativo', true)} ${o ? `<span>Objetivos: ${o.nombre}</span> ${chip(o.cita)}` : '<span>Sin tabla de objetivos</span>'}`;
}
export const EXPLICA_FILA = {
  fc: ['La FC la sube el β₁ del nodo (la dobutamina, +5-15 lpm; la adrenalina). La fenilefrina la baja por reflejo.', C.dobuta],
  pa: ['PAM = GC × RVS + PAD: el fármaco que aprieta el anillo mueve la RVS; el que empuja el miocito, el gasto. Objetivo ≥65 mmHg.', C.pam],
  spo2: ['La SpO₂ no la mueve ningún fármaco de este modelo: su valor es ilustrativo.', null],
  pvc: ['La PVC apenas cambia aquí, salvo en la anafilaxia, donde la fuga hace perder volumen.', C.anaShock],
  fr: ['La FR no tiene objetivo; su valor es ilustrativo.', null],
  ic: ['El IC lo sube el β₁ del miocito (dobutamina, la NA a dosis baja) o la milrinona por debajo de la cerradura.', C.t145],
  irvs: ['IRVS = (PAM − PVC) / IC, en unidades Wood·m². Sale del calibre del anillo: la sube el α₁ (o el V₁). Objetivo 25-30 solo en la Tabla 16.2.', C.t162],
  lact: ['La adrenalina sube el lactato por producción aeróbica: engaña, no es hipoperfusión.', C.adre],
  glu: ['La adrenalina sube la glucemia: el α frena la secreción de insulina. El glucagón también la sube (hiperglucemia leve).', C.adre],
  k: ['El aerosol de β₂ a dosis altas puede bajar el potasio, entre otros efectos.', C.asmaAdv],
};
$('monitor').addEventListener('click', ev => {
  const c = ev.target.closest('[data-fila]'); if (!c || tapado) return;
  const [t, ci] = EXPLICA_FILA[c.dataset.fila] || []; if (!t) return;
  const d = $('detalle-fila'); d.hidden = false; d.innerHTML = `<span>${t}${ci ? ' ' + chip(ci) : ' ' + org('ilustrativo', true)}</span>${ci ? cita(ci) : ''}`;
});

