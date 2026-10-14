# Historial · Neumología: Merino Neumología

> Texto movido tal cual desde el antiguo `CLAUDE.md` (octubre 2026). Es la historia de cómo se construyó
> esta parte: decisiones, fuentes, auditorías y verificaciones. Las reglas vigentes están en `CLAUDE.md`.

### Neumología

Sexta especialidad del menú raíz (`#btn-neumologia`, junto a Hematología,
Nefrología, UCI/Papers Tuiter, Fisiopatología UCI y Cardiología). Mismo
patrón de dos niveles que Cardiología: un **submenú de guías**
(`#neumologia-menu-view`/`js/modules/neumologia/neumologia-menu.html`, con
`.btn-volver-especialidades`) del que cuelga un botón por guía, y la
**vista propia de cada guía** con su propio cuaderno de campo. El switcher
`neumoLevel` vive en `js/modules/neumologia/index.js`
(`createViewSwitcher({ menu, merinoNeumologia })`) — mismo motivo que el
resto de especialidades con submenú interno: la vista raíz
`#neumologia-view` (registrada en el `topLevel` de `home/index.js`) es solo
el contenedor exterior. Al volver a "Neumología" desde Especialidades,
`neumologia.init()` devuelve `{ volverAlMenu, irAFicha }`, inyectado
perezosamente en `home/index.js` (`onNeumologiaListo`, mismo patrón que
`onCardiologiaListo`) para dejar siempre el submenú de guías como pantalla
de entrada. Añadir una guía nueva en el futuro: 1) botón nuevo en
`neumologia-menu.html`, 2) su propio `<guia>.html` con
`.btn-volver-neumo-menu`, 3) registrarlo en `index.html` dentro de
`#neumologia-view` y en el switcher `neumoLevel` de `neumologia/index.js`.

