# Eco cardíaca (circulación viva)

Corazón 3D movido en cada instante por un motor del latido, con la ecografía modo B cortada de ese mismo corazón,
la barra del ciclo A-G, el Wiggers y el asa presión-volumen. **Está en la app** desde octubre de 2026 (antes vivía
en `lab/circulacion/`), como la especialidad «Eco cardíaca»: ver «En la app» más abajo.

## Abrir

- **En la app**: 5.ª puerta de la pantalla inicial, o la tarjeta «Eco cardíaca» dentro del grupo Fisiopatología UCI.
- **Laboratorio** (el mismo simulador, solo, con los plegables abiertos y los ganchos `window.__*` de las pruebas),
  desde la raíz del repo: `python3 -m http.server 8000` y abrir
  - `js/modules/eco/laboratorio.html` — el simulador;
  - `js/modules/eco/latido.html` — curvas de Wiggers, asas presión-volumen y la tabla de cifras frente a su referencia.

## Pruebas (un solo comando, desde la raíz del repo)

```
node --test 'js/modules/eco/pruebas/*.test.mjs'
```

Tarda ~2 min (109 pruebas). Si Playwright no está instalado, las pruebas de navegador se omiten y el resto se ejecuta. Las de navegador
sirven el repositorio con un servidor propio y abren `laboratorio.html`.

- `motor.test.mjs` — cada cifra del latido normal frente a su referencia (`referencias.mjs`), el volumen
  de sangre se conserva, las 7 fases salen en orden, nunca hay dos válvulas del mismo lado abiertas, las
  fases isovolumétricas no cambian el volumen, la incisura, el barorreflejo (quieto en reposo, compensa
  una hemorragia) y que **cada escenario reproduce el patrón de su tipo de shock en la fuente**.
- `diagramas.test.mjs` — las fases del último latido salen A-G, contiguas y cubriendo el latido; el centro de cada
  fase cae en ella; revisar un instante devuelve la muestra más cercana; tocar un punto del asa devuelve esa muestra;
  las escalas contienen todas las curvas; y la esquina telesistólica del asa cae sobre la ESPVR que se dibuja.
- `geometria.test.mjs` — los orificios valvulares caben en la base en todo el rango de volúmenes, ninguna
  pieza tiene coordenadas no finitas ni con volúmenes absurdos, la sangre de cada cavidad sigue a su
  volumen, **la valva gira sobre su bisagra sin encogerse** (el borde libre recorre un arco al abrir) y **el
  corazón queda dentro del saco pericárdico** (ventrículos, aurículas, orejuelas, infundíbulo, raíz aórtica,
  surcos con su grasa y coronarias; cada vértice por paridad de un rayo) en todo el latido, con volúmenes
  extremos y con derrame, que queda entre los dos. Los grandes vasos sí salen por arriba, como en el cuerpo.
- `abdomen.test.mjs` — el calibre de la VCI cae en las bandas de FATE y va del máximo al mínimo con la respiración;
  en la hemorragia queda fina y colapsable y en el derrame no colapsa un 50 %; casi ningún vértice del corazón cae
  dentro del hígado; la VCI sale de la AD (se mueve arriba) y bajo el hiato está quieta; suprahepáticas dentro del
  hígado; las mallas fijas son las mismas entre fotogramas.
- `doppler.test.mjs` — E/A mitral en el rango de la Ficha 5 (el TDE, *todo*: pendiente de calibrar); ITV del TSVI en
  el de la Ficha 11 y GC por Doppler a menos del 15 % del motor (y baja en la hemorragia); entrada hacia la sonda y
  salida alejándose; aliasing y filtro de pared del espectro; suprahepáticas con S y D hacia el corazón y A retrógrada;
  porta ~20 cm/s, más pulsátil con la PVC alta.
- `formas.test.mjs` — los instantes de las formas precalculadas cubren el latido con error acotado y son más
  densos donde todo cambia deprisa; en el instante de una forma la mezcla es exactamente esa forma; en el
  latido siguiente la mezcla se usa en más del 95% de los fotogramas y el 99% de los vértices queda a menos de
  0,5 mm de la geometría exacta; si la mezcla no representa al estado mostrado (volumen, válvulas, derrame,
  corte), no se usa; y tras una hemorragia la tabla caduca.
