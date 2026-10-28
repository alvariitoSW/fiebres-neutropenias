# 2026-10-28 · eco-calibra-a (sesión 1 de 2)

**Resultado:** en curso (sesión 1 de 2 hecha; rama `auto/eco-calibra-a`, sin PR: es arreglo técnico, irá a `main` con
los jueces en verde al acabar la sesión 2) · **Vueltas:** 1 por pieza · **Jueces:** suite eco 502 pruebas, 476 ok,
0 fallan, 26 `todo` (15 son J1/J2 pendientes, la meta de la sesión 2)

## Qué se hizo
- Revisión del encargo (Explore sonnet): 6 graves (sobre todo: J1 sin bandas numéricas, solo 5 formas con mando,
  criterio de parada). Todo aplicado al plan antes de construir.
- Profesor: hipertrofia = mando de grado 1 (mala relajación) a grado 2 (seudonormal), Nagueh 2025 pp. 550-554.
- Lector: bandas de J1 por forma y punto, ~40 cifras con página y 4 discrepancias (LVEI >1/>1,1; DT del VD en
  Mukherjee T1/T6; S/D <1/≤0,67; TAPSE <17/<18), en `referencias.mjs` como nota.
- Jueces J1 (Doppler de paciente posible) y J2 (sin recorte del dibujo) como pruebas de la eco, 42 casos.
- Motor: AI y AD suman su contracción; venas pulmonares frenan el reflujo (Ar ~590 → ~190 mL/s, bomba AI 23 %);
  e′ cambia con la relajación de cada forma; hipertrofia con mando (0 %: E/A 0,67, E/e′ 11,4, PCP 9 → 100 %: E/A
  1,58, E/e′ 16,3, PCP 26; el atlas 10 la clasifica grado 1 → 2).
- Material para la sesión 2: `autonomo/bloques/eco-mega/calibra-a/` (`sesion2.md` es la lista).

## Qué no se pudo hacer o leer
Dilatada pierde su E/A de grado III al bajar e′ (2,5 → 1,38) y el fallo no llega a E/e′ ≥14 sin romper otras pruebas;
DT de 550-580 ms en la hipertrofia de grado 1 (sin banda de libro); piezas 4-6. Todo en `sesion2.md`.

## Para el usuario
Nada que decidir ahora. La sesión 2 sigue sola.

## Visto de paso
Umbrales relajados sin fuente en pruebas viejas (balón, tabique del TEP, derrame máximo 383 mL): los mira el auditor
de la sesión 2.

## Propuestas sobre las reglas
- La revisión del encargo (0,1 M) evitó que el juez se escribiera sin bandas: el lector de bandas antes del juez de
  un simulador debería ser paso fijo cuando el juez mide «paciente posible».

## Vueltas
| Pieza | Vuelta | Nota | Modelo | Pasos | Tokens eq. | Qué falló |
|---|---|---|---|---|---|---|
| revisión del encargo | 1 | — | sonnet | 5 | 96 k | — |
| profesor hipertrofia | 1 | — | opus | 9 | 132 k | — |
| lector bandas | 1 | — | sonnet | 29 | 445 k | — |
| jueces J1/J2 | 1 | — | sonnet | 14 | 344 k | — |
| AI y venas | 1 | — | sonnet | 72 | 1,3 M | (presupuesto 60 / 1,2 M: se pasó 12 pasos en el barrido) |
| e′ e hipertrofia | 1 | — | sonnet | 47 | 879 k | dilatada y fallo no cuadran: a la sesión 2 |

## Gasto
Total **3,6 M** (`gasto.mjs --clave eco-calibra-a`): constructores 2,5 M (70 %), lector 0,45 M, director ~0,41 M,
profesor 0,13 M, revisión 0,1 M. El más caro, AI y venas (72 pasos): barrido de parámetros sin fuente. Ahorro: dejar
el barrido en un script que tabule una rejilla de una vez (ya está en `herramientas/`) en vez de probar a mano.
