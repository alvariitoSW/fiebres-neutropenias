# Historial · Circulación viva y Eco cardíaca (resumen de decisiones; el detalle está en js/modules/eco/README.md)

> Texto movido tal cual desde el antiguo `CLAUDE.md` (octubre 2026). Es la historia de cómo se construyó
> esta parte: decisiones, fuentes, auditorías y verificaciones. Las reglas vigentes están en `CLAUDE.md`.

## Circulación viva y Eco cardíaca (`js/modules/eco/`)

Corazón 3D movido en cada instante por un motor del latido, construido como maqueta a petición explícita
del usuario (Cardiología, «fase 0» de una circulación viva), en rondas revisadas por él: motor del latido,
corazón procedural, pulido (tiempo real, nitidez, scroll del dedo, volúmenes extremos, rendimiento),
barorreflejo e incisura aórtica, y sangre en movimiento con barra del ciclo A-G. Nació en `lab/circulacion/`;
**desde octubre de 2026 vive en `js/modules/eco/` y está en la app como «Eco cardíaca»** (ver el último punto).
Los detalles (archivos, cómo abrirlo, pruebas, reglas y pendientes) están en `js/modules/eco/README.md`; esta
sección recoge solo las decisiones. Donde abajo dice `lab/circulacion/`, léase `js/modules/eco/`, y la antigua
`corazon-3d.html` es hoy `simulador.mjs` + `eco.html` (con `laboratorio.html` para las pruebas).

- **Decisiones del usuario tras una revisión explícita para no construir «un gigante con pies de barro»**
  (después del bloque 3): 1) **destino**, la vista Visual de Fisiopatología UCI · Cardiología, empezando
  por la ficha del ciclo cardíaco, con accesos desde los shocks de Merino Cardiología (como la nefrona
  viva); 2) **solo WebGL** (Canvas 2D quitado: duplicaba cada novedad; sin WebGL, imagen fija con aviso);
  3) **anatomía congelada** (el bloque de anatomía A1-A6 descartado, salvo valvas mitrales visibles, que
  sirven al ciclo); 4) **primero los cimientos** y luego las cifras, antes de integrar nada.
- **Por qué no se integra todavía:** la Ficha 1 de Fisiopatología UCI · Cardiología ya tiene un Wiggers
  animado, Frank-Starling y un panel de estado (y la Ficha 3 el asa P-V). Integrar sin decidir cómo
  convive con eso daría un tercer Wiggers con cifras distintas.
- **Cimientos (hechos):** código en el repositorio (antes solo en una carpeta temporal del contenedor),
  sin los scripts sueltos; **pruebas automáticas con un comando**
  (`node --test 'lab/circulacion/pruebas/*.test.mjs'`, ~100 s, 91 pruebas: motor, diagramas, geometría,
  formas, ecografía y navegador);
  las cifras del latido y su referencia en un solo archivo (`referencias.mjs`) que usan a la vez las
  pruebas y la página del latido (antes la tabla tenía ✓ escritos a mano, uno de ellos siempre verdadero);
  escenarios en `escenarios.mjs`, y cada uno se comprueba contra el patrón de su tipo de shock en la
  Tabla 14.1 de Merino (PVC, GC, RVS) y la Figura 2 del cap. 10 de El Libro Azul (PCP). **Esa prueba cazó
  un fallo real al estrenarla**: la vasoplejía subía la PVC; ahora incluye venodilatación (Marino, cap. 14:
  vasodilatación «de arterias y venas»).
- **Antes de tocar el motor, la geometría o la página**, ejecuta las pruebas; tras el cambio, deben seguir
  en verde. Las cifras aún fuera de su referencia van marcadas `pendiente` (salen como *todo*, no fallan).
- **Wiggers y asa P-V sincronizados con el corazón** (`diagramas.mjs`), a petición explícita del usuario
  tras estudiar con él cómo lo hace *The Heart by Ultrasound* (`douyang/echodemo`, leído y analizado
  también con la herramienta de ingeniería inversa `rea`; **no se copió nada** (después el autor dio permiso; ver más abajo): solo
  la idea). Regla: **un estado por fotograma**. `corazon-3d.html` decide en cada fotograma un único estado
  (`estadoMostrado()`: el motor mientras corre, o una muestra del último latido al revisar) y con ese mismo
  objeto construye la geometría y dibuja el cursor del Wiggers, el punto del asa, la barra A-G y las cifras;
  nunca hay dos relojes que mantener a la par (el problema que en la Ficha 1 de Fisiopatología UCI obliga a
  `sincronizarMiniCiclosConMaestro()`). Fondo: el último latido completo (`motor.onda`), tenue; encima, el
  latido en curso (`motor.ondaActual`, getter nuevo del motor, igual que `periodo`), que termina en el
  cursor. Deslizar sobre el Wiggers, tocar el asa o tocar una fase de la barra **revisa** ese instante:
  pausa sin hacer correr el motor, y corazón, válvulas y cifras pasan a esa muestra (la sangre se oculta,
  vive en el tiempo del motor). Lado izquierdo/derecho. ESPVR y EDPVR salen de los parámetros del motor
  (con una prueba de que la esquina telesistólica cae sobre la ESPVR). Pruebas nuevas en
  `diagramas.test.mjs` y 3 en el navegador que comprueban que, en un mismo fotograma, el corazón y el
  cursor leen el mismo instante. Verificado con capturas a 390 px en los dos temas: se corrigieron la letra
  (escalada a la densidad, no a un ancho fijo), el fondo atenuado entero (ahora 2 capas: ejes nítidos y
  curvas atenuadas) y rótulos pisados por las curvas (halo del color de fondo).
- **Permiso del autor y reconstrucción:** David Ouyang (autor de *The Heart by Ultrasound*) dio permiso para usar su
  trabajo; aun así, a petición explícita del usuario, **se reconstruye sobre nuestro motor sin copiar código ni
  modelos**, y se le da el crédito en `lab/circulacion/README.md` («Créditos»). Primeras dos ideas reconstruidas:
  - **Valvas con tres formas** (`puntoValva()`, exportada de `corazon-geo.mjs`): cerrada, a medio abrir y abierta,
    interpoladas con la parábola que pasa por las tres; la valva gira sobre su bisagra y no se encoge a mitad de
    camino (en línea recta perdía ~15% de longitud). Prueba en `geometria.test.mjs`.
  - **Formas precalculadas mezcladas en la tarjeta gráfica** (`formas.mjs`): con el latido estable se calculan
    ~36-40 formas del último latido (instantes elegidos con error acotado: más densos en las válvulas y la
    contracción auricular) y cada fotograma solo las mezcla (posiciones, normales y oclusión, en el sombreador). Se
    usan solo si representan al estado mostrado (±2 mL, ±0,2 de apertura); si no, o con corte, geometría exacta.
    Por fotograma pasa de ~16 ms a ~0,07 ms de procesador; cuesta ~20 MB. La apertura de las válvulas es ahora
    función pura del estado (`estadoGeo()`), sin suavizado en el tiempo. Pruebas en `formas.test.mjs` y en el
    navegador (81 pruebas, ~100 s).
