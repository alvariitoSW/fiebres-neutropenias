# b3d · Juicio del profesor · El pulmón con respirador en la app (rama `auto/b3d`, versión 20261030-76) · 31/10/2026
Programa: `autonomo/pruebas/pulmon-vivo.mjs` (338 ✅, 0 ❌), `herramientas/m-may-cifras.mjs` (55/65 cifras coinciden) y el nuevo
`autonomo/bloques/b3/herramientas/profesor-b3d.mjs` (neumotórax paso a paso, Herminia H2, primeras pantallas). 10 capturas miradas.

| Criterio | Nota | Por qué |
|---|---|---|
| §7.1 Primera vista | 9,5 | Título, 5 pacientes, monitor con curvas y casillas en la primera pantalla; frase viva fija abajo. Mejor que la del shock vivo (que arranca con el monitor vacío un segundo). |
| §7.2 Párrafos | 9,0 | Todo en tarjetas, chips y plegables; solo los sellos del neumotórax son 5 líneas seguidas en la frase viva. |
| §7.3 Resaltado | 9,0 | Casilla en alarma ámbar, «NUEVO» rojo en la ficha del caso, chips de origen; la frase viva no resalta nada. |
| §7.4 Se ve el mecanismo | 8,75 | Curvas, racimo, Pmus y el doble disparo como dos picos con valle corto (VTe 695 = «casi el doble»): sí. El corazón y el neumotórax son tres números en tarjetas y una radiografía: el llenado frenado y la pleura a presión no se ven dibujados. |
| §7.5 Interactivo que enseña | 9,0 | Cada mando mueve curvas y frase viva; «Compruébalo» cambia el modelo desde la pregunta. |
| §7.7 Móvil | 9,5 | Jueces a 390 y 360 en verde; nada se pisa en las capturas. |
| §7.8 Modelo grande | 9,5 | 20 estados, 5 pacientes, 10 fichas de Merino Neumología y 2 del Libro Azul. |
| §7.9 Citas con «Ver en la ficha» | 9,5 | En fuentes del estado, en explicaciones y en distractores. |
| §7.10 Explicación guiada | 9,5 | 21 guías para 20 estados, con «Guía» siempre a mano. |
| §1.14 Topes y paciente posible | 7,5 | **Grave.** Neumotórax: el botón suma 5 × 1,5 = 7,5 cmH₂O, así que el residente ve 0 → 7,5 (PAM 77, sin sello) → 15 (PAM **17**, VS **1 mL**, GC **0,1**, SpO₂ 89 %, sello «shock») → 20 («Parada» con PAM **20** y GC **0,2**: mejor que en el shock). El «shock desde 10,5 con PAM 59» no se ve nunca; un paciente con GC 0,1 no está en shock ni tiene SpO₂ que leer. |
| §8 Recorrido y formatos | 9,0 | 6 guía + 7 examen + repaso + 3 casos de 5 pasos; solo los tres formatos. El caso de Eulalia no tiene «piensa y destapa» (§8 pide uno por caso). |
| §8 Dificultad | 8,75 | PE1-PE4 son MIR de verdad (peso predicho, pico vs meseta, espacio muerto, PVC falsa). Se adivinan por la forma I4 (la opción matizada), PG6 y H1 (recuerdo). |
| §8 Caso que evoluciona, giro y «Lo que te llevas» | 7,5 | Isidro y Eulalia: día, ficha que se rellena en rojo, giro (PEEP 18; hipotensión al conectar), error y llevas. Herminia **no encaja con el modelo** (§1.12): la Mayéutica imprime VS 34 → **44**, GC 3,9 y PAM **78** y el monitor da **38 / 3,6 / 75** tras acotar el motor (74012d31). Y PG2 `lee` Cstat 16 (su enunciado dice 14; la app 14); PG4 11 → 14 (la app 9 → 10). |

**Nota mínima 7,5 · media 8,9 · veredicto: no pasa** (dos criterios por debajo de 8,75; meta 9,5 por modelo vivo nuevo).
Lámina de entrada debajo del modelo: no importa; ayuda (las curvas van primero, §7.1) y queda plegada antes de la Mayéutica. Que se quede.

## Lo que sube cada nota (lo que más sube y más barato, primero)
1. **Herminia y la guía con las cifras del monitor** (§8 caso 7,5 → 9): `js/data/pulmon-vivo-mayeutica.js` líneas 240-265 (H2 `comprobar.cifras`
   44/3,9/78 → 38/3,6/75; paso «Con CPAP 10» l. 249; H3 enunciado y frases l. 250-253; H5 l. 264), l. 40 (PG2 `lee.cstat` 16 → 14) y l. 52-60 (PG4
   `lee`/`cifras` 11 → 9, 14 → 10). Sin tocar código: `m-may-cifras.mjs` debe dar 65/65. Barato.
2. **Neumotórax de paciente posible** (§1.14 7,5 → 9): `js/data/pulmon-vivo-data.js:405` paso 1,5 × 5 respiraciones salta el 10,5. O el botón deja
   pasar 2 respiraciones (+3: 3 · 6 · 9 · 12 · 15 · 18 · 20) o el `paso` baja a 0,7; así el sello «shock» con PAM ≈59 aparece de verdad. En
   `neumotorax.js:57-71 sello()` la parada ha de pintar VS/GC/PAM como «sin pulso» (no 20 mmHg y 0,2 L/min, mejores que el shock) y la SpO₂ «no lee»;
   entre 10,5 y 20 el motor baja de PAM 59 a 17 de golpe: revisar la curva en `corazon.js:109` para que el shock tenga PAM 40-60 antes del paro.
3. **Un «piensa y destapa» en Eulalia** (§8 formatos 9 → 9,5): p. ej. en el paso «Plan de ajuste» (l. 212), «tres cosas que haces para que exhale».
4. **Endurecer 3 preguntas** (dificultad 8,75 → 9,25): I4 (l. 171, quitar la pista «para todo SDRA»), PG6 (l. 71, dar la cifra de PEEP y pedir
   cuánto cae el VS), H1 (l. 233, preguntar qué pasa al Vt si la Cstat cae, como PG5, en vez de la definición).
5. **Que el corazón se vea** (§7.4 8,75 → 9,25): en el panel del corazón (`corazon.js:42-46`) un dibujo mínimo del motor (VCI/aurícula que se
   aplana con la presión pleural) o el enlace al ecógrafo del shock vivo en el estado, en vez de tres tarjetas de números.

## Capturas
Reutilizadas: `/tmp/plan-socialista/b3d/capturas-arreglos/{neumotorax-shock-390,neumotorax-tope-390,doble-disparo-390}.png`,
`capturas-e4b/pul-normal-390.png`, `capturas-l/n1-390.png`, `capturas-m/may-pregunta-390.png`.
Nuevas: `/tmp/plan-socialista/b3d/capturas-profesor/{prof-pulmon-primera-390,prof-shock-vivo-primera-390,prof-caso-herminia-h2-comprobado-390,prof-neumo-descomprimido-390}.png`.

## No comprobado / riesgo
- Las guías («Explícame») no las recorrí a mano paso a paso; me fío de la prueba (21 guías abren y cierran sin desborde).
- La captura del shock vivo salió con el monitor aún vacío (0,8 s): la comparación es con su estructura, no con su dibujo.
- No vi una escena propia de la pleura en el neumotórax: si existe fuera del panel, el juicio de §7.4 sube medio punto.
- 360 px solo por los jueces; el examen de posiciones y longitudes de la correcta, por `jueces.mjs`.
