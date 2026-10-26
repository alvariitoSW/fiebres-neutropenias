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

Tarda ~5 min (230 pruebas). Si Playwright no está instalado, las pruebas de navegador se omiten y el resto se ejecuta. Las de navegador
sirven el repositorio con un servidor propio y abren `laboratorio.html`.

- `motor.test.mjs` — cada cifra del latido normal frente a su referencia (`referencias.mjs`), el volumen
  de sangre se conserva, las 7 fases salen en orden, nunca hay dos válvulas del mismo lado abiertas, las
  fases isovolumétricas no cambian el volumen, la incisura, el barorreflejo (quieto en reposo, compensa
  una hemorragia) y que **cada escenario reproduce el patrón de su tipo de shock en la fuente**; y lo que rompía la
  gravedad del shock (venas con codo, hemorragia de 2,5 L, derrame de 600 mL, relleno transcapilar y edema de pulmón).
- `escenarios.test.mjs` — el **mando de gravedad** de hemorragia, fallo del VI, derrame y TEP: el defecto es el escenario de
  siempre; al 0 % el normal, al 50 % entre medias, al 100 % un shock posible (PAM 45-60); paciente posible y sin saltos en
  todo el recorrido (ver «Gravedad del shock»).
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
- `doppler.test.mjs` — E/A y TDE mitrales en el rango de la Ficha 5 (el TDE, desde la inercia mitral del motor); ITV del TSVI en
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
  paredes cortadas quedan cerradas en las 10 vistas a lo largo de todo el latido** (sin rayas); en el eje corto de
  papilares el **área de la pared del VI es la de la geometría (±3%)** y crece en sístole; la cavidad del VI y la AI
  son sangre; el miocardio brilla >25 dB más que la sangre y el pericardio más que el miocardio; el **campo de
  desplazamiento predice dónde estaba el tejido** (puntos que no ha visto, error <1 mm, menos de la mitad que un
  ajuste afín); y la imagen es determinista, con el moteado del tejido fijo y el ruido de la sangre cambiante.
- `enfermedad.test.mjs` — el corazón normal cae dentro de los rangos normales de FATE y de la guía ESC (pared, LVDd,
  VD, grosor relativo, masa, VD/VI) y su tabique nunca se aplana; **cada forma de enfermedad cumple sus criterios de las
  fichas** (`CRITERIOS_FORMA`); el normal no cumple todos los de ninguna; en el TEP el tabique se aplana en diástole y
  se curva en sístole, con corte en «D» y la pared con su grosor; la cavidad dibujada con el tabique aplanado conserva
  el volumen del motor (±4 %); y las formas se construyen sin valores no finitos y se precalculan y mezclan (nunca con
  otra masa del VI).
- `atlas.test.mjs` — la física de los capítulos 01-03 (13 µs/cm, λ, resolución axial, frecuencia de imagen, cos θ,
  Nyquist, aliasing) y que el ciclo y el asa del motor cumplen su texto (Alhakak 2025; dirección de cada corazón;
  la IM sin contracción isovolumétrica); toda cita de un capítulo existe en la bibliografía.
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
| `abdomen-puntos.mjs` | Puntos de Z-Anatomy (eje de la VCI, hiato, porta, xifoides), aparte para que `corazon-geo` no cargue las mallas (generado) |
| `herramientas/abdomen-z-anatomy.mjs` | Genera `abdomen-data.mjs` y `abdomen-puntos.mjs` (lee los GLB de Z-Anatomy, registra, simplifica). No forma parte de la app |
| `que-mirar.js` | Qué líneas de otras fichas se copian en «Qué mirar» para cada vista |
| `laboratorio.html`, `latido.html` | Páginas de laboratorio (no se enlazan desde la app) |
| `motor.mjs` | Motor del latido en el tiempo (sin DOM): 4 cámaras, válvulas por gradiente, aórtica con inercia, pericardio, tabique, lechos sistémico y pulmonar, barorreflejo |
| `maniobras.mjs`, `lecturas.mjs` | Capa de lectura de la hemodinámica de Marino (sin DOM): EPP y bolo; recta de Guyton, presión en la punta del catéter y curva de termodilución |
| `guyton-tablas.mjs` | Curvas de función de cada escenario (generado por `herramientas/curvas-guyton.mjs`: no se edita a mano) |
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
- **Un escenario nuevo** va en `escenarios.mjs` con su `tipo` (shock) o con `forma: true` y sus criterios en
  `CRITERIOS_FORMA` (forma de enfermedad); las pruebas comprueban solas su patrón o sus criterios.
- **Solo WebGL.** Sin WebGL, imagen fija con aviso. (Canvas 2D se quitó: duplicaba cada novedad.)
- **Anatomía congelada.** No se añaden piezas anatómicas salvo que sirvan a una ficha concreta. Excepciones ya
  decididas: hígado, diafragma, xifoides, VCI, suprahepáticas y porta, para la VCI de FATE y el Doppler de VExUS; y
  las **formas de enfermedad** (masa del VI y tabique aplanado), a petición explícita del usuario («hazlas según la
  bibliografía de la aplicación»), cada una cotejada con las fichas.
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
| Plano por vista desde puntos anatómicos de su malla | `planoVista()`: desde nuestros centros valvulares, el eje del VI y los surcos (A4C, A2C, A3C, PLAX, PSAX a nivel aórtico, mitral y de papilares), y desde el xifoides, el hiato, el eje de la VCI y el arco aórtico (subcostales y supraesternal, fase 5) |
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
- **Imagen más realista (eco-mega, parada 1, 25/10/2026):** las mejoras aprobadas en la maqueta
  `autonomo/maquetas/eco-imagen.html` están en `crearEcografo()`, encendidas por defecto: paredes de músculo, moteado,
  sombra y refuerzo posterior, reverberación, especular, ganancia/TGC y foco; la ventana pobre existe a 0 (reto).
  `formar()` acepta `o.m` (intensidades 0..1; `MEJORAS_CERO` las apaga), `o.tgc`, `o.focoMm` y `o.ventanaVista`.
  Con todo a 0 la imagen es la de antes (`pruebas/ecografia-antes.mjs`, copia congelada). El simulador tiene
  «Mandos de imagen» (ganancia, profundidad, foco con su marca, 4 TGC, ventana pobre) y «Señálalo» de 5 artefactos,
  y calidad automática en 4 niveles de haces × muestras (baja por encima de 40 ms). Coste: 19-29 ms por imagen en
  Node con todo encendido, 9-13 ms en el nivel más bajo. La maqueta importa ya este módulo (una sola copia).

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

## Huella de las aurículas sin saltos

Las aurículas son cúpulas sobre una «huella» en el plano AV, que se mide lanzando rayos desde el centro del anillo
hasta el primer obstáculo. Con un corte de sí o no, un rayo casi tangente a la raíz aórtica (AI) o al círculo del VI
(AD) pasaba de pararse a no pararse entre dos fotogramas y la huella saltaba hasta ~8 mm. Ahora esos dos obstáculos
cortan de forma continua (`cortarRayo`): un rayo que pasa a menos de R del centro se para en el borde; uno que pasa
entre R y R + 5 mm llega más lejos poco a poco. Salto máximo en un latido: AI 8,0 → 0,7 mm, AD 5,7 → 1,1 mm (prueba
en `geometria.test.mjs`, umbral 2 mm).

