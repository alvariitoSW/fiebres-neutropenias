// Textos y preguntas de la maqueta «iones vivos · A». Cada cifra va con su página del PDF de Marino (E, electrolitos
// caps. 35-38). Tipos de origen: ficha · fisiología general · ilustrativo.
export const PDF = '../../docs/marino-2024-electrolitos-caps35-38.pdf';
export const FICHAS = {   // la ficha de la app a la que lleva cada cita
  k: ['mr-hipopotasemia', 'Hipopotasemia'], hk: ['mr-hiperk-tratamiento', 'Hiperpotasemia · tratamiento'], hkc: ['mr-hiperk-causas', 'Hiperpotasemia · causas'],
  mg: ['mr-magnesio-deficit', 'Magnesio · déficit'], mgr: ['mr-magnesio-reposicion', 'Magnesio · reposición'], ca: ['mr-calcio-hipoca', 'Calcio · hipocalcemia'], p: ['mr-fosforo', 'Fósforo'],
};
export const CITA = {   // clave → página del PDF + ficha
  k362: { p: 19, f: 'k' }, k20: { p: 20, f: 'k' }, kcl: { p: 23, f: 'k' }, tubo: { p: 24, f: 'hkc' }, ca27: { p: 27, f: 'hk' }, mgdist: { p: 31, f: 'mg' }, mgfur: { p: 34, f: 'mg' },
  mgrep: { p: 37, f: 'mgr' }, mgret: { p: 38, f: 'mgr' }, mgalto: { p: 39, f: 'mgr' }, ca381: { p: 43, f: 'ca' }, calc: { p: 44, f: 'ca' }, caiv: { p: 45, f: 'ca' }, glu: { p: 49, f: 'p' }, p50: { p: 50, f: 'p' }, p51: { p: 51, f: 'p' },
};
export const cita = c => { const o = CITA[c]; if (!o) return ''; const [id, n] = FICHAS[o.f]; return `<a class="cita-pdf" href="${PDF}#page=${o.p}" target="_blank" rel="noopener">p. ${o.p}</a> · <button type="button" class="ver-ficha" data-ficha="${id}" data-nombre="${n}" data-resaltar="#${id}">Ver en la ficha</button>`; };
export const ORIGEN = { f: '<span class="org">ficha</span>', g: '<span class="org">fisiología general</span>', i: '<span class="org ilu">ilustrativo</span>' };

