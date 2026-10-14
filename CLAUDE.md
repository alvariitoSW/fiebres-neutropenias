# HUD Clínico UCI — reglas del proyecto

App web estática de apoyo a la decisión y de estudio para Medicina Intensiva, pensada para consultarse a pie de
cama **en el móvil**. Contenido organizado por especialidad. Todo el contenido clínico sale de fuentes reales
(PDF en `docs/`, guías, protocolos del hospital) y es trazable a ellas.

Este archivo son **las reglas vigentes**, corto a propósito. La historia de cómo se construyó cada parte
(decisiones, fuentes, auditorías, verificaciones, cifras) está en `docs/historial/` (índice al final). **No leas el
historial entero**: busca con grep la sección que necesites. Cada módulo grande tiene además su propio
`README.md` (p. ej. `js/modules/eco/README.md`).

## 1. Decisiones de arquitectura (no las reabras sin preguntar)

- **Sin backend, sin login, sin base de datos.** Nada se guarda, con tres excepciones de `localStorage`,
  deliberadas y en el dispositivo del usuario: el quiz (aciertos/fallos por pregunta), el Modo Estudio (pomodoros,
  duración y progreso por ficha) y Dudas de guardia (las dudas que escribe el usuario). Ninguna persistencia más
  sin que el usuario la pida.
- **Sin build tool.** Sin npm/Vite/webpack: HTML/CSS/JS que el navegador ejecuta tal cual. Se despliega en GitHub
  Pages sirviendo `index.html`. Sin dependencias nuevas.
- **Cada calculadora es código específico**, no un motor genérico. Se acepta algo de repetición a cambio de
  legibilidad.
- **HTML modular vía `fetch()`**: `index.html` es el esqueleto; cada vista/calculadora es un partial cargado con
  `data-include="ruta.html"` (`js/core/include.js`). Todos los partials se cargan al arrancar, aunque estén ocultos.
- **Excepción aparte**: `backend/` + `admin/` (panel de subida de contenido con GitHub Actions y el Agent SDK). Es
  una pieza separada; la app sigue siendo estática. Ver `docs/historial/panel-subida.md`.

## 2. Estructura

```
index.html              esqueleto: cabecera, botones, contenedores data-include. Sin lógica
css/variables.css       paleta y tokens (:root) · base.css (reset, layout) · components.css (componentes)
js/main.js              arranque: carga partials, inicializa especialidades, la única llamada a initQuiz()
js/core/                infraestructura genérica (ver §4)
js/data/                datos puros sin DOM: tablas, bancos de preguntas (*-preguntas.js)
js/modules/<módulo>/    index.js (arranca el módulo) + <vista>.html + <vista>.js
docs/                   PDF de las fuentes (enlazados con #page=N) · docs/historial/ (la historia)
autonomo/               trabajo autónomo en bucle: guía, reglas y tablero (ver §9)
backend/ admin/         panel de subida de contenido (aparte de la app)
```

Módulos: `home` (raíz y Hematología: Atlas, citopenias, PIF), `neutropenia-febril`, `reconocimiento`,
`sindromes-urgentes`, `trasplante`, `merino-hemato`, `generales` (Escalas Generales), `fuentes`, `nefrologia`,
`uci-papers`, `fisio-uci`, `cardiologia`, `neumologia`, `sobrevivir-umi`, `libros`, `eco`, `quiz`.

## 3. Navegación

- **Raíz** (`#especialidades-view`): 6 puertas — PIF (Hematología + Nefrología), Fisiopatología UCI (Cardiología,
  Neumología, Fisiopatología UCI), UCI / Papers Tuiter, Sobrevivir a la UMI, Eco cardíaca y Libros.
- `js/modules/home/index.js` tiene el switcher raíz (`topLevel`, `createViewSwitcher()` de
  `core/navigation.js`). Cada especialidad con submenú tiene su propio switcher medio en su `index.js`.
- **Añadir una especialidad con submenú**: su `index.js` devuelve `{ volverAlMenu, irAFicha: xLevel.irAFicha }` y
  exporta `quizTriggerId/quizBanco/quizTemas`; en `main.js`, una entrada en el objeto `especialidades`; en
  `home/index.js`, su vista en `topLevel` y su botón en `BOTONES_ESPECIALIDAD`. Nada más.
- **Añadir una guía/bloque dentro de una especialidad**: botón en su `*-menu.html`, su `<vista>.html` con el botón
  «← VOLVER» de su clase, registro en `index.html` y en el switcher medio del módulo.
- Los «← VOLVER» usan una clase por nivel de destino (`.btn-volver-especialidades`, `.btn-volver-pif-menu`,
  `.btn-volver-cardiorrespi-menu`, `.btn-volver-home`, `.btn-volver-nefro-kidney`, `.btn-volver-fuci-menu`…).

