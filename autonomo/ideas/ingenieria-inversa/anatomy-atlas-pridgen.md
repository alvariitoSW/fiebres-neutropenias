# Informe · Anatomy Atlas, de Brian Pridgen, MD (ingeniería inversa, 29-10-2026)

Encargo: estudiar https://anatomy-atlas.pridgenmd.chatgpt.site/ (visor 3D de cuerpo entero) y
`/procedures/proximal-phalanx-fracture/` (demostración de un procedimiento), pensando en el 3D de la eco (decisión
del 01/11) y en otras piezas. Método: skill `ingenieria-reversa`. Descargadas con curl a una carpeta temporal las dos
portadas, `app.js`, `style.css` y `NOTICE.md`; el JS de la portada viene **incrustado y comentado** (se leyó con
grep, sin ejecutarlo). Medido con Playwright a 390×844. Nada se ha copiado al repositorio. Cada punto: **visto**
(en su código o pantalla), **deducido** o **desconocido**.

## 0. En una frase

Anatomy Atlas es un atlas 3D de cuerpo entero (4.464 estructuras, 11,7 millones de triángulos, three.js) que carga
las mallas por regiones y pela capas, corta y señala estructuras; su demo de procedimiento es una animación guiada
con preguntas; nos gana en anatomía 3D completa, pero su visor pesa 65 MB y su código no se puede traer.

## 1. Cómo está construido

| Pieza | Qué hay | Marca |
|---|---|---|
| Motor 3D | three.js r160 (MIT) incluido en la página; WebGL 2, sin WebGL muestra un aviso. Render con `antialias`, tono ACES, luz de estudio y entorno `RoomEnvironment` | **visto** (`NOTICE.md`, código) |
| Páginas | La portada es **un solo HTML de 6,6 MB** (1,12 MB por la red, comprimido) con el catálogo de estructuras, el índice de regiones y todo el JS incrustados. La demo es otra página: `index.html` de 10 KB + `app.js` (624 KB, empaquetado) + `style.css` | **visto** |
| Formato de malla | **GLB** con compresión **meshopt** (gltfpack + meshoptimizer, MIT). Sin Draco ni KTX2 en la carga real. 270 MB sin comprimir → **63,6 MB** empaquetados (≈4,2×) | **visto** (`regions/index.json` incrustado: `bytes` y `bytes_packed`) |
| Troceado | **11 archivos** `geometry/<región>.glb`: `body-surface` (0,83 MB, la piel, es lo único del arranque), `core` (3,5), `thorax` (9,0), `abdomen-pelvis` (6,6), `back` (3,0), `neck` (2,3), `head` (**16,3**), cuatro extremidades (4,2-6,8 cada una). Cada URL lleva la huella SHA del contenido (`?v=…`) | **visto** |
| Carga por regiones | Las regiones se bajan **una detrás de otra** (`stream`), con 3 reintentos y tope de 120 s. Cada trozo se decodifica en hilos de fondo (hasta `min(4, núcleos−2)`) y se indexa al llegar: el árbol, el buscador y el inspector funcionan con lo que ya llegó. **Medido**: tras elegir una vista de partida bajó las 11 regiones | **visto** (código) + **medido** |
| Catálogo | Tabla `__STRUCT__` con una ficha por estructura: nombre, sistema, tejido, lado, región, caja, profundidad 0-1, grupos, jerarquía y **licencia por estructura**. Alias para las simétricas (`.l`/`.r`) | **visto** |
| Cortes | Plano de recorte de three.js (`clipPlane`, 3 ejes: transversal, sagital, coronal) con `localClippingEnabled`. El interior del corte se **tapa con el truco del stencil** y un cuadrilátero del color del tejido; esas «tapas» solo se construyen al primer corte. Hay además un «localizador» con raycast sobre la piel para elegir el nivel | **visto** (código) |
| Capas | Una **escalera de 14 niveles** (`__LADDER__`: fascia, venas y nervios superficiales, cinco capas de músculo, cápsulas y ligamentos, hueso…) con un control «Tissue depth»; cada estructura tiene su profundidad y se funde según el nivel elegido. Hay escaleras distintas por zona y una función que traduce el nivel de una a otra | **visto** (código); cómo se funde (opacidad o ocultar), **deducido** |
| Identificar | `Raycaster` contra las mallas + nombre sacado del nodo (gltfpack deja el nombre real uno o más niveles por encima de la malla; el código lo recorre) → ficha de `__STRUCT__` en el inspector. Búsqueda por nombre | **visto** |
| Rayos X / sólido | Modo `S.mode` con desvanecer, aislar y ocultar estructuras | **visto** (el nombre del modo); el aspecto, **medido** solo en parte |
| Demo de procedimiento | **No usa GLB**: carga dos JSON (`model.json` 8,3 MB y `cancellous.json` 17,4 MB; 9,1 MB por la red) y construye la escena. El estado es una **función del tiempo** (0-50 s); capítulos y preguntas se ponen sobre la misma línea. Velocidad 0,25×-2×, interruptor «Teaching», menú «Technique» (dos órdenes de taladrado + orientación) | **visto** (`ma(...)`, `$u`, `Ml`); que la función sea pura, **deducido** |
| Estado en la dirección | `?speed`, `?teach`, `?view`, `?t`, `?autoplay`, `?method` se leen de la URL; en la portada el estado de las capas va **en la URL**, no en `localStorage`, a propósito | **visto** |
| Guardado | Solo una elección de «mostrar u ocultar anatomía genital» en `localStorage` (opcional, «recordar») | **visto** |
| Servidor | Alojado en Cloudflare (`chatgpt.site`); cookie de Cloudflare y script de desafío. Sin cuentas ni analítica propia vistas | **visto** |

