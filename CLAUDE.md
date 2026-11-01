# HUD Clínico UCI — reglas del proyecto

App web estática de apoyo a la decisión y de estudio para Medicina Intensiva, pensada para consultarse a pie de
cama **en el móvil**. Contenido organizado por especialidad. Todo el contenido clínico sale de fuentes reales
(PDF en `docs/`, guías, protocolos del hospital) y es trazable a ellas.

Este archivo son **las reglas vigentes**, cortas a propósito:
- Las carpetas con reglas propias tienen su `CLAUDE.md` (eco, nefrología, libros, sobrevivir-umi, uci-papers).
  Se cargan solos al trabajar en ellas.
- La historia de cómo se hizo cada parte (decisiones, fuentes, auditorías, cifras) está en `docs/historial/`
  (índice al final). **No la leas entera**: busca con grep lo que necesites.
- Lo pendiente vive en `autonomo/BITACORA.md` (sin aprobar; skill `/bitacora`) y `autonomo/TABLERO.md` (aprobado,
  lo trabaja `/plan-socialista`), no aquí.

## 1. Cómo trabaja el usuario

- Es médico residente de Medicina Intensiva (R1), no programador. **Explícale en lenguaje llano**, sin jerga técnica.
  Si un término técnico hace falta, explícalo en una frase.
- Usa la app en el móvil: piensa siempre en 390 px de ancho.
- **Para trabajos grandes, primero un informe o una propuesta** (a menudo una página tipo Artifact): qué se va a
  hacer, qué falla, qué falta. Después, él dice «aplica todo» o elige. Para rediseños visuales, primero opciones
  visuales para elegir.
- **Pregunta antes de una decisión grande o difícil de deshacer** (fusionar módulos, cambiar arquitectura, quitar
  contenido). Lo pequeño y obvio, hazlo.
- Manda las fuentes en PDF (a veces en varias partes) y espera que no se resuma por debajo de la fuente.
- Si pide algo que contradice una regla de aquí, avísale y que decida él.
- **Vídeos** (Consejo, Congreso, rueda de prensa, estado de un plan o lo que sea; regla del usuario, 01/11/2026):
  siempre un MP4 vertical **con voces de España**, hecho con la fábrica de `autonomo/consejo/video/` (skill `video`).
  Nunca una página animada ni un vídeo mudo, y nunca voces con acento latinoamericano.

## 2. Decisiones de arquitectura (no las reabras sin preguntar)

- **Sin backend, sin login, sin base de datos.** Nada se guarda, con tres excepciones de `localStorage`,
  deliberadas y en el dispositivo del usuario: el quiz (aciertos/fallos y, desde el 28/10/2026, la fecha del último intento, para el repaso espaciado; y, desde el 30/10/2026, en la Mayéutica, en cuántos días distintos acertó cada pregunta, para el indicador de «ideas firmes»), el Modo Estudio (pomodoros, duración y
  progreso por ficha) y Dudas de guardia (las dudas que escribe el usuario). Ninguna persistencia más sin que la pida.
- **Ningún dato de pacientes reales se guarda**, ni en `localStorage` (art. 3a de la reforma, aprobado el 30/10/2026):
  las medidas que se teclean en Guardia viven solo en la pantalla; los casos de las preguntas y los modelos son inventados.
- **Sin build tool ni dependencias.** HTML/CSS/JS que el navegador ejecuta tal cual. GitHub Pages sirve `index.html`.
- **Una sola librería externa, a petición del usuario: Motion 11.18.2** (animaciones), copiada en
  `js/vendor/motion.js` (MIT; ver `js/vendor/README.md`) y cargada solo cuando hace falta con `cargarMotion()` de
  `js/core/motion.js`. Con «reducir movimiento» se muestra el estado final. Ninguna otra librería sin que el usuario
  la elija. Gotcha: en SVG, Motion escribe la opacidad como **atributo** (no fijes `style.opacity`, que manda sobre
  él) y no aplica escalas ni desplazamientos a un `<g>`: anímalos con un número de 0 a 1 y el atributo `transform`.
