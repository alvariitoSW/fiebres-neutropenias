// La página del corazón eléctrico: estado de la sesión, monitor, mandos, explicación guiada y bucle. Se carga al primer abrir
// (index.js); el bucle de animación se para al salir de la vista. La Mayéutica (parte 2) engancha en ponerEstado/taparTodo.
import { crearPlanoGrande } from '../../../core/plano-grande.js';
import { crearMonitor, pintarCifras as pintarColumna, instalarMonitor } from '../../../core/monitor.js';
import { $, IMG, NS, REDUCIR, cita, clamp, coma, org } from './ayudas.js';
import { C, CRECE, ESTADOS, F195, F213, FAMILIAS, FICHAS, GUIAS, LAMINAS, NOMBRE_F, NOTAS, NOTA_TIPO, PACIENTES, PIEZAS, PROFUNDIZAR, aplicarK, fcFig, libroDe, navParaFC, qtExtra } from '../../../data/ritmo-vivo-data.js';
import { pintarGraficas } from './graficas.js';
import { montarEscena, pintarAparatos, pintarEscena, reiniciarD } from './escena.js';
import { MOTOR } from './motor.js';
import { crearTope } from '../../../core/tope.js';
import { ENERGIA_TV, ADE, MAX, calcularTopes, cargando } from './topes.js';
import { G, f1 } from './dibujo.js';
import { crearMayeutica } from './mayeutica.js';
instalarMonitor();
/* ============================================================
   LA PÁGINA: estado de la sesión, el monitor (tiras generadas), el dibujo vivo, los mandos, la explicación guiada,
   las gráficas vivas y la Mayéutica.
   ============================================================ */
export let mo = null, simT = 20, pausado = false, tapado = false, taparTira = false, pest = 'ritmo', familia = 'sinusal';
let agenda = [];
export const S = {};   // el estado de la sesión (el ritmo y lo que se ha hecho)
function resetS(clave) {
  Object.keys(S).forEach(k => delete S[k]);
  Object.assign(S, { clave, fcSA: { sinusal: 75, taquiSinusal: 120 }[clave], rama: 'i', flutter: 2, fcFA: 138, farmaco: null, horas: 0, llenadoMalo: false,
    tamCada: 0.5, mobitz: 'I', escape: 'nodal', wpwFa: false, wpwNodo: false, qt: {}, tdp: false, k: 4.2, sexo: 'v', deriv: clave === 'stemi' ? 'V2' : 'II', st: 2.5, inestable: false,
    bomba: null, desfib: null, adeno: null, parada: null, mensaje: null, tdpMg: false, dosis: {}, sinusal: false });
  if (clave === 'torsade') S.qt = { haloperidol: true, claritromicina: true, kBajo: true, mgBajo: true };
  if (['fv', 'aesp', 'asistolia'].includes(clave)) S.parada = { comp: false, choques: 0, adrenalina: [], amio: 0, insufl: 10, escenario: 'responde', reloj: 0, ciclo: null, rce: false, minuto: 5, causa: null };
}
const est = () => ESTADOS[S.clave];

/* ---------- Arrancar un estado: un motor nuevo con su configuración, y 6 s de historia para llenar la tira ---------- */
function ponerEstado(clave, extra = {}) {
  if (typeof planoLupas !== 'undefined' && planoLupas.abierto) planoLupas.cerrar();
  resetS(clave); Object.assign(S, extra);
  arrancarMotor();
  if (est().fam && est().fam !== familia) familia = est().fam;
  pintarDock(); pintarFicha(); pintarFuentes(); pintarGraficas(); pintarFrase(); pintarAparatos(); pintarLaminas(); pintarMini();
  $('peligro').hidden = true;
}
function arrancarMotor() {
  agenda = [];
  mo = MOTOR.crear({ semilla: 11 });
  const t0 = simT - 6;
  est().aplicar(mo, t0, S);
  mo.avanzar(simT + 0.07);
  montarMonitor(); llenarEstatico(); reiniciarD(); pintarEscena(simT);
}

/* ---------- El monitor: la pieza común (js/core/monitor.js). Aquí, qué lee cada tira; el papel es el del ECG ---------- */
const PXS = 110;          // píxeles por segundo: 0,04 s = 4,4 px (1 mm del papel a 25 mm/s)
const MM = 4.4;           // 1 mm en la tira (también 0,1 mV en vertical: 10 mm/mV)
const yEcg = v => 52 - v * 10 * MM, yArt = v => 43 - clamp(v - 20, 0, 130) / 130 * 40, yCo2 = v => 37 - clamp(v, 0, 50) / 50 * 33;
const TIRAS = [
  { k: 'ecg', rot: 'II', alto: 86, col: 'var(--accent-green)', y: yEcg, papel: { mm: MM, base: 52 } },
  { k: 'art', rot: 'ART', alto: 46, col: 'var(--accent-red)', y: yArt },
  { k: 'co2', rot: 'CO₂', alto: 40, col: 'var(--accent-blue)', y: yCo2, oculto: true },
];
const monitor = crearMonitor($('rtv-tiras'), { canales: TIRAS, margen: 0, hueco: 1, borrar: 8, prefijo: 'rtv-', anchoMin: 180 });
let SEG = 3.2, acum = 0, KB = 1, cuentaB = 0;   // KB: pasos de simulación por píxel (2 = barrido a la mitad, 12,5 mm/s, solo en la familia «Lentos»)
const rotuloMonitor = () => { $('mon-tit').textContent = `Monitor · derivación ${S.deriv}` + (KB === 2 ? ' · barrido a 12,5 mm/s' : ''); };
function montarMonitor() {
  $('mon-reloj').toggleAttribute('hidden', !S.parada);
  KB = est().fam === 'lentos' ? 2 : 1; cuentaB = 0;
  rotuloMonitor();
  monitor.rotulo('ecg', S.deriv);
  monitor.ver(S.parada ? ['ecg', 'art', 'co2'] : ['ecg', 'art']);
  SEG = monitor.NP * KB / PXS;
  const W = monitor.NP, h = TIRAS[0].alto;
  monitor.fondo('ecg').innerHTML = '<g id="rtv-m-ecg"></g>';
  monitor.capa('ecg').innerHTML = `<g id="rtv-m-calibre"></g><rect id="rtv-tapa-tira" x="0" y="0" width="${W}" height="${h}" fill="var(--bg-main)" fill-opacity=".96"${taparTira ? '' : ' hidden'}/><text id="rtv-tapa-tira-txt" x="${W / 2}" y="46" font-size="11" text-anchor="middle" fill="var(--text-dim)" font-family="system-ui, sans-serif"${taparTira ? '' : ' hidden'}>Predice antes de mirar la tira</text>`;
  pintarCifras();
}
// Lo que el monitor suma a lo que genera el corazón: las compresiones, el choque y la presión de la RCP (ilustrativos)
const P_ = () => S.parada;
function compresionesEn(t) { const p = P_(); if (!p || !p.comp || p.rce) return false; if (S.desfib && S.desfib.tChoque && t > S.desfib.tChoque - 0.5 && t < S.desfib.tChoque + 0.35) return false; return true; }
const fasComp = t => (t * 110 / 60) % 1;
export function ecgEn(t) {
  let v = MOTOR.voltaje(mo, t, S.deriv, S.clave === 'stemi' ? { lesion: lesionMm() } : {});
  // Con el potasio muy alto el QRS y la T se funden en una onda sinuosa (p. 21): se alisa el trazo (cuánto: ilustrativo)
  if (S.clave === 'hiperk' && S.k > 7.4) {
    const a = clamp((S.k - 7.4) / 0.8, 0, 1), W = [-0.1, -0.067, -0.033, 0, 0.033, 0.067, 0.1].map(d => [d, Math.exp(-d * d / (2 * (0.035 + 0.03 * a) ** 2))]);
    let sv = 0, sw = 0; for (const [d, w] of W) { sv += w * MOTOR.voltaje(mo, t + d, S.deriv, {}); sw += w; }
    v = (1 - a) * v + a * (sv / sw) * 1.7;
  }
  // Espiga del marcapasos: una raya fina (9,5 ms: la tira muestrea cada 9 ms y una de 1,5 ms casi nunca caía en un píxel) 45 ms antes de cada disparo del foco (el QRS arranca tras un tramo plano, como en la ficha, p. 159; aparte del voltaje del motor; amplitud ilustrativa)
  if (mo.m.foco && mo.m.foco.espiga) for (let i = mo.m.espigas.length - 1; i >= 0; i--) { const d = t - mo.m.espigas[i] + 0.045; if (d < 0) continue; if (d > 0.0095) break; v += 0.7; }
  if (compresionesEn(t)) v += 0.32 * Math.pow(Math.max(0, Math.sin(2 * Math.PI * fasComp(t))), 3);
  if (S.desfib && S.desfib.tChoque && t >= S.desfib.tChoque && t < S.desfib.tChoque + 0.2) v += 2.4 * Math.exp(-(t - S.desfib.tChoque) / 0.04);
  return v;
}
function lesionMm() { const st = S.st; return { V2: st, V3: st * 1.04, II: 0.2 }; }
let latCache = { t: -1, lat: [] };
export function latidos(t) { if (Math.abs(latCache.t - t) > 0.05) latCache = { t, lat: mo.latidosMecanicos(t - 7, t + 0.1) }; return latCache.lat; }
function adrenalinaActiva(t) { const p = P_(); return !!(p && p.adrenalina.some(a => t >= a && t < a + 18)); }   // ~3 min de la ficha, con el reloj ×10
// Presión de perfusión coronaria (aórtica − AD entre compresiones, p. 61-62): 22 mmHg en RCP buena (lectura de la Fig. 21.3, p. 62);
// con adrenalina ×1,3 (el +30 % del texto, p. 62); con 30 insuflaciones/min ×0,8 (la fuente solo dice que baja, p. 58: cuánto, ilustrativo)
const PPC_BASE = F213[0][1];
const ppcEn = t => PPC_BASE * (adrenalinaActiva(t) ? 1.3 : 1) * (P_() && P_().insufl === 30 ? 0.8 : 1);
function artEn(t) {
  const p = P_();
  if (p && !p.rce) { let v = 6; if (compresionesEn(t)) { const f = fasComp(t); v = ppcEn(t) + 34 * (f < 0.3 ? Math.sin(f / 0.3 * Math.PI) : 0) * (p.insufl === 30 ? 0.8 : 1); } return v; }
  return mo.presion(t, latidos(t));
}
function etco2En(t) {
  const p = P_(); if (!p) return 36;
  if (p.rce) return 42;
  if (!compresionesEn(t)) return 4;
  return p.insufl === 30 ? 13 : 20;
}
function capnoEn(t) {
  const p = P_(), fr = p && !p.rce ? p.insufl : 10, f = (t * fr / 60) % 1, alto = etco2En(t), meseta = fr === 30 ? 0.42 : 0.62;
  if (f < 0.06) return alto * f / 0.06; if (f < meseta) return alto * (0.95 + 0.05 * (f - 0.06) / (meseta - 0.06)); if (f < meseta + 0.06) return alto * (1 - (f - meseta) / 0.06); return 0;
}
const valoresEn = t => ({ ecg: ecgEn(t), art: artEn(t), co2: S.parada ? capnoEn(t) : null, t, cz: cerradoEn(t) });
function muestra(t) { monitor.empujar(valoresEn(t)); }
const cerradoEn = t => !!(mo && t >= mo.m.cerrojo && t < mo.m.cerrojoFin && mo.m.cerrojoFin < 1e8);   // el bloqueo permanente (BAV completo) no es un cerrojo pasajero: sin caja roja
function pintarTiras() {
  monitor.pintar();
  // el nodo AV cerrado: una caja roja sobre la tira mientras dura el cerrojo
  const cz = monitor.dato('cz'), W = monitor.NP, alto = TIRAS[0].alto;
  let h = '', x0 = -1;
  for (let x = 0; x <= W; x++) { const on = x < W && cz[x]; if (on && x0 < 0) x0 = x; if (!on && x0 >= 0) { h += `<rect x="${x0}" y="2" width="${x - x0}" height="${alto - 4}" fill="var(--accent-red)" fill-opacity=".1" stroke="var(--accent-red)" stroke-opacity=".6" stroke-dasharray="3 3"/>` + (x - x0 > 70 && !S.medir ? `<text x="${x0 + 4}" y="${alto - 7}" font-size="9" fill="var(--accent-red)" font-family="system-ui, sans-serif">nodo AV cerrado</text>` : ''); x0 = -1; } }
  const g = $('m-ecg'); if (g) g.innerHTML = h;
}
function llenarEstatico() {
  if (!mo) return;
  const paso = KB / PXS;
  monitor.llenar(i => valoresEn(simT - SEG + i * paso));
  pintarTiras();
}

