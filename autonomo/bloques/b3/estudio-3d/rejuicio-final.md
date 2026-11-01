# Profesor · rejuicio R8 final · 01/11/2026 · rama `auto/b3d-estudio` (20d3932, versión 20261101-31)
Programas tal cual: `profesor-g2.mjs` (103 respuestas), `profesor-g3.mjs` (75), `profesor-g4.mjs` (61), `profesor-g5.mjs` (157): 0 px de desborde, 0 errores de consola, 0 fallos de programa (el único ❌, `c-asma-1` «modelo undefined», es el caso sin modelo de la ficha 1, igual que en el rejuicio anterior). Nuevos: `forma-b3d-final.mjs` (forma de las 21 fichas con el `barajar` real, errores por «encuentra el error», absolutos, repeticiones; `forma.txt`) y `rejuicio-final-capturas.mjs` (botón PSV de la Mira de la 10, neumotórax hasta 9 pulsaciones, línea FR/Vt tras `sbt-fracaso`). 3 capturas miradas en `/tmp/plan-socialista/b3-pulmon-estudio/rejuicio-final/` (+ las de los programas en `g2/`-`g5/`). Solo se repuntúan las celdas que estaban por debajo de 8,75.

| Ficha · criterio | Antes → ahora | Por qué |
|---|---|---|
| 1 · §8 dificultad | 8,5 → **8,75** | as1-e3 ya sin el «32 µg»; forma 3/15 larga, 2/15 corta. (§7.5 «un solo Juega» sigue en 8,5: sin cambio) |
| 2 · §8 dificultad | 8,25 → **8,75** | barajado 6/6/6 (`b3d-asma-2.js`). §7.4, §7.5 y Compruébalo siguen en 8,5 (sin cambio) |
| 10 · §7.6 Mira | 8,5 → **8,75** | panel «La presión de soporte, en el pulmón vivo» con botón que abre `psv-disparo` (captura `mira-10-psv`) |
| 11 · §7.1 | 8,5 → 8,5 | Mira de 1720 px, sin cambio |
| 4 · §8 dificultad | 8,25 → **8,75** | corta 3/16 (antes 6) |
| 6 · §8 dificultad | 8,5 → **8,75** | larga 7/21 (justo ⅓, con el empate sv-e5), corta 6/21 (antes 8). Giro de la 5 sigue en 8,5 |
| 7 · §8 dificultad | 8,5 → **8,75** | corta 4/13 (= ⅓); o2i-c4 ya no repite «dilata las coronarias». §7.4 y Compruébalo (capilar a PaO₂ 45) siguen en 8,5 |
| 8 · §8 dificultad | 8,5 → **8,75** | o2s-c3 sin «ya no se favorece»; larga 3/14 sin contar los dos empates de tests de 2 opciones (5/14 contándolos) |
| 9 · §7.4 / §7.5 | 8,5 / 8 → igual | lupa estática y sin mando: no se tocó |
| 15 · §7.5 | 8,5 → 8,5 | la frase viva solo cambia con el sello de shock (10,5 cmH₂O); a 5 pulsaciones sigue la frase de entrada y «Sin alarmas» (captura `neumotorax-5-respiraciones`) |
| 15 · Compruébalo | 8,25 → **8,5** | baro-c4 ya manda al sello; pero promete «unas 5» y con el reloj parado son 7 pulsaciones (0,75 × 2 por pulsación; 7,5 cmH₂O a las 5) y a 10,5 el monitor lee PAM 52, no «≈59» |
| 15 · pacientes | 8,5 → **9** | tubo-c2 «a 25 cm» y retirar a 23; «Día 4 · 48 h con el tubo» |
| 17 / 19 · §7.4 | 8,5 → 8,5 | sin lámina ni estado `subglotica`: no se tocó (por encargo) |
| 18 · §8 dificultad | 7,75 → **8,75** | larga 6/18 (= ⅓; nvd-g12 ya −2), posición 8/5/5; nvd-g11 con 1 error. Queda nvd-g2 ≈ nvd-e4/c1 |
| 19 · §8 dificultad | 8,25 → **8,75** | corta 4/19 (dea-e4 y dea-g11 alargadas); dea-c6 pregunta otra cosa; dea-g9 con 1 error. Queda dea-g7 ≈ dea-e3 |
| 21 · §8 dificultad | 7,5 → **8,75** | corta 5/19 (26 %), larga 5/19; ext-c6 avisa «el ~3 % que lo tiene pese al esteroide» |
| 21 · pacientes | 8,5 → **8,75** | ext-c5 «nueve días»; el `fuga-cuff` sigue rotulando «Benito, día 7» (pieza común) |
| 13 · §8 dificultad (G1) | 8,5 → **8,75** (estático) | raj larga 5/21 (raj-g14 +13, raj-e1 +9); `color: 'azul'` ya no está en `visual-3d-g1.js` → 16 §7.6 8,5 → **8,75** (estático, sin captura nueva) |

**Nota mínima por ficha (21)**: 1 8,5 · 2 8,5 · 3 8,75 · 4 8,75 · 5 8,5 · 6 8,75 · 7 8,5 · 8 8,75 · 9 8 · 10 8,75 · 11 8,5 · 12 8,75 · 13 8,75 · 14 8,75 · 15 8,5 · 16 8,75 · 17 8,5 · 18 8,75 · 19 8,5 · 20 9 · 21 8,75.
**Llegan a ≥ 8,75 en todo: 12 de 21** (3, 4, 6, 8, 10, 12, 13, 14, 16, 18, 20, 21). **≥ 8 en todo: 21 de 21.** Veredicto: el bloque aprueba; la meta queda en 9 fichas por celdas que ya estaban anotadas y no se tocaron.

## Lo que aún falta (para `b3-cierre`)
1. `js/data/mayeutica/b3d-tubo-2.js` baro-c4 y paso «giro: se hunde»: «unas 7 pulsaciones (10,5 cmH₂O), PAM ≈52» o que `js/modules/libros/pulmon-vivo/neumotorax.js` (`'pasar'`, línea 122) escriba en `nx.msg` una frase por pulsación («aire pleural 7,5: PAM 77, SpO₂ 94; a 10,5, shock»). `b3d-destete.js` sbt-c5: FR 35 como da el modelo.
2. Modelos para 9 (`tox`, lupa con mando), 17 y 19 (estado `subglotica` del pulmón vivo: biofilm y puerto subglótico; serviría a 14, 15 y 17), 2 (un Compruébalo con mando) y 11 (Mira más corta): megaproyecto, bitácora.
3. Ficha 7: el Compruébalo o2i-g2 abre el capilar en PaO₂ 45 (CaO₂ 15,8, −21 %) cuando el botón dice «lleva la PaO₂ a 60». Ficha 5: giro de Elvira esperado.
4. Repeticiones que quedan: nvd-g2 ≈ nvd-e4/c1, dea-g7 = dea-e3, sbt-g5 = sbt-c1, nvp-g5 = nvp-c2, as1-g6 ≈ as1-c4. Posición: `neumo-epoc-vpp` tiene la buena en 1.ª en 9 de 17 (53 %, por ficha; `jueces` mide el banco B3 entero y está en verde).
5. Al abrir `sbt-*` o `fuga-cuff` tras el neumotórax, las filas ocultas `neumo-p`/`cor-pam` guardan 7,5 / 77 (no visibles: comprobado `offsetParent` null); riesgo ya anotado en G5.
