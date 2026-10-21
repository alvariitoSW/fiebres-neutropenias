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
