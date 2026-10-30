// Los datos de la cabecera del shock v2 (maqueta; en la app: js/data/shock-estados.js, objetivos-reanimacion.js y
// pacientes-b3.js). Sin DOM. Toda cifra visible sale del motor (soporte.mjs) o lleva su página; los textos que citan
// cifras del paciente son funciones de la lectura del momento (R), para que el texto y el monitor digan lo mismo.
import { textoGravedad, gDePosparo, horasDePosparo, POSPARO_H, POSPARO_G0, RECETA_BENITO, RECETA_FERMIN, RECETA_REMEDIOS, RECETA_IC, IC_G_ETAPA, horasDeIc, eroaDeG, eesVdDeG, civDeG, EROA_TOPE, CIV_TOPE, VD_G_RECETA } from '../modules/libros/shock-vivo/soporte.mjs';
export { gDePosparo, horasDePosparo, POSPARO_H, IC_G_ETAPA };

// ---------------------------------------------------------------- fuentes y citas («Ver en la ficha» + PDF)
const PM = (id, t) => `<a class="biblio-link" href="https://pubmed.ncbi.nlm.nih.gov/${id}/" target="_blank" rel="noopener">${t}</a>`;
export const PDF_S = 'docs/marino-2024-shock-caps14-17.pdf';
const PDF_C = 'docs/marino-2024-cardiac-disorders-caps18-21.pdf';
const PDF_R = 'docs/marino-2024-respiratory-management-caps22-26.pdf';
const CARDIO = ['cardiologia', 'merinoCardiologia', 'panel-merino-cardio-tabs'];
const NEUMO = ['neumologia', 'merinoNeumologia', 'panel-merino-neumo-tabs'];
export const FICHA = {
  'mc-definiciones': [CARDIO, 'Shock: definiciones y monitorización', 'Shock: definiciones', PDF_S, 'Marino 2024'],
  'mc-vasopresores': [CARDIO, 'Vasopresores en el shock', 'Vasopresores', PDF_S, 'Marino 2024'],
  'mc-hemorragico-clasificacion': [CARDIO, 'Shock hemorrágico: fisiología y clasificación', 'Shock hemorrágico', PDF_S, 'Marino 2024'],
  'mc-hemorragico-fluidos': [CARDIO, 'Reanimación del shock hemorrágico', 'Reanimación hemorrágica', PDF_S, 'Marino 2024'],
  'mc-cardiogenico-fisio': [CARDIO, 'Shock cardiogénico: fisiopatología', 'Cardiogénico: fisiopatología', PDF_S, 'Marino 2024'],
  'mc-cardiogenico-farmaco': [CARDIO, 'Shock cardiogénico: soporte farmacológico', 'Cardiogénico: fármacos', PDF_S, 'Marino 2024'],
  'mc-soporte-mecanico': [CARDIO, 'Soporte circulatorio mecánico', 'Soporte mecánico', PDF_S, 'Marino 2024'],
  'mc-shock-septico': [CARDIO, 'Shock séptico', 'Shock séptico', PDF_S, 'Marino 2024'],
  'mc-anafilaxia': [CARDIO, 'Anafilaxia', 'Anafilaxia', PDF_S, 'Marino 2024'],
  'mc-posresucitacion': [CARDIO, 'Cuidados posparo: el síndrome posparo cardíaco', 'Posparo', PDF_C, 'Marino 2024'],
  'mc-ic-tipos': [CARDIO, 'Insuficiencia cardíaca aguda: tipos', 'IC aguda', PDF_C, 'Marino 2024'],
  'mc-ic-manejo': [CARDIO, 'Insuficiencia cardíaca aguda: manejo', 'IC aguda: manejo', PDF_C, 'Marino 2024'],
  'mc-diseccion-aortica': [CARDIO, 'Disección aórtica aguda', 'Disección aórtica', PDF_C, 'Marino 2024'],
  'neumo-ep-diagnostico': [NEUMO, 'Embolia pulmonar: diagnóstico', 'Embolia pulmonar', PDF_R, 'Marino 2024'],
  'neumo-ep-manejo': [NEUMO, 'Embolia pulmonar: manejo', 'Embolia pulmonar: manejo', PDF_R, 'Marino 2024'],
  'mar-cateter-ap': [['libros', 'marinoFundamentos', 'panel-marino-fund-tabs'], 'El catéter de arteria pulmonar y la presión de enclavamiento', 'Catéter de arteria pulmonar', 'docs/marino-2024-practicas-monitorizacion-caps5-9.pdf', 'Marino 2024'],
  // otras fuentes de la app (solo enlace; nunca se funden con Marino)
  'ic-descompensada': [['cardiologia', 'insuficienciaCardiaca', 'panel-cardio-ic-tabs'], 'Guía ESC 2026 de IC: IC descompensada', 'Guía ESC de IC', null, 'Guía ESC 2026 de IC'],
  'umi-shock-septico': [['sobrevivirUmi', 'manualUmi', 'panel-manual-umi-tabs'], 'Manual UMI: shock séptico', 'Manual UMI', null, 'Manual UMI'],
};
// Citas que se repiten (ids de párrafo: los de la cobertura del bloque, §3; los que aún no existen en la ficha se
// ponen al llevar el modelo a la app)
export const C = {
  pcpDiast: { f: 'mar-cateter-ap', id: 'mar-cateter-ap', sitio: 'La presión de enclavamiento (cap. 8)', p: 53 },
  t141: { f: 'mc-definiciones', id: 'mc-tabla-14-1', sitio: 'Tabla 14.1', p: 3 },
  ecuacion: { f: 'mc-definiciones', id: 'mc-shock-ecuacion', sitio: 'La ecuación de la PAM', p: '2-3' },
  t143: { f: 'mc-definiciones', id: 'mc-tabla-14-3', sitio: 'Tabla 14.3', p: 10 },
  t145: { f: 'mc-definiciones', id: 'mc-tabla-14-5', sitio: 'Tabla 14.5', p: 17 },
  scvo2: { f: 'mc-definiciones', id: 'mc-scvo2', sitio: 'ScvO₂', p: '9-10' },
  gap: { f: 'mc-definiciones', id: 'mc-gap-pco2', sitio: 'Gap de PCO₂', p: 10 },
  diur: { f: 'mc-definiciones', id: 'mc-diuresis', sitio: 'Diuresis', p: 11 },
  volIni: { f: 'mc-definiciones', id: 'mc-volumen-inicial', sitio: 'Volumen inicial', p: 11 },
  opinion: { f: 'mc-definiciones', id: 'mc-hipotension-consecuencia', sitio: 'La hipotensión, consecuencia', p: 18 },
  na: { f: 'mc-vasopresores', id: 'mc-norepinefrina', sitio: 'Norepinefrina', p: '12-13' },
  vasopresina: { f: 'mc-vasopresores', id: 'mc-vasopresina', sitio: 'Vasopresina', p: '15-16' },
  t144: { f: 'mc-vasopresores', id: 'mc-tabla-14-4', sitio: 'Tabla 14.4', p: 13 },
  volemia: { f: 'mc-hemorragico-clasificacion', id: 'mc-volemia', sitio: 'Volumen sanguíneo', p: 21 },
  compens: { f: 'mc-hemorragico-clasificacion', id: 'mc-compensacion', sitio: 'Respuestas compensadoras', p: '21-22' },
  t151: { f: 'mc-hemorragico-clasificacion', id: 'mc-tabla-15-1', sitio: 'Tabla 15.1', p: 22 },
  claseIII: { f: 'mc-hemorragico-clasificacion', id: 'mc-clase-iii', sitio: 'Clase III', p: 23 },
  claseIV: { f: 'mc-hemorragico-clasificacion', id: 'mc-clase-iv', sitio: 'Clase IV', p: 23 },
  hb: { f: 'mc-hemorragico-clasificacion', id: 'mc-hto-trampa', sitio: 'Hemoglobina: una trampa', p: 23 },
  hbFluido: { f: 'mc-hemorragico-clasificacion', id: 'mc-hto-fluido', sitio: 'Hemoglobina: el fluido de reanimación', p: 23 },
  f156: { f: 'mc-hemorragico-clasificacion', id: 'mc-fig-15-6', sitio: 'Fig. 15.6', p: 34 },
  csHemo: { f: 'mc-cardiogenico-fisio', id: 'mc-cs-hemodinamica', sitio: 'Cambios hemodinámicos', p: 40 },
  csExc: { f: 'mc-cardiogenico-fisio', id: 'mc-cs-excepciones', sitio: 'Excepciones', p: 40 },
  papilar: { f: 'mc-cardiogenico-fisio', id: 'mc-papilar', sitio: 'Rotura del papilar', p: 38 },
  septo: { f: 'mc-cardiogenico-fisio', id: 'mc-septo-rotura', sitio: 'Rotura del septo', p: 38 },
  fig161: { f: 'mc-cardiogenico-fisio', id: 'mc-fig-16-1', sitio: 'Fig. 16.1', p: 38 },
  roturas24: { f: 'mc-cardiogenico-fisio', id: 'mc-roturas-24h', sitio: 'Las roturas: primeras 24 h', p: 38 },
  vd: { f: 'mc-cardiogenico-fisio', id: 'mc-cs-vd', sitio: 'Fallo del corazón derecho', p: 40 },
  f162: { f: 'mc-cardiogenico-fisio', id: 'mc-cs-hemodinamica', sitio: 'Cambios hemodinámicos (Fig. 16.2)', p: 40 },
  obstr: { f: 'mc-cardiogenico-fisio', id: 'mc-cs-obstructivo', sitio: 'Shock obstructivo', p: 39 },
  t162: { f: 'mc-cardiogenico-farmaco', id: 'mc-tabla-16-2', sitio: 'Tabla 16.2', p: 42 },
  llenado: { f: 'mc-cardiogenico-farmaco', id: 'mc-llenado-optimo', sitio: 'Presión de llenado óptima', p: 42 },
  csNa: { f: 'mc-cardiogenico-farmaco', id: 'mc-cs-vasopresor', sitio: 'Terapia vasopresora', p: '42-43' },
  dobuta: { f: 'mc-cardiogenico-farmaco', id: 'mc-dobutamina', sitio: 'Dobutamina', p: 43 },
  milri: { f: 'mc-cardiogenico-farmaco', id: 'mc-milrinona', sitio: 'Milrinona', p: 44 },
  levo: { f: 'mc-cardiogenico-farmaco', id: 'mc-levosimendan', sitio: 'Levosimendán', p: 44 },
  trabajo: { f: 'mc-cardiogenico-farmaco', id: 'mc-carga-trabajo', sitio: 'El trabajo cardíaco', p: 44 },
  mcs: { f: 'mc-soporte-mecanico', id: 'mc-mcs', sitio: 'Para quién es el soporte', p: 45 },
  iabp: { f: 'mc-soporte-mecanico', id: 'mc-iabp', sitio: 'Balón de contrapulsación', p: 45 },
  iabpCompl: { f: 'mc-soporte-mecanico', id: 'mc-iabp', sitio: 'Balón: complicaciones', p: '46-47' },
  f163: { f: 'mc-soporte-mecanico', id: 'mc-fig-16-3', sitio: 'Fig. 16.3', p: 46 },
  impella: { f: 'mc-soporte-mecanico', id: 'mc-impella', sitio: 'Catéteres Impella', p: 47 },
  impellaEf: { f: 'mc-soporte-mecanico', id: 'mc-impella', sitio: 'Impella: efectos y complicaciones', p: 48 },
  f164: { f: 'mc-soporte-mecanico', id: 'mc-fig-16-4', sitio: 'Fig. 16.4', p: 47 },
  ecmo: { f: 'mc-soporte-mecanico', id: 'mc-ecmo', sitio: 'ECMO venoarterial', p: 48 },
  ecmoPoscarga: { f: 'mc-soporte-mecanico', id: 'mc-ecmo', sitio: 'ECMO: la poscarga del VI', p: '48-49' },
  f165: { f: 'mc-soporte-mecanico', id: 'mc-fig-16-5', sitio: 'Fig. 16.5', p: 49 },
  resultados: { f: 'mc-soporte-mecanico', id: 'mc-mcs-resultados', sitio: 'Resultados', p: 49 },
  seleccion: { f: 'mc-soporte-mecanico', id: 'mc-mcs-seleccion', sitio: 'Selección del dispositivo', p: 49 },
  sepHemo: { f: 'mc-shock-septico', id: 'mc-sepsis-hemodinamica', sitio: 'Alteraciones hemodinámicas', p: '57-58' },
  sepMon: { f: 'mc-shock-septico', id: 'mc-sepsis-monitorizacion', sitio: 'Monitorización', p: 59 },
  t172: { f: 'mc-shock-septico', id: 'mc-tabla-17-2', sitio: 'Tabla 17.2', p: 60 },
  vdMed: { f: 'mc-ic-tipos', id: 'mc-vd-medidas', sitio: 'Presiones de llenado', p: 4 },
  icEtapas: { f: 'mc-ic-tipos', id: 'mc-ic-etapas', sitio: 'Etapas progresivas de la IC izquierda', p: 5 },
  icFig: { f: 'mc-ic-tipos', id: 'mc-fig-18-3', sitio: 'Fig. 18.3', p: 6 },
  icNeuro: { f: 'mc-ic-tipos', id: 'mc-neurohumoral', sitio: 'Respuestas neurohumorales', p: '5-6' },
  icCongestion: { f: 'mc-ic-tipos', id: 'mc-congestion', sitio: 'Congestión venosa', p: '6-7' },
  pcpPeep: { f: 'mar-cateter-ap', id: 'mar-enclavamiento-peep', sitio: 'PEEP y enclavamiento (cap. 8)', p: 55 },
  cpapIc: { f: 'mc-ic-manejo', id: 'mc-vpp', sitio: 'Ventilación con presión positiva', p: 14 },
  autorreg: { f: 'mc-ic-tipos', id: 'mc-cardiorrenal', sitio: 'Síndrome cardiorrenal', p: 7 },
  disec: { f: 'mc-diseccion-aortica', id: 'mc-diseccion-fisio', sitio: 'Fisiopatología', p: 50 },
  tepClin: { f: 'neumo-ep-diagnostico', id: 'nep-tabla-22-1', sitio: 'Tabla 22.1', p: 2 },
  tepEco: { f: 'neumo-ep-diagnostico', id: 'nep-ecocardio', sitio: 'Ecocardiografía', p: '6-7' },
  tepRiesgo: { f: 'neumo-ep-manejo', id: 'nep-riesgo', sitio: 'Estratificación del riesgo', p: 7 },
  tepHemo: { f: 'neumo-ep-manejo', id: 'nep-hemodinamica', sitio: 'Manejo hemodinámico', p: '10-11' },
  escMcs: { f: 'ic-descompensada', id: 'ic-mcs-temporal', sitio: 'Soporte circulatorio mecánico temporal' },
  posparo: { f: 'mc-posresucitacion', id: 'mc-posparo', sitio: 'Síndrome posparo cardíaco', p: 64 },
  t214: { f: 'mc-posresucitacion', id: 'mc-tabla-21-4', sitio: 'Tabla 21.4', p: '66-67' },
  umi6h: { f: 'umi-shock-septico', id: 'umi-objetivos-6h', sitio: 'Objetivos de las primeras 6 horas' },
};

// ---------------------------------------------------------------- objetivos por fuente (nunca fundidos)
// Cada fila: [texto, comprueba(valor redondeado)]. Con soporte mecánico, la PCP se suspende (la fuente no lo dice).
export const OBJETIVOS = {
  'marino-14-5': { fuente: 'Marino', nombre: 'Tabla 14.5', largo: 'objetivos del shock', cita: C.t145, venosa: 'ScvO₂',
    filas: { pam: ['≥65', (v) => v >= 65], ic: ['≥2,5', (v) => v >= 2.5], gap: ['<6', (v) => v < 6], diur: ['>0,5', (v) => v > 0.5], ven: ['>50 %', (v) => v > 50], lact: ['<2', (v) => v < 2] } },
  'marino-15-6': { fuente: 'Marino', nombre: 'Fig. 15.6', largo: 'objetivos del shock hemorrágico', cita: C.f156, venosa: 'SvO₂',
    filas: { pam: ['≥65', (v) => v >= 65], diur: ['>0,5', (v) => v > 0.5], gap: ['<6', (v) => v < 6], spo2: ['>90', (v) => v > 90], ven: ['>50 %', (v) => v > 50], lact: ['<2', (v) => v < 2] } },
  'marino-16-2': { fuente: 'Marino', nombre: 'Tabla 16.2', largo: 'objetivos del shock cardiogénico', cita: C.t162, venosa: 'SvO₂',
    filas: { pcp: ['19-20', (v) => v >= 18 && v <= 20], ic: ['≥2,5', (v) => v >= 2.5], irvs: ['25-30', (v) => v >= 25 && v <= 30], pam: ['≥65', (v) => v >= 65], gap: ['<6', (v) => v < 6], diur: ['>0,5', (v) => v > 0.5], ven: ['>50 %', (v) => v > 50], lact: ['<2', (v) => v < 2] } },
  // Manual UMI (Sobrevivir a la UMI): objetivos de las primeras 6 h del shock SÉPTICO (solo en el séptico)
  'umi-sepsis-6h': { fuente: 'Manual UMI', nombre: 'Primeras 6 h', largo: 'objetivos del shock séptico', cita: C.umi6h, venosa: 'ScvO₂', solo: 'septico',
    filas: { pam: ['≥65-70', (v) => v >= 65], pvc: ['8-12', (v) => v >= 8 && v <= 12], diur: ['≥0,5', (v) => v >= 0.5], ven: ['≥70 %', (v) => v >= 70] } },
  // Tras la parada, Marino sube el objetivo de PAM en las primeras horas (Tabla 21.4, p. 66-67); solo da esa cifra
  'marino-21-4': { fuente: 'Marino', nombre: 'Tabla 21.4', largo: 'objetivo de PAM tras la parada', cita: C.t214, venosa: 'ScvO₂',
    filas: { pam: ['≥75', (v) => v >= 75] } },
};
// celdas en las que las dos fuentes no dicen lo mismo (se marca la celda y se enlaza la nota)
export const DISCREPAN = { ven: 'scvo2-fuentes', pam: 'pam-fuentes' };