/* ---------- Las cifras del monitor: todas salen del motor ---------- */
function leer() {
  if (!mo) return null;
  // La ventana de lectura son los últimos 7 s, pero solo desde el último suceso (choque, fármaco que cierra el nodo, vuelta del
  // sinusal): lo anterior era otro ritmo. Hasta tener 2 latidos del ritmo nuevo, el monitor dice «midiendo».
  const ven = 7, desde = Math.max(simT - ven, ...(S.eventos || []).filter(e => e <= simT)), t = simT;
  const elec = mo.latidosV.filter(b => !b.choque && b.n >= 0.5 * b.total && b.fin - b.t0 < 0.45 && b.t0 > desde && b.t0 <= t - 0.02);
  const midiendo = desde > simT - ven && elec.length < 2 && !(mo.m.fv || (mo.m.foco && S.tdp));
  // la FC del monitor: media de los últimos latidos (en la FA, de toda la ventana: es irregular); si se hace una pausa,
  // cae con ella (no va detrás del dibujo)
  const ritmo = (lista, tt) => { const u = mo.m.fa || mo.m.hisCada || S.clave === 'bav2' ? lista : lista.slice(-6); if (!u.length) return null; if (u.length < 2) return null; let f = 60 * (u.length - 1) / (tt(u[u.length - 1]) - tt(u[0])); const gap = t - tt(u[u.length - 1]), rrM = f ? 60 / f : 1; if (gap > Math.max(1.1, 1.6 * rrM)) f = 60 / gap; return f == null ? null : Math.round(f); };
  let fc = ritmo(elec, b => b.t0);
  const caos = mo.m.fv || (mo.m.foco && S.tdp);
  const lat = latidos(t).filter(b => b.t > desde && b.t <= t);
  const palp = lat.filter(b => b.amp >= 12);
  // el pulso se mide en la misma ventana que la FC (los últimos 6 latidos; en la FA, toda la ventana) y solo se separa de ella en la FA (déficit de pulso)
  let pul = 0; if (fc != null && palp.length && lat.length) { if (mo.m.fa) { const w0 = elec.length ? elec[0].t0 - 0.05 : desde, u = lat.filter(b => b.t >= w0), pu = u.filter(b => b.amp >= 12); pul = Math.min(fc, Math.round(fc * pu.length / Math.max(1, u.length))); } else pul = fc; }
  // la PA, latido a latido como el monitor: la sistólica, el pico de cada uno de los últimos 4 latidos que mueven sangre;
  // la diastólica, la presión justo antes de su subida. En la parada o sin latidos, lo más alto y lo más bajo de 3 s
  let pas = 0, pad = 999;
  const conPulso = (P_() && !P_().rce) ? [] : lat.filter(b => b.amp > 0 && b.t <= t - 0.4).slice(-4);
  if (conPulso.length) { pas = 0; pad = 0; for (const b of conPulso) { let mx = 0; for (let s = b.t; s <= b.t + 0.4; s += 0.01) mx = Math.max(mx, artEn(s)); pas += mx; pad += artEn(b.t + 0.06); } pas /= conPulso.length; pad /= conPulso.length; }
  else for (let s = Math.max(t - 3, desde); s <= t; s += 0.02) { const p = artEn(s); pas = Math.max(pas, p); pad = Math.min(pad, p); }
  const ult = elec[elec.length - 1], prev = elec[elec.length - 2];
  let qrs = null, pr = null, qt = null, qtc = null, rr = null;
  if (ult) {
    // el QRS se mide sobre latidos completos (con su silencio detrás) y en mediana de 3: un latido a medias no cuenta
    const comp = elec.filter(b => t - b.fin > 0.06).slice(-3), cu = comp[comp.length - 1] || ult;
    const anchos = comp.map(b => b.fin - b.t0 + 0.022).sort((x, y) => x - y);
    qrs = anchos.length ? anchos[Math.floor(anchos.length / 2)] : ult.fin - ult.t0 + 0.022;
    const sq = ult.n && mo.reg ? anchoKernel(cu) : 0.0055;
    const a = mo.latidosA.filter(x => x.t0 < cu.t0 - 0.04 && x.t0 > cu.t0 - 0.4).pop();
    if (a && !mo.m.fa && !mo.m.flOn && mo.m.sa !== false && !bloqueoCompleto()) pr = (cu.t0 - 2 * sq) - (a.t0 - 0.022);
    if (prev) rr = ult.t0 - prev.t0;
    const fin = elec.length >= 2 ? prev : ult;
    qt = (fin.r1 - 0.075 + 2.2 * 0.042 * mo.m.tAncho) - (fin.t0 - 2 * sq);
    const rrQ = elec.length >= 3 ? fin.t0 - elec[elec.length - 3].t0 : rr || 0.8;
    qtc = qt / Math.sqrt(rrQ);
  }
  return { midiendo, fa: !!mo.m.fa, fc: caos ? null : fc, pul: caos ? 0 : pul, pas: Math.round(pas), pad: Math.round(pad), qrs, pr, qt, qtc, rr, ult, prev, caos };
}
const bloqueoCompleto = () => !!mo && mo.m.cerrojoFin > 1e8;   // BAV completo y marcapasos sobre él: las P no conducen, no hay PR
function anchoKernel(b) {   // ¿llegó por His-Purkinje (estrecho) o por el músculo (ancho)? Lo dice el registro del motor
  let p = 0, m = 0; for (const a of mo.reg) { if (a.t < b.t0 - 0.001 || a.t > b.fin + 0.001) continue; const nd = G.nodos[a.k]; if (nd.tipo !== 'v') continue; if (a.et === 1) p++; else m++; }
  return m > p ? 0.0055 * 2.1 * Math.max(1, mo.m.musV) : 0.0055;
}
let ultLect = null;
function pintarCifras() {
  const c = $('mon-cifras');
  if (!mo) return;
  const L = leer(); ultLect = L; const p = P_();
  const cel = (k, cls, et, v, u, o, estado = '') => ({ k, cls, et, v, u, obj: o, estado });
  const parada = p && !p.rce;
  const celdas = [cel('fc', 'c-ecg', 'FC', L.caos ? (mo.m.fv ? 'FV' : 'TV') : L.midiendo || L.fc == null ? '—' : L.fc, 'lpm', 'del ECG · ilustrativo')];
  const sinPulso = parada ? !p.comp : L.midiendo ? false : L.pas - L.pad < 6;
  celdas.push(cel('art', 'c-art', 'ART', sinPulso || L.midiendo ? '—' : `${L.pas}/${L.pad}`, 'mmHg', parada ? (p.comp ? 'tus manos · ilustrativo' : 'sin pulso') : L.midiendo ? 'midiendo…' : sinPulso ? 'sin pulso' : 'ilustrativo', parada || sinPulso || L.pas < 90 ? 'no' : ''));
  const def = L.fa && L.fc && !parada ? Math.max(0, L.fc - L.pul) : 0;
  if (parada) { const ad = adrenalinaActiva(simT), ins = p.insufl === 30; celdas.push(cel('ppc', 'c-sat', 'PPC', p.comp ? Math.round(ppcEn(simT)) : '—', 'mmHg', !p.comp ? 'sin compresiones' : ad && ins ? 'ilustrativo' : ad ? '+30 % · p. 62' : ins ? 'ilustrativo' : 'lectura · p. 62', p.comp && ins ? 'ojo' : '')); }
  else celdas.push(cel('pulso', 'c-sat', 'Pulso', parada ? 0 : L.midiendo || L.fc == null ? '—' : L.pul, def > 3 ? `déficit ${def}` : 'lpm', def > 3 ? 'Fig. 19.4 · p. 22' : 'en la muñeca', def > 3 ? 'no' : ''));
  const k4 = cuartaCifra(L);
  celdas.push(cel(k4.k, 'c-co2', k4.et, k4.v, k4.u, k4.o, k4.cls || ''));
  pintarColumna(c, celdas, { tapado });
}
function cuartaCifra(L) {
  const p = P_();
  if (p) return { k: 'co2', et: 'ETCO₂', v: Math.round(etco2En(simT)), u: 'mmHg', o: p.rce ? 'sube de golpe · Fig. 21.2' : 'ilustrativo', cls: p.rce ? 'si' : '' };
  if (S.clave === 'torsade') { const v = S.tdp ? null : L.qtc; return { k: 'qt', et: 'QTc', v: v ? coma(v, 2) : '—', u: 's', o: '>0,5: riesgo · p. 35', cls: v > 0.5 ? 'no' : v > 0.44 ? 'ojo' : 'si' }; }
  if (S.clave === 'stemi') { const mm = lesionMm()[S.deriv], lim = umbralST(); return { k: 'st', et: `ST ${S.deriv}`, v: coma(mm, 1), u: 'mm', o: `umbral ${coma(lim, 1)} · p. 41`, cls: mm >= lim ? 'no' : 'si' }; }
  if (S.clave === 'hiperk') return { k: 'k', et: 'K⁺', v: coma(S.k, 1), u: 'mEq/l', o: 'Nefrología al día · p. 21', cls: S.k >= 6.5 ? 'no' : S.k > 5.5 ? 'ojo' : 'si' };
  const q = L.caos ? null : L.qrs; return { k: 'qrs', et: 'QRS', v: q ? coma(q, 2) : '—', u: 's', o: 'ilustrativo · corte 0,12 p. 18', cls: q > 0.12 ? 'no' : '' };
}
const umbralST = () => (S.deriv === 'II' ? 1 : S.sexo === 'm' ? 1.5 : 2);

/* ---------- Los mandos (el dock): Ritmo · Tratar · Medir ---------- */
const tog = (acc, t, small, extra = '') => `<button type="button" class="rtv-tog${extra.includes('rtv-peligro') ? ' rtv-peligro' : ''}" data-acc="${acc}" ${extra.replace(/class="[^"]*"/, '')}>${t}${small ? `<small>${extra.includes('rtv-peligro') ? '⚠ ' : ''}${small}</small>` : ''}</button>`;
const MINI = { nodal: ['av', 'El torniquete del nodo AV', 'Mira cómo la onda baja por un carril y vuelve por el otro; la adenosina echa el cerrojo.'], aberrancia: ['av', 'El torniquete del nodo AV', 'La reentrada nace aquí; la rama bloqueada ensancha el QRS.'], flutter: ['av', 'El torniquete del nodo AV', 'Deja pasar uno de cada dos o tres impulsos de la aurícula.'], fa: ['av', 'El torniquete del nodo AV', 'Deja pasar lo que encuentra rearmado: de ahí el R-R irregular.'], tam: ['av', 'El torniquete del nodo AV', 'Los impulsos llegan a destiempo y solo pasan los que lo encuentran rearmado.'], wpw: ['av', 'El atajo junto al nodo', 'El atajo no tiene torniquete: la onda llega antes al ventrículo.'], torsade: ['celula', 'La célula del ventrículo', 'Lo que alarga el potencial de acción alarga el QT.'], hiperk: ['celula', 'La célula del ventrículo', 'El potasio alto cambia el potencial y, con él, el ECG.'] };
function pintarMini() {
  const m = MINI[S.clave], c = $('mini-lupa'); c.hidden = !m; if (!m) return;
  const id = m[0] === 'av' ? 'rtv-lupa-av' : 'rtv-celula', vb = m[0] === 'av' ? '4 312 174 108' : '182 312 174 108';
  $('mini-lupa-svg').setAttribute('viewBox', vb); $('mini-lupa-svg').innerHTML = `<use href="#${id}"/>`;
  $('mini-tit').textContent = m[1]; $('mini-txt').textContent = m[2];
}
$('mini-grande').addEventListener('click', () => abrirLupas());
/* El dock se repinta muchas veces: si la forma es la misma (solo cambian textos, pulsados, apagados), se ajustan los nodos que hay
   en vez de sustituirlos, para no perder el botón que el dedo tiene delante a mitad de un toque. */
