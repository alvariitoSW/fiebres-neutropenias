// Los datos del receptor vivo (maqueta b3-receptor v2): citas, tablas RECEPTORES / CELULAS / FARMACOS, PACIENTES, ESTADOS y la función efecto().
// Sin dibujo. Partido sin cambiar lo que hace: el resto de archivos de esta carpeta lo importan.
import * as I from '../../../js/core/dibujo-iso.js';
import { instalarMonitor } from '../../../js/core/monitor.js';
I.instalarGrabado(); instalarMonitor();
export const $ = id => document.getElementById(id);
export const REDUCIR = matchMedia('(prefers-reduced-motion: reduce)').matches;
export const clamp = (v, a, b) => Math.min(b, Math.max(a, v));
export const coma = (x, d = 0) => (+x).toFixed(d).replace('.', ',');
export const n1 = x => +x.toFixed(1);
export const NS = 'http://www.w3.org/2000/svg';
export const PDF_S = '../../docs/marino-2024-shock-caps14-17.pdf';
export const PDF_R = '../../docs/marino-2024-respiratory-management-caps22-26.pdf';
export const PDF_C = '../../docs/marino-2024-cardiac-disorders-caps18-21.pdf';
export const PDF_T = '../../docs/marino-2024-toxicologia-caps52-53-apendices.pdf';
export const IMG52 = '../../js/modules/libros/img/mar-fig52-4-glucagon.jpg';

/* ============================================================
   1. Citas: «Ver en la ficha» (el enlace cruzado de la app) y el PDF de segunda opción
   ============================================================ */
export const CARDIO = ['cardiologia', 'merinoCardiologia', 'panel-merino-cardio-tabs'];
export const NEUMO = ['neumologia', 'merinoNeumologia', 'panel-merino-neumo-tabs'];
export const TOX = ['libros', 'marinoToxicos', 'panel-marino-tox-tabs'];
export const UMI = ['sobrevivirUmi', 'manualUmi', 'panel-manual-umi-tabs'];
// [destino, título de la ficha, nombre corto, PDF, prefijo del capítulo en el chip]
export const FICHA = {
  'mc-definiciones': [CARDIO, 'Shock: definiciones y monitorización', 'Shock: definiciones', PDF_S, ''],
  'mc-vasopresores': [CARDIO, 'Vasopresores en el shock: fármacos y dosis', 'Vasopresores', PDF_S, ''],
  'mc-cardiogenico-farmaco': [CARDIO, 'Shock cardiogénico: soporte farmacológico', 'Cardiogénico: fármacos', PDF_S, ''],
  'mc-shock-septico': [CARDIO, 'Shock séptico: definiciones y manejo', 'Shock séptico', PDF_S, ''],
  'mc-anafilaxia': [CARDIO, 'Anafilaxia', 'Anafilaxia', PDF_S, ''],
  'mc-sca-tratamiento': [CARDIO, 'Síndrome coronario agudo: tratamiento', 'SCA: tratamiento', PDF_C, 'cap. 20, '],
  'neumo-asma-agudo': [NEUMO, 'Asma aguda', 'Asma aguda', PDF_R, 'cap. 23, '],
  'mt-bzd-betabloq': [TOX, 'Benzodiacepinas y betabloqueantes', 'Betabloqueantes y glucagón', PDF_T, 'cap. 52, '],
  'umi-vasoactivos': [UMI, 'Fármacos vasoactivos: receptores y dosis', 'Manual UMI: vasoactivos', null, ''],
};
export const pag = p => (/[-,]/.test(String(p)) ? 'pp. ' : 'p. ') + p;
export const primeraPag = p => String(p).match(/\d+/)[0];
export function cita(c) {
  const [[esp, view, panel], titulo, corto, pdf, cap] = FICHA[c.f];
  return `<span class="cita"><button type="button" class="cita-ir${pdf ? '' : ' otra'}" data-especialidad="${esp}" data-view="${view}" data-panel="${panel}" data-tab="${c.f}" data-resaltar="#${c.id}" data-titulo="${titulo}" data-sitio="${c.sitio}">Ver en la ficha: ${corto} · ${c.sitio} →</button>${pdf ? `<a class="cita-pdf" href="${pdf}#page=${primeraPag(c.p)}" target="_blank" rel="noopener">PDF, ${cap}${pag(c.p)}</a>` : ''}</span>`;
}
export function chip(c) {
  if (!c) return '';
  const [, , , pdf, cap] = FICHA[c.f];
  return pdf ? `<span class="org fch">ficha · ${cap}${pag(c.p)}</span>` : `<span class="org otra">otra fuente: Manual UMI</span>`;
}
export function citaCorta(c) {
  const [[esp, view, panel], titulo, , pdf, cap] = FICHA[c.f];
  return `<span class="cita-c"><button type="button" class="cita-ir cita-corta${pdf ? '' : ' otra'}" data-especialidad="${esp}" data-view="${view}" data-panel="${panel}" data-tab="${c.f}" data-resaltar="#${c.id}" data-titulo="${titulo}" data-sitio="${c.sitio}">${pdf ? `Ver en la ficha · ${cap}${pag(c.p)}` : 'Ver en el Manual UMI'} →</button>${pdf ? `<a class="cita-pdf-c" href="${pdf}#page=${primeraPag(c.p)}" target="_blank" rel="noopener">PDF</a>` : ''}</span>`;
}
export const org = (t, ilu) => `<span class="org${ilu ? ' ilu' : ''}">${t}</span>`;
export let toastT = null;
document.addEventListener('click', ev => {
  const b = ev.target.closest('.cita-ir'); if (!b) return;
  const t = $('toast'); t.hidden = false;
  t.textContent = `En la app, este botón abre la ficha «${b.dataset.titulo}» y resalta «${b.dataset.sitio}». Al volver, regresas aquí.`;
  clearTimeout(toastT); toastT = setTimeout(() => { t.hidden = true; }, 3600);
});

// Las citas (los ids son los que se pondrán en las fichas; las páginas, del PDF)
export const C = {
  t145: { f: 'mc-definiciones', id: 'mc-tabla-14-5', sitio: 'Tabla 14.5', p: 17 },
  pam: { f: 'mc-definiciones', id: 'mc-shock-ecuacion', sitio: 'Ecuación de la PAM', p: '2-3' },
  vaso: { f: 'mc-vasopresores', id: 'mc-vasopresores-intro', sitio: 'Los vasopresores', p: 12 },
  periferica: { f: 'mc-vasopresores', id: 'mc-via-periferica', sitio: 'Vía periférica', p: 12 },
  extrav: { f: 'mc-vasopresores', id: 'mc-extravasacion', sitio: 'Extravasación', p: 12 },
  naRec: { f: 'mc-vasopresores', id: 'mc-norepinefrina', sitio: 'Norepinefrina', p: 12 },
  naDosis: { f: 'mc-vasopresores', id: 'mc-norepinefrina', sitio: 'Norepinefrina: dosis', p: 13 },
  naSeg: { f: 'mc-vasopresores', id: 'mc-seguridad-na', sitio: 'Efectos adversos de la NA', p: 13 },
  t144: { f: 'mc-vasopresores', id: 'mc-tabla-14-4', sitio: 'Tabla 14.4', p: 13 },
  adre: { f: 'mc-vasopresores', id: 'mc-epinefrina', sitio: 'Epinefrina', p: '13-14' },
  dopa: { f: 'mc-vasopresores', id: 'mc-dopamina', sitio: 'Dopamina', p: '14-15' },
  fenil: { f: 'mc-vasopresores', id: 'mc-fenilefrina', sitio: 'Fenilefrina', p: 15 },
  vasopresina: { f: 'mc-vasopresores', id: 'mc-vasopresina', sitio: 'Vasopresina', p: 15 },
  vasoDosis: { f: 'mc-vasopresores', id: 'mc-vasopresina', sitio: 'Vasopresina: dosis', p: 16 },
  vasoNota: { f: 'mc-vasopresores', id: 'mc-nota-vasopresina-unidades', sitio: 'Nota: unidades de la vasopresina', p: 16 },
  angio: { f: 'mc-vasopresores', id: 'mc-angiotensina', sitio: 'Angiotensina II', p: 16 },
  midodrina: { f: 'mc-vasopresores', id: 'mc-midodrina', sitio: 'Midodrina', p: 16 },
  csFenil: { f: 'mc-cardiogenico-farmaco', id: 'mc-cs-vasopresor', sitio: 'Vasopresor', p: 42 },
  csNa: { f: 'mc-cardiogenico-farmaco', id: 'mc-cs-vasopresor', sitio: 'Noradrenalina', p: '42-43' },
  csIno: { f: 'mc-cardiogenico-farmaco', id: 'mc-cs-inotropicos', sitio: 'Inotrópicos', p: 43 },
  dobuta: { f: 'mc-cardiogenico-farmaco', id: 'mc-dobutamina', sitio: 'Dobutamina', p: 43 },
  t163: { f: 'mc-cardiogenico-farmaco', id: 'mc-tabla-16-3', sitio: 'Tabla 16.3', p: '43-44' },
  milri: { f: 'mc-cardiogenico-farmaco', id: 'mc-milrinona', sitio: 'Milrinona', p: 44 },
  levo: { f: 'mc-cardiogenico-farmaco', id: 'mc-levosimendan', sitio: 'Levosimendán', p: 44 },
  trabajo: { f: 'mc-cardiogenico-farmaco', id: 'mc-trabajo-cardiaco', sitio: 'El trabajo del corazón', p: 44 },
  t162: { f: 'mc-cardiogenico-farmaco', id: 'mc-tabla-16-2', sitio: 'Tabla 16.2', p: 42 },
  t172: { f: 'mc-shock-septico', id: 'mc-tabla-17-2', sitio: 'Tabla 17.2', p: 60 },
  sepVaso: { f: 'mc-shock-septico', id: 'mc-septico-vasopresores', sitio: 'Vasopresores preferidos', p: 60 },
  cortic: { f: 'mc-shock-septico', id: 'mc-corticoides', sitio: 'Corticoides', p: 61 },
  anaAdre: { f: 'mc-anafilaxia', id: 'mc-anafilaxia-epinefrina', sitio: 'Epinefrina', p: 65 },
  t175: { f: 'mc-anafilaxia', id: 'mc-tabla-17-5', sitio: 'Tabla 17.5', p: '65-66' },
  anaGluc: { f: 'mc-anafilaxia', id: 'mc-glucagon', sitio: 'Glucagón', p: 66 },
  anaSeg: { f: 'mc-anafilaxia', id: 'mc-segunda-linea', sitio: 'Fármacos de segunda línea', p: 66 },
  anaShock: { f: 'mc-anafilaxia', id: 'mc-shock-anafilactico', sitio: 'Shock anafiláctico', p: 67 },
  cocaina: { corta: '<b>Isquemia por cocaína</b> (paciente tipo)', f: 'mc-sca-tratamiento', id: 'mc-betabloqueo-sca', sitio: 'Betabloqueantes', p: 47 },
  asmaB2: { f: 'neumo-asma-agudo', id: 'neumo-saba', sitio: 'β₂-agonistas de acción corta', p: 20 },
  asmaAdv: { f: 'neumo-asma-agudo', id: 'neumo-saba-adversos', sitio: 'Efectos adversos de los SABA', p: 22 },
  ipra: { f: 'neumo-asma-agudo', id: 'neumo-ipratropio', sitio: 'Ipratropio', p: 22 },
  glucMec: { f: 'mt-bzd-betabloq', id: 'mt-glucagon-mecanismo', sitio: 'Glucagón: por qué sirve', p: 10 },
  fig524: { f: 'mt-bzd-betabloq', id: 'mar-img-52-4', sitio: 'Fig. 52.4', p: 11 },
  glucDosis: { f: 'mt-bzd-betabloq', id: 'mt-glucagon-dosis', sitio: 'Glucagón: dosis', p: '11-12' },
  ipde: { f: 'mt-bzd-betabloq', id: 'mt-ipde', sitio: 'Inhibidores de la fosfodiesterasa', p: 12 },
  umi: { f: 'umi-vasoactivos', id: 'umi-vasoactivos', sitio: 'Receptores y catecolaminas', p: '' },
};

