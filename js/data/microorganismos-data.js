// Datos estructurados para la sección "Microorganismos y Resistencias".
// Cada entrada alimenta una pantalla completa (ver microorganismos.js).
// Los diagramas de mecanismo son esquemas SVG originales (sin fotos reales:
// no hay acceso a internet para buscarlas). Las fotos clínicas/microbiológicas
// quedan como placeholder hasta que se suban imágenes de referencia.

const SVG_HIDROLISIS = `
<svg viewBox="0 0 300 120" class="micro-svg" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <marker id="arrowH" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto">
      <path d="M0,0 L6,3 L0,6 Z" style="fill:var(--text-muted)"/>
    </marker>
  </defs>
  <rect x="12" y="42" width="36" height="36" fill="none" style="stroke:var(--accent-blue)" stroke-width="3"/>
  <text x="30" y="95" text-anchor="middle" class="micro-svg-label">Anillo β-lactámico</text>
  <path d="M56 60 L104 60" style="stroke:var(--text-muted)" stroke-width="2" marker-end="url(#arrowH)"/>
  <ellipse cx="150" cy="60" rx="38" ry="30" style="fill:rgba(184,92,62,0.15);stroke:var(--accent-red)" stroke-width="2.5"/>
  <path d="M133 60 Q150 46 167 60" style="stroke:var(--accent-red)" stroke-width="2" fill="none"/>
  <text x="150" y="102" text-anchor="middle" class="micro-svg-label" style="fill:var(--accent-red);font-weight:bold">Enzima (carbapenemasa / BLEE / AmpC)</text>
  <path d="M196 60 L244 60" style="stroke:var(--text-muted)" stroke-width="2" marker-end="url(#arrowH)"/>
  <line x1="258" y1="44" x2="258" y2="60" style="stroke:var(--accent-yellow)" stroke-width="3"/>
  <line x1="274" y1="60" x2="274" y2="76" style="stroke:var(--accent-yellow)" stroke-width="3"/>
  <line x1="258" y1="76" x2="274" y2="44" style="stroke:var(--accent-yellow)" stroke-width="2" stroke-dasharray="2,3"/>
  <text x="266" y="95" text-anchor="middle" class="micro-svg-label">Anillo hidrolizado (inactivo)</text>
</svg>`;

const SVG_EFLUJO = `
<svg viewBox="0 0 300 130" class="micro-svg" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <marker id="arrowE" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto">
      <path d="M0,0 L6,3 L0,6 Z" style="fill:var(--accent-purple)"/>
    </marker>
  </defs>
  <line x1="10" y1="28" x2="290" y2="28" style="stroke:var(--accent-blue)" stroke-width="3"/>
  <line x1="10" y1="100" x2="290" y2="100" style="stroke:var(--accent-blue)" stroke-width="3"/>
  <text x="150" y="18" text-anchor="middle" class="micro-svg-label">Membrana externa</text>
  <text x="150" y="118" text-anchor="middle" class="micro-svg-label">Membrana interna</text>
  <rect x="45" y="23" width="14" height="10" style="fill:rgba(207,154,62,0.25);stroke:var(--accent-yellow)" stroke-width="2"/>
  <line x1="43" y1="21" x2="61" y2="35" style="stroke:var(--accent-red)" stroke-width="2"/>
  <text x="52" y="55" text-anchor="middle" class="micro-svg-label">Porina perdida/mutada</text>
  <path d="M195 100 L195 28 Q195 12 220 12 Q245 12 245 28 L245 50 Q245 62 225 62 L205 62" fill="none" style="stroke:var(--accent-purple)" stroke-width="2.5"/>
  <circle cx="210" cy="62" r="5" style="fill:var(--accent-purple)"/>
  <path d="M210 62 L232 62" style="stroke:var(--accent-purple)" stroke-width="2" marker-end="url(#arrowE)"/>
  <text x="220" y="80" text-anchor="middle" class="micro-svg-label" style="fill:var(--accent-purple)">Bomba de eflujo</text>
  <circle cx="140" cy="64" r="5" style="fill:var(--accent-green)"/>
  <text x="140" y="84" text-anchor="middle" class="micro-svg-label">Antibiótico</text>
</svg>`;

