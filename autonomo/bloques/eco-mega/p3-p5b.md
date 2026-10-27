# P3 · P5b — chorro de la insuficiencia mitral en el Doppler (color y espectral)

**Archivos**: `doppler.mjs` (fuente `regMitral`, `velRegMitral`, rama en `curvaLatido`, `fuenteEnMuestra` y `medidasLatido`), `corazon-geo.mjs` (`flujo.coaptacionMitral`), `formas.mjs` (`mezclarFlujo` lo conserva: sin esto el chorro no salía con las formas precalculadas), `simulador.mjs` (`eroaMitral` en `datosFlujo`, panel de resultado, preset «Chorro de IM (A4C)», escala ±250), `eco.html` (el botón), prueba en `pruebas/doppler.test.mjs` (+4).

**Cómo es**
- Existe en `valvulas` solo con `eroaMitral` > 0, la mitral cerrada (`!vMit`) y `qMitReg` > 0 (sístole). Con EROA 0 no hay fuente.
- Velocidad: v = `qMitReg` / EROA = 50·√ΔP cm/s (la misma Q del motor; Bernoulli √ΔP/2 m/s). Orificio: círculo de área = EROA (a = 2,8 mm con 0,25 cm²). Forma aguas abajo y convergencia aguas arriba: las de las demás válvulas (`velocidad`), sin código nuevo.
- Origen: eje del anillo mitral a la profundidad de la coaptación (baja con el tenting de P5a). Dirección: hacia el centro de la AI (central, IM funcional).
- Color: se ve en el A4C de la dilatada en sístole: chorro azul (se aleja) con mosaico de aliasing en el origen y rojo de convergencia en el lado del VI. Espectral: sístole negativa hasta el borde de la escala; diástole, E y A pequeñas.

| Dilatada (defecto, EROA 0,25) | Valor |
|---|---|
| v en el orificio, pico (cm/s) | 399-408 (ΔP VI−AI ≈ 64-67 mmHg) |
| ∫ v·EROA dt del latido | = `vReg` del motor (±8 %) |

**Pruebas**: `doppler.test.mjs` 12/12: normal sin chorro y AI quieta en sístole; dilatada con 4-6 m/s, Bernoulli ±5 %, caudal ≈ `vRegMitral`, hacia la AI; diástole sin chorro; muestra en el chorro negativa y reconocida como `regMitral`; `mezclarFlujo` lo conserva. Suite entera: 442 pruebas, 431 ✅, 0 ❌, 11 `todo`/hueco previos.
**Capturas**: `/tmp/plan-socialista/eco-mega/capturas/p5b-color-0…5.png` (sístole: 0-2; 1 es la mejor), `p5b-espectral.png`, `p5b-espectral-b.png`. 390 px, sin errores de consola ni desborde.

**Frases nuevas (con fuente)**: «Q = EROA · 50 · √ΔP; v = √ΔP / 2 m/s; ΔP ≈ 4v²» = motor.mjs + Bernoulli (fisiología general, ya en el motor). «Chorro sistólico hacia la AI, se aleja de la sonda» = fisiología general. Ninguna cifra clínica nueva.

**Huecos**: la vena contracta no se mide (no es barata: haría falta el ancho del chorro en el plano). Zoghbi: leve <0,3 cm, grave ≥0,7 cm (`fuente-p3.md`); queda anotada, no mostrada. Sin enlace a Zoghbi en el panel del chorro.

**No comprobado / riesgo**: la v en el orificio sale 3,99-4,08 m/s (no ~5) porque ΔP VI−AI del modelo es 64-67 mmHg, no 100 (PAS 93 y PCP 27); la prueba pide ≥4 m/s y queda justa. El origen (eje del anillo, no la línea de cierre, que se desplaza ~4 mm hacia atrás y quedaba a 3,6 mm del plano A4C) es ilustrativo. El chorro es fino (Ø 5,6 mm), sin entrainment. Sin `?v=`; no probado en 360 px ni en otras vistas (A2C, PLAX).
