// Datos puros para el módulo "Púrpura Trombótica Trombocitopénica (PTT)".
// Fuente: Zheng XL, Al-Housni Z, Cataland SR, Coppo P, Geldziler B, Germini F,
// Iorio A, Keepanasseril A, Masias C, Matsumoto M, McCrae KR, McIntyre J,
// Mustafa RA, Peyvandi F, Russell L, Tarawneh R, Vesely SK, on behalf of the
// ISTH. 2025 focused update of the 2020 ISTH guidelines for management of
// thrombotic thrombocytopenic purpura. J Thromb Haemost. 2025;23(10):3711-3732.
// Puntuaciones French/PLASMIC citadas por esa guía (refs. 18 y 19):
// - Coppo P, et al. Predictive features of severe acquired ADAMTS13
//   deficiency in idiopathic thrombotic microangiopathies: the French TMA
//   reference center experience. PLOS One. 2010;5:e10208.
// - Bendapudi PK, et al. Derivation and external validation of the PLASMIC
//   score for rapid assessment of adults with thrombotic microangiopathies:
//   a cohort study. Lancet Haematol. 2017;4:e157-64.

export const pttTipos = {
    iTTP: {
        titulo: 'PTT inmune (iTTP)',
        subtitulo: 'Adquirida — autoanticuerpos anti-ADAMTS-13',
        texto: 'Forma más frecuente. Autoanticuerpos IgG frente a ADAMTS-13 inhiben su actividad y/o aceleran su aclaramiento, produciendo un déficit grave (&lt;10 UI/dL o &lt;10% de la normalidad). Debut típico en la edad adulta, con episodios agudos que responden a inmunosupresión.',
    },
    cTTP: {
        titulo: 'PTT congénita (cTTP)',
        subtitulo: 'Hereditaria — mutaciones bialélicas de ADAMTS13 (síndrome de Upshaw-Schulman)',
        texto: 'Mucho más rara. Mutaciones del gen ADAMTS13 (~250 descritas) que alteran la secreción o la función de la proteasa. Suele debutar antes, con episodios recurrentes a lo largo de la vida; los anticuerpos anti-ADAMTS-13 son repetidamente negativos y el diagnóstico se confirma con test genético.',
    },
};

// Puntuación French (Coppo et al. 2010): 3 criterios, 0-3 puntos.
export const pttFrenchScoreItems = [
    { id: 'plaquetas', label: 'Recuento plaquetario < 30 × 10⁹/L', puntos: 1 },
    { id: 'creatinina', label: 'Creatinina sérica < 200 μmol/L (< 2,3 mg/dL)', puntos: 1 },
    { id: 'ana', label: 'Anticuerpos antinucleares (ANA) positivos', puntos: 1 },
];
export const pttFrenchScoreCorte = 2; // ≥2 = alto riesgo de déficit grave de ADAMTS-13

// Puntuación PLASMIC (Bendapudi et al. 2017): 7 criterios, 0-7 puntos.
export const pttPlasmicScoreItems = [
    { id: 'plaquetas', label: 'Plaquetas < 30 × 10⁹/L', puntos: 1 },
    { id: 'hemolisis', label: 'Hemólisis (reticulocitos > 2,5%, o haptoglobina indetectable, o bilirrubina indirecta > 2 mg/dL)', puntos: 1 },
    { id: 'sinCancer', label: 'Sin cáncer activo (últimos 12 meses)', puntos: 1 },
    { id: 'sinTrasplante', label: 'Sin trasplante de órgano sólido o progenitores hematopoyéticos', puntos: 1 },
    { id: 'vcm', label: 'VCM < 90 fL', puntos: 1 },
    { id: 'inr', label: 'INR < 1,5', puntos: 1 },
    { id: 'creatinina', label: 'Creatinina < 2,0 mg/dL', puntos: 1 },
];
export const pttPlasmicScoreRangos = [
    { min: 0, max: 4, riesgo: 'Riesgo bajo de déficit grave de ADAMTS-13', color: 'var(--accent-green)' },
    { min: 5, max: 5, riesgo: 'Riesgo intermedio', color: 'var(--accent-yellow)' },
    { min: 6, max: 7, riesgo: 'Riesgo alto de déficit grave de ADAMTS-13', color: 'var(--accent-red)' },
];

export const pttDesencadenantesRecaida = [
    'Infecciones (gripe, neumonía adquirida en la comunidad, infecciones periodontales y dentales, gastroenteritis)',
    'Embarazo',
    'Traumatismo mayor o cirugía',
    'Anticonceptivos orales',
    'Cocaína y otras drogas recreativas',
    'Fármacos: quinina, ticlopidina, clopidogrel, inhibidores de checkpoint, ciclosporina, tacrolimus',
    'Pancreatitis',
];

