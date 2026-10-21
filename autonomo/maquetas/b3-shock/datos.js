// Los datos de la cabecera del shock v2 (maqueta; en la app: js/data/shock-estados.js, objetivos-reanimacion.js y
// pacientes-b3.js). Sin DOM. Toda cifra visible sale del motor (soporte.mjs) o lleva su página; los textos que citan
// cifras del paciente son funciones de la lectura del momento (R), para que el texto y el monitor digan lo mismo.

// ---------------------------------------------------------------- fuentes y citas («Ver en la ficha» + PDF)
export const PDF_S = '../../docs/marino-2024-shock-caps14-17.pdf';
const PDF_C = '../../docs/marino-2024-cardiac-disorders-caps18-21.pdf';
const PDF_R = '../../docs/marino-2024-respiratory-management-caps22-26.pdf';
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
  'mc-ic-tipos': [CARDIO, 'Insuficiencia cardíaca aguda: tipos', 'IC aguda', PDF_C, 'Marino 2024'],
  'mc-diseccion-aortica': [CARDIO, 'Disección aórtica aguda', 'Disección aórtica', PDF_C, 'Marino 2024'],
  'neumo-ep-diagnostico': [NEUMO, 'Embolia pulmonar: diagnóstico', 'Embolia pulmonar', PDF_R, 'Marino 2024'],
  'neumo-ep-manejo': [NEUMO, 'Embolia pulmonar: manejo', 'Embolia pulmonar: manejo', PDF_R, 'Marino 2024'],
  // otras fuentes de la app (solo enlace; nunca se funden con Marino)
  'ic-descompensada': [['cardiologia', 'insuficienciaCardiaca', 'panel-cardio-ic-tabs'], 'Guía ESC 2026 de IC: IC descompensada', 'Guía ESC de IC', null, 'Guía ESC 2026 de IC'],
  'umi-shock-septico': [['sobrevivirUmi', 'manualUmi', 'panel-manual-umi-tabs'], 'Manual UMI: shock séptico', 'Manual UMI', null, 'Manual UMI'],
};
// Citas que se repiten (ids de párrafo: los de la cobertura del bloque, §3; los que aún no existen en la ficha se
// ponen al llevar el modelo a la app)
export const C = {
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
  hb: { f: 'mc-hemorragico-clasificacion', id: 'mc-hb-trampa', sitio: 'Hemoglobina: una trampa', p: 23 },
  f156: { f: 'mc-hemorragico-clasificacion', id: 'mc-fig-15-6', sitio: 'Fig. 15.6', p: 34 },
  csHemo: { f: 'mc-cardiogenico-fisio', id: 'mc-cs-hemodinamica', sitio: 'Cambios hemodinámicos', p: 40 },
  csExc: { f: 'mc-cardiogenico-fisio', id: 'mc-cs-excepciones', sitio: 'Excepciones', p: 40 },
  f162: { f: 'mc-cardiogenico-fisio', id: 'mc-fig-16-2', sitio: 'Fig. 16.2', p: 40 },
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
  autorreg: { f: 'mc-ic-tipos', id: 'mc-cardiorrenal', sitio: 'Síndrome cardiorrenal', p: 7 },
  disec: { f: 'mc-diseccion-aortica', id: 'mc-diseccion-fisio', sitio: 'Fisiopatología', p: 50 },
  tepClin: { f: 'neumo-ep-diagnostico', id: 'nep-tabla-22-1', sitio: 'Tabla 22.1', p: 2 },
  tepEco: { f: 'neumo-ep-diagnostico', id: 'nep-ecocardio', sitio: 'Ecocardiografía', p: '6-7' },
  tepRiesgo: { f: 'neumo-ep-manejo', id: 'nep-riesgo', sitio: 'Estratificación del riesgo', p: 7 },
  tepHemo: { f: 'neumo-ep-manejo', id: 'nep-hemodinamica', sitio: 'Manejo hemodinámico', p: '10-11' },
  escMcs: { f: 'ic-descompensada', id: 'ic-mcs-temporal', sitio: 'Soporte circulatorio mecánico temporal' },
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
    rec: { esc: 'fallo', g: 0.75, volemia: -1500, hb: 14 }, linea: '67 años, 82 kg · IAM anterior · hemodinámica, hora 0' },
  { k: 'joaquin', nombre: 'Joaquín', chip: 'taponamiento', tipo: 'tapon', peso: 84, edad: 56, sexo: 'varón', hb: 13.5, fr: 24, t: 36.8, obj: 'marino-14-5',
    rec: { esc: 'derrame', g: 0.85, hb: 13.5 }, linea: '56 años, 84 kg · disección aórtica tipo A que sangra al pericardio' },
  { k: 'consuelo', nombre: 'Consuelo', chip: 'TEP', tipo: 'tep', peso: 142, edad: 63, sexo: 'mujer', hb: 12.8, fr: 30, t: 37.2, obj: 'marino-14-5',
    rec: { esc: 'tep', g: 0.95, hb: 12.8, espacio: 'embolia' }, linea: '63 años, 142 kg · día 5 de prótesis de cadera · hora 20' },
];
// La gravedad de cada paciente, con nombre (el mando mueve la «g» del escenario del motor)
export const GRAVEDAD = {
  hemo: { min: 0, max: 1, paso: 0.01, texto: (g, pac) => { const pct = Math.round(g * 42), ml = Math.round(pct / 100 * 66 * pac.peso / 50) * 50; return [`${pct} % de la volemia`, `≈ ${ml.toLocaleString('es-ES')} mL de ${(66 * pac.peso / 1000).toFixed(1).replace('.', ',')} L · clase ${clase(pct)}`]; }, nota: 'Sangre perdida (Tabla 15.1; 66 mL/kg en el varón, p. 21)', cita: C.t151 },
  septico: { min: 0, max: 1, paso: 0.01, texto: (g) => [`${Math.round(g * 100)} %`, `resistencias al ${Math.round(100 * (1 - 0.6 * g))} %`], nota: 'Vasodilatación y fuga capilar', cita: C.sepHemo },
  cardio: { min: 0, max: 1, paso: 0.01, texto: (g) => [`Ees del VI ${(3.1 * (0.3 / 3.1) ** g).toFixed(2).replace('.', ',')}`, `contractilidad al ${Math.round(100 * (0.3 / 3.1) ** g)} %`], nota: 'Contractilidad del VI (modelo)', cita: C.csHemo },
  tapon: { min: 0, max: 1, paso: 0.01, texto: (g) => [`${Math.round(390 * (1 - (1 - g) ** 2))} mL`, 'de derrame en el saco'], nota: 'Líquido en el pericardio (modelo)', cita: C.obstr },
  tep: { min: 0, max: 1, paso: 0.01, texto: (g) => [`resistencia ×${(16 ** g).toFixed(1).replace('.', ',')}`, 'pulmonar (el émbolo)'], nota: 'Carga del émbolo sobre el VD (modelo)', cita: C.tepRiesgo },
};
export const clase = (pct) => pct < 15 ? 'I' : pct <= 30 ? 'II' : pct <= 40 ? 'III' : 'IV';

// ---------------------------------------------------------------- soporte: para quién (p. 45, 48)
export function indicacion(pac, tipoAparato) {
  if (pac.tipo === 'cardio') return { ok: true };
  if (pac.k === 'joaquin' && tipoAparato === 'balon') return { ok: false, sello: 'Contraindicado', txt: 'Disección aórtica: el balón está contraindicado (p. 45).', cita: C.iabp };
  if (pac.k === 'joaquin' && tipoAparato === 'impella') return { ok: false, sello: 'Contraindicado', txt: 'Valvulopatía aórtica: el Impella está contraindicado (p. 48), y la disección tipo A puede dar insuficiencia aórtica (cap. 20, p. 50).', cita: C.impellaEf };
  return { ok: false, sello: 'No indicado', txt: 'La fuente reserva el soporte mecánico para el shock cardiogénico refractario (p. 45). En este paciente no se pone.', cita: C.mcs };
}