**Forma del VI y de las aurículas (B2, eco-mega parada 2, octubre 2026).** Antes, cada aurícula ocupaba todo el
surco AV («torta» de ~63 mm de ancho y ~24 de alto) y su altura salía de una fórmula fija: la cúpula dibujada tenía
~2 veces los mL de la aurícula del motor. Ahora la huella se recorta a un **cuello** (anillo + 3 mm), la **altura sale
del volumen del motor** (`alturaAu`, contando cómo estira la cúpula el descenso de la base y, en la AD, el del anillo
tricuspídeo lateral) y el **bulto** se elige para que alto / ancho sea el de los ejes de la AD del varón de Lang 2015,
p. 30 (2,4 / 1,9 cm/m²; `formaAu`). La AI usa la misma proporción: sus ejes están en el Suplemento de Lang (hueco).
El VI se estrecha desde el tercio basal hasta un ápex más estrecho (`EXP_BALA` 2,0 / 0,6; antes 2,3 / 0,55, casi
media elipse con lados paralelos) y `REF.lVi` pasa de 78 a 80 mm para el mismo volumen y la misma pared (≤10 mm);
`lVdRel` 0,82 → 0,80 deja el VD con su largo (lo rehace N2). La relación largo/ancho normal del VI no tiene fuente
(Suplemento de Lang): hueco; hoy ~1,5-1,6 en telediástole. Pruebas en `paciente-posible.test.mjs`: volumen dibujado
de la AI y la AD = motor ±12 % en 7 escenarios y ejes de la AD del normal en la banda de Lang p. 30.

**VD en U y TSVD (N2, eco-mega parada 2, octubre 2026).** El VD ya era una media luna que abraza al VI en el eje corto y lo
mueve el motor (`A` sale del volumen). Cambia su perfil de la base al ápex (`PERFIL_VD` 1,5 / 0,85; antes 2,2 / 0,6, un
tubo de lados paralelos y ápex romo): en el A4C sale triangular, ancho en la base y estrecho en el ápex (Mitchell 2019,
p. 26). `lVdRel` 0,80 → 0,83: el ápex trabeculado llega cerca del ápex del VI (~78 mm de largo, Lang Tabla 8 p. 20: 71 ± 6).
La **banda moderadora** se dibuja ahora en el plano del A4C (ϕ ≈ 3,2), del tabique a la pared libre en el tercio apical, con
los extremos dentro de las paredes (antes quedaba a un lado del plano y casi no se veía). El **TSVD** (`RVOT`: semiejes
10 / 11,5 mm, radio 12 en la pulmonar; la base del VD se ensancha hacia el infundíbulo (+5 en la huella) para que quepa) sale en Lang p. 20: PLAX 25 ± 2,5 (medido a media altura del tubo), proximal 28 ± 3,5 (23 mm: en la mitad baja de la banda), distal 22 ± 2,5; se mide con
`diametrosTSVD(geo)` sobre el mismo tubo que se dibuja (método nuestro, ilustrativo). Corrección de una medida, no del
modelo: la prueba leía el diámetro «basal» en el tercio del ápex (la profundidad crece desde el transductor) y daba
~16 mm; en el tercio de la base da ~30 mm (Lang 25-41). Referencias sin tocar. En hemorragia y derrame el VD basal baja a
24,8 mm (justo bajo el 25): se marca como efecto de la enfermedad (`libre`). El área VD/VI normal sigue <0,6 (Ficha 11).

**Aorta descendente, columna y pleura-pulmón (N3, eco-mega parada 2, octubre 2026; descongela la anatomía con permiso
del usuario).** Nuevo `torax.mjs`: tres piezas del cuerpo que `construirCorazon` añade al final, tras bajar la base
(sin la vista de la base). Todo **ilustrativo**: Mitchell 2019 p. 61 solo dice dónde buscar la aorta descendente
(detrás de la AI en el eje largo paraesternal y en el supraesternal); ningún diámetro ni posición tiene página (hueco).
· **Aorta descendente** (`Aorta descendente`): el arco ya no acaba en un muñón a media altura; su último punto es el
arranque de un tubo que baja por la izquierda (`TORAX.latAo`) a lo largo del eje vertical del cuerpo, de ~18 mm de
diámetro, **apoyado detrás del saco** (cálculo cerrado sobre todos los vértices; pasos de 2 mm para que no tiemble). Así
en la PLAX es un corte oval (el plano la corta oblicua, ~17 × 38 mm) detrás de la AI, y el derrame queda entre el corazón
y ella: la referencia para distinguir el derrame pericárdico (delante de la aorta) del pleural (detrás/lateral). Con el
derrame grande la aorta se aleja con el saco (el cuerpo real no se aparta; compromiso ilustrativo). En el A4C, el plano
pasa por delante de ella (no se ve sin inclinar la sonda hacia atrás).
· **Columna**: ocho cuerpos vertebrales (elipses de 34 × 26 mm, 22 mm de alto con 4 de disco) detrás de la aorta. Tejido
nuevo `hueso` (24 dB, atenuación 20 dB/mm como el calcio): brilla y da sombra negra detrás (A3). Se ve en la
supraesternal, la PSAX profunda y con la profundidad aumentada en el eje largo; el plano del A4C y el subcostal 4C no
la cortan.
· **Pleura-pulmón**: dos láminas verticales detrás y a los lados del saco (de 100° a 175° desde la línea media delantera,
a 4 mm del saco), `soloEco` (no se dibujan en el 3D). Tejido nuevo `pleura` (20 dB): línea brillante y, detrás, líneas A a
múltiplos de su profundidad en lugar de tejido (como la «ventana pobre»). Delante no hay pulmón: ahí están las ventanas.
Prueba en `pruebas/geometria.test.mjs` (aorta detrás de la AI, sin cruzar nada en 9 escenarios con derrame de 500 mL,
columna detrás de la aorta, pulmón solo detrás y en los bordes del A4C). La sangre del flujo 3D sigue acabando en el
arranque de la descendente (`vias.ao` termina en el arco).

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
- **VCI** (fase 5): «VCI (subcostal)» pasa a la subcostal VCI con un barrido de 6 s (una respiración del modelo dura
  4 s) y la línea cruzando la VCI ~2 cm por debajo del hiato, donde ya no llegan las suprahepáticas. «Guardar como
  Dmáx/Dmín» da el colapso, la banda de la PAD y el índice de colapsabilidad en ventilación espontánea de FATE; el
  enlace escribe Dmáx, Dmín y el contexto en su calculadora (`#umi-vci-modo/-dmax/-dmin`) antes de navegar.
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
  0,75 − 0,045 × PVC (5-75 %), con un reloj respiratorio propio de 4 s (el motor no respira; al revisar un latido en
  pausa la VCI se queda en su punto del ciclo respiratorio) y como mucho ±2 % con la onda de la AD (sin saltar de banda).
  Elegido para caer en las bandas de la tabla de FATE (Manual UMI): PVC 0-5 → <21 mm y >50 %; 10-20 → >21 mm y <50 %.
  El HUD lo muestra. Las suprahepáticas siguen a la PVC con la mitad de colapso.