## 4. Piezas compartidas: úsalas, no las copies

- **Enlace cruzado (el único mecanismo)**: `<button data-especialidad="X" data-view data-panel data-tab>`. Lo
  resuelve un listener delegado en `home/index.js` (`irAResultadoBusqueda`). Sirve entre especialidades y dentro
  de una (sin `data-view`). Extras: `data-trasplante` (subvista de Trasplante, con `especialidad="home"`),
  `data-resaltar="#id"`, `data-pulsar="id1 id2"`, `data-en-visual`, `data-eco-vista/escenario/medir/atlas`,
  `data-nefrona-viva`, `data-glomerulo`. **Nunca un listener nuevo por módulo.** Las clases `.tx-link`,
  `.especialidad-link`, `.paper-link`, `.neumo-internal-link` son solo visuales.
- **Cuaderno de campo** (`core/corkboard.js`): `initCorkboard(boardId, panelId)`; cada `.field-card[data-tab]`
  abre su `.tab-content`. Modo cajón (≤12 fichas) o compacto con hoja fija (>12). «Siguiente ficha», marca de visto
  y `openCorkboardTopic(panel, tab)` salen solos. Patrón para cualquier contenido teórico.
- **`js/core/ui.js`**: `wireSelectExplicacion()` (select → explicación), `pintarGauge()` (gauges `.kinetic-*`),
  `clamp()`, `escapeHtml()` (solo texto del usuario). **`core/wizard.js`**: `initSiNoWizard()` (asistentes Sí/No).
- **Vista Visual** (`core/vista-visual.js`, `core/visual-kit.js`): interruptor Texto | Visual por tarjeta/ficha.
  `montarVisual(tabId, receta)` con paneles declarativos cuyos nodos apuntan al texto real (`fuente`); o una función
  para una simulación propia. La imagen **no calcula**: escribe en la calculadora real y copia su resultado. Cada
  marcador lleva «Ver en el texto». Detalle en `docs/historial/vista-visual.md`.
- **Acordeón `.micro-prof-item`**: dentro, `<dl class="kv-row">` para campos con etiqueta, `<ul class="term-chips">`
  para términos sueltos, prosa con `<strong>` solo en lo clave.
- **Estados y resaltes**: `.tfg-estado-ok/warn/danger/neutro`; rotulador `.hl` y `.hl-verde/rojo/azul/purpura`
  (rojo alarma, verde normal, azul mecanismo, púrpura definición); `.grade-badge` (Clase I verde, IIa/IIb
  `.yellow`, III `.red`); notas de fidelidad en `<details class="nota-plegable">`; `.comparativa-fuentes`.
- **Figuras**: `<div class="article-figure"><img loading="lazy">` + `.article-figure-caption` (lightbox gratis).
- **Ocultar** con el atributo `hidden` (hay una regla global `[hidden]{display:none!important}`).

## 5. Contenido clínico

1. **Nunca inventes.** Toda cifra, dosis o afirmación sale de una fuente que se puede abrir. Si no está, se anota
   como hueco; no se rellena con conocimiento general sin decirlo.
2. **Fuentes**: el PDF va a `docs/` y se enlaza con `.biblio-link` + `#page=N` (calcula el desplazamiento de
   página del PDF y compruébalo). Para webs: solo URLs verificadas (que aparezcan literalmente en los resultados de
   búsqueda); nunca un buscador genérico como sustituto de un artículo. Si no se encuentra, se omite.
3. **Origen visible** en simuladores y calculadoras: `ficha`, `fisiología general` o `ilustrativo`.
4. **Erratas de la fuente**: se reproducen tal cual con nota de fidelidad. **Fuentes que discrepan**: se muestran
   las dos con una nota de fuentes; nunca se elige una ganadora por criterio propio.
5. **No resumas por debajo de la fuente**: cifras, fármacos, mecanismos y tablas completas.
6. **Tablas** de la fuente → `.data-table` nativas (envueltas en `overflow-x:auto` si son anchas). **Imágenes**:
   solo fotos y registros reales (eco, Rx, TC, histología, ECG); los gráficos y flujogramas se recrean. Extracción
   con `pdfimages`; si la figura está fragmentada (InDesign), rasterizar la página y recortar.
7. **PNT y manuales internos del hospital**: nunca reproducir el documento ni los nombres del personal; extraer el
   contenido clínico y reescribirlo; citar de forma genérica. Los puramente administrativos se descartan.
8. **Código ajeno** (echodemo, ATRIA): ideas y texto (con permiso) sí, código no; se reconstruye sobre los motores de
   la app. Nada de imágenes de pacientes con licencia restrictiva.
