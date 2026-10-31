# Encargo 4 · shock-scai · vuelta del profesor (constructor sonnet nuevo, ≤40 pasos / 0,6 M)
Rama auto/b3-scai (git pull). Lee /tmp/plan-socialista/shock-scai/profesor.md: haz los arreglos 1-9 y, en scai.mjs:
- C tras responder: nombre «C · en respuesta (regla del modelo)», sin «Clásico».
- E: exige además que la hipoperfusión persista tras horas de tratamiento (p. ej. `lab.horas > 0 && !lab.baja`); recién puestas
  varias intervenciones → D. Actualiza la tabla de letras de la prueba y scai-letras.mjs.
Fuentes ya citadas (Marino shock pdf 40, 43, 45, 47-48; caps 18-21 pdf 45-46; ESC 2026 pdf 44). Nada sin cita; el CF4 nuevo
(«encuentra el error») y el «piensa y destapa» de CF1 con sus citas en cada frase. Ojo: el arreglo 2 (getter `nuevo`) toca también el
caso de Aurelio: compruébalo en los dos.
Añade a git el programa del profesor autonomo/bloques/b3/herramientas/scai-profesor-capturas.mjs (ya está en el árbol).
Versión: `node autonomo/version.mjs 20261030-N` (N mayor que index.html y origin/main). Pasa tú, uno tras otro:
`node autonomo/jueces.mjs --modelo shock-vivo > j4-modelo.txt` y `--forma > j4-forma.txt` (en esta carpeta). El ❌ «mando no tocable
<paciente>» del juez Móvil es previo a esta rama (se mide aparte): no lo persigas; cualquier otro ❌ sí.
Recorre con scai-profesor-capturas.mjs y deja las capturas en /tmp/plan-socialista/shock-scai/cap4/.
Commit y push (Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com> · Claude-Session: https://claude.ai/code/session_01QiKC3AJEDzsc2QUQ4CarWC).
Entrega en entrega-4.md (≤20 líneas): qué cambió por arreglo, frases nuevas con cita, letras nuevas, jueces.
