// Contrato del corazón (mv-eco-1, B-045 paso 1): lo que el motor entrega a la imagen de la eco. Puro, sin DOM; no
// importa nada del dibujo, del atlas ni de pruebas/. La imagen solo lee: nunca calcula una presión, un volumen, un caudal
// ni una FE. Nace al lado del motor; hoy no lo usa la app. Lo que el motor no da: origen 'hueco' (valor null), nunca una
// cifra del código sin cita. Lo que hoy sale del dibujo o del atlas: origen 'puente-hoy' (contrato-puente-hoy.mjs).
// `banda`: nombre de la medida en BANDAS (pruebas/bandas-paciente.mjs); los rangos no se copian aquí, los recibe
// validarContrato(c, { bandas, clave }) como argumento. Fuentes de esas bandas: ver bandas-paciente.mjs (libro y página).

import { BASE } from './motor.mjs';
import { tapseDeLatido } from './anatomia.mjs';   // lado del corazón (puro): el TAPSE sale del motor, ya sin el puente
export const ORIGENES = ['motor', 'puente-hoy', 'hueco'];
const USO = { b: 'B-mode', d: 'Doppler', m: 'modo M', l: 'lecturas', w: 'Wiggers', a: 'asa', g: 'geometría' };

const lista = [];
const C = (clave, unidad, que, origen, usa, ambito = 'latido', extra = {}) => lista.push({ clave, unidad, que, origen, usa: usa.map(x => USO[x]), ambito, ...extra });

// por instante (una muestra de motor.onda cada 2 ms)
C('t.fase', '0-1', 'Fase del ciclo (t / periodo)', 'motor', ['b', 'd', 'm', 'w'], 'instante');
C('t.ms', 'ms', 'Tiempo desde el inicio del latido', 'motor', ['d', 'm', 'w'], 'instante');
C('t.wiggers', 'A-G', 'Fase de Wiggers (A contracción auricular … G diástasis)', 'motor', ['w', 'l'], 'instante');
for (const [k, n] of [['vi', 'ventrículo izquierdo'], ['vd', 'ventrículo derecho'], ['ai', 'aurícula izquierda'], ['ad', 'aurícula derecha']])
  C('vol.' + k, 'mL', 'Volumen del ' + n, 'motor', ['b', 'm', 'a', 'w', 'g'], 'instante');
for (const [k, n] of [['vi', 'VI'], ['vd', 'VD'], ['ai', 'AI'], ['ad', 'AD'], ['ao', 'aorta'], ['ap', 'arteria pulmonar'], ['peri', 'saco pericárdico']])
  C('pres.' + k, 'mmHg', 'Presión de ' + n, 'motor', ['d', 'a', 'w', 'g'], 'instante');
for (const [k, n] of [['mit', 'mitral'], ['tri', 'tricúspide'], ['ao', 'aórtica (sirve al TSVI: v = q / anillo.ao)'], ['pul', 'pulmonar'], ['vp', 'venas pulmonares (S, D y Ar)']])
  C('q.' + k, 'mL/s', 'Caudal por la válvula ' + n, 'motor', ['d', 'b'], 'instante');
