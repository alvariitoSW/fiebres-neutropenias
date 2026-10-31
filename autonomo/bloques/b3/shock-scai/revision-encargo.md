# Revisión del encargo (Explore sonnet, 8 pasos) + director
- SCAI: ESC 2026 parte 1 pdf 44, Tabla 13 (A-E cualitativos); única cifra: lactato >2 mmol/L (texto, pdf 44). Sin PAS/PAM ("no specific blood pressure cut-off").
- Succión del Impella: sin fuente (Marino solo «suction» en p. 39 MCH y p. 45 balón). Pieza 4 NO se escribe.
- ECMO + Impella: Marino pdf 48 final - 49 inicio (venteo). OK.
- Caso VD: Marino pdf 40-41 solo reconocimiento. GRAVE resuelto por el director: ESC 2026 pdf 44 (7.3.2: diuréticos, líquidos con juicio, inotrópicos y vasopresores, MCS) + Marino caps 18-21 pdf 46 (nitroglicerina no aconsejada en infarto del VD).
- Fermín ya está en js/data/mayeutica/b3b-cardiogenico-1.js (cgf-g5, c6-2, c6-3): el caso nuevo no duplica; ids nuevos con prefijo propio.
- Tabla SCAI de IC sin id: añadir id="ic-scai-tabla" en insuficiencia-cardiaca.html (~l. 765); enlace data-view="insuficienciaCardiaca" data-panel="panel-cardio-ic-tabs" data-tab="ic-descompensada".
- Veredicto: pagina.js:335-340. Lactato: est.lab.lact. D/E: reglas sobre intervenciones del ajuste, rotuladas «modelo».
- Ningún juez mide la letra SCAI: la prueba shock-vivo.mjs debe comprobar una tabla paciente/ajuste → letra. Fermín no está en los bucles de 390/360: añadirlo.
- 700 líneas: sin juez; a mano.
