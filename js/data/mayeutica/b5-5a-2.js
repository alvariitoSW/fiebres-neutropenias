// Mayéutica del bloque 5, grupo 5A (parte 2) · El hígado, Marino cap. 39: ma-varices y ma-pbe-shr, con el caso de Hilario.
// La pinta js/core/mayeutica.js (botón «Estudiar» de cada ficha). Datos puros; el formato es el de b1-fluidos.js.
//
// Toda la medicina sale de la ficha (js/modules/libros/marino-abdomen.html) y de su PDF
// (docs/marino-2024-abdomen-temperatura-caps39-44.pdf, cap. 39 = págs. 2-13, desplazamiento 0); cada pregunta dice dónde con `fuente`.
// El paciente de los casos (Hilario, 58 años, 70 kg) se inventa. Las cifras del hepatocito vivo salen de su data
// (hepatocito-vivo-data.js) y se marcan «ilustrativo». Estados que el motor no tiene (shr, pia): se usa el vecino y la frase lo dice.
const PDF = 'docs/marino-2024-abdomen-temperatura-caps39-44.pdf';
const pag = (n, txt) => `<a class="biblio-link" href="${PDF}#page=${n}" target="_blank" rel="noopener">${txt || `PDF pág. ${n}`}</a>`;
// «Ver en la ficha» dentro de una nota (REGLAS §7.9): el enlace cruzado de siempre al párrafo exacto.
const enFicha = (tab, id) => ` <button type="button" class="may-ir" data-especialidad="libros" data-view="marinoAbdomen" data-panel="panel-marino-abd-tabs" data-tab="${tab}" data-resaltar="#${id}">Ver en la ficha ↗</button>`;
// Los modelos vivos de cada pregunta (el botón sale tras contestar).
const hv = (clave, texto) => ({ hepatocitoVivo: clave, texto });
const sv = (clave, texto) => ({ shockVivo: clave, texto });
const nefrona = (valor, texto) => ({ especialidad: 'nefrologia', view: 'nefrona', nefronaViva: valor, texto });
const glomerulo = texto => ({ especialidad: 'nefrologia', view: 'nefrona', panel: 'panel-fisio-tabs', tab: 'fisio-regulacion', glomerulo: 'deplecion', texto });
const V = 'ma-varices', P = 'ma-pbe-shr';
// La discrepancia de la ceftriaxona (tabla 1 g, texto 2 g): se muestran las dos, nunca se marca error.
const NOTA_CEFTRIAXONA = `<b>Las fuentes discrepan.</b> La Tabla 39.3 dice ceftriaxona 1 g IV al día 5-7 días; el texto (${pag(9, 'pág. 9')}) dice «2 g al día, recomendado en la mayoría de las guías». Las dos son de Marino y el libro no las concilia: se muestran las dos.` + enFicha(V, 'ma-tabla-39-3');

