// Mayéutica del bloque 3, sub-bloque 3B · Shock cardiogénico, parte 3 (Marino cap. 16, págs. 44-49): ficha 8 (soporte circulatorio mecánico)
// y el caso C8 (Remedios). Datos puros; el formato está en la cabecera de b1-fluidos.js. La ficha es js/modules/cardiologia/merino-cardiologia.html.
// Modelo vivo: shockVivo (claves balon, impella, ecmo, rotura-septo; js/modules/libros/shock-vivo/). Las cifras de Remedios son las del modelo
// con su gravedad por defecto (RECETA_REMEDIOS, g 0,3) y con ECMO a 4,5 L/min; el lactato y los datos de cada hora son del paciente (ilustrativo).
const PDF = 'docs/marino-2024-shock-caps14-17.pdf';
const pag = (n, txt) => `<a class="biblio-link" href="${PDF}#page=${n}" target="_blank" rel="noopener">${txt || `PDF pág. ${n}`}</a>`;
const p = n => pag(n, `pág. ${n}`);
// «Ver en la ficha» dentro de una nota (REGLAS §7.9): el enlace cruzado de siempre al párrafo exacto.
const enFicha = (tab, id) => ` <button type="button" class="may-ir" data-especialidad="cardiologia" data-view="merinoCardiologia" data-panel="panel-merino-cardio-tabs" data-tab="${tab}" data-resaltar="#${id}">Ver en la ficha ↗</button>`;
const sv = (clave, texto) => ({ shockVivo: clave, texto });
const balon = sv('balon', '⚡ El balón de contrapulsación, en el shock vivo');
const impella = sv('impella', '⚡ El Impella, en el shock vivo');
const ecmo = sv('ecmo', '⚡ El ECMO veno-arterial, en el shock vivo');
const septo = sv('rotura-septo', '⚡ La rotura del septo, en el shock vivo');
const DED = '<i>Deducción; la fuente no lo dice.</i>';

