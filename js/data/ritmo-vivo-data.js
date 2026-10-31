// Datos del corazón eléctrico (Marino cap. 19-21, El Libro Azul y Nefrología al día): fuentes con su cita, estados con su
// configuración del grafo, frases, explicaciones guiadas, notas, láminas y lo que vendrá. Datos puros: el motor y el dibujo
// están en js/modules/libros/ritmo-vivo/. Otro libro añade aquí un estado o una nota sin tocar el motor ni el dibujo.
import { MOTOR } from '../modules/libros/ritmo-vivo/motor.js';
import { clamp } from '../core/ui.js';
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
  'ecg-f8': { esp: 'pifCardio', view: 'ecgArritmias', panel: 'panel-pif-ecg-tabs', titulo: 'Arritmias (ECG)', corto: 'Arritmias (ECG)', libro: 'López Ramírez 2012', pdf: 'L2' },
  'ecg-f10': { esp: 'pifCardio', view: 'ecgArritmias', panel: 'panel-pif-ecg-tabs', titulo: 'Marcapasos (ECG)', corto: 'Marcapasos (ECG)', libro: 'López Ramírez 2012', pdf: 'L3' },
  'fisio-hiperpotasemia': { esp: 'nefrologia', view: 'nefrona', panel: 'panel-fisio-tabs', titulo: 'Hiperpotasemia', corto: 'Hiperpotasemia', libro: 'Nefrología al día (De Sequera, 2024)', pdf: 'K' },
};
export const PDF = { C: 'docs/marino-2024-cardiac-disorders-caps18-21.pdf', LA: 'docs/libro-azul-seccion-i-cardiovascular-parte1.pdf', K: 'docs/de-sequera-2024-trastornos-potasio.pdf',
  E: 'docs/esc-2021-estimulacion-cardiaca.pdf', L2: 'docs/lopez-ramirez-2012-alegria-leer-ecg-parte2.pdf', L3: 'docs/lopez-ramirez-2012-alegria-leer-ecg-parte3.pdf' };
