# Historial · Menú raíz (puertas, PIF), Constelación y buscador global

> Texto movido tal cual desde el antiguo `CLAUDE.md` (octubre 2026). Es la historia de cómo se construyó
> esta parte: decisiones, fuentes, auditorías y verificaciones. Las reglas vigentes están en `CLAUDE.md`.

## Rediseño del menú raíz: hero-tiles + 4 puertas de entrada (PIF, Fisiopatología UCI, UCI/Papers Tuiter, Sobrevivir a la UMI)

> Desde octubre de 2026 hay una **5.ª puerta, «Eco cardíaca»** (acceso directo al simulador, que también vive
> dentro del grupo Fisiopatología UCI): ver «Circulación viva y Eco cardíaca» más abajo.
> Y una **6.ª puerta, «Libros»** (índice central de los libros de texto): ver «Libros» más arriba.

A petición explícita del usuario ("Quiero un rediseño del menú principal"),
se rediseñó visualmente el menú de "Especialidades" y, en el mismo pedido,
se reagrupó su información: de una lista plana de 7 botones
(`.accordion-btn.nav-btn`, uno por especialidad) a **4 hero-tiles**, cada
una una "puerta de entrada" que puede agrupar varias especialidades. Antes
de tocar código se exploraron varias direcciones visuales completas con el
tipo Artifact "Design" (`/design`/`/dataviz`, mismo método ya usado en
otros rediseños de la app — ver el rediseño del cuaderno de campo más
arriba): 3 direcciones iniciales (variaciones de "lista/gráfico con brillo
HUD") fueron rechazadas explícitamente por el usuario ("No me gusta ninguno,
reinventate"); una 2ª ronda con conceptos genuinamente distintos llevó a la
aprobación de la dirección "Bento de mando" (rejilla de tarjetas grandes),
de la que se generaron varias variantes; el usuario aprobó fusionar 2 de
ellas — una más pulida (bordes finos, brillo de cristal, chevron de
afordancia) con otra tipo póster (icono grande semi-opaco de protagonista,
degradado de scrim, título superpuesto) — y en el mismo mensaje pidió la
reagrupación de especialidades detallada abajo.

- **Las 4 puertas raíz** (`#especialidades-view`, ahora con la clase nueva
  `.especialidad-tile` en vez de `.accordion-btn.nav-btn`): **PIF**
  (Hematología + Nefrología), **Fisiopatología UCI** (grupo combinado:
  Cardiología + Neumología + Fisiopatología UCI — nombre confirmado
  explícitamente por el usuario, sustituyendo el provisional
  "Cardiorrespiratorio" con el que arrancó este menú; los ids/switcher
  internos siguen llamándose `cardiorrespi*` a propósito, solo cambió el
  texto visible en `index.html` y aquí), **UCI / Papers Tuiter** y
  **Sobrevivir a la UMI** — estas 2 últimas sin cambio de agrupación,
  siguen siendo puertas directas sin nivel intermedio, solo con el nuevo
  tratamiento visual.
  - **Colisión de nombre deliberada, a petición explícita del usuario**:
    el grupo raíz "Fisiopatología UCI" contiene, como una de sus 3
    tiles internas, la propia especialidad "Fisiopatología UCI" (el
    bloque de capítulos de El Libro Azul) — el mismo nombre en 2 niveles
    de navegación distintos. Se implementó tal cual se pidió, sin
    "corregirlo" por criterio propio (p. ej. renombrando la tile interna).
    Si en el futuro se reporta confusión real de navegación por esto,
    la vía más simple es matizar solo la tile interna (p. ej. "Fisiopatología
    UCI — El Libro Azul", ya insinuado en su `especialidad-tile-desc`),
    nunca el nombre del grupo raíz sin que el usuario lo pida.
  - **De dónde sale el nombre "PIF"**, a petición explícita del usuario de
    darle contexto ("ahora quiero darle contexto a lo de pif"). PIF =
    **Plan Individualizado de Formación** (PFI-UMI-R1-01, Rev. 1/Junio
    2016, Servicio Canario de la Salud — HUGCDN, Unidad Docente de
    Medicina Intensiva): el documento oficial de la Comisión de Docencia
    que planifica, rotación a rotación, los objetivos teórico-prácticos
    que debe cumplir un médico residente durante cada año de su
    especialidad. Medicina Intensiva son **5 años de residencia (R1-R5)**,
    y el usuario, como residente R1, **hoy solo tiene el documento del
    primer año (R1)** — los de R2-R5 llegarán en el futuro, cada uno con
    sus propias rotaciones/objetivos nuevos.
    - **El grupo "PIF" del menú raíz corresponde, en sentido estricto, a
      las rotaciones reales de ESTE documento R1** — no es un nombre
      genérico de conveniencia. El documento R1 define 9 rotaciones a lo
      largo del año (junio 2026-mayo 2027), cada una con su lista de
      objetivos teóricos: **Hematología** (jul 2026 — manejo de citopenias
      con énfasis en neutropenia febril, reconocimiento temprano del
      paciente hematológico crítico, transfusión de hemoderivados,
      síndromes urgentes —lisis tumoral/CID/PTT—, introducción a
      trasplante de progenitores, contacto inicial con CAR-T/CRS/ICANS),
      **Nefrología** (ago 2026 — fisiopatología renal, HTA, IRA/ERC,
      equilibrio hidroelectrolítico-ácido base, nefrotoxicidad, TRR),
      **Radiología, sección de tórax** (sep 2026 — semiología Rx tórax,
      patrones, técnicas UMI —IOT/VVC/SNG/drenajes— y sus complicaciones,
      ecografía torácica, introducción a TC/TCAR), **Neuro-Radiología**
      (oct 2026 — técnicas radiológicas, ACV isquémico vs. hemorrágico,
      HTIC, hematoma epidural/subdural, hipoxia cerebral, catéteres
      intracraneales, HSA por imagen), **Cardiología** (nov-dic 2026 —
      historia clínica cardiológica, IC aguda, EKG/arritmias, SCA,
      endocarditis/pericarditis/miocarditis, ecocardiografía/cateterismo
      básicos), **Medicina Interna** (ene-feb 2027 — historia clínica y
      exploración completas, hipótesis de trabajo/plan terapéutico,
      rotación en Infecciosas, signos de gravedad y reanimación inicial
      del paciente séptico en planta), **U. Infecciosas** (mar 2027 —
      mismos objetivos base de historia clínica/exploración/sepsis, ya
      solapados con los de Medicina Interna en el propio documento),
      **Neurología** (abr 2027 — historia/exploración neurológica, código
      ictus, punción lumbar, deterioro del nivel de consciencia, patología
      neurológica con afectación respiratoria —miastenia gravis, Guillain-
      Barré—, meningitis, crisis comiciales/estado postcrítico), y
      **Neumología** (may-jun 2027 — insuficiencia respiratoria aguda,
      neumonía comunitaria/nosocomial, fisiopatología del intercambio
      gaseoso, patología respiratoria crónica, TEP no complicado, pruebas
      funcionales respiratorias, VMNI básica). El documento incluye
      además una lista transversal de **conocimientos prácticos/
      habilidades** (sistemas Drago/PISCIS, monitorización hemodinámica,
      EKG, drenaje ventricular, ecocardiografía/cateterismo, IOT/VVC/
      catéter arterial durante la rotación en Anestesia, punción lumbar,
      gasometrías, fibrobroncoscopia, VMNI, suturas, RCP básica) sin
      rotación asignada, y detalles puramente administrativos (guardias
      5-6/mes en Urgencias+UMI, sesiones clínicas, entrevistas tutor-
      residente) que no son contenido clínico y no se trasladan a la app.
    - **Solo 2 de las 9 rotaciones de R1 tienen ya contenido real en la
      app** (Hematología y Nefrología, ambas construidas antes de que se
      diera este contexto explícito — ya cubrían de hecho casi todos los
      objetivos reales del documento, confirmado al leerlo). Las 7
      restantes (Radiología-tórax, Neuro-Radiología, Cardiología —como
      rotación PIF, distinta de la especialidad "Cardiología" ya
      existente en el grupo "Fisiopatología UCI", que es guías de manejo
      sin relación con este documento—, Medicina Interna, Infecciosas,
      Neurología, Neumología) son candidatas naturales a ampliar el
      grupo "PIF" en el futuro, según vaya llegando el resto de la
      rotación R1 y, más adelante, los documentos de R2-R5 — mismo
      criterio de siempre: nunca fabricar contenido clínico sin una
      fuente real que el usuario aporte primero.
    - **El resto de la app (UCI/Papers Tuiter, Fisiopatología UCI,
      Cardiología/Neumología como especialidades de guías de manejo, y
      Sobrevivir a la UMI) NO está atado a este documento PIF** — son la
      visión más amplia del proyecto, explícita ya en la primera línea de
      este mismo `CLAUDE.md` ("herramienta de apoyo para médicos... para
      ir creciendo con más especialidades según se vaya aportando
      contenido"): una gran biblioteca de autoayuda al estudio, construida
      con Claude Code, donde cada pieza de contenido queda siempre
      trazable a su bibliografía real (PDF en `docs/`, con
      `.biblio-link`/`#page=N`) para poder auditarla y actualizarla con el
      tiempo — no una app que solo cubre el temario formal de la
      residencia, sino una que crece con cualquier fuente clínica que el
      usuario aporte, PIF incluido como una fuente más entre otras.
  - **`#pif-menu-view` rediseñado como "manifiesto de rotación" — dossier
    clínico, no un mapa/atlas**, a petición explícita del usuario tras
    pedir primero un `/dataviz` de las 9 rotaciones y un `/design` de todo
    el flujo ("para yo saber que subir y a donde cuando esté en la
    rotación, sin consultar mil veces el documento"). **3 rondas de
    exploración visual con el tipo Artifact "Design"** antes de tocar
    código — mismo método ya establecido en el proyecto —, las 2 primeras
    rechazadas explícitamente por el usuario: v1 (nodos redondeados con
    halo, iconos SVG orgánicos, mismo lenguaje que el Atlas/mapa del
    riñón) "parece hecha por un niño"; v2, pedida como corrección hacia
    "programador norcoreano" (tipografía monospace, bordes rectos, estados
    en corchetes `[OK]`/`[HOY]`/`[----]`, sin color), rechazada con más
    fuerza aún ("esto es mucho peor") — confirmado con `AskUserQuestion`
    que el problema concreto eran los corchetes tipo log, y que la
    dirección real era un **"dossier clínico serio"**: tipografía con peso
    real (la misma serif de siempre, nunca monospace), alto contraste,
    cero decoración — como una ficha hospitalaria impresa, autoritario
    pero legible. v3 (aprobada) es la que se implementó.
  - **Arquitectura pensada desde el principio para R2-R5**, la 2ª mitad
    explícita del encargo ("¿y qué pasa cuando sea R2? ¿o R3?") — nunca
    hardcodeada a las 9 rotaciones de R1. `js/data/pif-rotaciones.js`
    exporta `rotacionesPif = { R1: [...9 rotaciones reales...], R2: [],
    R3: [], R4: [], R5: [] }` — datos puros, sin DOM, mismo criterio que
    el resto de `js/data/`. Cada rotación lleva `id`/`nombre`/`periodo`
    (texto) + `inicio`/`fin` (fechas ISO reales, para calcular la
    rotación "actual") + `objetivos` (array, extraídos literalmente del
    documento PIF-R1-01) + `construido` (booleano, a mano, como el resto
    de la app — nunca inferido) +, solo en las 2 construidas,
    `destino.botonId` (el `id` real de `#btn-hematologia`/
    `#btn-nefrologia`) +, en 2 pendientes con solapamiento real de
    contenido (Cardiología/Neumología como rotación PIF), un `nota` de
    texto señalando que ya existe contenido más amplio en otra
    especialidad que no sustituye este objetivo concreto — nunca un link
    clicable (para no arriesgar el mismo bug de `.tx-link` ya documentado
    varias veces en este archivo).
  - **`js/modules/home/pif-manifiesto.js`** (`initPifManifiesto()`) es el
    único componente que sabe generar HTML a partir de esos datos —
    pestañas `R1..R5` (`#pif-year-tabs`), y el contenido
    (`#pif-manifiesto-contenido`): si `rotacionesPif[año]` está vacío
    (R2-R5, hoy) pinta un estado **"Sin expediente"** genérico, sin ningún
    caso especial por año; si tiene datos, pinta una barra de marcas (una
    por rotación, verde=construida/dorado=actual/tenue=pendiente), el
    aviso "Rotación actual" (o nada, si hoy cae fuera de cualquier rango
    — no fuerza un resultado) y una entrada numerada por rotación
    (nombre, periodo, "Estado: Construida/En curso (hoy)/Pendiente" en
    texto plano coloreado — nunca una pastilla/badge — objetivos con
    guion largo, y en las pendientes un botón "Ver N objetivos más" que
    revela el resto con delegación de eventos). **La "rotación actual" se
    calcula en cada carga comparando `new Date()` contra `inicio`/`fin`
    de cada rotación** (`hoyEnRango()`) — nunca escrita a mano, así que
    sigue siendo correcta sin tocar código mes a mes.
  - **Truco de wiring para no duplicar botones ni reenviar clics**: las 2
    rotaciones construidas renderizan su botón "Abrir X →" con el mismo
    `id` que ya tenían las tiles antiguas (`id="btn-hematologia"`/
    `id="btn-nefrologia"`) — como `initPifManifiesto()` se llama como
    **primera línea** de `home/index.js`'s `init()`, antes de que esa
    misma función haga
    `document.getElementById('btn-hematologia').addEventListener(...)`,
    el botón ya existe en el DOM con ese `id` en el momento en que se
    engancha el listener real (`goHome()`/`nefrologiaApi?.volverAlMapa()`)
    — lo hereda gratis, sin un segundo botón oculto ni un
    `document.getElementById(...).click()` de reenvío.
  - **La tile PIF de la raíz mantuvo su estilo póster** (`.especialidad-tile`,
    icono/scrim/eyebrow, igual que sus 3 tiles hermanas) — deliberadamente
    NO se le aplicó el rediseño de dossier plano, para no romper la
    consistencia visual del grid de 4 puertas de entrada; solo ganó un
    dato nuevo, un `.especialidad-tile-badge` (`#pif-tile-badge`, misma
    clase ya usada por la tile de UCI/Papers Tuiter) que
    `initPifManifiesto()` rellena con "N/9 rotaciones construidas · ahora:
    <rotación>" — mismo cálculo `hoyEnRango()`, sin duplicar lógica.
  - Verificado con Playwright: la tile PIF muestra el badge correcto
    ("2/9 rotaciones construidas · ahora: Radiología — sección de
    tórax"); dentro del manifiesto, R1 arranca activo con sus 9 entradas,
    la barra de progreso dice "2 de 9", el aviso "Rotación actual" señala
    Radiología-tórax (fecha real del test, sep 2026); el toggle "Ver 3
    objetivos más" revela los objetivos ocultos y cambia a "Ocultar
    objetivos"; "Abrir Hematología →" dentro del manifiesto deja
    `#home-view` visible y "Abrir Nefrología →" deja `#nefrologia-view`
    visible (mismo comportamiento de siempre, heredado sin duplicar
    listener); la pestaña R2 muestra "Sin expediente" sin ningún error;
    "← VOLVER" regresa a Especialidades; sin overflow horizontal a
    390px; sin errores de consola. Bump de cache-busting a `?v=20260930`
    por el cambio en `components.css`.
- **2 switchers intermedios nuevos**, mismo patrón `createViewSwitcher()`
  ya usado por el resto de menús medios de la app (`nefroLevel`,
  `cardioLevel`...), pero esta vez viviendo dentro del propio `topLevel`
  de `home/index.js` en vez de en un `index.js` de especialidad aparte
  (PIF/Fisiopatología UCI —grupo raíz— no son especialidades con contenido propio,
  son puro agrupamiento de navegación): `pifMenu`
  (`#pif-menu-view`, hoy el manifiesto de rotación — ver más arriba — con
  los botones "Abrir Hematología/Nefrología →" embebidos en sus entradas)
  y
  `cardiorrespiMenu` (`#cardiorrespi-menu-view`, 3 tiles:
  Cardiología/Neumología/Fisiopatología UCI). `btn-pif`/`btn-cardiorrespi`
  en la raíz solo hacen `topLevel.show('pifMenu'/'cardiorrespiMenu')` —
  sin API que inyectar, a diferencia de los botones de especialidad real
  (`btn-nefrologia`, etc.), que sí llaman a `nefrologiaApi?.volverAlMapa()`
  y similares.
- **Los botones de especialidad real no cambiaron de comportamiento**,
  solo de posición: `btn-hematologia`/`btn-nefrologia` viven ahora dentro
  de `#pif-menu-view` y `btn-cardiologia`/`btn-neumologia`/`btn-fisio-uci`
  dentro de `#cardiorrespi-menu-view`, pero sus listeners en
  `home/index.js` son exactamente los mismos de siempre (`goHome()`,
  `nefrologiaApi?.volverAlMapa()`, etc.) — el cambio es solo de qué
  contenedor los envuelve en `index.html`.
- **2 clases de "← VOLVER" nuevas**, mismo patrón ya establecido de una
  clase por nivel de vuelta: `.btn-volver-pif-menu` (en el propio
  `#home-view` de Hematología y en `rinon-menu.html` de Nefrología —
  antes ambos usaban `.btn-volver-especialidades` para volver directo a
  la raíz; ahora vuelven a PIF) y `.btn-volver-cardiorrespi-menu` (en
  `cardiologia-menu.html`, `neumologia-menu.html` y `fisio-uci-menu.html`,
  mismo cambio). `uci-papers-menu.html` y `sobrevivir-umi-menu.html`
  mantienen `.btn-volver-especialidades` sin cambios, porque sus
  especialidades siguen siendo puertas directas. El buscador global
  (`core/search.js`) y `.especialidad-link`/`irAResultadoBusqueda` **no
  se tocaron** — un resultado de búsqueda sigue saltando directo a la
  especialidad real (`topLevel.show('nefrologia')`, etc.), sin pasar por
  el menú intermedio; solo el botón "← VOLVER" propio de esa especialidad
  cambia adónde regresa.
- **`.especialidad-tile`** (`css/components.css`): tarjeta tipo póster
  con icono de tinta semi-opaco arriba, scrim degradado, y
  título/eyebrow/descripción superpuestos abajo — sustituye a
  `.accordion-btn.nav-btn` en las 3 pantallas nuevas/modificadas
  (`#especialidades-view`, `#pif-menu-view`, `#cardiorrespi-menu-view`).
  Cada tile fija su propio acento vía la custom property `--tile-accent`
  (uno de los 5 colores de acento reales de la app, nunca uno nuevo),
  reutilizado por el borde, el scrim de color, la eyebrow, el chevron y
  el badge — mismo patrón `--orb-color`/`--item-color` ya usado por
  `.region-btn` del Atlas y `.micro-prof-item`. Los iconos son SVG de
  tinta dibujados a mano (gota para Hematología, riñón para Nefrología,
  corazón con traza de ECG para Cardiología, pulmones para Neumología,
  doble hélice/onda para Fisiopatología UCI, ave para UCI/Papers Tuiter,
  portapapeles para Sobrevivir a la UMI) — nunca emoji, mismo criterio ya
  aplicado al resto de iconografía "a mano" de la app.
  - **Bug real encontrado y corregido durante la propia verificación con
    Playwright, no presente aún en el mockup del canvas**: el icono de
    riñón copiado literalmente del diseño aprobado (`M26 4 A20 20 0 1 0
    26 44 A11 11 0 0 1 26 4 Z`) usa un segundo arco de radio 11 para la
    distancia entre (26,4) y (26,44) — 40px, más del doble del diámetro
    máximo alcanzable con radio 11 (22px). Un arco SVG con un radio
    matemáticamente insuficiente para sus puntos de destino no es un
    error silencioso: el navegador re-escala el radio hacia arriba lo
    mínimo necesario para que exista solución, lo que en este caso
    convertía el segundo arco en casi un espejo del primero — el riñón
    se colapsaba en una fina "C" casi sin relleno visible, en vez de la
    forma de alubia esperada. Invisible en la vista general del canvas de
    diseño (icono pequeño, dentro de un racimo con otros 2 iconos
    superpuestos), pero evidente al verificar con una captura real de
    Playwright del icono aislado en la implementación de verdad —
    precisamente el tipo de bug que este proyecto ya documenta que
    `.click()` sintético/una revisión superficial pueden dejar pasar.
    Sustituido por un contorno de alubia dibujado con curvas Bézier
    cúbicas (`M27 6 C15 8 10 18 12 26 C14 34 20 42 30 40 C36 38.5 36 32
    31 28 C27 25 27 21 31 18 C36 14 34 8 27 6 Z`), sin arcos — verificado
    de forma aislada en una página de prueba antes de aplicarlo a
    producción, y de nuevo con Playwright en las 2 ubicaciones reales
    (tile raíz de PIF en racimo, tile propia de Nefrología dentro de
    `#pif-menu-view`).
- Verificado con Playwright (viewport 390×844): las 4 tiles de la raíz
  navegan a su destino correcto (PIF/Fisiopatología UCI a su menú
  intermedio, UCI Papers/Sobrevivir UMI directo a su vista, sin cambios);
  dentro de PIF, Hematología abre el Atlas y su "← VOLVER" regresa a PIF
  (no a la raíz); Nefrología abre el mapa del riñón y su "← VOLVER"
  también regresa a PIF; el "← VOLVER" de PIF regresa a la raíz; dentro
  del grupo Fisiopatología UCI, las 3 especialidades abren correctamente
  y sus 3 "← VOLVER" respectivos regresan a ese menú combinado (no a la
  raíz); UCI/Papers Tuiter y Sobrevivir a la UMI siguen funcionando en
  ruta directa sin regresión; sin overflow horizontal a 390px en ninguna
  de las 3 pantallas nuevas/modificadas; sin errores de consola ni de
  página reales (el único 404 es el `favicon.ico`, ya documentado como
  inocuo). Bump de cache-busting a `?v=20260929-3` (cambian
  `css/components.css`, `index.html`, `js/main.js` vía el import de
  `home/index.js`).
- **Renombrado el grupo raíz de "Cardiorrespiratorio" (provisional) a
  "Fisiopatología UCI"**, a petición explícita del usuario — solo texto
  visible (`index.html`, 2 sitios: la tile raíz y la cabecera del menú
  intermedio) y comentarios de `home/index.js`; los ids/switcher internos
  (`btn-cardiorrespi`, `cardiorrespiMenu`, `#cardiorrespi-menu-view`,
  `.btn-volver-cardiorrespi-menu`) se dejaron sin tocar a propósito —
  son identificadores internos, renombrarlos no aporta nada y solo
  arriesga romper algo. Ver la colisión de nombre deliberada documentada
  más arriba. La ampliación futura de Sobrevivir a la UMI con más
  contenido del manual y cross-links reales hacia Merino (Cardiología/
  Neumología/Hematología) sigue explícitamente aplazada, tal y como pidió
  el usuario en su momento — hasta que se pida (ver el bloque de diseño
  nuevo más abajo, donde sí se abordó).

`modules/fuentes/` sigue siendo la excepción: es una categoría **solo de
contenido**, sin `.js`, montada como acordeón (no como vista de pantalla
completa) directamente debajo del menú principal de Hematología en
`index.html`. El botón
de acordeón "FUENTES Y EVIDENCIA" lo detecta automáticamente
`core/accordion.js` sin necesidad de registrarlo en ningún sitio. Este es el
patrón a seguir para cualquier categoría nueva que sea puramente
informativa y no necesite entrar en el menú principal de 4 opciones.


## Rediseño "Constelación" de los 4 submenús planos + buscador global

A petición explícita del usuario ("Quiero dar una vuelta de tuerca al
diseño visual de la app, menos a la parte de hemato y de nefro que más o
menos están completadas" → tras ver 3 direcciones de `/design`, eligió la
B: "Me gusta más el B, y a partir de ese modelo hacer otro /design para
mejorar la interfaz visual. Además estaría bien que se agrupase los
estudios de tuiter por temas... Incluso poder añadir un buscador... para
buscar en toda la app" → tras ver el refinamiento: "Me gusta, pásalo a
código"), se aplicó un rediseño visual a los 4 submenús de especialidad que
seguían siendo una lista plana de botones (`.accordion-btn.nav-btn`) —
**deliberadamente excluidos Hematología (Atlas) y Nefrología (mapa del
riñón)**, que ya tienen su propio tratamiento visual rico — más un
buscador global nuevo, transversal a toda la app.

- **Patrón "Constelación"** (`.constellation` en `css/components.css`,
  bloque nuevo insertado tras `.siguiente-ficha-btn`): extiende el
  lenguaje visual ya establecido por el Atlas Hematológico/mapa del riñón
  (nodos circulares con halo de color) pero en formato de lista vertical
  en vez de mapa posicionado por `%` — pensado para listas de 1-6 guías/
  papers sin el volumen de contenido que justificaría un mapa de zonas
  propio. Estructura: un `<div class="constellation" style="--const-accent:
  var(--accent-X)">` (la variable fija el tono de la "columna vertebral"
  punteada que dibuja `.constellation::before`) con uno o más
  `.const-group` (cada uno con su `.const-group-tag`, una píldora de
  color propio vía `--tag-color`, para agrupar temáticamente), y dentro
  de cada grupo uno o más `.const-node` — un `<button>` reseteado
  (`display:flex`, sin fondo/borde propio) con un `.const-orb` (círculo de
  54px con color/halo propios vía `--orb-color`/`--orb-glow`, hover/active
  con `transform:scale()`) y un `.const-card` (`display:block`, contiene
  `.const-title`/`.const-desc`/`.const-tag`, los 3 con `display:block`
  explícito — **necesario** porque viven como `<span>` anidados dentro de
  un `<button>` y sin `display:block` se apelmazan en una sola línea
  corrida en vez de apilarse título/descripción/etiqueta, bug real
  detectado por comparación de captura contra el mockup aprobado y
  corregido antes de dar el componente por bueno).
- **Aplicado a los 4 submenús**, cada uno conservando exactamente los
  mismos `id` de botón de siempre (la Constelación es solo el envoltorio
  visual — ningún JS de ningún módulo tuvo que tocarse):
  `uci-papers-menu.html` (`--const-accent: var(--accent-purple)`, **4
  grupos temáticos nuevos** — "Shock y hemodinamia" rojo/"Cardiorrenal y
  congestión venosa" dorado/"Vía aérea y respiratorio" verde/"Renal-TRR"
  púrpura — agrupando los 6 papers por afinidad clínica en vez de la lista
  plana anterior, la parte explícitamente pedida de "agrupar los estudios
  de tuiter por temas, para buscarlos mejor"), `fisio-uci-menu.html`
  (`--const-accent: var(--accent-yellow)`, 4 nodos sin agrupar, cada uno
  con su color de acento ya usado en el resto de la app), `cardiologia-menu.html`
  (`--const-accent: var(--accent-blue)`, 2 nodos) y `neumologia-menu.html`
  (`--const-accent: var(--accent-blue)`, 1 nodo).
- **Cabecera reestructurada de 1 a 2 filas** (`css/base.css`,
  `.header-row`): al añadir el 3er botón de esquina (`🔍 Buscar`, ver
  buscador global abajo) junto a los 2 ya existentes (`⚡ Escalas`/
  `🍅 Estudio`), la fila única `justify-content:space-between` original
  apretaba el título "HUD CLÍNICO UCI" hasta partirlo en 2-3 líneas rotas
  a 390px — detectado con captura de Playwright antes de darlo por bueno,
  un riesgo ya anticipado explícitamente al planificar el cambio. Un
  primer intento de arreglo (solo encoger `font-size`/`letter-spacing` del
  título) mejoró pero no resolvió el problema del todo — sustituido por
  la solución real: `.header-row` pasó a `flex-direction:column` (título
  arriba a ancho completo, sin apretarse contra nada) con una fila nueva
  `.header-actions` (`flex-wrap:wrap; justify-content:center`) debajo
  para los 3 botones — los 3 conservan sus mismos `id`, sin tocar ningún
  listener.
- **Buscador global** (`js/core/search.js`, módulo nuevo, `initSearch({
  navegar })`, llamado una única vez desde `js/main.js` al final de
  `start()`, mismo patrón "se inicializa una sola vez y funciona en toda
  la app" que `core/corkboard.js`/`core/lightbox.js`/`core/pomodoro.js`):
  - **Índice construido en runtime, no a mano**: recorre todos los
    `.field-card[data-tab]` ya presentes en el DOM (todas las fichas de
    todas las especialidades cargan desde el arranque vía `data-include`,
    aunque estén ocultas — mismo hecho ya explotado por
    `core/pomodoro.js`), y para cada una resuelve su `.tab-content` por
    `id`, su panel contenedor real (`.closest('[id^="panel-"]')` — técnica
    fiable porque los 25 paneles de cuaderno de campo de la app siguen sin
    excepción la convención `panel-*-tabs`) y su título (`.field-name`,
    reutilizando el mismo helper de limpieza de `<br>`/tags que
    `core/corkboard.js` usa internamente, duplicado aquí en vez de
    exportado para no acoplar los dos módulos).
  - **`PANEL_NAV`, la tabla de rutas — construida a mano leyendo el código
    real, nunca inferida**: mapea cada uno de los 25 `panel-*-tabs`
    conocidos a `{ especialidad, view, trasplante?, bloque }` —
    `especialidad` + `view` son las claves reales que ya acepta
    `irAResultadoBusqueda`/cada switcher medio de especialidad, `trasplante`
    solo existe para los 3 paneles de Trasplante de Hematología (que tienen
    un 3er nivel de switcher interno), y `bloque` es el texto legible que
    se muestra como "breadcrumb" bajo el título de cada resultado.
    Construida cruzando cada `initCorkboard(boardId, panelId)` real (grep
    en todo `js/`) contra los `createViewSwitcher(...)` reales de cada
    `index.js` de especialidad — nunca adivinada, para no arriesgar un
    resultado de búsqueda que aterrice en un sitio roto o vacío.
  - **Búsqueda por texto simple, con scoring**: substring case-insensitive
    sobre el título (peso 2) y sobre el `textContent` completo de la ficha
    (peso 1), ordenado por score descendente, tope 40 resultados,
    agrupados por especialidad en el orden fijo del menú raíz. Mínimo 2
    caracteres antes de buscar (por debajo, un hint en vez de "sin
    resultados").
  - **Navegación reutiliza el router ya generalizado, no uno nuevo**: el
    click de un resultado llama a `navegar({ especialidad, view,
    trasplante, panel, tab })`, que es literalmente `irAResultadoBusqueda`
    — la misma función que ya resuelve los botones `.especialidad-link`
    (ver "Segundo informe: mapa de solapamiento con Nefrología..." en
    Vías Urinarias) — inyectada como callback desde `main.js`
    (`initSearch({ navegar: homeApi?.irAResultadoBusqueda })`) en vez de
    duplicar lógica de navegación dentro de `search.js`.
    `irAResultadoBusqueda` ganó un caso nuevo, `especialidad === 'home'`
    (antes nunca hacía falta enrutar DE VUELTA a Hematología desde fuera,
    solo salir de ella) — `topLevel.show(view)` + `trasplanteLevel.show(
    trasplante)` opcional + `openCorkboardTopic(panel, tab)`, mismo patrón
    que los otros 5 casos ya existentes (ahora reescritos para compartir
    esta misma función en vez de tener su propia copia del switch).
    `home/index.js` `init()` ahora devuelve `{ irAResultadoBusqueda }`
    (antes no devolvía nada), y `main.js` guarda ese valor
    (`const homeApi = home.init()`) para pasárselo a `initSearch`.
  - **Alcance v1, deliberado y documentado en la cabecera del propio
    archivo**: solo indexa fichas del patrón cuaderno de campo
    (`.field-card`), que es donde vive la inmensa mayoría del contenido
    teórico de la app — quedan fuera las calculadoras/tablas de
    referencia sueltas sin ese patrón (Escalas Generales, Neutropenia
    Febril, la tabla de 585 fármacos de Nefrotoxicidad, la guía
    transversal IRA/ERC). Ampliar el alcance a esas páginas es un paso
    aparte, no solo añadir entradas a `PANEL_NAV`.
  - **UI**: overlay (`#btn-buscar-global` en la cabecera lo abre) con
    campo de texto autofocado, cierre por botón/click fuera/Esc,
    resultados agrupados por especialidad con icono+color propios de cada
    una (mismos 4-6 colores de acento ya establecidos), cada fila un
    `<button>` real (nunca un `<a>` ni un `<div>` con `onclick`, para
    accesibilidad de teclado).
  - Verificado con Playwright (viewport 390×844): el overlay abre/cierra
    (botón, click fuera, Esc); la query "citrato" devuelve 12 resultados
    en 3 especialidades (Hematología/Nefrología/UCI Papers Tuiter,
    incluidas las 5 fichas propias del paper de citrato); "trasplante"
    devuelve 40 resultados en 5 especialidades; clicar un resultado cierra
    el overlay y dejar la ficha de destino con `.active` real y visible
    (confirmado con `offsetParent !== null`, no solo la clase) — probado
    explícitamente con un resultado de Hematología (`cart-indicaciones`,
    el caso nuevo `especialidad:'home'`, nunca antes ejercitado) navegando
    Especialidades→Hematología→Trasplante→CAR-T con la ficha abierta y
    con scroll hasta ella; consulta de 1 carácter muestra el hint en vez
    de resultados; sin overflow horizontal a 390px con el overlay abierto;
    sin errores de consola ni de página en ningún punto. Bump de
    cache-busting a `?v=20260915` (cambian `css/components.css`,
    `css/base.css`, `index.html`, `js/main.js`).

