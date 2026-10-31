# Encargo 1 · shock-scai · rótulo SCAI + enlace + nota ECMO/Impella (constructor sonnet, ≤45 pasos / 0,8 M)
Rama: auto/b3-scai (ya creada, trabaja ahí, sin worktree). Carpeta: /tmp/plan-socialista/shock-scai/.
Lee: este encargo, revision-encargo.md, js/modules/libros/CLAUDE.md si existe. De autonomo/REGLAS.md solo §1.14, §1.15 y §4.7.

1. **Rótulo «SCAI · X»** junto al veredicto del shock vivo (pagina.js, donde se pinta `frase-txt`, ~l. 335-340), con
   una línea: el nombre del estadio en español («C · Clásico») y el porqué en una frase con las cifras del monitor.
   Reglas (escríbelas como función pura `estadioScai(R, ajuste, lab)` en un archivo nuevo
   `js/modules/libros/shock-vivo/scai.mjs`, comentadas con su fuente):
   - hipoperfusión = lactato del monitor >2 mmol/L (ESC 2026 parte 1, pdf 44) [si el modelo da signos clínicos de
     hipoperfusión con cita ya existente, puedes sumarlos];
   - A: sin hipoperfusión y sin inestabilidad (paciente en riesgo: todos los del modelo tienen una causa cardíaca);
   - B: inestabilidad (hipotensión relativa o taquicardia: usa los umbrales que el modelo YA usa con su cita, p. ej.
     PAM <65 o la FC de sus alarmas) sin hipoperfusión;
   - C: hipoperfusión sin intervención todavía o con una sola intervención que la está corrigiendo;
   - D: hipoperfusión que persiste con una intervención ya puesta (fármaco o soporte);
   - E: hipoperfusión con ≥2 intervenciones simultáneas (fármaco + soporte mecánico) o parada.
   C/D/E son la regla del modelo sobre la definición de la Tabla 13: rotúlalo («regla del modelo sobre la ESC 2026, p. 44»), origen visible.
   La página del PDF: `docs/esc-2026-hf-guideline-parte1.pdf#page=44` (compruébala).
2. **Enlace** «Ver la escala SCAI (ESC 2026)» bajo el rótulo: `<button class="especialidad-link" data-especialidad="cardiologia"
   data-view="insuficienciaCardiaca" data-panel="panel-cardio-ic-tabs" data-tab="ic-descompensada" data-resaltar="#ic-scai-tabla">`.
   Añade `id="ic-scai-tabla"` a la tabla SCAI de js/modules/cardiologia/insuficiencia-cardiaca.html (~l. 765). No copies la tabla.
   Comprueba en el navegador que abre la ficha y resalta.
3. **Nota ECMO + Impella** en el estado `ecmo-carga` o `ecmo-venteo` (shock-vivo-data.js, ~l. 431-445): si ya lo dice, solo
   añade la cita; si no, una frase: con ECMO VA la poscarga retrógrada sube y el VI puede no vaciarse; se combina con balón o
   Impella para descargarlo (Marino pdf 48-49, C.ecmoPoscarga). shock-vivo-data.js tiene 679 líneas: no pases de 700.
4. **No toques** el manejador de pacientes nuevos de pagina.js (setTimeout 0, contador `cambioPac`).
5. **Prueba**: amplía autonomo/pruebas/shock-vivo.mjs con una tabla paciente/ajuste → letra esperada (al menos A o B, C, D y E,
   en 3 pacientes distintos, uno Fermín), el rótulo y el botón sin desborde a 390 y 360, y Fermín en los bucles de 390/360.
   Mide con el monitor de la app (autonomo/bloques/b3/herramientas/g4-app-cifras.mjs si sirve), no con el motor suelto.
   Si alguna letra sale clínicamente rara (p. ej. un paciente sin soporte que da E), PARA e informa: no la tapes.
6. Pasa `node --test 'js/modules/eco/pruebas/*.test.mjs'` NO hace falta (no tocas el motor de la eco). Pasa
   `node autonomo/jueces.mjs --modelo shock-vivo` y `--forma`. `node autonomo/version.mjs 20261030-60` (si ya existe una
   mayor en index.html, usa la siguiente). Lista de comprobación del constructor antes de entregar.
7. Commit en auto/b3-scai (mensaje en español, con: Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com> y
   Claude-Session: https://claude.ai/code/session_01QiKC3AJEDzsc2QUQ4CarWC) y push. No subas nada a auto/b3.
8. Entrega en /tmp/plan-socialista/shock-scai/entrega-1.md (≤30 líneas): qué hiciste, la tabla de letras medida, la
   lista de frases nuevas con su cita (para el auditor), jueces ✅/❌, «No comprobado / riesgo».
