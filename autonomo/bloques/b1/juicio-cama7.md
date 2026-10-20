# Bloque 1 · Juicio del profesor sobre «La cama 7» (muralla, telar e inmersión)

20/10/2026 · modo juzgar · 390×844 táctil y medidas a 360×740. Capturas en
`/tmp/claude-0/-home-user-fiebres-neutropenias/40902b75-c6c3-5f54-80a6-1cd14b471621/scratchpad/shots/`.
Las comparo con el capilar y el catéter (vuelta 2) y con el diseño (`diseno-sin-modelo.md`).

**Lo que funciona en las tres:**
- `window.__pruebas()` sale en verde.
- No hay errores de consola ni desbordamiento a 390 ni a 360 px.
- Recorrí la primera pantalla, de 5 a 11 estados de cada una y entre 4 y 7 preguntas del recorrido, fallando
  la primera adrede. Recorrí entero un caso de cada una hasta «Lo que te llevas»: el E1, el E3 y el E4.
- El fallo de la vuelta 1 está corregido: con «Te lo pongo en el modelo», el mando de la pregunta y el modelo
  quedan en el mismo estado.

**Fallo común a las tres**: «Siguiente →» queda medio tapado por la barra del recorrido. La causa es que
`scrollIntoView({block:'nearest'})` no cuenta con la barra fija de abajo (muralla, l. 1553 y 1560; telar, l. 1698). Se
arregla con un `scroll-margin-bottom` igual a la altura del dock.

**Tamaño de los rótulos dentro de la lámina** (mediana y mínimo, en px):

| Maqueta | Mediana | Mínimo |
|---|---|---|
| Muralla | 7,5 | 7 |
| Telar | 6,2 | 4,4 (35 de 36 rótulos por debajo de 8) |
| Inmersión | 7 | 5,8 |
| Catéter | 7,6 | 7 |
| Capilar | 8 | 7 |

## 1. La muralla de papel

| Punto | Nota | Por qué |
|---|---|---|
| §7.1 Primera vista | 4 | La idea y la lámina están arriba. La fila de lecturas (Flora, Barrera, Motor) queda cortada bajo la frase |
| §7.2 Párrafos · §7.3 Resaltado | 5 · 4 | Hay tablas y chips. De 1 a 3 marcas de color por bloque |
| §7.4 Se ve el mecanismo | **5** | La mejor de las tres. Con riego normal no hay erosión. En shock sale una úlcera hasta la submucosa, también con pantoprazol. Además se ven la balanza de la Fig. 4.6, la rueda del FMO que acelera, las cerraduras al 70 % y la tira logarítmica |
| §7.5 Mandos que enseñan · §7.6 Tres vistas | 5 · 5 | Cada frase viva lleva su cifra y su página |
| §7.7 Móvil | 4 | Los rótulos están al nivel del catéter. Falla «Siguiente» (ver arriba) |
| §7.8 Modelo grande | 5 | Explica las fichas VIII y IX y la vía 4. Después, otras 4 fichas |
| §8 Recorrido en orden · Formatos | 5 · 5 | 16 preguntas, en el orden VIII → IX |
| §8 Dificultad | **4** | El examen está bien (mu-e1, e2, e5). Pero la buena es la opción más corta en 13 de 24 tests. Y hay tres que se aciertan sin estudiar: `mu-g2` (l. 1855; la respuesta es el título de la página), `mu-g1` («la densidad es igual», l. 1853) y `mu-g9` («el celador», l. 1884) |
| §8 Predice y comprueba · Caso | 4 · 5 | La lámina tapa las cifras con «?». El caso E1: Tabla 4.2, giro del día 3, 2 errores, un «piensa y destapa» y la vuelta al modelo. Además trae el E5 y el E6 |
| Paciente posible | 5 | |

**¿Cumple el diseño?** Sí, casi entero: las §1.1 a §1.6, los 14 estados y tres casos en lugar de uno. **Pasa.**

**Mejoras, por impacto:**
1. Cambiar las tres preguntas fáciles por otras con distractores de la ficha. Por ejemplo, en `mu-g2`: «una capa de
   0,1 mm» frente a «una capa con moco de bicarbonato que la hace impermeable». Y igualar el largo de las opciones.
2. Que la fila de lecturas no quede bajo la frase: subirla encima de la tira o bajar 40 px la lámina.
3. «Siguiente» visible (el fallo común).
4. Rótulos a 8 px o más en el medidor de la Fig. 4.3 y en la escalera de la Tabla 4.2.

