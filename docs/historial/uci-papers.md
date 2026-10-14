# Historial · UCI / Papers Tuiter

> Texto movido tal cual desde el antiguo `CLAUDE.md` (octubre 2026). Es la historia de cómo se construyó
> esta parte: decisiones, fuentes, auditorías y verificaciones. Las reglas vigentes están en `CLAUDE.md`.

### UCI / Papers Tuiter

Tercera especialidad del menú raíz (`#btn-uci-papers`, junto a Hematología y
Nefrología), pensada para recoger resúmenes esquematizados de papers de
Medicina Intensiva que circulan por redes sociales (X/Twitter) — el estudio,
su diseño, el resultado principal y su aplicación práctica a pie de cama.
Arrancó como placeholder puro, igual que Nefrología en su día, y pasó a
tener contenido real en cuanto el usuario aportó el primer PDF.

- **Dos niveles**, mismo patrón que Citopenias/Trasplante en Hematología:
  un **submenú de papers** (`#uci-papers-menu-view`,
  `js/modules/uci-papers/uci-papers-menu.html`, con `.btn-volver-especialidades`)
  del que cuelga un botón por paper, y la **vista propia de cada paper**
  (p. ej. `#uci-paper-shock-view`) con su propio cuaderno de campo. El
  switcher `uciLevel` vive dentro de `js/modules/uci-papers/index.js`
  (`createViewSwitcher({ menu, shockSeptico })`), no en
  `modules/home/index.js` — mismo motivo que Nefrología tiene su propio
  `nefroLevel`: la vista raíz `#uci-papers-view` (registrada en el
  `topLevel` de `home/index.js`) es solo el contenedor exterior. Al volver
  a "UCI / Papers Tuiter" desde Especialidades, `uciPapers.init()` devuelve
  `{ volverAlMenu }`, que `home/index.js` inyecta perezosamente
  (`onUciPapersListo`, mismo patrón que `onNefrologiaListo`) para dejar
  siempre el submenú de papers como pantalla de entrada — igual que
  `goHome()`/`nefrologia.volverAlMapa()` hacen con el Atlas y el mapa del
  riñón. Añadir un paper nuevo en el futuro: 1) botón nuevo en
  `uci-papers-menu.html`, 2) su propio `<vista>.html` con
  `.btn-volver-uci-menu`, 3) registrarlo en `index.html` dentro de
  `#uci-papers-view` y en el switcher `uciLevel` de `uci-papers/index.js`.
