# Juicio del profesor · receptor vivo en la app (b3, parada 2) · 27/10/2026

Base: `node autonomo/pruebas/receptor-vivo.mjs` (324 ✅, 0 ❌, 0 errores de consola, 390 y 360 px) + `autonomo/bloques/b3/herramientas/receptor-juicio-app.mjs` (medidas y 8 capturas en `/tmp/plan-socialista/b3/receptor/cap-juez/`) + 2 capturas del constructor (`cap2/10`, `cap2/11`) y `cap/p08-guia`. Comparado con la maqueta aprobada (8,8) y con la lista R2 (P1-P30: todo lo de la lista está en la app).

| Criterio | Nota | Por qué |
|---|---|---|
| §7.1 Primera vista | 9 | Idea en 2 frases con rotulador, paciente con origen, interruptor y el monitor en la primera pantalla (c1); Fig. 1 asoma a 567 px. |
| §7.2 Párrafos | 9 | Nada supera 4 líneas salvo la frase viva con sello (ver 7.3). |
| §7.3 Resaltado | 8,25 | «llave / cerradura» bien. ❌ Con sello, la frase viva fija ocupa 8 líneas (c2: 300 px de 844) sin nada resaltado salvo el título del sello. |
| §7.4 Lo que enseña se ve | 8,25 | Anillo, metrónomo, medidor de fuerza y la maquinaria de la lupa: al nivel de la nefrona viva. ❌ Decisión 2: en cocaína + betabloqueante la lección **se lee, no se ve** (abajo). |
| §7.5 Interactivo que enseña | **7,5** | La frase viva traduce cada mando con cifras («IC 4,0 → 3,9; IRVS 11,8 → 18,6»). ❌ Decisión 1: al tocar un mando el monitor desaparece y al tocar una cifra su explicación nunca se ve (abajo). |
| §7.6 Vista Visual | n/a | Modelo vivo; las fichas que lo enlazan ya la tienen. |
| §7.7 Móvil | 9 | 0 px de desborde tras cada mando, respuesta y paso; nada se pisa; la lectura bajo Fig. 1 es pequeña pero legible. |
| §7.8 Modelo grande | 9,5 | 14 estados, 3 pacientes, 8+ botones «Verlo vivo» desde Merino Cardiología y Neumología; los receptores animados se quedan y se citan. |
| §7.9 Cada cita lleva a la app | 9,5 | Todo «Ver en la ficha» + PDF; la prueba comprueba los ids (0 rotos; los 3 de P11 corregidos). |
| §7.10 Explicación guiada | 9 | 14 guías de 3-6 pasos con anillo sobre la pieza y cita en cada paso (p08). Copia de la maqueta, no `core/explicacion-guiada.js`: aceptable, al parte. |
| §7.11-7.12 Por concepto · megaproyecto | 9 | Fuentes en lista por estado; plegable «Cómo crecerá» con tabla fuente → qué añade. |
| §1.14 Topes | 9,5 | 7 mandos al tope con sello, deslizador encendido y vuelta atrás; cifras posibles en 14 estados ×(80 %, tope, interruptores ×3). |
| §8 Recorrido en orden y formatos | 9,5 | G1-G7 y E1-E3 en el orden de los caps. 14 → 16; test con «piensa antes», destapa (G4) y error (E3, 1 error). Predice con el modelo tapado (c6: «El monitor y el dibujo salen cuando contestes») y «Compruébalo» mueve la bomba sola. |
| §8 Dificultad | 8,75 | Distractores de la propia ficha (dopamina ≤3 / 3-10 / >10; fentolamina 24 h; fenilefrina β a dosis altas); cada falsa dice qué le pasaría a Amparo. E2 y G5 la correcta es la más corta: vigilar en la próxima tanda. |
| §8 Caso (Begoña) | 9 | 5 pasos con momento, ficha que se rellena con NUEVO en rojo (cap2/10), cálculo 10 µg/mL → 60 mL/h, giro del bisoprolol con «Compruébalo: pon el glucagón», error con 2 frases, «Lo que te llevas» y vuelta a la ficha y al modelo en su estado (cap2/11). |

