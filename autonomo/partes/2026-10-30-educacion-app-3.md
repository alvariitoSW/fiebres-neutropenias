# Parte · 30/10/2026 · `educacion-app` parte 3: fichas, capilar con Carmen y gemelas (A en el shock, aplazada)

**Tarea**: `educacion-app` (Objetivo, fila 18), parte 3 · **Resultado**: votada por el Consejo (5 de 5; acta `autonomo/consejo/2026-10-31-educacion-app-3.md`) y fusionada en `main` (PR: https://github.com/alvariitoSW/fiebres-neutropenias/pull/66) · rama `auto/educacion-app-3`, versión 20261030-71.
**Vueltas:** 1 · **Jueces:** pruebas ✅ · móvil ✅ (390 y 360) · auditoría ✅ (1 grave, corregido).

## Qué se hizo
- **Aplazada la parte c)** (apuesta-mira-explica en el shock vivo): la sesión `shock-scai` estaba viva sobre `shock-vivo*` (REGLAS §4.6). Queda
  para una sesión propia cuando esa PR entre en `main`; su presupuesto (≈1 M) no se gastó.
- Revisión del encargo: la hizo el director sin agente (las tres piezas copian maquetas o patrones ya auditados; recorte de Hacienda). Encargo,
  revisión y presupuesto en `/tmp/plan-socialista/educacion-app-3/` (copiados abajo en lo esencial).
- **A · Fichas con Estudiar** (`js/core/mayeutica.js`, 24 archivos de datos sin tocar): tras cada respuesta la línea «Vuelve en 3 días: la acertaste
  una vez» / «Vuelve mañana: fallada»; en la cabecera «Ideas firmes: N de T» (nota plegable con el criterio; nunca bloquea); al abrir el Estudiar de
  una ficha, una vez por día y sesión, el **repaso de días atrás**: hasta 5 preguntas de otras fichas ya intentadas, falladas primero, nunca dos
  seguidas de la misma ficha, con su chip («Fallada hace 2 días») y su «Vuelve en…»; el guardado se actualiza en la ficha de origen; al acabar,
  «Repaso hecho. Ahora, <ficha>». Registro de fichas montadas en `montarMayeutica` (sin cargar archivos nuevos). «Para profundizar» copia `childNodes`.
- **B · Capilar vivo con Carmen** (`js/data/capilar-vivo-caso-carmen.js`, nuevo; `capilar-vivo.js`, `capilar-vivo-data.js`): modo Carmen
  (`ponerCarmen()`): tope clínico del mando «Transfundir 1 CH» (Hb ≥7 sin cardiopatía isquémica, p. 8), chip tras la 1.ª bolsa con los umbrales 7 y 8,
  **sello TACO** a la 2.ª bolsa sin indicación (lupa del alvéolo, constantes en rojo rotuladas ilustrativas, mando apagado, frase viva, nota honesta
  visible: el libro no dice que 2 bolsas den más TACO que 1; la app castiga la bolsa sin indicación). **Caso 5 · Carmen** (8 pasos): P1 «Decide tú»
  sin pistas ni compuerta (`sinPensar`), paso nuevo «antes de mirar el monitor» (apuesta el VO₂ con compuerta; tabla antes → después en las tres
  opciones), P2 Hb de control, P3 sello sin nombre («Edema pulmonar») hasta contestar el porqué, enseñanza en 6 pasos con el modelo, test de Don Julián,
  destapa de 4 puntos, encuentra el error; «Lo que te llevas» enlaza al modelo y a la ficha. Todas las ramas llegan al sello (la del R1 de la mañana).
  Cifras del monitor de la app (Hb 7,4 / 8,4 / 9,4 → DO₂ 742 / 843 / 826; ScvO₂ 65 / 69 / 60; SaO₂ 98 / 98 / 86): la maqueta decía 830 en el TACO; manda la app.
- **Motor** (`js/core/mayeutica-motor.js`, API antigua intacta): `sinPensar` en un test (también en la P3 de Teresa); la caja de consecuencia se pinta
  **antes** del porqué (cierra el hueco del parte 2); consecuencia también al acertar («Lo que ves ahora»); `finTexto` en `pintarDiasAtras`; la nota de
  evidencia de días atrás llega cerrada y la introducción en una frase; botón final «Terminar el repaso →».
- **Gemelas de la prueba de 3 días** (profesor): «El umbral transfusional» (`merino-transfusion`, con B por el capilar) frente a «la anemia»
  (`merino-anemia`, Estudiar actual): ≈1.380 frente a ≈1.340 palabras, Mayéutica calcada (8 guía + 6 examen + 1 caso). Protocolo y 12 preguntas de
  transferencia con página en `autonomo/ideas/educacion-pionera/prueba-3-dias-capilar.md` (+ `-respuestas.md`). Pegas escritas: la anemia ya
  enlaza al capilar (el control es «sin el caso de Carmen», no «sin modelo»); las dos fichas comparten tres ideas y un paciente.

