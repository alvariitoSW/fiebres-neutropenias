// Los datos de la maqueta b3-ritmo: fuentes con su cita, estados con nombre, frases, guías, notas y la muestra de la Mayéutica.
import { S } from './pagina.js';
import { MOTOR } from './motor.js';
/* ============================================================
   LOS DATOS: fuentes (cada cita lleva a la app), estados con nombre (cada uno, una configuración del grafo con su lista
   de fuentes), frases, explicaciones guiadas, notas y la muestra de la Mayéutica. Otro libro añade aquí un estado o una
   nota sin tocar el motor ni el dibujo.
   ============================================================ */
export const $ = id => document.getElementById(id);
export const REDUCIR = matchMedia('(prefers-reduced-motion: reduce)').matches;
export const clamp = (v, a, b) => Math.min(b, Math.max(a, v));
export const coma = (x, d = 0) => (+x).toFixed(d).replace('.', ',');
export const NS = 'http://www.w3.org/2000/svg';
export const IMG = '../../js/modules/cardiologia/img/';

// ---------- Las fichas de la app y sus PDF ----------
export const FICHAS = {
  'mc-taqui-reconocimiento': { esp: 'cardiologia', view: 'merinoCardiologia', panel: 'panel-merino-cardio-tabs', titulo: 'Taquiarritmias: reconocimiento', corto: 'Taquiarritmias', libro: 'Marino', pdf: 'C' },
  'mc-fa-frecuencia': { esp: 'cardiologia', view: 'merinoCardiologia', panel: 'panel-merino-cardio-tabs', titulo: 'Fibrilación auricular: control de frecuencia', corto: 'FA: frecuencia', libro: 'Marino', pdf: 'C' },
  'mc-fa-cardioversion': { esp: 'cardiologia', view: 'merinoCardiologia', panel: 'panel-merino-cardio-tabs', titulo: 'Fibrilación auricular: cardioversión y prevención de ictus', corto: 'FA: cardioversión', libro: 'Marino', pdf: 'C' },
  'mc-otras-taqui': { esp: 'cardiologia', view: 'merinoCardiologia', panel: 'panel-merino-cardio-tabs', titulo: 'Otras taquiarritmias: TAM, PSVT, TV y torsade de pointes', corto: 'Otras taquiarritmias', libro: 'Marino', pdf: 'C' },
  'mc-sca-diagnostico': { esp: 'cardiologia', view: 'merinoCardiologia', panel: 'panel-merino-cardio-tabs', titulo: 'Síndromes coronarios agudos: diagnóstico', corto: 'SCA: diagnóstico', libro: 'Marino', pdf: 'C' },
  'mc-paro-soporte': { esp: 'cardiologia', view: 'merinoCardiologia', panel: 'panel-merino-cardio-tabs', titulo: 'Paro cardíaco: soporte vital básico y avanzado', corto: 'Paro: soporte vital', libro: 'Marino', pdf: 'C' },
  'mc-paro-monitorizacion': { esp: 'cardiologia', view: 'merinoCardiologia', panel: 'panel-merino-cardio-tabs', titulo: 'Paro cardíaco: monitorización de la reanimación', corto: 'Paro: monitorización', libro: 'Marino', pdf: 'C' },
  'mc-posresucitacion': { esp: 'cardiologia', view: 'merinoCardiologia', panel: 'panel-merino-cardio-tabs', titulo: 'Síndrome posparo cardíaco y pronóstico neurológico', corto: 'Síndrome posparo', libro: 'Marino', pdf: 'C' },
  'cardio-fisiologia-aplicada': { esp: 'fisioUci', view: 'cardiologia', panel: 'panel-cardio-tabs', titulo: 'Fisiología cardíaca aplicada', corto: 'Fisiología cardíaca', libro: 'El Libro Azul', pdf: 'LA' },
  'fisio-hiperpotasemia': { esp: 'nefrologia', view: 'nefrona', panel: 'panel-fisio-tabs', titulo: 'Hiperpotasemia', corto: 'Hiperpotasemia', libro: 'Nefrología al día (De Sequera, 2024)', pdf: 'K' },
};
const PDF = { C: '../../docs/marino-2024-cardiac-disorders-caps18-21.pdf', LA: '../../docs/libro-azul-seccion-i-cardiovascular-parte1.pdf', K: '../../docs/de-sequera-2024-trastornos-potasio.pdf' };
export function cita(c) {
  const F = FICHAS[c.f], pag = /[-,]/.test(String(c.p)) ? `pp. ${c.p}` : `p. ${c.p}`;
  return `<span class="cita"><button type="button" class="cita-ir" data-especialidad="${F.esp}" data-view="${F.view}" data-panel="${F.panel}" data-tab="${c.f}" data-resaltar="#${c.id}" data-titulo="${F.titulo}" data-sitio="${c.sitio}">Ver en la ficha: ${F.corto} · ${c.sitio} →</button><a class="cita-pdf" href="${PDF[F.pdf]}#page=${String(c.p).match(/\d+/)[0]}" target="_blank" rel="noopener">PDF, ${pag}</a></span>`;
}
let toastT = null;
document.addEventListener('click', ev => {
  const b = ev.target.closest('.cita-ir'); if (!b) return;
  const t = $('toast'); t.hidden = false;
  t.textContent = `En la app, este botón abre la ficha «${b.dataset.titulo}» y resalta «${b.dataset.sitio}». Al volver, regresas aquí.`;
  clearTimeout(toastT); toastT = setTimeout(() => { t.hidden = true; }, 3600);
});
export const org = (t, ilu) => `<span class="org${ilu ? ' ilu' : ''}">${t}</span>`;
const cf = (f, id, sitio, p) => ({ f, id, sitio, p });
// Marino, caps. 19-21 (páginas del PDF)
export const C = {
  hallazgos: cf('mc-taqui-reconocimiento', 'mc-taqui-hallazgos', 'Los tres hallazgos', 18),
  regular: cf('mc-taqui-reconocimiento', 'mc-qrs-estrecho-regular', 'QRS estrecho regular', '18-19'),
  f192: cf('mc-taqui-reconocimiento', 'mc-fig-19-2', 'Fig. 19.2', 20),
  irregular: cf('mc-taqui-reconocimiento', 'mc-qrs-estrecho-irregular', 'QRS estrecho irregular', 20),
  f193: cf('mc-taqui-reconocimiento', 'mc-fig-19-3', 'Fig. 19.3', 20),
  ancho: cf('mc-taqui-reconocimiento', 'mc-qrs-ancho', 'QRS ancho', '20-21'),
  faEpi: cf('mc-fa-frecuencia', 'mc-fa-epidemiologia', 'Fibrilación auricular', 21),
  faHosp: cf('mc-fa-frecuencia', 'mc-fa-hospital', 'FA en el hospital', 21),
  faCons: cf('mc-fa-frecuencia', 'mc-fa-consecuencias', 'Consecuencias', '21-22'),
  f194: cf('mc-fa-frecuencia', 'mc-fig-19-4', 'Fig. 19.4', 22),
  t191: cf('mc-fa-frecuencia', 'mc-tabla-19-1', 'Tabla 19.1', '22-23'),
  dilt: cf('mc-fa-frecuencia', 'mc-tabla-19-1', 'Diltiazem', 23),
  f195: cf('mc-fa-frecuencia', 'mc-fig-19-5', 'Fig. 19.5', 24),
  bb: cf('mc-fa-frecuencia', 'mc-tabla-19-1', 'Betabloqueantes', 24),
  amio: cf('mc-fa-frecuencia', 'mc-amiodarona-iv', 'Amiodarona', '24-25'),
  digo: cf('mc-fa-frecuencia', 'mc-tabla-19-1', 'Digoxina', 25),
  final: cf('mc-fa-frecuencia', 'mc-fa-punto-final', 'Punto final del control', 25),
  cv: cf('mc-fa-cardioversion', 'mc-cardioversion', 'Cardioversión eléctrica', 25),
  cha: cf('mc-fa-cardioversion', 'mc-tabla-19-2', 'Tabla 19.2', 26),
  valv: cf('mc-fa-cardioversion', 'mc-fa-valvular', 'FA valvular', '26-27'),
  warf: cf('mc-fa-cardioversion', 'mc-tabla-19-3', 'Warfarina y ACOD', 27),
  wpw: cf('mc-fa-cardioversion', 'mc-wpw', 'Síndrome de WPW', '27-28'),
  tam: cf('mc-otras-taqui', 'mc-tam', 'Taquicardia auricular multifocal', 28),
  psvt: cf('mc-otras-taqui', 'mc-psvt', 'Mecanismo de la reentrada', 29),
  vagal: cf('mc-otras-taqui', 'mc-psvt', 'Maniobras vagales', 29),
  adeno: cf('mc-otras-taqui', 'mc-adenosina', 'Adenosina', '29-30'),
  t194: cf('mc-otras-taqui', 'mc-tabla-19-4', 'Tabla 19.4', 30),
  psvtOtras: cf('mc-otras-taqui', 'mc-adenosina', 'Otras terapias', 31),
  tv: cf('mc-otras-taqui', 'mc-tv', 'Taquicardia ventricular', 31),
  tvsvt: cf('mc-otras-taqui', 'mc-tv-vs-svt', 'TV o SVT con aberrancia', '31-32'),
  f196: cf('mc-otras-taqui', 'mc-fig-19-6', 'Fig. 19.6', 31),
  f197: cf('mc-otras-taqui', 'mc-fig-19-7', 'Fig. 19.7', 32),
  f198: cf('mc-otras-taqui', 'mc-fig-19-8', 'Fig. 19.8', '32-33'),
  torsade: cf('mc-otras-taqui', 'mc-torsade', 'Torsade de pointes', 34),
  f199: cf('mc-otras-taqui', 'mc-fig-19-9', 'Fig. 19.9', 34),
  t195: cf('mc-otras-taqui', 'mc-tabla-19-5', 'Tabla 19.5', 34),
  qtc: cf('mc-otras-taqui', 'mc-qtc', 'Medir el QT', '34-35'),
  tdpManejo: cf('mc-otras-taqui', 'mc-tv-polimorfica', 'Manejo de la TV polimórfica', 35),
  madeja: cf('mc-otras-taqui', 'mc-madeja', 'Desenredar la madeja', '35-36'),
  scaEcg: cf('mc-sca-diagnostico', 'mc-sca-ecg', 'El electrocardiograma', 40),
  t201: cf('mc-sca-diagnostico', 'mc-tabla-20-1', 'Tabla 20.1', 41),
  t212: cf('mc-paro-soporte', 'mc-tabla-21-2', 'Tabla 21.2', '56-57'),
  tiempo: cf('mc-paro-soporte', 'mc-svb-tiempo', 'Dependencia del tiempo', 56),
  compres: cf('mc-paro-soporte', 'mc-tabla-21-2', 'Compresiones torácicas', 57),
  insufl: cf('mc-paro-soporte', 'mc-insuflaciones', 'Insuflaciones rápidas', 58),
  desfib: cf('mc-paro-soporte', 'mc-desfibrilacion', 'Desfibrilación', '58-59'),
  f211: cf('mc-paro-soporte', 'mc-fig-21-1', 'Fig. 21.1', 59),
  algoritmo: cf('mc-paro-soporte', 'mc-algoritmo-aha', 'Algoritmo', 59),
  refractaria: cf('mc-paro-soporte', 'mc-desfibrilacion', 'Casos resistentes al choque', '59-60'),
  aesp: cf('mc-paro-soporte', 'mc-aesp', 'Asistolia y AESP', 60),
  f212: cf('mc-paro-soporte', 'mc-algoritmo-aha', 'Fig. 21.2', 61),
  adrenalina: cf('mc-paro-soporte', 'mc-epinefrina-paro', 'Adrenalina', '60-62'),
  f213: cf('mc-paro-soporte', 'mc-fig-21-3', 'Fig. 21.3', 62),
  etco2: cf('mc-paro-monitorizacion', 'mc-etco2', 'ETCO₂', '62-63'),
  f214: cf('mc-paro-monitorizacion', 'mc-fig-21-4', 'Fig. 21.4', 63),
  eco: cf('mc-paro-monitorizacion', 'mc-eco-paro', 'Ecografía en la parada', '63-64'),
  posparo: cf('mc-posresucitacion', 'mc-posparo', 'Periodo posreanimación', 64),
};
// Otras fuentes de la app (se conectan; no se funden): El Libro Azul y Nefrología al día
const LA = {
  cond: cf('cardio-fisiologia-aplicada', 'fuci-conduccion', 'Sistema de conducción', 7),
  pa: cf('cardio-fisiologia-aplicada', 'fuci-potencial-accion', 'Potencial de acción', 8),
};
const KC = { ecg: cf('fisio-hiperpotasemia', 'hk-fig9', 'Figura 9 · ECG', 21) };

