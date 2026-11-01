# Lista R2 · Termostato vivo (maqueta B «El cuerpo que arde y tirita», 9,5) → app · profesor, 01/11/2026

Fuente de verdad: `autonomo/maquetas/b5-termostato-b.html` + `b5-termostato-b/` (datos.js, termostato-libre.js, modelo.js,
dibujo.js, pagina.js). Destino: `js/modules/libros/termostato-vivo/` + `js/data/termostato-vivo-data.js`; clave de API
`termostatoVivo`, atributo `data-termostato-vivo="<estado>[:paso]"`. PDF: `docs/marino-2024-abdomen-temperatura-caps39-44.pdf`
(páginas del PDF, ya verificadas). Cada casilla se tacha con una captura a 390 (y a 360 si dice «360»).

## A. Lo que queda fijo en pantalla
- [ ] Modos (Explorar · Apuesta · Error · Caso) y `IDEA` arriba con cita doble «PDF p. 45 · Ver en la ficha» (`ma-fiebre-def`).
- [ ] Monitor en 2 filas: T central, FC (`ilustrativo`), CO₂ espirado, CK (`ilustrativo`); escalofrío, sudor, rigidez. Pie del monitor con PA, K⁺ y ritmo cuando los hay.
- [ ] `#sello-zona` **debajo** del monitor: con dos topes a la vez se pinta **una sola caja** (la más grave: `tmax` antes que `golpe`) y las demás plegadas (`cola`); la silueta sigue en la primera pantalla a 390.
- [ ] Escena SVG 360×330: silueta con capas piel / músculo / cerebro (botones Piel, Músculo, Cerebro que las encienden y apagan), lupa del hipotálamo y lupa de la fibra muscular con el retículo.
- [ ] Lupa del hipotálamo: dial 34-42 con aguja del **ajuste**, flecha de la **real**, termómetro, «ajuste X» (oro) y «real − ajuste» (rojo); la llama/aguja gira con `cargarMotion()` de la app en 0,7 s (sin el `motionAqui` de la maqueta); con «reducir movimiento», estado final. Rótulos ≥9,3 en coordenadas SVG (≥8 px a 360).
- [ ] Lupa del retículo: «Ca²⁺ guardado / Ca²⁺ suelto» con partículas de Ca²⁺ de `js/core/particulas.js`; clonus ocular rotulado en el cerebro cuando toca.
- [ ] Dock con 2 pestañas (Mandos | Paciente y enlaces) + frase viva con `js/core/frase-vista.js`, en ≤2 líneas; dock+frase ≤ 30 % de 844. Leyenda de partículas.

## B. Mandos del modo guiado (6 estados × 5 pasos)
- [ ] Selector Estado: Fiebre (Dorotea 55 a.), Golpe de calor (Ovidio 34 a.), Hipertermia maligna (Marcial 28 a., 75 kg), SNM (Jacinta 47 a.), Síndrome serotoninérgico (Jacinta día 8), Hipotermia (Honorato 72 a.), Juega.
- [ ] «‹ Paso / Paso ›» 1-5 con título, texto, foco en la capa, cita doble y origen de cada paso (`ESTADOS[*].pasos`); la frase viva pasa por `fraseDe()` en todos los pasos.
- [ ] Botón «Dar: <tratamiento de la ficha>» (`trat`) que aplica `con` del paso: golpe 41,6 → 38,2 °C y PA 86/48 → 104/62; HM el dantroleno cierra el canal (Ca²⁺ guardado, cede la rigidez); hipotermia ECMO/gases 23 → 28 °C.
- [ ] «¿Y si…?» (6): paracetamol en el golpe, manta en la fiebre, solo hielo en HM, seguir haloperidol, ciproheptadina IV, fluidos a 21 °C; cada uno con sello, lo que le pasa al paciente y su página (`YSI`).
- [ ] Figuras reales: Fig. 43.1 Osborn (`mar-fig43-1-onda-osborn.jpg`, p. 56) y Fig. 44.5 (`mar-fig44-5-temperatura-mortalidad.jpg`, p. 71), `naturalWidth > 0`, se abren en hipotermia y en fiebre / pirógeno máximo.

