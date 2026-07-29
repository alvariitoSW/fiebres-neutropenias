// Datos estructurados para el módulo de Trasplante de Progenitores Hematopoyéticos.
// Basado en protocolos internos del Servicio de Hematología y Hemoterapia (UTH)
// sobre fallo de injerto/injerto pobre y manejo según quimerismo.

export const falloInjertoData = {
    primario: {
        titulo: 'Fracaso primario de injerto',
        definicion: 'Falta de recuperación en el día +28 post-TPH: neutrófilos &lt;0.5x10⁹/L, plaquetas &lt;20x10⁹/L y hemoglobina &lt;80 g/L. En acondicionamiento de intensidad reducida (RIC), confirmar con quimerismo.',
        incidencia: '&lt;1% en auto-TPH (sobre todo con sangre periférica). &lt;5% en alo-TPH mieloablativo 10/10. 10% en TPH con disparidades HLA. 10-30% en alo-TPH con depleción de linfocitos T. 5-20% en TPH con acondicionamiento RIC. 10-20% en TPH haploidéntico.'
    },
    secundario: {
        titulo: 'Fracaso secundario de injerto',
        definicion: 'Descenso de neutrófilos &lt;500/µL en sangre periférica tras una recuperación transitoria inicial, no relacionado con recaída, infección ni toxicidad farmacológica. En alo-TPH de intensidad reducida: pérdida de ≥5% de quimerismo.',
        incidencia: 'Menos frecuente que el fracaso primario; el diagnóstico diferencial con recaída/infección/toxicidad es obligado antes de etiquetarlo como tal.'
    },
    pobre: {
        titulo: 'Injerto pobre (poor graft function)',
        definicion: '2 o 3 citopenias que se mantienen más de 2 semanas a partir del día +28, con quimerismo donante &gt;5%.',
        incidencia: 'Variable; más frecuente cuanto mayor es la disparidad HLA o la depleción de linfocitos T del inóculo.'
    },
    rechazo: {
        titulo: 'Rechazo del injerto',
        definicion: 'Fracaso de injerto con reaparición de células linfoides del receptor (generalmente linfocitos T o NK — rechazo celular), con o sin presencia simultánea del resto de la hematopoyesis del huésped (normal o tumoral). Más raro: rechazo humoral por anticuerpos (p. ej. anti-HLA en TPH haploidéntico) no afectado por el acondicionamiento ni la inmunosupresión.',
        incidencia: 'Especialmente relevante en TPH con disparidad HLA (haploidéntico, DNE con mismatch).'
    }
};

export const causasFalloInjerto = [
    'Infecciones, sobre todo víricas (CMV, VHH-6, VHH-8, parvovirus); una sepsis también puede producirlo.',
    'Fármacos mielotóxicos: cotrimoxazol, valganciclovir, metotrexato, micofenolato mofetilo.',
    'Sensibilización a antígenos HLA en pacientes politransfundidos.',
    'Fallos en el microambiente medular (nicho).'
];

export const factoresRiesgoFalloInjerto = {
    progenitores: 'Cantidad de CD34 infundida (causa modificable). Fuente: mayor riesgo con sangre de cordón umbilical &gt; médula ósea &gt; sangre periférica. Esplenomegalia (secuestro de progenitores). Depleción de linfocitos T y selección de CD34.',
    nicho: 'Fibrosis medular, infiltración y sobrecarga férrica.',
    enfermedad: 'Enfermedad activa y refractaria, con más de 1 año desde el diagnóstico.',
    inmunologicos: 'Diferencias HLA. Anticuerpos anti-HLA frente al donante (HLA-DSA) — valorar desensibilización. Incompatibilidad ABO mayor: más riesgo de aplasia de serie roja.',
    tecnica: 'Acondicionamiento de intensidad reducida (mayor riesgo; controlar quimerismo en linfocitos T — si &lt;25-50% valorar intervención por alto riesgo). Inmunosupresión deficiente. EICR. Fármacos o virus mielotóxicos.'
};