const SVG_DIANA = `
<svg viewBox="0 0 300 120" class="micro-svg" xmlns="http://www.w3.org/2000/svg">
  <polygon points="55,48 72,39 89,48 89,68 72,77 55,68" style="fill:rgba(144,160,106,0.18);stroke:var(--accent-green)" stroke-width="2"/>
  <polygon points="61,52 72,46 83,52 83,64 72,70 61,64" style="fill:var(--accent-green)"/>
  <text x="72" y="94" text-anchor="middle" class="micro-svg-label" style="fill:var(--accent-green)">Diana normal: el fármaco encaja</text>
  <text x="150" y="64" text-anchor="middle" style="font-size:15px;fill:var(--text-muted)">vs</text>
  <polygon points="218,44 240,44 251,60 240,76 218,76 207,60" style="fill:rgba(184,92,62,0.15);stroke:var(--accent-red)" stroke-width="2"/>
  <polygon points="223,52 233,47 243,52 243,64 233,69 223,64" style="fill:var(--accent-red)" opacity="0.55"/>
  <line x1="207" y1="44" x2="251" y2="76" style="stroke:var(--accent-red)" stroke-width="2"/>
  <text x="229" y="94" text-anchor="middle" class="micro-svg-label" style="fill:var(--accent-red)">Diana alterada: no actúa</text>
</svg>`;

function imgPlaceholder(texto) {
    return `<div class="micro-img-placeholder">🖼️<span>${texto}</span></div>`;
}

function imgFigura(src, alt, caption) {
    return `<div class="article-figure"><img src="${src}" alt="${alt}" loading="lazy"></div><p class="article-figure-caption">${caption}</p>`;
}