- `ecografia.test.mjs` — cada vista es un plano bien formado que pasa por sus puntos (el 4 cámaras por la mitral y
  la tricúspide, con el VI a la derecha; el eje largo por el eje del VI y las dos válvulas; los ejes cortos
  perpendiculares al eje, con la pared lateral a la derecha); un triángulo paralelo al plano no deja borrón; **las
  paredes cortadas quedan cerradas en las 7 vistas a lo largo de todo el latido** (sin rayas); en el eje corto de
  papilares el **área de la pared del VI es la de la geometría (±3%)** y crece en sístole; la cavidad del VI y la AI
  son sangre; el miocardio brilla >25 dB más que la sangre y el pericardio más que el miocardio; el **campo de
  desplazamiento predice dónde estaba el tejido** (puntos que no ha visto, error <1 mm, menos de la mitad que un
  ajuste afín); y la imagen es determinista, con el moteado del tejido fijo y el ruido de la sangre cambiante.
- `navegador.test.mjs` — el corazón se dibuja, la barra del ciclo lleva a cada fase, el dedo desplaza la
  página en vertical y gira en horizontal, un escenario cambia la circulación, sin WebGL se ve la imagen
  fija, la página del latido no deja ninguna cifra fuera de rango sin marcar, y **en cada fotograma el corazón,
  el cursor del Wiggers y el punto del asa leen el mismo instante** (en tiempo real, al deslizar sobre el
  Wiggers y al tocar el asa), y **con el latido estable se usan las formas precalculadas sin perder esa sincronía**
  (con corte o con la casilla apagada, geometría exacta), y **la ecografía corta el corazón en el mismo instante**
  en cada vista, también al revisar y con corte (entonces con su propia geometría completa).

Las cifras marcadas `pendiente` en `referencias.mjs` salen como *todo*: no fallan, pero si un día pasan a
cumplirse, una prueba avisa para quitar la marca.

## Archivos

| Archivo | Qué es |
|---|---|
| `index.js` | Módulo de la app: carga `simulador.mjs` la primera vez que la vista se ve, lo anima solo mientras se ve, aplica los accesos `data-eco-vista`/`data-eco-escenario` y pinta «Qué mirar» |
| `eco.html` | Marcado de la vista (ids con prefijo `cv-`, porque todos los partials de la app conviven en el DOM) |
| `simulador.mjs` | `montarSimulador(raiz, opciones)`: todo el pegamento de la página (bucle, eco, ciclo, diagramas, controles, escenarios). Lo usan la app y el laboratorio |
| `modo-m.mjs` | Modo M: barrido en el tiempo de una línea del modo B (una columna por imagen B, colocada según el tiempo del motor) y los dos calibres. Con `{ eje: 'vel' }`, el mismo barrido es el espectro del Doppler pulsado |
| `doppler.mjs` | Doppler (sin DOM): velocidades a partir de los flujos del motor, volumen de muestra, columna del espectro, mapa de color y medidas del último latido (E/A, TDE, ITV, ondas venosas) |
| `abdomen.mjs` | Hígado, diafragma y xifoides (fijos al cuerpo) y, cada fotograma, la VCI (calibre según PVC y respiración), las suprahepáticas y la porta |
| `abdomen-data.mjs` | Mallas de Z-Anatomy ya colocadas bajo el corazón (generado: no se edita a mano) |
| `herramientas/abdomen-z-anatomy.mjs` | Genera `abdomen-data.mjs` (lee los GLB de Z-Anatomy, registra, simplifica). No forma parte de la app |
| `que-mirar.js` | Qué líneas de otras fichas se copian en «Qué mirar» para cada vista |
| `laboratorio.html`, `latido.html` | Páginas de laboratorio (no se enlazan desde la app) |
| `motor.mjs` | Motor del latido en el tiempo (sin DOM): 4 cámaras, válvulas por gradiente, aórtica con inercia, pericardio, tabique, lechos sistémico y pulmonar, barorreflejo |
| `escenarios.mjs` | Escenarios de shock (los usa la página y los comprueban las pruebas) y el patrón de cada tipo según la fuente |
| `referencias.mjs` | Cifras del latido normal con su referencia y su origen (ficha de la app o fisiología general) |
| `corazon-geo.mjs` | Geometría procedural del corazón a partir de los volúmenes del motor, y el interior para la sangre |
| `diagramas.mjs` | Wiggers y asa P-V que siguen al corazón: fases, muestras del último latido, escalas y dibujo |
| `formas.mjs` | Estado de la geometría a partir del motor (volúmenes, apertura y carga de las válvulas) y las formas precalculadas a lo largo del último latido, que se mezclan en cada fotograma |
| `ecografia.mjs` | Ecografía modo B: plano de cada vista, corte de la malla, cierre de las paredes, moteado que sigue al tejido y formación de la imagen (sin DOM) |
| `flujo-sangre.mjs` | Partículas de sangre: cuántas cruzan cada válvula sale del flujo del motor |
| `render-webgl.mjs`, `mat.mjs`, `earcut.mjs` | Renderizador WebGL propio, matrices y cámara, triangulación |
| `img/corazon-estatico.jpg` | Imagen fija para navegadores sin WebGL |

