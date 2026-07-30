# HUD Clínico UCI — guía para trabajar en este repo

App web de estratificación de riesgo clínico y apoyo a la decisión en
hematología/UCI (manejo de citopenias, reconocimiento temprano del paciente
hematológico, síndromes urgentes, trasplante de progenitores, más un acceso
directo a escalas generales de UCI). Es una herramienta de apoyo para
médicos, pensada para consultarse a pie de cama en el móvil.

## Decisiones de arquitectura (ya tomadas, no las reabras sin preguntar)

- **Sin backend, sin login, sin base de datos.** Es una calculadora estática:
  el usuario abre la página, rellena campos, ve un resultado. Nada se guarda.
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
                                  un grupo y oculta el resto (menú principal,
                                  submenú de Citopenias, submenú de Trasplante)
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

## Navegación: menú principal → categoría → submenú

La app abre en una pantalla de **menú principal** (`#home-view`, definido
directamente en `index.html`) con 4 botones grandes:

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
   (Blood 2024 y Blood Reviews 2025, ver `js/modules/reconocimiento/`).
3. **Síndromes Hematológicos Urgentes** (`modules/sindromes-urgentes/`) —
   una sola vista con 3 pestañas (CID / PTT / Síndrome de Lisis Tumoral, ver
   `js/modules/sindromes-urgentes/index.js`, que usa `core/tabs.js` igual que
   la pestaña de Introducción al TPH). **CID** tiene contenido real: definición
   actualizada 2025, fenotipo trombótico vs. hemorrágico, esquema de
   progresión por etiología (barras `.phenotype-bar` en
   `js/modules/sindromes-urgentes/cid.js`), terminología relacionada
   (acordeón), tabla de puntuación ISTH 2025 (Overt DIC 2021/2025 y SIC) y dos
   calculadoras interactivas (Overt DIC 2025 y SIC) con datos en
   `js/data/sindromes-urgentes-data.js`, más tratamiento por fenotipo. Fuente:
   Iba T, et al. J Thromb Haemost. 2025;23(7):2356-2362 (comunicación ISTH
   SSC). **PTT** y **Síndrome de Lisis Tumoral** siguen de momento en aviso
   "Próximamente", pendientes de la bibliografía que se vaya aportando — para
   completarlos sigue el mismo patrón que CID (contenido teórico propio,
   calculadora(s) interactiva(s) si la escala lo permite, apartado de
   Fuentes).
4. **Trasplante de Progenitores Hematopoyéticos** (`modules/trasplante/`) —
   submenú con tres sub-vistas, todas con contenido real:
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
del resto.

Toda esta navegación la orquesta `modules/home/index.js`, que crea tres
`createViewSwitcher()` independientes (nivel principal, submenú de
Citopenias, submenú de Trasplante) y conecta los botones. Los botones
"← VOLVER" usan una clase específica según a qué nivel deben volver:
`.btn-volver-home`, `.btn-volver-citopenias-menu`,
`.btn-volver-trasplante-menu`. Las calculadoras en sí (Escalas Generales,
Neutropenia Febril) no saben nada de este nivel superior — siguen
inicializándose igual que siempre, solo cambia qué contenedor está visible.

`modules/fuentes/` sigue siendo la excepción: es una categoría **solo de
contenido**, sin `.js`, montada como acordeón (no como vista de pantalla
completa) directamente debajo del menú principal en `index.html`. El botón
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

## Idioma

Todo el contenido clínico y los comentarios de código están en español,
igual que el resto del repo — mantenlo así.
