// Banco de preguntas de repaso — "Manual UMI Negrín — Protocolos generales"
// (protocolos internos de la UMI, HUGCDN). 5 preguntas por ficha (4 opción
// múltiple + 1 de redactar) × 6 fichas — formato reducido, mismo criterio
// ya usado en los bloques prácticos más recientes de la app.
export const temasManualUmiProtocolos = [
    { key: 'umi-nutricion', etiqueta: 'Nutrición en el paciente crítico' },
    { key: 'umi-electrolitos', etiqueta: 'Reposición de electrolitos en la UMI' },
    { key: 'umi-shock-septico', etiqueta: 'Shock séptico: manejo inicial y cóctel de Marik' },
    { key: 'umi-dds-aislamiento', etiqueta: 'DDS y aislamiento por BMR' },
    { key: 'umi-glucemia', etiqueta: 'Control glucémico: algoritmos y pauta móvil' },
    { key: 'umi-rutinas', etiqueta: 'Rutinas de guardia y traslado intrahospitalario' },
];

export const preguntasManualUmiProtocolos = [
    // ---- Ficha I: Nutrición ----
    {
        id: 'umi-pq001', tema: 'umi-nutricion',
        enunciado: 'Según el manual, ¿cuándo debería iniciarse la nutrición enteral en un paciente crítico que no recibirá dieta oral por 72h?',
        opciones: ['De forma precoz, antes de 24h, con hemodinámia estable y aparato GI funcional', 'Solo tras confirmar tolerancia con dieta oral primero', 'A partir del 4º día de ingreso', 'Nunca antes de retirar la ventilación mecánica'],
        correcta: 0,
        explicacion: 'El manual indica inicio precoz (antes de 24h) siempre que el paciente esté hemodinámicamente estable y con aparato gastrointestinal funcional — no hace falta esperar más días ni confirmar tolerancia oral primero.',
    },
    {
        id: 'umi-pq002', tema: 'umi-nutricion',
        enunciado: '¿Sobre qué peso se recomienda calcular las calorías en un paciente crítico obeso?',
        opciones: ['El peso ajustado = 0,25×(peso actual−peso ideal)+peso ideal', 'El peso real sin ajustar', 'El peso ideal sin ningún ajuste', 'El doble del peso ideal'],
        correcta: 0,
        explicacion: 'Para el paciente obeso crítico se usa peso ajustado (22-25 kcal/kg de peso ajustado) — usar el peso real sobreestimaría de forma significativa el gasto energético real.',
    },
    {
        id: 'umi-pq003', tema: 'umi-nutricion',
        enunciado: 'En el cribado NRS2002, ¿a partir de qué puntuación se considera que el paciente está en riesgo nutricional?',
        opciones: ['≥3', '≥1', '≥5', '≥7'],
        correcta: 0,
        explicacion: 'Puntuación ≥3 (suma de alteración del estado nutricional + gravedad de la enfermedad, +1 si edad ≥70 años) indica riesgo nutricional real y obliga a plan nutricional; por debajo de 3, reevaluación semanal.',
    },
    {
        id: 'umi-pq004', tema: 'umi-nutricion',
        enunciado: '¿Cuál es el aporte calórico diario recomendado por kg en la fase aguda del paciente crítico, según el manual?',
        opciones: ['20-25 kcal/kg/día', '40-50 kcal/kg/día', '10-12 kcal/kg/día', '60 kcal/kg/día'],
        correcta: 0,
        explicacion: 'Fase aguda: 20-25 kcal/kg/día — distinto de TCE o HFVVC (30-35 kcal/kg/día) y del obeso crítico (22-25 kcal/kg de peso ajustado).',
    },
    {
        id: 'umi-pq005', tema: 'umi-nutricion', tipo: 'redactar',
        enunciado: 'Explica qué mide el balance nitrogenado y por qué es una herramienta útil para ajustar el aporte proteico en el paciente crítico.',
        respuestaModelo: 'El balance nitrogenado (BN = N ingresado − N eliminado) estima si el paciente está en un estado anabólico (BN positivo, más nitrógeno retenido del que se pierde, favorable para la síntesis proteica) o catabólico (BN negativo, se pierde más nitrógeno del que se aporta, típico del paciente crítico en estrés metabólico). El N ingresado se calcula dividiendo los gramos de proteína aportados entre 6,25 (la proporción estándar de nitrógeno en las proteínas). El N eliminado se estima a partir de la urea urinaria (urea en orina × 0,46 × volumen de orina en 24h) más una corrección fija de 4g que cubre las pérdidas no medidas por heces, sudor y nitrógeno no ureico en orina. Es útil porque permite objetivar si el aporte proteico actual está siendo suficiente para frenar el catabolismo — un BN muy negativo pese a un aporte proteico ya alto (1,5-2,5 g/kg/día) sugiere que el catabolismo del estrés crítico está superando la capacidad de reposición nutricional, información que un simple recuento de gramos de proteína administrados no daría por sí solo.',
    },

    // ---- Ficha II: Electrolitos ----
    {
        id: 'umi-pq006', tema: 'umi-electrolitos',
        enunciado: '¿Cuál es el límite máximo de velocidad de reposición de potasio por vía venosa periférica (VVP)?',
        opciones: ['3 mEq/h', '20 mEq/h', '50 mEq/h', 'No hay límite si el paciente está monitorizado'],
        correcta: 0,
        explicacion: 'Por VVP el límite es 3 mEq/h (y 40-60 mEq/l de concentración); por vía central (VVC) el límite sube a 20 mEq/h, salvo K<2 mEq/l.',
    },
    {
        id: 'umi-pq007', tema: 'umi-electrolitos',
        enunciado: '¿Por qué se recomienda evitar diluir el potasio en suero glucosado al 5% (G5%)?',
        opciones: ['Puede producir un descenso inicial del K⁺ de 0,2-1,4 mEq/l', 'Precipita químicamente con la glucosa', 'Aumenta el riesgo de flebitis', 'Inactiva al potasio por completo'],
        correcta: 0,
        explicacion: 'El manual explica que diluir en G5% puede producir un descenso inicial del K⁺ (probablemente por el estímulo de insulina endógena que desplaza K⁺ al medio intracelular) — contraproducente cuando el objetivo es justamente subir el potasio.',
    },
    {
        id: 'umi-pq008', tema: 'umi-electrolitos',
        enunciado: 'En el tratamiento de la hiperpotasemia, ¿cuál es el mecanismo del gluconato/cloruro de calcio IV?',
        opciones: ['Reducir al mínimo la despolarización de la membrana (estabilización cardíaca)', 'Favorecer la transferencia de K⁺ al medio intracelular', 'Facilitar la pérdida de K⁺ por vía digestiva', 'Aumentar la eliminación renal de K⁺'],
        correcta: 0,
        explicacion: 'El calcio IV no baja el potasio sérico — su efecto es reducir la excitabilidad de la membrana cardíaca (antagonizando el efecto arritmogénico de la hiperpotasemia), por eso el manual lo clasifica en la columna "reducir al mínimo la despolarización de la membrana".',
    },
    {
        id: 'umi-pq009', tema: 'umi-electrolitos',
        enunciado: 'Si la hipopotasemia no corrige pese a la reposición adecuada, ¿qué déficit debe sospecharse?',
        opciones: ['Déficit de magnesio', 'Déficit de calcio', 'Déficit de fósforo', 'Exceso de sodio'],
        correcta: 0,
        explicacion: 'El manual indica explícitamente: "si no corrige, pensar en Mg IV" — el magnesio es cofactor de la bomba Na⁺/K⁺-ATPasa, y su déficit impide corregir la hipopotasemia hasta que se repone.',
    },
    {
        id: 'umi-pq010', tema: 'umi-electrolitos', tipo: 'redactar',
        enunciado: 'Explica para qué sirve el índice TTKG y en qué situación clínica se usa según el manual.',
        respuestaModelo: 'El TTKG (gradiente transtubular de potasio) es un índice que estima cuánto está "trabajando" el riñón para eliminar potasio, comparando la concentración de K⁺ en orina y en plasma, corregidas por la osmolalidad (TTKG = K(orina)×Osm(plasma) / [K(plasma)×Osm(orina)]). El manual lo indica específicamente para la situación en la que hay hipopotasemia pero el K⁺ en orina NO está disminuido como cabría esperar si el riñón estuviera reteniendo potasio apropiadamente — un TTKG alto en ese contexto confirma que la causa de la hipopotasemia es una pérdida renal excesiva (p. ej. por diuréticos, hiperaldosteronismo, o los fármacos de la tabla de pérdida renal de K⁺), en vez de una causa extrarrenal (pérdidas digestivas o redistribución transcelular), que tendría un TTKG bajo porque el riñón sí estaría intentando conservar el potasio correctamente.',
    },

    // ---- Ficha III: Shock séptico ----
    {
        id: 'umi-pq011', tema: 'umi-shock-septico',
        enunciado: 'Según Sepsis-3, ¿qué define al shock séptico además de la sepsis?',
        opciones: ['Necesidad de vasopresores para TAM ≥65 mmHg + lactato >2 mmol/l tras adecuada resucitación', 'Solo la presencia de fiebre >38,5°C', 'Un recuento de leucocitos >12.000', 'GCS <13 aislado'],
        correcta: 0,
        explicacion: 'Shock séptico = sepsis + necesidad de vasopresores para mantener TAM ≥65 mmHg + lactato >2 mmol/l después de una resucitación con volumen adecuada — los otros hallazgos forman parte de la definición de sepsis o de qSOFA, no de shock séptico específicamente.',
    },
    {
        id: 'umi-pq012', tema: 'umi-shock-septico',
        enunciado: '¿Cuál es el orden correcto entre obtener hemocultivos e iniciar antibiótico empírico?',
        opciones: ['Obtener hemocultivos ANTES de iniciar el antibiótico', 'Iniciar el antibiótico primero, cultivos después sin prisa', 'Es indiferente el orden', 'Solo se necesitan cultivos si el paciente no mejora'],
        correcta: 0,
        explicacion: 'El protocolo exige obtener hemocultivos antes de iniciar el tratamiento antibiótico (en las primeras 2h) — invertir el orden reduce drásticamente el rendimiento diagnóstico del cultivo.',
    },
    {
        id: 'umi-pq013', tema: 'umi-shock-septico',
        enunciado: '¿Cuáles son los 3 fármacos del cóctel de Marik, y su indicación según el manual?',
        opciones: ['Vitamina C + tiamina + hidrocortisona, si sepsis grave/shock séptico y PCT >2', 'Vitamina C + vitamina D + hidrocortisona, en toda sepsis', 'Tiamina + magnesio + insulina, si lactato >4', 'Hidrocortisona sola, sin otros fármacos asociados'],
        correcta: 0,
        explicacion: 'El cóctel es vitamina C 1,5g/6h, tiamina 200mg/12h e hidrocortisona 50mg/6h — indicado específicamente si hay sepsis grave o shock séptico Y procalcitonina >2, no en toda sepsis.',
    },
    {
        id: 'umi-pq014', tema: 'umi-shock-septico',
        enunciado: '¿Cuál es el objetivo de PVC durante la prueba de volumen en shock séptico, y cuál es su límite de seguridad?',
        opciones: ['Objetivo TAM 75 mmHg, límite de seguridad PVC 15 mmHg', 'Objetivo PVC 20 mmHg sin límite superior', 'No se mide PVC durante la prueba de volumen', 'Límite de seguridad PVC 5 mmHg'],
        correcta: 0,
        explicacion: 'La prueba de volumen (500 ml en ≤30 min) tiene como objetivo TAM 75 mmHg, con un límite de seguridad de PVC 15 mmHg — si se alcanza ese límite antes que el objetivo de TA, se detiene la prueba.',
    },
    {
        id: 'umi-pq015', tema: 'umi-shock-septico', tipo: 'redactar',
        enunciado: 'Explica por qué el cóctel de Marik combina 3 fármacos con mecanismos distintos (antioxidante, cofactor metabólico, antiinflamatorio) en vez de uno solo.',
        respuestaModelo: 'Los 3 fármacos del cóctel atacan mecanismos distintos y potencialmente complementarios del daño celular en la sepsis grave. La vitamina C (ácido ascórbico) es un antioxidante que, según la hipótesis detrás de este protocolo, podría reducir el daño endotelial mediado por radicales libres de oxígeno y ayudar a preservar la función de barrera vascular, además de participar en la síntesis de catecolaminas endógenas y de vasopresina. La tiamina (vitamina B1) es un cofactor esencial del metabolismo oxidativo mitocondrial (piruvato deshidrogenasa, entre otras enzimas); los pacientes sépticos críticos con frecuencia tienen depleción de tiamina, y su déficit empeora la acidosis láctica al forzar el metabolismo anaeróbico incluso sin hipoxia tisular real. La hidrocortisona aporta un efecto antiinflamatorio e inmunomodulador, y en dosis de estrés compensa la posible insuficiencia suprarrenal relativa que acompaña al shock séptico grave. La lógica de combinarlos es que ninguno de los 3 mecanismos por sí solo explica todo el daño celular de la sepsis, así que atacar los 3 frentes a la vez (estrés oxidativo, disfunción mitocondrial, respuesta inflamatoria desregulada) podría tener un efecto mayor que cualquiera de ellos por separado — aunque la evidencia de eficacia de este cóctel específico sigue siendo objeto de controversia en la literatura, motivo por el cual el manual lo reserva a un subgrupo concreto (PCT>2) en vez de generalizarlo a toda sepsis.',
    },

    // ---- Ficha IV: DDS y aislamiento ----
    {
        id: 'umi-pq016', tema: 'umi-dds-aislamiento',
        enunciado: '¿Cuál de estos NO es, por sí solo, un criterio de "paciente de riesgo" de BMR al ingreso?',
        opciones: ['Fiebre al ingreso', 'Ingreso hospitalario ≥5 días en los últimos 3 meses', 'Colonización o infección conocida por BMR', 'Antibioterapia ≥7 días en el mes previo'],
        correcta: 0,
        explicacion: 'La fiebre al ingreso no forma parte de los criterios de riesgo de BMR del manual — esos son: ingreso reciente prolongado, institucionalización, colonización/infección previa por BMR, antibioterapia reciente prolongada, ERC en diálisis, y patología crónica susceptible.',
    },
    {
        id: 'umi-pq017', tema: 'umi-dds-aislamiento',
        enunciado: '¿A qué pacientes se aplica la DDS "mixta" en vez de la "estándar"?',
        opciones: ['Procedentes de otro hospital, con >72h de ingreso hasta cultivos negativos, o portadores de SAMR', 'A todos los pacientes de la unidad sin excepción', 'Solo a pacientes con IOT >72h', 'Nunca se usa la DDS mixta en la UMI'],
        correcta: 0,
        explicacion: 'La descontaminación mixta es para pacientes de mayor riesgo real de SAMR: procedencia de otro hospital, >72h de ingreso propio hasta muestras negativas, o portadores actuales/previos de SAMR hasta el alta.',
    },
    {
        id: 'umi-pq018', tema: 'umi-dds-aislamiento',
        enunciado: '¿Cuántos cultivos consecutivos negativos, separados entre sí por cuánto tiempo, se necesitan para retirar un aislamiento de contacto por BMR?',
        opciones: ['2 cultivos negativos, separados por al menos 3 días', '1 solo cultivo negativo', '3 cultivos negativos en el mismo día', '5 cultivos negativos consecutivos'],
        correcta: 0,
        explicacion: 'El protocolo exige 2 cultivos consecutivos negativos, separados entre sí por al menos 3 días, para retirar el aislamiento de contacto una vez iniciado por un cultivo positivo a Acinetobacter KPC+, Klebsiella BLEE+ o SAMR.',
    },
    {
        id: 'umi-pq019', tema: 'umi-dds-aislamiento',
        enunciado: '¿Qué día de la semana se recomienda solicitar nuevos cultivos de vigilancia si el resultado previo fue negativo, para reducir tiempos de aislamiento innecesarios?',
        opciones: ['El viernes', 'El lunes', 'El miércoles', 'Cualquier día es indiferente'],
        correcta: 0,
        explicacion: 'Los cultivos de vigilancia se informan jueves tarde/viernes mañana — solicitar los siguientes para el viernes acorta al máximo la ventana de aislamiento pendiente de confirmación.',
    },
    {
        id: 'umi-pq020', tema: 'umi-dds-aislamiento', tipo: 'redactar',
        enunciado: 'Explica la diferencia entre aislamiento "preventivo" y aislamiento "de contacto" según el manual, y qué dispara cada uno.',
        respuestaModelo: 'El aislamiento preventivo se aplica al ingreso, antes de tener ningún resultado microbiológico, basándose únicamente en factores de riesgo epidemiológicos conocidos (ingreso hospitalario reciente prolongado, institucionalización, colonización previa, antibioterapia reciente, ERC en diálisis, patología crónica susceptible) — es una medida anticipatoria que asume que el paciente podría ser portador de una bacteria multirresistente mientras se esperan los resultados de las muestras de vigilancia, precisamente porque esperar el cultivo sin ninguna precaución expondría a otros pacientes a un riesgo real si el resultado termina siendo positivo. El aislamiento de contacto, en cambio, se activa solo tras confirmación microbiológica real: un cultivo positivo para un patógeno concreto de alto riesgo (Acinetobacter productor de KPC, Klebsiella pneumoniae BLEE+, o SAMR). Es una medida reactiva basada en evidencia confirmada, no en sospecha, y por eso su retirada exige un criterio más estricto (2 cultivos negativos separados 3 días) que el preventivo (que se mantiene solo "hasta resultado de cultivos").',
    },

    // ---- Ficha V: Glucemia ----
    {
        id: 'umi-pq021', tema: 'umi-glucemia',
        enunciado: '¿Por qué vía se debe administrar la insulina rápida si el paciente está en shock o con catecolaminas?',
        opciones: ['Intravenosa', 'Subcutánea, sin excepción', 'Intramuscular', 'Oral'],
        correcta: 0,
        explicacion: 'La vía subcutánea solo es fiable con perfusión periférica normal — en shock o con catecolaminas la absorción subcutánea es errática, así que el manual exige la vía intravenosa en esos escenarios.',
    },
    {
        id: 'umi-pq022', tema: 'umi-glucemia',
        enunciado: '¿Qué tipo de muestra de sangre se debe usar SIEMPRE para el control de glucemia en perfusión de insulina, según el manual?',
        opciones: ['Sangre arterial o de vía venosa central — nunca capilar', 'Sangre capilar, por ser más rápida', 'Sangre venosa periférica indistintamente', 'Depende del turno de enfermería'],
        correcta: 0,
        explicacion: 'El manual lo remarca explícitamente: "siempre sangre arterial o VVC, nunca capilar" — la glucemia capilar es menos fiable en el paciente crítico con mala perfusión periférica, justo el escenario donde más se usa este protocolo.',
    },
    {
        id: 'umi-pq023', tema: 'umi-glucemia',
        enunciado: '¿Qué pacientes comienzan directamente en el Algoritmo II (más intensivo) en vez del Algoritmo I?',
        opciones: ['Pacientes con catecolaminas, postoperados, tratamiento corticoideo, NTP, o diabéticos insulinizados', 'Todos los pacientes sin excepción', 'Solo los pacientes con glucemia inicial >300 mg/dl', 'Ninguno — todos empiezan siempre en el Algoritmo I'],
        correcta: 0,
        explicacion: 'Catecolaminas/postoperados, corticoides, NTP y diabetes I/II insulinizada son las 4 categorías que arrancan en el Algoritmo II — el resto de pacientes comienza en el Algoritmo I, más conservador.',
    },
    {
        id: 'umi-pq024', tema: 'umi-glucemia',
        enunciado: '¿Qué se debe hacer si la glucemia se mantiene >180 mg/dl durante 2 horas seguidas?',
        opciones: ['Pasar al algoritmo superior (más intensivo)', 'Pasar al algoritmo inferior', 'Suspender la perfusión de insulina', 'No cambiar nada hasta las 6h'],
        correcta: 0,
        explicacion: 'Glucemia >180 sostenida 2h → algoritmo superior (más UI por tramo de glucemia); glucemia <120 sostenida 2h → algoritmo inferior — el protocolo se autoajusta según la respuesta real del paciente.',
    },
    {
        id: 'umi-pq025', tema: 'umi-glucemia', tipo: 'redactar',
        enunciado: 'Explica la lógica de tener 6 algoritmos distintos (I-VI) en vez de un único protocolo de perfusión de insulina para todos los pacientes.',
        respuestaModelo: 'Los 6 algoritmos representan 6 niveles de intensidad creciente de dosificación de insulina para el mismo rango de glucemia — el Algoritmo I da las dosis más bajas por tramo, y el VI las más altas (p. ej. ante una glucemia de 210-239 mg/dl, el Algoritmo I indica 1,5 UI mientras que el VI indica 12 UI para la misma cifra). Esto existe porque la sensibilidad a la insulina varía enormemente entre pacientes y a lo largo del ingreso de un mismo paciente: alguien con tratamiento corticoideo, en shock con catecolaminas, o con nutrición parenteral, típicamente tiene una resistencia a la insulina mucho mayor que un paciente sin esos factores, y necesitaría dosis mucho más altas para el mismo objetivo de glucemia si se usara siempre el mismo algoritmo — de ahí que esos 4 grupos arranquen directamente en el Algoritmo II. El sistema de "subir" o "bajar" de algoritmo según la respuesta real a las 2h (en vez de fijar uno solo desde el ingreso hasta el alta) permite que el protocolo se adapte de forma dinámica a los cambios de sensibilidad a la insulina que ocurren durante la propia evolución del paciente crítico — por ejemplo, al retirar corticoides o catecolaminas, sin que el equipo tenga que rediseñar el protocolo de insulina desde cero cada vez.',
    },

    // ---- Ficha VI: Rutinas y traslado ----
    {
        id: 'umi-pq026', tema: 'umi-rutinas',
        enunciado: 'Al iniciar la ronda de guardia, ¿a qué paciente se prioriza ver primero?',
        opciones: ['Al más grave o al de nuevo ingreso', 'Al que lleve más tiempo ingresado', 'Al más próximo a la puerta de la sección', 'Al que tenga programada el alta ese día'],
        correcta: 0,
        explicacion: 'La primera rutina de la sección es "ver al paciente más grave o al nuevo ingreso" — prioriza el riesgo clínico real sobre el orden espacial o temporal.',
    },
    {
        id: 'umi-pq027', tema: 'umi-rutinas',
        enunciado: 'Antes de movilizar a un paciente fuera de la unidad, ¿qué debe estar siempre verificado?',
        opciones: ['Que el informe de traslado y/o alta esté realizado y actualizado', 'Que la familia haya firmado un consentimiento verbal', 'Que el paciente lleve más de 24h ingresado', 'Que el turno de enfermería sea el diurno'],
        correcta: 0,
        explicacion: 'El manual lo marca como regla sin excepciones: "verificar que esté realizado y actualizado el informe de traslado y/o alta... antes de movilizar al paciente de nuestra unidad SIEMPRE".',
    },
    {
        id: 'umi-pq028', tema: 'umi-rutinas',
        enunciado: 'Durante un traslado intrahospitalario en ascensor, ¿cómo debe posicionarse el equipo?',
        opciones: ['Subir con los pies primero y situarse a la cabeza para el control de la vía aérea', 'Subir con la cabeza primero para ahorrar espacio', 'Da igual la orientación si el ascensor es amplio', 'Solo importa la posición si el paciente está despierto'],
        correcta: 0,
        explicacion: 'El protocolo indica explícitamente subir los pies primero y ubicarse a la cabeza del paciente en el ascensor, precisamente para mantener el control inmediato de la vía aérea en caso de emergencia durante el trayecto.',
    },
    {
        id: 'umi-pq029', tema: 'umi-rutinas',
        enunciado: '¿Quién lleva la "voz de mando" durante la movilización del paciente en un traslado, según el manual?',
        opciones: ['El médico', 'El celador', 'La enfermera de mayor antigüedad', 'Cualquier miembro del equipo, sin jerarquía definida'],
        correcta: 0,
        explicacion: 'El manual es explícito: "el médico llevará la voz de mando y solo se movilizará cuando él lo diga" — una única persona coordina el momento exacto del movimiento para evitar tracciones o desconexiones accidentales.',
    },
    {
        id: 'umi-pq030', tema: 'umi-rutinas', tipo: 'redactar',
        enunciado: 'Explica por qué el checklist de traslado divide sus pasos en "antes", "durante" y "después", y qué tipo de fallo previene cada fase.',
        respuestaModelo: 'Dividir el checklist en 3 fases refleja que los riesgos de un traslado intrahospitalario son distintos según el momento. La fase "antes" (monitorización cargada, 2 balas de O₂ con autonomía calculada, respirador de traslado armado, fármacos de parada disponibles, fijación de tubo/catéteres/vías verificada, gasometría basal) previene el fallo más costoso de todos: quedarse sin recursos a mitad de camino, lejos de la unidad, sin poder resolver una descompensación — por eso se calcula explícitamente la autonomía de oxígeno en minutos antes de salir. La fase "durante" (control visual continuo, orientación correcta en el ascensor, fijación de dispositivos antes de cada movimiento, voz de mando única, protocolo de emergencia claro) previene errores activos en el momento mismo del traslado, como la extubación accidental por tracción de un cable o tubuladura, o una demora en la respuesta ante una descompensación súbita por falta de coordinación del equipo. La fase "después" (reconexión y monitorización, gasometría de control, registro de la técnica realizada e incidencias) previene que un problema surgido durante el traslado pase desapercibido al reincorporar al paciente a la rutina de la unidad, y deja constancia documental de lo ocurrido para la continuidad del cuidado en el siguiente turno.',
    },
];