// Libro que se nombra al citar: el de la ficha, salvo que la cita traiga su propio PDF (pdf: 'E' → la guía ESC 2021)
export const LIBRO_PDF = { E: 'ESC 2021' };
export const libroDe = c => LIBRO_PDF[c.pdf] || FICHAS[c.f].libro;
const cf = (f, id, sitio, p, pdf) => ({ f, id, sitio, p, pdf });   // p = página del PDF · pdf = clave de PDF si no es el de su ficha
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
  valv: cf('mc-fa-cardioversion', 'mc-tabla-19-2-indicacion', 'FA valvular', '26-27'),
  warf: cf('mc-fa-cardioversion', 'mc-doac', 'Warfarina frente a ACOD', 27),
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
// ESC 2021 de estimulación (PDF = impresa + 1) y la ficha de ECG (López Ramírez 2012, parte 2: PDF = impresa − 59)
const E = {
  dns: cf('ecg-f8', 'ecg8-nota-pausa', 'Bradicardia sinusal 40-50 lpm (ESC)', 24, 'E'),
  bav1: cf('ecg-f8', 'ecg8-tabla-bav', 'BAV 1.º: PR ≥ 300 ms (ESC)', 27, 'E'),
  mobitz: cf('ecg-f8', 'ecg8-nota-mobitz', 'Mobitz I, II y 2:1 (ESC)', 27, 'E'),
  mp: cf('ecg-f8', 'ecg8-nota-mobitz', 'Cuándo marcapasos en el BAV (ESC)', 28, 'E'),
};
const L = {
  sinusal: cf('ecg-f8', 'ecg8-disf-sinusal', 'Disfunción sinusal', 55),
  escape: cf('ecg-f8', 'ecg8-tabla-escapes', 'Escapes', '55-56'),
  causas: cf('ecg-f8', 'ecg8-causas', 'Causas de disfunción sinusal', 57),
  bav: cf('ecg-f8', 'ecg8-tabla-bav', 'Bloqueos AV', '57-58'),
  bav2: cf('ecg-f8', 'ecg8-fig-bav2', 'Mobitz I y bloqueo de 2.º grado', 58),
  nota: cf('ecg-f8', 'ecg8-nota-mobitz', 'Mobitz II y 2:1', 58),
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
  casilda: '<b>Casilda</b>, 71 años, 62 kg · HTA tratada · ingresada por un cuadro gripal',
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
  bradi: { fam: 'lentos', nombre: 'Bradicardia sinusal', corto: 'Bradicardia sinusal', fuentes: [E.dns, L.sinusal, L.causas], paciente: 'casilda',
    frase: ['El nodo sinusal dispara despacio, pero sigue mandando: una P antes de cada QRS y el PR normal. Solo falta ritmo. Si no hay síntomas ni causa que corregir, no se trata.', 'ficha · p. 114; ESC 2021 · p. 24'],
    aplicar(mo, t, s) { mo.m.fcSA = s.fcSA || 45; mo.reiniciarSA(t + 0.05); } },
  bav1: { fam: 'lentos', nombre: 'Bloqueo AV de 1.er grado', corto: 'BAV 1.er grado', fuentes: [L.bav, E.bav1], paciente: 'casilda',
    frase: ['Toda P conduce, pero el torniquete del nodo AV deja pasar la onda más despacio: PR largo y fijo. El ritmo y la FC no cambian.', 'ficha · p. 116-117; ESC 2021 · p. 27'],
    aplicar(mo, t) { RITMO_BASE(mo); mo.m.navRet = 2; mo.m.navF = 1.5; mo.reiniciarSA(t + 0.05); } },
  bav2: { fam: 'lentos', nombre: 'Bloqueo AV de 2.º grado', corto: 'BAV 2.º grado', fuentes: [L.bav, L.bav2, L.nota, E.mobitz, E.mp], paciente: 'casilda',
    frase: ['Hay P que no conducen. En el Mobitz I el PR se alarga latido a latido hasta que una P se queda sin QRS (torniquete del nodo). En el Mobitz II el PR no cambia y de pronto falta un QRS (bloqueo más abajo, en el His).', 'ficha · p. 117; ESC 2021 · p. 27'],
    aplicar(mo, t, s) {
      if (s.mobitz === 'I') { mo.m.fcSA = 85; mo.m.navRet = 1.6; mo.m.navF = 3.0; } else { mo.m.fcSA = 75; mo.m.hisCada = s.mobitz === '2:1' ? 2 : 3; }
      mo.reiniciarSA(t + 0.05); } },
  bav3: { fam: 'lentos', nombre: 'Bloqueo AV de 3.er grado', corto: 'BAV 3.er grado', pendiente: true, fuentes: [] },
  marcapasos: { fam: 'lentos', nombre: 'Marcapasos', corto: 'Marcapasos', pendiente: true, fuentes: [] },
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
    { t: 'El nodo sinusal, junto a la entrada de la cava superior, dispara solo: es el reloj (70-80 veces por minuto).', r: ['#rtv-sa'], c: LA.cond, org: 'El Libro Azul' },
    { t: 'La onda recorre las dos aurículas: la tinta avanza por el músculo y, en la tira, dibuja la onda P.', r: ['#rtv-aurs', '#rtv-ecg'], c: C.regular, org: 'el recorrido: fisiología general' },
    { t: 'Entre aurículas y ventrículos hay un anillo fibroso que no conduce. El único paso es el nodo AV, que retrasa la onda 0,12 s: así las aurículas llenan antes los ventrículos.', r: ['#rtv-anillo', '#rtv-nav', '#rtv-lupa-av'], c: LA.cond, org: 'el retraso: El Libro Azul; el anillo: fisiología general' },
    { t: 'Por el His (2 m/s), sus ramas y la red de Purkinje (4 m/s), todo el ventrículo se activa casi a la vez: QRS estrecho, de 0,12 s o menos.', r: ['#rtv-his', '#rtv-ramas', '#rtv-ecg'], c: C.hallazgos, org: 'velocidades: El Libro Azul' },
    { t: 'Cada trozo de músculo vive un potencial de acción de ~300 ms, de -90 a +45 mV. Mientras dura (fases 0, 1, 2 y parte de la 3) no se puede volver a activar: es su periodo refractario.', r: ['#rtv-celula'], c: LA.pa, org: 'El Libro Azul' }] },
  taquiSinusal: { tit: 'Taquicardia sinusal', pasos: [
    { t: 'El mismo camino, pero el reloj dispara más deprisa: más de 100 por minuto.', r: ['#rtv-sa', '#rtv-ecg'], c: C.hallazgos },
    { t: 'P iguales y PR igual antes de cada QRS: es sinusal.', r: ['#rtv-ecg'], c: C.regular },
    { t: 'Empieza y acaba poco a poco; la reentrada nodal, de golpe. Y la taquicardia puede no ser el problema: busca su causa.', r: ['#rtv-sa'], c: C.psvt }] },
  rama: { tit: 'Bloqueo de rama', pasos: [
    { t: 'Una rama del His no conduce (aquí, la que está tachada): su lado del ventrículo se activa tarde, de músculo a músculo.', r: ['#rtv-ramas', '#rtv-vents'], c: C.ancho, org: 'qué rama y su dibujo: fisiología general' },
    { t: 'El QRS se ensancha (más de 0,12 s) aunque el ritmo nazca arriba: un QRS ancho no siempre es ventricular.', r: ['#rtv-ecg'], c: C.ancho },
    { t: 'La onda T va al revés que el QRS: la repolarización sigue el mismo camino anómalo.', r: ['#rtv-ecg'], c: C.ancho, org: 'fisiología general' },
    { t: 'Si llega una taquicardia supraventricular, será de QRS ancho: es la aberrancia (la tienes en «Ancho»).', r: ['#rtv-ecg'], c: C.f196 }] },
  nodal: { tit: 'Reentrada en el nodo AV', pasos: [
    { t: 'El nodo AV tiene dos carriles con distinto periodo refractario: uno rápido que tarda en rearmarse y uno lento que se rearma antes.', r: ['#rtv-lupa-av', '#rtv-torn-r', '#rtv-torn-l'], c: C.psvt, org: 'dos vías en el nodo AV: <a href="https://pubmed.ncbi.nlm.nih.gov/31504425/" target="_blank" rel="noopener">ESC 2019, Brugada</a> y <a href="https://pubmed.ncbi.nlm.nih.gov/29912236/" target="_blank" rel="noopener">Costantini 2018</a>; cuál es cuál: fisiología general' },
    { t: 'Un latido auricular prematuro encuentra el rápido sin rearmar: baja por el lento y vuelve a subir por el rápido. La vuelta se sostiene sola.', r: ['#rtv-torn-r', '#rtv-torn-l'], c: C.psvt },
    { t: 'Cada vuelta manda un latido: QRS estrecho y regular, 140-250 lpm, a menudo sin P visibles (aquí la P cae junto al QRS).', r: ['#rtv-ecg', '[data-fila="fc"]'], c: C.f192, org: 'dónde cae la P: fisiología general' },
    { t: 'Empieza de golpe. Primero, maniobras vagales; si no la cortan, adenosina, que cierra el nodo unos segundos: el circuito pasa por él y se rompe.', r: ['#rtv-nav'], c: C.vagal }] },
  adenosina: { tit: 'La adenosina', pasos: [
    { t: '6 mg en bolo rápido por una vena periférica, en la conexión del catéter, y lavado con suero. Actúa en menos de 30 s.', r: ['#rtv-bomba'], c: C.t194 },
    { t: 'Echa el cerrojo al nodo AV: un bloqueo AV transitorio. En la tira salen P sin QRS.', r: ['#rtv-cerrojo', '#rtv-ecg'], c: C.adeno },
    { t: 'El circuito pasaba por el nodo: se rompe. El efecto dura 1-2 min y el bloqueo se va solo en unos 60 s (no responde a la atropina).', r: ['#rtv-lupa-av'], c: C.adeno, org: '1-2 min: ficha; los 60 s del bloqueo y el tiempo comprimido: ilustrativo' },
    { t: 'Vuelve el sinusal. 6 mg y luego 12 mg cortan más del 90 %. Por una vía central, la mitad de la dosis.', r: ['#rtv-sa'], c: C.t194 }] },
  flutter: { tit: 'Flúter auricular', pasos: [
    { t: 'Un solo circuito grande gira en la aurícula derecha, alrededor de la tricúspide.', r: ['#rtv-circuito-fl'], c: C.regular, org: 'el sitio del circuito: fisiología general' },
    { t: 'La aurícula se activa sin parar: la línea de base dibuja dientes de sierra.', r: ['#rtv-ecg', '#rtv-aurs'], c: C.regular },
    { t: 'El torniquete no da abasto y deja pasar uno de cada dos (2:1) o uno de cada tres (3:1): QRS estrecho y regular.', r: ['#rtv-lupa-av', '[data-fila="fc"]'], c: C.regular }] },
  fa: { tit: 'Fibrilación auricular', pasos: [
    { t: 'Las aurículas no tienen director: muchas ondas pequeñas chocan entre sí. No hay P: hay ondas de fibrilación.', r: ['#rtv-aurs', '#rtv-ecg'], c: C.irregular, org: 'las ondas: fisiología general' },
    { t: 'Llegan al nodo impulsos a destiempo y el torniquete solo deja pasar los que lo encuentran rearmado: el RR es irregular.', r: ['#rtv-lupa-av'], c: C.irregular, org: 'el nodo como filtro: fisiología general' },
    { t: 'Sin la contracción de la aurícula se pierde ~25 % del llenado. Se nota si el llenado ya era malo: estenosis mitral o hipertrofia.', r: ['#rtv-aurs', '#rtv-art'], c: C.faCons },
    { t: 'Dos latidos muy juntos: el ventrículo no se llena y la sistólica cae. Algunos no llegan a la muñeca: es el déficit de pulso.', r: ['#rtv-art', '[data-fila="pulso"]'], c: C.f194 },
    { t: 'Los fármacos que alargan la conducción del nodo endurecen el muelle del torniquete: pasan menos. Pruébalo en «Tratar».', r: ['#rtv-torn-r'], c: C.t191, org: 'el muelle: la imagen del modelo' }] },
  faF: { tit: 'FA: el fármaco y las horas', pasos: [
    { t: () => ({ dilt: 'Diltiazem 0,25 mg/kg IV en 2 min y luego 5-15 mg/h. En una hora controla al 55 %; la perfusión, hasta al 90 %.', amio: 'Amiodarona 150 mg IV en 10 min, luego 1 mg/min 6 h y 0,5 mg/min 18 h; no más de 2,2 g en 24 h.', digo: 'Digoxina 0,25 mg IV cada 2 h hasta 1,5 mg. Lenta: no se usa sola para el control agudo.' })[S.farmaco], r: ['#rtv-bomba', '#rtv-torn-r'], c: C.t191 },
    { t: 'La Fig. 19.5: el diltiazem cruza los 100 lpm hacia las 2-2,5 h; la amiodarona y la digoxina no bajan de 100 en 6 h.', r: ['#rtv-g195'], c: C.f195, org: 'lectura del gráfico' },
    { t: 'Al bajar la FC, los latidos se espacian, el ventrículo se llena y el déficit de pulso se va: un punto final más fisiológico que una cifra.', r: ['#rtv-art', '[data-fila="pulso"]'], c: C.final, org: 'cuánto: ilustrativo' },
    { t: 'El precio: el diltiazem da hipotensión en el 20-30 % y es inotrópico negativo; la amiodarona, mucho menos (la que da, por su disolvente, el polisorbato 80).', r: ['#rtv-art'], c: C.amio }] },
  tam: { tit: 'Taquicardia auricular multifocal', pasos: [
    { t: 'Varios focos de la aurícula disparan por turnos: cada P tiene otra forma y el PR cambia.', r: ['#rtv-aurs', '#rtv-ecg'], c: C.irregular },
    { t: 'Ritmo irregular, de QRS estrecho. Más de la mitad, con enfermedad pulmonar crónica; también con déficit de Mg²⁺ y K⁺.', r: ['#rtv-ecg'], c: C.tam },
    { t: 'Magnesio IV aunque el Mg sérico sea normal: 2 g en 15 min y 6 g en 6 h. Corrigió el 88 % en un estudio.', r: ['#rtv-bomba'], c: C.tam },
    { t: 'Si falla y no hay EPOC: metoprolol (80 %). Con EPOC, verapamilo: corrige menos de la mitad, pero frena la FC.', r: ['#rtv-lupa-av'], c: C.tam }] },
  wpw: { tit: 'Wolff-Parkinson-White', pasos: [
    { t: 'Además del nodo hay un atajo a través del anillo: la vía accesoria. No tiene torniquete.', r: ['#rtv-ap', '#rtv-puente'], c: C.wpw, org: 'su sitio: fisiología general (ver la nota)' },
    { t: 'Parte del ventrículo se activa antes, por el atajo, y despacio, de músculo a músculo: PR corto y onda delta antes del QRS.', r: ['#rtv-ecg', '#rtv-vents'], c: C.wpw, org: 'por qué la delta: fisiología general' },
    { t: 'Da taquicardias supraventriculares que se repiten, por reentrada. Si llega una FA, el atajo lo cambia todo: pruébalo en «Tratar».', r: ['#rtv-puente'], c: C.wpw }] },
  bradi: { tit: 'Bradicardia sinusal', pasos: [
    { t: 'El reloj sinusal dispara despacio, pero el camino es el de siempre: una P antes de cada QRS y el mismo PR.', r: ['#rtv-sa', '#rtv-ecg'], c: L.sinusal, org: 'ficha' },
    { t: 'Entre 40 y 50 lpm puede ser normal en reposo, sobre todo en deportistas. Se trata si da síntomas y no hay causa que corregir (fármacos, hipoxia, potasio).', r: ['#rtv-sa'], c: E.dns, org: 'ESC 2021' }] },
  bav1: { tit: 'Bloqueo AV de 1.er grado', pasos: [
    { t: 'El torniquete del nodo AV frena la onda: el PR se alarga y queda fijo. Toda P va seguida de su QRS.', r: ['#rtv-lupa-av', '#rtv-nav', '#rtv-ecg'], c: L.bav, org: 'ficha' },
    { t: 'Suele ser asintomático y sin consecuencias. Solo con un PR muy largo (≥ 300 ms) y síntomas parecidos a los del síndrome de marcapasos se plantea tratar.', r: ['#rtv-ecg'], c: E.bav1, org: 'ESC 2021' }] },
  bav2: { tit: 'Mobitz I (Wenckebach)', pasos: [
    { t: 'El PR se alarga latido a latido hasta que una P no conduce; después el PR vuelve a ser corto y el ciclo se repite.', r: ['#rtv-lupa-av', '#rtv-ecg'], c: L.bav2, org: 'ficha' },
    { t: 'Suele estar en el nodo AV (suprahisiano): curso benigno y poco riesgo de progresar. Solo se pone marcapasos si da síntomas o se demuestra que el bloqueo está en o bajo el His.', r: ['#rtv-nav'], c: E.mp, org: 'ESC 2021' }] },
  bav2ii: { tit: 'Mobitz II y bloqueo 2:1', pasos: [
    { t: 'El PR de los latidos que conducen no cambia, y de pronto una P se queda sin QRS: el His deja de transmitir una de cada tantas.', r: ['#rtv-his', '#rtv-ecg'], c: L.nota, org: 'ficha' },
    { t: 'Sin causa reversible, indica marcapasos aunque no haya síntomas: puede progresar a bloqueo completo. En un 2:1 se distingue si es nodal o infranodal.', r: ['#rtv-his'], c: E.mobitz, org: 'ESC 2021' }] },
  wpwFa: { tit: 'FA con una vía accesoria', pasos: [
    { t: 'Las aurículas fibrilan, y el atajo, sin torniquete, deja pasar impulsos muy seguidos: QRS anchos, rápidos e irregulares.', r: ['#rtv-puente', '#rtv-ecg'], c: C.wpw },
    { t: 'Los fármacos que frenan el nodo (antagonistas del calcio, betabloqueantes, digoxina) no frenan el atajo: la FC no baja.', r: ['#rtv-torn-r', '#rtv-puente'], c: C.wpw },
    { t: 'Peor: el bloqueo selectivo del nodo puede precipitar una FV.', r: ['#rtv-vents'], c: C.wpw },
    { t: 'Por eso: cardioversión eléctrica, o amiodarona o procainamida.', r: ['#rtv-desfib'], c: C.wpw }] },
  tv: { tit: 'Taquicardia ventricular', pasos: [
    { t: 'Un circuito gira alrededor de una cicatriz del VI. En cada vuelta sale un frente que recorre el ventrículo de músculo a músculo.', r: ['#rtv-circuito-tv'], c: C.tv, org: 'el circuito: fisiología general' },
    { t: 'QRS ancho y regular, 140-200 lpm, de comienzo brusco. Casi nunca sin cardiopatía estructural.', r: ['#rtv-ecg', '[data-fila="fc"]'], c: C.tv },
    { t: 'Aurículas y ventrículos laten por separado: P sueltas que no van con el QRS (disociación AV). A veces un latido sinusal se cuela y choca con el ventricular: latido de fusión.', r: ['#rtv-sa', '#rtv-ecg'], c: C.tvsvt },
    { t: 'Con cardiopatía, el 95 % de los QRS anchos son TV. Estable: amiodarona. Inestable: cardioversión sincronizada a 100 J; si falla, 100 J bifásico o 200 J; evita 360 J.', r: ['#rtv-desfib'], c: C.f198 },
    { t: 'La adenosina corta la mayoría de las supraventriculares y no corta la TV: aquí solo echa el cerrojo al torniquete, y el circuito, que no pasa por él, sigue. Por eso sirve si dudas.', r: ['#rtv-lupa-av'], c: C.f198, org: 'que el circuito no pase por el nodo: fisiología general' }] },
  aberrancia: { tit: 'Supraventricular con aberrancia', pasos: [
    { t: 'Una reentrada nodal (nace arriba, en el torniquete) que baja con la rama izquierda bloqueada.', r: ['#rtv-lupa-av', '#rtv-ramas'], c: C.ancho },
    { t: 'QRS ancho y regular: parece una TV. Si fuera irregular, la pista sería la contraria: la TV nunca es irregular.', r: ['#rtv-ecg'], c: C.madeja },
    { t: 'Al volver a sinusal, el QRS sigue igual de ancho: el bloqueo de rama ya estaba (Fig. 19.6).', r: ['#rtv-ecg'], c: C.f196 },
    { t: 'Si dudas y está estable: adenosina. Corta la supraventricular; la TV, no.', r: ['#rtv-cerrojo'], c: C.f198 }] },
  torsade: { tit: 'QT largo y torsade', pasos: [
    { t: 'El QT es la despolarización y la repolarización del ventrículo: del inicio del QRS al final de la T. Se mide mejor en V3-V4.', r: ['#rtv-ecg'], c: C.qtc },
    { t: 'Haloperidol, macrólidos, antiarrítmicos IA y III, y K⁺, Ca²⁺ o Mg²⁺ bajos alargan el QT. En la célula, la repolarización tarda más.', r: ['#rtv-celula'], c: C.t195, org: 'en qué fase: fisiología general' },
    { t: 'QTc = QT / √RR. Normal, ≤0,44 s; por encima de 0,5 s, riesgo de torsade. Predice poco: el QT largo es frecuente en la UCI y la torsade, rara.', r: ['[data-fila="qt"]'], c: C.qtc },
    { t: 'Torsade: una TV polimórfica cuyos QRS giran alrededor de la línea. Sostenida: desfibrilar; magnesio 1-2 g en 15 min; corregir K⁺ y Mg²⁺ y retirar el fármaco.', r: ['#rtv-ecg'], c: C.tdpManejo }] },
  fv: { tit: 'Fibrilación ventricular', pasos: [
    { t: 'Los ventrículos se activan sin orden: no hay latido y la presión se aplana.', r: ['#rtv-vents', '#rtv-art'], c: C.desfib, org: 'fisiología general' },
    { t: 'Es un ritmo desfibrilable. Compresiones en menos de 10 s: 5-6 cm de profundidad, 100-120 por minuto.', r: ['#rtv-art'], c: C.t212 },
    { t: 'El choque, cuanto antes: con el primero a los 5 min sobrevive el 40 %; a los 20 min, menos del 10 %.', r: ['#rtv-g211'], c: C.f211, org: 'lectura del gráfico' },
    { t: 'Un choque despolariza todo el tejido a la vez. Si nada vuelve a desordenarlo, el nodo sinusal manda otra vez.', r: ['#rtv-vents', '#rtv-desfib'], c: C.desfib, org: 'mecanismo: fisiología general' },
    { t: 'Tras cada choque, 2 min de compresiones antes de mirar el ritmo. Si hace falta un 2.º choque, adrenalina 1 mg cada 3-5 min; si hace falta un 3.º, amiodarona 300 mg (y luego 150).', r: ['#rtv-bomba'], c: C.algoritmo }] },
  rcp: { tit: 'La RCP y la ETCO₂', pasos: [
    { t: 'Tus manos dan un flujo pequeño: mira la presión con cada compresión.', r: ['#rtv-art'], c: C.compres, org: 'cuánto: ilustrativo' },
    { t: 'La ETCO₂ sigue al gasto: con la ventilación fija, cambia en la misma proporción.', r: ['#rtv-co2', '[data-fila="co2"]'], c: C.etco2 },
    { t: 'Se ha descrito una tasa media de 30 por minuto, el triple: no deja vaciar el pulmón: PEEP intrínseca, menos retorno y menos presión de perfusión coronaria.', r: ['#rtv-co2'], c: C.insufl },
    { t: 'La adrenalina cierra la periferia: la presión de perfusión coronaria sube un 30 % y dura al menos 3 minutos.', r: ['#rtv-g213'], c: C.adrenalina },
    { t: 'Si a los 20 min la ETCO₂ no pasa de 10-15 mmHg, es improbable que vuelva el pulso.', r: ['#rtv-g214'], c: C.f214, org: 'lectura del gráfico' }] },
  rcpAdre: { tit: 'La RCP con adrenalina', pasos: [
    { t: 'La presión de perfusión coronaria (PPC) es la aórtica menos la de la aurícula derecha entre compresiones: lo que empuja la sangre por las coronarias. Con buena RCP, 22 mmHg.', r: ['[data-fila="ppc"]', '#rtv-art'], c: C.adrenalina, org: 'lectura de la Fig. 21.3, p. 62' },
    { t: 'La adrenalina vasoconstriñe en todo el cuerpo: la PPC sube un 30 % (22 → 29) y el efecto dura al menos 3 minutos, el intervalo entre dosis. Después decae (cómo: ilustrativo).', r: ['[data-fila="ppc"]', '#rtv-g213'], c: C.adrenalina, org: 'la figura llega a ~33: las fuentes discrepan' },
    { t: 'Su cara mala es la estimulación β del corazón: puede anular el beneficio y se ha implicado en la disfunción cardíaca tras la resucitación.', r: ['#rtv-ecg'], c: C.adrenalina },
    { t: 'Sube la recuperación del pulso (RCE), pero su efecto en la supervivencia no es claro. La pauta es repetirla cada 3-5 min, porque el efecto dura al menos 3 min; la fuente no dice qué pasa si se adelanta (el modelo no sube más la PPC: ilustrativo).', r: ['#rtv-bomba'], c: C.refractaria }] },
  rcpInsufl: { tit: 'La RCP con 30 insuflaciones por minuto', pasos: [
    { t: 'Lo recomendado tras intubar: 10 por minuto, una cada 6 s, con 500-600 mL por insuflación (o lo que eleve visiblemente el tórax).', r: ['#rtv-co2'], c: C.t212 },
    { t: 'Se ha descrito una tasa media de 30 por minuto, el triple. No da tiempo a vaciar el pulmón: se acumula PEEP intrínseca.', r: ['#rtv-co2'], c: C.insufl },
    { t: 'Dos efectos: menos retorno venoso y menos presión de perfusión coronaria. Aquí la PPC baja de 22 a ≈18 (cuánto: ilustrativo; la fuente solo dice que baja).', r: ['[data-fila="ppc"]', '#rtv-art'], c: C.insufl, org: 'el cuánto: ilustrativo' },
    { t: 'La ETCO₂ cae de 20 a 13, pero se deduce que ya no mide solo el gasto (el libro solo da la regla con ventilación constante, p. 62).', r: ['[data-fila="co2"]', '#rtv-co2'], c: C.etco2, org: 'las cifras: ilustrativo' }] },
  refractaria: { tit: 'FV que no cede', pasos: [
    { t: 'Tres choques sin éxito: un buen resultado solo en el 5 %.', r: ['#rtv-desfib'], c: C.refractaria },
    { t: 'Con ECMO disponible las 24 horas, es una opción: se han descrito mejores resultados.', r: ['#rtv-vents'], c: C.refractaria },
    { t: 'Mientras, lo que no cambia: compresiones de calidad, adrenalina cada 3-5 min y la ETCO₂ como guía.', r: ['#rtv-co2'], c: C.algoritmo }] },
  aesp: { tit: 'Actividad eléctrica sin pulso', pasos: [
    { t: 'Hay actividad eléctrica organizada, pero el corazón no expulsa: no hay pulso.', r: ['#rtv-ecg', '#rtv-art'], c: C.aesp },
    { t: 'No se desfibrila: compresiones y adrenalina 1 mg cada 3-5 min.', r: ['#rtv-bomba'], c: C.aesp },
    { t: 'Busca la causa con las T: neumotórax a tensión, taponamiento, tromboembolismo y trombosis coronaria.', r: ['#rtv-vents'], c: C.aesp },
    { t: 'La eco ayuda: el neumotórax (S 91 %, E 99 % en supino) y el derrame; con cualquier derrame en la parada, pericardiocentesis.', r: ['#rtv-vents'], c: C.eco }] },
  asistolia: { tit: 'Asistolia', pasos: [
    { t: 'No hay actividad eléctrica: la tira es una línea.', r: ['#rtv-ecg'], c: C.aesp },
    { t: 'No se desfibrila salvo que aparezca una FV o una TV: compresiones y adrenalina.', r: ['#rtv-bomba'], c: C.aesp },
    { t: 'Un corazón quieto en la eco del trauma predijo la muerte en el 100 %, pero los médicos no coinciden al verlo: las guías no lo usan para parar.', r: ['#rtv-vents'], c: C.eco }] },
  rce: { tit: 'Vuelve el pulso', pasos: [
    { t: 'Tras el choque y las compresiones, el nodo sinusal vuelve a mandar: P, QRS y pulso.', r: ['#rtv-sa', '#rtv-ecg'], c: C.desfib },
    { t: 'La ETCO₂ sube de golpe y se mantiene: «aumento brusco y sostenido, típicamente ≥40 mmHg» (Fig. 21.2, p. 61).', r: ['#rtv-co2'], c: C.f212 },
    { t: 'Es el principio: cerca del 70 % de los que recuperan el pulso no sobreviven a la hospitalización.', r: ['#rtv-vents'], c: C.posparo }] },
  stemi: { tit: 'ST elevado', pasos: [
    { t: 'Una zona del ventrículo sin riego: su músculo lesionado crea una corriente que levanta el ST.', r: ['#rtv-lesion'], c: C.scaEcg, org: 'el mecanismo: fisiología general' },
    { t: 'Mide en el punto J, donde acaba el QRS, en milímetros (1 mm = 0,1 mV).', r: ['#rtv-ecg'], c: C.t201, org: '1 mm = 0,1 mV: fisiología general' },
    { t: 'En V2-V3: ≥2 mm en varones y ≥1,5 mm en mujeres; en las demás, ≥1 mm. Siempre en dos o más derivaciones contiguas.', r: ['[data-fila="st"]'], c: C.t201 },
    { t: 'Un ST elevado pide reperfusión urgente. Un bloqueo de rama o un ritmo de marcapasos pueden taparlo: con sospecha de isquemia, se trata como un STEMI.', r: ['#rtv-ecg'], c: C.scaEcg }] },
  hiperk: { tit: 'Potasio alto', pasos: [
    { t: 'La aguja de la célula marca el reposo (-90 mV) y cada fase. Si sube el potasio de fuera, el reposo sube y la fase 0 se hace lenta.', r: ['#rtv-celula'], c: LA.pa, org: 'las fases: El Libro Azul; el efecto del K⁺: fisiología general' },
    { t: 'Hacia 6,5 mEq/l: ondas T picudas.', r: ['#rtv-ecg'], c: KC.ecg },
    { t: 'Por encima de 7: el PR se alarga, se pierde la P y, más tarde, el QRS se ensancha.', r: ['#rtv-ecg'], c: KC.ecg },
    { t: 'Por encima de 8, el QRS se funde con la T en una onda sinuosa. Y con cualquier potasio puede haber arritmias ventriculares fatales.', r: ['#rtv-ecg'], c: KC.ecg }] },
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
  { tipo: 'calla', txt: '<b>Qué carril baja y cuál sube en la reentrada nodal.</b> El libro dice que una vía conduce más despacio y tiene otro periodo refractario, y que la onda baja por una y vuelve por la otra (p. 29), sin decir cuál. Bajar por la lenta y subir por la rápida es de la fisiología general. Las dos vías del nodo: ESC 2019 de TSV (Brugada, <a href="https://pubmed.ncbi.nlm.nih.gov/31504425/" target="_blank" rel="noopener">PMID 31504425</a>) y Costantini 2018 (<a href="https://pubmed.ncbi.nlm.nih.gov/29912236/" target="_blank" rel="noopener">PMID 29912236</a>).', c: C.psvt },
  { tipo: 'calla', txt: '<b>El anillo aislante, las velocidades y el dibujo del corte.</b> Marino no describe la anatomía del sistema de conducción. El recorrido, el retraso del nodo (0,12 s) y las velocidades del His (2 m/s) y de Purkinje (4 m/s) son de otra fuente de la app, El Libro Azul (p. 7), con su propio botón. El anillo fibroso que aísla, la banda moderadora y la velocidad del músculo son fisiología general.', c: LA.cond },
  { tipo: 'calla', txt: '<b>Cómo actúa cada fármaco en la célula.</b> Marino da lo que hacen los fármacos (frenan el nodo, alargan el QT), no en qué canal. El Libro Azul da las fases del potencial de acción y qué ion entra o sale en cada una (p. 8). Qué fase alarga cada fármaco es fisiología general.', c: LA.pa },
  { tipo: 'calla', txt: '<b>El flúter y la TV, por dentro.</b> El libro da el aspecto del flúter (dientes de sierra, conducción 2:1 o 3:1; p. 18-19) y de la TV (p. 31-32), no su circuito. El circuito alrededor de la tricúspide, la frecuencia de la aurícula y el circuito alrededor de una cicatriz son fisiología general. La frecuencia de la torsade y lo que la dispara, ilustrativos.', c: C.tv },
  { tipo: 'calla', txt: '<b>El tiempo y las cifras del dibujo.</b> La adenosina actúa en <30 s y dura 1-2 min (p. 30); aquí pasa en segundos y los 60 s del bloqueo son ilustrativos. El reloj de la parada va diez veces más deprisa. La presión, el pulso que «llega a la muñeca», la ETCO₂ de la tira y cuánto alarga el QT cada fármaco son ilustrativos; las curvas de las Figs. 19.5, 21.1, 21.3 y 21.4 son lecturas del gráfico.', c: C.adeno },
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