- **Cada calculadora es código específico**, no un motor genérico.
- **HTML modular vía `fetch()`**: `index.html` es el esqueleto; cada vista es un partial con
  `data-include="ruta.html"` (`js/core/include.js`). **Todos los partials se cargan al arrancar**, aunque estén ocultos.
- **Nunca se fusiona contenido de fuentes distintas**: se conectan con enlaces cruzados. Un manual o una guía no se
  trocea por especialidades (p. ej. el Manual UMI vive entero en Sobrevivir a la UMI).
- Aparte: `backend/` + `admin/` (panel de subida de contenido). La app sigue siendo estática.

## 3. Estructura

```
index.html              esqueleto: cabecera, botones, contenedores data-include. Sin lógica
css/variables.css       paleta y tokens · base.css (reset, layout) · components.css (componentes)
js/main.js              arranque: partials, especialidades, la única llamada a initQuiz()
js/core/                piezas genéricas (ver §5)
js/data/                datos puros sin DOM: tablas y bancos de preguntas (*-preguntas.js)
js/modules/<módulo>/    index.js (arranca el módulo) + <vista>.html + <vista>.js
docs/                   PDF de las fuentes · docs/historial/ (la historia)
autonomo/               plan socialista (trabajo por equipos en bucle): guía, reglas, bitácora, tablero,
                        partes, modelos aprobados y jueces.mjs (el comprobador automático)
backend/ admin/         panel de subida de contenido (aparte de la app)
```

## 4. Navegación

- La raíz (`#especialidades-view` en `index.html`) tiene las puertas: PIF (Hematología, Nefrología), Fisiopatología
  UCI (Cardiología, Neumología, Fisiopatología UCI), UCI / Papers Tuiter, Sobrevivir a la UMI, Eco cardíaca y Libros.
- `js/modules/home/index.js` tiene el switcher raíz (`topLevel`, `createViewSwitcher()` de `core/navigation.js`).
  Cada especialidad con submenú tiene su switcher medio en su `index.js`.
- **Especialidad nueva con submenú**: su `index.js` devuelve `{ volverAlMenu, irAFicha: xLevel.irAFicha }` y exporta
  `quizTriggerId/quizBanco/quizTemas`; en `main.js`, una entrada en el objeto `especialidades`; en `home/index.js`,
  su vista en `topLevel` y su botón en `BOTONES_ESPECIALIDAD`. Nada más.
- **Guía o bloque nuevo dentro de una especialidad**: botón en su `*-menu.html`, su `<vista>.html` con el «← VOLVER»
  de su nivel, registro en `index.html` y en el switcher medio del módulo.
- Los «← VOLVER» usan una clase por destino (`.btn-volver-especialidades`, `.btn-volver-pif-menu`,
  `.btn-volver-cardiorrespi-menu`, `.btn-volver-home`, `.btn-volver-nefro-kidney`, `.btn-volver-fuci-menu`…).
- Una categoría solo de contenido (índice, bibliografía) va como acordeón `.accordion-btn` (`core/accordion.js` la
  detecta sola), no como vista ni nodo de un mapa.

## 5. Piezas compartidas: úsalas, no las copies

- **Enlace cruzado (el único mecanismo)**: `<button data-especialidad="X" data-view data-panel data-tab>`. Lo
  resuelve un listener delegado en `home/index.js`. Sirve entre especialidades y dentro de una (sin `data-view`).
  Extras: `data-trasplante` (con `especialidad="home"`), `data-resaltar="#id"`, `data-pulsar="id1 id2"`,
  `data-en-visual`, `data-eco-vista/escenario/medir/atlas/panel`, `data-nefrona-viva`, `data-glomerulo`,
  `data-acidobase-vivo`, `data-agua-viva`, `data-capilar-vivo`, `data-cateter-vivo`, `data-muralla-viva`,
  `data-telar-vivo`, `data-inmersion-viva` (modelos vivos: cada especialidad los declara en `modelosVivos` de su API;
  su «← VOLVER» lleva a la ficha de origen, `core/volver-ficha.js`). Las claves de
  vista y panel de cada cuaderno están en `PANEL_NAV` de `core/search.js` (Hematología usa `especialidad="home"`). **Nunca un
  listener nuevo por módulo.** `.tx-link`, `.especialidad-link`, `.paper-link`, `.neumo-internal-link` son solo
  estilo.