export const GUIAS = {
  sano: { tit: 'Persona sana', pasos: [
    { t: 'El 98 % del potasio está dentro de las células (unos 3.500 mEq); en el plasma hay solo unos 15 mEq. Lo que mide la analítica es esa gota.', r: ['esc-celula', 'esc-plasma'], c: 'k362', o: 'f' },
    { t: 'El calcio y el magnesio viven sobre todo en el hueso: 99 % del calcio y algo más de la mitad del magnesio. En el plasma, menos del 1 % del magnesio.', r: ['esc-hueso'], c: 'mgdist', o: 'f' },
    { t: 'Del calcio del plasma, la mitad es iónica (la que actúa); el resto va pegado a la albúmina y a aniones. La analítica corriente mide las tres juntas.', r: ['esc-fig381'], c: 'ca381', o: 'f' },
    { t: 'La curva ata el K⁺ sérico al total del cuerpo: es plana en el déficit, así que bajar 1 mEq/L cuesta 200-400 mEq.', r: ['esc-fig362'], c: 'k362', o: 'f' }] },
  damian: { tit: 'Damián: atracón, alcohol y nutrición parenteral', pasos: [
    { t: 'Damián llega con el K⁺ y el Mg²⁺ bajos y el fosfato justo. Aunque el K⁺ sérico es 3,0, le faltan 200-400 mEq: el punto rojo está sobre la curva, en la parte plana.', r: ['esc-fig362'], c: 'k362', o: 'f' },
    { t: 'La insulina y la glucosa (realimentar) meten K⁺, fosfato y Mg²⁺ en la célula: en el plasma quedan menos. Pulsa «Realimentar» y mira cómo el punto baja de la curva sin que cambie el total.', r: ['esc-celula', 'esc-plasma', 'esc-fig362'], c: 'glu', o: 'f' },
    { t: 'Con el Mg²⁺ bajo el riñón pierde potasio y el K⁺ no sube con la reposición. Por eso se repone también el magnesio.', r: ['esc-sal-orina', 'esc-plasma'], c: 'kcl', o: 'f' },
    { t: 'Si el fosfato cae por debajo de 1 mg/dL sale el sello: es el nivel grave. Reponer fosfato potásico lo levanta (y aporta K⁺).', r: ['esc-tubo'], c: 'p50', o: 'f' }] },
  rufino: { tit: 'Rufino: sonda nasogástrica y furosemida', pasos: [
    { t: 'Con la furosemida el riñón pierde K⁺ y Mg²⁺. Pulsa «Furosemida» y pasa 1 h: el contador de orina sube y el déficit crece.', r: ['esc-sal-orina', 'esc-celula'], c: 'mgfur', o: 'f' },
    { t: 'El K⁺ de 2,8 que no sube con ClK pide mirar el magnesio: con el Mg²⁺ bajo, el K⁺ se pierde por la orina.', r: ['esc-plasma', 'esc-sal-orina'], c: 'kcl', o: 'f' },
    { t: 'El MgSO₄ sube el Mg²⁺ del plasma al momento, pero el 50 % se va por la orina y a los 15 minutos el valor ya baja.', r: ['esc-plasma', 'esc-sal-orina'], c: 'mgrep', o: 'f' },
    { t: 'En el ECG la hipopotasemia (onda U, T plana, QT largo) todavía no está en el ritmo vivo: aquí se pinta el trazo que hay con un rótulo.', r: ['esc-ecg'], c: 'k20', o: 'f' }] },
  valentin: { tit: 'Valentín: transfusión masiva', pasos: [
    { t: 'Cada concentrado lleva citrato, que se pega al calcio iónico, y 2-3 mEq de K⁺. Con 10 unidades el calcio iónico baja a unos 0,84 mmol/L y el K⁺ sube.', r: ['esc-fig381', 'esc-plasma'], c: 'ca381', o: 'f' },
    { t: 'La barra del calcio pierde la parte iónica (blanca), no la de la albúmina: el total apenas se mueve y por eso hay que medir el iónico.', r: ['esc-fig381'], c: 'ca381', o: 'f' },
    { t: 'El gluconato (9 mg de calcio por mL) o el cloruro (27 mg/mL) suben el iónico unos minutos; el bolo no pasa de 200 mg.', r: ['esc-plasma', 'esc-tubo'], c: 'caiv', o: 'f' },
    { t: 'Con el K⁺ alto, el calcio arregla el ECG pero no baja el K⁺: a los 30-60 min el efecto se disipa.', r: ['esc-ecg', 'esc-fig362'], c: 'ca27', o: 'f' }] },
};
export const FUENTES = [
  ['Marino. El libro de la UCI, 5.ª ed. (2024), cap. 36 · Potasio', 'k362'], ['cap. 37 · Magnesio', 'mgdist'], ['cap. 38 · Calcio y fósforo', 'ca381'],
];
export const NOTAS = [
  ['las fuentes discrepan', 'El fosfato potásico: 4,5 mEq de K⁺ y 3 mmol de fosfato por mL (p. 23) frente a 4,3 mEq/mL (Tabla 38.5, p. 51). La maqueta usa 4,3 y no elige entre las dos.'],
  ['las fuentes discrepan', 'Hipomagnesemia: «hasta un 65 % de los pacientes de UCI» (p. 33) frente a «más del 50 %» (p. 39). Misma obra, dos cifras; las dos se citan.'],
  ['las fuentes discrepan', 'Calcio iónico bajo: la p. 44 escribe «<4,6 mg/dL o <1,7 mmol/L», pero 4,6 mg/dL son 1,15 mmol/L (Tabla 38.1, p. 43). Se reproduce tal cual; la maqueta usa 1,15.'],
  ['la fuente no lo dice', 'La forma exacta de la Fig. 36.2 (una imagen): la maqueta dibuja una curva con las dos pendientes del texto (200-400 por mEq/L de déficit, 100-200 de exceso; se usan 300 y 150) y no copia la figura.'],
  ['la fuente no lo dice', 'Cuánto cambia cada mando (insulina, furosemida, citrato, calcio): la dirección es de la ficha; la magnitud es ilustrativa y se marca así.'],
  ['la fuente no lo dice', 'ECG con el potasio bajo: Marino describe onda U, T plana y QT largo (p. 22), pero el ritmo vivo aún no los traza. Aquí no se inventa: se pinta el trazo normal con un rótulo «pendiente».'],
];
export const PROFUNDIZAR = [
  'Hipercalcemia (calcitonina, bisfosfonatos, hidrocortisona): cap. 38, ficha «Hipercalcemia». El modelo solo trata el calcio bajo.',
  'Hiperfosfatemia y su tratamiento: cap. 38; no se modela.',
  'Hormona paratiroidea y vitamina D: se citan en el texto (p. 42) pero no mueven nada aquí.',
  'Hiperpotasemia: resinas, ciclosilicato y hemodiálisis (Tabla 36.3, p. 27): la ficha «Hiperpotasemia · tratamiento».',
  'El ECG de la hipopotasemia y la escalera de la Fig. 36.4: pendientes del ritmo vivo.',
];
// ---------- Mayéutica ----------
export const APUESTA = {
  enun: 'Damián tiene 52 años, es alcohólico y desnutrido, y empieza nutrición parenteral con glucosa e insulina. Su K⁺ sérico es 3,0 mEq/L. Antes de tocar nada: ¿qué le pasa al K⁺ sérico en las próximas horas?',
  ops: [
    { t: 'Sube: la glucosa arrastra el potasio de la célula hacia el plasma.', porque: 'Dejarías de reponer potasio; en realidad baja, y con Mg²⁺ 1,1 mEq/L el riesgo de arritmia ventricular (torsade) crece.' },
    { t: 'Baja: la insulina y la glucosa lo meten en la célula, aunque el potasio total del cuerpo no cambie.', ok: true },
    { t: 'No cambia: la insulina solo mueve la glucosa, y el fosfato y el magnesio no la siguen.', porque: 'Pasarías por alto que el fosfato y el magnesio también bajan con la glucosa; el fosfato puede caer a un nivel grave y dar debilidad respiratoria.' },
    { t: 'Baja porque el potasio se pierde por la orina junto con la glucosa que sobra.', porque: 'Confundirías un movimiento (a la célula) con una pérdida: no repondrías con la lógica correcta ni vigilarías qué pasa cuando acabe el efecto.' },
  ],
  expl: 'Es un movimiento, no una pérdida: la insulina y la glucosa meten K⁺, fosfato y Mg²⁺ en la célula y en el plasma quedan menos. El total del cuerpo no cambia, y por eso el punto cae de la curva. La glucosa es la causa más frecuente de hipofosfatemia en el hospital.', c: ['k20', 'glu'],
};
export const ERROR = {
  enun: 'Una residente escribe tres frases sobre este paciente (albúmina 1,5 g/dL, calcio total 7,2 mg/dL, K⁺ 3,0 mEq/L). Marca las que tienen un error (puede haber 0, 1 o 2).',
  fr: [
    { t: 'Ca total 7,2 mg/dL con albúmina de 1,5 g/dL: hipocalcemia grave; pongo gluconato.', err: true, porque: 'La albúmina baja el calcio total, no el iónico (4,8 mg/dL, normal). Le pondrías calcio sin necesidad; hay que medir el iónico.', c: 'ca381' },
    { t: 'Con un K⁺ de 3,0 mEq/L le faltan unos 200-400 mEq de potasio.', err: false, porque: 'Es lo que dice la ficha: la parte plana de la curva.', c: 'k362' },
    { t: 'El K⁺ sube despacio: paso el ClK a 40 mEq/h por la vena cava superior, que llega antes.', err: true, porque: 'Si el ritmo previsto pasa de 20 mEq/h, la cava superior no se usa: hay riesgo (poco documentado) de asistolia.', c: 'kcl' },
  ],
};
export const CASO = { paciente: 'damian', pasos: [
  { tit: 'Día 3 · nutrición parenteral', enun: 'K⁺ 3,0, Mg²⁺ 1,1 mEq/L y fosfato 0,9 mg/dL; sin síntomas. ¿Cómo repones el potasio?',
    ops: [
      { t: 'ClK 20 mEq/h, solo potasio: ya subirá.', porque: 'El K⁺ sube mal: con el magnesio bajo el riñón sigue perdiendo potasio y la hipopotasemia se vuelve resistente.' },
      { t: 'ClK 20 mEq/h por vía periférica y MgSO₄ 6 g en 3 h.', ok: true },
      { t: 'ClK 40 mEq/h por la cava superior, para recuperar deprisa el déficit.', porque: 'Con más de 20 mEq/h por la cava superior hay riesgo de asistolia; el sello salta.' },
      { t: 'Solo MgSO₄ y esperar a que el K⁺ suba solo.', porque: 'Faltan unos 300 mEq de potasio: no se arreglan solos y el riesgo arrítmico sigue ahí.' }],
    expl: 'Hay hipomagnesemia con otras alteraciones: pauta moderada de 6 g de MgSO₄ en 3 h, y el ClK a 20 mEq/h por vía periférica.', c: ['kcl', 'mgrep'], aplica: 'repone' },
  { tit: 'Día 4 · disnea y debilidad', enun: 'Hoy tiene debilidad y respira peor; el fosfato es 0,7 mg/dL. ¿Por qué?',
    ops: [
      { t: 'La glucosa de la nutrición mete el fosfato en la célula; con fosfato <1 mg/dL falta energía en el músculo, también el respiratorio.', ok: true },
      { t: 'Es el potasio de 3,0: la debilidad es solo por hipopotasemia y ya se está corrigiendo.', porque: 'Perderías la causa: el fosfato sigue bajo, el músculo respiratorio se agota y puede necesitar ventilación.' },
      { t: 'Es el magnesio alto tras la perfusión: hay que frenarlo.', porque: 'Frenarías la reposición de un déficit real: el magnesio sérico de Damián sigue bajo, no alto.' },
      { t: 'Es hipocalcemia del citrato de la nutrición.', porque: 'No hay transfusión ni citrato: buscarías un calcio que no está bajo y no tratarías el fosfato.' }],
    expl: 'El fosfato <1 mg/dL es el nivel grave. Con K⁺ <4 se usa fosfato potásico; para 61-80 kg, 40 mmol (Tabla 38.5).', c: ['glu', 'p51'], aplica: 'fosfato' },
  { tit: 'Día 4 · tarde', enun: 'Tras la perfusión el Mg²⁺ sérico marca 1,7. La enfermera pregunta si para el magnesio. ¿Qué haces?',
    ops: [
      { t: 'Paro la perfusión: ya está normal.', porque: 'El valor del bolo cae a los 15 minutos; en unas horas vuelve a 1,3 y los depósitos siguen vacíos (tardan días).' },
      { t: 'Sigo con la perfusión continua: el valor sube con el bolo, pero los depósitos tardan días en llenarse.', ok: true },
      { t: 'Doblo la dosis para llenar antes el hueso.', porque: 'El 50 % se va por la orina de todos modos, y con riñón enfermo podrías acercarte a niveles que paran el corazón.' },
      { t: 'Mido el Mg²⁺ cada 15 minutos y reajusto.', porque: 'Medirías justo el pico que cae a los 15 min: te daría falsa seguridad.' }],
    expl: 'Mira la gráfica del plasma tras 2 horas: el pico se ha ido. El Mg sérico se normaliza antes que los depósitos.', c: ['mgrep', 'mgret'], aplica: 'espera' },
  { tit: 'Día 6 · ¿está lleno?', enun: 'Prueba de retención: 6 g de MgSO₄ en 1 h. En 24 h elimina 10 mmol de Mg por la orina (el 42 %). ¿Qué dice?',
    ops: [
      { t: 'Depósitos suficientes: dejo de reponer.', porque: 'Eliminar poco significa que el cuerpo se queda con lo infundido porque lo necesita; pararías con el déficit abierto.' },
      { t: 'Déficit persistente: ≤12 mmol (≤50 %) en 24 h; sigo reponiendo.', ok: true },
      { t: 'No sirve: siempre sale el 50 %.', porque: 'Perderías la única medida que señala el final de la reposición.' },
      { t: 'Hay que repetirla con 12 g.', porque: 'Estarías sobrecargando sin necesidad; la prueba ya dio su respuesta.' }],
    expl: '≤12 mmol (≤50 % de lo infundido) indica déficit; >19 mmol (>80 %) indica depósitos llenos. La prueba falla si el riñón está enfermo.', c: ['mgret'], aplica: 'ninguna' },
] };