// ---------------------------------------------------------------- pacientes del bloque (lista de la cobertura, §9)
// rec: la receta del motor (soporte.mjs). ilu: lo que no sale del motor (FR, T, Hb) es del caso, ilustrativo.
export const PACIENTES = [
  { k: 'mateo', nombre: 'Mateo', chip: 'hemorragia', tipo: 'hemo', peso: 78, edad: 34, sexo: 'varón', hb: 13.8, fr: 24, t: 36.4, obj: 'marino-15-6',
    rec: { esc: 'hemorragia', g: 0.83, hb: 13.8 }, linea: '34 años, 78 kg · herida abdominal por arma blanca · urgencias' },
  { k: 'amparo', nombre: 'Amparo', chip: 'sepsis', tipo: 'septico', peso: 76, ideal: 58, edad: 58, sexo: 'mujer', hb: 12.4, fr: 26, t: 39.2, obj: 'marino-14-5',
    rec: { esc: 'sepsis', g: 1, util: 'sepsis', hb: 12.4 }, linea: '58 años, 76 kg (ideal 58) · pielonefritis obstructiva · urgencias' },
  { k: 'aurelio', nombre: 'Aurelio', chip: 'infarto', tipo: 'cardio', peso: 82, edad: 67, sexo: 'varón', hb: 14, fr: 24, t: 36.7, obj: 'marino-16-2',
    // la PCP no está alta (≈14, el 30 % de la p. 40) con la PVC normal: un VI que aún admite volumen (viDiast) y el VD tocado por
    // el infarto anterior que llega al tabique (eesVd: la PVC sube, p. 40); volemia entera (M0, b3-paso4 g3: antes −1150 mL
    // tapaban un edema demasiado rápido del motor). Cuánto viDiast y eesVd: ilustrativo; tras 250 mL, PCP ≈16
    rec: { esc: 'fallo', g: 0.8, viDiast: 0.6, eesVd: 0.3, hb: 14 }, linea: '67 años, 82 kg · IAM anterior · hemodinámica, hora 0' },
  { k: 'joaquin', nombre: 'Joaquín', chip: 'taponamiento', tipo: 'tapon', peso: 84, edad: 56, sexo: 'varón', hb: 13.5, fr: 24, t: 36.8, obj: 'marino-14-5',
    rec: { esc: 'derrame', g: 0.85, hb: 13.5 }, linea: '56 años, 84 kg · disección aórtica tipo A que sangra al pericardio' },
  // Virginia: la FV extrahospitalaria con RCE (1.er choque a los 6 min). El peso y la edad: del caso; FR, T y Hb, ilustrativos.
  // La Hb del caso se toma sin pérdida; la FR es la de una paciente ventilada y la T la de quien se mantiene ≤37,5 °C (p. 65)
  { k: 'virginia', nombre: 'Virginia', chip: 'posparo', tipo: 'posparo', peso: 64, edad: 58, sexo: 'mujer', hb: 12.6, fr: 16, t: 36.8, obj: 'marino-21-4',
    rec: { esc: 'posparo', g: POSPARO_G0, hb: 12.6 }, linea: '58 años, 64 kg · fibrilación ventricular extrahospitalaria, primer choque a los 6 min · hora 0 tras la RCE' },
  // Benito, Fermín y Remedios (b3-paso4 g3): los tres del infarto con su mando de gravedad propio (soporte.mjs: RECETA_*).
  // Edad, peso y hora: del caso; FR, T y Hb, ilustrativos (FR alta por el edema; T normal)
  { k: 'benito', nombre: 'Benito', chip: 'rotura del papilar', tipo: 'papilar', peso: 78, edad: 66, sexo: 'varón', hb: 14, fr: 28, t: 36.8, obj: 'marino-16-2',
    rec: RECETA_BENITO, linea: '66 años, 78 kg · IAM · hora 14 · soplo nuevo y SpO₂ baja' },
  { k: 'fermin', nombre: 'Fermín', chip: 'infarto del VD', tipo: 'vd', peso: 80, edad: 70, sexo: 'varón', hb: 14, fr: 18, t: 36.7, obj: 'marino-16-2',
    rec: RECETA_FERMIN, linea: '70 años, 80 kg · IAM inferior con afectación del VD · hemodinámica, hora 2' },
  { k: 'remedios', nombre: 'Remedios', chip: 'rotura del septo', tipo: 'septo', peso: 62, edad: 74, sexo: 'mujer', hb: 13, fr: 26, t: 36.6, obj: 'marino-16-2',
    rec: RECETA_REMEDIOS, linea: '74 años, 62 kg · IAM anterior · hora 20 · soplo holosistólico nuevo con frémito' },
  // Ramiro (b3-paso4 g4): la IC izquierda que se descompensa en el postoperatorio (Marino cap. 18, p. 5-6, Fig. 18.3). La figura es de
  // «un paciente postoperatorio» sin más datos: edad, peso, FR, T y Hb, ilustrativos. El mando es el reloj de 0 a 4 h (soporte.mjs, RECETA_IC)
  { k: 'ramiro', nombre: 'Ramiro', chip: 'IC izquierda', tipo: 'ic', peso: 74, edad: 68, sexo: 'varón', hb: 12.5, fr: 22, t: 36.8, obj: 'marino-14-5',
    rec: RECETA_IC, linea: '68 años, 74 kg · postoperatorio · IC izquierda que se descompensa' },
  { k: 'consuelo', nombre: 'Consuelo', chip: 'TEP', tipo: 'tep', peso: 142, edad: 63, sexo: 'mujer', hb: 12.8, fr: 30, t: 37.2, obj: 'marino-14-5',
    rec: { esc: 'tep', g: 0.95, hb: 12.8, espacio: 'embolia' }, linea: '63 años, 142 kg · día 5 de prótesis de cadera · hora 20' },
];
// La gravedad de cada paciente, con nombre (el mando mueve la «g» del escenario del motor)
const coma2 = (x, d = 2) => (+x).toFixed(d).replace('.', ',');
export const GRAVEDAD = {
  hemo: { min: 0, max: 1, paso: 0.01, texto: (g, pac) => { const pct = Math.round(g * 42), ml = Math.round(pct / 100 * mlKg(pac) * pac.peso / 50) * 50; return [`${pct} % de la volemia`, `≈ ${ml.toLocaleString('es-ES')} mL de ${(mlKg(pac) * pac.peso / 1000).toFixed(1).replace('.', ',')} L · clase ${clase(pct)}`]; }, nota: 'Sangre perdida (Tabla 15.1; 66 mL/kg en el varón, p. 21)', cita: C.t151 },
  septico: { min: 0, max: 1, paso: 0.01, texto: (g) => [`${Math.round(g * 100)} %`, `resistencias al ${Math.round(100 * (1 - 0.6 * g))} %`], nota: 'Vasodilatación y fuga capilar', cita: C.sepHemo },
  cardio: { min: 0, max: 1, paso: 0.01, texto: (g) => [`Ees del VI ${(3.1 * (0.3 / 3.1) ** g).toFixed(2).replace('.', ',')}`, `contractilidad al ${Math.round(100 * (0.3 / 3.1) ** g)} %`], nota: 'Contractilidad del VI (modelo)', cita: C.csHemo },
  // el derrame y el émbolo: el texto de la gravedad lo da el motor (escenarios.mjs), así no se separan
  // el mando de gravedad es el reloj desde la RCE (horas): la Ees se recupera con él; la curva, ilustrativa; el 72, de la p. 65
  posparo: { min: 0, max: POSPARO_H, paso: 1, horas: true, texto: (g) => [`${Math.round(horasDePosparo(g))} h tras la RCE`, `contractilidad del VI al ${Math.round(100 * (0.3 / 3.1) ** g)} %`],
    nota: 'Horas desde la recuperación de la circulación: el aturdimiento suele resolverse en 72 h (p. 65); la forma de la curva, ilustrativa', cita: C.posparo },
  // Los tres del infarto: el deslizador mueve una pieza del motor (soporte.mjs); el fallo del VI queda como llega el paciente
  papilar: { min: 0, max: 1, paso: 0.01, texto: (g) => [`orificio mitral ${coma2(eroaDeG(g))} cm²`, `${eroaDeG(g) >= 0.5 ? 'valva en flail' : 'insuficiencia mitral moderada'} (ilustrativo) · tope ${coma2(EROA_TOPE,1)} cm²`],
    nota: 'Orificio de la mitral: los cm² son del modelo (la ficha, p. 38, solo da la dirección)', cita: C.papilar },
  vd: { min: 0, max: 1, paso: 0.01, texto: (g) => [`Ees del VD al ${Math.round(100 * eesVdDeG(g))} % de la normal`, 'contractilidad del ventrículo derecho'],
    nota: 'Contractilidad del VD (de la normal): del modelo; la ficha (p. 40) da la dirección. Los líquidos de partida no son del mando', cita: C.vd },
  septo: { min: 0, max: 1, paso: 0.01, texto: (g) => [`orificio del septo ${coma2(civDeG(g))} cm²`, 'cortocircuito VI → VD'],
    nota: 'Orificio entre el VI y el VD: los cm² son del modelo (la ficha, p. 38, solo da la dirección). Modelo: la PCP queda alta (por encima de 18-20), algo por debajo de la de antes de la rotura porque el VI se descarga hacia el VD', cita: C.septo },
  ic: { min: 0, max: 1, paso: 0.01, texto: (g) => [`hora ${horasDeIc(g).toLocaleString('es-ES')} del postoperatorio`, 'IC izquierda: de 0 a 4 h (Fig. 18.3)'],
    nota: 'El reloj de la Fig. 18.3 (p. 6): cada hora lleva su fallo del VI y su resistencia; las cifras son del modelo, la dirección, de la ficha', cita: C.icFig },
  tapon: { min: 0, max: 1, paso: 0.01, texto: (g) => [textoGravedad('derrame', g), 'en el saco'], nota: 'Líquido en el pericardio (modelo)', cita: C.obstr },
  tep: { min: 0, max: 1, paso: 0.01, texto: (g) => [textoGravedad('tep', g), 'el émbolo, sobre el VD'], nota: 'Carga del émbolo sobre el VD (modelo)', cita: C.tepRiesgo },
};
export const clase = (pct) => pct < 15 ? 'I' : pct <= 30 ? 'II' : pct <= 40 ? 'III' : 'IV';
// La clase por lo que se ve. La Tabla 15.1 (p. 22) solo da flechas (FC ↔/↑/↑↑, PA ↔/↓/↓↓): los cortes de aquí (FC 95/120/140,
// PAS 90/70) son ILUSTRATIVOS, no de la ficha (ver la nota «clase-cortes»)
export const claseClinica = (R) => R.pas < 70 || R.fc > 140 ? 'IV' : R.pas < 90 || R.fc > 120 ? 'III' : R.fc >= 95 ? 'II' : 'I';

// ---------------------------------------------------------------- soporte: para quién (p. 45, 48)
export function indicacion(pac, tipoAparato) {
  if (pac.tipo === 'cardio' || pac.tipo === 'papilar' || pac.tipo === 'septo') return { ok: true };   // el soporte, para el cardiogénico refractario (p. 45)
  if (pac.k === 'joaquin' && tipoAparato === 'balon') return { ok: false, sello: 'Contraindicado', txt: 'Disección aórtica: el balón está contraindicado (p. 45).', cita: C.iabp };
  if (pac.k === 'joaquin' && tipoAparato === 'impella') return { ok: false, sello: 'Contraindicado', txt: 'Valvulopatía aórtica: el Impella está contraindicado (p. 48), y la disección tipo A puede dar insuficiencia aórtica (cap. 20, p. 50).', cita: C.impellaEf };
  return { ok: false, sello: 'No indicado', txt: 'La fuente reserva el soporte mecánico para el shock cardiogénico refractario (p. 45). En este paciente no se pone.', cita: C.mcs };
}

