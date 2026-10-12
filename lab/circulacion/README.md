# Circulación viva (laboratorio)

Corazón 3D movido en cada instante por un motor del latido. **Está en laboratorio:** la app no carga
nada de esta carpeta (no hay ningún `data-include` ni `import` hacia aquí). Su destino es la vista Visual
de Fisiopatología UCI · Cardiología, empezando por la ficha del ciclo cardíaco.

## Abrir

```
cd lab/circulacion && python3 -m http.server 8000
```

- `corazon-3d.html` — el corazón: sangre en movimiento, barra del ciclo A-G, **Wiggers y asa presión-volumen en el
  mismo instante**, cortes y pruebas de shock.
- `latido.html` — curvas de Wiggers, asas presión-volumen y la tabla de cifras frente a su referencia.

## Pruebas (un solo comando, desde la raíz del repo)

```
node --test 'lab/circulacion/pruebas/*.test.mjs'
```

Tarda ~100 s. Si Playwright no está instalado, las pruebas de navegador se omiten y el resto se ejecuta.

- `motor.test.mjs` — cada cifra del latido normal frente a su referencia (`referencias.mjs`), el volumen
  de sangre se conserva, las 7 fases salen en orden, nunca hay dos válvulas del mismo lado abiertas, las
  fases isovolumétricas no cambian el volumen, la incisura, el barorreflejo (quieto en reposo, compensa
  una hemorragia) y que **cada escenario reproduce el patrón de su tipo de shock en la fuente**.
- `diagramas.test.mjs` — las fases del último latido salen A-G, contiguas y cubriendo el latido; el centro de cada
  fase cae en ella; revisar un instante devuelve la muestra más cercana; tocar un punto del asa devuelve esa muestra;
  las escalas contienen todas las curvas; y la esquina telesistólica del asa cae sobre la ESPVR que se dibuja.
- `geometria.test.mjs` — los orificios valvulares caben en la base en todo el rango de volúmenes, ninguna
  pieza tiene coordenadas no finitas ni con volúmenes absurdos, la sangre de cada cavidad sigue a su
  volumen, y **la valva gira sobre su bisagra sin encogerse** (el borde libre recorre un arco al abrir).
- `formas.test.mjs` — los instantes de las formas precalculadas cubren el latido con error acotado y son más
  densos donde todo cambia deprisa; en el instante de una forma la mezcla es exactamente esa forma; en el
  latido siguiente la mezcla se usa en más del 95% de los fotogramas y el 99% de los vértices queda a menos de
  0,5 mm de la geometría exacta; si la mezcla no representa al estado mostrado (volumen, válvulas, derrame,
  corte), no se usa; y tras una hemorragia la tabla caduca.
- `navegador.test.mjs` — el corazón se dibuja, la barra del ciclo lleva a cada fase, el dedo desplaza la
  página en vertical y gira en horizontal, un escenario cambia la circulación, sin WebGL se ve la imagen
  fija, la página del latido no deja ninguna cifra fuera de rango sin marcar, y **en cada fotograma el corazón,
  el cursor del Wiggers y el punto del asa leen el mismo instante** (en tiempo real, al deslizar sobre el
  Wiggers y al tocar el asa), y **con el latido estable se usan las formas precalculadas sin perder esa sincronía**
  (con corte o con la casilla apagada, geometría exacta).

Las cifras marcadas `pendiente` en `referencias.mjs` salen como *todo*: no fallan, pero si un día pasan a
cumplirse, una prueba avisa para quitar la marca.

## Archivos

| Archivo | Qué es |
|---|---|
| `motor.mjs` | Motor del latido en el tiempo (sin DOM): 4 cámaras, válvulas por gradiente, aórtica con inercia, pericardio, tabique, lechos sistémico y pulmonar, barorreflejo |
| `escenarios.mjs` | Escenarios de shock (los usa la página y los comprueban las pruebas) y el patrón de cada tipo según la fuente |
| `referencias.mjs` | Cifras del latido normal con su referencia y su origen (ficha de la app o fisiología general) |
| `corazon-geo.mjs` | Geometría procedural del corazón a partir de los volúmenes del motor, y el interior para la sangre |
| `diagramas.mjs` | Wiggers y asa P-V que siguen al corazón: fases, muestras del último latido, escalas y dibujo |
| `formas.mjs` | Estado de la geometría a partir del motor (volúmenes, apertura y carga de las válvulas) y las formas precalculadas a lo largo del último latido, que se mezclan en cada fotograma |
| `flujo-sangre.mjs` | Partículas de sangre: cuántas cruzan cada válvula sale del flujo del motor |
| `render-webgl.mjs`, `mat.mjs`, `earcut.mjs` | Renderizador WebGL propio, matrices y cámara, triangulación |
| `img/corazon-estatico.jpg` | Imagen fija para navegadores sin WebGL |

