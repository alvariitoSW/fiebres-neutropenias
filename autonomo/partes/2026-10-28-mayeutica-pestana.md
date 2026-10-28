# 2026-10-28 · mayeutica-pestana

**Resultado:** hecha, en `main` (técnica, sin PR: REGLAS §2.3)
**Vueltas:** 1 · **Jueces:** pruebas ✓ (`--modelo mayeutica-fichas`, 1855 a favor) · móvil ✓ (390 y 360) · auditoría — (sin contenido nuevo)

## Qué se hizo
En toda ficha con Mayéutica (las 42), el interruptor pasa a **Texto | Mayéutica | Estudiar**. «Mayéutica» abre
directamente la guía socrática: es la misma guía de Estudiar → Piensa, así que lo que contestas en un sitio sale hecho en
el otro. Al acabarla: «Sigue en Estudiar → Examínate». Estudiar no cambia y no se tocó ningún dato
(`js/core/vista-visual.js`, `js/core/mayeutica.js`, `css/components.css`). Versión 20261028-3.
Revisión del encargo: hecha por el director sin agente (arreglo pequeño); el único punto que ningún juez medía
(«comparte resultados») se añadió a la prueba `mayeutica-fichas`.

## Qué no se pudo hacer o leer
Nada. Juicio del profesor sustituido por una captura a 360 px mirada por el director (ahorro: sin contenido nuevo).

## Para el usuario
Probar en el móvil: Libros → Marino → Fundamentos → «Cristaloides» → botón «Mayéutica».

## Visto de paso (no tocado)
- En modo Mayéutica no se ve «Para profundizar» (está en Estudiar).
- Si cambias a Mayéutica a mitad de otro paso, la guía sigue en la pregunta donde la dejaste (no se reinicia).

## Propuestas sobre las reglas
- El encargo daba la ficha de Merino HEMATO por su bloque y no por su clave: el director pasó `--ficha` con un id de
  línea (`mh-glucocalix`) y el juez dio 5 ❌ falsos. Propuesta: el «hecho» de un encargo nombra la clave `--ficha` exacta.

## Vueltas
| Pieza | Vuelta | Nota profesor | Modelo | Pasos | Tokens eq. | Qué falló |
|---|---|---|---|---|---|---|
| Pestaña + prueba | 1 | — (sin juicio) | sonnet | 20 | 351 k | nada |

## Gasto
Agentes: 351 k (constructor sonnet, 20 herramientas, 100 %). Director ≈0,3 M aparte (sin medir).

## Cuentas
Presupuesto 1,0 M (constructor 0,5 · profesor 0,2 · director 0,3). Recortes: sin revisor del encargo, sin auditor, sin
verificador, sin profesor. Gastado ≈0,65 M (agentes 0,35). Desvío −35 %: el encargo de una pieza y con archivos y
funciones exactos. Se carga al presupuesto de `b3-paso4`.