## 2. Qué hace

- **Portada, al abrirla en el móvil**: primero un diálogo obligatorio (mostrar/ocultar anatomía genital) y luego otro,
  «Starting views», con 5 recorridos: seguir un nervio, ver los órganos, explorar un corte, separar una región,
  ver las articulaciones mover. Después el visor: buscador, selector de región (cuerpo entero, cabeza y cuello,
  tronco y pelvis, cuatro extremidades), pestañas Atlas · Explode · Motion · Study, deslizador de capas
  (capa 1 de 14) y barra inferior con **Tissues · Sections · X-ray · View · Layers**. Captura en `home-organs.jpg`.
- **Cortes**: tres planos y un deslizador de profundidad. **Capas**: del piel al hueso.
  **Identificar**: tocar una estructura abre su ficha. **Explode**: separa los sistemas. **Motion** y **Study**: no
  se abrieron (**no visto**).
- **Demo del procedimiento**: una mano en 3D con fractura espiral; reproducir, reiniciar, barra con capítulos,
  velocidad, hueso (opaco, transparente, corte), «Teaching» (la animación se **detiene en preguntas de
  comprobación**, con retroalimentación) y «Technique». Texto tipo «Acerca de y fuentes»: cita las guías AO
  (surgeryreference.aofoundation.org) y Kozin 2000 (JAAOS), con fecha de comprobación y avisos de que no sirve para
  planificar clínicamente. Captura en `proc-8000.jpg`.
- **Cambio de técnica que reinicia**: la función de salto `pr(tiempo, {reinicio})` pone el tiempo a 0, para la
  reproducción y borra las preguntas ya hechas; se ve en el código, **no** se pulsó el menú.

## 3. Rendimiento en el móvil, medido

Chromium sin GPU real (WebGL por software, SwiftShader) a 390×844 ×2: los **tiempos y los fotogramas son un suelo
pesimista**, no el rendimiento de un teléfono. Las **transferencias y la memoria JS sí** valen.

| Prueba | Resultado |
|---|---|
| Abrir la portada (HTML) | 1,12 MB por la red; 1,6 s hasta DOMContentLoaded; sin desbordamiento horizontal (390/390) |
| Tras elegir «ocultar» y esperar | 5,5 MB (HTML + piel + `core`); memoria JS 23-34 MB; 60 fps (solo piel) |
| Tras elegir un recorrido (vista de partida) | **65 MB** en total; las 11 regiones; memoria JS **192 MB** de pico y luego 66 MB; la GPU no se pudo medir; **1 fps** y la página dejó de responder a las capturas (30 s) |
| Demo del procedimiento | 9,3 MB (2 JSON); memoria JS 69 MB; ~23 s hasta ver la mano; **1,5 fps** por software; sin desbordamiento |
| Errores de consola | Ninguno en la portada; en la demo, solo un aviso de GPU por `ReadPixels` |

Lo que **hace** (visto en el código): `setPixelRatio(min(dpr, 2))`; decodificación en hilos; las tapas del corte se
construyen solo al primer corte; el precalentamiento de cortes se **desactiva** en pantallas ≤720 px, sin puntero fino
o con «ahorro de datos»; en táctil se liberan los visores de las demos al volver; la demo pone `playing=false`
con `visibilitychange` y usa `ResizeObserver`; la demo y la portada respetan `prefers-reduced-motion` (sin
animaciones: estado final). **No vi** calidad adaptativa por fotogramas, ni pausa del render con `IntersectionObserver`
(cero usos en el código), ni límite de memoria para móviles pequeños: la portada baja las 11 regiones aunque el
teléfono sea modesto. Un comentario del autor cuenta que dibujar el cuerpo a doble cara costó el 20 % de los
fotogramas (76,5 → 63,7 fps) en su máquina.