- **Vistas ecográficas** (`ecografia.mjs`, tarjeta «Ecografía» de `corazon-3d.html`), a petición explícita del
  usuario («continúa con las vistas ecográficas, haciendo ingeniería reversa»): estudiados `bmode.js`, `echo.js` y
  `views.js` de echodemo y reconstruido sin copiar código. 7 vistas (A4C, A2C, A3C, PLAX, PSAX aórtico, mitral y
  papilares) con planos fijos en el cuerpo, definidos solo con puntos anatómicos de nuestra geometría. La imagen
  corta las mismas piezas del fotograma (un estado por fotograma). Como nuestra malla son superficies abiertas, las
  paredes se cierran uniendo extremos sueltos y se rellenan por paridad. El moteado sigue al tejido con un campo de
  desplazamiento frente a la forma telediastólica. Rótulos de cavidades, escala de profundidad y el abanico del
  plano en el 3D. Pruebas nuevas en `ecografia.test.mjs` y una más en el navegador. Hallazgo: el saco pericárdico
  entraba ~4 mm en la pared lateral del VI.
- **Pericardio corregido**, a petición explícita del usuario («aunque sea tocar la anatomía»; la anatomía sigue
  congelada para todo lo demás): el corrimiento (−6, −4) del saco solo en la cúpula (`centroSaco()`), una envolvente
  continua (`rellenarEnvolvente()`) que mete dentro coronarias, grasa, aurículas, orejuelas, infundíbulo y raíz
  aórtica, cúpula que sube con las aurículas en volúmenes extremos y derrame siempre dentro. Prueba nueva en
  `geometria.test.mjs` (cada vértice dentro del saco por paridad de un rayo, en todo el latido, extremos y con
  derrame); detectaba el fallo antiguo en la pared lateral. Se quitó el parche de la ecografía que evitaba pintar el
  pericardio sobre la pared. 91 pruebas, ~100 s. Detalle en `lab/circulacion/README.md` («Pericardio»).
- **Pendiente:** calibrar la RVS (choca con el ITV del TSVI de la Ficha 11; ver el README); la contracción
  isovolumétrica ya está calibrada (ver «Atlas de ecocardiografía» más abajo); las erratas de El Libro Azul en las tablas de shock ya tienen nota y los saltos de la huella de las
  aurículas están arreglados (ver «Arreglos de código (octubre 2026)»); volver a medir los fps en el móvil (también con la ecografía); más ideas de
  echodemo (modo M, Doppler color, sonda libre, formas de enfermedad —choca con la anatomía congelada—, cifra
  coherente con su grado).
- **Eco cardíaca en la app (fase 1)**, a petición explícita del usuario («si quiero tener un apartado igual al de
  echodemo, ¿cómo lo ponemos?»), que eligió: **dos entradas** (5.ª puerta de la pantalla inicial —el subtítulo
  de Especialidades dice ahora «5 puertas»— y una tarjeta dentro del grupo raíz Fisiopatología UCI, junto a
  Cardiología, Neumología y Fisiopatología UCI); el **orden por fases** propuesto (1 lo que ya existía, 2 modo M
  con calibres conectado a las calculadoras de TAPSE/VCI/FS, 3 sonda libre, 4 Doppler, 5 vistas subcostal y
  supraesternal y formas de enfermedad); **las fuentes que ya están en la app** hasta que aporte documentos de
  ecocardiografía; y, para la VCI y el hígado que necesita la subcostal (no existen), **partir de repositorios de
  anatomía de GitHub** antes de modelar nada (aunque sea atrezzo al principio) — estudiarlo antes de la fase 5.
  - Es una especialidad más del registro (`registrarEspecialidad('eco', …)`; `BOTONES_ESPECIALIDAD.eco` acepta ahora
    un array de botones: `btn-eco` y `btn-eco-fuci`). Su «← VOLVER» (`#btn-volver-eco`) regresa a la pantalla
    desde la que se entró (`origenEco`, calculado en el callback de `topLevel`).
  - **Carga diferida y animación solo visible**: `index.js` importa `simulador.mjs` la primera vez que la vista entra
    en pantalla y lo para (`activo(false)`) fuera de ella o con la pestaña oculta; verificado: 0 fotogramas fuera
    de la vista. Sin banco de quiz propio (exporta arrays vacíos para `main.js`).
  - **Una sola copia del pegamento**: `montarSimulador(raiz)` (antes un script dentro de `corazon-3d.html`) lo usan
    la app y `laboratorio.html`; las pruebas (96 desde la fase 3) siguen en `js/modules/eco/pruebas/` y las de navegador abren
    `laboratorio.html` sirviendo el repo entero (carga el CSS de la app).
  - **Accesos** `data-especialidad="eco"` + `data-eco-vista` / `data-eco-escenario` desde Manual UMI · FATE,
    Técnicas R1, Fisiopatología UCI · Cardiología (Fichas 1, 5, 10 y 11) y Merino Cardiología (Tabla 14.1 con los 4
    escenarios, y las fichas de shock hemorrágico, cardiogénico y séptico).
  - **«Qué mirar en esta vista»** copia del DOM líneas reales de FATE y de las Fichas 5 y 11 (ids nuevos
    `umi-fate-*`, `cardio-eco-*`) con un botón a cada una. Nuevo y genérico en `home/index.js`: cualquier
    `[data-especialidad]` puede llevar `data-resaltar="#id"` para llevar a esa línea y resaltarla tras navegar.
  - CSS con prefijo `cv-` en `components.css`; `.cv-sim` traduce los tokens de la app a los nombres cortos que
    leen los diagramas (que ahora toman el color de su propio lienzo, no de `:root`). Cache-busting `?v=20261018-10`.
- **Fase 2: modo M con calibres**, a petición explícita del usuario («sigue con la fase 2, el modo M»). Detalle en
  `js/modules/eco/README.md` («Modo M»). Lo esencial:
  - **Antes de medir nada se corrigió el modelo**: todo el plano AV bajaba lo mismo (13 mm), así que el TAPSE
    medido coincidía con el MAPSE y un corazón normal salía «por debajo de lo normal» (la app cita >16 mm en la
    Ficha 5 y >17 mm en la Ficha 11). Ahora la pared libre del VD baja además según lo que se vacía el VD
    (`TAPSE_POR_ML` en `corazon-geo.mjs`, calibrado a ~21 mm, ilustrativo). Nueva prueba: TAPSE normal >17 mm y
    mayor que el MAPSE, y que cae con la hemorragia y el derrame. Al salir del volumen sistólico del VD, el TAPSE
    del modelo también baja con la precarga; la tarjeta lo dice. Falta un escenario de fallo del VD.
  - **Cada columna del modo M sale de la imagen B del mismo fotograma** (`im.columna()`), nunca de un segundo
    cálculo: el modo M y la imagen B van siempre en el mismo instante (prueba de navegador). Pausa congela el
    trazado; dos calibres miden mm y ms.
  - **Medidas guiadas:** TAPSE (A4C, la línea se coloca sola por el anillo tricuspídeo lateral) y diámetros del VI
    (PLAX); con LVDd y LVSd guardados, un enlace los escribe en la calculadora de FS de FATE y lleva a ella. Accesos
    directos `data-eco-medir="tapse"|"vi"` desde la Ficha 5 (TAPSE) y desde la calculadora de FS de FATE.
  - **VCI pendiente**: necesita la ventana subcostal y la propia VCI (fase 5, con repositorios de anatomía).
  - Llegar al simulador desde una ficha deja ahora la página arriba (`irAFicha` del módulo): antes se quedaba
    desplazada y la eco fuera de pantalla no se redibujaba.
- **Fase 3: sonda libre**, a petición explícita del usuario. Detalle en `js/modules/eco/README.md` («Sonda
  libre»). Cuatro mandos sobre la vista elegida (rotar, inclinar en abanico, balancear, deslizar; `planoLibre()` en
  `ecografia.mjs`), una línea que dice a qué vista estándar de la misma ventana se parece el corte (grados y mm), el
  plano estándar en gris junto al movido en el 3D, y un **reto** (recuperar la vista desde una sonda desordenada o
  pasar a otra vista de la misma ventana; se cumple por debajo de 7° y 6 mm). Las pistas del reto hablan de las
  maniobras del simulador (p. ej. del eje largo al corto, rotar ~90°), sin cifras clínicas nuevas. Pruebas: 96.
