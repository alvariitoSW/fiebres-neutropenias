// Datos puros para el módulo "Síndrome de Lisis Tumoral (SLT)".
// Fuente: Chan YLT, El-Sharkawi D, Shah P, Chanouzas D, O'Connor D, Marks SD,
// Jones G, on behalf of the BSH Committee. British Society for Haematology
// updated guidelines for the diagnosis and management of tumour lysis
// syndrome in adults and children with haematological malignancies: A focus
// on patient safety. Br J Haematol. 2025;207(4):1248-1258.
// Criterios diagnósticos originales: Cairo MS, Bishop M. Tumour lysis
// syndrome: new therapeutic strategies and classification. Br J Haematol.
// 2004;127:3-11.

// Criterios de laboratorio (≥2 de 4) y clínicos (≥1, requiere SLT de
// laboratorio) de Cairo-Bishop, en la ventana de 3 días antes a 7 días
// después de iniciar el tratamiento.
export const sltLabCriteria = [
    { id: 'acidoUrico', label: 'Ácido úrico ≥476 μmol/L, o aumento del 25% sobre el basal' },
    { id: 'potasio', label: 'Potasio ≥6,0 mmol/L, o aumento del 25% sobre el basal' },
    { id: 'fosforo', label: 'Fósforo ≥2,1 mmol/L (niños) / ≥1,45 mmol/L (adultos), o aumento del 25% sobre el basal' },
    { id: 'calcio', label: 'Calcio ≤1,75 mmol/L, o descenso del 25% sobre el basal' },
];
export const sltLabCorte = 2;

export const sltClinicalCriteria = [
    { id: 'creatinina', label: 'Creatinina ≥1,5× límite superior de la normalidad (edad >12 años, o ajustada a la edad)' },
    { id: 'arritmia', label: 'Arritmia cardiaca' },
    { id: 'muerteSubita', label: 'Muerte súbita' },
    { id: 'convulsion', label: 'Convulsión' },
];
export const sltClinicalCorte = 1;

// Tabla 2 del artículo (aplanada): estratificación de riesgo de SLT por
// enfermedad, estadio y factores modificadores del tratamiento.
export const sltRiesgoOpciones = [
    { value: 'mieloma-bajo', label: 'Mieloma — alquilantes / IMiD / IP / anticuerpo', riesgo: 'Riesgo bajo', color: 'var(--accent-green)' },
    { value: 'mieloma-cart', label: 'Mieloma — CAR-T o nuevas terapias (incl. biespecíficos)', riesgo: 'Riesgo bajo-intermedio', color: 'var(--accent-yellow)' },
    { value: 'lmc', label: 'Leucemia mieloide crónica (fase crónica)', riesgo: 'Riesgo bajo', color: 'var(--accent-green)' },
    { value: 'llc-btk', label: 'LLC — inhibidores de BTK, terapias alquilantes', riesgo: 'Riesgo bajo', color: 'var(--accent-green)' },
    { value: 'llc-dirigida', label: 'LLC — terapia dirigida/biológica (p. ej. venetoclax)', riesgo: 'Riesgo bajo-alto', color: 'var(--accent-red)' },
    { value: 'lma-bajo', label: 'LMA — leucocitos <100×10⁹/L', riesgo: 'Riesgo intermedio', color: 'var(--accent-yellow)' },
    { value: 'lma-alto', label: 'LMA — leucocitos ≥100×10⁹/L', riesgo: 'Riesgo alto', color: 'var(--accent-red)' },
    { value: 'lla-bajo', label: 'LLA — leucocitos <100×10⁹/L', riesgo: 'Riesgo intermedio', color: 'var(--accent-yellow)' },
    { value: 'lla-alto', label: 'LLA — leucocitos ≥100×10⁹/L y/o enfermedad bulky', riesgo: 'Riesgo alto', color: 'var(--accent-red)' },
    { value: 'linfoma-bajo-grado', label: 'Linfoma de bajo grado (Hodgkin/LLP/folicular/zona marginal/MALT/manto no-blastoide/cutáneo T)', riesgo: 'Riesgo bajo', color: 'var(--accent-green)' },
    { value: 'linfoma-alto-precoz-norm', label: 'Linfoma de alto grado — estadio precoz (I/II), LDH normal y no bulky', riesgo: 'Riesgo bajo', color: 'var(--accent-green)' },
    { value: 'linfoma-alto-precoz-alt', label: 'Linfoma de alto grado — estadio precoz, LDH > LSN y/o bulky', riesgo: 'Riesgo intermedio', color: 'var(--accent-yellow)' },
    { value: 'linfoma-alto-avanzado-norm', label: 'Linfoma de alto grado — estadio avanzado (III/IV), LDH normal y no bulky', riesgo: 'Riesgo intermedio', color: 'var(--accent-yellow)' },
    { value: 'linfoma-alto-avanzado-alt', label: 'Linfoma de alto grado — estadio avanzado, LDH ≥2× LSN y/o bulky', riesgo: 'Riesgo alto', color: 'var(--accent-red)' },
    { value: 'burkitt-precoz-bajo', label: 'Burkitt / linfoblástico — estadio precoz, LDH <2× LSN', riesgo: 'Riesgo intermedio', color: 'var(--accent-yellow)' },
    { value: 'burkitt-precoz-alto', label: 'Burkitt / linfoblástico — estadio precoz, LDH ≥2× LSN y/o bulky', riesgo: 'Riesgo alto', color: 'var(--accent-red)' },
    { value: 'burkitt-avanzado', label: 'Burkitt / linfoblástico — estadio avanzado', riesgo: 'Riesgo alto', color: 'var(--accent-red)' },
];