function igualarNodo(a, b) {
  if (a.nodeType !== b.nodeType || a.nodeName !== b.nodeName) return false;
  if (a.nodeType === 3) { if (a.data !== b.data) a.data = b.data; return true; }
  if (a.nodeType !== 1 || a.childNodes.length !== b.childNodes.length) return false;
  for (const at of [...a.attributes]) if (!b.hasAttribute(at.name) && !at.name.startsWith('data-jm')) a.removeAttribute(at.name);
  for (const at of b.attributes) if (a.getAttribute(at.name) !== at.value) a.setAttribute(at.name, at.value);
  if (a.nodeName === 'INPUT') a.value = b.value;
  return [...a.childNodes].every((c, i) => igualarNodo(c, b.childNodes[i]));
}
function igualarDock(caja, html) {
  const t = document.createElement('div'); t.innerHTML = html;
  if (caja.childNodes.length === t.childNodes.length && caja.childNodes.length && [...caja.childNodes].every((c, i) => igualarNodo(c, t.childNodes[i]))) return;
  caja.innerHTML = html;
}
function pintarDock() {
  document.querySelectorAll('.rtv-dock-tabs [data-pest]').forEach(b => b.setAttribute('aria-selected', String(b.dataset.pest === pest)));
  const h = [];
  if (pest === 'ritmo') {
    h.push(`<div class="rtv-familias" role="group" aria-label="Familias de ritmos">${FAMILIAS.map(([k, n]) => `<button type="button" data-fam="${k}" aria-pressed="${familia === k}">${n}</button>`).join('')}</div>`);
    h.push(`<div class="rtv-chips" role="group" aria-label="Ritmos">${Object.entries(ESTADOS).filter(([, e]) => e.fam === familia).map(([k, e]) => `<button type="button" data-estado="${k}" aria-pressed="${S.clave === k}">${e.corto}</button>`).join('')}</div>`);
  } else if (pest === 'tratar') h.push(mandosTratar());
  else h.push(mandosMedir());
  igualarDock($('dock-panel'), h.join(''));
  for (const r of $('dock-panel').querySelectorAll('input[type=range]')) r.oninput = e => deslizar(e.target);
  aplicarTopes(); tope.refrescar();   // el dock se rehízo: los botones nuevos vuelven a apagarse
  medirDock();
}
function mandosTratar() {
  const c = S.clave, h = [];
  const nota = t => `<p class="rtv-dock-nota">${t}</p>`;
  if (c === 'sinusal' || c === 'taquiSinusal') h.push(`<div class="rtv-deslizador"><input type="range" id="rtv-d-fcsa" min="${c === 'sinusal' ? 50 : 100}" max="150" step="5" value="${S.fcSA}" aria-label="Frecuencia del nodo sinusal"><output id="rtv-o-fcsa">${S.fcSA} lpm<small>reloj sinusal · ilustrativo</small></output></div>`, nota(c === 'sinusal' ? 'El reloj del nodo sinusal (Libro Azul: 70-80/min). Por encima de 100, taquicardia sinusal (p. 18).' : 'La taquicardia sinusal es una respuesta: busca la causa (p. 18).'));
  if (c === 'rama') h.push(`<div class="rtv-seg" role="group">${[['i', 'Rama izquierda'], ['d', 'Rama derecha']].map(([k, n]) => `<button type="button" data-rama="${k}" aria-pressed="${S.rama === k}">${n}<small>bloqueada</small></button>`).join('')}</div>`, nota('Qué rama y cómo se dibuja: fisiología general. Que un bloqueo de rama ensancha el QRS: p. 20-21.'));
  if (c === 'nodal') h.push(`<div class="rtv-rejilla" style="--n:3">${tog('vagal-v', 'Valsalva', '24 %')}${tog('vagal-m', 'Valsalva modificada', '44 %')}${tog('vagal-c', 'Masaje carotídeo', '9 %')}</div>`,
    `<div class="rtv-rejilla" style="--n:4">${tog('ade6', 'Adenosina', '6 mg')}${tog('ade12', 'Adenosina', '12 mg')}${tog('dilt-nodo', 'Diltiazem', 'si falla')}${tog('reinicio', 'Otra', 'reentrada')}</div>`, nota('Tiempo comprimido (ilustrativo). Los porcentajes, de un estudio (p. 29): cada intento es una tirada. Valsalva modificada: ensayo REVERT, Appelboam 2015 (PMID 26314489).'));
  if (c === 'flutter') h.push(`<div class="rtv-seg" role="group">${[2, 3].map(n => `<button type="button" data-flutter="${n}" aria-pressed="${S.flutter === n}">Conducción ${n}:1</button>`).join('')}</div>`, nota('El libro da la conducción 2:1 o 3:1 (p. 18); la frecuencia de la aurícula, no: fisiología general.'));
  if (c === 'fa') h.push(`<div class="rtv-seg" role="group" aria-label="Fármaco">${[[null, 'Sin fármaco'], ['dilt', 'Diltiazem'], ['amio', 'Amiodarona'], ['digo', 'Digoxina']].map(([k, n]) => `<button type="button" data-far="${k || ''}" aria-pressed="${S.farmaco === k}">${n}</button>`).join('')}</div>`,
    `<div class="rtv-deslizador"><input type="range" id="rtv-d-horas" min="0" max="6" step="0.5" value="${S.horas}" aria-label="Horas desde el fármaco" ${F195[S.farmaco] ? '' : 'disabled'}><output id="rtv-o-horas">${coma(S.horas, 1)} h<small>desde la dosis · Fig. 19.5</small></output></div>`,
    `<div class="rtv-rejilla" style="--n:3">${tog('esmolol', 'Esmolol', 'betabloqueante', `aria-pressed="${S.farmaco === 'esmo'}"`)}${tog('llenado', 'Llenado malo', 'estenosis mitral, hipertrofia', `aria-pressed="${S.llenadoMalo}"`)}${tog('cv-fa', 'Cardioversión', '100 J sincronizada')}</div>`);
  if (c === 'tam') h.push(`<div class="rtv-rejilla" style="--n:3">${tog('mg-tam', 'Magnesio', '2 g + 6 g en 6 h')}${tog('meto-tam', 'Metoprolol', 'si no hay EPOC')}${tog('vera-tam', 'Verapamilo', 'con EPOC')}</div>`, `<div class="rtv-rejilla" style="--n:1">${tog('reinicio', 'Empezar otra vez', '')}</div>`);
  if (c === 'bav2') h.push(`<div class="rtv-seg" role="group" aria-label="Tipo de bloqueo">${[['I', 'Mobitz I', 'nodo AV'], ['II', 'Mobitz II', 'infranodal'], ['2:1', 'Bloqueo 2:1', 'nodo o His']].map(([k, n, d]) => `<button type="button" data-mobitz="${k}" aria-pressed="${S.mobitz === k}">${n}<small>${d}</small></button>`).join('')}</div>`, nota('El sitio del bloqueo (nodo o His) no se ve en el ECG de superficie; en el 2:1 hay que distinguirlo, y la guía ESC 2021 lo pide para decidir el marcapasos (p. 26; PDF 27). El libro define el Mobitz II como 3 o más P por QRS; aquí se dibuja el clásico, con una P bloqueada de cada tres y el PR fijo: convención habitual, no de la ficha (<button type="button" class="especialidad-link" data-especialidad="pifCardio" data-view="ecgArritmias" data-panel="panel-pif-ecg-tabs" data-tab="ecg-f8" data-resaltar="#ecg8-nota-mobitz">Ver en la ficha</button>). Sin dosis: la guía no las da.'));
  if (c === 'bav3') h.push(`<div class="rtv-seg" role="group" aria-label="Dónde nace el escape">${[['nodal', 'Escape nodal', '45 lpm · QRS estrecho'], ['vent', 'Escape ventricular', '≈ 32 lpm · QRS ancho']].map(([k, n, d]) => `<button type="button" data-escape="${k}" aria-pressed="${S.escape === k}">${n}<small>${d}</small></button>`).join('')}</div>`, nota('Escape nodal: 40-60 por minuto, QRS estrecho; ventricular: menos de 40, QRS ancho (ficha, p. 115). Los 45 y ≈ 32 lpm del modelo son valores dentro del rango de la ficha (no cifras de la ficha); cuánto se ensancha el QRS: ilustrativo. Sin dosis: la guía no las da.'));
  if (c === 'marcapasos') h.push(nota('Marcapasos sobre un bloqueo AV completo: el electrodo del ventrículo derecho dispara a 70 lpm (ilustrativo: la guía ESC 2021 cita 70 como mínimo programado solo para la FA permanente con bloqueo, p. 28). Las P (≈ 90, ilustrativo) siguen su ritmo y se ven caminar respecto a las espigas. Sin dosis ni programación: no se simulan.'));
  if (c === 'wpw') {
    if (!S.wpwFa) h.push(`<div class="rtv-rejilla" style="--n:1">${tog('llegafa', 'Llega una FA', 'con la vía accesoria')}</div>`, nota('Fíjate antes en el PR y en el comienzo del QRS (pestaña Medir).'));
    else h.push(`<div class="rtv-rejilla" style="--n:3">${tog('w-dilt', 'Diltiazem', 'frena el nodo', 'class="rtv-tog rtv-peligro"')}${tog('w-bb', 'Betabloqueante', 'frena el nodo', 'class="rtv-tog rtv-peligro"')}${tog('w-digo', 'Digoxina', 'frena el nodo', 'class="rtv-tog rtv-peligro"')}</div>`,
      S.fvWpw ? `<div class="rtv-rejilla" style="--n:2">${tog('desf-wpw', 'Desfibrilar', 'no sincronizado')}${tog('reinicio', 'Empezar', 'otra vez')}</div>` : `<div class="rtv-rejilla" style="--n:3">${tog('w-amio', 'Amiodarona', 'o procainamida')}${tog('cv-wpw', 'Cardioversión', 'eléctrica')}${S.wpwNodo ? tog('verfv', 'Ver lo que', 'puede pasar') : tog('reinicio', 'Empezar', 'otra vez')}</div>`);
  }
  if (c === 'tv') h.push(`<div class="rtv-seg" role="group">${[[false, 'Estable'], [true, 'Inestable']].map(([k, n]) => `<button type="button" data-inest="${k}" aria-pressed="${S.inestable === k}">${n}</button>`).join('')}</div>`,
    `<div class="rtv-rejilla" style="--n:4">${tog('amio-tv', 'Amiodarona', '150 mg en 10 min')}${tog('ade-tv', 'Adenosina', 'si dudas')}${tog('cv-tv', 'Cardioversión', S.choquesTV ? '200 J' : '100 J sinc.')}${tog('reinicio', 'Otra', 'vez')}</div>`);
  if (c === 'aberrancia') h.push(`<div class="rtv-rejilla" style="--n:2">${tog('ade-ab', 'Adenosina', '6 mg')}${tog('reinicio', 'Empezar otra vez', '')}</div>`, nota('Fig. 19.8: estable y sin certeza de TV → adenosina.'));
  if (c === 'torsade') {
    if (!S.tdp) h.push(`<div class="rtv-rejilla" style="--n:3">${[['haloperidol', 'Haloperidol'], ['claritromicina', 'Claritromicina'], ['amiodarona', 'Amiodarona'], ['kBajo', 'K⁺ bajo'], ['mgBajo', 'Mg²⁺ bajo'], ['caBajo', 'Ca²⁺ bajo']].map(([k, n]) => tog('qt-' + k, n, k.endsWith('Bajo') ? 'en la analítica' : 'en la hoja', `aria-pressed="${!!S.qt[k]}"`)).join('')}</div>`,
      `<div class="rtv-rejilla" style="--n:1">${tog('tdp', 'Ver lo que puede pasar', 'con este QTc', ultLect && ultLect.qtc > 0.5 ? '' : 'disabled')}</div>`);
    else h.push(`<div class="rtv-rejilla" style="--n:3">${tog('desf-tdp', 'Desfibrilar', 'no sincronizado')}${tog('mg-tdp', 'Magnesio', '1-2 g en 15 min', `aria-pressed="${S.tdpMg}"`)}${tog('corregir', 'Corregir K⁺ y Mg²⁺', 'y retirar el fármaco')}</div>`);
  }
  if (S.parada) {
    const p = S.parada, fv = c === 'fv' && !p.rce;
    h.push(`<div class="rtv-rejilla" style="--n:4">${tog('comp', 'Compresiones', '5-6 cm · 100-120', `aria-pressed="${p.comp}"`)}${fv ? tog('choque', 'Choque', '120-200 J') : tog('choque', 'Choque', 'no desfibrilable', 'disabled')}${tog('adre', 'Adrenalina', '1 mg IV/IO')}${tog('amio-pcr', 'Amiodarona', p.amio ? '150 mg' : '300 mg', c === 'fv' ? '' : 'disabled')}</div>`);
    h.push(`<div class="rtv-seg" role="group" aria-label="Insuflaciones">${[10, 30].map(n => `<button type="button" data-insufl="${n}" aria-pressed="${p.insufl === n}">${n} insuflaciones/min<small>${n === 10 ? 'lo recomendado' : 'el triple'}</small></button>`).join('')}</div>`);
    if (c === 'fv') h.push(`<div class="rtv-seg" role="group" aria-label="Qué pasa con los choques">${[['responde', 'Responde al 1.º'], ['tras', 'Tras adrenalina y amiodarona'], ['refractaria', 'No cede']].map(([k, n]) => `<button type="button" data-esc="${k}" aria-pressed="${p.escenario === k}">${n}</button>`).join('')}</div>`,
      `<div class="rtv-deslizador"><input type="range" id="rtv-d-min" min="5" max="20" step="1" value="${p.minuto}" aria-label="Minuto del primer choque"><output id="rtv-o-min">min ${p.minuto}<small>1.er choque · Fig. 21.1</small></output></div>`, nota('Qué choque funciona: ilustrativo. El reloj de la parada va 10 veces más deprisa.'));
    if (c !== 'fv') h.push(`<div class="rtv-rejilla" style="--n:4">${['Neumotórax a tensión', 'Taponamiento', 'Tromboembolismo', 'Trombosis coronaria'].map((n, i) => tog('causa-' + i, n, 'una de las T', `aria-pressed="${p.causa === i}"`)).join('')}</div>`);
    h.push(`<div class="rtv-rejilla" style="--n:1">${tog('reinicio', 'Empezar otra vez', '')}</div>`);
  }
  if (c === 'stemi') h.push(`<div class="rtv-seg" role="group">${[['v', 'Varón'], ['m', 'Mujer']].map(([k, n]) => `<button type="button" data-sexo="${k}" aria-pressed="${S.sexo === k}">${n}</button>`).join('')}${['II', 'V2', 'V3'].map(d => `<button type="button" data-deriv="${d}" aria-pressed="${S.deriv === d}">${d}</button>`).join('')}</div>`,
    `<div class="rtv-deslizador"><input type="range" id="rtv-d-st" min="0.5" max="3.5" step="0.5" value="${S.st}" aria-label="Elevación del ST en V2-V3"><output id="rtv-o-st">${coma(S.st, 1)} mm<small>ST en V2-V3 · ilustrativo</small></output></div>`);
  if (c === 'hiperk') h.push(`<div class="rtv-deslizador"><input type="range" id="rtv-d-k" min="4" max="8.6" step="0.2" value="${S.k}" aria-label="Potasio"><output id="rtv-o-k">K⁺ ${coma(S.k, 1)}<small>mEq/l</small></output></div>`, nota('Los cortes, de Nefrología al día (De Sequera 2024, p. 21); cuánto cambia la célula, ilustrativo.'));
  if (!h.length) h.push(nota('Este ritmo no tiene tratamiento propio en la ficha: mira la causa, o elige otro en «Ritmo».'));
  return h.join('');
}
function mandosMedir() {
  if (!mo) return `<p class="rtv-dock-nota">Sin ritmo que medir.</p>`;
  const b = (k, t, s) => `<button type="button" class="rtv-tog" data-medir="${k}" aria-pressed="${S.medir === k}">${t}<small>${s}</small></button>`;
  const opts = [b('pr', 'PR', 'onda P → QRS'), b('qrs', 'QRS', '≤0,12 s'), b('qt', 'QT y QTc', 'QT / √RR'), b('rr', 'RR', 'regular o no')];
  if (S.clave === 'stemi') opts.push(b('st', 'ST', 'punto J, en mm'));
  return `<div class="rtv-rejilla" style="--n:${opts.length}">${opts.join('')}</div><p class="rtv-dock-nota" id="rtv-medida">${S.medir ? textoMedida() : 'Elige qué medir: la tira se para y el calibrador se pone sobre el último latido completo. Papel: 1 mm = 0,04 s y 0,1 mV.'}</p>`;
}

