// Mayéutica del bloque 4, sub-bloque 4C · El agua y el sodio, parte 2 (Marino cap. 35, págs. 8-15 del PDF): fichas 14
// (hiponatremia: diagnóstico) y 15 (hiponatremia: tratamiento) y el caso de Casilda. Datos puros; el formato está en la
// cabecera de b1-fluidos.js. La ficha es js/modules/libros/marino-renal.html. Modelo: río y mar (aguaViva), claves
// pseudo, hiperglucemia, hiponatremia, salino3, sobrecorreccion y desmopresina.
const PDF = 'docs/marino-2024-electrolitos-caps35-38.pdf';
const pag = (n, txt) => `<a class="biblio-link" href="${PDF}#page=${n}" target="_blank" rel="noopener">${txt || `PDF pág. ${n}`}</a>`;
const p = n => pag(n, `pág. ${n}`);
// «Ver en la ficha» dentro de una nota (REGLAS §7.9): el enlace cruzado de siempre al párrafo exacto.
const enFicha = (tab, id) => ` <button type="button" class="may-ir" data-especialidad="libros" data-view="marinoRenal" data-panel="panel-marino-renal-tabs" data-tab="${tab}" data-resaltar="#${id}">Ver en la ficha ↗</button>`;
const av = clave => ({ aguaViva: clave });
const NOTA_513 = `<b>Las fuentes discrepan (errata).</b> El texto da el NaCl al 3 % con Na⁺ 513 mEq/L; la Tabla 35.3 imprime 153 (${p(13)}). Con 513 sale la osmolaridad de 1.026 mOsm/L que dan los dos; se reproducen las dos cifras y no se elige.`;

