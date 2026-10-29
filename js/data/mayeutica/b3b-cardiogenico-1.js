// Mayéutica del bloque 3, sub-bloque 3B · Shock cardiogénico, parte 1 (Marino cap. 16, págs. 37-41): ficha 6 y el caso C6 (Fermín).
// Datos puros; el formato está en la cabecera de b1-fluidos.js. La ficha es js/modules/cardiologia/merino-cardiologia.html.
// Modelos vivos: shockVivo `cardio`, `iam-vd` y `rotura-septo` (js/data/shock-vivo-data.js).
// Las cifras de Fermín (hora 2) son las del estado `iam-vd` con su gravedad de receta (autonomo/bloques/b3/herramientas/g3-estados-cifras.mjs).
const PDF = 'docs/marino-2024-shock-caps14-17.pdf';
const pag = (n, txt) => `<a class="biblio-link" href="${PDF}#page=${n}" target="_blank" rel="noopener">${txt || `PDF pág. ${n}`}</a>`;
const p = n => pag(n, `pág. ${n}`);
// «Ver en la ficha» dentro de una nota (REGLAS §7.9): el enlace cruzado de siempre al párrafo exacto.
const enFicha = (tab, id) => ` <button type="button" class="may-ir" data-especialidad="cardiologia" data-view="merinoCardiologia" data-panel="panel-merino-cardio-tabs" data-tab="${tab}" data-resaltar="#${id}">Ver en la ficha ↗</button>`;
const sv = (clave, texto) => ({ shockVivo: clave, texto });
const FICHA = 'mc-cardiogenico-fisio';