/* ============================================================
   2. Las tres tablas (una sola verdad). Otro libro añade una fila, no toca el motor ni el dibujo.
   ============================================================ */
// LA CERRADURA. forma = el perfil de la entrada (y de la llave que entra); pines = el cifrado (alturas 1-4)
export const RECEPTORES = {
  alfa1: { nombre: 'α₁', forma: 'triangulo', pines: [2, 4, 1, 3], via: 'gq', tinta: '--accent-red',
    linea: 'La cerradura α₁: la noradrenalina, la fenilefrina y la adrenalina la abren; aprieta la célula lisa.', c: C.vaso },
  beta1: { nombre: 'β₁', forma: 'semicirculo', pines: [3, 1, 4, 2], via: 'gs', tinta: '--accent-yellow',
    linea: 'La cerradura β₁ del corazón: la dobutamina la abre; sube el volumen latido y la frecuencia.', c: C.dobuta },
  beta2: { nombre: 'β₂', forma: 'cuadrado', pines: [1, 3, 2, 4], via: 'gs', tinta: '--text-main',
    linea: 'La cerradura β₂ del músculo liso: en el bronquio, el albuterol la abre y la luz se ensancha. En el vaso y en el mastocito, el subtipo lo da el Manual UMI.', c: C.asmaB2, c2: C.umi },
  v1: { nombre: 'V₁', forma: 'hexagono', pines: [4, 2, 3, 1], via: 'gq', tinta: '--accent-purple',
    linea: 'La cerradura V₁ del músculo liso: la vasopresina la abre; aprieta sobre todo la piel, el músculo y el territorio esplácnico.', c: C.vasopresina },
  dopa: { nombre: 'D', forma: 'estrella', pines: [2, 2, 4, 1], via: 'gs', tinta: '--accent-green',
    linea: 'La cerradura de la dopamina, en las arteriolas del riñón y del intestino: a ≤3 µg/kg/min sube el flujo de esos lechos. El subtipo (D₁) no lo da Marino.', c: C.dopa },
  gluc: { nombre: 'glucagón', forma: 'ovalo', pines: [1, 4, 3, 2], via: 'gs', tinta: '--accent-green',
    linea: 'El receptor del glucagón: unido a la misma adenilato ciclasa que el β, por eso funciona con el β tapado.', c: C.glucMec },
  musc: { nombre: 'muscarínico', forma: 'rombo', pines: [3, 3, 1, 4], via: 'gq', tinta: '--text-dim',
    linea: 'La cerradura muscarínica de las vías aéreas: el ipratropio la tapa. Que la abra la acetilcolina y apriete el bronquio es fisiología general.', c: C.ipra },
};
// LA CÉLULA: dónde está cada cerradura y qué hace allí (misma cerradura, célula distinta)
export const CELULAS = {
  'liso-arteriola': { nombre: 'Célula lisa de la arteriola', corto: 'Arteriola', organo: 'arteriola', receptores: ['alfa1', 'v1', 'beta2', 'dopa'],
    maquinaria: 'gq', efector: 'acorta', salida: 'el calibre → la IRVS', c: C.naRec },
  'liso-bronquio': { nombre: 'Célula lisa del bronquio', corto: 'Bronquio', organo: 'bronquio', receptores: ['beta2', 'musc'],
    maquinaria: 'gs-relaja', efector: 'acorta', salida: 'la luz del bronquio', c: C.asmaB2 },
  miocito: { nombre: 'Miocito del ventrículo', corto: 'Miocito', organo: 'corazon', receptores: ['beta1', 'gluc'], canal: true,
    maquinaria: 'gs', efector: 'fuerza', salida: 'la fuerza → el IC', c: C.fig524 },
  nodo: { nombre: 'Célula del nodo (el metrónomo)', corto: 'Nodo', organo: 'corazon', receptores: ['beta1', 'gluc'], canal: true,
    maquinaria: 'gs', efector: 'ritmo', salida: 'el ritmo → la FC', c: C.glucMec },
  mastocito: { nombre: 'Mastocito', corto: 'Mastocito', organo: 'mastocito', receptores: ['beta2'],
    maquinaria: 'duda', efector: 'granulos', salida: 'los gránulos → el vaso se abre y fuga', c: C.anaGluc },
};
// LA LLAVE: cada fármaco, qué cerraduras abre (ag) o tapa (tap) y con cuánta fuerza según la dosis (0-1: ilustrativo, en la
// dirección del texto). Dosis en su unidad canónica (unidad). regimen: las pautas de la fuente, cada una en su contexto.
export const alfaNA = d => d <= 3 ? 0 : Math.pow(Math.min(1, (d - 3) / 27), 1.3);   // techo a 30 µg/min (S p. 13); la curva: ilustrativa
export const sat = (d, k) => 1 - Math.exp(-d / k);
export const FARMACOS = {
  na: { nombre: 'Noradrenalina', corto: 'NA', sub: 'α₁ principal, β débil', unidad: 'µg/min',
    llaves: [{ rec: 'beta1', tipo: 'ag', occ: d => 0.6 * Math.min(1, d / 10) }, { rec: 'alfa1', tipo: 'ag', occ: alfaNA }],   // cuánto β: ilustrativo (la ficha da la dirección)
    sist: { fc: d => d > 30 ? 1.2 * (d - 30) : 0 },   // las taquiarritmias a dosis de techo (S p. 13); cuánta FC: fisiología general (ilustrativo)
    regimen: { shock: { min: 0, max: 40, paso: 1, marcas: [5, 10, 30, 40], porKg: false,
      tramos: [[0, 10, 'pesa el β', '--accent-yellow'], [10, 30, 'manda el α', '--accent-red'], [30, 40, 'techo: segundo vasopresor', '--text-muted']], chip: 'tramos: ficha · p. 13' },
      fija5: { fija: 5, txt: '5 µg/min, la dosis de inicio del cardiogénico', chip: 'ficha · pp. 42-43' } },
    ficha: { receptores: [['<b>α₁</b>, su acción principal: vasoconstricción; y un <b>β débil</b>, que estimula algo el corazón. Ese β podría explicar por qué, a las dosis habituales, no daña la función renal.', C.naRec],
        ['<b>&lt;10 µg/min:</b> el β puede subir el gasto · <b>&gt;10:</b> predomina el α · <b>30:</b> ya no hay más respuesta.', C.naDosis]],
      dosis: [['Sin dosis de carga; empezar a 5-10 µg/min y subir según la PA.', C.naDosis], ['Rango 5-40 µg/min.', C.t144], ['A 30 µg/min, añadir un segundo vasopresor.', C.naDosis],
        ['Séptico: si hacen falta 0,25-0,5 µg/kg/min (18-35 µg/min en 70 kg), añadir vasopresina.', C.sepVaso],
        ['Cardiogénico: 5 µg/min (0,05 µg/kg/min), subir cada 5 min; habitual 5-30 µg/min (0,05-0,5). Ver la nota de las equivalencias.', C.csNa],
        ['Por una vía periférica del brazo, segura hasta 48 h; en el séptico, por encima de la fosa antecubital.', C.periferica, C.t172]],
      funcion: ['El vasopresor más usado y el preferido en el shock séptico. En el cardiogénico, menos taquiarritmias y menos muertes que la adrenalina y la dopamina.', C.naRec, C.csNa],
      adversos: ['Isquemia (miocardio, cerebro, miembro) y arritmias (taqui y bradi) en ~10 %, quizá por el propio shock. Inmunosupresión: se une a los receptores de los leucocitos (significado clínico incierto). Extravasación: fentolamina 5-10 mg en 10 mL en la zona, antes de 12 h.', C.naSeg, C.extrav],
      umi: 'β₁ y α, sin β₂. Dosis 0,2-1,3 µg/kg/min; 10 mg en 100 mL. Las dos fuentes no coinciden en el rango: ver las notas.' } },
  vasopresina: { nombre: 'Vasopresina', corto: 'Vasopresina', sub: 'V₁: otra cerradura', unidad: 'U/min',
    llaves: [{ rec: 'v1', tipo: 'ag', occ: d => d > 0 ? 0.8 : 0 }],
    regimen: { septico: { fija: 0.03, candado: true, txt: 'Dosis fija: no se titula', chip: 'ficha · p. 16' } },
    ficha: { receptores: [['<b>V₁</b> del músculo liso: vasoconstricción, más marcada en la piel, el músculo y el territorio esplácnico. <b>V₂</b> del túbulo distal: reabsorbe agua. <b>V₃</b> de la hipófisis anterior: libera ACTH.', C.vasopresina]],
      dosis: [['Séptico resistente a la NA: 0,03-0,04 U/min en perfusión; no se titula. El libro imprime «U/h»: ver la nota.', C.vasoDosis], ['Tabla 14.4: 0,01-0,04.', C.t144],
        ['Parada: 40 U IV en dosis única, en lugar de la 1.ª o la 2.ª de adrenalina.', C.vasopresina]],
      funcion: ['Segundo vasopresor en el séptico resistente a la NA: sube la PA y ahorra catecolamina, sin beneficio probado de supervivencia. No sube la PA en voluntarios sanos; sí en el shock vasodilatador. No se ha evaluado en la anafilaxia.', C.vasopresina, C.anaShock],
      adversos: ['Como los de la noradrenalina, en tipo y en frecuencia.', C.vasoDosis],
      umi: 'La cuenta entre los vasoconstrictores (receptores de arginina-vasopresina); no da su dosis.' } },
  adrenalina: { nombre: 'Adrenalina', corto: 'Adrenalina', sub: 'β potente y α', unidad: 'µg/min', fcBeta: true,
    llaves: [{ rec: 'beta1', tipo: 'ag', occ: d => sat(d, 4) }, { rec: 'beta2', tipo: 'ag', occ: d => sat(d, 4), cel: ['liso-arteriola', 'liso-bronquio'] }, { rec: 'beta2', tipo: 'ag', occ: d => sat(d, 9), cel: ['mastocito'] },   // el mastocito se llena más despacio: la dosis se titula (ilustrativo)
      { rec: 'alfa1', tipo: 'ag', occ: d => sat(d, 15) }],
    // lactato (producción aeróbica) y glucemia (el α frena la insulina): S p. 14. Cuánto: ilustrativo (8 µg/min: lactato +1,9 y glucemia +102, del caso)
    sist: { lact: d => 1.9 * sat(d, 8) / sat(8, 8), glu: d => 102 * sat(d, 8) / sat(8, 8),
      fc: d => 0.5 * Math.min(d, 38) },   // la taquicardia de la adrenalina (S pp. 13-14): sube con la dosis; cuánta: ilustrativo
    regimen: { septico: { min: 0, max: 0.5, paso: 0.05, porKg: true, unidadVista: 'µg/kg/min', marcas: [0.1, 0.5], tramos: [[0, 0.1, '', '--text-muted'], [0.1, 0.5, 'inicio 0,1 → máximo 0,5', '--accent-yellow']], chip: 'ficha · p. 14' },
      anafilaxia: { min: 0, max: 15, paso: 5, porKg: false, marcas: [5, 15], tramos: [[0, 5, '', '--text-muted'], [5, 15, 'shock anafiláctico: 5-15', '--accent-yellow']], chip: 'ficha · pp. 66-67', solucion: '1:100.000' } },
    ficha: { receptores: [['<b>β</b> potente y <b>α</b>: sube la FC, el volumen latido y la PA según la dosis. En el mastocito, el β frena la salida de mediadores.', C.adre, C.anaGluc]],
      dosis: [['Anafilaxia: 0,3-0,5 mg IM (solución 1:1.000) en la cara anterolateral del muslo, cada 5-15 min.', C.anaAdre],
        ['Shock anafiláctico: 5-15 µg/min (1:100.000: 2 mg en 200 mL, 10 µg/mL), con o sin un bolo IV de 10 µg.', C.t175, C.anaShock],
        ['Edema de laringe: 2,5 mg nebulizada (1:100). Parada: 1 mg IV (1:10.000) cada 3-5 min.', C.t175], ['Séptico: 0,1 µg/kg/min, hasta 0,5 como máximo.', C.adre]],
      funcion: ['En la anafilaxia, el único fármaco que para la reacción. En el séptico, de segunda línea (cap. 14) o de tercera (Tabla 17.2): las fuentes discrepan.', C.anaAdre, C.t172],
      adversos: ['Taquicardia y arritmias; hipoperfusión esplácnica (α); más metabolismo; hiperglucemia (el α frena la insulina); lactato alto por producción aeróbica, que engaña.', C.adre],
      umi: 'β₂: vasodilatación del músculo y de las coronarias; β₁: inotropismo; α: más RVS. Efecto β a 1-4 µg/min y α por encima de 20 µg/min (Marino no da este corte).' } },
  dopamina: { nombre: 'Dopamina', corto: 'Dopamina', sub: 'tres fármacos según la dosis', unidad: 'µg/kg/min',
    llaves: [{ rec: 'dopa', tipo: 'ag', occ: d => 0.9 * Math.min(1, d / 3) }, { rec: 'beta1', tipo: 'ag', occ: d => d <= 3 ? 0 : 0.65 * Math.min(1, (d - 3) / 7) },
      { rec: 'alfa1', tipo: 'ag', occ: d => d <= 10 ? 0 : Math.min(1, (d - 10) / 15) }],
    sist: { fc: d => d > 10 ? 1.6 * (d - 10) : 0 },   // «más taquicardia que los demás vasopresores» (S p. 14): sube sobre todo en la fase α; cuánta: ilustrativo
    regimen: { septico: { min: 0, max: 20, paso: 1, porKg: true, unidadVista: 'µg/kg/min', marcas: [3, 10, 20],
      tramos: [[0, 3, 'dopaminérgico', '--accent-green'], [3, 10, 'β: sube el volumen latido', '--accent-yellow'], [10, 20, 'α: sube la RVS', '--accent-red']], chip: 'tramos: ficha · p. 14' } },
    ficha: { receptores: [['<b>≤3 µg/kg/min:</b> receptores de dopamina de los lechos renal y esplácnico (sube su flujo) · <b>3-10:</b> β del corazón (sube el volumen latido) · <b>&gt;10:</b> α (sube la RVS; la poscarga puede deshacer la subida del volumen latido).', C.dopa]],
      dosis: [['Empezar a 5 µg/kg/min; 5-10 suele subir el gasto; para la PA puede hacer falta &gt;10. El beneficio, a 5-20; se han descrito 50 y más.', C.dopa], ['Tabla 14.4: 5-50 µg/kg/min.', C.t144]],
      funcion: ['Antes el vasopresor preferido en el séptico; hoy en desuso en el séptico y el cardiogénico por sus arritmias.', C.dopa],
      adversos: ['Taquicardia y taquiarritmias (p. ej. FA), más que con los demás vasopresores. Presión intraocular alta a dosis bajas (1-4 µg/kg/min).', C.dopa],
      umi: 'Los receptores de dopamina, D₁-D₅ (Marino no da el subtipo).' } },
  fenilefrina: { nombre: 'Fenilefrina', corto: 'Fenilefrina', sub: 'α₁ puro', unidad: 'µg/min',
    llaves: [{ rec: 'alfa1', tipo: 'ag', occ: d => sat(d, 30) }],
    regimen: { anestesia: { min: 0, max: 200, paso: 5, porKg: false, marcas: [10, 35, 200], tramos: [[0, 10, '', '--text-muted'], [10, 35, 'inicio 10-35', '--accent-yellow'], [35, 200, 'hasta el máximo de 200', '--accent-red']], chip: 'ficha · p. 15' },
      tsvi: { corta: '<b>Obstrucción dinámica del tracto de salida del VI</b> (paciente tipo)', tog: true, txt: 'La fuente no da la dosis para este caso', chip: 'ficha · p. 42', dosisModelo: 60 } },
    ficha: { receptores: [['<b>α puro</b>: vasoconstricción en todo el cuerpo, a veces con bradicardia, menos volumen latido (con disfunción cardíaca) y menos riego en riñón e intestino.', C.fenil]],
      dosis: [['Hipotensión de la anestesia: bolo de 50-100 µg (se puede repetir una vez); si no basta, perfusión desde 10-35 µg/min; máximo 200 µg/min.', C.fenil],
        ['Séptico: sin bolo, desde 0,5 µg/kg/min; por encima de 6 µg/kg/min no añade beneficio.', C.fenil]],
      funcion: ['La hipotensión de la anestesia. No se recomienda en ningún shock; más apropiada que la NA en el cardiogénico por obstrucción dinámica del TSVI. Útil en el séptico con FA rápida: <b>opinión del autor</b>.', C.fenil, C.csFenil],
      adversos: ['Bradicardia (refleja), menos volumen latido con disfunción cardíaca, menos riego en riñón e intestino.', C.fenil, C.csFenil],
      umi: 'Agonista selectivo de los α₁.' } },
  dobutamina: { nombre: 'Dobutamina', corto: 'Dobutamina', sub: 'β₁', unidad: 'µg/kg/min',
    llaves: [{ rec: 'beta1', tipo: 'ag', occ: d => sat(d, 6) }, { rec: 'beta2', tipo: 'ag', occ: d => 0.75 * sat(d, 6), cel: ['liso-arteriola'] }],
    regimen: { cardiogenico: { min: 0, max: 20, paso: 1, porKg: true, unidadVista: 'µg/kg/min', marcas: [3, 5, 20], tramos: [[0, 3, '', '--text-muted'], [3, 5, 'inicio 3-5', '--accent-yellow'], [5, 20, 'habitual hasta 20', '--accent-yellow']], chip: 'ficha · p. 43' },
      tsvi: { tog: true, txt: 'Contraindicada aquí; se pone para ver por qué', chip: 'ficha · p. 43', dosisModelo: 5 } },
    ficha: { receptores: [['<b>β₁</b> del corazón: más volumen latido y más FC. Vasodilatación leve (el receptor, β₂ débil, lo da el Manual UMI).', C.dobuta, C.umi]],
      dosis: [['Empezar a 3-5 µg/kg/min y subir de 3 a 5 cada vez; habitual 3-20 µg/kg/min.', C.t163]],
      funcion: ['El inotrópico más usado en el shock cardiogénico: mantiene la PA porque el volumen latido compensa la vasodilatación.', C.dobuta],
      adversos: ['FC +5-15 lpm (puede pasar de 30), más consumo de O₂ y más trabajo cardíaco. Contraindicada, como todo inotrópico, en la obstrucción dinámica del tracto de salida del VI.', C.dobuta, C.csIno],
      umi: '3-15 µg/kg/min (Marino: 3-20). Contraindicada en la miocardiopatía hipertrófica y en las taquiarritmias ventriculares.' } },
  milrinona: { nombre: 'Milrinona', corto: 'Milrinona', sub: 'sin cerradura: atasca la PDE', unidad: 'µg/kg/min',
    llaves: [],
    dentro: [{ diana: 'pde', inh: d => d > 0 ? 0.9 * sat(d, 0.3) : 0 }],
    regimen: { cardiogenico: { min: 0, max: 0.75, paso: 0.025, porKg: true, unidadVista: 'µg/kg/min', marcas: [0.375, 0.75], tramos: [[0, 0.375, 'tras 50 µg/kg en 10 min', '--text-muted'], [0.375, 0.75, '0,375-0,75', '--accent-yellow']], chip: 'ficha · p. 43' } },
    ficha: { receptores: [['<b>Sin cerradura</b>: frena la fosfodiesterasa, no se degrada el AMPc y entra más calcio en el miocito. Además vasodilata.', C.milri], ['Aumenta el gasto también con el β bloqueado.', C.ipde]],
      dosis: [['50 µg/kg en 10 min y luego 0,375-0,75 µg/kg/min; no más de 1,13 mg/kg al día.', C.t163],
        ['Con insuficiencia renal (ClCr en mL/min/1,73 m²): 50 → 0,43 · 40 → 0,38 · 30 → 0,33 · 20 → 0,28 µg/kg/min.', C.t163], ['Semivida 2,5 h, más larga en la insuficiencia renal.', C.milri]],
      funcion: ['Inotropismo como la dobutamina, con menos taquicardia. Más apropiada en la insuficiencia cardíaca descompensada sin hipotensión.', C.milri],
      adversos: ['Hipotensión: su gran inconveniente en el shock cardiogénico.', C.milri],
      umi: 'La nombra entre los vasodilatadores (inhibidores de la fosfodiesterasa III); no da su dosis.' } },
  glucagon: { nombre: 'Glucagón', corto: 'Glucagón', sub: 'su propia cerradura', unidad: 'on',
    llaves: [{ rec: 'gluc', tipo: 'ag', occ: d => d > 0 ? 0.8 : 0 }],
    sist: { glu: d => d > 0 ? 25 : 0 },
    regimen: { anafilaxia: { tog: true, txt: '1-5 mg IV en 5 min + 5-15 µg/min', chip: 'ficha · p. 66' } },
    ficha: { receptores: [['<b>Su propio receptor</b>, unido a la misma adenilato ciclasa que el β: el corazón responde aunque el β esté tapado.', C.glucMec]],
      dosis: [['Anafilaxia con betabloqueante: 1-5 mg IV lenta (en 5 min) y luego 5-15 µg/min, según respuesta.', C.anaGluc],
        ['Otra pauta, para otro caso: en la intoxicación por betabloqueantes, 3 mg IV (0,05 mg/kg), 5 mg si no responde, y luego 5 mg/h. No se mezclan.', C.glucDosis]],
      funcion: ['Anafilaxia refractaria a la adrenalina en quien toma betabloqueantes. Antídoto de los betabloqueantes: responde el 90 %.', C.anaGluc, C.glucMec],
      adversos: ['Vómitos: si está obnubilado, de lado. En la intoxicación: náuseas y vómitos por encima de 5 mg/h, hiperglucemia leve, hipopotasemia y subidas de PA.', C.anaGluc, C.glucDosis],
      umi: null } },
  bisoprolol: { nombre: 'Bisoprolol', corto: 'Bisoprolol', sub: 'tapón del β', unidad: 'on', material: 'ciega', via: 'oral',
    llaves: [{ rec: 'beta1', tipo: 'tap', occ: d => d > 0 ? 0.85 : 0 }, { rec: 'beta2', tipo: 'tap', occ: d => d > 0 ? 0.85 : 0, cel: ['mastocito'] }],
    regimen: { cronico: { candado: true, fija: 1, txt: 'Lo toma de casa: no se quita', chip: 'ficha · p. 66' } },
    ficha: { receptores: [['<b>Tapón</b> de los receptores β: el libro habla de «betabloqueantes» sin distinguir; atenúan o anulan la respuesta a la adrenalina.', C.anaGluc]],
      dosis: [['La pauta crónica de Begoña no cambia el razonamiento: la fuente no la da.', C.anaGluc]],
      funcion: ['Explica la anafilaxia que no responde a la adrenalina.', C.anaGluc], adversos: ['—', C.anaGluc], umi: null } },
  betabloqueante: { nombre: 'Betabloqueante', corto: 'Betabloqueante', sub: 'tapón del β', unidad: 'on', material: 'ciega',
    llaves: [{ rec: 'beta1', tipo: 'tap', occ: d => d > 0 ? 0.85 : 0 }, { rec: 'beta2', tipo: 'tap', occ: d => d > 0 ? 0.85 : 0 }],
    regimen: { sca: { tog: true, txt: 'Contraindicado aquí; se pone para ver por qué', chip: 'ficha · cap. 20, p. 47' } },
    ficha: { receptores: [['<b>Tapón</b> de los β. En la isquemia por cocaína deja la vasoconstricción α sin oposición.', C.cocaina]],
      dosis: [['No se da en este caso: está contraindicado.', C.cocaina]],
      funcion: ['Contraindicado en la isquemia por cocaína.', C.cocaina], adversos: ['Con PAS &lt;120 mmHg, más riesgo de shock cardiogénico.', C.cocaina], umi: null } },
  albuterol: { nombre: 'Albuterol (salbutamol)', corto: 'Albuterol', sub: 'β₂ del bronquio, inhalado', unidad: 'on', via: 'inhalada',
    llaves: [{ rec: 'beta2', tipo: 'ag', occ: d => d > 0 ? 0.85 : 0, cel: ['liso-bronquio'] }],
    sist: { fc: d => d > 0 ? 8 : 0, k: d => d > 0 ? -0.4 : 0 },
    regimen: { asma: { tog: true, txt: 'Nebulizado', chip: 'ficha · cap. 23, p. 20' } },
    ficha: { receptores: [['Estimula los <b>β₂ del músculo liso bronquial</b>; en aerosol, más eficaz y con menos efectos que por vía oral o IV.', C.asmaB2]],
      dosis: [['Anafilaxia con broncoespasmo: 2,5 mL de solución al 0,5 % nebulizada, o inhalador.', C.anaSeg]],
      funcion: ['El broncodilatador más usado en la crisis de asma.', C.asmaB2],
      adversos: ['Con aerosol agresivo: taquicardia, temblor, hiperglucemia, hipopotasemia, hipomagnesemia e hipofosfatemia, entre otros.', C.asmaAdv], umi: null } },
  ipratropio: { nombre: 'Ipratropio', corto: 'Ipratropio', sub: 'tapón muscarínico', unidad: 'on', material: 'ciega', via: 'inhalada',
    llaves: [{ rec: 'musc', tipo: 'tap', occ: d => d > 0 ? 0.85 : 0 }],
    regimen: { asma: { tog: true, txt: '0,5 mg nebulizado', chip: 'ficha · cap. 23, p. 22' } },
    ficha: { receptores: [['Derivado de la atropina que <b>bloquea los receptores muscarínicos</b> de las vías aéreas.', C.ipra]],
      dosis: [['0,5 mg cada 20 min, 3 dosis; luego según necesidad.', C.ipra]],
      funcion: ['Solo si la respuesta al albuterol no basta; sin beneficio más allá de las primeras horas.', C.ipra], adversos: ['Absorción mínima: poco riesgo de efectos anticolinérgicos.', C.ipra], umi: null } },
};

