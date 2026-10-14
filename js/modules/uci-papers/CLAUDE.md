# UCI / Papers Tuiter — reglas del módulo

Historia completa: `docs/historial/uci-papers.md`.

- **Un paper = una vista**: botón en `uci-papers-menu.html` (en su grupo temático de la constelación), su
  `<paper>.html` con `.btn-volver-uci-menu`, registro en `index.html` y en `uciLevel` de `index.js`.
- **Varios artículos que cuentan la misma historia** (como VExUS) se pueden juntar en una entrada; se pregunta antes.
- **Quiz reducido**: 8-10 de opción múltiple + 3-4 de redactar por paper, y cada ficha con al menos una pregunta.
- Las notas de la bibliografía dicen qué es el artículo (perspectiva, revisión narrativa, guía): que no se lea como
  recomendación normativa si no lo es.
- Imágenes: en PDF de Springer/BMC, `pdfimages -list` y extraer directamente; si la figura está fragmentada
  (InDesign), rasterizar la página y recortar.