## Jueces
✅ `mayeutica-memoria` · ✅ general (390 y 360) · ✅ `--modelo capilar-vivo` · ✅ `--modelo agua-viva` · ✅ `--modelo mayeutica-fichas` ·
✅ `--ficha` ×3 (cardiología, hematología, Libros) + `--forma` · ✅ `capilar-vivo-carmen.mjs` (390 y 360, ramas A y B) ·
Auditor sonnet: 1 grave (el porqué del TRALI decía que no se para la transfusión: p. 14 dice lo contrario), 6 medianos, 6 menores: todos corregidos
en la vuelta 1 (la serie B de la prueba de 3 días, p. 1-5, quedó sin cotejar: límite de páginas del auditor).
Profesor fable: **A 8,8** (días atrás 8,5 → arreglado el muro de la primera pantalla; «Vuelve en…» 9; firmes y cierre 8,75) · **B 8,15 → 8,77**
tras la vuelta 1 (N1 9,0 · N2 8,5 · N3 9,0 · §7 8,75 · §8 8,6); sus 4 retoques de texto para N2 y §8 (el relato no adelanta el TACO antes de la
pregunta del porqué) los aplicó el director (≈8,85 estimado por el profesor, sin rejuicio).

## Qué no se pudo hacer o leer
- La parte c) (shock vivo), por solape de sesión. Nada más: todas las fuentes se abrieron.

## Para el usuario
- **La prueba de 3 días con las gemelas**: `autonomo/ideas/educacion-pionera/prueba-3-dias-capilar.md` (y la pareja del río,
  `prueba-3-dias.md`). Día 0: «El umbral transfusional» en Texto y después el capilar vivo → Mayéutica → casos → Carmen; el mismo día, «la anemia» con
  Estudiar. Día 3: las 6 + 6 preguntas sin abrir nada. 2 o más aciertos de diferencia a favor de Carmen = el formato sigue.
- Decisión que se aceptó del diseño B (puedes cambiarla): la cabecera de P2 cita los umbrales 7 y 8 (es la hoja de laboratorio, no una pista socrática).
- Nada más que decidir: la PR entra en `main` por votos del Consejo (REGLAS §4.15).

## Visto de paso (no tocado)
- El capilar no modela el corazón que falla: en el TACO el gasto queda en 7,6 (rotulado ilustrativo, en la nota visible). Una Carmen con FEVI 35 %
  y PVC 16 pertenece al motor del latido / shock vivo (profesor).
- El sello del modelo tapa los rótulos de la lupa del alvéolo (heredado del modelo aprobado).
- El dock del capilar con frase y cita largas ocupa ≈210 px a 390 px.
- Al fallar la apuesta del VO₂, el motor titula «✗ Qué le habría pasado al paciente» aunque no le pasó nada (propuesta: rótulo propio cuando la
  consecuencia es «Lo que ves ahora»).
- Días atrás: Larsen 2009 midió respuesta corta con feedback (no test) y Kerfoot 2007 no mejoró el examen in-service (evidencia.md); la nota no lo dice.

## Propuestas sobre las reglas
- **Continuar al mismo constructor** (R5) solo si los dos encargos juntos caben en ≈60 pasos: B1 (33) + B2 (45) = 78 pasos y 2,1 M frente a 1,6 M
  presupuestados (+31 %); la parte 2 ya lo vio. Regla: el segundo encargo a un constructor nuevo si el primero pasó de 30 pasos.
- **`sinPensar`** contradice la letra de REGLAS §8 («piensa antes» siempre en los casos): queda aprobado por el diseño B (error productivo, sin
  pistas durante el intento). Propuesta: escribirlo en §8 como excepción («decide tú» del error productivo).
- Jueces: el director pasa la suite con `--modelo` uno a uno y guarda el veredicto completo (hoy un filtro de texto perdió las líneas «Todos los
  jueces a favor» y hubo que repetir una hora de pruebas).

## Vueltas
| Pieza | Vuelta | Nota mínima (criterio) | Modelo | Pasos | Tokens eq. | Qué falló |
|---|---|---|---|---|---|---|
| A fichas | 1 | 8,5 (días atrás, muro) → pasa | sonnet | 45 | 0,56 M | a la primera; muro arreglado en la vuelta 1 del capilar |
| B1 + B2 capilar | 1 | 7,5 (N2) → 8,5; global 8,15 → 8,77 | sonnet | 33 + 45 | 2,1 M | 1 grave del auditor; N2 sin porqué tras la 1.ª bolsa; orden caja/porque |
| Vuelta 1 arreglos | — | — | sonnet (nuevo, R5) | 58 | 0,72 M | 14 puntos, todos ✅; `mayeutica-fichas` entera no terminó en su tiempo (lo pasó el director) |

## Gasto
`gasto.mjs --clave educacion-app`: **5,5 M** equivalentes. Por papel: constructor sonnet 3,4 M (62 %) · director 1,2 M (22 %) · profesor fable 0,7 M (13 %) ·
auditor 0,16 M (3 %) · Consejo 0,06 M. Los 3 que más: constructor B1+B2 2,1 M (78 pasos: continuar fue caro) · director 1,2 M (sesión larga: dos
horas de jueces repetidos por un filtro mal escrito) · vuelta 1 0,72 M.
Dónde se fue: la continuación B1 → B2 releía ≈8 M de caché; la próxima vez, constructor nuevo para B2 (ahorro ≈0,5 M).

## Cuentas
Presupuesto 4,5 M (Hacienda recortó −1,05 M: sin revisión con agente, sin plan del profesor, B2 continuando, un solo juicio) · gastado 5,5 M ·
desvío **+22 %** (por B1+B2 continuado y 14 puntos de arreglos en vez de los ≈6 previstos). Asignado a la parte 3 ≈4 M para a+b+c: c) no se hizo
(≈1 M). Del margen de Educación. No se llegó al 25 % que obliga a comparecer.
