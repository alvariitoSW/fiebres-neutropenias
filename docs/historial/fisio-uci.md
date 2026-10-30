# Historial · Fisiopatología UCI (El Libro Azul): Hematología, Vías Urinarias, Cardiología, Inmunología

> Texto movido tal cual desde el antiguo `CLAUDE.md` (octubre 2026). Es la historia de cómo se construyó
> esta parte: decisiones, fuentes, auditorías y verificaciones. Las reglas vigentes están en `CLAUDE.md`.

### Fisiopatología UCI

Cuarta especialidad del menú raíz (`#btn-fisio-uci`, junto a Hematología,
Nefrología y UCI/Papers Tuiter), pensada para repasos esquematizados de
capítulos de **"El Libro Azul: Bases Fisiopatológicas de la Medicina
Crítica"** (a diferencia de UCI/Papers Tuiter, que resume papers sueltos
compartidos en redes, esta especialidad resume capítulos completos de un
libro de texto de fisiopatología). Mismo patrón de dos niveles que
UCI/Papers Tuiter: un **submenú de bloques**
(`#fisio-uci-menu-view`/`js/modules/fisio-uci/fisio-uci-menu.html`, con
`.btn-volver-especialidades`) del que cuelga un botón por bloque temático
del libro, y la **vista propia de cada bloque** con su propio cuaderno de
campo. El switcher `fisioUciLevel` vive en `js/modules/fisio-uci/index.js`
(`createViewSwitcher({ menu, hematologia })`), no en
`modules/home/index.js` — mismo motivo que Nefrología/UCI Papers Tuiter
tienen su propio switcher interno: la vista raíz `#fisio-uci-view`
(registrada en el `topLevel` de `home/index.js`) es solo el contenedor
exterior. Al volver a "Fisiopatología UCI" desde Especialidades,
`fisioUci.init()` devuelve `{ volverAlMenu }`, inyectado perezosamente en
`home/index.js` (`onFisioUciListo`, mismo patrón que
`onNefrologiaListo`/`onUciPapersListo`) para dejar siempre el submenú de
bloques como pantalla de entrada — igual que el resto de especialidades.
Añadir un bloque nuevo en el futuro: 1) botón nuevo en
`fisio-uci-menu.html`, 2) su propio `<vista>.html` con
`.btn-volver-fuci-menu`, 3) registrarlo en `index.html` dentro de
`#fisio-uci-view` y en el switcher `fisioUciLevel` de `fisio-uci/index.js`.

- **Primer bloque: "Hematología y Hemostasia en Cuidados Críticos"**
  (`js/modules/fisio-uci/hematologia.html`). Fuente: El libro azul. Bases
  fisiopatológicas de la medicina crítica. Sección II, Hematología y
  Hemostasia, capítulos 12-16 (86 páginas) — PDF completo subido a
  `docs/libro-azul-seccion-ii-hematologia-hemostasia.pdf`, mismo criterio
  que el resto de fuentes del proyecto (preferible a un enlace externo que
  pueda dejar de estar vivo). El usuario pidió inicialmente un sistema
  paralelo con formato JSON (`GUIA_DATA`) y convenciones ("UMI Hemato") de
  otro proyecto suyo — se le preguntó explícitamente por esa discrepancia
  antes de escribir nada, confirmó que era un error y pidió seguir la
  arquitectura real de este repo; **si en el futuro se piden convenciones
  que no existen en este `CLAUDE.md`, preguntar primero, nunca asumir que
  vienen de otro proyecto sin confirmarlo**.
  - **Cuaderno de campo de 5 fichas** (`#fuci-hemato-corkboard`/
    `#panel-fuci-hemato-tabs`, mismo `core/corkboard.js` de siempre, sin
    calculadoras propias — `hematologia.js` solo llama a
    `initCorkboard(...)`), una por capítulo: Fisiopatología de la anemia
    (metabolismo del hierro, hepcidina como regulador central, anemia de
    la enfermedad crónica como respuesta adaptativa), Fisiopatología de
    la trombocitopenia (estructura/función plaquetaria, CID como causa
    más frecuente en el crítico, tabla de indicaciones de transfusión de
    plaquetas, PTI/TIH/PTT, trombocitosis reactiva), ¿Cuándo transfundir?
    (los 9 tipos de hipoxia, fórmulas de DO₂/VO₂, curva de disociación de
    la Hb, deuda de oxígeno, transfusión en sepsis/trauma/cardiovascular
    con los ensayos TRICC/Rivers/TRISS/TRICS-III/CRASH-2/MATTERs
    detallados), Monitorización de la hemostasia — TEG/ROTEM (modelo de
    coagulación celular, limitaciones de TP/TTPa, parámetros y patrones
    completos de ambas técnicas, aplicaciones en hemorragia
    obstétrica/politrauma/sangrado masivo), y Eosinofilia en el paciente
    crítico (definiciones OMS 2016, síndrome de DRESS con sus 3 sistemas
    de criterios diagnósticos, enfoque diagnóstico en 2 pasos, tratamiento
    incluido imatinib/mepolizumab). Contenido íntegro sin resumir por
    debajo del detalle de la fuente, siguiendo el mismo criterio ya
    establecido en Nefrología (fisiología/electrolitos) — cifras exactas,
    fórmulas, nombres de ensayos clínicos y tablas completas.
  - **4 figuras reales** extraídas con `pdfimages -png` (PDF con figuras
    como imagen única embebida por página, mismo caso que los papers de
    Springer de UCI/Papers Tuiter — comprobado con `pdfimages -list` antes
    de extraer): las 4 figuras del capítulo de anemia
    (`js/modules/fisio-uci/img/fig1-hepcidina.jpg`,
    `fig2-ciclohierro.jpg`, `fig3-regulacionhepcidina.jpg`,
    `fig4-rolhepcidina.jpg` — ilustraciones biológicas genuinas del
    mecanismo hepcidina-ferroportina, extraídas componiendo la imagen base
    con su `smask` de transparencia vía Pillow). El resto de figuras del
    libro (curva de disociación de la Hb, diagramas de aporte/consumo de
    O₂, los 7 patrones de TEG, los diagramas ROTEM, el flujograma
    diagnóstico de hipereosinofilia) son gráficos **vectoriales** nativos
    del PDF, no imágenes incrustadas (confirmado con `pdfimages -list`:
    sin entradas de imagen grande en esas páginas) — no se rasterizaron ni
    recortaron (el método de rasterizar+recortar queda reservado para
    figuras compuestas por InDesign con muchos fragmentos pequeños, no
    para vectores simples). En su lugar: los 7 patrones de TEG y los
    parámetros/patrones de ROTEM se recrearon íntegramente como
    `.data-table`/`.kv-row` con los valores numéricos reales citados en el
    capítulo (más fieles para el detalle clínico que una figura pequeña
    con letras diminutas); la curva de disociación de la Hb y los
    diagramas de aporte/consumo de O₂ y el flujograma de hipereosinofilia
    llevan un **placeholder de texto explícito** (recuadro punteado con
    descripción de qué figura debería ir ahí) para que el usuario los
    añada más adelante si quiere la imagen real — mismo criterio ya usado
    en el proyecto de no fabricar ni forzar una recreación SVG de un
    diagrama que no se pudo verificar pixel a pixel contra el original.
  - **40 preguntas de quiz** (`js/data/fisio-uci-hematologia-preguntas.js`,
    `fuci-q001`-`q040`, 8 por ficha × 5 fichas — 6 de opción múltiple + 2
    de tipo `redactar` por ficha, sin romper la regla dura de ≥1 pregunta
    por tema). Las preguntas de redactar incluyen tanto conceptos de
    desarrollo corto como **casos clínicos** (viñeta breve + pregunta de
    manejo/diagnóstico), reutilizando el mismo tipo `redactar` del motor
    de quiz ya existente (ver el apartado de UCI/Papers Tuiter más arriba)
    — no hizo falta ningún cambio en `quiz.js`/`quiz.html`. `triggerId:
    'btn-fuci-hemato-repasar'`, exportado junto a `quizBanco`/`quizTemas`
    desde `fisio-uci/index.js` y fusionado en la única llamada a
    `initQuiz()` de `main.js`, igual que el resto de especialidades. El
    banco combinado de toda la app queda en **878 preguntas** (838 previas
    + 40 de este bloque).
  - **Énfasis de términos clave**: se reutilizó el mismo sistema ya
    establecido (`<strong>`, coloreado automáticamente vía `--item-color`
    dentro de `.micro-prof-item`, y la clase `.hl` para frases/cifras
    clave dentro de un párrafo) en vez de introducir `<u>` u otra
    convención nueva — comprobado explícitamente contra `components.css`
    antes de escribir contenido, tal como pidió el usuario.
  - **Bibliografía**: 5 entradas, una por capítulo, cada una enlazando a
    `docs/libro-azul-seccion-ii-hematologia-hemostasia.pdf#page=N` (N
    calculado como página_impresa − 168, verificado contra el propio
    índice de páginas del PDF — el desplazamiento sale de que la portada y
    una página en blanco preceden a la página impresa 171, que es la
    página 3 del PDF).
  - **Auditoría de contenido contra las 86 páginas del PDF fuente, a
    petición explícita del usuario** ("repasa la información que ya hay de
    hematología... revisa la información que no esté en la app y sí en la
    bibliografía... que contenga el contenido íntegro de la bibliografía
    que te he mandado"). Se releyó el PDF completo en 6 tramos con el
    `Read` tool (no de memoria) y se comparó frase a frase contra las 5
    fichas ya escritas, siguiendo el mismo método de auditoría ya
    establecido en el resto del proyecto (Nefrología/HTA/ERC/FRA/
    Cardiología): buscar tanto huecos de contenido como errores reales de
    transcripción.
    - **Hallazgo más importante: 2 errores reales de transcripción en la
      tabla de patrones ROTEM de la Ficha 4** (`fuci-teg`), detectables
      solo comparando cifra a cifra contra las Figuras 4-8 del capítulo,
      no releyendo la prosa. (1) El patrón "Normal" tenía el FIBTEM MCF
      escrito como "9mm" — en realidad 9mm es el <strong>CFR</strong>
      (tiempo de formación del coágulo) de esa misma figura, no su MCF; el
      MCF real es 57mm. (2) El patrón "Hipofibrinogenemia" afirmaba que
      "EXTEM/INTEM tenían MCF también reducidos (57mm/42mm)" — pero 57mm
      es literalmente idéntico al EXTEM MCF del patrón Normal (o sea, NO
      está reducido); solo el INTEM (42 vs. 61mm normal) muestra una
      reducción leve, y el defecto real se localiza casi en exclusiva en
      el FIBTEM (MCF 3mm). Corregida la tabla completa con los valores
      reales de las 5 figuras (Normal/Plaquetopenia/Hipofibrinogenemia/
      Hiperfibrinólisis/Efecto de la heparina), añadido el valor APTEM
      ML=0% que faltaba en Hiperfibrinólisis (dato diagnóstico clave: la
      corrección <em>in vitro</em> de la lisis confirma hiperfibrinólisis
      verdadera y no un artefacto), una nota explícita de "Corrección de
      fidelidad" documentando ambos errores, y un
      `.micro-prof-item` nuevo explicando la lógica diagnóstica de cada
      patrón. **Erratum real de la propia fuente, no corregido
      silenciosamente**: los valores INTEM de la Figura 8 (Efecto de la
      heparina) son idénticos a los de la Figura 7 (Hiperfibrinólisis) —
      casi con certeza una duplicación de tabla en el PDF original, no un
      hallazgo real de "la heparina causa 100% de lisis". Reproducido tal
      cual lo publica la fuente, con una nota de fidelidad explícita en
      vez de inventar un valor "corregido" — mismo criterio ya establecido
      en el proyecto para el IFR de Fracaso Renal Agudo.
    - **Contenido añadido, verificado contra el texto exacto de cada
      capítulo**: en la Ficha 1 (Anemia), el mecanismo de oxidación
      acoplado a la exportación de hierro por ferroportina (hemooxidasas/
      hefaestina y ceruloplasmina, paso obligado para que el hierro pueda
      unirse a la transferrina) y una nota sobre Zarychanski et al. y el
      hallazgo contraintuitivo de que tratar la anemia leve-moderada de
      la enfermedad crónica se asocia a mayor mortalidad. En la Ficha 2
      (Trombocitopenia), las 3 funciones del sistema canalicular abierto
      (transporte de entrada de fibrinógeno a los gránulos α, transporte
      de salida del contenido granular, y reserva de membrana para el
      cambio de forma plaquetaria) y el detalle de que la membrana
      plaquetaria expone factor tisular inactivo y fosfatidilserina como
      plataforma para los factores Va/VIIa/Xa. En la Ficha 3
      (Transfusión), una tabla nueva "Metas de la reanimación en sepsis"
      (objetivos reales a las 3h/6h de la campaña Sobreviviendo a la
      Sepsis 2012, ausente hasta ahora pese a que el texto ya comentaba
      su evolución desde el protocolo de Rivers), el mecanismo de la
      hipoxia hipermetabólica del paciente crítico, detalle metodológico
      de la agregometría de 4 agonistas en la disfunción plaquetaria del
      politraumatizado, la proporción real MATTERS (1:1:0,87), la cifra
      real de transfusiones innecesarias (36,1%, Mitra et al.), y un
      matiz sobre el metaanálisis de 6 ECA en cirugía cardiovascular (sin
      significación estadística a favor de la estrategia liberal, sin
      parámetros de perfusión clínicos/bioquímicos en los perfiles de
      decisión de los estudios). En la Ficha 4 (TEG/ROTEM), la cifra
      epidemiológica de apertura (21 millones de hemoderivados/año en
      EE.UU., 50% administrados por anestesiólogos) y los 4 procesos que
      documenta la TEG en un único trazado (formación de fibrina,
      retracción del coágulo, agregación plaquetaria, lisis del coágulo).
      En la Ficha 5 (Eosinofilia), una **Tabla 6 nueva** "Mecanismos de
      lesión de órganos" (infiltración tisular / fibrosis vía TGF-β /
      hipercoagulabilidad por activación del factor tisular e inhibición
      de la trombomodulina), completamente ausente hasta ahora, y el
      **placeholder de la Figura 1** (flujograma diagnóstico) sustituido
      por su contenido real recreado como secuencia `kv-row` de 6 pasos
      (Paso 1: etiología → laboratorio dirigido → estudios complementarios
      → imágenes; Paso 2: morfología/biopsia de médula ósea → confirmación
      molecular FIP1L1-PDGFRα) — mismo patrón ya usado en otros módulos
      del proyecto (p. ej. el proceso diagnóstico de 7 pasos de HTA
      resistente) para flujogramas cuyo contenido completo ya se conoce
      con certeza a partir de la fuente, en vez de dejarlos como
      placeholder de imagen.
    - Verificado con Playwright: las 5 fichas abren/voltean sin error de
      consola ni 404 real (el único 404 es el `favicon.ico`, ya
      documentado como inocuo); el nuevo contenido se detectó
      correctamente en el DOM tras abrir cada acordeón correspondiente
      (`.micro-prof-item`/`Paciente séptico` para la tabla de sepsis,
      `Mecanismo de absorción` para la ferroportina); la tabla ROTEM
      corregida renderiza sus 5 filas con los valores nuevos.
  - **Informe de auditoría (fallos/huecos/interactividad/mejoras) y las
    4 rondas de correcciones aplicadas, en ese orden explícito pedido por
    el usuario**: a petición de "mándame un informe... donde se vea todos
    los fallos, las fallas de información, las partes que se podrían poner
    algo interactivo y las partes que se podrían mejorar", se auditaron
    las 5 fichas ya existentes y se publicó un informe estructurado como
    Artifact (severidad por color: fallo/hueco/interactividad/mejora,
    tarjetas con ubicación exacta en el archivo). El usuario pidió después
    corregir **todo** lo señalado, en el mismo orden — fallos primero,
    luego huecos, luego oportunidades, luego mejoras menores.
    - **Fallos reales corregidos**: (1) 2 bloques de DO₂/VO₂ en la Ficha 3
      usaban `<div class="kv-row">` en vez de `<dl class="kv-row">`
      (HTML inválido, sin efecto visual porque el CSS es por clase — pero
      inconsistente con las +150 instancias de `kv-row` del resto de la
      app) — corregidos a `<dl>`. (2) Los 3 grados de eosinofilia de la
      Ficha 5 ("leve &gt;1500/mm³ · moderada 1500-5000/mm³ · grave
      &gt;5000/mm³") se solapan literalmente en el corte de 1500 —
      **verificado directamente contra la página 240 del PDF**: es una
      ambigüedad real de la propia fuente (OMS 2016), no un error de
      transcripción — se añadió una nota de fidelidad explícita en vez de
      "corregir" los rangos por criterio propio. (3) Solo la Tabla 6
      añadida en la ronda anterior llevaba numeración real de fuente,
      mientras las otras 5 tablas de la misma ficha no — **releídas las
      páginas 74-79 del PDF** para confirmar los números reales (Tabla 1
      Definiciones, Tabla 2 Proteínas del eosinófilo, Tabla 3 Fármacos,
      Tabla 4 Criterios DRESS, Tabla 5 Enfermedades sistémicas, Tabla 7
      Signos y síntomas) y añadirlos a las 6 tablas restantes. Hallazgo
      colateral en esa misma relectura: la "Tabla 6" del capítulo está
      impresa con el título "Infecciones relacionadas con la eosinofilia"
      pero su contenido real (mecanismo/descripción: infiltración
      tisular/fibrosis/hipercoagulabilidad) no tiene ninguna relación con
      agentes infecciosos ni con el párrafo que la precede — con alta
      probabilidad, una tabla equivocada bajo ese título en el propio
      libro. Se mantuvo el contenido real (ya correcto desde la ronda
      anterior) con un título descriptivo en vez del título impreso
      (que induciría a error) y una nota de fidelidad explicando la
      discrepancia, mismo criterio que el resto de erratas de fuente ya
      documentadas en el proyecto.
    - **Huecos de información, verificados contra el PDF antes de decidir
      si añadir o no**: el capítulo 13 (Trombocitopenia) **no menciona el
      4T score de TIH** (herramienta de probabilidad pre-test muy citada
      fuera de esta fuente) — verificado releyendo el capítulo completo
      (págs. 188-194); el capítulo 15 (TEG/ROTEM) **no da un punto de
      corte numérico** para el FIBTEM A5 como predictor de hemorragia
      obstétrica, solo lo cita como "el biomarcador más importante
      disponible" — verificado en la pág. 235. En ambos casos, siguiendo
      la disciplina ya establecida del proyecto de nunca fabricar
      contenido clínico sin respaldo directo en la fuente, no se añadió
      ninguna cifra ni herramienta — se dejó una nota transparente
      explicando que se verificó y no está en el capítulo, en vez de
      dejarlo simplemente sin mencionar.
    - **13 piezas interactivas nuevas** — el bloque no tenía ninguna
      calculadora/simulador propio hasta ahora (a diferencia de
      Cardiología o Nefrología), la brecha más señalada por el informe:
      - Ficha 1: simulador del secuestro de hierro por hepcidina (slider
        de "nivel de inflamación" que mueve en vivo 3 barras — hepcidina,
        ferroportina activa, hierro sérico —, mismo patrón
        `.tfg-simulador` que el resto de la app).
      - Ficha 2: selector "umbral de transfusión de plaquetas por
        escenario" (patrón `wireSelectExplicacion`, 7 escenarios ya
        citados) y un SVG animado del ciclo reverberante de la TIH
        (heparina-FP4 → anticuerpo IgG → activación plaquetaria →
        liberación de más FP4), con una nueva clase CSS genérica
        `.flow-arrow` (dashes que fluyen a lo largo de un `<path>`,
        respeta `prefers-reduced-motion`) reutilizable en cualquier
        diagrama de ciclo futuro de la app.
      - Ficha 3, la más beneficiada (4 piezas): **calculadora de Fick**
        (DO₂/VO₂/EO₂ con gauge visual y marcadores en el punto crítico
        900-1000 mL/min — mismas fórmulas que ya citaba el texto, con el
        coeficiente 1,39 propio de esta ficha, distinto del 1,34 que usa
        Cardiología para su propia cita bibliográfica, mismo criterio de
        fidelidad-a-la-fuente-citada-en-cada-ficha ya visto con el DO₂I de
        Cardiología); **curva de disociación de la Hb interactiva**
        (ecuación de Hill n=2,7, p50=22,5mmHg la única cifra real de la
        fuente, sustituyendo el placeholder de imagen) con 3 estados
        (normal/derecha/izquierda); **diagrama de deuda de oxígeno** con
        slider de DO₂ y un marcador que recorre una curva ascendente hasta
        el punto crítico (≈950 mL/min) y luego se aplana — sustituye el
        2º placeholder; y un **selector-resumen de umbral de transfusión
        por escenario clínico** (séptico/trauma/cardiovascular/SCA/EPOC).
      - Ficha 4: **visualizador del trazado TEG por patrón** (A-G, un
        huso SVG parametrizado — inicio/pico/amplitud/cola — que cambia
        de forma según el patrón elegido, incluida la "hoja" característica
        de la fibrinólisis) y un selector **"¿qué patrón tengo delante?"**
        con los 5 patrones ROTEM ya tabulados, que revela la lógica
        diagnóstica al elegir. Se descartaron 2 candidatos del informe por
        falta de respaldo en la fuente: el "índice de coagulación" (el
        capítulo no da la ecuación lineal exacta) y una versión del 4T
        score para TIH (ver huecos, arriba).
      - Ficha 5 (3 piezas): **checklist interactivo de criterios DRESS**
        con recuento en vivo y veredicto automático para los 3 sistemas
        (Bocquet: 3/3 necesarios; RegiSCAR: 2 necesarios + ≥3 de 4
        adicionales; J-SCAR: 7=clásico/primeros 5=atípico) — granularidad
        más precisa que la tabla comparativa ya existente, verificada
        contra el texto exacto de la Tabla 4 del capítulo (pág. 244);
        **calculadora de clasificación de gravedad** (maneja
        explícitamente la ambigüedad de rangos ya señalada como fallo); y
        el **flujograma diagnóstico como diagrama SVG real** (cajas +
        flechas, con un único punto de "¿causa secundaria identificada?"
        — sin inventar rombos de decisión que la fuente no describe),
        sustituyendo la secuencia de texto `kv-row` de la ronda anterior
        (que se mantiene debajo, íntegra, como referencia accesible).
    - **Mejoras menores aplicadas**: el kv-row de "Mecanismos que
      contribuyen" (Ficha 1) pasó a `term-chips`; la cohorte francesa de
      trombocitosis reactiva (Ficha 2) pasó de un párrafo denso a una
      mini-tabla de 6 filas; la mención en texto plano "Ver Ficha 4 para
      el detalle..." (Ficha 2) pasó a un botón `.tx-link` real que salta
      con `openCorkboardTopic()` (mismo panel, sin necesidad de
      `data-atlas-route`); nueva tabla de **equivalencias de nomenclatura
      TEG↔ROTEM** (Ficha 4, r↔CT, k↔CFT, MA↔MCF, LY30↔ML) para quien solo
      conoce uno de los dos sistemas. Los 2 candidatos restantes del
      informe (tabla-resumen de umbrales al principio de la Ficha 3,
      legibilidad de la tabla DRESS en la Ficha 5) se consideraron ya
      resueltos por las piezas interactivas nuevas de esas mismas fichas,
      sin necesidad de una segunda estructura redundante.
    - **Enlaces cruzados nuevos hacia Síndromes Urgentes** (observación
      transversal del informe): la Ficha 2 mencionaba PTT y CID a nivel de
      fisiopatología general sin enlazar a las fichas completas que la app
      ya tiene en Síndromes Urgentes (French score, PLASMIC score,
      calculadoras Overt DIC/SIC) — añadidos 2 botones `.tx-link` con
      `data-atlas-route="sindromes-ptt"`/`"sindromes-cid"`, reutilizando
      el listener genérico ya registrado en `home/index.js` sobre
      `[data-atlas-route]` (mismo patrón que ya usa Reconocimiento para
      enlazar a CAR-T) — sin tocar `home/index.js`, porque las rutas
      `sindromes-ptt`/`sindromes-cid` ya existían en `rutasAtlas`.
    - Verificado con Playwright: las 5 fichas abren sin timeout ni error
      de consola real; las 13 piezas interactivas responden correctamente
      a la entrada (capturas de pantalla revisadas una a una — curva de
      Hb con forma sigmoidea correcta, diagrama de deuda de O₂ con la
      dirección fisiológica correcta tras corregir un bug propio donde la
      relación estaba invertida en el primer intento, huso de fibrinólisis
      con la "hoja" característica, flujograma y checklist DRESS legibles
      sin overlaps); los 2 cross-links a Síndromes Urgentes (PTT y CID) y
      el cross-link interno a la Ficha 4 navegan correctamente. Bump de
      cache-busting (`?v=20260825`) por el cambio en `components.css`
      (`.flow-arrow`).
