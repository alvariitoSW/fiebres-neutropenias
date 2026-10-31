# Juicio rápido · maqueta A «La célula que crece» (iones vivos, b4, vuelta 1) · profesor, 30/10/2026

Base: `node autonomo/bloques/b4/herramientas/iones-a.mjs` (salida `/tmp/plan-socialista/b4/salida-a.txt`: TODO EN VERDE a 390 y 360, sin desborde, rótulos ≥8,7 px, 7 topes con sello, apuesta + error + caso de 4 pasos completos, sin errores de consola) + 9 capturas (inicio, realimentar, apuesta, caso, final, tope-asistolia, ecg-hiperK, ecg-calcio a 390; inicio a 360) + código de `autonomo/maquetas/b4-iones-a/` + `pdftotext` de E p. 19, 23, 37, 38, 45.

| Rúbrica §7 | Nota | Por qué (en una línea) |
|---|---|---|
| 1 Primera vista | 8,75 | ✅ Escena entera (plasma, célula, hueso, tubo, Fig. 36.2, 38.1 y ECG) cabe en la primera pantalla; ❌ no hay una frase con la idea central arriba (solo «pulsa un mando o Explícame»), y el monitor de cifras grandes queda debajo del dock. |
| 2 Párrafos | 9,5 | ✅ Nada de muros: guía por pasos, frase viva de 1-2 líneas, Notas y Para profundizar plegados. |
| 3 Resaltado | 8,75 | ✅ Cifras fuera de rango en oro (`leer()`), sellos rojos con título; ❌ dentro del SVG todo pesa igual (solo «Ca 99 %»; falta el 98 % del K⁺ y el «total −300» destacados). |
| 4 Lo que enseña se ve | 8,25 | ✅ Fig. 36.2 viva con el punto que cae de la curva, Fig. 38.1 en tres fracciones, Tubo frente a Plasma (puño +0,8), ECG real del ritmo vivo (T picuda a K⁺ 5,9, se suaviza con gluconato, plano en asistolia); ❌ el mecanismo que da nombre a la opción (los iones **entran** en la célula) es casi invisible: Realimentar mueve 1 partícula (`escena.js` `objetivo()`: `cel = 36 + (kDef+kShift)/12`), sin dirección ni flujo; Heces y Diálisis siempre «—»; hueso inerte. |
| 5 Interactivo que enseña | 9,0 | ✅ Cada mando cambia cifras, escena y frase viva con página (`decir()`), topes con sello, mando apagado y constantes (FC 0 · PA 0/0; 112 · 82/48); ⚠ Realimentar no anima el paso célula↔plasma. |
| 7 Móvil | 9,0 | ✅ Sin desborde ni rótulos <8,7 px a 390 y 360; dock con 4 pestañas y botones de dos filas; ⚠ en Mayéutica la pregunta empuja la escena y el monitor a >1.000 px. |
| 8 Modelo grande | 9,0 | ✅ Un modelo para K⁺, Mg²⁺, Ca²⁺ y fosfato con 3 pacientes; reutiliza motores (abajo). |
| 9 Cita lleva a la app | 9,25 | ✅ `datos.js` `cita()`: cada cita es «p. N · Ver en la ficha» con `data-resaltar="#mr-…"` (mejor que B); ❌ «Lo que te llevas» (`mayeutica.js` `fin()`) sin página ni ficha. |
| 10 Explicación guiada | 9,0 | ✅ 4 pasos por estado (`GUIAS`), cada uno enciende `.luz` sobre piezas del SVG (`pagina.js` `guia()`) con origen y cita; ⚠ Rufino paso 1 pide «pulsa Furosemida» pero la guía no lo ejecuta. |
| 11 Fuentes en lista | 9,0 | ✅ `CITA`/`FICHAS`/`NOTAS` con página; las 3 discrepancias (4,5/4,3; 65 %/50 %; 1,7/1,15) sin elegir. |
| 12 Megaproyecto | 7,75 | ❌ Es literalmente «un esquema de cajas» (REGLAS §7.12): rectángulos rotulados Plasma/Célula/Hueso/Tubo con partículas al azar; dos cajas muertas; sin mapa de crecimiento (qué añadirán Nefrología, Libro Azul, Manual UMI). |
| 6 y 13 | — | No aplican a una maqueta de modelo. |

**Educación**: (1) ¿se ve el mecanismo? **8,0** (la curva, el tubo y el ECG sí; el «entra en la célula» no se ve: cambia 1 partícula de 11 y nada se mueve de un cajón a otro) · (2) ¿se entiende a 390? **9,0** (todo legible; «Toca una pieza: su nombre» ayuda; la leyenda queda debajo del dock) · (3) ¿admite apuesta, error y caso? **9,25** (apuesta con cifras tapadas y cada falsa dice qué le pasaría al paciente; error 2 de 3 con cita; caso de 4 pasos con giro en el paso 2 —disnea por fosfato— y el modelo aplica la conducta correcta; «Lo que te llevas» presente pero sin citas).

