# v2m · paso 6, vuelta 2, carril MOTOR (constructor, wt/mv6-v2m) · PARCIAL: solo el arreglo 9 (g=0); 1 y 2 NO resueltos
Herramientas: `herramientas/m1-chorro.mjs` (ahora con `gradDiast` = máx pVD−pAD con la tricúspide abierta y VTD del VD; `EXTRA=1` añade g=0-0,3; ajustes `vdA`, `vdB`, `adA`, `tricRev`) y `herramientas/m1-diastole.mjs`.
## Causa del arreglo 1 (medida)
No es la resistencia ni la apertura: tras la contracción auricular (t≈0,05-0,17 s) la AD cae a 1-7 mmHg (relajación de una aurícula casi vacía: el empuje auricular le saca ~25 mL) y el VD se queda en 17,5 (TEP g=1) con la válvula **cerrada** por el diodo: pVD−pAD = 16 mmHg (v 2,0 m/s; 8 mmHg es solo el tramo final). Ese tramo presistólico se une a la sístole en la «ventana del chorro» (racha pvd>pad): es el primer pico de la «W» del TEP y la «segunda joroba» del normal (en el normal: 5,6 mmHg desde t=0,074, 4 s del tramo; la IT no se pinta por EROA 0, pero el dibujo de la ventana sí). Es el mismo defecto: arreglar la diástole arregla la forma (arreglo 2) y el pico con g<0,4 (la ventana tiene dos jorobas casi iguales, 28-31 % y 66-74 %, y el máximo salta de una a otra).
## Palancas probadas (todas rompen las condiciones)
| palanca | gradiente diástole TEP 1 | efecto |
|---|---|---|
| hoy | 16,4 | vIT 2,74, PSAP 44, FEVD 9,2 |
| rTricus 0,02 / 0,05 (global) | 11 / 5,6 | normal vIT 2,07→1,81 / 1,25; PSAP 22→19 / 14; HP g=1 PSAP 99→92 / 79 |
| vd.a ×0,7 | 16 | no cambia el cierre; PSAP +5 % |
| válvula abierta toda la diástole con flujo de vuelta (`tricRev`) | 5,6 (HP 4,1-4,8) | VD llena menos: normal FEVD 52,8→62 (≤58 exigido), vIT −17 %, PSAP −14 %; TEP 1 vIT 2,47, PSAP 40, FEVD 21,8; HP 0,6 vIT 4,40, PSAP 89, FEVD 41,8 |
| `tricRev` solo en HP/TEP | 4-6 | HP/TEP fuera de ±5 % (PSAP −9/−13 %) y FEVD +12 puntos; el normal (g=0) no puede llevarlo |
Con `tricRev` en el normal + vd.a ×0,7: FEVD 60,7, TAPSE 20,2 (límite 20), vIT 1,81 (−13 %). Raíz: el VD del escenario está a 13,5-17,5 mmHg con una PVC media de 10,4; con la válvula abierta se iguala y el VTD baja (TEP 1: 218→186 mL). Cualquier arreglo del origen exige recalibrar el VD basal (a, b, Ees) y todos los escenarios de shock: decisión del director, fuera de este carril.
## Hecho (arreglo 9)
`escenarios.mjs`: `fundeVd(g)` — la subida del VD (`fSubidaVd`) pasa de la del VI (g=0) a la de la enfermedad en g≥0,15. HP y TEP con g=0 dan **exactamente** el normal (vIT 2,07, PSAP 22, FEVD 52,8, TAPSE 22,9, TA 145); g≥0,15 sin cambio. `motor.mjs`: parámetro `tricRev` (0 = comportamiento de siempre) con el pestillo de la válvula abierta; **inerte**, queda como palanca para el motor.
| caso | pico/r25/r75 antes→después | vIT | PSAP | FEVD | TAPSE | TA |
|---|---|---|---|---|---|---|
| normal, HP 0,6/0,8/1, TEP 0,5/1 | sin cambio (ver m1-informe M1c) | = | = | = | = | = |
| HP g=0 y TEP g=0 | pico 33 % = normal (antes 74/31 %) | 2,07 | 22 | 52,8 | 22,9 | 145 |
g<0,4 (pico 30-65 %): **no** resuelto: HP 0,1-0,3 → 74/71/69 %; TEP → 31/30/68 % (dos jorobas, ver causa).
## Pruebas
`eco/pruebas/*.test.mjs`: 584 pasan, 2 fallan: «tiempo <60 s» (ya conocido, no es de este cambio) y la instantánea del dibujo, regenerada con `--congelar`: cambian solo `hpcronica:0` y `tep:0` (ahora iguales al normal); 1 de 1 verde después. maniobras nº 7, e-prima, contrato y domo-septo en verde. `jueces --modelo shock-vivo`: 1598 comprobaciones a favor; caché subida; 2 rojos «mando no tocable» en pacientes que no toqué (Aurelio/infarto, Gravedad/rotura de septo a 390; Mateo/hemorragia a 360), con las suites corriendo a la vez en la máquina: parecen de carga, repetir en solitario.
## No comprobado / riesgo
Arreglos 1 y 2 sin hacer (decisión de recalibrar el VD basal). Capturas del dibujo no mirables sin los otros carriles.
