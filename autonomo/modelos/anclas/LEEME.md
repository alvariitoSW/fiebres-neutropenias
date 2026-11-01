# Anclas de 10 del profesor

Capturas congeladas a 390 px (JPEG q70) que fijan qué es un **10** en cada punto de `autonomo/REGLAS.md` §7 y §8
(«Cómo se juzga»): el 10 es «como su ancla»; el 9,5, «como el ancla con un solo fallo pequeño y nombrado».
El profesor las mira al lado de la captura que puntúa.

| Punto | Ancla (archivo de la app) | Captura | Cómo llegar en la app | Por qué es el 10 | Calibración |
|---|---|---|---|---|---|
| 7.1, 7.13 | Atlas de eco, cap. Insuficiencia mitral (`eco/atlas/cap-mr.html`) | `7-1-13-atlas-im.jpg` | Eco cardíaca → Atlas → Insuficiencia mitral (primera pantalla) | «En 30 segundos» con cifras y fuente arriba; el hueco del ecógrafo avisa «en preparación» | 9,0 / 9,0 (sin figura: ecógrafo «en preparación»; fallo del modelo, sin alternativa de 10 hoy) |
| 7.7 | Misma ficha a 360 px | `7-7-atlas-im-360.jpg` | Igual, con pantalla de 360 px | Sin desborde ni cortes a 360 px | 9,5 (no prueba figura ni mando a 360) |
| 7.3 | Ficha Trombocitopenia y HIT, Merino HEMATO (`merino-hemato.html`) | `7-3-4ts.jpg`, `7-3-4ts-calculadora.jpg` | PIF → Hematología → Merino HEMATO → Ficha 4; la calculadora con riesgo alto (>50 %, día 5-10, trombosis nueva, sin otra causa = 8 puntos) | Idea arriba, bloques con resaltes, y la escala 4Ts calcula con su origen y página | 10 |
| 7.2 | Misma ficha, bloque «Manejo según el riesgo» | `7-2-4ts-manejo.jpg` | Ficha 4 → bajar a «Manejo según el riesgo» | Conducta por riesgo con página | 9,5 (conductas en chips de 3 líneas, mejor `kv-row`) |
| 7.6 | Vista Visual de esa ficha (`merino-hemato/visual.js`) | `7-6-visual-4ts.jpg` | Ficha 4 → Estudiar → Paso 1 · Mira → tocar el nodo «Fibrina» | Nodo abierto con su detalle y «Ver en el texto ↓» | 9,5 (cajas con flechas, sin dibujo; detalle sin página) |
| 7.4, 7.8 | Nefrona viva (`nefrologia/nefrona-viva.js`) | `7-4-nefrona.jpg` | Nefrología → Fisiología renal → Nefrona viva (furosemida); bajar al panel «Situación» | Modelo grande en el estado del tema; mandos Situación y Fármaco | 10 |
| 7.5 | Nefrona viva, frase viva | `7-5-nefrona-frase.jpg` | Igual, bajar a «Qué está pasando · Furosemida» | Frase del estado con «Texto ↓» y enlace a la ficha | 9,5 (frase viva sin un solo resalte) |
| 7.4, 7.5 | Atlas cap. 14, VD (`eco/atlas/cap-vd.html` + `vd.mjs`) | `7-5-atlas-vd-signos.jpg` | Eco cardíaca → Atlas → 14 · Ventrículo derecho (TEP agudo, mando al 66 %) → «Signos de sobrecarga del VD (ESC 2019)» | Signos con sí/no/«el modelo no lo da», y hallazgo con su aviso | 10 (7.4 y 7.5; ancla principal de 7.5) |
| 7.9 | Capilar vivo (`libros/capilar-vivo.js`) | `7-9-10-capilar.jpg` | Libros → Modelos vivos → Capilar y oxígeno → «Anemia que compensa» | Frase viva con fuentes y «Ver en la ficha» | 10 |
| 7.10 | Capilar vivo con «Explícamelo» | `7-10-capilar-explicame.jpg` | Igual → «Explícamelo →» → Siguiente (paso 2 de 4) | Explicación guiada que señala el dibujo (lupa), con fuente y salto a la ficha | 10 |
| Mecanismo animado | Receptores animados (`cardiologia/receptores-animados.js`) | `mecanismo-receptores.jpg` | Cardiología → Merino Cardiología → Vasopresores → Receptores; norepinefrina, dosis >10 µg/min; Paso 4 de 5 | Paso a paso con la cascada encendida | 9,0 (nota de fidelidad de ~8 px suelta; mandos bajo la figura) |
| 8 | Estudiar de una ficha (`data/mayeutica/b1-fluidos.js`) | `8-estudiar-b1.jpg` | Libros → Marino Fundamentos → Cristaloides → Mayéutica | Piensa antes, opciones, porqué de cada una, fuente y salto al modelo | 9,5 (conjunto §8) |
| 8 | Examen fallado en esa ficha | `8-examen-fallado.jpg` | Igual → Paso 4 · Examínate, contestar mal | «Qué le habría pasado al paciente» + explicación con fuente | 9,5 (conjunto §8; la captura corta «Ver en el texto») |
| 8 | Caso clínico en curso (`modelos/preguntas-para-estudiar.html`) | `8-caso-clinico.jpg` | Abrir el archivo con el servidor; pulsar Siguiente hasta el test | Paciente que evoluciona, datos nuevos marcados, test con «piensa antes» | 9,5 (maqueta l. 236: «Heparina … desde hoy» se arrastra hasta el alta) |
| 8 | Caso: «encuentra el error» | `8-caso-error.jpg` | Mismo archivo, paso del plan del R1 → Corregir | Frases falsas con su corrección | 9,5 (conjunto §8) |
| 8 | Caso: final | `8-caso-final.jpg` | Mismo archivo, último paso | «Lo que te llevas» y salto a la ficha | 9,5 (conjunto §8) |

