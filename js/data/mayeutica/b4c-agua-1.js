// Mayéutica del bloque 4, sub-bloque 4C · El agua y el sodio, parte 1 (Marino cap. 35, págs. 1-8): fichas 12 (osmolalidad) y 13
// (hipernatremia) y el caso de Nicolás en dos partes. Datos puros; el formato está en la cabecera de b1-fluidos.js.
// Las fichas están en js/modules/libros/marino-renal.html. Modelo vivo: río y mar, estados osmolalidad, hipernatremia, di y
// furosemida-glucosado (js/data/agua-viva-data.js). Las cifras de Nicolás son dato del caso; la medicina, de la fuente.
const PDF = 'docs/marino-2024-electrolitos-caps35-38.pdf';
const pag = (n, txt) => `<a class="biblio-link" href="${PDF}#page=${n}" target="_blank" rel="noopener">${txt || `PDF pág. ${n}`}</a>`;
const p = n => pag(n, `pág. ${n}`);
// «Ver en la ficha» dentro de una nota (REGLAS §7.9): el enlace cruzado de siempre al párrafo exacto.
const enFicha = (tab, id) => ` <button type="button" class="may-ir" data-especialidad="libros" data-view="marinoRenal" data-panel="panel-marino-renal-tabs" data-tab="${tab}" data-resaltar="#${id}">Ver en la ficha ↗</button>`;
const av = clave => ({ aguaViva: clave });

