# Nefrología — reglas del módulo

Historia completa: `docs/historial/nefrologia.md`.

- **Navegación propia**: mapa del riñón (nivel 0, `rinon-menu.html` + `rinon.js`) → nefrona viva o vistas de
  categoría. Un switcher (`nefroLevel`) en `index.js`. Categoría nueva: su partial con `.btn-volver-nefro-kidney`,
  registro en `index.html`, en `nefroLevel` y en `vistaPorNodoRinon` (`index.js`).
- **Fuentes**: casi todo es *Nefrología al día* (SEN), PDF en `docs/`. URLs de nefrologiaaldia.org solo si se han
  verificado; nunca el navegador temático genérico en lugar de un artículo.
- **PNT del Servicio**: contenido reescrito, sin nombres ni el documento original. Cada PNT incorporado lleva su
  enlace en el acordeón «PNT» de `rinon-menu.html`. Los administrativos o de técnica de enfermería se descartan.
- **Nefrona viva** (`nefrona-viva.js`): datos en `js/data/nefrona-data.js`. El texto de cada tramo no se escribe dos
  veces: el panel copia del DOM la línea de la ficha (ids `nv-t-*`). Situaciones y fármacos nuevos: entradas en los
  datos, con sus cifras marcadas `ficha` o `ilustrativo`.
- **Simulaciones** (potasio, glomérulo vivo, filtro vivo, nefronas que quedan): las cantidades que la ficha no da son
  ilustrativas y la vista lo dice. La escena del potasio es común (`potasio-escena.js`); no la dupliques.
- **Nefrotoxicidad** es una tabla de consulta (585 fármacos en `js/data/ajuste-farmacos-data.js`), sin quiz ni vista
  Visual. Las dosis dudosas por la resolución del PDF se declaran, nunca se adivinan.
- Pendiente: cotejar `trr.html` con Valdenebro 2021 (7 dudas anotadas en el historial) cuando llegue el PDF.