- **Primer paper: "25 años de resucitación hemodinámica en el shock
  séptico"** (`js/modules/uci-papers/shock-septico.html`). Fuente:
  Hernandez G, Hunsicker O, De Backer D, Angus DC, Bakker J, Basmaji J, et
  al. Twenty-five years of septic shock hemodynamic resuscitation trials: a
  conceptual perspective. Crit Care. 2026;30:400 (artículo tipo
  *Perspective*/Open Access, no una guía de práctica clínica — recoge la
  lectura conceptual de los autores sobre 6 ensayos landmark: EGDT 2001,
  LACTATE 2010, SEPSISPAM 2014, ANDROMEDA-SHOCK 2019, CLASSIC 2022,
  ANDROMEDA-SHOCK 2 2025). PDF completo subido a
  `docs/hernandez-2026-resucitacion-shock-septico.pdf`, mismo criterio que
  el resto de fuentes del proyecto (preferible a enlazar a una URL externa
  que pueda dejar de estar viva).
  - **Cuaderno de campo de 8 fichas** (`#uci-shock-corkboard`/
    `#panel-uci-shock-tabs`, mismo `core/corkboard.js` de siempre):
    Introducción, EGDT (2001), LACTATE (2010), SEPSISPAM (2014),
    ANDROMEDA-SHOCK (2019), CLASSIC (2022), ANDROMEDA-SHOCK 2 (2025), y
    Motores del progreso y reflexiones finales. Cada ficha de ensayo
    incluye su fila completa de la Tabla 1 del artículo (racional
    fisiológico / limitaciones potenciales / aportación metodológica,
    como `.kv-row`) además del texto narrativo — no se resumió ni se
    dejó fuera ningún ensayo de los 6.
  - **3 figuras reales del artículo** extraídas rasterizando las páginas
    completas con `pdftoppm -r 300` y recortando con Pillow (no
    `pdfimages`: las figuras de este PDF están compuestas de decenas de
    imágenes/iconos superpuestos en InDesign, así que extraer los objetos
    de imagen individuales da fragmentos irreconocibles — hay que
    rasterizar la página entera y recortar la región de la figura, método
    nuevo en el proyecto, distinto del `pdfimages -all` ya usado en
    Nefrología/Reconocimiento): `shock-fig1-evolucion.jpg` (línea
    temporal de los 6 ensayos, Fig. 1), `shock-fig2-conceptual.jpg` (mapa
    conceptual circular, Fig. 2) y `shock-fig3-drivers.jpg` (motores del
    progreso, Fig. 3) en `js/modules/uci-papers/img/`. La Tabla 2 del
    artículo (5 dominios de progreso conceptual) se recreó como
    `.data-table` nativa en la última ficha, no como imagen.
  - **Nueva clase `.hl`** (`css/components.css`) — resaltado tipo
    "rotulador" (gradiente de fondo bajo el texto) para conceptos clave
    dentro de la prosa, a petición explícita del usuario ("subrayados y
    resaltados para que sea fácil estudiar"). Complementa a `<strong>`
    (que ya colorea con `--item-color` dentro de `.micro-prof-item`) en
    vez de sustituirlo: `<strong>` para términos/definiciones, `.hl` para
    frases o datos clave dentro del párrafo — mismo criterio a seguir si
    se añaden más papers con contenido narrativo denso.
  - **40 preguntas de quiz** (`js/data/shock-septico-preguntas.js`,
    `shock-q001`-`q040`, 5 por ficha × 8 fichas — mismo baseline mínimo ya
    usado al arrancar otros módulos), con `triggerId: 'btn-uci-shock-repasar'`
    exportado desde `uci-papers/index.js` (`quizTriggerId`/`quizBanco`/
    `quizTemas`, mismo patrón de fusión en `main.js` que Hematología y
    Nefrología — ver más abajo). El banco combinado de toda la app queda
    en **767 preguntas** (727 previas + 40 de este paper).
  - Bibliografía: una única entrada enlazando al PDF en `docs/`, con nota
    explícita de que es un artículo de perspectiva/opinión, no una
    revisión sistemática ni una guía — para que no se lea como
    recomendación normativa.
- **Segundo paper: "Óxido nítrico inhalado: fisiopatología cardio-cerebrovascular
  y respiratoria"** (`js/modules/uci-papers/oxido-nitrico-inhalado.html`).
  Fuente: Signori D, Magliocca A, Hayashida K, Graw JA, Malhotra R, Bellani
  G, Berra L, Rezoagli E. Inhaled nitric oxide: role in the pathophysiology
  of cardio-cerebrovascular and respiratory diseases. Intensive Care Med
  Exp. 2022;10:28 (revisión narrativa, no una guía de práctica clínica ni
  un ensayo — sintetiza evidencia preclínica y clínica de muy distinto
  nivel sobre un mismo mecanismo molecular, el NO, en muchas condiciones
  distintas). PDF completo subido a
  `docs/signori-2022-oxido-nitrico-inhalado.pdf`. Segundo botón del
  submenú de papers (`#btn-paper-no`), mismo patrón de switcher anidado
  que el primer paper (`uciLevel` en `uci-papers/index.js` ganó una
  tercera entrada, `oxidoNitrico`).
  - **Cuaderno de campo de 10 fichas** (`#no-corkboard`/`#panel-no-tabs`,
    mismo `core/corkboard.js` de siempre — más grande que el del primer
    paper porque la fuente es una revisión narrativa mucho más extensa,
    28 páginas cubriendo desde la bioquímica básica del NO hasta 9
    condiciones clínicas distintas): Introducción (historia y biología),
    Mecanismo de acción y toxicología, Disfunción endotelial, Síndrome de
    isquemia-reperfusión, NO y el cerebro, NO y el sistema cardiovascular,
    NO y la hemólisis, NO y el pulmón, NO/sepsis/COVID-19, y Conclusiones
    con la Tabla 1 del artículo recreada como `.data-table` (nivel de
    evidencia preclínica/clínica por condición clínica — simplificada de
    la tabla original, que además distingue explícitamente estudios en
    animales pequeños/grandes y evidencia clínica de menor/mayor nivel
    celda por celda).
  - **3 figuras reales del artículo**, extraídas esta vez directamente con
    `pdfimages -png` (a diferencia del primer paper de UCI/Papers Tuiter,
    este PDF de Springer/BioMed Central tiene cada figura como una única
    imagen ráster incrustada por página, sin fragmentar en decenas de
    objetos como el InDesign del paper de Hernandez — no hizo falta
    rasterizar la página entera y recortar): `no-fig1-enos-uncoupling.jpg`
    (biosíntesis del NO y desacoplamiento de la eNOS, Fig. 1),
    `no-fig2-hemolisis.jpg` (secuestro de NO en la hemólisis con el
    espectro de absorción oxi-Hb/met-Hb, Fig. 2), y
    `no-fig3-hpv-selectividad.jpg` (reversión por iNO de la hipoxemia y la
    HPV con la curva V/Q, Fig. 3) en `js/modules/uci-papers/img/`. Si en
    el futuro se añade otro paper de una revista Springer/BioMed
    Central/similar (con figuras ya incrustadas como imagen única por
    página), prueba primero `pdfimages -list` en la página del PDF: si
    devuelve una sola imagen grande por figura, usa `pdfimages -png`
    directamente — el método de rasterizar+recortar con Pillow queda
    reservado para PDFs con figuras compuestas por InDesign (fragmentadas
    en decenas de objetos pequeños).
  - **50 preguntas de quiz** (`js/data/oxido-nitrico-preguntas.js`,
    `no-q001`-`q050`, 5 por ficha × 10 fichas), con
    `quizTriggerId: 'btn-no-repasar'` añadido al array que ya exporta
    `uci-papers/index.js` (junto a `btn-uci-shock-repasar`). El banco
    combinado de toda la app queda en **825 preguntas** (775 previas + 50
    de este paper).
  - Bibliografía: una única entrada enlazando al PDF en `docs/`, con nota
    explícita de que es una revisión narrativa que mezcla evidencia
    preclínica y clínica de muy distinto nivel — no leer como
    recomendación de uso clínico generalizado del iNO.
- **Tercer paper: "Disfunción del ventrículo derecho y lesión renal
  postoperatoria"** (`js/modules/uci-papers/vd-lra-postoperatoria.html`).
  Fuente: Siegman A, Sidhu PS, Li D. Right Heart Dysfunction and
  Postoperative Renal Injury: Venous Congestion, Renal Perfusion Pressure,
  and Perioperative Implications. Curr Anesthesiol Rep. 2026;16:10 (revisión
  breve de 8 páginas, no una guía). PDF completo subido a
  `docs/siegman-2026-disfuncion-vd-lra-postoperatoria.pdf`. Tercer botón del
  submenú de papers (`#btn-paper-vdlra`), misma tercera entrada añadida al
  switcher `uciLevel`.
  - **Cuaderno de campo de 7 fichas** (`#vdlra-corkboard`/`#panel-vdlra-tabs`):
    Introducción (el modelo cardiorrenal), Fisiología del VD y su
    relevancia renal, Hemodinámica renal (por qué importa la PVC),
    Evidencia clínica en humanos (con la Tabla 1 del artículo recreada),
    Evidencia en cirugía cardiaca, Implicaciones perioperatorias (con la
    Tabla 2 recreada, primera tabla de la app que usa `rowspan` para
    agrupar dos filas por fase intraoperatoria/postoperatoria — se
    verificó con Playwright que `.data-table` renderiza `rowspan`
    correctamente sin CSS adicional), y Conclusiones con las 3
    referencias clave que los propios autores anotan al final del
    artículo (recreadas como acordeón `.micro-prof-item`, con la
    anotación explicativa de cada autor, no solo la cita).
  - **1 figura real** (`vdlra-fig1-mecanismo.jpg`, el diagrama de flujo de
    mecanismos VD→LRA con la ecuación de la RPP) extraída directamente con
    `pdfimages -png` — mismo caso que el paper de óxido nítrico (PDF de
    Springer con la figura como imagen única embebida, sin fragmentar).
  - **Banco de quiz deliberadamente pequeño — nuevo estándar para todos
    los papers de UCI/Papers Tuiter**: a petición explícita del usuario
    ("no hagas muchas preguntas, pon entre 8-10 y 3-4 de redactar"), este
    paper rompe con el patrón de ~5 preguntas por ficha usado en los dos
    papers anteriores (40 y 50 preguntas). En su lugar:
    **9 preguntas de opción múltiple + 4 "de redactar"** (13 en total,
    `js/data/vd-lra-preguntas.js`, `vdlra-q001`-`q013`), reflejo del
    equilibrio entre "no abrumar con preguntas" y no dejar ningún tema del
    cuaderno de campo sin al menos 1 pregunta — **regla dura**: nunca
    registres una entrada en `temasXxx` si su recuento en el banco es 0,
    porque el selector de temas del quiz pintaría un botón "Tema (0)" que,
    al pulsarse, llama a `empezar([])` y revienta con
    `Cannot read properties of undefined (reading 'enunciado')` al
    intentar pintar `orden[0]` — mismo síntoma que el bug de doble
    `initQuiz()` ya documentado más abajo, pero con una causa distinta
    (banco vacío para un tema, no llamada duplicada); prevenido aquí
    verificando antes de escribir el banco que cada tema tenga ≥1
    pregunta. **De ahora en adelante, todo paper nuevo de UCI/Papers
    Tuiter debe seguir este mismo formato reducido (8-10 opción múltiple +
    3-4 de redactar)**, no el formato de ~40-50 preguntas usado en los dos
    primeros papers — esos dos no se han recortado retroactivamente
    porque no se pidió explícitamente, pero cualquier paper nuevo debe
    nacer ya con el banco pequeño.
  - **Nuevo tipo de pregunta "de redactar" en el motor de quiz
    (`js/modules/quiz/quiz.js` y `quiz.html`)**: hasta ahora `initQuiz()`
    solo sabía renderizar preguntas de opción múltiple
    (`{ enunciado, opciones, correcta, explicacion }`). Se añadió un
    segundo tipo, marcado con `tipo: 'redactar'`
    (`{ tipo: 'redactar', enunciado, respuestaModelo }`, sin `opciones` ni
    `correcta`) que convive en el mismo banco: el usuario escribe su
    propia respuesta en un `<textarea>` nuevo (`#quiz-redactar-input`,
    contenido nunca guardado ni enviado a ningún sitio — solo apoyo para
    pensar antes de mirar la respuesta), pulsa "Ver respuesta modelo →"
    (`#quiz-ver-respuesta`), y entonces se revela `respuestaModelo` en el
    mismo `#quiz-explicacion` que ya usan las preguntas normales, seguido
    de un autoevaluación de dos botones ("✅ Sí, lo tenía claro" /
    "❌ No, a repasar", `#quiz-autoeval`) que alimenta el mismo
    `registrarRespuesta()`/`localStorage` de aciertos-fallos que las
    preguntas de opción múltiple — así el sistema de progreso por
    pregunta sigue siendo uniforme independientemente del tipo.
    `renderPregunta()` ahora ramifica en `pregunta.tipo === 'redactar'`
    para decidir si mostrar `#quiz-opciones` o `#quiz-redactar`; el resto
    del motor (barajado, navegación "Siguiente", selector de temas) es
    compartido sin cambios entre ambos tipos. Si se añaden preguntas de
    redactar a un banco existente, no hace falta tocar nada más —
    conviven con las de opción múltiple en el mismo array `banco`.
- **Cuarto paper: "VExUS: ecografía de la congestión venosa"**
  (`js/modules/uci-papers/vexus.html`) — a diferencia de los 3 papers
  anteriores (cada uno de una sola fuente), este bloque fusiona
  **3 artículos** que cuentan la misma historia en 3 capas: Mullens W,
  Abrahams Z, Francis GS, et al. Importance of venous congestion for
  worsening of renal function in advanced decompensated heart failure. J
  Am Coll Cardiol. 2009;53(7):589-96 (el "por qué" — el estudio seminal
  que desplazó el foco del bajo gasto cardíaco a la congestión venosa
  como determinante del "riñón congestivo"); Beaubien-Souligny W, Rola P,
  Haycock K, et al. Quantifying systemic congestion with point-of-care
  ultrasound: development of the venous excess ultrasound grading system.
  Ultrasound J. 2020;12:16 (el "qué" — el paper que define el score
  VExUS tal como se usa hoy, comparando 5 prototipos de gradación); y
  Rola P, Miralles-Aguiar F, Argaiz E, et al. Clinical applications of
  the venous excess ultrasound (VExUS) score: conceptual review and case
  series. Ultrasound J. 2021;13:32 (el "cómo" — fisiología del Doppler
  venoso + 5 casos clínicos reales donde VExUS cambió el manejo). Los 3
  PDF están archivados en `docs/mullens-2009-congestion-venosa-funcion-renal.pdf`,
  `docs/beaubien-souligny-2020-desarrollo-vexus.pdf` y
  `docs/rola-2021-vexus-revision-conceptual-casos.pdf`.
  - **Auditoría previa a implementar nada, a petición explícita del
    usuario** ("antes de subir información... me gustaría auditar sobre
    cómo sería la forma más eficiente de volcar el contenido"). Antes de
    escribir una sola línea de contenido, se leyeron los 3 PDF completos y
    se publicó un plan como Artifact (mapa de qué aporta cada fuente,
    hallazgo de que 2 de los 3 artículos ya se citaban parcialmente en la
    app — ver más abajo —, estructura de fichas propuesta e inventario de
    figuras extraíbles) con 3 decisiones explícitas a confirmar antes de
    tocar el repositorio, resueltas con `AskUserQuestion`: 1) fusionar los
    3 artículos en una sola entrada nueva (elegido, sobre 3 entradas
    separadas) — la primera vez que un "paper" de este submenú se
    construye a partir de más de una fuente; 2) tamaño del banco de quiz:
    el "estándar reducido" ya fijado para los papers de este apartado
    (elegido, sobre el formato completo de ~40-50 preguntas de los 2
    primeros papers); 3) convertir las menciones de Mullens/VExUS ya
    existentes en Siegman (VD-LRA postoperatoria, este mismo submenú) y en
    FRA (Nefrología) en enlaces reales a la ficha nueva en vez de dejarlas
    como prosa suelta (elegido). Este patrón de "auditar/planificar y
    confirmar antes de construir" es el que replicar cuando se traigan
    varios artículos relacionados a la vez en el futuro, en vez de
    empezar a escribir contenido directamente.
  - **Hallazgo clave de la auditoría**: Mullens et al. y el score VExUS ya
    se citaban, con sus cifras clave (AUC 0,734/0,552; HR 3,69; +LR 6,37),
    como evidencia de apoyo dentro de la síntesis propia de
    `vd-lra-postoperatoria.html` (Siegman et al. 2026, Ficha IV
    "Evidencia clínica en humanos" y Ficha VI "Implicaciones
    perioperatorias") y en una sola frase de `fra.html` (Ficha
    "Subfenotipos II") — sin su metodología completa, sin los 5
    prototipos A-E, y sin nada de Rola et al. 2021 (100% contenido
    nuevo). Esto confirmó la decisión de fusionar en una entrada y de
    enlazar en vez de duplicar cifras que ya vivían en 2 sitios distintos
    con riesgo real de desincronizarse.
  - **Cuaderno de campo de 6 fichas**: Introducción — el riñón congestivo
    (marco conceptual: el gradiente de perfusión real es la presión
    arteriolar precapilar menos la venular postcapilar, no MAP−CVP sin
    más; el experimento de Winton 1931), Mullens et al. 2009 (metodología
    completa del PAC, Tablas 1-2, Figuras 1-3 con las barras de WRF por
    categoría de PVC/CI/PAS/PCWP y las curvas ROC, mecanismos
    experimentales desde los años 30, el ensayo ESCAPE), Fisiología del
    Doppler venoso (por qué cambian las ondas hepática/portal/intrarrenal
    con la congestión, con sus criterios exactos de anomalía leve/grave, y
    las limitaciones/trampas de interpretación reconocidas por los propios
    autores de Rola et al.), Desarrollo del score VExUS (los 5 prototipos
    A-E comparados con la Figura 1 completa del artículo, por qué ganó el
    sistema "C", Tabla de HR por sistema, rendimiento diagnóstico
    completo), Aplicación clínica — 5 casos reales (cada uno con su propia
    imagen Doppler real anotada, extraída del artículo, y su lección
    concreta — desde una "colecistitis" que en realidad era congestión
    hepática hasta un choque obstétrico donde un monitor de gasto cardíaco
    continuo dio una lectura engañosa de hipovolemia), y Dónde más aparece
    en la app (los 3 enlaces cruzados reales, ver abajo).
  - **11 figuras reales extraídas** con `pdfimages -png` + conversión a
    JPEG con Pillow (los 3 PDF tienen las figuras como imagen única
    embebida por página, sin fragmentar — mismo caso que Signori/Siegman,
    no hizo falta rasterizar+recortar): 2 de Mullens (Fig. 1 barras de WRF,
    Fig. 2 curvas ROC — la Fig. 3 de contribución CI/PVC a la TFG se
    describe en texto sin imagen, por ser de menor prioridad pedagógica),
    2 de Beaubien-Souligny (Fig. 1, la tabla de grading + los 9 patrones
    Doppler de referencia — pieza central del bloque; Fig. 5, ejemplo real
    de dos pacientes grado 1 vs. grado 3 — la Fig. 2 de distribución de
    grados por prototipo se dejó fuera por ser secundaria/estadística), y
    7 de Rola (Fig. 1 presión a lo largo del sistema circulatorio, Fig.
    2-6 una imagen Doppler real por cada uno de los 5 casos clínicos, Fig.
    7 el diagrama del algoritmo de gradación completo). Bug propio
    detectado y corregido antes de la verificación con Playwright: las 5
    imágenes de los casos clínicos se habían extraído y copiado a
    `js/modules/uci-papers/img/` pero nunca se llegaron a insertar como
    `<img>` en el HTML de la Ficha V — solo quedaban en texto — corregido
    insertando cada imagen dentro del `.micro-prof-body` de su caso
    correspondiente.
  - **14 preguntas de quiz** (`js/data/vexus-preguntas.js`,
    `vexus-q001`-`q014`, 10 de opción múltiple + 4 de redactar — el
    "estándar reducido" ya usado en este submenú, repartido esta vez entre
    6 fichas de 3 fuentes distintas en vez de las ~3 fichas habituales de
    un solo paper), con `triggerId: 'btn-vexus-repasar'` añadido al array
    que ya exporta `uci-papers/index.js`. El banco combinado de toda la
    app queda en <strong>1049 preguntas</strong> (1035 previas + 14).
  - **Enlaces cruzados reales en las 2 direcciones**, generalizando el
    mecanismo ya existente en vez de duplicar contenido:
    - **Dentro del mismo submenú** (VExUS ↔ VD-LRA postoperatoria): nueva
      clase `.paper-link`, deliberadamente **distinta** de `.tx-link` — el
      listener global `.tx-link` de `nefrologia/index.js`
      (`document.querySelectorAll('.tx-link')`, sin acotar a su propio
      DOM) habría intentado procesar cualquier botón `.tx-link` con
      `data-view="vdLra"`/`"vexus"` como si fueran claves de SU PROPIO
      switcher (`nefroLevel`), claves inválidas que vacían todas sus
      vistas — exactamente el mismo bug ya detectado y evitado con
      `.especialidad-link` en la ronda anterior de fusión Nefrología↔Vías
      Urinarias. `.paper-link` tiene su propio listener, registrado en
      `uci-papers/index.js`, que opera sobre `uciLevel` (sus propias
      claves: `shockSeptico`/`oxidoNitrico`/`vdLra`/`vexus`) sin colisión
      posible con ningún otro listener global de la app.
    - **Entre especialidades** (VExUS ↔ FRA/Nefrología, VExUS ↔
      Cardiología/Fisiopatología UCI): el mecanismo `.especialidad-link`
      +`irAFicha()` ya generalizado para Nefrología↔Fisiopatología UCI se
      extiende aquí a una tercera especialidad — `uci-papers/index.js`
      exporta ahora su propio `irAFicha(view, panel, tab)`, y el listener
      de `home/index.js` reconoce `data-especialidad="uciPapers"` además
      de `"nefrologia"`/`"fisioUci"`.
    - `css/components.css` actualizado para que `.tx-link`,
      `.especialidad-link` y `.paper-link` compartan la misma regla visual
      en vez de triplicar el CSS.
  - Verificado con Playwright: las 6 fichas abren/voltean sin error de
    consola ni 404 real; las 6 imágenes visibles de entrada cargan
    correctamente (`naturalWidth`&gt;0) y las 5 imágenes de los casos
    clínicos, inicialmente con `loading="lazy"` dentro de un acordeón
    cerrado (`naturalWidth`=0 hasta abrirlo — comportamiento esperado, no
    un bug), cargan correctamente en cuanto se abre su `.micro-prof-item`;
    los 6 saltos cruzados (2 `.paper-link` desde VD-LRA hacia VExUS, 1
    `.especialidad-link` desde FRA hacia VExUS, y los 3 de vuelta desde la
    Ficha VI de VExUS hacia FRA/VD-LRA/Cardiología) cambian de vista y
    abren la ficha exacta de destino; el selector de temas del quiz
    muestra las 6 fichas con sus recuentos reales (2/3/2/3/3/1=14) y un
    recorrido completo de las 14 preguntas (incluidas las 4 de redactar)
    no generó ninguna excepción JS; sin overflow horizontal a 390px.