- En el 3D, casilla «Hígado y diafragma» (hígado, diafragma, xifoides, suprahepáticas y porta; no van con el corte).
  La VCI se dibuja siempre, también con el corte (recortada como el corazón): es la entrada de la AD y sin ella la
  sangre de las cavas saldría de la nada. Solo la vista de la base la retira, con los grandes vasos. En la ecografía, el
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
  El sentido «hacia el corazón» (o hepatópeta, en la porta) es el del propio vaso, no el de la onda más alta: en la
  congestión la A retrógrada puede ser la mayor y S/D siguen midiéndose bien. La velocidad de cada vaso tiene una sola
  fórmula (`velVaso`), la misma para el espectro, el color y las medidas. Cambiar de vista quita la muestra (en modo D
  va al preajuste de la nueva vista); mover la sonda la deja en su sitio del haz pero reinicia espectro y medidas; y
  cambiar la escala (o borrar el trazado) borra los calibres, que medían sobre lo anterior.
- **Doppler color** (casilla «Color», escala ±40/60/90 cm/s): velocidad hacia la sonda en cada celda de sangre de la
  misma imagen B, en rojo-amarillo (hacia la sonda) o azul-cian (alejándose), con aliasing por encima de la escala.
  Se calcula en una rejilla gruesa y solo con las fuentes que tocan el plano.
- **Lo que dice el modelo**: E/A mitral ~1,25 y TDE ~170 ms (normales, desde la inercia mitral del motor; ver «Atlas»)
  e ITV del TSVI 21,9 cm (normal; GC por Doppler 4,8 frente a
  5,2 L/min del motor). El pico del TSVI es ~1,2 m/s, a ~90 ms de la apertura, desde el efecto de la eyección del
  motor (octubre de 2026, ver «Atlas»; antes ~2,2 m/s a los ~40 ms). **No calibrado**: en las suprahepáticas, en
  reposo S ≈ D (lo normal es S > D).

## Vistas subcostales y supraesternal (fase 5)

- **Subcostal 4 cámaras** (`sc4c`): la sonda sobre la piel 40 mm por debajo de la punta del xifoides, 8 mm por
  delante del borde del hígado y 20 mm a su derecha; el plano es el que mejor pasa (mínimos cuadrados con el plano
  obligado a pasar por la sonda) por el ápex, las dos válvulas AV y las dos aurículas, con el ápex a la derecha. El
  haz atraviesa ~5 cm de lóbulo izquierdo del hígado antes del corazón.
- **Subcostal VCI** (`scVci`): la sonda más vertical, delante del tramo que se mira, y el plano por el eje de la VCI
  (de 45 mm bajo el hiato a la AD): la vena cruza la imagen casi en horizontal y entra en la AD a la derecha, con las
  suprahepáticas en el hígado. Es la ventana de la medida de la VCI (modo M) y de la suprahepática del Doppler
  (preajustes «Suprahepática (SC VCI)» y «VCI (SC VCI)»).
- **Supraesternal** (`sse`): la sonda en la escotadura yugular (35 mm por encima del techo del arco y 15 mm por
  delante, en la línea media que marca el xifoides), el plano por la aorta ascendente (izquierda) y la descendente
  (derecha): el arco arriba, la AP derecha en círculo debajo y la AI más abajo.
- **Vasos cortados a lo largo**: la aorta, el tronco pulmonar y las AP pasan a ser `vaso` (luz con sangre aunque
  salgan del pericardio). Un vaso cortado a lo largo deja dos líneas abiertas: se cierran uniendo sus extremos (hasta
  45 mm), como las paredes.
- **Paredes que rozan la base**: estas vistas cortan a veces solo el epicardio cerca del borde de la base y dejan sus
  dos extremos a 31-34 mm (hasta ~46 mm con la pared gruesa de la hipertrofia del VI). El tope para unir extremos de
  una pared sube de 30 a 50 mm; como los puentes van de menor a
  mayor distancia, solo cambian los cortes que antes quedaban abiertos (una prueba lo comprueba en los cinco
  escenarios, también las formas de enfermedad).
- `dirCuerpo`/`ARRIBA`/`DELANTE`/`DERECHA` (direcciones del cuerpo en el sistema del corazón) viven ahora en
  `mat.mjs`; `abdomen.mjs` las reexporta.

## Formas de enfermedad (`escenarios.mjs`, `CRITERIOS_FORMA`)

Tres escenarios más, en su propia fila («Formas de enfermedad»), que cambian la anatomía además del latido. Las
**cifras** que se exigen son de fichas de la app y las comprueban las pruebas; los **parámetros del modelo** que las
producen son ilustrativos. Bajo los botones, el simulador muestra cada criterio con lo que mide el modelo en la
telediástole (`medidasCorazon` en `ecografia.mjs`) y un botón a la línea de la ficha.

| Forma | Qué cambia en el modelo (ilustrativo) | Criterios (fuente en la app) |
|---|---|---|
| **Hipertrofia del VI** (sobrecarga de presión, FE preservada) | masa del VI ×1,6, rigidez diastólica ×2,2, resistencias ×1,25 | pared posterior >10 mm (FATE: 6-10); grosor relativo >0,42 y masa ≥115 g/m² (guía ESC de IC, tabla de HFpEF); FEVI ≥50 % (Merino, Tabla 18.1); caen el VTD y el VS (Merino, HFpEF) |
| **Miocardiopatía dilatada** (FE reducida) | contractilidad ~1/3, V0 60 mL, 700 mL retenidos, masa ×1,4 | VI en diástole >5,5 cm (FATE: 3,5-5,5); FEVI ≤40 % (Merino, Tabla 18.1); pared normal 6-10 mm (FATE) |
| **TEP de riesgo intermedio** (sobrecarga aguda del VD; antes «TEP masivo», ver «Gravedad del shock») | resistencia pulmonar ×8, contractilidad del VD ×0,65 | área VD/VI >0,6 en apical 4 cámaras (Ficha 11, cor pulmonale agudo); VD >3,0 cm (FATE); el VI se hace más pequeño (Merino, IC derecha); tabique aplanado en diástole (Merino, Fig. 18.2); TAPSE <17 mm (Ficha 11); sube el VTD del VD (Merino) |

- Son estados ya establecidos: al elegirlas, el motor corre `ASENTAR_FORMA` (40 s) para que se asienten (los
  escenarios de shock, 10 s); las pruebas usan el mismo tiempo.
- **Masa del VI** (`mioVi`, `motor.p.mioVi`, viaja en `extraDeMotor`): el volumen de miocardio del VI se multiplica y la
  pared se engrosa; el descenso de la base se mide con la misma masa. Para que el corazón normal quedara dentro de los
  6-10 mm de FATE, el volumen de miocardio de referencia bajó de 140 a 130 mL (pared telediastólica 9,6 mm, masa
  ~74 g/m² con 1,05 g/mL, fisiología general).
