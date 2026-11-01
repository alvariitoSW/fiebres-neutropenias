# Anclas de 10 del profesor

Capturas congeladas a 390 px (JPEG q70) que fijan qué es un **10** en cada punto de `autonomo/REGLAS.md` §7 y §8
(«Cómo se juzga»): el 10 es «como su ancla»; el 9,5, «como el ancla con un solo fallo pequeño y nombrado».
El profesor las mira al lado de la captura que puntúa.

| Punto | Ancla (archivo de la app) | Captura | Cómo llegar en la app | Por qué es el 10 | Calibración |
|---|---|---|---|---|---|
| 7.1-7.3, 7.13 | Ficha Trombocitopenia y HIT, Merino HEMATO (`merino-hemato.html`) | `7-1-3-13-4ts.jpg`, `7-1-3-13-4ts-calculadora.jpg` | PIF → Hematología → Merino HEMATO → Ficha 4 | Idea arriba, bloques cortos con 1-3 resaltes con color, y la escala 4Ts calcula con su origen y página | |
| 7.7 | La misma ficha a 360 px | `7-7-4ts-360.jpg` | Igual, con pantalla de 360 px | Sin desborde ni cortes a 360 px | |
| 7.6 | Vista Visual de esa ficha (`merino-hemato/visual.js`) | `7-6-visual-4ts.jpg` | Ficha 4 → Estudiar → Paso 1 · Mira | Cada nodo remite a su texto; flujo, escalera y escala 4Ts dibujados | |
| 7.4, 7.5, 7.8 | Nefrona viva (`nefrologia/nefrona-viva.js`) | `7-4-nefrona.jpg` | Nefrología → Fisiología renal → Nefrona viva (estado furosemida) | Modelo grande en el estado del tema; el mecanismo se ve moverse | |
| 7.4, 7.5 | Atlas cap. 14, VD (`eco/atlas/cap-vd.html` + `vd.mjs`) | `7-5-8-atlas-vd.jpg` | Eco cardíaca → Atlas → 14 · Ventrículo derecho (TEP agudo) | Ecos reales del motor, mandos que cambian doppler y medidas | |
| 7.9, 7.10 | Capilar vivo (`libros/capilar-vivo.js`) | `7-9-10-capilar.jpg` | Libros → Modelos vivos → Capilar y oxígeno → «Anemia que compensa» | Frase viva con fuentes y «Ver en la ficha»; «Explícamelo» y mandos | |
| Mecanismo animado | Receptores animados (`cardiologia/receptores-animados.js`) | `mecanismo-receptores.jpg` | Cardiología → Merino Cardiología → Vasopresores → Receptores; elegir fármaco y dosis | Paso a paso («Paso 2 de 5») con el dibujo cambiando | |
| 8 | Estudiar de una ficha (`data/mayeutica/b1-fluidos.js`) | `8-estudiar-b1.jpg` | Libros → Marino Fundamentos → Cristaloides → Mayéutica | Piensa antes, opciones, porqué de cada una, fuente y salto al modelo | |
| 8 | Caso clínico en curso (`modelos/preguntas-para-estudiar.html`) | `8-caso-clinico.jpg` | Abrir el archivo con el servidor; pulsar Siguiente hasta el test | Paciente que evoluciona, datos nuevos marcados, test con «piensa antes» | |

7.11-7.12 (modelos por concepto, megaproyectos) no tienen captura propia: se juzgan con la ancla del capilar vivo
(`7-9-10-capilar.jpg`) y la nefrona (7.8), salvo que el profesor proponga otra.

**Regenerar**: `node autonomo/modelos/anclas/capturas.mjs [parte-del-nombre ...]` (levanta su servidor, 390×844 y 360×844,
cierra todo al acabar). **Calibración**: única; se repite solo si cambia `.claude/agents/profesor.md` o su modelo.
Si una ancla no da 10, se cambia por otra candidata de la app y se anota aquí en «Calibración».
