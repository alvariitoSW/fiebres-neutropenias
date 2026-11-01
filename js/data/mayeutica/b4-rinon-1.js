// Mayéutica del bloque 4, grupo B · El riñón que falla (1/2): fichas mr-fra-criterios, mr-fra-causas y mr-fra-indices
// de Marino cap. 34 «Acute Kidney Injury». La pinta js/core/mayeutica.js. Datos puros; formato: b1-fluidos.js.
//
// Toda la medicina sale de la ficha (js/modules/libros/marino-renal.html) y de su PDF
// (docs/marino-2024-acido-base-renal-caps31-34.pdf; cap. 34 = págs. 44-60: «A p. N» es la página del PDF).
// El paciente del caso (Matilde) se inventa; sus cifras de análisis son del caso y se marcan como ilustrativas.
// Cobertura y caso: autonomo/bloques/b4/cobertura-anexo.md §3 (4B) y §7.

const GLOM = { especialidad: 'libros', view: 'marinoRenal', panel: 'panel-marino-renal-tabs' };
const GLOM_PIA = { glomerulo: 'pam=75,pia=19', ...GLOM, tab: 'mr-fra-causas', texto: 'Compruébalo en el glomérulo (PIA)' };
const GLOM_CONGESTION = { glomerulo: 'congestion', ...GLOM, tab: 'mr-fra-causas', texto: 'Compruébalo en el glomérulo (congestión)' };
const GLOM_IND_PIA = { glomerulo: 'pam=70,pia=19', ...GLOM, tab: 'mr-fra-indices', texto: 'Compruébalo en el glomérulo (PIA)' };
const GLOM_IND_CONGESTION = { glomerulo: 'congestion', ...GLOM, tab: 'mr-fra-indices', texto: 'Compruébalo en el glomérulo (congestión)' };
const GLOM_CRITICO = { glomerulo: 'critico', ...GLOM, tab: 'mr-fra-criterios', texto: 'Compruébalo en el glomérulo (creatinina)' };

