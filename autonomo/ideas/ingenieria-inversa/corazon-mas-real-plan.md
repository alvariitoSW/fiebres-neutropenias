# rea-eco · v2 · Un corazón más real, construido barato (26/10/2026)

Rehace el informe «Un corazón más real» (25/10, 12 mejoras en 3 fases) con tres metas: anatomía más fiel, lo mejor de
cada web en **nuestro** motor, y encargos listos para `/plan-socialista` gastando lo mínimo. No toca la app.
Fuentes leídas: los tres informes de `autonomo/ideas/ingenieria-inversa/` (anatomía de echodemo, EchoSuite/anesthbeta,
ecos libres), `anesthbeta.md`, `tee-inversa`, el README del módulo eco, `corazon-geo.mjs` (REF, `geomVi`, `mover`),
`ecografia.mjs` (`TIPOS`, `DB`), las pruebas, `gasto.mjs` y la medida de gasto del 10-25/10.

## 1. Tesis

- **Las tres webs tienen un corazón fijo** (escultura de Blender, malla de Visible Human) con un **latido de tabla**:
  una curva por tiempo, siempre la misma, que no responde a precarga, frecuencia ni enfermedad. El nuestro **se calcula
  desde el motor** (volúmenes de 35 a 320 mL, pared de volumen constante que engorda sola, TAPSE por mL vaciado, derrame
  que crece, torsión de ~7°, escenarios de shock). Eso es lo que nos hace útiles para estudiar: el paciente cambia y la
  imagen cambia. **Se queda.**
- **Lo que traemos son detalles**: cómo se ve cada tejido (echodemo, EchoSuite), cuerdas y papilares sin manchas
  (echodemo), la cortina aorto-mitral (echodemo), festones y cúspides con nombre (anesthbeta), y una forma del VI y de
  las aurículas comprobada contra una guía, no contra una malla.
- **Lo que no traemos**: sus mallas y su código (CLAUDE §7.9); la malla de Visible Human como corazón (rompe lo
  anterior; como mucho, referencia de forma si el usuario lo pide); el bloque de 256³ vóxeles de EchoSuite (pesa, y
  nuestro moteado ya viaja con la pared); sus cifras de pared como fuente (son de un modelo ajustado a mano); el latido
  de tabla. La ETE con sus mandos es otra tarea (paquete B de `tee-inversa`, parada 3 de `eco-mega`).
- **Regla de oro del gasto**: cada mejora nace con sus **pares de prueba escritos en el encargo**, se construye en el
  modelo barato salvo el primer modelo de algo nuevo, y toca **un archivo dueño**.

Dato comprobado en el código: las cuerdas ya entran en la imagen como línea fina de 0,9 mm con brillo `4 − 6·f` dB
(`ecografia.mjs:344`, caso aparte de `TIPOS`); lo que falta es la losa con grosor y el brillo según cuánto cruzan el
centro del plano (A1), no las cuerdas en sí.

## 2. Lo mejor de cada app, mejora por mejora

Esfuerzo en pasos del constructor (una llamada a una herramienta = un paso; tope 100). Coste en tokens equivalentes,
a partir del gasto medido: barato ≈ 1,1 M por agente de ~100 pasos (≈ 11 k por paso); potente ≈ 5 M por 100 pasos
(los de 150-230 pasos, 7-13 M); profesor (opus) ≈ 0,25 M por juicio; director ≈ 0,05-0,3 M por encargo si no lee
código. Cada coste incluye constructor + director + verificador.

### Bloque A · La imagen (sin PDF nuevo; todo «ilustrativo» o fisiología general)