export const manejoFalloInjertoData = {
    auto: {
        titulo: 'Auto-TPH',
        manejo: 'Tratamiento de soporte con hemoderivados y profilaxis infecciosa de neutropenia de alto riesgo (ciprofloxacino, aciclovir, posaconazol). Suspender fármacos mielotóxicos (p. ej. cotrimoxazol). Descartar reactivación de CMV con PCR seriadas. G-CSF y agonistas del receptor de trombopoyetina (A-TPO). Si no hay recuperación, plantear mini-alo si existe donante disponible.'
    },
    'alo-quimerismo-completo': {
        titulo: 'Alo-TPH — quimerismo completo del donante',
        manejo: 'Iniciar G-CSF ± agonista del receptor de trombopoyetina (A-TPO) ± EPO. Planificar re-infusión de progenitores del donante (boost de CD34, sin acondicionamiento ni inmunosupresión) si el fallo persiste más de 3 meses.'
    },
    'alo-quimerismo-mixto-lt': {
        titulo: 'Alo-TPH — quimerismo mixto con aumento de linfocitos T del receptor',
        manejo: 'El estudio de quimerismo con separación de poblaciones (CD3/CD19/CD15/CD34) es clave. Un patrón creciente en linfocitos T del receptor (&gt;50% de LT y &gt;90% de células NK entre los días +21 y +28) se asocia a alto riesgo de rechazo del injerto: aumentar la inmunosupresión para controlar la población residual del receptor. Si no se puede controlar, valorar infusión de linfocitos del donante (ILD).'
    },
    'alo-quimerismo-mixto-cd34': {
        titulo: 'Alo-TPH — quimerismo mixto en progenitores CD34',
        manejo: 'Alto riesgo: plantear retirada de inmunosupresión e infusión de linfocitos del donante (ILD), con o sin quimioterapia asociada. No debe ser una decisión aislada — tener en cuenta la enfermedad de base, su situación (recaída subclínica/clínica/progresión), presencia de EICR, tipo de TPH y tiempo transcurrido.'
    },
    'alo-reconstitucion-autologa': {
        titulo: 'Alo-TPH — reconstitución autóloga establecida',
        manejo: 'Planificar un segundo TPH según las características del paciente y su enfermedad de base, siempre con acondicionamiento (preferible de intensidad reducida). El donante haploidéntico puede ofrecer la ventaja de un acceso más rápido (descartando antes anticuerpos anti-HLA). Valorar añadir irradiación corporal total para mejorar el injerto. Edad avanzada, mal estado general y afectación importante de algún órgano se asocian a peor supervivencia global. Si se sospecha daño del estroma medular, el tratamiento con células mesenquimales es una alternativa, hoy por hoy de uso compasivo.'
    },
    'alo-aplasia-medular': {
        titulo: 'Alo-TPH por aplasia medular — quimerismo mixto ascendente',
        manejo: 'Aproximación diferente a la de las hemopatías malignas: ante un quimerismo mixto ascendente, en la mayoría de los casos se aumenta la inmunosupresión, pudiendo valorarse también infusión de linfocitos del donante (ILD) o eltrombopag. Lo habitual es permanecer con un quimerismo mixto estable — el descenso de la inmunosupresión se inicia a partir de los 6-9 meses, para retirarla en 1-1,5 años (protocolo GETH de aplasia medular, 2019).'
    }
};