export const MAYEUTICA_B4C_1 = {
  /* =================================================================================================
     Ficha 12 · Actividad osmótica y osmolalidad plasmática (cap. 35, págs. 1-4)
     ================================================================================================= */
  'mr-osmolalidad': {
    entrada: 'Por qué la urea no mueve agua y el sodio sí, cómo se calcula la osmolalidad medida, la calculada y la efectiva, y por qué el sodio manda casi todo.',
    guia: [
      { id: 'osm-g1', corto: 'urea y sodio', tipo: 'test', fuente: 'mr-osm-efectiva · mr-osm-efectiva-calc', modelo: av('osmolalidad'),
        enunciado: 'Antes de leer: un paciente con insuficiencia renal tiene una urea muy alta, y otro tiene el sodio muy alto. ¿Cuál de los dos tiene el plasma hipertónico, el que saca agua de las células?',
        opciones: [
          { t: 'Solo el del sodio alto: la urea cruza las membranas y no crea diferencia de actividad entre dentro y fuera', ok: true },
          { t: 'Los dos: cualquier soluto que sube en el plasma aumenta la tonicidad y encoge las células, tenga o no que cruzar la membrana', porque: `Solo mueve agua el soluto que no cruza la membrana. La urea la cruza con facilidad (${p(4)}). Si crees que la uremia encoge las células, tratarás de «bajarla» con agua libre y no hace falta.` },
          { t: 'Solo el de la urea alta, porque pesa más que el sodio', porque: `El peso no importa: la actividad osmótica depende del número de partículas, no de su tamaño ni su química (${p(1)}). Y la urea, al cruzar, no arrastra agua (${p(4)}).` }],
        explicacion: `La fuerza que mueve el agua es la actividad osmótica <span class="hl">efectiva</span>: la diferencia entre compartimentos cuando la membrana no deja pasar libremente el soluto (${p(2)}). La urea cruza las membranas: <span class="hl-rojo">la uremia es hiperosmótica, pero no hipertónica</span> (${p(4)}). Un extracelular hipertónico saca agua de las células; uno hipotónico la mete (${p(2)}).` },
      { id: 'osm-g2', corto: 'qué cuenta', tipo: 'test', fuente: 'mr-osm-coligativa',
        enunciado: 'La osmolalidad es una propiedad «coligativa». ¿De qué depende?',
        opciones: [
          { t: 'Del peso de cada soluto en gramos: una molécula grande como la albúmina mueve más agua que otra pequeña', porque: `No es el peso total sino las partículas (${p(1)}). Pensar en gramos lleva a creer que la albúmina, que pesa mucho, mueve más agua que el sodio, cuando mueve muy poca.` },
          { t: 'Del número de partículas de soluto en el solvente, sin importar su carga, tamaño o química', ok: true },
          { t: 'De la carga eléctrica de los iones: los neutros no cuentan', porque: `La carga no importa (${p(1)}). La glucosa y la urea no tienen carga y suman osmolalidad igual que el sodio.` }],
        explicacion: `Propiedad coligativa: <span class="hl">solo cuenta el número de partículas</span> por volumen de solvente; la actividad total es la suma de todas (${p(1)}).` },
      { id: 'osm-g3', corto: 'glucosa a mOsm', tipo: 'test', fuente: 'mr-osm-conversion',
        enunciado: 'Predice: la glucosa pesa 180 y no se disocia. Con una glucemia de 90 mg/dL, ¿cuántos mOsm/kg de agua aporta?',
        opciones: [
          { t: '0,5 mOsm/kg: son 90 mg en un decilitro, una cantidad pequeña', porque: `Falta convertir a litro (×10) y a mol (÷ 180): son 5 mOsm/kg (${p(3)}). Quedarse en 0,5 hace creer que la glucosa no cuenta, y en la hiperglucemia grave sí cuenta.` },
          { t: '90 mOsm/kg: los mg/dL ya son la unidad de osmolalidad', porque: `Los mg/dL hay que convertirlos con la Ecuación 35.2 (${p(3)}). Si lo sumaras tal cual, la glucosa normal parecería aportar tanto como todo el sodio.` },
          { t: '5 mOsm/kg: (90 × 10 / 180) × 1', ok: true }],
        explicacion: `Ecuación 35.2: (mg/dL × 10 ÷ peso molecular) × n. Para la glucosa de 90 mg/dL: (90 × 10 / 180) × 1 = <span class="hl">5 mOsm/kg H₂O</span> (${p(3)}). Para un ion univalente como el sodio, los mEq/L equivalen a mOsm/kg (${p(3)}).` },
      { id: 'osm-g4', corto: 'Posm calculada', tipo: 'test', fuente: 'mr-osm-calculada · mr-osm-calc', modelo: av('osmolalidad'),
        enunciado: 'Con Na⁺ 140 mEq/L, glucosa 90 mg/dL y BUN 14 mg/dL, ¿cuánto da la osmolalidad calculada y por qué se duplica el sodio?',
        opciones: [
          { t: '290: 2 × 140 + 90/18 + 14/2,8; el sodio se duplica por los aniones (sobre todo cloro) que lo acompañan', ok: true },
          { t: '285: el sodio se duplica porque cada ion lleva dos cargas', porque: `El 285 es la osmolalidad efectiva, sin la urea (${p(4)}). Y el sodio se duplica por los aniones que lo acompañan (sobre todo cloro), no por su carga.` },
          { t: '280: solo el sodio duplicado; la glucosa y la urea no suman nada en la práctica', porque: `Suman 5 y 5 mOsm/kg (${p(4)}). El 280 es la cifra sin glucosa de la Ecuación 35.4 (${p(4)}), no la calculada completa.` }],
        explicacion: `Ecuación 35.3: Posm = 2 × Na + glucosa/18 + BUN/2,8 = 280 + 5 + 5 = <span class="hl">290 mOsm/kg</span>, dentro del rango medido normal (285-295). 18 y 2,8 son los pesos moleculares de la glucosa y la urea entre 10; el sodio se duplica por los iones negativos que lo equilibran (${p(4)}).` },
      { id: 'osm-g5', corto: 'el 98 % del sodio', tipo: 'destapa', cuantas: 'son dos cosas', fuente: 'mr-sodio-98', modelo: av('osmolalidad'),
        enunciado: 'Quita la glucosa de la osmolalidad efectiva: te quedan 280 de 285. ¿Qué dos cosas dice el libro que demuestra eso?',
        puntos: [
          `El sodio explica el <span class="hl">98 %</span> de la osmolalidad plasmática efectiva.`,
          `La concentración de sodio extracelular es <span class="hl-azul">el principal determinante</span> de cómo se reparte el agua del cuerpo entre dentro y fuera de las células y, por tanto, del volumen extracelular.`],
        explicacion: `«Spotlight on sodium» (${p(4)}): 280 es el 98 % de 285. De ahí que casi todos los problemas de agua se lean como problemas del sodio.` },
      { id: 'osm-g6', corto: 'cómo se mide', tipo: 'test', fuente: 'mr-osm-patron',
        enunciado: 'El laboratorio mide la osmolalidad con la depresión del punto de congelación. ¿Cuánto baja y cuál es el valor normal?',
        opciones: [
          { t: 'El agua pura congela a 0 °C y baja 1,86 °C por cada mOsm; normal 250-280 mOsm/kg', porque: `Es por osmol, no por miliosmol, y el rango normal es 285-295 (${p(3)}). Con 250-280 un plasma normal parecería hipoosmolar y se tratarían sodios normales.` },
          { t: 'El agua pura congela a 0 °C y baja 1,86 °C por cada osmol en un kilo de agua; normal 285-295 mOsm/kg', ok: true },
          { t: 'Se mide por la presión osmótica de la sangre en un tubo cerrado, con un manómetro; el valor normal sería de 300-310', porque: `El método patrón es la depresión del punto de congelación (${p(3)}), y el normal es 285-295. Con 300-310 se daría por normal una hiperosmolalidad leve.` }],
        explicacion: `Método de referencia: <span class="hl">depresión del punto de congelación</span>, disponible en casi todos los laboratorios; normal <span class="hl">285-295 mOsm/kg H₂O</span> (${p(3)}).` },
    ],
    examen: [
      { id: 'osm-e1', corto: 'osmolalidad efectiva', tipo: 'test', fuente: 'mr-osm-efectiva-calc',
        enunciado: 'Paciente con Na⁺ 140, glucosa 90 y BUN 14. ¿Cuál es su osmolalidad efectiva y por qué no incluye la urea?',
        opciones: [
          { t: '290: la efectiva es igual a la total en todo paciente, porque la urea y la glucosa se suman siempre al sodio', porque: `La total es 290 y la efectiva 285; la diferencia es la urea (${p(4)}). Con uremia alta la diferencia sería mucho mayor.` },
          { t: '280: la efectiva solo cuenta el sodio, nunca la glucosa', porque: `La efectiva suma la glucosa (2 × Na + glucosa/18 = 285, Ecuación 35.4, ${p(4)}); el 280 es solo la parte del sodio. En una hiperglucemia, ignorar la glucosa llevaría a infravalorar la tonicidad.` },
          { t: '285: la urea cruza las membranas y no aumenta la actividad osmótica efectiva', ok: true }],
        explicacion: `Ecuación 35.4: 2 × 140 + 90/18 = <span class="hl">285 mOsm/kg</span>. Se omite el BUN porque la urea cruza las membranas (${p(4)}).` },
      { id: 'osm-e2', corto: 'osmolalidad vs osmolaridad', tipo: 'test', fuente: 'mr-osmol',
        enunciado: '«Osmolaridad» y «osmolalidad» en el plasma: ¿en qué se diferencian y se pueden intercambiar?',
        opciones: [
          { t: 'Osmolaridad es por litro de solución y osmolalidad por kilo de agua; en el plasma, con un 95 % de agua, casi se usan como sinónimos', ok: true },
          { t: 'Son lo mismo con otro nombre; ninguna de las dos se refiere al agua, solo al número total de partículas disueltas', porque: `Una es por volumen de solución (mOsm/L) y otra por masa de agua (mOsm/kg H₂O), ${p(2)}-3. Aun así, en plasma casi no difieren.` },
          { t: 'La osmolalidad se refiere a la solución entera con todo lo que lleva; por eso en el plasma solo debe usarse la osmolaridad y nunca la osmolalidad', porque: `Es al revés: en el plasma se expresa en osmolalidad, que es por volumen de agua (${p(3)}). Y en la práctica se intercambian.` }],
        explicacion: `Osmolaridad: por volumen de solución (mOsm/L). Osmolalidad: por volumen de agua (mOsm/kg H₂O). El plasma es un <span class="hl">95 %</span> agua y en el líquido extracelular apenas difieren (${p(3)}).` },
      { id: 'osm-e3', corto: 'urea sube', tipo: 'test', fuente: 'mr-osm-calculada · mr-osm-efectiva-calc',
        enunciado: 'Un paciente con Na⁺ 140 y glucosa 90 sube el BUN de 14 a 70 mg/dL. ¿Qué pasa con la osmolalidad calculada y con la efectiva?',
        opciones: [
          { t: 'Las dos suben unos 20 mOsm/kg: la urea cuenta como cualquier soluto', porque: `La calculada sí sube (+56/2,8 = 20), pero la efectiva no incluye la urea (${p(4)}). Pensar que sube la efectiva llevaría a dar agua para una «hipertonicidad» que no existe.` },
          { t: 'La calculada sube unos 20 mOsm/kg; la efectiva no cambia', ok: true },
          { t: 'Ninguna cambia: la urea no es osmóticamente activa', porque: `La urea cuenta en la osmolalidad total: BUN/2,8 (${p(4)}). Lo que no hace es mover agua.` }],
        explicacion: `La calculada incluye BUN/2,8: de 14 a 70 son <span class="hl">+20 mOsm/kg</span> (ilustrativo, con la Ecuación 35.3). La efectiva (2 × Na + glucosa/18) no lleva urea y se queda en 285 (${p(4)}): hiperosmótica, no hipertónica.`,
        origen: 'ilustrativo: cuenta con la Ecuación 35.3 de la ficha' },
      { id: 'osm-e4', corto: 'apuntes de osmolalidad', tipo: 'error', fuente: 'mr-osm-resumen · mr-osm-efectiva-calc · mr-osm-patron',
        enunciado: 'Apuntes de un compañero sobre la osmolalidad. Hay un error: encuéntralo.',
        frases: [
          { t: 'Si el extracelular es hipertónico, el agua sale de las células; si es hipotónico, entra.' },
          { t: 'La osmolalidad normal medida es 285-295 mOsm/kg H₂O, por depresión del punto de congelación.' },
          { t: 'La uremia es hiperosmótica, pero no hipertónica.' },
          { t: 'Una urea alta aumenta la tonicidad y encoge las neuronas, igual que un sodio alto.', mal: true, c: `La urea <span class="hl-rojo">cruza las membranas</span> y no entra en la osmolalidad efectiva; solo el sodio (y la glucosa) mueven el agua (${p(4)}).` }],
        explicacion: 'Un error: la urea no es hipertónica; no mueve agua entre las células y el plasma.' },
    ],
    casos: [
      { id: 'nic-a', titulo: 'Nicolás, 36 años: ¿es hipertónico?', corto: 'Caso · Nicolás (osmolalidad)', sub: 'día 3 tras una hemorragia subaracnoidea',
        paciente: { Edad: '36 años, varón', Ingreso: 'hemorragia subaracnoidea, aneurisma clipado', Día: 'tercero en la UCI', Motivo: 'orina 400 mL/h desde esta mañana' },
        pasos: [
          { momento: 'Día 3 · analítica', datos: { 'Na⁺': '156 mEq/L', Glucosa: '99 mg/dL', BUN: '14 mg/dL', 'Osm plasma medida': '322 mOsm/kg' }, nuevo: ['Na⁺', 'Glucosa', 'BUN', 'Osm plasma medida'],
            pregunta: { id: 'nic-a1', tipo: 'test', fuente: 'mr-osm-calculada · mr-osm-calc', modelo: av('osmolalidad'),
              enunciado: 'Con Na⁺ 156, glucosa 99 y BUN 14, ¿cuánto sale la osmolalidad calculada y cómo se compara con la medida de 322?',
              opciones: [
                { t: '≈ 312: solo el sodio duplicado; la diferencia con 322 es glucosa y urea', porque: `Es la parte del sodio (2 × 156), pero la ecuación suma también glucosa/18 (5,5) y BUN/2,8 (5): ${p(4)}. Quedarse en 312 hace buscar un osmol que ya está explicado.` },
                { t: '≈ 160: la mitad de la medida, porque el sodio no se duplica', porque: `El sodio se duplica para contar los aniones que lo acompañan (${p(4)}). Sin duplicar, el plasma de Nicolás parecería hipoosmolar.` },
                { t: '≈ 322: 2 × 156 + 99/18 + 14/2,8; coincide con la medida', ok: true }],
              explicacion: `2 × 156 + 99/18 + 14/2,8 = 312 + 5,5 + 5 = <span class="hl">322,5 mOsm/kg</span>, fuera de los 285-295 normales: plasma hipertónico (${p(4)}). Las cifras del paciente son dato del caso; la ecuación, de la fuente.` } },
          { momento: 'Día 3 · ¿por qué importa?', datos: { 'Osm efectiva': '≈ 317,5 mOsm/kg' }, nuevo: ['Osm efectiva'],
            pregunta: { id: 'nic-a2', tipo: 'destapa', cuantas: 'son dos cosas', fuente: 'mr-osm-efectiva-calc · mr-sodio-98', modelo: av('osmolalidad'),
              enunciado: 'La efectiva de Nicolás es 2 × 156 + 99/18 ≈ 317,5. El sodio duplicado (312) es casi todo. ¿Qué dos cosas te dice eso del agua de sus neuronas?',
              puntos: [
                `El sodio es el principal determinante del reparto del agua entre dentro y fuera de las células (${p(4)}).`,
                `Con el extracelular hipertónico, <span class="hl-rojo">el agua sale de las células</span> y las encoge (${p(2)}): el cerebro es donde más se nota (${p(5)}).`],
              explicacion: `Un extracelular hipertónico saca agua de las células (${p(2)}) y el cerebro es el más afectado (${p(5)}). El sodio es el 98 % de la efectiva (${p(4)}).` } },
          { momento: 'Día 3 · apuntes del compañero', datos: { Compañero: 'dice que la urea explica parte del problema' }, nuevo: ['Compañero'],
            pregunta: { id: 'nic-a3', tipo: 'error', fuente: 'mr-osm-efectiva-calc · mr-osm-resumen',
              enunciado: 'El compañero resume lo que ve. Hay un error: encuéntralo.',
              frases: [
                { t: 'La osmolalidad calculada de Nicolás coincide con la medida: no falta ningún osmol por explicar.' },
                { t: 'Su plasma es hipertónico: el agua sale de las neuronas.' },
                { t: 'La urea de Nicolás es normal; aunque estuviera alta, no arrastraría agua de las células.' },
                { t: 'El 98 % del problema es el sodio; la glucosa de 99 apenas cuenta.' },
                { t: 'Como la urea cruza las membranas, una BUN alta le encogería más las neuronas.', mal: true, c: `La urea cruza las membranas: <span class="hl-rojo">hiperosmótica, pero no hipertónica</span> (${p(4)}). No encoge neuronas.` }],
              explicacion: 'Un error: la urea no mueve agua; el que la mueve es el sodio.' } },
          { momento: 'Día 3 · si la urea subiera', datos: { Supuesto: 'BUN de 14 a 70 mg/dL (solo para pensar)' }, nuevo: ['Supuesto'],
            pregunta: { id: 'nic-a4', tipo: 'test', fuente: 'mr-osm-calculada · mr-osm-efectiva-calc',
              enunciado: 'Imagina que su BUN pasara de 14 a 70. ¿Qué cambia?',
              opciones: [
                { t: 'La calculada sube unos 20 y la efectiva no cambia: más hiperosmótico, no más hipertónico', ok: true },
                { t: 'La efectiva sube también unos 20 y habría que dar agua libre para compensar esa hipertonicidad nueva', porque: `La efectiva no lleva la urea (${p(4)}). Dar agua por una urea alta enmascararía el sodio real y lo bajaría de más.` },
                { t: 'Nada cambia, porque la urea no tiene actividad osmótica', porque: `La tiene (BUN/2,8, ${p(4)}), solo que no es efectiva entre las células y el plasma.` }],
              explicacion: `BUN/2,8: (70 − 14)/2,8 = <span class="hl">+20</span> en la calculada (ilustrativo); la efectiva no cambia (${p(4)}).`, origen: 'ilustrativo: cuenta con la Ecuación 35.3' } },
          { momento: 'Día 3 · giro: la orina', datos: { 'Osm orina': '110 mOsm/L', Diuresis: '400 mL/h' }, nuevo: ['Osm orina', 'Diuresis'],
            pregunta: { id: 'nic-a5', tipo: 'test', fuente: 'mr-di-dx · mr-di', modelo: av('di'),
              enunciado: 'Su plasma es hipertónico (322) y su orina tiene 110 mOsm/L, con 400 mL/h. ¿Qué te sugiere?',
              opciones: [
                { t: 'Un riñón que retiene agua con plasma concentrado, como se espera al estar hipertónico', porque: `Con el plasma hipertónico y buena ADH, la orina sería concentrada. Una orina de 110 con plasma de 322 es lo contrario (${p(7)}). Dar por normal esa orina te haría perder el diagnóstico.` },
                { t: 'Una orina diluida con plasma hipertónico: la marca de la diabetes insípida', ok: true },
                { t: 'Un exceso de urea que arrastra agua, una diuresis osmótica', porque: `Una diuresis osmótica tendría orina concentrada de solutos, no «casi sin solutos» (${p(7)}). Y la urea de Nicolás es normal.` }],
              explicacion: `«The hallmark of DI is a dilute urine in the face of hypertonic plasma» (${p(7)}): orina casi sin solutos por falta del efecto de la ADH. Siguiente: confirmarlo y ver si es central, en la ficha de hipernatremia.` } },
        ],
        lleva: [
          'La osmolalidad calculada es 2 × Na + glucosa/18 + BUN/2,8; la efectiva no lleva urea.',
          'La urea cruza las membranas: hiperosmótica no es hipertónica. El sodio es el 98 % de la efectiva.',
          'Plasma hipertónico con orina diluida (110): pista de diabetes insípida.'],
        volver: { nombre: 'Osmolalidad efectiva', ancla: 'mr-osm-efectiva-calc', modelo: av('osmolalidad') } },
    ],
    profundizar: [
      { id: 'mr-osm-patron', titulo: 'La crioscopia: cómo se mide la osmolalidad' },
    ],
  },

  /* =================================================================================================
     Ficha 13 · Hipernatremia (cap. 35, págs. 4-8)
     ================================================================================================= */
  'mr-hipernatremia': {
    entrada: 'Por qué las pérdidas de la Tabla 35.1 dan hipernatremia, qué hace el cerebro y por qué eso frena la corrección, por qué el salino no la corrige, la diabetes insípida y su desmopresina, y la furosemida con glucosado.',
    guia: [
      { id: 'hna-g1', corto: 'Tabla 35.1', tipo: 'test', fuente: 'mr-tabla-35-1 · mr-hiperna-def', modelo: av('hipernatremia'),
        enunciado: 'Antes de mirar la Tabla 35.1: el sudor lleva 65 mEq/L de Na⁺, la diarrea secretora 90, el estómago 60. ¿Por qué perder estos líquidos sube el sodio del plasma, si todos llevan sodio?',
        opciones: [
          { t: 'Porque no llevan sodio, así que el que queda en el plasma se concentra', porque: `Todos llevan sodio (${p(5)}): perderlos deja un déficit de sodio además del de agua. Creer que no llevan sodio llevaría a reponer solo agua y a olvidar el sodio perdido.` },
          { t: 'Porque tienen más sodio que el plasma y el riñón retiene el resto', porque: `Todos tienen menos de 135 mEq/L (${p(5)}), es decir, menos que el plasma. Si tuvieran más, bajaría el sodio, no subiría.` },
          { t: 'Porque todos son hipotónicos al plasma: pierden más agua que sodio', ok: true }],
        explicacion: `Todos los líquidos de la Tabla 35.1 son <span class="hl">hipotónicos</span> (Na⁺ &lt;135) y todos llevan sodio: su pérdida da hipernatremia con depleción de agua <i>y</i> de sodio (${p(5)}). En la UCI: vómitos, diarrea, orina por diuréticos o glucosuria. Hipernatremia: Na⁺ &gt;145, hasta en el 25 % de la UCI y casi siempre adquirida en el ingreso (${p(4)}).` },
      { id: 'hna-g2', corto: 'el cerebro a las 48 h', tipo: 'destapa', cuantas: 'son tres cosas', fuente: 'mr-hiperna-cerebro', modelo: av('hipernatremia'),
        enunciado: 'Sigue la neurona en la hipernatremia: ¿qué le ocurre en las primeras horas y qué cambia después?',
        puntos: [
          `El extracelular hipertónico <span class="hl-rojo">saca agua</span> de las células y las encoge, sobre todo en el cerebro (${p(5)}).`,
          `A las <span class="hl">9 h</span> empiezan a recuperar volumen acumulando «osmolitos idiogénicos» (${p(5)}).`,
          `A las <span class="hl-azul">48 h</span> pueden haberlo recuperado del todo (${p(5)}).`],
        explicacion: `Texto del capítulo (${p(5)}). Esa recuperación explica el miedo a corregir deprisa: con agua libre, las neuronas llenas de osmolitos podrían hincharse (${p(6)}).` },
      { id: 'hna-g3', corto: 'por qué se frena', tipo: 'test', fuente: 'mr-hiperna-ritmo', modelo: av('hipernatremia'),
        enunciado: 'Predice, y luego lo compruebas en el modelo: una hipernatremia llevaba 3 días y se corrige en pocas horas con mucha agua libre. ¿Qué teme el libro y por qué?',
        opciones: [
          { t: 'Edema cerebral: las neuronas ya acumularon osmolitos y absorberían agua si el plasma se diluye deprisa', ok: true },
          { t: 'Hipoglucemia de rebote, porque el glucosado en cantidad hace subir la insulina y baja la glucemia del paciente', porque: `El libro no habla de ese riesgo (${p(6)}). Temiendo la hipoglucemia no vigilarías lo que sí cuenta: el sodio y la neurona.` },
          { t: 'Hipovolemia, porque el agua libre se queda toda en el intravascular', porque: `El agua libre se reparte por todo el cuerpo, no se queda en los vasos; el riesgo citado es el edema cerebral (${p(6)}).` }],
        explicacion: `La infusión agresiva de líquidos hipotónicos se desaconseja <span class="hl-rojo">por el riesgo de edema cerebral</span>, que aumenta por los osmolitos acumulados en las neuronas encogidas (${p(6)}).` },
      { id: 'hna-g4', corto: 'salino 0,9', tipo: 'test', fuente: 'mr-hiperna-tto',
        enunciado: 'Una hipernatremia con hipotensión. ¿Qué papel tiene el salino isotónico?',
        opciones: [
          { t: 'Corrige las dos cosas a la vez: sube la presión y baja el sodio del plasma por simple dilución del suero', porque: `Es ineficaz para corregir la hipernatremia (${p(6)}): su sodio (154) está cerca del plasma. Seguirías infundiendo salino sin bajar la cifra.` },
          { t: 'Corrige la hipotensión pero no la hipernatremia; se corrige con glucosado al 5 % o agua por la sonda', ok: true },
          { t: 'Es el fluido de elección para la hipernatremia hipovolémica porque contiene sodio', porque: `Para la hipotensión sí, pero no para la hipernatremia (${p(6)}). El libro prefiere un hipotónico como el salino 0,45 %.` }],
        explicacion: `<span class="hl">Salino isotónico: para la hipotensión, no para la hipernatremia</span> (ineficaz). Se recomienda glucosado al 5 % o agua en la sonda (p. ej., 200 mL cada 8 h); como se perdió también sodio, al autor le parece más adecuado el salino al 0,45 % (${p(6)}).`,
        nota: `<b>Opinión del autor.</b> El salino 0,45 % en lugar del glucosado es una preferencia del autor del libro (${p(6)}), no una norma. ${enFicha('mr-hipernatremia', 'mr-hiperna-tto')}` },
      { id: 'hna-g5', corto: '≤0,5 mEq/L/h', tipo: 'test', fuente: 'mr-hiperna-ritmo · mr-hiperna-calc',
        enunciado: 'Un paciente con Na⁺ 160 que se lleva a 145 al ritmo tradicional de 0,5 mEq/L/h, ¿cuánto tarda como mínimo?',
        opciones: [
          { t: '7,5 h: 15 mEq/L entre 2', porque: `El límite tradicional es 0,5 mEq/L/h, no 2 (${p(6)}). A ese ritmo se arriesga el edema cerebral descrito.` },
          { t: '15 h: 15 mEq/L a 1 por hora', porque: `Es el doble de la recomendación tradicional (${p(6)}). Algunos ritmos mayores se han usado sin edema, pero el óptimo no se conoce.` },
          { t: '30 h: 15 mEq/L entre 0,5', ok: true }],
        explicacion: `Tradicionalmente <span class="hl">≤0,5 mEq/L/h</span>; el óptimo no se conoce y se han usado ritmos mayores sin edema cerebral (${p(6)}). 15 / 0,5 = 30 h (ilustrativo).`, origen: 'ilustrativo: aritmética con el límite de la ficha' },
      { id: 'hna-g6', corto: 'los tipos de DI', tipo: 'test', fuente: 'mr-di · mr-di-central · mr-di-nefro · mr-di-dx', modelo: av('di'),
        enunciado: 'Una orina diluida con plasma hipertónico. ¿Cómo separas la DI central de la nefrogénica?',
        opciones: [
          { t: 'Con vasopresina: en la central la osmolalidad urinaria sube ≥50 %; en la nefrogénica no cambia', ok: true },
          { t: 'Por la osmolalidad urinaria sola: siempre <200 en la central y 200-500 en la nefrogénica', porque: `Son valores habituales («a menudo», ${p(7)}), no un corte: la fuente separa por la respuesta a la vasopresina. Con solo la cifra confundirías las dos.` },
          { t: 'Con la restricción hídrica: en la central la osmolalidad urinaria sube más de 30 mOsm/L, en la nefrogénica no', porque: `Si la osmolalidad no sube más de 30 mOsm/L con restricción, es DI de cualquier tipo; no separa la central de la nefrogénica (${p(7)}). El paso que las separa es la vasopresina.` }],
        explicacion: `Restricción hídrica: si la osmolalidad urinaria no sube más de <span class="hl">30 mOsm/L</span> en unas horas, es DI. Luego la vasopresina: en la central sube <span class="hl">≥50 %</span>; en la nefrogénica no cambia (${p(7)}). Central: ADH no liberada (resección hipofisaria, TCE, <span class="hl-rojo">hemorragia subaracnoidea</span>, autoinmune); nefrogénica: riñón que no responde (fármacos, hipopotasemia, recuperación de NTA). Gestacional: vasopresinasa placentaria (${p(7)}).` },
      { id: 'hna-g7', corto: 'furosemida y glucosado', tipo: 'test', fuente: 'mr-hiperna-hiper', modelo: av('furosemida-glucosado'),
        enunciado: 'Hipernatremia hipervolémica por salino de más, con riñón que no elimina. Das furosemida. ¿Por qué la acompañas de glucosado?',
        opciones: [
          { t: 'Porque la furosemida produce hipoglucemia en el paciente crítico y el glucosado la previene mientras dura la diuresis forzada', porque: `El libro no da ese motivo (${p(8)}). El glucosado aporta agua libre para corregir la hipernatremia; sin entenderlo, lo darías por rutina.` },
          { t: 'La orina con furosemida lleva ~80 mEq/L de Na⁺, menos que el plasma: sola, pierde más agua que sodio y empeora la hipernatremia', ok: true },
          { t: 'Porque la orina con furosemida tiene más sodio que el plasma y baja el sodio de golpe', porque: `Tiene menos, ~80 frente a más de 145 (${p(8)}): al perder más agua que sodio, el plasma se concentra más.` }],
        explicacion: `El Na⁺ de la orina durante la diuresis con furosemida (~80 mEq/L) es menor que el del plasma: la diuresis <span class="hl-rojo">puede agravar la hipernatremia</span>; por eso se combina con glucosado al 5 % (${p(8)}). Con riñón normal, el exceso se elimina rápido (${p(8)}).` },
    ],
    examen: [
      { id: 'hna-e1', corto: 'definición', tipo: 'test', fuente: 'mr-hiperna-def',
        enunciado: '¿Qué Na⁺ define la hipernatremia y qué frecuencia tiene en la UCI?',
        opciones: [
          { t: '>135 mEq/L; en torno al 5 % de la UCI, casi siempre presente ya cuando llega el paciente', porque: `135 es el límite de la hiponatremia (<135, ${p(8)}). El libro cita hasta el 25 % y casi siempre adquirida en la UCI (${p(4)}).` },
          { t: '>150 mEq/L; el 25 %, casi siempre extrahospitalaria', porque: `El corte es 145 (${p(4)}); y casi siempre se adquiere durante el ingreso, de modo que se puede prevenir.` },
          { t: '>145 mEq/L; hasta el 25 % de los pacientes de UCI, casi siempre adquirida durante el ingreso', ok: true }],
        explicacion: `Hipernatremia: Na⁺ <span class="hl">&gt;145 mEq/L</span>, en hasta el 25 % de la UCI (${p(4)}). Se clasifica por el volumen extracelular: hipovolémica, normovolémica e hipervolémica.` },
      { id: 'hna-e2', corto: 'encefalopatía', tipo: 'test', fuente: 'mr-hiperna-encefalopatia',
        enunciado: 'La complicación más frecuente de la hipernatremia y cuándo es más probable.',
        opciones: [
          { t: 'La encefalopatía, más probable si el sodio sube rápido: letargia, delirio, convulsiones, coma', ok: true },
          { t: 'El fallo cardíaco por efecto inotrópico negativo de la hipertonicidad, más probable si el sodio sube lento y se mantiene días', porque: `Hay efecto inotrópico negativo, pero no hay evidencia de que cause insuficiencia cardíaca (${p(5)}). La complicación frecuente es la encefalopatía.` },
          { t: 'La hipotensión grave, que casi siempre acompaña a la pérdida hipotónica', porque: `La pérdida hipotónica no baja la presión salvo que sea grave: el plasma hipertónico atrae agua del intersticio (${p(5)}).` }],
        explicacion: `La encefalopatía, por retracción celular y desmielinización osmótica, es más probable si el sodio sube rápido (${p(5)}). Otras complicaciones son raras: algún caso de rabdomiólisis y efecto inotrópico negativo.` },
      { id: 'hna-e3', corto: 'nefrogénica', tipo: 'test', fuente: 'mr-di-dx · mr-di-nefro · mr-aine-di',
        enunciado: 'DI nefrogénica en una paciente con litio. Osmolalidad urinaria 300 mOsm/L, y no cambia tras vasopresina. ¿Cuál es el primer paso?',
        opciones: [
          { t: 'Desmopresina 1 μg SC cada 12 h, igual que en la central, para devolver la respuesta a la ADH', porque: `La desmopresina restaura la retención renal de agua en la central (${p(7)}). En la nefrogénica el riñón no responde a la ADH, así que no funcionaría.` },
          { t: 'Retirar el fármaco culpable; si no basta, un AINE (indometacina) aumenta la respuesta a la ADH', ok: true },
          { t: 'Desmopresina oral a dosis altas, porque por vía digestiva se absorbe del todo y es la vía más cómoda de dar', porque: `Solo se absorbe un 5 % por vía digestiva (${p(7)}), y no funciona si el riñón no responde.` }],
        explicacion: `Nefrogénica: osmolalidad urinaria 200-500 y sin cambio con vasopresina. Se retira lo que la causa; si no basta, los AINE (inhiben prostaglandinas, que bloquean la ADH); la <span class="hl">indometacina 2 mg/kg/día</span> ha funcionado mejor (${p(7)}).` },
      { id: 'hna-e4', corto: 'apuntes de DI', tipo: 'error', fuente: 'mr-di-dx · mr-desmopresina-di · mr-di-central',
        enunciado: 'Apuntes de un compañero sobre la diabetes insípida. Hay dos errores: encuéntralos.',
        frases: [
          { t: 'La marca de la DI es una orina diluida con plasma hipertónico.' },
          { t: 'Tras vasopresina, la osmolalidad urinaria sube ≥50 % en la central y no cambia en la nefrogénica.' },
          { t: 'La desmopresina es un análogo de la vasopresina más duradero y sin efecto vasoconstrictor.' },
          { t: 'La mejor vía de desmopresina es la oral, porque se absorbe casi del todo.', mal: true, c: `Se absorbe solo un <span class="hl-rojo">5 %</span>: la oral es la menos deseable. Pauta parenteral: 1 μg SC o 2 μg IV cada 12 h (${p(7)}).` },
          { t: 'La DI gestacional aparece al final del primer trimestre por una vasopresinasa placentaria.', mal: true, c: `Aparece <span class="hl">al final del segundo o en el tercer trimestre</span>; la vasopresinasa placentaria aumenta a lo largo del embarazo (${p(7)}).` }],
        explicacion: 'Dos errores: la vía oral es la menos eficaz (5 %), y la DI gestacional no es del primer trimestre.' },
      { id: 'hna-e5', corto: 'qué ponerle', tipo: 'test', fuente: 'mr-hiperna-tto',
        enunciado: 'Hipernatremia hipovolémica por diarrea, normotenso. ¿Qué fluido recomienda el libro y qué prefiere el autor?',
        opciones: [
          { t: 'Salino 0,9 % a ritmo alto, porque contiene el sodio perdido y repone también el volumen que falta', porque: `El salino isotónico es ineficaz para corregir la hipernatremia (${p(6)}). Perdería el sentido de la hipernatremia.` },
          { t: 'Salino 3 % en bolo, para subir el volumen extracelular y la presión arterial del paciente a la vez', porque: `El salino hipertónico daría aún más sodio a un paciente que ya tiene demasiado; el libro no lo recomienda aquí (${p(6)}).` },
          { t: 'Glucosado 5 % o agua por sonda; el autor prefiere el salino 0,45 % porque también se perdió sodio', ok: true }],
        explicacion: `Glucosado al 5 % o agua por sonda (p. ej., 200 mL/8 h); el autor ve más adecuado el salino 0,45 % por la pérdida de sodio (${p(6)}).` },
    ],
    casos: [
      { id: 'nic-b', titulo: 'Nicolás, 36 años: la diabetes insípida', corto: 'Caso · Nicolás (DI)', sub: 'día 3 de una hemorragia subaracnoidea',
        paciente: { Edad: '36 años, varón', Ingreso: 'hemorragia subaracnoidea, aneurisma clipado', Día: 'tercero en la UCI', 'Na⁺': '156 mEq/L', 'Osm plasma': '322 mOsm/kg', Diuresis: '400 mL/h' },
        pasos: [
          { momento: 'Día 3 · el diagnóstico', datos: { 'Osm orina': '110 mOsm/L' }, nuevo: ['Osm orina'],
            pregunta: { id: 'nic-b1', tipo: 'test', fuente: 'mr-di-dx · mr-di-central', modelo: av('di'),
              enunciado: 'Plasma 322, orina 110 y 400 mL/h, tras una HSA. ¿Cuál es el diagnóstico más probable y qué sostiene la causa?',
              opciones: [
                { t: 'DI central: la hemorragia subaracnoidea es una de sus causas descritas y la osmolalidad urinaria es <200', ok: true },
                { t: 'DI nefrogénica: la osmolalidad urinaria menor de 200 es la que la caracteriza frente a la central', porque: `En la nefrogénica la osmolalidad suele ser 200-500 (${p(7)}). Pensar nefrogénica sin fármacos ni hipopotasemia desvía a retirar fármacos que no toma.` },
                { t: 'Diuresis osmótica por glucosa: la poliuria con hipernatremia', porque: `Su glucosa es 99 y la orina no es concentrada. La glucosuria sí causa pérdida hipotónica (${p(5)}), pero aquí la orina está casi sin solutos (${p(7)}).` }],
              explicacion: `Central: no se libera ADH; causas, entre otras, la <span class="hl-rojo">hemorragia subaracnoidea</span>; osmolalidad urinaria a menudo <span class="hl">&lt;200</span> (${p(7)}).` } },
          { momento: 'Día 3 · tras la vasopresina', datos: { 'Osm orina tras vasopresina': '210 mOsm/L (sube más del 50 %)' }, nuevo: ['Osm orina tras vasopresina'],
            pregunta: { id: 'nic-b2', tipo: 'test', fuente: 'mr-di-dx', modelo: av('di'),
              enunciado: 'Se le da vasopresina y la orina pasa de 110 a 210. ¿Qué confirma?',
              opciones: [
                { t: 'DI nefrogénica: el riñón responde algo a la vasopresina, pero poco, y así se explica que suba', porque: `En la nefrogénica la osmolalidad no cambia con vasopresina (${p(7)}). Un cambio mayor del 50 % es la respuesta de la central.` },
                { t: 'DI central: sube al menos un 50 % tras la vasopresina', ok: true },
                { t: 'Que no hay DI: la orina se concentra', porque: `Lo que descarta la DI es que la osmolalidad suba por encima de 30 mOsm/L con restricción hídrica (${p(7)}), no tras la vasopresina. Con esta lectura se retrasaría la desmopresina.` }],
              explicacion: `«In central DI, the urine osmolality increases by at least 50 % after vasopressin»; en la nefrogénica no cambia (${p(7)}). De 110 a 210 son +91 % (cálculo sobre el dato del caso).` } },
          { momento: 'Día 3 · el plan de la guardia', datos: { Plan: 'propuesto por otro residente' }, nuevo: ['Plan'],
            pregunta: { id: 'nic-b3', tipo: 'error', fuente: 'mr-hiperna-tto · mr-hiperna-ritmo', modelo: av('hipernatremia'),
              enunciado: 'El residente de la guardia propone su plan para el sodio. Hay un error: encuéntralo.',
              frases: [
                { t: 'Salino 0,9 % a 150 mL/h para corregir el sodio.', mal: true, c: `El salino isotónico <span class="hl-rojo">corrige la hipotensión, no la hipernatremia</span>: es ineficaz (${p(6)}). Se usa glucosado al 5 % o agua por sonda.` },
                { t: 'Reponer el agua con glucosado al 5 % o agua por sonda.' },
                { t: 'No bajar más de 0,5 mEq/L cada hora, el límite tradicional.' },
                { t: 'Desmopresina para frenar la pérdida de agua por la orina.' }],
              explicacion: 'Un error: el salino 0,9 % no corrige el sodio.' } },
          { momento: 'Día 3 · cuánto tarda', datos: { Objetivo: 'Na⁺ 145 mEq/L' }, nuevo: ['Objetivo'],
            pregunta: { id: 'nic-b4', tipo: 'test', fuente: 'mr-hiperna-ritmo · mr-hiperna-calc',
              enunciado: 'De 156 a 145 al ritmo máximo tradicional, ¿cuánto tiempo como mínimo?',
              opciones: [
                { t: 'Unas 5 h y media: 11 mEq/L entre 2 mEq/L por hora, con un ritmo ágil', porque: `El límite tradicional es 0,5 mEq/L/h (${p(6)}); a 2/h sería un ritmo cuatro veces mayor con riesgo de edema cerebral.` },
                { t: 'Unas 11 h: 11 mEq/L a 1 mEq/L por hora, que es el doble de lo tradicional', porque: `Es el doble del límite tradicional (${p(6)}). El óptimo no se conoce, pero lo recomendado es ≤0,5.` },
                { t: '≥ 22 h: 11 mEq/L entre 0,5 por hora', ok: true }],
              explicacion: `156 − 145 = 11; 11 / 0,5 = <span class="hl">22 h</span> como mínimo (${p(6)}). Los ritmos mayores se han usado sin edema, pero el óptimo no se conoce.`, origen: 'ilustrativo: aritmética con el límite de la ficha' } },
          { momento: 'Día 3 · la desmopresina', datos: { Tratamiento: 'se decide frenar la pérdida' }, nuevo: ['Tratamiento'],
            pregunta: { id: 'nic-b5', tipo: 'test', fuente: 'mr-desmopresina-di',
              enunciado: '¿Qué desmopresina y con qué pauta?',
              opciones: [
                { t: '1 μg SC cada 12 h, o 2 μg IV cada 12 h', ok: true },
                { t: 'Oral 0,1 mg cada 8 h: es más cómoda y se absorbe bien', porque: `Solo se absorbe un 5 % del fármaco por el tubo digestivo: la peor vía (${p(7)}). Con una HSA y poliuria de 400 mL/h no se frenaría la pérdida.` },
                { t: 'La mitad de esa dosis SC cada 6 h, para una acción más estable', porque: `La pauta de la fuente es cada 12 h (${p(7)}); partirla no figura en el capítulo y dejaría dosis sin respaldo.` }],
              explicacion: `Desmopresina: análogo de la vasopresina, más duradero y <span class="hl">sin efecto vasoconstrictor</span>. Parenteral: <span class="hl">1 μg SC o 2 μg IV cada 12 h</span> (${p(7)}).` } },
          { momento: 'Día 4 · el giro: la poliuria cede', datos: { Diuresis: '90 mL/h', 'Na⁺': 'sigue en 152 mEq/L' }, nuevo: ['Diuresis', 'Na⁺'],
            pregunta: { id: 'nic-b6', tipo: 'destapa', cuantas: 'son tres cosas', fuente: 'mr-desmopresina-di · mr-hiperna-tto · mr-hiperna-ritmo', modelo: av('di'),
              enunciado: 'Con la desmopresina la diuresis cae a 90 mL/h pero el Na⁺ sigue en 152. El residente piensa que ya está resuelto. ¿Qué le dices?',
              puntos: [
                `La desmopresina <span class="hl">restaura la retención renal de agua</span> (${p(7)}): frena la pérdida.`,
                `El déficit de agua ya acumulado se corrige con <span class="hl-azul">glucosado al 5 % o agua por sonda</span> (${p(6)}).`,
                `Y a un ritmo de <span class="hl-rojo">≤0,5 mEq/L/h</span> (${p(6)}).`],
              explicacion: `Frenar la pérdida (desmopresina, ${p(7)}) y reponer el déficit (hipotónico, ${p(6)}) son dos tareas. La fuente no los junta en un solo párrafo: la lectura es del mecanismo.`,
              nota: `<b>La fuente no lo dice así.</b> Marino describe cada medida por separado; que se hagan juntas es una lectura del mecanismo, no una frase del libro. ${enFicha('mr-hipernatremia', 'mr-desmopresina-di')}` } },
        ],
        lleva: [
          'Orina diluida con plasma hipertónico es la marca de la DI; la vasopresina (≥50 %) separa la central de la nefrogénica.',
          'El salino 0,9 % corrige la presión, no el sodio; se usa glucosado 5 % o agua, a ≤0,5 mEq/L/h (156 a 145: ≥22 h).',
          'Desmopresina 1 μg SC o 2 μg IV cada 12 h para frenar la pérdida, y agua libre para reponer el déficit.'],
        volver: { nombre: 'Diabetes insípida', ancla: 'mr-di-dx', modelo: av('di') } },
    ],
    profundizar: [
      { id: 'mr-di-gest', titulo: 'DI gestacional' },
      { id: 'mr-aine-di', titulo: 'AINE en la DI nefrogénica (indometacina 2 mg/kg/día)' },
      { id: 'mr-hiperna-otras', titulo: 'Otras consecuencias de la hipernatremia' },
    ],
  },
};
