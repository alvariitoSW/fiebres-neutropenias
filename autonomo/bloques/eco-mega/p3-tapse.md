# P3 · TAPSE de paciente posible (rama auto/eco-mega-tapse)

Archivos: `js/modules/eco/corazon-geo.mjs` (`acortamientoVd`, nueva `REFUERZO_ACORT_VD`), `pruebas/paciente-posible.test.mjs` (prueba nueva),
`autonomo/bloques/eco-mega/herramientas/tapse-tabla.mjs` (genera la tabla).

Origen del error: `acortamientoVd` era lineal hasta 0 con la FE del VD. Ahora = 24/71 × r·(1 + 1,6·q²), r = FE/58 %, q = max(0, 1 − r/0,7): lineal como antes desde r = 0,7 y, por debajo, curva suave con pendiente finita (0 sin eyección, para que el anillo no baje en telediástole; una versión con suelo del 25 % rompió el dibujo y se descartó). Refleja una parte pasiva
(tracción del VI por tabique y plano AV comunes + movimiento del corazón entero) que no depende de la FE del VD. Fisiología general,
ilustrativo (Lang p. 23 da la normalidad, no la ley; Mukherjee p. 145 llama grave a TAPSE ≤10 mm, no a 4 mm). Normal sigue ≈ 23,1 mm (igual que antes).
Tras el arreglo, `excVd` del dibujo usa la misma función: el anillo dibujado y la cifra coinciden (prueba F5 ±1,5 mm).

| Caso | FE VD | PAM | TAPSE antes | TAPSE después |
|---|---|---|---|---|
| Normal | 53 % | 86 | 23,1 | 23,1 |
| TEP g 0 | 53 % | 87 | 23,0 | 23,1 |
| TEP defecto | 13 % | 67 | 4,7 | 8,4 |
| TEP g 1 | 9 % | 58 | 3,3 | 6,5 |
| HP crónica g 0 | 53 % | 87 | 23,0 | 23,1 |
| HP crónica defecto | 37 % | 83 | 15,3 | 15,5 |
| HP crónica g 1 | 10 % | 74 | 3,7 | 7,1 |

Prueba nueva: TEP y HP crónica en g 0, defecto y 1 → TAPSE 6-30 mm; normal 22-25.
Mezcla de formas (`formas.mjs`): la mezcla también vigila el acortamiento del VD (`TOLERANCIA.acortVd` 0,007 ≈ 0,5 mm), sin tocar el límite de la prueba.
Primeros intentos descartados: potencia 0,58 y r(2−r) subían el TAPSE normal a 24-25 mm y eso hundía el eje de la AD (1,75 cm/m²; «ejes de la AD» y «pliegue AD» fallaban): era cosa mía, no de la base. Por eso la versión final deja el VD normal intacto (lineal desde r = 0,7).
Suite eco tras fusionar auto/eco-mega (457 pruebas): 446 pasan, 0 fallan, 11 todo. Doppler de `navegador.test.mjs` falló solo bajo carga de la máquina; en esta pasada pasa.