| # | Mejora | Qué ve el residente y para qué sirve | Idea de | Fuente | Archivos | Prueba (entrada → salida) | Pasos | Modelo | Coste |
|---|---|---|---|---|---|---|---|---|---|
| A1 | **Cuerdas en la imagen, como losa** que brilla al cruzar el centro del plano y se apaga al borde; y **papilares o trabéculas sueltos que se desvanecen** con la distancia a la pared | En A4C/A3C ve las cuerdas como en un eco real; en sístole el VI no tiene «puntos» que parezcan trombo o vegetación. Aprende a no confundir cuerda, trabécula y masa | echodemo (`slab`, `chordsCore`, difuminado 0,1-0,35 cm) | ilustrativo (dB) | `ecografia.mjs` (`TIPOS`, `elementosDelCorte`, tipo `tubo`), `pruebas/ecografia.test.mjs` | A4C en diástole: ≥1 cuerda en la imagen con brillo ≤ valva; cuerda a 0 mm del centro del plano → brillo máximo, a ≥3 mm → ≤ −6 dB; eje corto papilares en telesístole: ningún píxel «tejido» aislado a >4 mm de la pared en la cavidad | 60-80 | barato | 1,1 M |
| A2 | **Una tabla de ecogenicidad por tejido** en `js/data/eco-tejidos.js` (sangre, miocardio, grasa, cuerda, fibroso, valva, pericardio, calcio, hígado) que usan `TIPOS`, la leyenda del simulador y la vista Visual | Ve por qué el pericardio brilla más que el miocardio y la valva más que la cuerda; la leyenda del simulador se lo dice | EchoSuite (`tissueStyle`) + echodemo (tabla en dB) | ilustrativo; se marca así en la página (REGLAS eco) | nuevo `js/data/eco-tejidos.js`; `ecografia.mjs` (lee la tabla, nada a mano); `eco.html` (leyenda) | orden de brillo: sangre < miocardio < valva < pericardio ≤ calcio (prueba `contraste` ampliada); la leyenda lista los mismos valores que la tabla (una sola copia, CLAUDE §5) | 40-60 | barato | 0,8 M |
| A3 | **Sombra acústica tras el calcio** (y tras la columna en la supraesternal): atenuación acumulada a lo largo de cada haz | En una estenosis aórtica calcificada, la valva brilla y deja una sombra negra detrás: aprende a reconocer calcio y a sospechar lo que la sombra tapa | echodemo (sombra solo tras calcio y columna) | tejido «calcio»: ilustrativo; el escenario EA necesita criterios de ficha (atlas/Merino): **hueco si no existe la ficha** | `ecografia.mjs` (bucle por haz), `escenarios.mjs` (forma `estenosisAorticaCalcificada`, `CRITERIOS_FORMA`), `pruebas/enfermedad.test.mjs` | PLAX con calcio: muestras detrás de la valva ≥ −30 dB más oscuras que sin calcio; sin calcio, imagen idéntica a hoy (determinista); criterios de la forma cumplidos con lo que mide el modelo | 70-90 | barato | 1,2 M |

### Bloque B · Forma y movimiento (con Lang 2015 y Mor-Avi 2011 en `docs/`)