- **Tabique aplanado** (`septo`, `aplanamientoSeptal` en `formas.mjs`): en cada instante sale del gradiente de presión
  VI−VD (empieza a +1 mmHg y es completo a −2 mmHg, ilustrativo; que lo decida el gradiente es fisiología general). En
  la zona media del VI, el tabique se corta por una cuerda (medio ángulo máximo 55°): corte en «D», con la pared
  conservando su grosor. Lo que la cuerda quita a la cavidad se devuelve al radio, así que el volumen dibujado sigue
  al motor. Un corazón normal no baja de +1 mmHg; en el TEP el VD supera al VI en diástole (tabique plano) y en sístole
  el tabique vuelve a curvarse.
- `septo` entra en las formas precalculadas (instantes clave y tolerancia 0,15) y la masa del VI debe coincidir para
  mezclar.
- **Discrepancia entre fuentes de la app**, señalada en el propio criterio: la Ficha 11 llama cor pulmonale a un área
  VD/VI >0,6, y Merino da como normal un VD de ~2/3 del tamaño del VI (sin decir si es área o diámetro). El modelo
  normal da 0,43.
- El TAPSE del modelo sale del vaciado del VD, así que también baja en la hipertrofia (el VS del VD cae con el del VI).
- **Accesos** `data-eco-escenario="hipertrofia|dilatada|tep"` desde Fisiopatología UCI · Cardiología (Ficha 3 y las del
  VD), Merino Cardiología (IC aguda) y Merino Neumología (ecocardiografía en la EP).

## Atlas de ecocardiografía (`atlas/`, octubre 2026)

A petición explícita del usuario («haz ingeniería reversa para conseguir unificar ambos proyectos y ponerlo en
español, pero manteniendo y siendo fiel a la fisiología»). Eco cardíaca tiene dos secciones (`.cv-secciones`):
**Simulador** y **Atlas**. El atlas es *The Heart by Ultrasound* en español: su índice de 30 capítulos, en su orden;
los que ya están en la app se abren aquí, los demás siguen enlazando al original en inglés.

- **Qué se trae y qué no.** El texto se traduce (con el permiso del autor, citado en cada capítulo) y la bibliografía
  es la suya (`atlas/referencias.js`: las 199 referencias de su `src/refs.js`, con DOI y PMID). El código no se copia:
  cada figura se reconstruye sobre los motores de la app. Así hay **una sola fisiología**: el ciclo y el asa salen del
  mismo motor del latido que mueve el corazón del simulador, y lo que el atlas dice de ella se comprueba en pruebas.
- **Unificar exigió corregir el motor**, no el texto:
  - **Contracción isovolumétrica.** El capítulo del ciclo cita a Alhakak 2025 (1.969 adultos: 40 ± 10, 292 ± 23 y
    96 ± 19 ms). El motor daba ~99 ms. Se cambió la forma de la activación ventricular (`fSubida` 0,62, la parte
    de subida, y `qSubida` 0,55, un exponente que la hace más rápida al principio). Hoy da ~42/275/100 ms.
    `referencias.mjs` lleva las tres cifras con `origen: 'atlas'`.
  - **Ees del VI de 3,2 a 2,9.** Con la nueva activación el ITV del TSVI se salía por poco de la Ficha 11.
  - **Insuficiencia mitral.** El motor la gana como orificio regurgitante (`eroaMitral`, cm²). El flujo sigue la
    ecuación del orificio con Bernoulli: v = √(ΔP/4), y Q = EROA · 50 · √ΔP mL/s. Con 0,4 cm² da ~70 mL de volumen
    regurgitante. `ultimo` da `vReg`, `fr` y `feTotal`. Con 0 no cambia nada.
  - **Una prueba de TAPSE** muestreaba por el redondeo del tiempo y se quedaba sin muestras: ahora va por índice.
  - **Forma de la eyección (cap. 08).** El flujo aórtico picaba a los ~40 ms con ~850 mL/s (2,7 m/s en un TSVI de
    2 cm), y el capítulo 08 trabaja con velocidades y gradientes. El motor gana un **efecto de la eyección**
    (`kEyec` 0,001 s/mL: mientras el VI expulsa, su presión cae una fracción proporcional al flujo; resistencia interna
    de Shroff, fisiología general): el flujo pica a ~90 ms con ~400 mL/s (cociente pico/media ~1,6). Las duraciones de
    Alhakak siguen en rango (~40/292/~90 ms). La Ees del VI sube de 2,9 a 3,1 (con la eyección más lenta la FE y la
    PTDVI se salían: 57% y 12,3 mmHg; la hipertrofia daba FE 49%). Como en el corazón real, la esquina telesistólica
    de un latido que expulsa queda algo por debajo de la elastancia máxima (~0,9): el asa dibuja la **Ees de un
    latido** (`eesLatido()` de `diagramas.mjs`, de V0 a la esquina) y la lectura muestra las dos.
  - **Estenosis aórtica.** `areaAortica` (cm²; 0 = válvula normal) y `dAorta` (cm): en la vena contracta cae 4v²
    (v = Q ÷ área) y pasado el orificio se recupera 4v² · 2r(1 − r) (r = área ÷ área de la aorta, Baumgartner 2017).
    La muestra lleva `dpVc`. Con 0 no cambia nada.
  - **Inercia mitral (cap. 10).** Sin inercia, el flujo mitral seguía al gradiente al instante y la E se cortaba: TDE
    ~115 ms (Ficha 5: 140-250). El motor gana `lMit` 0,0005 mmHg·s²/mL (la sangre que entra sigue entrando aunque el
    gradiente se invierta; la mitral cierra cuando el flujo llega a 0; Thomas y Weyman: el TDE depende de la inercia y
    de la rigidez del VI). Hoy: E/A ~1,25, TDE ~170 ms, TRIV ~90 ms, Alhakak en rango. Ilustrativo, calibrado a eso.
  - **Relajación del VI (cap. 10).** La activación del VI baja como la del VD hasta el 70% de su caída y desde ahí
    sigue una cola exponencial con la misma pendiente (`activacionVi`; constante τ ≈ 28 ms a 70 lpm). `relajacion`
    multiplica esa τ: con 2,8, τ ≈ 78 ms y el llenado pasa a relajación lenta (E/A ≤0,8, TRIV y TDE largos). El VD no
    cambia. La muestra lleva `eVi` y `qVp`.
  - **Válvula pulmonar y VD (cap. 14).** El flujo pulmonar picaba a los ~20 ms con ~660 mL/s. Como en la mitral y la
    aórtica, la pulmonar gana **inercia** (`lPul` 0,002 mmHg·s²/mL: se abre cuando la presión del VD supera la de la AP
    y cierra cuando el flujo llega a 0) y el VD un **efecto de la eyección** (`kEyecVd` 0,002 s/mL). Para que la
    presión sistólica del VD siga en 20-25 mmHg (Ficha 5), la Ees del VD sube de 0,40 a 0,50. Hoy: PAPs ~22,
    tiempo de aceleración en el TSVD ~142 ms, FE del VD ~54%. Dos parámetros nuevos, neutros por defecto:
    `durVd` (multiplica la duración de la sístole del VD; >1 en la sobrecarga de presión, que es lo que aplana el
    tabique en telesístole) y `eroaTricus` (insuficiencia tricuspídea, misma ecuación del orificio que la mitral;
    `ultimo` da `vRegT` y `frT`). La muestra lleva `qTriReg` y `eVd`.
  - **Geometría del VD (cap. 14).** La base del VD se ensancha más deprisa que la raíz cúbica del volumen (`kT`: de
    media luna a esfera cuando se dilata), la pared libre del VD engrosa con `mioVd` (`motor.p.mioVd`, viaja en
    `extraDeMotor`) y el tabique se aplana con `ALFA_SEPTO` 1,1 (Ryan 1985). El infundíbulo crece menos que la base
    (`kR = min(kT, 1,3)`), porque su ventana angular es estrecha y con el VD muy dilatado se salía de ella.
  - **Grado 3 diastólico de referencia** (`CORAZONES_LLENADO[3]` de `diastolica.mjs`): con la nueva válvula pulmonar
    pasa a relajación 2,8, rigidez 2,6, volumen 1.000 mL y V0 de la AI 30 mL, para seguir dando E/A ≥2.
  - **Lo que no se hizo:** un efecto pistón del plano AV sobre la AI (para dar la onda S de las venas pulmonares)
    desestabilizaba la AI y movía media docena de referencias; el cap. 10 no calcula S/D y lo dice.
