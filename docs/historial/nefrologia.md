# Historial · Nefrología: módulos, PNT, auditorías, simulaciones del potasio, nefrona viva, glomérulo y filtro vivos

> Texto movido tal cual desde el antiguo `CLAUDE.md` (octubre 2026). Es la historia de cómo se construyó
> esta parte: decisiones, fuentes, auditorías y verificaciones. Las reglas vigentes están en `CLAUDE.md`.

### Nefrología

`#nefrologia-view` (`modules/nefrologia/`) tiene **dos niveles visuales
propios**, ninguno calcado del Atlas Hematológico: un **mapa del riñón**
(nivel 0, nuevo) del que cuelgan los 7 objetivos de rotación de la
bibliografía SEN "Nefrología al día", y la **nefrona interactiva** (nivel
1, ver más abajo) como zoom de uno de esos objetivos. La razón de dos
niveles distintos en vez de uno: los 7 objetivos no son todos localizables
en un tramo de la nefrona (p. ej. "Manejo de la HTA" o "Terapias de
reemplazo renal" no son un segmento tubular), así que hacía falta un nivel
por encima que sí diera cabida a todos.

- **`rinon-menu.html` + `rinon.js`** — nivel 0. Un `<svg class="rinon-landscape">`
  dibujado a mano (silueta de riñón en corte: corteza, dos pirámides
  medulares, pelvis renal, uréter, pedículo vascular arteria/vena — mismo
  espíritu tinta que el resto de iconografía de la app, **a diferencia
  deliberada de la nefrona**, que usa foto real por petición explícita del
  usuario) sirve de fondo decorativo a 7 `.region-btn` (clase **reutilizada
  tal cual del Atlas Hematológico** — `.region-btn`/`.region-orb`/`.region-label`/
  `.region-visited`/`.node-sm` ya eran genéricas, sin acoplar a Hematología,
  así que no se duplican) posicionados por `%` sobre zonas del dibujo. La
  silueta es un único `<path>` con dos curvas bézier grandes por lado (una
  convexa por el borde externo, otra que se mete hacia dentro hasta un
  punto de inflexión hacia el centro — el hilio) — si en el futuro no se
  lee como riñón reconocible, ese es el `<path>` a retocar, coordenada a
  coordenada y verificando con capturas de Playwright (mismo método que ya
  se usó para llegar a la forma actual), no las posiciones `%` de los
  nodos, que son independientes de la silueta. A diferencia del Atlas
  (mapa general + pantallas de zona), aquí es **un solo
  nivel**: cada nodo va directo a su destino. `rinon.js` (`initRinon({ onRoute })`)
  no conoce el contenido real, delega en `onRoute(key)` igual que `atlas.js`
  y `nefrona-viva.js`. Uno de los 7 nodos (`fisiopatologia`) no abre una vista
  nueva: hace zoom a la nefrona ya construida — los otros 6 abren vistas de
  categoría propias (`hta.html`, `erc.html`, `fra.html`,
  `nefrotoxicidad.html`, `tratamiento-ira-irc.html`, `trr.html`).
- **Patrón de bibliografía sin contenido propio todavía**: no hay texto
  clínico fuente para los 6 objetivos nuevos (solo la lista de enlaces de
  `bibliografianefrologiaaldia.md`, sin el contenido de los artículos) — al
  contrario que Hematología, donde siempre hubo un PDF/PNT completo que
  extraer. Por disciplina de no fabricar contenido clínico sin fuente, cada
  una de esas 6 vistas es: cabecera + tarjeta "🚧 en preparación" + tarjeta
  **"📚 Bibliografía"** con los enlaces reales de ese bloque como
  `<ul class="biblio-list">` de `<a class="biblio-link" target="_blank"
  rel="noopener">` (con `<span class="biblio-nota">` para aclaraciones del
  documento fuente cuando aporten contexto real). **Nunca enlaces a la
  página genérica del navegador temático**
  (`https://www.nefrologiaaldia.org/es-navegador-tematico`) como sustituto
  de un artículo individual — se detectó en una auditoría (agosto 2026)
  que esto se había usado 12 veces en `erc.html`/`fra.html`/`hta.html`/
  `trr.html` como solución provisional cuando la URL exacta no se había
  confirmado, y el usuario lo reportó como enlaces "que no llevan a ningún
  sitio" (llevan a un buscador genérico, no al artículo prometido por el
  texto del enlace). Se corrigieron las 12 con `WebSearch` verificando que
  la URL apareciera literalmente en los resultados estructurados (no solo
  mencionada en el resumen en prosa, que puede alucinar rutas con el
  patrón `es-articulo-...-NNN` inexistentes — pasó exactamente una vez
  con "Toxinas Urémicas", detectado al re-buscar la URL exacta y no
  encontrarla, y esa entrada se eliminó de la bibliografía en vez de
  enlazarla sin confirmar). Si en el futuro no se encuentra la URL real de
  un artículo citado, es preferible omitir la entrada de la bibliografía
  que enlazarla a una página genérica o a una URL no verificada. El
  bloque 1 ("Fisiopatología renal") no es una vista nueva — su bibliografía
  se añadió como una tarjeta más al final de `nefro-menu.html`, porque esa
  vista ya trata la fisiología tubular. **No uses `.pkpd-btn` para estos
  enlaces**: esa clase está acoplada a la lógica de `pkpd.js` (dispara una
  excepción en cualquier enlace sin `data-drug`, aunque no impide la
  navegación) — usa `.biblio-link` en su lugar.
- **Contenido real de "Fisiopatología renal"**: fuente Carracedo J, Ramírez R.
  "Fisiología Renal". Nefrología al día (SEN), actualizado 5/10/2020 (PDF de
  27 págs. con 5 figuras). Igual que con los PNT de Trasplante, **no
  reproduzcas el texto del artículo literalmente** — el propio usuario pidió
  explícitamente una versión esquematizada/resumida que sirva de repaso,
  nunca un volcado completo. Al principio de `nefro-menu.html`, antes de la
  nefrona interactiva, hay un segundo cuaderno de campo
  (`#fisio-corkboard`/`#panel-fisio-tabs`, inicializado por
  `js/modules/nefrologia/fisiologia.js` vía el mismo `core/corkboard.js` —
  no una reimplementación) con 6 fichas: Anatomía funcional, Filtración
  glomerular, Regulación del filtrado, Reabsorción y secreción, Regulación
  hormonal del túbulo, Función endocrina del riñón. Cada panel usa
  `.kv-row`/`.term-chips`/`.micro-prof-item`/`.data-table` para esquematizar
  (nunca prosa corrida) y las figuras reales del PDF extraídas con
  `pdfimages` (`js/modules/nefrologia/img/fisio-*.jpg`) vía `.article-figure`
  — las 3 tablas del PDF (funciones renales, control FG, balance de
  filtrado/reabsorción) se recrearon como `.data-table` nativas en vez de
  incrustarlas como imagen, para que queden legibles en modo oscuro y
  responsive. El panel "Regulación del filtrado" incluye un
  **simulador de autorregulación de la TFG** (`.tfg-simulador`): un slider
  de presión arterial media que recalcula en vivo la presión hidrostática
  glomerular, la TFG y el diámetro relativo de las arteriolas aferente/
  eferente con un modelo deliberadamente simplificado (constante entre
  80-180 mmHg, cae por debajo, sube poco por encima — fiel a lo que dice la
  fuente, pero sin pretender ser una calculadora clínica real; el propio
  texto de la UI lo aclara). Los paneles de "Anatomía funcional" y
  "Reabsorción y secreción" enlazan explícitamente a la nefrona interactiva
  de más abajo para el detalle canal-por-canal, en vez de duplicarlo.
- **Contenido real de "Homeostasis del agua y del potasio"**: mismo
  `#fisio-corkboard`, 6 fichas más (Ficha 7-12, mismo componente
  `core/corkboard.js`, ningún cambio de patrón): Regulación del agua
  corporal, Hiponatremia, Hipernatremia, Regulación del potasio corporal,
  Hipopotasemia, Hiperpotasemia. Fuentes: Martín Navarro JA, Albalate Ramón
  M, Alcázar Arroyo R, de Sequera Ortíz P. "Trastornos del Agua.
  Disnatremias". Nefrología al día (SEN), actualizado 4/8/2025 (PDF de 41
  págs., 10 figuras/12 tablas); de Sequera Ortíz P, Alcázar Arroyo R,
  Albalate Ramón M. "Trastornos del potasio. Hipopotasemia e
  hiperpotasemia". Nefrología al día (SEN), actualizado 14/6/2024 (PDF de
  37 págs., 11 figuras/10 tablas). Mismo criterio que el resto del bloque:
  nunca un volcado literal del PDF, pero tampoco resumir por debajo del
  nivel de detalle real de la fuente (números, fármacos, mecanismos paso a
  paso) — esto se corrigió explícitamente una vez ya en este mismo bloque
  ("Fisiopatología renal" se amplió tras quedar demasiado resumida en un
  primer pase) y el usuario lo remarcó con más fuerza aún para agua/potasio
  ("un resumen como si fueran unos apuntes para estudiar para un examen
  médico"). Las **11 figuras** del PDF de agua y las **11 figuras** del de
  potasio se extrajeron con `pdfimages -all` (mismo método que
  `fisio-*.jpg`) y se insertaron todas como `.article-figure`
  (`js/modules/nefrologia/img/agua-fig1..10-*.jpg` y `k-fig1..11-*.jpg`);
  las tablas de ambos PDF (12 de agua, 10 de potasio) se recrearon como
  `.data-table` nativas, igual que en fisiología renal — nunca se
  incrustan como imagen las tablas, solo los diagramas/algoritmos/figuras
  reales. Cada bloque (agua, potasio) tiene un **simulador de mecanismo**
  (mismo patrón que `.tfg-simulador`, mismas clases CSS reutilizadas
  — `.agua-simulador` es solo un alias de margen, ver comentario en
  `components.css`) y **varios selectores de diferencial de patologías**
  (patrón `<select>` + `.result-box`, calcado del "Modo interactivo" ya
  usado en la nefrona — nunca reinventado):
  - **Regulación del agua corporal**: simulador de osmorregulación
    (`#agua-osm`, slider de osmolalidad plasmática 270-310 mOsm/kg que
    recalcula ADH/osmolalidad urinaria/diuresis estimada, con el umbral de
    la sed marcado en 292-295 mOsm/kg) + selector de hiponatremia por
    estado de la volemia (`#agua-volemia-select`).
  - **Hipernatremia**: selector de diagnóstico diferencial de la
    poliuria/polidipsia (`#agua-di-select`: DIC/DIN/polidipsia 1ª, con los
    datos reales del test de deprivación hídrica y de la copeptina).
  - **Regulación del potasio corporal**: selector de factores de la
    distribución transcelular (`#k-factor-select`: insulina, catecolaminas,
    alcalosis/acidosis, aldosterona, hiperosmolalidad — mecanismo +
    dirección del movimiento de K⁺; no es un simulador numérico porque
    cuantificar el desplazamiento de un solo factor no sería clínicamente
    fiel a la fuente).
  - **Hipopotasemia**: selector de síndromes hipopotasémicos por pérdidas
    en orina (`#k-sindrome-select`: Bartter/Gitelman/Liddle/diuréticos/
    regaliz, recreando la Tabla 3 del PDF de forma interactiva).
  - **Hiperpotasemia**: selector de mecanismo (`#k-hiper-select`:
    pseudohiperpotasemia/aporte excesivo/↓eliminación renal/redistribución).
  Los datos de estos 5 selectores (no el simulador de osmorregulación, que
  es puro cálculo) viven en `js/data/agua-potasio-data.js` — datos puros,
  sin DOM, siguiendo la convención de `js/data/`; toda la lógica de
  wiring está en `fisiologia.js` (`wireSelectExplicacion()`, un helper
  genérico para no repetir el patrón select→result-box 5 veces). Se
  añadieron 48 preguntas nuevas al quiz (`nefro-q050`-`q098`, `tema` =
  la misma clave que el `data-tab` de cada ficha), llevando el banco de
  Nefrología a 98 preguntas repartidas en 13 temas.
- **Selector de tema en el quiz** (`js/modules/quiz/quiz.js`): con el banco
  de Nefrología ya en 98 preguntas, `initQuiz()` ganó un tercer parámetro
  opcional `temas` (array `{ key, etiqueta }` — en Nefrología,
  `temasNefrologia`, exportado junto a `preguntasNefrologia` en
  `nefrologia-preguntas.js`, con una entrada por `data-tab`). Si se pasa,
  al abrir el quiz aparece antes una pantalla "¿Qué quieres repasar?" con
  un botón por tema (+ "Todos los temas") y el nº de preguntas de cada uno,
  que filtra el banco por `pregunta.tema` antes de barajar. **Degradación
  elegante**: sin `temas`, `initQuiz()` se comporta exactamente igual que
  antes (arranca directo, sin pantalla intermedia) — así que no hace falta
  tocar ningún otro módulo que ya llame a `initQuiz()` sin ese parámetro.
- **Contenido real de "Ácido-base" y "Calcio, Fósforo y Magnesio"**: 6 fichas
  más (Ficha 13-18) en el mismo `#fisio-corkboard`, completando el bloque de
  fisiología/electrolitos: Ácido-base (acidosis), Ácido-base (alcalosis),
  Hipocalcemia, Hipercalcemia, Fósforo (hipo e hiperfosfatemia), Magnesio
  (hipo e hipermagnesemia). Fuentes: "Alteraciones del Metabolismo Ácido
  Base", Nefrología al día (SEN), 35 págs., 5 figuras/14 tablas; Rodelo-Haad
  C, Albalate Ramón M, de Sequera Ortíz P, Rodríguez Portillo M.
  "Trastornos del Calcio, Fósforo y Magnesio". Nefrología al día (SEN),
  actualizado 1/10/2025, 57 págs., 9 figuras/15 tablas. Mismo patrón que el
  resto del bloque: las 14 figuras reales (diagramas/algoritmos, nunca
  tablas) se extrajeron con `pdfimages -all` e insertaron como
  `.article-figure` (`js/modules/nefrologia/img/ab-fig1..5-*.jpg` y
  `cafomg-fig1..9-*.png`); las 29 tablas se recrearon como `.data-table`
  nativas. El ácido-base se dividió en 2 fichas (acidosis / alcalosis,
  siguiendo la propia estructura del artículo) en vez de una sola, igual
  que se hizo antes con hipo/hipernatremia e hipo/hiperpotasemia.
  - **Ácido-base (acidosis)**: hiato aniónico, tampón bicarbonato,
    compensación esperada por trastorno (Tabla 2 del artículo, reutilizada
    también por el clasificador interactivo de más abajo), acidosis
    metabólica con hiato elevado (cetoacidosis, incluida la euglucémica por
    iSGLT2; acidosis láctica tipo A/B; intoxicación por alcoholes; acidosis
    piroglutámica por paracetamol) y con hiato normal/hiperclorémica
    (pérdidas GI, acidosis tubular renal I/II/IV), tratamiento con
    bicarbonato (ventajas/inconvenientes), acidosis respiratoria.
  - **Ácido-base (alcalosis)**: clasificación por génesis y por respuesta al
    cloro, Bartter/Gitelman, iones en orina por causa, tratamiento,
    alcalosis respiratoria, y **trastornos mixtos** (tabla de las 6
    combinaciones posibles con sus causas típicas).
  - **🧪 Clasificador interactivo de gasometrías** (`#ab-ph`/`#ab-pco2`/
    `#ab-hco3`, `calcAcidoBaseClasificador()` en `fisiologia.js`): 3 campos
    numéricos (pH, pCO₂, HCO₃⁻) que, al cambiar, determinan el trastorno
    primario por la dirección del pH y comprueban si la respuesta
    secundaria del otro parámetro encaja con las fórmulas de compensación
    de la Tabla 2 — si no encaja, señala qué trastorno mixto sobreañadido es
    compatible (mismo espíritu didáctico que `.tfg-simulador`, reutilizando
    sus clases `.tfg-estado-ok/warn/danger`, pero con inputs numéricos en
    vez de un slider porque aquí hay 3 variables independientes, no 1).
  - **Hipocalcemia/Hipercalcemia**: las 3 hormonas calciotropas (PTH, CTR,
    calcitonina) y el eje FGF23-Klotho: etiología por PTH baja/alta
    (hipocalcemia) o mediada/no mediada por PTH (hipercalcemia), clínica
    (Chvostek/Trousseau, cambios ECG del QT), algoritmos diagnósticos y
    tratamiento (compuestos de calcio IV/orales, bifosfonatos).
  - **Fósforo**: homeostasis intestino-hueso-riñón, hipofosfatemia (con el
    síndrome de realimentación como causa destacada) e hiperfosfatemia
    (dominada por la ERC), ambas con su algoritmo diagnóstico por RTP
    (reabsorción tubular de fósforo).
  - **Magnesio**: homeostasis, hipomagnesemia (con su vínculo característico
    a hipopotasemia/hipocalcemia refractarias) e hipermagnesemia (casi
    exclusiva de la enfermedad renal).
  - **5 selectores de diferencial** más (mismo patrón
    `wireSelectExplicacion` de siempre): alcalosis metabólica hipopotasémica
    por iones en orina, hipocalcemia por PTH, hipercalcemia por
    mecanismo, mecanismo de alteración del fósforo, mecanismo de
    hipomagnesemia. Datos en `js/data/acidobase-cafomg-data.js`.
  - Se añadieron 30 preguntas nuevas al quiz (`nefro-q099`-`q128`),
    llevando el banco de Nefrología a 128 preguntas repartidas en 19 temas.
  - **Auditoría de contenido y ampliaciones posteriores**: tras completar las
    18 fichas anteriores, se hizo una auditoría explícita del bloque de
    fisiología (huecos de contenido, calidad, feedback de puntos
    débiles/fuertes, evaluación del quiz) y se implementaron sus 4 primeras
    recomendaciones, en este orden:
    1. **Calculadora de calcio corregido por albúmina** (ficha
       `fisio-hipocalcemia`, justo debajo de la fórmula que ya citaba el
       texto): dos campos (Ca total, albúmina) → Ca corregido = Ca medido +
       0,8×(4−albúmina), con interpretación normal/hipo/hipercalcemia
       reutilizando `.tfg-estado-ok/warn/danger`. `calcCalcioCorregido()` en
       `fisiologia.js`.
    2. **10 preguntas nuevas de quiz** (`nefro-q129`-`q138`) para corregir el
       desequilibrio de distribución detectado en la auditoría (Magnesio
       tenía solo 3 preguntas frente a 6-9 del resto de temas): +5 Magnesio,
       +3 Fósforo, +2 Ácido-base — estas dos últimas son **viñetas de
       gasometría completa** (pH/pCO₂/HCO₃⁻ de un caso clínico a
       clasificar aplicando las fórmulas de compensación de la Tabla 2), un
       formato que antes no existía en el banco pese a que el propio
       clasificador interactivo de más abajo enseña exactamente esa
       habilidad. El banco de Nefrología queda en 138 preguntas.
    3. **Δ-gap / Δ-ratio en el clasificador ácido-base** (`fisio-acidobase-acidosis`,
       inputs `#ab-na`/`#ab-cl`, opcionales — el clasificador ya funciona
       sin ellos): si se rellenan, calcula el hiato aniónico y, si está
       elevado, el Δ-ratio = (HA−12)/(24−HCO₃⁻) para detectar un trastorno
       metabólico adicional escondido dentro de una acidosis con hiato
       elevado (acidosis hiperclorémica sobreañadida si Δ-ratio &lt;0,4;
       "pura" si 0,4-2; alcalosis metabólica sobreañadida si &gt;2) — un
       hueco real que la comparación pCO₂/HCO₃⁻ original no cubría, porque
       esa solo detecta problemas respiratorios sobreañadidos, no otro
       trastorno metabólico.
    4. **Calculadora de corrección de sodio (fórmula de Adrogué-Madias)**
       (ficha `fisio-hiponatremia`, tras la tabla de guías de tratamiento):
       mismo patrón visual que el simulador de TFG/osmorregulación
       (`.agua-simulador`), con peso/sexo/Na⁺ actual/tipo de suero (salino
       0,9%/3%/0,45%, Ringer lactato, glucosado 5% — este último pensado
       para el escenario de sobrecorrección) → ΔNa esperado por litro
       infundido y ml necesarios para mover 1 mEq/l, con aviso explícito de
       que es una estimación teórica inicial y no sustituye la
       monitorización frecuente que ya pedía el texto de la ficha.
       `calcCorreccionSodio()` en `fisiologia.js`. Es, de las 4
       implementadas, la de mayor esfuerzo pero también la de mayor valor
       clínico real a pie de cama según la propia auditoría.
    El 5º punto de la auditoría (verificar si faltaba el hiato osmolar en la
    ficha de acidosis) se revisó y **no hizo falta ningún cambio**: la
    fórmula y el punto de corte (&gt;20 mOsm/l) ya estaban en el
    micro-prof-item "Intoxicación por alcoholes" desde la redacción
    original de esa ficha.
  - **Segunda auditoría, enfocada solo en huecos de contenido** (no
    herramientas): se releyeron íntegras las 5 fuentes originales
    (Fisiología Renal, Trastornos del Agua, Trastornos del Potasio —
    Ácido-Base y Ca-P-Mg ya se habían releído en la auditoría anterior) para
    localizar conceptos reales de la fuente ausentes en la app, y se
    añadieron todos los encontrados:
    - `fisio-tubular`: reabsorción de proteínas filtradas (~30 g/día,
      PM&lt;70.000) por endocitosis en el borde en cepillo del túbulo
      proximal — base fisiológica de por qué la proteinuria tubular nunca
      es tan masiva como la glomerular.
    - `fisio-hiponatremia`: predisposición genética a la hiponatremia por
      tiazidas (gen SLCOA1/transportador de PGE2); biomarcador HPRWSP para
      diferenciar síndrome pierde sal de SIADH; perla práctica sobre la
      sobreestimación del Na⁺ venoso periférico tras una convulsión (hasta
      10 mEq/l); iSGLT2 (empagliflozina) como terapia emergente del SIADH;
      albúmina IV y octreotide en la hiponatremia del cirrótico.
    - `fisio-hipernatremia`: dos micro-prof-items nuevos, **DI adípsica**
      (defecto aislado de los receptores de la sed, típica en ancianos sin
      lesión hipotalámica demostrable) y **DI gestacional** ampliada con su
      mecanismo (vasopresinasa placentaria) — el dato numérico ya existía
      como term-chip, se amplió a ficha completa.
    - `fisio-hipopotasemia`: **tabla nativa completa** de fármacos
      inductores (3 columnas: desplazamiento intracelular / eliminación
      renal / pérdidas GI — mucho más exhaustiva que el micro-prof-item
      resumen que ya existía, que se mantiene como entrada rápida) +
      micro-prof-item nuevo sobre **inhibidores de puntos de control
      inmunológico** (hipopotasemia por ATR inmunomediada), relevante dado
      el perfil oncológico de la app.
    - `fisio-hiperpotasemia`: 4º micro-prof-item de "Situaciones
      especiales", **Hipertensión arterial** (datos de prevalencia e
      hiperaldosteronismo 1º) — antes solo había IC/ERC-diálisis/DM;
      **finerenona** añadida a la lista de fármacos que inhiben la
      secreción tubular de K⁺; datos específicos de **diálisis peritoneal**
      (incidencia de hipo/hiperK, distinta de hemodiálisis) añadidos al
      micro-prof-item de enfermedad renal/diálisis.
  - **Equilibrado de la distribución del quiz**: tras la ronda anterior el
    banco quedó con huecos de reparto (Hipocalcemia/Hipercalcemia en 5,
    Anatomía/Regulación hormonal en 6, Filtración/Regulación del
    filtrado/Reabsorción y ácido-base en 7, frente a 8-9 del resto). Se
    añadieron 15 preguntas nuevas (`nefro-q139`-`q153`) repartidas
    exactamente para nivelar cada tema por debajo de 8 hasta 8 preguntas
    (+3 Hipocalcemia, +3 Hipercalcemia, +2 Anatomía, +2 Regulación
    hormonal, +1 cada uno de Filtración/Regulación del filtrado/
    Reabsorción y secreción/Ácido-base acidosis/Ácido-base alcalosis),
    dejando el banco de Nefrología en **153 preguntas** con los 19 temas a
    8 preguntas cada uno salvo Hiponatremia (9, el tema con más contenido
    real). Ninguna pregunta nueva introduce contenido no verificado
    contra la ficha correspondiente — varias refuerzan explícitamente
    herramientas ya existentes (p. ej. `nefro-q139` pregunta por la
    fórmula exacta de la calculadora de calcio corregido).
  - **Ampliación a 25 preguntas en los "últimos temas"**: a petición
    explícita del usuario ("añade más preguntas... sobre todo los últimos
    temas, tienes que llegar al menos a 25"), se llevaron los 6 temas de
    Ácido-base y Ca-P-Mg (Ácido-base acidosis/alcalosis, Hipocalcemia,
    Hipercalcemia, Fósforo, Magnesio — las fichas más recientes del
    bloque) de 8 a **25 preguntas cada uno** (`nefro-q154`-`q255`, 102
    preguntas nuevas). El resto de temas de fisiología queda en 8 (9
    Hiponatremia) — no se tocaron porque el encargo señalaba
    explícitamente "los últimos temas". Cada pregunta nueva se verificó
    contra el contenido exacto de la ficha/fuente correspondiente
    (Alteraciones del Metabolismo Ácido Base y Trastornos del Calcio,
    Fósforo y Magnesio, ambas releídas íntegras en auditorías anteriores
    de esta sesión) para no introducir hechos no citados ni duplicar
    preguntas ya existentes. El banco de Nefrología queda en **255
    preguntas**.
- **`nefro-menu.html`** (nivel 1, la nefrona): antes era una foto anatómica
  con botones "hotspot" invisibles por `%` (`nefrona.js`, `svgFlujo`, selector
  `#nefro-modo-select`). **Sustituida en octubre de 2026 por la "nefrona
  viva"** (`nefrona-viva.js`), a petición explícita del usuario, que llamó a
  la foto con puntos "una chusta": ver la sección "Nefrona viva (octubre
  2026)" más abajo. `nefrona.js` ya no existe; `nefrona-data.js` sigue
  siendo la fuente de los transportadores y de las fichas a las que lleva
  cada tramo.