**Veredicto: no pasa todavía (7,5 en §7.5); con el arreglo 1 pasa y queda en la meta (≥8,75) salvo 7.3 y 7.4, que suben con los arreglos 2 y 3.** Nada de la maqueta se perdió; lo que baja es nuevo de la app.

## Arreglos (para el constructor)
1. **Salto a la lupa** (`js/modules/libros/receptor-vivo/pagina.js`, `verLupa()` y sus tres enganches, líneas 166-179). Medido: al mover NA 25→30 el scroll pasa de 0 a 1600 px: la lupa queda arriba (bien) pero el monitor queda a −1047 px y la Fig. 1 a −793: el residente mueve la bomba y **no ve la cifra que la pregunta G1 le ha enseñado a mirar**. Peor: al tocar la celda IRVS del monitor, `$('monitor').addEventListener('click', () => verLupa())` salta 553 → 1760 px y `#rcv-detalle-fila` (la explicación, con su «Ver en la ficha») queda a −966 px: nunca se ve. Qué hacer: (a) quitar el enganche del monitor y, en `trazas.js` (click de `[data-fila]`, línea 109), tras rellenar `detalle-fila` hacer `d.scrollIntoView({ block: 'nearest' })`; (b) en `verLupa()` salir también si `#rcv-monitor` o `#rcv-fig1` están ≥50 % visibles (el usuario está mirando el efecto; que no se lo quiten) y saltar a la lupa solo cuando está más abajo (fichas, estados). Reflejar el cambio en la prueba: tras `deslizar` con el monitor a la vista, `#rcv-monitor` sigue visible.
2. **Cocaína + betabloqueante** (`js/data/receptor-vivo-data.js` PACIENTES.cocaina / ESTADO cocaina; `dibujos.js` lectura de Fig. 1; `pagina.js` `lecturas()`). Medido: PAM 105 → 110, FC 118 → 104, IC 3,4 → 2,7, IRVS 29 → 38, radio 100 → 93 % (c3a/c3b). Un R1 lee «menos FC, PA sostenida: mejora»; la isquemia solo está en el sello y la frase. Qué hacer sin inventar: con `lecho: 'coronaria'`, añadir a la lectura de Fig. 1 el **flujo coronario ≈ radio⁴** («radio 93 % → flujo ≈ 75 %», fisiología general, ya citada así en el paso 2 de la guía `na-alta` con Poiseuille) y, con el sello, un rótulo rojo «espasmo coronario» sobre el anillo (`.hl-rojo`, misma cita C.cocaina). Que la frase viva diga la cifra: «el anillo coronario pierde un 7 % de radio: un cuarto del flujo». Nada de cambios en el ECG (la fuente no los da).
3. **Frase viva con sello** (`topes.js` `fraseTope()` y `pagina.js` `pintarFrase()`/CSS `.rcv-abierta`): con el sello, mostrar solo «**Título.** primera frase» y el resto plegado (el toque que abre `rcv-abierta` ya existe), con el título en `.hl-rojo`. Así la frase vuelve a 3-4 líneas y el sello se distingue del resto.
4. (Parte, no bloquea) La guía es copia de la maqueta y no `core/explicacion-guiada.js` (P8 de la lista pedía la pieza común): anotar en la bitácora para unificar cuando el siguiente modelo la use.

## No comprobado / riesgo
- No recorrí a mano la Mayéutica entera ni el repaso (lo hace la prueba: 10 preguntas acertando y fallando G1, G4, E3; repaso de 3; caso de 5 pasos con el 3.º fallado); miré G1 y los pasos 4 y final del caso en captura.
- No medí 360 px con los ojos (solo la prueba: 0 desborde). No probé «reducir movimiento» a mano.
- La pantalla completa de la lupa (`core/plano-grande.js`) y «5 curvas» solo por las capturas del constructor (p06, p03).
- Riesgo: la forma de la correcta en E2 y G5 (la más corta) si se añaden más preguntas cortas; el juez de forma de `jueces.mjs` lo mide.
