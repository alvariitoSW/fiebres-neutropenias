# Auditoría ciega G4 (oxígeno, fichas 7-9, Marino cap. 25, PDF págs. 56-73)
Resumen: 1 grave, 3 huecos, 10 menores. Fuente: docs/marino-2024-respiratory-management-caps22-26.pdf (cotejada con pdftotext y las figuras 25.1, 25.2 y 25.6 a la vista).

## Graves
- ❌ tox-c3 (b3d-oxigeno-2.js, paso «Día 2 · laboratorio»). La opción BUENA es «1000 µg al día en sepsis; 200 µg al día, la dosis más alta segura». Fuente p. 70: 1000 µg IV/día «se ha asociado» a mejor supervivencia (ref. 45) y «la dosis más alta considerada segura es 200 µg/día». Son dos cifras que chocan en la misma página (1000 > 200). La app las funde en una sola respuesta «correcta» y a la pregunta «¿qué haces?» da por buena una conducta de 1000 µg IV. La nota plegable dice «las fuentes… no se elige una», pero la respuesta sí elige ambas. Arreglo: preguntar «¿qué dice la ficha?» con las dos cifras y nota «el libro da dos cifras que no encajan», o que la opción buena sea «reponer; el libro da 1000 µg (asociado a supervivencia) y 200 µg (máximo seguro) sin conciliarlas». Además, la nota es del propio libro, no de «fuentes»: ver menor 5.

## Comprobaciones pedidas
1. ✅ «Errata aparente» −64 % (p. 57): el libro compara Hb 15/SaO₂ 0,98 (197) con Hb 7/SaO₂ 0,98 (92). (197−92)/197 = 53,3 %; el 64 % del texto no sale de ninguna base del libro (92/181 daría −49 %). Constructor acierta; la Fig. 25.1 (p. 58) solo trae 197/181/92, sin porcentaje. Nota y nodo Visual correctos, cifra del libro reproducida.
2. ✅ Mascarilla estándar: Tabla 25.2 (p. 62) 35-50 %; texto (p. 61) «máximo ≈60 % en respiración tranquila». Ambas cifras mostradas (o2s-g4 y escalera Visual). Falla solo el rótulo (menor 4).
3. ✅ Selenio: RDA 55 µg, 1000 µg IV/día, máximo seguro 200 µg, rangos 0,96-1,78 / 0,72-1,33 µmol/L, selenito, 1 semana (p. 70) correctos. Cóctel (p. 72): C 1000 mg/8 h, E 1000 U/8 h, Se 200 µg/día, 7 días: correcto en tox-g12 y Visual. E normal 1 mg/dL, déficit <0,5 (p. 70-71): correcto. Único fallo: tox-c3 (grave).
4. ✅/menor: tox-c6 aplica la Ec. 25.3 a Elvira (intubada, SDRA, SpO₂ 97 %). La fuente lo dice en general (p. 72) y no lo condiciona a hipoxemia; no está permitido ni vetado. Pero el respaldo medido es EPOC hipoxémica (Fig. 25.2). Ver menor 9.

## Huecos
- Fig. 25.6 (p. 68) muestra también el ion hidroxilo OH⁻ junto al radical OH• tras el paso del Fe²⁺; el nodo Visual solo pone «hidroxilo (radical)».
- p. 64: la OxyMask «no ofrece otras ventajas sobre el alto flujo nasal»; no aparece en o2s-g7 ni en el Visual.
- p. 64: HFNO 40-60 L/min según fabricante y cánula con extremo cónico: solo en el Visual; ninguna pregunta de la ficha 8 pide el flujo.

## Menores
1. o2i-g3 y o2i-e2 citan p. 58 para «lactato ≤2,0» y «pacientes 6 y 7»: esas filas de la Tabla 25.1 están en la p. 59 (p. 58 trae solo los pacientes 1-5).
2. tox-g11 (frase mal 2 y explicación) cita p. 72 para «lesión similar al SDRA»: está en la p. 71 («PULMONARY OXYGEN TOXICITY»).
3. tox-c2/tox-c5 citan p. 41 («idéntica al SDRA»); tox-g11 cita cap. 25 («similar»). El libro dice dos cosas distintas y no hay nota de fidelidad. «No se puede distinguir» (tox-c5) es inferencia: p. 41 dice «podrían ser el resultado de toxicidad».
4. o2s-g4: rótulo «Las fuentes discrepan» para una incoherencia interna del mismo libro (tabla vs texto). Mejor «el libro no concuerda consigo mismo». (REGLAS §1.13: tipo de nota.)
5. tox-c3: la nota se titula «Nota de fuentes»; es una sola fuente (Marino) con dos cifras.
6. o2s-c2: «gafas a 5 L/min sin humidificar» se marca error; el libro dice «usualmente se humidifica por encima de 4» (p. 61), no una regla estricta.
7. o2i-c3, distractor 1: «el oxígeno no trata el dolor coronario» no está en la fuente (p. 60 dice solo que vasoconstriñe coronarias y puede bajar su flujo). Sin cita y no trivial.
8. tox-g9 explicación: «por eso casi todo el hierro está unido» — el libro dice «puede explicar» (p. 71); se pierde el matiz.
9. tox-c6: añadir «la fuente lo afirma en general (p. 72), probado en EPOC hipoxémica (Fig. 25.2), no en SDRA ventilado»; con SpO₂ ya 97 % el CaO₂ apenas sube (fisiología general, sin cita; buscar en Marino cap. 9, Ec. 9.9).
10. tox-e1, distractor 1: «30 %: dos de cada tres llegan a agua» no cuadra (30 % ROS = 70 % agua). Distractor descuidado, no cambia la respuesta. o2s-c1, distractor 2 (mascarilla estándar ≈50-60 %) es defendible con el «máximo ≈60 %» del texto; su explicación ya lo reconoce.

## Sin hallazgo
Visual g4/g4b: cifras de Tabla 25.2, flujos, PEEP 2-3 cmH₂O, 30 % Vt, ≥95 %/3 %, 20× O₂ del neutrófilo, 60 % de FiO₂, cóctel, Fig. 25.6: coinciden. Fig. 25.2 (45→59→67 mmHg; VO₂ 170/167/168): coincide. Cifras del paciente rotuladas `ilustrativo`/«del caso»: rótulo presente. CaO₂ de Jacinto (150) y Hb 10 (131) bien calculados.

## No comprobado / riesgo
- No se leyeron las fichas HTML (ids `nep-*`) ni se abrió la app; solo los .js. No se contrastó con la web la dosis de selenio (1000 µg), que depende de una única cita del libro.
- No se verificaron los `#page=N` en el navegador, solo la paginación del PDF por texto.
