# b5 · paso 3 · Encargo común: hepatocito B y termostato B a la app (director, 01/11)

Lee el paquete `autonomo/bloques/b5/encargo.md` (§2 fuente, §5 lo que NO quiero, §5b reglas que más fallan, §7-8),
`autonomo/bloques/b5/eleccion.md` y `pendiente-app.md`. De `autonomo/REGLAS.md`, solo §1.14, §4.6, §4.8 (R1, R2) y §4.16.

## Qué se construye (dos encargos por modelo, REGLAS §4.7)
1. **Modelo + prueba** (sonnet ≤90 pasos / 2,0 M): la maqueta elegida, tal cual se aprobó (9,45 / 9,5), llevada a la app.
   - Maqueta: `autonomo/maquetas/b5-<m>-b.html` + `autonomo/maquetas/b5-<m>-b/` (fuente de verdad; NO se toca).
   - Destino: `js/modules/libros/<clave>/` (≤700 líneas por archivo) + datos puros en `js/data/<clave>-data.js`.
   - **Molde** (copiar estructura, no tocar): `js/modules/libros/iones-vivos/` (+ `js/data/iones-vivos-data.js`,
     `autonomo/pruebas/iones-vivos.mjs`) y cómo está registrado (grep `iones` en `js/modules/libros/index.js`,
     `index.html`, `marino-portada.html`, `autonomo/jueces-{forma,movil,topes}.mjs`).
   - Registro **solo en tus huecos** `[HUECO <m>: …]` (ya puestos; sustitúyelos por tus líneas): `libros/index.js`
     (import, vista, arrancar, modelosVivos; `MODELOS` ya incluye tu clave), `index.html` (div `data-include`),
     `marino-portada.html` (tarjeta en el grupo «Hígado, abdomen y temperatura»), jueces-forma/movil/topes.
   - Botones `data-<clave>="<estado>"` (`.especialidad-link`) en las fichas de `js/modules/libros/marino-abdomen.html`
     que tu modelo explica (dentro de cada ficha, junto al texto que muestra; ≤6 botones). No toques otras fichas.
   - Lista R2 del profesor (`autonomo/bloques/b5/lista-r2-<m>.md`): táchala entera en tu entrega.
   - **Prueba** `autonomo/pruebas/<clave>.mjs` para `jueces --modelo <clave>` (molde `iones-vivos.mjs`), con **barrido
     de extremos** (§4.16): cada mando en mínimo, medio y máximo, y cada combinación de preset × mando en extremo →
     cifras de paciente posible (PA, FC, T, amonio…), sello en cada tope, desborde a 390 y 360, rótulos ≥8 px y
     **solape de `<text>` del SVG** (cajas que se cortan = fallo; lo pidió el parte de maquetas).
   - Cierra servidores por número de proceso. Copia de seguridad (commit en tu rama) cada vez que avances.
2. **Mayéutica del modelo** (sonnet ≤50 pasos / 1,2 M; encargo aparte, después): `crearMayeuticaModelo` de
   `js/core/mayeutica-motor.js`, molde `js/modules/libros/receptor-vivo/pagina.js`. NO en esta tanda.

## Lo que NO toques
Archivos del `b4` (`iones-vivos*`, `marino-renal.html`, `marino-acidobase*`), del `b6a` (cráneo, placa,
`marino-neuro*`), la eco (`js/modules/eco/`), el pulmón (`pulmon-vivo/`), `js/core/` salvo `particulas.js` (solo el
hepatocito, añadiendo NH₃/urea/glutamina sin cambiar lo que hay), ni los huecos del otro modelo. No ejecutes
`autonomo/version.mjs` (lo hace el director al juntar). `--ficha` y la suite larga, no: solo `jueces --modelo <clave>`.

## «Hecho» del paso 3
`jueces --modelo <clave> --forma` en verde; prueba propia con barrido sin fallos; lista R2 tachada; 0 errores de
consola; profesor ≥8,75 (meta 9,5 en modelo vivo nuevo) y auditor sin graves.
