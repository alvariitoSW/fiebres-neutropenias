# Rejuicio final (profesor, 01/11, sesión 2) · eje vivo 9,4 · Mayéutica del eje 8,6 · hepatocito 8,3 · 6I 8,75 · 6H 8,75
Todo ≥8 (pasa); por debajo de 8,75: Mayéutica del eje y hepatocito. Recetas (para la sesión de cierre):
## Mayéutica del eje (`js/data/eje-vivo-mayeutica.js`, `guiaMas`)
1. G4: distractor «solo actúa en el cerebro» → «baja algo pero sigue por encima de 10 por el estrés de la intubación».
2. G5: quitar los absolutos («cualquier», «siempre») de los distractores.
3. G7: la buena es la única con cifras del modelo → cifras también en una mala («a las 24 h ya 37 °C»).
4. G3: «en la FA el betabloqueante no actúa» → «baja la FC, pero sube la T4 libre».
## Hepatocito (Mira de Eleuterio, estado `hemodialisis`)
1. `hepatocito-vivo-data.js` l. 38: `enc: 'consciencia deprimida'` en el preset `eleuterio`.
2. `pagina.js` `pintarTx()` l. 70: con `s.enc`, «sí · consciencia deprimida (ilustrativo)» en vez de calcularlo por West Haven.
3. Glutatión igual en monitor y guía (`guia.js` `hemodialisis` paso 1): `glut` < `TX.glutDano` o «la NAC lo está reponiendo».
4. `b6b-higado.js` l. 364 `hig-el-n-1`: «encefalopatía (consciencia deprimida)» con nota de fidelidad de la p. 8 (el hígado aún no ha fallado).
## Herramientas
`herramientas/mayeutica-6h.mjs` l. 443 y 502 leen `MAYEUTICA_B1`: reapuntar. «Enlace vista Visual de una pregunta»: el 6H enlaza al modelo vivo, no a la vista Visual (confirmar que es de la herramienta).