// ---------------------------------------------------------------- estados con nombre (el nombre sale de las cifras)
// R: la lectura redondeada del momento; X: el contexto (paciente, ajuste, infundido, pérdida)
// Los topes de los mandos (autonomo/bloques/b3/limites-shock.md): cada cifra con su origen en topes.js
export const TOPES = { eroa: EROA_TOPE, eroaAviso: 0.7, civ: CIV_TOPE, civAviso: 0.5, vdG: 0.99, vdGAviso: VD_G_RECETA + 0.01, horasPosparo: 72, horasPosparoAviso: 66, pcp: 20, pcpAviso: 15, pvc: 12, pvcAviso: 11, pvcSube: 4, spo2: 95, edemaMl: 300, edemaSello: 600, tepMl: 500, tepAviso: 250, horas: 48, horasAviso: 42, pamVaso: 110, reposicion: 1.5, cpap: 10 };
// Sobrecarga: la PCP en el techo de la ficha, o la PVC por encima de 12 habiendo subido ≥ 4 sobre la de entrada y el pulmón ya
// encharcado (SpO₂ < 95: el sello llega con su consecuencia). El taponamiento y el TEP nacen con la PVC alta: cuenta lo que sube
export const sobrecarga = (R) => R.pcp >= TOPES.pcp || (R.pvc > TOPES.pvc && R.pvc - (R.pvc0 ?? 0) >= TOPES.pvcSube && R.edema > 50 && R.spo2 < TOPES.spo2);
export const avisoVolumen = (R) => R.pcp >= TOPES.pcpAviso || (R.pvc >= TOPES.pvcAviso && R.pvc - (R.pvc0 ?? 0) >= TOPES.pvcSube - 2);
export const mlKg = (pac) => pac.sexo === 'mujer' ? 60 : 66;   // volemia, ficha p. 21: 66 mL/kg el varón, 60 la mujer (peso magro)
export const perdidoMl = (pac, R) => Math.round(R.perdida / 100 * mlKg(pac) * pac.peso);
// lo que se puede reponer: 1,5 veces lo perdido (el ×1,5: ilustrativo); solo en la hemorragia con pérdida
export const topeRepos = (R, X) => X.pac.tipo === 'hemo' && R.perdida > 0 ? TOPES.reposicion * perdidoMl(X.pac, R) : null;
export const hipertensionVaso = (R, X) => (X.ajuste.na > 0 || X.ajuste.vaso) && R.pam > TOPES.pamVaso;
export function nombreEstado(R, X) {
  const s = X.aparato ?? X.ajuste.soporte;
  if (s !== 'no') {
    if (!indicacion(X.pac, s).ok) return 'soporte-no';
    if (s === 'balon') return X.ajuste.razon > 1 && X.ajuste.balon > 0 ? 'balon-1a2' : 'balon';
    if (s === 'impella') return bombaNoLlega(R) ? 'impella-vacio' : R.aoDe && R.aoAbre === 0 ? 'impella-alto' : 'impella';
    if (X.ajuste.venteo !== 'no') return 'ecmo-venteo';
    if (bombaEcmoNoLlega(R)) return 'ecmo-vacio';
    return R.aoAbre <= 2 ? 'ecmo-cerrada' : R.pcp >= 22 ? 'ecmo-carga' : 'ecmo';
  }
  if (hipertensionVaso(R, X)) return 'hipertension-vaso';
  // el papilar y el septo llegan con la PCP en 20-30 sin que nadie haya dado volumen: es su cuadro, no una sobrecarga
  const t = X.pac.tipo, llegaAsi = (t === 'papilar' || t === 'septo' || t === 'ic') && X.infundido.cris + X.infundido.sangre === 0;
  if (!llegaAsi && sobrecarga(R)) return 'sobrecarga';
  const tr = topeRepos(R, X);
  if (tr != null && X.infundido.cris + X.infundido.sangre >= tr) return 'hemo-tope';
  // la hemorragia se nombra por lo que enseña el paciente (FC y PA de la Tabla 15.1), no solo por lo perdido
  if (t === 'hemo') {
    if (X.infundido.cris > 0) return 'hemo-salino';
    const c = claseClinica(R);
    if ((X.infundido.crisTotal > 0 || X.infundido.sangre > 0) && clase(R.perdida) >= 'III' && (c === 'I' || c === 'II')) return 'hemo-reanimado';
    return c === 'IV' ? 'hemo-iv' : c === 'III' ? 'hemo-iii' : c === 'II' ? 'hemo-ii' : 'hemo-i';
  }
  if (t === 'septico') { if (X.ajuste.na >= 10) return 'septico-na'; return R.irvs >= 25 && R.pam >= 65 ? 'sin-shock' : 'septico'; }
  if (t === 'cardio') { if (R.pam >= 65 && R.ic >= 2.2) return 'sin-shock'; return R.pcp < 18 ? 'cardio-pcp-baja' : R.pcp <= 20 ? 'cardio-pcp-optima' : 'cardio'; }
  if (t === 'posparo') return X.g <= 0.005 ? 'posparo-72' : 'posparo';
  // la IC izquierda se nombra por su etapa (Fig. 18.3): el gasto cae (3), la FC sube con el gasto conservado (2), o solo sube la PCP (1).
  // Los cortes (IC 3,0 y FC 90) son ilustrativos: la figura no los da. Sin la PA sostenida (PAM <65) ya es el cardiogénico
  if (t === 'ic' && X.ajuste.cpap > 0 && R.ic < 3 && R.pam >= 65) return 'ic-cpap';
  if (t === 'ic') return R.ic < 3 ? (R.pam >= 65 ? 'ic-etapa-3' : 'cardio') : R.fc >= 90 ? 'ic-etapa-2' : 'ic-etapa-1';
  if (t === 'papilar') return 'rotura-papilar';
  if (t === 'vd') return R.pam >= 65 && R.ic >= 2.2 ? 'sin-shock' : 'iam-vd';
  if (t === 'septo') return R.qpqs >= 1.2 ? 'rotura-septo' : R.pam >= 65 && R.ic >= 2.2 ? 'sin-shock' : 'cardio';
  if (t === 'tapon') return Math.abs(R.pvc - R.pcp) > 3 ? 'sin-shock' : 'tapon';
  if (t === 'tep') return X.infundido.cris >= TOPES.tepMl ? 'tep-bolo' : R.pam >= 65 ? 'tep-intermedio' : 'tep-alto';
  return t;
}
const c1 = (x) => (+x).toFixed(1).replace('.', ',');
// La bomba del Impella saca menos de lo que pide (más de 0,3 L/min por debajo): al VI no le llega sangre
export const bombaNoLlega = (R) => R.impPide > 0 && R.impPide - R.imp > 0.3;
export const bombaEcmoNoLlega = (R) => R.ecmoPide > 0 && R.ecmoPide - R.ecmo > 0.3;
// Cada estado: título, frase (con su origen) y la explicación guiada (3-5 pasos que señalan el dibujo o el monitor).
// «s»: lo que se señala (selectores del monitor, de la escena o de la consola). Fuentes: la lista de citas de los pasos.
export const ESTADOS = {
  'hemo-i': { tit: 'Hemorragia, clase I', frase: () => 'Clase I: el relleno transcapilar repone lo perdido; casi no hay signos y no hace falta volumen.', org: 'ficha · p. 22',
    guia: [{ t: (R) => `Ha perdido un ${R.perdida} % de la volemia: menos del 15 %.`, s: ['#cor-cav'], c: C.t151 },
      { t: 'El relleno transcapilar mete líquido del intersticio en la sangre: hasta un litro.', s: ['[data-fila="pvc"]'], c: C.compens },
      { t: 'Casi no hay signos y no hace falta reponer volumen (Tabla 15.1).', s: ['[data-fila="fc"]', '[data-fila="pa"]'], c: C.t151 }] },
  'hemo-ii': { tit: 'Hemorragia, clase II', frase: (R) => `Clase II (${R.perdida} %): los vasos se aprietan y la PA aguanta. El primer aviso es la FC (${R.fc}).`, org: 'ficha · p. 22-23 (la clase: % perdido; el nombre por FC y PA, ilustrativo)',
    guia: [{ t: (R) => `Ha perdido un ${R.perdida} % de la volemia: la clase II (15-30 %), la fase compensada.`, s: ['#cor-cav'], c: C.t151 },
      { t: (R) => `El simpático acelera el corazón: FC ${R.fc}. Es lo primero que sube.`, s: ['[data-fila="fc"]', '#tr-ecg'], c: C.compens },
      { t: 'Mira la arteriola: se cierra. La vasoconstricción sostiene la PA.', s: ['#cor-arteriola', '[data-fila="irvs"]'], c: C.compens },
      { t: (R) => `PAM ${R.pam}: aún por encima de 65. La orina y el lactato tardan en moverse (Tabla 15.1).`, s: ['[data-fila="pa"]', '#shv-lab'], c: C.t151 }] },
  'hemo-iii': { tit: 'Hemorragia, clase III', frase: (R) => `Clase III (${R.perdida} %): apretar ya no basta. PA ${R.pas}/${R.pad} y FC ${R.fc}: es el shock hemorrágico. Se repone con sangre.`, org: 'ficha · p. 22-23 (la clase: % perdido; el nombre por FC y PA, ilustrativo)',
    guia: [{ t: (R, X) => `${X.pac.nombre} ha perdido un ${R.perdida} %: ${X.texto} (${mlKg(X.pac)} mL/kg × ${X.pac.peso} kg). Es la clase III (31-40 %).`, s: ['#cor-cav'], c: C.volemia, org: 'cuánto se pierde: el mando' },
      { t: (R) => `La PVC está en ${R.pvc} y las cavidades, pequeñas: falta volumen.`, s: ['[data-fila="pvc"]', '#cor-cav'], c: C.t141 },
      { t: (R) => `La arteriola, cerrada (IRVS ${R.irvs}). La vasoconstricción sostuvo la PA en la clase II; en la III ya no basta.`, s: ['#cor-arteriola', '[data-fila="irvs"]'], c: C.claseIII },
      { t: (R) => `La curva arterial es estrecha: PAS ${R.pas}, PAD ${R.pad}. Es el ventrículo que se vacía.`, s: ['#tr-art'], c: C.t141, org: 'la forma: fisiología general' },
      { t: 'La Hb aún no baja: pierde sangre entera. No baja hasta las 8-12 h. La clase III se repone con sangre.', s: ['#shv-lab'], c: C.hb }] },
  'hemo-iv': { tit: 'Hemorragia, clase IV', frase: (R) => `Clase IV (${R.perdida} %): shock profundo, quizá irreversible. PAM ${R.pam}. Es la pérdida masiva.`, org: 'ficha · p. 23 (la clase: % perdido; el nombre por FC y PA, ilustrativo)',
    guia: [{ t: 'Más del 40 % perdido: shock hemorrágico profundo, quizá irreversible.', s: ['#cor-cav'], c: C.claseIV },
      { t: (R) => `La PA cae (PAM ${R.pam}) y la curva arterial es mínima.`, s: ['#tr-art', '[data-fila="pa"]'], c: C.t151 },
      { t: 'Fallo multiorgánico y acidosis láctica: el lactato sube con las horas. Transfusión masiva (Tabla 15.1).', s: ['#shv-lab'], c: C.claseIV }] },
  'hemo-reanimado': { tit: 'Hemorragia repuesta', frase: (R, X) => `PA ${R.pas}/${R.pad} y FC ${R.fc}: la presión y la frecuencia han vuelto con ${(X.infundido.crisTotal + X.infundido.sangre).toLocaleString('es-ES')} mL, pero perdió un ${R.perdida} % de la volemia y la herida sigue ahí.`, org: 'ficha · p. 22-23; el nombre, por las cifras',
    guia: [{ t: (R) => `La FC (${R.fc}) y la PA (${R.pas}/${R.pad}) ya no son las de la clase III: lo que define la clase en la cabecera es lo que enseña el paciente.`, s: ['[data-fila="fc"]', '[data-fila="pa"]'], c: C.t151 },
      { t: (R, X) => X.infundido.sangre > 0 ? 'La sangre repone hematíes y volumen: la clase III se repone con sangre.' : 'El cristaloide repuso la presión, no los hematíes: la Hb que mide el laboratorio está diluida y 3/4 del suero se irán al intersticio.', s: ['#shv-lab'], c: C.hb },
      { t: 'Lo perdido sigue perdido: si la herida sangra, la clase vuelve. Mira el lactato y la orina en las horas siguientes.', s: ['#shv-lab', '[data-pest="reloj"]'], c: C.claseIII }] },
  'sin-shock': { tit: 'Sin shock', frase: (R, X) => `PAM ${R.pam}, IC ${c1(R.ic)} e IRVS ${R.irvs}: ${X.pac.tipo === 'tapon' ? `el derrame aún no aprieta (PVC ${R.pvc}, PCP ${R.pcp})` : X.pac.tipo === 'septico' ? 'los vasos aguantan y no hay hipoperfusión' : 'el corazón aún bombea bastante'}. Sube la gravedad para ver el shock.`, org: 'ficha · Tabla 14.5 (IC ≥2,5); el nombre, por las cifras del modelo: ilustrativo (los cortes de IC 2,2 e IRVS 25 no son de la ficha)',
    guia: [{ t: (R) => `PAM ${R.pam} (≥65) e IC ${c1(R.ic)} (≥2,5 o cerca): los objetivos de la Tabla 14.5 se cumplen sin hacer nada.`, s: ['[data-fila="pa"]', '[data-fila="ic"]'], c: C.t145 },
      { t: (R) => `IRVS ${R.irvs}: ni la resistencia baja del shock vasodilatador ni la alta del resto (Tabla 14.1).`, s: ['[data-fila="irvs"]', '#cor-arteriola'], c: C.t141 },
      { t: 'El shock lo define la hipoperfusión, no el diagnóstico: mueve el mando de gravedad y mira cuándo cae la PAM y sube el lactato.', s: ['#shv-dock', '#shv-lab'], c: C.opinion }] },
  'hemo-salino': { tit: 'Tras el cristaloide', frase: (R, X) => `Llevas ${X.infundido.cris.toLocaleString('es-ES')} mL de cristaloide: la PA sube ahora, pero 3/4 se irán al intersticio en la próxima hora.`, org: 'ficha · p. 11',
    guia: [{ t: 'De cada litro de cristaloide, solo un 25 % se queda en el plasma; el 75 % pasa al intersticio.', s: ['[data-pest="reloj"]'], c: C.volIni },
      { t: (R) => `En el momento del bolo la PVC y la PA suben (PAM ${R.pam}). Pasa el reloj a la hora 1 y mira cuánto queda.`, s: ['[data-fila="pa"]', '[data-fila="pvc"]', '[data-pest="reloj"]'], c: C.volIni, org: 'cuánto: el modelo' },
      { t: 'El salino añade plasma, no hematíes: diluye la Hb. Refleja la reanimación, no la pérdida.', s: ['#shv-lab'], c: C.hbFluido }] },
  septico: { tit: 'Shock séptico', frase: (R) => `Vasos abiertos (IRVS ${R.irvs}) y un gasto alto (IC ${c1(R.ic)}): la ScvO₂ alta (${R.ven} %) no tranquiliza; el gap de PCO₂ sí sirve.`, org: 'ficha · p. 10, 57-59',
    guia: [{ t: (R) => `Mira la arteriola: abierta. IRVS ${R.irvs}: la resistencia baja define el shock vasodilatador (Tabla 14.1).`, s: ['#cor-arteriola', '[data-fila="irvs"]'], c: C.t141 },
      { t: (R) => `El gasto no está bajo: IC ${c1(R.ic)}. La taquicardia (${R.fc}) y la poscarga baja lo suben.`, s: ['[data-fila="ic"]', '[data-fila="fc"]'], c: C.sepHemo },
      { t: (R) => `El endotelio dañado deja salir líquido: hipovolemia. PVC ${R.pvc}.`, s: ['[data-fila="pvc"]', '#cor-cav'], c: C.sepHemo },
      { t: (R) => `La ScvO₂ sube (${R.ven} %): la mitocondria no usa el O₂ y la extracción cae. No tranquiliza.`, s: ['[data-fila="ven"]'], c: C.sepMon },
      { t: (R) => `El gap de PCO₂ solo depende del flujo: ${R.gap} mmHg${R.gap < 6 ? ' (<6): hay flujo' : ' (≥6): el flujo no basta'}. La meta sigue siendo el lactato.`, s: ['[data-fila="gap"]', '#shv-lab'], c: C.gap }] },
  'septico-na': { tit: 'Shock séptico con noradrenalina', frase: (R, X) => `Noradrenalina a ${X.ajuste.na} µg/min: por encima de 10 manda el α; la IRVS sube a ${R.irvs} y la PAM a ${R.pam}.`, org: 'ficha · p. 12-13',
    guia: [{ t: 'Por debajo de 10 µg/min, la noradrenalina estimula β y puede subir el gasto.', s: ['[data-fila="ic"]'], c: C.na },
      { t: (R) => `Por encima de 10 manda el α: la arteriola se cierra (IRVS ${R.irvs}) y la PAM sube (${R.pam}).`, s: ['#cor-arteriola', '[data-fila="pa"]'], c: C.na },
      { t: 'A 30 µg/min, más dosis apenas aprieta: es el momento del segundo vasopresor.', s: ['[data-fila="pa"]'], c: C.na },
      { t: (R, X) => `En µg/kg/min: ${(X.ajuste.na / X.pac.peso).toFixed(2).replace('.', ',')} para sus ${X.pac.peso} kg. La Tabla 17.2 añade vasopresina con 0,25-0,5 e hidrocortisona con >0,25 (ver la nota).`, s: ['[data-fila="pa"]'], c: C.t172 }] },
  'cardio-pcp-baja': { tit: 'Shock cardiogénico con la PCP baja', frase: (R) => `IC ${c1(R.ic)} y PCP ${R.pcp}: la presión de llenado no está alta. El volumen aún puede subir el gasto, hasta una PCP de 18-20.`, org: 'ficha · p. 40, 42',
    guia: [{ t: (R) => `El VI apenas se vacía: IC ${c1(R.ic)}, por debajo de 2,2, lo típico del shock cardiogénico.`, s: ['#cor-cav', '[data-fila="ic"]'], c: C.csExc },
      { t: (R) => `La arteriola se cierra: IRVS ${R.irvs}. Es el simpático y la renina-angiotensina (Fig. 16.2).`, s: ['#cor-arteriola', '[data-fila="irvs"]'], c: C.f162 },
      { t: (R) => `Pero la PCP no está alta: ${R.pcp}. Pasa en hasta el 30 % de los shocks del infarto.`, s: ['[data-fila="pcp"]', '#tr-pap'], c: C.csExc },
      { t: 'El volumen todavía puede subir el gasto: la meta es la PCP más alta que lo suba sin edema, 18-20 (ver la nota de fuentes).', s: ['[data-fila="pcp"]'], c: C.llenado }] },
  'cardio-pcp-optima': { tit: 'Shock cardiogénico, PCP en 18-20', frase: (R) => `PCP ${R.pcp}: la presión de llenado óptima (18-20). Más volumen ya no subirá el gasto (IC ${c1(R.ic)}); toca vasopresor e inotrópico.`, org: 'ficha · p. 42-43',
    guia: [{ t: (R) => `La PCP está en ${R.pcp}: en la meta de 18-20.`, s: ['[data-fila="pcp"]'], c: C.llenado },
      { t: 'Por encima de ahí, más volumen apenas sube el gasto y encharca el pulmón.', s: ['[data-fila="ic"]'], c: C.llenado, org: 'que ya no suba: fisiología general' },
      { t: 'Vasopresor de elección: la noradrenalina. Y un inotrópico: la dobutamina.', s: ['[data-fila="pa"]'], c: C.csNa },
      { t: 'Los fármacos suben el trabajo del corazón que falla: si no basta, no retrases el soporte mecánico.', s: ['#shv-dock'], c: C.trabajo }] },
  posparo: { tit: 'Posparo: miocardio aturdido', frase: (R) => `IC ${c1(R.ic)}, PCP ${R.pcp} y PAM ${R.pam}: el VI está aturdido tras la parada. Suele recuperarse en 72 h; mientras, PAM de 75 o más.`, org: 'ficha · p. 65, 66-67',
    guia: [{ t: (R) => `El VI está aturdido: IC ${c1(R.ic)}. Es una disfunción sistólica y diastólica que puede llegar al shock cardiogénico en horas tras la RCE.`, s: ['#cor-cav', '[data-fila="ic"]'], c: C.posparo },
      { t: (R, X) => `Es una lesión de reperfusión: suele resolverse en 72 h. Ahora, ${Math.round(horasDePosparo(X.g))} h tras la RCE; mueve el reloj y mira cómo se recupera.`, s: ['#shv-dock'], c: C.posparo, org: 'el 72: ficha · la forma de la curva: ilustrativo' },
      { t: (R) => `La PCP (${R.pcp}) está cerca de la presión diastólica de la arteria pulmonar (${R.papd}): al nivel de ella, salvo que haya hipertensión pulmonar, donde queda por debajo.`, s: ['[data-fila="pcp"]', '#tr-pap'], c: C.pcpDiast, org: 'la relación: ficha (cap. 8); la diferencia de unos mmHg es del modelo' },
      { t: (R) => `Objetivo de PAM: de 75 o más en las primeras horas (Tabla 21.4); ahora ${R.pam}. El 65 habitual es del capítulo 14.`, s: ['[data-fila="pa"]'], c: C.t214 },
      { t: 'Si hace falta vasopresor, noradrenalina mejor que adrenalina: menos muertes cardiovasculares y mejor resultado neurológico.', s: ['#shv-dock'], c: C.t214 }] },
  'posparo-72': { tit: 'Posparo: a las 72 h', frase: (R) => `A las 72 h: IC ${c1(R.ic)}, PCP ${R.pcp}. El aturdimiento suele estar resuelto; si el shock sigue, ya no es solo aturdimiento.`, org: 'ficha · p. 65 (lo que sigue, la fuente no lo dice)',
    guia: [{ t: (R) => `Han pasado 72 h: el miocardio aturdido suele recuperarse. IC ${c1(R.ic)}, PCP ${R.pcp}.`, s: ['#cor-cav', '[data-fila="ic"]'], c: C.posparo },
      { t: 'Si a las 72 h sigue en shock, ya no es aturdimiento: la fuente no dice más. Busca otra causa.', s: ['#shv-dock'], c: C.posparo, org: 'la fuente solo da las 72 h; el resto no lo dice' },
      { t: (R) => `PAM ${R.pam} sin vasopresor: el objetivo de 75 o más era de las primeras horas.`, s: ['[data-fila="pa"]'], c: C.t214 }] },
  cardio: { tit: 'Shock cardiogénico', frase: (R) => `El corazón no bombea: IC ${c1(R.ic)}, PCP ${R.pcp} y la arteriola cerrada. Lo que lo separa de la IC es la hipoperfusión.`, org: 'ficha · p. 40',
    guia: [{ t: (R) => `El VI no bombea: IC ${c1(R.ic)}.`, s: ['#cor-cav', '[data-fila="ic"]'], c: C.csExc },
      { t: (R) => `Sube la presión de llenado del que falla: PCP ${R.pcp}${R.pcp > 20 ? ', por encima de 18-20' : ''}.`, s: ['[data-fila="pcp"]', '#tr-pap'], c: C.csHemo },
      { t: (R) => `La arteriola se cierra: IRVS ${R.irvs} (Fig. 16.2).`, s: ['#cor-arteriola', '[data-fila="irvs"]'], c: C.f162 },
      { t: 'Con la PCP por encima de 18-20 el pulmón se encharca: mira las gotas en el pulmón y la SpO₂.', s: ['#cor-pulmon', '[data-fila="spo2"]'], c: C.llenado, org: 'cuánto: el modelo' }] },
  'ic-etapa-1': { tit: 'IC izquierda, etapa 1', frase: (R) => `Etapa 1: la presión de llenado sube (PCP ${R.pcp}) y el volumen sistólico se mantiene (VS ${R.vs} mL, IC ${c1(R.ic)}), a costa de congestión del pulmón y disnea.`, org: 'ficha · p. 5 (las cifras: lectura de la Fig. 18.3 y modelo, ilustrativo)',
    guia: [{ t: (R) => `El signo más precoz de la disfunción del VI es que sube la presión de llenado telediastólica, la presión de enclavamiento: PCP ${R.pcp}.`, s: ['[data-fila="pcp"]', '#tr-pap'], c: C.icEtapas },
      { t: (R) => `El volumen sistólico se mantiene casi (${R.vs} mL) y el gasto también (IC ${c1(R.ic)}), pero a expensas de esa presión alta.`, s: ['[data-fila="vs"]', '[data-fila="ic"]'], c: C.icEtapas, org: 'las cifras: lectura de la Fig. 18.3 (p. 6) y modelo' },
      { t: 'La presión alta congestiona la circulación venosa del pulmón y da la sensación de disnea: el primer síntoma.', s: ['#cor-pulmon'], c: C.icEtapas },
      { t: (R) => `La FC apenas se mueve (${R.fc}): la taquicardia es de la etapa siguiente.`, s: ['[data-fila="fc"]', '#tr-ecg'], c: C.icEtapas }] },
  'ic-etapa-2': { tit: 'IC izquierda, etapa 2', frase: (R) => `Etapa 2: el volumen sistólico cae (VS ${R.vs} mL) y la FC sube (${R.fc}): la taquicardia lo compensa y el gasto se conserva (IC ${c1(R.ic)}).`, org: 'ficha · p. 5 (las cifras: lectura de la Fig. 18.3 y modelo, ilustrativo)',
    guia: [{ t: (R) => `El VI se vacía peor: el volumen sistólico baja (${R.vs} mL).`, s: ['#cor-cav', '[data-fila="vs"]'], c: C.icEtapas, org: 'las cifras: lectura de la Fig. 18.3 (p. 6) y modelo' },
      { t: 'Los barorreceptores notan el descenso del volumen sistólico y activan el simpático: más contractilidad, más frecuencia, vasoconstricción y activación del sistema renina-angiotensina-aldosterona.', s: ['#cor-arteriola'], c: C.icNeuro },
      { t: (R) => `La frecuencia sube: FC ${R.fc}.`, s: ['[data-fila="fc"]', '#tr-ecg'], c: C.icEtapas },
      { t: (R) => `La taquicardia compensa la caída del volumen sistólico: el gasto se conserva (IC ${c1(R.ic)}).`, s: ['[data-fila="ic"]'], c: C.icEtapas },
      { t: (R) => `La presión de llenado sigue alta (PCP ${R.pcp}): el pulmón, congestionado.`, s: ['[data-fila="pcp"]', '#cor-pulmon'], c: C.icEtapas }] },
  'ic-etapa-3': { tit: 'IC izquierda, etapa 3', frase: (R) => `Etapa 3: el gasto cae (IC ${c1(R.ic)}) y la presión de llenado sube más (PCP ${R.pcp}). Es el paso de IC compensada a descompensada; la PA se sostiene (PAM ${R.pam}).`, org: 'ficha · p. 5-7 (las cifras: lectura de la Fig. 18.3 y modelo, ilustrativo)',
    guia: [{ t: (R) => `El gasto cardíaco empieza a caer (IC ${c1(R.ic)}, VS ${R.vs} mL): el punto en que cae marca la transición de IC compensada a descompensada.`, s: ['[data-fila="ic"]', '[data-fila="vs"]'], c: C.icEtapas, org: 'las cifras: lectura de la Fig. 18.3 (p. 6) y modelo' },
      { t: (R) => `La presión de llenado sube aún más: PCP ${R.pcp}.`, s: ['[data-fila="pcp"]', '#tr-pap'], c: C.icEtapas },
      { t: (R) => `La vasoconstricción periférica basta para sostener la PA (PAM ${R.pam}) y la perfusión de los tejidos: mira la arteriola cerrada (IRVS ${R.irvs}).`, s: ['#cor-arteriola', '[data-fila="pa"]'], c: C.icCongestion },
      { t: 'Por eso las manifestaciones de la IC aguda descompensada son las de la congestión venosa, no las del bajo gasto: disnea, crepitantes y edema de pulmón.', s: ['#cor-pulmon', '[data-fila="spo2"]'], c: C.icCongestion },
      { t: 'El riñón sufre sobre todo por la presión venosa alta, no por el gasto: la autorregulación mantiene su flujo hasta que la PAM baja de 70.', s: ['[data-fila="pa"]'], c: C.autorreg }] },
  'ic-cpap': { tit: 'IC izquierda, etapa 3, con CPAP', frase: (R) => `Etapa 3 con CPAP: el gasto apenas cambia (VS ${R.vs} mL, IC ${c1(R.ic)}) y el edema crece más despacio que sin CPAP (${Math.round(R.edema)} mL, SpO₂ ${R.spo2} %). En el corazón que falla la CPAP no le quita gasto; en el seco, sí. Límite del modelo: Marino describe que el gasto puede subir (p. 83, 88); el modelo no lo reproduce.`, org: 'ficha · cap. 18, p. 14 y resp. p. 77, 83, 88 (las cifras: modelo, ilustrativo)',
    guia: [{ t: 'La presión positiva en el tórax baja la presión transmural que el VI desarrolla en sístole: es una menor poscarga, y la pared se mueve hacia dentro con más facilidad.', s: ['#cor-cav'], c: C.cpapIc },
      { t: (R) => `El corazón que falla está en la parte plana de la curva de precarga: perder algo de llenado le cuesta poco gasto (VS ${R.vs} mL, IC ${c1(R.ic)}) y bajar la poscarga le ayuda (resp. p. 88).`, s: ['[data-fila="vs"]', '[data-fila="ic"]'], c: C.cpapIc, org: 'la razón: ficha (resp. p. 88) · las cifras: modelo' },
      { t: 'La PCP del monitor sube con la CPAP porque la presión del tórax llega también al catéter; la presión transmural, la que de verdad encharca el pulmón, baja. No es un exceso de volumen.', s: ['[data-fila="pcp"]'], c: C.pcpPeep, org: 'que la PEEP eleva falsamente el enclavamiento: ficha (cap. 8, PDF p. 55); que la presión transmural es la fisiológicamente importante: ficha (misma p. 55). Que baje con la CPAP: el modelo (la fuente no lo dice). Las cifras: modelo' },
      { t: (R) => `El edema crece más despacio: la CPAP evita el colapso de las vías pequeñas y los alvéolos al final de la espiración (resp. p. 77) y es muy eficaz en el edema cardiogénico (resp. p. 83). Edema: ${Math.round(R.edema)} mL.`, s: ['#cor-pulmon', '[data-fila="spo2"]'], c: C.cpapIc, org: 'ficha (resp. p. 77, 83) · cuánto edema: modelo' },
      { t: 'En el paciente seco ocurre lo contrario: la misma presión le frena el retorno venoso y baja la precarga, y el gasto cae (resp. p. 85, 88). Pruébalo con un paciente hemorrágico, con la CPAP en 10.', s: ['#shv-dock'], c: C.cpapIc, org: 'ficha (resp. p. 85, 88)' },
      { t: 'Límite del modelo: Marino (p. 83, 88) y Bradley 1992 (PMID 1736745: +22 % de VS indexado con CPAP 5 en 11 pacientes con PCP ≥12; con PCP <12 el gasto bajó, IC 3,14→2,89) describen que el gasto del corazón que falla puede subir; el modelo no lo reproduce (el motivo es del autor: otros mecanismos del paciente real, como la retirada simpática, no están en el modelo). Tampoco mejora la SpO₂: el modelo no reproduce la apertura de los alvéolos que Marino atribuye a la CPAP (resp. p. 77).', s: ['[data-fila="vs"]', '[data-fila="ic"]'], c: C.cpapIc, org: 'límite del modelo' }] },
  'rotura-papilar': { tit: 'Rotura del músculo papilar', frase: (R) => `La sangre vuelve a la aurícula en cada sístole: IC ${c1(R.ic)}, PCP ${R.pcp} y SpO₂ ${R.spo2} %. Es una insuficiencia mitral aguda: el 7 % de los shocks del infarto, y llega en las primeras 24 h, no tarde.`, org: 'ficha · p. 38 (las cifras: modelo, ilustrativo)',
    guia: [{ t: 'El músculo papilar roto suelta la valva mitral: en la sístole la valva se va a la aurícula y la válvula no cierra. Es una insuficiencia mitral aguda, y amenaza la vida.', s: ['#cor-mitral'], c: C.papilar },
      { t: (R) => `Mira el chorro rojo: en cada sístole parte de la sangre del VI vuelve a la aurícula. Fracción regurgitante ${R.frmit} %.`, s: ['.cc-chorro', '[data-fila="frmit"]'], c: C.papilar, org: 'la fracción y su tamaño: modelo (fisiología general)' },
      { t: (R) => `La aurícula izquierda recibe ese chorro y la PCP se dispara: ${R.pcp}, a la altura de la diastólica de la arteria pulmonar (${R.papd}).`, s: ['[data-fila="pcp"]', '#tr-pap'], c: C.pcpDiast, org: 'el mecanismo: fisiología general · la relación PCP-diastólica: ficha (cap. 8) · cuánto: modelo' },
      { t: (R) => `El pulmón se encharca: SpO₂ ${R.spo2} %. Con la PCP por encima de 18-20 el líquido pasa al alvéolo.`, s: ['#cor-pulmon', '[data-fila="spo2"]'], c: C.llenado, org: 'umbral 18-20: ficha p. 42 · cuánto: modelo' },
      { t: (R) => `El gasto cae (IC ${c1(R.ic)}, por debajo de 2,2) aunque el VI se vacía: parte de lo que sale va hacia atrás. Por eso aparece en las primeras 24 h y no es una complicación tardía.`, s: ['[data-fila="ic"]'], c: C.roturas24 }] },
  'iam-vd': { tit: 'Infarto del ventrículo derecho', frase: (R) => `Falla el derecho: ${R.pvc > R.pcp ? `la PVC (${R.pvc}) sube más que la PCP (${R.pcp})` : `la PVC (${R.pvc}) aún no pasa a la PCP (${R.pcp})`} y el VD dilatado empuja el tabique. FEVI ${R.fevi} %, conservada. Tiene menos mortalidad que el fallo del VI.${R.lact < 2 && R.pam >= 65 ? ` IC ${coma2(R.ic, 1)} (<2,2) sin hipoperfusión aún: todavía no es shock (p. 40).` : ''} Partida: 1.250 mL de líquidos de urgencias (ilustrativo).`, org: 'ficha · p. 40 (las cifras: modelo, ilustrativo)',
    guia: [{ t: (R) => `El VD infartado no empuja: se dilata (su volumen telediastólico es ${coma2(R.vdvi, 1)} veces el del VI) y la PVC sube: ${R.pvc}.`, s: ['#cor-vd', '[data-fila="pvc"]'], c: C.vd, org: 'cuánto: modelo' },
      { t: (R) => `La PCP no sube igual: ${R.pcp}. Uno de los rasgos que lo identifican es el cociente PVC/PCP (${coma2(R.pvc / Math.max(1, R.pcp), 1)}), no una cifra suelta.`, s: ['[data-fila="pvc"]', '[data-fila="pcp"]'], c: C.vd },
      { t: (R) => `El VI casi no falla: FEVI ${R.fevi} %, conservada. Un VD dilatado con el VI normal es otro rasgo del fallo derecho.`, s: ['[data-fila="fevi"]', '#cor-cav'], c: C.vd, org: 'el valor: modelo' },
      { t: (R) => `El VD dilatado empuja el tabique hacia la cámara del VI: el VI se llena menos y el gasto cae (IC ${c1(R.ic)}).`, s: ['#cor-tabique', '[data-fila="ic"]'], c: C.vd },
      { t: 'El shock por fallo del VD tiene menos mortalidad que el del VI. Los 1.250 mL de líquidos con que llega son de partida, no del mando: una carga de volumen del modelo; el diagnóstico y el manejo del fallo derecho están en el capítulo 18 y aquí no se simulan.', s: ['#shv-dock'], c: C.vd, org: 'los líquidos del servicio de urgencias: ilustrativo (la fuente no da la cifra)' }] },
  'rotura-septo': { tit: 'Rotura del tabique interventricular', frase: (R) => `Parte de cada latido vuelve al VD: Qp/Qs ${coma2(R.qpqs, 1)}, saturación ${R.satAd} % en la AD y ${R.satAp} % en la AP. ${R.pcp > 20 ? 'El pulmón se encharca' : 'El pulmón recibe todo ese flujo'} y la aorta se queda sin él (IC ${c1(R.ic)}).`, org: 'ficha · p. 38 (las cifras: modelo, ilustrativo)',
    guia: [{ t: 'El tabique roto abre un paso entre el VI, de presión alta, y el VD, de presión baja: en cada latido pasa sangre de izquierda a derecha. Es un gran shunt izquierda-derecha.', s: ['#cor-tabique'], c: C.septo, org: 'la dirección: ficha · por qué va a la derecha (presión): fisiología general' },
      { t: (R) => `El VD recibe más: Qp/Qs ${coma2(R.qpqs, 1)}. Por el pulmón pasa ${coma2(R.qpqs, 1)} veces lo que sale por la aorta.`, s: ['[data-fila="qpqs"]'], c: C.septo, org: 'el cociente: modelo (su definición, fisiología general)' },
      { t: (R) => `Esa sangre llega oxigenada: la saturación sube de ${R.satAd} % en la AD a ${R.satAp} % en la AP. El salto de saturación es la huella del cortocircuito.`, s: ['[data-fila="satad"]', '[data-fila="satap"]'], c: C.septo, org: 'el salto: fisiología general · el umbral numérico: la fuente no lo dice · las cifras: modelo' },
      { t: (R) => `El pulmón recibe ese flujo de más: ${coma2(R.qpqs, 1)} veces el de la aorta. La PCP sigue alta, ${R.pcp}${R.pcp > 20 ? ', por encima de 18-20: el pulmón se encharca' : ''} (PAP ${R.paps}/${R.papd}). Modelo: la PCP queda algo por debajo de la de antes de la rotura porque el VI se descarga hacia el VD; esa caída no la dice la fuente.`, s: ['[data-fila="qpqs"]', '[data-fila="pcp"]', '#cor-pulmon'], c: C.septo, org: 'inunda la circulación pulmonar: ficha p. 38 · el umbral 18-20: ficha p. 42 · las cifras y la caída de la PCP: modelo' },
      { t: (R) => `La aorta se queda sin ese flujo: IC ${c1(R.ic)}, PAM ${R.pam}. La FEVI (${R.fevi} %) cuenta lo que el VI expulsa a la aorta y al VD.`, s: ['[data-fila="ic"]', '[data-fila="fevi"]'], c: C.septo, org: 'la FEVI por volúmenes: fisiología general' }] },
  tapon: { tit: 'Taponamiento', frase: (R) => `El líquido del saco no deja llenarse al corazón: PVC ${R.pvc} y PCP ${R.pcp} se igualan. La eco lo separa del fallo del VD.`, org: 'ficha · p. 3; cap. 18, p. 4',
    guia: [{ t: 'La disección tipo A puede propagarse hacia atrás y sangrar al pericardio: taponamiento.', s: ['#cor-saco'], c: C.disec },
      { t: (R) => `El líquido no deja llenarse al corazón: shock obstructivo, con el patrón del cardiogénico (PVC ${R.pvc}, IC ${c1(R.ic)}, IRVS ${R.irvs}).`, s: ['[data-fila="pvc"]', '[data-fila="ic"]'], c: C.t141 },
      { t: (R) => `PVC ${R.pvc} y PCP ${R.pcp}: se igualan. También pasa cuando falla el VD: lo separa la eco.`, s: ['[data-fila="pvc"]', '[data-fila="pcp"]'], c: C.vdMed },
      { t: 'El tratamiento va a la causa. El balón está contraindicado en la disección.', s: ['#cor-saco'], c: C.iabp }] },
  'tep-alto': { tit: 'TEP de alto riesgo', frase: (R) => `El VD no puede con el émbolo: PVC ${R.pvc}, PCP ${R.pcp} y PAM ${R.pam}. Noradrenalina para la PA; volumen con cautela: el tope de 500 mL de la ficha es para la PVC normal (4-6).`, org: 'ficha · cap. 22, p. 7, 10-11',
    guia: [{ t: 'El VD está dilatado y la paciente ya está inestable: TEP de alto riesgo (masivo).', s: ['#cor-vd'], c: C.tepRiesgo },
      { t: (R) => `La PVC (${R.pvc}) supera a la PCP (${R.pcp}): falla el derecho.`, s: ['[data-fila="pvc"]', '[data-fila="pcp"]'], c: C.vdMed },
      { t: (R) => `La presión pulmonar sube (${R.paps}/${R.papd}): mira la curva de la AP.`, s: ['#tr-pap'], c: C.tepEco, org: 'cuánto: el modelo' },
      { t: 'Taquicardia, taquipnea e hipoxemia: lo típico, pero ninguna confirma ni descarta. El 30 % tiene la PaO₂ normal.', s: ['[data-fila="fc"]', '[data-fila="fr"]'], c: C.tepClin },
      { t: 'Para la hipotensión, noradrenalina: no sube la resistencia pulmonar. Volumen: la ficha pone el tope de 500 mL con la PVC normal (4-6), y aquí está alta; guíalo con la eco.', s: ['[data-fila="pa"]'], c: C.tepHemo }] },
  'tep-intermedio': { tit: 'TEP con el VD sobrecargado, sin shock', frase: (R) => `PAM ${R.pam}: aún sin inestabilidad. Con el VD sobrecargado es el riesgo intermedio; el alto riesgo exige inestabilidad.`, org: 'ficha · cap. 22, p. 7',
    guia: [{ t: 'El VD se dilata contra el émbolo.', s: ['#cor-vd'], c: C.tepEco },
      { t: (R) => `PAM ${R.pam}: sin inestabilidad hemodinámica no es el alto riesgo.`, s: ['[data-fila="pa"]'], c: C.tepRiesgo },
      { t: 'Sube la gravedad del émbolo para ver el paso al alto riesgo.', s: ['#shv-dock'], c: C.tepRiesgo }] },
  'sobrecarga': { tit: 'Sobrecarga de volumen', frase: (R) => `${R.pcp >= TOPES.pcp ? `PCP ${R.pcp}: pasa el techo de 18-20` : `PVC ${R.pvc}, ${R.pvc - R.pvc0} más que al llegar: las venas ya no admiten más`} y más volumen no sube el gasto (IC ${c1(R.ic)})${R.edema > 50 ? `; ${Math.round(R.edema).toLocaleString('es-ES')} mL de edema en el pulmón (SpO₂ ${R.spo2} %)` : ''}. Los botones de volumen se apagan.`, org: (R) => R.pcp >= TOPES.pcp ? 'ficha · p. 42 (PCP 18-20) y p. 11' : 'ficha · p. 42 y p. 11 · el 12 de PVC: fisiología general',
    guia: [{ t: (R) => R.pcp >= TOPES.pcp ? `PCP ${R.pcp}: pasa el techo de la presión de llenado de la ficha (18-20).` : `PCP ${R.pcp}: aún por debajo del techo de 18-20 de la ficha.`, s: ['[data-fila="pcp"]'], c: C.llenado },
      { t: (R) => `PVC ${R.pvc} (entró con ${R.pvc0}): la PVC predice mal si más volumen subirá el gasto (Marik 2008 y 2013); el 12 es del modelo.`, s: ['[data-fila="pvc"]'], c: C.llenado, org: 'el 12: ilustrativo · Marik 2008 (PMID 18628220), 2013 (PMID 23774337)' },
      { t: (R) => `El gasto no mejora (IC ${c1(R.ic)}): pasado el techo, más volumen no sube el gasto.`, s: ['[data-fila="ic"]'], c: C.llenado },
      { t: 'Mira el pulmón: con la PCP por encima de 18 se encharca (gotas) y la SpO₂ baja.', s: ['#cor-pulmon', '[data-fila="spo2"]'], c: C.llenado, org: 'cuánto: el modelo' },
      { t: 'Pasa el reloj: 3/4 del cristaloide se van al intersticio y los botones vuelven a encenderse.', s: ['[data-pest="reloj"]'], c: C.volIni }] },
  'hemo-tope': { tit: 'Repuesto más de lo perdido', frase: (R, X) => `Has dado ${(X.infundido.cris + X.infundido.sangre).toLocaleString('es-ES')} mL: más de 1,5 veces lo perdido (≈ ${perdidoMl(X.pac, R).toLocaleString('es-ES')} mL, ${R.perdida} % de la volemia). Los botones de volumen se apagan.`, org: 'ficha · p. 21-23 (la volemia) · el ×1,5: ilustrativo',
    guia: [{ t: (R, X) => `Perdió ${R.perdida} % de la volemia: ≈ ${perdidoMl(X.pac, R).toLocaleString('es-ES')} mL (${mlKg(X.pac)} mL/kg × ${X.pac.peso} kg).`, s: ['#cor-cav'], c: C.volemia },
      { t: 'La sangre repone hematíes y volumen; el cristaloide, solo volumen, y 3/4 se van al intersticio.', s: ['[data-pest="vol"]'], c: C.volIni },
      { t: (R) => `PVC ${R.pvc} y PCP ${R.pcp}: reponer más de lo perdido solo sobrecarga.`, s: ['[data-fila="pvc"]', '[data-fila="pcp"]'], c: C.t151, org: 'el tope ×1,5: ilustrativo' }] },
  'hipertension-vaso': { tit: 'Hipertensión por vasopresor', frase: (R, X) => `PAM ${R.pam} con ${X.ajuste.na ? `noradrenalina a ${X.ajuste.na} µg/min` : 'vasopresina'}${X.ajuste.na && X.ajuste.vaso ? ' y vasopresina' : ''}: este paciente no estaba en shock y el vasopresor lo pasa de largo. Baja la dosis.`, org: 'ficha · p. 12-13 (el fármaco) · el 110: fisiología general',
    guia: [{ t: (R) => `PAM ${R.pam}: pasa de 110 (fisiología general). El objetivo del shock es 65 o más, no más.`, s: ['[data-fila="pa"]'], c: C.na, org: 'el 110: fisiología general' },
      { t: 'El vasopresor aprieta las arteriolas aunque no haga falta: la resistencia sube y el corazón empuja contra más carga.', s: ['[data-fila="irvs"]'], c: C.na },
      { t: 'Baja la dosis en la pestaña Fármacos hasta que la PAM vuelva a su sitio.', s: ['[data-pest="far"]'], c: C.na }] },
  'tep-bolo': { tit: 'TEP: tope de 500 mL', frase: (R) => `Ya van 500 mL o más: el VD que no puede se dilata, empuja el tabique y el VI se llena menos. IC ${c1(R.ic)}. Los botones de volumen se apagan.`, org: 'ficha · cap. 22, p. 10',
    guia: [{ t: 'El VD dilatado empuja el tabique hacia el VI.', s: ['#cor-vd', '#cor-tabique'], c: C.tepHemo },
      { t: (R) => `El gasto no sube (IC ${c1(R.ic)}): por eso el volumen se limita a 500 mL y se guía con la eco.`, s: ['[data-fila="ic"]'], c: C.tepHemo }] },
  balon: { tit: 'Balón de contrapulsación', frase: (R) => `Se hincha al cerrarse la aórtica y empuja la sangre a las coronarias; se vacía antes de que se abra: el VI eyecta contra menos presión. PAM ${R.pam}.`, org: 'ficha · p. 45-46',
    guia: [{ t: 'El balón va en la aorta descendente, con la punta justo por debajo de la subclavia izquierda; 35-40 mL de helio.', s: ['.p-balon'], c: C.iabp },
      { t: 'La onda R del ECG dispara el ciclo: mira la chispa en la tira.', s: ['#tr-ecg'], c: C.iabp },
      { t: 'Se hincha al empezar la diástole, al cerrarse la aórtica: la segunda joroba de la curva arterial. Sube el pico diastólico y la PAM.', s: ['#tr-art'], c: C.f163 },
      { t: 'Se vacía en la contracción isovolumétrica: la presión cae justo antes de que se abra la aórtica. La punteada es la curva sin balón.', s: ['#tr-art'], c: C.f163 },
      { t: 'No mejora la supervivencia. Está contraindicado con insuficiencia aórtica o disección.', s: ['.p-balon'], c: C.iabp }] },
  'balon-1a2': { tit: (R, X) => X.ajuste.razon === 2 ? 'Balón 1:2: un latido sí, otro no' : `Balón 1:${X.ajuste.razon}: un latido de cada ${X.ajuste.razon}`, frase: (R, X) => `El balón asiste un latido de cada ${X.ajuste.razon}: el asistido (A) tiene aumento ${R.picoDia ?? '—'} y telediastólica ${R.teleDia ?? '—'}; el no asistido (n), pico ${R.picoNo ?? '—'} y telediastólica ${R.teleNo ?? '—'}. PAM ${R.pam}.`, org: 'ficha · p. 45-46 · las cifras: modelo',
    guia: [{ t: 'La consola dibuja la presión arterial con dos clases de latido seguidos: A (asistido) y n (no asistido). Mira las letras bajo cada diástole.', s: ['#iabp-svg .lat'], c: C.iabp, org: 'la comparación: modelo' },
      { t: (R) => `En el latido A el balón se hincha al cerrarse la aórtica y la meseta sube a ${R.picoDia ?? '—'} mmHg: es el aumento diastólico.`, s: ['#iabp-meseta'], c: C.iabp, org: 'el valor: modelo' },
      { t: (R) => `En el latido n no hay balón: la diástole baja sin aumento (pico ${R.picoNo ?? '—'}). Compara las dos mesetas.`, s: ['#iabp-svg .lat.no'], c: C.iabp, org: 'el valor: modelo' },
      { t: (R) => `Al final del latido A el balón se vacía antes de la sístole: la telediastólica baja (${R.teleDia ?? '—'} frente a ${R.teleNo ?? '—'}). El libro dice que la presión aórtica cae al abrirse la válvula y que baja la poscarga; la cifra del descenso (pequeña) es del modelo. Nota de fidelidad: el texto (p. 45) desinfla «al inicio de la sístole, en la contracción isovolumétrica»; el pie de la Fig. 16.3 dice «en la diástole tardía».`, s: ['#iabp-tel'], c: C.iabp, org: 'la cifra: modelo' }] },
  impella: { tit: 'Impella', frase: (R) => `La hélice saca ${c1(R.imp)} L/min del VI a la aorta sin esperar a la sístole: el VI se vacía y la PCP baja a ${R.pcp}. El corazón da ${c1(R.icNat * 1.85)}; el gasto total, ${c1(R.gcTotal)} L/min.`, org: 'ficha · p. 47-48',
    guia: [{ t: 'Un catéter entra por la arteria femoral y cruza la válvula aórtica: la punta en «pigtail» queda en el VI.', s: ['.p-pigtail', '.p-canula'], c: C.f164 },
      { t: 'La hélice gira dentro de la jaula y crea un flujo no pulsátil: aspira por la entrada y suelta en la aorta (giro ralentizado).', s: ['.p-jaula', '.p-entrada'], c: C.impella },
      { t: (R) => `La consola da ${c1(R.imp)} L/min de la bomba y ${c1(R.icNat * 1.85)} del corazón. El modelo con gasto total ajusta la bomba solo.`, s: ['.maquina', '[data-fila="ic"]'], c: C.impella },
      { t: (R) => `Descarga el VI: la PCP baja (${R.pcp}) y la curva arterial se estrecha. Con soporte, la PCP de 18-20 deja de ser la meta.`, s: ['[data-fila="pcp"]', '#tr-art'], c: C.impellaEf, org: 'la forma: fisiología general' },
      { t: 'Hemólisis significativa en el 5-10 %; contraindicado con valvulopatía o prótesis aórtica y con trombo en el VI.', s: ['.p-jaula'], c: C.impellaEf }] },
  'impella-vacio': { tit: 'Impella: el VI está casi vacío', frase: (R) => `La bomba pide ${c1(R.impPide)} L/min pero solo saca ${c1(R.imp)}: no puede sacar del VI la sangre que no le llega. El gasto total se queda en ${c1(R.gcTotal)} L/min. Primero, el llenado: PCP 18-20.`, org: 'ficha · p. 42, 47-48',
    guia: [{ t: (R) => `La bomba aspira del VI. Pides ${c1(R.impPide)} L/min y saca ${c1(R.imp)}: la consola lo marca.`, s: ['#shv-consola', '.p-entrada'], c: C.impella },
      { t: (R) => `Al VI le llega poca sangre: PCP ${R.pcp}. Sin llenado, la entrada se queda sin sangre que sacar.`, s: ['[data-fila="pcp"]', '.p-entrada'], c: C.llenado, org: 'que la bomba no saque lo que no hay: fisiología general' },
      { t: 'Por eso el gasto total apenas sube. La ficha pide antes la presión de llenado óptima, 18-20: dale volumen y vuelve a mirar la consola.', s: ['[data-pest="vol"]', '[data-fila="ic"]'], c: C.llenado },
      { t: 'Con el VI lleno, el Impella descarga el VI y sube el gasto (p. 48).', s: ['#shv-consola'], c: C.impellaEf }] },
  'impella-alto': { tit: 'Impella: la aórtica ya no abre', frase: (R) => `La bomba (${c1(R.imp)} L/min) se lleva toda la sangre que llega al VI: la aórtica no se abre y el pulso desaparece de la curva (${R.pas}/${R.pad}).`, org: 'ficha · p. 47; la curva: fisiología general',
    guia: [{ t: 'Con un VI débil o poco lleno, la bomba se lleva toda la sangre que llega.', s: ['.p-entrada', '.p-jaula'], c: C.impella },
      { t: (R) => `El VI no llega a la presión de la aorta: la válvula no se abre (${R.aoAbre} de ${R.aoDe} latidos).`, s: ['#tr-art', '.p-canula'], c: C.impella, org: 'fisiología general' },
      { t: (R) => `La curva arterial se aplana: ${R.pas}/${R.pad}. La PAM se sostiene con flujo continuo.`, s: ['#tr-art', '[data-fila="pa"]'], c: C.impella, org: 'fisiología general' }] },
  ecmo: { tit: 'ECMO venoarterial', frase: (R) => `La bomba saca sangre de la cava, el oxigenador la vuelve roja y la devuelve por la femoral: ${c1(R.ecmo)} L/min contra corriente. El VI aún abre (${R.aoAbre} de ${R.aoDe}) y la SpO₂ del monitor es una mezcla (ver la nota).`, org: 'ficha · p. 48-49; la SpO₂: fisiología general (la ficha no la trata)',
    guia: [{ t: 'La cánula venosa sube por la cava inferior hasta cerca de la AD.', s: ['.p-canula-v'], c: C.ecmo },
      { t: 'La bomba centrífuga crea el flujo; el oxigenador saca el CO₂ y mete el O₂; el calentador la devuelve a 37 °C (Fig. 16.5).', s: ['.p-bomba', '.p-oxigenador', '.p-calentador'], c: C.f165 },
      { t: 'La sangre vuelve por la arteria femoral y sube por la aorta al revés, para llegar al cayado y al cerebro.', s: ['.p-canula-a'], c: C.ecmo },
      { t: 'Soporta los dos ventrículos y el intercambio de gases: es la elección si hay fallo respiratorio.', s: ['[data-fila="spo2"]'], c: C.seleccion }] },
  'ecmo-carga': { tit: 'ECMO: el VI carga contra la aorta', frase: (R) => `El chorro que sube por la aorta frena al VI: aún abre (${R.aoAbre} de ${R.aoDe}), pero eyecta poco (${R.icNat * 1.85 < 0.15 ? 'casi nada' : (R.icNat * 1.85).toFixed(1).replace('.', ',') + ' L/min'}) y la PCP sube a ${R.pcp}. Si sigue, hay que ventearlo.`, org: 'ficha · p. 48-49',
    guia: [{ t: 'El flujo retrógrado sube la poscarga del VI: un problema que no tienen los otros soportes.', s: ['.p-canula-a', '#tr-art'], c: C.ecmoPoscarga },
      { t: (R) => `El VI aún abre su válvula (${R.aoAbre} de ${R.aoDe} latidos), pero saca poca sangre: la consola lo separa del flujo del ECMO.`, s: ['#shv-consola', '#ecm-corazon'], c: C.ecmoPoscarga },
      { t: (R) => `La PCP sube: ${R.pcp}. Mira la curva de la AP.`, s: ['[data-fila="pcp"]', '#tr-pap'], c: C.ecmoPoscarga, org: 'cuánto: el modelo' },
      { t: 'Si el VI deja de abrir y aparece el edema, se ventea: un balón o un Impella a la vez, o drenando el VI.', s: ['#shv-mandos'], c: C.ecmoPoscarga }] },
  'ecmo-cerrada': { tit: 'ECMO: el VI ya no abre', frase: (R) => `El chorro que sube por la aorta frena al VI débil: la aórtica abre ${R.aoAbre} de ${R.aoDe} veces, la PCP sube a ${R.pcp} y el pulmón se encharca. Hay que ventearlo.`, org: 'ficha · p. 48-49',
    guia: [{ t: 'El flujo retrógrado sube la poscarga del VI: un problema que no tienen los otros soportes.', s: ['.p-canula-a', '#tr-art'], c: C.ecmoPoscarga },
      { t: (R) => `El VI no puede abrir su válvula: ${R.aoAbre} de ${R.aoDe} latidos. Se dilata.`, s: ['#ecm-corazon'], c: C.ecmoPoscarga },
      { t: (R) => `La PCP sube (${R.pcp}) y aparece el edema: mira las gotas en el pulmón.`, s: ['[data-fila="pcp"]', '#ecm-frente .pulmon'], c: C.ecmoPoscarga, org: 'cuánto: el modelo' },
      { t: 'Se corrige con un balón o un Impella a la vez, o drenando el VI («venteo»): prueba el mando.', s: ['#shv-mandos'], c: C.ecmoPoscarga }] },
  'ecmo-vacio': { tit: 'ECMO: la bomba no llega', frase: (R) => `Pides ${c1(R.ecmoPide)} L/min y la bomba saca ${c1(R.ecmo)}: ${R.pvc <= 3 ? `la cánula venosa aspira de unas venas casi vacías (PVC ${R.pvc})` : `vence una aorta a presión (PAM ${R.pam})`}. Una bomba centrífuga solo da lo que le llega.`, org: 'ficha · p. 48; cuánto pierde: el modelo',
    guia: [{ t: (R) => `La consola separa lo pedido (${c1(R.ecmoPide)}) de lo que sale (${c1(R.ecmo)}).`, s: ['#shv-consola'], c: C.ecmo },
      { t: (R) => R.pvc <= 3 ? `PVC ${R.pvc}: la cánula no encuentra sangre en la cava. Dale volumen (pestaña Volumen) y vuelve a mirar.` : `PAM ${R.pam}: cuanta más presión tiene que vencer, menos flujo da la bomba a las mismas vueltas.`, s: ['[data-fila="pvc"]', '.p-canula-v', '[data-pest="vol"]'], c: C.f165, org: 'la física de la bomba: fisiología general' },
      { t: 'La fuente da el flujo máximo (5-6 L/min) y no la curva de la bomba: cuánto pierde lo calcula el modelo.', s: ['#shv-consola'], c: C.ecmo }] },
  'ecmo-venteo': { tit: 'ECMO con venteo', frase: (R, X) => `Venteo con ${({ impella: 'Impella', balon: 'balón', drenaje: 'drenaje del VI' })[X.ajuste.venteo]}: la PCP baja a ${R.pcp} y la aórtica abre ${R.aoAbre} de ${R.aoDe}.`, org: 'ficha · p. 48-49',
    guia: [{ t: 'Para bajar la poscarga del VI: un balón o un Impella a la vez, o drenar el VI para bajar su presión telediastólica.', s: ['#ecm-venteo', '#shv-mandos'], c: C.ecmoPoscarga },
      { t: (R) => `La PCP baja: ${R.pcp}.`, s: ['[data-fila="pcp"]'], c: C.ecmoPoscarga, org: 'cuánto: el modelo' },
      { t: 'Cuánto baja con cada método no lo dice la fuente: el modelo lo calcula, rotulado.', s: ['[data-fila="pcp"]'], c: C.ecmoPoscarga }] },
  'soporte-no': { tit: 'Este paciente no lleva soporte mecánico', frase: (R, X) => indicacion(X.pac, X.aparato).txt, org: 'ficha · p. 45-48',
    guia: [{ t: (R, X) => indicacion(X.pac, X.aparato).txt, s: ['#shv-sello'], c: C.mcs },
      { t: 'Mira el aparato en gris: funciona igual en otro paciente (el del infarto). Ábrelo con Aurelio.', s: ['#shv-esc-svg'], c: C.mcs }] },
};