## 2. El telar de la trombina

| Punto | Nota | Por qué |
|---|---|---|
| §7.1 · §7.2 · §7.3 | 4 · 5 · 4 | La cama con la ventana encendida. La lámina asoma en la primera pantalla |
| §7.4 Se ve el mecanismo | 4 | Es la Fig. 5.2 hecha máquina: la red de fibrina, los escudos de AT, las cadenas, la X sobre la IIa, el FP4 y el vaso renal que se llena. Con «Inmóvil», los hematíes siguen a la misma velocidad: sorprende. Flojo: la cadena de la HBPM casi llega a la IIa, así que la diferencia con la HNF no salta a la vista. Y con PAD 30, la arteria apretada no se ve: sale discontinua bajo las mangas |
| §7.5 · §7.6 · §7.8 | 5 · 5 · 5 | La lámina lee la calculadora. Cubre las fichas X y XI y el bloque 2 |
| §7.7 Móvil | **3** | Los rótulos de la lupa miden de 4,4 a 6,2 px: «AT» a 5 px (l. 1092), «IIa: la tejedora» y «arteria» a 6,3-6,6 px (l. 886, 996 y la función `rot`, l. 779). Hay rótulos pisados: «FP4» por una cadena, «corta y uniforme» por un hematíe y «arteria» por la manga |
| §8 Recorrido en orden · Formatos | 5 · 5 | 14 preguntas, de la ficha X a la XI |
| §8 Dificultad | **3** | El contenido de los distractores es bueno, pero hay una pista de forma: **la buena es la más corta en 13 de 17 tests**, y a menudo es una sola palabra («Fondaparinux», «La inflamación», «HBPM sola», «Sigue al mismo ritmo»). Además, cae en la **posición 2 en 10 de 17**. Quien no ha estudiado elige la desnuda y acierta |
| §8 Predice · Caso | 4 · **3** | El E3 es excelente: su giro es el hueco honesto de la ventana neuroaxial. Pero el **E2 y el E7 tienen 4 pasos** y §8 pide de 5 a 8 (l. 2198-2239 y 2290-2330) |
| Paciente posible | 4 | La PA 92/30 con noradrenalina en un TCE es posible, pero extrema. Mejor 98/38 |

**¿Cumple el diseño?** Sí, en lo que se ve: las §2.1 a §2.6 y los casos E2, E3 y E7. **No pasa todavía.**

**Mejoras, por impacto:**
1. **Opciones**: igualar el largo (o dar la razón también en la buena) y repartir la posición 1/2/3 a mano, como en
   la inmersión. Todo está en `PREGUNTAS`, l. 2075-2195.
2. **Rótulos**: a 8 px o más en la lupa (`rot`, l. 779). Los que no caben, a la leyenda numerada. Separar el FP4 de
   las cadenas.
3. **E2 y E7 a 5 pasos.** En el E2, un paso «Día 8» con el anti-Xa o con el ClCr que cambia. En el E7, el «Día 2» con
   la CNI antes de la heparina.
4. **Que se vea la diferencia HNF/HBPM**: la cadena de la HBPM que se quede claramente corta de la IIa y un rótulo
   «no llega». Y con PAD 30, la arteria aplastada y en rojo bajo la manga, con el pie más pálido.

## 3. La inmersión

