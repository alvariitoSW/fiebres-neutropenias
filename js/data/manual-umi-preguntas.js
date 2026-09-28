// Banco de preguntas de repaso — "Manual UMI Negrín" (manual de orientación
// interno de la Unidad de Medicina Intensiva, HUGCDN), consolidado en una
// única guía con sus 18 fichas (ver manual-umi.html). 5 preguntas por
// ficha (4 opción múltiple + 1 de redactar) × 18 fichas = 90 preguntas —
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
        explicacion: 'En VM sin esfuerzo respiratorio el corte es >18% (fórmula (Dmáx−Dmín)×100/Dmín) — distinto del >40% que se usa en ventilación espontánea, porque la fisiología del llenado de la VCI cambia con la presión intratorácica positiva.',
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
        respuestaModelo: 'La puntuación CHA₂DS₂-VASc en sí (8 ítems puntuables — insuficiencia cardíaca, hipertensión, edad ≥75, diabetes, ictus/AIT previo, enfermedad vascular, edad 65-74, sexo femenino — con un semáforo de riesgo por corte de puntos) ya existe como calculadora interactiva real en Merino Cardiología, Ficha XVII ("FA: cardioversión y prevención de ictus"), construida a partir de la fuente de Marik. Duplicarla aquí con una segunda implementación habría arriesgado una inconsistencia de cifras entre dos calculadoras del mismo score dentro de la misma app — el mismo criterio que ya sigue el proyecto en otros cruces entre especialidades (p. ej. remitir a una calculadora ya existente en vez de reimplementarla). Por eso esta ficha se limita a desarrollar el árbol de decisión completo alrededor de la puntuación (qué hacer antes, durante y después de calcularla), y enlaza por texto a la ficha donde la calculadora numérica ya vive.',
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
];
