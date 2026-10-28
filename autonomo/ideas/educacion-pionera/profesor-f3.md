# Profesor · fase 3 · juicio de las maquetas A, B y C (28/10/2026)
Método: prueba-a/b/c en verde a 390 y 360 px y sin errores de consola; más `herramientas/prueba-fallos.mjs` (nueva: camino de FALLO en las tres, capturas en `/tmp/plan-socialista/educacion-pionera/profesor/`). He mirado 7 capturas. Pasa con 8 en todo; la meta es 8,75. **Ninguna pasa todavía.**

| Maqueta | §7 | §8 | N1 | N2 | N3 | Repaso | Mín. | Media |
|---|---|---|---|---|---|---|---|---|
| A · POE shock | 7,0 | 8,0 | 8,5 | 8,5 | 7,0 | — | **7,0** | 7,8 |
| B · error capilar | 8,5 | 7,0 | 5,0 | 5,5 | 9,0 | — | **5,0** | 7,0 |
| C · entrelazado río | 7,5 | 8,5 | 7,0 | 7,5 | 6,5 | 9,0 | **6,5** | 7,7 |

**A.** §7: a 390 px la pregunta A1 empieza en y=870 (pantalla de 844). Los mandos están siempre apagados: el residente no mueve nada. El «modelo» son dos SVG mínimos con cifras leídas de `a/cifras.json`. Las cifras de paciente no casan: PAM 87 con 106/67 (la fórmula da 80), 54 con 73/34 (da 47) y ScvO₂ 90 % sin shock. En p5() la tabla de noradrenalina está calculada «sin el volumen», cuando Amparo ya lleva 1.750 mL. N1 bueno: el velo tapa el DOM y hay tabla antes→después. N3 flojo: la consecuencia del fallo solo se cuenta y llega pegada a la explicación, en `cuerpo()` de preg(). §8: en A2, A4 y A7 la correcta es la más larga (en A4, el doble).
**B.** Lo que mejor está de las tres: el sello TACO, la lupa del alvéolo, las constantes, la frase viva, la enseñanza después y ninguna pista durante el error. Usa la escena real. Pero falla en N1 (nada se apuesta antes) y en N2: el ejemplo resuelto lo explica la app sin preguntar. §8: el «piensa y destapa» no deja marcar los puntos que tenías (0 casillas, en pregDestapa()). No hay «otra vez lo que fallaste». El caso tiene 3 momentos. En el «encuentra el error», la 1.ª frase va sin número y las demás van de (1) a (4). §1.12: gasto de 7,6 L/min con FEVI del 35 % (gastoDe, ilustrativo). Hay que justificarlo o bajarlo.
**C.** El repaso está muy bien hecho: chip «Fallada hace 1 día (último intento 03/11)», «Vuelve mañana: fallada», nunca dos seguidas de la misma ficha y una tabla final. Es el único que mantiene las dos bases de evidencia alta. §7.9: ninguna cita lleva «Ver en la ficha» (0 `data-resaltar`), solo PDF. El rótulo «Repaso · pregunta 1 de 5» no cambia en la 2.ª-5.ª pregunta (c.js p1(), línea 166). Hay una incoherencia en Teresa: en P2 el plasma es de 2.160 mL y en P3 «su plasma mide 2 L» (datos.mjs). N3: al fallar sale «Fallada.» y todos los porqués de golpe; nada se ve en el modelo. §8: el repaso pone las opciones sin «piensa antes», y en P6 la correcta tiene 82 caracteres frente a 48.

**Los riesgos que dejaron los constructores:**
- **Sí bajan nota:**
  - A sin motor en vivo: §7.8, y por eso las PAM incoherentes.
  - A, la pregunta a un scroll: §7.1.
  - A, 3 correctas más largas: §8 y N1, -0,25.
  - B, «dos bolsas seguidas»: N3, poco. Quien acierta ve igual el TACO, solo que causado por otro R1.
- **No bajan nota:**
  - B, opciones sin barajar: el motor de la app baraja.
  - B, escena de 470 px: el mando queda en y=701, dentro de la pantalla.
  - C, correcta más corta en 3 de 7: el problema es el contrario, en P1 y P6.

**Para llegar a 8,75 (de lo más barato a lo más caro)**
A1. `a-poe-shock.html`: plegar la nota de evidencia y los mandos apagados en un `<details>`, para que A1 quede dentro de la 1.ª pantalla. Acortar la correcta de A2, A4 y A7 o alargar sus distractores.
A2. `preg()`/`cuerpo()`: al fallar, primero el monitor y una línea con lo que le pasa a Amparo con tu plan; después, un botón «Por qué», que abre los porqués y «Ver en la ficha». Añadir la fila «Tu apuesta | Lo que pasó» en tabla() de p2-p5.
A3. Importar el motor del shock vivo en lugar de `a/cifras.json` y dejar que el residente mueva él la gravedad tras apostar. Corregir en el motor la PAM frente a PAS/PAD y la ScvO₂ basal (que vaya al parte), y calcular p5() con el volumen ya puesto.
B1. `b/b.js` pregDestapa(): añadir las casillas «marca las que tenías» y una parte 2 que repita lo fallado. En Q[2].fr, numerar las 5 frases.
B2. `b/b.js` P4: convertir 3 de los 6 pasos en un test «¿por qué…?» con 3 opciones antes de mostrar el paso (N2). En P2, antes de la 2.ª bolsa, tapar DO₂, VO₂ y extracción y apostar qué harán (N1, sin pista).
B3. Alargar el caso a 5-6 momentos con hora o día: diurético, balance, Hb del día 4 y la decisión de no volver a transfundir. Revisar el gasto de 7,6 L/min con FEVI del 35 % en `capilar-vivo-data.js` gastoDe.
C1. `c/c.js`: actualizar el rótulo en una(). En fuentesHTML(), poner al lado de cada «Ver en el texto» un «Ver en la ficha» con data-resaltar. En `c/datos.mjs` P3, cambiar «2 L» por «2.160 mL».
C2. `c/datos.mjs`: poner `piensa: true` en los tests de REPASO e igualar la longitud de las opciones en P1 y P6.
C3. `c/c.js` pregunta()/terminar(): si falla en el caso, primero la consecuencia en el río (P1 «observar»: avanza el reloj, el río baja, la FC sube) y después los porqués. Tapar también la lectura del modelo antes de P4 y P6 y apostar (N1).

**Cuál enseñaría mejor a un R1 y por qué:** la **C**, con el error de B injertado en su caso. Es la única que conserva lo que más evidencia tiene en residentes (recuperar con feedback y repaso espaciado: Larsen 2009, Kerfoot 2010) y el caso §8 completo. Lo de B (equivocarse, ver el TACO en el pulmón y después la enseñanza) es el momento más memorable de las tres, pero solo como un paso del caso, no como el método entero. A predice bien, pero no repasa ni deja tocar el modelo.
