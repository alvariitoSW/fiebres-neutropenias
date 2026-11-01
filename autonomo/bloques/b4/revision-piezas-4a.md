# Revisión de las piezas del 4A (Explore sonnet, 01/11) · resumen del director
- `pendrina`: ya existe como lupa del ácido-base vivo (`abv-c-pend`, test `ab-11`). En la nefrona no. **Decisión (Hacienda)**: no se duplica en la nefrona; la ficha 5 enlaza a la lupa que ya hay (un mecanismo, un modelo).
- `acetazolamida`: ya existe (`CAUSAS.acetazol`, test `ab-13`): 0 M, solo enlaces.
- `mg-bajo`: el ácido-base no tiene Mg; va a iones vivos (grupo 4D, con el acople Mg→K).
- `caa` 0,5 M (anión `ceto` ya existe) · `hcl` 0,5 M (tipo `farmaco` ya existe) · `titulacion` 1,2 M (dibujo nuevo, Fig. 32.2).
- `acidobase-vivo.js` tiene 1880 líneas (>700): lo nuevo, en archivo aparte (`acidobase-vivo-b4.js`) con ganchos mínimos.
- Cifras del motor (Ec. 31.2) ≠ anexo: Sofía HCO₃ 8 / PaCO₂ 22 → **pH 7,18** (no 7,12); Rufino HCO₃ 42 / PaCO₂ 50 → **pH 7,54** (no 7,52). Los casos usan las del monitor.
- Estudiar no existe aún en ninguna ficha `mr-*`: hay que enganchar `MAYEUTICA_B4` (`js/data/mayeutica/b4.js` + `b4-gasometria.js`) en el módulo de Marino renal y en `agua-viva.js` l.439, como `b3.js`.
- Prueba existente: `autonomo/pruebas/acidobase-vivo.mjs` (198 l.).
