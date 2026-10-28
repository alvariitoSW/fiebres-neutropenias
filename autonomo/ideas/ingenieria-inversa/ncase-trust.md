# La evolución de la confianza (Nicky Case, ncase/trust) · informe de ingeniería inversa · 28/10/2026
Sustituta del tipo (b): PhET no abre (ver webs.md). Es un explicable con **apuestas** (predicción) sobre una simulación.
Leído en GitHub, en memoria, sin guardar nada: `ncase/trust` (README, `words.html` con los textos, `index.html`,
`js/slides/3_Slides_Tournament.js`). El juego en ncase.me **no abre** (proxy 403): **no lo he visto funcionar**.
Etiquetas: **visto** (en el código/texto) / **deducido** / **no visto**. README: «dedicado al dominio público», con
sonidos de licencias mixtas (alguno CC BY-NC); no se reutiliza nada.

## Qué es (visto)
Explicable sobre teoría de juegos (dilema del prisionero) en 5 tramos: partida única → partidas repetidas → torneo →
evolución → errores/ruido. Mandos mínimos (cooperar/engañar, elegir personaje, un deslizador de ruido). Sin cuenta.
Tecnología: JS plano + PixiJS, sin servidor (visto en `index.html`). Su código sale de GitHub, no se copia.

## Ciclo predecir → observar → explicar (visto en el código y los textos)
1. **Apuesta antes de ver**: en el torneo, «PLACE YOUR BETS»: botones, uno por personaje (5 opciones cerradas). Se elige
   al ganador **antes** de correr nada. Nunca texto libre.
2. **Observar**: el torneo se desarrolla enfrentamiento a enfrentamiento («let's go through the matches one by one»);
   el estudiante mira, no calcula.
3. **Veredicto con tono**: si acertó, «Congrats, you placed your bet on the right horse»; si no, «Apologies to your bet,
   [personaje]». Casi sin culpa. Después **explica en prosa** por qué ganó cada uno.
4. **Segunda apuesta con una condición cambiada**: «PLACE YOUR BETS, AGAIN» al cambiar las reglas (ruido del 5 %).
   El resultado cambia, y a veces «sadly, you were correct» (acertar con lo malo): el porqué se aprende en el contraste.
- En el tramo de partida única: tras elegir, «Wow, that's mean... and also the correct answer!» (feedback inmediato y corto).

## Cómo trata el error
Deja equivocarse sin penalización y la consecuencia es **ver la simulación** que lo desmiente. La guía llega **después**, no
antes. Hay una pasada «Mistakes» donde el error es el contenido (un fallo único arruina una racha de cooperación).

## El porqué sin texto libre
No pide el porqué: lo da el texto tras el resultado. La parte «explícalo tú» no existe (visto: no hay campo de texto).

## Mezcla y repaso / qué guarda
No hay repaso ni entrelazado (**no visto**). Guarda solo lo que el estudiante apostó durante la sesión (deducido; no hay
almacenamiento persistente en lo leído).

## Trasladable (app estática, sin guardar nada nuevo)
- Apuesta cerrada de 3-5 opciones **antes** de mover el modelo; el modelo corre y se ve el resultado. Ya es nuestro «predice».
- **Repetir la apuesta con una condición cambiada** (otro paciente, otra presión): enseña el porqué por contraste.
- Veredicto breve y sin reproche; la explicación llega después de ver.
- Un resultado **contraintuitivo** como 2.ª apuesta (acertar «sadly»): el error previsto se vuelve el contenido.

## Frente a nosotros
Ganan: la apuesta precede a todo y se repite con un cambio. Ganamos: fisiología verificable y consecuencia clínica.

## Pares de prueba
No aplica (no se vio funcionar).