## Reglas

- **Toda cifra visible tiene origen**: `ficha` (se cita la ficha de la app y su PDF en `docs/`), `fisiología
  general` o ilustrativa. Una referencia nueva se añade en `referencias.mjs`, nunca escrita a mano en una página.
- **Un escenario nuevo** va en `escenarios.mjs` con su `tipo`; las pruebas comprueban solas su patrón.
- **Solo WebGL.** Sin WebGL, imagen fija con aviso. (Canvas 2D se quitó: duplicaba cada novedad.)
- **Anatomía congelada.** No se añaden piezas anatómicas salvo que sirvan a una ficha concreta. Excepción ya
  decidida: hígado, diafragma, xifoides, VCI, suprahepáticas y porta, para la VCI de FATE y el Doppler de VExUS.
- Tras cualquier cambio: `node --test 'js/modules/eco/pruebas/*.test.mjs'` en verde antes de subir.
- **Una sola copia del pegamento:** la app y el laboratorio montan el mismo `simulador.mjs` sobre el mismo
  `eco.html`. Nunca una página con su propio script.

## Sincronización: un estado por fotograma

Idea tomada de *The Heart by Ultrasound* (ver «Créditos»): no hay dos relojes que mantener a la par. En cada fotograma, `simulador.mjs` decide **un** estado
(`estadoMostrado()`): el del motor mientras corre, o una muestra del último latido si se revisa un instante a mano.
Con ese mismo objeto se construye la geometría del corazón y se dibujan el cursor del Wiggers, el punto del asa, la
barra A-G, el HUD y las cifras. Diferencia con echodemo: su ciclo es una función pura del tiempo (curvas escritas a
mano); el nuestro es una simulación paso a paso, así que el instante revisado sale de `motor.onda` (el último latido
completo, una muestra cada 2 ms), y mientras corre se dibuja encima el latido en curso (`motor.ondaActual`).

- **Revisar un instante**: deslizar en horizontal sobre el Wiggers, tocar el asa o tocar una fase de la barra. Pausa el
  motor (no lo hace correr) y lleva corazón, válvulas, curvas y cifras a ese instante; la sangre no se dibuja, porque
  vive en el tiempo del motor. «▶ Reanudar», un escenario o «Avanzar 10 s» vuelven al tiempo real.
- **Lado izquierdo o derecho**: aorta/VI/AI o pulmonar/VD/AD, con sus eventos (S1, apertura aórtica, S2, apertura
  mitral; o cierre tricuspídeo, apertura pulmonar, P2).
- **ESPVR y EDPVR** salen de los parámetros del propio motor (Ees efectiva con el barorreflejo, V0, A, B), sin tabique
  ni pericardio: son las relaciones del modelo, no una referencia clínica.
- Coste: el fondo (ejes y último latido) se dibuja una vez por latido en lienzos aparte; cada fotograma solo copia
  esas capas y dibuja el latido en curso y el cursor. En pausa sin cambios no se redibuja.

## Formas precalculadas (`formas.mjs`)

Idea tomada de *The Heart by Ultrasound* (ver «Créditos»), reconstruida sobre nuestro motor. Antes, cada fotograma
rehacía toda la geometría (~13 ms en un procesador de servidor, más ~3 ms de normales, y medio mega de arrays
nuevos que subir a la tarjeta gráfica). Ahora:

- **Cuándo:** cuando dos latidos seguidos son casi iguales (`semejantes()`, menos de 1 mL de diferencia en las 4
  cámaras), se calculan unas **36-40 formas** del corazón a lo largo del último latido, dos por fotograma (tarda
  ~20 fotogramas). Cada forma es `construirCorazon()` con el estado exacto de un instante de `motor.onda`.
- **Dónde:** los instantes se eligen solos (`instantesClave()`): entre dos formas seguidas, interpolar en línea
  recta los 4 volúmenes y la apertura de las 4 válvulas se separa de cada muestra real menos de 1 mL y 0,1 de
  apertura, y nunca más de 60 ms. Así hay pocas formas en la diástasis y muchas en la contracción auricular y en la
  apertura y el cierre de las válvulas.
- **Cada fotograma:** se buscan las dos formas que rodean al instante mostrado y la tarjeta gráfica las mezcla
  (`render-webgl.mjs`: posiciones, normales y oclusión, con un peso). Los búferes de cada forma se suben una vez.
  Por fotograma: ~0,07 ms de procesador, sin arrays nuevos ni subidas.
