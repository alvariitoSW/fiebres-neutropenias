# Historial · Sobrevivir a la UMI: Manual UMI, Dudas de guardia, Preguntas difíciles, Técnicas R1

> Texto movido tal cual desde el antiguo `CLAUDE.md` (octubre 2026). Es la historia de cómo se construyó
> esta parte: decisiones, fuentes, auditorías y verificaciones. Las reglas vigentes están en `CLAUDE.md`.

### Sobrevivir a la UMI

Séptima especialidad del menú raíz (`#btn-sobrevivir-umi`, junto a
Hematología, Nefrología, UCI/Papers Tuiter, Fisiopatología UCI, Cardiología
y Neumología) — deliberadamente **distinta** del resto: no está organizada
por especialidad de órgano ni por artículo/guía, sino que reúne en un solo
sitio **todo** un manual práctico de guardia de una vez, sin fragmentarlo
por tema clínico. Fuente: manual de orientación interno de la Unidad de
Medicina Intensiva del Hospital Universitario de Gran Canaria Dr. Negrín
(HUGCDN), "Cómo estar en la UCI sin matar ni morir" (105 páginas, enviado
por el usuario en 2 partes) — mismo criterio ya establecido en el proyecto
para PNT/manuales internos de un servicio (ver Trasplante de Hematología y
los PNT de Nefrología): nunca reproducir el documento original ni los
nombres del personal que figuran en él, extraer solo el contenido clínico
y reescribirlo con la voz propia de la app, citando de forma genérica. Los
2 PDF se archivaron en `docs/hugcdn-umi-manual-guardia-parte1.pdf` (52
págs. reales, la 53 duplica la 52 — artefacto de exportación) y
`docs/hugcdn-umi-manual-guardia-parte2.pdf` (offset de página real =
página impresa − 52).

- **Primer intento, descartado tras feedback explícito del usuario**: la
  primera versión de este contenido se construyó fragmentada — un reparto
  temático en 3 sitios distintos (una guía "Cardiología práctica" dentro de
  Cardiología, una guía "Manejo respiratorio práctico" dentro de
  Neumología, y una especialidad nueva "Protocolos UCI" para el resto —
  nutrición/electrolitos/shock séptico/DDS/glucemia/rutinas de guardia),
  con el bloque neurocrítico aplazado por volumen. El usuario rechazó
  explícitamente esa estructura ("Construía un apartado nuevo general
  llamado sobrevivir a umi, ahí subiría todo el archivo y a parte en cada
  cosa que añadas info a lo que ya haya en la app que haya croslink y pueda
  pasar de una a otra fácilmente sin tener que fusionar ambas") y pidió en
  su lugar **un único apartado con el manual completo**, con cruces de
  navegación hacia el contenido ya existente en vez de fusionarlo o
  repartirlo. Se deshizo la fragmentación (las 2 guías de
  Cardiología/Neumología y la especialidad "Protocolos UCI" se eliminaron
  por completo, sin dejar referencias sueltas) y se reconstruyó como se
  describe abajo — **nunca vuelvas a fragmentar este manual por
  especialidad de órgano**: todo lo que llegue de él (incluido el bloque
  neurocrítico pendiente, ver más abajo) se amplía dentro de esta misma
  especialidad, conectado al resto de la app solo por cross-links.
- Mismo patrón de dos niveles que Cardiología/Neumología/UCI Papers
  Tuiter, pero con una única guía: un **submenú** (`#sobrevivir-umi-menu-view`/
  `js/modules/sobrevivir-umi/sobrevivir-umi-menu.html`, con
  `.btn-volver-especialidades`) con un solo botón que lleva a la
  **vista de la guía** (`#manual-umi-view`) y su cuaderno de campo. El
  switcher `sobrevivirLevel` vive en `js/modules/sobrevivir-umi/index.js`
  (`createViewSwitcher({ menu, manualUmi })`); `sobrevivirUmi.init()`
  devuelve `{ volverAlMenu, irAFicha }`, inyectado perezosamente en
  `home/index.js` (`onSobrevivirUmiListo`, mismo patrón que
  `onNeumologiaListo`) para dejar siempre el submenú como pantalla de
  entrada. Si en el futuro se añade una guía/manual nueva distinta de este
  mismo tipo (protocolo de guardia completo, no fragmentable por órgano):
  1) botón nuevo en `sobrevivir-umi-menu.html`, 2) su propio `<guia>.html`
  con `.btn-volver-sobrevivir-umi-menu`, 3) registrarlo en `index.html`
  dentro de `#sobrevivir-umi-view` y en el switcher `sobrevivirLevel` de
  `sobrevivir-umi/index.js`.

