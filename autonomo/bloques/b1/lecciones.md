# Lecciones del bloque 1 de Marino (aprobadas por el usuario el 20/10/2026)

Lo que falló o hubo que rehacer para terminar el bloque 1, y lo que cambia para los siguientes. Página para el usuario:
https://claude.ai/artifact/JZfDxXWQfrAEb7Cuz5jkbg. Cada lección dice dónde quedó escrita.

**Cifras del bloque 1**: 23 fichas con Mayéutica; 5 modelos vivos nuevos y la capa de lectura del motor del corazón;
13 graves cazados por el auditor antes de llegar al usuario, ninguno de dosis en la app; ~2 vueltas por pieza; ~4 h
de agentes parados por el límite de uso.

| # | Qué pasó | Qué cambia | Dónde |
|---|---|---|---|
| 1 | Frases que el libro no dice (FP4, «CK ↑», «la inflamación ha cedido», «la biopelícula se queda») | El constructor entrega la lista de sus frases nuevas con página; el auditor la coteja | REGLAS §1.11 · constructor · auditor |
| 2 | Cifras ciertas en otro contexto (100 mL/s de un 14 G puesto a 18 G; enclavamiento > diastólica pulmonar) | Cada cifra en su contexto; cada paso del caso, un paciente posible | REGLAS §1.12 · constructor · profesor · auditor |
| 3 | «Discrepan» cuando la fuente calla; opinión del autor como regla; frase literal marcada como error | Tres tipos de nota: discrepan / no lo dice / opinión del autor | REGLAS §1.13 · constructor · auditor |
| 4 | La correcta se adivinaba (más corta 60 %; posición 2 en 10/17) | Más larga ≤ ⅓, más corta ≤ ⅓, ninguna posición > ½, 0-2 errores | REGLAS §8 · constructor · `jueces.mjs` (forma) |
| 5 | Nombres internos a la vista (mar-…, §, Caso E1, notas del plan) | Barrido del texto visible | REGLAS §2.7 · constructor · `jueces.mjs --forma` |
| 6 | Rótulos de 4,4 px y pisados (telar) | ≥ 7,5 px a 390 y sin solaparse | REGLAS §2.8 · constructor · `jueces.mjs --forma` |
| 7 | El móvil enseñaba versiones viejas (no cargaba; no salía la Mayéutica) | Versión en todas las piezas y visible en el menú | Tarea técnica (versión en todas las piezas) |
| 8 | Piezas comunes tarde (tres camas; tres motores de Mayéutica) | El profesor nombra las piezas comunes; se hacen primero; un solo motor de Mayéutica | Profesor (cobertura) · skill · tarea técnica |
| 9 | Pacientes repetidos con datos distintos (Andrés 40/62, Lucía 55/58) | Lista de pacientes en el encargo | REGLAS §8 · profesor · `bloques/LEEME.md` |
| 10 | Ramas que chocaban (final del CSS, ficha, `?v=`) | Huecos marcados por el director; solo él sube `?v=` y decide el orden de fusión | REGLAS §4.6 · constructor · skill |
| 11 | El límite de uso paró 5 agentes a la vez (~4 h) | ≤ 3 agentes pesados; encargos de una pieza; copia de seguridad del director | REGLAS §4.6 · skill |
| 12 | Pruebas de navegador que fallan con la máquina cargada | Jueces completos al final y solos; repetir el fallo aislado | REGLAS §4.6 · skill |
| 13 | Un modelo roto tumbaba Libros | Cada modelo arranca por separado (Libros hecho; Nefrología y Eco, pendiente) | REGLAS §2.9 |
| 14 | Archivos temporales pisados; `.ignore` ensuciado | Subcarpeta por agente; gancho de inicio que hace que git no vigile `.ignore`/`.gitignore` | REGLAS §4.4 y §4.6 · `.claude/settings.json` |

**Lo que funcionó y se queda**: el paquete del bloque; cobertura → maquetas → app; dos vueltas de maqueta con
auditor y profesor; auditor «solo lo nuevo»; una prueba por modelo vivo (`--modelo`); una PR por pieza con enlace al
móvil; enlaces preparados a modelos de otra rama (`modeloFuturo`/`modeloVivo`).

**Cómo queda un bloque**: cobertura (con piezas comunes y pacientes) → maquetas (pieza común primero) → revisión
(auditor con la lista de frases nuevas + profesor) → el usuario elige → app (modelos y Estudiar en paralelo, cada uno
en su hueco) → jueces ampliados al final → auditor solo de lo nuevo → arreglos → PR por pieza.