- **Archivos.**

  | Archivo | Qué es |
  |---|---|
  | `atlas.js` | Controlador: pinta el índice, abre los capítulos y numera las citas |
  | `cap-*.html` | Texto de cada capítulo. Se piden al abrirlo, no al arrancar |
  | `figura.mjs` | Piezas comunes: lienzo, mandos, lecturas y animación solo en pantalla |
  | `pulso.mjs` | Figura del 01 Pulso |
  | `imagen.mjs` | Figura del 02 Imagen |
  | `efecto-doppler.mjs` | Figura del 03 Doppler |
  | `ciclo.mjs` | Figura del 06 Ciclo cardíaco |
  | `asa.mjs` | Figura del 07 Asa presión-volumen |
  | `hemodinamica.mjs` | Figura del 08 Hemodinámica por Doppler |
  | `sistolica.mjs` | Figura del 09 Función sistólica (biplano de discos sobre la geometría) |
  | `diastolica.mjs` | Figura del 10 Función diastólica (corazones del motor y algoritmo ASE 2025) |
  | `vd.mjs` | Figura del 14 Ventrículo derecho (sobrecarga de presión, de volumen y TEP agudo) |

  Cada figura exporta `montar(contenedor)` → `{ parar() }`. La lógica pura (`fisica`, `frecuenciaImagen`, `doppler`,
  `duraciones`, `asentar`, `medidasAsa`, `motorFlujo`, `analizarFlujo`, `estimarPad`, `analizarDerechas`, `medirSistolica`, `trazarVi`, `volumenBiplano`, `motorLlenado`, `medirLlenado`, `algoritmoAse`, `ajustesVd`, `motorVd`, `medirVd`, `indiceExcentricidad`, `patronSepto`, `signosTep`) se exporta y la prueba `pruebas/atlas.test.mjs`.
- **Capítulos en la app.**
  - **01 Pulso.** La línea paraesternal atraviesa el corazón del simulador en telediástole: tabique 9,5 mm, VI 53 mm.
    Muestra el modo A, un zoom de la resolución axial con dos reflectores a 0,4 mm, la TGC y la profundidad útil.
    Nota de fidelidad: la reflexión grasa-músculo da 1,1% con la tabla del IAEA y 1,4% con la de OpenStax.
  - **02 Imagen.** Un maniquí sectorial construido línea a línea, con su frecuencia de imagen exacta y cuatro
    artefactos.
  - **03 Doppler.** Ecuación Doppler, cos θ, Nyquist = c²/(8·prof·f0), pulsado, continuo y color con aliasing.
  - **06 Ciclo cardíaco.** El Wiggers y el asa del motor (`crearDiagramas`), con un cursor de tiempo tras la onda R
    y las duraciones del motor frente a Alhakak.
  - **07 Asa presión-volumen.** Cinco corazones y cuatro mandos. Cada uno cambia un parámetro del motor (Ees, curva
    diastólica, resistencia sistémica, volumen) y el motor corre hasta asentarse, sin barorreflejo. Pinta la recta
    de Ea y compara la FE de la fórmula (V0 = 0) con la del motor. La IM usa el orificio regurgitante.
  - **08 Hemodinámica por Doppler.** Dos modos. *Flujo y presión*: el motor con estenosis aórtica (área del orificio,
    aorta ascendente, volemia) y el TSVI con su diámetro real y un error de medida; dibuja el tracto de salida con la
    sangre a la velocidad local y la presión a lo largo del eje (VI, vena contracta, aorta), y el espectro CW aórtico
    y PW del TSVI. Lecturas: gradiente máximo y medio (frente a 4·v media²), caída neta del catéter y recuperación,
    ITV, VS por Doppler frente al real, área por continuidad y cociente de velocidades. *PSVD y VCI*: cinco
    corazones del motor (normal, hemorragia, fallo del VI, derrame, TEP), con la velocidad de un chorro de IT sacada
    del gradiente VD-AD (el motor no tiene IT), la VCI en modo M con sniff, respiración tranquila o ventilación, la
    PAD por las tres categorías de la ASE 2025 y la PSVD estimada frente a la real. Nota de fuentes con FATE.
  - **09 Función sistólica.** Cortes apicales de 4 y 2 cámaras del corazón de la app (los planos del simulador),
    movido por el motor: trazado, L y 20 discos calculados sobre el corte (`trazarVi`: el anillo es la intersección
    con el plano AV, el ápex el punto más lejano, los diámetros por bisección) y volumen biplano frente al real del
    motor (normal 120 frente a 126 mL). Cuatro corazones (normal, fallo, dilatada, hipertrofia), cine o
    telediástole/telesístole, y el **acortamiento del ápex** como un transductor hasta 24 mm fuera del ápex que sigue
    apuntando a la base: L baja, el ápex se redondea, los volúmenes caen (más el telesistólico, así que la FEVI
    sube). Bandas de Lang 2015 por sexo, categoría de IC y un «acortamiento del borde» del 4C (aproximación al strain:
    −19% normal, −15% en la HVI con FE preservada, −8% en el fallo). Nota de fuentes: Teichholz en la Ficha 5.
  - **10 Función diastólica.** Un deslizador 0-3 con cuatro corazones de referencia del motor (relajación, rigidez,
    volumen y remodelado de la AI, interpolados): normal, grado 1, grado 2 y grado 3 según el propio algoritmo
    ASE 2025 (`algoritmoAse`), que se pinta paso a paso y se compara con la presión media de la AI del motor (un
    «catéter»). Del motor: E, A (flujo entre el área del anillo, como el Doppler del simulador), TDE, TRIV, velocidad de
    IT, volumen de la AI; ilustrativo: e′ (12 cm/s ÷ relajación^0,6; el septal, el 80%), la forma del Doppler tisular
    (el cambio de longitud del VI) y el strain de reservorio de la AI (por volumen). Sin S/D: el paso 3 usa el strain,
    el volumen de la AI y el TRIV, alternativa de la guía. En el grado 3 aparece una onda de mitad de diástole que
    sale sola de la inercia.
  - **14 Ventrículo derecho.** Un selector de carga (normal, sobrecarga de presión, de volumen, TEP agudo) con un
    deslizador de gravedad, que cambia parámetros del motor (`ajustesVd`): en la presión, la resistencia pulmonar
    sube y la distensibilidad de la AP baja con ella (constante de tiempo RC: por eso cae el tiempo de aceleración), la
    sístole del VD se alarga, la pared engrosa y, al final, el VD se dilata y su contractilidad cae; en la de volumen,
    insuficiencia tricuspídea, más volemia y un VD más distensible; en el TEP, la resistencia sube de golpe sobre un VD
    sin hipertrofia. Imágenes reales del ecógrafo de la app (A4C y eje corto a nivel de los papilares) en cine,
    telediástole o telesístole, con el diámetro basal del VD y el índice de excentricidad (D2/D1, aplanado >1,1); el
    Doppler continuo de la IT y el pulsado del TSVD con el tiempo de aceleración; lecturas con las bandas de Mukherjee
    2025 (Tabla 1) y, en el TEP, los signos de la ESC 2019. El patrón del tabique (aplanado en diástole, en sístole o
    en las dos) sale de la geometría, no se escribe. Normal: VD 3,0 cm, FAC 47%, TAPSE 21, IE 1,00, AcT 142 ms;
    presión 0,75: pared 8,9 mm, IT 3,9 m/s, AcT 78 ms, aplanado en los dos tiempos; volumen 1: VD 4,1 cm, IT 1 m/s,
    aplanado solo en diástole; TEP 1: VD/VI 1,05, TAPSE 5 mm. Nota de fuentes con FATE, la Ficha 11 y Merino.
