# Parte · 30/10/2026 · `educacion-app` parte 1: el motor

**Tarea**: `educacion-app` (Objetivo, fila 18), parte 1 · **Estado**: hecha, en `main` (511946f, versión 20261030-9).
La tarea sigue `en curso`: parte 2 (río y mar) en una sesión nueva; capilar, fichas y shock tras el `b3`.

## Qué se hizo
- Consejo 5.ª (acta `autonomo/consejo/2026-10-30-5.md`), a petición del usuario («que el trabajo no esté
  paralizado»): motor y río y mar hoy desde `main`; lo que toca archivos del `b3` espera.
- Revisión del encargo: la hizo el director sin agente (pieza de motor <2 M, sin contenido médico nuevo).
- `js/core/mayeutica-motor.js` (544 → 648 líneas): cada pregunta guarda `ultimo` (día local), `dias` (días distintos
  con acierto) y `diaOk`; los registros viejos quedan «sin fecha» y nunca tocan. Reglas puras: intervalo 1/3/7/14
  días (`diseno-c.md`), `toca`, `firme`, `chipDiasAtras`, `lineaVuelve`, `elegirDiasAtras` (máx 5, nunca dos
  seguidas de la misma ficha). `Progreso.firmes()`. Línea «Vuelve en…» tras cada respuesta de los modelos vivos.
  Indicador «Ideas firmes: N de T» en el inicio de la Mayéutica de cada modelo vivo (nota plegable: criterio de la
  app, sin prueba propia; nunca bloquea). Pantalla `pintarDiasAtras()` lista, sin consumidor todavía.
- Pruebas nuevas: `autonomo/pruebas/mayeutica-memoria.mjs` (reglas, node) y `mayeutica-memoria-nav.mjs` (navegador).
- No se tocó `js/core/mayeutica.js`: las fichas reciben la línea, el indicador y la pantalla tras fusionar el `b3`.

## Jueces
✅ general (390 y 360) · ✅ `--modelo agua-viva` · ✅ `--modelo capilar-vivo` · ✅ `--modelo mayeutica-fichas` ·
✅ `mayeutica-memoria`. El director vio las capturas del río y mar (inicio con «Ideas firmes: 0 de 14»; «Vuelve en 3
días: la acertaste una vez»).

## Vueltas
| Pieza | Vueltas | Por qué |
|---|---|---|
| E1 + E2 | 1 | a la primera |

## Cuentas
Presupuesto 1,8 M (E1 0,8 · E2 0,6 · director 0,4) · gastado **1,1 M** (constructor 0,64 · director 0,34 · Consejo
0,09) · desvío −39 %. El mismo constructor hizo E1 y E2 (continuado con SendMessage): no releyó el motor.

## Para el usuario
- Nada que decidir. Lo verás en cualquier modelo vivo de Libros → Mayéutica.

## Propuestas sobre las reglas
- Continuar al mismo constructor para el segundo encargo de una pieza partida (si lleva <60 pasos) ahorró la relectura.
