# 2026-10-30 · azul-cobertura

**Resultado:** hecha (informe sin PR, a `main`; Consejo 12.ª) · informe: https://claude.ai/artifact/2eoWefJYcmwqH9JNs8EtMs
**Vueltas:** 1 · **Jueces:** no aplica (no toca la app; el encargo dice «Juez: ninguno»)

## Qué se hizo
- Índice completo de El Libro Azul (lector, sonnet): **62 capítulos** (no 61: el 62 es «Trastornos del potasio»), 1062
  páginas en 17 PDF, ninguno falta ni se repite. Fisio UCI ya tiene 33 fichas de los caps. 1-23 y 46-48.
- Mapa de cobertura (profesor, Fable): por capítulo, estado, modelo vivo que lo explica, pieza nueva y ficha que se
  enlaza. **≈69 %** explicado por modelos (≈55 % con los de `main` hoy). **8 bloques** (A1-A8), ≈85 fichas,
  **≈196 M (160-245)**; de cero serían 330-380 M (reutilizar ahorra un 40-45 %). Ningún modelo grande nuevo.
- Página para el móvil con cifras, decisiones, bloques tocables y los 62 capítulos filtrables. Todo en
  `autonomo/ideas/libro-azul/` (índice, cobertura, encargo y presupuesto).
- Revisión del encargo: hecha por el director (informe sin app). Riesgo vigilado: separar «ya en Fisio UCI» (mismo
  libro) de «lo explica Marino» (otro libro, se enlaza; CLAUDE §2).

## Qué no se pudo hacer o leer
- Los % son a ojo del profesor (±10), a partir de los temas del índice, sin abrir los PDF.
- El PDF de vías urinarias dio unos 21 avisos de lectura (el índice salió igual).

## Para el usuario
1. ¿Maqueta ligera de la **membrana ECMO** (cap. 34, ≈8 M) o solo Mayéutica y las figuras del libro? El profesor no la
   recomienda.
2. **Orden**: A1 y A3 pueden empezar con lo de hoy; A6-A8, mejor después de los bloques 5-6 de Marino (si no, +15-18 M cada uno).
3. **Doppler transcraneal** (cap. 56): amplía el ecógrafo, que tiene la anatomía congelada; solo si lo abres.

## Visto de paso (no tocado)
- Las fichas de Hematología de Fisio UCI enlazan `#page=` 2 páginas antes del arranque real de los caps. 12-14.
- El cap. 6 (coronaria, 4 pp.) puede estar cortado en el PDF `seccion-i-…-parte1` (termina en su pág. 100).

## Propuestas sobre las reglas
- Ninguna.

## Vueltas
| Pieza | Vuelta | Nota profesor | Modelo | Pasos | Equivalente | Qué falló |
|---|---|---|---|---|---|---|
| Índice | 1 | — | sonnet | 15 | 211 k | — |
| Cobertura | 1 | — | fable | 10 | 289 k | — |

## Gasto
Total **0,67 M** (presupuesto 1,5 M). Por papel: profesor 289 k (43 %) · lector 211 k (32 %) · director ≈167 k (25 %).
El ahorro salió de dar al profesor el índice ya hecho (10 pasos de 40, sin abrir PDF) y de no lanzar el revisor del encargo.

## Cuentas
Presupuesto 1,5 M · recortes: sin revisor del encargo ni auditor · gastado 0,67 M · desvío −55 % (el índice previo
ahorró los PDF al profesor). Tabla de presupuestos: «profesor cobertura con índice previo · fable 10 / 0,3 M» y
«lector de índice de un libro · sonnet 15 / 0,2 M».