- **Sin trampas (un estado por fotograma):** la mezcla solo se usa si lo que interpola coincide con el estado
  mostrado (volúmenes ±2 mL, apertura ±0,2, mismo derrame y mismo volumen telediastólico); si no —el latido aún
  cambia tras un escenario, o hay corte, que cambia la topología—, ese fotograma se construye entero, como antes.
  La casilla «Formas precalculadas» permite compararlo; la línea de fps dice qué se está usando.
- La apertura y la carga de las válvulas son ahora una **función pura del estado** (`estadoGeo()`), sin el
  suavizado en el tiempo que tenían: lo exige mezclar formas de instantes distintos.
- **Coste:** ~20 MB de memoria (y otro tanto en la tarjeta gráfica) para las formas de un latido. Se liberan al
  cambiar de opciones o de latido.

## Ecografía (`ecografia.mjs`)

Idea tomada de *The Heart by Ultrasound* (ver «Créditos»), estudiada a fondo (su `bmode.js`, `echo.js` y
`views.js`) y reconstruida sobre nuestra geometría, **sin copiar código**. Lo que se aprendió de su diseño:

| *The Heart by Ultrasound* | Aquí |
|---|---|
| Plano por vista desde puntos anatómicos de su malla | `planoVista()`: desde nuestros centros valvulares, el eje del VI y los surcos (A4C, A2C, A3C, PLAX, PSAX a nivel aórtico, mitral y de papilares) |
| Malla cerrada de miocardio: el corte da lazos que se rellenan | Nuestras paredes son **superficies abiertas** (endo y epi por separado, aurículas de una capa): `cerrarExtremos()` une cada extremo suelto con el más cercano y se rellena por paridad sobre la sopa de segmentos; las paredes de una capa y las valvas van como líneas con grosor |
| Moteado que viaja con cada estructura (ajuste afín frente a una forma de referencia) | El punto material del corte en la forma telediastólica (misma arista, mismo parámetro) y un **campo de desplazamiento** en retícula de 3 mm, que sigue también a la pared que engorda; afín de reserva |
| Borde brillante donde el haz incide de frente; desenfoque del haz que crece con la profundidad; compresión log | Igual de idea, con implementación propia: borde especular cos⁴, dos medias móviles por fila (varianza de una gaussiana de σ ≈ 0,0085·r) y gaussiana axial, envolvente en dB |

- **Un estado por fotograma:** la imagen corta las **mismas piezas** que dibuja el corazón (exactas o mezcladas).
  Con corte o vista de la base, una geometría completa del mismo estado. La prueba de navegador lo comprueba.
- **El plano es fijo en el cuerpo:** se calcula con los volúmenes telediastólicos del último latido y solo se
  recoloca si cambian más de 3 mL. El corazón lo cruza al latir: en el eje corto mitral, en sístole, la base baja y
  el corte pasa a las aurículas, como en un paciente.
- **Lo que se ve sin buscarlo:** la pared que engorda en sístole, la pared lateral del apical más débil (paralela
  al haz), las valvas abiertas hacia el VI en el llenado, el derrame (el hueco entre epicardio y pericardio crece
  con el líquido).
- **Coste:** ~14 ms por imagen en Node (192 haces × 448 muestras); hasta ~30 imágenes por segundo y solo con la
  tarjeta en pantalla. Candidata a un *worker* (el módulo es puro).
- **Ilustrativo:** ecogenicidades (dB frente al miocardio), resolución, ganancia y la pared torácica.
- **Defecto de la geometría encontrado al hacerlo, ya corregido** (tocando la anatomía, con permiso explícito del
  usuario): ver «Pericardio» más abajo.

## Pericardio

Corregido a petición explícita del usuario, aunque fuera tocar la anatomía congelada. El saco seguía a los
ventrículos con 3 mm de holgura, pero estaba entero corrido (−6, −4) mm para centrar la cúpula sobre las
aurículas; en la pared lateral del VI quedaba ~4 mm **dentro del miocardio** (en 3D lo tapaba la transparencia;
en la ecografía, la línea del pericardio cortaba la pared). Ahora:

- **El corrimiento solo en la cúpula** (`centroSaco()`): nada a la altura de los ventrículos, entero a partir de
  22 mm sobre el plano AV.
- **Envolvente de lo demás** (`rellenarEnvolvente()`): coronarias y grasa de los surcos, aurículas, orejuelas,
  infundíbulo y raíz aórtica empujan el saco hasta su radio + 1,5 mm (antes sobresalían hasta ~5 mm). Cada punto
  empuja los vértices del saco a menos de una celda de distancia, con bordes en rampa: así la malla no lo corta
  entre dos vértices y el saco no salta al latir (la prueba de las formas precalculadas lo vigila).
