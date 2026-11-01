# Revisión del encargo del eje en la app (Explore sonnet, 01/11, sesión 2) · ≤20 líneas
- Grep: nada del eje existe aún (ni vista, ni datos, ni prueba, ni jueces). silueta.js, tope.js, frase-vista.js y mayeutica-motor.js sí existen.
- Grave 1: «Ver en la ficha» de la maqueta solo lleva `data-resaltar`; en la app hace falta data-especialidad/view/panel/tab y un mapa id→pestaña (patrón termostato `pagina.js`:21).
- Grave 2: registro concreto: index.html (import map + `eje-vivo-view` data-include), libros/index.js l. 41/79/140/241/268. home/index.js no se toca (genérico por `modelosVivos`).
- Grave 3: jueces: entradas en `jueces-forma.mjs` (modelo con raíz, enlace, estados), `jueces-movil.mjs` (selector de frase), `jueces-topes.mjs` (noPulsar del reloj y la retirada); exponer `window.__eje` como `window.__tmv`.
- Grave 4: pares de cambio de paciente: 7×6 = 42 (se fija 42).
- Grave 5: la maqueta no usa silueta.js (dibuja a mano): en la app, cuello y riñón con ORGANOS/posicion. Fig. 51.1 y PDF con rutas de la app.
- Sin juez: cifras del reloj (R2 7) y PAM de Toribio/Bibiana (R2 8): aserciones propias en la prueba. Dock ≤1/3 de la pantalla (copiar la medida del termostato).
- Topes sin página (suero 3 L, NA 1,0, cifra imposible): llevan origen («fisiología general»), no cita inventada.
- Tamaño: 84 KB de maqueta → partir en 1a (datos, modelo, dibujo, registro, botones) y 1b (página, dock, guía, mapa, prueba con barrido, jueces).
- Botones: 7 (Toribio tras `mu-sr-clinica`, Bibiana tras `mu-sr-criterios`/`practica`, Sinforoso `mu-ti-clinica`, Lucrecia `mu-ti-tormenta`, Policarpo `mu-ti-hipertiroxinemia`, Obdulia `mu-hipo-coma`, Fulgencio `mu-hipo-eutiroideo`).
Decisión del director: todo al encargo; se parte en 1a + 1b (≈55 + 55 pasos, mismo total 2,0 M).