// ---------- Calibración de la FA: refractariedad del torniquete → FC media (medida con el motor: 6 semillas × 56 s) ----------
const CAL_FA = [[0.9, 147.3], [1.0, 144.8], [1.1, 139.1], [1.2, 131.4], [1.3, 126.6], [1.4, 120.7], [1.5, 115.9], [1.6, 109.8], [1.7, 105.4], [1.8, 99.3], [1.9, 93.4], [2.0, 91.3], [2.2, 81.8], [2.4, 75.9], [2.6, 70.4]];
export function navParaFC(fc) {
  if (fc >= CAL_FA[0][1]) return CAL_FA[0][0];
  for (let i = 0; i < CAL_FA.length - 1; i++) { const [f0, c0] = CAL_FA[i], [f1, c1] = CAL_FA[i + 1]; if (fc <= c0 && fc >= c1) return f0 + (f1 - f0) * (c0 - fc) / (c0 - c1); }
  return CAL_FA[CAL_FA.length - 1][0];
}
// Fig. 19.5 (p. 24): FC media de 0 a 6 h (lectura del gráfico)
export const F195 = { dilt: [139, 122, 103, 96, 91, 87, 87], amio: [136, 125, 115, 110, 105, 102, 101], digo: [138, 136, 125, 116, 109, 106, 108] };
export const NOMBRE_F = { dilt: 'diltiazem', amio: 'amiodarona', digo: 'digoxina' };
export const fcFig = (f, h) => { const a = F195[f], i = Math.min(5, Math.floor(h)), x = h - i; return a[i] + (a[i + 1] - a[i]) * x; };
// Fig. 21.1 (p. 59): supervivencia según el minuto del primer choque (lectura del gráfico)
export const F211 = [[5, 40], [10, 29.5], [15, 19], [20, 9]];
export const sup211 = m => { if (m <= 5) return 40; if (m >= 20) return 9; let i = 0; while (F211[i + 1][0] < m) i++; const [x0, y0] = F211[i], [x1, y1] = F211[i + 1]; return y0 + (y1 - y0) * (m - x0) / (x1 - x0); };
// Fig. 21.3 (p. 62): presión de perfusión coronaria durante la RCP y la adrenalina en el minuto 5 (lectura del gráfico)
export const F213 = [[3, 22], [5, 21.6], [6, 33], [7, 31], [8, 30.8]];
// Fig. 21.4 (p. 63): ETCO2 durante 20 min de RCP (medias; lectura del gráfico)
export const F214 = { rce: [[1, 27], [10, 25], [15, 28], [20, 32]], no: [[1, 19.5], [10, 9], [15, 8], [20, 7]] };

// ---------- Los pacientes del bloque que salen aquí ----------
export const PACIENTES = {
  teodoro: '<b>Teodoro</b>, 74 años, 78 kg · día 2 de una lobectomía · HTA y diabetes',
  hugo: '<b>Hugo</b>, 61 años · cardiopatía isquémica · ingresado por neumonía',
  leandro: '<b>Leandro</b>, 49 años · pancreatitis en planta · FV presenciada',
  joaquin: '<b>Joaquín</b>, 56 años, 84 kg · dolor opresivo desde hace 40 min',
};

// ---------- Los estados con nombre ----------
// Cada uno: familia, nombre, fuentes (lista), frase con su origen y una configuración del grafo (aplicar).
export const FAMILIAS = [['sinusal', 'Sinusal'], ['estrecho', 'Estrecho'], ['ancho', 'Ancho'], ['parada', 'Parada'], ['lentos', 'Lentos'], ['mas', 'Más']];
const RITMO_BASE = mo => { mo.m.fcSA = 75; };
export const ESTADOS = {
  sinusal: { fam: 'sinusal', nombre: 'Sinusal', corto: 'Sinusal', fuentes: [LA.cond, C.hallazgos, C.regular, LA.pa],
    frase: ['Un solo reloj, el nodo sinusal. Cada P trae su QRS, y el QRS es estrecho.', 'ficha · p. 18-19'],
    aplicar(mo, t, s) { mo.m.fcSA = s.fcSA || 75; mo.m.ramaD = !s.bloqueoD; mo.m.ramaI = !s.bloqueoI; mo.reiniciarSA(t + 0.05); } },
  taquiSinusal: { fam: 'sinusal', nombre: 'Taquicardia sinusal', corto: 'Taquicardia sinusal', fuentes: [C.hallazgos, C.regular, C.psvt],
    frase: ['El mismo camino, con el reloj más deprisa: P iguales y PR igual. Busca la causa: aquí el ritmo es la respuesta.', 'ficha · p. 18-19'],
    aplicar(mo, t, s) { mo.m.fcSA = s.fcSA || 120; mo.reiniciarSA(t + 0.05); } },
  rama: { fam: 'sinusal', nombre: 'Bloqueo de rama', corto: 'Bloqueo de rama', fuentes: [C.ancho, C.f196],
    frase: ['Una rama no conduce: su ventrículo se activa tarde, de músculo a músculo. QRS ancho aunque el ritmo nazca arriba.', 'ficha · p. 20-21'],
    aplicar(mo, t, s) { RITMO_BASE(mo); mo.m.ramaD = s.rama !== 'd'; mo.m.ramaI = s.rama === 'd'; mo.m.musV = 1.4; mo.reiniciarSA(t + 0.05); } },
  nodal: { fam: 'estrecho', nombre: 'Reentrada nodal', corto: 'Reentrada nodal', fuentes: [C.psvt, C.f192, C.vagal, C.adeno, C.t194],
    frase: ['La onda da vueltas dentro del nodo AV: baja por un carril y vuelve por el otro. Cada vuelta, un latido.', 'ficha · p. 29'],
    aplicar(mo, t) { RITMO_BASE(mo); mo.reiniciarSA(t + 0.05); mo.disparar(teselaDe('sia', 5, 0), t + 0.05 + 0.30); } },
  flutter: { fam: 'estrecho', nombre: 'Flúter auricular', corto: 'Flúter', fuentes: [C.regular, C.hallazgos],
    frase: ['Un solo circuito gira en la aurícula: dientes de sierra. El torniquete deja pasar uno de cada dos (2:1) o de cada tres (3:1).', 'ficha · p. 18-19'],
    aplicar(mo, t, s) { mo.m.sa = false; mo.m.flOn = true; mo.m.pAmp = 0; mo.ponerOndaF('sierra', t); mo.m.navRef = s.flutter === 3 ? { R: 0.5, L: 0.5, C: 0.45 } : { R: 0.36, L: 0.36, C: 0.30 }; mo.arrancarCircuito(MOTOR.grafo.FL, t + 0.02); } },
  fa: { fam: 'estrecho', nombre: 'Fibrilación auricular', corto: 'FA', fuentes: [C.irregular, C.faHosp, C.faCons, C.f194, C.t191, C.f195, C.final],
    frase: ['Sin director: la aurícula tiembla y no empuja; el torniquete deja pasar lo que puede. Los latidos muy juntos no llegan a la muñeca.', 'ficha · p. 20-22'],
    aplicar(mo, t, s) { mo.m.fa = true; mo.m.pAmp = 0.25; mo.ponerOndaF('f', t); mo.m.navRef = { R: 0.28, L: 0.28, C: 0.22 }; mo.m.navF = navParaFC(s.fcFA); mo.m.llenadoMalo = !!s.llenadoMalo; mo.reiniciarSA(t + 0.05); mo.proxFA = t; } },
  tam: { fam: 'estrecho', nombre: 'Taquicardia auricular multifocal', corto: 'TAM', fuentes: [C.irregular, C.f193, C.tam],
    frase: ['Varios focos auriculares disparan por turnos: P de varias formas y PR variable. Busca el pulmón enfermo y el magnesio.', 'ficha · p. 20, 28'],
    aplicar(mo, t, s) {
      mo.m.sa = false;
      const focos = [teselaDe('ad', 2, 1), teselaDe('ad', 7, 1), teselaDe('sia', 2, 0), teselaDe('ai', 9, 1)];
      mo.m.foco = { cada: s.tamCada || 0.5, jitter: 0.24, sitio: (tt, azar) => focos[Math.floor(azar() * focos.length)] }; mo.proxFoco = t + 0.05; } },
  wpw: { fam: 'estrecho', nombre: 'Wolff-Parkinson-White', corto: 'WPW', fuentes: [C.wpw],
    frase: ['Un atajo a través del anillo, sin torniquete: PR corto y onda delta antes del QRS.', 'ficha · p. 27'],
    aplicar(mo, t, s) { mo.m.apOn = true; mo.m.fcSA = 75; if (s.wpwFa) { mo.m.fa = true; mo.m.pAmp = 0.25; mo.ponerOndaF('f', t); mo.m.navRef = { R: 0.28, L: 0.28, C: 0.22 }; mo.m.navF = s.wpwNodo ? 2.4 : 1.1; mo.proxFA = t; } mo.reiniciarSA(t + 0.05); } },
  tv: { fam: 'ancho', nombre: 'Taquicardia ventricular', corto: 'TV', fuentes: [C.tv, C.tvsvt, C.f197, C.f198], paciente: 'hugo',
    frase: ['QRS ancho y regular, 140-200 lpm, de comienzo brusco. Las P van por libre: aurículas y ventrículos laten por separado.', 'ficha · p. 31-32'],
    aplicar(mo, t) { RITMO_BASE(mo); mo.m.crOn = true; mo.m.musV = 1.35; mo.reiniciarSA(t + 0.12); mo.arrancarCircuito(MOTOR.grafo.CR, t + 0.02); } },
  aberrancia: { fam: 'ancho', nombre: 'Supraventricular con aberrancia', corto: 'Aberrancia', fuentes: [C.ancho, C.tvsvt, C.f196, C.f198, C.madeja],
    frase: ['Una reentrada nodal que baja con una rama bloqueada: QRS ancho que parece una TV.', 'ficha · p. 31'],
    aplicar(mo, t) { RITMO_BASE(mo); mo.m.ramaI = false; mo.m.musV = 1.4; mo.reiniciarSA(t + 0.05); mo.disparar(teselaDe('sia', 5, 0), t + 0.05 + 0.30); } },
  torsade: { fam: 'ancho', nombre: 'QT largo y torsade de pointes', corto: 'Torsade', fuentes: [C.torsade, C.t195, C.qtc, C.f199, C.tdpManejo, LA.pa], paciente: 'hugo',
    frase: ['Lo que alarga la repolarización alarga el QT. Con el QTc por encima de 0,5 s, la puerta queda abierta a la torsade.', 'ficha · p. 34-35'],
    aplicar(mo, t, s) { RITMO_BASE(mo); mo.m.apdExtra = qtExtra(s); mo.reiniciarSA(t + 0.05);
      if (s.tdp) { mo.m.tdp = true; mo.m.sa = false; mo.m.foco = { cada: 0.27, jitter: 0.03, sitio: tt => focoGiratorio(tt) }; mo.proxFoco = t + 0.1; mo.m.sinMecanica = true; } } },
  fv: { fam: 'parada', nombre: 'Fibrilación ventricular', corto: 'FV', fuentes: [C.desfib, C.f211, C.t212, C.algoritmo, C.adrenalina, C.f213, C.etco2, C.f214, C.insufl], paciente: 'leandro',
    frase: ['Los ventrículos se activan sin orden: no hay latido ni pulso. Compresiones ya y el choque cuanto antes.', 'ficha · p. 56-59'],
    aplicar(mo, t) { RITMO_BASE(mo); mo.m.fv = true; mo.m.sinMecanica = true; mo.proxFV = t; mo.reiniciarSA(t + 0.1); } },
  aesp: { fam: 'parada', nombre: 'Actividad eléctrica sin pulso', corto: 'AESP', fuentes: [C.aesp, C.adrenalina, C.eco, C.f212],
    frase: ['Hay ritmo pero no pulso: la electricidad va, el corazón no expulsa. No se desfibrila: busca la causa.', 'ficha · p. 60'],
    aplicar(mo, t) { mo.m.fcSA = 64; mo.m.sinMecanica = true; mo.m.musV = 1.6; mo.reiniciarSA(t + 0.05); } },
  asistolia: { fam: 'parada', nombre: 'Asistolia', corto: 'Asistolia', fuentes: [C.aesp, C.adrenalina, C.eco],
    frase: ['No hay actividad eléctrica. No se desfibrila: compresiones y adrenalina.', 'ficha · p. 60'],
    aplicar(mo) { mo.m.sa = false; mo.m.sinMecanica = true; } },
  rce: { fam: null, nombre: 'Vuelve el pulso', corto: 'Vuelve el pulso', fuentes: [C.desfib, C.f212, C.etco2, C.posparo],
    frase: ['Ha vuelto el pulso y la ETCO₂ sube de golpe. Es el principio: ahora empieza el síndrome posparo.', 'ficha · p. 61-64'],
    aplicar(mo, t) { mo.m.fcSA = 96; mo.m.contractil = 0.75; mo.reiniciarSA(t + 0.3); } },
  stemi: { fam: 'mas', nombre: 'ST elevado', corto: 'ST elevado', fuentes: [C.scaEcg, C.t201], paciente: 'joaquin',
    frase: ['Un STEMI levanta el ST: mídelo en el punto J y compáralo con el umbral de su derivación y de su sexo.', 'ficha · p. 40-41'],
    aplicar(mo, t) { mo.m.fcSA = 82; mo.reiniciarSA(t + 0.05); } },
  hiperk: { fam: 'mas', nombre: 'Potasio alto', corto: 'K⁺ alto', fuentes: [KC.ecg, LA.pa],
    frase: ['El potasio alto cambia la célula y, con ella, el ECG: T picudas, luego PR largo, sin P y QRS ancho.', 'Nefrología al día · p. 21'],
    aplicar(mo, t, s) { aplicarK(mo, s.k || 4.2); mo.reiniciarSA(t + 0.05); } },
  'pend-bradi': { fam: 'lentos', nombre: 'Bradicardia sinusal', corto: 'Bradicardia sinusal', pendiente: true, fuentes: [] },
  'pend-bav1': { fam: 'lentos', nombre: 'Bloqueo AV de 1.er grado', corto: 'BAV 1.er grado', pendiente: true, fuentes: [] },
  'pend-bav2': { fam: 'lentos', nombre: 'Bloqueo AV de 2.º grado', corto: 'BAV 2.º grado', pendiente: true, fuentes: [] },
  'pend-bav3': { fam: 'lentos', nombre: 'Bloqueo AV de 3.er grado', corto: 'BAV 3.er grado', pendiente: true, fuentes: [] },
  'pend-mp': { fam: 'lentos', nombre: 'Marcapasos', corto: 'Marcapasos', pendiente: true, fuentes: [] },
};
export const PENDIENTE = 'Pendiente de fuente: Marino (caps. 19-21) no trata las bradicardias ni los bloqueos AV. Llegarán de la guía europea de estimulación cardíaca (ESC 2021), con el mismo torniquete y el mismo ECG. Hasta entonces, ni trazo ni cifra.';
export const ESC_2021 = 'https://academic.oup.com/eurheartj/article/42/35/3427/6358547';