- **Navegación.**
  - `data-eco-atlas="clave"`, junto a `data-especialidad="eco"`, abre un capítulo desde cualquier ficha. Hoy hay
    accesos en Fisiopatología UCI · Cardiología, Fichas 1 y 3. La subcostal VCI y la medida de la VCI llevan al 08.
  - En «Qué mirar» del simulador, los capítulos que ya están en la app se abren aquí.
  - `[data-at-sim="M"|"D"]` dentro de un capítulo lleva al simulador en ese modo.
  - «Repasar este capítulo» usa `data-quiz-tema`, un atributo nuevo y genérico de `quiz.js`.
  - Banco: `js/data/eco-atlas-preguntas.js`, 52 preguntas, asignatura Eco cardíaca.
- **Siguiente, por orden.** Las válvulas, empezando por la IM (el motor ya la
  tiene); pericardio. Las vistas (04) y la ETE (05) chocan con la anatomía congelada y la sonda libre ya existe, así
  que van al final. Los capítulos de enfermedad necesitan la forma de enfermedad correspondiente en el corazón.

## Hemodinámica de Marino: capa de lectura (octubre 2026)

Decisión del profesor (bloque 1, `autonomo/bloques/b1/diseno-sin-modelo.md` §8): el motor **no cambia su fisiología**;
se le añade una capa que lo lee y dos maniobras de volumen, para las fichas `mar-retorno-venoso`, `mar-respuesta-fluidos`,
`mar-cateter-ap` y `mar-termodilucion` de Marino · Fundamentos.
- `maniobras.mjs`: `epp(motor, on)` pasa 300 mL del volumen venoso sin tensión al que empuja (`p.vuVen −= 300`) y los
  devuelve al quitarla; `bolo(motor, mL)` suma a `s.vven`. Tras cada maniobra el panel corre 10 s (ilustrativo). Antes
  de la primera (y al abrir el panel desde una ficha), el paciente se asienta hasta 40 s desde que empezó el escenario
  (`faltaParaAsentar`; `aplicarEscenario` de `escenarios.mjs` apunta `p.tEscenario`): un shock se ve a los 10 s con el
  barorreflejo aún compensando, y la EPP ahí medía también esa compensación (hemorragia +64 %, fallo del VI +15 %).
  Asentado, y igual en la app que en las pruebas: hemorragia +16,9 %, fallo +2,7 %, dilatada +0,9 % (con la segunda vuelta
  del shock, 21/10/2026; antes, +16,1 / +2,0 / +0,3 %, y antes de la gravedad del shock, +20,2 / +2,7 / +1,3 %).