export const criteriosDonanteData = {
    hermanoIdeal: {
        titulo: 'Hermano HLA idéntico (donante ideal, 10/10)',
        definicion: 'Identidad genotípica 10/10 en los loci A, B, C, DRB1 y DQB1.',
        jerarquia: 'Por este orden: <strong>edad</strong> (donante más joven) → <strong>serología CMV</strong> (idéntica donante/receptor) → <strong>grupo sanguíneo</strong> (igual al del receptor). Sin orden establecido entre sí: sexo (evitar donante mujer si el receptor es varón), embarazos previos (evitar en donante mujer), peso (mayor superficie corporal), transfusiones (preferible sin antecedentes).'
    },
    hermanoAceptable: {
        titulo: 'Donante familiar aceptable (9/10)',
        definicion: 'Hermano, progenitor o descendiente con una única diferencia HLA (9/10) en los loci A, B, C, DRB1, DQB1 por alta resolución, descartando anticuerpos anti-HLA frente al donante (HLA-DSA).',
        jerarquia: 'Se prefiere un donante familiar 9/10 antes que iniciar una búsqueda internacional — solo se inicia búsqueda de DNE si los hermanos tienen 2 o más diferencias HLA.'
    },
    dne: {
        titulo: 'Donante no emparentado (DNE, vía REDMO)',
        definicion: 'Ideal: mismos alelos HLA en alta resolución en A, B, C, DRB1 y DQB1 (10/10). Aceptable: 9/10 (una diferencia en cualquier locus), o 8/10 si una o ambas diferencias recaen en DQB1.',
        jerarquia: 'Con varios candidatos, por relevancia: <strong>edad del donante</strong> (hoy el factor de mayor impacto en la supervivencia) → identidad serológica frente a CMV → donante varón (o mujer nulípara si no hay varón) → mayor peso del donante → mismo grupo ABO → alorreactividad KIR (relevante pero sin consenso). Valorar también si el DPB1 es idéntico o "mismatch permisivo". Retipaje obligatorio en receptor y donante antes de iniciar movilización/acondicionamiento.'
    },
    haploidentico: {
        titulo: 'Donante haploidéntico',
        definicion: 'Comparte un haplotipo HLA completo con el receptor (identidad 5/10 o 6/10). Se propone cuando no hay donante familiar idéntico/9-10 ni DNE 10/10 en un tiempo razonable.',
        jerarquia: 'Por este orden: <strong>HLA</strong> (elegir donante con antígeno ausente para el que el receptor tiene anticuerpos, si es posible — se prefiere un DNE 9/10 frente a un haploidéntico con antígenos frente a los que el receptor tiene DSA) → edad (más joven) → serología CMV idéntica (evitar donante seronegativo/receptor seropositivo) → alorreactividad KIR (haplotipo del donante BB o AB preferible) → grupo sanguíneo. Sin orden establecido: sexo, embarazos previos, peso, transfusiones — igual que en el hermano idéntico.'
    }
};

export const intensidadAcondicionamientoData = [
    { nivel: 'Mieloablativo (AMA)', descripcion: 'Produce citopenias intensas que no pueden recuperarse sin soporte de progenitores hematopoyéticos.' },
    { nivel: 'Intensidad reducida (AIR)', descripcion: 'Intermedio entre mieloablativo y no mieloablativo. Incluye: ICT &lt;5 Gy en dosis única (u 8 Gy fraccionada), busulfán &lt;9 mg/kg oral (o dosis equivalente IV), melfalán &lt;140 mg/m², tiotepa &lt;10 mg/kg.' },
    { nivel: 'No mieloablativo (ANM)', descripcion: 'Produce citopenias moderadas, recuperables sin soporte de progenitores.' }
];

export const regimenesAcondicionamientoData = [
    { diagnostico: 'LMA / SMD', regimen: 'BU-FLU (2, 3 o 4 días de busulfán) o Treosulfán-FLU', tipo: 'Alogénico' },
    { diagnostico: 'LLA / patología linfoide', regimen: 'ICT-FLU, BU-FLU (2, 3 o 4 días) o Treosulfán-FLU', tipo: 'Alogénico' },
    { diagnostico: 'Mieloide y linfoide (con enfermedad)', regimen: 'BU-FLU (2, 3 o 4 días) o Treosulfán-FLU', tipo: 'Alogénico haploidéntico' },
    { diagnostico: 'Linfoma de Hodgkin', regimen: 'BU-FLU o Treosulfán-FLU', tipo: 'Alogénico haploidéntico' },
    { diagnostico: 'Mieloide y linfoide', regimen: 'TBF (treosulfán-busulfán-fludarabina)', tipo: 'Alogénico de intensidad reducida' },
    { diagnostico: 'Mieloide y linfoide (rescate)', regimen: 'FLU-MEL', tipo: 'Alogénico de rescate' },
    { diagnostico: 'Aplasia medular', regimen: 'Protocolo GETH', tipo: 'Alogénico haploidéntico' },
    { diagnostico: 'LMA', regimen: 'BEA', tipo: 'Autólogo' },
    { diagnostico: 'Linfomas', regimen: 'BEAM', tipo: 'Autólogo' },
    { diagnostico: 'Linfoma no Hodgkin con afectación de SNC', regimen: 'BCNU-TT (BRAM)', tipo: 'Autólogo' },
    { diagnostico: 'Mieloma múltiple', regimen: 'Melfalán 200 (infusión IV directa en 5 min desde 2022)', tipo: 'Autólogo' }
];

