// Los canales del monitor de la cabecera del shock y cómo lee cada uno el motor (maqueta; en la app, la parte del shock
// de js/core/monitor-uci.js). El DIBUJO del monitor es la pieza común (js/core/monitor.js): aquí solo se dice qué canal
// lee qué. Cada canal lee el MISMO motor que mueve el corazón y los aparatos, muestra a muestra: la presión de la raíz
// aórtica (ART), la de la arteria pulmonar o, al enclavar, la de las venas pulmonares (PAP / PCP, como el catéter vivo:
// js/modules/eco/lecturas.mjs) y la de la aurícula derecha (PVC). El ECG (ecgLatido de la pieza común), la
// pletismografía y la capnografía son formas ilustrativas sincronizadas con el latido y la respiración del modelo. Con el
// balón, la curva punteada es la aórtica sin el volumen del balón; las marcas de disparo (onda R) y de inflado y vaciado
// van encima de su curva.
import { crearMonitor as crearPieza, ecgLatido } from '../../../js/core/monitor.js';

export const CANALES = [
  { k: 'ecg', rot: 'II', alto: 26, col: 'var(--accent-green)', base: 0.7, gan: 0.6 },
  { k: 'art', rot: 'ART', alto: 48, min: 0, max: 150, marcas: [50, 100], col: 'var(--accent-red)', ref: true, lineas: [{ k: '65', v: 65, clase: 'mon-65' }] },
  { k: 'pap', rot: 'PAP', alto: 36, min: 0, max: 50, marcas: [25], col: 'var(--accent-yellow)' },
  { k: 'pvc', rot: 'PVC', alto: 28, min: 0, max: 25, marcas: [10], col: 'var(--accent-purple)' },
  { k: 'pleth', rot: 'Pleth', alto: 24, col: 'var(--text-dim)', base: 0.92, gan: 0.8 },
  { k: 'co2', rot: 'CO₂', alto: 24, min: 0, max: 50, marcas: [], col: 'var(--text-muted)' },
];
const SEG = 4.5;

export function monitorDelShock(svg) {
  const mon = crearPieza(svg, { canales: CANALES, margen: 26, hueco: 4, borrar: 6 });
  let oyente = null, tSim = 0, tProx = 0, faseResp = 0, nLat = -1, ultimoV = 0, enclavado = false, conBalon = false;
  // Una muestra del instante del motor (cab: la cabecera; ctx: FR, EtCO₂, etc.)
  function muestra(cab, ctx) {
    const s = cab.m.s, p = cab.m.p, T = cab.m.periodo, tl = s.tLatido;
    let ecg = ecgLatido(tl, T, p.pr);
    if (ctx.voltajeBajo) ecg *= ctx.voltajeBajo;
    const esR = s.nLatido !== nLat && tl >= p.pr + 0.008;
    if (esR) nLat = s.nLatido;
    const u = cab.lectura?.u, pas = u?.pas ?? 120, pad = u?.pad_ ?? 80;
    // pleth: la presión arterial suavizada y retrasada (ilustrativo), normalizada a su pulso
    ultimoV += ((s.paoDist - pad) / Math.max(4, pas - pad) - ultimoV) * 0.12;
    // capnografía: meseta en la EtCO₂ durante la espiración (ilustrativa)
    faseResp = (faseResp + (SEG / mon.NP) / (60 / (ctx.fr || 14))) % 1;
    const f = faseResp, et = ctx.etco2 || 35;
    const co2 = f < 0.45 ? et * (f < 0.06 ? f / 0.06 : 1) * (0.92 + 0.08 * (f - 0.06) / 0.39) : f < 0.52 ? et * (1 - (f - 0.45) / 0.07) : 0;
    return {
      ecg, art: s.pao, artRef: conBalon && cab.st.vBalon > 0.5 ? s.pao - cab.st.vBalon / p.cAo : null,
      pap: enclavado ? s.pvp : s.pap, pvc: s.pad, pleth: Math.max(0, Math.min(1.1, ultimoV)) * (ctx.amplPleth ?? 1), co2,
      lat: s.nLatido, vBalon: s.vBalon, r: esR && conBalon, ciclo: conBalon && cab.st.vBalon > 20 ? 1 : 0,
    };
  }
  // las marcas del balón: el disparo sobre la onda R y el inflado y el vaciado sobre la curva arterial
  function marcas() {
    const ch = mon.capa('ecg'), ci = mon.capa('art'), r = mon.dato('r'), cy = mon.dato('ciclo'), NP = mon.NP;
    if (ch) { let h = ''; for (let x = 0; x < NP; x++) if (r[x]) h += `<path class="mon-chispa" d="M${mon.x(x)} 2l2.6 4.6h-5.2z"/>`; ch.innerHTML = h; }
    if (ci) { const a = CANALES[1].alto; let h = ''; for (let x = 1; x < NP; x++) { if (cy[x] === 1 && !cy[x - 1]) h += `<path class="mon-infla" d="M${mon.x(x)} ${a - 1}l2.4 -4.2h-4.8z"/>`; if (!cy[x] && cy[x - 1] === 1) h += `<path class="mon-vacia" d="M${mon.x(x)} ${a - 5.2}l2.4 4.2h-4.8z"/>`; } ci.innerHTML = h; }
  }
  function pintar() { mon.pintar(); marcas(); }
  // Avanza el motor dt segundos (en pasos de 0,1 ms) y va tomando muestras al ritmo del barrido
  function avanzar(cab, dt, ctx) {
    const paso = 0.0001, n = Math.round(dt / paso), cada = SEG / mon.NP;
    conBalon = cab.ajuste.soporte === 'balon' || (cab.ajuste.soporte === 'ecmo' && cab.ajuste.venteo === 'balon');
    for (let i = 0; i < n; i++) { cab.paso(paso); tSim += paso; if (tSim >= tProx) { tProx += cada; const mu = muestra(cab, ctx); mon.empujar(mu); oyente?.(mu); } }
  }
  // Llena la pantalla de golpe (al cambiar de paciente, con «reducir movimiento» o en pausa)
  function llenar(cab, ctx) {
    conBalon = cab.ajuste.soporte === 'balon' || (cab.ajuste.soporte === 'ecmo' && cab.ajuste.venteo === 'balon');
    const n = Math.round(SEG / mon.NP / 0.0001);
    mon.llenar(() => { for (let j = 0; j < n; j++) cab.paso(0.0001); const mu = muestra(cab, ctx); oyente?.(mu); return mu; });
    tProx = tSim;
  }
  return {
    alMuestrear(fn) { oyente = fn; }, montar: mon.montar, avanzar, llenar, pintar,
    ver(lista) { mon.ver(lista); },
    enclavar(on) { enclavado = !!on; mon.rotulo('pap', enclavado ? 'PCP' : 'PAP'); },
    get enclavado() { return enclavado; },
  };
}
