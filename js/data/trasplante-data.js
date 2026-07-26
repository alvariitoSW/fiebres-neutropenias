// Datos estructurados para el módulo de Trasplante de Progenitores Hematopoyéticos.
// Basado en protocolos internos del Servicio de Hematología y Hemoterapia (UTH)
// sobre fallo de injerto/injerto pobre y manejo según quimerismo.

export const falloInjertoData = {
    primario: {
        titulo: 'Fracaso primario de injerto',
        definicion: 'Falta de recuperación en el día +28 post-TPH: neutrófilos &lt;0.5x10⁹/L, plaquetas &lt;20x10⁹/L y hemoglobina &lt;80 g/L. En acondicionamiento de intensidad reducida (RIC), confirmar con quimerismo.',
        incidencia: '&lt;1% en auto-TPH (sobre todo con sangre periférica). &lt;5% en alo-TPH mieloablativo 10/10. 10-30% en alo-TPH con depleción de linfocitos T. 5-20% en TPH con acondicionamiento RIC. 10-20% en TPH haploidéntico.'
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