export const soporteComunAcondicionamiento = [
    { titulo: '💧 Hidratación y diuresis alcalina', texto: 'Sueroterapia 2-3 L/m²/24h en perfusión continua desde la noche previa al inicio de la quimioterapia hasta 24h tras finalizarla. Bicarbonato si hay carga tumoral elevada y no hay riesgo de sobrecarga. Alopurinol si hay carga tumoral elevada o leucocitosis.' },
    { titulo: '🤢 Antieméticos y protección gástrica', texto: 'En alogénico: granisetrón IV + lorazepam + aprepitant (los días de ciclofosfamida e ICT) + dexametasona. En autólogo: granisetrón y aprepitant con melfalán/BCNU, seguido de ondansetrón oral. Protección gástrica con pantoprazol; ácido ursodesoxicólico como protección de EVOH en alogénico.' },
    { titulo: '🦠 Profilaxis antiinfecciosa', texto: 'Fluconazol desde el día +5 (no en autólogo salvo LMA; alternativa anidulafungina si toxicidad por azoles o alto riesgo). Aciclovir oral desde el inicio. Ciprofloxacino desde el día -1 en alogénico (levofloxacino en autólogo ambulatorio desde el +1).' },
    { titulo: '🧬 Profilaxis de EICH', texto: 'Con ciclofosfamida post-TPH: ciclofosfamida a dosis altas días +3 y +4, seguida de tacrolimus (o ciclosporina/sirolimus) desde el +5 y micofenolato de mofetilo hasta el +28. Sin ciclofosfamida post-TPH: ciclosporina desde el día -1 + metotrexato en días fijos post-infusión.' },
    { titulo: '🩸 Profilaxis de cistitis hemorrágica', texto: 'MESNA al 100% de la dosis de ciclofosfamida, iniciando 20 minutos antes y manteniendo 24h después, junto con hiperhidratación y furosemida tras la ciclofosfamida.' },
    { titulo: '🦠 Profilaxis de CMV', texto: 'Letermovir en receptores IgG+ sometidos a TPH haploidéntico, 9/10, con corticoides o con injerto pobre y quimera completa.' },
    { titulo: '🧠 Profilaxis de recidiva en SNC', texto: 'Triple terapia intratecal durante el acondicionamiento en LLA, LMC en fase acelerada, linfomas con criterios de riesgo y LMA de riesgo.' },
    { titulo: '💊 Profilaxis de sangrado', texto: 'Fitomenadiona (vitamina K) 10 mg iv, 1 ampolla semanal, solo en alogénico.' }
];

export const irradiacionCorporalTotalData = {
    indicacion: 'Se usa sobre todo en el acondicionamiento de leucemias linfoblásticas agudas, o en enfermedad sistémica de alto riesgo de recaída que tolere un régimen mieloablativo (linfomas, LMA), habitualmente en pacientes menores de 40 años. Se asocia principalmente a fludarabina o ciclofosfamida.',
    dosis: '12 Gy totales, en fracciones de 2 Gy, 2 veces al día, durante 3 días consecutivos (mínimo 6h entre sesiones).',
    antiemesis: 'Granisetrón IV 3 mg/12h + dexametasona 4 mg/12h + aprepitant (120 mg el día 1, 80 mg los días 2 y 3), puesto al menos 20 minutos antes de cada sesión; el paciente debe acudir en ayunas.'
};

export const mucositisGradosData = {
    0: {
        criterio: 'Sin afectación de la mucosa.',
        tratamiento: 'Mantener las medidas preventivas: higiene bucodental tras las comidas, colutorios con clorhexidina sin alcohol y profilaxis de candidiasis con nistatina oral.'
    },
    1: {
        criterio: 'Dolor y eritema, sin úlceras.',
        tratamiento: 'Analgesia según la escalera de la OMS (paracetamol/AINE), manteniendo la dieta y la higiene bucodental habituales.'
    },
    2: {
        criterio: 'Eritema y úlceras, con tolerancia a alimentos sólidos.',
        tratamiento: 'Adaptar la textura de la dieta (blanda) y añadir analgesia con opioides menores (tramadol) si el dolor es moderado.'
    },
    3: {
        criterio: 'Úlceras que solo permiten dieta líquida.',
        tratamiento: 'Sueroterapia y soporte nutricional si la ingesta es insuficiente. Analgesia con opioides potentes: cloruro mórfico en perfusión continua o parches de fentanilo.'
    },
    4: {
        criterio: 'Odinofagia intensa que impide cualquier dieta oral.',
        tratamiento: 'Nutrición parenteral y analgesia opioide en perfusión continua. Recoger muestras orales de las lesiones si se sospecha sobreinfección fúngica o vírica, y confirmar que la profilaxis herpética (aciclovir) está activa.'
    }
};