export const pttComplicacionesLargoPlazo = [
    'Trastornos del estado de ánimo (depresión, ansiedad)',
    'Síntomas neurocognitivos, incluidos problemas de memoria a corto plazo',
    'Hipertensión arterial de novo durante la remisión',
];

// Tratamientos para PTT refractaria: evidencia escasa (GPS 14-18, 20-21).
export const pttRefractariaData = [
    { farmaco: 'Vincristina', dosis: '2 mg IV en infusión lenta, dosis única habitual (dosis adicionales pueden causar neurotoxicidad y mielosupresión).' },
    { farmaco: 'Ciclosporina A', dosis: '300 mg/día oral, o 2-3 mg/kg/día IV en 2 dosis. Duración óptima desconocida; se ha descrito su uso durante varios meses seguido de descenso progresivo.' },
    { farmaco: 'Ciclofosfamida', dosis: '500 mg/día IV en infusión de 2 horas, dosis única habitual (dosis adicionales pueden causar mielosupresión grave).' },
    { farmaco: 'Esplenectomía', dosis: 'Prácticamente sustituida por otros tratamientos (p. ej. rituximab); actualmente casi no se usa, aunque puede tener un papel en pacientes seleccionados.' },
    { farmaco: 'Azatioprina', dosis: 'Considerada a veces para inhibir la producción de autoanticuerpos anti-ADAMTS-13 en enfermedad refractaria a tratamiento estándar.' },
    { farmaco: 'Eculizumab (anti-C5)', dosis: 'Muy seleccionados casos refractarios o sin respuesta a otras opciones; se ha demostrado activación del complemento en la PTT aguda, pero la estrategia debe usarse con cautela.' },
];

// Nota explícita: la inmunoglobulina IV generalmente NO se usa en la PTT —
// eficacia desconocida y sus reacciones adversas pueden simular
// manifestaciones trombóticas, neurológicas y renales de la propia PTT.

export const pttEmbarazoData = [
    'Las mujeres con antecedente de PTT que planean embarazo deben recibir consejo preconcepcional, valorando los riesgos (recaída, pérdida fetal, preeclampsia) y las preferencias de la paciente.',
    'Una actividad de ADAMTS-13 normal al inicio del embarazo se asocia a menor riesgo de recaída inmediata; una actividad baja (&lt;10 UI/dL) se asocia a mayor riesgo.',
    'En algunas instituciones, mujeres con actividad de ADAMTS-13 disminuida antes o al inicio del embarazo reciben rituximab profiláctico para normalizar la actividad antes de la concepción; tras rituximab se recomienda esperar 6-12 meses antes de buscar embarazo.',
    'Seguimiento estrecho por hematología y medicina materno-fetal durante todo el embarazo, con hemograma mensual y actividad de ADAMTS-13 cada 2-3 meses al menos (más frecuente si la actividad desciende).',
    'Si la actividad de ADAMTS-13 desciende de forma significativa durante el embarazo (habitualmente &lt;30 UI/dL o 30% de la normalidad), incluso sin signos o síntomas clínicos, suele considerarse TPE y corticoides (o azatioprina).',
    'Profilaxis con infusión de plasma (10-15 mL/kg semanal o cada 2 semanas, o TPE) según antecedente de PTTc o PTTi; frecuencia aumentada a semanal o dos veces por semana desde el 2º-3er trimestre.',
    'Inducción del parto a las 36-37 semanas de gestación; el parto vaginal es el método preferido si no hay otras indicaciones obstétricas para cesárea.',
    'No se recomienda ácido acetilsalicílico de forma sistemática (evidencia indirecta de otras poblaciones). Se recomienda HBPM a dosis profilácticas si hay antecedente de trombosis venosa. Anticoncepción no hormonal o solo con gestágenos preferible a la que contiene estrógenos.',
];

