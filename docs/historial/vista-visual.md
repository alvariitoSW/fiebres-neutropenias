# Historial · Vista Visual: mecanismo, kit de recetas y Neutropenia Febril/Hematología

> Texto movido tal cual desde el antiguo `CLAUDE.md` (octubre 2026). Es la historia de cómo se construyó
> esta parte: decisiones, fuentes, auditorías y verificaciones. Las reglas vigentes están en `CLAUDE.md`.

## Vista Visual por tarjeta (`core/vista-visual.js`) — piloto: escalera MASCC

A petición explícita del usuario (tras explorar en el tipo Artifact "Design"
cómo convertir el texto de Neutropenia Febril en imágenes de estudio, y
aprobar la dirección "cada párrafo convertido en una imagen que se
recuerda"), se añadió un **interruptor "Texto | Visual" por tarjeta**. La
vista **Texto** es siempre la de por defecto y la **fuente primaria**; la
Visual es otra forma de leer exactamente el mismo bloque. Decisiones
confirmadas por el usuario: **cambiar** (una vista u otra, no apiladas — en
390 px apilar duplica el scroll) y **por tarjeta**, no un botón global
(posible más adelante, tras el piloto).

- **Mecanismo genérico** (`js/core/vista-visual.js`, `initVistaVisual()`
  llamado una vez desde `main.js`, mismo espíritu que `core/corkboard.js`):
  cualquier `.card[data-visual]` con dos hijos `.vista-texto` y
  `.vista-visual` recibe el control segmentado bajo su `<h3>`. El cambio es
  una clase `.modo-visual` en la tarjeta; el CSS oculta una vista y muestra
  la otra. No se guarda nada (sin `localStorage`). Exporta
  `irAlTexto(card, elemento)`: vuelve a Texto, hace scroll a la línea de la
  fuente y la resalta 2 s (`.vista-resaltado`) — es el botón "Ver en el
  texto ↓" que debe llevar **todo** marcador de una imagen, para que la
  fuente esté siempre a un toque. Añadir una imagen a otra tarjeta: el
  atributo, los dos contenedores y su propio `.js` — nunca tocar el core.
- **Regla de fidelidad: una sola fuente de datos.** Antes de dibujar un
  bloque, sus ítems/cifras pasan a un archivo de `js/data/` del que leen el
  texto, la calculadora y la imagen. Piloto: `js/data/mascc-data.js`
  (ítems, puntos, corte 21, máximo 26). `triaje-mascc.js` genera ahora el
  select y las casillas de la vista Texto desde ese archivo
  (`renderCamposMascc()`, mismos `id` de siempre) y suma con
  `puntuacionMascc()`; antes los puntos estaban escritos dos veces (etiqueta
  HTML y suma JS).
- **La imagen no tiene lógica propia.** `mascc-escalera.js` (arrancado desde
  `neutropenia-febril/index.js` justo después de la calculadora, para evitar
  un import circular) lee y escribe las mismas casillas/select y dispara su
  `change`: `calcMASCC()` sigue siendo la única que decide el resultado. La
  escalera: cada ítem es un bloque de altura = puntos (15 px/punto), los
  presentes apilados desde el suelo, lo perdido como hueco discontinuo
  encima; línea roja en 21; lectura de margen ("Margen: N puntos antes de
  cruzar la línea" / "Faltan N"); la carga clínica (3 niveles) cicla
  5→3→0 al tocarla y vuelve a 5 tocando su hueco. Con cualquier red flag
  del triaje la pila se cubre con "Invalidado" + "Ver el triaje ↑".
- **Bug preexistente corregido de paso**: las casillas del MASCC (marcadas
  por defecto) salían **tachadas** por la regla general
  `.checkbox-label:has(input:checked)` pensada para checklists — el mismo
  problema ya documentado para la 4Ts de Merino HEMATO. En vez de pasar a
  `<select>`, las casillas de escalas puntuables llevan ahora la clase
  `.puntuable`, que anula el tachado. Usarla en cualquier escala futura con
  casillas que suman puntos.
- Verificado con Playwright (390×844, `hasTouch`, toques reales con
  `touchscreen.tap`): el interruptor arranca en Texto; Visual oculta el
  texto; quitar Edad/Ambulatorio/EPOC en la escalera desmarca las casillas
  reales y ambas vistas dan 17/Alto riesgo; la carga cicla 5→3→0→5;
  devolver EPOC → 21/Bajo riesgo; "Ver en el texto" vuelve a Texto y resalta
  "Sin historia de EPOC (4 pts)"; desmarcar en Texto se refleja en la
  escalera; sepsis marcada → Invalidado; "Devolver todos" → 26; sin errores
  de consola ni overflow horizontal. Bump de cache-busting a `?v=20261010`.
- **Las otras 5 imágenes de Neutropenia Febril**, con el mismo molde (a
  petición explícita del usuario tras probar el piloto). Todas siguen las dos
  reglas: **ninguna calcula nada** (escriben en la calculadora que ya
  existe, disparan su evento y copian su resultado) y **cada marcador lleva a
  su línea de la fuente**. `core/vista-visual.js` se generalizó a cualquier
  `[data-visual]` (no solo `.card`): un `.vista-grupo` con
  `.vista-grupo-titulo` puede envolver varias tarjetas con un único
  interruptor; y exporta `resaltar(el)` para fuentes que viven en otra
  subvista (`irAlTexto(null, el)`).
  - **Triaje → cuerpo** (`triaje-cuerpo.js`, tarjeta 1): las banderas IDSA
    numeradas sobre su órgano y las 2 automáticas fuera del cuerpo. Datos en
    `js/data/triaje-data.js`; `triaje-mascc.js` genera ahora también estas
    casillas (`renderCamposTriaje()`, mismos `id`/clases) y exporta
    `hayRedFlags()`. Silueta compartida con el mapa de focos en
    `neutropenia-febril/silueta.js` (`SILUETA_SVG`, `ORGANOS` en
    coordenadas del viewBox 170×400 separadas ≥36 unidades, `posicion()` en %).
  - **Diagnóstico → las primeras 48 h** (`diagnostico-linea.js`, grupo
    `#diag-grupo` sobre las tarjetas A, B y C): 4 carriles. Hemocultivos
    (dos frascos en un eje de horas, deslizadores que escriben
    `micro-cvc-time`/`micro-periph-time`, "Quitar" = no extraído);
    biomarcadores (curvas cualitativas PCT ~8 h / PCR ~36 h en la escala
    0-40 h de la propia tarjeta C, deslizador que escribe `pcr-value`, barra
    con los cortes 20/30); técnicas rápidas en un eje de minutos con el
    tiempo **leído del texto de `foco-data.js`** (las que no dan cifra van
    aparte, "sin cifra", nunca con posición inventada); cribado fúngico
    según `gm-profilaxis-toggle`, con los pasos copiados del HTML de la
    tarjeta B.
  - **Empírico sin foco → escalera ECIL-10** (`empirico-escalera.js`): los
    textos pasaron a `js/data/empirico-sin-foco-data.js` y
    `calcTxEmpirico()` se reconstruyó desde ahí con salida idéntica;
    `escalonSinFocoActivo()` (exportada) aplica la prioridad real
    crítico > resistente a carbapenem > BLEE > riesgo bajo, y la usan la
    calculadora y la escalera. Barandilla SARM sobre `tx-sarm`.
  - **Empírico según foco → mapa corporal** (`empirico-focos.js`): los 9
    focos sobre su órgano, tocar = cambiar `foco-tx-select`. La letra
    A/B/C/D **se deriva del propio texto del régimen** de `foco-data.js`
    (`escalonDe()`: ampicilina/quinolonas → D; vanco/dapto → C; cefepime a
    secas → A; resto → B), no es un dato nuevo; la guía de la imagen lo dice.
  - **Evolución → regla de 10 días** (`evolucion-regla.js`, tarjeta 3):
    arriba, cuándo parar el antibiótico (sin foco, clínica,
    microbiológica); debajo, cuándo pensar en hongos (antifúngico 4-5 d,
    TC >7 d con profilaxis, rescate >10 d). Según el tipo elegido escribe en
    la calculadora sin foco del empírico (§3, traduciendo días a sus
    casillas) o en el reloj del tratamiento dirigido (pulsa su pestaña
    Clínica/Microbiológica y rellena sus días) y copia su veredicto. Las
    marcas cuya fuente está en otra subvista navegan allí (`#btn-tratamiento`
    / `#btn-diagnostico`) y la resaltan.
  - **Catéter → balanza** (`cateter-balanza.js`, tarjeta 4): criterios de
    retirada y mal acceso periférico son las casillas reales de la
    calculadora de catéter del tratamiento dirigido (etiquetas leídas de
    ahí); la inclinación la decide `decisionCVC()`, exportada de
    `cateter-mdr.js` y usada también por `calcCVC()`.
  - `.puntuable` extendida a todas las casillas de criterio presente que
    escriben estas imágenes (triaje, `tx-*`, suspensión, catéter).
  - Ids nuevos que sirven de fuente para "Ver en el texto": `#triaje-card`,
    `#evolucion-card` (+ `#evol-defervescencia`/`-clinica`/`-micro`/
    `-neutro`), `#cateter-card` (+ `#cat-retirada`/`#cat-conservar`),
    `#diag-grupo` (+ `#diag-card-micro`/`-fungico`/`-bio`),
    `#empirico-sinfoco-card`, `#empirico-foco-card`,
    `#empirico-suspension-card`, `#empirico-antifungico-card`.
  - Verificado con Playwright (390×844, toques reales): 7 interruptores en
    Neutropenia Febril; triaje (bandera mental → casilla real, "ALTO RIESGO
    AUTOMÁTICO" en ambas vistas, MASCC invalidado, vuelta al texto
    resaltando la línea); regla sin foco (día 3 + 2 d afebril + estable → las
    3 casillas del empírico marcadas y "✅ Se puede suspender") y
    microbiológica (día 7 + 3 d afebril → pestaña Micro del dirigido con 7/3
    y "LUZ VERDE"), marca 4 → navega a Tratamiento empírico y resalta la
    tarjeta de antifúngico; balanza (Sepsis → "RETIRADA OBLIGATORIA" e
    inclinación −9°; mal acceso → "CONSERVAR + SELLADO" y +9°); diagnóstico
    (10 h / 13 h → 3,0 h "Sugiere bacteriemia por catéter" en ambas vistas;
    gripe → select real; profilaxis → rama "con"; PCR 32 → "Rango asociado a
    mayor mortalidad"); escalera (crítico + CR + SARM → nota de Matriz MDR y
    grado A-IIt; riesgo bajo limpia las 3 casillas); mapa (neumonía → select
    real y pauta con quinolonas; filtro C atenúa 7 de 9 focos). Sin errores
    de consola ni overflow horizontal; capturas revisadas una a una (se
    corrigieron etiquetas PCT/PCR montadas sobre sus curvas, el botón
    "Texto ↓" partido en dos líneas y el cursor de la regla tapando una
    marca). Bump de cache-busting a `?v=20261011`.
- **El resto de Neutropenia Febril, a petición explícita del usuario**
  ("Empieza con lo pendiente"): todas las tarjetas de Neutropenia Febril
  tienen ya Texto | Visual. **Escalas Generales y Fuentes y Evidencia se
  dejan sin vista Visual a propósito**: las escalas son transversales a toda
  la app, no de Hematología, y Fuentes es solo bibliografía. Mismas reglas
  de siempre: ninguna imagen calcula, escriben en los controles reales y
  copian el resultado de su calculadora.
  - **Tratamiento dirigido**: la calculadora de catéter muestra la misma
    balanza que la tarjeta 4 de la vista principal (`cateter-balanza.js`
    ahora monta todo `.cateter-balanza`; cada contenedor dice con
    `data-fuente-retirar`/`data-fuente-conservar` adónde lleva su "Ver en
    el texto"); el reloj de seguridad son dos barras de días con su umbral
    (≥3 afebril, ≥7 de antibiótico en la microbiológica) que cambian la
    pestaña real (`reloj-visual.js`); la Matriz MDR es un árbol germen →
    situación del paciente → pauta, leyendo las etiquetas de sus controles
    (`mdr-visual.js`); la calculadora PK/PD es una escalera renal del
    fármaco elegido con la dosis de cada tramo leída de `pkpd-data.js`, la
    misma fuente que `calcPKPD()` (`pkpd-visual.js`). `pkpd.js` acota ahora
    sus botones a `#pkpd-card .pkpd-btn[data-drug]` (la clase `.pkpd-btn`
    también la usan enlaces de bibliografía).
  - **Tratamiento empírico**: "¿Cuándo parar?" son tres candados y "Vía
    oral" son barreras (una basta para ingresar), con el panel nuevo
    `requisitos` del kit; el antifúngico empírico son dos carriles de días
    (sin y con profilaxis frente a filamentosos) con los umbrales del texto
    (`antifungico-visual.js`).
  - **Vista principal**: CISNE con el panel `puntos` del kit. Las recetas de
    CISNE, "¿Cuándo parar?" y "Vía oral" viven en `nf-tarjetas-visual.js`.
  - **Microorganismos**: cada ficha de germen (9) tiene vista Visual — una
    cadena epidemiología → mecanismo → clínica → diagnóstico (pista = la
    primera frase real; al tocar, el texto entero y "Ver en el texto"), el
    esquema de mecanismo y un semáforo de fármacos indicados / a evitar
    leídos de `microorganismos-data.js` (`microorganismos.js`).
  - **Kit (`core/visual-kit.js`)**: `montarVisual()` sirve ya también para
    una tarjeta suelta (deja su `<h3>` fuera y el interruptor debajo), y hay
    un panel nuevo `requisitos` (casillas reales como candados, modo
    `todos`, o barreras, modo `ninguno`). Bug corregido de paso: `limpiar()`
    quitaba un "≥", "≤", "<" o ">" inicial — "≥72h acumuladas" se mostraba
    como "72h"; ahora esos signos se conservan.
  - Verificado con Playwright (390×844, toques reales): cada imagen escribe
    en su control y copia el veredicto correcto (CISNE 4/8 alto riesgo;
    tres candados → "se puede suspender"; una barrera → ingreso; antifúngico
    día 5 + inestable sin profilaxis → empírico, con profilaxis → no
    indicado; catéter con sepsis → retirada en las dos balanzas; reloj
    microbiológica 3/7 → luz verde; MDR CRE + MBL + crítico → ceftazidima-
    avibactam + aztreonam con nota de combinación; PK/PD meropenem &lt;10
    ml/min → 1 g/24 h y 500 mg/12 h si grave), las 9 fichas de germen
    abren su vista Visual, las 36 fichas anteriores siguen sin fuentes sin
    resolver, sin errores de consola ni overflow. Bump a `?v=20261016`.
- **El resto de Hematología, a petición explícita del usuario** ("Haz lo
  mismo con el resto de Hematología"): las **36 fichas** restantes
  (Reconocimiento 9, Síndromes Urgentes 3, Trasplante 18 —Introducción 7,
  CAR-T 5, Complicaciones 6—, Merino HEMATO 6) ganan su interruptor
  Texto | Visual. Escribir 36 módulos a mano como los de Neutropenia Febril
  no escalaba, así que se construyó un **kit genérico** y cada ficha es solo
  una **receta declarativa**:
  - **`js/core/visual-kit.js`** (`montarVisual(tabId, receta)`): envuelve en
    tiempo de ejecución el `.tab-content` de una ficha del cuaderno de campo
    en `.vista-texto` + `.vista-visual` (el `.siguiente-ficha-btn` queda
    fuera de ambos), sin tocar el HTML de la ficha; la imagen se construye la
    primera vez que se pasa a Visual. Una receta es
    `{ guia, paneles: [...] }`; cada panel tiene `tipo`, `titulo`, `nota`
    opcional y sus nodos.
  - **Nodos que apuntan al texto, nunca copian contenido**: cada nodo tiene
    una `fuente` — `'#id'` (documento), `'.clase'`/`'[attr]'` (dentro de la
    ficha), `'css:<selector>'` (cualquier selector dentro de la ficha, para
    fuentes ambiguas como dos filas que empiezan igual) o un **prefijo de
    texto** (el primer elemento cuyo texto empieza así, ignorando emoji
    iniciales). Prioridad al resolver un prefijo: `.micro-prof-item`, luego
    `dl.kv-row`, luego `li`/`tr`/`p`/`.warning-box`/`.compare-box`/
    `.checkbox-label`/`h4`. La etiqueta y el detalle se **leen del elemento
    real** en ejecución (`copiaLimpia()` quita ids y controles); `etiqueta`
    en la receta es solo un rótulo corto opcional. "Ver en el texto ↓" abre el
    acordeón que lo contiene y resalta esa línea. Una fuente no encontrada
    avisa por consola (`[visual-kit] … fuente no encontrada`) y se omite —
    así una edición del texto nunca rompe la imagen en silencio.
  - **Tipos de panel**: `flujo` (pasos con flecha; un array = rama paralela),
    `escalera` (gravedad con rampa verde → amarillo → rojo → púrpura),
    `comparar` (columnas), `racimos` (grupos de chips), `mapa` (silueta de
    `core/silueta.js` con un `organo` por nodo), `linea` (eje con `min`/
    `max`/`ticks`/`bandas` —`alinear:'fin'` mueve el rótulo de la banda— y
    nodos con `en` y `fila:'abajo'`), y 4 que **dibujan una tabla de la
    ficha leyendo sus celdas**: `barras` (columnas numéricas; **una sola
    escala por panel** — dos magnitudes distintas van en dos paneles, nunca
    en el mismo eje), `matriz` (celdas normal/alterado, con `normales` y
    `leyenda` configurables), `frecuencias` ("Nombre: 1:N" en escala log) y
    `grados` (cada **columna** de una tabla de gradación es un peldaño con
    las `filasResumen` dentro; al tocarlo se ven todas sus filas, y "Ver en el
    texto" además pulsa la cabecera `.grade-matrix-head` para resaltar la
    columna con el gesto que la tabla de CAR-T ya tenía).
  - **Paneles conectados a calculadoras, sin lógica propia**: `puntos`
    (ítems `{checks:'.sel', pts}`, `{control:'#select'}` o
    `{control:'#numero', tramos, unidad}`) y `selector`
    (`{control, forma:'chips'|escalera, resultado:[ids]}`) escriben en el
    control real, disparan su `input`/`change` y **copian** el resultado que
    pinta la calculadora de siempre (conservando su clase
    `tfg-estado-*`); se repintan si el control cambia desde la vista Texto.
    Ambos llevan su propio "Ver en el texto ↓" hacia el control.
  - Recetas: `js/modules/sindromes-urgentes/visual.js` (CID: terminología,
    Overt DIC/SIC conectados, laboratorio y BCSH; PTT: PTTi vs PTTc,
    French/PLASMIC conectados, manejo agudo; SLT: Cairo-Bishop conectado,
    selector de riesgo, profilaxis y algoritmo), `js/modules/merino-hemato/
    visual.js` (viscosidad por Hto en barras, regla de umbrales de Hb,
    riesgos transfusionales en escala log, 4Ts conectada, matriz CID/PTT/SHU,
    multidonante vs aféresis), `js/modules/trasplante/visual.js` (selectores
    de donante/fallo de injerto/mucositis/dolor/EORTC/CMV/EICH/cistitis,
    escalera de intensidad, calendario de linfodepleción-infusión-vigilancia,
    grados de SLC e ICANS, ICE y criterios de alta conectados, matriz de
    sensibilidad de Candida, mapa corporal de las complicaciones no
    infecciosas) y `js/modules/reconocimiento/visual.js` (incidencia y tiempo
    a UCI por neoplasia en dos paneles de barras, DIRECT en flujo, 10
    principios agrupados, infección por defecto inmune, terapias dirigidas y
    síntomas conectados). Cada `index.js` llama a su `init()` al final.
  - **Agrupaciones honestas**: los títulos de grupo de un panel (p. ej.
    "Qué pedir / Cómo interpretar / Procedimientos invasivos") solo
    organizan nodos que ya existen en el texto; nunca añaden un dato clínico.
    Las etiquetas cortas resumen su propia fuente, que se ve entera al tocar.
  - **Bugs encontrados al verificar, ya corregidos**: emoji iniciales
    impedían resolver cabeceras de acordeón (`limpiar()`); un prefijo
    casaba con una fila de tabla antes que con su acordeón (prioridad de
    resolución); el `HTML` copiado duplicaba ids; el resultado 4Ts perdía su
    color; `numero()` leía "22.5%" como 22 (un punto con 1-2 cifras ahora es
    decimal, con 3 es separador de miles); la marca del día 0 tapaba el
    rótulo de la banda; "Equinocandinas" se partía a mitad de palabra en
    columnas estrechas (`partirCabecera()`: guion suave entre vocal-
    consonante-vocal cerca de la mitad y corte tras "/"); "S²" de Candida
    se pintaba alterado siendo sensible (`normales` por receta).
  - Verificado con Playwright (390×844, `hasTouch`): las 36 fichas abren su
    vista Visual por toque real, cada nodo muestra un detalle no vacío, "Ver
    en el texto" vuelve a la vista Texto con la línea resaltada, ninguna
    fuente sin resolver, sin errores de consola ni overflow horizontal;
    capturas revisadas a ojo (escalera de grados de SLC, calendario de
    infusión, matriz de Candida, mapa de complicaciones, barras de
    epidemiología, principios diagnósticos). Bump de cache-busting a
    `?v=20261014`.
- **Siguiente, a decidir por el usuario**: el mismo kit para Nefrología y
  el resto de especialidades, y/o el botón global "todo en Visual" en la
  cabecera.

- **Botón global "🖼️ Visual"**, a petición explícita del usuario ("un botón
  arriba del todo... para activar en todas las vista visual y no tener que
  ir una por una"). Va en la barra de la cabecera, junto a Escalas, Estudio
  y Buscar (`#btn-modo-visual`), y **solo se ve donde hay vistas Visual**:
  `createViewSwitcher(views, alMostrar)` (`core/navigation.js`) acepta ahora
  un callback opcional que `home/index.js` usa en `topLevel` para poner
  `body.hay-vista-visual` si la vista mostrada contiene algún
  `[data-visual]` o lleva `data-con-visual` (el Atlas de Hematología, que
  es un menú). Hoy eso es solo Hematología; si otra especialidad gana
  vistas Visual, el botón aparecerá allí sin tocar nada. Al pulsarlo,
  `setModoGlobal()` (`core/vista-visual.js`) pone todas las tarjetas en
  Visual (o todas en Texto al volver a pulsar), y las que se creen después
  —la ficha de un microorganismo, una receta del kit— nacen ya en ese modo
  (`montarVisual()` construye la imagen al momento si la ficha ya está en
  Visual). Cada tarjeta conserva su interruptor propio. Solo en memoria,
  sin `localStorage`. Verificado con Playwright: oculto en la raíz, en PIF
  y en Nefrología; visible en el Atlas y en Reconocimiento; al activarlo
  las 51 tarjetas pasan a Visual con todas las imágenes construidas; la
  ficha de un germen abierta después nace en Visual; una tarjeta se puede
  volver a Texto sola; al desactivarlo, todas vuelven a Texto. Bump a
  `?v=20261017`.

