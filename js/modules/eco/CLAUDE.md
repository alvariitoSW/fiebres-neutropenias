# Eco cardíaca — reglas del módulo

El detalle técnico está en `README.md` de esta carpeta (búscalo por secciones; no hace falta leerlo entero). La
historia de las decisiones, en `docs/historial/eco.md`.

- **Pruebas**: `node --test 'js/modules/eco/pruebas/*.test.mjs'` (desde la raíz, ~3 min). En verde antes de subir
  cualquier cambio del motor, la geometría, la ecografía o el atlas.
- **Toda cifra tiene origen**: `ficha` (cita la ficha de la app y su PDF), `fisiología general` o `ilustrativo`. Las
  referencias van en `referencias.mjs`. **Nunca cambies una referencia para que una prueba pase**: si el modelo no
  llega, se corrige el modelo o la cifra se marca `pendiente`.
- **Una sola fisiología**: el atlas, el simulador, el Wiggers y el asa salen del mismo motor (`motor.mjs`). Si el
  texto del atlas y el motor discrepan, se corrige el motor (con pruebas), no el texto.
- **Un estado por fotograma**: el corazón, la eco, los diagramas y las cifras de un fotograma leen el mismo estado.
  Nunca dos relojes en paralelo.
- **Anatomía congelada**: no se añaden piezas salvo que sirvan a una ficha concreta. Excepciones ya decididas:
  abdomen (hígado, diafragma, xifoides, VCI, suprahepáticas, porta) y formas de enfermedad.
- **Escenarios** nuevos en `escenarios.mjs`, con su `tipo` (shock) o `forma: true` + criterios en `CRITERIOS_FORMA`.
- **Solo WebGL** (sin WebGL, imagen fija con aviso). **Una sola copia del pegamento**: la app y `laboratorio.html`
  montan el mismo `simulador.mjs`.
- **Atlas** (*The Heart by Ultrasound*, D. Ouyang): el texto se traduce entero con permiso del autor y se cita; el
  código nunca se copia. Cada capítulo = `atlas/cap-<nombre>.html` + `atlas/<nombre>.mjs` con
  `montar(el) → { parar() }`, registrado en `CAPITULOS` de `atlas/atlas.js`, citas en `atlas/referencias.js`,
  preguntas en `js/data/eco-atlas-preguntas.js` (tema `atlas-<clave>`) y al menos una prueba en
  `pruebas/atlas.test.mjs`. Modelo: `atlas/cap-sistolica.html` + `atlas/sistolica.mjs`.
- **Créditos**: Z-Anatomy (CC BY-SA) para el abdomen, visibles en la página; echodemo, en cada capítulo.
- Al terminar: un párrafo en la sección que toque de `README.md`.