export const MAYEUTICA_CARDIOGENICO_3 = {
  /* =================================================================================================
     Ficha 8 · Soporte circulatorio mecánico (cap. 16, págs. 45-49)
     ================================================================================================= */
  'mc-soporte-mecanico': {
    entrada: 'Cuándo se infla y se desinfla el balón y qué cambia en la curva de presión, qué aparato lleva a quién y a quién no, y por qué el ECMO oxigena pero le añade trabajo al ventrículo.',
    guia: [
      { id: 'mcs-g1', corto: 'cuándo se infla', tipo: 'test', fuente: 'mc-iabp-metodo · mc-fig-16-3', modeloVivo: balon,
        enunciado: 'Mira la Figura 16.3 y predice antes de comprobarlo: el balón de contrapulsación se infla con helio. ¿En qué momento del ciclo cardíaco empieza a inflarse?',
        opciones: [
          { t: 'Al inicio de la diástole, justo después de cerrarse la válvula aórtica', ok: true },
          { t: 'Al inicio de la sístole, justo antes de abrirse la válvula aórtica', porque: `Ese es el momento del <b>desinflado</b> (durante la contracción isovolumétrica, ${p(45)}). Si inflas ahí, quitas el efecto de succión y no sube la presión diastólica.` },
          { t: 'En plena sístole, para empujar la sangre hacia fuera', porque: `La fuente sitúa el inflado en la diástole (${p(45)}); un balón inflado mientras el VI eyecta se opondría a su salida. ${DED}` }],
        explicacion: `El inflado empieza <span class="hl">al inicio de la diástole, tras el cierre de la válvula aórtica</span> (la onda R del ECG es un disparador habitual). Sube la presión diastólica pico, y con ella el flujo coronario, que es sobre todo diastólico (${p(45)}).` },
      { id: 'mcs-g2', corto: 'al desinflarse', tipo: 'test', fuente: 'mc-iabp-metodo · mc-fig-16-3', modeloVivo: balon,
        enunciado: 'Predice, y luego miras la curva de presión aórtica: ¿qué consigue el balón al desinflarse justo antes de abrirse la válvula aórtica?',
        opciones: [
          { t: 'Sube la presión diastólica pico, con más flujo coronario y más presión arterial media', porque: `Eso lo hace el <b>inflado</b> en diástole (${p(45)}). Atribuírselo al desinflado te hace esperar más flujo coronario justo cuando el VI empieza a eyectar.` },
          { t: 'Una succión que baja la presión de la aorta: menos poscarga y más volumen sistólico', ok: true },
          { t: 'Un flujo retrógrado que llega al arco aórtico', porque: `El flujo retrógrado hacia el arco es el del ECMO veno-arterial (${p(48)}), no el del balón. Confundirlos te hace esperar que el balón mejore la perfusión cerebral por sí mismo.` }],
        explicacion: `El desinflado <span class="hl">crea una succión que baja la presión en la aorta cuando se abre la válvula aórtica</span>: menos poscarga del VI y más volumen sistólico. Entre inflado y desinflado, el balón <span class="hl-azul">reduce el trabajo del corazón</span> y a la vez sube el flujo coronario y sistémico (${p(45)}-46).` },
      { id: 'mcs-g3', corto: 'cuándo no', tipo: 'test', fuente: 'mc-iabp · mc-impella-efectos',
        enunciado: 'Cada aparato tiene sus contraindicaciones. Predice: ¿cuál de estos pacientes no puede llevar un balón de contrapulsación?',
        opciones: [
          { t: 'Uno con una prótesis aórtica mecánica o con un trombo en el ventrículo izquierdo', porque: `Esas son contraindicaciones del <b>Impella</b> (prótesis valvular aórtica y trombo del VI, ${p(48)}); la del balón es la insuficiencia valvular aórtica o la disección (${p(45)}). Si las mezclas, negarás un balón útil.` },
          { t: 'Uno en shock refractario con el VI muy deprimido', porque: `Es justo la indicación del balón: shock refractario en el que se espera mejoría de la función cardíaca (${p(45)}). Negárselo por la FEVI baja sería privarle de un aparato que reduce el trabajo del corazón.` },
          { t: 'Uno con insuficiencia valvular aórtica o con una disección aórtica', ok: true }],
        explicacion: `<span class="hl-rojo">Balón: insuficiencia valvular aórtica y disección aórtica</span> (${p(45)}). Impella: enfermedad o prótesis valvular aórtica y trombo del VI (${p(48)}).`,
        nota: `<b>La fuente no lo dice.</b> Marino enumera las contraindicaciones sin su mecanismo; aquí no se inventa.${enFicha('mc-soporte-mecanico', 'mc-iabp')}` },
      { id: 'mcs-g4', corto: 'el flujo del Impella', tipo: 'test', fuente: 'mc-impella · mc-fig-16-4', modeloVivo: impella,
        enunciado: 'Predice antes de moverlo en el modelo: el Impella tiene una bomba centrífuga miniaturizada que lleva sangre del ventrículo a la aorta. ¿Cómo es su flujo y de cuánto?',
        opciones: [
          { t: 'Pulsátil, sincronizado con la onda R, unos 35-40 mL por ciclo', porque: `Eso es el balón (helio, 35-40 mL, disparo por la R; ${p(45)}). El Impella no se sincroniza: sus aspas dan flujo continuo (${p(47)}).` },
          { t: 'Continuo, no pulsátil, de 2,5 a 5,5 L/min según el catéter', ok: true },
          { t: 'Continuo, de 5 a 6 L/min para dar soporte circulatorio completo', porque: `Esos son los flujos del ECMO veno-arterial (${p(48)}). Esperar eso de un Impella lleva a sobrestimar el soporte que da.` }],
        explicacion: `Bomba centrífuga con aspas: <span class="hl">flujo no pulsátil</span> del VI a la aorta proximal, <span class="hl-azul">2,5-5,5 L/min según el catéter</span> (${p(47)}). Descarga el VI y sube el gasto y el flujo coronario, como el balón (${p(48)}).` },
      { id: 'mcs-g5', corto: 'el ECMO y la PCP', tipo: 'test', fuente: 'mc-ecmo-poscarga · mc-fig-16-5', modeloVivo: ecmo,
        enunciado: 'Predice y luego compruebas: pasas un paciente con el VI fallido de 0 a 4,5 L/min de ECMO veno-arterial. La presión de enclavamiento (PCP) ¿qué hace, y por qué?',
        opciones: [
          { t: 'Baja, porque desvía la sangre fuera de las cavidades izquierdas', porque: `No lo hace: el ECMO devuelve la sangre a la <b>aorta</b> y el flujo retrógrado sube la poscarga del VI (${p(48)}). Esperar una PCP baja te hace pasar por alto el edema pulmonar agudo.` },
          { t: 'No cambia: el ECMO solo añade oxigenación', porque: `Marino lo señala como el problema propio de este aparato: el flujo retrógrado en la aorta sube la poscarga y puede reducir el gasto del VI (${p(48)}).` },
          { t: 'Sube: el flujo retrógrado en la aorta aumenta la poscarga del VI', ok: true }],
        explicacion: `<span class="hl-rojo">Poscarga del VI</span>: el flujo retrógrado por la aorta la aumenta, y puede ser lo bastante grave como para reducir el gasto del VI y <span class="hl-rojo">causar edema pulmonar agudo</span> (${p(48)}). Que eso se vea como subida de la PCP es una deducción de la fisiología (${DED}).` },
      { id: 'mcs-g6', corto: 'cómo se arregla', tipo: 'test', fuente: 'mc-ecmo-poscarga · mc-carga-trabajo',
        enunciado: 'El VI del paciente con ECMO no consigue eyectar y la PCP sube. Según Marino, ¿cuál es el abordaje?',
        opciones: [
          { t: 'Subir el flujo de la bomba hasta 6 L/min para ganar perfusión', porque: `Más flujo retrógrado es más poscarga: empeoraría el problema que describe la fuente (${p(48)}). ${DED}` },
          { t: 'Añadir un balón o un Impella, o drenar sangre del VI («venteo»)', ok: true },
          { t: 'Añadir dobutamina a dosis altas para que el VI venza la poscarga', porque: `Los inotrópicos aumentan el trabajo del miocardio fallido, justo lo que la fuente desaconseja como único apoyo (${p(44)}); los aparatos están diseñados para reducirlo.` }],
        explicacion: `Dos vías (${p(48)}-49): <span class="hl">combinar balón o Impella con el ECMO</span> para bajar la poscarga, o <span class="hl">drenar sangre del VI</span> para bajar la presión telediastólica («venteo»).` },
      { id: 'mcs-g7', corto: 'cuál elegir', tipo: 'destapa', cuantas: 'son dos cosas', fuente: 'mc-ecmo · mc-mcs-seleccion', modeloVivo: ecmo,
        enunciado: 'Shock cardiogénico con edema pulmonar y fallo respiratorio. ¿Qué aparato prefiere Marino y qué dos cosas hace que el balón no hace?',
        puntos: [
          `Prefiere el <span class="hl-verde">VA-ECMO</span>: es el método de elección cuando el shock cardiogénico se acompaña de fallo respiratorio (${p(48)}-49).`,
          `Porque da <span class="hl">soporte circulatorio</span> (incluso biventricular) y además <span class="hl-azul">oxigenación y eliminación de CO₂</span>.`],
        explicacion: `El fallo respiratorio es una complicación frecuente del shock cardiogénico (${p(48)}). El precio: la poscarga del VI y las complicaciones (sangrado mayor 41 %, sepsis 30 %). Y la elección real depende de la disponibilidad del hospital (${p(49)}).` },
    ],
    examen: [
      { id: 'mcs-e1', corto: 'el pulso pedio', tipo: 'test', fuente: 'mc-iabp-complic',
        enunciado: 'Una paciente con balón de contrapulsación pierde el pulso pedio, pero mueve y siente la pierna con normalidad. ¿Qué haces?',
        opciones: [
          { t: 'Retirar el balón de inmediato y avisar a cirugía vascular para que valore la pierna', porque: `La regla de retirada inmediata es la <b>pérdida sensitivomotora</b> (${p(46)}). Retirarlo por el pulso solo quita soporte a una paciente que lo necesita.` },
          { t: 'Mantenerlo y vigilar: perder el pulso solo no obliga a retirar el balón', ok: true },
          { t: 'Retirarlo en 24 h por si acaso se complica', porque: `La fuente no pone plazos: el criterio es la función sensitivomotora (${p(46)}). ${DED}` }],
        explicacion: `<span class="hl">Perder los pulsos distales sin perder la función sensitivomotora no exige retirar el balón</span>; perderla sí exige retirada inmediata y posible cirugía (${p(46)}). La isquemia de la extremidad es la principal preocupación.` },
      { id: 'mcs-e2', corto: 'gas y volumen', tipo: 'test', fuente: 'mc-iabp-metodo',
        enunciado: '¿Con qué se infla el balón de contrapulsación y qué volumen suele tener?',
        opciones: [
          { t: 'Helio, 35-40 mL', ok: true },
          { t: 'Aire comprimido, 350-400 mL', porque: `El gas es helio, de baja densidad, para inflar y desinflar rápido; el volumen son 35-40 mL (${p(45)}). Diez veces ese volumen es una cifra que la fuente no da (${DED}).` },
          { t: 'Helio, 2,5-5,5 L por minuto', porque: `Esos son los litros por minuto del flujo del Impella (${p(47)}), no el volumen de inflado del balón (${p(45)}).` }],
        explicacion: `Bomba con <span class="hl">helio</span> (gas de baja densidad): <span class="hl-azul">35-40 mL</span> de volumen de inflado (${p(45)}).` },
      { id: 'mcs-e3', corto: 'el Impella no', tipo: 'test', fuente: 'mc-impella-efectos',
        enunciado: '¿En cuál de estos pacientes está contraindicado el Impella?',
        opciones: [
          { t: 'Shock cardiogénico refractario tras un infarto', porque: `Es justo la indicación del soporte mecánico (${p(45)}); el Impella no ha mostrado ventaja de supervivencia sobre el balón en ese contexto (${p(48)}), pero no está contraindicado.` },
          { t: 'Disección aórtica, sin enfermedad valvular', porque: `La disección contraindica el <b>balón</b> (${p(45)}); para el Impella no figura (${p(48)}).` },
          { t: 'Trombo en el ventrículo izquierdo', ok: true }],
        explicacion: `Contraindicado en <span class="hl-rojo">enfermedad o prótesis valvular aórtica y trombo del VI</span> (${p(48)}). El catéter se aloja dentro del ventrículo, a través de la válvula aórtica (Fig. 16.4, ${p(47)}).` },
      { id: 'mcs-e4', corto: 'complicación del ECMO', tipo: 'test', fuente: 'mc-ecmo-complic',
        enunciado: 'De las complicaciones del VA-ECMO, ¿cuál es la más frecuente según Marino?',
        opciones: [
          { t: 'Sangrado mayor (41 %)', ok: true },
          { t: 'Isquemia de la extremidad (17 %)', porque: `Es la tercera: sangrado 41 %, sepsis 30 %, isquemia de extremidad 17 % (${p(48)}). Vigilar solo la pierna deja sin mirar el sangrado, que es lo que más aparece con la anticoagulación plena.` },
          { t: 'Ictus (6 %)', porque: `Es de las menos frecuentes de la lista: detrás del compartimental (10 %) y por delante solo de la amputación (5 %) (${p(48)}).` }],
        explicacion: `Lista completa (${p(48)}): <span class="hl-rojo">sangrado mayor 41 %</span>, sepsis 30 %, isquemia de extremidad 17 %, síndrome compartimental 10 %, ictus 6 % y amputación 5 %. Hace falta anticoagulación plena.` },
      { id: 'mcs-e5', corto: 'los apuntes', tipo: 'error', fuente: 'mc-mcs · mc-iabp-metodo · mc-impella · mc-ecmo-poscarga',
        enunciado: 'Apuntes de un compañero sobre el soporte mecánico. Encuentra los errores.',
        frases: [
          { t: 'El balón se infla al inicio de la diástole y se desinfla justo antes de abrirse la válvula aórtica.' },
          { t: 'El balón de contrapulsación ha demostrado mejorar la supervivencia en el shock cardiogénico.', mal: true, c: `Marino lo dice al revés: se sigue usando <span class="hl-rojo">pese a que no mejora la supervivencia</span>, y ninguna forma de soporte la mejora en las comparaciones (${p(45)}).` },
          { t: 'El Impella da un flujo continuo de 2,5-5,5 L/min según el catéter.' },
          { t: 'El ECMO veno-arterial aumenta la poscarga del VI.' }],
        explicacion: 'Un solo error: atribuirle al balón una ventaja de supervivencia que la fuente niega.' },
      { id: 'mcs-e6', corto: 'fiebre y bacteriemia', tipo: 'test', fuente: 'mc-iabp-complic',
        enunciado: 'En pacientes con balón, la fiebre aparece en el 50 %. ¿En qué proporción hay bacteriemia?',
        opciones: [
          { t: 'En el 50 %: la fiebre del balón es siempre una infección', porque: `La fuente separa las dos cifras: fiebre 50 %, bacteriemia solo 15 % (${p(47)}). Tratar toda fiebre como bacteriemia lleva a retirar un balón útil. ${DED}` },
          { t: 'En el 15 %', ok: true },
          { t: 'En el 5-10 %', porque: `Esa es la incidencia de hemólisis significativa con el Impella (${p(48)}), no la de bacteriemia con el balón.` }],
        explicacion: `<span class="hl">Fiebre en el 50 %, bacteriemia en el 15 %</span> (${p(47)}). La septicemia es una de las complicaciones del balón.` },
    ],
    casos: [
      { id: 'c8r', titulo: 'Remedios, 74 años: un soplo nuevo tras el infarto', corto: 'Caso · Remedios (rotura del septo)', sub: 'del soplo al soporte mecánico',
        paciente: { Edad: '74 años, mujer', Peso: '62 kg', Antecedentes: 'sin valvulopatía conocida', Motivo: 'Infarto anterior; hora 20 del infarto, soplo holosistólico nuevo con frémito' },
        pasos: [
          { momento: 'Hora 20 del infarto', datos: { Monitor: 'PA 75/60 (PAM 67) · FC 109 · IC 1,57', Catéter: 'PCP 24 · PVC 7 · Qp/Qs 2,2', Saturación: 'AD 52 % → AP 69 %', Exploración: 'soplo holosistólico nuevo con frémito' }, nuevo: ['Monitor', 'Catéter', 'Saturación', 'Exploración'],
            pregunta: { id: 'c8r-1', tipo: 'test', fuente: 'mc-septo-rotura · mc-roturas-24h', modeloVivo: septo, origen: 'ilustrativo: cifras del modelo con su gravedad por defecto; la causa y la fisiopatología, de la ficha',
              enunciado: 'Veinte horas después de un infarto aparece un soplo nuevo. La sangre de la arteria pulmonar tiene mucha más saturación que la de la aurícula derecha y el gasto sistémico es bajo. ¿Qué ha pasado?',
              opciones: [
                { t: 'Rotura del músculo papilar: insuficiencia mitral aguda', porque: `Da un soplo holosistólico y shock (7 % de los casos, ${p(38)}), pero no pasa sangre del VI al VD, de modo que la saturación de la arteria pulmonar no sube respecto a la aurícula (${DED}).` },
                { t: 'Rotura del septo interventricular: un shunt izquierda-derecha que inunda el pulmón', ok: true },
                { t: 'Rotura de la pared libre: taponamiento por hemopericardio', porque: `Sería hemopericardio de acumulación rápida y colapso (1 %, ${p(38)}), sin soplo con frémito ni salto de saturación (${DED}). Irías a pericardiocentesis en vez de al soporte.` }],
              explicacion: `La rotura del septo (4 % de los shocks cardiogénicos del infarto) produce <span class="hl-rojo">un gran shunt izquierda-derecha que inunda la circulación pulmonar y desvía flujo de la sistémica</span>; aparece típicamente en las primeras 24 h (${p(38)}). Que la saturación suba de la AD a la AP es consecuencia del shunt (${DED}).`,
              nota: `<b>La fuente no lo dice.</b> Marino no da un criterio de «salto de saturación» ni de Qp/Qs para diagnosticar la rotura; esas cifras son del modelo y de este paciente.${enFicha('mc-cardiogenico-fisio', 'mc-septo-rotura')}` } },
          { momento: 'Hora 23', datos: { Tratamiento: 'noradrenalina y dobutamina en marcha', Monitor: 'PA 75/60 · FC 109', Analítica: 'lactato 5,8 mmol/L' }, nuevo: ['Tratamiento', 'Analítica'],
            pregunta: { id: 'c8r-2', tipo: 'test', fuente: 'mc-carga-trabajo · mc-mcs', modeloVivo: septo, origen: 'ilustrativo: lactato del modelo; la conducta, de la ficha',
              enunciado: 'Con noradrenalina y dobutamina la presión no mejora y el lactato sigue en 5,8. ¿Cómo sigues?',
              opciones: [
                { t: 'Subir la dobutamina hasta que mejore la presión', porque: `La farmacología aumenta el trabajo de un miocardio ya fallido (los vasopresores suben la poscarga y los inotrópicos la contractilidad, ${p(44)}) y rara vez lo recupera. Pierdes horas con la paciente empeorando.` },
                { t: 'Esperar 24 h más: el soporte mecánico se reserva para cuando falle un órgano', porque: `Es lo contrario: el soporte iniciado tras el fallo multiorgánico se ha descrito como un «puente a ningún sitio» (${p(50)}).` },
                { t: 'No retrasar el soporte mecánico: la mejoría con fármacos no es rápida', ok: true }],
              explicacion: `Los aparatos están diseñados para <span class="hl">reducir el trabajo cardíaco</span>; si no hay <span class="hl-rojo">mejoría rápida con fármacos</span>, hay que evitar retrasos en pasar a soporte mecánico (${p(44)}-45). Está indicado en el shock refractario donde se espera mejoría de la función cardíaca, o hay otra intervención planeada (${p(45)}).` } },
          { momento: 'Hora 24 · qué aparato', datos: { Pregunta: 'el equipo repasa los aparatos posibles' }, nuevo: ['Pregunta'],
            pregunta: { id: 'c8r-3', tipo: 'error', fuente: 'mc-iabp · mc-impella-efectos · mc-ecmo', modeloVivo: ecmo,
              enunciado: 'Un residente repasa qué aparato admitiría el historial de cualquier paciente. Encuentra los errores.',
              frases: [
                { t: 'Un balón de contrapulsación sirve aunque la TC mostrara una disección aórtica.', mal: true, c: `La <span class="hl-rojo">disección aórtica</span> (y la insuficiencia valvular aórtica) contraindican el balón (${p(45)}).` },
                { t: 'Un Impella sirve aunque la paciente lleve una prótesis aórtica mecánica.', mal: true, c: `La <span class="hl-rojo">prótesis o enfermedad valvular aórtica</span> y el trombo del VI contraindican el Impella (${p(48)}).` },
                { t: 'El ECMO veno-arterial se coloca por canulación percutánea de arteria y vena femorales.' },
                { t: 'Como los otros aparatos, el ECMO necesita anticoagulación plena.' }],
              explicacion: `Balón: no con disección ni insuficiencia aórtica. Impella: no con prótesis o valvulopatía aórtica ni trombo del VI. ECMO: canulación femoral y anticoagulación plena (${p(48)}).` } },
          { momento: 'Día 2 · ECMO a 4,5 L/min', datos: { Aparato: 'ECMO veno-arterial a 4,5 L/min', Monitor: 'PA 86/80 (PAM 84) · FC 78 · IC 2,6', Catéter: 'PCP 29 (antes 24) · PVC 4', Analítica: 'lactato 1,0 mmol/L' }, nuevo: ['Aparato', 'Monitor', 'Catéter', 'Analítica'],
            pregunta: { id: 'c8r-4', tipo: 'destapa', cuantas: 'son dos cosas', fuente: 'mc-ecmo-poscarga', modeloVivo: ecmo, origen: 'ilustrativo: cifras del modelo (Remedios con ECMO a 4,5 L/min; el lactato de 1,0 es del paciente); el mecanismo y el abordaje, de la ficha',
              enunciado: 'La perfusión ha mejorado (lactato 1,0), pero la PCP ha subido de 24 a 29 y la presión arterial casi no tiene pulso. ¿Qué está pasando y qué haces?',
              puntos: [
                `El flujo retrógrado del ECMO <span class="hl-rojo">aumenta la poscarga del VI</span>, y puede reducir su gasto y causar edema pulmonar agudo (${p(48)}).`,
                `Se <span class="hl">combina un balón o un Impella con el ECMO</span> para bajar la poscarga, o se drena sangre del VI («venteo», ${p(48)}-49).`],
              explicacion: `Es el problema propio del VA-ECMO: no lo comparten el balón ni el Impella (${p(48)}). En el modelo se ve probando cada combinación: el Impella y el balón bajan la PCP.`,
              nota: `<b>La fuente no lo dice.</b> Marino no da la PCP a partir de la cual actuar ni cuál de las dos combinaciones es mejor; el orden de magnitud de las cifras es del modelo.${enFicha('mc-soporte-mecanico', 'mc-ecmo-poscarga')}` } },
          { momento: 'Día 4', datos: { Exploración: 'pierna de la cánula fría, sin pulso pedio; mueve los dedos y siente el tacto', Aparato: 'ECMO sin cambios' }, nuevo: ['Exploración'],
            pregunta: { id: 'c8r-5', tipo: 'test', fuente: 'mc-ecmo-complic · mc-iabp-complic', modeloVivo: ecmo, origen: 'ilustrativo: la exploración es del paciente; las cifras de complicaciones, de la ficha',
              enunciado: 'La pierna canulada está fría y sin pulso pedio, pero se mueve y siente. Un compañero propone aplicar la regla del pulso pedio. ¿Qué puedes afirmar con la fuente?',
              opciones: [
                { t: 'Isquemia de extremidad en el 17 % del ECMO; la regla sensitivomotora es del balón', ok: true },
                { t: 'Retirar la cánula ya: sin pulso pedio la pierna se pierde, aunque se mueva y sienta', porque: `La pierna conserva movimiento y sensibilidad, y el ECMO es su soporte (${p(48)}); retirarlo sin más la dejaría sin él. ${DED}` },
                { t: 'Nada: sin pérdida sensitivomotora no hay que vigilar la pierna con el ECMO', porque: `En el ECMO la lista incluye isquemia de extremidad (17 %), síndrome compartimental (10 %) y amputación (5 %) (${p(48)}); no vigilarla es no mirar lo que la fuente cuantifica.` }],
              explicacion: `Isquemia de extremidad en el <span class="hl-rojo">17 %</span> del VA-ECMO, compartimental en el 10 % y amputación en el 5 % (${p(48)}). La regla «retirar si se pierde la función sensitivomotora» es del balón (${p(46)}).`,
              nota: `<b>La fuente no lo dice.</b> HUECO: Marino no da la conducta ante la pierna fría con ECMO (reperfusión distal, cirugía vascular). No se rellena aquí: queda para el protocolo del hospital.${enFicha('mc-soporte-mecanico', 'mc-ecmo-complic')}` } },
        ],
        lleva: [
          'El salto de saturación de la aurícula derecha a la arteria pulmonar apunta a la rotura del septo (p. 38).' + enFicha('mc-cardiogenico-fisio', 'mc-septo-rotura'),
          'Si los fármacos no mejoran la perfusión con rapidez, no se retrasa el soporte mecánico (p. 44-45).' + enFicha('mc-soporte-mecanico', 'mc-mcs'),
          'El ECMO veno-arterial oxigena, pero su flujo retrógrado aumenta la poscarga del VI: se combina con balón, Impella o drenaje (p. 48).' + enFicha('mc-soporte-mecanico', 'mc-ecmo-poscarga')],
        volver: { nombre: 'Soporte circulatorio mecánico', ancla: 'mc-mcs', modeloVivo: ecmo } },
    ],
    profundizar: [
      { id: 'mc-impella-efectos', titulo: 'Impella: efectos, supervivencia y complicaciones (hemólisis 5-10 %)' },
      { id: 'mc-mcs-resultados', titulo: 'Resultados: supervivencia del 42 % con VA-ECMO' },
      { id: 'mc-mcs-seleccion', titulo: 'Selección de dispositivo' },
    ],
  },
};
