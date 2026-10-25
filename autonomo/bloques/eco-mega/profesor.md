# eco-mega · parada 1 · profesor, vuelta 3 (b38501a) · escala 0-10, se aprueba con ≥8 en todo, meta 8,75
Navegador relanzado (390×844, táctil), sin errores de consola y sin desborde (scrollWidth 390). Capturas mías en `capturas-profesor/v3-*`: A4C con «Señálalo: pared apagada» (fotogramas 5 y 12), dilatada con el mismo Señálalo, sangre con ganancia +10, rebotes en el A4C y el PLAX.

| Punto | Nota | Por qué |
|---|---|---|
| 1. ¿Parece una eco real? | **8,3** ✅ | Músculo gris, el pericardio lo más brillante, grano de lado, niebla en el ápex, sangre con un eco tenue a +10 (`v3-a4c-sangre-gan10-x2.png`). La pared libre del VD y la AD siguen formando un trazo grueso y brillante a la izquierda |
| 2. Las mejoras | **8,6** ✅ | Las nueve se notan, son fieles y tienen una intensidad por defecto razonable. Los rebotes ya se ven en el campo cercano |
| 3. ¿Sirve para ELEGIR? | **8,7** ✅ | La imagen queda fija mientras bajas, cada interruptor con su frase y la cortinilla. Solo pesa que la imagen fija mide 260 px |
| 4. ¿Enseña los artefactos? | **8,6** ✅ | «Señálalo: pared apagada» marca ya **la pared lateral del VI** (a la derecha, del ápex a la mitad), en los fotogramas 5 y 12 y en la dilatada ✅. Cada frase dice qué es y qué no es («no es que no se contraiga», «no es un trombo») |
| 5. Paciente posible | **8,8** ✅ | Hemorragia (sístole en el fotograma 12, VI de 100 a 40 mL según el motor), derrame, dilatada y ventana pobre: coherentes |

**Veredicto: ✅ PASA** (todo ≥8). Llegan a la meta de 8,75 la 5; la 3 se queda a una centésima.

## Para subir a 8,75 (y si es barato)
1. Punto 4 (8,6): en la dilatada, el rótulo «pared lateral del VI» choca con la etiqueta «Después» y se corta la «VI» (`v3-dilatada-especular.png`). Que el rótulo evite la esquina de arriba a la derecha (`maqueta.js`, cálculo de `lx`/`ly`). Y el rótulo de los rebotes tapa el ápex o la pared del VD: mejor ponerlo a un lado o hacerlo semitransparente. **Barato.**
2. Punto 1 (8,3): adelgazar y bajar el brillo de la pared libre del VD y de la pared de la AD con «Paredes reales», como ya se hizo con las aurículas izquierdas. **Barato-medio.** El resto del salto es de la parada 2 (abajo).
3. Punto 2 (8,6): el foco se nota poco; una línea en la frase («mira el tabique al mover el foco de 4 a 12 cm») o una marca del foco en el borde de la imagen, como en los ecógrafos. **Barato.**
4. Punto 3 (8,7): la imagen fija podría crecer a unos 300 px en las pantallas altas (`min(300px, 36vh)`). **Trivial.**

## No comprobado / riesgo
- Tiempos y calidad automática medidos solo en el contenedor, no en un móvil real; con todo encendido, «después» tarda 25-37 ms.
- Las intensidades por defecto siguen puestas a ojo (aceptable: el usuario las elige).
- No he recorrido todos los fotogramas en PSAX ni en la subcostal con cada Señálalo; el de la pared, solo en el A4C (normal y dilatada).
- Las frases nuevas son «fisiología general» sin página: el auditor ha de darlas por buenas como tales.

## Para la parada 2 (solo con anatomía o con el campo lejano)
- PLAX: el campo lejano es grano uniforme. Faltan la aorta descendente detrás de la AI (la referencia para distinguir un derrame pericárdico de uno pleural) y el pulmón; sin ellos, el refuerzo detrás del derrame no tiene con qué compararse.
- A4C: la pared libre del VD y la AD forman un aro casi cerrado con el anillo; faltan el seno coronario, las venas pulmonares y la aorta descendente detrás de la AI. El ápex necesitaría trabéculas y papilares para que la niebla del campo cercano se distinga de un trombo.
- Las valvas se dibujan como líneas uniformes; faltan los segmentos de cada valva (lo que ya pedía el encargo para la parada 2).