## Reglas

- **Toda cifra visible tiene origen**: `ficha` (se cita la ficha de la app y su PDF en `docs/`), `fisiología
  general` o ilustrativa. Una referencia nueva se añade en `referencias.mjs`, nunca escrita a mano en una página.
- **Un escenario nuevo** va en `escenarios.mjs` con su `tipo`; las pruebas comprueban solas su patrón.
- **Solo WebGL.** Sin WebGL, imagen fija con aviso. (Canvas 2D se quitó: duplicaba cada novedad.)
- **Anatomía congelada.** No se añaden piezas anatómicas salvo que sirvan a una ficha concreta.
- Tras cualquier cambio: `node --test 'lab/circulacion/pruebas/*.test.mjs'` en verde antes de subir.

## Sincronización: un estado por fotograma

Idea tomada de *The Heart by Ultrasound* (ver «Créditos»): no hay dos relojes que mantener a la par. En cada fotograma, `corazon-3d.html` decide **un** estado
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

## Rendimiento medido

En un móvil Android real (octubre 2026, pantalla de 90 Hz, calidad alta, sangre activada), **antes de las formas
precalculadas**: **57-90 fps**. 90 es el tope de esa pantalla; las bajadas coincidían con el desplazamiento de la
página y, probablemente, con el recolector de memoria (la geometría creaba arrays nuevos en cada fotograma, lo que
las formas precalculadas eliminan con el latido estable). Pendiente de volver a medir en el móvil. Para la
integración: limitar a 60 fps (ahorra batería sin que se note) y animar solo cuando se ve en pantalla.

## Créditos

Varias ideas vienen de ***The Heart by Ultrasound***, de **David Ouyang** (`douyang/echodemo`, grupo EchoNet), que
dio permiso para usar su trabajo. Aun así **se reconstruyen sobre nuestro motor, sin copiar código ni modelos**:
un estado por fotograma, las formas precalculadas que solo se mezclan y las valvas con tres formas a lo largo de un
arco. Si algo de esto se publica, el autor agradece (sin exigirla) una cita.

## Pendiente

- **Calibrar** la RVS (el motor da ~1.450; la Ficha 5 dice 900-1200) y la contracción isovolumétrica
  (~99 ms; fisiología general 50-90).
- **Erratas de la fuente sin nota en la app:** las dos tablas de patrones de shock de El Libro Azul
  (cap. 5, pág. 70 del PDF de la parte 1; cap. 10, Figura 2, pág. 33 de la parte 2) dan RVS «↑» o «N/↑»
  en el shock distributivo, y la del cap. 10 da ScvO₂ «↑» en el hipovolémico. Las fichas 5 y 10 las
  reproducen tal cual. Las pruebas usan la Tabla 14.1 de Merino (cap. 14), que no tiene ese problema.
- Integración en la app (una sola ficha, animando solo cuando se ve) y escenarios enlazados a las fichas.
- Más ideas de *The Heart by Ultrasound* por reconstruir: vistas ecográficas en modo B cortadas de nuestro propio
  corazón; formas de enfermedad movidas por los escenarios (choca con «anatomía congelada»: hace falta decidirlo);
  y que una cifra mostrada nunca contradiga su grado.
- **Saltos de la geometría exacta:** la huella de las aurículas (y la grasa periaórtica) se calcula con rayos que
  se paran al tocar la raíz aórtica; un rayo casi tangente pasa de pararse a no pararse y un vértice salta hasta
  ~8 mm entre dos fotogramas. La mezcla lo suaviza (lo convierte en un cambio gradual entre dos formas), pero
  la geometría exacta (con corte o sin formas) lo sigue teniendo.
- Referencia candidata para la contracción isovolumétrica: Alhakak AS et al. Clin Res Cardiol 2025;114:430-442
  (doi 10.1007/s00392-023-02269-2), ~40 ms en adultos sanos; pendiente de tener el PDF para citarla.