- **La cúpula sube** hasta 10 mm por encima de la aurícula más alta (con volúmenes extremos pasaban de los 56 mm
  de antes y el saco quedaba abierto por arriba).
- **El derrame**, a las mismas alturas que el saco y 1,5 mm por dentro, así queda dentro fila a fila.
- La ecografía ya no necesita evitar pintar el pericardio sobre una pared (se quitó ese parche).
- Coste: ~2 ms más por fotograma con geometría exacta (los fotogramas con formas precalculadas no lo pagan).
- La holgura (3 mm más ~0,06 mm por mL de derrame) sigue siendo ilustrativa.

## En la app

Decisiones del usuario (octubre 2026): el simulador va **en dos sitios** —la 5.ª puerta de la pantalla inicial y una
tarjeta dentro del grupo Fisiopatología UCI—, se construye **por fases** (1: lo que ya existía; 2: modo M con
calibres, TAPSE y VCI, conectado a sus calculadoras; 3: sonda libre; 4: Doppler; 5: vistas subcostal/supraesternal y
formas de enfermedad), y de momento usa **las fuentes que ya están en la app** (más adelante llegarán documentos de
ecocardiografía). Para la VCI y el hígado que piden la vista subcostal, el usuario propuso **partir de repositorios
de anatomía de GitHub** en vez de modelarlos desde cero; se estudiará antes de la fase 5.

- **Carga diferida:** `index.js` importa `simulador.mjs` (y con él WebGL, el motor y la ecografía) solo cuando la
  vista entra en pantalla. El latido inicial (`motor.correr(12)`) bloquea un momento: se pinta «Cargando…» antes.
- **Solo anima cuando se ve:** `simulador.activo(bool)`; `index.js` lo apaga si la vista sale de pantalla o la
  pestaña se oculta (0 fotogramas fuera de la vista, comprobado). Los plegables cerrados no se dibujan (3D,
  Wiggers/asa, cifras); la eco y la barra del ciclo, sí.
- **«← VOLVER»** regresa a la pantalla desde la que se entró (raíz, Fisiopatología UCI o la ficha del acceso), como
  Escalas Generales (`origenEco` en `home/index.js`).
- **Accesos desde fichas:** un botón con `data-especialidad="eco"` (la navegación, como cualquier enlace cruzado)
  y `data-eco-vista` / `data-eco-escenario`. Hoy desde: Manual UMI · FATE (A4C y PLAX), Técnicas R1, Fisiopatología
  UCI · Cardiología (Ficha 1 ciclo, Ficha 5 eco, Ficha 10 los 4 patrones de shock, Ficha 11 VD y derrame) y Merino
  Cardiología (Tabla 14.1 con los 4 escenarios, hemorrágico, cardiogénico y séptico). VExUS no: necesita Doppler
  venoso y la VCI/hígado.
- **Un escenario elegido ya se ve hecho:** a diferencia del laboratorio antiguo, `escenario(k)` corre 10 s más el
  motor, para que un acceso desde una ficha de shock muestre el efecto (y el barorreflejo) al llegar.
- **«Qué mirar en esta vista»** (`que-mirar.js`): copia del DOM líneas reales de Manual UMI · FATE y de
  Fisiopatología UCI · Cardiología (Fichas 5 y 11), con un botón a cada una (`data-resaltar`, que `home/index.js`
  usa para llevar a la línea y resaltarla). Sin texto propio: si la app no tiene nada de una vista (PSAX aórtico),
  lo dice. Ids añadidos en las fichas: `umi-fate-subcostal/-a4c/-plax/-psax/-extendido/-dimensiones/-fs/-estimacion`,
  `cardio-eco-teichholz/-simpson/-17seg/-tapse/-vd`.
- **Colores de los diagramas:** `diagramas.mjs` los lee del propio lienzo; `.cv-sim` (en `components.css`) define los
  nombres cortos (`--g`, `--r`…) a partir de los tokens de la app.

## Modo M (fase 2)

- **De dónde sale cada columna:** de la imagen B de ese fotograma (`im.columna(theta, filas)` en `ecografia.mjs`,
  misma rejilla y mismos grises). No hay un segundo cálculo del corazón: el modo M nunca va en otro instante que la
  imagen B (prueba de navegador). La columna se coloca según el tiempo del motor (`BARRIDO` = 2 s en pantalla), así
  que con pocas imágenes por segundo cada una ocupa más ancho, pero el eje de tiempo sigue siendo real. Al revisar
  un instante pasado no se escribe (el trazado vive en el tiempo del motor). En modo M la imagen B se forma hasta
  cada 20 ms (30 en modo B).
