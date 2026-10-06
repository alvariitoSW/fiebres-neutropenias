// Banco de "Preguntas difíciles" de Sobrevivir a la UMI — mismo formato
// {id, tema, enunciado, opciones, correcta, explicacion} / {tipo:'redactar',
// respuestaModelo} que el resto de la app, pero deliberadamente distinto en
// naturaleza del resto del quiz: no son preguntas de repaso de una sola
// ficha, son casos clínicos que obligan a integrar datos de varias fichas
// del Manual UMI (y, en 2 de ellas, de Merino Cardiología) a la vez — el
// mismo tipo de pregunta "difícil, basada en clínica, fundamental para un
// residente de intensiva" que se pidió al diseñar esta sección.
//
// Sin PDF fuente propio para el banco en sí (las preguntas SÍ están
// ancladas a cifras/algoritmos reales ya verificados en manual-umi.html,
// nunca inventadas) — mismo criterio ya establecido en el proyecto para
// contenido sin fuente propia pero clínicamente estándar (ver APACHE
// II/Charlson en Escalas Generales): cada pregunta se construyó releyendo
// primero el tab-content real de la ficha de origen, nunca de memoria.
//
// Banco inicial deliberadamente pequeño (10: 8 opción múltiple + 2
// redactar) — crece con el tiempo, mismo criterio que el resto de bancos
// de la app que arrancaron pequeños.
export const preguntasMcDificiles = [
    {
        id: 'umimc-q001', tema: 'umi-mc-dificiles',
        enunciado: 'Paciente en shock séptico de foco abdominal. Tras 2 horas de reanimación con volumen adecuado: PAM 68 mmHg con noradrenalina a 0,4 mcg/kg/min, PVC 11 mmHg, ScvO₂ 58%, Hb 9,2 g/dl, Hto 34%, lactato 3,8 mmol/l sin descenso. ¿Cuál es la siguiente mejor acción?',
        opciones: [
            'Subir la noradrenalina a 0,6 mcg/kg/min',
            'Transfundir hasta Hb >10 g/dl antes de cualquier otro cambio',
            'Iniciar dobutamina, hasta 20 mcg/kg/min, dado que el Hto >30%',
            'Repetir un bolo de cristaloides de 30 ml/kg',
        ],
        correcta: 2,
        explicacion: 'PVC (11) y PAM (68) ya están en objetivo — el problema ya no es de precarga ni de poscarga. Con ScvO₂ <70%, Hb >7 y Hto >30%, el protocolo de shock séptico prioriza dobutamina sobre seguir transfundiendo o subir más el vasopresor; el lactato sin descenso a las 2h confirma que la reanimación actual no basta.',
    },
    {
        id: 'umimc-q002', tema: 'umi-mc-dificiles',
        enunciado: 'Paciente de 70kg, 4h post-recambio valvular mitral mecánico. Débito por drenaje torácico: 340ml en la 1ª hora. T 35,9°C, Ca²⁺ iónico 0,88 mmol/l, plaquetas 140.000, fibrinógeno 210 mg/dl, TEG: tiempo de coagulación activada 110seg, amplitud máxima 38. ¿Cuál es la actuación más adecuada?',
        opciones: [
            'Reintervención quirúrgica inmediata — 340ml en la 1ª hora ya supera el umbral de sangrado quirúrgico',
            'Protamina 50mg, porque el tiempo de coagulación activada es >140seg',
            'Corregir hipotermia e hipocalcemia, y dar desmopresina 0,3 mcg/kg por la amplitud máxima <45 (plaquetas y fibrinógeno ya son normales)',
            'Plasma 15 ml/kg, porque el tiempo de coagulación del TEG está alterado',
        ],
        correcta: 2,
        explicacion: '340ml en la 1ª hora (~4,9 ml/kg) supera el umbral de "sangrado anormal a estudiar" (>300ml) pero no el de indicación de reintervención (>8 ml/kg·1ª hora ≈ 560ml para 70kg). El TCA de 110seg está por debajo de 140seg (descarta protamina) y el tiempo de coagulación del TEG no está referido como alterado (descarta plasma). Con plaquetas y fibrinógeno normales, lo único alterado es la amplitud máxima (38<45) — la rama correcta es desmopresina, corrigiendo antes la hipotermia/hipocalcemia que por sí solas empeoran cualquier coagulopatía.',
    },
    {
        id: 'umimc-q003', tema: 'umi-mc-dificiles',
        enunciado: 'Paciente con insuficiencia respiratoria grave y TAS 78 mmHg pese a volumen, taquicárdico, que necesita intubación urgente. ¿Qué secuencia de inducción es la correcta según el algoritmo de SIR por estabilidad hemodinámica?',
        opciones: [
            'Fentanilo 2-4 mcg/kg + propofol 2 mg/kg',
            'Fentanilo 0,5-1 mcg/kg + etomidato 0,2 mg/kg',
            'Midazolam 0,2-0,3 mg/kg en bolo único, sin opioide',
            'Propofol 2,5 mg/kg en bolo rápido, maximizando la profundidad antes de intubar',
        ],
        correcta: 1,
        explicacion: 'TAS 78 mmHg pese a volumen clasifica al paciente como hemodinámicamente inestable. Esa rama reduce la dosis de opioide (para minimizar la vasodilatación/bradicardia del fentanilo) y usa etomidato, el inductor con menor impacto hemodinámico de los disponibles — pese a su riesgo conocido de insuficiencia adrenal transitoria. Las otras 3 opciones (dosis de la rama estable, o maximizar la sedación) aumentan el riesgo real de colapso cardiovascular peri-intubación en un paciente ya hipotenso.',
    },
    {
        id: 'umimc-q004', tema: 'umi-mc-dificiles',
        enunciado: 'Paciente recupera circulación espontánea (RCE) tras PCR extrahospitalaria por FV, sin elevación de ST ni causa cardiaca obvia. A los 20 minutos de RCE: GCS 5, sin otra causa de coma identificada. Según el algoritmo de manejo inicial del síndrome posparada, ¿cuál es el siguiente paso?',
        opciones: [
            'Diferir todo estudio hasta la fase de recuperación (>72h), ya que no hay elevación de ST',
            'Analítica ampliada + temperatura central + TAC craneal en los primeros 120 minutos, y considerar hipotermia terapéutica inducida',
            'Iniciar hipotermia terapéutica de inmediato, sin TAC craneal previo, porque el GCS<8 ya es indicación suficiente',
            'Repetir la valoración neurológica a las 6 horas antes de decidir cualquier estudio de imagen',
        ],
        correcta: 1,
        explicacion: 'Un GCS<8 a los 20 minutos de RCE sin otra causa de coma identificada es exactamente el criterio que dispara la rama de analítica ampliada + temperatura central + TAC craneal en los primeros 120 min, seguida de CONSIDERAR (no automatizar) la hipotermia terapéutica inducida. El TAC craneal nunca se salta (hay que descartar causa estructural antes de atribuir el coma a la anoxia), y la ventana "precoz" (20min-6/12h) es precisamente donde las intervenciones tienen mayor relevancia potencial — esperar 6h o diferir hasta la fase de recuperación pierde esa ventana.',
    },
    {
        id: 'umimc-q005', tema: 'umi-mc-dificiles',
        enunciado: 'Paciente en ventilación mecánica controlada, totalmente adaptado al respirador, sin ningún esfuerzo inspiratorio propio. FATE: VCI con diámetro máximo 2,4 cm y diámetro mínimo 1,6 cm. ¿Qué fórmula de colapsabilidad de VCI hay que aplicar?',
        opciones: [
            'Ventilación espontánea — (2,4−1,6)/2,4×100 = 33,3%, umbral >40% → no respondedor',
            'VM sin esfuerzo respiratorio — (2,4−1,6)×100/1,6 = 50%, umbral >18% → sí respondedor',
            'VM (fórmula general) — (2,4−1,6)×100/[0,5×(1,6+2,4)] = 40%, umbral >12% → sí respondedor',
            'Ninguna de las 3 aplica sin conocer antes el gasto cardíaco por Swan-Ganz',
        ],
        correcta: 1,
        explicacion: 'El dato clave — ventilación mecánica controlada sin ningún esfuerzo inspiratorio propio — define cuándo usar la fórmula "VM sin esfuerzo respiratorio": la fórmula de "ventilación espontánea" exige que el paciente genere la presión negativa inspiratoria por sí mismo (ausente aquí), y la "fórmula general" está reservada para cuando hay duda real sobre si el esfuerzo es nulo, no para sustituir a la fórmula específica cuando el contexto ya está claro. Aunque B y C lleguen a la misma conclusión cualitativa, solo B usa el corte y la fórmula que corresponden de verdad a este paciente — en un caso límite, elegir mal la fórmula puede cambiar la conclusión.',
    },
    {
        id: 'umimc-q006', tema: 'umi-mc-dificiles',
        enunciado: 'Potasio sérico 2,3 mEq/l, pH 7,15. Según la tabla de reposición de K⁺, ¿cuál es la pauta correcta?',
        opciones: [
            '10 mEq en 50cc SF en 1h (banda de déficit del 15%)',
            '40 mEq/l en 100ml SF en 1h, seguido de PC 10-20 mEq/h sin superar 200 mEq/día',
            '3 mEq/h en infusión continua, sin bolo inicial',
            '20 mEq en 50ml SF en 1h (banda de déficit del 20%, K entre 2 y 2,5)',
        ],
        correcta: 1,
        explicacion: 'La banda más grave de la tabla ("déficit >20%") se activa con K<2,5 por sí solo, o con K entre 2-2,5 SI además hay pH<7,2. Aquí K=2,3 ya es <2,5, así que entra directamente en la banda más agresiva — no en la de "déficit=20%" (que exige K entre 2-2,5, y este valor ya está por debajo) ni en la de déficit 15% (reservada para K 2,5-3). La acidosis (pH 7,15) refuerza la indicación, pero no es la que la determina aquí.',
    },
    {
        id: 'umimc-q007', tema: 'umi-mc-dificiles',
        enunciado: 'Ecografía pulmonar en paciente con disnea súbita tras colocación de una vía central: sliding pulmonar ausente en el hemitórax ipsilateral, líneas A++ en el campo anterior, y se identifica un punto donde alterna pulmón deslizante y no deslizante. ¿Cuál es el diagnóstico según el protocolo BLUE?',
        opciones: [
            'Edema pulmonar — las líneas A++ indican sobrecarga de líquido',
            'EPOC/asma — el patrón de líneas A es típico de la vía aérea obstructiva',
            'Neumotórax — ausencia de sliding + líneas A++ + lung point positivo',
            'Embolismo pulmonar — hay que buscar trombosis venosa, no un lung point',
        ],
        correcta: 2,
        explicacion: 'La secuencia exacta del protocolo BLUE para "sin sliding + líneas A++" es buscar el lung point; si está presente (el punto de transición descrito en el caso), el diagnóstico es neumotórax — coherente con el contexto (disnea súbita tras un procedimiento con riesgo de punción pleural). EPOC/asma y embolismo pulmonar exigen sliding BILATERAL presente, ausente aquí; edema pulmonar exige líneas B++, no A++.',
    },
    {
        id: 'umimc-q008', tema: 'umi-mc-dificiles',
        enunciado: 'Sepsis grave con PCT 3,4 ng/ml ya en cóctel de Marik (vitamina C + tiamina + hidrocortisona) desde hace 3 días. El paciente mejora clínicamente y el equipo de guardia se plantea suspender ya los 3 fármacos. ¿Qué es correcto?',
        opciones: [
            'Suspender los 3 a la vez, ya que la mejoría clínica es el criterio de duración, no el día de tratamiento',
            'Mantener vitamina C y tiamina hasta completar 4 días, e hidrocortisona hasta completar 7 días — la duración no se acorta por mejoría clínica',
            'Suspender solo la hidrocortisona, manteniendo vitamina C/tiamina indefinidamente mientras persista la sepsis',
            'Prolongar los 3 fármacos más allá de sus duraciones estándar, ya que el paciente respondió bien',
        ],
        correcta: 1,
        explicacion: 'El protocolo fija duraciones distintas y fijas para cada fármaco (vitamina C y tiamina 4 días, hidrocortisona 7 días) que no se acortan por mejoría clínica precoz — la respuesta favorable confirma que el tratamiento está funcionando, no que deba interrumpirse antes de completar el curso ya pautado.',
    },
    {
        id: 'umimc-q009', tema: 'umi-mc-dificiles', tipo: 'redactar',
        enunciado: 'Un paciente con insuficiencia cardíaca y FEVI reducida ingresa con bloqueo AV completo sintomático. Cardiología duda entre un marcapasos VVI convencional o un sistema de terapia de resincronización cardíaca (TRC). Usando el código NBG del Manual UMI y lo que sabes de indicaciones de TRC: explica por qué la FEVI reducida inclina la decisión hacia TRC, y qué consecuencia fisiológica real tendría estimular solo el VD en este paciente.',
        respuestaModelo: 'Un marcapasos VVI (estimulación V, detección V, respuesta I del código NBG) activa solo el ventrículo derecho, de forma asincrónica con el izquierdo. En un corazón con FEVI ya reducida, la estimulación crónica del VD genera un patrón de activación eléctrica parecido a un bloqueo de rama izquierda inducido por el propio marcapasos, con disincronía interventricular que puede deteriorar aún más una función sistólica ya comprometida (el llamado deterioro inducido por estimulación del VD). La TRC, en cambio, estimula ambos ventrículos de forma coordinada (VD + seno coronario para el VI) precisamente para evitar esa disincronía y mejorar el acoplamiento mecánico — es la opción de elección cuando ya hay disfunción sistólica significativa y se prevé necesidad de estimulación ventricular frecuente, no un VVI simple.',
    },
    {
        id: 'umimc-q010', tema: 'umi-mc-dificiles', tipo: 'redactar',
        enunciado: 'Dos pacientes en shock reciben noradrenalina como primer vasopresor. Paciente A: TAS 75 mmHg, piel fría y moteada, PVC alta, FATE con FEVI visual muy deprimida. Paciente B: TAS 78 mmHg, piel caliente, PVC baja, FATE con función biventricular hiperdinámica. Explica por qué la noradrenalina sola es insuficiente en A pero probablemente suficiente en B, y qué fármaco añadirías en cada caso según el perfil receptor estudiado en vasoactivos.',
        respuestaModelo: 'El Paciente A tiene un shock predominantemente cardiogénico (FEVI muy deprimida, PVC alta, mala perfusión periférica pese a una TAS relativamente mantenida): el problema no es de tono vascular —que la noradrenalina ya corrige vía receptores α1— sino de contractilidad, así que necesita soporte inotrópico añadido, típicamente dobutamina (agonista β1 predominante). El Paciente B, con PVC baja, piel caliente y función biventricular hiperdinámica, tiene un perfil distributivo/vasopléjico puro: la noradrenalina, actuando sobre receptores α1 para restaurar el tono vascular perdido, es fisiopatológicamente el fármaco correcto y suele bastar sin necesitar un inótropo adicional, porque el corazón ya está hipercontráctil por sí mismo.',
    },
];

export const temasMcDificiles = [
    { key: 'umi-mc-dificiles', etiqueta: 'Preguntas MC difíciles' },
];
