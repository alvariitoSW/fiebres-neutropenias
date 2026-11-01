# Anclas de 10 del profesor

Capturas congeladas a 390 px (JPEG q70) que fijan qué es un **10** en cada punto de `autonomo/REGLAS.md` §7 y §8
(«Cómo se juzga»): el 10 es «como su ancla»; el 9,5, «como el ancla con un solo fallo pequeño y nombrado».
El profesor las mira al lado de la captura que puntúa.

| Punto | Ancla (archivo de la app) | Captura | Cómo llegar en la app | Por qué es el 10 | Calibración |
|---|---|---|---|---|---|
| 7.1, 7.13 | Atlas de eco, cap. Insuficiencia mitral (`eco/atlas/cap-mr.html`) | `7-1-13-atlas-im.jpg` | Eco cardíaca → Atlas → Insuficiencia mitral (primera pantalla) | «En 30 segundos» con cifras y fuente arriba; el hueco del ecógrafo avisa «en preparación» | 1.ª vuelta: 8,5 / 8,0 |
| 7.7 | Misma ficha a 360 px | `7-7-atlas-im-360.jpg` | Igual, con pantalla de 360 px | Sin desborde ni cortes a 360 px | 1.ª vuelta: 9,0 |
| 7.3 | Ficha Trombocitopenia y HIT, Merino HEMATO (`merino-hemato.html`) | `7-3-4ts.jpg`, `7-3-4ts-calculadora.jpg` | PIF → Hematología → Merino HEMATO → Ficha 4; la calculadora con riesgo alto (>50 %, día 5-10, trombosis nueva, sin otra causa = 8 puntos) | Idea arriba, bloques con resaltes, y la escala 4Ts calcula con su origen y página | 10 |
| 7.2 | Misma ficha, bloque «Manejo según el riesgo» | `7-2-4ts-manejo.jpg` | Ficha 4 → bajar a «Manejo según el riesgo» | Conducta por riesgo con página | 1.ª vuelta: 9,0 |
| 7.6 | Vista Visual de esa ficha (`merino-hemato/visual.js`) | `7-6-visual-4ts.jpg` | Ficha 4 → Estudiar → Paso 1 · Mira → tocar el nodo «Fibrina» | Nodo abierto con su detalle y «Ver en el texto ↓» | 1.ª vuelta: 9,0 |
| 7.4, 7.8 | Nefrona viva (`nefrologia/nefrona-viva.js`) | `7-4-nefrona.jpg` | Nefrología → Fisiología renal → Nefrona viva (furosemida); bajar al panel «Situación» | Modelo grande en el estado del tema; mandos Situación y Fármaco | 10 |
| 7.5 | Nefrona viva, frase viva | `7-5-nefrona-frase.jpg` | Igual, bajar a «Qué está pasando · Furosemida» | Frase del estado con «Texto ↓» y enlace a la ficha | 1.ª vuelta: 9,0/9,5 |
| 7.4, 7.5 | Atlas cap. 14, VD (`eco/atlas/cap-vd.html` + `vd.mjs`) | `7-5-atlas-vd-signos.jpg` | Eco cardíaca → Atlas → 14 · Ventrículo derecho (TEP agudo, mando al 66 %) → «Signos de sobrecarga del VD (ESC 2019)» | Signos con sí/no/«el modelo no lo da», y hallazgo con su aviso | 10 (7.4) |
| 7.9 | Capilar vivo (`libros/capilar-vivo.js`) | `7-9-10-capilar.jpg` | Libros → Modelos vivos → Capilar y oxígeno → «Anemia que compensa» | Frase viva con fuentes y «Ver en la ficha» | 10 |
| 7.10 | Capilar vivo con «Explícamelo» | `7-10-capilar-explicame.jpg` | Igual → «Explícamelo →» → Siguiente (paso 2 de 4) | Explicación guiada que señala el dibujo (lupa), con fuente y salto a la ficha | 1.ª vuelta: 9,0 |
| Mecanismo animado | Receptores animados (`cardiologia/receptores-animados.js`) | `mecanismo-receptores.jpg` | Cardiología → Merino Cardiología → Vasopresores → Receptores; norepinefrina, dosis >10 µg/min; Paso 4 de 5 | Paso a paso con la cascada encendida | 1.ª vuelta: 9,0 |
| 8 | Estudiar de una ficha (`data/mayeutica/b1-fluidos.js`) | `8-estudiar-b1.jpg` | Libros → Marino Fundamentos → Cristaloides → Mayéutica | Piensa antes, opciones, porqué de cada una, fuente y salto al modelo | 9,5 |
| 8 | Examen fallado en esa ficha | `8-examen-fallado.jpg` | Igual → Paso 4 · Examínate, contestar mal | «Qué le habría pasado al paciente» + explicación con fuente | pendiente |
| 8 | Caso clínico en curso (`modelos/preguntas-para-estudiar.html`) | `8-caso-clinico.jpg` | Abrir el archivo con el servidor; pulsar Siguiente hasta el test | Paciente que evoluciona, datos nuevos marcados, test con «piensa antes» | 9,5 |
| 8 | Caso: «encuentra el error» | `8-caso-error.jpg` | Mismo archivo, paso del plan del R1 → Corregir | Frases falsas con su corrección | pendiente |
| 8 | Caso: final | `8-caso-final.jpg` | Mismo archivo, último paso | «Lo que te llevas» y salto a la ficha | pendiente |

7.11 se juzga con el capilar vivo (`js/data/capilar-vivo-data.js`, capturas `7-9-10-capilar.jpg` y `7-10-capilar-explicame.jpg`) y
7.12 con la nefrona viva (`7-4-nefrona.jpg`, `7-5-nefrona-frase.jpg`), salvo que el profesor proponga otra.

**Regenerar**: `node autonomo/modelos/anclas/capturas.mjs [parte-del-nombre ...]` (levanta su servidor, 390×844 y 360×844,
cierra todo al acabar). **Calibración**: única; se repite solo si cambia `.claude/agents/profesor.md` o su modelo.
Si una ancla no da 10, se cambia por otra candidata de la app y se anota aquí en «Calibración».