- **Abdomen bajo el corazón (hígado, diafragma, VCI que late)**, a petición explícita del usuario tras estudiar
  fuentes de anatomía en abierto ("encaja con nuestro corazón los 3 puntos... sobre las licencias, habría que citarlas
  en los créditos"; lo de un paciente real con TotalSegmentator queda para más adelante). Detalle en
  `js/modules/eco/README.md` («Abdomen»). Hígado, diafragma y xifoides de **Z-Anatomy (CC BY-SA 4.0, derivado de
  BodyParts3D, © DBCLS)**, la única fuente descargable desde este entorno (paquete npm de terceros), simplificados
  y registrados bajo nuestro corazón en `abdomen-data.mjs` (generado por `herramientas/abdomen-z-anatomy.mjs`, que no
  forma parte de la app). **Excepción ya decidida a «anatomía congelada»**. La VCI (su boca sigue a la AD; bajo el
  hiato, quieta), las tres suprahepáticas y la porta se dibujan como tubos (las de Z-Anatomy eran muñones). Calibre de
  la VCI ilustrativo, elegido para caer en las bandas de la tabla de FATE (Manual UMI): PVC 0-5 → <21 mm y colapso
  >50 %; 10-20 → >21 mm y <50 %, con un reloj respiratorio propio (el motor no respira). Casilla «Hígado y diafragma» (antes «Hígado y VCI») en el
  3D; en la eco va siempre. **Créditos visibles en la propia página** (CC BY-SA exige la atribución donde se muestra) y
  en el README. `construirCorazon` ya no dibuja la VCI: solo deja su vía hacia el hiato para la sangre.
- **Fase 4: Doppler**, a petición explícita del usuario. Detalle en `js/modules/eco/README.md` («Doppler»). Módulo
  puro `doppler.mjs`: v = Q del motor / área del anillo de la geometría (chorros en las válvulas, tracto de salida como
  tubo, venas con el retorno venoso del motor). **Doppler pulsado** con volumen de muestra (tocar la imagen o
  «Mitral/TSVI/Tricúspide/Pulmonar»), espectro en el mismo barrido que el modo M (`crearModoM` con `eje: 'vel'`) y
  calibres; **medidas del último latido del motor** (cada 2 ms, no por fotograma): E/A y TDE (Ficha 5), ITV del TSVI y GC
  (Ficha 11), S/D/A y pulsatilidad (VExUS), con enlaces a esas líneas (ids nuevos `cardio-eco-diastolica`,
  `cardio-eco-itv`, `vexus-onda-hepatica`, `vexus-onda-porta`). **Doppler color** con aliasing (escala ±40/60/90).
  El modelo da E/A 1,34 e ITV 22 cm (normales); **sin calibrar**: TDE ~100 ms y pico de eyección ~2,2 m/s (forma de la
  eyección del motor), anotados como pendientes, sin tocar el motor. Pruebas: 109 (3 *todo*). (El pico de eyección se
  corrigió después, con el cap. 08 del Atlas: hoy ~1,2 m/s; y el TDE, con la inercia mitral del cap. 10: hoy ~170 ms; ver «Atlas de ecocardiografía».)
- **Revisión de código del módulo (`/code-review`)**, a petición explícita del usuario, con sus 9 hallazgos corregidos:
  1) las medidas S/D/A de las suprahepáticas (y la media de porta/VCI) toman el sentido del propio vaso
  (`fuente.factor`), no el de la onda más alta, que en la congestión puede ser la A retrógrada e invertía VExUS;
  2) al revisar el último latido, la VCI usa el reloj del motor (antes, el tiempo dentro del latido, y saltaba);
  3) la VCI se dibuja siempre en el 3D (también con el corte, recortada con `recortar`/`planoCorte`, ahora exportadas
  de `corazon-geo.mjs`): la sangre de las cavas ya no sale de la nada; la casilla pasa a «Hígado y diafragma»;
  4) en la eco, la luz de un vaso (sangre) ya no fija el movimiento de su grupo y la pared vuelve a seguir al tejido;
  5) cambiar de vista quita la muestra Doppler (en modo D va al preajuste de la nueva) y mover la sonda reinicia
  espectro y medidas; 6) el latido de la VCI es de verdad ±2 % y no la saca de su banda de FATE; 7) borrar el trazado
  (o cambiar la escala) borra los calibres; 8) una sola fórmula de velocidad de los vasos (`velVaso`); 9) los puntos
  del abdomen van en `abdomen-puntos.mjs` y `corazon-geo` ya no carga las mallas. Pruebas: 113 (3 *todo*).
- **The Heart by Ultrasound, enlazado desde Eco cardíaca (octubre 2026)**, a petición explícita del usuario
  («revisa el repositorio douyang/echodemo… y en el apartado de eco pon otro apartado u otro link que lleve al
  contenido generado en ese repositorio»). Se releyó el repositorio (relectura en `js/modules/eco/README.md`,
  «The Heart by Ultrasound en la app») y se añadió, **solo con enlaces** a su web <https://intro2echo.com> (en
  inglés, otra pestaña): una tarjeta arriba de la vista con el atlas, el código en GitHub y su índice de 30
  capítulos (cada uno por su `#clave`), y en «Qué mirar» la línea «En The Heart by Ultrasound» con los capítulos de
  la vista, el escenario, el modo y la medida que se están viendo. Datos en `js/modules/eco/atlas-ouyang.js`. CSS
  `cv-atlas-*`. Verificado con Playwright (390 y 360 px): 30 enlaces, contexto que cambia con la vista (A4C), el
  Doppler, el TEP y la VCI, sin desbordamiento ni errores. La web no se pudo abrir desde el entorno (el proxy la
  bloquea): las claves salen del código del repositorio. Cache-busting `?v=20261025-2`.
- **Fase 5: vistas subcostales y supraesternal**, a petición explícita del usuario («sigue con la fase 5 de la eco»).
  Detalle en `js/modules/eco/README.md` («Vistas subcostales y supraesternal»). Tres vistas nuevas en `planoVista()`
  (`ecografia.mjs`), colocadas con puntos anatómicos (xifoides, hiato, eje de la VCI, arco aórtico) y las direcciones
  del cuerpo (`ARRIBA/DELANTE/DERECHA`, ahora en `mat.mjs`):
  - **Subcostal 4 cámaras**: la sonda bajo el xifoides y el plano que mejor pasa (mínimos cuadrados) por ápex, válvulas
    AV y aurículas; hígado arriba, ápex a la derecha.
  - **Subcostal VCI**: la sonda más vertical y el plano por el eje de la VCI; la vena cruza la imagen y entra en la AD a
    la derecha.
  - **Supraesternal**: la sonda en la escotadura yugular; se ven el arco, la AP derecha debajo y la AI.
  - **Medida de la VCI en el modo M** («VCI (subcostal)», barrido de 6 s): Dmáx/Dmín → colapso, banda de la PAD e índice
    de colapsabilidad de FATE. El enlace escribe los valores en la calculadora de FATE (`#umi-vci-modo/-dmax/-dmin`), con
    ids nuevos `umi-fate-vci` y `umi-fate-vci-pvc` en `manual-umi.html`.
  - **Doppler**: puntos predefinidos «Suprahepática (SC VCI)» y «VCI (SC VCI)».
  - **Accesos** desde FATE (subcostal 4 cámaras y medir la VCI) y desde VExUS (la subcostal VCI).
  - **«Qué mirar»** para las 3 vistas. Arreglo de paso: una tabla copiada ahí ya no desborda la página.
  - **Cambios del motor de imagen**:
    - aorta, tronco y AP pasan a ser `vaso` (luz con sangre fuera del pericardio);
    - un vaso cortado a lo largo se cierra uniendo sus extremos;
    - el tope para cerrar paredes sube de 30 a 40 mm. Solo cambia cortes que antes quedaban abiertos; una prueba nueva
      comprueba las 10 vistas en los 5 escenarios.
  - **Formas de enfermedad**: hechas después; ver el punto siguiente.
  - Pruebas: 119 (3 *todo*).
