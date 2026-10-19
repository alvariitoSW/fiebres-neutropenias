# Bloque 1 · Juicio del profesor sobre las dos maquetas (vuelta 1)

19/10/2026 · modo juzgar · móvil 390×844 (táctil) y medidas a 360×740. Capturas en `/tmp/plan-socialista/b1/juicio/`
(`capilar-*`, `cateter-*`, `modelo-agua-v2-00.png`). Modelo de comparación: `autonomo/maquetas/marino-agua-v2.html`
y el río y mar de la app.

**Comprobado**: `window.__pruebas()` de las dos sale en verde (todas las cifras de §6, la forma de las preguntas y los
pasos de los casos). Ninguna desborda a 390 ni a 360 px. Ningún error de consola. Recorrí la primera pantalla, 4 estados
de cada una, todas las lupas, Conceptos, dos preguntas (fallé una a propósito) y un caso entero hasta «Lo que te
llevas»: el B2 del capilar y el A2 del catéter.

## 1. Notas (1-5)

| Punto | Capilar y oxígeno | Catéter vivo |
|---|---|---|
| §7.1 Primera vista | 4. La idea y la lámina están arriba, pero la frase viva queda **debajo del dock** (top 758 px con el dock en 691) y la 2.ª fila del tablero sale cortada | 4. La idea y la lámina están arriba. La frase viva también queda debajo del dock (700 px con el dock en 624) y las láminas del libro salen cortadas |
| §7.2 Párrafos | 5. Tablas, plegables y chips; ningún muro de texto | 5. Igual |
| §7.3 Resaltado | 4. De 1 a 3 marcas por bloque, con su color | 4. Igual |
| §7.4 Lo que enseña se ve | **3**. La lección central no se ve en la lámina: con la Hb a 7,5 desfilan los mismos 18 hematíes (`NH = 18` fijo, línea 875). Las 4 perlas miden 1-2 px y el venoso (ciruela) apenas se distingue del arterial (terracota). La anemia y la extracción se leen en el tablero, no se ven. Lo salvan la X sobre la PDH (lupa de la mitocondria) y la Fig. 9.3 viva | 4. La probeta, las gotas y la barra a escala enseñan el radio a la cuarta. La lupa B, con las 4 vías numeradas como la Fig. 3.2, es lo mejor de las dos maquetas. Le falta que el catéter **del brazo** cambie de grosor y de longitud: hoy solo cambia la barra suelta «a escala» |
| §7.5 Interactivo que enseña | 4. Las flechas rojas ↑↓ del tablero ayudan, pero la frase que traduce el mando no se ve sin hacer scroll | 4. Igual: la frase viva, oculta |
| §7.6 Vista Visual (Explorar, Conceptos, Mayéutica) | 5 | 5 |
| §7.7 Móvil | **3**. Frase y tablero tapados por el dock. En la lupa de la mitocondria se pisan los rótulos: «PDH» tachado sobre «con TPP (tiamina)», «sepsis: endotoxina…» sobre la flecha y «Krebs → cadena» se sale de la elipse. En la lupa de la boca, «espacio muerto… IV inspir» queda cortado por el círculo | **3**. El dock ocupa 220 px (el 30 % de la pantalla a 360). Los mandos propios de cada lupa (Yugular, Carina…; Eje corto, Comprimir…) quedan detrás del dock. El cuadro de lectura tapa la esquina de las lupas B, C y D. En la oclusión se pisan «⚠ la bomba alarma» y el «ALARMA» de la bomba. La fila de lupas se corta en «C · La p» y la D queda fuera, sin pista de que se puede deslizar |
| §7.8 Modelo grande | 5. Explica 4 fichas y otras ≈13 después | 5. Explica 7 fichas y media, y enlaza con otras |
| §8 Recorrido en orden | 4. La cadena de la guía sigue la ficha XVIII. Como muestra, vale | 4. La cadena de la ficha I va en orden |
| §8 Formatos | 5. Los tres, con piensa antes y de 0 a 2 errores | 5 |
| §8 Dificultad | **3**. `co-g4` es un «piensa y destapa» de definición («¿qué multiplicas?»), y REGLAS §8 lo prohíbe. En `co-g1`, el distractor «el plasma casi no tiene agua» es absurdo y se descarta sin estudiar. El Examen sí está bien hecho (`co-e1` y `co-e2`, con las trampas de la fuente) | 4. Bien en general. «Solo si es central» (`cv-g3`) es flojo, y en `a2-1` la buena se intuye |
| §8 Predice y comprueba | **3**. Al fallar dos veces, «Te lo pongo en el modelo» mueve el modelo, pero el deslizador de la pregunta sigue en 90 mmHg con el modelo a 60 (captura `08-preg2-b`, línea 1541) | **3**. El mismo fallo: la pregunta sigue marcando 16 G con el modelo en 20 G (captura `07-preg1-b`, línea 1849) |
| §8 Caso que evoluciona, giro, «Lo que te llevas» | 4. El B2 es excelente: calcula el CaO₂, usa la oximetría dual, el giro a la sepsis, un «encuentra el error» y un «piensa y destapa». Pero la especificación pedía «dos camas lado a lado» y el modelo enseña una sola cama cada vez | **3**. El A2 es muy bueno en contenido (el 11 %, los hemocultivos pareados, *S. aureus* con ETE), pero **el tiempo se contradice**: el paso «Día 9» enseña «día 7» en la lupa (`tiempo: 168`, línea 2308); el «Día 10», «día 14» (`336`, líneas 2331 y 2340); y «Lo que te llevas» enseña «0 h · se fue · aún no (<48 h)» |

