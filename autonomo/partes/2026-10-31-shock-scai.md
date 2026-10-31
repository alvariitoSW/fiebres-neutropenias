# 2026-10-31 · shock-scai

**Resultado:** hecha · [PR #75](https://github.com/alvariitoSW/fiebres-neutropenias/pull/75) fusionada por el Consejo (acta `autonomo/consejo/2026-10-31-pr75.md`) · rama `auto/b3-scai` (desde `auto/b3`, con `main` fusionado tras la PR #51)
**Vueltas:** 3 (auditoría, profesor, jueces) · **Jueces:** suite general + `--ficha` IC + `--modelo shock-vivo` + `--forma`: 497 ✅, 0 ❌ · auditoría ✓ (0 graves, 7 menores arreglados) · profesor 9,0 · 8,75 · 8,9

## Qué se hizo
- **Rótulo «SCAI · letra · nombre»** junto al veredicto del shock vivo, con su porqué en una frase y las cifras del monitor
  (`js/modules/libros/shock-vivo/scai.mjs`). Las reglas del modelo van rotuladas como tales sobre la ESC 2026 de IC (parte 1,
  pdf 44): Tabla 13 (A-E) y lactato >2 mmol/L del texto 7.3.4. Si sigue una intervención, no baja a A: «C · en respuesta».
  D: varias intervenciones recién puestas. E: varias intervenciones, horas y lactato que no baja.
- **Botón «Ver la escala SCAI (ESC 2026)»**: abre la ficha de IC y resalta su tabla (`id="ic-scai-tabla"`), sin duplicarla.
- **Mayéutica** (`js/data/shock-vivo-scai.js`):
  - S1-S4: estadio SCAI; «encuentra el error» del estadio B; ECMO con el VI que no se vacía → descargar con Impella o balón
    (Marino pdf 48-49).
  - **Segundo caso: Fermín, infarto del VD**, en 5 pasos: reconocer («piensa y destapa»), volumen con juicio, dobutamina,
    «encuentra el error» con la nitroglicerina y el O₂, y soporte solo si no responde. Fuentes: Marino caps. 14-17 pdf 40-45,
    Marino caps. 18-21 pdf 45-46 y ESC 2026 pdf 44 (7.3.2).
  - El «nuevo» en rojo marca solo lo que cambia, también en el caso de Aurelio.
  - Al terminar, el caso abre el modelo con su propio paciente.
- La nota de ECMO + Impella ya estaba en los estados `ecmo-carga` y `ecmo-cerrada`, con su cita: no se tocó.
- Revisión del encargo: Marino no trae el manejo del VD. Se buscó y se citó otra fuente (ESC 2026 7.3.2 y Marino cap. 19, sobre
  la nitroglicerina), sin preguntar.

## Qué no se pudo hacer o leer
- **Pregunta de la succión del Impella: no se escribió.** Ninguna fuente abrible la trae (Marino solo dice «suction» en la MCH,
  p. 39, y en el balón, p. 45).
- El estadio B no aparece de forma natural en ningún paciente del modelo (la hipotensión ya llega con lactato >2). Se enseña con
  un «encuentra el error» de enunciado fijo.
- La letra E en el monitor: con Aurelio en NA + dobutamina + ECMO, el lactato baja a las 5 h. E solo se prueba en la función pura
  (`autonomo/pruebas/scai-puro.mjs`).

## Para el usuario
- Libros → Shock vivo → rótulo SCAI bajo el veredicto (mueve gravedad y fármacos) → «Ver la escala SCAI».
- Estudiar → el caso de Fermín entero.
- `mv-papel-shock` (fila 2 del Objetivo C, «se suma a `shock-scai`») no se hizo aquí. Es una tarea de fase A que sigue pendiente.

## Visto de paso
- **Arreglado** (bloqueaba los jueces): la tabla «Presentación clínica — 4 categorías» de la ficha de IC desbordaba 28 px a 360
  (ya en `main`); ahora va dentro de un `<div style="overflow-x:auto">`.
- Para una tarea futura (profesor, rejuicio): en CF1 sale dos veces «Ver en la ficha: Fallo del corazón derecho» (falta quitar
  duplicados en `verEnTexto` de `mayeutica-shock.js`); en CF2 sale dos veces «inferencia (fisiología general)»; CF1 podría pedir
  el cociente PVC/PCP antes de destapar; la E podría exigir además PAM <65 o lactato que sube.
- Juez Móvil intermitente en el shock vivo: «mando no tocable «Mateohemorragia» [Explorar·tapon]». Sale con la máquina cargada.
  No se reprodujo solo, ni en `main` ni en la rama (2+2 pasadas verdes).

## Propuestas sobre las reglas
- **Esperas en los programas del director**: `pgrep -f`/`pkill -f` con el patrón dentro del propio comando se encuentran a sí
  mismos. Una espera no terminó nunca y una suite se mató sola. Propuesta: esperar por PID guardado (`$!`), nunca por patrón.
- **Pruebas largas una vez por vuelta**: la vuelta de la auditoría gastó 1,7 M (1,1 M de caché escrita) repitiendo la prueba
  del shock vivo. Que el encargo de un constructor diga siempre «las pruebas largas una vez, al final» (como en `reglas-30-10`
  para los estados).

## Vueltas
| Pieza | Vuelta | Nota mínima | Modelo | Pasos | Equiv. | Qué falló |
|---|---|---|---|---|---|---|
| Rótulo SCAI + enlace | 1 | 9,0 | sonnet | 55 | 0,54 M | — |
| Mayéutica S1-S4 + Fermín | 1 | 8,0 (Fermín) | sonnet | 62 | 1,6 M | caso solo en test, final abría a Aurelio, todo «nuevo» |
| Arreglos de la auditoría | 2 | — | sonnet | 47 | 1,7 M | 7 menores de citas; pruebas repetidas |
| Vuelta del profesor | 3 | 8,9 | sonnet | 72 | 0,83 M | — |
| Arreglo de los jueces | 4 | — | sonnet | 20 | 0,44 M | prueba mal planteada (E a las 5 h) |

## Gasto
**8,1 M equivalentes.** Por papel: constructor (sonnet) ×6, 5,1 M (62 %) · director (opus) 2,2 M (28 %) · profesor (fable) ×2,
0,55 M · auditor 0,15 M · revisión del encargo 0,13 M. Los 3 que más gastaron: el director (2,2 M), los arreglos de la auditoría
(1,7 M) y la Mayéutica (1,6 M).
Dónde se fue: los constructores repitieron la prueba larga del shock vivo varias veces por vuelta (los arreglos de la auditoría:
1,1 M de caché escrita para 7 menores de texto), y el director gastó en esperas largas y en dos esperas rotas por `pgrep -f`.
La próxima vez: las pruebas largas, una vez y al final de cada encargo; las esperas, por PID; y los menores de texto de una
auditoría, en el mismo encargo que la vuelta del profesor.

## Cuentas
| | M |
|---|---|
| Presupuesto inicial (agentes 2,8 + director 0,9) | 3,9 |
| Recortes de Hacienda | sin revisor ni verificador; profesor en juicio rápido; auditor solo de lo nuevo |
| Aprobado por el usuario al comparecer (2 veces) | ≈6-6,2 → ≈7,4 |
| **Gastado** | **8,1** (+108 % sobre 3,9; +9 % sobre los 7,4 aprobados: las esperas del director) |
| Bloque `b3-paso4` | techo ≈51 M; esta tarea se carga ahí |