function teselaDe(banda, i, c) { return MOTOR.grafo.teselas.find(t => t.banda === banda && t.i === i && t.c === c).nodo.k; }
// La torsade: un foco que gira por el ventrículo (el eje del QRS rota y los complejos «giran»). Ilustrativo.
function focoGiratorio(t) {
  const a = 2 * Math.PI * t / 2.2, x = 205 + 92 * Math.cos(a), y = 222 + 42 * Math.sin(a);
  let mejor = null, dm = 1e9; for (const ts of MOTOR.grafo.regiones.v) { const d = (ts.x - x) ** 2 + (ts.y - y) ** 2; if (d < dm) { dm = d; mejor = ts; } }
  return mejor.nodo.k;
}
// Lo que alarga el QT (Tabla 19.5 y p. 34): cuánto alarga cada uno es ilustrativo, ajustado para que la hoja de Hugo
// (haloperidol + claritromicina + K⁺ 3,1 + Mg²⁺ 1,4) dé el QT de su caso: 520 ms a 75 lpm.
const QT_ALARGA = { haloperidol: 0.058, claritromicina: 0.046, amiodarona: 0.046, kBajo: 0.028, mgBajo: 0.02, caBajo: 0.025 };
export const qtExtra = s => Object.entries(QT_ALARGA).reduce((a, [k, v]) => a + (s.qt && s.qt[k] ? v : 0), 0);
// El potasio (De Sequera 2024, p. 21): ~6,5 T picudas; >7 PR largo, sin P y luego QRS ancho; >8 el QRS se funde con la
// T en una onda sinuosa. Cuánto cambia cada parámetro del modelo: ilustrativo.
export function aplicarK(mo, k) {
  const m = mo.m, r = (a, b) => clamp((k - a) / (b - a), 0, 1);
  m.tAmp = 1 + 1.7 * r(5.5, 6.6); m.tAncho = 1 - 0.42 * r(5.5, 6.6) + 0.55 * r(7.8, 8.6);
  m.apd = 0.30 - 0.02 * r(5.5, 7);
  m.navRet = 1 + 0.75 * r(7, 8);
  m.pAmp = 1 - r(7, 7.6);
  m.hpRet = 1 + 3.2 * r(7.2, 8.2) + 0.9 * r(8.2, 8.6);
  m.musV = 1 + 1.2 * r(7.2, 8) + 1.2 * r(8, 8.6);
}