- **Cuaderno de campo** (`core/corkboard.js`): `initCorkboard(boardId, panelId)`; cada `.field-card[data-tab]` abre
  su `.tab-content`. Cajón (≤12 fichas) u hoja fija abajo (>12). «Siguiente ficha», marca de visto y
  `openCorkboardTopic(panel, tab)` salen solos. Es el patrón para todo contenido teórico.
  Un cuaderno nuevo necesita su entrada en `PANEL_NAV` de `core/search.js`, o el buscador global no lo encuentra.
- **`core/ui.js`**: `arrancar(nombre, init)` (cada modelo vivo, cuaderno o especialidad arranca por separado: si falla, el resto sigue), `wireSelectExplicacion()`, `pintarGauge()` (gauges `.kinetic-*`), `clamp()`, `escapeHtml()`
  (solo para texto que escribe el usuario). **`core/wizard.js`**: `initSiNoWizard()`.
- **Motores compartidos** (art. 10 de la reforma, aprobado el 30/10/2026, adaptado a los dos motores de B-045): el
  motor del corazón (`js/modules/eco/motor.mjs`) y su **contrato** con el motor de la imagen (`contrato.mjs`, cuando
  exista) son una API que usa también el shock vivo. Quien los toque corre las pruebas de la eco
  (`node --test 'js/modules/eco/pruebas/*.test.mjs'`) y `jueces --modelo shock-vivo`, y deja la API antigua funcionando:
  el contrato congelado en su prueba, y los que leen del motor migran de uno en uno, nunca antes que el motor. Un cambio
  en una pieza de `js/core/` que usan más de 20 fichas lleva maqueta, `jueces --ficha` en 3 fichas y versión nueva.
- **Pestañas** (`core/tabs.js`, ya casi sin uso): `initTabs(contenedor)` siempre acotado a su contenedor, nunca
  `document`; si no, los grupos de pestañas de módulos distintos se pisan.
- **Vista Visual** (`core/vista-visual.js`, `core/visual-kit.js`): interruptor Texto | Visual.
  `montarVisual(tabId, receta)` con paneles cuyos nodos apuntan al texto real; o una función para una simulación
  propia. La imagen **no calcula**: escribe en la calculadora real y copia su resultado. Todo marcador lleva «Ver en
  el texto». Si una imagen y una calculadora comparten datos, esos datos van **una sola vez** en `js/data/`.
  En las recetas, cada nodo apunta a su texto **por id** (`fuente: '#id'`), no por cómo empieza: «Fase I» encontró
  la «Fase II» (revisión de Marino, octubre 2026).
- **Acordeón `.micro-prof-item`**: dentro, `<dl class="kv-row">` para campos con etiqueta, `<ul class="term-chips">`
  para términos sueltos, prosa con `<strong>` solo en lo clave.
- **Estados y resaltes**: `.tfg-estado-ok/warn/danger/neutro`; rotulador `.hl` y `.hl-verde/rojo/azul/purpura`
  (rojo alarma, verde normal, azul mecanismo, púrpura definición); `.grade-badge` (Clase I verde, IIa/IIb
  `.yellow`, III `.red`); notas de fidelidad en `<details class="nota-plegable">`; `.comparativa-fuentes`.
- **Bibliografía**: `.biblio-link` + `.biblio-nota`. Nunca `.pkpd-btn` (está atado a la calculadora PK/PD).
- **Figuras**: `<div class="article-figure"><img loading="lazy">` + `.article-figure-caption` (lightbox gratis).
  Nunca un `<img>` que apunte a un archivo que no se llegó a extraer. Un SVG recreado lleva su propio fondo
  (`var(--bg-main)`): la caja de `.article-figure` es blanca y el texto claro de la app desaparece en ella.
