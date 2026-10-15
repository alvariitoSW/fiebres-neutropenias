# Historial · Libros: índice central y Marino caps. 1-11 y 31-53

> Texto movido tal cual desde el antiguo `CLAUDE.md` (octubre 2026). Es la historia de cómo se construyó
> esta parte: decisiones, fuentes, auditorías y verificaciones. Las reglas vigentes están en `CLAUDE.md`.

### Libros

Sexta puerta de la raíz (`#btn-libros`), a petición explícita del usuario ("como tengo el merino dividido en varios
bloques... habría que crear una sección nueva llamada libros, y ahí tener el libro azul y luego el marino. Mantener
como está todo pero... generar un sitio centralizado para buscar las partes de esos libros y ya después subir el
contenido, sobre todo mostrándolo de manera visual"). **No mueve nada**: los capítulos ya construidos siguen en su
especialidad (Merino HEMATO, Merino Cardiología, Merino Neumología, Fisiopatología UCI); Libros solo los indexa y
lleva a ellos. Mismo patrón de dos niveles que el resto (`librosLevel` en `js/modules/libros/index.js`, con
`{ menu, marinoFundamentos }`; registrada en `main.js` y en `topLevel`/`BOTONES_ESPECIALIDAD` de `home/index.js`).

- **Corrección de atribución, ya aplicada antes de esta sección**: el libro que la app llamaba "Marik, *Handbook of
  Evidence-Based Critical Care*" es en realidad **Marino PL, *The ICU Book*, 5.ª ed.** Se renombraron los PDF de
  `docs/` (`marino-2024-*.pdf`) y se corrigieron las citas de Merino HEMATO/Cardiología/Neumología. Los nombres de
  módulo "Merino …" se dejan tal cual (son nombres internos que el usuario ya usa); las menciones históricas a
  "Marik" que quedan en este archivo describen el estado anterior a la corrección.
- **Índice central** (`libros-menu.html` + `indice.js`, datos puros en `js/data/libros-indice.js`): una pestaña por
  libro, un buscador de capítulos (por título en español o inglés, sección o nombre de ficha), una **tira de
  capítulos** coloreada por dónde vive cada uno (con leyenda; las secciones sin PDF salen como "⏳"), y la lista por
  secciones: cada capítulo con su título original, dónde vive, un botón por ficha (`[data-especialidad]` normal,
  resuelto por el listener único de `home/index.js`) y un enlace al PDF con `#page=N`. Para añadir un capítulo o un
  libro nuevo, solo se toca `libros-indice.js` (`fichas` usa las mismas claves que cualquier enlace cruzado). Los
  títulos de las secciones V, VIII y IX de Marino no se han podido comprobar en los PDF y se dejan en blanco.
- **Marino · Fundamentos (caps. 1-11)** (`marino-fundamentos.html`/`.js`), el único contenido propio de Libros,
  porque no encaja en ninguna especialidad: 3 PDF nuevos en `docs/` (`marino-2024-acceso-vascular-practicas-caps1-4`,
  `-practicas-monitorizacion-caps5-9`, `-fluidoterapia-caps10-11`). Cuaderno de campo de **23 fichas** (modo
  compacto, >12), dos o tres por capítulo: catéteres y flujo, periféricos y centrales, ecoguiada e intraósea (Cap.
  1); CVC: indicaciones y sitio, complicaciones inmediatas y punta (Cap. 2); el catéter permanente, bacteriemia por
  catéter (Cap. 3); microbioma y descontaminación, úlcera de estrés (Cap. 4); tromboprofilaxis: riesgo y fármacos,
  mecánica y por escenario (Cap. 5); analgesia, sedación (Cap. 6); oximetría, capnografía (Cap. 7); catéter de
  arteria pulmonar, termodilución y parámetros (Cap. 8); transporte de O₂, extracción y lactato (Cap. 9);
  cristaloides, coloides (Cap. 10); retorno venoso y sobrecarga, hipoperfusión y respuesta a fluidos (Cap. 11).
  - **39 imágenes reales** (`js/modules/libros/img/mar-fig*.jpg`): fotos, ecografías, radiografías, microscopía y los
    esquemas que no se pueden tabular. Los gráficos de barras/líneas se recrearon como tabla (con "lectura
    aproximada" cuando la fuente no imprime la cifra).
  - **14 calculadoras** (`marino-fundamentos.js`, guard `.value === ''`): French→mm (Tabla 1.1), ¿profilaxis de
    úlcera de estrés? (Tabla 4.2), dosis de tromboprofilaxis por fármaco/ClCr/IMC (Tablas 5.2-5.3, avisa en el tramo
    en que la tabla y el texto discrepan para el fondaparinux), BPS, RASS objetivo, propofol (µg/kg/min, umbrales del
    síndrome de infusión y kcal/día), oximetría dual, índices del catéter de arteria pulmonar (Tabla 8.1, con avisos
    de combinación no fisiológica), CaO₂, extracción (Tabla 9.4), cristaloide necesario para reponer un déficit de
    plasma (40/36 mL/kg, 20% en plasma), ScvO₂ + gap de PCO₂ (Tabla 11.2), VVS, y respuesta a fluidos (EPP ≥10% /
    sobrecarga >10%, con los avisos de dolor y presión intraabdominal).
  - **3 simuladores** (SVG): aporte-consumo de O₂ (Figura 9.3; el VO₂ de 130 mL/min/m² y la SaO₂ de 98% son
    ilustrativos), adónde va lo que se infunde (Figura 10.1, escalado en proporción al volumen) y la curva de retorno
    venoso (Figura 11.2, Rv constante y Pms normal de 7 mmHg, con la que 1 mmHg de PAD quita 1/7 ≈ 14%, como dice la
    fuente). En la vista Visual de la Ficha I hay además un Hagen-Poiseuille (r⁴/L).
  - **Notas de fidelidad** (erratas de la fuente, reproducidas tal cual): IO en fémur/tibia, columnas de la Tabla
    2.2, unidad de la CMI de vancomicina, cortes renales del fondaparinux, "Tabla 5.3" por 5.2, ketamina µg/h,
    haloperidol (tabla frente a texto), rangos de DO₂/VO₂/SvO₂ entre capítulos, P50 27 (Marino) frente a 22,5 (El
    Libro Azul), "metabolismo aerobio" donde debe ser anaerobio y la Ecuación 11.3/11.4 (Cap. 11). La VCI: Marino la
    da por poco fiable y el Manual UMI (FATE) la usa — nota de fuentes con enlace.
  - **Enlaces cruzados** (12) hacia Manual UMI, Merino Cardiología/Neumología, Fisiopatología UCI y VExUS.
  - **Vista Visual** de las 23 fichas (`visual-marino.js`, recetas del kit, casi todos los nodos por `#id`; las
    calculadoras y los simuladores se conectan, nunca se copian).
  - **138 preguntas** (`js/data/marino-fundamentos-preguntas.js`, 5 de opción múltiple + 1 de redactar por ficha),
    asignatura "Libros"; el botón "🎯 Repasar" abre directamente la lista de fichas del bloque. Banco total de la
    app: 2069.
- CSS con prefijo `lib-` y `.fuente-ficha`; regla genérica nueva `.form-group input[type="range"]` (ancho completo y
  color de la app). El buscador global indexa Libros (`PANEL_NAV['panel-marino-fund-tabs']`).
- Verificado con Playwright (390 y 360 px): las 23 fichas abren con su panel activo, las 39 imágenes cargan, las 23
  vistas Visual se construyen sin fuentes sin resolver, las calculadoras dan los valores esperados (p. ej. 5 Fr →
  1,65 mm; enoxaparina con IMC 45 → 40 mg/12 h; propofol 40 mL/h en 70 kg y 60 h → 95 µg/kg/min, riesgo), los 12
  enlaces cruzados y los botones del índice (muestra de 6 especialidades) abren su ficha, el quiz recorre las 138
  preguntas sin errores, y no hay desbordamiento horizontal. Cache-busting `?v=20261020`.
- **Auditoría y mejoras (octubre 2026)**, a petición explícita del usuario: primero un informe (Artifact
  «Auditoría Marino Fundamentos»: 4 errores, 5 faltas de contenido, 5 problemas y 8 mejoras, cotejando los 3 PDF
  con las fichas) y después «aplica las mejoras… pon todas las fotos que hay en los documentos y mejora el apartado
  visual». Las fichas se generan desde fragmentos con un script de montaje que vive fuera del repo; si se retocan a
  mano, editar `marino-fundamentos.html` directamente.
  - **Todas las figuras**: 20 más extraídas (`pdfimages -png`, imagen única por página), 59 en total, cada una con
    id `mar-img-N-M` junto a su texto. Solo quedan fuera dos tablas impresas como imagen (Tablas 3.3 y 10.2), ya
    recreadas como tabla.
  - **Vista Visual**: tipo de panel nuevo en el kit, `figuras` (`todas: true` o `nodos` con ids): las figuras de la
    ficha en una tira deslizable, ampliables (lightbox) y con «Texto ↓». Va primero en las 23 recetas
    (`FIGURAS` en `visual-marino.js`); un panel sin figuras no se pinta. En el kit, un resultado copiado con color de
    estado ya no lleva un segundo marco (afecta a todas las vistas Visual de la app).
  - **Errores corregidos**: la úlcera de estrés ya no muestra puntos inventados (panel propio `ulceraNiveles`: los 4
    niveles de la Tabla 4.2, con sus casillas reales y la línea de la profilaxis); la Figura 11.3 ya no se presenta
    como leída a ojo; nota de fidelidad French (ecuación frente a Tabla 1.1); el buscador del índice busca también
    en el texto de las fichas (desde 3 letras, marca la ficha que coincide) y, sin resultados, ofrece el buscador
    global con la misma consulta.
  - **Índice**: títulos de sección en español con el original al lado (la VIII, «Respiratory Disorders», sale de la
    última página del PDF de los caps. 18-21; V y IX siguen sin título); pestañas con `aria-selected`/
    `aria-controls`; **botón «Repasar … entero»** por libro (Marino: 562 preguntas en 4 bloques; El Libro Azul: 301);
    **progreso de Modo Estudio** por capítulo (punto en la tira, pomodoros por capítulo), leído con
    `progresoEstudio()`, export nuevo de `core/pomodoro.js`, que además emite `estudio-progreso` al guardar. Sin
    persistencia nueva.
  - **Quiz**: `data-quiz-bloques="Asignatura::Bloque|…"` (+ `data-quiz-titulo`) abre una lista de bloques de varias
    asignaturas a la vez; los bloques de cada libro están en `quiz` de `libros-indice.js`.
  - **Enlaces**: `data-pulsar="id1 id2"` en el enlazador único (`home/index.js`) pulsa botones de navegación tras
    saltar (para vistas sin cuaderno de campo; hoy, la calculadora de catéter de Neutropenia Febril). Enlaces de ida
    nuevos (Hagen-Poiseuille, bacteriemia por catéter, tromboprofilaxis → embolia pulmonar, P50 → curva interactiva
    de El Libro Azul, salino → ácido-base) y **de vuelta** desde Técnicas R1 (6), Neutropenia Febril, Trasplante,
    Manual UMI (sedación), Merino Neumología, Merino Cardiología y Fisiopatología UCI (Hematología y Cardiología).
  - **Calculadoras**: el catéter de arteria pulmonar evalúa también PVC, enclavamiento y SvO₂; notas cruzadas entre
    las dos calculadoras de extracción (cortes del Cap. 7 y del Cap. 9); el CaO₂ ya no usa un semáforo sin fuente
    (clase nueva `tfg-estado-neutro`). Nuevas: hemocultivos pareados y duración del antibiótico (Cap. 3), dosis de
    paracetamol y ketorolaco (Tabla 6.3), haloperidol paso a paso (`initSiNoWizard`, Tabla 6.8), «¿por qué está alto
    el lactato?» (Tabla 9.5; mecanismo solo donde el capítulo lo da) y déficit de volemia frente a signos (Cap. 11).
  - **Buscador global**: una ficha con muchas apariciones del término puntúa más que una mención de pasada, y los
    grupos de especialidad se ordenan por su mejor resultado.
  - Verificado con Playwright (390 y 360 px): 59 imágenes cargan, 23 vistas Visual sin fuentes sin resolver, 56
    enlaces que entran o salen de Marino llegan a su ficha, las calculadoras dan lo esperado, el repaso por libro
    recorre preguntas sin errores; sin desbordamiento (se envolvieron las Tablas 5.2 y 5.3). Cache-busting
    `?v=20261021`.

- **Marino · caps. 31-44** (octubre 2026), a petición explícita del usuario («vamos a continuar con los siguientes
  capítulos en el apartado de merino, y que se incluyan todas las imágenes»). Dos bloques más de Libros, junto a
  Fundamentos y con el mismo patrón (vista propia en `librosLevel`, botón en el `.constellation` de
  `libros-menu.html`, cuaderno de campo en modo compacto, vista Visual, calculadoras y quiz):
  - **Marino · Ácido-base, renal y electrolitos (caps. 31-38)** (`marino-renal.html`/`.js`, vista
    `#marino-renal-view`, clave `marinoRenal`, panel `panel-marino-renal-tabs`, prefijo de ids `mr-`): 23 fichas —
    análisis ácido-base y gaps (Cap. 31), lactato/bicarbonato y cetoacidosis (32), alcalosis metabólica (33), fracaso
    renal agudo y TRR (34), osmolalidad, hiper e hiponatremia (35), potasio (36), magnesio (37), calcio y fósforo (38).
  - **Marino · Abdomen y temperatura (caps. 39-44)** (`marino-abdomen.html`/`.js`, vista `#marino-abd-view`, clave
    `marinoAbdomen`, panel `panel-marino-abd-tabs`, prefijo `ma-`): 17 fichas — fallo hepático agudo, encefalopatía,
    varices, PBE y síndrome hepatorrenal (39), pancreatitis (40), colecistitis alitiásica, *C. difficile* e infección
    intraabdominal (41), ITU por sonda y candiduria (42), calor, hipertermias por fármacos e hipotermia (43), fiebre en
    la UCI, infecciones nosocomiales/hemocultivos y antipiréticos (44).
  - **PDF** en `docs/`: `marino-2024-acido-base-renal-caps31-34.pdf`, `-electrolitos-caps35-38.pdf` y
    `-abdomen-temperatura-caps39-44.pdf` (página del PDF = página citada en `#page=N`). **44 imágenes** reales
    (`js/modules/libros/img/mar-fig31…44-*.jpg`, ids `mar-img-NN-M`). Las tablas, recreadas como tablas; la Tabla 39.1
    se comprobó contra la imagen de la página (el orden de `pdftotext` engaña en tablas de dos columnas).
  - **~45 calculadoras y 3 asistentes** (`initSiNoWizard`: tipo de diabetes insípida, PBE, *C. difficile*), con el
    guard `.value === ''`; las de checkboxes (hiperpotasemia ficticia, paquete de varices, criterios de SHR) se
    conectan en la vista Visual como panel `requisitos`. Fórmulas y cortes, los de la fuente.
  - **Notas de fidelidad/interpretación** (erratas de la fuente reproducidas tal cual, todas en la propia ficha): EFNa
    ">12%" de la Tabla 34.4 (el texto dice >2%; la calculadora usa el texto), hematíes 0,7% de la Tabla 37.1, rango
    "0,5-1 mmol/L" de la hipomagnesemia leve, calcio iónico "<1,7 mmol/L" y ">3,0/3,5 mmol/L", "Na 4,0 mEq/L" del
    fosfato (mEq/mL), pamidronato tabla frente a texto, "sevelamer gluconato", NaCl 3% "153", tiazidas e
    "hypernatremia", ceftriaxona 1 frente a 2 g, el TIPS "transesofágico no invasivo", presión intraabdominal en
    cmH₂O (Caps. 39-40) frente a mmHg (Cap. 34), mortalidad global de la pancreatitis, "respiradone"/"Amantidine",
    fentanilo/linezolid "SNM", "hipertermia moderada", hipotensión 20% frente a 18%, referencia 21/22 de la Tabla
    44.4, paracetamol 3 g (Cap. 44) frente a 4 g (Cap. 6), "fidaxomycin", "Warner-Jauregg". **Comparativas de fuentes**
    con Nefrología (Δ-ratio, FENa/IFR, calcio corregido, hiponatremia), Manual UMI (reposición de Mg y P por peso) y
    Neutropenia Febril (tiempo diferencial).
  - **Vista Visual** de las 40 fichas en `visual-marino-caps31-44.js` (`initVisualMarinoCaps31a44()`): figuras
    primero, calculadoras conectadas, matriz de espectro de la Tabla 41.3, barras de las Tablas 35.1/37.1/44.4.
    Los asistentes no se duplican: un panel `propio` lleva a ellos en la vista Texto.
  - **Enlaces cruzados** (55, todos `[data-especialidad]`) hacia Nefrología, Merino HEMATO/Cardiología, Manual UMI,
    Fisiopatología UCI, Hematología (lisis tumoral, antifúngicos), UCI Papers (citrato, VExUS) y Fundamentos.
  - **Índice y buscador**: secciones X-XIII de Marino en `libros-indice.js` (XIV en adelante, pendiente);
    `PANEL_NAV` del buscador ampliado con los dos paneles.
  - **Quiz**: `js/data/marino-renal-preguntas.js` (138, `mr-q001`-`q138`) y `marino-abdomen-preguntas.js` (102,
    `ma-q001`-`q102`), 6 por ficha (5 de opción múltiple + 1 de redactar), bloques "Marino · Ácido-base, renal y
    electrolitos (caps. 31-38)" y "Marino · Abdomen y temperatura (caps. 39-44)" de la asignatura Libros (+240 al banco
    total). Repaso "Marino entero" desde el índice: 6 bloques.
  - Bug corregido al verificar: un id duplicado (`mr-osm-medida` en el `<dl>` y en el `<input>`) dejaba la
    calculadora de osmolalidad sin leer la osmolalidad medida.
  - Verificado con Playwright (390 y 360 px): las 40 fichas abren con su panel activo, las 44 imágenes cargan, las 40
    vistas Visual se construyen sin fuentes sin resolver, ~40 calculadoras dan los valores esperados (p. ej. hiato
    corregido 32,3; déficit de cloro 280 mEq → 1,8 L; EFNa 0,14%; Na corregido 142), los 3 asistentes llegan a su
    resultado, los 40 botones del índice y los 55 enlaces cruzados llegan a su ficha, los dos bancos se recorren
    enteros (138 y 102) sin entidades ni `undefined`, el buscador encuentra las fichas nuevas, sin desbordamiento ni
    errores de consola. Cache-busting `?v=20261022`.
- **Revisión de Marino 31-44 aplicada (octubre 2026)**, a petición explícita del usuario («aplica todo lo indicado en
  la última revisión de marino 31-44»; informe: Artifact «Revisión Marino 31-44»).
  - **Relectura independiente**: 3 lectores (uno por PDF) compararon frase a frase fuente y fichas; cada hallazgo se
    comprobó contra el PDF antes de tocar nada. Dos hallazgos de los lectores resultaron falsos y **no** se aplicaron:
    el «punto 4» de la Tabla 32.3 sí está en la fuente, y la nota de las Ecuaciones 31.7/31.8 era la que estaba mal
    (se quitó: los rótulos de la fuente son correctos). Corregido:
    - la Tabla 36.3 (el cloruro cálcico va en «Estabilizar el corazón») y la Tabla 44.2 (ictus isquémico entre las
      más frecuentes; 8 y 8);
    - calculadoras:
      - CAD: la pauta de K⁺ de la Tabla 32.4 (20 o 10 mEq/h) y, con glucosa ≤250, la diferencia entre el ingreso
        (euglucémica) y la fase de descenso;
      - reposición de Mg: sin protocolos con Mg ≥1,4;
      - selector de alcalosis: mide el Mg antes del K⁺;
      - golpe de calor: solo con ≥41 °C, y el tramo 39-41 °C queda sin asignar;
    - frases de calculadora sin fuente (peritonitis secundaria, umbral de triglicéridos, «cristaloide sin calcio»,
      ECG en la ficticia, gravedad del calcio iónico, recalentamiento por grados) reescritas o marcadas;
    - unos 25 huecos menores añadidos, entre ellos:
      - Cl⁻ urinario <15/>25;
      - conducta ante la hiperpotasemia ficticia;
      - rabdomiólisis como causa de salida de K⁺;
      - vigilar el fosfato en la nutrición parenteral;
      - ejemplos de las Reglas 3 y 4;
      - 275.000 ingresos por pancreatitis;
      - nota de fuentes sobre la candiduria (caps. 42 frente a 44);
      - plazos de la Fig. 42.2 (sus cifras vienen impresas: ya no es «lectura aproximada»).
  - **Textos**:
    - las 35 notas de fidelidad/interpretación son ahora `<details class="nota-plegable">` (plegadas;
      `irAlTexto()` de `core/vista-visual.js` despliega cualquier `<details>` que contenga la línea de destino);
    - las referencias «Ficha N» pasan a nombres o botones;
    - las «comparativas de fuentes» de hiponatremia, hiperpotasemia, calcio e índices del FRA son tablas
      (`.comparativa-fuentes`, Marino frente a Nefrología);
    - nuevos: enlace de los biomarcadores a FRA · Predicción y una tabla resumen en «Alcalosis: tratamiento»;
    - rótulos de capítulo entre las filas del cuaderno de campo (`.corkboard-grupo`, generados por `build2.py`,
      genéricos para cualquier cuaderno);
    - índice: la sección IX es «Respiratory Management» (comprobado en la pág. 55 del PDF de los caps. 22-26); la V
      sigue sin título.
  - **Vista Visual**:
    - piezas a medida en `js/modules/libros/visual-marino-piezas.js` (paneles `propio`): curva pH-[H⁺], mapa de la
      gasometría con las líneas de compensación de la ficha, iceberg del potasio con la Tabla 36.1 (usa
      `deficitK()`, exportada de `marino-renal.js` y compartida con la calculadora), escala de la hipermagnesemia,
      lipasa frente a amilasa;
    - con el kit (nuevas tablas en el texto para que la imagen las lea): regla de temperatura (`linea`, en 3 fichas),
      fuentes de fiebre sobre la silueta (`mapa`; órgano nuevo `esternon` en `core/silueta.js`), barras de las
      Figuras 44.3 y 44.5, matriz de rasgos de las hipertermias por fármacos;
    - la Tabla 37.1 se dibuja sin «Total» (`excluir`).
  - **Interactivo**:
    - gasometría encadenada: el HCO₃⁻ de la primera calculadora pasa a la del hiato aniónico;
    - los 3 asistentes Sí/No dentro de la vista Visual (otra instancia de `initSiNoWizard` con el mismo árbol
      exportado);
    - simulador de bolos de salino al 3% frente a los límites (las subidas son ilustrativas);
    - reto de volumen que escribe en la calculadora de respuesta a fluidos de Fundamentos;
    - semáforo de antibióticos que lee la Tabla 41.3 y marca las casillas reales;
    - accesos a la nefrona viva (ATR, diarrea, diuréticos, FRA, hiperparatiroidismo). `panelNefronaViva()` lleva ahora
      `data-especialidad="nefrologia"` y funciona desde cualquier especialidad.
  - **Quiz**: 6 preguntas que cruzan capítulos (`mr-q139`-`q141`, `ma-q103`-`q105`).
  - Verificado con Playwright (390 y 360 px): las 40 fichas y sus vistas Visual sin fuentes sin resolver ni errores;
    cada pieza nueva responde (p. ej. K⁺ 3,0 en 70 kg → 175 mEq y 2 bloques huecos; Mg 6 → marca y bloqueo AV de
    1.er grado; 3 bolos de 2 mEq/L en 1 h → aviso de >5 en 2 h; VS 55→70 → responde; semáforo con Pseudomonas →
    pip-tazo y meropenem en verde); los accesos a la nefrona viva abren la situación desde Libros; sin desbordamiento.
    Cache-busting `?v=20261023`.

- **Marino · caps. 45-53 y apéndices (octubre 2026)**, a petición explícita del usuario («Esto es lo que nos queda del
  merino»). Con esto, *The ICU Book* entero está en la app. Tres bloques más de Libros, con el mismo patrón que
  31-44 (vista propia en `librosLevel`, botón en el `.constellation` de `libros-menu.html`, cuaderno de campo con
  rótulos por capítulo, vista Visual, calculadoras y quiz). Las fichas se generan desde fragmentos con un script de
  montaje fuera del repo; si se retocan a mano, editar el `.html` del bloque directamente.
  - **Marino · Neurología (caps. 45-47)** (`marino-neuro.html`/`.js`, vista `#marino-neuro-view`, clave
    `marinoNeuro`, panel `panel-marino-neuro-tabs`, prefijo `mn-`): 14 fichas — consciencia alterada, delirio,
    abstinencia alcohólica, coma y su exploración, muerte encefálica (45); convulsiones, estado epiléptico, miastenia,
    Guillain-Barré y neuromiopatía crítica, bloqueo neuromuscular y su reversión (46); ictus isquémico (medidas
    generales; antitrombóticos y complicaciones), hemorragia intracerebral y subaracnoidea (47).
  - **Marino · Nutrición y endocrino (caps. 48-51)** (`marino-nutricion.html`/`.js`, `#marino-nutri-view`,
    `marinoNutricion`, `panel-marino-nutri-tabs`, `mu-`): 14 fichas — gasto energético, sustratos y balance
    nitrogenado, tiamina, vitaminas y oligoelementos (48); nutrición enteral: indicaciones, fórmulas, pauta y sonda,
    complicaciones (49); NPT: soluciones, paso a paso, complicaciones y realimentación (50); CIRCI, tiroides y
    tirotoxicosis, hipotiroidismo y coma mixedematoso (51).
  - **Marino · Tóxicos y apéndices (caps. 52-53)** (`marino-toxicos.html`/`.js`, `#marino-tox-view`,
    `marinoToxicos`, `panel-marino-tox-tabs`, `mt-`): 11 fichas (modo cajón, ≤12) — paracetamol y nomograma,
    NAC y hemodiálisis, benzodiacepinas y betabloqueantes, opioides, salicilatos (52); CO, cianuro, etilenglicol y
    metanol (53); Apéndice 1 (unidades y conversiones), 2 (valores de referencia) y 3 (el cuerpo fantástico).
  - **PDF** en `docs/`: `marino-2024-neurologia-caps45-47.pdf`, `-nutricion-endocrino-caps48-51.pdf` y
    `-toxicologia-caps52-53-apendices.pdf` (página del PDF = `#page=N`). **31 imágenes** reales
    (`mar-fig45…51-*.jpg`, `mar-apx*.jpg`); las tablas, recreadas como tablas.
  - **~50 calculadoras y 2 asistentes** (`initSiNoWizard`: estado epiléptico `mn-se-wizard`, naloxona IV
    `mt-nal-wizard`), con el guard `.value === ''`. Entre ellas: CAM-ICU, GCS, test de apnea, estado epiléptico por
    peso, reversión de anticoagulantes (andexanet: pauta alta si se cumple cualquier criterio de la Tabla 47.5), PPC,
    GER/CR/balance nitrogenado, pauta enteral y NPT paso a paso (restan el propofol), cortisol/ACTH, equivalencia de
    corticoides, patrón tiroideo, nomograma de Rumack-Matthew (rectas en escala log entre los extremos del texto),
    NAC IV, salicilatos, COHb (semividas 74/320 min), simulador de la PO₂ venosa con COHb (Figura 53.1, ilustrativo),
    cianuro, fomepizol, conversiones de unidades, French/gauge, radiación, IMC (bandas de la OMS: el apéndice no da
    cifras), PEF de Leiner y volemia. Ningún semáforo con cortes sin fuente (PEF y radiación, neutros salvo el límite
    de la EPA).
  - **Notas de fidelidad/interpretación/fuentes** (plegables): "GCS ≤6 frente a ≤5", lorazepam y levetiracetam
    texto frente a Tabla 46.3, rocuronio 50-70 frente a 30-70 min, idarucizumab "2,5 mg" (son g) y desmopresina
    "3 µg/kg" (0,3), solapamiento de la Tabla 47.5, "7% de 696.000" (676.000), convulsiones tras ictus 2-5% (Tabla 46.1)
    frente a ~20% (Cap. 47), CAM-ICU frente al de El Libro Azul, Ecuación 48.1 sin unidades, lípidos 1,5 (Cap. 48)
    frente a 2,5 g/kg/día (Tabla 50.2), proteínas 1,2-1,6 (Tabla 49.4) frente a 1,2-2,0, D5 "70 kcal/L", 9 aminoácidos
    esenciales con 8 nombrados, Clinolipid® y los "triglicéridos de cadena media", unidades del Multi-Trace, Tabla
    50.5/49.6 descolocada, TSH en mU/mL o mU/dL, propranolol IV 60-80 mg (es la oral), Ecuación 53.2 (Fe²⁺), erratas
    del Apéndice 1, tablas de PEF desplazadas 5 pulgadas (la calculadora usa las ecuaciones), 16 G con 0,040″, y
    "Hiraguchi". Ferritina: cortes <18 / >100 µg/L sacados del Cap. 48.
  - **Vista Visual** de las 39 fichas en `visual-marino-caps45-53.js` (`initVisualMarinoCaps45a53()`): figuras
    primero, calculadoras conectadas, los dos asistentes dentro de la vista (`asistenteVisual`).
  - **Enlaces cruzados** (38, `[data-especialidad]`) hacia Manual UMI (neurocrítico), Fisiopatología UCI, Merino
    Neumología/Cardiología, Nefrología, Eco cardíaca (`data-eco-vista="a4c"`) y los bloques 1-44 de Libros; de vuelta,
    del hiato aniónico (Cap. 31) a etilenglicol/metanol y salicilatos.
  - **Índice y buscador**: secciones XIV (Nervous System Disorders), XV (Nutrition & Metabolism), XVI (Overdoses &
    Poisons) y XVII (Appendices; capítulos `A1`-`A3`) en `libros-indice.js`. Solo la sección V de Marino sigue sin
    título comprobado. `PANEL_NAV` del buscador con los tres paneles. Repaso "Marino entero": 9 bloques.
  - **Quiz**: `marino-neuro-preguntas.js` (84, `mn-q001`-`q084`), `marino-nutricion-preguntas.js` (84, `mu-`) y
    `marino-toxicos-preguntas.js` (66, `mt-`), 6 por ficha (5 de opción múltiple + 1 de redactar). Banco total de la
    app: **2549** (2561 tras la revisión).
  - **Kit Visual**: `copiarResultados()` ya no copia un resultado oculto o vacío (antes dejaba una franja vacía en
    selectores y calculadoras aún sin datos; afecta a todas las vistas Visual).
  - **Bug corregido al verificar**: 3 ids duplicados (`mt-co-cohb`, `mt-nac-hd`, `mu-ti-tsh` en un `<dl>` y en su
    control) hacían que la copia de la calculadora en la vista Visual escribiera "undefined" (el texto del `<dl>` pasa
    a `*-txt`). Mismo fallo que `mr-osm-medida` en Cap. 35: **comprueba ids duplicados en cada bloque nuevo**.
  - Verificado con Playwright (390 y 360 px): las 39 fichas abren con su panel activo, las imágenes cargan, las vistas
    Visual sin fuentes sin resolver; calculadoras con valores esperados (nomograma 100 µg/mL a las 8 h → sobre la línea
    de tratamiento de 76; NAC 70 kg → 10.500/3.500/7.000 mg; COHb 12% fumador → alta; 8 mg/dL de Ca → 4 mEq/L; PEF
    varón 40 a/175 cm → 586 L/min); ningún NaN/undefined con todos los campos rellenos; los 2 asistentes llegan a su
    resultado; los 39 botones del índice y los 38 enlaces cruzados llegan a su destino; los tres bancos se recorren
    enteros sin entidades; el buscador encuentra las fichas nuevas; sin desbordamiento ni errores. Cache-busting
    `?v=20261024-2`.
- **Revisión de Marino 45-53 aplicada (octubre 2026)**, a petición explícita del usuario («Si, aplícalo»; informe:
  Artifact «Revisión Marino 45-53»).
  - **Relectura independiente**: 3 lectores (uno por PDF) cotejaron fuente y fichas; cada hallazgo se comprobó contra el
    texto antes de tocar nada.
  - **Correcciones de la app**:
    - la ferroptosis la desencadena la inflamación (no al revés);
    - pupilas (Tabla 45.4): la fila ya no inventa reactividades; el selector separa «pequeñas, reactivas» (encefalopatía
      metabólica), puntiformes reactivas (opiáceos) y no reactivas (lesión pontina), con nota de interpretación;
    - gancho del sugammadex (16 mg/kg es justo tras intubar; el bloqueo profundo, 4 mg/kg);
    - la cita de la HIC es la guía AHA/ASA 2015 (Hemphill); el objetivo de PA tras trombólisis usa ≥180/105;
    - nomograma con dosis repetidas: NAC si hay hepatotoxicidad con transaminasas altas (las dos cosas);
    - salicilatos: la calculadora clasifica el nivel (terapéutico/tóxico/amenaza la vida) y no propone alcalinizar en
      rango terapéutico;
    - metanol: el lactato sube por el mismo mecanismo y por el fórmico (no «más que con el etilenglicol»);
    - fomepizol cada 4 h solo si hace falta más de una sesión de diálisis; «&gt;4 g/día» de paracetamol;
    - tiamina: el gancho habla de los 100 mg/día habituales; la neuropatía sola no es uno de los 3 signos de sospecha;
    - tormenta tiroidea: el yodo también en el hipertiroidismo grave (opción nueva en la calculadora).
  - **Notas nuevas** (erratas o interpretación de la fuente): carnitina en µmol/L, glutatión con glutamato, Vital 1.0
    semielemental, ácidos grasos esenciales y máximo de lípidos (una sola nota de fuentes en Sustratos, enlazada desde
    la NPT), ziprasidona «solo IM», «6 variables» del latido, hora y media de O₂ frente a la semivida, lactato ≥10/&gt;10
    en el cianuro, Smoflipid que suma 95%, arginina de Optimental. Matiz del flumazenil (eventos mayores raros, p
    &lt;0,05).
  - **Enlaces**: CO → gafas nasales de alto flujo (Merino Neumología), radicales libres (Merino Cardiología),
    cooximetría (Fundamentos) y curva de la Hb (El Libro Azul); la «palabra final» de neurología → SDRA, FRA, shock
    séptico y post-parada; la de nutrición → microbioma (Fundamentos); realimentación → hipofosfatemia,
    hipomagnesemia e hipopotasemia de Nefrología. **Comparativas de fuentes** del delirio (Cap. 45, Cap. 6 y El Libro
    Azul) y de la hiperglucemia (Cap. 50 y Manual UMI).
  - **Vista Visual**: piezas nuevas en `visual-marino-piezas-45-53.js` (los ayudantes se exportan de
    `visual-marino-piezas.js`): cara con Glasgow y pupilas (escribe en la calculadora y en el selector), nomograma de
    Rumack-Matthew con el paciente (tocar el gráfico coloca horas y nivel), caída de la COHb con aire y O₂, bolsa de NPT
    (`bolsaNpt()`, exportada de `marino-nutricion.js` y compartida con la calculadora), escalera de la tiamina (lee la
    Tabla 48.4), alcalinización de la orina (fisiología general, pKa ≈3, marcada), pauta del fomepizol en el tiempo y
    matriz de antídotos de los caps. 52-53. Con el kit: línea de la primera semana del ictus, matriz con flechas de la
    Tabla 51.2, barras de la Tabla 52.2, CAM-ICU paso a paso (`CAM_WIZARD`) y accesos a la nefrona viva desde la
    realimentación. Kit: `.vk-resultado:empty` ya no deja un marco vacío (toda la app).
  - **Interactivo**: la NPT toma el peso de cálculo (real o ajustado) de la calculadora de energía; el asistente de la
    naloxona pasa la dosis eficaz a la perfusión (`alFinal` opcional en los nodos finales de `core/wizard.js`);
    buscador en los apéndices 1 y 2 (filtra filas y líneas). La reversión de la HIC ya usaba un solo peso e INR.
  - **Quiz**: 12 preguntas que cruzan capítulos (`mn-q085`-`q088`, `mu-q085`-`q088`, `mt-q067`-`q070`) y respuestas
    corregidas (glutamato, pupilas, ferroptosis, «más de 4 g»). Banco total: **2561**.
  - Bug corregido al verificar: el id `mrp-ph` ya lo usaba la curva de pH de 31-44 (ahora `mrp-alc-ph`).
  - Verificado con Playwright (390 y 360 px): las 39 vistas Visual sin fuentes sin resolver, NaN ni desbordamiento; cara
    de Glasgow, CAM-ICU, nomograma tocado (8 h, 90 µg/mL → por encima de 76), salicilatos 25 y 60 mg/dL, naloxona 4 mg →
    2,67 mg/h, NPT con 120/70 kg → 82,5 kg ajustado, antídotos → ficha y línea resaltada. Cache-busting `?v=20261025`.

Toda esta navegación la orquesta `modules/home/index.js`, que crea tres
`createViewSwitcher()` independientes (nivel principal — que ahora incluye
también `especialidades`, `pifMenu`, `cardiorrespiMenu`, `nefrologia`,
`uciPapers`, `fisioUci`, `cardiologia`, `neumologia`, `sobrevivirUmi`, `eco` y `libros` como
vistas más del mismo switcher raíz —,
submenú de
Citopenias, submenú de
Trasplante), inicializa el Atlas
(`initAtlas()` de `modules/home/atlas.js`) y conecta los botones. Los
botones "← VOLVER" usan una clase específica según a qué nivel deben
volver: `.btn-volver-especialidades`, `.btn-volver-pif-menu`,
`.btn-volver-cardiorrespi-menu`, `.btn-volver-home`,
`.btn-volver-citopenias-menu`, `.btn-volver-trasplante-menu`,
`.btn-volver-fuci-menu`. Las
calculadoras en sí (Escalas Generales, Neutropenia Febril) no saben nada de
estos niveles superiores ni del Atlas — siguen inicializándose igual que
siempre, solo cambia qué contenedor está visible.


## Plan Marino, fase 1: revisión R1 (caps. 1-6), octubre 2026

Revisión sin construir del plan socialista (`marino-r1`). Auditor ciego, revisor de código y verificador: cobertura
completa, cifras y figuras correctas. Arreglado:
- el signo de la RASS en la vista Visual (`limpiar()` de `core/visual-kit.js`);
- dos `#page=`: úlcera de estrés → 67 y complicaciones del CVC → 33;
- la nota de la errata de NaOH de la Tabla 3.3;
- dos frases sin fuente en la calculadora RASS;
- la nota de fuentes de la dalteparina con ClCr <15, con su aviso en la calculadora;
- límites con aviso en French, tromboprofilaxis, propofol y ketorolaco (`leerAcotado()`). El propofol avisa por
  encima de 240 µg/kg/min, un límite propio de la calculadora y no del libro.

Lo demás va al parte `autonomo/partes/2026-10-14-marino-r1.md` y a `autonomo/ideas/marino.md`.

## Plan Marino, fase 1: revisión R2 (caps. 7-11), octubre 2026

`marino-r2`, encima de R1. Arreglado:
- simulador de fluidos con topes por fluido (antes daba plasma +214 % con 3 L de salino al 7,5 %);
- retorno venoso sin etiquetas de volemia derivadas de la Pms (animal 7-8, humano 14-20);
- Fase II de la capnografía en la vista Visual;
- Tabla 10.5 deslizable en el móvil;
- aviso de extracción <20 % en aporte y consumo de O₂ (mando desde 200);
- límites con aviso en 8 calculadoras;
- notas de las Ecs. 7.1 y 8.3 y de la duración de la albúmina;
- capnografía `#page=44`.

Parte: `autonomo/partes/2026-10-14-marino-r2.md`.

## Marino Renal: revisión R8 del plan Marino, caps. 31-35 (octubre 2026)

`marino-r8` (revisión sin construir), 1 vuelta, 15 fichas. Corregido:
- la KDIGO, que fallaba por redondeo (2,0 → 2,3);
- etiquetas de la vista Visual (delta >1, Regla 2, KDIGO);
- límites genéricos en `enlazar()` para todas las calculadoras de Marino Renal;
- el simulador de salino al 3 %, con techo fisiológico y eje adaptable;
- la hipernatremia normovolémica, la Regla 4 y el delta con HA corregido;
- el reto de volumen;
- notas de fidelidad y huecos de las págs. 26 y 46 y del cap. 35.

Parte: `autonomo/partes/2026-10-14-marino-r8.md`.

## Marino Renal: revisión R9 del plan Marino, caps. 36-38 (octubre 2026)

`marino-r9` (revisión sin construir), 1 vuelta, 8 fichas. Va encima de R8. Corregido:
- la vista Visual de la hipopotasemia (primero la redistribución, no el magnesio);
- `calcHiperk` sin pauta para la no grave;
- el panel de fármacos de la Tabla 36.2 completo;
- la hipermagnesemia con tramos leídos de la tabla;
- límites por unidad en todas las calculadoras;
- notas de fuentes (fosfato potásico, hipomagnesemia, déficit de K⁺ frente a Nefrología);
- sevelamer «gluconato (sic)»;
- `data-en-visual` en los enlaces a las simulaciones;
- la Tabla 38.3 a 360 px.

Parte: `autonomo/partes/2026-10-15-marino-r9.md`.
## Marino Abdomen: revisión R10 del plan Marino, caps. 39-44 (octubre 2026)

`marino-r10` (revisión sin construir), 1 vuelta, 17 fichas. Sin cifras equivocadas. Corregido:
- fuera tres notas de interpretación que no eran de Marino;
- ceftriaxona + metronidazol, nunca en shock;
- límites en todas las calculadoras;
- golpe de calor solo con disfunción del SNC;
- regla de hipertermia distinta de la de fiebre;
- Tabla 44.3 en dos listas;
- redondeos que contradecían el veredicto;
- huecos H1-H8 y erratas anotadas.

Parte: `autonomo/partes/2026-10-15-marino-r10.md`.