// ---------- Explicación guiada de cada estado (3-5 pasos que señalan el dibujo) ----------
export const GUIAS = {
  sinusal: { tit: 'Ritmo sinusal', pasos: [
    { t: 'El nodo sinusal, junto a la entrada de la cava superior, dispara solo: es el reloj (70-80 veces por minuto).', r: ['#rtm-sa'], c: LA.cond, org: 'El Libro Azul' },
    { t: 'La onda recorre las dos aurículas: la tinta avanza por el músculo y, en la tira, dibuja la onda P.', r: ['#rtm-aurs', '#rtm-ecg'], c: C.regular, org: 'el recorrido: fisiología general' },
    { t: 'Entre aurículas y ventrículos hay un anillo fibroso que no conduce. El único paso es el nodo AV, que retrasa la onda 0,12 s: así las aurículas llenan antes los ventrículos.', r: ['#rtm-anillo', '#rtm-nav', '#rtm-lupa-av'], c: LA.cond, org: 'el retraso: El Libro Azul; el anillo: fisiología general' },
    { t: 'Por el His (2 m/s), sus ramas y la red de Purkinje (4 m/s), todo el ventrículo se activa casi a la vez: QRS estrecho, de 0,12 s o menos.', r: ['#rtm-his', '#rtm-ramas', '#rtm-ecg'], c: C.hallazgos, org: 'velocidades: El Libro Azul' },
    { t: 'Cada trozo de músculo vive un potencial de acción de ~300 ms, de -90 a +45 mV. Mientras dura (fases 0, 1, 2 y parte de la 3) no se puede volver a activar: es su periodo refractario.', r: ['#rtm-celula'], c: LA.pa, org: 'El Libro Azul' }] },
  taquiSinusal: { tit: 'Taquicardia sinusal', pasos: [
    { t: 'El mismo camino, pero el reloj dispara más deprisa: más de 100 por minuto.', r: ['#rtm-sa', '#rtm-ecg'], c: C.hallazgos },
    { t: 'P iguales y PR igual antes de cada QRS: es sinusal.', r: ['#rtm-ecg'], c: C.regular },
    { t: 'Empieza y acaba poco a poco; la reentrada nodal, de golpe. Y la taquicardia puede no ser el problema: busca su causa.', r: ['#rtm-sa'], c: C.psvt }] },
  rama: { tit: 'Bloqueo de rama', pasos: [
    { t: 'Una rama del His no conduce (aquí, la que está tachada): su lado del ventrículo se activa tarde, de músculo a músculo.', r: ['#rtm-ramas', '#rtm-vents'], c: C.ancho, org: 'qué rama y su dibujo: fisiología general' },
    { t: 'El QRS se ensancha (más de 0,12 s) aunque el ritmo nazca arriba: un QRS ancho no siempre es ventricular.', r: ['#rtm-ecg'], c: C.ancho },
    { t: 'La onda T va al revés que el QRS: la repolarización sigue el mismo camino anómalo.', r: ['#rtm-ecg'], c: C.ancho, org: 'fisiología general' },
    { t: 'Si llega una taquicardia supraventricular, será de QRS ancho: es la aberrancia (la tienes en «Ancho»).', r: ['#rtm-ecg'], c: C.f196 }] },
  nodal: { tit: 'Reentrada en el nodo AV', pasos: [
    { t: 'El nodo AV tiene dos carriles con distinto periodo refractario: uno rápido que tarda en rearmarse y uno lento que se rearma antes.', r: ['#rtm-lupa-av', '#rtm-torn-r', '#rtm-torn-l'], c: C.psvt, org: 'cuál es cuál: fisiología general' },
    { t: 'Un latido auricular prematuro encuentra el rápido sin rearmar: baja por el lento y vuelve a subir por el rápido. La vuelta se sostiene sola.', r: ['#rtm-torn-r', '#rtm-torn-l'], c: C.psvt },
    { t: 'Cada vuelta manda un latido: QRS estrecho y regular, 140-250 lpm, a menudo sin P visibles (aquí la P cae junto al QRS).', r: ['#rtm-ecg', '[data-fila="fc"]'], c: C.f192, org: 'dónde cae la P: fisiología general' },
    { t: 'Empieza de golpe. Primero, maniobras vagales; si no la cortan, adenosina, que cierra el nodo unos segundos: el circuito pasa por él y se rompe.', r: ['#rtm-nav'], c: C.vagal }] },
  adenosina: { tit: 'La adenosina', pasos: [
    { t: '6 mg en bolo rápido por una vena periférica, en la conexión del catéter, y lavado con suero. Actúa en menos de 30 s.', r: ['#rtm-bomba'], c: C.t194 },
    { t: 'Echa el cerrojo al nodo AV: un bloqueo AV transitorio. En la tira salen P sin QRS.', r: ['#rtm-cerrojo', '#rtm-ecg'], c: C.adeno },
    { t: 'El circuito pasaba por el nodo: se rompe. El efecto dura 1-2 min y el bloqueo se va solo en unos 60 s (no responde a la atropina).', r: ['#rtm-lupa-av'], c: C.adeno, org: 'aquí el tiempo va comprimido: ilustrativo' },
    { t: 'Vuelve el sinusal. 6 mg y luego 12 mg cortan más del 90 %. Por una vía central, la mitad de la dosis.', r: ['#rtm-sa'], c: C.t194 }] },
  flutter: { tit: 'Flúter auricular', pasos: [
    { t: 'Un solo circuito grande gira en la aurícula derecha, alrededor de la tricúspide.', r: ['#rtm-circuito-fl'], c: C.regular, org: 'el sitio del circuito: fisiología general' },
    { t: 'La aurícula se activa sin parar: la línea de base dibuja dientes de sierra.', r: ['#rtm-ecg', '#rtm-aurs'], c: C.regular },
    { t: 'El torniquete no da abasto y deja pasar uno de cada dos (2:1) o uno de cada tres (3:1): QRS estrecho y regular.', r: ['#rtm-lupa-av', '[data-fila="fc"]'], c: C.regular }] },
  fa: { tit: 'Fibrilación auricular', pasos: [
    { t: 'Las aurículas no tienen director: muchas ondas pequeñas chocan entre sí. No hay P: hay ondas de fibrilación.', r: ['#rtm-aurs', '#rtm-ecg'], c: C.irregular, org: 'las ondas: fisiología general' },
    { t: 'Llegan al nodo impulsos a destiempo y el torniquete solo deja pasar los que lo encuentran rearmado: el RR es irregular.', r: ['#rtm-lupa-av'], c: C.irregular, org: 'el nodo como filtro: fisiología general' },
    { t: 'Sin la contracción de la aurícula se pierde ~25 % del llenado. Se nota si el llenado ya era malo: estenosis mitral o hipertrofia.', r: ['#rtm-aurs', '#rtm-art'], c: C.faCons },
    { t: 'Dos latidos muy juntos: el ventrículo no se llena y la sistólica cae. Algunos no llegan a la muñeca: es el déficit de pulso.', r: ['#rtm-art', '[data-fila="pulso"]'], c: C.f194 },
    { t: 'Los fármacos que alargan la conducción del nodo endurecen el muelle del torniquete: pasan menos. Pruébalo en «Tratar».', r: ['#rtm-torn-r'], c: C.t191, org: 'el muelle: la imagen del modelo' }] },
  faF: { tit: 'FA: el fármaco y las horas', pasos: [
    { t: () => ({ dilt: 'Diltiazem 0,25 mg/kg IV en 2 min y luego 5-15 mg/h. En una hora controla al 55 %; la perfusión, hasta al 90 %.', amio: 'Amiodarona 150 mg IV en 10 min, luego 1 mg/min 6 h y 0,5 mg/min 18 h; no más de 2,2 g en 24 h.', digo: 'Digoxina 0,25 mg IV cada 2 h hasta 1,5 mg. Lenta: no se usa sola para el control agudo.' })[S.farmaco], r: ['#rtm-bomba', '#rtm-torn-r'], c: C.t191 },
    { t: 'La Fig. 19.5: el diltiazem cruza los 100 lpm hacia las 2-2,5 h; la amiodarona y la digoxina no bajan de 100 en 6 h.', r: ['#g195'], c: C.f195, org: 'lectura del gráfico' },
    { t: 'Al bajar la FC, los latidos se espacian, el ventrículo se llena y el déficit de pulso se va: un punto final más fisiológico que una cifra.', r: ['#rtm-art', '[data-fila="pulso"]'], c: C.final, org: 'cuánto: ilustrativo' },
    { t: 'El precio: el diltiazem da hipotensión en el 20-30 % y es inotrópico negativo; la amiodarona, mucho menos (la que da, por su disolvente, el polisorbato 80).', r: ['#rtm-art'], c: C.amio }] },
  tam: { tit: 'Taquicardia auricular multifocal', pasos: [
    { t: 'Varios focos de la aurícula disparan por turnos: cada P tiene otra forma y el PR cambia.', r: ['#rtm-aurs', '#rtm-ecg'], c: C.irregular },
    { t: 'Ritmo irregular, de QRS estrecho. Más de la mitad, con enfermedad pulmonar crónica; también con déficit de Mg²⁺ y K⁺.', r: ['#rtm-ecg'], c: C.tam },
    { t: 'Magnesio IV aunque el Mg sérico sea normal: 2 g en 15 min y 6 g en 6 h. Corrigió el 88 % en un estudio.', r: ['#rtm-bomba'], c: C.tam },
    { t: 'Si falla y no hay EPOC: metoprolol (80 %). Con EPOC, verapamilo: corrige menos de la mitad, pero frena la FC.', r: ['#rtm-lupa-av'], c: C.tam }] },
  wpw: { tit: 'Wolff-Parkinson-White', pasos: [
    { t: 'Además del nodo hay un atajo a través del anillo: la vía accesoria. No tiene torniquete.', r: ['#rtm-ap', '#rtm-puente'], c: C.wpw, org: 'su sitio: fisiología general (ver la nota)' },
    { t: 'Parte del ventrículo se activa antes, por el atajo, y despacio, de músculo a músculo: PR corto y onda delta antes del QRS.', r: ['#rtm-ecg', '#rtm-vents'], c: C.wpw, org: 'por qué la delta: fisiología general' },
    { t: 'Da taquicardias supraventriculares que se repiten, por reentrada. Si llega una FA, el atajo lo cambia todo: pruébalo en «Tratar».', r: ['#rtm-puente'], c: C.wpw }] },
  wpwFa: { tit: 'FA con una vía accesoria', pasos: [
    { t: 'Las aurículas fibrilan, y el atajo, sin torniquete, deja pasar impulsos muy seguidos: QRS anchos, rápidos e irregulares.', r: ['#rtm-puente', '#rtm-ecg'], c: C.wpw },
    { t: 'Los fármacos que frenan el nodo (antagonistas del calcio, betabloqueantes, digoxina) no frenan el atajo: la FC no baja.', r: ['#rtm-torn-r', '#rtm-puente'], c: C.wpw },
    { t: 'Peor: el bloqueo selectivo del nodo puede precipitar una FV.', r: ['#rtm-vents'], c: C.wpw },
    { t: 'Por eso: cardioversión eléctrica, o amiodarona o procainamida.', r: ['#rtm-desfib'], c: C.wpw }] },
  tv: { tit: 'Taquicardia ventricular', pasos: [
    { t: 'Un circuito gira alrededor de una cicatriz del VI. En cada vuelta sale un frente que recorre el ventrículo de músculo a músculo.', r: ['#rtm-circuito-tv'], c: C.tv, org: 'el circuito: fisiología general' },
    { t: 'QRS ancho y regular, 140-200 lpm, de comienzo brusco. Casi nunca sin cardiopatía estructural.', r: ['#rtm-ecg', '[data-fila="fc"]'], c: C.tv },
    { t: 'Aurículas y ventrículos laten por separado: P sueltas que no van con el QRS (disociación AV). A veces un latido sinusal se cuela y choca con el ventricular: latido de fusión.', r: ['#rtm-sa', '#rtm-ecg'], c: C.tvsvt },
    { t: 'Con cardiopatía, el 95 % de los QRS anchos son TV. Estable: amiodarona. Inestable: cardioversión sincronizada a 100 J; si falla, 100 J bifásico o 200 J; evita 360 J.', r: ['#rtm-desfib'], c: C.f198 },
    { t: 'La adenosina corta la mayoría de las supraventriculares y no corta la TV: aquí solo echa el cerrojo al torniquete, y el circuito, que no pasa por él, sigue. Por eso sirve si dudas.', r: ['#rtm-lupa-av'], c: C.f198, org: 'que el circuito no pase por el nodo: fisiología general' }] },
  aberrancia: { tit: 'Supraventricular con aberrancia', pasos: [
    { t: 'Una reentrada nodal (nace arriba, en el torniquete) que baja con la rama izquierda bloqueada.', r: ['#rtm-lupa-av', '#rtm-ramas'], c: C.ancho },
    { t: 'QRS ancho y regular: parece una TV. Si fuera irregular, la pista sería la contraria: la TV nunca es irregular.', r: ['#rtm-ecg'], c: C.madeja },
    { t: 'Al volver a sinusal, el QRS sigue igual de ancho: el bloqueo de rama ya estaba (Fig. 19.6).', r: ['#rtm-ecg'], c: C.f196 },
    { t: 'Si dudas y está estable: adenosina. Corta la supraventricular; la TV, no.', r: ['#rtm-cerrojo'], c: C.f198 }] },
  torsade: { tit: 'QT largo y torsade', pasos: [
    { t: 'El QT es la despolarización y la repolarización del ventrículo: del inicio del QRS al final de la T. Se mide mejor en V3-V4.', r: ['#rtm-ecg'], c: C.qtc },
    { t: 'Haloperidol, macrólidos, antiarrítmicos IA y III, y K⁺, Ca²⁺ o Mg²⁺ bajos alargan el QT. En la célula, la repolarización tarda más.', r: ['#rtm-celula'], c: C.t195, org: 'en qué fase: fisiología general' },
    { t: 'QTc = QT / √RR. Normal, ≤0,44 s; por encima de 0,5 s, riesgo de torsade. Predice poco: el QT largo es frecuente en la UCI y la torsade, rara.', r: ['[data-fila="qt"]'], c: C.qtc },
    { t: 'Torsade: una TV polimórfica cuyos QRS giran alrededor de la línea. Sostenida: desfibrilar; magnesio 1-2 g en 15 min; corregir K⁺ y Mg²⁺ y retirar el fármaco.', r: ['#rtm-ecg'], c: C.tdpManejo }] },
  fv: { tit: 'Fibrilación ventricular', pasos: [
    { t: 'Los ventrículos se activan sin orden: no hay latido y la presión se aplana.', r: ['#rtm-vents', '#rtm-art'], c: C.desfib, org: 'fisiología general' },
    { t: 'Es un ritmo desfibrilable. Compresiones en menos de 10 s: 5-6 cm de profundidad, 100-120 por minuto.', r: ['#rtm-art'], c: C.t212 },
    { t: 'El choque, cuanto antes: con el primero a los 5 min sobrevive el 40 %; a los 20 min, menos del 10 %.', r: ['#g211'], c: C.f211, org: 'lectura del gráfico' },
    { t: 'Un choque despolariza todo el tejido a la vez. Si nada vuelve a desordenarlo, el nodo sinusal manda otra vez.', r: ['#rtm-vents', '#rtm-desfib'], c: C.desfib, org: 'mecanismo: fisiología general' },
    { t: 'Tras cada choque, 2 min de compresiones antes de mirar el ritmo. Si hace falta un 2.º choque, adrenalina 1 mg cada 3-5 min; si hace falta un 3.º, amiodarona 300 mg (y luego 150).', r: ['#rtm-bomba'], c: C.algoritmo }] },
  rcp: { tit: 'La RCP y la ETCO₂', pasos: [
    { t: 'Tus manos dan un flujo pequeño: mira la presión con cada compresión.', r: ['#rtm-art'], c: C.compres, org: 'cuánto: ilustrativo' },
    { t: 'La ETCO₂ sigue al gasto: con la ventilación fija, cambia en la misma proporción.', r: ['#rtm-co2', '[data-fila="co2"]'], c: C.etco2 },
    { t: 'Ventilar deprisa (30 por minuto, el triple) no deja vaciar el pulmón: PEEP intrínseca, menos retorno y menos presión de perfusión coronaria.', r: ['#rtm-co2'], c: C.insufl },
    { t: 'La adrenalina cierra la periferia: la presión de perfusión coronaria sube un 30 % y dura al menos 3 minutos.', r: ['#g213'], c: C.adrenalina },
    { t: 'Si a los 20 min la ETCO₂ no pasa de 10-15 mmHg, es improbable que vuelva el pulso.', r: ['#g214'], c: C.f214, org: 'lectura del gráfico' }] },
  refractaria: { tit: 'FV que no cede', pasos: [
    { t: 'Tres choques sin éxito: un buen resultado solo en el 5 %.', r: ['#rtm-desfib'], c: C.refractaria },
    { t: 'Con ECMO disponible las 24 horas, es una opción: se han descrito mejores resultados.', r: ['#rtm-vents'], c: C.refractaria },
    { t: 'Mientras, lo que no cambia: compresiones de calidad, adrenalina cada 3-5 min y la ETCO₂ como guía.', r: ['#rtm-co2'], c: C.algoritmo }] },
  aesp: { tit: 'Actividad eléctrica sin pulso', pasos: [
    { t: 'Hay actividad eléctrica organizada, pero el corazón no expulsa: no hay pulso.', r: ['#rtm-ecg', '#rtm-art'], c: C.aesp },
    { t: 'No se desfibrila: compresiones y adrenalina 1 mg cada 3-5 min.', r: ['#rtm-bomba'], c: C.aesp },
    { t: 'Busca la causa con las T: neumotórax a tensión, taponamiento, tromboembolismo y trombosis coronaria.', r: ['#rtm-vents'], c: C.aesp },
    { t: 'La eco ayuda: el neumotórax (S 91 %, E 99 % en supino) y el derrame; con cualquier derrame en la parada, pericardiocentesis.', r: ['#rtm-vents'], c: C.eco }] },
  asistolia: { tit: 'Asistolia', pasos: [
    { t: 'No hay actividad eléctrica: la tira es una línea.', r: ['#rtm-ecg'], c: C.aesp },
    { t: 'No se desfibrila salvo que aparezca una FV o una TV: compresiones y adrenalina.', r: ['#rtm-bomba'], c: C.aesp },
    { t: 'Un corazón quieto en la eco del trauma predijo la muerte en el 100 %, pero los médicos no coinciden al verlo: las guías no lo usan para parar.', r: ['#rtm-vents'], c: C.eco }] },
  rce: { tit: 'Vuelve el pulso', pasos: [
    { t: 'Tras el choque y las compresiones, el nodo sinusal vuelve a mandar: P, QRS y pulso.', r: ['#rtm-sa', '#rtm-ecg'], c: C.desfib },
    { t: 'La ETCO₂ sube de golpe y se mantiene; suele llegar a 40 mmHg o más.', r: ['#rtm-co2'], c: C.f212 },
    { t: 'Es el principio: cerca del 70 % de los que recuperan el pulso no sobreviven a la hospitalización.', r: ['#rtm-vents'], c: C.posparo }] },
  stemi: { tit: 'ST elevado', pasos: [
    { t: 'Una zona del ventrículo sin riego: su músculo lesionado crea una corriente que levanta el ST.', r: ['#rtm-lesion'], c: C.scaEcg, org: 'el mecanismo: fisiología general' },
    { t: 'Mide en el punto J, donde acaba el QRS, en milímetros (1 mm = 0,1 mV).', r: ['#rtm-ecg'], c: C.t201, org: '1 mm = 0,1 mV: fisiología general' },
    { t: 'En V2-V3: ≥2 mm en varones y ≥1,5 mm en mujeres; en las demás, ≥1 mm. Siempre en dos o más derivaciones contiguas.', r: ['[data-fila="st"]'], c: C.t201 },
    { t: 'Un ST elevado pide reperfusión urgente. Un bloqueo de rama o un ritmo de marcapasos pueden taparlo: con sospecha de isquemia, se trata como un STEMI.', r: ['#rtm-ecg'], c: C.scaEcg }] },
  hiperk: { tit: 'Potasio alto', pasos: [
    { t: 'La aguja de la célula marca el reposo (-90 mV) y cada fase. Si sube el potasio de fuera, el reposo sube y la fase 0 se hace lenta.', r: ['#rtm-celula'], c: LA.pa, org: 'las fases: El Libro Azul; el efecto del K⁺: fisiología general' },
    { t: 'Hacia 6,5 mEq/l: ondas T picudas.', r: ['#rtm-ecg'], c: KC.ecg },
    { t: 'Por encima de 7: el PR se alarga, se pierde la P y, más tarde, el QRS se ensancha.', r: ['#rtm-ecg'], c: KC.ecg },
    { t: 'Por encima de 8, el QRS se funde con la T en una onda sinuosa. Y con cualquier potasio puede haber arritmias ventriculares fatales.', r: ['#rtm-ecg'], c: KC.ecg }] },
};