- **Segundo bloque: "Vías Urinarias"** (`js/modules/fisio-uci/vias-urinarias.html`).
  Fuente: El libro azul. Bases fisiopatológicas de la medicina crítica.
  Sección VII, Vías Urinarias, capítulos 46-48 (42 páginas) — PDF completo
  subido a `docs/libro-azul-seccion-vii-vias-urinarias.pdf`, mismo criterio
  que el resto de fuentes del proyecto. Segundo botón del submenú de
  bloques (`#btn-fuci-vias-urinarias`), con `fisioUciLevel` (en
  `fisio-uci/index.js`) ganando una segunda entrada (`viasUrinarias`) junto
  a `hematologia` — mismo patrón exacto ya validado con el usuario para el
  primer bloque, sin cambios de arquitectura.
  - **Cuaderno de campo de 3 fichas** (`#vu-corkboard`/`#panel-vu-tabs`,
    mismo `core/corkboard.js` de siempre, sin calculadoras propias —
    `vias-urinarias.js` solo llama a `initCorkboard(...)`), una por
    capítulo — a diferencia del bloque de Hematología (5 fichas para 5
    capítulos cortos), aquí la fuente tiene solo 3 capítulos, así que la
    correspondencia 1:1 capítulo↔ficha se mantiene igual: **Fisiopatología
    renal** (Cap. 46 — clasificación prerrenal/renal/posrenal, balance
    energético e hipoxia como noxa principal de la LRA, distribución del
    flujo cortical 90%/medular 10%, ecuación de Starling aplicada al
    glomérulo, autorregulación 60-150 mmHg PAM vía 3 sistemas —miogénico,
    simpático extrínseco, hormonal—, la médula externa/asa gruesa
    ascendente de Henle como zona más vulnerable a la isquemia por su
    hipoxia relativa fisiológica, condiciones predisponentes, índices
    urinarios clásicos prerrenal vs. renal, y el enfoque terapéutico
    inicial con furosemida en infusión superior a bolos), **Fisiopatología
    de la LRA** (Cap. 47 — los 3 criterios diagnósticos de consenso,
    evolución RIFLE 2004→AKIN 2007, epidemiología con los estudios de
    Hoste/Uchino/el metaanálisis de Coca —con la cifra real de que un
    aumento de solo 10-20% de creatinina ya duplica la mortalidad—,
    limitaciones de la creatinina como marcador subrogado, la
    clasificación etiológica completa prerrenal/posrenal/intrínseca con
    sus causas y mecanismos, y el tratamiento por etiología incluida la
    evidencia real —y contraintuitiva— de que los diuréticos de asa en la
    LRA establecida se asocian a mayor mortalidad sin beneficio funcional
    pese a su racional fisiológico), y **Monitorización de la función
    renal en el paciente crítico** (Cap. 48 — la ficha más extensa de las
    3, con las 8 tablas reales del capítulo recreadas como `.data-table`
    nativas: condiciones que reducen el FG, factores condicionantes de
    creatinina/urea, biomarcadores nuevos con sus tiempos de detección,
    mediciones derivadas prerrenal vs. daño renal intrínseco, las
    principales ecuaciones de estimación de la TFG —con la advertencia
    explícita de KDIGO 2012 de que MDRD/CKD-EPI/Cockcroft-Gault no deben
    usarse en críticos—, factores de riesgo de LRA, y la clasificación
    KDIGO de estadios—, más los 4 escenarios especiales de LRA —contraste,
    cirrosis, rabdomiólisis, hipertensión abdominal— como acordeón
    `micro-prof-item`).
  - **7 figuras reales** extraídas de las páginas 21-45 del PDF —a
    diferencia del bloque de Hematología, donde solo el capítulo de anemia
    tenía imágenes incrustadas, aquí las figuras están concentradas en el
    Cap. 48 (Monitorización)—: `vu-fig1-creatinina.jpg` (producción y
    depuración de creatinina, imagen con `smask` de transparencia,
    compuesta con Pillow igual que las 4 figuras de hepcidina del primer
    bloque), `vu-fig6-hidronefrosis.jpg` (ecografía real de hidronefrosis,
    también con `smask`), y las **5 miniaturas de microscopía del
    sedimento urinario** de la Figura 5 original (`vu-fig5-celulas-tubulares.jpg`,
    `vu-fig5-cilindros-eritrocitarios.jpg`, `-leucocitarios.jpg`,
    `-hialinos.jpg`, `-granulosos.jpg`) — detectadas con `pdfimages -list`
    como 5 imágenes pequeñas independientes (266×152 aprox.) en la misma
    página, en vez de una única figura compuesta, así que se extrajeron y
    maquetaron como 5 `.article-figure` individuales en vez de una sola
    imagen de mosaico. El resto de figuras del libro (curvas/gráficos de
    depuración de creatinina, el flujograma de clasificación de la LRA,
    el flujograma de evolución de biomarcadores) son gráficos
    **vectoriales** nativos del PDF —confirmado con `pdfimages -list`,
    sin imágenes grandes en esas páginas— y se recrearon como
    `.data-table`/prosa con los valores reales, sin placeholder de
    imagen porque el contenido numérico ya queda cubierto por las tablas
    nativas (a diferencia del bloque de Hematología, donde 3 figuras sí
    se dejaron como placeholder explícito por no tener un equivalente
    tabular razonable).
  - **24 preguntas de quiz** (`js/data/fisio-uci-vias-urinarias-preguntas.js`,
    `vu-q001`-`q024`, 8 por ficha × 3 fichas — 6 de opción múltiple + 2 de
    tipo `redactar` por ficha, mismo formato exacto que el primer bloque,
    con casos clínicos en varias de las preguntas de redactar). `triggerId:
    'btn-fuci-vu-repasar'`, añadido al array que ya exporta
    `fisio-uci/index.js` junto a `btn-fuci-hemato-repasar` — sin tocar
    `main.js` (que ya fusiona `fisioUci.quizTriggerId/quizBanco/quizTemas`
    genéricamente). El banco combinado de toda la app queda en **902
    preguntas** (878 previas + 24 de este bloque).
  - **Bibliografía**: 3 entradas, una por capítulo, enlazando a
    `docs/libro-azul-seccion-vii-vias-urinarias.pdf#page=N` (N = página
    impresa − 814, verificado contra 4 puntos de anclaje distintos del
    propio PDF — portada + una página en blanco preceden a la página
    impresa 817, que es la página 3 del PDF; mismo patrón de offset que el
    primer bloque, pero con un desplazamiento propio de este PDF).
  - **Enlace cruzado**: la Ficha 1 (Fisiopatología renal) menciona
    explícitamente, en el punto donde el capítulo remite al manejo con
    TRR, que el desarrollo completo de indicaciones/momento de
    inicio/modalidad de la TRR vive en el módulo TRR de Nefrología (dentro
    del mapa del riñón) — sin duplicar ese contenido aquí, mismo criterio
    de no repetir texto ya construido en otro módulo con fuente propia
    distinta (ver el precedente ya establecido entre TRR y FRA en
    Nefrología).
  - **Auditoría de contenido contra las 46 páginas del PDF fuente, a
    petición explícita del usuario** ("revisión de la bibliografía y del
    contenido... al igual que hemos hecho con cardio y con hematología").
    Se releyó el PDF completo en 6 tramos con el `Read` tool y se comparó
    frase a frase contra las 3 fichas ya escritas, mismo método ya
    establecido en el resto del proyecto. A diferencia de Hematología, no
    se encontró ningún error de transcripción — todas las cifras, tablas y
    umbrales ya presentes (Tabla 1/2/3/4/5/7/8, FE<sub>Na</sub>/FE Urea,
    escenarios especiales de contraste/cirrosis/rabdomiólisis/hipertensión
    abdominal) se verificaron exactos contra el PDF. El hallazgo principal
    fueron **huecos de contenido genuinos**, verificados uno a uno antes de
    incorporarlos:
    - **Ficha 3 ganó una Tabla 6 completamente reescrita**: la versión
      anterior solo describía en prosa qué variables usa cada ecuación
      (Cockcroft-Gault, MDRD, CKD-EPI, Jelliffe); el capítulo en realidad
      da las **fórmulas matemáticas completas**, incluida la ecuación
      CKD-EPI desglosada por raza/sexo/umbral de creatinina (8
      combinaciones) y las 2 versiones de Jelliffe con su fórmula exacta
      — antes solo se mencionaba como concepto ("ajusta la creatinina por
      el balance de fluidos") sin dar la ecuación. Se verificó la
      coherencia de los coeficientes CKD-EPI contra el conocimiento
      estándar de la fórmula (2009) antes de darlos por buenos. Marcada
      explícitamente como tabla de referencia, no como calculadora — no se
      construyó ningún widget interactivo con estas fórmulas.
    - **Ficha 3 ganó una Tabla nueva (Figura 3 del capítulo)**:
      "Evolución de la LRA y biomarcadores por etapa" — el continuo
      función renal normal → riesgo aumentado de lesión renal → daño
      renal → reducción de la TFG → insuficiencia renal → muerte, con las
      4 categorías de biomarcadores (tempranos/diagnósticos/diagnósticos
      de TFG/pronósticos) mapeadas a la etapa en la que son más útiles —
      contenido completamente ausente hasta ahora, recreado como tabla
      nativa en vez de placeholder (la figura original es un diagrama de
      cajas con flechas, vectorial, sin imagen rasterizada que extraer).
    - **Ficha 2 ganó la cascada celular del daño isquémico** (radicales
      libres/citocinas → activación endotelial → adhesión de leucocitos →
      apoptosis, autoperpetuante incluso tras restituir el flujo; daño
      tubular → fuga del filtrado + desprendimiento celular → obstrucción
      tubular) y la perla de que la isquemia renal puede empezar **antes**
      de que la hipotensión sistémica sea detectable.
    - **Ficha 2 ganó 2 premisas de AKIN y una regla de clasificación**
      que faltaban: los criterios diagnósticos solo aplican tras
      optimizar la volemia; si la oliguria es el único criterio, hay que
      descartar antes una uropatía obstructiva; y todo paciente en TRR se
      clasifica automáticamente como Estadio 3, con independencia de su
      creatinina. Además, el origen de RIFLE (conferencia ADQI, Vicenza
      2002), la regla del "peor criterio" y la ventana de evaluación de 7
      días, y una revisión sistemática de 13 estudios/&gt;71.000
      pacientes (mortalidad 6,95% sin LRA vs. 31,2% con LRA) — datos
      epidemiológicos distintos de los ya citados (Hoste/Uchino/Coca).
    - **Ficha 2 ganó las manifestaciones clínicas de la LRA** (edema
      pulmonar, acidosis, hiperpotasemia, uremia) en su propia definición,
      el dato de que hasta el 13% de los supervivientes del estudio de
      Uchino requirió TRR, un matiz metodológico sobre los diuréticos de
      asa (un segundo estudio no encontró exceso de mortalidad, aunque
      tampoco beneficio funcional — con la salvedad de que el estudio
      observacional original no se diseñó para demostrar causalidad), y
      una ampliación de "Terapias en investigación" con eritropoyetina,
      péptidos natriuréticos, dispositivos de asistencia túbulo-renal y
      hemofiltración/hemodiafiltración de alto flujo — antes solo se
      mencionaban células madre, bicarbonato y biomarcadores.
    - **Ficha 1 ganó la 2ª meta hemodinámica** (15 mmHg de presión de
      llenado con mayor aporte de precarga, antes de recurrir a
      vasopresores) que faltaba junto al objetivo ya citado de 12 mmHg.
    - Verificado con Playwright: las 3 fichas abren sin error de consola
      ni 404 real; el nuevo contenido se detectó correctamente en el DOM
      tras abrir cada acordeón/ficha correspondiente; la Figura 3 (tabla
      de 4 columnas) se envolvió en `overflow-x:auto` tras detectar que
      desbordaba el ancho de pantalla en móvil sin ese contenedor —
      confirmado que ya no hay overflow horizontal a nivel de página
      (`document.body.scrollWidth === clientWidth`); la Tabla 6 (24 filas,
      2 columnas) no necesitó envoltorio por ser suficientemente estrecha.
  - **Informe de fallos/huecos/interactividad/mejoras (distinto de la
    auditoría de contenido anterior) y sus correcciones aplicadas**, a
    petición explícita del usuario. Publicado como Artifact (mismo formato
    que los informes de Cardiología/Hematología: severidad por color,
    tablero de métricas por ficha) y luego corregido en su totalidad:
    - **Fallo real, verificado con `pdftotext` contra el PDF de nuevo**: la
      fórmula MDRD (2) de la Tabla 6 no lleva exponente sobre la
      creatinina — el propio texto extraído del PDF fuente reproduce
      literalmente el mismo hueco ("TFG = 186 x [Crs] x [edad] -0,203...",
      sin exponente visible sobre Cr<sub>s</sub>), casi con certeza un
      exponente perdido al maquetar el libro (el valor real ampliamente
      publicado es Cr<sub>s</sub><sup>−1,154</sup>). Se añadió una nota de
      fidelidad explícita bajo la Tabla 6, sin insertar el exponente sin
      verificar en esta fuente concreta — mismo criterio que el resto de
      erratas de fuente ya documentadas en el proyecto.
    - **2 huecos estructurales corregidos**: la Ficha 2 (LRA) era la única
      de las 3 sin ninguna tabla pese a tener contenido tabulable — se
      añadió una tabla-resumen "RIFLE → AKIN → KDIGO" (sistema/año-origen/
      aportación principal) junto a la `kv-row` que ya lo explicaba en
      prosa; y se añadieron notas cruzadas entre "Condiciones
      predisponentes" (Ficha 1) y la "Tabla 7. Factores de riesgo" (Ficha
      3), dos listas con solapamiento parcial que antes no se remitían
      entre sí.
    - **Descubrimiento clave durante la implementación de la
      interactividad**: varias de las piezas propuestas en el informe
      (simulador de autorregulación PAM, clasificador de estadio KDIGO,
      calculadora de FE<sub>Na</sub>) resultaron ser **casi duplicados** de
      calculadoras que el módulo FRA de Nefrología ya tiene
      (`calcTfgSimulador()`, `calcEstadioKdigo()`, `calcFenaIfr()`) — con
      cortes/rangos ligeramente distintos porque vienen de fuentes
      distintas (Nefrología al día vs. El Libro Azul). En vez de construir
      calculadoras nuevas casi idénticas, se optó por **notas cruzadas de
      texto plano** apuntando al módulo/ficha exacta de Nefrología donde ya
      existen (mismo patrón ya usado en la Ficha 1 para la referencia a
      TRR), documentando explícitamente la diferencia de cifras entre
      fuentes en vez de forzar una única cifra ganadora — este hallazgo de
      duplicación real entre especialidades es la base directa de la
      propuesta de fusión Nefrología↔Vías Urinarias que seguía en el
      informe.
    - **3 piezas interactivas nuevas, sin equivalente ya existente en la
      app** (`vias-urinarias.js`, que hasta ahora solo llamaba a
      `initCorkboard()`): 1) un **gauge de objetivo PVC/PCP** (0-20 mmHg,
      marcadores en 12 y 15) en el micro-prof-item "Corrección de factores
      prerrenales" de la Ficha 1, reutilizando `.kinetic-row`/
      `.kinetic-fill`/`.kinetic-marker` (mismo patrón ya usado en los
      gauges de Cardiología); 2) un **simulador de la relación inversa
      creatinina↔TFG** en la Ficha 3 (`calcCreatininaTfgCurva()`, slider de
      TFG relativa 10-100% que mueve un marcador sobre una curva hiperbólica
      SVG dibujada a mano — relación proporcional ilustrativa, sin cifras
      clínicas absolutas, mismo criterio de honestidad que el resto de
      simuladores de la app); 3) una **calculadora de Cockcroft-Gault y
      CKD-EPI** (versión 2009, con coeficiente racial — la misma que da la
      Tabla 6, distinta de la CKD-EPI 2021 sin raza que ya usa la
      calculadora de ERC en Nefrología) con un aviso KDIGO 2012 repetido de
      forma prominente **encima** del resultado, no solo en el texto
      previo, para que la calculadora no se lea como una validación
      implícita de su uso en la LRA aguda.
    - **2 mejoras menores**: una mini línea de tiempo (0-24h) bajo la Tabla
      4 de biomarcadores, visualizando los mismos 6 tiempos de detección
      ya tabulados; y un enlace de una frase entre "Por qué la creatinina
      detecta tarde" (Ficha 2) y su desarrollo completo en la Ficha 3.
    - **2 bugs propios encontrados y corregidos durante la propia
      verificación con Playwright** (no señalados en el informe original,
      surgidos al implementar sus propuestas): la nota cruzada añadida a
      "Por qué la creatinina detecta tarde" decía "más abajo" para referirse
      a contenido que en realidad está en la Ficha 3 (una ficha distinta,
      no más abajo en la misma) — corregido a "en la Ficha 3"; y la
      etiqueta "IL-18 / NGAL 4-6h" de la línea de tiempo de biomarcadores se
      solapaba visualmente con el título "MISMA TABLA, EN LÍNEA DE TIEMPO"
      justo encima — detectado con una captura de Playwright, no por
      inspección del código — corregido reestructurando el espaciado
      vertical del componente (contenedor con más margen superior, las 3
      etiquetas escalonadas dentro de la caja en vez de una asomando por
      encima).
    - Verificado con Playwright: las 3 fichas abren/voltean sin error de
      consola ni 404 real; el simulador de TFG-creatinina mueve el
      marcador y recalcula el mensaje/color correctamente (probado en TFG
      25% → creatinina 400%/danger, marcador en la posición SVG exacta
      precalculada); la calculadora Cockcroft-Gault/CKD-EPI da resultados
      verificados a mano (peso 80/edad 55/Cr 1,2/hombre/raza negra → C<sub>cr</sub>
      78,7 mL/min, CKD-EPI 78,2 mL/min/1,73m², ambos confirmados por
      cálculo manual de las fórmulas); capturas de pantalla a 390px sin
      overlaps de texto en el gauge PVC/PCP, la curva TFG-creatinina, la
      calculadora y la línea de tiempo; sin overflow horizontal a nivel de
      página.
  - **Segundo informe: mapa de solapamiento con Nefrología y 4 propuestas
    de fusión**, publicado también como Artifact — a raíz del hallazgo del
    informe anterior de que varias piezas de interactividad de Vías
    Urinarias eran casi duplicadas de calculadoras ya existentes en FRA
    (Nefrología). Comparó las 3 fichas de Vías Urinarias contra las 9 de
    FRA + la Ficha de fisiología renal + ERC, marcando el solapamiento
    como Alto/Parcial/Bajo por subtema, y propuso 4 opciones (de notas
    cruzadas sueltas hasta fusión completa de módulos), recomendando
    explícitamente **no fusionar contenido** — Fisiopatología UCI y
    Nefrología son especialidades de nivel raíz con audiencia y propósito
    distintos, y el proyecto ya tiene un precedente exacto para este
    mismo problema (`tratamiento-ira-irc.html`, guía transversal sin
    fuente propia dentro de Nefrología) — y en su lugar aplicar, en este
    orden, las Opciones 1 y 2: rematar las notas cruzadas que faltaban, y
    extender esa guía transversal para que también cruce a Fisiopatología
    UCI. A petición explícita del usuario ("corrige en principio las 2
    primeras opciones"), se implementaron ambas:
    - **Opción 1 — 4 notas cruzadas nuevas** (sumadas a las 3 ya
      existentes de la ronda anterior — autorregulación PAM, FE<sub>Na</sub>,
      KDIGO): epidemiología (Ficha 2 ↔ FRA Ficha 2), biomarcadores (Ficha
      3 ↔ FRA Ficha 8 "Predicción y prevención"), y estimación de la TFG
      (Ficha 3, calculadora Cockcroft-Gault/CKD-EPI 2009 ↔ la calculadora
      CKD-EPI 2021 sin raza de ERC) — las 3 filas "Alto" de la matriz de
      solapamiento que aún no tenían nota. Las 7 notas cruzadas totales de
      Vías Urinarias ganaron además un botón clicable (ver Opción 2).
    - **Opción 2 — cross-link real entre especialidades, no solo texto**:
      generalizado el patrón `.tx-link` (hasta ahora solo funcionaba
      *dentro* de un módulo, vía el listener global de
      `nefrologia/index.js`) para saltar *entre* especialidades.
      `nefrologia/index.js` y `fisio-uci/index.js` exponen ahora, junto a
      sus métodos ya existentes (`volverAlMapa`/`volverAlMenu`), un
      `irAFicha(view, panel, tab)` genérico — misma firma en ambos,
      simple `show(view)` del switcher de nivel medio propio +
      `openCorkboardTopic(panel, tab)` si se dan ambos. `home/index.js`
      generaliza su listener de `.especialidad-link` (antes solo sabía
      saltar a Nefrotoxicidad vía `data-target="nefrotoxicidad"`, ver el
      cross-link de la Matriz de Combate MDR) para leer también
      `data-especialidad="nefrologia"|"fisioUci"` +
      `data-view`/`data-panel`/`data-tab`, cambiar el switcher raíz
      (`topLevel.show(...)`) y delegar en el `irAFicha` de la
      especialidad destino — el mismo mecanismo sirve ahora para
      cualquier salto entre Nefrología y Fisiopatología UCI, no solo para
      Vías Urinarias. Las 7 notas cruzadas de Vías Urinarias (Ficha 1: 2;
      Ficha 2: 2; Ficha 3: 3) ganaron un botón `.especialidad-link` real
      apuntando a la ficha exacta de destino (FRA Ficha 1/2/5/8, ERC
      Ficha 1, o la ficha "Regulación del filtrado" del cuaderno de
      fisiología dentro de la nefrona). En la dirección contraria, la
      guía transversal `tratamiento-ira-irc.html` de Nefrología ganó una
      tarjeta nueva "🔗 ¿Vienes de Fisiopatología UCI?" con 3 botones a
      las 3 fichas de Vías Urinarias.
    - **Bug real encontrado y corregido antes de dar la tarea por
      completada**: combinar `class="tx-link especialidad-link"` en los 3
      botones de la tarjeta nueva (Nefrología → Vías Urinarias) habría
      hecho que el listener `.tx-link` YA existente de `nefrologia/index.js`
      (registrado con `document.querySelectorAll('.tx-link')`, sin acotar
      a su propio DOM) también intentara procesarlos — con
      `data-view="viasUrinarias"`, una clave que **no existe** en el
      `nefroLevel` de Nefrología, `createViewSwitcher().show()` no lanza
      error con una clave desconocida, simplemente pone `display:none` en
      **todas** las vistas del switcher (ninguna coincide con la clave) —
      corrompiendo silenciosamente el estado interno de Nefrología cada
      vez que se usara uno de esos 3 botones (autocorregido después, eso
      sí, porque `nefrologiaApi.volverAlMapa()` siempre fija `nefroLevel`
      a `'kidney'` al reentrar a Nefrología desde Especialidades — pero
      dependía de ese reset implícito en vez de no corromperse nunca).
      Detectado por inspección del flujo antes de llegar a probarlo con
      Playwright, no por el propio test. Solución: los 3 botones de vuelta
      (Nefrología → Vías Urinarias) llevan **solo** `.especialidad-link`,
      sin `.tx-link` — y, por coherencia y para no dejar la misma trampa
      sembrada en la otra dirección, los 7 botones de ida (Vías Urinarias
      → Nefrología) se simplificaron también a solo `.especialidad-link`
      (antes combinaban ambas clases; era "seguro" en esa dirección
      porque `fisio-uci/index.js` no tiene ningún listener global
      equivalente a interferir, pero mantenía una asimetría innecesaria).
      `css/components.css` actualizado para que `.tx-link` y
      `.especialidad-link` compartan la misma regla visual
      (`.tx-link, .especialidad-link { ... }`) en vez de duplicar el CSS
      — bump de cache-busting a `?v=20260827` por este cambio.
    - Verificado con Playwright: los 7 botones de ida (autorregulación
      PAM → nefrona/fisio-regulacion, FE<sub>Na</sub> ×2 → FRA
      Ficha 5, KDIGO → FRA Ficha 1, epidemiología → FRA Ficha 2,
      biomarcadores → FRA Ficha 8, TFG → ERC Ficha 1) cambian el switcher
      raíz a Nefrología y abren la ficha exacta de destino (`.active` en
      el `.tab-content` correcto); los 3 botones de vuelta cambian el
      switcher raíz a Fisiopatología UCI y abren la ficha de Vías
      Urinarias correcta; y — la prueba específica del bug ya corregido —
      tras usar un botón de vuelta y reentrar a Nefrología desde
      Especialidades, el mapa del riñón se muestra con normalidad (sin
      rastro de la corrupción de `nefroLevel` que sí se habría producido
      con el diseño anterior). Sin overflow horizontal ni errores de
      consola reales (solo el `favicon.ico` ya documentado como inocuo).
      Las Opciones 3 (página de comparativa de fuentes) y 4 (fusión
      completa, descartada) quedan pendientes de decisión del usuario.
  - **Opción 3 aplicada; Opción 4 descartada explícitamente por el
    usuario tras preguntarle** ("corrige las otras 2 opciones que
    mandaste"). Antes de tocar la Opción 4 (fusión completa) se usó
    `AskUserQuestion` para confirmar, porque el propio informe la
    marcaba como "no recomendada" por romper una decisión de
    arquitectura ya tomada del proyecto (nunca fusionar contenido de
    fuentes distintas) y ser un cambio grande y difícil de revertir — el
    usuario confirmó mantener los módulos separados, así que la Opción 4
    no se implementó. La Opción 3 sí: una tarjeta nueva
    **"📊 Comparativa de fuentes: cifras que no coinciden"** en
    `tratamiento-ira-irc.html` (justo debajo de la tarjeta "¿Vienes de
    Fisiopatología UCI?" de la ronda anterior, mismo patrón de card sin
    fuente propia — pura reorganización de hechos ya citados y
    verificados en otros módulos), con una `.data-table` de 3 filas
    yuxtaponiendo las cifras que de verdad difieren entre Nefrología al
    día y El Libro Azul para el mismo parámetro (ventana de
    autorregulación PAM 80-180 vs. 60-150 mmHg; corte de FE<sub>Na</sub>
    &gt;2%-con-zona-intermedia vs. &gt;1%-sin-zona-intermedia; ecuación de
    TFG CKD-EPI 2021 sin raza vs. Cockcroft-Gault/CKD-EPI 2009 con raza —
    los mismos 3 pares ya señalados con notas cruzadas sueltas en la
    ronda anterior, aquí reunidos en un solo sitio en vez de repartidos),
    más una nota aparte para el caso distinto del BUN/creatinina (no es
    Nefrología-vs-Libro-Azul, son 2 capítulos del propio Libro Azul) y 2
    botones `.especialidad-link` (a FRA · Diagnóstico y a Vías Urinarias
    · Monitorización) para verificar cada cifra en su ficha de origen.
    Ninguna cifra nueva — solo yuxtaposición de las ya verificadas en
    rondas anteriores. Verificado con Playwright: la tarjeta se detecta
    en el DOM, las 3 filas de la tabla contienen las 6 cifras esperadas,
    ambos botones saltan correctamente (a FRA/Nefrología y a Vías
    Urinarias/Fisiopatología UCI), sin overflow horizontal ni errores de
    consola reales. Sin cambios de JS ni de CSS — solo HTML, reutilizando
    el mecanismo `.especialidad-link` ya generalizado en la ronda
    anterior, así que no hizo falta bump de cache-busting.
- **Tercer bloque: "Cardiología"** (`js/modules/fisio-uci/cardiologia.html`).
  Fuente: El libro azul. Bases fisiopatológicas de la medicina crítica.
  Sección I, Aparato Cardiovascular, capítulos 1-11 (165 páginas) — el
  bloque más extenso de Fisiopatología UCI hasta ahora, más del doble de
  cualquier bloque anterior. PDF subido en **2 archivos** por el propio
  tamaño de la sección (`docs/libro-azul-seccion-i-cardiovascular-parte1.pdf`,
  100 págs., capítulos 1-6; `docs/libro-azul-seccion-i-cardiovascular-parte2.pdf`,
  70 págs., capítulos 7-11) — a diferencia de Hematología/Vías Urinarias,
  aquí no hay offset de página único: Parte 1 no tiene desplazamiento
  (página impresa = página del PDF, portada=1, contenido desde página 3) y
  Parte 2 sí (offset −100, porque continúa la numeración de libro desde la
  página 101 pero es un PDF nuevo que empieza en su propia página 1) —
  verificado leyendo ambos PDF completos página por página antes de
  extraer nada, sin asumir que la numeración fuera continua entre archivos.
  Tercer botón del submenú de bloques (`#btn-fuci-cardiologia`), con
  `fisioUciLevel` (en `fisio-uci/index.js`) ganando una tercera entrada
  (`cardiologia`) junto a `hematologia`/`viasUrinarias` — mismo patrón
  exacto, sin cambios de arquitectura.
  - **Cuaderno de campo de 11 fichas** (`#cardio-corkboard`/
    `#panel-cardio-tabs`, mismo `core/corkboard.js` de siempre, sin
    calculadoras propias — `cardiologia.js` solo llama a
    `initCorkboard(...)`), una por capítulo, todos con correspondencia
    1:1 fuente↔ficha igual que en los bloques anteriores: Fisiología
    cardíaca aplicada (sistema de conducción, ciclo de Wiggers, tonos
    cardíacos, onda de PVY, Frank-Starling, ley de Laplace, MVO₂),
    Fisiopatología cardiovascular — de lo fundamental a lo importante
    (marco conceptual: el sistema CV como transportador de oxígeno, los
    4 componentes interdependientes — bomba, volumen, continente
    vascular, microcirculación —, capítulo breve y puramente conceptual
    sin figuras propias), Disfunción cardíaca sistólica y diastólica
    (curva presión-volumen, Ees/FRSPV, FRPVD, manejo del calcio,
    interdependencia sistólica-diastólica), ¿Cómo funciona la
    microcirculación? (circulación mayor/menor, red microcirculatoria,
    fuerzas de Starling capilares, glucocálix endotelial, disociación
    macro-microcirculatoria), Monitorización hemodinámica sistémica
    clásica — la ficha más extensa, con 9 de las 21 figuras del bloque
    (colocación del catéter de arteria pulmonar, presiones normales de
    cavidades, onda de PVC a-c-x-v-y, índices DO₂/VO₂/GC/IC/OEI con sus
    fórmulas, PPV, 17 segmentos del VI, TAPSE, patrones de disfunción
    diastólica, gradientes de pared del VI), Fisiopatología de la
    enfermedad coronaria (estabilidad de placa vs. tamaño, cascada
    isquémica, lesión por reperfusión — capítulo corto, 4 páginas, sin
    figuras propias), Hipertensión pulmonar en el paciente crítico
    (definiciones hemodinámicas PAPm/PEP/GTPd, predictores de mortalidad
    PVRI/REI, vasodilatadores pulmonares específicos, acrónimo CRASH),
    Fisiopatología de la embolia pulmonar (tríada de Virchow, mediadores
    vasoactivos TXA2/serotonina/endotelina-1, cascada VD→isquemia→colapso,
    alteración V/Q), Fisiopatología del ventrículo derecho (retorno
    venoso, disfunción del VD por TEP/taponamiento/choque
    cardiogénico/sepsis/SDRA-EPOC, VD y VM), Fisiopatología de los
    estados de choque (epidemiología por tipo, tabla de 4 patrones
    hemodinámicos GC/RVS/PVC/PCP/VSTI/ScVO₂/láctico, mediadores del
    choque séptico, mecanismos de respuesta compensadora), y
    Fisiopatología de la interacción corazón-pulmón (Ppl/GC/retorno
    venoso, interdependencia ventricular, efectos de la VM sobre la
    vasculatura pulmonar, ecocardiografía en la interacción
    cardiopulmonar — VCI, evaluación del VD, índice E/Em, ITV).
  - **21 figuras reales**, el bloque con más imágenes de todo el proyecto
    — a diferencia de los bloques anteriores, donde `pdfimages -list`
    encontraba pocas imágenes grandes y el resto eran gráficos
    vectoriales, en este PDF **todas** las figuras clínicamente
    relevantes (curvas de presión, diagramas de circulación,
    ecocardiografías reales, cortes histológicos) están embebidas como
    imagen rasterizada — se extrajeron con `pdfimages -png` + composición
    Pillow con `smask` (mismo método ya establecido), tras filtrar con
    `pdfimages -list | awk` las imágenes genuinamente grandes (>300×300)
    frente a los logos de marca de agua repetidos (189×107, presentes en
    casi todas las páginas). Cada una de las ~21 candidatas encontradas
    se revisó visualmente antes de decidir incluirla — todas resultaron
    ser contenido real y valioso (ninguna se descartó), a diferencia de
    bloques anteriores donde algunas imágenes eran solo logos: sistema de
    conducción cardíaco, ciclo de Wiggers, curva presión-volumen del VI,
    corte histológico de hipertrofia ventricular concéntrica, esquema de
    circulación mayor/menor, red microcirculatoria, fuerzas de Starling
    capilares, colocación del catéter de arteria pulmonar, onda de PVC
    a-c-x-v-y, presiones normales de las cavidades, catéter de arteria
    pulmonar con curvas, gradientes de pared del VI con sarcómeros,
    variación de la presión de pulso, los 17 segmentos del VI, TAPSE real
    (ecografía M-mode), los 4 patrones de disfunción diastólica, patrones
    del choque circulatorio, curva GC-presión AD por presión intrapleural,
    curvas hemodinámicas simultáneas durante VM, esquema corazón-pulmón-
    pleura, y la ecografía subcostal real de la VCI (paneles A/B).
    Ninguna tabla se extrajo como imagen — todas (definiciones de HP,
    índices DO₂/VO₂, presiones normales, patrones de choque, mediadores
    del choque séptico) se recrearon como `.data-table` nativas, mismo
    criterio que el resto del proyecto.
  - **88 preguntas de quiz** (`js/data/fisio-uci-cardiologia-preguntas.js`,
    `cardio-q001`-`q088`, 8 por ficha × 11 fichas — 6 de opción múltiple +
    2 de tipo `redactar` por ficha, mismo formato exacto que los bloques
    anteriores, con varias preguntas de redactar planteadas como casos
    clínicos que integran mecanismos de más de una ficha — p. ej.
    distinguir hipovolemia real de interdependencia ventricular por
    disfunción del VD usando la VVP). `triggerId: 'btn-fuci-cardio-repasar'`,
    añadido al array que ya exporta `fisio-uci/index.js` — sin tocar
    `main.js`. El banco combinado de toda la app queda en **990
    preguntas** (902 previas + 88 de este bloque).
  - **Bibliografía**: 11 entradas, una por capítulo, enlazando a
    `docs/libro-azul-seccion-i-cardiovascular-parte1.pdf#page=N` (capítulos
    1-6, N = página impresa, sin offset) o
    `docs/libro-azul-seccion-i-cardiovascular-parte2.pdf#page=N` (capítulos
    7-11, N = página impresa − 100) según corresponda.
  - **Revisión sistemática de profundidad (a petición explícita del usuario,
    con feedback crítico directo)**: tras el build inicial de las 11 fichas,
    el usuario señaló que el contenido era "muy carente" — con el ejemplo
    concreto de que faltaba por completo la fórmula del **índice de aporte
    de oxígeno (IDO₂)**, pese a estar en la fuente, y una queja general de
    que el resto del bloque leía como "un breve resumen de partes que no son
    muy importantes", sin apenas fórmulas, con pocas tablas/imágenes y sin
    estructura esquematizada. El usuario pidió explícitamente un flujo de
    **2 agentes que hablaran entre sí** (uno solo-bibliografía, otro
    solo-app) para planificar la ampliación — el agente de bibliografía
    agotó el límite de gasto de la cuenta antes de completar su análisis (el
    de app sí terminó, en
    `/tmp/.../scratchpad/cardio-audit-app.md`), así que en vez de reintentar
    con otro agente (y arriesgar el mismo fallo), se optó por releer
    directamente los 2 PDF fuente página por página con el propio `Read`
    tool — más verificable que un resumen de agente, aunque perdiendo la
    conversación cruzada entre los dos agentes que pedía el usuario. El
    informe de auditoría de app sí se usó íntegro: confirmó con métricas
    exactas la queja del usuario (0,55 `.data-table`/ficha y 1,45
    `.kv-row`/ficha en Cardiología, frente a 2,5 y 11,1 respectivamente en
    `erc.html`, tomado como referencia de calidad ya establecida en el
    proyecto) y señaló, ficha por ficha, qué contenido "olía a resumen" y
    cómo reestructurarlo (convertir `term-chips` de comparaciones
    multi-atributo en `.data-table`, añadir `.kv-row` internos dentro de
    `.micro-prof-item` en vez de dejarlos como párrafo único, etc.).
    Reescritas las 11 fichas con contenido sustancialmente más profundo,
    verificado frase a frase contra una relectura íntegra de los 2 PDF
    (170 páginas): fórmulas antes ausentes (IDO₂=IC×CaO₂ del Capítulo 2, y
    su variante IDO₂=IC×CaO₂×10 con rango normal 520-650 mL/min/m² de la
    Tabla 12 del Capítulo 5 — ambas cruzadas explícitamente entre sí en las
    Fichas 1/2/5; ley de Laplace T=P×r/2t; ley de Hagen-Poiseuille;
    ecuación de Fick; doble/triple producto y presión de perfusión
    coronaria; fórmulas de RVS/RVP), tablas nuevas (ciclo de Wiggers en 7
    fases con válvulas/ruidos por fase; clasificación AHA de la placa
    coronaria I-Va; escala de riesgo de *cor pulmonale* agudo de Mekontso;
    vasodilatadores pulmonares específicos con mecanismo/efecto/
    recomendación; macrohemodinamia y factores bioquímicos vitales —
    CaO₂/CvO₂/DO₂/VO₂/GC/IC/OEI — del Capítulo 10; tabla comparativa
    angina→IAMCEST con trombo/biomarcadores/síntoma), y conceptos
    mecanísticos completos que antes faltaban (NETosis/PAD4 y los 2
    mecanismos de inicio de la trombosis en la enfermedad coronaria;
    activación neurohormonal completa en la disfunción cardíaca — SNS,
    SRAA, AVP, péptidos natriuréticos, citocinas —; modelo de Krogh y
    coherencia hemodinámica en la microcirculación; cascada completa
    VD→interdependencia ventricular→isquemia subendocárdica en la embolia
    pulmonar). La tabla de mediadores del choque séptico (Ficha 10), que
    usaba `colspan="2"` como lista disfrazada de tabla, se corrigió a una
    tabla real de 2 columnas (categoría/mediadores). Se corrigió también
    una **discrepancia real entre fichas** detectada durante la relectura:
    el TAPSE normal aparece como &gt;16 mm en el Capítulo 5 (Ficha 5) y
    &gt;17 mm en el Capítulo 11 (Ficha 11) — ambas cifras son fieles a su
    propio capítulo/autor de origen dentro del mismo libro, así que se
    mantuvieron las dos con una nota cruzada explícita en la Ficha 11, en
    vez de forzar una única cifra por criterio propio (mismo criterio de
    fidelidad a la fuente ya establecido en el resto del proyecto — ver el
    precedente del IFR en Fracaso Renal Agudo). Se añadieron **18
    preguntas de quiz nuevas** (`cardio-q089`-`q106`,
    `js/data/fisio-uci-cardiologia-preguntas.js`) centradas específicamente
    en las fórmulas y datos que motivaron la revisión (IDO₂, clasificación
    AHA, NETosis, macrohemodinamia, PAPm/HP límitrofe, escala de Mekontso,
    receptores ET-A/ET-B), llevando el banco de Cardiología a 106 preguntas
    y el banco combinado de toda la app a **1008 preguntas** (990 previas +
    18). Verificado con Playwright tras la reescritura: las 11 fichas del
    cuaderno de campo abren y voltean sin error de consola, ninguna imagen
    da 404, y el quiz completa un recorrido de 12 preguntas del tema
    "enfermedad coronaria" (incluida una pregunta tipo `redactar`) sin
    excepciones JS.
  - **Segunda ronda de revisión, centrada en Fichas 1 y 2 (a petición
    explícita del usuario, tras seguir señalando la primera revisión como
    insuficiente)**: el usuario pidió, esta vez, ir "por partes" — empezando
    por una relectura exhaustiva de los Capítulos 1 y 2 (ya releídos una vez
    en la primera ronda, pero con margen real de profundidad no explotado) y
    pidiendo explícitamente que las fórmulas fuesen **interactivas**, no solo
    texto/tablas. Releídas de nuevo, página por página, las 25 páginas de
    ambos capítulos (Parte 1, págs. 1-28), se encontraron 2 tipos de huecos:
    1. **Contenido real del capítulo aún no trasladado**: en la Ficha 1 — la
       Figura 1 original del capítulo (esquema de interdependencia
       ventricular, corazón normal vs. *cor pulmonale*, con el mecanismo
       completo de por qué el PEEP puede colapsar el VI al compartir
       pericardio con un VD sobrecargado), las propiedades de
       **automatismo y ritmicidad** como conceptos distintos, la
       diferenciación embriológica de los miocitos (unos forman fibras
       contráctiles, otros conservan automatismo y forman el sistema de
       conducción), las **uniones comunicantes en hendidura** (*gap
       junctions*) como mecanismo de propagación célula a célula, la
       localización anatómica precisa del nodo AV, y el **período
       refractario efectivo** (fases 0-2 y parte de la 3) como mecanismo de
       protección — ninguno de estos conceptos, todos presentes en el
       capítulo, estaba en la ficha. En la Ficha 2, un hallazgo más serio:
       la sección "Interdependencia de los componentes del sistema" (con un
       marco conceptual de "4 componentes" — bomba/volumen/continente
       vascular/microcirculación) **no existe en el Capítulo 2 releído** —
       es contenido que se había escrito en una sesión anterior sin
       verificación directa contra la fuente, y no aparece en ningún punto
       del texto real (que en su lugar describe la circulación pulmonar de
       baja resistencia/alta capacitancia frente a la sistémica de alta
       resistencia, con una única bomba bajo control neurohormonal). Se
       **eliminó por completo** esa sección fabricada y se sustituyó por la
       distinción real pulmonar/sistémica del propio capítulo, siguiendo el
       mismo criterio ya establecido en el proyecto de nunca dejar contenido
       clínico sin respaldo directo verificado — el propio proceso de
       relectura exhaustiva de esta segunda ronda es lo que permitió
       detectar este caso concreto, que la primera ronda (más centrada en
       añadir contenido nuevo que en auditar frase a frase el ya existente)
       no había capturado. También se añadió la cifra real de la fuente de
       que una PAS &lt;90 mmHg mantenida &gt;30 min reduce la supervivencia
       hasta un 48% en individuos previamente sanos (ausente hasta ahora).
    2. **Inconsistencia interna real de la propia fuente, documentada con
       nota en vez de "corregida" silenciosamente** (mismo criterio que el
       IFR de Fracaso Renal Agudo o el TAPSE &gt;16/&gt;17mm de Cardiología):
       el Capítulo 1 describe el cierre de las válvulas mitral/tricúspide
       (fase de contracción isovolumétrica) como el "segundo ruido cardíaco
       (S2)" — un error real del propio texto, contradicho por su propia
       descripción, unas páginas después, del cierre de las válvulas
       aórtica/pulmonar como S2. La ficha reproduce la nomenclatura
       fisiológica estándar (S1 para el cierre AV) con una nota explícita
       señalando la contradicción interna de la fuente.
    - **4 calculadoras interactivas nuevas** (`cardiologia.js`, mismo patrón
      `calcXxx()`/`.tfg-estado-ok/warn/danger` ya usado en Nefrología —
      primeras calculadoras de todo el bloque de Cardiología, que hasta
      ahora no tenía ninguna, a diferencia del resto de la app):
      **Ficha 1** — "Transporte de oxígeno (principio de Fick)"
      (`calcFickTransporte()`: Hb/SaO₂/PaO₂/FC/VS/SC obligatorios,
      SvO₂/PvO₂ opcionales → CaO₂, GC, IC, DO₂, DO₂I y, si hay datos
      venosos, CvO₂/VO₂/EO₂ en vivo) y "Resistencias vasculares (ley de
      Hagen-Poiseuille)" (`calcResistenciasVasculares()`: GC/PAM/PAD → RVS
      en unidades de Wood y su equivalente en dyn·s·cm⁻⁵; PAMP/PAI
      opcionales → RVP). **Ficha 2** — "Costo de funcionamiento
      miocárdico" (`calcCostoFuncionamiento()`: FC/PAS/presión en
      cuña/PAD sistémica + selector de ventrículo izquierdo/derecho, que
      alterna dinámicamente si el cálculo de presión de perfusión coronaria
      usa la cuña o la PVC → doble producto, triple producto, PPC, índice
      de aporte-consumo) y "Índice de aporte de oxígeno (IDO₂)"
      (`calcIDO2Ficha2()`: GC/SC/Hb/SaO₂/PaO₂ → IC, CaO₂, IDO₂ = IC×CaO₂×10,
      cruzado contra el rango normal 520-650 mL/min/m² ya citado en la
      Ficha 5). Todas actualizan el resultado en vivo con cada `input`,
      siguiendo exactamente el guard `.value === ''` (nunca `Number('')`)
      ya establecido como lección aprendida en las auditorías de FRA/ERC
      para no tratar un campo vacío como 0.
    - Añadidas **7 preguntas de quiz nuevas** (`cardio-q107`-`q113`,
      incluidos 2 casos clínicos tipo `redactar` que usan directamente las
      calculadoras nuevas — uno sobre el efecto de la anemia en el DO₂,
      otro sobre interpretar un doble/triple producto elevado), llevando el
      banco de Cardiología a 113 preguntas y el banco combinado de toda la
      app a **1015 preguntas** (1008 previas + 7). Verificado con
      Playwright: las 4 calculadoras responden en vivo a cambios de input
      (confirmado recalculando tras modificar Hb, GC y el selector de
      ventrículo), las 11 fichas siguen abriendo sin error de consola ni
      404, y el quiz completa un recorrido de 10 preguntas sin excepciones.
      **Pendiente**: el usuario planteó esta revisión "por partes" — quedan
      las Fichas 3-11 por la misma relectura exhaustiva de segunda ronda
      (esta vez ya se hizo en las Fichas 1-2 solamente, a petición
      explícita), a confirmar con el usuario si se continúa automáticamente
      o ficha por ficha según vaya pidiendo.
  - **Tercera ronda: Fichas 3 y 4** (a petición explícita del usuario de
    "continuar con las 2 siguientes fichas"), releídos íntegros los
    Capítulos 3 (págs. 29-43) y 4 (págs. 45-57) de la fuente. A diferencia
    de las Fichas 1-2, estas dos ya estaban en un nivel de detalle alto
    desde la primera ronda — la relectura encontró huecos más puntuales,
    no una reescritura completa:
    - **Ficha 3**: nueva **Figura 1 del capítulo** recreada como SVG
      (patogénesis de la falla cardíaca — FE vs. tiempo, evento índice →
      mecanismos compensatorios → daño secundario, asintomático→sintomático
      — ausente hasta ahora, aunque ya se citaba en prosa); los puntos
      **A/B/C** de la Figura 3 (curvas de Starling/retorno venoso)
      explicitados en el texto en vez de quedar implícitos; el dato de que
      el retorno venoso y el GC llegan a cero cuando la presión auricular
      iguala la MCFP; ampliado el mecanismo de elevación del calcio
      citosólico en falla cardíaca con el detalle real de los **2
      mecanismos combinados** (menor actividad de SERCA2a + depleción de
      los depósitos del retículo sarcoplásmico por eflujo a través del
      **receptor rianodina** "permeable") y los términos **túbulos
      transversos**/canales tipo L, ausentes en la versión anterior (más
      genérica). Añadida una **calculadora interactiva de tensión de pared
      (ley de Laplace, T=(P×R)/2t)** — primera calculadora de la ficha.
    - **Ficha 4**: nueva sección de **4 mecanismos de intercambio
      capilar** (uniones entre células endoteliales, fenestraciones con
      membrana/diafragma, transporte activo por vesículas, difusión por la
      membrana celular) — completamente ausente hasta ahora, pese a ser
      contenido explícito del capítulo; nuevo kv-row sobre el **endotelio
      como órgano de control** con la distinción real fuente/vasodilatador
      (óxido nítrico, prostaciclina) vs. vasoconstrictor (angiotensina II,
      endotelina-1) — antes solo cubierta indirectamente por el
      glucocálix. No se añadió calculadora nueva en esta ficha porque sus
      fórmulas (DO₂, ATP de la respiración celular) ya tienen calculadora
      interactiva equivalente en las Fichas 1, 2 y 5 (DO₂/Fick) — evitar
      duplicar la misma interactividad 3 veces.
    - Añadidas **5 preguntas de quiz nuevas** (`cardio-q114`-`q118`,
      incluido un caso tipo `redactar` sobre por qué la hipertrofia
      concéntrica es, matemáticamente, una respuesta "lógica" a la
      sobrecarga de presión según la ley de Laplace), llevando el banco de
      Cardiología a 118 preguntas y el banco combinado de toda la app a
      **1020 preguntas** (1015 previas + 5). Verificado con Playwright: la
      calculadora de Laplace responde en vivo (150,0 → 240,0 al cambiar el
      radio de 2,5 a 4 cm), las 11 fichas siguen abriendo sin error de
      consola ni 404, y el quiz completa un recorrido de 10 preguntas del
      tema "¿Cómo funciona la microcirculación?" sin excepciones.
      **Pendiente**: quedan las Fichas 5-11 por esta misma relectura
      exhaustiva de tercera ronda (las Fichas 5-6 ya tuvieron una revisión
      profunda en la primera ronda general, pero no la relectura
      frase-a-frase de segunda/tercera ronda que sí tuvieron las Fichas
      1-4) — a confirmar con el usuario cómo continuar.
  - **Gráficas interactivas — simulador de Frank-Starling y ciclo cardíaco
    dinámico** (a petición explícita del usuario: "pon gráficas
    interactivas... sobre todo con la ley de Frank Starling e intenta poner
    el ciclo cardíaco de manera dinámica"), ambas en la Ficha 1:
    - **Simulador de la curva de Frank-Starling** (`calcFrankStarlingSimulador()`
      en `cardiologia.js`, mismo patrón slider→JS que `.tfg-simulador` de
      Nefrología): 3 curvas SVG (aumentada/normal/disminuida) dibujadas con
      la fórmula `f(x) = A·(x/xp)·e^(1−x/xp)` — una curva de "pico con
      reducción posterior" elegida deliberadamente porque el propio
      capítulo describe la relación precarga-contractilidad como una
      "meseta con posterior reducción de la fuerza" ante presión/volumen
      excesivos, no una simple saturación monótona. Un slider de precarga
      (0-100%) y un selector de estado contráctil mueven un marcador sobre
      la curva activa (resaltada con `.cardio-fs-curva-activa`, las otras
      dos atenuadas) y actualizan un texto de "volumen sistólico relativo"
      en <strong>porcentaje</strong>, no en mL — deliberado, para no
      fabricar una cifra clínica de mL que la fuente no da (misma
      disciplina de honestidad que ya lleva el propio `.tfg-simulador`
      del simulador de TFG en Nefrología, con su aviso de "modelo
      simplificado, no una calculadora clínica real").
    - **Animación dinámica del ciclo cardíaco** (Wiggers), añadida junto a
      la imagen estática ya existente (no la sustituye — sigue siendo la
      referencia fiel al diagrama real del capítulo): implementada
      **100% en CSS**, sin `requestAnimationFrame`, deliberadamente por
      coste en móvil — un `<rect>` cursor animado vía `@keyframes` sobre
      la propiedad `x` (CSS-animable en SVG2, a diferencia de `x1`/`x2` de
      `<line>`, que no lo son — por eso se usa `<rect>` y no `<line>` para
      el cursor), 7 `<text>` de fase (A-G) con `@keyframes` de `opacity`
      cuya ventana on/off codifica directamente los límites temporales de
      cada fase (sin JS de temporización), y 4 círculos de pulso para los
      tonos cardíacos (S1 en el límite A→B, S2 en el límite D→E, S3/S4
      atenuados como en el resto de la app). Las curvas de presión
      aórtica/ventricular, la onda de PVY (a-c-x-v-y) y un trazado
      esquemático de ECG son paths SVG estáticos dibujados a mano (mismo
      método que la Figura 1 de interdependencia ventricular y la Figura 1
      de patogénesis de la Ficha 3), con las proporciones temporales de
      las 7 fases estimadas sobre el ciclo de 800 ms que sí da la Figura 4
      original (la fuente no desglosa la duración exacta de cada fase
      individual, así que se usan proporciones fisiológicas estándar,
      declarado explícitamente en el texto de la ficha). Un botón
      pausa/reanuda alterna la clase `.paused` (que fija
      `animation-play-state: paused` en cursor/etiquetas/pulsos) y un
      selector de velocidad cambia la custom property `--ciclo-duracion`
      (6s/4s/2s/0,8s — el último, tiempo real a FC 75 lpm) — ambos
      controles son JS mínimo (`initCicloCardiacoAnimado()`), la animación
      en sí no requiere ningún bucle de JS.
    - CSS nuevo en `components.css` (bloque "GRÁFICAS INTERACTIVAS DE
      CARDIOLOGÍA"), 100% aditivo — no se tocó ninguna regla existente
      (confirmado con `git diff --stat`, 0 líneas eliminadas). Se
      actualizó la fecha de `?v=` de `index.html` a `20260820` (regla ya
      establecida del proyecto: cualquier cambio a un `.css` exige
      refrescar el cache-busting).
    - Añadidas **4 preguntas de quiz nuevas** (`cardio-q119`-`q122`,
      incluida una de tipo `redactar` sobre la incisura dicrótica y el
      balón de contrapulsación), llevando el banco de Cardiología a 122
      preguntas y el banco combinado de toda la app a **1024 preguntas**
      (1020 previas + 4). Verificado con Playwright: el marcador de Frank-Starling se mueve
      en vivo al cambiar precarga/estado contráctil (cx 170→274 al subir
      precarga a 90%, curva activa cambia correctamente a "aumentada"), el
      cursor del ciclo cardíaco avanza con el tiempo (x 115,8→183→252,3 en
      2 lecturas de 500ms) y se congela exactamente al pausar (misma x en
      2 lecturas separadas), solo una etiqueta de fase visible a la vez
      (opacity 1 en la fase activa, 0 en las demás 6), y las 11 fichas
      siguen sin error de consola ni 404.
  - **Auditoría propia de las 4 primeras fichas e informe al usuario**: a
    petición explícita ("evalúa la posibilidad de añadir o mejorar algo en
    relación con las partes interactivas"), se revisó con `grep` el estado
    real (no de memoria) de calculadoras/sliders/SVG en las Fichas 1-4 y se
    entregó un informe priorizado: Ficha 3 sin visual para el asa
    presión-volumen (mayor oportunidad), Ficha 4 sin ningún elemento
    interactivo (única de las 4), y Fichas 1-2 con calculadoras que
    devuelven solo texto sin gauge visual. El usuario pidió empezar por la
    Ficha 1. Añadido un **gauge visual para el DO₂I** de la calculadora de
    Fick (`actualizarGaugeDO2I()` en `cardiologia.js`, reutilizando el
    patrón `.kinetic-row`/`.kinetic-fill`/`.kinetic-marker` ya existente en
    las calculadoras ISTH de Síndromes Urgentes — sin CSS nuevo): escala
    0-800 mL/min/m² con 2 marcadores en 530 y 600 (banda normal), relleno
    coloreado según el mismo `estado` (ok/warn/danger) que ya calculaba la
    función. También se aclaró en el propio diagrama animado que S3 y S4
    son "si patológico" (ya lo decía la Ficha F para S3; se añadió el
    mismo matiz a la etiqueta de la fase A para S4, y se renombró la
    etiqueta estática "S1-S4" a "Tonos" para no dar a entender que los 4
    tonos suenan siempre). Verificado con Playwright: el gauge cambia de
    68% (verde, DO₂I 544) a 34,5% (rojo, DO₂I 276) al bajar la Hb a 7 g/dl,
    y vuelve a verde al restaurarla — las 11 fichas siguen sin error de
    consola ni 404. **Pendiente** (según el propio informe, no
    implementado aún): asa presión-volumen interactiva en Ficha 3,
    simulador de fuerzas de Starling capilares en Ficha 4, y el mismo
    gauge visual en las 2 calculadoras de la Ficha 2.
  - **Reformulación de las 3 calculadoras de la Ficha 1: interpretación
    fisiopatológica dinámica, no solo un número y una barra "inerte"**
    (feedback explícito del usuario: quería que las calculadoras
    explicaran "qué significa que salgan en valores extremos, qué implica
    que se mantenga en rango, qué mecanismos hay para mantenerse en rango
    y cómo se puede descompensar"). Las 3 calculadoras (Frank-Starling,
    Fick, resistencias vasculares) ganaron una función de interpretación
    por zonas (`textoZonaFrankStarling`/`textoEstadoFrankStarling`,
    `textoZonaDO2I`, `zonaRVS` en `cardiologia.js`) que, según en qué
    tramo cae el valor calculado, inyecta un párrafo distinto (no una
    plantilla fija con el número insertado) cubriendo los 3 ejes pedidos:
    qué significa esa cifra, qué mecanismo compensador la sostiene ahí, y
    qué pasa si ese mecanismo se agota. Contenido anclado a conceptos ya
    desarrollados en otras fichas para no fabricar nada nuevo sin
    respaldo: el DO₂ crítico y la extracción máxima 60-70% (Ficha 5), el
    círculo vicioso de congestión por retención de líquidos (Ficha 3), el
    coste miocárdico de los inotrópicos (Ficha 2), la vasoplejía séptica
    por sobreproducción de NO (ya citada en Ficha 10) y el shunt
    arteriovenoso en el shock distributivo (Ficha 4). Cada calculadora
    ganó un `<div>` de interpretación nuevo (`#cardio-fs-interpretacion`,
    `#cardio-fick-interpretacion`, `#cardio-rv-interpretacion`, mismo
    patrón visual `.tfg-estado` ya existente) situado justo debajo del
    resultado numérico:
    - **Frank-Starling**: el texto combina la zona de la curva en la que
      cae la precarga (ascendente pronunciada/precarga-dependiente, meseta
      de eficiencia, o sobredistensión con reducción de fuerza — esta
      última explicando explícitamente el mecanismo de sobreestiramiento
      del sarcómero) con el estado contráctil seleccionado (normal,
      disminuida — con el ciclo de retención de líquidos que termina en
      congestión —, o aumentada — con el coste en consumo miocárdico de
      oxígeno de sostener inotrópicos).
    - **Fick (DO₂I)**: 6 tramos (crítico &lt;350, bajo 350-449, límite
      bajo 450-529, normal 530-600, alto 601-750, muy alto &gt;750), cada
      uno con su propia lectura clínica — incluida la advertencia
      explícita de que un DO₂ muy alto no garantiza buena oxigenación
      tisular (shock distributivo con shunt). Si se dan datos venosos y la
      EO₂ calculada es ≥50%, se añade una frase extra señalando que la
      reserva de extracción ya está casi agotada.
    - **Resistencias vasculares**: 5 tramos de RVS (muy baja/vasopléjica,
      baja, normal, alta/compensadora, muy alta/extrema), con el color del
      recuadro (`tfg-estado-ok/warn/danger`) ahora también dinámico según
      la zona — antes siempre verde, sin importar el valor.
    Verificado con Playwright cruzando varios inputs por calculadora
    (precarga 10% vs. 95%; Hb 5 g/dl vs. Hb 20 g/dl + FC 150; PAM/GC que
    simulan vasoplejía vs. vasoconstricción extrema): cada caso muestra un
    párrafo de interpretación distinto y el color de la caja cambia en
    consecuencia: las 11 fichas y el quiz siguen sin error de consola.
  - **Cierre de los 3 pendientes del informe de auditoría anterior**
    (gauges de Ficha 2, asa presión-volumen de Ficha 3, fuerzas de Starling
    de Ficha 4), más 2 pulidos adicionales de la Ficha 1 pedidos
    explícitamente por el usuario ("quiero un diagrama interactivo para
    la precarga de Frank-Starling", "que la ley de Laplace se explique con
    imagen", "explica con imagen por qué la RVS/RVP no reflejan fielmente
    la poscarga"):
    - **Diagrama de la ley de Laplace en la Ficha 1** (dentro del
      micro-prof-item "Poscarga"): antes solo texto (`T = P×r`), ahora un
      slider de radio ventricular mueve en vivo un círculo (corte
      transversal del ventrículo) y una barra de tensión relativa
      (`calcLaplaceMiniDiagrama()`, IDs `cardio-laplace-mini-*`) —
      distinto y más simple que la calculadora numérica completa de la
      Ficha 3 (`T=(P×R)/2t`, con grosor de pared).
    - **Demostración del artefacto de acoplamiento RVS/RVP-GC**, en el
      mismo micro-prof-item: un slider de GC (con PAM/PAD fijas) mueve dos
      barras `.kinetic-row` — la RVS "calculada" (que sube/baja solo por
      el GC) frente al "tono vascular real" (constante) — para que se vea
      visualmente por qué la RVS calculada así no es un reflejo fiel de la
      poscarga (`calcRVSArtefactoDiagrama()`).
    - **Simulador de Frank-Starling movido dentro del acordeón de
      "Precarga"**: antes era una sección aparte entre `.micro-profiles` y
      la tabla de determinantes del GC; ahora vive dentro del propio
      micro-prof-item "Precarga: ley de Frank-Starling", justo después de
      su párrafo explicativo — mismos IDs, sin cambios de JS más allá de
      la reubicación en el HTML, para que "la explicación tenga el
      diagrama al lado" como pidió el usuario, en vez de un simulador
      genérico más abajo en la página sin conexión visual directa con el
      texto que lo motiva.
    - **Bug de solapamiento de texto SVG, encontrado y corregido durante
      esta misma tanda**: el primer intento del mini-diagrama de Laplace
      usaba un `viewBox="0 0 240 140"` con la etiqueta "Tensión de pared
      (T)" sin `text-anchor="middle"`, así que el texto (~21 caracteres)
      se salía del lienzo y quedaba cortado — confirmado con una captura
      de Playwright antes de corregirlo. Solución: `viewBox` ensanchado a
      `0 0 260 140`, círculo/barra/textos recentrados con
      `text-anchor="middle"`.
    - **Gauges visuales en las 2 calculadoras de la Ficha 2** (mismo
      patrón `.kinetic-row`/`.kinetic-fill`/`.kinetic-marker` del DO₂I de
      la Ficha 1, sin CSS nuevo): doble producto (escala 0-15.000, marca
      en 12.000) y triple producto (escala 0-150.000, marca en 120.000)
      bajo la calculadora de costo de funcionamiento miocárdico
      (`actualizarGaugeCosto()`); IDO₂ (escala 0-800, banda normal
      520-650, 2 marcadores — mismo lenguaje visual que el DO₂I de la
      Ficha 1 aunque sea un rango normal distinto, Tabla 12 vs. Tabla 3)
      bajo la calculadora de IDO₂ (`actualizarGaugeIDO2Ficha2()`).
    - **Simulador interactivo del asa presión-volumen, Ficha 3** — la
      "oportunidad más grande" señalada por el informe de auditoría
      anterior. Modelo ilustrativo del método de elastancia de un solo
      latido (Ees/Ea/V0), estándar en fisiología cardiovascular didáctica
      — el capítulo solo describe el asa de forma cualitativa (los
      patrones ya recogidos en la tabla de la propia ficha), así que las
      constantes del simulador NO son cifras literales de la fuente,
      mismo criterio de honestidad ya aplicado al simulador de
      Frank-Starling de la Ficha 1. Dos sliders (precarga → EDV,
      poscarga → elastancia arterial efectiva Ea) y un selector de estado
      ventricular (normal/disfunción sistólica/disfunción diastólica, que
      cambian Ees y el coeficiente de rigidez diastólica beta) redibujan
      en vivo un asa cerrada (`calcAsaPresionVolumen()` en
      `cardiologia.js`, SVG con 2 tramos rectos de isovolumia + 2 curvas
      de Bézier para eyección/llenado) junto con 2 líneas de referencia
      discontinuas — la ESPVR (Ees, azul) y la FRPVD (rigidez diastólica,
      amarilla) — que se desplazan exactamente como describe la tabla de
      patrones ya existente en la ficha (abajo/derecha en disfunción
      sistólica, arriba/izquierda en diastólica). Lectura numérica debajo
      (EDV/ESV/volumen sistólico/FE, con semáforo de color por FE). El
      coeficiente de rigidez de la disfunción diastólica se afinó a 0,040
      (frente a 0,022 basal) tras comprobar con una primera captura que la
      diferencia visual entre estado normal y diastólico era demasiado
      sutil para ser pedagógicamente útil — con el valor ajustado el
      desplazamiento de la curva FRPVD es claramente visible. La presión
      de llenado se limita a 170 mmHg (`Math.min(170, ...)`) para que la
      combinación de precarga alta + disfunción diastólica no dispare la
      exponencial fuera del lienzo. **Bug encontrado y corregido durante
      la verificación con Playwright**: la etiqueta "Ees" se posicionaba
      dinámicamente en el extremo de la línea ESPVR, lo que la hacía
      solaparse con el título del diagrama cuando Ees es alto (línea casi
      vertical, extremo cerca de la esquina superior) — se fijó en su
      lugar a una posición constante en la esquina superior derecha del
      lienzo (`text-anchor="end"`), que queda razonablemente cerca del
      extremo real de la línea en la mayoría de combinaciones de sliders
      sin arriesgar el solape.
    - **Esquema circular en la calculadora numérica de Laplace de la
      Ficha 3** (`T=(P×R)/2t`, con grosor de pared) — a diferencia del
      mini-diagrama ilustrativo de la Ficha 1 (que usa un slider propio),
      este reacciona a los 3 inputs numéricos reales de la propia
      calculadora: el círculo interior (cavidad) escala con R, el grosor
      del trazo del anillo (pared) escala con t, y una barra de tensión
      se colorea según la T calculada (`calcLaplaceCirculoFicha3()`).
    - **Simulador de fuerzas de Starling a lo largo del capilar, Ficha 4**
      — la única de las 4 fichas sin ningún elemento interactivo hasta
      ahora. Modelo simplificado (presión oncótica constante a lo largo
      del capilar, presión hidrostática decreciente linealmente del
      extremo arteriolar al venular con un diferencial fijo de 17 mmHg,
      valores de partida ~32→15 mmHg clásicos de la docencia fisiológica)
      — la fuente no da esta fórmula, solo describe el balance en prosa
      (ya citada en el texto que precede al simulador), así que es
      puramente ilustrativo. Dos sliders (presión hidrostática arteriolar,
      presión oncótica plasmática) mueven 5 flechas a lo largo de un tubo
      capilar y un marcador de "punto de equilibrio"
      (`calcFuerzasStarlingCapilar()`). **Bug real encontrado y corregido
      durante la verificación con capturas de Playwright**: la primera
      versión dibujaba la flecha de filtración por debajo del tubo
      apuntando hacia abajo (alejándose, correcto) pero la de reabsorción
      por ENCIMA del tubo apuntando hacia arriba (también alejándose, del
      lado opuesto) — ambas flechas apuntaban "hacia afuera" de su propia
      banda en vez de una entrar y otra salir del vaso, así que no se leía
      realmente como filtración-vs-reabsorción. Corregido para que ambas
      vivan en la misma banda (el espacio intersticial, debajo del tubo):
      la de filtración apunta hacia abajo/afuera (sale del vaso) y la de
      reabsorción hacia arriba/adentro (entra al vaso) — verificado con
      captura que ahora se lee correctamente como flujo cruzando la pared
      capilar en cada dirección.
    Verificado con Playwright: gauges de Ficha 2 cambian de color/anchura
    correctamente en valores extremos (doble producto en rojo al 100% con
    FC 180/PAS 220; IDO₂ en rojo al bajar Hb a 7 g/dl); el asa
    presión-volumen cambia de forma con cada slider y de color por estado
    (azul/rojo/púrpura); el círculo de Laplace de la Ficha 3 crece/cambia
    de color con R/t; el simulador de Starling desplaza correctamente el
    punto de equilibrio y llega a los extremos "filtración en todo el
    capilar"/"reabsorción en todo el capilar"; recorrido completo de las
    11 fichas (abrir/cerrar cada una) y un recorrido de 8 preguntas del
    quiz de la Ficha 1 (incluida una de tipo `redactar`), sin errores de
    consola ni 404 reales (el único 404 detectado es el `favicon.ico` que
    el navegador pide automáticamente, sin relación con la app).
  - **Auditoría de bibliografía de las Fichas 5, 6 y 7, con relectura íntegra
    de sus 3 capítulos fuente** (37+4+13 páginas), a petición explícita del
    usuario de "rellenar los huecos de información... revisa que se ha
    incluido correctamente la información de las fichas respecto a la
    bibliografía" — releídos directamente con el `Read` tool (páginas 59-95
    y 97-100 de `libro-azul-seccion-i-cardiovascular-parte1.pdf`, páginas
    1-13 de `libro-azul-seccion-i-cardiovascular-parte2.pdf`) y comparados
    frase a frase contra el contenido ya escrito, mismo método que las
    auditorías anteriores de Nefrología/HTA/ERC/FRA.
    - **Hallazgo más importante: contenido no sourced en la Ficha 6**. El
      Capítulo 6 (Ramírez Vallejo, solo 4 páginas) es exclusivamente sobre
      biología de la placa/trombosis — no menciona en ningún punto la
      cascada isquémica, la progresión subendocardio→epicardio de la
      necrosis ("tiempo es músculo") ni la lesión por reperfusión. Los 3
      `micro-prof-item` que desarrollaban estos temas en la ficha (contenido
      médicamente correcto y estándar, pero no presente en el capítulo
      citado) se **eliminaron**, junto con las 5 preguntas de quiz que
      dependían de ellos (`cardio-q043`-`q045`, `q047`-`q048`) — mismo
      criterio ya aplicado al "marco de 4 componentes" fabricado que se
      encontró y quitó de la Ficha 2 de Cardiología en una auditoría
      anterior: nunca dejar contenido clínico sin respaldo directo en la
      fuente citada, aunque el contenido en sí no sea incorrecto. El resto
      del Capítulo 6 —de hecho, la práctica totalidad de su texto real— ya
      estaba fielmente transcrito en la ficha; el banco de preguntas de ese
      tema queda en 7 (de 8), todas ancladas a contenido real del capítulo.
    - **Ficha 5** (capítulo más extenso del bloque, 37 páginas) ganó 4
      secciones nuevas, ninguna presente antes: 1) **Gradiente
      transpulmonar (GTP)**, con la tabla de 2 filas que distingue HP
      proporcional/pasiva (GTP&lt;12-15, RVP&lt;200-240/2,5-3UW, revierte al
      bajar la Wedge) de HP desproporcionada/reactiva (GTP&gt;12-15,
      independiente de la Wedge) — ausente por completo hasta ahora; 2)
      **Dependencia en paralelo/serie**, los 2 mecanismos reales por los que
      la ventilación mecánica interfiere cíclicamente con la hemodinamia
      (desplazamiento septal por sobrecarga del VD vs. reducción del retorno
      venoso), como 2 `micro-prof-item` nuevos; 3) **Termodilución
      transpulmonar y PICCO**, con las fórmulas reales del método dual
      (VLT/VST/EVLW) y del PICCO (productos del análisis, factores de
      corrección, contraindicaciones) — antes PICCO solo aparecía como
      nombre de instrumento en una tabla, sin ninguna explicación de cómo
      funciona; 4) **indicadores volumétricos de precarga** (VTDVDi &lt;90
      mL/m² predice respuesta/&gt;140 no respuesta, VTDGi &lt;600→80%
      respondedores/&gt;800→30%, área telediastólica VI &lt;5cm²/m²). Se
      añadió también una **nota de discrepancia real de la propia fuente**:
      el capítulo define el IRVS de 2 formas matemáticamente distintas en
      2 puntos diferentes del texto — (PAM−PVC)×80/IC (1600-2400) y
      RVS×ASC (1800-2500) —, señalada en vez de silenciada, mismo criterio
      que el IFR de Fracaso Renal Agudo o el TAPSE&gt;16/&gt;17mm de esta
      misma sección. Enriquecimientos menores: detalle del flujo Grado III
      de disfunción diastólica, matiz ETT vs. ETE en la subestimación del
      volumen auricular izquierdo y su correlación con la PAP.
    - **Ficha 7** ganó: 1) un párrafo mecanístico que faltaba al final de
      "Mecanismos fisiopatológicos" (aumento de la impedancia al flujo de
      salida, deterioro sistodiastólico del VD hacia insuficiencia
      circulatoria, y la reversibilidad al corregir la etiología de la HP);
      2) un párrafo epidemiológico ausente hasta ahora: la causa más
      frecuente de HP en el paciente crítico es en realidad la
      insuficiencia ventricular izquierda (Grupo 2), no los 3 escenarios
      agudos (SDRA/TEP/sepsis) que la ficha desarrolla a continuación —
      matiz importante que faltaba antes de esa sección; 3) subcategorías
      completas que faltaban en la tabla de clasificación de 5 grupos:
      "enfermedades del desarrollo pulmonar" en el Grupo 3, y varias del
      Grupo 5 (histiocitosis pulmonar, linfangioleiomiomatosis,
      neurofibromatosis, enfermedad de Gaucher, trastornos tiroideos,
      microangiopatía trombótica tumoral pulmonar, mediastinitis
      fibrosante) — antes solo se citaba un subconjunto parcial de cada
      grupo; 4) una frase sobre la utilidad limitada de la monitorización
      invasiva por disponibilidad real de las técnicas en la práctica
      diaria.
    - Verificado con Playwright tras todos los cambios: las 3 fichas siguen
      abriendo sin error de consola, el contenido nuevo está presente
      (`Gradiente transpulmonar`, `PICCO`, `Dependencia en paralelo`,
      `VTDVDi`, `enfermedades del desarrollo pulmonar`, `causa más frecuente
      de HP`) y el contenido eliminado ya no aparece (`Cascada isquémica`,
      `Lesión por reperfusión`); el tema de quiz "enfermedad coronaria"
      recorre sus 7 preguntas restantes sin excepciones JS.
  - **Bibliografía movida a una Ficha 12 nueva, dentro del propio cuaderno
    de campo** — a petición explícita del usuario ("quiero que quites la
    bibliografía del final de cardio y la pongas en una nueva ficha, la
    ficha 12"). Antes vivía en un `<div class="card">` suelto, fuera de
    `#panel-cardio-tabs`, debajo del cuaderno de campo — único bloque de
    todo el módulo de Cardiología que no seguía el patrón de ficha del
    resto de la app. Ahora es `<div id="cardio-bibliografia"
    class="tab-content">` dentro del panel, con su propio `.field-card`
    (Ficha 12, ilustración de un libro) en `#cardio-corkboard` — mismo
    patrón exacto que las otras 11 fichas (voltea con una pregunta de
    "gancho", el botón `.back-cta` abre el contenido vía
    `openCorkboardTopic`), aunque, al ser una ficha de referencia y no de
    teoría para repasar, no lleva preguntas de quiz propias — mismo
    criterio ya aplicado a "Tratamiento por objetivos" de ERC y a
    `nefrotoxicidad.html`. El contenido de las 11 entradas de bibliografía
    no cambió, solo su ubicación estructural. Verificado con Playwright:
    el corkboard ahora reporta 12 fichas (antes 11), la Ficha 12 abre y
    muestra sus 11 enlaces (primer href `...parte1.pdf#page=3`, último
    `...parte2.pdf#page=55`), y ya no queda ningún bloque de bibliografía
    suelto fuera del panel (`body > .card:has(h3:has-text("Bibliografía"))`
    da 0 resultados).
  - **Ficha 1: ejes numéricos + calculadora en Frank-Starling, calculadora +
    interpretación en el diagrama de Laplace**, a petición explícita del
    usuario ("añadir datos numéricos en el eje de abscisas y ordenadas...
    me gustaría que se pudiera hacer una calculadora en el simulador...
    algo parecido en el diagrama interactivo de Laplace, que hubiera una
    parte pequeña para calcular esta ley... información breve sobre qué
    implican los valores extremos, cuáles son los valores fisiológicos").
    - **Frank-Starling**: el eje X (antes "Precarga" sin unidades) ahora
      lleva marcas numéricas de EDV en mL (70/93/115/138/160) y el eje Y
      marcas de volumen sistólico en mL (0/40/80/120) — usando el mismo
      rango EDV 70-160 mL ya establecido en el asa presión-volumen de la
      Ficha 3, para que ambos simuladores hablen el mismo lenguaje
      numérico. Se añadió un input numérico `cardio-fs-edv-ml`
      **sincronizado bidireccionalmente** con el slider de precarga
      (`fsPrecargaToEdv()`/`fsEdvToPrecarga()` en `cardiologia.js`) — es la
      "calculadora" pedida: escribir un EDV en mL mueve el slider y
      recalcula el punto de la curva, y mover el slider actualiza el
      campo numérico. El resultado ahora reporta EDV y volumen sistólico
      en mL reales (antes solo "% del máximo alcanzable"). Las funciones
      `textoZonaFrankStarling()`/`textoEstadoFrankStarling()` se
      reescribieron para devolver HTML esquematizado (`<dl class="kv-row">`
      con Zona/Mecanismo/Riesgo, y Contractilidad por separado) en vez de
      un párrafo corrido, con `<strong>` de color (`--accent-red/blue/green`
      según el estado contráctil) y `.hl` en las frases clave — mismo
      patrón visual ya usado en el resto de la app. Se añadió una nota de
      valores fisiológicos de referencia (EDV 70-120 mL, VS 60-100 mL).
    - **Laplace (mini-diagrama de la Ficha 1, dentro de "Poscarga")**: ganó
      un input numérico de presión (`cardio-laplace-mini-p`, mmHg) que,
      junto al slider de radio ya existente, calcula T = P×r en vivo
      (`calcLaplaceMiniDiagrama()` actualizada) — la "calculadora pequeña"
      pedida, distinta y más simple que la calculadora numérica completa
      de la Ficha 3 (T=(P×R)/2t, con grosor de pared). El color del
      círculo/barra ahora responde a la **tensión calculada** (P×r), no
      solo al radio como antes, con 3 tramos (verde/amarillo/rojo en
      280/450 sobre una escala ilustrativa 0-700) y un nuevo
      `#cardio-laplace-mini-interpretacion` (`.tfg-estado`) que explica qué
      implica cada tramo — desde "dentro de un rango habitual" hasta
      "estímulo que dispara la hipertrofia compensadora", enlazando con el
      doble/triple producto de la Ficha 2. Se añadió una nota de valores
      fisiológicos de referencia (P sistólica VI 90-140 mmHg, radio VI
      2,5-3,5 cm, hasta &gt;4,5 cm en dilatación), con la aclaración
      explícita de que las unidades (mmHg·cm) son ilustrativas, no una
      escala clínica validada.
    - Verificado con Playwright: la sincronización slider↔input mL
      funciona en ambas direcciones (precarga 90% → EDV 151 mL; EDV 80 mL
      → precarga 11%), la interpretación esquematizada contiene los
      `kv-row`/`<dt>Zona</dt>` esperados, las marcas numéricas de los ejes
      están presentes en el SVG, y la calculadora de Laplace responde
      correctamente a cambios de P y r (P=200→T=545/rojo,
      P=40+r mínimo→T=67/verde) — las 11 fichas de contenido y la Ficha 12
      de bibliografía siguen abriendo sin error de consola ni 404 reales.
  - **Menú del quiz reorganizado en 3 niveles** (asignatura → bloque →
    ficha), a petición explícita del usuario ("me gustaría que el pool de
    preguntas estuviera mejor dividido... 1º asignatura 2º Tema 3º título
    de ficha"). Antes `initQuiz()` mostraba una única pantalla con TODOS
    los temas de la app en una lista plana (más de 60 botones, sumando
    Hematología+Nefrología+UCI Papers Tuiter+Fisiopatología UCI) bajo
    "¿Qué quieres repasar?". Ahora es una navegación jerárquica:
    - **Nivel 0** (asignaturas): "Todos los temas" (banco completo) + un
      botón por especialidad (Hematología/Nefrología/UCI Papers
      Tuiter/Fisiopatología UCI), cada uno con su recuento real.
    - **Nivel 1** (bloques, tras elegir una asignatura): "← Especialidades"
      + "Todos los temas de [asignatura]" + un botón por bloque — el
      agrupamiento natural que ya existe en la navegación real de la app
      (p. ej. dentro de Nefrología: Fisiología renal y electrolitos/HTA/
      ERC/FRA/TRR; dentro de Fisiopatología UCI: Hematología y
      Hemostasia/Vías Urinarias/Cardiología). **Trasplante** (18 fichas en
      un único banco hasta ahora) se reparte en 3 bloques según el
      prefijo real de sus claves (`tph-`/`cart-`/`comp-`), reflejando las
      3 subvistas ya existentes del módulo — sin este reparto, hubiera
      sido el único bloque desproporcionadamente grande de todo el árbol.
    - **Nivel 2** (fichas, tras elegir un bloque): "← [asignatura]" +
      "Todos los temas de [bloque]" + un botón por ficha individual (el
      comportamiento de siempre, ya existente antes de este cambio).
    - Implementación: `quiz.js` ganó `renderNivelAsignaturas()`/
      `renderNivelBloques()`/`renderNivelTemas()` (sustituyendo a la única
      `renderTemas()` anterior) y un manejador de clic genérico basado en
      `data-accion`/`data-valor` en vez de `data-tema` directo — cada
      nivel es solo una lista de botones generada a partir de `temas`
      filtrado por `asignatura`/`bloque`, sin estado adicional más que
      `nivelAsignatura`/`nivelBloque` para resolver las opciones "Todos
      los temas de...". Los 4 `index.js` de especialidad (`home`,
      `nefrologia`, `uci-papers`, `fisio-uci`) ahora mapean sus
      `temasXxx.map(t => ({ ...t, asignatura, bloque }))` antes de
      exportar `quizTemas`, en vez de solo `[...temasA, ...temasB]` — la
      jerarquía se etiqueta en el punto exacto donde cada especialidad ya
      combina sus propios bloques, sin tocar ningún archivo
      `js/data/*-preguntas.js` ni añadir ningún paso nuevo en `main.js`
      (que sigue haciendo un `[...home.quizTemas, ...]` idéntico a antes —
      el `asignatura`/`bloque` ya viaja dentro de cada objeto `tema`).
      Degradación elegante conservada: un `tema` sin `asignatura`/`bloque`
      se agrupa bajo etiquetas genéricas ("Otros"/"General") en vez de
      romper el árbol.
    - Verificado con Playwright: nivel 0 muestra las 4 especialidades con
      sus recuentos correctos (1019 total = 176+559+103+181); nivel 1 de
      Nefrología muestra sus 5 bloques con recuentos que suman el total
      (255+88+96+72+48=559); nivel 1 de Hematología confirma el reparto en
      3 de Trasplante (35+25+30=90, mismo total que antes); nivel 2 de
      Trasplante-CAR-T muestra sus 5 fichas reales; la navegación
      "← Especialidades"/"← [asignatura]" vuelve al nivel correcto; "Todos
      los temas de Cardiología" arranca un recorrido de 117 preguntas; sin
      errores de consola ni 404 reales en ningún punto del árbol.
  - **Auditoría de bibliografía y ampliación de las Fichas 9, 10 y 11**
    (cierre de la ronda de auditoría fuente-a-fuente iniciada con las
    Fichas 5-7): releídos íntegros los 3 capítulos fuente restantes de
    Cardiología (Echeverry D., Cap. 9, Ventrículo Derecho, págs. 121-128;
    Urrutia N./Ugarte Ubiergo S., Cap. 10, Estados de Choque, págs.
    129-153 — el capítulo más extenso de todo el bloque; Poblano Morales
    M. et al., Cap. 11, Interacción Corazón-Pulmón, págs. 155-167).
    **Ficha 8** (Embolia pulmonar) se revisó también y se confirmó fiel a
    su fuente sin huecos reales — no recibió cambios.
    - **Ficha 9**: nueva **curva de retorno venoso** (SVG estático, RV
      frente a Pad, con la meseta por colapso venoso y la pendiente
      inversamente proporcional a la resistencia venosa, marcando el
      punto Pad=0 y el punto PCM donde RV=0) — la única figura realmente
      nueva de estas 3 fichas, porque la onda a-c-x-v-y ya tiene su
      propio registro real en la Ficha 5 (`cardio-fig9-onda-pvc.jpg`), y
      aquí solo se referencia en vez de duplicarse.
    - **Ficha 10** (la que más contenido ganó, acorde al volumen real de
      su capítulo fuente): tabla nueva de precarga/contractilidad/
      poscarga por tipo de choque (sustituyendo en formato tabular el
      contenido de las hourglass-icons originales del capítulo, más
      legible que recrearlas como 4 SVG); nuevo acordeón "Cascada
      leucocitaria y daño del glucocálix" (secuencia margination→
      rodamiento→adhesión firme→transmigración→fagocitosis→muerte por
      ROS propios; la adhesión independiente de selectinas/integrinas en
      pulmón e hígado, que explica por qué son los primeros órganos en
      fallar; la ventana crítica de ~6 horas de migración neutrofílica
      ligada a mortalidad; la degradación del glucocálix por ROS como
      mecanismo directo de la fuga capilar séptica); ampliado el kv-row
      del NO con el mecanismo iNOS y el efecto paradójico (el mismo
      exceso de NO que causa hipotensión refractaria también bloquea la
      adhesión leucocitaria, limitando la extracción tisular de O₂ pese
      al GC alto); nuevo diagrama SVG de heterogeneidad del flujo capilar
      (capilares con flujo normal/intermitente/detenido conviviendo en el
      mismo lecho); nuevo acordeón de 2 items — límites de la SvO₂/ScvO₂
      como promedio que enmascara la heterogeneidad regional, y la fase
      terminal de fallo mitocondrial/hipoxia citopática (la mitocondria
      pierde la capacidad de usar el O₂ que le llega); nuevo diagrama SVG
      del triángulo endotelio-inflamación-coagulación (ya citado en
      prosa, ahora visual); nueva tabla "Correlato clínico-temporal"
      (flujo capilar × OEI × SvO₂ por fase, Fig. 8 del capítulo,
      recreada como `.data-table`); enriquecimientos puntuales: nota
      sobre los límites del umbral PAS&lt;90 en pacientes previamente
      hipertensos o jóvenes sanos, causas ampliadas de choque
      hipovolémico no hemorrágico (pancreatitis/quemados/aplastamiento/
      anafilaxia con pérdida de volumen plasmático, no solo sangre),
      catéter urinario añadido al diagnóstico del choque cardiogénico, y
      el mecanismo de sustrato (glucogenólisis→gluconeogénesis a
      expensas de proteólisis/lipólisis) ampliado en la respuesta
      endocrino-metabólica compensadora.
    - **Ficha 11**: nuevo párrafo sobre el carácter <strong>pasivo</strong>
      del retorno venoso sistémico (sin bomba activa, solo el gradiente
      PCM-Pad, enlazando con la curva nueva de la Ficha 9); nueva sección
      "Cambios en el retorno venoso inducidos por el PEEP" con el
      concepto de <strong>hipovolemia funcional</strong> (base fisiológica
      de la VPP/VVS ya citadas en la Ficha 5) y el matiz de por qué el
      PEEP puede mejorar la función del VI en disfunción sistólica pese a
      no aumentar el GC por sí mismo (menor poscarga efectiva); el
      **TRIVI** (tiempo de relajación isovolumétrica) añadido como
      parámetro complementario en el item de función diastólica; nuevo
      acordeón "Taponamiento cardíaco: hallazgos Doppler" — tema
      completamente ausente hasta ahora — con el colapso pasivo de la
      pared libre de la AD como signo ecocardiográfico más precoz, la
      variación respiratoria recíproca del flujo transmitral/
      transtricuspídeo como correlato Doppler objetivo del pulso
      paradójico, y la VCI dilatada sin colapso inspiratorio.
    - Añadidas **12 preguntas de quiz nuevas** (`cardio-q123`-`q134`, 4
      por ficha — 3 de opción múltiple + 1 de tipo `redactar` en cada
      una), llevando el banco de Cardiología a 129 preguntas (117 tras la
      poda de Ficha 6 + 12) y el banco combinado de toda la app a
      **1031 preguntas**. Verificado con Playwright: las 12 fichas del
      cuaderno de campo (incluida la Ficha 12 de bibliografía) abren y
      voltean sin error de consola ni 404 real (el único 404 es el
      `favicon.ico`, ya documentado como inocuo); el nuevo SVG de
      retorno venoso está presente en la Ficha 9; los 4 fragmentos de
      texto/componentes nuevos de la Ficha 10 (cascada leucocitaria,
      hipoxia citopática, tabla de precarga/poscarga, correlato
      clínico-temporal) y los 4 de la Ficha 11 (hipovolemia funcional,
      taponamiento cardíaco, TRIVI, retorno venoso sistémico) se
      detectan correctamente en el DOM; un recorrido por el quiz de los 3
      temas nuevos/ampliados no generó ninguna excepción JS.
  - **Relectura verbatim de las páginas 137-142 y 163-167 del capítulo 10
    y 11**, a petición explícita del usuario de "terminar las fichas que
    queden por repasar" — en vez de fiarse de las notas de la ronda
    anterior, se releyeron literalmente las páginas fuente del apartado
    de microcirculación/mediadores (Cap. 10) y del cierre del capítulo de
    interacción corazón-pulmón (Cap. 11), lo que permitió corregir
    imprecisiones y añadir contenido más fiel al texto original:
    - **Corrección real**: el "efecto paradójico" del NO en sepsis no era
      (como se había escrito en la ronda anterior) que el exceso de NO
      bloquee la extracción de O₂ vía adhesión leucocitaria — el propio
      capítulo formula el paradójico al revés: la sobreproducción de NO
      tiene un <em>efecto protector</em> sobre la microcirculación de los
      órganos, de modo que <strong>inhibir</strong> el NO farmacológicamente
      sube la PA pero no restaura el O₂ER/VO₂ y reduce el GC/DO₂, con
      riesgo de insuficiencia cardíaca e hipoperfusión coronaria/
      intestinal — el motivo real por el que los inhibidores no
      selectivos de la NOS fracasaron en los ensayos de choque séptico.
      Corregido en `cardiologia.html` y añadida `cardio-q135` para
      fijarlo en el quiz.
    - **Cascada leucocitaria ampliada** con los pasos exactos del texto
      (quimiotaxis, reconocimiento por opsoninas/linfocitos, fagosomas
      por macrófagos, degradación lisosomal) y el ejemplo concreto de
      peritonitis secundaria/terciaria como fallo clásico de contención
      local por fracaso de la migración neutrofílica.
    - **Figura 7 del capítulo (heterogeneidad espacial y temporal del
      flujo capilar) recreada con fidelidad** — la versión anterior
      simplificaba en exceso (3 líneas "flujo normal/intermitente/
      detenido" sin etiquetas de O₂ER/SvO₂); la nueva versión sigue la
      Figura 7 real: capilar detenido con ↓O₂ER/↑SvO₂ local (la sangre
      "no usada" vuelve con más oxígeno) junto a un capilar normal
      adyacente que compensa con ↑O₂ER/↓SvO₂.
    - **Tabla "Correlato clínico-temporal" (Figura 8) reescrita** con la
      secuencia de 4 fases que el propio capítulo describe como la más
      probable (heterogeneidad inicial → fase hiperdinámica compensadora
      → prevalencia de flujo bajo/sin flujo → fase terminal de hiperoxia
      por fallo mitocondrial) — la versión anterior tenía la direccionalidad
      del O₂ER de la fase inicial invertida respecto a la fuente.
    - **Nuevo acordeón "Correlación clínica: una brecha reconocida por los
      propios autores"**, citando textualmente que el capítulo admite un
      "eslabón perdido" en el conocimiento actual sobre el orden temporal
      exacto entre los fenómenos microcirculatorios y el cuadro clínico —
      antes la app presentaba la secuencia como si fuera un hecho
      establecido, sin esa salvedad explícita de la fuente.
    - **Gráfico de tarta SVG de la epidemiología por tipo de choque**
      (62/16/16/4/2%, Ficha 10) — visualiza la tabla ya existente sin
      añadir ningún dato nuevo, cierre del hueco de "Fig. 1" señalado en
      la ronda de auditoría anterior.
    - **Sección "Perspectivas futuras" añadida a la Ficha 11** (ausente
      hasta ahora): la ecocardiografía como herramienta indispensable
      para documentar los efectos de la VM, interpretable por
      profesionales capacitados no necesariamente ecocardiografistas, la
      necesidad de formación en ecocardiografía transesofágica, y las 3
      técnicas avanzadas que el capítulo señala como de mayor utilidad
      futura (velocidad de deformación/<em>strain</em> en miocardiopatía
      séptica, modos 3D para valoración de cavidades, análisis detallado
      de valvulopatías complejas).
    - Añadidas **4 preguntas de quiz nuevas** (`cardio-q135`-`q138`,
      incluida una de tipo `redactar` sobre la "brecha" reconocida en la
      microcirculación séptica), llevando el banco de Cardiología a 133
      preguntas y el banco combinado de la app a **1035 preguntas**.
      Verificado con Playwright: las 12 fichas abren/voltean sin error de
      consola ni 404 real; el donut de epidemiología, el párrafo del
      efecto paradójico de inhibir el NO, el acordeón de la "brecha
      reconocida", el ejemplo de peritonitis secundaria y la sección de
      Perspectivas futuras se detectan correctamente en el DOM. Con esta
      ronda se da por cerrada la auditoría fuente-a-fuente completa de
      las 11 fichas de contenido clínico de Cardiología.
  - **Informe de bugs/mejoras de Cardiología y correcciones aplicadas**, a
    petición explícita del usuario ("haz un informe sobre mejoras... sobre
    puntos que están mal, y sobre fallos"). Auditoría de código (no de
    bibliografía esta vez) sobre `cardiologia.js`/`cardiologia.html`,
    verificando cada hallazgo con Playwright antes de reportarlo — mismo
    estándar que las auditorías anteriores, pero aplicado al código en vez
    de al contenido clínico. 2 bugs reales confirmados y corregidos:
    - **`calcFickTransporte` (Ficha 1) sin guard para SC=0**: a diferencia
      de la calculadora casi gemela `calcIDO2Ficha2` (Ficha 2, misma
      fórmula IC×CaO₂), esta no comprobaba `sc === 0` antes de dividir —
      con superficie corporal 0 mostraba literalmente "IC = Infinity
      L/min/m²" y "DO₂I = Infinity mL/min/m²". Corregido añadiendo el
      mismo guard ya usado en la Ficha 2 (oculta el resultado y el gauge
      en vez de dividir por cero).
    - **Simulador de Frank-Starling (Ficha 1) — el campo mL no se
      autocorregía fuera de rango**: escribir un EDV fuera de 70-160 mL
      clampaba el cálculo interno correctamente pero dejaba el propio
      campo de texto mostrando el valor tecleado sin corregir (p. ej.
      "300" en pantalla mientras el resultado ya decía "EDV ≈ 160 mL") —
      confuso, parecía que la calculadora ignoraba la entrada. Corregido
      reescribiendo el campo con el valor clampado cuando difiere.
    A petición del usuario, se corrigieron también (sin fabricar cifras
    nuevas, solo mejorando cómo se presentan discrepancias de la propia
    fuente ya documentadas) manteniendo intactas las referencias cruzadas
    entre fichas:
    - **TAPSE**: la Ficha 5 (&gt;16 mm) no mencionaba que la Ficha 11
      (&gt;17 mm) cita una cifra distinta para el mismo parámetro — solo
      Ficha 11→Ficha 5 era explícito. Añadida la referencia inversa en la
      Ficha 5, dejando la discrepancia señalada en ambas direcciones (sin
      elegir una cifra "ganadora", mismo criterio que el resto de la app).
    - **Rango normal de DO₂I distinto entre Ficha 1 (530-600, Tabla 3,
      Capítulo 1) y Ficha 2/Ficha 5 (520-650, Tabla 12, Capítulo 5)**:
      ambas cifras son correctas (dos tablas distintas del mismo libro),
      pero no estaba explicado por qué difieren — añadida una nota de
      fidelidad explícita en la Ficha 1 aclarando que no es un error de
      la app. La discrepancia del IRVS (Ficha 5, 2 fórmulas del propio
      capítulo) ya tenía una nota igual de clara desde la auditoría
      anterior — no requería ningún cambio adicional.
    Además, un punto de mejora nuevo (no reportado como bug porque no
    rompía nada, pero podía inducir a error): la calculadora de
    resistencias vasculares (Ficha 1) no distinguía una PAD mayor que la
    PAM (combinación no fisiológica: la presión de la aurícula derecha no
    puede superar a la PAM en un paciente estable) de una vasoplejía
    extrema real — ambas daban RVS negativa interpretada como "shock
    vasopléjico". Añadido un aviso específico (`⚠️ Combinación de valores
    no fisiológica`) que se antepone a la interpretación clínica normal
    cuando RVS≤0, pidiendo revisar los datos en vez de diagnosticar una
    vasoplejía inexistente. Otros 2 puntos señalados en el informe se
    dejaron deliberadamente sin tocar por no ser accionables sin más
    fuente o sin romper la arquitectura ya establecida: la Ficha 6
    (enfermedad coronaria) es la más corta del bloque porque su capítulo
    fuente son solo 4 páginas ya agotadas, y `cardiologia.html` es el
    archivo de contenido más grande de la app — dividirlo iría contra el
    patrón "un partial por categoría" ya asentado en el proyecto.
    Verificado con Playwright: SC=0 ya no muestra "Infinity" (el bloque de
    resultado se oculta, igual que en la Ficha 2); un EDV de 300 mL
    corrige el campo a 160 tras el cálculo; PAD&gt;PAM muestra el aviso de
    no fisiológico y, al corregir el dato, la calculadora vuelve a
    funcionar con normalidad; las notas cruzadas de TAPSE y DO₂I están
    presentes en el DOM; las 12 fichas siguen abriendo sin error de
    consola ni 404 real.
  - **Placeholder de las Figuras 2-4 (Ficha 3) sustituido por un diagrama
    real**, a petición explícita del usuario tras ver una captura de
    móvil del recuadro punteado ("ahora quiero que corrijas esto que se
    ve así de mal"). Era el único recuadro `📊 Placeholder` que quedaba en
    todo el bloque de Cardiología (los 3 que siguen en el bloque de
    Hematología de Fisiopatología UCI son de otro módulo, sin tocar). Se
    recreó como SVG el diagrama clásico de Guyton que el texto ya describe
    en prosa: 2 curvas de Starling (gasto cardíaco, normal vs. con
    contractilidad deprimida) cruzándose con 2 curvas de retorno venoso
    (normal vs. desplazada por retención de líquidos con MCFP más alta),
    con los 3 puntos de equilibrio A→B→C ya nombrados en el texto
    adyacente y las transiciones (1)/(2) marcadas. **Bug de color
    encontrado y corregido durante la propia verificación con capturas de
    Playwright, antes de darlo por bueno**: la primera versión usaba
    `--accent-yellow` para los puntos A/B/C y `--accent-blue` para la
    curva de Starling normal — en la paleta real de esta app (ver
    `css/variables.css`) `--accent-blue` es en realidad un dorado
    (`#d4af37`) casi idéntico a `--accent-yellow` (`#cf9a3e`), así que los
    puntos se confundían visualmente con la curva. Corregido usando
    `--text-main` (crema, con borde `--bg-main` para contraste) para los
    3 puntos, dejando cada curva en un color de la paleta real
    (verde/rojo/dorado/púrpura) — verificado que ahora los 4 trazos y los
    3 puntos se distinguen a simple vista. También se corrigió un
    desbordamiento del texto de la curva de retorno venoso desplazada,
    que se salía del `viewBox` en su posición original.
  - **Avisos de "combinación no fisiológica" en las calculadoras de
    Cardiología**, a petición explícita del usuario ("busca los límites
    fisiológicos de las calculadoras... y pon una advertencia cuando meta
    un dato que sea incompatible con la fisiología si es que fuera
    científicamente y médicamente posible"). Revisadas una por una las 10
    calculadoras/simuladores de `cardiologia.js`: los simuladores basados
    solo en sliders (Frank-Starling, asa presión-volumen, fuerzas de
    Starling capilar, artefacto RVS) no necesitan aviso porque cualquier
    combinación dentro de su rango acotado ya es representable por el
    modelo; los candidatos reales eran las calculadoras con campos
    numéricos libres, donde cada campo por separado puede ser válido pero
    la <em>combinación</em> no lo es — mismo criterio que el aviso de
    PAD≥PAM ya añadido en la ronda anterior, extendido ahora a:
    - **RVP** (Ficha 1, misma calculadora de resistencias): PAI≥PAMP —
      sin gradiente de presión anterógrado no puede haber flujo pulmonar,
      igual razonamiento que PAD/PAM para el lado sistémico.
    - **Fick — sangre venosa más oxigenada que la arterial** (Ficha 1):
      SvO₂&gt;SaO₂ o PvO₂&gt;PaO₂ — el oxígeno se extrae en los tejidos,
      nunca se añade, así que la sangre venosa mixta no puede saturar más
      que la arterial.
    - **Saturaciones fuera de 0-100%** (Fick y IDO₂ Ficha 2, campos SaO₂/
      SvO₂): a diferencia de los avisos anteriores (clínicamente
      implausibles pero calculables), esta es una imposibilidad física
      pura — un % no puede superar 100 — así que se valida aunque el
      campo ya tenga `max="100"` en el HTML (que no impide escribir a
      mano un valor mayor).
    - **Costo de funcionamiento miocárdico** (Ficha 2): cuña/PVC ≥ PAD
      diastólica sistémica → presión de perfusión coronaria ≤0, que sin
      gradiente anterógrado es incompatible con la perfusión miocárdica
      sostenida (no solo "baja", como ya marcaba el aviso `warn`
      preexistente para PPC&lt;60).
    Revisadas también, sin encontrar ningún cruce imposible que añadir:
    Laplace (Ficha 1 y Ficha 3, parámetros geométricos/presión
    independientes entre sí) y el diagrama mini de Laplace (un único
    campo libre). Verificado con Playwright: los 6 avisos nuevos aparecen
    exactamente con los datos que los disparan y desaparecen al corregir
    el dato (SaO₂=150→aviso→98=normal; SvO₂=99&gt;SaO₂=98→aviso;
    PvO₂=95&gt;PaO₂=90→aviso; PAI=20≥PAMP=15→aviso en la línea de RVP sin
    romper la de RVS; SaO₂=120 en Ficha 2→aviso; cuña=80≥PAD=70→aviso con
    PPC=-10 mostrado explícitamente); las 12 fichas y el resto de
    calculadoras siguen funcionando sin error de consola ni 404 real.
  - **Fusión de la Figura estática y la animación dinámica del ciclo
    cardíaco (Ficha 1)**, a petición explícita del usuario tras ver una
    captura mostrando ambas gráficas por separado ("hay alguna manera de
    fusionar ambas gráficas para una mejor explicación?"). La animación
    (`#cardio-wiggers-anim`) solo tenía presión aórtica/ventricular, PVY y
    ECG — le faltaban 3 elementos que sí están en la Figura 2 estática
    (`cardio-fig2-ciclo-wiggers.jpg`): la curva de <strong>presión
    auricular</strong>, el punto de <strong>cruzamiento</strong> donde
    cruza por debajo de la presión ventricular (apertura de la válvula
    mitral, el instante exacto en que arranca la fase F), y las
    etiquetas de los tonos (S1/S2) y de la onda a-c-v de la PVY. Añadidos
    los 3 sin duplicar trabajo: la curva de presión auricular reutiliza
    literalmente el mismo trazado a-c-x-v-y ya validado de la PVY (son
    fisiológicamente la misma onda), reescalado con un simple offset de
    coordenadas a la banda de baja presión (0-14 mmHg) del panel superior
    — no se recalculó ninguna curva nueva a mano. El punto de cruzamiento
    no se colocó a ojo: cae de forma natural donde ya estaba el marcador
    de S3 (x=170, inicio de la fase F), porque las curvas de presión
    ventricular y auricular reescalada ya se cruzan justo ahí — coherencia
    física gratis por reutilizar el trazado real de la PVY en vez de
    inventar una curva nueva. **2 rondas de ajuste de layout tras
    verificar con capturas de Playwright** (mismo método ya establecido
    en esta sesión): la 1ª colocación del texto "Presión auricular" caía
    encima del pico de su propia curva, y las etiquetas S1/"c" de PVY se
    solapaban con el aro de pulso animado (que llega a r=6 en el pico de
    la animación, más grande que el r=3 en reposo); corregido separando
    todas las etiquetas de sus curvas/marcadores con más margen vertical
    y moviendo las letras a-c-v de la PVY por debajo de su curva en vez
    de por encima (donde chocaban con la fila de Tonos). El párrafo
    introductorio de la sección se amplió para explicar explícitamente
    qué se fusionó y por qué. Verificado con Playwright (captura a
    devicePixelRatio 3 para inspeccionar el texto pequeño): las 3
    etiquetas nuevas y el marcador de cruzamiento se leen sin solapes,
    la animación sigue avanzando con el cursor y mostrando una única
    etiqueta de fase a la vez, y las 12 fichas siguen sin error de
    consola ni 404 real.
  - **Mini-diagrama de estado valvular sincronizado**, a petición
    explícita del usuario tras la fusión anterior ("¿podrías construir
    algo más sofisticado con la fusión de ambas gráficas?"). La Figura 2
    estática también incluye el "ciclo de Lewis" — una fila de 9
    corazones esquemáticos mostrando el estado de las válvulas mitral/
    aórtica en cada fase — que la animación no reproducía en absoluto.
    En vez de animar 9 iconos estáticos por separado, se construyó
    **un único corazón esquemático** (aurícula izq./ventrículo izq./
    aorta, `viewBox` propio dentro del mismo `#cardio-wiggers-anim`) con
    2 "válvulas" (círculos rojo=cerrada / verde=abierta con flecha de
    flujo superpuesta) que cambian de estado con el mismo cursor que ya
    mueve las curvas de presión — sin JS nuevo: los nuevos elementos
    llevan las clases `wiggers-mitral-open`/`wiggers-aortic-open`/
    `wiggers-iso-label`, con 3 `@keyframes` nuevos en `components.css`
    que reutilizan los mismos puntos de corte porcentuales ya definidos
    para `wiggers-fase-a` a `-g` (mitral abierta en A+F+G, aórtica
    abierta en C+D, "ISO" centrado en el ventrículo durante B y E) — el
    mismo patrón de "una animación CSS por elemento, cero JS de
    temporización" ya establecido para el resto del diagrama. Añadidas
    también las 3 clases nuevas a la regla `.wiggers-anim.paused` para
    que el botón de pausa las congele igual que al cursor y las fases.
    **Verificación más rigurosa que capturas sueltas**: en vez de solo
    mirar una captura de pantalla, se usó la Web Animations API desde
    Playwright (`element.getAnimations()[0].currentTime = fracción ×
    duración`) para fijar el ciclo exactamente en 7 puntos (uno por
    fase) y comprobar programáticamente que el estado de las 2 válvulas
    y la etiqueta ISO coinciden con la fisiología esperada en los 7 —
    los 7 casos coincidieron exactamente, incluida la sincronía con la
    etiqueta de fase de texto ya existente (mismo instante, misma
    fase). También se confirmó que el botón de pausa congela los nuevos
    elementos y que reanudar los vuelve a mover.
  - **Ventrículo con volumen animado + optimización de las flechas**, a
    petición explícita del usuario de mejorar y optimizar más la fusión
    ("mejoralo más y optimizalo mejor"). Dos cambios:
    1. **El propio ventrículo del corazón esquemático ahora cambia de
       tamaño con el ciclo** (`transform: scale()`, no `rx`/`ry` — más
       barato de animar por ser una propiedad compuesta en GPU en vez de
       forzar recálculo de layout), reutilizando otra vez el mismo
       cronograma porcentual de fases: tamaño <strong>fijo</strong>
       durante las 2 fases isovolumétricas B y E (por definición, sin
       cambio de volumen — la propia fuente ya lo explica así en el
       texto de esta ficha) y variable durante la eyección (C-D, se
       contrae hasta un ~60% ilustrativo del tamaño máximo) y el llenado
       (F-G-A, se distiende de vuelta). No son cifras clínicas reales de
       EDV/ESV (esas ya se calculan con la calculadora de Fick de esta
       misma ficha) — es una escala 0,6-1,0 puramente ilustrativa, mismo
       criterio que el resto de simuladores cualitativos de la app.
    2. **Optimización real de marcado**: las flechas de flujo (mitral y
       aórtica) usaban un `<path>` + un `<polygon>` por flecha (4
       elementos en total); se sustituyeron por un único `<marker>` SVG
       reutilizado como `marker-end` en ambos `<path>`, eliminando los 2
       `<polygon>` — menos nodos DOM sin cambiar el resultado visual.
    - **Verificación exhaustiva con la Web Animations API**: se
      fijó el ciclo en 10 puntos (no solo 1 por fase — incluidos los 2
      límites exactos de cada ventana isovolumétrica, 11,5%/19% para B y
      42,5%/46% para E) y se leyó `getComputedStyle(...).transform` en
      cada uno: confirmado que el tamaño es <strong>idéntico</strong> en
      ambos extremos de B (matrix con escala 1 en 11,5% y en 19%) y de E
      (escala 0,6 en 42,5% y en 46%) — el ventrículo no se mueve ni un
      píxel durante las fases isovolumétricas, tal como exige la
      fisiología — y que decrece monótonamente durante C-D y crece
      monótonamente durante F-G-A. Confirmado también que el botón de
      pausa sigue congelando el nuevo elemento (añadido a la regla
      `.wiggers-anim.paused`) y que las 12 fichas y el resto de
      calculadoras siguen sin error de consola ni 404 real. Bump de
      cache-busting (`?v=20260821-2`) por el segundo cambio de
      `components.css` en el mismo día.
  - **Válvulas realmente móviles + fusión con la curva de presión**, a
    petición explícita del usuario ("¿puedes hacer unas válvulas móviles
    para las diferentes fases del ciclo cardíaco? y también fusionarlo
    con la curva de presión venosa?"). Hasta ahora las "válvulas" eran 2
    círculos superpuestos (rojo/verde) que solo cambiaban de opacidad —
    útil pero no una válvula que se mueve de verdad. Rediseñadas como
    **valvas con bisagra**: cada válvula son 2 líneas finas ancladas a un
    punto de bisagra fijo (`transform-origin` en las coordenadas exactas
    de la bisagra) que giran con `transform: rotate()` — tumbadas
    formando una línea recta y en rojo cuando cierran el orificio,
    giradas ~70-75° hacia dentro del ventrículo/aorta y en verde cuando
    lo dejan abierto — con el giro y el color animados juntos en el
    mismo `@keyframes` (`wiggers-flap-mitral-l/r`,
    `wiggers-flap-aortic-l/r`, mismo cronograma A-G que el resto del
    diagrama, cero JS). Las flechas de flujo (ahora con un único
    `<marker>` SVG reutilizado en vez de un `<polygon>` por flecha,
    optimización aprovechando el cambio) se mantienen sin tocar.
  - **Fusión con la curva de presión (auricular/PVY)**: las mismas 2
    clases de la valva mitral (`wiggers-flap-mitral-l/r`) se reutilizan
    en miniatura **directamente incrustadas en el gráfico principal**,
    en el punto exacto de "Cruzamiento" (x=172, donde la curva de presión
    ventricular cruza por debajo de la presión auricular — que a su vez
    reutiliza el trazado real de la PVY, ver la ronda de fusión
    anterior). El marcador circular genérico que había ahí se sustituyó
    por esta valva mitral en miniatura — mismos ángulos, mismo giro,
    solo con un segmento más corto y sin bisagra propia nueva que
    calcular (reutiliza literalmente las clases ya definidas para el
    corazón esquemático de abajo). El resultado: el mismo fotograma en
    el que la valva del corazón esquemático se abre es exactamente el
    fotograma en el que aparece la V verde sobre la curva de presión —
    una sola animación, dos vistas del mismo instante.
    - Verificado con capturas recortadas con Pillow (el crop nativo de
      Playwright con `boundingBox()` no dio las coordenadas esperadas
      sobre un SVG con `viewBox`, así que se recortó la imagen completa
      después en vez de perseguir el cálculo de coordenadas) en los 2
      estados (cerrada, con la valva en rojo tumbada sobre la curva;
      abierta, con la V verde) tanto en el corazón esquemático grande
      como en la miniatura incrustada — coinciden. Repetida también la
      verificación programática con la Web Animations API en los 7
      puntos de fase y la comprobación de pausa/reanudación, sin
      regresiones. Bump de cache-busting (`?v=20260821-3`), 3er cambio
      de `components.css` en el mismo día.
  - **Informe crítico de la fusión y las 6 correcciones aplicadas**, a
    petición explícita del usuario ("hazme un informe sobre lo que está
    mal... y como se puede hacer mejor" seguido de "quiero que apliques
    todas las mejoras"). El informe (solo texto, sin tocar código) señaló
    6 problemas reales verificados con `grep` sobre los `stroke`/`fill`
    reales del SVG, no solo a ojo — todos corregidos a continuación:
    1. **Colisión de rojo entre 3 elementos distintos**: `--accent-red`
       se usaba a la vez para la curva de presión aórtica, el cursor que
       la atraviesa constantemente, y las valvas cerradas. Corregido
       cambiando solo el cursor a `--text-main` (marcador neutro) — es
       la colisión más grave porque el cursor cruza literalmente por
       encima de la curva roja en cada ciclo; el rojo compartido entre
       la curva aórtica y las valvas cerradas se dejó así a propósito
       (con solo 5 colores de acento en toda la paleta de la app y 8
       conceptos distintos que colorear, la colisión total es
       matemáticamente imposible sin añadir colores nuevos ajenos al
       sistema de diseño — se prioriza resolver la que de verdad
       confunde, no todas).
    2. **Fusión asimétrica (solo la mitral tenía marcador en la curva)**:
       añadida la válvula aórtica en miniatura en su propio cruce (x=110,
       donde la presión ventricular sube por encima de la aórtica —
       inicio de C), con el mismo patrón de línea guía + etiqueta
       "Cruzamiento (apertura aórtica, inicio C)" que ya tenía la mitral.
    3. **El corazón esquemático grande sigue siendo una caja aparte**: no
       se resolvió con un rediseño de layout (habría significado mover
       toda la estructura del panel) — documentado como limitación
       aceptada, ver el punto 3 del informe.
    4. **Imprecisión de fidelidad no señalada**: añadida una nota inline
       en el párrafo introductorio aclarando que la curva de "presión
       auricular" reutiliza la forma de la PVY (aurícula **derecha**) como
       aproximación a la izquierda, no como una medición real de esa
       aurícula.
    5. **Válvula aórtica casi invisible al abrir**: rediseñada con el
       mismo lenguaje visual que la mitral (bisagras horizontales en vez
       de intentar alinearse con las paredes del tubo) pero abriendo
       hacia <strong>arriba</strong> en vez de hacia abajo (a diferencia
       de la mitral, que abre hacia el ventrículo, la aórtica debe abrir
       hacia la aorta) — ahora se ve como una "Λ" verde clara flanqueando
       la base del tubo, con la flecha de flujo bien visible en vez de
       solaparse con ella. 2 ajustes más de posición de las etiquetas
       "Mitral"/"Aórtica" tras detectar por captura que quedaban
       tapadas por la propia flecha de flujo.
    6. **Rendimiento nunca medido en reproducción real** (toda la
       verificación previa manipulaba `currentTime` a mano): se dejó
       correr la animación sin tocarla durante 9 segundos (algo más de 2
       ciclos a la velocidad por defecto) muestreando la posición real
       del cursor (`getBoundingClientRect`) cada segundo — avanza de
       forma monótona y envuelve correctamente en cada ciclo, sin
       bloqueos ni saltos erráticos, con 24 animaciones CSS concurrentes
       activas en el contenedor — todas sobre `opacity`/`transform`
       (barato en GPU), así que no hizo falta consolidar nada.
    - **Nuevo control interactivo real**: 2 botones ◀▶ + un indicador de
      texto ("Fase: X — nombre") que saltan a un punto representativo de
      cada una de las 7 fases y dejan la animación pausada ahí — primer
      control con JS "de verdad" de este diagrama (el resto de la
      interactividad es 100% CSS). Implementado con cuidado para no
      romper el botón de pausa/reanudar normal: nunca se llama a
      `.play()`/`.pause()` de la Web Animations API, solo se fija
      `currentTime` con el contenedor ya en pausa por CSS
      (`.wiggers-anim.paused`), así que reanudar después de saltar de
      fase sigue funcionando con la misma lógica de siempre — verificado
      explícitamente con Playwright (clic en cada fase, luego "Reanudar",
      confirmando que el cursor vuelve a avanzar de verdad, no se queda
      congelado ni salta a un sitio inesperado).
    - Verificado con Playwright: el stepper cicla correctamente por las 7
      fases (incluido el ciclo prev/next), el color del cursor ya no es
      rojo, las 2 miniválvulas del cruce (mitral y aórtica) aparecen y
      cambian de estado en el punto correcto, la válvula aórtica grande
      se ve claramente en ambos estados en capturas recortadas con
      Pillow, y las 12 fichas + el resto de calculadoras siguen sin
      error de consola ni 404 real. Bump de cache-busting
      (`?v=20260821-4`), 4º cambio de `components.css` en el mismo día.
  - **Segundo informe de auditoría del diagrama fusionado (esta vez probando
    en vivo con Playwright, no solo releyendo el código) y sus 3 correcciones
    aplicadas**, a petición explícita del usuario ("ahora haz un informe con
    las mejoras que se pueden aplicar a ese gráfico interactivo y que cosas
    hay mal" seguido de "aplicalos"). A diferencia del informe anterior
    (6 puntos, encontrados releyendo el propio código), este se hizo
    manipulando el diagrama de verdad en el navegador — encontró 3 problemas
    reales nuevos:
    1. **Bug real de desincronía al cambiar de velocidad tras usar el
       stepper de fases**: `irAFase()` fijaba `currentTime` en milisegundos
       absolutos calculados a partir de la duración del ciclo EN ESE
       INSTANTE; si después se cambiaba la velocidad (`--ciclo-duracion`)
       sin volver a pulsar el stepper, ese mismo valor absoluto de ms pasaba
       a representar una fracción distinta del ciclo (más corto o más
       largo), y el dibujo saltaba a una fase distinta de la que seguía
       mostrando la etiqueta de texto — confirmado reproduciéndolo
       (saltar a fase F, cambiar a "Tiempo real" 0,8s sin tocar el stepper,
       el dibujo pasaba a mostrar la fase G mientras el texto seguía
       diciendo F). Corregido guardando la fase fijada como **fracción**
       (`faseIdx`/`faseFijada`, no como ms absolutos) y recalculando
       `currentTime` bajo demanda (`aplicarFaseActual()`) cada vez que
       cambia la velocidad mientras hay una fase fijada — el propio
       cambio de velocidad (`change` del selector) ahora vuelve a aplicar
       la fase activa con la duración nueva. El botón de play/pause libera
       `faseFijada` al reanudar la reproducción libre.
    2. **Válvulas casi instantáneas**: las 4 `@keyframes` de rotación de
       las valvas (`wiggers-flap-mitral-l/r`, `wiggers-flap-aortic-l/r`) y
       las 2 de opacidad de las flechas de flujo (`wiggers-mitral-open`,
       `wiggers-aortic-open`) cambiaban de estado en una ventana de solo
       ~1% del ciclo — a la velocidad "Tiempo real" (0,8s/ciclo) eso son
       ~8ms, imperceptible como movimiento de bisagra real (confirmado
       midiendo con la Web Animations API el `transform` calculado en 8
       puntos alrededor de la transición: saltaba de 0° a 75° casi de
       golpe). Ensanchadas las 6 ventanas a ~5% del ciclo (14%/47%/53%/10%
       para mitral, 17%/22%/40%/45% para aórtica — mismos puntos de corte
       en las 6 `@keyframes`, para que la flecha de flujo y la valva a la
       que pertenece giren exactamente sincronizadas), preservando el
       ángulo de giro y los colores de cada una (rojo cerrada/verde
       abierta) — solo cambia la anchura de la ventana, no los valores en
       cada extremo.
    3. **Sin accesibilidad**: ninguno de los 5 controles interactivos
       (play/pause, selector de velocidad, ◀▶ del stepper, indicador de
       fase) llevaba `aria-label`/`aria-live` — confirmado leyendo los
       atributos por JS, todos `null`. Añadido `aria-label` descriptivo a
       los 4 botones/select y `aria-live="polite"` al `<span>` del nombre
       de fase, para que un lector de pantalla anuncie los cambios de fase
       sin tener que sondear el DOM.
    - Verificado con Playwright tras aplicar los 3 arreglos: el bug de
      desincronía ya no se reproduce (saltar a F y cambiar a 0,8s deja el
      texto de fase visible y la etiqueta del stepper coincidiendo, ambos
      "F"); los 4 `aria-label` y el `aria-live` están presentes; la
      rotación de la valva mitral-l ahora avanza de forma gradual entre
      f=0,485 y f=0,51 (de ~19° a ~50°, en vez de saltar de 0° a 75° en un
      único frame); el recorrido completo de las 7 fases sigue
      sincronizando correctamente válvulas/ventrículo/ISO/flechas (mismo
      patrón de verificación con Web Animations API ya usado en rondas
      anteriores); 9 segundos de reproducción libre muestran el cursor
      avanzando de forma monótona con envoltura correcta de ciclo, 24
      animaciones CSS activas sin caídas de rendimiento; y las 12 fichas +
      el resto de calculadoras de Cardiología siguen sin error de consola
      ni 404 real (solo el `favicon.ico` ya documentado como inocuo). Bump
      de cache-busting (`?v=20260821-5`), 5º cambio de `components.css` en
      el mismo día.
  - **Panel de control unificado del ciclo cardíaco (Ficha 1)** — a
    petición explícita del usuario de "unificar todo lo del ciclo cardíaco
    de la primera ficha, con ciertos cambios de estética y de mejora de
    optimización de función". Hasta ahora la Ficha 1 tenía 5 widgets
    interactivos independientes (simulador de Frank-Starling, calculadora
    de Fick, mini-diagrama de Laplace, demo del artefacto RVS, calculadora
    RVS/RVP, animación del ciclo de Wiggers) cada uno con su propia copia
    desconectada de los mismos parámetros fisiológicos (FC, precarga/EDV,
    contractilidad, PAM, PAD) — cambiar la FC en Fick no afectaba a la
    duración de la animación de Wiggers, cambiar la PAM en la calculadora
    RVS no afectaba al demo del artefacto (hardcodeado en 80/5 mmHg), etc.
    - **Estado compartido** (`CicloEstado` en `cardiologia.js`): un único
      objeto `{fc, edv, contractilidad, pam, pad}` con `on()`/`set()` — las
      notificaciones se agrupan en un único `requestAnimationFrame` aunque
      cambien varios campos en el mismo tick (p. ej. el propio panel
      reescribiendo los 5 campos a la vez), evitando recalcular cada
      widget suscrito una vez por campo modificado. `set()` nunca dispara
      eventos DOM (las funciones de renderizado escriben `.value`
      directamente), así que no hay riesgo de bucles de actualización
      cruzada entre widgets — cada campo compartido (slider de
      Frank-Starling, campo mL, select de contractilidad, FC de Fick,
      PAM/PAD de la calculadora RVS, y los 5 campos del panel) escribe en
      `CicloEstado.set()` en su propio listener 'input'/'change', y cada
      widget se suscribe con `CicloEstado.on()` para re-renderizarse
      cuando cambia cualquiera de los 5 campos, venga de donde venga.
    - **Panel de control visible** (`.ciclo-panel`, nueva tarjeta al
      principio de la Ficha 1, antes de "Anatomía funcional"): 5 campos
      (FC, EDV, Contractilidad, PAM, PAD) que son literalmente la misma
      variable que sus contrapartes en Frank-Starling/Fick/RVS — cambiar
      cualquiera desde el panel o desde el widget correspondiente deja
      ambos sincronizados. Los campos sincronizados en cada widget se
      marcaron con "🔗 panel" en su propia etiqueta para que quede
      explícito cuáles son compartidos y cuáles siguen siendo locales
      (Hb/SaO₂/PaO₂/VS/SC de Fick, GC/PAMP/PAI de la calculadora RVS —
      estos NO se unificaron porque son variables de exploración propias
      de cada calculadora, no parte del "estado del paciente" común).
    - **Leyenda de color única** (`.ciclo-legend`, dentro del propio
      panel): documenta explícitamente, una sola vez para toda la ficha,
      el mapeo de color ya usado de forma consistente pero implícita en
      los distintos SVG (presión aórtica = rojo, ventricular = dorado,
      auricular = púrpura, PVY/tonos = amarillo, ECG = verde, válvula
      cerrada = rojo, válvula abierta = verde, cursor = neutro) — no se
      cambió ningún color existente, solo se hizo legible de un vistazo lo
      que antes había que inferir diagrama a diagrama.
    - **Vínculos fisiológicos reales, no solo cosméticos**: la FC
      compartida ahora fija la duración REAL de la animación de Wiggers
      (duración = 60/FC × multiplicador, con el selector de velocidad
      repensado como multiplicador relativo — "⏱ Tiempo real (según FC
      del panel)"/2×/4×/8× más lento — en vez de una duración absoluta en
      segundos desconectada de cualquier FC) y un readout en vivo
      (`#cardio-wiggers-duracion-actual`, "≈ 800 ms/ciclo (FC 75 lpm)").
      El EDV compartido modula además, vía la propiedad CSS `scale`
      independiente (que compone con el `transform:scale()` ya animado por
      las `@keyframes` sin sustituirlo), un multiplicador 0,85-1,15 sobre
      el tamaño del ventrículo esquemático animado — un EDV alto se ve,
      en todo el ciclo, algo más grande. El demo del artefacto RVS ya no
      usa PAM/PAD hardcodeados (80/5 mmHg en el texto Y en la fórmula):
      lee `CicloEstado.pam/pad` en vivo, con su propia etiqueta
      actualizándose. Dos botones de "autorrelleno con un clic" completan
      la unificación sin forzar ataduras continuas que limitarían la
      exploración libre: "🔗 Usar el EDV del panel..." en el mini-diagrama
      de Laplace (mapea el EDV 70-160 mL a un radio ventricular
      ilustrativo 2,0-4,5 cm, el mismo rango ya citado en la nota de esa
      ficha, y posiciona el slider de radio ahí — el slider sigue
      libremente explorable después) y "🔗 Usar el GC calculado en Fick"
      en la calculadora RVS/RVP (GC = FC×VS de los campos de Fick).
    - **Optimización de rendimiento pedida explícitamente**: `irAFase()`
      (el stepper de fases del ciclo de Wiggers) hacía
      `container.querySelectorAll('*')` en cada clic — un recorrido
      completo del DOM del contenedor repetido en cada salto de fase.
      Como la estructura del diagrama es estática (no se crean/destruyen
      nodos tras el render inicial), se cachea la lista de nodos animados
      una sola vez en `initCicloCardiacoAnimado()` y se reutiliza en cada
      llamada a `aplicarFaseActual()`, eliminando el re-query repetido.
      De paso, se simplificó `calcFrankStarlingSimulador` (renombrada
      `renderFrankStarling`): el parámetro `origen` que distinguía
      "vengo del slider" vs. "vengo del campo mL" para decidir qué campo
      NO reescribir desapareció — ahora todos los campos que reflejan
      `CicloEstado.edv` comprueban `document.activeElement !== el` antes
      de reescribirse (no interrumpir al usuario a mitad de tecleo), un
      único criterio en vez de una rama de código por origen posible.
    - Verificado con Playwright: los 5 campos del panel se sincronizan en
      ambas direcciones con sus 3 contrapartes (Frank-Starling, FC de
      Fick, PAM/PAD de la calculadora RVS) — probado explícitamente en
      ambos sentidos (panel→widget y widget→panel); el multiplicador de
      EDV sobre el ventrículo (`--wiggers-edv-mult`) cambia de 1.150 a
      0.850 en los extremos del rango; el readout de duración de Wiggers
      recalcula correctamente al cambiar la FC (FC 120→"≈500 ms/ciclo",
      FC 60→"≈1000 ms/ciclo"); el bug de desincronía del stepper de fases
      corregido en la ronda anterior sigue protegido también en el NUEVO
      camino que no existía entonces (cambiar la FC del panel mientras
      hay una fase fijada, no solo cambiar el multiplicador de velocidad);
      los 2 botones de autorrelleno funcionan (EDV→radio de Laplace,
      GC de Fick→calculadora RVS); las 12 fichas de Cardiología y el resto
      de calculadoras (incluida la advertencia de PAD≥PAM) siguen sin
      error de consola ni 404 real; sin overflow horizontal del panel a
      390px de viewport. Bump de cache-busting (`?v=20260821-6`), 6º
      cambio de `components.css` en el mismo día.
  - **Prototipo del "mini ciclo"** — a petición explícita del usuario de
    empezar por "la opción ligera" para ver una pequeña mejora antes de
    decidir si merecía la pena un rediseño visual mayor (fusionar todas
    las calculadoras en un único panel de instrumentos, propuesta que se
    dejó explícitamente aparcada). Un componente reutilizable
    (`.mini-ciclo` en `components.css`) — una barra compacta de 3 tramos
    (sístole auricular 11,5%/sístole ventricular 37,5%/diástole
    ventricular 51%, proporciones reales de las fases A-G) con el mismo
    cursor sincronizado que la animación grande de Wiggers y una letra de
    fase (reutilizando tal cual las clases `.wiggers-fase-a`..`-g` ya
    existentes, sin CSS nuevo para eso) — pensado para incrustarse dentro
    de cualquier calculadora de la ficha como ancla de orientación ("en
    qué fase del ciclo estás ahora"). **Sincronización sin JS por
    instancia**: `actualizarDuracion()` e `irAFase()`
    (`initCicloCardiacoAnimado()`, `cardiologia.js`) ahora replican
    `--ciclo-duracion` y la clase `.paused` también en el contenedor raíz
    de toda la ficha (`#cardio-fisiologia-aplicada`, no solo en
    `#cardio-wiggers-anim`) — como las custom properties CSS heredan por
    el árbol del DOM, cualquier `.mini-ciclo` en cualquier punto de la
    ficha queda automáticamente sincronizado (duración, pausa) por pura
    herencia, sin tener que registrar cada instancia como listener de
    `CicloEstado` ni tocar JS al añadir una nueva. Primera instancia
    colocada en el simulador de Frank-Starling (justo antes del slider de
    precarga), a modo de prueba — pendiente de decidir con el usuario si
    se extiende a Fick/Laplace/RVS o se ajusta el diseño primero.
    Verificado con Playwright: el cursor avanza con el tiempo (dos
    lecturas de `left` distintas separadas 400ms), exactamente una letra
    de fase visible a la vez, se congela al pulsar pausa en la animación
    grande (dos lecturas de `left` idénticas tras pausar), la duración
    heredada cambia correctamente al modificar la FC del panel (FC
    150→"0.4s", coincide con 60/150), y sin overflow horizontal a 390px.
    Bump de cache-busting (`?v=20260821-7`), 7º cambio de
    `components.css` en el mismo día.
  - **Extensión del "mini ciclo" a Fick, Laplace y RVS/RVP**, a petición
    explícita del usuario tras aprobar el prototipo. 3 instancias nuevas
    (misma marcado que la de Frank-Starling, `cardiologia.html`): una
    justo antes del grid de la calculadora de Fick, otra antes del
    diagrama de Laplace (dentro del acordeón "Poscarga"), y otra antes
    del grid de la calculadora RVS/RVP — con un `title` propio en cada
    una aclarando qué implica ese momento del ciclo para esa calculadora
    en concreto (la tensión de Laplace es máxima en la eyección C-D; el
    GC/DO₂ de Fick y la RVS/RVP de la otra calculadora son promedios de
    todo el ciclo, no un valor de un instante). Total: 4 instancias en la
    ficha.
    - **Bug real de desincronía encontrado y corregido durante la propia
      verificación con Playwright, no al desplegar sin más**: los 2
      `.mini-ciclo` que viven dentro de un acordeón colapsado
      (Frank-Starling en "Precarga", Laplace en "Poscarga") mostraban una
      fase distinta a la de los otros 2 (siempre visibles, fuera de
      acordeón) — confirmado con una prueba que abría ambos acordeones
      con ~150 ms de diferencia y leía la fase visible en las 4 a la vez:
      2 mostraban "G", 1 mostraba "F". Causa: una animación CSS en un
      elemento `display:none` no corre, y al hacerse visible el navegador
      reinicia su propio reloj interno desde cero en vez de continuar
      desde el mismo punto que el cursor grande (que lleva corriendo
      desde la carga de la página) — pese a compartir la misma
      `--ciclo-duracion` heredada. Corregido con
      `sincronizarMiniCiclosConMaestro(scope)` (`cardiologia.js`): lee el
      `currentTime` real del cursor maestro vía Web Animations API
      (funciona tanto en marcha como pausado) y lo aplica a los
      `.mini-ciclo` del ámbito indicado. Se llama en 3 momentos:
      1) al cargar la página, para los mini-ciclo ya visibles (Fick/RVS);
      2) en un listener nuevo sobre cada `.micro-prof-head` de la ficha
      (`initMiniCiclosSync()`), que resincroniza el `.mini-ciclo` de un
      acordeón justo después de abrirlo; 3) dentro de `aplicarFaseActual()`
      —el motor del stepper ◀▶—, porque fijar una fase congela el diagrama
      grande pero, sin este aviso, los `.mini-ciclo` de otras secciones
      seguían su propio reloj hasta el instante exacto en que la clase
      `.paused` heredada los frenaba, quedando congelados en una fase
      distinta a la fijada.
    - Verificado con Playwright tras el arreglo: las 4 instancias
      muestran la misma letra de fase en el mismo instante (antes: 3
      "G" + 1 "F"; después: 4 "G"); tras fijar una fase con el stepper con
      ambos acordeones abiertos, las 4 instancias muestran exactamente la
      fase fijada (verificado con "D"); pausar/reanudar desde el botón
      principal sigue congelando/reanudando las 4 a la vez; sin overflow
      horizontal en ninguna de las 4 secciones a 420px; el resto de
      calculadoras y las 12 fichas de Cardiología sin regresiones ni
      error de consola real. Sin bump de cache-busting (solo cambió
      `cardiologia.html`/`cardiologia.js`, no `.css` ni `main.js`).
  - **Informe de bugs/mejoras de Cardiología y correcciones aplicadas**, a
    petición explícita del usuario ("haz un informe sobre mejoras... sobre
    puntos que están mal, y sobre fallos"). Auditoría de código (no de
    bibliografía esta vez) sobre `cardiologia.js`/`cardiologia.html`,
    verificando cada hallazgo con Playwright antes de reportarlo — mismo
    estándar que las auditorías anteriores, pero aplicado al código en vez
    de al contenido clínico. 2 bugs reales confirmados y corregidos:
    - **FC=0 o negativa en el panel/Fick rompía toda la animación**: a
      diferencia del EDV (clampado en sus 3 puntos de escritura desde la
      ronda de unificación), ningún campo de FC/PAM/PAD tenía ese mismo
      tratamiento — confirmado escribiendo FC=0: el readout mostraba
      literalmente "≈ Infinity ms/ciclo", `--ciclo-duracion` quedaba en
      `Infinitys` (CSS inválido) y el cursor grande y las 4 instancias del
      mini-ciclo perdían por completo su animación (`getAnimations()`
      vacío). Con FC negativa, duración negativa (igual de inválida).
      Corregido añadiendo `FC_MIN/MAX`, `PAM_MIN/MAX`, `PAD_MIN/MAX` y un
      helper `clamp()`, aplicado en los 6 puntos de escritura reales
      (panel×3, Fick FC, RVS/RVP PAM y PAD) con el mismo patrón ya usado
      para EDV: clamp inmediato + reescritura del propio campo si el valor
      tecleado difiere del clampado.
    A petición del usuario se aplicaron también las mejoras del informe,
    **excepto la de velocidad más rápida que tiempo real** (descartada
    explícitamente):
    - **La contractilidad ahora también modula la animación del
      ventrículo**, no solo la curva de Frank-Starling — 2 variantes
      nuevas de la keyframe `wiggers-ventriculo-vol` (`-aumentada` con un
      pozo sistólico más profundo, escala hasta 0,48 en vez de 0,6;
      `-disminuida` más superficial, hasta 0,75) activadas por clase desde
      `actualizarContractilidadVentriculo()`, registrada como listener de
      `CicloEstado` igual que `actualizarEscalaVentriculoPorEdv()`. Cambiar
      `animation-name` reinicia el timeline del elemento a 0% (se vería un
      salto a la fase A) — se corrige resincronizando de inmediato con el
      cursor maestro, reutilizando el mismo mecanismo ya construido para
      los mini-ciclo (extraído a un helper común `resincronizarConMaestro(el)`,
      del que `sincronizarMiniCiclosConMaestro()` ahora es un caso
      particular).
    - **Texto explicativo del mini-ciclo ahora siempre visible, no solo en
      `title`**: un `title` de hover nunca se ve en touch sin hover, y esta
      app es explícitamente "a pie de cama en el móvil". Sustituido el
      `title` del contenedor por un `<span class="mini-ciclo-caption">`
      como primer hijo (texto idéntico al que llevaba el `title`), con
      `flex-wrap:wrap` + `flex-basis:100%` para que ocupe su propia fila
      sin competir por espacio con la barra y la letra de fase en móvil.
    - **Botón "↺ Restaurar valores por defecto"** en el panel de control
      (FC 75/EDV 115/normal/PAM 80/PAD 5), para volver al punto de partida
      tras explorar varios escenarios sin tener que escribir los 5 campos
      a mano.
    Otros 2 puntos señalados en el informe se dejaron deliberadamente sin
    tocar por no ser accionables sin más fuente o sin romper la
    arquitectura ya establecida: la Ficha 6 (enfermedad coronaria) es la
    más corta del bloque porque su capítulo fuente son solo 4 páginas ya
    agotadas, y `cardiologia.html` es el archivo de contenido más grande
    de la app — dividirlo iría contra el patrón "un partial por categoría"
    ya asentado en el proyecto.
    Verificado con Playwright: FC=0 en el panel se autocorrige a 20 (el
    mínimo real ya usado como `min` del `<input>`) y la duración vuelve a
    "≈3000 ms/ciclo (FC 20 lpm)" en vez de "Infinity"; FC=-999 en el campo
    de Fick se clampa igual a 20; PAM=999 en la calculadora RVS se clampa
    a 180 y se refleja en el panel; el botón de reset devuelve los 5
    campos a 75/115/normal/80/5; el `scale` computado del ventrículo en
    fase E (ESV) es 0,6 en normal, 0,48 en aumentada y 0,75 en disminuida
    (confirmado leyendo la matriz de `transform` vía
    `getComputedStyle`); el caption del mini-ciclo tiene texto real en el
    DOM y el `title` del contenedor ya no existe; sin overflow horizontal
    a 360px en el panel ni en ninguna de las 4 instancias del mini-ciclo;
    la sincronización de las 4 instancias (incluida la del stepper de
    fases) y el resto de calculadoras de Cardiología siguen sin
    regresiones. Bump de cache-busting (`?v=20260821-8`), 8º cambio de
    `components.css` en el mismo día.
- **Cuarto bloque: "Inmunología"** (`js/modules/fisio-uci/inmunologia.html`).
  Fuente: El libro azul. Bases fisiopatológicas de la medicina crítica.
  Sección III, Sistema Inmunitario, capítulos 17-23 (130 páginas) — PDF
  subido en **2 archivos** por el tamaño de la sección
  (`docs/libro-azul-seccion-iii-inmunitario-parte1.pdf`, 60 págs., capítulos
  17-19; `docs/libro-azul-seccion-iii-inmunitario-parte2.pdf`, 74 págs.,
  capítulos 20-23, confirmado que el capítulo 23 es el último de la Sección
  III porque la página siguiente ya es la portada de la Sección IV "Aparato
  Respiratorio") — mismo patrón de offset independiente por archivo ya usado
  en Cardiología: Parte 1 con offset +252 (página impresa − página del PDF)
  y Parte 2 con offset +312, ambos verificados cruzando varias páginas antes
  de darlos por buenos. Cuarto botón del submenú de bloques
  (`#btn-fuci-inmunologia`), con `fisioUciLevel` (en `fisio-uci/index.js`)
  ganando una cuarta entrada (`inmunologia`) junto a
  `hematologia`/`viasUrinarias`/`cardiologia` — mismo patrón exacto, sin
  cambios de arquitectura.
  - **Auditoría de imágenes antes de construir nada**: `pdfimages -list`
    sobre ambos PDF (filtrando los logos de marca de agua repetidos,
    189×107) encontró solo 3 imágenes grandes reales: las 2 portadas de
    sección (Sección III y Sección IV, decorativas, sin contenido clínico) y
    una única figura de 1558×850 dentro del Capítulo 20 (página 15 de
    Parte2, Figura 4 "Excitación-contracción en sepsis") — verificada
    visualmente y confirmada como un **diagrama esquemático** (sarcolema,
    intercambiador Na⁺/Ca²⁺, SERCA/PLB, contracción), no una fotografía ni
    un registro diagnóstico real. Con esto, **Inmunología es el primer
    bloque de Fisiopatología UCI sin ninguna imagen extraída** — a
    diferencia de Hematología/Vías Urinarias/Cardiología (todos con al
    menos alguna fotografía/ecografía/angiografía real), aquí las ~15
    figuras del texto (curvas pro/antiinflamatorias, balanzas de
    homeostasis, flujogramas de señalización LPS-TLR4/NF-κB, diagramas de
    excitación-contracción, algoritmos diagnósticos) son en su totalidad
    esquemas/diagramas conceptuales, así que se recrearon íntegros como
    `.algo-flow`/`.data-table`/`.kv-row`/`.micro-prof-item` nativos, mismo
    criterio ya aplicado en el resto del proyecto de nunca incrustar como
    imagen lo que se puede reconstruir fielmente como texto/tabla.
  - **Cuaderno de campo de 13 fichas** (`#inmuno-corkboard`/
    `#panel-inmuno-tabs`, mismo `core/corkboard.js` de siempre),
    correspondencia capítulo→bloque de fichas según el volumen real de cada
    capítulo (2 fichas para los capítulos largos, 1 para los cortos):
    **Cap. 17 "El huésped crítico: mecanismos habituales de defensa"**
    (Holuigue Rodríguez GA, 26 págs.) → Ficha 1 (el modelo SIRS/CARS/PICS
    frente al SRIS clásico, Figura 1 —curva pro/antiinflamatoria con FOM
    precoz/muerte tardía—, Figura 2 —respuesta bifásica con/sin
    complicaciones—, reconocimiento del patógeno vía DAMP/PAMP/PRR con los
    3 tipos de receptores TLR/NLR/RLR) y Ficha 2 (citocinas pirogénicas
    TNF-α/IL-1β/IL-6/IL-12-IFN-γ/MIF/IL-8-MCP-1, complemento C3a/C4a/C5a,
    mediadores lipídicos vía fosfolipasa A2, radicales libres/deferoxamina,
    las 3 isoformas de la NOS, hipocalcemia/disfunción mitocondrial, y las
    terapias inmunomoduladoras — G-CSF/GM-CSF, IFN-γ, eje PD-1/PD-L1, IL-3/
    7/15, nervio vago/7nAChR, efecto Warburg, propanolol/oxandrolona/
    dronabinol, con la conclusión CARS/inmunoparálisis); **Cap. 18
    "Fisiopatología de la fiebre y las alteraciones en la temperatura
    corporal"** (Cortés López A, 23 págs.) → Ficha 3 (termorregulación
    normal —POA/OVLT—, medición de temperatura, variaciones fisiológicas
    del estudio de 148 sujetos, la distinción formal fiebre/hipertermia/
    hiperpirexia por set point, pirógenos exógenos/endógenos, la vía
    completa PGE2 de la Figura 1 recreada como `.algo-flow` de 5 pasos con
    los 2 puntos de bloqueo farmacológico distintos —antipiréticos vs.
    corticoides—, terapias anticitocina que enmascaran la fiebre, y las
    5 enfermedades autoinflamatorias) y Ficha 4 (golpe de calor/
    hipertiroidismo/atropina/MDMA como causas de hipertermia verdadera,
    tabla comparativa fiebre vs. hipertermia, hipertermia maligna
    —receptor de rianodina—/síndrome neuroléptico maligno/síndrome
    serotoninérgico como 3 síndromes específicos, mecanismos de los
    antipiréticos, y el tratamiento deliberadamente diferenciado
    fiebre-vs-hipertermia, mismo criterio de nunca mezclar ambos protocolos
    ya establecido en el resto de la app); **Cap. 19 "Fisiopatología de la
    sepsis"** (Gipis Saavedra AJ, solo 8 págs., el capítulo más corto de
    la sección) → Ficha 5, ficha única (epidemiología con los datos reales
    de Colombia —prevalencia 10,8%, mortalidad 33,6%—, hipoxia citopática
    mitocondrial, el endotelio como amplificador activo y no solo víctima,
    microcirculación con heterogeneidad del flujo capilar, inmunoparálisis
    con el estudio brasileño de HLA-DR —46% vs. 7% de mortalidad—, y
    apoptosis por vía extrínseca/caspasa-8 vs. intrínseca/mitocondrial con
    el patrón selectivo linfocitos-vs-neutrófilos y el GALT); **Cap. 20
    "Fisiopatología del corazón en sepsis"** (Romero Lamas R, el capítulo
    más extenso de la sección, con una lista de referencias muy larga) →
    Ficha 6 (el déficit energético miocárdico —70% del ATP normalmente de
    ácidos grasos, sin el incremento compensador de oxidación de glucosa
    que sí tiene la IC crónica—, Tabla 1 de factores de depresión
    miocárdica, la cascada completa LPS→LBP/CD14→TLR4→MyD88→IRAK-1/IRAK-4→
    TRAF-6→TAK1/TAB1/TAB2→IKK/NF-κB o JNK recreada como `.algo-flow` con
    2 ramas, disfunción por estimulación adrenérgica —ARB1 proapoptótico
    vs. ARB2 antiapoptótico, GRK2—, Tablas 2-3 de mecanismos) y Ficha 7
    (disfunción por inanición celular —Tablas 4-6, LpL/Angptl4/CD36/
    PPAR-RxR-TR-PGC1—, disfunción mitocondrial —levosimendán, catalasa,
    mitofagia/PARK2-Parkin, Tabla 7—, el ciclo completo de excitación-
    contracción con SERCA2/RyR/intercambiador Na⁺-Ca²⁺ y las 5 alteraciones
    de la Tabla 9, óxido nítrico/endotelina-1); **Cap. 21 "Encefalopatía
    séptica"** (Romero Carratalá M, Borges Sá M, Aranda Pérez M) → Ficha 8
    (terminología —"disfunción cerebral asociada a sepsis" con el delirio
    como subconjunto—, mortalidad escalonada por GCS 15→16%/13-14→20%/
    9-12→50%/3-8→63%, morbilidad a largo plazo del estudio de Iwashyna,
    la cascada fisiopatológica completa de la Figura 1 —vago/OVC→glía→BHE→
    neurotransmisores/apoptosis— recreada como `.algo-flow`, Tabla 1 de
    moléculas neurotóxicas) y Ficha 9 (clínica del delirio hiper/
    hipoactivo, CAM-UCI con sus 4 criterios y la regla 1+2+(3 o 4), ICDSC,
    neuroimagen/EEG con el espectro de gravedad theta→delta→trifásicas→
    epileptiforme→burst-suppression, Doppler transcraneal, biomarcadores
    S100β/NSE, y el tratamiento con dexmedetomidina/ventanas de sedación/
    medidas no farmacológicas); **Cap. 22 "Fisiopatogenia del choque
    séptico"** (Aranda Pérez M, Borges Sá M, Romero Carratalá M) → Ficha 10
    (evolución de las definiciones SRIS→Sepsis-3 con la Tabla 1 completa de
    diferencias, los 3 pilares SOFA/qSOFA/criterios de choque séptico,
    Figura 1 —sinopsis simplificada— y Figura 2 —balanza de homeostasis con
    PAI-1/TAFI/proteína C— recreadas como `.algo-flow`, y susceptibilidad
    genética con los polimorfismos TNF2/familia IL-1/IL-6 -174G/C) y Ficha
    11 (las 4 funciones del endotelio, Tabla 2 endotelio-sepsis, efecto
    procoagulante con la Figura 3 de activación de trombina, regulación del
    tono vasomotor —"endotelio aturdido"—, efecto proadhesivo con las 6
    moléculas de adhesión, Tabla 3, respuesta Th1/Th2 con el estudio
    INTERSEPT de anti-TNF, apoptosis/Tabla 4, disfunción cardiovascular con
    la Figura 4, y perspectivas futuras con la Figura 5 y el precedente ya
    documentado de la proteína C activada recombinante/Prowess-Shock); y
    **Cap. 23 "Monitorización de la función de los parénquimas en
    sepsis"** (Vázquez de Anda GF, Dávila Fernández JC, Delaye Aguilar MG,
    Mejía Pérez CI) → Ficha 12 (epidemiología de la S-DOM, los 3 mecanismos
    de disfunción orgánica múltiple —microcirculación/glucocálix,
    adaptación bioenergética/"oxígeno de conformidad", respuesta inmune—,
    afectación órgano por órgano —cerebro/corazón/pulmón/riñón/hígado/
    intestino-bazo/hematológico/metabólico-endocrino, cada uno como
    `.micro-prof-item`—, y la escala SOFA/qSOFA con sus cifras reales de
    sensibilidad/especificidad) y Ficha 13 (el biomarcador ideal, origen y
    cinética de la PCT desde el gen CALC-1, los 4 estudios reales citados
    —Muller/neumonía, Lipinska-Gediga/depuración, Azevedo/PCTd-vs-SOFA,
    Andriolo/Cochrane—, y el algoritmo triangular de la Figura 1).
  - **2 calculadoras y 1 selector explicativo** (`inmunologia.js`, mismo
    patrón `calcXxx()`/`.tfg-estado-ok/warn/danger` ya usado en el resto de
    la app, con el guard `.value === ''` ya establecido como lección
    aprendida en las auditorías de FRA/ERC para no tratar un campo vacío
    como 0): **calculadora qSOFA** (Ficha 12, 3 checkboxes puntuables →
    riesgo alto si ≥2/3, con las cifras reales de sensibilidad 55%/
    especificidad 84%); **intérprete de PCT** (Ficha 13, campo numérico
    ng/mL → banda del algoritmo triangular original de la Figura 1 del
    Capítulo 23, con su recomendación de antibiótico por tramo); y un
    **selector "¿fiebre o hipertermia?"** (Ficha 4, puramente explicativo,
    mismo patrón `wireSelectExplicacion` ya usado en Nefrología — 5
    escenarios clínicos que resuelven a fiebre/hipertermia maligna/
    síndrome neuroléptico maligno/síndrome serotoninérgico/golpe de calor,
    reforzando la distinción fisiopatológica central del bloque).
  - **104 preguntas de quiz** (`js/data/fisio-uci-inmunologia-preguntas.js`,
    `inmuno-q001`-`q104`, 8 por ficha × 13 fichas — 6 de opción múltiple + 2
    de tipo `redactar` por ficha, mismo formato ya establecido en el resto
    de bloques de Fisiopatología UCI, con varias preguntas de redactar
    planteadas como casos clínicos que aplican los mecanismos de la ficha).
    `triggerId: 'btn-fuci-inmuno-repasar'`, añadido al array que ya exporta
    `fisio-uci/index.js` junto a los otros 3 bloques — sin tocar
    `main.js`. El banco combinado de toda la app queda en
    <strong>1739 preguntas</strong> (1635 previas + 104 de este bloque).
  - **Bibliografía**: 7 entradas, una por capítulo, enlazando a
    `docs/libro-azul-seccion-iii-inmunitario-parte1.pdf#page=N` (capítulos
    17-19) o `docs/libro-azul-seccion-iii-inmunitario-parte2.pdf#page=N`
    (capítulos 20-23) según corresponda, con los offsets ya verificados
    (+252 / +312).
  - Verificado con Playwright: las 13 fichas abren/voltean sin error de
    consola ni 404 real (el único 404 es el `favicon.ico`, ya documentado
    como inocuo); la calculadora qSOFA puntúa correctamente (2 criterios
    marcados → 2/3, banda roja de alto riesgo); el intérprete de PCT
    clasifica bien ambos extremos (0,8 ng/mL → banda &gt;0,5, antibiótico
    altamente recomendado; 0,05 ng/mL → banda &lt;0,1, antibiótico
    altamente no recomendado) y se abstiene correctamente con el campo
    vacío sin tratarlo como 0; el selector fiebre/hipertermia devuelve la
    explicación correcta por escenario; el menú del quiz en 3 niveles
    muestra "Fisiopatología UCI (301)" → "Inmunología (104)" → las 13
    fichas con 8 preguntas cada una; sin overflow horizontal a 390px.
  - **Auditoría de contenido contra las 134 páginas del PDF fuente, a
    petición explícita del usuario** ("revisa la bibliografía que te he
    pasado de inmunología... busca errores, huecos de contenido, mejoras y
    cosas que se pueden poner de otra manera o que están mal o que falta
    contenido"). Se releyeron íntegros los 2 PDF (extraídos a texto con
    `pdftotext -layout`, ya que `pdfimages`/`pdftoppm` no estaban
    instalados en esta sesión — instalados con `apt-get install
    poppler-utils` antes de empezar) y se comparó frase a frase contra las
    13 fichas ya escritas, mismo método ya establecido en el resto del
    proyecto. A diferencia de auditorías anteriores (Nefrología/HTA/ERC/
    FRA/Cardiología), aquí se encontraron **errores reales de contenido
    sustituido**, no solo huecos — 3 tablas donde el contenido de la app
    no coincidía con el de la fuente, pese a llevar el mismo número/título
    de tabla:
    - **Ficha 2, entrada "MIF"**: la frase "contrarresta parcialmente el
      efecto antiinflamatorio de los corticosteroides" no aparece en
      ningún punto del Capítulo 17 (confirmado con `grep` sobre el texto
      completo) — contenido fabricado, aunque sea un hecho real conocido
      de otra literatura (el MIF fue descubierto precisamente por esa
      propiedad). Sustituido por el contenido real de la fuente: células
      productoras (epitelio pulmonar/renal, macrófagos, eosinófilos) y su
      valor pronóstico (mayor concentración plasmática = manifestaciones
      clínicas graves y mortalidad precoz).
    - **Ficha 6, Tabla 1** ("Factores asociados con depresión miocárdica"):
      la fuente tiene 7 filas distintas, pero la app había colapsado
      "Metabolismo alterado" y "Reducción de la producción de energía" en
      una sola fila "Metabolismo energético alterado" — separadas de
      vuelta en 2 filas.
    - **Ficha 6, Tabla 2** ("Mecanismos de disfunción cardíaca por
      estimulación adrenérgica"): el hallazgo más serio de la auditoría —
      el contenido de la app (desequilibrio ARB1/ARB2, vías Epac/PI3K/AKT,
      interacción NF-κB, toxicidad por catecolaminas exógenas) no
      corresponde a la Tabla 2 real del capítulo, que en realidad lista 6
      mecanismos distintos (reducción de densidad de receptores β1,
      desensibilización miocárdica, regulación a la baja de receptores β,
      autooxidación/ROS, aumento de GRK2, reducción de unión a arrestinas
      β) — sustituida por el contenido real.
    - **Ficha 8, Tabla 1** ("Moléculas neurotóxicas"): las 4 filas
      (TNF-α/IL-6/ON-EOR/AAA) estaban parafraseadas de forma que perdían
      mecanismos específicos reales de la fuente — corregidas con el
      mecanismo exacto de cada una: TNF-α (infiltración neutrofílica →
      apoptosis + edema, no solo "disfunción de BHE"), IL-6 (induce COX-2
      glial → PGE2 → eje hipotálamo-hipófisis-adrenal → fiebre y
      alteración del comportamiento, un mecanismo completo ausente hasta
      ahora), ON/EOR (inhiben la respiración mitocondrial → déficit
      energético neuronal + apoptosis) y AAA (origen por rabdomiólisis/
      hepatopatía, actúan como neurotransmisores falsos que reducen el
      aporte de glucosa en zonas serotoninérgicas/noradrenérgicas — no
      "compiten con precursores normales" como decía la versión anterior).
    - **Huecos de contenido reales, verificados contra el texto exacto
      antes de incorporarlos**: en la Ficha 3, el umbral práctico de
      O'Grady et al. (≥38,3°C para considerar febril a un adulto,
      ausente hasta ahora pese a ser la cifra de referencia más citada en
      la práctica), los cortes por hora del día del propio estudio de
      148 sujetos (&gt;37,2°C por la mañana / &gt;37,7°C por la tarde), el
      desplazamiento recto-oral (+0,6°C), el coste metabólico de la
      fiebre (+13% de consumo de O₂ por cada grado &gt;37°C, dato
      clínicamente relevante ausente por completo), el signo de Faget/
      disociación pulso-temperatura (+4,4 lpm por 1°C en sujetos sanos;
      bradicardia relativa en fiebre tifoidea/brucelosis/leptospirosis/
      fiebre facticia — un hallazgo semiológico clásico que no estaba en
      ningún punto de la app), el receptor EP-3 de la PGE2 (ratones
      knockout del gen no desarrollan fiebre) y el cAMP como segundo
      mensajero real corriente abajo de la PGE2 en las células gliales, y
      la lista completa de enfermedades autoinflamatorias (la fuente cita
      9, la app solo tenía 5 — añadidas enfermedad de Still juvenil,
      síndrome de hiper-IgD, síndrome autoinflamatorio familiar por frío,
      enfermedad autoinflamatoria multisistémica neonatal y síndrome de
      Blau). En la Ficha 4, el método práctico de enfriamiento activo
      (baños tibios ~20°C, nunca fríos, sin alcohol, evitar vía central
      con líquidos fríos). En la Ficha 5, la epidemiología por país estaba
      reducida a una frase vaga ("datos consistentes con series de
      Turquía...") sin ninguna cifra real — añadidas las cifras reales de
      Turquía (92% de mortalidad con al menos una disfunción orgánica),
      Brasil (46% comunitaria vs. 58% nosocomial) y México (16%/17% de
      prevalencia, 33,6% de mortalidad), más el detalle demográfico/
      etiológico de Colombia (edad media 54 años, predominio masculino,
      foco intraabdominal más frecuente). En la Ficha 6, la epidemiología
      de admisión a UCI por sepsis (~50% de los sépticos puede requerir
      UCI, ~10% de los ingresos a UCI son por sepsis — ausente por
      completo) y la evidencia experimental que conecta IRAK-1 con el
      déficit energético cardíaco (ratones IRAK-1 knockout no desarrollan
      el aumento de ácidos grasos libres/triglicéridos tras LPS letal y
      sobreviven más, más el experimento de Drosatos 2013 con rosiglitazona
      —agonista PPARγ— que previno la disfunción cardíaca pese a inflamación
      persistente). En la Ficha 8, el mecanismo de excitotoxicidad vía
      receptores AMPA/NMDA del glutamato (ausente del algo-flow original)
      y la nota de que LPS aislado en voluntarios sanos no basta para
      producir clínica de disfunción cerebral. En la Ficha 9, un paso
      intermedio ausente en la progresión EEG ("convulsiones
      electroencefalográficas" entre las descargas epileptiformes y el
      patrón de salva-supresión) y la correlación específica del Doppler
      transcraneal con la positividad de CAM-UCI independiente de edad/
      APACHE II (antes descrito de forma genérica como "marcador de
      autorregulación"), además de varias medidas no farmacológicas
      ausentes (prevención de úlceras por presión, incontinencia urinaria,
      corrección de visión/audición, entrenamiento del personal en
      desescalada, visitas familiares, educación familiar). En la Ficha 12,
      la <strong>tabla numérica completa de la escala SOFA</strong> (6
      sistemas × 5 niveles de puntuación con los cortes exactos de
      PaO₂/FiO₂, plaquetas, bilirrubina, PAM/vasopresores, Glasgow y
      creatinina/diuresis) — un hueco significativo, ya que hasta ahora la
      app solo describía la escala en prosa sin dar sus cortes reales,
      pese a ser la herramienta más citada de todo el bloque — y la cifra
      de que la encefalopatía séptica se asocia a un 70% de mortalidad. En
      la Ficha 13, los 2 estudios reales (Ruiz-Rodríguez et al. y
      Suberviola et al.) que acuñaron y validaron el término "depuración de
      PCT (PCTd)" con la misma fórmula ya citada, ausentes hasta ahora pese
      a que la fórmula ya estaba en la app sin atribuir a ningún estudio
      concreto.
    - Verificado con Playwright: las 13 fichas siguen abriendo/volteando
      sin error de consola ni 404 real; los 14 fragmentos de contenido
      nuevo/corregido se detectan correctamente en el DOM; la calculadora
      qSOFA (2/3 → alto riesgo) y el intérprete de PCT (0,8 ng/mL → banda
      &gt;0,5/antibiótico altamente recomendado) siguen funcionando sin
      regresiones; la nueva tabla numérica de SOFA no genera overflow
      horizontal a 390px (envuelta en su propio `overflow-x:auto`, mismo
      patrón ya usado en el resto de la app para tablas anchas).


## Wiggers legible en el móvil (30/10/2026, `wiggers-movil`)

- La animación de Wiggers (Cardiología → Fisiología cardíaca aplicada) tenía rótulos de 6 unidades en un dibujo de 320
  de ancho: en el móvil salían a 5-6 px. Ahora todo su texto va a 9,5 (fase en curso, 10) con la clase `.wiggers-svg`,
  y la letra real queda ≥ 8 px a 360 px.
- Para que no se pisen: el viewBox crece arriba (`0 -16 320 280`) y la nota del cruce aórtico va en una línea encima de
  la curva; los rótulos de presión van a la derecha, apilados; PVY, ECG y el rótulo de fase bajan 10 unidades en un
  `<g transform>` para que S1-S2 no toquen la onda v.
- La figura de interdependencia ventricular (`.interdep-svg`) también tenía letra de 6,6 px: 10,5 unidades y el pie en
  dos líneas.
- Los 30 px de desborde a 360 px eran la tabla del sistema de conducción: las 4 tablas de la ficha van ahora en
  `overflow-x:auto`.
- Juez `--ficha fisioUci:cardiologia:panel-cardio-tabs:cardio-fisiologia-aplicada` en verde a 390 y 360 px.
  Versión 20261030-13.