// ---------------------------------------------------------------- estados con nombre (el nombre sale de las cifras)
// R: la lectura redondeada del momento; X: el contexto (paciente, ajuste, infundido, pérdida)
export function nombreEstado(R, X) {
  const s = X.ajuste.soporte;
  if (s !== 'no') {
    if (!indicacion(X.pac, s).ok) return 'soporte-no';
    if (s === 'balon') return 'balon';
    if (s === 'impella') return R.aoDe && R.aoAbre === 0 ? 'impella-alto' : 'impella';
    if (X.ajuste.venteo !== 'no') return 'ecmo-venteo';
    return R.aoAbre <= 2 || R.pcp >= 25 ? 'ecmo-cerrada' : 'ecmo';
  }
  const t = X.pac.tipo;
  if (t === 'hemo') { const c = clase(R.perdida); return X.infundido.cris > 0 ? 'hemo-salino' : c === 'IV' ? 'hemo-iv' : c === 'III' ? 'hemo-iii' : c === 'II' ? 'hemo-ii' : 'hemo-i'; }
  if (t === 'septico') return X.ajuste.na >= 10 ? 'septico-na' : 'septico';
  if (t === 'cardio') return R.pcp < 18 ? 'cardio-pcp-baja' : R.pcp <= 20 ? 'cardio-pcp-optima' : 'cardio';
  if (t === 'tapon') return 'tapon';
  if (t === 'tep') return X.infundido.cris > 500 ? 'tep-bolo' : R.pam >= 65 ? 'tep-intermedio' : 'tep-alto';
  return t;
}
const c1 = (x) => (+x).toFixed(1).replace('.', ',');
// Cada estado: título, frase (con su origen) y la explicación guiada (3-5 pasos que señalan el dibujo o el monitor).
// «s»: lo que se señala (selectores del monitor, de la escena o de la consola). Fuentes: la lista de citas de los pasos.
export const ESTADOS = {
  'hemo-i': { tit: 'Hemorragia, clase I', frase: () => 'Clase I: el relleno transcapilar repone lo perdido; casi no hay signos y no hace falta volumen.', org: 'ficha · p. 22',
    guia: [{ t: (R) => `Ha perdido un ${R.perdida} % de la volemia: menos del 15 %.`, s: ['#esc-cor'], c: C.t151 },
      { t: 'El relleno transcapilar mete líquido del intersticio en la sangre: hasta un litro.', s: ['[data-fila="pvc"]'], c: C.compens },
      { t: 'Casi no hay signos y no hace falta reponer volumen (Tabla 15.1).', s: ['[data-fila="fc"]', '[data-fila="pa"]'], c: C.t151 }] },
  'hemo-ii': { tit: 'Hemorragia, clase II', frase: (R) => `Clase II (${R.perdida} %): los vasos se aprietan y la PA aguanta. El primer aviso es la FC (${R.fc}).`, org: 'ficha · p. 22-23',
    guia: [{ t: (R) => `Ha perdido un ${R.perdida} % de la volemia: la clase II (15-30 %), la fase compensada.`, s: ['#esc-cor'], c: C.t151 },
      { t: (R) => `El simpático acelera el corazón: FC ${R.fc}. Es lo primero que sube.`, s: ['[data-fila="fc"]', '#tr-ecg'], c: C.compens },
      { t: 'Mira la arteriola: se cierra. La vasoconstricción sostiene la PA.', s: ['#cor-arteriola', '[data-fila="irvs"]'], c: C.compens },
      { t: (R) => `PAM ${R.pam}: aún por encima de 65. La orina y el lactato tardan en moverse (Tabla 15.1).`, s: ['[data-fila="pa"]', '#lab'], c: C.t151 }] },
  'hemo-iii': { tit: 'Hemorragia, clase III', frase: (R) => `Clase III (${R.perdida} %): apretar ya no basta. PA ${R.pas}/${R.pad} y FC ${R.fc}: es el shock hemorrágico. Se repone con sangre.`, org: 'ficha · p. 22-23',
    guia: [{ t: (R, X) => `${X.pac.nombre} ha perdido un ${R.perdida} %: ${X.texto} (66 mL/kg × ${X.pac.peso} kg). Es la clase III (31-40 %).`, s: ['#esc-cor'], c: C.volemia, org: 'cuánto se pierde: el mando' },
      { t: (R) => `La PVC está en ${R.pvc} y las cavidades, pequeñas: falta volumen.`, s: ['[data-fila="pvc"]', '#esc-cor'], c: C.t141 },
      { t: (R) => `La arteriola, cerrada (IRVS ${R.irvs}). La vasoconstricción sostuvo la PA en la clase II; en la III ya no basta.`, s: ['#cor-arteriola', '[data-fila="irvs"]'], c: C.claseIII },
      { t: (R) => `La curva arterial es estrecha: PAS ${R.pas}, PAD ${R.pad}. Es el ventrículo que se vacía.`, s: ['#tr-art'], c: C.t141, org: 'la forma: fisiología general' },
      { t: 'La Hb aún no baja: pierde sangre entera. No baja hasta las 8-12 h. La clase III se repone con sangre.', s: ['#lab'], c: C.hb }] },
  'hemo-iv': { tit: 'Hemorragia, clase IV', frase: (R) => `Clase IV (${R.perdida} %): shock profundo, quizá irreversible. PAM ${R.pam}. Es la pérdida masiva.`, org: 'ficha · p. 23',
    guia: [{ t: 'Más del 40 % perdido: shock hemorrágico profundo, quizá irreversible.', s: ['#esc-cor'], c: C.claseIV },
      { t: (R) => `La PA cae (PAM ${R.pam}) y la curva arterial es mínima.`, s: ['#tr-art', '[data-fila="pa"]'], c: C.t151 },
      { t: 'Fallo multiorgánico y acidosis láctica: el lactato sube con las horas. Transfusión masiva (Tabla 15.1).', s: ['#lab'], c: C.claseIV }] },
  'hemo-salino': { tit: 'Tras el cristaloide', frase: (R, X) => `Llevas ${X.infundido.cris.toLocaleString('es-ES')} mL de cristaloide: la PA sube ahora, pero 3/4 se irán al intersticio en la próxima hora.`, org: 'ficha · p. 11',
    guia: [{ t: 'De cada litro de cristaloide, solo un 25 % se queda en el plasma; el 75 % pasa al intersticio.', s: ['#reloj'], c: C.volIni },
      { t: (R) => `En el momento del bolo la PVC y la PA suben (PAM ${R.pam}). Pasa el reloj a la hora 1 y mira cuánto queda.`, s: ['[data-fila="pa"]', '[data-fila="pvc"]', '#reloj'], c: C.volIni, org: 'cuánto: el modelo' },
      { t: 'El salino añade plasma, no hematíes: diluye la Hb. Refleja la reanimación, no la pérdida.', s: ['#lab'], c: C.hb }] },
  septico: { tit: 'Shock séptico', frase: (R) => `Vasos abiertos (IRVS ${R.irvs}) y un gasto alto (IC ${c1(R.ic)}): la ScvO₂ alta (${R.ven} %) no tranquiliza; el gap de PCO₂ sí sirve.`, org: 'ficha · p. 10, 57-59',
    guia: [{ t: (R) => `Mira la arteriola: abierta. IRVS ${R.irvs}: la resistencia baja define el shock vasodilatador (Tabla 14.1).`, s: ['#cor-arteriola', '[data-fila="irvs"]'], c: C.t141 },
      { t: (R) => `El gasto no está bajo: IC ${c1(R.ic)}. La taquicardia (${R.fc}) y la poscarga baja lo suben.`, s: ['[data-fila="ic"]', '[data-fila="fc"]'], c: C.sepHemo },
      { t: (R) => `El endotelio dañado deja salir líquido: hipovolemia. PVC ${R.pvc}.`, s: ['[data-fila="pvc"]', '#esc-cor'], c: C.sepHemo },
      { t: (R) => `La ScvO₂ sube (${R.ven} %): la mitocondria no usa el O₂ y la extracción cae. No tranquiliza.`, s: ['[data-fila="ven"]'], c: C.sepMon },
      { t: (R) => `El gap de PCO₂ solo depende del flujo: ${R.gap} mmHg${R.gap < 6 ? ' (<6): hay flujo' : ' (≥6): el flujo no basta'}. La meta sigue siendo el lactato.`, s: ['[data-fila="gap"]', '#lab'], c: C.gap }] },
  'septico-na': { tit: 'Shock séptico con noradrenalina', frase: (R, X) => `Noradrenalina a ${X.ajuste.na} µg/min: por encima de 10 manda el α; la IRVS sube a ${R.irvs} y la PAM a ${R.pam}.`, org: 'ficha · p. 12-13',
    guia: [{ t: 'Por debajo de 10 µg/min, la noradrenalina estimula β y puede subir el gasto.', s: ['[data-fila="ic"]'], c: C.na },
      { t: (R) => `Por encima de 10 manda el α: la arteriola se cierra (IRVS ${R.irvs}) y la PAM sube (${R.pam}).`, s: ['#cor-arteriola', '[data-fila="pa"]'], c: C.na },
      { t: 'A 30 µg/min, más dosis apenas aprieta: es el momento del segundo vasopresor.', s: ['[data-fila="pa"]'], c: C.na },
      { t: (R, X) => `En µg/kg/min: ${c1(X.ajuste.na / X.pac.peso * 100 / 100)} para sus ${X.pac.peso} kg. La Tabla 17.2 añade vasopresina con 0,25-0,5 e hidrocortisona con >0,25 (ver la nota).`, s: ['[data-fila="pa"]'], c: C.t172 }] },
  'cardio-pcp-baja': { tit: 'Shock cardiogénico con la PCP baja', frase: (R) => `IC ${c1(R.ic)} y PCP ${R.pcp}: la presión de llenado no está alta. El volumen aún puede subir el gasto, hasta una PCP de 18-20.`, org: 'ficha · p. 40, 42',
    guia: [{ t: (R) => `El VI apenas se vacía: IC ${c1(R.ic)}, por debajo de 2,2, lo típico del shock cardiogénico.`, s: ['#esc-cor', '[data-fila="ic"]'], c: C.csExc },
      { t: (R) => `La arteriola se cierra: IRVS ${R.irvs}. Es el simpático y la renina-angiotensina (Fig. 16.2).`, s: ['#cor-arteriola', '[data-fila="irvs"]'], c: C.f162 },
      { t: (R) => `Pero la PCP no está alta: ${R.pcp}. Pasa en hasta el 30 % de los shocks del infarto.`, s: ['[data-fila="pcp"]', '#tr-pap'], c: C.csExc },
      { t: 'El volumen todavía puede subir el gasto: la meta es la PCP más alta que lo suba sin edema, 18-20 (ver la nota de fuentes).', s: ['[data-fila="pcp"]'], c: C.llenado }] },
  'cardio-pcp-optima': { tit: 'Shock cardiogénico, PCP en 18-20', frase: (R) => `PCP ${R.pcp}: la presión de llenado óptima (18-20). Más volumen ya no subirá el gasto (IC ${c1(R.ic)}); toca vasopresor e inotrópico.`, org: 'ficha · p. 42-43',
    guia: [{ t: (R) => `La PCP está en ${R.pcp}: en la meta de 18-20.`, s: ['[data-fila="pcp"]'], c: C.llenado },
      { t: 'Por encima de ahí, más volumen apenas sube el gasto y encharca el pulmón.', s: ['[data-fila="ic"]'], c: C.llenado, org: 'que ya no suba: fisiología general' },
      { t: 'Vasopresor de elección: la noradrenalina. Y un inotrópico: la dobutamina.', s: ['[data-fila="pa"]'], c: C.csNa },
      { t: 'Los fármacos suben el trabajo del corazón que falla: si no basta, no retrases el soporte mecánico.', s: ['#dock'], c: C.trabajo }] },
  cardio: { tit: 'Shock cardiogénico', frase: (R) => `El corazón no bombea: IC ${c1(R.ic)}, PCP ${R.pcp} y la arteriola cerrada. Lo que lo separa de la IC es la hipoperfusión.`, org: 'ficha · p. 40',
    guia: [{ t: (R) => `El VI no bombea: IC ${c1(R.ic)}.`, s: ['#esc-cor', '[data-fila="ic"]'], c: C.csExc },
      { t: (R) => `Sube la presión de llenado del que falla: PCP ${R.pcp}${R.pcp > 20 ? ', por encima de 18-20' : ''}.`, s: ['[data-fila="pcp"]', '#tr-pap'], c: C.csHemo },
      { t: (R) => `La arteriola se cierra: IRVS ${R.irvs} (Fig. 16.2).`, s: ['#cor-arteriola', '[data-fila="irvs"]'], c: C.f162 },
      { t: 'Con la PCP por encima de 18-20 el pulmón se encharca: mira las gotas en el pulmón y la SpO₂.', s: ['#cor-pulmon', '[data-fila="spo2"]'], c: C.llenado, org: 'cuánto: el modelo' }] },
  tapon: { tit: 'Taponamiento', frase: (R) => `El líquido del saco no deja llenarse al corazón: PVC ${R.pvc} y PCP ${R.pcp} se igualan. La eco lo separa del fallo del VD.`, org: 'ficha · p. 3; cap. 18, p. 4',
    guia: [{ t: 'La disección tipo A puede propagarse hacia atrás y sangrar al pericardio: taponamiento.', s: ['#cor-saco'], c: C.disec },
      { t: (R) => `El líquido no deja llenarse al corazón: shock obstructivo, con el patrón del cardiogénico (PVC ${R.pvc}, IC ${c1(R.ic)}, IRVS ${R.irvs}).`, s: ['[data-fila="pvc"]', '[data-fila="ic"]'], c: C.t141 },
      { t: (R) => `PVC ${R.pvc} y PCP ${R.pcp}: se igualan. También pasa cuando falla el VD: lo separa la eco.`, s: ['[data-fila="pvc"]', '[data-fila="pcp"]'], c: C.vdMed },
      { t: 'El tratamiento va a la causa. El balón está contraindicado en la disección.', s: ['#cor-saco'], c: C.iabp }] },
  'tep-alto': { tit: 'TEP de alto riesgo', frase: (R) => `El VD no puede con el émbolo: PVC ${R.pvc}, PCP ${R.pcp} y PAM ${R.pam}. Noradrenalina para la PA; volumen, como mucho 500 mL.`, org: 'ficha · cap. 22, p. 7, 10-11',
    guia: [{ t: 'El VD está dilatado y la paciente ya está inestable: TEP de alto riesgo (masivo).', s: ['#cor-vd'], c: C.tepRiesgo },
      { t: (R) => `La PVC (${R.pvc}) supera a la PCP (${R.pcp}): falla el derecho.`, s: ['[data-fila="pvc"]', '[data-fila="pcp"]'], c: C.vdMed },
      { t: (R) => `La presión pulmonar sube (${R.paps}/${R.papd}): mira la curva de la AP.`, s: ['#tr-pap'], c: C.tepEco, org: 'cuánto: el modelo' },
      { t: 'Taquicardia, taquipnea e hipoxemia: lo típico, pero ninguna confirma ni descarta. El 30 % tiene la PaO₂ normal.', s: ['[data-fila="fc"]', '[data-fila="fr"]'], c: C.tepClin },
      { t: 'Para la hipotensión, noradrenalina: no sube la resistencia pulmonar. Volumen, como mucho 500 mL y guiado por la eco.', s: ['[data-fila="pa"]'], c: C.tepHemo }] },
  'tep-intermedio': { tit: 'TEP con el VD sobrecargado, sin shock', frase: (R) => `PAM ${R.pam}: aún sin inestabilidad. Con el VD sobrecargado es el riesgo intermedio; el alto riesgo exige inestabilidad.`, org: 'ficha · cap. 22, p. 7',
    guia: [{ t: 'El VD se dilata contra el émbolo.', s: ['#cor-vd'], c: C.tepEco },
      { t: (R) => `PAM ${R.pam}: sin inestabilidad hemodinámica no es el alto riesgo.`, s: ['[data-fila="pa"]'], c: C.tepRiesgo },
      { t: 'Sube la gravedad del émbolo para ver el paso al alto riesgo.', s: ['#dock'], c: C.tepRiesgo }] },
  'tep-bolo': { tit: 'TEP: más de 500 mL', frase: (R) => `Más de 500 mL al VD que no puede: se dilata, empuja el tabique y el VI se llena menos. IC ${c1(R.ic)}.`, org: 'ficha · cap. 22, p. 10',
    guia: [{ t: 'El VD dilatado empuja el tabique hacia el VI.', s: ['#cor-vd', '#cor-tabique'], c: C.tepHemo },
      { t: (R) => `El gasto no sube (IC ${c1(R.ic)}): por eso el volumen se limita a 500 mL y se guía con la eco.`, s: ['[data-fila="ic"]'], c: C.tepHemo }] },
  balon: { tit: 'Balón de contrapulsación', frase: (R) => `Se hincha al cerrarse la aórtica y empuja la sangre a las coronarias; se vacía antes de que se abra: el VI eyecta contra menos presión. PAM ${R.pam}.`, org: 'ficha · p. 45-46',
    guia: [{ t: 'El balón va en la aorta descendente, con la punta justo por debajo de la subclavia izquierda; 35-40 mL de helio.', s: ['.p-balon'], c: C.iabp },
      { t: 'La onda R del ECG dispara el ciclo: mira la chispa en la tira.', s: ['#tr-ecg'], c: C.iabp },
      { t: 'Se hincha al empezar la diástole, al cerrarse la aórtica: la segunda joroba de la curva arterial. Sube el pico diastólico y la PAM.', s: ['#tr-art'], c: C.f163 },
      { t: 'Se vacía en la contracción isovolumétrica: la presión cae justo antes de que se abra la aórtica. La punteada es la curva sin balón.', s: ['#tr-art'], c: C.f163 },
      { t: 'No mejora la supervivencia. Está contraindicado con insuficiencia aórtica o disección.', s: ['.p-balon'], c: C.iabp }] },
  impella: { tit: 'Impella', frase: (R) => `La hélice saca ${c1(R.imp)} L/min del VI a la aorta sin esperar a la sístole: el VI se vacía y la PCP baja a ${R.pcp}.`, org: 'ficha · p. 47-48',
    guia: [{ t: 'Un catéter entra por la arteria femoral y cruza la válvula aórtica: la punta en «pigtail» queda en el VI.', s: ['.p-pigtail', '.p-canula'], c: C.f164 },
      { t: 'La hélice gira dentro de la jaula y crea un flujo no pulsátil: aspira por la entrada y suelta en la aorta (giro ralentizado).', s: ['.p-jaula', '.p-entrada'], c: C.impella },
      { t: (R) => `La consola da ${c1(R.imp)} L/min de la bomba y ${c1(R.icNat * 1.85)} del corazón. El modelo con gasto total ajusta la bomba solo.`, s: ['.maquina', '[data-fila="ic"]'], c: C.impella },
      { t: (R) => `Descarga el VI: la PCP baja (${R.pcp}) y la curva arterial se estrecha. Con soporte, la PCP de 18-20 deja de ser la meta.`, s: ['[data-fila="pcp"]', '#tr-art'], c: C.impellaEf, org: 'la forma: fisiología general' },
      { t: 'Hemólisis significativa en el 5-10 %; contraindicado con valvulopatía o prótesis aórtica y con trombo en el VI.', s: ['.p-jaula'], c: C.impellaEf }] },
  'impella-alto': { tit: 'Impella a flujo alto: la aórtica ya no abre', frase: (R) => `A ${c1(R.imp)} L/min el VI se vacía tanto que la aórtica no se abre: el pulso desaparece de la curva (${R.pas}/${R.pad}).`, org: 'ficha · p. 47; la curva: fisiología general',
    guia: [{ t: 'Con flujo alto y un VI muy débil, la bomba se lleva toda la sangre que llega.', s: ['.p-entrada', '.p-jaula'], c: C.impella },
      { t: (R) => `El VI no llega a la presión de la aorta: la válvula no se abre (${R.aoAbre} de ${R.aoDe} latidos).`, s: ['#tr-art', '.p-canula'], c: C.impella, org: 'fisiología general' },
      { t: (R) => `La curva arterial se aplana: ${R.pas}/${R.pad}. La PAM se sostiene con flujo continuo.`, s: ['#tr-art', '[data-fila="pa"]'], c: C.impella, org: 'fisiología general' }] },
  ecmo: { tit: 'ECMO venoarterial', frase: (R) => `La bomba saca sangre de la cava, el oxigenador la vuelve roja y la devuelve por la femoral: ${c1(R.ecmo)} L/min contra corriente. El VI aún abre (${R.aoAbre} de ${R.aoDe}).`, org: 'ficha · p. 48-49',
    guia: [{ t: 'La cánula venosa sube por la cava inferior hasta cerca de la AD.', s: ['.p-canula-v'], c: C.ecmo },
      { t: 'La bomba centrífuga crea el flujo; el oxigenador saca el CO₂ y mete el O₂; el calentador la devuelve a 37 °C (Fig. 16.5).', s: ['.p-bomba', '.p-oxigenador', '.p-calentador'], c: C.f165 },
      { t: 'La sangre vuelve por la arteria femoral y sube por la aorta al revés, para llegar al cayado y al cerebro.', s: ['.p-canula-a'], c: C.ecmo },
      { t: 'Soporta los dos ventrículos y el intercambio de gases: es la elección si hay fallo respiratorio.', s: ['[data-fila="spo2"]'], c: C.seleccion }] },
  'ecmo-cerrada': { tit: 'ECMO: el VI ya no abre', frase: (R) => `El chorro que sube por la aorta frena al VI débil: la aórtica abre ${R.aoAbre} de ${R.aoDe} veces, la PCP sube a ${R.pcp} y el pulmón se encharca. Hay que ventearlo.`, org: 'ficha · p. 48-49',
    guia: [{ t: 'El flujo retrógrado sube la poscarga del VI: un problema que no tienen los otros soportes.', s: ['.p-canula-a', '#tr-art'], c: C.ecmoPoscarga },
      { t: (R) => `El VI no puede abrir su válvula: ${R.aoAbre} de ${R.aoDe} latidos. Se dilata.`, s: ['#ecm-corazon'], c: C.ecmoPoscarga },
      { t: (R) => `La PCP sube (${R.pcp}) y aparece el edema: mira las gotas en el pulmón.`, s: ['[data-fila="pcp"]', '#ecm-pulmon'], c: C.ecmoPoscarga, org: 'cuánto: el modelo' },
      { t: 'Se corrige con un balón o un Impella a la vez, o drenando el VI («venteo»): prueba el mando.', s: ['#dock'], c: C.ecmoPoscarga }] },
  'ecmo-venteo': { tit: 'ECMO con venteo', frase: (R, X) => `Venteo con ${({ impella: 'Impella', balon: 'balón', drenaje: 'drenaje del VI' })[X.ajuste.venteo]}: la PCP baja a ${R.pcp} y la aórtica abre ${R.aoAbre} de ${R.aoDe}.`, org: 'ficha · p. 48-49',
    guia: [{ t: 'Para bajar la poscarga del VI: un balón o un Impella a la vez, o drenar el VI para bajar su presión telediastólica.', s: ['#dock'], c: C.ecmoPoscarga },
      { t: (R) => `La PCP baja: ${R.pcp}.`, s: ['[data-fila="pcp"]'], c: C.ecmoPoscarga, org: 'cuánto: el modelo' },
      { t: 'Cuánto baja con cada método no lo dice la fuente: el modelo lo calcula, rotulado.', s: ['[data-fila="pcp"]'], c: C.ecmoPoscarga }] },
  'soporte-no': { tit: 'Este paciente no lleva soporte mecánico', frase: (R, X) => indicacion(X.pac, X.ajuste.soporte).txt, org: 'ficha · p. 45',
    guia: [{ t: (R, X) => indicacion(X.pac, X.ajuste.soporte).txt, s: ['#sello'], c: C.mcs },
      { t: 'Mira el aparato en gris: funciona igual en otro paciente (el del infarto). Ábrelo con Aurelio.', s: ['#esc-aparato'], c: C.mcs }] },
};