- **Marca de "ya visto" en los cuadernos de campo**: `core/corkboard.js`
  añade la clase `.visited` a cualquier `.field-card` cuyo tema se haya
  abierto — tanto si se abre volteando la ficha como si se llega desde
  fuera vía `openCorkboardTopic` (p. ej. el enlace del modo interactivo de
  arriba, o el Atlas enlazando a Síndromes Urgentes). El check ✓ verde en
  la esquina lo pinta un único `::before` en CSS
  (`.field-card.visited .card-face.front::before`), sin tocar el HTML de
  ninguna ficha — por eso el comportamiento apareció gratis en **todos**
  los cuadernos de campo de la app (Reconocimiento, Síndromes Urgentes,
  Trasplante, Fisiopatología renal), no solo en Nefrología. Es solo
  memoria de sesión (sin `localStorage`, coherente con el resto de la
  app), igual que las marcas `.visited` del Atlas Hematológico y del mapa
  del riñón.
- **Botón "Siguiente ficha →" al final de cada tema**, a petición
  explícita del usuario ("quiero que al final de cada ficha hubiera un
  botón... y pasases a la siguiente en vez de tener que subir arriba del
  todo constantemente"). Implementado una sola vez en
  `core/corkboard.js` (`initCorkboard()`), igual que la marca de "ya
  visto" de arriba — por eso apareció automáticamente en **todos** los
  cuadernos de campo de la app (Reconocimiento, Síndromes Urgentes, las 3
  subvistas de Trasplante, las 5 categorías del bloque de fisiología de
  Nefrología + HTA/ERC/FRA/TRR, los 3 papers de UCI/Papers Tuiter, y los 3
  bloques de Fisiopatología UCI) sin tocar el HTML de ninguna ficha ni el
  `.js` de ningún módulo concreto. El orden que sigue el botón es el orden
  real de las `.field-card` en el tablero (no el orden de los
  `.tab-content` en el panel, que podría no coincidir) — calculado una vez
  con `Array.from(board.querySelectorAll('.field-card'))` y usado para
  añadir un `<button class="siguiente-ficha-btn">` al final de cada
  `.tab-content` vía `appendChild()`, con el nombre de la ficha siguiente
  ya en el propio texto del botón (extraído de `.field-name`, sustituyendo
  el `<br>` interno por un espacio en vez de dejarlo concatenado). La
  última ficha de cada tablero enlaza de vuelta a la primera (ciclo
  cerrado) — así el botón existe siempre, sin un caso especial "última
  ficha sin botón" que rompiera la uniformidad; en Cardiología esto
  significa que la Ficha 12 (Bibliografía) enlaza de vuelta a la Ficha 1.
  Tableros de una sola ficha (ninguno existe hoy, pero por si acaso) no
  reciben el botón, para no enlazar una ficha consigo misma. Reutiliza
  `openCorkboardTopic()` ya existente, así que hereda gratis el
  scroll-to-top suave y la marca de "ya visto" de la ficha de destino.
  Estilo nuevo en `components.css` (`.siguiente-ficha-btn`, borde/color
  `--accent-blue` como `.back-btn` pero orientado hacia adelante en vez de
  "← volver"). Verificado con Playwright en 2 módulos independientes
  (Cardiología: Ficha 1→2 y Ficha 12→1 cierran el ciclo; HTA: la Ficha 1
  también lleva el botón sin haber tocado `hta.js`), confirmando que el
  cambio centralizado se propaga sin wiring adicional por módulo.
- **`js/modules/nefrologia/index.js`** es el orquestador de los 3 niveles
  (mapa del riñón / nefrona / categoría): un único `nefroLevel`
  (`core/navigation.js`) con una entrada por vista (`kidney`, `nefrona`,
  `diureticosAsa`, `hta`, `erc`, `fra`, `nefrotoxicidad`, `tratamiento`,
  `trr`), inicializa `rinon.js` y `nefrona-viva.js`, e importa/llama los
  `init()` de cada categoría. Dos clases de botón "← VOLVER" según el
  nivel: `.btn-volver-nefro-kidney` (nefrona y las 6 categorías nuevas →
  vuelven al mapa del riñón) y `.btn-volver-nefro-menu` (solo
  `diureticos-asa.html`, anidada dentro de la nefrona → vuelve a la
  nefrona, no al mapa). Si una categoría acumula varios subtemas, usa
  `core/corkboard.js` dentro de ella — el patrón cuaderno de campo no
  cambia, solo cómo se llega a la categoría desde fuera. `init()` devuelve
  `{ volverAlMapa }`, que `main.js` pasa a `home.onNefrologiaListo(...)`
  para que el botón "NEFROLOGÍA" del menú de especialidades deje siempre
  el mapa del riñón como pantalla de entrada (mismo comportamiento que
  `goHome()` ya da al Atlas de Hematología) — `nefrologia.init()` se llama
  después que `home.init()` en `main.js`, así que se inyecta con un setter
  perezoso en vez de como parámetro directo.
- Para añadir una categoría nueva con contenido real: 1) crea el partial
  `<categoria>.html` con `.btn-volver-nefro-kidney` (sustituye a la tarjeta
  "🚧 en preparación" + bibliografía ya existente, sin borrar la
  bibliografía), 2) regístralo en `index.html` dentro de `#nefrologia-view`
  con `data-include`, 3) añádelo al switcher `nefroLevel` y al mapa
  `rutasRinon` de `nefrologia/index.js` (la clave `data-route` del nodo del
  mapa del riñón ya existe, solo cambia a qué apunta). Para añadir
  contenido a la nefrona (canal/categoría anatómica), sigue igual que
  antes: 1) añádelo en `nefrona-data.js`, 2) crea el partial con
  `.btn-volver-nefro-menu`, 3) regístralo en `index.html` y en
  `categoriaDisponible` de `nefrologia/index.js`.