C('q.reg.im', 'mL/s', 'Caudal regurgitante mitral', 'motor', ['d', 'b'], 'instante');
C('q.reg.it', 'mL/s', 'Caudal regurgitante tricuspídeo', 'motor', ['d', 'b'], 'instante');
C('q.reg.iao', 'mL/s', 'Caudal regurgitante aórtico (el motor no lo entrega por instante)', 'hueco', ['d'], 'instante');
for (const k of ['mit', 'tri', 'ao', 'pul']) C('valv.' + k, 'bool', 'Válvula ' + k + ' abierta', 'motor', ['b', 'd', 'm'], 'instante');
C('gradSepto', 'mmHg', 'Presión del VD menos la del VI (de ahí sale el septo)', 'motor', ['g', 'b'], 'instante');
C('septo', '0-1', 'Aplanamiento del tabique de hoy (aplanamientoSeptal); el −1…+1 llega en el paso 2', 'puente-hoy', ['b', 'g'], 'instante');
C('septoSigno', '0…+1', 'Tabique continuo del motor: 0 = normal (cóncavo hacia el VD), +1 = aplanado hacia el VI (pVD ≥ pVI); sin valores negativos', 'motor', ['b', 'g'], 'instante');
// por latido
const B = (clave, unidad, que, origen, usa, banda) => C(clave, unidad, que, origen, usa, 'latido', banda ? { banda } : {});
B('fe', '%', 'Fracción de eyección del VI', 'motor', ['l', 'a']);
B('feVd', '%', 'Fracción de eyección del VD (volumen telediastólico − telesistólico)', 'motor', ['l'], 'feVd');
B('vs', 'mL', 'Volumen sistólico', 'motor', ['l', 'a']);
B('gc', 'L/min', 'Gasto cardíaco', 'motor', ['l']);
B('paps', 'mmHg', 'Presión sistólica de la arteria pulmonar', 'motor', ['l', 'd'], 'paps');
B('papd', 'mmHg', 'Presión diastólica de la arteria pulmonar', 'motor', ['l']);
B('pvc', 'mmHg', 'Presión venosa central (media de la AD)', 'motor', ['l'], 'pvc');
B('pcp', 'mmHg', 'Presión de enclavamiento (media de la AI)', 'motor', ['l'], 'pcp');
B('pam', 'mmHg', 'Presión arterial media', 'motor', ['l']);
B('fc', 'lpm', 'Frecuencia cardíaca', 'motor', ['l', 'm']);
B('vdvi', 'ratio', 'VD/VI en volumen telediastólico (las fuentes dan diámetro o área, no volumen: sin banda)', 'motor', ['l']);
B('tapse', 'mm', 'TAPSE (tapseDeLatido, anatomia.mjs)', 'motor', ['l', 'm'], 'tapse');
B('tapsePaps', 'mm/mmHg', 'TAPSE / PSAP', 'motor', ['l'], 'tapsePaps');
B('E', 'cm/s', 'Onda E mitral', 'puente-hoy', ['d', 'l'], 'E');
B('A', 'cm/s', 'Onda A mitral', 'puente-hoy', ['d', 'l'], 'A');
B('ea', 'ratio', 'E/A mitral', 'puente-hoy', ['d', 'l'], 'ea');
B('dt', 'ms', 'Tiempo de desaceleración de la E', 'puente-hoy', ['d', 'l'], 'dt');
B('eAvg', 'cm/s', 'e′ medio (septal y lateral)', 'puente-hoy', ['d', 'l'], 'eAvg');
B('eSep', 'cm/s', 'e′ septal', 'puente-hoy', ['d', 'l'], 'eSep');
B('eLat', 'cm/s', 'e′ lateral', 'puente-hoy', ['d', 'l'], 'eLat');
B('eE', 'ratio', 'E/e′ medio', 'puente-hoy', ['l'], 'eE');
B('trv', 'm/s', 'Velocidad de la regurgitación tricuspídea: √(gradIT / 4), derivada del motor', 'motor', ['d', 'l']);
B('gradIT', 'mmHg', 'Gradiente máximo VD−AD en sístole (derivado del motor)', 'motor', ['d', 'l']);
B('pared.vd', 'mm', 'Pared libre del VD (paredesDe, anatomia.mjs)', 'motor', ['b', 'l']);
B('pared.vi', 'mm', 'Pared posterior del VI (paredesDe, anatomia.mjs)', 'motor', ['b', 'l']);
B('masa.vi', 'g/m²', 'Masa del VI indexada (paredesDe, anatomia.mjs)', 'motor', ['b', 'l']);
B('masa.vd', 'g', 'Masa del VD', 'hueco', ['b']);
for (const k of ['mit', 'tri', 'ao', 'pul']) B('anillo.' + k, 'cm²', 'Área del anillo ' + k + ' (anillosDe, anatomia.mjs)', 'motor', ['d', 'b']);
B('raiz', 'mm', 'Diámetro de la raíz aórtica: el dibujo de hoy solo da el anillo; la raíz es ilustrativa', 'hueco', ['b', 'l']);
B('anillo.excursion.tri', 'mm', 'Excursión del anillo tricuspídeo (= TAPSE; tapseDeLatido, anatomia.mjs)', 'motor', ['m', 'l']);
B('anillo.excursion.mit', 'mm', 'Excursión del anillo mitral (MAPSE: sin fuente en docs/)', 'hueco', ['m']);
B('anillo.vel.s', 'cm/s', 's′ del anillo (el modelo no calcula velocidades de tejido)', 'hueco', ['d']);
B('anillo.vel.e', 'cm/s', 'e′ del anillo (= e′ medio de hoy)', 'puente-hoy', ['d']);
B('anillo.vel.a', 'cm/s', 'a′ del anillo', 'hueco', ['d']);
B('tiempos.ivrt', 'ms', 'Relajación isovolumétrica: cierre aórtico → apertura mitral', 'motor', ['d', 'w']);
B('tiempos.ivct', 'ms', 'Contracción isovolumétrica: cierre mitral → apertura aórtica', 'motor', ['d', 'w']);
B('tiempos.eyeccion', 'ms', 'Eyección: apertura → cierre aórtico', 'motor', ['d', 'w']);
B('tiempos.tap', 'ms', 'Aceleración pulmonar: apertura pulmonar → pico de q.pul (derivado del motor)', 'motor', ['d']);
B('tiempos.dt', 'ms', 'Desaceleración de la E (= dt de hoy)', 'puente-hoy', ['d']);
B('derrame', 'mL', 'Líquido pericárdico', 'motor', ['b', 'l']);
B('vci.diam', 'mm', 'Diámetro de la VCI (el motor no lo calcula)', 'hueco', ['b', 'l']);
B('vci.colapso', '%', 'Colapso inspiratorio de la VCI', 'hueco', ['b', 'l']);
B('septoFase', '-', "Fase en que septoSigno pasa de SEPTO_UMBRAL: 'sistole' | 'diastole' | 'ambas' | null (sístole = válvula aórtica abierta)", 'motor', ['b']);
B('regional', '0-1', 'Acortamiento relativo por segmento (1 = normal, 0 = acinesia): 17 del VI (Lang 2015) + 3 del VD (SEGMENTOS_REGIONAL); McConnell en el TEP. Ilustrativo (ver regionalDe)', 'motor', ['b']);
B('periodo', 's', 'Duración del latido (motor.ultimo.periodo)', 'motor', ['l', 'w']);
for (const [k, n] of [['s1', 'cierre mitral (S1)'], ['s2', 'cierre aórtico (S2)'], ['s2p', 'cierre pulmonar'], ['aoAbre', 'apertura aórtica'], ['mitAbre', 'apertura mitral'], ['pulAbre', 'apertura pulmonar'], ['triCierra', 'cierre tricuspídeo']])
  B('tiempos.eventos.' + k, 's', 'Instante en el latido: ' + n + ' (null si el motor no lo da)', 'motor', ['d', 'w']);