// ---------------------------------------------------------------- notas (con su tipo) y «Para profundizar»
export const NOTAS = [
  { k: 'impella-fuentes', tipo: 'discrepan', txt: '<b>¿Qué bomba lleva el Impella?</b> Marino la llama «bomba centrífuga miniatura» y da 2,5-5,5 L/min según el catéter (p. 47). La Guía ESC 2026 de IC de la app habla de «bombas de flujo microaxial (hasta 4-5,5 l/min)». El dibujo enseña la hélice que describen las dos; el nombre del tipo de bomba no se elige.', citas: [C.impella, C.escMcs] },
  { k: 'scvo2-fuentes', tipo: 'discrepan', txt: '<b>ScvO₂ objetivo.</b> Marino (Tabla 14.5): ScvO₂ >50 %. El Manual UMI, para el shock séptico en sus 6 primeras horas: ScvO₂ ≥70 % (o SvO₂ ≥65 %). El monitor enseña las dos y no elige.', citas: [C.t145, C.umi6h] },
  { k: 'pam-fuentes', tipo: 'discrepan', txt: '<b>PAM objetivo.</b> Marino: ≥65 mmHg (Tabla 14.5). El Manual UMI: TAM ≥65-70 mmHg en el séptico. El monitor marca con ≥65 y lo dice.', citas: [C.t145, C.umi6h] },
  { k: 'pcp-fuentes', tipo: 'discrepan', txt: '<b>PCP óptima.</b> La Tabla 16.2 da 19-20 mmHg; el texto de la misma página, 18-20. El monitor da por buena 18-20 y lo dice.', citas: [C.t162] },
  { k: 'hidrocortisona', tipo: 'discrepan', txt: '<b>Hidrocortisona y vasopresina en el séptico.</b> La Tabla 17.2 pide hidrocortisona con noradrenalina «>0,25 µg/kg/min»; el texto, «≥0,25». Para la vasopresina, la p. 15 dice «≥0,2» y la Tabla 17.2, «0,25-0,5».', citas: [C.t172, C.vasopresina] },
  { k: 'vasopresina-u', tipo: 'errata', txt: '<b>Unidad de la vasopresina.</b> El libro imprime «U/h» (Tabla 14.4, p. 13; p. 16). El mando usa 0,03 U/min, la dosis habitual (conocimiento general, no del libro).', citas: [C.vasopresina] },
  { k: 'pcp-soporte', tipo: 'calla', txt: '<b>La PCP con soporte mecánico.</b> La Tabla 16.2 es la presión de llenado para dar volumen; el Impella y el balón descargan el VI a propósito (p. 45, 48). La fuente no da una PCP objetivo con soporte: con un aparato, la fila de la PCP deja de marcarse.', citas: [C.t162, C.impellaEf] },
  { k: 'cuanto', tipo: 'calla', txt: '<b>Cuánto mueve cada mando.</b> La ficha da la dirección (la noradrenalina sube la RVS, el balón sube la PAM, el ECMO sube la poscarga del VI), no cuánto. Las cifras salen del motor del latido de la app: son del modelo.', citas: [C.mcs] },
  { k: 'onda-r', tipo: 'calla', txt: '<b>El disparo del balón.</b> La fuente dice que la onda R «es un disparador habitual» y que el inflado empieza al cerrarse la aórtica (p. 45). Cómo convierte la consola la onda R en el momento del inflado, no lo dice. En el modelo, el balón sigue las fases del motor.', citas: [C.iabp] },
  { k: 'pide-fuente', tipo: 'calla', txt: '<b>Lo que no se dibuja.</b> Marino no da las rpm ni los niveles de la bomba del Impella, su sensor de presión ni su purga; la presión del helio ni la relación 1:2 del balón; ni el gas de barrido, la saturación de salida o la cánula de reperfusión del ECMO. No salen en los aparatos hasta tener fuente.', citas: [C.impella, C.ecmo] },
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
// Sin nombre hasta contestar. Tres tiempos: cabecera → eco → catéter. Cada uno, con su receta del motor.
export const QS = [
  { pac: 'mateo', tipo: 'hemo', g: 0.62, quien: 'Varón de 34 años' },
  { pac: 'mateo', tipo: 'hemo', g: 0.9, quien: 'Varón de 34 años' },
  { pac: 'amparo', tipo: 'septico', g: 0.85, quien: 'Mujer de 58 años' },
  { pac: 'amparo', tipo: 'septico', g: 1, quien: 'Mujer de 58 años' },
  { pac: 'begona', tipo: 'septico', esc: 'anafilaxia', g: 1, quien: 'Mujer de 52 años', real: 'Begoña: anafilaxia (distributivo)', peso: 65 },
  { pac: 'aurelio', tipo: 'cardio', g: 0.75, quien: 'Varón de 67 años' },
  { pac: 'aurelio', tipo: 'cardio', g: 0.92, volemia: 0, quien: 'Varón de 67 años', real: 'Aurelio, horas después: shock cardiogénico con la PCP alta' },
  { pac: 'joaquin', tipo: 'tapon', g: 0.85, quien: 'Varón de 56 años' },
  { pac: 'consuelo', tipo: 'tep', g: 0.95, quien: 'Mujer de 63 años' },
  { pac: 'consuelo', tipo: 'no', g: 0.75, quien: 'Mujer de 63 años', real: 'Consuelo, hora 0: TEP con el VD sobrecargado, sin shock' },
  { pac: 'nerea', tipo: 'septico', esc: 'sepsis', g: 0.9, quien: 'Mujer de 31 años', real: 'Nerea: shock tóxico estreptocócico (distributivo)', peso: 60 },
];
export const OPC_QS = [['hemo', 'Hipovolémico'], ['septico', 'Distributivo'], ['cardio', 'Cardiogénico'], ['tapon', 'Obstructivo: taponamiento'], ['tep', 'Obstructivo: TEP'], ['no', 'No está en shock']];
export const HUELLA = {
  hemo: { pistas: [{ t: 'Taquicardia y una curva arterial estrecha: el ventrículo se vacía.', s: ['#tr-art', '[data-fila="fc"]'], c: C.t151 }, { t: 'En la eco, las cavidades pequeñas y sin derrame.', s: ['#esc-cor'], c: C.t141 }, { t: 'En el catéter: PVC baja, gasto bajo y resistencia alta.', s: ['[data-fila="pvc"]', '[data-fila="ic"]', '[data-fila="irvs"]'], c: C.t141 }], seria: 'PVC baja, gasto bajo y resistencia alta (Tabla 14.1)' },
  septico: { pistas: [{ t: 'Diastólica baja con un pulso amplio: vasos abiertos.', s: ['#tr-art'], c: C.sepHemo, org: 'la forma: fisiología general' }, { t: 'En la eco, un VI que se vacía bien y sin derrame.', s: ['#esc-cor'], c: C.t141 }, { t: 'En el catéter: PVC baja, gasto normal o alto y resistencia baja; ScvO₂ alta.', s: ['[data-fila="pvc"]', '[data-fila="ic"]', '[data-fila="irvs"]', '[data-fila="ven"]'], c: C.t141 }], seria: 'PVC baja, gasto normal o alto y resistencia baja (Tabla 14.1)' },
  cardio: { pistas: [{ t: 'Hipotensión con hipoperfusión (lactato, orina).', s: ['#lab'], c: C.csHemo }, { t: 'En la eco, un VI grande que no se vacía.', s: ['#esc-cor'], c: C.csHemo }, { t: 'En el catéter: gasto bajo con resistencia alta; la PCP alta o, en el 30 %, no.', s: ['[data-fila="pcp"]', '[data-fila="ic"]', '[data-fila="irvs"]'], c: C.csExc }], seria: 'gasto bajo, resistencia alta y una presión de llenado alta (o, en el 30 %, no) (p. 40)' },
  tapon: { pistas: [{ t: 'Taquicardia y un pulso muy estrecho.', s: ['#tr-art'], c: C.obstr, org: 'la forma: fisiología general' }, { t: 'En la eco, el derrame que aprieta las cuatro cámaras.', s: ['#cor-saco'], c: C.vdMed }, { t: 'En el catéter: la PVC y la PCP se igualan.', s: ['[data-fila="pvc"]', '[data-fila="pcp"]'], c: C.vdMed }], seria: 'la PVC alta e igual a la PCP (cap. 18, p. 4)' },
  tep: { pistas: [{ t: 'Taquicardia y taquipnea: lo típico, aunque nada confirma.', s: ['[data-fila="fc"]', '[data-fila="fr"]'], c: C.tepClin }, { t: 'En la eco, el VD dilatado que empuja el tabique.', s: ['#cor-vd'], c: C.tepEco }, { t: 'En el catéter: PVC alta, PCP baja y la presión pulmonar alta.', s: ['[data-fila="pvc"]', '[data-fila="pcp"]', '#tr-pap'], c: C.vdMed }], seria: 'la PVC alta con la PCP normal (cap. 18, p. 4)' },
  no: { pistas: [{ t: 'PAM por encima de 65, el lactato y la orina sin alarma: no hay hipoperfusión.', s: ['[data-fila="pa"]', '#lab'], c: C.t145 }, { t: 'En la eco, el VD sufre: hay que vigilarlo.', s: ['#cor-vd'], c: C.tepEco }, { t: 'Sin inestabilidad, un TEP con el VD sobrecargado es de riesgo intermedio.', s: ['[data-fila="pa"]'], c: C.tepRiesgo }], seria: 'sin hipotensión ni hipoperfusión' },
};

// ---------------------------------------------------------------- Mayéutica (muestra amplia): guía, examen y el caso
// Las respuestas viven aquí, nunca en el HTML hasta contestar. Los enunciados con cifras leen el modelo (R).
// «prepara»: el estado del modelo para la pregunta; «predice»: se tapan las cifras, el dibujo y la consola.
export const PREGUNTAS = [
  { id: 'G1', grupo: 'guia', predice: true, prepara: { pac: 'aurelio', ajuste: { soporte: 'no' }, escena: 'balon' },
    enunciado: 'Vas a encender el balón de Aurelio. Antes de hacerlo: <b>¿en qué momento del latido se hinchará?</b>',
    opciones: [
      { t: 'Con la onda R, al empezar la sístole, para empujar con el VI.', porque: 'Hinchado en la sístole, el VI eyectaría contra el balón lleno: más poscarga y menos volumen sistólico, justo lo contrario de lo que buscas en Aurelio. La onda R solo dispara el ciclo.' },
      { t: 'Al cerrarse la válvula aórtica, al empezar la diástole.', ok: true },
      { t: 'Al abrirse la válvula aórtica, en la eyección rápida.', porque: 'En la eyección la válvula está abierta: el balón lleno taparía la salida del VI. Aurelio tendría menos gasto y más trabajo cardíaco.' },
      { t: 'En la contracción auricular, ya al final de la diástole.', porque: 'Ahí es cuando el balón se vacía, no cuando se hincha: perdería casi toda la diástole y el pico diastólico apenas subiría en Aurelio.' }],
    explica: 'Se hincha al empezar la diástole, justo tras cerrarse la aórtica, y se vacía en la contracción isovolumétrica, antes de que se abra (p. 45; Fig. 16.3).', cita: C.iabp,
    comprueba: { txt: 'Compruébalo: enciende el balón', ajuste: { soporte: 'balon' }, mira: 'Mira la curva arterial: la segunda joroba sale tras la muesca del cierre aórtico, y la punteada es la curva sin balón.' } },
  { id: 'G2', grupo: 'guia', predice: true, prepara: { pac: 'aurelio', ajuste: { soporte: 'impella', impella: 2.5 }, escena: 'impella' },
    enunciado: 'Aurelio lleva el Impella a 2,5 L/min. Lo subes a 5,5. <b>¿Qué esperas en la PCP y en la curva arterial?</b>',
    opciones: [
      { t: 'La PCP sube: llega más sangre al corazón izquierdo.', porque: 'La bomba saca sangre del VI, no la mete: el VI se vacía y su presión de llenado baja. Si esperaras que suba, frenarías el aparato que más descarga a Aurelio.' },
      { t: 'La PCP no cambia: el Impella trabaja en la aorta.', porque: 'La entrada está en el VI (p. 47): lo vacía. Pensar que no lo toca te haría ignorar la PCP que cae con el flujo.' },
      { t: 'La PCP baja y el pulso de la curva arterial se estrecha.', ok: true },
      { t: 'La PCP baja y el pulso se ensancha, por más volumen sistólico.', porque: 'El flujo de la bomba es continuo: sustituye al que eyecta el VI. El pulso se estrecha y, si el VI ya no abre la aórtica, casi desaparece.' }],
    explica: 'Descarga el VI y sube el gasto (p. 48). Que la curva se aplane al pasar el flujo de pulsátil a continuo es fisiología general; el modelo lo calcula.', cita: C.impellaEf,
    comprueba: { txt: 'Compruébalo: sube el Impella a 5,5', ajuste: { impella: 5.5 }, mira: 'Mira la PCP y la curva arterial; y en la consola, cuánto da la bomba y cuánto el corazón.' } },
  { id: 'G3', grupo: 'guia', predice: true, prepara: { pac: 'aurelio', rec: { esc: 'fallo', g: 1, volemia: -600 }, ajuste: { soporte: 'ecmo', ecmo: 3 }, escena: 'ecmo' },
    enunciado: 'Aurelio, con el VI muy débil, en ECMO VA a 3 L/min. Subes a 6. <b>¿Qué le pasa a su VI?</b>',
    opciones: [
      { t: 'Descansa: el ECMO hace el trabajo y el VI se vacía.', porque: 'El ECMO saca la sangre de las venas, no del VI: el VI sigue recibiendo la que vuelve por el pulmón y tiene que abrir su válvula contra la aorta llena. Lo creerías protegido mientras se encharca.' },
      { t: 'Le cuesta más abrir la aórtica: se dilata y la PCP sube.', ok: true },
      { t: 'Nada: el ECMO devuelve la sangre lejos, en la femoral.', porque: 'La sangre sube por la aorta al revés hasta el cayado (p. 48): sube la poscarga del VI. Aurelio podría hacer un edema agudo de pulmón.' },
      { t: 'Abre la aórtica con más fuerza por el oxígeno que recibe.', porque: 'El O₂ no le quita poscarga: la presión de la aorta sigue subiendo con el flujo retrógrado. El VI débil abre cada vez menos.' }],
    explica: 'El flujo retrógrado sube la poscarga del VI; puede bajar su gasto y dar edema agudo de pulmón (p. 48).', cita: C.ecmoPoscarga,
    comprueba: { txt: 'Compruébalo: sube el ECMO a 6 L/min', ajuste: { ecmo: 6 }, mira: 'Mira cuántos latidos abre la aórtica, la PCP y las gotas en el pulmón.' } },
  { id: 'E1', grupo: 'examen', prepara: { pac: 'amparo', ajuste: { na: 25 }, horas: 6 },
    enunciado: (R) => `Amparo, hora 6: noradrenalina a 25 µg/min, PAM ${R.pam}, ScvO₂ ${R.ven} %, lactato ${c1(R.lact)} mmol/L, gap de PCO₂ ${R.gap} mmHg. <b>¿Qué lectura es la correcta?</b>`,
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
      { t: 'La fiebre, en la mitad de los pacientes.', porque: 'La fiebre del 50 % (con bacteriemia en el 15 %) es la del balón (p. 47). Si la buscas en el Impella, pasarás por alto la orina oscura de la hemólisis.' },
      { t: 'El síndrome compartimental de la pierna.', porque: 'El 10 % es del ECMO (p. 48). Con el Impella vigilarías la pierna, pero no lo que es más propio de él.' },
      { t: 'La hemólisis significativa, en el 5-10 %.', ok: true },
      { t: 'El ictus, en el 6 %.', porque: 'El 6 % de ictus es del ECMO VA (p. 48). En un Impella, la hemólisis es lo que la fuente dice que es más frecuente.' }],
    explica: 'La hemólisis significativa (5-10 %) es mayor con el Impella que con otros soportes; además, más sangrado mayor e isquemia de la pierna que con el balón (p. 48).', cita: C.impellaEf },
  { id: 'E5', grupo: 'examen',
    enunciado: 'Shock cardiogénico refractario tras un IAM, con un fallo respiratorio que ya no se corrige con el respirador. <b>¿Qué soporte prefiere la fuente?</b>',
    opciones: [
      { t: 'Ninguno: el soporte mecánico no mejora la supervivencia.', porque: 'Ningún método ha mejorado la supervivencia en las comparaciones (p. 45), pero hay pacientes que se benefician y se usa para ganar tiempo. Sin soporte, este paciente no saldría del shock.' },
      { t: 'Un balón de contrapulsación, el más disponible.', porque: 'El balón descarga el VI pero no oxigena: el fallo respiratorio seguiría igual.' },
      { t: 'Un Impella izquierdo, que descarga mejor el VI.', porque: 'El Impella no oxigena la sangre: el fallo respiratorio seguiría. Para los dos ventrículos y el pulmón haría falta otra cosa.' },
      { t: 'Un ECMO venoarterial.', ok: true }],
    explica: 'El ECMO VA soporta el flujo y el intercambio de gases: es el método preferido si el shock cardiogénico se acompaña de fallo respiratorio (p. 48-49).', cita: C.seleccion },
];
// El caso de Aurelio: evoluciona en el reloj del paciente. Cada paso prepara el modelo y añade a la ficha lo nuevo.
export const CASO = {
  titulo: 'El infarto que no se aguanta (Aurelio)',
  pasos: [
    { dia: 'Hemodinámica · hora 0', prepara: { pac: 'aurelio', escena: 'corazon', canales: 'cabecera' }, tipo: 'test',
      ficha: (R) => [['Paciente', 'Aurelio, 67 años, 82 kg'], ['Motivo', 'IAM anterior', 1], ['PA', `${R.pas}/${R.pad} mmHg`, 1], ['FC', `${R.fc} lpm`, 1], ['Lactato', `${c1(R.lact)} mmol/L`, 1], ['Diuresis', `${c1(R.diur)} mL/kg/h`, 1], ['Pulmón', 'sin crepitantes', 1]],
      enunciado: '<b>¿Insuficiencia cardíaca o shock cardiogénico?</b>',
      opciones: [
        { t: 'Shock: hay hipoperfusión, no solo un gasto bajo.', ok: true },
        { t: 'Insuficiencia cardíaca: sin crepitantes no es shock.', porque: 'La congestión no define el shock: lo define la hipoperfusión (p. 40). Tratarlo como una IC leve retrasa lo que Aurelio necesita.' },
        { t: 'Insuficiencia cardíaca: falta saber el IC por catéter.', porque: 'El IC bajo es típico, pero la hipoperfusión ya se ve en la cabecera: la PA, el lactato y la orina (p. 40). Esperar al catéter retrasa el tratamiento.' },
        { t: 'Shock hipovolémico: no hay congestión y la PA es baja.', porque: 'Un IAM anterior con gasto bajo es cardiogénico; que la PCP no esté alta pasa en hasta el 30 % (p. 40). Si lo tratas como hipovolémico, olvidas el corazón.' }],
      explica: 'El shock cardiogénico comparte con la IC el gasto bajo y la RVS alta; lo distingue la hipoperfusión (p. 40).', cita: C.csHemo },
    { dia: 'Hora 0 · catéter de arteria pulmonar', prepara: { pac: 'aurelio', escena: 'corazon', canales: 'todos' }, tipo: 'test',
      ficha: (R) => [['PCP', `${R.pcp} mmHg`, 1], ['IC', `${c1(R.ic)} L/min/m²`, 1], ['PVC', `${R.pvc} mmHg`, 1], ['IRVS', `${R.irvs}`, 1]],
      enunciado: (R) => `PCP ${R.pcp} con IC ${c1(R.ic)}. <b>¿Qué haces primero?</b>`,
      opciones: [
        { t: 'Dobutamina: el problema es la bomba.', porque: 'Con la PCP baja, el VI aún no está bien lleno: el inotrópico subiría el trabajo de un corazón vacío y la FC (p. 43-44). Primero, el llenado.' },
        { t: 'Furosemida para prevenir el edema.', porque: 'No hay congestión que tratar: con la PCP en ' + 'esa cifra el diurético bajaría aún más el llenado y el gasto de Aurelio.' },
        { t: 'Volumen hasta una PCP de 18-20, mirando el gasto.', ok: true },
        { t: 'Impella ya: los fármacos aumentan el trabajo.', porque: 'El soporte no se retrasa si los fármacos no bastan (p. 44), pero antes hay que corregir un llenado bajo, que puede subir el gasto por sí solo (p. 42).' }],
      explica: 'La PCP no siempre está alta en el shock cardiogénico; entonces el volumen puede subir el gasto, hasta la PCP más alta que lo suba sin edema: 18-20 (p. 42; ver la nota de fuentes).', cita: C.llenado,
      comprueba: { txt: 'Compruébalo: dale 2 × 250 mL', volumen: 500, mira: 'Mira cómo sube la PCP y cuánto sube el IC.' } },
    { dia: 'Hora 1 · el plan del residente', prepara: { pac: 'aurelio', volumen: 500, horas: 1, escena: 'corazon', canales: 'todos' }, tipo: 'error',
      ficha: (R) => [['Tras 500 mL', `PCP ${R.pcp} · IC ${c1(R.ic)} · PAM ${R.pam}`, 1]],
      enunciado: 'El R1 escribe el plan del inotrópico. <b>Puede haber 0, 1 o 2 errores.</b> Toca las frases que creas falsas.',
      frases: [
        { t: 'Empiezo milrinona, que da menos taquicardia: es la mejor con hipotensión.', mal: true, buena: 'La milrinona es vasodilatadora: su principal desventaja en el shock cardiogénico es la hipotensión (p. 44).', cita: C.milri },
        { t: 'Mejor dobutamina, a 3-5 µg/kg/min.', cita: C.dobuta },
        { t: 'Su FC subirá, habitualmente 5-15 lpm.', cita: C.dobuta },
        { t: 'Si no basta, levosimendán 72 h, que tiene una semivida de 80 h.', mal: true, buena: 'La semivida es de 80 h, pero las infusiones suelen limitarse a 24 h (p. 44).', cita: C.levo }],
      explica: 'Dobutamina de inicio; la milrinona y el levosimendán bajan la PA.', cita: C.dobuta },
    { dia: 'Hora 6 · noradrenalina + dobutamina, y no basta', prepara: { pac: 'aurelio', volumen: 500, horas: 6, ajuste: { na: 8, dobuta: true, soporte: 'impella', impella: 3.5 }, escena: 'impella', canales: 'todos' }, tipo: 'destapa',
      ficha: () => [['Hora 6', 'sigue en shock: se pone un Impella', 1]],
      enunciado: '<b>¿Qué hace el Impella y qué esperas ver en el monitor? Son tres cosas.</b>',
      puntos: [
        { t: 'Saca sangre del VI y la suelta en la aorta, en <span class="hl-azul">flujo continuo</span>, 2,5-5,5 L/min.', c: C.impella },
        { t: 'Descarga el VI: <span class="hl-verde">baja la PCP</span> y sube el gasto total (bomba + corazón).', c: C.impellaEf },
        { t: 'El pulso de la curva se estrecha; con flujo alto, la aórtica puede dejar de abrir.', c: C.impella, org: 'fisiología general' }] },
    { dia: 'Hora 18 · el giro', prepara: { pac: 'aurelio', rec: { esc: 'fallo', g: 0.95, volemia: -900, pao2: 58 }, horas: 18, ajuste: { na: 10, dobuta: true, soporte: 'impella', impella: 3.5 }, escena: 'impella', canales: 'todos' }, tipo: 'test',
      ficha: (R) => [['Hora 18', `SpO₂ ${R.spo2} % con FiO₂ alta en el respirador`, 1], ['Gasto total', `${c1(R.gcTotal)} L/min`, 1]],
      enunciado: 'Aurelio se hunde y ahora tiene un fallo respiratorio que el respirador no corrige. <b>¿Qué soporte prefiere la fuente?</b>',
      opciones: [
        { t: 'Subir el Impella a 5,5 L/min.', porque: 'Más flujo no oxigena: el fallo respiratorio seguiría. Y a flujo alto, más hemólisis (p. 48).' },
        { t: 'Añadir un balón de contrapulsación.', porque: 'El balón descarga el VI pero no oxigena: Aurelio seguiría hipoxémico.' },
        { t: 'ECMO venoarterial.', ok: true },
        { t: 'Esperar: el soporte no mejora la supervivencia.', porque: 'Iniciarlo tras el fallo multiorgánico es un «puente a ningún sitio»: no hay que retrasarlo (p. 44).' }],
      explica: 'El ECMO VA da flujo y oxigenación: de elección si el shock cardiogénico se acompaña de fallo respiratorio (p. 48-49).', cita: C.seleccion },
    { dia: 'Día 2 · ECMO a 5 L/min', prepara: { pac: 'aurelio', rec: { esc: 'fallo', g: 1, volemia: -600 }, horas: 30, ajuste: { soporte: 'ecmo', ecmo: 5.5 }, escena: 'ecmo', canales: 'todos' }, tipo: 'test',
      ficha: (R) => [['Día 2', `ECMO ${c1(R.ecmo)} L/min · la aórtica abre ${R.aoAbre} de ${R.aoDe} · PCP ${R.pcp}`, 1]],
      enunciado: 'Con el ECMO, la PCP sube y aparece edema en la Rx. <b>¿Qué haces?</b>',
      opciones: [
        { t: 'Subir el flujo del ECMO para descargar el corazón.', porque: 'Más flujo retrógrado es más poscarga para el VI (p. 48): se dilataría más y el edema empeoraría.' },
        { t: 'Ventear el VI: un balón o un Impella a la vez, o drenarlo.', ok: true },
        { t: 'Furosemida y esperar a que el VI recupere.', porque: 'El problema es la poscarga que pone el ECMO, no un exceso de volumen: el diurético no deja abrir la aórtica.' },
        { t: 'Bajar la noradrenalina para bajar la poscarga.', porque: 'La poscarga viene del chorro que sube por la aorta; sin vasopresor, la PAM caería y el VI seguiría sin abrir.' }],
      explica: 'El flujo retrógrado sube la poscarga del VI; se combate con un balón o un Impella a la vez, o drenando el VI («venteo») (p. 48-49).', cita: C.ecmoPoscarga,
      comprueba: { txt: 'Compruébalo: ventea con un balón', ajuste: { venteo: 'balon' }, mira: 'Mira la PCP y cuántas veces abre ahora la aórtica.' } },
    { dia: 'Día 3 · la pierna', prepara: { pac: 'aurelio', rec: { esc: 'fallo', g: 1, volemia: -600 }, horas: 54, ajuste: { soporte: 'ecmo', ecmo: 5.5, venteo: 'balon' }, escena: 'balon', canales: 'todos' }, tipo: 'test',
      ficha: () => [['Día 3', 'la pierna del balón sin pulso pedio; mueve los dedos y siente', 1]],
      enunciado: 'La pierna del balón no tiene pulso pedio, pero Aurelio mueve los dedos y la siente. <b>¿Qué haces con el balón?</b>',
      opciones: [
        { t: 'Lo retiras: sin pulsos, el balón sobra.', porque: 'La pérdida de pulsos sola no obliga a retirarlo si la función sensitiva y motora está intacta (p. 46). Volvería el edema del VI que el balón ventea.' },
        { t: 'Lo dejas y vigilas la sensibilidad y el movimiento.', ok: true },
        { t: 'Lo pasas a la otra femoral, la del ECMO.', porque: 'La fuente no da esa salida; y la isquemia de la pierna ya es frecuente con el ECMO (17 %, p. 48).' },
        { t: 'Lo dejas y bajas la anticoagulación.', porque: 'El soporte necesita anticoagulación plena (p. 48); bajarla sin indicación arriesga el circuito y el balón.' }],
      explica: 'Sin pulsos pero con función sensitivomotora, el balón se queda; si se pierde la función, se retira de inmediato y puede hacer falta cirugía (p. 46).', cita: C.iabpCompl },
  ],
  llevas: [
    'Hipoperfusión = shock; y con la PCP baja, volumen hasta 18-20 antes que fármacos (p. 40, 42).',
    'Balón: se hincha al cerrarse la aórtica. Impella: aspira del VI. ECMO VA: oxigena, pero frena al VI (p. 45-48).',
    'Con fallo respiratorio, ECMO VA; si el VI no abre, venteo (p. 48-49).',
  ],
};
