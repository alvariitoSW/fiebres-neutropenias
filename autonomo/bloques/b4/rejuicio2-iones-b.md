# Rejuicio final · maqueta B «Lo que ves y lo que hay» (iones vivos, b4, vuelta 3) · profesor, 30/10/2026

Base (REGLAS §4.8 R8): `salida-b3.txt` (TODO EN VERDE a 390 y 360, sin errores de consola), capturas 01, 09, 10, 11 a 390 y una propia del `#ion-svg` (12-deposito-p-390, preset Damián + 1 dosis); código: `deposito()`, `entran()` de `dibujo.js`, `guia.js` (Adela), `flujos/avanzar/vitales/leer` de `modelo.js`.

**Grave del auditor (calcio en la hiperK)** ✅ `guia.js` Adela paso 4: «Dar 90 mg de calcio» (10 mL de gluconato al 10 % en 3 min, repetible a los 5), cita p. 27, origen «el K⁺ no baja: se deduce de la Tabla 36.3»; `haz: ['ca', {mg: 90}]`; no queda ningún «180 mg» ni «Dar calcio 180» en `pagina.js`, `pruebas.js` ni `datos.js`. El programa lo confirma («guía Adela paso 4: 90 mg ✔»; glu ×1 = 90 mg). De paso, `datos.js:17` ya anota que el libro (p. 46) da +0,5 mg/dL de Ca **total** por 200 mg (mediano 2).

**Los 5 puntos de la vuelta corta**
1. `deposito('p')` ✅ la célula gana `40 + 3·ins` partículas, la banda «Plasma (suero)» pierde (`5 − partP` llenas, `partP` huecas) y `entran('p')` sube 8-12 partículas del plasma a la célula (programa: 12; mi captura: 8 con 1 dosis). Mecanismo en el sentido de E p. 49.
2. `#guia` bajo el dibujo ✅ 14 px (programa y medición propia: svg acaba a 765, guía empieza a 779). ⚠ El dock fijo mide 367 px de 844 en la pestaña «Dar»: quedan 477 px útiles, y dibujo (≈463 px) + paso (191 px) siguen sin caber juntos; el foco se ve a medias.
3. Partículas de K⁺ a la derecha del rótulo ✅ (`x + 168 + i·9`); captura 10: «Fuera · 2 % (extracelular)» legible, 6 cuadrados y sus hilos bajan a «Dentro».
4. «Lo que crecerá» ✅ plegable con `CRECIMIENTO` (Nefrología, Libro Azul, Manual UMI, ECG de hipoK). ⚠ El destino del ECG de hipoK es `'eco'`: debería ser el ritmo vivo (b3).
5. «98 %» y «2 %» en oro ✅ (`<tspan class="oro">`), captura 01 y 10.

**Enganches del motor** (`core/tope.js`, `frase-vista.js`, `particulas.js`): todas las cifras de la salida b3 coinciden con las de la vuelta 2 (K 4 · 4,18 · 4,36; Mg 2,97/4,48/6; Ca 90/180/270; Valentín 3,26 → 4,16; Adela 6,6 → ECG 5,5; caso 5,83 → 5,94), los mismos topes y sellos, rótulos ≥9,1 px; nada visible cambió.

| §7 (solo lo que estaba <9,5) | Antes | Ahora | Por qué |
|---|---|---|---|
| 1 Primera vista | 9,0 | 9,0 | La nota «Pendiente: onda U…» sigue dentro del monitor y empuja el dibujo (01); no estaba en la vuelta corta. |
| 3 Resaltado | 9,0 | 9,5 | 98 % y 2 % en oro; focos de la guía. |
| 4 Lo que enseña se ve | 9,25 | 9,5 | El fosfato entra en la célula y el plasma se vacía; K⁺ igual. |
| 5 Interactivo que enseña | 9,25 | 9,5 | Cada mando mueve el depósito, la ventanita y la figura; «Hazlo» en la guía. |
| 7 Móvil | 9,25 | 9,25 | Rótulo libre y guía pegada; el dock fijo tapa el 43 % de la pantalla en «Dar». |
| 10 Explicación guiada | 9,0 | 9,25 | Paso junto al dibujo, pero no caben a la vez por el dock. |
| 11 Fuentes en lista | 9,25 | 9,5 | Calcio de la hiperK con p. 27 y deducción rotulada; nota del Ca total p. 46. |
| 12 Megaproyecto | 8,5 | 9,25 | Hay mapa de crecimiento; un destino mal apuntado. |

**Educación**: (1) mecanismo visible **9,5** · (2) se entiende a 390 **9,25** (dock) · (3) apuesta, error y caso **9,5**.
**Media nueva**: §7 ≈ **9,4** (antes 9,2; con 2, 6, 8 y 9 ya en 9,5); Educación **9,42**. Veredicto: **pasa** (todo ≥8,75); la meta 9,5 queda a falta de los cuatro puntos de abajo.

**Bitácora (no hay más vueltas)**: `pagina.js` dock `#dock`: plegar los mandos de ClK/Mg/Ca tras un «Más mandos» o bajar la altura del dock a ≤240 px para que paso de la guía y foco compartan pantalla (§7.7, §7.10, Educación 2) · `pagina.js` monitor: mover `PENDIENTE` a un plegable bajo el ECG (§7.1) · `datos.js` `CRECIMIENTO[3]`: destino `'eco'` → ritmo vivo de b3 (§7.12) · `modelo.js` `vitales()`: con `nofis:sello` el monitor pinta «0,32»; mostrar «<1,5» (ya anotado en la vuelta 2).