| # | Mejora | Qué ve y para qué | Idea de | Fuente | Archivos | Prueba | Pasos | Modelo | Coste |
|---|---|---|---|---|---|---|---|---|---|
| B1 | **Prueba «paciente posible» de la pared y la cavidad**: grosor septo y pared posterior, diámetro del VI, descenso de la base (MAPSE), TAPSE, volumen de la AI, en telediástole y telesístole, para 3 estados del motor (normal, hemorragia, fallo del VI) | Nada visible aún: es el listón que hace que lo demás no se desvíe. Al residente le llega como «medidas normales» en la leyenda, con su página | echodemo (sus cifras sirven para comparar, no como fuente) | **Lang 2015** (tablas de VI y AI; pág. ?: la pone el lector de fuente) → `referencias.mjs`; FATE ya citado (pared 6-10 mm) | nuevo `pruebas/paciente-posible.test.mjs`, `referencias.mjs` | normal: septo TD 6-10 mm (FATE), DTDVI dentro del rango de Lang, FE 52-72 %, MAPSE >10 mm, TAPSE >17 mm; engrosamiento sistólico dentro del rango que diga la fuente (hoy +44 %; echodemo +55 %). Si no llega: prueba `pendiente`, nunca se toca la referencia | 40-60 | barato (+ lector de fuente barato) | 1,1 M |
| B2 | **Ápex menos de bala, VI menos alargado, aurículas más anatómicas**, corrigiendo en el origen lo que B1 marque | El A4C deja de tener un VI «de bala larga»; parece el de un paciente | echodemo (contornos orgánicos) | Lang 2015 (relación largo/ancho del VI y volumen de la AI: pág. ?) | `corazon-geo.mjs` (`REF.lVi`, exponente de `balaExacta`, `geomVi`, huella de las aurículas) | B1 en verde; `geometria.test.mjs` (orificios caben, saco, aurículas sin saltos) sigue en verde; la eco A4C mide largo/ancho dentro del rango | 70-100 | barato (si lo tumban 2 veces, potente) | 1,2 M (+0,8 si segunda vuelta) |
| B3 | **Torsión con fuente y retraso base-ápex**: el giro (hoy 0,12 rad × contractilidad) ligado a la contractilidad del motor con un rango citado, y la base que empieza a bajar un poco antes de que el ápex gire | En el eje corto se ve el «escurrido» del VI; prepara strain y twist del atlas | anesthbeta (4° fijo); echodemo (sin torsión: es lo que no hacer) | **Mor-Avi 2011**, sección «LV rotation» (pág. ?). El buscador da 8,1 ± 3,6° basal y 8,5 ± 3,7° apical (estudio coreano 2008, sin abrir): **hueco hasta tener el PDF** | `corazon-geo.mjs` (`mover`, `tau`), `referencias.mjs`, `geometria.test.mjs` | telesístole normal: giro ápex − base dentro del rango de la fuente; hemorragia (VS bajo): giro menor; el corazón sigue dentro del saco; la prueba «el moteado sigue al tejido» sigue en verde | 50-70 | barato | 1,2 M |
| B4 | **Papilares que se acortan y engordan en sístole; pared libre del VD que engruesa** | En el eje corto de papilares ve el músculo tirar de las cuerdas; en el A4C el VD ya no late «de cartón» | anesthbeta (5 papilares fijos: lo que no hacer), echodemo (VD 3,4 → 4,4 mm) | papilares: fisiología general; **VD: hueco** (FATE da ~5 mm de pared, sin cifra sistólica) | `corazon-geo.mjs` (papilares, `tVd`) | papilar: largo telesístole/telediástole 0,75-0,9; VD: grosor TS > TD y volumen de pared constante ±3 % | 40-60 | barato | 0,6 M |
| B5 | **Cortina aorto-mitral**: cerrar el hueco entre la raíz aórtica y la valva mitral anterior | En PLAX y A3C ve la continuidad mitro-aórtica real, donde hoy hay un agujero | echodemo (faldas de `skirts.js`) | fisiología general (anatomía) | `corazon-geo.mjs` (pieza nueva `Cortina`), `ecografia.mjs` (una línea en `TIPOS`) | PLAX: sin hueco de sangre entre raíz aórtica y valva anterior en todo el latido (fila a fila); la valva sigue abriendo en arco (prueba existente) | 50-70 | barato | 1,0 M |

B5 toca la **anatomía congelada**: el usuario aprobó el 25/10 valvas por segmentos, esófago y coronarias; la cortina no
estaba en la lista → **decisión** (§5).

### Bloque C · Valvas con nombre y pared por regiones (con Hahn 2013)

| # | Mejora | Qué ve y para qué | Idea de | Fuente | Archivos | Prueba | Pasos | Modelo | Coste |
|---|---|---|---|---|---|---|---|---|---|
| C1 | **Festones A1-A3 / P1-P3 y cúspides** (LCC/RCC/NCC; tricúspide A/P/S; pulmonar A/D/I): la valva ya es paramétrica (`psi` por tramos), se parte en 3; color por festón en el 3D y rótulos en el eje corto mitral y el A4C/A3C; «qué festones corta este plano». **Es el paquete C de `tee-inversa`**: se hace una vez para ETT y ETE | Aprende la nomenclatura de Carpentier y qué festón mira cada vista (base del prolapso y la IM) | anesthbeta (6 rejillas, banco de válvulas) | **Hahn 2013** (figuras de las vistas ME con los festones; pág. ?) → `atlas/referencias.js`; nombres: Hahn 2013 | `corazon-geo.mjs` (valvas), `ecografia.mjs` (rótulos), `eco.html` (banco de válvulas: 4 botones + 6 festones), `index.js` | PSAX mitral: los 6 festones en el corte, en orden A1-A2-A3 / P1-P2-P3 según la fuente; A4C: los festones que diga Hahn (A2-A3 / P1, pág. ?); ME comisural (plano a 60°): P1-A2-P3; formas precalculadas siguen mezclando (misma topología) | 90-100 | **potente** (primer modelo nuevo) | 6 M |
| C2a | **Pared por regiones**: peso de contracción por segmento (modelo de 17 segmentos) en la geometría, 1 = normal, 0 = acinético, <0 discinético | Base para infarto y Takotsubo: ve un segmento que no engorda ni se acerca | echodemo (regiones por vértice) | **Lang 2015** (17 segmentos y territorios coronarios; pág. ?) | `corazon-geo.mjs` (`geomVi`/`mover` con `estado.regiones`), `pruebas/paciente-posible.test.mjs` | todos a 1 → geometría idéntica a hoy (byte a byte); septo apical a 0 → ese segmento con engrosamiento <5 % y los demás normales; el volumen total sigue siendo el del motor ±2 mL | 90-100 | **potente** | 5,5 M |
| C2b | **Escenarios de IAM** (anterior, inferior) y Takotsubo con sus criterios | Elige «IAM anterior» y ve el septo y el ápex quietos en el A4C, con la FE que cae | — | fichas de SCA de la app (**hueco**: ver qué fichas hay) + Lang 2015 territorios | `escenarios.mjs`, `CRITERIOS_FORMA`, `enfermedad.test.mjs` | cada escenario cumple sus criterios; patrón de shock cardiogénico si la FE cae por debajo del umbral de la ficha | 60-80 | barato | 1,5 M |