export const dolorEtiologiaData = {
    mucositis: 'Suele iniciarse a los 2-7 días de finalizar el acondicionamiento y dura de media 10-14 días — más del 90% de los pacientes requieren opioides. Dolor leve-moderado: tramadol 50-100 mg/6-8h (también útil en dolor neuropático; espaciar a cada 12h en insuficiencia renal o hepática moderada). Dolor grave: cloruro mórfico 0,5-1 mg/h en perfusión continua, o parches de fentanilo (dosis mínima 12-25 mcg/h; de elección en insuficiencia renal, pero de inicio lento, por lo que no sirve para el dolor agudo). No combinar un opioide débil con uno potente, ni dos potentes entre sí.',
    cistitisHemorragica: 'Dolor de tipo espasmódico: butilescopolamina 20 mg/8h, o si no está disponible, oxibutinina oral. Si no se controla, escalar a opioides como en la mucositis. Descartar siempre coágulos que estén provocando obstrucción y, en consecuencia, los espasmos.',
    evohSos: 'Dolor por distensión de la cápsula hepática: paracetamol (contraindicado si insuficiencia hepática) y opioides menores. Evitar AINE por el riesgo de insuficiencia renal asociado a la EVOH/SOS. Los opioides mayores rara vez son necesarios.',
    eichIntestinal: 'Dolor cólico complejo de difícil control; los opioides enlentecen el peristaltismo y pueden favorecer el íleo paralítico, pero suelen ser necesarios: cloruro mórfico en perfusión continua + butilescopolamina 20 mg/8h para las exacerbaciones cólicas, asociando octreótido 0,05-0,1 mg/12h sc para reducir la secreción intestinal.'
};

export const clostridioidesData = {
    factoresRiesgo: 'Tratamiento antibiótico mantenido, hospitalización prolongada, edad avanzada, disminución de la secreción gástrica (IBP/anti-H2), quimioterapia, neutropenia y TPH.',
    diagnostico: 'Indicado en heces diarreicas (≥3 deposiciones blandas en 24h), sobre todo con factores de riesgo presentes. Detección de GDH y, si es positiva, confirmación de cepa toxigénica (inmunocromatografía y/o detección de genes de toxinas). No se recomienda repetir pruebas tras el tratamiento para confirmar curación — la colonización puede persistir pese a la evolución favorable.',
    tratamiento: {
        leveMod: 'Fidaxomicina 200 mg/12h oral 10 días, o vancomicina 125 mg/6h oral 10 días. Las recidivas son menos frecuentes con fidaxomicina, sobre todo en pacientes inmunodeprimidos.',
        grave: 'Igual que leve-moderada (fidaxomicina o vancomicina). Si alto riesgo de recidiva (edad &gt;65 años, antibioterapia mantenida, inmunosupresión, colitis previa en los últimos 6 meses): añadir bezlotoxumab 10 mg/kg en 1h.',
        complicada: 'Vancomicina 500 mg/6h oral (o fidaxomicina 200 mg/12h) + bezlotoxumab 10 mg/kg. Considerar añadir metronidazol 500 mg/8h IV. Si íleo o megacolon, considerar vancomicina en enemas. Si persiste la gravedad a las 48-72h, valorar cirugía general y trasplante de microbiota fecal.',
        primeraRecidiva: 'Si el episodio inicial se trató con vancomicina: fidaxomicina 200 mg/12h 5 días, seguida de 200 mg a días alternos 20 días. Si se trató con fidaxomicina: vancomicina 125 mg/6h o fidaxomicina 200 mg/12h 10 días + bezlotoxumab. Sin fidaxomicina ni bezlotoxumab disponibles: vancomicina en pauta decreciente (125 mg/6h 10d → 125 mg/12h 7d → 125 mg/24h 7d → 125 mg cada 3-4 días 2-8 semanas).'
    },
    aislamiento: 'Habitación individual sin compartir baño. Bata y guantes para todo contacto, retirados al salir. Lavado de manos con agua y jabón. Limpieza diaria con desinfectante clorado. Retirar el aislamiento cuando el paciente lleve 48h sin diarrea (máximo 2 deposiciones/día, de consistencia normal o blandas pero formadas).'
};
