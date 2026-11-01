# Rejuicio de Educación · eje B «Dos glándulas, un enfermo» (b6b, vuelta 2) · profesor, 01/11/2026

Base: `node autonomo/bloques/b6b/herramientas/eje-b.mjs 390` (TODO EN VERDE: 30 pares de paciente limpios, reloj, retirada, Bibiana, Policarpo, ACTH, caso de Toribio, Motion) + `herramientas/rejuicio-eje.mjs` (nuevo: los 10 arreglos y 6 injertos en texto, 8 capturas en `/tmp/plan-socialista/b6b/capturas/rejuicio/`, 6 miradas: 01 Toribio, 02 Bibiana tras ACTH, 03 Lucrecia día 7, 05 giro de Toribio, 07 giro de Obdulia, 08 final de Obdulia). Sin errores de consola. Solo se repuntúa lo que estaba por debajo de 9,5 (R8).

**Arreglos comprobados (10/10)**: 1 reloj y tratamiento que mueve al enfermo (Lucrecia 40,8 °C/152 → 37,4/80 a 7 días y el sello de tormenta se va; Obdulia 33,5/48/Na 122 → 36,7/75/136; lactato de Toribio 4,2 → 1,6 y la retirada solo con NA 0 y lactato <2; sin tratar, nada cambia) · 2 Toribio rotula «CRH ↓ · ACTH ↓ · cortisol ↓ · insuficiente» (captura 01) · 3 silueta de la app (`js/core/silueta.js`) tumbada, con las lupas en cuello y riñón: se lee como enfermo · 4 Obdulia: el monitor cambia en los 4 pasos y el giro del día 2 (levotiroxina sin hidrocortisona, PA 77/40) · 5 Bibiana nace con PAM 78 y cae a 51 solo con estrés 3 sin cobertura · 6 Policarpo ↑N con «no se trata», T3-toxicosis e hipotiroidismo secundario con su fila · 7 mapa de la Tabla 51.2 y barra del cortisol 10/35 con el hueco tras ACTH (captura 02) · 8 segunda apuesta 71/72/74 y segundo error con 2 errores, cada «por qué» con PDF + «Ver en la ficha» · 9 ningún sello con µ en el título · 10 `eje-b.mjs` lo mide todo. **Injertos (6/6)**: mapa y barra · ACTH como mando con Δ (6 → sello; 12 → «no descarta la secundaria») · reloj +1/+7 y retirada gradual · caso de Toribio (3 pasos, giro día 5, rebote con sello) y error de Lucrecia · estrés 0-3 con 15-25 → 350 mg/día y «el estrés máximo no da más» · Policarpo con amiodarona, heparina, etomidato y ketoconazol (cortisol 8 → 14, sello «fármaco que corta el eje»).

| Criterio (antes) | Ahora | Por qué |
|---|---|---|
| ¿Se ve el mecanismo? (8,5) | 9,25 | Las dos lupas, el mapa, la barra con el hueco y el enfermo que es un enfermo; ❌ en el paso 3 de Toribio (suspendida el día 4) la lupa sigue pintando «hidrocortisona ↓ · cortisol ↑ · cubierto» (captura 05); en Obdulia con levotiroxina rotula «TSH N · T4 N» junto a «TSH 44,8 · T4 0,26» (captura 07) |
| ¿Se entiende a 390 px? (9,0) | 9,25 | 170 px fijos (20 %), escena entera, sello bajo el monitor; ❌ al entrar en un caso o apuesta el chip de paciente se queda en el anterior (Policarpo marcado en el caso de Toribio, capturas 05 y 07) y la frase viva sigue siendo la de la ACTH de Policarpo; el sello sale dos veces (caja grande + fila amarilla con el mismo título, captura 01) |
| ¿Apuesta, error y caso? (8,5) | 9,0 | Dos apuestas con la PA oculta, dos errores (1 y 2), dos casos que evolucionan con giro y «Lo que te llevas» enlazado; ❌ en Toribio la correcta es la más larga en los 3 pasos (118/76/84 · 62/101/54 · 88/59/80): se acierta sin estudiar; Obdulia día 1 «con la hidrocortisona puesta» y día 2 «hidrocortisona, que no llegó a ponerse» se contradicen |
| Paciente posible y topes (8,25) | 9,0 | Reloj, tormenta y mixedema que ceden, rebote, Δ, cifra imposible; ❌ PAM 55 al quitar la NA con hidrocortisona a 3 días (ya sabido, vuelta 3); Bibiana con estrés 3 + hidrocortisona PAM 90 (133/68), por encima de su basal 78; FC de Toribio fija en 118 los días 1-3 pese a mejorar |
| **Global (8,55)** | **9,1** | Pasa (≥8,75); no llega a 9,5 |

