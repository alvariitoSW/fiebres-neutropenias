# Profesor (juzgar) · eje vivo, Mayéutica del eje y Estudiar 6H · 01/11
Eje vivo **9,4** (pasa; meta 9,5) · Mayéutica del eje **8,25** (no llega) · 6H **7,8** (no pasa).
Medido: `eje-vivo.mjs` 1206 comprobaciones en verde, 42 cambios de paciente, 21 topes; Mayéutica verde a 390/360; 4 capturas.
- Eje: mecanismo de un vistazo; cifras R2 7 y 8 iguales a la maqueta; barrido 280 casos posibles. Silueta pequeña; aviso NA >0,2 en caja entera empuja la frase bajo el dock.
- Mayéutica: buenas apuestas y errores; solo 2 de guía y 2 de examen; Sinforoso, Policarpo y Fulgencio sin pregunta. Toribio día 3: «99/51 con NA 0,4» frente a NA 0 en el 6H.
- 6H: guía 5/5/4 y examen 6/6/6 buenos (9,0); casos 7,0: Bibiana 4, Toribio 4 (sin destapa), Sinforoso 3 (sin destapa; error de 3 frases), Lucrecia 4 (sin error), Policarpo 2 (sin los dos; 2 «te llevas»), Obdulia 3 (error de 3 frases), Fulgencio 3 (sin error; 2 «te llevas»). «Juega»: dos botones «Caso, paso 1 →» sin paciente.
- Juez roto: `autonomo/pruebas/mayeutica-fichas.mjs` cae con «d.guia is not iterable» (importa `b6b-eje-comun.js`, `b6b-eje-tiroides.js`) y no registra fichas del b6b (l. 22-26).
## Receta
1. Casos del 6H a 5-8 pasos con su «encuentra el error» (4-6 frases) y «piensa y destapa» y 3 «Lo que te llevas» (cifras con `cifras-6h.mjs` / `window.__eje.leer()`).
2. Juez `mayeutica-fichas.mjs`: registrar `MAYEUTICA_EJE`, `MAYEUTICA_APENDICES`, `MAYEUTICA_HIGADO` con su `navDe`; saltar módulos sin `guia`.
3. Mayéutica del eje: ≥6 de guía (Sinforoso FC con propranolol, Policarpo cortisol con etomidato/ketoconazol, Fulgencio no se trata, Lucrecia a 7 días) y ≥3-4 de examen (error de Policarpo o Fulgencio).
4. Toribio día 3: mismas cifras y misma NA en `eje-vivo-pruebas.js` y `b6b-eje.js` (`eje-cas-to` paso 3).
5. `js/core/mayeutica.js`, «Juega»: botón con el paciente («Caso de Toribio, paso 1»).
6. Eje: aviso que no es el tope abierto plegado en una línea (`pagina.js`); T3 que sigue a la T4 con levotiroxina (`modelo.js` `eje()` l. 89).
Menor: `&lt;` en `b6b-eje.js` l. 36, 59, 111 → `<`.
