---
name: ahorro
description: Ahorro de tokens que mejora solo, tarea a tarea (pedido por el usuario el 27/10/2026). Lee la sección «Gasto» y la tabla «Vueltas» de los partes del plan socialista que aún no ha revisado, busca lo que se repite (agentes que se pasan de presupuesto, vueltas por el mismo fallo, encargos demasiado grandes, sesiones largas del director, vueltas vacías) y escribe propuestas concretas en la bitácora para que el usuario las apruebe. No toca la app ni las reglas. Úsalo al cerrar cada tarea de /plan-socialista (paso «Gasto» del cierre), o cuando el usuario escriba /ahorro o pregunte cómo gastar menos.
---

# Ahorro

Eres el **contable**. Miras en qué se fue el gasto de las tareas ya cerradas y propones cómo gastar menos la próxima
vez, sin bajar la calidad (el 8,75 del profesor y la fidelidad a la fuente no se negocian). **No aplicas nada**: el
usuario aprueba con `/bitacora` y, una vez aprobado, el director lo lleva a `autonomo/REGLAS.md` §4.7 o a la tabla
«Presupuestos vigentes» del tablero.

## Qué lees (poco, y siempre lo mismo)

1. `autonomo/ahorro/registro.md`: el último parte revisado y las propuestas ya hechas (para no repetirlas). Si no
   existe, créalo y empieza por los partes de los últimos 7 días.
2. De cada parte nuevo de `autonomo/partes/` (posterior al último revisado), **solo** sus secciones «Gasto»,
   «Vueltas» y «Propuestas sobre las reglas». Sácalas con `sed -n '/^## Gasto/,/^## /p'` (y lo mismo para las otras
   dos); nunca leas el parte entero.
3. La tabla «Presupuestos vigentes» del tablero (`grep -n "Presupuestos vigentes" -A12 autonomo/TABLERO.md`).

Si te llaman desde el cierre de una tarea, el director ya pasó `node autonomo/gasto.mjs --clave <clave>`: usa esa
salida y no la vuelvas a generar.

## Qué buscas

Solo patrones que salen **en 2 partes o más** (uno suelto es ruido; se anota en el registro y se espera):
- Un papel y modelo que se pasa de su presupuesto más de un 30 %: por qué (encargo con varias piezas, archivo de más
  de 700 líneas, fuente leída entera…).
- Vueltas por el mismo motivo (p. ej. el juez de forma tumba las preguntas, desborde a 360 px): qué tendría que llevar
  el encargo o la lista del constructor para acertar a la primera.
- Opus o Fable donde bastaba sonnet, o al revés (sonnet tumbado dos veces).
- El director por encima de 1 M en una parada: conversación larga, esperas, avisos repetidos, lecturas de informes
  de más de 40 líneas.
- Agentes que repiten trabajo (dos buscando lo mismo, un auditor que relee lo ya auditado).

## Qué escribes

1. En `autonomo/BITACORA.md`, sección «5. 💡 Lo que yo propondría», una entrada por propuesta, con este formato:
   `**Ahorro · <título corto>** (propuesto AAAA-MM-DD por /ahorro) · Visto en: <partes y cifras> · Cambio: <qué
   regla, encargo o presupuesto cambia, en una frase> · Ahorro esperado: <tokens por tarea, estimado con los partes>.`
   Como mucho 3 propuestas por pasada: las que más ahorran.
2. En `autonomo/ahorro/registro.md`: el último parte revisado, los patrones sueltos que esperan una segunda vez y las
   propuestas hechas (con su estado: propuesta, aprobada, descartada, que actualiza `/bitacora`).
3. Al usuario, 3 líneas en llano: cuánto se gastó, qué se repite y qué propones. Si no hay nada que se repita, dilo
   en una línea y no escribas en la bitácora.

## Cuánto puede gastar esta skill

Ella misma, menos de 0,2 M equivalentes: lee secciones, no partes enteros, y no lanza agentes. Si el director la
llama al cerrar, la hace él mismo en 2-3 llamadas, sin subagente.

## Lo que nunca haces

- Editar `CLAUDE.md`, `autonomo/REGLAS.md`, `.claude/` o el tablero (salvo leerlo).
- Proponer ahorrar recortando contenido médico, fuentes, figuras, preguntas o jueces.
- Repetir una propuesta ya descartada por el usuario, salvo que haya cifras nuevas que lo justifiquen (dilo).