// ---------- Las piezas: tocar una → su nombre, una línea y dónde se explica ----------
export const PIEZAS = {
  sa: { n: 'Nodo sinusal', t: 'El marcapasos: dispara solo, 70-80 veces por minuto. Está en la aurícula derecha, junto a la cava superior.', c: LA.cond },
  nav: { n: 'Nodo AV', t: 'El único paso entre aurículas y ventrículos: retrasa la onda 0,12 s. En la lupa, el torniquete.', c: LA.cond },
  his: { n: 'Haz de His', t: 'Atraviesa el anillo fibroso y se divide en dos ramas. Conduce a 2 m/s.', c: LA.cond },
  ramas: { n: 'Ramas del His y red de Purkinje', t: 'El His se divide en rama derecha e izquierda y estas en la red de Purkinje, que conduce a 4 m/s. La derecha baja por la banda moderadora.', c: LA.cond, o: 'la banda moderadora: fisiología general' },
  anillo: { n: 'Anillo fibroso', t: 'El esqueleto fibroso entre aurículas y ventrículos: no conduce. Solo lo cruzan el His y, si existe, una vía accesoria.', c: LA.cond, o: 'el aislante: fisiología general' },
  ap: { n: 'Vía accesoria', t: 'Un atajo de músculo a través del anillo, sin el freno del nodo: PR corto y onda delta.', c: C.wpw, o: 'su sitio: fisiología general' },
  aurs: { n: 'Músculo auricular', t: 'Cada tesela se entinta al despolarizarse y se aclara al recuperarse. Mientras está oscura, es refractaria.', c: C.regular, o: 'fisiología general' },
  vents: { n: 'Músculo ventricular', t: 'La pared del VI, más gruesa que la del VD. Se entinta al activarse y se engruesa al contraerse.', c: C.hallazgos, o: 'fisiología general' },
  lupaAv: { n: 'El nodo AV, de cerca', t: 'Dos carriles con su torniquete y su muelle: el rápido tarda más en rearmarse que el lento. El muelle es el periodo refractario.', c: C.psvt, o: 'la imagen del modelo' },
  celula: { n: 'La célula y su voltímetro', t: 'El potencial de acción ventricular: fase 0 (entra Na⁺), 1, 2 (meseta, entra Ca²⁺), 3 (sale K⁺) y 4 (reposo, -90 mV).', c: LA.pa },
  cicatriz: { n: 'Cicatriz del VI', t: 'Un islote que no conduce; a su alrededor gira el circuito de la TV.', c: C.tv, o: 'fisiología general' },
  flutter: { n: 'Circuito del flúter', t: 'Una onda que gira alrededor de la tricúspide y activa la aurícula sin parar.', c: C.regular, o: 'el sitio: fisiología general' },
  lesion: { n: 'Zona sin riego', t: 'El músculo lesionado levanta el ST en las derivaciones que la miran.', c: C.scaEcg, o: 'fisiología general' },
  valvulas: { n: 'Tricúspide y mitral', t: 'Las válvulas cuelgan del anillo fibroso; sus cuerdas tendinosas van a los músculos papilares.', c: LA.cond, o: 'fisiología general' },
};

