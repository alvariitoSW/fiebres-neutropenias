# 2026-10-30 · wiggers-movil

**Resultado:** hecha, directo a `main` (arreglo técnico)
**Vueltas:** 1 · **Jueces:** `--ficha fisioUci:cardiologia:panel-cardio-tabs:cardio-fisiologia-aplicada` ✓ a 390 y 360 px (rótulos, móvil, desborde, ids, consola, caché)

## Qué se hizo
- Animación de Wiggers: todos los rótulos (cruces aórtico y mitral, presión auricular, S1-S2, a-c-v, ejes, fase) de
  5,3-5,8 px a ≥ 8 px reales a 360 px. Recolocados para que no se pisen (captura a 360 px revisada a mano).
- El desborde de 30 px a 360 px era la tabla del sistema de conducción: las 4 tablas de la ficha, en `overflow-x:auto`.
- La figura de interdependencia ventricular de la misma ficha también daba 6,6 px y tumbaba el juez: subida a ≥ 8 px.
- Revisión del encargo: arreglo pequeño, hecha por el director con la lista de calidad, sin agente (§0 paso 8).
  Lo hizo el director sin constructor: medir, mover rótulos y pasar el juez costaba menos que el encargo.

## Qué no se pudo hacer o leer
Nada.

## Para el usuario
Nada que decidir. Ver en el móvil: Fisiopatología UCI → Cardiología → Fisiología cardíaca aplicada → «Versión
dinámica del ciclo cardíaco».

## Visto de paso (no tocado)
- La figura de interdependencia ventricular (Corazón normal / Cor pulmonale) está dentro de `.article-figure` sin fondo
  propio: el texto claro sale gris sobre gris (CLAUDE.md §5, «Figuras»: un SVG recreado lleva `var(--bg-main)`).
- En la animación, la «Presión ventricular» se dibuja con `--accent-blue`, que es dorado: se confunde con la PVY
  (`--accent-yellow`); los rótulos ayudan, pero el color solo no los distingue.

## Propuestas sobre las reglas
Ninguna.

## Vueltas
| Pieza | Vuelta | Nota profesor | Modelo | Pasos | Tokens | Qué falló |
|---|---|---|---|---|---|---|
| Wiggers + tablas | 1 | — (técnica) | director | ~25 | < 0,3 M | — |

## Gasto
Sin agentes: todo el gasto es del director, por debajo del presupuesto de 0,3 M. No se pasa `gasto.mjs` (no hay
agentes que repartir) ni `/ahorro` (sin desvío).
