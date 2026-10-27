# Rejuicio · consola del balón (b3-shock) · profesor, 27/10/2026

Base: `balon-prueba.mjs` a 390 y 360 (OK, 0 fallos, 0 errores, rótulo mín. 8 px, des > 0, tele A < tele n en gravedad 30/60/100) y 3 capturas: `consola-1a2-390.png`, `consola-1a2-360.png` y `rejuez-guia-paso4-390.png` (paso 4 de la guía 1:2, anillo sobre `#iabp-tel`, 0 errores de consola).

## Arreglos del juicio anterior
1 ★ Letras A/n: hecho. Cada letra queda bajo su meseta (A bajo el aumento, n bajo la diástole llana); sin «n n» a 390. Residuo pequeño: a 360 con gravedad 100 la tira dio «… n(255) n(317) A(336)»: la letra «arrimada al borde» cae a 19 unidades de la siguiente y repite la n. No lo vio la prueba (umbral 1,3 × mínimo).
2 ★ Desinflado: hecho. ▼ tras cada A (des 2-4 por tira).
3 ★ Telediastólica: hecho con honradez. ▼ en la ART y rótulo «tele 54 ← 55» + «baja poco en este modelo: el balón se vacía en una fracción de segundo»; nada inventado en el motor.
4 Frase de cabecera («contratiempo», ficha p. 45) y guía 1:2 de 4 pasos que señalan letras, `#iabp-meseta`, n y `#iabp-tel`: hecho, con «Ver en la ficha» y PDF p. 45 en cada paso.
5 HUECO 10: la goma se lee como goma (capturas). 6 viewBox remedido: letras legibles a 360. 7 Pie: ECG y forma del balón rotulados «ilustrativo»: hecho.

## Notas nuevas (REGLAS §7, §8, §1.14)
| Punto | Antes | Ahora | Por qué |
|---|---|---|---|
| 7.1 Primera vista | 8 | 9 | Frase arriba y consola en 1:1 con Aurelio; se entiende sin leer nada más. |
| 7.3 Resaltado | 8,5 | 8,75 | A azul / n apagado / tele rotulada; una idea por color. |
| 7.4 Se ve lo que enseña | 7 | 8,75 | Meseta, muesca, letras, ▲▼ y la tele rotulada: ya se ve la contrapulsación entera; el descenso pequeño queda dicho, no escondido. |
| 7.5 Interactivo | 8 | 8,75 | 1:2 con frase viva (picoNo/teleNo) y guía; «Compruébalo» en G4-G5. |
| 7.7 Móvil | 8,5 | 8,75 | 390 y 360 sin desborde ni pisadas; cifras legibles. Residuo del borde (arreglo 1). |
| 7.9 Citas | 9 | 9 | |
| 7.10 Guía | 7 | 8,75 | 4 pasos, cada uno señala en `#iabp-svg`; el 4.º dice lo que el libro sí dice y lo que es modelo. |
| §8 Preguntas G4-G6 | — | 8 | G4 y G5 bien hechas (distractores de la ficha, «qué le pasaría a Aurelio», correcta no la más larga). G4 es fácil tras la frase de cabecera; G6 regala E2 (misma respuesta «insuficiencia aórtica», y la Guía va antes del Examen). G5: «se suma el volumen desplazado» va sin `org` (fisiología general/modelo), E2 sí lo lleva. |
| §1.14 Topes | 8,5 | 8,75 | Razón 1-3 y Espera; cifras posibles en 30/60/100 (aumento 82-104, tele 49-61). |
| **Global** | **8,0** | **8,7** | Pasa con holgura; a un pelo de la meta por G6 y el residuo del borde. |

## Lo que queda (barato) para 8,75
- **G6**: no hay sustituto en el plan §3 (solo trae esas tres). Cámbiala de test a **piensa y destapa** (`tipo: 'destapa'`, como el paso «Hora 18» l. 549): «Joaquín lleva el sello Contraindicado. ¿Cuál es la otra contraindicación del Marino y por qué el balón la empeora? Son dos cosas»: (1) insuficiencia aórtica (p. 45-46, `C.iabp`); (2) hinchado en diástole, empuja más sangre de vuelta al VI (`org: 'fisiología general'`, igual que E2). Así G6 pide el porqué y E2 el reconocimiento en un paciente: dejan de ser la misma pregunta. Quitar los distractores «estenosis mitral / FA / hipotensión» (afirmaciones sin página).
- **G5** `datos.js` l. ~416: añadir `org: 'el porqué de superar la sistólica: fisiología general; cifras: modelo'`.
- **G4** (opcional): preguntar por la **telediastólica** más baja (la idea contraintuitiva) en vez de la diastólica más alta, que la cabecera ya regala.
- `consola-balon.js` `pintar()`: no arrimar al borde la letra cuya diástole cae fuera de la tira (dejar que la goma la traiga); evita el «n n A» del borde a 360.