// ---------------------------------------------------------------- notas (con su tipo) y «Para profundizar»
export const NOTAS = [
  { k: 'ic-fig-18-3', tipo: 'calla', txt: '<b>Las cifras de la Fig. 18.3.</b> La figura (p. 6) es de «un paciente postoperatorio» (datos de observación personal del autor) y sus curvas no cuadran entre sí (un VS de 60 mL con FC 80 da 4,8 L/min, no un IC de 3,5 con una superficie normal). El texto (p. 5) solo da la dirección de cada etapa. Los cortes entre etapas (IC 3,0 y FC 90) y los números de Ramiro son del modelo: ilustrativos; el motor da un VS más alto y un IC algo menor que la figura.', citas: [C.icFig, C.icEtapas] },
  { k: 'clase-cortes', tipo: 'calla', txt: '<b>Los cortes de FC y PA por clase.</b> La Tabla 15.1 de Marino (p. 22) da el % de volemia perdido y solo flechas para la FC (↔, ↑, ↑↑, ↑↑↓) y la PA (↔, ↔↓, ↓, ↓↓). Las cifras con que el modelo nombra la clase de cada paciente (FC 95, 120 y 140; PAS 90 y 70) son ilustrativas, no de la ficha. En la práctica, la FC y la PAS cambian menos que esta tabla: en traumatismos graves la FC mediana pasó de 82 (clase 1 estimada) a 95 (clase 4) y la PAS de 135 a 120 (' + PM(21349628, 'Guly 2011') + '); solo el 9,3 % de los traumatizados encajó en una clase ATLS (' + PM(25284231, 'Mutschler 2014') + ').', citas: [C.t151] },
  { k: 'impella-fuentes', tipo: 'discrepan', txt: '<b>¿Qué bomba lleva el Impella?</b> Marino la llama «bomba centrífuga miniatura» y da 2,5-5,5 L/min según el catéter (p. 47). La Guía ESC 2026 de IC de la app habla de «bombas de flujo microaxial (hasta 4-5,5 l/min)». El dibujo enseña la hélice que describen las dos; el nombre del tipo de bomba no se elige.', citas: [C.impella, C.escMcs] },
  { k: 'scvo2-fuentes', tipo: 'discrepan', txt: '<b>ScvO₂ objetivo.</b> Marino (Tabla 14.5): ScvO₂ >50 %. El Manual UMI, para el shock séptico en sus 6 primeras horas: ScvO₂ ≥70 % (o SvO₂ ≥65 %). El monitor enseña las dos y no elige.', citas: [C.t145, C.umi6h] },
  { k: 'pam-fuentes', tipo: 'discrepan', txt: '<b>PAM objetivo.</b> Marino: ≥65 mmHg (Tabla 14.5). El Manual UMI: TAM ≥65-70 mmHg en el séptico. El monitor marca con ≥65 y lo dice. Tras una parada, Marino sube el objetivo a ≥75 en las primeras horas (Tabla 21.4, p. 66-67): con Virginia, el monitor marca con ≥75.', citas: [C.t145, C.umi6h, C.t214] },
  { k: 'pcp-fuentes', tipo: 'discrepan', txt: '<b>PCP óptima.</b> La Tabla 16.2 da 19-20 mmHg; el texto de la misma página, 18-20. El monitor da por buena 18-20 y lo dice.', citas: [C.t162] },
  { k: 'hidrocortisona', tipo: 'discrepan', txt: '<b>Hidrocortisona y vasopresina en el séptico.</b> La Tabla 17.2 pide hidrocortisona con noradrenalina «>0,25 µg/kg/min»; el texto, «≥0,25». Para la vasopresina, la p. 15 dice «≥0,2» y la Tabla 17.2, «0,25-0,5».', citas: [C.t172, C.vasopresina] },
  { k: 'vasopresina-u', tipo: 'errata', txt: '<b>Unidad de la vasopresina.</b> El libro imprime «U/h» (Tabla 14.4, p. 13; p. 16). El mando usa 0,03 U/min, la dosis habitual (conocimiento general, no del libro).', citas: [C.vasopresina] },
  { k: 'pcp-soporte', tipo: 'calla', txt: '<b>La PCP con soporte mecánico.</b> La Tabla 16.2 es la presión de llenado para dar volumen; el Impella y el balón descargan el VI a propósito (p. 45, 48). La fuente no da una PCP objetivo con soporte: con un aparato, la fila de la PCP deja de marcarse.', citas: [C.t162, C.impellaEf] },
  { k: 'cuanto', tipo: 'calla', txt: '<b>Cuánto mueve cada mando.</b> La ficha da la dirección (la noradrenalina sube la RVS, el balón sube la PAM, el ECMO sube la poscarga del VI), no cuánto. Las cifras salen del motor del latido de la app: son del modelo.', citas: [C.mcs] },
  { k: 'onda-r', tipo: 'calla', txt: '<b>El disparo del balón.</b> La fuente dice que la onda R «es un disparador habitual» y que el inflado empieza al cerrarse la aórtica (p. 45). Cómo convierte la consola la onda R en el momento del inflado, no lo dice. En el modelo, el balón sigue las fases del motor.', citas: [C.iabp] },
  { k: 'pide-fuente', tipo: 'calla', txt: '<b>Lo que no se dibuja.</b> Marino no da las rpm ni los niveles de la bomba del Impella, su sensor de presión ni su purga; la presión del helio ni la relación 1:2 del balón; ni el gas de barrido, la saturación de salida o la cánula de reperfusión del ECMO. No salen en los aparatos hasta tener fuente.', citas: [C.impella, C.ecmo] },
  { k: 'spo2-ecmo', tipo: 'calla', txt: '<b>La SpO₂ con el ECMO.</b> El monitor enseña la mezcla: lo que eyecta el VI (y saca el Impella) con la saturación del pulmón, y lo que devuelve el oxigenador al 98 % (ilustrativo). Dónde se mide y que la sangre del oxigenador, que sube por la aorta al revés, no llegue igual a todo el cuerpo no lo dice Marino. Lo describe la revisión de ' + PM(40927093, 'Torre y Pirri 2025') + ': en el ECMO venoarterial (síndrome de Arlequín) compiten dos flujos, el retrógrado oxigenado del ECMO y la sangre mal oxigenada que eyecta el corazón nativo, y se vigila con la presión arterial en la radial derecha y gasometrías en varios puntos. Que el brazo derecho lea la sangre del pulmón enfermo es una inferencia de fisiología general. El 98 % del oxigenador es ilustrativo.', citas: [C.ecmo, C.seleccion] },
  { k: 'autor', tipo: 'autor', txt: '<b>¿La hipotensión causa el shock?</b> El autor plantea que sería una consecuencia y no su causa (p. 18). Es su opinión; las tablas siguen pidiendo una PAM ≥65.', citas: [C.opinion] },
];
export const NOTA_TIPO = { discrepan: ['Las fuentes discrepan', ''], calla: ['La fuente no lo dice', 'calla'], autor: ['Opinión del autor', 'autor'], errata: ['Errata de dosis', 'errata'] };
export const PROFUNDIZAR = [
  { t: 'Los resultados: un 42 % de supervivencia al alta con ECMO VA en el mayor registro; comparaciones con el balón o los LVAD, inconsistentes.', c: C.resultados },
  { t: 'Cómo elegir el aparato: según la disponibilidad del hospital; ECMO VA si hay fallo respiratorio; traslado si no mejora.', c: C.seleccion },
  { t: 'El Impella para el VD (RVAD) y su uso largo en el fallo terminal del VI.', c: C.impellaEf },
  { t: 'Las complicaciones del ECMO: sangrado mayor 41 %, sepsis 30 %, isquemia de la pierna 17 %, síndrome compartimental 10 %, ictus 6 %, amputación 5 %.', c: C.ecmo },
  { t: 'Milrinona y levosimendán en el shock cardiogénico.', c: C.milri },
  { t: 'Las recomendaciones graduadas del soporte mecánico y el Shock Team (Guía ESC 2026, otra fuente de la app).', c: C.escMcs },
];