C2 depende de que **las coronarias entren en el motor** («el paciente vivo», fase 1 de `rea`): si no, C2b espera y C2a
se hace solo con pesos manuales. El nuestro ya dibuja coronarias (`corazon-geo.mjs:501-508`): los territorios se asignan
por ángulo `phi` y altura `z`, sin anatomía nueva.

### Bloque D · Referencia real

| # | Mejora | Qué ve | Idea de | Fuente | Archivos | Prueba | Pasos | Modelo | Coste |
|---|---|---|---|---|---|---|---|---|---|
| D1 | **«Real / nuestra» por vista**: un clip o foto de eco real de uso libre junto a la nuestra, con autor y licencia | Compara la imagen del simulador con un eco de verdad en PLAX, PSAX, A4C, A2C, A3C, subcostal VCI, ETE 4C | EchoSuite (cines de Wikimedia con ficha de procedencia) | solo archivos cuya página de Commons diga CC BY / CC BY-SA / dominio público (`ecos-reales-libres.md`); CardioNetworks solo si lo dice la página del archivo | `eco.html`, `img/eco-real/`, créditos en la página y en README | cada `<img>`/`<video>` carga (`naturalWidth > 0`); cada uno con autor y licencia visibles; jueces `--eco` | 40-60 | barato | 0,8 M |

Quitado del informe anterior: nada esencial; se fusionaron 1+2 (A1), 8 (A2), 9 (A3), 4 (B1), 6 (B2), 7 (B3), 3+VD (B4),
5 (B5), 10 (C1), 11 (C2a/b), 12 (D1). Añadido: la tabla única en `js/data/`,
«qué festones corta el plano», las regiones por `phi`/`z` sobre las coronarias que ya existen.

## 3. Plan de construcción para `/plan-socialista`

Rama `auto/eco-mega` (una PR en borrador). Cada encargo = **una pieza, un archivo dueño, ≤100 pasos**, con sus pares
de prueba copiados del cuadro de arriba. Dos equipos que no se pisan: **Imagen** (dueño de `ecografia.mjs`,
`js/data/eco-tejidos.js`, `ecografia.test.mjs`, `enfermedad.test.mjs`) y **Forma** (dueño de `corazon-geo.mjs`,
`referencias.mjs`, `geometria.test.mjs`, `paciente-posible.test.mjs`). `escenarios.mjs`: Imagen en A3, Forma en C2b
(nunca a la vez). `eco.html`/`index.js`/README: cada uno escribe en su `[HUECO]`; `?v=` y fusión, solo el director.