export const MAYEUTICA_RINON_1 = {
  /* =================================================================================================
     VII · Criterios y el problema de la creatinina (A p. 44-46)
     ================================================================================================= */
  'mr-fra-criterios': {
    entrada: 'Cuándo hay fracaso renal agudo, por qué la oliguria no siempre es lesión y por qué la creatinina engaña, sobre todo en el crítico.',
    guia: [
      { id: 'rin-cri-g1', corto: 'los criterios', tipo: 'test', fuente: 'mr-tabla-34-1',
        enunciado: 'Un paciente tenía una creatinina de 1,0 mg/dL y hoy, 36 h después, tiene 1,4. La diuresis es normal. ¿Tiene fracaso renal agudo según la Tabla 34.1?',
        opciones: [
          { t: 'No: tendría que haberse duplicado y la diuresis tendría que caer', porque: 'Pides más de lo que exige la tabla. Con ese listón, un fracaso renal con subida de 0,4 mg/dL pasaría sin diagnóstico, y en la UCI se llega tarde al riñón.' },
          { t: 'Sí: basta un criterio y +0,4 mg/dL en 48 h cumple el de ≥0,3 mg/dL', ok: true },
          { t: 'No: hace falta cumplir a la vez el criterio de creatinina y el de diuresis', porque: 'La tabla dice «uno de estos»: no hacen falta los tres ni dos. Esperar al segundo criterio retrasaría el diagnóstico de un riñón que ya falla.' }],
        explicacion: 'Tabla 34.1: el diagnóstico exige <span class="hl">uno</span> de estos: creatinina ≥0,3 mg/dL en 48 h, creatinina ≥1,5 veces la basal en los 7 días previos, o diuresis <0,5 mL/kg/h (peso ideal) durante 6 h. Aquí sube 0,4 en 36 h: cumple el primero (A p. 44).' },
      { id: 'rin-cri-g2', corto: 'la oliguria', tipo: 'destapa', fuente: 'mr-fra-limitaciones · mr-tabla-34-1',
        enunciado: 'Un paciente hipotenso lleva 7 h con 0,3 mL/kg/h. Cumple el tercer criterio. El adjunto te pregunta si eso es una «lesión» renal. Son tres cosas.',
        puntos: [
          'Cumple el criterio de <span class="hl">diuresis &lt;0,5 mL/kg/h durante 6 h</span>: sí hay diagnóstico por definición.',
          'Pero la oliguria puede ser una <span class="hl-azul">respuesta renal adecuada</span> a la menor perfusión, no una lesión.',
          'Además no hay acuerdo sobre la subida mínima de creatinina, y <span class="hl-rojo">la basal puede no conocerse</span>.'],
        explicacion: 'La ficha: «la oliguria puede ser una respuesta renal adecuada a la menor perfusión, no una lesión». Los criterios son una definición práctica, con límites que el autor señala (A p. 45).' },
      { id: 'rin-cri-g3', corto: 'de dónde sale', tipo: 'test', fuente: 'mr-creatinina-limites',
        enunciado: 'Antes de fiarte de la creatinina como marcador del filtrado: ¿de dónde viene y qué más, aparte de la filtración, decide su cifra?',
        opciones: [
          { t: 'Del hígado, a partir de los aminoácidos; solo depende de lo que filtra el glomérulo, sin ningún otro factor', porque: 'Viene de la creatina del músculo, y además del filtrado hay otras tres cosas que la mueven. Si la tomas por un reflejo puro del filtrado, te fiarás de una cifra que no lo es.' },
          { t: 'De la creatina muscular; depende de la masa muscular, el volumen plasmático y la secreción tubular', ok: true },
          { t: 'De la dieta proteica; se filtra entera y no se secreta en el túbulo', porque: 'La ficha dice lo contrario: no solo se filtra, también se secreta en los túbulos, y viene del músculo, no de la dieta.' }],
        explicacion: 'La creatinina <span class="hl">viene de la creatina del músculo</span>: depende de la masa muscular y de lo que este produce, de los cambios del volumen plasmático y de que <span class="hl-azul">no solo se filtra, también se secreta</span> (A p. 45).' },
      { id: 'rin-cri-g4', corto: 'en el crítico', tipo: 'destapa', fuente: 'mr-creatinina-critico · mar-img-34-1', modelo: GLOM_CRITICO,
        enunciado: 'En el crítico séptico, ¿por qué una fórmula de filtrado con la creatinina «sale mejor» de lo que está el riñón? Son tres cosas.',
        puntos: [
          'Pierde <span class="hl">alrededor del 2 % de la masa muscular al día</span>.',
          'En la sepsis <span class="hl-azul">se produce menos creatina</span>: baja la creatinina sin que mejore el riñón.',
          '<span class="hl-rojo">Sobrestima el filtrado</span> real, y eso afecta a valorar la función renal y a dosificar fármacos.'],
        explicacion: 'Las estimaciones basadas en la creatinina sobrestiman sistemáticamente el filtrado real en el crítico (A p. 45). Las fórmulas de la Figura 34.1 se toman como techo, no como dato.' },
      { id: 'rin-cri-g5', corto: 'el techo', tipo: 'test', fuente: 'mar-img-34-1 · mr-creatinina-critico',
        enunciado: 'Cockcroft-Gault da 62 mL/min en un paciente séptico de 80 años que ha estado dos semanas en cama. Vas a ajustar un antibiótico. ¿Cómo lees esos 62?',
        opciones: [
          { t: 'Como el filtrado real: ajusto la dosis del antibiótico a 62 mL/min y no lo corrijo por nada más', porque: 'En el crítico estas fórmulas sobrestiman el filtrado: dosificarías de más un fármaco que el riñón no está eliminando y podrías acumularlo.' },
          { t: 'Como un techo: el real puede ser menor y debo tenerlo en cuenta al dosificar', ok: true },
          { t: 'Como un suelo: el filtrado real será seguramente mayor que esos 62 mL/min', porque: 'Es al revés: la pérdida de músculo y la menor producción de creatina hacen que la fórmula se quede alta, no baja.' }],
        explicacion: 'La calculadora de la ficha lo dice: «en el crítico estas fórmulas sobrestiman el filtrado real: tómalas como techo, no como dato». Las estimaciones se usan para valorar la función renal y para dosificar fármacos (A p. 45-46).' },
    ],
    examen: [
      { id: 'rin-cri-e1', corto: 'la magnitud', tipo: 'test', fuente: 'mr-fra-intro · mar-img-34-1',
        enunciado: 'Según el capítulo, ¿qué proporción de los pacientes de UCI sufre un deterioro agudo de la función renal, y cuántos acaban necesitando terapia de reemplazo?',
        opciones: [
          { t: 'Hasta el 60 %; cerca del 15 % necesita terapia de reemplazo', ok: true },
          { t: 'Alrededor del 15 %; hasta el 60 % necesita terapia de reemplazo renal en la UCI', porque: 'Has cambiado las cifras: el 60 % es el que sufre el deterioro y el 15 % el que necesita diálisis. Subestimarías mucho la frecuencia del fracaso renal en tu UCI.' },
          { t: 'Hasta el 30 %; todos los que lo sufren acaban en terapia de reemplazo', porque: 'Ni la frecuencia ni la proporción son esas: solo una minoría de los que tienen fracaso renal llega a diálisis.' }],
        explicacion: 'Hasta el 60 % de los pacientes de UCI sufre un deterioro agudo de la función renal; un 15 % necesita terapia de reemplazo y hasta el 60 % no sobrevive (A p. 44).',
        nota: '<b>Nota de fidelidad.</b> El capítulo da un 15 % de terapia de reemplazo aquí y un 10-15 % de los pacientes de UCI al hablar de la terapia (A p. 55); las dos cifras se reproducen tal cual.' },
      { id: 'rin-cri-e2', corto: 'cumple o no', tipo: 'test', fuente: 'mr-tabla-34-1',
        enunciado: 'Una paciente con creatinina basal conocida de 1,0 mg/dL llega a 1,6 mg/dL a los 6 días. No se mide la diuresis. ¿Cumple criterio de fracaso renal agudo?',
        opciones: [
          { t: 'No: la subida en 48 h no llega a 0,3 mg/dL, y eso basta para descartarlo', porque: 'Solo miras el primer criterio. Hay otro, creatinina ≥1,5 veces la basal en 7 días, que sí cumple, y la dejarías sin diagnóstico.' },
          { t: 'No: sin la diuresis no se puede diagnosticar', porque: 'Basta con un criterio y los de creatinina no necesitan la diuresis; esperar a medirla retrasaría el diagnóstico.' },
          { t: 'Sí: 1,6 es 1,6 veces la basal dentro de los 7 días previos', ok: true }],
        explicacion: 'El segundo criterio de la Tabla 34.1 es una creatinina <span class="hl">≥1,5 veces la basal en los 7 días previos</span>: 1,6/1,0 = 1,6 (A p. 44).' },
      { id: 'rin-cri-e3', corto: 'la nota del R1', tipo: 'error', fuente: 'mr-tabla-34-1 · mr-creatinina-critico · mar-img-34-1',
        enunciado: 'Nota de un residente sobre un paciente séptico de UCI. Encuentra los errores (puede haber 0, 1 o 2).',
        frases: [
          { t: 'Creatinina de 0,8 a 1,2 mg/dL en 48 h: cumple el criterio de creatinina.' },
          { t: 'La diuresis ha sido de 0,4 mL/kg/h durante 3 h: lo cuento como tercer criterio.', mal: true,
            c: 'El criterio exige <span class="hl">diuresis &lt;0,5 mL/kg/h durante 6 h</span>, con el peso ideal; 3 h no lo cumplen.' },
          { t: 'Con Cockcroft-Gault le calculo 55 mL/min y lo tomo como el filtrado real para dosificar.', mal: true,
            c: 'En el crítico estas fórmulas <span class="hl-rojo">sobrestiman</span> el filtrado real: son un techo, no un dato.' },
          { t: 'Hay que recordar que en la sepsis se produce menos creatina.' }],
        explicacion: 'Dos confusiones reales: acortar el tiempo del criterio de diuresis y fiarse de una estimación con creatinina en el crítico (A p. 44-45).' },
    ],
    casos: [
      { id: 'rin-rub', titulo: 'Rubén, 74 años: la creatinina que engaña', corto: 'Caso · Rubén', sub: 'sepsis, dos semanas en cama',
        paciente: { Edad: '74 años', Motivo: 'Sepsis de origen urinario, dos semanas en UCI encamado', 'Creatinina basal': '1,0 mg/dL (ilustrativa, paciente inventado)' },
        lleva: [
          'Basta uno de los tres criterios de la Tabla 34.1: +0,3 mg/dL en 48 h ya es fracaso renal agudo.',
          'La creatinina depende del músculo, del volumen plasmático y de la secreción tubular, no solo del filtrado.',
          'En el crítico séptico, las fórmulas con creatinina son un techo y una creatinina que baja puede no ser un riñón que mejora.'],
        volver: { nombre: 'Criterios y creatinina', ancla: 'mr-tabla-34-1', modelo: GLOM_CRITICO },
        pasos: [
          { momento: 'Día 1 · creatinina', datos: { Creatinina: '1,0 → 1,3 mg/dL en 24 h' }, nuevo: ['Creatinina'],
            pregunta: { id: 'rin-rub-1', tipo: 'test', fuente: 'mr-tabla-34-1', origen: 'ficha · la cuenta, del caso',
              enunciado: 'Rubén pasa de 1,0 a 1,3 mg/dL en 24 h y orina con normalidad. ¿Cumple criterio de fracaso renal agudo?',
              opciones: [
                { t: 'No: 1,3 no llega a 1,5 veces la basal y la diuresis es normal', porque: 'Pides cumplir varios criterios a la vez. La tabla exige uno solo, y esperar a los demás retrasaría el diagnóstico de un riñón que ya falla.' },
                { t: 'Sí: sube 0,3 mg/dL en menos de 48 h, y con un criterio basta', ok: true },
                { t: 'No: hasta que no llegue a 2 mg/dL no se considera fracaso renal agudo', porque: 'En la Tabla 34.1 no hay un corte absoluto de 2 mg/dL; esperar a esa cifra te haría llegar tarde.' }],
              explicacion: 'Tabla 34.1: creatinina <span class="hl">≥0,3 mg/dL en 48 h</span>; 1,3 − 1,0 = 0,3 en 24 h cumple (A p. 44).' } },
          { momento: 'Día 1 · qué mide la creatinina', datos: { Músculo: 'dos semanas encamado' }, nuevo: ['Músculo'],
            pregunta: { id: 'rin-rub-2', tipo: 'destapa', fuente: 'mr-creatinina-limites · mr-creatinina-critico',
              enunciado: 'El adjunto dice: «con Rubén, no te fíes de la creatinina como espejo del filtrado». ¿Por qué? Son tres cosas.',
              puntos: [
                'Viene de la <span class="hl">creatina del músculo</span>: depende de la masa muscular, y Rubén la pierde en cama.',
                'Cambia con el <span class="hl-azul">volumen plasmático</span>, no solo con el filtrado.',
                'No solo se filtra: <span class="hl-rojo">también se secreta en los túbulos</span>.'],
              explicacion: 'La creatinina depende de la masa muscular, de los cambios del volumen plasmático y de la secreción tubular; en el crítico se pierde cerca del 2 % de la masa muscular al día (A p. 45).' } },
          { momento: 'Día 1 · la fórmula', datos: { 'Cockcroft-Gault': '58 mL/min' }, nuevo: ['Cockcroft-Gault'],
            calculadora: { ir: 'mr-creatinina-critico', nombre: 'Fórmulas de filtrado en el crítico' },
            pregunta: { id: 'rin-rub-3', tipo: 'test', fuente: 'mar-img-34-1 · mr-creatinina-critico', modelo: GLOM_CRITICO, origen: 'ficha · cifra del caso, ilustrativa',
              enunciado: 'Cockcroft-Gault da 58 mL/min en Rubén y vas a dosificar un fármaco que se elimina por el riñón. ¿Cómo lo usas?',
              opciones: [
                { t: 'Lo tomo como filtrado real y dosifico para 58 mL/min sin más ajustes', porque: 'En el crítico estas fórmulas sobrestiman el filtrado: darías más fármaco del que el riñón de Rubén elimina y podría acumularse.' },
                { t: 'Como un techo: el filtrado real puede ser menor y lo tengo en cuenta al dosificar', ok: true },
                { t: 'Como un suelo, porque con sepsis el filtrado real tiene que ser mayor', porque: 'Es al revés: la pérdida de músculo y la menor producción de creatina dejan la fórmula alta, y dosificarías de más.' }],
              explicacion: 'Las estimaciones con creatinina sobrestiman el filtrado real en el crítico: son un techo, no un dato (A p. 45-46).' } },
          { momento: 'Día 6 · «mejora»', datos: { Creatinina: '1,3 → 1,0 mg/dL', Diuresis: 'sigue baja' }, nuevo: ['Creatinina', 'Diuresis'],
            pregunta: { id: 'rin-rub-4', tipo: 'test', fuente: 'mr-creatinina-critico', origen: 'ficha · cifras del caso, ilustrativas',
              enunciado: 'A los 5 días la creatinina de Rubén baja a 1,0, pero la diuresis no mejora. ¿Cómo lo interpretas?',
              opciones: [
                { t: 'El riñón se recupera: la creatinina baja y eso basta para darlo por resuelto', porque: 'Con la diuresis aún baja, darlo por resuelto te haría relajar la vigilancia de un riñón que sigue fallando.' },
                { t: 'Puede ser menor producción de creatina por la sepsis y la pérdida de músculo, no recuperación', ok: true },
                { t: 'Un error del laboratorio: la creatinina nunca baja si el riñón no filtra mejor', porque: 'No hace falta suponer un error: la creatinina también depende de la producción muscular, y en la sepsis se produce menos creatina.' }],
              explicacion: 'En la sepsis <span class="hl-azul">se produce menos creatina</span> y baja la creatinina sin que el riñón mejore (A p. 45).' } },
          { momento: 'Día 6 · la nota', datos: { Plan: 'dar el alta de la vigilancia renal' }, nuevo: ['Plan'],
            pregunta: { id: 'rin-rub-5', tipo: 'error', fuente: 'mr-tabla-34-1 · mr-creatinina-critico',
              enunciado: 'El residente anota su plan para Rubén. Encuentra los errores (puede haber 0, 1 o 2).',
              frases: [
                { t: 'La creatinina subió 0,3 mg/dL en 24 h: cumple el criterio de creatinina.' },
                { t: 'La creatinina vuelve a 1,0: el riñón está recuperado y suspendo la vigilancia de la diuresis.', mal: true,
                  c: 'En la sepsis <span class="hl-rojo">se produce menos creatina</span> y se pierde músculo: la creatinina puede bajar sin que el riñón mejore.' },
                { t: 'Para dosificar uso Cockcroft-Gault de 58 mL/min como filtrado real.', mal: true,
                  c: 'En el crítico estas fórmulas <span class="hl-rojo">sobrestiman</span> el filtrado: son un techo.' },
                { t: 'Recuerdo que la creatinina también se secreta en el túbulo.' }],
              explicacion: 'Dos confusiones reales del crítico: dar por buena una creatinina que baja y tomar la fórmula como dato (A p. 45-46).' } },
        ] },
    ],
    profundizar: [
      { id: 'mr-fra-historia', titulo: 'De «insuficiencia renal aguda» a KDIGO' },
      { id: 'mr-cistatina', titulo: 'Cistatina C' },
      { id: 'mr-fra-nombres', titulo: 'Enfermedad renal aguda y crónica: otros nombres' },
    ],
  },

  /* =================================================================================================
     VIII · Causas: sepsis, congestión venosa, presión abdominal (A p. 46-50)
     ================================================================================================= */
  'mr-fra-causas': {
    entrada: 'Qué tres presiones mueven el filtrado, por qué la sepsis obstruye el túbulo y por qué la presión del abdomen pesa el doble que la arterial.',
    guia: [
      { id: 'rin-cau-g1', corto: 'tres presiones', tipo: 'test', fuente: 'mr-gradiente-filtracion · mar-img-34-2', modelo: GLOM_CONGESTION,
        enunciado: 'Antes de leer la ecuación: el filtrado glomerular depende de una resta de presiones. ¿Cuáles, y en qué sentido?',
        opciones: [
          { t: 'Solo de la presión arterial: si sube, filtra más', porque: 'Es solo una tercera parte. Si ignoras la venosa y la del túbulo, no entenderás por qué un paciente con buena PAM pero muy congestionado deja de filtrar.' },
          { t: '(PAM − presión venosa) − presión del túbulo proximal', ok: true },
          { t: 'Presión arterial media + presión venosa − presión del túbulo proximal', porque: 'La presión venosa resta, no suma: una venosa alta frena el filtrado. Si la sumaras, creerías que la congestión ayuda.' }],
        explicacion: 'Ecuación 34.1: gradiente = <span class="hl">(Pā − Pv) − PPT</span>. El filtrado baja si cae la presión arterial, pero también si <span class="hl-rojo">sube la venosa o la del túbulo proximal</span> (A p. 47).' },
      { id: 'rin-cau-g2', corto: 'la sepsis', tipo: 'destapa', fuente: 'mr-fra-sepsis · mar-img-34-3',
        enunciado: 'La sepsis es la primera causa de fracaso renal. ¿Cómo hace que baje el filtrado a través del túbulo? Son tres cosas.',
        puntos: [
          'Una lesión inflamatoria (oxidativa) del <span class="hl">endotelio glomerular y del epitelio tubular</span>.',
          'La necrosis tubular <span class="hl-azul">descama células a la luz</span> y la obstruye.',
          'Sube la <span class="hl-rojo">presión del túbulo proximal</span> y el gradiente neto baja.'],
        explicacion: 'La sepsis causa alrededor de la mitad de los fracasos renales de la UCI. Lo que obstruye el túbulo sube la PPT y por la Ecuación 34.1 baja el filtrado (A p. 47-48).',
        nota: '<b>Nota de interpretación.</b> En fisiología renal «retroalimentación tubuloglomerular» suele ser la señal de la mácula densa; aquí el capítulo usa el término para la obstrucción luminal (fisiología general; Marino lo usa así en A p. 47-48).' },
      { id: 'rin-cau-g3', corto: 'la congestión', tipo: 'test', fuente: 'mr-fra-cardiorrenal · mr-congestion', modelo: GLOM_CONGESTION,
        enunciado: 'En pacientes con insuficiencia cardíaca, catéter de arteria pulmonar y disfunción renal, ¿qué parámetro hemodinámico fue el único que se correlacionó con ella?',
        opciones: [
          { t: 'La presión venosa central (auricular derecha)', ok: true },
          { t: 'El gasto cardíaco, como en cualquier hipoperfusión', porque: 'Sería el razonamiento de «menos perfusión», pero el estudio vio que no se correlacionó: pensar solo en bajo gasto te haría pasar por alto la congestión.' },
          { t: 'La presión arterial media', porque: 'En esos pacientes la PAM no fue el parámetro que se asoció; mirar solo la PAM te dejaría tranquilo con un riñón congestionado.' }],
        explicacion: 'La presión auricular derecha fue el <span class="hl">único parámetro</span> que se correlacionó con la disfunción renal. Probablemente pesa más la perfusión en la insuficiencia cardíaca aguda y la congestión en la crónica descompensada (A p. 48).' },
      { id: 'rin-cau-g4', corto: 'cifras de PIA', tipo: 'test', fuente: 'mr-pia-definiciones',
        enunciado: 'Predice las tres cifras de presión intraabdominal (en decúbito supino): normal, hipertensión intraabdominal y síndrome compartimental. ¿Cuáles son?',
        opciones: [
          { t: 'Normal 10-15 mmHg; hipertensión intraabdominal >20; síndrome compartimental >30 mmHg', porque: 'Estás subiendo los cortes: con PIA de 12-15 ya hay hipertensión intraabdominal, y con >20 más disfunción orgánica es síndrome compartimental.' },
          { t: 'Normal 5-7; hipertensión ≥12; síndrome >20 con disfunción orgánica', ok: true },
          { t: 'Normal 0-5; hipertensión ≥8; síndrome >12 mmHg', porque: 'Bajas demasiado los cortes y confundirías una PIA normal con enfermedad.' }],
        explicacion: 'PIA normal <span class="hl-verde">5-7 mmHg</span>; hipertensión intraabdominal <span class="hl">≥12</span>; síndrome compartimental <span class="hl-rojo">>20 mmHg con FRA u otra disfunción orgánica aguda</span> (A p. 49).' },
      { id: 'rin-cau-g5', corto: 'el doble', tipo: 'destapa', fuente: 'mr-gradiente-pia · mr-ppa', modelo: GLOM_PIA,
        enunciado: 'Con la PIA alta, el gradiente es Pā − (PIA × 2). ¿Por qué la PIA pesa el doble y qué consecuencia tiene? Son tres cosas.',
        puntos: [
          'Cuando la PIA supera la presión venosa renal, el motor del flujo es <span class="hl">PPA = Pā − PIA</span>.',
          'Con la PIA alta, <span class="hl-azul">la presión del túbulo proximal se iguala a ella</span>: resta una vez como venosa y otra como PPT.',
          'Una subida de PIA pesa más que una bajada igual de presión arterial: <span class="hl-rojo">la oliguria es de los primeros signos</span>.'],
        explicacion: 'Ecuaciones 34.2 y 34.3 (A p. 50). Una PPA >60 mmHg se asocia a mejores resultados.' },
    ],
    examen: [
      { id: 'rin-cau-e1', corto: 'primera causa', tipo: 'test', fuente: 'mr-tabla-34-2 · mr-fra-sepsis',
        enunciado: 'En la Tabla 34.2, entre las causas inflamatorias del FRA, ¿cuál se señala como la primera causa y qué parte de los casos de la UCI explica?',
        opciones: [
          { t: 'La rabdomiólisis, alrededor de un tercio', porque: 'La rabdomiólisis es nefrotóxica y solo explica el 30 % del FRA del politraumatismo, no el de la UCI en general.' },
          { t: 'La cirugía mayor, más de la mitad', porque: 'La cirugía mayor figura entre las inflamatorias, pero la primera causa es la sepsis; el FRA tras cirugía depende del tipo (13 % abdominal, 18 % cardíaca).' },
          { t: 'La sepsis, alrededor de la mitad', ok: true }],
        explicacion: 'Tabla 34.2: «Sepsis (la primera causa de FRA)». Causa alrededor de la mitad de los FRA de la UCI (A p. 46-47).' },
      { id: 'rin-cau-e2', corto: 'medir la PIA', tipo: 'error', fuente: 'mr-pia-medida',
        enunciado: 'El R1 describe cómo medirá la presión intraabdominal. Encuentra los errores (puede haber 0, 1 o 2).',
        frases: [
          { t: 'La exploración física no detecta la hipertensión intraabdominal: la mido en la vejiga vaciada.' },
          { t: 'Con el paciente en supino y el transductor a cero en la línea medioaxilar.' },
          { t: 'Instilo 25 mL de salino y mido de inmediato, sin esperar.', mal: true,
            c: 'Se instilan 25 mL de salino en la vejiga <span class="hl">30-60 s antes</span> de medir.' },
          { t: 'Lo registro en cmH₂O y lo leo como mmHg sin convertir; 1 cmH₂O = 1,36 mmHg.', mal: true,
            c: 'Es al revés: <span class="hl">1 mmHg = 1,36 cmH₂O</span>. Medida en cmH₂O, se divide entre 1,36 para pasarla a mmHg.' }],
        explicacion: 'La medida vesical: supino, transductor a cero en la línea medioaxilar, 25 mL de salino 30-60 s antes, al final de la espiración y sin contracción abdominal (A p. 50).' },
      { id: 'rin-cau-e3', corto: 'balance positivo', tipo: 'test', fuente: 'mr-pia-cristaloides · mr-pia-causas',
        enunciado: 'Un paciente médico lleva un balance de +6 L en 24 h por cristaloides. ¿Qué te dice la serie citada en el capítulo?',
        opciones: [
          { t: 'Con >5 L en 24 h, 85 % tenía hipertensión intraabdominal y 25 % síndrome compartimental', ok: true },
          { t: 'Con balance >5 L solo el 5 % la tenía: los cristaloides rara vez la causan en la práctica', porque: 'Es lo contrario: los cristaloides son una causa frecuente y poco reconocida por el edema de las vísceras. Dejarías de medirla.' },
          { t: 'El 85 % tenía síndrome compartimental y el 25 % hipertensión intraabdominal', porque: 'Has cambiado las cifras: el 25 % tenía síndrome compartimental, no el 85 %. Pensarías que casi todos necesitan tratamiento de urgencia.' }],
        explicacion: 'Edema de las vísceras por cristaloides: con un balance positivo >5 L en 24 h, el 85 % tenía hipertensión intraabdominal y el 25 % síndrome compartimental (A p. 50).' },
      { id: 'rin-cau-e4', corto: 'PPA y síndrome', tipo: 'test', fuente: 'mr-ppa · mr-pia-definiciones', origen: 'ficha · la cuenta, ilustrativa',
        enunciado: 'PAM 80 mmHg, PIA vesical 25 mmHg y oliguria. ¿Cuál es la presión de perfusión abdominal y cómo lo clasificas?',
        opciones: [
          { t: 'PPA 105 mmHg; hipertensión intraabdominal, aún sin disfunción', porque: 'Has sumado en vez de restar. PPA = Pā − PIA, y con 25 mmHg y oliguria es ya síndrome compartimental.' },
          { t: 'PPA 55 mmHg, por debajo de 60; síndrome compartimental', ok: true },
          { t: 'PPA 55 mmHg; solo hipertensión intraabdominal', porque: 'PIA >20 con FRA u otra disfunción orgánica aguda ya es síndrome compartimental; clasificarlo como hipertensión te haría subestimar el riesgo.' }],
        explicacion: 'PPA = 80 − 25 = <span class="hl">55 mmHg</span> (<60: peor pronóstico). PIA >20 con disfunción orgánica = <span class="hl-rojo">síndrome compartimental</span> (A p. 50).' },
    ],
    casos: [
      { id: 'rin-alv', titulo: 'Álvaro, 61 años: las presiones del riñón', corto: 'Caso · Álvaro', sub: 'sepsis abdominal con +6 L',
        paciente: { Edad: '61 años', Motivo: 'Sepsis de origen abdominal, oliguria', Balance: '+6 L en 24 h por cristaloides (ilustrativo, paciente inventado)' },
        lleva: [
          'El filtrado depende de (Pā − Pv) − PPT: la presión venosa y la del túbulo restan.',
          'La sepsis obstruye el túbulo con células descamadas y sube la presión del túbulo proximal.',
          'Con la PIA alta el gradiente es Pā − (PIA × 2): pesa el doble que la presión arterial.'],
        volver: { nombre: 'Las presiones del filtrado', ancla: 'mr-gradiente-filtracion', modelo: GLOM_PIA },
        pasos: [
          { momento: 'Hora 0 · hemodinámica', datos: { PAM: '75 mmHg', PVC: '14 mmHg' }, nuevo: ['PAM', 'PVC'],
            pregunta: { id: 'rin-alv-1', tipo: 'test', fuente: 'mr-gradiente-filtracion · mar-img-34-2', modelo: GLOM_CONGESTION, origen: 'ficha · la cuenta, del caso',
              enunciado: 'Con PAM 75 y PVC 14, ¿cuánto queda de gradiente antes de restar la presión del túbulo proximal?',
              opciones: [
                { t: '89 mmHg: la presión venosa se suma a la arterial', porque: 'La presión venosa resta, no suma. Con esa cuenta creerías que la congestión ayuda a filtrar.' },
                { t: '61 mmHg: la presión venosa resta a la arterial media', ok: true },
                { t: '75 mmHg: la venosa no cuenta mientras la PAM sea normal', porque: 'La venosa entra en la ecuación aunque la PAM sea buena; ignorarla te dejaría sin explicar una oliguria con PAM normal.' }],
              explicacion: 'Ecuación 34.1: <span class="hl">(Pā − Pv) − PPT</span> = (75 − 14) − PPT = 61 − PPT (A p. 47).' } },
          { momento: 'Hora 0 · la sepsis', datos: { Foco: 'abdominal' }, nuevo: ['Foco'],
            pregunta: { id: 'rin-alv-2', tipo: 'destapa', fuente: 'mr-fra-sepsis · mar-img-34-3',
              enunciado: '¿Por qué la sepsis de Álvaro baja el filtrado aunque la PAM sea aceptable? Son tres cosas.',
              puntos: [
                'Lesión inflamatoria del <span class="hl">endotelio glomerular y del epitelio tubular</span>.',
                'La necrosis tubular <span class="hl-azul">descama células a la luz</span> y la obstruye.',
                'Sube la <span class="hl-rojo">presión del túbulo proximal</span> y el gradiente neto baja.'],
              explicacion: 'La sepsis causa alrededor de la mitad de los fracasos renales de la UCI; lo que obstruye el túbulo sube la PPT (A p. 47-48).' } },
          { momento: 'Hora 6 · la vejiga', datos: { 'PIA (vejiga)': '24 cmH₂O' }, nuevo: ['PIA (vejiga)'],
            pregunta: { id: 'rin-alv-3', tipo: 'test', fuente: 'mr-pia-definiciones · mr-pia-medida', origen: 'ficha · la cuenta, ilustrativa',
              enunciado: 'La PIA vesical de Álvaro es 24 cmH₂O. ¿Cuántos mmHg son y cómo se clasifica?',
              opciones: [
                { t: '33 mmHg (24 × 1,36); síndrome compartimental seguro', porque: 'Se divide, no se multiplica: 1 mmHg = 1,36 cmH₂O. Con 33 lo tratarías como una urgencia que no es.' },
                { t: 'Unos 18 mmHg (24/1,36): hipertensión intraabdominal, por encima de 12', ok: true },
                { t: 'Unos 18 mmHg: normal, porque la normal llega a 20 mmHg', porque: 'Lo normal es 5-7 mmHg; con 18 ya hay hipertensión intraabdominal y la dejarías sin vigilar.' }],
              explicacion: '24/1,36 ≈ <span class="hl">18 mmHg</span>: ≥12 es hipertensión intraabdominal; el síndrome compartimental pide >20 con disfunción orgánica (A p. 49-50).' } },
          { momento: 'Hora 6 · el gradiente', datos: { PIA: '18 mmHg', PAM: '75 mmHg' }, nuevo: ['PIA'],
            calculadora: { ir: 'mr-pia-calc', nombre: 'Presión de perfusión abdominal y gradiente' },
            pregunta: { id: 'rin-alv-4', tipo: 'test', fuente: 'mr-gradiente-pia · mr-ppa', modelo: GLOM_PIA, origen: 'ficha · la cuenta, del caso',
              enunciado: 'Con PAM 75 y PIA 18, ¿cuánto es la PPA y cuánto el gradiente de filtración con la PIA alta?',
              opciones: [
                { t: 'PPA 57 (por debajo de 60); gradiente 39 = 75 − (18 × 2)', ok: true },
                { t: 'PPA 93; gradiente 57, restando la PIA una sola vez', porque: 'La PPA se resta, no se suma, y el gradiente descuenta la PIA dos veces; con esa cuenta no verías la oliguria.' },
                { t: 'PPA 57; gradiente 57, porque la PIA solo resta en la PPA', porque: 'La PIA iguala la presión del túbulo y resta una segunda vez: el gradiente es 39, no 57.' }],
              explicacion: 'PPA = 75 − 18 = <span class="hl">57</span>; gradiente = Pā − (PIA × 2) = 75 − 36 = <span class="hl-rojo">39</span> (Ecuaciones 34.2 y 34.3, A p. 50).' } },
          { momento: 'Hora 6 · el plan', datos: { Plan: 'más líquido y esperar' }, nuevo: ['Plan'],
            pregunta: { id: 'rin-alv-5', tipo: 'error', fuente: 'mr-pia-cristaloides · mr-pia-definiciones · mr-gradiente-filtracion',
              enunciado: 'El residente anota el plan de Álvaro. Encuentra los errores (puede haber 0, 1 o 2).',
              frases: [
                { t: 'Mido la PIA en la vejiga, supino, con 25 mL de salino 30-60 s antes.' },
                { t: 'Con 18 mmHg ya hay síndrome compartimental.', mal: true,
                  c: 'El síndrome compartimental pide <span class="hl-rojo">PIA >20</span> con disfunción orgánica; 18 es hipertensión intraabdominal.' },
                { t: 'La presión venosa de 14 no cuenta: el gradiente solo depende de la PAM y del túbulo.', mal: true,
                  c: 'La presión venosa <span class="hl-rojo">resta</span> del gradiente: (Pā − Pv) − PPT.' },
                { t: 'Con +6 L de cristaloide, el edema de las vísceras puede estar subiendo la PIA.' }],
              explicacion: 'Dos confusiones reales: pasarse de grado con la PIA y olvidar la presión venosa (A p. 47-50).' } },
        ] },
    ],
    profundizar: [
      { id: 'mr-fra-cirugia', titulo: 'FRA tras cirugía y trauma (porcentajes)' },
      { id: 'mr-fra-hepatorrenal', titulo: 'Síndrome hepatorrenal' },
    ],
  },

  /* =================================================================================================
     X · Índices urinarios y manejo general (A p. 52-54) + caso Matilde
     ================================================================================================= */
  'mr-fra-indices': {
    entrada: 'Para qué sirven los índices urinarios, cuándo engañan, por qué la urea no la altera el diurético y qué hacer (y no hacer) en el manejo general.',
    guia: [
      { id: 'rin-ind-g1', corto: 'para qué', tipo: 'test', fuente: 'mr-fra-indices · mr-fra-eco',
        enunciado: 'Antes de pedir índices urinarios: ¿qué distinguen, y qué mirarías primero a pie de cama?',
        opciones: [
          { t: 'Hipoperfusión frente a lesión tubular; la ecografía, para obstrucción y riñones pequeños', ok: true },
          { t: 'Causa prerrenal frente a posrenal; la ecografía a pie de cama no aporta nada en estos casos', porque: 'Los índices separan hipoperfusión de lesión tubular, no la obstrucción, y la ecografía sí la descubre (hidronefrosis), que a veces necesita drenaje urgente.' },
          { t: 'Aguda frente a crónica; la ecografía, solo si hay oliguria', porque: 'Eso lo orienta el tamaño de los riñones en la ecografía, no los índices. Y la ecografía vale en cualquier FRA.' }],
        explicacion: 'Los índices ayudan a distinguir la hipoperfusión renal de la lesión tubular, pero todos tienen limitaciones. La ecografía a pie de cama descubre una ERC (riñones pequeños) y una obstrucción posrenal (hidronefrosis) (A p. 52-53).' },
      { id: 'rin-ind-g2', corto: 'Na urinario', tipo: 'test', fuente: 'mr-na-orina · mr-efna · mr-tabla-34-4', modelo: { nefronaViva: 'prerrenal' },
        enunciado: 'Un riñón mal perfundido, pero con túbulos sanos, ¿qué hace con el sodio, y qué Na⁺ en orina cabe esperar?',
        opciones: [
          { t: 'Lo ahorra: Na⁺ en orina <20 mEq/L y EFNa <1 %', ok: true },
          { t: 'Lo pierde: Na⁺ en orina >40 mEq/L', porque: 'Eso es lo que hace el túbulo lesionado, que ya no reabsorbe. Si lo confundes, tratarías como necrosis lo que es hipoperfusión y se podría haber revertido con volumen.' },
          { t: 'Lo retiene hasta una osmolalidad urinaria de 300-400 mOsm/kg', porque: 'La osmolalidad de 300-400 es la de la lesión tubular (orina isostenúrica); en la hipoperfusión la orina se concentra, >500.' }],
        explicacion: 'La hipoperfusión ahorra sodio (Na⁺ urinario <20); la lesión tubular lo pierde (>40). EFNa: normal ≈1 %, <1 % con hipoperfusión, >2 % con lesión tubular (A p. 53-54).' },
      { id: 'rin-ind-g3', corto: 'cuándo engaña', tipo: 'destapa', fuente: 'mr-efna · mr-na-orina',
        enunciado: 'Un paciente séptico con furosemida da una EFNa de 0,8 %. ¿Cuándo no te puedes fiar de la EFNa, y en qué sentido miente? Son tres cosas.',
        puntos: [
          'Con <span class="hl">diuréticos o ERC</span> sube (>1 %) aunque haya hipoperfusión.',
          'En la <span class="hl-rojo">lesión tubular de la sepsis</span> puede estar falsamente baja (<1 %).',
          'También puede estar falsamente baja con <span class="hl-rojo">mioglobinuria</span>.'],
        explicacion: 'Excepciones de la EFNa: se eleva por diuréticos y por insuficiencia renal crónica; puede ser falsamente baja en la lesión tubular de la sepsis o de la mioglobinuria (A p. 54).' },
      { id: 'rin-ind-g4', corto: 'la urea', tipo: 'destapa', fuente: 'mr-efu', modelo: { nefronaViva: 'prerrenal|furosemida' },
        enunciado: 'Si el paciente toma furosemida, ¿por qué te quedas con la excreción fraccional de urea y qué cortes usas? Son tres cosas.',
        puntos: [
          'Su gran ventaja: <span class="hl">no la alteran los diuréticos</span>.',
          '<span class="hl-verde">&lt;35 %</span> apunta a hipoperfusión.',
          '<span class="hl-rojo">&gt;50 %</span> apunta a lesión tubular.'],
        explicacion: 'EFU (%) = (U/P urea)/(U/P Cr), Ecuación 34.5 (A p. 54). Es la ventaja principal frente a la EFNa.' },
      { id: 'rin-ind-g5', corto: 'el manejo', tipo: 'test', fuente: 'mr-reto-volumen · mr-furosemida-fra · mr-dopamina-baja',
        enunciado: 'Tienes un FRA al inicio en el que no puedes descartar la hipoperfusión. ¿Qué haces primero, y qué no haces?',
        opciones: [
          { t: 'Reto de 500 mL en 10-15 min; sin furosemida para subir la diuresis ni dopamina a 2 μg/kg/min', ok: true },
          { t: 'Furosemida en bolo para subir la diuresis y dopamina a 2 μg/kg/min para dilatar la arteria renal', porque: 'La furosemida nunca debe darse para subir la diuresis si la hipoperfusión contribuye, y la dopamina a dosis baja no mejora la función renal y quita flujo esplácnico.' },
          { t: 'Esperar a los índices urinarios y no dar líquidos hasta tener la EFNa', porque: 'El reto de volumen suele ser lo primero justamente porque al principio no se puede descartar la hipoperfusión; esperar retrasa corregir lo que se corrige.' }],
        explicacion: 'Reto de volumen: 500 mL de cristaloide en 10-15 minutos (importa más el ritmo que el volumen), valorado con el volumen sistólico; se para si no responden ni este ni la diuresis. La furosemida solo sirve para manejar el volumen; la dopamina a 2 μg/kg/min hoy se considera «mala medicina» (A p. 54-55).' },
    ],
    examen: [
      { id: 'rin-ind-e1', corto: 'Tabla 34.4', tipo: 'test', fuente: 'mr-tabla-34-4',
        enunciado: 'Según la Tabla 34.4, ¿qué combinación de osmolalidad urinaria y cociente orina/plasma corresponde a la lesión tubular?',
        opciones: [
          { t: '>500 mOsm/kg y cociente >1,5 en la orina', porque: 'Es el perfil de la hipoperfusión: el riñón sano concentra la orina. Si lo atribuyes a lesión tubular, pasarías de largo un riñón que aún responde al volumen.' },
          { t: '300-400 mOsm/kg y cociente 1-1,3', ok: true },
          { t: '<100 mOsm/kg y cociente <0,5', porque: 'Esos valores no vienen en la tabla; una orina tan diluida orientaría a otra cosa, p. ej. diabetes insípida, no a una necrosis tubular.' }],
        explicacion: 'Hipoperfusión: osmolalidad urinaria >500 y cociente orina/plasma >1,5. Lesión tubular: <span class="hl">300-400 mOsm/kg y cociente 1-1,3</span>, una orina que ya no se concentra (A p. 53).' },
      { id: 'rin-ind-e2', corto: 'la errata', tipo: 'test', fuente: 'mr-tabla-34-4 · mr-efna',
        enunciado: 'La Tabla 34.4 imprime una EFNa en la lesión tubular distinta de la que da el texto. ¿Cuál usa la calculadora de la ficha y por qué?',
        opciones: [
          { t: '>12 %, la de la tabla, porque una tabla manda sobre el texto del propio libro', porque: 'No se elige ganadora por la forma. El propio libro dice «típicamente >2 %» en el texto; con 12 % casi ninguna lesión tubular sería diagnosticada.' },
          { t: '>2 %, la del texto: la tabla casi con seguridad tiene una errata', ok: true },
          { t: '>1 %, porque es la de los diuréticos', porque: '>1 % es lo que sube con diuréticos o ERC, no el corte de la lesión tubular.' }],
        explicacion: 'EFNa: <span class="hl">&lt;1 % con hipoperfusión, &gt;2 % con lesión tubular</span> (texto). La tabla imprime «&gt;12 %» (A p. 53-54).',
        nota: '<b>Errata de la fuente.</b> La tabla dice «&gt;12 %» y el texto «típicamente &gt;2 %»; la ficha reproduce las dos cosas y la calculadora usa el texto.' },
      { id: 'rin-ind-e3', corto: 'el plan', tipo: 'error', fuente: 'mr-reto-volumen · mr-furosemida-fra · mr-dopamina-baja',
        enunciado: 'Plan del residente de guardia para un FRA oligúrico. Encuentra los errores (puede haber 0, 1 o 2).',
        frases: [
          { t: 'Empiezo con 500 mL de cristaloide en 10-15 minutos y valoro el volumen sistólico.' },
          { t: 'Si no responden ni el volumen sistólico ni la diuresis, paro el reto.' },
          { t: 'Añado furosemida para subir la diuresis, aunque la perfusión sea escasa.', mal: true,
            c: 'La furosemida <span class="hl-rojo">nunca</span> para subir la diuresis si la hipoperfusión contribuye; no mejora la función renal, solo sirve para manejar el volumen.' },
          { t: 'Pongo dopamina a 2 μg/kg/min para proteger el riñón.', mal: true,
            c: 'Dilata la arteria renal pero <span class="hl-rojo">no mejora la función renal</span> y baja el flujo esplácnico: «mala medicina».' }],
        explicacion: 'Dos prácticas que se mantienen por inercia y que el capítulo desaconseja (A p. 54).' },
      { id: 'rin-ind-e4', corto: 'con furosemida', tipo: 'test', fuente: 'mr-efu · mr-efna', origen: 'ficha · la cuenta, ilustrativa',
        enunciado: 'Paciente con furosemida: EFNa 2,3 % y EFU 25 %. ¿Qué orientación te da cada índice?',
        opciones: [
          { t: 'Ambos indican lesión tubular, porque la EFNa es mayor del 2 % y eso basta', porque: 'Solo la EFNa lo parece, y está elevada por el diurético. La EFU <35 % apunta a hipoperfusión: dar por necrosis lo que es hipoperfusión quita al paciente un volumen que le haría falta.' },
          { t: 'La EFNa no vale con diurético; la EFU <35 % orienta a hipoperfusión', ok: true },
          { t: 'Ambos indican hipoperfusión porque la EFU es menor del 35 %', porque: 'La EFNa >2 % no orienta a hipoperfusión, pero con diuréticos tampoco es interpretable.' }],
        explicacion: 'La EFNa sube con diuréticos; la EFU no la altera el diurético y <35 % apunta a hipoperfusión (A p. 54).' },
    ],
    casos: [
      { id: 'rin-mat', titulo: 'Matilde, 69 años: el riñón que no se llena', corto: 'Caso · Matilde', sub: 'insuficiencia cardíaca con ascitis y +6 L',
        paciente: { Edad: '69 años', Motivo: 'Insuficiencia cardíaca descompensada con ascitis', Balance: '+6 L en 48 h', Fármacos: 'furosemida IV' },
        lleva: [
          'Con furosemida, la EFNa no vale; la excreción fraccional de urea, sí.',
          'Una presión venosa alta y una PIA alta bajan el filtrado: la congestión, no la hipovolemia, manda.',
          'No se da un reto de 500 mL por una EFNa >1 % con diurético (interpretación a partir de A p. 48, 50 y 54; Marino no trata este caso).'],
        volver: { nombre: 'Índices urinarios', ancla: 'mr-fra-indices', modelo: GLOM_IND_CONGESTION },
        pasos: [
          { momento: 'Día 2 · creatinina', datos: { Creatinina: '0,9 → 1,5 mg/dL en 36 h' }, nuevo: ['Creatinina'],
            calculadora: { ir: 'mr-kdigo-calc', nombre: '¿Cumple algún criterio de la Tabla 34.1?' },
            pregunta: { id: 'rin-mat-1', tipo: 'test', fuente: 'mr-tabla-34-1', origen: 'ficha · la cuenta, del caso',
              enunciado: 'Matilde pasa de 0,9 a 1,5 mg/dL en 36 h. ¿Cumple criterio de FRA, y por cuál?',
              opciones: [
                { t: 'No: la creatinina todavía no ha llegado a 2 mg/dL, que es el corte de fracaso renal', porque: 'No existe ese corte absoluto en la tabla. Esperarías a un número que no importa y retrasarías buscar la causa.' },
                { t: 'Sí: sube 0,6 en 48 h (≥0,3) y 1,5/0,9 = 1,7 veces la basal (≥1,5)', ok: true },
                { t: 'Solo si la diuresis cae por debajo de 0,5 mL/kg/h', porque: 'Basta uno de los tres criterios; con la creatinina ya está cumplido.' }],
              explicacion: 'Cumple dos criterios de la Tabla 34.1: ≥0,3 mg/dL en 48 h y ≥1,5 veces la basal en 7 días (A p. 44).' } },
          { momento: 'Día 2 · hemodinámica', datos: { PVC: '18 mmHg', PAM: '70 mmHg' }, nuevo: ['PVC', 'PAM'],
            pregunta: { id: 'rin-mat-2', tipo: 'test', fuente: 'mr-gradiente-filtracion · mr-congestion', modelo: GLOM_IND_CONGESTION, origen: 'ficha · la cuenta, ilustrativa',
              enunciado: 'PAM 70 mmHg no es una hipotensión. ¿Qué te dice la PVC de 18 sobre el gradiente de filtración?',
              opciones: [
                { t: 'Nada: con una PAM de 70 el riñón está bien perfundido y solo importa la presión arterial', porque: 'El filtrado depende de (Pā − Pv) − PPT: con una venosa de 18 mmHg el gradiente se queda en 52 antes de restar el túbulo, y no verías la causa del fracaso renal.' },
                { t: 'Que la presión venosa resta: 70 − 18 = 52 mmHg, antes de restar la del túbulo', ok: true },
                { t: 'Que la PVC alta mejora el filtrado porque llena el glomérulo', porque: 'La presión venosa resta del gradiente. Pensar que ayuda te llevaría a seguir añadiendo líquido a una paciente ya congestionada.' }],
              explicacion: 'Ecuación 34.1: <span class="hl">(Pā − Pv) − PPT</span>. La presión venosa central alta baja el filtrado (A p. 47-48).' } },
          { momento: 'Día 2 · la vejiga', datos: { 'PIA (vejiga)': '26 cmH₂O = 19 mmHg' }, nuevo: ['PIA (vejiga)'],
            pregunta: { id: 'rin-mat-3', tipo: 'test', fuente: 'mr-pia-medida', origen: 'ficha · la cuenta, ilustrativa',
              enunciado: 'La enfermera mide la PIA con la técnica de la ficha y anota 26 cmH₂O. ¿Qué hizo bien y a cuántos mmHg equivale?',
              opciones: [
                { t: '25 mL de salino 30-60 s antes, supina, medioaxilar, fin de espiración; 26/1,36 = 19 mmHg', ok: true },
                { t: 'Medir sentada con 100 mL en la vejiga y al principio de la inspiración; 26 × 1,36 = 35 mmHg', porque: 'Es en supino, con 25 mL, y 1 mmHg = 1,36 cmH₂O: se divide, no se multiplica. Con 35 la llamarías síndrome compartimental sin serlo.' },
                { t: 'La exploración abdominal basta; 26 cmH₂O es lo mismo que 26 mmHg', porque: 'La exploración física no detecta la hipertensión intraabdominal, y 26 mmHg sería otro grado de gravedad.' }],
              explicacion: 'Supino, transductor a cero en la línea medioaxilar, 25 mL de salino 30-60 s antes, al final de la espiración. 1 mmHg = 1,36 cmH₂O: 26 cmH₂O = <span class="hl">19 mmHg</span> (A p. 50).' } },
          { momento: 'Día 2 · clasificar', datos: { PIA: '19 mmHg', PPA: '51 mmHg', Gradiente: '32 mmHg' }, nuevo: ['PIA', 'PPA', 'Gradiente'],
            calculadora: { ir: 'mr-pia-calc', nombre: 'Presión de perfusión abdominal y gradiente' },
            pregunta: { id: 'rin-mat-4', tipo: 'test', fuente: 'mr-ppa · mr-gradiente-pia · mr-pia-definiciones', modelo: GLOM_IND_PIA, origen: 'ficha · la cuenta, del caso',
              enunciado: 'Con PAM 70 y PIA 19: ¿cuánto es la PPA, cuánto el gradiente de filtración con la PIA alta y cómo la clasificas?',
              opciones: [
                { t: 'PPA 51; gradiente 32; hipertensión intraabdominal, no síndrome compartimental', ok: true },
                { t: 'PPA 89; gradiente 51; normal', porque: 'Has sumado en vez de restar y has dejado de multiplicar por dos la PIA. 19 mmHg está muy por encima de lo normal (5-7).' },
                { t: 'PPA 51; gradiente 51 (PIA restada una sola vez); síndrome compartimental con oliguria', porque: 'El gradiente descuenta la PIA dos veces: 70 − 38 = 32. Y para el síndrome hace falta PIA >20.' }],
              explicacion: 'PPA = 70 − 19 = <span class="hl">51</span> (por debajo de 60). Gradiente = Pā − (PIA × 2) = 70 − 38 = <span class="hl-rojo">32</span> (Ecuaciones 34.2 y 34.3, A p. 50). 19 está en la zona de hipertensión intraabdominal (A p. 49).' } },
          { momento: 'Día 2 · orina', datos: { 'Na⁺ orina / plasma': '113 / 135 mEq/L', 'Creatinina orina / plasma': '60 / 1,5 mg/dL', 'Urea (BUN) orina / plasma': '448 / 40 mg/dL', EFNa: '2,1 %', EFU: '28 %' }, nuevo: ['Na⁺ orina / plasma', 'Creatinina orina / plasma', 'Urea (BUN) orina / plasma', 'EFNa', 'EFU'],
            calculadora: { ir: 'mr-indices-calc', nombre: 'EFNa y EFU' },
            pregunta: { id: 'rin-mat-5', tipo: 'test', fuente: 'mr-efna · mr-efu · mr-tabla-34-4', modelo: { nefronaViva: 'prerrenal|furosemida' }, origen: 'ficha · las cuentas, ilustrativas del caso',
              enunciado: 'Con furosemida, la muestra da EFNa 2,1 % y EFU 28 %. ¿Cómo lees cada una?',
              opciones: [
                { t: 'EFNa >2 % ⇒ lesión tubular, y la EFU no se tiene en cuenta con furosemida', porque: 'La EFNa está elevada por el diurético y no vale; la EFU sí vale con diurético.' },
                { t: 'Las dos indican hipoperfusión', porque: 'La EFNa >2 % no orienta a hipoperfusión en ningún caso; con diuréticos, simplemente no es interpretable.' },
                { t: 'EFNa no interpretable con diurético; EFU <35 % orienta a hipoperfusión', ok: true }],
              explicacion: 'EFNa = (113/135)/(60/1,5) ≈ 2,1 %; EFU = (448/40)/(60/1,5) = 28 %. La EFNa sube con diuréticos; la EFU no la altera el diurético y <35 % apunta a hipoperfusión (A p. 54).' } },
          { momento: 'Día 2 · el plan del R1', datos: { Plan: 'reto de volumen' }, nuevo: ['Plan'],
            pregunta: { id: 'rin-mat-6', tipo: 'error', fuente: 'mr-efna · mr-pia-definiciones · mr-pia-cristaloides',
              enunciado: 'El residente de guardia anota su plan. Encuentra los errores (puede haber 0, 1 o 2).',
              frases: [
                { t: 'La EFNa es 2,1 % con furosemida: el sodio de la orina no es interpretable.' },
                { t: 'La EFNa es >1 %, así que debe estar seca: pongo un reto de 500 mL de cristaloide.', mal: true,
                  c: 'La EFNa >1 % <span class="hl-rojo">sube con diuréticos</span> y no indica nada aquí; con balance +6 L y PIA 19, más cristaloide empeora el edema de las vísceras y la PIA.' },
                { t: 'La PIA de 19 mmHg es normal en una ascítica.', mal: true,
                  c: 'La PIA normal es <span class="hl-verde">5-7 mmHg</span>; ≥12 ya es hipertensión intraabdominal.' },
                { t: 'Reviso la presión de perfusión abdominal con la PAM y la PIA.' }],
              explicacion: 'Dos confusiones reales: leer la EFNa con furosemida y dar por normal una PIA que no lo es (A p. 49-50, 54).' } },
          { momento: 'Día 3 · el giro', datos: { Balance: '+6 L en 48 h, ascitis tensa' }, nuevo: ['Balance'],
            pregunta: { id: 'rin-mat-7', tipo: 'destapa', fuente: 'mr-congestion · mr-pia-cristaloides · mr-gradiente-pia', modelo: GLOM_IND_CONGESTION,
              enunciado: 'La residente de 4º te pregunta: «¿por qué no ponemos líquido a Matilde si la EFU dice hipoperfusión?». Son tres cosas.',
              puntos: [
                'La PVC de 18 y la PIA de 19 <span class="hl-rojo">restan del gradiente de filtración</span>: el obstáculo es venoso y abdominal.',
                'Matilde lleva <span class="hl">+6 L en 48 h</span> y una PIA de 19: más cristaloide empeora el edema de las vísceras y la presión abdominal (la ficha cita el 85 % de hipertensión intraabdominal con balances >5 L en 24 h, pero en otra serie, no en pacientes como ella).',
                'Marino da el reto de volumen como primera intervención cuando no se puede descartar la hipoperfusión, y <span class="hl-azul">se para si no responden ni el volumen sistólico ni la diuresis</span>: aquí la congestión es evidente y no hay duda que resolver.'],
              explicacion: 'En esta paciente la congestión manda (Figura 34.2); probablemente pesa más en la insuficiencia cardíaca crónica descompensada (A p. 48). <b>Interpretación</b> a partir de A p. 48, 50 y 54; Marino no trata este caso.' } },
        ] },
    ],
    profundizar: [
      { id: 'mr-fra-eco', titulo: 'Ecografía a pie de cama y biomarcadores' },
    ],
  },
};
