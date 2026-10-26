# Inventario de fichas de estudio (tarea `inventario`, 26/10/2026)

Datos: `inventario.csv` (una fila por ficha) e `inventario-datos.json` (para una página). Script: `/tmp/plan-socialista/inventario/inventario.mjs` (solo lee el repo).

**Criterio de «ficha»**: cada `.field-card[data-tab]` de un cuaderno de campo con su `.tab-content` (mismo id). Total: **362 fichas** en 32 cuadernos. Las vistas teóricas sin cuaderno (20: Neutropenia febril, escalas, atlas de eco, vistas de nefrología y de Sobrevivir UMI) van en el CSV como `tipo=vista` y no entran en los totales. **El encargo estimaba ~724: no hay tantas** (ver riesgos).

| Especialidad | Fichas | Visual | Modelo vivo | Estudiar | Con preguntas | Preguntas (fichas / banco) | De redactar | Sin Visual/Estudiar/modelo | Sin nada |
|---|--:|--:|--:|--:|--:|--:|--:|--:|--:|
| Hematología | 36 | 36 | 6 | 6 | 36 | 209 / 240 | 1 / 1 | 0 | 0 |
| Nefrología | 59 | 59 | 5 | 0 | 58 | 596 / 604 | 6 / 6 | 0 | 0 |
| Cardiología | 35 | 0 | 6 | 0 | 35 | 286 / 286 | 71 / 71 | 29 | 0 |
| Neumología | 23 | 0 | 1 | 0 | 23 | 184 / 184 | 46 / 46 | 22 | 0 |
| Fisio UCI | 33 | 0 | 6 | 0 | 32 | 301 / 301 | 70 / 70 | 27 | 1 |
| UCI / Papers Tuiter | 43 | 0 | 1 | 0 | 43 | 145 / 145 | 16 / 16 | 42 | 0 |
| Sobrevivir UMI | 31 | 0 | 1 | 0 | 31 | 161 / 183 | 31 / 37 | 30 | 0 |
| Eco cardíaca (solo 9 vistas) | 0 | 0 | 0 | 0 | 0 | 0 / 52 | 0 / 9 | 0 | 0 |
| Libros | 102 | 102 | 38 | 23 | 102 | 630 / 630 | 106 / 106 | 0 | 0 |
| **Total** | **362** | **197** | **64** | **29** | **360** | **2512 / 2625** | **347 / 362** | **150** | **1** |

**Prioridad** = fichas sin Visual, sin Estudiar y sin modelo vivo, **con fuente** (PDF o cita con año; «cuaderno» = heredada del cuaderno, pesa ×0,8), ordenadas por palabras. Hay 87 candidatas; las 25 primeras (↻ = ya en el plan M5 del tablero):

