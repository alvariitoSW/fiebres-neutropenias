# Historial · Revisión de código de octubre 2026 y arreglos de código

> Texto movido tal cual desde el antiguo `CLAUDE.md` (octubre 2026). Es la historia de cómo se construyó
> esta parte: decisiones, fuentes, auditorías y verificaciones. Las reglas vigentes están en `CLAUDE.md`.

## Revisión de código de octubre 2026 (`/code-review` + `/simplify`)

A petición explícita del usuario ("Quiero que revises el código de la app
/debug y simplifiques las partes que se puedan /code-review /simplify"),
se revisó TODO el código de lógica de la app (`js/core`, `js/modules`,
`js/main.js`, ~9.800 líneas; `js/data` excluido por ser datos puros) —
primero con `/code-review` (bugs) y 4 agentes de `/simplify` (reuso,
simplificación, eficiencia, altitud), y después aplicando las
correcciones en 5 commits independientes, cada uno verificado con el
driver de Playwright (`run-fiebres-neutropenias`, viewport 390×844)
antes de pasar al siguiente. **Cambios de arquitectura que invalidan
notas históricas anteriores de este mismo archivo** — si una nota de más
arriba contradice lo de aquí, manda esta sección:

- **Un único mecanismo de enlace cruzado para toda la app:
  `[data-especialidad]`.** Antes convivían 8 mecanismos distintos
  (`.tx-link` con un listener global sin acotar en `nefrologia/index.js`,
  `.paper-link`, `.neumo-internal-link`, `.umi-internal-link`,
  `.cardio-cross-link`, 6 botones por `id` en Merino Cardiología,
  `#fuci-link-a-teg`, `data-target="nefrotoxicidad"`), cada uno con su
  propio listener — y la "trampa" de `.tx-link` documentada decenas de
  veces en este archivo (reutilizarlo fuera de Nefrología corrompía
  `nefroLevel`) era real. Hoy `home/index.js` registra **un solo
  listener delegado** en `document` sobre cualquier
  `<button data-especialidad="X">` (con `data-view`/`data-panel`/
  `data-tab` opcionales, y `data-trasplante` solo con
  `data-especialidad="home"` para las 3 subvistas de Trasplante),
  resuelto por `irAResultadoBusqueda` — el mismo router que ya usaba el
  buscador global. Sirve tanto para saltar ENTRE especialidades como
  DENTRO de una misma (p. ej. de una ficha de ERC a una de FRA, o entre
  dos fichas del mismo cuaderno: basta con no poner `data-view`). Las
  clases `.tx-link`/`.especialidad-link`/`.paper-link`/
  `.neumo-internal-link` son hoy **puramente visuales** (comparten una
  regla en `components.css`); `.umi-internal-link`/`.cardio-cross-link`
  ya no tienen CSS ni JS propio. **Para añadir un enlace cruzado nuevo:
  escribe el botón con sus `data-*` y ya está — nunca un listener nuevo
  por módulo.** Las ~58 menciones anteriores de este archivo a "nunca
  reutilizar `.tx-link` fuera de Nefrología" describen el estado previo a
  esta revisión; la colisión ya no puede producirse porque ese listener
  no existe. De paso quedaron corregidos 2 bugs latentes: los `.tx-link`
  de la guía ESC de IC y de Trasplante renal solo funcionaban "por
  accidente" a través del listener de Nefrología, y los botones
  `data-atlas-route` de Fisiopatología UCI (que además llevaban la clase
  `tx-link`) disparaban dos handlers por click.
- **Registro de especialidades** (`home/index.js`): los 6 pares
  `let xApi`/`onXListo()` desaparecen; `main.js` inicializa cada
  especialidad con switcher medio propio en bucle y la registra con
  `home.registrarEspecialidad(key, api)` bajo la **misma clave que su
  vista raíz en `topLevel`** (`nefrologia`/`uciPapers`/`fisioUci`/
  `cardiologia`/`neumologia`/`sobrevivirUmi`). Cada `init()` devuelve
  `{ volverAlMenu, irAFicha }` — Nefrología renombró `volverAlMapa` a
  `volverAlMenu` (el mapa del riñón es su menú) e `irANefrotoxicidad`
  desapareció (es `data-especialidad="nefrologia"
  data-view="nefrotoxicidad"`). `irAFicha` ya no se escribe a mano: es el
  que devuelve `createViewSwitcher()` (`core/navigation.js`), con guard
  `if (view)` para que un enlace sin vista no oculte todas las del
  switcher. Los bancos/temas/triggers del quiz se fusionan con
  `flatMap` sobre la misma lista de módulos. **Para añadir una
  especialidad nueva con submenú**: su `index.js` devuelve
  `{ volverAlMenu, irAFicha: xLevel.irAFicha }` + exporta
  `quizTriggerId/quizBanco/quizTemas`, y en `main.js` se añade una
  entrada al objeto `especialidades` y en `home/index.js` su vista a
  `topLevel` + su botón a `BOTONES_ESPECIALIDAD` — nada más.
- **Helpers compartidos nuevos** (`js/core/ui.js`, `js/core/wizard.js`):
  `wireSelectExplicacion(selectId, boxId, datos, render = x => x)` (antes
  copiado en `nefrologia/fisiologia.js` y `fisio-uci/hematologia.js`),
  `pintarGauge(prefijo, valor, max, estado, texto)` para los gauges
  `.kinetic-row` (antes 6 implementaciones; `prefijo` es el id sin el
  sufijo `-fill`/`-num`/`-row`), `clamp()`, `escapeHtml()` (solo para
  texto que viene del usuario, hoy Dudas de guardia y el buscador), e
  `initSiNoWizard(prefijo, pasos)` (los 4 asistentes Sí/No de Cardiología
  conservan solo su árbol de decisión declarativo). `core/corkboard.js`
  exporta ahora `nombreFicha(card, porDefecto)`, reutilizado por
  `core/search.js`. **Cualquier calculadora nueva con gauge/selector/
  wizard debe usar estos helpers**, no copiar el patrón de un módulo
  vecino.
- **Arranque más ligero**: el índice del buscador global se construye la
  primera vez que se abre el buscador (no al cargar); las estimaciones y
  etiquetas 🍅 de Modo Estudio se calculan/inyectan al activar el modo por
  primera vez; las 25 tablas/633 filas de Nefrotoxicidad se renderizan
  cuando la vista se hace visible (`IntersectionObserver`) o al primer
  uso de su buscador, y filtran por un `data-nombre` ya normalizado en
  vez de normalizar 585 `textContent` por pulsación; el reloj Pomodoro
  hace tick cada 1 s (no 250 ms) y guarda el contador en memoria; el
  cronómetro puerta-balón no repinta mientras su ficha está oculta.
- **Bugs corregidos**: `quiz.js` ya no revienta con un banco vacío
  (`empezar([])`) y usa `temasDe()`/`bancoDe()` en vez de 6 bloques de
  filtrado duplicados; el buscador global no indexaba las 18 fichas del
  Manual UMI (faltaba en `PANEL_NAV`/`ESPECIALIDADES`);
  `neutropenia-febril/navigation.js` enganchaba un `querySelectorAll
  ('.back-btn')` GLOBAL (los ~45 "← VOLVER" de toda la app), ahora
  acotado a sus 4 subvistas y sobre `createViewSwitcher`; Dudas de
  guardia tolera un `localStorage` corrupto; los recuentos de la portada
  de Preguntas MC se derivan del banco real en vez de estar escritos a
  mano; la calculadora Overt DIC no revienta si el selector de dímero D
  queda sin opción.
- **Lección de verificación**: Chromium cachea los módulos ES importados
  desde `main.js` entre navegaciones del mismo contexto de Playwright —
  tras editar un `.js`, `nav /` puede seguir ejecutando el código viejo.
  Para verificar un cambio de JS hay que cerrar y relanzar el navegador
  del driver (`quit` + `launch`), no basta con recargar.
- Bump de cache-busting a `?v=20261009` (cambió `js/main.js`; sin cambios
  de CSS en esta ronda).


## Arreglos de código (octubre 2026)

A petición explícita del usuario («los arreglos de código que me has dicho, arréglalo lo mejor que puedas»):

- **`--text-dim` definida** en `css/variables.css` (`#c9bda4`, entre `--text-main` y `--text-muted`). Se usaba en
  ~670 sitios sin existir: en `color:` heredaba el color del padre y no se notaba, pero en los `fill` de SVG pintaba
  negro sobre el fondo oscuro. Las 15 etiquetas afectadas (mecanismos del diagrama de receptores de Merino
  Cardiología y la cascada de radicales libres de Merino Neumología) ya se ven. Cambió `variables.css`: cache-busting
  `?v=20261026-3`.
- **Id `arrowY` duplicado**: el marcador de flecha existía en Fisiopatología UCI · Cardiología y en Merino Neumología,
  con distinto `refX`; como todas las vistas están en el DOM a la vez, `url(#arrowY)` cogía el primero. Ahora son
  `arrowY-fuci` y `arrowY-neumo`. Comprobado con un script: ningún otro id se repite entre los partials (el de
  `eco/laboratorio.html` es otra página).
- **Figura 21 de la guía ESC de IC (HF Team)**: el usuario decidió que se queda (era el punto «a revisar contigo» de la
  auditoría de imágenes de Cardiología). Ya estaba en la Ficha X; comprobado que carga.
- **Erratas de El Libro Azul en las tablas de shock**: notas de fidelidad plegables en las dos tablas de
  Fisiopatología UCI · Cardiología (Ficha 5: RVS «↑» en el distributivo; Ficha 10: RVS «N/↑» en el distributivo y
  ScvO₂ «↑» en el hipovolémico), con enlace a la Tabla 14.1 de Merino. No se cambió ninguna cifra.
- **Saltos de la huella de las aurículas** en el corazón 3D: ver `js/modules/eco/README.md` («Huella de las aurículas
  sin saltos»). AI 8,0 → 0,7 mm y AD 5,7 → 1,1 mm entre dos fotogramas; prueba nueva.