**Veredicto: no pasa todavía** (hay notas de 3 en las dos). Lo que falla no es el contenido ni la idea: es lo que el
usuario ve en el móvil y que el capilar no *enseña dibujando*.

## 2. ¿Sorprende y enseña al nivel del ácido-base y del río y mar?

- **Enseñar, sí, y en las preguntas incluso más.** Los casos B2 y A2 son de los mejores del proyecto: datos que se
  interpretan, cálculos, un giro real y errores que son confusiones de verdad (la ScvO₂ alta «tranquilizadora»; la
  fiebre y el eritema que no diagnostican).
- **Sorprender, todavía no.** El río y mar es *un mundo*: un paisaje con profundidad, una metáfora (río, marisma y mar)
  y el agua que se mueve donde mira el ojo. El capilar es un **esquema en U** con mucho negro vacío y unas partículas
  diminutas. El catéter se acerca más: la lámina de gotero, regla, probeta y brazo en corte, y sobre todo la lupa B,
  ya tienen el aire de grabado antiguo. Hoy, el catéter está a ≈80 % del río y mar, y el capilar a ≈60 %.

## 3. Lista para la vuelta 2 (por prioridad)

1. **Las dos · la frase viva a la vista** (lo primero que notaría el usuario). Ponerla justo encima del dock, como en
   `marino-agua-v2` (una línea fija, o el `#frase` pegado al borde superior del dock). Capilar: `#frase`, línea 368, y
   CSS `.frase`, línea 116. Catéter: `#frase`, línea 281.
2. **Catéter · el dock más bajo.** Que no pase de unos 150 px (`.dock`, línea 147): los mandos en dos filas y el
   banco «Fig. 1.1 | Tablas» como chip. Con una lupa abierta, sus mandos propios suben **al dock**, en lugar de quedar
   detrás de él. La fila de lupas, en una cuadrícula de 2×2, no en una tira que se desliza.
3. **Capilar · que la anemia y la extracción se vean** (§7.4). En `pasoLamina` (líneas 875 y 923), los hematíes
   visibles han de ser proporcionales a la Hb (18 × Hb/15: con 7,5, huecos en la fila). Hematíes más grandes en el
   capilar del tejido, con las perlas legibles: llenas = bolita, vacías = anillo. Y el retorno venoso con otra
   **forma** de perla, no solo con otro color.
4. **Las dos · el modelo y su mando, sincronizados** al «Te lo pongo en el modelo». Volver a pintar el mando de la
   pregunta con el estado bueno: capilar, línea 1541; catéter, línea 1849.
5. **Catéter · el tiempo del caso A2.** «Día 9» → `tiempo: 216`; «Día 10» → `240` (líneas 2308, 2331 y 2340, y el
   `volver`, línea 2359). Que «Lo que te llevas» no deje la lupa en 0 h.
6. **Las dos · nada que se pise.**
   - El cuadro de lectura no ha de tapar las lupas: con una lupa abierta, la lectura va bajo la lámina, o el círculo
     se hace más pequeño (`#lectura`, línea 267 del catéter).
   - El rótulo de la bomba en la oclusión (`rot-alarma`, líneas 887 y 1007): uno solo.
   - Los rótulos de la lupa de la mitocondria y del capnograma (`pintarLupa`, líneas 1105-1185 del capilar).
7. **Capilar · las preguntas.**
   - `co-g4` (línea 1825): pasarla a razonamiento. Por ejemplo: «Hb 7,5: ¿con qué palanca devolverías el aporte a
     985, y cuánto tendría que subir?» (de la fórmula de `#mar-do2`, sin cifras nuevas).
   - `co-g1` (línea 1800): cambiar el distractor absurdo por uno de la ficha. Por ejemplo: «con PaO₂ 500 el disuelto
     ya basta» (0,003 × 500 = 1,5 mL/dL: poco).
8. **Capilar · el B2 con sus dos camas a la vez**, como pedía la especificación. En la cabecera del caso, un
   «Cama 1 | Cama 2» que cambie el modelo, y un mini-tablero con los dos CaO₂.
9. **Catéter · el catéter del brazo es el que cambia.** Que tome el grosor y la longitud elegidos (hoy solo cambia la
   barra «a escala»). El 20 G, visiblemente fino, y el PICC, saliendo del encuadre con «sigue: 50 cm».

## 4. Si solo pudiera hacer una mejora artística

**Capilar: hacer del capilar del tejido el protagonista**, como el río del río y mar. Que la lámina sea un gran
capilar en grabado, en diagonal sobre la célula, no un circuito en U. Por él desfilarían hematíes grandes (tamaño de
lupa) con sus 4 perlas visibles, cuántos según la Hb y a qué velocidad según el gasto. Las perlas se irían soltando
como O₂ que cruza hacia las mitocondrias. Así, la anemia serían los huecos en la fila; la dependencia del aporte,
hematíes que salen vacíos; la sepsis, hematíes que salen llenos con la célula escupiendo lactato.

El alvéolo, la boca y el dedo quedan como lupas. Las cifras de cada momento ya están en el motor: no hace falta ni una
nueva. Con eso, el capilar sorprendería como el río y mar.

## No comprobado / riesgo

- No recorrí los casos B3 y A1, ni la tanda de repaso. La prueba guiada sí verifica sus cifras.
- No probé con «reducir movimiento» ni con toques reales (`mouse.down/up`).
- La lupa D (eco) solo la vi en eje corto.
- La fidelidad de las cifras no la cotejé de nuevo con el PDF: es trabajo del auditor.