- **Línea M:** se arrastra en horizontal sobre la imagen B. Dos medidas la colocan solas, desde la geometría
  telediastólica del propio corazón: **TAPSE** (A4C, por el anillo tricuspídeo lateral, `anilloTricLateral` de
  `construirCorazon`) y **diámetros del VI** (PLAX, por el eje del VI a la altura de la sonda, ~30% de su longitud
  desde la base, a la altura de las cuerdas).
- **Calibres:** ⏸ Pausa congela el trazado; un toque pone el primer calibre, otro el segundo, arrastrar mueve el más
  cercano y un tercer toque vuelve a empezar. Medida vertical en mm de profundidad, horizontal en ms.
- **TAPSE:** se compara con las dos cifras de la app (>16 mm, Ficha 5; >17 mm, Ficha 11), sin elegir una, y se da
  lo que recorre el anillo en el modelo en ese latido. **Diámetros del VI:** «Guardar como LVDd/LVSd» y la FS; el
  enlace a FATE escribe los dos diámetros en su calculadora de FS (`#umi-fs-lvdd/-lvsd`) antes de navegar.
- **VCI:** no se puede medir todavía (sin ventana subcostal ni VCI; fase 5). La tarjeta lo dice.
- **Cambio en la geometría para que el TAPSE tenga sentido (fase 2a):** antes todo el plano AV bajaba lo mismo
  (13 mm), así que TAPSE = MAPSE y un corazón normal daba un TAPSE «patológico». Ahora la pared libre del VD baja,
  además, lo que le corresponde por lo que se vacía el VD: `TAPSE_POR_ML` × (VTD − volumen actual del VD), calibrado
  a ~21 mm con el VS del VD normal del motor (~74 mL). El exceso sobre el descenso común se reparte con un peso:
  máximo en la pared libre junto al anillo tricuspídeo, nulo en el tabique, el VI, el infundíbulo y el ápex del VD.
  Hace falta el VTD del VD del último latido (`vvdTd`, en `extraDeMotor()` de `formas.mjs`, que también lo vigila
  al mezclar formas). Normal: TAPSE 21,2 mm y MAPSE 13,3 mm. Como sale del volumen sistólico del VD, también baja
  con la precarga (hemorragia 11,5 mm, vasoplejía 10,2 mm); falta un escenario de fallo del VD.

## Sonda libre (fase 3)

- **Cuatro movimientos a partir de la vista estándar** (`planoLibre()` en `ecografia.mjs`), los que se enseñan con
  un transductor real: **rotar** (el plano gira alrededor del haz central), **inclinar en abanico** (el plano barre
  perpendicular a sí mismo), **balancear** (se inclina dentro del propio plano) y **deslizar** (la sonda se mueve
  sobre la piel, perpendicular al plano). Los tres giros pivotan en el transductor. Sin movimiento, el plano es
  exactamente el de la vista (prueba).
- **Qué vista se ve:** `vistaMasParecida()` compara el corte con las vistas estándar de la misma ventana (apical o
  paraesternal) con `desviacion()`: grados (el mayor entre el giro del plano y el del haz) y mm (a qué distancia del
  corte queda el centro de la imagen de la vista, a 6 cm del transductor). Lo que importa es si la imagen muestra lo
  mismo, no por dónde entra la sonda. Se calcula al cambiar el plano, no en cada fotograma.
- **En el 3D:** el abanico azul sigue al plano movido; el gris es el de la vista estándar.
- **Reto:** o volver a la vista desde una sonda desordenada (rotar ±20-50°, inclinar ±8-20°, balancear ±5-12°,
  deslizar hasta ±10 mm), o pasar a otra vista de la misma ventana. Se cumple por debajo de 7° y 6 mm. Maniobras
  comprobadas en las pruebas: 4 cámaras → 2 cámaras rotando ~76° (e inclinando ~12°), → 3 cámaras rotando ~−50°;
  eje largo → eje corto de papilares rotando −90° y deslizando 10 mm, → aórtico deslizando −30 mm. En el
  simulador, los ejes cortos (a distintas alturas) se alcanzan sobre todo deslizando, porque las vistas estándar de
  eje corto están definidas como planos paralelos; en el paciente también se llega inclinando.
- Cambiar de vista con los botones vuelve a la vista estándar y cancela el reto. El modo M sigue funcionando sobre
  el plano movido (el trazado se borra al mover la sonda).

## Abdomen: hígado, diafragma y VCI (`abdomen.mjs`)

A petición del usuario, tras estudiar fuentes de anatomía en abierto (la única que se pudo descargar en este entorno
es Z-Anatomy, en el paquete npm `@authorod/svitylo-3d-anatomy-data` 1.1.0; HRA y otras están bloqueadas por el proxy).

