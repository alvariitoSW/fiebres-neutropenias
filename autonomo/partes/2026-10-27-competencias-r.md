# 2026-10-27 · competencias-r

**Resultado:** hecha a medias (en main) · R2-R5 necesita humano
**Vueltas:** 0 · **Jueces:** no aplica (no toca la app)

## Qué se hizo
Informe-mapa para el móvil (`autonomo/ideas/competencias-r.html`, Artifact https://claude.ai/artifact/PzttLXc1yuWpSdwiQE5R2N):
arriba, «antes de tu primera guardia sin R mayor» con lo que le preocupa al usuario (shock, vía aérea, parada,
neurocrítico) cruzado con lo que ya hay en la app; el mapa de R1 desde el PIF (PFI-UMI-R1-01); los temas de UCI que
ya cubre la app; y 6 tareas con su gasto estimado. Respuestas del usuario: no tiene documento de R2; le preocupan las
cuatro áreas. Revisión del encargo (§4.9): hecha por el director sin agente (informe sin app, barato).

## Qué no se pudo hacer o leer
- El BOE, sanidad.gob.es, cobatrice.esicm.org y PubMed devuelven 403 en el proxy: **no se leyó ninguna fuente de
  R2-R5**. Por búsqueda: Orden PJC/564/2026, de 4 de junio (BOE 6/6/2026, ref. BOE-A-2026-12185, sin confirmar) y
  CoBaTrICE (Intensive Care Med 2006;32:1371-83; 102 competencias, 12 dominios, sin confirmar). R2-R5 queda en hueco,
  sin competencias inventadas.

## Para el usuario
- Mandar dos PDF a `docs/`: la Orden PJC/564/2026 (programa de Medicina Intensiva) y el programa CoBaTrICE
  (`COBATRICE_SYLLABUS_2006_with_2021_updates.pdf`). Con ellos, tarea nueva «mapa R2-R5» (≈1-1,5 M).
- Elegir orden: G2 parada (≈6-8 M), G1 shock (≈6-8 M), vía aérea «voy a intubar» (nueva, ≈2-3 M), G5 neurocrítico
  (aparcada, ≈5-7 M).

## Visto de paso (no tocado)
- El PIF de R1 es de 2016 (rev. 1) y el programa oficial cambió en junio de 2026: puede que el plan del hospital se
  actualice; preguntar en docencia.

## Propuestas sobre las reglas
- Si una tarea depende de webs que el proxy bloquea (boe.es, esicm.org, pubmed), pedir el PDF al usuario en la misma
  pregunta del arranque, no después.

## Vueltas
Sin vueltas (informe).

## Gasto
Total **348 k** equivalentes (`gasto.mjs --clave competencias-r`).

| Papel · modelo | Lanzados | Equivalente | % |
|---|---|---|---|
| Explore · sonnet | 1 | 136 k | 39 % |
| general-purpose · sonnet (búsqueda web) | 1 | 109 k | 31 % |
| director · opus | 1 | 103 k | 30 % |

Dónde se fue: la búsqueda web gastó 109 k sin poder abrir nada (proxy). La próxima vez, probar primero con un `curl`
de 1 segundo si el dominio responde antes de lanzar el agente.