7.11 se juzga con el capilar vivo (`js/data/capilar-vivo-data.js`, capturas `7-9-10-capilar.jpg` y `7-10-capilar-explicame.jpg`) y
7.12 con la nefrona viva (`7-4-nefrona.jpg`, `7-5-nefrona-frase.jpg`), salvo que el profesor proponga otra.

**Regenerar**: `node autonomo/modelos/anclas/capturas.mjs [parte-del-nombre ...]` (levanta su servidor, 390×844 y 360×844,
cierra todo al acabar). **Calibración**: única; se repite solo si cambia `.claude/agents/profesor.md` o su modelo.
Si una ancla no da 10, se cambia por otra candidata de la app y se anota aquí en «Calibración».

## Calibración única (01/11/2026, profesor, 2 vueltas)

Dan **10**: 7.3 (4Ts), 7.4 y 7.8 (nefrona), 7.4 y 7.5 (atlas VD), 7.9 y 7.10 (capilar). Son las anclas de 10.
El resto se queda como **ejemplo de 9,5** (o de 9,0) con su fallo nombrado: el fallo está en el modelo de la app, no en
la captura, y la tarea no toca la app. Hasta que se arreglen, para esos puntos el 10 es «su ancla sin el fallo nombrado».
Arreglos que darían el 10 (a la bitácora, B-052): carril «En 30 segundos» bajo la figura de `cap-vd.html` (7.1 y 7.13);
nota de fidelidad de los receptores en `<details class="nota-plegable">` y mandos encima de la figura (mecanismo);
«desde el día 1 (sin exposición previa)» en la maqueta de preguntas, l. 236 (§8); selects de la 4Ts que no corten a
390 y luego captura a 360 (7.7); conductas de la 4Ts en `kv-row` (7.2); resaltes en la frase viva de la nefrona (7.5).