- **`hta.html`** (objetivo de rotación 2) fue la primera de las 6
  categorías del mapa del riñón en pasar de placeholder a contenido real,
  siguiendo el patrón anterior al pie de la letra: releída la bibliografía
  completa aportada por el usuario (Gorostidi M et al. Hipertensión
  Arterial Esencial, Nefrología al día, 37 págs.; Santamaría Olmo R,
  Gorostidi M. Hipertensión arterial secundaria, Nefrología al día, 19
  págs.), se sustituyó la tarjeta "🚧 en preparación" por un cuaderno de
  campo (`#hta-corkboard`/`#panel-hta-tabs`, `js/modules/nefrologia/hta.js`
  vía el mismo `core/corkboard.js` de siempre) con 8 fichas: Definición y
  diagnóstico, Evaluación del hipertenso, Objetivos y estilo de vida,
  Tratamiento farmacológico, HTA resistente, HTA secundaria de causa
  renal, HTA secundaria de causa endocrinológica, y SAHS/coartación/
  fármacos/causas genéticas. Todas las tablas originales (clasificación de
  PA, MAPA/AMPA, estratificación de riesgo CV, fármacos y dosis,
  estrategias de tratamiento por comorbilidad, causas de HTA secundaria,
  fármacos que inducen HTA, causas monogénicas) se recrearon como
  `.data-table` nativas — ninguna de las figuras del PDF era una
  ilustración anatómica o un diagrama complejo (eran tablas con borde o
  flujogramas de tratamiento fácilmente tabulables por escalón), así que
  no se extrajo ninguna imagen esta vez, a diferencia de los bloques de
  fisiología. La bibliografía original de `hta.html` se mantuvo intacta al
  final, sin tocarla.
  - **Quiz de HTA integrado en el mismo motor, sin duplicarlo**: el modal
    del quiz (`#quiz-modal-overlay` y sus elementos internos en
    `quiz.html`) es un único partial compartido por toda la app — llamar a
    `initQuiz()` dos veces con triggers distintos duplicaría los listeners
    sobre los mismos botones del modal (`#quiz-opciones`, `#quiz-siguiente`)
    y rompería el quiz ya existente de Nefrología. En vez de eso,
    `initQuiz()` (en `js/modules/quiz/quiz.js`) ahora acepta `triggerId`
    como string **o array de strings** — cada botón de la lista abre el
    mismo banco combinado — y `nefrologia/index.js` hace una única llamada
    con `triggerId: ['btn-nefro-repasar', 'btn-hta-repasar']` y
    `banco`/`temas` como el spread de `preguntasNefrologia`+`preguntasHTA`
    y `temasNefrologia`+`temasHTA` (`js/data/hta-preguntas.js`, mismo
    formato que `nefrologia-preguntas.js`). Si en el futuro se añade
    contenido real a otra categoría del mapa del riñón con su propio
    "🎯 Repasar", sigue este mismo patrón: nunca una segunda llamada a
    `initQuiz()`, siempre un `triggerId` más en el array de la única
    llamada existente.
  - **Bug preexistente corregido de paso**: `quiz.js` pinta el enunciado y
    las opciones con `textContent`, que no decodifica entidades HTML — 21
    preguntas de Nefrología que usaban `&lt;`/`&gt;` en vez de `<`/`>`
    literales (porque así se escriben correctamente dentro del HTML de las
    fichas) se mostraban con la entidad sin decodificar en el quiz. Se
    corrigieron esas 21 preguntas en `nefrologia-preguntas.js` a `<`/`>`
    literales (válido en un string JS, y es lo que `textContent` necesita)
    — (nota histórica: desde la auditoría de Hematología de octubre 2026
    `quiz.js` pinta todos los campos con `htmlPregunta()`, que acepta
    tanto `<` literal como `&lt;` y `<sub>`/`<sup>`; aun así, prefiere `<`
    literal) — nunca escribas `&lt;`/`&gt;` dentro de `js/data/*-preguntas.js`,
    solo dentro de los `.html` de las fichas.
  - **Ampliación de Ficha 5 (HTA resistente) y Ficha 6 (HTA secundaria:
    causas renales) con los artículos monográficos dedicados**: las dos
    primeras fichas de `hta.html` se construyeron originalmente solo con
    el resumen que trae `HTA_2_.pdf`/`HTA_SECUNDARIA.pdf` (el artículo
    general de HTA secundaria). Se releyeron después dos PDF adjuntos
    nuevos —Segura J, Gorostidi M. Hipertensión arterial resistente.
    Nefrología al día (SEN), actualizado 6/10/2021; y Oliveras A.
    Hipertensión arterial renovascular. Nefrología al día (SEN),
    actualizado 5/10/2021— cada uno un capítulo monográfico mucho más
    detallado sobre ese mismo tema, y se usaron para ampliar
    sustancialmente (no reescribir desde cero) esas dos fichas concretas,
    dejando intactas las fichas 1-4 y 7-8. Un tercer PDF adjunto en la
    misma tanda (`HTA_SECUNDARIA.pdf`) resultó ser el mismo artículo que
    `HTA_2_.pdf` ya incorporado (mismos autores, mismo ID NC-014, mismo
    contenido) — se comprobó explícitamente antes de dar la tarea por
    completada, para no reescribir contenido ya presente.
    - **Ficha 5 (`hta-resistente`)**: definición clásica vs. ampliada
      (AHA, ≥4 fármacos) vs. HTA refractaria (≥5 fármacos); tabla de
      prevalencia por fuente (NHANES, Kaiser Permanente, Registro Español
      de MAPA, ERC); Tabla 1 de factores demográficos/fisiopatológicos/
      comorbilidades; pronóstico (+47% riesgo CV a ~4 años); cuaderno de
      6 `micro-prof-item` para el enfoque diagnóstico de la
      pseudorresistencia (cumplimiento terapéutico, bata blanca —con la
      cifra real del Registro Español, 62,5%/37,5%—, técnica de medida,
      pseudohipertensión/maniobra de Osler, inercia clínica, SAHS
      70-90%); proceso diagnóstico en 7 pasos (antes Figura 1 del PDF,
      recreado como secuencia `kv-row` numerada en vez de flujograma
      SVG, más simple y suficiente para un flujo lineal de 7 pasos sin
      ramas de decisión); tabla de recomendaciones de optimización
      farmacológica (Tabla 3, 10 ítems); esquema de tratamiento
      escalonado con el detalle real de FG/fármaco (hidroclorotiazida
      inefectiva con FG&lt;45, clortalidona hasta FG 30) y el resultado
      del ensayo PATHWAY-2; terapias invasivas (denervación simpática
      renal —con el resultado real y controvertido de SYMPLICITY
      HTN-3—, estimulación de barorreceptores carotídeos, fístulas AV).
    - **Ficha 6 (`hta-secundaria-renal`), sección renovascular**:
      reenmarcada como "enfermedad renal vascular (ERV)"; Tabla 1 de
      causas completa (frecuentes/infrecuentes/situaciones especiales,
      incluye vasculitis sistémicas y fístula AV renal, ausentes del
      resumen anterior); epidemiología detallada por territorio vascular;
      fisiopatología con el modelo de Goldblatt (2K1C), el hallazgo del
      ratón knockout AT1A, y las dos fases renina-dependiente/
      volumen-dependiente (antes no distinguidas); Tabla 2 de 11
      situaciones de sospecha (antes una lista más corta); diagnóstico
      ampliado con el índice de resistencia (IR) Doppler y su
      interpretación (IR&gt;80 = revascularización contraindicada),
      BOLD-RM, angiografía por sustracción digital con "signo de cuerda"
      e hiperemia con papaverina/dopamina, y tabla de criterios de
      gravedad hemodinámica; tratamiento ampliado con tasas reales de
      éxito/reestenosis de la ATP, tabla de predictores de buena
      respuesta, y tabla completa de criterios SCAI/AHA-ACC de uso
      apropiado de la angioplastia (7 contextos clínicos). **Primeras
      imágenes reales extraídas para el bloque de HTA** (a diferencia de
      la Ficha 1-4/7-8 originales, donde se decidió no extraer ninguna
      por ser solo tablas/flujogramas tabulables): 3 angiografías reales
      del PDF de renovascular (`js/modules/nefrologia/img/renovasc-fig1-
      displasia.jpg`, `renovasc-fig2-aterosclerotica.jpg`,
      `renovasc-fig3-stent.jpg`, extraídas con `pdfimages -all -j`),
      como `.article-figure` — buenas candidatas porque son fotografías
      angiográficas genuinas, no tablas ni flujogramas reconstruibles.
    - Se añadieron 24 preguntas nuevas al quiz de HTA (`hta-q065`-`q088`,
      12 por ficha), llevando ambos temas de 8 a 20 preguntas cada uno —
      el resto de temas de HTA (Ficha 1-4, 7-8) se mantuvo en 8, igual
      que el criterio ya usado en Nefrología de ampliar el banco solo en
      los temas que reciben una ampliación de contenido real. El banco
      combinado de Nefrología+HTA queda en 343 preguntas (255+88).
  - **`erc.html`** (objetivo de rotación 3) fue la 2ª de las 6 categorías
    del mapa del riñón en pasar de placeholder a contenido real, con la
    fuente de mayor volumen usada hasta ahora en todo el proyecto: la
    **KDIGO 2024 Clinical Practice Guideline for the Evaluation and
    Management of Chronic Kidney Disease** (*Kidney International*
    (2024) 105 (Suppl 4S): S117-S314, ~198 páginas repartidas en 2 PDF de
    ~99 páginas cada uno). Se leyó el documento completo (portada,
    resumen íntegro de recomendaciones y *practice points* S149-168, y
    los 5 capítulos clínicos S169-269 — el capítulo 6, "Research
    recommendations", y el apéndice de métodos/PICOS que le sigue, se
    revisaron para confirmar que no contienen contenido de manejo
    clínico y se descartaron a propósito, igual que se descartó
    reproducir tablas puramente estadísticas/forest-plots de
    metaanálisis). Sustituida la tarjeta "🚧 en preparación" por un
    cuaderno de campo (`#erc-corkboard`/`#panel-erc-tabs`,
    `js/modules/nefrologia/erc.js` vía el mismo `core/corkboard.js` de
    siempre) con **11 fichas**, más del doble que cualquier otro cuaderno
    de campo de la app hasta ahora — proporcional al volumen real de la
    fuente (6 capítulos KDIGO con contenido far más extenso que
    cualquier PDF anterior de Nefrología al día):
    1. **Definición, categorías y causas** (`erc-definicion`): criterio
       de persistencia ≥3 meses, tabla de categorías G (G1-G5, con G3a/
       G3b) y A (A1-A3), nomenclatura CGA, el "mapa de calor" de riesgo
       verde→amarillo→naranja→rojo (descrito en texto, no reproducido
       como imagen), epidemiología (prevalencia mundial ~10%, mayor
       riesgo de muerte CV que de progresión a fallo renal), y 5 causas
       de ERC en `micro-prof-item` (diabetes, vascular/HTA,
       glomerulonefritis, quísticas/hereditarias, uropatía obstructiva).
       Incluye la primera calculadora de esta ficha (ver más abajo).
    2. **Evaluación diagnóstica: FGe y albuminuria** (`erc-evaluacion`):
       pruebas iniciales, ecuación CKD-EPI de creatinina 2021 (sin raza)
       como recomendación de primera línea, cuándo usar cistatina C
       (eGFRcys/eGFRcr-cys), medida directa (mGFR), determinantes no
       relacionados con el FG que alteran creatinina/cistatina C (tabla),
       medida de albuminuria (ACR puntual preferido sobre 24h, POCT,
       cuándo repetir), biopsia renal, monitorización.
    3. **Evaluación del riesgo y monitorización** (`erc-riesgo`): Kidney
       Failure Risk Equation (KFRE) de 4 y 8 variables — **sin
       calculadora numérica propia** (decisión deliberada: los
       coeficientes exactos de la ecuación de regresión no se
       recrearon, para no arriesgar un cálculo mal implementado en una
       herramienta de predicción de fallo renal; se enlaza en su lugar a
       kidneyfailurerisk.com), umbrales de derivación por riesgo
       (>3-5%/5 años, >40%/2 años), tabla completa de frecuencia de
       monitorización FGe/ACR por categoría G×A, herramientas de riesgo
       CV validadas en ERC (parche SCORE, PREVENT).
    4. **Estilo de vida y nutrición** (`erc-estilo-vida`): ejercicio,
       peso, tabaco, ingesta proteica por contexto (tabla), restricción
       de sodio (&lt;2 g/día), patrón dietético de base vegetal, potasio
       dietético (remite a la Ficha 7 para el detalle), alcohol.
    5. **Control de la PA y bloqueo del SRAA** (`erc-pa-raas`): objetivo
       &lt;120 mmHg sistólica con medida estandarizada (y por qué esa
       distinción importa, ligada a SPRINT), excepciones, por qué no
       combinar IECA+ARA-II, tabla de monitorización tras iniciar/
       intensificar el bloqueo del SRAA, cuándo NO discontinuar pese a
       progresión o inicio de diálisis.
    6. **Nefroprotección: SGLT2i, ns-MRA y GLP-1 RA** (`erc-nefroproteccion`):
       los 3 pilares farmacológicos "nuevos" desde 2020 — iSGLT2 desde
       FGe ≥20 con o sin diabetes (cambio de mayor impacto de esta
       actualización), mecanismo antiproteinúrico vía arteriola aferente,
       finerenona (ns-MRA) y su diferencia frente a espironolactona/
       eplerenona, GLP-1 RA (ensayo FLOW), tabla resumen de las 4 clases
       con nefroprotección demostrada.
    7. **Acidosis metabólica e hiperpotasemia** (`erc-acidosis-k`): umbral
       de suplementación con álcalis (HCO₃⁻ &lt;18), relación en U entre
       potasio y mortalidad, mecanismos de hiperpotasemia (tabla),
       **tabla completa de fármacos asociados a hiperpotasemia**
       (mecanismo + ejemplos, incluida finerenona y la excepción de los
       iSGLT2), conducta clínica por gravedad, agentes captadores de
       potasio (resinas/patirómero/SZC) en `micro-prof-item`, manejo
       escalonado 3 líneas, y la tabla de tasas de absorción de potasio
       por tipo de alimento (vegetal fresco 50-60% vs. procesado ~90%)
       — mismo mensaje ya presente en Ficha de Hipopotasemia de
       Fisiología, reforzado aquí desde la fuente KDIGO independiente.
    8. **CKD-MBD e hiperuricemia** (`erc-mbd-urico`): CKD-MBD tratado
       deliberadamente de forma breve, con remisión explícita a la
       **KDIGO 2017 CKD-MBD Guideline Update** para dosificación de
       quelantes/vitamina D/calcimiméticos (esta guía de 2024 no la
       repite); anemia igual de breve, remitiendo a la **KDIGO 2012
       Anemia Guideline** (en actualización); hiperuricemia con
       recomendaciones explícitas en cajas de color (verde = tratar solo
       la sintomática, rojo = no tratar la asintomática para frenar
       progresión — grados 1C/2D reales de la fuente), HLA-B*5801 y
       alopurinol.
    9. **Riesgo cardiovascular: lípidos, FA y cardiopatía isquémica**
       (`erc-cv`): estatinas por edad/FGe con grados reales (1A/1B/2A),
       estrategia "fire-and-forget", AAS en prevención 2ª (recomendación
       real 1C) vs. 1ª (sin recomendación firme), ISCHEMIA-CKD (tratamiento
       médico vs. invasivo, con sus excepciones), FA/NOAC con
       recomendación real 1C preferente sobre warfarina, y la limitación
       conocida de añadir el FGe a CHA₂DS₂-VASc.
    10. **Manejo de fármacos, nefrotoxicidad y contraste**
        (`erc-farmacos`): tabla de fármacos nefrotóxicos con alternativas
        (reutilizando el mismo patrón dos-columnas que la tabla de HTA
        renovascular), remedios herbales por continente, ajuste de dosis
        por FG (indexado/no indexado por superficie corporal), "sick day
        rules" con el acrónimo real **SADMANS**, tabla de suspensión
        perioperatoria, y contraste (terminología CA-AKI, tabla de
        factores de riesgo, medidas sin beneficio consistente, gadolinio
        por grupo ACR).
    11. **Derivación, síntomas, modelos de atención y diálisis**
        (`erc-atencion`): tabla completa de criterios de derivación,
        tabla beneficios/consecuencias derivación precoz/tardía, los 13
        síntomas más prevalentes de la ERC con su prevalencia/gravedad
        real (Figura 49 de la fuente, recreada como `term-chips`, no
        como imagen), manejo de síntomas comunes en `micro-prof-item`,
        cribado de malnutrición, modelo de atención escalonado por
        riesgo (tabla), transición pediatría-adultos, momento de inicio
        de diálisis (incluido el resultado real del ensayo IDEAL — sin
        beneficio de supervivencia con inicio precoz), y cuidados
        conservadores integrales/paliativos.
    - **Calculadora de FGe (CKD-EPI 2021) + categorización CGA**, en la
      Ficha 1 (`calcCgaCategorizador()` en `erc.js`): 4 inputs
      (creatinina, edad, sexo, ACR) → FGe con la ecuación real CKD-EPI
      2021 sin coeficiente de raza (constantes kappa/alfa por sexo),
      categoría G, categoría A, y nivel de riesgo (verde/amarillo/rojo,
      mapeado a los 3 colores ya disponibles de `.tfg-estado-*` — el
      4º nivel "naranja" del mapa de calor real de KDIGO se colapsa en
      el mensaje de texto de "rojo", ya que no existe una 4ª clase CSS
      de color en el proyecto y no se justificaba crear una solo para
      esto). El mapa de riesgo G×A (`MAPA_RIESGO` en `erc.js`) reproduce
      exactamente la matriz estándar de KDIGO 2012/2024, confirmada
      contra las tablas de riesgo por eGFR×albuminuria del CKD Prognosis
      Consortium vistas repetidamente en la fuente (mortalidad,
      hiperpotasemia, FA). Deliberadamente NO se implementó una
      calculadora de la KFRE (ver Ficha 3 arriba) por el mismo motivo de
      seguridad clínica.
    - Ningún dato de esta ficha se extrajo como imagen — a diferencia de
      HTA renovascular (que sí tenía angiografías reales), todas las
      figuras de la fuente KDIGO son gráficos estadísticos (forest-plots,
      curvas de metaanálisis) o flujogramas fácilmente tabulables, así
      que todo el contenido se recreó como `.data-table`/`.kv-row`/
      `.term-chips`/`.micro-prof-item` nativos, siguiendo el mismo
      criterio que ya se aplicó en HTA Ficha 1-4/7-8.
    - Se creó `js/data/erc-preguntas.js` con **88 preguntas** (`erc-q001`-
      `q088`, 8 por ficha × 11 fichas — mismo baseline de 8 ya usado al
      arrancar Nefrología y HTA), añadida a la llamada única de
      `initQuiz` en `nefrologia/index.js` (`triggerId` ganó un 3er botón,
      `btn-erc-repasar`). El banco combinado Nefrología+HTA+ERC queda en
      **431 preguntas** (343+88).
  - **`fra.html`** (objetivo de rotación 4) fue la 3ª de las 6 categorías
    del mapa del riñón en pasar de placeholder a contenido real, con un
    único artículo fuente de alcance más manejable que ERC (36 páginas,
    similar en escala a HTA): Rodríguez Benítez P, Ramos Terrades N,
    Poch E. **Insuficiencia Renal Aguda**. Nefrología al día (SEN),
    actualizado 22/9/2025 — leído íntegro, incluidas sus 113 referencias
    bibliográficas (revisadas para confirmar que no aportaban contenido
    clínico adicional no recogido ya en el cuerpo del artículo). Sustituida
    la tarjeta "🚧 en preparación" por un cuaderno de campo
    (`#fra-corkboard`/`#panel-fra-tabs`, `js/modules/nefrologia/fra.js` vía
    el mismo `core/corkboard.js` de siempre) con **9 fichas**:
    1. **Concepto, definición y estadificación** (`fra-definicion`): Tabla 1
       KDIGO de estadios (creatinina + diuresis), inconvenientes prácticos
       de la definición (uso del criterio de diuresis restringido a UCI,
       necesidad de Crs basal fiable, Crs como marcador poco sensible y
       tardío), IRA subclínica (criterios ADQI, marcador + / marcador -),
       y la cronología IRA → ERA (enfermedad renal aguda, acute kidney
       disease) → ERC.
    2. **Epidemiología y etiología** (`fra-epidemiologia`): incidencia por
       contexto (comunidad, UCI, posquirúrgica), Tabla 2 completa de
       etiología por mecanismo patogénico (prerrenal/renal-intrínseca/
       posrenal, con todos los subtipos vascular/cardíaco/volemia,
       inflamatorio/tóxico/oclusión de vasos, vía urinaria/intratubular).
    3. **Subfenotipos I: posquirúrgica, sepsis y tóxica**
       (`fra-subfenotipos-1`).
    4. **Subfenotipos II: cardíaca, hepática, embarazo y obstructiva**
       (`fra-subfenotipos-2`): Síndrome Cardiorrenal tipo I con VExUS,
       IRA en cirrosis hepática con los criterios ICA y el subestadio
       1A/1B, mecanismos fisiopatológicos del síndrome hepatorrenal en
       `micro-prof-item`, IRA en el embarazo con tabla de causas por
       grupo prerrenal/renal/posrenal, e IRA obstructiva.
    5. **Diagnóstico: clínica, laboratorio e imagen** (`fra-diagnostico`):
       algoritmo diagnóstico (antes Figura 1, recreado como secuencia
       `kv-row`), pruebas de laboratorio, Tabla 3 de parámetros urinarios
       (Na⁺ orina/FENa/IFR/osmolalidad/Cro-Crs/FE urea/sedimento) **con
       calculadora de FENa e IFR** (ver más abajo), Tabla 4 de hallazgos
       del sedimento, **Figura 2 real** (sedimento de orina, mosaico de
       8 microfotografías) y **Figura 3 real** (ecografía renal normal
       vs. uropatía obstructiva) extraídas con `pdfimages -all -j`
       (`js/modules/nefrologia/img/ira-fig2-sedimento.png`,
       `ira-fig3-ecografia.png` — buenas candidatas por ser fotografías
       diagnósticas genuinas, a diferencia de la Figura 1 y la Figura 4,
       que son flujogramas recreados como texto), test de respuesta a
       furosemida, biomarcadores no convencionales (remite a la Ficha 8),
       biopsia renal.
    6. **Complicaciones y tratamiento médico** (`fra-complicaciones-tto`):
       complicaciones a corto plazo, disfunción de otros órganos,
       hiperpotasemia (umbral de tratamiento activo ≥6,5 mmol/l),
       acidosis metabólica, hipocalcemia/hiperfosfatemia/hiperuricemia,
       tabla de nutrición KDIGO en la IRA.
    7. **Tratamiento renal sustitutivo** (`fra-trs`): indicaciones
       urgentes de diálisis, los 5 grandes ensayos sobre el momento de
       inicio (ELAIN único con beneficio; AKIKI/IDEAL-ICU/STARRT-AKI sin
       diferencias; AKIKI 2 con el hallazgo de mayor mortalidad al
       retrasar en oliguria >72h) en `micro-prof-item`, modalidades
       (HDI/continuo/técnicas híbridas PIRRT, con las técnicas híbridas
       desarrolladas en su propio `micro-prof-item`), dosis de diálisis,
       anticoagulación (heparina vs. ARC), y finalización del TRS con
       tabla de parámetros orientativos de retirada.
    8. **Predicción y prevención** (`fra-prediccion`): biomarcadores no
       convencionales (KIM-1, NGAL, L-FABP, cistatina C, hemojuvelina,
       NAG, Netrina-1, GGT, GST, TIMP-2, IGFBP7) con 3
       `micro-prof-item` para los de mayor impacto clínico (NephroCheck®
       = TIMP-2×IGFBP7, NGAL, CCL14/CXCL9), IA y modelos predictivos, y
       tabla de medidas de prevención KDIGO 2012.
    9. **Evolución, pronóstico y seguimiento** (`fra-evolucion`): los 4
       escenarios evolutivos (recuperación, ERC, ECV, mortalidad —
       incluida la cifra real de mortalidad global del 23%, hasta 50%
       en críticos con TRS), proteinuria como marcador de riesgo
       (ASSESS-AKI), seguimiento ambulatorio sin pauta estandarizada,
       recomendación FRASEN, tabla de quién debe hacer el seguimiento
       (nefrólogo vs. Atención Primaria) y estratificación por
       probabilidad de recuperación.
    - **Dos calculadoras nuevas** en `fra.js`:
      `calcEstadioKdigo()` (Ficha 1) clasifica el estadio KDIGO
      **solo por el criterio de creatinina** (Δ absoluto o razón sobre
      la basal) — deliberadamente NO evalúa el criterio de diuresis
      (dependiente del tiempo, restringido a UCI, mal adaptable a un
      formulario simple) ni el marco temporal exacto, con esa limitación
      explícita en el propio texto de la calculadora; y
      `calcFenaIfr()` (Ficha 5) calcula la FENa y el IFR a partir de
      las fórmulas literales de la Tabla 3 de la fuente. **Detalle de
      seguridad clínica**: la Tabla 3 original muestra el mismo valor
      ">1" para el IFR tanto en la columna de hipoperfusión como en la
      de NTA (posible errata del artículo, ya que conceptualmente el
      IFR discrimina en el mismo sentido que la FENa) — en vez de
      "corregir" este valor por criterio propio, se reprodujo la tabla
      tal cual la publica la fuente (con una nota aclaratoria) y la
      calculadora deliberadamente **no emite un veredicto automático
      basado en el IFR**, solo en la FENa (cuyos cortes &lt;1%/&gt;2% sí
      son inequívocos en la fuente) — el IFR se muestra como dato
      adicional sin interpretación.
    - Se creó `js/data/fra-preguntas.js` con **72 preguntas**
      (`fra-q001`-`q072`, 8 por ficha × 9 fichas), añadida a la llamada
      única de `initQuiz` (`triggerId` ganó un 4º botón,
      `btn-fra-repasar`). El banco combinado Nefrología+HTA+ERC+FRA
      queda en **503 preguntas** (431+72).
  - **Auditoría sistemática de `erc.html` contra la guía KDIGO 2024**: tras
    completar el módulo, se hizo una relectura íntegra y deliberada de las
    198 páginas de la fuente comparándolas frase a frase con el contenido
    ya construido, para detectar tanto huecos como imprecisiones — no una
    relectura superficial, sino un cotejo sistemático ficha por ficha.
    Se encontró y corrigió una **imprecisión clínica real**: el texto
    original de la Ficha 6 decía que el iSGLT2 se recomienda "con o sin
    albuminuria significativa" en cualquier persona con ERC — la guía en
    realidad solo da recomendación firme (1A) sin exigir umbral de
    albuminuria en personas con diabetes tipo 2, o con insuficiencia
    cardíaca; en el resto (sin diabetes, sin IC) exige ACR ≥200 mg/g para
    la recomendación fuerte, y da un grado más débil (2B) por debajo de
    ese umbral. Se corrigió reemplazando el párrafo por una tabla con las
    3 recomendaciones diferenciadas y una nota explícita señalando el
    matiz. Además se añadió contenido genuinamente ausente (no solo
    corregido), verificado contra la fuente antes de incorporarlo:
    - Ficha 1: tabla de factores de riesgo de ERC para cribado dirigido
      (comunes/geográficos-APOL1/genitourinarios/multisistémicos/
      iatrogénicos/gestacionales/ocupacionales).
    - Ficha 2: estudio genético en la evaluación de causa (>10% de
      personas con ERC son portadoras de variantes patogénicas,
      independientemente de historia familiar; genes "accionables" por
      categoría de utilidad clínica), sección de POCT como apartado
      propio, y cifra real de complicaciones de la biopsia (hematoma
      perirrenal 16%, 12-22% según series).
    - Ficha 3: otras ecuaciones de riesgo de fallo renal validadas más
      allá de la KFRE (KPNW, Landray, Z6, Klinrisk, KidneyIntelX), y
      herramientas de riesgo específicas por enfermedad (puntuación MEST
      en nefropatía IgA; clasificación Mayo y PROPKD en poliquistosis
      renal, con su relevancia directa para la elegibilidad a tolvaptán).
    - Ficha 4: perla práctica sobre gramos de proteína real en 100g de
      carne (~25g, no 100g — útil para educar al paciente), matiz sobre
      nefropatías pierde-sal (la restricción de sodio no aplica
      universalmente), y foco explícito en ultraprocesados como mensaje
      distinto de "azúcares refinados" en general.
    - Ficha 5: la recomendación de IECA/ARA-II reformulada como tabla con
      su fuerza real por categoría de albuminuria (1B en A3 sin diabetes,
      pero solo 2C —sugerencia débil— en A2 sin diabetes, dato que el
      texto anterior colapsaba en una única recomendación uniforme),
      algoritmo de monitorización en 3 ramas (normopotasemia/
      hiperpotasemia/caída de FGe) y el ensayo STOP-ACEi.
    - Ficha 6: cifras reales del metaanálisis de iSGLT2 (37%/23%/23%/10%
      de reducción de progresión/FRA/muerte CV-IC/MACE), y el algoritmo
      exacto de monitorización de potasio con finerenona (≤4,8 iniciar,
      4,9-5,5 continuar, >5,5 pausar) con las cifras reales de riesgo de
      hiperpotasemia del análisis FIDELITY.
    - Ficha 8: el ensayo **CARES** (febuxostat vs. alopurinol: no
      inferior en el objetivo CV compuesto, pero con mayor mortalidad
      total y CV — señal de seguridad real que refuerza preferir
      alopurinol), los 3 ensayos negativos de hiperuricemia asintomática
      citados por nombre (CKD-FIX, PERL, FEATHER), prevalencia de gota de
      NHANES, y el umbral práctico de inicio de tratamiento tras un
      primer episodio de gota (ácido úrico >9 mg/dl o urolitiasis).
    - Ficha 9: la complejidad diagnóstica del síndrome coronario agudo en
      ERC (ergometría limitada, troponina de interpretación cauta,
      presentación atípica como IC/síncope en vez de dolor torácico), y
      la escala **HAS-BLED** junto al CHA₂DS₂-VASc ya existente, más la
      estrategia diagnóstica en 3 pasos de la Figura 40 de la fuente.
    - Ficha 10: el concepto de **cascada de prescripción**
      ("prescribing cascade", con el ejemplo clásico calcioantagonista→
      edema→diurético→hipopotasemia→más fármacos), el marco de revisión/
      conciliación de medicación, contexto global de acceso a fármacos, y
      una sección nueva de **fármacos y embarazo** (qué suspender antes
      de la concepción — IECA/ARA-II, inhibidores de mTOR — y qué
      mantener durante la gestación — hidroxicloroquina, tacrolimus,
      azatioprina, prednisona, colchicina, IVIG).
    - Ficha 11: sección de **telesalud** (monitorización remota,
      educación, prestación de cuidados por vía digital), marco de
      educación del paciente por estadio (G1-G2/G3-G4/G5), y dos entradas
      de manejo de síntomas que faltaban en el acordeón (trastornos del
      sueño, falta de apetito/náuseas — antes solo aparecían en la lista
      de prevalencia sin manejo asociado).
    Todas las adiciones se verificaron contra el texto exacto de la
    fuente antes de incorporarlas (igual criterio que en el resto de la
    app: nunca fabricar contenido clínico sin respaldo directo en el PDF
    leído). No se tocó ninguna calculadora existente ni se introdujeron
    fichas nuevas — es una ampliación de profundidad dentro de las 11
    fichas ya existentes, no una reestructuración.
  - **Ficha 12 (`erc-tratamiento-objetivos`), a petición explícita del
    usuario**: "Tratamiento por objetivos: guía rápida por analítica" —
    una ficha de **síntesis pura**, deliberadamente distinta al resto:
    no añade ningún hecho clínico nuevo, solo reorganiza el contenido ya
    presente en las Fichas 1-11 desde el ángulo con el que se trabaja a
    pie de cama (una analítica real delante, no un tema de estudio).
    Consta de 3 bloques: 1) una **calculadora** (`calcPanelAnalitico()`
    en `erc.js`) que evalúa de forma independiente ACR, potasio,
    bicarbonato y hemoglobina (con selector de sexo) contra los umbrales
    ya citados en las Fichas 1/7/8, mostrando un semáforo ✅/⚠️/🔴 por
    parámetro — **deliberadamente NO incluye** calcio, fósforo, PTH,
    ácido úrico ni LDL como campos evaluables con veredicto numérico,
    porque la propia fuente (KDIGO 2024) evita un único valor de corte
    para esos parámetros ("evaluación conjunta y seriada", "fire-and-forget");
    2) una **tabla maestra** de 13 filas (una por parámetro analítico:
    creatinina/FGe, ACR, urea, sodio, potasio, bicarbonato, calcio,
    fósforo, PTH, ácido úrico, hemoglobina, LDL, PA) con objetivo/
    referencia, acción si está alterado, y frecuencia orientativa —
    cubre explícitamente también los parámetros sin objetivo numérico
    (p. ej. "Urea/BUN: sin objetivo numérico establecido en manejo
    ambulatorio — marcador de retención nitrogenada"), en vez de omitirlos;
    3) un listado de **11 objetivos terapéuticos numerados** (estadio/
    riesgo, frenar progresión, potasio, acidosis, óseo-mineral, ácido
    úrico, riesgo CV, nefrotoxicidad/fármacos, anemia, nutrición,
    derivación/TRS futura), cada uno como `micro-prof-item` con
    referencia cruzada a la ficha de detalle correspondiente. No se le
    añadieron preguntas de quiz propias (a diferencia de las Fichas 1-11)
    porque, al ser pura reorganización sin contenido nuevo, cualquier
    pregunta duplicaría el banco ya existente de los otros temas.
  - **Segunda auditoría de bibliografía, más estricta que la del punto anterior
    (que solo arregló los 12 enlaces al navegador temático genérico)**: a
    petición explícita del usuario, se revisó cada entrada de
    `📚 Bibliografía` de **todas** las secciones de Nefrología (no solo las
    que tenían enlaces rotos) contra dos criterios: (1) ¿esta fuente se usó
    de verdad para construir el contenido ya presente, o es un enlace de
    "lectura futura" que nunca llegó a incorporarse?, y (2) ¿el enlace
    resuelve a la página real del artículo? El criterio de uso se comprobó
    cruzando cada entrada contra las líneas "Fuente:" de este mismo
    `CLAUDE.md` y contra los créditos en el propio HTML — nunca a ojo.
    Resultado, solo en las 4 secciones con contenido clínico real
    construido (los 3 placeholders — `nefrotoxicidad.html`,
    `tratamiento-ira-irc.html`, `trr.html` — se dejaron intactos a
    propósito, ver el criterio ya establecido más arriba de que su
    bibliografía es una lista de lectura futura legítima mientras no
    tengan contenido, y sus enlaces sí se verificaron uno a uno sin quitar
    ninguno, todos resolviendo correctamente):
    - `erc.html`: de 9 entradas, solo la guía **KDIGO 2024** en sí es la
      fuente real de las 12 fichas — las otras 8 (Historia de la ERC,
      Guías KDIGO en español, Enfermedad Renal Crónica, Pautas de
      derivación ERCA, Obesidad y Progresión, Calidad y seguridad,
      Ejercicio Físico, Nefropatía Endémica Mesoamericana) nunca se leyeron
      ni se usaron para ningún párrafo del módulo — eran enlaces de
      lectura futura sin marcar como tal. Se eliminaron las 8, dejando solo
      la entrada KDIGO.
    - `hta.html`: de 9 entradas, se confirmaron 4 como fuente real
      (Esencial-302, Secundaria-409, Renovascular-410, Resistente-408 —
      las 4 releídas íntegras y usadas para las 8 fichas). Las otras 5
      (Guía SEH-LELHA 2022, Hiperaldosteronismo primario, Feocromocitoma/
      Paraganglioma, Trastornos Hipertensivos del Embarazo, Crisis
      hipertensivas) nunca se leyeron como fuente — el contenido de HTA
      secundaria endocrinológica y de embarazo de la Ficha 6/8 sale del
      artículo general de HTA secundaria (409), no de esas monografías
      específicas. Se eliminaron las 5.
    - `fra.html`: de 3 entradas, solo "Insuficiencia Renal Aguda" (690) es
      la fuente real (artículo único del que sale todo el módulo, ya
      documentado como tal). "Lesión Renal Aguda Postcontraste Yodado" y
      "Síndromes Clínicos en Nefrología" nunca se usaron. Se eliminaron
      las 2.
    - Bloque de Fisiología (`nefro-menu.html`): de 8 entradas, se
      confirmaron 5 como fuente real (Fisiología Renal-335, Trastornos del
      Agua-684, Trastornos del Potasio-613, Trastornos del Calcio Fósforo
      y Magnesio-687, Alteraciones del Metabolismo Ácido Base-673 — las 5
      con capítulos propios en el cuaderno de campo). "Síndromes Clínicos
      en Nefrología", "Homeostasis y manejo del potasio en el enfermo
      renal (2020)" y "Diuréticos y Alteraciones Electrolíticas" nunca se
      leyeron como fuente (el contenido de potasio sale íntegro del
      artículo de Trastornos del Potasio 2024, no de la versión 2020 ni de
      un capítulo de diuréticos aparte). Se eliminaron las 3. Además se
      encontró y corrigió una **URL rota real** en la entrada de
      Trastornos del Potasio: le faltaba "hiperpotasemia" en el slug
      (`...hipopotasemia-e-613` en vez de
      `...hipopotasemia-e-hiperpotasemia-613`) — confirmado con
      `WebSearch` que la URL corta nunca aparecía en el array estructurado
      de resultados (solo variantes con el slug completo), señal de que
      apuntaba a una página inexistente.
    - Todas las URLs que se mantuvieron se reverificaron con `WebSearch`
      exigiendo que aparecieran literalmente en el array de "Links"
      estructurado de los resultados (nunca solo en el resumen en prosa),
      mismo método ya establecido en la primera auditoría de bibliografía
      — `WebFetch` a `nefrologiaaldia.org` sigue bloqueado por el proxy de
      salida de red, así que no es una opción para verificar directamente.
  - **Ficha 13 de `erc.html`: "La Unidad de ERCA: equipo, decisiones y
    preparación del TRS"** — añadida a partir de un PDF nuevo aportado por
    el usuario: Arenas MD, Collado S, Fernández Chamarro M. Pautas de
    derivación a la Unidad de Enfermedad Renal Crónica Avanzada (ERCA).
    Nefrología al día (SEN), actualizado 3/10/2024 (28 págs.), archivado en
    `docs/arenas-2024-pautas-derivacion-erca.pdf`. Se evaluó primero el
    contenido completo del PDF para decidir dónde encajaba mejor en la app
    ya existente: se descartó ampliar `trr.html` (esa fuente —Valdenebro et
    al.— es sobre elección de modalidad de TRS en el paciente crítico de
    UCI con FRA, un contexto agudo distinto) y se descartó duplicar la
    Ficha 11 ya existente de `erc.html` ("Derivación, síntomas, modelos de
    atención y diálisis", de fuente KDIGO 2024) porque, aunque ambas tratan
    "derivación e inicio de diálisis", el contenido de este PDF es
    genuinamente nuevo y no se solapa: el proceso concreto de toma de
    decisiones compartida de modalidad de TRS (con sus herramientas reales
    — tarjetas de valores, cuestionario de estilo de vida, agenda de un día
    normal, hoja de ventajas/desventajas, cuestionario de decisión —, sus 3
    fases, y el test de elegibilidad por modalidad con la Tabla de
    indicaciones/contraindicaciones de DP y la Tabla de factores
    pronósticos de tratamiento conservador), el modelo de acreditación
    ACERCA, la composición del equipo interdisciplinar, los criterios
    detallados de inicio de diálisis urgente/no urgente y
    planificado/no planificado (ausentes en la Ficha 11, que solo cubre el
    principio general KDIGO), diálisis peritoneal urgente (guía ISPD),
    hemodiálisis incremental, criterios de acceso vascular, valoración
    psicológica, valoración socioeconómica (con la Escala Socio-Familiar de
    Gijón) y pacientes mentores — ninguno de estos 9 subtemas existía antes
    en ningún punto de Nefrología. Las figuras del PDF (equipo
    interdisciplinar, fases del proceso, tarjetas de valores, cuestionarios)
    son capturas de formularios/plantillas de la consulta, no imágenes
    diagnósticas ni fotografías clínicas — siguiendo el mismo criterio ya
    aplicado en HTA Fichas 1-4/7-8 (flujogramas/tablas fácilmente
    tabulables no se extraen como imagen), se recrearon íntegramente como
    `.kv-row`/`.term-chips`/`.micro-prof-item`/`.data-table` nativos, sin
    extraer ninguna imagen nueva. Se añadieron 8 preguntas de quiz
    (`erc-q089`-`q096`, mismo baseline de 8 usado al arrancar el resto de
    fichas de ERC), llevando el banco de ERC a 96 preguntas y el banco
    combinado de toda la app a **775 preguntas** (767 previas + 8).
  - **Integración del documento S.E.N. 2014 sobre las guías KDIGO**: a
    petición del usuario, se revisó Gorostidi M, Santamaría R, Alcázar R,
    et al. Documento de la Sociedad Española de Nefrología sobre las guías
    KDIGO para la evaluación y el tratamiento de la enfermedad renal
    crónica. Nefrología. 2014;34(3):302-16 (archivado en
    `docs/gorostidi-2014-sen-guias-kdigo-erc.pdf`) — el resumen que la
    S.E.N. hizo en su día de las guías **KDIGO 2012/2013** (definición,
    estadificación, HTA, derivación), es decir, la versión **anterior** a
    la KDIGO 2024 ya usada como fuente principal de `erc.html`. Antes de
    añadir nada se comprobó explícitamente, ficha por ficha, qué
    contenido del documento ya estaba cubierto (para no duplicar) y qué
    era genuinamente nuevo — la mayor parte del documento (definición de
    ERC, categorías G/A, causas, derivación) ya estaba desarrollada con
    más detalle a partir de KDIGO 2024, así que solo se incorporó lo que
    faltaba: 1) **Tabla de prevalencia de complicaciones por grado de FG**
    (HTA/anemia/hiperparatiroidismo/hiperfosfatemia/déficit de vitamina D/
    acidosis/hipoalbuminemia, con cifras reales de Lerin et al. e Inker et
    al.) añadida a la Ficha 1, un dato epidemiológico ausente hasta
    ahora; 2) **valores objetivo concretos de metabolismo óseo-mineral**
    (calcidiol &gt;30 ng/ml, calcio 8,4-9,5 mg/dl, fósforo 2,5-4,5 mg/dl,
    PTHi 35-70/70-110 pg/ml según estadio) añadidos a la Ficha 8, que
    hasta ahora solo decía que KDIGO 2024 remite a una guía aparte sin
    repetir cifras — un hueco real que este documento sí cubre con
    valores prácticos; junto con los **criterios de tratamiento de la
    anemia** (Hb objetivo ≤11,5 g/dl, umbral de IST≤30%/ferritina≤500
    ng/ml para iniciar hierro antes que ESA, Hb&lt;10 g/dl como umbral de
    inicio de ESA), igual de ausentes hasta ahora; 3) **tamaños de efecto
    cuantificados** de las medidas no farmacológicas sobre la PA
    (reducción de peso: 9-23 mmHg; restricción de sal a 4-6 g/día: 4-5
    mmHg; ejercicio 3-5 sesiones/semana: 6 mmHg) añadidos a la Ficha 4,
    enriqueciendo recomendaciones que ya existían pero sin cifra de
    impacto; 4) una **nota histórica** en la Ficha 5 explicando que el
    objetivo &lt;130/80 (albuminuria elevada) / &lt;140/90 (S.E.N.
    2014/KDIGO 2012) no es una versión "menos estricta" del &lt;120 mmHg
    de KDIGO 2024 sin más — son técnicas de medida distintas (clínica
    convencional vs. protocolizada tipo SPRINT), y compararlas cifra a
    cifra sin ese matiz lleva a conclusiones erróneas; y 5) una
    **sección nueva de Vacunaciones** en la Ficha 11 (gripe con FGe &lt;60,
    neumocócica con FGe &lt;30 o síndrome nefrótico/diabetes/
    inmunosupresión, hepatitis B con FGe &lt;30 y riesgo de progresión) —
    un tema ausente por completo en toda la app hasta ahora, confirmado
    por grep antes de escribir nada. Añadida una 3ª entrada a la
    bibliografía de `erc.html` documentando exactamente qué fichas usan
    esta fuente. Ninguna calculadora ni cifra ya existente se tocó ni se
    "corrigió" con las cifras más antiguas de este documento — el
    criterio, como en el resto del proyecto, es que una fuente más
    reciente no invalida una más antigua salvo contradicción directa
    verificada, y aquí no la hubo: son complementarias, cubriendo huecos
    distintos.
  - **`trr.html`** (objetivo de rotación 7, "Terapias de reemplazo renal")
    fue la 4ª de las 6 categorías del mapa del riñón en pasar de
    placeholder a contenido real, a partir de Valdenebro M,
    Martín-Rodríguez L, Tarragón B, Sánchez-Briales P, Portolés J. Una
    visión nefrológica del tratamiento sustitutivo renal en el paciente
    crítico con fracaso renal agudo: horizonte 2020. Nefrología.
    2021;41(2):102-114 — el mismo criterio de siempre: mismo cuaderno de
    campo (`#trr-corkboard`/`#panel-trr-tabs`, `js/modules/nefrologia/trr.js`
    vía `core/corkboard.js`), sin resumir el artículo. **6 fichas**, una por
    cada pregunta que el propio artículo usa como estructura (qué/a
    quién/cuándo/cuánto/cómo/hasta cuándo): Selección de modalidad (HD
    intermitente vs. TRR continua vs. híbridas, con la Tabla 1 y Tabla 2 de
    RCT de mortalidad — ningún RCT ni metaanálisis Cochrane demuestra
    superioridad de ninguna modalidad), Indicaciones (los 3 pilares
    clásicos: sobrecarga de volumen, alteraciones electrolíticas/ácido-base,
    síntomas urémicos), Momento de inicio (Tabla 3 de 5 RCT — inicio precoz
    solo con beneficio claro en posquirúrgicos con TRR continua), Dosis/
    intensidad (Tabla 4 de 6 RCT — ninguna dosis alta &gt;25-35ml/kg/h
    demuestra beneficio general, salvo el subgrupo de quemados con shock
    séptico de RESCUE), Anticoagulación (Tabla 5 heparina vs. citrato — la
    RCA se ha estandarizado como técnica de elección) y Finalización (la
    recuperación de diuresis como criterio principal, transición vía HD
    extendida como puente). Se añadieron 48 preguntas de quiz
    (`js/data/trr-preguntas.js`, `trr-q001`-`q048`, 8 por ficha), con
    `initQuiz` ganando un 5º botón (`btn-trr-repasar`). El banco combinado
    de Nefrología queda en 551 preguntas (503+48).
  - **Pendiente, a petición explícita del usuario ("guarda esa
    información para hacerlo en un futuro no lejano")**: a diferencia de
    Fisiopatología renal/HTA/ERC/FRA, `trr.html` todavía **no** ha pasado
    por la auditoría de 3 agentes (contenido, solo-app vs. solo-fuente vs.
    cruce) ni por un informe de fallos/huecos/interactividad/mejoras — es
    el único bloque de contenido real de Nefrología sin ninguna de las dos
    rondas. Cuando se pida, seguir el mismo método ya documentado arriba
    para HTA/ERC/FRA.
    - **Primera mitad hecha (octubre 2026): revisión interna sin la
      fuente.** El PDF de Valdenebro 2021 no está en `docs/` y la web de
      la revista (`revistanefrologia.com`, `doi.org`) está bloqueada por el
      proxy de esta sesión, así que solo se revisó la app contra sí misma.
      Corregido: "felinefrina" → fenilefrina, "0,35 mmol" → mmol/l, una
      frase duplicada ("equipo multidisciplinar por un equipo
      multidisciplinar"), `trr-q005` (atribuía el 5-10% a "estudios
      españoles"; la ficha atribuye a ellos el 42,4%/38%) y `trr-q032` (la
      opción correcta hablaba de "FRA posquirúrgica" y el RENAL de la Tabla
      4 es FRA oligúrico con edema pulmonar). **Pendiente de cotejar con el
      PDF**, sin tocar: (1) Tabla 3 llama a ELAIN "único ensayo con
      beneficio claro" pero 3 filas más (Bouman, Smith, Sugahara) muestran
      beneficio, y `trr-q018` dice "uno de los pocos"; (2) RESCUE aparece
      a la vez como estudio que "no resuelve la incertidumbre" y como
      "subanálisis" con beneficio en quemados (`trr-q027`, gancho de la
      Ficha 4, que además lo mete en la Cochrane 2016); (3) el 5-10% de
      FRA que requiere TRR frente al 38% de los estudios españoles; (4)
      `trr-q030` dice "se recomienda" alta dosis en hepatopatía/PIC y la
      ficha dice "posible beneficio"; (5) Schoenfelder 2017 se presenta
      como "actualización de la Cochrane"; (6) la Ficha 1 no reproduce
      ninguna tabla de RCT de modalidad (las tablas de la app empiezan en
      la 3), ¿faltan la 1 y la 2 de la fuente?; (7) en la Tabla 3, "Smith
      2013 (STARRT-AKI piloto)" y el resultado positivo de Bouman 2002.
  - **`nefrotoxicidad.html`** (objetivo de rotación 5, "Nefrotoxicidad de
    fármacos") fue la 5ª categoría en pasar de placeholder a contenido
    real, y rompe deliberadamente con el patrón de cuaderno de campo — no
    es contenido teórico para estudiar con preguntas de repaso, es una
    **tabla de referencia densa para consulta rápida a pie de cama**
    (585 fármacos), así que usa el acordeón `.micro-prof-item` ya
    existente (una categoría terapéutica por item, con su `.data-table`
    dentro) más un **buscador de texto libre** (`#farmaco-buscador`) que
    filtra filas en vivo por nombre de fármaco, expandiendo automáticamente
    la(s) categoría(s) con coincidencias y ocultando el resto — patrón
    nuevo en la app, primera vez que se necesita "buscar en una tabla
    grande" en vez de "navegar por temas". Fuente: García Montemayor V,
    Sanchez-Agesta Martínez M, Naranjo Muñoz J. Ajuste de Fármacos en la
    Enfermedad Renal Crónica. Nefrología al día (SEN), actualizado
    24/5/2025 — un documento de **26 tablas** (aminoglucósidos hasta
    misceláneas) con el ajuste de dosis de cada fármaco por aclaramiento de
    creatinina (100-50/50-10/&lt;10 ml/min, con alguna tabla usando 4
    bandas en vez de 3 — Antineoplásicos e Inmunomoduladores y
    Anticoagulantes-Antiagregantes), más suplemento en hemodiálisis y, para
    los antibióticos/antifúngicos/antivirales, dosis en HFVVC
    (hemofiltración veno-venosa continua).
    - **`js/data/ajuste-farmacos-data.js`** son los datos puros: un array
      `categoriasFarmacos` de 25 categorías (las 26 tablas originales,
      consolidando "Misceláneas 1" y "Misceláneas 2" en una sola porque en
      la fuente son la misma tabla partida solo por el salto de página),
      cada una con `tipo` ('antibiotico' con columna HFVVC, o 'estandar'
      sin ella), `bandas` opcional (solo si la tabla no usa las 3 bandas de
      CCr estándar) y `grupos` (subdivisiones internas de la tabla, p. ej.
      "Aminoglucósidos"/"Carbapenem"/"Cefalosporinas" dentro de
      Antibióticos 1). Cada fila es un array plano
      `[nombre, dosisNormal, metodo, ...bandasCcr, hd, hfvvc?]`, no un
      objeto — más compacto para un dataset de 585 filas y sin pérdida de
      legibilidad porque el orden es fijo y está documentado en la
      cabecera del archivo. `nefrotoxicidad.js` (`renderCategoria()`,
      `cabeceraTabla()`) genera el HTML de cada tabla por JS a partir de
      estos datos — igual que otros módulos de la app generan
      `micro-prof-item` por JS (ver CLAUDE.md, sección de ese componente).
    - **Límite de fidelidad reconocido y documentado explícitamente**: la
      fuente es un PDF con 26 tablas en letra muy pequeña; para las 5
      tablas de Antineoplásicos e Inmunomoduladores y para Antibióticos 2
      (Fluorquinolonas/Macrólidos/Miscelánea antibacterianos) la columna
      Hemodiálisis no siempre se distinguía con claridad de la última
      banda de aclaramiento a la resolución de escaneo disponible — en vez
      de inventar un valor, se repitió el de la banda más baja de CCr como
      aproximación conservadora, documentado como comentario al principio
      del propio archivo de datos **y** como aviso visible en la propia
      página (banner amarillo bajo la introducción: "verifica siempre la
      dosis exacta en la fuente original antes de prescribir"). Un puñado
      de nombres de fármaco genuinamente ilegibles a esa resolución se
      omitieron en vez de adivinarlos (p. ej. una fila entre Ribociclib y
      Ripretinib en Antineoplásicos 4). Mismo criterio de seguridad clínica
      ya aplicado antes en la app (p. ej. la Tabla 3 de FRA con el IFR
      ambiguo, reproducida tal cual en vez de "corregida" por criterio
      propio) — nunca fabricar una cifra de dosis, siempre declarar la
      incertidumbre.
    - Sin preguntas de quiz: al ser una tabla de referencia (no contenido
      teórico narrativo), no encaja en el patrón pregunta-respuesta del
      resto de la app — mismo criterio ya aplicado a la Ficha 12 de ERC
      ("Tratamiento por objetivos"), que tampoco tiene preguntas propias
      por el mismo motivo.
  - **`tratamiento-ira-irc.html`** (objetivo de rotación 6) fue el último
    nodo del mapa del riñón en salir de placeholder, pero con un patrón
    deliberadamente distinto al resto: el usuario, al preguntarse si el
    tratamiento de IRA/ERC no estaba ya cubierto por las fuentes de
    `erc.html` (KDIGO 2024) y `fra.html`/`trr.html` (Rodríguez Benítez et
    al. y Valdenebro et al.), confirmó que sí — y pidió reconvertir este
    nodo en una **guía rápida transversal por escenario clínico** en vez
    de duplicar contenido ya construido ficha a ficha. Por tanto **no
    tiene fuente PDF propia**: es pura reorganización/navegación cruzada
    sobre hechos ya citados y verificados en ERC/FRA/TRR (mismo criterio
    que la Ficha 12 de ERC, "Tratamiento por objetivos") — y por el mismo
    motivo tampoco se le añadió bibliografía propia ni preguntas de quiz.
    Estructura: 1) tabla comparativa IRA vs. ERC (instauración, criterio
    temporal, tamaño renal, anemia/hipocalcemia, reversibilidad); 2) 4
    escenarios urgentes en acordeón `.micro-prof-item` (hiperpotasemia
    grave, acidosis metabólica grave, sobrecarga de volumen refractaria,
    síntomas urémicos) con las acciones inmediatas y el umbral de TRR de
    cada uno; 3) 4 escenarios de manejo no urgente (ajuste de fármacos,
    nefroprotección farmacológica, derivación/preparación para diálisis
    crónica, anemia y CKD-MBD); 4) checklist de 6 pasos para las primeras
    horas ante sospecha de IRA. No usa el patrón de cuaderno de campo — es
    una página de navegación rápida, no teoría para estudiar.
    - **Enlaces de navegación cruzada entre módulos** (`.tx-link`, nueva
      clase en `components.css`): un `<button>` (no `<a>`, no navega por
      `href`) con `data-view`/`data-panel`/`data-tab`. `nefrologia/index.js`
      los engancha todos con un único listener genérico en su `init()`: al
      pulsar, hace `nefroLevel.show(view)` y, si lleva `panel`/`tab`, llama
      a `openCorkboardTopic(panel, tab)` — mismo patrón ya usado por el
      Atlas Hematológico para enlazar a un tema de Síndromes Urgentes desde
      `modules/home/index.js`, aquí aplicado por primera vez **entre vistas
      de nivel medio dentro de un mismo módulo** (de `tratamiento` a
      `erc`/`fra`/`trr`/`nefrotoxicidad`). Si se necesita otro enlace
      cruzado de este tipo en el futuro, añade el botón con esos
      `data-*` — no hace falta tocar el JS.
  - **Auditoría de Hematología y Nefrología (a petición del usuario) y
    correcciones aplicadas**: se revisó la estructura y consistencia
    interna de los 4 módulos de Hematología y de Nefrología en conjunto
    (sin releer los PDF fuente línea a línea, a diferencia de la auditoría
    sistemática de ERC) y se aplicaron las correcciones factibles sin
    fuente nueva:
    - **Nefrona interactiva**: 6 de los 7 segmentos no llevaban a ningún
      "contenido clínico" (solo mostraban la info de canales) — mostraban
      el mensaje "🚧 en preparación" al buscar categorías. Se enlazaron 5
      de esos 6 segmentos a fichas ya existentes del cuaderno de campo de
      fisiología (`js/data/nefrona-data.js`, campo `categorias` ahora es
      un array de `{key, etiqueta}` en vez de strings sueltos —
      `nefrona.js` actualizado para pintar la `etiqueta` real en vez de un
      texto genérico "Ver contenido clínico"): glomérulo →
      Filtración/Regulación del filtrado; túbulo proximal → Reabsorción y
      secreción; asa descendente → Regulación del agua corporal; túbulo
      distal → Regulación del potasio/Hipopotasemia; colector →
      Hiponatremia/Hipernatremia/Hiperpotasemia. La rama ascendente
      delgada se dejó deliberadamente sin categoría — es un segmento de
      transporte puramente pasivo sin diana farmacológica ni ficha propia,
      forzar un enlace ahí sería relleno. `categoriaDisponible` en
      `nefrologia/index.js` resuelve cada clave nueva con
      `openCorkboardTopic('panel-fisio-tabs', 'fisio-XXX')` directamente
      (sin cambiar de vista, porque el cuaderno de fisiología vive en la
      misma página que la nefrona).
    - **Etiquetas del mapa del riñón desactualizadas**: los nodos de ERC y
      FRA en `rinon-menu.html` decían "ERC — dx y definición" / "FRA — dx
      y definición", texto que se quedó de cuando esas páginas eran
      placeholders. Corregido a "Enfermedad Renal Crónica" / "Fracaso
      Renal Agudo", reflejando que hoy tienen tratamiento completo.
    - **`diureticos-asa.html` sin bibliografía propia**: era la única
      página de Nefrología sin su tarjeta 📚 — se le añadió, reutilizando
      el enlace a "Diuréticos y Alteraciones Electrolíticas" de
      nefrologiaaldia.org que se había retirado de la bibliografía de
      `nefro-menu.html` en la auditoría anterior (por no ser fuente real
      del cuaderno de fisiología) pero que sí es la fuente correcta de
      esta página en concreto.
    - **Enlace cruzado entre especialidades**: `nefrologia/index.js`
      expone `irANefrotoxicidad()` en el objeto que devuelve `init()`
      (junto a `volverAlMapa`), y `home/index.js` engancha un listener
      genérico para botones `.especialidad-link[data-target]` que hace
      `topLevel.show('nefrologia')` + `nefrologiaApi.irANefrotoxicidad()`.
      Usado desde la Matriz de Combate MDR y la calculadora PK/PD de
      Neutropenia Febril (`tratamiento-dirigido-view.html`), cuyos
      antibióticos ya están en la tabla de 585 fármacos de Nefrología —
      mismo patrón `.tx-link` reutilizado, pero cruzando el switcher raíz
      de especialidades en vez de solo el switcher interno de un módulo.
      **Generalizado más adelante** (ver "Segundo informe: mapa de
      solapamiento con Nefrología..." en el bloque Vías Urinarias de
      Fisiopatología UCI): el listener de `.especialidad-link` ahora
      también acepta `data-especialidad="nefrologia"|"fisioUci"` +
      `data-view`/`data-panel`/`data-tab` genéricos (además del
      `data-target="nefrotoxicidad"` original, que se mantiene sin
      cambios), y `fisio-uci/index.js` expone el mismo `irAFicha()` que
      `nefrologia/index.js` — el patrón ya no está limitado a
      Nefrotoxicidad ni a una sola dirección.
    - **"Fuentes y Evidencia" solo documentaba Neutropenia Febril**: las
      otras 3 categorías de Hematología (Reconocimiento, Síndromes
      Urgentes, Trasplante) tienen su propia bibliografía al final de su
      página, pero no aparecían en este índice central. Se añadieron 3
      tarjetas más (10-12) agregando esas mismas fuentes ya citadas — sin
      fuente nueva, solo agregación.
    - **Bibliografía de CID/PTT/SLT convertida a enlaces clicables**:
      `sindromes.html` citaba sus fuentes como texto plano (`<p>`) en vez
      del patrón `.biblio-link`/`.biblio-nota` ya estandarizado en
      Nefrología. Se verificaron y confirmaron por `WebSearch` los DOI de
      las 6 fuentes (Iba 2025, Levi 2009, Zheng 2025, Coppo 2010/French
      score, Bendapudi 2017/PLASMIC score, Chan 2025, Cairo/Bishop 2004) y
      se enlazaron.
    - **Ficha "Terapias Dirigidas" de Reconocimiento** (la más corta de
      las 9, fiel a su fuente pero comparativamente pobre): se le añadió
      un enlace `🔗 Ver módulo completo de CAR-T →` que salta al módulo
      completo de Trasplante/CAR-T (indicaciones, SLC/CRS, ICANS) — nuevo
      patrón `data-atlas-route`, un listener genérico en `home/index.js`
      que reutiliza las mismas rutas ya definidas en `rutasAtlas` del
      Atlas Hematológico, sin duplicar lógica de navegación. No se amplió
      el contenido de la ficha en sí (el propio Table 4 de Azoulay que la
      sustenta ya está completo) para no fabricar contenido clínico sin
      releer la fuente.
    - **Pendiente, requiere fuente nueva del usuario**: ampliar "Manejo
      Citopenias" más allá de Neutropenia Febril — no se puede fabricar
      contenido clínico de anemia/trombocitopenia sin una fuente real.
    - **Pendiente, a petición explícita del usuario ("guarda esa
      información para hacerlo en un futuro no lejano")**: la especialidad
      **Hematología** (Neutropenia Febril, Reconocimiento Temprano,
      Síndromes Urgentes, Trasplante TPH) solo ha pasado por esta
      auditoría estructural/de consistencia (bibliografía, enlaces
      cruzados, navegación) — a diferencia de Fisiopatología
      renal/HTA/ERC/FRA en Nefrología, o del bloque "Hematología y
      Hemostasia" de Fisiopatología UCI, **nunca** ha tenido una auditoría
      de fidelidad de contenido releyendo sus PDF/PNT fuente frase a
      frase (método de 3 agentes u otro), ni un informe de
      fallos/huecos/interactividad/mejoras. Cuando se pida, seguir el
      mismo método ya documentado para HTA/ERC/FRA — con la salvedad de
      que varias fuentes de Hematología son PNT internos del Servicio, no
      artículos públicos, así que conviene confirmar con el usuario qué
      documentos concretos releer antes de empezar.
  - **Sistema de repaso/quiz añadido a toda Hematología** (176 preguntas
    nuevas, repartidas en 34 temas, 5-6 por tema): hasta ahora Hematología
    era la única especialidad sin `initQuiz()` — 4 bancos nuevos, uno por
    módulo, mismo formato `{id, tema, enunciado, opciones, correcta,
    explicacion}` que los de Nefrología: `js/data/neutropenia-febril-preguntas.js`
    (26, 5 temas: triaje/MASCC/CISNE, catéter, diagnóstico, empírico,
    dirigido-MDR), `js/data/reconocimiento-preguntas.js` (45, los 9 temas
    del cuaderno de campo), `js/data/sindromes-urgentes-preguntas.js` (15,
    CID/PTT/SLT), `js/data/trasplante-preguntas.js` (90, los 18 temas
    repartidos entre Introducción/CAR-T/Complicaciones). Un botón
    "🎯 Repasar" por módulo (`btn-nf-repasar`, `btn-recon-repasar`,
    `btn-sind-repasar`, `btn-tph-repasar` — este último en
    `trasplante-menu.html`, cubre los 18 temas de sus 3 subvistas desde un
    único punto de entrada).
    - **Bug real encontrado y corregido al integrar esto**: el modal de
      quiz (`#quiz-modal-overlay`) es un partial único compartido por TODA
      la app, y la propia `quiz.js` ya avisaba en un comentario de que solo
      puede existir **una** llamada activa a `initQuiz()` por página. Al
      añadir el quiz de Hematología con una llamada en `home/index.js`,
      quedaron **dos** llamadas activas simultáneas (esa nueva + la ya
      existente en `nefrologia/index.js`) — cada botón "Repasar" disparaba
      *ambas* instancias a la vez sobre los mismos elementos del DOM
      compartido, y la instancia cuyo banco no tenía preguntas para el tema
      elegido intentaba renderizar un array vacío (`orden[0]` undefined),
      lanzando `Cannot read properties of undefined (reading 'enunciado')`
      — capturado con Playwright al probar el flujo completo de una
      pregunta, no solo con el `check` de sintaxis. Solucionado moviendo la
      única llamada a `initQuiz()` a `js/main.js` (el verdadero punto de
      entrada que inicializa ambas especialidades), con `home/index.js` y
      `nefrologia/index.js` exportando ahora `quizTriggerId`/`quizBanco`/
      `quizTemas` en vez de llamar a `initQuiz()` cada uno por su lado —
      `main.js` los fusiona en una sola llamada. El banco combinado de toda
      la app queda en **727 preguntas** (551 Nefrología + 176 Hematología).
      Si se añade contenido a un especialidad nueva en el futuro con su
      propio quiz, sigue este mismo patrón: exportar banco/temas/triggerId
      desde el índice de la especialidad, nunca llamar a `initQuiz()`
      dentro de un módulo de especialidad.
  - **Auditoría de 3 agentes de "Fisiopatología renal"**: a petición
    explícita del usuario, se auditaron las 18 fichas de este cuaderno de
    campo (`nefro-menu.html`) con un método de doble revisión ciega +
    arbitraje: un **Agente 1** revisó solo el contenido ya escrito en la
    app (sin ver ninguna fuente externa), un **Agente 2** revisó de forma
    independiente los 6 PDF de bibliografía (sin ver ningún archivo del
    repo), y un **Agente 3** comparó ambos informes y auditó explícitamente
    que no hubiera "fuga de información" entre ellos antes de fiarse de la
    comparación — detectó una fuga puntual y autocontenida en el informe
    del Agente 2 (una frase mencionó "el CLAUDE.md de la app"), la descontó
    del resto del análisis, y concluyó que el resto de ambos informes eran
    sustancialmente independientes. Este patrón (1: solo app, 2: solo
    fuente, 3: cruce + verificación de fuga) es el que replicar si se
    piden auditorías similares de otras secciones — cada agente debe
    recibir instrucciones explícitas de NO tocar los archivos del otro.
    Correcciones aplicadas tras la auditoría (confirmadas por el Agente 3
    contra la bibliografía, no solo por el Agente 1):
    - **Herencia del síndrome de Gitelman**: estaba como "autosómica
      dominante" en `agua-potasio-data.js` (`sindromesHipopotasemicos.gitelman.herencia`)
      y en la explicación de `nefro-q086`, contradiciendo a la propia
      ficha "Ácido-base: alcalosis" (que sí decía correctamente
      "autosómica recesiva" para Bartter Y Gitelman). El Agente 3 rastreó
      el origen: es una **errata real del PDF fuente** de Hipopotasemia
      (Tabla 3), pero los documentos de Ácido-Base y de Ca-P-Mg, además
      del consenso médico establecido, confirman que es recesiva —
      corregido en ambos sitios.
    - **Umbral de corrección de hiponatremia en 24h**: la ficha decía
      "8 mEq/l/24h" como límite plano europeo, mientras que `nefro-q063`
      dudaba entre 8 y 10 en su enunciado/explicación (con la opción "8"
      marcada como correcta pese a que la propia explicación decía 10).
      La bibliografía confirma **10 mEq/l en las primeras 24h, 8 mEq/l en
      periodos de 24h posteriores** (sin superar 18 mEq/l en 48h) —
      unificado en la ficha y en la pregunta (opción/respuesta correcta
      corregidas a "10 mEq/l").
    - **Cifra de mortalidad de la hiperpotasemia**: el kv-row mezclaba,
      bajo la misma etiqueta "Mortalidad", una cifra de incidencia como
      motivo de ingreso en urgencias (mal citada como "0,5-2%") con la
      mortalidad real entre los ya ingresados (2%). Separado en dos
      kv-row con etiquetas propias ("Incidencia como motivo de ingreso":
      0,5-1%, cifra corregida contra la fuente; "Mortalidad entre los
      ingresados": 2%, ya era correcta).
    - **Bug del Δ-ratio en el clasificador ácido-base** (`calcAcidoBaseClasificador`,
      `fisiologia.js`): el cálculo del Δ-ratio solo comprobaba
      `hco3 < 24`, sin exigir que el trastorno primario ya clasificado
      fuera una acidosis metabólica (`ph < 7.35`) — con valores
      plausibles de una alcalosis respiratoria crónica compensada e
      hiato aniónico algo elevado, aparecía un mensaje añadido de
      "acidosis metabólica con hiato elevado" superpuesto a la
      interpretación correcta de alcalosis. Corregido añadiendo la
      condición `ph < 7.35`; verificado con Playwright que el caso límite
      ya no dispara el mensaje incorrecto.
    - **Discontinuidad visual del simulador de TFG** (`calcTfgSimulador`):
      el ancho de la barra "aferente" saltaba bruscamente en los límites
      PAM=80 y PAM=180 (70%→80% y 40%→25%) al pasar de la fórmula del
      tramo central a un valor fijo en los tramos extremos. Corregido
      sustituyendo los valores fijos por fórmulas que empalman
      continuamente en ambos límites (`70 + (80−pam)×0,5`, tope 85;
      `40 − exceso×0,5`, suelo 20) — verificado con Playwright que ya no
      hay salto en PAM 79/80/81 ni 179/180/181. La barra "eferente", que
      nunca cambiaba (bug menor, valor fijo en 45%), se dejó tal cual
      siguiendo la recomendación explícita del Agente 1 de aclarar en vez
      de inventar una nueva curva fisiológica sin verificar contra
      fuente — se añadió una nota bajo el simulador explicando que esa
      barra se mantiene constante en este modelo simplificado.
    - **Sin tocar** (fuera del alcance de "correcciones confirmadas",
      pendiente de decisión editorial): dos preguntas de quiz de viñeta
      clínica (`nefro-q137`, `nefro-q138`) citan la fórmula clásica de
      Winters para la compensación respiratoria esperada, mientras que la
      ficha "Ácido-base: acidosis" y su clasificador interactivo usan una
      fórmula distinta (compensación 0,85-1,2 mmHg por mEq/l "desde 25").
      Ninguno de los 6 PDF de bibliografía audita a favor de una u otra —
      el propio Agente 3 lo marcó como duda para revisión humana, no como
      error confirmado.
  - **Auditoría de 3 agentes de "HTA"**: mismo método de 3 agentes que
    Fisiopatología renal, aplicado a las 8 fichas de `hta.html` contra los
    5 PDF de bibliografía (con el hallazgo colateral de que
    `HTA_2_.pdf`/`HTA_SECUNDARIA.pdf` son el mismo archivo — MD5
    idéntico —, así que solo hay 4 documentos únicos). El Agente 2 tuvo
    una fuga puntual y autocontenida (una frase final mencionando que
    ninguno de los PDF de HTA cita KDIGO 2024 "que si se hubiera usado
    como referencia cruzada en otra sección del proyecto..." — delata que
    sabe que existe una sección de ERC basada en KDIGO), descontada del
    resto del informe igual que en la auditoría anterior. Varios
    hallazgos del Agente 1 resultaron ser fieles a la fuente y no errores
    de la app (el Agente 2 los CONTRADIJO, no los confirmó) — aplicar
    ciegamente todo lo que señala un agente de auditoría de solo-app,
    sin el cruce del Agente 2, habría "corregido" contenido que en
    realidad ya era correcto:
    - **Dosis de espironolactona distintas en fichas 4/5/7**: NO era un
      error — la propia bibliografía usa 3 dosis distintas según
      indicación (25-50 mg/día 3er escalón general; 12,5-50 mg dosis de
      inicio en HTA resistente; 25→100 mg/día en hiperaldosteronismo
      primario). Se añadió una nota aclaratoria en la ficha 5 explicando
      que son indicaciones distintas, en vez de unificar las cifras.
    - **"Fenilalanina"/"neonatálico" en la tabla de IMAO** (ficha 8):
      confirmado que ambos términos están literalmente en la Tabla 5 del
      PDF original (con alta probabilidad, error/artefacto de la propia
      publicación fuente) — no son un error de transcripción de la app.
      Se añadió una nota bajo la tabla señalando que es una posible
      errata de la fuente, sin sustituir los nombres por una suposición
      no verificada.
    - **Fórmula del Índice de Resistencia** (ficha 6, `IR = [(1 −
      Ved/Vsmax) − 100]`): confirmado que esta forma matemáticamente
      incoherente con el corte diagnóstico &gt;80 (resta en vez de
      multiplicación por 100) aparece palabra por palabra en el PDF
      original — no es un fallo de transcripción de la app. Mismo
      criterio que el precedente ya documentado del IFR en Fracaso Renal
      Agudo: se mantuvo la fórmula tal cual la publica la fuente, con una
      nota aclaratoria del problema aritmético, en vez de "corregirla"
      silenciosamente a la forma multiplicativa por criterio propio.
    - **Doppler renal — cifra de rendimiento diagnóstico "sensibilidad
      85%/especificidad 92%"** (pregunta `hta-q044`): el Agente 1 había
      concluido que esta cifra del quiz no estaba respaldada por la
      ficha; el Agente 2 la encontró literalmente en la fuente (artículo
      general de HTA secundaria) como cifra de rendimiento de la prueba
      inicial — el problema real era que la ficha no la incluía. Añadida
      a la ficha 6.
    - **"~15%" de prevalencia de HTA resistente** (pregunta `hta-q035`):
      mismo patrón — cifra de síntesis confirmada en el artículo general
      de HTA secundaria, ausente en la tabla detallada por fuente que ya
      tenía la ficha 5 (NHANES/Kaiser/Registro Español/ERC). Añadida como
      cifra resumen antes de esa tabla.
    - **"Subtipo más frecuente" duplicado en hiperaldosteronismo
      primario** (ficha 7): la ficha etiquetaba tanto la hiperplasia
      suprarrenal bilateral como el adenoma productor de aldosterona como
      "(subtipo más frecuente)", una contradicción interna. La fuente
      real usa una fórmula plural ambigua ("las formas más frecuentes son
      hiperplasia bilateral y adenoma", sin declarar una única ganadora)
      — reformulado siguiendo esa misma fórmula plural en vez de repetir
      el superlativo en cada entrada.
    - **"1 de cada 4" con HTA refractaria** (`hta-q037`, explicación):
      cifra sin respaldo encontrado en ninguno de los 4 documentos únicos
      leídos por el Agente 2 — eliminada de la explicación, dejando solo
      la cifra sí confirmada ("1 de cada 3" para HTA resistente general).
    - **Sin tocar** (dudas para revisión humana, sin arbitraje posible o
      pendientes de relectura dirigida): el umbral de velocidad Doppler
      "elevada" es realmente inconsistente entre los propios documentos
      de la bibliografía (&gt;180 cm/s en el artículo general de HTA
      secundaria vs. &gt;200-300 cm/s en la monografía específica de
      renovascular) — se añadió una nota en la ficha 6 declarando ambos
      valores en vez de elegir uno; el rango de dosis de ARA II
      "8-1.200 mg/día" y de betabloqueantes "2,5-480 mg/día" de la tabla
      de fármacos (ficha 4) no se pudo confirmar ni negar cifra por cifra
      contra la Tabla 17 de la fuente (pendiente de relectura dirigida de
      esa tabla concreta); la contraindicación "Taquiarritmias" en
      calcioantagonistas dihidropiridínicos tiene un indicio débil de
      posible confusión con la subclase no dihidropiridínica, sin
      confirmación textual directa.
  - **Auditoría de 3 agentes de "ERC"**: mismo método de 3 agentes que
    Fisiopatología renal y HTA, aplicado a las 13 fichas de `erc.html`,
    `erc.js` (calculadoras) y `erc-preguntas.js` contra los 3 PDF de
    bibliografía (KDIGO 2024, 198 páginas en 2 partes, y el PDF de Arenas
    sobre la Unidad de ERCA que sustenta la Ficha 13). Sin fuga de
    información real en ninguna dirección. A diferencia de las 2
    auditorías anteriores, esta incluyó dos "dudas" que no se podían
    resolver con los PDF ya disponibles (los ensayos STOP-ACEi y FEATHER,
    citados por nombre pero sin cifras exactas en KDIGO) — se abrieron con
    `WebSearch` contra las publicaciones originales, siguiendo el mismo
    criterio de nunca fabricar una cifra sin verificarla:
    - **Bug de código confirmado sin necesitar bibliografía** en
      `calcCgaCategorizador()`: el guard `acr === ''` se comprobaba
      DESPUÉS de convertir el valor con `Number()` (`Number('') === 0`,
      nunca `''`) — al borrar el campo ACR tras haber calculado con un
      valor real, la calculadora recalculaba silenciosamente con ACR=0 en
      vez de detenerse, mostrando una categoría A1 falsa. Corregido
      comprobando `acrEl.value === ''` antes de convertir a número.
      Verificado con Playwright: tras introducir ACR=350 y borrarlo, la
      calculadora ya no recalcula a A1, se abstiene y mantiene el último
      resultado válido.
    - **Inconsistencia app↔app confirmada, sin necesitar bibliografía**
      en `calcPanelAnalitico()`: el umbral de "hiperpotasemia grave" en el
      código empezaba en &gt;6,4 (es decir, ya clasificaba 6,41-6,49 como
      grave), mientras que la propia Ficha 7 de la app define grave como
      "K⁺ ≥6,5 mmol/l" y moderada como "6,0-6,4 mmol/l". Corregido el
      corte del código a &lt;6,5 para "moderada" / ≥6,5 para "grave",
      alineándolo con el texto ya existente.
    - **Mapa de riesgo de "5 niveles" en el texto de la Ficha 1**
      (`erc-definicion`): mencionaba un patrón "verde→amarillo→naranja→
      rojo→rojo oscuro" (5 niveles) que contradecía tanto la matriz real
      de KDIGO (4 niveles) como el propio código de `erc.js`
      (`MAPA_RIESGO`/`RIESGO_TEXTO`, ya con 4 niveles correctos desde el
      principio). Corregido el texto a 4 niveles.
    - **Descenso de FGe tras bloqueo del SRAA: 25% vs. 30%**
      (`erc-pa-raas`): el "algoritmo en 3 ramas" de la propia ficha ya
      usaba correctamente ≥30%, pero la tabla de monitorización semanal
      justo debajo, y la pregunta `erc-q036`, usaban 25% para el mismo
      punto de decisión — contradicción interna real. Verificado
      releyendo directamente el PDF de KDIGO (Practice Point 3.6.4 y el
      algoritmo de la Figura 21): el umbral correcto es ≥30% ("$30%
      decrease in eGFR ... should be a trigger to investigate"), no 25%.
      Corregidos la tabla y la pregunta del quiz a 30%.
    - **Tabla de umbrales KFRE con una cifra sin respaldo**
      (`erc-riesgo`): la fila "&gt;10% a 5 años (o &gt;2% a 2 años en
      G4-G5)" mezclaba de forma incorrecta un umbral a 5 años con uno a 2
      años y añadía una cifra ("&gt;2% a 2 años en G4-G5") no presente en
      la fuente. Releyendo KDIGO directamente (Practice Points 2.2.1-2.2.3):
      son 3 umbrales reales y distintos — riesgo a 5 años &gt;3-5% →
      derivación a nefrología (ya correcto en la fila anterior de la
      tabla); riesgo a 2 años &gt;10% → determinar el momento de la
      atención multidisciplinar; riesgo a 2 años &gt;40% → educación de
      modalidad y preparación de TRS. Tabla reescrita con los 3 umbrales
      reales tal como los cita la fuente.
    - **Ensayo STOP-ACEi con FGe basal y FGe de resultado confundidos**
      (`erc-nefroproteccion`): el texto decía "411 participantes con FGe
      medio de 13 ml/min/1,73m² fueron aleatorizados", pero verificando
      la publicación original (NEJM 2022) por `WebSearch`, el FGe basal
      mediano al azar era 18 ml/min/1,73m² — el "13" era en realidad el
      FGe medio a los 3 años (resultado final, no la cifra basal: 12,6 en
      el grupo de suspensión vs. 13,3 en el de continuación, sin
      diferencia significativa). Corregido para citar ambas cifras en su
      lugar correcto.
    - **Verificadas como correctas, sin cambios**: la atribución de la
      definición de hiperuricemia (≥6,8 mg/dl) al American College of
      Rheumatology (`erc-q061`) está literalmente en KDIGO ("The American
      College of Rheumatology defines hyperuricemia as..."); el tamaño
      muestral "n=467" del ensayo FEATHER citado en la Ficha 8 coincide
      con la publicación original (467 personas incluidas, 443
      aleatorizadas);
      la cifra de biopsia renal "hematoma perirrenal ~16%" no era una
      contradicción con "12-22% según las series" — son la misma cifra
      agrupada de un metaanálisis de 14 estudios con su IC95%, solo mal
      redactada (corregido a "incidencia estimada del 16% (IC95%
      12-22%)"); la nuance de iSGLT2 "con o sin albuminuria significativa"
      ya estaba bien matizada en la propia ficha (con nota explícita del
      umbral ACR≥200 en no diabéticos/sin IC) — solo faltaba trasladar el
      mismo matiz a la explicación de `erc-q041`, que repetía la
      formulación simplificada.
    - **Contenido añadido tras confirmar el hueco**: la cifra de
      prevalencia de fatiga en la población CONTROL sin ERC (34%, IC95%
      0-70%, de la misma Figura 49/revisión sistemática ya citada para el
      70% en ERC) — presente en KDIGO pero ausente de la Ficha 11, se
      añadió como contraste explícito junto al 70%.
    - **Nota de reconciliación añadida, sin cambiar cifras** (Ficha 13,
      `erc-unidad-erca`): los umbrales de FG para inicio de diálisis de
      la Ficha 13 (protocolo Arenas/SEN: FGe 8-10 habitual, límite duro
      6-7 aunque asintomático) y de la Ficha 11 (KDIGO: FG 5-10 "habitual
      pero no invariable", basado en clínica según el ensayo IDEAL) son
      compatibles pero no idénticos — ambos agentes, de forma
      independiente, señalaron esta fricción real entre las dos fuentes.
      No se cambió ninguna cifra (cada ficha es fiel a su propia fuente);
      se añadió una nota aclarando que el umbral duro de la Ficha 13 actúa
      como límite de seguridad práctico dentro del mismo rango que KDIGO
      cita como "habitual", no como sustituto del criterio clínico.
  - **Auditoría de 3 agentes de "FRA"**: mismo método de 3 agentes que
    Fisiopatología renal, HTA y ERC, aplicado a las 9 fichas de `fra.html`,
    `fra.js` (calculadoras) y `fra-preguntas.js` contra el único PDF de
    bibliografía (Rodríguez Benítez, Ramos Terrades, Poch. Insuficiencia
    Renal Aguda. Nefrología al día, 2025). Sin fuga de información
    sustancial (un desliz autocontenido del Agente 1, citando "36
    páginas/113 referencias" del artículo — dato ya presente en este
    mismo `CLAUDE.md`, no algo que requiriera leer el PDF prohibido).
    Todas las dudas se abrieron con relectura/verificación dirigida, sin
    dejar ninguna sin resolver, siguiendo el mismo criterio ya usado en
    la auditoría de ERC:
    - **Bug real en `calcEstadioKdigo()`** (`fra.js`): clasificaba
      Estadio 3 con solo `creatinina actual ≥4 mg/dl`, sin exigir el
      aumento agudo (`≥0,5 mg/dl en 48h` o `1,5× basal`) que exige la
      propia Tabla 1 de la ficha — un paciente con ERC avanzada cuya
      creatinina bajaba de 10 a 4,5 (mejorando claramente) se marcaba
      igual como falso Estadio 3. Corregido a
      `razon >= 3 || (actual >= 4 && (delta >= 0.5 || razon >= 1.5))`;
      verificado con Playwright que el caso de "mejoría" ya no dispara
      Estadio 3, y que los casos reales de Estadio 3 (por razón ≥3, o por
      creatinina ≥4 con aumento agudo genuino) se siguen detectando bien.
    - **"≤68h" — hallazgo de máxima confianza**: typo real de la ficha
      (`fra-diagnostico`, debería ser "≤48h", el marco temporal que usa
      KDIGO en el resto del documento) coincidente EXACTAMENTE con la
      misma cifra "68h" que el Agente 2 encontró, de forma
      completamente independiente, en la Figura 1 del PDF original — no
      es un error introducido por la app, es una errata real de la
      fuente, fielmente reproducida. Añadida una nota aclaratoria en vez
      de "corregir" la cifra por criterio propio (mismo patrón que el
      IFR de esta misma sección y la fórmula del IR de HTA).
    - **Guard clause de "0 tratado como vacío"** en ambas calculadoras
      (`fra.js`): `if (!nao || ...) return;` congelaba silenciosamente
      el resultado si el sodio en orina era 0 (valor legítimo — mín. del
      campo es `0` — en hipoperfusión grave con retención ávida de
      sodio). Corregido comprobando `.value === ''` antes de convertir a
      número, manteniendo el guard de división por cero para los
      denominadores (Nas, Cro) que sí no pueden ser 0. Verificado con
      Playwright: Nao=0 ahora calcula FENa=0,00% en vez de congelarse.
    - **NephroCheck® "FDA 2012"**: confirmado que el PDF original dice
      literalmente "2012" — verificado por `WebSearch` contra el propio
      documento de la FDA (den130031) que el clearance real fue en 2014.
      Añadida una nota junto a la cifra señalando la posible errata del
      artículo, sin sustituir la cifra citada por la fuente.
    - **"Proteinuria &gt;500 mg/dl" en el criterio de SHR-IRA**:
      confirmado que el PDF dice literalmente "mg/dl" — verificado por
      `WebSearch` que los criterios estándar del International Club of
      Ascites (ICA) usan mg/**día** (500 mg/24h), no mg/dl (una
      concentración así sería clínicamente extrema). Añadida una nota
      aclaratoria junto a la cifra, mismo criterio que el resto de
      erratas de fuente ya documentadas.
    - **Descartado tras el cruce, sin necesitar cambios**: la diferencia
      "0,3 mg/dl" (criterio general de IRA) vs. "0,5 mg/dl" (criterio de
      aumento agudo específico del Estadio 3) no era una inconsistencia
      — son dos criterios reales y distintos de la misma Tabla 1 KDIGO,
      ambos ya bien transcritos en la ficha.
    - **Notas de reconciliación añadidas, sin cambiar cifras**: la
      incidencia de IRA-sepsis "40%" (metaanálisis general, Ficha 2) y
      "45-70%" (específica de UCI, Ficha 3) — el Agente 2 confirmó que
      ambas cifras son reales, de secciones distintas del mismo artículo,
      sin que la propia fuente las reconcilie tampoco; y la redacción
      "Hiperpotasemia &gt;6,5 mmol/l **y** acidosis metabólica con pH
      &lt;7,2, refractarias" (Ficha 7, indicaciones urgentes de TRS) —
      fiel a la fuente pero clínicamente ambigua (podría leerse como
      exigir ambas a la vez), aclarada con una nota de que cada una es
      indicación urgente independiente si es grave y refractaria por sí
      sola.
    - Añadidas también las referencias bibliográficas concretas
      (Castro I et al., Clin Kidney J. 2022; Fayad AI et al., Cochrane
      2022) al metaanálisis y la revisión Cochrane de la Ficha 7, que
      antes se citaban sin autor.
- **Primer lote de PNT del propio hospital, análogo al de los PNT internos de
  Hematología/Trasplante**: el usuario empezó a mandar, en 2 tandas de 5
  documentos cada una, los Procedimientos Normalizados de Trabajo (PNT) reales
  del Servicio de Nefrología del HUGCDN. Mismo criterio ya establecido en el
  proyecto para este tipo de fuente (ver Trasplante de Hematología): nunca
  reproducir el documento original ni los nombres del personal que figura en
  él, extraer solo el contenido clínico y reescribirlo con la voz propia de la
  app, citando de forma genérica el código del PNT. Antes de tocar el
  repositorio, se hizo un análisis documento-por-documento y un informe de
  dónde encajaba cada uno (ampliar una ficha ya existente, justificar una
  ficha/nodo nuevo, o descartar por falta de contenido clínico real) — mismo
  método ya usado para el lote de PNT de Trasplante en Hematología.
  - **3 documentos descartados por no aportar contenido clínico** (pura
    logística/programa, sin datos diagnósticos ni terapéuticos): PNT-NEF-09
    (Manejo y seguimiento de la patología infecciosa en ERCA — describe solo
    la mecánica de la sesión conjunta semanal con Infecciosas, sin citar
    ninguna infección/tratamiento concreto), PNT-NEF-63 (Atención al
    paciente: Paciente Experto — programa de apoyo entre pacientes por
    modalidad de TRS, 3 sesiones grupales, sin contenido clínico), e
    IT-NEF-31 (Recogida de orina de 24 horas — instrucción técnica de
    enfermería sin contenido diagnóstico).
  - **3 fichas ya existentes ampliadas** con contenido real de PNT que no
    duplicaba lo ya escrito:
    - `fisio-hiponatremia` (Nefrología → Fisiología/electrolitos), con
      PNT-NEF-10 (Manejo hospitalario de la hiponatremia): protocolo
      práctico de infusión de suero salino hipertónico para hiponatremias
      graves/agudas (3 ampollas ClNa 20% en 250ml, inicio a 11 ml/h, tabla
      de ajuste por controles a las 4h y luego cada 6h), el **índice de
      Fürst** ((Na⁺+K⁺)orina/Na⁺plasma) para graduar la restricción hídrica
      en hiponatremias leves/crónicas, y el **algoritmo completo de
      titulación del tolvaptán** (inicio 7,5 mg/día, control a 6h, luego
      12-24h, doblando dosis hasta 60 mg/día máx.) — la ficha ya tenía la
      calculadora de Adrogué-Madias y las guías europeas/americanas, pero no
      este nomograma práctico paso a paso ni el índice de Fürst ni la
      titulación de tolvaptán, verificado antes de escribir releyendo la
      ficha completa para no duplicar contenido.
    - `fisio-hiperpotasemia` (mismo bloque), con HUGCDN-NEF-PT-01 (Manejo de
      la hiperpotasemia aguda y crónica): la ficha ya tenía una tabla de
      tratamiento agudo casi idéntica (mismas dosis de gluconato
      cálcico/insulina-glucosa/captores), así que la ampliación fue
      quirúrgica — se añadió solo la dosis IV de salbutamol (0,5 mg en
      100 ml de glucosado 5% en 15 min, ausente hasta ahora, solo estaba la
      vía inhalada), el **algoritmo de titulación de iSRAA/ARM/ARNi por
      nivel de potasio** (K&gt;6,5 suspender+reductor; K 5-6,5 según dosis ya
      alcanzada; K&lt;5 titular con normalidad — ausente por completo) y el
      **algoritmo de seguimiento tras el alta** (con/sin seguimiento previo,
      con/sin comorbilidad de riesgo, con/sin ingreso).
    - Ficha 10 de ERC (`erc-farmacos`, "Manejo de fármacos, nefrotoxicidad y
      contraste"), con PNT-NEF-20 (Prevención de la nefropatía inducida por
      contraste iodado): **calculadora interactiva del esquema de riesgo de
      Mehran** (`calcMehran()` en `erc.js` — score aditivo simple de 6
      factores clínicos + volumen de contraste + función renal, con las 4
      bandas de riesgo de NIC/diálisis del estudio original; mismo criterio
      de seguridad clínica ya aplicado a KFRE/Cairo-Bishop/ISTH-DIC: un
      score aditivo simple sí se implementa, una regresión compleja no),
      tabla de niveles de evidencia, **los contrastes radiológicos reales
      usados en este hospital** por servicio (Hexabrix/Visipaque/Optiray/
      Xenetix/Omniscan, con sus osmolaridades/viscosidades — información "a
      pie de cama" genuina), y el protocolo de profilaxis en 8 pasos
      (hidratación, NAC, retirada de nefrotóxicos, corrección de
      hiperglucemia/anemia, monitorización a 48/72h, atorvastatina,
      bicarbonato para estudios urgentes).
  - **Cross-link reforzado Vías Urinarias → ERC**: el micro-prof-item
    "Nefropatía por contraste" de la Ficha 3 de Vías Urinarias
    (Fisiopatología UCI) solo mencionaba el tema de pasada; se añadió un
    botón `.especialidad-link` real hacia la Ficha 10 de ERC ya ampliada, y
    una **nota de fidelidad explícita** documentando que esta fuente (Libro
    Azul) no recomienda la NAC mientras que el PNT hospitalario sí la
    incluye (nivel de evidencia B) — discrepancia real entre fuentes
    distintas, mismo criterio de nunca elegir un "ganador" por criterio
    propio ya aplicado al resto de discrepancias documentadas en el
    proyecto (IFR de FRA, TAPSE de Cardiología, etc.).
  - **8º nodo nuevo del mapa del riñón: "Trasplante renal y enfermedades
    glomerulares"** (`js/modules/nefrologia/trasplante-renal.html`+`.js`,
    posicionado en la zona superior del riñón, `left:50%; top:8%`, sin
    solapar con los 7 nodos ya existentes). Con los 2 documentos de
    inmunosupresión del lote anterior (Timoglobulina, C. difficile) más 2
    nuevos del segundo lote (Ciclofosfamida, Rituximab), el volumen de
    contenido ya justificaba un nodo propio en vez de esperar — los 4
    comparten una lógica clínica común (inmunosupresión en trasplante renal
    y enfermedad glomerular autoinmune: Rituximab trata tanto la nefritis
    lúpica como el rechazo humoral del injerto, C. difficile es una
    complicación infecciosa de riesgo elevado precisamente en TOS/ERC en
    diálisis). **Cuaderno de campo de 4 fichas** (mismo `core/corkboard.js`
    de siempre, sin calculadoras propias): Timoglobulina (inducción y
    tratamiento del rechazo con la clasificación de Banff 2017, premedicación,
    ajuste de dosis, profilaxis de infecciones oportunistas por FG),
    Infección por Clostridium difficile (factores de riesgo con la tabla de
    antibióticos por frecuencia de asociación, diagnóstico GDH+PCR,
    clasificación por gravedad, algoritmo terapéutico completo por
    escenario/recurrencia), Ciclofosfamida (dosis 0,6 g/m² con tabla de
    ajuste por edad×función renal, MESNA/hidratación/ondansetrón como
    tratamiento complementario obligatorio, toxicidad ovárica por edad),
    Rituximab (indicaciones en patología renal con su fuerza real —única
    indicación AEP: vasculitis ANCA—, posología, premedicación, tabla de
    velocidad de infusión, manejo de reacciones), con un cross-link interno
    Rituximab→Timoglobulina para el rechazo humoral del injerto. Ganó su
    propio banco de quiz (`js/data/trasplante-renal-preguntas.js`,
    `tr-q001`-`q032`, 8 preguntas por ficha × 4 fichas, mismo baseline
    mínimo ya usado al arrancar otros bloques de Nefrología), con
    `triggerId: 'btn-trasplante-renal-repasar'` añadido al array que ya
    exporta `nefrologia/index.js`.
  - **Nueva ventana "PNT" — índice de acceso rápido a los protocolos**, a
    petición explícita del usuario ("haz una nueva ventana llamada PNT y ahí
    es donde vas a poner un enlace que te dirija a donde está cada
    protocolo en la app... para que estén localizados y sean fácilmente
    accesibles de manera rápida"). Implementado como un **acordeón de solo
    contenido** justo debajo del mapa del riñón en `rinon-menu.html`
    (`data-target="pnt-nefrologia"`, detectado automáticamente por
    `core/accordion.js` sin necesidad de registrarlo en ningún sitio — mismo
    patrón exacto que "FUENTES Y EVIDENCIA" en Hematología, el precedente
    establecido para "categoría solo de contenido/índice, no un nodo del
    mapa"), en vez de un 9º nodo visual en el riñón (que hubiera mezclado un
    índice de navegación puro con los nodos de contenido clínico real). Los
    7 enlaces (uno por PNT ya incorporado) usan `.tx-link` con
    `data-view`/`data-panel`/`data-tab` — mismo mecanismo ya usado por la
    guía transversal `tratamiento-ira-irc.html` — resuelto por el listener
    global ya existente en `nefrologia/index.js`, sin JS nuevo. Los 2
    enlaces a fichas de Fisiología (hiponatremia/hiperpotasemia) llevan
    `data-view="nefrona"` explícito (viven en una vista distinta del propio
    switcher `nefroLevel` a la del mapa del riñón donde vive el acordeón
    PNT) — detalle verificado con Playwright antes de darlo por bueno, ya
    que sin él `openCorkboardTopic` habría actuado sobre un panel oculto.
  - Verificado con Playwright: las 4 fichas nuevas abren/voltean sin error
    de consola ni 404 real; el cross-link interno Rituximab→Timoglobulina
    funciona; el acordeón PNT se abre y sus 7 enlaces navegan cada uno a la
    ficha exacta de destino (incluidos los 2 que cruzan a la vista
    `nefrona`); la calculadora de Mehran calcula correctamente (hipotensión
    +ICC+150cc+creatinina&gt;1,5 = 5+5+1+4 = 15 puntos → banda 11-16,
    26,1%/1,09%); el contenido nuevo de hiponatremia (índice de Fürst,
    "11 ml/h", titulación del tolvaptán) e hiperpotasemia (titulación de
    iSRAA, seguimiento tras el episodio) se detecta correctamente en el
    DOM; el cross-link Vías Urinarias→ERC funciona; un recorrido completo
    del banco de quiz nuevo (32 preguntas, incluidas las 4 de redactar) no
    generó ninguna excepción JS; sin overflow horizontal a 390px.
  - **3ª tanda de PNT (5 documentos IT-4AI-E)**: enviada con "vamos a
    continuar con los siguientes archivos" — 5 instrucciones técnicas de
    Enfermería (IT-4AI-E-19 estabilidad de medicamentos termolábiles,
    IT-4AI-E-18 estabilidad de soluciones antisépticas, IT-4AI-E-15
    canalización venosa periférica, IT-4AI-E-13 catéter venoso central de
    acceso periférico/PICC, IT-4AI-E-12 inserción y cuidados de sonda
    vesical). Mismo criterio de descarte ya aplicado a IT-NEF-31: son
    técnica de enfermería/logística de conservación de fármacos, sin
    contenido de decisión diagnóstica ni algoritmo terapéutico por
    gravedad/diferencial. El usuario confirmó explícitamente ("pues los
    descartamos") — los 5 se descartaron sin ningún cambio en el
    repositorio.
  - **4ª tanda de PNT (4 documentos)**, enviada con "seguimos con estos":
    HUGCDN-RFH-4AI-PT-02 (Manejo del paciente sometido a terapia metabólica
    con Lutecio-177) y HUGCDN-RFH-4AI-PT-01 (ídem con Iodo-131) —
    documentos de Radiofísica Hospitalaria + Unidad 4AI, logística de
    radioprotección (preparación de habitación, EPI, residuos, criterios de
    alta por dosimetría) sin encaje en ninguna especialidad existente de la
    app (ni siquiera son de autoría de Nefrología) — **descartados**, mismo
    criterio de logística/procedimiento ya aplicado a los IT-4AI-E; PNT-NEF-06
    (Diagnóstico diferencial de las poliurias) y PNT-NEF-07 (Infecciones por
    bacterias multirresistentes en receptores de órgano sólido) — con
    contenido clínico real, **incorporados**:
    - **`fisio-hipernatremia` ampliada con PNT-NEF-06**: antes de escribir
      nada se releyó la ficha completa para no duplicar el selector
      interactivo `#agua-di-select` y el test de deprivación/copeptina ya
      existentes (fuente: Nefrología al día) — el PNT aporta un
      **protocolo hospitalario práctico** distinto y complementario, no
      repetido: definición formal de poliuria (adultos &gt;3l/día o
      &gt;50ml/kg/día; niños &gt;2l/día o &gt;100ml/kg/día), distinción
      poliuria osmótica/no osmótica, tabla diferencial completa
      (Osm-u/Osm-p/Na/ADH por Normal/Polidipsia 1ª/DIC/DIN), claves de
      sospecha clínica, el **protocolo del test de deshidratación en 2
      fases** paso a paso (criterios de interrupción a-d de la fase 1,
      dosis de desmopresina de la fase 2, la excepción de saltar
      directamente a fase 2, y cuándo medir ADH en plasma), y ampliación
      etiológica (herencia autosómica dominante en la DIC familiar por
      mutación del gen AVP-neurofisina II; rifampicina/foscarnet/contrastes
      angiográficos añadidos a las causas de DIN adquirida). **Discrepancia
      real entre fuentes, documentada con nota de fidelidad en vez de
      "corregida" silenciosamente** (mismo criterio que el IFR de FRA o el
      TAPSE de Cardiología): los cortes de la tabla de interpretación del
      PNT (Normal &gt;750 mOsm/l, DIN &lt;300 para completa y parcial) no
      coinciden exactamente con los ya citados en el selector interactivo
      existente (Normal &gt;800, DIN 300-500) — 2 fuentes distintas
      (artículo de Nefrología al día vs. protocolo interno), ambas
      reproducidas tal cual.
    - **5ª ficha del nodo "Trasplante renal y enfermedades glomerulares"
      con PNT-NEF-07** ("Infecciones por bacterias MR en TOS"): mismo
      criterio ya anotado — ampliar el nodo existente en vez de fragmentar
      en uno nuevo, dado el volumen y la temática (inmunosupresión/
      infección en trasplante renal) compartida con las 4 fichas ya
      presentes. Contenido: factores de riesgo, heterorresistencia como
      problema diagnóstico añadido, características de la cirugía renal
      como fuente de infección, patógenos MR por categoría (MRSA con
      recomendaciones graduadas A-I/B-II de cribado/descolonización/
      tratamiento; EVR; enterobacterias BLEA/AmpC/carbapenemasas-KPC; P.
      aeruginosa/no fermentadores), **Tabla 1** (patógenos × familias
      antimicrobianas activas), **Tabla 2** (políticas de aislamiento/
      habitación/cribado/descolonización por patógeno), **Tabla 3**
      (tigeciclina/daptomicina/linezolid/fosfomicina/colistina —
      interacciones, toxicidad, efectos adversos, información específica
      en TOS), e infecciones MR difíciles de tratar (ITU recurrente,
      quistes infectados en riñón nativo poliquístico, infección
      intraabdominal/peritonitis terciaria) — todo en un nuevo
      `micro-profiles`/`.data-table` fieles a la fuente, con las 3 tablas
      anchas envueltas en `overflow-x:auto` tras detectar overflow
      horizontal a 390px con Playwright (mismo patrón ya usado en Vías
      Urinarias/Hematología para tablas de muchas columnas). Cross-link
      interno nuevo hacia la Ficha II (C. difficile) — ambas tratan
      infección en el receptor de TOS favorecida por la misma
      inmunosupresión/hospitalización. 8 preguntas de quiz nuevas
      (`tr-q033`-`q040`, 7 opción múltiple + 1 de redactar, mismo baseline
      ya usado al arrancar el resto de fichas del nodo), llevando el banco
      de "Trasplante renal y enfermedades glomerulares" a 40 preguntas.
    - Verificado con Playwright: ambas fichas abren/voltean sin error de
      consola ni 404 real; el contenido nuevo de `fisio-hipernatremia` (50
      ml/kg, tabla ADH, "fase 1", "750", nota de fidelidad, foscarnet) y de
      `tr-multirresistentes` (14%, ESKAPE, las 3 tablas, heterorresistencia,
      colistina, peritonitis) se detecta correctamente en el DOM; el
      cross-link interno a C. difficile funciona; el menú del quiz muestra
      el bloque "Trasplante renal y enfermedades glomerulares (40)" con la
      5ª ficha "Infecciones por bacterias MR en TOS (8)", y un recorrido
      completo de sus 8 preguntas (incluida la de redactar) no generó
      ninguna excepción JS; sin overflow horizontal a 390px tras envolver
      las tablas anchas.
  - **Pendiente**: el usuario sigue mandando más PNT del Servicio en tandas
    — cuando lleguen más documentos de este mismo tema (trasplante renal/
    inmunosupresión), amplían el nodo ya creado en vez de fragmentar en
    nodos nuevos; si llegan de un tema distinto, aplicar el mismo método de
    análisis-antes-de-construir ya usado en estas tandas.


### Vista Visual en Nefrología: simulación de la hiperpotasemia (octubre 2026)

Primera vista Visual fuera de Hematología, a petición explícita del usuario
("vamos ahora con nefro"). Antes de tocar código se iteró una maqueta en
un Artifact en 3 rondas: una gráfica de tiempos de cada fármaco (rechazada
como insuficiente: "se podría mejorar si se intentara simular la
biología"), una **simulación** (aprobada: "esto era a lo que me refería con
estudiar de esta manera visual") y una 3ª versión que corrige los errores
de una autoauditoría pedida por el usuario y añade las causas. **Este es el
modelo de "vista Visual = simulación de la fisiología" para el resto de
Nefrología**, distinto del kit de recetas de Hematología: aquí no se
dibujan las líneas del texto, se simula el mecanismo que explican.

- **Dónde**: ficha `fisio-hiperpotasemia` del cuaderno de fisiología
  (`nefro-menu.html`). Toda la ficha gana el interruptor Texto | Visual; la
  vista Texto es la ficha de siempre. **Punto de extensión para vistas
  Visual a medida**: `montarVisual(tabId, receta)` acepta, en vez de una
  receta, una función `(tab, texto, visual)` que construye la imagen ella
  misma, con la misma construcción diferida y el mismo caso del botón
  global ya resueltos por el kit (`envolver()` sigue siendo privada).
- **Módulo**: `js/modules/nefrologia/hiperpotasemia-sim.js`
  (`initHiperpotasemiaSim()`, llamado desde `fisiologia.js` justo después de
  `initCorkboard`, para que "Siguiente ficha" ya exista y quede fuera). La
  escena se construye la primera vez que se abre la vista Visual. Dos
  `<canvas>` (escena 360×320 y ECG 360×74, con `devicePixelRatio`).
- **Reutiliza las piezas de la app** en vez de estilos propios: botones
  `.visual-mini`, "Texto ↓" con `.visual-link` (variante compacta dentro de
  `.hk-*`), avisos con `.tfg-estado-warn/danger`, barra de riesgo con
  `.kinetic-*` + `pintarGauge()`, gravedad con `.grade-badge`, rótulos con
  `.section-label`, `clamp()` de `core/ui.js`. Los colores del canvas salen
  de los tokens de `variables.css` (con un `alfa()` para las
  transparencias); solo 4 tonos claros del dibujo, sin token, viven en una
  constante `CLARO`. En `js/data/` cada fármaco lleva su `magnitud` y su
  `ruta` de salida, y el nombre sale de su fila de la tabla (solo CSZ y
  patirómero, que comparten fila, declaran el suyo).
- **Rendimiento por fotograma**: la actividad de cada fármaco y el modelo se
  calculan una vez por paso; el DOM solo se escribe cuando un valor cambia
  (`poner()` con caché); el canvas agrupa cada color de partículas en un
  solo trazado; `cuadrar()` cuenta las partículas en una sola pasada; con
  `prefers-reduced-motion` el ECG solo se recalcula si cambian sus rasgos.
- **Una sola fuente de datos**: `js/data/hiperpotasemia-data.js`. La tabla
  "Tratamiento — hiperpotasemia grave sintomática" de la vista Texto ya no
  está escrita en el HTML: `<tbody id="hk-tto-tabla">` se rellena desde
  `tratamientoHiperpotasemia` (mismo texto, fila a fila), y la simulación
  lee de ahí los tiempos. También viven ahí los fármacos de la simulación,
  las causas y las magnitudes.
- **Qué simula**: el K⁺ como partículas entre plasma (2%), célula (98%) y
  tres salidas (riñón, intestino, diálisis), más el corazón con su ECG y un
  tubo de analítica. Cada fármaco actúa con su mecanismo y sus tiempos de
  la tabla: la bomba Na⁺/K⁺ se acelera con insulina y salbutamol (3 Na⁺
  fuera, 2 K⁺ dentro), el K⁺ desplazado **vuelve a salir** cuando se acaba
  el efecto, solo riñón/intestino/diálisis lo sacan del cuerpo, el calcio
  protege la membrana sin cambiar el K⁺. Las dosis se pueden repetir (no
  suman: cuenta la que más actúa). Reloj de 12 h, ×4, pausa.
- **Causas en la misma escena** (selector): ↓eliminación renal (7,2 u 8,3),
  acidosis (entra H⁺, sale K⁺; el bicarbonato lo devuelve), lisis celular
  (la membrana rota sigue soltando K⁺), aporte excesivo (con riñón
  conservado se va por la orina; con IR grave se queda — "solo relevante si
  coexiste insuficiencia renal") y **pseudohiperpotasemia** (el tubo marca
  7,0 con la muestra hemolizada, el plasma real es normal, gravedad "sin
  confirmar" hasta pulsar "Repetir la analítica", el primer paso del PNT).
  Selector de función renal (IR grave cierra el riñón y deja el diurético al
  20%) y selector de ECG.
- **ECG independiente del K⁺**, a propósito: la ficha insiste en su baja
  sensibilidad. Tres modos: cambios típicos de la Figura 9 (T picudas desde
  6,2, P perdida/QRS ancho desde 7, arritmia ventricular desde 8), ECG
  normal pese al K⁺ alto, o cambios ya con K⁺ moderado (≥5). La gravedad
  sigue la Figura 7 cruzando K⁺ × "hay cambios en el ECG".
- **Avisos**: frases de la propia ficha que aparecen según lo que se hace
  (calcio como primera medida ante cambios ECG, su efecto de 30-60 min ya
  pasado, rebote del K⁺ desplazado, monoterapia con β-agonistas, bicarbonato
  sin acidosis, diurético en IR grave, baño sin glucosa en diálisis,
  monitorización con K⁺ &gt;6, pseudohiperpotasemia).
- **Fidelidad**: las cantidades (cuántos mEq/l mueve cada medida, a qué
  ritmo sale el K⁺ en cada causa, la eliminación renal basal) son
  **ilustrativas**, porque la ficha no las da, y la vista lo avisa. Lo
  mismo con "Minutos/hora" (diálisis) y "horas" (diuréticos). Discrepancia
  real de la ficha, declarada en la propia fila: la tabla de urgencia da
  1-2 h para los captores juntos y la tabla de la forma crónica da 1 h al
  CSZ y 7 h al patirómero; la simulación los separa con esas cifras.
- **"Texto ↓"** en cada fármaco, cada causa, el texto del ECG (Figura 9 o
  la frase de baja sensibilidad), la gravedad (Figura 7) y los avisos que
  citan la ficha lleva a su línea real con `irAlTexto()`; una segunda línea
  relacionada se resalta sin mover la vista con `marcar()` (nuevo export de
  `core/vista-visual.js`, el mismo resaltado que usa `resaltar()`). Ids añadidos a la ficha: `hk-causa-pseudo/aporte/renal/
  salida`, `hk-fig7`, `hk-fig9`, `hk-ecg-sensibilidad`, `hk-monitorizacion`,
  `hk-tto-<id>` (generados), `hk-tto-nota`, `hk-quel-inicio`,
  `hk-confirmar`.
- **Rendimiento**: la animación solo corre mientras la vista Visual está en
  pantalla (`IntersectionObserver` sobre el bloque Visual entero, no solo
  el dibujo, para que el reloj siga al bajar a pulsar los fármacos).
  Verificado: 0 fotogramas/s en la vista Texto o fuera de la ficha, ~50/s
  con la simulación visible. Respeta `prefers-reduced-motion`.
- **`[hidden]` global**: `css/base.css` tiene ahora
  `[hidden] { display: none !important; }`. Antes cada componente que
  ocultaba con el atributo `hidden` necesitaba su propia regla
  `.clase[hidden]` (había 8 copias, todas borradas), porque cualquier
  `display` del autor anulaba el del navegador. Usa siempre el atributo
  `hidden` para ocultar; no hace falta regla propia.
- CSS con prefijo `hk-` en `components.css`. Bug previo corregido de paso:
  las 3 tablas de la ficha desbordaban a 390 px (432 px de ancho de
  página); ahora van en `overflow-x:auto`.
- Con esta ficha, el botón global "🖼️ Visual" de la cabecera aparece
  también en Nefrología (lo decide solo la presencia de `[data-visual]`).
- Verificado con Playwright (390×844, toques reales): navegación real
  Especialidades → PIF → Nefrología → nefrona → ficha; la tabla de la vista
  Texto tiene sus 7 filas; los 6 escenarios y los 8 fármacos funcionan; la
  pseudohiperpotasemia pasa de 7,0 a 4,5 al repetir la analítica; "Texto ↓"
  de los captores resalta su fila y la de "Inicio de acción"; el buscador
  global encuentra la ficha por su texto (no por los rótulos de la
  simulación); sin errores de consola ni desborde horizontal.
- **Siguiente, a decidir por el usuario**: llevar el mismo enfoque a otras
  fichas de Nefrología (hipopotasemia y regulación del potasio pueden
  reutilizar la misma escena de plasma/célula/salidas).

### Vista Visual en Nefrología: simulación de la hipopotasemia (octubre 2026)

Segunda simulación de Nefrología, a petición explícita del usuario
("Continúa con nefro, parte por parte"), en la ficha `fisio-hipopotasemia`.
Mismo enfoque que la hiperpotasemia (simular el mecanismo, no dibujar las
líneas del texto), mismo escenario y mismas piezas de la app.

- **Escenario común extraído** a `js/modules/nefrologia/potasio-escena.js`,
  para no duplicar ~400 líneas entre las dos simulaciones: geometría
  (plasma, célula, bombas, roturas, salidas, tubo, corazón), `crearEscena(
  visual, { escena, ecg })` (canvas con DPR, colores de los tokens,
  `rotulo`/`puntos`/`anillos`, `vaso`/`celula`/`roturas`/`bombas`/
  `salidas(lista)`/`tubo(valor, marca)`/`corazon(intensidad, calcio)`,
  rutas de partículas `rutaHacia(p, cat, fin)` y `rutaEntrada('arriba'|
  'intestino')`, `moverParticulas`, y el motor de ECG `pintarECG(rasgos,
  latido, clave)` con latidos irregulares si `rasgos.irregular`), más
  `onda(u, opciones)` (P/QRS/T/ST/U parametrizables), `actividadDosis`/
  `actividades`/`estadoDosis`, `enlazarTexto` (los "Texto ↓"),
  `crearPoner` (escritura en el DOM solo si cambia) y
  `animarMientrasVisible`. `hiperpotasemia-sim.js` se reescribió encima sin
  cambiar su comportamiento (verificado de nuevo con Playwright). Una
  tercera simulación de potasio (p. ej. la regulación) parte de aquí.
- **`irAlTexto()` abre ahora el acordeón** `.micro-prof-item` que contiene
  la línea antes de llevar la vista (antes solo lo hacía `visual-kit.js`
  con su `abrirContenedores`, ya borrado): cualquier "Texto ↓" que apunte
  dentro de un acordeón funciona sin código propio.
- **La idea que enseña**: el K⁺ del plasma es una ventana pequeña a un
  depósito grande. Cada hueco ○ de la célula son 20 mEq que faltan en el
  cuerpo; el ClK entra (gotero arriba o, por vía oral, subiendo por el
  canal desde el intestino) y va casi todo a rellenar huecos, por eso el
  K⁺ sube despacio. Barra de "Déficit corporal estimado" con `pintarGauge`.
- **Déficit ↔ K⁺**: la ficha da 200-400 mEq por cada 1 mEq/l y más de
  800-1.000 con K⁺ &lt;2. El modelo usa 300 mEq/(mEq/l) entre 4 y 3 y 600
  por debajo de 3, que cumple las dos cifras (K⁺ 2 → 900 mEq).
- **Datos** en `js/data/hipopotasemia-data.js`: 8 causas (diarrea, vómitos
  —el jugo gástrico solo lleva 5-10 mEq/l y se pierde sobre todo por
  orina—, hiperaldosteronismo 1º, Liddle, hipomagnesemia, parálisis
  periódica, cetoacidosis —K⁺ 5,0 con 600 mEq de déficit; la insulina lo
  hace aflorar—, pseudohipopotasemia) con sus pistas diagnósticas de la
  ficha (K⁺ en orina &lt;/&gt;15, gasometría, TA; null si la ficha no lo da),
  las acciones (ClK i.v. en perfusión con ritmo/bolsa/suero, ClK oral de
  8 mEq, corregir el magnesio, espironolactona, triamtereno, insulina y
  salbutamol —estos dos leen tiempos y magnitud de los datos de la
  hiperpotasemia, misma ficha de origen—), los límites del ClK i.v. (&lt;20
  mEq/h, &lt;50 mEq/l, 200 mEq/día) y las magnitudes ilustrativas.
- **Lo que se ve y avisa**: Liddle no responde a espironolactona (sí a
  triamtereno); con el Mg bajo el 60% (ilustrativo) del ClK se va por la
  orina hasta corregirlo; suero glucosado, ritmo o concentración por
  encima del límite y más de 200 mEq/día; criterios de vía i.v. (K⁺ &lt;2,5,
  cambios en el ECG o arritmia, digoxina, cetoacidosis, intolerancia oral
  —que además desactiva el botón oral—); en la parálisis periódica el
  depósito está lleno y el ataque se resuelve entre las 6 y las 12 h del
  reloj (dentro de las 6-24 h de la ficha), así que el ClK de más acaba
  sobrando; pseudohipopotasemia hasta "Repetir separando pronto el
  plasma".
- **ECG**: la ficha no da umbrales de K⁺ para cada cambio, así que son
  ilustrativos y la vista lo dice: T aplanada + onda U por debajo de 3
  (la ficha dice que 3-3,5 suele ser asintomática), ↓ST y ↑QT/PR por
  debajo de 2,5, fibrilación auricular (latido irregular, sin P, línea de
  base fibrilatoria) por debajo de 2. Modo "Sin cambios" disponible.
- **Ficha**: 23 ids `hp-*` para los "Texto ↓"; las 4 tablas envueltas en
  `overflow-x:auto` (desbordaban a 489 px); nota de fidelidad nueva: los
  chips llaman "leve" a 3-3,5 y "moderada" a 2,5-3, pero la frase de la
  clínica llama "moderada" a 3-3,5 — el PDF de potasio no está en `docs/`,
  así que no se pudo comprobar la fuente; la simulación usa los chips.
- `#hk-ecg`/`#hk-farmacos` pasaron a clases (`.hk-ecg`, `.hk-farmacos`)
  para que las dos simulaciones compartan el CSS; `.hp-perfusion` es lo
  único nuevo. Cache-busting a `?v=20261018-3`.
- Verificado con Playwright (390×844, toques reales): las 8 causas
  arrancan con su K⁺ y su déficit; la cetoacidosis pasa de 5,0 a 2,5 con
  insulina; la pseudohipopotasemia de 2,5 a 4,0 al repetir; los avisos de
  Liddle, magnesio, ritmo 40 mEq/h y glucosado aparecen; "Texto ↓" abre
  el acordeón de la hipomagnesemia y resalta la línea; el ECG llega a FA;
  el buscador global encuentra la ficha por su texto y no por los rótulos
  de la simulación; la hiperpotasemia sigue igual; sin errores de consola
  ni desborde horizontal.

### Vista Visual en el resto de Nefrología (octubre 2026)

A petición explícita del usuario ("terminar toda la parte de nefro",
avisando de que algún apartado no necesitaría esta vista). Con esto, las
**59 fichas** de cuaderno de campo de Nefrología tienen Texto | Visual:
las 2 simulaciones del potasio y **57 recetas del kit**, una por ficha.

- **Archivos**: `js/modules/nefrologia/visual-fisiologia.js` (16 fichas
  del cuaderno de fisiología, llamado desde `fisiologia.js`),
  `visual-hta.js` (8), `visual-erc.js` (13), `visual-fra.js` (9),
  `visual-trr.js` (6) y `visual-trasplante-renal.js` (5), cada uno llamado
  desde el `init()` de su módulo justo después de `initCorkboard`.
- **Sin vista Visual, a propósito**: `nefrotoxicidad.html` (tabla de
  consulta de 585 fármacos con buscador), `tratamiento-ira-irc.html` (guía
  de navegación hacia otras fichas, sin contenido propio),
  `diureticos-asa.html` (página corta a la que se llega desde la nefrona
  interactiva, que ya es la imagen), y el mapa del riñón y la nefrona
  (son ya la navegación visual).
- **Las calculadoras y simuladores de cada ficha se reutilizan**, nunca se
  copian: el simulador de autorregulación de la TFG, el de osmorregulación,
  Adrogué-Madias, el clasificador ácido-base, calcio corregido, FGe/CGA,
  panel analítico de ERC, estadio KDIGO, FENa/IFR (panel `calculadora`),
  Mehran (panel `puntos`) y todos los diferenciales con `<select>` (panel
  `selector`).
- **Mapa de calor G×A de ERC** (ficha 1, panel `propio` en
  `visual-erc.js`): la matriz de riesgo KDIGO con la celda del paciente de
  la calculadora marcada. Las funciones de CKD-EPI 2021, categorías G/A y
  el mapa de riesgo pasaron de `erc.js` a `erc-cga.js`, que usan la
  calculadora y la imagen (una sola fuente).
- **Novedades del kit** (`core/visual-kit.js`), todas genéricas:
  - panel `calculadora`: los campos reales de una calculadora o simulador
    (número, deslizador con su unidad, desplegable) en versión compacta;
    escribe en el control real, dispara su evento y copia lo que pinta la
    calculadora. `resultado` acepta un `#id` (se copia su contenido con el
    color de estado) o cualquier otro selector (se copia el bloque entero,
    p. ej. las barras de un simulador). Las copias nunca llevan ids. Se
    actualiza en su sitio, sin perder el foco ni el arrastre.
  - panel `propio` (`render(cuerpo, { tab, texto })`): una pieza a medida
    dentro de una receta.
  - `matriz` con `flechas: true` (↑ sube, ↓ baja, N normal, variable) o
    `calor: true` (intensidad según la cifra de cada celda).
  - cualquier panel, grupo o columna puede tomar sus nodos de una tabla
    (`tabla: n`, una fila por nodo).
  - `tras`: busca la fuente solo después de otro elemento, para etiquetas
    repetidas en una misma ficha ("Clínica", "Tratamiento" de cada
    enfermedad).
  - un `<dl class="kv-row">` con varios pares dt/dd se resuelve par a par.
  - las etiquetas conservan ↑/↓ iniciales ("↓Ingesta") y quitan los
    números en tecla ("1️⃣").
  - `selector` ya no muestra la opción vacía "— Selecciona —"; `barras`
    tolera filas con menos celdas y muestra solo la cifra de la celda.
  - Bug previo corregido: escribir en un campo numérico de un panel
    `puntos` lanzaba una excepción (`setSelectionRange` en `type=number`).
- **Vista Texto**: 10 tablas que desbordaban a 390 px (fisiología, HTA,
  ERC, TRR, trasplante renal) van ahora en `overflow-x:auto`.
- Verificado con Playwright (390×844): las 57 vistas se construyen sin
  fuentes sin resolver ni paneles vacíos; cada nodo se tocó y se comprobó
  que su detalle es la línea correcta; las calculadoras conectadas
  escriben en el control real y copian su resultado (TFG a 60 mmHg,
  clasificador ácido-base, FGe 34 → G3bA2 marcado en el mapa, Mehran 7);
  "Ver en el texto" vuelve al texto y resalta; las 33 vistas de
  Hematología siguen igual; sin errores de consola ni desborde horizontal
  en ninguna ficha de Nefrología, en Texto ni en Visual. Cache-busting a
  `?v=20261018-5`.

### Nefrona viva (octubre 2026)

A petición explícita del usuario ("quiero poder replicar una nefrona... la
nefrona con foto real y puntos táctiles es una chusta, habría que hacer como
con la parte de potasio... un mix entre los 2"). Primero se hizo una maqueta
en un Artifact; el usuario la aprobó tal cual ("esto es la perfección") y se
pasó a la app sustituyendo la foto con puntos de la vista `nefrona`.

- **Mezcla de foto real y dibujo, en 3 niveles de zoom** dentro del mismo
  recuadro (`#nv-escenario`, con migas Corte real › Nefrona › Célula):
  1. **Corte real**: la misma `img/nefrona-anatomia.jpg`, sin puntos, con la
     nefrona yuxtamedular marcada. Tocarla hace zoom (CSS `transform`) hacia
     ella y funde al dibujo.
  2. **Nefrona** (`<canvas>`): dibujada con la orientación de la foto
     (corteza arriba, colector a la izquierda, asa a la derecha): glomérulo
     con arteriolas y hematíes que no se filtran, ribete en cepillo, células
     de la pared, vasa recta, mácula densa, acuaporinas-2 según la ADH y ✕
     sobre el tramo que bloquea el fármaco. El filtrado sale como partículas
     (agua, Na⁺, K⁺, glucosa, HCO₃⁻, cada una con su forma) que se
     reabsorben tramo a tramo; el K⁺ se secreta en el colector. **El color
     de la luz y del intersticio es la osmolalidad** (escala 50 → 300 →
     1200), y unas etiquetas dicen cuánto líquido queda: 180 → 54 → 18 L →
     orina. Capa fija en un canvas aparte que solo se repinta al cambiar el
     modelo; la animación solo corre con el escenario en pantalla y en este
     nivel.
  3. **Célula** (SVG): luz | célula | sangre del tramo tocado, con los
     iones de cada transportador viajando (`animateMotion`), la
     Na⁺/K⁺-ATPasa basolateral, mitocondrias y ribete donde toca, el paso
     paracelular en la rama ascendente delgada, el número de acuaporinas-2
     según la ADH, la secreción por ROMK según el flujo distal y el bloqueo
     del fármaco (los iones rebotan). El glomérulo muestra la barrera de
     filtración. Con `prefers-reduced-motion` todo queda quieto.
- **Mandos**: situación (normal, deshidratación, beber mucha agua, SIADH,
  diabetes insípida, hiperglucemia con deslizador de glucemia) y fármaco
  (furosemida, tiazida, espironolactona, amilorida, acetazolamida,
  iSGLT2), con `.visual-mini`. Debajo, la orina final (volumen,
  osmolalidad, Na⁺ excretado, K⁺, glucosa, HCO₃⁻), cada cifra con su
  etiqueta `ficha` o `ilustrativo`.
- **Base del texto de la app**: `js/data/nefrona-data.js` ahora tiene
  `segmentosNefrona` (canales con `flujo` en claves de ion, `texto` = id de
  su línea en la ficha "Reabsorción y secreción", `categorias`),
  `situacionesNefrona`, `farmacosNefrona` (explicaciones de siempre, ahora
  con iSGLT2) y `cifrasNefrona`. `modosInteractivos` desapareció. Doce
  líneas de las fichas de esta misma página llevan id `nv-t-*` (los 6
  acordeones de tramo de `fisio-tubular`, su tabla, el dintel de
  filtración, el Tm de la glucosa, el rango de osmolalidad urinaria, las 3
  condiciones de la orina diluida y el acordeón de la ADH): el panel del
  tramo y las situaciones sin texto propio **copian esa línea del DOM** (una
  sola fuente) y "Texto ↓" abre la ficha, la pasa a Texto y la resalta.
  SIADH/diabetes insípida enlazan a su ficha y furosemida a Diuréticos de
  asa; las `categorias` de cada tramo siguen resolviéndose con
  `onCategoria` (`initNefronaViva({ onCategoria })` devuelve `{ reset }`,
  que vuelve a la foto en situación normal).
- **Modelo**: de las fichas salen 180 L filtrados y 1,8 L de orina, 70% del
  agua en el proximal, orina de 50 a 1.200 mOsm/kg y de 18 a 0,75 L/día con
  900 mOsm/día, y el Tm de la glucosa (320 mg/min, umbral ~180 mg/dl).
  Ilustrativo, y así lo dice la vista: el reparto del Na⁺/K⁺ por tramos (con
  techo de reabsorción en el distal y el colector, para que lo que llega de
  más se pierda), el efecto agudo de cada fármaco sin compensación, la
  caída del gradiente medular con furosemida y el 40% de glucosuria con
  iSGLT2.
- **Bug previo corregido de paso**: el "← VOLVER" de Diuréticos de asa
  (`.btn-volver-nefro-menu`) no tenía ningún listener y no hacía nada;
  ahora vuelve a la nefrona.
- CSS con prefijo `nv-` en `components.css` (sustituye a `.nefrona-*` y
  `.canal-flujo-svg`, borrados). Cache-busting a `?v=20261018-6`.
- Verificado con Playwright (390×844, toques reales): foto → nefrona →
  célula y vuelta por las migas; deshidratación da 0,75 L y 1.200 mOsm/kg
  y furosemida 23 L, 12% de Na⁺ y K⁺ ×3,6; tocar la rama ascendente gruesa
  abre su célula con NKCC2 bloqueado; "Texto ↓" abre `fisio-tubular`, abre
  el acordeón de la rama gruesa y lo resalta; la categoría lleva a
  Diuréticos de asa y su "← VOLVER" regresa; el glomérulo copia el dintel
  de filtración; SIADH abre Hiponatremia; volver al mapa del riñón deja la
  nefrona en la foto; sin errores de consola, 404 ni desborde.

### Glomérulo vivo y FRA en la nefrona viva (octubre 2026)

A petición explícita del usuario ("como ya tenemos la nefrona montada, la
podemos usar para otras fichas, o para la ERC... vamos a seguir con
nefrología lo que quede"). Dos piezas que reutilizan el mismo lenguaje
visual de la nefrona viva:

- **Glomérulo vivo** (`js/modules/nefrologia/glomerulo-vivo.js`,
  `montarGlomerulo(cuerpo, { tab }, opciones)`): arteriola aferente, ovillo
  capilar dentro de la cápsula de Bowman, eferente, mácula densa y células
  yuxtaglomerulares, con hematíes circulando, filtrado saliendo al túbulo
  proximal, renina liberándose cuando hay hipoperfusión y albúmina
  escapando si la barrera está dañada. El grosor de cada arteriola (y de su
  anillo de músculo liso) sale del modelo. Se monta como panel `propio` de
  la vista Visual; cada ficha elige sus mandos y a qué línea propia lleva
  cada "Texto ↓" (ids `g-t-*`):
  - `fisio-regulacion`: PAM 40-220 (sustituye en la vista Visual al panel
    que copiaba el simulador de barras; el simulador sigue en Texto).
  - `erc-pa-raas`: IECA/ARA-II, depleción de volumen, AINE, estenosis y
    albuminuria — compara el FG con y sin IECA y aplica la regla de la
    ficha (<30% aceptable; ≥30% buscar depleción, AINE o estenosis).
  - `erc-nefroproteccion`: iSGLT2 (vasoconstricción aferente por
    retroalimentación tubuloglomerular), IECA y albuminuria.
  - `hta-secundaria-renal`: estenosis bilateral o sobre riñón único, con y
    sin IECA (la angiotensina II sostiene el filtrado contrayendo la
    eferente; sin ella el FG cae de golpe).
  - `fra-subfenotipos-2`: obstrucción (sube la presión en Bowman).
  - **Modelo**: presiones de la ficha "Filtración glomerular" (capilar 55,
    Bowman 15, oncótica 30, neta 10 mmHg; TFG 125 ml/min) y la misma
    autorregulación 80-180 mmHg que el simulador de "Regulación del
    filtrado". Cuánto mueve cada factor la presión capilar (IECA −1,5,
    iSGLT2 −1, angiotensina II y prostaglandinas compensando una parte del
    déficit, estenosis al 70%, depleción −25 mmHg, obstrucción +8 en
    Bowman) es ilustrativo y la vista lo dice.
- **FRA en la nefrona viva**: 3 situaciones más (`grupo: 'fra'` en
  `situacionesNefrona`, bajo un rótulo "Fracaso renal agudo"): IRA
  prerrenal, necrosis tubular aguda y obstrucción. Los valores de la orina
  que se muestran son los **rangos de la Tabla 3** y del volumen de
  diuresis de la ficha FRA · Diagnóstico (FENa <1% / >2%, osmolalidad
  >450 / <350, Na⁺ en orina <10 / >20, cilindros hialinos / granulosos,
  <400 ml/día, anuria <100 ml/día), todos con la etiqueta `ficha`; el
  filtrado (TFG) y los parámetros con los que se mueve la animación son
  ilustrativos (`modeloFra()`). Dibujo: menos perfusión en la prerrenal;
  huecos en la pared del proximal y de la rama gruesa, células
  desprendidas viajando y cilindros granulosos en la NTA (y en la célula,
  borde punteado sin ribete y "Célula dañada"); cálculo en la papila,
  colector dilatado y orina acumulada en la obstrucción. El botón de la
  explicación vuelve a la ficha de FRA (`data-especialidad`).
- **Accesos a la nefrona viva desde las fichas**: cualquier botón
  `[data-nefrona-viva="situacion|farmaco"]` cambia a la vista nefrona,
  pone esa situación y ese fármaco y baja hasta el escenario
  (`initNefronaViva({ onCategoria, mostrarVista })`; `index.js` pasa
  `mostrarVista`). `panelNefronaViva([[valor, etiqueta], ...])` (exportado
  de `nefrona-viva.js`) los pinta como panel de una receta; hoy en
  `fisio-tubular`, `fisio-hormonal`, `fisio-agua-regulacion`,
  `fisio-hiponatremia`, `fisio-hipernatremia`, `fra-diagnostico`,
  `fra-subfenotipos-2` y `erc-nefroproteccion`.
- CSS: `.gl-*`, `.nv-chips-grupo`, `.nv-medidor-valor.malo/.bueno/.largo`.
  Cache-busting a `?v=20261018-7`.
- Verificado con Playwright (390×844, toques reales): los 5 glomérulos
  construyen y responden (IECA solo −15%; con depleción y AINE −44%, aviso
  de ≥30%; iSGLT2 + IECA −25% y albúmina al 75%; estenosis + IECA −54%;
  obstrucción −80%), "Texto ↓" lleva a la línea de la ficha; desde FRA ·
  Diagnóstico, los 3 accesos abren la nefrona viva con su situación y la
  Tabla 3, la célula del proximal en NTA sale dañada, y el botón de la
  explicación vuelve a la ficha; sin errores ni desborde.

### Auditoría de la nefrona viva y sus correcciones (octubre 2026)

A petición explícita del usuario se hizo primero un informe (Artifact
"Auditoría de la nefrona viva", 30 hallazgos: E errores, T textos de las
fichas, M modelo, D dibujo, I interactividad) y después, con el PDF fuente
que aportó ("empieza desde lo más costoso"), se aplicó entero. El PDF de
Fisiología Renal (Carracedo y Ramírez, Nefrología al día 2020) queda en
`docs/carracedo-2020-fisiologia-renal.pdf`, enlazado desde la bibliografía
de `nefro-menu.html`.

- **Fichas (T1-T3) — errores de la propia fuente, no de transcripción**:
  el PDF dice literalmente que en el túbulo distal "la reabsorción de sodio
  supone secreción de calcio" (intercambiador 2Na/Ca) y que la mácula densa
  "libera renina cuando aumenta" el Na⁺ (la misma fuente dice lo contrario
  en su apartado de la renina), y sitúa un intercambiador Na⁺/H⁺ en la
  célula intercalar tipo A. Se reprodujeron tal cual con **notas de
  fidelidad** en `nv-t-tcd` y `nv-t-col`. Del PDF se añadieron a las fichas
  (para que la nefrona solo enseñe lo que dice la app): bomba 3 Na⁺/2 K⁺ y
  canales de escape de K⁺, salida basolateral de la glucosa, células finas
  con pocas mitocondrias y ~20% del agua en la rama descendente, el 25% del
  Na⁺ con Ca²⁺/Mg²⁺/HCO₃⁻ en la rama ascendente, y una línea nueva
  `nv-t-urea` (reciclaje de la urea). T4: se quitaron de `nefrona-data.js`
  los textos sin fuente (85/15% de nefronas, 5-10% de la tiazida, IC de la
  espironolactona…).
- **Vista de célula rehecha** (`svgCelula` + `filasCelula` en
  `nefrona-viva.js`): una fila por transportador, más vía entre células,
  agua y bomba. Cada célula tiene su forma (`epitelio` alto con ribete,
  cúbico o plano —las ramas delgadas—), la Na⁺/K⁺-ATPasa es un elemento
  propio que saca 3 Na⁺ y mete 2 K⁺, y cada ion sale por su propia puerta
  (`flujo: [ion, 'r'|'s', salida]`; sin salida, el Na⁺ por la bomba). El
  HCO₃⁻ ya no cruza un "canal": es la reacción con la anhidrasa carbónica
  (marcada como fisiología general, igual que el paso de Ca²⁺/Mg²⁺ entre
  células de la rama gruesa y la bomba de protones de la intercalar; el
  campo `general` de cada tramo lo dice en el panel). El Ca²⁺/Mg²⁺ pasó de
  la rama delgada a la gruesa; la delgada mueve ClNa y urea. El colector
  tiene célula principal (ENaC, AQP2 según ADH con salida AQP3/AQP4, ROMK,
  transportador de urea) e intercalar tipo A. Las ramas delgadas muestran
  la osmolalidad a la profundidad tocada (`estado.tapY`).
- **Nefrona**: la eferente continúa en capilares peritubulares y vasa recta
  (fuente); nefrona cortical de asa corta en segundo plano que desemboca en
  el mismo colector; urea como partícula (hexágono): el proximal recupera la
  mitad, sale del colector profundo con ADH y vuelve a la rama delgada.
  **El gradiente medular depende de la ADH** (`gradiente(a) = 780 + 420a`,
  1.200 con ADH máxima) y la rama descendente recupera el 20% del agua que
  le llega con el gradiente normal (`rDescDe`), así que el nivel de ADH
  "normal" pasó de 0,391 a 0,4825 para seguir dando 1,8 L y 500 mOsm/kg.
  La NTA dibuja huecos irregulares con la membrana basal desnuda.
- **Medidores**: los diuréticos se leen en el **pico del efecto** (ml/min y
  ml/h), no en L/día; "ficha" solo donde la cifra es de la ficha; medidor
  nuevo de **plasma** por situación y Na⁺ en orina >40 mEq/l en el SIADH
  (ADH 0,8, ya no idéntico a la deshidratación); notas de osmolalidad
  diluida/isotónica (≤350)/concentrada; FRA con Cro/Crs y FE urea; la NTA
  dice que la diuresis suele preservarse (ficha) y el sedimento lleva
  "pigmentados"; la obstrucción cuenta sus 2 fases.
- **Glomérulo vivo** (`modelo` en `glomerulo-vivo.js`): la estenosis baja
  la presión un 15% (ficha: 10-20%). Dentro de 80-180 mmHg la presión
  capilar se mantiene en 55, pero cuando hay renina una parte la sostienen
  la angiotensina II (`A`) y las prostaglandinas (`P`): el IECA/ARA-II o el
  AINE la quitan. Resultados de referencia: IECA solo −15%; depleción +
  IECA −65%; + AINE −85%; estenosis + IECA −65%. Mando nuevo
  `obstruccionMantenida` (segunda fase, arteriolas contraídas, −70%). Las
  pastillas de presión ya no tapan el ovillo, se dibuja el asa capilar y la
  estenosis.
- **Accesos**: botón `[data-glomerulo="mando,…"]` junto a
  `data-especialidad/view/panel/tab` abre una ficha en vista Visual con el
  glomérulo ya configurado (`irAlVisual()` nuevo en `core/vista-visual.js`;
  registro `montados` en `glomerulo-vivo.js`). Desde la IRA prerrenal se
  abre el glomérulo de "Regulación del filtrado" con depleción (que ganó
  los mandos depleción y AINE y un acceso de vuelta a la nefrona), y desde
  el iSGLT2 el de ERC · Nefroprotección. Los dos canvas actualizan su
  `aria-label` con la situación.
- Verificado con Playwright (390×844): las 10 vistas de célula, 9
  situaciones/fármacos de la nefrona, los 5 glomérulos con sus mandos, los
  2 accesos y su vuelta, 59 vistas Visual de Nefrología sin fuentes sin
  resolver, sin errores ni desborde. Cache-busting a `?v=20261018-8`.
- **Reciclaje de K⁺ por ROMK en la rama gruesa**, a petición explícita del
  usuario ("prefiero que metas el reciclaje x romk"), aunque ni la ficha ni
  el PDF lo citan: va marcado como fisiología general en el campo
  `general` del tramo. En `nefrona-data.js`, un canal nuevo con
  `depende: 'NKCC2'` y `desdeCelula: true` (el K⁺ sale de la célula a la
  luz, como el H⁺) y el paso de Ca²⁺/Mg²⁺ entre células con la misma
  dependencia ("luz positiva"). Con furosemida (o cualquier fármaco que
  bloquee el canal del que depende) la célula muestra ROMK sin K⁺ que
  reciclar y el Ca²⁺/Mg²⁺ quedándose en la luz ("se pierden en la orina");
  el panel del tramo lo dice también. `diana` de un canal es opcional.

### Acidosis tubulares en la nefrona viva (octubre 2026)

A petición explícita del usuario ("sigue con lo que queda de nefrología").
4 situaciones más en `situacionesNefrona` con `grupo: 'acido'` (rótulo
"Acidosis hiperclorémica" en los chips — `chips()` pinta ahora un rótulo
por cada `grupo`, tabla `GRUPOS`): **diarrea, ATR I (distal), ATR II
(proximal) y ATR IV (hipoaldosteronismo)**.

- **Lo que se ve es la tabla de la ficha**: `acido.tabla` copia la tabla
  "Diarrea frente a las ATR" de Ácido-base: acidosis (HCO₃⁻ y K⁺ en
  sangre, hiato aniónico urinario, pH urinario mínimo) y "NH₄⁺ en orina"
  sale de la frase del hiato aniónico urinario (negativo = NH₄⁺ presente,
  positivo = sin excreción). Todos los medidores llevan `ficha`. Con un
  fármaco puesto se vuelven a ver los medidores normales, con un aviso.
- **`defecto`** (`{segmento, canal, nombre, nota, etiqueta, tramo?,
  etiquetaEn?}`): lo que falla, marcado con ✕ en el dibujo (en el lado
  contrario al del fármaco) y en la célula con su `nota` — ATR I en la
  célula intercalar tipo A, ATR II en la anhidrasa carbónica del
  proximal, ATR IV en ENaC (y el colector se comporta como con un
  ahorrador de K⁺: `ahorraK`). `bloqueado()` devuelve el fármaco o, si
  no, el defecto.
- **H⁺ y NH₄⁺ como partículas** (formas nuevas `cruz` y `pent`, tasa de
  filtrado 0): los secreta el colector en todas las situaciones
  (`secretar(esp)`, antes `secretarK`), con `M.hSec`/`M.nh4Sec`; el
  HCO₃⁻ filtrado se escala con `M.hco3Spawn` (menos HCO₃⁻ en sangre).
  Todo eso, `kMult` y `hco3Proximal` son ilustrativos.
- **Fisiología general declarada** en el campo `general` de cada
  situación (se pinta bajo la explicación, `.nv-general`): dónde falla
  cada ATR, que la ATR I y II pierdan K⁺, que la aldosterona estimule la
  secreción de H⁺ — la ficha no lo dice.
- **Ficha**: ids `ab-hau`, `ab-t-diarrea/atr1/atr2/atr4`, `ab-gi`,
  `ab-atr`, `ab-atr4` para los "Texto ↓"; la receta de la vista Visual
  de la ficha gana `panelNefronaViva` con los 4 accesos.
- Verificado con Playwright (390×844): las 4 situaciones con sus valores,
  avisos y ✕; la célula del colector (ATR I y IV) y la del proximal
  (ATR II) muestran el fallo; acceso desde la ficha y "Texto ↓" a la fila
  de la tabla; sin errores ni desborde.

### Calcio, fósforo y magnesio en la nefrona viva (octubre 2026)

Misma petición ("sigue con lo que queda de nefrología").

- **Partículas nuevas**: Ca²⁺ y Mg²⁺ (óvalos) y fosfato (triángulo
  invertido), con su reabsorción por tramos en `mineralR()`. De las
  fichas: el Mg²⁺ se reabsorbe ~96% (2.300 de 2.400 mg; el medidor de Mg²⁺
  en situación normal lleva `ficha`), el fosfato sobre todo en el
  proximal por NPT2a,c, la rama gruesa reabsorbe Ca²⁺ y Mg²⁺ y la PTH sube
  la reabsorción distal de Ca²⁺. El reparto exacto por tramos es
  ilustrativo. Medidores nuevos "Ca²⁺ en orina" y "Mg²⁺ en orina"
  (×N respecto a lo normal): furosemida ×3 y ×5; tiazida baja el Ca²⁺
  (×0,25) y sube el Mg²⁺, con avisos que citan dónde lo dice la ficha.
- **Canales nuevos**: NPT2a,c en el proximal y "Canal de Ca²⁺" en el
  distal (salida por el intercambiador Na⁺/Ca²⁺ de la ficha, con su nota
  de fidelidad). Lo que no dice la ficha va en `general`. Para que el
  proximal siga cabiendo con un transportador más, `filasCelula()` usa
  filas más bajas y una célula más alta (`ALTO_C`) solo cuando no caben.
- **3 situaciones** (`grupo: 'mineral'`): hiperparatiroidismo 1º,
  hipercalcemia-hipocalciuria familiar y exceso de FGF23. Los medidores
  son las filas de la tabla de la hipercalcemia y los algoritmos de la
  ficha (`mineral.tabla`), más la RTP de la animación (ilustrativa).
- **`efectos`** generaliza el `defecto` de las ATR: cada situación frena
  (`tipo: 'bloquea'`, ✕ y nota en rojo) o estimula (`'activa'`, rótulo y
  nota en verde, sin ✕) un canal — PTH frena NPT2a,c y estimula el canal
  de Ca²⁺ del distal; el CaSR mutado estimula el paso entre células de la
  rama gruesa (`canal: 'paracelular'`); el FGF23 frena NPT2a,c.
  `efecto(seg, canal, tipo)` los busca.
- **`copiaLinea()`** copia solo el pie de una `.article-figure` (Figura 1
  del FGF23, Figura 6) en vez de la imagen entera.
- **Nota de fidelidad nueva** en la ficha Hipercalcemia: la HHF dice
  "excreción fraccional de Ca mayor que en el hiperparatiroidismo 1º",
  que contradice la frase anterior, la Figura 4 y la tabla de la misma
  ficha (Cca/Cr <0,01 frente a >0,02). El PDF de Ca-P-Mg no está en
  `docs/`, así que no se ha podido saber si la errata es de la fuente.
- Accesos (`panelNefronaViva`) desde las vistas Visual de Hipercalcemia,
  Fósforo y Magnesio; ids nuevos `nv-t-pth`, `ca-hpt1`, `ca-hhf`,
  `ca-t-hpt`, `ca-t-hhf`, `ca-orina`, `p-regulacion`, `p-fgf23`,
  `p-fig6`, `mg-homeo`.
- Verificado con Playwright (390×844): las 3 situaciones, furosemida y
  tiazida; las células del proximal (NPT2a,c frenado por la PTH), del
  distal (Ca²⁺ con tiazida) y de la rama gruesa (CaSR); los accesos y
  "Texto ↓"; las ATR sin regresión; sin errores ni desborde.

### Filtro vivo de la TRR (octubre 2026)

Última pieza de "lo que queda de nefrología": `js/modules/nefrologia/
filtro-vivo.js` (`montarFiltro(cuerpo, { tab }, opciones)`, mismo patrón
que el glomérulo vivo: un panel `propio` de la vista Visual que elige sus
mandos). Una fibra del filtro por dentro: la sangre entra por la
izquierda y vuelve al paciente por la derecha, la membrana con poros, el
compartimento del dializado/ultrafiltrado y el efluente. Partículas:
hematíes y albúmina (nunca cruzan), urea y K⁺ (pequeñas), citoquinas
(mayor tamaño), Ca²⁺, agua/reposición y el Ca²⁺ unido al citrato.

- **Mandos** (`opciones.mandos`): `modo` (Difusión = HD intermitente /
  Convección = TRR continua / Híbrida SLED-PIRRT), `dosis` (flujo del
  efluente 15-70 ml/kg/h), `qb` (flujo sanguíneo), `reposicion`
  (prefiltro/posfiltro) y `anticoag` (ninguna/heparina/citrato, con botón
  "Cambiar el filtro"). Sin el mando `anticoag` el filtro no se coagula ni
  se dibuja el citrato.
- **De la ficha** (`trr.html`, Valdenebro et al.), con etiqueta `ficha`:
  mecanismo y duración de cada técnica (Tabla 1), que la convección
  arrastra moléculas de mayor tamaño, la dosis (>25 ml/kg/h solo en
  observacionales, ningún ensayo con beneficio ni a 70 ml/kg/h,
  "dialitrauma" y pérdida de citoquinas), las estrategias contra la
  coagulación (subir el flujo, bajar la fracción de filtración, alternar
  la reposición pre y posfiltro), heparina sistémica frente a citrato
  regional (Ca²⁺ iónico en el circuito <0,35 mmol/l con citrato a 4-6
  mmol/l, infusión de calcio para el paciente, el complejo que llega a la
  sangre lo metaboliza el hígado a bicarbonato). Cada aviso lleva su
  "Texto ↓" (ids nuevos en `trr.html`: `trr-t-hd`, `trr-t-cont`,
  `trr-t-hib`, `trr-hd`, `trr-cont`, `trr-dosis-base`,
  `trr-dosis-reciente`, `trr-coag-problema`, `trr-coag-estrategias`,
  `trr-t-heparina`, `trr-t-citrato`, `trr-citrato-mec`, `trr-monitores`).
- **Ilustrativo**, y lo dice la vista: la fracción de filtración (paciente
  de 70 kg, hematocrito 30%; con reposición prefiltro la sangre llega
  diluida, posfiltro se concentra y la fibra se oscurece), lo rápido que
  se coagula el filtro (fibrina desde la salida) y cuántas partículas
  cruzan la membrana.
- Montado en 3 fichas de TRR (`visual-trr.js`, `TEXTOS` y `filtro()`):
  Modalidad (solo el modo, arranca en HD), Dosis (dosis, reposición y
  flujo) y Anticoagulación (arranca sin anticoagular, posfiltro y flujo
  bajo, para ver coagularse el filtro).
- Sin CSS nuevo: reutiliza `.gl-escenario`, `.gl-mandos`, `.nv-medidores`,
  `.nv-especies` (leyenda bajo el dibujo), `.tfg-slider-row` y
  `.hk-avisos`.
- Verificado con Playwright (390×844): los 3 modos, dosis 60 (aviso de los
  ensayos), sin anticoagular (el filtro se coagula), citrato (Ca²⁺
  atrapado en el circuito y repuesto a la salida), "Texto ↓" y capturas
  revisadas una a una (se movieron rótulos que se pisaban y la salida del
  efluente para que no cruzara la fibra); sin errores ni desborde.

### PDF de Nefrología al día archivados y pérdida de nefronas (octubre 2026)

A partir del informe «Pendientes de la nefrona viva», el usuario aportó los
PDF que faltaban y pidió la pérdida de nefronas con la opción A o B.

- **Archivados en `docs/`**: `de-sequera-2024-trastornos-potasio.pdf`,
  `rodelo-haad-2025-calcio-fosforo-magnesio.pdf`, `alcazar-2025-acido-base.pdf`
  y `nefrologia-al-dia-2021-potasio-enfermo-renal.pdf` (NC-075, antes
  retirado de la bibliografía por no usarse; ahora es fuente de ERC). La
  bibliografía de `nefro-menu.html` enlaza a los PDF, con la URL web en la
  nota. El de Agua y el de Kuriyama se archivaron después (ver la sección
  siguiente).
- **Las dos erratas eran de la fuente**: «excreción fraccional de Ca mayor»
  en la HHF (pág. 17 frente a la Figura 4 y la Tabla 5 de la pág. 20) y
  «moderada (3-3,5)» en la hipopotasemia (pág. 10 frente a la definición de
  la pág. 7). Las notas de fidelidad citan ahora la página con enlace
  `#page=N`. A la tabla de la hipercalcemia le faltaban 3 filas de la
  Tabla 5 (HPTH con déficit de vitamina D, HPTH secundario, HPTH
  normocalcémico), añadidas.
- **Reparto por tramos con fuente** (`ca-rinon`, `p-fep`, `mg-rinon` en
  las fichas Hipocalcemia, Fósforo y Magnesio): Ca²⁺ 70% proximal, 20-25%
  rama gruesa (paracelular, carga positiva de la luz; el CaSR reduce la
  salida de K⁺), 5-10% distal (TRPV5/6); Mg²⁺ 25/65/5% con ~5% excretado;
  RTP >80%, FEP 5-20%. `mineralR()` de `nefrona-viva.js` usa esas cifras.
  **Corrección del modelo**: la fuente dice que las tiazidas causan
  hipocalciuria porque la contracción de volumen sube la reabsorción
  **proximal** de Ca²⁺; antes la nefrona viva lo dibujaba en el distal
  (ya no). El texto `general` de la rama gruesa y del distal se rehízo: el
  paso de Ca²⁺/Mg²⁺ entre células y su pérdida con furosemida ya tienen
  fuente; solo el reciclaje de K⁺ por ROMK sigue siendo fisiología general.
- **Nefronas que quedan** (`js/modules/nefrologia/nefronas-vivas.js`,
  `montarNefronas`), panel `propio` de la vista Visual de ERC · Acidosis e
  hiperpotasemia (Ficha 7). Es una mezcla de A y B: un riñón de 40 nefronas
  con un deslizador de nefronas que funcionan y los mandos IECA/ARA-II,
  iSGLT2 y dieta rica en K⁺.
  - **De la ficha**: la sección nueva «Qué hacen las nefronas que quedan»
    de la Ficha 7, ids `erc-n-compensa` (Carracedo, pág. 3), `erc-n-k` y
    `erc-n-k-limite` (NC-075 pág. 5; de Sequera pág. 29), `erc-n-p`
    (Rodelo-Haad pág. 24) y `erc-n-pig` (Gorostidi 2014 Tabla 5 y KDIGO).
    Dice que la pérdida se compensa, que las nefronas restantes secretan
    más K⁺ (hipertrofia, mitocondrias, Na⁺/K⁺-ATPasa) con un techo, que el
    riesgo es sobre todo con FGe <15 y antes con inhibidores del SRAA o con
    carga de K⁺, que la FEP llega al 50%, y que IECA/ARA-II e iSGLT2 bajan
    la presión intraglomerular. Sin tablas nuevas: la receta de la Ficha 7
    usa índices de tabla.
  - **Fisiología general**: que el glomérulo de cada nefrona restante
    filtre más con más presión (hiperfiltración). Va con rótulo propio en
    los medidores (`.nv-fuente.general`, amarillo).
  - **Ilustrativo**: el techo de secreción (`TECHO_K`, ajustado para que el
    K⁺ suba con FGe ~15), su reducción con IECA (×0,4) y la carga de la
    dieta (×2), el K⁺ en sangre y la curva de la FEP entre 12% y 50%.
  - Los «Texto ↓» llevan a la línea aunque viva en otra ficha del mismo
    cuaderno (`irA()`: `openCorkboardTopic` + `irAlTexto`).
- Verificado con Playwright (390×844): 100% → FGe 100, K⁺ 4,2; 50% → FGe
  70, cada nefrona ×2 K⁺ y K⁺ igual; 5% → FGe 9 y K⁺ 6,2; 20% con IECA →
  caída del FGe del 18% y K⁺ que empieza a subir; con iSGLT2 no sube; la
  nefrona viva sigue igual (hiperparatiroidismo, HHF, FGF23, furosemida y
  tiazida con los avisos nuevos); las vistas Visual de Hipocalcemia,
  Hipercalcemia, Fósforo, Magnesio, Hipopotasemia y Ficha 7 de ERC sin
  avisos de fuente no encontrada; sin errores ni desborde. Cache-busting a
  `?v=20261018-9`.

### PDF de agua y magnesio-presión arterial (octubre 2026)

A petición explícita del usuario («Aquí tienes el pdf del agua y lo que te
he mandado de kuriyama metelo también, creo que puede encajar en la parte
de nefro»).

- **Agua**: `docs/martin-navarro-2025-trastornos-agua.pdf` (Martín Navarro
  et al., Nefrología al día, 4/8/2025, 41 págs.), enlazado desde la
  bibliografía de `nefro-menu.html` con la URL web en la nota. Cotejado:
  las cifras de la nefrona viva (50-1.200, 18-0,75 L con 900 mOsm/día,
  pág. 6), los límites de corrección de la hiponatremia (10 y 8 mEq/l,
  18 en 48 h, pág. 22) y los cortes del test de deprivación (Tabla 11,
  pág. 30: normal &gt;800, DIC parcial 300-800, DIN 300-500) coinciden; la
  nota de fidelidad de la hipernatremia cita ahora esa página. Errata de
  la fuente con nota nueva en el kv-row «Poliuria» de Hipernatremia: la
  pág. 29 dice que la poliuria con Osmo *inferior* a 300 es osmótica, y su
  propia Figura 7 la lleva a Osmo &gt;250; la ficha usa «&gt;300».
- **Kuriyama S. Magnesium and blood pressure regulation: systemic and renal
  mechanisms. Hypertension Research 2026**
  (`docs/kuriyama-2026-magnesio-presion-arterial.pdf`, revisión narrativa
  de un solo autor, 10 págs.). Va en 3 sitios, siempre marcado como
  revisión narrativa:
  - Ficha **Magnesio** (`fisio-magnesio`), bloque nuevo «Magnesio y
    presión arterial» al final (antes del enlace a Sobrevivir a la UMI,
    para no cambiar los índices de tabla de la receta): distribución y
    formas del Mg, absorción intestinal, reabsorción por tramos con
    claudinas y TRPM6/7, iSGLT2 que suben el Mg, hipomagnesemias
    hereditarias, 5 mecanismos sistémicos en acordeón (músculo liso,
    endotelio, simpático, SRAA —controvertido—, inflamación), el «eje
    renal Mg-Na-K» con sal (hipótesis, sobre todo animal), la Tabla 1 de
    metaanálisis (`#mg-pa-tabla`, índice 4), a quién le baja la presión y
    que no hay ensayos con beneficio en eventos. Nota de fidelidad: el
    gradiente «−1,2 mV» del proximal es la misma cifra que la revisión da
    para el intestino y no se usa. Ids `mg-pa-*`. La receta de la vista
    Visual gana 2 paneles `racimos`.
  - HTA Ficha 3 (`hta-tratamiento-general`): kv-row `hta-magnesio` debajo
    de la tabla de estilo de vida (que no se toca, es de otra fuente) con
    el enlace al bloque de la ficha Magnesio, y entrada en la bibliografía
    de `hta.html`.
  - Nefrona viva: canal nuevo **TRPM6/7** en el túbulo distal (ion `mg2`
    en la célula) y la PTH lo estimula en el hiperparatiroidismo (efecto
    `activa` sin rótulo en la nefrona: `etiqueta` de un efecto es ahora
    opcional). Por dónde sale el Mg²⁺ a la sangre no lo dice ninguna
    fuente; la célula pone «Salida a la sangre».
- 5 preguntas nuevas (`nefro-q256`-`q260`, 4 opción múltiple + 1 de
  redactar). Fisio-magnesio queda en 30.
- Verificado con Playwright (390×844): la vista Visual de Magnesio sin
  fuentes sin resolver; el enlace HTA → Magnesio abre la ficha; célula
  del distal con TRPM6/7 (y con la nota de la PTH en el
  hiperparatiroidismo); accesos de Calcio/Fósforo/Magnesio a la nefrona
  viva sin regresión; sin errores ni desborde.


### Una sola leyenda de formas de iones (octubre 2026)

Tarea `formas-iones` del plan socialista, aprobada el 19/10/2026. El usuario: «sí, vamos a unificar todas esas formas
en la app, pero antes arregla los fallos»; después, sobre la lámina, «la tabla de formas me vale, aplícala».

- **Por qué**: cada modelo vivo dibujaba los iones a su manera. En la nefrona viva el rombo era la glucosa; en las
  maquetas de Marino era el Cl⁻. Dentro de la propia nefrona, el túbulo y la célula no coincidían (H⁺, Ca²⁺,
  fosfato).
- **Qué se hizo**:
  - Una sola tabla, `js/data/formas-iones.js`, y un solo dibujo, `js/core/particulas.js`. Este pinta la forma en
    lienzo (`pintarParticula`) y en SVG (`svgParticula`) y monta la leyenda (`leyendaParticulas`, reutiliza
    `.nv-especies`).
  - La leen la nefrona viva (túbulo, célula y barrera), el glomérulo, el filtro de la TRR, las nefronas que quedan
    y las escenas del potasio.
  - Se quitaron los dibujos de formas repetidos en cada modelo.
- **Tabla**:
  - agua: gota;
  - Na⁺: círculo oro;
  - Cl⁻ y la sal: rombo ciruela (el salino al 3 % y al 7,5 % llevan 1 y 2 halos);
  - HCO₃⁻: triángulo salvia (Ringer lleno y Plasma-Lyte hueco);
  - H⁺: cruz teja;
  - CO₂: voluta;
  - NH₄⁺: pentágono;
  - aniones no medidos: estrella hueca;
  - K⁺: cuadrado (en el potasio, el color dice el sitio);
  - Ca²⁺: óvalo, y Mg²⁺ óvalo hueco;
  - fosfato: triángulo invertido;
  - glucosa: copo de 6 radios;
  - urea: hexágono;
  - albúmina: círculo grande;
  - citoquinas: trébol;
  - citrato: anillo ámbar;
  - hematíes: disco;
  - creatinina: luna (reservada).
  
  Solo tokens, con borde fino `--bg-main`. Ninguna pareja que sale junta comparte forma.
- **Leyenda nueva** en el glomérulo, las nefronas que quedan y el potasio.
- **Error arreglado**: con la vista de célula abierta, un botón `data-nefrona-viva` (o el «← VOLVER») llamaba a
  `svgCelula(null)` y la célula quedaba congelada.
- Las maquetas v2 de Marino (rama `auto/marino-mapa`) siguen la misma tabla. La lámina con el antes y el después
  está en `autonomo/maquetas/formas-iones.html`.
- **Regla para lo que venga**: un modelo nuevo con partículas pinta con `js/core/particulas.js`; no se dibujan formas
  propias.

### Ácido-base vivo en la app (octubre 2026, plan socialista, Objetivo M4)

- **Qué**: la maqueta aprobada `autonomo/maquetas/marino-acidobase-v2.html` (PR #16), pasada a la app sin perder
  nada: instrumento de latón con el móvil, alvéolo, plasma y riñón en tres saltos, carta náutica, laboratorio de 16
  estados, Explorar | Conceptos | Mayéutica (14 preguntas, repaso y 4 casos), cabecera mini y dock. La medicina ya
  estaba auditada: no se tocó ni una cifra ni un texto clínico.
- **Dónde**: vista propia de Nefrología, junto a la nefrona viva (`acidobase` en `nefroLevel`, partial
  `acidobase-vivo.html`). Código en `acidobase-vivo.js` (modelo y capa de estudio) y `acidobase-vivo-calculo.js`
  (Ec. 31.1-31.17 y Reglas 1-4, sin DOM); datos en `js/data/acidobase-vivo-data.js`. CSS con prefijo `abv-`.
- **Cambios para integrarla**:
  - formas de las partículas con `js/core/particulas.js` (fuera las formas copiadas; el Na⁺ del vaso pasa a oro,
    como en la tabla);
  - Motion con `cargarMotion()`, y solo si no hay «reducir movimiento»; todo se construye la primera vez que se
    abre la vista; el bucle se para con la vista oculta o la pestaña en segundo plano;
  - lo que en la maqueta eran funciones en los datos («comprobar», botones de los conceptos) va declarado;
  - sin `data-correcta` ni `data-mal`; aciertos, fallos y casos hechos en `localStorage` (`acidobase-vivo-v1`);
  - las salidas de la maqueta (nefrona viva, glomérulo, fichas, calculadoras) son enlaces cruzados de verdad;
    «Ver en el texto» abre la ficha y resalta la línea citada;
  - el pico al cambiar de paciente (20 vuelos a la vez) se quitó: los platillos se rellenan de golpe;
  - la nota de las formas se actualizó a la tabla única; «Río y mar» (paso 3) apunta, de momento, a la Tabla 10.2
    de la ficha de cristaloides.
- **Accesos** (los mismos mecanismos que el río y mar, para fusionar sin choques):
  - bloque «Modelos vivos» en el mapa del riñón y en el menú de Libros (`abv-menu-nefro`, `abv-menu-libros`);
  - buscador global: atajos ocultos con `data-buscar-titulo` en el partial (gasometría, pH, hiato aniónico y
    osmolal, compensación, alcalosis, salicilatos, EPOC, preguntas);
  - un botón en 11 fichas (`mr-acidobase-*`, `mr-alcalosis-*`, `mr-cetoacidosis`, `mr-lactato-bicarbonato`,
    `mr-osmolalidad`, `mt-alcoholes`, `mt-salicilatos`, `fisio-acidobase-*`) que abre el estado de su tema con
    `data-acidobase-vivo` (Nefrología lo declara en `modelosVivos` de su API; lo resuelve el listener de
    `home/index.js`).