// EL PACIENTE: cifras de partida (del caso cuando lo hay; si no, ilustrativas) y cómo responde
// kR: 0.6cuánto sube la IRVS por unidad de tono del anillo (ilustrativo); post: cuánto cae el volumen latido con la poscarga
export const PACIENTES = {
  paulino: { corta: '<b>Amparo</b>, 58 años, 76 kg · shock séptico (pielonefritis)', nombre: 'Amparo', chip: 'shock séptico', peso: 76, obj: 'sepsis', del: 'caso',
    linea: '<b>Amparo</b>, 58 años, 76 kg (ideal 58) · pielonefritis obstructiva: shock séptico, tras 1,75 L de cristaloide',
    base: { fc: 112, ic: 4.0, irvs: 11.75, pvc: 4, pp: 34, spo2: 95, fr: 24, t: 38.9, lact: 4.4, glu: null, k: null }, kR: 0.6, post: 0.4, sensV1: 1 },
  paulino10: { corta: '<b>Amparo</b>, hora 10 · NA 26 µg/min y vasopresina', nombre: 'Amparo', chip: 'shock séptico, hora 10', peso: 76, obj: 'sepsis', del: 'caso',
    linea: '<b>Amparo</b>, hora 10 · NA 26 µg/min y vasopresina; lactato 3,1 antes de la adrenalina',
    base: { fc: 112, ic: 4.0, irvs: 11.75, pvc: 5, pp: 36, spo2: 95, fr: 24, t: 38.4, lact: 3.1, glu: 160, k: null }, kR: 0.6, post: 0.4, sensV1: 1 },
  sano: { corta: '<b>Voluntario sano</b>, 75 kg', nombre: 'Voluntario sano', chip: 'voluntario sano', peso: 75, obj: null, del: 'ilustrativo',
    linea: '<b>Voluntario sano</b>, 75 kg · las cifras son ilustrativas',
    base: { fc: 68, ic: 3.2, irvs: 26, pvc: 5, pp: 45, spo2: 98, fr: 14, t: 36.6, lact: null, glu: null, k: null }, kR: 0.6, post: 0.15, sensV1: 0.06 },
  anestesia: { corta: '<b>Hipotensión de la anestesia</b> (paciente tipo), 75 kg', nombre: 'Hipotensión de la anestesia', chip: 'hipotensión de la anestesia', peso: 75, obj: null, del: 'ilustrativo',
    linea: '<b>Hipotensión de la anestesia</b> (paciente tipo), 75 kg · las cifras son ilustrativas',
    base: { fc: 80, ic: 2.8, irvs: 19, pvc: 5, pp: 36, spo2: 99, fr: 12, t: 36.4, lact: null, glu: null, k: null }, kR: 0.6, post: 0.15, sensV1: 1 },
  aurelio: { corta: '<b>Aurelio</b>, 67 años, 82 kg · IAM anterior: shock cardiogénico', nombre: 'Aurelio', chip: 'shock cardiogénico', peso: 82, obj: 'cardio', del: 'caso',
    linea: '<b>Aurelio</b>, 67 años, 82 kg · IAM anterior: shock cardiogénico · tras 250 mL, PCP 19, IC 2,1, PAM 64',
    base: { fc: 108, ic: 2.1, irvs: 25.7, pvc: 10, pp: 26, spo2: 92, fr: 26, t: 36.7, lact: 3.2, glu: null, k: null }, kR: 0.6, post: 0.35, sensV1: 1, baro: 0.2 },
  tsvi: { corta: '<b>Obstrucción dinámica del tracto de salida del VI</b> (paciente tipo)', nombre: 'Obstrucción del TSVI', chip: 'obstrucción dinámica del TSVI', peso: 70, obj: 'cardio', del: 'ilustrativo', tsvi: true,
    linea: '<b>Obstrucción dinámica del tracto de salida del VI</b> (paciente tipo) · las cifras son ilustrativas',
    base: { fc: 110, ic: 2.0, irvs: 27, pvc: 6, pp: 24, spo2: 94, fr: 22, t: 36.8, lact: null, glu: null, k: null }, kR: 0.6, post: 0.35, sensV1: 1, baro: 0.2 },
  begona: { corta: '<b>Begoña</b>, 52 años, 65 kg · toma bisoprolol · anafilaxia', nombre: 'Begoña', chip: 'anafilaxia', peso: 65, obj: 'anafilaxia', del: 'caso', mediadores: true,
    linea: '<b>Begoña</b>, 52 años, 65 kg · toma bisoprolol · anafilaxia por amoxicilina-clavulánico IV · minuto 30',
    base: { fc: 84, fcSinBeta: 118, ic: 3.0, irvs: 16, pvc: 3, pp: 32, spo2: 93, fr: 28, t: 36.8, lact: 3.0, glu: null, k: null }, kR: 0.6, post: 0.15, sensV1: 1, sensAlfa: 0.4, baro: 0.25 },
  cocaina: { corta: '<b>Isquemia miocárdica por cocaína</b> (paciente tipo)', nombre: 'Isquemia por cocaína', chip: 'isquemia por cocaína', peso: 75, obj: null, del: 'ilustrativo', lecho: 'coronaria',
    linea: '<b>Isquemia miocárdica por cocaína</b> (paciente tipo) · las cifras son ilustrativas',
    base: { fc: 118, ic: 3.4, irvs: 29, pvc: 6, pp: 60, spo2: 97, fr: 20, t: 37.4, lact: null, glu: null, k: null }, kR: 0.6, post: 0.15, sensV1: 1, pesoB2: 1.0,
    endogeno: { alfa1: 0.55, beta1: 0.6, beta2: 0.55 } },
  asma: { corta: '<b>Crisis de broncoespasmo</b> (paciente tipo)', nombre: 'Broncoespasmo', chip: 'broncoespasmo', peso: 70, obj: null, del: 'ilustrativo', organo: 'bronquio',
    linea: '<b>Crisis de broncoespasmo</b> (paciente tipo) · las cifras son ilustrativas',
    base: { fc: 104, ic: 3.4, irvs: 22, pvc: 6, pp: 46, spo2: 91, fr: 28, t: 36.8, lact: null, glu: null, k: 4.0 }, kR: 0.35, post: 0.15, sensV1: 1, tonoBronquio: 0.8 },
};
export const OBJETIVOS = {
  sepsis: { nombre: 'Tabla 14.5', cita: C.t145, filas: { pa: ['≥65', v => v >= 65], ic: ['≥2,5', v => v >= 2.5], lact: ['<2', v => v < 2] } },
  cardio: { nombre: 'Tabla 16.2', cita: C.t162, filas: { pa: ['≥65', v => v >= 65], ic: ['≥2,5', v => v >= 2.5], irvs: ['25-30', v => v >= 25 && v <= 30], lact: ['<2', v => v < 2] } },
  anafilaxia: { nombre: 'PAM del shock anafiláctico', cita: C.anaShock, filas: { pa: ['≥65', v => v >= 65] } },
};