## C. Estado «Juega» (`termostato-libre.js`) y sus topes (R3: regla, fuente)
- [ ] Mandos: pirógeno (0 / 38,3 / 39,4 / >39,4 °C), carga de calor (ninguna/ambiente/esfuerzo/fármaco), carga de frío (ninguno/aire/agua <15 °C/alcohol), Paracetamol 1 g, Ibuprofeno, «+1 hora», Enfriar 5 min (evaporativo/inmersión/hielo/suero frío/manta), Recalentar (pasivo/activo/gases/fluidos calientes/fluidos a 21 °C/ECMO). Velocidades por hora: `ilustrativo` salvo evaporativo 0,3 °C/min (p. 47) y gases 2,5 °C/h (p. 56); 4,5 °C/h del agua fría rotulado «no es de Marino».
- [ ] **Tope 42 °C** (`TOPE.max`): sello «Tope del termómetro», FC y SNC en el texto, desactiva calor y «+1 hora»; origen Libro Azul, sección III, p. 30 (`docs/libro-azul-seccion-iii-inmunitario-parte1.pdf#page=30`).
- [ ] **Golpe de calor ≥41 °C** sin fármaco: sello «enfriar ya, hasta 38 °C», piel sin sudor (p. 46-47). **≥40 °C con fármaco**: sello «¿HM, SNM o SS?», nunca «golpe» (p. 48-52). **≥39 °C con carga de calor**: aviso de agotamiento (p. 46).
- [ ] **Parar a 38 °C**: enfriar sin fiebre por debajo de 38 °C → aviso y rebote +0,4 °C por escalofrío (p. 47).
- [ ] **Antipirético sin fiebre**: sello «Sin efecto: no es fiebre» **solo si T > ajuste** (p. 45); desactiva paracetamol e ibuprofeno.
- [ ] **Manta en la fiebre**: sello «Contraproducente: escalofrío», +0,4 °C (p. 72). **Falta en la maqueta**: Enfriar (evaporativo, hielo, suero) repetido **en fiebre** baja la T sin suelo hasta 22 °C; poner la misma regla (por debajo del ajuste, escalofrío y rebote; ficha p. 72 y 45) y comprobarlo en el barrido.
- [ ] **Paracetamol**: aviso al llegar a 3 g/día (cap. 44, p. 72, FDA 2011), aviso al pasar de 3 g («el cap. 6 admite 4 g: las fuentes discrepan») y sello con >4 g, que desactiva el botón (cap. 52); contraindicado en insuficiencia hepática.
- [ ] **Ibuprofeno sin tope en la maqueta**: añadir el de la ficha `ma-antip-aine` (10 mg/kg, máximo 800 mg, **cada 6 h**, p. 72): aviso con la 4.ª dosis en 24 h y sello con la 5.ª, que desactiva el botón; si el profesor/auditor no lo valida, se pide, no se inventa.
- [ ] **Hipotermia**: aviso de bradicardia y bradipnea <32 °C (p. 54); escalofrío cesa por debajo de 30 °C (`TOPE.tirita`, p. 54); aviso de FV <28 °C (p. 54-56); sello «No declarar la muerte: recalentar» <24 °C (FC 0, desactiva frío y «+1 hora», p. 54); suelo de cálculo 22 °C. Fluidos a 21 °C: aviso «enfrían más»; calientes: «no recalientan» (p. 56).
- [ ] Pirógeno >39,4 °C: aviso «más temperatura, menos mortalidad» (Fig. 44.5, p. 70-71, asociación observacional). Calor y frío a la vez: aviso «combinación no fisiológica» (se ignora el frío).
- [ ] CK solo sube con T ≥40 °C **y** esfuerzo, fármaco o escalofrío (`pasar`), rotulada `ilustrativo`; FC de 60-130 por encima de 32 °C y 56/46/38/0 por debajo (ilustrativa).
- [ ] Barrido de extremos (`autonomo/pruebas/termostato-vivo.mjs`): cada mando de Juega en mín/medio/máx, «+1 hora» ×30, cada antipirético ×6, Enfriar y Recalentar ×10 con y sin fiebre, y cada estado × paso × trat/ysi → T 22-42, FC, PA, CK y CO₂ de paciente posible, sello en cada tope, sin solape de `<text>` a 390 y 360.

