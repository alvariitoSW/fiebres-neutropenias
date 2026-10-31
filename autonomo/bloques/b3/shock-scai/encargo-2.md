# Encargo 2 · shock-scai · Mayéutica: SCAI, ECMO + Impella y caso de Fermín (constructor sonnet, ≤50 pasos / 1,0 M)
Rama: auto/b3-scai (lleva ya el encargo 1: rótulo SCAI en js/modules/libros/shock-vivo/scai.mjs; lee entrega-1.md).
Lee: este encargo, revision-encargo.md, entrega-1.md; el formato de js/data/shock-vivo-mayeutica.js (PREGUNTAS, CASOS) y
shock-vivo-data.js (PREGUNTAS/CASO crudos, `C` de citas) por trozos; modelo de estilo autonomo/modelos/preguntas-para-estudiar.html
(solo la parte de formatos). De autonomo/REGLAS.md solo §8 y §1.15.

Archivo nuevo `js/data/shock-vivo-scai.js` (los datos) importado por shock-vivo-mayeutica.js; shock-vivo-data.js no crece.
Ids nuevos con prefijo propio (S1…, CF1…); comprueba que no chocan (Fermín ya sale en js/data/mayeutica/b3b-cardiogenico-1.js:
cgf-g5, c6-2, c6-3: lee esas 3 y NO repitas su pregunta; el caso nuevo va más allá, con el modelo vivo).

1. **SCAI** (2-3): «piensa antes» con el modelo en un estado (`prepara`): ¿qué estadio SCAI es? (las cifras del enunciado con
   `vivo`, como las demás); una «encuentra el error» (p. ej. «tiene PAM 58 y FC 120 con lactato 1,4: estadio C» → el error: sin
   hipoperfusión es B). Cita ESC 2026 parte 1, pdf 44, Tabla 13 y lactato >2. Explicación con la regla del modelo de scai.mjs.
2. **ECMO + Impella** (1): «piensa antes» con Aurelio u otro paciente en ECMO con el VI que no se vacía (estado ecmo-carga/
   ecmo-cerrada): ¿qué añades? Correcta: descargar el VI con Impella o balón. Distractores verosímiles (más flujo de ECMO, más
   vasopresor, más volumen) con su porqué y cita (Marino pdf 48-49, C.ecmo/C.ecmoPoscarga).
3. **Caso de Fermín** (segundo caso en CASOS, 4-5 pasos, el modelo en cada paso con `prepara`): IAM inferior con VD, hora 2.
   Paso 1 reconocer (PVC > PCP, VD dilatado, FEVI conservada, tabique: Marino shock pdf 40-41, C.vd). Paso 2 volumen con juicio
   (ESC 2026 pdf 44, 7.3.2 «judicious fluid management»; lo que el modelo muestra con 250 mL). Paso 3 inotrópico/vasopresor (ESC
   pdf 44) con lo que hace el modelo. Paso 4 «qué no hacer»: nitroglicerina no aconsejada en el infarto del VD (Marino caps 18-21,
   docs/marino-2024-cardiac-disorders-caps18-21.pdf pdf 46). Paso 5 opcional: estadio SCAI al final y soporte mecánico si no responde
   (ESC pdf 44). Cifras de los enunciados: del monitor de la app (autonomo/bloques/b3/herramientas/g4-app-cifras.mjs), nunca del
   programa del motor. Si el modelo no da algo que el paso pide (p. ej. no tiene nitroglicerina), escribe el paso sin `prepara` de
   fármaco y dilo en la entrega; no lo inventes en el motor.
4. **Succión del Impella: NO se escribe** (sin fuente).
5. Explicaciones y distractores, todos con su origen (REGLAS §1.15). Solo test: «piensa antes», «piensa y destapa», «encuentra el
   error». Nada de redactar, huecos ni emparejar. `<` y `>` literales.
6. Prueba: amplía autonomo/pruebas/shock-vivo.mjs para recorrer el caso de Fermín entero y las preguntas nuevas (desborde tras cada
   respuesta a 390 y 360). Pasa `node autonomo/jueces.mjs --modelo shock-vivo` y `--forma`. Versión: `node autonomo/version.mjs
   20261030-N` con N mayor que la de index.html.
7. Commit y push en auto/b3-scai (líneas de autoría: Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com> y
   Claude-Session: https://claude.ai/code/session_01QiKC3AJEDzsc2QUQ4CarWC). Nada a auto/b3.
8. Entrega en /tmp/plan-socialista/shock-scai/entrega-2.md (≤30 líneas): ids nuevos, lista de frases nuevas con su cita (para el
   auditor), cómo llegar a cada una en la app, jueces ✅/❌, «No comprobado / riesgo».