/* ============================================================
   3. Los estados con nombre. Cada uno: paciente, fármacos con su pauta, mandos, lupa de partida, frase viva y
   explicación guiada (3-5 pasos que señalan el dibujo, cada uno con su cita). Sus fuentes salen de la guía, como lista.
   ============================================================ */
export const FAMILIAS = { vaso: 'Vasopresores', ino: 'Inotrópicos', freno: 'Frenos y antídotos', otro: 'La misma célula en otro órgano' };
export const ESTADOS = [
  { id: 'na-baja', fam: 'vaso', tit: 'NA baja', sub: 'pesa el β', pac: 'paulino', f: { na: 8 }, reg: { na: 'shock' }, lupa: 'miocito',
    frase: (S, R) => fraseNA(S, R),
    guia: { tit: 'Amparo: noradrenalina a 8 µg/min', pasos: [
      { t: 'La bomba empuja noradrenalina por la vía: las mismas llaves llegan a la arteriola y al corazón.', r: ['#e-via'], c: C.naRec },
      { t: 'Por debajo de 10 µg/min pesa el β: las llaves entran sobre todo en las cerraduras β₁ del miocito y la aguja de la fuerza sube. Mira el IC.', set: { f: { na: 8 } }, r: ['#e-mio', '#e-medidor', '[data-fila="ic"]'], c: C.naDosis },
      { t: 'En el anillo de la arteriola, pocas cerraduras α₁ tienen llave: el calibre apenas se mueve. Cuántas llaves: es una imagen.', r: ['#e-anillo', '#e-cal'], c: C.naDosis, org: 'ilustrativo' },
      { t: 'Con lupa: la llave β₁ alinea los pines, el cilindro gira y la palanca pone en marcha la máquina que fabrica AMPc y abre el canal de calcio.', set: { lupa: 'miocito', cas: 'completa' }, r: ['#l-cerr', '#l-prensa', '#l-canal'], c: C.glucMec }] } },
  { id: 'na-alta', fam: 'vaso', tit: 'NA alta', sub: 'manda el α', pac: 'paulino', f: { na: 25 }, reg: { na: 'shock' }, lupa: 'liso-arteriola',
    frase: (S, R) => fraseNA(S, R),
    guia: { tit: 'Amparo: noradrenalina a 25 µg/min', pasos: [
      { t: 'Por encima de 10 manda el α: las cerraduras α₁ del anillo de la arteriola se llenan.', set: { f: { na: 25 } }, r: ['#e-anillo'], c: C.naDosis },
      { t: 'Cada célula lisa se acorta y el anillo se cierra: el calibre mide una luz más estrecha.', r: ['#e-anillo', '#e-cal'], c: C.naRec },
      { t: 'Pocos micrómetros bastan: la resistencia sube con la cuarta potencia del radio. Suben la IRVS y la PAM.', r: ['#e-cal', '[data-fila="irvs"]', '[data-fila="pa"]'], c: C.pam, org: 'fisiología general' },
      { t: 'Con lupa: la llave α₁ gira el cilindro, el carro lleva el IP₃ al depósito y el calcio hace tirar a la miosina. Esa cadena es fisiología general.', set: { lupa: 'liso-arteriola', cas: 'completa' }, r: ['#l-cerr', '#l-ret', '#l-trinq'], c: C.naRec, org: 'fisiología general' },
      { t: 'El β₁ del corazón sigue con sus llaves, pero ya no manda.', r: ['#e-mio'], c: C.naDosis }] } },
  { id: 'na-techo', fam: 'vaso', tit: 'NA en el techo', sub: '30 y más', pac: 'paulino', f: { na: 30 }, reg: { na: 'shock' }, lupa: 'liso-arteriola',
    frase: (S, R) => fraseNA(S, R),
    guia: { tit: 'Amparo: el techo de la noradrenalina', pasos: [
      { t: 'A 30 µg/min todas las cerraduras α₁ del anillo tienen llave. Es una imagen: el libro dice que ya no hay más respuesta.', set: { f: { na: 30 } }, r: ['#e-anillo'], c: C.naDosis, org: 'ilustrativo' },
      { t: 'Sube la bomba a 40: las llaves sobran, el anillo no se cierra más y la PAM apenas cambia.', set: { f: { na: 40 } }, r: ['#bomba-na', '#e-cal', '[data-fila="pa"]'], c: C.naDosis },
      { t: 'A 30, otra puerta: un segundo vasopresor. Añadirlo no ha demostrado más supervivencia.', r: ['#bomba-na'], c: C.naDosis, c2: C.vaso },
      { t: 'Para Amparo, 30 µg/min son 0,39 µg/kg/min: la Tabla 17.2 añade vasopresina e hidrocortisona.', set: { f: { na: 30 } }, r: ['#bomba-na'], c: C.t172 }] } },
  { id: 'na-vasopresina', fam: 'vaso', tit: '+ Vasopresina', sub: 'otra cerradura', pac: 'paulino', f: { na: 25, vasopresina: 0.03 }, reg: { na: 'shock', vasopresina: 'septico' }, lupa: 'liso-arteriola',
    frase: (S, R) => S.f.vasopresina ? (R.pam >= 65 ? ['Dos cerraduras, una sola contracción: la vasopresina aprieta por el V₁ y la PAM llega a 65 con menos noradrenalina. No se titula.', C.vasopresina]
      : ['La vasopresina aprieta por el V₁, pero con tan poca noradrenalina la PAM no llega a 65. No se titula: se mueve la NA.', C.vasopresina]) : fraseNA(S, R),
    guia: { tit: 'Amparo: se añade vasopresina', pasos: [
      { t: 'Entra otra llave, hexagonal: la vasopresina encaja en las cerraduras V₁ de las mismas células lisas.', set: { f: { na: 25, vasopresina: 0.03 } }, r: ['#e-anillo [data-cerr="v1"]'], c: C.vasopresina },
      { t: 'La misma célula se aprieta por otra cerradura: la PA sube y hace falta menos noradrenalina.', r: ['#e-anillo', '[data-fila="pa"]'], c: C.vasopresina },
      { t: 'Su bomba sale con candado: 0,03-0,04 U por minuto, sin titular. El libro imprime «U/h»: ver la nota.', r: ['#bomba-vasopresina'], c: C.vasoDosis },
      { t: 'Baja la noradrenalina a 15: con la vasopresina, la PAM se sostiene. Cuánto se puede bajar aquí es ilustrativo.', set: { f: { na: 15, vasopresina: 0.03 } }, r: ['#bomba-na', '[data-fila="pa"]'], c: C.vasopresina, org: 'ilustrativo' },
      { t: 'Con lupa: el V₁ y el α₁ empujan el mismo carro hacia el depósito de calcio. Que compartan esa cadena es fisiología general.', set: { lupa: 'liso-arteriola', cas: 'completa' }, r: ['#l-sec-v1', '#l-carro', '#l-ret'], c: C.vasopresina, org: 'fisiología general' }] } },
  { id: 'vasopresina-sano', fam: 'vaso', tit: 'Vasopresina en el sano', sub: 'no sube la PA', pac: 'paulino', f: { na: 0, vasopresina: 0.03 }, reg: { vasopresina: 'septico' }, lupa: 'liso-arteriola', pacientes: ['paulino', 'sano'],
    frase: (S, R) => S.pac === 'sano' ? ['En el voluntario sano, la vasopresina no sube la PA; en el shock vasodilatador, sí. Por qué, el libro no lo explica.', C.vasopresina]
      : ['En Amparo, con los vasos abiertos, la vasopresina sola sube la PA: otra cerradura, la V₁.', C.vasopresina],
    guia: { tit: 'La vasopresina: vasodilatado frente a sano', pasos: [
      { t: 'Amparo, con el vaso abierto por la sepsis: la vasopresina encaja en el V₁ y la PA sube.', set: { pac: 'paulino' }, r: ['#e-anillo [data-cerr="v1"]', '[data-fila="pa"]'], c: C.vasopresina },
      { t: 'La misma dosis en un voluntario sano: la PA no sube. Lo dice el libro; por qué, no lo explica.', set: { pac: 'sano' }, r: ['[data-fila="pa"]', '#e-cal'], c: C.vasopresina, org: 'la fuente no lo dice' },
      { t: 'Donde más aprieta: la piel, el músculo y el territorio esplácnico.', r: ['#e-anillo'], c: C.vasopresina },
      { t: 'Aquí solo se dibuja el V₁. La misma hormona abre el V₂ del túbulo distal (reabsorbe agua) y el V₃ de la hipófisis anterior (libera ACTH).', r: ['#e-anillo [data-cerr="v1"]'], c: C.vasopresina }] } },
  { id: 'dopamina', fam: 'vaso', tit: 'Dopamina', sub: 'tres tramos', pac: 'paulino', f: { dopamina: 2 }, reg: { dopamina: 'septico' }, lupa: 'liso-arteriola',
    frase: (S, R) => { const d = S.f.dopamina;
      return d === 0 ? ['Sube la dopamina tramo a tramo: cada tramo abre otra cerradura.', C.dopa]
        : d <= 3 ? ['Hasta 3 µg/kg/min, solo las cerraduras de la dopamina de los lechos renal y esplácnico: sube su flujo, no la PA.', C.dopa]
        : d <= 10 ? ['Entre 3 y 10, el β₁ del corazón: sube el volumen latido. Y más taquicardia que con los demás vasopresores.', C.dopa]
        : ['Por encima de 10, el α: sube la RVS, y esa poscarga puede deshacer la subida del volumen latido.', C.dopa]; },
    guia: { tit: 'Amparo: la dopamina, tramo a tramo', pasos: [
      { t: 'A 2 µg/kg/min solo encajan las cerraduras de la dopamina, la estrella, de las arteriolas del riñón y del intestino: sube su flujo.', set: { f: { dopamina: 2 } }, r: ['#e-anillo [data-cerr="dopa"]'], c: C.dopa },
      { t: 'Entre 3 y 10, el β₁ del miocito: sube el volumen latido.', set: { f: { dopamina: 7 } }, r: ['#e-mio', '[data-fila="ic"]'], c: C.dopa },
      { t: 'Por encima de 10, el α₁ del anillo: sube la RVS, y esa poscarga puede deshacer la subida del volumen latido.', set: { f: { dopamina: 15 } }, r: ['#e-anillo', '[data-fila="irvs"]'], c: C.dopa },
      { t: 'El precio: más taquicardia y arritmias, como la FA, que con los demás vasopresores. Hoy está en desuso en el séptico y en el cardiogénico.', r: ['#e-nodo', '[data-fila="fc"]'], c: C.dopa }] } },
  { id: 'adrenalina', fam: 'vaso', tit: 'Adrenalina', sub: 'lactato y glucemia', pac: 'paulino10', f: { na: 26, vasopresina: 0.03, adrenalina: 0.1 }, reg: { na: 'shock', vasopresina: 'septico', adrenalina: 'septico' }, fijos: ['na', 'vasopresina'], lupa: 'miocito',
    frase: (S, R) => S.f.adrenalina > 0 ? [`Sube todo, también el lactato (${coma(R.lact, 1)}) y la glucemia (${Math.round(R.glu)}): no los leas como hipoperfusión.`, C.adre]
      : ['Amparo con noradrenalina y vasopresina. Añade adrenalina y mira las dos cifras del laboratorio.', C.adre],
    guia: { tit: 'Amparo, hora 10: la adrenalina', pasos: [
      { t: 'La adrenalina es un β potente y además abre el α: llaves en el β₁ del miocito y en el α₁ del anillo. El β₂ de los vasos lo da el Manual UMI.', set: { f: { na: 26, vasopresina: 0.03, adrenalina: 0.1 } }, r: ['#e-mio', '#e-anillo'], c: C.adre, c2: C.umi },
      { t: 'Se encienden dos cifras del laboratorio: el lactato, por más producción aeróbica, y la glucemia, porque el α frena la insulina.', r: ['[data-fila="lact"]', '[data-fila="glu"]'], c: C.adre },
      { t: 'Ese lactato engaña: no es hipoperfusión.', r: ['[data-fila="lact"]'], c: C.adre },
      { t: 'El α también aprieta el lecho esplácnico: puede dañar la barrera de la mucosa del intestino.', r: ['#e-anillo'], c: C.adre },
      { t: 'En el séptico es de segunda línea (cap. 14) o de tercera (Tabla 17.2): las fuentes discrepan.', r: ['#bomba-adrenalina'], c: C.adre, c2: C.t172 }] } },
  { id: 'fenilefrina', fam: 'vaso', tit: 'Fenilefrina', sub: 'la FC baja', pac: 'anestesia', f: { fenilefrina: 35 }, reg: { fenilefrina: 'anestesia' }, lupa: 'nodo',
    frase: (S, R) => S.f.fenilefrina > 0 ? ['Aprieta y nada más: ninguna llave en el β, y aun así la FC baja. Es refleja.', C.csFenil] : ['Hipotensión de la anestesia. Sube la fenilefrina y mira el metrónomo.', C.fenil],
    guia: { tit: 'La fenilefrina: α puro', pasos: [
      { t: 'La fenilefrina solo abre el α₁: no tiene llave para el β.', set: { f: { fenilefrina: 35 } }, r: ['#e-anillo'], c: C.fenil },
      { t: 'El anillo se cierra y la PA sube.', r: ['#e-cal', '[data-fila="pa"]'], c: C.fenil },
      { t: 'Ninguna llave en el β₁ del metrónomo, y aun así la FC baja: es una bradicardia refleja.', r: ['#e-nodo', '[data-fila="fc"]'], c: C.csFenil },
      { t: 'Con disfunción cardíaca puede bajar el volumen latido, y el riñón y el intestino reciben menos riego.', r: ['#e-mio'], c: C.fenil },
      { t: 'En la anestesia: bolo de 50-100 µg o perfusión desde 10-35 µg/min, máximo 200. En el shock, no se recomienda.', r: ['#bomba-fenilefrina'], c: C.fenil }] } },
  { id: 'dobutamina', fam: 'ino', tit: 'Dobutamina', sub: 'misma cerradura, dos células', pac: 'aurelio', f: { na: 5, dobutamina: 5 }, reg: { na: 'fija5', dobutamina: 'cardiogenico' }, fijos: ['na'], lupa: 'miocito',
    frase: (S, R) => S.f.dobutamina > 0 ? ['La dobutamina empuja más fuerte y más deprisa, y gasta más oxígeno; la PA se mantiene.', C.dobuta] : ['Aurelio, solo con noradrenalina a 5 µg/min: poca señal en el miocito y el gasto bajo.', C.csNa],
    guia: { tit: 'Aurelio: la dobutamina', pasos: [
      { t: 'La dobutamina encaja en el β₁ del miocito y del metrónomo.', set: { f: { na: 5, dobutamina: 5 } }, r: ['#e-mio', '#e-nodo'], c: C.dobuta },
      { t: 'Misma cerradura, célula distinta: en el miocito sube la fuerza; en el nodo, la frecuencia (+5-15 lpm, a veces más de 30).', r: ['#e-medidor', '#e-nodo', '[data-fila="fc"]'], c: C.dobuta, c2: C.glucMec },
      { t: 'Con lupa: el β₁ gira el cilindro, la adenilato ciclasa hace AMPc, la proteína cinasa abre el canal de Ca²⁺ y el calcio hace tirar a las proteínas contráctiles.', set: { lupa: 'miocito', cas: 'completa' }, r: ['#l-cerr', '#l-prensa', '#l-mano', '#l-canal', '#l-trinq'], c: C.glucMec },
      { t: 'Vasodilata un poco, pero la PA se mantiene: el volumen latido compensa.', r: ['#e-anillo', '[data-fila="pa"]'], c: C.dobuta },
      { t: 'El precio: más consumo de O₂ y más trabajo del corazón. Si no mejora pronto, no retrasar el soporte mecánico.', r: ['#e-medidor'], c: C.dobuta, c2: C.trabajo }] } },
  { id: 'milrinona', fam: 'ino', tit: 'Milrinona', sub: 'sin cerradura', pac: 'aurelio', f: { na: 5, milrinona: 0.375 }, reg: { na: 'fija5', milrinona: 'cardiogenico' }, fijos: ['na'], lupa: 'miocito',
    frase: (S, R) => S.f.milrinona > 0 ? ['La milrinona no tiene cerradura: atasca la PDE. Fuerza con menos taquicardia, pero baja la PA.', C.milri] : ['Aurelio, solo con noradrenalina a 5 µg/min. Sube la milrinona y mira la PA.', C.csNa],
    guia: { tit: 'Aurelio: la milrinona', pasos: [
      { t: 'La milrinona no trae llave: no toca ninguna cerradura.', set: { f: { na: 5, milrinona: 0.375 } }, r: ['#e-mio'], c: C.milri },
      { t: 'Dentro, atasca la trituradora del AMPc (la fosfodiesterasa): el AMPc se acumula y entra más calcio.', set: { lupa: 'miocito', cas: 'completa' }, r: ['#l-pde', '#l-bandeja', '#l-canal'], c: C.milri, c2: C.ipde },
      { t: 'Funciona también con el β bloqueado: actúa por debajo de la cerradura.', r: ['#l-cerr', '#l-pde'], c: C.ipde },
      { t: 'Vasodilata: el anillo se abre y la PAM baja; con menos taquicardia que la dobutamina.', r: ['#e-anillo', '[data-fila="pa"]', '[data-fila="fc"]'], c: C.milri },
      { t: 'Semivida 2,5 h, más larga en la insuficiencia renal: se ajusta por el aclaramiento (Tabla 16.3).', r: ['#bomba-milrinona'], c: C.t163 }] } },
  { id: 'tsvi', fam: 'ino', tit: 'Obstrucción del TSVI', sub: 'apretar ayuda', pac: 'tsvi', f: { dobutamina: 5, fenilefrina: 0 }, reg: { dobutamina: 'tsvi', fenilefrina: 'tsvi' }, lupa: 'miocito',
    frase: (S, R) => S.f.dobutamina > 0 ? ['En la obstrucción del tracto de salida, los inotrópicos están contraindicados: aquí la FC sube y la PA cae (cifras ilustrativas).', C.csIno]
      : S.f.fenilefrina > 0 ? ['Apretar ayuda: la fenilefrina sube la poscarga y la FC baja.', C.csFenil] : ['Elige: dobutamina (empuja) o fenilefrina (aprieta).', C.csFenil],
    guia: { tit: 'La obstrucción dinámica del TSVI', pasos: [
      { t: 'En el shock cardiogénico por obstrucción dinámica del tracto de salida del VI, los inotrópicos están contraindicados.', set: { f: { dobutamina: 5, fenilefrina: 0 } }, r: ['#e-mio'], c: C.csIno },
      { t: 'Con la dobutamina, la FC sube; y aquí la PA cae. Cómo empeora la obstrucción: fisiología general.', r: ['[data-fila="fc"]', '[data-fila="pa"]'], c: C.dobuta, org: 'fisiología general' },
      { t: 'La fenilefrina, un vasoconstrictor puro, es más apropiada: sube la poscarga y puede provocar bradicardia refleja.', set: { f: { dobutamina: 0, fenilefrina: 60 } }, r: ['#e-anillo', '[data-fila="fc"]'], c: C.csFenil },
      { t: 'La ecografía del tracto de salida no está en este modelo: las cifras de este paciente son ilustrativas.', r: ['[data-fila="pa"]'], c: C.csFenil, org: 'ilustrativo' }] } },
  { id: 'betabloqueo', fam: 'freno', tit: 'El β tapado', sub: 'anafilaxia y glucagón', pac: 'begona', f: { adrenalina: 10, bisoprolol: 1, glucagon: 0 }, reg: { adrenalina: 'anafilaxia', bisoprolol: 'cronico', glucagon: 'anafilaxia' }, lupa: 'mastocito',
    frase: (S, R) => S.f.adrenalina === 0 ? ['Sin adrenalina, el mastocito suelta sus gránulos: los vasos se abren y fugan.', C.anaShock]
      : !S.f.bisoprolol ? ['Sin betabloqueante, la adrenalina para la reacción: los gránulos se quedan dentro.', C.anaAdre]
      : !S.f.glucagon ? ['Con el β tapado, la adrenalina rebota: la reacción sigue y la PA no sube.', C.anaGluc]
      : ['Con el β tapado, el glucagón entra por otra cerradura: el corazón responde.', C.glucMec],
    guia: { tit: 'Begoña: el betabloqueado', pasos: [
      { t: 'Sin betabloqueante, la adrenalina encaja en el β del mastocito y los gránulos se quedan dentro: es el único fármaco que para la reacción.', set: { f: { adrenalina: 10, bisoprolol: 0, glucagon: 0 }, lupa: 'mastocito' }, r: ['#e-mast'], c: C.anaAdre, c2: C.anaGluc },
      { t: 'Begoña toma bisoprolol: un tapón metido en la cerradura β. Entra, no alinea los pines y no gira; la llave de la adrenalina rebota.', set: { f: { adrenalina: 10, bisoprolol: 1, glucagon: 0 }, lupa: 'mastocito' }, r: ['#l-cerr', '#l-llave'], c: C.anaGluc },
      { t: 'Los gránulos siguen saliendo: el vaso se abre y la PA no sube.', r: ['#e-mast', '#e-anillo', '[data-fila="pa"]'], c: C.anaGluc },
      { t: 'Entra el glucagón por su propia cerradura: activa la misma adenilato ciclasa y el corazón responde aunque el β esté tapado.', set: { f: { adrenalina: 10, bisoprolol: 1, glucagon: 1 }, lupa: 'miocito', cas: 'completa' }, r: ['#l-sec-gluc', '#l-prensa'], c: C.glucMec },
      { t: 'En el mastocito puede devolver la respuesta a la adrenalina; cómo lo hace allí, la fuente no lo dice. Dosis: 1-5 mg IV en 5 min y 5-15 µg/min. Puede dar vómitos: de lado.', set: { lupa: 'mastocito' }, r: ['#l-duda'], c: C.anaGluc, org: 'la fuente no lo dice' }] } },
  { id: 'cocaina', fam: 'freno', tit: 'Cocaína y betabloqueo', sub: 'el α sin nadie enfrente', pac: 'cocaina', f: { betabloqueante: 0 }, reg: { betabloqueante: 'sca' }, lupa: 'liso-arteriola',
    frase: (S, R) => S.f.betabloqueante ? ['Tapar el β deja al α sin nadie enfrente: el anillo, también el de la coronaria, se cierra más.', C.cocaina] : ['La noradrenalina del propio cuerpo (fisiología general) ocupa α y β. Pon el betabloqueante y mira el anillo.', C.cocaina],
    guia: { tit: 'La isquemia por cocaína', pasos: [
      { t: 'Con la cocaína, la noradrenalina del propio cuerpo, en llaves crema, sale de la fibra simpática y ocupa α₁ y β. Esto no lo explica el libro: fisiología general.', set: { f: { betabloqueante: 0 } }, r: ['#e-nervio'], c: C.cocaina, org: 'fisiología general' },
      { t: 'Un betabloqueante tapa los β: el β₂ que aflojaba el anillo deja de actuar. Que el β₂ dilate la coronaria lo da el Manual UMI.', set: { f: { betabloqueante: 1 } }, r: ['#e-anillo [data-cerr="beta2"]'], c: C.cocaina, c2: C.umi },
      { t: 'El α₁ queda sin nadie enfrente: el anillo, también el de la coronaria, se cierra más.', r: ['#e-anillo', '#e-cal'], c: C.cocaina },
      { t: 'Por eso los betabloqueantes están contraindicados en la isquemia por cocaína.', r: ['#e-cal'], c: C.cocaina }] } },
  { id: 'bronquio', fam: 'otro', tit: 'El bronquio', sub: 'β₂ y muscarínico', pac: 'asma', f: { albuterol: 0, ipratropio: 0 }, reg: { albuterol: 'asma', ipratropio: 'asma' }, lupa: 'liso-bronquio',
    frase: (S, R) => { const luz = `luz ${Math.round(100 * R.radioB)} % de la de un bronquio relajado`;
      return S.f.albuterol ? [`La misma célula lisa, en el bronquio: el β₂ afloja el anillo y la luz se abre (${luz}).`, C.asmaB2]
        : S.f.ipratropio ? [`El ipratropio tapa la cerradura muscarínica y la luz se abre algo (${luz}); que la acetilcolina del vago apriete el bronquio es fisiología general. Pon también el albuterol.`, C.ipra]
        : [`En la crisis, el anillo de músculo liso del bronquio está apretado (${luz}): el mismo músculo que en la arteriola, en otro órgano. Pon el albuterol.`, C.asmaB2]; },
    guia: { tit: 'La misma célula, otro órgano', pasos: [
      { t: 'El mismo músculo liso, en otro órgano: el bronquio lleva cerraduras β₂ en sus células lisas.', set: { f: { albuterol: 0, ipratropio: 0 } }, r: ['#e-anillo'], c: C.asmaB2 },
      { t: 'El albuterol inhalado encaja en el β₂: el anillo se afloja y la luz del bronquio se abre.', set: { f: { albuterol: 1, ipratropio: 0 } }, r: ['#e-anillo', '#e-cal'], c: C.asmaB2 },
      { t: 'Con lupa: el β₂ mueve la misma máquina del AMPc que el β₁ del miocito; aquí suelta el trinquete. Esa cadena es fisiología general.', set: { lupa: 'liso-bronquio', cas: 'completa' }, r: ['#l-prensa', '#l-trinq'], c: C.asmaB2, org: 'fisiología general' },
      { t: 'El ipratropio es un tapón en la cerradura muscarínica de las vías aéreas.', set: { f: { albuterol: 1, ipratropio: 1 } }, r: ['#l-sec-musc'], c: C.ipra },
      { t: 'Con el aerosol a dosis altas: taquicardia, temblor, hiperglucemia e hipopotasemia, entre otros.', r: ['[data-fila="fc"]', '[data-fila="k"]'], c: C.asmaAdv }] } },
];
export const ESTADO = Object.fromEntries(ESTADOS.map(e => [e.id, e]));
export function fraseNA(S, R) {
  const na = S.f.na, kg = na / PACIENTES[S.pac].peso;
  let t;
  // lo que cambia respecto a la bomba parada: el IC (el β) y la IRVS (el α), leídos del modelo
  const R0 = efecto({ ...S, f: { ...S.f, na: 0 } }), c1 = x => coma(x, 1);
  const cambio = `IC ${c1(R0.ic)} → ${c1(R.ic)}; IRVS ${c1(R0.irvs)} → ${c1(R.irvs)}`;
  if (na === 0) t = `Sin noradrenalina, los vasos de Amparo están abiertos (IRVS ${c1(R.irvs)}, PAM ${Math.round(R.pam)}). Sube la bomba y mira qué célula responde primero.`;
  else if (na < 10) t = `Por debajo de 10 µg/min, la noradrenalina empuja más que aprieta: el β del corazón sube el gasto y el anillo apenas se cierra (${cambio}).`;
  else if (na < 30) t = `Por encima de 10 manda el α: las cerraduras del anillo se llenan, la luz se estrecha y sube la RVS (${cambio}).`;
  else t = 'A 30 µg/min, más dosis apenas aprieta: otra cerradura, no más llave. Es el momento del segundo vasopresor.';
  if (kg >= 0.25 && !S.f.vasopresina) t += ` Para Amparo, ${na} µg/min son ${coma(kg, 2)} µg/kg/min: la Tabla 17.2 añade vasopresina e hidrocortisona.`;
  return [t, kg >= 0.25 && !S.f.vasopresina ? C.t172 : C.naDosis];
}

