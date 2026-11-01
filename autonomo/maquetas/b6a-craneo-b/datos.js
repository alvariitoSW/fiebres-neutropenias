// Cráneo B · datos: citas, pacientes, guías, fuentes y notas. Cada cifra lleva su página (PDF = página del PDF).
export const PDF = '../../docs/marino-2024-neurologia-caps45-47.pdf';
export const cita = (p, id) => `<span class="cita"><a class="cita-pdf" href="${PDF}#page=${p}" target="_blank" rel="noopener">PDF p. ${p}</a> · <button type="button" class="ver-ficha" data-resaltar="#${id}" data-pag="${p}">Ver en la ficha</button></span>`;
export const IMG = { hematoma: ['mar-fig47-3-hematoma.jpg', 'Fig. 47.3 · hematoma con sangre ventricular (TC)', 43, 'mn-hic'], ventricular: ['mar-fig47-3-hematoma.jpg', 'Fig. 47.3 · hematoma con sangre ventricular (TC)', 43, 'mn-hic'],
  hsa: ['mar-fig47-4-hsa.jpg', 'Fig. 47.4 · sangre en las cisternas de la base (TC)', 45, 'mn-hsa'], edema: ['mar-fig47-2-hemorragia-tpa.jpg', 'Fig. 47.2 · TC tras trombólisis: hemorragia en un infarto extenso', 39, 'mn-isq-hemorragia'],
  tronco: ['mar-fig45-1-causas-consciencia.jpg', 'Fig. 45.1 · causas de la alteración de la consciencia', 4, 'mn-cons-causas'] };
export const PRES = {
  abundio: ['Abundio · TCE', { tipo: 'hematoma', masa: 68, pas: 136 }], segismundo: ['Segismundo · warfarina', { tipo: 'hematoma', masa: 52, pas: 196, anti: 'warfarina' }],
  clotilde: ['Clotilde · infarto grande', { tipo: 'edema', masa: 50, pas: 150, sensor: false }], petronila: ['Petronila · HSA', { tipo: 'hsa', masa: 25, pas: 130 }],
  leovigildo: ['Leovigildo · protuberancia', { tipo: 'tronco', pas: 170 }] };