// ---------- Notas (tres tipos) ----------
export const NOTAS = [
  { tipo: 'calla', txt: '<b>Dónde está la vía accesoria.</b> El libro dice que las taquicardias del WPW nacen de una vía accesoria «en el nodo AV» (p. 27) y no dibuja su anatomía. Aquí va como un atajo a través del anillo, junto a la mitral, como la describe la fisiología general, para que se vea lo que el libro sí dice: que frenar el nodo no la frena (p. 28).', c: C.wpw },
  { tipo: 'calla', txt: '<b>Qué carril baja y cuál sube en la reentrada nodal.</b> El libro dice que una vía conduce más despacio y tiene otro periodo refractario, y que la onda baja por una y vuelve por la otra (p. 29), sin decir cuál. Bajar por la lenta y subir por la rápida es de la fisiología general.', c: C.psvt },
  { tipo: 'calla', txt: '<b>El anillo aislante, las velocidades y el dibujo del corte.</b> Marino no describe la anatomía del sistema de conducción. El recorrido, el retraso del nodo (0,12 s) y las velocidades del His (2 m/s) y de Purkinje (4 m/s) son de otra fuente de la app, El Libro Azul (p. 7), con su propio botón. El anillo fibroso que aísla, la banda moderadora y la velocidad del músculo son fisiología general.', c: LA.cond },
  { tipo: 'calla', txt: '<b>Cómo actúa cada fármaco en la célula.</b> Marino da lo que hacen los fármacos (frenan el nodo, alargan el QT), no en qué canal. El Libro Azul da las fases del potencial de acción y qué ion entra o sale en cada una (p. 8). Qué fase alarga cada fármaco es fisiología general.', c: LA.pa },
  { tipo: 'calla', txt: '<b>El flúter y la TV, por dentro.</b> El libro da el aspecto del flúter (dientes de sierra, conducción 2:1 o 3:1; p. 18-19) y de la TV (p. 31-32), no su circuito. El circuito alrededor de la tricúspide, la frecuencia de la aurícula y el circuito alrededor de una cicatriz son fisiología general. La frecuencia de la torsade y lo que la dispara, ilustrativos.', c: C.tv },
  { tipo: 'calla', txt: '<b>El tiempo y las cifras del dibujo.</b> La adenosina actúa en <30 s y dura 1-2 min (p. 30); aquí pasa en segundos. El reloj de la parada va diez veces más deprisa. La presión, el pulso que «llega a la muñeca», la ETCO₂ de la tira y cuánto alarga el QT cada fármaco son ilustrativos; las curvas de las Figs. 19.5, 21.1, 21.3 y 21.4 son lecturas del gráfico.', c: C.adeno },
  { tipo: 'discrepan', txt: '<b>La adrenalina en la RCP.</b> El texto da un 30 % más de presión de perfusión coronaria (p. 62); la Fig. 21.3, en la misma página, se lee de ~22 a ~33 mmHg (cerca de un 50 % en el pico, luego ~31). El libro no lo aclara.', c: C.adrenalina },
  { tipo: 'discrepan', txt: '<b>Las causas reversibles.</b> El texto da cuatro, con T: neumotórax a tensión, taponamiento, tromboembolismo y trombosis coronaria (p. 60). El algoritmo de la AHA que reproduce (Fig. 21.2, p. 61) da diez: hipovolemia, hipoxia, acidosis, hipo o hiperpotasemia, hipotermia, neumotórax a tensión, taponamiento, tóxicos, trombosis pulmonar y trombosis coronaria.', c: C.f212 },
  { tipo: 'autor', txt: '<b>El déficit de pulso como punto final.</b> No hay acuerdo sobre la FC objetivo en la FA (80-110 lpm en los estudios). Usar la desaparición del déficit de pulso es una propuesta del autor: «merece tu consideración» (p. 25).', c: C.final },
  { tipo: 'calla', txt: '<b>Bradicardias, bloqueos AV y marcapasos.</b> Marino (caps. 19-21) no los trata. Su sitio está preparado en «Lentos» y llegará de la guía europea de estimulación cardíaca (ESC 2021); hasta entonces no se dibuja nada.', c: C.hallazgos },
];
export const NOTA_TIPO = { discrepan: ['Las fuentes discrepan', ''], calla: ['La fuente no lo dice', 'calla'], autor: ['Opinión del autor', 'autor'] };
export const PROFUNDIZAR = [
  { t: 'La anticoagulación en la FA: CHA₂DS₂-VASc, warfarina frente a los ACOD y sus dosis (Tablas 19.2 y 19.3).', c: cf('mc-fa-cardioversion', 'mc-tabla-19-2', 'Tabla 19.2', 26) },
  { t: 'El paso de la amiodarona IV a oral: 400 mg, carga total de 10 g y mantenimiento.', c: C.amio },
  { t: 'Los cinco tipos de taquicardia supraventricular paroxística y las otras maniobras vagales (Mueller, náusea, toalla fría).', c: C.vagal },
  { t: 'Los efectos de la adenosina en porcentajes y sus contraindicaciones (asma, bloqueo AV de 2.º o 3.er grado, enfermedad del seno).', c: C.t194 },
  { t: 'Otros patrones del ECG en el SCA: el infarto posterior y el SCA sin elevación del ST (Tabla 20.1).', c: C.t201 },
  { t: 'Las insuflaciones con bolsa (500-600 mL) y la vía intraósea durante la RCP.', c: C.insufl },
  { t: 'El síndrome posparo, el control de la temperatura (≤37,5 °C 72 h) y el pronóstico neurológico.', c: C.posparo },
];
export const LAMINAS = [
  { img: 'mc-fig19-2-ecg-avnrt.jpg', tit: 'Fig. 19.2 · reentrada nodal', txt: 'Fig. 19.2: taquicardia de QRS estrecho y regular, sin P visibles: una reentrada nodal.', c: C.f192, estados: ['nodal', 'aberrancia'] },
  { img: 'mc-fig19-3-ecg-mat-fa.jpg', tit: 'Fig. 19.3 · TAM y FA', txt: 'Fig. 19.3: arriba, una taquicardia auricular multifocal (P de varias formas); abajo, una FA (sin P, ondas de fibrilación).', c: C.f193, estados: ['fa', 'tam'] },
  { img: 'mc-fig19-4-onda-pulso-fa.jpg', tit: 'Fig. 19.4 · pulso en la FA', txt: 'Fig. 19.4: en la FA, cuando dos latidos llegan muy juntos, la sistólica cae: el origen del déficit de pulso.', c: C.f194, estados: ['fa'] },
  { img: 'mc-fig19-6-ecg-tv-vs-svt.jpg', tit: 'Fig. 19.6 · QRS ancho', txt: 'Fig. 19.6: parece una TV, pero al volver a sinusal el QRS no cambia: era una supraventricular con bloqueo de rama.', c: C.f196, estados: ['aberrancia', 'rama', 'tv'] },
  { img: 'mc-fig19-7-ecg-latido-fusion.jpg', tit: 'Fig. 19.7 · latido de fusión', txt: 'Fig. 19.7: un latido de fusión (en rojo), mezcla del QRS normal y del ventricular: prueba de actividad ventricular.', c: C.f197, estados: ['tv'] },
  { img: 'mc-fig19-9-ecg-torsade.jpg', tit: 'Fig. 19.9 · torsade', txt: 'Fig. 19.9: torsade de pointes, una TV polimórfica que «gira alrededor de los puntos».', c: C.f199, estados: ['torsade'] },
];
export const CRECE = [
  ['Iones y la célula', 'El Libro Azul y Nefrología (potasio, magnesio, calcio)', 'Mandos de K⁺, Mg²⁺ y Ca²⁺ en la célula; estados de T picudas, onda U y torsade por magnesio. El K⁺ alto ya está, como muestra.'],
  ['Fármacos que tocan el ritmo', 'Marino: sedación, delirio, intoxicaciones', 'Haloperidol y QT, betabloqueante y bradicardia, succinilcolina y potasio. El fármaco se verá en su receptor y su efecto, aquí.'],
  ['Bradicardias, frío y marcapasos', 'Guía ESC 2021 de estimulación (pendiente), Manual UMI, Marino (hipotermia)', 'Bloqueos AV desde el mismo torniquete; el generador de marcapasos (ya dibujado, cerrado) con su código; la onda de Osborn.'],
  ['FA crónica e insuficiencia cardíaca', 'Guía ESC de IC, Manual UMI', 'Frecuencia o ritmo en la IC, la ivabradina y la digoxina, cada una con su fuente.'],
  ['El ciclo entero', 'Eco cardíaca y el motor del latido', 'Un solo ECG en toda la app: el del Wiggers y el del ecógrafo saldrán de este mismo grafo.'],
];