- **Ocultar** con el atributo `hidden` (regla global `[hidden]{display:none!important}`).
- **Color**: solo los tokens de `css/variables.css`, nunca colores nuevos. Ojo: `--accent-blue` es en realidad un
  dorado casi igual a `--accent-yellow` (no los uses juntos para distinguir cosas) y `--accent-green` se ve apagado
  sobre el fondo oscuro. La identidad nunca va solo por color: añade icono, texto o forma.

## 6. Archivos modelo: copia su estructura

| Para hacer… | Mira |
|---|---|
| Fichas de cuaderno de campo con figuras y una calculadora | `js/modules/merino-hemato/merino-hemato.html` + `index.js` (escala 4Ts) |
| Vista Visual con receta del kit | `js/modules/merino-hemato/visual.js` |
| Simulación propia en la vista Visual | `js/modules/nefrologia/hiperpotasemia-sim.js` (+ `potasio-escena.js`) |
| Asistente paso a paso Sí/No | `js/modules/cardiologia/insuficiencia-cardiaca.js` (`initSiNoWizard`) |
| Escala puntuable con `<select>` | `js/modules/generales/charlson.js` |
| Banco de preguntas | `js/data/merino-hemato-preguntas.js` |
| Preguntas para estudiar (recorrido, formatos y caso clínico) | `autonomo/modelos/preguntas-para-estudiar.html` (maqueta aprobada) |
| Especialidad con submenú (el `index.js` más simple) | `js/modules/neumologia/index.js` |
| Enlace cruzado | `js/modules/fisio-uci/vias-urinarias.html` (botones `.especialidad-link`) |
| Capítulo del atlas de eco | `js/modules/eco/atlas/cap-sistolica.html` + `sistolica.mjs` |
| Mecanismo animado paso a paso (Motion) | `js/modules/cardiologia/receptores-animados.js` |
| Modelo vivo con su Mayéutica y casos | `js/modules/libros/capilar-vivo.js` (sus enganches) sobre el motor común `js/core/mayeutica-motor.js` (`crearMayeuticaModelo`) (+ `-escena.js`, `js/data/capilar-vivo-data.js`, prueba `autonomo/pruebas/capilar-vivo.mjs`) |
| Estudiar en una ficha (Texto \| Estudiar) | `js/core/mayeutica.js` (el recorrido) sobre `js/core/mayeutica-motor.js` + `js/data/mayeutica/b1-fluidos.js` (formato arriba del archivo); prueba `mayeutica-fichas` |

## 7. Contenido clínico

1. **Nunca inventes.** Toda cifra, dosis o afirmación sale de una fuente que se puede abrir. Si la ficha no lo dice,
   **se busca otra fuente y se cita** (`autonomo/REGLAS.md` §1.15); «fisiología general» sin cita solo para lo
   trivial, y hueco solo si se buscó y no se encontró.
2. **Fuentes**: el PDF va a `docs/` y se enlaza con `#page=N` (calcula el desplazamiento entre página impresa y
   página del PDF, y compruébalo). Webs: solo URLs verificadas (que salgan literalmente en los resultados de
   búsqueda), nunca un buscador genérico en lugar del artículo; si no se encuentra, se omite.
3. **Leer un PDF largo**: en lotes de 6-8 páginas. Si un lote devuelve menos páginas de las pedidas, relee las que
   faltan; no las des por leídas.
4. **Origen visible** en simuladores y calculadoras: `ficha`, `fisiología general` o `ilustrativo`.
5. **Erratas de la fuente**: se reproducen tal cual con nota de fidelidad. **Fuentes que discrepan**: se muestran las
   dos con una nota de fuentes; nunca se elige una ganadora por criterio propio. **Errata de dosis**: la dosis
   habitual y una nota visible con lo que imprime el libro. **Notas de interpretación**: siempre con su fuente. Si
   hay duda o mucha discordia, se busca en la web y se cita (ver §7.2 y `autonomo/REGLAS.md` §1.8-1.9).
6. **No resumas por debajo de la fuente**: cifras, fármacos, mecanismos y tablas completas.
7. **Tablas** de la fuente → `.data-table` nativas (en `overflow-x:auto` si son anchas). **Imágenes**: solo fotos y
   registros reales (eco, Rx, TC, histología, ECG); gráficos y flujogramas se recrean. Extracción con `pdfimages`; si
   la figura está fragmentada en muchos trozos, rasterizar la página y recortar.