/* El fármaco de la FA (Fig. 19.5): lo usan el dock y abrirEstado(«fa:dilt») */
function ponerFarmaco(k) { S.farmaco = k || null; S.horas = S.farmaco ? Math.max(S.horas, 1) : 0; if (S.farmaco) infusion({ dilt: 'DILTIAZEM', amio: 'AMIODARONA', digo: 'DIGOXINA' }[S.farmaco], { dilt: '0,25 mg/kg', amio: '150 mg + 1 mg/min', digo: '0,25 mg/2 h' }[S.farmaco], { dilt: 'diltiazem 0,25 mg/kg en 2 min y 5-15 mg/h', amio: 'amiodarona 150 mg en 10 min y 1 mg/min', digo: 'digoxina 0,25 mg cada 2 h' }[S.farmaco]); else { S.bomba = null; pintarAparatos(); } aplicarFarmacoFA(); pintarDock(); pintarGraficas(); pintarFuentes(); pintarFrase(); }
/* ---------- Medir: el calibrador sobre la tira (los tiempos salen del motor) ---------- */
function medidas() {
  const L = leer(); if (!L || !L.ult) return null;
  const elec = mo.latidosV.filter(b => !b.choque && b.n >= 0.5 * b.total && b.fin - b.t0 < 0.45 && b.t0 > simT - SEG + 0.25 && b.r1 + 0.05 < simT);
  const b = elec[elec.length - 1] || L.ult, bPrev = elec[elec.length - 2];
  const sq = anchoKernel(b), on = b.t0 - 0.011, off = b.fin + 0.011, tEnd = b.r1 - 0.075 + 2.2 * 0.042 * mo.m.tAncho;
  const a = mo.latidosA.filter(x => x.t0 < b.t0 - 0.04 && x.t0 > b.t0 - 0.4).pop();
  const pOn = a && !mo.m.fa && !mo.m.flOn && !bloqueoCompleto() ? a.t0 - 0.022 : null;
  const rr = bPrev ? b.t0 - bPrev.t0 : null;
  return { on, off, tEnd, pOn, rr, bPrev, qt: tEnd - on, qtc: rr ? (tEnd - on) / Math.sqrt(rr) : null, qrs: off - on, pr: pOn ? on - pOn : null, j: off };
}
function textoMedida() {
  const M = medidas(); if (!M) return 'No hay un latido completo en la tira.';
  const s = v => coma(v, 2) + ' s';
  switch (S.medir) {
    case 'pr': if (bloqueoCompleto()) return `Aquí no hay PR que medir: las P no conducen. El intervalo entre cada P y el QRS siguiente cambia a cada latido (ficha, p. 118).`;
      return M.pr ? `PR = ${s(M.pr)} (del comienzo de la P al del QRS) ${org('medido en la tira · ilustrativo')}. ${S.clave === 'wpw' ? 'Corto: la onda entra por el atajo sin pasar por el freno del nodo (p. 27).' : 'El retraso del nodo AV es de 0,12 s (El Libro Azul, p. 7).'}` : 'Sin P delante del QRS: aquí no hay PR que medir.';
    case 'qrs': return `QRS = ${s(M.qrs)}: ${M.qrs > 0.12 ? '<span class="hl-rojo">ancho</span> (>0,12 s): nace debajo del sistema de conducción AV o baja por una vía anómala' : '<span class="hl-verde">estrecho</span> (≤0,12 s): nace por encima del sistema de conducción AV'} (p. 18-21).`;
    case 'qt': return `QT = ${s(M.qt)}${M.qtc ? `; QTc = QT/√RR = <b>${s(M.qtc)}</b>: ${M.qtc > 0.5 ? '<span class="hl-rojo">riesgo de torsade</span> (>0,5 s)' : M.qtc > 0.44 ? 'largo (normal ≤0,44 s)' : '<span class="hl-verde">normal</span> (≤0,44 s)'}` : ''} (p. 34-35).`;
    case 'rr': return M.rr ? `RR = ${s(M.rr)} → ${Math.round(60 / M.rr)} lpm. ${mo.m.fa ? 'Mide varios: en la FA cada RR es distinto (p. 20).' : ''}` : 'Hace falta otro QRS en la tira.';
    case 'st': { const mm = lesionMm()[S.deriv], lim = umbralST(); return `ST en el punto J (${S.deriv}) = <b>${coma(mm, 1)} mm</b>. Umbral (${S.deriv === 'II' ? 'otras derivaciones' : (S.sexo === 'm' ? 'mujeres' : 'varones') + ', V2-V3'}): ≥${coma(lim, 1)} mm → ${mm >= lim ? '<span class="hl-rojo">cumple</span> (en ≥2 derivaciones contiguas)' : '<span class="hl-verde">no cumple</span>'} (Tabla 20.1, p. 41).`; }
  }
  return '';
}
function pintarCalibre() {
  const g = $('m-calibre'); if (!g) return; if (!S.medir || !mo) { g.innerHTML = ''; return; }
  const M = medidas(); if (!M) { g.innerHTML = ''; return; }
  const ts = monitor.dato('t');
  const xDe = t => { let mejor = null, dm = 9; for (let x = 0; x < monitor.NP; x++) { const bt = ts[x]; if (bt == null) continue; const d = Math.abs(bt - t); if (d < dm) { dm = d; mejor = x; } } return dm < 0.02 ? mejor : null; };
  let par = null;
  if (S.medir === 'pr' && M.pr) par = [M.pOn, M.on, 'PR']; if (S.medir === 'qrs') par = [M.on, M.off, 'QRS']; if (S.medir === 'qt') par = [M.on, M.tEnd, 'QT']; if (S.medir === 'rr' && M.rr) par = [M.bPrev.t0, M.bPrev.t0 + M.rr, 'RR'];
  let h = '';
  if (par) { const x0 = xDe(par[0]), x1 = xDe(par[1]); if (x0 != null && x1 != null) {
    const y = 78; h += `<line x1="${x0}" y1="6" x2="${x0}" y2="${y + 2}" stroke="var(--text-main)" stroke-width="1"/><line x1="${x1}" y1="6" x2="${x1}" y2="${y + 2}" stroke="var(--text-main)" stroke-width="1"/>
      <line x1="${x0}" y1="${y}" x2="${x1}" y2="${y}" stroke="var(--text-main)" stroke-width="1.2"/><rect x="${Math.min(x0, x1) - 2}" y="${y - 13}" width="${Math.max(48, Math.abs(x1 - x0) + 4)}" height="11" fill="var(--bg-main)" fill-opacity=".85"/>
      <text x="${Math.min(x0, x1)}" y="${y - 4}" font-size="9" fill="var(--text-main)" font-weight="700" font-family="system-ui, sans-serif">${par[2]} ${coma(par[1] - par[0], 2)} s</text>`; } }
  if (S.medir === 'st') { const x = xDe(M.j + 0.02); if (x != null) { const mm = lesionMm()[S.deriv]; h += `<line x1="${x}" y1="${f1(yEcg(0))}" x2="${x}" y2="${f1(yEcg(mm / 10))}" stroke="var(--text-main)" stroke-width="1.4"/><line x1="${x - 8}" y1="${f1(yEcg(0))}" x2="${x + 8}" y2="${f1(yEcg(0))}" stroke="var(--text-main)" stroke-width=".8" stroke-dasharray="2 2"/><rect x="${x + 4}" y="${f1(yEcg(mm / 10) - 2)}" width="54" height="11" fill="var(--bg-main)" fill-opacity=".85"/><text x="${x + 6}" y="${f1(yEcg(mm / 10) + 6)}" font-size="9" fill="var(--text-main)" font-weight="700" font-family="system-ui, sans-serif">J: ${coma(mm, 1)} mm</text>`; } }
  g.innerHTML = h;
}