// ---------- Mayéutica (muestra): primero predices, luego compruebas ----------
export const RECORRIDO = [
  { grupo: 'guia', num: 'G1', predice: true, estado: 'nodal',
    enunciado: 'La onda da vueltas dentro del nodo AV. Vas a poner 6 mg de adenosina. Antes de mirar: <b>¿qué verás en la tira mientras actúa?</b>',
    opciones: [
      { t: 'QRS anchos: la adenosina desvía la onda por las ramas.', porque: 'La adenosina enlentece el nodo AV y da un bloqueo AV transitorio (p. 29-30); no cambia el camino por las ramas. Si esperas QRS anchos, tomarás la pausa esperada (bradicardia o bloqueo AV en la mitad de los casos, Tabla 19.4) por un problema nuevo.' },
      { t: 'Ondas P sin su QRS durante unos segundos, y luego el sinusal.', ok: true },
      { t: 'La misma taquicardia, más lenta, durante horas.', porque: 'Su efecto dura 1-2 min y lo que hace es cortar el circuito (p. 30). Si esperas horas de efecto, no repetirás 12 mg a los 2 min cuando no responde (Tabla 19.4).' },
      { t: 'Nada: la adenosina actúa en las aurículas, no en el nodo.', porque: 'Actúa en el nodo AV, justo por donde pasa este circuito (p. 29-30). Si crees que no sirve, cardiovertirás a un paciente que casi nunca está inestable con esta arritmia (p. 29).' }],
    explicacion: 'La adenosina da un bloqueo AV transitorio: salen P sin QRS unos segundos. El circuito pasaba por el nodo AV: se rompe y vuelve el sinusal (p. 29-30).', fuente: C.adeno,
    tocar: { txt: 'Compruébalo: pon la adenosina', confirma: 'Mira el torniquete con su cerrojo y la tira: P sin QRS, y luego vuelve el sinusal.' } },
  { grupo: 'guia', num: 'G2', predice: true, estado: 'wpw',
    enunciado: 'Este corazón tiene un atajo a través del anillo, sin torniquete. Antes de ver la tira: <b>¿cómo serán el PR y el comienzo del QRS?</b>',
    opciones: [
      { t: 'PR largo, porque la onda da un rodeo por el atajo.', porque: 'El atajo no tiene el freno del nodo: la onda llega antes, no después (PR corto, p. 27). Si buscas un PR largo, no reconocerás el WPW y, ante una FA, podrías frenar el nodo, lo que puede precipitar una FV (p. 28).' },
      { t: 'PR normal y QRS estrecho: en sinusal el atajo no se nota.', porque: 'En sinusal sí se nota: PR corto y onda delta (p. 27). Si no lo buscas, el WPW pasa por un ECG normal y, en una FA, le darías un bloqueante del nodo (p. 28).' },
      { t: 'PR corto y un QRS que arranca despacio: la onda delta.', ok: true },
      { t: 'Sin P: las aurículas se saltan y el atajo manda.', porque: 'Las aurículas se activan igual, con su P; lo que cambia es el paso al ventrículo (p. 27). Si no ves la P, buscarás una FA o una reentrada que no tiene.' }],
    explicacion: 'Por el atajo, parte del ventrículo se activa antes y despacio, de músculo a músculo: PR corto y onda delta antes del QRS (p. 27). Que la delta nazca de esa activación lenta es fisiología general.', fuente: C.wpw },
  { grupo: 'examen', num: 'E1', estado: 'wpw', wpwFa: true,
    enunciado: 'Un paciente con WPW conocido llega en FA a 190 lpm, con QRS anchos e irregulares y PA de 110/70. <b>¿Qué haces?</b>',
    opciones: [
      { t: 'Diltiazem 0,25 mg/kg en 2 min: es el que antes controla la FC.', porque: 'Frenar el nodo no frena la vía accesoria: la FC no baja, y el bloqueo selectivo del nodo puede precipitar una FV (p. 28). El mejor fármaco de la FA sin vía (Fig. 19.5) aquí puede matarle.' },
      { t: 'Amiodarona o procainamida, o cardioversión eléctrica.', ok: true },
      { t: 'Digoxina IV, porque no baja la PA como el diltiazem.', porque: 'La digoxina también bloquea el nodo (p. 28): la vía accesoria sigue libre y comparte el riesgo de FV. Además tarda horas (Fig. 19.5).' },
      { t: 'Esmolol en bolo y perfusión, que se ajusta minuto a minuto.', porque: 'El esmolol es un betabloqueante: bloquea el nodo y la vía accesoria sigue libre (p. 28). Que se ajuste rápido no evita la FV que puede precipitar.' }],
    explicacion: 'Con una vía accesoria, los fármacos que bloquean el nodo AV (antagonistas del calcio, betabloqueantes, digoxina) no frenan la frecuencia y pueden precipitar una FV. Se trata con cardioversión eléctrica, o con amiodarona o procainamida (p. 28).', fuente: C.wpw },
  { grupo: 'examen', num: 'E2', estado: 'fv',
    enunciado: 'Leandro sigue en FV tras el 2.º choque. <b>¿Qué toca ahora?</b>',
    opciones: [
      { t: 'Amiodarona 300 mg IV o IO ya, y 150 mg si hace falta.', porque: 'La amiodarona va si hace falta un 3.er choque (p. 59). Darla ahora, en lugar de la adrenalina, retrasa el fármaco que toca tras el 2.º choque.' },
      { t: 'Parar las compresiones para buscar el pulso.', porque: 'Tras el choque se sigue con 2 min de compresiones antes de mirar el ritmo (p. 59). Buscar el pulso, que además se palpa mal (p. 62), le quita minutos de flujo: las interrupciones llegan al 50 % del tiempo de RCP (p. 57).' },
      { t: 'Adrenalina 1 mg cada 3-5 min, y compresiones.', ok: true },
      { t: 'Lidocaína 1-1,5 mg/kg IV, que funciona mejor que la amiodarona.', porque: 'La lidocaína es la alternativa si no hay amiodarona, y también va tras el 3.er choque (p. 59). El libro no dice que funcione mejor; ahora toca la adrenalina.' }],
    explicacion: 'Si hace falta un 2.º choque, empieza la adrenalina: 1 mg IV o IO cada 3-5 min. Tras cada choque, 2 min de compresiones antes de mirar el ritmo. Si hace falta un 3.º, amiodarona 300 mg (p. 59).', fuente: C.algoritmo },
  { grupo: 'guia', num: 'G3', predice: true, estado: 'flutter',
    enunciado: 'Un circuito gira en la aurícula y el nodo AV deja pasar uno de cada dos impulsos (2:1). Antes de mirar: <b>¿qué verás en la tira?</b>',
    opciones: [
      { t: 'P iguales, cada una con su QRS: una taquicardia sinusal.', porque: 'P uniformes con PR igual son la taquicardia sinusal (p. 18-19); aquí la línea de base no tiene P. Si las esperas, buscarás fiebre o dolor en vez de un circuito.' },
      { t: 'Ninguna actividad auricular y un QRS estrecho y regular: la reentrada del nodo.', porque: 'La ausencia de P sugiere la reentrada nodal (p. 18-19), pero el flúter sí deja actividad auricular visible. Si no la buscas, pensarás en el nodo y no en la aurícula.' },
      { t: 'Una línea de base sin orden y QRS irregulares: una FA.', porque: 'En la FA los R-R son irregulares (p. 20); el flúter con bloqueo fijo (2:1, 3:1) da un ritmo regular (p. 18-19). Si los confundes, mirarás el control de la frecuencia de una FA donde hay un ritmo regular.' },
      { t: 'Dientes de sierra, y un QRS estrecho y regular por cada dos dientes.', ok: true }],
    explicacion: 'Los dientes de sierra son la señal del flúter; con un bloqueo AV fijo (2:1, 3:1) el ritmo es regular y el QRS, estrecho (p. 18-19). La frecuencia de la aurícula no la da el libro: fisiología general.', fuente: C.regular },
  { grupo: 'examen', num: 'E3', estado: 'tam',
    enunciado: 'Un hombre de 71 años con EPOC reagudizada tiene 128 lpm, P de varias formas, PR variable y un ritmo irregular. El magnesio sérico es normal. <b>¿Qué haces primero?</b>',
    opciones: [
      { t: 'Magnesio IV empírico: 2 g en 15 min y 6 g en 6 h.', ok: true },
      { t: 'Verapamilo, porque hay EPOC y el metoprolol no está indicado en ese caso.', porque: 'El verapamilo corrige menos de la mitad y es inotrópico negativo (p. 28); no es lo primero. Si empiezas por él, dejas sin dar la medida de mayor éxito (88 % con magnesio) y arriesgas la IC con FE reducida.' },
      { t: 'Metoprolol IV: 80 % de éxito en la TAM.', porque: 'El metoprolol va si fallan las medidas previas y solo si la EPOC no es la causa (p. 28); aquí lo es. Si lo das primero, un betabloqueante cae sobre un pulmón enfermo.' },
      { t: 'Ningún magnesio: con el sérico normal no hay déficit que corregir.', porque: 'El magnesio sérico puede ser normal con el total del cuerpo agotado, y la respuesta fue independiente del valor sérico (p. 28). Si lo descartas, dejas sin tratar a un paciente con una arritmia que ya es tozuda.' }],
    explicacion: 'En la TAM, lo primero es corregir, si hace falta, el magnesio y el potasio; el magnesio IV empírico (2 g en 15 min y 6 g en 6 h) pasó a sinusal al 88 %, con independencia del magnesio sérico. Después, metoprolol si la EPOC no es la causa, o verapamilo (p. 28).', fuente: C.tam },
  { grupo: 'examen', num: 'E4', estado: 'torsade',
    enunciado: 'Una paciente de UCI con haloperidol tiene un QTc de 0,52 s en la hoja de la mañana, sin arritmias. <b>¿Cómo lo interpretas?</b>',
    opciones: [
      { t: 'Normal: el límite sube a 0,5 s en las mujeres, que tienen el QT algo más largo.', porque: 'Normal es ≤0,44 s y >0,5 s es riesgo de torsade (p. 35); el libro no da otro límite por sexo. Si lo aceptas, no tocarás el fármaco ni los electrolitos.' },
      { t: 'La torsade es inevitable: retiras todo y dejas el desfibrilador cargado.', porque: 'El libro insiste en que el QT largo es común en la UCI y la torsade, poco frecuente (p. 35). Desfibrilar es para la torsade sostenida (p. 35), no para un QT largo sin arritmia.' },
      { t: 'Riesgo de torsade (>0,5 s), no sentencia: mira K⁺, Mg²⁺ y el fármaco.', ok: true },
      { t: 'Magnesio 1-2 g en 15 min a todo el que pase de 0,5 s.', porque: 'El magnesio se cita para terminar la torsade (p. 35); lo que previene las recaídas es corregir la hipopotasemia y la hipomagnesemia y retirar el fármaco (p. 35). Darlo a ciegas no corrige la causa.' }],
    explicacion: 'Un QTc normal es ≤0,44 s y >0,5 s es un riesgo de torsade; pero un QT largo es común en la UCI y la torsade es rara. Se corrigen el potasio y el magnesio y se retira el fármaco de riesgo (p. 35).', fuente: C.qtc },
  { grupo: 'examen', num: 'E5', estado: 'stemi',
    enunciado: 'Una mujer de 63 años con dolor opresivo tiene un ST elevado 1,7 mm en el punto J en V2 y en V3; el resto de las derivaciones, sin cambios. <b>¿Cumple el criterio de STEMI?</b>',
    opciones: [
      { t: 'No: en V2-V3 hacen falta ≥2 mm.', porque: 'Los 2 mm son el umbral del varón; en la mujer es ≥1,5 mm en V2-V3 (Tabla 20.1, p. 41). Si aplicas el del varón, retrasas la reperfusión de una mujer que sí lo cumple.' },
      { t: 'Solo con la troponina elevada: sin ella el ECG no basta.', porque: 'El criterio de la tabla es del ECG (p. 41); la troponina detecta la lesión de la célula y se mide a la llegada y a la hora (p. 41). Si esperas la troponina para decidirlo, atrasas la decisión de reperfundir.' },
      { t: 'Sí, pero solo si el ST de II también sube ≥1 mm, como en las demás derivaciones.', porque: 'El criterio pide ≥2 derivaciones contiguas (p. 41), y V2 y V3 lo son; no hace falta que cambie II. Si lo exiges, pasas por alto un STEMI anterior.' },
      { t: 'Sí: ≥1,5 mm en V2-V3 en una mujer, en dos derivaciones contiguas.', ok: true }],
    explicacion: 'Tabla 20.1: STEMI es ST elevado en el punto J en ≥2 derivaciones contiguas, ≥1,5 mm (mujeres) o ≥2 mm (varones) en V2-V3, o ≥1 mm en las demás (p. 41).', fuente: C.t201 },
  { grupo: 'examen', num: 'E6', estado: 'fv',
    enunciado: 'A los 20 min de RCP, la ETCO₂ de Leandro es de 7 mmHg y no ha subido desde el principio. <b>¿Qué te dice?</b>',
    opciones: [
      { t: 'La reanimación con éxito es improbable: no pasa de 10-15 mmHg a los 20 min.', ok: true },
      { t: 'Que las compresiones son demasiado profundas.', porque: 'Una compresión más profunda se acompaña de más ETCO₂, no de menos (p. 63). Si la lees al revés, comprimirás menos justo cuando necesitas flujo.' },
      { t: 'Que está normal: en la parada la ETCO₂ es como el PCO₂ arterial, de unos 40 mmHg.', porque: 'El valor de ≈40 es el de la circulación normal (p. 62-63); en la RCP la ETCO₂ cae con el flujo bajo y la Fig. 21.4 muestra cifras bajas y en descenso en quien no recupera el pulso. Si lo das por normal, no lo usarás como señal.' },
      { t: 'Que hay que parar ya, porque nadie se recupera con una cifra así.', porque: 'El libro habla de probabilidad: por encima de ese umbral se ha seguido hasta 1½ h con buen resultado (p. 63). Una cifra baja pesa mucho, pero es una decisión de equipo, no una regla automática.' }],
    explicacion: 'La ETCO₂ en serie durante la RCP orienta hacia el retorno de la circulación: sube en quienes la recuperan y cae en los demás; con menos de 10-15 mmHg a los 20 min es improbable un buen desenlace (p. 63, Fig. 21.4).', fuente: C.etco2 },
  { grupo: 'examen', num: 'E7', tipo: 'destapa', estado: 'sinusal',
    enunciado: 'Ante una taquicardia en el monitor, el libro dice que el diagnóstico se apoya en 3 hallazgos del ECG. <b>¿Cuáles?</b>',
    puntos: [
      { t: 'La <span class="hl-azul">duración del QRS</span>: estrecho (≤0,12 s) nace por encima del sistema de conducción; ancho (>0,12 s): una TV o una supraventricular con conducción aberrante (p. 20-21).', c: C.hallazgos },
      { t: 'La <span class="hl-azul">uniformidad de los intervalos R-R</span>: regular o irregular.', c: C.regular },
      { t: 'Las <span class="hl-azul">características de la actividad auricular</span>: P iguales, ausencia de P o dientes de sierra.', c: C.regular }],
    explicacion: 'Son la duración del QRS, la uniformidad del R-R y la actividad auricular (Fig. 19.1, p. 18-19).', fuente: C.hallazgos },
];
// El caso de Teodoro (C2 de la cobertura del bloque): evoluciona del día 2 al día 3, con el giro de la estenosis mitral.
// Las cifras del paciente son del caso; las conductas, dosis y umbrales, de la ficha (Marino, cap. 19).
export const CASO = { titulo: 'La lobectomía (Teodoro)', pasos: [
  { num: 'Paso 1', estado: 'fa', fcFA: 148, dia: 'Día 2 de la lobectomía · tarde',
    paciente: [['Paciente', 'Teodoro, 74 años, 78 kg'], ['Antecedentes', 'HTA, diabetes'], ['Motivo', 'lobectomía pulmonar hace 2 días'], ['Monitor', '148 lpm', 1], ['Síntomas', 'palpitaciones', 1]],
    enunciado: 'Mira la tira de Teodoro. <b>¿Qué ritmo es?</b>',
    opciones: [
      { t: 'Taquicardia sinusal: hay que buscar su causa y tratarla.', porque: 'Habría una P antes de cada QRS y el RR sería regular (p. 19). Si la tomas por sinusal, Teodoro sigue a 148 sin control de la frecuencia.' },
      { t: 'Taquicardia auricular multifocal, típica del pulmón enfermo.', porque: 'La TAM tiene P de varias formas y PR variable (p. 20); aquí no hay P. Con magnesio para una TAM, la FA seguiría a 148.' },
      { t: 'Reentrada nodal: QRS estrecho sin P visibles.', porque: 'La reentrada nodal es regular (p. 19, 29) y este RR es irregular. Si la tratas como reentrada, los fármacos y las dosis no serían los de la FA (Tabla 19.1) y su frecuencia seguiría en 148.' },
      { t: 'Fibrilación auricular: RR irregular y ninguna P.', ok: true }],
    explicacion: 'QRS estrecho e irregular, sin P y con ondas de fibrilación: FA (p. 20). Tras la cirugía torácica aparece hasta en el 45 % de los casos, casi siempre en los primeros 5 días (p. 21).', fuente: C.irregular,
  },
  { num: 'Paso 2', estado: 'fa', fcFA: 148, dia: 'Día 2 · tarde, 5 min después',
    paciente: [['PA', '108/66 mmHg', 1], ['Peso', '78 kg', 1]],
    enunciado: 'Teodoro tolera la PA. Quieres frenar la frecuencia. <b>¿Qué le das y cuánto, para sus 78 kg?</b>',
    opciones: [
      { t: 'Diltiazem 78 mg IV: 1 mg/kg en 2 min y luego 5-15 mg/h.', porque: 'La dosis es 0,25 mg/kg (Tabla 19.1): con 1 mg/kg le darías cuatro veces más. El diltiazem ya da hipotensión en el 20-30 % a la dosis buena (p. 23); a esta, Teodoro se hundiría.' },
      { t: 'Diltiazem ≈ 20 mg IV en 2 min (0,25 mg/kg) y 5-15 mg/h.', ok: true },
      { t: 'Digoxina 0,25 mg IV cada 2 h hasta 1,5 mg: no baja la PA.', porque: 'La digoxina tarda: casi nada en la primera hora y a las 6 h aún no baja de 100 lpm (Fig. 19.5); sola no sirve para frenar deprisa (p. 25). Teodoro seguiría horas a 148.' },
      { t: 'Cardioversión sincronizada a 100 J: es lo más rápido.', porque: 'La cardioversión se reserva para el paciente inestable (p. 25), y Teodoro tolera 108/66. Además exige antes una eco para buscar trombos en la aurícula (p. 25).' }],
    explicacion: 'El diltiazem es el más usado para frenar deprisa la FA: 0,25 mg/kg IV en 2 min (0,25 × 78 ≈ 20 mg) y después 5-15 mg/h (Tabla 19.1).', fuente: C.t191, fuente2: C.dilt },
  { num: 'Paso 3', estado: 'fa', fcFA: 118, dia: 'Día 2 · 40 min después · el giro',
    paciente: [['PA', '84/50 mmHg', 1], ['Monitor', 'FA a 118 lpm', 1], ['Diltiazem', 'en perfusión', 1]],
    enunciado: 'La frecuencia baja, pero la PA cae a 84/50. <b>¿Qué haces ahora?</b>',
    opciones: [
      { t: 'Otro bolo de diltiazem: la FC aún no baja de 100.', porque: 'La hipotensión es la complicación que limita el diltiazem: aparece en el 20-30 % (p. 23). Otro bolo bajaría aún más la PA de Teodoro.' },
      { t: 'Esmolol, que se ajusta minuto a minuto.', porque: 'Los betabloqueantes se parecen al diltiazem en el riesgo de hipotensión y en el efecto inotrópico negativo (Tabla 19.1). Cambiarías un hipotensor por otro.' },
      { t: 'Paro el diltiazem y paso a amiodarona 150 mg en 10 min.', ok: true },
      { t: 'Digoxina sola, que no baja la PA.', porque: 'Sola no sirve para el control rápido: a las 6 h aún no baja de 100 lpm (Fig. 19.5, p. 25). Se usa como añadido al diltiazem o al betabloqueante con IC o PA lábil (p. 25).' }],
    explicacion: 'La amiodarona es la alternativa en quien no tolera el diltiazem o los betabloqueantes: deprime menos el corazón y da mucha menos hipotensión que el diltiazem. 150 mg IV en 10 min, repetibles, y después la perfusión (Tabla 19.1; p. 24-25).', fuente: C.amio, fuente2: C.t191 },
  { num: 'Paso 4', tipo: 'destapa', estado: 'fa', fcFA: 104, dia: 'Día 2 · noche',
    paciente: [['Amiodarona', 'en perfusión', 1], ['Monitor', 'FA a 104 lpm', 1]],
    enunciado: 'El adjunto te pregunta: <b>«¿Hasta dónde vas a bajar la frecuencia de Teodoro, y por qué?»</b>',
    puntos: [
      { t: 'No hay acuerdo en la cifra: los estudios han usado de <span class="hl-azul">80 a 110 lpm</span> como punto final.', c: C.final },
      { t: 'Un punto final más fisiológico: que <span class="hl-verde">desaparezca el déficit de pulso</span> (o que la sistólica deje de variar latido a latido), porque dos latidos muy juntos no llenan el ventrículo (Fig. 19.4).', c: C.f194 }],
    explicacion: 'El libro propone mirar el pulso, no solo la cifra del monitor (p. 22, 25).', fuente: C.final },
  { num: 'Paso 5', estado: 'fa', fcFA: 104, llenadoMalo: true, dia: 'Día 3 · la eco',
    paciente: [['Ritmo', 'sigue en FA', 1], ['Eco', 'estenosis mitral significativa', 1]],
    enunciado: 'Sigue en FA. Antes de pensar en el CHA₂DS₂-VASc (74 años, HTA, diabetes: 3 puntos), la eco enseña una estenosis mitral significativa. <b>¿Qué cambia?</b>',
    opciones: [
      { t: 'Es una FA valvular: siempre se anticoagula, y con warfarina.', ok: true },
      { t: 'Nada: con 3 puntos, anticoagulo con un ACOD, que sangra menos.', porque: 'La escala no vale para la FA valvular (p. 26) y la preferencia por los ACOD no llega a la FA con estenosis mitral significativa: ahí la warfarina es superior (p. 27). Teodoro quedaría peor protegido del ictus.' },
      { t: 'Solo antiagregar, porque con la estenosis la escala no vale.', porque: 'Que la escala no valga no quita la anticoagulación: la FA valvular la necesita siempre (p. 26). Antiagregado, Teodoro se quedaría sin la protección que pide la fuente.' },
      { t: 'Esperar a ver si sale de la FA antes de anticoagular.', porque: 'La FA valvular siempre requiere anticoagulación (p. 26). Esperar deja a Teodoro expuesto al trombo de la aurícula izquierda.' }],
    explicacion: 'La FA con estenosis mitral o con una prótesis es valvular: la escala de la Tabla 19.2 no se aplica y siempre se anticoagula; la warfarina (INR 2-3) es superior a los ACOD (p. 26-27). Y explica por qué se hundió: con el llenado ya limitado por la estenosis, una FC rápida baja el volumen latido (p. 21-22).', fuente: C.valv, fuente2: C.faCons },
  { num: 'Paso 6', tipo: 'error', estado: 'fa', fcFA: 96, llenadoMalo: true, dia: 'Día 3 · el plan del residente',
    paciente: [['Por la noche', 'se cayó al ir al baño, sin lesiones', 1]],
    enunciado: 'El R1 escribe el plan del alta a planta. <b>Puede haber 0, 1 o 2 errores.</b> Toca las frases que creas falsas.',
    frases: [
      { t: 'Se ha caído esta noche: no lo anticoagulo.', mal: true, buena: 'Una historia de caídas no contraindica la anticoagulación en la FA (p. 26).', cita: C.cha },
      { t: 'Warfarina, ajustada a un INR de 2-3.', cita: C.warf },
      { t: 'Ojo: la amiodarona frena el metabolismo de la warfarina.', cita: C.amio },
      { t: 'Mejor un ACOD, que no necesita controles.', mal: true, buena: 'En la FA valvular (estenosis mitral significativa) la warfarina es superior a los ACOD (p. 27).', cita: C.warf }],
    explicacion: 'Dos errores: las caídas no contraindican la anticoagulación, y con una estenosis mitral significativa la warfarina va antes que los ACOD.', fuente: C.warf },
], llevas: [
  'Diltiazem 0,25 mg/kg en 2 min y 5-15 mg/h; si cae la PA (20-30 %), amiodarona 150 mg en 10 min (p. 22-25).',
  'El punto final más fisiológico: que desaparezca el déficit de pulso (p. 22, 25).',
  'FA con estenosis mitral = valvular: siempre anticoagular, y con warfarina, no con un ACOD (p. 26-27).',
], vuelta: C.final };

