# Oppia (tutor guiado por exploraciones) · informe de ingeniería inversa · 28/10/2026
Elegida como sustituta de Khanmigo/Brilliant/Isaac Physics, que **no abren** (proxy 403, ver webs.md).
Se leyó solo la guía pública de creación de lecciones en GitHub (`oppia/oppia`, wiki: `Lesson-Creation-Guide`,
`Playtesting-explorations`, vía raw.githubusercontent.com). **No se ha visto el producto funcionar** (oppia.org bloqueado).
Etiquetas: **visto** (en la guía) / **deducido** / **no visto**.

## Qué es (visto)
Plataforma de código abierto de lecciones interactivas para alumnos con poco acceso a educación. Unidad: la
**exploración** («experiencia estructurada con feedback dirigido»), dentro de una historia dentro de un tema.
No hay IA que converse en lo que he leído: el feedback lo escribe el autor para cada error previsto.

## Cómo trata el error (visto, en el diseño de autor)
- Cada habilidad tiene una **tabla de autor**: habilidad · **errores específicos** · **remediación** · desarrollo con preguntas.
- Regla de oro: una concepción errónea debe describirse tan concretamente que «otra persona, viendo la pregunta y la
  descripción, pueda **predecir la respuesta equivocada** del alumno». O sea: los distractores salen de errores reales.
- Las preguntas se escalonan: **una sola habilidad nueva por pregunta** (saltos pequeños); hay que contar las
  habilidades «ocultas» que no se enseñan en la lección.
- Los autores usan los fallos como «un poco de peligro» en la historia (los errores forman parte de la trama).
- Cuándo da la guía: **no visto** en la guía (pistas/soluciones no aparecen en lo que leí).

## Etiquetas de pregunta y mezcla (visto)
- `[concept]` introduce, `[test]` refuerza dentro de la lección, `[recap]` repasa lecciones **anteriores**,
  `[Final Challenge]` al final. Cada lección (salvo la 1.ª) **empieza con preguntas recap** de los requisitos, porque
  «haberlo visto no significa que lo domine». Banco de preguntas equivalentes **al azar** para variar cada intento.
- Dificultad con semáforo verde/amarillo/rojo.

## Ciclo predecir → observar → explicar y el porqué
No visto. El «porqué» sin texto libre: no aparece; la remediación sustituye a la explicación del alumno.

## Qué guarda
No visto (no se pudo abrir el producto). Deducido: progreso por lección en servidor con cuenta.

## Trasladable a una app estática
- Tabla de autor «error → remediación» por pregunta: **sí**, es trabajo de diseño, no de código (encaja con REGLAS §8).
- Recap al **inicio** de la ficha nueva con 2-3 preguntas de fichas previas: sí (sin guardar nada).
- Banco de preguntas gemelas elegidas al azar: sí (los bancos ya barajan opciones).
- Una habilidad nueva por pantalla/pregunta: sí, criterio de rúbrica.

## Frente a nosotros
Ganan: método de autoría muy explícito (errores previstos → feedback). Ganamos: modelo vivo con consecuencia visible.

## Pares de prueba
No aplica (no se vio el comportamiento).