/* ---------- Las acciones ---------- */
const en = (dt, fn) => agenda.push({ t: simT + dt, fn });
function bolo(nombre, dosis, lectura) { S.bomba = { nombre, dosis, lectura, t0: simT, bolo: true }; pintarAparatos(); }
function infusion(nombre, dosis, lectura) { S.bomba = { nombre, dosis, lectura, t0: simT, bolo: false }; pintarAparatos(); }
function cortarFuturo() {}   // el motor solo ha avanzado 70 ms por delante: lo nuevo manda desde ya
function avisar(t) { S.mensaje = t; pintarFrase(); }
function choque(modo, energia, alTerminar) {
  if (cargando(S, simT)) { avisar('El desfibrilador aún está cargando o descargando: un choque por carga.'); return false; }   // antes se apilaban 3 choques en 1,2 s
  S.desfib = { modo, energia, cargadoEn: simT + 0.8 }; pintarAparatos();
  if (modo === 'sinc') S.desfib.esperaQRS = true;
  else en(1.1, () => { S.desfib.tChoque = simT; mo.choque(simT); alTerminar(); });
  S.desfib.alTerminar = alTerminar; return true;
}
function sincronizar() {   // el choque sincronizado cae sobre el siguiente QRS
  const d = S.desfib; if (!d || !d.esperaQRS || simT < d.cargadoEn) return;
  const b = mo.latidosV[mo.latidosV.length - 1]; if (b && b.t0 > d.cargadoEn && simT - b.t0 < 0.05) { d.esperaQRS = false; d.tChoque = b.t0 + 0.012; mo.choque(d.tChoque); d.alTerminar(); }
}
function exito(t) { const m = mo.m; mo.quitarOndaF(t); m.pAmp = 1; (S.eventos = S.eventos || []).push(t); S.sinusal = true; m.fa = false; m.fv = false; m.flOn = false; m.crOn = false; m.foco = null; m.tdp = false; m.navRef = null; m.navF = 1; m.sa = true; m.sinMecanica = false; mo.reiniciarSA(t + 0.9); }
function accion(a, b) {
  const m = mo ? mo.m : null, c = S.clave, t = simT, p = S.parada;
  S.mensaje = null;
  if (mo && a !== 'reinicio') {   // el tope manda también cuando el mando llega por la Mayéutica o a mano (topes.js)
    const r = calcularTopes(S, simT, mo);
    if (r.off.has(a)) { avisar(`Tope: ${Object.values(r.T).map(x => x.titulo).join(' · ')}. ${Object.values(r.T).map(x => x.texto).join(' ')}`); pintarDock(); return; }
    if (ADE.includes(a)) S.dosis.ade = (S.dosis.ade || 0) + 1;
    else if (['dilt-nodo', 'vagal-v', 'vagal-m', 'vagal-c', 'mg-tam', 'mg-tdp', 'meto-tam', 'vera-tam', 'amio-tv'].includes(a)) S.dosis[a] = (S.dosis[a] || 0) + 1;
  }
  switch (a) {
    case 'reinicio': ponerEstado(c, c === 'fa' ? { fcFA: S.fcFA } : {}); return;
    case 'vagal-v': case 'vagal-m': case 'vagal-c': {
      const pr = { 'vagal-v': 0.24, 'vagal-m': 0.44, 'vagal-c': 0.09 }[a], ok = mo.azar() < pr, nom = { 'vagal-v': 'La maniobra de Valsalva', 'vagal-m': 'La Valsalva modificada', 'vagal-c': 'El masaje carotídeo' }[a];
      if (ok) { m.navF = 1.7; en(1.6, () => { m.navF = 1; }); } else { m.navRet = 1.18; en(2.2, () => { m.navRet = 1; }); }
      avisar(`${nom} sube el tono vagal: ${ok ? '<b>esta vez corta el circuito</b>' : 'esta vez no lo corta (la onda va más despacio unos segundos)'}. Éxito en el estudio: ${Math.round(pr * 100)} % (p. 29). ${org('que frene el nodo: fisiología general')}`); break; }
    case 'ade6': case 'ade12': case 'ade-tv': case 'ade-ab': {
      const dosis = a === 'ade12' ? '12 mg' : '6 mg'; bolo('ADENOSINA', `${dosis} + LAVADO`, `adenosina ${dosis} en bolo rápido y lavado`);
      m.cerrojo = t + 1.3; m.cerrojoFin = t + 1.3 + 3.2; S.adeno = t + 1.3; (S.eventos = S.eventos || []).push(m.cerrojoFin); S.mensaje = null; break; }
    case 'dilt-nodo': infusion('DILTIAZEM', '0,25 mg/kg', 'diltiazem 0,25 mg/kg en 2 min'); S.diltNodo = true; en(1.2, () => { m.navF = 1.5; m.navRet = 1.2; }); en(5, () => { m.navF = 1.15; m.navRet = 1.05; }); avisar('Si la adenosina no responde, el diltiazem o el verapamilo pueden cortarla (p. 31).'); break;
    case 'llenado': S.llenadoMalo = !S.llenadoMalo; m.llenadoMalo = S.llenadoMalo; latCache.t = -1; break;
    case 'esmolol': S.farmaco = 'esmo'; S.horas = 0; infusion('ESMOLOL', '500 µg/kg + 50', 'esmolol 500 µg/kg en bolo y 50 µg/kg/min'); m.navF = navParaFC(108); pintarGraficas();
      avisar(`Esmolol, un betabloqueante: alarga la conducción del nodo y endurece el muelle. Los betabloqueantes controlan la FC en el 70 %; el esmolol tiene una semivida de 9 min y se ajusta deprisa; los dos dan hipotensión (p. 24). ${org('cuánto baja aquí: ilustrativo', true)}`); break;
    case 'cv-fa': choque('sinc', '100 J', () => { exito(simT); S.mensaje = 'Choque sincronizado de 100 J bifásicos: vuelve el sinusal. Funciona mejor en la FA reciente; antes, eco transesofágica si da tiempo, y anticoagulación en quien la necesite (p. 25). Qué choque funciona: ilustrativo.'; pintarFrase(); }); break;
    case 'cv-wpw': choque('sinc', '100 J', () => { exito(simT); m.apOn = true; S.wpwFa = false; S.wpwNodo = false; pintarDock(); avisar('Cardioversión: vuelve el sinusal, con su PR corto y su onda delta (p. 28).'); }); break;
    case 'mg-tam': bolo('MgSO4', '2 g/15 min + 6 g', 'sulfato de magnesio 2 g en 15 min y 6 g en 6 h'); en(3, () => { m.foco = null; m.sa = true; mo.reiniciarSA(simT + 0.2); avisar('Con magnesio, la TAM pasó a sinusal en el 88 % de un estudio, con independencia del Mg sérico (p. 28). Aquí, uno de esos.'); }); break;
    case 'meto-tam': bolo('METOPROLOL', '2,5-5 mg IV', 'metoprolol 2,5-5 mg IV en 2 min'); if (S.dosis[a] === 1) en(3, () => { m.foco = null; m.sa = true; mo.reiniciarSA(simT + 0.2); avisar('Metoprolol: 80 % de paso a sinusal, si la TAM no es por EPOC (p. 28).'); }); break;
    case 'vera-tam': bolo('VERAPAMILO', '0,25-5 mg IV', 'verapamilo IV en 2 min (hasta 20 mg)'); en(1.5, () => { if (m.foco) m.foco.cada = 0.62; m.navF = 1.3; avisar('Verapamilo: corrige menos de la mitad, pero frena la FC. Es inotrópico negativo: no en la IC con FE reducida (p. 28).'); }); break;
    case 'llegafa': S.wpwFa = true; ponerEstado('wpw', { wpwFa: true }); return;
    case 'w-dilt': case 'w-bb': case 'w-digo': {
      const n = { 'w-dilt': ['DILTIAZEM', '0,25 mg/kg'], 'w-bb': ['ESMOLOL', '500 µg/kg'], 'w-digo': ['DIGOXINA', '0,25 mg'] }[a];
      infusion(n[0], n[1], `${n[0].toLowerCase()} ${n[1]}`); S.wpwNodo = true; m.navF = 2.4; pintarDock();
      $('peligro').hidden = false; $('peligro').innerHTML = '⚠ Con una vía accesoria, el bloqueo del nodo no frena la frecuencia y puede precipitar una FV (p. 28). No se dan antagonistas del calcio, betabloqueantes ni digoxina.'; break; }
    case 'verfv': S.fvWpw = true; en(1.5, () => { m.fv = true; m.sinMecanica = true; mo.proxFV = simT; $('peligro').innerHTML = '⚠ El bloqueo selectivo del nodo precipitó una FV: lo que la fuente advierte (p. 28). El momento: ilustrativo.'; avisar('El bloqueo selectivo del nodo precipitó una FV (p. 28): sin pulso. Compresiones y desfibrilación (p. 56-59).'); pintarDock(); }); break;
    case 'desf-wpw': choque('asinc', '120-200 J', () => { exito(simT); m.apOn = true; S.wpwFa = false; S.wpwNodo = false; S.fvWpw = false; $('peligro').hidden = true; pintarDock(); avisar('Desfibrilación: vuelve el sinusal, con su PR corto y su onda delta. La vía accesoria sigue ahí.'); }); break;
    case 'w-amio': infusion('AMIODARONA', '150 mg', 'amiodarona 150 mg IV'); en(3.5, () => { exito(simT); m.apOn = true; S.wpwFa = false; pintarDock(); avisar('Cardioversión farmacológica con amiodarona (o procainamida): vuelve el sinusal (p. 28). Cuándo: ilustrativo.'); }); break;
    case 'amio-tv': infusion('AMIODARONA', '150 mg/10 min', 'amiodarona 150 mg en 10 min, luego 1 mg/min'); en(1, () => { m.crRefr = 0.33; }); en(3, () => { m.crRefr = 0.42; }); avisar('Amiodarona IV: la de elección para suprimir la TV monomórfica estable (Fig. 19.8, p. 32-33). Cuándo cede: ilustrativo.'); break;
    case 'cv-tv': { const e = ENERGIA_TV[Math.min(S.choquesTV || 0, 2)]; if (!choque('sinc', e, () => { exito(simT); S.mensaje = `Choque sincronizado de ${e}: la TV cede. Se empieza en 100 J; si falla, 100 J bifásico o 200 J; se evitan los 360 J, que dañan el miocardio (p. 32). Qué choque funciona: ilustrativo.`; pintarFrase(); })) break; S.choquesTV = (S.choquesTV || 0) + 1; break; }
    case 'tdp': ponerEstado('torsade', { qt: { ...S.qt }, tdp: true }); return;
    case 'desf-tdp': choque('asinc', '120-200 J', () => { exito(simT); m.apdExtra = qtExtra(S); S.tdp = false; pintarDock(); avisar('Desfibrilación (choque no sincronizado): la torsade sostenida cede. Con el QT aún largo, puede volver: magnesio y corregir (p. 35).'); }); break;
    case 'mg-tdp': S.tdpMg = true; bolo('MgSO4', '1-2 g/15 min', 'sulfato de magnesio 1-2 g en 15 min'); avisar('Magnesio IV, popular para cortar la torsade y combinable con el choque; la dosis no tiene consenso: 1-2 g en 15 min según la ACLS (p. 35). Su efecto aquí: ilustrativo.'); en(4, () => { if (S.tdp) { exito(simT); m.apdExtra = qtExtra(S); S.tdp = false; pintarDock(); } }); break;
    case 'corregir': S.qt = { amiodarona: S.qt.amiodarona }; m.apdExtra = qtExtra(S); avisar('Corregir la hipopotasemia y la hipomagnesemia y retirar el fármaco de riesgo (el haloperidol) previene que vuelva (p. 35).'); if (S.tdp) { exito(simT); S.tdp = false; } pintarDock(); break;
    case 'comp': p.comp = !p.comp; if (p.comp && p.ciclo == null) { p.ciclo = p.reloj; p.avisoCiclo = false; } break;
    case 'choque': choque('asinc', '120-200 J', () => resultadoChoque()); break;
    case 'adre': {
      bolo('ADRENALINA', '1 mg IV/IO', 'adrenalina 1 mg IV o IO cada 3-5 min'); if (p.adreReloj != null && p.reloj - p.adreReloj < MAX.intervaloAdre) p.adreFuera = true; p.adrenalina.push(t + 0.9); p.adreReloj = p.reloj;
      if (S.clave === 'fv' && p.choques < 2) avisar('La adrenalina empieza si hace falta un 2.º choque (p. 59). En la AESP y la asistolia, cuanto antes (p. 60-61).');
      else avisar('Adrenalina 1 mg: sube la presión de perfusión coronaria un 30 % durante al menos 3 min (p. 62). Mira la Fig. 21.3, abajo.');
      pintarGraficas(); break; }
    case 'amio-pcr': {
      const d = p.amio ? '150 mg' : '300 mg'; bolo('AMIODARONA', d + ' IV/IO', `amiodarona ${d} en bolo`); p.amio++;
      if (p.choques < 3) avisar('La amiodarona va si hace falta un 3.er choque: 300 mg y, si hace falta, 150 mg. Sin amiodarona, lidocaína 1-1,5 mg/kg (p. 59).');
      break; }
    default:
      if (a && a.startsWith('qt-')) { const k = a.slice(3); S.qt[k] = !S.qt[k]; m.apdExtra = qtExtra(S); en(1.6, () => pintarDock()); }
      else if (a && a.startsWith('causa-')) { const i = +a.slice(6); p.causa = i; avisar(['<b>Neumotórax a tensión</b>: la eco lo ve en supino con S 91 % y E 99 % (p. 64).', '<b>Taponamiento</b>: el derrame se ve en subcostal o paraesternal largo; en la parada, el colapso del VD no es fiable: cualquier derrame → pericardiocentesis (p. 64).', '<b>Tromboembolismo venoso</b>: una de las T reversibles (p. 60).', '<b>Trombosis coronaria</b>: una de las T reversibles (p. 60).'][i]); }
  }
  pintarDock(); pintarFrase(); pintarAparatos(); pintarFicha(); if (REDUCIR || pausado) tras();
}
// El resultado del choque en la FV, según el escenario elegido (ilustrativo)
function resultadoChoque() {
  const p = S.parada; p.choques++; p.ciclo = p.reloj; p.avisoCiclo = false; p.comp = true;
  const ok = p.escenario === 'responde' ? p.choques === 1 : p.escenario === 'tras' ? p.choques >= 3 && p.amio > 0 : false;
  if (ok) { exito(simT); mo.m.contractil = 0.75; mo.m.fcSA = 96; p.rce = true; S.mensaje = null; pintarDock(); pintarFicha(); pintarGraficas(); pintarFuentes(); pintarFrase(); return; }
  let t = `Choque ${p.choques}: sigue en FV. 2 min de compresiones antes de mirar el ritmo (p. 59).`;
  if (p.choques === 2) t += ' Ahora, adrenalina 1 mg cada 3-5 min.';
  if (p.choques === 3) t += p.escenario === 'refractaria' ? ' Tres choques sin éxito: buen resultado solo en el 5 %; ECMO si se dispone las 24 h (p. 60).' : ' Ahora, amiodarona 300 mg.';
  if (p.choques > 3 && p.escenario === 'refractaria') t = `Choque ${p.choques}: la FV no cede. Buen resultado solo en el 5 % tras tres choques; ECMO si se dispone (p. 60).`;
  S.mensaje = t; pintarFrase(); pintarDock();
}
function deslizar(el) {
  const v = +el.value;
  if (el.id === 'd-fcsa') { S.fcSA = v; mo.m.fcSA = v; $('o-fcsa').innerHTML = `${v} lpm<small>reloj sinusal · ilustrativo</small>`; }
  if (el.id === 'd-horas') { S.horas = v; $('o-horas').innerHTML = `${coma(v, 1)} h<small>desde la dosis · Fig. 19.5</small>`; aplicarFarmacoFA(); pintarGraficas(); }
  if (el.id === 'd-min') { S.parada.minuto = v; $('o-min').innerHTML = `min ${v}<small>1.er choque · Fig. 21.1</small>`; pintarGraficas(); }
  if (el.id === 'd-st') { S.st = v; $('o-st').innerHTML = `${coma(v, 1)} mm<small>ST en V2-V3 · ilustrativo</small>`; }
  if (el.id === 'd-k') { S.k = v; aplicarK(mo, v); $('o-k').innerHTML = `K⁺ ${coma(v, 1)}<small>mEq/l</small>`; if (v >= 8.2 && !S.kFv) { S.kFv = true; } }
  pintarFrase(); pintarCifras(); if (REDUCIR || pausado) { llenarEstatico(); pintarEscena(simT); }
}
// La FA con un fármaco: la FC de la Fig. 19.5 a esas horas fija la refractariedad del torniquete (el muelle)
function aplicarFarmacoFA() { if (S.farmaco && !F195[S.farmaco]) return; S.fcFA = S.farmaco ? fcFig(S.farmaco, S.horas) : 138; mo.m.navF = navParaFC(S.fcFA); }
// Con «reducir movimiento» o en pausa: se salta al final de lo que acaba de pasar
function tras() { const fin = Math.max(simT + 0.6, ...agenda.map(x => x.t + 0.4), S.adeno ? S.adeno + 4 : 0); avanzarHasta(fin); llenarEstatico(); pintarEscena(simT); pintarCifras(); pintarFrase(); }
function avanzarHasta(fin) { while (simT < fin) { const t0 = simT; simT = Math.min(fin, simT + 0.05); relojParada(simT - t0); mo && mo.avanzar(simT + 0.07); procesarAgenda(); if (mo) sincronizar(); } aplicarTopes(false); }   // los topes se releen al llegar (sin el bucle, con «reducir movimiento», nadie más lo haría)
function procesarAgenda() { const ya = agenda.filter(x => x.t <= simT); agenda = agenda.filter(x => x.t > simT); for (const x of ya) x.fn(); }

