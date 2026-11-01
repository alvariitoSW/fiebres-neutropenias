// Mayéutica del bloque 3D, G5: fichas 17 neumo-nav-prevencion y 18 neumo-nav-diagnostico (Marino cap. 29, págs. 35-45 del
// PDF caps. 27-30). Formato: cabecera de b1-fluidos.js. Plan: autonomo/bloques/b3/estudio-3d/. Sin «Juega» ni «Compruébalo»:
// ningún modelo vivo enseña la NAV; la Mira (vista Visual) hace ese trabajo. Paciente de los casos: Casimiro (inventado).
// Las cifras de los casos que no salen de la ficha son del paciente inventado y así se rotulan.
const PDF = 'docs/marino-2024-respiratory-management-caps27-30.pdf';
const p = n => `<a class="biblio-link" href="${PDF}#page=${n}" target="_blank" rel="noopener">pág. ${n}</a>`;
const NEU = 'data-especialidad="neumologia" data-view="merinoNeumologia" data-panel="panel-merino-neumo-tabs"';
const enFicha = (tab, id) => ` <button type="button" class="may-ir" ${NEU} data-tab="${tab}" data-resaltar="#${id}">Ver en la ficha ↗</button>`;
const NP = 'neumo-nav-prevencion', ND = 'neumo-nav-diagnostico';
const ok = t => ({ t, ok: true });
const no = (t, porque) => ({ t, porque });
const pl = (clave, texto) => ({ pulmonVivo: clave, texto });
const FIC = 'ficha: Marino cap. 29';
const CASO = 'ficha: las categorías y cifras de la fuente; los datos del paciente, inventados';

