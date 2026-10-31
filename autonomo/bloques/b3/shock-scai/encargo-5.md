# Encargo 5 · shock-scai · dos ❌ de los jueces (constructor sonnet, ≤30 pasos / 0,5 M)
Rama auto/b3-scai (git pull; ya lleva main fusionado, versión 20261031-40). Salidas: /tmp/plan-socialista/shock-scai/j6-modelo.txt y j6-forma.txt.
1. **Prueba mal planteada** (autonomo/pruebas/shock-vivo.mjs y scai-puro.mjs si aplica): «SCAI aurelio con noradrenalina + dobutamina + ECMO
   y +5 h (lactato persiste) → E» falla porque en el monitor el lactato baja. Mide con autonomo/bloques/b3/herramientas/scai-letras.mjs qué
   paciente/gravedad mantiene el lactato >2 sin bajar a las 5 h con ≥2 intervenciones; si existe, usa ese; si ninguno lo da, la prueba
   comprueba la letra real («C · en respuesta») y E se prueba solo en scai-puro.mjs (función pura). No toques el motor para forzarlo.
2. **Juez Móvil** «mando no tocable «Mateohemorragia» [Explorar·tapon→Mateohemorragia]» a 390 (la acción tap no termina). En origin/auto/b3
   (antes de esta rama) salía verde. Compara tiempos: en un worktree de origin/main (`git worktree add /tmp/wt-main origin/main`) y en esta
   rama, con autonomo/bloques/b3/herramientas/movil-solo.mjs (o el juez Móvil solo de shock-vivo), 2 veces cada uno. Si main también falla →
   es previo (dilo con las líneas). Si solo falla aquí → busca qué del SCAI alarga el hilo al cambiar de paciente desde el estado «tapon»
   (pintarScai, estilos.js, el getter `nuevo` de mayeutica-shock.js, `refrescar`) y arréglalo sin tocar el manejador de pacientes
   (setTimeout 0, `cambioPac`). Borra el worktree al acabar (`git worktree remove /tmp/wt-main`).
3. Si cambias código de la app: `node autonomo/version.mjs 20261031-41`. Al final, una vez: `node autonomo/jueces.mjs --modelo shock-vivo >
   /tmp/plan-socialista/shock-scai/j7-modelo.txt` y `--forma > j7-forma.txt`.
Commit y push (Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com> · Claude-Session: https://claude.ai/code/session_01QiKC3AJEDzsc2QUQ4CarWC).
Entrega en entrega-5.md (≤15 líneas): causa de cada ❌, arreglo y resultado de j7.