## 4. Licencias y créditos

- **Código del visor: propietario.** `NOTICE.md`: «su código original no se ofrece bajo licencia de código abierto»;
  se puede usar la web y compartir el enlace. **No se trae nada de su código.** three.js (MIT) y meshoptimizer (MIT)
  son libres, pero ya conocemos el camino por nuestra cuenta.
- **Mallas: mezcla de licencias, avisa de que no es «todo CC BY-SA»**: la anatomía adaptada y el catálogo,
  **CC BY-SA 4.0** (de Open 3D Model —Leiden, Utrecht, Maastricht, KULAK…— y **Z-Anatomy**, derivado de
  **BodyParts3D**, DBCLS, **CC BY-SA 2.1 Japón**); riñones (Lissie Cowley) **CC BY-NC 4.0**; cócleas y vestíbulos
  (Univ. de Dundee) **CC BY-NC-SA 4.0**; nervios craneales (Dundee) CC BY 4.0; «Brainder» y sustancia blanca
  (Univ. de Washington) **sin licencia clara** («no se afirma haberla verificado»).
- **Qué podemos traer**: las mallas de **Z-Anatomy** desde **su origen** (https://github.com/Z-Anatomy/Models-of-human-anatomy,
  CC BY-SA 4.0; es lo que ya hacemos con hígado, diafragma y xifoides vía el paquete npm), **no** desde el
  empaquetado de Pridgen (no hace falta, y sus añadidos son suyos). Condiciones: **atribución** (Z-Anatomy,
  BodyParts3D/DBCLS con su CC BY-SA 2.1 JP y su cita Mitsuhashi 2009, y que hemos cambiado la malla) y
  **compartir igual** (el archivo de mallas derivado va en CC BY-SA 4.0, como ya hacemos con `abdomen-data.mjs`; el
  resto de la app, no). **Excluir riñones, oído interno y lo de Washington**: NC o sin licencia clara.
- Créditos del sitio: pie con enlaces a Open 3D Model, Z-Anatomy, BodyParts3D y a `NOTICE.md`; «Credits and source
  notices» y «Third-party licenses» en la demo; aviso de uso educativo, no clínico. Un modelo para nuestra página
  de créditos.
- Lo no verificado en origen: leí la licencia **solo en `NOTICE.md`** de Pridgen; el `License.txt` de Z-Anatomy
  (commit enlazado `bb293be4…`) **no lo abrí**.

## 5. Qué nos sirve (de barato a grande)

1. **Rótulo de «Acerca de y fuentes» por pantalla** (qué es ilustrativo, técnicas citadas con fecha de comprobación,
   «no sirve para decidir»): cumple nuestro §7.4 y mejora el «origen visible». Va a **todas** las piezas vivas
   (catéter vivo, Técnicas R1). Coste: pequeño (≈0,3 M).
2. **Demo de procedimiento como función del tiempo**: estado = f(tiempo), capítulos en la barra, velocidad, y
   **parada en preguntas «piensa antes»** (nuestro `mayeutica-motor.js` ya hace las preguntas). Va a una ficha de
   **Técnicas R1** (p. ej. `mar-cvc-sitios`, intubación/RSI) y al **catéter vivo** como «ver el procedimiento paso a
   paso»; en SVG y Motion, sin three.js. Coste: medio (≈2-3 M por procedimiento la primera vez; 0,8 M el siguiente).
3. **Cambiar de técnica = reiniciar y borrar las respuestas** (dos órdenes de taladrado en su demo; para nosotros,
   seldinger frente a guía ecográfica, sitios del CVC): patrón sencillo. Coste: pequeño sobre la anterior.
4. **Estado de la vista en la dirección** (`#hash`), no en `localStorage`: ya lo hacemos con la sonda de eco
   (`eco-sueltas`); sirve para compartir «te enseño este corte». Coste: pequeño.
5. **Escalera de capas con deslizador** (14 niveles, escaleras por zona): para el **tórax y el abdomen** que ve el eco
   (piel → músculo → órgano → vaso) y para **«¿qué cruzo al puncionar?»** (yugular, subclavia, femoral) en
   **Técnicas R1** y **catéter vivo**. Con nuestras mallas (hígado, diafragma, xifoides) y las de Z-Anatomy del
   tórax y cuello que hagan falta. Coste: medio-grande (≈4-6 M con las mallas simplificadas y sin three.js, en
   dibujo 2D por capas); con three.js, véase §6.
6. **Cargar por regiones, la piel primero** y decir cuánto va a bajar: aunque no usemos 3D, vale para las láminas de
   la **Radiología** del PIF y los atlas (carga diferida con tamaño visible). Coste: pequeño.