- **Formas de enfermedad**, a petición explícita del usuario («hazlas según la bibliografía de la aplicación»). Es una
  segunda excepción a «anatomía congelada». Detalle en `js/modules/eco/README.md` («Formas de enfermedad»).
  - **Tres escenarios** con `forma: true` en `escenarios.mjs`, en su propia fila de botones: hipertrofia del VI, miocardiopatía dilatada y TEP masivo.
  - **Qué se exige**: las cifras de `CRITERIOS_FORMA`. Todas son de fichas de la app, y cada criterio lleva un botón a su
    línea exacta. Ids nuevos para esos botones: `ic-hfpef-hvi`, `mc-tabla-18-1`, `mc-hfpef`, `mc-ic-derecha`, `mc-vd-septo`,
    `mc-fig-18-2` y `cardio-cor-pulmonale`.
    - **Hipertrofia del VI**:
      - pared >10 mm (FATE);
      - grosor relativo >0,42 y masa ≥115 g/m² (guía ESC);
      - FEVI ≥50 % (Merino, Tabla 18.1);
      - caen el VTD y el VS (Merino, HFpEF).
    - **Miocardiopatía dilatada**:
      - LVDd >5,5 cm (FATE);
      - FEVI ≤40 % (Merino);
      - pared normal 6-10 mm (FATE).
    - **TEP masivo**:
      - área VD/VI >0,6 en A4C (Ficha 11);
      - VD >3,0 cm (FATE);
      - el VI se achica (Merino);
      - tabique aplanado en diástole (Merino, Fig. 18.2);
      - TAPSE <17 mm (Ficha 11);
      - sube el VTD del VD (Merino).
  - **Qué es ilustrativo**: los parámetros del modelo que producen cada forma (masa, rigidez, contractilidad,
    resistencias, volumen retenido).
  - **Cómo se ve**: el simulador lo mide en la telediástole (`medidasCorazon`) y lo muestra bajo los botones. Las formas
    corren 40 s al elegirlas (`ASENTAR_FORMA`), porque son estados ya establecidos.
  - **Geometría** (`baseGeometrica`):
    - `mioVi` (`motor.p.mioVi`, que viaja en `extraDeMotor`) multiplica la masa del VI.
    - `septo` (`aplanamientoSeptal` en `formas.mjs`) sale en cada instante del gradiente VI−VD: empieza a +1 mmHg y es
      completo a −2 mmHg, umbrales ilustrativos.
    - El tabique se corta en «D» por una cuerda que conserva el grosor de la pared. Lo que pierde la cavidad se devuelve
      al radio, así que el volumen sigue al motor.
    - `septo` entra en las formas precalculadas.
  - **Calibración**: el miocardio de referencia baja de 140 a 130 mL, para que el corazón normal quede en los 6-10 mm de
    FATE.
  - **Ecografía**: el tope para cerrar paredes en la ecografía sube a 50 mm (la supraesternal roza la base gruesa).
  - **Discrepancia entre fuentes, señalada en el propio criterio**: la Ficha 11 llama cor pulmonale a un área VD/VI
    >0,6, y Merino da como normal un VD de ~2/3 del VI.
  - **Accesos** `data-eco-escenario` desde la Ficha 3 y las fichas del VD de Fisiopatología UCI, desde Merino
    Cardiología (IC aguda) y desde Merino Neumología (EP).
  - **Pruebas**: `enfermedad.test.mjs`; en total, 127 (3 *todo*).

