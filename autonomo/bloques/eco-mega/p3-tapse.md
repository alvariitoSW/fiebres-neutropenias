# P3 · TAPSE de paciente posible (rama auto/eco-mega-tapse)

Archivos: `js/modules/eco/corazon-geo.mjs` (`acortamientoVd`, nueva `EXP_ACORT_VD`), `pruebas/paciente-posible.test.mjs` (prueba nueva),
`autonomo/bloques/eco-mega/herramientas/tapse-tabla.mjs` (genera la tabla).

Origen del error: `acortamientoVd` era lineal hasta 0 con la FE del VD. Ahora = 24/71 × (FE/58 %)^0,58: curva cóncava (0 sin eyección, para que el anillo no baje en telediástole; una versión con suelo del 25 % rompió el dibujo y se descartó). Refleja una parte pasiva
(tracción del VI por tabique y plano AV comunes + movimiento del corazón entero) que no depende de la FE del VD. Fisiología general,
ilustrativo (Lang p. 23 da la normalidad, no la ley; Mukherjee p. 145 llama grave a TAPSE ≤10 mm, no a 4 mm). Normal sigue ≈ 23,9 mm.
Tras el arreglo, `excVd` del dibujo usa la misma función: el anillo dibujado y la cifra coinciden (prueba F5 ±1,5 mm).

| Caso | FE VD | PAM | TAPSE antes | TAPSE después |
|---|---|---|---|---|
| Normal | 53 % | 86 | 23,1 | 23,9 |
| TEP g 0 | 53 % | 87 | 23,0 | 23,9 |
| TEP defecto | 13 % | 67 | 4,7 | 9,0 |
| TEP g 1 | 9 % | 58 | 3,3 | 7,3 |
| HP crónica g 0 | 53 % | 87 | 23,0 | 23,9 |
| HP crónica defecto | 37 % | 83 | 15,3 | 18,5 |
| HP crónica g 1 | 10 % | 74 | 3,7 | 7,9 |

Prueba nueva: TEP y HP crónica en g 0, defecto y 1 → TAPSE 6-30 mm; normal 22-25.
Suite eco (443): 429 pasan, 11 todo, 3 fallan: «mezcla…percentil 99 0,57 mm» (formas), «Doppler… espectro casi vacío» (navegador, 34 s, máquina cargada) y «ejes de la AD» (AD 1,78 cm/m², ya fallaba en la 1.ª pasada; no toca el VD). No he podido confirmar contra la base (su ejecución agotó el tiempo).

Visto de paso (motor, no tocado): la FE del VD en TEP/HP grave (9-13 %) con PAM 58-74 es baja; en TEP real suele ser ~20-35 %.
Viene de VD muy dilatado (EDV 200-330 mL) y VS 20-30 mL; el motor lo da como shock con IC 1,3-1,5. Revisar `vd.ees`/`b` si se quiere.
Con FE <15 % el modelo ya no se ve como un paciente típico, aunque PAM sea sostenible. Un TAPSE de 8-9 mm es ahora coherente con ese VD.
Frase nueva: «el anillo sigue bajando por la tracción del VI y el movimiento del corazón entero» — fisiología general.

No comprobado / riesgo: sin captura visual (motor en Node); el exponente 0,58 es una elección ilustrativa, no sale de una fuente; la HP crónica a defecto (18,5) queda justo sobre 17, límite de la prueba atlas «adaptada».
