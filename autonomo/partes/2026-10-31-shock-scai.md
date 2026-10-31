# 2026-10-31 · shock-scai

**Resultado:** en revisión (PR: [enlace al final]) · rama `auto/b3-scai` (desde `auto/b3`, con `main` fusionado tras la PR #51)
**Vueltas:** 3 (auditoría, profesor, jueces) · **Jueces:** `--modelo shock-vivo` ✓ · `--forma` ✓ · suite + `--ficha` IC: ver abajo · auditoría ✓ (0 graves)

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

## Visto de paso (no tocado)
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
| Arreglo de los jueces | 4 | — | sonnet | 20 | [ver Gasto] | prueba mal planteada (E a las 5 h) |