export const MAYEUTICA_B5_5A_2 = {
  /* =================================================================================================
     Ficha 3 · Fallo agudo sobre crónico y hemorragia por varices (cap. 39, págs. 8-10)
     ================================================================================================= */
  'ma-varices': {
    entrada: 'Cómo se reanima una hemorragia por varices, con endoscopia en ≤12 h: lo que comparte con el shock hemorrágico, las tres cosas que cambian, el octreótido, la ceftriaxona y el precio del TIPS.',
    guia: [
      { id: 'var-g1', corto: 'las cuatro complicaciones', tipo: 'test', fuente: 'ma-aclf',
        enunciado: 'Un cirrótico ingresa en la UCI porque su hígado ha empeorado de golpe. Antes de leer la ficha: ¿con qué cuatro complicaciones suele venir ese fallo agudo sobre crónico?',
        opciones: [
          { t: 'Hemorragia por varices, encefalopatía, infecciones y fracaso renal agudo', ok: true },
          { t: 'Ascitis, ictericia, trombosis portal y desnutrición', porque: 'Esa lista describe la cirrosis de base, no lo que desencadena el ingreso. Si buscas solo eso, no pensarás en infección ni en el riñón, que Marino cuenta entre las cuatro complicaciones.' },
          { t: 'Hemorragia por varices, encefalopatía y peritonitis; el riñón se afecta solo en los casos terminales', porque: 'Marino cuenta el fracaso renal agudo entre las cuatro complicaciones, y llega al 50 % de los descompensados. Dejarlo fuera retrasa buscar el síndrome hepatorrenal.' }],
        explicacion: 'La mayoría de los ingresos por fallo hepático son cirróticos con un deterioro brusco, complicado con <span class="hl">(a) varices que sangran, (b) encefalopatía, (c) infecciones y (d) fracaso renal agudo</span>. Esta ficha trata la primera y la siguiente, las infecciones y el riñón.' },
      { id: 'var-g2', corto: 'tres diferencias', tipo: 'destapa', cuantas: 'son tres cosas', fuente: 'ma-var-diferencias · ma-tabla-39-3', modeloVivo: hv('hilario', '🏭 Hilario sangra: PA 85/50 y FC 118 en el hepatocito vivo'),
        enunciado: 'Hilario, cirrótico alcohólico, vomita sangre con PA 85/50. Su reanimación es la del shock hemorrágico (con sangre y fluidos sin proteínas), salvo tres cosas. ¿Cuáles?',
        puntos: [
          'El fluido: <span class="hl-verde">albúmina al 5 %</span>, sobre todo si la albúmina sérica es <3 g/dL; el 70 % de lo infundido se queda en el plasma.',
          'Qué evitar: <span class="hl-rojo">los hipotónicos como el Ringer lactato</span>, que suman riesgo de edema cerebral.',
          'Cómo guiar la hemostasia: el <span class="hl-rojo">INR no mide bien el riesgo de sangrado</span> en el cirrótico; se guía con tromboelastografía.'],
        explicacion: 'El resto es igual al shock hemorrágico del cap. 15: PAM de 65 mmHg, hematíes, plasma y plaquetas 1:1:1 y Hb objetivo de 7 g/dL (Tabla 39.3, pág. 9).' + ` (${pag(9, 'pág. 9')})`,
        nota: 'El Ringer lactato se llama «hipotónico» en Marino; otras fuentes lo llaman ligeramente hipotónico o isotónico (≈273 mOsm/L). La nota de la ficha lo recoge.' + enFicha(V, 'ma-var-diferencias') },
      { id: 'var-g3', corto: 'el shock común', tipo: 'test', fuente: 'ma-var-diferencias · ma-tabla-39-3', modelo: sv('hemo-iii', '🫀 El shock hemorrágico (clase III) a pie de cama'),
        enunciado: 'Con Hilario a PA 85/50 y FC 118, ¿qué objetivo de presión te marca la Tabla 39.3 mientras llega la sangre?',
        opciones: [
          { t: 'PAM de 65 mmHg', ok: true },
          { t: 'PAM de 80 mmHg para asegurar la perfusión del cerebro', porque: 'La tabla fija una PAM de 65 mmHg; ni el libro ni la ficha piden más. Perseguir otra cifra sin respaldo en la tabla es salirse de la pauta.' },
          { t: 'PAS por encima de 100 mmHg, que es lo que mira el manguito', porque: 'Marino no usa la sistólica: la tabla fija la PAM. Con 85/50 su PAM es ≈62, por debajo de 65, y habría que seguir reanimando.' }],
        explicacion: 'Tabla 39.3: <span class="hl">mantener una PAM de 65 mmHg</span>. La PAM de Hilario (85/50) es ≈62: aún por debajo. Es el mismo shock hemorrágico, con las tres excepciones de la pregunta anterior.',
        origen: 'ficha; PAM ≈62: cuenta ilustrativa' },
      { id: 'var-g4', corto: 'octreótido', tipo: 'test', fuente: 'ma-var-octreotido · ma-tabla-39-3',
        enunciado: '¿Qué es el octreótido en esta hemorragia, cómo se pauta y cuándo se empieza?',
        opciones: [
          { t: 'Un análogo de la somatostatina, vasoconstrictor esplácnico: 50 µg en bolo y 50 µg/h, 2-5 días', ok: true },
          { t: 'Un análogo sintético de la vasopresina que contrae el territorio esplácnico: 1 mg IV cada 4-6 h, durante 2-5 días', porque: 'Esa es la terlipresina del síndrome hepatorrenal. Dar su dosis como si fuera octreótido es dar un fármaco distinto a una dosis que no es la de la hemorragia.' },
          { t: 'Un antibiótico profiláctico: 50 µg/h hasta que cultive el líquido', porque: 'La profilaxis antibiótica es otra fila de la tabla (ceftriaxona). El octreótido no trata infecciones; si lo esperas como antibiótico, no cubres la hemorragia.' }],
        explicacion: 'Octreótido, <span class="hl-azul">análogo de la somatostatina que contrae el territorio esplácnico</span>: 50 µg IV en bolo y después 50 µg/h durante <span class="hl">2-5 días</span>, empezado lo antes posible.' + ` (${pag(9, 'pág. 9')})` },
      { id: 'var-g5', corto: 'el antibiótico', tipo: 'test', fuente: 'ma-var-octreotido · ma-tabla-39-3',
        enunciado: 'Hilario sangra y aún no tiene fiebre ni infección. ¿Por qué le pones ceftriaxona y cuándo la primera dosis?',
        opciones: [
          { t: 'Es profilaxis: se empieza cuanto antes, con la primera dosis antes de la endoscopia', ok: true },
          { t: 'Solo si aparece fiebre; si no, se espera al cultivo del líquido ascítico y se decide con el resultado de la paracentesis', porque: 'Es una profilaxis, no un tratamiento: esperar a la fiebre o al cultivo retrasa un antibiótico que la tabla pide ya, en un cirrótico con tendencia a infectarse.' },
          { t: 'Después de la endoscopia, cuando se conozca el origen del sangrado', porque: 'La tabla pone la primera dosis antes de la endoscopia. Retrasarla a después de la endoscopia incumple la tabla y deja al paciente sin cobertura durante el procedimiento.' }],
        explicacion: '<span class="hl">Profilaxis antibiótica</span> con ceftriaxona, primera dosis antes de la endoscopia. Marino avisa de que la recomendación <span class="hl-purpura">asume que los gérmenes resistentes no abundan en tu UCI</span>.',
        nota: NOTA_CEFTRIAXONA },
      { id: 'var-g6', corto: 'cuándo TIPS', tipo: 'test', fuente: 'ma-var-tips',
        enunciado: 'Hilario sigue sangrando pese a la endoscopia y al tratamiento médico óptimo. ¿En qué proporción de las hemorragias pasa, y qué se plantea?',
        opciones: [
          { t: 'Cerca del 20 %: se valora el TIPS, una derivación entre la porta y las venas hepáticas', ok: true },
          { t: 'Cerca del 50 %: repetir la ligadura todas las veces que haga falta antes de plantear otra cosa', porque: 'No es la cifra del libro ni su conducta. Reintentar sin límite una hemorragia refractaria prolonga la pérdida de sangre que ya está descompensando al paciente.' },
          { t: 'Casi ninguna: la hemorragia refractaria no se da con octreótido', porque: 'Se da en cerca del 20 %. Creer que no existe te hace llegar tarde al TIPS en el paciente que no responde.' }],
        explicacion: 'La hemorragia es refractaria a la endoscopia y al tratamiento óptimo en <span class="hl-rojo">cerca del 20 %</span>: se considera el TIPS (derivación entre la porta y las venas hepáticas, que alivia la hipertensión portal).',
        nota: '<b>Errata de la fuente.</b> Marino escribe «transesophageal portosystemic shunt» y lo llama «noninvasive» (' + pag(10, 'pág. 10') + '). El TIPS es una derivación portosistémica intrahepática transyugular y mínimamente invasiva. Se reproduce tal cual.' + enFicha(V, 'ma-var-tips') },
      { id: 'var-g7', corto: 'el TIPS salta el hígado', tipo: 'test', fuente: 'ma-var-tips', origen: 'ficha; la cifra, del modelo', modelo: hv('hilario:tips', '🏭 Hilario con TIPS en el hepatocito vivo'),
        enunciado: 'Pones el TIPS a Hilario. Sin mirar el modelo: ¿qué le pasa al amonio arterial y por qué?',
        opciones: [
          { t: 'Sube: la sangre de la porta, con el NH₃ del intestino, se salta el hígado', ok: true },
          { t: 'Baja: al aliviar la hipertensión portal, el hígado recibe mejor la sangre y trabaja mejor', porque: 'El TIPS no mejora el hígado, lo rodea. Esperar que baje el amonio es no vigilar la encefalopatía que justo ese puente favorece.' },
          { t: 'No cambia: el TIPS solo actúa sobre las varices', porque: 'Actúa sobre toda la circulación portal. El amonio que llega de la porta ya no pasa por el carril de la urea, y la encefalopatía aumenta.' }],
        explicacion: 'El TIPS <span class="hl-rojo">cambia un problema por otro</span>: al saltarse el hígado, aumenta el riesgo de encefalopatía. En el modelo, Hilario pasa de ≈67 a ≈130 µmol/L de amonio arterial (cifras del modelo, ilustrativas; el libro da el sentido, no la cantidad).' },
    ],
    examen: [
      { id: 'var-e1', corto: 'Hb objetivo', tipo: 'test', fuente: 'ma-tabla-39-3',
        enunciado: 'Hilario tiene una Hb de 6,8 g/dL en plena hematemesis. ¿Qué pauta de transfusión sigue la Tabla 39.3?',
        opciones: [
          { t: 'Hematíes, plasma y plaquetas 1:1:1, con Hb objetivo de 7 g/dL', ok: true },
          { t: 'Solo hematíes hasta Hb de 10 g/dL, y plasma solo si el INR lo pide más tarde', porque: 'Transfundir hasta 10 no es el objetivo del libro, y el INR no es un criterio válido en el cirrótico: más sangre de la necesaria y plasma sin base.' },
          { t: 'Hematíes, plasma y plaquetas 1:2:1, con Hb objetivo de 9 g/dL', porque: 'La proporción de la tabla es 1:1:1 y el objetivo 7 g/dL. Con 9 transfundes más de lo que pide el libro.' }],
        explicacion: 'Tabla 39.3: <span class="hl">hematíes, plasma y plaquetas 1:1:1</span> y <span class="hl">Hb objetivo de 7 g/dL</span>, con tromboelastografía para guiar la hemostasia.' + ` (${pag(9, 'pág. 9')})` },
      { id: 'var-e2', corto: 'ceftriaxona 1 o 2 g', tipo: 'test', fuente: 'ma-tabla-39-3 · ma-var-octreotido',
        enunciado: 'Sobre la dosis de ceftriaxona de la hemorragia por varices, ¿qué afirmación respeta lo que escribe Marino?',
        opciones: [
          { t: 'La tabla dice 1 g/día y el texto 2 g/día; las dos cifras son de Marino', ok: true },
          { t: 'Es 1 g/día; el 2 g del texto es una errata', porque: 'No se puede dar por errata una cifra que el libro defiende con su cita. Marino escribe las dos y no las concilia.' },
          { t: 'Es cefazolina, porque solo se busca cubrir la piel y los gérmenes de la mucosa del tubo digestivo alto', porque: 'La tabla pide ceftriaxona, con la primera dosis antes de la endoscopia. Con otro fármaco el paciente queda con una profilaxis que el libro no recomienda.' }],
        explicacion: 'Tabla 39.3: <span class="hl">1 g IV al día durante 5-7 días</span>, primera dosis antes de la endoscopia. Texto: <span class="hl">2 g al día</span> en la mayoría de las guías. No se marca ninguna como error.',
        nota: NOTA_CEFTRIAXONA },
      { id: 'var-e3', corto: 'INR 2,4', tipo: 'test', fuente: 'ma-var-diferencias',
        enunciado: 'Antes de la endoscopia, el INR de Hilario es 2,4. Un compañero propone plasma hasta INR <1,5. ¿Qué le contestas?',
        opciones: [
          { t: 'Que el INR no mide el sangrado del cirrótico: se guía con tromboelastografía', ok: true },
          { t: 'Que sí, pero con un objetivo de INR <1,3', porque: 'El problema no es el número, es el uso del INR: en la cirrosis no refleja el riesgo de sangrado, y el libro guía la hemostasia con tromboelastografía.' },
          { t: 'Que el plasma solo se da cuando la endoscopia ya está hecha y el sangrado está controlado', porque: 'El libro no condiciona el plasma al procedimiento: lo pone dentro de la proporción 1:1:1 y lo guía la tromboelastografía.' }],
        explicacion: '<span class="hl-rojo">El INR no es una medida válida del riesgo de sangrado en la cirrosis</span>; la hemostasia se guía con tromboelastografía.' + ` (${pag(9, 'pág. 9')})` },
      { id: 'var-e4', corto: 'el fluido', tipo: 'test', fuente: 'ma-var-diferencias',
        enunciado: 'Hilario tiene albúmina de 2,4 g/dL y PAM 62. ¿Qué fluido eliges mientras llega la sangre?',
        opciones: [
          { t: 'Ringer lactato, que expande rápido, es barato y está disponible en cualquier box de urgencias', porque: 'Marino no lo recomienda: el hipotónico suma riesgo de edema cerebral, que es el responsable de la encefalopatía hepática.' },
          { t: 'Albúmina al 5 %: concentración parecida a la del plasma y ≈70 % del volumen lo expande', ok: true },
          { t: 'Albúmina al 25 % en bolo, para no dar volumen', porque: 'Para reanimar el libro nombra la del 5 % (pág. 9); el 25 % se usa en la PBE y el SHR para limitar el volumen infundido (págs. 11-12), no para reanimar el sangrado.' }],
        explicacion: 'Con albúmina sérica <3 g/dL: <span class="hl-verde">albúmina al 5 %</span>, de concentración parecida a la del plasma; cerca del 70 % del volumen infundido expande el plasma.' },
      { id: 'var-e5', corto: 'el plan de otro', tipo: 'error', fuente: 'ma-tabla-39-3 · ma-var-tips · ma-var-octreotido',
        enunciado: 'Plan que deja un residente para un cirrótico con hematemesis. Hay 0, 1 o 2 errores: encuéntralos.',
        frases: [
          { t: 'Endoscopia en las primeras 12 h, para identificar el origen y clipar o ligar la variz.' },
          { t: 'Octreótido 50 µg en bolo y 50 µg/h durante 10-14 días.', mal: true, c: 'La tabla pide <span class="hl">2-5 días</span>.' },
          { t: 'Ceftriaxona con la primera dosis antes de la endoscopia.' },
          { t: 'Si sigue sangrando en el 20 % refractario, TIPS: alivia la hipertensión portal y no tiene más precio que el procedimiento.', mal: true, c: 'Al saltarse el hígado <span class="hl-rojo">aumenta el riesgo de encefalopatía</span>.' }] },
      { id: 'var-e6', corto: 'la endoscopia', tipo: 'test', fuente: 'ma-var-endoscopia · ma-tabla-39-3',
        enunciado: '¿Para qué sirve la endoscopia en las primeras 12 h, además de buscar la variz?',
        opciones: [
          { t: 'Identifica el origen, que tiene valor pronóstico, y permite clipar o ligar la variz', ok: true },
          { t: 'Solo diagnostica; el tratamiento es el octreótido', porque: 'La endoscopia también trata: clips o ligadura de la variz. Esperar al octreótido para cortar el sangrado deja la fuente abierta.' },
          { t: 'Se hace tras 48 h, para que el paciente esté estable antes de someterlo a un procedimiento', porque: 'La tabla pide las primeras 12 h. Esperar dos días con un vaso sangrante es arriesgar el 20 % refractario sin haberlo intentado.' }],
        explicacion: 'Control de la fuente en <span class="hl">≤12 h</span>: identifica el origen (valor pronóstico) y permite poner clips o ligar el vaso. Puede hacer falta intubar si hay alteración mental.' },
    ],
    casos: [
      { id: 'var-c1', titulo: 'Hilario, 58 años: la hematemesis', corto: 'Caso · Hilario', sub: 'cirrótico alcohólico con hematemesis; 70 kg',
        paciente: { Edad: '58 años', Peso: '70 kg', Motivo: 'Hematemesis en cirrosis alcohólica' },
        pasos: [
          { momento: 'Día 0 · 03:10', datos: { Constantes: 'PA 85/50 (PAM ≈62), FC 118', Analítica: 'Hb 6,8 g/dL; albúmina 2,4 g/dL; INR 2,1' }, nuevo: ['Constantes', 'Analítica'],
            pregunta: { id: 'var-c1-1', tipo: 'test', fuente: 'ma-tabla-39-3 · ma-var-diferencias', modeloVivo: [hv('hilario', '🏭 Hilario en el hepatocito vivo'), sv('hemo-iii', '🫀 El shock hemorrágico (clase III)')],
              enunciado: 'Vomita sangre. Antes de la endoscopia en ≤12 h, ¿qué pides?',
              opciones: [
                { t: 'Albúmina 5 %, 1:1:1 hasta Hb 7, octreótido 50 µg + 50 µg/h y ceftriaxona antes de la endoscopia', ok: true },
                { t: 'Ringer lactato hasta PAM 65 y plasma hasta un INR <1,5 antes de pasar a la endoscopia', porque: 'El Ringer lactato suma riesgo de edema cerebral y el INR no mide el sangrado del cirrótico: más volumen sin proteínas y plasma sin base.' },
                { t: 'Sangre y octreótido; el antibiótico, tras la endoscopia', porque: 'La primera dosis de ceftriaxona va antes de la endoscopia: retrasarla deja descubierto a un cirrótico que puede infectarse.' }],
              explicacion: 'Tabla 39.3: <span class="hl">albúmina 5 % si <3 g/dL</span>, 1:1:1, Hb objetivo 7 g/dL, octreótido 50 µg en bolo y 50 µg/h, ceftriaxona con la primera dosis antes de la endoscopia. Sin hipotónicos y con la hemostasia guiada por tromboelastografía.',
              nota: NOTA_CEFTRIAXONA } },
          { momento: 'Día 0 · 05:00', datos: { Plan: 'Nota del residente que lo ve antes de pasar a la endoscopia' }, nuevo: ['Plan'],
            pregunta: { id: 'var-c1-2', tipo: 'error', fuente: 'ma-tabla-39-3',
              enunciado: 'Resumen de objetivos del residente. Hay 0, 1 o 2 errores: encuéntralos.',
              frases: [
                { t: 'Objetivo de PAM 65 mmHg.' },
                { t: 'Transfundir hasta una Hb de 9 g/dL, con hematíes, plasma y plaquetas 1:1:1.', mal: true, c: 'La Hb objetivo es de <span class="hl">7 g/dL</span>.' },
                { t: 'Endoscopia en las primeras 12 h.' },
                { t: 'Hemostasia guiada por tromboelastografía.' }] } },
          { momento: 'Día 0 · 06:00', datos: { Familia: 'Pregunta por qué le ponen un antibiótico y un fármaco «para la tensión» si no tiene infección' }, nuevo: ['Familia'],
            pregunta: { id: 'var-c1-3', tipo: 'destapa', cuantas: 'son dos cosas', fuente: 'ma-var-octreotido · ma-tabla-39-3',
              enunciado: 'El adjunto te pide que expliques las dos pautas a la familia: qué hace cada una y cuánto dura.',
              puntos: [
                'La ceftriaxona es <span class="hl">profilaxis</span>: primera dosis antes de la endoscopia, durante 5-7 días (1 g/día en la tabla; 2 g/día en el texto).',
                'El octreótido es un <span class="hl-azul">vasoconstrictor esplácnico</span>: 50 µg en bolo y 50 µg/h durante 2-5 días.'],
              explicacion: 'El octreótido es un análogo de la somatostatina y se empieza lo antes posible, igual que la profilaxis antibiótica.',
              nota: NOTA_CEFTRIAXONA } },
          { momento: 'Día 0 · 12:10', datos: { Endoscopia: 'Ligadura de la variz', Clínica: 'Atención corta y cambio de carácter (West Haven 1)' }, nuevo: ['Endoscopia', 'Clínica'],
            pregunta: { id: 'var-c1-4', tipo: 'test', fuente: 'ma-var-endoscopia · ma-var-octreotido',
              enunciado: 'La ligadura se hizo a las 9 h del ingreso. ¿Qué tenía de valioso, además del tratamiento?',
              opciones: [
                { t: 'Identificó el origen del sangrado, que tiene valor pronóstico', ok: true },
                { t: 'Permite suspender el octreótido ese mismo día, porque ya no hay vaso sangrante', porque: 'La tabla pide octreótido durante 2-5 días, no hasta la ligadura. Suspenderlo ya expone a un resangrado.' },
                { t: 'Evita la intubación en todos los casos, aunque haya alteración mental', porque: 'Puede hacer falta intubar si hay alteración mental; la endoscopia no lo evita.' }],
              explicacion: 'La endoscopia identifica el origen (<span class="hl">valor pronóstico</span>) y permite clipar o ligar el vaso. La ligadura de las 9 h cumple el límite de 12 h.',
              origen: 'ficha; la hora, del caso' } },
          { momento: 'Día 2 · resangra', datos: { Evolución: 'Resangra pese al tratamiento óptimo (el 20 % refractario)' }, nuevo: ['Evolución'],
            pregunta: { id: 'var-c1-5', tipo: 'test', fuente: 'ma-var-tips', modeloVivo: hv('hilario:tips', '🏭 Hilario con TIPS: el amonio sube'), origen: 'ficha; la cifra, del modelo',
              enunciado: 'Es una hemorragia refractaria. ¿Qué haces y qué precio tiene?',
              opciones: [
                { t: 'TIPS: alivia la hipertensión portal, pero aumenta la encefalopatía', ok: true },
                { t: 'Segunda ligadura y doblar el octreótido hasta que el sangrado ceda', porque: 'Es insistir en lo que ya falló. El libro, ante la refractaria, considera el TIPS; doblar el octreótido no está en la tabla.' },
                { t: 'TIPS, que no tiene más riesgo porque es un procedimiento no invasivo', porque: '«Noninvasive» es la errata de la fuente: es mínimamente invasivo, y el riesgo que el libro destaca es la encefalopatía, en un paciente que ya tiene grado 1.' }],
              explicacion: 'Hemorragia refractaria (≈20 %): <span class="hl">TIPS</span>, que cambia un problema por otro: la sangre de la porta se salta el hígado y aumenta el riesgo de encefalopatía. Hilario ya está en West Haven 1.' } },
        ],
        lleva: [
          'Se reanima como un shock hemorrágico, pero con albúmina, sin hipotónicos y sin fiarse del INR.',
          'Endoscopia en ≤12 h, octreótido 2-5 días y ceftriaxona antes de la endoscopia (1 g en la tabla, 2 g en el texto).',
          'En el 20 % refractario el TIPS salva el sangrado, pero salta el hígado y sube la encefalopatía.'],
        volver: { nombre: 'Hemorragia refractaria y TIPS', ancla: 'ma-var-tips', modeloVivo: hv('hilario:tips', '🏭 Hilario con TIPS en el hepatocito vivo') } },
    ],
    profundizar: [
      { id: 'ma-var-endoscopia', titulo: 'Endoscopia: origen, clips frente a ligadura e intubación' },
      { id: 'mar-img-39-3', titulo: 'Figura 39.3 — varices esofágicas en la endoscopia' },
    ],
  },

  /* =================================================================================================
     Ficha 4 · Peritonitis bacteriana espontánea y síndrome hepatorrenal (cap. 39, págs. 10-13) · Caso de Hilario
     ================================================================================================= */
  'ma-pbe-shr': {
    entrada: 'Por qué un hígado cirrótico deja pasar gérmenes a la ascitis, qué recuento decide el antibiótico, cuánta albúmina, y cómo el riñón del cirrótico queda «prerrenal sin estar seco».',
    guia: [
      { id: 'pbe-g1', corto: 'por qué hay PBE', tipo: 'test', fuente: 'ma-pbe-def',
        enunciado: 'La peritonitis bacteriana espontánea solo aparece con cirrosis y ascitis. ¿Qué dos cosas se juntan para que ocurra?',
        opciones: [
          { t: 'Los gérmenes del intestino cruzan la pared («traslocación») y el hígado cirrótico ya no los elimina', ok: true },
          { t: 'Una perforación pequeña del intestino que infecta la ascitis', porque: 'La PBE es, por definición, una infección sin foco primario abdominal. Si buscas una perforación, ordenarás cirugía y TC a un paciente que necesita una paracentesis.' },
          { t: 'Un catéter o una paracentesis previa que siembra el líquido', porque: 'No es el origen del libro: el germen viene del intestino. Culpar a la paracentesis te lleva a retrasarla, y es la prueba que diagnostica.' }],
        explicacion: 'La PBE es la infección del líquido ascítico <span class="hl-purpura">sin foco primario abdominal</span>, por traslocación de gérmenes entéricos. Solo ocurre con cirrosis y ascitis porque <span class="hl-azul">la cirrosis deja sin función al hígado como filtro</span> de los microbios que atraviesan la pared.' + ` (${pag(10, 'pág. 10')})` },
      { id: 'pbe-g2', corto: '180 neutrófilos', tipo: 'test', fuente: 'ma-pbe-dx',
        enunciado: 'Un cirrótico con ascitis tiene dolor abdominal. La paracentesis da 180 neutrófilos/mm³ y el cultivo es positivo. ¿Es PBE?',
        opciones: [
          { t: 'No basta: cultivo positivo sin >250 neutrófilos no confirma PBE; repetir la paracentesis', ok: true },
          { t: 'Sí: un cultivo positivo asegura el diagnóstico', porque: 'Marino lo niega: sin el recuento requerido, un cultivo positivo no es suficiente. Tratarla sin criterio expone a un antibiótico largo (≥7 días) que quizá no haga falta.' },
          { t: 'No: hay que esperar 48 h al cultivo definitivo antes de decidir si se trata la ascitis o no', porque: 'Lo contrario también falla: con >250 neutrófilos se trata sin esperar el cultivo. Esperar 48 h una PBE real es perder el momento del antibiótico.' }],
        explicacion: '<span class="hl-azul">>250 neutrófilos/mm³ en la ascitis aseguran el diagnóstico, sea cual sea el cultivo</span> (positivo en ≈60 %). Un cultivo positivo sin ese recuento no basta: repetir la paracentesis.' + ` (${pag(10, 'pág. 10')})` },
      { id: 'pbe-g3', corto: 'nosocomial', tipo: 'test', fuente: 'ma-pbe-resistentes · ma-pbe-abx · ma-pbe-calc · mar-img-39-4', calculadora: { ir: 'ma-pbe-calc', nombre: 'Antibiótico empírico de la PBE (Figura 39.4)' },
        enunciado: 'Hilario lleva 72 h ingresado por sus varices. Hoy: fiebre, dolor y 610 neutrófilos/mm³ en la ascitis. ¿Qué tipo de PBE es y qué le pones sin esperar el cultivo?',
        opciones: [
          { t: 'Nosocomial (tras 48 h de ingreso): resistentes posibles, así que meropenem 1 g cada 8 h', ok: true },
          { t: 'Comunitaria: ceftriaxona, la misma que ya lleva por las varices, la recomendada en la comunitaria', porque: 'Es la recomendada en la comunitaria (pág. 10), pero la que lleva es profilaxis, y una infección a las 72 h de ingreso es nosocomial, donde típicamente se aíslan resistentes. Con ceftriaxona quedaría sin cubrir.' },
          { t: 'Asociada a cuidados: esperar el cultivo antes de decidir', porque: 'Asociada a cuidados es la que aparece en las primeras 48 h con contacto sanitario previo. Y con >250 neutrófilos el antibiótico no espera al cultivo.' }],
        explicacion: '<span class="hl">Nosocomial = aparece tras 48 h de ingreso</span>; resistentes típicos → carbapenémico (p. ej. meropenem 1 g/8 h), con vancomicina si puede haber SARM o daptomicina si se sospecha enterococo resistente a vancomicina. Con sospecha menor, piperacilina-tazobactam (Fig. 39.4).' + ` (${pag(11, 'pág. 11')})` },
      { id: 'pbe-g4', corto: 'respuesta a 48 h', tipo: 'test', fuente: 'ma-pbe-abx · ma-pmn-calc', calculadora: { ir: 'ma-pmn-calc', nombre: 'Neutrófilos en ascitis: diagnóstico y respuesta' },
        enunciado: 'Hilario tenía 610 neutrófilos/mm³; a las 48 h de meropenem, 400. ¿Responde? (Usa la calculadora si quieres.)',
        opciones: [
          { t: 'Sí: baja un 34 %, más del 25 % exigido', ok: true },
          { t: 'No: siguen por encima de 250, el umbral que define el diagnóstico', porque: 'El criterio no es volver a <250, sino bajar al menos el 25 %. Cambiar el antibiótico a un paciente que responde sería exponerlo a más toxicidad sin motivo.' },
          { t: 'No: hasta que bajen un 50 % no se considera respuesta favorable', porque: 'El libro define la respuesta favorable como una caída ≥25 %. Con el 50 % esperarías de más y quizá cambiarías el tratamiento de un paciente que mejora.' }],
        explicacion: 'Paracentesis a las <span class="hl">48 h</span>: respuesta favorable si los neutrófilos bajan <span class="hl-verde">≥25 %</span>. De 610 a 400 es una bajada del 34 %. El antibiótico se mantiene al menos 7 días, sea cual sea el cultivo.' + ` (${pag(11, 'pág. 11')})`,
        origen: 'ficha; la cuenta, ilustrativa' },
      { id: 'pbe-g5', corto: 'albúmina en la PBE', tipo: 'destapa', cuantas: 'son dos cosas', fuente: 'ma-pbe-albumina · ma-alb-calc', calculadora: { ir: 'ma-alb-calc', nombre: 'Albúmina en la PBE' },
        enunciado: 'Además del antibiótico, ¿por qué se da albúmina en la PBE y cuánta le pones a Hilario, de 70 kg?',
        puntos: [
          'El porqué: <span class="hl-verde">mejora la supervivencia</span>, y el beneficio es <span class="hl">independiente de la creatinina</span> (se había atribuido a proteger el riñón).',
          'La pauta: <span class="hl">1,5 g/kg el día 1 y 1 g/kg el día 3</span>, con albúmina al 25 % para limitar el volumen.'],
        explicacion: 'Para Hilario: 1,5 × 70 = 105 g el día 1 (≈420 mL al 25 %) y 70 g el día 3 (≈280 mL).' + ` (${pag(11, 'pág. 11')})`,
        origen: 'ficha; cuenta con 70 kg' },
      { id: 'pbe-g6', corto: 'riñón a merced', tipo: 'test', fuente: 'ma-shr-fisio', modeloVivo: [glomerulo('🫘 La arteriola contraída por renina (el glomérulo, en depleción de volumen: el modelo no tiene síndrome hepatorrenal)'), { capilarVivo: 'sepsis', texto: '🧫 La sepsis aumenta la vasodilatación' }],
        enunciado: 'En el cirrótico el riñón está sano, pero se vuelve «vulnerable a pequeñas caídas del gasto cardíaco». ¿Qué cadena lo explica?',
        opciones: [
          { t: 'Vasodilatación esplácnica → respuesta neurohumoral (renina) → vasoconstricción renal', ok: true },
          { t: 'Cirrosis → depósito de proteína en el glomérulo → daño estructural', porque: 'Eso sería enfermedad renal intrínseca; el SHR es por definición un fracaso funcional, sin lesión del riñón. Buscar daño estructural te hace pedir pruebas que no cambian el tratamiento.' },
          { t: 'Hipovolemia franca por ascitis → riñón seco como en la deshidratación → falta de volumen circulante', porque: 'El mecanismo del libro no es la falta de volumen sino la vasodilatación del territorio esplácnico. Aumentar la diuresis o deplecionar más empeoraría el riñón.' }],
        explicacion: 'La cirrosis dilata el lecho esplácnico; la <span class="hl-azul">respuesta neurohumoral (renina) contrae otros territorios, incluido el riñón</span>, que queda a merced de pequeñas caídas del gasto. La sepsis aumenta la vasodilatación: el SHR es más frecuente con sepsis.' + ` (${pag(12, 'pág. 12')})`,
        nota: 'El glomérulo vivo no tiene un estado de síndrome hepatorrenal: «depleción de volumen» enseña la arteriola aferente y la eferente contraídas por renina, que es la parte del mecanismo que se parece. Es una aproximación.' },
      { id: 'pbe-g7', corto: 'Na⁺ urinario bajo', tipo: 'test', fuente: 'ma-shr-fisio', modeloVivo: nefrona('prerrenal', '💧 La nefrona en estado prerrenal (el SHR comparte sus índices; no tiene estado propio)'), origen: 'ficha; el Na⁺ urinario, del caso',
        enunciado: 'La creatinina de Hilario pasa de 0,9 a 1,6 mg/dL en 48 h. ¿Sodio urinario alto o bajo? Piénsalo y mira la nefrona: ¿qué te dicen los índices urinarios en el cirrótico?',
        opciones: [
          { t: 'Son «prerrenales» (sodio bajo, osmolaridad alta): orientan a un fracaso funcional, no a necrosis tubular', ok: true },
          { t: 'Descartan el síndrome hepatorrenal: ese cursa con sodio urinario alto', porque: 'Al revés: en el SHR los índices son prerrenales. Descartarlo por esa cifra lo deja sin vasoconstrictor.' },
          { t: 'Confirman necrosis tubular aguda y la indicación de diálisis', porque: 'Los índices prerrenales distinguen el SHR de la necrosis tubular, no la confirman. Dializar sin más es tratar de más a un riñón que puede recuperar con albúmina y vasoconstricción.' }],
        explicacion: 'Los índices urinarios del SHR son «prerrenales» (<span class="hl">sodio bajo y osmolaridad alta</span>) y <span class="hl-purpura">podrían diferenciarlo de la necrosis tubular aguda</span>. Es un fracaso funcional, sin enfermedad renal intrínseca. En el caso, el Na⁺ urinario es de 8 mEq/L.' + ` (${pag(12, 'pág. 12')})` },
      { id: 'pbe-g8', corto: 'la prueba que falta', tipo: 'test', fuente: 'ma-tabla-39-4 · ma-shr-calc', calculadora: { ir: 'ma-shr-calc', nombre: '¿Cumple los criterios de SHR?' },
        enunciado: 'Hilario cumple «creatinina +0,3 mg/dL en 48 h» y no tiene shock ni nefrotóxicos. ¿Qué prueba falta antes de llamarlo síndrome hepatorrenal?',
        opciones: [
          { t: 'Que no responda a retirar diuréticos y a 2 días de albúmina', ok: true },
          { t: 'Que la creatinina pase de 3 mg/dL', porque: 'La tabla no pone ese corte: pone +0,3 en 48 h o ≥1,5 veces la basal. Esperar a 3 es dejar progresar un fracaso renal que ya se podía tratar.' },
          { t: 'Una biopsia renal que confirme que no hay lesión estructural en el riñón del paciente', porque: 'El libro excluye el daño estructural con proteinuria, hematuria y ecografía, no con biopsia. Ninguna de las pruebas del criterio 5 es una biopsia: pedirla es salirse de la tabla.' }],
        explicacion: 'Criterio 3 de la Tabla 39.4: <span class="hl">sin respuesta a la retirada de diuréticos y a 2 días de albúmina (1 g/kg/día)</span>. Además: cirrosis con ascitis, sin shock ni nefrotóxicos y sin signos de daño estructural.' + ` (${pag(12, 'pág. 12')})` },
    ],
    examen: [
      { id: 'pbe-e1', corto: 'terlipresina', tipo: 'test', fuente: 'ma-shr-tto',
        enunciado: '¿Qué ha demostrado la terlipresina en el síndrome hepatorrenal, según los estudios que cita Marino?',
        opciones: [
          { t: 'Mejora la función renal, no la supervivencia ni el trasplante', ok: true },
          { t: 'Mejora la supervivencia y evita el trasplante en la mayoría de los casos', porque: 'El libro lo niega. Prometer al paciente o a la familia que la terlipresina evita el trasplante es crear una expectativa falsa; la consulta a trasplante se hace en todo SHR.' },
          { t: 'No mejora la función renal; se usa solo por su efecto en el sangrado', porque: 'Los estudios muestran mejoría renal, y es el fármaco de elección. Descartarla por no mejorar el riñón deja al paciente con alternativas de menor respaldo (midodrina + octreótido es inferior).' }],
        explicacion: 'Terlipresina, análogo sintético de la vasopresina y vasoconstrictor esplácnico: <span class="hl-verde">mejora la función renal</span>, pero <span class="hl-rojo">no la supervivencia ni reduce la necesidad de trasplante</span>. Efectos adversos: dolor abdominal, diarrea, edema pulmonar (hidrostático) e isquemia.' + ` (${pag(13, 'pág. 13')})` },
      { id: 'pbe-e2', corto: 'alternativas', tipo: 'test', fuente: 'ma-tabla-39-4 · ma-shr-tto',
        enunciado: 'No hay terlipresina en el hospital. ¿Qué alternativa a la terlipresina tiene respaldo en el libro?',
        opciones: [
          { t: 'Noradrenalina 5-40 µg/min, equivalente en ensayos', ok: true },
          { t: 'Midodrina + octreótido, que es la superior', porque: 'Marino la presenta como inferior a la terlipresina, y reservada para donde esta no existe. Elegirla primero es tratar con la opción menos eficaz.' },
          { t: 'Noradrenalina 5-40 mg/min, equivalente a la terlipresina', porque: 'La unidad es µg/min, no mg: con mg/min la dosis sería mil veces mayor y no es lo que dice la tabla.' }],
        explicacion: '<span class="hl">Noradrenalina 5-40 µg/min</span> en perfusión continua, equivalente a la terlipresina en los ensayos (poca experiencia). <span class="hl-rojo">Octreótido 100-200 µg SC + midodrina 7,5-15 mg VO, 3 veces al día</span>, es inferior y queda para donde no hay terlipresina.' + ` (${pag(12, 'pág. 12')})` },
      { id: 'pbe-e3', corto: 'excluye el SHR', tipo: 'test', fuente: 'ma-tabla-39-4',
        enunciado: 'Una cirrótica con ascitis tiene creatinina de 1,9 mg/dL tras la albúmina. ¿Cuál de estos datos descarta el síndrome hepatorrenal?',
        opciones: [
          { t: 'Hematuria de 60 hematíes por campo', ok: true },
          { t: 'Sodio urinario bajo y osmolaridad alta', porque: 'Esos son justo los índices prerrenales que acompañan al SHR. Usarlos para descartarlo deja sin tratar un SHR real.' },
          { t: 'Creatinina que duplica la basal en 48 h', porque: 'Eso cumple el criterio de lesión aguda (≥1,5 veces la basal o +0,3). Descartar por ahí es no ver el fracaso renal que hay.' }],
        explicacion: 'Descartan el SHR los <span class="hl-rojo">signos de daño estructural</span>: proteinuria >500 mg/día, hematuria >50 hematíes por campo o ecografía renal anormal (Tabla 39.4, criterio 5).',
        nota: '<b>Las fuentes discrepan.</b> La ficha de FRA de Nefrología recoge «proteinuria >500 mg/dl» y una nota que sospechaba errata; Marino escribe mg/día (' + pag(12, 'pág. 12') + ').' + enFicha(P, 'ma-tabla-39-4') },
      { id: 'pbe-e4', corto: 'PIA 12 cmH₂O', tipo: 'test', fuente: 'ma-shr-pia',
        enunciado: 'Un cirrótico con ascitis a tensión y síndrome hepatorrenal tiene una presión intraabdominal de 18 cmH₂O. ¿Qué indica Marino?',
        opciones: [
          { t: 'Paracentesis evacuadora (≥4 L) y vigilar la hemodinámica', ok: true },
          { t: 'Nada: el umbral es 12 mmHg, y 18 cmH₂O no lo supera, así que se sigue con la terlipresina', porque: '18 cmH₂O son ≈13 mmHg: supera 12 con las dos lecturas, la del cap. 39 (>12 cmH₂O) y la del cap. 34 (≥12 mmHg). Ignorarla deja sin evacuar una ascitis a tensión que puede estar contribuyendo al fracaso renal.' },
          { t: 'Evacuar 8-10 L de golpe y reponer con salino', porque: 'El libro habla de evacuar ≥4 L y de vigilar con cuidado la hemodinámica después, para evitar el compromiso hemodinámico; no propone una cifra mayor.' }],
        explicacion: 'La presión intraabdominal es una <span class="hl-rojo">causa olvidada de fracaso renal</span>: se mide en el SHR con ascitis a tensión y se evacua (≥4 L) si supera <span class="hl">12 cmH₂O</span>, con monitorización hemodinámica después.',
        nota: '<b>Las fuentes discrepan.</b> En el cap. 34 la hipertensión intraabdominal se define en mmHg (≥12 mmHg); aquí el umbral es 12 cmH₂O (12 mmHg ≈ 16 cmH₂O): 18 cmH₂O supera el umbral con cualquiera de las dos. El libro no lo concilia.' + enFicha(P, 'ma-shr-pia') },
      { id: 'pbe-e5', corto: 'el plan de la PBE', tipo: 'error', fuente: 'ma-pbe-dx · ma-pbe-abx · ma-pbe-albumina',
        enunciado: 'Plan que deja un residente para un cirrótico con ascitis y fiebre. Hay 0, 1 o 2 errores: encuéntralos.',
        frases: [
          { t: 'Paracentesis diagnóstica y siembra del líquido en frascos de hemocultivo, junto a la cama.' },
          { t: 'Con 400 neutrófilos/mm³, espero el cultivo para empezar el antibiótico.', mal: true, c: 'Con >250 neutrófilos el antibiótico <span class="hl">empieza antes de tener el cultivo</span>.' },
          { t: 'Al menos 7 días de tratamiento, sea cual sea el cultivo.' },
          { t: 'Albúmina 1,5 g/kg el día 1 y 1 g/kg el día 3.' }] },
      { id: 'pbe-e6', corto: 'resistentes', tipo: 'test', fuente: 'ma-pbe-epi · ma-pbe-dx',
        enunciado: '¿Cuál de estas afirmaciones sobre la PBE coincide con el libro?',
        opciones: [
          { t: 'Resistentes en el 35 % mundial y el 16 % de EE. UU.; asintomática en un tercio', ok: true },
          { t: 'Resistentes en el 16 % mundial y el 35 % de EE. UU.; siempre con fiebre', porque: 'Las cifras están cambiadas y la PBE puede ser asintomática en un tercio. Esperar fiebre retrasa la paracentesis en uno de cada tres pacientes.' },
          { t: 'Casi siempre varios gérmenes grampositivos; sin resistentes si es comunitaria o asociada a cuidados', porque: 'Casi siempre es un solo germen, sobre todo gramnegativos (E. coli, Klebsiella); los resistentes son improbables en la comunitaria, pero no es un grampositivo múltiple.' }],
        explicacion: 'Un solo germen en la mayoría, <span class="hl">gramnegativos</span> (E. coli, K. pneumoniae). Resistentes en el <span class="hl-rojo">35 % en el mundo y el 16 % en EE. UU.</span>; ≈50 % comunitaria, 25 % asociada a cuidados y 25 % nosocomial. Asintomática en un tercio.' + ` (${pag(10, 'pág. 10')})` },
    ],
    casos: [
      { id: 'pbe-c2', titulo: 'Hilario, 58 años: la infección y el riñón tras el TIPS', corto: 'Caso · Hilario', sub: 'cirrótico alcohólico, 70 kg, día 3 de ingreso',
        paciente: { Edad: '58 años', Peso: '70 kg', Motivo: 'Cirrosis alcohólica con hematemesis; TIPS el día 2' },
        pasos: [
          { momento: 'Día 3 · 72 h de ingreso', datos: { Clínica: 'T 38,4 °C, dolor abdominal, no sabe el día (West Haven 2)', Ascitis: '610 neutrófilos/mm³; cultivo pendiente' }, nuevo: ['Clínica', 'Ascitis'], calculadora: { ir: 'ma-pbe-calc', nombre: 'Antibiótico empírico de la PBE (Figura 39.4)' },
            pregunta: { id: 'pbe-c2-3', tipo: 'test', fuente: 'ma-pbe-dx · ma-pbe-resistentes',
              enunciado: 'Clasifica la PBE y decide el antibiótico.',
              opciones: [
                { t: 'Nosocomial (tras 48 h de ingreso): meropenem 1 g/8 h ya, sin esperar el cultivo', ok: true },
                { t: 'Seguir con la ceftriaxona que ya lleva, que cubre la PBE', porque: 'La ceftriaxona de las varices es profilaxis; en la nosocomial se aíslan típicamente resistentes y quedaría sin cubrir.' },
                { t: 'Esperar el cultivo, porque 610 neutrófilos no bastan sin germen', porque: 'Los >250 neutrófilos aseguran el diagnóstico sea cual sea el cultivo. Esperar días con 38,4 °C es dejar progresar una infección de la ascitis.' }],
              explicacion: '<span class="hl-azul">>250 neutrófilos/mm³</span> = antibiótico sin esperar al cultivo. Nosocomial → resistentes posibles → carbapenémico (meropenem 1 g/8 h), con vancomicina si hay riesgo de SARM.' } },
          { momento: 'Día 3 · albúmina', datos: { Plan: 'Albúmina al 25 % para la PBE' }, nuevo: ['Plan'], calculadora: { ir: 'ma-alb-calc', nombre: 'Albúmina en la PBE' },
            pregunta: { id: 'pbe-c2-3b', tipo: 'test', fuente: 'ma-pbe-albumina · ma-alb-calc', origen: 'ficha; cuenta con 70 kg',
              enunciado: '¿Cuánta albúmina hoy y qué hay que programar?',
              opciones: [
                { t: '105 g hoy (1,5 g/kg, ≈420 mL al 25 %) y 70 g el día 3 del tratamiento (1 g/kg)', ok: true },
                { t: '70 g hoy y 105 g el día 3', porque: 'Las dosis están cambiadas: 1,5 g/kg va primero. Se quedaría corto el día 1 con la dosis más importante.' },
                { t: '105 g hoy y ya está, porque solo mejora la función renal', porque: 'El beneficio en la supervivencia no depende de la creatinina y la pauta tiene una segunda dosis (1 g/kg el día 3).' }],
              explicacion: '<span class="hl">1,5 g/kg el día 1 (105 g) y 1 g/kg el día 3 (70 g)</span>, con albúmina al 25 % (25 g/100 mL) para limitar el volumen.' } },
          { momento: 'Día 5 · segunda paracentesis', datos: { Ascitis: '400 neutrófilos/mm³ a las 48 h' }, nuevo: ['Ascitis'], calculadora: { ir: 'ma-pmn-calc', nombre: 'Neutrófilos en ascitis: diagnóstico y respuesta' },
            pregunta: { id: 'pbe-c2-4', tipo: 'test', fuente: 'ma-pbe-abx · ma-pmn-calc', origen: 'ficha; la cuenta, ilustrativa',
              enunciado: '¿Responde al meropenem?',
              opciones: [
                { t: 'Sí: 610 → 400 es una bajada del 34 % (≥25 %); se completan ≥7 días', ok: true },
                { t: 'No: sigue por encima de 250; cambio empírico a vancomicina + daptomicina', porque: 'El criterio es una caída ≥25 %, no volver a <250. Cambiarlo añade toxicidad a quien ya responde.' },
                { t: 'Sí, pero se puede parar ya porque bajó más de la mitad', porque: 'Ni baja la mitad (34 %) ni el libro permite parar: se continúa al menos 7 días, sea cual sea el cultivo.' }],
              explicacion: 'Respuesta favorable: <span class="hl-verde">≥25 % de caída</span> en la paracentesis a las 48 h. 610 → 400 son 210 menos: 34 %. Antibiótico ≥7 días.' } },
          { momento: 'Día 6 · el riñón', datos: { Constantes: 'PA 98/60 sin vasopresor', Analítica: 'creatinina 0,9 → 1,6 mg/dL en 48 h; Na⁺ urinario 8 mEq/L', Otros: 'sedimento sin hematíes ni proteinuria; ecografía renal normal' }, nuevo: ['Constantes', 'Analítica', 'Otros'], calculadora: { ir: 'ma-shr-calc', nombre: '¿Cumple los criterios de SHR?' },
            pregunta: { id: 'pbe-c2-5', tipo: 'destapa', cuantas: 'son tres cosas', fuente: 'ma-tabla-39-4 · ma-shr-fisio', modeloVivo: [nefrona('prerrenal', '💧 La nefrona en estado prerrenal'), glomerulo('🫘 La arteriola contraída por renina (glomérulo en depleción)')],
              enunciado: '¿Es ya un síndrome hepatorrenal? ¿Qué le falta y qué haces los 2 días siguientes?',
              puntos: [
                'Cumple: <span class="hl">+0,3 mg/dL en 48 h</span>, sin shock ni nefrotóxicos y sin signos de daño estructural (sin proteinuria ni hematuria, ecografía normal).',
                'Falta: <span class="hl-rojo">retirar los diuréticos y 2 días de albúmina 1 g/kg/día</span> (70 g/día) sin respuesta.',
                'Por qué parece prerrenal sin estar seco: la <span class="hl-azul">vasodilatación esplácnica activa la renina</span> y contrae el riñón; los índices (sodio bajo, osmolaridad alta) son prerrenales.'],
              explicacion: 'Sin ese ensayo con albúmina no se puede llamar SHR; si la creatinina no baja, entonces se pauta el tratamiento de la Tabla 39.4.',
              nota: 'La nefrona viva y el glomérulo vivo no tienen un estado de síndrome hepatorrenal: «prerrenal» y «depleción de volumen» son los estados vecinos y enseñan el sodio bajo y la arteriola contraída, no la vasodilatación esplácnica.' } },
          { momento: 'Día 8 · la nota del R1', datos: { Analítica: 'creatinina 1,7 mg/dL tras 2 días de albúmina' }, nuevo: ['Analítica'],
            pregunta: { id: 'pbe-c2-6', tipo: 'error', fuente: 'ma-tabla-39-4 · ma-shr-tto',
              enunciado: 'El R1 de guardia deja esta nota. Hay 0, 1 o 2 errores: encuéntralos.',
              frases: [
                { t: 'Creatinina 1,7 pese a 2 días de albúmina: síndrome hepatorrenal.' },
                { t: 'Albúmina al 25 %, 20-40 g al día.' },
                { t: 'Terlipresina 1 mg cada 4-6 h, que mejora la función renal y la supervivencia.', mal: true, c: 'Mejora la función renal, pero <span class="hl-rojo">no la supervivencia ni la necesidad de trasplante</span>.' },
                { t: 'Si no hay terlipresina, noradrenalina 5-40 µg/min.' },
                { t: 'Aviso a trasplante hepático.' }] } },
          { momento: 'Día 10 · el giro', datos: { Clínica: 'Ascitis refractaria a tensión pese al TIPS; diuresis 0,2 mL/kg/h con terlipresina', Medida: 'presión intraabdominal 18 cmH₂O' }, nuevo: ['Clínica', 'Medida'],
            pregunta: { id: 'pbe-c2-7', tipo: 'test', fuente: 'ma-shr-pia', modeloVivo: glomerulo('🫘 El glomérulo vivo (la presión intraabdominal no está en el modelo)'),
              enunciado: 'La oliguria persiste con terlipresina y el abdomen está a tensión. ¿Qué cambia?',
              opciones: [
                { t: 'Paracentesis evacuadora (≥4 L): la presión supera 12 cmH₂O; después, vigilar la hemodinámica', ok: true },
                { t: 'Subir la terlipresina a 2 mg cada 4 h', porque: 'Esa dosis no está en el libro (1 mg cada 4-6 h o 84 µg/h) y no trata la causa que falta, la presión abdominal.' },
                { t: 'Añadir furosemida, porque hay ascitis a tensión y así se saca líquido sin pinchar al paciente', porque: 'Los diuréticos se retiran para el diagnóstico de SHR; la tabla pide retirarlos para llamarlo SHR; volver a darlos contradice el criterio 3.' }],
              explicacion: 'La presión intraabdominal es una causa olvidada de fracaso renal que quizá contribuya al SHR. La evacuación de <span class="hl">≥4 L</span> mejoró la función renal en la ascitis a tensión con SHR; con vigilancia hemodinámica después.',
              nota: '<b>Las fuentes discrepan.</b> Umbral en cmH₂O (>12, cap. 39) frente a mmHg (≥12, cap. 34): 12 mmHg ≈ 16 cmH₂O. Con 18 cmH₂O (≈13 mmHg) las dos lecturas coinciden.' + enFicha(P, 'ma-shr-pia') } },
        ],
        lleva: [
          'Albúmina en la PBE: 1,5 g/kg el día 1 y 1 g/kg el día 3, al 25 %.',
          '>250 neutrófilos y las 48 h de ingreso deciden el antibiótico; la respuesta se mide a las 48 h con una caída ≥25 %.',
          'El SHR parece prerrenal sin estar seco: se diagnostica tras retirar diuréticos y 2 días de albúmina, y la presión intraabdominal cuenta.'],
        volver: { nombre: 'Por qué el riñón del cirrótico', ancla: 'ma-shr-fisio', modeloVivo: nefrona('prerrenal', '💧 La nefrona en estado prerrenal') } },
    ],
    profundizar: [
      { id: 'ma-pbe-resistentes', titulo: 'Si caben resistentes: SARM, daptomicina para ERV y la piperacilina-tazobactam' },
      { id: 'ma-shr-def', titulo: 'Síndrome hepatorrenal: hasta el 50 % de los descompensados' },
      { id: 'mar-img-39-4', titulo: 'Figura 39.4 — algoritmo del antibiótico empírico de la PBE' },
      { id: 'ma-higado-final', titulo: 'El hígado como segunda línea de defensa' },
    ],
  },
};