**Para 9,5 (8 cosas)**:
1. `pagina.js` `modoPrueba` (l. 117-119) y `paso` (l. 124): `preset = A.p / E.p / C.pac` y una `frase()` por paso («Día 5: PA lábil y FC 130 tras suspender la hidrocortisona de golpe» · origen), para que el chip y la frase sigan al caso.
2. `modelo.js` `eje()` l. 72: `if (s.hc && !s.parada)`; con `parada` la lupa sin hidrocortisona externa y tejido «insuficiente · rebote».
3. `modelo.js` `eje()` l. 87: con levotiroxina la TSH del rótulo baja con el reloj como `lb` (l. 20, 14 días), no `*= .6` al instante; mismo criterio para `t.t4` (hoy «T4 N» con T4 libre 0,26).
4. `pruebas.js` `TORIBIO.pasos`: recortar la correcta de los 3 pasos a ±20 % de las otras; `eje-b.mjs`: `largas ≤1` también para `modoPrueba('caso', 1)`.
5. `pruebas.js` `OBDULIA.pasos[2].enun`: «el turno anterior pasó la levotiroxina y no dio la dosis de hidrocortisona de las 6 h», y `pasos[1].enun` coherente.
6. `modelo.js` `leer()` l. 32 (vuelta 3, ya sabido): PAM ≥65 con NA 0 e hidrocortisona a 3 días; l. 44-45: la FC de Toribio baja con el lactato (118 → ≈95 el día 3, `ilustrativo`).
7. `modelo.js` `leer()` l. 32 `P.hcEf`: en Bibiana la cobertura devuelve al basal (≈78), no a 90.
8. `pagina.js` (pintado de topes) / `estilo.css`: un solo sello bajo el monitor; la fila amarilla solo para los topes que no son el abierto.

**No visto con los ojos**: Sinforoso, Fulgencio, apuesta 1 y error 1 (sin cambios desde la vuelta 1), el paso a paso con Motion (programa en verde).

## Rejuicio 2 (vuelta 3, R8: solo los 8 puntos) · profesor, 01/11/2026

Base: `herramientas/rejuicio-eje.mjs` (todo en texto, sin errores de consola) + una pasada extra de lupa y chips en cada paso de los casos; 3 capturas miradas (01 Toribio, 05 giro de Toribio, 07 giro de Obdulia).
1 ✅ chip y frase siguen al caso (Toribio* en el caso 2 tras Policarpo, Obdulia* en el caso 1; «Toribio, día 5: PA lábil y FC en alza…», «Obdulia, día 2: PA 77/40 tras la hormona sin la hidrocortisona de las 6 h») · 2 ✅ paso 3 de Toribio: lupa sin hidrocortisona externa y rótulo «Retirada brusca · tejido insuficiente · rebote (ilustrativo)» (captura 05) · 3 ✅ Obdulia con levotiroxina: «TSH ↑ · T4 ↓» junto a 0,26/44,8 (captura 07) y con el reloj baja a 0,65/25,3 el día 7 y «TSH N · T4 N» 1,1/2,5 el día 14 · 4 ✅ Toribio 88 (79/95) · 86 (83/89) · 81 (84/80): la correcta no es la más larga en ningún paso y `eje-b.mjs` l. 132-134 lo vigila (±20 %, `largas ≤1`) · 5 ✅ día 1 «tras la primera dosis de hidrocortisona» y día 2 «el turno anterior pasó la levotiroxina IV y no dio la dosis de las 6 h» · 6 ✅ NA 0 e hidrocortisona a 3 días: PAM 67, y 67 tras retirar y +3 días; FC de Toribio 110 (día 1) → 95 (día 3) con el lactato 3,3 → 1,6 · 7 ✅ Bibiana estrés 3 + hidrocortisona vuelve a 115/59, PAM 78 (su basal) · 8 ✅ un solo `.tope-sello` bajo el monitor; la fila amarilla solo lleva «Noradrenalina >0,2», que no es el abierto (captura 01).

| Criterio | Rejuicio 1 | Ahora | Por qué |
|---|---|---|---|
| ¿Se ve el mecanismo? | 9,25 | 9,5 | La lupa cuenta lo que pasa en cada paso del caso; el tiroides de Obdulia se mueve con la hormona y el reloj |
| ¿Se entiende a 390 px? | 9,25 | 9,4 | Chip, frase y sello en su sitio; queda un título repetido: el aviso «Noradrenalina >0,2» sale en la fila amarilla y otra vez como caja bajo la tarjeta (captura 01) |
| ¿Apuesta, error y caso? | 9,0 | 9,5 | Longitudes niveladas, enunciados coherentes, giro y rebote con su sello |
| Paciente posible y topes | 9,0 | 9,5 | PAM, FC y cobertura de Bibiana encajan; la retirada ya no hunde la PAM |
| **Global** | **9,1** | **9,5** (9,475) | Llega a la meta de modelo vivo nuevo |

Retoques (opcionales, no frenan): (a) `pagina.js`, pintado de topes: cuando un aviso ya tiene su caja bajo la tarjeta, no repetirlo en la fila amarilla (o al revés) · (b) `modelo.js` `eje()` l. 89: con levotiroxina y el reloj a 14 días el rótulo dice «T3 ↓ · levotiroxina ↓» junto a «T4 N · TSH N»; que `t.t3` siga a `t.t4` como `lb` (ilustrativo).
