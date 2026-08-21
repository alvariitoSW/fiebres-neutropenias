# HUD Clínico UCI — guía para trabajar en este repo

App web de estratificación de riesgo clínico y apoyo a la decisión en UCI,
organizada por especialidad. Hoy tiene contenido completo de **Hematología**
(manejo de citopenias, reconocimiento temprano del paciente hematológico,
síndromes urgentes, trasplante de progenitores, más un acceso directo a
escalas generales de UCI), **Nefrología** con contenido real en la mayoría
de sus objetivos de rotación (fisiología/electrolitos, HTA, ERC, FRA, TRR,
ajuste de fármacos), **UCI / Papers Tuiter** con varios papers resumidos
(resucitación hemodinámica en shock séptico, óxido nítrico inhalado,
disfunción del VD y LRA postoperatoria), y **Fisiopatología UCI** con
repasos de capítulos de "El Libro Azul: Bases Fisiopatológicas de la
Medicina Crítica" (hoy, Hematología y Hemostasia en Cuidados Críticos,
Vías Urinarias, y Cardiología). Está pensada para ir creciendo con más
especialidades (radiología, etc.) según se vaya aportando contenido. Es
una herramienta de apoyo para médicos, pensada para consultarse a pie de
cama en el móvil.

## Decisiones de arquitectura (ya tomadas, no las reabras sin preguntar)

- **Sin backend, sin login, sin base de datos.** Es una calculadora estática:
  el usuario abre la página, rellena campos, ve un resultado. Nada se guarda.
  **Única excepción, deliberada y acotada:** el quiz de repaso
  (`js/modules/quiz/`, ver "Sistema de estudio tipo Anki" más abajo) sí usa
  `localStorage` para recordar aciertos/fallos por pregunta en el
  dispositivo del usuario. No añadas `localStorage` (ni ningún otro tipo de
  persistencia) a ningún otro módulo sin que sea, igual que este, una
  decisión explícita — el resto de la app sigue sin guardar nada.
- **Sin build tool.** No hay npm/Vite/webpack. Todo es HTML/CSS/JS que el
  navegador ejecuta tal cual. Se despliega copiando el repo a GitHub Pages,
  sirviendo `index.html` desde la raíz.
- **Cada escala/calculadora es código específico**, no un motor genérico
  configurable. Se acepta algo de repetición entre calculadoras a cambio de
  que cada una sea fácil de leer y depurar de forma aislada.
- **HTML modular vía `fetch()`, no todo en un único archivo.** `index.html`
  es solo el esqueleto (cabecera + contenedores). Cada calculadora tiene su
  propio `.html` con su marcado, cargado en runtime mediante
  `data-include="ruta.html"` (ver `js/core/include.js`). Esto es lo que
  evita volver a tener un archivo de 1800 líneas.

Este proyecto **viene de un único `index.html` monolítico** (todo el
CSS y JS embebidos inline) que se reestructuró para que cada sesión de
Claude Code solo necesite leer los 2-3 archivos pequeños relevantes a la
tarea, no el proyecto entero.

## Estructura de carpetas

```
index.html                  Esqueleto: head, cabecera, botones de acordeón,
                             contenedores con data-include. No tiene lógica.
css/
  variables.css              Paleta de colores y tokens (:root)
  base.css                   Reset, layout general, acordeón (visual)
  components.css             Componentes visuales reutilizables (card,
                              result-box, tabs, pkpd-btn, tablas, etc.)
js/
  main.js                    Punto de entrada: carga los partials HTML,
                              activa acordeones, inicializa cada módulo.
  core/                       Infraestructura genérica reutilizable
    include.js                 Carga fragmentos HTML vía fetch()
    accordion.js                Abrir/cerrar bloques .accordion-btn
    tabs.js                     Comportamiento genérico de pestañas — IMPORTANTE:
                                  como todos los partials se cargan a la vez (aunque
                                  estén ocultos), si hay más de un grupo de pestañas
                                  en la app hay que llamar a initTabs(contenedor, cb)
                                  con un contenedor específico (nunca document), y
                                  cualquier document.querySelector('.tab.active') que
                                  uses dentro del módulo debe ir acotado igual
                                  (ej. '#mi-panel .tab.active'). Si no, los grupos de
                                  pestañas de distintos módulos interfieren entre sí.
    navigation.js                createViewSwitcher(): muestra una vista de
                                  un grupo y oculta el resto (menú de
                                  especialidades, menú principal de
                                  Hematología, submenú de Citopenias,
                                  submenú de Trasplante)
    lightbox.js                  Click en cualquier imagen dentro de
                                  .article-figure para ampliarla a pantalla
                                  completa. Se inicializa una sola vez desde
                                  main.js; no hace falta tocarlo al añadir
                                  imágenes nuevas en otros módulos, basta con
                                  envolver la <img> en un div.article-figure
  data/                       Objetos de datos puros (tablas de dosis,
                               tratamientos por foco, etc.), sin DOM.
  modules/
    home/                       Orquesta la navegación jerárquica (ver abajo).
                                 No tiene calculadoras propias.
    <categoria>/               Una carpeta por categoría clínica
      index.js                   Importa y arranca los módulos de la carpeta
      <calculadora>.html          Marcado de esa calculadora/tarjeta
      <calculadora>.js            Lógica de esa calculadora: función de
                                   cálculo + export function init()
```

## Navegación: especialidad → menú principal → categoría → submenú

La app abre en una pantalla de **menú de especialidades** (`#especialidades-view`,
definida directamente en `index.html`) con un botón grande por especialidad:
hoy **Hematología** y **Nefrología**. Es el nuevo nivel raíz de la
navegación; para añadir una especialidad nueva (p. ej. Cardiología,
Radiología) sigue el mismo patrón que Nefrología (ver más abajo) y añade su
botón aquí.

### Hematología

Al pulsar "Hematología" se entra en `#home-view` (definido directamente en
`index.html`, con un botón "← VOLVER" que usa la clase
`.btn-volver-especialidades` para regresar al menú de especialidades). El
menú principal de Hematología ya no es una lista de botones apilados: es el
**Atlas Hematológico**, un mapa interactivo de 2 niveles (`#atlas-stage`,
lógica en `js/modules/home/atlas.js`) pensado para navegar de forma más
visual que un scroll infinito, sin cambiar ni una línea del contenido
clínico real al que da acceso.

- **Nivel general** (`#atlas-screen-overview`): un `<svg class="landscape">`
  puramente decorativo (gradientes/blobs de brillo + un trazado
  `.vessel-line` que conecta los nodos) de fondo, con 4 `.region-btn`
  posicionados encima (vía `left`/`top` en `%` + `transform:
  translate(-50%,-50%)`, sin JS de animación): Manejo Citopenias,
  Reconocimiento Temprano, Síndromes Urgentes y Trasplante TPH. Cada nodo
  con `data-zone="..."` lleva a una pantalla de zona; el único nodo que no
  tiene zona intermedia (Reconocimiento) lleva `data-route="reconocimiento"`
  directamente.
- **Pantallas de zona** (`#atlas-screen-citopenias`, `#atlas-screen-sindromes`,
  `#atlas-screen-trasplante`): nodos más pequeños (`.node-sm`) con los
  subtemas reales de esa categoría, cada uno con `data-route="clave"`; un
  `.back-chip[data-back="atlas-screen-overview"]` vuelve al mapa general.
- Las claves `data-route` se resuelven en el objeto `rutasAtlas` de
  `js/modules/home/index.js`, que llama a los switchers/tabs reales ya
  existentes (`topLevel.show(...)`, `citopeniasLevel.show(...)`,
  `trasplanteLevel.show(...)`, o un click simulado sobre la pestaña
  correspondiente de Síndromes Urgentes) — el Atlas es solo una forma nueva
  de LLEGAR al contenido, nunca lo duplica ni lo reescribe.
- `atlas.js` marca cada nodo visitado (`.visited`, clase con un puntito) en
  un `Set` en memoria, sin persistencia (nada se guarda, según la
  arquitectura del proyecto) — pensado como semilla de un futuro modo de
  repaso activo, aún no implementado.
- Al volver a Hematología desde cualquier vista (`goHome()` en
  `home/index.js`) el Atlas se resetea siempre al mapa general
  (`atlas.reset()`), para que las 4 regiones estén siempre a un toque tras
  salir de cualquier contenido.
- Fuera del `<div class="stage">` del Atlas, sigue habiendo un botón
  `.compass` (⚡) fijo que abre Escalas Generales, igual que antes.

El Atlas sustituyó estos 4 botones grandes:

1. **Manejo Citopenias** (`modules/citopenias/`) — submenú "elige la
   citopenia"; hoy solo tiene una opción, **Neutropenia Febril**
   (`modules/neutropenia-febril/`, sin cambios internos: sus 4 sub-vistas
   propias — triaje/MASCC, diagnóstico, tratamiento empírico, tratamiento
   dirigido — se siguen navegando con su propio `navigation.js`, ahora
   anidado dentro del submenú de Citopenias). Para añadir otra citopenia,
   sigue el mismo patrón: nueva carpeta en `modules/`, botón nuevo en
   `citopenias-menu.html`, y una entrada más en el switcher `citopeniasLevel`
   de `modules/home/index.js`.
2. **Reconocimiento Temprano del Paciente Hematológico**
   (`modules/reconocimiento/`) — fracaso respiratorio agudo en el paciente
   hematológico crítico: epidemiología, contexto/causas, enfoque DIRECT,
   diagnóstico, síndromes y toxicidades, manejo/pronóstico, terapias
   dirigidas, decisiones de ingreso y fin de vida. Basado en Azoulay et al.
   (Blood 2024 y Blood Reviews 2025, ver `js/modules/reconocimiento/`). Sus
   9 subtemas ya no se navegan con una barra de pestañas de texto: es el
   **Cuaderno de Campo**, un tablero de fichas ilustradas
   (`#rt-corkboard`, lógica genérica en `js/core/corkboard.js`) pensado
   como un tratamiento visual más "de estudio" para el contenido de
   teoría, en el mismo espíritu que el Atlas Hematológico pero un nivel
   más abajo (dentro de UN tema, no entre categorías). Este patrón
   arrancó como piloto solo aquí y, tras confirmarse, se extendió a
   **todos** los módulos de Hematología que antes usaban una barra de
   pestañas de texto (`.tabs`/`.tab` + `core/tabs.js`): Síndromes
   Urgentes, y las tres sub-vistas de Trasplante (Introducción, CAR-T,
   Complicaciones post-TPH) — ver el punto 3 y 4 más abajo. Cada
   `.field-card` (parchment, ligero giro aleatorio tipo ficha clavada en
   un corcho, ilustración de tinta en SVG propia del tema) lleva
   `data-tab="xxx"` apuntando al mismo `id` de `.tab-content` de siempre
   — el contenido clínico íntegro de cada subtema no se ha tocado ni
   resumido, solo cambió la portada para llegar a él. Interacción en dos
   toques: el primer toque voltea la ficha (`.flipped`, flip 3D con
   `.field-card-inner`) y muestra una pregunta de repaso con su respuesta
   corta (pensada como gancho de recall activo, no como resumen del
   tema); el segundo toque, sobre el botón `.back-cta` de la cara
   trasera, llama a `openCorkboardTopic(panelId, tabId)` (exportada desde
   `core/corkboard.js`), que quita `.active` de todos los `.tab-content`
   del panel, se lo pone al elegido, hace `scrollIntoView`, y revela el
   panel — que arranca con `style="display:none"` inline en el HTML para
   no dejar una caja vacía entre el tablero y lo que venga después antes
   de elegir un tema. `initCorkboard(boardId, panelId)` es lo único que
   cada módulo llama desde su `init()`; `openCorkboardTopic` también se
   usa desde fuera (p. ej. `modules/home/index.js` la usa para que el
   Atlas enlace directamente a un tema de Síndromes Urgentes sin pasar
   por el volteo). Estos módulos ya NO usan `core/tabs.js` — la
   interacción de dos toques no encaja en su patrón de un solo clic. Si
   en el futuro se detecta contenido teórico denso en un módulo nuevo con
   barra de pestañas, este es el patrón a replicar.
3. **Síndromes Hematológicos Urgentes** (`modules/sindromes-urgentes/`) —
   una sola vista con 3 temas (CID / PTT / Síndrome de Lisis Tumoral),
   navegados desde un cuaderno de campo (`#sindromes-corkboard`, ver
   `js/modules/sindromes-urgentes/index.js`) igual que las tres sub-vistas
   de Trasplante — no una barra de pestañas de texto (ver el patrón
   completo en el punto 2, "Reconocimiento Temprano"). **CID** tiene contenido real: definición
   actualizada 2025, fenotipo trombótico vs. hemorrágico, diagrama de
   fisiopatología (depósito de fibrina/microtrombosis/fallo orgánico vs.
   consumo de plaquetas-factores/hemorragia), trastornos subyacentes
   asociados, esquema de progresión por etiología (barras `.phenotype-bar`),
   diagramas SVG originales (`.micro-svg`, mismo patrón que
   `microorganismos-data.js`) para los fenotipos a nivel del vaso
   (microtrombosis vs. rotura de la barrera hemostática) y para el algoritmo
   diagnóstico ISTH como flujograma con rombos de decisión, hallazgos de
   laboratorio con su utilidad/limitaciones (acordeón), terminología
   relacionada (acordeón), tabla de puntuación ISTH 2025 (Overt DIC 2021/2025
   y SIC) y dos calculadoras interactivas (Overt DIC 2025 y SIC, con gauge
   visual de puntuación y marca del corte diagnóstico) — todo en
   `js/modules/sindromes-urgentes/cid.js` con datos en
   `js/data/sindromes-urgentes-data.js` —, más tratamiento por fenotipo y
   recomendaciones de tratamiento detalladas con grados de evidencia
   (`.grade-badge`), incluyendo una nota histórica explícita de que la
   proteína C activada recombinante (Xigris®) fue retirada del mercado en
   2011 tras el ensayo PROWESS-SHOCK y ya no forma parte de la práctica
   clínica actual — no reproducir esa recomendación como vigente si se
   amplía este apartado en el futuro. Fuentes: Iba T, et al. J Thromb
   Haemost. 2025;23(7):2356-2362 (comunicación ISTH SSC) y Levi M, Toh CH,
   Thachil J, Watson HG. Br J Haematol. 2009;145(1):24-33 (guía BCSH).
   **PTT** también tiene contenido real: comparación PTTi (autoinmune) vs.
   PTTc (congénita/Upshaw-Schulman), diagrama SVG de fisiopatología a nivel
   del microvaso (microtrombo de FvW-plaquetas + esquistocitos), aviso sobre
   la péntada de Raynaud (presente solo en el 40% de los casos — no
   exigirla para sospechar PTT), calculadoras interactivas French score y
   PLASMIC score, flujograma SVG del algoritmo diagnóstico-terapéutico
   urgente, manejo agudo (TPE, corticoides, monitorización, acceso venoso,
   transfusión de plaquetas, profilaxis de TVP), caplacizumab (con aviso de
   riesgo hemorrágico) y rituximab, reemplazo con ADAMTS-13 recombinante
   para la PTTc en remisión con árbol de decisión SVG (recreación de la
   Figura del artículo), tabla de PTT refractaria, desencadenantes de
   recaída y complicaciones a largo plazo, acordeones de embarazo y de
   pacientes que rechazan hemoderivados, y tabla resumen de las 12
   recomendaciones GRADE de la guía — todo en
   `js/modules/sindromes-urgentes/ptt.js` con datos en
   `js/data/ptt-data.js`. Fuente: Zheng XL, et al., on behalf of the ISTH.
   2025 focused update of the 2020 ISTH guidelines for management of
   thrombotic thrombocytopenic purpura. J Thromb Haemost.
   2025;23(10):3711-3732; French score de Coppo P, et al. PLOS One.
   2010;5:e10208; PLASMIC score de Bendapudi PK, et al. Lancet Haematol.
   2017;4:e157-64. **Síndrome de Lisis Tumoral** también tiene contenido
   real: calculadora de los criterios diagnósticos de Cairo-Bishop (SLT de
   laboratorio ≥2 de 4 criterios; SLT clínico = SLT de laboratorio + ≥1
   criterio clínico), selector interactivo de riesgo por enfermedad/estadio/
   tratamiento (17 combinaciones aplanadas de la Tabla 2 del artículo),
   diagrama SVG del catabolismo de purinas con los sitios de acción de
   alopurinol/febuxostat (xantina oxidasa) y rasburicasa (urato oxidasa),
   tabla de fármacos uricosúricos, profilaxis (hidratación, debulking de la
   enfermedad, educación del paciente, evitar nefrotóxicos, monitorización),
   tratamiento del SLT establecido (hidratación, alteraciones electrolíticas,
   hiperuricemia, indicaciones de TRR) con flujograma SVG del algoritmo de
   manejo, y consideraciones de seguridad del paciente sobre la
   disponibilidad de rasburicasa (con nota sobre el análisis de incidentes
   del NHSE que motivó esta actualización de la guía) — todo en
   `js/modules/sindromes-urgentes/slt.js` con datos en
   `js/data/slt-data.js`. Fuente: Chan YLT, El-Sharkawi D, Shah P, Chanouzas
   D, O'Connor D, Marks SD, Jones G, on behalf of the BSH Committee. British
   Society for Haematology updated guidelines for the diagnosis and
   management of tumour lysis syndrome in adults and children with
   haematological malignancies: A focus on patient safety. Br J Haematol.
   2025;207(4):1248-1258; criterios diagnósticos de Cairo MS, Bishop M. Br J
   Haematol. 2004;127:3-11. Con esto, las 3 pestañas de Síndromes Urgentes
   tienen contenido real completo.