7. **Corte con tapa del color del tejido** (truco del stencil): para un **corte axial del tórax/abdomen** que
   acompañe a la vista de eco (subxifoidea, VCI, hígado). Necesita WebGL propio o three.js. Coste: grande (≈8-12 M
   con la integración), solo si el 01/11 se elige 3D.
8. **Recorridos de partida** («seguir un nervio», «explorar un corte») para estudiar con un caso en vez de un
   lienzo en blanco: sirven a `mv-eco` y a Radiología. Coste: medio (≈1-2 M por recorrido), sin 3D.

## 6. Qué pesa para la decisión del 3D del 01/11

**A favor de añadir 3D (three.js)**
- Tiene lo que nuestro corazón 3D no tiene: **anatomía alrededor** (4.464 estructuras con nombre, sistema y lado),
  cortes y pelado por capas ya resueltos; tres técnicas (planos de recorte, tapa por stencil, raycast) sin código
  raro.
- La compresión meshopt + troceo por regiones reduce 4,2×: **solo lo necesario** para la eco sería poco. `core` +
  tórax + abdomen = 3,5 + 9,0 + 6,6 = **19,1 MB** (frente a 63,6 MB del cuerpo entero).
- Las mallas de Z-Anatomy ya las usamos y su licencia nos permite más (atribución + compartir igual).
- La demo procedimental muestra que se puede enseñar un paso a paso con un 3D pequeño (JSON, 25,7 MB sin comprimir).

**En contra**
- **Peso**: 5,5 MB la piel y el núcleo; **65 MB** el cuerpo entero; la portada son 6,6 MB de HTML. Con datos móviles de
  guardia es mucho; la app hoy es estática y ligera.
- **Memoria**: 192 MB de heap JS solo con las 11 regiones (la GPU, sin medir). Con GPU de gama baja, riesgo de cierre
  del navegador. No vi límite para móviles modestos.
- **Rendimiento**: 1 fps en software (suelo, no real); no he podido probar un teléfono con GPU. **Hace falta probar en
  un móvil real** antes de elegir.
- **§2 de CLAUDE.md**: three.js rompe «una sola librería (Motion)»; la compresión meshopt pide su decodificador
  (WASM) y hilos (worker) → más piezas ajenas. El usuario debe elegir y registrar la excepción.
- **Código no traíble**: habría que rehacer cortes, capas e identificación sobre three.js por nuestra cuenta
  (≈18-28 M según `mv-eco`, ya estimado).
- Un 3D de cuerpo entero **no resuelve** lo que falla en la eco (TEP, HP crónica, topes fisiológicos): eso es del
  motor de hemodinámica, no del visor.

**Lectura**: la idea barata y limpia es **3D solo para el tórax-abdomen de la eco** (≈19 MB, o menos tras
simplificar como ya hicimos con 69 KB para el hígado), con la piel y `core` primero, y **el resto de ideas (§5.1-4,
6, 8) sin 3D**. Pulir el motor actual y traer solo la escalera de capas en 2D sigue siendo posible.

## 7. Lo que queda sin saber

- Rendimiento real en un móvil con GPU (aquí todo fue por software); consumo de GPU y temperatura.
- Qué hacen Motion, Study, Explode y X-ray en pantalla; cómo se ven los cortes con la tapa; si el deslizador de capas
  funciona fluido en táctil.
- Si el teléfono pequeño recibe menos calidad o menos regiones (no vi nada, pero no lo probé en un dispositivo real).
- Cómo se decide qué región se baja antes (el orden es el de `stream`); si cancela las descargas al cambiar de región.
- La licencia exacta de las piezas de Washington, y el `License.txt` de Z-Anatomy.
- Las preguntas de la demo (cuántas, qué dicen): solo vi la primera y su estructura, no se reproducen aquí.
- Capturas: `/tmp/claude-0/-home-user-fiebres-neutropenias/6fd5627a-52e6-54dc-bf05-546d3015c4a2/scratchpad/pridgen-ir/`
  (`home-organs.jpg`, `proc-8000.jpg`, `home-120000.png`; fuera del repositorio).

## Pares de prueba (para rehacer la idea, no son fuente clínica)

- Portada, elegir «See the organs» (tras ocultar genitales) → región «Torso & pelvis», capa 1 de 14 «Skin», **322
  estructuras quitadas**, se ven costillas, pulmones, hígado y vasos; transferencia 5,5 MB → 65 MB tras elegir el
  recorrido.
- Demo, abrir → «Spiral shaft fracture», 0:00 / 0:50, velocidad 1×, «Teaching» desactivado, hueso opaco.
- Índice de regiones: `body-surface` 0,83 MB; `core` 3,5 MB; `head` 16,3 MB; total 63,6 MB (empaquetado) y 270,1 MB
  (sin comprimir); 4.464 estructuras.
