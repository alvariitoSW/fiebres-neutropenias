# Libros — reglas del módulo

Historia completa: `docs/historial/libros.md`.

- **Libros no mueve nada**: indexa los capítulos que viven en otras especialidades y lleva a ellos. Solo aloja lo que
  no encaja en ninguna (hoy, Marino caps. 1-11 y 31-53).
- **El índice** (capítulos, secciones, dónde vive cada uno, botones, bloques de repaso) sale solo de
  `js/data/libros-indice.js`. Para añadir un capítulo o un libro, solo se toca ese archivo.
- **Bloque nuevo de Marino**: vista propia en `librosLevel` (`index.js`), su tarjeta en `BLOQUES` de `index.js` (la
  portada de Marino, `marino-portada.html`, con pestañas Índice | Modelos vivos | Repasar), su entrada en `PANEL_NAV` de `js/core/search.js`, banco en `js/data/marino-*-preguntas.js` y su
  bloque en `quiz` de `libros-indice.js`.
- Las fichas de Marino se generaron con un script de montaje que no está en el repo: **si las retocas, edita el
  `.html` directamente**.
- Cada bloque usa su prefijo de ids (`mr-`, `ma-`, `mn-`, `mu-`, `mt-`…). Un `<dl>` y un control con el mismo id ya
  rompieron calculadoras tres veces: comprueba ids duplicados siempre.
- Figuras con id `mar-img-<cap>-<n>`; la vista Visual las muestra con el panel `figuras`.
- Las erratas de Marino van en notas plegables; las discrepancias con otras partes de la app, en
  `.comparativa-fuentes`.