// ---------------------------------------------------------------- «¿Qué shock es?»: 11 pacientes, se barajan 10
// Sin nombre, edad ni sexo hasta contestar (la edad delataba al paciente). Tres tiempos: cabecera → eco → catéter.
export const QS = [
  { pac: 'mateo', tipo: 'hemo', g: 0.62 },
  { pac: 'mateo', tipo: 'hemo', g: 0.9 },
  { pac: 'amparo', tipo: 'septico', g: 0.85 },
  { pac: 'amparo', tipo: 'septico', g: 1 },
  { pac: 'begona', tipo: 'septico', esc: 'anafilaxia', g: 1, real: 'Begoña: anafilaxia (distributivo)', peso: 65 },
  { pac: 'aurelio', tipo: 'cardio', g: 0.75 },
  { pac: 'aurelio', tipo: 'cardio', g: 0.92, volemia: 0, real: 'Aurelio, horas después: shock cardiogénico con la PCP alta' },
  { pac: 'joaquin', tipo: 'tapon', g: 0.85 },
  { pac: 'consuelo', tipo: 'tep', g: 0.95 },
  // sin shock: PAM ~82 y lactato normal (con el defecto del motor, g ≈ 0,93, la PAM es 67 pero el lactato ya sube)
  { pac: 'consuelo', tipo: 'no', g: 0.6, real: 'Consuelo, hora 0: TEP con el VD sobrecargado, sin shock' },
  { pac: 'nerea', tipo: 'septico', esc: 'sepsis', g: 0.9, real: 'Nerea: shock tóxico estreptocócico (distributivo)', peso: 60 },
];
export const OPC_QS = [['hemo', 'Hipovolémico'], ['septico', 'Distributivo'], ['cardio', 'Cardiogénico'], ['tapon', 'Obstructivo: taponamiento'], ['tep', 'Obstructivo: TEP'], ['no', 'No está en shock']];
export const HUELLA = {
  hemo: { pistas: [{ t: 'Taquicardia y una curva arterial estrecha: el ventrículo se vacía.', s: ['#tr-art', '[data-fila="fc"]'], c: C.t151 }, { t: 'En la eco, las cavidades pequeñas y sin derrame.', s: ['#cor-cav'], c: C.t141 }, { t: 'En el catéter: PVC baja, gasto bajo y resistencia alta.', s: ['[data-fila="pvc"]', '[data-fila="ic"]', '[data-fila="irvs"]'], c: C.t141 }], seria: 'PVC baja, gasto bajo y resistencia alta (Tabla 14.1)' },
  septico: { pistas: [{ t: 'Diastólica baja con un pulso amplio: vasos abiertos.', s: ['#tr-art'], c: C.sepHemo, org: 'la forma: fisiología general' }, { t: 'En la eco, un VI que se vacía bien y sin derrame.', s: ['#cor-cav'], c: C.t141 }, { t: 'En el catéter: PVC baja, gasto normal o alto y resistencia baja; ScvO₂ alta.', s: ['[data-fila="pvc"]', '[data-fila="ic"]', '[data-fila="irvs"]', '[data-fila="ven"]'], c: C.t141 }], seria: 'PVC baja, gasto normal o alto y resistencia baja (Tabla 14.1)' },
  cardio: { pistas: [{ t: 'Hipotensión con hipoperfusión (lactato, orina).', s: ['#shv-lab'], c: C.csHemo }, { t: 'En la eco, un VI grande que no se vacía.', s: ['#cor-cav'], c: C.csHemo }, { t: 'En el catéter: gasto bajo con resistencia alta; la PCP alta o, en el 30 %, no.', s: ['[data-fila="pcp"]', '[data-fila="ic"]', '[data-fila="irvs"]'], c: C.csExc }], seria: 'gasto bajo, resistencia alta y una presión de llenado alta (o, en el 30 %, no) (p. 40)' },
  tapon: { pistas: [{ t: 'Taquicardia y un pulso muy estrecho.', s: ['#tr-art'], c: C.obstr, org: 'la forma: fisiología general' }, { t: 'En la eco, el derrame que aprieta las cuatro cámaras.', s: ['#cor-saco'], c: C.vdMed }, { t: 'En el catéter: la PVC y la PCP se igualan.', s: ['[data-fila="pvc"]', '[data-fila="pcp"]'], c: C.vdMed }], seria: 'la PVC alta e igual a la PCP (cap. 18, p. 4)' },
  tep: { pistas: [{ t: 'Taquicardia y taquipnea: lo típico, aunque nada confirma.', s: ['[data-fila="fc"]', '[data-fila="fr"]'], c: C.tepClin }, { t: 'En la eco, el VD dilatado que empuja el tabique.', s: ['#cor-vd'], c: C.tepEco }, { t: 'En el catéter: PVC alta, PCP baja y la presión pulmonar alta.', s: ['[data-fila="pvc"]', '[data-fila="pcp"]', '#tr-pap'], c: C.vdMed }], seria: 'la PVC alta con la PCP normal (cap. 18, p. 4)' },
  no: { pistas: [{ t: 'PAM por encima de 65, el lactato y la orina sin alarma: no hay hipoperfusión.', s: ['[data-fila="pa"]', '#shv-lab'], c: C.t145 }, { t: 'En la eco, el VD sufre: hay que vigilarlo.', s: ['#cor-vd'], c: C.tepEco }, { t: 'Sin inestabilidad, un TEP con el VD sobrecargado es de riesgo intermedio.', s: ['[data-fila="pa"]'], c: C.tepRiesgo }], seria: 'sin hipotensión ni hipoperfusión' },
};

