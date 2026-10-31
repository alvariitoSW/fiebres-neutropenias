# Encargo 3 · shock-scai · arreglos de la auditoría (constructor sonnet nuevo, ≤25 pasos / 0,35 M)
Rama auto/b3-scai (git pull antes). Lee /tmp/plan-socialista/shock-scai/auditoria.md (7 menores) y arregla:
1. «lactato >2»: es del texto 7.3.4 (pdf 44), no de la Tabla 13 (que no da cifras). Corrige en shock-vivo-scai.js (l. ~11 y los
   `org`), scai.mjs (l. ~2) y la cita de S1.
2. B: «Inicial / pre-shock» (la fuente: «Beginning/pre-shock»), en scai.mjs y S1.
3. Reglas de scai.mjs (siguen rotuladas «regla del modelo sobre la ESC 2026, p. 44»):
   - Con una intervención aún puesta (fármaco o soporte) y sin hipoperfusión, el rótulo NO baja a A: «C · respondiendo al
     tratamiento» (la Tabla 13 no define el estadio tras responder; dilo en el porqué). Ajusta los pasos del caso de Fermín
     que dependían de A (CF4-CF5) y la tabla de letras de la prueba.
   - E: quita «pese a» o cualquier frase que afirme refractariedad que el modelo no mide. Redacta: «varias intervenciones a la vez
     y la hipoperfusión sigue (la Tabla 13 llama E al shock refractario o la parada con varias intervenciones, incluida la RCP)».
4. CF5 «llevas»: quita «(SCAI D)»; «el soporte mecánico se reserva en general para el shock refractario» con cita Marino shock pdf 45.
5. CF3 dobutamina: añade el matiz de Marino pdf 43 (sube la FC y el consumo de O₂; puede ser perjudicial en el infarto agudo) y
   rotula «aplicación del modelo» la elección para el VD.
6. CF2 distractor furosemida: corrige «no tiene congestión» (sí tiene congestión derecha, PVC alta); deja el argumento del llenado
   rotulado «inferencia (fisiología general)» o cítalo si lo encuentras en Marino (cap. 16 pdf 40-41 o caps 18-21).
7. S4 distractor de noradrenalina: cita Marino pdf 43. CF4: la Tabla 20.3 está en pdf 45 y el texto en 46: «pp. 45-46». CF1: «cociente
   PVC/PCP aumentado» (literal de Marino p. 40).
Después: `node autonomo/version.mjs 20261030-N` (N mayor que la de index.html y que la de origin/main), y pasa TÚ, uno tras otro y sin
nada más corriendo: `node autonomo/pruebas/shock-vivo.mjs` (si el juez lo lanza solo, basta el juez), `node autonomo/jueces.mjs --modelo
shock-vivo > /tmp/plan-socialista/shock-scai/j3-modelo.txt` y `node autonomo/jueces.mjs --forma > /tmp/plan-socialista/shock-scai/j3-forma.txt`.
Si sale un ❌ que es tuyo, arréglalo; si es ajeno (p. ej. «mando no tocable Mateo» a 360 sin relación), dilo con la línea exacta.
Commit y push (Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com> · Claude-Session: https://claude.ai/code/session_01QiKC3AJEDzsc2QUQ4CarWC).
Entrega en /tmp/plan-socialista/shock-scai/entrega-3.md (≤20 líneas) con la tabla de letras nueva y los ❌/✅ de los jueces.