// Tabla 3 del artículo: fármacos uricosúricos usados en la profilaxis del SLT.
export const sltFarmacosData = [
    {
        farmaco: 'Alopurinol',
        indicacion: 'SLT de riesgo bajo-intermedio',
        dosisAdulto: '300 mg/24h VO',
        dosisPediatrica: '100 mg/m² /8h',
        info: 'Reacción cutánea (vigilar). Reducir dosis en insuficiencia renal. Interacciona con diuréticos.',
    },
    {
        farmaco: 'Febuxostat',
        indicacion: 'SLT de riesgo bajo-intermedio, si no puede recibir alopurinol',
        dosisAdulto: '120 mg/24h VO',
        dosisPediatrica: 'No recomendado en niños',
        info: 'Reacciones de hipersensibilidad. Precaución si cardiopatía cardiovascular mayor preexistente.',
    },
    {
        farmaco: 'Rasburicasa',
        indicacion: 'SLT de riesgo alto, o intermedio si no puede recibir alopurinol/febuxostat',
        dosisAdulto: '0,2 mg/kg/24h (dosis con ficha técnica); una dosis fija única (3 mg) puede ser suficiente para profilaxis',
        dosisPediatrica: '0,2 mg/kg/24h',
        info: 'Falsea el ácido úrico ex vivo (mantener la muestra en hielo). Evitar en déficit de G6PDH: riesgo de anemia hemolítica y metahemoglobinemia.',
    },
];