| Punto | Nota | Por qué |
|---|---|---|
| §7.1 · §7.2 · §7.3 | 4 · 5 · 4 | Arriba, el mar con el profundímetro. La frase va dentro del dock |
| §7.4 Se ve el mecanismo | 4 | La metáfora funciona: la tormenta es la BPS, la profundidad la RASS. El diazepam hunde y la tormenta sigue. El aceite del opioide calma las olas. Los dos buzos con relojes suben en escala logarítmica: el ligero llega a los 34 min y el profundo, a las 59 h. Pero **el buzo es un monigote de palitos** y la cara de la BPS, un emoticono, por debajo del grabado del telar o de la muralla. Los lastres (plomo, esponja, barril y boya) miden unos 10 px: no se reconoce el fármaco |
| §7.5 · §7.6 · §7.8 | 5 · 5 · 5 | El SIP enlaza con el capilar (caso B3) |
| §7.7 Móvil | 4 | El dock mide 211 px con la frase. A 360×740, la lámina se ve en unos 210 px y el medallón de la BPS queda cortado. El recuadro de la Tabla 6.7 tapa la mitad derecha del mar |
| §8 Recorrido en orden | 4 | El examen de la ficha XII (morfina, ketorolaco y ketamina) va después de la guía de la XIII. Habría que intercalarlo |
| §8 Formatos · Dificultad | 5 · **5** | La mejor de las tres. La buena reparte posiciones (5, 7 y 8) y es la más corta solo en 6 de 20. Las trampas son reales: la morfina en el asma, el ketorolaco a partir de 65 años, la errata de la ketamina, el lorazepam «de un estudio» frente a las guías y el SIP a 36 µg/kg/min |
| §8 Predice · Caso | 5 · 5 | Los relojes y la fila de 24 h salen tapados. El E4 tiene 7 pasos: BPS 3+3+3, giro con bradicardia y haloperidol con QTc. El E8 tiene tres camas y el hiato osmolar |
| Paciente posible | 4 | En el estado `pris`, el monitor sigue en FC 80 y PA 125/70 mientras el texto dice «IC brusca» (`pintarMonitor`, l. 935-942). Mostrar la caída de PA sin cifra, como en `hipoPA` |

**¿Cumple el diseño?** Sí: las §3.1 a §3.5, los 14 estados y los casos E4 y E8. **Pasa**, pero no alcanza la
ambición artística que pidió el usuario.

**Mejoras, por impacto:**
1. **Un buzo de verdad, en grabado**: escafandra o máscara con el tubo, el cuerpo con rayado y los lastres a 20-24 px,
   cada uno con su forma (`buzoSVG`, l. 795; `pintarBuzo`, l. 897). Y una cara de la BPS con cejas, brazos y tubo
   dibujados, como la cara de Glasgow que reutilizaba el diseño.
2. **El monitor del SIP**: que la PA caiga y el lactato se vea (l. 942).
3. **La Tabla 6.7 fuera del agua**: debajo de la lámina, o plegada en un chip, para que el ascenso del profundo se
   vea entero.
4. **El examen de la ficha XII** antes de la guía de la XIII.

## 4. ¿La cama compartida funciona como una sola experiencia? Todavía no (2/5)

- **Son tres camas distintas.**
  - Muralla: cama alta con cabecero, que a los 2 s se encoge en una tarjeta.
  - Telar: cama plana y oscura, con iconos en las ventanas.
  - Inmersión: cama inclinada, con rótulos en otra letra.
  
  Las ventanas, además, hacen cosas distintas: en la muralla solo dicen un texto, sin enlace (l. 1310); en el telar
  están **desactivadas** (l. 270-271); en la inmersión enlazan (l. 1398-1399). Desde el telar no se puede ir a
  ninguna otra escena.
- **La hoja de órdenes no se comparte.** El ClCr es «<50» en la muralla, «90…12» en el telar y «normal/IR» en la
  inmersión. No hay un día ni una VM comunes. El diseño prometía que cada orden cambiara lo que se ve dentro del
  cuerpo.
- **No hay un paciente de la cama 7.** Cada escena tiene los suyos, y hay **dos «Andrés»**: uno de 62 años (E6,
  muralla) y otro de 40 (E7, telar).
- **Lo que sí une**: la estética, el motor de preguntas, Explorar | Conceptos | Mayéutica y el dock.

**Para que sea una sola experiencia:**
1. **Una sola cama** en un archivo común: el dibujo de la muralla, que es el mejor, con las tres ventanas activas y el
   mismo zoom de entrada.
2. **Una hoja común** (paciente, VM, enteral, ClCr, IMC y día) que pase de una escena a otra.
3. **Un caso transversal «La cama 7»**: el ventilado sin enteral, de 6 a 8 pasos, que cruce las tres ventanas.
   - Día 1: IBP, HBPM y analgesia antes que sedación.
   - Día 3: enteral, y se desprescribe.
   - Día 4: delirio.
   - Día 6: plaquetas que caen.
   
   Así la «cama 7» deja de ser un decorado.
4. Cambiar el nombre de uno de los dos Andrés.

**Veredicto**: la muralla y la inmersión pasan, con las mejoras de arriba. El telar no pasa: móvil, dificultad y
casos están en 3. La unión, tal como está, son tres maquetas hermanas; todavía no son una cama.