B('fusion', 'bool', 'Fusión de las ondas E y A mitrales (medidasLatido de hoy)', 'puente-hoy', ['d']);
B('limites', 'mL', 'LIMITES del dibujo de hoy: { vi, vd, au } = [mín, máx] (corazon-geo.mjs)', 'puente-hoy', ['b']);
B('fueraDeMarco', 'bool', 'La fisiología se sale de lo que el dibujo de hoy puede mostrar (LIMITES)', 'puente-hoy', ['b']);

export const CAMPOS = Object.freeze(Object.fromEntries(lista.map(c => [c.clave, Object.freeze(c)])));

// Septo continuo (mv-eco-2a5 P2). Del gradiente transeptal pVD − pVI (mmHg) que da el motor, que ya lleva el tabique
// (p.tabique) y la interdependencia (septoDesplaza, septoTope) dentro de pvi/pvd. Curva suave, sin escalón:
//   r = ln(1 + exp(grad / SEPTO_ESCALA))   (rampa suave: ~0 con el VI muy por encima del VD)
//   septoSigno = tanh(r / SEPTO_NORMA)     (0 … +1; 0,5 ≈ grad 6 mmHg)
// No hay negativos: con pVI ≫ pVD el tabique ya es el normal (cóncavo hacia el VD) y el motor no modela un abombamiento
// extra hacia el VD. Las dos constantes son ILUSTRATIVAS (el motor no da una geometría): se eligieron para que el normal
// quede <0,3 y el aplanamiento aparezca con pVD ≈ pVI. Umbral de fase 0,5: ilustrativo.
export const SEPTO_ESCALA = 2, SEPTO_NORMA = 6, SEPTO_UMBRAL = 0.5;
// SEGUNDO ARGUMENTO OPCIONAL (paso 6, M2): `pvi` (mmHg). En SÍSTOLE el aplanamiento no sigue al signo de pVD−pVI sino a la presión
// RELATIVA del VD: con la presión sistólica del VD >50 % de la sistémica el tabique pierde la curvatura ya en mesosístole (King 1983,
// Circulation 68:68-75, https://pubmed.ncbi.nlm.nih.gov/6851056/: curvatura septal en telediástole, mesosístole y telesístole frente a la
// presión relativa del VD; mejor correlación en telesístole, r = 0,86). Ryan 1985 (JACC 5:918-27, https://pubmed.ncbi.nlm.nih.gov/3973294/):
// EI ≈ 1,0 en el normal, 1,44 en telesístole en la sobrecarga de presión. Así, con pVI de sístole, grad_eff = pVD − 0,5·pVI; el término
// se apaga (puerta suave 20-40 mmHg de pVI) en diástole, donde manda el signo. El umbral 0,5 es de King; la puerta, ILUSTRATIVA.
// Sin `pvi` la función es la de siempre (misma firma de un argumento, mismo rango 0…+1).
export const SEPTO_RELATIVA = 0.5;
// TOPE DIASTÓLICO (154, decisión del usuario 01/11/2026): con `pvi` y fuera de la sístole (puerta apagada) el signo satura suave en
// SEPTO_TOPE_DIAST (s → T·tanh(s/T)). Sin él la telediástole del TEP saturaba (IE 1,60, pVD 13 / pVI 4); en la clínica el IE de
// telediástole del TEP agudo es 1,21 ± 0,21 (Demertzis 2025, PMC12485522) y 1,26 ± 0,11 en la sobrecarga de presión crónica (Ryan 1985,
// PMID 3973294). Con 0,29 el TEP da IE TD 1,38 (defecto) y 1,40 (100 %), y la HP crónica 1,35; el normal no cambia (signo ~0,06).
// Valor ILUSTRATIVO: el más alto que deja el TEP ≤1,4; más alto aún lo pediría el EI del dibujo nuevo (domo-septo.test, HP ≥1,1 en TD). La sístole (puerta = 1, King 1983) y la llamada de un argumento quedan como estaban.
export const SEPTO_TOPE_DIAST = 0.29;
export const septoSignoDe = (grad, pvi) => {
  const w = pvi == null ? 0 : Math.min(1, Math.max(0, (pvi - 20) / 20)), puerta = w * w * (3 - 2 * w);
  const ge = grad + SEPTO_RELATIVA * puerta * (pvi ?? 0);
  const s = Math.tanh(Math.log1p(Math.exp(ge / SEPTO_ESCALA)) / SEPTO_NORMA);
  if (pvi == null) return s;
  return puerta * s + (1 - puerta) * SEPTO_TOPE_DIAST * Math.tanh(s / SEPTO_TOPE_DIAST);
};

