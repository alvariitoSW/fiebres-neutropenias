// Mayéutica de las fichas del bloque 5, grupo C · La fiebre en la UCI (Marino cap. 42), parte 2: ficha 11 ma-itu-sonda
// (con el caso de Felisa) y ficha 12 ma-candiduria. La pinta js/core/mayeutica.js (botón «Estudiar»). Datos puros.
//
// Toda la medicina sale de la ficha (js/modules/libros/marino-abdomen.html) y de su PDF
// (docs/marino-2024-abdomen-temperatura-caps39-44.pdf, cap. 42 = págs. 38-43); cada pregunta dice dónde con `fuente`.
// Las cifras de la paciente se inventan y se marcan con `origen`. Formato: el de b1-fluidos.js.

const PDF = 'docs/marino-2024-abdomen-temperatura-caps39-44.pdf';
const pag = n => `<a class="biblio-link" href="${PDF}#page=${n}" target="_blank" rel="noopener">PDF pág. ${n}</a>`;

const visual = (tab, texto) => ({ especialidad: 'libros', view: 'marinoAbdomen', panel: 'panel-marino-abd-tabs', tab, enVisual: '', texto });

const NOTA_CANDIDURIA = '<b>Nota de fuentes.</b> El cap. 42 dice que la Candida en orina con sonda «suele ser colonización»; el cap. 44, que la candiduria persistente «suele ser consecuencia de la candidiasis diseminada». Se muestran las dos; no se elige una. (Los hemocultivos negativos en más del 50 % de las diseminadas y la sensibilidad «tan baja como el 20 %» no se contradicen: son compatibles.) Cap. 42: ' + pag(42) + '; cap. 44: ' + pag(67) + '.';