// Recreación esquemática de la tabla de recomendaciones GRADE de la
// actualización 2025 (Tabla 2 del artículo). "cambio" indica si hubo
// modificación respecto a las guías ISTH 2020.
export const pttRecomendaciones = [
    { num: '1', texto: 'PTTi, primer episodio agudo: añadir corticoides a la TPE frente a TPE sola.', fuerza: 'Fuerte', certeza: 'Muy baja', cambio: false },
    { num: '2', texto: 'PTTi, primer episodio agudo: añadir rituximab a corticoides+TPE frente a corticoides+TPE solos.', fuerza: 'Condicional', certeza: 'Muy baja', cambio: false },
    { num: '3', texto: 'PTTi en recaída: añadir corticoides a la TPE frente a TPE sola.', fuerza: 'Fuerte', certeza: 'Muy baja', cambio: false },
    { num: '4', texto: 'PTTi en recaída: añadir rituximab a corticoides+TPE frente a corticoides+TPE solos.', fuerza: 'Condicional', certeza: 'Muy baja', cambio: false },
    { num: '5', texto: 'PTTi, evento agudo (primero o recaída): usar caplacizumab frente a no usarlo.', fuerza: 'Condicional', certeza: 'Moderada', cambio: false },
    { num: '6', texto: 'PTTi en remisión con actividad de ADAMTS-13 persistentemente baja, sin síntomas: rituximab profiláctico frente a no usarlo.', fuerza: 'Condicional', certeza: 'Muy baja', cambio: false },
    { num: '7', texto: 'PTTc en remisión: infusión de plasma frente a estrategia de observación ("watch-and-wait").', fuerza: 'Condicional', certeza: 'Muy baja', cambio: true, cambioTexto: 'Revisada 2025 — antes neutra, ahora a favor de la infusión de plasma.' },
    { num: '8', texto: 'PTTc en remisión: se desaconseja el concentrado de factor VIII frente a observación.', fuerza: 'Condicional', certeza: 'Muy baja', cambio: false },
    { num: '8b', texto: 'PTTc en remisión: ADAMTS-13 recombinante frente a infusión de plasma para prevenir episodios agudos.', fuerza: 'Fuerte', certeza: 'Moderada', cambio: true, cambioTexto: 'Nueva recomendación 2025.' },
    { num: '9', texto: 'PTTi, embarazo, con actividad de ADAMTS-13 disminuida sin síntomas: tratamiento profiláctico frente a no tratar.', fuerza: 'Fuerte', certeza: 'Muy baja', cambio: false },
    { num: '10a', texto: 'PTTc, embarazo: tratamiento profiláctico frente a no tratar.', fuerza: 'Fuerte', certeza: 'Muy baja', cambio: false },
    { num: '10b', texto: 'PTTc, embarazo: infusión de plasma profiláctica frente a concentrados de FVIII.', fuerza: 'Condicional', certeza: 'Muy baja', cambio: false },
];

// Diagrama SVG original: microvaso con microtrombos de VWF-plaquetas y
// hematíes fragmentándose al pasar (esquistocitos), complementario al de CID.
export const pttSvgFisiopatologia = `
<svg viewBox="0 0 300 160" class="micro-svg" xmlns="http://www.w3.org/2000/svg">
  <text x="150" y="14" text-anchor="middle" class="micro-svg-label" style="fill:var(--accent-purple);font-weight:bold;font-size:9px;">MICROVASO EN LA PTT</text>
  <line x1="15" y1="45" x2="285" y2="45" style="stroke:var(--text-muted)" stroke-width="2"/>
  <line x1="15" y1="95" x2="285" y2="95" style="stroke:var(--text-muted)" stroke-width="2"/>
  <circle cx="32" cy="60" r="6" style="fill:var(--accent-red);opacity:0.6"/>
  <circle cx="32" cy="80" r="6" style="fill:var(--accent-red);opacity:0.6"/>
  <circle cx="50" cy="70" r="6" style="fill:var(--accent-red);opacity:0.6"/>
  <g>
    <circle cx="120" cy="58" r="5" style="fill:var(--accent-yellow)"/>
    <circle cx="130" cy="62" r="5" style="fill:var(--accent-yellow)"/>
    <circle cx="125" cy="72" r="5" style="fill:var(--accent-yellow)"/>
    <circle cx="138" cy="75" r="5" style="fill:var(--accent-yellow)"/>
    <circle cx="115" cy="80" r="5" style="fill:var(--accent-yellow)"/>
    <path d="M108 52 Q130 45 148 55 Q152 70 140 85 Q120 90 110 78 Q105 65 108 52 Z" style="fill:none;stroke:var(--accent-purple);stroke-width:1.4;stroke-dasharray:2,2"/>
  </g>
  <text x="130" y="110" text-anchor="middle" class="micro-svg-label" style="fill:var(--accent-purple);font-weight:bold;">Microtrombo</text>
  <text x="130" y="122" text-anchor="middle" class="micro-svg-label" style="fill:var(--accent-purple);font-weight:bold;">de FvW-plaquetas</text>
  <circle cx="225" cy="65" r="6" style="fill:var(--accent-red)"/>
  <path d="M235 65 L247 58 M235 65 L247 72" style="stroke:var(--accent-red)" stroke-width="1.5"/>
  <circle cx="258" cy="55" r="3" style="fill:var(--accent-red);opacity:0.7"/>
  <circle cx="260" cy="72" r="3.5" style="fill:var(--accent-red);opacity:0.7"/>
  <text x="245" y="110" text-anchor="middle" class="micro-svg-label" style="fill:var(--accent-red);font-weight:bold;">Esquistocitos</text>
  <text x="245" y="122" text-anchor="middle" class="micro-svg-label" style="fill:var(--accent-red);font-weight:bold;">(hemólisis)</text>
  <text x="150" y="142" text-anchor="middle" class="micro-svg-label">Déficit de ADAMTS-13 → FvW ultra-largo no fragmentado</text>
  <text x="150" y="153" text-anchor="middle" class="micro-svg-label">→ oclusión microvascular</text>
</svg>`;

