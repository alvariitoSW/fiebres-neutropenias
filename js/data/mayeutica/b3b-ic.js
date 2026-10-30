// Mayéutica del bloque 3, sub-bloque 3B · Insuficiencia cardíaca aguda (Marino cap. 18, págs. 1-15): fichas 13 (tipos y consecuencias)
// y 14 (manejo), y el caso C1 (Mercedes). Datos puros; el formato está en la cabecera de b1-fluidos.js.
// Las fichas son js/modules/cardiologia/merino-cardiologia.html. Modelos vivos: shockVivo `ic-etapa-1/2/3` e `ic-cpap`
// (js/data/shock-vivo-data.js), eco `hipertrofia` y `tep`, nefrona `normal|furosemida` y glomérulo `congestion`.
// Las cifras de los modelos NO van en el texto de las preguntas (primero predices, luego compruebas); las del caso (Mercedes) son
// datos del paciente. Las cifras de Ramiro (Fig. 18.3) las da el motor: autonomo/bloques/b3/herramientas/g4-etapas-cifras.mjs.
const PDF = 'docs/marino-2024-cardiac-disorders-caps18-21.pdf';
const pag = (n, txt) => `<a class="biblio-link" href="${PDF}#page=${n}" target="_blank" rel="noopener">${txt || `PDF pág. ${n}`}</a>`;
const p = n => pag(n, `pág. ${n}`);
// «Ver en la ficha» dentro de una nota (REGLAS §7.9): el enlace cruzado de siempre al párrafo exacto.
const enFicha = (tab, id) => ` <button type="button" class="may-ir" data-especialidad="cardiologia" data-view="merinoCardiologia" data-panel="panel-merino-cardio-tabs" data-tab="${tab}" data-resaltar="#${id}">Ver en la ficha ↗</button>`;
const DED = '<i>Deducción; la fuente no lo dice.</i>';
const FG = '<i>Fisiología general.</i>';
const PDFR = 'docs/marino-2024-respiratory-management-caps22-26.pdf';
const r = n => `<a class="biblio-link" href="${PDFR}#page=${n}" target="_blank" rel="noopener">resp. pág. ${n}</a>`;
const PDFS = 'docs/marino-2024-shock-caps14-17.pdf';
const s = n => `<a class="biblio-link" href="${PDFS}#page=${n}" target="_blank" rel="noopener">shock pág. ${n}</a>`;
const T = 'mc-ic-tipos', M = 'mc-ic-manejo';
// Los modelos vivos de cada pregunta (el botón sale tras contestar).
const sv = (clave, texto) => ({ shockVivo: clave, texto });
const eco = (escenario, texto) => ({ ecoEscenario: escenario, ecoVista: 'a4c', texto });
const nefrona = (valor, texto) => ({ especialidad: 'nefrologia', view: 'nefrona', nefronaViva: valor, texto });
// «(vista Visual)»: abre Estudiar → Mira de la ficha, con la vuelta a la pregunta.
const visual = (tab, texto) => ({ especialidad: 'cardiologia', view: 'merinoCardiologia', panel: 'panel-merino-cardio-tabs', tab, enVisual: '', texto });
const glomerulo = texto => ({ especialidad: 'nefrologia', view: 'nefrona', panel: 'panel-fisio-tabs', tab: 'fisio-regulacion', glomerulo: 'congestion', texto });