// Diagrama SVG original: catabolismo de purinas y sitios de acción de los
// fármacos uricosúricos (recreación de la Figura 1 del artículo).
export const sltSvgPurinas = `
<svg viewBox="0 0 300 320" class="micro-svg" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <marker id="sltArrow" markerWidth="7" markerHeight="7" refX="5" refY="2.5" orient="auto">
      <path d="M0,0 L5,2.5 L0,5 Z" style="fill:var(--text-muted)"/>
    </marker>
  </defs>
  <rect x="45" y="6" width="150" height="30" rx="4" style="fill:rgba(0,0,0,0.2);stroke:var(--text-muted)" stroke-width="1.5"/>
  <text x="120" y="19" text-anchor="middle" class="micro-svg-label">Rotura celular → liberación</text>
  <text x="120" y="30" text-anchor="middle" class="micro-svg-label">de ácidos nucleicos</text>
  <line x1="120" y1="36" x2="120" y2="52" style="stroke:var(--text-muted)" stroke-width="1.5" marker-end="url(#sltArrow)"/>
  <text x="120" y="62" text-anchor="middle" class="micro-svg-label">Catabolismo excesivo de purinas</text>
  <line x1="120" y1="66" x2="120" y2="82" style="stroke:var(--text-muted)" stroke-width="1.5" marker-end="url(#sltArrow)"/>

  <rect x="55" y="84" width="130" height="26" rx="3" style="fill:rgba(156,84,118,0.10);stroke:var(--accent-purple)" stroke-width="1.5"/>
  <text x="120" y="101" text-anchor="middle" class="micro-svg-label" style="font-weight:bold;">HIPOXANTINA</text>
  <line x1="120" y1="110" x2="120" y2="130" style="stroke:var(--text-muted)" stroke-width="1.5" marker-end="url(#sltArrow)"/>
  <text x="128" y="123" class="micro-svg-label" style="font-style:italic;">Xantina oxidasa</text>

  <rect x="55" y="132" width="130" height="26" rx="3" style="fill:rgba(156,84,118,0.10);stroke:var(--accent-purple)" stroke-width="1.5"/>
  <text x="120" y="149" text-anchor="middle" class="micro-svg-label" style="font-weight:bold;">XANTINA</text>
  <line x1="120" y1="158" x2="120" y2="178" style="stroke:var(--text-muted)" stroke-width="1.5" marker-end="url(#sltArrow)"/>
  <text x="128" y="171" class="micro-svg-label" style="font-style:italic;">Xantina oxidasa</text>

  <path d="M188 97 L215 97 L215 145 L188 145" style="fill:none;stroke:var(--accent-blue)" stroke-width="1.5"/>
  <text x="219" y="102" class="micro-svg-label" style="fill:var(--accent-blue);font-weight:bold;">Sitio de acción:</text>
  <text x="219" y="112" class="micro-svg-label" style="fill:var(--accent-blue);font-weight:bold;">alopurinol y</text>
  <text x="219" y="122" class="micro-svg-label" style="fill:var(--accent-blue);font-weight:bold;">febuxostat</text>

  <rect x="55" y="180" width="130" height="26" rx="3" style="fill:rgba(207,154,62,0.10);stroke:var(--accent-yellow)" stroke-width="1.5"/>
  <text x="120" y="197" text-anchor="middle" class="micro-svg-label" style="font-weight:bold;">ÁCIDO ÚRICO</text>
  <line x1="120" y1="206" x2="120" y2="226" style="stroke:var(--text-muted)" stroke-width="1.5" marker-end="url(#sltArrow)"/>
  <text x="128" y="219" class="micro-svg-label" style="font-style:italic;">Urato oxidasa</text>

  <path d="M188 193 L215 193" style="fill:none;stroke:var(--accent-red)" stroke-width="1.5"/>
  <text x="219" y="188" class="micro-svg-label" style="fill:var(--accent-red);font-weight:bold;">Sitio de acción:</text>
  <text x="219" y="198" class="micro-svg-label" style="fill:var(--accent-red);font-weight:bold;">rasburicasa</text>

  <rect x="55" y="228" width="130" height="26" rx="3" style="fill:rgba(144,160,106,0.10);stroke:var(--accent-green)" stroke-width="1.5"/>
  <text x="120" y="245" text-anchor="middle" class="micro-svg-label" style="font-weight:bold;">ALANTOÍNA</text>
  <line x1="120" y1="254" x2="120" y2="270" style="stroke:var(--text-muted)" stroke-width="1.5" marker-end="url(#sltArrow)"/>
  <text x="120" y="284" text-anchor="middle" class="micro-svg-label" style="fill:var(--accent-green);">Excretada en la orina</text>
  <text x="150" y="304" text-anchor="middle" class="micro-svg-label" style="font-size:7px;">(muy soluble — a diferencia del ácido úrico)</text>
</svg>`;

