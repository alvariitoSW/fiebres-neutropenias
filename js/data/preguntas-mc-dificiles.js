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
//
// Ampliación (umimc-q011 en adelante): a petición explícita del usuario
// de que estas preguntas se sintieran como "el adjunto preguntando de las
// diferentes partes de UCI, no solo de Manual UMI" — las 10 primeras
// (q001-q010) estaban casi todas ancladas al propio Manual UMI; estas 12
// nuevas cruzan deliberadamente a Merino Neumología (SDRA/ventilación
// protectora, posición prono), Nefrología (clasificador ácido-base,
// hiperpotasemia), Trasplante de Hematología (antibioterapia MDR
// post-TPH, CAR-T/CRS-ICANS concurrentes), Merino Cardiología (soporte
// circulatorio mecánico, patrones de shock, CHA₂DS₂-VASc), Fisiopatología
// UCI (CAM-UCI/delirio), UCI Papers Tuiter (ratio T/iCa de citrato) y
// Nefrología/ERC (síndrome de realimentación) — cada una releyendo primero
// el tab-content real de la ficha de origen, mismo criterio de siempre.
// Más peso relativo en preguntas `redactar` (4 de las 12 nuevas ≈ 33%,
// frente a 2 de las 10 originales = 20%) porque es el formato que mejor
// imita "pregúntame en voz alta y razona en vivo".
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
    {
        id: 'umimc-q011', tema: 'umi-mc-dificiles',
        enunciado: 'Paciente con SDRA en ventilación protectora, ya con volumen tidal de 6 ml/kg de peso corporal predicho. Presión meseta 34 cmH₂O, pH 7,33, SpO₂ 92%. ¿Cuál es la siguiente acción correcta según el protocolo?',
        opciones: [
            'Aumentar la frecuencia respiratoria hasta que la presión meseta baje de 30',
            'Reducir el volumen tidal en incrementos de 1 ml/kg hasta presión meseta ≤30 cmH₂O o volumen tidal=4 ml/kg',
            'Aumentar la PEEP para "abrir" más alvéolos y repartir mejor la presión',
            'Aceptar una presión meseta de 34, ya que el pH está dentro del rango normal (7,30-7,45)',
        ],
        correcta: 1,
        explicacion: 'Con volumen tidal ya en 6 ml/kg y presión meseta >30 cmH₂O, el protocolo pasa a su 2ª etapa: reducir el volumen tidal en incrementos de 1 ml/kg hasta que la presión meseta sea ≤30 cmH₂O o se llegue a 4 ml/kg — un objetivo independiente del pH (que aquí ya está en rango normal, así que no corresponde tocar la frecuencia respiratoria, eso es la 3ª etapa, reservada a la acidosis respiratoria). Aumentar la PEEP no forma parte de este protocolo para corregir la presión meseta.',
    },
    {
        id: 'umimc-q012', tema: 'umi-mc-dificiles',
        enunciado: 'Paciente con SDRA grave (PaO₂/FiO₂ 110 con PEEP 8), ya en volumen tidal de 6 ml/kg, que recibe noradrenalina a dosis moderada con PAM estable y mejorando en las últimas horas. El equipo de guardia duda si la necesidad de vasopresor contraindica la posición prono. ¿Qué es correcto?',
        opciones: [
            'Sí: cualquier paciente con vasopresor en curso tiene contraindicada la posición prono',
            'No: los vasopresores no son por sí solos una contraindicación si la condición clínica está estable o mejorando, y el paciente ya cumple el criterio de PaO₂/FiO₂<150 con PEEP≥5 para indicarla',
            'No, pero solo si se reduce antes la noradrenalina a la dosis mínima posible',
            'Sí, porque el shock circulatorio es una contraindicación relativa y necesitar vasopresor ya lo define como tal',
        ],
        correcta: 1,
        explicacion: 'La fuente declara explícitamente que el uso de vasopresores NO es una contraindicación de la posición prono si la condición clínica está estable o mejorando — justo el escenario descrito (PAM estable, mejorando). El shock circulatorio sí es una contraindicación relativa, pero este paciente no está en shock: está siendo soportado con un vasopresor a dosis moderada y con tendencia a mejorar, una situación clínica distinta. El paciente, además, ya cumple el criterio de indicación (PaO₂/FiO₂<150 con PEEP≥5, con volumen tidal bajo).',
    },
    {
        id: 'umimc-q013', tema: 'umi-mc-dificiles', tipo: 'redactar',
        enunciado: 'Paciente séptico que ha recibido un gran volumen de suero salino 0,9% en las últimas 24h. Gasometría: pH 7,10, HCO₃⁻ 8 mEq/l, Na⁺ 140 mEq/l, Cl⁻ 117 mEq/l. Calcula el hiato aniónico y el Δ-ratio, e interpreta el resultado explicando el papel del suero salino.',
        respuestaModelo: 'Hiato aniónico = Na⁺ − (Cl⁻ + HCO₃⁻) = 140 − (117+8) = 15 mEq/l, elevado (>12). Δ-ratio = (HA−12)/(24−HCO₃⁻) = (15−12)/(24−8) = 3/16 ≈ 0,19, muy por debajo de 0,4 — el HCO₃⁻ ha bajado mucho más de lo que el hiato elevado por sí solo explicaría, lo que sugiere una acidosis hiperclorémica (de hiato normal) sobreañadida a la acidosis metabólica de base (probablemente láctica, dado el contexto séptico). El suero salino 0,9% tiene una concentración de cloro (154 mEq/l) por encima de la plasmática; infundirlo en gran volumen añade cloro y diluye el bicarbonato, generando una acidosis hiperclorémica iatrogénica que se superpone a la acidosis láctica original.',
    },
    {
        id: 'umimc-q014', tema: 'umi-mc-dificiles',
        enunciado: 'K⁺ sérico 7,2 mEq/l, ECG con ondas T picudas y ensanchamiento del QRS, en un paciente con fracaso renal agudo oligúrico. ¿Cuál es la secuencia correcta de actuación?',
        opciones: [
            'Furosemida IV en dosis alta como primera medida, dado el fracaso renal agudo',
            'Gluconato cálcico IV de inmediato (antagoniza el efecto cardíaco) → salbutamol + insulina-glucosa combinados → hemodiálisis con baño sin glucosa como medida definitiva',
            'Captores de potasio (patirómero) como primera línea, por ser los que eliminan más K⁺ del organismo',
            'Bicarbonato sódico de entrada, porque desplaza el K⁺ al interior celular más rápido que cualquier otra medida',
        ],
        correcta: 1,
        explicacion: 'Con cambios ECG, el gluconato cálcico es la primera medida obligada (no baja el K⁺ plasmático, solo antagoniza su efecto cardiotóxico). Después, salbutamol + insulina-glucosa combinados son más eficaces que cualquiera por separado para desplazar K⁺ al interior celular (la monoterapia con β-agonistas falla en 20-40% de los pacientes). En un FRA oligúrico los diuréticos de asa son poco útiles (A), y la hemodiálisis —con baños sin glucosa, para no estimular la liberación de insulina— es el método definitivo más rápido y seguro para eliminar K⁺ del organismo. Los captores de potasio actúan en 1-2h, con efecto completo en 7-24h: demasiado lentos para ser primera línea en esta urgencia.',
    },
    {
        id: 'umimc-q015', tema: 'umi-mc-dificiles',
        enunciado: 'Paciente alo-TPH, neutropenia intensa (día+9), con colonización rectal conocida por Klebsiella pneumoniae productora de carbapenemasa (KPC), fiebre de nueva aparición, hemodinámicamente estable. ¿Cuál es la antibioterapia empírica más adecuada?',
        opciones: [
            'Meropenem en monoterapia, por ser el antibiótico de más amplio espectro disponible',
            'Piperacilina-tazobactam, ajustando después según antibiograma',
            'Combinación de al menos 2 fármacos activos según antibiograma, incluyendo ceftazidima-avibactam',
            'Cefepime, estrategia de escalada estándar por ser el primer episodio febril',
        ],
        correcta: 2,
        explicacion: 'La colonización conocida por un germen productor de carbapenemasa descarta tanto la escalada con cefepime (reservada a quien NO tiene colonización/infección previa por multirresistentes) como el meropenem en monoterapia (el propio germen es resistente a carbapenems) y la piperacilina-tazobactam (ineficaz frente a KPC). El protocolo exige cobertura dirigida a la colonización conocida: combinación de ≥2 fármacos activos según antibiograma, con ceftazidima-avibactam como pilar.',
    },
    {
        id: 'umimc-q016', tema: 'umi-mc-dificiles', tipo: 'redactar',
        enunciado: 'Paciente en VA-ECMO por shock cardiogénico refractario desarrolla edema pulmonar agudo pese al soporte completo. Explica el mecanismo fisiopatológico y 2 estrategias reales para manejarlo.',
        respuestaModelo: 'El VA-ECMO devuelve el flujo de forma retrógrada por la arteria femoral hacia la aorta, lo que aumenta la poscarga del ventrículo izquierdo — un problema que no comparten otras formas de soporte mecánico (IABP, Impella). Si el VI ya está muy deprimido, ese aumento de poscarga puede reducir aún más su propio gasto y elevar la presión telediastólica, provocando edema pulmonar agudo pese al soporte circulatorio aparentemente completo. Dos estrategias reales: 1) combinar el ECMO VA con un IABP o un catéter Impella para reducir la poscarga del VI; 2) drenar sangre del propio ventrículo izquierdo para reducir su presión telediastólica ("venteo" del VI).',
    },
    {
        id: 'umimc-q017', tema: 'umi-mc-dificiles',
        enunciado: 'Politraumatizado con PVC alta, gasto cardíaco bajo y RVS alta por catéter de Swan-Ganz. ¿Cuál es el siguiente paso más útil para orientar el diagnóstico?',
        opciones: [
            'Repetir la medición del gasto cardíaco: el patrón hemodinámico ya distingue shock cardiogénico de obstructivo',
            'Ecocardiografía a pie de cama (FATE): el patrón PVC alta/GC bajo/RVS alta es idéntico en shock cardiogénico y obstructivo, el Swan-Ganz por sí solo no los distingue',
            'Aumentar la PAM objetivo con más vasopresor antes de seguir investigando',
            'Asumir shock cardiogénico, al ser la causa más frecuente de ese patrón hemodinámico',
        ],
        correcta: 1,
        explicacion: 'La Tabla de patrones hemodinámicos del shock muestra que cardiogénico y obstructivo comparten exactamente el mismo patrón (PVC alta/GC bajo/RVS alta) — ningún número adicional del propio Swan-Ganz los separa. En un politraumatizado (riesgo real de taponamiento o neumotórax a tensión), la ecografía a pie de cama es la herramienta que de verdad distingue ambas causas (derrame pericárdico/colapso de cavidades vs. disfunción ventricular visual), no repetir el mismo dato hemodinámico ni asumir la causa más frecuente sin comprobarla.',
    },
    {
        id: 'umimc-q018', tema: 'umi-mc-dificiles', tipo: 'redactar',
        enunciado: 'Paciente con cambio agudo del nivel de conciencia en las últimas 24h, fluctuante, con dificultad para mantener la atención y pensamiento desorganizado, en perfusión continua de midazolam por agitación. Aplica los criterios CAM-UCI, confirma el diagnóstico, y explica qué cambio de estrategia de sedación está respaldado por la evidencia y por qué.',
        respuestaModelo: 'Según la regla diagnóstica CAM-UCI, el delirio es positivo si están presentes los criterios 1 (inicio agudo o curso fluctuante) y 2 (inatención), más al menos uno de los criterios 3 o 4 — aquí se cumplen el 1, el 2 y el pensamiento desorganizado, así que el diagnóstico de delirio queda confirmado. La evidencia prefiere dexmedetomidina sobre benzodiacepinas (como el midazolam) y opioides, por su menor asociación con delirio; además, se recomiendan ventanas de sedación diarias (interrupción/reducción programada) para permitir una evaluación neurológica repetida y minimizar el tiempo de sedación innecesaria — cambiar la perfusión de midazolam por dexmedetomidina, con ventanas diarias, es el cambio respaldado por la evidencia.',
    },
    {
        id: 'umimc-q019', tema: 'umi-mc-dificiles',
        enunciado: 'Paciente en TRR continua con anticoagulación regional con citrato: los requerimientos de calcio aumentan de forma progresiva y el ratio calcio total/calcio iónico sube de 2,2 a 3,4 en 8 horas, con acidosis metabólica creciente y lactato en ascenso. ¿Cuál es la interpretación y actuación más adecuada?',
        opciones: [
            'El ratio >3,0 aislado ya es diagnóstico de acumulación de citrato: suspender la RCA de inmediato sin más estudios',
            'El ratio >3,0 sostenido, junto con el aumento de los requerimientos de calcio, la acidosis metabólica y el lactato ascendente, apoya considerar la discontinuación de la RCA tras intentar optimizarla',
            'El ratio T/iCa no tiene valor clínico en la monitorización de la RCA, solo importa el calcio iónico aislado',
            'Es un patrón esperado y transitorio de la RCA que no requiere ninguna acción mientras el calcio iónico esté en rango objetivo',
        ],
        correcta: 1,
        explicacion: 'El ratio T/iCa nunca se interpreta aislado — siempre junto al calcio iónico, los requerimientos de calcio, el estado ácido-base y su tendencia. Aquí los 4 elementos apuntan en la misma dirección (ratio>3,0 sostenido + requerimientos de calcio en aumento + acidosis y lactato empeorando), lo que sí apoya considerar la discontinuación de la RCA tras un intento de optimización — ni un solo dato aislado (A) ni ignorar la tendencia completa (C, D) son la lectura correcta.',
    },
    {
        id: 'umimc-q020', tema: 'umi-mc-dificiles',
        enunciado: 'Varón de 78 años con FA de nueva aparición, sin insuficiencia cardíaca, sin HTA, sin diabetes, sin antecedente de ictus/AIT/tromboembolismo, sin enfermedad vascular. Calcula su CHA₂DS₂-VASc y determina la indicación de anticoagulación.',
        opciones: [
            '1 punto (solo por la edad): riesgo mínimo, no anticoagular',
            '2 puntos (edad >75 años aporta 2 puntos): riesgo definido, anticoagulación indicada',
            '2 puntos, pero al ser varón se necesitan ≥3 puntos para alcanzar "riesgo definido"',
            '0 puntos, porque no tiene ningún factor de riesgo cardiovascular clásico',
        ],
        correcta: 1,
        explicacion: 'La edad >75 años aporta 2 puntos por sí sola (no 1) en el CHA₂DS₂-VASc. El umbral de "riesgo definido" es ≥2 puntos en varones (≥3 en mujeres, por el punto adicional que aporta el sexo femenino) — con 2 puntos ya alcanzados solo por la edad, este varón entra en riesgo definido, no en una zona intermedia. La opción C replica exactamente el error de confundir el umbral femenino con el masculino.',
    },
    {
        id: 'umimc-q021', tema: 'umi-mc-dificiles', tipo: 'redactar',
        enunciado: 'Paciente con antecedente de alcoholismo crónico y desnutrición grave, ingresado hace 5 días, inicia nutrición parenteral con aporte calórico agresivo. A las 48h desarrolla una nueva arritmia, con hipofosfatemia, hipopotasemia e hipomagnesemia de nueva aparición. ¿Qué síndrome hay que sospechar, cuál es su mecanismo, y cómo se debería haber manejado el inicio de la nutrición?',
        respuestaModelo: 'Es un síndrome de realimentación (refeeding syndrome) — el paciente desnutrido crónico tiene depleción intracelular de fósforo, potasio y magnesio aunque sus niveles séricos puedan parecer normales antes de alimentar. Al iniciar un aporte calórico agresivo (sobre todo de glucosa), se produce un pico de secreción de insulina que desplaza fósforo, potasio y magnesio hacia el espacio intracelular, provocando una caída brusca de sus niveles séricos, con riesgo real de arritmias, debilidad muscular e insuficiencia respiratoria. El manejo correcto habría sido un avance calórico lento y progresivo (no agresivo) en este paciente de alto riesgo, con reposición de fósforo/potasio/magnesio y monitorización estrecha antes y durante el inicio de la alimentación, no después de que aparezcan las alteraciones.',
    },
    {
        id: 'umimc-q022', tema: 'umi-mc-dificiles',
        enunciado: 'Paciente con CAR-T que presenta a la vez síndrome de liberación de citocinas (SLC) grado 2 (hipotensión que responde a volumen) e ICANS grado 2 (confusión leve, puntuación de encefalopatía reducida). ¿Cuál es el manejo correcto?',
        opciones: [
            'Tocilizumab 8 mg/kg, suficiente para tratar ambos cuadros a la vez',
            'Tocilizumab 8 mg/kg (para el SLC) + dexametasona 10 mg/6h iv (para el ICANS) de forma simultánea, no secuencial',
            'Solo dexametasona, porque el componente neurológico siempre predomina sobre el SLC en la decisión terapéutica',
            'Esperar 24h de observación antes de iniciar cualquier tratamiento, al ser ambos de grado 2',
        ],
        correcta: 1,
        explicacion: 'El SLC grado 2 tiene como primera línea tocilizumab 8 mg/kg, pero el tocilizumab no trata el componente neurológico del ICANS — el ICANS grado 2 exige, de forma independiente, corticoides (dexametasona 10 mg/6h iv) además de valoración por Neurología. Cuando ambos cuadros coexisten, el tratamiento de uno no sustituye al del otro: se administran los dos a la vez, sin esperar ni elegir solo uno.',
    },
];

export const temasMcDificiles = [
    { key: 'umi-mc-dificiles', etiqueta: 'Preguntas MC difíciles' },
];