- `lecturas.mjs`: `guyton(motor)` (RV = (Pms − PAD)/Rv con Rv = (Pms − PVC)/GC del último latido), `curvaFuncion` de la
  tabla precalculada, `presionEnPunta(estado, 'ad'|'vd'|'ap'|'enclavado')`, `lecturaCateter` y `curvaTermo(gc, qRegT)`.
  **El enclavamiento lee `pvp` (venas pulmonares), no `pai`**: la ficha lo define como «la presión venosa del lado
  izquierdo»; la AI del motor oscila 2-16 mmHg y la onda pulsátil no «desaparecería». La diastólica del VD es la
  telediastólica (= PVC, ficha #mar-termodilucion).
- `guyton-tablas.mjs`: (PVC, GC, Pms, VS) de cada escenario con −600 a +900 mL, 40 s con barorreflejo; se regenera con
  `node js/modules/eco/herramientas/curvas-guyton.mjs` si cambia el motor o un escenario (~45 s).
- `diagramas.mjs` · `crearPanelesHemo`: tres plegables en `eco.html` (ids `cvh-`): Guyton con EPP y bolos (tope
  1.500 mL), catéter que avanza en un esquema 2D tipo Fig. 8.2 (no en el corazón 3D; globo con Motion solo al moverlo) y
  termodilución (3 medidas, ±6 % ilustrativo entre ellas; insuficiencia tricuspídea ilustrativa). Cada cifra con su chip.
- Acceso: `data-eco-panel="guyton|epp|cateter|termo"` junto a `data-eco-escenario`, en el listener de siempre de
  `index.js`; el escenario se rehace limpio y el «← VOLVER» vuelve a la ficha (`modelosVivos.ecoPanel` +
  `core/volver-ficha.js`).
- Pruebas: `pruebas/maniobras.test.mjs` (Tabla 8.1, catéter, EPP, bolo, Guyton, termodilución y paciente posible).
  Calibración del 20/10/2026: la PVC normal pasó de 5,02 a 4,19 mmHg (Tabla 8.1: 0-5). La meseta sistólica de la AD,
  pegada a la presión venosa, inflaba la media: AD más distensible (a 0,13, b 0,080), VD algo más (a 1,9: su
  telediastólica baja con la PVC, el catéter las lee iguales), vuVen 2300 y rRetorno 0,025 (Pms ~7). Más baja no cabía
  sin sacar del rango la VD sistólica (20-25) o pasar de 40 mmHg las venas pulmonares en la hipertrofia con 1,5 L y EPP.

## Gravedad del shock (octubre 2026, M1 del bloque 3)

Hemorragia, fallo del VI, derrame y TEP tienen un **mando de gravedad** de 0 (sin lesión) a 1 (shock a fondo):
`ESCENARIOS[k].aplicar(m, g)` o `aplicarEscenario(m, k, g)`; sin `g`, `gravedad.defecto` da el escenario de siempre y
`gravedad.texto(g)` dice cuánto es (mL perdidos, % de contractilidad, mL de derrame, × de resistencia pulmonar). El estado
se lee asentado (40 s, `faltaParaAsentar`). Topes: hemorragia 42 % de la volemia (Clase IV, Tabla 15.1), Ees del VI 0,3
(escala logarítmica), derrame 388 mL (en parábola: cada paso añade menos al final) y resistencia pulmonar ×9,3 (el TEP de
alto riesgo; el de siempre, ×8, es el de riesgo intermedio: Marino, cap. 22, p. 7, y por eso ya no se llama «masivo»).
(Antes 390 mL y ×16: ver «Segunda vuelta», abajo.)

Antes, subir la gravedad rompía el motor (2 L → PAM 11; 2,5 L → PAM 0 con RVS negativa; derrame de 550 mL → NaN; Ees
0,45 → PAM 81 con PCP 41). Lo que faltaba, corregido en `motor.mjs` (cada pieza explicada en `BASE`):
- **Venas con codo** (`conCodo`, `codoVen`, `codoPul`): por debajo del volumen sin tensión la presión no era 0 de golpe.
- **Relleno transcapilar** (hasta 1 L, Marino cap. 15 p. 21), movido por la caída de la presión capilar; lento (minutos).
- **Edema de pulmón** (`kEdema`, `pEdema` 28 mmHg): sin él, al fallar el VI la sangre se acumulaba en el pulmón sin límite.
- **Hemorragia, derrame y contractilidad llegan a su ritmo** (`ritmoHemorragia` 80 mL/s, `ritmoDerrame` 40 mL/s y solo
  mientras el saco esté por debajo de `pFuenteDerrame`, `tauContractilidad` 4 s): aplicados de golpe, la PAM caía a ~30
  antes de que el barorreflejo respondiera, había latidos sin eyección y el saco llegaba a 10⁵ mmHg.
- **Cámaras que no bajan de 0 mL** (colapso por debajo de 3 mL) y RVS con el flujo del lecho; SvO₂ sin 0/0.
- **Techo del barorreflejo en las resistencias, +60 % → +15 %**: la RVS basal del modelo ya es alta (1.488; pendiente),
  y con PAM − PVC = IC · SC · RVS / 80 un shock a fondo no podía tener a la vez PAM ≤60 e IC ≥1,2. La vasoplejía pasó de
  resistencias ×0,4 a ×0,5 para quedarse con la misma PA.

`pruebas/escenarios.test.mjs` comprueba en 0-100 % (12 puntos, asentado, y 120 s más a fondo) PAM 40-130, FC 40-170,
IC 1,2-5, PVC 0-25, PCP 2-35, VS 15-110 y SvO₂ 30-85 %, sin saltos (la PAM baja siempre, ≤15 mmHg cada 10 %) y la PAM
mínima mientras se asienta (≥40). **Excepción**: la PCP de la hemorragia y del TEP graves baja hasta ~1 mmHg (el VI con un
VS de ~20 mL se llena a eso con su curva diastólica, la misma que da la PCP normal de 7,6); se exige ≥1.

### Segunda vuelta (21/10/2026)

Lo que encontró la maqueta del shock (v2) y se corrige en `motor.mjs` (cada pieza explicada en `BASE`; pruebas en
`pruebas/motor.test.mjs` y `pruebas/escenarios.test.mjs`):
- **RVS calibrada**: `rSis` 1,05 → 0,90 y consigna del barorreflejo 100 → 87. Normal: PA ~106/67 (PAM ~87), RVS ~1.285,
  **IRVS ~29,7** (Tabla 8.1 de Marino: 25-30; nueva referencia `irvs-t81`). Los 900-1.200 de la Ficha 5 siguen
  `pendiente`: con el GC de ~5,1 que fija el ITV del TSVI (≤22 cm, Ficha 11) no caben con la PA en ~105/65. Con ella:
  techo del reflejo en las resistencias +15 % → **+35 %** (el mismo techo absoluto, ~1.690), `fCap` 0,12 → 0,14 (la presión
  capilar de reposo de antes), `rPul` 0,08 → 0,095 (la sistólica del VD seguía en 20-25) y la vasoplejía ×0,5 → ×0,55.
- **Arteria pulmonar que se endurece** por encima de 24 mmHg (`rigAp`, `kRigAp`): sin ella, con un VS de ~20 mL la
  pulmonar no latía (TEP 55/53, fallo del VI 39/35). Ahora 40/33 y 42/35.
- **Isquemia del VD** (`isqDesde`, `isqAncho`, `isqVdMax`, `tauIsqVd`): cuando la presión sistólica del VD se acerca a la
  PAM (÷ el grosor de su pared, `mioVd`), su contractilidad cae hasta un 80 %. Es la consecuencia de la hipertensión
  pulmonar que da Marino (cap. 18, p. 3). Frena la PCP del fallo del VI (antes la frenaba un edema que vaciaba la sangre) y
  la pulmonar del TEP (media ≤40). El TEP pasa a ×9,3 a fondo (×16 hundía al VD sin freno).
- **Edema lento**: `kEdema` 5 → 0,1 mL/s por mmHg (antes ~500 mL en 40 s). En el fallo del VI a fondo la PVC ya no baja de
  la normal (2,8 → 6,4; Tabla 14.1) y la PCP queda en ~33, también a los 2 min.
- **Derrame establecido**: `crearMotor({ liquidoPeri })` es un paciente que ya tenía el derrame (pericardio estirado lo que
  pasa de `derrameTolerado`, 340 mL); antes daba NaN. 550, 1.000 o 2.000 mL se asientan en un taponamiento con PVC ≈ PCP
  (~9/10), IC ~1,8 y PAM ~75. El derrame que se añade con el motor en marcha (el mando) sigue siendo agudo: 550 mL agudos
  son un hemopericardio que para el corazón (PAM ~21), y el mando acaba en 388.
- **Gasto con sentido y soporte**: `vs` y `gcValvula` son lo que sale por la válvula aórtica, neto y nunca negativo (el
  reflujo de cierre no es gasto); `gc` es lo que llega al cuerpo (`gcValvula` + `gcImpella` + `gcEcmo`). Punto de entrada
  `p.soporte = { impella, ecmo, venteo (L/min), balon (mL) }`, que se puede cambiar en marcha: el balón desplaza volumen
  en la aorta de la onda R al cierre de la aórtica (p. 45-46), el Impella pasa sangre del VI a la aorta (p. 47) y el ECMO de
  las venas a la aorta, con venteo del VI (p. 48-49). Las bombas no sacan lo que no hay (succión: ilustrativo). La RVP se
  calcula con el flujo pulmonar (con ECMO no es el gasto). Cada latido trae `gcValvula`, `gcImpella`, `gcEcmo`,
  `gcVenteo`, `balon` e `isqVd`; cada muestra de la onda, `vBalon`, `qImp` y `qEcmo`.
- Atlas · 14 (`atlas/vd.mjs`): para no contar dos veces la rigidez y la isquemia, la hipertensión pulmonar crónica divide la
  distensibilidad por k^0,5 (antes k^0,9) y su rigidez diastólica del VD sube ×(1 + 0,2x) (antes 1 + x); el TEP agudo,
  resistencia ×(1 + 7x), distensibilidad ÷(1 + 3x), contractilidad ×(1 − 0,4x). Mismas conclusiones del texto.

## Rendimiento medido

En un móvil Android real (octubre 2026, pantalla de 90 Hz, calidad alta, sangre activada), **antes de las formas
precalculadas**: **57-90 fps**. 90 es el tope de esa pantalla; las bajadas coincidían con el desplazamiento de la
página y, probablemente, con el recolector de memoria (la geometría creaba arrays nuevos en cada fotograma, lo que
las formas precalculadas eliminan con el latido estable). Pendiente de volver a medir en el móvil. Para la
integración: limitar a 60 fps (ahorra batería sin que se note) y animar solo cuando se ve en pantalla.

## Créditos

- **Eco real de uso libre** (Wikimedia Commons; tarjeta «Eco real» del simulador, `eco-real.mjs`): *Echocardiogram 4chambers.jpg* (sin autor, dominio público); bucle A4C de Fruehaufsteher2 (CC BY-SA 3.0, convertido a vídeo, misma licencia); PLAX recortado de *LeftParasternalLongAxis.gif*, Patrick J. Lynch y C. Carl Jaffe, Yale (CC BY 2.5).

Varias ideas vienen de ***The Heart by Ultrasound***, de **David Ouyang** (`douyang/echodemo`, grupo EchoNet), que
dio permiso para usar su trabajo. Aun así **se reconstruyen sobre nuestro motor, sin copiar código ni modelos**:
un estado por fotograma, las formas precalculadas que solo se mezclan, las valvas con tres formas a lo largo de un
arco y las vistas ecográficas cortadas del propio corazón. Si algo de esto se publica, el autor agradece (sin exigirla) una cita.

### The Heart by Ultrasound en la app (octubre 2026)

A petición explícita del usuario, la vista Eco cardíaca tiene un apartado con **enlaces** al atlas (no su contenido):
la web <https://intro2echo.com> (donde despliega `main` del repositorio, en Cloudflare Pages) y el código
(<https://github.com/douyang/echodemo>). `atlas-ouyang.js` guarda, como datos puros, sus 24 capítulos y 6 extra con
la clave con la que cada uno se abre en la dirección (`#as`, `#tee`… de `src/order.js`; `#ivc` es un alias que abre
el 08 en el modo de la VCI), y qué capítulo enlazar desde cada vista, escenario, modo y medida del simulador.
`index.js` pinta el índice y, en «Qué mirar», la línea «En The Heart by Ultrasound» con los capítulos de lo que se ve.

Cómo está hecho (relectura del repositorio en octubre de 2026, commit `9b337e6`): sin paso de compilación, módulos
ES, `three.js` para el 3D y rough.js para los dibujos; **un solo corazón** (`assets/heart.json`, 2,3 MB), un juego
de planos de vista, un renderizador de eco (`src/bmode.js`: ecogenicidad por estructura, superficie especular,
sombra del calcio, moteado que se mueve con la pared, desenfoque del haz, compresión logarítmica) y un modelo del
ciclo sirven a todos los capítulos; cada enfermedad es un *shape target* de la malla con un peso calibrado para que
la imagen mida lo que dice el texto (tablas `src/*cal.js`); las páginas de gravedad mueven un solo deslizador dentro
de las bandas de las guías y redondean antes de graduar, para que una cifra no contradiga su grado (`src/sev.js`);
un solo almacén de estado (`src/state.js`); unas 115 peticiones y 7,9 MB por capítulo, con la malla guardada en
IndexedDB entre visitas. Las ideas que ya tomamos (un estado por fotograma, formas precalculadas, valvas en arco,
eco cortada del corazón) siguen reconstruidas sobre nuestro motor.

**Hígado, diafragma y apófisis xifoides**: mallas de **Z-Anatomy** (https://www.z-anatomy.com), licencia
**CC BY-SA 4.0**, derivadas de **BodyParts3D** (© Database Center for Life Science, DBCLS), obtenidas del paquete npm `@authorod/svitylo-3d-anatomy-data` 1.1.0 (canal de prueba). Se han simplificado,
cuantizado y colocado bajo nuestro corazón; `abdomen-data.mjs` es una obra derivada y se distribuye bajo la misma
licencia CC BY-SA 4.0 (el resto del simulador no). La cita también se muestra en la propia página del simulador.
**meshoptimizer** (MIT, A. Kapoulkine) se usa solo en la herramienta que genera ese archivo, no en la app.

## Pendiente

- **RVS de la Ficha 5** (900-1200): el motor da ~1.285 (IRVS ~29,7, dentro de la Tabla 8.1). Bajar más choca con el ITV
  del TSVI (Ficha 11, 18-22 cm, hoy ~21,6) y con la PA del normal (~106/67): subir el gasto sube el ITV, salvo que el TSVI
  del modelo sea algo más ancho.
- **Soporte mecánico**: el flujo de cada bomba no depende de la presión que vence (falta la curva de cada aparato); con ECMO
  sin ventear la PCP del fallo a fondo llega a ~50 (la fuente dice que sube, no cuánto), fuera del rango del paciente
  posible si el panel lo deja así; la SaO₂ de la mezcla con el oxigenador no está en el motor.
- **Doppler**: S > D en las suprahepáticas en
  reposo; S/D de las venas pulmonares (necesita el efecto pistón del plano AV); Doppler tisular en el simulador (e′, E/e′ de la Ficha 5) y Doppler continuo; insuficiencias valvulares en el simulador (el motor ya
  tiene la mitral, `eroaMitral`, que usa el Atlas; falta el chorro en la eco y las otras válvulas).
- **Abdomen**: ventilación mecánica (índice de distensibilidad de FATE) en el reloj respiratorio; el derrame del motor
  de siempre (260 mL) solo llega a PVC ~7,5, así que su VCI no sale «dilatada» (>21 mm) aunque ya no colapse un 50 %;
  a fondo (390 mL), ~10 (no comprobado en la VCI).
- Más ideas de *The Heart by Ultrasound* por reconstruir: que una cifra mostrada nunca contradiga su grado.
- **Formas de enfermedad** por añadir si llegan fuentes: hipertrofia del VD e hipertensión pulmonar crónica (FATE
  solo da pared del VD ~5 mm), amiloidosis (pared del VI y del VD engrosadas, guía ESC), dilatación auricular (ESC:
  volumen de la AI >34 mL/m²; el modelo no mide aún el volumen auricular indexado), insuficiencias valvulares.
- **Vistas de la fase 5**: en la subcostal 4 cámaras el VD queda solo algo más cerca del hígado que el VI (con
  nuestra anatomía, menos que en un paciente); la subcostal no tiene reto de paso entre vistas (la de la VCI pone la
  sonda en otro sitio de la piel); la supraesternal no tiene troncos supraaórticos ni Doppler del arco (el motor no
  da flujo más allá de la raíz).
- Ecografía en un *worker* si en el móvil baja de fps.
- **Atlas de ecocardiografía**: quedan 21 capítulos por pasar a la app (9 de 30 ya están) (ver «Atlas de ecocardiografía»).