// El reloj de la parada va 10 veces más deprisa; se para a los 30 min sin pulso y al recuperarlo (topes.js). Lo mueven el bucle y avanzarHasta.
function relojParada(dt) {
  const p = S.parada; if (!p || p.rce) return;
  if (p.comp || p.reloj > 0 || p.choques) p.reloj = Math.min(MAX.parada, p.reloj + dt * 10);
  if (p.comp && p.ciclo != null && p.reloj - p.ciclo >= 120 && !p.avisoCiclo) { p.avisoCiclo = true; avisar(S.clave === 'fv' ? '2 min de compresiones: pausa breve para mirar el ritmo; si sigue en FV, otro choque (p. 59).' : '2 min de compresiones: mira el ritmo; si no es desfibrilable, sigue con compresiones y adrenalina cada 3-5 min (p. 60).'); }
}
/* ---------- Los topes de los mandos (topes.js): avisos ámbar y sellos en el monitor; los botones se apagan ---------- */
const tope = crearTope({ monitor: $('rtv-monitor'), dock: $('dock'), cita });
const topeVisto = {}; let topeFrase = null;
$('rtv-monitor').addEventListener('click', (e) => { const sl = e.target.closest('.tope-sello'); if (!sl || e.target.closest('button, a')) return; if (sl.dataset.abierto) delete sl.dataset.abierto; else sl.dataset.abierto = '1'; sl.classList.toggle('tope-compacto', !sl.dataset.abierto); });
function aplicarTopes(forzar) {
  const quitarTodo = () => { for (const { clave } of tope.activos()) { tope.quitar(clave); delete topeVisto[clave]; } topeFrase = null; };
  if (!mo) { quitarTodo(); return; }
  const r = calcularTopes(S, simT, mo); topeFrase = r.frase;
  for (const { clave } of tope.activos()) if (!(clave in r.T)) { tope.quitar(clave); delete topeVisto[clave]; }
  let nuevo = false;
  for (const [k, t] of Object.entries(r.T)) { const f = JSON.stringify([t.nivel, t.titulo, t.texto]); if (!forzar && topeVisto[k] === f) continue; if (t.nivel === 'sello' && k !== 'sinusal' && topeVisto[k] !== f) nuevo = true; topeVisto[k] = f; tope.poner(k, t); }
  if (nuevo) { S.mensaje = null; pintarFrase(); }   // un sello nuevo manda sobre la frase vieja
  for (const sl of $('rtv-monitor').querySelectorAll('.tope-sello')) sl.classList.toggle('tope-compacto', !sl.dataset.abierto);   // el sello nace plegado (solo el título): no tapa las cifras; al tocarlo se abre
  for (const b of document.querySelectorAll('#rtv-dock-panel [data-acc]')) {
    const a = b.dataset.acc, sm = b.querySelector('small');
    if (sm) { if (b.dataset.small0 == null) b.dataset.small0 = sm.textContent; sm.textContent = a in r.rot ? r.rot[a] : b.dataset.small0; }
  }
}
/* ---------- La frase viva ---------- */
function claveGuia() {
  const c = S.clave, p = S.parada;
  if (c === 'nodal' && S.adeno) return 'adenosina';
  if (c === 'fa' && F195[S.farmaco]) return 'faF';
  if (c === 'wpw' && S.wpwFa) return 'wpwFa';
  if (c === 'bav2' && S.mobitz !== 'I') return 'bav2ii';
  if (p) { if (p.rce) return 'rce'; if (c === 'fv' && p.choques >= 3 && p.escenario === 'refractaria') return 'refractaria'; if (c === 'fv' && p.comp) return p.insufl === 30 ? 'rcpInsufl' : p.adrenalina.length ? 'rcpAdre' : 'rcp'; }
  return GUIAS[c] ? c : 'sinusal';
}
function pintarFrase() {
  const e = est(); let [t, o] = e.frase, extra = '';
  const p = S.parada;
  if (p && p.rce) [t, o] = ESTADOS.rce.frase;
  if (S.adeno && mo) { if (simT < S.adeno) [t, o] = ['La adenosina va por la vía hasta el corazón: en bolo rápido y con lavado, actúa en menos de 30 s.', 'ficha · p. 30']; else if (simT < mo.m.cerrojoFin) [t, o] = ['La adenosina echa el cerrojo al nodo AV: salen P sin QRS. Si el circuito pasa por el nodo, se rompe. Si pasa más de 1 s sin QRS, la unión AV escapa a unos 50/min. ' + org('el escape: fisiología general', true), 'ficha · p. 29-30']; else if (S.clave === 'nodal' || S.clave === 'aberrancia') [t, o] = [S.clave === 'nodal' ? 'Vuelve el sinusal: la reentrada se cortó. Con 6 mg y luego 12 mg se cortan más del 90 %; por vía central, la mitad de la dosis.' : 'Vuelve el sinusal, con el QRS igual de ancho: el bloqueo de rama ya estaba (Fig. 19.6).', S.clave === 'nodal' ? 'ficha · p. 30' : 'ficha · p. 31']; else if (S.clave === 'tv') [t, o] = ['La adenosina cerró el nodo, pero la TV sigue: su circuito no pasa por él. Si un QRS ancho no responde a la adenosina, probablemente es una TV.', 'ficha · p. 33']; }
  if (S.clave === 'fa' && F195[S.farmaco]) extra = ` Con ${NOMBRE_F[S.farmaco]}, a las ${coma(S.horas, 1)} h la FC media es ~${Math.round(fcFig(S.farmaco, S.horas))} lpm (Fig. 19.5). El monitor la cuenta latido a latido: en la FA sube y baja alrededor de esa media.`;
  if (S.clave === 'wpw' && S.wpwFa) [t, o] = S.fvWpw ? ['El bloqueo selectivo del nodo precipitó una FV: sin pulso. Desfibrilar.', 'ficha · p. 28']
    : S.wpwNodo ? ['Frenar el nodo no frena el atajo: la FC no baja, y el bloqueo selectivo del nodo puede precipitar una FV. Con una vía accesoria no se dan antagonistas del calcio, betabloqueantes ni digoxina.', 'ficha · p. 28']
    : ['Las aurículas fibrilan, y el atajo, sin torniquete, deja pasar impulsos muy seguidos: QRS anchos, rápidos e irregulares. Cardioversión eléctrica, o amiodarona o procainamida.', 'ficha · p. 27-28'];
  if (S.clave === 'bav2' && S.mobitz !== 'I') [t, o] = [(S.mobitz === '2:1' ? 'Una P de cada dos no conduce y el PR de las que pasan no cambia. En un 2:1 hay que distinguir si el bloqueo es nodal o infranodal. ' : 'Una P de cada tres no conduce (el Mobitz II clásico) y el PR de las que pasan no cambia. El Mobitz II es infranodal. ') + 'Es el que más preocupa: puede acabar en bloqueo completo.', 'ficha · p. 117; ESC 2021 · p. 26-27'];
  if (S.clave === 'bav3') [t, o] = S.escape === 'vent'
    ? ['Sin escape nodal, un foco del ventrículo toma el mando a unos 32 lpm, con QRS ancho. El volumen por latido no compensa tantas pausas: el gasto cae (FC × volumen) aunque la sistólica se sostenga, y llegan el mareo y el síncope. Si hay compromiso y no responde a los cronotrópicos i.v., marcapasos temporal. ' + org('el gasto = FC × volumen: fisiología general', true), 'ficha · p. 115; ESC 2021 · p. 26, 61']
    : ['La unión AV escapa por libre a unos 45 lpm y el QRS sale estrecho, porque baja por el His. Las P (75) siguen a su aire y no se relacionan con él. Con ritmo sinusal, el marcapasos está indicado con o sin síntomas.', 'ficha · p. 115, 118; ESC 2021 · p. 27'];
  if (S.clave === 'marcapasos') extra = ' Con 70 lpm en vez de ~32-45 el gasto sube (FC × volumen). ' + org('el gasto = FC × volumen: fisiología general', true);
  if (S.clave === 'torsade' && ultLect && ultLect.qtc && !S.tdp) extra = ` QTc ahora: ${coma(ultLect.qtc, 2)} s.`;
  if (S.clave === 'torsade' && S.tdp) [t, o] = ['Torsade de pointes: una TV polimórfica cuyos QRS cambian de forma y de altura, como si giraran. Sostenida: desfibrilar.', 'ficha · p. 34-35'];
  if (S.clave === 'hiperk') extra = S.k >= 8 ? ' >8: el QRS se funde con la T.' : S.k > 7 ? ' >7: PR largo, sin P, QRS que se ensancha.' : S.k >= 6.4 ? ' ~6,5: T picudas.' : '';
  if (p && !p.rce && p.comp && p.insufl !== 30 && p.adrenalina.length) [t, o] = ['Adrenalina: la presión de perfusión coronaria sube un 30 % (22 → 29 mmHg en el modelo) y el efecto dura al menos 3 min, el intervalo entre dosis.', 'ficha · p. 62 (el +30 % es del texto; la Fig. 21.3 llega a ~33)'];
  if (p && !p.rce && p.comp) extra = p.insufl === 30 && adrenalinaActiva(simT) ? ' Con 30 insuflaciones/min la PPC y la ETCO₂ bajan; que la adrenalina no lo compense es ilustrativo (la fuente no lo dice).' : p.insufl === 30 ? ' A 30 insuflaciones/min no da tiempo a vaciar el pulmón: la ETCO₂ cae.' : ' La ETCO₂ es el gasto que consiguen tus manos.';
  if (mo && ultLect && ultLect.fc == null && !ultLect.caos && S.sinusal && !(p && !p.rce)) [t, o] = ['Pausa tras el choque: el sinusal tarda un latido en arrancar.', 'fisiología general'];
  if (!S.mensaje && topeFrase) { t = topeFrase[0]; o = topeFrase[1]; extra = ''; }
  $('frase-txt').innerHTML = S.mensaje ? `${S.mensaje}` : `${t} ${org(o)}${extra}`;
  medirDock();
}
function pintarFicha() {
  const e = est(), p = S.parada;
  let h = e.paciente ? PACIENTES[e.paciente] : '';
  if (S.clave === 'tv') h += ` · TV a 170 lpm, PA 118/72, consciente${S.inestable ? ' · <b>ahora inestable</b>' : ''}`;
  if (S.clave === 'torsade') h += ' · día 3: haloperidol y claritromicina; K⁺ 3,1 y Mg²⁺ 1,4 · su QT: 520 ms a 75 lpm (QTc 0,58 s)';
  if (S.clave === 'bradi') h += ' · FC 45, sin síntomas: la ESC 2021 la considera fisiológica en reposo (40-50 lpm, p. 24)';
  if (S.clave === 'bav1') h += ' · ECG de ingreso: PR largo y fijo, asintomática';
  if (S.clave === 'bav2') h += S.mobitz === 'I' ? ' · mareo ocasional; el PR crece y cae una P' : ' · síncope hace una semana; PR fijo y P sin QRS';
  if (S.clave === 'bav3') h += S.escape === 'vent' ? ' · síncope esta mañana, mareo y disnea; QRS ancho a ≈ 32 lpm' : ' · mareo y cansancio; QRS estrecho a 45 lpm';
  if (S.clave === 'marcapasos') h += ' · portadora de marcapasos por un bloqueo AV completo';
  if (S.clave === 'stemi') h += ' · ST +2,5 mm en V2-V4';
  if (S.clave === 'fa') h = 'Pacientes con FA sin complicar, como los del estudio de la Fig. 19.5 (FC de partida ~138).';
  if (S.clave === 'nodal') h = 'Una reentrada nodal: suele darse en gente sin cardiopatía, más en mujeres. Palpitaciones y mareo (p. 29).';
  if (p) h += ` · reloj de la parada ${reloj()}${p.choques ? ` · ${p.choques} choque${p.choques > 1 ? 's' : ''}` : ''}${p.adrenalina.length ? ` · adrenalina ×${p.adrenalina.length}` : ''}${p.amio ? ` · amiodarona ×${p.amio}` : ''}`;
  $('ficha-estado').innerHTML = h;
}
const mmss = s => `${String(Math.floor(s / 60)).padStart(2, '0')}:${String(Math.floor(s % 60)).padStart(2, '0')}`;
const reloj = () => { const p = S.parada; if (!p) return ''; let r = mmss(p.reloj); if (p.ciclo != null && !p.rce) r += ` · ciclo ${mmss(Math.min(120, p.reloj - p.ciclo))}/2:00`; return r; };