// Diagrama SVG original: algoritmo diagnóstico-terapéutico urgente ante
// sospecha de PTT (GPS 1-3 + uso de las puntuaciones French/PLASMIC).
export const pttSvgAlgoritmo = `
<svg viewBox="0 0 300 300" class="micro-svg" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <marker id="pttArrow" markerWidth="7" markerHeight="7" refX="5" refY="2.5" orient="auto">
      <path d="M0,0 L5,2.5 L0,5 Z" style="fill:var(--text-muted)"/>
    </marker>
  </defs>

  <rect x="45" y="8" width="210" height="34" rx="4" style="fill:rgba(156,84,118,0.10);stroke:var(--accent-purple)" stroke-width="1.5"/>
  <text x="150" y="21" text-anchor="middle" class="micro-svg-label">Trombocitopenia + anemia hemolítica</text>
  <text x="150" y="33" text-anchor="middle" class="micro-svg-label">microangiopática sin otra causa</text>
  <line x1="150" y1="42" x2="150" y2="58" style="stroke:var(--text-muted)" stroke-width="1.5" marker-end="url(#pttArrow)"/>

  <rect x="55" y="60" width="190" height="34" rx="4" style="fill:rgba(0,0,0,0.2);stroke:var(--text-muted)" stroke-width="1.5"/>
  <text x="150" y="73" text-anchor="middle" class="micro-svg-label">Calcular French score o PLASMIC</text>
  <text x="150" y="85" text-anchor="middle" class="micro-svg-label">(probabilidad de déficit de ADAMTS-13)</text>
  <line x1="150" y1="94" x2="150" y2="110" style="stroke:var(--text-muted)" stroke-width="1.5" marker-end="url(#pttArrow)"/>

  <rect x="45" y="112" width="210" height="34" rx="4" style="fill:rgba(0,0,0,0.2);stroke:var(--text-muted)" stroke-width="1.5"/>
  <text x="150" y="125" text-anchor="middle" class="micro-svg-label">Muestra para ADAMTS-13 (actividad +</text>
  <text x="150" y="137" text-anchor="middle" class="micro-svg-label">anticuerpos) ANTES de iniciar TPE</text>
  <line x1="150" y1="146" x2="150" y2="162" style="stroke:var(--text-muted)" stroke-width="1.5" marker-end="url(#pttArrow)"/>

  <rect x="30" y="164" width="240" height="34" rx="4" style="fill:rgba(184,92,62,0.10);stroke:var(--accent-red)" stroke-width="1.5"/>
  <text x="150" y="177" text-anchor="middle" class="micro-svg-label" style="fill:var(--accent-red);font-weight:bold;">Iniciar TPE + corticoides URGENTE</text>
  <text x="150" y="189" text-anchor="middle" class="micro-svg-label">sin esperar el resultado de ADAMTS-13</text>
  <line x1="150" y1="198" x2="150" y2="216" style="stroke:var(--text-muted)" stroke-width="1.5" marker-end="url(#pttArrow)"/>

  <polygon points="150,218 210,248 150,278 90,248" style="fill:rgba(207,154,62,0.10);stroke:var(--accent-yellow)" stroke-width="1.5"/>
  <text x="150" y="244" text-anchor="middle" class="micro-svg-label">¿ADAMTS-13</text>
  <text x="150" y="254" text-anchor="middle" class="micro-svg-label">&lt;10 UI/dL?</text>

  <line x1="90" y1="248" x2="62" y2="248" style="stroke:var(--text-muted)" stroke-width="1.5" marker-end="url(#pttArrow)"/>
  <text x="76" y="241" text-anchor="middle" class="micro-svg-label" style="fill:var(--accent-green);">No</text>
  <rect x="2" y="233" width="60" height="34" rx="4" style="fill:rgba(144,160,106,0.10);stroke:var(--accent-green)" stroke-width="1.5"/>
  <text x="32" y="246" text-anchor="middle" class="micro-svg-label">Otro</text>
  <text x="32" y="257" text-anchor="middle" class="micro-svg-label">diagnóstico</text>

  <line x1="210" y1="248" x2="238" y2="248" style="stroke:var(--text-muted)" stroke-width="1.5" marker-end="url(#pttArrow)"/>
  <text x="224" y="241" text-anchor="middle" class="micro-svg-label" style="fill:var(--accent-red);">Sí</text>
  <rect x="238" y="228" width="60" height="44" rx="4" style="fill:rgba(184,92,62,0.12);stroke:var(--accent-red)" stroke-width="1.5"/>
  <text x="268" y="241" text-anchor="middle" class="micro-svg-label">PTT confirmada</text>
  <text x="268" y="252" text-anchor="middle" class="micro-svg-label">Ac +: PTTi</text>
  <text x="268" y="263" text-anchor="middle" class="micro-svg-label">Ac -/genética: PTTc</text>
</svg>`;

