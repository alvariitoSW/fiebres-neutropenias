# Anki + FSRS (repaso espaciado) · informe de ingeniería inversa · 28/10/2026
Fase 1 de educacion-pionera. Se estudia, no se copia (CLAUDE.md §7.9). Etiquetas: **visto** / **deducido** / **no visto**.

## Cómo se llegó
- La web de Anki (docs.ankiweb.net) y ankiweb.net **no abren** (proxy 403). Se leyó el **manual en GitHub**
  (`ankitects/anki-manual`, `src/studying.md`, `src/deck-options.md`, vía raw.githubusercontent.com) y la
  introducción de FSRS (`open-spaced-repetition/awesome-fsrs/wiki/ABC-of-FSRS`). No se ha visto la app funcionar.
- Sin capturas. Sin licencias comprobadas (manual y wiki en GitHub; no se reutiliza texto).

## Ciclo recordar → valorar → programar (visto)
- La tarjeta muestra la pregunta, el estudiante **intenta recordar** y luego destapa; entonces se autovalora con 4 botones:
  Again (fallo: «si en la vida real cuenta como fallo, cuenta como fallo»), Hard, Good (80-95 % de las veces), Easy.
- Cada botón enseña **cuándo volverá** la tarjeta. Existe un modo de solo 2 botones (Again/Good).
- Un fallo (Again) manda la tarjeta a «reaprender» con pasos cortos (minutos) antes de volver a ser repaso.
- **Error**: no hay consecuencia más allá de volver antes. No hay explicación: la pone quien escribió la tarjeta.
- **El porqué sin texto libre**: no lo pide. Todo es autovaloración (la app no corrige).

## Mezcla y programación (visto)
- Orden de repasos: por defecto «fecha de vencimiento, luego aleatorio». El manual desaconseja «mazo, luego fecha»:
  «que el material salga siempre en el mismo orden facilita adivinar la respuesta por el contexto y da memorias más débiles».
  (Es un argumento a favor del entrelazado; lo dice el manual, sin cita a estudio.)
- Hermanas de una misma nota se **entierran** hasta el día siguiente (evita ver dos caras de lo mismo seguidas).
- «Fuzz»: pequeño ruido aleatorio en el intervalo para que las tarjetas no se queden pegadas.
- Límites diarios (nuevas/día, repasos/día); «Easy Days» para repartir carga por día de la semana.
- FSRS: cada tarjeta tiene 3 números: **retrievabilidad** (probabilidad de recordar hoy), **estabilidad** (días hasta
  bajar de 100 % a 90 %) y **dificultad**. Se elige solo la **retención deseada** (90 % por defecto; >97 % «abrumador»,
  rango razonable 70-97 %). Afirma 20-30 % menos repasos que SM-2 «según simulaciones» (dato de la wiki, no verificado por mí).
- **Qué guarda** (visto/deducido): estado por tarjeta (D, S, fecha) y **historial de repasos** para optimizar 21 parámetros.
  Todo requiere almacenamiento persistente: no lo tenemos.

## Trasladable a nuestra app (solo fecha del último intento + aciertos/fallos)
- Sí, en versión mínima: «toca repasar» = (falló y han pasado ≥1 día) o (acertó y han pasado ≥N días, N creciendo con
  los aciertos seguidos que ya guarda el registro). Es una escalera tipo Leitner, **deducida**, no FSRS.
- Sí: mezclar en el repaso preguntas de fichas distintas y **no repetir la misma ficha seguida** (enterrar hermanas).
- Sí: mostrar «vuelve en X días» tras responder (el estudiante ve la regla).
- No: estabilidad/dificultad por pregunta, optimizador, historial. Pide guardar más (decide el usuario, CLAUDE.md §2).

## Frente a nosotros
Ganan: programación con fundamento y carga controlable. Ganamos: el porqué con opciones, casos que evolucionan, modelo vivo;
ellos solo recuperan una tarjeta aislada (**deducido** de su diseño).

## Pares de prueba (para comparar escaleras, no son fuente clínica)
Valores por defecto leídos en el manual: pasos de aprendizaje `1m 10m 1d` (ejemplo del manual); retención deseada 90 %.
