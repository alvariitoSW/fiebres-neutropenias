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

## Precisiones tras la revisión del encargo (Explore, 01/11)
- **Nombres**: `<m>` = `hepatocito` | `termostato`; `<clave>` = `<m>-vivo` (carpeta `js/modules/libros/<clave>/`,
  prueba `autonomo/pruebas/<clave>.mjs`, datos `js/data/<clave>-data.js`); vista `hepatocitoVivo` | `termostatoVivo`
  (ya en `MODELOS`); atributo `data-hepatocito-vivo` | `data-termostato-vivo` (sale solo de la clave de `modelosVivos`;
  `home/index.js` no se toca). Prefijo de ids propio y único: `hpv-` | `tmv-` (renombra `#hep-svg` y demás; el juez
  mira ids repetidos). Gancho de prueba `window.__hpv` | `window.__tmv`.
- **Archivos**: fragmento `<clave>.html` (`data-include`, sin `<html>`; molde `iones-vivos.html`) e `index.js` con
  `init()` que devuelve `{ abrir(estado, origen) }` (molde `iones-vivos/index.js`).
- **Huecos que faltaban**: `vivos: [ … ]` de `marinoAbdomen` en `libros/index.js` (pon el id de tu tarjeta,
  `hpv-menu-libros` | `tmv-menu-libros`). La tarjeta lleva `data-lib-corto`, `data-lib-caps`, `data-especialidad="libros"`,
  `data-view="<vista>"` y `data-<clave>=""` (vacío, obligatorio). Entradas de jueces: forma → `raiz`, `enlace`, `clave`,
  `modo: { explorar }` (sin Mayéutica aún) y `estados` (todos los presets/estados); movil → selector de la frase viva;
  topes → `noPulsar`.
- **Botones en las fichas**: `class="especialidad-link" data-especialidad="libros" data-view="<vista>"
  data-<clave>="<estado>"`, ≤6, en las fichas que diga la lista R2.
- **Rutas**: imports `../../../js/core/…` → `../../../core/…`; datos → `../../../data/<clave>-data.js`; `PDF` e `IMG`
  sin `../../` (`'docs/…pdf'`, `'js/modules/libros/img/…'`, como `iones-vivos-data.js`). Fuera el `<script>` de Motion
  y la `motionAqui()` del termostato: solo `cargarMotion()` de `core/motion.js`.
- **Partículas (solo hepatocito)**: NH₃ y glutamina se dan de alta en `js/data/formas-iones.js` (`FORMAS_IONES`; `urea`
  ya existe; no cambies lo que hay) y el dibujo pasa a `svgParticula()`/`leyendaParticulas()` de `js/core/particulas.js`
  (no se toca `particulas.js`). El termostato ya las usa.
- **Molde de la prueba**: las de la maqueta (`autonomo/bloques/b5/herramientas/<m>-b.mjs` y `termostato-b-desborde.mjs`)
  sobre la app, con el formato de `iones-vivos.mjs` para `--modelo`. El **solape de `<text>`** (getBBox) debe cazar
  primero los 3 roces conocidos del hepatocito (Astrocito/«Otras vías», «glutamina + agua», línea del TIPS) y luego
  quedar a 0. Rangos de paciente posible: los de la lista R2 (si falta uno: PA 50-220/30-130, FC 30-200, T 22-44 °C,
  amonio 0-≥300 µmol/L con «≥» al tope).
- **Versión**: `jueces` exige el mapa al día. Ejecuta `node autonomo/version.mjs 20261101-90` (hepatocito) o
  `20261101-91` (termostato) en tu carpeta y súbelo; el conflicto del mapa al juntar lo resuelve el director regenerándolo.
- La maqueta no se toca; los arreglos (roces, pendientes) se hacen en el destino. Mantén lo que pidió Justicia en la
  elección (`estado.edema` manda en el paso 4; chips `ilustrativo`/«opinión del autor» en 60-150 y 120; en el
  termostato, `ilustrativo` en FC/CK por temperatura, 4,5 °C/h y tope 42 °C con su fuente).
