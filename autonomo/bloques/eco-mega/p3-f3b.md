# eco-mega · parada 3 · F3b (calibrar la AI del motor) — PARADO: la medición y la propuesta; el motor NO está cambiado
`motor.mjs` y `doppler.mjs` quedan como estaban. Hecho: herramientas `herramientas/f3b-medir.mjs` (6 escenarios), `f3b-grid.mjs` (barrido) y `f3b-propuesta.patch` (el cambio probado). Commit solo de eso.
## Qué falla de verdad (medido)
- Bomba auricular del normal = 23 % del llenado del VI (16,8 de 73 mL): **ya está en 15-30 %** (Lang 2015, p. 24 impresa = PDF). El «62 % de vaciado» es el neto de la AI (28 mL), y 11 mL de eso se van **hacia las venas** (Ar −593 mL/s): `rVp` 0,01 casi no frena el reflujo. El defecto es ese reflujo + la onda a (1,8 → 14,7).
- En hipertrofia y dilatada la bomba se anula (A 21 y 142 mL/s): la mezcla `e·sis + (1−e)·dia` deja la recta de la sístole por debajo de la pasiva si la AI está distendida y «contraer» la relaja. La AD tiene el mismo defecto (54 → 14 mL, onda a 10 mmHg); no la toqué.
## Antes (motor actual) → con la propuesta (aditiva en la AI: P = pasiva + e·Ees·(V−V0); AI Ees 0,27, A 0,15; rVp 0,02; rPul 0,085)
| | PAM | PCP | PVC | GC | E/A mitral | pAI (mmHg) | AI (mL) | pico qVp |
|---|---|---|---|---|---|---|---|---|
| normal | 86→86 | 7,5→8,1 | 4,3→4,3 | 5,01→4,99 | 1,24→1,36 | 1,8-14,7→2,7-12,5 | 17-50→32-54 | 619→318 |
| hipertrofia | 84→83 | 23,6→24,0 | 5,3→5,2 | 3,58→3,58 | 33→5,1 | 17,6-29→15-28 | 43-59→54-63 | 635→516 |
| dilatada | 81→80 | 26,7→27,4 | 9,3→9,2 | 3,82→3,79 | 6,5→4,2 | 19-32→16-34 | 60-81→71-85 | 830→660 |
| TEP | 67→71 | 2,1→2,3 | 8,6→8,4 | 2,78→3,00 | — | 0,2-9,8→0,3-7,8 | 8-34→15-39 | D 17→30 mL/s (>0) |
| hemorragia | 81→81 | 3,6→4,3 | 1,8→1,9 | 4,27→4,22 | 0,66→0,88 | 0,3-9,7→0,7-8,2 | 10-42→22-48 | 412→252 |
| derrame | 82→81 | 9,7→10,4 | 7,1→7,3 | 4,10→3,98 | 1,09→1,33 | 7,4-15,5→8-14,8 | 12-46→24-51 | 347→195 |
Normal con la propuesta: bomba 22 % del llenado; S 318, D 312, Ar 159 mL/s (S/D 1,02; Ar ≈ S/2 justo); sobre 4 venas de 1,25 cm (4,9 cm²): S 65, D 64, Ar 32 cm/s.
## Por qué paro (la propuesta rompe el resto)
Con ella, la suite pequeña (paciente-posible, escenarios, enfermedad, motor) pasa de 0 a 7 fallos: PAP diastólica 12,18 (ref. 6-12; antes 11,54 a los 40 s) → test 59 y 122; TEP con PAM 63 (>60) → 46; derrame al 95 % con IC 1,16 (<1,2) → 38/42; hpcronica área VD/VI 0,55 (<0,6) → 5. Causa: los bajos `rPul` (−10 %) y la AI con presión media más alta (8,1 vs 7,5) mueven la PAP diastólica y el TEP, que estaban calibrados con la AI fuerte. Sin tocar `rPul` (0,095) la PAP diastólica sale 12,4-12,7 y el reflujo vuelve a ~250 mL/s. Un barrido de ~80 combinaciones (Ees, A, B, rVp, tsAur) no halló ninguna con bomba 15-30 %, E/A 1-2, S ≥ D, Ar < S/2 **y** PAP diastólica ≤ 12: S ≥ D y Ar bajo se excluyen con el `rVp` que deja la PAP en rango.
## Decide tú (opciones)
1. Aplicar el parche y recalibrar a la vez TEP/derrame/hpcronica (escenarios.mjs, atlas/vd.mjs y 2 pruebas escalan `rPul` respecto a `BASE.rPul`) — varias horas, riesgo medio.
2. Aplicar solo la suma de la contracción (arregla hipertrofia y dilatada: A 21→116 y 142→182 mL/s) con `rVp`/`rPul` como están, y dejar el doppler en 2,5 cm² (ilustrativo, ya marcado).
3. No tocar el motor; documentar que el flujo de las venas es ~2-3× el real y que las velocidades son ilustrativas.
Fuentes: Lang 2015 p. 24 (15-30 %); resto, fisiología general / ilustrativo. Ninguna frase nueva visible (no toqué la app).
## No comprobado / riesgo
La propuesta se midió con 4 pruebas del motor (no la suite entera ni el navegador); no probé `doppler.mjs` con el área 4,9 cm²; la AD sin medir con la propuesta.

