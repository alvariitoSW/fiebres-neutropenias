# s2-fusion (eco-calibra-a, sesión 2)
Hallazgo: con fusión E-A el panel Doppler mitral imprimía E, A, E/A y TDE imposibles (TEP def: E 20 · A 126 · E/A 0,15).
## Cambios
- `simulador.mjs` `pintarResultadoD`: con `medD.fusion` el panel dice «Fusión E-A (FC alta): E/A y TDE no medibles» + velocidad pico de la onda fundida, con Nagueh 2025 p.547 y p.557 (T7). Sin E/A ni TDE. E/e′ no se muestra en el panel Doppler (no había).
- Sin fusión: se dejan «normal 1-1,5» y «140-250» (vienen de la Ficha 5, `#cardio-eco-diastolica`) y se añade la banda de Nagueh 2025 p.551 (E/A 0,69-2,73, 20-60 años) como segunda fuente, sin elegir ganadora.
- `doppler.mjs` `medidasLatido`: la fusión también se detecta de forma circular (la E sube hasta el final del latido y sigue subiendo a la A del latido siguiente). Antes solo miraba la A previa, y TEP def, vasoplejia, fallo 100 % y HP crónica 100 % no salían como fusión aunque su TDE era null. No se movió ninguna presión ni flujo.
- `medir-forma.mjs` expone `fusion`. `bandas-paciente.mjs`: suelos duros en todas las formas, solo sin fusión: E/e′ ≥4 (Nagueh 2025 p.551 (15) T5) y E/A ≥0,5 (p.551, 60-80 años). `paciente-doppler.test.mjs` los salta si `fusion`.
- Prueba nueva en `navegador.test.mjs`: TEP con muestra mitral → `fusion` true, el panel dice «E/A y TDE no medibles» y no imprime «E/A <número>».
## Puntos con fusión (tras el arreglo)
vasoplejia (FC 108), hemorragia 100 % (124), fallo 100 % (121), derrame 100 % (120), TEP def (109), TEP 100 % (120), HP crónica 100 % (93; criterio geométrico, FC <100: ojo).
Sin fusión: normal, dilatada, 0 % de todas, hemorragia def, fallo def, derrame def, HP def, hipertrofia 0/def/100.
## Pruebas
J1/J2 en verde, PENDIENTES vacío, ninguna forma sin fusión falla los suelos nuevos. Suite eco: 505 pruebas, 0 fallan (11 todo previos). Versión 20261028-2.
## No comprobado / riesgo
- HP crónica 100 % (FC 93, E/A 0,62) ahora cuenta como fusión: el criterio es de forma de onda, no de FC. Si el profesor la quiere sin fusión, hay que revisar su tiempo de relajación.
- El «Piensa»/atlas que cite E/A de estos puntos no se revisó.
