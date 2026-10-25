# eco-mega · parada 1 · paso 2 · profesor (juzgar la app) · escala 0-10, se aprueba con 8, meta 8,75
App real (index → Eco cardíaca → simulador), 390×844 táctil, con el navegador relanzado: 0 errores de consola, scrollWidth 390. Pruebas eco: 248 pasan, 0 fallan.
Capturas mías en `/tmp/plan-socialista/eco-mega/capturas/prof-p2-*`: zoom de las 4 vistas, ganancia +12/−10, TGC, foco a 3 y 16 cm, profundidad 10 cm, ventana pobre (A4C y PLAX), rebotes y refuerzo en PSAX y SC 4C y **la pantalla tal como se ve al tocar «Señálalo»** (`viewport-senalalo`).

| Punto | Nota | Por qué |
|---|---|---|
| 1. ¿Parece una eco real? | **8,4** ✅ | Igual que la maqueta o algo mejor. La pared libre del VD ya es más fina y menos brillante (`a4c-zoom`). La pared lateral de la AD sigue siendo un trazo grueso y blanco, y dentro de la AD hay una banda vertical brillante (anatomía: parada 2) |
| 2. Las mejoras | **8,7** ✅ | Ganancia, TGC (cerca oscuro y fondo claro), foco (el triángulo baja y el ápex se afina a 3 cm) y profundidad se notan al momento. La ventana pobre se lee: niebla y el pulmón tapa un lado |
| 3. ¿Se usa bien en el móvil? (mandos sin estorbar, como «elegir» en la maqueta) | **7,4** ❌ | Los mandos caben (44 px, sin desborde), pero **la imagen no se queda fija**. Al tocar «Sombra» la imagen está a −603…−346 px y la frase a −299 px: las dos quedan fuera de la pantalla y el residente no ve qué ha señalado (`viewport-senalalo`). En la maqueta la imagen quedaba fija. Con la ganancia pasa algo parecido: arriba solo se ve media imagen |
| 4. ¿Enseña los artefactos? | **8,2** ✅ | Las frases son buenas y dicen qué no es cada cosa. Pero: (a) la sombra es negro puro y el contorno parece marcar lo que hay **fuera** del abanico (`p2-plax-sombra`, `p2-a4c-sombra`); (b) en el PLAX el rótulo de los rebotes cae abajo a la izquierda, lejos del contorno de arriba (`p2-plax-reverb`); (c) «pulmón» pisa la escala de cm (`p2-ventana-senal`). La pared lateral del VI, el foco y el refuerzo, bien colocados |
| 5. Paciente posible | **8,8** ✅ | Profundidades de 10 a 24 cm, la subcostal a 20 cm con el hígado delante y la ventana pobre de un obeso o ventilado: todo coherente. Con los mandos a cero, la imagen es la de antes |

**Veredicto: ❌ NO PASA** por el punto 3 (7,4). Lo demás aprueba y la 5 llega a la meta.

## Lo que falta (todo barato)
1. **Punto 3 → ≥8,75.** Con los mandos abiertos, que la imagen quede fija arriba: `css/components.css` (junto a la l. 2442), algo como `#cv-tarjeta-eco:has(#cv-mandos-img[open]) .cv-eco { position: sticky; top: 0; z-index: 5; background: var(--bg-main); max-height: 36vh }` y que el lienzo encoja. Comprueba que ningún antecesor tenga `overflow` ni `transform`. Plan B, o además: pasar el bloque «Señálalo» y la frase `#cv-senal-frase` justo debajo de la imagen, encima de los deslizadores (`js/modules/eco/eco.html` l. 91 y 104-114), y al tocar un botón de Señálalo, `ecoC.scrollIntoView({block:'nearest'})` (`simulador.mjs`).
2. **Punto 4 → 8,75.** (a) En `senalar()` (`simulador.mjs` l. 232), con «sombra», dibujar el borde del abanico en gris tenue, para que se vea que la zona negra está **dentro** de la imagen. (b) Que el rótulo no se aleje del contorno: subir el peso de la distancia en el coste (l. 280) o trazar una línea fina del rótulo al ancla. (c) Que la escala de cm cuente como ocupada en `ocupado()` (l. 274). **Barato.**
3. **Punto 1 → 8,75.** Bajar 2-3 dB y adelgazar la pared lateral de la AD con «Paredes reales» (`ecografia.mjs`), como la del VD. Lo demás es de la parada 2. **Barato-medio.**
4. **Punto 2 → 8,75.** La ganancia +12 cambia poco a la vista: que «Ganancia» llegue a +15 sin tope visual, o que la frase diga que la sangre debe quedar negra. **Trivial.**

## No comprobado / riesgo
- Fluidez en un móvil real (solo el contenedor) ni la calidad automática con todo encendido.
- El atlas con la imagen nueva: solo he visto el simulador.
- Señálalo en A2C, A3C, PSAX Ao, SC VCI y supraesternal sin recorrer; en la subcostal, la sombra da su aviso (no hay costillas), pero no lo he capturado.
- Las frases son «fisiología general» sin página (aceptado en la maqueta).

## Vuelta 2 (693085b, versión 20261027-25) · app real, 390 y 360 px táctil, navegador relanzado
Con «Mandos de imagen» abierto toqué los 5 Señálalo en A4C y PLAX, y «Pulmón» con la ventana pobre. Tras cada toque, la imagen queda en 1-254 px (1-234 a 360) y la frase justo debajo, en 261-338 px: las dos se ven. 0 errores de consola, sin desborde. El final de la página y «Reanudar» se tocan bien. Capturas: `prof-p2v2-ab-*`, `prof-p2v2-390|360-*`.

| Punto | V1 | V2 | Por qué |
|---|---|---|---|
| 1. Eco real | 8,4 | **8,5** ✅ | La AD es algo más fina, pero su pared lateral sigue como el trazo más blanco del lado izquierdo (`prof-p2v2-390-a4c-zoom`). El resto es anatomía de la parada 2 |
| 2. Mejoras | 8,7 | **8,8** ✅ | La frase bajo «Ganancia» enseña la regla: la sangre ha de quedar negra |
| 3. Uso en el móvil | 7,4 | **8,7** ✅ | La imagen fija y la frase se ven siempre, y los mandos se manejan debajo. Ocupa unos 330 de 844 px. Un salto automático deja el TGC «Fondo» tapado por la imagen: `elementFromPoint` da `cv-eco` |
| 4. Artefactos | 8,2 | **8,8** ✅ | El borde gris del abanico deja claro que la sombra está dentro. El rótulo de los rebotes lleva su línea hasta la zona. «Pulmón» ya no pisa la escala (`prof-p2v2-390-ventana-pulmon-zoom`) |
| 5. Paciente posible | 8,8 | **8,8** ✅ | Sin cambios |

**Veredicto: ✅ PASA** (todo ≥8). Llegan a la meta la 2, la 4 y la 5.
- Para subir la 3 a 8,75 (trivial): `scroll-margin-top: calc(30vh + 90px)` en `.cv-mandos-img label, .cv-mandos-img button` (`css/components.css` l. 2449), para que ningún salto automático deje un mando debajo de la imagen fija.
- Para subir la 1 a 8,75 (barato): bajar 2-3 dB más la pared lateral de la AD, o dejarlo para la parada 2.
- Nota: Señálalo vive dentro del plegable, así que con los mandos cerrados no se puede tocar. El `scrollIntoView` que añadió el constructor para ese caso no se usa nunca. No pasa nada.
- No comprobado: el simulador dentro de la hoja fija de una ficha, las otras 6 vistas con Señálalo y la fluidez en un móvil real.