- **Quinto paper: "Guías PUMA de extubación traqueal"**
  (`js/modules/uci-papers/extubacion-puma.html`). Fuente: Ellard L, Higgs A,
  Cooper RM, Hagberg CA, Baker PA, Greif R, et al. Project for Universal
  Management of Airways: guidelines for tracheal extubation. Anaesthesia.
  2026. PDF completo subido a
  `docs/ellard-2026-puma-guias-extubacion-traqueal.pdf`. Sexto botón del
  submenú de papers (`#btn-paper-extub`), con `uciLevel` (en
  `uci-papers/index.js`) ganando una quinta entrada (`extubacionPuma`).
  **Antes de construir nada**, se hizo un mini-informe (a petición
  explícita del usuario: "ahora haz un mini informe sobre como subir estos
  papers a la parte de tuiter" — deliberadamente más ligero que el
  plan+Artifact+`AskUserQuestion` completo de VExUS, sin publicar Artifact
  ni pedir confirmación, porque ninguna decisión estructural era ambigua:
  a diferencia de VExUS, este paper y el de citrato —ver más abajo— no
  comparten fisiopatología entre sí, así que la recomendación de 2 entradas
  separadas era evidente sin necesidad de `AskUserQuestion`) comprobando
  primero, por `grep`, que no existía contenido previo de vía
  aérea/extubación/laringoespasmo en ningún módulo de la app.
  - **Cuaderno de campo de 7 fichas**
    (`#extub-corkboard`/`#panel-extub-tabs`, mismo `core/corkboard.js` de
    siempre — `extubacion-puma.js` es el primer módulo de UCI/Papers
    Tuiter con calculadoras propias, siguiendo el patrón `calcXxx()`/
    `init()` ya establecido en Nefrología/Cardiología, nunca usado antes en
    este submenú): Introducción y evaluación del riesgo (10 recomendaciones
    clave, Tabla 1 de precondiciones, Tabla 2 de factores de riesgo, las 4
    preguntas que enlazan evaluación con estrategia), El algoritmo de
    extubación (las 3 preguntas encadenadas del algoritmo real —Fig. 2— y
    las 5 estrategias posibles, con un **simulador interactivo** que
    reproduce su lógica esencial — 3 `<select>` que recalculan en vivo la
    estrategia sugerida, reutilizando `.tfg-estado-ok/warn/danger`),
    Extubación de secuencia protectora (análoga a la secuencia rápida de
    intubación, Tabla de componentes de la Fig. 3), Catéteres de
    intercambio de vía aérea y checklist (tasas reales de éxito 87%/92%,
    Fig. 4 recreada como lista de 5 bloques), Secuencia de extubación
    despierta (Fig. 5 recreada como tabla de 8 pasos, más el detalle de
    posicionamiento/nivel de consciencia despierto-vs-profundo), y
    Laringoespasmo (manejo inicial/refractario con un **selector
    interactivo** de dosis reales de propofol/succinilcolina/rocuronio,
    más los 2 avisos críticos de la guía sobre bradicardia y obstrucción
    persistente), Complicaciones y conversión de vía aérea (EPPN, mordedura
    del tubo, y la distinción conversión-vs-reemplazo).
  - **Sin figuras extraídas como imagen**: las 6 figuras del artículo
    (Fig. 1-6) son infografías de marca (Universal Airway Guidelines,
    licencia CC-BY-NC-ND) con texto denso pensadas para imprimirse en A3 —
    mismo criterio ya aplicado en el resto del proyecto a flujogramas/
    tablas fácilmente tabulables: se recrearon íntegras como
    `.data-table`/`kv-row`/listas ordenadas/selectores interactivos nativos
    en vez de incrustarlas como imagen de baja legibilidad en móvil.
  - **10 preguntas de opción múltiple + 4 de redactar**
    (`js/data/extubacion-puma-preguntas.js`, `extub-q001`-`q014` — el
    "estándar reducido" ya fijado para papers de este submenú desde
    VD-LRA/VExUS), con `triggerId: 'btn-extub-repasar'` añadido al array
    que ya exporta `uci-papers/index.js`. El banco combinado de toda la
    app queda en <strong>1063 preguntas</strong> (1049 previas + 14).
  - Bibliografía: una única entrada enlazando al PDF en `docs/`.
