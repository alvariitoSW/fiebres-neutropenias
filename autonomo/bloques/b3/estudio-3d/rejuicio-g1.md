# Profesor · rejuicio R8 G1 (fichas 12, 13, 16) · 01/11/2026 · rama `auto/b3d-estudio` (88a360d)
Programa `autonomo/bloques/b3/herramientas/profesor-g1.mjs`: 67 respuestas, 0 px de desborde, 0 errores, sin fallos; rsp-g8 abre ZEEP y la oculta, po-g6 ya sin «Compruébalo», po-g5 con `origen`, raj-c4 y po-c2 vuelven a la misma pregunta. 3 capturas nuevas en `/tmp/plan-socialista/b3-pulmon-estudio/prof-g1-r2/` (escalera-13, mira-16, racimo-16).

| Criterio (solo los que estaban < 8,75) | Antes | Ahora | Por qué |
|---|---|---|---|
| §7.6 Visual 13 | 8,25 | **9** | La escalera de la Tabla 27.1 enseña las 4 etapas con sus celdas (Vt 8→6, meseta <30, pH y FR 35, objetivos), cada una botón al texto, rampa de color |
| §7.6 Visual 16 | 8 | **8,5** | Comparar proximal/alveolar/flujo + 4 efectos escritos + flujo ver-medir-tratar: ya se entiende de un vistazo. Pero la columna «Flujo» sale sin marco ni color: `color: 'azul'` no existe en `COLOR` de `js/core/visual-kit.js` (línea 50) y el estilo `--vk:azul` se pierde |
| §8 dificultad 12 | 8,5 | **8,75** | rsp-c6 ya no castiga una conducta de la tabla; raj/rsp distractores reales; la buena es la más larga por >15 caracteres solo en rsp-g1, rsp-e2, rsp-e5 |
| §8 dificultad 13 | 8,5 | **8,5** | raj-g3 y raj-c7 arreglados (ya interpreta el pH 7,31), pero la buena es la más larga en 8 de 21 tests, y por mucho: raj-g14 (+56 caracteres), raj-g6 (+47), raj-c4 (+43), raj-e1 (+41), raj-g10 (+38). Se acierta sin estudiar eligiendo la larga |
| §8 dificultad 16 | 8 | **9** | po-g4, po-c5, po-c4 (sin «13 a 3,3» en el enunciado, distractor del pico), po-g8 destapa de 2, po-c6/po-e2 sin repetirse; longitudes equilibradas (31 % larga / 31 % corta) |
| §8 caso 12 (Rafael) | 8,5 | **8,75** | rsp-c5 y rsp-c6 coherentes («Pres sigue en 4»), distractor «subir Vt a 600» con la meseta 44 y el límite 30 (pág. 4) |
| §8 caso 16 (Eulalia) | 8,5 | **9** | po-c2 ya dice que el riesgo lo marca la alveolar, no el pico (pág. 4); nota de hipercapnia con cap. 24 pág. 49; po-c7 con las dos condiciones de la traqueostomía |

**Veredicto: pasa (todo ≥ 8). Meta 8,75 pendiente en dos puntos**, ambos baratos:
1. `js/modules/neumologia/visual-3d-g1.js` línea 60: `color: 'azul'` → `'purpura'` (y línea 17, ficha 12, igual: `'verde'` o `'purpura'`). Solo valen verde, amarillo, rojo, purpura, dorado, gris.
2. `js/data/mayeutica/b3d-respirador.js`: en raj-g14, raj-g6, raj-c4, raj-e1 y raj-g10 acortar la opción buena a una frase del tamaño de las otras (la justificación va en `explicacion`) o alargar un distractor hasta igualarla.

**No comprobado**: 360 px (lo mide `jueces --ficha`); páginas del PDF (auditor); raj-c2 sigue abriendo `sdra-rigido` con FR 30 cuando el caso dice FR 20 (riesgo ya anotado, no es de los criterios rejuzgados).