- **Atlas de ecocardiografía (unificación con echodemo, octubre 2026)**, a petición explícita del usuario («haz
  ingeniería reversa para conseguir unificar ambos proyectos y ponerlo en español, pero manteniendo y siendo fiel a la
  fisiología»). Detalle en `js/modules/eco/README.md` («Atlas de ecocardiografía»).
  - Eco cardíaca tiene ahora dos secciones: **Simulador** y **Atlas**.
  - El atlas es *The Heart by Ultrasound* en español, con su índice de 30 capítulos. Los que ya están en la app se
    abren dentro (hoy 9: 01 Pulso, 02 Imagen, 03 Doppler, 06 Ciclo cardíaco, 07 Asa P-V, 08 Hemodinámica por
    Doppler, 09 Función sistólica, 10 Función diastólica y 14 Ventrículo derecho); los demás enlazan al original en
    inglés.
  - 30/10/2026: ya son 10 de 30 en la app; el 15 Estenosis aórtica entra solo con texto (fase A, sin figura ni preguntas).
  - 30/10/2026: ya son 12 de 30; entran también solo con texto el 19 Insuficiencia tricuspídea y el 21 Enfermedad pericárdica.
  - 30/10/2026: ya son 13 de 30; entra también solo con texto el 17 Estenosis mitral.
  - 30/10/2026: ya son 14 de 30; entra también solo con texto el 11 Contractilidad segmentaria (los 17 segmentos, el índice y los territorios coronarios).
  - 30/10/2026: ya son 15 de 30; entra también solo con texto el 13 Strain (GLS por speckle tracking, patrones global, regional y de respeto apical, y cardio-oncología con la CTRCD de la ESC 2022).
  - 30/10/2026: ya son 16 de 30; entra también solo con texto el 12 Eco de estrés (protocolo con dobutamina, lectura por segmentos, viabilidad, alto riesgo y otros usos).
  - 30/10/2026: ya son 17 de 30; entra también solo con texto el 16 Insuficiencia aórtica (grados, graduación integrada, criterios de la Fig. 25, estadios C1/C2 y método volumétrico; fusionado por el Consejo, sesión `fusiones-30-10`).
  - 30/10/2026: ya son 18 de 30; entra también solo con texto el 22 Miocardiopatía hipertrófica (definición y medida, SAM y su gravedad, gradiente del TSVI y provocación, chorro del TSVI frente al de la IM, riesgo y diagnóstico diferencial).
  - 30/10/2026: ya son 19 de 30; entra solo con texto el 23 Amiloidosis cardíaca (hallazgos estructurales, Doppler y signo 5-5-5, strain con respeto apical, criterios de la ESC 2021 con la puntuación de Boldrini y medida).
  - 30/10/2026: ya son 20 de 30; entra solo con texto el 20 Enfermedades de la aorta (medida de la raíz y valores de Lang, puntuación Z, dilatación y aneurisma con los umbrales de la ACC/AHA 2022 en válvula tricúspide y bicúspide, disección con luz verdadera y falsa, artefacto, insuficiencia aórtica y derrame, rendimiento de ETT y ETE, y coartación con los criterios de la ACC/AHA y la ESC).
  - 30/10/2026: ya son 21 de 30; entra solo con texto el 04 Vistas transtorácicas (las cuatro ventanas y su posición, los movimientos de la sonda de la ASE, la tabla de lo que muestra y se adquiere en cada vista, el acortamiento apical, el conjunto mínimo de la BSE y la figura del original con su sonda libre).
  - 30/10/2026: ya son 22 de 30; entra solo con texto el B4 Cortocircuitos (CIA ostium secundum y CIV perimembranosa, el Qp/Qs y las indicaciones de cierre de la AHA/ACC 2018, el FOP y el estudio con suero agitado, la presión de la AI por una comunicación auricular restrictiva y la figura del original con sus grados).
  - 30/10/2026: ya son 23 de 30; entra solo con texto el B5 Masas y trombos (cómo describir una masa, las estructuras normales que la simulan, el mixoma de la AI, el trombo del VI y sus tres tipos, el fibroelastoma papilar, el contraste ecográfico, la ETE y la RM, y la figura del original con sus grados).
  - 30/10/2026: ya son 24 de 30; entra solo con texto el B6 Complicaciones del infarto (las complicaciones mecánicas a los 3-5 días, la rotura septal con el Doppler color, 4V² y el Qp/Qs, la rotura del músculo papilar posteromedial y la IM aguda grave, la rotura de la pared libre y el pseudoaneurisma con el cociente cuello/saco, el aneurisma verdadero con su trombo, el infarto del VD y la figura del original con sus grados).
  - 30/10/2026: ya son 25 de 30; entra solo con texto el B3 Endocarditis infecciosa (los criterios mayores de imagen de Duke-ISCVID y ESC 2023, las definiciones de las lesiones, cuándo ETT y cuándo ETE, la vegetación y su longitud máxima, embolia y cirugía con 10 mm, la perforación con IM aguda, el diagnóstico diferencial y la figura del original con sus grados).
  - 31/10/2026: ya son 26 de 30; entra solo con texto el B2 Prótesis valvulares (la imagen y la ETT basal, gradientes, AOE y DVI, la recuperación de presión de la bivalva, la estenosis con el contorno y el tiempo de aceleración, obstrucción frente a desproporción o flujo alto, ETE, fluoroscopia y TC, trombo frente a pannus, la fuga paravalvular y la figura del original con sus tablas).
  - 31/10/2026: ya son 27 de 30; entra solo con texto el B1 Asistencias ventriculares (la HeartMate 3 y su pulso artificial, el estudio de seguimiento, la rampa de velocidad de 4.600 a 6.200 rpm, la succión, el fallo del VD, la IAo nueva y la obstrucción, y la figura del original con sus cuatro casos, de origen ilustrativo).
  - 31/10/2026: ya son 28 de 30; entra solo con texto el 05 Ecocardiografía transesofágica (la sonda y sus movimientos, la orientación de la imagen, las vistas estándar por nivel y giro, lo que añade a la ETT y la figura del original con la tabla de sus 17 vistas). El Objetivo 1 lo marcaba «probablemente necesita humano» por la sonda esofágica: eso afecta a la figura, no al texto.
  - 31/10/2026: ya son 29 de 30 en `main`; entra solo con texto el 24 Interpretación y medidas con IA (modelos que leen ecocardiogramas, las cuatro partes de EchoPrime, recuperación y cabezas de tarea, EchoNet-Measurements y la calibración, los siete pasos de la figura original con la tabla de sus 18 medidas, rendimiento, límites y ensayos prospectivos). Con él termina la tarea `atlas-texto`: el único capítulo que falta en `main`, el 18 Insuficiencia mitral, tiene su texto en la PR #2 (`auto/mr`), que espera su fase B. El Objetivo 1 marcaba `ai` «probablemente necesita humano» por la figura; el texto sí se pudo hacer.
  - 01/11/2026: ya son 30 de 30 en `main`; entra solo con texto el 18 Insuficiencia mitral (el texto del piloto de la PR #2, auditado el 14/10; esa rama no comparte historia con `main`, así que el texto se trajo a una rama nueva `auto/mr-texto`). La figura y el Estudiar esperan al ecógrafo nuevo (`mv-eco-2a5`).
  - El texto se traduce, con permiso del autor, y la bibliografía es la suya (`atlas/referencias.js`). **El código no
    se copia**: cada figura se reconstruye sobre los motores de la app.
  - Hay **una sola fisiología**: el ciclo y el asa salen del motor del latido del simulador. Donde el texto y el motor
    discrepaban, se corrigió el motor:
    - contracción isovolumétrica calibrada con Alhakak 2025: de ~99 a ~42 ms (forma de la activación,
      `fSubida`/`qSubida`);
    - insuficiencia mitral nueva en el motor (`eroaMitral`, con la ecuación del orificio y Bernoulli). Vale 0 por
      defecto.
    - **forma de la eyección** (para el cap. 08, a petición del usuario: «vamos a seguir»): el flujo aórtico picaba a
      los ~40 ms con ~850 mL/s (2,7 m/s en el TSVI). Nuevo **efecto de la eyección** (`kEyec` 0,001: mientras el VI
      expulsa, su presión cae en proporción al flujo; resistencia interna de Shroff, fisiología general, valor
      ilustrativo): pico a ~90 ms con ~400 mL/s (1,2 m/s en el TSVI del simulador, ITV 21,9 cm). La Ees del VI pasó
      de 3,2 a 2,9 y luego a **3,1** (con la eyección más lenta la PTDVI y la FE de la hipertrofia se salían). Como en
      los latidos reales, la esquina telesistólica queda algo por debajo de la elastancia máxima: el asa dibuja la
      **Ees de un latido** (`eesLatido()` en `diagramas.mjs`, de V0 a la esquina) y el cap. 07 lo explica.
    - **estenosis aórtica** (`areaAortica`, cm², y `dAorta`): 4v² en la vena contracta y recuperación
      4v² · 2r(1 − r) pasado el orificio (Baumgartner 2017). Vale 0 por defecto.
    - **inercia mitral** (`lMit` 0,0005, para el cap. 10, a petición del usuario: «Si»): el TDE salía de ~115 ms; ahora
      un corazón normal da E/A ~1,25 y TDE ~170 ms (Ficha 5). Cierra el pendiente del TDE.
    - **relajación del VI** (`relajacion`, 1 por defecto): desde el 70% de su caída la activación del VI sigue una cola
      exponencial (`activacionVi`, τ ≈ 28 ms) y `relajacion` la alarga. Con 2,8 sale el patrón de relajación lenta
      (E/A ≤0,8, TRIV y TDE largos) sin tocar nada más.
    - Un efecto pistón del plano AV sobre la AI (onda S de las venas pulmonares) se probó y se descartó: movía media
      docena de referencias. El cap. 10 no calcula S/D y lo dice.
    - **válvula pulmonar y VD** (para el cap. 14, a petición del usuario: «Continúa con el capítulo 14»): el flujo
      pulmonar picaba a los ~20 ms con ~660 mL/s. La pulmonar gana inercia (`lPul` 0,002) y el VD efecto de la
      eyección (`kEyecVd` 0,002); la Ees del VD sube de 0,40 a 0,50 para que la presión sistólica del VD siga en
      20-25 mmHg (Ficha 5). Hoy: PAPs ~22, tiempo de aceleración del TSVD ~142 ms, FE del VD ~54%. Dos parámetros
      nuevos, neutros por defecto: `durVd` (alarga la sístole del VD) y `eroaTricus` (insuficiencia tricuspídea, misma
      ecuación que la mitral; `ultimo` da `vRegT` y `frT`).
    - geometría del VD: la base se ensancha más que la raíz cúbica del volumen (`kT`, de media luna a esfera), la pared
      libre engrosa con `mioVd` (viaja en `extraDeMotor`), el tabique se aplana con `ALFA_SEPTO` 1,1 (Ryan 1985) y el
      infundíbulo crece menos que la base (`kR = min(kT, 1,3)`), para no salirse de su ventana. El grado 3 diastólico
      de referencia del cap. 10 pasa a relajación 2,8, rigidez 2,6, volumen 1.000 y V0 de la AI 30.
  - **08 Hemodinámica por Doppler** (`cap-hemodinamica.html` + `hemodinamica.mjs`): flujo y presión con la estenosis
    del motor (continuidad, cociente de velocidades, error del TSVI al cuadrado, gradiente medio frente a 4·v media²,
    recuperación de presión frente al catéter) y PSVD/VCI con 5 corazones del motor (la velocidad de un chorro de IT
    sale del gradiente VD-AD, solo en sístole ventricular; la VCI, del modelo del simulador; la PAD, con las 3
    categorías de la ASE 2025). Nota de fuentes con la VCI de FATE. Las vistas SC VCI y la medida de la VCI de «Qué
    mirar» abren este capítulo.
  - **09 Función sistólica** (`cap-sistolica.html` + `sistolica.mjs`): método biplano de discos sobre cortes apicales
    4C y 2C del corazón de la app movido por el motor (trazado, L y 20 discos calculados sobre el corte; biplano 120
    frente a 126 mL reales). Cuatro corazones (normal, fallo, dilatada, hipertrofia) y el acortamiento del ápex como un
    transductor fuera del ápex que apunta a la base: infraestima los volúmenes, más el telesistólico. Bandas de Lang
    2015 por sexo, categoría de IC y un «acortamiento del borde» del 4C como aproximación al strain (ilustrativo).
    Nota de fuentes: Teichholz en la Ficha 5 frente a Lang 2015.
  - **10 Función diastólica** (`cap-diastolica.html` + `diastolica.mjs`): un deslizador con cuatro corazones del motor
    (relajación, rigidez, volumen y remodelado de la AI) que caen en normal, grado 1, 2 y 3 con el propio algoritmo
    ASE 2025, pintado paso a paso y comparado con la presión media de la AI del motor. E, A, TDE, TRIV, IT y AI son del
    motor; e′ (de la relajación), la forma del Doppler tisular y el strain de la AI son ilustrativos. Sin S/D (el paso
    3 usa el TRIV, alternativa de la guía). `doppler.mjs` exporta `tdeDe()`, que extrapola desde el 75% si la E se
    funde con la A.
  - **14 Ventrículo derecho** (`cap-vd.html` + `vd.mjs`): un selector de carga (normal, sobrecarga de presión, de
    volumen y TEP agudo) con deslizador de gravedad que cambia parámetros del motor (`ajustesVd`: en la presión, la
    resistencia pulmonar sube y la distensibilidad de la AP baja con ella —constante de tiempo RC, por eso cae el
    tiempo de aceleración—, la sístole del VD se alarga, la pared engrosa y al final el VD se dilata; en la de volumen,
    IT, más volemia y VD más distensible; el TEP, resistencia de golpe sobre un VD sin hipertrofia). Imágenes reales
    del ecógrafo de la app (A4C y eje corto) en cine, telediástole o telesístole con el diámetro basal y el índice de
    excentricidad (aplanado >1,1), Doppler continuo de la IT y pulsado del TSVD, bandas de Mukherjee 2025 y, en el TEP,
    signos de la ESC 2019. El patrón del tabique (aplanado en diástole, en sístole o en ambas) sale de la geometría.
    Nota de fuentes con FATE, la Ficha 11 y Merino; accesos al TAPSE y al TEP del simulador.
  - **Archivos**: `js/modules/eco/atlas/`; preguntas en `js/data/eco-atlas-preguntas.js` (52, asignatura Eco
    cardíaca).
  - **Accesos**: `data-eco-atlas="clave"` junto a `data-especialidad="eco"`. Por ejemplo, desde Fisiopatología UCI ·
    Cardiología, Fichas 1 y 3.
  - **Nuevo en `quiz.js`** (genérico): un trigger con `data-quiz-tema` empieza solo con ese tema.
  - **Pruebas**: 140 (`pruebas/atlas.test.mjs`; 1 *todo*, la RVS). La prueba del modo M del anillo tricuspídeo compara
    ahora con lo que el anillo recorre a lo largo del haz.
  - **Siguiente**: las válvulas (IM primero), pericardio.

- **Calibración de la PVC y de la EPP (20/10/2026, decisión del usuario; rama `auto/b1-calibra`)**. PVC normal 5,02 → 4,19
  mmHg (Tabla 8.1 de Marino, 0-5): la AD era un reservorio demasiado rígido y en la sístole ventricular se llenaba hasta la
  presión venosa (meseta de ~6,5 mmHg; el retorno se paraba). AD más distensible (a 0,13, b 0,080), VD a 1,9, vuVen 2300 y
  rRetorno 0,025; el resto del normal, igual. Bajarla a 3-4 rompía la VD sistólica (20-25) o el paciente posible
  (venas pulmonares >40 mmHg en la hipertrofia con 1,5 L). EPP en la hemorragia: la app la hacía a los 10 s del
  escenario, con el barorreflejo aún compensando (+64 %; el fallo del VI «respondía», +15 %). Ahora el panel deja
  asentar al paciente hasta 40 s antes de la primera maniobra (`faltaParaAsentar`, `aplicarEscenario`), igual que las
  pruebas: hemorragia +20,2 %, fallo +2,7 %, dilatada +1,3 %.

## El motor llega a shock sin romperse (21/10/2026, bloque 3 de Marino, M1 de la cobertura)

La cobertura del bloque 3 midió que ningún escenario llegaba a shock y que al subir la gravedad el motor se rompía
(hemorragia de 2 L → PAM 11; 2,5 L → PAM 0 con RVS negativa; derrame de 550 mL → NaN; fallo del VI con PCP 41 y PAM 81).
Errores corregidos en su origen (`motor.mjs`): la presión venosa y pulmonar bajo el volumen sin tensión era 0 exacto
(ahora un codo exponencial); relleno transcapilar con tope de 1 L (cap. 15 p. 21); la sangre y el derrame entran o salen
a ritmo y no de golpe; cámaras que no bajan de 0 mL; edema de pulmón por encima de 28 mmHg (fisiología general); el
reflejo ya no sube la RVS más de un 15 % (con la RVS basal alta, 1.488, no cabía un shock con PAM ≤60 e IC ≥1,2); la
contractilidad cambia en ~4 s; RVS y SvO₂ sin divisiones por 0. Mando de gravedad (`aplicar(m, g)`, g 0-1) en
hemorragia (hasta el 42 %), fallo del VI, derrame y TEP. «TEP masivo» pasa a «TEP de riesgo intermedio» (cap. 22 p. 7).
A fondo, los cuatro dan PAM 55-59 e IC 1,25-1,42. Pendiente para el bloque 3: el fallo del VI a fondo deja la PVC en
2,5 (edema que saca volumen); la Tabla 14.1 pide PVC alta en el cardiogénico. Y calibrar la RVS basal (README).

## Segunda vuelta del motor para el shock (21/10/2026, bloque 3)

La maqueta del shock (v2) envolvía cuatro fallos del motor; se corrigen en su origen (`motor.mjs`, detalle en el README,
«Segunda vuelta»). (1) `crearMotor({ liquidoPeri: 550 })` daba NaN: metía el derrame entero en un saco sin estirar
(~10⁵ mmHg). Ahora un motor que nace con derrame es un paciente que ya lo tenía: el pericardio está estirado lo que pasa de
340 mL y se asienta en un taponamiento con PVC ≈ PCP (~9/10), IC ~1,8. El derrame añadido en marcha sigue siendo agudo
(550 mL agudos paran el corazón: es lo que hace un hemopericardio). (2) En el fallo del VI a fondo la PVC bajaba a 2,8
porque el edema (5 mL/s por mmHg) se llevaba ~500 mL en 40 s. Edema lento (0,1) e **isquemia del VD**: cuando su presión
sistólica se acerca a la PAM, su contractilidad cae (consecuencia de la hipertensión pulmonar, Marino cap. 18 p. 3). El VD
deja de llenar el pulmón: PVC 6,4 y PCP ~33, también a los 2 min. (3) RVS calibrada: rSis 1,05 → 0,90 y consigna 100 →
87; IRVS 34 → 29,7 (Tabla 8.1: 25-30). El techo del reflejo pasa de +15 % a +35 % (mismo techo absoluto). La Ficha 5
(900-1.200) sigue pendiente: choca con el ITV del TSVI y con la PA del normal. El TEP a fondo daba 52/48 de pulmonar.
Ahora la arteria pulmonar se endurece por encima de 24 mmHg y el TEP llega a ×9,3 (no ×16): 40/33, media 36.
(4) `ultimo.gc` podía salir negativo con el reflujo de cierre: `vs` y `gcValvula`, netos y ≥0; `gc` = válvula + bombas.
Punto de entrada `p.soporte` (balón, Impella, ECMO y venteo). Se reajustaron el Atlas · 14 (`atlas/vd.mjs`) y la
vasoplejía (×0,55) para no contar dos veces lo nuevo. Pruebas nuevas en `motor.test.mjs` y `escenarios.test.mjs`.

## Imagen de eco más realista en la app (eco-mega, parada 1, paso 2 · 25/10/2026)

El usuario aprobó todas las mejoras de la maqueta «antes / después» (0-8; ventana pobre como reto apagado). Pasaron
a `ecografia.mjs` (pieza 1) y al simulador con sus mandos y «Señálalo» (pieza 2), con constructor barato. Profesor:
vuelta 1 suspendida por un punto (7,4: en el móvil, al tocar Señálalo, la imagen quedaba fuera de la pantalla);
vuelta 2, 8,5/8,8/8,7/8,8/8,8 con la imagen fija arriba. Auditor: 0 graves, 4 frases afinadas (especular = «puede
ser artefacto: confírmalo en otra vista»; un trombo sí se mueve con la pared). Contraste miocardio-sangre de ~28 a
~14 dB a propósito: las pruebas de contraste miden ahora los dos casos. Queda para la parada 2 (anatomía): la pared
lateral de la AD, lo más blanco del lado izquierdo. Parte: `autonomo/partes/2026-10-25-eco-mega-2.md`.

## VCI «retenida» con ventilación mecánica (27/10/2026, `eco-vci-retenido`, B-021)
Encargo del Objetivo V. El Manual UMI (parte 2, pág. 70) separa tres fórmulas y cortes por modo (40 / 18 / 12 %) y
da la tabla de PAD con el colapso respiratorio, pero no dice nada de la PAD con VM ni explica el porqué: el «no
estimar la PAD por la VCI con VM» se rotula como cautela de la app. Marino (cap. 11, pág. 27 del PDF) va como matiz
(«proved to be unreliable»); Barbier 2004 y Feissel 2004, verificados en la web, como origen de los cortes de VM. No se
escribió fisiología de la VCI en VM sin fuente (también se quitó de la explicación de `umi-q068`). La ASE 2025 quedó
fuera (no está en `docs/`). De paso se arregló el modo M: el segundo toque movía el primer calibre y la VCI no se podía
medir con dos toques en el móvil. Dos preguntas nuevas (`umi-q068b`, `umi-q068c`). 3 vueltas; profesor v2 ≥8,75 en todo.

## Parada 2 de eco-mega: anatomía, fisiología y patología (26-27/10/2026)

16 encargos sobre el plan «Un corazón más real» y la ampliación B-025 (informe de Fable 5.1), con cifras de Lang 2015,
Mor-Avi 2011, Hahn 2013 y Mitchell 2019 en `docs/`. Imagen (cuerdas, tabla de brillo, sombra del calcio, eco real de
uso libre), forma (VI en bala, aurículas con su volumen y un solo tabique, VD en U con banda moderadora, aorta
descendente, pleura y columna, torsión desde la contracción, papilares anclados, TAPSE desde el vaciado del VD,
cortina aorto-mitral) y patología (beso de papilares, festones y cúspides con nombre, taponamiento desde la presión
transmural con el saco que abraza las aurículas, TEP con los criterios de Lang, mando de gravedad). Profesor v1 ❌ por
anatomía (tabique doble, VD en rendija en el subcostal); v2 ✅ 8,1-8,4. Auditor: 0 graves. Fusionado en `main` el
27/10 con permiso del usuario. Parte: `autonomo/partes/2026-10-27-eco-mega-parada2.md`.

## Calibración del motor: Doppler de paciente posible (28/10/2026, `eco-calibra-a`, 2 sesiones)
Opción A del informe `eco-calibra`. Dos jueces nuevos (`pruebas/paciente-doppler.test.mjs`): J1, el Doppler de cada
forma a 0, defecto y 100 % dentro de las bandas con libro y página de `pruebas/bandas-paciente.mjs` (Nagueh 2025, Lang
2015, Mukherjee 2025, ESC/ERS 2022); J2, ninguna muestra del latido fuera de `LIMITES` del dibujo. Sesión 1: la AI y la
AD suman su contracción a la presión pasiva, las venas pulmonares frenan el reflujo, e′ sale de la relajación de cada
forma y la hipertrofia pasa a tener mando (grado 1 → grado 2). Sesión 2 (seis constructores en ramas `wt/…`):
dilatada como ejemplo de grado III (e′ también baja por las fuerzas de restitución con FE <40 %, Nagueh p.553); fallo
con AI rígida (S/D <1) y E/e′ ≥14; HP crónica grave sin pasar del tope del dibujo (VD 228 mL); a FC 120 la mitral
abre dentro de la contracción auricular y eso ya se cuenta como E fundida, no como A (E >0 en el shock, sin DT); un
«suelo» de volumen sin tensión de AI y AD en el shock (sin mover presiones); el piso del VD en el dibujo baja de 45 a
20 mL, porque el VD de 23 mL de la hemorragia es el del motor y de un paciente real (subirlo daba FEVD 29 %); la
velocidad de las venas pulmonares, con el calibre de la vena superior derecha (Cronin 2007, PMID 17236990). Tras el juicio del profesor, el panel
dice «Fusión E-A (FC alta): E/A y TDE no medibles» (Nagueh p.547) en vez de un E/A imposible. Umbrales
ilustrativos aflojados, cada uno con su razón escrita (balón 3 → 2 mmHg, pliegue del VD del taponamiento). Huecos que
quedan: DT del grado 1 de la hipertrofia ~420 ms y sin cifra de libro abierta; e′ ~2 cm/s en el shock cardiogénico
(Nagueh p.561 da 3-4 en el grado III avanzado; extrapolación declarada); bomba AI 88 % de la vasoplejia (artefacto de
la etiqueta de fase a FC 108). Partes: `autonomo/partes/2026-10-28-eco-calibra-a-s1.md` y `-s2.md`.

- 30/10/2026 · Atlas de eco, capítulo 16 (insuficiencia aórtica) en fase A: texto completo traducido (grados, graduación integrada con los grados I-IV, criterios específicos de la Fig. 25, estadios C1/C2 y el método volumétrico), con tres tablas y citas; figura y preguntas pendientes del ecógrafo nuevo.
- 30/10/2026 · Atlas de eco, capítulo 21 (enfermedad pericárdica) en fase A: texto completo traducido (derrame, taponamiento, constricción y miocardiopatía restrictiva), con tres tablas y citas; figura y preguntas pendientes del ecógrafo nuevo.
- 30/10/2026 · Atlas de eco, capítulo 17 (estenosis mitral) en fase A: texto completo traducido (estadios, tabla de grados de Pandian 2023, graduación por planimetría, tiempo de hemipresión, gradiente con la frecuencia y ejercicio), con una tabla y citas; figura y preguntas pendientes del ecógrafo nuevo.
- 30/10/2026 · Atlas de eco, capítulo 19 (insuficiencia tricuspídea) en fase A: texto completo traducido, con tabla de grados y citas; figura y preguntas pendientes del ecógrafo nuevo.
- **30/10/2026 · mv-eco-1 (B-045 paso 1)**: nace `js/modules/eco/contrato.mjs` (+ `contrato-puente-hoy.mjs`, `pruebas/contrato.test.mjs`) al lado del motor, sin que la app lo use todavía. Congela «contrato = motor de hoy» (±2 % contra el código, ±5 % contra la tabla §3) y deja como fallos conocidos E/e′ 1,8 (TEP defecto), TA pulmonar 119 ms (TEP) y el salto al cerrar el latido (fallo VI 100 %). Lo arregla mv-eco-2a5.
## Medidas · raíz aórtica (B-041, `raiz-aortica`, 30/10/2026)
El usuario la pidió en la eco («la quiero en la eco»). Sección nueva «📏 Medidas» en Eco cardíaca (tercera pestaña,
junto al simulador y al atlas) con un cuaderno de campo de una ficha, «Raíz aórtica», que admite más. Contenido: los
4 niveles (anillo, senos, UST, ascendente) en un paraesternal eje largo recreado y tocable; cómo y cuándo medir (anillo
mesosístole I-I, resto telediástole L-L; Lang 2015 pp. 28-32); Tabla 14 completa (p. 32); calculadora de z en dos
modos: Tabla 14 por nivel y sexo, y Devereux 2012 (edad, SC y sexo, solo senos; abierto en PMC3462295); nota de
interpretación de z = 2 (diferencias de método de 2-4 mm frente a DE de 3 mm; Lang no habla de z); umbrales de
cirugía de ACC/AHA 2022 (abierta, manuscrito de autor PMC9876736, citada por apartado) y TC ante sospecha de síndrome
aórtico agudo; 12 preguntas en el banco `js/data/eco-medidas-preguntas.js` (bloque «Medidas»). La ESC 2024 de aorta
no está en abierto: sus umbrales no van. Erratas de Lang anotadas (la Tabla 14 no trae las ecuaciones de la Fig. 13;
«pico sistólico» en la Fig. 10 frente a «mesosístole» en el texto). `irAFicha` de la eco abre ya fichas de la
sección (buscador y `jueces --ficha eco::panel-eco-medidas-tabs:eco-med-raiz`). Prueba: `autonomo/pruebas/raiz-aortica-z.test.mjs`
(node) y arnés `raiz-aortica-ui.mjs`. Parte: `autonomo/partes/2026-10-30-raiz-aortica.md`. Pendiente: enlazarla con
el cap. 20 del atlas cuando exista.


## mv-eco-2a5, paso 2a: el latido que enlaza y el TEP con escalón (30/10/2026)
Primera parte del paso 2 de B-045 (motor del corazón). El fallo VI al 100 % saltaba al volver a empezar el latido
(la activación se cortaba a 0); ahora la cola pasa al latido siguiente, con su recalibración (hipertrofia, balón,
derrame, TEP) y una sístole que se acorta a FC alta para que el shock vivo no se quede sin diástole. El TEP pasa a
tener escalón: el defecto es el submasivo y el final del mando el masivo (Marino caps. 22 y 14). Dos criterios de
Lang del VD se miden al 100 % hasta el dibujo nuevo (el de hoy satura el VD basal en 41 mm). Lo demás del paso 2
(e′, aceleración pulmonar, septo, regional, shock cardiogénico), en la sesión siguiente. Parte:
`autonomo/partes/2026-10-30-mv-eco-2a.md`.

**31/10/2026 · `mv-eco-2a5`, paso 2b.** El motor del corazón calcula ya su e′ (llenado precoz del VI con la precarga
normalizada) y la E toma la onda fusionada cuando E y A se juntan: la E/e′ del TEP grave deja de ser imposible. El TEP
acorta el tiempo de aceleración pulmonar (<105 ms, ESC/ERS 2022) al perder distensibilidad la arteria pulmonar. El
contrato entrega el septo continuo (`septoSigno`, `septoFase`) y la contracción por segmentos (`regional`, con
McConnell en el TEP; Marino cap. 22). El fallo del VI a fondo sigue siendo izquierdo (VI dilatado, retención). Techo
del VD agudo y DT de la hipertrofia: huecos sin fuente. Parte: `autonomo/partes/2026-10-31-mv-eco-2b.md`.

## mv-eco-2a5, paso 3: adaptadores, juez de geometría y libro POCUS (31/10/2026)
La imagen deja de dar cifras al corazón: TAPSE, mínimos de volumen, paredes, masa y anillos valvulares viven en
`js/modules/eco/anatomia.mjs` (lado del corazón; `corazon-geo` los reexporta) y el contrato los da con origen `motor`.
El Doppler toma las áreas de anillo del corazón. Una instantánea congelada (`pruebas/instantanea-dibujo.test.mjs`)
garantiza que el dibujo sigue idéntico. Juez nuevo `jueces --geometria` (fuera de la suite por defecto hasta el
dibujo nuevo): 0 contornos cruzados; caza la «nave espacial» de la HP crónica por proporciones (pared libre del VD 1,8
mm, LVEI 0,92, AD pequeña). El libro POCUS de `docs/` es una muestra sin física de ultrasonidos: da las reglas de los
mandos (el origen del mando de imagen pasa a «ficha», POCUS I p. 41) y las sondas. Parte
`autonomo/partes/2026-10-31-mv-eco-3.md`.

## mv-eco-2a5, paso 4: el dibujo nuevo, con interruptor (31/10/2026)
`corazon-geo.mjs` pasa a ser una fachada: `construirCorazon` y `baseGeometrica` eligen el dibujo de hoy o el nuevo
(`corazon-geo-2.mjs`) con `?dibujo=2`, `ECO_DIBUJO=2` o `usarDibujo(n)`; imagen, planos y medidas siempre del mismo
dibujo. El nuevo es el de hoy con 13 ajustes que lo hacen salir del motor (pared del VD de `paredVdDe`, tabique continuo
de `septoSignoDe`, AD por área-longitud, VD con largo propio, D del eje corto, papilares a escala, velos finos) y una
imagen más real solo con él (pericardio fino, caídas con la profundidad y lateral, sombra y refuerzo, encuadre, rótulos
al centro de la cavidad, aorta descendente). El juez de geometría tenía tres fallos de medida (arreglados en commits
aparte) y tres rangos cambiados por decisión del usuario (pseudohipertrofia con cita, HP/TEP moderados a g 0,5,
hipertrofia en todo el mando): nuevo 0/147, hoy 1/147. El motor del TEP no cambió (los «29 mL» eran el volumen de la
fase A). Realismo del profesor 8,7 (meta 9,5); el interruptor sigue apagado hasta que el usuario decida. Parte:
`autonomo/partes/2026-10-31-mv-eco-4.md`.
