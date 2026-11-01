# Profesor · rejuicio R8 de G2, G3 y G4 · 01/11/2026 · rama `auto/b3d-estudio` (6657a29)
Programas tal cual: `profesor-g2.mjs` (103 respuestas), `profesor-g3.mjs` (75) + `profesor-g3-mandos.mjs`, `profesor-g4.mjs` (61) y `cpap-barrido.mjs`; 0 px de desborde, 0 errores de consola, todos los casos llegan a «Lo que te llevas». Resúmenes y 6 capturas miradas en `/tmp/plan-socialista/b3-pulmon-estudio/rejuicio/`. Solo se repuntúan las celdas que estaban por debajo de 8,75 (antes → ahora).
Comprobado en la app: `cpap-eap` respira (PEEP 0 → 10: Vt 356 fijo, FR 20, I:E 1:2,3, VS 35 → 38; PS 5 → Vt 355, PS 10 → 520: la CPAP no sube el Vt y la PS sí); `atelectrauma-zeep` con PEEP 5 apaga el sello y la alarma («Sin alarmas», frase «con PEEP 5 o más ya no se cierran»); `hfno` «Boca cerrada» → PEEP 2,5 y la frase cita los 2-3 cmH₂O (p. 65); la lupa del neutrófilo abre sin el aviso del posparo; Mira de la 1 con la columna roja «MDI sin espaciador» (80 % orofaringe) y escalera verde/amarillo/rojo; Mira de la 6 con la Fig. 24.6; nota de fidelidad del 64 % en `#nep-nota-64`.

## G2 (3, 1, 2, 10, 11)
| Criterio | 3 | 1 | 2 | 10 | 11 |
|---|---|---|---|---|---|
| §7.1 | — | — | — | — | 8,5 → 8,5 (Mira 1720 px, sin cambio) |
| §7.4 | — | 8 → 8,75 | 8,5 → 8,5 | 7,5 → 8,75 | 8 → 8,75 |
| §7.5 | — | 8,5 → 8,5 (un solo Juega) | 8,5 → 8,5 | 8 → 8,75 | 8,5 → 8,75 |
| §7.6 Mira | — | 8 → 8,75 | — | 8,5 → 8,5 (sin curva de la PSV) | — |
| §7.8 | — | — | — | 8,5 → 8,75 | — |
| §8 dificultad | 8 → 8,75 | 8 → 8,5 | 8,25 → 8,25 (buena en 2.ª en 11 de 18) | 8,25 → 8,75 | 8,25 → 8,75 |
| §8 caso | 8,5 → 8,75 | 8,5 → 8,75 | 8,25 → 8,75 | 8,5 → 8,75 | — |
| Compruébalo | — | — | 8,5 → 8,5 | 7,5 → 8,75 | 8,5 → 8,75 |
Veredicto: **3 llega a la meta**; 1, 2, 10 y 11 aprueban (todo ≥ 8) sin meta.

## G3 (4, 6, 5)
| Criterio | 4 | 6 | 5 |
|---|---|---|---|
| §7.4 | 8 → 8,75 | 8 → 8,75 | — |
| §7.5 | — | 7,5 → 9 | — |
| §7.6 Mira | — | 8,5 → 8,75 | — |
| §8 dificultad | 7,5 → 8,25 (larga 13 % ✓; **corta 6 de 16**) | 7,5 → 8,5 (larga 7 de 21, justo ⅓; **corta 8 de 21**) | 8,25 → 8,75 (25 % / 30 %) |
| §8 caso | — | 8,5 → 8,75 | 7,5 → 8,75 (una sola Elvira) |
| §8 giro | — | — | 8,5 → 8,5 (sin cambio) |
| Compruébalo | 8 → 8,75 | 7,5 → 8,75 | — |
| Pacientes | — | 8 → 9 | 7,5 → 8,75 |
Veredicto: las tres aprueban (todo ≥ 8); ninguna llega a la meta (4 y 6 por la forma; 5 por el giro de Elvira, que es el esperado).

## G4 (7, 8, 9)
| Criterio | 7 | 8 | 9 |
|---|---|---|---|
| §7.4 | 8,25 → 8,5 (el capilar sigue dando −20 % a PaO₂ 45, no el −8 %) | — | 8,25 → 8,5 (lupa estática) |
| §7.5 | 8,25 → 8,75 | 8,5 → 8,75 | 8 → 8 (sin mando) |
| §7.8 | 8,5 → 8,75 | — | 8,5 → 8,75 |
| §8 dificultad | 8,25 → 8,5 (**corta 5 de 13**; o2i-g6 ≈ o2i-c4 «dilata las coronarias») | 7,5 → 8,5 (forma ✓ 4/14 y 3/14; «ya no se favorece» en g2, c1 y c3) | 8,25 → 8,75 |
| §8 caso / giro | — | 8 → 8,75 / 8,5 → 8,75 | — |
| Compruébalo | 8,25 → 8,5 | — | — |
| Pacientes | — | 7,5 → 9 | — |
Veredicto: las tres aprueban (todo ≥ 8); ninguna llega a la meta.

## Lo que aún falta (última vuelta barata)
1. `js/data/mayeutica/b3d-asma-2.js`: barajado de la ficha 2 (buena en 2.ª posición en 11 de 18; `barajar(q.opciones, q.id)`): cambiar el id o el orden de escritura en as2-g2, g3, g6, g8, g9, g11, g12, e1, e2, e3, c5 hasta que ninguna posición pase de 9.
2. Forma (buena la más corta en >⅓; los tests de 2 opciones sd-e4, sd-e5, sv-e5, snv-e2, o2s-e2 cuentan en los dos lados en el programa: comprobar cómo los cuenta `jueces.mjs`): `b3d-sdra.js` alargar la buena en 1 de sd-g3, sd-g5, sd-g6, sd-c6 (quedar ≤5 de 16) y en 1 de sv-e4 (−26), sv-e2 (−13), sv-g10 (quedar ≤7 de 21); `b3d-oxigeno.js` en 1 de o2i-g4 (−33), o2i-g5 (−20), o2i-e3 (−16) (quedar ≤4 de 13).
3. `js/modules/neumologia/visual-3d-g2.js` ficha 10: la figura de la PSV (Fig. 26.2: hundimiento y corte al 25 %) o un nodo que abra `psv-disparo` desde Mira (arreglo 8 del juicio G2, aún sin hacer).
4. `b3d-asma.js` as1-e3: «32 μg (9 %)» sin `origen`: rotular «ilustrativo: cuenta proporcional (9 % de 0,36 mg, Tabla 23.1 p. 17)» o quitarla; as1-g6 ≈ as1-c4 (80 % / 9 %) siguen iguales.
5. `b3d-oxigeno.js` o2i-c4 frase 3: otro error que no sea «dilata las coronarias» (ya en o2i-g6); o2s-c3 punto 3 repite «ya no se favorece» de o2s-g2 y o2s-c1.
6. `b3d-sdra-2.js` línea 175: «Vt (monitor) 335 mL» en Elvira con cánula → «Vt (del modelo, ilustrativo)» o quitarlo (la 8 ya lo quitó).
7. `js/data/pulmon-vivo-data.js` `'sdra-protector'` guía: 0 de 4 pasos con «Ver en la ficha» (sigue; §7.10). Absolutos que quedan: sd-g3 y sd-e1 («cualquier»), vni-e2 opción 2 («ninguna… cualquier fuga»).