export const MAYEUTICA_IC = {
  /* =================================================================================================
     Ficha 13 · IC aguda: tipos y consecuencias (cap. 18, págs. 1-8)
     ================================================================================================= */
  'mc-ic-tipos': {
    entrada: 'Qué separa la IC sistólica de la diastólica, cómo se hunde el corazón izquierdo en tres etapas, por qué el riñón sufre por la congestión y qué puede y no puede decir un BNP.',
    guia: [
      { id: 'ict-g1', corto: 'volumen o presión', tipo: 'test', fuente: 'mc-sistolica-diastolica',
        enunciado: 'Un paciente con insuficiencia cardíaca tiene alta la presión telediastólica del VI. Antes de leer la ficha: ¿esa presión te dice si el fallo es sistólico o diastólico?',
        opciones: [
          { t: 'Sí: la presión alta es de la sistólica; en la diastólica la presión telediastólica es normal', porque: `En las dos sube la presión telediastólica; lo que cambia es el volumen (${p(2)}). Fiarte de la presión te haría llamar sistólica a una IC diastólica y tratarla como tal.` },
          { t: 'No: sube en las dos; las separa el volumen telediastólico (>97 mL/m², sistólica)', ok: true },
          { t: 'Sí: por encima de 97 mmHg es diastólica, porque el ventrículo rígido necesita más presión', porque: `El 97 es un volumen (mL/m²), no una presión (${p(2)}). Un umbral de presión que no existe te daría falsas certezas.` }],
        explicacion: `El volumen telediastólico, no la presión, distingue las dos: <span class="hl-azul">>97 mL/m² es sistólica y ≤97 mL/m² es diastólica</span> (${p(2)}). Como el volumen no se mide fácil a pie de cama, se usa la fracción de eyección (${p(2)}).` },
      { id: 'ict-g2', corto: 'FE normal, VS bajo', tipo: 'test', fuente: 'mc-hfpef · mc-fe', modeloVivo: eco('hipertrofia', '🫀 Mira el VI hipertrófico y rígido'),
        enunciado: 'Predice, y luego lo compruebas: un corazón hipertrófico y rígido tiene una fracción de eyección normal. ¿Su volumen sistólico también es normal?',
        opciones: [
          { t: 'Sí: con la fracción de eyección normal, el volumen sistólico es siempre normal', porque: `La FE es una fracción del volumen telediastólico; si este es menor, el volumen sistólico es menor aunque la FE se conserve (${p(3)}). Si lo olvidas, tranquilizarás a quien tiene un gasto bajo.` },
          { t: 'Es mayor: el ventrículo rígido compensa expulsando más sangre en cada latido', porque: `Es al revés: la rigidez disminuye el llenado y el volumen telediastólico baja (${p(3)}).` },
          { t: 'No: el VI se llena menos, y la FE es una fracción de un volumen menor', ok: true }],
        explicacion: `En la disfunción diastólica baja el volumen telediastólico y, <span class="hl-rojo">aunque la FE se conserve, el volumen sistólico baja</span> porque es una fracción de un volumen menor (${p(3)}).`,
        nota: `<b>La fuente no lo dice.</b> El libro no da cifras de un corazón hipertrófico; el modelo muestra la forma de la rigidez (ilustrativo).` + enFicha(T, 'mc-hfpef') },
      { id: 'ict-g3', corto: 'causas de FE conservada', tipo: 'destapa', cuantas: 'son cuatro causas', fuente: 'mc-hfpef',
        enunciado: 'Un paciente tiene edema de pulmón y una fracción de eyección conservada: el problema es el llenado, no la fuerza. ¿Qué cuatro causas de llenado mal buscas?',
        puntos: [
          `Hipertrofia ventricular (el músculo grueso y rígido se llena peor).`,
          `<span class="hl-rojo">Isquemia miocárdica</span> (miocardio aturdido).`,
          `Miocardiopatía restrictiva (fibrosis).`,
          `<span class="hl-rojo">Taponamiento pericárdico</span>.`],
        explicacion: `Son las causas de IC con FE conservada que da la ficha (${p(3)}). Además, las presiones intratorácicas altas de la ventilación mecánica pueden dificultar el llenado y empeorarla (${p(3)}).` + enFicha(T, 'mc-hfpef') },
      { id: 'ict-g4', corto: 'yugulares planas', tipo: 'test', fuente: 'mc-ic-derecha',
        enunciado: 'En la IC derecha el VD falla y se llena de más. Predice: ¿por qué la PVC y las yugulares pueden seguir normales?',
        opciones: [
          { t: 'Porque el VD que falla deja de recibir sangre y su volumen telediastólico baja, así que no hay nada que distender', porque: `Es al revés: el mecanismo es sistólico y el volumen telediastólico del VD aumenta (${p(3)}-${p(4)}).` },
          { t: 'Porque en la IC derecha el problema es del llenado y el volumen es normal', porque: `El mecanismo principal es la disfunción sistólica (${p(3)}-${p(4)}), no diastólica.` },
          { t: 'Porque la PVC no sube hasta que el pericardio frena el aumento del volumen del VD', ok: true }],
        explicacion: `El volumen del VD aumenta, pero la PVC no sube ni hay distensión yugular hasta que ese aumento queda <span class="hl-azul">restringido por el pericardio</span> (${p(4)}). Por eso es difícil de detectar a la cabecera.` },
      { id: 'ict-g5', corto: 'el tabique y el VI', tipo: 'test', fuente: 'mc-vd-septo', modeloVivo: eco('tep', '🫀 El VD dilatado empuja el tabique (TEP)'),
        enunciado: 'Predice, y luego lo compruebas: tras una embolia, el VD está muy dilatado y aplana el tabique. ¿Qué le pasa al VI?',
        opciones: [
          { t: 'Se llena mejor, porque el tabique desplazado le deja más espacio y más tiempo para vaciarse en cada latido', porque: `El tabique desplazado reduce el tamaño de la cámara del VI y altera su llenado (${p(4)}).` },
          { t: 'Se llena peor y sube su presión telediastólica: la IC derecha da una disfunción diastólica izquierda', ok: true },
          { t: 'Nada: los dos ventrículos solo se comunican por el pulmón', porque: `La interdependencia interventricular existe: el tabique empujado perjudica al VI (${p(4)}). Si la ignoras, no explicarás un gasto que cae con el VI sano (${DED}).` }],
        explicacion: `La distensión del VD empuja el tabique hacia el VI, <span class="hl-rojo">altera su llenado y aumenta su presión telediastólica</span>: es la interdependencia interventricular (${p(4)}).`,
        nota: `<b>La fuente no lo dice.</b> El libro no da cifras de presión para este paciente; el modelo es ilustrativo.` + enFicha(T, 'mc-vd-septo') },
      { id: 'ict-g6', corto: 'PVC igual a la PCP', tipo: 'test', fuente: 'mc-vd-medidas',
        enunciado: 'Con un catéter de arteria pulmonar, la PVC es igual a la presión de enclavamiento. ¿En qué piensas y qué haces?',
        opciones: [
          { t: 'En IC derecha, sin dudas: solo ella iguala las dos presiones y con eso basta para el diagnóstico', porque: `También se igualan en el taponamiento pericárdico (${p(4)}). Si lo olvidas, dejarás sin drenar un taponamiento (${DED}).` },
          { t: 'En un error de medida: la PVC nunca debería igualar a la PCP', porque: `La igualdad es justo lo que hace pensar en IC derecha (${p(4)}); descartarla como error retrasa el diagnóstico.` },
          { t: 'En IC derecha o en taponamiento; pido una ecocardiografía para saber cuál', ok: true }],
        explicacion: `PVC ≥ PCP hace pensar en IC derecha, pero <span class="hl-rojo">también ocurre en el taponamiento</span>: se necesita ecocardiografía (${p(4)}).` + enFicha(T, 'mc-vd-medidas') },
      { id: 'ict-g7', corto: 'etapa 1', tipo: 'test', fuente: 'mc-ic-etapas', modeloVivo: sv('ic-etapa-1', '🫀 Etapa 1: mira la presión de llenado de Ramiro'),
        enunciado: 'Predice, y luego lo compruebas: en la primera etapa de la IC izquierda, ¿qué se altera primero y qué se mantiene?',
        opciones: [
          { t: 'Baja el volumen sistólico y la frecuencia sube para mantener el gasto', porque: `Eso es la segunda etapa (${p(5)}); la primera es una subida de la presión de llenado.` },
          { t: 'Sube la presión de llenado (la PCP) y se mantiene el volumen sistólico, a costa de congestión pulmonar y disnea', ok: true },
          { t: 'Cae el gasto cardíaco mientras la PCP sigue normal', porque: `Un gasto que cae es la etapa final, con la presión de llenado aún más alta (${p(5)}).` }],
        explicacion: `Primer signo: aumenta la presión telediastólica (la PCP). <span class="hl-azul">El volumen sistólico se mantiene</span>, a costa de esa presión alta, que congestiona el pulmón y da disnea (${p(5)}).`,
        nota: `<b>Nota de fidelidad.</b> La Fig. 18.3 son observaciones personales del autor en un paciente posoperatorio (${p(6)}); el modelo la reproduce de forma aproximada (ilustrativo).` + enFicha(T, 'mc-ic-etapas') },
      { id: 'ict-g8', corto: 'etapa 2', tipo: 'test', fuente: 'mc-ic-etapas', modeloVivo: sv('ic-etapa-2', '🫀 Etapa 2: el volumen sistólico cae y la frecuencia sube'),
        enunciado: 'Predice: en la segunda etapa el volumen sistólico baja. ¿Por qué el gasto cardíaco no cae todavía?',
        opciones: [
          { t: 'Porque la frecuencia sube y compensa la caída del volumen sistólico', ok: true },
          { t: 'Porque la vasoconstricción periférica sube el volumen sistólico', porque: `La vasoconstricción sostiene la presión arterial (${p(6)}); lo que sostiene el gasto en la segunda etapa es la taquicardia (${p(5)}).` },
          { t: 'Porque la presión de llenado vuelve a bajar y el corazón se descarga', porque: `La presión de llenado no baja: sube todavía más en la etapa final (${p(5)}).` }],
        explicacion: `Segunda etapa: baja el volumen sistólico y sube la frecuencia; <span class="hl-azul">la taquicardia compensa y el gasto se conserva</span> (${p(5)}).` },
      { id: 'ict-g9', corto: 'etapa 3', tipo: 'test', fuente: 'mc-ic-etapas', modeloVivo: sv('ic-etapa-3', '🫀 Etapa 3: el gasto empieza a caer'), modelo: visual(T, '🖼️ Las tres etapas en el flujo (vista Visual)'),
        enunciado: 'Predice: ¿qué marca el paso de la insuficiencia cardíaca compensada a la descompensada?',
        opciones: [
          { t: 'La aparición de la disnea, por la congestión del pulmón', porque: `La disnea aparece ya en la primera etapa, con el gasto intacto (${p(5)}).` },
          { t: 'El momento en que empieza a caer el gasto cardíaco', ok: true },
          { t: 'La taquicardia, porque el corazón ya no puede compensar', porque: `La taquicardia es la respuesta de la segunda etapa, con el gasto aún conservado (${p(5)}).` }],
        explicacion: `Última etapa: cae el gasto y la presión de llenado sube más; <span class="hl-rojo">el punto en que el gasto empieza a bajar marca el paso a descompensada</span> (${p(5)}). La vasoconstricción suele mantener la presión arterial (${p(6)}-${p(7)}). Si hay hipotensión, ya no es esta ficha: es shock cardiogénico (${p(1)}, ${p(7)}).` + enFicha(T, 'mc-ic-etapas') },
      { id: 'ict-g10', corto: 'angiotensina', tipo: 'test', fuente: 'mc-neurohumoral',
        enunciado: 'La angiotensina II contrae la arteriola eferente del glomérulo. ¿Qué consigue y cuándo se vuelve contraproducente en la IC?',
        opciones: [
          { t: 'Baja la presión de filtración para proteger el glomérulo de la hipertensión, y nunca resulta perjudicial para el paciente con IC', porque: `Contraer la eferente sube la presión de filtración y preserva el filtrado (${p(6)}).` },
          { t: 'Mantiene la presión de filtración; en la IC avanzada frena el flujo y la retención de sal y agua favorece el edema', ok: true },
          { t: 'Aumenta la diuresis y la excreción de sodio, que descarga el ventrículo', porque: `Eso lo hacen los péptidos natriuréticos (${p(5)}); la aldosterona retiene sodio y agua (${p(6)}).` }],
        explicacion: `Preserva el filtrado glomerular al subir la presión de filtración. En la IC avanzada <span class="hl-rojo">la vasoconstricción puede impedir el flujo sistémico</span> y la retención de sodio y agua favorece el edema, sobre todo pulmonar (${p(6)}).` },
      { id: 'ict-g11', corto: 'riñón y congestión', tipo: 'test', fuente: 'mc-cardiorrenal · mc-congestion', modeloVivo: glomerulo('🫘 Mira el glomérulo con la congestión venosa'),
        enunciado: 'Predice, y luego lo compruebas: una IC aguda con PAM normal y creatinina que sube. ¿Qué lo explica sobre todo, y qué tratamiento sigue?',
        opciones: [
          { t: 'La congestión venosa baja el gradiente arteriovenoso renal; se trata con diuresis', ok: true },
          { t: 'El gasto cardíaco bajo; hay que subirlo cuanto antes con volumen para restaurar el flujo renal', porque: `No hay correlación entre el gasto y la disfunción renal en la IC (${p(7)}); el volumen empeoraría la congestión (${DED}).` },
          { t: 'La autorregulación renal ha fallado, aunque la PAM sea de 85', porque: `La autorregulación mantiene el flujo renal hasta que la PAM baja de 70 (${p(7)}); con 85 aún no ha fallado (${DED}).` }],
        explicacion: `La disfunción renal se atribuye sobre todo al <span class="hl-azul">aumento de la presión venosa</span>, que reduce el gradiente arteriovenoso renal y el flujo glomerular; el gasto bajo solo cuenta con hipotensión (${p(7)}). Es el síndrome cardiorrenal, y el principal tratamiento es la diuresis (${p(7)}).`,
        nota: `<b>La fuente no lo dice.</b> El libro no da la PVC ni las cifras del glomérulo; el modelo usa una PVC de 20 mmHg y una PAM de 80 (ilustrativo).` + enFicha(T, 'mc-cardiorrenal') },
      { id: 'ict-g12', corto: 'para qué el BNP', tipo: 'test', fuente: 'mc-bnp',
        enunciado: 'Un paciente crítico con disnea. Predice: ¿para qué te sirve mejor un péptido natriurético?',
        opciones: [
          { t: 'Para confirmar la IC: cuanto más alto, más seguro', porque: `Suben por muchas causas ajenas al corazón (edad, insuficiencia renal, anemia, embolia, sepsis; Tabla 18.2, ${p(8)}). Confirmar con ellos arriesga una IC mal diagnosticada.` },
          { t: 'Para excluirla con una cifra baja: BNP <100 o NT-proBNP <300', ok: true },
          { t: 'Para excluirla con BNP <300, que es el umbral habitual', porque: `Ese 300 es del NT-proBNP, que tiene una vida media más larga y niveles 3-5 veces mayores que el BNP (${p(7)}-${p(8)}); con el BNP el umbral es 100.` }],
        explicacion: `Con <span class="hl-verde">BNP <100 o NT-proBNP <300</span> la IC es improbable; por su carácter inespecífico, sobre todo en el crítico, sirven mejor para <b>excluir</b> (${p(8)}).` + enFicha(T, 'mc-bnp') },
    ],
    examen: [
      { id: 'ict-e1', corto: 'FE de 45 %', tipo: 'test', fuente: 'mc-tabla-18-1',
        enunciado: 'Una mujer con edema agudo de pulmón tiene una fracción de eyección del VI del 45 %. ¿Cómo la clasificas?',
        opciones: [
          { t: 'IC con FE conservada: disfunción diastólica, porque el 45 % sigue siendo casi normal', porque: `La FE conservada es ≥50 % (Tabla 18.1, ${p(3)}); con 45 % ya hay disfunción sistólica leve.` },
          { t: 'IC con FE reducida: disfunción sistólica moderada o grave', porque: `La FE reducida es ≤40 % (${p(3)}); el 45 % cae en el tramo intermedio.` },
          { t: 'IC con FE ligeramente reducida (41-49 %): disfunción sistólica leve', ok: true }],
        explicacion: `Tabla 18.1: conservada ≥50 %, <span class="hl">ligeramente reducida 41-49 %</span> y reducida ≤40 % (${p(3)}).` + enFicha(T, 'mc-tabla-18-1') },
      { id: 'ict-e2', corto: 'FE de 52 %', tipo: 'test', fuente: 'mc-fe',
        enunciado: 'Un residente ve una FE de 52 % en un paciente hipertenso con edema y dice: «Está por debajo del 55 % normal: es sistólica». ¿Qué le corriges?',
        opciones: [
          { t: 'Que en la IC se acepta ≥50 % como normal: la poscarga puede bajar la FE un 5-10 %', ok: true },
          { t: 'Tiene razón: el normal es ≥55 % y cualquier valor por debajo indica disfunción sistólica', porque: `En la IC se acepta ≥50 % como normal (${p(3)}). Con su regla etiquetarías de sistólica a una IC con FE conservada.` },
          { t: 'Que la FE no depende de la poscarga, así que 52 % es normal siempre', porque: `La poscarga sí puede bajarla un 5-10 % (${p(3)}); por eso el umbral en la IC es más bajo.` }],
        explicacion: `El normal es ≥55 %, pero <span class="hl-azul">en la IC se usa ≥50 %</span> porque el aumento de la poscarga puede bajar la FE un 5-10 % (${p(3)}). Con 52 % es IC con FE conservada.` + enFicha(T, 'mc-fe') },
      { id: 'ict-e3', corto: 'creatinina y PAM 85', tipo: 'test', fuente: 'mc-cardiorrenal', origen: 'ilustrativo: paciente inventado; la regla, de la ficha',
        enunciado: 'Una IC aguda con PAM 85 y creatinina en ascenso. Un compañero dice: «El gasto está bajo, por eso falla el riñón». ¿Qué dice Marino?',
        opciones: [
          { t: 'No hay correlación entre el gasto y la disfunción renal; con PAM >70 el flujo renal está autorregulado y el culpable es la presión venosa', ok: true },
          { t: 'Tiene razón: con la autorregulación renal perdida por debajo de PAM 90, el gasto bajo explica el fallo renal', porque: `La autorregulación mantiene el flujo hasta una PAM de 70, no de 90 (${p(7)}).` },
          { t: 'El gasto bajo explica el fallo renal siempre; la presión venosa solo lo agrava', porque: `El gasto bajo solo cuenta en el paciente con hipotensión, es decir, en el shock cardiogénico (${p(7)}).` }],
        explicacion: `<span class="hl-azul">Sin correlación gasto-función renal</span> y flujo autorregulado hasta una PAM <70 (${p(7)}): lo principal es el aumento de la presión venosa, que baja el gradiente arteriovenoso renal.`,
        nota: `<b>La fuente no lo dice.</b> El libro no da la PVC de este paciente inventado; no la deduzcas del glomérulo vivo, que usa una PVC propia de 20 mmHg (ilustrativo).` + enFicha(T, 'mc-cardiorrenal') },
      { id: 'ict-e4', corto: 'NT-proBNP 250', tipo: 'test', fuente: 'mc-bnp',
        enunciado: 'Un paciente con disnea y sospecha de IC tiene un NT-proBNP de 250 pg/mL. ¿Qué dice Marino?',
        opciones: [
          { t: 'IC improbable: está por debajo de 300; recuerda que sirve mejor para excluir', ok: true },
          { t: 'Compatible con IC: supera 100 pg/mL, el umbral habitual de los péptidos natriuréticos', porque: `El 100 es el umbral del BNP; el NT-proBNP tiene una vida media más larga y sus niveles son 3-5 veces mayores (${p(7)}). Con esa confusión solicitarías estudios de una IC que es improbable (${DED}).` },
          { t: 'No sirve: el NT-proBNP es la fracción inactiva y no tiene valor diagnóstico', porque: `Es metabólicamente inactiva, pero se usa igual: <300 pg/mL hace improbable la IC (${p(7)}-${p(8)}).` }],
        explicacion: `<span class="hl-verde">NT-proBNP <300 pg/mL</span> (y BNP <100) hacen improbable la IC (${p(8)}). El NT-proBNP queda 3-5 veces por encima del BNP por su vida media más larga (${p(7)}).` + enFicha(T, 'mc-bnp') },
      { id: 'ict-e5', corto: 'BNP 900 con sepsis', tipo: 'test', fuente: 'mc-bnp · mc-tabla-18-2', origen: 'ilustrativo: paciente inventado; las causas, de la Tabla 18.2',
        enunciado: 'Un paciente con sepsis, insuficiencia renal y disnea tiene un BNP de 900 pg/mL. ¿Cómo lo interpretas?',
        opciones: [
          { t: 'IC confirmada: es una cifra muy superior a 100 pg/mL', porque: `Las causas no cardíacas de BNP alto incluyen la sepsis, la insuficiencia renal y la edad (Tabla 18.2, ${p(8)}). Con esa lectura darías diurético a un séptico sin comprobar la IC (${DED}).` },
          { t: 'No la confirma: la sepsis y la insuficiencia renal lo elevan; el valor serviría más para excluirla', ok: true },
          { t: 'Es IC derecha: solo el VD libera el péptido en esas cifras', porque: `Se libera de los dos ventrículos por el aumento de la tensión de pared (${p(7)}).` }],
        explicacion: `Tabla 18.2: la sepsis, la insuficiencia renal, la edad o la embolia elevan los péptidos. <span class="hl-rojo">Un valor alto no confirma la IC</span>; el péptido sirve mejor para excluirla (${p(8)}).` + enFicha(T, 'mc-tabla-18-2') },
      { id: 'ict-e6', corto: 'la radiografía', tipo: 'test', fuente: 'mc-fig-18-4',
        enunciado: 'Radiografía portátil de un paciente con disnea: infiltrados que salen de los hilios en los dos pulmones y derrame pleural. ¿A qué orienta?',
        opciones: [
          { t: 'Edema no cardiogénico: ese patrón hiliar lo distingue del cardiogénico', porque: `Es justo al revés: la irradiación desde los hilios distingue el cardiogénico (Fig. 18.4, ${p(8)}).` },
          { t: 'Edema pulmonar cardiogénico: el patrón hiliar es el clásico; los derrames son frecuentes', ok: true },
          { t: 'A nada: la radiografía es normal en toda IC aguda', porque: `Puede mostrar cambios mínimos o edema (${p(7)}); aquí muestra el clásico.` }],
        explicacion: `Edema cardiogénico clásico: <span class="hl">infiltrados que irradian desde los hilios</span> en ambos lados, rasgo que lo distingue del no cardiogénico, y derrames pleurales habituales (${p(7)}-${p(8)}).` + enFicha(T, 'mc-fig-18-4') },
      { id: 'ict-e7', corto: 'ventilación y FE conservada', tipo: 'test', fuente: 'mc-hfpef', origen: 'ilustrativo: paciente inventado; el mecanismo, de la ficha',
        enunciado: 'Un paciente con hipertrofia del VI y FE conservada, ventilado con presiones intratorácicas altas, empeora hemodinámicamente. ¿Qué mecanismo recoge Marino?',
        opciones: [
          { t: 'La presión positiva sube la poscarga del VI', porque: `La presión intratorácica positiva baja la poscarga del VI (${p(14)}).` },
          { t: 'La presión intratorácica alta dificulta el llenado ventricular y agrava la IC con FE conservada', ok: true },
          { t: 'Baja la FE por daño del miocardio', porque: `La FE se conserva en este tipo de IC; lo que falla es el llenado (${p(3)}).` }],
        explicacion: `Las <span class="hl-rojo">presiones intratorácicas altas</span> de la ventilación mecánica pueden dificultar el llenado y agravar la IC con FE conservada (${p(3)}).`,
        nota: `Esa misma presión, en el VI insuficiente, baja la poscarga y sube el volumen sistólico (${p(14)}). Según la función cardiaca: el corazón normal está en la parte empinada de la curva de precarga y pierde gasto al restarse llenado; el insuficiente, en la parte plana de la precarga y empinada de la poscarga, gana con la menor poscarga mientras no se frene el retorno al corazón derecho (${r(85)}, ${r(88)}). <b>La fuente no lo dice:</b> el paciente concreto con FE conservada e hipertrofia.` + enFicha(T, 'mc-hfpef') },
    ],
    profundizar: [
      { id: 'mc-fig-18-1', titulo: 'Figura 18.1: curvas de función y de distensibilidad' },
      { id: 'mc-tabla-18-2', titulo: 'Tabla 18.2: causas de péptidos natriuréticos elevados' },
    ],
    casos: [
      { id: 'c-ic2', titulo: 'Ramiro, 68 años: las tres etapas del posoperatorio', corto: 'Caso · Ramiro', sub: 'posoperatorio; 74 kg; el gasto que se aguanta y luego cae',
        paciente: { Edad: '68 años, varón', Peso: '74 kg', Motivo: 'posoperatorio, IC izquierda que se descompensa', Seguimiento: 'una medida por hora, con catéter de arteria pulmonar' },
        pasos: [
          { momento: 'Hora 1', datos: { 'PCP': '18,6 mmHg', FC: '83', 'Índice cardíaco': '3,19 L/min/m²', PAM: '81 mmHg', Síntoma: 'disnea al incorporarse' }, nuevo: ['PCP', 'FC', 'Índice cardíaco', 'PAM', 'Síntoma'],
            pregunta: { id: 'cir-1', tipo: 'test', fuente: 'mc-ic-etapas', origen: 'ilustrativo: las cifras de Ramiro son las del modelo; la secuencia de etapas, de la ficha', modeloVivo: sv('ic-etapa-1', '🫀 Ramiro en la primera etapa'),
              enunciado: 'Ramiro nota disnea; su PCP ha subido, la FC es normal y el gasto está bien. ¿Qué es lo primero que ha cambiado en su corazón y por qué le falta el aire?',
              opciones: [
                { t: 'El gasto cardíaco: ha empezado a caer y por eso le falta el aire al incorporarse', porque: `El gasto es lo último que cae, en la tercera etapa (${p(5)}); su índice de 3,19 está conservado.` },
                { t: 'La presión de llenado: sube, congestiona el pulmón y da la disnea', ok: true },
                { t: 'La frecuencia: la taquicardia compensatoria es el primer signo', porque: `La taquicardia llega en la segunda etapa (${p(5)}); su FC de 83 aún no lo es.` }],
              explicacion: `La primera señal es un <span class="hl-azul">aumento de la presión de llenado</span> (la PCP) con el gasto conservado; la congestión del pulmón produce la sensación de disnea (${p(5)}).`,
              nota: `<b>La fuente no lo dice.</b> El libro no da la PCP de cada etapa; las cifras son las del modelo (ilustrativo) y se parecen a la Fig. 18.3 (${p(6)}), no son idénticas.` + enFicha(T, 'mc-ic-etapas') } },
          { momento: 'Hora 2', datos: { 'PCP': '21,7 mmHg', FC: '91', VS: '62 mL', 'Índice cardíaco': '3,06 L/min/m²', PAM: '77 mmHg' }, nuevo: ['PCP', 'FC', 'VS', 'Índice cardíaco', 'PAM'],
            pregunta: { id: 'cir-2', tipo: 'destapa', cuantas: 'son dos cosas', fuente: 'mc-ic-etapas', modeloVivo: sv('ic-etapa-2', '🫀 Ramiro en la segunda etapa'),
              enunciado: 'Una hora después, el volumen sistólico de Ramiro ha caído y su índice casi no. ¿Cómo se explica y a qué precio? Tu respuesta tiene dos partes.',
              puntos: [
                `La <span class="hl-azul">taquicardia compensa</span> el volumen sistólico más bajo, y el gasto se conserva.`,
                `El precio es la <span class="hl-rojo">presión de llenado alta</span>, que sigue congestionando el pulmón.`],
              explicacion: `Segunda etapa: baja el volumen sistólico y sube la frecuencia; la taquicardia compensa y el gasto se conserva (${p(5)}). La presión de llenado sigue siendo la de la congestión pulmonar (${p(5)}).` + enFicha(T, 'mc-ic-etapas') } },
          { momento: 'Hora 4 · el giro', datos: { 'PCP': '30,8 mmHg', FC: '102', VS: '34 mL', 'Índice cardíaco': '1,87 L/min/m²', PAM: '72 mmHg' }, nuevo: ['PCP', 'FC', 'VS', 'Índice cardíaco', 'PAM'],
            pregunta: { id: 'cir-3', tipo: 'test', fuente: 'mc-ic-etapas · mc-congestion', modeloVivo: sv('ic-etapa-3', '🫀 Ramiro en la tercera etapa'), origen: 'ilustrativo: cifras del modelo; la lectura, de la ficha',
              enunciado: 'Ahora el índice cardíaco de Ramiro es 1,87 y la PCP 30,8, pero su PAM sigue en 72. ¿Qué ha pasado y por qué la presión se mantiene?',
              opciones: [
                { t: 'Sigue compensado: con una PAM de 72 el gasto bajo no importa mientras no haya hipotensión franca', porque: `El punto en que el gasto empieza a caer marca el paso a descompensada (${p(5)}); la presión conservada no lo anula.` },
                { t: 'Ya es descompensada: cayó el gasto, y la vasoconstricción periférica sostiene la presión', ok: true },
                { t: 'Es un shock cardiogénico: toda caída del índice por debajo de 2 lo es', porque: `El shock cardiogénico se distingue de la IC por la hipoperfusión (hipotensión, poca diuresis, lactato alto), con un índice típicamente <2,2 (${s(40)}); el capítulo de IC trata la IC sin ellos (${p(9)}) y aquí la vasoconstricción mantiene la presión (${p(6)}-${p(7)}). El índice solo no basta.` }],
              explicacion: `El gasto ha empezado a caer: <span class="hl-rojo">IC descompensada</span> (${p(5)}). La vasoconstricción periférica suele bastar para mantener la presión y la perfusión, por eso predomina la congestión venosa (${p(6)}-${p(7)}).`,
              nota: `Marino da el índice del shock cardiogénico como «típicamente <2,2 L/min/m²» (${s(40)}), el mismo corte del modelo, pero no lo usa para separar la IC descompensada del shock: lo separa la hipoperfusión (${s(40)}, ${p(9)}). <b>La fuente no lo dice:</b> una cifra de índice que separe una de otro sin hipoperfusión.` + enFicha(T, 'mc-congestion') } },
          { momento: 'Hora 5 · analítica', datos: { Creatinina: '1,0 → 1,6 mg/dL', BNP: '480 pg/mL' }, nuevo: ['Creatinina', 'BNP'],
            pregunta: { id: 'cir-4', tipo: 'test', fuente: 'mc-cardiorrenal', modeloVivo: glomerulo('🫘 El glomérulo con la congestión venosa'), origen: 'ilustrativo: creatinina y BNP son del paciente, la PAM del modelo; la regla, de la ficha',
              enunciado: 'La creatinina de Ramiro sube de 1,0 a 1,6 con una PAM de 72. Un compañero dice: «Es por el gasto bajo; démosle volumen». ¿Qué le contestas?',
              opciones: [
                { t: 'Tiene razón: con una PAM de 72 la autorregulación renal ya no mantiene el flujo y el riñón depende del gasto cardíaco', porque: `La autorregulación mantiene el flujo hasta que la PAM baja de 70 (${p(7)}); 72 aún la tiene.` },
                { t: 'Que el gasto no se correlaciona con la disfunción renal: lo más probable es la presión venosa; se trata con diuresis', ok: true },
                { t: 'Que el volumen es lo correcto: el riñón responde siempre al gasto cardíaco', porque: `No hay correlación entre el gasto y la disfunción renal en la IC (${p(7)}); darle volumen a un pulmón congestionado empeora la congestión (${DED}).` }],
              explicacion: `No hay correlación entre el gasto y la disfunción renal, y el flujo se autorregula hasta una PAM <70: lo principal es la <span class="hl-azul">presión venosa alta</span>, que reduce el gradiente arteriovenoso renal. Es el síndrome cardiorrenal y su principal tratamiento es la diuresis (${p(7)}).`,
              nota: `<b>La fuente no lo dice.</b> El libro no da la PVC de este paciente; el glomérulo vivo es un modelo aparte, con una PVC de 20 mmHg (ilustrativo) para enseñar el efecto de una congestión marcada; no es la PVC que marca el monitor de Ramiro.` + enFicha(T, 'mc-cardiorrenal') } },
          { momento: 'Hora 6 · nota del R1', datos: { Nota: 'resumen de la evolución' }, nuevo: ['Nota'],
            pregunta: { id: 'cir-5', tipo: 'error', fuente: 'mc-ic-etapas · mc-bnp',
              enunciado: 'La nota del R1 sobre Ramiro. Hay dos errores. Encuéntralos.',
              frases: [
                { t: 'La disnea de la hora 1 fue el primer signo: la PCP sube antes de que caiga el gasto.' },
                { t: 'Con la PAM en 72 no hay IC descompensada, porque no hay hipotensión.', mal: true, c: `La IC <span class="hl-rojo">descompensada empieza cuando cae el gasto</span>; la vasoconstricción mantiene la presión (${p(5)}-${p(7)}).` },
                { t: 'En la hora 2 el gasto aún se conserva gracias a la taquicardia.' },
                { t: 'El BNP de 480 pg/mL basta por sí solo para confirmar la IC.', mal: true, c: `Los péptidos natriuréticos suben por muchas causas y sirven <span class="hl-azul">mejor para excluir</span> la IC que para confirmarla (${p(8)}).` }],
              explicacion: 'Dos errores: decir que sin hipotensión no hay IC descompensada y confirmar la IC solo con el BNP.',
              nota: `<b>La fuente no lo dice.</b> Marino no da qué BNP corresponde a cada etapa; el 480 es del paciente.` } },
        ],
        lleva: [
          'La IC izquierda tiene tres etapas: sube la presión de llenado, baja el volumen sistólico y sube la FC, y por fin cae el gasto.' + enFicha(T, 'mc-ic-etapas'),
          'La IC descompensada empieza cuando cae el gasto, no cuando cae la presión: la vasoconstricción la sostiene.',
          'La insuficiencia renal de la IC depende sobre todo de la presión venosa alta, no del gasto bajo.'],
        volver: { nombre: 'Las etapas de la IC izquierda', ancla: 'mc-ic-etapas', modelo: sv('ic-etapa-3', '🫀 Ramiro en la tercera etapa') } },
    ],
  },

  /* =================================================================================================
     Ficha 14 · IC aguda: manejo (cap. 18, págs. 9-15) y el caso C1 (Mercedes)
     ================================================================================================= */
  'mc-ic-manejo': {
    entrada: 'Qué se da primero según la tensión, cómo se maneja la nitroglicerina y la furosemida, qué hace la CPAP en el corazón y por qué el diurético, con la FE conservada, quita el llenado que el VI necesita.',
    guia: [
      { id: 'icm-g1', corto: 'PA alta: primero', tipo: 'test', fuente: 'mc-ic-pa-alta', modelo: visual(M, '🖼️ El manejo según la PA (vista Visual)'),
        enunciado: 'Un paciente con edema agudo de pulmón llega con PA 190/105. Antes de leer la ficha: ¿qué fármaco va primero, y qué le hace al corazón?',
        opciones: [
          { t: 'Un vasodilatador, que baja la precarga y la poscarga: menos congestión pulmonar y más gasto', ok: true },
          { t: 'Un diurético IV, porque el problema es el exceso de volumen en el pulmón y hay que sacarlo cuanto antes', porque: `Con la PA alta se empieza por un vasodilatador (${p(9)}); la furosemida IV produce una respuesta vasoconstrictora aguda y se retrasa hasta controlar la presión (${p(10)}).` },
          { t: 'Un vasodilatador arterial puro, para bajar la poscarga sin tocar el retorno venoso', porque: `Los de la Tabla 18.3 dilatan arterias y venas: bajan precarga y poscarga a la vez (${p(9)}). La precarga es la que descongestiona el pulmón.` }],
        explicacion: `Con hipertensión se empieza con la infusión de un vasodilatador (Tabla 18.3) que dilata arterias y venas: <span class="hl-azul">menos precarga (menos congestión pulmonar) y menos poscarga (más gasto)</span>, y baja la presión hidrostática del capilar pulmonar (${p(9)}).` + enFicha(M, 'mc-ic-pa-alta') },
      { id: 'icm-g2', corto: 'NTG: pauta y bolsa', tipo: 'test', fuente: 'mc-nitroglicerina · mc-tabla-18-3',
        enunciado: 'Vas a preparar la nitroglicerina. ¿Cómo se sube la dosis y en qué material va?',
        opciones: [
          { t: 'Empezar con 5 µg/min y subir 5 µg/min cada 5 min hasta el efecto; en vidrio y tubos de polietileno', ok: true },
          { t: 'Empezar con 5 µg/min y subir 5 cada 5 min, en las bolsas y tubos habituales de PVC, que es lo que hay en planta', porque: `Hasta el 80 % de la nitroglicerina se adsorbe en el PVC (${p(9)}); el paciente recibiría una fracción de la dosis pautada.` },
          { t: 'Empezar con 50 µg/min en bolo para ganar tiempo, en vidrio', porque: `La pauta es 5 µg/min con aumentos de 5 µg/min cada 5 min (${p(9)}); el libro no recomienda un arranque así de alto; en un paciente sin hipertensión arriesgaría hipotensión (${DED}).` }],
        explicacion: `Inicio a 5 µg/min y +5 µg/min cada 5 min (eficaz casi siempre entre 5 y 100 µg/min; por encima de 200 no se aconseja). <span class="hl-rojo">Hasta el 80 % se pierde en el PVC</span>: botellas de vidrio y tubos de polietileno (${p(9)}).` + enFicha(M, 'mc-nitroglicerina') },
      { id: 'icm-g3', corto: 'NTG más de 24 h', tipo: 'destapa', cuantas: 'son tres cosas', fuente: 'mc-nitroglicerina',
        enunciado: 'Un compañero deja la nitroglicerina 30 horas con el mismo ritmo porque «el paciente va bien». ¿Qué le dices? Son tres cosas.',
        puntos: [
          `Tras 24 h hay <span class="hl-rojo">taquifilaxia</span>: el fármaco pierde efecto, y no debe seguir más tiempo.`,
          `Una infusión prolongada arriesga <span class="hl-rojo">toxicidad por propilenglicol</span> (acidosis láctica, delirio, hipotensión, fallo multiorgánico).`,
          `Dosis muy altas dan metahemoglobinemia, aunque con dosis terapéuticas casi nunca ocurre.`],
        explicacion: `Taquifilaxia después de 24 h y propilenglicol del disolvente en las infusiones prolongadas (${p(9)}-${p(10)}). La metahemoglobinemia, por nitrito, solo con dosis muy altas (${p(10)}).` + enFicha(M, 'mc-nitroglicerina') },
      { id: 'icm-g4', corto: 'nitroprusiato: cuándo no', tipo: 'test', fuente: 'mc-nitroprusiato',
        enunciado: 'El 20 % de las IC agudas no responde a la nitroglicerina y el nitroprusiato es la alternativa. ¿En qué pacientes lo evitas, y por qué?',
        opciones: [
          { t: 'Solo en la insuficiencia renal: el hígado y la isquemia no importan, porque el cianuro se elimina por el riñón', porque: `El cianuro lo eliminan el hígado y el riñón, y en la cardiopatía isquémica puede haber robo coronario (${p(10)}).` },
          { t: 'En ninguno, si se añade tiosulfato a la bolsa para fijar el cianuro', porque: `El tiosulfato reduce el riesgo de cianuro, pero no se recomienda en la insuficiencia renal o hepática ni en la cardiopatía isquémica (${p(9)}-${p(10)}).` },
          { t: 'En la insuficiencia renal o hepática (cianuro) y en la cardiopatía isquémica (robo coronario)', ok: true }],
        explicacion: `El nitroprusiato libera <span class="hl-rojo">cianuro</span> (lo aclaran hígado y riñón) y puede producir <span class="hl-rojo">robo coronario</span> al desviar sangre de las zonas isquémicas (${p(10)}). El tiosulfato disminuye el riesgo de cianuro.` + enFicha(M, 'mc-nitroprusiato') },
      { id: 'icm-g5', corto: 'cuándo el diurético', tipo: 'test', fuente: 'mc-ic-pa-alta · mc-diureticos-preocupaciones', origen: 'ilustrativo: paciente inventado; el criterio, de la ficha',
        enunciado: 'Un paciente con edema hipertensivo ya tiene la PA normalizada con nitroglicerina; el catéter de arteria pulmonar marca una PCP de 24. ¿Qué haces ahora?',
        opciones: [
          { t: 'Seguir subiendo la nitroglicerina hasta 250 µg/min para bajar la PCP, sin esperar a añadir otro fármaco', porque: `Con la PA ya normal, más vasodilatador bajaría la presión arterial; no se aconsejan dosis por encima de 200 µg/min (${p(9)}).` },
          { t: 'Añadir un diurético IV: la PCP sigue por encima de 20 con la presión controlada', ok: true },
          { t: 'Intentar bajar la PCP a cifras normales (por debajo de 12) con más diurético', porque: `La PCP deseable es la más alta que aumenta el gasto sin edema, de 18 a 20 mmHg (${p(10)}); bajarla de más resta llenado (${DED}).` }],
        explicacion: `El diurético IV se considera <span class="hl-azul">solo cuando el vasodilatador ha normalizado la presión</span> y persiste la congestión. Con catéter, se añade si la PCP sigue sobre 20 mmHg; el objetivo es la más alta que aumente el gasto sin dar edema, de 18 a 20 (${p(10)}).` + enFicha(M, 'mc-ic-pa-alta') },
      { id: 'icm-g6', corto: 'PA normal', tipo: 'test', fuente: 'mc-ic-pa-normal', origen: 'ilustrativo: paciente inventado; el criterio, de la ficha',
        enunciado: 'IC aguda con PA 125/75 y sin signos de mala perfusión periférica. ¿Qué fármaco y cuándo?',
        opciones: [
          { t: 'Nitroglicerina en infusión: es siempre el primer fármaco de la IC aguda', porque: `Con PA normal la nitroglicerina se considera solo si hay menos flujo periférico (p. ej. un gap de PCO₂ aumentado) (${p(10)}).` },
          { t: 'Un diurético IV (furosemida), idealmente dentro de la primera hora desde la llegada', ok: true },
          { t: 'Esperar unas horas a ver cómo evoluciona: el diurético precoz no cambia el pronóstico', porque: `El diurético en la primera hora se asocia a mejores resultados (${p(10)}).` }],
        explicacion: `Con PA normal: <span class="hl-azul">diurético IV</span> (casi siempre furosemida); su administración en la primera hora se asocia a mejores resultados. La nitroglicerina queda para cuando hay evidencia de menos flujo periférico (${p(10)}).` + enFicha(M, 'mc-ic-pa-normal') },
      { id: 'icm-g7', corto: 'furosemida y gasto', tipo: 'test', fuente: 'mc-diureticos-preocupaciones', modeloVivo: nefrona('normal|furosemida', '💊 La furosemida en la nefrona: dónde actúa'),
        enunciado: 'Predice: en la IC aguda, ¿qué le hace la furosemida IV al gasto cardíaco?',
        opciones: [
          { t: 'Lo baja: menos retorno venoso y más poscarga por una vasoconstricción aguda', ok: true },
          { t: 'Lo sube: al quitar volumen, el corazón trabaja con menos carga y bombea más sangre por minuto', porque: `El gasto baja, por menor retorno venoso y por mayor poscarga (${p(10)}-${p(11)}).` },
          { t: 'No lo cambia: la furosemida actúa solo en el asa de Henle', porque: `Bloquea el sodio en el asa ascendente (${p(11)}), pero además estimula la renina y la angiotensina II, un vasoconstrictor (${p(10)}).` }],
        explicacion: `La furosemida IV produce una <span class="hl-rojo">respuesta vasoconstrictora aguda</span> (renina, angiotensina II) y, con la diuresis, baja el retorno venoso: el gasto cae (${p(10)}-${p(11)}). Por eso se retrasa hasta controlar la PA con el vasodilatador.`,
        nota: `<b>La fuente no lo dice.</b> El modelo de la nefrona enseña dónde actúa la furosemida en el túbulo, no el efecto sobre el gasto.` + enFicha(M, 'mc-diureticos-preocupaciones') },
      { id: 'icm-g8', corto: 'doblar la dosis', tipo: 'test', fuente: 'mc-furosemida · mc-tabla-18-4', origen: 'ilustrativo: paciente inventado; la pauta, de la Tabla 18.4',
        enunciado: 'Un paciente sin furosemida previa y con función renal normal recibe la dosis inicial. A las 2 horas ha orinado 600 mL. ¿Qué dosis dio al principio y qué haces?',
        opciones: [
          { t: 'Mantener 40 mg y repetirlos: la diuresis de 600 mL es suficiente', porque: `La respuesta satisfactoria es de al menos 1 L a las 2 h (${p(12)}); con 600 mL hay que subir.` },
          { t: 'Dio 40 mg; como orinó menos de 1 L, dobla a 80 mg y sigue así hasta 200 mg', ok: true },
          { t: 'Dio 40 mg; pasa directamente a 200 mg, que es la dosis máxima', porque: `Se dobla la dosis cada vez hasta una respuesta satisfactoria o 200 mg (${p(12)}).` }],
        explicacion: `Si el paciente no tomaba furosemida, empieza con 40 mg si la función renal es normal (60-80 mg si hay insuficiencia renal). <span class="hl-rojo">Si a las 2 h la diuresis es <1 L, se dobla la dosis</span> hasta lograr respuesta o llegar a 200 mg; sin respuesta a 200 mg hay resistencia (${p(11)}-${p(12)}).` + enFicha(M, 'mc-furosemida') },
      { id: 'icm-g9', corto: 'infusión continua', tipo: 'test', fuente: 'mc-infusion-continua', origen: 'ilustrativo: paciente inventado; la pauta, de la ficha',
        enunciado: 'Un paciente masivamente sobrecargado recibe un bolo de 80 mg de furosemida y se inicia una infusión continua. Su filtrado estimado es 28 mL/min/1,73 m². ¿A qué velocidad empiezas?',
        opciones: [
          { t: '20 mg/h: es la velocidad de inicio con filtrado <30', ok: true },
          { t: '5 mg/h, la velocidad de inicio estándar', porque: `Los 5 mg/h son para el filtrado ≥30 (${p(12)}); con 28 te quedarías corto.` },
          { t: '40 mg/h, el máximo, para ir más rápido', porque: `El máximo de 40 mg/h se alcanza tras un segundo bolo si no hay respuesta (${p(12)}), no al inicio.` }],
        explicacion: `Bolo de 80 mg y, con filtrado ≥30, infusión de 5 mg/h (sube a 10 mg/h tras un segundo bolo si la diuresis es <100 mL/h; máximo 40 mg/h). <span class="hl-azul">Con filtrado <30: 20 mg/h</span> (y 40 mg/h tras un segundo bolo) (${p(12)}).` + enFicha(M, 'mc-infusion-continua') },
      { id: 'icm-g10', corto: 'la CPAP y el VS', tipo: 'test', fuente: 'mc-vpp', modeloVivo: sv('ic-cpap', '🫀 Etapa 3 con CPAP: mira cómo se sostiene el gasto y baja el edema'),
        enunciado: 'Predice, y luego lo compruebas: en un edema agudo de pulmón por IC izquierda, ¿qué dice Marino que hace la CPAP con el volumen sistólico del VI?',
        opciones: [
          { t: 'Lo baja: la presión positiva comprime el corazón y reduce su llenado en cada latido', porque: `El efecto que recoge el libro en la IC izquierda es el contrario: baja la poscarga y sube el gasto (${p(14)}). Que dificulte el llenado se menciona solo para la IC con FE conservada en ventilación mecánica (${p(3)}).` },
          { t: 'No lo cambia: solo mejora la oxigenación, no la hemodinámica', porque: `Se ha demostrado que la CPAP aumenta el gasto cardíaco en la IC izquierda (${p(14)}).` },
          { t: 'Lo aumenta: baja la presión transmural del VI y, con ella, su poscarga', ok: true }],
        explicacion: `La presión intratorácica positiva <span class="hl-azul">reduce la presión transmural que desarrolla el ventrículo en sístole</span> (menor poscarga): la pared se mueve hacia dentro más fácil y el volumen sistólico aumenta. La CPAP sube el gasto y acelera la mejoría del edema cardiogénico (${p(14)}).`,
        nota: `Marino da la presión de la CPAP como «usualmente 5-10 cm H₂O» (${r(77)}), y en el edema cardiogénico CPAP y VNI son igual de eficaces porque el gasto sube por la menor poscarga (${r(83)}). <b>La fuente no lo dice:</b> el efecto de la CPAP sobre la PCP no lo cuantifica; el tope del modelo es ilustrativo. <b>Límite del modelo:</b> en Ramiro (etapa 3) el modelo no sube el volumen sistólico: con CPAP 10 se sostiene (≈34 → 33 mL) y el edema baja. Marino (resp. p. 83, 88) y Bradley 1992 (PMID 1736745: +22 % de VS indexado con CPAP 5 y PCP ≥12) describen que el gasto puede subir; el modelo no lo reproduce porque no tiene la retirada simpática ni el alivio del trabajo respiratorio. En el paciente seco ocurre lo contrario: la CPAP le quita gasto (resp. p. 85, 88).` + enFicha(M, 'mc-vpp') },
      { id: 'icm-g11', corto: 'cuándo los fármacos de fondo', tipo: 'test', fuente: 'mc-largo-plazo',
        enunciado: 'Un paciente ingresado por IC aguda va a recibir tratamientos que mejoran el pronóstico a largo plazo. ¿Cuándo se empiezan?',
        opciones: [
          { t: 'Cuanto antes, en la primera hora, junto al vasodilatador', porque: `Se inician tras resolverse el episodio agudo y con el paciente estable (${p(13)}); empezarlos antes arriesga hipotensión y peor perfusión.` },
          { t: 'Tras el episodio agudo, ya estable y sin hipotensión ni mala perfusión', ok: true },
          { t: 'Solo si la FE es reducida: en la FE conservada no se usan nunca ni se ha probado ninguno', porque: `Son populares también en la IC con FE conservada, si se toleran (${p(13)}); el principal beneficio es en la FE reducida.` }],
        explicacion: `Son orales y se inician (o continúan) <span class="hl-azul">tras el episodio agudo, con el paciente estable</span>. No se aconsejan con hipotensión o mala perfusión; el beneficio principal es en la FE reducida, pero también se usan con FE conservada (${p(13)}).` + enFicha(M, 'mc-largo-plazo') },
      { id: 'icm-g12', corto: 'tres cautelas', tipo: 'destapa', cuantas: 'son tres razones', fuente: 'mc-ic-final',
        enunciado: 'El adjunto te dice: «No te pases con el diurético». ¿Qué tres razones da Marino?',
        puntos: [
          `El edema agudo <span class="hl-rojo">no siempre es sobrecarga de volumen</span>: puede ser un miocardio rígido por isquemia («flash»).`,
          `La furosemida IV <span class="hl-rojo">baja el gasto</span>: sube la poscarga (vasoconstricción) y baja la precarga (diuresis).`,
          `Con la FE conservada (el 50 % de los casos) el llenado es crítico y el efecto sobre el gasto se magnifica.`],
        explicacion: `Las tres están en el mismo apartado (${p(15)}). Marino añade que el manejo con diuréticos mejora los resultados solo cuando la dosis es limitada (${p(15)}).` + enFicha(M, 'mc-ic-final') },
    ],
    examen: [
      { id: 'icm-e1', corto: 'dosis de NTG', tipo: 'test', fuente: 'mc-tabla-18-3',
        enunciado: 'Nitroglicerina en la IC aguda hipertensiva. ¿Qué pauta y qué límite recoge Marino?',
        opciones: [
          { t: 'Inicio de 5 µg/min, +5 µg/min cada 15 min; se puede llegar hasta 400 µg/min si hace falta', porque: `Los aumentos son cada 5 min y por encima de 200 µg/min no se aconseja (${p(9)}).` },
          { t: 'Inicio de 5 µg/min, +10 µg/min cada 5 min; el máximo es 100', porque: `Los aumentos son de 5 µg/min; la dosis eficaz suele ser 5-100, pero el límite aconsejado es 200 (${p(9)}).` },
          { t: 'Inicio de 5 µg/min, +5 cada 5 min; eficaz 5-100 µg/min; por encima de 200, no', ok: true }],
        explicacion: `Tabla 18.3: <span class="hl">5 µg/min, +5 cada 5 min; efectiva 5-100 µg/min en la mayoría; no se aconsejan dosis >200</span> (${p(9)}).` + enFicha(M, 'mc-tabla-18-3') },
      { id: 'icm-e2', corto: 'dosis de nitroprusiato', tipo: 'test', fuente: 'mc-tabla-18-3',
        enunciado: 'Nitroprusiato en la IC aguda. ¿Qué dosis y qué precauciones de infusión da la Tabla 18.3?',
        opciones: [
          { t: 'Inicio de 2 µg/kg/min; evitar pasar de 10 µg/kg/min', porque: `Se empieza con 0,2 µg/kg/min; 2-5 µg/kg/min es la dosis eficaz habitual (${p(9)}).` },
          { t: 'Inicio de 0,2 µg/kg/min; máximo 10; evitar infusiones prolongadas por encima de 3 µg/kg/min', ok: true },
          { t: 'Inicio de 0,2 µg/kg/min; no hay máximo mientras se añada tiosulfato', porque: `El máximo permitido es 10 µg/kg/min; el tiosulfato reduce el riesgo de cianuro, pero no lo elimina (${p(9)}).` }],
        explicacion: `Inicio de <span class="hl">0,2 µg/kg/min</span>, titulando cada 5 min; eficaz 2-5; máximo 10; evitar infusiones prolongadas >3 µg/kg/min para reducir el cianuro (${p(9)}).` + enFicha(M, 'mc-tabla-18-3') },
      { id: 'icm-e3', corto: 'furosemida habitual', tipo: 'test', fuente: 'mc-furosemida', origen: 'ilustrativo: paciente inventado; la regla, de la ficha',
        enunciado: 'Un paciente toma 80 mg de furosemida al día en casa y llega con edema. ¿Qué dosis IV inicial recoge Marino?',
        opciones: [
          { t: '40 mg, la dosis estándar para empezar', porque: `Los 40 mg son para quien no la toma y tiene función renal normal (${p(11)}); él ya la recibe.` },
          { t: '80 mg: igual a su dosis diaria total en casa', ok: true },
          { t: '160 mg, el doble, porque de la oral solo se absorbe la mitad', porque: `La regla es igualar la dosis diaria total (${p(11)}); lo de la absorción del 50 % se aplica al pasar de la IV a la oral (${p(12)}).` }],
        explicacion: `En quien ya toma furosemida, <span class="hl-azul">la dosis IV inicial iguala la dosis diaria total</span> de casa (${p(11)}). La dosis oral absorbe solo el 50 %: al pasar a la vía oral puede hacer falta subirla (${p(12)}).` + enFicha(M, 'mc-furosemida') },
      { id: 'icm-e4', corto: 'metolazona', tipo: 'test', fuente: 'mc-resistencia-furosemida',
        enunciado: 'Resistencia a la furosemida: añades metolazona. ¿Cómo la das y qué vigilas?',
        opciones: [
          { t: 'Por vía oral, 2,5-10 mg al día, unas horas antes de la furosemida; vigilas la hipopotasemia', ok: true },
          { t: 'Al mismo tiempo que la furosemida; vigilas la hiperpotasemia', porque: `Debe darse unas horas antes y el riesgo de la combinación es la hipopotasemia (${p(12)}).` },
          { t: 'Unas horas después de la furosemida, para aprovechar su pico de 9 horas; vigilas la hipopotasemia', porque: `Su respuesta empieza a la hora y tiene su pico a las 9 h: por eso se da antes del asa (${p(12)}).` }],
        explicacion: `La tiazida favorecida es la <span class="hl">metolazona</span>, porque conserva su eficacia en la insuficiencia renal: 2,5-10 mg al día en una dosis oral, unas horas antes de la furosemida; la combinación aumenta el riesgo de hipopotasemia (${p(12)}).` + enFicha(M, 'mc-resistencia-furosemida') },
      { id: 'icm-e5', corto: 'torsemida', tipo: 'test', fuente: 'mc-tabla-18-4', origen: 'ilustrativo: paciente inventado; la equivalencia, de la Tabla 18.4',
        enunciado: 'Un paciente con 80 mg de furosemida IV al día sin buena respuesta. Quieres cambiarlo a torsemida. ¿Qué dosis equivalente?',
        opciones: [
          { t: '20 mg', porque: `Los 20 mg de torsemida equivalen a 40 mg de furosemida (${p(11)}); él necesita el doble.` },
          { t: '80 mg, la misma dosis numérica', porque: `No son miligramo a miligramo: 40 mg de furosemida = 20 mg de torsemida (${p(11)}).` },
          { t: '40 mg', ok: true }],
        explicacion: `<span class="hl">40 mg de furosemida = 1 mg de bumetanida = 20 mg de torsemida</span> (${p(11)}); bumetanida y torsemida tienen más biodisponibilidad y a veces responden cuando falla la furosemida (${p(12)}). Para 80 mg de furosemida, 40 mg de torsemida.` + enFicha(M, 'mc-tabla-18-4') },
      { id: 'icm-e6', corto: 'a los 200 mg', tipo: 'test', fuente: 'mc-resistencia-furosemida',
        enunciado: 'Un paciente no responde a 200 mg IV de furosemida. ¿Qué es y qué opciones hay?',
        opciones: [
          { t: 'Resistencia a la furosemida: cambiar a bumetanida o torsemida, o añadir metolazona', ok: true },
          { t: 'Dosis insuficiente: sube a 400 mg IV, que es lo que se hace antes de hablar de resistencia', porque: `200 mg es la dosis a la que se para; sin respuesta se habla de resistencia (${p(12)}).` },
          { t: 'Resistencia: pasar a la vía oral, que se absorbe mejor', porque: `Solo se absorbe el 50 % de la dosis oral (${p(12)}); no es una estrategia contra la resistencia.` }],
        explicacion: `Sin respuesta a 200 mg IV hay <span class="hl-rojo">resistencia a la furosemida</span> (por hipoalbuminemia, hipoperfusión renal o «freno diurético») (${p(12)}). Otras opciones: otro diurético de asa o una tiazida como la metolazona (${p(12)}).` + enFicha(M, 'mc-resistencia-furosemida') },
      { id: 'icm-e7', corto: 'FE conservada, FG 28', tipo: 'test', fuente: 'mc-largo-plazo · mc-tabla-18-5', origen: 'ilustrativo: paciente inventado; las indicaciones, de la ficha',
        enunciado: 'Una mujer estable, con FE del 58 % y filtrado de 28 mL/min/1,73 m², se va de alta tras un edema agudo. ¿Qué tratamiento de fondo recoge Marino?',
        opciones: [
          { t: 'Espironolactona: baja la mortalidad en todas las IC', porque: `No debe usarse con un filtrado <30 (${p(14)}), y el beneficio en supervivencia está demostrado en la FE reducida (${p(14)}).` },
          { t: 'Carvedilol: la IC siempre lleva betabloqueante', porque: `La guía no recomienda betabloqueantes en la IC con FE conservada (${p(14)}).` },
          { t: 'Un iSGLT2: se recomienda con FE reducida o conservada, con o sin diabetes', ok: true }],
        explicacion: `Los iSGLT2 se recomiendan en la IC avanzada, <span class="hl-verde">tanto con FE reducida como conservada</span>, con o sin diabetes (${p(14)}). Con FE conservada no hay recomendación de betabloqueantes (${p(14)}) y los antialdosterónicos no deben darse con filtrado <30 (${p(14)}).` + enFicha(M, 'mc-largo-plazo') },
    ],
    profundizar: [
      { id: 'mc-furosemida', titulo: 'Furosemida: cuándo empieza, cuándo pica y cuánto dura' },
      { id: 'mc-tabla-18-5', titulo: 'Tabla 18.5: dosis iniciales y objetivo' },
    ],
    casos: [
      { id: 'c-ic1', titulo: 'Mercedes, 71 años: el edema de madrugada', corto: 'Caso · Mercedes', sub: 'HTA y diabetes; 96 kg; el diurético que quitó el llenado',
        paciente: { Edad: '71 años, mujer', Peso: '96 kg, obesa', Antecedentes: 'hipertensión y diabetes tipo 2', Riñón: 'filtrado estimado 48 mL/min/1,73 m²' },
        pasos: [
          { momento: '03:30', datos: { Constantes: 'PA 204/108, FC 118', 'SpO₂': '83 % respirando aire', Exploración: 'disnea intensa, crepitantes bilaterales' }, nuevo: ['Constantes', 'SpO₂', 'Exploración'],
            pregunta: { id: 'cic-1', tipo: 'test', fuente: 'mc-ic-pa-alta · mc-nitroglicerina · mc-vpp', origen: 'ilustrativo: las cifras de Mercedes son del paciente; la conducta, de la ficha',
              enunciado: 'Mercedes llega con la tensión muy alta, hipoxemia y un edema agudo de pulmón. ¿Qué haces primero?',
              opciones: [
                { t: 'Furosemida IV 80 mg ya: el pulmón está encharcado y es lo urgente, lo demás puede esperar', porque: `Con la PA alta el vasodilatador va primero; la furosemida IV es vasoconstrictora y sube la poscarga (${p(10)}). Con 204/108 sería echar leña al fuego.` },
                { t: 'Nitroglicerina en infusión (5 µg/min, +5 cada 5 min, en vidrio y polietileno) y CPAP', ok: true },
                { t: 'Nitroprusiato, que es más potente que la nitroglicerina', porque: `La nitroglicerina es de elección (${p(10)}); el nitroprusiato es la alternativa en el 20 % que no responde, y no se recomienda con insuficiencia renal (${p(10)}).` }],
              explicacion: `Con hipertensión, <span class="hl-azul">vasodilatador primero</span>: la nitroglicerina es el de elección (${p(9)}), con la pauta de 5 µg/min y +5 cada 5 min, en vidrio y polietileno por la pérdida en PVC. La ventilación no invasiva es un tratamiento aceptado del edema pulmonar cardiogénico (${p(14)}).`,
              nota: `La CPAP se ajusta «usualmente a 5-10 cm H₂O» (${r(77)}). <b>La fuente no lo dice:</b> el orden entre el vasodilatador y la ventilación; los dos se inician a la vez en este caso.` } },
          { momento: '03:50 · con la CPAP', datos: { Tratamiento: 'nitroglicerina en infusión (vidrio y polietileno) y CPAP' }, nuevo: ['Tratamiento'],
            pregunta: { id: 'cic-2', tipo: 'destapa', cuantas: 'son tres cosas', fuente: 'mc-vpp', modeloVivo: sv('ic-cpap', '🫀 Etapa 3 con CPAP: mira cómo se sostiene el gasto y baja el edema'),
              enunciado: 'Con la CPAP puesta, ¿qué espera Marino que le pase al volumen sistólico en una IC izquierda con edema, y por qué? Tu respuesta tiene tres partes.',
              puntos: [
                `La presión positiva del tórax <span class="hl-azul">baja la presión transmural</span> que el VI desarrolla en sístole.`,
                `Eso es una <span class="hl-azul">menor poscarga</span>: la pared se mueve hacia dentro con más facilidad.`,
                `El VI se vacía mejor y <span class="hl-verde">sube el volumen sistólico</span> (y el gasto).`],
              explicacion: `«Las presiones intratorácicas positivas reducirán la poscarga del VI al disminuir la presión transmural de la pared» y favorecen el vaciado ventricular, con lo que el volumen sistólico aumenta (${p(14)}). La CPAP sube el gasto en la IC izquierda y acelera la mejoría del edema (${p(14)}).`,
              nota: `En el modelo, el paciente es Ramiro (etapa 3 de la Fig. 18.3), no Mercedes: enseña lo que el corazón que falla tolera con la CPAP (${r(88)}): el gasto se sostiene (VS ≈33-34 mL) y el edema baja con CPAP 10, sin la subida que describe el libro. <b>Límite del modelo:</b> Marino (resp. p. 83, 88) y Bradley 1992 (PMID 1736745: +22 % de VS indexado con CPAP 5 y PCP ≥12) describen que el gasto puede subir; el modelo no lo reproduce porque no tiene la retirada simpática ni el alivio del trabajo respiratorio. Mercedes tiene FE conservada: ahí la presión intratorácica alta puede dificultar el llenado y agravar el cuadro (${p(3)}), así que en ella el volumen sistólico podría no subir. <b>La fuente no lo dice:</b> cifras del cambio con la CPAP.` + enFicha(M, 'mc-vpp') } },
          { momento: '04:10 · analítica', datos: { BNP: '160 pg/mL', Lactato: '1,3 mmol/L' }, nuevo: ['BNP', 'Lactato'],
            pregunta: { id: 'cic-3', tipo: 'test', fuente: 'mc-bnp · mc-tabla-18-2', origen: 'ilustrativo: BNP de la paciente; los umbrales, de la ficha',
              enunciado: 'El BNP de Mercedes es 160 pg/mL. La residente dice: «No llega ni a 300; no es insuficiencia cardíaca». ¿Qué le contestas?',
              opciones: [
                { t: 'Tiene razón: con valores por debajo de 300 se descarta la IC', porque: `Ese 300 es el umbral del NT-proBNP; el del BNP es 100 (${p(8)}). Con su lectura dejarías sin tratar un edema cardiogénico (${DED}).` },
                { t: 'Que 160 supera el umbral de 100 y no la descarta; además, la obesidad lo baja, así que no tranquiliza', ok: true },
                { t: 'Que lo confirma: un BNP de 160 con disnea basta para el diagnóstico', porque: `Los péptidos suben también por la edad y la insuficiencia renal (Tabla 18.2, ${p(8)}); sirven mejor para excluir que para confirmar.` }],
              explicacion: `Se considera improbable la IC con <span class="hl-verde">BNP <100</span> (${p(8)}). Los niveles son más bajos en los obesos, por el aclaramiento en el tejido adiposo (${p(7)}); la edad y la insuficiencia renal los elevan (${p(8)}).`,
              nota: `<b>La fuente no lo dice.</b> El libro no da una corrección del BNP por el peso; solo dice que es menor en la obesidad.` + enFicha(T, 'mc-bnp') } },
          { momento: '05:00 · eco', datos: { Constantes: 'PA 128/72, FC 96, SpO₂ 94 % con CPAP', Eco: 'FEVI 58 %, VI hipertrófico', Exploración: 'siguen los crepitantes' }, nuevo: ['Constantes', 'Eco', 'Exploración'],
            pregunta: { id: 'cic-4', tipo: 'test', fuente: 'mc-tabla-18-1 · mc-hfpef', modeloVivo: eco('hipertrofia', '🫀 Mira el VI hipertrófico y rígido'),
              enunciado: 'La eco muestra una FEVI del 58 % y un VI hipertrófico, y la PA ya se ha normalizado. ¿Qué tipo de IC es y qué te anticipa?',
              opciones: [
                { t: 'IC con FE ligeramente reducida: hay que cuidar el gasto, pero el diurético no tiene limitación', porque: `El 58 % no es 41-49 (${p(3)}); es FE conservada, donde el diurético pide cautela (${p(11)}).` },
                { t: 'IC con FE conservada, de llenado: el VI rígido se llena mal, así que el diurético pedirá cautela', ok: true },
                { t: 'IC sistólica: la hipertrofia indica que el músculo no se contrae', porque: `La hipertrofia es una causa de IC con FE conservada, por disfunción diastólica (${p(3)}).` }],
              explicacion: `FEVI ≥50 % es <span class="hl-azul">IC con FE conservada</span>: la hipertrofia es causa de disfunción diastólica (${p(3)}). Los diuréticos deben usarse con cuidado aquí, porque puede bajar el llenado (${p(11)}).` + enFicha(T, 'mc-hfpef') } },
          { momento: '07:30 · el giro', datos: { Tratamiento: 'furosemida 80 mg IV a las 05:30 (sin tomarla antes)', Constantes: 'PA 94/52, FC 108', Lactato: '2,4 mmol/L', Diuresis: '250 mL en 2 h' }, nuevo: ['Tratamiento', 'Constantes', 'Lactato', 'Diuresis'],
            pregunta: { id: 'cic-5', tipo: 'test', fuente: 'mc-diureticos-preocupaciones · mc-ic-final', origen: 'ilustrativo: las cifras de la furosemida, la PA y el lactato son de la paciente; la dosis, de la Tabla 18.4',
              enunciado: 'Dos horas después de los 80 mg de furosemida, Mercedes tiene PA 94/52, lactato 2,4 y ha orinado 250 mL. Un compañero dice: «Poca orina: resistencia; doblo a 160 mg». ¿Qué ha pasado?',
              opciones: [
                { t: 'El diurético ha bajado el gasto (menos precarga y más poscarga), sobre todo con FE conservada: hay hipoperfusión: antes de doblar, valoras el shock', ok: true },
                { t: 'Resistencia pura a la furosemida: doblar a 160 mg es lo que dice la pauta a las 2 horas', porque: `La pauta duplica si la diuresis es <1 L, pero con hipotensión y lactato alto el diurético puede estar bajando el gasto (${p(10)}-${p(11)}); más dosis restaría más llenado (${DED}).` },
                { t: 'Propilenglicol de la nitroglicerina: acidosis láctica e hipotensión', porque: `Aparece con infusiones prolongadas (${p(9)}-${p(10)}); Mercedes lleva unas horas de infusión y el empeoramiento sigue a la furosemida (${DED}).` }],
              explicacion: `La furosemida IV <span class="hl-rojo">baja el gasto</span> (retorno venoso menor y más poscarga) y el efecto se magnifica en la FE conservada, donde el llenado es crítico (${p(15)}). El capítulo trata la IC aguda sin hipotensión ni lactato elevado y manda el shock cardiogénico al capítulo 16 (${p(9)}); el shock cardiogénico se distingue de la IC por la hipoperfusión (hipotensión, poca diuresis, lactato alto) (${s(40)}). Mercedes, con PA 94/52 y lactato 2,4, cumple esos dos rasgos (${DED}).`,
              nota: `<b>La fuente no lo dice.</b> El libro no da la cifra de PA que cuenta como hipotensión ni el límite exacto del lactato; la PAM de Mercedes sale a unos 66 mmHg (fisiología general). La conducta en el shock está en el capítulo 16, no en este.` + enFicha(M, 'mc-ic-final') } },
          { momento: 'Día 2 · nota del residente', datos: { Evolución: 'PA 118/66, lactato 1,2; sale de la CPAP', Nota: 'plan del residente de guardia' }, nuevo: ['Evolución', 'Nota'],
            pregunta: { id: 'cic-6', tipo: 'error', fuente: 'mc-nitroglicerina · mc-ic-final · mc-bnp · mc-largo-plazo',
              enunciado: 'La nota del residente de guardia sobre Mercedes. Hay dos errores. Encuéntralos.',
              frases: [
                { t: 'La nitroglicerina se preparó en vidrio y polietileno, porque el PVC retiene hasta el 80 % del fármaco.' },
                { t: 'Se mantiene la nitroglicerina 72 horas sin cambiar la dosis, porque la paciente va bien.', mal: true, c: `La <span class="hl-rojo">taquifilaxia es frecuente a las 24 h</span> y las infusiones prolongadas arriesgan toxicidad por propilenglicol: no debe pasar de 24 h (${p(9)}).` },
                { t: 'El edema de Mercedes es sobrecarga de volumen, así que lo prudente es seguir con más furosemida.', mal: true, c: `El edema agudo <span class="hl-rojo">no siempre es sobrecarga</span> (miocardio rígido), y la furosemida baja el gasto, más aún con FE conservada (${p(15)}).` },
                { t: 'El BNP de 160, en una obesa, no descarta la IC.' },
                { t: 'Antes del alta, cuando esté estable, se valorará un iSGLT2.' }],
              explicacion: 'Dos errores: mantener la nitroglicerina 72 h y seguir con más diurético dando por hecho que es sobrecarga.',
              nota: `<b>La fuente no lo dice.</b> Marino no da cuánto tiempo seguir con la CPAP; las cifras del día 2 son de la paciente.` } },
          { momento: 'Día 4 · antes del alta', datos: { Constantes: 'PA 124/70, FC 76, SpO₂ 96 % sin oxígeno', Riñón: 'filtrado 48, sin hiperpotasemia' }, nuevo: ['Constantes', 'Riñón'],
            pregunta: { id: 'cic-7', tipo: 'test', fuente: 'mc-largo-plazo · mc-tabla-18-5', modeloVivo: eco('hipertrofia', '🫀 El VI hipertrófico de Mercedes'), origen: 'ilustrativo: las constantes de Mercedes son del paciente; las indicaciones, de la ficha',
              enunciado: 'Mercedes está estable, con FE del 58 %. La residente propone empezar carvedilol «porque es una IC». ¿Qué plan de alta recoge Marino?',
              opciones: [
                { t: 'Sacubitrilo-valsartán a dosis plena desde el primer día: es la combinación más eficaz de todas', porque: `Es la más eficaz en la FE reducida; en la FE conservada la supresión del eje renina-angiotensina-aldosterona no ha mostrado beneficio consistente (${p(13)}).` },
                { t: 'Carvedilol y espironolactona, como en la FE reducida', porque: `Con FE conservada no hay recomendación de betabloqueantes, y los antialdosterónicos se usan con cautela por el llenado (${p(14)}).` },
                { t: 'Un iSGLT2 (10 mg/día), vigilando la cetoacidosis; sin recomendación de betabloqueante', ok: true }],
              explicacion: `Los <span class="hl-verde">iSGLT2</span> se recomiendan con FE reducida o conservada, con o sin diabetes (10 mg al día, Tabla 18.5); el riesgo es la cetoacidosis diabética euglucémica (${p(14)}). Las guías no incluyen betabloqueantes en la FE conservada (${p(14)}).`,
              nota: `<b>La fuente no lo dice.</b> El libro no dice si un betabloqueante previo (la paciente es hipertensa) debe suspenderse; solo que no hay recomendación para iniciarlo por la IC con FE conservada.` + enFicha(M, 'mc-largo-plazo') } },
        ],
        lleva: [
          'Con la tensión alta, el vasodilatador va antes que el diurético; la CPAP baja la poscarga del VI.' + enFicha(M, 'mc-ic-pa-alta'),
          'Con la FE conservada, el diurético quita el llenado que el VI necesita: el edema agudo no siempre es sobrecarga de volumen.',
          'Un BNP no confirma ni descarta por sí solo: la obesidad lo baja; la edad y la insuficiencia renal lo suben.'],
        volver: { nombre: 'El diurético con cuidado', ancla: 'mc-ic-final', modelo: eco('hipertrofia', '🫀 El VI hipertrófico de Mercedes') } },
    ],
  },
};
