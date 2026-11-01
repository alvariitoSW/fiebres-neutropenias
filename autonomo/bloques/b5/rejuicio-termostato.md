# Rejuicio · termostato B tras las vueltas 2a y 2b · profesor, 01/11/2026

Base: `node autonomo/bloques/b5/herramientas/termostato-b.mjs` (en verde a 390 y 360: sin desborde, sin errores de consola, rótulos svg 9,5/8,7 px, Osborn 665 px y Fig. 44.5 596 px cargadas; frase viva comprobada en cada paso de los dos casos; «pisa: []»; Juega en mínimo/medio/máximo con sellos `fria`, `agot`, `tmax`+`golpe`, `farm`) + 6 capturas (01 a 390 y 360, 02 sello HM, 05 Ovidio día 2, 06 Juega tope 42, 08 Juega inicio) + código de `autonomo/maquetas/b5-termostato-b/`.

| # | Arreglo o injerto | Estado |
|---|---|---|
| 1 | `caso()` pasa por `fraseDe()`: Marcial paso 1-2 «Primer signo: sube el CO₂», 3-4 «El dantroleno cierra el canal» | ✅ |
| 2 | Monitor en 2-3 líneas sin hueco; sello **debajo** (`#sello-zona`, captura 02); idea arriba con cita doble | ✅ (pero con 2 sellos se pinta caja + banda de cada uno: 4 avisos iguales, captura 06) |
| 3 | Dial 34-42 con aguja de ajuste, flecha de la real, termómetro y «real − ajuste» en la lupa | ✅ (rótulos 8,7 px a 360: el juicio pedía ≥9) |
| 4 | Estado «Juega» (`termostato-libre.js`): `sin` solo si T > ajuste (l. 36), CK solo con esfuerzo/fármaco/escalofrío (l. 21), fármaco → sello «¿HM, SNM o SS?» (l. 54); topes 42/22/41/38 °C y 3 g con página | ✅ |
| 5 | HM paso 4 y caso paso 3 en «hora 6» con CK 24.000; al acertar «fluidos» la T no baja (37,8 es del dantroleno dado en el paso 2) | ✅ |
| 6 | `ERROR`: 4 rondas × 6 frases con 2/0/1/2 errores en posiciones distintas, enunciado «0, 1 o 2»; ronda de Ovidio (paracetamol; 35 °C) | ✅ |
| 7 | `CRECERA` (5 entradas con fuente) y `FICHA` por `pag|id` | ✅ |
| 8 | `APUESTA` con opciones de 47-50 caracteres; `APUESTA2` Dorotea/Fig. 44.5 (57/56/59) | ✅ |
| 9 | Programa comprueba frase por paso, sello sin solapar y topes de Juega | ✅ |
| I | Injertos: dial grande, Juega, error + caso de Ovidio con giro del día 2, CRECERA/FICHA | ✅ |

**Notas nuevas (solo lo que estaba por debajo de 9,5)**: §7.1 Primera vista **9,0** (idea, monitor compacto y dial caben; con sello doble la silueta sale de la primera pantalla) · §7.2 **9,5** · §7.3 Resaltado **9,25** (sello ya no tapa nada; redundancia caja + banda) · §7.4 Mecanismo **9,5** (el dial de A dentro del cuerpo de B: fiebre ≠ hipertermia se ve con aguja y flecha) · §7.5 Interactivo **9,25** (15 topes con página y consecuencia; el mando de dosis de dantroleno queda en CRECERA) · §7.7 Móvil **9,0** (dock + frase sigue en 250 px = 31 %; rótulos 8,7 px a 360) · §7.8 **9,5** · §7.10 **9,5** · §7.11 **9,25** (falta nota «lo que la fuente no dice» sobre la cinética de la CK) · §7.12 **9,5** · §8 Apuesta **9,5** · §8 Error **9,5** · §8 Caso **9,0** (Marcial ya es un paciente posible; en Ovidio, el paso 4 regala la respuesta y la CK cae demasiado deprisa).