- **Guía única: "Manual UMI Negrín — Guía completa"**
  (`js/modules/sobrevivir-umi/manual-umi.html`+`.js`). **Cuaderno de campo
  de 18 fichas** (`#manual-umi-corkboard`/`#panel-manual-umi-tabs`, mismo
  `core/corkboard.js` de siempre, sin calculadoras propias —
  `manual-umi.js` solo llama a `initCorkboard(...)`), en el orden real de
  aparición en el manual: Rutinas de guardia y traslado intrahospitalario
  (estructura del pase de guardia por sistemas, checklist completo de
  traslado antes/durante/después), Reposición de electrolitos en la UMI
  (tablas reales de dosis de K⁺/Ca²⁺/Mg²⁺/fósforo por déficit, fármacos que
  causan hipopotasemia, fórmula de TTKG), Nutrición en el paciente crítico
  (principios de inicio precoz, fórmulas de peso ideal/ajustado, cálculo
  energético por Harris-Benedict e Ireton-Jones, requerimientos de
  macronutrientes, cribado NRS2002), Shock séptico — manejo inicial y
  cóctel de Marik (definiciones Sepsis-3, objetivos de reanimación en 6h,
  protocolo completo del cóctel de vitamina C/tiamina/hidrocortisona),
  Endocarditis infecciosa — criterios de Duke (originales y modificados,
  algoritmo diagnóstico ETT/ETE, ESC 2015), Descontaminación digestiva
  selectiva y aislamiento por BMR (criterios de riesgo al ingreso,
  protocolo DDS estándar/mixta, reglas de aislamiento de contacto),
  Fármacos vasoactivos — receptores y dosis (α/β adrenérgicos,
  dopamina/dobutamina/noradrenalina/adrenalina/nitroglicerina/nitroprusiato,
  más una tabla de sedantes/relajantes musculares/antibióticos en perfusión
  continua reutilizada de la misma fuente), Secuencia de intubación rápida
  (SIR) — los 7 pasos, tabla de fármacos de inducción/relajantes con dosis
  reales, algoritmo por estabilidad hemodinámica, Programación inicial del
  respirador (tabla de parámetros iniciales, fórmula de PBW, tabla
  FiO₂/PEEP de la ARDS Network, checklist de verificación antes de conectar
  al paciente), Criterios de extubación y brecha aniónica (5 criterios
  requeridos + 3 opcionales, fórmula y causas de hiato aniónico elevado),
  Protocolo BLUE de ecografía pulmonar (algoritmo completo en 3 pasos
  sliding/líneas A-B/PLAPS hasta los 5 diagnósticos — edema pulmonar,
  neumonía, EPOC/asma, TEP, neumotórax), Cirugía cardiaca — anticoagulación
  y sangrado (protocolo de heparina sódica guiado por rAPTT, algoritmo de
  sangrado post-CCV guiado por tromboelastograma), Hemodinámica invasiva y
  protocolo Swan-Ganz (fórmulas PAM/IC/RVS/RVP/DO₂/VO₂, patrones
  hemodinámicos del shock, algoritmo de reanimación por PAM/TAS),
  Ecocardiografía FATE a pie de cama (las 4 ventanas básicas,
  dimensiones/contractilidad normales, índice de colapsabilidad de VCI,
  patología importante de referencia), Marcapasos — código de 5 letras
  (NBG) con los grupos de recomendación I-III, Síndrome posparada cardíaca
  (componentes, 5 fases, manejo inicial y optimización guiada por
  objetivos), Fibrilación auricular — algoritmo de anticoagulación, y
  Control glucémico — algoritmos y pauta móvil (los 6 algoritmos
  escalonados de perfusión de insulina I-VI, pauta móvil subcutánea,
  reglas de medición). **Sin imágenes extraídas** — las figuras del manual
  (anatomía TC, territorios vasculares, esquemas FATE) se recrearon como
  `.data-table`/`.algo-flow` nativos. **Sin calculadoras propias** —
  contenido de referencia puro (tablas/algoritmos), mismo criterio ya
  aplicado a otros bloques iniciales de manual/protocolo de la app.
  Bibliografía consolidada al final de la propia guía (18 entradas, una
  por ficha, `#page=N` con el offset ya citado arriba).
  - **90 preguntas de quiz** (`js/data/manual-umi-preguntas.js`,
    `umi-q001`-`q090`, 5 por ficha × 18 fichas — 4 opción múltiple + 1 de
    redactar, formato reducido ya establecido en UCI/Papers Tuiter para
    fuentes de tipo protocolo/manual práctico en vez del formato completo
    de ~8 por ficha). `triggerId: 'btn-manual-umi-repasar'`. El banco
    combinado de toda la app queda en <strong>1829 preguntas</strong>
    (sin cambio de total frente al primer intento fragmentado — es el
    mismo contenido, solo reorganizado en una única especialidad en vez
    de 3, con Cardiología/Neumología devueltas a sus totales previos —
    286 y 184 respectivamente — al retirarse sus guías UMI propias).
  - **Bugs ya corregidos, heredados de la construcción original y
    reproducidos aquí para no repetirlos**: 3 tablas anchas (índice de
    colapsabilidad VCI ×2, patrones hemodinámicos del shock de 7 columnas)
    envueltas en `<div style="overflow-x:auto;">` para evitar overflow
    horizontal a 390px; y frases de `.field-hook`/`.back-hook` con
    palabras compuestas unidas por "/" sin espacios (p. ej.
    "α1/α2/β1/β2/β3") sustituidas por comas/"y", porque Chromium no las
    trata como punto de ruptura de línea válido y desbordaban la ficha —
    lección para el futuro: evitar compuestos de 3+ términos unidos solo
    por "/" sin espacios en el texto de gancho de una ficha (las tablas y
    el cuerpo sí pueden usar "/" sin espacio con seguridad, porque ahí el
    ancho de columna ya fuerza el ajuste).
  - **Cross-links reales en ambas direcciones**, siempre con
    `.especialidad-link` (nunca `.tx-link`, que tiene su propio listener
    global sin acotar en `nefrologia/index.js` y colisionaría con
    cualquier `data-view` ajeno a `nefroLevel` — mismo bug ya documentado
    y evitado para Vías Urinarias↔Nefrología y Merino Cardiología),
    resueltos por el listener genérico ya existente en `home/index.js`
    sobre todos los botones `.especialidad-link` del documento — nunca se
    fusionó contenido entre la ficha de guardia y la ficha "de estudio" ya
    existente en el otro sitio, solo un botón que lleva de una a otra:
    - `umi-electrolitos` ↔ Nefrología (`nefrona`/`panel-fisio-tabs`):
      4 botones de ida (`fisio-hipopotasemia`, `fisio-hipocalcemia`,
      `fisio-magnesio`, `fisio-fosforo`) + 4 botones de vuelta, uno desde
      cada una de esas 4 fichas de `nefro-menu.html`.
    - `umi-shock-septico` ↔ Merino Cardiología (`mc-shock-septico`).
    - `umi-vasoactivos` ↔ Merino Cardiología (`mc-vasopresores`).
    - `umi-cirugia-cardiaca` ↔ Merino Cardiología (`mc-damage-control`).
    - `umi-fa-anticoagulacion` ↔ Merino Cardiología
      (`mc-fa-cardioversion`).
    - `umi-posparada` ↔ Merino Cardiología (`mc-posresucitacion`).
    - `umi-respirador` ↔ Merino Neumología (`neumo-vm-modos`).
    - `umi-dds-aislamiento` ↔ Merino Neumología (`neumo-nav-prevencion`).
    - `umi-extubacion` ↔ 2 destinos de ida (Merino Neumología
      `neumo-sbt` y UCI/Papers Tuiter, guía de extubación PUMA,
      `extub-algoritmo`) + 2 botones de vuelta, uno desde cada uno.
    - `umi-hemodinamica` → Fisiopatología UCI, bloque Cardiología
      (`cardio-fisiologia-aplicada`) — solo de ida, sin botón de vuelta
      (esa ficha ya es muy extensa y no se le añadió cross-link propio).
    14 botones de ida en total (10 puntos de inserción dentro de
    `manual-umi.html`, 2 de ellos con más de un destino) + 13 botones de
    vuelta repartidos en 5 archivos (Merino Cardiología, Merino
    Neumología, la guía de extubación PUMA de UCI/Papers Tuiter, y las 4
    fichas de electrolitos de Nefrología). Verificado con Playwright en
    ambas direcciones (ida y vuelta) sobre una muestra representativa
    (electrolitos↔Nefrología, vasoactivos↔Merino Cardiología): cada botón
    deja la ficha de destino con `.active` real y la vista de la
    especialidad correcta visible.
  - Verificado con Playwright: las 18 fichas abren/voltean sin error de
    consola ni 404 real; sin overflow horizontal a 390px; el menú del quiz
    en 3 niveles muestra "Sobrevivir a la UMI (90)" → "Manual UMI Negrín
    (90)" → las 18 fichas con 5 preguntas cada una, y un recorrido mixto
    de preguntas de opción múltiple y de redactar no generó ninguna
    excepción JS; los totales de Cardiología (286) y Neumología (184)
    confirmados de vuelta a sus cifras previas a la fragmentación.
  - **Bloque neurocrítico y meningitis (octubre 2026, ya hecho)**: 12
    fichas nuevas, XIX-XXX, dentro de la misma guía (nunca una
    especialidad aparte), a petición del usuario de "terminar de subir el
    contenido teórico". Fuente: `hugcdn-umi-manual-guardia-parte2.pdf`
    págs. 77-99 (página del PDF = página impresa − 52) y
    `...-parte1.pdf` págs. 30-32 (página del PDF = impresa + 1); los dos
    PDF son escaneos, así que se leyeron como imagen página a página
    (rasterizadas con `pdftoppm` y giradas las que vienen apaisadas).
    Fichas: Sedación RASS/Ramsay (`umi-sedacion`), TCE clasificación,
    pronóstico y diagnóstico (`umi-tce-dx`), TCE manejo escalonado, PIC y
    cirugía (`umi-tce-manejo`), ondas de PIC (`umi-pic-onda`), hidrocefalia
    y LCR por causa (`umi-hidrocefalia`), fibrinolisis intraventricular
    (`umi-fibrinolisis-iv`), neuroanatomía en la TAC y territorios
    (`umi-neuroanatomia`), Marshall (`umi-marshall`), HSA con Fisher,
    Hunt-Hess y Doppler transcraneal (`umi-hsa`), vaina del nervio óptico
    y fuerza muscular (`umi-onsd`), Rankin y GOS
    (`umi-escalas-pronostico`) y meningitis/ventriculitis con Lozier
    (`umi-meningitis`). El tablero pasa de 18 a 30 fichas.
    - **12 calculadoras nuevas** en `manual-umi.js` (mismo patrón
      `CALCULADORAS`, con `leerNumero()` que nunca convierte un campo
      vacío en 0): asistente RASS en los 3 pasos del manual, indicación de
      sensor de PIC en el TCE grave, PPC (= PAM − PIC, marcada como
      fisiología general: el manual solo da los umbrales), onda de PIC
      que pasa de distensible a rígida (dibujo ilustrativo entre las 2
      ondas de la figura), índice de Evans, volumen de t-PA, Marshall,
      Lindegaard con los cortes del algoritmo, vaina del nervio óptico,
      Rankin y GOS (preguntados por separado: ayuda que necesita, vida
      independiente y trabajo; nunca se deduce una escala de la otra),
      Lozier (las combinaciones que la tabla no describe se dicen como
      tales) y ajuste de antibiótico intraventricular por débito del DVE.
    - **5 imágenes reales** en `js/modules/sobrevivir-umi/img/`: 4 cortes
      de TAC rotulados (págs. 87-90) y la tira de 6 TAC de Marshall (pág.
      94). No se reproducen, por sus derechos, la figura de territorios
      (Simon, Greenberg y Aminoff, *Neurología clínica*, McGraw-Hill), la
      ilustración del drenaje (Hadenfeldt-Muller) ni las de áreas
      funcionales: se recrean como tablas. Esquemas propios en SVG para
      la onda de PIC, el índice de Evans y la vaina del nervio óptico.
    - **Notas de fidelidad (erratas de la fuente, nunca corregidas en
      silencio)**: manitol "0,25-1 mg/kg" (se entiende g/kg); Marshall
      tipo IV con "línea media desviada 20 mm" (la clasificación original
      y la propia lista pronóstica del manual usan &gt;5 mm, verificado con
      `WebSearch`; la calculadora usa &gt;5 mm); P2 "refleja el
      compartimiento venoso, P2 = 80% de P1" frente a la figura que rotula
      P3 como venosa; Lindegaard 3-6 "indeterminado" en el algoritmo
      frente a 3-5/&gt;6 en la tabla; "aneurisma no aislada"; "10/mg/kg"
      de rifampicina; el hematoma subdural repetido; la angiografía y la
      ventriculografía con aire listadas como pruebas de antes de la TAC.
    - **Quiz**: 60 preguntas nuevas (`umi-q091`-`q150`, 5 por ficha: 4 de
      opción múltiple + 1 de redactar). Manual UMI queda en 150 y la
      asignatura Sobrevivir a la UMI en 172.
    - **Enlaces**: Sedación → delirio/CAM-UCI de Fisiopatología UCI ·
      Inmunología; TCE manejo → Ficha XVIII (glucemia 140-180); Meningitis
      → Ficha XXIII (LCR). Técnicas R1 cambia la categoría "Neurocrítico
      (pendiente)" por 7 accesos reales (la clase `.tec-pendiente` queda
      en el CSS sin uso). El índice rápido del submenú gana un 5.º bloque,
      "Neurocrítico" (`neurocritico` → `umi-sedacion` en
      `rutasCategoria`).
    - **Hallazgo de paso**: la variable `--text-dim` no existía en
      `variables.css` (en `fill` de SVG pintaba negro). Arreglado después:
      ver «Arreglos de código (octubre 2026)».
    - Lo que quedaba pendiente del mismo manual se cerró después: ver
      «Huecos del manual cerrados» más abajo.
  - **Auditoría de contenido + interactividad y sus correcciones**, a
    petición explícita del usuario ("revisa que está todo correctamente,
    comprueba que falta, que está mal escrito... comprueba que partes se
    pueden hacer interactivas, además las fórmulas matemáticas
    presentarlas mejor visualmente con una pequeña parte interactiva...
    croslinkear cosas con el contenido ya incluido en la app"). Releídas
    contra la imagen real del PDF (ambos archivos son escaneados —
    `pdftotext` no extrae texto —, así que la verificación se hizo viendo
    las páginas como imagen con el `Read` tool) las fórmulas de las 3
    fichas más numéricas del manual: Hemodinámica (Ficha XIII), rAPTT
    (Ficha XII) y electrolitos (Ficha II) — se encontraron **3 erratas
    reales de la propia fuente**, tratadas con el mismo criterio ya
    establecido en el proyecto (nunca "corregir" en silencio, reproducir
    fielmente + nota de fidelidad, e implementar la calculadora nueva con
    la forma correcta):
    - **PAM**: la tabla ya transcrita en `umi-hemodinamica` reproduce la
      fórmula del manual, `(PAD+PAS−PAD)/3` — que se reduce
      algebraicamente a PAS/3 sin más, matemáticamente incoherente
      (con PAS 120/PAD 80 daría PAM=40). Confirmado en la imagen de la
      página real del PDF que es así como está impresa. Añadida una nota
      de fidelidad explícita bajo la tabla, y la calculadora nueva usa la
      fórmula estándar correcta `PAM = PAD + (PAS−PAD)/3`.
    - **VO₂**: la fórmula de la misma tabla, `IC×1,34×Hb×(SatO₂−SatVO₂)`,
      da un resultado ~10× por debajo del propio rango normal que la
      fuente cita en la fila de al lado (110-160 ml/min/m²) — le falta el
      factor ×10 (mismo que ya lleva la fórmula de DO₂ de la fila
      anterior). Verificado que solo con ×10 el resultado cae dentro del
      rango que la propia fuente declara normal — no una cifra inventada,
      sino una reconciliación contra el propio rango de referencia de la
      misma tabla. Nota de fidelidad añadida; calculadora con el ×10.
    - **rAPTT**: la tabla de titulación de heparina tiene una banda
      "&lt;2" que se solapa literalmente con la banda "1,2-1,5" de la fila
      de abajo — confirmado en la imagen de la página real. Interpretado
      como "&lt;1,2" en la calculadora nueva (para dejar las 5 bandas
      contiguas, la intención clínica evidente), documentado con nota de
      fidelidad en vez de "arreglar" la tabla original en silencio.
    - **11 calculadoras interactivas nuevas** añadidas, una por fórmula
      matemática real del manual que antes solo aparecía como texto/`kv-row`
      — mismo patrón `.tfg-simulador`/`.form-group` y guard
      `.value === ''` ya usado en toda la app (nunca tratar un campo vacío
      como 0): TTKG y déficit de K⁺ a reponer (Ficha II); peso ideal/
      ajustado + IMC + TEB (Harris-Benedict) + CED (Ficha III, Nutrición);
      PBW + volumen tidal objetivo (Ficha IX, Respirador); brecha aniónica
      (Ficha X, Extubación); titulación de heparina por rAPTT (Ficha XII,
      Cirugía cardiaca); calculadora hemodinámica completa —PAM/IC/RVS/
      DO₂/DO₂I, con VO₂ y RVP opcionales si se rellenan los campos venosos/
      pulmonares— con 2 avisos de "combinación no fisiológica" (PAD≥PAS,
      SatVO₂&gt;SatO₂) (Ficha XIII); FS/FEVI por ecocardiografía + índice
      de colapsabilidad de VCI con 3 modos según ventilación (Ficha XIV,
      FATE), ambas con su propio aviso de combinación no fisiológica
      (diámetro sistólico≥diastólico, dmin&gt;dmax); constructor
      interactivo del código NBG de 5 letras, con la descripción de cada
      posición actualizándose en vivo (Ficha XV, Marcapasos); y doble
      calculadora de dosis de insulina —pauta móvil subcutánea + perfusión
      IV por los 6 algoritmos I-VI— a partir de la sola glucemia
      introducida (Ficha XVIII).
    - **3 cross-links nuevos** hacia contenido ya existente en otras
      especialidades, siempre `.especialidad-link` (nunca `.tx-link`, que
      tiene su propio listener global sin acotar en `nefrologia/index.js`
      y colisionaría con cualquier `data-view` ajeno a `nefroLevel` — mismo
      riesgo ya documentado y evitado en el resto del proyecto): Ficha X
      (Extubación) → Nefrología, clasificador ácido-base completo
      (`nefrona`/`panel-fisio-tabs`/`fisio-acidobase-acidosis`); Ficha XIII
      (Hemodinámica) → Merino Cardiología, tabla de patrones hemodinámicos
      del shock (`merinoCardiologia`/`panel-merino-cardio-tabs`/
      `mc-definiciones`); Ficha XIV (FATE) → Fisiopatología UCI, bloque
      Vías Urinarias, el gauge de PVC/PCP ya existente
      (`viasUrinarias`/`panel-vu-tabs`/`vu-fisiologia-renal`) — deliberadamente
      solo de ida (sin botón de vuelta en las 3 fichas destino), a
      diferencia de los cross-links bidireccionales ya construidos entre
      otras especialidades, porque este manual ya lleva 14 enlaces de ida
      hacia el resto de la app (ver el bloque de cross-links más arriba) y
      añadir uno más de vuelta a cada uno de esos 3 destinos no aportaba
      valor proporcional al esfuerzo.
    - Verificado con Playwright (viewport 390×844): las 18 fichas
      abren/voltean sin error de consola ni 404 real (solo el `favicon.ico`
      ya documentado como inocuo) y todas activan su `.tab-content`
      correctamente; las 11 calculadoras nuevas responden a la entrada con
      los valores esperados (comprobado a mano, p. ej. AG con Na 140/K 4/
      Cl 100/HCO₃ 15 → 29,0 mEq/l elevada; rAPTT 1,30 → banda "40 UI bolo,
      subir 2 UI/kg/h"; NBG con V/V/I → "VVI"; glucemia 250 + Algoritmo III
      → "8 UI SC" + "5 UI/h IV"), el guard de campo vacío se respeta (borrar
      Na en la calculadora de AG deja el último resultado válido en vez de
      recalcular con 0); los 3 cross-links nuevos navegan a la especialidad
      y ficha exacta de destino; sin overflow horizontal a 390px. **Nota de
      metodología de verificación**: un primer intento de comprobar el
      volteo de la Ficha X con clicks de coordenadas de Playwright
      (`{force:true}`) dio un falso positivo de fallo — el click de
      coordenadas no siempre landea de forma fiable sobre `.back-cta`
      cuando la ficha está en plena transformación 3D (`rotateY(180deg)`);
      el disparo del evento `click()` real vía `page.evaluate()` confirmó
      que la lógica de la app (y el propio `core/corkboard.js`) es
      correcta — si en el futuro un test de Playwright reporta que una
      ficha "no voltea" o "no activa su panel" sin motivo aparente, probar
      primero con un click DOM directo antes de asumir un bug de la app.
    - Sin cambios de contenido/redacción de las 18 fichas más allá de las
      3 notas de fidelidad — no se encontraron erratas de transcripción
      propias de la app (nombres, dosis, tablas ya trasladadas
      correctamente desde el manual), solo las 3 erratas ya presentes en
      la fuente original documentadas arriba.
  - **4 cross-links bidireccionales nuevos** (8 botones), a petición
    explícita del usuario ("croslinkea su contenido con el del resto de
    la app que se pueda hacer" — deliberadamente solo donde existe
    solapamiento real de contenido, nunca fabricado por cobertura:
    endocarditis/Duke, SIR, control glucémico y rutinas de guardia se
    investigaron explícitamente y se descartaron por no tener ninguna
    ficha equivalente en el resto de la app). Los 4 pares, siempre
    `.especialidad-link` (nunca `.tx-link`, mismo riesgo de colisión con
    el listener global sin acotar de `nefrologia/index.js` ya documentado
    varias veces en este archivo):
    - `umi-nutricion` ↔ Trasplante/`tph-soporte` (Hematología) — la
      calculadora general de peso/IMC/TEB/CED de este manual frente a la
      nutrición específica del paciente de TPH ya desarrollada en
      Trasplante.
    - `umi-blue` ↔ 2 destinos: `ic-descompensada` (Cardiología, guía ESC
      2026 de IC — líneas B como criterio de descongestión) y
      `neumo-cuidado-barotrauma` (Merino Neumología — mismo hallazgo
      ecográfico de neumotórax por barotrauma, ya descrito allí con más
      detalle fisiopatológico).
    - `umi-marcapasos` ↔ `ic-comorb-cv` (Cardiología, guía ESC 2026 de
      IC) — el código NBG de 5 letras de este manual frente a la
      indicación real de TRC vs. marcapasos convencional en HFrEF ya
      citada en esa ficha.
    - **Bug arquitectónico corregido de paso**: el listener genérico de
      `.especialidad-link` en `home/index.js` leía `especialidad`/`view`/
      `panel`/`tab` del `dataset` del botón pero nunca `trasplante` —
      pese a que `irAResultadoBusqueda` ya soportaba ese parámetro desde
      la integración de Vías Urinarias/otras especialidades. Sin ese
      campo, el cross-link `umi-nutricion → tph-soporte` (que necesita
      abrir específicamente la subvista `intro` de Trasplante) no podía
      funcionar. Corregido añadiendo `trasplante` a la desestructuración
      del `dataset` y reenviándolo a `irAResultadoBusqueda(...)` — arregla
      también, de paso, cualquier `.especialidad-link` futuro que
      necesite apuntar a una de las 3 subvistas de Trasplante.
    - Verificado con Playwright (viewport 390×844) en las 2 direcciones
      de los 4 pares (8 navegaciones en total): cada botón deja el
      `.tab-content` de destino con `.active` real y `offsetParent !==
      null` (visible de verdad, no solo con la clase puesta); sin errores
      de consola ni de página en ningún punto del recorrido.
  - **Rediseño visual de `sobrevivir-umi-menu.html` con `/dataviz`**, a
    petición explícita del usuario. La pantalla de entrada tenía un solo
    `.const-node` cuyo `.const-desc` embutía los 18 nombres de ficha en
    una sola línea de texto corrido, con mucho espacio vacío debajo —
    confirmado con una captura de Playwright antes de tocar nada (mismo
    método ya establecido en el proyecto: nunca rediseñar a ciegas).
    Aplicado el método de `/dataviz` aunque no hubiera ningún gráfico de
    datos real que dibujar — su principio de **color categórico fijo, sin
    ciclar** (identidad de bloque = color siempre igual) sí aplicaba
    directamente a organizar las 18 fichas en bloques temáticos:
    - Nuevo componente **`.quick-index`/`.qi-item`** (`css/components.css`,
      bloque nuevo antes de `.tx-link`): grid 2×2 de tarjetas compactas con
      barra de color izquierda (`--qi-color`), icono, título y descripción
      — deliberadamente más ligero que un `.const-node` completo por
      bloque (los 4 bloques abren el mismo destino, `manual-umi-view`,
      solo cambia la ficha de entrada — un `.const-node` por bloque habría
      repetido peso visual sin aportar una decisión de navegación
      distinta).
    - **4 bloques temáticos**, agrupando las 18 fichas por afinidad
      clínica real (no por orden de aparición): Guardia y metabolismo
      (rutinas, electrolitos, nutrición, glucemia — púrpura, mismo acento
      ya usado por la cabecera de la especialidad), Shock e infección
      (shock séptico, endocarditis, DDS/aislamiento, vasoactivos — rojo),
      Vía aérea y ventilación (SIR, respirador, extubación, BLUE — verde),
      Cardiovascular avanzado (cirugía cardiaca, Swan-Ganz, FATE,
      marcapasos, posparada, FA — azul/dorado). Mismos 4 colores de acento
      ya usados en el resto de la app, nunca un color nuevo — mismo
      criterio de "plugging into the system" del propio método `/dataviz`
      (nunca inventar tokens de color, solo usar los del sistema de diseño
      ya validado).
    - **Validador de paleta ejecutado antes de dar el diseño por bueno**
      (`scripts/validate_palette.js` de la skill `/dataviz`, mismo método
      ya usado en la auditoría de fidelidad de Fisiopatología UCI): los 4
      colores elegidos (`--accent-red/purple/green/blue`) **fallan** 3 de
      los 6 chequeos contra el fondo oscuro de la app — confirma, con
      cifras, los 2 "gotchas" ya documentados en varios puntos de este
      mismo archivo (`--accent-green` con poca saturación sobre fondo
      oscuro, "lee como gris"; el par púrpura/rojo-tierra con ΔE de visión
      normal 10,2, por debajo del suelo de 15). No es una regresión nueva
      — es una limitación ya conocida y documentada del sistema de 5
      colores de toda la app, que el proyecto ya decidió no tocar sin
      petición explícita (cambiar un token de color afecta a decenas de
      sitios ya verificados). La mitigación aplicada, siguiendo la propia
      regla del método `/dataviz` para paletas que fallan la validación
      ("identity is never color-alone"): cada `.qi-item` lleva icono +
      título en negrita + descripción de texto — la identidad del bloque
      nunca depende solo del color, exactamente el mismo criterio de
      "barra de color + `<strong>`" que ya usa `.micro-prof-item` en toda
      la app.
    - **Wiring**: `sobrevivir-umi/index.js` ganó una tabla `rutasCategoria`
      (mismo patrón `data-route`→`onRoute` que `rutasAtlas` del Atlas
      Hematológico, aquí sin pantalla de zona intermedia porque los 4
      bloques comparten el mismo destino) que resuelve cada
      `[data-categoria-route]` a `sobrevivirLevel.show('manualUmi')` +
      `openCorkboardTopic('panel-manual-umi-tabs', <primera ficha del
      bloque>)` — reutiliza `openCorkboardTopic` ya importado, sin lógica
      de navegación nueva.
    - El `.const-node` original ("Manual UMI Negrín — Guía completa") se
      mantuvo sin quitar, con su `.const-desc` acortado (ya no enumera las
      18 fichas, remite al índice rápido de abajo) — sigue siendo el
      camino directo a la guía completa sin pasar por ningún bloque.
    - Verificado con Playwright (viewport 390×844): captura de pantalla
      antes/después confirmando visualmente el resultado (grid 2×2 sin
      huecos ni solapes, texto legible); los 4 botones de bloque navegan
      cada uno a la ficha exacta esperada
      (`umi-rutinas`/`umi-shock-septico`/`umi-rsi`/`umi-cirugia-cardiaca`)
      con `.active` real y `offsetParent !== null`; el botón original de
      "Ver todo →" sigue abriendo la guía completa sin regresión; sin
      overflow horizontal a 390px (`scrollWidth === clientWidth`); sin
      errores de consola ni de página. Bump de cache-busting a
      `?v=20260929-4` (cambia `css/components.css`).
  - **De 1 guía a 4 — auditoría de contenido + rediseño**, a petición
    explícita del usuario ("revisa la bibliografía... hagas una revisión
    sistemática de la información... y hagas un índice de contenido que
    le falte, cosas que están mal etc y después `/design` una nueva forma
    de presentar la información... habría que añadir varios apartados:
    dudas planteadas en cada guardia, preguntas MC difíciles basadas en
    clínica, y técnicas/conocimientos que debe saber un R1"). Proceso en 2
    fases, mismo orden pedido:
    1. **Auditoría con 2 agentes en paralelo**, mismo método ya establecido
       en el proyecto (uno solo-app, otro solo-fuente, sin verse entre sí):
       el agente "solo-app" releyó `manual-umi.html`/`manual-umi.js`/
       `manual-umi-preguntas.js`/`sobrevivir-umi-menu.html` sin tocar
       ningún PDF; el agente "solo-fuente" releyó los 2 PDF completos
       (104 páginas, 46 bloques temáticos reconstruidos) sin ver ningún
       archivo del repo. El cruce (hecho directamente, con `grep` sobre
       `manual-umi.html` para confirmar cada sospecha antes de darla por
       buena — descartó un falso positivo real, Urapidilo/Amiodarona SÍ
       estaban en la tabla de sedantes pese a la sospecha inicial)
       encontró: 1 error interno real (`calcDeficitK()`, Ficha II, usa una
       fórmula de reposición de K⁺ distinta de la que el propio texto
       declara, sin nota de fidelidad — a diferencia de otras 2
       discrepancias similares del mismo archivo que sí la llevan), varios
       🟡 de inconsistencia de estilo (ausencia total de `.hl-*` en el
       módulo, profundidad visual desigual entre fichas, un bloque del
       índice rápido —"Guardia y metabolismo"— que agrupa fichas no
       contiguas en el tablero), y un índice de huecos de contenido
       confirmados contra la fuente: el bloque **neurocrítico completo**
       (10 secciones, ~21 páginas — TCE, PIC, hidrocefalia, fibrinolisis
       intraventricular, anatomía de TC, Marshall, Fisher/Fisher
       modificado/Hunt-Hess, Doppler transcraneal, ONSD, GOS/Rankin) y
       **meningitis/ventriculitis** (Criterios de Lozier), ambos ya
       anotados como "pendiente" en este mismo archivo; y 3 hallazgos
       nuevos no anotados hasta ahora — **escalas de sedación RASS/Ramsay**
       (0% en la app, confirmado por grep), **capnografía/EtCO₂** (0%) y
       **estimación de peso/talla por antropometría** (0%, Ficha III) —,
       más 2 de severidad menor (diagrama piramidal de cobertura
       antibiótica, tabla M-mode extendida de FATE con gravedad por
       parámetro, y 3 fármacos del bloque relajantes/sedantes —Pancuronio,
       Neostigmina, Fisostigmina— ausentes de la tabla de 8 filas de la
       Ficha VII). Ninguno de estos huecos se ha cerrado todavía en esta
       ronda — quedan documentados aquí como índice para una ampliación
       futura del propio Manual UMI, no implementados a la vez que el
       rediseño.
    2. **Rediseño con el tipo Artifact "Design"**: antes de tocar código,
       se subieron como *assets* los 3 CSS reales de la app
       (`variables.css`/`base.css`/`components.css` tal cual, sin
       recrearlos) y se enlazaron directamente en 4 artboards `.dc.html`
       de 390px (mismo ancho que el resto de verificaciones de la app) —
       nunca una recreación aproximada de la paleta, el CSS real cargado
       en el propio canvas de prototipos, mismo criterio ya establecido en
       el proyecto para estas exploraciones. Aprobado por el usuario en la
       primera ronda (sin iteraciones de dirección visual esta vez, a
       diferencia del rediseño del menú raíz) y pasado a código tal cual.
  - **Las 4 guías del `.constellation`**: el `.const-node` original
    ("Manual UMI Negrín") se mantuvo con su `.const-tag` cambiado a
    "Referencia · 18 fichas" (antes "Ver todo →") y su `.const-desc`
    actualizada para avisar de la ampliación pendiente, y se añadieron 3
    `.const-node` más — mismo patrón exacto ya usado por Cardiología
    (varias guías en un único `.constellation`), sin inventar un
    componente nuevo:
    - **Dudas de guardia** (`dudas-guardia.html`/`.js`, acento
      `--accent-yellow`, 📝): bitácora **deliberadamente sin el patrón de
      `core/corkboard.js`** — no es "una ficha de estudio más" (ni flip,
      ni pregunta de repaso de gancho, ni `.tab-content` separado), es un
      `<details>`/`<summary>` nativo por entrada (clases
      `.duda-card`/`.duda-summary`/`.duda-respuesta` en `components.css`).
      El diseño original (confirmado con `AskUserQuestion`) era contenido
      estático sin ningún campo de texto — **el usuario pidió
      explícitamente revertir esa decisión** ("añade un apartado para
      poder escribir... notas, y dividir las dudas x temas"), así que
      ahora tiene 2 piezas nuevas:
      - **Agrupación por tema, no por fecha** (`agruparPorTema()` en
        `dudas-guardia.js`): el encabezado de grupo, que antes marcaba el
        mes (`.duda-mes`), se renombró a `.duda-grupo-label` y ahora
        agrupa por `tema` (orden alfabético; dentro de cada tema, la
        duda más reciente primero) — cada tarjeta sigue mostrando su
        propio `.duda-tag` (el tema) y una `.duda-fecha` nueva (mes/año,
        formateada a mano con un array de abreviaturas en español, sin
        librería de fechas) para no perder el contexto cronológico al
        dejar de ser el criterio de agrupación.
      - **Formulario real** (`#duda-form`, con `#btn-duda-nueva` como
        toggle que alterna `.active` y el texto del propio botón — mismo
        patrón `classList.toggle` ya usado por `core/accordion.js`, no
        JS nuevo de apertura/cierre): tema (texto libre con `<datalist>`
        autocompletado a partir de los temas ya usados, opcional —
        por defecto "General"), pregunta y respuesta (`<textarea
        required>`, validación nativa del navegador vía `<form>`/
        `required`, sin JS de validación propio salvo un `trim()` de
        respaldo por si se escriben solo espacios) y fuente (opcional).
        Al guardar, la duda nueva se añade a `localStorage`
        (`hud-dudas-guardia`, array de objetos `{id, tema, pregunta,
        respuesta, fuente, fecha, ejemplo:false}`) y la lista se
        re-renderiza entera — **nunca se edita el DOM de las 3 entradas
        de ejemplo**, que viven en su propio archivo de datos puro
        (`js/data/dudas-guardia-ejemplos.js`, `ejemplo:true`,
        construido con contenido YA real del Manual UMI — reposición de
        K⁺, cóctel de Marik, TEG de cirugía cardiaca — nunca inventado) y
        se fusionan con las del usuario solo en memoria, en cada
        `render()`. Solo las dudas propias del usuario (`ejemplo:false`)
        llevan un botón `.duda-eliminar-btn` dentro de su propia
        `.duda-respuesta` (con `e.stopPropagation()` para no disparar
        también el toggle nativo del `<details>` padre) — las 3 de
        ejemplo son fijas, nunca editables ni borrables desde la UI.
        `escapeHtml()` escapa pregunta/respuesta/fuente/tema antes de
        insertarlos vía `innerHTML` — a diferencia del resto de
        contenido de la app (siempre texto de confianza escrito a mano
        en los propios `.html`), aquí el texto viene directo del usuario
        a través de un `<textarea>`, así que sí hace falta escaparlo
        para que no se interprete como HTML.
      Sin preguntas de quiz propias — el propio formato pregunta→respuesta
      ya cumple esa función, añadir un quiz encima sería redundante
      (mismo criterio ya aplicado a
      `tratamiento-ira-irc.html`/`nefrotoxicidad.html`).
    - **Preguntas difíciles** (`preguntas-mc.html`, acento `--accent-red`,
      🎯): portada "modo examen" (`.mc-intro`/`.mc-stats`, con una pregunta
      de ejemplo estática debajo, fuera del motor de quiz) + un botón real
      que SÍ dispara el quiz de verdad
      (`#btn-mc-dificiles-repasar`). Banco nuevo,
      `js/data/preguntas-mc-dificiles.js`
      (`preguntasMcDificiles`/`temasMcDificiles`, 10 preguntas: 8 opción
      múltiple + 2 redactar, mismo formato `{id, tema, enunciado,
      opciones, correcta, explicacion}`/`{tipo:'redactar',
      respuestaModelo}` de siempre) — **sin PDF fuente propio para el
      banco en sí**, mismo criterio ya establecido en el proyecto para
      contenido sin fuente propia pero clínicamente estándar (ver APACHE
      II/Charlson), pero cada pregunta sí está anclada a cifras/algoritmos
      reales ya verificados releyendo primero el `tab-content` exacto de
      la ficha de origen del Manual UMI antes de escribirla (nunca de
      memoria) — lo que las distingue del resto del quiz no es la fuente,
      es que cada una integra datos de **más de una ficha a la vez** (p.
      ej. elegir la fórmula correcta de colapsabilidad de VCI según el
      contexto ventilatorio descrito, o decidir entre 3 opciones de
      manejo de sangrado post-CCV cruzando umbral de débito + TEG +
      corrección de hipotermia/hipocalcemia a la vez), nunca una pregunta
      de recall de un solo dato. 2 de las redactar cruzan además con
      Merino Cardiología (TRC vs. VVI por código NBG; elección de
      vasoactivo por perfil FATE/PVC). Se añade como un **bloque más**
      dentro de la misma asignatura "Sobrevivir a la UMI" en el selector
      de 3 niveles del quiz (`quizTemas`, `bloque: 'Preguntas MC
      difíciles'`), no un banco aparte — el banco combinado del quiz
      queda en 100 preguntas para esta especialidad (90+10).
      - **Arranque directo del quiz, sin pantalla de "elige asignatura"**
        — mejora genérica añadida a `quiz.js`, no un hack local: el botón
        `#btn-mc-dificiles-repasar` lleva
        `data-quiz-asignatura="Sobrevivir a la UMI"
        data-quiz-bloque="Preguntas MC difíciles"`, y el listener de cada
        trigger ahora comprueba esos 2 `data-*` antes de abrir la pantalla
        de 3 niveles — si están presentes, llama a `empezar(...)` ya
        filtrado al bloque exacto, igual que si el usuario hubiera
        navegado los 3 niveles a mano. Con degradación elegante total:
        cualquier trigger SIN esos `data-*` (los 20+ ya existentes en el
        resto de la app) sigue abriendo la pantalla de selección de
        siempre, sin ningún cambio de comportamiento — pensado para
        cualquier guía futura monotemática donde elegir asignatura sería
        un paso redundante, no solo para esta.
    - **Técnicas y conocimientos de un R1** (`tecnicas-r1.html`, acento
      `--accent-green`, 🔧): **cero contenido clínico propio**, solo un
      índice de navegación agrupado en 4 categorías por tipo de técnica
      (vía aérea, accesos vasculares/monitorización invasiva, soporte
      vital/PCR, ecografía a pie de cama) — decisión confirmada con el
      usuario (`AskUserQuestion`, opción recomendada) antes de construir
      nada: conectar lo que YA existe en vez de fabricar procedimientos
      nuevos sin fuente (Seldinger, tubo torácico, punción lumbar...
      quedan fuera, igual que el resto de la app nunca fabrica contenido
      clínico sin fuente real). 12 enlaces (`.tec-chip`) repartidos entre:
      - **`.umi-internal-link`** (clase nueva, 6 enlaces) hacia fichas del
        propio Manual UMI (SIR→`umi-rsi`, extubación→`umi-extubacion`,
        Swan-Ganz→`umi-hemodinamica`, marcapasos→`umi-marcapasos`,
        rAPTT→`umi-cirugia-cardiaca`, posparada→`umi-posparada`,
        FATE→`umi-fate`, BLUE→`umi-blue`) — **nunca `.tx-link`**, que es
        un mecanismo interno de Nefrología con riesgo real de colisión si
        se reutiliza fuera de ese módulo (mismo riesgo ya documentado y
        evitado varias veces en este archivo) — con su propio listener en
        `sobrevivir-umi/index.js` (`sobrevivirLevel.show('manualUmi')` +
        `openCorkboardTopic('panel-manual-umi-tabs', tab)`), mismo patrón
        exacto que `.neumo-internal-link`/`.paper-link` en otros módulos.
      - **`.especialidad-link`** (3 enlaces) hacia Merino Cardiología
        (ACLS completo →`mc-paro-soporte`, ETCO₂/ecografía durante RCP
        →`mc-paro-monitorizacion`) y UCI/Papers Tuiter (guía PUMA de
        extubación →`extub-algoritmo`, VExUS →`vexus-casos`) — resueltos
        por el listener global ya existente en `home/index.js`, sin
        wiring nuevo.
      - Una 5ª categoría, **"🧠 Neurocrítico (pendiente)"**
        (`.tec-pendiente`, acento atenuado a `--text-muted`), declarando
        explícitamente que ese contenido existe en la fuente pero no en
        ningún módulo todavía — en vez de omitir la categoría sin más o
        fingir que ya está cubierta.
  - CSS nuevo en `components.css` (`.duda-*`/`.mc-*`/`.tec-*`, bloque
    "SOBREVIVIR A LA UMI — 3 guías nuevas") — bump de cache-busting a
    `?v=20261006`. Verificado con Playwright (viewport 390×844): el
    submenú muestra los 4 `.const-node`; Manual UMI sigue abriendo sin
    regresión; las 3 entradas de ejemplo de Dudas de guardia expanden/
    colapsan correctamente con `<details>` nativo; el botón de Preguntas
    MC abre el quiz YA en la pregunta 1/10 (sin pasar por la pantalla de
    asignatura), y un recorrido completo de las 10 preguntas (8 opción
    múltiple + 2 redactar, mezcladas por el barajado aleatorio de
    siempre) termina en "Terminar" sin ninguna excepción JS; el menú de 3
    niveles normal del quiz (entrando por `#btn-manual-umi-repasar`, el
    trigger SIN los `data-quiz-*` nuevos) sigue mostrando la pantalla de
    selección de siempre, ahora con 2 bloques — "Manual UMI Negrín (90)" +
    "Preguntas MC difíciles (10)", total 100 —, confirmando que el cambio
    en `quiz.js` no rompe ningún trigger ya existente; en Técnicas R1, el
    enlace interno a `umi-rsi` navega con la ficha real `.active`, y el
    cross-link a Merino Cardiología dejó `cardiologia-view` con
    `offsetParent !== null` real (no solo la clase) y la ficha
    `mc-paro-soporte` activa; sin errores de consola ni de página en
    ningún punto del recorrido.
  - **Auditoría de qué añadir a Técnicas R1 y a Preguntas difíciles, y su
    implementación**, a petición explícita del usuario ("haz una
    auditoría del contenido a añadir en técnicas de umi y en preguntas
    difíciles — aquí sobre todo tienen que estar pensadas como si fuera
    el médico adjunto preguntando cosas de las diferentes partes de uci
    para que responda el residente de 1° año"). Verificado con `grep`
    contra todo `js/modules` (nunca de memoria) antes de proponer nada:
    - **5 cross-links reales que faltaban** en `tecnicas-r1.html`
      (contenido ya construido en otros módulos, nunca enlazado desde
      aquí): traqueostomía percutánea/quirúrgica y cricotiroidotomía de
      emergencia (Merino Neumología, `neumo-vias-artificiales`, Ficha
      XVI) y VMNI — CPAP/BiPAP/PSV, selección de pacientes
      (`neumo-vni-metodos`, Ficha XII), ambas añadidas a la categoría
      "Vía aérea"; tubo torácico/neumotórax a tensión/descompresión con
      aguja (`neumo-cuidado-barotrauma`, Ficha XVII) — ya cross-linkada
      desde Manual UMI pero no desde este índice, añadida también a "Vía
      aérea"; y cardioversión eléctrica sincronizada (TV/SVT) y no
      sincronizada (`mc-otras-taqui`, Ficha XVIII) + cardioversión de FA
      (`mc-fa-cardioversion`, Ficha XVII, ya linkada desde Manual UMI
      pero no desde aquí), ambas añadidas a "Soporte vital y parada
      cardiorrespiratoria". Las 5 usan `.especialidad-link` (nunca
      `.tx-link`, mismo riesgo de colisión ya documentado varias veces en
      este archivo), resueltas por el listener global ya existente en
      `home/index.js` — cero JS nuevo.
    - **Huecos de contenido genuinos, confirmados con `grep` (cero
      resultados o solo menciones de refilón) y dejados fuera de esta
      ronda** por no tener fuente propia: punción lumbar (ligado al
      bloque neurocrítico, ya marcado como pendiente en el propio
      Manual UMI), fibrobroncoscopia, suturas, canalización de línea
      arterial — ninguno se puede resolver con un cross-link, necesitan
      PNT/manual nuevo antes de escribir nada. Canalización venosa
      periférica/PICC/sonda vesical/sonda nasogástrica confirmado que
      siguen fuera **a propósito** (los 5 IT-4AI-E ya descartados
      explícitamente por el usuario en una tanda anterior), no un hueco
      nuevo que haya que llenar.
    - **12 preguntas nuevas en `preguntas-mc-dificiles.js`**
      (`umimc-q011`-`q022`, 8 opción múltiple + 4 de redactar — más peso
      relativo en redactar que las 10 originales, 4/12 ≈ 33% frente a
      2/10 = 20%; banco total: 16 opción múltiple + 6 redactar), cada una
      releyendo primero
      el `tab-content` real de su ficha de origen antes de escribirla,
      mismo criterio de siempre. A diferencia de las 10 primeras (casi
      todas ancladas solo a Manual UMI), estas cruzan deliberadamente a
      Merino Neumología (SDRA/ventilación protectora con el protocolo de
      reducción de volumen tidal por etapas; posición prono con la trampa
      de que el vasopresor por sí solo NO es contraindicación si el
      paciente está estable/mejorando), Nefrología (clasificador
      ácido-base con Δ-ratio para detectar una acidosis hiperclorémica
      iatrogénica por salino 0,9% superpuesta a una láctica; secuencia de
      tratamiento de hiperpotasemia grave sintomática; síndrome de
      realimentación), Trasplante de Hematología (antibioterapia empírica
      dirigida a un germen KPC ya colonizante, en vez de escalada/
      desescalada estándar; manejo simultáneo —no secuencial— de SLC
      grado 2 + ICANS grado 2 en CAR-T), Merino Cardiología (problema de
      poscarga del VI y "venteo" en VA-ECMO; por qué el patrón
      hemodinámico de shock cardiogénico y obstructivo es idéntico por
      Swan-Ganz y hace falta ecografía para distinguirlos; el umbral
      correcto de "riesgo definido" del CHA₂DS₂-VASc en varones —2
      puntos— frente al de mujeres —3—, la misma trampa que motivó el bug
      ya corregido de esa calculadora), Fisiopatología UCI (CAM-UCI/
      delirio con el cambio de sedación hacia dexmedetomidina + ventanas
      diarias) y UCI Papers Tuiter (ratio T/iCa de citrato interpretado
      junto a requerimientos de calcio/acidosis/lactato, nunca aislado).
      El banco de "Preguntas difíciles" queda en 22 preguntas y el banco
      combinado de toda la app en <strong>1841 preguntas</strong> (1829
      previas + 12). Actualizados los recuentos en `preguntas-mc.html`
      (22 / 15+7) y la etiqueta de `tecnicas-r1.html` en el
      `.constellation` de `sobrevivir-umi-menu.html` ("conecta 4
      especialidades", antes "6 módulos" — cifra que no se correspondía
      con los módulos realmente enlazados). Sin cambios de CSS ni de
      `quiz.js` — pura ampliación de datos + 5 botones nuevos reutilizando
      clases/listeners ya existentes.

  - **Huecos del manual cerrados (octubre 2026)**, a petición explícita
    del usuario («cierra después los huecos del manual umi»). Leídas como
    imagen las páginas del PDF (escaneado) y cotejadas con las fichas:
    - **Ficha II, `calcDeficitK`**: el manual da dos fórmulas que no casan
      (pág. 9: 50 mEq × kg × % de déficit, con el % del tramo de K⁺;
      pág. 10: «K real − K esperado (3,5) × peso + 1 mEq/kg + 30 mEq/l de
      diuresis», que escrita así sale negativa). La calculadora muestra
      las dos (con selector de pH &lt;7,2 para el tramo &gt;20%) y una nota
      de fidelidad plegable; con 70 kg y K⁺ 2,8, 525 frente a ~120 mEq.
    - **Ficha III, antropometría**: peso (Rabito: CMB, CAb, CP, sexo) y
      talla por media brazada, longitud del brazo y altura de la rodilla,
      con calculadora y botón que pasa peso, talla, sexo y edad a la
      calculadora de nutrición. Erratas de la fuente con nota: «6,525»
      por 63,525 (Rabito) y sumas por productos en la fórmula de la
      rodilla (Chumlea).
    - **Ficha VI, pirámide de cobertura**: SVG propio (metronidazol arriba,
      espectro amplio en el centro, clindamicina y piperacilina en los
      lados, Gram + / mixto / Gram − en la base) con selector que resalta
      la zona y la lee; sin inventar espectro por germen.
    - **Ficha VII**: pancuronio, neostigmina y fisostigmina en la tabla de
      relajantes, más las perfusiones de cisatracurio/rocuronio/
      succinilcolina y la dilución de la succinilcolina. Nota: el manual
      da las perfusiones en «mg/kg/min» o «cg/kg/min» (casi seguro µg), y
      pone la fisostigmina para revertir los no despolarizantes (su uso
      habitual es el síndrome anticolinérgico). La tabla completa de
      perfusiones continuas y extendidas (Sanford 2015: meropenem,
      pip-tazo, cefepime, ceftazidima, imipenem, vancomicina) sustituye al
      resumen de una línea; enlace a la calculadora PK/PD.
    - **Ficha IX, capnografía**: tabla aumento/disminución/ausencia de
      EtCO₂ (`#umi-etco2-tabla`) con selector que lista la columna. Nota:
      la tabla viene de un texto de anestesia veterinaria («animales de
      pequeño tamaño», figuras que no existen); se quitaron esas
      referencias. Enlaces a Marino Cap. 7 y a la EtCO₂ de la RCP.
    - **Ficha XIV, FATE extendido**: tabla de función sistólica (FE, FS,
      MSS, MAPSE, TAPSE por grados), valores Doppler de la tarjeta, y
      calculadora que gradúa cada medida (avisa del solapamiento de la MSS
      normal/leve y de que un TAPSE &gt;20 no es patológico pese al techo
      de la tarjeta).
    - **Ficha XXXI nueva, HFVVC** (`umi-hfvvc`): indicaciones con niveles
      de evidencia, las 4 variantes técnicas, la pauta genérica (35 ml/kg/h,
      60-75% prefiltro, bomba = reposición × 5/60), anticoagulación del
      circuito, las fórmulas tal cual y dos calculadoras: pauta + fracción
      de filtración (todo en ml/h; ver nota de fidelidad sobre unidades
      mezcladas y el signo del balance) y recirculación del Shaldon. Con la
      pauta del propio manual y Hto 30% la FF sale ~25%, por encima de su
      ideal de 15-20%; la ficha lo dice. **No se fragmentó en `trr.html`**:
      el manual vive entero en Sobrevivir a la UMI, con enlaces en las dos
      direcciones (TRR · Dosis → Ficha XXXI; Ficha XXXI → modalidad,
      anticoagulación y citrato) y notas de fuentes donde chocan
      (evidencia 1a de la mortalidad frente a Valdenebro; sin citrato).
      Entra en el bloque «Guardia y metabolismo» del índice rápido y en
      Técnicas R1. El cuaderno pasa a 31 fichas.
    - **Nuevo y genérico en `home/index.js`**: `data-en-visual` en un
      `[data-especialidad]` abre la ficha de destino en su vista Visual
      (usado para ir al filtro vivo de TRR).
    - 11 preguntas nuevas (`umi-q151`-`q161`): 5 de HFVVC y 1 por cada
      hueco. Manual UMI queda en 161.
    - Verificado con Playwright (390 px): las calculadoras dan lo esperado
      (K⁺ 2,8 → 525/119 mEq; 74 kg y 166 cm; MAPSE 7 → moderada; HFVVC
      25,1%/29,7%; recirculación 15%), la pirámide resalta la zona, los
      enlaces llegan en las dos direcciones (el de TRR, en Visual), sin
      desbordamiento ni errores.