4. **Trasplante de Progenitores Hematopoyéticos** (`modules/trasplante/`) —
   submenú con tres sub-vistas, todas con contenido real, y las tres
   navegadas desde su propio cuaderno de campo (`#tph-corkboard`,
   `#cart-corkboard`, `#comp-corkboard` — mismo patrón de fichas
   ilustradas que Reconocimiento Temprano y Síndromes Urgentes, ver el
   punto 2 más arriba) en vez de una barra de pestañas de texto:
   **Introducción** (selección de donante, acondicionamiento — clasificación
   por intensidad, tabla diagnóstico→régimen, soporte común, ICT —, ingreso y
   controles en planta con Clostridioides difficile y traslado a UMI,
   fallo/rechazo de injerto con selector interactivo, manejo de productos de
   terapia celular con incidencias microbiológicas, soporte clínico —
   profilaxis antiinfecciosa, mucositis, dolor, náuseas, nutrición,
   transfusión, G-CSF, infusión de progenitores —, criterios de alta — ver
   `js/modules/trasplante/index.js` y `js/data/trasplante-data.js`),
   **CAR-T y complicaciones que llevan a UCI** (indicaciones/criterios de
   selección por producto, infusión y linfodepleción, selector interactivo
   de grado de SLC/CRS y de ICANS con tratamiento, otras complicaciones
   precoces — ver `js/modules/trasplante/car-t.js` y
   `js/data/car-t-data.js`) y **Complicaciones post-TPH** (neutropenia
   febril específica del TPH con selector por foco y por germen
   multirresistente, infección de catéter, tratamiento antifúngico dirigido,
   infecciones víricas incluido CMV, EICH agudo con selector de grado, y
   complicaciones no infecciosas — EVOH/SOS, síndrome del injerto, síndrome
   de fuga capilar, hemorragia alveolar difusa, síndrome de neumonía
   idiopática, microangiopatía trombótica, diarrea y cistitis hemorrágica —
   ver `js/modules/trasplante/complicaciones.js` y
   `js/data/complicaciones-tph-data.js`). El contenido viene de protocolos
   internos (PNT) del Servicio de Hematología y
   Hemoterapia — nunca reproduzcas esos documentos originales ni los nombres
   del personal que figuran en ellos; extrae solo el contenido clínico y
   reescríbelo con la voz propia de la app, citando de forma genérica
   ("protocolo del Servicio...") más la bibliografía que citen (Manual de
   Trasplante Hematopoyético, EBMT Handbook, Estándares JACIE, etc.). Si
   llegan más protocolos de este mismo lote, sigue este mismo criterio de
   filtrado: descarta los puramente administrativos (orden de archivo,
   digitalización, gestor de datos, contingencia informática) e incorpora
   solo los que aporten valor clínico real.

**Escalas Generales** (`modules/generales/`, qSOFA/SRIS/SOFA/Glasgow) ya NO
es una de las 4 categorías del menú: es un botón pequeño y fijo arriba a la
derecha de la cabecera (`#btn-escalas-generales`), fuera del flujo del menú
principal, porque se consulta con mucha frecuencia y de forma independiente
del resto. Es accesible desde cualquier pantalla (está fuera de los
contenedores de vista en `index.html`) y su "← VOLVER" regresa al menú
principal de Hematología (`.btn-volver-home`); si en el futuro se usa
también desde Nefrología u otra especialidad, revisa si conviene que
regrese en su lugar al menú de especialidades.

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
  y `nefrona.js`. Uno de los 7 nodos (`fisiopatologia`) no abre una vista
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
- **`nefro-menu.html`** (nivel 1, la nefrona) usa una **fotografía/ilustración anatómica real**
  (`js/modules/nefrologia/img/nefrona-anatomia.jpg`, corte de tejido renal
  con las dos nefronas — cortical de asa corta y yuxtamedular de asa larga
  — que llegó como referencia del usuario) en vez de un dibujo hecho a mano:
  un primer intento con SVG dibujado a mano quedó demasiado abstracto/poco
  realista, así que se sustituyó por la imagen real. La interactividad se
  consigue con **botones "hotspot" invisibles superpuestos por posición
  porcentual** (`<button class="nefrona-hotspot" data-segmento="..."
  style="left:X%; top:Y%;">`, mismo patrón de posicionamiento por `%` que
  `.region-btn` del Atlas) dentro de un contenedor
  `.nefrona-photo-wrap.article-figure` con `position:relative` — cada
  hotspot se coloca a ojo sobre la zona correspondiente de la foto
  (verificado visualmente con capturas de Playwright, ajustando el `%`
  hasta que el punto cae sobre la estructura real) y no dibuja nada él
  mismo, es solo una zona táctil con un aro de color encima
  (`.nefrona-hotspot-dot`). Al llevar la clase `article-figure`, la imagen
  hereda gratis el comportamiento de "toca para ampliar a pantalla
  completa" de `core/lightbox.js` en cualquier zona sin hotspot encima —
  útil porque la foto trae su propio texto pequeño en inglés que conviene
  poder ampliar. Las claves `data-segmento` (`glomerulo`, `tubulo-proximal`,
  `asa-descendente`, `asa-ascendente-delgada` — segmento de transporte
  pasivo presente casi solo en el asa larga yuxtamedular, `asa-ascendente-gruesa`
  — la del NKCC2, diana de los diuréticos de asa, `tubulo-distal`,
  `colector`) se repiten una vez por cada nefrona (cortical a la izquierda
  de la foto, yuxtamedular a la derecha) — `nefrona.js` ya resuelve esto sin
  cambios, porque resalta y usa TODOS los hotspots que coincidan con la
  clave tocada, no solo el primero. Debajo de la foto hay un panel de
  detalle (`#nefro-panel-segmento`) y un selector de "modo interactivo"
  (`#nefro-modo-select`) con diuréticos/patologías. Si se necesita más
  contenido anatómico interactivo en el futuro (otro corte, otra vista),
  repite este mismo patrón — foto real + hotspots por `%` — en vez de volver
  a dibujar SVG a mano.
- **`nefrona.js`** (`initNefrona({ onCategoria })`) es un componente
  **bespoke nuevo, no una generalización de `atlas.js`**: su interacción es
  distinta (pinta canales/transportadores Y tiene un modo por
  fármaco/patología que el Atlas no necesita). Al tocar un segmento, pinta
  sus canales (reutilizando el patrón `.micro-prof-item`/`.kv-row` ya
  existente) y renderiza un botón por cada categoría de contenido clínico
  de ese segmento; si el segmento aún no tiene categorías, muestra
  "🚧 en preparación" sin navegar a ningún sitio roto. Nunca conoce el
  contenido real — delega en `onCategoria(key)`, igual que `atlas.js`
  delega en `onRoute(key)`.
  - **Mini-diagrama de flujo de iones por canal**: cada canal de
    `segmentosNefrona` puede llevar un array `flujo` (`{ ion, direccion }`,
    `direccion` = `'reabsorcion'` o `'secrecion'`); `svgFlujo()` en
    `nefrona.js` genera a partir de ahí un SVG inline de 3 columnas (LUZ /
    CÉLULA / SANGRE) con una flecha por ion — verde hacia la sangre
    (reabsorción), roja hacia la luz (secreción) — que se inyecta dentro del
    `.micro-prof-body` de ese canal. No es una ilustración fija por canal:
    es un generador genérico a partir de datos, así que añadir flujo a un
    canal nuevo es solo añadir el array en `nefrona-data.js`, nunca tocar
    SVG a mano. La leyenda de colores vive una sola vez, como texto fijo
    encima de `#nefro-segmento-canales` en `nefro-menu.html` (no se repite
    por canal). Este patrón nació aquí pero es genérico — si otro módulo
    necesita "canal + iones que mueve", se puede reutilizar `svgFlujo()` tal
    cual.
  - **Enlace a la ficha completa desde el modo interactivo**: las entradas
    de `modosInteractivos` de tipo patología pueden llevar un `link: {
    panelId, tabId, etiqueta }`; si existe, `nefrona.js` pinta un botón bajo
    la explicación breve que llama a `openCorkboardTopic(panelId, tabId)`
    (la misma función que usa el Atlas para enlazar a Síndromes Urgentes) —
    así "SIADH"/"Diabetes insípida"/"Hipopotasemia"/"Hiperpotasemia" en el
    selector ya no se quedan en 2 líneas de texto, sino que llevan directo a
    la ficha completa de Hiponatremia/Hipernatremia/Hipopotasemia/
    Hiperpotasemia del cuaderno de campo de más abajo, en la misma página.
    Los diuréticos no llevan `link` (ya tienen su propio flujo vía
    `categorias`/`onCategoria` cuando aplica).
- **`js/data/nefrona-data.js`** son los datos puros: `segmentosNefrona`
  (canales por segmento — cada canal con `nombre`/`funcion`/`diana` y,
  opcionalmente, `flujo` — + qué categorías de contenido cuelgan de ese
  segmento — añadir/mover una categoría es solo tocar este objeto y el
  switcher de `nefrologia/index.js`, nunca el SVG) y `modosInteractivos`
  (qué segmento(s)/canal(es) resalta cada diurético o patología, con su
  explicación y, en las patologías, el `link` de arriba).
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
  `trr`), inicializa `rinon.js` y `nefrona.js`, e importa/llama los
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
    — nunca escribas `&lt;`/`&gt;` dentro de `js/data/*-preguntas.js`,
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

### Fisiopatología UCI

Cuarta especialidad del menú raíz (`#btn-fisio-uci`, junto a Hematología,
Nefrología y UCI/Papers Tuiter), pensada para repasos esquematizados de
capítulos de **"El Libro Azul: Bases Fisiopatológicas de la Medicina
Crítica"** (a diferencia de UCI/Papers Tuiter, que resume papers sueltos
compartidos en redes, esta especialidad resume capítulos completos de un
libro de texto de fisiopatología). Mismo patrón de dos niveles que
UCI/Papers Tuiter: un **submenú de bloques**
(`#fisio-uci-menu-view`/`js/modules/fisio-uci/fisio-uci-menu.html`, con
`.btn-volver-especialidades`) del que cuelga un botón por bloque temático
del libro, y la **vista propia de cada bloque** con su propio cuaderno de
campo. El switcher `fisioUciLevel` vive en `js/modules/fisio-uci/index.js`
(`createViewSwitcher({ menu, hematologia })`), no en
`modules/home/index.js` — mismo motivo que Nefrología/UCI Papers Tuiter
tienen su propio switcher interno: la vista raíz `#fisio-uci-view`
(registrada en el `topLevel` de `home/index.js`) es solo el contenedor
exterior. Al volver a "Fisiopatología UCI" desde Especialidades,
`fisioUci.init()` devuelve `{ volverAlMenu }`, inyectado perezosamente en
`home/index.js` (`onFisioUciListo`, mismo patrón que
`onNefrologiaListo`/`onUciPapersListo`) para dejar siempre el submenú de
bloques como pantalla de entrada — igual que el resto de especialidades.
Añadir un bloque nuevo en el futuro: 1) botón nuevo en
`fisio-uci-menu.html`, 2) su propio `<vista>.html` con
`.btn-volver-fuci-menu`, 3) registrarlo en `index.html` dentro de
`#fisio-uci-view` y en el switcher `fisioUciLevel` de `fisio-uci/index.js`.

- **Primer bloque: "Hematología y Hemostasia en Cuidados Críticos"**
  (`js/modules/fisio-uci/hematologia.html`). Fuente: El libro azul. Bases
  fisiopatológicas de la medicina crítica. Sección II, Hematología y
  Hemostasia, capítulos 12-16 (86 páginas) — PDF completo subido a
  `docs/libro-azul-seccion-ii-hematologia-hemostasia.pdf`, mismo criterio
  que el resto de fuentes del proyecto (preferible a un enlace externo que
  pueda dejar de estar vivo). El usuario pidió inicialmente un sistema
  paralelo con formato JSON (`GUIA_DATA`) y convenciones ("UMI Hemato") de
  otro proyecto suyo — se le preguntó explícitamente por esa discrepancia
  antes de escribir nada, confirmó que era un error y pidió seguir la
  arquitectura real de este repo; **si en el futuro se piden convenciones
  que no existen en este `CLAUDE.md`, preguntar primero, nunca asumir que
  vienen de otro proyecto sin confirmarlo**.
  - **Cuaderno de campo de 5 fichas** (`#fuci-hemato-corkboard`/
    `#panel-fuci-hemato-tabs`, mismo `core/corkboard.js` de siempre, sin
    calculadoras propias — `hematologia.js` solo llama a
    `initCorkboard(...)`), una por capítulo: Fisiopatología de la anemia
    (metabolismo del hierro, hepcidina como regulador central, anemia de
    la enfermedad crónica como respuesta adaptativa), Fisiopatología de
    la trombocitopenia (estructura/función plaquetaria, CID como causa
    más frecuente en el crítico, tabla de indicaciones de transfusión de
    plaquetas, PTI/TIH/PTT, trombocitosis reactiva), ¿Cuándo transfundir?
    (los 9 tipos de hipoxia, fórmulas de DO₂/VO₂, curva de disociación de
    la Hb, deuda de oxígeno, transfusión en sepsis/trauma/cardiovascular
    con los ensayos TRICC/Rivers/TRISS/TRICS-III/CRASH-2/MATTERs
    detallados), Monitorización de la hemostasia — TEG/ROTEM (modelo de
    coagulación celular, limitaciones de TP/TTPa, parámetros y patrones
    completos de ambas técnicas, aplicaciones en hemorragia
    obstétrica/politrauma/sangrado masivo), y Eosinofilia en el paciente
    crítico (definiciones OMS 2016, síndrome de DRESS con sus 3 sistemas
    de criterios diagnósticos, enfoque diagnóstico en 2 pasos, tratamiento
    incluido imatinib/mepolizumab). Contenido íntegro sin resumir por
    debajo del detalle de la fuente, siguiendo el mismo criterio ya
    establecido en Nefrología (fisiología/electrolitos) — cifras exactas,
    fórmulas, nombres de ensayos clínicos y tablas completas.
  - **4 figuras reales** extraídas con `pdfimages -png` (PDF con figuras
    como imagen única embebida por página, mismo caso que los papers de
    Springer de UCI/Papers Tuiter — comprobado con `pdfimages -list` antes
    de extraer): las 4 figuras del capítulo de anemia
    (`js/modules/fisio-uci/img/fig1-hepcidina.jpg`,
    `fig2-ciclohierro.jpg`, `fig3-regulacionhepcidina.jpg`,
    `fig4-rolhepcidina.jpg` — ilustraciones biológicas genuinas del
    mecanismo hepcidina-ferroportina, extraídas componiendo la imagen base
    con su `smask` de transparencia vía Pillow). El resto de figuras del
    libro (curva de disociación de la Hb, diagramas de aporte/consumo de
    O₂, los 7 patrones de TEG, los diagramas ROTEM, el flujograma
    diagnóstico de hipereosinofilia) son gráficos **vectoriales** nativos
    del PDF, no imágenes incrustadas (confirmado con `pdfimages -list`:
    sin entradas de imagen grande en esas páginas) — no se rasterizaron ni
    recortaron (el método de rasterizar+recortar queda reservado para
    figuras compuestas por InDesign con muchos fragmentos pequeños, no
    para vectores simples). En su lugar: los 7 patrones de TEG y los
    parámetros/patrones de ROTEM se recrearon íntegramente como
    `.data-table`/`.kv-row` con los valores numéricos reales citados en el
    capítulo (más fieles para el detalle clínico que una figura pequeña
    con letras diminutas); la curva de disociación de la Hb y los
    diagramas de aporte/consumo de O₂ y el flujograma de hipereosinofilia
    llevan un **placeholder de texto explícito** (recuadro punteado con
    descripción de qué figura debería ir ahí) para que el usuario los
    añada más adelante si quiere la imagen real — mismo criterio ya usado
    en el proyecto de no fabricar ni forzar una recreación SVG de un
    diagrama que no se pudo verificar pixel a pixel contra el original.
  - **40 preguntas de quiz** (`js/data/fisio-uci-hematologia-preguntas.js`,
    `fuci-q001`-`q040`, 8 por ficha × 5 fichas — 6 de opción múltiple + 2
    de tipo `redactar` por ficha, sin romper la regla dura de ≥1 pregunta
    por tema). Las preguntas de redactar incluyen tanto conceptos de
    desarrollo corto como **casos clínicos** (viñeta breve + pregunta de
    manejo/diagnóstico), reutilizando el mismo tipo `redactar` del motor
    de quiz ya existente (ver el apartado de UCI/Papers Tuiter más arriba)
    — no hizo falta ningún cambio en `quiz.js`/`quiz.html`. `triggerId:
    'btn-fuci-hemato-repasar'`, exportado junto a `quizBanco`/`quizTemas`
    desde `fisio-uci/index.js` y fusionado en la única llamada a
    `initQuiz()` de `main.js`, igual que el resto de especialidades. El
    banco combinado de toda la app queda en **878 preguntas** (838 previas
    + 40 de este bloque).
  - **Énfasis de términos clave**: se reutilizó el mismo sistema ya
    establecido (`<strong>`, coloreado automáticamente vía `--item-color`
    dentro de `.micro-prof-item`, y la clase `.hl` para frases/cifras
    clave dentro de un párrafo) en vez de introducir `<u>` u otra
    convención nueva — comprobado explícitamente contra `components.css`
    antes de escribir contenido, tal como pidió el usuario.
  - **Bibliografía**: 5 entradas, una por capítulo, cada una enlazando a
    `docs/libro-azul-seccion-ii-hematologia-hemostasia.pdf#page=N` (N
    calculado como página_impresa − 168, verificado contra el propio
    índice de páginas del PDF — el desplazamiento sale de que la portada y
    una página en blanco preceden a la página impresa 171, que es la
    página 3 del PDF).