/* ============================================================
   4. Una sola función: efecto(estado) → ocupación de cada cerradura, la maquinaria de cada célula, el calibre de los
   tubos y las cifras del monitor. De aquí salen el dibujo, el monitor y la frase. Dirección: la de la fuente (cada
   fármaco, con su página); cuánto: ilustrativo (la fuente no lo da). Prueba de paciente posible al final.
   ============================================================ */
export const IRVS_REF = 25;   // IRVS de referencia del dibujo (el límite bajo del objetivo de la Tabla 16.2): el calibre «normal»
// La dosis en la unidad con la que trabaja la tabla de llaves (las pautas por kilo se pasan con el peso del paciente)
export function canon(k, d, S) {
  const F = FARMACOS[k], reg = F.regimen[S.reg?.[k]] || {};
  if (reg.tog) return d ? (reg.dosisModelo ?? 1) : 0;
  if (reg.porKg && F.unidad === 'µg/min') return d * PACIENTES[S.pac].peso;
  return d;
}
export function ocupar(S) {
  const P = PACIENTES[S.pac], occ = {}, dentro = { pde: 0 }, sist = { lact: 0, glu: 0, fc: 0, k: 0 };
  let fcBeta = 0;   // la taquicardia que pasa por el β₁ del nodo: el betabloqueante la tapa
  for (const cel in CELULAS) { occ[cel] = {}; for (const r of CELULAS[cel].receptores) occ[cel][r] = { ag: 0, tap: 0, endo: 0, quien: null, max: 0, tapQuien: null }; }
  if (P.organo === 'bronquio') occ['liso-bronquio'].musc.endo = 0.5;   // la acetilcolina del vago: fisiología general
  for (const [k, d0] of Object.entries(S.f)) {
    if (!d0) continue;
    const F = FARMACOS[k], d = canon(k, d0, S);
    for (const ll of F.llaves) {
      const o = ll.occ(d); if (o <= 0) continue;
      for (const cel in occ) {
        const c = occ[cel][ll.rec]; if (!c || (ll.cel && !ll.cel.includes(cel))) continue;
        if (ll.tipo === 'ag') { c.ag = 1 - (1 - c.ag) * (1 - o); if (o > c.max) { c.max = o; c.quien = k; } }
        else if (o > c.tap) { c.tap = o; c.tapQuien = k; }
      }
    }
    for (const dn of F.dentro || []) dentro[dn.diana] = Math.max(dentro[dn.diana], dn.inh(d));
    for (const [q, fn] of Object.entries(F.sist || {})) { if (q === 'fc' && F.fcBeta) fcBeta += fn(d); else sist[q] += fn(d); }
  }
  for (const [rec, o] of Object.entries(P.endogeno || {})) for (const cel in occ) { const c = occ[cel][rec]; if (c) c.endo = o; }
  for (const cel in occ) for (const r in occ[cel]) { const c = occ[cel][r]; if (c.endo) { c.ag = 1 - (1 - c.ag) * (1 - c.endo); if (c.endo > c.max) { c.max = c.endo; c.quien = 'endogeno'; } } }
  sist.fc += fcBeta * (1 - (occ.nodo.beta1.tap || 0));
  // El glucagón devuelve la respuesta del mastocito a la adrenalina (S p. 66); cómo, la fuente no lo dice: aquí se afloja el tapón
  if (S.f.glucagon && occ.mastocito.beta2.tap) occ.mastocito.beta2.tap *= 0.55;
  const act = (cel, rec) => { const c = occ[cel]?.[rec]; return c ? c.ag * (1 - c.tap) : 0; };
  // La maquinaria (0-1,6; ilustrativo). AMPc = lo que fabrica la prensa / lo que tritura la PDE
  const ampcDe = (cel, pdeGan) => (0.2 + 0.6 * act(cel, 'beta1') + 0.6 * act(cel, 'gluc') + 0.6 * act(cel, 'beta2')) / (1 - pdeGan * dentro.pde);
  const maq = {
    miocito: { ampc: Math.min(1.6, ampcDe('miocito', 0.5)), pde: dentro.pde },
    nodo: { ampc: Math.min(1.6, ampcDe('nodo', 0.35)), pde: dentro.pde },
  };
  maq.miocito.ca = maq.miocito.ampc; maq.nodo.ca = maq.nodo.ampc;
  // La célula lisa de la arteriola: aprieta por α₁ y V₁ (la vía Gq e IP₃: fisiología general); afloja por β₂, D y la PDE atascada
  const ip3 = Math.min(1, act('liso-arteriola', 'alfa1') * (P.sensAlfa ?? 1) + 0.75 * P.sensV1 * act('liso-arteriola', 'v1'));
  const relaja = (P.pesoB2 ?? 0.5) * act('liso-arteriola', 'beta2') + 0.12 * act('liso-arteriola', 'dopa') + 1.5 * dentro.pde;
  const mast = P.mediadores ? 1 - 0.85 * act('mastocito', 'beta2') : 0;   // lo que suelta el mastocito (1 = todo)
  maq['liso-arteriola'] = { ip3, ca: 0.2 + 0.8 * ip3, relaja, ampc: 0.2 + relaja * 0.6, pde: dentro.pde };
  maq['liso-arteriola'].tono = act('liso-arteriola', 'alfa1') * (P.sensAlfa ?? 1) + 0.75 * P.sensV1 * act('liso-arteriola', 'v1') - relaja - 1.4 * mast;
  maq.mastocito = { suelta: mast };
  const ip3b = act('liso-bronquio', 'musc'), relB = act('liso-bronquio', 'beta2');
  maq['liso-bronquio'] = { ip3: ip3b, ca: 0.2 + 0.8 * ip3b, ampc: 0.2 + 0.8 * relB, relaja: relB, tono: (P.tonoBronquio ? 0.4 : 0) + 0.8 * ip3b - relB };
  return { occ, act, dentro, sist, maq };
}
export function efecto(S) {
  const P = PACIENTES[S.pac], B = P.base;
  const S0 = { ...S, f: Object.fromEntries(Object.keys(S.f).map(k => [k, 0])) };
  const A = ocupar(S), A0 = ocupar(S0);
  const fuerza = a => 1 + 0.6 * (a.maq.miocito.ampc - 0.2);
  const F = fuerza(A) / fuerza(A0);
  const dT = A.maq['liso-arteriola'].tono - A0.maq['liso-arteriola'].tono;
  const irvs = B.irvs * Math.exp(P.kR * dT);
  const fcBase = B.fcSinBeta && !S.f.bisoprolol ? B.fcSinBeta : B.fc;
  const fcIntr = fcBase * (1 + 0.3 * (A.maq.nodo.ampc - A0.maq.nodo.ampc)) + A.sist.fc;
  const pvc = B.pvc + (P.mediadores ? 2 * (1 - A.maq.mastocito.suelta) : 0);
  const pam0 = B.pvc + B.ic * B.irvs;
  const baro = P.baro ?? 0.6;
  let fc = fcIntr, ic = B.ic, pam = pam0;
  for (let i = 0; i < 6; i++) {
    ic = P.tsvi ? B.ic * Math.pow(F, -0.6) * Math.pow(fc / fcBase, -0.6) * Math.pow(irvs / B.irvs, 0.3)
      : B.ic * Math.pow(F, 0.8) * Math.pow(fc / fcBase, 0.4) * Math.pow(irvs / B.irvs, -P.post);
    pam = pvc + ic * irvs;
    fc = fcIntr - baro * (pam - pam0);
  }
  const pp = B.pp * Math.pow(ic / B.ic, 0.6);
  const lact = B.lact == null ? (A.sist.lact ? 'sube' : null) : B.lact + A.sist.lact;
  const glu = B.glu == null ? (A.sist.glu ? 'sube' : null) : B.glu + A.sist.glu;
  const k = B.k == null ? null : B.k + A.sist.k;
  // Los calibres (el radio verdadero relativo y el del dibujo, que exagera el cambio: ilustrativo)
  const radio = Math.pow(B.irvs / irvs, 0.25);                       // relativo al de partida del paciente
  const radioDib = clamp(Math.pow(IRVS_REF / irvs, 1.1), 0.55, 2.4);  // relativo al calibre de referencia (exagerado: ilustrativo)
  const tB = A.maq['liso-bronquio'].tono;
  const radioBDib = P.organo === 'bronquio' ? clamp(0.95 * Math.exp(-1.1 * tB), 0.35, 1.15) : 1;
  // la luz del bronquio, en % del radio de un bronquio relajado (tono 0): en la crisis parte estrecha (ilustrativo)
  const radioB = P.organo === 'bronquio' ? Math.min(1, radioBDib / 0.95) : 1;
  const R = { fc, ic, irvs, pvc, pam, pp, pas: pam + 2 * pp / 3, pad: pam - pp / 3, spo2: B.spo2, fr: B.fr, t: B.t, lact, glu, k,
    F, radio, radioDib, radioB, radioBDib, A, A0, P, S };
  // Paciente posible (farmacos.md §5.3): si algo sale de aquí, se busca el error en su origen; nunca se recorta
  const fuera = [];
  if (pam < 40 || pam > 130) fuera.push('PAM ' + pam.toFixed(0)); if (fc < 40 || fc > 170) fuera.push('FC ' + fc.toFixed(0));
  if (ic < 1.2 || ic > 5) fuera.push('IC ' + ic.toFixed(2)); if (pvc < 0 || pvc > 25) fuera.push('PVC'); if (R.pad < 25 || R.pas > 200) fuera.push('PAS/PAD');
  if (typeof lact === 'number' && lact > 12) fuera.push('lactato'); if (typeof glu === 'number' && glu > 400) fuera.push('glucemia');
  if (fuera.length) console.warn('Paciente imposible:', fuera.join(', '), S.id, JSON.stringify(S.f));
  R.fuera = fuera;
  return R;
}

