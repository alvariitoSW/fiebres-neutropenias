// Mayéutica del bloque 3, sub-bloque 3C · Las taquiarritmias, parte 2 (Marino cap. 19): fichas 17 (cardioversión y prevención
// de ictus en la FA) y 18 (TAM, PSVT, TV y torsade de pointes) + el caso C3 de Hugo. Datos puros; formato en b1-fluidos.js.
// Toda la medicina sale de la ficha (js/modules/cardiologia/merino-cardiologia.html) y de su PDF
// (docs/marino-2024-cardiac-disorders-caps18-21.pdf, págs. 25-36); cada pregunta dice dónde con `fuente` y con la página.
const PDF = 'docs/marino-2024-cardiac-disorders-caps18-21.pdf';
const pag = (n, txt) => `<a class="biblio-link" href="${PDF}#page=${n}" target="_blank" rel="noopener">${txt || `PDF pág. ${n}`}</a>`;
const p = n => pag(n, `pág. ${n}`);
// «Ver en la ficha» dentro de una nota (REGLAS §7.9): el enlace cruzado de siempre al párrafo exacto.
const enFicha = (tab, id) => ` <button type="button" class="may-ir" data-especialidad="cardiologia" data-view="merinoCardiologia" data-panel="panel-merino-cardio-tabs" data-tab="${tab}" data-resaltar="#${id}">Ver en la ficha ↗</button>`;
// El corazón eléctrico (ritmo vivo) en un estado que ya existe.
const ritmo = (clave, texto) => ({ ritmoVivo: clave, texto: `⚡ ${texto}` });

