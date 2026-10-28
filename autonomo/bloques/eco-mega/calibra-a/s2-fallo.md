# s2-fallo (eco-calibra-a, sesión 2) · fallo del VI, rampa de gravedad · 28/10/2026
Suite eco: 503 pruebas, 485 ok, **0 fallan**, 18 todo. Tabla: `tabla-s2-fallo.txt`. Quitadas de PENDIENTES: `J1:fallo:def`, `J1:fallo:1` (quedan solo los J2).

## Antes → después (E/A · DT · e′ sep/lat · E/e′ · S/D · PCP · PAM · FC · GC)
| Punto | antes | después |
|---|---|---|
| def | 0,98 · 264 · 3,9/4,8 · 13,4 · 1,42 · 22 · 81 · 83 · 4,10 | 1,44 · 240 · 3,8/4,7 · **15,2** · **0,75** · 22,7 · 81 · 83 · 4,08 |
| 100 % | E30 A70 (0,43) · – · 3,1/3,9 · 8,5 · 0,09 · 33 · 57 · 120 · 2,40 | E35 A64 (0,54) · – · 2,0/2,5 · **15,2** · 0,05 · 33 · 56 · 121 · 2,36 |
| 0 % | sin cambio (FE >40 %) | |
Dilatada: e′ 4,9/6,2 → 3,1/3,8 (E/e′ 18,6 → 29,8; sigue grado 3, bandas dentro). Hipertrofia y el resto: idénticas.

## Qué probé de las pistas (medido, no supuesto)
1. **Relajación 2,8 → 2,3 + AI más rígida**: sola, la relajación baja la E/e′ por e′ alta; sin rigidez del VI el def sale con E/e′ 12-13. Lo que baja el S/D <1 es la
   AI más rígida (AI.b ×1,3 con la gravedad: S 36, D 48), no la relajación. Rigidez ×1,3 del VI (la del anterior) vuelve a romper el VD (TAPSE 15,7; VTSi 45,6;
   eyección 241): y Mukherjee 2025 describe el corazón derecho «normal hasta tarde» en el grupo 2, así que esas 3 pruebas están bien y no las toqué.
2. **Pruebas rotas**: con las dos palancas finales (relajación y AI, sin rigidez del VI) no rompe ninguna de las 9; solo la de balón quedó a 37,995 de 38 con relaj. 2,4
   (fondo de la onda al final del latido), y con 2,3 da 38,05. Ninguna prueba recalibrada, ninguna referencia ni LIMITES tocada.
3. **Tiempos con la FC (hipótesis del director): refutada.** Eyección medida del motor: FC 71 → 276 ms, FC 83 → 248, FC 120 → 200; Weissler da 413 − 1,7·FC
   (verificado el título, Circulation 1968;37:149, PMID 5640345; los coeficientes no los pude abrir): 292, 272, 209. El motor ya la acorta con la FC. La mitral abre
   a ~0,47 s tras la P con T 0,50 (IVRT ~57 ms; Nagueh Tabla 7: IVRT ≤70 ms específico): a FC 120 la E y la A SE FUNDEN también en el paciente real. Cambiar PR o
   sístole movía las demás formas y bajaba el S/D; no toqué el motor. Pr 0,12 + sístole 0,33: E 34 (el VS de 20 mL no da más).
4. **Lectura de la onda fundida** (rechazada): tomar el pico de la onda fundida como E (Sohn 1999, JASE 12:203, PMID 10070184: cociente fundido ≥8) daba E/e′ 19,9, pero
   subía la E de vasoplejía, TEP def y HP crónica 100 % (E/e′ 11,9 > 8, rompía su banda). Revertida; no está en el código.

## Cambios
- `atlas/diastolica.mjs`: `restitucion(fe)` = max(0,35, (FE ÷ 0,40)^1,5) (antes max(0,6, FE ÷ 0,40)). Pasa a todo el que llama (`ePrima`, `medirLlenado`, `curvasLlenado`).
- `escenarios.mjs` (fallo): `relajacion = 1 + 1,3·u`; `ai.b ×(1 + 0,3·u)`, u = min(1, g/defecto); quitada `RELAJACION_LENTA`.
- `guyton-tablas.mjs` regenerada; `pruebas/paciente-doppler.test.mjs` (PENDIENTES); `README.md`; `tabla-s2-fallo.txt`.
- Motor común: **sin cambios**.

## Frases/cifras nuevas con su origen
E/e′ ≥14 y S/D <1: Nagueh 2025 pp. 554, 549 (bandas del juez). AI rígida con presión alta → S/D bajo: fisiología general (Nagueh p. 549: S bajo con PAI alta), ilustrativo.
e′ septal ~2 cm/s con FE ≈10 %: **extrapolación ilustrativa sin fuente** (Nagueh p. 561 da 3-4 en el grado 3 avanzado). Sin esa cifra el E/e′ del shock no llega a 14
(E 35 cm/s con SV 20 mL). Decisión para el director: aceptar, o dejar `J1:fallo:1` en PENDIENTES con la causa «E 35 cm/s por el SV de 20 mL».

**No comprobado / riesgo**: sin navegador ni `jueces.mjs --eco`; e′ de 2 cm/s en el shock es un valor de extrapolación; relajación del fallo (2,3) es la del modelo, no una τ clínica; la prueba del balón queda con 0,05 mL de margen.
