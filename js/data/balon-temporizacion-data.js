// Los 4 errores de temporización del balón de contrapulsación y el momento correcto (una sola vez, aquí).
// Fuente: Gillespie LE et al. J Soc Cardiovasc Angiogr Interv 2024;3(5):101337, doi 10.1016/j.jscai.2024.101337.
// PDF en docs/ (el número de página impresa es el del PDF): Fig. 7 y su pie en la p. 6; «Timing errors» en la p. 8.
// Las curvas de la figura NO se copian (licencia sin derivadas): la consola las recrea con su propio trazado.
// `tim` son los retrasos que el motor aplica (s; − = antes, + = después). Inflado: respecto al cierre de la válvula aórtica
// (la muesca dícrota); vaciado: respecto a la onda R. Los segundos son del modelo (ilustrativo): la fuente no da cifras de ms.
export const BALON_CITA = { corto: 'Gillespie 2024', pdf: 'docs/gillespie-2024-balon-contrapulsacion-jscai.pdf', nombre: 'Gillespie et al., JSCAI 2024' };
export const pdfPagina = (p) => `${BALON_CITA.pdf}#page=${p}`;

export const TEMPORIZACION = [
  { k: 'ok', boton: 'Correcta', tim: undefined, p: 8,
    ve: 'El balón se hincha en la muesca dícrota y forma una «V» marcada; la subida del aumento es paralela a la subida sistólica anterior y llega más alto. La telediastólica asistida baja 15-20 mmHg respecto a la no asistida y la sistólica asistida queda unos 5 mmHg por debajo de la anterior.',
    paciente: 'El aumento diastólico mejora la perfusión coronaria y el vaciado antes de la sístole baja la poscarga: menos consumo de oxígeno.',
    nota: 'En este modelo la telediastólica asistida baja menos de 15-20 mmHg: la fuente da la cifra, el modelo no la alcanza.' },
  { k: 'infPre', boton: 'Inflado precoz', tim: { inf: -0.07 }, p: 8, p2: 6,
    ve: 'El aumento empieza antes de la muesca dícrota, se pierde la «V» y el aumento se monta sobre el pico sistólico hasta que los dos picos casi no se distinguen.',
    paciente: 'El balón se hincha con la aórtica aún abierta: sube la poscarga, la válvula se cierra antes de tiempo y el ventrículo se vacía mal. Sube el volumen y la presión telediastólica del VI y la PCP, y con ellos el consumo de oxígeno; puede haber regurgitación aórtica. El gasto cardíaco baja.',
    corregir: 'Se corrige inflando en la muesca dícrota; en el transporte, mejor el modo automático.' },
  { k: 'infTar', boton: 'Inflado tardío', tim: { inf: 0.08 }, p: 8, p2: 6,
    ve: 'La muesca dícrota se ve bien y el balón se hincha mucho después de ella: se pierde la «V» y el aumento diastólico es mucho menor; puede quedar igual o por debajo de la sistólica sin asistir.',
    paciente: 'Con el aumento tan pequeño llega poca sangre extra a las coronarias: perfusión coronaria insuficiente. Aún puede quedar algo de beneficio, pero lejos del que daría un balón bien sincronizado.',
    corregir: 'Se corrige inflando en la muesca dícrota (mejor, el modo automático).' },
  { k: 'desPre', boton: 'Desinflado precoz', tim: { des: -0.10 }, p: 8, p2: 6,
    ve: 'Tras el pico del aumento la presión cae en picado. La sistólica asistida es igual o mayor que la no asistida y la telediastólica asistida es igual o menor que la no asistida.',
    paciente: 'El balón se vacía antes de la contracción isovolumétrica: casi no reduce la poscarga ni el consumo de oxígeno, y casi no sube la presión de perfusión coronaria. El vacío de la mitad de la diástole puede invertir el flujo en coronarias y carótidas.',
    corregir: 'Se corrige alargando el tiempo de inflado; el modo automático suele corregirlo.' },
  { k: 'desTar', boton: 'Desinflado tardío', tim: { des: 0.09 }, p: 8, p2: 6,
    ve: 'La telediastólica asistida es igual o mayor que la no asistida (en vez de menor) y el pico del aumento diastólico se ensancha.',
    paciente: 'El balón sigue hinchado cuando la válvula aórtica ya se abre: en vez de bajar la poscarga, la resistencia del balón dificulta la eyección del VI y alarga la contracción isovolumétrica. Sube el consumo de oxígeno.',
    corregir: 'Se corrige acortando el tiempo de inflado; el modo automático suele corregirlo.' },
];
export const tempDe = (k) => TEMPORIZACION.find((e) => e.k === k) || TEMPORIZACION[0];