9. **Calculadoras**: `calcX()` + `init()`; nunca tratar un campo vacío como 0 (`el.value === ''`); clamp de rangos;
   avisos de «combinación no fisiológica»; scores aditivos sí, regresiones complejas sin verificar (p. ej. KFRE) no.
   Casillas de una escala que suma puntos: clase `.puntuable` o `<select>` (la regla general tacha lo marcado).
10. **Si el usuario pide convenciones que no están aquí, pregunta** antes de asumir que vienen de otro proyecto.

## 6. Quiz

- **Una sola llamada a `initQuiz()`**, en `main.js`. Cada especialidad exporta `quizTriggerId/quizBanco/quizTemas`
  (con `asignatura` y `bloque` para el menú de 3 niveles).
- Pregunta: `{ id, tema, enunciado, opciones, correcta, explicacion }` o `{ tipo: 'redactar', enunciado,
  respuestaModelo }`. Escribe `<`/`>` literales en los bancos, nunca `&lt;`. Las opciones se barajan solas.
- **Nunca un tema sin preguntas** (rompe el quiz). Ritmo habitual: ~8 por ficha (6 + 2 de redactar); papers de UCI
  Tuiter, formato reducido (8-10 + 3-4 de redactar).
- Botones «Repasar» con `data-quiz-asignatura` + `data-quiz-bloque` (+ `data-quiz-elegir`, `data-quiz-tema`,
  `data-quiz-bloques`) para abrir directamente su parte.

## 7. Cómo probar

- Servir con `python3 -m http.server 8000` (con `file://` no funciona). Para conducirla, la skill
  `run-fiebres-neutropenias` (Playwright, móvil 390×844).
- **Comprueba siempre a 390 y 360 px**: sin desbordamiento horizontal, sin errores de consola, ficha abierta de
  verdad (`.active` y visible), calculadoras con valores concretos.
- Trampas conocidas: el DOM tiene todas las vistas a la vez (usa `#id` precisos, no selectores de texto);
  `.click()` no ejercita `:active` (usa `mouse.down/up`); Chromium cachea los módulos ES (relanza el navegador tras
  editar un `.js`); comprueba ids duplicados en cada bloque nuevo.
- Simulador de eco: `node --test 'js/modules/eco/pruebas/*.test.mjs'` en verde antes de subir.
- **Cache-busting**: si cambia un `.css` o `js/main.js`, sube la fecha `?v=AAAAMMDD` de `index.html` (con sufijo
  `-2`, `-3` si es el segundo despliegue del día).

## 8. Git

- Rama de trabajo `claude/medical-app-restructure-5xv3qn`. Tras cada tanda: commit, push y merge a `main`
  (`git checkout main && git merge --ff-only origin/<rama> && git push origin main`, y volver a la rama). Si el
  fast-forward falla, avisa al usuario; no reescribas historia.
- **Antes de cada commit**: `git checkout -- .gitignore .ignore` (herramientas como graft los ensucian).
- **Excepción**: el trabajo autónomo en bucle (§9) va a ramas `auto/<tarea>` con PR en borrador; solo el usuario
  la aprueba.

## 9. Trabajo autónomo

`autonomo/` tiene la guía para el usuario (`LEEME.md`), el listón de calidad del bucle (`REGLAS.md`) y el tablero
de tareas (`TABLERO.md`). En modo bucle: una tarea acotada, máximo de vueltas, verificación objetiva en cada vuelta
y resultado en PR.

## 10. Redacción e idioma

Todo en español: contenido, interfaz y comentarios. Frases cortas, voz activa, sin muletillas. Nombra las cosas
como las conoce un médico, no como están hechas por dentro. Los botones dicen lo que hacen.

## 11. Pendiente (decidido con el usuario)

- **Orden de trabajo pedido**: 1) Marino completo (hecho, octubre 2026); 2) terminar El Libro Azul (hay secciones
  I, II, III y VII); 3) el PIF de R1: las 7 rotaciones sin contenido (Radiología de tórax, Neurorradiología,
  Cardiología, Medicina Interna, Infecciosas, Neurología, Neumología). Todo depende de que el usuario mande los PDF.
- **TRR (Nefrología)**: cotejar con el PDF de Valdenebro 2021 las 7 dudas anotadas (`docs/historial/nefrologia.md`)
  si el usuario lo manda. ECIL-10, BCSH 2009 y las citopenias distintas de la neutropenia febril: descartadas.
- **Eco cardíaca**: 21 capítulos del atlas (ver `autonomo/TABLERO.md`), calibrar la RVS, medir fps en el móvil, más
  formas de enfermedad (`js/modules/eco/README.md`, «Pendiente»).
- **Panel de subida**: falta la clave de la API y desplegar el Worker (`backend/README.md`).

## 12. Índice del historial (`docs/historial/`)

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

**Cuando termines un trabajo**, añade su historia al archivo de `docs/historial/` que corresponda (no a este) y,
solo si cambia una regla vigente, actualiza la sección de este archivo.
