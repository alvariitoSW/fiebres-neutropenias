// Mayéutica del bloque 3D, G4b: ficha 9 neumo-o2-toxicidad (Marino cap. 25, págs. 66-73 del PDF), con el caso de Elvira
// (sigue de la ficha 5: intubada, días 2-3). Formato: cabecera de b1-fluidos.js. Plan: autonomo/bloques/b3/estudio-3d/.
// No hay estado del pulmón vivo que enseñe la toxicidad del O₂ (no tiene gases ni radicales): el único «Compruébalo» es el
// del neutrófilo en el capilar vivo; el resto lo hace la vista Visual («Mira»). Las cifras de Elvira son de la ficha o del caso.
const PDF = 'docs/marino-2024-respiratory-management-caps22-26.pdf';
const p = n => `<a class="biblio-link" href="${PDF}#page=${n}" target="_blank" rel="noopener">pág. ${n}</a>`;
const NEU = 'data-especialidad="neumologia" data-view="merinoNeumologia" data-panel="panel-merino-neumo-tabs"';
const enFicha = id => ` <button type="button" class="may-ir" ${NEU} data-tab="neumo-o2-toxicidad" data-resaltar="#${id}">Ver en la ficha ↗</button>`;
const ok = t => ({ t, ok: true });
const no = (t, porque) => ({ t, porque });
const TX = 'neumo-o2-toxicidad';
const ILU = 'ilustrativo: la paciente es inventada; la conducta y las cifras de referencia, de la ficha';

