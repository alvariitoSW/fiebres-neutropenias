# s2-vd (eco-calibra-a, sesión 2) · quitar el suelo del VD y bajar LIMITES.vd[0] · rama wt/eco-calibra-a-vd
Decisión del director: un VD hipovolémico real conserva su FE; el motor tenía razón y el dibujo es el que debía admitir el VD vacío.
## Cambios
- `escenarios.mjs`: dosis del VD a 0 en `SUELO_HEM`, `SUELO_DER`, `SUELO_VASO` (AI/AD intactas; `SUELO_TEP` ya era 0) y comentario actualizado.
- `corazon-geo.mjs`: `LIMITES.vd` [45, 330] → [20, 330] (el VD más pequeño de la tabla: 23 mL, hemorragia:1; margen 3 mL).
- `pruebas/geometria.test.mjs`: prueba nueva «un VD vacío (20 mL…)»: luz en la base >8 mm (16,4), luz a media altura ≥3 mm (4,9), radios finitos y ≥0,
  margen de los anillos tricúspide/RVOT ≥1,5 mm (1,59), sin coordenadas no finitas con las tres opciones de dibujo (con corte, base, pericardio).
- `pruebas/paciente-doppler.test.mjs`: `J2:derrame:1` fuera de PENDIENTES (quedan solo J1:fallo:def y J1:fallo:1); comentario actualizado.
## Antes → después (TAPSE / VDtd / VDts / FEVD), tabla `tabla-s2-vd.txt`
| punto | antes (con suelo) | después |
|---|---|---|
| hemorragia:def | 20,9 / 100 / 49 / 51 % | 24,0 / 87 / 36 / 58 % |
| hemorragia:1 | 12,1 / 69 / 49 / 29 % | 17,3 / 43 / 23 / 47 % |
| derrame:def | 20,9 / 96 / 47 / 51 % | 21,5 / 93 / 44 / 52 % |
| derrame:1 | 13,7 / 51 / 32 / 37 % | 15,4 / 45 / 26 / 42 % |
| vasoplejia | 20,8 / 99 / 48 / 51 % | 22,6 / 91 / 40 / 56 % |
Normal (0 %) idéntico. Todas las filas «fuera: no».
## Dibujo a ~23 mL
Captura SC4C, hemorragia al 100 %, fin de sístole (VD 22,9 mL): `/tmp/plan-socialista/eco-calibra-a/vd-pequeno.png`. El VD se ve como una hendidura
estrecha entre pared libre y tabique, sin cruces ni geometría rota. Con luz mínima a z=−60 mm (0,3 mm): VD casi virtual en el ápex, como el VI vacío.
## Pruebas recalibradas
Ninguna (no recalibro sin fuente). Ver los 2 fallos de abajo.
## Suite
504 pruebas, 489 ok, **2 fallan**, 13 TODO (los de antes). Salida: `/tmp/plan-socialista/eco-calibra-a/suite-vd.txt`.
- `taponamiento.test` R2 «a 388 mL, la pared libre de la VD en psaxPm se invagina»: hundimiento 1,3 mm (exige >3).
- `taponamiento.test` P1 «el pliegue se dibuja»: VD endocardio se mueve 2,5 mm (exige >4).
Causa: derrame:1 en el instante del pliegue máximo tiene VD 27 mL; su luz sin pliegue en el centro del pliegue mide 2,8 mm
(z = −0,4·Lvd), y el pliegue solo se come el 75 % de la luz (`fVd`, corazon-geo.mjs). Con el límite en 45 mL, el dibujo ensanchaba el VD
(luz mayor) y por eso salía >3 mm: el umbral absoluto se fijó sobre un VD que no era el del motor. Un hundimiento >3 mm es imposible en
una luz de 2,8 mm. No lo arreglo: sería recalibrar un umbral (p. ej. «≥50 % de la luz») o tocar la profundidad ilustrativa del 75 %,
ambos sin fuente. DECIDE EL DIRECTOR. La rama NO queda con la suite en verde por estos dos.
## No comprobado / riesgo
La estética del VD vacío en el 3D y en otras vistas (solo miré el SC4C). La FE de 47 % en hemorragia:1 es la del motor, sin fuente propia (fisiología general).
