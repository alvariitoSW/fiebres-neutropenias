# Herramientas de prueba de las maquetas del bloque 3 (reutilízalas, no las reescribas)

Arneses Playwright/Node que escribieron los agentes en la sesión del 26/10. Antes de escribir una prueba nueva, copia
y adapta una de estas (puerto y ruta arriba de cada archivo).
- `chk.cjs`: abre las cuatro maquetas a 390 y 360 px y cuenta desborde y errores de consola (servidor en el 8790).
- `shock-prueba.mjs`, `ritmo-prueba.mjs`, `receptor-prueba.mjs`, `pulmon-prueba.mjs`, `may-prueba.mjs`, `segunda.mjs`:
  recorridos del profesor (mandos, estados, Mayéutica entera) del juicio rápido v3.
- `shock-mide.mjs`: mide con el motor real los 5 pacientes del shock a gravedad 0/0,5/1, los aparatos, el reloj.
- `tope-prueba.html` + `tope-prueba.mjs`: prueba de la pieza común `autonomo/maquetas/comun/tope.js` (aviso y sello: se
  ponen, apagan y vuelven a encender los botones, 390 y 360 px). Servidor en la raíz del repo (`python3 -m http.server 8791`).
- `tope.js` (la pieza): `crearTope({ monitor, dock, cita })` → `poner(clave, { nivel, titulo, texto, cita, origen, deshabilita, bajo })`.
