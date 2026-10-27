# Shock v3 · informe del constructor (26/10/2026) · rama `auto/b3-shock` (70acb9d)

**Archivos**: `autonomo/maquetas/b3-shock/{soporte.mjs,datos.js,pagina.js,canales.js,escena.css}`, `b3-shock.html`, `comun/dock.js` (nueva), `comun/monitor.js`, `comun/dibujo-iso.js`, `autonomo/bloques/b3/pausa/constructor-shock-apunte.md`. Pruebas y capturas: `/tmp/plan-socialista/b3/shock/` (`mide.mjs` arnés node, `prueba.mjs` Playwright 390/360, `capturas/`).

## Juicio, punto a punto
1. ✅ Aurelio: `viDiast 0,7 · g 0,9 · volemia −1150` → PAM 66, IC 1,7, PCP 15, PVC 2; +250 → PCP 18 (PVC 2-3); +500 → 22 (PVC 3-4). PVC 6-10 no sale sin inflar al VD (Marino, Tabla 8.1: PVC normal 0-5); con PCP 22 ya no es 1. G2: bomba 5,4 de 5,5, IC 1,9 → 2,9, PCP 15 → 3: enseña la lección.
2. ✅ Hemorragia: se nombra por FC y PA (`claseClinica`, Tabla 15.1) y hay estado «Hemorragia repuesta» tras volumen/sangre; simpático de la hemorragia: clase II FC 97, III FC 135 / PA 78/63, IV FC 165 / PAM 56.
3. ✅ Bombas con poscarga (`factorPoscarga`) y succión más ancha: ECMO 6 + Impella → PAM 90-95, total 6,6, IC 3,6; ECMO desde 1 L/min; PCP con tope del edema (`K_EDEMA 1,5`: ~31-34). G3 con la volemia entera: aórtica 6/6 → 0/6, corazón 0,5 → 0, edema 177 → 287 (la PCP queda plana en el tope: el texto lo dice).
4. ✅ TEP 45/28 (g 0,85) · 37/23 (g 1); Consuelo a g 0,95 (IC ≥ 1,2). Sepsis 73/34 (pulso 39, como el sano; antes 25).
5. ✅ Era la oscilación lenta de la succión del Impella sobre un VI seco; con el VI lleno y la succión ancha la FC sigue a la PAM (5,5: PAM 86 / FC 57; 2,5: PAM 53 / FC 124).
6. ✅ E5 `explica`. 7. ✅ Canal PAP a 36 px y, en la pieza común, la 3.ª línea va en la etiqueta si el canal < 44 px («PAP · PCP 2»).
8. ✅ Al cambiar la gravedad el laboratorio vuelve a la hora 0 (`reconstruir`); el reloj con PAM < 65 sube el lactato 0,2 mmol/L/h (Amparo 4 → 7,6 a las 18 h, rotulado ilustrativo); el lactato séptico sigue a g² (Amparo g 0: lactato 1).
9. ✅ SpO₂ = mezcla (VI + Impella con la saturación del pulmón, ECMO al 98 %): caso h18 87 → 95; nota «La fuente no lo dice» (dónde se mide, el arlequín).
10. ✅ `comun/dock.js`: asa «Mandos», se pliega al tocar la escena o elegir aparato (102-119 px plegado; 221 desplegado, antes 260); elegir aparato desplaza a la escena; «Guía».
11. ✅ «Compruébalo»: tabla antes → después de las 3-5 cifras que nombra `mira` + botón «Ver el monitor».
12. ✅ Estados «Sin shock» (sepsis IRVS ≥ 25 y PAM ≥ 65; tapón |PVC − PCP| > 3; cardio PAM ≥ 65 e IC ≥ 2,2). ⏳ IRVS 38-39 de techo: está en el barorreflejo del motor de la app (`motor.mjs`), fuera de la maqueta.
13. ✅ `.org` común (una línea, con puntos). ⏳ Balón generoso, despiece del balón sin volumen y piezas sueltas del despiece del ECMO: sin tocar.
Común: ✅ monitor (3.ª línea), ✅ `.org`, ✅ `dock.js`, ✅ rótulos SVG mínimos 8 px a 360 (medido). `b3-ritmo` y `b3-receptor` abren con 0 errores y 0 desborde (su `.frase-txt .org { white-space: normal }` sigue pisando la regla común: cada dueño la quita si quiere).

## Cambios en `comun/`
- `monitor.js`: solo `pintarCifras()` (si `alto < 44` y hay `obj`, va en la línea de la etiqueta) y 2 reglas CSS (`.cifra .et { min-width:0 }`, `.cifra .et .obj`). API intacta; no toqué `crearMonitor` ni los canales.
- `dibujo-iso.js`: una regla `.org` al principio de `ISO_CSS`. Nada más.
- `dock.js`: nueva (`crearDock(dock, { plegables, alMedir })`); solo la usa el shock.

## Lista de comprobación
✅ cifras con origen (motor/ficha/ilustrativo) · ✅ citas a la ficha + PDF · ✅ Mayéutica (sin respuestas en el HTML, predice antes de ver, 0-2 errores) · ✅ pacientes de la lista · ✅ nada interno a la vista · ✅ rótulos ≥ 7,5 px · ✅ 0 errores / 0 desborde a 390 y 360 (también tras contestar) · ✅ capturas miradas (primera pantalla, balón, comprobación, final del caso) · ✅ commit + push · n/a `?v=` y `jueces.mjs` (maqueta, fuera de la app).

## Frases nuevas (para el auditor)
- «Clase II FC >100, III >120 con PA baja, IV >140» → Tabla 15.1, p. 22. El umbral PAS < 90 / < 70: fisiología general (dicho en el código).
- «La hemorragia dispara el simpático más allá del barorreflejo» → dirección de p. 21-22 (respuestas compensadoras); magnitud ilustrativa.
- «La sangre repone hematíes y volumen; el cristaloide diluye la Hb y 3/4 se van al intersticio» → p. 11 y p. 23.
- «Una bomba centrífuga da menos flujo cuanta más presión vence» → fisiología general (la fuente da el máximo 5-6 L/min, p. 48, no la curva).
- «La SpO₂ con ECMO es la mezcla; el brazo derecho puede leer la del pulmón» → fisiología general, marcada «la fuente no lo dice».
- «El lactato sigue subiendo con la hipoperfusión mantenida» → Tabla 15.1 (acidosis láctica con el tiempo), p. 22; ritmo ilustrativo.
- «En la sepsis el lactato sube aunque sobre O₂» → p. 59. «El shock lo define la hipoperfusión, no el diagnóstico» → p. 18 y Tabla 14.5.
- «La pulmonar late ≈45/20 en el TEP» / «el pulso amplio con diastólica baja en la sepsis» → p. 57 (sepsis); el TEP, fisiología general.

## No comprobado / riesgo
No se probó «reducir movimiento» ni Safari; las cifras del modelo se asentaron 8-22 s por mando (en el navegador el bucle sigue y pueden moverse ±2). El IRVS de techo (38-39) sigue confesado en el monitor. Mateo tras 2 L y 1 h vuelve a «clase III» porque el modelo le deja FC 124 y PAS 90 (coherente con la tabla, pero puede chocar).
