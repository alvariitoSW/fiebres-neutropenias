# Partes de sesión

Uno por sesión del plan socialista: `AAAA-MM-DD.md` (si hay dos el mismo día, `AAAA-MM-DD-2.md`). Lo escribe el
director al terminar, aunque la sesión falle o no haya nada que hacer. Formato:

```
# AAAA-MM-DD · <clave de la tarea, o «sin tareas»>

**Resultado:** en revisión (PR: <enlace>) | necesita humano | fallida | sin tareas pendientes
**Vueltas:** N · **Jueces:** pruebas ✓/✗ · móvil ✓/✗ · auditoría ✓/✗

## Qué se hizo
2-4 líneas en lenguaje llano.

## Qué no se pudo hacer o leer
Fuentes que no se abrieron, pasos que fallaron. Nunca se omite.

## Para el usuario
Lo que tiene que revisar o decidir.

## Visto de paso (no tocado)
Problemas encontrados fuera de la tarea.

## Propuestas sobre las reglas
Si alguna regla falló o faltó (el agente no las edita; las propone aquí).

## Vueltas
Una fila por vuelta (REGLAS §4.8 R9 y R10): pieza · vuelta (n.º de 3, corta o normal) · punto(s) por debajo de 9,5 con
su nota antes → después · receta (enlace a la sección «Receta») · modelo del constructor · pasos · tokens
equivalentes · qué falló. Si un punto no sube tras su receta, se dice: la receta no era concreta.

## Receta
La del profesor (R10), por punto: criterio de 9,5 · criterio de 10 · cumplido ✓/✗ con su captura o juez.

## Gasto
`node autonomo/gasto.mjs --clave <clave>`: total en tokens equivalentes, la tabla «Por papel» y los 3 agentes que más
gastaron. Una línea: dónde se fue el gasto y cómo se ahorraría la próxima vez. Al cerrar un bloque, la nota media
del profesor del bloque (Hacienda; REGLAS §4.8 R10).
```
