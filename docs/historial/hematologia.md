# Historial · Hematología (Atlas, citopenias, reconocimiento, síndromes urgentes, trasplante, Merino HEMATO, escalas generales) y sus auditorías

> Texto movido tal cual desde el antiguo `CLAUDE.md` (octubre 2026). Es la historia de cómo se construyó
> esta parte: decisiones, fuentes, auditorías y verificaciones. Las reglas vigentes están en `CLAUDE.md`.

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
  `.vessel-line` que conecta los nodos) de fondo, con 5 `.region-btn`
  posicionados encima (vía `left`/`top` en `%` + `transform:
  translate(-50%,-50%)`, sin JS de animación): Manejo Citopenias,
  Reconocimiento Temprano, Síndromes Urgentes, Trasplante TPH y Merino
  HEMATO (ver punto 5 más abajo). Cada nodo con `data-zone="..."` lleva a
  una pantalla de zona; los 2 nodos que no tienen zona intermedia
  (Reconocimiento y Merino HEMATO) llevan `data-route="..."` directamente
  a su vista.
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
  (`atlas.reset()`), para que las 5 regiones estén siempre a un toque tras
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
   - **Rediseño táctil de `.back-cta`, a petición explícita del usuario**
     ("muchas veces en el móvil no puedo clickar bien. Y no puedo acceder
     al contenido"). Bug real de zona de toque, presente en las **25**
     páginas que usan este patrón desde que arrancó (no solo aquí): el
     `.card-face.back` es un `flex-direction:column` con
     `align-items:center`, así que `.back-cta` (antes solo texto, 0.6rem,
     sin `min-height` ni ancho propio) se encogía al tamaño de su propio
     texto y quedaba centrado — su zona de toque real era una tira
     diminuta en el medio de la cara trasera, no la ficha entera. Fallar
     ese toque (fácil en móvil) no abría nada: el toque caía sobre el
     resto de la cara trasera, que vuelve a voltear la ficha en vez de
     abrir el contenido — exactamente el síntoma reportado. Corregido
     una sola vez en `css/components.css` (`.back-cta` con
     `align-self: stretch`, franja de ancho completo pegada al borde
     inferior de la ficha vía márgenes negativos que cancelan el padding
     de `.card-face.back`, `min-height: 44px` — el mínimo táctil
     recomendado —, fondo/borde propios para que se vea como un botón
     real en vez de una línea de texto) — se propaga sola a los 25
     archivos sin tocar ninguno, mismo criterio ya establecido en el
     proyecto para `core/corkboard.js`. De paso, corregido un segundo bug
     real detectado al auditar el componente: `.card-face::after` (la
     decoración de "esquina doblada") no llevaba `pointer-events: none`,
     así que en la esquina inferior derecha de cualquier ficha —incluida
     la zona ahora ocupada por el nuevo botón— ese elemento puramente
     decorativo podía robar el toque; añadido también a `.washi` (la
     cinta washi del frente) por el mismo motivo, aunque ahí nunca
     coincidía con ningún control real. Añadido `touch-action:
     manipulation` a `.field-card` y a `.back-cta`, y ensanchado
     ligeramente el `gap` del grid del corkboard (14px→16px horizontal,
     22px→24px vertical) para reducir el riesgo de toques accidentales
     sobre la ficha vecina. Verificado con Playwright (viewport
     390×844 y 360×780, `hasTouch`/`isMobile`): el `.back-cta` mide
     ahora ~164px de ancho × ~55px de alto (antes, una tira de texto sin
     `min-height`); una batería de toques a lo largo de toda la franja
     (3%, 25%, 50%, 75%, 97% de su ancho, cerca del borde inferior)
     impacta `.back-cta` en el 100% de los casos y abre el tema correcto,
     incluido un toque deliberadamente impreciso a 6px del borde
     izquierdo de la ficha que con el diseño anterior habría fallado por
     completo; `getComputedStyle` confirma `pointer-events: none` en
     `::after`; sin overflow horizontal ni errores de consola. Sin
     cambios en `core/corkboard.js` ni en el HTML de ninguna ficha — la
     lógica de clic ya delegaba correctamente en `.back-cta` vía
     `e.target.closest('.back-cta')`, el problema era puramente de
     tamaño/posición del área clicable, no de JS.
   - **Rediseño completo del cuaderno de campo — sustituido el volteo 3D**,
     a petición explícita del usuario ("en el móvil al darse la vuelta y
     al clickar sigo teniendo problemas, creo que se puede rediseñar la
     parte de las tarjetas para presentarla de otra manera") — el ajuste
     táctil del `.back-cta` de arriba no fue suficiente: el problema real
     era estructural, no solo de zona de toque. `.field-card` tenía un
     alto FIJO de 236px en una rejilla de 2 columnas, con las dos caras en
     `position:absolute;inset:0` volteadas en 3D (`rotateY(180deg)`,
     `backface-visibility:hidden`) — cualquier hook/respuesta algo largo
     se recortaba contra ese alto fijo, y el propio volteo 3D es frágil en
     móvil (superposición de capas, safari con perspective). Antes de
     tocar código se exploraron 3 direcciones visuales completas con el
     tipo Artifact "Design" (canvas de prototipos `.dc.html` tocables,
     recreando fielmente la paleta/tipografía reales de la app — nunca un
     diseño genérico) y se presentaron para probar en el propio móvil: A)
     lista expandible de una columna sin volteo, B) la misma estética de
     ficha de campo (parchment/washi/ilustración) pero con un **cajón**
     que se despliega debajo en vez de voltear, C) filas muy compactas que
     abren una **hoja fija al pie de pantalla**. El usuario confirmó que
     le gustaban las 3 — como `core/corkboard.js` es un único componente
     compartido por las ~26 fichas de toda la app, se resolvió con
     `AskUserQuestion` cómo combinarlas: **regla automática por tamaño del
     cuaderno**, nunca a mano por módulo — B (cajón) en cuadernos
     ≤12 fichas, C (hoja compacta) en cuadernos &gt;12 (Merino
     Cardiología 24, Merino Neumología 23, Fisiología renal 18, Manual UMI
     18, ERC 13, Inmunología 13...).
     - **Sin tocar el HTML de ninguna ficha de la app** — la clave del
       rediseño: el HTML `.field-card > .field-card-inner >
       .card-face.front/.back` de siempre ya tenía exactamente la
       separación semántica correcta (front = ilustración+título+pista,
       back = respuesta+CTA), así que todo el cambio vive en
       `core/corkboard.js` y `css/components.css` — mismo criterio ya
       establecido en el proyecto para "Siguiente ficha →" y la marca de
       "ya visto" (cambio centralizado, cero wiring por módulo).
     - **`initCorkboard(boardId, panelId)`** cuenta las `.field-card` del
       tablero al arrancar y añade `corkboard-cajon` o `corkboard-compacta`
       al contenedor (`cards.length > 12` → compacta). El listener de
       click ya no hace `classList.toggle('flipped')`: en modo cajón hace
       `toggle('open')` (varias fichas pueden estar abiertas a la vez,
       como un acordeón); en modo compacta es excluyente (`closeAll()`
       antes de abrir la nueva, como cualquier hoja/bottom-sheet real) y
       crea un único `.corkboard-backdrop` por tablero (fondo oscuro fijo
       que cierra al tocar fuera). Tocar `.back-cta` sigue siendo el único
       camino a `openCorkboardTopic()` (sin cambios en esa función, ni en
       la marca de "ya visto" ni en "Siguiente ficha →", que siguen
       leyendo `.field-card`/`data-tab` igual que siempre) y ahora además
       llama a `closeAll()` — necesario en modo compacta, si no la hoja se
       queda flotando por encima del contenido real recién revelado.
     - **Título inyectado en la hoja compacta**: la cara trasera nunca
       tuvo el título de la ficha (solo pista+botón, igual en el diseño
       de siempre) — `asegurarTituloHoja()` lo toma la primera vez que se
       abre, leyendo `.field-name` con el mismo helper `nombreFicha()` ya
       usado por "Siguiente ficha →" (reutilizado, no duplicado), e
       inserta un `<div class="corkboard-sheet-title">` como primer hijo
       de `.card-face.back` — así la hoja no queda coja, sin tener que
       tocar el HTML de ninguna ficha para añadir el título.
     - **CSS**: `.corkboard` pasó de `grid grid-template-columns:1fr 1fr`
       a `flex column` de una sola columna en ambos modos (ya no hace
       falta 2 columnas si el alto es siempre automático). Modo cajón:
       `.card-face.back{display:none}` → `.field-card.open
       .card-face.back{display:block}`, en flujo normal, nunca 3D — el
       propio `.field-card-inner` perdió `transform-style:preserve-3d`
       por completo. De paso, aprovechando que ya no hay rejilla de 2
       columnas estrecha, se agrandó la ilustración (88×64→108×76px) y el
       texto (`.field-name` 0.86→0.98rem, `.field-hook` 0.64→0.72rem,
       `.back-hook` 0.78→0.86rem, `.plate-label` 0.52→0.6rem) — el propio
       síntoma de "texto ilegible" que motivó el pedido original. Modo
       compacta: `.washi`/`.plate-label` ocultos, `.field-illust`
       reposicionado absoluto a la izquierda (26×26px) con el texto
       indentado (`padding-left:44px`), `.field-hook` truncado a una
       línea (`white-space:nowrap;text-overflow:ellipsis`) — fila con
       `min-height:52px`, bien por encima del mínimo táctil de 44px. La
       hoja (`.field-card.open .card-face.back` en compacta) usa
       `position:fixed;left:0;right:0;bottom:0` con `border-radius:16px
       16px 0 0`, una animación de entrada (`corkboard-sheet-in`) y una
       barra "agarradera" decorativa (`::before`). El `.back-cta` (botón
       real hacia el contenido) es el mismo en los 3 sitios donde
       aparece — cajón, compacta y el `.field-name`/checkmark de "ya
       visto" tampoco se tocaron, ni su posicionamiento (`.card-face`
       sigue siendo `position:relative`, ya no `position:absolute;inset:0`,
       así que el checkmark ✓ y la esquina doblada `::after` se anclan
       igual de bien a la propia caja en vez de a un contenedor volteado).
     - Verificado con Playwright (viewport 390×844): recorrido estructural
       de los 26 cuadernos de campo de la app confirmando que CADA uno
       recibe el modo correcto según su nº real de fichas (cajón ≤12,
       compacta &gt;12, incluido el caso límite de 12 fichas exacto en
       `cardio-corkboard`/Fisiopatología UCI, que se queda en cajón) y que
       abrir/cerrar la primera ficha de cada uno funciona sin excepción
       JS; en cajón (Reconocimiento, 9 fichas): el cajón se despliega en
       flujo normal sin recortar texto, toca `.back-cta` → navega al
       contenido real Y cierra el cajón, la ficha queda marcada
       `.visited`; en compacta (Fisiología renal, 18 fichas): la hoja se
       abre con el backdrop activo, el título se inyecta correctamente
       ("Anatomía funcional"), tocar el backdrop cierra la hoja, abrir una
       2ª ficha cierra automáticamente la 1ª (exclusivo), tocar
       `.back-cta` navega y cierra hoja+backdrop a la vez; sin overflow
       horizontal a 390px en ningún cuaderno; capturas de pantalla
       confirmando visualmente el resultado (cajón: parchment de ancho
       completo con cajón desplegado y CTA de ancho completo bien visible;
       compacta: filas delgadas escaneables de un vistazo, hoja inferior
       con agarradera+título+respuesta+CTA de 44px, backdrop oscureciendo
       el resto de la pantalla). Bump de cache-busting a `?v=20260929`
       (cambiaron `css/components.css` y, por la regla del proyecto,
       también `variables.css`/`base.css` aunque no cambiaran de
       contenido, para mantener las 3 hojas de estilo con la misma fecha).
     - **Pendiente, a decisión del usuario**: el rediseño del "formato de
       presentación cuando te metes en una ficha" (la vista completa de
       contenido tras tocar `.back-cta` — tablas, `kv-row`,
       `micro-prof-item`, gauges) sigue en la fase de exploración visual
       (mismo Artifact de diseño, quinto artboard "Dentro de una ficha")
       usando el método de la skill `/dataviz` — pendiente de que el
       usuario revise esa propuesta y confirme antes de implementarla en
       código. La validación del `scripts/validate_palette.js` de esa
       skill sobre los 5 acentos reales de la app (`--accent-green/red/
       yellow/blue/purple`) confirmó, con cifras (no solo a ojo), el
       "gotcha" ya documentado en varios puntos de este archivo de que
       `--accent-blue`/`--accent-yellow` son casi indistinguibles (ΔE 5,7,
       por debajo del suelo de 15 — ni siquiera con visión normal se
       distinguen bien) — y añadió un hallazgo nuevo: `--accent-green`
       tiene poca saturación sobre el fondo oscuro de la app (roza el
       suelo de croma, "lee como gris"). Ninguno de los dos se ha tocado
       todavía (cambiar un token de color afecta a decenas de sitios ya
       verificados) — quedan documentados aquí como algo a tener en
       cuenta si se rediseña el sistema de color, nunca a "corregir" sin
       que el usuario lo pida explícitamente.
     - **Bug real de móvil encontrado y corregido tras el despliegue
       anterior**, a partir del reporte explícito del usuario vía `/debug`
       ("no puedo acceder bien a las fichas nuevas"). La verificación de la
       ronda anterior usaba `element.click()` de Playwright (JS puro), que
       **nunca dispara `:active`** — así que quedó ciega a un bug real que
       solo aparece con un toque de verdad. Causa: `.field-card:active {
       transform: scale(0.99); }` (línea única, sin acotar a modo)
       convierte a `.field-card` en un nuevo *containing block* CSS para
       cualquier descendiente `position:fixed` mientras el `transform` no
       sea `none` — y en modo compacta la cara trasera (`.card-face.back`)
       es justo eso, la hoja fija al pie de pantalla. Confirmado de forma
       empírica con `page.mouse.down()`/`page.mouse.up()` (que sí disparan
       `:active`, a diferencia de `.click()`): con el toque en marcha, la
       hoja queda encajonada dentro de la propia fila (`rect` ~350×168,
       pegado a la posición de la fila) en vez de anclada al fondo del
       viewport (`rect` 390 de ancho × pegada a `bottom:844`) — el mismo
       síntoma exacto de "no puedo acceder bien". En iOS Safari `:active`
       se mantiene durante todo el gesto de toque (no se libera limpio en
       "mouseup" como en el test sintético), así que esa ventana rota
       podía cubrir el toque completo del usuario sobre `.back-cta`.
       Corregido acotando el `transform` de `:active` solo a
       `.corkboard-cajon` (ahí la cara trasera nunca es `position:fixed`,
       así que es inofensivo) y sustituyéndolo en `.corkboard-compacta` por
       un feedback de toque que no participa en containing blocks —
       `background: rgba(255,255,255,0.05)`, nunca `transform`/`filter`/
       `perspective`/`backdrop-filter`, los 4 CSS que crean containing
       block para `position:fixed`. **Lección para el futuro**: cualquier
       regla `:active`/hover/toque nueva sobre un ANCESTRO de un elemento
       `position:fixed` (aquí, o en cualquier otro overlay/hoja fija de la
       app) debe evitar esas 4 propiedades, o acotarse a un modo/contexto
       donde no haya ningún descendiente fijo — y verificarse con
       `page.mouse.down()`/`up()` real, nunca solo con `.click()`, porque
       `.click()` no ejercita `:active` y puede dar un falso verde a este
       tipo de bug. Verificado con Playwright tras el arreglo: en modo
       compacta, el `transform` de `.field-card` durante `:active` es
       ahora `none` (feedback visual solo por `background`), la hoja
       aparece ya desde el primer frame con `left:0, width:390` anclada al
       viewport, y el botón `.back-cta` real queda en `x:0, width:390,
       y:800` (tocable de verdad); en modo cajón, el toque sigue
       escalando/rotando la ficha (`:active` combinado con el `--tilt`
       propio) y el volteo sigue abriendo con normalidad — sin regresión.
       Bump de cache-busting a `?v=20260929-2` (segundo despliegue del
       mismo día que toca `components.css`).
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
5. **Merino HEMATO** (`modules/merino-hemato/`) — 5º nodo del Atlas
   Hematológico (verde, sin zona intermedia, `data-route="merino-hemato"`
   directo, posicionado abajo a la izquierda del mapa y conectado por su
   propio `.vessel-line` al nodo de Trasplante TPH), a petición explícita
   del usuario ("abre una nueva sección llamada Merino HEMATO"). Fuente:
   capítulos "Anemia and Red Blood Cell Transfusions" (Cap. 12) y
   "Platelets and Plasma" (Cap. 13) de Marino PL, *The ICU Book* (5.ª ed.) — PDF archivado en
   `docs/marino-2024-anemia-transfusion-hemostasia-uci.pdf`. A diferencia
   del resto de módulos de Hematología (todos con submenú o subvistas
   propias), este es un módulo plano de una sola vista con cuaderno de
   campo de **6 fichas**, mismo patrón `initCorkboard()` que el resto:
   Anemia en el paciente crítico (definición, la trampa del volumen
   plasmático — el mismo cambio de Hto que produce pasar de pie a
   tumbado o infundir 20 ml/kg de salino equivale a perder una unidad de
   sangre —, anemia propia de la UCI por inflamación/flebotomía,
   fisiología compensadora — viscosidad, gasto cardíaco, extracción de
   O₂ hasta el techo del 50% —, tolerancia a la anemia extrema en
   Testigos de Jehová postoperatorios), El umbral transfusional
   (historia del "10/30", umbrales actuales Hb&lt;7/&lt;8 g/dl, por qué
   la Hb es mal disparador, alternativa de extracción de O₂,
   preparaciones/infusión/filtros de hematíes, evidencia de que la
   transfusión sube el DO₂ pero no el VO₂, "qué es peor: la anemia o la
   transfusión", volumen sanguíneo vs. masa de hematíes), Riesgos de la
   transfusión (tabla completa de eventos adversos por unidad
   transfundida, reacción hemolítica aguda, fiebre no hemolítica,
   hipersensibilidad, TRALI, TACO, infecciones nosocomiales — con la
   radiografía real de TRALI, Figura 12.5 del capítulo), Trombocitopenia
   y HIT (hemostasia resumida, umbral clínico &lt;100.000/µl,
   pseudotrombocitopenia por anti-EDTA, causas farmacológicas/no
   farmacológicas en el crítico, mecanismo/factores de
   riesgo/clínica/diagnóstico de la HIT, y una **calculadora interactiva
   de la escala 4Ts** — 4 `<select>` puntuables 0-2, banda de riesgo
   bajo/intermedio/alto reutilizando `.tfg-estado-ok/warn/danger`,
   deliberadamente con `<select>` y no `<input type="radio">` tras
   detectar con Playwright que `.checkbox-label:has(input:checked)` ya
   lleva un `text-decoration:line-through` pensado para checklists de
   "hecho/no hecho", que con radios de puntuación se leía como si la
   opción elegida hubiera sido "tachada/rechazada" — mismo patrón
   `<select>` ya usado por las calculadoras ISTH de Síndromes Urgentes),
   Microangiopatías trombóticas (CID/PTT/SHU, con la Figura 13.1 real —
   frotis con esquistocitos — y la tabla comparativa de perfil
   hematológico que distingue la CID, con consumo de factores, de la
   PTT/SHU, sin él), y Plaquetas y plasma (indicaciones/preparaciones/
   respuesta/efectos adversos de la transfusión de plaquetas,
   PFC/complejo protrombínico de 4 factores/crioprecipitado, y la
   discrepancia real citada en la fuente entre la mejora del INR con PFC
   y el aumento simultáneo de antitrombina que la contrarresta).
   **Solo 2 imágenes reales extraídas** (radiografía de TRALI y frotis
   con esquistocitos) — el resto de figuras del PDF (7 de las 9 imágenes
   incrustadas detectadas con `pdfimages -list`) son gráficos de barras/
   líneas estadísticos, recreados como texto/tabla nativos en vez de
   extraídos como imagen, mismo criterio que el resto del proyecto.
   48 preguntas de quiz (`js/data/merino-hemato-preguntas.js`,
   `merino-q001`-`q048`, 8 por ficha × 6 fichas), con
   `triggerId: 'btn-merino-repasar'` añadido al array que ya exporta
   `home/index.js` (junto a los otros 4 triggers de Hematología) y
   bloque propio "Merino HEMATO" en el nivel 2 del menú del quiz. El
   banco combinado de toda la app queda en <strong>1259 preguntas</strong>
   (1211 previas + 48).
   - **Auditoría de fidelidad de contenido contra las 38 páginas del PDF
     fuente**, a petición explícita del usuario ("una revisión sobre el
     contenido... y su bibliografía para que no haya huecos reales de
     contenido"). Releído el PDF completo comparándolo frase a frase con
     las 6 fichas ya publicadas — mismo método ya establecido en el resto
     del proyecto. Sin errores de transcripción, pero sí varios huecos de
     contenido reales, todos corregidos:
     - **Ficha 1**: la Tabla 12.1 (rangos de referencia) solo reproducía 3
       de las 6 filas reales — añadidas volumen corpuscular medio (80-100
       fl), recuento de hematíes (4,6-6,2×10¹²/l varones, 4,2-5,4×10¹²/l
       mujeres) y recuento de reticulocitos (25-75×10⁹/l). La Tabla 12.2
       de viscosidad solo tenía 5 puntos de una tabla real de 7 (faltaban
       Hto 10%/30%/50%) y una fila "45% normal, ~4" que no existe como tal
       en la fuente (esa cifra es una frase aparte del texto, no una fila
       de tabla) — corregida a los 7 puntos reales con sus 2 columnas
       (viscosidad relativa y absoluta), moviendo el dato de "Hto normal"
       a una nota de texto. Añadida también la nota teleológica de la
       fuente sobre por qué la sangre se "espesa" al caer el flujo local
       (limita la pérdida de sangre por una herida).
     - **Ficha 2**: añadido el hecho fundacional (ausente hasta ahora) de
       que la sangre completa solo se almacena bajo petición expresa,
       fraccionándose de forma rutinaria en sus componentes; y el matiz de
       que el almacenamiento prolongado de los hematíes puede empeorar
       (no solo no mejorar) la oxigenación tisular tras la transfusión.
     - **Ficha 3**: añadida la transmisión bacteriana (1:500.000) a la
       tabla resumen de eventos adversos de hematíes — presente en la
       Tabla 12.5 original pero ausente de la reproducción de la app.
     - **Ficha 6**: la Tabla 13.4 (reacciones a plaquetas multidonante vs.
       aféresis) solo tenía 5 de las 8 filas reales — añadidas transmisión
       bacteriana, transmisión viral y la fila de "Total de reacciones"
       (70 vs. 478, la cifra que resume todo el mensaje de la tabla), más
       la columna de significación estadística (p) que faltaba por
       completo. Añadida una sección nueva "Riesgos propios del PFC"
       (ausente hasta ahora): el PFC tiene su propio umbral de sobrecarga
       circulatoria (>1 ml/kg/h) e incidencia de TACO (1:70-1:1.500)
       distintos de los de hematíes/plaquetas, mayor tasa de
       hipersensibilidad por su mayor volumen de proteínas plasmáticas
       (1:600-1:2.000), y cifras de transmisión de infecciones propias
       (hepatitis B 1:280.000, hepatitis C 1:1,2 millones, VIH 1:1,6
       millones — distintas de las ya citadas para hematíes en la Ficha 3)
       — un bloque completo del capítulo 13 que no se había trasladado a
       ninguna ficha.
     - Verificado con Playwright: las 6 fichas siguen abriendo/volteando
       sin error de consola ni 404 real; las tablas ampliadas (6 filas en
       Ficha 1, 7 filas/3 columnas en Ficha 1, 8 filas/4 columnas en Ficha
       6) renderizan sin overflow horizontal a 390px; la calculadora 4Ts y
       el resto de interactividad siguen funcionando sin regresiones.

**Escalas Generales** (`modules/generales/`, qSOFA/SRIS/SOFA/Glasgow/
APACHE II/Charlson) ya NO es una de las 4 categorías del menú: es un botón
pequeño y fijo arriba a la derecha de la cabecera (`#btn-escalas-generales`),
fuera del flujo del menú principal, porque se consulta con mucha frecuencia
y de forma independiente del resto. Es accesible desde cualquier pantalla
(está fuera de los contenedores de vista en `index.html`) y su "← VOLVER"
regresa a la pantalla desde la que se abrió (ver "Auditoría de
Hematología (octubre 2026)").

- **APACHE II y el índice de comorbilidad de Charlson**, a petición
  explícita del usuario ("busca la escala apache II y charlson para
  meterlas en la parte de escalas"). Añadidas como 2 tarjetas más al final
  de `generales.html` (`apache2.js`/`charlson.js`, registradas en el
  `index.js` de `modules/generales/`), siguiendo el mismo patrón
  `.result-box`/`.result-score`/`.management-text` con color inline ya
  usado por qSOFA/SRIS/SOFA/Glasgow en este mismo archivo — no
  `.tfg-estado-ok/warn/danger` (ese patrón es de otras especialidades).
  Ambas son escalas estándar públicas (Knaus et al. 1985 y Charlson et al.
  1987, prácticamente inmutables desde su publicación), verificadas con
  `WebSearch` antes de implementarlas — sin PDF fuente propio en `docs/`,
  a diferencia del resto de calculadoras del proyecto, porque no vienen de
  un documento aportado por el usuario sino de la literatura médica
  estándar ya citada en miles de fuentes — mismo criterio que ya se aplicó
  a CHA₂DS₂-VASc/qSOFA/SOFA/Glasgow, también implementados sin PDF propio.
  - **APACHE II** (`apache2.js`, 0-71 pts): 12 variables fisiológicas +
    edad + salud crónica previa. Cada variable simple (temperatura, PAM,
    FC, FR, pH/HCO₃⁻, sodio, potasio, hematocrito, leucocitos) es un
    `<select class="apache-input">` con los 8 tramos reales de la tabla
    original (ascendente por valor fisiológico, 0 = normal), sumados con
    el mismo patrón `.reduce()` ya usado por `sofa.js`. 3 variables llevan
    lógica propia, no la suma genérica:
    - **Oxigenación**: un `<select id="apache-fio2">` (FiO₂ &lt;50%/≥50%)
      alterna qué bloque se muestra — PaO₂ (`#apache-o2-baja`) o gradiente
      A-a de O₂ (`#apache-o2-alta`), cada uno con clase propia
      `.apache-o2-input` (no `.apache-input`, para no sumar los dos a la
      vez) — mismo patrón de "campo condicional según selector" ya usado
      en otras calculadoras de la app (p. ej. la dosis condicional del
      diagrama de receptores adrenérgicos de Merino Cardiología).
    - **Creatinina**: un segundo `<select id="apache-fra">` ("¿Fracaso
      renal agudo?") duplica los puntos de creatinina si está marcado
      "Sí" — regla real de la escala original, implementada como
      `creatBase * 2` en vez de un select con el doble de opciones.
    - **Componente neurológico (15 − Glasgow)**: en vez de un 4º `<select>`
      de rango de GCS (que hubiera duplicado la calculadora de Glasgow ya
      presente más arriba en la misma ficha), `calcApache()` lee
      directamente los 3 `<select class="gcs-input">` de esa calculadora
      (`gcs-eye`/`gcs-verbal`/`gcs-motor`, con el mismo tratamiento de
      "1T" = intubado ya usado en `glasgow.js`) y `init()` añade un
      listener extra sobre esos mismos selects para que APACHE II se
      recalcule solo con cambiar el Glasgow de arriba — mismo espíritu de
      cross-link de estado compartido dentro de una misma ficha ya
      documentado para `CicloEstado` en Cardiología, aquí sin necesidad de
      un objeto de estado propio por ser un único valor derivado.
    - **Interpretación**: 4 bandas cualitativas (leve/moderada/alta/muy
      alta) por rango de puntuación, sin una cifra de mortalidad % por
      banda — deliberado: la escala original relaciona la puntuación con
      la mortalidad hospitalaria esperada, pero esa cifra exacta varía
      según si el ingreso es médico o quirúrgico y no se pudo verificar
      byte a byte contra la tabla original en esta sesión (`WebFetch` a
      Wikipedia/MDCalc/MSD Manual bloqueado por el proxy de salida de
      red) — mismo criterio de seguridad clínica ya aplicado en el
      proyecto a la KFRE de ERC (Nefrología): implementar el score aditivo
      verificable, abstenerse de una cifra de resultado no verificable en
      vez de fabricarla.
    - Un `.micro-prof-item` explica qué cuenta como "insuficiencia
      orgánica grave/inmunosupresión" para el campo de salud crónica
      previa (hepática/cardiovascular/respiratoria/renal/inmunosupresión),
      con los 5 puntos si es ingreso no quirúrgico/postoperatorio urgente
      y 2 si es postoperatorio electivo — regla real de la escala.
  - **Índice de comorbilidad de Charlson** (`charlson.js`): edad (0-5 pts,
    +1 por década desde los 50) + 19 comorbilidades en 4 bloques de peso
    (10 de 1 punto, 6 de 2 puntos, 1 de 3 puntos —hepatopatía moderada-
    grave—, 2 de 6 puntos —tumor sólido metastásico y SIDA—), cada una
    como `<select class="charlson-item" data-pts="N">` No/Sí — nunca
    `<input type="checkbox">`, mismo criterio ya establecido tras el bug
    de tachado (`text-decoration:line-through` en `.checkbox-label:has
    (input:checked)`) que motivó pasar a `<select>` en la calculadora 4Ts
    de Merino HEMATO. Se muestran y usan 2 índices distintos, como hacen
    la mayoría de calculadoras clínicas reales de esta escala: el
    **índice de comorbilidad puro** (sin edad, mostrado como resultado
    principal, con las bandas cualitativas 0=sin comorbilidad/1-2=baja/
    3-4=moderada/≥5=alta) y el **índice ajustado por edad** (comorbilidad
    + edad), usado exclusivamente para la fórmula de supervivencia
    estimada a 10 años de la publicación original — `10-year survival =
    0,983^(e^(índice_ajustado × 0,9))` — verificada con `WebSearch` antes
    de implementarla (la base 0,983 = supervivencia a 10 años de la
    cohorte de referencia sin comorbilidad).
  - Verificado con Playwright: con todos los campos en su valor por
    defecto, APACHE II da 0/71 y Charlson 0 pts/~98% de supervivencia
    estimada (coincide con la base 0,983 de la fórmula); fijando las 9
    variables genéricas de APACHE II en su punto más alto (4 cada una) +
    creatinina en el tramo más alto (4) con fracaso renal agudo marcado
    (dobla a 8) da 44/71, exactamente la suma esperada a mano; cambiar
    `#apache-fio2` a "≥50%" oculta el campo de PaO₂ y muestra el de
    gradiente A-a, y sumar su valor (4) sube el total a 48/71; cambiar el
    Glasgow de la calculadora de arriba a 3/15 (mínimo) recalcula APACHE
    II automáticamente sin tocar ningún campo propio, sumando 12 puntos
    (60/71); fijar edad ≥75 (6) y salud crónica "no quirúrgico" (5) lleva
    el total al máximo teórico exacto de la escala, 71/71; en Charlson,
    marcar tumor sólido metastásico + SIDA (6+6=12 pts) con edad ≥90 años
    (5 pts) da un índice de comorbilidad de 12 pts (banda "alta") y un
    índice ajustado de 17 pts, con una supervivencia estimada &lt;1% —
    confirmado que los 19 `<select class="charlson-item">` existen y se
    suman todos correctamente; sin errores de consola ni overflow
    horizontal a 390px en ninguna de las 2 tarjetas nuevas. Sin cambios de
    CSS (reutiliza `.card`/`.form-group`/`.result-box`/`.result-score`/
    `.management-text`/`.section-label`/`.micro-profiles` ya existentes),
    así que no hizo falta bump de cache-busting.


## Auditoría de Hematología (octubre 2026)

A petición explícita del usuario ("revisa que esté todo correcto en
hematología y revisa los fallos y las partes que están por mejorar"). Se
revisaron con scripts (no a ojo) los 5 bancos de quiz, todas las vistas y
las 36 fichas a 390 y 360 px, todas las calculadoras con valores vacíos/0/
negativos/enormes, los enlaces y anclas `#page=N` de los PDF, la navegación
(Atlas, "← VOLVER", botones de repaso) y el buscador. Fallos corregidos:

- **La respuesta correcta era siempre la opción A** — en los 224 ítems de
  Hematología y en 1259 de las 1619 preguntas de opción múltiple de toda la
  app (los bancos se escriben con la correcta primero). Corregido en el
  motor, no en los datos: `renderPregunta()` (`js/modules/quiz/quiz.js`)
  baraja el orden en pantalla y `data-indice` conserva el índice original
  que compara `responder()`; las opciones "… de las anteriores" se dejan
  siempre al final. Verificado: en Merino HEMATO la correcta cae 16/11/10/11
  veces en las posiciones 1-4.
- **`&lt;` y `<sub>` visibles en el quiz**: enunciado/explicación/respuesta
  modelo se pintaban con `textContent` (7 preguntas de Merino HEMATO, 12 de
  Merino Neumología, 1 de Cardiología). Ahora todos los campos pasan por
  `htmlPregunta()`, que deja pasar solo `<sub>`/`<sup>` y entidades y
  escapa cualquier otro `<` (p. ej. "S<D" en VExUS).
- **Los botones "🎯 Repasar" de Hematología abrían el menú general del
  quiz** (todas las especialidades). Ahora llevan
  `data-quiz-asignatura` + `data-quiz-bloque` + `data-quiz-elegir` y abren
  la lista de fichas de su propio módulo; Trasplante usa
  `data-quiz-prefijo-bloque="Trasplante"` para mostrar solo sus 3 bloques.
  Sin `data-quiz-elegir`, `asignatura`+`bloque` sigue empezando directo
  (Preguntas MC difíciles no cambia).
- **El buscador global no encontraba nada de Neutropenia Febril ni de
  Escalas Generales** (solo indexaba fichas de cuaderno de campo). Nueva
  tabla `VISTAS_TARJETAS` en `core/search.js`: indexa cada `.card` de
  primer nivel de esas vistas, y al elegirla pulsa los botones de
  navegación que ya existen y resalta la tarjeta. Para otra vista sin
  cuaderno de campo, basta una entrada más.
- **El buscador y Modo Estudio contaban texto que no es de la ficha**: la
  imagen ya construida, el interruptor y el botón "Siguiente ficha → X"
  (que hacía aparecer una ficha al buscar el título de la siguiente).
  Nuevo `textoFuente(el)` en `core/vista-visual.js`, usado por ambos.
- **Entrar en Neutropenia Febril reabría la última subvista** (p. ej.
  Diagnóstico) en vez de la principal. `#btn-neutropenia-febril` resetea
  ahora el switcher interno a `main`, y la ruta del Atlas pasa por ese
  mismo botón.
- **"← VOLVER" de Escalas Generales siempre iba a Hematología**, aunque se
  abriera desde Nefrología o la raíz. `createViewSwitcher()` expone
  `actual()` y `home/index.js` recuerda la vista previa al abrir Escalas.
- **Valores negativos aceptados**: diferencial de tiempo de hemocultivos
  (−5 h daba "sugiere bacteriemia por catéter"), PCR y galactomanano ahora
  avisan de dato no válido; el carril de hemocultivos de la imagen ya no
  se sale del eje con horas negativas o mayores de 36.
- **Desbordamiento a 360 px** en `.compare-box` de CID y PTT (palabras
  largas como "antifibrinolítico" no dejaban encoger la columna):
  `min-width:0; overflow-wrap:anywhere` en la regla común.
- `resaltar()` alinea arriba (no al centro) un bloque más alto que la
  pantalla, para no aterrizar a mitad de una tarjeta larga.

Revisado y correcto, sin cambios: 36 fichas con vista Visual (nodos,
detalles y "Ver en el texto"), ninguna NaN/Infinity/undefined en ninguna
calculadora, imágenes y enlaces locales, anclas de página de los PDF, ids
únicos dentro de Hematología, rutas del Atlas y botones "← VOLVER".
**Pendiente**: los DOI externos de la bibliografía no se pueden comprobar
desde el entorno remoto (proxy); un id `arrowY` duplicado fuera de
Hematología (Fisiopatología UCI/Cardiología y Merino Neumología); y la
auditoría de fidelidad de contenido contra las fuentes, que Hematología
sigue sin tener (confirmar antes con el usuario qué documentos releer).

### Auditoría de fidelidad de Neutropenia Febril (octubre 2026)

Primera auditoría de contenido de Hematología contra su fuente, a petición
explícita del usuario ("empieza con neutropenia febril"; los PNT de
Trasplante ya se habían auditado aparte). Releído el consenso SEIMC-SEHH
completo (`docs/seimc-sehh-2020-neutropenia-febril.pdf`, versión en inglés,
`pdftotext -layout`) y cruzado bloque a bloque con las 4 vistas, los datos
de `js/data/` y el banco de quiz. Sin errores graves de transcripción en
triaje/MASCC/IDSA, criterios de suspensión, vía oral, catéter ni BLEE/AmpC.
Corregido:

- **Calculadora PK/PD**: 4 dosis no coincidían con las Tablas 8-9 del
  consenso, dos de ellas infradosificando en hemofiltración: cefepime en
  TCRR (2 g/24 h → 1 g/8 h o 2 g/12 h), colistina en TCRR (2 MU/12 h →
  2-3 MU/8 h o 4,5 MU/12 h), cefepime con ClCr 10-30 (→ 1 g/12 h),
  pip-tazo con ClCr 10-30 (4,5 g/12 h → 4 g/8 h) y amoxi-clav con ClCr
  &lt;30 (→ 0,5 g/12 h y 0,5-1 g/24 h de amoxicilina). Caspofungina y
  voriconazol ganan el ajuste por Child-Pugh. Nota de fuente con enlace al
  PDF (pág. 100) bajo la calculadora; pip-tazo en TCRR se dejó en 4,5 g/8 h
  (la fila de la Tabla 9 es ambigua) y se declara en esa nota.
- **Foco que faltaba**: senos paranasales (Tabla 5), con su marcador en el
  mapa corporal (`senos` en `core/silueta.js`, escalón B).
- **Comentarios por foco ampliados** con la Tabla 5: clindamicina en
  partes blandas necrotizantes, absceso perianal, SARM/P. jirovecii/CMV en
  neumonía, glucopéptido en ITU, aciclovir y criptococo en SNC.
- **Diagnóstico**: GM con 2 determinaciones pasa a positivo solo si
  &gt;0,5 (antes ≥0,5); la PCR 20-30 mg/dL ya no se presenta como "zona
  límite", sino dentro del corte descrito de mortalidad (C-III); el
  bloque C dice que los biomarcadores no guían el antibiótico (B-III/A-II);
  el bloque B gana cuándo cribar (A-I) y los pasos que faltaban de ambas
  ramas (las recoge solo la imagen, que copia los `.flow-node`); tiempos
  reales de C. difficile y falsos negativos de la gripe &gt;48 h.
- **Catéter**: recaída precoz/fracaso conservador (B-II), fiebre
  persistente sin infección confirmada (B-II/C-III) y recambio sobre guía.
- **Otros**: alternativas orales en alergia a betalactámicos (A-I/A-II);
  aminoglucósido en dosis única diaria y anti-Candida en shock sin
  profilaxis (notas SEIMC); infusión extendida en BLEE/AmpC (A-I);
  diarrea en el criterio IDSA de síntomas GI; mortalidad por puntuación
  MASCC y nota de fidelidad sobre la redacción del ítem "tumor sólido/
  linfoma".
- **Tachado**: las casillas de CISNE, vía oral, antifúngico, catéter y
  matriz MDR salían tachadas al marcarlas; ahora llevan `.puntuable`.
- **Quiz**: q002 (riesgo de infección, no de complicación), q020 (falta
  la inestabilidad y el A-II) y 5 preguntas nuevas (`nf-q027`-`q031`).

**Sin verificar por falta de fuente archivada**: todo lo que la app
atribuye a ECIL-10 (escalera sin foco, suspensión ≥72 h en infección
documentada, carbapenemasas, P. aeruginosa DTR, A. baumannii,
S. maltophilia). El PDF de ECIL-10 no está en `docs/`; varias de esas
pautas difieren del consenso SEIMC-SEHH 2020 (p. ej. cotrimoxazol en
monoterapia 15 mg/kg/día frente a combinación 8-12 mg/kg/día) y deben
auditarse cuando llegue. Tampoco tienen fuente las dosis de "infección
grave" con ajuste renal de la calculadora PK/PD ni la elección
"equinocandina / anfotericina liposomal" del antifúngico empírico.

### Auditoría de fidelidad de Síndromes Urgentes y Reconocimiento (octubre 2026)

Mismo método que Neutropenia Febril, con los 4 PDF que aportó el usuario:
Iba 2025 (CID), Zheng 2025 (PTT), Chan 2025 (SLT) y Azoulay, Blood
Reviews 2025 (Reconocimiento). Los 4 son artículos de suscripción
(Elsevier/Wiley); tras avisarlo, el usuario pidió explícitamente
archivarlos en `docs/` (`iba-2025-isth-cid-definicion.pdf`,
`zheng-2025-isth-ptt-actualizacion.pdf` —versión en línea paginada 1-22—,
`chan-2025-bsh-lisis-tumoral.pdf`,
`azoulay-2025-blood-reviews-critico-hematologico.pdf`), y la bibliografía
y "Fuentes y Evidencia" enlazan a ellos, con el DOI en la nota.

- **CID**: el golpe de calor (HIC) estaba como fenotipo "mixto" y en la
  Figura 1 es trombótico (azul), igual que sepsis y cáncer — corregido.
  Nota de fidelidad: la Tabla 1 rotula "Overt DIC 2021" una columna que el
  texto presenta como los criterios de 2001 (probable errata, reproducida
  tal cual). Añadido: fibrinólisis endógena en la CID hemorrágica y paso
  posible a fase trombótica; criterios de fase precoz adaptados a cada
  causa (solo la SIC existe, desde 2017; TIC; CID del cáncer crónica);
  mortalidad casi doble de la CID en sepsis; condiciones que alteran la
  puntuación; origen y límites de los cortes de dímero-D 2025 (reconciliado
  con el "no hay corte estandarizado" de la BCSH 2009); terminología
  (fase tardía/descompensada, nuevo sentido de pre-CID); nota sobre la
  reposición en la CID hemorrágica de la Figura 2.
- **PTT**: contenido fiel a las 12 recomendaciones y los 33 GPS. Añadido:
  pruebas de hemólisis, >95% de PTTi con ADAMTS-13 <10, pauta de
  plasma en PTTc, riesgos del catéter, transfusión de plaquetas antes del
  diagnóstico, antiagregantes (GPS 19), sesgos de los datos de
  caplacizumab y alta domiciliaria, objetivo primario del ensayo de
  ADAMTS-13 recombinante (sin episodios en ningún brazo), su seguridad,
  embarazo en PTTc (mortalidad materna 10%, pérdida fetal >50%, plasma
  30-40 mL/kg/semana), lavado de rituximab, grupos de apoyo. Notas en las
  recomendaciones 1, 2 y 5 ("nueva evidencia, misma dirección") y de
  fidelidad en la 7 (la figura dice certeza "baja", la tabla "muy baja").
  `ptt.js` pinta la nueva `nota` de cada recomendación.
- **SLT**: Tabla 2 de riesgo idéntica. Corregido: la monitorización
  cardíaca continua es "a considerar en algunos casos", no sistemática.
  Nota de fidelidad: hidratación pediátrica 2,5-3 L/m² en el texto frente
  a 2-3 L/m² en la recomendación. Añadido: SLT tras radioterapia o
  intratecal, elección del uricosúrico y datos de febuxostat, pauta
  completa de rasburicasa (3 mg en adultos, escalada si aparece SLT,
  niños, reinicio de alopurinol, sin menos daño renal), dosis bajas no
  recomendadas para tratar, cribado G6PDH real del 18%, escalado de
  dosis como debulking, ingreso frente a ambulatorio, estrategias propias
  de venetoclax.
- **Reconocimiento**: la Tabla 1 decía "tiempo medio" y es mediana con
  RIC — corregido con los rangos. La desescalada anti-SARM decía "pasar a
  segunda línea" y la fuente lo limita a pacientes fuera de UCI —
  corregido. Añadido: coma y QT de alto riesgo como motivos de ingreso;
  LMA (mortalidad con dexametasona, cambio en ingreso de ancianos);
  linfoma (~18% de ingresos, T frente a B difuso, infecciones, HLH,
  CRS/ICANS); antibiótico (una hora de retraso multiplica por diez la
  mortalidad, duración con y sin documentación); shock séptico (VM, TRR y
  TPH alogénico, multirresistentes, medidas que ayudan); fibrinólisis en
  otras hemopatías; adenovirus; factores de riesgo de oportunistas y
  diagnóstico no invasivo de *Pneumocystis*; infección fúngica y
  uso prudente de antimicrobianos; factores de mortalidad de paciente,
  equipo y entorno. `visual.js` apunta ahora a "Empezar sin demora" (el
  párrafo de antibioterapia cambió de inicio).
- **Quiz**: 6 preguntas nuevas de Síndromes Urgentes
  (`sind-q016`-`q021`) y 4 de Reconocimiento (`rt-q046`-`q049`).
- Verificado con Playwright (390×844): las 12 fichas abren, la vista
  Visual no deja fuentes sin resolver, la calculadora Overt DIC sigue
  funcionando, los dos bancos se recorren enteros (21 y 49) sin entidades
  ni `undefined`, sin overflow ni errores de consola.
- **Pendiente**: la parte de CID que viene de la guía BCSH 2009 (Levi et
  al.) sigue sin cotejar, porque ese PDF no se ha aportado.

