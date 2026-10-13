// "The Heart by Ultrasound" (David Ouyang, grupo EchoNet; código en github.com/douyang/echodemo): el atlas
// interactivo de ecocardiografía del que salen varias ideas de este simulador. Aquí solo hay enlaces a su web
// (https://intro2echo.com), nunca su contenido copiado. Cada capítulo se abre por su clave en la dirección
// (#as, #tee…), como dice el README del repositorio; las claves salen de src/order.js.
// Datos puros: index.js pinta el apartado y los accesos con contexto.

export const ATLAS_URL = 'https://intro2echo.com/';
export const ATLAS_REPO = 'https://github.com/douyang/echodemo';
export const atlasUrl = (clave) => `${ATLAS_URL}#${clave}`;

// Las 10 partes y los capítulos extra, en su orden (src/order.js). Títulos y resúmenes, traducidos del README.
export const ATLAS_PARTES = [
    { parte: 'I · Física', caps: [
        ['pulse', '01', 'Pulso', 'Una línea de exploración: pulso, ecos, modo A, longitud de onda, resolución axial, atenuación.'],
        ['image', '02', 'Imagen', 'Una imagen sectorial construida línea a línea; cuatro artefactos.'],
        ['shift', '03', 'Doppler', 'La ecuación Doppler, el ángulo del haz y el límite de Nyquist; Doppler pulsado, continuo y color.'],
    ] },
    { parte: 'II · Vistas', caps: [
        ['windows', '04', 'Vistas transtorácicas', '35 vistas en tres paneles (sonda y cuerpo, el corte rotulado y la eco) y una sonda libre que nombra la vista más cercana.'],
        ['tee', '05', 'Ecocardiografía transesofágica', '17 vistas, con las 11 de la exploración perioperatoria básica; sonda libre que avanza, gira y flexiona.'],
    ] },
    { parte: 'III · Fisiología', caps: [
        ['cycle', '06', 'Ciclo cardíaco', 'Wiggers con ECG, ruidos, Doppler mitral y del TSVI, y el apical 4 cámaras en el cursor.'],
        ['loop', '07', 'Asa presión-volumen', 'ESPVR, EDPVR y elastancia arterial; ventrículo hipocontráctil, rígido, con sobrecarga de presión o de volumen.'],
    ] },
    { parte: 'IV · Hemodinámica', caps: [
        ['pressure', '08', 'Hemodinámica por Doppler', 'Continuidad, velocidad y presión a través de una válvula; presión sistólica del VD; la PAD estimada por la VCI.'],
    ] },
    { parte: 'V · Función', caps: [
        ['eject', '09', 'Función sistólica', 'Método biplano de discos en las vistas apicales; el acortamiento del ápex.'],
        ['fill', '10', 'Función diastólica', 'De llenado normal a restrictivo, con el algoritmo ASE 2025.'],
        ['segments', '11', 'Contractilidad segmentaria', 'Oclusión de la DA, la CD o la circunfleja en la diana de 17 segmentos y las vistas apicales.'],
        ['stress', '12', 'Eco de estrés', 'Estrés con dobutamina en cuatro pantallas: isquemia, cicatriz, viabilidad.'],
        ['strain', '13', 'Strain', 'Strain longitudinal global por speckle tracking; patrones global, regional y de respeto apical; cardio-oncología.'],
        ['rv', '14', 'Ventrículo derecho', 'Sobrecarga de presión, de volumen y TEP agudo, en vistas centradas en el VD.'],
    ] },
    { parte: 'VI · Válvulas', caps: [
        ['as', '15', 'Estenosis aórtica', 'De normal a grave, la de bajo flujo y bajo gradiente, y la válvula bicúspide.'],
        ['ar', '16', 'Insuficiencia aórtica', 'De leve a grave con disfunción del VI.'],
        ['ms', '17', 'Estenosis mitral', 'Reumática de normal a grave: tiempo de hemipresión, planimetría y el gradiente a cualquier frecuencia.'],
        ['mr', '18', 'Insuficiencia mitral', 'De leve a grave con disfunción del VI: PISA e inversión del flujo de las venas pulmonares.'],
        ['tr', '19', 'Insuficiencia tricuspídea', 'De leve a torrencial: PISA, dilatación de VD y AD e inversión del flujo de las suprahepáticas.'],
    ] },
    { parte: 'VII · Aorta', caps: [
        ['aorta', '20', 'Enfermedades de la aorta', 'Dilatación, disección y coartación.'],
    ] },
    { parte: 'VIII · Pericardio', caps: [
        ['peri', '21', 'Enfermedad pericárdica', 'Del derrame al taponamiento; constricción frente a miocardiopatía restrictiva.'],
    ] },
    { parte: 'IX · Miocardiopatías', caps: [
        ['hcm', '22', 'Miocardiopatía hipertrófica', 'De normal a obstrucción grave, en reposo y con Valsalva; movimiento sistólico anterior.'],
        ['amyloid', '23', 'Amiloidosis cardíaca', 'De normal a avanzada; respeto apical; los criterios ecográficos ESC 2021.'],
    ] },
    { parte: 'X · Inteligencia artificial', caps: [
        ['ai', '24', 'Interpretación y medidas con IA', 'EchoPrime y EchoNet-Measurements sobre un estudio simulado, en siete pasos.'],
    ] },
    { parte: 'B · Capítulos extra', caps: [
        ['lvad', 'B1', 'Asistencias ventriculares', 'Una HeartMate 3 de 4.600 a 6.200 rpm; fallo del VD, insuficiencia aórtica nueva, obstrucción de la cánula.'],
        ['prosthetic', 'B2', 'Prótesis valvulares', 'Una prótesis aórtica de 23 mm de normal a estenosis significativa; desproporción prótesis-paciente.'],
        ['endocarditis', 'B3', 'Endocarditis infecciosa', 'Una vegetación mitral de hasta 22 mm; después, perforación del velo con insuficiencia.'],
        ['shunts', 'B4', 'Cortocircuitos: CIA, CIV y FOP', 'De pequeños a grandes; el estudio con suero agitado.'],
        ['masses', 'B5', 'Masas y trombos', 'Mixoma auricular izquierdo, trombo en el VI, fibroelastoma papilar.'],
        ['mi', 'B6', 'Complicaciones del infarto', 'Rotura septal, de músculo papilar y de pared libre con pseudoaneurisma; aneurisma apical.'],
    ] },
];