| # | Ficha (id) | Cuaderno | Palabras | Preg. | Plan |
|--:|---|---|--:|--:|---|
| 1 | Ventilación no invasiva: uso clínico y corazón (`neumo-vni-uso`) | Merino Neumología | 2650 | 8 | ↻ M5 b3 |
| 2 | Oxígeno como fuente de lesión (`neumo-o2-toxicidad`) | Merino Neumología | 2469 | 8 | ↻ M5 b3 |
| 3 | Fracaso del weaning y extubación (`neumo-weaning-extubacion`) | Merino Neumología | 2310 | 8 | ↻ M5 b3 |
| 4 | SDRA: manejo no ventilatorio (`neumo-sdra-no-ventilatorio`) | Merino Neumología | 2271 | 8 | ↻ M5 b3 |
| 5 | IC avanzada (`ic-avanzada`) | Insuficiencia Cardíaca (Guías  | 2177 | 14 |  |
| 6 | Disparo del ventilador y ajuste práctico (`neumo-vm-ajuste`) | Merino Neumología | 2177 | 7 | ↻ M5 b3 |
| 7 | Cuidado de la vía aérea y barotrauma pulmonar (`neumo-cuidado-barotrauma`) | Merino Neumología | 2139 | 8 | ↻ M5 b3 |
| 8 | Embolia pulmonar: manejo (`neumo-ep-manejo`) | Merino Neumología | 2052 | 8 | ↻ M5 b3 |
| 9 | IC descompensada (`ic-descompensada`) | Insuficiencia Cardíaca (Guías  | 2047 | 8 |  |
| 10 | Comorbilidades cardiovasculares (`ic-comorb-cv`) | Insuficiencia Cardíaca (Guías  | 2043 | 8 |  |
| 11 | Exacerbación aguda de asma (`neumo-asma-agudo`) | Merino Neumología | 1905 | 8 | ↻ M5 b3 |
| 12 | Vasopresores y dosis (`mc-vasopresores`) | Merino Cardiología (Shock clín | 1893 | 8 | ↻ M5 b3 |
| 13 | Hipertensión pulmonar en el paciente crítico (`cardio-hipertension-pulmonar`) | Cardiología (fisiopatología pu | 2363 | 10 |  |
| 14 | Diagnóstico clínico y microbiológico de la NAV (`neumo-nav-diagnostico`) | Merino Neumología | 1872 | 8 | ↻ M5 b3 |
| 15 | SDRA: ventilación mecánica (`neumo-sdra-ventilacion`) | Merino Neumología | 1813 | 8 | ↻ M5 b3 |
| 16 | Estrategias del ventilador y respiración espontá (`neumo-sbt`) | Merino Neumología | 1791 | 9 | ↻ M5 b3 |
| 17 | Oxígeno: sistemas de administración (`neumo-o2-sistemas`) | Merino Neumología | 1770 | 8 | ↻ M5 b3 |
| 18 | SDRA: patogénesis y diagnóstico (`neumo-sdra-diagnostico`) | Merino Neumología | 1765 | 8 | ↻ M5 b3 |
| 19 | Fármacos vasoactivos: receptores y dosis (`umi-vasoactivos`) | Manual UMI Negrín | 1758 | 6 |  |
| 20 | Vías aéreas artificiales: tubos y traqueostomía (`neumo-vias-artificiales`) | Merino Neumología | 1707 | 8 | ↻ M5 b3 |
| 21 | Terapia farmacológica de la IC crónica (`ic-farmacologia`) | Insuficiencia Cardíaca (Guías  | 1706 | 8 |  |
| 22 | Diagnóstico de la IC crónica (`ic-diagnostico`) | Insuficiencia Cardíaca (Guías  | 1603 | 8 |  |
| 23 | Oxígeno: indicaciones y efectos fisiológicos (`neumo-o2-indicaciones`) | Merino Neumología | 1596 | 8 | ↻ M5 b3 |
| 24 | Condiciones específicas (`ic-condiciones-especificas`) | Insuficiencia Cardíaca (Guías  | 1565 | 8 |  |
| 25 | IC aguda: manejo (`mc-ic-manejo`) | Merino Cardiología (Shock clín | 1941 | 8 | ↻ M5 b3 |

## No comprobado / riesgo
- **Recuento**: `field-card…data-tab` por grep = 362; ids únicos 362 (cuadra). `tab-content` = 364: las 2 de más (`tab-clinica`, `tab-micro`, en tratamiento-dirigido de Neutropenia febril) son pestañas sin tarjeta y no cuentan. Sin ids duplicados ni tarjetas sin contenido. Si el 724 incluía otras cosas (vistas, tarjetas `.card` de NF/escalas, modelos vivos, fichas de Mayéutica), no se ha podido reconstruir.
- **Preguntas**: la asociación es exacta por ficha (el `tema` del banco = id de la ficha). Sin ficha: NF (31 preg., temas nf-triaje, nf-cateter, nf-dirigido-mdr…), Mc difíciles de Sobrevivir UMI (22, integran varias fichas) y el atlas de eco (52, por capítulo, no por ficha). «Preguntas totales» = todo el banco de la especialidad.
- **Visual**: ids de `montarVisual`/simulaciones por texto; tres ids sin ficha (`cisne-card`, `empirico-*-card`: tarjetas de NF). No se ha abierto la app: una receta rota no se detecta. Cardiología, Neumología, Fisio UCI, UCI/Papers y Sobrevivir UMI: 0 con Visual.
- **Estudiar**: solo Mayéutica de bloque 1 (23 fichas de Marino) y bloque 2 (6 de Merino HEMATO), leídas de `js/data/mayeutica/b1.js` y `b2.js`. Fichas con Texto|Estudiar generado de otra forma: no detectadas.
- **Modelo vivo**: por botones `data-*-viv*`/`data-eco-*` en el HTML de la ficha; los enlaces que se inyectan por JS (p. ej. desde los propios modelos) no se ven. «Calculadora» es heurística (inputs numéricos/rango/texto, `<select>`, gauges, casillas `.puntuable`): incluye escalas y listas.
- **Fuente**: PDF enlazado en la ficha (`docs/*.pdf`) o cita «Fuente: … año»; si no, hereda la del cuaderno (columna `fuente_nivel`). Cuadernos sin PDF ni cita: FRA, TRR, trasplante renal, TPH (3), VExUS: salen sin fuente y por eso quedan fuera de la prioridad. En fichas con varios libros la fuente es la más citada, no necesariamente la principal.
- **Palabras**: texto visible de la ficha (sin scripts ni SVG); no distingue texto original de notas de fidelidad. **Figuras**: `img`/`svg`/cajas `.article-figure` por separado en el CSV.
- **Eco**: el atlas son 9 capítulos (vistas), no fichas; el simulador y los modelos vivos (agua, capilar, catéter…) tampoco se cuentan como fichas.
