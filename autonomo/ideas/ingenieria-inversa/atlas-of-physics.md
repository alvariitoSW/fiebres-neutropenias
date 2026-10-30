# Atlas of Physics (ingeniería inversa, 30/10/2026)

B-042, pedido por el usuario el 29/10: «si nos puede servir para explicar ecuaciones y fórmulas físicas y matemáticas
médicas de manera más sencilla». Informe-propuesta para Educación: https://claude.ai/artifact/GxMeNNH8AV8ReEvUVkTAtH
Solo ideas: nada de su código, textos ni figuras en el repositorio (CLAUDE.md §7.9). Marcas: **visto** (dónde),
**deducido**, **no visto**.

## Qué es
- https://atlas-of-physics.vercel.app/ · repositorio público `nathanliow/atlas-of-physics` · **licencia MIT**
  (Nathan Liow, 2026; visto en `LICENSE`). Inglés. Para el examen AP Physics 1 y C (EE. UU.).
- 15 capítulos (mecánica 1-8, electricidad y magnetismo 9-15), 9-15 páginas cada uno (visto en la portada).
- Cada capítulo: una escena 3D (Three.js 0.186.1 desde `cdn.jsdelivr.net`) dibujada como esquema de libro. Bajar pasa
  de página y mueve la cámara; pasar el dedo resalta; tocar «desmonta» la pieza (visto en `engine/book.js` y README).

## Cómo está hecho (visto en su código, leído en memoria; no está minificado ni trae mapas)
- Por capítulo: `model.js` (funciones puras, SI: «every motion, arrow length and number on the page comes from
  here»), `world.js` (la escena 3D), `pages.js` (texto, gráficas SVG con cursores vivos, cámara por página y los
  desgloses `PLATES`), `practice.js` (1-2 preguntas por página, cifras calculadas del modelo), `checks.mjs`
  (invariantes: «recomputes each answer another way»; sale con error si falla), `main.js` (une todo con `startBook`).
- Motor común `engine/`: `book.js` (páginas, desplazamiento, toque, enlaces `capitulo/#pagina`, paginador en el
  móvil), `render.js` (sombreado de papel y bordes de tinta), `parts.js`, `xrefs.js` («Compare»: pares de páginas
  con la misma ecuación, mostradas en las dos), `cover.js` (portada).
- Desglose (`PLATES`): `{ text, facts: estado → [[etiqueta, 'fórmula = números = resultado'], …] }`. Ejemplo visto:
  zapatos «W / A → 686 / 0.050 = 13.7 kPa», raquetas «1.72 kPa», «ratio 8×».
- Lectura de cada página (`readout`): una línea con las cifras vivas de la escena.
- Gráficas: SVG propio (`chart()`), con `CURSORS` que mueven un punto sobre la curva según el reloj de la escena.
- `equations/`: la hoja oficial del examen renglón a renglón; cada ecuación enlaza a las páginas que la usan (visto).
- Movimiento reducido: un único instante fijo (`state(clock, reduced)` → reloj 5,0). Calidad que baja sola si van
  lentos los fotogramas (README; no visto en pantalla).
- Su caja de herramientas (README): capturas de cada página, prueba de toque en móvil, desborde, rendimiento y
  volcado de texto para corregir. Equivale a nuestros jueces.
- Guarda: nada (`localStorage` no aparece). Analítica: Vercel Insights.
- Tema visual: «Anatomy light theme» (README); no tiene relación comprobada con nuestra skill `anatomy`.

## De dónde salen sus cifras
- Constantes de física (g = 9,80; ρ agua 1000; P₀ 101 300 Pa) y la hoja oficial AP. No cita otras fuentes.
  No son fuente clínica.

## Frente a nosotros
- Nuestra pieza: `js/core/formula.js` (`formula-comun`, 25/10): renglón fijo «fórmula → tus números → resultado»
  con origen enlazado, en capilar, río y mar, glomérulo, filtro de la TRR y Doppler del eco.
- Ganan: desglose al tocar la pieza, curva con punto vivo junto al texto, «Compara» entre capítulos, hoja de
  ecuaciones con enlaces inversos, preguntas con cifras del modelo y su comprobación automática.
- Ganamos: fuente y página de cada cifra, origen visible, casos que evolucionan, Mayéutica, español, todo dentro
  de la app (su capítulo sale en blanco sin el CDN).

## Propuesta (en el informe)
1. «Compara» entre fichas con la misma fórmula (Starling capilar ↔ PNF glomerular; Poiseuille del catéter ↔
   resistencia de un vaso; después Ohm y Laplace si hay ficha). Pequeño.
2. Juez que recalcula cada renglón de `formula.js` (números mostrados → resultado mostrado, mismo redondeo). Pequeño.
3. Tocar la pieza → tarjeta con frase de mecanismo y 2-4 renglones de `formula.js`. Piloto: capilar vivo. Medio.
4. Curva de la fórmula con punto vivo (SVG común, sin librería). Medio.
5. Hoja de fórmulas de guardia con enlaces a cada ficha y modelo. Medio-grande; el usuario decide dónde vive.
6. Preguntas «piensa antes» con cifras del modelo y juez que las recalcula. Tras la tarea `preguntas`.
No traer: Three.js (§2, y CDN ajeno), el libro con desplazamiento secuestrado, su analítica, su código y textos.

## Pares de prueba (vistos en su código, no en pantalla: el 3D no cargó)
- Tubo que pasa a la mitad de radio → área ÷ 4 → velocidad × 4; Q igual en todo el tubo.
- Mismo peso (686 N), área × 8 (raquetas) → presión ÷ 8.
- Clavo: misma fuerza, presión × 200 en la punta.
- Torricelli: v = √(2gh); alcance del chorro 2√(h·y).
Para los nuestros (con nuestra fuente): Poiseuille, radio ÷ 2 → flujo ÷ 16; CaO₂ con Hb 7 / SaO₂ 0,971 / PaO₂ 90 → 9,4.

## Piezas (para la próxima visita) · 30/10/2026
- Portada: `atlas.css`, `engine/cover.js` (7 344 B), 15 `img/<capitulo>.jpg` (27-69 kB), Vercel Insights.
- Capítulo Fluidos: `engine/book.css`, `engine/book.js` (19 429), `render.js` (9 709), `parts.js` (6 347),
  `xrefs.js` (4 606), `fluids/main.js` (2 904), `pages.js` (23 142), `world.js` (33 750), `model.js` (9 179),
  `practice.js`. Sin `?v=`. Three.js 0.186.1 desde `cdn.jsdelivr.net` (bloqueado en el entorno).
- Sin `<iframe>` en portada, Fluidos ni `equations/`. Dominios ajenos: Google Fonts (abre), jsDelivr (bloqueado).

## No visto
- Las figuras 3D, el desglose en el móvil y la pantalla de preguntas: el entorno bloquea `cdn.jsdelivr.net`
  (`ERR_TUNNEL_CONNECTION_FAILED`). Lo dicho sobre ellos sale de su código, no de verlo funcionar.
