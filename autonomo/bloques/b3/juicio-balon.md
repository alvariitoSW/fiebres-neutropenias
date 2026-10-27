# Juicio rápido · consola del balón (b3-shock) · profesor, 27/10/2026

Base: capturas del constructor (consola-1a2-390), `balon-prueba.mjs` a 390 (OK, 0 fallos) y 2 capturas mías en
`/tmp/plan-socialista/b3/capturas-balon/juez-trazas-1a2.png` (trazados a 3x) y `juez-pie-dock.png`, más medidas del DOM
(marcas R, letras, inflado, segmentos ART, pie frente al dock).

## Notas (REGLAS §7)
| Punto | Nota | Por qué |
|---|---|---|
| 7.1 Primera vista | 8 | La consola abre arriba con Aurelio en 1:1; falta la frase de cabecera del plan §3 («El balón trabaja a contratiempo…»). |
| 7.3 Resaltado | 8,5 | FC verde, ART rojo, aumento/frecuencia azul; «por encima de la sistólica» bien. |
| 7.4 Se ve lo que enseña | 7 | El pico de aumento (88) y su caída se ven; la **telediastólica más baja** (53 frente a 55) no se distingue en el trazado (1 px a escala 20-140) y el pico sistólico propio del latido asistido es un hombro apenas visible. |
| 7.5 Interactivo que enseña | 8 | 1:1/1:2/1:3 y Espera/Inicio cambian trazado y cifras; el «aparte» A/n traduce a cifras. Sin frase viva al cambiar de razón. |
| 7.7 Móvil | 8,5 | Nada se pisa a 390/360 (prueba: 0 desborde, rótulo mín. 8 px). El pie queda bajo el dock al hacer scrollIntoView, pero se lee desplazando 200 px (body padding 116 px): no es fallo. |
| 7.9 Citas | 9 | «Ver en la ficha» (iabp p. 45) en el pie; origen de cada cifra rotulado. |
| 7.10 Explicación guiada | 7 | El estado 1:2 (latido asistido/no asistido) no tiene pasos guiados ni los tres «Piensa» del plan §3; la guía vieja (datos.js l.283) señala la chispa en `#tr-ecg` del monitor, no la consola. |
| §1.14 Topes | 8,5 | Solo razón 1-3 y Espera/Inicio; sin cifras imposibles en ninguna gravedad (prueba). |
| **Global** | **8,0** | Se parece a una consola real (tres trazados, cifras, panel táctil con lo apagado rotulado) y Aurelio es un paciente posible (FC 108, 73/55 (67), aumento 88 en shock cardiogénico). Pasa; no llega a la meta por las letras y la lectura del trazado. |

## Lo que vio el director
1. **Letras A/n**: se dibujan a `x + 14` del marcador R (`consola-balon.js`, `pintar()`, l. ~111), es decir sobre el **inicio** del latido (subida sistólica), antes del inflado (`inf` a R+24): parecen entre latidos. El «n n» del arranque es real: la letra va ~8 muestras por delante de su R y la goma (`HUECO = 6`) solo borra 6, así que la letra del latido nuevo cae a la derecha de la goma, junto a la vieja, durante varios cuadros. Medido: R 72/116/162…, letras 86/130/176, inflado 50/140/231.
2. **Corte en ART hacia x≈240**: es la goma de barrido (`HUECO`, 6 muestras ≈ 12 unidades). No es un error, pero en la ART, al ser continua y mostrar el latido viejo al otro lado, se lee como un salto; en los monitores reales la goma es más ancha.
3. **Forma del latido asistido**: hay hombro sistólico (≈73), muesca, meseta aumentada (≈88, con rizo) y caída brusca; el no asistido tiene su pico (66) y bajada lenta. Lo que no se ve es la telediastólica asistida más baja: el modelo da 53 frente a 55 (2 mmHg; también en gravedad 30 y 100: 49/51, 59/61). No hay marcadores de **desinflado**: `des` = [] en el DOM (el `else if` de `muestra()` da prioridad a `'r'` y el vaciado coincide con la R).
4. **Pie bajo el dock**: solo en la captura (scrollIntoView al inicio); desplazando se lee entero.
5. **Parecido y paciente posible**: sí (ver Global). Aumento 15 mmHg por encima de la sistólica: discreto pero plausible en shock.

## Arreglos, por importancia (★ = baja de 8)
1. ★ `consola-balon.js` `muestra()`/`pintar()`: la letra A/n sobre su diástole (x del inflado o R + ~22 unidades) y guardarla en el **índice** donde se pinta (o borrar `HUECO + 9` muestras por delante) para que la goma la lleve consigo: adiós «n n».
2. ★ `consola-balon.js` `muestra()`: no perder el marcador de desinflado cuando coincide con la R (dos marcas en la misma muestra: `mk` como lista o `des` en `i-1`).
3. ★ (7.4/7.10) Que la telediastólica más baja se vea: o bien el vaciado del balón succiona más en `soporte.mjs`/motor (`tauBalon`), con origen rotulado «modelo», o bien, si el modelo no lo da, una marca y un rótulo en el trazado («telediastólica 53 ← 55») y una nota de que el efecto es pequeño en este modelo. Sin inventar cifras.
4. `pagina.js`/`datos.js`: la frase de cabecera y los 3 «Piensa» del plan §3 (1:2 ¿qué latido tiene la diastólica más alta?; qué presión mira el Aumento; Joaquín y la otra contraindicación), más 3-4 pasos guiados para el estado 1:2 que señalen A, n y la meseta del balón en `#iabp-svg`.
5. `consola-balon.js` `HUECO` 6 → 10-12 para que la goma se lea como goma y no como corte.
6. `consola-balon.js` `montar()`: `W` mide 300 (viewBox 0 0 300 176) y escala; vale, pero los 8 px de rótulo crecen al escalar; medir tras el primer layout (`requestAnimationFrame`) o aceptarlo.
7. Pie: «cifras y trazados: el modelo» incluye el ECG, que es ilustrativo (P-QRS-T de `monitor.js`): decirlo.

## No comprobado / riesgo
- No abrí 360 px por mi parte (solo la prueba del constructor, 0 desborde). No probé 1:3 con los ojos ni Joaquín/Amparo.
- La tira de 180 muestras a FC 108 enseña 6 latidos; a FC 60 el inflado y la R se separarán más: las letras, si se mueven a R+22, deberían ir mejor atadas al inflado real que a una constante.
- Que la telediastólica baje poco puede ser física del motor (`tauBalon`) y no del dibujo: mídalo el constructor antes de tocar.
