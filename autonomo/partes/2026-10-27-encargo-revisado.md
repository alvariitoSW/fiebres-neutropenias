# 2026-10-27 · encargo-revisado

**Resultado:** hecha, directo a `main` (tipo `arreglo`, solo reglas y skills; sin PR)
**Vueltas:** 1 · **Jueces:** no aplican (solo `.md` de reglas, skills e historial; no cambia la app)

## Qué se hizo
- `autonomo/REGLAS.md` §4.9 (nuevo): lista de calidad del encargo (5 preguntas al texto del encargo), tope de 5
  preguntas al usuario por encargo y revisión del encargo antes de construir (solo lectura, sonnet, ~10 pasos / 0,15 M;
  lo grave para y se pregunta).
- Skill `plan-socialista` §0, paso 8 nuevo (revisar el encargo con `Explore` sonnet); el paso 7 dice ya que lo grave
  de ese paso sí para.
- Skill `bitacora`: la lista de calidad al apuntar y al aprobar; «Dudas» con tope de 5, las importantes primero.
- Aprobación citada en `docs/historial/trabajo-autonomo.md`. Spec Kit no se instaló.
- Revisión de este mismo encargo (hecha por el director, sin agente, por ser un `arreglo` pequeño): una
  contradicción, «no pares a preguntar» (§0 paso 7) frente a «lo grave para y se pregunta»; resuelta con «salvo lo
  grave del paso 8». Sin más huecos.

## Qué no se pudo hacer o leer
Nada.

## Para el usuario
Nada que decidir. Desde ahora, cada tarea empieza con una revisión corta del encargo y `/bitacora` te hará como mucho
5 preguntas por tarea.

## Visto de paso (no tocado)
Nada.

## Propuestas sobre las reglas
Ninguna nueva. Al calibrar presupuestos: medir el gasto real del paso «revisar el encargo» en las 2-3 próximas tareas
(estimado 10 pasos / 0,15 M).

## Vueltas
| Pieza | Vuelta | Nota profesor | Modelo | Pasos | Tokens eq. | Qué falló |
|---|---|---|---|---|---|---|
| Reglas y skills | 1 | — | director | ~20 | ≈0,4 M | — |

## Gasto
Solo el director, sin agentes: ≈20 llamadas (≈0,4 M estimado; sin agentes que medir con `gasto.mjs`).
