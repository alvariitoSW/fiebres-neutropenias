// Mayéutica del bloque 5, grupo 5A · El hígado, parte 1 (Marino cap. 39): fallo hepático agudo (ma-fallo-hepatico-agudo,
// con el caso de Casimira) y encefalopatía hepática (ma-encefalopatia-hepatica). La pinta js/core/mayeutica.js.
// Formato: el de b1-fluidos.js. Datos puros. Toda la medicina sale de las fichas (js/modules/libros/marino-abdomen.html)
// y de su PDF (docs/marino-2024-abdomen-temperatura-caps39-44.pdf, cap. 39 = págs. 2-13). Los pacientes son inventados.
// Modelos: hepatocitoVivo (presets casimira y edema; js/data/hepatocito-vivo-data.js), nefronaViva 'prerrenal' y
// shockVivo 'septico'. No se da la dosis de la N-acetilcisteína: el cap. 39 la remite al cap. 52.

const PDF = 'docs/marino-2024-abdomen-temperatura-caps39-44.pdf';
const pag = (n, txt) => `<a class="biblio-link" href="${PDF}#page=${n}" target="_blank" rel="noopener">${txt || `PDF pág. ${n}`}</a>`;
const enFicha = (tab, id) => ` <button type="button" class="may-ir" data-especialidad="libros" data-view="marinoAbdomen" data-panel="panel-marino-abd-tabs" data-tab="${tab}" data-resaltar="#${id}">Ver en la ficha ↗</button>`;
const hv = (clave, texto) => ({ hepatocitoVivo: clave, texto });