export const IDEA = 'El cráneo es una caja cerrada: si crece algo dentro, la presión sube, el cerebro se desplaza por la tienda y lo ves en la pupila y en la mano. <span class="org">caja cerrada: Libro Azul, neurología parte 1 · pupila y mano: Marino p. 10-11 · PIC <20: p. 45 · cuánto sube cada cosa: ilustrativo</span>';
const Z = { uncus: 'uncus', tronco: 'tronco', ventr: 'ventr', cist: 'cist', cara: 'cara', mano: 'mano' };
// Guías de 3-5 pasos: t texto · z zonas que se encienden · p página · f id de la ficha · o origen · haz [acción, valor] + btn
export const GUIAS = {
  abundio: ['Abundio · masa que crece', [
    { t: 'El cráneo es una caja cerrada: lo que añade la masa lo paga el cerebro con presión. PIC <20 mmHg es el objetivo.', z: ['ventr'], p: 45, f: 'mn-hic-pic', o: 'caja cerrada: Libro Azul (neurología, parte 1, p. 3-5) · PIC <20: ficha p. 45' },
    { t: 'Sube la masa un poco: la línea media se desvía y el ventrículo del lado se aplasta.', z: ['ventr'], p: 45, f: 'mn-hic-pic', o: 'ficha (dirección); tamaños ilustrativos', haz: ['mas', 10], btn: 'masa +10 %' },
    { t: 'El uncus del lóbulo temporal baja por la tienda y aprieta el III par: la pupila de ese lado se dilata y se fija. Es una masa en expansión.', z: ['uncus', 'cara'], p: 11, f: 'mn-tabla-45-4', o: 'ficha · Tabla 45.4; que sea el lado de la masa: inferencia' },
    { t: 'Si sigue, el tronco se comprime de arriba abajo: la mano pasa de localizar a flexión (tálamo) y a extensión (mesencéfalo-protuberancia alta).', z: ['tronco', 'mano'], p: 10, f: 'mn-coma-posturas', o: 'ficha p. 10; el orden flexión → extensión: inferencia' },
    { t: 'Baja la presión: salino hipertónico en bolo. El cuadro retrocede de abajo arriba.', z: ['ventr', 'cara'], p: 41, f: 'mn-isq-edema-manejo', o: 'ficha (dirección); cuánto baja: ilustrativo', haz: ['hiper'], btn: 'salino 3 %' }]],
  segismundo: ['Segismundo · el hematoma que crece', [
    { t: 'Warfarina y sangrado: el hematoma crece mientras el anticoagulante siga actuando. Revertirlo es lo primero.', z: ['ventr'], p: 42, f: 'mn-hic-warfarina', o: 'ficha' },
    { t: 'Pasan las horas sin revertir: la masa crece y aparece el sello.', z: ['ventr', 'uncus'], p: 42, f: 'mn-hic-warfarina', o: 'ficha (dirección); velocidad ilustrativa', haz: ['hora3'], btn: 'avanzar 3 h' },
    { t: 'Revierte con vitamina K 10 mg IV y concentrado de complejo protrombínico (Tabla 47.4); el crecimiento se frena.', z: ['ventr'], p: 44, f: 'mn-tabla-47-4', o: 'ficha · Tabla 47.4', haz: ['rev'], btn: 'revertir' },
    { t: 'Objetivo de PAS <140 y PPC 50-70 con PIC <20. Con PAS por encima el hematoma crece más deprisa (ilustrativo).', z: ['ventr'], p: 45, f: 'mn-hic-datos', o: 'ficha p. 45' }]],
  clotilde: ['Clotilde · edema del infarto', [
    { t: 'Dos edemas: citotóxico (la célula muerta se hincha) y vasogénico (se rompe la barrera). La caja se llena sin que haya sangrado.', z: ['ventr'], p: 40, f: 'mn-isq-edema', o: 'ficha' },
    { t: 'No se monitoriza la PIC en el ictus isquémico: se vigila con la pupila y el nivel de consciencia (inferencia: la ficha no lo dice).', z: ['cara'], p: 40, f: 'mn-isq-edema-manejo', o: 'ficha p. 40; vigilancia clínica: inferencia' },
    { t: 'Salino hipertónico más eficaz que manitol en el ictus isquémico, en bolos, con Na⁺ 145-155.', z: ['ventr'], p: 41, f: 'mn-isq-edema-manejo', o: 'ficha · Tabla 47.3', haz: ['hiper'], btn: 'salino 3 % 250 mL' },
    { t: 'Si empeora con tratamiento médico, la caja se abre: hemicraniectomía descompresiva en el infarto maligno de la ACM (en los ensayos, ≤60 años y ≤48 h).', z: ['ventr', 'uncus'], p: 40, f: 'mn-isq-edema-manejo', url: 'https://www.rcemlearning.co.uk/modules/stroke-in-the-ed/lessons/specific-stroke-syndromes/topic/malignant-middle-cerebral-artery-infarct/', uw: 'RCEM (web)', o: 'fuente web (RCEM); Marino p. 40 solo la nombra tras tPA; magnitud ilustrativa', haz: ['cran'], btn: 'hemicraniectomía' }]],
  petronila: ['Petronila · hemorragia subaracnoidea', [
    { t: 'La sangre rellena las cisternas de la base (Fig. 47.4). Si el aneurisma sigue abierto, resangra con PAS >140.', z: ['cist'], p: 47, f: 'mn-hsa-inmediato', o: 'ficha' },
    { t: 'Cerrar el aneurisma antes de 3 días, nunca más allá de 7-10. El tranexámico no previene el resangrado.', z: ['cist'], p: 47, f: 'mn-hsa-aneurisma', o: 'ficha', haz: ['exc'], btn: 'cerrar aneurisma' },
    { t: 'Entre los días 4 y 14 las arterias de la base se estrechan (Doppler para el vasoespasmo): la velocidad sube y el GCS pierde 2 puntos.', z: ['cist', 'cara'], p: 48, f: 'mn-hsa-vigilar', o: 'ficha', haz: ['dia5'], btn: 'ir al día 5' },
    { t: 'Nimodipino 60 mg/4 h por vía oral, 3 semanas: menos déficits, misma supervivencia. Con sangre en los ventrículos, hidrocefalia: drenaje y PIC <20.', z: ['cist', 'ventr'], p: 48, f: 'mn-hsa-nimodipino', o: 'ficha', haz: ['nimo'], btn: 'dar nimodipino' }]],
  leovigildo: ['Leovigildo · ojos abiertos', [
    { t: 'Abre los ojos y no habla ni se mueve: parece un coma. Pero obedece con los ojos: despierto y consciente.', z: ['cara'], p: 3, f: 'mn-cons-lockedin', o: 'ficha · Tabla 45.1' },
    { t: 'Es el síndrome del cautiverio: lesión bilateral de la protuberancia ventral. Solo quedan los movimientos verticales de los ojos y el parpadeo.', z: ['tronco', 'cara'], p: 3, f: 'mn-cons-lockedin', o: 'ficha' },
    { t: 'La presión no está alta: aquí el problema no es la caja, es el tronco. Mismo corte, otra lesión.', z: ['tronco'], p: 3, f: 'mn-cons-lockedin', o: 'ficha' }]],
};
export const FUENTES = [['Marino, UCI (2024), cap. 45 · p. 2-18, cap. 47 · p. 34-51', 'PDF'], ['Ficha «Hemorragia intracerebral» y «HSA» de la app, con la PPC', 'ficha'], ['Manual UMI de la app, hipertensión intracraneal: PPC <50 a evitar, hiperventilación 30-35 transitoria', 'otra fuente ya cotejada']];
export const NOTAS = [['ilustrativo', 'La magnitud de la craniectomía, del manitol, del salino y de la masa, y el umbral «PPC <10 = sin flujo», son ilustrativos: Marino solo dice «sube» y «baja». Ninguna de esas cifras es de Marino.'],
  ['fisiología general', 'Topes del monitor: PIC máxima 80 mmHg y PAM máxima 150 mmHg (el modelo no muestra cifras mayores). Son fisiología general, no una cifra de la ficha.'],
  ['la fuente no dice', 'GCS 9 de la HSA al ingreso y el «retira» del brazo en el estadio 2: ilustrativos; Marino no gradúa el GCS de cada tipo de masa.'],
  ['la fuente no dice', 'Umbral quirúrgico del hematoma (>20 mL y desplazamiento >5 mm): viene del Manual UMI de la app, no de Marino.'],
['la fuente no dice', 'Marino no trae Monro-Kellie, la curva presión-volumen ni la autorregulación (solo una mención, p. 45). La forma de la subida de la PIC con la masa es ilustrativa. Otra fuente pendiente.'],
  ['la fuente no dice', 'Cuánto baja la PIC cada drenaje, el salino o el manitol, y el tamaño de la masa que provoca cada signo: solo «sube» y «baja». Magnitudes ilustrativas; la presión diastólica supuesta es el 55 % de la sistólica.'],
  ['las fuentes discrepan', 'Convulsiones tras el ictus: 2-5 % (Tabla 46.1) frente a 20 % (p. 41). No afecta a este modelo.'],
  ['errata de la fuente', 'Marino p. 44 imprime idarucizumab 2,5 mg; la dosis es 5 g (2 × 2,5 g en 2 infusiones). Ficha técnica: <a href="https://www.medicines.org.uk/emc/product/5073/smpc" target="_blank" rel="noopener">eMC (SmPC)</a> · <a href="https://www.ema.europa.eu/es/documents/product-information/praxbind-epar-product-information_es.pdf" target="_blank" rel="noopener">EMA</a>. Este modelo no la muestra.'],
  ['tabla incompleta', 'Este modelo solo muestra la warfarina (vitamina K 10 mg + CCP); protamina, enoxaparina, desmopresina y CCP 35/50 U/kg están en la Tabla 47.4 de la ficha. ' + cita(44, 'mn-tabla-47-4')],
  ['hemicraniectomía', 'Infarto maligno de ACM: la cirugía reduce la mortalidad en ≤60 años y ≤48 h (resumen de <a href="'+'https://www.rcemlearning.co.uk/modules/stroke-in-the-ed/lessons/specific-stroke-syndromes/topic/malignant-middle-cerebral-artery-infarct/'+'" target="_blank" rel="noopener">RCEM</a>); en >60 años, DESTINY II: <a href="https://pubmed.ncbi.nlm.nih.gov/24645942/" target="_blank" rel="noopener">PubMed</a>. No se abrió el texto de las guías AHA/ESO: sin grado de recomendación. Fuera de Marino.']];
export const PROFUNDIZAR = ['Test de apnea y muerte encefálica (Tabla 45.6): ficha «Muerte encefálica».', 'Autorregulación cerebral y curva presión-volumen: otra fuente pendiente.', 'Hiperventilación y PaCO₂: Manual UMI, hipertensión intracraneal.', 'Estado epiléptico no convulsivo en el coma: ficha «Estado epiléptico».'];
export const CRECERA = ['Reloj de 21 días de la HSA con Doppler real', 'Test de apnea en el dock de la muerte encefálica', 'Vasopresor del shock vivo en el mando de la PA'];