8. **PNT y manuales internos del hospital**: nunca reproducir el documento ni los nombres del personal; extraer el
   contenido clínico, reescribirlo y citarlo de forma genérica. Los puramente administrativos se descartan.
9. **Código ajeno** (echodemo, ATRIA, Ventriculus; Consejo 8.ª del 30/10/2026, aprobado por el usuario el 30/10): ideas
   y texto, con permiso del autor apuntado en `docs/`, sí. El código **no entra en la app**: se reconstruye sobre los
   motores propios, con crédito (un solo motor por fenómeno). Para estudiarlo y comparar, con permiso que cubra
   redistribuirlo en este repositorio público, una copia congelada puede vivir en `autonomo/ajenos/<autor>-<versión>/`
   (fecha, URL, hash, permiso y LEEME); ningún archivo de la app la carga y sus cifras son pares de prueba, no fuente. El
   permiso vale por escrito o de palabra (p. ej. por teléfono): si es de palabra, el usuario lo deja apuntado en `docs/`
   (quién, cuándo, por qué medio y qué cubre). Cada permiso nuevo lo valida el Consejo. Copiar código dentro de la app,
   solo por decisión expresa del usuario, caso por caso. Nada de imágenes de pacientes con licencia restrictiva (CAMUS,
   EchoNet).
   **Recursos estudiados** (art. 2 de la reforma, 30/10/2026): una web, simulador, curso, repositorio o tuit estudiado
   aporta ideas; no es fuente clínica. Antes de traer texto, imagen, malla o dato se anota su licencia o permiso (el
   permiso, apuntado en `docs/`). Sin licencia verificada, solo la idea reescrita.
10. **Calculadoras**: `calcX()` + `init()`; un campo vacío nunca es 0 (`el.value === ''`); clamp de rangos; aviso de
    «combinación no fisiológica»; scores aditivos sí, regresiones complejas sin verificar (p. ej. KFRE) no. Casillas
    que suman puntos: clase `.puntuable` o `<select>` (la regla general tacha lo marcado). Los umbrales se comparan
    redondeados (2,3 − 2,0 da 0,2999): el resultado nunca contradice su veredicto por el redondeo.
11. **Texto de las fichas**: en el gancho de una ficha, no unas 3 o más palabras con «/» sin espacios
    («α1/α2/β1»): no parte la línea y desborda en el móvil.
12. **Si el usuario pide convenciones que no están aquí, pregunta** antes de asumir que vienen de otro proyecto.

## 8. Quiz y preguntas para estudiar

- **Las preguntas nuevas siguen `autonomo/REGLAS.md` §8** (aprobado por el usuario el 14/10/2026; modelo
  `autonomo/modelos/preguntas-para-estudiar.html`): botón **Texto | Visual | Preguntas** en la ficha, recorrido en el
  orden del texto, repaso de lo fallado y caso clínico que evoluciona; solo test con «piensa antes», «piensa y
  destapa» y «encuentra el error». **No se escriben más de redactar**, ni huecos ni emparejar. Las preguntas viejas
  se quedan como están hasta que el usuario pida reconvertirlas. Mientras la tarea `preguntas` del tablero no esté
  hecha, las nuevas van en el formato de test actual con ese estilo (razonamiento, distractores verosímiles).
- **Una sola llamada a `initQuiz()`**, en `main.js`. Cada especialidad exporta `quizTriggerId/quizBanco/quizTemas`
  (con `asignatura` y `bloque` para el menú de 3 niveles).
- Pregunta: `{ id, tema, enunciado, opciones, correcta, explicacion }` (las viejas de `{ tipo: 'redactar' }`
  siguen funcionando). En los bancos, `<` y `>` literales, nunca `&lt;`. Las opciones se barajan solas.
- **Nunca un tema sin preguntas** (rompe el quiz). Cuántas: una por idea importante de la ficha, más el caso.
- Botones «Repasar» con `data-quiz-asignatura` + `data-quiz-bloque` (+ `data-quiz-elegir`, `data-quiz-tema`,
  `data-quiz-bloques`) para abrir directamente su parte.