export const MAYEUTICA_OXIGENO_2 = {
  [TX]: {
    entrada: 'El O₂ llega a agua de electrón en electrón y deja radicales por el camino; los antioxidantes los frenan, y por encima del 60 % de FiO₂ el pulmón se lesiona como en un SDRA, antes en el crítico.',
    guia: [
      { id: 'tox-g1', corto: 'radicales', tipo: 'destapa', cuantas: 'son dos cosas', fuente: 'nep-tox-metabolismo · nep-tox-porcentaje',
        enunciado: 'El producto final del O₂ en la mitocondria es agua, inofensiva. ¿Por qué entonces deja radicales por el camino?',
        puntos: [
          `El O₂ acepta <span class="hl">4 electrones</span>, pero solo se le puede añadir <span class="hl-rojo">uno por reacción</span>: hay intermediarios (superóxido, peróxido de hidrógeno, hidroxilo) (${p(66)}).`,
          `Esos intermediarios son ROS que oxidan lípidos, proteínas y ADN; normalmente <span class="hl-verde">≥95 %</span> llega a agua y solo <span class="hl-rojo">~3 %</span> genera ROS dañinas (${p(66)}-${p(67)}).`],
        explicacion: `Figura 25.6: cada paso añade un electrón y deja un intermediario (${p(66)}). La mayor fuente de ROS es la inflamación, no este goteo (${p(67)}).` + enFicha('nep-tox-metabolismo') },
      { id: 'tox-g2', corto: 'peróxido de hidrógeno', tipo: 'test', fuente: 'nep-tox-ros',
        enunciado: 'De las tres ROS de la Figura 25.6, ¿cuál no es un radical libre y aun así es peligrosa por lo lejos que llega?',
        opciones: [
          no('El superóxido: no tiene electrón desapareado y atraviesa las membranas', `El superóxido sí es un radical libre, con un electrón desapareado (${p(66)}). Si lo describes así, buscarás en él un alcance que no tiene.`),
          ok('El peróxido de hidrógeno: oxida con fuerza y cruza las membranas'),
          no('El hidroxilo: no es radical y viaja por todo el cuerpo', `El hidroxilo es radical y actúa dentro de 3 diámetros moleculares de su origen (${p(66)}); no viaja. Confundirlo oculta que el peróxido es el que se reparte lejos.`)],
        explicacion: `El <span class="hl-azul">peróxido de hidrógeno no es radical libre</span>, pero es un oxidante potente que se mueve con facilidad entre células y se distribuye por el cuerpo (${p(66)}).` + enFicha('nep-tox-ros') },
      { id: 'tox-g3', corto: 'el neutrófilo', tipo: 'test', fuente: 'nep-tox-neutrofilos', modelo: { capilarVivo: 'neutrofilo', texto: '🧬 Mira el estallido del neutrófilo: el O₂ ×20 y sus dos destinos' },
        enunciado: 'Un neutrófilo se activa en un tejido inflamado. ¿Qué hace con el O₂ y para qué?',
        opciones: [
          no('Reduce su consumo hasta 20 veces para no producir ROS dañinas', `Es lo contrario: el estallido respiratorio sube el consumo hasta 20 veces para generar ROS (${p(67)}). Si lo ves como un ahorro, no entenderás por qué la inflamación daña el tejido.`),
          ok('Lo consume hasta 20 veces más para fabricar ROS e hipoclorito'),
          no('Lo consume hasta 20 veces más para sintetizar ATP y reparar el tejido', `El estallido está diseñado para generar ROS, no ATP; la mieloperoxidasa añade el hipoclorito, el ingrediente de la lejía (${p(67)}).`)],
        explicacion: `<span class="hl-rojo">Estallido respiratorio</span>: hasta 20 veces más consumo de O₂, para generar ROS; la <span class="hl-azul">mieloperoxidasa</span> produce además hipoclorito (${p(67)}).` + enFicha('nep-tox-neutrofilos') },
      { id: 'tox-g4', corto: 'reacción en cadena', tipo: 'test', fuente: 'nep-tox-cadena',
        enunciado: 'Un shock séptico ya sin infección activa sigue sumando fallos de órganos. ¿Qué mecanismo oxidativo lo explicaría?',
        opciones: [
          ok('Una reacción en cadena de radicales, que continúa tras retirarse el evento que la inició'),
          no('Neutrófilos que siguen fabricando hipoclorito mientras queden bacterias vivas en el foco', `Con la infección erradicada no hay bacterias que mantengan el estallido; la ficha atribuye la progresión a reacciones en cadena que siguen sin el desencadenante (${p(68)}-${p(69)}).`),
          no('Un exceso de antioxidantes plasmáticos que agota el hierro y daña el tejido sano', `Los antioxidantes protegen; el daño viene de oxidantes sin oponer. Esperar que sobren te haría ignorar el estrés oxidativo (${p(71)}).`)],
        explicacion: `Un radical libre quita un electrón a una molécula no radical, que pasa a ser radical y repite el proceso: una <span class="hl-rojo">reacción autosostenida</span>, como un fuego (${p(68)}). Explicaría la progresión del daño multiorgánico tras erradicar la infección (${p(69)}).` + enFicha('nep-tox-cadena') },
      { id: 'tox-g5', corto: 'la SOD', tipo: 'test', fuente: 'nep-sod-enzima',
        enunciado: 'La superóxido dismutasa se considera un antioxidante. ¿Por qué la ficha dice que a la vez puede actuar como pro-oxidante?',
        opciones: [
          no('Porque convierte el peróxido en hidroxilo cuando encuentra hierro', `Esa reacción la cataliza el Fe²⁺ (Figura 25.6), no la SOD. Atribuírsela a la enzima te llevaría a dar hierro como antídoto.`),
          no('Porque oxida el glutatión a su forma GSSG al retirar el superóxido', `La oxidación del glutatión sale de la reacción con el peróxido (Ecuación 25.2, ${p(70)}), no de la SOD.`),
          ok('Porque al quitar superóxido produce peróxido de hidrógeno')],
        explicacion: `La SOD elimina el superóxido, pero <span class="hl-azul">aumenta la producción de peróxido de hidrógeno</span> (${p(69)}). Por eso puede actuar también como pro-oxidante.` + enFicha('nep-sod-enzima') },
      { id: 'tox-g6', corto: 'NAC y glutatión', tipo: 'destapa', cuantas: 'son tres cosas', fuente: 'nep-tox-glutation · nep-tox-nac',
        enunciado: 'El glutatión del crítico está bajo. ¿Por qué se piensa en N-acetilcisteína y no en dar glutatión?',
        puntos: [
          `El glutatión es el <span class="hl-purpura">principal antioxidante intracelular</span>, está reducido en el crítico, y en el lavado pulmonar hay 140 veces más que en plasma (${p(70)}).`,
          `El glutatión exógeno <span class="hl-rojo">no entra fácilmente en las células</span> y apenas cambia el nivel intracelular (${p(70)}).`,
          `La N-acetilcisteína es un análogo que <span class="hl-verde">cruza las membranas</span> y sirve como sustituto (${p(70)}).`],
        explicacion: `La prueba que cita la ficha es el efecto de la N-acetilcisteína en la toxicidad por acetaminofén, atribuida a deficiencia de glutatión (${p(70)}).` + enFicha('nep-tox-nac') },
      { id: 'tox-g7', corto: 'selenio', tipo: 'test', fuente: 'nep-tox-selenio',
        enunciado: 'El selenio se repone en el crítico. ¿Qué papel tiene y cuánto se recomienda a diario en un adulto?',
        opciones: [
          no('Es cofactor de la SOD, con una cantidad diaria recomendada de 55 µg', `La SOD no lo necesita; el selenio es cofactor de la glutatión peroxidasa (${p(70)}). Con ese error buscarías el efecto en el superóxido y no en el peróxido.`),
          ok('Es cofactor de la glutatión peroxidasa, con una cantidad diaria recomendada de 55 µg'),
          no('Es cofactor de la glutatión peroxidasa, con una cantidad diaria recomendada de 1000 µg', `1000 µg IV es la dosis alta de los estudios en sepsis, no la cantidad diaria recomendada, que es de 55 µg (${p(70)}).`)],
        explicacion: `Sin selenio en la dieta, la actividad de la glutatión peroxidasa baja de forma medible en <span class="hl-rojo">1 semana</span>; su RDA es <span class="hl">55 µg</span> al día (${p(70)}).` + enFicha('nep-tox-selenio') },
      { id: 'tox-g8', corto: 'vitaminas E y C', tipo: 'test', fuente: 'nep-tox-vit-e · nep-tox-vit-c',
        enunciado: 'Vitaminas E y C: ¿cómo cooperan y qué nivel plasmático de E indica déficit?',
        opciones: [
          no('La E regenera a la C; déficit de E por debajo de 1 mg/dL', `La relación va al revés, y 1 mg/dL es el valor normal, no el de déficit (${p(70)}-${p(71)}). Con eso tratarías como deficiente a un paciente normal.`),
          no('La C rompe la cadena de peroxidación; déficit de E por debajo de 0,5 mg/dL', `La que rompe la cadena en las membranas es la vitamina E, liposoluble; la C es hidrosoluble y la regenera (${p(70)}-${p(71)}).`),
          ok('La C regenera a la E; déficit de E por debajo de 0,5 mg/dL')],
        explicacion: `La E es el antioxidante «rompedor de cadenas» de la peroxidación lipídica; la C <span class="hl-azul">dona electrones para regenerar la E</span> desde su radical inactivo. E normal: 1 mg/dL; <span class="hl-rojo"><0,5 mg/dL</span> es deficiencia (${p(70)}-${p(71)}).` + enFicha('nep-tox-vit-e') },
      { id: 'tox-g9', corto: 'hierro libre', tipo: 'test', fuente: 'nep-tox-cerulo',
        enunciado: 'El hierro libre reducido favorece el hidroxilo. ¿Cómo lo limitan las proteínas del plasma?',
        opciones: [
          ok('La ceruloplasmina oxida el Fe²⁺ a Fe³⁺ y la transferrina une el Fe³⁺'),
          no('Las dos reducen el Fe³⁺ a Fe²⁺ para que la SOD lo retire', `Reducir el hierro lo vuelve catalizador del hidroxilo, lo contrario de lo que protege (${p(71)}).`),
          no('La transferrina oxida el Fe²⁺ y la ceruloplasmina une el Fe³⁺', `Están invertidos: la ceruloplasmina oxida y la transferrina une (${p(71)}). Con ese error predecirías el efecto contrario al comprobar sus niveles.`)],
        explicacion: `<span class="hl-azul">Ceruloplasmina: Fe²⁺ → Fe³⁺; transferrina: une el Fe³⁺.</span> Juntas explican la mayor parte de la actividad antioxidante del plasma, lo que puede explicar que casi todo el hierro del cuerpo esté unido o secuestrado (${p(71)}).` + enFicha('nep-tox-cerulo') },
      { id: 'tox-g10', corto: 'estrés oxidativo', tipo: 'test', fuente: 'nep-tox-estres',
        enunciado: 'En una sepsis persistente, ¿cuándo se dice que hay estrés oxidativo?',
        opciones: [
          no('Cuando la FiO₂ supera el 60 %, sean cuales sean los antioxidantes del paciente', `El umbral único ignora los antioxidantes, que son los que deciden el riesgo (${p(72)}).`),
          ok('Cuando la actividad oxidante supera la capacidad neutralizadora de los antioxidantes'),
          no('Cuando aparecen ROS, aunque los antioxidantes las neutralicen por completo', `Un ~3 % del metabolismo del O₂ genera ROS en condiciones normales y los antioxidantes las controlan (${p(67)}); es el desequilibrio lo que lesiona.`)],
        explicacion: `El riesgo lo marca el <span class="hl">balance</span>: oxidación sin oponer = estrés oxidativo, fuente principal de la lesión oxidativa (${p(71)}). El ejemplo típico es la inflamación grave en el crítico.` + enFicha('nep-tox-estres') },
      { id: 'tox-g11', corto: 'nota sobre la FiO₂', tipo: 'error', fuente: 'nep-tox-fio2 · nep-tox-pulmonar',
        enunciado: 'Una nota sobre la FiO₂ en el paciente crítico tiene dos errores. Encuéntralos.',
        frases: [
          { t: 'El umbral de toxicidad del 60 % salió de observar una capacidad vital disminuida por encima de esa FiO₂.' },
          { t: 'Una FiO₂ del 60 % es segura en el paciente crítico, igual que en el sano.', mal: true, c: `La depleción de antioxidantes es común en la UCI y es razonable asumir que su nivel tóxico es mucho más bajo (${p(72)}).` },
          { t: 'La lesión de la toxicidad por O₂ es distinta de la del SDRA, así que no se confunde con ella.', mal: true, c: `Es una lesión pulmonar inflamatoria similar al SDRA (${p(71)}).` },
          { t: 'Lo razonable es mantener la FiO₂ en el nivel tolerable más bajo.' }],
        explicacion: `Un umbral único (60 %) no cuenta los antioxidantes del paciente; y la toxicidad por O₂ y el SDRA se parecen tanto que un SDRA que progresa con O₂ alto podría ser la propia toxicidad (${p(71)}-${p(72)}).` + enFicha('nep-tox-fio2') },
      { id: 'tox-g12', corto: 'cóctel antioxidante', tipo: 'test', fuente: 'nep-tox-coctel',
        enunciado: 'En traumatizados, ¿qué cóctel antioxidante se asoció con menos fallo respiratorio y menos dependencia del ventilador?',
        opciones: [
          no('Vitamina C 1000 mg y E 1000 unidades al día, y selenio 1000 µg IV al día, 7 días', `Mezcla las dosis: la C y la E del estudio son cada 8 h, y el selenio, 200 µg al día; los 1000 µg IV son de los estudios en sepsis (${p(70)}, ${p(72)}).`),
          ok('Vitamina C 1000 mg y E 1000 unidades cada 8 h, y selenio 200 µg al día, 7 días'),
          no('Vitamina C 1000 mg y E 1000 unidades cada 8 h, y selenio 200 µg al día, 28 días', `La duración del estudio fue de 7 días; alargarla a 28 no tiene respaldo en la ficha (${p(72)}).`)],
        explicacion: `Cóctel en dosis altas: <span class="hl">vitamina C 1000 mg cada 8 h, vitamina E 1000 unidades cada 8 h y selenio 200 µg al día durante 7 días</span> (${p(72)}). La ficha lo compara con sellar herméticamente los alimentos.` + enFicha('nep-tox-coctel') },
      { id: 'tox-g13', corto: 'O₂ y aporte', tipo: 'destapa', cuantas: 'son dos cosas', fuente: 'nep-tox-ec-25-3 · nep-tox-vasoconstrictor',
        enunciado: 'Ecuación 25.3: DO₂ = CaO₂ × GC. ¿Por qué el aporte de O₂ no sube con O₂ inhalado?',
        puntos: [
          `El O₂ inhalado <span class="hl-verde">sube el CaO₂</span>, pero la vasoconstricción sistémica que provoca <span class="hl-rojo">baja el GC</span>: el aporte queda sin cambios (${p(72)}).`,
          `Esa vasoconstricción se puede ver como una <span class="hl-azul">defensa antioxidante</span>: protege a los tejidos del O₂ que sobra (${p(72)}-${p(73)}).`],
        explicacion: `Por eso la inhalación de O₂ no cambia el metabolismo aeróbico (Figura 25.2) (${p(72)}). La ficha concluye que el uso liberal del oxígeno va contra lo que el cuerpo humano parece diseñado para tolerar (${p(73)}).` + enFicha('nep-tox-vasoconstrictor') }
    ],
    examen: [
      { id: 'tox-e1', corto: 'qué fracción', tipo: 'test', fuente: 'nep-tox-porcentaje',
        enunciado: 'En condiciones normales, ¿qué parte del metabolismo del O₂ genera ROS dañinas?',
        opciones: [
          no('Cerca del 30 %: siete de cada diez moléculas llegan a agua', `Con ese reparto el metabolismo normal sería una agresión continua; la ficha da ≥95 % a agua (${p(67)}).`),
          ok('Cerca del 3 %: al menos el 95 % llega por completo a agua'),
          no('Cerca del 10 %: nueve de cada diez moléculas llegan a agua', `La ficha da una fracción muy pequeña (~3 %), con al menos el 95 % a agua (${p(67)}).`)],
        explicacion: `Al menos el <span class="hl-verde">95 %</span> se reduce a agua y solo <span class="hl-rojo">~3 %</span> genera ROS dañinas; la fuente mayor es la inflamación (${p(67)}).` + enFicha('nep-tox-porcentaje') },
      { id: 'tox-e2', corto: 'la más reactiva', tipo: 'test', fuente: 'nep-tox-ros',
        enunciado: 'Una ROS reacciona dentro de 3 diámetros moleculares de su origen y es la más reactiva de la bioquímica. ¿Cuál es y qué favorece su formación?',
        opciones: [
          no('El superóxido, que se forma cuando la SOD está activa', `El superóxido es radical y reactivo, pero no es la más reactiva ni la de alcance tan corto (${p(66)}). La SOD lo retira.`),
          no('El peróxido de hidrógeno, que se forma con glutatión reducido', `El peróxido no es radical y viaja lejos; el glutatión lo reduce a agua (${p(66)}, ${p(70)}).`),
          ok('El hidroxilo, que se forma con hierro libre reducido (Fe²⁺)')],
        explicacion: `El <span class="hl-rojo">hidroxilo</span> es la molécula más reactiva conocida en bioquímica y una fuente principal de lesión inducida por oxidantes; el <span class="hl-azul">Fe²⁺</span> cataliza su formación (${p(66)}-${p(67)}).` + enFicha('nep-tox-ros') },
      { id: 'tox-e3', corto: 'rangos de selenio', tipo: 'test', fuente: 'nep-tox-selenio', origen: 'ficha: rangos de la pág. 70',
        enunciado: 'Para monitorizar el selenio, ¿qué rangos normales da la ficha?',
        opciones: [
          ok('Sangre completa 0,96-1,78; sérico 0,72-1,33 µmol/L'),
          no('Selenio en sangre completa 0,72-1,33 µmol/L y selenio sérico 0,96-1,78 µmol/L, al revés', `Están intercambiados: el rango más alto corresponde a sangre completa (${p(70)}). Con eso darías por normal un sérico bajo.`),
          no('El mismo rango en las dos muestras, 0,72-1,33 µmol/L, sea sérico o de sangre completa', `La ficha da dos rangos distintos según la muestra (${p(70)}). Un solo rango infraestimaría un déficit en sangre completa.`)],
        explicacion: `Rangos normales: <span class="hl">sangre completa 0,96-1,78 µmol/L</span>; <span class="hl">sérico 0,72-1,33 µmol/L</span> (${p(70)}).` + enFicha('nep-tox-selenio') },
      { id: 'tox-e4', corto: '6-12 horas', tipo: 'test', fuente: 'nep-tox-humanos',
        enunciado: 'Voluntarios sanos respiran O₂ al 100 % durante 6 a 12 horas. ¿Qué se ve?',
        opciones: [
          no('Nada medible: los primeros signos aparecen a las 48 h', `A las 6-12 h ya hay traqueobronquitis y menos capacidad vital (${p(72)}); esperar a las 48 h dejaría pasar la lesión.`),
          no('Una lesión pulmonar inflamatoria ya establecida, como un SDRA', `La lesión inflamatoria se describe tras 3-4,5 días de exposición prolongada (${p(72)}).`),
          ok('Traqueobronquitis y menos capacidad vital')],
        explicacion: `A las 6-12 h: <span class="hl">traqueobronquitis</span> y descenso de la capacidad vital atribuido a atelectasia por absorción. La exposición prolongada (3-4 días en 5 pacientes con coma irreversible; 4,5 días en 1 voluntario) dio lesión pulmonar inflamatoria (${p(72)}).` + enFicha('nep-tox-humanos') },
      { id: 'tox-e5', corto: 'origen del 60 %', tipo: 'test', fuente: 'nep-tox-fio2',
        enunciado: '¿De qué observación sale el umbral de toxicidad del 60 % de FiO₂?',
        opciones: [
          ok('De una capacidad vital disminuida por encima de ese valor'),
          no('De ratas que mueren a los 5-7 días con esa FiO₂ mantenida', `Las ratas mueren a los 5-7 días con O₂ al 100 %, no al 60 % (${p(71)}).`),
          no('De la PaO₂ alcanzada con esa FiO₂ en voluntarios sanos', `El umbral no se midió con la PaO₂, sino con la capacidad vital (${p(72)}).`)],
        explicacion: `<span class="hl">Capacidad vital disminuida por encima del 60 %</span> (${p(72)}). Un umbral único olvida los antioxidantes del paciente; en el crítico el nivel tóxico es mucho más bajo.` + enFicha('nep-tox-fio2') },
      { id: 'tox-e6', corto: 'especies', tipo: 'test', fuente: 'nep-tox-especies',
        enunciado: 'Con O₂ puro mantenido, ¿cómo se comparan las especies estudiadas?',
        opciones: [
          no('Los humanos sanos muestran lesión inflamatoria a las 12 h, como las ratas', `A las 12 h hay traqueobronquitis y atelectasia; las ratas tardan 5-7 días en morir (${p(71)}-${p(72)}).`),
          no('Las tortugas marinas mueren a la semana, igual que los primates', `Las tortugas resisten semanas e incluso meses sin daño (${p(71)}).`),
          ok('Ratas: mueren en 5-7 días; primates no humanos: toxicidad en torno a 1 semana')],
        explicacion: `Ratas: fallo respiratorio a los <span class="hl">5-7 días</span> con O₂ al 100 %; primates no humanos: signos tras aproximadamente <span class="hl">1 semana</span>; tortugas marinas: semanas o meses sin daño (${p(71)}).` + enFicha('nep-tox-especies') }
    ],
    casos: [
      { id: 'c-tox-elvira', titulo: 'Elvira, 45 años: demasiado oxígeno', corto: 'Caso · Elvira (días 2-3)', sub: 'intubada con FiO₂ alta; antioxidantes y toxicidad por O₂',
        paciente: { Edad: '45 años, mujer', 'Peso y talla': '58 kg, 1,60 m (PBW 52,4 kg)', Antecedente: 'trasplante renal, inmunosuprimida', Motivo: 'neumonía con SDRA, ya intubada (ver la ficha de SDRA no ventilatorio)' },
        pasos: [
          { momento: 'Día 2', datos: { Oxígeno: 'FiO₂ 0,8 desde hace 36 h', SpO2: '97 %', 'PaO₂/FiO₂': '150' }, nuevo: ['Oxígeno', 'SpO2', 'PaO₂/FiO₂'],
            pregunta: { id: 'tox-c1', tipo: 'error', fuente: 'nep-tox-fio2 · nep-tox-coctel', origen: ILU,
              enunciado: 'El R1 anota su plan de oxigenación para Elvira. Hay dos errores. Encuéntralos.',
              frases: [
                { t: 'Con SpO₂ 97 % y FiO₂ 0,8, la oxigenación es óptima: mantengo la FiO₂ actual.', mal: true, c: `Su objetivo es SpO₂ 88-95 % con la FiO₂ más baja posible (Tabla 24.5, ${p(48)}); el nivel tolerable más bajo es la mejor práctica (${p(72)}).` },
                { t: 'Mientras trato el SDRA, los niveles de antioxidantes no importan.', mal: true, c: `En el crítico hay depleción de antioxidantes: se monitorizan y se corrigen para reducir el riesgo de toxicidad (${p(72)}).` },
                { t: 'En cuanto la SpO₂ lo permita, bajo la FiO₂ por debajo de 0,6.' },
                { t: 'Pido selenio sérico para ver si hay déficit.' }],
              explicacion: 'La SpO₂ de 97 % sobra: es una exposición al O₂ sin beneficio. Y los antioxidantes bajos son parte del riesgo.' + enFicha('nep-tox-fio2') } },
          { momento: 'Día 2 · la razón', datos: { Oxígeno: 'FiO₂ 0,8', 'En una sana': 'umbral clásico 60 %' }, nuevo: ['En una sana'],
            pregunta: { id: 'tox-c2', tipo: 'destapa', cuantas: 'son tres cosas', fuente: 'nep-toxicidad-aviso · nep-tox-fio2', origen: 'ficha: las tres observaciones; la paciente es inventada',
              enunciado: '¿Por qué Elvira está más expuesta a la toxicidad por O₂ que una persona sana con la misma FiO₂?',
              puntos: [
                `Los pacientes críticos son <span class="hl-rojo">deficientes en antioxidantes</span> protectores, como el glutatión (${p(41)}).`,
                `Los niveles altos de O₂ <span class="hl-azul">aceleran los efectos dañinos de la ventilación mecánica</span> (${p(41)}).`,
                `La lesión de la toxicidad por O₂ es <span class="hl">muy parecida al SDRA</span> («idéntica» en la pág. 41, «similar» en la pág. 71): un SDRA que progresa con O₂ alto podría ser la propia toxicidad (${p(41)}, ${p(71)}).`],
              explicacion: `Estas tres observaciones sostienen limitar el O₂ inhalado cuando se pueda (${p(41)}).` + enFicha('nep-tox-fio2') } },
          { momento: 'Día 2 · laboratorio', datos: { 'Selenio sérico': '0,5 µmol/L (normal 0,72-1,33)', Cuadro: 'sepsis grave de origen pulmonar' }, nuevo: ['Selenio sérico', 'Cuadro'],
            pregunta: { id: 'tox-c3', tipo: 'test', fuente: 'nep-tox-selenio', origen: ILU,
              enunciado: 'El selenio sérico de Elvira es 0,5 µmol/L, con sepsis grave. ¿Qué dice la ficha sobre reponerlo y con qué dosis?',
              opciones: [
                no('Esperar y repetir el nivel: un selenio sérico de 0,5 µmol/L es esperable en el crítico y no se repone', `Está bajo el rango normal (0,72-1,33 µmol/L); el selenio suele ser bajo en el crítico y su reposición se asoció con mejor supervivencia en sepsis (${p(70)}).`),
                ok('Reponerlo IV: el libro da 1000 µg/día (más supervivencia) y 200 µg/día (dosis segura), sin conciliarlas'),
                no('Reponer 55 µg IV diarios, la cantidad diaria recomendada, y repetir el nivel en unos días para ver si corrige', `55 µg es la RDA de la dieta, no la dosis de reposición del estudio en sepsis (${p(70)}). Con ella el déficit se corregiría muy despacio.`)],
              nota: `<b>Nota de fidelidad.</b> El libro da dos cifras de selenio IV que no encajan entre sí en la misma página: 1000 µg diarios (asociada a mejor supervivencia en sepsis grave y shock séptico) y 200 µg diarios (la dosis más alta considerada segura) (${p(70)}). No las concilia, y la app tampoco elige una como pauta.`,
              explicacion: `Selenio bajo en el crítico: la reposición de dosis altas (1000 µg IV al día) se asoció con mejor supervivencia en sepsis grave; puede darse como selenito de sodio y la dosis más alta considerada segura es de 200 µg al día (${p(70)}).` + enFicha('nep-tox-selenio') } },
          { momento: 'Día 2 · noche', datos: { Plan: 'reforzar el glutatión intracelular' }, nuevo: ['Plan'],
            pregunta: { id: 'tox-c4', tipo: 'test', fuente: 'nep-tox-nac', origen: ILU,
              enunciado: 'Quieres reforzar el glutatión de Elvira. ¿Qué opción sigue la ficha?',
              opciones: [
                no('Glutatión en perfusión: llega íntegro a la célula y sube su nivel intracelular', `El glutatión exógeno tiene poco efecto sobre los niveles intracelulares (${p(70)}); lo que esperas de él no llega a la célula.`),
                no('Vitamina C sola, porque regenera el glutatión oxidado', `La vitamina C regenera la vitamina E, no el glutatión (${p(71)}); no repone lo que falta dentro de la célula.`),
                ok('N-acetilcisteína, un análogo del glutatión que cruza la membrana')],
              explicacion: `La N-acetilcisteína sirve como sustituto del glutatión; la ficha dice que tiene un <span class="hl-verde">futuro prometedor</span> en el crítico, es decir, no es una pauta establecida (${p(70)}).` + enFicha('nep-tox-nac') } },
          { momento: 'Día 3', datos: { Oxígeno: 'FiO₂ 0,8 desde hace 60 h', 'PaO₂/FiO₂': '150 → 120' }, nuevo: ['PaO₂/FiO₂'],
            pregunta: { id: 'tox-c5', tipo: 'test', fuente: 'nep-tox-pulmonar · nep-toxicidad-aviso', origen: ILU,
              enunciado: 'El equipo mantuvo la FiO₂ en 0,8 y la P/F de Elvira cayó de 150 a 120. ¿Progresa el SDRA o es el oxígeno?',
              opciones: [
                ok('No se puede asegurar cuál de los dos es; hay que limitar el O₂ al mínimo tolerable'),
                no('Es la toxicidad por O₂, y la distingue un patrón propio de lesión', `La lesión es similar al SDRA (${p(72)}); no hay un patrón que las separe, y afirmarlo llevaría a no revisar la FiO₂.`),
                no('Es el SDRA: el O₂ solo daña tras más de una semana en humanos', `En humanos hay lesión inflamatoria a los 3-4,5 días de O₂ puro (${p(72)}), y el O₂ alto acelera el daño de la ventilación mecánica (${p(41)}).`)],
              nota: `<b>Nota de fidelidad.</b> El libro dice «idéntica al SDRA» en la pág. 41 y «similar al SDRA» en la pág. 71. Se reproducen las dos; la conducta no cambia (${p(41)}, ${p(71)}).`,
              explicacion: `Los casos de SDRA que progresan con O₂ alto <span class="hl-rojo">podrían ser la propia toxicidad</span>, porque las lesiones se parecen tanto (${p(41)}, ${p(71)}). La conducta es la misma: la FiO₂ más baja tolerable (${p(72)}).` + enFicha('nep-tox-pulmonar') } },
          { momento: 'Día 3 · giro', datos: { SpO2: '97 %', 'CaO₂ (ilustrativo)': '150 → 160 mL/L con FiO₂ 1,0', 'GC (ilustrativo)': '5 → 4,7 L/min', Propuesta: 'subir la FiO₂ a 1,0 «para mejorar el aporte de O₂»' }, nuevo: ['CaO₂ (ilustrativo)', 'GC (ilustrativo)', 'Propuesta'],
            pregunta: { id: 'tox-c6', tipo: 'test', fuente: 'nep-tox-ec-25-3 · nep-tox-vasoconstrictor', origen: ILU,
              enunciado: 'Con la P/F en 120, un compañero propone subir la FiO₂ a 1,0 «para mejorar el aporte de O₂». Con FiO₂ 1,0 el CaO₂ de Elvira pasa de 150 a 160 mL/L y su GC de 5 a 4,7 L/min. ¿Cuánto cambia el DO₂ (Ecuación 25.3)?',
              opciones: [
                no('Sube cerca de un 7 %: de 750 a 800 mL/min, porque el CaO₂ sube de 150 a 160', `Olvida el GC: 160 × 4,7 son 752 mL/min, no 800. El O₂ inhalado vasoconstriñe y baja el gasto cardíaco (${p(72)}); contar con un GC constante sobreestima el beneficio.`),
                ok('Casi nada: 150 × 5 = 750 y 160 × 4,7 = 752 mL/min; el CaO₂ sube y el GC baja'),
                no('Baja cerca de un 10 %, a unos 680 mL/min, porque el O₂ inhalado no sube el CaO₂', `El CaO₂ sí sube (150 a 160 mL/L) y 160 × 4,7 son 752 mL/min (${p(72)}); suponer que no sube te haría quitar el O₂ a quien lo necesita.`)],
              nota: `<b>Nota de fidelidad.</b> La ficha lo afirma en general (${p(72)}), con respaldo medido en EPOC hipoxémica (Figura 25.2, ${p(60)}), no en SDRA ventilado. Las cifras de Elvira son ilustrativas.`,
              explicacion: `Ecuación 25.3: <span class="hl">DO₂ = CaO₂ × GC</span>. El aporte no cambia (${p(72)}), mientras se suma más exposición a ROS. Elvira necesita limitar el O₂, no aumentarlo.` + enFicha('nep-tox-ec-25-3') } }
        ],
        lleva: ['El umbral del 60 % no vale igual para el crítico: con los antioxidantes bajos, la FiO₂ tolerable es menor.', 'Selenio, N-acetilcisteína y el cóctel de vitaminas son el flanco antioxidante; la FiO₂ mínima tolerable, el principal.', 'Más O₂ no sube el aporte (Ecuación 25.3) y la toxicidad por O₂ se parece tanto al SDRA que no se separan.'],
        volver: { nombre: 'FiO₂ tóxica', ancla: 'nep-tox-fio2', modelo: { capilarVivo: 'neutrofilo', texto: '🧬 Mira el estallido del neutrófilo' } } }
    ],
    profundizar: [
      { id: 'nep-tox-intro', titulo: 'El O₂ también es fuente de lesión celular' },
      { id: 'nep-tox-estres', titulo: 'Medir el estrés oxidativo en el gas exhalado' },
      { id: 'nep-tox-final', titulo: 'El cuerpo humano está diseñado para protegerse del O₂' }
    ]
  }
};
