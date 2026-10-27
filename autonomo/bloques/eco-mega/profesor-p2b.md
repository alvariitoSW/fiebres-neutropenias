# eco-mega · parada 2 · profesor (juzgar la app) · 0-10, se aprueba con 8, meta 8,75
App real (1dd909a, v. 20261027-36) frente a fec885d, cada una servida aparte, a 390×844 táctil (y 360). Vistas PLAX, PSAX papilares, A4C y SC 4C; escenarios normal, derrame, hemorragia y TEP; fases B (telediástole), E (telesístole), C y F. 0 errores de consola y sin desborde en las dos. Suite eco: 425 pruebas, 412 pasan, 0 fallan, 13 `todo`. Capturas en `/tmp/plan-socialista/eco-mega/capturas/prof-p2b-*`: mosaicos antes | después (`mosaico-{normal,derrame,hemorragia,tep}`), `normal-*-tdts`, `valvas-C-F-antes-desp`, `normal-vs-derrame-td`, `390|360-senal-valvas-*`, `390-ecoreal-*`, `390-tep-lectura`.

| Punto | Nota | Por qué |
|---|---|---|
| 1. Anatomía real en cada vista | **7,4** ❌ | Mejora clara frente a antes: VI en bala, VD triangular, aorta descendente detrás de la AI en el PLAX, cortina aorto-mitral y papilares pegados a la pared. Pero en el **A4C** las aurículas son dos anillos gruesos y brillantes con una franja negra entre ellos: se ve un tabique interauricular doble, y la banda brillante de la AD sigue ahí (`normal-a4c-tdts`). El **SC 4C** es lo menos real: el VD es una rendija que no toca el hígado, la AD tiene una pared en gancho y se ven anillos concéntricos (`normal-sc4c-tdts`). En el **PSAX** hay bultos redondos fuera del anillo del VI y los papilares quedan a las 3 y a las 9, no a las 4 y a las 8 |
| 2. Se ve la fisiología | **8,4** ✅ | Se ve el TAPSE (el anillo baja hacia el ápex), la pared engruesa, los papilares se acortan y la mitral abre en F y cierra en B y en E (`valvas-C-F`). La torsión no se distingue en imágenes fijas. La tricúspide apenas se abre en F |
| 3. La patología enseña | **7,6** ❌ | La lectura del TEP es excelente: los 6 criterios de Lang, con su página. Pero **la app no tiene mando de gravedad**: el derrame solo se ve a 260 mL, donde la AD sale pequeña pero no se ve plegarse hacia dentro y **el VD nunca colapsa** (hace falta ≥326 mL). El «beso» de papilares completo (2 L) tampoco se puede ver; a 1 L solo se insinúa (`hemorragia-plax-psax`). En el TEP la lectura dice «tabique aplanado: sí», pero el PSAX enseña un VI redondo, sin la D; y en el A4C en telesístole hay un lazo en S dentro del VI |
| 4. Uso en el móvil | **8,7** ✅ | La imagen queda fija (1-254 px) y la frase justo debajo, a 390 y a 360. Los rótulos se leen. En el PSAX mitral los seis rótulos apuntan a una boca de ~1 cm, y a 360 la frase dice «CD, NC, CI» sin dibujarlas (`360-viewport-valvas-psaxMv`) |
| 5. Paciente posible | **8,3** ✅ | Las tablas de P1 (388 mL: 64/52, FC 120, presiones igualadas) y de P2 (PAM 53, FC 124) cuadran. El TEP «de riesgo intermedio» tiene TAPSE 4,8 mm, FAC 10 % y FE del VD 13 % con la PAM ~67: es un VD casi quieto sin shock, poco creíble. Además, «VD en diástole 38,4 mm» y «VD basal 42 mm» salen uno al lado del otro sin explicar en qué se diferencian |
| 6. Se parece a la eco real (D1) | **7,2** ❌ | En la real las paredes son finas, el miocardio es gris uniforme y las dos aurículas comparten un solo tabique fino. En la nuestra las paredes de las aurículas brillan más que las de los ventrículos y el pulmón dibuja un peine a la derecha del A4C. La PLAX real es pequeña (232 px) y lleva rótulos en inglés: compara mal |

**Veredicto: ❌ NO PASA** (1, 3 y 6 por debajo de 8). Frente a fec885d sí hay avance en las cuatro vistas (sobre todo PLAX y A4C), pero la queja del usuario («la anatomía no es real») sigue siendo cierta en las aurículas y en la subcostal.

## Lo imprescindible (<8)
1. **Aurículas (puntos 1 y 6, medio).** `corazon-geo.mjs` l. 408-436: que la AD y la AI compartan un solo tabique interauricular (sin hueco entre las dos cúpulas, fosa oval fina), y en `js/data/eco-tejidos.js`, bajar 3-4 dB la pared de las aurículas (`auricula`) hasta que no brille más que el miocardio. Quitar la banda brillante dentro de la AD. Prueba par: en el A4C, ningún píxel de sangre entre la AD y la AI en la cruz.
2. **SC 4C (punto 1, medio).** Que el VD quede pegado al hígado y al diafragma, ancho, con su pared libre horizontal arriba, y que se quite el gancho de la AD (`planoVista('sc4c')` en `ecografia.mjs` y el VD de N2).
3. **Gravedad en la app (punto 3, barato).** Un deslizador en `#cv-escenario-nota` que use `ESCENARIOS[k].gravedad` (ya existe en `escenarios.mjs`; `elegirEscenario`, `simulador.mjs` l. 882): con él se ven el colapso del VD (≥326 mL) y el beso a fondo, que ya están hechos y probados pero quedan fuera del alcance del usuario. Con permiso del director (`simulador.mjs`, `eco.html`).
4. **TEP coherente (puntos 3 y 5, medio).** Que el PSAX en telediástole pinte la D cuando la lectura dice «aplanado: sí» (el `todo` F4), o que la lectura diga «no». Quitar el lazo del VI en el A4C (¿cuerda o papilar fuera de sitio? `corazon-geo.mjs` l. 587-606). Revisar si el TAPSE de 4,8 mm encaja con un riesgo intermedio (sin shock): buscar la fuente o subir la contractilidad del VD por defecto.
5. **Peine del pulmón (punto 6, barato).** `ecografia.mjs` l. 758-790: menos líneas A y más tenues en el borde del A4C.

## Entre 8 y 8,75
- 4 (8,7): rótulos en abanico, o en el PSAX mitral el fotograma de llenado rápido (F), con la boca de pez abierta; que la frase solo nombre lo que se dibuja (`simulador.mjs` l. 259). **Barato.**
- 2 (8,4): que la tricúspide abra en F como la mitral, y un fotograma del PSAX con la torsión marcada (por ejemplo, una flecha de giro). **Barato-medio.**
- 5 (8,3): lo del punto 4 del TEP, y un renglón que explique en qué se diferencian «VD en diástole» (FATE) y «VD basal» (Lang). **Barato.**

## No comprobado / riesgo
- La torsión y el colapso en movimiento: solo vi fotogramas fijos. Hipertrofia, dilatada, fallo, vasoplejía, A2C, A3C, SC VCI y supraesternal: sin recorrer.
- Sin mando de gravedad, el VD que colapsa y el beso completo los he juzgado por las cifras de P1 y P2, no en la app.
- La tarjeta de eco real solo existe en 4 vistas. La de la PLAX es de baja resolución.
