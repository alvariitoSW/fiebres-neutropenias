# Educación pionera · fase 1 · qué hacen otras webs (resumen) · 28/10/2026
Papel: ingeniería inversa. Pasos usados: 24 de 60. Solo se estudian ideas (CLAUDE.md §7.9).

## Lo importante primero
El entorno solo deja abrir **GitHub, raw.githubusercontent.com y PubMed**. Las webs de verdad (PhET, Khan/Khanmigo,
Brilliant, Isaac Physics, Anki Web/docs, Quizlet, Brainscape, Osmosis…) dan error 403 del proxy. Por eso **no he visto
ninguna web funcionar**: he leído lo que publican en GitHub. Dos informes, no tres:
- **Repaso espaciado** → `ingenieria-inversa/anki-fsrs.md` (manual de Anki + introducción a FSRS). Bien leído.
- **Tutor guiado** → `ingenieria-inversa/oppia.md` (guía de autores de Oppia). Solo la parte de diseño.
- **Simulador con apuestas** → `ingenieria-inversa/ncase-trust.md` (Nicky Case, leído en GitHub). PhET falló (bloqueado y su
  repositorio de GitHub ya no es público). Es el informe más flojo en profundidad: texto y código leídos, juego no visto.

## Qué hacen (con lo que se leyó)
1. **Anki/FSRS**: recuperas, te autovaloras (4 botones), y el programa decide cuándo vuelve. FSRS usa 3 números por
   tarjeta y una sola palanca para el usuario: la retención deseada (90 % por defecto). Su manual desaconseja
   estudiar siempre en el mismo orden (por el contexto se adivina la respuesta). Entierra «hermanas» para no ver
   dos veces lo mismo seguidas. Guarda historial por tarjeta: **eso no lo podemos**.
2. **Oppia**: la lección se diseña desde una **tabla de errores**: cada pregunta nace de un error concreto y lleva su
   remediación. Regla útil: un error está bien descrito si, leyéndolo, se **predice la respuesta equivocada**.
   Cada lección nueva empieza con **preguntas de repaso** de las anteriores; hay un banco de preguntas gemelas al azar;
   una sola habilidad nueva por pregunta.
3. **Nicky Case (trust)**: apuesta cerrada de 5 opciones **antes** de ver el torneo; se mira correr; veredicto breve sin
   reproche; después una 2.ª apuesta con **una condición cambiada** (ruido del 5 %), y el porqué sale del contraste. No pide el porqué.

## Qué se puede traer a una app estática (que solo guarda aciertos/fallos y fecha del último intento)
| Idea | De dónde | Para |
|---|---|---|
| 1. Cada distractor lleva su **error previsto** («quien elige esto cree que…») y la explicación se muestra al elegir ese distractor. Prueba de calidad: un compañero predice el fallo mirando solo la descripción | Oppia (visto) | B |
| 2. **Escalón pequeño**: una sola idea nueva por pantalla; las «ocultas» se listan en el diseño. Criterio de rúbrica | Oppia (visto) | A, B |
| 3. **Repaso al abrir**: 2-3 preguntas de fichas ya vistas antes de la ficha nueva, sin guardar nada nuevo | Oppia (visto) | C |
| 4. **Gemelas**: 2-3 versiones de cada pregunta clave (mismo concepto, otro paciente) elegidas al azar; sirve también para medir transferencia en la prueba con el usuario | Oppia (visto) | A, B, C |
| 5. **Orden mezclado**: en el repaso, nunca la misma ficha seguida ni en el orden del texto; evita adivinar por contexto | Anki (visto) | C |
| 6. **Escalera mínima de repaso** con lo que ya existe: toca si falló hace ≥1 día o si acertó hace ≥N días (N sube con los aciertos seguidos). Es una regla **propia, deducida**, no FSRS | Anki/FSRS (deducido) | C |
| 7. **Enseñar la regla**: tras responder, «vuelve en X días» y por qué (falló / acertó con esfuerzo) | Anki (visto) | C |
| 8. **Autovaloración honesta en una pregunta de «piensa y destapa»**: «¿lo habrías sacado sin ver?» (sí/dudé/no) cambia cuándo vuelve; la app lo recoge como acierto o fallo, sin guardar un campo nuevo | Anki (visto, adaptado) | A, C |

| 9. **Apuesta repetida con una condición cambiada** (otro paciente, otro valor): el porqué se aprende por contraste, y una de las apuestas es contraintuitiva | Nicky Case (visto en código/texto) | A, B |
| 10. **Veredicto corto y sin reproche** al fallar; la explicación llega tras ver la consecuencia | Nicky Case (visto) | A, B |

Solo las ideas 6-8 dependen de la **fecha** del último intento; si el usuario no la aprueba, quedan 1-5.

## Lo que no se puede traer
Historial por pregunta, estabilidad/dificultad (FSRS completo), cuentas, tutor que conversa, texto libre.

## No comprobado / riesgo
- Ninguna web se ha visto **funcionando**; Oppia y Anki se conocen por su documentación. Todo lo de «cómo trata el
  error en pantalla» en Oppia es deducido del diseño de autor.
- Nicky Case: solo leído en GitHub; el juego (ncase.me) no abrió. «Cuándo da la guía» en tutores con pistas **no se comprobó**.
- La cifra «20-30 % menos repasos que SM-2» es de la wiki de FSRS (simulaciones), no verificada por mí.
- Las ideas 6 y 8 son propias: sin estudio que las avale aquí; las fuentes de evidencia van en `evidencia.md` (otro agente).
- Licencias de manual y wiki no comprobadas; no se reutiliza texto.

## Webs que fallaron
phet.colorado.edu y ncase.me (403/ENOTFOUND, 4 intentos incl. WebFetch), www.isaacphysics.org, www.khanmigo.ai, brilliant.org,
www.khanacademy.org, docs.ankiweb.net, ocw.mit.edu, ncase.me, www.oppia.org, www.desmos.com, openstax.org: todas por
dominio no permitido en la red de la sesión. Si el usuario las permite (ajustes de red del entorno), PhET y Brilliant
serían las que más aportarían para A y B. PhET en GitHub (`phetsims/phet-info`): repositorio sin mantenimiento y sin
documentación de diseño. Abiertas: github.com, raw.githubusercontent.com, pubmed.ncbi.nlm.nih.gov y eutils.ncbi.nlm.nih.gov.