// Movimiento regional (mv-eco-2a5 P5b). 20 valores 0-1 = acortamiento de cada segmento ÷ el normal (1 = normal, 0 = acinesia).
// Orden: 17 del VI en el modelo de 17 segmentos recomendado por Lang 2015 (Fig. 3, PDF p. 11; recomendación, p. 12; nombres,
// p. 10): basal 1-6, medio 7-12, apical 13-16 y ápex 17; luego 3 del VD.
export const SEGMENTOS_REGIONAL = Object.freeze([
  ...['anterior', 'anteroseptal', 'inferoseptal', 'inferior', 'inferolateral', 'anterolateral'].map(n => 'VI basal ' + n),
  ...['anterior', 'anteroseptal', 'inferoseptal', 'inferior', 'inferolateral', 'anterolateral'].map(n => 'VI medio ' + n),
  ...['anterior', 'septal', 'inferior', 'lateral'].map(n => 'VI apical ' + n), 'VI ápex',
  'VD pared libre basal', 'VD pared libre media', 'VD ápex']);
// FE del motor normal (medida: FEVI 60,9 %, FEVD 53,0 %): el cociente caso ÷ normal es el acortamiento relativo. Ilustrativo.
const FEVI_NORMAL = 61, FEVD_NORMAL = 53;
// McConnell: acinesia de la pared libre del VD con movimiento normal del ápex, específico del TEP agudo y presente en el 20 %
// (Marino 2024, cap. 22, «Diagnostic Aids», PDF p. 7 de docs/marino-2024-respiratory-management-caps22-26.pdf; no trae página impresa).
// Fuente de la magnitud: McConnell 1996 (Am J Cardiol 78:469-73, PMID 8752195, https://pubmed.ncbi.nlm.nih.gov/8752195/): en el TEP
// agudo la excursión de la línea media de la pared libre MEDIA fue −0,2 ± 0,8 mm (acinesia) y la del ápex 5,7 ± 0,8 mm (normal, p = NS);
// en la HP primaria, anormal en todas las regiones. De ahí: la pared libre media se mueve MCCONNELL_MEDIA (0,15) de lo que toca por la
// FEVD (≈ acinesia), el ápex se conserva (APEX_DEFICIT 0,1 del déficit global: «normal») y la basal queda en MCCONNELL_PARED (0,5,
// ILUSTRATIVO: McConnell no mide la base; el TAPSE bajo la pone el motor). La isquemia regional del VI es un HUECO: el motor no tiene
// regiones, así que los 17 del VI son uniformes (FEVI ÷ normal). HP crónica (pared gruesa): hipocinesia global del VD.
const MCCONNELL_PARED = 0.5, MCCONNELL_MEDIA = 0.15, APEX_DEFICIT = 0.1;
const c01 = (x) => Math.min(1, Math.max(0, x));
const esTep = (motor) => motor.p.rPul >= 2 * BASE.rPul && (motor.p.mioVd ?? 1) <= 1;
/** `motor` solo se lee: la sobrecarga aguda de presión del VD (TEP) es resistencia pulmonar ≥ 2× la normal con la pared del VD fina (mioVd ≤ 1). */
export function regionalDe(motor, feVi, feVd) {
  const vi = c01(feVi / FEVI_NORMAL), vd = c01(feVd / FEVD_NORMAL);
  const tep = esTep(motor);
  const basal = tep ? vd * MCCONNELL_PARED : vd, media = tep ? vd * MCCONNELL_MEDIA : vd, apex = tep ? 1 - (1 - vd) * APEX_DEFICIT : vd;
  return [...Array(17).fill(vi), basal, media, apex];
}
/** Intensidad 0-1 del signo de McConnell para el dibujo (0 fuera del TEP): crece con el déficit de la FEVD hasta 0,5 de él (ilustrativo). */
export function mcconnellDe(motor) {
  const o = motor.onda; if (!esTep(motor) || !o?.length) return 0;
  const td = Math.max(...o.map(m => m.vvd)), ts = Math.min(...o.map(m => m.vvd));
  return c01((1 - c01((100 * (td - ts) / td) / FEVD_NORMAL)) / 0.5);
}