export const MAYEUTICA_FIEBRE_2 = {
  /* =================================================================================================
     Ficha 11 · Infección urinaria asociada a sonda vesical (págs. 38-41)
     ================================================================================================= */
  'ma-itu-sonda': {
    entrada: 'Por qué la bacteriuria no es infección, qué baja el riesgo de verdad, cómo se diagnostica con los criterios NHSN y cuándo se trata.',
    guia: [
      { id: 'ius-g1', corto: 'sin adherencia', tipo: 'test', fuente: 'ma-itu-bacteriuria · ma-itu-adherencia · mar-img-42-1 · mar-bacteriemia-cateter',
        enunciado: 'Inyectar patógenos en la vejiga de una persona sana no causa infección. ¿Qué pieza falta para que la sonda sí la cause?',
        opciones: [
          { t: 'Que la sonda introduzca muchas más bacterias de las que se inyectaron en el experimento con el sano', porque: 'No es cuestión de cantidad: se inyectan patógenos y no hay infección. Si piensas en cantidad, buscarás una sonda más estéril en vez de quitarla.' },
          { t: 'La adherencia: el epitelio va tapizado de comensales y la sonda lo inflama y lo descama', ok: true },
          { t: 'Que la orina fuera estéril antes del sondaje', porque: 'Lo que protege es el epitelio con sus comensales, no una orina estéril. Dejarías de ver que lo que cambia con la sonda es el epitelio.' }],
        explicacion: 'Con sonda aparece bacteriuria (≥10⁵ UFC/mL) en un <span class="hl-rojo">3-8 % por día</span>, con biopelículas dentro y fuera de la sonda. Pero no basta: <span class="hl-azul">el epitelio está tapizado de comensales</span> que impiden que se peguen los patógenos; la sonda lo inflama y lo descama (Figura 42.1).' },
      { id: 'ius-g2', corto: 'retirar pronto', tipo: 'test', fuente: 'mar-img-42-2 · ma-itu-retirar',
        enunciado: 'Predice con la Figura 42.2 (16 ensayos): retirar la sonda al día 1 frente a los días 2-7. ¿Cuánto baja la infección asociada a sonda?',
        opciones: [
          { t: 'De 27 % a 10 %', porque: 'Son las cifras de la bacteriuria asintomática, no de la infección asociada a sonda. Mezclarlas hace exagerar el beneficio sobre la infección.' },
          { t: 'De 15 % a 8 %, casi la mitad', ok: true },
          { t: 'No cambia: depende del germen', porque: 'Cambia (p <0,0001 en los dos paneles): el riesgo depende sobre todo de la duración del sondaje. Mantendrías sondas innecesarias.' }],
        explicacion: 'Retirada precoz frente a tardía: <span class="hl">infección asociada a sonda 8 % frente a 15 %</span> y bacteriuria asintomática 10 % frente a 27 %. Retirar la sonda en cuanto no haga falta es <span class="hl-verde">la medida más eficaz</span>.',
        origen: 'ficha · Figura 42.2 (cifras impresas sobre las barras) · cuenta propia: 15 → 8 baja 7 de 15, un 47 %' },
      { id: 'ius-g3', corto: 'lo que no', tipo: 'test', fuente: 'ma-itu-no',
        enunciado: '¿Cuál de estas medidas «de higiene» puede aumentar la bacteriuria en el paciente sondado?',
        opciones: [
          { t: 'Limpiar a diario el punto de inserción de la sonda', ok: true },
          { t: 'Recambiar periódicamente una sonda impregnada de plata', porque: 'Es lo que hace que la plata reduzca la infección. Dejarías de recambiarla y perderías su efecto.' },
          { t: 'Mantener la sonda de plata sin recambiarla', porque: 'La plata sin recambio no reduce la infección, pero tampoco sube la bacteriuria; lo que la sube es limpiar el meato.' }],
        explicacion: 'Limpiar a diario el meato <span class="hl-rojo">puede aumentar la bacteriuria</span>; los antibióticos sistémicos profilácticos, tampoco. Las sondas de plata reducen la infección <span class="hl">solo si se recambian periódicamente</span>.' },
      { id: 'ius-g4', corto: 'criterios NHSN', tipo: 'destapa', fuente: 'ma-itu-nhsn', modelo: visual('ma-itu-sonda', '👁️ Los criterios NHSN (vista Visual)'), cuantas: 'son tres criterios',
        enunciado: 'Los criterios NHSN de la infección urinaria asociada a sonda. Son tres.',
        puntos: [
          'Sonda uretral al menos <span class="hl">2 días seguidos</span>, todavía puesta o retirada el día anterior.',
          'Al menos <span class="hl">un síntoma</span>: fiebre (>38 °C), dolor suprapúbico o costovertebral; urgencia y disuria no cuentan con la sonda puesta.',
          'Urocultivo con <span class="hl-rojo">no más de dos especies</span>, al menos una con >10⁵ UFC/mL.'],
        explicacion: 'Con ellos se separa la infección asociada a sonda de la bacteriuria asintomática.' },
      { id: 'ius-g5', corto: 'fiebre y cultivo', tipo: 'test', fuente: 'ma-itu-fiebre · ma-itu-piuria', calculadora: { ir: 'ma-nhsn-calc', nombre: '¿Infección asociada a sonda o bacteriuria asintomática?' },
        enunciado: 'Un paciente sondado tiene fiebre y un urocultivo con una bacteria >10⁵ UFC/mL. ¿Basta para atribuirle la fiebre a la infección urinaria?',
        opciones: [
          { t: 'Sí: cumple los criterios de fiebre y de cultivo, así que es una ITU de sonda confirmada', porque: 'La fiebre es un criterio problemático: en un estudio fue igual de frecuente con y sin infección asociada a sonda. Atribuirla sin buscar más dejaría otra causa sin tratar.' },
          { t: 'No: la fiebre fue igual de frecuente con y sin ITU, y sin piuria va en contra', ok: true },
          { t: 'Sí, si el recuento pasa de 10⁶', porque: 'El umbral es >10⁵; un recuento mayor no demuestra que la fiebre venga de la orina.' }],
        explicacion: 'Hay muchas causas de fiebre en la UCI. La <span class="hl-rojo">piuria</span> (>10 leucocitos por campo) no diagnostica, pero <span class="hl">su ausencia va en contra</span>. Sin hemocultivo con el mismo germen, la calculadora da bacteriuria asintomática.' },
      { id: 'ius-g6', corto: 'ABUTI', tipo: 'test', fuente: 'ma-itu-abuti',
        enunciado: 'El mismo E. coli en la orina (>10⁵ UFC/mL) y en los hemocultivos, sin síntomas urinarios. ¿Qué es?',
        opciones: [
          { t: 'Bacteriuria asintomática: sin síntomas no se trata', porque: 'El hemocultivo con el mismo germen la saca de esa definición: dejarías sin tratar una bacteriemia.' },
          { t: 'Una infección urinaria bacteriémica asintomática: cuenta como infección urinaria', ok: true },
          { t: 'Una contaminación del hemocultivo, por lo que repites ambos cultivos antes de dar ningún antibiótico', porque: 'El mismo germen en orina y sangre no es contaminación: lo define el NHSN como infección. Retrasarías el tratamiento.' }],
        explicacion: 'Bacteriuria >10⁵ UFC/mL con el mismo germen en hemocultivos = <span class="hl-rojo">infección urinaria, haya o no síntomas</span>. No aplica a Candida. Un 20 % de las bacteriemias del hospitalizado vienen de la sonda, pero la bacteriemia no es criterio.' },
      { id: 'ius-g7', corto: 'el plan', tipo: 'error', fuente: 'ma-itu-asintomatica · ma-itu-dirigido · ma-itu-no',
        enunciado: 'El plan de un R1 para pacientes sondados. Encuentra los errores (0, 1 o 2).',
        frases: [
          { t: 'Bacteriuria asintomática (una bacteria >10⁵, hemocultivos sin ese germen, sin síntomas): no la trato.' },
          { t: 'Antes de un procedimiento urológico que hará sangrar la mucosa, trato la bacteriuria asintomática.' },
          { t: 'Para que no se infecte, limpio el meato a diario con antiséptico.', mal: true, c: 'Limpiar a diario el punto de inserción <span class="hl-rojo">puede aumentar la bacteriuria</span>.' },
          { t: 'Si se confirma la infección, ajusto al antibiograma y recambio la sonda si lleva más de 2 semanas.' },
          { t: 'Mientras lleve la sonda, le doy un antibiótico sistémico profiláctico.', mal: true, c: 'Los <span class="hl-rojo">antibióticos sistémicos profilácticos</span> no se recomiendan: tampoco previenen la bacteriuria.' }],
        explicacion: 'La asintomática no se trata salvo antes de un procedimiento urológico con sangrado; la confirmada se ajusta al antibiograma y se recambia la sonda si lleva más de 2 semanas.' },
    ],
    examen: [
      { id: 'ius-e1', corto: 'tercer germen', tipo: 'test', fuente: 'ma-itu-germenes',
        enunciado: 'En la infección urinaria asociada a sonda, ¿qué germen es el tercero en frecuencia?',
        opciones: [
          { t: 'Pseudomonas aeruginosa (10 %)', porque: 'Es el cuarto. Si lo pones tercero, cubrirías Pseudomonas de entrada y descuidarías el enterococo (17 %).' },
          { t: 'Candida (5 %)', porque: 'Solo es el 5 %. Sobreestimar Candida llevaría a pedir antifúngicos en una candiduria que suele ser colonización.' },
          { t: 'Enterococos (17 %)', ok: true }],
        explicacion: 'E. coli 28 %, K. pneumoniae 23 %, <span class="hl">enterococos 17 %</span>, P. aeruginosa 10 %, Candida 5 %, estafilococos 3 %, estreptococos 3 %.' },
      { id: 'ius-e2', corto: 'tiempo de sonda', tipo: 'test', fuente: 'ma-itu-germenes',
        enunciado: '¿Cómo cambia la microbiología según el tiempo de sondaje?',
        opciones: [
          { t: 'Menos de 30 días predomina un germen; con ≥30 días, las polimicrobianas', ok: true },
          { t: 'Menos de 30 días, polimicrobianas; con ≥30 días, un solo germen predominante', porque: 'Está al revés. Esperarías un solo germen en una sonda crónica y darías antibióticos de más.' },
          { t: 'No cambia con el tiempo: depende solo de la antibioterapia previa', porque: 'La ficha asocia la duración del sondaje a la microbiología; ignorarlo te haría tratar siempre igual.' }],
        explicacion: 'Con sondaje corto (<30 días) predomina <span class="hl">un germen</span>; con sondaje largo (≥30 días), <span class="hl-rojo">las polimicrobianas</span>.' },
      { id: 'ius-e3', corto: 'excepción', tipo: 'test', fuente: 'ma-itu-asintomatica',
        enunciado: 'Bacteriuria asintomática en un paciente sondado, con una sola bacteria >10⁵ UFC/mL y hemocultivos negativos. ¿Cuándo se trata?',
        opciones: [
          { t: 'Cuando la sonda lleva más de 2 semanas', porque: 'El tiempo de sonda no es indicación de tratar: darías antibiótico sin indicación y seleccionarías resistencias.' },
          { t: 'Antes de un procedimiento urológico que haga sangrar la mucosa', ok: true },
          { t: 'Cuando el recuento supera 10⁶ UFC/mL', porque: 'El recuento no es la regla de tratamiento: sin síntomas ni procedimiento con sangrado, no se trata.' }],
        explicacion: 'No se trata, <span class="hl">salvo antes de un procedimiento urológico que haga sangrar la mucosa</span>.' },
      { id: 'ius-e4', corto: 'empírico', tipo: 'test', fuente: 'ma-itu-empirico',
        enunciado: 'Ante la sospecha de infección urinaria asociada a sonda, ¿qué empírico de primera línea en monoterapia cubre bacilos gramnegativos aerobios y enterococos?',
        opciones: [
          { t: 'Cefepima o levofloxacino', porque: 'Son alternativas de segunda línea, no la primera.' },
          { t: 'Piperacilina-tazobactam o meropenem, en monoterapia', ok: true },
          { t: 'Vancomicina en monoterapia, para cubrir los enterococos', porque: 'No figura entre las pautas de la ficha, que pide cubrir bacilos gramnegativos aerobios y enterococos: dejarías los gramnegativos sin cobertura.' }],
        explicacion: 'Cubrir bacilos gramnegativos aerobios y enterococos: <span class="hl">pip-tazo o un carbapenémico (meropenem) en monoterapia</span>; segunda línea, ceftazidima, cefepima o levofloxacino.' },
      { id: 'ius-e5', corto: 'recambio', tipo: 'test', fuente: 'ma-itu-dirigido',
        enunciado: 'Infección urinaria confirmada en un paciente cuya sonda lleva más de 2 semanas y aún la necesita. ¿Qué haces con ella?',
        opciones: [
          { t: 'La recambio, y si ya no hace falta, la retiro', ok: true },
          { t: 'La recambio solo si lleva más de 7 días', porque: 'El umbral de la ficha es más de 2 semanas. Cambiarías sondas sin necesidad o con un criterio que no es el de la fuente.' },
          { t: 'La mantengo hasta terminar el antibiótico, para no manipular', porque: 'Con la infección confirmada y una sonda de más de 2 semanas, la ficha pide recambiarla o retirarla; mantenerla perpetúa el foco.' }],
        explicacion: 'Confirmada: ajustar al antibiograma; <span class="hl">recambiar las sondas de más de 2 semanas</span> o retirarlas si ya no hacen falta; 7 días si responde pronto, 10-14 si no.' },
      { id: 'ius-e6', corto: 'bacteriemia', tipo: 'test', fuente: 'ma-itu-abuti',
        enunciado: 'Un 20 % de las bacteriemias del paciente hospitalizado vienen de la sonda. ¿Es la bacteriemia un criterio de infección asociada a sonda?',
        opciones: [
          { t: 'Sí: es el criterio de mayor peso del NHSN para diagnosticar la infección', porque: 'La bacteriemia no es criterio de la infección asociada a sonda. Si la usas como tal, diagnosticarías por la gravedad y no por los tres criterios.' },
          { t: 'No: no es criterio, aunque el 20 % vengan de la sonda', ok: true },
          { t: 'Sí, pero solo en el paciente con fiebre', porque: 'La fiebre es un criterio problemático por sí misma; no convierte a la bacteriemia en criterio.' }],
        explicacion: 'Un 20 % de las bacteriemias del hospitalizado vienen de la sonda, <span class="hl">aunque la bacteriemia no es criterio</span>. Distinto: la infección urinaria bacteriémica asintomática.' },
    ],
    casos: [
      { id: 'c5c2', titulo: 'Felisa, 82 años: la sonda del balance', corto: 'Caso · Felisa', sub: 'insuficiencia cardíaca, sonda desde el día 0, 58 kg',
        paciente: { Edad: '82 años', Peso: '58 kg', Motivo: 'ingreso por insuficiencia cardíaca', Sonda: 'vesical desde el día 0, «para el balance»', Vías: 'solo periférica' },
        pasos: [
          { momento: 'Día 6', datos: { 'Temperatura': '38,4 °C', FC: '92/min', PA: '132/70 mmHg', 'Dolor': 'sin dolor suprapúbico ni costovertebral', Leucocitos: '12.800/µl', Creatinina: '1,1 mg/dl', Urocultivo: 'E. coli 10⁶ UFC/mL', Sedimento: 'sin piuria' }, nuevo: ['Temperatura', 'FC', 'PA', 'Dolor', 'Leucocitos', 'Creatinina', 'Urocultivo', 'Sedimento'], calculadora: { ir: 'ma-nhsn-calc', nombre: 'NHSN: ¿ITU de sonda?' },
            pregunta: { id: 'c5c2-1', tipo: 'test', fuente: 'ma-itu-nhsn · ma-itu-fiebre · ma-itu-piuria · ma-hemoc-numero', modelo: { termostatoVivo: 'fiebre:1' }, origen: 'ficha · las cifras de la paciente son ilustrativas',
              enunciado: 'La calculadora dice que cumple criterios. ¿Qué pesa en contra de atribuirle la fiebre a la orina?',
              opciones: [
                { t: 'Nada en contra: cumple los criterios del NHSN, así que es una ITU segura y empiezo el tratamiento ya', porque: 'Habrías tratado una bacteriuria y seguido sin buscar la causa de la fiebre.' },
                { t: 'Sin piuria y fiebre igual con y sin ITU: busca otras fuentes y toma 3-4 hemocultivos', ok: true },
                { t: 'Que 10⁶ colonias es mucho: cuanto más alto el recuento, más segura', porque: 'El recuento >10⁵ es un umbral, no una medida de gravedad; no demuestra que la fiebre venga de la orina.' }],
              explicacion: 'Cumple el NHSN (sonda ≥2 días, fiebre, cultivo), pero <span class="hl-rojo">la fiebre fue igual con y sin ITU</span> y <span class="hl">sin piuria va en contra</span>. Revisa las fuentes de fiebre (Figura 44.1) y toma 3-4 hemocultivos en 24 h.' } },
          { momento: 'Día 6, tarde', datos: {}, nuevo: [],
            pregunta: { id: 'c5c2-2', tipo: 'test', fuente: 'ma-itu-empirico',
              enunciado: 'El adjunto quiere cubrir ya por sospecha. ¿Con qué?',
              opciones: [
                { t: 'Con vancomicina en monoterapia, que cubre los enterococos', porque: 'La ficha pide cubrir bacilos gramnegativos aerobios y enterococos, y la vancomicina no figura entre sus pautas: dejarías los gramnegativos sin cobertura.' },
                { t: 'Esperar al resultado del hemocultivo sin tratar', porque: 'La ficha recomienda el empírico ante sospecha: esperar dejaría sin cobertura una posible bacteriemia en una mujer de 82 años.' },
                { t: 'Piperacilina-tazobactam o meropenem en monoterapia', ok: true }],
              explicacion: 'Ante sospecha, cubrir <span class="hl">bacilos gramnegativos aerobios y enterococos</span>: pip-tazo o meropenem en monoterapia.' } },
          { momento: 'Día 7', datos: { Hemocultivos: '2 de 3 con el mismo E. coli', Síntomas: 'sigue sin síntomas urinarios' }, nuevo: ['Hemocultivos', 'Síntomas'], calculadora: { ir: 'ma-nhsn-calc', nombre: 'NHSN: ¿ITU de sonda?' },
            pregunta: { id: 'c5c2-3', tipo: 'test', fuente: 'ma-itu-abuti · ma-itu-dirigido', origen: 'ficha · las cifras de la paciente son ilustrativas',
              enunciado: 'Dos de los tres hemocultivos crecen con el mismo E. coli de la orina. ¿Qué es ahora?',
              opciones: [
                { t: 'Bacteriuria asintomática: no se trata y se vigila la evolución sin antibiótico', porque: 'Tiene fiebre y el hemocultivo con el mismo germen la saca de esa definición; no tratarla sería dejar una bacteriemia sin antibiótico.' },
                { t: 'Infección urinaria asociada a sonda con bacteriemia (mismo germen en orina y sangre): se ajusta al antibiograma', ok: true },
                { t: 'Una bacteriemia por catéter venoso', porque: 'Felisa no tiene vía central, solo una periférica; buscarías un catéter que no hay.' }],
              explicacion: 'Mismo germen en orina (>10⁵) y en sangre = <span class="hl-rojo">infección urinaria asociada a sonda con bacteriemia</span> (sonda ≥2 días y fiebre). Se ajusta al antibiograma.' } },
          { momento: 'Día 7', datos: {}, nuevo: [],
            pregunta: { id: 'c5c2-4', tipo: 'error', fuente: 'ma-itu-dirigido · ma-itu-retirar · ma-itu-no',
              enunciado: 'El plan del R1 para Felisa. Encuentra los errores (0, 1 o 2).',
              frases: [
                { t: 'E. coli en orina >10⁵ y en sangre: infección urinaria con bacteriemia, aunque no tenga síntomas urinarios.' },
                { t: 'Ajusto al antibiograma y mantengo 7 días si responde pronto.' },
                { t: 'Mantengo la sonda: no llega a las 2 semanas, aunque ya no la necesita para el balance.', mal: true, c: 'Retirar la sonda en cuanto no haga falta <span class="hl-verde">es la medida más eficaz</span>.' },
                { t: 'Limpieza diaria del meato con antiséptico para que no se repita.', mal: true, c: 'Limpiar a diario el punto de inserción <span class="hl-rojo">puede aumentar la bacteriuria</span>.' }],
              explicacion: 'La infección bacteriémica se trata 7 días si responde pronto; la sonda se retira en cuanto no hace falta y no se limpia el meato a diario.' } },
          { momento: 'Día 9', datos: { Fiebre: 'afebril desde hoy', Sonda: 'puesta desde el día 0', Antibiótico: 'pip-tazo desde el día 6; el E. coli es sensible' }, nuevo: ['Fiebre', 'Sonda', 'Antibiótico'],
            pregunta: { id: 'c5c2-5', tipo: 'destapa', fuente: 'ma-itu-dirigido · ma-itu-retirar', cuantas: 'son tres cosas', origen: 'ficha · los datos de la paciente son ilustrativos',
              enunciado: 'Responde pronto al tratamiento. ¿Qué haces con el antibiótico y con la sonda? Son tres cosas.',
              puntos: [
                'Ajustar el antibiótico <span class="hl">al antibiograma</span>.',
                'Una duración de <span class="hl-verde">7 días</span> si responde pronto (10-14 días si no).',
                'Retirar la sonda <span class="hl-rojo">en cuanto no haga falta</span> (o recambiarla si lleva más de 2 semanas).'],
              explicacion: 'Aquí la sonda solo se puso para el balance: quitarla es la medida más eficaz.' } },
        ],
        lleva: [
          'Bacteriuria no es infección: sin piuria, duda, y el hemocultivo con el mismo germen la convierte en infección urinaria.',
          'Quitar la sonda vale más que cualquier antibiótico; limpiar el meato, no.',
          'Responde pronto: 7 días, ajustados al antibiograma, y la sonda fuera en cuanto no haga falta.'],
        volver: { nombre: 'Piuria y fiebre', ancla: 'ma-itu-piuria', modelo: { termostatoVivo: 'fiebre' } } },
    ],
    profundizar: [
      { id: 'ma-itu-germenes', titulo: 'Gérmenes: estafilococos y estreptococos 3 %' },
      { id: 'ma-itu-no', titulo: 'Lo que no se hace: limpiar el meato, profilaxis y sondas de plata' },
      { id: 'ma-itu-abuti', titulo: 'El 20 % de las bacteriemias del hospitalizado' },
      { id: 'ma-itu-bacteriuria', titulo: 'Biopelículas de la sonda' },
    ],
  },

  /* =================================================================================================
     Ficha 12 · Candiduria (págs. 42-43)
     ================================================================================================= */
  'ma-candiduria': {
    entrada: 'Cuándo la Candida en la orina es solo colonización, cuándo es la pista de una candidiasis diseminada y qué antifúngico va con cada escenario.',
    guia: [
      { id: 'cdu-g1', corto: 'causa o consecuencia', tipo: 'test', fuente: 'ma-cand-que · ma-candidiasis', nota: NOTA_CANDIDURIA,
        enunciado: 'Candida en la orina de un paciente sondado. ¿Es causa o consecuencia de una candidiasis diseminada?',
        opciones: [
          { t: 'Causa: la Candida sube desde la vejiga hasta el riñón y la sangre y disemina', porque: 'El libro la describe como consecuencia, no causa. Buscarías la fuente en la vía urinaria y perderías la candidiasis sistémica.' },
          { t: 'Colonización sin más: con sonda no hace falta pensar en otra cosa', porque: 'Suele serlo, pero puede ser la única pista: los hemocultivos son negativos en más del 50 % de las diseminadas.' },
          { t: 'Suele ser colonización, pero puede ser consecuencia de una diseminada', ok: true }],
        explicacion: 'Con sonda, la Candida en orina <span class="hl">suele ser colonización</span>, pero puede ser signo de candidiasis diseminada (<span class="hl-rojo">consecuencia, no causa</span>); los hemocultivos son negativos en más del 50 % de las diseminadas.' },
      { id: 'cdu-g2', corto: 'el recuento', tipo: 'test', fuente: 'ma-cand-micro',
        enunciado: 'Un urocultivo da Candida a 10⁴ UFC/mL y otro, a 10⁶. ¿Cambia algo en el manejo?',
        opciones: [
          { t: 'Sí: con 10⁶ UFC/mL ya es una infección que hay que tratar y con 10⁴ UFC/mL es solo colonización', porque: 'El recuento no predice la afectación renal ni la diseminación; tratarías por un número.' },
          { t: 'No: el recuento de colonias no predice la afectación renal ni la diseminación', ok: true },
          { t: 'Sí: con 10⁴ se repite el cultivo hasta 10⁵ antes de decidir', porque: 'Esperarías una cifra que no orienta, y la decisión depende de síntomas y neutropenia.' }],
        explicacion: '<span class="hl-rojo">El recuento no predice</span>. C. albicans en ~50 %, seguida de <span class="hl">C. glabrata</span>, notable por su resistencia al fluconazol.' },
      { id: 'cdu-g3', corto: 'el neutropénico', tipo: 'test', fuente: 'ma-cand-asintomatica', modelo: visual('ma-candiduria', '👁️ Candiduria (vista Visual)'),
        enunciado: 'Predice con el selector: candiduria asintomática en un neutropénico. ¿La tratas, y con qué?',
        opciones: [
          { t: 'No: sin síntomas no se trata', porque: 'En el neutropénico hay riesgo de diseminación; esperarías a que se disemine.' },
          { t: 'Sí: por el riesgo de diseminación, con una equinocandina', ok: true },
          { t: 'Sí, con fluconazol oral a 200-400 mg/día durante 2 semanas, como en la cistitis', porque: 'Es la pauta de la infección urinaria por especie sensible; en el neutropénico la ficha da una equinocandina.' }],
        explicacion: 'No se trata <span class="hl">salvo en el neutropénico</span> (riesgo de diseminación): profilaxis con una equinocandina (caspofungina, micafungina o anidulafungina).' },
      { id: 'cdu-g4', corto: 'C. glabrata', tipo: 'destapa', fuente: 'ma-cand-tto · ma-cand-micro', cuantas: 'son tres cosas',
        enunciado: 'Cistitis por C. glabrata. ¿Por qué no fluconazol, por qué no una equinocandina y qué das? Son tres cosas.',
        puntos: [
          'No fluconazol: la glabrata es <span class="hl-rojo">resistente</span>.',
          'No equinocandina: <span class="hl">penetra mal en la orina</span>.',
          'Anfotericina B <span class="hl-azul">0,3-0,6 mg/kg/día durante 1-7 días</span>.'],
        explicacion: 'Esa pauta es para la especie resistente (C. glabrata, C. krusei).' },
      { id: 'cdu-g5', corto: 'quién se pega', tipo: 'test', fuente: 'ma-cand-final',
        enunciado: '¿Qué tienen en común E. coli en la vejiga y los patógenos de la boca en la infección nosocomial?',
        opciones: [
          { t: 'Que en los dos sitios hay muchos más gérmenes de los que debería haber', porque: 'No es cuántos hay, sino quién se pega al epitelio; medir cantidad no explica la infección.' },
          { t: 'La adherencia al epitelio (pili; la manosa puede bloquearla), no la cantidad', ok: true },
          { t: 'Que infectan tras antibioterapia previa de amplio espectro', porque: 'La clave es la adherencia, no la antibioterapia previa.' }],
        explicacion: 'En boca, intestino y vía urinaria la clave es <span class="hl">quién se pega al epitelio</span>, no cuántos hay. E. coli usa sus pili para unirse a glucoproteínas de la vejiga y azúcares como la <span class="hl">manosa</span> pueden bloquear esa unión.' },
    ],
    examen: [
      { id: 'cdu-e1', corto: 'qué especies', tipo: 'test', fuente: 'ma-cand-micro',
        enunciado: 'En la candiduria, ¿qué especie predomina y cuál es la segunda?',
        opciones: [
          { t: 'C. glabrata como especie más frecuente y luego C. albicans como segunda', porque: 'Al revés: la albicans es la primera (~50 %). Pensarías en la resistencia al fluconazol antes de lo debido.' },
          { t: 'C. albicans (~50 %), seguida de C. glabrata, resistente al fluconazol', ok: true },
          { t: 'C. krusei y luego C. albicans', porque: 'La segunda es la glabrata; la krusei figura entre las resistentes, pero no es la segunda en frecuencia.' }],
        explicacion: 'C. albicans en ~50 %, seguida de <span class="hl">C. glabrata</span>, notable por su resistencia al fluconazol.' },
      { id: 'cdu-e2', corto: 'sintomática', tipo: 'test', fuente: 'ma-cand-sintomatica',
        enunciado: 'Candiduria con fiebre y dolor costovertebral. ¿Qué haces?',
        opciones: [
          { t: 'Retirar la sonda y observar', porque: 'La retirada no sustituye el tratamiento de una candiduria sintomática.' },
          { t: 'Antifúngico, hemocultivos e imagen renal (ecografía o TC)', ok: true },
          { t: 'Fluconazol 2 semanas sin más pruebas', porque: 'Faltaría descartar la diseminación y las complicaciones renales con hemocultivos e imagen.' }],
        explicacion: 'Sintomática: <span class="hl">antifúngico + hemocultivos + imagen renal</span> (ecografía o TC) para buscar abscesos u obstrucción.' },
      { id: 'cdu-e3', corto: 'sistémica', tipo: 'test', fuente: 'ma-cand-tto',
        enunciado: 'Candidiasis sistémica sospechada o confirmada. ¿Por qué se prefiere una equinocandina al fluconazol?',
        opciones: [
          { t: 'Porque es activa frente a todas las especies', ok: true },
          { t: 'Porque penetra mejor en la orina y alcanza concentraciones altas', porque: 'Al contrario: las equinocandinas penetran mal en la orina.' },
          { t: 'Porque penetra mejor en el riñón', porque: 'La ficha no da esa razón; la razón es la especie, y las equinocandinas penetran mal en la orina.' }],
        explicacion: 'Equinocandina: <span class="hl">activa frente a todas las especies; mejor que el fluconazol</span>.' },
      { id: 'cdu-e4', corto: 'nefrostomía', tipo: 'test', fuente: 'ma-cand-tto',
        enunciado: 'En un paciente con nefrostomía y bola fúngica, ¿qué lavados se hacen?',
        opciones: [
          { t: 'Anfotericina B 0,3-0,6 mg/kg/día por vía intravenosa durante una semana', porque: 'Esa es la dosis sistémica de la infección por glabrata o krusei, no la de los lavados.' },
          { t: 'Anfotericina B 25-50 mg en 200-500 mL de agua estéril', ok: true },
          { t: 'Fluconazol oral 200-400 mg/día', porque: 'Es la pauta de la infección por especie sensible, no de los lavados.' }],
        explicacion: 'Bolas fúngicas: <span class="hl">cirugía</span>. Con nefrostomía, lavados con anfotericina B (25-50 mg en 200-500 mL de agua estéril).' },
      { id: 'cdu-e5', corto: 'ABUTI y Candida', tipo: 'test', fuente: 'ma-itu-abuti',
        enunciado: 'La regla de la infección urinaria bacteriémica asintomática (mismo germen >10⁵ en orina y sangre = infección):',
        opciones: [
          { t: 'Se aplica igual a Candida y a las bacterias', porque: 'No aplica a Candida; con Candida en orina y sangre habría que pensar en candidiasis, pero la regla no vale.' },
          { t: 'No aplica a Candida, solo a bacterias', ok: true },
          { t: 'Solo se aplica con sonda', porque: 'Se aplica con o sin sonda: si la limitas a los sondados, perderías casos en pacientes sin sonda.' }],
        explicacion: 'Es la regla de bacteriuria con el mismo germen en hemocultivos; <span class="hl-rojo">no aplica a Candida</span>.' },
    ],
    casos: [
      { id: 'c5c3', titulo: 'Felisa, 82 años: la candiduria que no se va', corto: 'Caso · Felisa', sub: 'insuficiencia cardíaca, sonda desde el día 0, 58 kg',
        paciente: { Edad: '82 años', Peso: '58 kg', Motivo: 'ingreso por insuficiencia cardíaca', Antecedente: 'infección urinaria bacteriémica por E. coli tratada con pip-tazo' },
        pasos: [
          { momento: 'Día 10', datos: { Vía: 'central desde hoy, para nutrición parenteral (íleo y vómitos desde el día 8)', Antibiótico: 'pip-tazo desde el día 6', Sonda: 'retirada el día 9' }, nuevo: ['Vía', 'Antibiótico', 'Sonda'],
            pregunta: { id: 'c5c3-1', tipo: 'test', fuente: 'ma-candidiasis', origen: 'ficha · los datos de la paciente son ilustrativos',
              enunciado: 'Felisa lleva ahora una vía central y un antibiótico de amplio espectro. ¿Qué cambia respecto al riesgo de candidiasis invasiva?',
              opciones: [
                { t: 'Nada: esos factores solo importan en el neutropénico', porque: 'La ficha los da como factores de riesgo generales de candidiasis invasiva, que casi todos los pacientes de UCI tienen; ignorarlos te haría olvidar a Candida cuando la fiebre persista.' },
                { t: 'Tiene factores de riesgo: vía central y antibióticos de amplio espectro', ok: true },
                { t: 'Solo cuenta si hay cirugía abdominal reciente', porque: 'La cirugía abdominal es un factor más, no el único: la vía central y los antibióticos de amplio espectro también lo son, y no pensarías en el hongo.' }],
              explicacion: 'Factores de riesgo de candidiasis invasiva: <span class="hl">vía central, cirugía abdominal reciente, antibióticos de amplio espectro</span>; casi todos los tienen, por eso se piensa en ella ante una fiebre persistente sin causa.' } },
          { momento: 'Día 14', datos: { Fiebre: 'afebril desde el día 9', Antibiótico: 'terminado', Sonda: 'nueva, por retención', Urocultivo: 'Candida albicans 10⁴', Síntomas: 'ninguno' }, nuevo: ['Fiebre', 'Antibiótico', 'Sonda', 'Urocultivo', 'Síntomas'], calculadora: { ir: 'ma-cand-calc', nombre: 'Candiduria: ¿qué hago?' },
            pregunta: { id: 'c5c3-2', tipo: 'test', fuente: 'ma-cand-asintomatica · ma-cand-micro', origen: 'ficha · las cifras de la paciente son ilustrativas',
              enunciado: 'Urocultivo de control con Candida albicans, sin fiebre ni dolor. ¿Qué haces?',
              opciones: [
                { t: 'Fluconazol 200 mg al día durante 2 semanas por vía oral', porque: 'Tratarías una colonización en una paciente que no es neutropénica; es la pauta de la infección por especie sensible.' },
                { t: 'Asintomática sin neutropenia: no se trata', ok: true },
                { t: 'Repetir hasta 10⁵ UFC/mL', porque: 'El recuento no predice la afectación renal ni la diseminación: esperar a una cifra no te orienta.' }],
              explicacion: 'Candiduria <span class="hl">asintomática, sin neutropenia: no se trata</span>. El recuento de colonias no predice la afectación renal ni la diseminación.' } },
          { momento: 'Día 14 · la nota', datos: {}, nuevo: [],
            pregunta: { id: 'c5c3-3', tipo: 'error', fuente: 'ma-cand-asintomatica · ma-cand-micro · ma-cand-tto',
              enunciado: 'El plan del R1 ante las candidurias. Encuentra los errores (0, 1 o 2).',
              frases: [
                { t: 'Candida albicans en orina, sin síntomas y sin neutropenia: no la trato.' },
                { t: 'Antes de decidir, repito el cultivo hasta que el recuento llegue a 10⁵ UFC/mL.', mal: true, c: '<span class="hl-rojo">El recuento no predice</span> la afectación renal ni la diseminación.' },
                { t: 'Si fuera un neutropénico, daría una equinocandina por el riesgo de diseminación.' },
                { t: 'Si creciera C. glabrata y hubiera infección urinaria, daría fluconazol.', mal: true, c: 'La glabrata es <span class="hl-rojo">resistente al fluconazol</span>: se da anfotericina B 0,3-0,6 mg/kg/día 1-7 días.' }],
              explicacion: 'Asintomática sin neutropenia: no se trata; con neutropenia, equinocandina; glabrata o krusei, anfotericina.' } },
          { momento: 'Día 18 · el giro', datos: { Temperatura: '38,6 °C', Fiebre: 'desde el día 15', FC: '104/min', PA: '104/58 mmHg', Vía: 'central desde el día 10, para nutrición parenteral', Hemocultivos: 'del día 16, centrales y periféricos negativos', Candiduria: 'persistente', Fuente: 'sin foco tras revisar catéter y pulmones', Síntomas: 'fiebre; sin síntomas urinarios' }, nuevo: ['Temperatura', 'Fiebre', 'FC', 'PA', 'Vía', 'Hemocultivos', 'Candiduria', 'Fuente', 'Síntomas'],
            pregunta: { id: 'c5c3-4', modelo: { termostatoVivo: 'fiebre' }, tipo: 'destapa', fuente: 'ma-candidiasis · ma-cand-que · ma-empirico', cuantas: 'son tres cosas', origen: 'ficha · las cifras de la paciente son ilustrativas', nota: NOTA_CANDIDURIA,
              enunciado: '¿Por qué piensas en candidiasis diseminada y qué das? Son tres cosas.',
              puntos: [
                'Tiene los factores (<span class="hl">vía central, antibiótico de amplio espectro</span>) y fiebre persistente sin otra causa, con candiduria persistente: consecuencia, no causa.',
                'El <span class="hl-rojo">hemocultivo negativo no la descarta</span>: su sensibilidad puede ser tan baja como el 20 % (PCR >90 %).',
                'Una <span class="hl-azul">equinocandina</span>, no fluconazol: la mitad no son C. albicans.'],
              explicacion: 'Equinocandina (o anfotericina si grave) con riesgo de candidiasis invasiva y fiebre persistente sin causa o candiduria persistente.' } },
          { momento: 'Día 19', datos: {}, nuevo: [],
            pregunta: { id: 'c5c3-5', tipo: 'test', fuente: 'ma-cand-tto · ma-candidiasis',
              enunciado: 'El R1 propone fluconazol «porque es C. albicans en la orina». ¿Qué le contestas?',
              opciones: [
                { t: 'Anfotericina B 0,3-0,6 mg/kg/día en toda candiduria', porque: 'Es la pauta de la infección urinaria por C. glabrata o C. krusei, no del empírico de la candidiasis diseminada.' },
                { t: 'Equinocandina por vía sistémica para la glabrata de la orina, que es resistente al fluconazol', porque: 'Las equinocandinas penetran mal en la orina; sirven para la candidiasis sistémica, no para tratar la infección urinaria por glabrata.' },
                { t: 'Equinocandina para la diseminada; fluconazol para la infección urinaria sensible', ok: true }],
              explicacion: 'Sistémica sospechada o confirmada: <span class="hl-rojo">equinocandina</span> (activa frente a todas las especies; mejor que el fluconazol). Fluconazol oral 200-400 mg/día 2 semanas: cistitis o pielonefritis por especie sensible.' } },
        ],
        lleva: [
          'La candiduria asintomática sin neutropenia no se trata, y el recuento no decide.',
          'Si persiste con fiebre y vía central, es la pista de la candidiasis diseminada.',
          'Para la diseminada, equinocandina; el fluconazol, solo en la infección urinaria sensible.'],
        volver: { nombre: 'Candiduria: ¿qué hago?', ancla: 'ma-cand-que', modelo: { termostatoVivo: 'fiebre' } } },
    ],
    profundizar: [
      { id: 'ma-cand-tto', titulo: 'Bolas fúngicas (cirugía) y lavados por nefrostomía' },
    ],
  },
};
