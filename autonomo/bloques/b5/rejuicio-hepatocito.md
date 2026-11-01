# Rejuicio · maqueta hepatocito B «La fábrica por dentro» (b5, vueltas 2a+2b) · profesor, 01/11/2026

Base: `node autonomo/bloques/b5/herramientas/hepatocito-b.mjs` en verde a 390 y 360 (sin desborde, rótulos 9,1 px, 0 errores de consola, 16 citas con doble botón, astrocito visible sin scroll: bottom 491 < 562, dock 162 px) + 6 capturas (05-abrir 390/360, 07-tips, 06-rl, 04b paso 4 SVG, 04c monitor con sello) + código de `autonomo/maquetas/b5-hepatocito-b/`.

| Arreglo / injerto | Estado |
|---|---|
| 1 Monitor 2 líneas + chip `ilustrativo` 60/150 + `IDEA` arriba con cita doble | ✅ (captura 05; astrocito a la vista al abrir) |
| 2 `opNodo` mín 0,35 + aspa y rótulo «apagado» | ✅ (`dibujo.js` `opNodo`/`apagado`; captura 04b, legible en rojo) |
| 3 Astrocito grande (glutamina + agua, r 30→45,6), puente TIPS, filtro CVVH que roba partículas, urea con cuadrado | ✅ |
| 4 `estado.edema` manda: sello «la TC manda», PA 104/60 con noradrenalina, FC 92 | ✅ (captura 04c; `modelo.js` `leer` → `manda`) |
| 5 Error: 5 frases/1 error (lactulosa alcaliniza) + Hilario 6 frases/2 errores (RL; INR→TEG), enunciado «0, 1 o 2» | ✅ (discrepancia ceftriaxona 1 g/2 g no se marca: bien) |
| 6 `CRECERA` + `FICHA_DE`/`FICHA_MANDO` para «Ver en la ficha» | ✅ |
| 7 Mando rifaximina 0-14 días (aviso <10 con consecuencia) + mando de fluido alb/salino/RL con PA, FC y «70 % en el vaso» | ✅ (RL hincha el astrocito 0,03→0,23 y aviso; alb sello ok) |
| 8 Guías «sano» (3) y «edema» (3) además de Casimira (4); cara de West Haven junto al grado | ✅ (presets Hilario y «Sangrado digestivo» siguen sin guía) |
| 9 Capturas a 360 y comprobación del astrocito sin scroll | ✅ |
| Umbral rápido 120 rotulado «opinión del autor» en el sello (petición de Justicia) | ✅ (`modelo.js` `topes`, origen del sello) |

**Notas nuevas (solo criterios <9,5 de la vuelta 1)**: §7.1 Primera vista **9,25** (idea, monitor compacto y célula entera; a 390 la 2.ª fila de «otras vías» queda bajo la frase, nada esencial) · §7.2 Párrafos 9,25 (igual) · §7.3 Resaltado **8,75** (chip y orden bien, pero en el monitor todo sigue en negrita: nada manda) · §7.4 Se ve el mecanismo **9,25** (carril que se apaga con aspas, astrocito que se hincha con glutamina y agua, CVVH que roba partículas, TIPS que salta; los círculos numerados siguen siendo esquema) · §7.5 Interactivo **9,5** (7 mandos, todos con tope y consecuencia; «mínimo 10 días» ya es tope real) · §7.7 Móvil **9,0** (360 en verde; «TIPS: apagado» pisa la línea discontinua) · §7.8 Modelo grande **9,25** (sirve a fichas 1-4; carriles por bloque) · §7.10 Guía por estado **9,25** · §7.11 Fuentes **9,25** · §7.12 Mapa **9,25** · §8 Apuesta 9,25 (igual) · §8 Error **9,0** (dos rondas de 5 y 6 frases; falta el «piensa la frase buena antes de verla») · §8 Caso **9,25** (los 4 pasos cuadran con el programa: 54 → 165/64 → 70 con 82/45 → 81 con edema que manda y noradrenalina; «Lo que te llevas» 3 puntos). **Global 9,2** (antes 8,8).