## D. Pon a prueba
- [ ] Apuesta 1 (Marcial, cifras ocultas): ¿fiebre o CO₂ primero? 3 opciones de 47-50 caracteres; revela el paso 3 de HM (p. 49).
- [ ] Apuesta 2 (Dorotea, Fig. 44.5): asociación, no causa (p. 71); las dos apuestas se alternan.
- [ ] Error: 4 rondas × 6 frases con 2 / 0 / 1 / 2 errores en posiciones distintas (SNM ×3, Ovidio ×1), enunciado «0, 1 o 2» sin decir cuántos; ciproheptadina IV, fiebre antes que rigidez, restringir líquidos, paracetamol en el golpe, enfriar a 35 °C.
- [ ] Caso Marcial (4 pasos): min 10 CO₂ 38 → 68 → suspender halogenado → dantroleno 2 mg/kg (150 mg) repetido hasta 10 mg/kg (p. 48) → hora 6 CK 24.000, K⁺ 6,2: fluidos y potasio → día 1 1-2 mg/kg/6 h ≥24 h (p. 48-49).
- [ ] Caso Ovidio (4 pasos, se alterna con Marcial): 41,6 °C enfriar → 38,2 °C a los 11 min parar → hora 6 analítica de fallo de órganos (CK 18.000, ilustrativa) → **giro del día 2**: 38,6 °C con escalofríos y piel fría y cerrada = fiebre (ajuste alto), CK 9.000 `ilustrativo`, rótulo «paciente inventado».
- [ ] «Lo que te llevas» (3 puntos con cita) al final de apuesta, error y cada caso; cada fallo dice qué le pasa al paciente y «Lo correcto: …».

## E. Fuentes, notas, enlaces
- [ ] Cada cita con «PDF p. N» y «Ver en la ficha» que abre `marino-abdomen` en el id de `pag|id` con `data-resaltar` (en la maqueta es un toast); la del Libro Azul abre su PDF en p. 30.
- [ ] Plegables: Fuentes (3), Notas (errata p. 52 «NMS» → SS reproducida con nota; «Buscado y no encontrado»: cinética de la CK y velocidad de subida de T), «Lo que el modelo podría sumar» (`CRECERA`, 5) y Para profundizar.
- [ ] Enlaces de «Paciente y enlaces»: la maqueta usa `data-nefrona-viva="rabdo"` y `"hiperk"`, **estados que no existen**. Cambiar a `data-iones-vivos="adela"` («Hiperpotasemia en los iones vivos») y, para la rabdomiólisis, `data-nefrona-viva="nta"` rotulado «Lesión renal en la nefrona viva» solo si la ficha de la nefrona lo respalda; si no, quitarlo y dejarlo en `CRECERA`. `mc-posresucitacion` existe (Manual UMI).

## F. Registro y botones en las fichas (`marino-abdomen.html`, 6)
- [ ] Huecos `[HUECO termostato: …]` sustituidos (libros/index.js ×4, index.html, marino-portada.html, jueces-forma/movil/topes) y «← VOLVER» a la ficha de origen.
- [ ] Botones `.especialidad-link` `data-termostato-vivo`, cada uno dentro de su párrafo: `#ma-fiebre-def` → `fiebre:2` (sube la llama) · `#ma-calor-golpe` → `golpe:4` (≥41 °C) · `#ma-hipertermia-farmacos` → `hm:3` (primero el CO₂) · `#ma-snm-clinica` → `snm:3` (la fiebre llega tarde) · `#ma-ss-claves` → `ss:3` (clonus ocular) · `#ma-hipo-grados` → `hipo:3` (<28 °C, Osborn).