const DATOS = {
  /* =================================================================================================
     Ficha 17 · NAV: generalidades y prevención (cap. 29, págs. 35-38) y el caso de Casimiro, días 1-6
     ================================================================================================= */
  [NP]: {
    entrada: 'La NAV nace de lo que se aspira desde la boca: la clorhexidina se asocia a más mortalidad, la SOD baja la neumonía del 31 al 10 % y el paquete del ventilador reúne cinco prácticas, aunque el autor dude de la cabecera.',
    guia: [
      { id: 'nvp-g1', corto: 'NAV y HAP', tipo: 'test', fuente: 'nep-definiciones-nav', origen: FIC,
        enunciado: 'Dos pacientes desarrollan una neumonía en la UCI: uno está intubado y el otro respira con gafas nasales. Antes de leer: ¿cómo se llama cada una y qué parte de las neumonías de UCI es la del intubado?',
        opciones: [
          ok('NAV la del intubado (≥48 h tras la intubación) y HAP la otra (≥48 h tras el ingreso); la NAV es el 80 %'),
          no('NAV las dos, si pasan de 48 h en la UCI sin importar el tubo; la mitad de las neumonías de la UCI son NAV', `La HAP es una categoría propia para el no intubado, con inicio ≥48 h tras el ingreso en UCI (${p(35)}); tratarlas igual haría buscar los gérmenes del respirador en quien no lo lleva.`),
          no('HAP las dos, y la NAV solo si el tubo lleva ≥5 días; la NAV es el 60 % de las neumonías', `La NAV empieza a las 48 h de intubar; los 5 días separan la precoz de la tardía, y el 60 % es la parte tardía de las NAV (${p(35)}).`)],
        explicacion: `<span class="hl-purpura">NAV: inicio ≥48 h tras la intubación; HAP: ≥48 h tras el ingreso en UCI sin intubar.</span> La NAV es el <span class="hl-azul">80 %</span> de las neumonías adquiridas en UCI (${p(35)}).` + enFicha(NP, 'nep-definiciones-nav') },
      { id: 'nvp-g2', corto: 'qué gérmenes', tipo: 'test', fuente: 'nep-nav-patogenos · nep-tabla-29-1', origen: FIC,
        enunciado: 'Antes de mirar la Tabla 29.1: ¿qué patógenos predominan en la NAV y en la HAP, y cuántas infecciones tienen más de un germen?',
        opciones: [
          no('Neumococo y estreptococos, grampositivos de la comunidad; más de la mitad con varios gérmenes a la vez', `No son los predominantes: la ficha da los entéricos gramnegativos y los estafilococos, y los polimicrobianos son el 21-26 % (${p(35)}-${p(36)}). Cubrirías la neumonía comunitaria y dejarías sin cubrir la de UCI.`),
          ok('Entéricos gramnegativos y estafilococos; cerca de una cuarta parte son polimicrobianas'),
          no('Hongos del tipo Candida y virus; la mayoría con un solo germen', `Candida no se conoce como causa de neumonía y los virus se implican en cerca del 20 % (${p(35)}); el protagonismo es de las bacterias.`)],
        explicacion: `Predominan los <span class="hl-azul">entéricos gramnegativos y los estafilococos</span>; cerca de una cuarta parte de las infecciones son polimicrobianas (${p(35)}; Tabla 29.1, ${p(36)}).` + enFicha(NP, 'nep-tabla-29-1') },
      { id: 'nvp-g3', corto: 'multirresistentes', tipo: 'test', fuente: 'nep-nav-multirresistentes', origen: FIC,
        enunciado: 'Los patógenos multirresistentes preocupan cada vez más. ¿En quién son más probables?',
        opciones: [
          no('En el mayor de 65 años y en el intubado desde hace más de 7 días, porque la edad y el tiempo de intubación acumulan riesgo', `La ficha no usa edad ni un tiempo de intubación: la lista es de antibióticos iv en los últimos 90 días, inmunodepresión o reemplazo renal y shock séptico (${p(35)}).`),
          no('En el que tomó antibióticos orales el año pasado o tiene una neumonía precoz', `Es el antibiótico intravenoso de los últimos 90 días el que figura en la lista, no el oral del último año (${p(35)}).`),
          ok('En quien recibió antibióticos iv en 90 días, el inmunodeprimido o en reemplazo renal, y con shock séptico')],
        explicacion: `Más probables con <span class="hl-rojo">antibióticos iv en los últimos 90 días</span>, inmunodepresión o terapia de reemplazo renal, y shock séptico (${p(35)}).` + enFicha(NP, 'nep-nav-multirresistentes') },
      { id: 'nvp-g4', corto: 'el desencadenante', tipo: 'test', fuente: 'nep-aspiracion-oro', origen: FIC,
        enunciado: '¿Cuál es el evento que desencadena la mayoría de las NAV y cómo se explican las que aparecen a los 2-4 días?',
        opciones: [
          no('El reflujo gástrico al pulmón; las precoces, por contaminar el circuito del respirador al conectarlo', `El desencadenante que da la ficha es la aspiración desde la orofaringe (${p(36)}); el reflujo gástrico es el argumento de la cabecera elevada (${p(38)}).`),
          no('La bacteriemia desde otro foco; las precoces, por la diseminación de esa sepsis', `El desencadenante es la aspiración de microbios de la orofaringe (${p(36)}); los gérmenes de la sangre suelen venir de sitios extrapulmonares y no confirman la NAV (${p(40)}).`),
          ok('Aspirar microbios de la orofaringe; las precoces suelen venir de lo arrastrado al intubar')],
        explicacion: `La aspiración desde la orofaringe es el <span class="hl-azul">evento desencadenante</span>; los bacilos gramnegativos son los patógenos de la orofaringe y los de la NAV, y los casos precoces se deben a lo arrastrado al intubar (${p(36)}).` + enFicha(NP, 'nep-aspiracion-oro') },
      { id: 'nvp-g5', corto: 'aspirar el tubo', tipo: 'destapa', cuantas: 'son tres cosas', fuente: 'nep-cuidado-via-aerea-nav', origen: FIC,
        enunciado: 'Un ventilado tiene el tubo traqueal y secreciones. ¿Por qué no se aspira el tubo de forma rutinaria y cuándo sí?',
        puntos: [
          `Los tubos traqueales son un <span class="hl-azul">nido de colonización y de biofilms</span> de patógenos (${p(38)}).`,
          `Pasar el catéter de aspiración puede <span class="hl-rojo">desalojar esos biofilms e inocular los pulmones</span> con organismos patógenos (${p(38)}).`,
          `Por eso se aspira solo cuando hay evidencia de secreciones respiratorias molestas, no por rutina (${p(38)}).`],
        explicacion: `La aspiración sistemática no previene la neumonía: puede causarla al arrastrar el biofilm del tubo hacia la vía aérea baja (${p(38)}).` + enFicha(NP, 'nep-cuidado-via-aerea-nav') },
      { id: 'nvp-g6', corto: 'qué es la SOD', tipo: 'test', fuente: 'nep-sod-oral · nep-nav-sod-impopular', origen: FIC,
        enunciado: 'La descontaminación oral selectiva (SOD) es el método preferido. ¿Qué es y por qué se usa poco en EE. UU.?',
        opciones: [
          no('Un antiséptico en gel sobre la encía, poco usado en EE. UU. por su coste elevado', `La SOD no es un antiséptico: usa antibióticos no absorbibles, y la ficha atribuye su impopularidad en EE. UU. a un miedo infundado a las resistencias (${p(37)}).`),
          ok('Antibióticos no absorbibles en la mucosa; en EE. UU. se evita por un miedo infundado a las resistencias'),
          no('Antibióticos iv profilácticos al intubar; en EE. UU. se evita por el miedo a las alergias medicamentosas', `La SOD se aplica sobre la mucosa oral con antibióticos no absorbibles, y el miedo que frena su uso es a las resistencias bacterianas (${p(37)}).`)],
        explicacion: `La SOD elimina <span class="hl-azul">«selectivamente»</span> los patógenos y retiene el ambiente microbiano normal de la boca; el miedo a que promueva resistencia es <span class="hl-purpura">infundado</span> según la ficha (${p(37)}).` + enFicha(NP, 'nep-sod-oral') },
      { id: 'nvp-g7', corto: 'el paquete', tipo: 'test', fuente: 'nep-paquete · nep-tabla-29-2', origen: FIC,
        enunciado: 'El Institute for Healthcare Improvement propone un «paquete del ventilador». Antes de ver la Tabla 29.2: ¿qué incluye?',
        opciones: [
          no('Cabecera a 30-45°, clorhexidina oral cada 6 h, aspiración rutinaria del tubo, profilaxis del TEV y sedación continua', `La clorhexidina y la aspiración rutinaria no se recomiendan (${p(36)}, ${p(38)}) y el paquete pide suspender la sedación cada día, no mantenerla (${p(37)}).`),
          ok('Cabecera a 30-45°, profilaxis de úlcera y de TEV, suspensión diaria de la sedación y valoración diaria de la extubación'),
          no('Cabecera a 60°, SOD, tubo con aspiración subglótica, suspensión diaria de la sedación y destete en 24 horas', `Ni la SOD ni el tubo subglótico figuran en la Tabla 29.2 y la cabecera es de 30-45° (${p(37)}-${p(38)}).`)],
        explicacion: `Cinco prácticas: <span class="hl-azul">cabecera 30-45°, profilaxis de úlcera, profilaxis del TEV, suspensión diaria de la sedación y valoración diaria de la extubación</span>. Algunas no tienen relación directa con la neumonía, pero su uso reduce la NAV (${p(37)}-${p(38)}).` + enFicha(NP, 'nep-tabla-29-2') },
      { id: 'nvp-g8', corto: 'plan de prevención', tipo: 'error', fuente: 'nep-clorhexidina · nep-cuidado-via-aerea-nav', origen: FIC,
        modeloVivo: pl('subglotica', '🫁 Mira el biofilm del tubo y la colección sobre el balón de Gaspar'),
        enunciado: 'Plan de prevención escrito para un paciente ventilado. Hay dos errores. Encuéntralos.',
        frases: [
          { t: 'Cabecera de la cama elevada a 30-45°.' },
          { t: 'Clorhexidina al 0,12 % cada 6 h en la boca, porque forma parte del paquete del ventilador.', mal: true, c: `La clorhexidina no figura en el paquete (Tabla 29.2, ${p(37)}) y las guías más recientes ya no la recomiendan por la mortalidad asociada (${p(36)}).` },
          { t: 'Aspiración sistemática del tubo cada 4 h, para que no se acumulen secreciones.', mal: true, c: `La aspiración rutinaria no se recomienda: puede desalojar biofilms e inocular los pulmones; se aspira solo si hay secreciones molestas (${p(38)}).` },
          { t: 'Valoración diaria de si puede extubarse.' }],
        explicacion: 'Dos errores: la clorhexidina no es del paquete ni se recomienda ya, y la aspiración del tubo no se hace por rutina.' + enFicha(NP, 'nep-cuidado-via-aerea-nav') },
      { id: 'nvp-g9', corto: 'aspiración subglótica', tipo: 'test', fuente: 'nep-subglotica', origen: FIC,
        modeloVivo: pl('subglotica', '🫁 Enciende la aspiración subglótica y mira cuánto baja la colección sobre el balón'),
        enunciado: 'Existe un tubo con un puerto de aspiración especial. ¿Dónde está el puerto, con qué aspiración se conecta y qué se ha visto con él?',
        opciones: [
          no('Sobre el manguito, conectado a aspiración continua; no cambia la NAV porque el manguito inflado ya impide la aspiración', `El manguito inflado no previene la aspiración de secreciones de la boca, y con este tubo la incidencia de NAV baja de forma significativa (${p(38)}).`),
          ok('Justo sobre el manguito, a aspiración continua de habitualmente no más de −20 cmH₂O; baja la NAV en los estudios'),
          no('Bajo el manguito, a aspiración intermitente de −80 cmH₂O, para limpiar el árbol bronquial; baja la NAV', `El puerto va por encima del manguito para despejar las secreciones subglóticas, con aspiración continua que no suele pasar de −20 cmH₂O (${p(38)}).`)],
        explicacion: `Puerto <span class="hl-azul">justo por encima del manguito</span> (introducido en 1992), con succión continua, habitualmente ≤ −20 cmH₂O; los estudios muestran menos NAV al despejar las secreciones subglóticas (${p(38)}).` + enFicha(NP, 'nep-subglotica') },
    ],
    examen: [
      { id: 'nvp-e1', corto: 'precoz o tardía', tipo: 'test', fuente: 'nep-definiciones-nav', origen: FIC,
        enunciado: 'Un paciente intubado desarrolla neumonía al 5.º día de ventilación. ¿Cómo se clasifica y qué parte de las NAV son así?',
        opciones: [
          no('NAV precoz, porque son los primeros 7 días; es el 60 % de las NAV', `La precoz es la de los días 2-4 tras intubar; desde el 5.º día es tardía (${p(35)}). Con la etiqueta precoz esperarías los gérmenes del arrastre al intubar.`),
          ok('NAV tardía, a partir del 5.º día tras la intubación; el 60 % de las NAV son tardías'),
          no('NAV tardía desde el 7.º día, así que aún es precoz; el 80 % de las NAV son tardías', `La tardía empieza a los 5 días y el 80 % es la parte de las neumonías de UCI que son NAV, no la parte tardía (${p(35)}).`)],
        explicacion: `Precoz: 2-4 días tras la intubación; <span class="hl-azul">tardía: ≥5 días</span>, y el 60 % de las NAV son tardías (${p(35)}).` + enFicha(NP, 'nep-definiciones-nav') },
      { id: 'nvp-e2', corto: 'SOD y neumonía', tipo: 'test', fuente: 'nep-fig-29-1', origen: FIC,
        enunciado: 'En pacientes dependientes del ventilador, ¿cuánto bajó la neumonía con la SOD frente al control?',
        opciones: [
          no('Del 52 al 22 %, con p ≤0,01 entre los dos grupos', `Esas son las cifras de la colonización traqueal; la neumonía pasó del 31 al 10 % (${p(37)}).`),
          no('Del 31 al 22 %, sin diferencia significativa entre los dos grupos', `Las dos diferencias de la Figura 29.1 son significativas (p ≤0,01): la neumonía baja del 31 al 10 % (${p(37)}).`),
          ok('Del 31 al 10 %, con p ≤0,01 entre los dos grupos')],
        explicacion: `Figura 29.1 (datos reales): colonización traqueal del 52 al 22 % y <span class="hl-verde">neumonía del 31 al 10 %</span>, ambas con p ≤0,01 (${p(37)}).` + enFicha(NP, 'nep-fig-29-1') },
      { id: 'nvp-e3', corto: 'ángulo de la cabecera', tipo: 'test', fuente: 'nep-semirreclinada · nep-nav-comentario-cabecera', origen: FIC,
        enunciado: 'La posición semirreclinada forma parte del paquete. ¿Qué ángulo pide y para qué?',
        opciones: [
          ok('De 30 a 45° sobre la horizontal, para reducir el reflujo y la aspiración del contenido gástrico'),
          no('Al menos 60° sobre la horizontal, para reducir el reflujo gastroesofágico y la aspiración gástrica', `La ficha y el paquete dan 30-45°, no 60° (${p(37)}-${p(38)}).`),
          no('Entre 10 y 20°, porque más ángulo lleva las secreciones de la boca hacia el pulmón', `Es la duda que el autor plantea en su comentario, pero él mismo dice que nunca se ha estudiado; el paquete sigue en 30-45° (${p(38)}).`)],
        explicacion: `<span class="hl-azul">30-45°</span> por el reflujo y la aspiración gástrica; algunos estudios validan el beneficio y otros no ven diferencia con supino (${p(38)}).`,
        nota: `<strong>Opinión del autor.</strong> Marino comenta que elevar la cabecera podría aumentar la NAV al mover por gravedad las secreciones de la boca, y que esto nunca se ha estudiado (${p(38)}). No cambia la recomendación de 30-45°.` + enFicha(NP, 'nep-semirreclinada') },
      { id: 'nvp-e4', corto: 'NAV y mortalidad', tipo: 'test', fuente: 'nep-nav-mortalidad', origen: FIC,
        enunciado: '¿Qué dice la ficha del efecto de la NAV en la ventilación, la estancia y la supervivencia?',
        opciones: [
          no('Dobla la mortalidad de forma constante en los estudios, sin alargar la ventilación', `Unos estudios muestran poco o ningún efecto y otros un aumento pequeño pero significativo; además la NAV sí prolonga la ventilación (${p(36)}).`),
          no('No alarga la ventilación ni la estancia en UCI; solo importa la mortalidad', `La NAV prolonga la duración de la ventilación mecánica y aumenta la estancia en UCI (${p(36)}).`),
          ok('Prolonga la ventilación y la estancia; su efecto sobre la supervivencia es incierto')],
        explicacion: `Prolonga la ventilación y la estancia; sobre la supervivencia, algunos estudios no ven efecto y otros un aumento <span class="hl-purpura">pequeño pero significativo</span> (${p(36)}).` + enFicha(NP, 'nep-nav-mortalidad') },
      { id: 'nvp-e5', corto: 'Candida', tipo: 'test', fuente: 'nep-nav-virus-candida', origen: FIC,
        enunciado: 'Crece Candida en el aspirado de un paciente con NAV sospechada. ¿Qué dice la ficha?',
        opciones: [
          no('Es el patógeno más frecuente de la NAV tardía tras las enterobacterias', `Candida no figura entre los aislados de la Tabla 29.1 ni se conoce como causa de neumonía (${p(35)}-${p(36)}).`),
          ok('Es un aislado común de las secreciones, pero no se conoce que cause neumonía'),
          no('Es una causa de NAV por hongos que obliga a ampliar el tratamiento a un antifúngico', `La ficha dice que no se conoce que cause neumonía; los virus, en cambio, se implican en cerca del 20 % (${p(35)}).`)],
        explicacion: `Las especies de <span class="hl-azul">Candida son aislados comunes</span> en las secreciones, pero no se conoce que causen neumonía; los virus sí, en cerca del 20 % de las NAV y HAP (${p(35)}).` + enFicha(NP, 'nep-nav-virus-candida') },
    ],
    casos: [
      { id: 'c-nvp-casimiro', titulo: 'Casimiro, 68 años: una semana de respirador', corto: 'Caso · Casimiro (prevención)', sub: 'Neurocrítico intubado; del ingreso al día 6',
        paciente: { Edad: '68 años, varón', Peso: '75 kg', Antecedentes: 'neurocrítico, en ventilación mecánica', Motivo: 'Días 1-6 de ventilación (del caso)' },
        pasos: [
          { momento: 'Día 1 · ingreso', datos: { Situación: 'intubado, cabecera plana por el traslado' }, nuevo: ['Situación'],
            pregunta: { id: 'nvp-c1', tipo: 'destapa', cuantas: 'son tres cosas', fuente: 'nep-semirreclinada · nep-nav-comentario-cabecera', origen: CASO,
              enunciado: 'Casimiro llega intubado con la cama plana. Vas a pedir la cabecera elevada, pero un compañero dice que así «las secreciones de la boca bajarán al pulmón». ¿Qué sabes de la cabecera?',
              puntos: [
                `Se pide a 30-45° como medida importante contra el <span class="hl-azul">reflujo gastroesofágico y la aspiración gástrica</span> (${p(38)}).`,
                `Los estudios <span class="hl-purpura">no coinciden</span>: unos validan el beneficio y otros no ven diferencia entre supino y semirreclinado (${p(38)}).`,
                `El compañero repite la duda del autor: podría aumentar el riesgo al mover secreciones por gravedad, pero <span class="hl-rojo">nunca se ha estudiado</span> (${p(38)}).`],
              explicacion: `Se mantiene la cabecera de 30-45°, que figura en el paquete (${p(37)}); la duda del autor es una opinión sin estudio.` + enFicha(NP, 'nep-semirreclinada') } },
          { momento: 'Día 1 · el plan', datos: { Plan: 'redactado por un residente' }, nuevo: ['Plan'],
            pregunta: { id: 'nvp-c2', tipo: 'error', fuente: 'nep-semirreclinada · nep-clorhexidina · nep-sod-oral', origen: CASO,
              enunciado: 'Plan del residente para la prevención de la NAV de Casimiro. Hay dos errores. Encuéntralos.',
              frases: [
                { t: 'Suspensión diaria de la sedación y valoración diaria de la extubación.' },
                { t: 'Cabecera a 60° como mínimo, para reducir al máximo el reflujo.', mal: true, c: `El paquete y la ficha piden 30-45° (${p(37)}-${p(38)}).` },
                { t: 'No uso SOD: la clorhexidina es más segura y está más extendida.', mal: true, c: `La clorhexidina se asocia a mayor mortalidad y ya no se recomienda; el método preferido es la SOD (${p(36)}-${p(37)}).` },
                { t: 'Profilaxis del sangrado por úlcera de estrés y del tromboembolismo venoso.' }],
              explicacion: 'Dos errores: el ángulo de la cabecera y preferir la clorhexidina a la SOD.' + enFicha(NP, 'nep-tabla-29-2') } },
          { momento: 'Día 2 · la boca', datos: { Boca: 'sin lesiones; el residente propone clorhexidina' }, nuevo: ['Boca'],
            pregunta: { id: 'nvp-c3', tipo: 'test', fuente: 'nep-clorhexidina · nep-sod-oral · nep-fig-29-1', origen: CASO,
              enunciado: 'Quieres descontaminar la boca de Casimiro. ¿Qué eliges y por qué?',
              opciones: [
                no('Clorhexidina al 0,12 % cada 6 h: es el método popular y no tiene riesgos asociados', `La clorhexidina se asocia a mayor mortalidad por mucositis y septicemia con gérmenes de la boca, y las guías recientes ya no la recomiendan (${p(36)}).`),
                no('Ninguna: la descontaminación oral no se ha mostrado útil frente a la neumonía en ventilados', `La SOD se asoció a un descenso significativo de la colonización traqueal y de la neumonía en ventilados, con la neumonía del 31 al 10 % (${p(37)}).`),
                ok('SOD: antibióticos no absorbibles; en ventilados, la neumonía bajó del 31 al 10 %')],
              explicacion: `La SOD baja la colonización traqueal (52 → 22 %) y la neumonía (31 → 10 %); la clorhexidina ya no se recomienda (${p(36)}-${p(37)}).` + enFicha(NP, 'nep-fig-29-1') } },
          { momento: 'Día 3 · fiebre', datos: { Temperatura: '38,2 °C (del paciente)', Secreciones: 'más espesas', Ventilación: 'día 3 tras la intubación' }, nuevo: ['Temperatura', 'Secreciones', 'Ventilación'],
            pregunta: { id: 'nvp-c4', tipo: 'test', fuente: 'nep-definiciones-nav · nep-tabla-29-1', origen: CASO,
              enunciado: 'Al tercer día, Casimiro tiene fiebre y más secreciones. Si fuera una NAV, ¿cómo se clasificaría y qué gérmenes serían más frecuentes?',
              opciones: [
                no('Tardía, porque ya pasaron 48 h desde la intubación; sobre todo Acinetobacter y Pseudomonas', `A los 3 días es precoz (2-4 días); en la precoz Acinetobacter es el 8 % y Pseudomonas el 14 % (Tabla 29.1, ${p(36)}).`),
                ok('Precoz (días 2-4); sobre todo enterobacterias (32 %) y S. aureus (30 %), en gran parte MSSA'),
                no('Precoz, pero por Candida, el aislado más común de las secreciones respiratorias del intubado', `Candida es un aislado común de las secreciones, pero no se conoce que cause neumonía (${p(35)}).`)],
              explicacion: `Tercer día = <span class="hl-azul">NAV precoz</span> (2-4 días): enterobacterias 32 % y S. aureus 30 % (MSSA 21 %, MRSA 9 %) (Tabla 29.1, ${p(36)}).` + enFicha(NP, 'nep-tabla-29-1') } },
          { momento: 'Día 6 · otra vez fiebre', datos: { Situación: 'fiebre y secreciones purulentas de nuevo', Ventilación: 'día 6', Antecedente: 'amoxicilina-clavulánico iv hace 2 meses (del paciente)' }, nuevo: ['Situación', 'Ventilación', 'Antecedente'],
            pregunta: { id: 'nvp-c5', tipo: 'test', fuente: 'nep-nav-multirresistentes · nep-definiciones-nav', origen: CASO,
              enunciado: 'Al sexto día reaparecen la fiebre y las secreciones purulentas. Casimiro recibió amoxicilina-clavulánico intravenoso hace dos meses. ¿Cambia eso el riesgo del germen?',
              opciones: [
                no('No: los antibióticos de hace dos meses ya no cuentan; solo importan los de la última semana de ingreso', `La ventana de la ficha son los antibióticos iv de los últimos 90 días (${p(35)}); dos meses está dentro.`),
                no('Sí, pero solo si además tuviera shock séptico; con el antibiótico iv por sí solo no basta', `La lista de la ficha incluye el antibiótico iv de los últimos 90 días, la inmunodepresión o el reemplazo renal y el shock séptico (${p(35)}).`),
                ok('Sí: es tardía (≥5 días) y el antibiótico iv de los últimos 90 días hace más probables los multirresistentes')],
              explicacion: `Al sexto día sería <span class="hl-azul">tardía</span>, y el antibiótico iv de los últimos <span class="hl-rojo">90 días</span> hace más probables los patógenos multirresistentes (${p(35)}). Cómo se confirma, en la ficha siguiente.` + enFicha(NP, 'nep-nav-multirresistentes') } },
        ],
        lleva: [
          'La NAV es la que empieza ≥48 h tras intubar; la precoz es de 2-4 días y la tardía, desde el 5.º.' + enFicha(NP, 'nep-definiciones-nav'),
          'Para la boca, SOD sí y clorhexidina no; la neumonía bajó del 31 al 10 %.' + enFicha(NP, 'nep-fig-29-1'),
          'El paquete reúne cinco prácticas, con la cabecera a 30-45°, aunque el autor dude de ella.' + enFicha(NP, 'nep-tabla-29-2')],
        volver: { nombre: 'Efecto de la SOD', ancla: 'nep-fig-29-1' } },
    ],
    profundizar: [
      { id: 'nep-tabla-29-1', titulo: 'Tabla 29.1 completa: patógenos en la NAV precoz, la tardía y la HAP' },
      { id: 'nep-nav-sod-impopular', titulo: 'Por qué la SOD es impopular en EE. UU.' },
    ],
  },

  /* =================================================================================================
     Ficha 18 · NAV: diagnóstico clínico y microbiológico (cap. 29, págs. 39-45) y el caso de Casimiro, día 6
     ================================================================================================= */
  [ND]: {
    entrada: 'La clínica no diagnostica la NAV (razón de probabilidades diagnóstica de 2 a 3, lejos de 10); el Gram dice si la muestra sirve y el cultivo cuantitativo del BAL (umbral 10⁴) es el más fiable, todo antes del antibiótico.',
    guia: [
      { id: 'nvd-g1', corto: 'criterios clínicos', tipo: 'test', fuente: 'nep-nav-criterios-clinicos · nep-tabla-29-3', origen: FIC,
        enunciado: 'Antes de ver la Tabla 29.3: ¿qué cuatro criterios clínicos se usan para diagnosticar la NAV y cómo rinden?',
        opciones: [
          no('Fiebre, leucocitosis, secreciones purulentas e infiltrado; juntos dan una razón ≥10 y bastan para diagnosticar', `La fuente concluye lo contrario: la razón de cada criterio es pobre (2,1-2,8) y el diagnóstico no es posible con criterios clínicos solos (${p(39)}-${p(40)}).`),
          ok('Fiebre, leucocitosis, secreciones e infiltrado nuevo; cada uno con una razón de solo 2,1 a 2,8'),
          no('Fiebre, hipoxemia, taquicardia e infiltrado; el infiltrado, con razón ≥10, confirma la neumonía', `Los criterios son otros y el infiltrado tiene una razón de solo 2,8, con una especificidad del 26 % (${p(39)}-${p(40)}).`)],
        explicacion: `Fiebre o hipotermia, leucocitosis o leucopenia, aumento o cambio de las secreciones e infiltrado nuevo o progresivo: <span class="hl-rojo">su sello es la falta de fiabilidad</span>; una prueba fiable tiene una razón de probabilidades diagnóstica ≥10 y estas dan 2,1-2,8 (${p(39)}-${p(40)}).` + enFicha(ND, 'nep-tabla-29-3') },
      { id: 'nvd-g2', corto: 'la placa que engaña', tipo: 'destapa', cuantas: 'son tres cosas', fuente: 'nep-fig-29-3', origen: FIC,
        enunciado: 'Dos radiografías portátiles del mismo paciente, tomadas con minutos de diferencia, parecen distintas: una enseña marcas apiñadas en la base derecha. ¿Qué cambió entre una y otra?',
        puntos: [
          `La de la izquierda se tomó <span class="hl-azul">tras exhalar, en posición supina</span>; la de la derecha, tras inhalar y con el paciente erguido (Figura 29.3, ${p(41)}).`,
          `Las marcas apiñadas de la base derecha se deben al <span class="hl-azul">hemidiafragma elevado</span> de la posición supina y al volumen pulmonar bajo de la espiración (${p(41)}).`,
          `En un paciente con fiebre, ese cambio de la placa <span class="hl-rojo">podría confundirse con una neumonía basilar</span> (${p(41)}).`],
        explicacion: `La técnica de la placa (posición y fase respiratoria) puede fabricar un infiltrado aparente: antes de llamarlo neumonía, mira cómo se tomó (${p(41)}).` + enFicha(ND, 'nep-fig-29-3') },
      { id: 'nvd-g3', corto: 'hemocultivos', tipo: 'test', fuente: 'nep-microbiologia', origen: FIC,
        enunciado: 'En la sospecha de NAV, ¿qué valor tienen los hemocultivos para identificar al germen del pulmón?',
        opciones: [
          no('Son los más fiables, porque un hemocultivo positivo confirma que el origen es pulmonar', `En la sospecha de NAV, los gérmenes de la sangre suelen proceder de sitios extrapulmonares (${p(40)}); un positivo no localiza el foco en el pulmón.`),
          ok('Valor limitado: el germen aislado en sangre suele venir de otro sitio del cuerpo'),
          no('Valor limitado, porque la bacteriemia es rara en la NAV y suele contaminar el frasco', `La razón que da la fuente es otra: el organismo aislado suele proceder de un foco fuera del pulmón (${p(40)}).`)],
        explicacion: `<span class="hl-azul">Valor limitado</span>: los organismos de los hemocultivos suelen venir de sitios extrapulmonares (${p(40)}).` + enFicha(ND, 'nep-microbiologia') },
      { id: 'nvd-g4', corto: 'el Gram', tipo: 'destapa', cuantas: 'son tres cosas', fuente: 'nep-gram', origen: FIC,
        enunciado: 'Antes de cultivar un aspirado traqueal se mira su Gram a bajo aumento (×10). ¿Cuándo vale la muestra y qué te dice?',
        puntos: [
          `Más de <span class="hl-rojo">10 células escamosas</span> por campo indican contaminación con secreciones de la boca: no es apropiada para cultivo (${p(41)}).`,
          `Más de <span class="hl-azul">25 neutrófilos</span> por campo se consideran evidencia de infección; unos pocos no bastan, porque son el 20 % de las células de un enjuague bucal (${p(41)}).`,
          `Aun con muchos neutrófilos, no distingue entre traqueobronquitis y neumonía (${p(41)}).`],
        explicacion: `El Gram es el cribado de idoneidad que debe hacer el laboratorio de forma rutinaria (${p(41)}).` + enFicha(ND, 'nep-gram') },
      { id: 'nvd-g5', corto: 'cultivo cualitativo', tipo: 'test', fuente: 'nep-cualitativos', origen: FIC,
        enunciado: 'El aspirado endotraqueal se cultiva de forma cualitativa en la práctica estándar. ¿Para qué sirve y para qué no?',
        opciones: [
          no('Un cultivo positivo confirma al culpable; uno negativo no excluye la infección porque falla mucho', `Es al revés: el cualitativo es muy sensible, así que un negativo excluye una infección tratable, y un positivo no es fiable por la contaminación con la boca (${p(42)}).`),
          ok('Un negativo permite excluir una infección tratable; un positivo no identifica de forma fiable al culpable'),
          no('Ambos resultados son fiables si el aspirado se toma antes del antibiótico y se procesa pronto', `Tomarlo antes del antibiótico es lo que piden las guías (${p(45)}), pero no corrige la contaminación con secreciones de la boca y la vía aérea superior (${p(42)}).`)],
        explicacion: `Sensibilidad alta (habitualmente >90 %) y especificidad muy baja: el negativo <span class="hl-verde">excluye</span> una infección tratable y el positivo <span class="hl-rojo">no sirve</span> como prueba del culpable (${p(42)}).` + enFicha(ND, 'nep-cualitativos') },
      { id: 'nvd-g6', corto: 'cuantitativo', tipo: 'test', fuente: 'nep-cuantitativos', origen: FIC,
        enunciado: 'En el mismo aspirado, ¿qué gana el cultivo cuantitativo frente al cualitativo y qué pierde?',
        opciones: [
          no('Gana sensibilidad (de 76 % a >90 %) y pierde especificidad, que baja del 68 % al ≤40 %', `Está invertido: el cuantitativo tiene sensibilidad 76 % y especificidad 68 %, y el cualitativo sensibilidad >90 % con especificidad ≤40 % (${p(42)}).`),
          no('No gana nada: ambos tienen la misma fiabilidad y solo cambia la forma en que informa el laboratorio', `La ficha concluye que para el aspirado los cuantitativos son más fiables para identificar el patógeno responsable (${p(42)}).`),
          ok('Gana especificidad (68 % frente a ≤40 %) y pierde algo de sensibilidad (76 % frente a >90 %)')],
        explicacion: `El cuantitativo informa la densidad de crecimiento: sensibilidad 76 % y <span class="hl-azul">especificidad 68 %</span> frente a >90 % y ≤40 % del cualitativo; es más fiable para identificar al patógeno (${p(42)}).` + enFicha(ND, 'nep-cuantitativos') },
      { id: 'nvd-g7', corto: 'el BAL', tipo: 'test', fuente: 'nep-bal', origen: FIC,
        enunciado: '¿Cómo se hace el lavado broncoalveolar (BAL) y qué se hace con el líquido?',
        opciones: [
          no('Con 60 mL en tres lavados de 20 mL; se descarta el último y se recupera casi todo el líquido', `Se recomiendan al menos 120 mL, en 6 lavados de 20 mL; solo se recupera el 25 % o menos, y el primero es el que se descarta (${p(43)}).`),
          ok('Mínimo 120 mL en 6 lavados de 20 mL; se descarta el primero y vuelve el 25 % o menos'),
          no('Con 120 mL en un solo lavado; el líquido se agrupa entero y se envía solo para Gram', `Se hacen 6 lavados de 20 mL con descarte del primero, y el líquido va a análisis microscópico y cultivo cuantitativo (${p(43)}).`)],
        explicacion: `Broncoscopio encajado en una vía distal, suero isotónico estéril: <span class="hl-azul">120 mL en 6 lavados de 20 mL</span>; el primero suele descartarse y el resto se agrupa para microscopía y cultivo cuantitativo (${p(43)}).` + enFicha(ND, 'nep-bal') },
      { id: 'nvd-g8', corto: 'intracelulares', tipo: 'test', fuente: 'nep-intracelulares', origen: FIC,
        enunciado: 'En el líquido del BAL se pueden buscar organismos intracelulares. ¿Para qué sirve y cómo se pide?',
        opciones: [
          no('Sustituye al cultivo cuantitativo y sale de forma automática en el Gram de rutina sin pedirlo', `No sustituye al cultivo: orienta el antibiótico inicial hasta que llegue; además no se hace en el Gram de rutina (${p(43)}).`),
          no('Confirma el germen exacto y se pide solo si el cultivo sale negativo, para decidir si se repite', `Ayuda a guiar la terapia inicial mientras no hay cultivo, no a identificar el germen exacto (${p(43)}).`),
          ok('Orienta el antibiótico inicial hasta el cultivo; exige tinción especial y pedirlo al laboratorio')],
        explicacion: `Sirve para guiar el <span class="hl-azul">tratamiento inicial</span> hasta que haya cultivo; no se hace en la tinción de Gram rutinaria: exige procesamiento especial y una solicitud específica a microbiología (${p(43)}).` + enFicha(ND, 'nep-intracelulares') },
      { id: 'nvd-g9', corto: 'mini-BAL', tipo: 'test', fuente: 'nep-mini-bal', origen: FIC,
        enunciado: 'El BAL puede hacerse sin broncoscopio (mini-BAL). ¿Cómo se hace y qué rinde frente al BAL broncoscópico?',
        opciones: [
          no('Catéter guiado con broncoscopio, 120 mL de suero en 6 lavados; rinde menos que el BAL convencional', `El mini-BAL es sin broncoscopia y con 10-20 mL; su rendimiento es equivalente (${p(43)}-${p(44)}).`),
          no('Catéter de 50 cm a ciegas, 120 mL de suero en 6 lavados; rinde menos por la punta de ubicación incierta', `Se usan 10-20 mL (de ahí «mini»), y pese a la incertidumbre de la punta el rendimiento es equivalente (${p(43)}-${p(44)}).`),
          ok('Catéter de 50 cm a ciegas con tapón bioabsorbible, 10-20 mL de suero y rendimiento equivalente al BAL')],
        explicacion: `Catéter enfundado de unos <span class="hl-azul">50 cm</span> por el tubo, tapón bioabsorbible que evita la contaminación, lavado de <span class="hl-azul">10-20 mL</span>; es seguro, lo puede hacer un terapeuta respiratorio y su rendimiento es equivalente (${p(43)}-${p(44)}).` + enFicha(ND, 'nep-mini-bal') },
      { id: 'nvd-g10', corto: 'cepillo protegido', tipo: 'test', fuente: 'nep-psb', origen: FIC,
        enunciado: 'El cepillo protegido (PSB) recoge secreciones de la vía distal. ¿Dónde se sitúa frente al aspirado cuantitativo y frente al BAL?',
        opciones: [
          no('Más fiable que el BAL, pero menos específico que el aspirado traqueal cuantitativo', `Es menos fiable que el BAL (razón 5,1 frente a 9,6) y más específico que el aspirado (77 % frente a 68 %) (${p(43)}, ${p(45)}).`),
          ok('Menos fiable que el BAL (5,1 frente a 9,6) pero más específico que el aspirado (77 % frente a 68 %)'),
          no('Igual de fiable que el BAL, porque ambos se cultivan en forma cuantitativa en el laboratorio', `Su razón de probabilidades diagnóstica es 5,1, por debajo del 9,6 del BAL (${p(43)}); la ficha lo describe como menos fiable (${p(45)}).`)],
        explicacion: `Umbral de <span class="hl-azul">10³ UFC/mL</span>, razón 5,1: menos fiable que el BAL (9,6) y más específico que el aspirado (Tabla 29.4, ${p(43)}; ${p(45)}).` + enFicha(ND, 'nep-psb') },
      { id: 'nvd-g11', corto: 'nota de manejo', tipo: 'error', fuente: 'nep-gram · nep-metodo-preferido-nav', origen: FIC,
        enunciado: 'Nota de manejo de una sospecha de NAV. Hay un error. Encuéntralo.',
        frases: [
          { t: 'Miro el Gram del aspirado antes de decidir si se cultiva.' },
          { t: 'Empiezo el antibiótico ahora y hago el BAL por la tarde.', mal: true, c: `Estos cultivos deben obtenerse antes de iniciar el antibiótico empírico (${p(45)}).` },
          { t: 'Aspirado con 15 escamosas por campo: la muestra no es apropiada para cultivo.' },
          { t: 'En el BAL, el umbral de positividad es 10⁴ UFC/mL.' }],
        explicacion: 'Un error: el antibiótico va después de la muestra. Las más de 10 escamosas por campo sí invalidan el aspirado (Marino, p. 41).' + enFicha(ND, 'nep-metodo-preferido-nav') },
      { id: 'nvd-g12', corto: 'qué método', tipo: 'test', fuente: 'nep-metodo-preferido-nav · nep-nav-autor-prefiere', origen: FIC,
        enunciado: 'Las guías discrepan sobre cómo cultivar. ¿Qué recomienda cada una?',
        opciones: [
          no('Las internacionales, el aspirado traqueal; las de EE. UU., el BAL por su mejor rendimiento', `Está invertido: las internacionales prefieren cultivos cuantitativos de BAL, mini-BAL o PSB, y las de EE. UU. los cultivos traqueales rutinarios (${p(45)}).`),
          ok('Internacionales, cuantitativos; EE. UU., traqueal rutinario; ambas antes del antibiótico'),
          no('Las dos prefieren el BAL; difieren en si la muestra se toma antes o después del antibiótico', `Las de EE. UU. prefieren el cultivo traqueal porque BAL y PSB no mejoran los resultados clínicos, y ambas piden la muestra antes del antibiótico (${p(45)}).`)],
        explicacion: `Internacionales: cuantitativos con BAL, mini-BAL o PSB (menos falsos positivos y menos antibióticos de más); EE. UU.: cultivos traqueales, porque lo invasivo no mejora los resultados clínicos (${p(45)}).`,
        nota: `<strong>Opinión del autor.</strong> «Elige tú mismo», dice Marino, aunque cree que deberían preferirse los métodos de mejor rendimiento (el BAL) y que el mini-BAL ahorraría el coste de la broncoscopia (${p(45)}).` + enFicha(ND, 'nep-metodo-preferido-nav') },
    ],
    examen: [
      { id: 'nvd-e1', corto: 'razón del infiltrado', tipo: 'test', fuente: 'nep-tabla-29-3', origen: FIC,
        enunciado: 'De los cuatro criterios clínicos de la Tabla 29.3, ¿cuál tiene la mayor razón de probabilidades diagnóstica y qué especificidad tiene?',
        opciones: [
          no('El infiltrado en la radiografía: razón 2,8 con especificidad del 89 %', `El 89 % es su sensibilidad; su especificidad es del 26 % (${p(40)}). Creer que es específico llevaría a tratar como neumonía cualquier infiltrado.`),
          no('La leucocitosis: razón 2,6 con una especificidad del 59 %', `La mayor razón es la del infiltrado, 2,8; la leucocitosis tiene 2,6 (${p(39)}-${p(40)}).`),
          ok('El infiltrado en la radiografía: razón 2,8 con especificidad del 26 %')],
        explicacion: `Infiltrado: sensibilidad 89 %, <span class="hl-rojo">especificidad 26 %</span>, razón 2,8; aun así, lejos del 10 de una prueba fiable (${p(40)}).`,
        nota: `<strong>Errata de la fuente.</strong> En la página 40 el texto atribuye la especificidad del 26 % a la «Tabla 29.4»; es de la Tabla 29.3 (${p(40)}). Se reproduce con aviso.` + enFicha(ND, 'nep-tabla-29-3') },
      { id: 'nvd-e2', corto: 'tres umbrales', tipo: 'test', fuente: 'nep-cuantitativos · nep-psb · nep-bal-cuantitativo · nep-tabla-29-4', origen: FIC,
        enunciado: 'Umbrales de los cultivos cuantitativos, por orden: aspirado traqueal, cepillo protegido y BAL.',
        opciones: [
          no('10⁴, 10³ y 10⁵ UFC/mL', `El BAL se positiviza a 10⁴, no a 10⁵; con 10⁵ en el BAL se perderían casos con 10⁴ (${p(43)}).`),
          ok('10⁵, 10³ y 10⁴ UFC/mL'),
          no('10³, 10⁴ y 10⁵ UFC/mL', `Los tres valores están en otro orden: el aspirado es 10⁵, el cepillo 10³ y el BAL 10⁴ (Tabla 29.4, ${p(43)}); con 10³ en el aspirado se daría por infección cualquier colonización.`)],
        explicacion: `Tabla 29.4: aspirado traqueal <span class="hl-azul">10⁵</span>, cepillo protegido <span class="hl-azul">10³</span>, BAL <span class="hl-azul">10⁴</span> UFC/mL (${p(43)}).` + enFicha(ND, 'nep-tabla-29-4') },
      { id: 'nvd-e3', corto: 'intracelulares >3 %', tipo: 'test', fuente: 'nep-intracelulares', origen: FIC,
        enunciado: 'En el BAL hay organismos intracelulares en una proporción de las células. ¿Qué proporción hace que la probabilidad de neumonía supere el 90 %?',
        opciones: [
          no('Más del 30 % de las células del lavado', `El corte es mucho más bajo: más del 3 % (${p(43)}). Exigir el 30 % retrasaría el tratamiento dirigido.`),
          ok('Más del 3 % de las células del lavado, por tinción especial'),
          no('Más del 0,3 % de las células, con probabilidad cercana al 50 %', `La ficha da más del 3 % para una probabilidad superior al 90 % (${p(43)}).`)],
        explicacion: `Más del <span class="hl-azul">3 %</span> de las células con organismos intracelulares: probabilidad de neumonía <span class="hl-rojo">superior al 90 %</span> (${p(43)}).` + enFicha(ND, 'nep-intracelulares') },
      { id: 'nvd-e4', corto: 'especificidad cualitativo', tipo: 'test', fuente: 'nep-cualitativos', origen: FIC,
        enunciado: '¿Qué rendimiento tiene el cultivo cualitativo rutinario del aspirado traqueal?',
        opciones: [
          no('Sensibilidad del 15-40 % y especificidad >90 %', `Los valores están intercambiados: la sensibilidad es >90 % y la especificidad 15-40 % (${p(42)}).`),
          ok('Sensibilidad habitualmente >90 % y especificidad del 15-40 %'),
          no('Sensibilidad >90 % y especificidad del 68 %, igual que el cuantitativo', `El 68 % es la especificidad del cuantitativo (10⁵); la del cualitativo es del 15-40 % (${p(42)}).`)],
        explicacion: `<span class="hl-azul">Sensibilidad >90 %, especificidad 15-40 %</span>: por eso un negativo excluye y un positivo no confirma al culpable (${p(42)}).` + enFicha(ND, 'nep-cualitativos') },
      { id: 'nvd-e5', corto: 'razón del BAL', tipo: 'test', fuente: 'nep-tabla-29-4 · nep-bal-cuantitativo', origen: FIC,
        enunciado: 'El BAL cuantitativo tiene una razón de probabilidades diagnóstica de 9,6. ¿Qué significa?',
        opciones: [
          no('Que supera el 10 de una prueba fiable, así que un BAL positivo confirma la NAV', `9,6 queda por debajo de 10, y la propia ficha dice que, aun siendo el más fiable, sensibilidad y especificidad lo dejan lejos de lo ideal (${p(43)}).`),
          ok('Que es el más fiable de los cultivos, pero no llega al 10 de una prueba fiable'),
          no('Que es el menos fiable de los tres, por tener la menor razón de probabilidades diagnóstica', `Es la mayor de los tres (aspirado 6,6; cepillo 5,1) (${p(43)}).`)],
        explicacion: `Razón <span class="hl-azul">9,6</span> frente a 6,6 y 5,1: <span class="hl-verde">el más fiable</span>, con sensibilidad 71 % y especificidad 80 %, pero «lejos de ser ideal» (Tabla 29.4, ${p(43)}).` + enFicha(ND, 'nep-tabla-29-4') },
      { id: 'nvd-e6', corto: 'tabla 29.3 o 29.4', tipo: 'test', fuente: 'nep-nav-nota-29-4 · nep-rx-nav', origen: FIC,
        enunciado: 'El texto de la fuente (pág. 40) atribuye la especificidad del 26 % del infiltrado a la «Tabla 29.4». ¿A qué tabla pertenece?',
        opciones: [
          no('A la 29.4, la de los cultivos cuantitativos, que incluye una fila de radiografía', `La Tabla 29.4 trata de los cultivos cuantitativos (aspirado, cepillo y BAL) y no tiene fila de radiografía (${p(43)}).`),
          ok('A la 29.3, la de los hallazgos clínicos; la fuente la cita como 29.4 por error'),
          no('A la 29.2, la del paquete del ventilador, que se cita junto a la radiografía', `La Tabla 29.2 es el paquete del ventilador y no lleva cifras de especificidad (${p(37)}).`)],
        explicacion: `El 26 % está en la <span class="hl-azul">Tabla 29.3</span> (infiltrado: sensibilidad 89 %, especificidad 26 %) (${p(40)}).`,
        nota: `<strong>Errata de la fuente.</strong> La página 40 imprime «Tabla 29.4» donde corresponde la 29.3. La ficha escribe 29.3 y lo avisa (${p(40)}).` + enFicha(ND, 'nep-nav-nota-29-4') },
    ],
    casos: [
      { id: 'c-nvd-casimiro', titulo: 'Casimiro, 68 años: ¿tiene una NAV?', corto: 'Caso · Casimiro (diagnóstico)', sub: 'Día 6 de ventilación, fiebre e infiltrado; del Gram al BAL',
        paciente: { Edad: '68 años, varón', Peso: '75 kg', Antecedentes: 'neurocrítico, en ventilación mecánica', Motivo: 'Día 6 de ventilación (del caso)' },
        pasos: [
          { momento: 'Día 6 · la sospecha', datos: { Temperatura: 'fiebre', Leucocitos: '16.000/µL (del paciente)', Secreciones: 'purulentas', Placa: 'infiltrado basal derecho', Hemodinámica: 'PA 85/50; empieza noradrenalina' }, nuevo: ['Temperatura', 'Leucocitos', 'Secreciones', 'Placa', 'Hemodinámica'],
            pregunta: { id: 'nvd-c1', tipo: 'destapa', cuantas: 'son tres cosas', fuente: 'nep-nav-criterios-clinicos · nep-rx-nav', origen: CASO,
              enunciado: 'Casimiro cumple los cuatro criterios clásicos: fiebre, leucocitos altos, secreciones purulentas e infiltrado. ¿Es una NAV?',
              puntos: [
                `<span class="hl-rojo">No se puede afirmar solo con la clínica</span>: cada criterio tiene una razón de 2,1 a 2,8 frente al ≥10 de una prueba fiable (${p(39)}-${p(40)}).`,
                `El infiltrado solo es neumonía en <span class="hl-azul">un tercio</span> de los casos de UCI, y una placa supina en espiración puede simular una basilar (${p(40)}).`,
                `Hace falta una muestra microbiológica adecuada, tomada antes del antibiótico (${p(45)}).`],
              explicacion: `Sospechar no es diagnosticar: la clínica orienta y la microbiología decide (${p(39)}-${p(45)}).` + enFicha(ND, 'nep-nav-criterios-clinicos') } },
          { momento: 'Día 6 · el hemocultivo', datos: { Hemocultivo: 'E. coli (del paciente)' }, nuevo: ['Hemocultivo'],
            pregunta: { id: 'nvd-c2', tipo: 'test', fuente: 'nep-microbiologia', origen: CASO,
              enunciado: 'Ya hay un hemocultivo con E. coli. ¿Te dice que la NAV es por E. coli?',
              opciones: [
                no('Sí: el germen de la sangre es el de la neumonía y puedes tratar la NAV sin pedir más muestras respiratorias', `En la sospecha de NAV los gérmenes de la sangre suelen venir de sitios extrapulmonares (${p(40)}); tratarías un foco que no has localizado.`),
                ok('No: tiene valor limitado, el organismo suele venir de un sitio extrapulmonar; faltan muestras respiratorias'),
                no('Solo si E. coli es el único crecimiento de la sangre; entonces equivale a un BAL', `La fuente no da ninguna equivalencia entre el hemocultivo y el BAL; da valor limitado al hemocultivo (${p(40)}).`)],
              explicacion: `Los hemocultivos tienen <span class="hl-azul">valor limitado</span> en la sospecha de NAV; hay que buscar el germen en las secreciones respiratorias (${p(40)}).` + enFicha(ND, 'nep-microbiologia') } },
          { momento: 'Día 6 · el Gram del aspirado', datos: { Escamosas: '15 por campo ×10 (del paciente)', Neutrófilos: '30 por campo ×10 (del paciente)' }, nuevo: ['Escamosas', 'Neutrófilos'],
            pregunta: { id: 'nvd-c3', tipo: 'test', fuente: 'nep-gram', origen: CASO,
              enunciado: 'El Gram del aspirado traqueal de Casimiro muestra 15 células escamosas y 30 neutrófilos por campo de bajo poder. ¿Cultivas esa muestra?',
              opciones: [
                no('Sí: pasa de 25 neutrófilos por campo, que es la prueba de infección, y el cultivo confirmaría el germen', `Con más de 10 escamosas la muestra está contaminada con secreciones de la boca y no es apropiada para cultivo, aunque tenga neutrófilos (${p(41)}).`),
                ok('No: más de 10 escamosas indican contaminación con la boca; hay que obtener otra muestra'),
                no('Sí, pero como cualitativo, que descarta la infección si sale negativo', `Una muestra con más de 10 escamosas no es apropiada para cultivo; el negativo cualitativo solo excluye si la muestra es adecuada (${p(41)}-${p(42)}).`)],
              explicacion: `Más de <span class="hl-rojo">10 escamosas</span> descartan la muestra; los 30 neutrófilos no la salvan (${p(41)}).` + enFicha(ND, 'nep-gram') } },
          { momento: 'Día 6 · el plan', datos: { Plan: 'redactado por un residente' }, nuevo: ['Plan'],
            pregunta: { id: 'nvd-c4', tipo: 'error', fuente: 'nep-cualitativos · nep-mini-bal', origen: CASO,
              enunciado: 'Plan del residente para Casimiro. Hay dos errores. Encuéntralos.',
              frases: [
                { t: 'Repito la muestra respiratoria antes de dar el antibiótico.' },
                { t: 'Un cultivo cualitativo del aspirado con Pseudomonas confirma que es el patógeno.', mal: true, c: `El cualitativo tiene una especificidad del 15-40 %: un positivo no es evidencia fiable del culpable por la contaminación con la boca (${p(42)}).` },
                { t: 'El mini-BAL, al ser a ciegas, rinde menos: espero al broncoscopista.', mal: true, c: `El rendimiento de los cultivos cuantitativos del mini-BAL es equivalente al del BAL broncoscópico (${p(44)}).` },
                { t: 'En el BAL, el umbral de positividad es 10⁴ UFC/mL.' }],
              explicacion: 'Dos errores: dar valor de confirmación a un cultivo cualitativo y esperar al broncoscopio sin necesidad.' + enFicha(ND, 'nep-mini-bal') } },
          { momento: 'Día 6 · el mini-BAL', datos: { 'Mini-BAL': 'tomado antes del antibiótico', Pseudomonas: '2 × 10⁵ UFC/mL (del paciente)' }, nuevo: ['Mini-BAL', 'Pseudomonas'],
            pregunta: { id: 'nvd-c5', tipo: 'test', fuente: 'nep-bal-cuantitativo · nep-tabla-29-4', origen: CASO,
              enunciado: 'El mini-BAL de Casimiro, tomado antes del antibiótico, crece Pseudomonas a 2 × 10⁵ UFC/mL. ¿Qué diagnóstico apoya?',
              opciones: [
                no('Ninguno: con menos de 10⁶ UFC/mL el cultivo cuantitativo no se considera positivo en ningún método', `El umbral del BAL es 10⁴ UFC/mL; 2 × 10⁵ lo supera (${p(43)}).`),
                no('Solo contaminación: un cultivo cuantitativo no distingue colonización de infección', `Con el umbral de 10⁴ el BAL es el cultivo más fiable disponible (razón 9,6), aunque lejos de ser ideal (${p(43)}).`),
                ok('NAV por Pseudomonas: supera el umbral de 10⁴ del BAL, el cultivo más fiable, aunque no ideal')],
              explicacion: `Supera el umbral de <span class="hl-azul">10⁴ UFC/mL</span>; el BAL es el cultivo más fiable, con sensibilidad 71 % y especificidad 80 % (${p(43)}). El tratamiento queda para la ficha siguiente.` + enFicha(ND, 'nep-tabla-29-4') } },
        ],
        lleva: [
          'La clínica no diagnostica la NAV: la razón de probabilidades diagnóstica es de 2 a 3 y se necesita ≥10.' + enFicha(ND, 'nep-tabla-29-3'),
          'El Gram va primero: más de 10 escamosas por campo, la muestra no vale para cultivar.' + enFicha(ND, 'nep-gram'),
          'El BAL (10⁴) es el cultivo más fiable, y se toma antes del antibiótico.' + enFicha(ND, 'nep-tabla-29-4')],
        volver: { nombre: 'Valor de los cultivos cuantitativos', ancla: 'nep-tabla-29-4' } },
    ],
    profundizar: [
      { id: 'nep-nav-psb-intro', titulo: 'Por qué se creó el cepillo protegido' },
      { id: 'nep-nav-autor-prefiere', titulo: 'Lo que prefiere el autor' },
    ],
  },
};

// Reparte la posición de la buena en el orden de escritura (las opciones se barajan solas al pintarlas).
const colocar = (d, pat) => {
  const qs = [...d.guia, ...d.examen, ...d.casos.flatMap(c => c.pasos.map(s => s.pregunta))].filter(q => q.tipo === 'test');
  qs.forEach((q, i) => { const j = q.opciones.findIndex(o => o.ok); const [o] = q.opciones.splice(j, 1); q.opciones.splice(pat[i % pat.length], 0, o); });
  return d;
};
colocar(DATOS[NP], [0, 2, 1, 2, 0, 1]);
colocar(DATOS[ND], [1, 0, 2, 2, 1, 0]);
export const MAYEUTICA_NAV = DATOS;
