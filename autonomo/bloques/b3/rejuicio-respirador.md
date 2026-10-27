# b3 · Rejuicio de la pantalla del respirador (profesor, 27/10/2026) — nota global **8,7 · PASA** (todo ≥8; meta 8,75 a un arreglo barato)
Base: `respirador-prueba.mjs` 390 y 360 (FALLOS 0, ERRORES 0), programa de medidas (scratchpad `juez.mjs` + `juez2.mjs`: geometría, alcance de teclas con `elementFromPoint`, Ti mínimo, rango Pmáx) y 3 capturas (01-pantalla-390, R2-mandos-teclas-390, J1-jacinto-390).

## Arreglos comprobados (9/9 hechos; uno a medias)
1 ✅ Sin triángulos desnudos en Rafael (0 marcas); en Jacinto «▲ fin esp. −10» ×3 con cifra y rótulo. 2 ✅ VMe «≤20 / ≥2» con separación. 3 ✅ Pmáx 20-50 paso 5, nota «ilustrativo». 4 ✅ Lema al pie; canal Volumen plegado (solo Paw y Flujo); pantalla arranca a 170 px (antes 215) y los mandos redondos a 652-735, **por encima del dock (742)**: a 390 la primera vista enseña modo, curvas, 12 casillas y la fila de mandos. Teclas (735) y modos (788) quedan bajo el dock sin desplazar, pero con un deslizamiento se alcanzan: 44 px de alto, nunca tapadas (`elementFromPoint` = la tecla, a 390 y 360). 5 ✅ Jacinto con PEEP 0: solo «0», sin «PEEP0»; «Vol mL». 6 ✅ Nota CRF en el pie. 7 ⚠️ A medias: el mando **Ti** (`pantalla.js` l.116) respeta `flujoTope(vt)` (VT 200 → flujo ≤60, Ti 0,2), pero el mando **Flujo** (`pantalla.js` l.45) sigue con `max: 100` fijo: VT 200 + Flujo 100 → Ti 0,12 s e I:E 1:61,5 (FR 8). 8 ✅ Barra «🔔 VMe bajo +1» / «Pmáx alcanzada (30) +1». 9 ✅ Notas en Pinsp y PEEP de PC-AC.

| §7 / regla | Antes | Ahora | Por qué |
|---|---|---|---|
| Primera vista | 8,0 | 8,75 | Lo importante y los mandos entran a 390 sin desplazar; teclas a un deslizamiento, sin pelearse con el dock. |
| Texto y párrafos | 8,5 | 8,75 | Pie con origen, unidades y la nota del volumen/CRF en 5 líneas; cada casilla explica al tocarla. |
| Resaltado | 8,75 | 8,75 | Sin cambios. |
| Lo que enseña se ve | 8,25 | 8,75 | La marca de flujo fin esp. solo cuando no llega a cero y con cifra: ya no se lee como disparo; PEEP «total · oculta 6,4». |
| Interactivo que enseña | 8,5 | 8,75 | Pmáx desde 20 deja ver el corte en Rafael; Ti mínimo explicado en el mando Ti («con VT 500 el flujo no pasa de 100»). |
| Móvil (390/360) | 8,25 | 8,75 | Sin desborde ni NaN; rótulos ya no se pisan; alarmas «+N». Menor: «fin esp. −10» roza el flanco de la siguiente inspiración (legible). |
| Modelo grande / pieza común | 9,0 | 9,0 | `monitor.js` común tocado en una línea (ocultar rótulo si coincide con marca): mejora para todos. |
| §1.14 topes | 8,5 | 8,5 | Pmáx mín. con origen; pero el mando Flujo esquiva el Ti mínimo (arreglo 7 a medias): Ti 0,12 s sin sello ni frase. |
| Parecido al real / paciente posible | 8,75 | 8,75 | Sin cambios; Jacinto Ppico 34,7 y PEEP 0 cuadran. |

## Lo que queda para 8,75 en todo (barato)
- `autonomo/maquetas/b3-pulmon/pantalla.js` l.45 y en `R.mandos` (l.113-116): dar al mando `flujo` `max: flujoTope(r.vt)` y la misma nota del Ti mínimo (o, si el VT baja con el flujo alto, bajar el flujo al tope como ya hace el mando Ti). Con eso §1.14 sube a 8,75.
- Opcional: en el deslizador de Pmáx, el sello de «corte» cuando Ppico = Pmáx (ya está la casilla roja y la barra; basta).

## No comprobado / riesgo
- No volví a medir el escalón espiratorio de «Esp. mantenida» en la curva (lo di por bueno en el juicio anterior); mi sonda no leyó las fases del monitor. Mayéutica en solo lectura y Guía: sin recorrer (fuera del encargo). Servidor en 8811 ya existía (no lo lancé ni lo maté).