| Orden | Encargo | Equipo | En paralelo con | Depende de |
|---|---|---|---|---|
| 0 | Lector de fuente: Lang 2015 (tablas VI/AI, 17 segmentos) y Mor-Avi 2011 (rotación) → cifras y páginas a `referencias.mjs` (barato, ≤40 pasos, 0,4 M) | Forma | A1 | PDF en `docs/` |
| 1 | A1 cuerdas y papilares en la imagen | Imagen | 0, B1 | — |
| 2 | B1 prueba paciente posible | Forma | A1, A2 | 0 |
| 3 | A2 tabla de ecogenicidad | Imagen | B1, B2 | A1 |
| 4 | B2 forma del VI y aurículas | Forma | A2, A3 | B1 |
| 5 | A3 sombra tras calcio + escenario EA | Imagen | B2, B3 | A2 |
| 6 | B3 torsión con fuente | Forma | A3 | B1 |
| **Parada 1** | **Maqueta «antes / después»** de la imagen (la que pide `eco-mega`): capturas de A4C, PLAX, PSAX con/sin A1-A3 y B1-B3 (barato, 0,5 M) + juicio del profesor (0,25 M) | | | |
| 7 | B4 papilares y VD | Forma | D1 | B2 |
| 8 | B5 cortina aorto-mitral | Forma | D1 | B2, decisión |
| 9 | C1 festones y cúspides (= `tee-inversa` C) | Forma + Imagen (secuencial: primero geometría, luego rótulos; el mismo constructor) | — | A1-A3 y B5 acabados (toca los dos archivos) |
| **Parada 2** | **Primer modelo nuevo** (C1) en el móvil; B4-B5 de paso | | | |
| 10 | D1 real / nuestra | Imagen | C2a | red abierta a Commons |
| 11 | C2a pared por regiones | Forma | D1 | B1-B3 |
| 12 | C2b escenarios IAM/Takotsubo | Forma | — | C2a, coronarias en el motor |
| **Parada 3** | **Bloque entero** en el móvil | | | |
| **Parada 4** | Cambios pedidos hechos → `main` | | | |

Jueces: `node --test` del archivo tocado durante la construcción (≈30 s), la suite completa de eco (~5 min) y
`node autonomo/jueces.mjs --eco` solo al cerrar cada encargo, sin otros agentes trabajando.

## 4. Presupuesto y cómo ahorrar

| Fase | Encargos | Coste estimado |
|---|---|---|
| Lector de fuente + A (imagen) | 0, A1-A3 | 3,5 M |
| B (forma y movimiento) | B1-B5 | 5,1 M (+0,8 si B2 necesita segunda vuelta) |
| Parada 1 (maqueta + juicio) | | 0,75 M |
| C1 (festones) | | 6 M |
| C2 (regiones + IAM) | | 7 M |
| D1 | | 0,8 M |
| Juicios de las paradas 2-3 y director | | 1 M |
| **Total** | 13 encargos | **≈ 24 M** (≈ 17 M sin C2) |

Para comparar: un solo constructor potente de 200 pasos costó 7-13 M; todo este plan vale 2-3 de aquellos. Medidas que
más ahorran aquí, por orden:
1. **Pruebas antes de construir** (B1 y los pares de cada cuadro van en el encargo): una vuelta del juez evitada son
   2-5 M. El constructor no inventa qué comprobar.
2. **Barato por defecto**: solo C1 y C2a en potente (primer modelo de algo nuevo). Si B2 cae dos veces, entonces potente.
3. **Lecturas acotadas con líneas**: el encargo nombra `corazon-geo.mjs` 44-95 (`REF`, `geomVi`), 425-450 (valvas),
   457-490 (papilares y cuerdas), 555-600 (`mover`); `ecografia.mjs` 205-234 (`TIPOS`, `DB`), 339 (`elementosDelCorte`);
   del README solo «Ecografía» y «Reglas». Nada de leer el módulo entero (724 + 703 líneas) en cada encargo.
4. **Hacer una vez lo que sirve a dos**: C1 cierra el paquete C de `tee-inversa` y alimenta la ETE (parada 3 de
   `eco-mega`); la tabla A2 sirve a la eco, la leyenda y la vista Visual; el lector de fuente (encargo 0) lee Lang y
   Mor-Avi una sola vez para B1, B2, B3 y C2a.
5. **Comprobar la red antes de lanzar** (lección del parte del 25/10: 0,25 M perdidos en Commons bloqueado): una llamada
   del director a `commons.wikimedia.org`; si falla, D1 no se lanza.
6. **Director de sesión corta**: una sesión por parada, el director no lee código ni PDF (en la sesión larga fue el
   49 % del gasto por releer su contexto).

## 5. Lo que necesito del usuario

