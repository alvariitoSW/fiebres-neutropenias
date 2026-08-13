# HUD Clínico UCI — guía para trabajar en este repo

App web de estratificación de riesgo clínico y apoyo a la decisión en UCI,
organizada por especialidad. Hoy tiene contenido completo de **Hematología**
(manejo de citopenias, reconocimiento temprano del paciente hematológico,
síndromes urgentes, trasplante de progenitores, más un acceso directo a
escalas generales de UCI) y un espacio reservado para **Nefrología**
(en preparación). Está pensada para ir creciendo con más especialidades
(cardiología, radiología, etc.) según se vaya aportando contenido. Es una
herramienta de apoyo para médicos, pensada para consultarse a pie de cama
en el móvil.

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

Toda esta navegación la orquesta `modules/home/index.js`, que crea tres
`createViewSwitcher()` independientes (nivel principal — que ahora incluye
también `especialidades` y `nefrologia` como vistas más del mismo switcher
raíz —, submenú de Citopenias, submenú de Trasplante), inicializa el Atlas
(`initAtlas()` de `modules/home/atlas.js`) y conecta los botones. Los
botones "← VOLVER" usan una clase específica según a qué nivel deben
volver: `.btn-volver-especialidades`, `.btn-volver-home`,
`.btn-volver-citopenias-menu`, `.btn-volver-trasplante-menu`. Las
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
