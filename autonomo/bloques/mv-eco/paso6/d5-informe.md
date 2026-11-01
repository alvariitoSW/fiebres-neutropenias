# D5 · Paredes de las aurículas (dibujo nuevo)

**Causa medida** (no tocado nada fuera de `ecografia.mjs` y `js/data/eco-tejidos.js`): la tabla da a la aurícula 2,6 mm / -5 dB
(`eco-tejidos.js:10`, `ecografia.mjs:294`), pero con «paredes reales» activo (`m.paredes`, `ecografia.mjs` ~l.806) la rama
AI/AD/Orejuela la adelgaza (AD al 30 % = 0,8 mm y -15 dB; AI al 60 % = 1,6 mm y -8 dB) y la traza como una sola línea lisa
(`trazar`, sin `variar`). Es esa rama la fuente del «alambre»; la de la tabla es de grosor correcto. Causa en archivos propios, no en motor/geo.

**Arreglo** (solo con dibujo nuevo; el de hoy sigue por la rama antigua): nueva constante `PARED_AURICULAR_NUEVO`
(`eco-tejidos.js`: 2,5 mm, -4 dB·`paredes` sobre la aurícula = -9 dB en total, es decir, más tenue que el VI en -7 dB, moteado ±4 dB; todo
**ilustrativo**: Lang 2015 y Mitchell 2019 no dan el grosor de la pared auricular). En `trazar`, `variar === 3` aplica el mismo moteado
de hash que el pericardio. Base V no cambia.

**Capturas** A4C 390 px, en `autonomo/bloques/mv-eco/paso6/d5-capturas/`: `antes-{tep,normal,hp}-a4c.png` y `{tep,normal,hp}-a4c.png` (después).
En el TEP la pared de la AD pasa de un hilo fino casi invisible a una banda gris continua y la de la AI se engrosa; sin errores de consola.

**Pruebas:** `ecografia`, `instantanea-dibujo`, `torax`: 37 pasan, 0 fallan. `jueces --eco`: sin errores de consola (solo el ❌ de `?v=` esperado).

**No comprobado / riesgo:** el moteado se nota poco a 390 px (la banda es de ~2,5 mm = pocos píxeles); no he medido la cifra de brillo en píxeles.
No miré las demás vistas (PSAX, subcostal) ni otros escenarios; la Orejuela y la AD en subcostal ahora son más gruesas y podrían tapar el borde
del tabique. No cambié la versión.