- **Mallas fijas**: hígado (2.400 triángulos), diafragma (2.800) y apófisis xifoides (218), simplificadas con
  meshoptimizer y guardadas en `abdomen-data.mjs` (Int16 en décimas de mm, en base64; ~69 KB). La herramienta
  `herramientas/abdomen-z-anatomy.mjs` las regenera (instrucciones en su cabecera).
- **Registro**: Z-Anatomy (x izquierda, y arriba, z delante) → RAS → traslación para que su aurícula derecha caiga en
  la nuestra → 13 mm más abajo, para que el diafragma no corte los ventrículos → inversa de `MODELO`. Escala 1 (las
  aurículas miden lo mismo). Del eje de la VCI de Z-Anatomy salen el hiato (donde cruza el diafragma) y el tramo bajo él.
- **Lo que se dibuja aquí**: la VCI sale de la AD (su boca se mueve con el latido, vía `flujo.transformar`) y por
  debajo del hiato está quieta; el tubo se construye de abajo arriba para que lo quieto quede idéntico entre fotogramas.
  Las suprahepáticas (derecha, media, izquierda) y la porta (tronco y dos ramas) son tubos con direcciones anatómicas
  aproximadas, recortados para quedar dentro del hígado: las de Z-Anatomy son muñones de pocos milímetros.
- **Calibre de la VCI** (ilustrativo): diámetro en espiración = 11 + PVC mm (7-28) y colapso inspiratorio =
  0,75 − 0,045 × PVC (5-75 %), con un reloj respiratorio propio de 4 s (el motor no respira) y ±2 % con la onda de la AD.
  Elegido para caer en las bandas de la tabla de FATE (Manual UMI): PVC 0-5 → <21 mm y >50 %; 10-20 → >21 mm y <50 %.
  El HUD lo muestra. Las suprahepáticas siguen a la PVC con la mitad de colapso.
- En el 3D, casilla «Hígado y VCI» (no se dibuja con el corte ni con la vista de la base). En la ecografía, el
  abdomen va siempre (es anatomía): el hígado se rellena como una pared, el diafragma como una banda muy ecogénica y los
  vasos con luz de sangre y pared (brillante en la porta). La vista subcostal que lo aprovecha es la fase 5.

## Doppler (fase 4, `doppler.mjs`)

- **De dónde salen las velocidades**: en cada válvula abierta, v = Q / área (Q del motor, área del anillo de la
  geometría × su apertura). Aguas abajo, un chorro que se ensancha y se frena (en las sigmoideas, un tubo corto por la
  raíz); aguas arriba, convergencia hacia el orificio en las AV y, en las sigmoideas, el tracto de salida como un tubo
  (Q / área del anillo, sin la apertura: por eso el ITV del TSVI = VS / área). En las venas: VCI 2/3 del retorno venoso
  del motor ((Pven − PAD) / R), cada suprahepática 1/15, porta hepatópeta ~20 cm/s (VExUS) que se vuelve pulsátil con
  la PVC; perfil casi plano. Lo que mide la muestra es v · cos θ (θ, ángulo entre el haz y el flujo, se muestra).
- **Doppler pulsado** («Doppler pulsado»): se toca la imagen para poner el volumen de muestra (3 mm), o se elige
  «Mitral (A4C)», «TSVI (A3C)», «Tricúspide (A4C)» o «Pulmonar (PSAX Ao)». El espectro corre en el mismo barrido que el
  modo M (una columna por imagen, colocada según el tiempo del motor) con aliasing al pasar la escala y filtro de pared
  (<4 cm/s); dos calibres miden velocidades y tiempo. Las **medidas automáticas** salen de las muestras del último latido
  (cada 2 ms), no de los fotogramas: E, A, E/A y TDE en la mitral (Ficha 5: 1-1,5 y 140-250 ms), ITV del TSVI y el GC
  que da (Ficha 11: 18-22 cm), S/D/A en las suprahepáticas y media/pulsatilidad en porta y VCI (VExUS).
- **Doppler color** (casilla «Color», escala ±40/60/90 cm/s): velocidad hacia la sonda en cada celda de sangre de la
  misma imagen B, en rojo-amarillo (hacia la sonda) o azul-cian (alejándose), con aliasing por encima de la escala.
  Se calcula en una rejilla gruesa y solo con las fuentes que tocan el plano.
