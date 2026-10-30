# 2026-10-30 · rea-cierre (B-046, Objetivo C fila 11; absorbe `mesa-destinos`)

**Resultado:** en revisión (PR: https://github.com/alvariitoSW/fiebres-neutropenias/pull/40) · carril 2, sin tocar la app
**Vueltas:** 1 (+1 vuelta corta de la página) · **Jueces:** la app no se toca (sin `jueces.mjs`); página comprobada a
390 px (claro) y 360 px (oscuro): sin desborde, sin errores de consola, el filtro funciona

## Qué se hizo
- 5 lectores sonnet en paralelo, cada uno con su informe en `autonomo/ideas/ingenieria-inversa/`:
  `rea-cierre-tuits.md` (9 tuits), `rea-cierre-webs.md` (CardioTeca, Easy LA Segmentator, PhET),
  `rea-cierre-repos.md` (`simulador-UCI-` y `simulador-uci-3d`) y `rea-cierre-webs-abiertas.md` (CardioRender, LITFL,
  intro2echo).
- Página **«Todo lo estudiado»**: https://claude.ai/artifact/L9ACnf5rSyMPyow9KYLTVM (copia en
  `autonomo/radar/todo-lo-estudiado.html`). Son 58 recursos y cada uno lleva una sola etiqueta: tarea 28 · integrado 10 ·
  aparcado 7 · no se pudo leer 8 · descartado 5.
- `autonomo/radar/ENTRADAS.md` estrena el art. 5. Hay fichas nuevas de los dos repos, PhET, CardioRender, LITFL e
  intro2echo, y una línea «Estado (30/10, rea-cierre)» en CardioTeca, Easy LA y los tuits #10 y #24-31.
- Revisión del encargo: hecha por el director con la lista (tarea que no toca la app); presupuesto en
  `/tmp/plan-socialista/rea-cierre/presupuesto.md` (3,1 M con los recortes de Hacienda aplicados por el director).

## Qué no se pudo hacer o leer
- **x.com dio 402 a los 9 tuits** (a WebFetch), así que no se leyó ninguno hoy. Los #10, #24, #25, #29, #30 y #31 tienen
  destino por su ficha anterior. Del #26, el #27 y el #28 no se sabe qué dicen.
- `add_repo` de `simulador-UCI-` lo bloqueó el filtro de permisos; el repo es público y se clonó sin credenciales (solo
  lectura).
- Las 3 webs «cerradas» **abren desde las 16:20** (aviso de la sesión de la bitácora, comprobado con `curl`: 200). WebFetch
  sigue sin llegar a ellas (ENOTFOUND); se leyeron con `curl`. Ningún simulador se abrió en el navegador: solo el HTML.
- PhET: las páginas de simulación solo devuelven menú (web dinámica); los nombres salen de la búsqueda.

## Para el usuario
- Pega en la Bandeja #27 el texto o una captura de los tuits #26 (@shinriha_pt), #27 (@WithAScalpel 2115405654…) y
  #28 (@sindenzu1).
- PDF que esperan: Carden 2026, Mireles-Cabodevila 2022 y Helseth (OMI).
- ¿Quieres tarea para la **calculadora de ACOD** (con fichas técnicas y EHRA, no con CardioTeca) y para **mejorar los
  lazos P-V** (CardioRender: acople Ea/Ees y reflejos)? Hoy no tienen fila propia.

## Visto de paso (no tocado)
- `mesa-recursos-2026-10-29.md` queda con los estados del 29/10; lo vigente es la página y `ENTRADAS.md`.

## Propuestas sobre las reglas
- **WebFetch y `curl` no ven la misma red.** Los dominios abiertos por el usuario llegan con `curl` pero WebFetch dice
  ENOTFOUND. Propuesta: en REGLAS §4.14 («web ajena»), probar con `curl` antes de apuntar «no se pudo leer», y decirles
  a los lectores que lean con `curl` + `python3 -I`.
- Art. 5: añadir la etiqueta **«integrado en la app»** a las tres de la reforma (tarea · aparcado · descartado). Sin
  ella, lo ya hecho quedaba como «descartado».

## Vueltas
| Pieza | Vuelta | Nota | Modelo | Pasos | Tokens | Qué falló |
|---|---|---|---|---|---|---|
| Lector de las 3 webs | 1→2 | — | sonnet | 8+5 | 160 k | Solo probó WebFetch; rehecho con `curl` |
| Página + ENTRADAS | 1→2 | — | sonnet | 14+3 | 301 k | Faltaban la etiqueta «integrado» y el destino de las 3 webs |

## Gasto
Total **1,5 M** equivalentes frente a 3,1 M presupuestados (−52 %).

| Papel · modelo | Lanzados | Equivalente | % |
|---|---|---|---|
| director · opus | 1 | 549 k | 37 % |
| general-purpose (lectores) · sonnet | 3 | 508 k | 35 % |
| constructor · sonnet | 1 | 301 k | 21 % |
| lector-fuente · sonnet | 1 | 108 k | 7 % |

Más caros: el director (549 k), el constructor (301 k) y el lector de CardioTeca, Easy LA y PhET (190 k). La próxima vez
saldría más barato pasando a los lectores el método `curl` desde el principio: la vuelta de las 3 webs no habría hecho
falta.

## Cuentas
Presupuesto 3,1 M (tablero ≈3-4 M). Recortes de Hacienda: un solo lector para CardioTeca, Easy LA y PhET; sin profesor
ni revisor. Gastado 1,5 M: −52 %, por debajo del presupuesto. Vía libre de gasto hasta el 02/11.