/* ---------- Explicación guiada ---------- */
let guia = null, gi = 0;
function abrirGuia() {
  const k = claveGuia();
  guia = GUIAS[k];
  gi = 0; $('dock-explorar').hidden = true; $('dock-guia').hidden = false; $('frase').hidden = true; pintarGuia();
}
function cerrarGuia() { borrarSenal(); guia = null; $('dock-guia').hidden = true; $('frase').hidden = false; $('dock-explorar').hidden = false; medirDock(); }
function pintarGuia() {
  const p = guia.pasos[gi], n = guia.pasos.length, txt = typeof p.t === 'function' ? p.t() : p.t;
  $('dock-guia').innerHTML = `<div class="guia rtv-entra"><div class="guia-cab"><span class="guia-n">Paso ${gi + 1} de ${n}</span><span class="guia-tit">${guia.tit}</span><button type="button" class="guia-x" id="rtv-guia-x" aria-label="Cerrar la explicación">×</button></div>
    <p class="guia-txt">${txt}${p.org ? ' ' + `<span class="guia-org">${p.org}</span>` : ''}</p>${cita(p.c)}
    <div class="guia-nav"><button type="button" class="guia-b" id="rtv-guia-ant" ${gi === 0 ? 'disabled' : ''}>← Atrás</button><span class="guia-puntos">${guia.pasos.map((_, i) => `<i class="${i < gi ? 'hecho' : i === gi ? 'aqui' : ''}"></i>`).join('')}</span><button type="button" class="guia-b guia-prim" id="rtv-guia-sig">${gi === n - 1 ? 'Hecho' : 'Siguiente →'}</button></div></div>`;
  $('guia-x').onclick = cerrarGuia; $('guia-ant').onclick = () => { gi--; pintarGuia(); };
  $('guia-sig').onclick = () => { if (gi === n - 1) cerrarGuia(); else { gi++; pintarGuia(); } };
  medirDock(); requestAnimationFrame(() => senalar(p.r));
}
function borrarSenal() { document.querySelectorAll('.guia-anillo').forEach(e => e.remove()); document.querySelectorAll('.guia-marco').forEach(e => e.classList.remove('guia-marco')); }
function senalar(sels) {
  borrarSenal(); let primero = null;
  for (const s of sels || []) for (const el of document.querySelectorAll(s)) {
    if (!el.getClientRects().length) continue;
    const svg = el.ownerSVGElement;
    if (svg) {
      let b; try { b = el.getBBox(); } catch { continue; }
      if (!b.width && !b.height) continue;
      const m = svg.getScreenCTM().inverse().multiply(el.getScreenCTM());
      const ps = [b.x, b.x + b.width].flatMap(x => [b.y, b.y + b.height].map(y => [m.a * x + m.c * y + m.e, m.b * x + m.d * y + m.f]));
      const x0 = Math.min(...ps.map(p => p[0])), x1 = Math.max(...ps.map(p => p[0])), y0 = Math.min(...ps.map(p => p[1])), y1 = Math.max(...ps.map(p => p[1]));
      const r = document.createElementNS(NS, 'rect'); r.setAttribute('class', 'guia-anillo');
      r.setAttribute('x', x0 - 3); r.setAttribute('y', y0 - 3); r.setAttribute('width', x1 - x0 + 6); r.setAttribute('height', y1 - y0 + 6); r.setAttribute('rx', 6);
      svg.appendChild(r); primero = primero || r;
    } else { el.classList.add('guia-marco'); primero = primero || el; }
  }
  if (primero) { const caja = primero.getBoundingClientRect(), alto = innerHeight - $('dock').offsetHeight;
    if (caja.top < 8 || caja.bottom > alto - 8) scrollBy({ top: caja.top - Math.max(8, (alto - caja.height) / 2), behavior: REDUCIR ? 'auto' : 'smooth' }); }
}

/* ---------- Fuentes, láminas, notas, profundizar, lo que vendrá ---------- */
function pintarFuentes() {
  const k = claveGuia(), lista = []; const vistas = new Set();
  const de = [...(est().fuentes || []), ...((k && GUIAS[k] ? GUIAS[k].pasos : []).map(p => p.c))];
  for (const c of de) { const kk = c.f + c.id + c.sitio; if (!vistas.has(kk)) { vistas.add(kk); lista.push(c); } }
  $('lista-fuentes').innerHTML = lista.length ? lista.map(c => `<li><span>${libroDe(c)}, ${c.sitio} (${/[-,]/.test(String(c.p)) ? 'pp.' : 'p.'} ${c.p})</span>${cita(c)}</li>`).join('') : '';
}
function pintarLaminas() {
  const ls = LAMINAS.map((l, i) => [l, i]).sort((a, b) => (b[0].estados.includes(S.clave) ? 1 : 0) - (a[0].estados.includes(S.clave) ? 1 : 0));
  $('laminas').innerHTML = ls.map(([l, i]) => `<button type="button" class="rtv-lamina-libro" data-lam="${i}"><img src="${IMG + l.img}" alt="${l.tit}" loading="lazy"><span>${l.tit}</span></button>`).join('');
}
$('laminas').onclick = ev => { const b = ev.target.closest('[data-lam]'); if (!b) return; const l = LAMINAS[b.dataset.lam];
  $('visor-img').src = IMG + l.img; $('visor-img').alt = l.tit; $('visor-txt').textContent = l.txt; $('visor-cita').innerHTML = cita(l.c); $('visor').showModal(); };