## 9. Cómo probar

- Servir con `python3 -m http.server 8000` (con `file://` no funciona). Para conducir la app: skill
  `run-fiebres-neutropenias` (Playwright, móvil 390×844).
- **Comprueba a 390 y 360 px**: sin desbordamiento horizontal, sin errores de consola, la ficha abierta de verdad
  (`.active` y visible), calculadoras con valores concretos, imágenes cargadas (`naturalWidth > 0`).
- **Trampas conocidas**:
  - El DOM tiene todas las vistas a la vez: usa `#id` precisos, nunca selectores de texto ni `.tab-content.active`
    sin acotar.
  - Abrir una ficha son dos toques (abrir la tarjeta y su botón): las imágenes `lazy` no cargan hasta entonces.
  - `.click()` no ejercita `:active`: usa `mouse.down/up`. Si una ficha «no abre» en una prueba, prueba un click
    directo en el DOM antes de dar por roto el código.
  - Chromium cachea los módulos ES: tras editar un `.js`, relanza el navegador.
  - Ningún `:active`/`:hover` con `transform`, `filter`, `perspective` ni `backdrop-filter` sobre algo que contenga un
    elemento `position:fixed` (encierra la hoja fija y la hace intocable en el móvil).
  - Comprueba ids duplicados en cada bloque nuevo (todas las vistas comparten el DOM).
- **Versión de la app (cache-busting)**: si cambia cualquier pieza (`.css`, un módulo `.js`/`.mjs` o un fragmento
  `.html` de `js/`), ejecuta `node autonomo/version.mjs AAAAMMDD-N`: pone esa versión en todo `index.html` y regenera
  el mapa que da la versión a cada módulo (así el móvil no mezcla piezas de dos versiones). Los jueces lo comprueban.
  La versión se ve al final del menú principal.

## 10. Git

- Rama de trabajo `claude/medical-app-restructure-5xv3qn`. Tras cada tanda: commit, push y merge a `main`
  (`git checkout main && git merge --ff-only origin/<rama> && git push origin main`, y volver a la rama). Si el
  fast-forward falla, avisa al usuario; no reescribas historia.
- **Plan socialista** (`/plan-socialista`): el contenido de un bloque va a una rama `auto/<bN>` con una sola PR en
  borrador, y el usuario solo se para 4-5 veces por bloque (`autonomo/REGLAS.md` §2.3). **La PR entra en `main` por
  votos del Consejo** (desde el 30/10/2026, REGLAS §4.15): jueces en verde, auditor sin graves, profesor ≥ 9,5 (desde el
  01/11/2026; meta 10, con receta del profesor) y mayoría del Consejo; el usuario la ve después y pide arreglos si quiere. Los arreglos,
  los fallos de los jueces y las mejoras técnicas van directo a `main` con los jueces en verde, sin pedir aprobación.

## 11. Redacción e idioma

Todo en español: contenido, interfaz y comentarios. Frases cortas, voz activa, sin muletillas. Nombra las cosas
como las conoce un médico, no como están hechas por dentro. Los botones dicen lo que hacen.

## 12. Antes de dar un trabajo por terminado

- [ ] `node autonomo/jueces.mjs` en verde (añade `--eco`, `--atlas <clave>` o `--ficha esp:vista:panel:pestaña`
      según lo que tocaste): imágenes, quiz, caché, ids, errores y desbordamiento a 390 y 360 px. Con `--ficha`
      abre también la vista Visual de cada bloque. Si tocaste un modelo vivo con preguntas, `--modelo <clave>`
      (prueba en `autonomo/pruebas/<clave>.mjs`): mide el desborde tras cada respuesta y cada paso de los casos.
