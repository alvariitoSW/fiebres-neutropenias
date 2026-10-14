# Librerías de terceros

Copias fijas, sin build ni npm. Cada una es una excepción decidida por el usuario a la regla de «sin dependencias».

| Archivo | Qué es | Versión | Licencia | Cómo se carga |
|---|---|---|---|---|
| `motion.js` | [Motion](https://motion.dev) (animaciones), build UMD que define `window.Motion` | 11.18.2 | MIT (`motion-LICENSE.md`) | Solo cuando hace falta, con `cargarMotion()` de `js/core/motion.js` |

Para actualizar una: sustituir el archivo por la nueva versión, cambiar la versión en esta tabla y en el `?v=` de su
cargador, y probar las piezas que la usan.