- **Sexto paper: "Toxicidad sistémica por citrato en TRR continua"**
  (`js/modules/uci-papers/citrato-trr.html`). Fuente: Redant S, Attou R,
  Talpos MT, Honoré PM. Systemic Citrate Toxicity During Regional Citrate
  Anticoagulation for Continuous Kidney Replacement Therapy. J Clin Med.
  2026;15:6564. PDF completo subido a
  `docs/redant-2026-toxicidad-citrato-trr.pdf`. Séptimo botón del submenú
  de papers (`#btn-paper-citrato`), con `uciLevel` ganando una sexta
  entrada (`citratoTrr`).
  - **Hallazgo de la comprobación previa**: la ficha "Anticoagulación de la
    TRR" del módulo TRR de Nefrología (`trr.html`, `trr-anticoagulacion`)
    ya mencionaba el citrato como técnica de anticoagulación regional
    estandarizada con su mecanismo básico de quelación del calcio, pero sin
    desarrollar su principal complicación metabólica — exactamente el
    contenido íntegro de este paper. Se añadió un cross-link real en
    ambas direcciones (ver más abajo), sin duplicar ningún párrafo ya
    escrito en `trr.html`.
  - **Cuaderno de campo de 5 fichas**
    (`#citrato-corkboard`/`#panel-citrato-tabs`, `citrato-trr.js` con su
    propia calculadora, mismo patrón nuevo que estrenó el paper de
    extubación en este submenú): Fisiología del citrato y su balance (el
    cambio de paradigma central del artículo — la acumulación sistémica ya
    no se entiende como fallo hepático aislado, sino como aporte de
    citrato &gt; capacidad metabólica+extracorpórea combinada, con el
    balance de la Fig. 1 recreado como `.data-table`), Factores de riesgo y
    perfil bioquímico (shock circulatorio como determinante principal,
    "sobrecarga de citrato" vs. acumulación verdadera, Tabla 2 del perfil
    bioquímico completo), Diagnóstico y monitorización (con una
    **calculadora interactiva del ratio T/iCa** —`calcRatioTiCa()`, calcio
    total/calcio iónico, semáforo por el umbral &gt;2,5/&gt;3,0 reutilizando
    `.tfg-estado-ok/warn/danger`, con el guard `.value === ''` ya
    establecido como lección aprendida en las auditorías de FRA/ERC para no
    tratar un campo vacío como 0—, Tabla 4 de parámetros de monitorización,
    y el algoritmo diagnóstico de la Fig. 2 recreado como secuencia
    `kv-row`), Manejo escalonado y controversias (los 8 pasos del algoritmo
    de la Fig. 3, los hallazgos que apoyan discontinuar la RCA, y las 4
    controversias actuales del artículo como acordeón `micro-prof-item`), y
    Marco integrado y dónde más aparece (síntesis + el cross-link hacia
    Nefrología).
  - **Sin figuras extraídas como imagen**: las 5 figuras del artículo
    (Fig. 1-5) son diagramas conceptuales generados con IA y validados por
    los autores (declarado explícitamente en el propio artículo), no fotos
    clínicas — mismo criterio que el resto del proyecto: recreadas como
    `.data-table`/`kv-row`/calculadora nativos.
  - **Cross-link real en ambas direcciones** (mismo mecanismo
    `.especialidad-link`+`irAFicha()` ya generalizado a 3 especialidades):
    un botón en `trr-anticoagulacion` (Nefrología) apunta a
    `citrato-diagnostico` de este paper, y un botón en la Ficha V de este
    paper (`citrato-conclusiones`) apunta de vuelta a
    `trr-anticoagulacion` — verificado que ninguno de los dos usa `.tx-link`
    (que colisionaría con el listener global de `nefrologia/index.js`,
    mismo riesgo ya documentado y evitado en Vías Urinarias↔Nefrología).
  - **10 preguntas de opción múltiple + 4 de redactar**
    (`js/data/citrato-trr-preguntas.js`, `citrato-q001`-`q014`, mismo
    estándar reducido), con `triggerId: 'btn-citrato-repasar'`. El banco
    combinado de toda la app queda en <strong>1077 preguntas</strong>
    (1063 previas + 14).
  - Bibliografía: una única entrada enlazando al PDF en `docs/`.
  - **Nueva convención de resaltado por color**: a petición explícita del
    usuario ("con palabras resaltadas en diferentes colores para facilitar
    el estudio"), se añadieron variantes de color al rotulador `.hl` ya
    existente (`css/components.css`): `.hl-verde`/`.hl-rojo`/`.hl-azul`/
    `.hl-purpura`, mismo trazo de "subrayador" que `.hl` pero reutilizando
    los 5 acentos ya existentes de la paleta (nunca colores nuevos ajenos
    al sistema de diseño) para codificar semánticamente el tipo de dato
    resaltado — rojo para valores de riesgo/alarma, verde para
    normal/seguro, azul para mecanismos/conceptos clave, púrpura para
    definiciones. Usado extensamente en ambos papers nuevos (extubación y
    citrato). Si se necesita en el futuro, es el patrón a reutilizar en vez
    de introducir un nuevo esquema de resaltado.
  - Verificado con Playwright ambos papers: las 12 fichas nuevas (7+5)
    abren/voltean sin error de consola ni 404 real; la calculadora del
    algoritmo de extubación devuelve las 5 estrategias correctas según la
    combinación de respuestas; el selector de laringoespasmo cambia entre
    manejo inicial/refractario; la calculadora T/iCa calcula correctamente
    (2,60/0,85 = 3,06, estado danger) y se abstiene con campos vacíos sin
    tratarlos como 0; los cross-links citrato↔TRR funcionan en ambas
    direcciones; ambos bancos de quiz (14+14 preguntas, incluidas las 8 de
    redactar) se recorren sin excepciones JS; sin overflow horizontal a
    390px. Bump de cache-busting a `?v=20260827-3` por el cambio en
    `components.css` (clases `.hl-*`).