- **Segundo bloque: "Vías Urinarias"** (`js/modules/fisio-uci/vias-urinarias.html`).
  Fuente: El libro azul. Bases fisiopatológicas de la medicina crítica.
  Sección VII, Vías Urinarias, capítulos 46-48 (42 páginas) — PDF completo
  subido a `docs/libro-azul-seccion-vii-vias-urinarias.pdf`, mismo criterio
  que el resto de fuentes del proyecto. Segundo botón del submenú de
  bloques (`#btn-fuci-vias-urinarias`), con `fisioUciLevel` (en
  `fisio-uci/index.js`) ganando una segunda entrada (`viasUrinarias`) junto
  a `hematologia` — mismo patrón exacto ya validado con el usuario para el
  primer bloque, sin cambios de arquitectura.
  - **Cuaderno de campo de 3 fichas** (`#vu-corkboard`/`#panel-vu-tabs`,
    mismo `core/corkboard.js` de siempre, sin calculadoras propias —
    `vias-urinarias.js` solo llama a `initCorkboard(...)`), una por
    capítulo — a diferencia del bloque de Hematología (5 fichas para 5
    capítulos cortos), aquí la fuente tiene solo 3 capítulos, así que la
    correspondencia 1:1 capítulo↔ficha se mantiene igual: **Fisiopatología
    renal** (Cap. 46 — clasificación prerrenal/renal/posrenal, balance
    energético e hipoxia como noxa principal de la LRA, distribución del
    flujo cortical 90%/medular 10%, ecuación de Starling aplicada al
    glomérulo, autorregulación 60-150 mmHg PAM vía 3 sistemas —miogénico,
    simpático extrínseco, hormonal—, la médula externa/asa gruesa
    ascendente de Henle como zona más vulnerable a la isquemia por su
    hipoxia relativa fisiológica, condiciones predisponentes, índices
    urinarios clásicos prerrenal vs. renal, y el enfoque terapéutico
    inicial con furosemida en infusión superior a bolos), **Fisiopatología
    de la LRA** (Cap. 47 — los 3 criterios diagnósticos de consenso,
    evolución RIFLE 2004→AKIN 2007, epidemiología con los estudios de
    Hoste/Uchino/el metaanálisis de Coca —con la cifra real de que un
    aumento de solo 10-20% de creatinina ya duplica la mortalidad—,
    limitaciones de la creatinina como marcador subrogado, la
    clasificación etiológica completa prerrenal/posrenal/intrínseca con
    sus causas y mecanismos, y el tratamiento por etiología incluida la
    evidencia real —y contraintuitiva— de que los diuréticos de asa en la
    LRA establecida se asocian a mayor mortalidad sin beneficio funcional
    pese a su racional fisiológico), y **Monitorización de la función
    renal en el paciente crítico** (Cap. 48 — la ficha más extensa de las
    3, con las 8 tablas reales del capítulo recreadas como `.data-table`
    nativas: condiciones que reducen el FG, factores condicionantes de
    creatinina/urea, biomarcadores nuevos con sus tiempos de detección,
    mediciones derivadas prerrenal vs. daño renal intrínseco, las
    principales ecuaciones de estimación de la TFG —con la advertencia
    explícita de KDIGO 2012 de que MDRD/CKD-EPI/Cockcroft-Gault no deben
    usarse en críticos—, factores de riesgo de LRA, y la clasificación
    KDIGO de estadios—, más los 4 escenarios especiales de LRA —contraste,
    cirrosis, rabdomiólisis, hipertensión abdominal— como acordeón
    `micro-prof-item`).
  - **7 figuras reales** extraídas de las páginas 21-45 del PDF —a
    diferencia del bloque de Hematología, donde solo el capítulo de anemia
    tenía imágenes incrustadas, aquí las figuras están concentradas en el
    Cap. 48 (Monitorización)—: `vu-fig1-creatinina.jpg` (producción y
    depuración de creatinina, imagen con `smask` de transparencia,
    compuesta con Pillow igual que las 4 figuras de hepcidina del primer
    bloque), `vu-fig6-hidronefrosis.jpg` (ecografía real de hidronefrosis,
    también con `smask`), y las **5 miniaturas de microscopía del
    sedimento urinario** de la Figura 5 original (`vu-fig5-celulas-tubulares.jpg`,
    `vu-fig5-cilindros-eritrocitarios.jpg`, `-leucocitarios.jpg`,
    `-hialinos.jpg`, `-granulosos.jpg`) — detectadas con `pdfimages -list`
    como 5 imágenes pequeñas independientes (266×152 aprox.) en la misma
    página, en vez de una única figura compuesta, así que se extrajeron y
    maquetaron como 5 `.article-figure` individuales en vez de una sola
    imagen de mosaico. El resto de figuras del libro (curvas/gráficos de
    depuración de creatinina, el flujograma de clasificación de la LRA,
    el flujograma de evolución de biomarcadores) son gráficos
    **vectoriales** nativos del PDF —confirmado con `pdfimages -list`,
    sin imágenes grandes en esas páginas— y se recrearon como
    `.data-table`/prosa con los valores reales, sin placeholder de
    imagen porque el contenido numérico ya queda cubierto por las tablas
    nativas (a diferencia del bloque de Hematología, donde 3 figuras sí
    se dejaron como placeholder explícito por no tener un equivalente
    tabular razonable).
  - **24 preguntas de quiz** (`js/data/fisio-uci-vias-urinarias-preguntas.js`,
    `vu-q001`-`q024`, 8 por ficha × 3 fichas — 6 de opción múltiple + 2 de
    tipo `redactar` por ficha, mismo formato exacto que el primer bloque,
    con casos clínicos en varias de las preguntas de redactar). `triggerId:
    'btn-fuci-vu-repasar'`, añadido al array que ya exporta
    `fisio-uci/index.js` junto a `btn-fuci-hemato-repasar` — sin tocar
    `main.js` (que ya fusiona `fisioUci.quizTriggerId/quizBanco/quizTemas`
    genéricamente). El banco combinado de toda la app queda en **902
    preguntas** (878 previas + 24 de este bloque).
  - **Bibliografía**: 3 entradas, una por capítulo, enlazando a
    `docs/libro-azul-seccion-vii-vias-urinarias.pdf#page=N` (N = página
    impresa − 814, verificado contra 4 puntos de anclaje distintos del
    propio PDF — portada + una página en blanco preceden a la página
    impresa 817, que es la página 3 del PDF; mismo patrón de offset que el
    primer bloque, pero con un desplazamiento propio de este PDF).
  - **Enlace cruzado**: la Ficha 1 (Fisiopatología renal) menciona
    explícitamente, en el punto donde el capítulo remite al manejo con
    TRR, que el desarrollo completo de indicaciones/momento de
    inicio/modalidad de la TRR vive en el módulo TRR de Nefrología (dentro
    del mapa del riñón) — sin duplicar ese contenido aquí, mismo criterio
    de no repetir texto ya construido en otro módulo con fuente propia
    distinta (ver el precedente ya establecido entre TRR y FRA en
    Nefrología).