export const MAYEUTICA_B4C_2 = {
  /* =================================================================================================
     Ficha 14 · Hiponatremia: pseudohiponatremia, glucosa y volumen extracelular (cap. 35, págs. 8-12)
     ================================================================================================= */
  'mr-hiponatremia-dx': {
    entrada: 'Cuándo un Na⁺ bajo no es una hiponatremia de verdad, cómo diluye la glucosa el sodio, y cómo el volumen extracelular y la orina separan las causas.',
    guia: [
      { id: 'hpd-g1', corto: 'el Na⁺ falso', tipo: 'test', fuente: 'mr-pseudohipona · mr-pseudo-dx', modelo: av('pseudo'),
        enunciado: 'Un mieloma tiene proteínas de 12 g/dL y un Na⁺ medido de 128 mEq/L. Antes de tratar: ¿qué osmolalidad plasmática esperas si el sodio real no ha bajado?',
        opciones: [
          { t: 'Normal, entre 285 y 295 mOsm/kg: la fase no acuosa crece y el sodio real no cambia', ok: true },
          { t: 'Baja, menos de 275 mOsm/kg, porque el sodio medido es bajo y debe reflejar una dilución real', porque: `Eso es la hiponatremia verdadera (${p(9)}). Si lo supones aquí, dejarás de buscar el artefacto y tratarás un sodio que no ha bajado.` },
          { t: 'Alta, más de 295 mOsm/kg, porque las proteínas son osmóticamente activas', porque: `La fuente no dice eso: dice que con pseudohiponatremia la osmolalidad es normal, 285-295 (${p(9)}). Esperar una osmolalidad alta te llevaría a buscar una hipernatremia que no existe.` }],
        explicacion: `El plasma es un 95 % agua; con proteínas de <span class="hl">12 g/dL</span> (normal 5,5-8) o triglicéridos de <span class="hl">1.500 mg/dL</span> (normal 25-175) la fase sólida crece y el Na⁺ medido baja sin que baje el real (${p(8)}). La osmolalidad lo delata: <span class="hl-verde">normal (285-295)</span> en la pseudo y <span class="hl-rojo">&lt;275</span> en la verdadera (${p(9)}).` },
      { id: 'hpd-g2', corto: 'la glucosa diluye', tipo: 'test', fuente: 'mr-hiperglucemia-na · mr-nacorr-calc', modelo: av('hiperglucemia'),
        enunciado: 'Predice, y luego lo compruebas en el modelo: Na⁺ medido 124 mEq/L con glucemia de 400 mg/dL. ¿Cuál es el Na⁺ corregido?',
        opciones: [
          { t: '124 mEq/L: la glucosa no cambia el sodio, solo el agua', porque: `La glucosa que no entra en las células saca agua de ellas y diluye el sodio (${p(9)}). Si no la corriges, tomarás por hiponatremia verdadera lo que es en parte dilución.` },
          { t: '134 mEq/L: sumas 2,4 por cada 100 mg/dL de glucosa, contando los 400 enteros', porque: `La ecuación 35.5 resta 100 a la glucosa: 2,4 × (400 − 100)/100 (${p(9)}). Contar los 400 enteros sobrecorrige y te haría subestimar la hiponatremia.` },
          { t: '131 mEq/L: 124 + 2,4 × 3', ok: true }],
        explicacion: `Ecuación 35.5: Na⁺ corregido = Na⁺ medido + 2,4 × (glucosa − 100)/100. Aquí 124 + 2,4 × 3 = <span class="hl">131 mEq/L</span> (${p(9)}). El ejemplo del libro: Na⁺ 130 con glucosa 600 da 142.`,
        origen: 'ilustrativo: cuenta con la ecuación 35.5 de la ficha' },
      { id: 'hpd-g3', corto: 'la ADH retiene agua', tipo: 'test', fuente: 'mr-hipona-hipovolemica', modelo: av('hiponatremia'),
        enunciado: 'Un paciente pierde sodio y líquido por vómitos o diuréticos y su Na⁺ baja. Si lo perdido fuera líquido hipotónico, el sodio subiría. ¿Qué hace falta para que baje?',
        opciones: [
          { t: 'Que beba mucha agua por sed y que el riñón no pueda eliminarla a la misma velocidad', porque: `La fuente no pone la sed como mecanismo: la retención de agua la produce la ADH sobre el riñón (${p(10)}). Pensar solo en beber te haría restringir agua sin entender que el estímulo es la hipovolemia.` },
          { t: 'Retener agua: la hipovolemia libera ADH', ok: true },
          { t: 'Nada más: perder sodio y líquido basta por sí solo para que el Na⁺ plasmático baje', porque: `Perder líquidos hipotónicos da hipernatremia (${p(10)}). Sin retención de agua, el paciente con diarrea saldría con el sodio alto, no bajo.` }],
        explicacion: `La hiponatremia hipovolémica es <span class="hl">pérdida de sodio</span> (orina o tubo digestivo) <span class="hl-azul">más retención de agua</span> por el riñón: (a) la hipovolemia activa el sistema renina-angiotensina-aldosterona, (b) la angiotensina libera ADH, (c) la ADH retiene agua (${p(10)}).` },
      { id: 'hpd-g4', corto: 'renal o fuera', tipo: 'test', fuente: 'mr-hipona-nau · mr-hipona-digestiva', modelo: av('hiponatremia'),
        enunciado: 'Hiponatremia con VEC bajo. La pérdida de sodio no es evidente, y una muestra de orina da Na⁺ de 12 mEq/L. ¿De dónde viene la pérdida?',
        opciones: [
          { t: 'Del riñón: con un Na⁺ urinario bajo, el riñón es el que ya está perdiendo todo el sodio', porque: `Es al revés: un Na⁺ urinario >20 sugiere pérdida renal (${p(11)}). Con 12 el riñón está conservando sodio; buscar un diurético o una nefropatía te haría perder tiempo.` },
          { t: 'De un sitio extrarrenal, como el tubo digestivo: Na⁺ urinario <20 mEq/L', ok: true },
          { t: 'No se puede saber sin medir la osmolalidad urinaria', porque: `La fuente usa el Na⁺ urinario puntual para separar pérdida renal y extrarrenal (${p(11)}); la osmolalidad urinaria se usa en otra pregunta, SIADH frente a polidipsia (${p(12)}).` }],
        explicacion: `Si el origen no es evidente, el Na⁺ urinario puntual lo separa: <span class="hl-rojo">&gt;20 mEq/L</span> pérdida renal, <span class="hl-verde">&lt;20 mEq/L</span> extrarrenal (${p(11)}). Los vómitos y la diarrea entran como pérdida por el tubo digestivo (Figura 35.3, ${p(10)}).` },
      { id: 'hpd-g5', corto: 'las tiazidas', tipo: 'test', fuente: 'mr-hipona-tiazidas', modelo: av('hiponatremia'),
        enunciado: 'Una mujer toma hidroclorotiazida desde hace unas semanas. ¿En qué proporción de los tratados aparece la hiponatremia, y cuándo?',
        opciones: [
          { t: 'En casi todos los tratados, desde la primera semana de tratamiento y a cualquier dosis', porque: `La fuente habla de «alrededor de un tercio» (${p(11)}). Esperar casi todos haría ver normal lo raro, y lo que suma son los controles a las 3 semanas.` },
          { t: 'En alrededor de un tercio, normalmente tras unas 3 semanas', ok: true },
          { t: 'En uno de cada cien, y solo al cabo de un año', porque: `Se aparta del libro: un tercio y a las 3 semanas (${p(11)}). Descartar tiazidas por el tiempo de uso te dejaría sin la causa más citada.` }],
        explicacion: `Las causas más citadas de la hiponatremia hipovolémica son las tiazidas, la insuficiencia suprarrenal y el pierde sal cerebral. Con tiazidas, <span class="hl">alrededor de un tercio</span> de los tratados, normalmente <span class="hl">a las 3 semanas</span>; el mecanismo es complejo y el capítulo no lo desarrolla (${p(11)}).`,
        nota: `<b>Errata de la fuente.</b> El texto imprime «Hypernatremia» dentro del apartado de hiponatremia y de la cita sobre tiazidas (${p(11)}); se lee hiponatremia. ${enFicha('mr-hiponatremia-dx', 'mr-hipona-tiazidas')}` },
      { id: 'hpd-g6', corto: 'SIADH o pierde sal', tipo: 'test', fuente: 'mr-siadh · mr-hipona-csw', modelo: av('hiponatremia'),
        enunciado: 'Tras una HSA, un paciente tiene hiponatremia, plasma hipotónico y orina concentrada con Na⁺ elevado. ¿Qué es lo único que puede distinguir SIADH de pierde sal cerebral?',
        opciones: [
          { t: 'La osmolalidad urinaria: en el pierde sal es siempre menor de 100 mOsm/kg y en el SIADH mayor', porque: `Ambos cuadros tienen orina inapropiadamente concentrada; la fuente dice que la única diferencia puede ser el VEC (${p(11)}). Fiarte de la osmolalidad urinaria te daría una restricción hídrica en un paciente hipovolémico.` },
          { t: 'El Na⁺ urinario: en el SIADH es siempre menor de 20 mEq/L', porque: `En el SIADH el Na⁺ urinario está elevado, >20 (${p(11)}). Con ese criterio clasificarías mal a los dos.` },
          { t: 'El volumen extracelular: bajo en el pierde sal, normal en el SIADH', ok: true }],
        explicacion: `SIADH: plasma hipotónico, orina &gt;100 mOsm/kg y Na⁺ urinario &gt;20. Es difícil de distinguir del pierde sal cerebral: <span class="hl">la única diferencia puede ser el VEC</span>, disminuido en el pierde sal y normal en el SIADH (${p(11)}).` },
      { id: 'hpd-g7', corto: 'orina: 300-500 o <200', tipo: 'destapa', cuantas: 'son tres cosas', fuente: 'mr-osm-orina-dx · mr-polidipsia',
        enunciado: 'Hiponatremia normovolémica sin causa clara. ¿Cómo decides entre SIADH y polidipsia primaria, y qué sabes de la polidipsia?',
        puntos: [
          `Mides la <span class="hl">osmolalidad urinaria</span>: 300-500 mOsm/kg en el SIADH, porque la ADH sin control concentra la orina (${p(12)}).`,
          `<span class="hl-azul">&lt;200 mOsm/kg</span> en la intoxicación hídrica: orina diluida (${p(12)}).`,
          `En la polidipsia primaria suele haber además un aclaramiento de agua libre alterado: probablemente hacen falta los dos factores (${p(12)}).`],
        explicacion: `La osmolalidad urinaria separa SIADH (concentrada) de agua en exceso (diluida). La potomanía de cerveza del alcohólico malnutrido es otro ejemplo de consumo de un líquido diluido (${p(12)}).` },
      { id: 'hpd-g8', corto: 'el hipervolémico', tipo: 'test', fuente: 'mr-hipona-hipervolemica',
        enunciado: 'Hiponatremia hipervolémica con edemas. ¿Cómo te orienta el Na⁺ urinario entre insuficiencia renal, insuficiencia cardíaca y cirrosis?',
        opciones: [
          { t: 'Alto, >20, en la renal; bajo, <20, en la cardíaca y la cirrosis (salvo diurético)', ok: true },
          { t: 'Bajo en la insuficiencia renal y alto en la cardíaca y en la cirrosis, aunque haya un diurético activo', porque: `Es al revés (${p(12)}). Con esa idea atribuirías a la insuficiencia cardíaca un paciente que en realidad tiene el riñón enfermo.` },
          { t: 'Igual de alto, >20, en las tres, porque en las tres hay retención de sal', porque: `En la cardíaca y la cirrosis el Na⁺ urinario es bajo, salvo diurético activo (${p(12)}). Un diurético puede subirlo y confundirte.` }],
        explicacion: `Retención de sal y de agua, con <span class="hl">más agua que sal</span>: insuficiencia cardíaca avanzada, cirrosis y renal. Na⁺ urinario <span class="hl-rojo">&gt;20</span> en la renal y <span class="hl-verde">&lt;20</span> en la cardíaca y la cirrosis, salvo diurético activo (${p(12)}).` },
    ],
    examen: [
      { id: 'hpd-e1', corto: 'clasificar con la orina', tipo: 'test', fuente: 'mr-hipona-clasif · mr-hipona-hipovolemica · mr-siadh', modelo: av('hiponatremia'),
        enunciado: 'Un paciente con Na⁺ 118 mEq/L y osmolalidad plasmática de 250 mOsm/kg tiene el VEC disminuido y Na⁺ urinario de 40 mEq/L. ¿Cuál es el diagnóstico?',
        opciones: [
          { t: 'SIADH: plasma hipotónico, orina inapropiadamente concentrada con Na⁺ >20 mEq/L y restricción', porque: `El SIADH comparte el Na⁺ urinario >20, pero tiene VEC normal (${p(11)}). Restringir agua en un paciente hipovolémico empeoraría su perfusión.` },
          { t: 'Hiponatremia hipovolémica con pérdida renal de sodio', ok: true },
          { t: 'Hiponatremia hipovolémica por pérdida extrarrenal, como diarrea', porque: `El Na⁺ urinario >20 sugiere un origen renal; el extrarrenal da <20 (${p(11)}). Buscarías la causa en el intestino y no mirarías diuréticos ni suprarrenales.` },
          { t: 'Pseudohiponatremia: hay que medir proteínas y triglicéridos', porque: `La osmolalidad de 250 es baja (<275): la pseudo tiene osmolalidad normal, 285-295 (${p(9)}). Buscar lípidos retrasaría el tratamiento de una hiponatremia verdadera.` }],
        explicacion: `Osmolalidad <span class="hl-rojo">&lt;275</span> confirma la hiponatremia verdadera (${p(9)}); VEC bajo la hace hipovolémica; Na⁺ urinario <span class="hl-rojo">&gt;20</span> sitúa la pérdida en el riñón (${p(11)}).`,
        origen: 'ilustrativo: cifras inventadas con los umbrales de la ficha' },
      { id: 'hpd-e2', corto: 'el estrés y el Ringer', tipo: 'test', fuente: 'mr-estres-adh', modelo: av('hiponatremia'),
        enunciado: 'Posoperatorio de un paciente crítico con Ringer lactato de mantenimiento. ¿Por qué aumenta el riesgo de hiponatremia?',
        opciones: [
          { t: 'El Ringer lactato es hipotónico y el estrés libera ADH, que retiene agua', ok: true },
          { t: 'El estrés libera ACTH, que retiene sodio, y el Ringer lo diluye todavía más al infundirse', porque: `El estrés libera también ADH, y es la ADH la que retiene agua (${p(11)}-12). Atribuirlo a la ACTH te llevaría a pedir cortisol en vez de revisar el suero.` },
          { t: 'Es el sodio del Ringer, que es mayor que el plasmático', porque: `Lo que se subraya es la hipotonicidad de los sueros como el Ringer lactato (${p(12)}); un suero con más sodio no baja el Na⁺.` }],
        explicacion: `El estrés libera ACTH y <span class="hl">ADH</span> (retener agua tiene sentido con pérdidas insensibles altas). Explica el riesgo posoperatorio y en el crítico; los sueros hipotónicos, como el Ringer lactato, añaden riesgo (${p(11)}-12).` },
      { id: 'hpd-e3', corto: 'los apuntes del diagnóstico', tipo: 'error', fuente: 'mr-pseudo-dx · mr-hiperglucemia-na · mr-osm-orina-dx · mr-hipotiroidismo',
        enunciado: 'Apuntes de un compañero sobre el diagnóstico de la hiponatremia. Hay un error: encuéntralo.',
        frases: [
          { t: 'La pseudohiponatremia se descubre midiendo la osmolalidad, que es normal.' },
          { t: 'Cada 100 mg/dL de glucemia bajan el Na⁺ unos 2,4 mEq/L.' },
          { t: 'En la polidipsia primaria la orina es concentrada, de 300 a 500 mOsm/kg.', mal: true, c: `La orina de 300-500 es la del SIADH; la intoxicación hídrica da orina diluida, <span class="hl-rojo">&lt;200</span> (${p(12)}).` },
          { t: 'Se recomienda pedir una TSH en la hiponatremia sin causa clara.' }],
        explicacion: 'Un error: la osmolalidad urinaria de la polidipsia es baja, no alta.' },
      { id: 'hpd-e4', corto: 'la prueba del hipotiroidismo', tipo: 'destapa', cuantas: 'son tres cosas', fuente: 'mr-hipotiroidismo',
        enunciado: 'Un adjunto dice «seguro que es el hipotiroidismo». ¿Qué le contestas con lo que dice el libro?',
        puntos: [
          `En 8.000 hipotiroideos, un <span class="hl">5 %</span> tenía hiponatremia, y casi todos (98 %) tenían otra causa posible (${p(12)}).`,
          `La prueba de causalidad es <span class="hl-azul">floja</span>: el hipotiroidismo es una causa rara de hiponatremia normovolémica (${p(11)}-12).`,
          `Aun así, se recomienda <span class="hl">pedir una TSH</span> cuando la causa no está clara (${p(12)}).`],
        explicacion: `El capítulo lo trata como causa rara y poco convincente, sin descartarlo del estudio (${p(12)}).` },
      { id: 'hpd-e5', corto: 'suprarrenal primaria o secundaria', tipo: 'test', fuente: 'mr-hipona-suprarrenal',
        enunciado: 'Hiponatremia hipovolémica con sospecha de insuficiencia suprarrenal. ¿Cuál de las dos formas suele producirla?',
        opciones: [
          { t: 'La primaria, con falta de mineralocorticoide, en su forma crónica', ok: true },
          { t: 'La secundaria, de hipotálamo o hipófisis, porque falta cortisol', porque: `La secundaria es sobre todo déficit de glucocorticoides y no se asocia con hiponatremia (${p(11)}). Atribuirla a esta forma te haría descartar la primaria.` },
          { t: 'Las dos por igual, y sobre todo en la aguda', porque: `La hiponatremia aparece en la forma crónica, no en la aguda (${p(11)}).` }],
        explicacion: `La primaria pierde sodio por la orina (déficit de mineralocorticoide) y la hiponatremia suele aparecer en la forma <span class="hl">crónica</span> (${p(11)}).` },
    ],
    casos: [
      { id: 'cas-a', titulo: 'Casilda, 81 años: el sodio que cae con la tiazida', corto: 'Caso · Casilda (el diagnóstico)', sub: 'urgencias: confusión y vómitos',
        paciente: { Edad: '81 años, mujer', Peso: '75 kg', Fármaco: 'hidroclorotiazida desde hace 3 semanas', Motivo: 'confusión y vómitos' },
        pasos: [
          { momento: 'Urgencias · la analítica', datos: { 'Na⁺': '116 mEq/L', Osmolalidad: '248 mOsm/kg', Glucemia: '96 mg/dL' }, nuevo: ['Na⁺', 'Osmolalidad', 'Glucemia'],
            pregunta: { id: 'cas-a1', tipo: 'test', fuente: 'mr-pseudo-dx · mr-hiperglucemia-na', modelo: av('pseudo'),
              enunciado: 'Casilda llega con Na⁺ 116 mEq/L. ¿Es una hiponatremia verdadera?',
              opciones: [
                { t: 'No: es una pseudohiponatremia por proteínas o lípidos', porque: `La pseudo tiene osmolalidad normal, 285-295 (${p(9)}); la de Casilda es 248. Buscar un mieloma retrasaría el tratamiento.` },
                { t: 'En parte: hay que corregir el sodio por la glucosa', porque: `Con glucemia de 96 mg/dL la corrección de la ecuación 35.5 es casi nula (${p(9)}); no explica un sodio de 116.` },
                { t: 'Sí: la osmolalidad es menor de 275 mOsm/kg', ok: true }],
              explicacion: `Osmolalidad <span class="hl-rojo">&lt;275</span> indica hiponatremia verdadera; normal (285-295) apuntaría a pseudohiponatremia (${p(9)}).`,
              nota: `<b>Cifras del caso.</b> Na⁺ 116, osmolalidad 248 y glucemia 96 son del caso (ilustrativas); la medicina, de la fuente (${p(9)}).` } },
          { momento: 'Urgencias · la orina y la exploración', datos: { 'Na⁺ orina': '45 mEq/L', 'Volumen extracelular': 'bajo (mucosas secas, hipotensión ortostática)' }, nuevo: ['Na⁺ orina', 'Volumen extracelular'], calculadora: { ir: 'mr-hipona-clasif', nombre: '¿Qué hiponatremia es?' },
            pregunta: { id: 'cas-a2', tipo: 'test', fuente: 'mr-hipona-clasif · mr-hipona-nau', modelo: av('hiponatremia'),
              enunciado: 'Con VEC bajo y Na⁺ urinario de 45, ¿qué hiponatremia es y de dónde se pierde el sodio?',
              opciones: [
                { t: 'Hipovolémica, con pérdida renal de sodio', ok: true },
                { t: 'Normovolémica, un SIADH: la orina tiene Na⁺ >20', porque: `El Na⁺ urinario >20 también está en el SIADH, pero su VEC es normal (${p(11)}). Restringir agua a Casilda, hipovolémica, la empeoraría.` },
                { t: 'Hipovolémica, con pérdida extrarrenal por los vómitos', porque: `Los vómitos entran en las causas digestivas, pero un Na⁺ urinario <20 las acompaña (${p(11)}); con 45 la pérdida es renal.` }],
              explicacion: `VEC bajo: <span class="hl-azul">hipovolémica</span>. Na⁺ urinario <span class="hl-rojo">&gt;20</span>: pérdida renal (${p(11)}). Abre la calculadora si quieres comprobarlo.` } },
          { momento: 'Por qué la tiazida', datos: { Sospecha: 'hidroclorotiazida 3 semanas' }, nuevo: ['Sospecha'],
            pregunta: { id: 'cas-a3', tipo: 'destapa', cuantas: 'son tres cosas', fuente: 'mr-hipona-tiazidas',
              enunciado: 'El adjunto pregunta por qué sospechas de la hidroclorotiazida. ¿Qué le dices?',
              puntos: [
                `Las tiazidas son una de las <span class="hl">causas más citadas</span> de hiponatremia hipovolémica, junto con la suprarrenal y el pierde sal (${p(11)}).`,
                `Aparece en <span class="hl">alrededor de un tercio</span> de los tratados (${p(11)}).`,
                `Normalmente <span class="hl-azul">a las 3 semanas</span> de tratamiento, justo el tiempo de Casilda (${p(11)}).`],
              explicacion: `El mecanismo es complejo y el capítulo no lo explica (${p(11)}).` } },
          { momento: 'Nota del residente de guardia', datos: { Plan: 'la nota del residente' }, nuevo: ['Plan'],
            pregunta: { id: 'cas-a4', tipo: 'error', fuente: 'mr-siadh · mr-hipona-hipovolemica',
              enunciado: 'El residente de guardia resume el caso. Hay un error: encuéntralo.',
              frases: [
                { t: 'La osmolalidad de 248 confirma una hiponatremia verdadera.' },
                { t: 'El Na⁺ urinario de 45 indica que la pérdida de sodio es renal.' },
                { t: 'Es un SIADH, porque la orina tiene Na⁺ >20 y el plasma es hipotónico: restrinjo agua.', mal: true, c: `La orina del SIADH se parece, pero la diferencia puede ser solo el VEC: <span class="hl-rojo">normal</span> en el SIADH y <span class="hl-azul">bajo</span> en Casilda (${p(11)}).` },
                { t: 'Las tiazidas son una causa frecuente a las 3 semanas de tratamiento.' }],
              explicacion: 'Un error: llamar SIADH a una hiponatremia con el VEC bajo.' } },
          { momento: 'Qué hace falta para tratar', datos: { Síntomas: 'confusión y vómitos', Decisión: 'si dar salino hipertónico' }, nuevo: ['Síntomas', 'Decisión'],
            pregunta: { id: 'cas-a5', tipo: 'test', fuente: 'mr-encef-sintomas · mr-encef-cuando', modelo: av('salino3'),
              enunciado: 'Casilda está confusa y vomita, con Na⁺ 116. ¿Qué decide dar salino al 3 %?',
              opciones: [
                { t: 'Los síntomas, ya presentes', ok: true },
                { t: 'La cifra: con un Na⁺ tan bajo, 116, siempre se da', porque: `La gravedad de la hiponatremia no se correlaciona con la de la encefalopatía; la cifra no decide (${p(13)}). Dos pacientes con el mismo Na⁺ pueden ser sintomático uno y no el otro.` },
                { t: 'Esperar a que convulsione, porque hasta entonces es leve', porque: `Los síntomas precoces son náuseas, vómitos, cefalea y ataxia; cualquier síntoma que sugiera edema cerebral ya indica la corrección rápida (${p(13)}). Esperar la convulsión pondría en riesgo su vida.` }],
              explicacion: `Síntomas precoces: náuseas, vómitos, cefalea, ataxia; avanzados: agitación, confusión, convulsiones, coma. <span class="hl-rojo">Cualquier síntoma que sugiera edema cerebral</span> indica corrección rápida con salino hipertónico; el Na⁺ no decide (${p(13)}).` } },
        ],
        lleva: [
          'Osmolalidad <275 es hiponatremia verdadera; el VEC y el Na⁺ urinario clasifican la causa.',
          'Con VEC bajo y Na⁺ urinario >20, la pérdida es renal: las tiazidas, a las 3 semanas, son la causa clásica.',
          'Quien decide el salino hipertónico son los síntomas, no la cifra del sodio.'],
        volver: { nombre: 'Hiponatremia hipovolémica', ancla: 'mr-hipona-hipovolemica', modelo: av('hiponatremia') } },
    ],
    profundizar: [
      { id: 'mr-hipona-suprarrenal', titulo: 'Insuficiencia suprarrenal' },
      { id: 'mr-polidipsia', titulo: 'Polidipsia primaria y potomanía de cerveza' },
      { id: 'mr-hipotiroidismo', titulo: 'Hipotiroidismo' },
    ],
  },

  /* =================================================================================================
     Ficha 15 · Hiponatremia: encefalopatía, salino al 3 % y sobrecorrección (cap. 35, págs. 12-15)
     ================================================================================================= */
  'mr-hiponatremia-tto': {
    entrada: 'Qué decide el salino al 3 %, cuánto se da y hasta dónde sube el sodio, y cómo se frena la sobrecorrección con desmopresina y restricción de agua.',
    guia: [
      { id: 'hpt-g1', corto: 'síntomas, no cifra', tipo: 'test', fuente: 'mr-encefalopatia-hipona · mr-encef-cuando', modelo: av('hiponatremia'),
        enunciado: 'Dos pacientes: A tiene Na⁺ 112 y está asintomático; B tiene Na⁺ 126 y convulsiona. Antes de ver nada: ¿a quién das salino al 3 %?',
        opciones: [
          { t: 'A, que tiene la cifra más baja y por tanto el cerebro más expuesto al edema', porque: `La cifra no decide: no hay correlación entre la gravedad de la hiponatremia y la de la encefalopatía (${p(13)}). Corregir deprisa a un asintomático con Na⁺ 112 solo expone a la desmielinización (${p(14)}).` },
          { t: 'A los dos, porque el límite es 130 mEq/L', porque: `El 130 es el punto final de la corrección, no un criterio de inicio (${p(14)}). Al asintomático no hace falta corregirlo rápido (${p(14)}).` },
          { t: 'A B, que tiene síntomas: la encefalopatía es una amenaza vital inmediata', ok: true }],
        explicacion: `Si el plasma es hipotónico, el agua entra al cerebro: edema difuso e hipertensión intracraneal. Con síntomas es una <span class="hl-rojo">amenaza vital inmediata</span>; es más probable si la hiponatremia es aguda (&lt;48 h), pero <span class="hl">el Na⁺ plasmático no decide</span> el salino hipertónico (${p(12)}-13).` },
      { id: 'hpt-g2', corto: 'la dosis del 3 %', tipo: 'test', fuente: 'mr-tabla-35-3 · mr-sal3-bolo', modelo: av('salino3'),
        enunciado: 'Predice, y luego lo compruebas en el modelo: mujer de 60 kg con convulsión por hiponatremia. ¿Qué bolo de salino al 3 % pones, y cuánto sube el Na⁺ como mucho con cada uno?',
        opciones: [
          { t: '2 mL/kg, unos 120 mL (o 150 mL), que suben el Na⁺ hasta 2 mEq/L', ok: true },
          { t: '500 mL de golpe en vía central, para llegar a 130 mEq/L cuanto antes', porque: `El libro da bolos de 2 mL/kg (o 150 mL) repetidos cada pocas horas, y el final no debe pasar de 130 (${p(13)}). 500 mL se pasarían de los límites de 5 mEq/L en 2 h.` },
          { t: '2 mL/kg y cada bolo sube el Na⁺ 10 mEq/L', porque: `Cada bolo puede subir el sodio hasta 2 mEq/L, no 10 (${p(13)}). Creer que sube 10 te haría dejar de ver el límite de 5 mEq/L en 2 h.` }],
        explicacion: `Bolos IV de <span class="hl">2 mL/kg (o 150 mL)</span>, repetidos cada pocas horas hasta que cedan los síntomas, por vía periférica. Cada bolo sube el Na⁺ hasta 2 mEq/L (${p(13)}).`,
        origen: 'ilustrativo: 2 mL/kg con 60 kg = 120 mL',
        nota: `${NOTA_513} ${enFicha('mr-hiponatremia-tto', 'mr-tabla-35-3')}` },
      { id: 'hpt-g3', corto: 'a los +5, valora', tipo: 'test', fuente: 'mr-tabla-35-3', modelo: av('salino3'),
        enunciado: 'Tras el 3 % el Na⁺ ha subido 5 mEq/L y el paciente sigue igual de confuso. ¿Qué piensas?',
        opciones: [
          { t: 'Que la hiponatremia puede no ser la causa de los síntomas: busca otra causa', ok: true },
          { t: 'Que falta dosis: pones otro bolo de 3 % cada pocas horas hasta que el paciente mejore', porque: `Tras +5 sin mejoría el libro manda buscar otra causa (${p(13)}); un segundo bolo se acercaría al límite de 5 mEq/L en 2 h (${p(13)}) sin tratar el origen.` },
          { t: 'Que es normal: los síntomas tardan 48 h en irse', porque: `La fuente espera algo de mejoría con un aumento de 5-6 mEq/L (${p(13)}). Esperar a ciegas retrasaría otras causas.` }],
        explicacion: `Un aumento de <span class="hl">5-6 mEq/L</span> debería dar alguna mejoría; si no la hay, <span class="hl-rojo">es posible que la hiponatremia no sea la causa de los síntomas</span> (${p(13)}).` },
      { id: 'hpt-g4', corto: 'los límites', tipo: 'test', fuente: 'mr-tabla-35-3 · mr-sal3-calc', modelo: av('salino3'),
        enunciado: 'Abre la calculadora si quieres. Un paciente empezó con Na⁺ 114 y a las 2 h tiene 121. ¿Qué dicen los límites de la Tabla 35.3?',
        opciones: [
          { t: 'Se ha pasado: +7 en 2 h supera los 5 mEq/L en 2 h', ok: true },
          { t: 'Va bien: el límite que cuenta es 10 mEq/L en todo el primer día, y todavía quedan 3', porque: `El límite de 10 en el primer día es el diario; además hay uno inicial de 5 en 2 h o 10 en 5 h (${p(13)}). Mirar solo el diario te dejaría pasarte en las primeras horas.` },
          { t: 'Va bien: sigue por debajo del final, 130 mEq/L', porque: `El 130 es el punto final de la corrección, no el límite de velocidad (${p(13)}-14). El riesgo es la velocidad, que daña la mielina del tronco.` }],
        explicacion: `Límites: subida inicial ≤ <span class="hl">5 mEq/L en 2 h</span> o ≤ <span class="hl">10 en 5 h</span>; diaria ≤ 10 el primer día y 8 los siguientes; final ≤ <span class="hl">130</span> (${p(13)}). Aquí, 121 − 114 = 7 en 2 h.`,
        origen: 'ilustrativo: cifras inventadas con los límites de la Tabla 35.3' },
      { id: 'hpt-g5', corto: 'el daño de la mielina', tipo: 'test', fuente: 'mr-sdo', modelo: av('sobrecorreccion'),
        enunciado: 'Un paciente corregido deprisa mejora tras las convulsiones y días después se deteriora, con disartria y tetraparesia. ¿Qué ha ocurrido y quién tiene más riesgo?',
        opciones: [
          { t: 'Una desmielinización osmótica, más probable en la crónica', ok: true },
          { t: 'Un edema cerebral por la propia hiponatremia, más probable en la aguda de menos de 48 h', porque: `El edema es la encefalopatía hiponatrémica inicial (${p(12)}); aquí el deterioro tardío con disartria y tetraparesia es de la mielina (${p(13)}-14).` },
          { t: 'Una recaída de las convulsiones por baja dosis de 3 %', porque: `La fuente describe mejoría y luego un deterioro profundo con disartria, alteraciones oculomotoras y tetraparesia, no más convulsiones (${p(13)}-14).` }],
        explicacion: `Corregir demasiado deprisa, o pasarse de la normalidad, daña la mielina del tronco (mielinólisis central pontina). El curso es <span class="hl-azul">bifásico</span>; la hiponatremia <span class="hl-rojo">crónica</span> tiene más riesgo que la aguda (${p(13)}-14).` },
      { id: 'hpt-g6', corto: 'la diuresis que concentra', tipo: 'destapa', cuantas: 'son tres cosas', fuente: 'mr-sobrecorreccion', modelo: av('sobrecorreccion'),
        enunciado: 'Durante el 3 % el paciente empieza a orinar mucho y el Na⁺ sube más rápido de lo previsto. ¿Qué está pasando?',
        puntos: [
          `Es la <span class="hl">sobrecorrección</span>, hasta en un 25 % de los casos aun con medidas preventivas (${p(14)}).`,
          `Una <span class="hl-azul">diuresis acuosa espontánea</span> baja el volumen extracelular y concentra el sodio, que sube más rápido (${p(14)}).`,
          `Es más frecuente en la hiponatremia por <span class="hl-rojo">fármacos (sobre todo tiazidas)</span> y por intoxicación hídrica (${p(14)}).`],
        explicacion: `La diuresis acuosa se previene o se termina con desmopresina (${p(14)}).` },
      { id: 'hpt-g7', corto: 'la desmopresina', tipo: 'test', fuente: 'mr-tabla-35-4', modelo: av('desmopresina'),
        enunciado: 'Predice, y luego lo compruebas en el modelo: hiponatremia con salino 3 % y la diuresis pasa de 40 a 150 mL/h. ¿Qué haces?',
        opciones: [
          { t: 'Desmopresina 2 μg SC cada 12 h con restricción hídrica obligatoria', ok: true },
          { t: 'Desmopresina 2 μg SC cada 12 h y permito beber sin límite, para no deshidratar', porque: `La restricción hídrica es obligatoria mientras dure la desmopresina, para que no aparezca una hiponatremia grave (${p(14)}). Beber a voluntad con ADH que retiene agua devolvería el sodio al pozo.` },
          { t: 'Sigo con el 3 % hasta pasar los 10 mEq/L: la diuresis es solo agua', porque: `Un aumento brusco de la diuresis (>100 mL/h) con el hipertónico es indicación de desmopresina (${p(14)}); seguir sin frenarla empuja al paciente hacia la desmielinización.` }],
        explicacion: `Indicaciones (Tabla 35.4): subida por encima de los límites, <span class="hl-rojo">aumento brusco de la diuresis (p. ej., &gt;100 mL/h)</span> con salino hipertónico, y de rutina si hay riesgo de sobrecorrección (suprarrenal, fármacos, polidipsia). Dosis <span class="hl">2 μg SC/12 h</span> y <span class="hl">restricción hídrica obligatoria</span> (${p(14)}).`,
        nota: `<b>La fuente no lo dice así.</b> Los 40 y 150 mL/h son cifras del enunciado; el libro solo da >100 mL/h como ejemplo (${p(14)}). ${enFicha('mr-hiponatremia-tto', 'mr-tabla-35-4')}` },
      { id: 'hpt-g8', corto: 'sin síntomas', tipo: 'test', fuente: 'mr-asinto-hipo · mr-asinto-normo · mr-agua-no-sodio', modelo: av('hiponatremia'),
        enunciado: 'Hiponatremia asintomática normovolémica con diuresis de 1.500 mL/día. ¿Qué ingesta de líquidos pautas, y por qué?',
        opciones: [
          { t: 'Unos 1.000 mL/día: 500 mL menos que la diuresis, porque hay exceso de agua sin exceso de sodio', ok: true },
          { t: 'Salino al 3 % de entrada, porque con la cifra tan baja hay que subir el sodio cuanto antes', porque: `En el asintomático no hace falta la corrección rápida (${p(14)}); el 3 % es para la encefalopatía.` },
          { t: 'Más salino al 0,9 %, porque falta sodio', porque: `La hiponatremia indica exceso de agua, no falta de sodio (${p(15)}); el isotónico es para la hipovolemia, no para la normovolémica (${p(14)}-15).` }],
        explicacion: `Sin síntomas no hay prisa; el manejo depende del VEC. En la normovolemia hay agua en exceso sin exceso de sodio: restricción, con una ingesta <span class="hl">500 mL menor que la diuresis</span> (${p(15)}). En la hipovolemia el isotónico ayuda a la perfusión, pero el Na⁺ puede no mejorar hasta tratar la causa (${p(14)}-15).`,
        origen: 'ilustrativo: 1.500 mL/día es una cifra inventada con la regla de la ficha' },
    ],
    examen: [
      { id: 'hpt-e1', corto: 'furosemida en el hipervolémico', tipo: 'test', fuente: 'mr-asinto-hiper',
        enunciado: 'Insuficiencia cardíaca avanzada con hiponatremia hipervolémica. La furosemida eliminaría sal y agua. ¿Por qué no basta?',
        opciones: [
          { t: 'Porque la activación mantenida de renina-angiotensina-aldosterona sostiene la hiponatremia', ok: true },
          { t: 'Porque la furosemida no actúa en la hipervolemia y solo sirve en la hipovolémica', porque: `Teóricamente podría corregirla (${p(15)}); no basta por otro motivo. Descartarla te haría dejar al paciente con su sobrecarga.` },
          { t: 'Porque en el hipervolémico sobra el sodio más que el agua', porque: `Al contrario: sobran sal y agua, pero el exceso de agua es mayor que el de sal (${p(15)}).` }],
        explicacion: `Sobra sal y más aún agua. La furosemida podría corregirlo en teoría, pero la activación sostenida del sistema renina-angiotensina-aldosterona en la insuficiencia cardíaca y la cirrosis <span class="hl">mantiene la hiponatremia</span> (${p(15)}).` },
      { id: 'hpt-e2', corto: 'el plan del 3 %', tipo: 'error', fuente: 'mr-encef-cuando · mr-tabla-35-4 · mr-tabla-35-3',
        enunciado: 'Plan de un residente para una hiponatremia. Hay dos errores: encuéntralos.',
        frases: [
          { t: 'Bolos de 3 % de 2 mL/kg o 150 mL, repetidos cada pocas horas hasta que cedan los síntomas.' },
          { t: 'Con un Na⁺ de 110 doy el 3 % aunque esté asintomático, porque el sodio decide.', mal: true, c: `El Na⁺ plasmático <span class="hl-rojo">no decide</span> el hipertónico: la cifra no se correlaciona con la encefalopatía, y al asintomático no se le corrige deprisa (${p(13)}-14).` },
          { t: 'El Na⁺ final no debe pasar de 130 mEq/L.' },
          { t: 'Si la hiponatremia es de una liberación de ADH sin control, la desmopresina frena la subida.', mal: true, c: `La desmopresina <span class="hl-rojo">no se aconseja</span> si la hiponatremia se debe a liberación no regulada de ADH, y la restricción hídrica es obligatoria (${p(14)}).` },
          { t: 'La diuresis acuosa durante el hipertónico concentra el sodio y lo sube más rápido.' }],
        explicacion: 'Dos errores: dejar que la cifra decida el 3 % y dar desmopresina en el SIADH.',
        nota: `<b>La fuente no lo dice.</b> El libro no explica si el ADH del estrés (${p(11)}) cuenta como «no regulada» para la Tabla 35.4; se cita tal cual (${p(14)}). ${enFicha('mr-hiponatremia-tto', 'mr-tabla-35-4')}` },
      { id: 'hpt-e3', corto: 'a quién se le da desmopresina de rutina', tipo: 'destapa', cuantas: 'son tres cosas', fuente: 'mr-tabla-35-4',
        enunciado: 'El adjunto pregunta cuándo se usa la desmopresina de rutina y qué cuidados lleva. ¿Qué le dices?',
        puntos: [
          `De rutina cuando hay riesgo de sobrecorrección: <span class="hl">insuficiencia suprarrenal, fármacos y polidipsia primaria</span> (${p(14)}).`,
          `Se inicia ante un <span class="hl-azul">aumento brusco de la diuresis</span> durante el hipertónico (${p(14)}).`,
          `Con <span class="hl-rojo">restricción hídrica obligatoria</span> y sin ella nunca, para no provocar una hiponatremia grave (${p(14)}).`],
        explicacion: `Dosis de 2 μg SC cada 12 h; no se aconseja si el ADH no está regulada (${p(14)}).` },
      { id: 'hpt-e4', corto: 'cuál es la causa', tipo: 'test', fuente: 'mr-agua-no-sodio',
        enunciado: 'Un compañero dice «la hiponatremia es falta de sodio, como la hipomagnesemia es falta de magnesio». ¿Qué le contestas?',
        opciones: [
          { t: 'La hiponatremia es exceso de agua, absoluto o relativo; la hipomagnesemia sí es falta de magnesio', ok: true },
          { t: 'Tiene razón en las dos: en cada una falta el ion y hay que reponerlo con suero', porque: `En la hiponatremia el sodio puede estar normal o alto y el agua ser la que sobra (${p(15)}). Reponer sodio en todos sería sobrecorregir a quien solo tiene agua de más.` },
          { t: 'La hiponatremia es siempre falta de ADH y la hipomagnesemia, de aldosterona', porque: `La fuente no lo dice así: la hiponatremia indica exceso de agua, que puede asociarse a ADH elevada (${p(10)}), no a falta de ella.` }],
        explicacion: `La hiper y la hiponatremia son <span class="hl">trastornos del balance de agua, no del sodio</span>: la hipomagnesemia indica falta de magnesio, pero la hiponatremia indica exceso de agua, no falta de sodio (${p(15)}).` },
      { id: 'hpt-e5', corto: 'si ya has pasado el límite', tipo: 'test', fuente: 'mr-tabla-35-4 · mr-sobrecorreccion', modelo: av('sobrecorreccion'),
        enunciado: 'Con el 3 % el sodio sube de 118 a 130 en 5 h (+12). La diuresis sigue en 60 mL/h. ¿Qué dice el libro?',
        opciones: [
          { t: 'Has superado los límites: indicación de desmopresina', ok: true },
          { t: 'No actúes: 130 es el punto final de la corrección y ya estás en él, con margen', porque: `El 130 es el final, pero el límite inicial es 10 mEq/L en 5 h (${p(13)}); superarlo es indicación de la Tabla 35.4 (${p(14)}).` },
          { t: 'Espera a que la diuresis pase de 100 mL/h para pautar desmopresina', porque: `La diuresis elevada es solo una de las tres indicaciones; la subida por encima de los límites también lo es (${p(14)}). Esperar es seguir corrigiendo de más.` }],
        explicacion: `Primera indicación de la Tabla 35.4: <span class="hl-rojo">subida de Na⁺ por encima de los límites de la 35.3</span>, que son 5 mEq/L en 2 h o 10 en 5 h (${p(13)}-14).`,
        origen: 'ilustrativo: cifras inventadas con los límites de la Tabla 35.3' },
    ],
    casos: [
      { id: 'cas-b', titulo: 'Casilda, 81 años: el sodio que sube de más', corto: 'Caso · Casilda (el tratamiento)', sub: 'el salino al 3 % y la diuresis de las 6 h',
        paciente: { Edad: '81 años, mujer', Peso: '75 kg', Fármaco: 'hidroclorotiazida desde hace 3 semanas', 'Na⁺ de entrada': '116 mEq/L', Causa: 'hipovolémica, pérdida renal' },
        pasos: [
          { momento: 'Hora 0 · la convulsión', datos: { Evento: 'convulsión tónico-clónica', Peso: '75 kg' }, nuevo: ['Evento'], calculadora: { ir: 'mr-sal3-calc', nombre: 'Bolo de salino al 3 %' },
            pregunta: { id: 'cas-b1', tipo: 'test', fuente: 'mr-tabla-35-3 · mr-sal3-bolo', modelo: av('salino3'),
              enunciado: 'Casilda convulsiona. ¿Qué pautas?',
              opciones: [
                { t: 'Un bolo de salino al 3 % de 150 mL (2 mL/kg con 75 kg), por vía periférica', ok: true },
                { t: 'Salino al 0,9 % en bolo y restricción de agua, porque está hipovolémica', porque: `El isotónico es para la presión y la perfusión del asintomático hipovolémico (${p(14)}); con síntomas de encefalopatía se pide el hipertónico (${p(12)}).` },
                { t: 'Esperar a una vía central para el 3 %, porque es peligroso por vía periférica', porque: `El 3 % se puede dar de forma segura por vía periférica (${p(13)}). Esperar retrasaría el tratamiento de una amenaza vital.` }],
              explicacion: `Bolos de <span class="hl">2 mL/kg (o 150 mL)</span>; con 75 kg las dos cifras coinciden en 150 mL. Cada bolo puede subir el Na⁺ hasta 2 mEq/L (${p(13)}).`,
              nota: `${NOTA_513} <b>Peso del caso.</b> Se ha elegido 75 kg para que 2 mL/kg y 150 mL coincidan; con menos peso, la Tabla 35.3 da las dos opciones (${p(13)}).` } },
          { momento: 'Hora 2 · tras el bolo', datos: { 'Na⁺': '121 mEq/L', Estado: 'sin nuevas convulsiones; sigue confusa' }, nuevo: ['Na⁺', 'Estado'],
            pregunta: { id: 'cas-b2', tipo: 'error', fuente: 'mr-tabla-35-3 · mr-sal3-bolo',
              enunciado: 'El residente de guardia anota el plan a las 2 h. Hay un error: encuéntralo.',
              frases: [
                { t: 'El Na⁺ ha subido 5 mEq/L en 2 h, el límite de la subida inicial.' },
                { t: 'Cada bolo puede subir el Na⁺ hasta 2 mEq/L, y +5-6 debería mejorar los síntomas.' },
                { t: 'Sigue confusa con Na⁺ 121: pongo un segundo bolo de 3 % para llegar antes a 130.', mal: true, c: `Con +5 sin mejoría hay que <span class="hl-rojo">buscar otra causa</span>, y un segundo bolo la acercaría a pasar el límite de 5 mEq/L en 2 h (${p(13)}).` },
                { t: 'El Na⁺ final no debe pasar de 130 mEq/L.' }],
              explicacion: 'Un error: más 3 % por la persistencia de síntomas tras +5.',
              nota: `${enFicha('mr-hiponatremia-tto', 'mr-tabla-35-3')}` } },
          { momento: 'Hora 6 · la diuresis', datos: { 'Na⁺': '126 mEq/L (+10 en 6 h)', Diuresis: '180 mL/h' }, nuevo: ['Na⁺', 'Diuresis'], calculadora: { ir: 'mr-sal3-calc', nombre: 'Vigilar los límites' },
            pregunta: { id: 'cas-b3', tipo: 'test', fuente: 'mr-tabla-35-3 · mr-tabla-35-4 · mr-sobrecorreccion', modelo: av('sobrecorreccion'),
              enunciado: 'A las 6 h el Na⁺ es 126 (+10) y la diuresis 180 mL/h. ¿Cómo lo interpretas?',
              opciones: [
                { t: 'Casi en el límite diario de 10 y con una diuresis >100 mL/h: riesgo de sobrecorrección', ok: true },
                { t: 'Va bien: 126 sigue por debajo de 130, el final de la corrección, y queda margen para más', porque: `El 130 es el punto final, pero el límite diario es 10 mEq/L el primer día; +10 en 6 h lo agota (${p(13)}). La diuresis puede seguir subiendo el sodio.` },
                { t: 'Es buena señal de que el riñón recupera; sigo con el 3 %', porque: `La diuresis acuosa espontánea durante el hipertónico concentra el sodio y acelera la corrección; es frecuente con tiazidas (${p(14)}). Seguir con 3 % empujaría a Casilda hacia la desmielinización.` }],
              explicacion: `+10 en 6 h está en el límite de los 10 mEq/L del primer día; con <span class="hl-rojo">&gt;100 mL/h</span> (aquí 180) ya hay indicación de desmopresina (${p(13)}-14).`,
              nota: `<b>La fuente no lo dice.</b> El libro da 10 mEq/L en 5 h y 10 en el día (${p(13)}); no dice cuánto había subido a las 5 h. +10 en 6 h se lee «en el límite». Las cifras de Casilda son del caso (ilustrativas).` } },
          { momento: 'El giro · por qué sube tanto', datos: { Orina: 'abundante y diluida' }, nuevo: ['Orina'],
            pregunta: { id: 'cas-b4', tipo: 'destapa', cuantas: 'son cuatro cosas', fuente: 'mr-sobrecorreccion', modelo: av('sobrecorreccion'),
              enunciado: 'El adjunto pregunta por qué una paciente que mejora sube tanto el sodio. ¿Qué le explicas?',
              puntos: [
                `Una <span class="hl-azul">diuresis acuosa espontánea</span> durante el hipertónico (${p(14)}).`,
                `Baja el volumen extracelular y <span class="hl">concentra el sodio</span>, acelerando la corrección (${p(14)}).`,
                `Es más frecuente con <span class="hl-rojo">tiazidas</span> y con intoxicación hídrica: Casilda toma una (${p(14)}).`,
                `Ocurre hasta en un 25 % de los casos aun con medidas preventivas (${p(14)}).`],
              explicacion: `La desmopresina previene o termina esta diuresis (${p(14)}).` } },
          { momento: 'La orden', datos: { Decisión: 'frenar la diuresis acuosa' }, nuevo: ['Decisión'],
            pregunta: { id: 'cas-b5', tipo: 'test', fuente: 'mr-tabla-35-4', modelo: av('desmopresina'),
              enunciado: 'Frenas la sobrecorrección. ¿Qué pautas?',
              opciones: [
                { t: 'Desmopresina 2 μg SC y restricción hídrica obligatoria', ok: true },
                { t: 'Desmopresina 2 μg SC y suero libre para mantener la diuresis', porque: `La restricción hídrica es obligatoria mientras dure la desmopresina para prevenir una hiponatremia grave (${p(14)}).` },
                { t: 'Furosemida IV para eliminar el exceso de sodio', porque: `La fuente trata la sobrecorrección con desmopresina (${p(14)}); la furosemida no aparece para esto y aumentaría la diuresis que concentra el sodio.` }],
              explicacion: `Tabla 35.4: <span class="hl">2 μg SC cada 12 h</span>, con <span class="hl-rojo">restricción hídrica obligatoria</span> (${p(14)}). Es una hiponatremia por fármaco, un caso de riesgo de sobrecorrección (${p(14)}).`,
              nota: `<b>La fuente no lo dice así.</b> El libro no explica por qué el ADH de Casilda, estimulado por la hipovolemia, es «regulado» (${p(10)}), pero sí dice que la desmopresina no se aconseja si es «no regulada» (${p(14)}).` } },
        ],
        lleva: [
          'La dosis del 3 % es 2 mL/kg o 150 mL, y con +5 sin mejoría no se repite: se busca otra causa.',
          'Un aumento brusco de la diuresis (>100 mL/h) con el hipertónico es la señal de sobrecorrección, sobre todo con tiazidas.',
          'Desmopresina 2 μg SC y restricción hídrica obligatoria.'],
        volver: { nombre: 'Sobrecorrección y desmopresina', ancla: 'mr-sobrecorreccion', modelo: av('sobrecorreccion') } },
    ],
    profundizar: [
      { id: 'mr-asinto-normo', titulo: 'Restricción hídrica, demeclociclina y vaptanes' },
      { id: 'mr-asinto-hiper', titulo: 'Hiponatremia hipervolémica' },
    ],
  },
};
