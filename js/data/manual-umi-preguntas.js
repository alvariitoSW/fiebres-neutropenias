// Banco de preguntas de repaso — "Manual UMI Negrín" (manual de orientación
// interno de la Unidad de Medicina Intensiva, HUGCDN), consolidado en una
// única guía con sus 31 fichas (ver manual-umi.html). 5 preguntas por
// ficha (4 opción múltiple + 1 de redactar) × 31 fichas, más 6 de los
// huecos cerrados en octubre de 2026 = 161 preguntas —
// formato reducido, mismo criterio ya usado en los bloques prácticos más
// recientes de la app.
export const temasManualUmi = [
    { key: 'umi-rutinas', etiqueta: 'Rutinas de guardia y traslado intrahospitalario' },
    { key: 'umi-electrolitos', etiqueta: 'Reposición de electrolitos en la UMI' },
    { key: 'umi-nutricion', etiqueta: 'Nutrición en el paciente crítico' },
    { key: 'umi-shock-septico', etiqueta: 'Shock séptico: manejo inicial y cóctel de Marik' },
    { key: 'umi-endocarditis', etiqueta: 'Endocarditis infecciosa: criterios de Duke' },
    { key: 'umi-dds-aislamiento', etiqueta: 'DDS y aislamiento por BMR' },
    { key: 'umi-vasoactivos', etiqueta: 'Fármacos vasoactivos: receptores y dosis' },
    { key: 'umi-rsi', etiqueta: 'Secuencia de intubación rápida (SIR)' },
    { key: 'umi-respirador', etiqueta: 'Programación inicial del respirador' },
    { key: 'umi-extubacion', etiqueta: 'Criterios de extubación y brecha aniónica' },
    { key: 'umi-blue', etiqueta: 'Protocolo BLUE: ecografía pulmonar' },
    { key: 'umi-cirugia-cardiaca', etiqueta: 'Cirugía cardiaca: anticoagulación y sangrado' },
    { key: 'umi-hemodinamica', etiqueta: 'Hemodinámica invasiva y protocolo Swan-Ganz' },
    { key: 'umi-fate', etiqueta: 'Ecocardiografía FATE a pie de cama' },
    { key: 'umi-marcapasos', etiqueta: 'Marcapasos: código de 5 letras' },
    { key: 'umi-posparada', etiqueta: 'Síndrome posparada cardíaca' },
    { key: 'umi-fa-anticoagulacion', etiqueta: 'Fibrilación auricular: algoritmo de anticoagulación' },
    { key: 'umi-glucemia', etiqueta: 'Control glucémico: algoritmos y pauta móvil' },
    { key: 'umi-sedacion', etiqueta: 'Sedación: escalas RASS y Ramsay' },
    { key: 'umi-tce-dx', etiqueta: 'TCE: clasificación, pronóstico y diagnóstico' },
    { key: 'umi-tce-manejo', etiqueta: 'TCE: manejo escalonado, PIC y cirugía' },
    { key: 'umi-pic-onda', etiqueta: 'Ondas de la PIC: P1, P2 y P3' },
    { key: 'umi-hidrocefalia', etiqueta: 'Hidrocefalia en la TAC y LCR según la causa' },
    { key: 'umi-fibrinolisis-iv', etiqueta: 'Fibrinolisis intraventricular' },
    { key: 'umi-neuroanatomia', etiqueta: 'Neuroanatomía en la TAC y territorios vasculares' },
    { key: 'umi-marshall', etiqueta: 'Clasificación de Marshall por TAC' },
    { key: 'umi-hsa', etiqueta: 'HSA: Fisher, Hunt-Hess y vasoespasmo por Doppler' },
    { key: 'umi-onsd', etiqueta: 'Vaina del nervio óptico y fuerza muscular' },
    { key: 'umi-escalas-pronostico', etiqueta: 'Escalas de resultado: Rankin modificada y GOS' },
    { key: 'umi-meningitis', etiqueta: 'Meningitis y ventriculitis' },
    { key: 'umi-hfvvc', etiqueta: 'HFVVC: indicaciones, pauta y fórmulas' },
];