- **Tercer bloque: "Cardiología"** (`js/modules/fisio-uci/cardiologia.html`).
  Fuente: El libro azul. Bases fisiopatológicas de la medicina crítica.
  Sección I, Aparato Cardiovascular, capítulos 1-11 (165 páginas) — el
  bloque más extenso de Fisiopatología UCI hasta ahora, más del doble de
  cualquier bloque anterior. PDF subido en **2 archivos** por el propio
  tamaño de la sección (`docs/libro-azul-seccion-i-cardiovascular-parte1.pdf`,
  100 págs., capítulos 1-6; `docs/libro-azul-seccion-i-cardiovascular-parte2.pdf`,
  70 págs., capítulos 7-11) — a diferencia de Hematología/Vías Urinarias,
  aquí no hay offset de página único: Parte 1 no tiene desplazamiento
  (página impresa = página del PDF, portada=1, contenido desde página 3) y
  Parte 2 sí (offset −100, porque continúa la numeración de libro desde la
  página 101 pero es un PDF nuevo que empieza en su propia página 1) —
  verificado leyendo ambos PDF completos página por página antes de
  extraer nada, sin asumir que la numeración fuera continua entre archivos.
  Tercer botón del submenú de bloques (`#btn-fuci-cardiologia`), con
  `fisioUciLevel` (en `fisio-uci/index.js`) ganando una tercera entrada
  (`cardiologia`) junto a `hematologia`/`viasUrinarias` — mismo patrón
  exacto, sin cambios de arquitectura.
  - **Cuaderno de campo de 11 fichas** (`#cardio-corkboard`/
    `#panel-cardio-tabs`, mismo `core/corkboard.js` de siempre, sin
    calculadoras propias — `cardiologia.js` solo llama a
    `initCorkboard(...)`), una por capítulo, todos con correspondencia
    1:1 fuente↔ficha igual que en los bloques anteriores: Fisiología
    cardíaca aplicada (sistema de conducción, ciclo de Wiggers, tonos
    cardíacos, onda de PVY, Frank-Starling, ley de Laplace, MVO₂),
    Fisiopatología cardiovascular — de lo fundamental a lo importante
    (marco conceptual: el sistema CV como transportador de oxígeno, los
    4 componentes interdependientes — bomba, volumen, continente
    vascular, microcirculación —, capítulo breve y puramente conceptual
    sin figuras propias), Disfunción cardíaca sistólica y diastólica
    (curva presión-volumen, Ees/FRSPV, FRPVD, manejo del calcio,
    interdependencia sistólica-diastólica), ¿Cómo funciona la
    microcirculación? (circulación mayor/menor, red microcirculatoria,
    fuerzas de Starling capilares, glucocálix endotelial, disociación
    macro-microcirculatoria), Monitorización hemodinámica sistémica
    clásica — la ficha más extensa, con 9 de las 21 figuras del bloque
    (colocación del catéter de arteria pulmonar, presiones normales de
    cavidades, onda de PVC a-c-x-v-y, índices DO₂/VO₂/GC/IC/OEI con sus
    fórmulas, PPV, 17 segmentos del VI, TAPSE, patrones de disfunción
    diastólica, gradientes de pared del VI), Fisiopatología de la
    enfermedad coronaria (estabilidad de placa vs. tamaño, cascada
    isquémica, lesión por reperfusión — capítulo corto, 4 páginas, sin
    figuras propias), Hipertensión pulmonar en el paciente crítico
    (definiciones hemodinámicas PAPm/PEP/GTPd, predictores de mortalidad
    PVRI/REI, vasodilatadores pulmonares específicos, acrónimo CRASH),
    Fisiopatología de la embolia pulmonar (tríada de Virchow, mediadores
    vasoactivos TXA2/serotonina/endotelina-1, cascada VD→isquemia→colapso,
    alteración V/Q), Fisiopatología del ventrículo derecho (retorno
    venoso, disfunción del VD por TEP/taponamiento/choque
    cardiogénico/sepsis/SDRA-EPOC, VD y VM), Fisiopatología de los
    estados de choque (epidemiología por tipo, tabla de 4 patrones
    hemodinámicos GC/RVS/PVC/PCP/VSTI/ScVO₂/láctico, mediadores del
    choque séptico, mecanismos de respuesta compensadora), y
    Fisiopatología de la interacción corazón-pulmón (Ppl/GC/retorno
    venoso, interdependencia ventricular, efectos de la VM sobre la
    vasculatura pulmonar, ecocardiografía en la interacción
    cardiopulmonar — VCI, evaluación del VD, índice E/Em, ITV).
  - **21 figuras reales**, el bloque con más imágenes de todo el proyecto
    — a diferencia de los bloques anteriores, donde `pdfimages -list`
    encontraba pocas imágenes grandes y el resto eran gráficos
    vectoriales, en este PDF **todas** las figuras clínicamente
    relevantes (curvas de presión, diagramas de circulación,
    ecocardiografías reales, cortes histológicos) están embebidas como
    imagen rasterizada — se extrajeron con `pdfimages -png` + composición
    Pillow con `smask` (mismo método ya establecido), tras filtrar con
    `pdfimages -list | awk` las imágenes genuinamente grandes (>300×300)
    frente a los logos de marca de agua repetidos (189×107, presentes en
    casi todas las páginas). Cada una de las ~21 candidatas encontradas
    se revisó visualmente antes de decidir incluirla — todas resultaron
    ser contenido real y valioso (ninguna se descartó), a diferencia de
    bloques anteriores donde algunas imágenes eran solo logos: sistema de
    conducción cardíaco, ciclo de Wiggers, curva presión-volumen del VI,
    corte histológico de hipertrofia ventricular concéntrica, esquema de
    circulación mayor/menor, red microcirculatoria, fuerzas de Starling
    capilares, colocación del catéter de arteria pulmonar, onda de PVC
    a-c-x-v-y, presiones normales de las cavidades, catéter de arteria
    pulmonar con curvas, gradientes de pared del VI con sarcómeros,
    variación de la presión de pulso, los 17 segmentos del VI, TAPSE real
    (ecografía M-mode), los 4 patrones de disfunción diastólica, patrones
    del choque circulatorio, curva GC-presión AD por presión intrapleural,
    curvas hemodinámicas simultáneas durante VM, esquema corazón-pulmón-
    pleura, y la ecografía subcostal real de la VCI (paneles A/B).
    Ninguna tabla se extrajo como imagen — todas (definiciones de HP,
    índices DO₂/VO₂, presiones normales, patrones de choque, mediadores
    del choque séptico) se recrearon como `.data-table` nativas, mismo
    criterio que el resto del proyecto.
  - **88 preguntas de quiz** (`js/data/fisio-uci-cardiologia-preguntas.js`,
    `cardio-q001`-`q088`, 8 por ficha × 11 fichas — 6 de opción múltiple +
    2 de tipo `redactar` por ficha, mismo formato exacto que los bloques
    anteriores, con varias preguntas de redactar planteadas como casos
    clínicos que integran mecanismos de más de una ficha — p. ej.
    distinguir hipovolemia real de interdependencia ventricular por
    disfunción del VD usando la VVP). `triggerId: 'btn-fuci-cardio-repasar'`,
    añadido al array que ya exporta `fisio-uci/index.js` — sin tocar
    `main.js`. El banco combinado de toda la app queda en **990
    preguntas** (902 previas + 88 de este bloque).
  - **Bibliografía**: 11 entradas, una por capítulo, enlazando a
    `docs/libro-azul-seccion-i-cardiovascular-parte1.pdf#page=N` (capítulos
    1-6, N = página impresa, sin offset) o
    `docs/libro-azul-seccion-i-cardiovascular-parte2.pdf#page=N` (capítulos
    7-11, N = página impresa − 100) según corresponda.
  - **Revisión sistemática de profundidad (a petición explícita del usuario,
    con feedback crítico directo)**: tras el build inicial de las 11 fichas,
    el usuario señaló que el contenido era "muy carente" — con el ejemplo
    concreto de que faltaba por completo la fórmula del **índice de aporte
    de oxígeno (IDO₂)**, pese a estar en la fuente, y una queja general de
    que el resto del bloque leía como "un breve resumen de partes que no son
    muy importantes", sin apenas fórmulas, con pocas tablas/imágenes y sin
    estructura esquematizada. El usuario pidió explícitamente un flujo de
    **2 agentes que hablaran entre sí** (uno solo-bibliografía, otro
    solo-app) para planificar la ampliación — el agente de bibliografía
    agotó el límite de gasto de la cuenta antes de completar su análisis (el
    de app sí terminó, en
    `/tmp/.../scratchpad/cardio-audit-app.md`), así que en vez de reintentar
    con otro agente (y arriesgar el mismo fallo), se optó por releer
    directamente los 2 PDF fuente página por página con el propio `Read`
    tool — más verificable que un resumen de agente, aunque perdiendo la
    conversación cruzada entre los dos agentes que pedía el usuario. El
    informe de auditoría de app sí se usó íntegro: confirmó con métricas
    exactas la queja del usuario (0,55 `.data-table`/ficha y 1,45
    `.kv-row`/ficha en Cardiología, frente a 2,5 y 11,1 respectivamente en
    `erc.html`, tomado como referencia de calidad ya establecida en el
    proyecto) y señaló, ficha por ficha, qué contenido "olía a resumen" y
    cómo reestructurarlo (convertir `term-chips` de comparaciones
    multi-atributo en `.data-table`, añadir `.kv-row` internos dentro de
    `.micro-prof-item` en vez de dejarlos como párrafo único, etc.).
    Reescritas las 11 fichas con contenido sustancialmente más profundo,
    verificado frase a frase contra una relectura íntegra de los 2 PDF
    (170 páginas): fórmulas antes ausentes (IDO₂=IC×CaO₂ del Capítulo 2, y
    su variante IDO₂=IC×CaO₂×10 con rango normal 520-650 mL/min/m² de la
    Tabla 12 del Capítulo 5 — ambas cruzadas explícitamente entre sí en las
    Fichas 1/2/5; ley de Laplace T=P×r/2t; ley de Hagen-Poiseuille;
    ecuación de Fick; doble/triple producto y presión de perfusión
    coronaria; fórmulas de RVS/RVP), tablas nuevas (ciclo de Wiggers en 7
    fases con válvulas/ruidos por fase; clasificación AHA de la placa
    coronaria I-Va; escala de riesgo de *cor pulmonale* agudo de Mekontso;
    vasodilatadores pulmonares específicos con mecanismo/efecto/
    recomendación; macrohemodinamia y factores bioquímicos vitales —
    CaO₂/CvO₂/DO₂/VO₂/GC/IC/OEI — del Capítulo 10; tabla comparativa
    angina→IAMCEST con trombo/biomarcadores/síntoma), y conceptos
    mecanísticos completos que antes faltaban (NETosis/PAD4 y los 2
    mecanismos de inicio de la trombosis en la enfermedad coronaria;
    activación neurohormonal completa en la disfunción cardíaca — SNS,
    SRAA, AVP, péptidos natriuréticos, citocinas —; modelo de Krogh y
    coherencia hemodinámica en la microcirculación; cascada completa
    VD→interdependencia ventricular→isquemia subendocárdica en la embolia
    pulmonar). La tabla de mediadores del choque séptico (Ficha 10), que
    usaba `colspan="2"` como lista disfrazada de tabla, se corrigió a una
    tabla real de 2 columnas (categoría/mediadores). Se corrigió también
    una **discrepancia real entre fichas** detectada durante la relectura:
    el TAPSE normal aparece como &gt;16 mm en el Capítulo 5 (Ficha 5) y
    &gt;17 mm en el Capítulo 11 (Ficha 11) — ambas cifras son fieles a su
    propio capítulo/autor de origen dentro del mismo libro, así que se
    mantuvieron las dos con una nota cruzada explícita en la Ficha 11, en
    vez de forzar una única cifra por criterio propio (mismo criterio de
    fidelidad a la fuente ya establecido en el resto del proyecto — ver el
    precedente del IFR en Fracaso Renal Agudo). Se añadieron **18
    preguntas de quiz nuevas** (`cardio-q089`-`q106`,
    `js/data/fisio-uci-cardiologia-preguntas.js`) centradas específicamente
    en las fórmulas y datos que motivaron la revisión (IDO₂, clasificación
    AHA, NETosis, macrohemodinamia, PAPm/HP límitrofe, escala de Mekontso,
    receptores ET-A/ET-B), llevando el banco de Cardiología a 106 preguntas
    y el banco combinado de toda la app a **1008 preguntas** (990 previas +
    18). Verificado con Playwright tras la reescritura: las 11 fichas del
    cuaderno de campo abren y voltean sin error de consola, ninguna imagen
    da 404, y el quiz completa un recorrido de 12 preguntas del tema
    "enfermedad coronaria" (incluida una pregunta tipo `redactar`) sin
    excepciones JS.
  - **Segunda ronda de revisión, centrada en Fichas 1 y 2 (a petición
    explícita del usuario, tras seguir señalando la primera revisión como
    insuficiente)**: el usuario pidió, esta vez, ir "por partes" — empezando
    por una relectura exhaustiva de los Capítulos 1 y 2 (ya releídos una vez
    en la primera ronda, pero con margen real de profundidad no explotado) y
    pidiendo explícitamente que las fórmulas fuesen **interactivas**, no solo
    texto/tablas. Releídas de nuevo, página por página, las 25 páginas de
    ambos capítulos (Parte 1, págs. 1-28), se encontraron 2 tipos de huecos:
    1. **Contenido real del capítulo aún no trasladado**: en la Ficha 1 — la
       Figura 1 original del capítulo (esquema de interdependencia
       ventricular, corazón normal vs. *cor pulmonale*, con el mecanismo
       completo de por qué el PEEP puede colapsar el VI al compartir
       pericardio con un VD sobrecargado), las propiedades de
       **automatismo y ritmicidad** como conceptos distintos, la
       diferenciación embriológica de los miocitos (unos forman fibras
       contráctiles, otros conservan automatismo y forman el sistema de
       conducción), las **uniones comunicantes en hendidura** (*gap
       junctions*) como mecanismo de propagación célula a célula, la
       localización anatómica precisa del nodo AV, y el **período
       refractario efectivo** (fases 0-2 y parte de la 3) como mecanismo de
       protección — ninguno de estos conceptos, todos presentes en el
       capítulo, estaba en la ficha. En la Ficha 2, un hallazgo más serio:
       la sección "Interdependencia de los componentes del sistema" (con un
       marco conceptual de "4 componentes" — bomba/volumen/continente
       vascular/microcirculación) **no existe en el Capítulo 2 releído** —
       es contenido que se había escrito en una sesión anterior sin
       verificación directa contra la fuente, y no aparece en ningún punto
       del texto real (que en su lugar describe la circulación pulmonar de
       baja resistencia/alta capacitancia frente a la sistémica de alta
       resistencia, con una única bomba bajo control neurohormonal). Se
       **eliminó por completo** esa sección fabricada y se sustituyó por la
       distinción real pulmonar/sistémica del propio capítulo, siguiendo el
       mismo criterio ya establecido en el proyecto de nunca dejar contenido
       clínico sin respaldo directo verificado — el propio proceso de
       relectura exhaustiva de esta segunda ronda es lo que permitió
       detectar este caso concreto, que la primera ronda (más centrada en
       añadir contenido nuevo que en auditar frase a frase el ya existente)
       no había capturado. También se añadió la cifra real de la fuente de
       que una PAS &lt;90 mmHg mantenida &gt;30 min reduce la supervivencia
       hasta un 48% en individuos previamente sanos (ausente hasta ahora).
    2. **Inconsistencia interna real de la propia fuente, documentada con
       nota en vez de "corregida" silenciosamente** (mismo criterio que el
       IFR de Fracaso Renal Agudo o el TAPSE &gt;16/&gt;17mm de Cardiología):
       el Capítulo 1 describe el cierre de las válvulas mitral/tricúspide
       (fase de contracción isovolumétrica) como el "segundo ruido cardíaco
       (S2)" — un error real del propio texto, contradicho por su propia
       descripción, unas páginas después, del cierre de las válvulas
       aórtica/pulmonar como S2. La ficha reproduce la nomenclatura
       fisiológica estándar (S1 para el cierre AV) con una nota explícita
       señalando la contradicción interna de la fuente.
    - **4 calculadoras interactivas nuevas** (`cardiologia.js`, mismo patrón
      `calcXxx()`/`.tfg-estado-ok/warn/danger` ya usado en Nefrología —
      primeras calculadoras de todo el bloque de Cardiología, que hasta
      ahora no tenía ninguna, a diferencia del resto de la app):
      **Ficha 1** — "Transporte de oxígeno (principio de Fick)"
      (`calcFickTransporte()`: Hb/SaO₂/PaO₂/FC/VS/SC obligatorios,
      SvO₂/PvO₂ opcionales → CaO₂, GC, IC, DO₂, DO₂I y, si hay datos
      venosos, CvO₂/VO₂/EO₂ en vivo) y "Resistencias vasculares (ley de
      Hagen-Poiseuille)" (`calcResistenciasVasculares()`: GC/PAM/PAD → RVS
      en unidades de Wood y su equivalente en dyn·s·cm⁻⁵; PAMP/PAI
      opcionales → RVP). **Ficha 2** — "Costo de funcionamiento
      miocárdico" (`calcCostoFuncionamiento()`: FC/PAS/presión en
      cuña/PAD sistémica + selector de ventrículo izquierdo/derecho, que
      alterna dinámicamente si el cálculo de presión de perfusión coronaria
      usa la cuña o la PVC → doble producto, triple producto, PPC, índice
      de aporte-consumo) y "Índice de aporte de oxígeno (IDO₂)"
      (`calcIDO2Ficha2()`: GC/SC/Hb/SaO₂/PaO₂ → IC, CaO₂, IDO₂ = IC×CaO₂×10,
      cruzado contra el rango normal 520-650 mL/min/m² ya citado en la
      Ficha 5). Todas actualizan el resultado en vivo con cada `input`,
      siguiendo exactamente el guard `.value === ''` (nunca `Number('')`)
      ya establecido como lección aprendida en las auditorías de FRA/ERC
      para no tratar un campo vacío como 0.
    - Añadidas **7 preguntas de quiz nuevas** (`cardio-q107`-`q113`,
      incluidos 2 casos clínicos tipo `redactar` que usan directamente las
      calculadoras nuevas — uno sobre el efecto de la anemia en el DO₂,
      otro sobre interpretar un doble/triple producto elevado), llevando el
      banco de Cardiología a 113 preguntas y el banco combinado de toda la
      app a **1015 preguntas** (1008 previas + 7). Verificado con
      Playwright: las 4 calculadoras responden en vivo a cambios de input
      (confirmado recalculando tras modificar Hb, GC y el selector de
      ventrículo), las 11 fichas siguen abriendo sin error de consola ni
      404, y el quiz completa un recorrido de 10 preguntas sin excepciones.
      **Pendiente**: el usuario planteó esta revisión "por partes" — quedan
      las Fichas 3-11 por la misma relectura exhaustiva de segunda ronda
      (esta vez ya se hizo en las Fichas 1-2 solamente, a petición
      explícita), a confirmar con el usuario si se continúa automáticamente
      o ficha por ficha según vaya pidiendo.
  - **Tercera ronda: Fichas 3 y 4** (a petición explícita del usuario de
    "continuar con las 2 siguientes fichas"), releídos íntegros los
    Capítulos 3 (págs. 29-43) y 4 (págs. 45-57) de la fuente. A diferencia
    de las Fichas 1-2, estas dos ya estaban en un nivel de detalle alto
    desde la primera ronda — la relectura encontró huecos más puntuales,
    no una reescritura completa:
    - **Ficha 3**: nueva **Figura 1 del capítulo** recreada como SVG
      (patogénesis de la falla cardíaca — FE vs. tiempo, evento índice →
      mecanismos compensatorios → daño secundario, asintomático→sintomático
      — ausente hasta ahora, aunque ya se citaba en prosa); los puntos
      **A/B/C** de la Figura 3 (curvas de Starling/retorno venoso)
      explicitados en el texto en vez de quedar implícitos; el dato de que
      el retorno venoso y el GC llegan a cero cuando la presión auricular
      iguala la MCFP; ampliado el mecanismo de elevación del calcio
      citosólico en falla cardíaca con el detalle real de los **2
      mecanismos combinados** (menor actividad de SERCA2a + depleción de
      los depósitos del retículo sarcoplásmico por eflujo a través del
      **receptor rianodina** "permeable") y los términos **túbulos
      transversos**/canales tipo L, ausentes en la versión anterior (más
      genérica). Añadida una **calculadora interactiva de tensión de pared
      (ley de Laplace, T=(P×R)/2t)** — primera calculadora de la ficha.
    - **Ficha 4**: nueva sección de **4 mecanismos de intercambio
      capilar** (uniones entre células endoteliales, fenestraciones con
      membrana/diafragma, transporte activo por vesículas, difusión por la
      membrana celular) — completamente ausente hasta ahora, pese a ser
      contenido explícito del capítulo; nuevo kv-row sobre el **endotelio
      como órgano de control** con la distinción real fuente/vasodilatador
      (óxido nítrico, prostaciclina) vs. vasoconstrictor (angiotensina II,
      endotelina-1) — antes solo cubierta indirectamente por el
      glucocálix. No se añadió calculadora nueva en esta ficha porque sus
      fórmulas (DO₂, ATP de la respiración celular) ya tienen calculadora
      interactiva equivalente en las Fichas 1, 2 y 5 (DO₂/Fick) — evitar
      duplicar la misma interactividad 3 veces.
    - Añadidas **5 preguntas de quiz nuevas** (`cardio-q114`-`q118`,
      incluido un caso tipo `redactar` sobre por qué la hipertrofia
      concéntrica es, matemáticamente, una respuesta "lógica" a la
      sobrecarga de presión según la ley de Laplace), llevando el banco de
      Cardiología a 118 preguntas y el banco combinado de toda la app a
      **1020 preguntas** (1015 previas + 5). Verificado con Playwright: la
      calculadora de Laplace responde en vivo (150,0 → 240,0 al cambiar el
      radio de 2,5 a 4 cm), las 11 fichas siguen abriendo sin error de
      consola ni 404, y el quiz completa un recorrido de 10 preguntas del
      tema "¿Cómo funciona la microcirculación?" sin excepciones.
      **Pendiente**: quedan las Fichas 5-11 por esta misma relectura
      exhaustiva de tercera ronda (las Fichas 5-6 ya tuvieron una revisión
      profunda en la primera ronda general, pero no la relectura
      frase-a-frase de segunda/tercera ronda que sí tuvieron las Fichas
      1-4) — a confirmar con el usuario cómo continuar.
  - **Gráficas interactivas — simulador de Frank-Starling y ciclo cardíaco
    dinámico** (a petición explícita del usuario: "pon gráficas
    interactivas... sobre todo con la ley de Frank Starling e intenta poner
    el ciclo cardíaco de manera dinámica"), ambas en la Ficha 1:
    - **Simulador de la curva de Frank-Starling** (`calcFrankStarlingSimulador()`
      en `cardiologia.js`, mismo patrón slider→JS que `.tfg-simulador` de
      Nefrología): 3 curvas SVG (aumentada/normal/disminuida) dibujadas con
      la fórmula `f(x) = A·(x/xp)·e^(1−x/xp)` — una curva de "pico con
      reducción posterior" elegida deliberadamente porque el propio
      capítulo describe la relación precarga-contractilidad como una
      "meseta con posterior reducción de la fuerza" ante presión/volumen
      excesivos, no una simple saturación monótona. Un slider de precarga
      (0-100%) y un selector de estado contráctil mueven un marcador sobre
      la curva activa (resaltada con `.cardio-fs-curva-activa`, las otras
      dos atenuadas) y actualizan un texto de "volumen sistólico relativo"
      en <strong>porcentaje</strong>, no en mL — deliberado, para no
      fabricar una cifra clínica de mL que la fuente no da (misma
      disciplina de honestidad que ya lleva el propio `.tfg-simulador`
      del simulador de TFG en Nefrología, con su aviso de "modelo
      simplificado, no una calculadora clínica real").
    - **Animación dinámica del ciclo cardíaco** (Wiggers), añadida junto a
      la imagen estática ya existente (no la sustituye — sigue siendo la
      referencia fiel al diagrama real del capítulo): implementada
      **100% en CSS**, sin `requestAnimationFrame`, deliberadamente por
      coste en móvil — un `<rect>` cursor animado vía `@keyframes` sobre
      la propiedad `x` (CSS-animable en SVG2, a diferencia de `x1`/`x2` de
      `<line>`, que no lo son — por eso se usa `<rect>` y no `<line>` para
      el cursor), 7 `<text>` de fase (A-G) con `@keyframes` de `opacity`
      cuya ventana on/off codifica directamente los límites temporales de
      cada fase (sin JS de temporización), y 4 círculos de pulso para los
      tonos cardíacos (S1 en el límite A→B, S2 en el límite D→E, S3/S4
      atenuados como en el resto de la app). Las curvas de presión
      aórtica/ventricular, la onda de PVY (a-c-x-v-y) y un trazado
      esquemático de ECG son paths SVG estáticos dibujados a mano (mismo
      método que la Figura 1 de interdependencia ventricular y la Figura 1
      de patogénesis de la Ficha 3), con las proporciones temporales de
      las 7 fases estimadas sobre el ciclo de 800 ms que sí da la Figura 4
      original (la fuente no desglosa la duración exacta de cada fase
      individual, así que se usan proporciones fisiológicas estándar,
      declarado explícitamente en el texto de la ficha). Un botón
      pausa/reanuda alterna la clase `.paused` (que fija
      `animation-play-state: paused` en cursor/etiquetas/pulsos) y un
      selector de velocidad cambia la custom property `--ciclo-duracion`
      (6s/4s/2s/0,8s — el último, tiempo real a FC 75 lpm) — ambos
      controles son JS mínimo (`initCicloCardiacoAnimado()`), la animación
      en sí no requiere ningún bucle de JS.
    - CSS nuevo en `components.css` (bloque "GRÁFICAS INTERACTIVAS DE
      CARDIOLOGÍA"), 100% aditivo — no se tocó ninguna regla existente
      (confirmado con `git diff --stat`, 0 líneas eliminadas). Se
      actualizó la fecha de `?v=` de `index.html` a `20260820` (regla ya
      establecida del proyecto: cualquier cambio a un `.css` exige
      refrescar el cache-busting).
    - Añadidas **4 preguntas de quiz nuevas** (`cardio-q119`-`q122`,
      incluida una de tipo `redactar` sobre la incisura dicrótica y el
      balón de contrapulsación), llevando el banco de Cardiología a 122
      preguntas y el banco combinado de toda la app a **1024 preguntas**
      (1020 previas + 4). Verificado con Playwright: el marcador de Frank-Starling se mueve
      en vivo al cambiar precarga/estado contráctil (cx 170→274 al subir
      precarga a 90%, curva activa cambia correctamente a "aumentada"), el
      cursor del ciclo cardíaco avanza con el tiempo (x 115,8→183→252,3 en
      2 lecturas de 500ms) y se congela exactamente al pausar (misma x en
      2 lecturas separadas), solo una etiqueta de fase visible a la vez
      (opacity 1 en la fase activa, 0 en las demás 6), y las 11 fichas
      siguen sin error de consola ni 404.
  - **Auditoría propia de las 4 primeras fichas e informe al usuario**: a
    petición explícita ("evalúa la posibilidad de añadir o mejorar algo en
    relación con las partes interactivas"), se revisó con `grep` el estado
    real (no de memoria) de calculadoras/sliders/SVG en las Fichas 1-4 y se
    entregó un informe priorizado: Ficha 3 sin visual para el asa
    presión-volumen (mayor oportunidad), Ficha 4 sin ningún elemento
    interactivo (única de las 4), y Fichas 1-2 con calculadoras que
    devuelven solo texto sin gauge visual. El usuario pidió empezar por la
    Ficha 1. Añadido un **gauge visual para el DO₂I** de la calculadora de
    Fick (`actualizarGaugeDO2I()` en `cardiologia.js`, reutilizando el
    patrón `.kinetic-row`/`.kinetic-fill`/`.kinetic-marker` ya existente en
    las calculadoras ISTH de Síndromes Urgentes — sin CSS nuevo): escala
    0-800 mL/min/m² con 2 marcadores en 530 y 600 (banda normal), relleno
    coloreado según el mismo `estado` (ok/warn/danger) que ya calculaba la
    función. También se aclaró en el propio diagrama animado que S3 y S4
    son "si patológico" (ya lo decía la Ficha F para S3; se añadió el
    mismo matiz a la etiqueta de la fase A para S4, y se renombró la
    etiqueta estática "S1-S4" a "Tonos" para no dar a entender que los 4
    tonos suenan siempre). Verificado con Playwright: el gauge cambia de
    68% (verde, DO₂I 544) a 34,5% (rojo, DO₂I 276) al bajar la Hb a 7 g/dl,
    y vuelve a verde al restaurarla — las 11 fichas siguen sin error de
    consola ni 404. **Pendiente** (según el propio informe, no
    implementado aún): asa presión-volumen interactiva en Ficha 3,
    simulador de fuerzas de Starling capilares en Ficha 4, y el mismo
    gauge visual en las 2 calculadoras de la Ficha 2.
  - **Reformulación de las 3 calculadoras de la Ficha 1: interpretación
    fisiopatológica dinámica, no solo un número y una barra "inerte"**
    (feedback explícito del usuario: quería que las calculadoras
    explicaran "qué significa que salgan en valores extremos, qué implica
    que se mantenga en rango, qué mecanismos hay para mantenerse en rango
    y cómo se puede descompensar"). Las 3 calculadoras (Frank-Starling,
    Fick, resistencias vasculares) ganaron una función de interpretación
    por zonas (`textoZonaFrankStarling`/`textoEstadoFrankStarling`,
    `textoZonaDO2I`, `zonaRVS` en `cardiologia.js`) que, según en qué
    tramo cae el valor calculado, inyecta un párrafo distinto (no una
    plantilla fija con el número insertado) cubriendo los 3 ejes pedidos:
    qué significa esa cifra, qué mecanismo compensador la sostiene ahí, y
    qué pasa si ese mecanismo se agota. Contenido anclado a conceptos ya
    desarrollados en otras fichas para no fabricar nada nuevo sin
    respaldo: el DO₂ crítico y la extracción máxima 60-70% (Ficha 5), el
    círculo vicioso de congestión por retención de líquidos (Ficha 3), el
    coste miocárdico de los inotrópicos (Ficha 2), la vasoplejía séptica
    por sobreproducción de NO (ya citada en Ficha 10) y el shunt
    arteriovenoso en el shock distributivo (Ficha 4). Cada calculadora
    ganó un `<div>` de interpretación nuevo (`#cardio-fs-interpretacion`,
    `#cardio-fick-interpretacion`, `#cardio-rv-interpretacion`, mismo
    patrón visual `.tfg-estado` ya existente) situado justo debajo del
    resultado numérico:
    - **Frank-Starling**: el texto combina la zona de la curva en la que
      cae la precarga (ascendente pronunciada/precarga-dependiente, meseta
      de eficiencia, o sobredistensión con reducción de fuerza — esta
      última explicando explícitamente el mecanismo de sobreestiramiento
      del sarcómero) con el estado contráctil seleccionado (normal,
      disminuida — con el ciclo de retención de líquidos que termina en
      congestión —, o aumentada — con el coste en consumo miocárdico de
      oxígeno de sostener inotrópicos).
    - **Fick (DO₂I)**: 6 tramos (crítico &lt;350, bajo 350-449, límite
      bajo 450-529, normal 530-600, alto 601-750, muy alto &gt;750), cada
      uno con su propia lectura clínica — incluida la advertencia
      explícita de que un DO₂ muy alto no garantiza buena oxigenación
      tisular (shock distributivo con shunt). Si se dan datos venosos y la
      EO₂ calculada es ≥50%, se añade una frase extra señalando que la
      reserva de extracción ya está casi agotada.
    - **Resistencias vasculares**: 5 tramos de RVS (muy baja/vasopléjica,
      baja, normal, alta/compensadora, muy alta/extrema), con el color del
      recuadro (`tfg-estado-ok/warn/danger`) ahora también dinámico según
      la zona — antes siempre verde, sin importar el valor.
    Verificado con Playwright cruzando varios inputs por calculadora
    (precarga 10% vs. 95%; Hb 5 g/dl vs. Hb 20 g/dl + FC 150; PAM/GC que
    simulan vasoplejía vs. vasoconstricción extrema): cada caso muestra un
    párrafo de interpretación distinto y el color de la caja cambia en
    consecuencia: las 11 fichas y el quiz siguen sin error de consola.
  - **Cierre de los 3 pendientes del informe de auditoría anterior**
    (gauges de Ficha 2, asa presión-volumen de Ficha 3, fuerzas de Starling
    de Ficha 4), más 2 pulidos adicionales de la Ficha 1 pedidos
    explícitamente por el usuario ("quiero un diagrama interactivo para
    la precarga de Frank-Starling", "que la ley de Laplace se explique con
    imagen", "explica con imagen por qué la RVS/RVP no reflejan fielmente
    la poscarga"):
    - **Diagrama de la ley de Laplace en la Ficha 1** (dentro del
      micro-prof-item "Poscarga"): antes solo texto (`T = P×r`), ahora un
      slider de radio ventricular mueve en vivo un círculo (corte
      transversal del ventrículo) y una barra de tensión relativa
      (`calcLaplaceMiniDiagrama()`, IDs `cardio-laplace-mini-*`) —
      distinto y más simple que la calculadora numérica completa de la
      Ficha 3 (`T=(P×R)/2t`, con grosor de pared).
    - **Demostración del artefacto de acoplamiento RVS/RVP-GC**, en el
      mismo micro-prof-item: un slider de GC (con PAM/PAD fijas) mueve dos
      barras `.kinetic-row` — la RVS "calculada" (que sube/baja solo por
      el GC) frente al "tono vascular real" (constante) — para que se vea
      visualmente por qué la RVS calculada así no es un reflejo fiel de la
      poscarga (`calcRVSArtefactoDiagrama()`).
    - **Simulador de Frank-Starling movido dentro del acordeón de
      "Precarga"**: antes era una sección aparte entre `.micro-profiles` y
      la tabla de determinantes del GC; ahora vive dentro del propio
      micro-prof-item "Precarga: ley de Frank-Starling", justo después de
      su párrafo explicativo — mismos IDs, sin cambios de JS más allá de
      la reubicación en el HTML, para que "la explicación tenga el
      diagrama al lado" como pidió el usuario, en vez de un simulador
      genérico más abajo en la página sin conexión visual directa con el
      texto que lo motiva.
    - **Bug de solapamiento de texto SVG, encontrado y corregido durante
      esta misma tanda**: el primer intento del mini-diagrama de Laplace
      usaba un `viewBox="0 0 240 140"` con la etiqueta "Tensión de pared
      (T)" sin `text-anchor="middle"`, así que el texto (~21 caracteres)
      se salía del lienzo y quedaba cortado — confirmado con una captura
      de Playwright antes de corregirlo. Solución: `viewBox` ensanchado a
      `0 0 260 140`, círculo/barra/textos recentrados con
      `text-anchor="middle"`.
    - **Gauges visuales en las 2 calculadoras de la Ficha 2** (mismo
      patrón `.kinetic-row`/`.kinetic-fill`/`.kinetic-marker` del DO₂I de
      la Ficha 1, sin CSS nuevo): doble producto (escala 0-15.000, marca
      en 12.000) y triple producto (escala 0-150.000, marca en 120.000)
      bajo la calculadora de costo de funcionamiento miocárdico
      (`actualizarGaugeCosto()`); IDO₂ (escala 0-800, banda normal
      520-650, 2 marcadores — mismo lenguaje visual que el DO₂I de la
      Ficha 1 aunque sea un rango normal distinto, Tabla 12 vs. Tabla 3)
      bajo la calculadora de IDO₂ (`actualizarGaugeIDO2Ficha2()`).
    - **Simulador interactivo del asa presión-volumen, Ficha 3** — la
      "oportunidad más grande" señalada por el informe de auditoría
      anterior. Modelo ilustrativo del método de elastancia de un solo
      latido (Ees/Ea/V0), estándar en fisiología cardiovascular didáctica
      — el capítulo solo describe el asa de forma cualitativa (los
      patrones ya recogidos en la tabla de la propia ficha), así que las
      constantes del simulador NO son cifras literales de la fuente,
      mismo criterio de honestidad ya aplicado al simulador de
      Frank-Starling de la Ficha 1. Dos sliders (precarga → EDV,
      poscarga → elastancia arterial efectiva Ea) y un selector de estado
      ventricular (normal/disfunción sistólica/disfunción diastólica, que
      cambian Ees y el coeficiente de rigidez diastólica beta) redibujan
      en vivo un asa cerrada (`calcAsaPresionVolumen()` en
      `cardiologia.js`, SVG con 2 tramos rectos de isovolumia + 2 curvas
      de Bézier para eyección/llenado) junto con 2 líneas de referencia
      discontinuas — la ESPVR (Ees, azul) y la FRPVD (rigidez diastólica,
      amarilla) — que se desplazan exactamente como describe la tabla de
      patrones ya existente en la ficha (abajo/derecha en disfunción
      sistólica, arriba/izquierda en diastólica). Lectura numérica debajo
      (EDV/ESV/volumen sistólico/FE, con semáforo de color por FE). El
      coeficiente de rigidez de la disfunción diastólica se afinó a 0,040
      (frente a 0,022 basal) tras comprobar con una primera captura que la
      diferencia visual entre estado normal y diastólico era demasiado
      sutil para ser pedagógicamente útil — con el valor ajustado el
      desplazamiento de la curva FRPVD es claramente visible. La presión
      de llenado se limita a 170 mmHg (`Math.min(170, ...)`) para que la
      combinación de precarga alta + disfunción diastólica no dispare la
      exponencial fuera del lienzo. **Bug encontrado y corregido durante
      la verificación con Playwright**: la etiqueta "Ees" se posicionaba
      dinámicamente en el extremo de la línea ESPVR, lo que la hacía
      solaparse con el título del diagrama cuando Ees es alto (línea casi
      vertical, extremo cerca de la esquina superior) — se fijó en su
      lugar a una posición constante en la esquina superior derecha del
      lienzo (`text-anchor="end"`), que queda razonablemente cerca del
      extremo real de la línea en la mayoría de combinaciones de sliders
      sin arriesgar el solape.
    - **Esquema circular en la calculadora numérica de Laplace de la
      Ficha 3** (`T=(P×R)/2t`, con grosor de pared) — a diferencia del
      mini-diagrama ilustrativo de la Ficha 1 (que usa un slider propio),
      este reacciona a los 3 inputs numéricos reales de la propia
      calculadora: el círculo interior (cavidad) escala con R, el grosor
      del trazo del anillo (pared) escala con t, y una barra de tensión
      se colorea según la T calculada (`calcLaplaceCirculoFicha3()`).
    - **Simulador de fuerzas de Starling a lo largo del capilar, Ficha 4**
      — la única de las 4 fichas sin ningún elemento interactivo hasta
      ahora. Modelo simplificado (presión oncótica constante a lo largo
      del capilar, presión hidrostática decreciente linealmente del
      extremo arteriolar al venular con un diferencial fijo de 17 mmHg,
      valores de partida ~32→15 mmHg clásicos de la docencia fisiológica)
      — la fuente no da esta fórmula, solo describe el balance en prosa
      (ya citada en el texto que precede al simulador), así que es
      puramente ilustrativo. Dos sliders (presión hidrostática arteriolar,
      presión oncótica plasmática) mueven 5 flechas a lo largo de un tubo
      capilar y un marcador de "punto de equilibrio"
      (`calcFuerzasStarlingCapilar()`). **Bug real encontrado y corregido
      durante la verificación con capturas de Playwright**: la primera
      versión dibujaba la flecha de filtración por debajo del tubo
      apuntando hacia abajo (alejándose, correcto) pero la de reabsorción
      por ENCIMA del tubo apuntando hacia arriba (también alejándose, del
      lado opuesto) — ambas flechas apuntaban "hacia afuera" de su propia
      banda en vez de una entrar y otra salir del vaso, así que no se leía
      realmente como filtración-vs-reabsorción. Corregido para que ambas
      vivan en la misma banda (el espacio intersticial, debajo del tubo):
      la de filtración apunta hacia abajo/afuera (sale del vaso) y la de
      reabsorción hacia arriba/adentro (entra al vaso) — verificado con
      captura que ahora se lee correctamente como flujo cruzando la pared
      capilar en cada dirección.
    Verificado con Playwright: gauges de Ficha 2 cambian de color/anchura
    correctamente en valores extremos (doble producto en rojo al 100% con
    FC 180/PAS 220; IDO₂ en rojo al bajar Hb a 7 g/dl); el asa
    presión-volumen cambia de forma con cada slider y de color por estado
    (azul/rojo/púrpura); el círculo de Laplace de la Ficha 3 crece/cambia
    de color con R/t; el simulador de Starling desplaza correctamente el
    punto de equilibrio y llega a los extremos "filtración en todo el
    capilar"/"reabsorción en todo el capilar"; recorrido completo de las
    11 fichas (abrir/cerrar cada una) y un recorrido de 8 preguntas del
    quiz de la Ficha 1 (incluida una de tipo `redactar`), sin errores de
    consola ni 404 reales (el único 404 detectado es el `favicon.ico` que
    el navegador pide automáticamente, sin relación con la app).
  - **Auditoría de bibliografía de las Fichas 5, 6 y 7, con relectura íntegra
    de sus 3 capítulos fuente** (37+4+13 páginas), a petición explícita del
    usuario de "rellenar los huecos de información... revisa que se ha
    incluido correctamente la información de las fichas respecto a la
    bibliografía" — releídos directamente con el `Read` tool (páginas 59-95
    y 97-100 de `libro-azul-seccion-i-cardiovascular-parte1.pdf`, páginas
    1-13 de `libro-azul-seccion-i-cardiovascular-parte2.pdf`) y comparados
    frase a frase contra el contenido ya escrito, mismo método que las
    auditorías anteriores de Nefrología/HTA/ERC/FRA.
    - **Hallazgo más importante: contenido no sourced en la Ficha 6**. El
      Capítulo 6 (Ramírez Vallejo, solo 4 páginas) es exclusivamente sobre
      biología de la placa/trombosis — no menciona en ningún punto la
      cascada isquémica, la progresión subendocardio→epicardio de la
      necrosis ("tiempo es músculo") ni la lesión por reperfusión. Los 3
      `micro-prof-item` que desarrollaban estos temas en la ficha (contenido
      médicamente correcto y estándar, pero no presente en el capítulo
      citado) se **eliminaron**, junto con las 5 preguntas de quiz que
      dependían de ellos (`cardio-q043`-`q045`, `q047`-`q048`) — mismo
      criterio ya aplicado al "marco de 4 componentes" fabricado que se
      encontró y quitó de la Ficha 2 de Cardiología en una auditoría
      anterior: nunca dejar contenido clínico sin respaldo directo en la
      fuente citada, aunque el contenido en sí no sea incorrecto. El resto
      del Capítulo 6 —de hecho, la práctica totalidad de su texto real— ya
      estaba fielmente transcrito en la ficha; el banco de preguntas de ese
      tema queda en 7 (de 8), todas ancladas a contenido real del capítulo.
    - **Ficha 5** (capítulo más extenso del bloque, 37 páginas) ganó 4
      secciones nuevas, ninguna presente antes: 1) **Gradiente
      transpulmonar (GTP)**, con la tabla de 2 filas que distingue HP
      proporcional/pasiva (GTP&lt;12-15, RVP&lt;200-240/2,5-3UW, revierte al
      bajar la Wedge) de HP desproporcionada/reactiva (GTP&gt;12-15,
      independiente de la Wedge) — ausente por completo hasta ahora; 2)
      **Dependencia en paralelo/serie**, los 2 mecanismos reales por los que
      la ventilación mecánica interfiere cíclicamente con la hemodinamia
      (desplazamiento septal por sobrecarga del VD vs. reducción del retorno
      venoso), como 2 `micro-prof-item` nuevos; 3) **Termodilución
      transpulmonar y PICCO**, con las fórmulas reales del método dual
      (VLT/VST/EVLW) y del PICCO (productos del análisis, factores de
      corrección, contraindicaciones) — antes PICCO solo aparecía como
      nombre de instrumento en una tabla, sin ninguna explicación de cómo
      funciona; 4) **indicadores volumétricos de precarga** (VTDVDi &lt;90
      mL/m² predice respuesta/&gt;140 no respuesta, VTDGi &lt;600→80%
      respondedores/&gt;800→30%, área telediastólica VI &lt;5cm²/m²). Se
      añadió también una **nota de discrepancia real de la propia fuente**:
      el capítulo define el IRVS de 2 formas matemáticamente distintas en
      2 puntos diferentes del texto — (PAM−PVC)×80/IC (1600-2400) y
      RVS×ASC (1800-2500) —, señalada en vez de silenciada, mismo criterio
      que el IFR de Fracaso Renal Agudo o el TAPSE&gt;16/&gt;17mm de esta
      misma sección. Enriquecimientos menores: detalle del flujo Grado III
      de disfunción diastólica, matiz ETT vs. ETE en la subestimación del
      volumen auricular izquierdo y su correlación con la PAP.
    - **Ficha 7** ganó: 1) un párrafo mecanístico que faltaba al final de
      "Mecanismos fisiopatológicos" (aumento de la impedancia al flujo de
      salida, deterioro sistodiastólico del VD hacia insuficiencia
      circulatoria, y la reversibilidad al corregir la etiología de la HP);
      2) un párrafo epidemiológico ausente hasta ahora: la causa más
      frecuente de HP en el paciente crítico es en realidad la
      insuficiencia ventricular izquierda (Grupo 2), no los 3 escenarios
      agudos (SDRA/TEP/sepsis) que la ficha desarrolla a continuación —
      matiz importante que faltaba antes de esa sección; 3) subcategorías
      completas que faltaban en la tabla de clasificación de 5 grupos:
      "enfermedades del desarrollo pulmonar" en el Grupo 3, y varias del
      Grupo 5 (histiocitosis pulmonar, linfangioleiomiomatosis,
      neurofibromatosis, enfermedad de Gaucher, trastornos tiroideos,
      microangiopatía trombótica tumoral pulmonar, mediastinitis
      fibrosante) — antes solo se citaba un subconjunto parcial de cada
      grupo; 4) una frase sobre la utilidad limitada de la monitorización
      invasiva por disponibilidad real de las técnicas en la práctica
      diaria.
    - Verificado con Playwright tras todos los cambios: las 3 fichas siguen
      abriendo sin error de consola, el contenido nuevo está presente
      (`Gradiente transpulmonar`, `PICCO`, `Dependencia en paralelo`,
      `VTDVDi`, `enfermedades del desarrollo pulmonar`, `causa más frecuente
      de HP`) y el contenido eliminado ya no aparece (`Cascada isquémica`,
      `Lesión por reperfusión`); el tema de quiz "enfermedad coronaria"
      recorre sus 7 preguntas restantes sin excepciones JS.
  - **Bibliografía movida a una Ficha 12 nueva, dentro del propio cuaderno
    de campo** — a petición explícita del usuario ("quiero que quites la
    bibliografía del final de cardio y la pongas en una nueva ficha, la
    ficha 12"). Antes vivía en un `<div class="card">` suelto, fuera de
    `#panel-cardio-tabs`, debajo del cuaderno de campo — único bloque de
    todo el módulo de Cardiología que no seguía el patrón de ficha del
    resto de la app. Ahora es `<div id="cardio-bibliografia"
    class="tab-content">` dentro del panel, con su propio `.field-card`
    (Ficha 12, ilustración de un libro) en `#cardio-corkboard` — mismo
    patrón exacto que las otras 11 fichas (voltea con una pregunta de
    "gancho", el botón `.back-cta` abre el contenido vía
    `openCorkboardTopic`), aunque, al ser una ficha de referencia y no de
    teoría para repasar, no lleva preguntas de quiz propias — mismo
    criterio ya aplicado a "Tratamiento por objetivos" de ERC y a
    `nefrotoxicidad.html`. El contenido de las 11 entradas de bibliografía
    no cambió, solo su ubicación estructural. Verificado con Playwright:
    el corkboard ahora reporta 12 fichas (antes 11), la Ficha 12 abre y
    muestra sus 11 enlaces (primer href `...parte1.pdf#page=3`, último
    `...parte2.pdf#page=55`), y ya no queda ningún bloque de bibliografía
    suelto fuera del panel (`body > .card:has(h3:has-text("Bibliografía"))`
    da 0 resultados).
  - **Ficha 1: ejes numéricos + calculadora en Frank-Starling, calculadora +
    interpretación en el diagrama de Laplace**, a petición explícita del
    usuario ("añadir datos numéricos en el eje de abscisas y ordenadas...
    me gustaría que se pudiera hacer una calculadora en el simulador...
    algo parecido en el diagrama interactivo de Laplace, que hubiera una
    parte pequeña para calcular esta ley... información breve sobre qué
    implican los valores extremos, cuáles son los valores fisiológicos").
    - **Frank-Starling**: el eje X (antes "Precarga" sin unidades) ahora
      lleva marcas numéricas de EDV en mL (70/93/115/138/160) y el eje Y
      marcas de volumen sistólico en mL (0/40/80/120) — usando el mismo
      rango EDV 70-160 mL ya establecido en el asa presión-volumen de la
      Ficha 3, para que ambos simuladores hablen el mismo lenguaje
      numérico. Se añadió un input numérico `cardio-fs-edv-ml`
      **sincronizado bidireccionalmente** con el slider de precarga
      (`fsPrecargaToEdv()`/`fsEdvToPrecarga()` en `cardiologia.js`) — es la
      "calculadora" pedida: escribir un EDV en mL mueve el slider y
      recalcula el punto de la curva, y mover el slider actualiza el
      campo numérico. El resultado ahora reporta EDV y volumen sistólico
      en mL reales (antes solo "% del máximo alcanzable"). Las funciones
      `textoZonaFrankStarling()`/`textoEstadoFrankStarling()` se
      reescribieron para devolver HTML esquematizado (`<dl class="kv-row">`
      con Zona/Mecanismo/Riesgo, y Contractilidad por separado) en vez de
      un párrafo corrido, con `<strong>` de color (`--accent-red/blue/green`
      según el estado contráctil) y `.hl` en las frases clave — mismo
      patrón visual ya usado en el resto de la app. Se añadió una nota de
      valores fisiológicos de referencia (EDV 70-120 mL, VS 60-100 mL).
    - **Laplace (mini-diagrama de la Ficha 1, dentro de "Poscarga")**: ganó
      un input numérico de presión (`cardio-laplace-mini-p`, mmHg) que,
      junto al slider de radio ya existente, calcula T = P×r en vivo
      (`calcLaplaceMiniDiagrama()` actualizada) — la "calculadora pequeña"
      pedida, distinta y más simple que la calculadora numérica completa
      de la Ficha 3 (T=(P×R)/2t, con grosor de pared). El color del
      círculo/barra ahora responde a la **tensión calculada** (P×r), no
      solo al radio como antes, con 3 tramos (verde/amarillo/rojo en
      280/450 sobre una escala ilustrativa 0-700) y un nuevo
      `#cardio-laplace-mini-interpretacion` (`.tfg-estado`) que explica qué
      implica cada tramo — desde "dentro de un rango habitual" hasta
      "estímulo que dispara la hipertrofia compensadora", enlazando con el
      doble/triple producto de la Ficha 2. Se añadió una nota de valores
      fisiológicos de referencia (P sistólica VI 90-140 mmHg, radio VI
      2,5-3,5 cm, hasta &gt;4,5 cm en dilatación), con la aclaración
      explícita de que las unidades (mmHg·cm) son ilustrativas, no una
      escala clínica validada.
    - Verificado con Playwright: la sincronización slider↔input mL
      funciona en ambas direcciones (precarga 90% → EDV 151 mL; EDV 80 mL
      → precarga 11%), la interpretación esquematizada contiene los
      `kv-row`/`<dt>Zona</dt>` esperados, las marcas numéricas de los ejes
      están presentes en el SVG, y la calculadora de Laplace responde
      correctamente a cambios de P y r (P=200→T=545/rojo,
      P=40+r mínimo→T=67/verde) — las 11 fichas de contenido y la Ficha 12
      de bibliografía siguen abriendo sin error de consola ni 404 reales.
  - **Menú del quiz reorganizado en 3 niveles** (asignatura → bloque →
    ficha), a petición explícita del usuario ("me gustaría que el pool de
    preguntas estuviera mejor dividido... 1º asignatura 2º Tema 3º título
    de ficha"). Antes `initQuiz()` mostraba una única pantalla con TODOS
    los temas de la app en una lista plana (más de 60 botones, sumando
    Hematología+Nefrología+UCI Papers Tuiter+Fisiopatología UCI) bajo
    "¿Qué quieres repasar?". Ahora es una navegación jerárquica:
    - **Nivel 0** (asignaturas): "Todos los temas" (banco completo) + un
      botón por especialidad (Hematología/Nefrología/UCI Papers
      Tuiter/Fisiopatología UCI), cada uno con su recuento real.
    - **Nivel 1** (bloques, tras elegir una asignatura): "← Especialidades"
      + "Todos los temas de [asignatura]" + un botón por bloque — el
      agrupamiento natural que ya existe en la navegación real de la app
      (p. ej. dentro de Nefrología: Fisiología renal y electrolitos/HTA/
      ERC/FRA/TRR; dentro de Fisiopatología UCI: Hematología y
      Hemostasia/Vías Urinarias/Cardiología). **Trasplante** (18 fichas en
      un único banco hasta ahora) se reparte en 3 bloques según el
      prefijo real de sus claves (`tph-`/`cart-`/`comp-`), reflejando las
      3 subvistas ya existentes del módulo — sin este reparto, hubiera
      sido el único bloque desproporcionadamente grande de todo el árbol.
    - **Nivel 2** (fichas, tras elegir un bloque): "← [asignatura]" +
      "Todos los temas de [bloque]" + un botón por ficha individual (el
      comportamiento de siempre, ya existente antes de este cambio).
    - Implementación: `quiz.js` ganó `renderNivelAsignaturas()`/
      `renderNivelBloques()`/`renderNivelTemas()` (sustituyendo a la única
      `renderTemas()` anterior) y un manejador de clic genérico basado en
      `data-accion`/`data-valor` en vez de `data-tema` directo — cada
      nivel es solo una lista de botones generada a partir de `temas`
      filtrado por `asignatura`/`bloque`, sin estado adicional más que
      `nivelAsignatura`/`nivelBloque` para resolver las opciones "Todos
      los temas de...". Los 4 `index.js` de especialidad (`home`,
      `nefrologia`, `uci-papers`, `fisio-uci`) ahora mapean sus
      `temasXxx.map(t => ({ ...t, asignatura, bloque }))` antes de
      exportar `quizTemas`, en vez de solo `[...temasA, ...temasB]` — la
      jerarquía se etiqueta en el punto exacto donde cada especialidad ya
      combina sus propios bloques, sin tocar ningún archivo
      `js/data/*-preguntas.js` ni añadir ningún paso nuevo en `main.js`
      (que sigue haciendo un `[...home.quizTemas, ...]` idéntico a antes —
      el `asignatura`/`bloque` ya viaja dentro de cada objeto `tema`).
      Degradación elegante conservada: un `tema` sin `asignatura`/`bloque`
      se agrupa bajo etiquetas genéricas ("Otros"/"General") en vez de
      romper el árbol.
    - Verificado con Playwright: nivel 0 muestra las 4 especialidades con
      sus recuentos correctos (1019 total = 176+559+103+181); nivel 1 de
      Nefrología muestra sus 5 bloques con recuentos que suman el total
      (255+88+96+72+48=559); nivel 1 de Hematología confirma el reparto en
      3 de Trasplante (35+25+30=90, mismo total que antes); nivel 2 de
      Trasplante-CAR-T muestra sus 5 fichas reales; la navegación
      "← Especialidades"/"← [asignatura]" vuelve al nivel correcto; "Todos
      los temas de Cardiología" arranca un recorrido de 117 preguntas; sin
      errores de consola ni 404 reales en ningún punto del árbol.
  - **Auditoría de bibliografía y ampliación de las Fichas 9, 10 y 11**
    (cierre de la ronda de auditoría fuente-a-fuente iniciada con las
    Fichas 5-7): releídos íntegros los 3 capítulos fuente restantes de
    Cardiología (Echeverry D., Cap. 9, Ventrículo Derecho, págs. 121-128;
    Urrutia N./Ugarte Ubiergo S., Cap. 10, Estados de Choque, págs.
    129-153 — el capítulo más extenso de todo el bloque; Poblano Morales
    M. et al., Cap. 11, Interacción Corazón-Pulmón, págs. 155-167).
    **Ficha 8** (Embolia pulmonar) se revisó también y se confirmó fiel a
    su fuente sin huecos reales — no recibió cambios.
    - **Ficha 9**: nueva **curva de retorno venoso** (SVG estático, RV
      frente a Pad, con la meseta por colapso venoso y la pendiente
      inversamente proporcional a la resistencia venosa, marcando el
      punto Pad=0 y el punto PCM donde RV=0) — la única figura realmente
      nueva de estas 3 fichas, porque la onda a-c-x-v-y ya tiene su
      propio registro real en la Ficha 5 (`cardio-fig9-onda-pvc.jpg`), y
      aquí solo se referencia en vez de duplicarse.
    - **Ficha 10** (la que más contenido ganó, acorde al volumen real de
      su capítulo fuente): tabla nueva de precarga/contractilidad/
      poscarga por tipo de choque (sustituyendo en formato tabular el
      contenido de las hourglass-icons originales del capítulo, más
      legible que recrearlas como 4 SVG); nuevo acordeón "Cascada
      leucocitaria y daño del glucocálix" (secuencia margination→
      rodamiento→adhesión firme→transmigración→fagocitosis→muerte por
      ROS propios; la adhesión independiente de selectinas/integrinas en
      pulmón e hígado, que explica por qué son los primeros órganos en
      fallar; la ventana crítica de ~6 horas de migración neutrofílica
      ligada a mortalidad; la degradación del glucocálix por ROS como
      mecanismo directo de la fuga capilar séptica); ampliado el kv-row
      del NO con el mecanismo iNOS y el efecto paradójico (el mismo
      exceso de NO que causa hipotensión refractaria también bloquea la
      adhesión leucocitaria, limitando la extracción tisular de O₂ pese
      al GC alto); nuevo diagrama SVG de heterogeneidad del flujo capilar
      (capilares con flujo normal/intermitente/detenido conviviendo en el
      mismo lecho); nuevo acordeón de 2 items — límites de la SvO₂/ScvO₂
      como promedio que enmascara la heterogeneidad regional, y la fase
      terminal de fallo mitocondrial/hipoxia citopática (la mitocondria
      pierde la capacidad de usar el O₂ que le llega); nuevo diagrama SVG
      del triángulo endotelio-inflamación-coagulación (ya citado en
      prosa, ahora visual); nueva tabla "Correlato clínico-temporal"
      (flujo capilar × OEI × SvO₂ por fase, Fig. 8 del capítulo,
      recreada como `.data-table`); enriquecimientos puntuales: nota
      sobre los límites del umbral PAS&lt;90 en pacientes previamente
      hipertensos o jóvenes sanos, causas ampliadas de choque
      hipovolémico no hemorrágico (pancreatitis/quemados/aplastamiento/
      anafilaxia con pérdida de volumen plasmático, no solo sangre),
      catéter urinario añadido al diagnóstico del choque cardiogénico, y
      el mecanismo de sustrato (glucogenólisis→gluconeogénesis a
      expensas de proteólisis/lipólisis) ampliado en la respuesta
      endocrino-metabólica compensadora.
    - **Ficha 11**: nuevo párrafo sobre el carácter <strong>pasivo</strong>
      del retorno venoso sistémico (sin bomba activa, solo el gradiente
      PCM-Pad, enlazando con la curva nueva de la Ficha 9); nueva sección
      "Cambios en el retorno venoso inducidos por el PEEP" con el
      concepto de <strong>hipovolemia funcional</strong> (base fisiológica
      de la VPP/VVS ya citadas en la Ficha 5) y el matiz de por qué el
      PEEP puede mejorar la función del VI en disfunción sistólica pese a
      no aumentar el GC por sí mismo (menor poscarga efectiva); el
      **TRIVI** (tiempo de relajación isovolumétrica) añadido como
      parámetro complementario en el item de función diastólica; nuevo
      acordeón "Taponamiento cardíaco: hallazgos Doppler" — tema
      completamente ausente hasta ahora — con el colapso pasivo de la
      pared libre de la AD como signo ecocardiográfico más precoz, la
      variación respiratoria recíproca del flujo transmitral/
      transtricuspídeo como correlato Doppler objetivo del pulso
      paradójico, y la VCI dilatada sin colapso inspiratorio.
    - Añadidas **12 preguntas de quiz nuevas** (`cardio-q123`-`q134`, 4
      por ficha — 3 de opción múltiple + 1 de tipo `redactar` en cada
      una), llevando el banco de Cardiología a 129 preguntas (117 tras la
      poda de Ficha 6 + 12) y el banco combinado de toda la app a
      **1031 preguntas**. Verificado con Playwright: las 12 fichas del
      cuaderno de campo (incluida la Ficha 12 de bibliografía) abren y
      voltean sin error de consola ni 404 real (el único 404 es el
      `favicon.ico`, ya documentado como inocuo); el nuevo SVG de
      retorno venoso está presente en la Ficha 9; los 4 fragmentos de
      texto/componentes nuevos de la Ficha 10 (cascada leucocitaria,
      hipoxia citopática, tabla de precarga/poscarga, correlato
      clínico-temporal) y los 4 de la Ficha 11 (hipovolemia funcional,
      taponamiento cardíaco, TRIVI, retorno venoso sistémico) se
      detectan correctamente en el DOM; un recorrido por el quiz de los 3
      temas nuevos/ampliados no generó ninguna excepción JS.
  - **Relectura verbatim de las páginas 137-142 y 163-167 del capítulo 10
    y 11**, a petición explícita del usuario de "terminar las fichas que
    queden por repasar" — en vez de fiarse de las notas de la ronda
    anterior, se releyeron literalmente las páginas fuente del apartado
    de microcirculación/mediadores (Cap. 10) y del cierre del capítulo de
    interacción corazón-pulmón (Cap. 11), lo que permitió corregir
    imprecisiones y añadir contenido más fiel al texto original:
    - **Corrección real**: el "efecto paradójico" del NO en sepsis no era
      (como se había escrito en la ronda anterior) que el exceso de NO
      bloquee la extracción de O₂ vía adhesión leucocitaria — el propio
      capítulo formula el paradójico al revés: la sobreproducción de NO
      tiene un <em>efecto protector</em> sobre la microcirculación de los
      órganos, de modo que <strong>inhibir</strong> el NO farmacológicamente
      sube la PA pero no restaura el O₂ER/VO₂ y reduce el GC/DO₂, con
      riesgo de insuficiencia cardíaca e hipoperfusión coronaria/
      intestinal — el motivo real por el que los inhibidores no
      selectivos de la NOS fracasaron en los ensayos de choque séptico.
      Corregido en `cardiologia.html` y añadida `cardio-q135` para
      fijarlo en el quiz.
    - **Cascada leucocitaria ampliada** con los pasos exactos del texto
      (quimiotaxis, reconocimiento por opsoninas/linfocitos, fagosomas
      por macrófagos, degradación lisosomal) y el ejemplo concreto de
      peritonitis secundaria/terciaria como fallo clásico de contención
      local por fracaso de la migración neutrofílica.
    - **Figura 7 del capítulo (heterogeneidad espacial y temporal del
      flujo capilar) recreada con fidelidad** — la versión anterior
      simplificaba en exceso (3 líneas "flujo normal/intermitente/
      detenido" sin etiquetas de O₂ER/SvO₂); la nueva versión sigue la
      Figura 7 real: capilar detenido con ↓O₂ER/↑SvO₂ local (la sangre
      "no usada" vuelve con más oxígeno) junto a un capilar normal
      adyacente que compensa con ↑O₂ER/↓SvO₂.
    - **Tabla "Correlato clínico-temporal" (Figura 8) reescrita** con la
      secuencia de 4 fases que el propio capítulo describe como la más
      probable (heterogeneidad inicial → fase hiperdinámica compensadora
      → prevalencia de flujo bajo/sin flujo → fase terminal de hiperoxia
      por fallo mitocondrial) — la versión anterior tenía la direccionalidad
      del O₂ER de la fase inicial invertida respecto a la fuente.
    - **Nuevo acordeón "Correlación clínica: una brecha reconocida por los
      propios autores"**, citando textualmente que el capítulo admite un
      "eslabón perdido" en el conocimiento actual sobre el orden temporal
      exacto entre los fenómenos microcirculatorios y el cuadro clínico —
      antes la app presentaba la secuencia como si fuera un hecho
      establecido, sin esa salvedad explícita de la fuente.
    - **Gráfico de tarta SVG de la epidemiología por tipo de choque**
      (62/16/16/4/2%, Ficha 10) — visualiza la tabla ya existente sin
      añadir ningún dato nuevo, cierre del hueco de "Fig. 1" señalado en
      la ronda de auditoría anterior.
    - **Sección "Perspectivas futuras" añadida a la Ficha 11** (ausente
      hasta ahora): la ecocardiografía como herramienta indispensable
      para documentar los efectos de la VM, interpretable por
      profesionales capacitados no necesariamente ecocardiografistas, la
      necesidad de formación en ecocardiografía transesofágica, y las 3
      técnicas avanzadas que el capítulo señala como de mayor utilidad
      futura (velocidad de deformación/<em>strain</em> en miocardiopatía
      séptica, modos 3D para valoración de cavidades, análisis detallado
      de valvulopatías complejas).
    - Añadidas **4 preguntas de quiz nuevas** (`cardio-q135`-`q138`,
      incluida una de tipo `redactar` sobre la "brecha" reconocida en la
      microcirculación séptica), llevando el banco de Cardiología a 133
      preguntas y el banco combinado de la app a **1035 preguntas**.
      Verificado con Playwright: las 12 fichas abren/voltean sin error de
      consola ni 404 real; el donut de epidemiología, el párrafo del
      efecto paradójico de inhibir el NO, el acordeón de la "brecha
      reconocida", el ejemplo de peritonitis secundaria y la sección de
      Perspectivas futuras se detectan correctamente en el DOM. Con esta
      ronda se da por cerrada la auditoría fuente-a-fuente completa de
      las 11 fichas de contenido clínico de Cardiología.
  - **Informe de bugs/mejoras de Cardiología y correcciones aplicadas**, a
    petición explícita del usuario ("haz un informe sobre mejoras... sobre
    puntos que están mal, y sobre fallos"). Auditoría de código (no de
    bibliografía esta vez) sobre `cardiologia.js`/`cardiologia.html`,
    verificando cada hallazgo con Playwright antes de reportarlo — mismo
    estándar que las auditorías anteriores, pero aplicado al código en vez
    de al contenido clínico. 2 bugs reales confirmados y corregidos:
    - **`calcFickTransporte` (Ficha 1) sin guard para SC=0**: a diferencia
      de la calculadora casi gemela `calcIDO2Ficha2` (Ficha 2, misma
      fórmula IC×CaO₂), esta no comprobaba `sc === 0` antes de dividir —
      con superficie corporal 0 mostraba literalmente "IC = Infinity
      L/min/m²" y "DO₂I = Infinity mL/min/m²". Corregido añadiendo el
      mismo guard ya usado en la Ficha 2 (oculta el resultado y el gauge
      en vez de dividir por cero).
    - **Simulador de Frank-Starling (Ficha 1) — el campo mL no se
      autocorregía fuera de rango**: escribir un EDV fuera de 70-160 mL
      clampaba el cálculo interno correctamente pero dejaba el propio
      campo de texto mostrando el valor tecleado sin corregir (p. ej.
      "300" en pantalla mientras el resultado ya decía "EDV ≈ 160 mL") —
      confuso, parecía que la calculadora ignoraba la entrada. Corregido
      reescribiendo el campo con el valor clampado cuando difiere.
    A petición del usuario, se corrigieron también (sin fabricar cifras
    nuevas, solo mejorando cómo se presentan discrepancias de la propia
    fuente ya documentadas) manteniendo intactas las referencias cruzadas
    entre fichas:
    - **TAPSE**: la Ficha 5 (&gt;16 mm) no mencionaba que la Ficha 11
      (&gt;17 mm) cita una cifra distinta para el mismo parámetro — solo
      Ficha 11→Ficha 5 era explícito. Añadida la referencia inversa en la
      Ficha 5, dejando la discrepancia señalada en ambas direcciones (sin
      elegir una cifra "ganadora", mismo criterio que el resto de la app).
    - **Rango normal de DO₂I distinto entre Ficha 1 (530-600, Tabla 3,
      Capítulo 1) y Ficha 2/Ficha 5 (520-650, Tabla 12, Capítulo 5)**:
      ambas cifras son correctas (dos tablas distintas del mismo libro),
      pero no estaba explicado por qué difieren — añadida una nota de
      fidelidad explícita en la Ficha 1 aclarando que no es un error de
      la app. La discrepancia del IRVS (Ficha 5, 2 fórmulas del propio
      capítulo) ya tenía una nota igual de clara desde la auditoría
      anterior — no requería ningún cambio adicional.
    Además, un punto de mejora nuevo (no reportado como bug porque no
    rompía nada, pero podía inducir a error): la calculadora de
    resistencias vasculares (Ficha 1) no distinguía una PAD mayor que la
    PAM (combinación no fisiológica: la presión de la aurícula derecha no
    puede superar a la PAM en un paciente estable) de una vasoplejía
    extrema real — ambas daban RVS negativa interpretada como "shock
    vasopléjico". Añadido un aviso específico (`⚠️ Combinación de valores
    no fisiológica`) que se antepone a la interpretación clínica normal
    cuando RVS≤0, pidiendo revisar los datos en vez de diagnosticar una
    vasoplejía inexistente. Otros 2 puntos señalados en el informe se
    dejaron deliberadamente sin tocar por no ser accionables sin más
    fuente o sin romper la arquitectura ya establecida: la Ficha 6
    (enfermedad coronaria) es la más corta del bloque porque su capítulo
    fuente son solo 4 páginas ya agotadas, y `cardiologia.html` es el
    archivo de contenido más grande de la app — dividirlo iría contra el
    patrón "un partial por categoría" ya asentado en el proyecto.
    Verificado con Playwright: SC=0 ya no muestra "Infinity" (el bloque de
    resultado se oculta, igual que en la Ficha 2); un EDV de 300 mL
    corrige el campo a 160 tras el cálculo; PAD&gt;PAM muestra el aviso de
    no fisiológico y, al corregir el dato, la calculadora vuelve a
    funcionar con normalidad; las notas cruzadas de TAPSE y DO₂I están
    presentes en el DOM; las 12 fichas siguen abriendo sin error de
    consola ni 404 real.
  - **Placeholder de las Figuras 2-4 (Ficha 3) sustituido por un diagrama
    real**, a petición explícita del usuario tras ver una captura de
    móvil del recuadro punteado ("ahora quiero que corrijas esto que se
    ve así de mal"). Era el único recuadro `📊 Placeholder` que quedaba en
    todo el bloque de Cardiología (los 3 que siguen en el bloque de
    Hematología de Fisiopatología UCI son de otro módulo, sin tocar). Se
    recreó como SVG el diagrama clásico de Guyton que el texto ya describe
    en prosa: 2 curvas de Starling (gasto cardíaco, normal vs. con
    contractilidad deprimida) cruzándose con 2 curvas de retorno venoso
    (normal vs. desplazada por retención de líquidos con MCFP más alta),
    con los 3 puntos de equilibrio A→B→C ya nombrados en el texto
    adyacente y las transiciones (1)/(2) marcadas. **Bug de color
    encontrado y corregido durante la propia verificación con capturas de
    Playwright, antes de darlo por bueno**: la primera versión usaba
    `--accent-yellow` para los puntos A/B/C y `--accent-blue` para la
    curva de Starling normal — en la paleta real de esta app (ver
    `css/variables.css`) `--accent-blue` es en realidad un dorado
    (`#d4af37`) casi idéntico a `--accent-yellow` (`#cf9a3e`), así que los
    puntos se confundían visualmente con la curva. Corregido usando
    `--text-main` (crema, con borde `--bg-main` para contraste) para los
    3 puntos, dejando cada curva en un color de la paleta real
    (verde/rojo/dorado/púrpura) — verificado que ahora los 4 trazos y los
    3 puntos se distinguen a simple vista. También se corrigió un
    desbordamiento del texto de la curva de retorno venoso desplazada,
    que se salía del `viewBox` en su posición original.
  - **Avisos de "combinación no fisiológica" en las calculadoras de
    Cardiología**, a petición explícita del usuario ("busca los límites
    fisiológicos de las calculadoras... y pon una advertencia cuando meta
    un dato que sea incompatible con la fisiología si es que fuera
    científicamente y médicamente posible"). Revisadas una por una las 10
    calculadoras/simuladores de `cardiologia.js`: los simuladores basados
    solo en sliders (Frank-Starling, asa presión-volumen, fuerzas de
    Starling capilar, artefacto RVS) no necesitan aviso porque cualquier
    combinación dentro de su rango acotado ya es representable por el
    modelo; los candidatos reales eran las calculadoras con campos
    numéricos libres, donde cada campo por separado puede ser válido pero
    la <em>combinación</em> no lo es — mismo criterio que el aviso de
    PAD≥PAM ya añadido en la ronda anterior, extendido ahora a:
    - **RVP** (Ficha 1, misma calculadora de resistencias): PAI≥PAMP —
      sin gradiente de presión anterógrado no puede haber flujo pulmonar,
      igual razonamiento que PAD/PAM para el lado sistémico.
    - **Fick — sangre venosa más oxigenada que la arterial** (Ficha 1):
      SvO₂&gt;SaO₂ o PvO₂&gt;PaO₂ — el oxígeno se extrae en los tejidos,
      nunca se añade, así que la sangre venosa mixta no puede saturar más
      que la arterial.
    - **Saturaciones fuera de 0-100%** (Fick y IDO₂ Ficha 2, campos SaO₂/
      SvO₂): a diferencia de los avisos anteriores (clínicamente
      implausibles pero calculables), esta es una imposibilidad física
      pura — un % no puede superar 100 — así que se valida aunque el
      campo ya tenga `max="100"` en el HTML (que no impide escribir a
      mano un valor mayor).
    - **Costo de funcionamiento miocárdico** (Ficha 2): cuña/PVC ≥ PAD
      diastólica sistémica → presión de perfusión coronaria ≤0, que sin
      gradiente anterógrado es incompatible con la perfusión miocárdica
      sostenida (no solo "baja", como ya marcaba el aviso `warn`
      preexistente para PPC&lt;60).
    Revisadas también, sin encontrar ningún cruce imposible que añadir:
    Laplace (Ficha 1 y Ficha 3, parámetros geométricos/presión
    independientes entre sí) y el diagrama mini de Laplace (un único
    campo libre). Verificado con Playwright: los 6 avisos nuevos aparecen
    exactamente con los datos que los disparan y desaparecen al corregir
    el dato (SaO₂=150→aviso→98=normal; SvO₂=99&gt;SaO₂=98→aviso;
    PvO₂=95&gt;PaO₂=90→aviso; PAI=20≥PAMP=15→aviso en la línea de RVP sin
    romper la de RVS; SaO₂=120 en Ficha 2→aviso; cuña=80≥PAD=70→aviso con
    PPC=-10 mostrado explícitamente); las 12 fichas y el resto de
    calculadoras siguen funcionando sin error de consola ni 404 real.
  - **Fusión de la Figura estática y la animación dinámica del ciclo
    cardíaco (Ficha 1)**, a petición explícita del usuario tras ver una
    captura mostrando ambas gráficas por separado ("hay alguna manera de
    fusionar ambas gráficas para una mejor explicación?"). La animación
    (`#cardio-wiggers-anim`) solo tenía presión aórtica/ventricular, PVY y
    ECG — le faltaban 3 elementos que sí están en la Figura 2 estática
    (`cardio-fig2-ciclo-wiggers.jpg`): la curva de <strong>presión
    auricular</strong>, el punto de <strong>cruzamiento</strong> donde
    cruza por debajo de la presión ventricular (apertura de la válvula
    mitral, el instante exacto en que arranca la fase F), y las
    etiquetas de los tonos (S1/S2) y de la onda a-c-v de la PVY. Añadidos
    los 3 sin duplicar trabajo: la curva de presión auricular reutiliza
    literalmente el mismo trazado a-c-x-v-y ya validado de la PVY (son
    fisiológicamente la misma onda), reescalado con un simple offset de
    coordenadas a la banda de baja presión (0-14 mmHg) del panel superior
    — no se recalculó ninguna curva nueva a mano. El punto de cruzamiento
    no se colocó a ojo: cae de forma natural donde ya estaba el marcador
    de S3 (x=170, inicio de la fase F), porque las curvas de presión
    ventricular y auricular reescalada ya se cruzan justo ahí — coherencia
    física gratis por reutilizar el trazado real de la PVY en vez de
    inventar una curva nueva. **2 rondas de ajuste de layout tras
    verificar con capturas de Playwright** (mismo método ya establecido
    en esta sesión): la 1ª colocación del texto "Presión auricular" caía
    encima del pico de su propia curva, y las etiquetas S1/"c" de PVY se
    solapaban con el aro de pulso animado (que llega a r=6 en el pico de
    la animación, más grande que el r=3 en reposo); corregido separando
    todas las etiquetas de sus curvas/marcadores con más margen vertical
    y moviendo las letras a-c-v de la PVY por debajo de su curva en vez
    de por encima (donde chocaban con la fila de Tonos). El párrafo
    introductorio de la sección se amplió para explicar explícitamente
    qué se fusionó y por qué. Verificado con Playwright (captura a
    devicePixelRatio 3 para inspeccionar el texto pequeño): las 3
    etiquetas nuevas y el marcador de cruzamiento se leen sin solapes,
    la animación sigue avanzando con el cursor y mostrando una única
    etiqueta de fase a la vez, y las 12 fichas siguen sin error de
    consola ni 404 real.
  - **Mini-diagrama de estado valvular sincronizado**, a petición
    explícita del usuario tras la fusión anterior ("¿podrías construir
    algo más sofisticado con la fusión de ambas gráficas?"). La Figura 2
    estática también incluye el "ciclo de Lewis" — una fila de 9
    corazones esquemáticos mostrando el estado de las válvulas mitral/
    aórtica en cada fase — que la animación no reproducía en absoluto.
    En vez de animar 9 iconos estáticos por separado, se construyó
    **un único corazón esquemático** (aurícula izq./ventrículo izq./
    aorta, `viewBox` propio dentro del mismo `#cardio-wiggers-anim`) con
    2 "válvulas" (círculos rojo=cerrada / verde=abierta con flecha de
    flujo superpuesta) que cambian de estado con el mismo cursor que ya
    mueve las curvas de presión — sin JS nuevo: los nuevos elementos
    llevan las clases `wiggers-mitral-open`/`wiggers-aortic-open`/
    `wiggers-iso-label`, con 3 `@keyframes` nuevos en `components.css`
    que reutilizan los mismos puntos de corte porcentuales ya definidos
    para `wiggers-fase-a` a `-g` (mitral abierta en A+F+G, aórtica
    abierta en C+D, "ISO" centrado en el ventrículo durante B y E) — el
    mismo patrón de "una animación CSS por elemento, cero JS de
    temporización" ya establecido para el resto del diagrama. Añadidas
    también las 3 clases nuevas a la regla `.wiggers-anim.paused` para
    que el botón de pausa las congele igual que al cursor y las fases.
    **Verificación más rigurosa que capturas sueltas**: en vez de solo
    mirar una captura de pantalla, se usó la Web Animations API desde
    Playwright (`element.getAnimations()[0].currentTime = fracción ×
    duración`) para fijar el ciclo exactamente en 7 puntos (uno por
    fase) y comprobar programáticamente que el estado de las 2 válvulas
    y la etiqueta ISO coinciden con la fisiología esperada en los 7 —
    los 7 casos coincidieron exactamente, incluida la sincronía con la
    etiqueta de fase de texto ya existente (mismo instante, misma
    fase). También se confirmó que el botón de pausa congela los nuevos
    elementos y que reanudar los vuelve a mover.

Toda esta navegación la orquesta `modules/home/index.js`, que crea tres
`createViewSwitcher()` independientes (nivel principal — que ahora incluye
también `especialidades`, `nefrologia`, `uciPapers` y `fisioUci` como
vistas más del mismo switcher raíz —, submenú de Citopenias, submenú de
Trasplante), inicializa el Atlas
(`initAtlas()` de `modules/home/atlas.js`) y conecta los botones. Los
botones "← VOLVER" usan una clase específica según a qué nivel deben
volver: `.btn-volver-especialidades`, `.btn-volver-home`,
`.btn-volver-citopenias-menu`, `.btn-volver-trasplante-menu`,
`.btn-volver-fuci-menu`. Las
calculadoras en sí (Escalas Generales, Neutropenia Febril) no saben nada de
estos niveles superiores ni del Atlas — siguen inicializándose igual que
siempre, solo cambia qué contenedor está visible.

`modules/fuentes/` sigue siendo la excepción: es una categoría **solo de
contenido**, sin `.js`, montada como acordeón (no como vista de pantalla
completa) directamente debajo del menú principal de Hematología en
`index.html`. El botón
de acordeón "FUENTES Y EVIDENCIA" lo detecta automáticamente
`core/accordion.js` sin necesidad de registrarlo en ningún sitio. Este es el
patrón a seguir para cualquier categoría nueva que sea puramente
informativa y no necesite entrar en el menú principal de 4 opciones.

## Carpeta `docs/`

`docs/seimc-sehh-2020-neutropenia-febril.pdf` es el PDF completo (148 págs.,
incluida la bibliografía completa de 346 referencias)
del documento de consenso SEIMC-SEHH del que sale todo el contenido clínico
de "Neutropenias Febriles". La sección "Fuentes y Evidencia" enlaza a
páginas concretas de este PDF con fragmentos `#page=N` (N = página impresa
del documento − 2, porque las 2 primeras páginas —portada e índice— no
forman parte del PDF). Si en el futuro se añade contenido basado en otro
documento, súbelo también a `docs/` y enlázalo de la misma forma: es
preferible a enlazar a una URL externa, porque no depende de que esa URL
siga viva ni de tener acceso a internet para comprobarla.

## Apartados desplegables: `.micro-prof-item`

El componente `.micro-profiles` / `.micro-prof-item` (definido en
`css/components.css`) es el acordeón que se usa en toda la app para listas
de perfiles/causas/pruebas dentro de una pestaña (ej. "3 patrones
específicos de infiltrado en LMA", "Factores asociados a mayor
mortalidad"). Se usa en `reconocimiento.html`, `sindromes.html`/`cid.js`,
y en `trasplante/*.html`/`*.js` (algunos módulos generan estos bloques por
JS con template strings, no solo HTML estático — si tocas este componente,
busca `micro-prof-item` en **todo** `js/`, no solo en los `.html`).

Cada item sigue este patrón:

```html
<div class="micro-prof-item">
    <div class="micro-prof-head" onclick="this.classList.toggle('open'); this.nextElementSibling.classList.toggle('active')">
        <span>🫁 Título</span> <span class="toggle-icon">+</span>
    </div>
    <div class="micro-prof-body">...</div>
</div>
```

El borde izquierdo de cada item y el color de sus `<strong>` internos usan
`--item-color`, que rota automáticamente entre los 4 colores de acento
según la posición del item dentro de `.micro-profiles` (vía `:nth-child`)
— no hace falta asignarlo a mano. Dentro de `.micro-prof-body`, en vez de
un párrafo corrido, usa el patrón que mejor encaje con el contenido real
(nunca resumas ni quites contenido, solo reestructúralo):

- **Campos con etiqueta** (Contexto/Mecanismo/Manejo, Patrón/Diagnóstico,
  etc.): un `<dl class="kv-row">` por campo, con `<dt>` la etiqueta y
  `<dd>` el texto — se pinta como fila apilada con la etiqueta en
  mayúsculas del color del item, en vez de "Etiqueta: texto" corrido.
- **Listas de términos sueltos** (antes unidas con "·" en un párrafo): un
  `<ul class="term-chips">` con un `<li>` por término — se pintan como
  píldoras en vez de texto corrido.
- **Prosa narrativa real** (perfiles de enfermedad, viñetas clínicas): se
  deja como párrafo normal, pero con `<strong>` en los 2-4 términos/cifras
  realmente clave de cada frase — el color ya lo pone la regla
  `.micro-prof-body strong { color: var(--item-color) }`, no hace falta
  poner `style="color:..."` a mano.

## Convención de un módulo de calculadora

Cada archivo `<calculadora>.js` sigue siempre esta forma:

```js
function calcAlgo() {
    // lee inputs del DOM, calcula, escribe el resultado en el DOM
}

export function init() {
    // engancha los listeners (change/input/click) de ESTA calculadora
    document.querySelectorAll('.algo-input').forEach(e =>
        e.addEventListener('change', calcAlgo));
    calcAlgo(); // pinta el resultado inicial al cargar
}
```

El `index.js` de la categoría importa el `init` de cada archivo y los llama
todos. `js/main.js` llama al `init` de cada categoría después de que el HTML
ya esté inyectado en el DOM (por eso `init()` nunca se ejecuta antes de que
existan los elementos que busca).

## Cómo añadir una escala/calculadora nueva

1. Si es una categoría clínica nueva: crea `js/modules/<categoria>/`.
   Si es una escala más dentro de una categoría existente, sáltate este paso.
2. Crea `<calculadora>.html` con el marcado (usa las clases ya existentes en
   `components.css`: `.card`, `.form-group`, `.checkbox-label`,
   `.result-box`, etc. — casi nunca hace falta CSS nuevo).
3. Crea `<calculadora>.js` siguiendo la convención de arriba.
4. Añade un `<div data-include="js/modules/<categoria>/<calculadora>.html">`
   en `index.html` (o inclúyelo dentro del `.html` de la vista que lo
   contenga, si esa categoría ya agrupa varias tarjetas en un solo partial).
5. Registra el `init` de la nueva calculadora en el `index.js` de su
   categoría.
6. Si es una categoría nueva, añade su import + llamada en `js/main.js`.

## Flujo de git: mergear siempre a `main`

El usuario ha pedido explícitamente ("siempre mergea a main") que cada
tanda de commits en la rama de trabajo (`claude/medical-app-restructure-5xv3qn`)
se lleve también a `main` y se suba, sin esperar a que lo pida cada vez —
es una autorización estándar para este repo, no puntual. Tras dejar
committeado y pusheado el trabajo en la rama:

```
git checkout main
git merge --ff-only origin/claude/medical-app-restructure-5xv3qn
git push origin main
git checkout claude/medical-app-restructure-5xv3qn   # volver a la rama de trabajo
```

Si el fast-forward falla (`main` tiene commits que la rama no tiene), no
forzar nada por cuenta propia — avisar al usuario en vez de reescribir
historia. Al cambiar de rama reaparece a veces el drift de
`.gitignore`/`.ignore` documentado en la nota de graft más abajo — se
arregla igual, con `git checkout -- .gitignore .ignore` antes de comitear
o mergear cualquier cosa.

## Cómo probar cambios

No hay build. Para ver la app:

```
python3 -m http.server 8000     # desde la raíz del repo
```

y abrir `http://localhost:8000/`. Abrir el archivo directamente con
`file://` NO funciona porque `fetch()` de los partials HTML requiere
servirse por http. El despliegue real es GitHub Pages, que ya sirve por
https sin que haya que hacer nada extra.

### Cache-busting de CSS/JS

Los `<link rel="stylesheet">` y el `<script type="module" src="js/main.js">`
de `index.html` llevan un parámetro `?v=YYYYMMDD` (fecha de hoy). Existe
porque GitHub Pages/los navegadores móviles cachean agresivamente
`css/*.css` y `js/main.js` por su URL exacta: si solo cambia el contenido
del archivo pero no su URL, un usuario que ya visitó la app antes puede
seguir viendo el CSS/JS viejo aunque `index.html` sí se recargue (esto
pasó de verdad: tras desplegar el Atlas Hematológico, la maquetación se
veía completamente rota — vista sin estilos, todas las pantallas
apiladas — en un móvil que tenía cacheado el `components.css` anterior).
**Si tu cambio toca cualquier archivo `.css` o `js/main.js`, actualiza esa
fecha a la de hoy antes de hacer commit**, para forzar a que se descargue
de nuevo. Los demás módulos `.js` (importados vía ES modules desde
`main.js`) no llevan este parámetro — si en el futuro se detecta el mismo
problema con un módulo concreto, aplica el mismo patrón a su import. Si
haces **más de un despliegue el mismo día** que toque CSS/`main.js`, la
fecha sola no basta (ya está "hoy" desde el primer despliegue): añade un
sufijo, p. ej. `?v=20260805-2`, para que el segundo despliegue también
fuerce la descarga.

## Idioma

Todo el contenido clínico y los comentarios de código están en español,
igual que el resto del repo — mantenlo así.
