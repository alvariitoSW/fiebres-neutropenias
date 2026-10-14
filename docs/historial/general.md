# Historial · Introducción, arquitectura, estructura y convenciones (texto original)

> Texto movido tal cual desde el antiguo `CLAUDE.md` (octubre 2026). Es la historia de cómo se construyó
> esta parte: decisiones, fuentes, auditorías y verificaciones. Las reglas vigentes están en `CLAUDE.md`.

# HUD Clínico UCI — guía para trabajar en este repo

App web de estratificación de riesgo clínico y apoyo a la decisión en UCI,
organizada por especialidad. Hoy tiene contenido completo de **Hematología**
(manejo de citopenias, reconocimiento temprano del paciente hematológico,
síndromes urgentes, trasplante de progenitores, más un acceso directo a
escalas generales de UCI), **Nefrología** con contenido real en la mayoría
de sus objetivos de rotación (fisiología/electrolitos, HTA, ERC, FRA, TRR,
ajuste de fármacos), **UCI / Papers Tuiter** con varios papers resumidos
(resucitación hemodinámica en shock séptico, óxido nítrico inhalado,
disfunción del VD y LRA postoperatoria, VExUS, extubación traqueal y
toxicidad por citrato en TRR continua), **Fisiopatología UCI** con
repasos de capítulos de "El Libro Azul: Bases Fisiopatológicas de la
Medicina Crítica" (hoy, Hematología y Hemostasia en Cuidados Críticos,
Vías Urinarias, Cardiología e Inmunología), **Cardiología** con guías de
práctica clínica de manejo (hoy, Insuficiencia Cardíaca — Guías ESC 2026 —
y Merino Cardiología, sobre shock clínico — a diferencia del bloque de
Cardiología de Fisiopatología UCI, que es fisiopatología pura, no
manejo), y **Neumología** con Merino Neumología (embolia pulmonar, asma/
EPOC, SDRA, oxigenoterapia/VNI, ventilación mecánica, vía aérea
artificial, NAV y destete), más **Libros**, un índice central de los libros de texto
(*The ICU Book* de Marino y El Libro Azul) que además aloja los caps. 1-11 y 31-53 de Marino y sus apéndices. Está pensada para ir creciendo con más
especialidades (radiología, etc.) según se vaya aportando contenido. Es
una herramienta de apoyo para médicos, pensada para consultarse a pie de
cama en el móvil.

> **Contenido teórico pendiente, guardado a petición del usuario para
> retomarlo más adelante (octubre 2026):** los huecos del Manual UMI están
> cerrados (octubre 2026, ver «Huecos del manual cerrados» en Sobrevivir a
> la UMI). Queda solo lo que necesita PDF: Valdenebro 2021 (auditoría de
> `trr.html`, con las 7 dudas anotadas en la sección de TRR), solo si el
> usuario lo manda. ECIL-10, BCSH 2009 (CID) y las citopenias distintas de
> la neutropenia febril **quedan descartadas** (el usuario dijo que ya le
> dan igual). Con los huecos cerrados se le recordó al usuario que toca
> volver a la ecografía (RVS sin calibrar, fps en el móvil, más formas de
> enfermedad; ver `js/modules/eco/README.md`).
>
> **Orden de trabajo pedido después por el usuario (octubre 2026)**, por
> delante de los pendientes de arriba y de la ecografía: 1) terminar de
> subir Merino (*The ICU Book* (5.ª ed.) de Marino): **hecho, octubre 2026** — el libro entero está en la app
> (caps. 1-53 y los 3 apéndices; los caps. 1-11 y 31-53 en la sección Libros);
> 2) terminar El Libro Azul (hoy hay las secciones I, II, III y VII);
> 3) el contenido del PIF de R1 (las 7 rotaciones sin contenido:
> Radiología de tórax, Neurorradiología, Cardiología, Medicina Interna,
> Infecciosas, Neurología y Neumología — esto **sí** vuelve a estar
> pedido). Todo depende de que el usuario mande los PDF.

## Decisiones de arquitectura (ya tomadas, no las reabras sin preguntar)

- **Sin backend, sin login, sin base de datos.** Es una calculadora estática:
  el usuario abre la página, rellena campos, ve un resultado. Nada se guarda.
  **Tres excepciones, deliberadas y acotadas:** el quiz de repaso
  (`js/modules/quiz/`, ver "Sistema de estudio tipo Anki" más abajo) usa
  `localStorage` para recordar aciertos/fallos por pregunta en el
  dispositivo del usuario; el **Modo Estudio** (`js/core/pomodoro.js`,
  ver "Modo Estudio y reloj Pomodoro" más abajo) usa `localStorage` para
  recordar, también en el dispositivo del usuario, el nº de pomodoros
  completados, la duración de enfoque/descanso configurada, y el
  progreso de estudio (pomodoros invertidos) por ficha; y **Dudas de
  guardia** (`js/modules/sobrevivir-umi/dudas-guardia.js`, dentro de
  Sobrevivir a la UMI, ver más abajo) usa `localStorage` para guardar las
  dudas reales que el propio usuario escribe desde un formulario —
  decisión que reemplazó explícitamente, a petición del usuario, un
  diseño anterior sin ningún campo de texto. No añadas `localStorage`
  (ni ningún otro tipo de persistencia) a ningún otro módulo sin que sea,
  igual que estas tres, una decisión explícita — el resto de la app
  sigue sin guardar nada.
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
                                  submenú de Trasplante). Devuelve
                                  { show, irAFicha } — irAFicha(view, panel,
                                  tab) es lo que cada especialidad expone
                                  para los enlaces cruzados (ver "Revisión
                                  de código de octubre 2026")
    lightbox.js                  Click en cualquier imagen dentro de
                                  .article-figure para ampliarla a pantalla
                                  completa. Se inicializa una sola vez desde
                                  main.js; no hace falta tocarlo al añadir
                                  imágenes nuevas en otros módulos, basta con
                                  envolver la <img> en un div.article-figure
    pomodoro.js                  Modo Estudio: estimación de pomodoros por
                                  ficha (lectura + preguntas de quiz) y
                                  reloj Pomodoro flotante. Se inicializa una
                                  sola vez desde main.js, ver "Modo Estudio
                                  y reloj Pomodoro" más abajo — no hace
                                  falta tocarlo al añadir fichas nuevas.
    search.js                    Buscador global (ver "Rediseño
                                  Constelación + buscador global").
    ui.js                        Helpers compartidos por las calculadoras:
                                  wireSelectExplicacion(), pintarGauge(),
                                  clamp(), escapeHtml() — ver "Revisión de
                                  código de octubre 2026" más abajo.
    wizard.js                    initSiNoWizard(prefijo, pasos): asistente
                                  paso a paso de respuestas Sí/No sobre un
                                  árbol de decisión declarativo.
    vista-visual.js              Interruptor Texto | Visual por tarjeta o
                                  ficha ([data-visual]); irAlTexto()/resaltar().
    visual-kit.js                montarVisual(tabId, receta): imágenes
                                  declarativas cuyos nodos apuntan al texto
                                  real de la ficha. silueta.js: la silueta
                                  corporal compartida por los mapas. Ver
                                  "Vista Visual por tarjeta" más abajo.
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

