# Informe · eje vivo, pieza 1a (b6b)
Archivos nuevos: `js/data/eje-vivo-data.js` (88 l.), `js/modules/libros/eje-vivo/{modelo.js 130, dibujo.js 107, index.js 61, eje-vivo.html 24}`, `autonomo/bloques/b6b/herramientas/eje-1a.mjs`.
Cambiados: `js/modules/libros/index.js` (import, MODELOS, vista, arrancar, modelosVivos), `index.html` (eje-vivo-view + versión 20261101-97 y mapa), `css/components.css` (+32 l., `#eje-raiz`), `marino-nutricion.html` (7 botones `data-eje-vivo`). `home/index.js` sin tocar.
## Lista R2 (✅ hecho en 1a · ❌ queda para 1b/2)
1 ✅ 7 chips y guías en datos (3-5 pasos con cita doble); ✅ `:paso` abre ese paso y su foco; ❌ guía con botones «haz» (1b)
2 ✅ escena 390×300: silueta de `core/silueta.js` con ORGANOS (cuello bajo la boca, riñón), lupas, suero/NA/termómetro, eje con flechas, bloqueos, externos, freno discontinuo, glándula que encoge; ✅ Motion (`animarEje`, estado final con reducir movimiento)
3 ✅ mapa Tabla 51.2 y barra de cortisol codificados en `dibujo.js`; ❌ botón «Ver el mapa» (1b)
4 ✅ monitor (PA, PAM, FC, ritmo, T, Na, glucosa, lactato, NA, día); ❌ «?» en apuesta, sellos bajo el monitor (1b)
5 ❌ dock y mandos (1b) · 6 ✅ topes con página/origen en `modelo.js` `topes()`; ❌ mostrarlos con `crearTope` y apagar mandos (1b)
7-8 ✅ física del reloj y PAM en `modelo.js` (copiada de la maqueta); ❌ aserciones propias (1b)
9 ❌ 42 pares (1b) · 10 ❌ frase viva (1b) · 11 ❌ pieza 2 · 12 ✅ ruta Fig. 51.1 y NOTAS/FUENTES/PROFUNDIZAR en datos; ❌ plegables (1b)
13 ✅ silueta, Motion; ❌ tope y frase-vista (1b) · 14 ✅ `eje-1a.mjs` (7 pacientes × 390/360, consola limpia, 7 botones)
## Jueces
`--ficha …mu-suprarrenal`: todo verde (ids, desborde, imágenes, nombres internos, móvil 390/360, caché, versión). Un ❌ ajeno: «Forma · termostato vivo: la buena es la más larga en 7 de 19» (ya estaba; no es del eje).
## Notas
Cifras y notas de la maqueta; «maqueta» cambiada por «modelo» en los textos visibles. Cifras sin página: origen `fisiología general`. «Ver en la ficha» con data-especialidad/view/panel/tab y mapa id→pestaña (`TAB_FICHA`).
## No comprobado / riesgo
Sin `window.__eje`, sin prueba de extremos ni jueces-forma/movil/topes (1b). `topes()` existe pero no se pinta aún. Silueta tumbada algo apretada junto a la lupa del cuello (captura 390 px); revisar en 1b.