export const MAYEUTICA_TAQUI_2 = {
  /* =================================================================================================
     Ficha 17 · FA: cardioversión y prevención del ictus (págs. 25-28)
     ================================================================================================= */
  'mc-fa-cardioversion': {
    entrada: 'Cuándo se cardioverte y con cuánta energía, qué se mira antes, a quién se anticoagula (y a quién no le sirve la tabla), cómo actúa la warfarina y por qué la FA con vía accesoria no se frena en el nodo.',
    guia: [
      { id: 'ccv-g1', corto: 'a quién y cuánto', tipo: 'test', fuente: 'mc-cardioversion', modeloVivo: ritmo('fa', 'La cardioversión de la FA en el corazón eléctrico'),
        enunciado: 'Varón en FA a 150 lpm, con PA 80/50 y confuso. Antes de mirar la ficha: ¿qué haces, y con qué energía si el desfibrilador es bifásico?',
        opciones: [
          { t: 'Cardioversión sincronizada, con una energía fija de 100 J bifásicos', ok: true },
          { t: 'Cardioversión sincronizada de 50 J e ir subiendo de 50 en 50 J hasta que cambie el ritmo', porque: `La ficha prefiere intentos de energía fija frente al enfoque escalonado, y con bifásico 100 J suele bastar. Subir despacio alarga el tiempo de un paciente que ya está hipotenso y confuso (${p(25)}).` },
          { t: 'Choque no sincronizado de 200 J, lo que se da en la arritmia que mata', porque: `En la FA el choque es sincronizado, y 200 J es la energía del monofásico: el bifásico, con 100 J, suele bastar (${p(25)}). Elegir mal la energía es sobrecargar a un paciente inestable.` }],
        explicacion: `La cardioversión sincronizada se reserva para el paciente <span class="hl-rojo">hemodinámicamente inestable</span>. Los choques bifásicos tienen más éxito y piden menos energía: <span class="hl">100 J suele bastar (200 J si es monofásico)</span>, con energía fija mejor que escalonada, y la tasa de éxito es mayor en la FA de inicio reciente (${p(25)}).` },
      { id: 'ccv-g2', corto: 'antes del choque', tipo: 'test', fuente: 'mc-cardioversion',
        enunciado: 'Vas a cardiovertir una FA. ¿Qué compruebas antes y cuándo puedes prescindir de la anticoagulación?',
        opciones: [
          { t: 'Eco para descartar trombos; no hace falta anticoagular si la FA lleva <48 h', ok: true },
          { t: 'La eco solo si la FA es de más de 48 h; si es reciente, la eco sobra y se anticoagula igual', porque: `La ficha pide la ecografía antes de la cardioversión para descartar trombos, siempre. Lo que no se requiere si la FA dura menos de 48 h es la anticoagulación (${p(25)}).` },
          { t: 'El aclaramiento de creatinina: se anticoagula solo si es mayor de 30 mL/min', porque: `El ClCr ajusta la dosis del ACOD (${p(27)}), no decide si se cardioverte. Antes del choque se descartan trombos y, salvo FA de menos de 48 h, se inicia el ACOD lo antes posible, antes o justo después (${p(25)}).` }],
        explicacion: `Se requiere ecografía cardíaca, <span class="hl">transesofágica si el tiempo lo permite</span>, para ver si hay trombos auriculares. El anticoagulante oral directo se empieza lo antes posible (antes o justo después del choque) en los candidatos adecuados; <span class="hl-verde">no es necesario si la FA es nueva y dura menos de 48 h</span> (${p(25)}).` },
      { id: 'ccv-g3', corto: 'puntuar el riesgo', tipo: 'test', fuente: 'mc-tabla-19-2 · mc-cha2ds2-resultado', origen: 'ficha; el caso es inventado',
        enunciado: 'Varón de 74 años, hipertenso y diabético, sin ictus previo ni cardiopatía, con FA persistente. Puntúalo con la calculadora de la ficha (CHA₂DS₂-VASc) si quieres. ¿Cuántos puntos tiene y qué indica la tabla?',
        opciones: [
          { t: '3 puntos: la indicación de anticoagular es definida', ok: true },
          { t: '4 puntos, porque a su edad la tabla da 2', porque: `Los 2 puntos son para más de 75 años; con 74 años solo puntúa el tramo de 65-74, 1 punto (${p(26)}). Contar de más no cambia la conducta aquí, pero en otro paciente anticoagularías sin necesidad.` },
          { t: '2 puntos: solo hay que considerar la anticoagulación', porque: `Faltaría el punto de la edad de 65-74 años; además, en un varón 2 puntos ya es indicación definida: «considerar» es para el varón con 1 punto (${p(26)}). Quedarte en «considerar» deja sin protección a quien tiene un riesgo alto de ictus.` }],
        explicacion: `Tabla 19.2: HTA 1 + diabetes 1 + edad 65-74 años 1 = <span class="hl">3 puntos</span>. La indicación es <span class="hl-rojo">definida con ≥2 puntos en el varón (≥3 en la mujer)</span>; se considera con 1 punto en el varón y 2 en la mujer (${p(26)}).` },
      { id: 'ccv-g4', corto: 'cuando la tabla no vale', tipo: 'test', fuente: 'mc-tabla-19-2-indicacion · mc-doac',
        enunciado: 'La tabla CHA₂DS₂-VASc ayuda a decidir si anticoagular. ¿En qué tipo de FA no sirve?',
        opciones: [
          { t: 'En la FA con insuficiencia cardíaca, porque la IC ya está dentro de la tabla', porque: `La insuficiencia cardíaca puntúa 1 en la tabla: es uno de sus ítems, no una excepción (${p(26)}). Saltarte la tabla en estos pacientes es perder un punto de riesgo.` },
          { t: 'En la FA valvular (estenosis mitral o prótesis): se anticoagula siempre', ok: true },
          { t: 'En la FA con aclaramiento de creatinina menor de 30: la anticoagulación se contraindica', porque: `El ClCr bajo obliga a reducir la dosis o, por debajo de 15, a evitar los ACOD (${p(27)}); no aparece entre las contraindicaciones, que son hemorragia activa, hemorragia intracerebral previa, tumor intracraneal, sangrado recurrente de una lesión presente y plaquetas menores de 50.000 (${p(26)}).` }],
        explicacion: `La tabla <span class="hl-rojo">no se aplica a la FA valvular</span> (estenosis mitral o válvula protésica): ahí se anticoagula siempre, sin calcular nada, y la warfarina sigue siendo superior a los ACOD (${p(26)}, ${p(27)}).` },
      { id: 'ccv-g5', corto: 'la warfarina', tipo: 'test', fuente: 'mc-warfarina · mc-tabla-19-3', modeloVivo: { vasoVivo: 'warfarina', texto: '🩹 La warfarina en el vaso que sangra' },
        enunciado: 'Predice, y luego lo ves en la lupa de la cascada del vaso: ¿sobre qué actúa la warfarina y por qué se vigila con el INR?',
        opciones: [
          { t: 'Bloquea el factor Xa ya circulante, como un ACOD; el INR mide ese bloqueo', porque: `Eso hacen los anticoagulantes orales directos de la Tabla 19.3 (${p(27)}), que se dan a dosis fija sin controlar la hemostasia. La warfarina actúa antes: frena la síntesis de los factores dependientes de vitamina K (${p(26)}), y por eso se ajusta con el INR.` },
          { t: 'Frena la síntesis de II, VII, IX y X (vitamina K); ventana estrecha: se vigila con el INR', ok: true },
          { t: 'Inhibe la trombina ya formada, como la heparina, y el INR mide ese efecto directo', porque: `Actúa antes, frenando la síntesis de los factores dependientes de vitamina K (${p(26)}); no inhibe la trombina ya formada. Pensar que lo hace te llevaría a esperar un efecto inmediato en vez del retraso propio de bajar los factores.` }],
        explicacion: `La warfarina <span class="hl-azul">inhibe la síntesis de los factores dependientes de vitamina K (II, VII, IX y X)</span> y reduce el ictus hasta un 65 %. Su <span class="hl-rojo">ventana terapéutica es estrecha</span> (riesgo de anticoagulación insuficiente o excesiva), así que exige controles rutinarios con el INR (${p(26)}); la dosis habitual de inicio es 5 mg/día, ajustada a un INR de 2-3 (${p(27)}).` },
      { id: 'ccv-g6', corto: 'WPW con FA', tipo: 'test', fuente: 'mc-wpw', modeloVivo: ritmo('wpw', 'El WPW y su FA en el corazón eléctrico (pulsa «FA» en su panel)'), origen: 'ficha; la frecuencia de 207 lpm es la del modelo (ilustrativo)',
        enunciado: 'Paciente con ondas delta que entra en FA a 207 lpm con QRS ancho. Quieres bajar la frecuencia: ¿qué pasa si bloqueas el nodo AV con diltiazem, betabloqueante o digoxina?',
        opciones: [
          { t: 'Baja la frecuencia ventricular, porque todo impulso debe pasar por el nodo', porque: `En el WPW los impulsos van también por la vía accesoria, que esos fármacos no bloquean: lo probable es que la frecuencia ventricular no baje (${pag(27, 'pág. 27-28')}).` },
          { t: 'Probablemente no frena la frecuencia, y puede precipitar una FV'+' al bloquear solo el nodo', ok: true },
          { t: 'La digoxina sí es segura, porque no es un antagonista del calcio', porque: `La lista de los que no se deben usar incluye antagonistas del calcio, betabloqueantes y digoxina: los tres bloquean el nodo AV (${pag(27, 'pág. 27-28')}).` }],
        explicacion: `Con una vía accesoria, los fármacos que bloquean el nodo AV <span class="hl-rojo">no deben usarse</span>. El manejo preferido es la <span class="hl">cardioversión eléctrica</span>, o farmacológica con <span class="hl">amiodarona o procainamida</span> (${pag(27, 'pág. 27-28')}). En el modelo, el diltiazem en ese panel lleva el sello de peligro por la FV.` },
    ],
    examen: [
      { id: 'ccv-e1', corto: 'la energía', tipo: 'test', fuente: 'mc-cardioversion',
        enunciado: 'Una FA inestable se cardioverte con un desfibrilador bifásico. ¿Qué pauta de energía es la que recomienda la ficha?',
        opciones: [
          { t: 'Intentos de energía fija, habitualmente con 100 J en el bifásico', ok: true },
          { t: 'Empezar en 50 J y escalar, porque cuanta menos energía, menos daño miocárdico', porque: `La ficha considera más eficaces los intentos de energía fija que el escalonado; con bifásico suele bastar 100 J (${p(25)}). Escalar desde poco solo retrasa el ritmo sinusal en un paciente inestable.` },
          { t: '200 J fijos, porque el bifásico necesita más energía que el monofásico', porque: `Es al revés: el bifásico tiene mayor éxito y pide menos energía; 200 J es la cifra del monofásico (${p(25)}).` }],
        explicacion: `Bifásico: <span class="hl">100 J suele bastar</span>; monofásico: 200 J; mejor energía fija que escalonada, y el éxito es mayor cuanto más reciente es la FA (${p(25)}).` },
      { id: 'ccv-e2', corto: 'contraindicaciones', tipo: 'test', fuente: 'mc-tabla-19-2-indicacion',
        enunciado: 'Varón de 78 años con indicación definida de anticoagular. ¿Cuál de estos hallazgos sí contraindica la anticoagulación?',
        opciones: [
          { t: 'Una historia de caídas frecuentes', porque: `La ficha lo dice expresamente: la historia de caídas no es una contraindicación (${p(26)}). Negar el ACOD por miedo a una caída deja sin protección frente al ictus a quien tiene un riesgo definido.` },
          { t: 'Plaquetas de 40.000/μL en la analítica', ok: true },
          { t: 'Estenosis mitral significativa', porque: `Es justo lo contrario: la FA valvular se anticoagula siempre (${p(26)}). No hacerlo expone a ese paciente al ictus que la tabla quería evitar.` }],
        explicacion: `Contraindican: hemorragia activa, hemorragia intracerebral previa, tumor intracraneal, sangrado recurrente de una lesión que sigue ahí y <span class="hl-rojo">plaquetas <50.000/μL</span>. <span class="hl">Las caídas no</span> (${p(26)}).` },
      { id: 'ccv-e3', corto: 'el dabigatrán', tipo: 'test', fuente: 'mc-tabla-19-3 · mc-r5-nota-dabigatran', origen: 'ficha técnica del dabigatrán (150 mg); la dosis estándar impresa en el libro es una errata',
        enunciado: 'En la Tabla 19.3 del libro, la fila del dabigatrán imprime «dosis estándar: 50 mg BID». ¿Qué dosis estándar es la que corresponde?',
        opciones: [
          { t: '150 mg cada 12 h (110 mg si edad ≥80 años o ClCr <30)', ok: true },
          { t: '50 mg cada 12 h, que es lo que imprime la tabla del libro para la dosis estándar', porque: `Es la errata: la propia fila da 110 mg como dosis reducida, y la estándar no puede ser menor que la reducida. Con 50 mg el paciente quedaría infratratado (${p(27)}).` },
          { t: '110 mg cada 12 h para todos los pacientes', porque: `110 mg es la dosis reducida, solo para edad ≥80 años o ClCr <30 mL/min (${p(27)}). Darla a todos protege menos al que podía recibir la estándar.` }],
        explicacion: `Dabigatrán: estándar <span class="hl">150 mg BID</span>; reducida 110 mg BID si edad ≥80 o ClCr <30 (${p(27)}).`,
        nota: `<b>Errata de la fuente.</b> La Tabla 19.3 (${pag(27)}) imprime «Standard Dose: 50 mg BID». La dosis reducida de la misma fila es 110 mg BID, así que se trata de una errata; la ficha muestra la dosis habitual, 150 mg BID. <b>La cifra de 150 mg no figura en el libro</b>: se corrige por coherencia interna de la fila (la estándar no puede ser menor que la reducida), y la ficha técnica de EE. UU. del dabigatrán da, para ClCr >30 mL/min, «150 mg orally, twice daily» (<a class="biblio-link" href="https://hemonc.org/docs/packageinsert/dabigatran.pdf" target="_blank" rel="noopener">ficha técnica, apartado 2.1</a>). La reducción a 110 mg del libro no sale en esa ficha: es lo que imprime Marino.` + enFicha('mc-fa-cardioversion', 'mc-r5-nota-dabigatran') },
      { id: 'ccv-e4', corto: 'el apixabán', tipo: 'test', fuente: 'mc-tabla-19-3 · mc-doac · mc-nota-acod-renal',
        enunciado: '¿Cómo se reduce el apixabán en la FA según el libro, y cuál es el problema?',
        opciones: [
          { t: 'Solo con ClCr <30, como pide el texto, y la tabla lo confirma con el mismo criterio para todos', porque: `La tabla no menciona el ClCr para el apixabán: lo reduce por otros criterios. Quien lo dosifica solo por el ClCr se salta los que da la tabla (${p(27)}).` },
          { t: 'Con cualquiera de los tres: edad ≥80 años, peso ≤60 kg o creatinina ≥1,5 mg/dL, basta con uno', porque: `La tabla pide 2 de esos 3, no uno. Reducir con uno solo le dejaría menos dosis de la necesaria (${p(27)}).` },
          { t: '2 de 3 criterios según la tabla; el texto pide ClCr <30: no se concilian', ok: true }],
        explicacion: `Apixabán: <span class="hl">5 mg BID; 2,5 mg BID con 2 de 3</span> (edad ≥80, peso ≤60 kg, Cr ≥1,5 mg/dL). El texto dice que todos los ACOD se reducen con ClCr <30 y se evitan con ClCr <15 (${p(27)}).`,
        nota: `<b>La fuente no lo concilia.</b> El texto de la ${pag(27, 'pág. 27')} dice que todos los ACOD requieren reducción con ClCr <30; la Tabla 19.3, en la misma página, no cita el ClCr para el apixabán. Se muestran las dos y no se elige una.` + enFicha('mc-fa-cardioversion', 'mc-nota-acod-renal') },
      { id: 'ccv-e5', corto: 'el plan del R1', tipo: 'error', fuente: 'mc-tabla-19-2-indicacion · mc-doac · mc-warfarina',
        enunciado: 'Una mujer de 79 años con estenosis mitral significativa, en FA, se ha caído dos veces este año. Plan del residente de guardia. Hay dos errores: encuéntralos.',
        frases: [
          { t: 'Es una FA valvular por la estenosis mitral: se anticoagula siempre, sin calcular la puntuación.' },
          { t: 'Prefiero un ACOD: dosis fija y sin controles.', mal: true, c: `En la FA valvular <span class="hl-rojo">la warfarina sigue siendo superior</span> a los ACOD (${p(27)}).` },
          { t: 'Se ha caído dos veces: mejor no anticoagular.', mal: true, c: `Las caídas <span class="hl">no son una contraindicación</span> (${p(26)}).` },
          { t: 'Las plaquetas son de 180.000: no hay contraindicación hematológica.' },
          { t: 'Con warfarina vigilaré el INR, con objetivo 2-3.' }],
        explicacion: `Estenosis mitral: la tabla no aplica y se anticoagula; con warfarina (INR 2-3), y las caídas no lo impiden (${p(26)}, ${p(27)}).` },
      { id: 'ccv-e6', corto: 'el riñón', tipo: 'test', fuente: 'mc-doac',
        enunciado: 'Una paciente con FA no valvular y aclaramiento de creatinina de 12 mL/min. ¿Qué dice la ficha sobre los ACOD?',
        opciones: [
          { t: 'Evitarlos con ClCr <15; la actividad anti-Xa puede medirse', ok: true },
          { t: 'Que a cualquier ClCr son seguros a dosis plena, porque las dosis son fijas', porque: `Las dosis son fijas, sin monitorizar la hemostasia, pero los ACOD requieren reducción con ClCr <30 y se evitan por debajo de 15 (${p(27)}). Plena dosis en una paciente con ClCr 12 es acumular fármaco.` },
          { t: 'Que solo el dabigatrán necesita ajuste con el ClCr', porque: `También el rivaroxabán y el edoxabán se reducen con ClCr <30 según la tabla; y el texto pide reducir todos (${p(27)}). Ajustar uno solo deja a los otros sobredosificados.` }],
        explicacion: `ACOD: reducir con ClCr <30 y <span class="hl-rojo">evitar con ClCr <15</span> (fallo renal terminal). En la insuficiencia renal pueden medirse niveles de actividad anti-Xa (${p(27)}).` },
    ],
    casos: [
      { id: 'c2s', titulo: 'Nieves, 79 años: la FA que se cardiovirtió', corto: 'Caso · Nieves (FA)', sub: 'FA de inicio reciente, choque y anticoagulación',
        paciente: { Edad: '79 años, mujer', Peso: '62 kg', Antecedentes: 'HTA e insuficiencia cardíaca con FEVI conservada; creatinina 1,9', Motivo: 'Ingresada en planta por una infección; el monitor ve entrar la FA' },
        pasos: [
          { momento: 'Día 3 · 19:50', datos: { ECG: 'FA, FC 140, QRS 0,08 s, irregular; empezó hace 1 h (la registró el monitor)', Constantes: 'PA 126/72, consciente, sin dolor' }, nuevo: ['ECG', 'Constantes'],
            pregunta: { id: 'c2s-1', tipo: 'test', fuente: 'mc-cardioversion', modeloVivo: ritmo('fa', 'La FA en el corazón eléctrico'),
              enunciado: 'Nieves está en FA a 140 desde hace una hora, con 126/72. ¿Cardiovertes ya?',
              opciones: [
                { t: 'Sí, 100 J sincronizados: lleva menos de 48 h y es el momento de mayor éxito', porque: `La cardioversión sincronizada se reserva a los pacientes hemodinámicamente inestables (${p(25)}). Nieves mantiene 126/72: un choque sin indicación la somete a una sedación y a una descarga que no necesita.` },
                { t: 'No: está estable; se frena la frecuencia y el choque se guarda por si se inestabiliza', ok: true },
                { t: 'No, hasta anticoagularla con un ACOD durante unas semanas', porque: `La ficha no pide esperar para cardiovertir: la anticoagulación no es necesaria si la FA lleva menos de 48 h (${p(25)}). Y esperar con un ritmo a 140 en una cardiópata es dejarla sin tratamiento.` }],
              explicacion: `La cardioversión se reserva para el <span class="hl-rojo">paciente hemodinámicamente inestable</span> (${p(25)}); con 126/72 se controla la frecuencia como en la ficha anterior.` } },
          { momento: 'Día 3 · 21:30', datos: { ECG: 'FA, FC 150', Constantes: 'PA 78/44, confusa, fría' }, nuevo: ['ECG', 'Constantes'],
            pregunta: { id: 'c2s-2', tipo: 'test', fuente: 'mc-cardioversion', modeloVivo: ritmo('fa', 'La cardioversión de la FA en el corazón eléctrico'), origen: 'ficha; las constantes del caso son ilustrativas',
              enunciado: 'Es el giro: Nieves ha pasado a 78/44 y está confusa. ¿Qué haces y con qué energía, con un desfibrilador bifásico?',
              opciones: [
                { t: 'Cardioversión sincronizada con una energía fija de 100 J', ok: true },
                { t: 'Subir el diltiazem hasta bajar de 100 lpm', porque: `Con 78/44 el diltiazem, limitado ya por la hipotensión en el 20-30 % (${p(22)}), empeora la presión. La inestabilidad se trata con el choque (${p(25)}).` },
                { t: 'Choque no sincronizado de 360 J, como en una parada', porque: `En la FA el choque es sincronizado, y con bifásico 100 J suele bastar (${p(25)}). Un choque no sincronizado puede caer en un latido vulnerable y desencadenar una FV.` }],
              explicacion: `Inestable → <span class="hl-rojo">cardioversión sincronizada</span>; bifásico: <span class="hl">100 J suele bastar</span>, con energía fija mejor que escalonada (${p(25)}).`,
              nota: `<b>La fuente no lo dice así.</b> El riesgo de que un choque no sincronizado caiga en un latido vulnerable es fisiología general; la ficha solo dice que la cardioversión es sincronizada (${p(25)}).` } },
          { momento: 'Día 3 · 21:45', datos: { ECG: 'ritmo sinusal 84', Constantes: 'PA 118/70, lúcida' }, nuevo: ['ECG', 'Constantes'],
            pregunta: { id: 'c2s-3', tipo: 'destapa', cuantas: 'son dos cosas', fuente: 'mc-cardioversion',
              enunciado: 'El adjunto pregunta: «con tiempo, ¿qué se hace antes del choque, y por qué hoy no hizo falta anticoagular antes?». Tu respuesta tiene dos partes.',
              puntos: [
                `Antes del choque se pide una <span class="hl">ecografía cardíaca</span> (<span class="hl">transesofágica si el tiempo lo permite</span>) para descartar trombos auriculares.`,
                `La anticoagulación oral previa <span class="hl-verde">no es necesaria si la FA lleva menos de 48 h</span>: la de Nieves, 2 h.`],
              explicacion: `Las dos cosas están en el mismo párrafo (${p(25)}). Hoy no hubo tiempo para la eco por la inestabilidad: es el motivo de que la rapidez mande sobre el protocolo.`,
              nota: `<b>La fuente no lo dice.</b> Que en una inestable no haya tiempo para la eco es una deducción: la ficha dice «si el tiempo lo permite» para la vía transesofágica (${p(25)}).` } },
          { momento: 'Día 4 · 09:00', datos: { Factores: 'HTA, insuficiencia cardíaca, 79 años, mujer', ECG: 'sigue en sinusal' }, nuevo: ['Factores', 'ECG'], calculadora: { ir: 'mc-cha2ds2-resultado', nombre: 'CHA₂DS₂-VASc' },
            pregunta: { id: 'c2s-4', tipo: 'test', fuente: 'mc-tabla-19-2 · mc-tabla-19-2-indicacion',
              enunciado: 'Abre la calculadora si quieres. ¿Cuántos puntos tiene Nieves y qué indica la tabla en una mujer?',
              opciones: [
                { t: '3 puntos: es la cifra mínima para una indicación definida en la mujer', porque: `Faltan puntos: HTA 1 + insuficiencia cardíaca 1 + edad >75 años 2 + sexo femenino 1 suman 5 (${p(26)}). Quedarte en 3 subestima su riesgo, aunque la conducta sea la misma.` },
                { t: '4 puntos: la edad >75 años solo suma 1', porque: `La edad >75 años suma 2; solo la franja de 65-74 suma 1 (${p(26)}). Con 4 pensarías que el sexo femenino no cuenta.` },
                { t: '5 puntos: indicación definida de anticoagular', ok: true }],
              explicacion: `Tabla 19.2 (${p(26)}): insuficiencia cardíaca 1 + HTA 1 + edad >75 años 2 + sexo femenino 1 = <span class="hl-verde">5</span>. En la mujer es definida con ≥3 (considerar con 2). Riesgo de ictus al menos 5 veces mayor (${p(26)}).` } },
          { momento: 'Día 4 · 11:00', datos: { Analítica: 'plaquetas 42.000/μL', Pregunta: 'el adjunto: ¿empiezas el ACOD?' }, nuevo: ['Analítica', 'Pregunta'],
            pregunta: { id: 'c2s-5', tipo: 'test', fuente: 'mc-tabla-19-2-indicacion', origen: 'ficha; la cifra de plaquetas es del caso',
              enunciado: 'La analítica trae plaquetas de 42.000/μL. Con una puntuación de 5, ¿qué haces con la anticoagulación?',
              opciones: [
                { t: 'La empiezo ya: con 5 puntos la indicación es definida y manda sobre la analítica', porque: `Las plaquetas por debajo de 50.000 son una contraindicación (${p(26)}). La puntuación dice a quién conviene anticoagular, no sobrepasa una contraindicación; con 42.000 se arriesga un sangrado.` },
                { t: 'No la empiezo mientras sigan por debajo de 50.000: es una contraindicación', ok: true },
                { t: 'La empiezo con la mitad de la dosis para compensar el riesgo', porque: `La ficha reduce la dosis de los ACOD por función renal (${p(27)}), no por plaquetas; una dosis reducida no hace que la contraindicación desaparezca.` }],
              explicacion: `Contraindican: hemorragia activa, hemorragia intracerebral previa, tumor intracraneal, sangrado recurrente de una lesión presente y <span class="hl-rojo">plaquetas <50.000</span> (${p(26)}).`,
              nota: `<b>La fuente no lo dice.</b> El libro no da la causa de esas plaquetas ni cuándo reiniciar: «reevaluarla cuando suban» es una deducción de que la contraindicación depende de la cifra (${p(26)}).` } },
          { momento: 'Día 4 · la nota del R1', datos: { 'Nota del R1': 'resumen del episodio' }, nuevo: ['Nota del R1'],
            pregunta: { id: 'c2s-6', tipo: 'error', fuente: 'mc-cardioversion · mc-tabla-19-2-indicacion · mc-doac',
              enunciado: 'La nota del R1 sobre Nieves. Encuentra los errores.',
              frases: [
                { t: 'Cardioversión sincronizada con 100 J bifásicos por inestabilidad hemodinámica.' },
                { t: 'No se anticoaguló antes del choque porque la FA llevaba menos de 48 h.' },
                { t: 'Con 5 puntos y plaquetas de 42.000, se anticoagula igual: la puntuación es lo que cuenta.', mal: true, c: `Las plaquetas <50.000 son una <span class="hl-rojo">contraindicación</span> (${p(26)}).` },
                { t: 'Cuando se anticoagule, un ACOD a dosis fija vale: no se ajusta por la función renal.', mal: true, c: `Los ACOD <span class="hl">se reducen con ClCr <30</span> y se evitan con ClCr <15 (${p(27)}); Nieves tiene creatinina 1,9.` }],
              explicacion: 'Dos errores: anticoagular con plaquetas <50.000 y olvidar el ajuste renal de los ACOD.' } },
        ],
        lleva: [
          'La cardioversión sincronizada se reserva a la FA inestable: 100 J bifásicos, energía fija. Estable, se frena la frecuencia.',
          'Con una FA de menos de 48 h no hace falta anticoagular antes del choque; después, la puntuación (aquí 5 en la mujer) decide.',
          'Las plaquetas <50.000 contraindican anticoagular aunque la puntuación sea alta, y los ACOD se ajustan con el aclaramiento de creatinina.'],
        volver: { nombre: 'Cardioversión eléctrica', ancla: 'mc-cardioversion', modelo: ritmo('fa', 'La cardioversión de la FA en el corazón eléctrico') } },
    ],
    profundizar: [
      { id: 'mc-doac', titulo: 'Los ACOD frente a la warfarina y los niveles anti-Xa' },
    ],
  },

  /* =================================================================================================
     Ficha 18 · Otras taquiarritmias: TAM, PSVT, TV y torsade (págs. 28-36)
     ================================================================================================= */
  'mc-otras-taqui': {
    entrada: 'La TAM y su magnesio, la PSVT y la adenosina, cómo se distingue la TV del QRS ancho aberrante, y la torsade con su QT largo.',
    guia: [
      { id: 'otq-g1', corto: 'la TAM', tipo: 'test', fuente: 'mc-tam', modeloVivo: ritmo('tam', 'La TAM en el corazón eléctrico'),
        enunciado: 'Mujer de 72 años con EPOC, taquicardia irregular con ondas P de varias formas (TAM) y magnesio sérico normal. Antes de mirar la ficha: ¿qué haces primero?',
        opciones: [
          { t: 'Magnesio empírico, aunque el nivel sérico sea normal, y corregir el K⁺', ok: true },
          { t: 'Nada de magnesio, porque el nivel es normal; metoprolol directamente', porque: `El Mg sérico puede ser normal con el magnesio corporal total deplecionado, y el estudio dio un 88 % de conversión independiente del nivel. Además, con EPOC el metoprolol (tercer escalón: 1.º electrolitos, 2.º magnesio) preocupa (${p(28)}).` },
          { t: 'Cardioversión eléctrica sincronizada, porque es una taquicardia de mal pronóstico', porque: `La TAM es una arritmia obstinada, a menudo refractaria, y el manejo que da la ficha es corregir electrolitos y dar magnesio (${p(28)}).` }],
        explicacion: `1.º corregir hipomagnesemia e hipopotasemia (si coexisten, el magnesio antes que el potasio); 2.º <span class="hl">Mg empírico: 2 g en 15 min y luego 6 g en 6 h</span>, con un 88 % de conversión a sinusal en un estudio, independiente del nivel sérico (${p(28)}).` },
      { id: 'otq-g2', corto: 'el inicio brusco', tipo: 'test', fuente: 'mc-psvt', modeloVivo: ritmo('nodal', 'La reentrada nodal en el corazón eléctrico'),
        enunciado: 'La taquicardia por reentrada (PSVT) empieza de golpe, sin avisar. Predice: ¿por qué?',
        opciones: [
          { t: 'Un latido ectópico dispara un circuito de reentrada ya preparado', ok: true },
          { t: 'El nodo sinusal acelera su frecuencia por un exceso de catecolaminas', porque: `Eso sería una taquicardia sinusal. En la PSVT el ritmo se mantiene por un circuito de reentrada y lo característico es su inicio abrupto tras un impulso ectópico (${pag(28, 'pág. 28-29')}). Buscar la causa sistémica te haría perder el tiempo.` },
          { t: 'Un bloqueo de rama transitorio ensancha el QRS y acelera la conducción', porque: `La PSVT es una taquicardia de QRS estrecho (${p(28)}); el QRS ancho por una rama bloqueada es la aberrancia. Confundirlas lleva a tratarla como TV.` }],
        explicacion: `Mecanismo: <span class="hl-azul">reentrada</span>. El enlentecimiento de una vía crea una diferencia de periodo refractario y el impulso vuelve por la otra, en circuito. Lo desencadena un impulso auricular ectópico: de ahí el inicio abrupto. La AVNRT es la más común (50-60 %), FC 140-250, sin cardiopatía (${pag(28, 'pág. 28-29')}).` },
      { id: 'otq-g3', corto: 'las vagales', tipo: 'test', fuente: 'mc-psvt', modeloVivo: ritmo('nodal', 'Las maniobras vagales en la reentrada nodal'),
        enunciado: 'Antes de la adenosina se prueban maniobras vagales. Predice: ¿cuál de las tres sale mejor?',
        opciones: [
          { t: 'El masaje del seno carotídeo, 24 %, y sin riesgos', porque: `El masaje es el peor, un 9 %, y exige excluir soplos carotídeos (${p(29)}). Perder minutos en la peor maniobra retrasa la adenosina.` },
          { t: 'La Valsalva convencional, 44 %', porque: `La convencional da un 24 %; el 44 % es de la modificada, que añade elevar las piernas tras la maniobra (${p(29)}). Quedarte en la convencional es renunciar a casi el doble de éxito.` },
          { t: 'Valsalva modificada (piernas elevadas), 44 %', ok: true }],
        explicacion: `Éxito limitado: <span class="hl">Valsalva convencional 24 %, masaje carotídeo 9 % y Valsalva modificada 44 %</span> (${p(29)}). Si fallan, la adenosina.` },
      { id: 'otq-g4', corto: 'la adenosina', tipo: 'test', fuente: 'mc-adenosina · mc-tabla-19-4', modeloVivo: ritmo('nodal', 'La adenosina en la reentrada nodal'),
        enunciado: 'Predice: ¿cómo das la adenosina en una PSVT por vena periférica, y qué cambia si el único acceso es un catéter central?',
        opciones: [
          { t: '6 mg en bolo rápido con lavado; 12 mg a los 2 min; por vía central, la mitad', ok: true },
          { t: '12 mg de entrada por vena periférica para no repetir, y la misma dosis por vía central', porque: `La pauta empieza con 6 mg; solo si a los 2 min no hay respuesta se da 12 (${p(30)}). Y por vía central se reduce un 50 %: se ha descrito asistolia ventricular con la dosis estándar (${p(30)}).` },
          { t: '6 mg en infusión lenta durante 10 min, porque su efecto es de 1-2 min', porque: `Su efecto dura solo 1-2 min y por eso la pauta es un bolo rápido con lavado de salino (${p(30)}), no una infusión lenta.` }],
        explicacion: `Adenosina: inicio <30 s, bloqueo AV transitorio que corta la reentrada, efecto de 1-2 min, >90 % de éxito. <span class="hl">6 mg → 12 mg (repetible una vez)</span>, <span class="hl-rojo">−50 % por vena cava superior o con antagonistas del calcio, betabloqueantes o dipiridamol</span> (${pag(29, 'pág. 29-30')}).` },
      { id: 'otq-g5', corto: 'ancho y cardiópata', tipo: 'test', fuente: 'mc-tv-vs-svt · mc-tv', modeloVivo: ritmo('tv', 'La TV en el corazón eléctrico'),
        enunciado: 'Varón de 66 años con un infarto previo, taquicardia regular a 160 lpm con QRS ancho, estable. Sin más datos del ECG, ¿qué es hasta que se demuestre lo contrario?',
        opciones: [
          { t: 'Una taquicardia supraventricular con bloqueo de rama previo: son las más frecuentes', porque: `Con cardiopatía conocida, la TV causa el 95 % de las taquicardias de QRS ancho; la ficha manda tratarla como TV probable (${pag(31, 'pág. 31-32')}). Tratarla como supraventricular retrasa lo que necesita.` },
          { t: 'Una TV: causa el 95 % de las de QRS ancho cuando hay cardiopatía', ok: true },
          { t: 'Una FA con aberrancia, porque la FA es la más frecuente en la UCI', porque: `La FA rápida con conducción AV prolongada <b>puede parecer regular</b> (${pag(35, 'pág. 35-36')}), así que la regularidad no la descarta. Lo que decide es la cardiopatía: con ella, la TV causa el 95 % de las de QRS ancho (${p(32)}). Que la FA sea la más frecuente en la UCI (${p(36)}) no cambia ese criterio.` }],
        explicacion: `Sin evidencia definitiva en el ECG, la cardiopatía de base decide: <span class="hl-rojo">la TV causa el 95 % de las de QRS ancho en cardiópatas</span>. Las claves del ECG que la identifican: <span class="hl">disociación AV</span> y <span class="hl">latidos de fusión</span> (${pag(31, 'pág. 31-32')}).` },
      { id: 'otq-g6', corto: 'si dudas', tipo: 'test', fuente: 'mc-fig-19-8 · mc-tv-vs-svt', modeloVivo: ritmo('aberrancia', 'La adenosina ante un QRS ancho aberrante'),
        enunciado: 'QRS ancho regular, sin compromiso hemodinámico, y no sabes si es una TV o una supraventricular aberrante. ¿Qué prueba, y qué esperas ver?',
        opciones: [
          { t: 'Verapamilo IV: corta las dos y se sabe cuál era por la respuesta', porque: `No está en el algoritmo de la Fig. 19.8, y es un inotrópico negativo potente, no recomendado con la fracción de eyección reducida (${p(28)}), la situación típica del cardiópata con TV.` },
          { t: 'Adenosina: cede la PSVT, no la TV; si no responde, TV y amiodarona', ok: true },
          { t: 'Cardioversión sincronizada de 100 J, porque ante la duda se descarga', porque: `La cardioversión es para el paciente con compromiso hemodinámico (${p(32)}). Sin él, la duda se resuelve con adenosina; un choque sin indicación no es el escalón para un paciente estable.` }],
        explicacion: `Fig. 19.8: <span class="hl-rojo">compromiso hemodinámico → cardioversión sincronizada</span>; sin compromiso y TV cierta → <span class="hl">amiodarona</span>; sin compromiso y TV incierta → <span class="hl">adenosina</span>, que termina la mayoría de las PSVT pero no la TV; si es refractaria, el diagnóstico probable es TV y se da amiodarona (${pag(32, 'pág. 32-33')}).` },
      { id: 'otq-g7', corto: 'el QT largo', tipo: 'test', fuente: 'mc-torsade · mc-tabla-19-5', modeloVivo: ritmo('torsade', 'El QT largo y la torsade en el corazón eléctrico'),
        enunciado: 'Una paciente de UCI tiene un QTc de 0,58 s. Predice: ¿cuál de estas combinaciones suma más riesgo de torsade?',
        opciones: [
          { t: 'Adenosina y diltiazem en bolo, con el potasio en el rango normal', porque: `Ninguno está en la Tabla 19.5, y con potasio normal tampoco hay una alteración que prolongue el QT (${p(34)}). Culpar a lo que no es deja el factor real sin tocar.` },
          { t: 'Calcio alto y magnesio alto en sangre, con un QT que ya era largo', porque: `Son la hipocalcemia, la hipomagnesemia y la hipopotasemia las que prolongan el QT (${p(34)}). Corregir lo que está alto no protege.` },
          { t: 'Haloperidol y claritromicina, con el potasio bajo en sangre', ok: true }],
        explicacion: `Tabla 19.5: <span class="hl-rojo">haloperidol</span> (neurolépticos) y <span class="hl-rojo">claritromicina</span> (antimicrobianos), además de antiarrítmicos Ia y III, droperidol, metadona, etc. Y los electrolitos: <span class="hl">hipopotasemia, hipocalcemia e hipomagnesemia</span> (${p(34)}).` },
      { id: 'otq-g8', corto: 'torsade sin pulso', tipo: 'destapa', cuantas: 'son tres cosas', fuente: 'mc-tv-polimorfica', modeloVivo: ritmo('torsade', 'La torsade de pointes en el corazón eléctrico'),
        enunciado: 'Una torsade sostenida, sin pulso. El adjunto pregunta: «¿qué haces, ahora y para que no vuelva?».',
        puntos: [
          `Desfibrilar, <span class="hl-rojo">no sincronizado</span>: la TV polimórfica sostenida lo requiere.`,
          `Magnesio IV, <span class="hl">1-2 g de MgSO₄ en 15 min</span> (ACLS; sin consenso de dosis), combinable con el choque.`,
          `Prevenir recaídas: <span class="hl-azul">corregir el potasio y el magnesio bajos y retirar los fármacos de alto riesgo</span> (p. ej. haloperidol).`],
        explicacion: `Si la TV polimórfica tiene el QT normal, su condición predisponente es la isquemia, y la ficha propone amiodarona o betabloqueantes para prevenir recurrencias (${p(35)}).` },
    ],
    examen: [
      { id: 'otq-e1', corto: 'dosis de Mg', tipo: 'test', fuente: 'mc-tam',
        enunciado: 'Anciana con EPOC y TAM refractaria, con Mg sérico normal. ¿Qué pauta de magnesio recoge la ficha?',
        opciones: [
          { t: '1-2 g de MgSO₄ en 15 min y nada más, porque el nivel es normal', porque: `Esa es la dosis de la torsade, no de la TAM (${p(35)}). Para la TAM es 2 g en 15 min más 6 g en 6 h, con un 88 % de éxito independiente del nivel sérico (${p(28)}).` },
          { t: '2 g en 50 mL de salino en 15 min y después 6 g en 500 mL en 6 h', ok: true },
          { t: 'Solo si el magnesio sérico es bajo; si es normal, no hay nada que reponer', porque: `El magnesio sérico puede ser normal con el total deplecionado, y el efecto fue independiente del nivel sérico (${p(28)}). Esperar a que baje el nivel es dejar la arritmia sin tratar.` }],
        explicacion: `<span class="hl">2 g de MgSO₄ en 15 min y 6 g en 6 h</span>: 88 % de conversión a sinusal en un estudio (${p(28)}).` },
      { id: 'otq-e2', corto: 'metoprolol o verapamilo', tipo: 'test', fuente: 'mc-tam · mc-r5-nota-verapamilo',
        enunciado: 'La TAM no cede con magnesio. Si no hay EPOC se pasa a un betabloqueante; si el metoprolol preocupa por la EPOC, ¿qué opción da la ficha y con qué reserva?',
        opciones: [
          { t: 'Verapamilo: <50 % de conversión, frena la frecuencia, no en HFrEF', ok: true },
          { t: 'Verapamilo: convierte el 80 % y es seguro en la insuficiencia cardíaca', porque: `El 80 % es del metoprolol; el verapamilo convierte menos del 50 % y es un inotrópico negativo potente, no recomendado con la fracción de eyección reducida (${p(28)}).` },
          { t: 'Más magnesio, pues el verapamilo no frena la frecuencia ventricular', porque: `El verapamilo sí puede frenar la frecuencia ventricular aunque no convierta (${p(28)}). Insistir con magnesio una vez fallada la pauta retrasa el control.` }],
        explicacion: `Metoprolol: 80 % de éxito. Verapamilo: <span class="hl">0,25-5 mg IV en 2 min</span>, repetible cada 15-30 min hasta 20 mg, <50 % de conversión (${p(28)}).`,
        nota: `<b>Errata probable, la fuente no lo dice.</b> El libro (${pag(28)}) imprime «0.25–5 mg IV over 2 min», un rango muy amplio; podría ser 2,5 mg, pero no lo dice y se reproduce tal cual.` + enFicha('mc-otras-taqui', 'mc-r5-nota-verapamilo') },
      { id: 'otq-e3', corto: 'ajuste de adenosina', tipo: 'test', fuente: 'mc-adenosina · mc-tabla-19-4',
        enunciado: 'Un paciente con PSVT recibe dipiridamol de forma concomitante y no hay otro acceso que la vena cava superior. ¿Qué haces con la adenosina?',
        opciones: [
          { t: 'Reducir un 50 %: por el catéter central y por el dipiridamol a la vez', ok: true },
          { t: 'La dosis estándar: el dipiridamol potencia la adenosina, y eso es bueno', porque: `La ficha manda reducir un 50 % con dipiridamol y por vena cava superior, porque se ha descrito asistolia ventricular con la dosis estándar por vía central (${p(30)}).` },
          { t: 'Doblarla, porque el dipiridamol bloquea la captación de adenosina', porque: `Es verdad que bloquea su captación, pero eso la potencia, no la debilita: por eso se reduce y no se dobla (${p(30)}). Doblarla sobre una dosis ya potenciada arriesga una asistolia.` }],
        explicacion: `Reducir un 50 % <span class="hl-rojo">por vena cava superior o con antagonistas del calcio, betabloqueantes o dipiridamol</span>. Interacciones: dipiridamol (bloquea la captación) y teofilina (bloquea los receptores) (${p(30)}). <span class="hl-rojo">Aviso de la ficha: el dipiridamol potencia el bloqueo AV y adenosina y dipiridamol no deben usarse juntos</span> (${p(31)}); la reducción del 50 % es la pauta de la Tabla 19.4 si no queda otra opción. Si la PSVT no responde a la adenosina, pueden servir diltiazem o verapamilo; en la rara PSVT resistente o inestable, la cardioversión sincronizada, que puede necesitar más de 100 J (${p(31)}).` },
      { id: 'otq-e4', corto: 'adenosina y asma', tipo: 'test', fuente: 'mc-tabla-19-4',
        enunciado: 'La adenosina figura contraindicada en el asma. Un asmático con PSVT. ¿Qué matiza la ficha?',
        opciones: [
          { t: 'Que produce sensación de disnea, pero no broncoespasmo real', ok: true },
          { t: 'Que provoca un broncoespasmo grave en el asmático, por lo que se prefiere otro fármaco', porque: `La ficha dice que la disnea es una sensación sin broncoespasmo real, lo que matiza esa contraindicación (${p(30)}). Negársela le deja sin el fármaco de elección tras las maniobras vagales.` },
          { t: 'Que la teofilina del asmático la potencia', porque: `La teofilina hace lo contrario: bloquea sus receptores y le quita efecto (${p(30)}). Esperar un efecto exagerado de la adenosina en quien toma teofilina te llevaría a infradosificar.` }],
        explicacion: `Contraindicaciones: asma, bloqueo AV de 2.º o 3.er grado y síndrome del seno enfermo; en el asma la <span class="hl">disnea es una sensación, no un broncoespasmo</span>. Efectos adversos: bloqueo AV o bradicardia 50 %, rubor 20 %, disnea 12 %, opresión torácica 7 % (${p(30)}).` },
      { id: 'otq-e5', corto: 'TV o aberrante', tipo: 'test', fuente: 'mc-tv-vs-svt',
        enunciado: 'En un ECG de QRS ancho regular, ¿cuáles son las dos claves que identifican la TV?',
        opciones: [
          { t: 'Disociación AV y latidos de fusión (QRS híbrido)', ok: true },
          { t: 'PR corto con onda delta y QRS que no cambia al revertir a sinusal', porque: `La onda delta es del WPW (${p(27)}) y el QRS que no cambia al convertirse delata un bloqueo de rama previo, es decir, una supraventricular (Fig. 19.6, ${p(31)}). Ambas apuntan en sentido contrario a la TV.` },
          { t: 'Frecuencia mayor de 140 lpm y ritmo irregular', porque: `La TV es de ritmo regular y 140-200 lpm no la distingue de una PSVT (${p(31)}). Un ritmo irregular y ancho es FA o TAM con conducción prolongada: la TV nunca es irregular (${p(36)}).` }],
        explicacion: `<span class="hl">Disociación AV</span> (sin relación fija entre P y QRS) y <span class="hl">latidos de fusión</span> (QRS híbrido, Fig. 19.7). Sin ellas, la cardiopatía de base inclina a TV (95 %) (${pag(31, 'pág. 31-32')}).` },
      { id: 'otq-e6', corto: 'algoritmo del ancho', tipo: 'error', fuente: 'mc-fig-19-8 · mc-madeja',
        enunciado: 'Plan de un residente ante una taquicardia de QRS ancho. Hay dos errores: encuéntralos.',
        frases: [
          { t: 'Si hay compromiso hemodinámico, cardioversión sincronizada, sea TV o aberrante.' },
          { t: 'Si dudo entre TV y aberrante y está inestable, pruebo primero la adenosina.', mal: true, c: `Con compromiso hemodinámico se da <span class="hl-rojo">cardioversión sincronizada</span> sin probar nada (${pag(32, 'pág. 32-33')}).` },
          { t: 'Si es ancha, irregular y hay cardiopatía, pienso en TV.', mal: true, c: `Irregular: probablemente FA o TAM con conducción prolongada; <span class="hl">la TV nunca es irregular</span> (${p(36)}).` },
          { t: 'Amplitud creciente y decreciente del QRS: sospecho torsade.' },
          { t: 'La adenosina termina la mayoría de las PSVT, pero no la TV.' }],
        explicacion: `Fig. 19.8 y «cómo desenredar la madeja»: inestable, choque; estable y dudoso, adenosina; irregular, nunca TV (${pag(32, 'pág. 32-33')}, ${p(36)}).` },
      { id: 'otq-e7', corto: 'energía en la TV', tipo: 'test', fuente: 'mc-fig-19-8',
        enunciado: 'Una TV monomórfica con hipotensión grave. Se cardioverte con 100 J bifásicos y no revierte. ¿Qué haces?',
        opciones: [
          { t: 'Repetir a 100 J y escalar hasta 200 J bifásicos', ok: true },
          { t: 'Subir directamente a 360 J, para no perder tiempo', porque: `La ficha dice evitar energías mayores, como 360 J, porque dañan el miocardio (${p(32)}). Un choque excesivo añade lesión a un corazón que ya está en mala situación.` },
          { t: 'Pasar a adenosina, porque el choque falló', porque: `El paciente está inestable: la conducta es el choque. La adenosina no termina la TV y solo se prueba si está estable y la duda persiste (${p(32)}).` }],
        explicacion: `Inestable → sincronizada: <span class="hl">100 J, si falla repetir a 100 J bifásico y escalar hasta 200 J</span>; <span class="hl-rojo">evitar energías mayores (360 J)</span> (${p(32)}).` },
      { id: 'otq-e8', corto: 'calcular el QTc', tipo: 'test', fuente: 'mc-qtc', origen: 'ilustrativo: 0,40 / √0,6',
        enunciado: 'QT medido de 400 ms con una FC de 100 lpm (R-R 0,6 s). ¿Cuánto es el QTc (Bazett) y qué significa?',
        opciones: [
          { t: '0,52 s: >0,5, riesgo de torsade, de valor predictivo limitado', ok: true },
          { t: '0,40 s: es normal, porque el QT medido es menor que el límite de 0,44 s', porque: `Has comparado el QT sin corregir. El QTc es QT/√(R-R) y a 100 lpm sube a 0,52 s (${p(35)}).` },
          { t: '0,67 s, dividiendo el QT entre el R-R sin la raíz', porque: `La fórmula lleva la raíz cuadrada del R-R: 0,40/√0,6 = 0,52. Sin la raíz sobreestimarías el riesgo (${p(35)}).` }],
        explicacion: `QTc = QT/√(R-R) = 0,40/√0,6 ≈ <span class="hl">0,52 s</span>. Normal ≤0,44 s; <span class="hl-rojo">>0,5 s = riesgo de torsade</span>; pero el QT largo es común en la UCI y la torsade infrecuente: su valor predictivo es limitado (${pag(34, 'pág. 34-35')}).` },
      { id: 'otq-e9', corto: 'polimórfica y QT normal', tipo: 'test', fuente: 'mc-tv-polimorfica',
        enunciado: 'Una TV polimórfica recurrente en un paciente con isquemia, con QT normal. ¿Qué prevención de recurrencias propone la ficha?',
        opciones: [
          { t: 'Magnesio IV como en la torsade, porque es una TV polimórfica', porque: `El magnesio es el de la torsade, con QT largo. Con QT normal, la condición predisponente es la isquemia y para prevenir recurrencias la ficha propone amiodarona o betabloqueantes (${pag(34, 'pág. 34-35')}).` },
          { t: 'Retirar haloperidol y claritromicina', porque: `Esa es la prevención de la torsade con QT largo (${p(35)}). Con QT normal los fármacos de la Tabla 19.5 no son el motivo.` },
          { t: 'Amiodarona o betabloqueantes, por la isquemia', ok: true }],
        explicacion: `TV polimórfica con QT normal: la isquemia es su condición predisponente; <span class="hl">amiodarona o betabloqueantes</span> ayudan a prevenir recurrencias (${pag(34, 'pág. 34-35')}).` },
    ],
    casos: [
      { id: 'c3', titulo: 'Hugo, 61 años: el QRS ancho que se alargó', corto: 'Caso · Hugo', sub: 'cardiopatía isquémica y neumonía',
        paciente: { Edad: '61 años', Sexo: 'varón', Antecedentes: 'cardiopatía isquémica', Motivo: 'neumonía' },
        pasos: [
          { momento: 'Día 1 · 22:10', datos: { Constantes: 'FC 170 regular, QRS 0,16 s, PA 118/72', Estado: 'consciente' }, nuevo: ['Constantes', 'Estado'],
            pregunta: { id: 'c3-1', tipo: 'test', fuente: 'mc-tv-vs-svt · mc-tv', modeloVivo: ritmo('tv', 'La TV en el corazón eléctrico'),
              enunciado: 'Taquicardia regular de QRS ancho en un paciente con cardiopatía isquémica, estable. ¿Qué es?',
              opciones: [
                { t: 'Una supraventricular aberrante: está estable, así que no puede ser una TV', porque: `Estar estable no la descarta. Con cardiopatía conocida, la TV causa el 95 % de las de QRS ancho, y la ficha manda tratarla como TV probable (${pag(31, 'pág. 31-32')}).` },
                { t: 'Una TV probable: la cardiopatía hace que sea el 95 % de las de QRS ancho', ok: true },
                { t: 'Una FA con conducción aberrante, porque es la arritmia más frecuente en la UCI', porque: `La FA rápida con conducción prolongada <b>puede parecer regular</b> (${pag(35, 'pág. 35-36')}), así que la regularidad no la descarta; lo que decide es la cardiopatía, que hace de la TV el 95 % de las de QRS ancho (${p(32)}).` }],
              explicacion: `<span class="hl-rojo">Ancho + cardiopatía = TV probable</span> (95 %), aunque el paciente esté estable (${pag(31, 'pág. 31-32')}).` } },
          { momento: 'Día 1 · 22:15', datos: { Plan: 'sin compromiso hemodinámico' }, nuevo: ['Plan'],
            pregunta: { id: 'c3-2', tipo: 'test', fuente: 'mc-fig-19-8 · mc-tv-vs-svt',
              enunciado: 'Está estable y es una TV probable. ¿Qué das?',
              opciones: [
                { t: 'Cardioversión sincronizada de 100 J inmediata, porque la TV es una arritmia grave', porque: `La cardioversión es para el compromiso hemodinámico; Hugo tiene 118/72 y está consciente (${p(32)}). El choque no es el escalón para un paciente estable.` },
                { t: 'Amiodarona 150 mg en 10 min, luego 1 mg/min durante 6 h y 0,5 mg/min durante 18 h', ok: true },
                { t: 'Adenosina 6 mg en bolo «para probar» y esperar a ver si cede el ritmo', porque: `Solo se prueba si la TV es incierta. Con una TV cierta (o muy probable) se da amiodarona, porque la adenosina no termina la TV (${p(32)}).` }],
              explicacion: `Sin compromiso y TV cierta, <span class="hl">amiodarona</span>: 150 mg en 10 min, luego 1 mg/min ×6 h y 0,5 mg/min ×18 h, máximo 2,2 g/24 h (${pag(32, 'pág. 32-33')}).` } },
          { momento: 'Día 1 · 22:25', datos: { Duda: 'el adjunto pregunta por la prueba si no fuera clara' }, nuevo: ['Duda'],
            pregunta: { id: 'c3-3', tipo: 'destapa', cuantas: 'son dos cosas', fuente: 'mc-fig-19-8 · mc-adenosina', modeloVivo: ritmo('aberrancia', 'La adenosina ante un QRS ancho aberrante'),
              enunciado: 'Si dudaras entre TV y supraventricular aberrante con el paciente estable: ¿qué prueba y qué esperas?',
              puntos: [
                `<span class="hl">Adenosina 6 mg en bolo con lavado</span>, y 12 mg a los 2 min si no responde.`,
                `<span class="hl-azul">Si es una PSVT, se corta; si es TV, no</span>: sin respuesta, el diagnóstico probable es TV y se pasa a amiodarona.`],
              explicacion: `Fig. 19.8: «TV incierta → probar adenosina: termina la mayoría de las PSVT pero no la TV» (${pag(32, 'pág. 32-33')}); dosis en la ${pag(30, 'pág. 30')}.` } },
          { momento: 'Día 1 · el plan del R1', datos: { 'Plan del R1': 'cuatro frases' }, nuevo: ['Plan del R1'],
            pregunta: { id: 'c3-4', tipo: 'error', fuente: 'mc-fig-19-8 · mc-adenosina · mc-madeja',
              enunciado: 'El R1 deja escrito este plan. Hay dos errores: encuéntralos.',
              frases: [
                { t: 'Si se deteriora, cardioversión sincronizada con 100 J.' },
                { t: 'Si falla, subo a 360 J.', mal: true, c: `Repetir a 100 J y escalar hasta <span class="hl">200 J</span>; las energías mayores (360 J) <span class="hl-rojo">dañan el miocardio</span> (${p(32)}).` },
                { t: 'Si usara adenosina, 6 mg por la vía central.', mal: true, c: `Por vía central o con antagonistas del calcio, betabloqueantes o dipiridamol: <span class="hl-rojo">la mitad</span> (se ha descrito asistolia con la dosis estándar) (${p(30)}).` },
                { t: 'Si fuera ancho e irregular, pensaría en FA o TAM con conducción prolongada.' }],
              explicacion: `Energía 100 → 200 J, nunca 360 (${p(32)}); adenosina −50 % por vía central (${p(30)}).` } },
          { momento: 'Día 3', datos: { Fármacos: 'haloperidol y claritromicina', Analítica: 'K⁺ 3,1 mmol/L, Mg²⁺ 1,4 mg/dL', ECG: 'QT 520 ms a 75 lpm' }, nuevo: ['Fármacos', 'Analítica', 'ECG'], calculadora: { ir: 'mc-qtc', nombre: 'Calculadora de QTc (Bazett)' },
            pregunta: { id: 'c3-5', tipo: 'test', fuente: 'mc-qtc · mc-tabla-19-5', origen: 'ilustrativo: 0,52 / √0,8', modeloVivo: ritmo('torsade', 'El QTc de Hugo en el corazón eléctrico'),
              enunciado: 'Con la calculadora (QT 520 ms a 75 lpm, R-R 0,8 s): ¿cuál es su QTc y cuánto riesgo tiene?',
              opciones: [
                { t: '0,52 s: es el QT medido, y a su frecuencia no necesita corrección', porque: `Con R-R 0,8 s el QTc se corrige a 0,58 s (0,52/√0,8) (${p(35)}). Quedarte en 0,52 minimiza el riesgo que la propia fórmula separa.` },
                { t: '0,58 s: >0,5, riesgo de torsade (valor predictivo limitado)', ok: true },
                { t: '0,58 s, que es normal porque su FC es de 75 lpm', porque: `Lo normal es ≤0,44 s; por encima de 0,5 s hay riesgo de torsade, y aquí se suman haloperidol, claritromicina, potasio y magnesio bajos (${p(34)}).` }],
              explicacion: `QTc = 0,52/√0,8 ≈ <span class="hl-rojo">0,58 s</span>: >0,5 s es riesgo de torsade, aunque el valor predictivo es limitado porque el QT largo es común en la UCI. Los dos fármacos (Tabla 19.5) y los electrolitos bajos lo explican, y la amiodarona recibida el día 1 también alarga el QT (${p(25)}) (${pag(34, 'pág. 34-35')}).` } },
          { momento: 'Día 4 · 03:30 · el giro', datos: { Ritmo: 'QRS que giran alrededor de la línea de base', Pulso: 'sin pulso' }, nuevo: ['Ritmo', 'Pulso'],
            pregunta: { id: 'c3-6', tipo: 'test', fuente: 'mc-tv-polimorfica · mc-torsade', modeloVivo: ritmo('torsade', 'La torsade de pointes en el corazón eléctrico'),
              enunciado: 'Aparece una torsade sostenida sin pulso. ¿Qué haces?',
              opciones: [
                { t: 'Cardioversión sincronizada de 100 J como en la TV, y Mg 1-2 g en 15 min', porque: `La TV polimórfica sostenida sin pulso pide desfibrilación, no cardioversión sincronizada (${p(35)}). El magnesio está bien, pero con un choque mal elegido el paciente sigue sin pulso.` },
                { t: 'Desfibrilar sin sincronizar y dar Mg 1-2 g, pero mantener el haloperidol y la claritromicina por ahora', porque: `Esos fármacos prolongan el QT y mantienen el sustrato: la ficha manda suspender los de alto riesgo y corregir K⁺ y Mg²⁺ (${p(35)}). Con ellos puestos, la torsade vuelve a salir tras el choque.` },
                { t: 'Desfibrilar sin sincronizar, Mg 1-2 g en 15 min, corregir K⁺ y Mg²⁺ y retirar haloperidol y claritromicina', ok: true }],
              explicacion: `<span class="hl-rojo">Desfibrilación no sincronizada</span>, <span class="hl">MgSO₄ 1-2 g IV en 15 min</span> (ACLS; sin consenso de dosis) combinable con el choque, corregir la hipopotasemia y la hipomagnesemia y suspender los fármacos de alto riesgo (${p(35)}).` } },
          { momento: 'Día 5', datos: { Evolución: 'K⁺ y Mg²⁺ repuestos, fármacos retirados; QTc 0,43 s', Ritmo: 'TV polimórfica breve, QT normal' }, nuevo: ['Evolución', 'Ritmo'],
            pregunta: { id: 'c3-7', tipo: 'test', fuente: 'mc-tv-polimorfica',
              enunciado: 'Reaparece una TV polimórfica breve, pero ahora el QTc es de 0,43 s. ¿Repites el magnesio «como anoche»?',
              opciones: [
                { t: 'Sí: toda TV polimórfica se trata como la torsade, y el magnesio es lo que la termina', porque: `Con el QT normal ya no es torsade: la condición predisponente es la isquemia, y para prevenir recurrencias la ficha propone amiodarona o betabloqueantes (${pag(34, 'pág. 34-35')}).` },
                { t: 'No: con QT normal, la isquemia; amiodarona o betabloqueante para prevenir recurrencias', ok: true },
                { t: 'No: se repite la cardioversión sincronizada cada vez que reaparezca, porque es lo que corta la TV', porque: `La sincronizada no es la conducta de la TV polimórfica sostenida, que requiere desfibrilación; y no previene la recurrencia, lo que sí hacen la amiodarona o los betabloqueantes (${p(35)}).` }],
              explicacion: `TV polimórfica con QT normal: su condición predisponente es la <span class="hl-rojo">isquemia miocárdica</span>; <span class="hl">amiodarona o betabloqueantes</span> previenen recurrencias; el magnesio es el tratamiento de la torsade con QT largo (${pag(34, 'pág. 34-35')}).` } },
        ],
        lleva: [
          'QRS ancho + cardiopatía = TV hasta que se demuestre lo contrario; la TV nunca es irregular.',
          'Choque sincronizado de 100 J, repetido hasta 200 J: nunca 360 J. La adenosina, a la mitad por vía central.',
          'El QT largo cambia el tratamiento: con QTc >0,5 y torsade, Mg y retirar fármacos; con QT normal, isquemia: amiodarona o betabloqueante.'],
        volver: { nombre: 'TV polimórfica', ancla: 'mc-tv-polimorfica', modeloVivo: ritmo('torsade', 'El QT largo de Hugo en el corazón eléctrico') } },
    ],
    profundizar: [
      { id: 'mc-tabla-19-4', titulo: 'Tabla 19.4 — Adenosina IV para PSVT' },
      { id: 'mc-psvt', titulo: 'Los 5 tipos de PSVT y la AVNRT' },
    ],
  },
};