**Motores de la app**: ✅ `MOTOR.crear/voltaje` + `aplicarK` (`ecg.js`, sin `pagina.js` del ritmo), ✅ `svgParticula`/`leyendaParticulas` (`js/core/particulas.js`), ✅ `crearTope` (`js/core/tope.js`) con sello, aviso, deshabilitado y cita, ✅ `verFrase/seguirFrase` (`js/core/frase-vista.js`). Nada copiado de `potasio-escena.js`.

**Pacientes y cifras** (comprobado en E): 200-400 / 100-200 mEq por mEq/L (p. 19) ✅ · 20 mEq/h y cava superior (p. 23) ✅ · 6 g en 3 h y 2 g torsade (p. 37) ✅ · retención ≤12 mmol (≤50 %) / >19 mmol (>80 %) (p. 38) ✅ · bolo 200 mg (p. 45) ✅. Lo ilustrativo está declarado en `NOTAS`, `frases-a.md` y en cada frase; ninguna cifra sin origen. Sin graves de fuente.
- ❌ **Paciente incoherente** (REGLAS §1.12, grave): `pagina.js` `lee()` solo mueve FC/PA con los sellos. Valentín (10 concentrados, pH 7,22, Ca 0,84, K⁺ 5,9) marca PA 120/75 · FC 75; Damián con K⁺ 1,6 (Realimentar ×2) y Rufino con K⁺ 1,4 siguen a 75 · 120/75; el caso dice «respira peor» y el monitor no tiene FR ni SpO₂.
- ⚠ Caso paso 1: fosfato 0,9 «sin síntomas» mientras el sello «Fosfato grave» ya está puesto en la escena (adelanta el giro del paso 2). ⚠ Rufino: Mg²⁺ 2 g da 2,0 y a la hora 1,1 (pico/caída: ilustrativo, declarado).

**Veredicto**: media ≈ 8,85; **no llega a la meta (9,5) y dos puntos quedan por debajo de 8,75** (§7.4 y §7.12). Comparada con B, cita mejor (§7.9) y explica mejor cada estado (§7.10), pero su idea pedagógica («la célula que crece») es la que menos se ve: la escena es un esquema de cajas y el movimiento a la célula no se nota.

**Arreglos para la vuelta 2** (por lo que más sube la nota):
1. `escena.js` `objetivo()` + `sync()`: que Realimentar mueva 4-6 partículas de K⁺/fosfato/Mg²⁺ de Plasma a Célula con trayecto visible (flecha o deslizamiento) y Furosemida las saque a Orina; que el Tubo se dibuje como tubo y la célula con membrana y bomba, no como rectángulos (método «Anatomy»). Sube §7.4, §7.12 y Educación 1.
2. `pagina.js` `lee()`: FC/PA/FR por paciente y por cifra (Valentín 110 · 98/60; K⁺ <2 o >6,5 con FC y aviso; FR en el caso del fosfato), con origen «ilustrativo» en `NOTAS`. Quita el paciente imposible.
3. `escena.js`: quitar o alimentar Heces y Diálisis (diálisis con la hiperK, E p. 27) y dar vida al Hueso (Mg 53 % rotulado, Tabla 37.1). Sube §7.12.
4. `datos.js`: añadir un `mapaCrecimiento` (Nefrología: potasio vivo; Libro Azul; Manual UMI) y una frase-idea arriba de la escena (`b4-iones-a.html`, bajo `#pac-nombre`). Sube §7.12 y §7.1.
5. `mayeutica.js` `fin()`: cada punto de «Lo que te llevas» con `cita()` (k20, kcl, p50, mgret). Sube §7.9.
6. `escena.js` `pintar()`: resaltar en el SVG «98 %» del K⁺ y el «total −300» con `.hl-azul`/`.hl-rojo`. Sube §7.3.
7. `pagina.js` `guia()`: en los pasos que dicen «pulsa X», ejecutar el mando (o un botón «Hazlo» dentro de la guía). `datos.js` `CASO.pasos[0]`: fosfato 1,2 (no 0,9) para que el giro llegue en el paso 2.

**No comprobado / riesgo**: la escena de Rufino, la de Mg²⁺ alto (avisos 4/5/10) y los botones de albúmina/pH solo por el programa de prueba, no con los ojos; la «caída a los 15 min» del Mg (p. 37-38) y el rango 1,4-2,0 mEq/L (Tabla 37.2) no los releí; `data-resaltar` no tiene manejador en la maqueta (lo da la app); con K⁺ >8,6 `aplicarK` se satura y el ECG no cambia más (el sello «no fisiológica» lo cubre a 9,0).