export const preguntasManualUmi = [
    // ---- Ficha I: Rutinas de guardia y traslado intrahospitalario ----
    {
        id: 'umi-q001', tema: 'umi-rutinas',
        enunciado: 'Al iniciar la ronda de guardia, ¿a qué paciente se prioriza ver primero?',
        opciones: ['Al más grave o al de nuevo ingreso', 'Al que lleve más tiempo ingresado', 'Al más próximo a la puerta de la sección', 'Al que tenga programada el alta ese día'],
        correcta: 0,
        explicacion: 'La primera rutina de la sección es "ver al paciente más grave o al nuevo ingreso" — prioriza el riesgo clínico real sobre el orden espacial o temporal.',
    },
    {
        id: 'umi-q002', tema: 'umi-rutinas',
        enunciado: 'Antes de movilizar a un paciente fuera de la unidad, ¿qué debe estar siempre verificado?',
        opciones: ['Que el informe de traslado y/o alta esté realizado y actualizado', 'Que la familia haya firmado un consentimiento verbal', 'Que el paciente lleve más de 24h ingresado', 'Que el turno de enfermería sea el diurno'],
        correcta: 0,
        explicacion: 'El manual lo marca como regla sin excepciones: "verificar que esté realizado y actualizado el informe de traslado y/o alta... antes de movilizar al paciente de nuestra unidad SIEMPRE".',
    },
    {
        id: 'umi-q003', tema: 'umi-rutinas',
        enunciado: 'Durante un traslado intrahospitalario en ascensor, ¿cómo debe posicionarse el equipo?',
        opciones: ['Subir con los pies primero y situarse a la cabeza para el control de la vía aérea', 'Subir con la cabeza primero para ahorrar espacio', 'Da igual la orientación si el ascensor es amplio', 'Solo importa la posición si el paciente está despierto'],
        correcta: 0,
        explicacion: 'El protocolo indica explícitamente subir los pies primero y ubicarse a la cabeza del paciente en el ascensor, precisamente para mantener el control inmediato de la vía aérea en caso de emergencia durante el trayecto.',
    },
    {
        id: 'umi-q004', tema: 'umi-rutinas',
        enunciado: '¿Quién lleva la "voz de mando" durante la movilización del paciente en un traslado, según el manual?',
        opciones: ['El médico', 'El celador', 'La enfermera de mayor antigüedad', 'Cualquier miembro del equipo, sin jerarquía definida'],
        correcta: 0,
        explicacion: 'El manual es explícito: "el médico llevará la voz de mando y solo se movilizará cuando él lo diga" — una única persona coordina el momento exacto del movimiento para evitar tracciones o desconexiones accidentales.',
    },
    {
        id: 'umi-q005', tema: 'umi-rutinas', tipo: 'redactar',
        enunciado: 'Explica por qué el checklist de traslado divide sus pasos en "antes", "durante" y "después", y qué tipo de fallo previene cada fase.',
        respuestaModelo: 'Dividir el checklist en 3 fases refleja que los riesgos de un traslado intrahospitalario son distintos según el momento. La fase "antes" (monitorización cargada, 2 balas de O₂ con autonomía calculada, respirador de traslado armado, fármacos de parada disponibles, fijación de tubo/catéteres/vías verificada, gasometría basal) previene el fallo más costoso de todos: quedarse sin recursos a mitad de camino, lejos de la unidad, sin poder resolver una descompensación — por eso se calcula explícitamente la autonomía de oxígeno en minutos antes de salir. La fase "durante" (control visual continuo, orientación correcta en el ascensor, fijación de dispositivos antes de cada movimiento, voz de mando única, protocolo de emergencia claro) previene errores activos en el momento mismo del traslado, como la extubación accidental por tracción de un cable o tubuladura, o una demora en la respuesta ante una descompensación súbita por falta de coordinación del equipo. La fase "después" (reconexión y monitorización, gasometría de control, registro de la técnica realizada e incidencias) previene que un problema surgido durante el traslado pase desapercibido al reincorporar al paciente a la rutina de la unidad, y deja constancia documental de lo ocurrido para la continuidad del cuidado en el siguiente turno.',
    },

    // ---- Ficha II: Reposición de electrolitos en la UMI ----
    {
        id: 'umi-q006', tema: 'umi-electrolitos',
        enunciado: '¿Cuál es el límite máximo de velocidad de reposición de potasio por vía venosa periférica (VVP)?',
        opciones: ['3 mEq/h', '20 mEq/h', '50 mEq/h', 'No hay límite si el paciente está monitorizado'],
        correcta: 0,
        explicacion: 'Por VVP el límite es 3 mEq/h (y 40-60 mEq/l de concentración); por vía central (VVC) el límite sube a 20 mEq/h, salvo K<2 mEq/l.',
    },
    {
        id: 'umi-q007', tema: 'umi-electrolitos',
        enunciado: '¿Por qué se recomienda evitar diluir el potasio en suero glucosado al 5% (G5%)?',
        opciones: ['Puede producir un descenso inicial del K⁺ de 0,2-1,4 mEq/l', 'Precipita químicamente con la glucosa', 'Aumenta el riesgo de flebitis', 'Inactiva al potasio por completo'],
        correcta: 0,
        explicacion: 'El manual explica que diluir en G5% puede producir un descenso inicial del K⁺ (probablemente por el estímulo de insulina endógena que desplaza K⁺ al medio intracelular) — contraproducente cuando el objetivo es justamente subir el potasio.',
    },
    {
        id: 'umi-q008', tema: 'umi-electrolitos',
        enunciado: 'En el tratamiento de la hiperpotasemia, ¿cuál es el mecanismo del gluconato/cloruro de calcio IV?',
        opciones: ['Reducir al mínimo la despolarización de la membrana (estabilización cardíaca)', 'Favorecer la transferencia de K⁺ al medio intracelular', 'Facilitar la pérdida de K⁺ por vía digestiva', 'Aumentar la eliminación renal de K⁺'],
        correcta: 0,
        explicacion: 'El calcio IV no baja el potasio sérico — su efecto es reducir la excitabilidad de la membrana cardíaca (antagonizando el efecto arritmogénico de la hiperpotasemia), por eso el manual lo clasifica en la columna "reducir al mínimo la despolarización de la membrana".',
    },
    {
        id: 'umi-q009', tema: 'umi-electrolitos',
        enunciado: 'Si la hipopotasemia no corrige pese a la reposición adecuada, ¿qué déficit debe sospecharse?',
        opciones: ['Déficit de magnesio', 'Déficit de calcio', 'Déficit de fósforo', 'Exceso de sodio'],
        correcta: 0,
        explicacion: 'El manual indica explícitamente: "si no corrige, pensar en Mg IV" — el magnesio es cofactor de la bomba Na⁺/K⁺-ATPasa, y su déficit impide corregir la hipopotasemia hasta que se repone.',
    },
    {
        id: 'umi-q010', tema: 'umi-electrolitos', tipo: 'redactar',
        enunciado: 'Explica para qué sirve el índice TTKG y en qué situación clínica se usa según el manual.',
        respuestaModelo: 'El TTKG (gradiente transtubular de potasio) es un índice que estima cuánto está "trabajando" el riñón para eliminar potasio, comparando la concentración de K⁺ en orina y en plasma, corregidas por la osmolalidad (TTKG = K(orina)×Osm(plasma) / [K(plasma)×Osm(orina)]). El manual lo indica específicamente para la situación en la que hay hipopotasemia pero el K⁺ en orina NO está disminuido como cabría esperar si el riñón estuviera reteniendo potasio apropiadamente — un TTKG alto en ese contexto confirma que la causa de la hipopotasemia es una pérdida renal excesiva (p. ej. por diuréticos, hiperaldosteronismo, o los fármacos de la tabla de pérdida renal de K⁺), en vez de una causa extrarrenal (pérdidas digestivas o redistribución transcelular), que tendría un TTKG bajo porque el riñón sí estaría intentando conservar el potasio correctamente.',
    },

    // ---- Ficha III: Nutrición en el paciente crítico ----
    // ---- Ficha I: Nutrición ----
    {
        id: 'umi-q011', tema: 'umi-nutricion',
        enunciado: 'Según el manual, ¿cuándo debería iniciarse la nutrición enteral en un paciente crítico que no recibirá dieta oral por 72h?',
        opciones: ['De forma precoz, antes de 24h, con hemodinámia estable y aparato GI funcional', 'Solo tras confirmar tolerancia con dieta oral primero', 'A partir del 4º día de ingreso', 'Nunca antes de retirar la ventilación mecánica'],
        correcta: 0,
        explicacion: 'El manual indica inicio precoz (antes de 24h) siempre que el paciente esté hemodinámicamente estable y con aparato gastrointestinal funcional — no hace falta esperar más días ni confirmar tolerancia oral primero.',
    },
    {
        id: 'umi-q012', tema: 'umi-nutricion',
        enunciado: '¿Sobre qué peso se recomienda calcular las calorías en un paciente crítico obeso?',
        opciones: ['El peso ajustado = 0,25×(peso actual−peso ideal)+peso ideal', 'El peso real sin ajustar', 'El peso ideal sin ningún ajuste', 'El doble del peso ideal'],
        correcta: 0,
        explicacion: 'Para el paciente obeso crítico se usa peso ajustado (22-25 kcal/kg de peso ajustado) — usar el peso real sobreestimaría de forma significativa el gasto energético real.',
    },
    {
        id: 'umi-q013', tema: 'umi-nutricion',
        enunciado: 'En el cribado NRS2002, ¿a partir de qué puntuación se considera que el paciente está en riesgo nutricional?',
        opciones: ['≥3', '≥1', '≥5', '≥7'],
        correcta: 0,
        explicacion: 'Puntuación ≥3 (suma de alteración del estado nutricional + gravedad de la enfermedad, +1 si edad ≥70 años) indica riesgo nutricional real y obliga a plan nutricional; por debajo de 3, reevaluación semanal.',
    },
    {
        id: 'umi-q014', tema: 'umi-nutricion',
        enunciado: '¿Cuál es el aporte calórico diario recomendado por kg en la fase aguda del paciente crítico, según el manual?',
        opciones: ['20-25 kcal/kg/día', '40-50 kcal/kg/día', '10-12 kcal/kg/día', '60 kcal/kg/día'],
        correcta: 0,
        explicacion: 'Fase aguda: 20-25 kcal/kg/día — distinto de TCE o HFVVC (30-35 kcal/kg/día) y del obeso crítico (22-25 kcal/kg de peso ajustado).',
    },
    {
        id: 'umi-q015', tema: 'umi-nutricion', tipo: 'redactar',
        enunciado: 'Explica qué mide el balance nitrogenado y por qué es una herramienta útil para ajustar el aporte proteico en el paciente crítico.',
        respuestaModelo: 'El balance nitrogenado (BN = N ingresado − N eliminado) estima si el paciente está en un estado anabólico (BN positivo, más nitrógeno retenido del que se pierde, favorable para la síntesis proteica) o catabólico (BN negativo, se pierde más nitrógeno del que se aporta, típico del paciente crítico en estrés metabólico). El N ingresado se calcula dividiendo los gramos de proteína aportados entre 6,25 (la proporción estándar de nitrógeno en las proteínas). El N eliminado se estima a partir de la urea urinaria (urea en orina × 0,46 × volumen de orina en 24h) más una corrección fija de 4g que cubre las pérdidas no medidas por heces, sudor y nitrógeno no ureico en orina. Es útil porque permite objetivar si el aporte proteico actual está siendo suficiente para frenar el catabolismo — un BN muy negativo pese a un aporte proteico ya alto (1,5-2,5 g/kg/día) sugiere que el catabolismo del estrés crítico está superando la capacidad de reposición nutricional, información que un simple recuento de gramos de proteína administrados no daría por sí solo.',
    },

    // ---- Ficha IV: Shock séptico: manejo inicial y cóctel de Marik ----
    {
        id: 'umi-q016', tema: 'umi-shock-septico',
        enunciado: 'Según Sepsis-3, ¿qué define al shock séptico además de la sepsis?',
        opciones: ['Necesidad de vasopresores para TAM ≥65 mmHg + lactato >2 mmol/l tras adecuada resucitación', 'Solo la presencia de fiebre >38,5°C', 'Un recuento de leucocitos >12.000', 'GCS <13 aislado'],
        correcta: 0,
        explicacion: 'Shock séptico = sepsis + necesidad de vasopresores para mantener TAM ≥65 mmHg + lactato >2 mmol/l después de una resucitación con volumen adecuada — los otros hallazgos forman parte de la definición de sepsis o de qSOFA, no de shock séptico específicamente.',
    },
    {
        id: 'umi-q017', tema: 'umi-shock-septico',
        enunciado: '¿Cuál es el orden correcto entre obtener hemocultivos e iniciar antibiótico empírico?',
        opciones: ['Obtener hemocultivos ANTES de iniciar el antibiótico', 'Iniciar el antibiótico primero, cultivos después sin prisa', 'Es indiferente el orden', 'Solo se necesitan cultivos si el paciente no mejora'],
        correcta: 0,
        explicacion: 'El protocolo exige obtener hemocultivos antes de iniciar el tratamiento antibiótico (en las primeras 2h) — invertir el orden reduce drásticamente el rendimiento diagnóstico del cultivo.',
    },
    {
        id: 'umi-q018', tema: 'umi-shock-septico',
        enunciado: '¿Cuáles son los 3 fármacos del cóctel de Marik, y su indicación según el manual?',
        opciones: ['Vitamina C + tiamina + hidrocortisona, si sepsis grave/shock séptico y PCT >2', 'Vitamina C + vitamina D + hidrocortisona, en toda sepsis', 'Tiamina + magnesio + insulina, si lactato >4', 'Hidrocortisona sola, sin otros fármacos asociados'],
        correcta: 0,
        explicacion: 'El cóctel es vitamina C 1,5g/6h, tiamina 200mg/12h e hidrocortisona 50mg/6h — indicado específicamente si hay sepsis grave o shock séptico Y procalcitonina >2, no en toda sepsis.',
    },
    {
        id: 'umi-q019', tema: 'umi-shock-septico',
        enunciado: '¿Cuál es el objetivo de PVC durante la prueba de volumen en shock séptico, y cuál es su límite de seguridad?',
        opciones: ['Objetivo TAM 75 mmHg, límite de seguridad PVC 15 mmHg', 'Objetivo PVC 20 mmHg sin límite superior', 'No se mide PVC durante la prueba de volumen', 'Límite de seguridad PVC 5 mmHg'],
        correcta: 0,
        explicacion: 'La prueba de volumen (500 ml en ≤30 min) tiene como objetivo TAM 75 mmHg, con un límite de seguridad de PVC 15 mmHg — si se alcanza ese límite antes que el objetivo de TA, se detiene la prueba.',
    },
    {
        id: 'umi-q020', tema: 'umi-shock-septico', tipo: 'redactar',
        enunciado: 'Explica por qué el cóctel de Marik combina 3 fármacos con mecanismos distintos (antioxidante, cofactor metabólico, antiinflamatorio) en vez de uno solo.',
        respuestaModelo: 'Los 3 fármacos del cóctel atacan mecanismos distintos y potencialmente complementarios del daño celular en la sepsis grave. La vitamina C (ácido ascórbico) es un antioxidante que, según la hipótesis detrás de este protocolo, podría reducir el daño endotelial mediado por radicales libres de oxígeno y ayudar a preservar la función de barrera vascular, además de participar en la síntesis de catecolaminas endógenas y de vasopresina. La tiamina (vitamina B1) es un cofactor esencial del metabolismo oxidativo mitocondrial (piruvato deshidrogenasa, entre otras enzimas); los pacientes sépticos críticos con frecuencia tienen depleción de tiamina, y su déficit empeora la acidosis láctica al forzar el metabolismo anaeróbico incluso sin hipoxia tisular real. La hidrocortisona aporta un efecto antiinflamatorio e inmunomodulador, y en dosis de estrés compensa la posible insuficiencia suprarrenal relativa que acompaña al shock séptico grave. La lógica de combinarlos es que ninguno de los 3 mecanismos por sí solo explica todo el daño celular de la sepsis, así que atacar los 3 frentes a la vez (estrés oxidativo, disfunción mitocondrial, respuesta inflamatoria desregulada) podría tener un efecto mayor que cualquiera de ellos por separado — aunque la evidencia de eficacia de este cóctel específico sigue siendo objeto de controversia en la literatura, motivo por el cual el manual lo reserva a un subgrupo concreto (PCT>2) en vez de generalizarlo a toda sepsis.',
    },

    // ---- Ficha V: Endocarditis infecciosa: criterios de Duke ----
    {
        id: 'umi-q021', tema: 'umi-endocarditis',
        enunciado: 'Según los criterios de Duke, ¿cuándo se considera EI definitiva?',
        opciones: ['2 criterios mayores, o 1 mayor + 3 menores, o 5 menores', '1 criterio mayor por sí solo', '3 criterios menores', 'Un único hemocultivo positivo'],
        correcta: 0,
        explicacion: 'EI definida (criterios clínicos) = 2 mayores, o 1 mayor + 3 menores, o 5 menores — la misma regla en los criterios de Duke originales y en los modificados.',
    },
    {
        id: 'umi-q022', tema: 'umi-endocarditis',
        enunciado: '¿Qué microorganismo permite, con un único hemocultivo positivo, cumplir por sí solo un criterio MAYOR de Duke?',
        opciones: ['Coxiella burnetii', 'Staphylococcus epidermidis', 'Escherichia coli', 'Candida albicans'],
        correcta: 0,
        explicacion: 'Un cultivo único positivo para Coxiella burnetii cuenta como criterio mayor por sí solo — el resto de microorganismos requieren cultivos persistentemente positivos o un agente típico Gram+.',
    },
    {
        id: 'umi-q023', tema: 'umi-endocarditis',
        enunciado: 'Ante sospecha de EI con prótesis valvular y ETT positivo, ¿cuál es el siguiente paso del algoritmo?',
        opciones: ['ETE (ecocardiograma transesofágico)', 'Alta y reevaluación en consulta', 'Repetir solo el ETT en 24h', 'Iniciar tratamiento sin más pruebas de imagen'],
        correcta: 0,
        explicacion: 'Prótesis valvulares/dispositivos intracardiacos, ETT de pobre calidad o ETT positivo llevan todos a ETE — el ETT solo no basta en ninguno de esos 3 escenarios.',
    },
    {
        id: 'umi-q024', tema: 'umi-endocarditis',
        enunciado: '¿Qué prueba de imagen añaden los criterios ESC 2015 específicamente para el estudio de prótesis valvulares con alta sospecha de EI?',
        opciones: ['¹⁸F-FDG PET/TAC o SPECT/TAC con leucocitos marcados', 'Resonancia magnética cardiaca simple', 'Ecografía Doppler carotídea', 'Gammagrafía ósea'],
        correcta: 0,
        explicacion: 'En válvula protésica, el algoritmo añade PET/TAC con ¹⁸F-FDG o SPECT/TAC con leucocitos marcados con isótopos — técnicas de medicina nuclear que compensan la menor sensibilidad del ecocardiograma sobre material protésico.',
    },
    {
        id: 'umi-q025', tema: 'umi-endocarditis', tipo: 'redactar',
        enunciado: 'Distingue un fenómeno vascular de un fenómeno inmunitario dentro de los criterios menores de Duke, con un ejemplo de cada uno.',
        respuestaModelo: 'Los fenómenos vasculares reflejan embolización séptica directa desde la vegetación: émbolo arterial grave, infarto pulmonar séptico, aneurisma micótico, hemorragias intracraneales o conjuntivales, y las lesiones de Janeway (máculas eritematosas indoloras en palmas/plantas). Los fenómenos inmunitarios, en cambio, reflejan una respuesta inmune mediada por inmunocomplejos, no una embolización directa: glomerulonefritis, nódulos de Osler (nódulos dolorosos en pulpejos), manchas de Roth (hemorragias retinianas con centro pálido) y factor reumatoide positivo. Ambos son criterios menores, pero mecánicamente son fenómenos distintos — uno es obstrucción vascular por material embólico, el otro es daño tisular mediado por el sistema inmune.',
    },

    // ---- Ficha VI: DDS y aislamiento por BMR ----
    {
        id: 'umi-q026', tema: 'umi-dds-aislamiento',
        enunciado: '¿Cuál de estos NO es, por sí solo, un criterio de "paciente de riesgo" de BMR al ingreso?',
        opciones: ['Fiebre al ingreso', 'Ingreso hospitalario ≥5 días en los últimos 3 meses', 'Colonización o infección conocida por BMR', 'Antibioterapia ≥7 días en el mes previo'],
        correcta: 0,
        explicacion: 'La fiebre al ingreso no forma parte de los criterios de riesgo de BMR del manual — esos son: ingreso reciente prolongado, institucionalización, colonización/infección previa por BMR, antibioterapia reciente prolongada, ERC en diálisis, y patología crónica susceptible.',
    },
    {
        id: 'umi-q027', tema: 'umi-dds-aislamiento',
        enunciado: '¿A qué pacientes se aplica la DDS "mixta" en vez de la "estándar"?',
        opciones: ['Procedentes de otro hospital, con >72h de ingreso hasta cultivos negativos, o portadores de SAMR', 'A todos los pacientes de la unidad sin excepción', 'Solo a pacientes con IOT >72h', 'Nunca se usa la DDS mixta en la UMI'],
        correcta: 0,
        explicacion: 'La descontaminación mixta es para pacientes de mayor riesgo real de SAMR: procedencia de otro hospital, >72h de ingreso propio hasta muestras negativas, o portadores actuales/previos de SAMR hasta el alta.',
    },
    {
        id: 'umi-q028', tema: 'umi-dds-aislamiento',
        enunciado: '¿Cuántos cultivos consecutivos negativos, separados entre sí por cuánto tiempo, se necesitan para retirar un aislamiento de contacto por BMR?',
        opciones: ['2 cultivos negativos, separados por al menos 3 días', '1 solo cultivo negativo', '3 cultivos negativos en el mismo día', '5 cultivos negativos consecutivos'],
        correcta: 0,
        explicacion: 'El protocolo exige 2 cultivos consecutivos negativos, separados entre sí por al menos 3 días, para retirar el aislamiento de contacto una vez iniciado por un cultivo positivo a Acinetobacter KPC+, Klebsiella BLEE+ o SAMR.',
    },
    {
        id: 'umi-q029', tema: 'umi-dds-aislamiento',
        enunciado: '¿Qué día de la semana se recomienda solicitar nuevos cultivos de vigilancia si el resultado previo fue negativo, para reducir tiempos de aislamiento innecesarios?',
        opciones: ['El viernes', 'El lunes', 'El miércoles', 'Cualquier día es indiferente'],
        correcta: 0,
        explicacion: 'Los cultivos de vigilancia se informan jueves tarde/viernes mañana — solicitar los siguientes para el viernes acorta al máximo la ventana de aislamiento pendiente de confirmación.',
    },
    {
        id: 'umi-q030', tema: 'umi-dds-aislamiento', tipo: 'redactar',
        enunciado: 'Explica la diferencia entre aislamiento "preventivo" y aislamiento "de contacto" según el manual, y qué dispara cada uno.',
        respuestaModelo: 'El aislamiento preventivo se aplica al ingreso, antes de tener ningún resultado microbiológico, basándose únicamente en factores de riesgo epidemiológicos conocidos (ingreso hospitalario reciente prolongado, institucionalización, colonización previa, antibioterapia reciente, ERC en diálisis, patología crónica susceptible) — es una medida anticipatoria que asume que el paciente podría ser portador de una bacteria multirresistente mientras se esperan los resultados de las muestras de vigilancia, precisamente porque esperar el cultivo sin ninguna precaución expondría a otros pacientes a un riesgo real si el resultado termina siendo positivo. El aislamiento de contacto, en cambio, se activa solo tras confirmación microbiológica real: un cultivo positivo para un patógeno concreto de alto riesgo (Acinetobacter productor de KPC, Klebsiella pneumoniae BLEE+, o SAMR). Es una medida reactiva basada en evidencia confirmada, no en sospecha, y por eso su retirada exige un criterio más estricto (2 cultivos negativos separados 3 días) que el preventivo (que se mantiene solo "hasta resultado de cultivos").',
    },

    // ---- Ficha VII: Fármacos vasoactivos: receptores y dosis ----
    // ---- Ficha I: Vasoactivos ----
    {
        id: 'umi-q031', tema: 'umi-vasoactivos',
        enunciado: '¿Con qué fármaco NO se deben diluir ni administrar simultáneamente la dopamina, dobutamina, noradrenalina ni adrenalina?',
        opciones: ['Bicarbonato sódico (NaHCO₃)', 'Suero salino fisiológico 0,9%', 'Suero glucosado 5%', 'Cloruro potásico'],
        correcta: 0,
        explicacion: 'El pH básico del bicarbonato inactiva a las 4 catecolaminas clásicas — advertencia compartida por las 4 en el manual de la UMI.',
    },
    {
        id: 'umi-q032', tema: 'umi-vasoactivos',
        enunciado: 'A dosis >10 μg/kg/min, ¿qué receptor predomina en el efecto de la dopamina?',
        opciones: ['Receptores α (vasoconstricción sistémica y pulmonar)', 'Receptores β2 (vasodilatación)', 'Receptores dopaminérgicos D1 exclusivamente', 'Receptores muscarínicos'],
        correcta: 0,
        explicacion: 'A dosis >10 μg/kg/min la dopamina es agonista de receptores α en circulación sistémica y pulmonar, produciendo vasoconstricción — a diferencia de los 3 μg/kg/min, donde predomina el efecto β.',
    },
    {
        id: 'umi-q033', tema: 'umi-vasoactivos',
        enunciado: '¿Qué reacción adversa es específica y grave del nitroprusiato, y no de la nitroglicerina?',
        opciones: ['Intoxicación por cianuro/tiocianato', 'Taquifilaxia a las 24h', 'Metahemoglobinemia', 'Broncoespasmo'],
        correcta: 0,
        explicacion: 'El nitroprusiato libera 5 moléculas de cianuro por molécula; el cianuro bloquea la citocromo oxidasa mitocondrial y se metaboliza a tiocianato (neurotóxico, eliminado por el riñón). La nitroglicerina, en cambio, tiene como reacción propia la metahemoglobinemia por oxidación del grupo hemo.',
    },
    {
        id: 'umi-q034', tema: 'umi-vasoactivos',
        enunciado: '¿Cuál es el antídoto real del rocuronio, y a qué dosis revierte el bloqueo de forma inmediata?',
        opciones: ['Sugammadex, 16 mg/kg', 'Neostigmina, 5 mg', 'Fisostigmina, 2 mg', 'Flumazenilo, 0,5 mg'],
        correcta: 0,
        explicacion: 'Sugammadex ("Bridion") es el antídoto específico del rocuronio y vecuronio — 4 mg/kg para reversión estándar, 16 mg/kg para reversión inmediata tras la dosis de intubación.',
    },
    {
        id: 'umi-q035', tema: 'umi-vasoactivos', tipo: 'redactar',
        enunciado: 'Explica por qué la dobutamina, pese a aumentar el gasto cardíaco, puede ser deletérea en un paciente con falla cardíaca — y qué receptor lo explica.',
        respuestaModelo: 'La dobutamina es agonista β1 predominante, lo que aumenta la contractilidad, la frecuencia cardíaca y el dromotropismo, elevando el gasto cardíaco de forma dosis-dependiente. Pero ese mismo efecto inotrópico y cronotrópico positivo aumenta el consumo miocárdico de oxígeno — un efecto deletéreo precisamente en el contexto de falla cardíaca, donde el miocardio ya tiene una reserva energética comprometida. El efecto β2 acompañante (vasodilatación periférica débil) suele dejar la presión arterial sin cambios netos, así que el balance depende de si el beneficio hemodinámico del mayor gasto compensa el mayor coste metabólico.',
    },

    // ---- Ficha VIII: Secuencia de intubación rápida (SIR) ----
    // ---- Ficha I: SIR ----
    {
        id: 'umi-q036', tema: 'umi-rsi',
        enunciado: '¿Qué significa la regla "3-3-2" al pronosticar una vía aérea difícil?',
        opciones: ['3 dedos de apertura oral, 3 dedos mentón-hueso hioides, 2 dedos hueso hioides-cartílago tiroides', 'Un método de anestesia en 3 fases y 2 relajantes', 'La proporción de dosis entre sedante y relajante', 'El número de intentos máximo de laringoscopia'],
        correcta: 0,
        explicacion: 'La regla 3-3-2 es una evaluación anatómica rápida de la vía aérea (apertura oral, distancia mentón-hioides, distancia hioides-cartílago tiroides), parte del Paso 1 (planificación) de la SIR, junto a la escala de Mallampati.',
    },
    {
        id: 'umi-q037', tema: 'umi-rsi',
        enunciado: 'Según el manual, ¿qué fármaco relajante se prefiere si hay disponibilidad de sugammadex?',
        opciones: ['Succinilcolina', 'Pancuronio', 'Cisatracurio', 'Ninguno — el sugammadex no cambia la elección'],
        correcta: 0,
        explicacion: 'El algoritmo por estabilidad hemodinámica indica rocuronio o succinilcolina, "de elección si hay disponibilidad de sugammadex" — porque el antídoto revierte de inmediato el bloqueo si la intubación fracasa.',
    },
    {
        id: 'umi-q038', tema: 'umi-rsi',
        enunciado: '¿Qué representa el nemotécnico SOAPME en la preparación de la vía aérea?',
        opciones: ['Suction, Oxygen, Airway, Pharmacology, Monitoring, Equipment', 'Sedation, Oxygen, Airway, Paralysis, Monitoring, Extubation', 'Suction, Oxygenation, Anesthesia, Pretreatment, Muscle relaxant, Extubation', 'Un protocolo exclusivo de extubación'],
        correcta: 0,
        explicacion: 'SOAPME = Suction (aspiración), Oxygen (oxígeno), Airway (vía aérea/Mallampati), Pharmacology (farmacología), Monitoring (monitorización), Equipment (equipo) — checklist de preparación antes de intubar.',
    },
    {
        id: 'umi-q039', tema: 'umi-rsi',
        enunciado: 'En un paciente hemodinámicamente inestable, ¿qué combinación de inducción indica el algoritmo?',
        opciones: ['Fentanilo 0,5-1 mcg/kg + etomidato 0,2 mg/kg (o midazolam 0,1-0,15 mg/kg)', 'Fentanilo 2-4 mcg/kg + propofol 2 mg/kg', 'Solo succinilcolina, sin sedante previo', 'Ketamina en dosis única sin fentanilo'],
        correcta: 0,
        explicacion: 'En pacientes inestables se reduce la dosis de opioide y se prefiere etomidato (mejor perfil hemodinámico) o midazolam a dosis baja, frente a la combinación de mayor dosis usada en pacientes estables.',
    },
    {
        id: 'umi-q040', tema: 'umi-rsi', tipo: 'redactar',
        enunciado: 'Explica para qué sirve la maniobra de Sellick (compresión cricoidea) durante la preoxigenación, y en qué momento de la SIR se aplica.',
        respuestaModelo: 'La maniobra de Sellick consiste en comprimir el cartílago cricoides contra la columna cervical, lo que colapsa mecánicamente la luz del esófago (situado justo detrás de la tráquea). Su objetivo es evitar que el contenido gástrico regurgite pasivamente hacia la faringe y sea aspirado hacia la vía aérea durante la inducción — un riesgo real porque en la SIR el paciente pierde sus reflejos protectores (tos, deglución) antes de tener el tubo endotraqueal asegurado. Se aplica durante el Paso 2 (preoxigenación, con la mascarilla de reservorio a FiO₂=1) y se mantiene hasta confirmar la correcta colocación del tubo, especialmente si se usa ambú/pieza en T (que insufla aire y puede distender el estómago, aumentando el riesgo de regurgitación) — el manual señala explícitamente evitar su uso si es posible y recurrir a la maniobra "si es necesario".',
    },

    // ---- Ficha IX: Programación inicial del respirador ----
    {
        id: 'umi-q041', tema: 'umi-respirador',
        enunciado: '¿Sobre qué peso se calcula el volumen tidal inicial (6-8 ml/kg)?',
        opciones: ['El peso corporal predicho (PBW), no el peso real', 'El peso real del paciente', 'El peso ideal por índice de Broca', 'El peso ajustado por obesidad'],
        correcta: 0,
        explicacion: 'El volumen tidal protector se calcula sobre el PBW (peso corporal predicho, función de la altura y el sexo) — usar el peso real sobreestima el volumen en pacientes obesos y favorece el barotrauma.',
    },
    {
        id: 'umi-q042', tema: 'umi-respirador',
        enunciado: 'Según la fórmula del manual, ¿cuál es el PBW de un hombre de 180 cm?',
        opciones: ['≈75,1 kg', '≈50 kg', '≈90 kg', '≈65 kg'],
        correcta: 0,
        explicacion: 'PBW hombre = 50 + 0,91×(180−152,4) = 50 + 0,91×27,6 ≈ 50 + 25,1 = 75,1 kg.',
    },
    {
        id: 'umi-q043', tema: 'umi-respirador',
        enunciado: '¿Cuál es la modalidad ventilatoria y la PEEP de inicio recomendadas al programar el respirador por primera vez?',
        opciones: ['Asistida-controlada por volumen, PEEP 5-8 cmH₂O', 'Presión de soporte, PEEP 0', 'APRV, PEEP alta fija de 20', 'Ventilación espontánea con CPAP puro'],
        correcta: 0,
        explicacion: 'La programación inicial del manual es asistida-controlada por volumen, con PEEP 5-8 cmH₂O y FiO₂ al 100% de partida, ajustándose después según la tabla FiO₂/PEEP.',
    },
    {
        id: 'umi-q044', tema: 'umi-respirador',
        enunciado: '¿Qué elemento del checklist del respirador se verifica ANTES de conectar al paciente, usando un simulador?',
        opciones: ['El adecuado funcionamiento del ventilador', 'La auscultación de ambos campos pulmonares del paciente', 'El volumen espirado real del paciente', 'El correcto ciclado en el paciente ya conectado'],
        correcta: 0,
        explicacion: 'El checklist exige verificar el funcionamiento del ventilador con un simulador de pulmón artificial antes de conectarlo al paciente — los pasos de auscultación/ciclado/volumen espirado son posteriores, ya con el paciente conectado.',
    },
    {
        id: 'umi-q045', tema: 'umi-respirador', tipo: 'redactar',
        enunciado: 'Explica por qué la tabla FiO₂/PEEP de la ARDS Network vincula ambos parámetros en vez de subirlos de forma independiente.',
        respuestaModelo: 'La tabla FiO₂/PEEP acopla ambos parámetros porque persiguen el mismo objetivo (mantener una oxigenación adecuada) por 2 mecanismos distintos y complementarios: la FiO₂ aumenta directamente la cantidad de oxígeno disponible en el gas inspirado, mientras que la PEEP mejora la oxigenación de forma indirecta, reclutando alvéolos colapsados y aumentando la capacidad residual funcional. Subir solo la FiO₂ de forma indefinida expone al pulmón a toxicidad por oxígeno sin abordar el problema de fondo (alvéolos colapsados que no participan en el intercambio gaseoso); subir solo la PEEP sin ajustar la FiO₂ puede ser insuficiente en hipoxemias graves y aumenta el riesgo de barotrauma/inestabilidad hemodinámica por la presión intratorácica elevada. La tabla escalona ambos juntos, de menor a mayor gravedad, para que el manejo de la oxigenación sea protocolizado y reproducible entre distintos profesionales, en vez de depender del criterio individual de cada uno en cada turno.',
    },

    // ---- Ficha X: Criterios de extubación y brecha aniónica ----
    {
        id: 'umi-q046', tema: 'umi-extubacion',
        enunciado: '¿Cuál de estos es un criterio REQUERIDO (no opcional) para valorar la extubación?',
        opciones: ['pH >7,25', 'Hb >8 mg/dl', 'Temperatura central ≤38°', 'Estado mental alerta'],
        correcta: 0,
        explicacion: 'pH >7,25 es uno de los 5 criterios requeridos, junto a mejoría de la causa, oxigenación adecuada, estabilidad hemodinámica y capacidad de esfuerzo inspiratorio. Hb, temperatura y estado mental son criterios adicionales, opcionales.',
    },
    {
        id: 'umi-q047', tema: 'umi-extubacion',
        enunciado: 'En un paciente con hipoxemia crónica de base, ¿qué valor de PaFi se considera aceptable para extubar, aunque sea menor al umbral estándar de 150?',
        opciones: ['PaFi >120', 'PaFi >300', 'PaFi >80', 'No hay excepción posible para hipoxemia crónica'],
        correcta: 0,
        explicacion: 'El manual señala explícitamente que "algunos pacientes con hipoxemia crónica, PaFi >120 es aceptable" — un ajuste realista frente al umbral general de PaO₂/FiO₂ >150.',
    },
    {
        id: 'umi-q048', tema: 'umi-extubacion',
        enunciado: '¿Cuál es la fórmula de la brecha aniónica?',
        opciones: ['(Na⁺ + K⁺) − (Cl⁻ + HCO₃⁻)', '(Na⁺ − K⁺) + (Cl⁻ − HCO₃⁻)', 'Na⁺ / (Cl⁻ + HCO₃⁻)', '(Cl⁻ + HCO₃⁻) − (Na⁺ + K⁺)'],
        correcta: 0,
        explicacion: 'Brecha aniónica = (Na⁺+K⁺) − (Cl⁻−HCO₃⁻), normal <15. Es una herramienta rápida de cabecera para orientar el diagnóstico diferencial de la acidosis metabólica.',
    },
    {
        id: 'umi-q049', tema: 'umi-extubacion',
        enunciado: '¿Cuál de estas causas NO está en la lista de causas de brecha aniónica elevada (>15) del manual?',
        opciones: ['Hipopotasemia', 'Metanol', 'Cetosis', 'Salicilato'],
        correcta: 0,
        explicacion: 'La lista del manual es: metanol, urea (uremia), cetosis, paraldehído, isoniacida, hierro, lactato, etanol, salicilato — la hipopotasemia no forma parte de esa lista de causas de hiato aniónico elevado.',
    },
    {
        id: 'umi-q050', tema: 'umi-extubacion', tipo: 'redactar',
        enunciado: 'Explica por qué los 5 criterios de extubación se dividen en "requeridos" y "opcionales", y qué implicación práctica tiene esa distinción.',
        respuestaModelo: 'Los criterios requeridos representan condiciones fisiológicas mínimas sin las cuales la extubación tiene un riesgo alto de fracaso inmediato: si la causa de la insuficiencia respiratoria no ha mejorado, si la oxigenación sigue siendo inadecuada, si el paciente está acidótico, hemodinámicamente inestable, o no puede iniciar esfuerzo inspiratorio propio, retirar el tubo endotraqueal expone a una reintubación urgente en minutos. Los criterios opcionales (Hb, temperatura, estado mental), en cambio, son factores que influyen en el éxito de la extubación pero no la contraindican de forma absoluta por sí solos — un paciente puede extubarse con éxito con Hb 7,5 g/dl o algo de fiebre si todo lo demás está en orden, aunque esos factores aumenten el riesgo de fracaso y merezcan vigilancia más estrecha tras retirar el tubo. La implicación práctica es que un solo criterio opcional incumplido no debe posponer automáticamente la extubación, mientras que cualquier criterio requerido incumplido sí debe hacerlo.',
    },

    // ---- Ficha XI: Protocolo BLUE: ecografía pulmonar ----
    {
        id: 'umi-q051', tema: 'umi-blue',
        enunciado: '¿Cuál es el primer paso del protocolo BLUE?',
        opciones: ['Valorar la presencia de sliding pulmonar', 'Buscar directamente el PLAPS', 'Medir la PaO₂/FiO₂', 'Auscultar los 4 campos pulmonares'],
        correcta: 0,
        explicacion: 'El Paso 1 del protocolo BLUE es valorar la presencia de sliding pulmonar (superior e inferior) — de ahí se ramifica todo el árbol diagnóstico siguiente.',
    },
    {
        id: 'umi-q052', tema: 'umi-blue',
        enunciado: 'Con sliding pulmonar bilateral presente y líneas B++ en el plano anterior, ¿cuál es el diagnóstico del protocolo BLUE?',
        opciones: ['Edema pulmonar', 'Neumotórax', 'EPOC/asma', 'Embolismo pulmonar'],
        correcta: 0,
        explicacion: 'Sliding bilateral + líneas B++ bilaterales es el patrón del edema pulmonar cardiogénico — las líneas B reflejan síndrome intersticial-alveolar difuso.',
    },
    {
        id: 'umi-q053', tema: 'umi-blue',
        enunciado: '¿Qué signo ecográfico es necesario, además de la ausencia de sliding y líneas A++, para diagnosticar neumotórax con el protocolo BLUE?',
        opciones: ['El "lung point" (punto pulmonar)', 'El signo de la cola de cometa', 'El signo del sinusoide', 'La línea de PLAPS'],
        correcta: 0,
        explicacion: 'El "lung point" —el punto de transición entre pulmón con sliding y sin sliding— es el signo específico que confirma el neumotórax dentro del algoritmo BLUE, distinto de la simple ausencia de sliding (que también puede darse en intubación selectiva o apnea).',
    },
    {
        id: 'umi-q054', tema: 'umi-blue',
        enunciado: 'Con sliding bilateral, líneas A y trombosis venosa confirmada, junto a PLAPS positivo, ¿qué diagnóstico sugiere el protocolo?',
        opciones: ['Embolismo pulmonar', 'Neumonía', 'Edema pulmonar', 'Neumotórax'],
        correcta: 0,
        explicacion: 'La combinación de líneas A (pulmón "seco"), trombosis venosa en el estudio y PLAPS positivo orienta a embolismo pulmonar — el infarto pulmonar séptico que puede generar la condensación posterolateral detectada como PLAPS.',
    },
    {
        id: 'umi-q055', tema: 'umi-blue', tipo: 'redactar',
        enunciado: 'Explica por qué el protocolo BLUE distingue entre líneas A y líneas B, y qué representa fisiopatológicamente cada patrón.',
        respuestaModelo: 'Las líneas A son artefactos de reverberación horizontal que aparecen cuando el ultrasonido rebota entre la pleura y el transductor a través de un pulmón normalmente aireado — representan un parénquima pulmonar con contenido de aire predominante, típico del pulmón sano, del EPOC/asma (hiperinsuflado) y del neumotórax (donde el aire pleural también genera este patrón). Las líneas B, en cambio, son artefactos verticales ("cola de cometa") que se originan cuando el engrosamiento de los tabiques interlobulillares por líquido o la ocupación alveolar por edema alteran la impedancia acústica normal del pulmón aireado — representan síndrome intersticial-alveolar, típico del edema pulmonar cardiogénico (líneas B difusas y bilaterales) o de la neumonía (líneas B más focales/asimétricas). Esta distinción es la que permite al protocolo BLUE separar, en segundos y sin radiación, un pulmón "seco" (líneas A: EPOC, TEP, neumotórax) de un pulmón "húmedo" (líneas B: edema, neumonía) como primer gran bifurcación diagnóstica.',
    },

    // ---- Ficha XII: Cirugía cardiaca: anticoagulación y sangrado ----
    {
        id: 'umi-q056', tema: 'umi-cirugia-cardiaca',
        enunciado: 'Tras un recambio valvular mecánico, ¿cuándo se inicia la anticoagulación con heparina sódica según el protocolo?',
        opciones: ['Cuando el sangrado es <50 ml/h durante más de 5h', 'Inmediatamente al llegar a la UMI, sin esperar', 'Solo tras confirmar Hb >10 g/dl', 'A las 72h fijas del postoperatorio'],
        correcta: 0,
        explicacion: 'El protocolo exige un sangrado ya controlado (<50 ml/h) sostenido más de 5h antes de iniciar la anticoagulación — priorizando la hemostasia inicial sobre el inicio precoz de la anticoagulación.',
    },
    {
        id: 'umi-q057', tema: 'umi-cirugia-cardiaca',
        enunciado: '¿Cuál es el objetivo de rAPTT (ratio sobre control) en la anticoagulación postoperatoria de cirugía cardiaca?',
        opciones: ['1,5-2,3 veces el control', '1-1,2 veces el control', '3-4 veces el control', 'No se usa rAPTT en este protocolo'],
        correcta: 0,
        explicacion: 'El objetivo es un APTT alargado 1,5-2,3 veces sobre el control — dentro de esa banda no se hacen cambios, y se repite el control a las 24h.',
    },
    {
        id: 'umi-q058', tema: 'umi-cirugia-cardiaca',
        enunciado: 'En el algoritmo de sangrado post-CCV, ¿qué hallazgo del tromboelastograma indica el uso de desmopresina?',
        opciones: ['Amplitud máxima <45', 'Fibrinógeno <150 mg/dl', 'Plaquetas <100.000', 'TCA >140 seg'],
        correcta: 0,
        explicacion: 'Una amplitud máxima <45 en el TEG orienta a disfunción plaquetaria funcional — el algoritmo indica desmopresina 0,3 μg/kg en ese punto, distinto de los otros hallazgos (que orientan a protamina, transfusión de plaquetas o crioprecipitados respectivamente).',
    },
    {
        id: 'umi-q059', tema: 'umi-cirugia-cardiaca',
        enunciado: '¿Cuál de estos débitos de drenaje NO se considera, por sí solo, sangrado anormal según el manual?',
        opciones: ['5 ml/kg en la 2ª hora, con Hb estable >8', '>300 ml en la 1ª hora', '>1000 ml en las 4 primeras horas', 'Aumento súbito de 300 a 500 ml/h durante 3h consecutivas'],
        correcta: 0,
        explicacion: '5 ml/kg en la 2ª hora está por debajo del corte real (>7 ml/kg o >400 ml en la 2ª hora) y coincide con el rango de "sangrado normal" (1,5-2 ml/kg/h) si la evaluación clínica (T°, pH, Ca²⁺, Hb) es también normal.',
    },
    {
        id: 'umi-q060', tema: 'umi-cirugia-cardiaca', tipo: 'redactar',
        enunciado: 'Explica por qué el algoritmo de sangrado post-CCV recorre coagulación (TCA/TEG) antes que plaquetas, antes que fibrinógeno, en vez de pedir todo a la vez y corregir sin orden.',
        respuestaModelo: 'El algoritmo sigue la cascada real de la hemostasia, del componente más "corriente arriba" al más específico: primero comprueba que la propia heparina de la bomba de circulación extracorpórea esté bien neutralizada (TCA >140seg → protamina), porque un exceso de heparina residual simularía cualquier otro defecto de coagulación y llevaría a transfusiones innecesarias si se corrige en el orden equivocado. Después evalúa el tiempo de coagulación global (TEG >1,5 → plasma), luego el número de plaquetas, luego su función (amplitud máxima del TEG → desmopresina), y por último el fibrinógeno (crioprecipitados). Corregir en este orden evita tratar un síntoma (p. ej. transfundir plaquetas) cuando la causa real es otra (heparina residual o déficit de fibrinógeno) — y es exactamente el mismo principio que justifica pedir un tromboelastograma completo en vez de una coagulación convencional (PT/PTT/plaquetas por separado), que no distingue estos escalones con la misma rapidez.',
    },

    // ---- Ficha XIII: Hemodinámica invasiva y protocolo Swan-Ganz ----
    {
        id: 'umi-q061', tema: 'umi-hemodinamica',
        enunciado: 'Un paciente con PVC alta, PAPM alta, PEP alta, TAM baja, GC bajo y RVS alta tras un IAM presenta un patrón de:',
        opciones: ['Shock cardiogénico', 'Shock hipovolémico', 'Shock distributivo por sepsis', 'Shock anafiláctico'],
        correcta: 0,
        explicacion: 'Ese patrón (PVC/PAPM/PEP altas, TAM baja, GC bajo, RVS alta) es el del shock cardiogénico — idéntico en la tabla al del shock obstructivo salvo por la PEP (normal/baja en obstructivo vs. alta en cardiogénico).',
    },
    {
        id: 'umi-q062', tema: 'umi-hemodinamica',
        enunciado: 'En el protocolo Swan-Ganz, si la SvO₂ es baja (<60%) y la SaO₂ es normal (>95%), ¿qué se evalúa a continuación?',
        opciones: ['El gasto cardíaco', 'Aumentar la PEEP directamente', 'Suspender la sedación', 'Transfundir sin más evaluación'],
        correcta: 0,
        explicacion: 'Con SaO₂ normal descartada la hipoxemia como causa, el protocolo dirige la evaluación hacia el gasto cardíaco (alto o bajo) como siguiente paso del árbol de decisión.',
    },
    {
        id: 'umi-q063', tema: 'umi-hemodinamica',
        enunciado: 'Con gasto cardíaco bajo y PEP/IVTDVD elevados (>18 mmHg / >140 ml/m²), ¿qué indica el manual como acción?',
        opciones: ['Dobutamina (disfunción miocárdica)', 'Fluidos (hipovolemia)', 'Diuréticos únicamente', 'Vasodilatadores puros'],
        correcta: 0,
        explicacion: 'PEP/IVTDVD altos con GC bajo sugieren disfunción miocárdica (el corazón ya está "lleno" pero no expulsa) — el protocolo indica dobutamina, no más fluidos (que sí estaría indicado si la PEP/IVTDVD fueran bajas).',
    },
    {
        id: 'umi-q064', tema: 'umi-hemodinamica',
        enunciado: '¿Qué fórmula corresponde a la resistencia vascular sistémica (RVS)?',
        opciones: ['[PAM−PVC]/GC × 80', 'GC/SC', 'Hb×1,34×%saturación venosa', '[VS×(PAM−POAP)]/SC × 0,0136'],
        correcta: 0,
        explicacion: 'RVS = [PAM−PVC]/GC × 80 (dina×s×cm⁻⁵). Las otras fórmulas corresponden a índice cardíaco, saturación venosa mixta e ITSVI respectivamente.',
    },
    {
        id: 'umi-q065', tema: 'umi-hemodinamica', tipo: 'redactar',
        enunciado: 'Explica por qué el shock cardiogénico y el shock obstructivo comparten exactamente el mismo patrón de PVC/GC/RVS en la tabla, y cómo se distinguen en la práctica.',
        respuestaModelo: 'Ambos son, en esencia, formas de "fallo de bomba" desde el punto de vista puramente hemodinámico: algo impide que el corazón eyecte sangre de forma eficaz, así que la sangre se acumula "aguas arriba" (PVC alta) mientras el gasto cardíaco cae (GC bajo) y el organismo compensa con vasoconstricción periférica (RVS alta). La diferencia está en el mecanismo, no en el patrón de presiones: en el shock cardiogénico el problema es intrínseco al miocardio (isquemia, arritmia, valvulopatía aguda) — el músculo cardíaco en sí falla. En el shock obstructivo el corazón es funcionalmente normal, pero algo externo bloquea mecánicamente el llenado o la eyección — taponamiento pericárdico, neumotórax a tensión, o una embolia pulmonar masiva que obstruye el tracto de salida del VD. Por eso el patrón hemodinámico por sí solo no los distingue: hace falta la historia clínica y, sobre todo, una ecocardiografía (FATE) que muestre derrame pericárdico, dilatación aguda del VD, o ausencia de contractilidad segmentaria isquémica, para saber cuál de los dos es.',
    },

    // ---- Ficha XIV: Ecocardiografía FATE a pie de cama ----
    {
        id: 'umi-q066', tema: 'umi-fate',
        enunciado: '¿Cuántas posiciones (ventanas) básicas componen el protocolo FATE estándar?',
        opciones: ['4', '2', '6', '8'],
        correcta: 0,
        explicacion: 'El FATE básico usa 4 posiciones: subcostal 4-cámaras, apical 4-cámaras, paraesternal eje largo (con su variante de eje corto de VI), y escaneo pleural.',
    },
    {
        id: 'umi-q067', tema: 'umi-fate',
        enunciado: 'En la estimación visual de la función sistólica del VI, si la válvula mitral se acerca al septo a menos de 1 cm, ¿qué se puede estimar?',
        opciones: ['FEVI >40%', 'FEVI <20%', 'Derrame pericárdico significativo', 'Disfunción diastólica grave'],
        correcta: 0,
        explicacion: 'El movimiento de la válvula mitral hacia el septo (<1 cm de distancia) es uno de los 3 signos visuales de función sistólica conservada del VI, junto al movimiento endocárdico simétrico y el engrosamiento miocárdico ≥40%.',
    },
    {
        id: 'umi-q068', tema: 'umi-fate',
        enunciado: 'En ventilación mecánica sin esfuerzo respiratorio, ¿a partir de qué índice de colapsabilidad de la VCI se considera al paciente respondedor a volumen?',
        opciones: ['>18%', '>40%', '>5%', '>90%'],
        correcta: 0,
        explicacion: 'En VM sin esfuerzo respiratorio el corte es >18% (fórmula (Dmáx−Dmín)×100/Dmín) — distinto del >40% que se usa en ventilación espontánea: el manual separa fórmula y corte por modo (pág. 70).',
    },
    {
        id: 'umi-q068b', tema: 'umi-fate',
        enunciado: 'Encuentra el error. Paciente en VM sin esfuerzo respiratorio; VCI subcostal: Dmáx 2,0 cm y Dmín 1,7 cm. El residente calcula (2,0−1,7)/2,0 = 15 %, "no llega al 40 %: no responde a volumen". ¿Dónde está el error de su razonamiento?',
        opciones: [
            'Usó la fórmula y el corte de espontánea: en VM sin esfuerzo da 17,6 %, bajo el 18 %',
            'Con la fórmula general da 16 %, más del 12 %: sí responde',
            'Nada: el 40 % vale igual en VM y la cuenta es correcta',
            'Debería haber estimado la PAD con el diámetro de 2,0 cm de la tabla del FATE y haber dado 15 mmHg como resultado',
        ],
        correcta: 0,
        explicacion: 'El >40 % es el corte de la ventilación espontánea. En VM sin esfuerzo respiratorio el manual (pág. 70) usa (Dmáx−Dmín)×100/Dmín: (2,0−1,7)×100/1,7 = 17,6 %, que toca la fila del 18 % y no la supera. Con estos diámetros las dos filas de VM dan veredictos distintos: la fórmula general, (2,0−1,7)×100/[0,5×(1,7+2,0)] = 16,2 %, supera el 12 %; pero esa fila no es la de este paciente, que no hace esfuerzo. Con la cuenta de espontánea, otros diámetros (2,0 y 1,6 cm) habrían dado 20 %, bajo el 40 %, cuando el índice de VM es 25 %, sobre el 18 %.',
    },
    {
        id: 'umi-q068c', tema: 'umi-fate',
        enunciado: 'Paciente en VM con VCI de 2,4 cm. El residente quiere dar una PAD de 15 mmHg con la tabla de diámetro y colapso respiratorio del FATE. ¿Qué respondes?',
        opciones: [
            'El manual no da bandas de PAD para VM (pág. 70): con VM no se estima la PAD por la VCI',
            'Es correcto: la tabla de diámetro y colapso vale igual en cualquier modo ventilatorio, también con VM',
            'Es correcto si además el índice de VM supera el 18 %, porque entonces la VCI refleja la presión auricular',
            'Vale si la VCI colapsa más del 50 % con cada insuflación',
        ],
        correcta: 0,
        explicacion: 'El manual no da bandas de PAD para VM (pág. 70): con VM, esta app no estima la PAD por la VCI. Para la VM el manual solo da fórmulas e índices de colapsabilidad (>18 % y >12 %); las bandas de PAD (3 / 8 / 15 mmHg) del Cuadro I se basan en el colapso respiratorio y no tienen versión para VM. El manual tampoco da ningún factor de corrección.',
    },
    {
        id: 'umi-q069', tema: 'umi-fate',
        enunciado: '¿Cuál de estas NO es una de las 6 preguntas del examen FATE sistemático?',
        opciones: ['Medir la fracción de eyección exacta por Simpson biplano', 'Buscar patología obvia', 'Evaluar la función biventricular', 'Explorar pleura en ambos lados'],
        correcta: 0,
        explicacion: 'El FATE es deliberadamente un examen dirigido y cualitativo (estimación visual), no un estudio completo con medición exacta por Simpson — esa es precisamente la diferencia con una ecocardiografía reglada por cardiología.',
    },
    {
        id: 'umi-q070', tema: 'umi-fate', tipo: 'redactar',
        enunciado: 'Explica qué distingue al FATE "básico" del FATE "extendido", y cuándo tendría sentido pasar del primero al segundo.',
        respuestaModelo: 'El FATE básico se limita a las 4 posiciones estándar (subcostal, apical 4-cámaras, paraesternal eje largo y su eje corto, y el escaneo pleural), pensadas para responder preguntas binarias rápidas: ¿hay derrame?, ¿está dilatado el VD?, ¿la función global es normal o está claramente deprimida? El FATE extendido añade ventanas adicionales — vena cava inferior subcostal, eje corto paraesternal de la válvula mitral, aorta paraesternal en eje corto, y las vistas apicales de 5 y 2 cámaras — que permiten estimar la respuesta a volumen (colapsabilidad de la VCI), valorar función diastólica básica (patrón mitral E/A) y explorar estructuras que el FATE básico no cubre bien. Tiene sentido pasar al extendido cuando el hallazgo básico deja una pregunta de manejo sin resolver — por ejemplo, un VD dilatado en el básico que exige valorar la VCI para decidir si el paciente tolerará más volumen.',
    },

    // ---- Ficha XV: Marcapasos: código de 5 letras ----
    {
        id: 'umi-q071', tema: 'umi-marcapasos',
        enunciado: 'En el código NBG de 5 letras, ¿qué describe la 3ª posición?',
        opciones: ['La respuesta (disparado, inhibido, o ambos)', 'La cámara de estimulación', 'La cámara de detección', 'La programabilidad'],
        correcta: 0,
        explicacion: 'Posición 1 = estimulación, 2 = detección, 3 = respuesta (T/I/D), 4 = programabilidad, 5 = función antitaquicardia.',
    },
    {
        id: 'umi-q072', tema: 'umi-marcapasos',
        enunciado: 'Un marcapasos programado como "DDD" estimula y detecta en:',
        opciones: ['Aurícula y ventrículo (doble en ambas posiciones)', 'Solo ventrículo', 'Solo aurícula', 'Ninguna cámara — solo telemetría'],
        correcta: 0,
        explicacion: '"D" en la 1ª y 2ª posición significa "doble" — el dispositivo estimula y detecta tanto en aurícula como en ventrículo.',
    },
    {
        id: 'umi-q073', tema: 'umi-marcapasos',
        enunciado: '¿Qué caracteriza a una indicación de Grupo III?',
        opciones: ['Evidencia/acuerdo general de que el procedimiento es ineficaz, y en algunos casos perjudicial', 'Evidencia sólida de que el procedimiento es beneficioso', 'Evidencia controvertida a favor', 'Indicación de uso exclusivamente pediátrico'],
        correcta: 0,
        explicacion: 'Grupo III = la evidencia/acuerdo general apoya la ineficacia del procedimiento, que incluso puede ser perjudicial en algunos casos — la recomendación opuesta al Grupo I.',
    },
    {
        id: 'umi-q074', tema: 'umi-marcapasos',
        enunciado: 'Dentro del Grupo II, ¿qué distingue a la Clase IIa de la IIb?',
        opciones: ['IIa: la evidencia/opinión se inclina a favor. IIb: se basa en menor evidencia o la opinión mayoritaria es menos favorable', 'IIa es siempre más segura que IIb', 'IIb solo aplica a marcapasos temporales', 'No hay diferencia real entre ambas'],
        correcta: 0,
        explicacion: 'Ambas reflejan evidencia controvertida (Grupo II), pero IIa tiene la balanza de evidencia/opinión a favor de la utilidad, mientras que IIb se apoya en un grado de evidencia menor o una opinión mayoritaria menos favorable.',
    },
    {
        id: 'umi-q075', tema: 'umi-marcapasos', tipo: 'redactar',
        enunciado: 'Describe qué representa la 5ª posición del código NBG y por qué es distinta de las 4 anteriores.',
        respuestaModelo: 'Las primeras 4 posiciones del código NBG describen el comportamiento de estimulación "de base" del dispositivo: qué cámaras estimula, qué cámaras detecta, cómo responde a lo que detecta, y qué tan programable/adaptable a la frecuencia es. La 5ª posición es distinta porque describe una función completamente aparte: la capacidad antitaquicardia del dispositivo — es decir, qué hace el marcapasos si detecta una taquiarritmia, no un ritmo lento. Las opciones son P (estimulación antitaquicardia, "overdrive pacing"), S (choque, como en un DAI) o D (estimulación + choque combinados). Por eso un dispositivo puede tener un código NBG completo de 5 letras (p. ej. "DDDRD") solo si combina funciones de marcapasos convencional con capacidad de cardioversión/desfibrilación, como ocurre en un DAI-resincronizador.',
    },

    // ---- Ficha XVI: Síndrome posparada cardíaca ----
    {
        id: 'umi-q076', tema: 'umi-posparada',
        enunciado: '¿Cuáles son los 4 componentes del síndrome posparada cardíaca?',
        opciones: ['Persistencia de la enfermedad precipitante, daño cerebral posparada, daño miocárdico posparada, SRIS', 'Solo daño cerebral y daño miocárdico', 'Hipoglucemia, hipotermia, acidosis y coagulopatía', 'Shock hipovolémico secundario a la RCP'],
        correcta: 0,
        explicacion: 'Los 4 componentes reales son: persistencia de la enfermedad precipitante, daño cerebral posparada (isquemia + radicales libres + pérdida de autorregulación), daño miocárdico posparada (aturdimiento, disfunción sistodiastólica), y un SRIS que remeda clínicamente a la sepsis.',
    },
    {
        id: 'umi-q077', tema: 'umi-posparada',
        enunciado: '¿Por qué la presión de perfusión cerebral (PPC) pasa a depender directamente de la tensión arterial sistémica tras la parada?',
        opciones: ['Por la pérdida de la autorregulación cerebral', 'Porque la PIC baja a 0 tras la RCP', 'Porque el flujo cerebral deja de depender de la presión', 'Por vasodilatación cerebral farmacológica programada'],
        correcta: 0,
        explicacion: 'La isquemia y los radicales libres de O₂ tóxicos liberados durante la parada producen pérdida de la autorregulación cerebral — el mecanismo que normalmente mantiene el flujo cerebral constante pese a cambios de presión sistémica. Sin autorregulación, la PPC queda directamente ligada a la TA sistémica.',
    },
    {
        id: 'umi-q078', tema: 'umi-posparada',
        enunciado: '¿Cuál es la ventana temporal de la "fase precoz" del SPP, donde las intervenciones podrían tener mayor relevancia?',
        opciones: ['Desde los 20 min hasta las 6-12h tras RCE', 'Solo los primeros 5 minutos', 'De las 72h en adelante', 'Desde el alta hospitalaria'],
        correcta: 0,
        explicacion: 'La fase precoz va de los 20 min (fin de la fase inmediata) hasta las 6-12h — el manual señala explícitamente que las intervenciones en esta ventana podrían tener mayor relevancia sobre el pronóstico.',
    },
    {
        id: 'umi-q079', tema: 'umi-posparada',
        enunciado: 'En el manejo hemodinámico posparada, si la PAM es >100 mmHg, ¿cuál es la acción indicada?',
        opciones: ['Vasodilatadores IV hasta PAM <100, asegurando PVC 8-12', 'Bolo de volumen adicional', 'Iniciar noradrenalina', 'No hacer nada — es un hallazgo esperado tras la RCP'],
        correcta: 0,
        explicacion: 'PAM >100 mmHg orienta a vasodilatadores IV (hasta PAM <100), asegurando PVC 8-12, diuréticos si hay ICC/sobrecarga, y beta-bloqueantes si hay taquicardia y/o SCA con FE normal — la RVS elevada por la propia respuesta al paro no debe dejarse sin corregir.',
    },
    {
        id: 'umi-q080', tema: 'umi-posparada', tipo: 'redactar',
        enunciado: 'Compara el manejo de un paciente con elevación de ST tras RCE frente a uno con GCS <8 sin causa obvia — ¿qué prueba se prioriza en cada caso y por qué?',
        respuestaModelo: 'Si hay elevación de ST o dolor isquémico tras la RCE, el protocolo prioriza el cateterismo (CATE) urgente con intervención coronaria percutánea (ICP) inmediata si procede — la lógica es la misma que en cualquier SCA: el miocardio isquémico sigue perdiéndose mientras no se revasculariza, y la parada cardiaca no cambia esa urgencia, solo la complica. Si en cambio el paciente tiene GCS <8 tras 20 minutos de RCE sin otra causa evidente de coma, el protocolo prioriza en su lugar una TAC craneal dentro de los primeros 120 minutos — porque a esas alturas hay que descartar una causa neurológica primaria de la parada (hemorragia subaracnoidea, ictus) antes de asumir que el bajo nivel de conciencia es solo la encefalopatía anóxica esperable, y porque esa ventana de 120 minutos es también cuando se decide si iniciar hipotermia terapéutica inducida. En ambos casos la prueba elegida ataca la causa más probable y más tiempo-dependiente de cada escenario clínico, no un protocolo genérico único.',
    },

    // ---- Ficha XVII: Fibrilación auricular: algoritmo de anticoagulación ----
    {
        id: 'umi-q081', tema: 'umi-fa-anticoagulacion',
        enunciado: 'En el algoritmo de anticoagulación en FA, ¿qué 2 escenarios anulan la puntuación CHA₂DS₂-VASc por completo y van directos a AVK?',
        opciones: ['Válvulas cardiacas mecánicas o estenosis mitral', 'Edad >75 años o sexo femenino', 'Insuficiencia cardíaca o diabetes', 'Ictus previo o enfermedad vascular'],
        correcta: 0,
        explicacion: 'Válvulas mecánicas o estenosis mitral son la primera pregunta del algoritmo — si la respuesta es "sí", el paciente va directo a AVK (Clase I·A) sin necesidad de calcular CHA₂DS₂-VASc, porque los NACO están contraindicados en ese contexto.',
    },
    {
        id: 'umi-q082', tema: 'umi-fa-anticoagulacion',
        enunciado: 'Con CHA₂DS₂-VASc = 0 puntos, ¿qué recomienda el algoritmo?',
        opciones: ['No están indicados los tratamientos antiagregante ni anticoagulante (Clase III·B)', 'Anticoagulación oral obligatoria', 'Antiagregación con AAS', 'Oclusor de orejuela izquierda de rutina'],
        correcta: 0,
        explicacion: 'Con 0 puntos, ni la antiagregación ni la anticoagulación están indicadas — es una recomendación Clase III·B (evidencia de ineficacia/perjuicio).',
    },
    {
        id: 'umi-q083', tema: 'umi-fa-anticoagulacion',
        enunciado: 'Con CHA₂DS₂-VASc ≥2 puntos, ¿qué anticoagulante se prefiere entre NACO y AVK?',
        opciones: ['NACO, preferido sobre AVK (ambos Clase I·A)', 'AVK siempre, sin excepción', 'Ninguno — solo antiagregación doble', 'Depende exclusivamente de la edad'],
        correcta: 0,
        explicacion: 'Con ≥2 puntos la anticoagulación está indicada, y el algoritmo prefiere los NACO sobre los AVK — ambos con Clase de recomendación I·A, pero el orden de preferencia es explícito.',
    },
    {
        id: 'umi-q084', tema: 'umi-fa-anticoagulacion',
        enunciado: 'Si la anticoagulación oral está contraindicada en un paciente de alto riesgo, ¿qué alternativa contempla el algoritmo?',
        opciones: ['Oclusores de la orejuela izquierda (Clase IIb·C)', 'Doble antiagregación indefinida como sustituto equivalente', 'Suspender cualquier profilaxis de ictus', 'AVK a dosis reducida sin control de INR'],
        correcta: 0,
        explicacion: 'El algoritmo contempla, tras evaluar y corregir los factores de riesgo hemorrágico reversibles, el uso de oclusores de la orejuela izquierda para pacientes con contraindicaciones claras a la anticoagulación oral — Clase IIb·C.',
    },
    {
        id: 'umi-q085', tema: 'umi-fa-anticoagulacion', tipo: 'redactar',
        enunciado: 'Explica por qué este algoritmo no incluye una calculadora nueva de CHA₂DS₂-VASc, y dónde vive esa calculadora dentro de la app.',
        respuestaModelo: 'La puntuación CHA₂DS₂-VASc en sí (8 ítems puntuables — insuficiencia cardíaca, hipertensión, edad ≥75, diabetes, ictus/AIT previo, enfermedad vascular, edad 65-74, sexo femenino — con un semáforo de riesgo por corte de puntos) ya existe como calculadora interactiva real en Merino Cardiología, Ficha XVII ("FA: cardioversión y prevención de ictus"), construida a partir de la fuente de Marino. Duplicarla aquí con una segunda implementación habría arriesgado una inconsistencia de cifras entre dos calculadoras del mismo score dentro de la misma app — el mismo criterio que ya sigue el proyecto en otros cruces entre especialidades (p. ej. remitir a una calculadora ya existente en vez de reimplementarla). Por eso esta ficha se limita a desarrollar el árbol de decisión completo alrededor de la puntuación (qué hacer antes, durante y después de calcularla), y enlaza por texto a la ficha donde la calculadora numérica ya vive.',
    },

    // ---- Ficha XVIII: Control glucémico: algoritmos y pauta móvil ----
    {
        id: 'umi-q086', tema: 'umi-glucemia',
        enunciado: '¿Por qué vía se debe administrar la insulina rápida si el paciente está en shock o con catecolaminas?',
        opciones: ['Intravenosa', 'Subcutánea, sin excepción', 'Intramuscular', 'Oral'],
        correcta: 0,
        explicacion: 'La vía subcutánea solo es fiable con perfusión periférica normal — en shock o con catecolaminas la absorción subcutánea es errática, así que el manual exige la vía intravenosa en esos escenarios.',
    },
    {
        id: 'umi-q087', tema: 'umi-glucemia',
        enunciado: '¿Qué tipo de muestra de sangre se debe usar SIEMPRE para el control de glucemia en perfusión de insulina, según el manual?',
        opciones: ['Sangre arterial o de vía venosa central — nunca capilar', 'Sangre capilar, por ser más rápida', 'Sangre venosa periférica indistintamente', 'Depende del turno de enfermería'],
        correcta: 0,
        explicacion: 'El manual lo remarca explícitamente: "siempre sangre arterial o VVC, nunca capilar" — la glucemia capilar es menos fiable en el paciente crítico con mala perfusión periférica, justo el escenario donde más se usa este protocolo.',
    },
    {
        id: 'umi-q088', tema: 'umi-glucemia',
        enunciado: '¿Qué pacientes comienzan directamente en el Algoritmo II (más intensivo) en vez del Algoritmo I?',
        opciones: ['Pacientes con catecolaminas, postoperados, tratamiento corticoideo, NTP, o diabéticos insulinizados', 'Todos los pacientes sin excepción', 'Solo los pacientes con glucemia inicial >300 mg/dl', 'Ninguno — todos empiezan siempre en el Algoritmo I'],
        correcta: 0,
        explicacion: 'Catecolaminas/postoperados, corticoides, NTP y diabetes I/II insulinizada son las 4 categorías que arrancan en el Algoritmo II — el resto de pacientes comienza en el Algoritmo I, más conservador.',
    },
    {
        id: 'umi-q089', tema: 'umi-glucemia',
        enunciado: '¿Qué se debe hacer si la glucemia se mantiene >180 mg/dl durante 2 horas seguidas?',
        opciones: ['Pasar al algoritmo superior (más intensivo)', 'Pasar al algoritmo inferior', 'Suspender la perfusión de insulina', 'No cambiar nada hasta las 6h'],
        correcta: 0,
        explicacion: 'Glucemia >180 sostenida 2h → algoritmo superior (más UI por tramo de glucemia); glucemia <120 sostenida 2h → algoritmo inferior — el protocolo se autoajusta según la respuesta real del paciente.',
    },
    {
        id: 'umi-q090', tema: 'umi-glucemia', tipo: 'redactar',
        enunciado: 'Explica la lógica de tener 6 algoritmos distintos (I-VI) en vez de un único protocolo de perfusión de insulina para todos los pacientes.',
        respuestaModelo: 'Los 6 algoritmos representan 6 niveles de intensidad creciente de dosificación de insulina para el mismo rango de glucemia — el Algoritmo I da las dosis más bajas por tramo, y el VI las más altas (p. ej. ante una glucemia de 210-239 mg/dl, el Algoritmo I indica 1,5 UI mientras que el VI indica 12 UI para la misma cifra). Esto existe porque la sensibilidad a la insulina varía enormemente entre pacientes y a lo largo del ingreso de un mismo paciente: alguien con tratamiento corticoideo, en shock con catecolaminas, o con nutrición parenteral, típicamente tiene una resistencia a la insulina mucho mayor que un paciente sin esos factores, y necesitaría dosis mucho más altas para el mismo objetivo de glucemia si se usara siempre el mismo algoritmo — de ahí que esos 4 grupos arranquen directamente en el Algoritmo II. El sistema de "subir" o "bajar" de algoritmo según la respuesta real a las 2h (en vez de fijar uno solo desde el ingreso hasta el alta) permite que el protocolo se adapte de forma dinámica a los cambios de sensibilidad a la insulina que ocurren durante la propia evolución del paciente crítico — por ejemplo, al retirar corticoides o catecolaminas, sin que el equipo tenga que rediseñar el protocolo de insulina desde cero cada vez.',
    },

    // ---- Ficha XIX: Sedación (RASS y Ramsay) ----
    {
        id: 'umi-q091', tema: 'umi-sedacion',
        enunciado: 'Un paciente no está despierto. Al llamarle por su nombre abre los ojos y te mira, pero aparta la mirada a los 5 segundos. ¿Qué RASS tiene?',
        opciones: ['−2 (sedación ligera)', '−1 (adormilado)', '−3 (sedación moderada)', '−4 (sedación profunda)'],
        correcta: 0,
        explicacion: 'Despierta con la voz y mantiene el contacto visual menos de 10 s: −2. Más de 10 s sería −1; abrir los ojos sin dirigir la mirada, −3.',
    },
    {
        id: 'umi-q092', tema: 'umi-sedacion',
        enunciado: 'Según el procedimiento del manual, ¿cuándo se estimula físicamente al paciente (palmadas en el hombro o frotar el esternón) para puntuar la RASS?',
        opciones: ['Solo si no responde a la llamada por su nombre', 'Siempre, como primer paso', 'Solo si está agitado', 'Antes de observarle, para despertarle'],
        correcta: 0,
        explicacion: 'Los 3 pasos van en orden: observar (0 a +4), llamar por el nombre (−1 a −3) y, si no responde, estimular (−4 o −5).',
    },
    {
        id: 'umi-q093', tema: 'umi-sedacion',
        enunciado: '¿Qué describe una RASS +3?',
        opciones: ['Muy agitado: agresivo, se retira tubos y catéteres', 'Combativo: violento', 'Agitado: lucha con el respirador', 'Ansioso: inquieto sin violencia'],
        correcta: 0,
        explicacion: '+4 combativo, +3 muy agitado (se retira tubos y catéteres), +2 agitado (lucha con el respirador), +1 ansioso.',
    },
    {
        id: 'umi-q094', tema: 'umi-sedacion',
        enunciado: 'En la escala de Ramsay, ¿qué nivel corresponde a "respuesta perezosa a la presión glabelar o a estímulos dolorosos"?',
        opciones: ['V', 'IV', 'III', 'VI'],
        correcta: 0,
        explicacion: 'IV es la respuesta rápida a la presión glabelar o al dolor, V la respuesta perezosa y VI la ausencia de respuesta.',
    },
    {
        id: 'umi-q095', tema: 'umi-sedacion', tipo: 'redactar',
        enunciado: 'Explica cómo puntuarías la RASS de un paciente intubado que parece dormido, siguiendo los pasos del manual, y por qué el orden importa.',
        respuestaModelo: 'Primero se observa sin tocarle: si estuviera despierto, inquieto o agitado se puntuaría de 0 a +4. Como parece dormido, se le llama por su nombre y se le pide que abra los ojos y mire al examinador: si abre los ojos y mantiene el contacto visual más de 10 s es −1, menos de 10 s −2, y si solo se mueve o abre los ojos sin dirigir la mirada −3. Solo si no responde a la voz se le estimula con palmadas en el hombro o frotándole el esternón: si abre los ojos o se mueve es −4, y si no responde −5. El orden importa porque cada paso es un estímulo más intenso; si se estimula físicamente desde el principio, un paciente que habría respondido a la voz (−1 a −3) se puntuaría mal y se sobreestimaría o se perdería el nivel real de sedación.',
    },

    // ---- Ficha XX: TCE — clasificación, pronóstico y diagnóstico ----
    {
        id: 'umi-q096', tema: 'umi-tce-dx',
        enunciado: 'Un TCE con Glasgow 11 se clasifica como…',
        opciones: ['Moderado (GCS 9-13)', 'Leve (GCS 14-15)', 'Grave (GCS 3-8)', 'Moderado-grave (GCS 8-12)'],
        correcta: 0,
        explicacion: 'Leve 14-15, moderado 9-13, grave 3-8.',
    },
    {
        id: 'umi-q097', tema: 'umi-tce-dx',
        enunciado: 'Según los factores pronósticos del manual, ¿qué pronóstico tiene la midriasis bilateral arreactiva?',
        opciones: ['Fatal en el 90%', 'Fatal en el 50%', 'Sin valor pronóstico por sí sola', 'Fatal en el 100% desde el primer momento'],
        correcta: 0,
        explicacion: 'Midriasis bilateral arreactiva: pronóstico fatal del 90%. El 100% lo da la respuesta pupilar ausente mantenida 24 h junto con oculocefálicos ausentes.',
    },
    {
        id: 'umi-q098', tema: 'umi-tce-dx',
        enunciado: '¿Cuál de estos hallazgos de la TAC NO está entre los factores de mal pronóstico del manual?',
        opciones: ['Fractura lineal de la bóveda sin otra lesión', 'Ausencia de cisternas basales', 'Desplazamiento de la línea media >5 mm', 'Hematoma intracraneal >15 cc'],
        correcta: 0,
        explicacion: 'Los factores de la TAC son: lesiones profundas (tronco, ganglios de la base), hematomas >15 cc, ausencia de cisternas basales y desplazamiento de la línea media >5 mm.',
    },
    {
        id: 'umi-q099', tema: 'umi-tce-dx',
        enunciado: '¿Cuándo aporta la RNM más que la TAC en el TCE, según el manual?',
        opciones: ['En las lesiones subagudas o crónicas de más de 72 h', 'En las primeras horas del traumatismo', 'Para valorar fracturas craneales', 'Nunca: la TAC siempre es superior'],
        correcta: 0,
        explicacion: 'La TAC es la prueba de referencia; la RNM tiene mayor sensibilidad en lesiones de más de 72 h, y lesiones extensas hemisféricas o del tronco en la RNM empeoran el pronóstico aunque la TAC y la PIC sean normales.',
    },
    {
        id: 'umi-q100', tema: 'umi-tce-dx', tipo: 'redactar',
        enunciado: 'Un TCE grave llega con TAS de 80 mmHg y PaO₂ de 55 mmHg. ¿Por qué el manual los cuenta como factores pronósticos y qué implica para el manejo inicial?',
        respuestaModelo: 'La hipotensión (TAS <90 mmHg, nivel I) y la hipoxia (PaO₂ ≤60 mmHg) están entre los factores de peor pronóstico del manual, y en la hipotensión el peso es proporcional al número de episodios. Son lesiones secundarias: un cerebro ya lesionado tolera mal la falta de flujo y de oxígeno. Por eso el manejo inicial busca corregirlas cuanto antes y no repetirlas: evitar la hipotensión con normovolemia (fluidos isotónicos y noradrenalina), SatO₂ >95% y PaO₂ >100 mmHg, y mantener la PPC (por debajo de 70 mmHg empeora el pronóstico y por debajo de 50 debe evitarse).',
    },

    // ---- Ficha XXI: TCE — manejo escalonado ----
    {
        id: 'umi-q101', tema: 'umi-tce-manejo',
        enunciado: '¿Qué PaCO₂ busca la hiperventilación de primer nivel en el TCE?',
        opciones: ['30-35 mmHg, de forma moderada y transitoria', '25-30 mmHg mantenida', '<25 mmHg desde el ingreso', '40-45 mmHg'],
        correcta: 0,
        explicacion: 'Hiperventilación moderada y transitoria a 30-35 mmHg (nivel III), evitándola las primeras 24 h y sin uso profiláctico (nivel II).',
    },
    {
        id: 'umi-q102', tema: 'umi-tce-manejo',
        enunciado: 'TCE grave, TAC normal, 52 años y TAS 85 mmHg al ingreso, sin focalidad. ¿Está indicado monitorizar la PIC según el manual?',
        opciones: ['Sí: TAC normal con 2 criterios (>40 años y TAS <90)', 'No: con TAC normal nunca está indicada', 'Solo si además hay focalidad motora', 'Solo si el Glasgow es 3'],
        correcta: 0,
        explicacion: 'Con TAC normal hacen falta 2 o más de: >40 años, focalidad motora uni o bilateral, TAS <90 mmHg (nivel III).',
    },
    {
        id: 'umi-q103', tema: 'umi-tce-manejo',
        enunciado: '¿Cuál de estas medidas es de segundo nivel en la hipertensión intracraneal?',
        opciones: ['Barbitúricos a altas dosis', 'Drenaje ventricular externo', 'Terapia hiperosmolar', 'Hiperventilación moderada'],
        correcta: 0,
        explicacion: 'Segundo nivel: craniectomía descompresiva, hipotermia y barbitúricos a altas dosis (con estabilidad hemodinámica antes y durante). Las otras tres son de primer nivel.',
    },
    {
        id: 'umi-q104', tema: 'umi-tce-manejo',
        enunciado: '¿Qué hematoma extradural agudo requiere cirugía según el manual?',
        opciones: ['El de más de 30 cc medido por TAC', 'Cualquiera, sea cual sea su volumen', 'El de más de 50 cc', 'Solo si hay midriasis'],
        correcta: 0,
        explicacion: 'Extradural agudo >30 cc por TAC. El volumen de 50 ml es el de las contusiones frontales o temporales.',
    },
    {
        id: 'umi-q105', tema: 'umi-tce-manejo', tipo: 'redactar',
        enunciado: 'Explica por qué el manual limita la hiperventilación en el TCE (cuánto, cuándo y con qué vigilancia).',
        respuestaModelo: 'La hiperventilación baja la PaCO₂, lo que contrae los vasos cerebrales, reduce el volumen de sangre intracraneal y baja la PIC; pero esa misma vasoconstricción reduce el flujo y puede producir isquemia en un cerebro lesionado. Por eso el manual la deja como medida de primer nivel moderada y transitoria (PaCO₂ 30-35 mmHg, nivel III), la evita las primeras 24 h (nivel III), desaconseja su uso profiláctico (nivel II) y, si se usa, pide monitorizar el aporte de O₂ cerebral (nivel III). Fuera de esa indicación, el objetivo general es la normocapnia.',
    },

    // ---- Ficha XXII: Ondas de PIC ----
    {
        id: 'umi-q106', tema: 'umi-pic-onda',
        enunciado: '¿Qué componente de la onda de PIC refleja sobre todo la distensibilidad (complianza) del cerebro?',
        opciones: ['P2, la onda tidal o de rebote', 'P1, la onda de percusión', 'P3, la onda dicrótica', 'Ninguno: la onda no informa de la distensibilidad'],
        correcta: 0,
        explicacion: 'P2 refleja la complianza cerebral, la parálisis vasomotora, la hinchazón o el edema.',
    },
    {
        id: 'umi-q107', tema: 'umi-pic-onda',
        enunciado: 'En la onda de PIC, P2 supera a P1. ¿Qué indica?',
        opciones: ['Cráneo con baja distensibilidad (onda de alta presión)', 'Onda normal con buena distensibilidad', 'Artefacto del transductor', 'Cierre precoz de la válvula aórtica'],
        correcta: 0,
        explicacion: 'Con buena distensibilidad P1 es el pico mayor; la onda de alta presión, con baja distensibilidad, tiene P2 por encima de P1.',
    },
    {
        id: 'umi-q108', tema: 'umi-pic-onda',
        enunciado: 'Según el texto del manual, ¿a qué corresponde la P3?',
        opciones: ['A la onda dicrótica, por el cierre de la válvula aórtica', 'A la sístole arterial', 'Al rebote del cráneo', 'A la respiración'],
        correcta: 0,
        explicacion: 'P1 percusión (sistólica), P2 tidal o rebote, P3 dicrótica (cierre de la válvula aórtica). La figura del manual rotula la P3 como "venoso", una discrepancia señalada en la ficha.',
    },
    {
        id: 'umi-q109', tema: 'umi-pic-onda',
        enunciado: '¿Con qué inclinación de la cabecera muestra la figura del manual al paciente con drenaje ventricular?',
        opciones: ['30°', '0° (plano)', '45°', '90°'],
        correcta: 0,
        explicacion: 'Cabecera a 30°, la misma posición que piden las medidas generales del TCE.',
    },
    {
        id: 'umi-q110', tema: 'umi-pic-onda', tipo: 'redactar',
        enunciado: 'La PIC de un paciente está en 18 mmHg, pero la morfología de la onda ha cambiado y P2 ya supera a P1. ¿Qué te dice eso y por qué importa aunque la cifra no pase de 20?',
        respuestaModelo: 'Que el cráneo ha perdido distensibilidad: con buena distensibilidad P1 (percusión arterial) es el pico mayor, y cuando P2 (onda tidal, que refleja la complianza, el edema o la hinchazón) la supera, la onda es de alta presión. Importa porque la cifra media todavía es aceptable, pero el sistema está al límite: un pequeño aumento de volumen (sangre, edema, LCR) producirá una subida mucho mayor de la PIC. La forma de la onda avisa antes que el número.',
    },

    // ---- Ficha XXIII: Hidrocefalia y LCR ----
    {
        id: 'umi-q111', tema: 'umi-hidrocefalia',
        enunciado: 'Cuernos frontales de 40 mm y diámetro biparietal máximo de 120 mm. ¿Qué índice de Evans es y qué significa?',
        opciones: ['0,33: hidrocefalia (>0,3)', '0,33: normal', '3,0: hidrocefalia', '0,25: normal'],
        correcta: 0,
        explicacion: 'Evans = cuernos frontales / diámetro biparietal máximo = 40/120 = 0,33. Por encima de 0,3, hidrocefalia.',
    },
    {
        id: 'umi-q112', tema: 'umi-hidrocefalia',
        enunciado: 'Relación cuerno frontal / diámetro interno del 45%. ¿Cómo la clasifica el manual?',
        opciones: ['Límite (borderline)', 'Normal', 'Hidrocefalia', 'No es un criterio de hidrocefalia'],
        correcta: 0,
        explicacion: '<40% normal, 40-50% límite, >50% hidrocefalia.',
    },
    {
        id: 'umi-q113', tema: 'umi-hidrocefalia',
        enunciado: 'LCR con linfocitos altos, glucosa baja y proteínas altas. ¿Qué causas infecciosas sugiere la tabla del manual?',
        opciones: ['TBC, hongos, leptospira, brucella, sífilis, algunos virus, listeria', 'Meningitis bacteriana aguda típica', 'Meningitis vírica con glucosa normal', 'Encefalomielitis postinfecciosa'],
        correcta: 0,
        explicacion: 'Linfocitos altos con glucosa baja: TBC, hongos, leptospira, brucella, sífilis, algunos virus y listeria. La bacteriana típica da PMN altos, y la vírica, glucosa normal.',
    },
    {
        id: 'umi-q114', tema: 'umi-hidrocefalia',
        enunciado: '¿Qué hallazgo de la TAC aparece en el manual como criterio de hidrocefalia junto a los cuernos temporales dilatados?',
        opciones: ['Hipodensidad periventricular', 'Hiperdensidad de los ganglios de la base', 'Desviación de la línea media', 'Calcificación del plexo coroideo'],
        correcta: 0,
        explicacion: 'Cuernos temporales de 2 mm sin surcos ni cisuras visibles, cuerno frontal / diámetro interno >0,5 e hipodensidad periventricular.',
    },
    {
        id: 'umi-q115', tema: 'umi-hidrocefalia', tipo: 'redactar',
        enunciado: 'Un paciente con fiebre tiene un LCR con linfocitos altos, glucosa normal y proteínas elevadas. Según la tabla del manual, ¿qué causas infecciosas y no infecciosas debes considerar?',
        respuestaModelo: 'Linfocitos altos con glucosa normal y proteínas elevadas: entre las infecciosas, meningitis o encefalitis vírica, infecciones parameníngeas (otitis, mastoiditis) y parásitos (toxoplasmosis, cisticercosis, triquinosis); entre las no infecciosas, encefalomielitis postinfecciosa y enfermedades desmielinizantes. La glucosa normal lo separa del grupo con glucosa baja (TBC, hongos, listeria, sífilis…), y el predominio linfocitario lo separa de la bacteriana, que da PMN altos con glucosa baja (aunque la bacteriana, la TBC o la vírica en fase precoz también pueden dar PMN).',
    },

    // ---- Ficha XXIV: Fibrinolisis intraventricular ----
    {
        id: 'umi-q116', tema: 'umi-fibrinolisis-iv',
        enunciado: '¿Cuál de estos es un criterio de exclusión para la fibrinolisis intraventricular?',
        opciones: ['Malformación arteriovenosa', 'Hemorragia intraventricular de 24 h', 'PIC de 18 mmHg', 'DVE bien colocado'],
        correcta: 0,
        explicacion: 'Exclusiones: aneurisma no aislado (no tratado), MAV y coagulopatía.',
    },
    {
        id: 'umi-q117', tema: 'umi-fibrinolisis-iv',
        enunciado: '¿Qué dosis de t-PA es la habitual por el DVE?',
        opciones: ['3-5 mg (máximo 8 mg si están ocupados todos los ventrículos)', '10-20 mg', '0,9 mg/kg', '1 mg'],
        correcta: 0,
        explicacion: 'Rango 3-8 mg, habitual 3-5 mg, máximo 8 mg con todos los ventrículos ocupados; concentración máxima 4 mg/ml.',
    },
    {
        id: 'umi-q118', tema: 'umi-fibrinolisis-iv',
        enunciado: 'Tras inyectar el t-PA se clampa el DVE 2 h. ¿Cuándo se abre antes?',
        opciones: ['Si la PIC supera 25 mmHg, dejando drenar 1-2 ml de LCR', 'Si la PIC supera 15 mmHg', 'A los 30 minutos siempre', 'Nunca antes de las 2 h'],
        correcta: 0,
        explicacion: 'Se clampa 2 h y se abre si la PIC >25 mmHg, dejando drenar 1-2 ml.',
    },
    {
        id: 'umi-q119', tema: 'umi-fibrinolisis-iv',
        enunciado: '¿Cuándo se suspende la fibrinolisis intraventricular?',
        opciones: ['Si aumenta el sangrado, si se aclaran el III y el IV ventrículo, o a los 7 días', 'Tras la primera dosis siempre', 'Cuando la PIC baja de 20 mmHg', 'A las 72 h'],
        correcta: 0,
        explicacion: 'Suspender si aumenta el sangrado intraparenquimatoso o intraventricular, si se aclaran el III y IV ventrículo, o tras un máximo de 7 días. Interrumpir si el DVE está mal colocado.',
    },
    {
        id: 'umi-q120', tema: 'umi-fibrinolisis-iv', tipo: 'redactar',
        enunciado: 'Antes de inyectar t-PA por un drenaje ventricular, ¿qué compruebas y por qué retiras LCR antes de inyectar?',
        respuestaModelo: 'Antes de empezar: que no haya criterios de exclusión (aneurisma no tratado, MAV, coagulopatía) y una TAC que confirme que el DVE está bien colocado y que el sangrado no tiene más de 72 h; con el DVE mal colocado se interrumpe. Durante el procedimiento se monitoriza la PIC de forma continua. Se retira un volumen de LCR igual al del fármaco para no añadir volumen dentro de un cráneo con poca reserva: inyectar sin retirar subiría la PIC. Después se lava con 1-1,5 ml de salino, se clampa 2 h (abriendo si la PIC >25 mmHg) y se controla con TAC cada 12-24 h.',
    },

    // ---- Ficha XXV: Neuroanatomía ----
    {
        id: 'umi-q121', tema: 'umi-neuroanatomia',
        enunciado: 'Ictus con debilidad de la pierna mucho mayor que del brazo y la cara. ¿Qué territorio arterial sugiere la figura del manual?',
        opciones: ['Arteria cerebral anterior', 'Arteria cerebral media', 'Arteria cerebral posterior', 'Arteria basilar'],
        correcta: 0,
        explicacion: 'La cerebral anterior riega la cara medial del homúnculo motor y sensitivo: pierna, pie y genitales. La media riega la convexidad lateral: tórax, brazo, mano, rostro y lengua.',
    },
    {
        id: 'umi-q122', tema: 'umi-neuroanatomia',
        enunciado: 'Según las áreas funcionales del manual, ¿qué función se atribuye al área de Wernicke?',
        opciones: ['Comprensión del lenguaje', 'Control del habla', 'Visión', 'Coordinación del movimiento'],
        correcta: 0,
        explicacion: 'Wernicke, comprensión del lenguaje; Broca, control del habla; occipital, visión; cerebelo, postura, balance y coordinación.',
    },
    {
        id: 'umi-q123', tema: 'umi-neuroanatomia',
        enunciado: 'En el corte de TAC a nivel de la protuberancia del manual, ¿qué cisterna se ve delante del tronco?',
        opciones: ['Cisterna supraselar', 'Cisterna magna', 'Cisterna cuadrigémina', 'Cisterna del ángulo pontocerebeloso'],
        correcta: 0,
        explicacion: 'Ese corte rotula la cisterna supraselar, las arterias cerebrales anterior, media y posterior, la basilar, la protuberancia y el IV ventrículo.',
    },
    {
        id: 'umi-q124', tema: 'umi-neuroanatomia',
        enunciado: '¿Qué estructura une las dos arterias cerebrales anteriores en el polígono de Willis?',
        opciones: ['Arteria comunicante anterior', 'Arteria comunicante posterior', 'Arteria basilar', 'Arteria coroidea anterior'],
        correcta: 0,
        explicacion: 'La comunicante anterior une las dos cerebrales anteriores; las comunicantes posteriores unen la circulación carotídea con las cerebrales posteriores.',
    },
    {
        id: 'umi-q125', tema: 'umi-neuroanatomia', tipo: 'redactar',
        enunciado: 'Un paciente tiene hemiparesia derecha de predominio braquiofacial y dificultad para hablar con comprensión conservada. Razona qué territorio y qué área están afectados usando las tablas de la ficha.',
        respuestaModelo: 'Debilidad de predominio en brazo y cara: territorio de la arteria cerebral media, que en el homúnculo riega la convexidad lateral (tórax, brazo, mano, rostro y lengua), a diferencia de la anterior (pierna, pie y genitales). Hablar mal con la comprensión conservada apunta al área de Broca (control del habla) y no a la de Wernicke (comprensión). La hemiparesia derecha indica hemisferio izquierdo. Todo encaja con un infarto de la cerebral media izquierda que afecta a la corteza motora lateral y al área de Broca.',
    },

    // ---- Ficha XXVI: Marshall ----
    {
        id: 'umi-q126', tema: 'umi-marshall',
        enunciado: 'Swelling bilateral con cisternas de la base ausentes, sin masa y con la línea media desviada 3 mm. ¿Qué tipo de Marshall es?',
        opciones: ['Lesión difusa III', 'Lesión difusa II', 'Lesión difusa IV', 'Masa no evacuada'],
        correcta: 0,
        explicacion: 'Tipo III: swelling con cisternas comprimidas o ausentes y desviación de 0-5 mm. Por encima de 5 mm sería tipo IV.',
    },
    {
        id: 'umi-q127', tema: 'umi-marshall',
        enunciado: '¿Qué incidencia de hipertensión intracraneal da el manual para la lesión difusa tipo IV?',
        opciones: ['100%', '63,2%', '84,6%', '28,6%'],
        correcta: 0,
        explicacion: 'Tipo II 28,6%, III 63,2%, IV 100%, masa evacuada 65,2%, masa no evacuada 84,6%.',
    },
    {
        id: 'umi-q128', tema: 'umi-marshall',
        enunciado: '¿Qué define a la "masa no evacuada" en Marshall?',
        opciones: ['Lesión de más de 25 cc no evacuada', 'Cualquier lesión evacuada', 'Lesión de más de 50 cc', 'Swelling unilateral'],
        correcta: 0,
        explicacion: 'Masa no evacuada: lesión >25 cc sin evacuar (84,6% de HTIC). Masa evacuada: cualquier lesión evacuada.',
    },
    {
        id: 'umi-q129', tema: 'umi-marshall',
        enunciado: 'El manual pone "línea media desviada 20 mm" en el tipo IV. ¿Qué corte usa la clasificación original y la calculadora de la ficha?',
        opciones: ['>5 mm', '>10 mm', '>20 mm', '>15 mm'],
        correcta: 0,
        explicacion: 'En la clasificación original de Marshall el tipo IV es una desviación >5 mm sin lesión >25 cc; la propia lista de factores pronósticos del manual usa también >5 mm.',
    },
    {
        id: 'umi-q130', tema: 'umi-marshall', tipo: 'redactar',
        enunciado: 'Explica por qué un tipo II y un tipo IV de Marshall, ambos "lesión difusa", tienen un riesgo tan distinto de hipertensión intracraneal.',
        respuestaModelo: 'El tipo II tiene lesiones pequeñas con la línea media centrada y las cisternas visibles: todavía hay espacio de reserva (las cisternas y el LCR pueden desplazarse) y el manual le da un 28,6% de HTIC. El tipo IV tiene swelling con desviación de la línea media (>5 mm en la clasificación original): el cerebro ya ha desplazado estructuras porque ha agotado esa reserva, y el manual le da un 100% de HTIC. El tipo III, con cisternas ausentes pero sin desviación, queda en medio (63,2%). La TAC describe cuánta reserva de volumen queda, y por eso predice la PIC.',
    },

    // ---- Ficha XXVII: HSA ----
    {
        id: 'umi-q131', tema: 'umi-hsa',
        enunciado: 'HSA gruesa sin sangre en los ventrículos laterales. ¿Qué grado de Fisher modificado es?',
        opciones: ['III', 'II', 'IV', 'I'],
        correcta: 0,
        explicacion: 'I fina sin ventrículos, II fina con ventrículos, III gruesa sin ventrículos, IV gruesa con ventrículos.',
    },
    {
        id: 'umi-q132', tema: 'umi-hsa',
        enunciado: 'Paciente con HSA, letárgico y con un déficit focal leve. ¿Qué grado de Hunt y Hess y qué mortalidad periquirúrgica da el manual?',
        opciones: ['Grado 3, 10-15%', 'Grado 2, 2-10%', 'Grado 4, 60-70%', 'Grado 1, 0-5%'],
        correcta: 0,
        explicacion: 'Grado 3: letargia o confusión con déficit focal leve, mortalidad periquirúrgica del 10-15%.',
    },
    {
        id: 'umi-q133', tema: 'umi-hsa',
        enunciado: 'Fvm de la ACM de 170 cm/s y de la ACI extracraneal de 85 cm/s. ¿Qué indica el algoritmo del manual?',
        opciones: ['Lindegaard 2: baja probabilidad de vasoespasmo (orienta a hiperemia)', 'Alta probabilidad de vasoespasmo por velocidad >120', 'Lindegaard 7: alta probabilidad', 'Probabilidad indeterminada'],
        correcta: 0,
        explicacion: 'Con Fvm de 121-200 cm/s se calcula el Lindegaard (ACM/ACI): 170/85 = 2. Por debajo de 3, baja probabilidad de vasoespasmo: la velocidad alta se explica por hiperemia.',
    },
    {
        id: 'umi-q134', tema: 'umi-hsa',
        enunciado: 'En el Doppler transcraneal, un índice de pulsatilidad de 1,8 orienta a…',
        opciones: ['HTIC intensa', 'Normalidad', 'Hiperemia', 'Asistolia cerebral'],
        correcta: 0,
        explicacion: '0,6-1,1 normal; 1,2-1,6 microangiopatía o HTIC moderada; 1,7-1,9 HTIC intensa; >2 asistolia cerebral.',
    },
    {
        id: 'umi-q135', tema: 'umi-hsa', tipo: 'redactar',
        enunciado: 'Explica por qué la velocidad de la ACM sola no basta para diagnosticar vasoespasmo y qué aporta el índice de Lindegaard.',
        respuestaModelo: 'La velocidad sube cuando la luz de la arteria se estrecha (vasoespasmo), pero también cuando llega más flujo (hiperemia, circulación hiperdinámica, ↑PaCO₂, anemia, MAV…), así que una velocidad alta por sí sola es ambigua. El índice de Lindegaard divide la velocidad de la ACM entre la de la carótida interna extracraneal del mismo lado: si todo el flujo ha aumentado, las dos suben a la vez y el cociente queda bajo (<3, hiperemia); si el aumento es solo intracraneal, el cociente sube (>6, vasoespasmo). Por eso el manual lo usa en la zona gris de 121-200 cm/s; por debajo de 120 la probabilidad es baja y por encima de 200, alta.',
    },

    // ---- Ficha XXVIII: Vaina del nervio óptico y fuerza ----
    {
        id: 'umi-q136', tema: 'umi-onsd',
        enunciado: '¿A qué distancia del globo ocular se mide el diámetro de la vaina del nervio óptico?',
        opciones: ['3 mm por detrás del globo', '5 mm por detrás del globo', 'Justo en la papila', '10 mm por detrás del globo'],
        correcta: 0,
        explicacion: 'Se mide 3 mm por detrás del globo; 5 mm es el umbral del diámetro, no la distancia.',
    },
    {
        id: 'umi-q137', tema: 'umi-onsd',
        enunciado: 'DVNO de 6 mm. ¿Qué sugiere según el manual?',
        opciones: ['PIC >20 mmHg', 'PIC normal', 'Papiledema crónico sin HTIC', 'Nada: no tiene valor'],
        correcta: 0,
        explicacion: 'DVNO >5 mm sugiere PIC >20 mmHg.',
    },
    {
        id: 'umi-q138', tema: 'umi-onsd',
        enunciado: 'Un paciente levanta el brazo contra la gravedad pero no vence ninguna resistencia. ¿Qué grado de fuerza tiene?',
        opciones: ['3 (50% de lo normal)', '2 (25%)', '4 (75%)', '1 (10%)'],
        correcta: 0,
        explicacion: '2 movimiento sin gravedad, 3 movimiento con gravedad, 4 resistencia moderada, 5 resistencia normal.',
    },
    {
        id: 'umi-q139', tema: 'umi-onsd',
        enunciado: 'Grado 1 en la escala de fuerza muscular significa…',
        opciones: ['Contractilidad sin movimiento', 'Sin contractilidad', 'Movimiento sin gravedad', 'Resistencia moderada'],
        correcta: 0,
        explicacion: '0 sin contractilidad, 1 contractilidad sin movimiento (10%).',
    },
    {
        id: 'umi-q140', tema: 'umi-onsd', tipo: 'redactar',
        enunciado: 'Tienes un TCE sin sensor de PIC y sospechas hipertensión intracraneal. ¿Cómo usarías la ecografía de la vaina del nervio óptico y qué no te puede decir?',
        respuestaModelo: 'Con ecografía ocular se identifica el nervio óptico detrás del globo y se mide el diámetro de su vaina 3 mm por detrás del globo. Si supera 5 mm, sugiere una PIC mayor de 20 mmHg (la vaina se distiende al transmitirse la presión del LCR). Es una estimación no invasiva y rápida que ayuda a decidir, pero no da una cifra de PIC ni sustituye la monitorización invasiva cuando está indicada; tampoco informa de la perfusión cerebral (PPC).',
    },

    // ---- Ficha XXIX: Rankin y GOS ----
    {
        id: 'umi-q141', tema: 'umi-escalas-pronostico',
        enunciado: 'Un paciente necesita algo de ayuda en su día a día pero camina sin asistencia. ¿Qué Rankin modificado tiene?',
        opciones: ['3', '2', '4', '1'],
        correcta: 0,
        explicacion: 'Rankin 3: discapacidad moderada, requiere alguna ayuda pero camina sin asistencia. El 4 ya no camina sin asistencia.',
    },
    {
        id: 'umi-q142', tema: 'umi-escalas-pronostico',
        enunciado: 'En la Glasgow Outcome Scale, ¿qué significa un grado 1?',
        opciones: ['Muerte', 'Buena recuperación', 'Estado vegetativo', 'Discapacidad grave'],
        correcta: 0,
        explicacion: 'La GOS va de 1 (muerte) a 5 (buena recuperación), al revés que Rankin (0 sin síntomas, 6 muerte).',
    },
    {
        id: 'umi-q143', tema: 'umi-escalas-pronostico',
        enunciado: 'Vive de forma independiente pero no ha podido volver al trabajo. ¿Qué GOS tiene?',
        opciones: ['4, discapacidad moderada', '5, buena recuperación', '3, discapacidad grave', '2, estado vegetativo'],
        correcta: 0,
        explicacion: 'GOS 4: capaz de vivir de forma independiente, pero no de volver al trabajo o a la escuela.',
    },
    {
        id: 'umi-q144', tema: 'umi-escalas-pronostico',
        enunciado: 'Rankin modificada 5 corresponde a…',
        opciones: ['Discapacidad grave: encamado, incontinente, con atención constante', 'Muerte', 'Discapacidad moderadamente grave', 'Sin síntomas'],
        correcta: 0,
        explicacion: 'Rankin 5: incapaz de levantarse de la cama, incontinente, requiere atención y asistencia sanitaria constantes. 6 es la muerte.',
    },
    {
        id: 'umi-q145', tema: 'umi-escalas-pronostico', tipo: 'redactar',
        enunciado: 'Explica la diferencia de enfoque entre la escala de Rankin modificada y la Glasgow Outcome Scale, y el error más frecuente al usarlas juntas.',
        respuestaModelo: 'Rankin mide la discapacidad por la ayuda que necesita el paciente (de 0, sin síntomas, a 5, encamado con atención constante, y 6 muerte); la GOS mide el resultado global por la vida independiente y la vuelta al trabajo o la escuela (de 1, muerte, a 5, buena recuperación), e incluye el estado vegetativo como grado propio (2). El error típico es que van en sentido contrario: en Rankin un número alto es peor y en la GOS mejor, así que un "5" significa casi lo opuesto en una y otra.',
    },

    // ---- Ficha XXX: Meningitis y ventriculitis ----
    {
        id: 'umi-q146', tema: 'umi-meningitis',
        enunciado: 'Sospecha de meningitis con indicación de TAC craneal. Según el algoritmo del manual, ¿cuál es el orden?',
        opciones: ['Hemocultivos, antibiótico empírico y después TAC', 'TAC, punción lumbar y después antibiótico', 'Punción lumbar y TAC antes del antibiótico', 'Esperar a la TAC para extraer hemocultivos'],
        correcta: 0,
        explicacion: 'Con indicación de TAC: hemocultivos → antibiótico empírico → TAC. Si la TAC es normal, punción lumbar; si no, tratamiento antibiótico.',
    },
    {
        id: 'umi-q147', tema: 'umi-meningitis',
        enunciado: 'Meningitis por S. pneumoniae. ¿Qué profilaxis necesitan los contactos?',
        opciones: ['Ninguna: no precisa profilaxis', 'Rifampicina 600 mg cada 12 h 2 días', 'Ciprofloxacino 500 mg en dosis única', 'Ceftriaxona 250 mg IM'],
        correcta: 0,
        explicacion: 'S. pneumoniae no precisa profilaxis. Sí N. meningitidis y H. influenzae (rifampicina, ciprofloxacino o ceftriaxona).',
    },
    {
        id: 'umi-q148', tema: 'umi-meningitis',
        enunciado: 'Varias muestras de LCR del DVE positivas para el mismo germen, con glucosa, leucocitos y proteínas normales, y solo fiebre. Según Lozier es…',
        opciones: ['Colonización del DVE', 'Contaminación del DVE', 'Ventriculitis', 'Infección relacionada con el DVE'],
        correcta: 0,
        explicacion: 'Colonización: varias muestras positivas para el mismo germen, sin alteración bioquímica y sin clínica salvo fiebre. Una única muestra sin clínica sería contaminación.',
    },
    {
        id: 'umi-q149', tema: 'umi-meningitis',
        enunciado: 'Vancomicina intraventricular con un débito del DVE de 80 ml/día. ¿Cada cuánto se administra según el manual?',
        opciones: ['Cada 48 h', 'Cada 24 h', 'Cada 72 h', 'Cada 12 h'],
        correcta: 0,
        explicacion: '<50 ml/día cada 72 h; 50-100 cada 48 h; 100-150 cada 24 h; por encima se aumenta la dosis diaria.',
    },
    {
        id: 'umi-q150', tema: 'umi-meningitis', tipo: 'redactar',
        enunciado: 'Paciente con DVE y LCR con glucosa que baja y leucocitos y proteínas que suben, Gram y cultivo negativos, sin fiebre alta. Clasifícalo según Lozier y explica qué haría falta para hablar de ventriculitis.',
        respuestaModelo: 'Es una sospecha de infección relacionada con el DVE: el descenso progresivo de la glucosa con aumento progresivo de leucocitos y proteínas basta, aunque el Gram y el cultivo sean negativos. Si se añadiera un Gram o un cultivo positivo y algún síntoma distinto de la fiebre, sería infección relacionada con la derivación. Para hablar de ventriculitis hacen falta esas alteraciones bioquímicas y microbiológicas más fiebre alta y signos de meningitis (rigidez de nuca, fotofobia, bajo nivel de conciencia, crisis comiciales o aspecto de enfermedad grave). Lo que separa la colonización de la infección es la bioquímica del LCR, no solo el cultivo.',
    },
    {
        id: 'umi-q151', tema: 'umi-hfvvc',
        enunciado: 'Pauta genérica de HFVVC de la unidad para un paciente de 80 kg. ¿Qué flujo de reposición y de bomba indica el manual?',
        opciones: ['2.800 ml/h de reposición y unos 233 ml/min de bomba', '2.000 ml/h y 150 ml/min', '2.800 ml/h y 120 ml/min', '3.500 ml/h y 290 ml/min'],
        correcta: 0,
        explicacion: 'Reposición = 35 × peso = 2.800 ml/h, repartida 60-75% prefiltro y 25-40% posfiltro. Bomba = reposición × 5 / 60 ≈ 233 ml/min.',
    },
    {
        id: 'umi-q152', tema: 'umi-hfvvc',
        enunciado: '¿Cuál es la fracción de filtración ideal según el manual, y qué la baja?',
        opciones: ['15-20%; más reposición prefiltro o más flujo de bomba', '30-40%; más reposición posfiltro', '5-10%; menos flujo de bomba', '15-20%; más reposición posfiltro'],
        correcta: 0,
        explicacion: 'FF = ultrafiltrado / flujo plasmático (con la reposición prefiltro sumada al denominador). Ideal 15-20%. La reposición prefiltro diluye la sangre antes del filtro y un flujo de bomba mayor sube el flujo plasmático: las dos bajan la FF y la hemoconcentración que coagula el filtro.',
    },
    {
        id: 'umi-q153', tema: 'umi-hfvvc',
        enunciado: 'Paciente en HFVVC con plaquetas 55.000/µl. ¿Qué dice el manual de la anticoagulación del circuito?',
        opciones: ['No precisa anticoagulación', 'Heparina sódica 5-10 UI/kg/h con bolo de 2.000 UI', 'Heparinización regional con protamina', 'Fondaparinux 10 mg/24 h'],
        correcta: 0,
        explicacion: 'No precisa anticoagulación con plaquetas <70.000, TTPA >65 s o INR >2. Con coagulación normal, heparina sódica; con riesgo de sangrado, heparinización regional (protamina 1 mg/100 UI); en la TIH, fondaparinux.',
    },
    {
        id: 'umi-q154', tema: 'umi-hfvvc',
        enunciado: 'Test de recirculación del Shaldon: P = 80, A = 68, V = 40 (urea). ¿Cuánto recircula y cómo se clasifica?',
        opciones: ['30%: en el límite del tramo aceptable (20-30%)', '15%: ideal', '50%: inadecuado', '12%: inadecuado'],
        correcta: 0,
        explicacion: '(P − A) / (P − V) × 100 = 12 / 40 × 100 = 30%. Ideal 0%, aceptable 20-30%, inadecuado >30%.',
    },
    {
        id: 'umi-q155', tema: 'umi-hfvvc', tipo: 'redactar',
        enunciado: 'Diferencia las 4 variantes técnicas de terapia continua del manual (SCUF, HFVVC, HDVVC, HDFVVC) por membrana, mecanismo y reposición.',
        respuestaModelo: 'SCUF: ultrafiltración lenta continua, solo convección para quitar agua, sin reposición. HFVVC: hemofiltración con membrana de alta permeabilidad; depura por convección y necesita reposición. HDVVC: hemodiálisis con membrana de baja permeabilidad; poca ultrafiltración más difusión con líquido de diálisis, sin reposición. HDFVVC: hemodiafiltración con membrana de alta permeabilidad; difusión más ultrafiltración, con reposición. La convección arrastra moléculas de mayor tamaño; la difusión limpia sobre todo las pequeñas.',
    },
    {
        id: 'umi-q156', tema: 'umi-electrolitos',
        enunciado: 'Paciente de 70 kg con K⁺ 2,8 mEq/l. Con la tabla de la pág. 9 del manual (déficit = 50 mEq × kg × % de déficit), ¿cuánto falta?',
        opciones: ['Unos 525 mEq (déficit del 15%)', 'Unos 49 mEq', 'Unos 120 mEq', 'Unos 1.750 mEq'],
        correcta: 0,
        explicacion: 'K⁺ 2,5-3 es un déficit del 15%: 50 × 70 × 0,15 = 525 mEq. La fórmula de la pág. 10 ((3,5 − K) × peso + 1 mEq/kg) da ~120 mEq: las dos fórmulas del manual no coinciden, y la ficha lo avisa. En ningún caso se pasa de 200 mEq/día.',
    },
    {
        id: 'umi-q157', tema: 'umi-nutricion',
        enunciado: 'Paciente intubado que no se puede tallar. ¿Qué medida usa el manual para estimar la talla además de la longitud del brazo y la altura de la rodilla?',
        opciones: ['La media brazada: del punto medio del esternón a la punta del dedo medio', 'La circunferencia de la pantorrilla', 'La circunferencia abdominal', 'La longitud del fémur por ecografía'],
        correcta: 0,
        explicacion: 'Talla = 63,525 − 3,237 × sexo − 0,06904 × edad + 1,293 × media brazada (el manual escribe 6,525, una errata). Las circunferencias del brazo, el abdomen y la pantorrilla sirven para estimar el peso.',
    },
    {
        id: 'umi-q158', tema: 'umi-dds-aislamiento',
        enunciado: 'En la pirámide de cobertura del manual, ¿dónde están las cefalosporinas de 3.ª y 4.ª y las quinolonas?',
        opciones: ['En la base, en el centro: Gram positivos y negativos, sin anaerobios', 'Arriba, con los anaerobios', 'En el centro de la pirámide, con todo el espectro', 'En la base, a la derecha: solo Gram negativos'],
        correcta: 0,
        explicacion: 'Arriba (anaerobios) está el metronidazol; en el centro, el espectro más amplio (amoxi-clavulánico, pip-tazo, imipenem, moxifloxacino, tigeciclina); en la base, Gram + a la izquierda (cloxa, vanco, teico, linezolid, dapto), cefalosporinas de 3.ª-4.ª y quinolonas en el centro, y aminoglucósidos, aztreonam y colistina a la derecha.',
    },
    {
        id: 'umi-q159', tema: 'umi-respirador',
        enunciado: 'Paciente intubado y bien ventilado en el que la EtCO₂ desaparece de golpe. ¿Qué causa NO está entre las de ausencia de EtCO₂ del manual?',
        opciones: ['Embolismo pulmonar', 'Desconexión del sistema respiratorio', 'Obstrucción completa del tubo', 'Paro cardíaco'],
        correcta: 0,
        explicacion: 'El embolismo pulmonar la disminuye (más espacio muerto), no la hace desaparecer. La ausencia: intubación esofágica, desconexión, fugas alrededor del tubo, obstrucción completa, parada respiratoria, paro cardíaco, calentamiento o calibración del capnógrafo.',
    },
    {
        id: 'umi-q160', tema: 'umi-fate',
        enunciado: 'Según la tarjeta del FATE extendido, un MAPSE de 7 mm indica una disfunción sistólica del VI…',
        opciones: ['Moderada (6-8 mm)', 'Leve (9-10 mm)', 'Grave (<6 mm)', 'Normal (≥11 mm)'],
        correcta: 0,
        explicacion: 'MAPSE: normal ≥11, leve 9-10, moderada 6-8, grave <6 mm. TAPSE: normal 16-20, leve 11-15, moderada 6-10, grave <6 mm.',
    },
    {
        id: 'umi-q161', tema: 'umi-vasoactivos',
        enunciado: '¿Cuál de estos fármacos revierte el bloqueo de los relajantes no despolarizantes en la tabla del manual, a 1 mg/min IV lenta, 1-3 mg y hasta 5 mg?',
        opciones: ['Neostigmina', 'Pancuronio', 'Succinilcolina', 'Cisatracurio'],
        correcta: 0,
        explicacion: 'Neostigmina 0,5 mg/ml: 1-3 mg IV lenta, máx. 5 mg. El pancuronio y el cisatracurio son relajantes no despolarizantes y la succinilcolina es despolarizante. El sugammadex revierte rocuronio y vecuronio.',
    },
];