export const microorganismosData = {
    saureus: {
        nombre: 'Staphylococcus aureus',
        emoji: '🦠',
        categoria: 'Bacteria Gram+',
        tag: 'SARM',
        imagen: imgFigura('js/modules/neutropenia-febril/img/saureus-embolismos-septicos.jpg', 'TC de tórax con émbolos sépticos pulmonares múltiples (flechas) en bacteriemia por S. aureus', 'TC de tórax: nódulos pulmonares por embolismo séptico secundario a endocarditis por S. aureus. Fuente: caso clínico, Revista Sanitaria de Investigación.'),
        epidemiologia: 'Coloniza la nasofaringe hasta en un 30% de la población general. La bacteriemia por <em>S. aureus</em> es poco frecuente en neutropenia (0-3% de las bacteriemias), pero cuando ocurre, la tasa de resistencia a meticilina (SARM) varía mucho por país — en el sur de Europa (España incluida) suele superar el 20%.',
        mecanismo: 'El gen <em>mecA</em> (o <em>mecC</em>) codifica una proteína fijadora de penicilina alterada, la <strong>PBP2a</strong>, con muy baja afinidad por todos los betalactámicos (incluidos cefalosporinas y carbapenems). El resto de la maquinaria de síntesis de pared celular sigue funcionando con normalidad, por lo que la bacteria sobrevive sin problema en presencia del fármaco.',
        mecanismoSvg: SVG_DIANA,
        clinica: 'Fiebre y bacteriemia asociada a catéter, endocarditis, embolismos sépticos cutáneos, celulitis o abscesos en piel y partes blandas.',
        diagnostico: 'Hemocultivos de todas las luces del catéter + vena periférica. Si hay bacteriemia confirmada: ecocardiograma (ETT/ETE) y fondo de ojo para descartar endocarditis y émbolos sépticos.',
        tratamiento: 'SASM (sensible a meticilina): cloxacilina o cefazolina. SARM: vancomicina o daptomicina. Retirada del catéter siempre indicada. Tratamiento prolongado — mínimo 14 días tras el primer hemocultivo negativo, más si hay endocarditis o foco metastásico.',
        farmacosSi: ['Cloxacilina / Cefazolina (si SASM)', 'Vancomicina (SARM)', 'Daptomicina (SARM, salvo sospecha respiratoria)'],
        farmacosNo: ['Daptomicina si hay sospecha de neumonía (se inactiva por el surfactante pulmonar)', 'Betalactámicos habituales si SARM confirmado (PBP2a los inactiva)'],
        profilaxis: 'No hay profilaxis antibiótica sistémica específica. Cuidado estricto del catéter (manejo aséptico, sellado) es la medida más eficaz. En portadores nasales de alto riesgo puede valorarse descolonización con mupirocina según protocolo del centro.'
    },
    candida: {
        nombre: 'Candida spp.',
        emoji: '🍄',
        categoria: 'Levadura',
        tag: 'Resistencia a azoles',
        imagen: imgFigura('js/modules/neutropenia-febril/img/candida-endoftalmitis.jpg', 'Fondo de ojo con focos múltiples de coriorretinitis por Candida albicans', 'Fondo de ojo: focos múltiples de coriorretinitis por Candida albicans, con lesión coriorretiniana blanco-algodonosa (flecha).'),
        epidemiologia: '<em>C. albicans</em> sigue siendo la especie más frecuente, pero la incidencia de especies no-<em>albicans</em> (<em>C. glabrata</em>, <em>C. krusei</em>, <em>C. parapsilosis</em>) va en aumento, especialmente en pacientes con profilaxis previa con azoles.',
        mecanismo: 'Sobreexpresión de bombas de eflujo (genes <em>CDR1/CDR2</em>, <em>MDR1</em>) y mutaciones en <em>ERG11</em> (la enzima diana de los azoles, lanosterol 14-α-desmetilasa) reducen la afinidad del fármaco. <em>C. krusei</em> tiene resistencia intrínseca a fluconazol; <em>C. glabrata</em> la adquiere con facilidad tras exposición previa a azoles.',
        mecanismoSvg: SVG_DIANA,
        clinica: 'Fiebre persistente pese a antibioterapia de amplio espectro, candidemia, endoftalmitis, y —tras la recuperación de neutrófilos— candidiasis hepatoesplénica crónica.',
        diagnostico: 'Hemocultivos (sensibilidad limitada, ~50%), (1,3)-β-D-glucano, fondo de ojo, ecografía abdominal si se sospecha afectación hepatoesplénica.',
        tratamiento: 'Equinocandina como tratamiento empírico inicial. Desescalar a fluconazol solo si se confirma <em>C. albicans</em> o <em>C. parapsilosis</em> sensible y el paciente está estable. Retirada del catéter siempre indicada.',
        farmacosSi: ['Equinocandina (caspofungina, micafungina, anidulafungina)', 'Anfotericina B liposomal (resistencia a equinocandinas, endocarditis)', 'Fluconazol (solo tras confirmar sensibilidad)'],
        farmacosNo: ['Fluconazol empírico si hay profilaxis previa con azoles o sospecha de C. krusei/glabrata', 'Equinocandinas si hay afectación de SNC (mala penetración)'],
        profilaxis: 'Fluconazol o posaconazol en pacientes de muy alto riesgo (LMA en inducción, TPH alogénico), sabiendo que esto desplaza la epidemiología hacia especies menos sensibles a azoles.'
    },
    aspergillus: {
        nombre: 'Aspergillus spp.',
        emoji: '🍄',
        categoria: 'Hongo filamentoso',
        tag: 'Resistencia a azoles (ambiental)',
        imagen: imgFigura('js/modules/neutropenia-febril/img/aspergillus-signo-halo.jpg', 'TC de tórax con signo del halo: nódulo pulmonar rodeado de vidrio deslustrado', 'TC de tórax: signo del halo — nódulo sólido rodeado de un anillo de vidrio deslustrado. Shroff GS, et al. Clin Case Rep. 2014;2(5):225 (Fig. 1). CC BY-NC-ND 4.0.'),
        epidemiologia: 'Principal causa de aspergilosis pulmonar invasiva en neutropenia prolongada y tras TPH alogénico. Preocupa la resistencia a azoles adquirida en el ambiente (uso agrícola de fungicidas triazólicos), que ya se detecta en aislados clínicos en varios países europeos.',
        mecanismo: 'Mutaciones en el gen <em>cyp51A</em> alteran la diana de los azoles (la misma enzima que en Candida, lanosterol 14-α-desmetilasa), reduciendo la afinidad del fármaco por la enzima fúngica.',
        mecanismoSvg: SVG_DIANA,
        clinica: 'Fiebre con tos, dolor pleurítico u hemoptisis; angioinvasión con infarto tisular. El "signo del halo" (opacidad en vidrio deslustrado alrededor de un nódulo) en la TC de alta resolución es característico en fases precoces.',
        diagnostico: 'Galactomanano en suero y/o lavado broncoalveolar, TC de tórax de alta resolución (halo, semiluna aérea), cultivo o PCR de BAL.',
        tratamiento: 'Voriconazol o isavuconazol de primera elección. Anfotericina B liposomal si hay sospecha de resistencia a azoles, o como tratamiento empírico sin diagnóstico microbiológico aún confirmado.',
        farmacosSi: ['Voriconazol', 'Isavuconazol', 'Anfotericina B liposomal (empírico o resistencia a azoles)'],
        farmacosNo: ['Anfotericina B en infección por A. terreus (resistencia intrínseca)', 'Equinocandinas en monoterapia (solo actividad parcial/de rescate)'],
        profilaxis: 'Posaconazol en pacientes de alto riesgo: LMA en inducción/reinducción y enfermedad de injerto contra huésped tras TPH alogénico.'
    },
    mucorales: {
        nombre: 'Mucorales (Zygomycetes)',
        emoji: '🍄',
        categoria: 'Hongo filamentoso',
        tag: 'Resistencia intrínseca a azoles de espectro estrecho',
        imagen: imgPlaceholder('Necrosis rinocerebral/orbitaria — pendiente'),
        epidemiologia: 'Mucormicosis rinocerebral o pulmonar. Factor de riesgo característico: profilaxis o tratamiento previo con voriconazol (los Mucorales tienen resistencia intrínseca), además de diabetes descompensada y sobrecarga férrica.',
        mecanismo: 'Diana de los azoles de espectro estrecho (voriconazol) con muy baja afinidad de forma intrínseca — no es una resistencia adquirida por mutación, sino una característica basal del grupo. También son intrínsecamente resistentes a equinocandinas.',
        mecanismoSvg: SVG_DIANA,
        clinica: 'Necrosis tisular fulminante de instauración rápida: celulitis orbitaria o rinocerebral, escara necrótica palatina o nasal, lesiones cutáneas necróticas si la puerta de entrada es cutánea.',
        diagnostico: 'TC/RM urgente, biopsia con histopatología (hifas anchas, no septadas, ramificación en ángulo recto) y cultivo.',
        tratamiento: 'Anfotericina B liposomal a dosis altas (5-10 mg/kg/día) junto con desbridamiento quirúrgico urgente — el retraso quirúrgico empeora el pronóstico. Isavuconazol o posaconazol como alternativa o consolidación tras la fase aguda.',
        farmacosSi: ['Anfotericina B liposomal (dosis altas)', 'Isavuconazol', 'Posaconazol'],
        farmacosNo: ['Voriconazol (resistencia intrínseca — y su uso previo es factor de riesgo para la infección)', 'Equinocandinas (resistencia intrínseca)'],
        profilaxis: 'No existe profilaxis específica estandarizada. Evitar el voriconazol como único agente profiláctico en pacientes de muy alto riesgo de mucormicosis (p. ej., diabetes mal controlada + neutropenia prolongada).'
    },
    fusarium: {
        nombre: 'Fusarium spp.',
        emoji: '🍄',
        categoria: 'Hongo filamentoso',
        tag: 'Resistencia intrínseca a equinocandinas',
        imagen: imgFigura('js/modules/neutropenia-febril/img/fusarium-nodulo-cutaneo.jpg', 'Lesión nodular axilar por fusariosis diseminada', 'Lesión nodular cutánea axilar en fusariosis diseminada. Ecthyma Gangrenosum-like Lesions in a Febrile Neutropenic Patient with Simultaneous Pseudomonas Sepsis and Disseminated Fusariosis, Turk J Haematol (Fig. 2). Acceso abierto CC BY.'),
        epidemiologia: 'Hialohifomicosis en neutropenia profunda y prolongada. A diferencia de Aspergillus, positiviza los hemocultivos con relativa frecuencia, lo que facilita el diagnóstico.',
        mecanismo: 'La diana de las equinocandinas (el complejo enzimático FKS, 1,3-β-D-glucano sintasa) es intrínsecamente poco sensible al fármaco en este género, por lo que las equinocandinas no son eficaces incluso a dosis altas.',
        mecanismoSvg: SVG_DIANA,
        clinica: 'Fiebre con lesiones cutáneas nodulares o necróticas múltiples y diseminadas, sinusitis, neumonía. La diseminación cutánea es mucho más frecuente que en aspergilosis.',
        diagnostico: 'Hemocultivos (sensibilidad relativamente alta para un hongo filamentoso), biopsia cutánea con cultivo. El galactomanano puede dar falsos positivos por reactividad cruzada.',
        tratamiento: 'Anfotericina B liposomal o voriconazol; combinación de ambos en casos graves. La recuperación de neutrófilos es el factor pronóstico más determinante.',
        farmacosSi: ['Anfotericina B liposomal', 'Voriconazol'],
        farmacosNo: ['Equinocandinas en monoterapia (resistencia intrínseca por la diana FKS)'],
        profilaxis: 'El posaconazol reduce la incidencia en pacientes de alto riesgo, pero no elimina el riesgo por completo.'
    },
    pseudomonas: {
        nombre: 'Pseudomonas aeruginosa',
        emoji: '🦠',
        categoria: 'Bacilo Gram- no fermentador',
        tag: 'XDR / difícil de tratar (CRPA)',
        imagen: imgFigura('js/modules/neutropenia-febril/img/pseudomonas-ectima-gangrenoso.jpg', 'Ectima gangrenoso: evolución de mácula eritematosa a úlcera necrótica con escara negra', 'Ectima gangrenoso — evolución típica: mácula eritematosa (A) → bulla hemorrágica (B) → úlcera con escara negra central (C). Vaiman M, et al. Ecthyma gangrenosum: a report of eight cases. An Bras Dermatol. CC BY-NC.'),
        epidemiologia: 'Causa grave de bacteriemia y neumonía en neutropenia, con mortalidad elevada especialmente en shock séptico. La prevalencia de cepas multirresistentes (20-37% XDR según ECIL-10) varía mucho por centro y país.',
        mecanismo: 'Combina varios mecanismos: bombas de eflujo (MexAB-OprM y similares), pérdida/mutación de la porina OprD (puerta de entrada de carbapenems) y producción de betalactamasas (incluidas MBL en algunas cepas).',
        mecanismoSvg: SVG_EFLUJO,
        clinica: 'Sepsis o shock séptico, neumonía necrotizante, ectima gangrenoso (lesión cutánea necrótica con halo eritematoso, muy sugestiva aunque infrecuente), bacteriemia de origen digestivo o de catéter.',
        diagnostico: 'Hemocultivos, cultivo del foco sospechoso, antibiograma con determinación de CMI a betalactámicos de rescate (ceftolozano-tazobactam, ceftazidima-avibactam) cuando hay resistencia a los de primera línea.',
        tratamiento: 'Ver <strong>Matriz de Combate MDR</strong> para el algoritmo completo por CMI y gravedad. Nunca aminoglucósidos en monoterapia. Difícil de tratar: ceftolozano-tazobactam (9 g/día), ceftazidima-avibactam, imipenem-relebactam o cefiderocol.',
        farmacosSi: ['Piperacilina-tazobactam, cefepime (sensible)', 'Ceftolozano-tazobactam (dosis alta, 9 g/día)', 'Ceftazidima-avibactam', 'Imipenem-cilastatina-relebactam', 'Cefiderocol'],
        farmacosNo: ['Aminoglucósido en monoterapia', 'Tigeciclina (resistencia natural)'],
        profilaxis: 'No hay profilaxis antibiótica específica. Vigilancia epidemiológica local y cribado de colonización en centros de alta prevalencia guían la elección empírica (ver Tratamiento Empírico).'
    },
    cre: {
        nombre: 'Enterobacterias CRE (KPC / OXA-48 / MBL)',
        emoji: '🦠',
        categoria: 'Bacilo Gram- fermentador',
        tag: 'Carbapenemasas (CPE)',
        imagen: imgPlaceholder('Foto de colonia/Gram — pendiente'),
        epidemiologia: 'La prevalencia de carbapenemasas en Enterobacterales varía mucho por región; en España predominan OXA-48 y KPC. Se asocian a estancias prolongadas, presión antibiótica previa y colonización intestinal previa (cribado rectal).',
        mecanismo: 'Producción de carbapenemasas — enzimas que hidrolizan el anillo β-lactámico de prácticamente todos los betalactámicos, incluidos los carbapenems. Según la clase de Ambler cambia qué inhibidores las bloquean: avibactam/vaborbactam/relebactam inhiben KPC (clase A); solo avibactam inhibe OXA-48 (clase D); ninguno de los tres inhibe las metalo-betalactamasas MBL — NDM/VIM/IMP (clase B), que requieren aztreonam.',
        mecanismoSvg: SVG_HIDROLISIS,
        clinica: 'Bacteriemia, infección intraabdominal o urinaria complicada, neumonía — con mayor mortalidad que las mismas infecciones por cepas sensibles, sobre todo si el tratamiento adecuado se retrasa.',
        diagnostico: 'Antibiograma con confirmación fenotípica o molecular del tipo de carbapenemasa (PCR de genes <em>bla</em><sub>KPC</sub>, <em>bla</em><sub>OXA-48</sub>, <em>bla</em><sub>NDM</sub>/<sub>VIM</sub>/<sub>IMP</sub>) — imprescindible para elegir el fármaco correcto.',
        tratamiento: 'Ver <strong>Matriz de Combate MDR</strong> (selector "Tipo de carbapenemasa"). KPC/OXA-48: ceftazidima-avibactam. MBL: ceftazidima-avibactam + aztreonam (el avibactam no inhibe las MBL). Combinación con un no-betalactámico solo en críticos, foco no controlado o CMI cerca del punto de corte.',
        farmacosSi: ['Ceftazidima-avibactam (KPC/OXA-48)', 'Ceftazidima-avibactam + aztreonam (MBL)', 'Meropenem-vaborbactam (solo KPC)', 'Imipenem-cilastatina-relebactam (solo KPC)', 'Cefiderocol (alternativa, cualquier tipo)'],
        farmacosNo: ['Carbapenems en monoterapia (inactivados por la propia carbapenemasa)', 'Ceftazidima-avibactam en monoterapia si es MBL (el avibactam no la inhibe; falla sin aztreonam)'],
        profilaxis: 'Cribado de colonización rectal semanal en pacientes de alto riesgo (según prevalencia local) para anticipar la cobertura empírica si aparece fiebre. No existe profilaxis antibiótica específica.'
    },
    acineto: {
        nombre: 'Acinetobacter baumannii',
        emoji: '🦠',
        categoria: 'Bacilo Gram- no fermentador',
        tag: 'XDR / resistente a carbapenems (CRAB)',
        imagen: imgPlaceholder('Foto de colonia/Gram — pendiente'),
        epidemiologia: 'Patógeno oportunista típico de UCI, asociado a brotes nosocomiales y a dispositivos (vía aérea, catéteres). La resistencia a carbapenems (CRAB) es ya la norma, no la excepción, en muchos centros.',
        mecanismo: 'Combina múltiples mecanismos: betalactamasas tipo OXA con actividad carbapenemasa, pérdida de porinas y bombas de eflujo — de ahí que el sulbactam a dosis altas (que inhibe directamente las OXA-carbapenemasas de Acinetobacter) sea la base del tratamiento.',
        mecanismoSvg: SVG_EFLUJO,
        clinica: 'Neumonía asociada a ventilación mecánica, bacteriemia relacionada con catéter, infección de piel y partes blandas en heridas complejas.',
        diagnostico: 'Cultivo del foco (respiratorio, sangre, herida) con antibiograma que incluya sulbactam y colistina, dado que los paneles automatizados no siempre las informan bien.',
        tratamiento: 'Ver <strong>Matriz de Combate MDR</strong>. Preferido: sulbactam-durlobactam + imipenem dosis alta (durlobactam no aprobado aún por la EMA). Si no disponible: sulbactam altas dosis (≥9 g/día) + colistina. Terapia combinada de entrada en inmunocomprometidos hasta tener antibiograma.',
        farmacosSi: ['Sulbactam altas dosis (≥9 g/día)', 'Sulbactam-durlobactam + imipenem (si disponible)', 'Colistina (en combinación)', 'Cefiderocol / tigeciclina / minociclina / fosfomicina (alternativas en combinación)'],
        farmacosNo: ['Tigeciclina en monoterapia para bacteriemia (concentración plasmática insuficiente)', 'Carbapenems en monoterapia si CRAB confirmado'],
        profilaxis: 'No hay profilaxis antibiótica específica. Medidas de control de brote (aislamiento de contacto, limpieza ambiental) son clave por su capacidad de persistir en superficies inertes.'
    },
    steno: {
        nombre: 'Stenotrophomonas maltophilia',
        emoji: '🦠',
        categoria: 'Bacilo Gram- no fermentador',
        tag: 'Resistencia intrínseca a carbapenems',
        imagen: imgPlaceholder('Foto de colonia/Gram — pendiente'),
        epidemiologia: 'Menos frecuente que Pseudomonas o Acinetobacter, pero con mortalidad que supera el 50% en receptores de TPH, en parte porque el uso previo de carbapenems selecciona directamente su crecimiento.',
        mecanismo: 'Produce de forma intrínseca (no adquirida) dos metalo-betalactamasas cromosómicas, L1 y L2, que hidrolizan los carbapenems — por eso nunca es sensible a ellos, a diferencia de otros bacilos Gram-negativos.',
        mecanismoSvg: SVG_HIDROLISIS,
        clinica: 'Neumonía (con frecuencia en pacientes con dispositivos de vía aérea), bacteriemia relacionada con catéter, infección de piel y partes blandas.',
        diagnostico: 'Cultivo con antibiograma específico para cotrimoxazol, levofloxacino y tetraciclinas — el laboratorio debe saber que se sospecha esta especie, ya que su identificación y antibiograma pueden requerir métodos concretos.',
        tratamiento: 'Ver <strong>Matriz de Combate MDR</strong>. Cotrimoxazol EN COMBINACIÓN con levofloxacino (si sensible, sobre todo en neumonía), tetraciclina en dosis altas (minociclina/tigeciclina) o cefiderocol — nunca monoterapia dada la mortalidad tan elevada.',
        farmacosSi: ['Cotrimoxazol (TMP 8-12 mg/kg/día) + levofloxacino o tetraciclina en dosis altas', 'Ceftazidima-avibactam + aztreonam (si cotrimoxazol no es viable)', 'Cefiderocol (en combinación)'],
        farmacosNo: ['Cualquier carbapenem (resistencia intrínseca por L1/L2)', 'Cotrimoxazol en monoterapia', 'Levofloxacino si el paciente ya recibía profilaxis con quinolona (riesgo de resistencia)'],
        profilaxis: 'No existe profilaxis específica. Limitar el uso innecesario de carbapenems reduce la presión selectiva que favorece su crecimiento.'
    }
};

export const microorganismosOrden = ['saureus', 'candida', 'aspergillus', 'mucorales', 'fusarium', 'pseudomonas', 'cre', 'acineto', 'steno'];
