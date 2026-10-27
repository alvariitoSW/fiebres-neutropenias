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