## Segunda tanda: opción 2 (solo la contracción de la AI sumada a la pasiva) — probada, NO aplicada: deja 1 fallo
Parche: `herramientas/f3b-opcion2.patch` (AI Ees 0,70 → 0,50, A 0,20 → 0,15; `rVp` y `rPul` sin tocar; AD sin tocar). `doppler.mjs` sigue en 2,5 cm² («ilustrativo»). El flujo de las venas pulmonares del motor es ~2× el real; recalibración del motor (opción 1) pendiente.
Medido (antes → opción 2, Ees 0,50): normal PAM 86→86, PCP 7,5→7,7, PVC 4,3→4,3, GC 5,01→5,01, E/A 1,24→1,34, bomba 23→22 %. Hipertrofia PCP 23,6→23,6, GC 3,58→3,58, E/A 33→35, bomba 1→1 %. Dilatada PCP 26,7→26,6, GC 3,82→3,81, E/A 6,5→7,0, bomba 5→5 %. TEP GC 2,78→2,78, D 17 mL/s (>0). Hemorragia PCP 3,6→3,6, E/A 0,66→0,67. Derrame PCP 9,7→9,7, E/A 1,09→1,10, bomba 30 %. Onda a normal 14,7→14,0 mmHg; reflujo 593→523 mL/s: **apenas cambia**.
- **No logra el objetivo**: la hipertrofia no recupera la A (19 mL/s). Motivo (medido): su VI rígido llega a 28 mmHg al acabar la E y la AI (24-28 mmHg) ya está igualada a él; lo que empuja la A vuelve a las venas (Ar −461 mL/s). El techo es la PCP de 23,6 mmHg de la hipertrofia (calibrada así), no la contracción de la AI.
- **Fallos según Ees** (4 archivos de motor + atlas): Ees 0,45 → derrame IC 1,19 y prueba de balón (50 vs 53 mmHg); Ees 0,50 → solo «Derrame pericárdico paciente posible»: IC 1,19 (mínimo 1,2; por 0,01); Ees 0,55 → todo verde en esos 4 archivos, pero el atlas 10 Diastólica (restrictivo) sale grado 2 por E/A 1,89 (pide ≥ 2). No hay Ees que pase ambos (derrame pide ≥ ~0,52; restrictivo ≤ ~0,505). No toqué ningún umbral.
- Resto de pruebas (atlas, doppler, geometría, etc.): 164 ok, 0 fallos. `navegador.test.mjs` no terminó en 500 s (no medido).
No comprobado / riesgo: la suite entera nunca terminó de una vez (se partió en dos); AD sin medir con la contracción sumada.