- [ ] Probado en el navegador a 390 y 360 px: sin desbordamiento, sin errores de consola, todo abre y calcula (§9).
- [ ] Si tocaste el simulador de eco: `node --test 'js/modules/eco/pruebas/*.test.mjs'` en verde.
- [ ] Si hay un simulador: en los extremos y el punto medio de cada mando, las constantes son las de un paciente
      posible (PA, FC, presiones, volúmenes, velocidades). El límite es la fisiología humana: una cifra imposible o
      muy alejada de la realidad no se recorta, se busca dónde está el error y se corrige en su origen.
      Cada mando tiene tope con origen y, al pasarse, consecuencia visible de paciente real (sello, constantes, frase
      viva): nada de 20 L de suero sin que pase nada (`autonomo/REGLAS.md` §1.14).
- [ ] Toda cifra nueva tiene su fuente y su página; las erratas y discrepancias, con su nota.
- [ ] Contenido nuevo o rehecho: **sirve para estudiar** (`autonomo/REGLAS.md` §7): arriba la idea y la figura, nada
      de muros de texto, 1-3 cosas resaltadas por bloque y el mecanismo visible con las piezas de la app, al nivel de
      los modelos (receptores animados, atlas 14 y 10, nefrona viva, vista Visual). Preguntas nuevas: REGLAS §8.
      Ficha nueva: abre con el carril de 30 segundos (idea, 2-3 cifras, figura) y debajo el desarrollo (REGLAS §7.13).
- [ ] Ningún id duplicado; ningún `<img>` sin archivo; ningún tema de quiz sin preguntas.
- [ ] Si cambió una pieza de la app: `node autonomo/version.mjs AAAAMMDD-N` (§9).
- [ ] La historia del trabajo, añadida al archivo de `docs/historial/` que toque (no aquí). Este archivo, solo si
      cambia una regla. Si hay algo pendiente nuevo, va a `autonomo/BITACORA.md` (el tablero, solo lo aprobado).
- [ ] `git checkout -- .gitignore .ignore` (las herramientas los ensucian), commit, push y merge a `main` (§10).
- [ ] Al usuario, en llano: qué se hizo, qué se comprobó y qué queda para él.

## 13. Índice del historial (`docs/historial/`)

| Archivo | Qué cuenta |
|---|---|
| `general.md` | El texto original de introducción, arquitectura, estructura y convenciones |
| `hematologia.md` | Atlas, citopenias, neutropenia febril, reconocimiento, síndromes urgentes, trasplante, Merino HEMATO, escalas generales y sus auditorías |
| `nefrologia.md` | Mapa del riñón, fisiología y electrolitos, HTA, ERC, FRA, TRR, nefrotoxicidad, trasplante renal, PNT, auditorías y simulaciones (potasio, nefrona, glomérulo y filtro vivos) |
| `uci-papers.md` | Los papers de UCI / Papers Tuiter |
| `fisio-uci.md` | Fisiopatología UCI (El Libro Azul): Hematología, Vías Urinarias, Cardiología, Inmunología |
| `cardiologia.md` | Guía ESC 2026 de IC y Merino Cardiología |
| `neumologia.md` | Merino Neumología |
| `sobrevivir-umi.md` | Manual UMI, Dudas de guardia, Preguntas difíciles, Técnicas R1 |
| `libros.md` | Índice de libros y Marino caps. 1-11 y 31-53 |
| `menu-y-buscador.md` | Rediseño de la raíz, PIF, Constelación y buscador global |
| `modo-estudio.md` | Modo Estudio y Pomodoro |
| `vista-visual.md` | Vista Visual y su kit de recetas |
| `revisiones-de-codigo.md` | Revisión de código de octubre 2026 y arreglos posteriores |
| `panel-subida.md` | `backend/` y `admin/` |
| `eco.md` | Decisiones de Circulación viva y Eco cardíaca (el detalle técnico, en `js/modules/eco/README.md`) |
| `bitacora.md` | Lo que sale de la bitácora: lo hecho hace más de 7 días y lo descartado |
| `trabajo-autonomo.md` | Por qué y cómo se reorganizó `CLAUDE.md`, el plan socialista (`autonomo/`, la skill y los agentes) y sus pruebas |
| `radar.md` | Ingeniería inversa de simuladores ajenos (23/10/2026), el norte en tres niveles, datos de pacientes y propuestas de reglas pendientes |