const ORIGEN = Object.fromEntries(lista.map(c => [c.clave, c.origen]));
const L = (v) => Number.isFinite(v) ? v : null;

/** Lee el motor (nunca lo escribe) y devuelve { latido, instantes, origen }. `puente` = puenteHoy(motor) o nada. */
export function contratoDe(motor, puente) {
  const o = motor.onda, u = motor.ultimo;
  const pv = puente?.valores ?? {}, serie = puente?.serie?.septo ?? [];
  const instantes = o.map((m, i) => ({
    t: { fase: m.t / u.periodo, ms: m.t * 1000, wiggers: m.fase },
    vol: { vi: m.vvi, vd: m.vvd, ai: m.vai, ad: m.vad },
    pres: { vi: m.pvi, vd: m.pvd, ai: m.pai, ad: m.pad, ao: m.pao, ap: m.pap, peri: m.pperi },
    q: { mit: m.qMit, tri: m.qTri, ao: m.qAo, pul: m.qPul, vp: m.qVp, reg: { im: m.qMitReg, it: m.qTriReg, iao: null } },
    valv: { mit: !!m.vMit, tri: !!m.vTri, ao: !!m.vAo, pul: !!m.vPul },
    gradSepto: m.pvd - m.pvi,
    septoSigno: septoSignoDe(m.pvd - m.pvi, m.pvi),
    septo: puente ? (serie[i] ?? null) : null,
  }));
  const gradIT = Math.max(...o.map(m => m.pvd - m.pad));
  let iPico = 0; o.forEach((m, i) => { if (m.qPul > o[iPico].qPul) iPico = i; });
  const ms = (x) => x == null ? null : x * 1000;
  const vdTd = Math.max(...o.map(m => m.vvd)), vdTs = Math.min(...o.map(m => m.vvd));
  const P = (k) => puente ? (pv[k] ?? null) : null;
  // fase: sístole = válvula aórtica abierta; diástole = el resto del latido
  const hay = (sis) => o.some((m, i) => !!m.vAo === sis && instantes[i].septoSigno >= SEPTO_UMBRAL);
  const fS = hay(true), fD = hay(false);
  const latido = {
    fe: 100 * u.fe, feVd: 100 * (vdTd - vdTs) / vdTd, vs: u.vs, gc: u.gc, paps: u.paps, papd: u.papd, pvc: u.pvc, pcp: u.pcp,
    pam: u.pam, fc: u.fc, vdvi: vdTd / Math.max(...o.map(m => m.vvi)),
    tapse: tapseDeLatido(u), tapsePaps: tapseDeLatido(u) / u.paps,
    E: P('E'), A: P('A'), ea: P('ea'), dt: P('dt'), eAvg: P('anillo.vel.e'), eSep: P('eSep'), eLat: P('eLat'), eE: P('eE'),
    trv: gradIT > 0 ? Math.sqrt(gradIT / 4) : 0, gradIT,
    'pared.vd': P('pared.vd'), 'pared.vi': P('pared.vi'), 'masa.vi': P('masa.vi'), 'masa.vd': null,
    'anillo.mit': P('anillo.mit'), 'anillo.tri': P('anillo.tri'), 'anillo.ao': P('anillo.ao'), 'anillo.pul': P('anillo.pul'),
    raiz: null, 'anillo.excursion.tri': P('anillo.excursion.tri'), 'anillo.excursion.mit': null,
    'anillo.vel.s': null, 'anillo.vel.e': P('anillo.vel.e'), 'anillo.vel.a': null,
    'tiempos.ivrt': ms(u.tMitAbre != null && u.tS2 != null ? u.tMitAbre - u.tS2 : null),
    'tiempos.ivct': ms(u.tAoAbre != null && u.tS1 != null ? u.tAoAbre - u.tS1 : null),
    'tiempos.eyeccion': ms(u.tS2 != null && u.tAoAbre != null ? u.tS2 - u.tAoAbre : null),
    'tiempos.tap': u.tPulAbre != null ? ms(o[iPico].t - u.tPulAbre) : null,
    'tiempos.dt': P('dt'), derrame: motor.s.liquidoPeri ?? 0, 'vci.diam': null, 'vci.colapso': null,
    periodo: L(u.periodo),
    'tiempos.eventos.s1': L(u.tS1), 'tiempos.eventos.s2': L(u.tS2), 'tiempos.eventos.s2p': L(u.tS2p), 'tiempos.eventos.aoAbre': L(u.tAoAbre),
    'tiempos.eventos.mitAbre': L(u.tMitAbre), 'tiempos.eventos.pulAbre': L(u.tPulAbre), 'tiempos.eventos.triCierra': L(u.tTriCierra),
    fusion: puente ? (pv.fusion ?? null) : null, limites: puente ? (puente.limites ?? null) : null,
    septoFase: fS && fD ? 'ambas' : fS ? 'sistole' : fD ? 'diastole' : null, regional: regionalDe(motor, 100 * u.fe, 100 * (vdTd - vdTs) / vdTd), fueraDeMarco: puente ? !!pv.fueraDeMarco : null,
  };
  return { latido, instantes, origen: { ...ORIGEN } };
}