- **Lo que dice el modelo**: E/A mitral 1,34 (normal) e ITV del TSVI 22 cm (normal; GC por Doppler 4,8 frente a
  5,2 L/min del motor). **No calibrado**: el TDE (~100 ms; normal 140-250) y el pico de eyección (~2,2 m/s en el TSVI:
  la eyección del motor tiene el pico a los ~40 ms y es demasiado afilada); en las suprahepáticas, en reposo S ≈ D
  (lo normal es S > D). Con escala de color de 60 cm/s el TSVI se ve con aliasing por ese pico.

## Rendimiento medido

En un móvil Android real (octubre 2026, pantalla de 90 Hz, calidad alta, sangre activada), **antes de las formas
precalculadas**: **57-90 fps**. 90 es el tope de esa pantalla; las bajadas coincidían con el desplazamiento de la
página y, probablemente, con el recolector de memoria (la geometría creaba arrays nuevos en cada fotograma, lo que
las formas precalculadas eliminan con el latido estable). Pendiente de volver a medir en el móvil. Para la
integración: limitar a 60 fps (ahorra batería sin que se note) y animar solo cuando se ve en pantalla.

## Créditos

Varias ideas vienen de ***The Heart by Ultrasound***, de **David Ouyang** (`douyang/echodemo`, grupo EchoNet), que
dio permiso para usar su trabajo. Aun así **se reconstruyen sobre nuestro motor, sin copiar código ni modelos**:
un estado por fotograma, las formas precalculadas que solo se mezclan, las valvas con tres formas a lo largo de un
arco y las vistas ecográficas cortadas del propio corazón. Si algo de esto se publica, el autor agradece (sin exigirla) una cita.

**Hígado, diafragma y apófisis xifoides**: mallas de **Z-Anatomy** (https://www.z-anatomy.com), licencia
**CC BY-SA 4.0**, derivadas de **BodyParts3D** (© Database Center for Life Science, DBCLS), obtenidas del paquete npm `@authorod/svitylo-3d-anatomy-data` 1.1.0 (canal de prueba). Se han simplificado,
cuantizado y colocado bajo nuestro corazón; `abdomen-data.mjs` es una obra derivada y se distribuye bajo la misma
licencia CC BY-SA 4.0 (el resto del simulador no). La cita también se muestra en la propia página del simulador.
**meshoptimizer** (MIT, A. Kapoulkine) se usa solo en la herramienta que genera ese archivo, no en la app.

## Pendiente

- **Calibrar** la RVS (el motor da ~1.450; la Ficha 5 dice 900-1200) y la contracción isovolumétrica
  (~99 ms; fisiología general 50-90).
- **Erratas de la fuente sin nota en la app:** las dos tablas de patrones de shock de El Libro Azul
  (cap. 5, pág. 70 del PDF de la parte 1; cap. 10, Figura 2, pág. 33 de la parte 2) dan RVS «↑» o «N/↑»
  en el shock distributivo, y la del cap. 10 da ScvO₂ «↑» en el hipovolémico. Las fichas 5 y 10 las
  reproducen tal cual. Las pruebas usan la Tabla 14.1 de Merino (cap. 14), que no tiene ese problema.
- **Doppler**: calibrar el TDE y la forma de la eyección del motor (ver «Doppler»); S > D en las suprahepáticas en
  reposo; Doppler tisular (e', E/e' de la Ficha 5) y Doppler continuo; insuficiencias valvulares (el motor no tiene flujo
  retrógrado por las válvulas).
- **Abdomen**: ventilación mecánica (índice de distensibilidad de FATE) en el reloj respiratorio; el derrame del motor
  solo llega a PVC ~7,5, así que su VCI no sale «dilatada» (>21 mm) aunque ya no colapse un 50 %.
- Más ideas de *The Heart by Ultrasound* por reconstruir: más
  vistas (subcostal —ya hay hígado y VCI para ella—, supraesternal), formas de enfermedad movidas por los
  escenarios (choca con «anatomía congelada»: hace falta decidirlo) y que una cifra mostrada nunca contradiga su grado.
- Ecografía en un *worker* si en el móvil baja de fps.
- **Saltos de la geometría exacta:** la huella de las aurículas (y la grasa periaórtica) se calcula con rayos que
  se paran al tocar la raíz aórtica; un rayo casi tangente pasa de pararse a no pararse y un vértice salta hasta
  ~8 mm entre dos fotogramas. La mezcla lo suaviza (lo convierte en un cambio gradual entre dos formas), pero
  la geometría exacta (con corte o sin formas) lo sigue teniendo.
- Referencia candidata para la contracción isovolumétrica: Alhakak AS et al. Clin Res Cardiol 2025;114:430-442
  (doi 10.1007/s00392-023-02269-2), ~40 ms en adultos sanos; pendiente de tener el PDF para citarla.
