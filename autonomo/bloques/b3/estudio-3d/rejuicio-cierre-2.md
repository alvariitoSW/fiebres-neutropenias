# Profesor · rejuicio R8 corto (2.ª vuelta) · 01/11/2026 · `auto/b3d-estudio` (ba000cf, versión 20261101-103)
Programa: `autonomo/bloques/b3/herramientas/derrame-prueba.mjs` (nuevo, guardado ahí; 16 estados del derrame, mando de horas hasta 72 y a 500, segundo tubo; 0 px de desborde, 0 errores de consola). 3 capturas nuevas en `/tmp/plan-socialista/b3-cierre/rejuicio/der-*.png`. Solo se repuntúan las dos celdas que faltaban.

| Ficha · criterio | Antes → ahora | Por qué |
|---|---|---|
| 15 · Compruébalo | 8,5 → **8,75** | `b3d-tubo-2.js` baro-c4: enunciado, texto del modelo y `nota` dicen ya lo mismo («PAM de 52… 7 pulsaciones, aire pleural 10,5 cmH₂O»); una sola cifra por pregunta |
| 19 · §7.4 | 8,5 → **9** | el mecanismo se ve: los datos del líquido encienden «Categoría n · TUBO / NO tubo» (Tabla 29.5, p. 45) y el loculado con tubo deja «bolsas sin drenar» con aviso a 24 h, sello «Drenaje ineficaz» a 48 h y el segundo tubo bajo TC que las vacía (8 %, SpO₂ 97). dea-g3 y dea-g6 llevan al estado; la Visual de la 19 (`visual-3d-g5d.js`) también |

**Pieza `derrame-paraneumonico`** (`js/modules/libros/pulmon-vivo/derrame.js`): **8,75**. De un vistazo: hemitórax con el líquido, tabiques del loculado, tubo y frasco con sello de agua que se llena al drenar; botones de 44 px, categoría roja cuando toca tubo, cada mensaje con «Ver en la ficha» y p. 45-46; guía de 5 pasos. Topes bien: el mando llega a 72 h y a 500 se queda en 72 con el sello; la mezcla que la tabla no define lo dice en vez de inventar una categoría; <10 mm apaga pH, glucosa y Gram; tubo sin indicación en la 1-2 → «Sin indicación» en rojo. Alonso (61 a, 1,75 m, neumonía hospitalaria con derrame) es un paciente posible y sus SpO₂ (93 → 97) encajan.
**Nota mínima por ficha**: 15 8,75 · 19 8,75 · las otras 19, sin cambio, ≥ 8,75. **Veredicto: 21 de 21 llegan a la meta.**

## Lo que queda (parte, sin bajar nota)
1. `derrame.js`, `resto()` línea 51: en el loculado a 24 h el líquido baja de 75 a 52 % (−30 % del líquido) y el aviso dice «casi no ha bajado». O bajar el factor (`1 - 0.3 * t` → `1 - 0.12 * t`) o cambiar en `sello()` línea 93 «casi no ha bajado» por «ha bajado poco y se para».
2. `derrame.js`, `dibujo()`: la elipse del pulmón no cambia con el líquido (el pulmón de Alonso no se comprime ni se reexpande al drenar); bastaría escalar `ry` con `1 - 0.3·frac`.
3. Sin cambio de nota: con tubo «Sin indicación» en la categoría 2 el mando de horas sigue activo y drena; podría apagarse (`el.h.disabled = !dr.tubo || !indicaTubo(categoria())` en `pintar()` línea 68).