$('visor-cerrar').onclick = () => $('visor').close();
function pintarFijos() {
  $('lista-notas').innerHTML = NOTAS.map(n => `<div class="rtv-nota-fuentes"><span class="rtv-nota-tipo ${NOTA_TIPO[n.tipo][1]}">${NOTA_TIPO[n.tipo][0]}</span><span>${n.txt}</span>${cita(n.c)}</div>`).join('');
  $('lista-profundizar').innerHTML = PROFUNDIZAR.map(p => `<li><span>${p.t}</span>${cita(p.c)}</li>`).join('');
  $('crece').innerHTML = `<p>El mismo corazón, el mismo grafo y el mismo ECG recibirán otras fuentes de la app como estados nuevos, sin rehacerse. Cada fuente, con su botón; nunca se mezclan.</p>
    <table><thead><tr><th>Qué</th><th>De dónde</th><th>Qué añade</th></tr></thead><tbody>${CRECE.map(r => `<tr><td>${r[0]}</td><td>${r[1]}</td><td>${r[2]}</td></tr>`).join('')}</tbody></table>`;
}

/* ---------- Las lupas en grande: un plano a pantalla completa por encima del dock (la pieza común) ---------- */
const planoLupas = crearPlanoGrande({ titulo: 'El nodo AV y la célula, de cerca', nota: 'Siguen moviéndose con el ritmo: cámbialo abajo, en los mandos.',
  piezas: [{ nodo: () => $('rtv-lupa-av'), viewBox: '4 312 174 108', etiqueta: 'El nodo AV de cerca: los dos carriles y su torniquete' }, { nodo: () => $('rtv-celula'), viewBox: '182 312 174 108', etiqueta: 'La célula del ventrículo: voltímetro, potencial de acción y canales' }] });
function abrirLupas() {
  // el dock y la frase de este modelo son fijos y propios: el plano grande se queda por encima de los dos, no debajo
  document.documentElement.style.setProperty('--dock-h', $('dock').offsetHeight + 'px');
  document.documentElement.style.setProperty('--frase-h', $('frase').offsetHeight + 'px');
  // el monitor (con su «Pausa») se queda a la vista por encima del plano: se mira el ECG mientras se mira la lupa
  const mon = $('monitor'); scrollTo({ top: scrollY + mon.getBoundingClientRect().top - 4, behavior: 'instant' });
  planoLupas.abrir();
  const caja = document.querySelector('.plano-grande[aria-label="El nodo AV y la célula, de cerca"]');
  if (caja) caja.style.top = Math.min(Math.max(0, mon.getBoundingClientRect().bottom + 4), innerHeight * 0.5) + 'px';
}
$('lupas-grandes').addEventListener('click', abrirLupas);
document.addEventListener('keydown', ev => { if (ev.key === 'Escape') planoLupas.cerrar(); });
$('volver').addEventListener('click', () => planoLupas.cerrar());
/* ---------- Cifras y gráficas tapadas (la Mayéutica de la parte 2: primero predices, luego compruebas) ---------- */
function taparTodo(si, tira) {
  tapado = si; taparTira = !!tira;
  const tp = $('tapa-tira'), tt = $('tapa-tira-txt'); if (tp) { tp.toggleAttribute('hidden', !taparTira); tt.toggleAttribute('hidden', !taparTira); }
  pintarCifras(); pintarGraficas();
}
/* ---------- Mayéutica: el interruptor Explorar | Mayéutica (el motor común, enganchado en mayeutica.js) ---------- */
let modo = 'explorar';
const mayeutica = crearMayeutica({ ponerEstado, taparTodo, accion, S, medirDock: () => medirDock(), setModo: m => setModo(m) });
export function setModo(m) {
  planoLupas.cerrar(); if (guia) cerrarGuia(); modo = m; S.medir = null; if (pausado) ponerPausa(false); borrarSenal();
  $('modo-explorar').setAttribute('aria-selected', String(m === 'explorar')); $('modo-preguntas').setAttribute('aria-selected', String(m === 'preguntas'));
  $('zona-abajo').hidden = m !== 'explorar'; $('aparatos').hidden = m === 'preguntas'; $('explicame').hidden = m !== 'explorar';
  $('vista-preguntas').hidden = m !== 'preguntas'; $('dock-explorar').hidden = m !== 'explorar'; $('dock-estudio').hidden = m !== 'preguntas';
  $('frase').hidden = m !== 'explorar'; $('peligro').hidden = true; $('raiz').classList.toggle('rtv-mayeutica', m === 'preguntas');
  taparTodo(false);
  if (m === 'explorar') ponerEstado('sinusal');
  else { $('escena').before($('vista-preguntas')); mayeutica.entrar(); }
  medirDock();
}
$('modo-explorar').addEventListener('click', () => { if (modo !== 'explorar') setModo('explorar'); });
$('modo-preguntas').addEventListener('click', () => { if (modo !== 'preguntas') setModo('preguntas'); });

/* ---------- Los oyentes ---------- */
$('dock-panel').addEventListener('click', ev => {
  const b = ev.target.closest('button'); if (!b || b.disabled) return;
  if (b.dataset.fam || b.dataset.estado) verFigura();
  if (b.dataset.fam) { familia = b.dataset.fam; pintarDock(); return; }
  if (b.dataset.estado) { S.medir = null; if (pausado) ponerPausa(false); ponerEstado(b.dataset.estado); pintarDock(); if (REDUCIR) pintarEscena(simT); return; }
  if (b.dataset.medir) { S.medir = S.medir === b.dataset.medir ? null : b.dataset.medir; if (S.medir && !pausado) { ponerPausa(true); S.pausaMedir = true; } if (!S.medir) dejarDeMedir(); pintarTiras(); pintarCalibre(); pintarDock(); return; }
  if ('far' in b.dataset) { ponerFarmaco(b.dataset.far); return; }
  if (b.dataset.mobitz) { ponerEstado('bav2', { mobitz: b.dataset.mobitz }); return; }
  if (b.dataset.escape) { ponerEstado('bav3', { escape: b.dataset.escape }); return; }
  if (b.dataset.rama) { ponerEstado('rama', { rama: b.dataset.rama }); return; }
  if (b.dataset.flutter) { ponerEstado('flutter', { flutter: +b.dataset.flutter }); return; }
  if (b.dataset.inest) { S.inestable = b.dataset.inest === 'true'; mo.m.contractil = S.inestable ? 0.55 : 1; latCache.t = -1; pintarDock(); pintarFicha(); return; }
  if (b.dataset.insufl) { S.parada.insufl = +b.dataset.insufl; pintarDock(); pintarFrase(); return; }
  if (b.dataset.esc) { S.parada.escenario = b.dataset.esc; pintarDock(); return; }
  if (b.dataset.sexo) { S.sexo = b.dataset.sexo; pintarDock(); pintarCifras(); return; }
  if (b.dataset.deriv) { S.deriv = b.dataset.deriv; montarMonitor(); llenarEstatico(); pintarDock(); return; }
  if (b.dataset.acc) accion(b.dataset.acc, b);
});
// Al cambiar de ritmo, el corazón queda a la vista sobre el dock (si estaba medio tapado, se sube lo justo)
function verFigura() {
  requestAnimationFrame(() => { const f = $('svg').getBoundingClientRect(), d = $('dock').getBoundingClientRect(), vis = Math.min(f.bottom, d.top) - Math.max(f.top, 0);
    if (vis / f.height < 0.75 && f.height < d.top) scrollTo({ top: scrollY + f.bottom - d.top + 8, behavior: REDUCIR ? 'auto' : 'smooth' }); });
}
// Dejar de medir: el calibrador se va y, si la tira se paró para medir, vuelve a correr
function dejarDeMedir() { S.medir = null; pintarCalibre(); if (S.pausaMedir) { S.pausaMedir = false; if (pausado) ponerPausa(false); } }
document.querySelector('.rtv-dock-tabs').addEventListener('click', ev => { const b = ev.target.closest('[data-pest]'); if (!b) return; pest = b.dataset.pest; if (pest !== 'medir' && (S.medir || S.pausaMedir)) dejarDeMedir(); pintarDock(); });
$('explicame').addEventListener('click', abrirGuia);
$('frase').addEventListener('click', () => { $('frase').classList.toggle('rtv-abierta'); medirDock(); });
function ponerPausa(si) { pausado = si; if (!si) S.pausaMedir = false; $('pausa').setAttribute('aria-pressed', String(pausado)); $('pausa').textContent = pausado ? 'Seguir' : 'Pausa'; if (!pausado && S.medir) { S.medir = null; pintarCalibre(); pintarDock(); } }
$('pausa').addEventListener('click', () => ponerPausa(!pausado));
// Tocar una pieza del dibujo: su nombre, una línea y dónde se explica
$('rtv-svg').addEventListener('click', ev => {
  const p = ev.target.closest('[data-pieza]'); if (!p) return; const P = PIEZAS[p.dataset.pieza]; if (!P) return;
  $('escena-lectura').innerHTML = `<b>${P.n}.</b> ${P.t} ${P.o ? org(P.o) : ''}<br>${cita(P.c)}`;
});
const raiz = $('raiz');
function medirDock() { requestAnimationFrame(() => { raiz.style.setProperty('--rtv-dock-h', $('dock').offsetHeight + 'px'); raiz.style.setProperty('--rtv-frase-h', ($('frase').hidden ? 0 : $('frase').offsetHeight) + 'px'); }); }
addEventListener('resize', () => { if (!mo || !raiz.offsetParent) return; montarMonitor(); llenarEstatico(); medirDock(); });

/* ---------- El bucle: solo corre con la vista a la vista; al salir de ella se para (y vuelve con arrancarBucle) ---------- */
let tPrev = 0, tLect = 0, corriendo = false;
function bucle(ts) {
  if (!raiz.offsetParent) { corriendo = false; tPrev = 0; document.body.classList.remove('rtv-activo'); return; }   // la vista está oculta: nada que animar
  if (!tPrev) tPrev = ts;
  const dt = Math.min(0.05, (ts - tPrev) / 1000); tPrev = ts;
  if (!pausado && mo) {
    acum += dt; const paso2 = 1 / PXS;
    while (acum >= paso2) { simT += paso2; acum -= paso2; mo.avanzar(simT + 0.07); procesarAgenda(); sincronizar(); if (++cuentaB >= KB) { cuentaB = 0; muestra(simT); } }
    relojParada(dt);
    pintarTiras(); pintarEscena(simT);
    if (ts - tLect > 400) { tLect = ts; aplicarTopes(false); pintarCifras(); if (S.parada) pintarFicha(); if (S.clave === 'torsade' || S.clave === 'hiperk' || S.adeno) pintarFrase(); }
  }
  requestAnimationFrame(bucle);
}
export function arrancarBucle() { if (REDUCIR || corriendo) return; corriendo = true; tPrev = 0; requestAnimationFrame(bucle); }

/* ---------- Abrir en un estado (lo llama index.js: «sinusal», «fa:dilt»…) ---------- */
export function abrirEstado(clave, extra = {}) {
  if (!ESTADOS[clave]) clave = 'sinusal';
  const rcp = extra.rcp; if (rcp) clave = 'fv';
  if (modo !== 'explorar') setModo('explorar');
  S.medir = null; if (pausado) ponerPausa(false);
  ponerEstado(clave, extra);
  if (clave === 'fa' && extra.farmaco) ponerFarmaco(extra.farmaco);
  if (rcp && S.parada) {   // «fv:rcp», «fv:rcp-adre», «fv:rcp-insufl»: la FV con las compresiones en marcha
    const p = S.parada; p.comp = true; p.ciclo = p.reloj;
    if (rcp === 'adre') { p.adrenalina.push(simT + 0.9); p.adreReloj = p.reloj; }
    if (rcp === 'insufl') p.insufl = 30;
    pintarFrase();
  }
  pintarDock(); if (REDUCIR) pintarEscena(simT); else arrancarBucle();
  medirDock();
}

/* ---------- Arranque ---------- */
montarEscena(); pintarFijos(); resetS('sinusal'); ponerEstado('sinusal');
if (REDUCIR) { const b = mo.latidosV[mo.latidosV.length - 1]; pintarEscena(b ? Math.min(simT, b.t0 + 0.05) : simT); }
medirDock();
window.__ritmo = { get modo() { return modo; }, setModo, mayeutica, get pausado() { return pausado; }, get corriendo() { return corriendo; }, ponerEstado, accion, S, leer, est, ecgEn, aplicarFarmacoFA, get simT() { return simT; }, get mo() { return mo; }, tras, avanzarHasta, pintarCifras, pintarFrase, taparTodo, arrancarBucle, abrirEstado };