export const MAYEUTICA_B5_5A_1 = {
  /* =================================================================================================
     Ficha 1 · Fallo hepático agudo (cap. 39, págs. 2-5 y 8)
     ================================================================================================= */
  'ma-fallo-hepatico-agudo': {
    entrada: 'Qué se pierde cuando el hígado falla de golpe, por qué el paracetamol engaña, cómo se parece este enfermo a un shock inflamatorio y qué fluido y qué técnica le tocan.',
    guia: [
      { id: 'fha-g1', corto: 'qué se pierde', tipo: 'test', fuente: 'ma-fha-definicion',
        enunciado: 'Un hígado que deja de funcionar de golpe en alguien sano. Antes de mirar la ficha: ¿qué tres cosas se pierden a la vez?',
        opciones: [
          { t: 'Solo la bilirrubina y las transaminasas, que son lo que se mide', porque: 'Son marcadores de daño, no la función que se pierde. Si piensas solo en esas cifras, no esperarás el sangrado por falta de factores ni la infección por falta de filtro.' },
          { t: 'La síntesis de unas 20.000 proteínas, el metabolismo de muchas sustancias y la retirada de microbios que cruzan el intestino', ok: true },
          { t: 'El almacén de glucógeno y la producción de bilis, y nada más', porque: 'La ficha no habla de ellos. Con esa idea corta no entenderías la coagulopatía ni la inflamación sistémica del fallo agudo.' }],
        explicacion: 'Se pierden a la vez <span class="hl">la síntesis de unas 20.000 proteínas</span> (todos los factores de coagulación y las proteínas de transporte), el <span class="hl">metabolismo</span> de innumerables sustancias y la <span class="hl-azul">retirada de microbios</span> que atraviesan la mucosa intestinal (' + pag(2, 'pág. 2') + ').' },
      { id: 'fha-g2', corto: 'ALT y paracetamol', tipo: 'test', fuente: 'ma-fha-paracetamol', modelo: hv('casimira', '🏭 Casimira en el hepatocito vivo (paracetamol → glutatión)'),
        enunciado: 'Una sobredosis de paracetamol: ¿por qué la ALT se dispara mientras la bilirrubina sube poco, y qué hace la N-acetilcisteína?',
        opciones: [
          { t: 'El metabolito del paracetamol oxida el hepatocito cuando se agota el glutatión; la NAC lo sustituye', ok: true },
          { t: 'El paracetamol bloquea la salida de bilis; la NAC la desbloquea', porque: 'Eso daría bilirrubina alta, no una ALT muy alta con bilirrubina poco elevada. Tratarías con un mecanismo que no es el de la ficha.' },
          { t: 'El paracetamol destruye el hepatocito por un mecanismo inmune; la NAC frena esa respuesta', porque: 'La ficha lo explica por daño oxidativo, no inmune. Con esa idea no entenderías por qué el antídoto es el que repone el antioxidante.' }],
        explicacion: 'Se agota el <span class="hl-azul">glutatión hepático</span> (el principal antioxidante intracelular) y un metabolito del paracetamol produce <span class="hl-rojo">daño oxidativo</span>: ALT muy alta con bilirrubina poco elevada, desde las 12 h y máximo a los 3-5 días. La NAC <span class="hl">sustituye al glutatión</span> (' + pag(2, 'págs. 2') + '-' + pag(3, '3') + ').',
        nota: '<b>La fuente no lo dice.</b> El libro no explica por qué la bilirrubina sube menos que la ALT; solo da el patrón. La explicación es la del daño del hepatocito (deducción).' + enFicha('ma-fallo-hepatico-agudo', 'ma-fha-paracetamol') },
      { id: 'fha-g3', corto: 'indetectable', tipo: 'test', fuente: 'ma-fha-paracetamol',
        enunciado: 'ALT 5.800 y paracetamol indetectable en plasma. ¿Descarta eso el paracetamol?',
        opciones: [
          { t: 'Sí: si no hay nivel detectable en plasma, el paracetamol no es la causa', porque: 'En la mitad de los casos con daño hepático el paracetamol es indetectable. Descartarlo deja sin antídoto a un enfermo con una causa tratable.' },
          { t: 'No: es indetectable en el 50 % de los casos con daño hepático', ok: true },
          { t: 'Solo si la ALT pasa de 10.000', porque: 'La ficha no da ese umbral. Es una regla inventada que retrasaría el antídoto.' }],
        explicacion: 'El paracetamol es <span class="hl-rojo">indetectable en el 50 %</span> de los casos con daño hepático, y la mitad de las sobredosis son <span class="hl">involuntarias</span> (el paracetamol está en más de 600 productos sin receta): el riesgo es no diagnosticar algo tratable (' + pag(3, 'pág. 3') + ').' },
      { id: 'fha-g4', corto: 'vs cirrótico', tipo: 'destapa', cuantas: 'son tres cosas', fuente: 'ma-fha-clinica', modeloVivo: { shockVivo: 'septico', texto: '🫀 El mismo patrón hemodinámico: el shock séptico a pie de cama' },
        enunciado: 'El adjunto pregunta: «¿en qué se distingue este enfermo del cirrótico descompensado?».',
        puntos: [
          'No hay <span class="hl">ascitis ni varices</span>: no es una hipertensión portal crónica.',
          'Domina la <span class="hl-rojo">inflamación sistémica</span> que sale del hígado dañado, con inestabilidad hemodinámica.',
          'Hay <span class="hl-rojo">disfunción multiorgánica</span>, como en un shock inflamatorio.'],
        explicacion: 'La ficha lo compara con un shock inflamatorio (' + pag(5, 'pág. 5') + '). El modelo del shock séptico muestra el mismo patrón de vasodilatación, pero no tiene un estado de fallo hepático: es una analogía, no su modelo.' },
      { id: 'fha-g5', corto: 'albúmina, no RL', tipo: 'test', fuente: 'ma-fha-hemodinamica', modelo: hv('casimira', '🏭 Albúmina 5 % y Ringer lactato en el astrocito'),
        enunciado: 'PA 82/45 y albúmina sérica de 2,6 g/dL en un fallo hepático agudo. ¿Qué fluido, y por qué no Ringer lactato?',
        opciones: [
          { t: 'Albúmina al 5 %: deja un 70 % en el vaso; el Ringer favorece la hiponatremia y el edema cerebral', ok: true },
          { t: 'Ringer lactato, que repone el lactato que el hígado no aclara', porque: 'La ficha pide evitarlo: favorece la hiponatremia, que empeora el edema cerebral. Lo que llenarías sería el astrocito.' },
          { t: 'Cualquier cristaloide, porque la albúmina solo se usa en la cirrosis', porque: 'La ficha usa la albúmina como fluido de reanimación sobre todo con albúmina <3 g/dL; no la reserva a la cirrosis. Perderías el fluido que se queda en el vaso.' }],
        explicacion: 'La <span class="hl-verde">albúmina</span> es el fluido de reanimación, sobre todo con albúmina sérica <3 g/dL; la del 5 % (5 g/dL) deja un <span class="hl">70 % en el espacio intravascular</span>. <span class="hl-rojo">Evitar el Ringer lactato</span>: favorece la hiponatremia (' + pag(5, 'pág. 5') + ').' },
      { id: 'fha-g6', corto: 'TRR temprana', tipo: 'test', fuente: 'ma-fha-ira', modeloVivo: { nefronaViva: 'prerrenal', texto: '💧 La nefrona con poca perfusión (solo ilustra el riñón hipoperfundido)' },
        enunciado: 'En el fallo hepático agudo, ¿por qué se usa la terapia de reemplazo renal de forma más agresiva que en otro fracaso renal?',
        opciones: [
          { t: 'Porque además del volumen retira amonio y protege frente a la encefalopatía', ok: true },
          { t: 'Porque el riñón se pierde siempre en el 100 % de los casos y por eso no hay que esperar', porque: 'El fracaso renal aparece en el 70 %, no en todos. Con una idea exagerada indicarías la técnica a quien aún orina bien y no la necesita por el riñón.' },
          { t: 'Porque el fracaso renal del fallo hepático es siempre una necrosis tubular por paracetamol', porque: 'La ficha da el fracaso renal en el 70 %, sobre todo con paracetamol o con hipotensión que necesita vasopresores (pág. 5): no es siempre por paracetamol, y esperar esa causa retrasaría el soporte.' }],
        explicacion: 'El fracaso renal agudo aparece en el <span class="hl">70 %</span>, sobre todo con paracetamol o con hipotensión que necesita vasopresores. La TRR es más agresiva porque <span class="hl-azul">retira amonio</span> y protege frente a la encefalopatía (' + pag(5, 'pág. 5') + ').' },
    ],
    examen: [
      { id: 'fha-e1', corto: 'isquemia', tipo: 'test', fuente: 'ma-fha-isquemia',
        enunciado: 'ALT 4.200 UI/L y bilirrubina 3,8 mg/dL tras un shock hemorrágico. ¿Cuál es la causa más probable?',
        opciones: [
          { t: 'Hepatitis isquémica', ok: true },
          { t: 'Paracetamol, porque la bilirrubina es baja', porque: 'Hay un antecedente de hipoperfusión que lo explica. Buscar un tóxico retrasaría el control de la hipoperfusión, que es lo que suele resolverla.' },
          { t: 'Hepatitis vírica aguda', porque: 'Es menos del 10 % en países desarrollados y no hay sospecha en el caso. Perderías la causa que se corrige restaurando la perfusión.' },
          { t: 'Hepatitis autoinmune', porque: 'Pide inicio insidioso, ANA y mujer; aquí hay un shock previo. Pondrías un tratamiento sin base.' }],
        explicacion: 'Transaminasas <span class="hl-rojo">>3.000 UI/L con bilirrubina <5 mg/dL</span> tras hipoperfusión: hepatitis isquémica. Se resuelve si se resuelve la hipoperfusión, pero un 25 % necesita trasplante (' + pag(4, 'pág. 4') + ').' },
      { id: 'fha-e2', corto: 'NAC sin causa', tipo: 'test', fuente: 'ma-fha-paracetamol',
        enunciado: 'Un fallo hepático agudo sin causa clara tras estudiarlo. ¿Qué dice la ficha sobre dar N-acetilcisteína?',
        opciones: [
          { t: 'Darla de forma empírica se considera razonable, sin pruebas convincentes', ok: true },
          { t: 'Está contraindicada si no hay paracetamol detectable en plasma, porque no habría a qué oponerse', porque: 'Es justo al revés: el paracetamol es indetectable en la mitad de los casos. Te quedarías sin dar un antídoto razonable según el libro.' },
          { t: 'Solo se da dentro de las primeras 10 h', porque: 'Es más eficaz en las primeras 10 h, pero se empieza a cualquier hora. Con ese límite la negarías en casi todos.' }],
        explicacion: 'En el fallo hepático agudo de causa desconocida, darla de forma empírica <span class="hl">se considera razonable</span>, aunque no hay pruebas convincentes (' + pag(4, 'pág. 4') + '). Se empieza a cualquier hora y se mantiene hasta que mejore la función hepática (' + pag(3, 'pág. 3') + ').' },
      { id: 'fha-e3', corto: 'idiosincrásico', tipo: 'test', fuente: 'ma-tabla-39-1',
        enunciado: 'Según la Tabla 39.1, ¿cuál de estos fármacos da daño solo idiosincrásico?',
        opciones: [
          { t: 'Ácido valproico', porque: 'Está entre los dependientes de la dosis de la Tabla 39.1, no entre los idiosincrásicos (pág. 4).' },
          { t: 'Ciclosporina', porque: 'También figura entre los dependientes de la dosis de la Tabla 39.1, no entre los idiosincrásicos (pág. 4).' },
          { t: 'Fenitoína', ok: true },
          { t: 'Amiodarona', porque: 'La tabla la pone en las dos columnas: el daño puede ser dependiente de la dosis o idiosincrásico.' }],
        explicacion: 'La Tabla 39.1 pone la <span class="hl-azul">fenitoína</span> (con amoxicilina, dantroleno, halotano, lisinopril y sulfamidas) entre los idiosincrásicos. Amiodarona y estatinas figuran en las dos columnas; la lista es incompleta (' + pag(4, 'pág. 4') + ').' },
      { id: 'fha-e4', corto: 'sin trasplante', tipo: 'test', fuente: 'ma-fha-farmacos · ma-fha-hepatitis · ma-fha-isquemia',
        enunciado: 'Supervivencia sin trasplante en el fallo hepático agudo por reacción idiosincrásica a un fármaco y por hepatitis vírica. ¿Qué par es el de la ficha?',
        opciones: [
          { t: 'Idiosincrásica 40 %, vírica 25 %', ok: true },
          { t: 'Idiosincrásica 75 % sin trasplante y vírica 40 % sin trasplante, como en el paracetamol', porque: 'El 75 % es lo que se resuelve sin trasplante en el paracetamol. Darías un pronóstico demasiado bueno a una reacción idiosincrásica.' },
          { t: 'Idiosincrásica 25 % y vírica 40 %, al revés de lo que dice la ficha', porque: 'Están al revés. Avisarías tarde al equipo de trasplante en la reacción a un fármaco.' }],
        explicacion: 'Idiosincrásica: <span class="hl-rojo">40 %</span> sin trasplante. Vírica con el fallo instaurado: <span class="hl-rojo">25 %</span>. Isquémica: un 25 % necesita trasplante. En el paracetamol, el 75 % se resuelve sin él (' + pag(3, 'págs. 3') + '-' + pag(4, '4') + ').' },
      { id: 'fha-e5', corto: 'avisar a trasplante', tipo: 'test', fuente: 'ma-fha-trasplante',
        enunciado: '¿Cuándo hay que consultar al especialista en trasplante en un fallo hepático agudo?',
        opciones: [
          { t: 'Solo si la encefalopatía llega a grado 4', porque: 'Es esperar al coma. La ficha pide consulta antes: ante cualquier encefalopatía progresiva.' },
          { t: 'Ante cualquier encefalopatía progresiva', ok: true },
          { t: 'Solo si el INR pasa de 6 y la bilirrubina de 10 mg/dL', porque: 'La ficha no da un INR. Esperarías una cifra de laboratorio mientras el cerebro empeora.' }],
        explicacion: 'El trasplante es el tratamiento definitivo y ha bajado la mortalidad del <span class="hl-rojo">80 % al 33 %</span>; se consulta con el especialista ante <span class="hl">cualquier encefalopatía progresiva</span> (' + pag(8, 'pág. 8') + ').' },
    ],
    casos: [
      { id: 'fha-c', titulo: 'Casimira I, 44 años: el dolor lumbar que no era de la espalda', corto: 'Caso · Casimira I', sub: 'fallo hepático agudo por paracetamol; 60 kg',
        paciente: { Edad: '44 años', Peso: '60 kg', Motivo: 'Dolor lumbar tratado con analgésicos de la farmacia' },
        pasos: [
          { momento: 'Hora 36', datos: { Analítica: 'ALT 5.800 UI/L, bilirrubina 2,1 mg/dL, INR 3,4', Antecedentes: 'sin hipotensión previa; VHB y ANA negativos' }, nuevo: ['Analítica', 'Antecedentes'], calculadora: { ir: 'ma-fha-causa-resultado', nombre: '¿Qué sugiere este patrón?' },
            pregunta: { id: 'fha-c0', tipo: 'test', fuente: 'ma-fha-paracetamol · ma-fha-isquemia · ma-fha-hepatitis',
              enunciado: 'Dolor lumbar tratado con «tres cosas de la farmacia». ¿Qué causa del fallo hepático sugiere este patrón?',
              opciones: [
                { t: 'Isquémica: transaminasas muy altas con bilirrubina baja', porque: 'La hepatitis isquémica pide una hipoperfusión previa, como un shock (pág. 4), y aquí no la hay. Buscarías una causa que no existe.' },
                { t: 'Paracetamol: ALT muy alta con bilirrubina poco elevada y analgésicos', ok: true },
                { t: 'Vírica: la hepatitis B es la causa más frecuente en los países desarrollados', porque: 'La vírica es <10 % en países desarrollados (pág. 4) y la serología es negativa. Perderías la causa tratable.' },
                { t: 'Autoinmune: ALT muy alta en una mujer', porque: 'Es el 80 % mujeres, pero de inicio insidioso y con ANA positivo (pág. 4); aquí el ANA es negativo y el cuadro es agudo tras analgésicos.' }],
              explicacion: 'ALT muy alta con bilirrubina poco elevada y un dolor tratado con analgésicos: <span class="hl-rojo">paracetamol</span> (' + pag(3, 'pág. 3') + '). La isquémica pide hipoperfusión previa; la vírica es <10 %; la autoinmune es insidiosa y con ANA (' + pag(4, 'pág. 4') + ').' } },
          { momento: 'Hora 36 · el antídoto', datos: { Paracetamol: 'indetectable en plasma' }, nuevo: ['Paracetamol'],
            pregunta: { id: 'fha-c1', tipo: 'test', fuente: 'ma-fha-paracetamol', modeloVivo: hv('casimira', '🏭 Casimira en el hepatocito vivo'),
              enunciado: 'El nivel de paracetamol es indetectable. ¿Qué haces con la N-acetilcisteína?',
              opciones: [
                { t: 'Empezarla ya: indetectable no descarta; es eficaz a cualquier hora', ok: true },
                { t: 'Esperar un nivel de control de paracetamol y decidir con el resultado del laboratorio', porque: 'Pierdes horas con una causa tratable; es indetectable en la mitad de los casos y la NAC se empieza a cualquier hora.' },
                { t: 'No darla: ya pasaron más de 10 h', porque: 'Es más eficaz en las primeras 10 h, pero se empieza a cualquier hora. La dejas sin antídoto.' },
                { t: 'Darla solo si el INR pasa de 5', porque: 'La ficha no da ese criterio. Es esperar a que empeore.' }],
              explicacion: 'La ficha da la NAC en cuanto se <span class="hl">confirma o sospecha</span> la sobredosis. El paracetamol es <span class="hl-rojo">indetectable en el 50 %</span>; se empieza a cualquier hora y se mantiene hasta que mejore la función hepática (' + pag(3, 'pág. 3') + '). La pauta no está en este capítulo.' } },
          { momento: 'Día 1 · el plan del R1', datos: { 'Nota del R1': 'plan de soporte por escrito' }, nuevo: ['Nota del R1'],
            pregunta: { id: 'fha-c3b', tipo: 'error', fuente: 'ma-fha-paracetamol · ma-fha-hemodinamica · ma-fha-ira · ma-fha-trasplante',
              enunciado: 'El plan del R1 de guardia. Encuentra los errores.',
              frases: [
                { t: 'Suspendo la NAC: el nivel de paracetamol es indetectable.', mal: true, c: 'El paracetamol es <span class="hl-rojo">indetectable en el 50 %</span> de los casos con daño hepático; la NAC se mantiene hasta que mejore la función hepática.' },
                { t: 'Albúmina al 5 % si hay que dar volumen.' },
                { t: 'Ringer lactato de mantenimiento.', mal: true, c: '<span class="hl-rojo">Evitar el Ringer lactato</span>: favorece la hiponatremia, que empeora el edema cerebral.' },
                { t: 'Vigilo la diuresis: el fracaso renal aparece en el 70 %.' },
                { t: 'Aviso a trasplante si la encefalopatía progresa.' }],
              explicacion: 'Dos errores: suspender la NAC por un nivel indetectable (' + pag(3, 'pág. 3') + ') y el Ringer lactato (' + pag(5, 'pág. 5') + '). El aviso a trasplante ante encefalopatía progresiva es correcto (' + pag(8, 'pág. 8') + ').' } },
          { momento: 'Día 3', datos: { Diuresis: '0,3 mL/kg/h durante 6 h', Hemodinámica: 'PA 82/45, FC 112', Albúmina: '2,6 g/dL' }, nuevo: ['Diuresis', 'Hemodinámica', 'Albúmina'],
            pregunta: { id: 'fha-c4', tipo: 'destapa', cuantas: 'son tres cosas', fuente: 'ma-fha-hemodinamica · ma-fha-ira', modeloVivo: [hv('casimira', '🏭 El astrocito con albúmina y con Ringer'), { nefronaViva: 'prerrenal', texto: '💧 La nefrona con poca perfusión' }],
              enunciado: 'Oligúrica e hipotensa. El adjunto pregunta: «¿qué fluido, qué fluido no, y por qué el riñón?».',
              puntos: [
                '<span class="hl-verde">Albúmina al 5 %</span>: con albúmina <3 g/dL, deja un 70 % en el espacio intravascular.',
                '<span class="hl-rojo">Ringer lactato no</span>: favorece la hiponatremia y empeora el edema cerebral.',
                'El riñón: el fracaso renal agudo aparece en el <span class="hl">70 %</span>, sobre todo con hipotensión que necesita vasopresores o paracetamol; la TRR, además, retira amonio.'],
              explicacion: 'Casimira reúne los dos factores de riesgo del fracaso renal: paracetamol e hipotensión (' + pag(5, 'pág. 5') + '). El modelo de la nefrona enseña el riñón hipoperfundido, no un estado propio del fallo hepático.' } },
          { momento: 'Familia · el pronóstico', datos: { Situación: 'la hija pregunta qué va a pasar' }, nuevo: ['Situación'],
            pregunta: { id: 'fha-c6', tipo: 'test', fuente: 'ma-fha-trasplante · ma-fha-paracetamol',
              enunciado: '¿Qué le dices a la hija sobre el pronóstico?',
              opciones: [
                { t: 'Que con paracetamol el 75 % se resuelve sin trasplante; si la encefalopatía progresa, se consulta ya: el trasplante bajó la mortalidad del 80 % al 33 %', ok: true },
                { t: 'Que seguro se recupera, porque el 75 % se resuelve sin trasplante', porque: 'Es una cifra general de los casos de paracetamol; no promete nada a una enferma que sigue grave y puede necesitar trasplante.' },
                { t: 'Que sin trasplante no hay posibilidades', porque: 'El 75 % se resuelve sin él en el paracetamol; decirlo así sería falso.' }],
              explicacion: 'Con paracetamol, el <span class="hl-verde">75 %</span> se resuelve sin trasplante (' + pag(3, 'pág. 3') + '). El trasplante, tratamiento definitivo, ha bajado la mortalidad del <span class="hl-rojo">80 % al 33 %</span>, y se consulta ante cualquier encefalopatía progresiva (' + pag(8, 'pág. 8') + ').' } },
        ],
        lleva: [
          'Un paracetamol indetectable no descarta la intoxicación: la NAC se empieza a cualquier hora.',
          'Fluido: albúmina al 5 %, nunca Ringer lactato; y el riñón cae en el 70 %.',
          'Ante encefalopatía progresiva, se consulta ya con trasplante: de ahí la segunda parte de Casimira, en la ficha de la encefalopatía.'],
        volver: { nombre: 'Hemodinámica', ancla: 'ma-fha-hemodinamica', modeloVivo: hv('casimira', '🏭 Casimira en el hepatocito vivo') } },
    ],
    profundizar: [
      { id: 'ma-fha-hepatitis', titulo: 'Hepatitis aguda: autoinmune, vírica, HELLP y Budd-Chiari' },
      { id: 'ma-fha-definicion', titulo: 'Definición y registro de 2.614 casos en 20 años' },
      { id: 'ma-fha-farmacos', titulo: 'Otros fármacos: dependientes de la dosis e idiosincrásicos', nota: 'La NAC empírica en la causa desconocida está en el examen; su pauta IV, en Tóxicos.' },
    ],
  },

  /* =================================================================================================
     Ficha 2 · Encefalopatía hepática y edema cerebral (cap. 39, págs. 5-8)
     ================================================================================================= */
  'ma-encefalopatia-hepatica': {
    entrada: 'El viaje del amonio desde el intestino hasta el astrocito, la escala de West Haven, la cifra de 150 y lo que hacen lactulosa, rifaximina y hemofiltración.',
    guia: [
      { id: 'eh-g1', corto: 'el viaje del amonio', tipo: 'destapa', cuantas: 'son cuatro cosas', fuente: 'ma-eh-amonio', modelo: hv('casimira', '🏭 El recorrido del amonio: colon, hígado y astrocito'),
        enunciado: 'Cuenta el viaje del amonio desde que nace hasta que hincha el cerebro.',
        puntos: [
          'Nace al degradar proteínas, sobre todo en el <span class="hl">intestino</span> (menos en músculo y riñón).',
          'El hígado lo vuelve <span class="hl-azul">urea</span>; en el fallo hepático eso se pierde y el amonio sube.',
          'Cruza la barrera hematoencefálica y el <span class="hl-azul">astrocito</span> lo usa para hacer glutamina.',
          'La glutamina acumulada <span class="hl-rojo">arrastra agua</span> al astrocito: edema cerebral citotóxico.'],
        explicacion: 'La cadena entera, de la ficha (' + pag(6, 'pág. 6') + '). Los pasos intermedios del ciclo de la urea no están en el libro.' },
      { id: 'eh-g2', corto: 'West Haven', tipo: 'test', fuente: 'ma-tabla-39-2',
        enunciado: 'Una paciente con fallo hepático está apática y no sabe en qué día está, pero responde bien. ¿Qué grado de West Haven tiene?',
        opciones: [
          { t: 'Grado 1: cambio de personalidad', porque: 'El grado 1 es atención corta y cambio de personalidad. La apatía con desorientación en el tiempo ya es más; infravalorarla retrasa la hemofiltración.' },
          { t: 'Grado 2: apatía, desorientada en el tiempo', ok: true },
          { t: 'Grado 3: estuporosa pero responde, desorientada en lugar y tiempo', porque: 'El estupor y la desorientación en lugar y tiempo son del grado 3. Sobrevalorarla te llevaría a medidas de coma que no necesita.' }],
        explicacion: '<span class="hl">Grado 2</span>: apatía o letargia y desorientación en el tiempo. Grado 1: atención corta y cambio de personalidad; grado 3: estupor con respuesta y desorientación en lugar y tiempo; grado 4: coma (' + pag(6, 'págs. 6') + '-' + pag(7, '7') + ').' },
      { id: 'eh-g3', corto: 'NH₃ y 150', tipo: 'test', fuente: 'ma-eh-nh3', modelo: hv('casimira', '🏭 El monitor de amonio con el 20 % de hepatocitos'),
        enunciado: 'Con solo el 20 % de los hepatocitos vivos y una producción normal de amonio, ¿el amonio arterial está por encima o por debajo de 150 µmol/L? Piénsalo y luego míralo.',
        opciones: [
          { t: 'Por debajo: con el 20 % el hígado aún depura lo bastante', porque: 'Por debajo de 150 no habría riesgo especial de edema. Te confiarías con un hígado muy dañado.' },
          { t: 'Igual que el normal, <60, mientras el enfermo no tenga síntomas', porque: 'El amonio plasmático casi siempre está elevado en el fallo hepático; esperar a los síntomas retrasa la medida.' },
          { t: 'Por encima: con tan poco hígado se acumula', ok: true }],
        explicacion: 'En el modelo, Casimira (20 % de hepatocitos) marca <span class="hl-rojo">165 µmol/L</span>: por encima del corte. Amonio arterial <span class="hl-rojo">>150</span> (normal <60) marca más riesgo de edema cerebral (' + pag(7, 'pág. 7') + ').',
        nota: '<b>La fuente no lo dice.</b> El libro no da el amonio según los hepatocitos vivos; las cifras del modelo (165 con el 20 %) son ilustrativas, solo el 150 y el 60 son del libro.' + enFicha('ma-encefalopatia-hepatica', 'ma-eh-nh3') },
      { id: 'eh-g4', corto: 'por qué la lactulosa', tipo: 'test', fuente: 'ma-eh-lactulosa', modelo: hv('casimira', '🏭 La lactulosa en el colon'),
        enunciado: 'La lactulosa no toca el hígado. ¿Por qué baja el amonio, y cómo se ajusta?',
        opciones: [
          { t: 'Cierra la absorción del amonio en el intestino; objetivo 5-6 deposiciones', porque: 'No la cierra: acidifica y elimina los productores. Con 5-6 deposiciones, diarrea osmótica e hipovolemia.' },
          { t: 'Aumenta la actividad del ciclo de la urea; se da hasta que el amonio sea normal', porque: 'No actúa sobre el hígado, y el criterio de ajuste son las deposiciones, no una cifra.' },
          { t: 'Las bacterias la convierten en ácidos grasos que acidifican el colon y eliminan los microbios productores; objetivo 2-3 deposiciones blandas', ok: true }],
        explicacion: 'Las bacterias lácticas la convierten en ácidos grasos de cadena corta y <span class="hl-azul">la acidificación elimina los microbios productores de amonio</span>. Se da cada hora hasta la primera deposición, luego 20 g cada 8 h, ajustando a <span class="hl-verde">2-3 deposiciones blandas al día</span>; si hay diarrea, reducir o parar (' + pag(7, 'pág. 7') + ').' },
      { id: 'eh-g5', corto: 'rifaximina', tipo: 'test', fuente: 'ma-eh-rifaximina',
        enunciado: '¿Qué es la rifaximina, cuánto se da y cómo se usa?',
        opciones: [
          { t: 'Antibiótico sistémico: 400 mg una vez al día durante unos 5 días, solo si falla la lactulosa', porque: 'Es no absorbible, 3 veces al día y al menos 10 días. Una pauta corta dejaría a los microbios productores en el colon.' },
          { t: 'Antibiótico no absorbible, 400 mg tres veces al día hasta que el amonio sea <150', porque: 'La ficha da una duración mínima de 10 días, no un objetivo de amonio (pág. 7); con ese criterio la retirarías antes de tiempo.' },
          { t: 'Antibiótico no absorbible: 400 mg tres veces al día, ≥10 días', ok: true }],
        explicacion: 'Antibiótico no absorbible de amplio espectro: <span class="hl">400 mg tres veces al día, al menos 10 días</span>. Eficaz sola, pero suele combinarse con lactulosa (' + pag(7, 'pág. 7') + ').' },
      { id: 'eh-g6', corto: 'CVVH con creatinina normal', tipo: 'test', fuente: 'ma-eh-cvvh · ma-cvvh-resultado', modelo: hv('casimira', '🏭 La hemofiltración sacando amonio'),
        enunciado: 'Amonio arterial 165, creatinina 1,1 y sin oliguria, en un fallo agudo con encefalopatía. ¿Hemofiltración?',
        opciones: [
          { t: 'Sí: con amonio >150 se debe considerar, sea cual sea la creatinina', ok: true },
          { t: 'No: sin deterioro renal la hemofiltración no tiene indicación', porque: 'Las indicaciones son oliguria persistente, amonio >150 o edema, sea cual sea la creatinina. Esperarías el riñón mientras el cerebro se hincha.' },
          { t: 'No: mejor lactulosa y rifaximina, que se consideran superiores', porque: 'En el fallo agudo con encefalopatía es la CVVH la superior a la lactulosa y la rifaximina.' }],
        explicacion: 'Se debe considerar con <span class="hl">oliguria persistente</span>, <span class="hl-rojo">amonio >150 µmol/L</span> o <span class="hl-rojo">edema cerebral</span>, sea cual sea la creatinina. Su eficacia depende del tiempo (' + pag(7, 'pág. 7') + ' y ' + pag(8, '8') + ').' },
    ],
    examen: [
      { id: 'eh-e1', corto: '>150', tipo: 'test', fuente: 'ma-eh-nh3',
        enunciado: '¿Qué cifra de amonio marca un riesgo aumentado de edema cerebral?',
        opciones: [
          { t: 'Arterial >150 µmol/L (normal <60)', ok: true },
          { t: 'Cualquier elevación por encima de lo normal', porque: 'El libro da un corte: la mayoría de los enfermos lo tiene elevado y no todos tienen edema. Tratarías a todos igual.' },
          { t: 'Venoso >100 µmol/L', porque: 'La ficha da el corte para el amonio arterial, que quizá predice mejor que el venoso, al menos al principio (pág. 7).' },
          { t: 'Arterial >60 µmol/L', porque: 'Es el límite superior de lo normal, no el de riesgo.' }],
        explicacion: 'Amonio arterial <span class="hl-rojo">>150 µmol/L</span> (normal <60) marca un riesgo aumentado de edema; el arterial quizá predice mejor que el venoso, al menos al principio (' + pag(7, 'pág. 7') + ').' },
      { id: 'eh-e2', corto: 'amonio y gravedad', tipo: 'test', fuente: 'ma-eh-nh3',
        enunciado: 'Sobre la relación entre el nivel de amonio y la gravedad de la encefalopatía, ¿qué dice la ficha?',
        opciones: [
          { t: 'Se correlacionan siempre', porque: 'La ficha lo limita a muchos casos, no a todos. Si confías ciegamente en la cifra, ignorarás a un enfermo grave con amonio moderado.' },
          { t: 'No se correlacionan nunca', porque: 'Hay correlación en muchos casos; descartar la cifra sería perder el criterio de CVVH.' },
          { t: 'En muchos casos, no en todos, y más en el fallo agudo que en la cirrosis', ok: true },
          { t: 'Solo se correlacionan en la cirrosis', porque: 'Es al revés: ocurre más en el fallo hepático agudo.' }],
        explicacion: 'El amonio casi siempre está elevado; el nivel se correlaciona con la gravedad <span class="hl">en muchos casos, no en todos</span>, más en el fallo agudo que en la cirrosis descompensada (' + pag(7, 'pág. 7') + ').' },
      { id: 'eh-e3', corto: 'indicaciones de CVVH', tipo: 'test', fuente: 'ma-eh-cvvh',
        enunciado: '¿Cuál es una indicación de hemofiltración en el fallo hepático agudo?',
        opciones: [
          { t: 'Creatinina >2 mg/dL', porque: 'No es una indicación: la ficha dice «sea cual sea la creatinina». Esperarías al riñón.' },
          { t: 'Encefalopatía de grado 3 o más', porque: 'El grado de West Haven no es la indicación. Llegarías al estupor para empezarla.' },
          { t: 'Oliguria persistente', ok: true },
          { t: 'Bilirrubina >10 mg/dL', porque: 'La ficha no le da ese papel; la bilirrubina no mide el amonio.' }],
        explicacion: 'Tres indicaciones: <span class="hl">oliguria persistente</span>, <span class="hl-rojo">amonio >150</span> o <span class="hl-rojo">edema cerebral</span>, sea cual sea la creatinina (' + pag(8, 'pág. 8') + ').' },
      { id: 'eh-e4', corto: 'enema de retención', tipo: 'test', fuente: 'ma-eh-lactulosa',
        enunciado: 'Enema de retención de lactulosa. ¿Cuál es la pauta de la ficha?',
        opciones: [
          { t: '200 g (300 mL) en 700 mL de agua del grifo, retenido 30-60 min en Trendelenburg', ok: true },
          { t: '20-30 g cada hora hasta la deposición', porque: 'Es la pauta oral o por sonda, no el enema.' },
          { t: '300 g en 300 mL, retenido 10 min', porque: 'Ni la cantidad ni el tiempo son los de la ficha: 200 g en 700 mL y 30-60 min (pág. 7).' }],
        explicacion: 'Enema alto: <span class="hl">200 g (300 mL) en 700 mL de agua del grifo</span>, retenido <span class="hl">30-60 min</span> en Trendelenburg (' + pag(7, 'pág. 7') + ').' },
      { id: 'eh-e5', corto: 'qué es superior', tipo: 'test', fuente: 'ma-eh-cvvh',
        enunciado: 'En un fallo hepático agudo con encefalopatía, ¿qué se considera hoy superior para bajar el amonio?',
        opciones: [
          { t: 'La hemofiltración, sobre la lactulosa o la rifaximina', ok: true },
          { t: 'La lactulosa a dosis altas hasta que el amonio sea normal', porque: 'Por encima del objetivo de 2-3 deposiciones solo da diarrea osmótica.' },
          { t: 'La rifaximina sola', porque: 'Es eficaz sola, pero no es superior en el fallo agudo con encefalopatía.' }],
        explicacion: 'Hoy la <span class="hl-verde">CVVH</span> se considera superior a la lactulosa o la rifaximina en el fallo agudo con encefalopatía; baja el amonio y mejora el pronóstico, sobre todo si se mantiene (' + pag(8, 'pág. 8') + ').' },
    ],
    casos: [
      { id: 'eh-c', titulo: 'Casimira II, 44 años: la encefalopatía, del día 1 al día 4', corto: 'Caso · Casimira II', sub: 'fallo hepático agudo por paracetamol; 60 kg',
        paciente: { Edad: '44 años', Peso: '60 kg', Motivo: 'Fallo hepático agudo por paracetamol (continúa Casimira I)' },
        pasos: [
          { momento: 'Día 1 · noche', datos: { Clínica: 'atención corta, cambio de carácter; orientada', Analítica: 'INR 3,4' }, nuevo: ['Clínica', 'Analítica'],
            pregunta: { id: 'eh-c1', tipo: 'test', fuente: 'ma-tabla-39-2',
              enunciado: 'Su hija dice que «no es la misma» y se distrae enseguida, pero está orientada. ¿Qué grado de West Haven tiene?',
              opciones: [
                { t: 'Grado 2: apatía y desorientación en el tiempo', porque: 'No está apática ni desorientada. Sobrevalorarla la llevaría a medidas de un grado que aún no tiene.' },
                { t: 'Grado 1', ok: true },
                { t: 'Sin encefalopatía, porque no tiene asterixis', porque: 'Los signos motores pueden aparecer en cualquier fase (pág. 6), pero no son necesarios: la atención corta y el cambio de personalidad ya son el grado 1. La dejarías sin vigilar.' }],
              explicacion: '<span class="hl">Grado 1</span>: atención corta y cambio de personalidad (' + pag(6, 'págs. 6') + '-' + pag(7, '7') + ').' } },
          { momento: 'Día 2 · 08:00 · la nota del R1', datos: { Amonio: 'venoso 90 µmol/L' }, nuevo: ['Amonio'],
            pregunta: { id: 'eh-c3', tipo: 'error', fuente: 'ma-eh-nh3 · ma-eh-cvvh',
              enunciado: 'La nota del R1 de guardia. Encuentra el error.',
              frases: [
                { t: 'Amonio venoso 90: está por debajo de 150, así que descarto riesgo de edema.', mal: true, c: 'El corte de <span class="hl-rojo">150 µmol/L</span> es del amonio <span class="hl-azul">arterial</span>, que quizá predice mejor que el venoso, al menos al principio (pág. 7): mide el arterial.' },
                { t: 'Sigo con lactulosa, ajustando a 2-3 deposiciones blandas al día.' },
                { t: 'Mantengo la rifaximina al menos 10 días.' },
                { t: 'Vigilo la diuresis, porque una oliguria persistente es una de las indicaciones de la hemofiltración.' }],
              explicacion: 'Un único error: el corte vale para el amonio arterial (' + pag(7, 'pág. 7') + ').',
              nota: '<b>La fuente no lo dice.</b> El libro no convierte un amonio venoso en arterial; solo dice que el arterial quizá predice mejor, al menos al principio.' } },
          { momento: 'Día 2 · 10:00', datos: { Clínica: 'apática, no sabe en qué día está', Amonio: 'arterial 165 µmol/L', Creatinina: '1,1 mg/dL', Diuresis: 'normal' }, nuevo: ['Clínica', 'Amonio', 'Creatinina', 'Diuresis'], calculadora: { ir: 'ma-cvvh-resultado', nombre: 'Fallo hepático agudo con encefalopatía: ¿hemofiltración?' },
            pregunta: { id: 'eh-c6', tipo: 'test', fuente: 'ma-tabla-39-2 · ma-eh-cvvh',
              enunciado: 'Con el amonio arterial en 165, ¿qué grado de West Haven tiene y qué decides?',
              opciones: [
                { t: 'Grado 2; se debe considerar la hemofiltración, con amonio >150 y creatinina normal', ok: true },
                { t: 'Grado 2; lactulosa, rifaximina y esperar a que la creatinina suba para plantear la técnica', porque: 'La indicación no depende de la creatinina: se considera sea cual sea. Esperarías al riñón mientras el cerebro se hincha.' },
                { t: 'Grado 2; rifaximina 10 días y revalorar', porque: 'En el fallo agudo con encefalopatía la CVVH se considera superior; revalorar a los 10 días es llegar tarde.' },
                { t: 'Grado 3, intubar', porque: 'Responde y no está estuporosa: eso es el grado 2. Intubarla sería tratar un grado que no tiene.' }],
              explicacion: 'Apatía y desorientación en el tiempo: <span class="hl">grado 2</span>. Con amonio <span class="hl-rojo">>150</span> se debe considerar la CVVH <span class="hl-azul">sea cual sea la creatinina</span>, y cuanto antes mejor (' + pag(6, 'págs. 6') + '-' + pag(7, '7') + ' y ' + pag(8, '8') + ').' } },
          { momento: 'Día 2 · tratamiento', datos: { Plan: 'reducir el amonio en el intestino' }, nuevo: ['Plan'],
            pregunta: { id: 'eh-c2', tipo: 'destapa', cuantas: 'son tres cosas', fuente: 'ma-eh-lactulosa · ma-eh-rifaximina', modeloVivo: hv('casimira', '🏭 La lactulosa y la rifaximina en el colon'),
              enunciado: 'El adjunto pregunta: «¿cómo pautas el tratamiento intestinal y qué vigilas?».',
              puntos: [
                '<span class="hl">Lactulosa</span> 20-30 g cada hora hasta la primera deposición; luego 20 g cada 8 h.',
                'Ajustar a <span class="hl-verde">2-3 deposiciones blandas al día</span>; si aparece diarrea, reducir o parar (diarrea osmótica).',
                '<span class="hl">Rifaximina</span> 400 mg tres veces al día, al menos 10 días.'],
              explicacion: 'Lactulosa y antibiótico no absorbible reducen la producción de amonio en el intestino (' + pag(7, 'pág. 7') + '). El modelo enseña la dirección, no la cantidad por hora, que el libro no da.' } },
          { momento: 'Día 4 · el giro', datos: { Clínica: 'estuporosa, desorientada en lugar y tiempo', Amonio: 'arterial 86 µmol/L bajo hemofiltración', TC: 'surcos borrados (Fig. 39.2)' }, nuevo: ['Clínica', 'Amonio', 'TC'],
            pregunta: { id: 'eh-c5', tipo: 'test', fuente: 'mar-img-39-2 · ma-fha-trasplante', modeloVivo: hv('edema', '🏭 El edema: enciende la CVVH y mira el sello «la TC manda»'),
              enunciado: 'El amonio arterial está en 86, por debajo de 150, y la TC enseña edema. ¿Qué manda?',
              opciones: [
                { t: 'La TC: edema con encefalopatía progresiva; aviso a trasplante', ok: true },
                { t: 'La cifra, que ha bajado de 150 y por tanto descarta que el cerebro siga hinchándose', porque: 'La cifra marca riesgo, no descarta el edema ya establecido; esperar a que la cifra «mande» pierde la ventana.' },
                { t: 'Parar la hemofiltración, que ya cumplió', porque: 'Su eficacia depende del tiempo y de mantenerla (pág. 7-8); pararla devuelve el amonio al cerebro.' },
                { t: 'Subir la lactulosa', porque: 'Con hipotensión, más diarrea osmótica deshidrata a una enferma que no tiene volumen que perder.' }],
              explicacion: 'Un amonio por debajo de 150 no borra el edema que la TC enseña: <span class="hl-rojo">manda la TC</span>. Toda encefalopatía progresiva obliga a consultar con trasplante (' + pag(8, 'pág. 8') + ').',
              nota: '<b>La fuente no lo dice.</b> El 86 es el amonio que marca el modelo con la hemofiltración encendida; el libro no relaciona el amonio con la TC en un enfermo concreto, solo dice que >150 marca más riesgo (pág. 7).' } },
        ],
        lleva: [
          'La atención corta y el cambio de carácter ya son grado 1; el corte de 150 es del amonio arterial.',
          'Lactulosa a 2-3 deposiciones y rifaximina al menos 10 días; con amonio >150 se debe considerar la hemofiltración, aunque la creatinina sea normal.',
          'Si la TC enseña edema, manda la TC, no la cifra.'],
        volver: { nombre: 'Amonio plasmático', ancla: 'ma-eh-nh3', modeloVivo: hv('edema', '🏭 El astrocito hinchado') } },
    ],
    profundizar: [
      { id: 'ma-eh-nh3', titulo: 'Amonio arterial frente a venoso al principio' },
      { id: 'ma-eh-amonio', titulo: 'Producción de amonio en músculo y riñón', nota: 'Los signos motores (asterixis, rigidez, disfagia, ataxia) pueden aparecer en cualquier fase.' },
    ],
  },
};
