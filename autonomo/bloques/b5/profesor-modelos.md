# Profesor · juicio de los dos modelos vivos en la app (b5) · 01/11/2026 · modelo «así sí»: iones vivos (9,5)
Pruebas: `node autonomo/pruebas/{hepatocito,termostato}-vivo.mjs` a 390, las dos en verde y con la consola limpia (hepatocito: 70 combinaciones, 0 malas; termostato: T 22-42, FC 0-115, CK 140-14.540). Prueba nueva: `autonomo/bloques/b5/herramientas/profesor-aterrizajes.mjs` (dónde aterriza cada botón de ficha y qué tapa el dock). He mirado 6 capturas.
Al llevarlas a la app no se perdió nada: el código de pruebas y casos es idéntico al de las maquetas, con la lista R2 39/39 y 35/35. Las rebajas vienen de cosas que ya traía la maqueta y de estados que el rejuicio no vio.

| Criterio §7/§8 | Hepatocito | Termostato | Por qué (lo que resta) |
|---|---|---|---|
| Primera vista | 9,4 | 9,3 | Las dos: idea, monitor y mecanismo arriba. TMV: el «¿Y si…?» se corta en «Tratamiento de la fic». |
| Párrafos y texto | 9,3 | 9,2 | TMV: en el modo guiado la frase viva es solo el título del paso; la explicación (`P.x`) queda debajo de la escena. |
| Resaltado | 9,4 | 9,4 | Oro en la cifra que manda, sello rojo en el tope, chips de origen. |
| El mecanismo se ve a 390 | 9,2 | 8,9 | HPV: con un sello, el monitor crece y el astrocito hinchado queda 17 px bajo la frase (edema: bottom 645 y frase 628). TMV, en `hm:3`: el retículo con «Ca²⁺ suelto», que es la lección, queda bajo el dock. En golpe:4 e hipo:3, la silueta queda 94 px bajo el dock. |
| Interactivo que enseña | 9,5 | 9,4 | El carril que se apaga estación a estación y la llama con el ajuste frente a la T real son de nivel de los iones. |
| Topes y frase viva | 9,5 | 9,0 | HPV completo. TMV: falta el grave del auditor (ibuprofeno «no indicado»). Además, a 42 °C en Juega la FC es 115, pero en el golpe guiado a 41,6 °C es 150-152: dos pacientes incoherentes (§1.12). |
| Móvil (dock ≤30 %) | 9,4 | 8,8 | HPV: 211 px (26 %). TMV: 256 px en Juega (30,3 %) y **318 px en `hm:3` (37,7 %)**, porque el aviso del CO₂ se pinta dentro del panel del dock. |
| Modelo grande | 9,5 | 9,5 | Cada uno explica un capítulo entero y enlaza con otros modelos. |
| Apuesta | 8,9 | 9,3 | HPV: el enunciado da la respuesta («el colon sigue produciendo lo mismo» descarta la opción de más producción). TMV 2: «¿Demuestra…?» se acierta sabiendo hacer tests. |
| Error | 9,5 | 9,6 | Hilario (2 errores, más la ceftriaxona que no es error) y las 4 rondas de 0-2 errores obligan a pensar. |
| Caso (evoluciona, giro, «Lo que te llevas») | 9,2 | 9,3 | Buenos giros: la TC manda en Casimira y la fiebre del día 2 en Ovidio. Pero un fallo no mueve el modelo (solo hay texto) y en el HPV los pasos se apilan sobre el monitor: la reacción del paciente queda fuera de la pantalla. |
| 6 botones de ficha | 9,2 | 9,5 | TMV: los 6 caen en su paso. HPV: `alta:tips` cae saturado (≥300 con el sello de edema) y no se ve cuánto añade el TIPS. `edema` + CVVH deshincha el astrocito al instante, de 1 a 0,11. |
| **Global** | **9,3** | **9,2** | **Pasan los dos** (todo ≥8,75). No llegan a la meta de 9,5. |

## Arreglos por prioridad (para llegar a 9,5)
1. **TMV, grave del auditor**: en `termostato-vivo/libre.js:67-72`, el ibuprofeno sin «no indicado». El sello pasa a «ilustrativo (pauta ÷ 6 h)», y la manta y el rebote de +0,4 llevan «cifra ilustrativa». Hay que cerrarlo antes de la votación.
2. **TMV, dock**: en `termostato-vivo/pagina.js`, que pinta los avisos en `#tmv-dock-panel`, sacar los avisos del dock a `#sello-zona` o plegarlos en `dock-pliega`. Objetivo: ≤253 px en `hm:3` y en Juega. En Juega, el par Paracetamol/Ibuprofeno/+1 h y Enfriar/Recalentar en una sola fila de 4, o sin la etiqueta «Estado».
3. **TMV, el mecanismo bajo el dock**: al entrar en `hm`, `snm` o `golpe` con un sello, `pagina.js` → `ir()` desplaza la escena hasta la capa del `foco` del paso (con `frase-vista.js`, que ya existe), para que se vea la fibra o el retículo.
4. **HPV, monitor con sello**: en `hepatocito-vivo/pagina.js` → `aplicarTopes()`, el sello va debajo de la escena o plegado en una línea (como en `#sello-zona` del TMV), sin la franja duplicada «Riesgo alto de edema». Así el astrocito hinchado queda entero sobre la frase.
5. **HPV, Apuesta**: en `hepatocito-vivo/pruebas.js:5`, quitar «el colon sigue produciendo lo mismo» del `antes`, o convertirla en una apuesta de cifra: «<60 / ~110 / ≥300 µmol/L».
6. **Fallos que se ven en el modelo** (§8: «qué le pasa al paciente»). En el HPV, `pruebas.js:45`, la opción de Ringer lactato lleva `alFallar: { fl: 'rl' }`, y se engancha en `pagina.js:90`; el astrocito se hincha y salta el aviso. En el TMV, `pagina.js:118`: si la opción fallada tiene su «¿y si…?» (solo hielo → `ysi:'hm'`, paracetamol en el golpe), poner `s.ysi`.
7. **HPV, el Caso no tapa el modelo**: en `pagina.js`, al pasar de paso, los pasos anteriores se pliegan a una línea («Paso 1 ✓ NAC»), y tras responder se ve el monitor (`scrollIntoView` del `#hpv-monitor`).
8. **TMV, frase viva guiada**: en `pagina.js:56` (`fraseDe`), el título y la primera frase de `P.x`; el resto queda en `#tmv-pc-x`.
9. **TMV, coherencia**: en `libre.js:49-50`, FC de 140-150 a ≥41 °C con golpe, igual que el estado guiado, y sin «FC 38» con FV (ritmo FV y sin FC). Además, un chip «ilustrativo» y un tope visible junto a `mon-ck`.
10. **HPV, botones**: el de `#ma-var-tips` en `marino-abdomen.html` a `sano:tips` (36 → 70 µmol/L), o una frase con antes → después («215 → ≥300»). En el preset `edema`: o se llama «Riesgo de edema», o lleva `edema:true` para que la CVVH baje la cifra sin deshinchar al instante (coherente con el paso 4 del caso).
11. **Menores**: en el HPV, `pruebas.js:40`, el «por» del acierto del paso 1 explica el porqué (NAC a cualquier hora; paracetamol indetectable en el 50 %). En el TMV, el `<select>` «¿Y si…?» con un texto corto («De la ficha»).
