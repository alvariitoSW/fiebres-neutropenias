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

## Vuelta 2 (2150568, versión 20261027-37) · app real a 390 px (los v2i a 360), navegador nuevo, 0 errores de consola, sin desborde
Capturas `prof-p2c-*`: `mosaico-normal`, `zoom-normal` (A4C, SC4C y PSAX, comparado con p2b), `mosaico-derrame100`, `zoom-derrame100`, `mosaico-hem-tep`, `zoom-beso-tepF`.

| Punto | V1 | V2 | Por qué |
|---|---|---|---|
| 1. Anatomía | 7,4 | **8,3** ✅ | El A4C ya parece un corazón: un solo tabique interauricular, la cruz y la AD limpia. El SC 4C enseña las 4 cámaras con el VD bajo el hígado. En el PSAX quedan pocos bultos. Pegas: con el derrame a fondo, el saco es una caja de esquinas rectas (SC 4C) o una V (A4C), no sigue al corazón, y el VI del TEP sale facetado, como un polígono |
| 2. Fisiología | 8,4 | **8,4** ✅ | Sin cambios. La tricúspide en F no la he vuelto a mirar |
| 3. Patología | 7,6 | **8,3** ✅ | El mando funciona: 388 mL dan un derrame negro enorme, la AD desaparece y el VD queda en rendija (PA 64/52, FC 120). La D del TEP se ve en F. Pegas: (a) a 2.037 mL el rótulo «VI» tapa la cavidad, justo donde ocurre el beso (`hem100-psaxPm-E`); (b) el colapso se ve como una cámara que se borra, no como una pared que se dobla hacia dentro; (c) el botón sigue diciendo «Hemorragia de 1 L» con el mando a 2.037 mL |
| 4. Móvil | 8,7 | **8,4** ✅ | El mando de gravedad queda lejos de la imagen: al moverlo no se ve el corazón (`v2i-360-hemorragia-psax-mando`). A 360, bajo la barra del ciclo, «diástole» y «▲S2» se pisan («di▲S2le») |
| 5. Paciente posible | 8,3 | **8,4** ✅ | Derrame y hemorragia a fondo cuadran (60/47, FC 124, PVC 0). El renglón «VD en diástole (FATE)» frente a «VD basal (Lang)» ya está. Sigue sin resolver el TAPSE de 4,8 mm del TEP con PAM 67 |
| 6. Parecido con D1 | 7,2 | **8,1** ✅ | El A4C normal se parece ya a la eco real (cruz, tabique fino, sin peine de pulmón). Las paredes de las aurículas siguen algo más brillantes que en la real y el anillo del pericardio pesa en el SC 4C |

**Veredicto: ✅ PASA** (todo ≥8). Ninguna nota llega a la meta de 8,75.
- **3 → 8,75.** Barato: en `simulador.mjs`, quitar o mover el rótulo «VI» cuando la cavidad mida <15 mm. Que el botón diga «Hemorragia» y que la cifra la dé el mando. Al elegir el TEP en el PSAX, saltar a la fase F. Medio: que la AD y el VD se doblen hacia dentro antes de borrarse (`plieguePared`).
- **4 → 8,75.** Barato: al mover `#cv-grav`, que la imagen quede fija arriba como con los mandos de imagen (el `sticky` de `.cv-eco-fijo`), o poner el mando bajo la imagen. Separar «▲S2» de «diástole» a 360.
- **1 y 6 → 8,75.** Medio: que el saco del derrame grande siga al corazón (sin esquinas) y que el VI se suavice (más vértices en la sección); bajar 2 dB más la pared de las aurículas. **5:** buscar la fuente del TAPSE en el TEP intermedio, o subir la contractilidad del VD por defecto. **2:** que la tricúspide abra en F (barato).
- **No comprobado:** el mando en fallo y vasoplejía, el movimiento (solo fotogramas fijos), A2C, A3C y supraesternal.
