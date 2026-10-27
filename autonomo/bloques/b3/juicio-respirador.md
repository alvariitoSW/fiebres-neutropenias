# b3 · Juicio rápido de la pantalla del respirador (profesor, 27/10/2026) — nota global **8,4 · PASA** (todo ≥8; meta 8,75 no alcanzada en 5 apartados)
Base: capturas 01/02/03 a 390, una nueva (J1-jacinto-390.png), `respirador-prueba.mjs 390` (FALLOS 0, ERRORES 0) y un programa de medidas (geometría, Ti mínimo, rango Pmáx, marcas).

| §7 / regla | Nota | Por qué |
|---|---|---|
| Primera vista | 8,0 | A 390 se ve modo, curvas y casillas (lo importante). Pero la pantalla empieza a 215 px (chips + línea del paciente + lema + rótulo del estado) y los mandos a 760 px con el dock de 102: mandos, teclas y modos quedan bajo el pliegue (742). Un desplazamiento los alcanza; los toques son ≥44 px. |
| Texto y párrafos | 8,5 | Pie de 3 líneas con origen; cada casilla explica al tocarla con su cita; «Alarmas» enumera límites y origen. |
| Resaltado | 8,75 | Pmáx roja en la curva, PEEP punteada, casilla roja (alarma) o ámbar (aviso), barra de alarmas. Identidad por color + texto. |
| Lo que enseña se ve | 8,25 | EIP vacía con «pausa: Insp. mant.» y aparece (13,3) al pulsar la tecla, con el escalón en la Paw; «Esp. mantenida» en Jacinto da PEEP «6,4 total · oculta 6,4» con el escalón espiratorio y el «−10» de flujo. Resta: el **triángulo desnudo** bajo cada respiración de Rafael (flujo fin esp. = 0) se lee como disparo del paciente, que no existe en el modelo (lo vio el director); el volumen de Jacinto no vuelve a 0 (volumen sobre la CRF del modelo) sin rótulo: el aparato real lo pone a cero en cada ciclo. |
| Interactivo que enseña | 8,5 | Mandos redondos con deslizador y frase viva («Ti = VT ÷ flujo»), modos apagados con razón, «Detener» con sello y consecuencia. Pmáx 30 en Isidro: Ppico en rojo, VTe 133 (1,9/kg) con «VTe bajo»: se entiende el corte. |
| Móvil (390/360) | 8,25 | Sin desborde ni NaN en ningún estado. Fallos pequeños: límites de VMe «20 / 2» apilados sin signo; rótulos «PEEP» y «0» pisados cuando PEEP = 0 (Jacinto); «Volumen mL» pisa la curva cuando sube la línea base; la barra recorta la 2.ª alarma («🔔 VT…»). |
| Modelo grande / pieza común | 9,0 | `comun/respirador.js` sin motor: canales, casillas, mandos, teclas y modos por configuración; sirve para VNI y weaning cuando el motor tenga esfuerzo. |
| §1.14 topes | 8,5 | Cada mando con tope y origen rotulado, al tope y al mínimo con consecuencia visible (VTe alto/bajo, VMe bajo, Pmáx muy alta, Detener). FR sin límite, anotado. Faltan: Pmáx mín. 30 sin origen; Ti 0,1 s / I:E 1:34,7 con VT 200 + flujo 100 (coherente con el modelo, pero ningún aparato lo deja). |
| Parecido al real y paciente posible | 8,75 | Barra, curvas rellenas, 3×4 casillas, ruedas, teclas de maniobra y pestañas de modo: la disposición de la foto. Rafael (Ppico 18,3, Pmedia 6,2, I:E 1:7,6 con Ti 0,5 a 60 L/min), Isidro y Jacinto (Ppico 34,7 = 20 resistivo + 8,3 elástico + 6,4 de autoPEEP, PEEP 0) cuadran. PC-AC con PEEP 20 deja el VTe en 600 (modelo lineal, sin sobredistensión): aceptable, mejor con nota. |