const TITULO = Object.fromEntries(ATLAS_PARTES.flatMap(p => p.caps.map(([k, n, t]) => [k, `${n} ${t}`])));
const enlace = (clave, titulo = TITULO[clave]) => ({ clave, titulo });

// Para cada vista del simulador, el capítulo del atlas donde ver la misma vista (o su tema).
export const ATLAS_VISTA = {
    a4c: [enlace('windows'), enlace('eject')],
    a2c: [enlace('windows'), enlace('eject')],
    a3c: [enlace('windows')],
    plax: [enlace('windows')],
    psaxAo: [enlace('windows')],
    psaxMv: [enlace('windows'), enlace('ms')],
    psaxPm: [enlace('windows'), enlace('segments')],
    sc4c: [enlace('windows'), enlace('peri')],
    scVci: [enlace('ivc', '08 Hemodinámica por Doppler: la PAD por la VCI')],
    sse: [enlace('windows'), enlace('aorta')],
};
// Para cada escenario del simulador, el capítulo que trata lo mismo (los de shock no tienen capítulo).
export const ATLAS_ESCENARIO = {
    derrame: [enlace('peri')],
    fallo: [enlace('eject'), enlace('loop')],
    hipertrofia: [enlace('fill'), enlace('loop')],
    dilatada: [enlace('eject'), enlace('loop')],
    tep: [enlace('rv')],
};
// Para cada modo o medida, su capítulo.
export const ATLAS_MODO = {
    M: [enlace('image')],
    D: [enlace('shift'), enlace('pressure')],
    tapse: [enlace('rv')],
    vi: [enlace('eject')],
    vci: [enlace('ivc', '08 Hemodinámica por Doppler: la PAD por la VCI')],
};