**Veredicto**: todo ≥8,75 → **cumple la meta**; no llega a 9,5 en 7.3, 7.7 y §8 Error. Lo exacto que falta:
1. `estilo.css` (`.monitor`): solo la cifra de amonio (más grande, oro) y el grado West Haven en negrita; carril, lactulosa, PA/FC y astrocito en peso normal (§7.3).
2. `dibujo.js` línea `T(103, 190, s.tips ? 'TIPS' : 'TIPS: apagado'…)`: mover el rótulo fuera de la curva (p. ej. x 60, y 215, `text-anchor="start"`) o acortar a «TIPS» + aspa (§7.7); y a 390 subir la escena o quitar la 2.ª fila de «otras vías» para que no quede bajo la frase.
3. `pagina.js` rama `m === 'error' || m === 'hilario'`: al acertar «Es un error», no mostrar `f.por` de golpe: botón «Piensa la frase buena → verla» antes de la corrección (REGLAS §8).
4. `pruebas.js` `CASO` paso 3: al acertar, `Object.assign(s, { fl: 'alb' })` para que el dock enseñe la PA subir como en Hilario (§8 Caso); `guia.js`: guía corta (2 pasos) para los presets Hilario y «Sangrado digestivo» (§7.10).

**No comprobado**: el scroll del panel de mandos (15vh) solo por el programa (dock 162 px, dock+frase 221 < 267); la animación Motion del carril solo por su opacidad a 0,5 s (0,15) y el estado final (1/1/1/1).

## Rejuicio final (vuelta 3) · profesor, 01/11/2026

Base: `hepatocito-b.mjs` en verde a 390 y 360 (astrocito sin scroll bottom 504 < 562, 18 citas con doble botón, dock 162 px, 0 errores) + 4 capturas (05-abrir 390/360, 07-tips, 04c monitor) + código. Los 4 puntos «para 9,5» están hechos: monitor con solo el amonio (grande, oro) y West Haven en negrita (`estilo.css` 77-79); «TIPS: apagado» fuera de la curva (`dibujo.js` 43, `text-anchor="end"`); «Piensa la frase buena → Ver la frase buena» al acertar un error (`pruebas.js` 67, captura 07); paso 3 del caso con albúmina (PA 82/45 → 92/50, sello) y guías cortas de Hilario (2 pasos) y «Sangrado digestivo» (2 pasos) en `guia.js`.

Notas rejuzgadas: §7.1 Primera vista **9,5** · §7.2 Párrafos **9,5** · §7.3 Resaltado **9,5** (en el monitor manda la cifra; lo demás, peso normal) · §7.4 Se ve el mecanismo **9,25** (sin cambio: los círculos numerados del carril siguen siendo esquema) · §7.7 Móvil **9,5** (a 360 «Mitocondria (fisiología general)» roza «sinusoide» y la 2.ª fila de «otras vías» queda bajo la frase: nada esencial) · §7.8 Modelo grande **9,25** (sin cambio) · §7.10 Guía por estado **9,5** (5 guías) · §7.11 Fuentes **9,5** · §7.12 Mapa **9,25** (sin cambio) · §8 Apuesta **9,25** (sin cambio) · §8 Error **9,5** · §8 Caso **9,5**. **Global 9,45**.

Las frases `fisiología general` del ciclo de la urea no confunden: el rótulo de la mitocondria, el paso 2 de la guía «sano», la frase de «Ver el carril» y la nota «fuente no lo dice» de `datos.js` dicen lo mismo con las mismas palabras (la ficha nombra el ciclo, p. 6; las cuatro estaciones y el CO₂ en la mitocondria son fisiología general). Una matización (no resta): la estación 2 «NH₃ + CO₂ mitocondria» separada de la 3 «Ciclo de la urea» puede hacer creer que el paso mitocondrial está fuera del ciclo, cuando es su primer paso; el título «Carril de la urea» que abraza a las cuatro lo salva.

**Veredicto**: cumple la meta (todo ≥8,75) y se queda en **9,45**, a 0,05 de 9,5. Lo que falta, una línea por cosa: `dibujo.js` NODOS: rotular la estación 2 como «1.º paso del ciclo (mitocondria)» y la 3 como «resto del ciclo» (§7.4); `dibujo.js` 27 y zona «sinusoide»: separar 6 px los dos rótulos a 360 (§7.7); `pagina.js` modo apuesta: tras acertar, un «¿por qué?» de una línea que señale la zona del dibujo con `.foco` (§8 Apuesta). Nada de ello bloquea llevarla a la app.