## Respuestas a lo que vio el director
1. Triángulos en VC-AC: **no son disparos**: son la marca «flujo al final de la espiración» de `pagina.js` `marcasFlujo()` (l.106-112), que pinta un triángulo rojo en cada paso esp→insp y solo pone la cifra si flujo < −2. En Rafael queda el triángulo sin cifra, idéntico al marcador de disparo de un respirador real. No deberían verse si llega a cero.
2. VMe «20 / 2»: `pantalla.js` l.103 pone `<span>20</span><span>2</span>` y `.lim` es `display:grid` (respirador.js l.71): apilado sin signo ni separación. El resto de casillas usa «≤40».
3. Pmáx: rango 30-50 paso 5 (`pantalla.js` l.47; `TOPE.pmaxMax` 50). Con 30 el deslizador está en su mínimo: correcto según el rango, pero el 30 no tiene origen y con Rafael (pico 18) nunca se ve el corte. Un mínimo de 15-20 (ilustrativo, rotulado) enseñaría más.
4. Altura: pantalla 794 px; a 390 lo primero que se ve es correcto (modo, curvas, 3 filas de casillas); mandos y teclas, bajo el pliegue, accesibles con un desplazamiento. Ver arreglo 4.
5. Sí se parece a la real; cada estado probado es un paciente posible; EIP y PEEP intrínseca se entienden (subtexto «pausa: Insp. mant.» y «total · oculta»). Pide un rótulo el volumen que no vuelve a 0.

## Arreglos (por importancia; ninguno baja de 8, los dos primeros son los que más enseñan mal)
1. `b3-pulmon/pagina.js` `marcasFlujo()` l.106-112: pintar la marca solo si `flujoFinEsp < −2`, siempre con cifra y rótulo «fin esp.»; nunca un triángulo desnudo bajo cada respiración (se lee como disparo, que el modelo no tiene; el plan lo quería apagado).
2. `b3-pulmon/pantalla.js` l.103: límites de VMe como `≤20` y `≥2` (o «▲20 ▼2») y en `comun/respirador.js` l.71 `.lim{gap:1px;line-height:1.1}`.
3. `b3-pulmon/pantalla.js` l.47: Pmáx mín. 15-20 (ilustrativo, en la nota) para que el corte se vea también con Rafael y el deslizador no nazca en el extremo; `TOPE.pmaxMax` con su origen en la nota.
4. Primera pantalla: en `b3-pulmon.html` fundir la línea del paciente y el lema en una (o pasar el lema al pie) y, en `pantalla.js`/`canalesPantalla()`, el canal Volumen plegado por defecto (lo abre «Vistas»), como pedía el plan («la tercera plegable»): ~100 px menos y los mandos entran en la primera vista.
5. `comun/respirador.js`/`monitor.js`: no pintar el rótulo «PEEP» cuando su línea coincide con una marca de escala (PEEP 0 → «PEEP0»); subir la caja del rótulo «Volumen mL» sobre la curva.
6. Volumen de Jacinto: nota en el pie o en la casilla (`pantalla.js` PIE l.61): «la curva es el volumen sobre la CRF del modelo; el aparato la pone a cero en cada ciclo».
7. `pantalla.js` l.115: Ti mínimo (p. ej. 0,3 s, ilustrativo y rotulado) limitando el flujo según el VT, o anotar el hueco; hoy sale Ti 0,1 s e I:E 1:34,7.
8. Barra de alarmas (`respirador.js` l.43): con dos alarmas la segunda se recorta; mostrar la más grave y un contador («+1»).
9. Nota en PC-AC (`pantalla.js` mando `pinsp`/`peep`): «modelo lineal: con PEEP alta el VTe no cae (sin sobredistensión)».

## No comprobado / riesgo
- Solo 390 px en mis medidas (la prueba del constructor da 360 sin fallos); no abrí la Mayéutica en solo lectura ni la Guía paso a paso.
- Lo que el constructor vio en el motor (VTe 100 tras subir la PEEP de golpe en `pulmon.mjs`) sigue ahí: no lo juzgo aquí.