// Recreación esquemática de la Figura del artículo: árbol de decisión para
// PTTc en remisión (ADAMTS-13 recombinante vs. infusión de plasma).
export const pttSvgArbolCttp = `
<svg viewBox="0 0 300 250" class="micro-svg" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <marker id="cttpArrow" markerWidth="7" markerHeight="7" refX="5" refY="2.5" orient="auto">
      <path d="M0,0 L5,2.5 L0,5 Z" style="fill:var(--text-muted)"/>
    </marker>
  </defs>
  <rect x="65" y="8" width="170" height="30" rx="4" style="fill:rgba(156,84,118,0.10);stroke:var(--accent-purple)" stroke-width="1.5"/>
  <text x="150" y="27" text-anchor="middle" class="micro-svg-label">Paciente con PTTc en remisión</text>
  <line x1="150" y1="38" x2="150" y2="54" style="stroke:var(--text-muted)" stroke-width="1.5" marker-end="url(#cttpArrow)"/>

  <polygon points="150,56 210,86 150,116 90,86" style="fill:rgba(207,154,62,0.10);stroke:var(--accent-yellow)" stroke-width="1.5"/>
  <text x="150" y="82" text-anchor="middle" class="micro-svg-label">¿ADAMTS-13</text>
  <text x="150" y="92" text-anchor="middle" class="micro-svg-label">recombinante disponible?</text>

  <line x1="150" y1="116" x2="150" y2="132" style="stroke:var(--text-muted)" stroke-width="1.5" marker-end="url(#cttpArrow)"/>
  <text x="160" y="127" class="micro-svg-label" style="fill:var(--accent-green);">Sí</text>
  <rect x="60" y="134" width="180" height="48" rx="4" style="fill:rgba(144,160,106,0.10);stroke:var(--accent-green)" stroke-width="1.5"/>
  <text x="150" y="153" text-anchor="middle" class="micro-svg-label">Administrar ADAMTS-13 recombinante</text>
  <text x="150" y="172" text-anchor="middle" class="micro-svg-label" style="fill:var(--accent-green);font-weight:bold;">Recomendación 8b — fuerte</text>

  <line x1="90" y1="86" x2="55" y2="86" style="stroke:var(--text-muted)" stroke-width="1.5" marker-end="url(#cttpArrow)"/>
  <text x="70" y="79" text-anchor="middle" class="micro-svg-label" style="fill:var(--accent-red);">No</text>
  <line x1="30" y1="86" x2="30" y2="204" style="stroke:var(--text-muted)" stroke-width="1.5"/>
  <line x1="30" y1="204" x2="58" y2="204" style="stroke:var(--text-muted)" stroke-width="1.5" marker-end="url(#cttpArrow)"/>
  <rect x="60" y="192" width="180" height="48" rx="4" style="fill:rgba(184,92,62,0.10);stroke:var(--accent-red)" stroke-width="1.5"/>
  <text x="150" y="208" text-anchor="middle" class="micro-svg-label">Decisión compartida → si acepta,</text>
  <text x="150" y="219" text-anchor="middle" class="micro-svg-label">administrar infusión de plasma</text>
  <text x="150" y="232" text-anchor="middle" class="micro-svg-label" style="fill:var(--accent-red);font-weight:bold;">Recomendación 7 — condicional</text>
</svg>`;
