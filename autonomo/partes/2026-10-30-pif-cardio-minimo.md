# 2026-10-30 · pif-cardio-minimo

**Resultado:** en revisión (PR: https://github.com/alvariitoSW/fiebres-neutropenias/pull/47)
**Vueltas:** 1 · **Jueces:** pruebas ✓ · móvil ✓ (jueces completos a 390 y 360) · auditoría ✓ (1 grave, corregido)

## Qué se hizo
Cardiología · PIF pasa de 1 objetivo a los 6 de la rotación, cada uno con lo que pide, «léelo en orden» con enlaces a
lo que ya existe y su «Repasar». Modo «Léelo en orden y destapa» en el lector FREHIII (fichas 8 y 9). Tabla arteria →
ECG → pared → complicación en `js/data/sca-territorios.js` (columnas por fuente; elegir arteria en el móvil, tabla
completa plegada) y 8 preguntas «predice el ECG» con un caso de 3 pasos en orden (`paso` en `quiz.js`).
Revisión del encargo (Explore): 2 graves resueltos sin preguntar (columnas por fuente; vista nueva como cuaderno para `--ficha`).
Encargo rellenado por el director: `/tmp/plan-socialista/pif-cardio-minimo/encargo.md` (resumen en la PR).

## Qué no se pudo hacer o leer
- Las guías de `docs/` no unen complicación mecánica y territorio: se buscó y se citó Damluji 2021 (AHA, PMC9364424,
  por apartado, sin `#page`). BAV e infarto inferior: ninguna fuente leída lo une → «la fuente no lo dice».
- Flecha ↑/↓ de «a veces ↓ST en aVL» (EKG 4, López p. 140) leída solo por OCR.
- Historia clínica y cateterismo, sin fuente; endo/peri/miocarditis enlazan el PDF por su página 1, sin ficha.

## Para el usuario
Parada de la tarea: mirar la PR en el móvil (3 cosas en su texto). Mandar, si quiere, el PDF de semiología cardíaca.

## Visto de paso (no tocado)
- `#ecg9-tabla-ekg` repite la errata DIII > DII (ya tiene nota). `.ecg-chip:disabled` sin estilo propio.
- El chip «Abrir el EKG 1 en orden» sale dos veces en el capítulo SCA (figura y paso 3).

## Propuestas sobre las reglas
- El lector de fuente debería buscar la fuente web (§1.15) cuando las de `docs/` no cubren una columna pedida; aquí
  lo hizo el director a mano (2 llamadas).

## Vueltas
| Pieza | Vuelta | Nota mínima del profesor | Modelo | Pasos | Tokens eq. | Qué falló |
|---|---|---|---|---|---|---|
| A + B | 0 | 7,5 (tabla en el móvil) | sonnet | 30 + 24 | 0,88 M | tabla ancha; caso barajado; frase sin cita |
| Arreglos | 1 | 8,5 (preguntas: límite del quiz actual) | sonnet | 18 | 0,26 M | — |

## Gasto
Total **2,7 M** equivalentes. Por papel: constructor sonnet 1,1 M (42 %, 3 agentes) · director 0,61 M (23 %) ·
profesor fable 0,33 M (12 %) · auditor 0,22 M · lector 0,18 M · Explore 0,13 M · web-fetch 0,09 M.
Los 3 que más: director 614 k, constructor A 532 k, constructor B 352 k. El constructor A leyó mucho código del lector
(2,4 M de caché leída): darle las líneas exactas del grupo `guardia` lo bajaría.

## Cuentas
Presupuesto 3,85 M (Hacienda: sin verificador ni revisor, sin lector de López Ramírez, profesor corto) · gastado 2,7 M
· desvío **−30 %** (una sola vuelta; arreglos en 18 pasos). Es una tarea suelta del Objetivo L: no gasta presupuesto de bloque.