**Global: 9,35** (con §7.9 = 9,5 de la vuelta 1). **Pasa** (≥8,75); **no llega a la meta de 9,5** de modelo vivo nuevo por cuatro cosas concretas:
1. `datos.js` `CASO_OVIDIO` paso 4: el contexto dice «el ajuste del hipotálamo en 38,6 °C», que no es un dato medible y da la respuesta. Sustituir por lo que se ve en la guardia («38,6 °C con escalofríos y piel fría y cerrada») y que la explicación de la correcta diga que el escalofrío delata el ajuste alto (p. 45; §8 dificultad, §1.12).
2. `datos.js` `CASO_OVIDIO` paso 4 (`nuevoLibre({ ck: 2400 })`): de CK 18.000 a la hora 6 a 2.400 el día 2 no es un paciente posible (la CK de la rabdomiólisis no cae así en 24 h); dejarla en una cifra alta (p. ej. 9.000, `ilustrativo`) y añadir en `NOTAS` «la fuente no da la cinética de la CK» (§1.12, §7.11).
3. `pagina.js` (configuración de `crearTope`) + `estilo.css` `#sello-zona`: con dos sellos a la vez se pintan dos cajas y dos bandas (captura 06: «Tope del termómetro» y «Golpe de calor» repetidos) y la silueta desaparece de la primera pantalla; mostrar una sola caja (la más grave) y las bandas solo como resumen (§7.1, §7.3, §7.7).
4. `dibujo.js` (`.pq` de la lupa) y `estilo.css`: rótulos del dial a 360 px en 8,7 px; subirlos a ≥9 px (§7.7). Opcional: la frase viva en 2 líneas como mucho para bajar dock + frase por debajo del 28 % (hoy 250 px).

No comprobado con los ojos: estados SNM y SS tras la vuelta 2 (solo por el programa: cifras coherentes), la llama con Motion, la ronda 2 del error (0 errores) en pantalla.

## Rejuicio final (vuelta 3 + retoque; profesor, 01/11/2026)

Base: `termostato-b.mjs` en verde (rótulos svg 9,3 / html 9 px, «pisa: []», sin errores; Ovidio paso 4 `T 38.6 pt 38.6 CK 9000`; Juega máximo `golpe+tmax` con una sola caja) + 4 capturas (01 inicio 360, 06 tope 42 a 390, 05 Ovidio paso 4, 08 Juega inicio).

| Criterio | Antes | Ahora | Por qué |
|---|---|---|---|
| §7.1 Primera vista | 9,0 | **9,5** | Con dos topes solo se pinta la caja más grave (`pagina.js` l. 50 `cola`, `estilo.css` l. 72); la silueta sigue en la primera pantalla a 390 (captura 06) |
| §7.3 Resaltado | 9,25 | **9,5** | Una caja, sin bandas repetidas; el tope de 42 °C cita el Libro Azul, sección III, p. 30 |
| §7.5 Interactivo | 9,25 | **9,5** | Todos los topes con página y consecuencia; la dosis de dantroleno queda rotulada en CRECERA (aceptado) |
| §7.7 Móvil | 9,0 | **9,5** | Rótulos ≥9 px a 360 (captura 01, legibles); dock + frase 251 px (30 %) con la frase en 2 líneas |
| §7.11 Fidelidad | 9,25 | **9,5** | `NOTAS` «Buscado y no encontrado» (CK, velocidad de subida: cap. 34, cap. 43 y Libro Azul) y errata p. 52 NMS/SS; Apuesta 2 ya es asociación, no causa |
| §8 Caso | 9,0 | **9,5** | Ovidio paso 4 da lo medible («38,6 °C con escalofríos y piel fría y cerrada»), la explicación enseña el porqué, CK 9.000 rotulada ilustrativa |

**Global: 9,5. Llega a la meta** de modelo vivo nuevo. Sin pendientes para la maqueta; al llevarla a la app: lista «lo que hace» (R2) y `jueces --modelo`.