/** Tolerancias NUMÉRICAS de coherencia (no son criterio clínico): caudal con la válvula cerrada y salto al cerrar el latido. */
export const TOLERANCIAS = { qCerrada: 5, saltoVol: 0.05, saltoPres: 0.1 };   // mL/s; fracción del recorrido del latido

/**
 * Comprueba la parte NUMÉRICA del contrato (rúbrica de realismo, criterios 1, 4, 5 y 6; la forma y la textura no).
 * bandas = BANDAS de pruebas/bandas-paciente.mjs; clave = 'tep:def' …; sin ellas no hay lista fueraDeRango.
 * → { errores, fueraDeRango, diagnostico, sinCampo: [medidas de BANDAS sin campo], sinValor: [campos con banda y valor null] }
 */
export function validarContrato(c, { bandas, clave } = {}) {
  const errores = [], fueraDeRango = [], diagnostico = [], sinCampo = [], sinValor = [];
  const num = (v, n) => { if (typeof v === 'number' && !Number.isFinite(v)) errores.push(`${n}: ${v} (no finito)`); };
  for (const [k, v] of Object.entries(c.latido)) {
    num(v, k);
    if (!CAMPOS[k]) errores.push(`latido.${k}: campo sin esquema en CAMPOS`);
    else if (!CAMPOS[k].unidad) errores.push(`${k}: sin unidad`);
    else if (CAMPOS[k].origen === 'hueco' && v != null) errores.push(`${k}: es hueco y trae valor`);
  }
  for (const k of ['tiempos.ivrt', 'tiempos.ivct', 'tiempos.eyeccion', 'tiempos.tap', 'tiempos.dt'])
    if (c.latido[k] != null && c.latido[k] < 0) errores.push(`${k}: ${c.latido[k].toFixed(0)} ms negativo`);
  for (const cp of Object.values(CAMPOS)) if (!cp.unidad || !cp.que || !ORIGENES.includes(cp.origen)) errores.push(`${cp.clave}: esquema incompleto`);
  const I = c.instantes;
  if (!I.length) { errores.push('sin instantes'); return { errores, fueraDeRango, diagnostico, sinCampo, sinValor }; }
  I.forEach((m, i) => {
    for (const g of ['vol', 'pres', 'q']) for (const [k, v] of Object.entries(m[g])) if (typeof v === 'number') num(v, `${g}.${k}@${i}`);
    num(m.gradSepto, `gradSepto@${i}`); num(m.t.ms, `t.ms@${i}`);
    for (const [k, v] of Object.entries(m.vol)) if (v < 0) errores.push(`vol.${k}@${i}: ${v.toFixed(1)} mL < 0`);
    for (const [k, v] of [['mit', m.q.mit], ['tri', m.q.tri], ['ao', m.q.ao], ['pul', m.q.pul]])
      if (!m.valv[k] && v > TOLERANCIAS.qCerrada) errores.push(`q.${k}@${i}: ${v.toFixed(1)} mL/s anterógrado con la válvula cerrada`);
  });
  const a = I[0], z = I[I.length - 1];
  for (const g of ['vol', 'pres']) for (const k of Object.keys(a[g])) {
    const xs = I.map(m => m[g][k]), rec = Math.max(...xs) - Math.min(...xs);
    const tol = (g === 'vol' ? TOLERANCIAS.saltoVol : TOLERANCIAS.saltoPres) * rec + 1e-6;
    if (Math.abs(z[g][k] - a[g][k]) > tol) errores.push(`salto al volver a empezar: ${g}.${k} ${z[g][k].toFixed(1)} → ${a[g][k].toFixed(1)} (tolerancia ${tol.toFixed(2)})`);
  }
  if (bandas && clave && bandas[clave]) for (const b of bandas[clave]) {
    const campo = Object.values(CAMPOS).find(x => x.banda === b.medida);
    const v = campo ? c.latido[campo.clave] : undefined;
    if (!campo) { sinCampo.push(b.medida); continue; }
    if (v == null) { sinValor.push(campo.clave); continue; }
    const ok = Number.isFinite(v) && (b.min_excl ? v > b.min : v >= b.min) && (b.max_excl ? v < b.max : v <= b.max);
    if (!ok) (b.diagnostico ? diagnostico : fueraDeRango).push(`${b.medida} ${v.toFixed(2)} fuera de ${b.min}…${b.max} (${b.fuente})`);
  }
  return { errores, fueraDeRango, diagnostico, sinCampo, sinValor };
}