// ---------------------------------------------------------------- Mayéutica (muestra amplia): guía, examen y el caso
// Las respuestas viven aquí, nunca en el HTML hasta contestar. Los enunciados con cifras leen el modelo (R).
// «prepara»: el estado del modelo para la pregunta; «predice»: se tapan las cifras, el dibujo y la consola.
export const PREGUNTAS = [
  { id: 'G1', grupo: 'guia', predice: true, prepara: { pac: 'aurelio', ajuste: { soporte: 'no' }, escena: 'balon' },
    enunciado: 'En el modelo, pones un balón de contrapulsación al corazón de Aurelio. Antes de encenderlo: <b>¿en qué momento del latido se hinchará?</b>',
    opciones: [
      { t: 'Con la onda R, al empezar la sístole, para empujar con el VI.', porque: 'Hinchado en la sístole, el VI eyectaría contra el balón lleno: más poscarga y menos volumen sistólico, justo lo contrario de lo que buscas en Aurelio. La onda R solo dispara el ciclo.' },
      { t: 'Al cerrarse la válvula aórtica, al empezar la diástole.', ok: true },
      { t: 'Al abrirse la válvula aórtica, en la eyección rápida.', porque: 'En la eyección la válvula está abierta: el balón lleno taparía la salida del VI. Aurelio tendría menos gasto y más trabajo cardíaco.' },
      { t: 'En la contracción auricular, ya al final de la diástole.', porque: 'Ahí es cuando el balón se vacía, no cuando se hincha: perdería casi toda la diástole y el pico diastólico apenas subiría en Aurelio.' }],
    explica: 'Se hincha al empezar la diástole, justo tras cerrarse la aórtica, y se vacía en la contracción isovolumétrica, antes de que se abra (p. 45; Fig. 16.3).', cita: C.iabp,
    comprueba: { txt: 'Compruébalo: enciende el balón', ajuste: { soporte: 'balon' }, mira: 'Mira la curva arterial: la segunda joroba sale tras la muesca del cierre aórtico, y la punteada es la curva sin balón.', cifras: ['pam', 'pad', 'picoDia'] } },
  { id: 'G4', grupo: 'guia', predice: true, prepara: { pac: 'aurelio', ajuste: { soporte: 'balon', razon: 2 }, escena: 'balon' },
    enunciado: 'Aurelio lleva el balón en 1:2: un latido asistido y el siguiente no. <b>¿Cuál de los dos tiene la presión diastólica más alta, y por qué?</b>',
    opciones: [
      { t: 'El asistido: el balón lleno empuja la sangre.', ok: true },
      { t: 'El no asistido: sin balón, la aorta se vacía hacia los vasos de forma natural y mantiene la presión.', porque: 'Sin balón la aorta solo se vacía hacia los vasos y la presión baja de forma gradual: Aurelio no tendría el aumento que perfunde sus coronarias.' },
      { t: 'Los dos igual: el balón solo cambia la presión durante la sístole, no la diástole.', porque: 'El balón actúa en la diástole, no en la sístole; pensar que no la toca te haría ignorar el aumento diastólico que busca el aparato.' },
      { t: 'El no asistido: el vaciado del balón deja la aorta con más sangre.', porque: 'Al revés: el vaciado quita volumen de la aorta y la presión previa a la sístole baja, no sube. Aurelio eyectaría contra menos carga, no contra más.' }],
    explica: 'El balón se hincha al empezar la diástole y desplaza sangre: la presión diastólica del latido asistido sube (p. 45). Con 1:2 los dos latidos se comparan en la misma tira; las cifras son del modelo.', cita: C.iabp,
    comprueba: { txt: 'Compruébalo: mira la consola', ajuste: { razon: 2 }, mira: 'Mira la meseta de los latidos A frente a los n, y la telediastólica al final del A.', cifras: ['picoDia', 'picoNo', 'teleDia', 'teleNo'] } },
  { id: 'G5', grupo: 'guia', predice: true, prepara: { pac: 'aurelio', ajuste: { soporte: 'balon' }, escena: 'balon' },
    enunciado: 'En la consola, Aurelio con el balón en 1:1 muestra un «Aumento» de cifra mayor que su sistólica. <b>¿Qué presión mide el Aumento y por qué puede superar la sistólica?</b>',
    opciones: [
      { t: 'La máxima de la aorta en diástole, con el balón hinchado.', ok: true },
      { t: 'La presión máxima en la sístole: el balón ayuda al VI a eyectar y la sube por encima de la propia.', porque: 'En la sístole el balón está vacío: no ayuda a eyectar y el VI lo hace contra menos carga. Si lo creyeras, buscarías el aumento donde no está.' },
      { t: 'La presión del helio dentro del balón, por eso es mayor que la de la arteria.', porque: 'El aumento es una presión de la arteria del paciente, no del gas. Confundirlas te haría subir el volumen de helio sin mirar al paciente.' },
      { t: 'La presión media: el balón la sube al apretar las arteriolas.', porque: 'Lo que el balón sube es el pico diastólico (p. 45); la PAM también sube con él, pero la media no es el aumento. «Apretar arteriolas» no es su mecanismo: el libro habla de aumento diastólico y menor poscarga.' }],
    explica: 'El aumento es el pico de la presión arterial en la diástole, con el balón hinchado; puede quedar por encima de la sistólica propia (p. 45).', org: 'Que el pico diastólico aumentado supere la sistólica previa, con el inflado bien sincronizado: Gillespie 2024, <a class="cita-pdf" href="docs/gillespie-2024-balon-contrapulsacion-jscai.pdf#page=8" target="_blank" rel="noopener">PDF, p. 8</a>: «reach a peak higher than the previous systolic upstroke». Con inflado tardío puede quedar igual o por debajo (misma p. 8). Las cifras, en el modelo', cita: C.iabp,
    comprueba: { txt: 'Compruébalo: mira el Aumento', ajuste: {}, mira: 'La barra del Aumento pasa la marca roja de la sistólica propia.', cifras: ['pam', 'pad', 'picoDia'] } },
  { id: 'G6', grupo: 'guia', tipo: 'destapa', predice: false, prepara: { pac: 'joaquin', ajuste: { soporte: 'balon' }, escena: 'balon' },
    enunciado: 'Joaquín tiene una disección aórtica y la app le pone al balón el sello «Contraindicado». <b>¿Cuál es la otra contraindicación del Marino y por qué el balón la empeoraría? Son dos cosas.</b>',
    puntos: [
      { t: 'La <span class="hl-rojo">insuficiencia aórtica</span>: el Marino contraindica el balón en ella y en la disección aórtica (p. 45).', c: C.iabp },
      { t: 'El porqué: el balón se hincha en diástole, con la válvula aórtica cerrada; si esta no cierra bien, empujaría más sangre de vuelta al VI.', org: 'La contraindicación en la insuficiencia aórtica, la disección y el aneurisma: ' + PM(16635618, 'Trost y Hillis 2006') + '. El porqué: el inflado precoz cierra antes la válvula aórtica y puede causar regurgitación aórtica (Gillespie 2024, <a class="cita-pdf" href="docs/gillespie-2024-balon-contrapulsacion-jscai.pdf#page=8" target="_blank" rel="noopener">PDF, p. 8</a>); que la regurgitación ya existente empeora, por fisiología general', c: C.iabp }] },
  { id: 'G2', grupo: 'guia', predice: true, prepara: { pac: 'aurelio', volumen: 250, ajuste: { soporte: 'impella', impella: 2.5 }, escena: 'impella' },
    enunciado: 'En el modelo, el corazón de Aurelio ya lleno (tras 250 mL) lleva un Impella a 2,5 L/min. Lo subes a 5,5. <b>¿Qué esperas en la PCP y en la curva arterial?</b>',
    opciones: [
      { t: 'La PCP sube: llega más sangre al corazón izquierdo.', porque: 'La bomba saca sangre del VI, no la mete: el VI se vacía y su presión de llenado baja. Si esperaras que suba, frenarías el aparato que más descarga a Aurelio.' },
      { t: 'La PCP no cambia: el Impella trabaja en la aorta.', porque: 'La entrada está en el VI (p. 47): lo vacía. Pensar que no lo toca te haría ignorar la PCP que cae con el flujo.' },
      { t: 'La PCP baja y el pulso de la curva arterial se estrecha.', ok: true },
      { t: 'La PCP baja y el pulso se ensancha, por más volumen sistólico.', porque: 'El flujo de la bomba es continuo: sustituye al que eyecta el VI. El pulso se estrecha y, si el VI ya no abre la aórtica, casi desaparece.' }],
    explica: 'Descarga el VI y sube el gasto (p. 48). Que la curva se aplane al pasar el flujo de pulsátil a continuo es fisiología general; el modelo lo calcula.', cita: C.impellaEf,
    comprueba: { txt: 'Compruébalo: sube el Impella a 5,5', ajuste: { impella: 5.5 }, mira: 'Mira la PCP y la curva arterial; y en la consola, cuánto da la bomba y cuánto el corazón. Si la bomba no llega a lo que pides, la consola lo avisa: al VI no le llega bastante sangre.', cifras: ['pcp', 'pas', 'pad', 'imp', 'ic'] } },
  { id: 'G3', grupo: 'guia', predice: true, prepara: { pac: 'aurelio', rec: { esc: 'fallo', g: 1, volemia: 0 }, ajuste: { soporte: 'ecmo', ecmo: 3 }, escena: 'ecmo' },
    enunciado: 'Aurelio, con el VI muy débil, en ECMO VA a 3 L/min. Subes a 6. <b>¿Qué le pasa a su VI?</b>',
    opciones: [
      { t: 'Descansa: el ECMO hace el trabajo y el VI se vacía.', porque: 'El ECMO saca la sangre de las venas, no del VI: el VI sigue recibiendo la que vuelve por el pulmón y tiene que abrir su válvula contra la aorta llena. Lo creerías protegido mientras se encharca.' },
      { t: 'Le cuesta más abrir la aórtica: se dilata y la PCP sube.', ok: true },
      { t: 'Nada: el ECMO devuelve la sangre lejos, en la femoral.', porque: 'La sangre sube por la aorta al revés hasta el cayado (p. 48): sube la poscarga del VI. Aurelio podría hacer un edema agudo de pulmón.' },
      { t: 'Abre la aórtica con más fuerza por el oxígeno que recibe.', porque: 'El O₂ no le quita poscarga: la presión de la aorta sigue subiendo con el flujo retrógrado. El VI débil abre cada vez menos.' }],
    explica: 'El flujo retrógrado sube la poscarga del VI; puede bajar su gasto y dar edema agudo de pulmón (p. 48).', cita: C.ecmoPoscarga,
    comprueba: { txt: 'Compruébalo: sube el ECMO a 6 L/min', ajuste: { ecmo: 6 }, mira: 'Mira cuántos latidos abre la aórtica, cuánto eyecta el corazón en la consola y las gotas en el pulmón: la PCP ya está en el tope que el edema le deja y lo que crece es el edema.', cifras: ['aoAbre', 'pcp', 'edema', 'ecmo'] } },
  { id: 'E1', grupo: 'examen', prepara: { pac: 'amparo', ajuste: { na: 10 }, horas: 6 },
    enunciado: (R) => `Amparo, hora 6: noradrenalina a 10 µg/min, PAM ${R.pam}, ScvO₂ ${R.ven} %, lactato ${c1(R.lact)} mmol/L, gap de PCO₂ ${R.gap} mmHg. <b>¿Qué lectura es la correcta?</b>`,
    opciones: [
      { t: 'La ScvO₂ alta prueba que el aporte basta: baja la noradrenalina.', porque: 'En la sepsis la mitocondria no usa el O₂ y la ScvO₂ sube aunque falte perfusión (p. 10, 59). Si bajas la noradrenalina por ese número, la PAM de Amparo cae.' },
      { t: 'La ScvO₂ aquí engaña; el gap dice que hay flujo; meta: el lactato.', ok: true },
      { t: 'El gap normal indica hipoperfusión: añade dobutamina.', porque: 'Un gap <6 mmHg es perfusión adecuada (Tabla 14.3). La dobutamina le sumaría 5-15 lpm de taquicardia (p. 43) sin un gasto bajo que tratar.' },
      { t: 'El lactato alto es hipoxia tisular: sube la FiO₂ al 100 %.', porque: 'En la sepsis el lactato sube aunque sobre O₂, y el O₂ de más podría dañar por estrés oxidante (p. 59). Amparo ganaría radicales libres, no oxígeno en la célula.' }],
    explica: 'En el shock séptico la ScvO₂ sube porque la extracción está alterada y no es fiable; el gap solo depende del flujo (p. 10); la meta sigue siendo normalizar el lactato (p. 18, 59).', cita: C.sepMon },
  { id: 'E2', grupo: 'examen',
    enunciado: 'Cuatro pacientes en shock cardiogénico refractario. <b>¿En cuál NO pondrías un balón de contrapulsación?</b>',
    opciones: [
      { t: 'Tras una cirugía cardíaca, esperando que recupere.', porque: 'Es justo para quien la fuente lo reserva: se espera que mejore la función (p. 45). Negárselo le quita un soporte que podría ayudarle.' },
      { t: 'Con insuficiencia aórtica moderada en la eco.', ok: true },
      { t: 'Con un IAM y una cirugía de revascularización planeada.', porque: 'Otra indicación de la fuente: hay otra intervención planeada (p. 45). Sin soporte, llegaría peor a la cirugía.' },
      { t: 'En un hospital sin ECMO, mientras se plantea el traslado.', porque: 'El balón es el soporte más disponible fuera de los grandes centros (p. 45) y una de las opciones antes del traslado (p. 49). Sin él, el paciente quedaría sin soporte.' }],
    explica: 'El balón está contraindicado en la insuficiencia aórtica y en la disección aórtica (p. 45): al hincharse en la diástole, empujaría más sangre de vuelta al VI.', cita: C.iabp, org: 'el porqué de la insuficiencia: fisiología general' },
  { id: 'E3', grupo: 'examen',
    enunciado: 'Día 2 con balón: el pie izquierdo no tiene pulso pedio, pero el paciente mueve los dedos y lo siente. <b>¿Qué haces con el balón?</b>',
    opciones: [
      { t: 'Lo dejas y vigilas la sensibilidad y el movimiento.', ok: true },
      { t: 'Lo retiras ya: la pérdida de pulsos obliga a quitarlo.', porque: 'La pérdida de pulsos sola no obliga a retirarlo si la función sensitiva y motora está intacta (p. 46). Le quitarías un soporte que necesita.' },
      { t: 'Lo cambias por un Impella por la otra femoral.', porque: 'El Impella tiene más isquemia de la pierna y más sangrado que el balón (p. 48): cambiarías un riesgo por otro mayor.' },
      { t: 'Lo dejas, pero solo hasta que vuelva el pulso.', porque: 'El pulso no es lo que decide: es la función sensitiva y motora. Si se pierde, se retira de inmediato y puede hacer falta cirugía (p. 46).' }],
    explica: 'La complicación principal del balón es la isquemia de la pierna. Sin pulsos pero con función sensitivomotora intacta, se queda; si se pierde la función, se retira de inmediato (p. 46).', cita: C.iabpCompl },
  { id: 'E4', grupo: 'examen',
    enunciado: '<b>¿Qué complicación es más frecuente con el Impella que con los otros soportes mecánicos?</b>',
    opciones: [
      { t: 'La fiebre, en la mitad de los pacientes con el aparato.', porque: 'La fiebre del 50 % (con bacteriemia en el 15 %) es la del balón (p. 47). Si la buscas en el Impella, pasarás por alto la orina oscura de la hemólisis.' },
      { t: 'El síndrome compartimental de la pierna.', porque: 'El 10 % es del ECMO (p. 48). Con el Impella vigilarías la pierna, pero no lo que es más propio de él.' },
      { t: 'La hemólisis significativa, en el 5-10 %.', ok: true },
      { t: 'El ictus, en el 6 %.', porque: 'El 6 % de ictus es del ECMO VA (p. 48). En un Impella, la hemólisis es lo que la fuente dice que es más frecuente.' }],
    explica: 'La hemólisis significativa (5-10 %) es mayor con el Impella que con otros soportes; además, más sangrado mayor e isquemia de la pierna que con el balón (p. 48).', cita: C.impellaEf },
  { id: 'E5', grupo: 'examen',
    enunciado: '<b>¿Qué ventaja tiene el ECMO VA que, entre los otros soportes, solo se iguala combinando dos Impella, uno para cada ventrículo?</b>',
    opciones: [
      { t: 'Descarga el VI y le baja la poscarga.', porque: 'Al revés: el flujo que sube por la aorta le SUBE la poscarga al VI, un problema que no tienen los otros soportes (p. 48). Esperando que descargue, dejarías encharcarse al paciente.' },
      { t: 'Da más supervivencia que el balón en el infarto.', porque: 'Las comparaciones con el balón o los LVAD son inconsistentes: unas veces mejor el ECMO y otras el Impella (p. 49). Elegirlo por eso es elegirlo por un dato que la fuente no da.' },
      { t: 'El soporte completo de los dos ventrículos.', ok: true },
      { t: 'No necesita anticoagulación completa.', porque: 'Como los demás soportes, necesita anticoagulación completa (p. 48). Sin ella, el circuito y el paciente se llenarían de trombos.' }],
    explica: 'El ECMO VA puede dar soporte biventricular completo (solo igualado por un Impella para el VD y otro para el VI) y además oxigena y lava el CO₂; necesita anticoagulación completa (p. 48).', cita: C.ecmo },
];
// El caso de Aurelio: evoluciona en el reloj del paciente. Cada paso prepara el modelo y añade a la ficha lo nuevo.
export const CASO = {
  titulo: 'El infarto que se rompe (Aurelio)',
  pasos: [
    { dia: 'Hemodinámica · hora 0', prepara: { pac: 'aurelio', escena: 'corazon', canales: 'cabecera' }, tipo: 'test',
      ficha: (R) => [['Paciente', 'Aurelio, 67 años, 82 kg'], ['Motivo', 'IAM anterior', 1], ['PA', `${R.pas}/${R.pad} mmHg`, 1], ['FC', `${R.fc} lpm`, 1], ['Lactato', `${c1(R.lact)} mmol/L`, 1], ['Diuresis', `${c1(R.diur)} mL/kg/h`, 1], ['Pulmón', 'crepitantes', 1]],
      enunciado: '<b>¿Insuficiencia cardíaca o shock cardiogénico?</b>',
      opciones: [
        { t: 'Shock: hay hipoperfusión, no solo un gasto bajo.', ok: true },
        { t: 'Edema agudo de pulmón: los crepitantes lo explican.', porque: 'Los crepitantes hablan de congestión; lo que define el shock es la hipoperfusión: la PA, el lactato y la orina (p. 40). Si tratas solo el edema, Aurelio sigue sin perfundir.' },
        { t: 'Insuficiencia cardíaca: falta saber el IC por catéter.', porque: 'El IC bajo es típico, pero la hipoperfusión ya se ve en la cabecera: la PA, el lactato y la orina (p. 40). Esperar al catéter retrasa el tratamiento.' },
        { t: 'Shock hipovolémico: PA baja, taquicardia y poca orina.', porque: 'Un IAM anterior con gasto bajo es cardiogénico (p. 40). Si lo tratas como hipovolémico, olvidas el corazón.' }],
      explica: 'El shock cardiogénico comparte con la IC el gasto bajo y la RVS alta; lo distingue la hipoperfusión (p. 40).', cita: C.csHemo },
    { dia: 'Hora 0 · catéter de arteria pulmonar', prepara: { pac: 'aurelio', escena: 'corazon', canales: 'todos' }, tipo: 'test',
      ficha: (R) => [['PCP', `${R.pcp} mmHg`, 1], ['IC', `${c1(R.ic)} L/min/m²`, 1], ['PVC', `${R.pvc} mmHg`, 1]],
      enunciado: (R) => `PCP ${R.pcp} con IC ${c1(R.ic)}. <b>¿Qué haces primero?</b>`,
      opciones: [
        { t: 'Dobutamina: el problema es la bomba.', porque: 'Con la PCP baja, el VI aún no está bien lleno: el inotrópico subiría el trabajo de un corazón vacío y la FC (p. 43-44). Primero, el llenado.' },
        { t: 'Furosemida para prevenir el edema.', porque: 'Con la PCP baja, el diurético bajaría aún más el llenado y el gasto de Aurelio: la ficha pide subirla hasta 18-20 (p. 42).' },
        { t: 'Volumen hasta una PCP de 18-20, mirando el gasto.', ok: true },
        { t: 'Impella ya: los fármacos aumentan el trabajo.', porque: 'El soporte no se retrasa si los fármacos no bastan (p. 44), pero antes hay que corregir un llenado bajo, que puede subir el gasto por sí solo (p. 42).' }],
      explica: 'La PCP no siempre está alta en el shock cardiogénico; entonces el volumen puede subir el gasto, hasta la PCP más alta que lo suba sin edema: 18-20 (p. 42; ver la nota de fuentes).', cita: C.llenado,
      comprueba: { txt: 'Compruébalo: dale 250 mL', volumen: 250, mira: 'Mira cómo sube la PCP y cuánto sube el IC.', cifras: ['pcp', 'ic', 'pam'] } },
    { dia: 'Tras 250 mL · la presión', prepara: { pac: 'aurelio', volumen: 250, escena: 'corazon', canales: 'todos' }, tipo: 'test',
      ficha: (R) => [['Tras 250 mL', `PCP ${R.pcp} · IC ${c1(R.ic)} · PAM ${R.pam}`, 1]],
      enunciado: (R) => `La PCP ya está en ${R.pcp} y la PAM, en ${R.pam}. <b>¿Qué le pones para la presión?</b>`,
      opciones: [
        { t: 'Dopamina: sube la PA y además estimula el corazón.', porque: 'Frente a la noradrenalina, la dopamina dio más taquicardia y arritmias, y más muertes (p. 43). Aurelio, con el infarto, no necesita más trabajo cardíaco.' },
        { t: 'Noradrenalina a 5 µg/min, sin carga, subiendo cada 5 min.', ok: true },
        { t: 'Otro bolo de 250 mL: la PAM aún no llega a 65.', porque: 'La meta del volumen es la PCP más alta que suba el gasto sin edema, 18-20 (p. 42), y ya está ahí. Más suero encharcaría el pulmón de Aurelio.' },
        { t: 'Fenilefrina, un vasoconstrictor puro.', porque: 'Se prefiere solo en el shock por obstrucción dinámica del tracto de salida del VI (p. 42). En Aurelio perderías la leve estimulación cardíaca de la noradrenalina, que ayuda a mantener el gasto (p. 43).' }],
      explica: 'La noradrenalina es el vasopresor de elección en el shock cardiogénico: menos taquicardia, menos arritmias y menos muertes que la adrenalina o la dopamina. Se empieza a 5 µg/min, sin dosis de carga, y se sube cada 5 min (p. 42-43).', cita: C.csNa,
      comprueba: { txt: 'Compruébalo: noradrenalina a 5 µg/min', ajuste: { na: 5 }, mira: 'Mira la PAM y la IRVS: suben; el IC apenas cambia.', cifras: ['pam', 'irvs', 'ic'] } },
    { dia: 'Hora 1 · la cuenta', prepara: { pac: 'aurelio', volumen: 250, ajuste: { na: 5 }, escena: 'corazon', canales: 'todos' }, tipo: 'test', predice: true,
      ficha: (R) => [['Hora 1', `PAM ${R.pam} · PVC ${R.pvc} · IC ${c1(R.ic)}`, 1]],
      enunciado: (R) => `Con la noradrenalina, PAM ${R.pam} mmHg, PVC ${R.pvc} mmHg e IC ${c1(R.ic)} L/min/m². Antes de mirar el monitor, <b>calcula la IRVS: ¿cuánto da y qué te dice?</b>`,
      opciones: (R) => {
        // la buena, la del monitor (la cuenta con las cifras redondeadas da ±1); las falsas, los tres errores de la cuenta
        const v = R.irvs, sinPvc = R.pam / R.ic, porGc = (R.pam - R.pvc) / R.gcTotal, meta = (x) => x < 25 ? 'bajo la meta (25-30)' : x <= 30 ? 'en la meta (25-30)' : 'sobre la meta (25-30)';
        return [
          { t: `≈ ${Math.round(sinPvc)}, ${meta(sinPvc)}: aprieta de más; bajo la noradrenalina.`, porque: `Te has olvidado de restar la PVC: la ecuación 14.2 usa PAM − PVC. Y aunque salga alta, bajar la noradrenalina dejaría la PAM de Aurelio por debajo de 65.` },
          { t: `≈ ${Math.round(porGc)}, ${meta(porGc)}: subo la noradrenalina.`, porque: `Has dividido por el gasto en L/min, no por el índice (L/min/m²): eso es la RVS, no la IRVS. Subirías la noradrenalina y la poscarga de un VI que ya no puede con ella.` },
          { t: `≈ ${Math.round((R.pam - R.pvc) * R.ic)}: altísima; añado un vasodilatador.`, porque: 'La resistencia es presión dividida por flujo (ecuación 14.2), no multiplicada. Un vasodilatador con la PAM justa en 65 hundiría a Aurelio.' },
          { t: `≈ ${v}, ${meta(v)}: falta flujo, no presión.`, ok: true }];
      },
      explica: 'IRVS = (PAM − PVC) / IC, de la ecuación 14.2 (gasto = (PAM − PAD) / RVS), en unidades Wood por m²; la meta del shock cardiogénico es 25-30 (Tabla 16.2). Con la presión sostenida por la noradrenalina y el IC aún bajo, lo que toca es el gasto: el inotrópico.', cita: C.ecuacion, cita2: C.t162 },
    { dia: 'Hora 1 · el plan del residente', prepara: { pac: 'aurelio', volumen: 250, ajuste: { na: 5 }, escena: 'corazon', canales: 'todos' }, tipo: 'error',
      ficha: (R) => [['Hora 1', `NA 5 µg/min · PAM ${R.pam} · IC ${c1(R.ic)} · lactato ${c1(R.lact)}`, 1]],
      enunciado: 'La PA sube, pero el gasto sigue bajo. El R1 escribe el plan del inotrópico. <b>Puede haber 0, 1 o 2 errores.</b>',
      frases: [
        { t: 'Empiezo milrinona, que da menos taquicardia: es la mejor con hipotensión.', mal: true, buena: 'La milrinona es vasodilatadora: su principal desventaja en el shock cardiogénico es la hipotensión (p. 44).', cita: C.milri },
        { t: 'Mejor dobutamina, a 3-5 µg/kg/min.', cita: C.dobuta },
        { t: 'Su FC subirá, habitualmente 5-15 lpm.', cita: C.dobuta },
        { t: 'Si no basta, levosimendán 72 h, que tiene una semivida de 80 h.', mal: true, buena: 'La semivida es de 80 h, pero las infusiones suelen limitarse a 24 h (p. 44).', cita: C.levo }],
      explica: 'Dobutamina de inicio; la milrinona y el levosimendán bajan la PA.', cita: C.dobuta },
    { dia: 'Hora 18 · el giro', prepara: { pac: 'aurelio', rec: { eroaMitral: 0.8, pao2: 56 }, volumen: 250, horas: 18, ajuste: { na: 5, dobuta: true }, escena: 'corazon', canales: 'todos' }, tipo: 'test',
      ficha: (R) => [['Hora 18', 'soplo holosistólico nuevo', 1], ['PCP', `${R.pcp} mmHg`, 1], ['SpO₂', `${R.spo2} % con O₂`, 1], ['Eco', 'un velo mitral se va a la aurícula en cada sístole', 1]],
      enunciado: (R) => `Soplo holosistólico nuevo, PCP ${R.pcp}, SpO₂ ${R.spo2} %; en la eco, un velo mitral se va a la aurícula en cada sístole. <b>¿Qué le ha pasado?</b>`,
      opciones: [
        { t: 'Nada nuevo: a las 18 h aún es pronto para que el infarto se rompa.', porque: 'Las roturas del infarto aparecen típicamente en las primeras 24 h, al contrario de la idea clásica de que son tardías (p. 38). Descartarlas por la hora retrasa el diagnóstico.' },
        { t: 'Se ha roto el tabique interventricular.', porque: 'También pasa en las primeras 24 h, pero da un cortocircuito del VI al VD (p. 38). El velo que se va a la aurícula es el prolapso que el músculo papilar impide al contraerse (p. 38).' },
        { t: 'Se ha roto un músculo papilar: insuficiencia mitral aguda.', ok: true },
        { t: 'Se ha roto la pared libre del VI.', porque: 'Da un hemopericardio que se acumula deprisa y un taponamiento (p. 38): la PVC y la PCP se igualarían. No explica el velo que se va a la aurícula.' }],
      explica: 'La rotura de un músculo papilar (el 7 % de los shocks del infarto) da una insuficiencia mitral aguda que amenaza la vida. Las tres roturas del infarto aparecen típicamente en las primeras 24 h (p. 38).', cita: C.papilar },
    { dia: 'Hora 18 · el soporte', prepara: { pac: 'aurelio', rec: { eroaMitral: 0.8, pao2: 56 }, volumen: 250, horas: 18, ajuste: { na: 5, dobuta: true }, escena: 'corazon', canales: 'todos' }, tipo: 'destapa',
      ficha: (R) => [['Hora 18', `fallo respiratorio: SpO₂ ${R.spo2} % con el respirador`, 1]],
      enunciado: 'Los fármacos ya no bastan y el respirador no corrige la hipoxemia. <b>¿Qué soporte le pones y qué vigilas? Son dos cosas.</b>',
      puntos: [
        { t: 'Un <span class="hl-azul">ECMO venoarterial</span>: da flujo e intercambio de gases; es el de elección si hay fallo respiratorio.', c: C.seleccion },
        { t: 'La poscarga del VI: el chorro que sube por la aorta le cuesta; si la PCP sube y aparece edema, <span class="hl-verde">venteo</span> (un balón o un Impella a la vez, o drenar el VI).', c: C.ecmoPoscarga }],
      comprueba: { txt: 'Compruébalo: pon el ECMO a 4,5 L/min', ajuste: { soporte: 'ecmo', ecmo: 4.5 }, mira: 'Mira la SpO₂ (la mezcla de lo que eyecta el VI y lo que devuelve el oxigenador), cuántas veces abre la aórtica y la PCP. Si sube, prueba el venteo en Explorar.', cifras: ['spo2', 'aoAbre', 'pcp', 'ecmo'] } },
  ],
  llevas: [
    'Hipoperfusión = shock; y con la PCP baja, volumen hasta 18-20 antes que fármacos (p. 40, 42).',
    'Noradrenalina para la presión; si la IRVS = (PAM − PVC) / IC ya pasa de 25-30 y el IC sigue bajo, lo que falta es flujo: dobutamina (p. 2-3, 42-43).',
    'Las roturas del infarto, en las primeras 24 h; con fallo respiratorio, ECMO VA, vigilando la poscarga del VI (p. 38, 48-49).',
  ],
};