- **Primera guía: "Merino Neumología"**
  (`js/modules/neumologia/merino-neumologia.html`). Fuente: Marino PL, *The ICU Book* (5.ª ed.), Cap. 22-26 (Acute Pulmonary
  Embolism, Asthma and COPD in the ICU, Acute Respiratory Distress
  Syndrome, Oxygen Inhalation, Noninvasive Ventilation — 90 páginas) — el
  mismo libro que Merino HEMATO (Cap. 12-13) y Merino Cardiología (Cap.
  14-21), pero un archivo distinto (`docs/marino-2024-respiratory-management-caps22-26.pdf`,
  sin offset: página del PDF = página impresa del capítulo, verificado con
  `pdftotext -f N -l N` en el inicio de cada capítulo — Cap22→pág.1,
  Cap23→pág.15, Cap24→pág.32, Cap25→pág.56, Cap26→pág.76). El usuario avisó
  explícitamente que es solo **"la primera parte"** — hay más contenido de
  Marino pendiente de envío en el futuro, que ampliará este mismo módulo
  (mismo patrón ya visto en Merino Cardiología Parte 1/Parte 2).
  - **Cuaderno de campo de 13 fichas** (`#merino-neumo-corkboard`/
    `#panel-merino-neumo-tabs`, mismo `core/corkboard.js` de siempre),
    correspondencia capítulo→bloque de fichas según su volumen real (mismo
    criterio ya establecido en el resto del proyecto): **Cap. 22 "Acute
    Pulmonary Embolism"** → Ficha I (infra/sobrediagnóstico simultáneo de
    la EP, Tabla 22.1 de valor predictivo de hallazgos clínicos —ninguno
    supera el 50% de VPP—, dímero D con VPP 27%/VPN 92%, Tabla 22.2 de
    estudios de imagen —ecografía venosa, angio-TC, gammagrafía V/Q,
    ecocardiografía—, real Fig. 22.1) y Ficha II (estratificación de riesgo
    en 3 niveles, Tabla 22.3 de estrategias antitrombóticas, calculadora de
    peso ajustado para heparina por peso en obesidad mórbida, trombólisis,
    real Fig. 22.2 de trombectomía por catéter, filtros de vena cava);
    **Cap. 23 "Asthma and COPD in the ICU"** → Ficha III (monitorización
    por PEFR con calculador de gravedad, PEEP intrínseca, dispositivos de
    aerosol —nebulizador vs. MDI, con la discrepancia dosis-respuesta sin
    explicación—, Tabla 23.1), Ficha IV (algo-flow del algoritmo NAEP,
    regímenes de SABA, Tabla 23.2, anticolinérgicos, corticoides + Tabla
    23.3, magnesio/ketamina) y Ficha V (exacerbación de EPOC, Tabla 23.4,
    antibióticos, hiperinflación dinámica/PEEP intrínseca, estrategias de
    ventilador); **Cap. 24 "Acute Respiratory Distress Syndrome"** → Ficha
    VI (patogénesis, Tabla 24.1 de condiciones predisponentes,
    peculiaridad de la COVID-19, criterios diagnósticos Tabla 24.2,
    calculadora de gravedad de Berlín por PaO₂/FiO₂, reales Figs.
    24.1/24.2/24.3), Ficha VII (P-SILI con diagrama SVG propio, HFNO,
    aviso de toxicidad por O₂, manejo de fluidos, corticoides Tabla 24.3,
    posición prono Tabla 24.4) y Ficha VIII (VILI —volutrauma/
    atelectrauma/biotrauma—, real Fig. 24.6, ventilación protectora Tabla
    24.5 + calculadora de PBW/volumen tidal, hipercapnia permisiva, APRV,
    tabla de fallo multiorgánico, ECMO); **Cap. 25 "Oxygen Inhalation"** →
    Ficha IX (historia de las indicaciones, ecuación de CaO₂ +
    calculadora, Tabla 25.1 de tolerancia a la hipoxemia, la anécdota de
    Reinhold Messner en el Everest sin O₂ suplementario, efectos sobre el
    gasto metabólico/vasoconstricción) y Ficha X (Tabla 25.2 de sistemas de
    administración, sistemas de bajo/alto flujo, HFNO Tabla 25.3), más
    Ficha XI (química de ROS con diagrama SVG de la cascada de reacción,
    activación de neutrófilos, antioxidantes —SOD/glutatión+NAC/selenio/
    vitamina E/vitamina C/ceruloplasmina—, estrés oxidativo, toxicidad
    pulmonar por O₂, Ecuación 25.3 como palabra final); **Cap. 26
    "Noninvasive Ventilation"** → Ficha XII (CPAP/BiPAP/PSV/PAV,
    mascarillas faciales/casco, con el dato de que la intolerancia a la
    mascarilla explica hasta el 18% de los fracasos de VNI) y Ficha XIII
    (selección de pacientes Tabla 26.1, tasas de éxito en fallo
    hipercápnico/hipoxémico, edema pulmonar cardiogénico, papel del HFNO,
    rendimiento cardíaco —precarga/poscarga, Ecuación 26.1— y la palabra
    final sobre no demorar la intubación).
  - **6 imágenes reales extraídas** con `pdfimages -j` desde las páginas
    exactas del PDF (cruzando la página con `pdftotext` porque la leyenda
    de la figura a veces aparece en la página SIGUIENTE a la imagen — un
    primer intento de mapeo de las Figs. 24.2/24.3 se corrigió viendo
    directamente las imágenes extraídas antes de darlas por buenas, no
    fiándose solo del `grep` de texto): `neumo-fig22-1-tc-embolia-pulmonar.jpg`
    (angio-TC con defecto de repleción, Ficha I), `neumo-fig22-2-trombectomia-cateter.jpg`
    (recuperación de coágulo por catéter, Ficha II), `neumo-fig24-1-histologia-sdra.jpg`
    (histología de pulmón normal vs. SDRA, Ficha VI), `neumo-fig24-2-radiografia-sdra.jpg`
    (2 radiografías de tórax, Ficha VI), `neumo-fig24-3-tc-sdra.jpg` (2 TC
    en distintas fases del SDRA, Ficha VI) y `neumo-fig24-6-microscopia-electronica-vili.jpg`
    (micrografías electrónicas de desgarro alveolo-capilar por VILI, Ficha
    VIII) — todas fotografías/registros diagnósticos reales, nunca
    ilustraciones de dispositivo ni gráficos estadísticos. Mismo criterio
    de extracción ya establecido en el resto del proyecto aplicado también
    a lo NO extraído: 2 candidatas (una ilustración de mascarilla de
    no-reinhalación del Cap. 25 y una de la mascarilla de VNI del Cap. 26)
    se descartaron tras inspeccionarlas — resultaron ser clip-art
    estilizado de un dispositivo, no una fotografía clínica real — y se
    dejaron como descripción de texto en vez de como `<img>`, mismo
    criterio ya aplicado a los diagramas de dispositivo del resto de la
    app (nunca dejar una referencia a un archivo `<img>` que no llegó a
    extraerse).
  - **5 calculadoras interactivas** (`merino-neumologia.js`, mismo patrón
    `calcXxx()`/`.tfg-estado-ok/warn/danger` ya usado en el resto de la
    app, con el guard `.value === ''` ya establecido como lección
    aprendida en las auditorías de FRA/ERC para no tratar un campo vacío
    como 0): peso ajustado para heparina por peso (Ecuación 22.1, Ficha
    II), clasificador de gravedad por PEFR % predicho (Ficha III),
    clasificador de gravedad del SDRA por PaO₂/FiO₂ según Berlín (Ficha
    VI), peso corporal predicho (PBW) + volumen tidal inicial/objetivo
    para ventilación protectora (Ficha VIII), y contenido arterial de O₂
    (CaO₂, Ecuación 25.1, Ficha IX).
  - **Bibliografía**: patrón simple de tarjeta única (`<div class="card">`
    con `.biblio-list`, mismo patrón que `merino-hemato.html` — NO el
    patrón de "Ficha N dedicada a bibliografía dentro del corkboard" que
    solo se aplicó a Cardiología tras un pedido explícito posterior),
    con 5 entradas (una por capítulo) enlazando a
    `docs/marino-2024-respiratory-management-caps22-26.pdf#page=N`.
  - **104 preguntas de quiz** (`js/data/merino-neumologia-preguntas.js`,
    `neumo-q001`-`q104`, 8 por ficha × 13 fichas — 6 de opción múltiple + 2
    de tipo `redactar` por ficha, mismo formato ya establecido en el resto
    de módulos Merino). `triggerId: 'btn-merino-neumo-repasar'`, exportado
    junto a `quizBanco`/`quizTemas` desde `neumologia/index.js` y
    fusionado en la única llamada a `initQuiz()` de `main.js` — el menú
    del quiz gana una 6ª asignatura ("Neumología") con un único bloque
    ("Merino Neumología") de 13 fichas.
  - **Parte 2: ventilación mecánica convencional, vía aérea artificial,
    NAV y destete (Cap. 27-30)** — llegó con el pedido "ahora vamos a
    continuar con la segunda parte para añadirla a la app", el envío ya
    anunciado en la Parte 1. Cubre Conventional Mechanical Ventilation,
    The Ventilator-Dependent Patient, Ventilator-Associated Pneumonia, y
    Discontinuing Mechanical Ventilation (62 páginas) — un archivo
    distinto (`docs/marino-2024-respiratory-management-caps27-30.pdf`, sin
    offset, verificado con `pdftotext -f N -l N` en el inicio de cada
    capítulo — Cap27→pág.1, Cap28→pág.17, Cap29→pág.35, Cap30→pág.50; la
    página 63 del PDF ya es la "Section X — Acid-Base Disorders" del
    libro, fuera de alcance de este envío). Ampliado el cuaderno de campo
    de 13 a **23 fichas** (mismo `#merino-neumo-corkboard`/
    `#panel-merino-neumo-tabs`), correspondencia capítulo→bloque de fichas
    según su volumen real, mismo criterio ya establecido en el resto del
    proyecto: **Cap. 27 "Conventional Mechanical Ventilation"** → Ficha
    XIV (modos básicos VCV/PCV, Ecuación 27.1 Ppico=Pres+Pel, maniobra de
    pausa inspiratoria y presión meseta —Ecuaciones 27.2/27.3—, el hallazgo
    de que el riesgo de rotura alveolar depende de la presión meseta
    ≤30 cmH₂O y no de la presión pico, PRVC como modo adaptativo, ZEEP/PEEP
    aplicada/PEEP oculta, presión media de la vía aérea, Ecuaciones 27.4/27.5
    de compliance estática y sus 3 fuentes de error con el ejemplo numérico
    real de la compliance de la tubuladura) y Ficha XV (asisto-control,
    disparo por presión vs. flujo, ciclo respiratorio e I:E, IMV/SIMV con
    sus efectos adversos sobre trabajo respiratorio y gasto cardíaco,
    "mejor PEEP" por compliance/driving pressure con los datos reales de la
    Fig. 27.5 —mejor PEEP=12 cmH₂O—, Ecuación 27.6 DO₂=GC×CaO₂ y el efecto
    opuesto de la PEEP sobre oxigenación/gasto cardíaco de la Fig. 27.6,
    Tabla 27.1 completa del protocolo de ventilación protectora de la ARDS
    Network); **Cap. 28 "The Ventilator-Dependent Patient"** → Ficha XVI
    (tubos endotraqueales, posición correcta con reales Figs. 28.1/28.2,
    daño laríngeo, tubos de drenaje subglótico, traqueostomía —momento,
    técnicas percutánea/quirúrgica/cricotiroidotomía, complicaciones,
    estenosis traqueal—, manejo del manguito y fugas), Ficha XVII
    (aspiración de secreciones —ya no recomendada de rutina—, instilación
    de suero salino —tampoco recomendada, con la cifra real de 300.000
    colonias bacterianas desalojadas—, terapia mucolítica con NAC + Tabla
    28.1, barotrauma pulmonar —volutrauma vs. barotrauma, neumotórax con
    reales Figs. 28.5/28.6/28.7 de radiografía/TC/ecografía/neumotórax a
    tensión, descompresión con aguja, evacuación pleural con el sistema de
    3 cámaras Tabla 28.2 y la advertencia real de que la succión puede
    promover fugas de aire a través de una fístula broncopleural—, real
    Fig. 28.4 de biofilm) y Ficha XVIII (PEEP oculta/intrínseca — efectos
    adversos, monitorización por oclusión al final de la espiración —solo
    fiable sin respiración espontánea—, manejo con PEEP aplicada justo por
    debajo del nivel oculto); **Cap. 29 "Ventilator-Associated Pneumonia"**
    → Ficha XIX (generalidades y epidemiología, Tabla 29.1 de aislados por
    tipo de NAV/HAP, prevención — por qué la clorhexidina ya no se
    recomienda, descontaminación digestiva selectiva con los datos reales
    de la Fig. 29.1, el "paquete del ventilador" Tabla 29.2, el comentario
    crítico de la propia fuente sobre la posición semirreclinada, aspiración
    subglótica), Ficha XX (la falta de fiabilidad de los 4 criterios
    clínicos clásicos verificados contra biopsia pulmonar —Tabla 29.3—, la
    baja especificidad de la radiografía de tórax con reales Fig. 29.3,
    aspirados traqueales —análisis microscópico con real Fig. 29.4, cultivos
    cualitativos vs. cuantitativos—, BAL/mini-BAL, cepillo protegido de
    espécimen, Tabla 29.4 comparando los 3 métodos de cultivo contra biopsia
    pulmonar, y la disparidad entre guías internacionales/EE.UU. sobre qué
    método preferir) y Ficha XXI (clasificación de derrames paraneumónicos
    en 4 categorías —Tabla 29.5—, antibioterapia de derrames infectados,
    drenaje ineficaz/VATS, factores de riesgo de mal pronóstico, regímenes
    empíricos de bajo/alto riesgo —Tabla 29.6—, duración de 7 días para NAV
    documentada, y la reflexión final de la fuente sobre el sobrediagnóstico
    de la NAV como explicación de su bajo impacto en mortalidad); **Cap. 30
    "Discontinuing Mechanical Ventilation"** → Ficha XXII (estrategias del
    ventilador para facilitar el destete —respiraciones disparadas por el
    paciente con el dato real del estudio animal de −50% de fuerza
    diafragmática tras 3 días de ventilación controlada, fisioterapia,
    prácticas de sedación—, la prueba de respiración espontánea —criterios
    de disposición y predictores de éxito Tabla 30.1, método del circuito
    del ventilador vs. circuito en T, con el dato real de que la presión de
    soporte NO reduce significativamente el trabajo respiratorio—, distinguir
    ansiedad de fracaso ventilatorio por el volumen tidal) y Ficha XXIII
    (disfunción cardíaca en el 40% de los destetes fallidos con el dato
    real de la SvO₂ decreciente en trials fallidos, monitorización y manejo
    —CPAP/diuresis/nitratos—, debilidad de la musculatura respiratoria
    —neuromiopatía de la enfermedad crítica, PI<sub>max</sub>—, extubación
    —reflejos protectores, prueba de fuga del manguito con las cifras reales
    de corte &gt;110 mL, pretratamiento con esteroides con los datos reales
    del estudio multicéntrico —22%→3% edema laríngeo, 8%→4% reintubación—,
    estridor post-extubación y por qué siempre es más evidente en
    inspiración).
  - **8 imágenes reales extraídas** con `pdfimages -f N -l N -j` desde las
    páginas exactas del PDF (cruzando cada página candidata con la lectura
    visual del propio PDF antes de extraer, mismo método ya establecido en
    la Parte 1): `neumo-fig28-1-radiografia-tubo-et.jpg` (radiografía de
    tórax con la posición correcta del tubo ET, Ficha XVI),
    `neumo-fig28-2-radiografia-intubacion-selectiva.jpg` (radiografía de
    intubación del bronquio principal derecho con atelectasia izquierda,
    Ficha XVI), `neumo-fig28-4-microscopia-biofilm.jpg` (micrografía
    electrónica de biofilm en un tubo endotraqueal, Ficha XVII),
    `neumo-fig28-5-radiografia-tc-neumotorax.jpg` (radiografía + TC con
    neumotórax anterior no visible en la radiografía, Ficha XVII),
    `neumo-fig28-6-ecografia-linea-pleural.jpg` (ecografía de la línea
    pleural hiperecoica, Ficha XVII), `neumo-fig28-7-radiografia-neumotorax-tension.jpg`
    (radiografía de neumotórax a tensión con desplazamiento mediastínico,
    Ficha XVII), `neumo-fig29-3-radiografias-posicion.jpg` (2 radiografías
    del mismo paciente en supino/espiración vs. erguido/inspiración,
    Ficha XX) y `neumo-fig29-4-tincion-gram-esputo.jpg` (tinción de Gram
    real con células escamosas y neutrófilos, Ficha XX) — todas
    fotografías/registros diagnósticos genuinos. Mismo criterio de
    extracción aplicado también a lo NO extraído (12 figuras más,
    identificadas y confirmadas como gráficos/diagramas de dispositivo
    mediante `pdfimages -list` + inspección visual antes de descartarlas):
    Figs. 27.1-27.6 (gráficos de ondas de presión/volumen y datos de
    estudios, recreados como texto/tablas con los valores numéricos
    reales), Fig. 28.3 (ilustración del tubo de traqueostomía), Fig. 28.8
    (diagrama del sistema de drenaje pleural de 3 cámaras, recreado como
    Tabla 28.2), Fig. 28.9 (esquema de la PEEP oculta, descrito en texto),
    Fig. 29.1 (gráfico de barras de la SDD, recreado como tabla con los
    datos reales), Fig. 29.2 (ilustración del tubo con puerto de succión
    subglótico) y Fig. 29.5 (ilustración del catéter de mini-BAL) — estas 2
    últimas descritas explícitamente en el propio texto como "ilustración
    esquemática del dispositivo... no reproducida como imagen", en vez de
    dejar una referencia `<img>` sin archivo (lección ya aprendida y
    documentada en la Parte 1: nunca dejar una referencia a un archivo que
    no llegó a extraerse, ni siquiera con un `onerror` de respaldo).
  - **Sin calculadoras nuevas** — las 5 calculadoras de la Parte 1
    (peso ajustado, PEFR, Berlín, PBW, CaO₂) ya cubren las fórmulas
    numéricas más claras del libro; el contenido de la Parte 2 es más
    descriptivo/algorítmico (protocolos, clasificaciones, criterios de
    decisión) que aritmético, así que se transcribió íntegro como
    `.data-table`/`kv-row`/`micro-prof-item` nativos sin forzar una
    calculadora donde la fuente no da una fórmula numérica propia.
  - **80 preguntas de quiz nuevas** (`js/data/merino-neumologia-preguntas.js`,
    `neumo-q105`-`q184`, 8 por ficha × 10 fichas nuevas — mismo formato 6
    opción múltiple + 2 `redactar` ya establecido), añadidas al mismo
    array `preguntasMerinoNeumologia` ya exportado (sin tocar
    `neumologia/index.js`, que ya fusiona el banco completo). El banco de
    Merino Neumología queda en **184 preguntas** repartidas en 23 fichas,
    y el banco combinado de toda la app en <strong>1635 preguntas</strong>
    (1555 previas + 80 de esta Parte 2).
  - **Bibliografía**: ampliada de 5 a 10 entradas (misma tarjeta única, sin
    cambiar de patrón), con las 5 nuevas enlazando a
    `docs/marino-2024-respiratory-management-caps27-30.pdf#page=N`. El
    encabezado del módulo se actualizó para reflejar el rango completo
    (Cap. 22-30) en vez de solo Cap. 22-26.
  - Verificado con Playwright: las 23 fichas abren/voltean sin error de
    consola ni 404 real; las 8 imágenes nuevas cargan (`naturalWidth`&gt;0,
    incluida la que vive dentro de un acordeón cerrado); ninguna referencia
    `<img>` rota en las 10 fichas nuevas; el menú del quiz en 3 niveles
    muestra "Neumología (184)" → "Merino Neumología (184)" → las 23 fichas
    con 8 preguntas cada una, y un recorrido de varias preguntas de las
    fichas nuevas (incluida al menos una de tipo `redactar`) no generó
    ninguna excepción JS; sin overflow horizontal a 390px; la ficha
    original `neumo-ep-diagnostico` (Parte 1) sigue funcionando sin
    regresiones.
  - **Auditoría de huecos/mejoras/interactividad de las 23 fichas, y sus
    correcciones aplicadas**, a petición explícita del usuario ("ahora haz
    una auditoría del contenido de neumología... sobre los huecos de
    contenido, las mejoras, las faltas de contenido etc" seguido de "ahora
    aplica las mejoras del chequeo merino neumología"). Auditoría con 5
    agentes en paralelo (4 iniciales, repartiéndose las 152 páginas de los
    2 PDF fuente, + 1 de relleno para las páginas 41-55/Fichas VII-VIII que
    quedaron fuera del reparto de los 4 primeros), cada uno comparando
    frase a frase su tramo del PDF contra el HTML ya escrito — mismo método
    de auditoría ya establecido en el resto del proyecto. Resultado: 0
    errores reales (1 errata de la propia fuente ya fielmente reproducida),
    2 huecos de contenido reales, 5 referencias cruzadas obsoletas
    ("Capítulo N, no incluido en este bloque" — ciertas ahora de que la
    Parte 2 ya está incorporada), y 13 propuestas de mejora/interactividad.
    Publicado como Artifact y aplicado íntegro a continuación:
    - **2 huecos de contenido**: en la Ficha I (`neumo-ep-diagnostico`), el
      cierre real del capítulo ("A Final Word", verificado con
      `pdftotext -f 12 -l 14` contra el texto exacto en inglés antes de
      traducirlo) — 3 viñetas: "cuando crees que está ahí, normalmente no
      lo está" (solo 10% de confirmación tras sospecha), "cuando está ahí,
      normalmente no lo sabes" (origen del émbolo clínicamente silente en
      la mayoría de casos), y la conclusión de que es mejor prevenir la EP
      que diagnosticarla; en la Ficha VII (`neumo-sdra-no-ventilatorio`),
      las 4 contraindicaciones relativas de la posición prono (shock
      circulatorio, embarazo, arritmias potencialmente mortales recientes,
      tubos torácicos funcionantes) con la aclaración explícita de que los
      vasopresores NO son una contraindicación si la condición clínica es
      estable o mejora — ausentes junto a la Tabla 24.4 de
      contraindicaciones absolutas ya existente.
    - **5 referencias cruzadas obsoletas convertidas en enlaces internos
      reales** (`.tx-link` descartado a propósito — ese listener global
      vive en `nefrologia/index.js` y solo conoce las claves de
      `nefroLevel`; reutilizarlo aquí habría repetido el mismo bug ya
      documentado y corregido para Vías Urinarias↔Nefrología y
      Merino Cardiología — se creó en su lugar `.neumo-internal-link`, con
      su propio listener en `merino-neumologia.js`, `initInternalLinks()`,
      llamando a `openCorkboardTopic('panel-merino-neumo-tabs', ...)`, y
      añadida a la regla compartida `.tx-link, .especialidad-link,
      .paper-link, .neumo-internal-link` de `components.css` en vez de
      duplicar CSS): Ficha V (`neumo-epoc-vpp`) → Ficha XVIII
      (`neumo-peep-oculta`), ×2; Ficha VIII (`neumo-sdra-ventilacion`) →
      Ficha XIV (`neumo-vm-modos`, presión meseta) y Ficha XV
      (`neumo-vm-ajuste`, PEEP); Ficha XII (`neumo-vni-metodos`) → Ficha
      XXII (`neumo-sbt`, prueba de respiración espontánea). Otras 3
      referencias similares ("Capítulo 8"/"Capítulo 17"×2/"Capítulo 52")
      se dejaron sin tocar a propósito — confirmado que esos capítulos
      pertenecen a otras secciones del mismo *ICU Book* de Marino, fuera del
      alcance de los 2 PDF de Neumología, así que siguen correctamente
      "no incluidos".
    - **13 piezas de interactividad/mejora**: selector de sistema de O₂ por
      FiO₂ objetivo (Ficha X, filtra `SISTEMAS_O2` por rango de FiO₂);
      calculadora de compliance estática Cstat = VT/(Pmeseta−PEEP) (Ficha
      XIV, con aviso de "combinación no fisiológica" si Pmeseta≤PEEP y
      semáforo de 3 tramos ≥50/25-49/&lt;25 mL/cmH₂O); selector puramente
      explicativo de disparo por presión vs. flujo (Ficha XV); checklist de
      contraindicaciones de la IMV (debilidad de musculatura respiratoria,
      disfunción de VI — con los 2 motivos combinados con "y" si se marcan
      ambos); selector "¿qué método de cultivo elijo?" con gauge visual de
      razón de probabilidades diagnóstica (Ficha XX, reutilizando
      `.kinetic-row`/`.kinetic-fill`, coloreado verde/amarillo/rojo por
      DOR≥8/≥6/menor); clasificador completo de derrame paraneumónico en 4
      categorías (Ficha XXI, siguiendo la Tabla 29.5 — purulento→Cat4,
      &lt;10mm→Cat1, loculado/pH&lt;7,20/glucosa&lt;60/Gram+→Cat3,
      resto→Cat2, con tubo torácico marcado Sí desde Cat3; ambos selectores
      obligatorios —loculado y Gram— se abstienen de dar veredicto hasta
      que se responden los dos, aunque uno solo ya bastaría por la lógica
      OR, para no asumir una respuesta no dada); calculadora de la prueba
      de fuga del manguito (Ficha XXIII, umbral &gt;110 mL); 2 tablas de
      datos reales de figura (Fig. 25.2 PaO₂/VO₂ por FiO₂ en Ficha IX, y 2
      etiquetas "Figura 26.4/26.5 (datos)" en Ficha XIII); nota de
      fidelidad nueva en Ficha VI (unidades de PEEP mmHg vs. cmH₂O, misma
      errata de la fuente ya documentada, nunca "corregida" por criterio
      propio) y en Ficha XVI (presión del manguito citada en mmHg y cmH₂O,
      confirmado que son la misma cifra en la práctica —1 mmHg≈1,36
      cmH₂O—, no 2 umbrales distintos); ficha del casco (helmet) separada
      de "Mascarillas faciales" en su propio `micro-prof-item` (Ficha XII);
      y una corrección de errata de tecleo ("puerto de sección" → "puerto
      de succión", Ficha XIX).
    - Todas las calculadoras nuevas siguen el guard `.value === ''` ya
      establecido como lección aprendida en las auditorías de FRA/ERC (
      nunca tratar un campo vacío como 0).
    - Verificado con Playwright: los 5 enlaces internos navegan a su ficha
      exacta de destino sin corromper ningún switcher; las 7 piezas
      interactivas nuevas responden correctamente a valores concretos
      (Cstat 420/(24-8)=26,3 mL/cmH₂O tramo warn; Cstat con
      Pmeseta≤PEEP → aviso no fisiológico; checklist IMV con 2 marcados
      combina motivos con "y"; selector de cultivo BAL → DOR 9,6 con gauge
      al 96%; derrame purulento → Categoría 4; derrame &lt;10mm →
      Categoría 1; derrame loculado+Gram- → Categoría 3, solo tras
      responder ambos selectores obligatorios; fuga 80 mL → aviso de riesgo
      ×7; fuga 150 mL → mensaje de normalidad) y se abstienen sin error en
      campo vacío (nunca `NaN`); sin overflow horizontal a 390px en
      ninguna de las 14 fichas tocadas; sin errores de consola ni 404 reales
      (el único 404 es el `favicon.ico`, ya documentado como inocuo). Bump
      de cache-busting (`?v=20260903`) por el cambio en `components.css`.
  - **Segunda auditoría (a petición explícita del usuario: "revisa el
    contenido de neumología... respecto a la bibliografía... buscar los
    huecos de contenido, las mejoras, las posibles partes interactivas...
    y corregir las partes interactivas")**, con 4 agentes en paralelo
    repartiéndose las 23 fichas por tramos de páginas de los 2 PDF fuente
    (Fichas I-VI/pág. 1-40, VII-XIII/pág. 32-90, XIV-XVIII/pág. 1-36,
    XIX-XXIII/pág. 33-63), cada uno comparando frase a frase su tramo
    contra el HTML ya escrito. Resultado: fidelidad muy alta tras las 2
    rondas de auditoría previas — solo 4 errores reales menores y ningún
    hueco de contenido genuino. Corregidos los 4 errores:
    - **Ficha III** (`neumo-asma-epoc-basicos`): la velocidad del spray de
      un MDI decía "más de 100 km/h" — el PDF dice literalmente "más de
      60 millas/hora" (≈97 km/h, no &gt;100). Corregido a la cifra real.
    - **Ficha XV/XVIII** (`neumo-vm-ajuste`/`neumo-peep-oculta`): el propio
      Capítulo 27 menciona de pasada el método de oclusión de la PEEP
      oculta como "al final de la **inspiración**", contradiciendo el
      desarrollo fisiológico completo del Capítulo 28 (correctamente
      reflejado en la app como "al final de la espiración") — inconsistencia
      interna real de la fuente, documentada con una nota de fidelidad
      explícita en vez de "corregirse" en silencio.
    - **Ficha XXIII** (`neumo-weaning-extubacion`): la SvO₂ durante SBT
      exitosas decía "~65-68%" — los 3 puntos reales de la Fig. 30.4 son
      65/66/66%, máximo real 66% no 68%. Corregido a "~65-66%".
    - **Ficha XXI** (`neumo-derrame-antimicrobiano`): el texto del
      "Régimen de alto riesgo" describe el levofloxacino como "un
      antibiótico β-lactámico", contradiciendo la propia Tabla 29.6
      (justo debajo, en el mismo capítulo) que lo clasifica en el grupo C
      —"agente no β-lactámico"— por ser una fluorquinolona. Misma
      inconsistencia interna de la fuente, documentada con nota de
      fidelidad en vez de corregida en silencio.
    - **6 piezas de interactividad nuevas**, todas con criterios/fórmulas
      explícitos en la fuente, ninguna fabricada: checklist de las 4
      condiciones para retener anticoagulación en émbolo subsegmentario
      único (Ficha I); clasificador de riesgo de EP bajo/intermedio/alto
      por VD/troponina/inestabilidad hemodinámica/comorbilidades (Ficha
      II); checklist de los 5 criterios diagnósticos de Berlín, con
      veredicto "compatible/no compatible con SDRA" (Ficha VI); selector
      de tamaño de tubo ET por altura, con los cortes en pulgadas de la
      fuente convertidos a cm (Ficha XVI); checklist de disposición para
      SBT + calculadora de los 4 predictores de éxito de la Tabla 30.1
      (V<sub>T</sub>/kg, RR, RR/V<sub>T</sub>, PI<sub>max</sub>),
      reutilizando el PBW ya calculado en la Ficha VIII vía un enlace
      `.neumo-internal-link` (Ficha XXII); y evaluador de respuesta a la
      VNI a la 1ª hora, con 2 modos (PaCO₂ para fallo hipercápnico —corte
      ≥10% de descenso—, PaO₂/FiO₂ para fallo hipoxémico —debe aumentar—)
      que cambia las etiquetas de los campos dinámicamente según el modo
      elegido (Ficha XIII).
    - Todas las calculadoras nuevas siguen el guard `.value === ''` ya
      establecido (nunca tratar un campo vacío como 0), y los checklists
      distinguen explícitamente "todos los criterios cumplidos" de
      "cumplimiento parcial" en vez de un simple sí/no binario.
    - Verificado con Playwright: las 6 piezas responden correctamente a
      valores concretos (checklist subsegmentaria 4/4 → verde; clasificador
      de riesgo con inestabilidad hemodinámica marcada → alto riesgo;
      checklist Berlín 5/5 → compatible con SDRA; altura 190cm → tubo
      tamaño 8; checklist SBT 5/5 → criterios cumplidos, predictores
      VT=400mL/PBW=70kg/RR=25/PImax=-25 → 4/4 favorables; evaluador VNI
      hipercápnico con descenso del 21,4% → respuesta favorable); las 4
      correcciones de contenido están presentes y las cifras erróneas ya
      no aparecen; sin overflow horizontal ni errores de consola reales
      (el único 404 es el `favicon.ico`, ya documentado como inocuo).