export const MAYEUTICA_CARDIOGENICO_1 = {
  /* =================================================================================================
     Ficha 6 · Shock cardiogénico: fisiopatología (cap. 16, págs. 37-41)
     ================================================================================================= */
  'mc-cardiogenico-fisio': {
    entrada: 'Qué infartos llevan al shock, qué lo separa de la insuficiencia cardíaca, qué ventrículo falla según la PVC y la PCP, y las tres excepciones que engañan.',
    guia: [
      { id: 'cgf-g1', corto: 'cuánto VI', tipo: 'test', fuente: 'mc-infarto-vi-40 · mc-fig-16-1',
        enunciado: 'Un infarto del ventrículo izquierdo causa casi 8 de cada 10 shocks cardiogénicos por IAM. Antes de leer la ficha: ¿cuánta masa funcional del VI hay que perder para llegar al shock?',
        opciones: [
          { t: 'Con el 10 % ya basta: cualquier infarto, por pequeño que sea, lo causa', porque: `El libro exige perder al menos el 40 % de la masa funcional del VI (${p(38)}). Con un umbral tan bajo llamarías shock en riesgo a casi todos los infartados y no verías al que de verdad lo está.` },
          { t: 'Al menos el 40 % de la masa funcional', ok: true },
          { t: 'Más del 70 %: hasta entonces el corazón compensa', porque: `El umbral que da el libro es del 40 % (${p(38)}). Esperar una pérdida del 70 % retrasaría el reconocimiento de un shock que ya está presente con menos.` }],
        explicacion: `El infarto del VI causa ~80 % de los casos «y requiere la pérdida de <span class="hl-rojo">al menos el 40 % de la masa funcional</span> del ventrículo» (${p(38)}). El del VD solo está implicado en <5 % (${p(38)}).` },
      { id: 'cgf-g2', corto: 'adónde va el punto', tipo: 'test', fuente: 'mc-cs-hemodinamica', modeloVivo: sv('cardio', '🫀 Mira el fallo de bomba izquierda: el monitor de Aurelio'),
        enunciado: 'Predice, y luego lo compruebas en el modelo: si falla la bomba del ventrículo izquierdo, ¿qué pasa con el gasto, con la presión de llenado y con las resistencias sistémicas?',
        opciones: [
          { t: 'El gasto baja y la presión de llenado y las resistencias también bajan, porque el corazón envía menos sangre', porque: `Es al revés: baja el gasto, pero suben las presiones de llenado y las resistencias, por activación simpática y del sistema renina-angiotensina-aldosterona (${p(40)}). Esperar presiones bajas te haría dar volumen a un pulmón que ya se está llenando.` },
          { t: 'El gasto baja y las presiones de llenado no cambian', porque: `El descenso del gasto «se acompaña de un aumento de las presiones de llenado» (${p(40)}). Si no lo esperas, no leerás una PCP alta como lo que es.` },
          { t: 'Baja el gasto, sube la presión de llenado y suben las resistencias', ok: true }],
        explicacion: `Descenso del gasto, <span class="hl-rojo">aumento de las presiones de llenado</span> (la PVC o la PCP, según qué ventrículo falle) y aumento de las resistencias sistémicas (simpático y renina-angiotensina-aldosterona). Estos cambios ocurren en la insuficiencia cardíaca y en el shock (${p(40)}).` },
      { id: 'cgf-g3', corto: 'shock o IC', tipo: 'test', fuente: 'mc-cs-hemodinamica',
        enunciado: 'Los cambios del gasto, las presiones de llenado y las resistencias se ven igual en la insuficiencia cardíaca y en el shock cardiogénico. ¿Qué es lo que separa al shock?',
        opciones: [
          { t: 'La hipoperfusión tisular (hipotensión, poca diuresis) y la oxigenación inadecuada (lactato alto)', ok: true },
          { t: 'Que el índice cardíaco sea más bajo que en la insuficiencia cardíaca, por debajo de 2,2', porque: `El índice típico del shock es <2,2 L/min/m² (${p(40)}), pero el libro no define el shock por una cifra de gasto: lo define por la hipoperfusión. Un índice bajo sin hipoperfusión te llevaría a tratar un shock que no lo es.` },
          { t: 'Que las resistencias sistémicas estén altas y la presión de llenado elevada, algo que no ocurre en la insuficiencia cardíaca', porque: `Las resistencias suben en los dos cuadros (${p(40)}). Usarlas para separarlos te haría descartar un shock cuando no estén altas.` }],
        explicacion: `«El shock cardiogénico se distingue de la insuficiencia cardíaca por la presencia de <span class="hl-azul">hipoperfusión tisular</span> (p. ej. hipotensión, diuresis disminuida) y oxigenación tisular inadecuada (p. ej. lactato elevado)» (${p(40)}).` },
      { id: 'cgf-g4', corto: '¿PCP siempre alta?', tipo: 'test', fuente: 'mc-cs-excepciones', modeloVivo: sv('cardio', '🫀 La PCP en el modelo'),
        enunciado: 'Predice: en el shock cardiogénico por infarto, ¿la presión de llenado está siempre aumentada?',
        opciones: [
          { t: 'Sí, siempre: sin PCP alta no es un shock cardiogénico, así que hay que buscar otra causa', porque: `No siempre: no está aumentada en hasta el 30 % de los pacientes con shock por infarto (${p(40)}). Con esa regla descartarías a uno de cada tres y le negarías el volumen que le subiría el gasto (${p(42)}).` },
          { t: 'Solo falta en el 5 %, la proporción sin hipotensión', porque: `Mezclas dos excepciones. El 5 % es la ausencia de hipotensión; la presión de llenado no elevada llega al 30 % (${p(40)}).` },
          { t: 'No: en hasta el 30 % de los infartados con shock no está aumentada', ok: true }],
        explicacion: `Primera excepción: las presiones de llenado <span class="hl-rojo">no están aumentadas en hasta el 30 %</span> de los pacientes con shock por infarto (${p(40)}). Cuando eso ocurre, el volumen puede ser instrumental para subir el gasto (${p(42)}).`,
        nota: `<b>La fuente no lo dice.</b> El modelo enseña el caso de PCP alta; el libro da el 30 % sin describir cómo es la presión de ese paciente.` },
      { id: 'cgf-g5', corto: 'PVC o PCP', tipo: 'test', fuente: 'mc-cs-vd', modeloVivo: sv('iam-vd', '🫀 Fermín: el infarto del VD en el modelo'),
        enunciado: 'Predice, y luego lo compruebas: un infarto inferior deja al VD sin fuerza, pero el VI casi intacto. ¿Qué presión se eleva en el catéter, y qué fracción de eyección se encuentra?',
        opciones: [
          { t: 'La PVC (cociente PVC/PCP aumentado) y la FEVI normal', ok: true },
          { t: 'La PCP, y la fracción de eyección baja', porque: `La PCP refleja el llenado del VI, que aquí está casi intacto; en el fallo del VD lo característico es un cociente PVC/PCP aumentado, un VD dilatado y la FEVI normal (${p(40)}). Buscar una PCP alta te haría pasar por alto el fallo derecho.` },
          { t: 'Las dos por igual, y la FEVI baja, como en un infarto extenso del VI', porque: `Si fallara el VI subirían las dos; en el VD predomina la PVC y la FEVI se conserva (${p(40)}).` }],
        explicacion: `Rasgos del fallo del VD: <span class="hl-rojo">cociente PVC/PCP aumentado</span>, <span class="hl-azul">VD dilatado</span> y fracción de eyección del VI normal. El shock por fallo del VD se parece al del VI, pero tiene menor mortalidad (${p(40)}).`,
        nota: `<b>La fuente no lo dice.</b> El libro no da un valor normal del cociente PVC/PCP ni la conducta del fallo del VD: la remite al capítulo 18 (${p(40)}); no se cubre aquí.` + enFicha(FICHA, 'mc-cs-vd') },
      { id: 'cgf-g6', corto: 'el septo roto', tipo: 'test', fuente: 'mc-septo-rotura', modeloVivo: sv('rotura-septo', '🫀 Remedios: la rotura del septo en el modelo'),
        enunciado: 'Predice: el septo interventricular se rompe en las primeras horas del infarto. ¿Hacia dónde pasa la sangre, y qué le ocurre al flujo que sale al resto del cuerpo?',
        opciones: [
          { t: 'Pasa de derecha a izquierda y baja la saturación arterial sistémica', porque: `La rotura del septo da un shunt izquierda-derecha (${p(38)}). Imaginarlo al revés te haría buscar cianosis por mezcla venosa en vez de un pulmón inundado.` },
          { t: 'No pasa sangre: el orificio solo sube la presión del VI y baja algo el gasto', porque: `La fuente describe «un gran shunt izquierda-derecha» que «inunda la circulación pulmonar y desvía flujo de la circulación sistémica» (${p(38)}). Ignorar el shunt retrasaría el diagnóstico.` },
          { t: 'Pasa de izquierda a derecha: inunda el pulmón y le quita flujo al resto del cuerpo', ok: true }],
        explicacion: `La rotura del septo (4 % de los casos) se acompaña de un <span class="hl-rojo">gran shunt izquierda-derecha</span> que inunda la circulación pulmonar y desvía flujo de la sistémica (${p(38)}).`,
        nota: `<b>La fuente no lo dice.</b> El libro no da el salto de saturación entre la aurícula derecha y la arteria pulmonar ni el cociente Qp/Qs de esta rotura; en el modelo aparecen como consecuencia del shunt (fisiología general).` + enFicha(FICHA, 'mc-septo-rotura') },
      { id: 'cgf-g7', corto: 'tres excepciones', tipo: 'destapa', cuantas: 'son tres excepciones', fuente: 'mc-cs-excepciones · mc-cs-inflamacion',
        enunciado: 'Marino avisa de que el cuadro «típico» (gasto bajo, presión de llenado alta, resistencias altas, hipotensión) tiene excepciones. ¿Cuáles son tres?',
        puntos: [
          `Las <span class="hl-rojo">presiones de llenado no están aumentadas</span> en hasta el 30 % de los infartos con shock.`,
          `Las <span class="hl-azul">resistencias sistémicas pueden no estar elevadas</span> si hay inflamación sistémica (óxido nítrico, ${p(41)}).`,
          `La <span class="hl-rojo">hipotensión falta</span> en cerca del 5 % de los casos.`],
        explicacion: `Las tres están en el mismo párrafo (${p(40)}). El índice cardíaco, en cambio, sí es típicamente <2,2 L/min/m² (normal 2,4-4,0).` + enFicha(FICHA, 'mc-cs-excepciones') },
    ],
    examen: [
      { id: 'cgf-e1', corto: 'qué causa el shock', tipo: 'test', fuente: 'mc-cs-iam-dos-tercios',
        enunciado: 'Esta ficha dice que el infarto agudo de miocardio causa unos dos tercios de los shocks cardiogénicos. La ficha de definiciones del shock (cap. 14) da «~50 %» para el síndrome coronario agudo. ¿Se contradicen?',
        opciones: [
          { t: 'No: son dos categorías (síndrome coronario agudo e infarto), cada una con la cifra de su capítulo', ok: true },
          { t: 'Sí: uno de los dos capítulos tiene una errata y hay que quedarse con la cifra del cap. 16, que es el específico', porque: `Son categorías relacionadas, no idénticas (el síndrome coronario agudo es más amplio que el infarto): cada capítulo da su cifra tal cual la publica (${p(37)}). Borrar una te dejaría sin la otra.` },
          { t: 'No: es la misma cifra, redondeada distinto', porque: `50 % y dos tercios no son la misma cifra: corresponden a categorías distintas, y el libro no las equipara (${p(37)}).` }],
        explicacion: `Cap. 16: el infarto agudo de miocardio causa <span class="hl">unos dos tercios</span> (${p(37)}). Cap. 14: el síndrome coronario agudo, ~50 %.`,
        nota: `<b>Nota de fuentes.</b> Dos cifras para categorías relacionadas, no idénticas. Se muestran las dos, cada una de su capítulo, sin reconciliarlas.` + enFicha(FICHA, 'mc-cs-iam-dos-tercios') },
      { id: 'cgf-e2', corto: '¿cuántos infartos?', tipo: 'test', fuente: 'mc-cs-iam-dos-tercios',
        enunciado: '¿En qué proporción de los infartos agudos de miocardio se desarrolla un shock cardiogénico?',
        opciones: [
          { t: 'En cerca de la mitad, que es lo que muere', porque: `La mitad es la mortalidad del shock cardiogénico pese al mejor manejo (${p(37)}), no su frecuencia. Confundirlas te haría esperar un shock en un infarto de cada dos.` },
          { t: 'En el 1 %, igual que la rotura de la pared libre', porque: `El 1 % es el peso de la rotura de la pared libre dentro de los shocks por infarto (${p(38)}), no la proporción de infartos que llegan al shock (${p(37)}).` },
          { t: 'En el 5-10 %', ok: true }],
        explicacion: `El shock se desarrolla en el <span class="hl">5-10 %</span> de los infartos agudos de miocardio (${p(37)}); la mortalidad se acerca a la mitad.` },
      { id: 'cgf-e3', corto: 'resistencias bajas', tipo: 'test', fuente: 'mc-cs-inflamacion · mc-cs-excepciones',
        enunciado: 'Un infartado con signos de shock está febril, con leucocitosis y resistencias vasculares sistémicas bajas. Un compañero dice: «En el cardiogénico las resistencias siempre están altas; esto no es cardiogénico». ¿Qué dice Marino?',
        opciones: [
          { t: 'Tiene razón: las resistencias bajas descartan el origen cardíaco y obligan a pensar en un shock séptico o distributivo', porque: `Las resistencias pueden no estar elevadas si hay inflamación sistémica (${p(40)}). Descartarlo por eso dejaría sin tratar un fallo de bomba.` },
          { t: 'Es séptico: la fiebre y la leucocitosis no se dan en el infarto', porque: `Los signos de inflamación sistémica se han descrito en el 20-40 % de los shocks cardiogénicos por infarto (${p(41)}); fiebre y leucocitosis no bastan para descartar el origen cardíaco.` },
          { t: 'Puede seguir siendo cardiogénico: la inflamación sistémica (20-40 %) baja las resistencias por el óxido nítrico', ok: true }],
        explicacion: `Hasta en el <span class="hl-rojo">20-40 %</span> hay inflamación sistémica: menores resistencias (<span class="hl-azul">óxido nítrico</span>) y mayor mortalidad. Se ha relacionado con la disfunción microcirculatoria (${p(41)}).` + enFicha(FICHA, 'mc-cs-inflamacion') },
      { id: 'cgf-e4', corto: 'obstrucción del TSVI', tipo: 'test', fuente: 'mc-tsvi-dinamico',
        enunciado: 'Una miocardiopatía hipertrófica con shock por obstrucción dinámica del tracto de salida del VI. ¿Cómo se diagnostica y qué grupo de fármacos se usa?',
        opciones: [
          { t: 'Doppler continuo en el apical de 4 cámaras y dobutamina para subir la contractilidad y vencer la obstrucción', porque: `Los inotrópicos están contraindicados en esta forma de shock (${p(43)}); el objetivo es bajar la frecuencia y aumentar el llenado diastólico (${p(39)}). Con dobutamina aumentarías la obstrucción.` },
          { t: 'Cateterismo derecho y vasodilatadores', porque: `El diagnóstico se hace con Doppler continuo (${p(39)}) y el tratamiento busca frecuencia baja y mayor llenado. Un vasodilatador iría contra el objetivo.` },
          { t: 'Doppler continuo apical de 4 cámaras (gradiente subaórtico); un betabloqueante no vasodilatador', ok: true }],
        explicacion: `Diagnóstico con Doppler de onda continua en el apical de 4 cámaras (gradiente sistólico subaórtico). Objetivo: <span class="hl">frenar la frecuencia y aumentar el llenado diastólico</span> con betabloqueantes no vasodilatadores (metoprolol, nadolol) (${p(39)}). Inotrópicos contraindicados (${p(43)}).` + enFicha(FICHA, 'mc-tsvi-dinamico') },
      { id: 'cgf-e5', corto: 'IC 2,3', tipo: 'test', fuente: 'mc-cs-hemodinamica · mc-cs-excepciones', origen: 'ilustrativo: paciente inventado; las cifras de referencia son de la ficha',
        enunciado: 'Un infartado tiene un índice cardíaco de 2,3 L/min/m², PA 126/74, buena diuresis y lactato de 1,2. Un residente dice: «Con ese índice es un shock cardiogénico». ¿Y tú?',
        opciones: [
          { t: 'Es shock: el índice del shock es <2,5 L/min/m², que es el objetivo del tratamiento', porque: `El 2,5 es el objetivo de manejo (Tabla 16.2, ${p(42)}), no un umbral diagnóstico; el índice típico del shock es <2,2 (${p(40)}). Con ese criterio llamarías shock a quien perfunde bien.` },
          { t: 'No es shock: el índice es bajo, pero sin hipoperfusión ni lactato alto', ok: true },
          { t: 'No es nada: 2,3 es normal', porque: `El rango normal que da el libro es 2,4-4,0 (${p(40)}): 2,3 queda por debajo. Lo que no tiene este paciente es hipoperfusión, que es lo que define el shock.` }],
        explicacion: `El índice <2,2 es típico del shock, pero el shock se distingue de la insuficiencia cardíaca por la <span class="hl-rojo">hipoperfusión</span> y el lactato alto (${p(40)}). Aquí no están.` },
      { id: 'cgf-e6', corto: 'roturas tardías', tipo: 'test', fuente: 'mc-roturas-24h',
        enunciado: 'Un residente dice: «Las roturas del papilar, del septo y de la pared libre son complicaciones tardías: hasta la semana 2 no hay que pensar en ellas». ¿Qué corrige Marino?',
        opciones: [
          { t: 'Que aparecen típicamente en las primeras 24 horas del infarto', ok: true },
          { t: 'Que aparecen sobre todo entre el día 3 y el 5, no en la segunda semana', porque: `La fuente dice «dentro de las 24 horas» (${p(38)}). Con ese margen esperarías hasta el tercer día un soplo o un taponamiento que ya estaba.` },
          { t: 'Que solo aparecen en infartos del VD', porque: `Son complicaciones de infartos transmurales (${p(38)}); el infarto del VD es otro mecanismo, con menos del 5 % de los casos.` }],
        explicacion: `Las tres roturas aparecen «típicamente dentro de las <span class="hl-rojo">primeras 24 horas</span> del infarto», lo que contradice la idea tradicional de que son tardías (${p(38)}).` + enFicha(FICHA, 'mc-roturas-24h') },
    ],
    profundizar: [
      { id: 'mc-tabla-16-1', titulo: 'Tabla 16.1: otras causas del shock cardiogénico' },
      { id: 'mc-periparto', titulo: 'Miocardiopatía periparto' },
      { id: 'mc-postcardiotomia', titulo: 'Shock tras cirugía cardíaca' },
      { id: 'mc-cs-microcirculacion', titulo: 'La microcirculación en el shock cardiogénico' },
    ],
    casos: [
      { id: 'c6', titulo: 'Fermín, 70 años: yugulares llenas y pulmón limpio', corto: 'Caso · Fermín', sub: 'IAM inferior; 80 kg; el ventrículo derecho que no empuja',
        paciente: { Edad: '70 años, varón', Peso: '80 kg', Motivo: 'IAM inferior, hora 2 en hemodinámica' },
        pasos: [
          { momento: 'Hora 2', datos: { Constantes: 'PA 94/69 (PAM 82), FC 82', Exploración: 'yugulares distendidas, sin crepitantes', Diuresis: '0,3 mL/kg/h', Lactato: '1,5 mmol/L' }, nuevo: ['Constantes', 'Exploración', 'Diuresis', 'Lactato'],
            pregunta: { id: 'c6-1', tipo: 'test', fuente: 'mc-cs-hemodinamica · mc-cs-excepciones', origen: 'ilustrativo: la diuresis es del paciente; el resto sale de las cifras del caso',
              enunciado: 'La PAM es 82: no hay hipotensión. ¿Descartas el shock cardiogénico?',
              opciones: [
                { t: 'Sí: sin hipotensión no hay shock cardiogénico, porque la presión es lo que define la hipoperfusión', porque: `La hipotensión falta en cerca del 5 % de los shocks (${p(40)}), y el shock se define por la hipoperfusión, no por la presión. Dejarlo pasar te haría perder las horas en que aún se puede corregir.` },
                { t: 'No: la diuresis baja es hipoperfusión, y todavía falta medir el gasto', ok: true },
                { t: 'No: el lactato de 1,5 ya confirma el shock', porque: `El objetivo de lactato es <2 mmol/L (Tabla 16.2, ${p(42)}): 1,5 está dentro. La hipoperfusión de Fermín viene de la diuresis, no del lactato.` }],
              explicacion: `El shock se distingue por la <span class="hl-azul">hipoperfusión tisular</span> (hipotensión, diuresis disminuida) y la oxigenación inadecuada (lactato) (${p(40)}). La hipotensión falta en ~5 % de los casos. Fermín tiene diuresis baja y lactato aún normal: toca medir el gasto.` } },
          { momento: 'Hora 2 · catéter', datos: { Catéter: 'PVC 14, PCP 11, IC 2,0', Eco: 'FEVI 52 %' }, nuevo: ['Catéter', 'Eco'],
            pregunta: { id: 'c6-2', tipo: 'test', fuente: 'mc-cs-vd', modeloVivo: sv('iam-vd', '🫀 Fermín en el modelo'),
              enunciado: 'Con PVC 14, PCP 11 y FEVI 52 %, ¿qué ventrículo está fallando y qué lo dice?',
              opciones: [
                { t: 'El derecho: la PVC supera a la PCP (14/11 ≈ 1,3) y la FEVI es normal', ok: true },
                { t: 'El izquierdo: tiene la FEVI de 52 %, que ya es baja, y el IC de 2,0 es de bomba izquierda', porque: `En el fallo del VI la PCP estaría elevada; aquí es 11 y la FEVI normal. Los rasgos del fallo del VD son el cociente PVC/PCP aumentado, el VD dilatado y la FEVI normal (${p(40)}).` },
                { t: 'Los dos por igual: el IC de 2,0 es la suma de ambos fallos', porque: `Si fallaran los dos, subiría también la PCP (${p(40)}). Aquí está por debajo del objetivo de 18-20 (${p(42)}).` }],
              explicacion: `Cociente <span class="hl-rojo">PVC/PCP aumentado</span> (14/11 ≈ 1,3) y <span class="hl">FEVI normal</span>: fallo del VD (${p(40)}). El IC de 2,0 está por debajo de 2,2, el típico del shock.`,
              nota: `<b>La fuente no lo dice.</b> El libro no da un valor normal para el cociente PVC/PCP (${p(40)}); el 1,3 es la división de las cifras del paciente.` } },
          { momento: 'Hora 2 · eco', datos: { Eco: 'VD dilatado, mayor que el VI; el tabique se desplaza hacia el VI' }, nuevo: ['Eco'],
            pregunta: { id: 'c6-3', tipo: 'destapa', cuantas: 'son dos cosas', fuente: 'mc-cs-vd', modeloVivo: sv('iam-vd', '🫀 El VD dilatado y el tabique, en el modelo'),
              enunciado: 'El VI de Fermín está casi intacto y su FEVI es normal. ¿Por qué el gasto de su VI cae igual? Tu respuesta tiene dos partes.',
              puntos: [
                `El <span class="hl-azul">VD muy dilatado empuja el tabique interventricular</span> hacia la cámara del VI.`,
                `El VI se llena peor y su <span class="hl-rojo">volumen sistólico</span> baja: el gasto del corazón izquierdo se perjudica aún más.`],
              explicacion: `«La dilatación grave del VD puede empujar el septo hacia la cámara del VI, lo que reduce su llenado y perjudica aún más el gasto sistólico» (${p(40)}).` + enFicha(FICHA, 'mc-cs-vd') } },
          { momento: 'Hora 3 · nota del R1', datos: { Nota: 'plan de la hora 3' }, nuevo: ['Nota'],
            pregunta: { id: 'c6-4', tipo: 'error', fuente: 'mc-cs-vd · mc-cs-hemodinamica · mc-cs-vasopresor',
              enunciado: 'La nota del R1 sobre Fermín. Encuentra los errores.',
              frases: [
                { t: 'La PVC 14 con PCP 11 y VD dilatado apunta a fallo del VD.' },
                { t: 'Con PAM 82 el shock queda descartado.', mal: true, c: `La hipotensión <span class="hl-rojo">falta en el ~5 %</span> de los casos; el shock lo marca la hipoperfusión (${p(40)}).` },
                { t: 'Si la PAM baja de 65, norepinefrina en infusión continua, sin dosis de carga.' },
                { t: 'El fallo del VD es más mortal que el del VI.', mal: true, c: `El shock por fallo del VD <span class="hl">tiene menor mortalidad</span> que el del VI (${p(40)}).` }],
              explicacion: 'Dos errores: descartar el shock por la PAM y decir que el fallo del VD mata más.',
              nota: `<b>La fuente no lo dice.</b> El libro no da la conducta del fallo del VD (la remite al capítulo 18, ${p(40)}); este caso no la cubre. La norepinefrina y la PAM ≥65 son de ${p(42)}-43.` } },
          { momento: 'Hora 8 · el giro', datos: { Constantes: 'SpO₂ 86 %', Exploración: 'crepitantes nuevos', Catéter: 'PCP 21' }, nuevo: ['Constantes', 'Exploración', 'Catéter'],
            pregunta: { id: 'c6-5', tipo: 'test', fuente: 'mc-cs-hemodinamica · mc-cs-vd', modeloVivo: sv('cardio', '🫀 Si falla también el VI: el modelo de Aurelio'),
              enunciado: 'Seis horas después, Fermín tiene crepitantes y la PCP ha subido de 11 a 21. ¿Qué ha cambiado?',
              opciones: [
                { t: 'Falla también el VI: sube su presión de llenado y el pulmón se llena', ok: true },
                { t: 'Nada: la PCP no puede subir si el problema es del VD, así que es un error de medida', porque: `La PCP mide el llenado del VI: si sube, el VI también falla (${p(40)}). Atribuirla a un error te haría no ver el edema que ya se oye.` },
                { t: 'El fallo del VD se ha resuelto y queda una insuficiencia cardíaca sin shock', porque: `La fuente distingue el shock por la hipoperfusión, no por el ventrículo (${p(40)}); sin datos de que la perfusión haya vuelto, no puedes dar el shock por resuelto.` }],
              explicacion: `La presión de llenado sube en el ventrículo que falla (<span class="hl">PVC o PCP</span>, ${p(40)}): con la PCP en 21 y crepitantes, el VI también ha fallado. Es el patrón del fallo de bomba izquierda que viste al principio.`,
              nota: `<b>La fuente no lo dice.</b> El libro no describe la evolución del fallo del VD a biventricular; las cifras de esta hora son del paciente, no del modelo.` } },
        ],
        lleva: [
          'Con el cociente PVC/PCP aumentado y la FEVI normal, el que falla es el VD.',
          'El shock lo marca la hipoperfusión, no la tensión: la hipotensión falta en cerca del 5 %.',
          'El VD dilatado empuja el tabique hacia el VI y le quita llenado.' + enFicha(FICHA, 'mc-cs-vd')],
        volver: { nombre: 'El fallo del corazón derecho', ancla: 'mc-cs-vd', modelo: sv('iam-vd', '🫀 Fermín: PVC 14 frente a PCP 11, VI casi intacto') } },
    ],
  },
};