**PDF recibidos el 26/10** y guardados en `docs/`: `lang-2015-cuantificacion-camaras-ase.pdf`,
`mor-avi-2011-mecanica-cardiaca-ase.pdf`, `hahn-2013-ete-completa-ase-sca.pdf` y `mitchell-2019-ett-completa-ase.pdf`.
Las páginas («pág. ?») las pone el lector de fuente en el encargo 0. El PDF de Lang trae al final una actualización
(fe de erratas): el lector la lee también.

**PDF para `docs/`** (todos en la web de la ASE, acceso libre; URL tal como salieron en el buscador; yo no descargo nada):
- Lang 2015, cuantificación de cámaras: https://www.asecho.org/wp-content/uploads/2015/01/ChamberQuantification2015.pdf (B1, B2, C2a).
- Hahn 2013, ETE completa ASE/SCA: https://asecho.org/wp-content/uploads/2014/05/2013_Performing-Comprehensive-TEE.pdf (C1 y la ETE).
- Mor-Avi 2011, mecánica cardíaca ASE/EAE (sección de rotación y torsión): https://www.asecho.org/wp-content/uploads/2025/04/2011_Quant-Evaluation-of-Cardiac-Mechanics-Copy.pdf (B3).
- Opcionales: Voigt 2015, definiciones de strain: https://www.asecho.org/wp-content/uploads/2015/01/Feb-2015-JASE-Definitions-for-a-Common-Standard-for-2D-Speckle-Tracking-Echocardiography.pdf ; Zoghbi 2017, insuficiencias (anatomía mitral): https://asecho.org/wp-content/uploads/2017/04/2017VavularRegurgitationGuideline.pdf .
  Si prefieres, abre `asecho.org` en la red del entorno y los baja el lector de fuente.

**Red**: `commons.wikimedia.org` y `upload.wikimedia.org` (solo para D1).

**Decisiones**:
1. Confirmar: **no** usamos la malla de Visible Human como corazón (mi recomendación); ¿sí como referencia de forma para B2?
2. Cortina aorto-mitral (B5): es anatomía nueva, fuera de lo aprobado el 25/10. ¿Entra?
3. C2 (pared por regiones e IAM): ¿aquí, o espera a las coronarias en el motor («paciente vivo», fase 1)? Sin ellas,
   C2a se hace con pesos a mano y C2b espera.
4. Clips de CardioNetworks: solo si la página del archivo en Commons dice CC BY/BY-SA (mi propuesta), o ninguno.
5. B2 en barato con riesgo de segunda vuelta (+0,8 M), o directamente potente (+4 M). Propongo barato.
6. Si el escenario de estenosis aórtica (A3) no tiene ficha en la app, ¿se hace solo el tejido «calcio» sin escenario?

## 6. No visto / riesgo

- Las cifras de torsión (8,1° / 8,5°) salen del resumen del buscador, sin abrir el artículo: no se usan hasta tener el
  PDF de Mor-Avi 2011 con su página. Las páginas de Lang y Hahn están sin poner (pág. ?): las pone el lector de fuente.
- No comprobé si `asecho.org` se abre desde el entorno. No volví a clonar echodemo (los informes ya traen lo que hace falta).
- El informe anterior no medía cómo se ven hoy las cuerdas (línea fina, `ecografia.mjs:344`): A1 empieza con una captura
  «antes» para no rehacer lo que ya está.
- Los costes son medias del gasto del 10-25/10 (±50 %): un constructor que se atasque puede doblar su encargo. El tope
  de 100 pasos lo corta.
- B3 cambia el movimiento: puede tumbar la prueba «el moteado sigue al tejido» (campo de desplazamiento) y las formas
  precalculadas; el encargo lo dice para que el constructor lo vigile. C1 añade piezas: `semejantes()` y la mezcla
  exigen la misma topología en todos los instantes (sí, si los festones existen siempre).
- La sombra acústica (A3) es nueva en nuestro motor de imagen: coste por haz; medir que no baja de ~30 imágenes/s en Node.
- C2b sin fichas de SCA en la app se queda en hueco; no se rellena con conocimiento general.
- Licencias en origen de las mallas de EchoSuite/anesthbeta y de la escultura de echodemo: siguen sin verse; no importa,
  porque no se trae nada de ellas.
