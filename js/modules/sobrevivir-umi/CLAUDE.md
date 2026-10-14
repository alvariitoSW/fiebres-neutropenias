# Sobrevivir a la UMI — reglas del módulo

Historia completa: `docs/historial/sobrevivir-umi.md`.

- **El Manual UMI vive entero aquí**: nunca se trocea por especialidades. Si coincide con otra parte de la app, se
  enlaza en las dos direcciones (`[data-especialidad]`) y, si las cifras no coinciden, nota de fuentes.
- **Es un manual interno del HUGCDN**: nunca reproducir el documento ni los nombres del personal; contenido
  reescrito y citado de forma genérica. Los PDF son escaneos: se leen como imagen, página a página.
- **Dudas de guardia** guarda en `localStorage` (excepción decidida) y escapa todo lo que escribe el usuario con
  `escapeHtml()`. Las 3 dudas de ejemplo están en `js/data/dudas-guardia-ejemplos.js` y no se pueden borrar.
- **Preguntas difíciles**: cada pregunta cruza al menos dos fichas, como un adjunto que pregunta a un R1; antes de
  escribirla, relee las fichas de origen.
- **Técnicas R1** no tiene contenido propio: solo enlaces a lo que ya existe en la app. Un procedimiento sin fuente
  no se escribe.
- Quiz del manual: 5 preguntas por ficha (4 de opción múltiple + 1 de redactar).
