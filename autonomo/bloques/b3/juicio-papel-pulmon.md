# Dictamen de Educación · maqueta `autonomo/maquetas/mv-papel-pulmon.html` (3 láminas)
Profesor (Consejo, Educación), 30/10/2026. Visto a 390×844 con `mv-papel-pulmon/captura.mjs` (390 y 360 px: ok, sin desborde ni errores; `pruebas.mjs`: 14 en verde) y 6 capturas (nivel 1 y 4, SDRA PEEP 0, sello PEEP 20, doble disparo, adivina resuelta).

| Lámina | ¿Se ve el mecanismo? | ¿Se entiende a 390 px? | ¿Admite apuesta, error y caso? | Nota |
|---|---|---|---|---|
| 1 Entrada (tórax → capilar) | A medias: solo mientras se mantiene «Inspira»; en reposo es un dibujo quieto. La barra 150 + 350 (nivel 2) y la membrana ~0,6 µm sí enseñan. | Sí: figura grande, 4 niveles en el dock, foto real Fig. 24.1 en el nivel 3, rótulos ≥ 9,5 px. | Apuesta débil: dos «piensa y destapa» sin opción para fallar; sin caso. | 7,8 |
| 2 Histéresis (4 unidades) | Sí, y bien: dos ramas que no coinciden, puntos de inflexión, línea de PEEP móvil, 4 alvéolos con estado («abre y cierra» rayado en rojo), Cstat 20 → 64 y 2/4 → 0/4 al subir la PEEP. Sello con topes y botón de vuelta. | Sí; el dock (perfil + 2 deslizadores + nota + «volver») ocupa ~40 % de la pantalla. | No hay apuesta en la lámina (la guía afirma, no pregunta); admite error por los sellos; sin caso. | 8,9 |
| 3 Asincronías | Sí: Paw, flujo, volumen y esfuerzo del paciente salen del motor; el tramo señalado localiza la asincronía. Pero el «doble disparo» a esfuerzo 11 se ve como una insuflación larga (800 mL) sin valle entre los dos ciclos: no se reconoce como doble. | Sí; las 4 trazas caben con rótulos legibles. | Sí: «Adivina» con piensa antes, 3 opciones, acierto/fallo explicado y «Otra curva»; sin caso. | 8,4 |

Veredicto: **entra con cambios** (para E2, E4a y L, no antes de construir):
1. Lámina 3, `asincronias.mjs` `simularAsinc`: el doble disparo debe mostrar dos picos con un valle corto entre ambos (tiempo espiratorio mínimo o refractario del disparo, ilustrativo y rotulado), como la Fig. 27 del Libro Azul (LA2 pdf 94); el criterio «dos en < Ti/2» se mantiene.
2. Lámina 2, `histeresis.mjs`: con PEEP 20 las 4 unidades salen «sobredistendido» y la Cstat sube a 64 (mejor que un pulmón normal): la cifra contradice el rótulo. La cola por encima del punto de inflexión superior debe aplanarse (Cstat que baja) o el rótulo «sobredistendido» debe esperar a que baje la Cstat. El sello «PEEP en el tope» tapa el rótulo «PEEP»: moverlo a la derecha.
3. Apuesta antes de la guía (REGLAS §8): en la lámina 2 una pregunta «PEEP 5 → 12: ¿qué le pasa al alvéolo que se cerraba?» con 3 opciones antes de mover el mando; en la lámina 1 la tarjeta de la ventilación alveolar como test con «piensa antes» (3 cifras: 4,5 L · 9 L · 2,25 L) y no solo «destapar».
4. Lámina 1: que algo se mueva sin pulsar (una inspiración lenta en bucle, parada con «reducir movimiento»), y el rótulo «diafragma» pegado a la cúpula (hoy a 40 px de ella).
5. Dock de las láminas 2 y 3: la nota de topes pasa a un plegable o a la frase viva para dejar ≥ 65 % de la pantalla a la figura.
Los casos clínicos no faltan en la maqueta: van en la Mayéutica del encargo M (Isidro, Eulalia, Herminia, Rafael, Elvira).
