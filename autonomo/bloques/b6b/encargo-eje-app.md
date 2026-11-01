# Encargo · eje hormonal en la app (b6b, sesión 2; REGLAS §4.7 «llevar una maqueta a la app son dos encargos»)

## Pieza 1 · El modelo con su prueba (constructor sonnet, ≤90 pasos / 2,0 M)
- **De**: la maqueta B aprobada (`autonomo/maquetas/b6b-eje-b.html` + carpeta `b6b-eje-b/`), 9,5.
- **A**: `js/modules/libros/eje-vivo/` (index.js, modelo.js, dibujo.js, pagina.js, eje-vivo.html; cada archivo ≤700
  líneas) + `js/data/eje-vivo-data.js` (pacientes, estados, topes con `pdf` y página). Patrón: `termostato-vivo/` y su
  registro (`js/modules/libros/index.js`: import, `MODELOS`, vista `eje-vivo-view`, `arrancar('eje', …)`,
  `modelosVivos.ejeVivo`; `data-eje-vivo="<estado>"` en el listener de `home/index.js` y `core/mayeutica.js` si hace falta,
  igual que `termostatoVivo`; registro en `index.html` como el termostato). Motion con `cargarMotion()` (en la app sí
  funciona). Silueta de `js/core/silueta.js`, topes con `js/core/tope.js`, frase con `js/core/frase-vista.js`.
- **Lista R2** (`autonomo/bloques/b6b/lista-r2-eje.md`): se tacha punto por punto en el informe (✅/❌ con línea). Los
  puntos 11 (apuestas, «encuentra el error», casos) son de la pieza 2: aquí solo los presets de pacientes y la guía.
- **Enlaces desde las fichas**: botón `data-eje-vivo` en `mu-suprarrenal`, `mu-tiroides` y `mu-hipotiroidismo`
  (`js/modules/libros/marino-nutricion.html`), junto al texto que cuenta ese estado, con el paciente que toca.
- **Prueba**: `autonomo/pruebas/eje-vivo.mjs` para `jueces --modelo eje-vivo`, con **barrido de extremos** (REGLAS
  §4.16): cada mando en mínimo, medio y máximo en cada paciente que lo usa → PA, FC, T, Na⁺, glucosa, lactato,
  cortisol, TSH y T4 libre de un paciente posible (o sello); cambio de paciente sin sellos residuales (los 7×6 pares);
  desborde y solapes de texto a 390 y 360 px. Si un sello propio necesita ajuste, va a `autonomo/jueces-topes.mjs`.
- **Cifras**: las de la maqueta (ya auditadas 3 veces, 0 graves) y las de `cobertura-anexo.md` §2 «Eje». Nada nuevo sin
  fuente. Versión: `node autonomo/version.mjs 20261101-97` al acabar.
- **Lo que NO**: copiar la maqueta tal cual sin pasar al patrón de la app; un mando sin tope; nombres internos a la
  vista; rótulos <8 px; texto que se pise; el bolo IV de propranolol.

## Correcciones de la revisión (`revision-encargo-s2.md`; mandan sobre lo de arriba)
- **Pieza 1 partida**: **1a** (≤55 pasos / 1,1 M): `js/data/eje-vivo-data.js` (7 pacientes con claves `toribio`,
  `bibiana`, `sinforoso`, `lucrecia`, `obdulia`, `policarpo`, `fulgencio`; estados `data-eje-vivo="<clave>[:paso]"`),
  `modelo.js`, `dibujo.js` (silueta con `ORGANOS`/`posicion` de `js/core/silueta.js`, no a mano), `eje-vivo.html`,
  `index.js` mínimo que abre el paciente, registro (index.html: import map y `eje-vivo-view`; libros/index.js l. 41,
  79, 140, 241, 268; home/index.js no se toca) y los **7 botones** de la revisión en `marino-nutricion.html`.
  **1b** (≤55 pasos / 0,9 M): `pagina.js` (dock ≤1/3 de pantalla como el termostato, mandos, guía, «Ver el mapa», Fig.
  51.1 en plegable con ruta de la app, «Ver en la ficha» con data-especialidad/view/panel/tab y mapa id→pestaña),
  `window.__eje` (leer/topes/ir/ESTADOS/modoPrueba, como `window.__tmv`), prueba `autonomo/pruebas/eje-vivo.mjs` con
  barrido de extremos, **42 pares** de cambio de paciente y aserciones de las cifras de R2 7 y 8, y entradas en
  `jueces-forma.mjs`, `jueces-movil.mjs` y `jueces-topes.mjs`.
- Topes sin página (suero 3 L, NA 1,0, cifra imposible): con su origen (`fisiología general`), nunca una página inventada.

## Pieza 2 · Su Mayéutica (constructor sonnet, ≤50 pasos / 1,2 M)
- `js/modules/libros/eje-vivo/mayeutica.js` + `js/data/eje-vivo-mayeutica.js` sobre `js/core/mayeutica-motor.js`
  (patrón `termostato-vivo/mayeutica.js` y su banco). Lista R2 punto 11 entera (2 apuestas, 2 «encuentra el error», 2
  casos con giro) + guía por paciente. Prueba `autonomo/pruebas/eje-vivo-mayeutica.mjs`; banco en `jueces-forma`.