// Diagrama SVG original: algoritmo de manejo del SLT por riesgo, desde la
// estratificación inicial hasta la escalada a terapia de reemplazo renal.
export const sltSvgAlgoritmo = `
<svg viewBox="0 0 300 400" class="micro-svg" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <marker id="sltAlgArrow" markerWidth="7" markerHeight="7" refX="5" refY="2.5" orient="auto">
      <path d="M0,0 L5,2.5 L0,5 Z" style="fill:var(--text-muted)"/>
    </marker>
  </defs>

  <rect x="45" y="6" width="210" height="28" rx="4" style="fill:rgba(0,0,0,0.2);stroke:var(--text-muted)" stroke-width="1.5"/>
  <text x="150" y="24" text-anchor="middle" class="micro-svg-label">Nueva línea de tratamiento oncohematológico</text>
  <line x1="150" y1="34" x2="150" y2="50" style="stroke:var(--text-muted)" stroke-width="1.5" marker-end="url(#sltAlgArrow)"/>

  <rect x="30" y="52" width="240" height="30" rx="4" style="fill:rgba(156,84,118,0.10);stroke:var(--accent-purple)" stroke-width="1.5"/>
  <text x="150" y="66" text-anchor="middle" class="micro-svg-label">Estratificar riesgo de SLT (histología,</text>
  <text x="150" y="77" text-anchor="middle" class="micro-svg-label">carga tumoral, paciente, fármaco)</text>
  <line x1="150" y1="82" x2="150" y2="98" style="stroke:var(--text-muted)" stroke-width="1.5" marker-end="url(#sltAlgArrow)"/>

  <rect x="20" y="100" width="260" height="30" rx="4" style="fill:rgba(0,0,0,0.2);stroke:var(--text-muted)" stroke-width="1.5"/>
  <text x="150" y="114" text-anchor="middle" class="micro-svg-label">Profilaxis según riesgo: hidratación ±</text>
  <text x="150" y="125" text-anchor="middle" class="micro-svg-label">uricosúrico + educación del paciente</text>
  <line x1="150" y1="130" x2="150" y2="146" style="stroke:var(--text-muted)" stroke-width="1.5" marker-end="url(#sltAlgArrow)"/>

  <rect x="20" y="148" width="260" height="30" rx="4" style="fill:rgba(0,0,0,0.2);stroke:var(--text-muted)" stroke-width="1.5"/>
  <text x="150" y="162" text-anchor="middle" class="micro-svg-label">Monitorización analítica seriada (K,</text>
  <text x="150" y="173" text-anchor="middle" class="micro-svg-label">ác. úrico, fosfato, calcio, creatinina)</text>
  <line x1="150" y1="178" x2="150" y2="194" style="stroke:var(--text-muted)" stroke-width="1.5" marker-end="url(#sltAlgArrow)"/>

  <polygon points="150,196 220,222 150,248 80,222" style="fill:rgba(207,154,62,0.10);stroke:var(--accent-yellow)" stroke-width="1.5"/>
  <text x="150" y="218" text-anchor="middle" class="micro-svg-label">¿Criterios de SLT</text>
  <text x="150" y="228" text-anchor="middle" class="micro-svg-label">(Cairo-Bishop)?</text>

  <line x1="80" y1="222" x2="45" y2="222" style="stroke:var(--text-muted)" stroke-width="1.5" marker-end="url(#sltAlgArrow)"/>
  <text x="62" y="215" text-anchor="middle" class="micro-svg-label" style="fill:var(--accent-green);">No</text>
  <rect x="2" y="207" width="43" height="30" rx="4" style="fill:rgba(144,160,106,0.10);stroke:var(--accent-green)" stroke-width="1.5"/>
  <text x="23" y="219" text-anchor="middle" class="micro-svg-label">Mantener</text>
  <text x="23" y="229" text-anchor="middle" class="micro-svg-label">vigilancia</text>

  <line x1="150" y1="248" x2="150" y2="264" style="stroke:var(--text-muted)" stroke-width="1.5" marker-end="url(#sltAlgArrow)"/>
  <text x="160" y="259" class="micro-svg-label" style="fill:var(--accent-red);">Sí</text>

  <rect x="20" y="266" width="260" height="34" rx="4" style="fill:rgba(184,92,62,0.10);stroke:var(--accent-red)" stroke-width="1.5"/>
  <text x="150" y="280" text-anchor="middle" class="micro-svg-label" style="fill:var(--accent-red);font-weight:bold;">SLT establecido: hidratación IV vigorosa +</text>
  <text x="150" y="291" text-anchor="middle" class="micro-svg-label">rasburicasa + tratar alteraciones electrolíticas</text>
  <line x1="150" y1="300" x2="150" y2="316" style="stroke:var(--text-muted)" stroke-width="1.5" marker-end="url(#sltAlgArrow)"/>

  <polygon points="150,318 225,344 150,370 75,344" style="fill:rgba(207,154,62,0.10);stroke:var(--accent-yellow)" stroke-width="1.5"/>
  <text x="150" y="340" text-anchor="middle" class="micro-svg-label">¿Refractario o FRA</text>
  <text x="150" y="350" text-anchor="middle" class="micro-svg-label">grave?</text>

  <line x1="75" y1="344" x2="45" y2="344" style="stroke:var(--text-muted)" stroke-width="1.5" marker-end="url(#sltAlgArrow)"/>
  <text x="60" y="337" text-anchor="middle" class="micro-svg-label" style="fill:var(--accent-green);">No</text>
  <rect x="2" y="329" width="43" height="30" rx="4" style="fill:rgba(144,160,106,0.10);stroke:var(--accent-green)" stroke-width="1.5"/>
  <text x="23" y="341" text-anchor="middle" class="micro-svg-label">Continuar</text>
  <text x="23" y="351" text-anchor="middle" class="micro-svg-label">tto. médico</text>

  <line x1="225" y1="344" x2="255" y2="344" style="stroke:var(--text-muted)" stroke-width="1.5" marker-end="url(#sltAlgArrow)"/>
  <text x="240" y="337" text-anchor="middle" class="micro-svg-label" style="fill:var(--accent-red);">Sí</text>
  <rect x="257" y="322" width="41" height="44" rx="4" style="fill:rgba(184,92,62,0.12);stroke:var(--accent-red)" stroke-width="1.5"/>
  <text x="277" y="338" text-anchor="middle" class="micro-svg-label">Terapia de</text>
  <text x="277" y="348" text-anchor="middle" class="micro-svg-label">reemplazo</text>
  <text x="277" y="358" text-anchor="middle" class="micro-svg-label">renal</text>
</svg>`;
