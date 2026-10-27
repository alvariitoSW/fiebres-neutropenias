# Bitácora

La lleva la skill `/bitacora` (`.claude/skills/bitacora/SKILL.md`). Aquí está **lo que se quiere hacer y aún no está
aprobado**, lo que espera algo del usuario y lo hecho en la última semana. Lo aprobado vive en `TABLERO.md`, que es
lo único que trabaja el plan socialista. Lo hecho hace más de 7 días y lo descartado pasan a
`docs/historial/bitacora.md`.

Última sincronización: 2026-10-27, noche (2.ª): `encargo-revisado` (B-031) hecha en main; plan del paso 4 del `b3`
escrito, sin construir, esperando tu decisión.

---

## 1. Apuntado: espera tu visto bueno

Orden que propongo (de arriba abajo). Cada tarea pasa por las fases que dice; ver «Cómo se trabaja» al final de
esta sección.

### B-001 · Preguntas para estudiar en la app · apuntado 2026-10-14
- **Lo que dijiste**: «lo primero […] la tarea de preguntas está por hacer, sería la primera cosa».
- **Cómo lo entiendo**: tipo `visual`. Llevar la maqueta aprobada (`autonomo/modelos/preguntas-para-estudiar.html`) a
  la app: interruptor **Texto | Visual | Preguntas**, recorrido en orden, repaso de lo fallado, caso clínico, y los
  tres formatos (test con «piensa antes», piensa y destapa, encuentra el error). Primera ficha: trombocitopenia y
  HIT de Merino HEMATO, con las preguntas y el caso de la maqueta. Ampliando el quiz que ya hay, sin un segundo quiz
  ni mucho código. El encargo completo está en el tablero (Objetivo 0).
- **Depende de**: nada. **Todo lo demás depende de esta** (sin ella no hay dónde poner las preguntas nuevas).
- **Tamaño**: mediana (1-2 sesiones).

### B-002 · Atlas cap. 18 (insuficiencia mitral): la parte de estudio · apuntado 2026-10-14
- **Lo que dijiste**: «está bien como base de texto, no hace falta que lo rehagas, pero le falta la parte del
  profesor […] y la parte de las preguntas rehacerla».
- **Cómo lo entiendo**: tipo `estudio` **sobre la rama del piloto** (`auto/mr`, PR #2). El texto se queda (fase A ya
  hecha y auditada). Solo fase B:
  - el profesor diseña lo visual en el **ecógrafo** de la app: chorro en color hacia la AI, convergencia PISA,
    Doppler continuo y de venas pulmonares, VI y AI que se dilatan con la gravedad, PISA paso a paso; y quita la
    figura de tarjetas de números;
  - el texto se reorganiza para estudiar (idea arriba, tablas, resaltado);
  - las preguntas del capítulo se rehacen con el formato nuevo, con un caso de IM aguda frente a crónica (supongo).
  
  Encargo de `mr` en el tablero.
- **Depende de**: B-001 (para las preguntas).
- **Tamaño**: mediana. El ecógrafo aún no pinta el chorro regurgitante: hay que añadirlo al simulador, con pruebas.
- **Dudas**: la PR #2 se queda abierta y esta tarea la completa; no se abre otra.

### B-003 · Plan Marino (The ICU Book): revisar, mapa visual y estudio · apuntado 2026-10-14
- **Lo que dijiste**: «como ya está subida la fuente […] no haría falta construir nada […] el director que compruebe
  el contenido […] que contenga las imágenes […] trabajadores revisores en vez de constructores […] que revise un
  poco el código, cosas graves […] y el profesor, ese arte creativo […] montar algún modelo biológico […] apoyarse en
  la ecografía cardíaca […] ir por partes […] tú me vas pasando cosas y yo las reviso mientras sigues».
- **Comprobado ya (14/10)**: Marino **está centralizado en Libros → Marino**. El índice muestra las 17 secciones, los
  53 capítulos y los 3 apéndices (**ninguno falta**, 155 fichas), con su PDF y su página. Los capítulos 12-30 se
  abren desde ahí pero viven en otros sitios:
  - 12-13 en Merino HEMATO;
  - 14-21 en Merino Cardiología;
  - 22-30 en Merino Neumología.
  
  El resto vive en Libros. Ver la duda de abajo.
- **Cómo lo entiendo**: cinco fases, por partes pequeñas.
  1. **Revisar (tipo `revision`)**: no se construye nada. Tres revisores baratos a la vez:
     - **fuente**: ¿están todos los temas del capítulo, las cifras, las imágenes del PDF (y cargan), la bibliografía
       y las páginas?;
     - **código**: solo fallos graves y, como mucho, 3 simplificaciones seguras;
     - **móvil**.
     
     Se corrige solo lo grave. Cada revisor deja **ideas para la parte de estudio** en `autonomo/ideas/marino.md`.
     Son 13 trozos (155 fichas):

     | Trozo | Capítulos | Fichas |
     |---|---|---|
     | R1 | 1-6 | 13 |
     | R2 | 7-11 | 10 |
     | R3 | 12-13 | 6 |
     | R4 | 14-17 | 12 |
     | R5 | 18-21 | 12 |
     | R6 | 22-26 | 13 |
     | R7 | 27-30 | 10 |
     | R8 | 31-35 | 15 |
     | R9 | 36-38 | 8 |
     | R10 | 39-44 | 17 |
     | R11 | 45-47 | 14 |
     | R12 | 48-51 | 14 |
     | R13 | 52-53 y apéndices | 11 |
  2. **Mapa visual (tipo `mapa`, una tarea, profesor potente)**: con las ideas de los revisores y las imágenes del
     libro, el profesor hace de **director de arte**. Propone los **pocos modelos grandes** que explicarían casi todo
     Marino, en vez de una gráfica por ficha (supongo, a falta de su mapa):
     - el corazón, el ecógrafo y su atlas, más el motor del latido, para shock, corazón, fluidos y monitorización;
     - la nefrona viva para ácido-base, riñón y electrolitos;
     - quizá un modelo nuevo de pulmón con respirador para los caps. 22-30;
     - quizá uno de la coagulación para los caps. 12-13.
     
     Cada modelo nuevo te llega **como maqueta para que elijas**.
  3. **Preguntas en la app** (B-001): hace falta antes de la fase 5.
  4. **Construir los modelos elegidos**, por partes (son «algo tocho»): cada parte, su tarea y su propuesta.
  5. **Estudio por bloques de ~6 fichas** (tipo `estudio`): cada bloque usa su modelo grande, con texto para estudiar
     y preguntas nuevas con casos. Unas 26 tareas.
- **Cómo te llega**: en bucle, cada trozo acaba en su propia propuesta pequeña con «Ver en el móvil». Te aviso en el
  chat y **sigo con el siguiente sin esperarte**; tú lo miras cuando puedas y me dices «ok» o qué cambiar. Las
  revisiones sin nada grave no generan propuesta: solo el parte, con el resumen y las ideas. Al terminar cada fase,
  la apunto en «Hecho».
- **Depende de**: las fases 1 y 2, de nada. La 5, de B-001 y de los modelos que elijas.
- **Tamaño**: grande. La fase 1 es barata y rápida; lo caro es la 4.
- **Decidido (14/10)**: las fichas **se quedan donde están**; basta con que Libros → Marino las reúna. **3 tareas
  por sesión**; hasta 3 vueltas por tarea (una 4.ª solo si quedan más de 3 fallos). **Fase 1 aprobada** (en el
  tablero como Objetivo M). **Fase 2 aprobada el 15/10** (Objetivo M2, `marino-mapa`): empieza al terminar la fase 1.
  Las fases 3-5 esperan.
- **Decidido (17-19/10), sobre las maquetas de la fase 2**:
  - ácido-base: unir lo mejor de A, B y C en una sola herramienta;
  - el río y el mar es «sublime»;
  - el agua, en crema y oro;
  - antes de seguir, el profesor completa las maquetas y les añade la parte de estudio;
  - la parte de estudio se llama **Mayéutica** (interruptor Explorar | Conceptos | Mayéutica): ayuda a estudiar con
    preguntas, como Sócrates;
  - el color del HCO₃⁻ da igual, mientras se distinga de los demás iones;
  - cada herramienta vive en su apartado (el ácido-base, en Nefrología, junto a la nefrona viva), con un acceso
    rápido común (B-007).

### B-004 · El Libro Azul (Fisiopatología UCI): comprobar, estudio y completar · apuntado 2026-10-14
- **Lo que dijiste**: «y del libro azul de fisiopatología a la UCI, que me faltaría además subir el temario».
- **Cómo lo entiendo**: dos partes.
  - **Lo que ya está** (secciones I Cardiovascular, II Hematología, III Inmunitario y VII Vías Urinarias; ~33
    fichas): igual que B-003, con comprobación de fuentes y fase B. En la sección I, el motor del latido y el
    ecógrafo (supongo). Unas 6 tareas.
  - **Lo que falta**: secciones V, VI, VIII, IX y X ya en `docs/` (27/10); falta la IV (Respiratorio). Con sus PDF, cada sección hace las dos fases completas (leer
    la fuente, construir, auditar; después, estudio).
- **Depende de**: B-001. La segunda parte, de tus PDF.

### B-005 · PIF: comprobar, estudio y completar · apuntado 2026-10-14
- **Lo que dijiste**: «completar el PIF».
- **Cómo lo entiendo**: igual que B-004.
  - **Lo que ya está** (Hematología: citopenias, neutropenia febril, reconocimiento, síndromes urgentes, trasplante;
    Nefrología: fisiología, HTA, ERC, FRA, TRR, trasplante renal): comprobación de fuentes y fase B (supongo).
    Nefrología ya tiene la nefrona viva: el profesor la aprovecha.
  - **Las 7 rotaciones sin contenido** (Radiología de tórax, Neurorradiología, Cardiología, Medicina Interna,
    Infecciosas, Neurología, Neumología): las dos fases completas cuando mandes sus PDF.
  - **27/10, cambia**: «lo del pif no hay temario […] solo tengo las frases esas de conceptos que debo manejar y ya
    me busco la vida para aprender eso, que es el fin también de este repositorio». **No hay temario que esperar.**
    Lo que hay son los objetivos de cada rotación (ya en la app: `js/data/pif-rotaciones.js`, del documento
    PFI-UMI-R1-01). Nuevo enfoque: **cada objetivo es una pregunta de búsqueda**. Por rotación: (1) mirar qué
    cubren ya los libros de `docs/` (Marino, Merino, Manual UMI, El Libro Azul, guías ESC/AHA/ASE) y enlazarlo;
    (2) para lo que no cubran, buscar la fuente (guía de sociedad o revisión de acceso libre) y citarla con su
    página (CLAUDE.md §7.1-7.2); (3) construir el cuaderno de la rotación con las fases A y B. Primero Cardiología
    (rotación desde el 01/11): ya tiene «La alegría de leer el ECG», ESC 2023 de SCA, ESC 2019 de TSV, ESC 2023 de
    miocardiopatías, AHA 2025 y la ESC 2021 de estimulación en `docs/` (encaja con `pif-ecg`, ya `pendiente`).
    Las tareas del tablero que decían «falta el temario» (`g5-neuro`, `f4-recorridos`) pasan a este enfoque cuando
    apruebes B-005.
- **Depende de**: B-001 (las preguntas). Ya no de tus PDF.
- **Dudas**:
  1. ¿«Completar el PIF» incluía repasar lo que ya está (Hematología y Nefrología), o solo las 7 rotaciones?
  2. ¿La fuente que falte la busco yo (guías y revisiones libres, que tú revisas) o la buscas tú y me la mandas?
     (supongo: la busco yo, y si es de pago te la pido).
  3. ¿Empiezo por Cardiología por la fecha de la rotación? (supongo: sí).

### B-006 · Atlas de eco: los 20 capítulos que faltan · apuntado 2026-10-14
- **Lo que dijiste**: (aprobado antes como Objetivo 1; con el método nuevo, lo vuelvo a poner a tu visto bueno).
- **Cómo lo entiendo**: tipo `visual`, las dos fases por capítulo: traducción completa y auditada; después, estudio
  con el ecógrafo y el motor, y preguntas nuevas. Lista y «hecho» en el tablero (Objetivo 1).
- **Depende de**: B-001 y de cómo salga B-002 (es el mismo tipo de capítulo).
- **Tamaño**: grande, 20 tareas.

### B-007 · Acceso rápido a las herramientas grandes · apuntado 2026-10-19
- **Lo que dijiste**: «que viva en su apartado correspondiente, aunque si vamos a meter maquetas tochas como esta, la
  nefrona, la de eco cardíaca, ya pondremos un acceso rápido a todas ellas».
- **Cómo lo entiendo**: tipo `arreglo` (navegación). Cada herramienta grande sigue viviendo en su apartado. Además,
  hay **un solo sitio** para abrirlas todas de un toque:
  - nefrona viva y glomérulo (PIF Nefrología);
  - circulación viva y eco cardíaca;
  - escena del potasio;
  - ácido-base vivo y río y mar (fase 2 de Marino, cuando estén en la app);
  - y las que vengan, como el pulmón con respirador.
  
  Cada acceso lleva su nombre, una línea de qué enseña y su icono o miniatura. Abre la herramienta con el enlace
  cruzado de siempre (`data-especialidad`…), sin un listener nuevo. Dónde va el acceso (un botón en la raíz, una fila
  arriba de las puertas o dentro del buscador): **(supongo) un botón «Herramientas» en la raíz**, con maqueta antes
  para elegir.
- **Para qué**: llegar en un toque a los modelos que explican muchas fichas, sin recordar en qué especialidad viven.
- **Lo que NO quiero**: mover las herramientas de sitio ni duplicar su código.
- **Ya hay un primer paso** (19/10, PR #18): bloque «Modelos vivos» en los menús de Nefrología y de Libros, con el
  ácido-base vivo y el río y mar. Faltaría el acceso común desde la raíz y sumar la nefrona viva, el glomérulo, el
  potasio y la eco.
- **Depende de**: nada.
- **Tamaño**: pequeña.
- **Dudas**: dónde va el botón (se verá en la maqueta).

### B-008 · Modelos vivos que unen libros · apuntado 2026-10-20
- **Lo que dijiste**: «estas maquetas en vivo quizá no solo valgan para este libro ni para esto, sino que puedan valer
  para más cosas o más conceptos en el futuro, o interconectarlos, o a lo mejor que también te aparezca la sepsis en
  otro libro […] pero te añada algo más de concepto, pues que se pueda de esa manera integrar dentro del molde visual».
- **Cómo lo entiendo**: tipo `estudio`, a largo plazo. Ya desde el bloque 2, los modelos se construyen por concepto y
  cada estado guarda sus fuentes como lista (`REGLAS.md` §7.11). Cuando lleguen otros libros (El Libro Azul, PIF,
  Merino), cada uno añade sus estados o sus matices al modelo que ya existe, con su cita y su «Ver en la ficha», en
  vez de dibujar otro. Haría falta: un índice de modelos y estados por concepto (qué libro aporta qué), y en cada
  ficha de otro libro, su botón al estado del modelo.
- **21/10**: «pensarlos como si fueran unos mega proyectos… completarlos con el resto de contenido de la app (Manual
  UMI, Libro Azul, PIF, etc.)». Desde el bloque 3, cada modelo nuevo nace con su mapa de crecimiento (REGLAS §7.12);
  primeros: el corazón eléctrico, el receptor vivo y el monitor del shock con el soporte mecánico.
- **Espera**: tu visto bueno para empezar a llenarlos con las otras fuentes, cuando Marino esté terminado.

### B-028 · Eco: bibliografía de física de los ultrasonidos para el realismo de la imagen · apuntado 2026-10-27
- **Lo que dijiste**: «¿Debería subir bibliografía sobre la ecografía para mejorar el realismo de las imágenes?».
- **Cómo lo entiendo**: hoy el moteado, las sombras, la reverberación, la ganancia y el desenfoque del haz son
  «fisiología general» o «ilustrativo». Un libro de física de los ultrasonidos con figuras (p. ej. un manual de
  principios e instrumentación de la ecografía) daría cifras y página a esas decisiones. Lo que más falta, por orden:
  (1) ese libro; (2) Leung y Levine 1994 (opcional). **Ya en `docs/` (27/10, en `main`)**: ESC/ERS 2022 de HP (2
  partes), ESC 2021 de amiloidosis, MAPSE (Cirin 2024, Falconer 2025): llenan los huecos de la parada 3 de `eco-mega`
  (IE >1,1 de la HP, forma «amiloidosis», MAPSE), para una parada 4 cuando la apruebes.
- **Espera**: el libro de física, cuando quieras; no corre prisa.

### Cómo se trabaja (lo que haría el plan socialista con cada una)

| Fase | Quién | Para qué | Modelo |
|---|---|---|---|
| A completa (contenido nuevo) | lector de fuente → constructor → auditor ciego | el texto entero, fiel y con sus páginas | barato |
| A ligera (lo que ya está) | auditor ciego → (si hay algo grave) constructor | comprobar fuentes, cifras y bibliografía | barato |
| R (revisar lo ya construido) | auditor ciego + revisor de código + verificador, a la vez → (si hay algo grave) constructor | fuente, imágenes, código grave y móvil; ideas para el estudio | barato |
| Mapa (un libro entero) | profesor como director de arte | los pocos modelos grandes que lo explican; maquetas para que elijas | potente |
| B (estudio) | **profesor diseña** → constructor → verificador + auditor + **profesor juzga** | visual con los modelos grandes, texto para estudiar, recorrido de preguntas y casos | potente |
| Cierre | revisor → rama propia y propuesta (PR) en borrador con «Ver en el móvil» | que lo pruebes y apruebes | — |

- Si algo suspende (un juez en rojo, algo grave en las fuentes, una nota del profesor por debajo de 8 sobre 10; la meta, 8,75), vuelve al
  constructor. Como mucho 3 vueltas; si no, «necesita humano».
- **Una tarea por sesión.** Con `/plan-socialista` hace la siguiente del tablero; con `/loop /plan-socialista`
  encadena varias, hasta el límite del tablero. Nada se publica sin que apruebes su PR, y la próxima vez que abras
  `/bitacora` lo marca como hecho.

## 2. En marcha (ya en el tablero)

| Clave | Qué | Estado | Desde | Nota |
|---|---|---|---|---|
| `b1-*` | **Objetivo M5 · bloque 1** (caps. 1-11) | hecho el 20/10 | 2026-10-19 | |
| `b2` | **Bloque 2** (caps. 12-13) | hecho el 21/10 (PR #26) | 2026-10-20 | |
| `b3` | **Bloque 3** (caps. 14-30, con el pulmón con respirador) | paradas 1 y 2 **hechas y en main** (PR #32 y [#35](https://github.com/alvariitoSW/fiebres-neutropenias/pull/35), 27/10). **Paso 4: plan escrito, sin construir** (`autonomo/bloques/b3/plan-paso4.md`): 17 fichas en 6 grupos, 17 piezas nuevas, ≈35-40 M en 10-12 sesiones; espera tu decisión | 2026-10-21 | Ver «Dónde quedó el bloque 3» abajo |
| `reglas-b3p2` | Las 4 reglas de la parada 2 del `b3` (`.claude/`, una sesión por modelo, botones estables, maqueta a la app en dos encargos) | hecha (27/10, en main) | 2026-10-27 | aprobadas por el usuario el 27/10 |
| `encargo-revisado` | **B-031**, dos ideas de Spec Kit: revisar el encargo antes de gastar y lista de calidad del encargo (sin instalar Spec Kit) | hecha (27/10, en main) | 2026-10-27 | «vamos solamente con la B-031» (27/10) |
| `tee-inversa` | **Ingeniería inversa del simulador TEE** (anesthbeta) | ✅ elegido el 25/10: entra en el plan de integración | 2026-10-23 | Ver «Dónde quedó tee-inversa» abajo |
| `rea-*` | **Ingeniería inversa de EchoSuite, AngioView y NavRad** (B-009 a B-011) | ✅ elegido el 25/10: entra en el plan de integración | 2026-10-23 | Informe conjunto: https://claude.ai/artifact/T4WcxXWzjPGm911ShU3aiS |
| `rea-radiologyassistant`, `rea-ritmolab` | **Ingeniería inversa de Radiology Assistant y RitmoLab** | ✅ elegido el 25/10: entra en el plan de integración | 2026-10-23 | Informe: https://claude.ai/artifact/1GTkuwubZ22Hb9qu4PW4P5 |
| `rea-2` | **Segunda pasada de las 6 webs + NV-Reason-CT** (método v2): megaproyecto «La UCI en el bolsillo» | ✅ elegido el 25/10: entra en el plan de integración | 2026-10-25 | Pedido el 25/10: «un megaproyecto faraónico para incluirlas y poder usarlas en la vida real… como médico intensivista y para estudiar» |
| `radar`, `vuelta-modelos` | **B-012 y B-016** | hechas (PR #28 y #29, en main) | 2026-10-25 | |
| `eco-mega` | **B-015 · Megaproyecto de la eco** | paradas 1, 2 y 3 **hechas y en main** (PR #30 y #34, 27/10). Siguiente: informe `eco-calibra` (B-027 + B-029, aprobado el 27/10) | 2026-10-25 | Maqueta: https://claude.ai/artifact/DMwoT6wzupV4e48KNN2R4b |
| `inventario` | **B-014 · Inventario de estudio** | hecha (26/10, PR #31) | 2026-10-25 | Informe https://claude.ai/artifact/894zY7AfqYQC3QWP1Yjxir |
| `pif-ecg` … `f4-recorridos` | **Objetivo I · Integración** (rumbo del Radar del 25/10): fase 1, fase 0, G1-G6 y fases 2-4, 26 tareas | pasado al tablero el 27/10: 13 `pendiente`, 13 `aparcada` (esperan PDF o terminar Marino) | 2026-10-27 | «sí, pásalo al tablero» (27/10). Orden: fase 1 → fase 0 → G1 |
| `b3-paso4-opciones`, `eco-calibra`, `competencias-r` | **Objetivo P**: informes con gasto antes de construir: paso 4 del `b3` (todas las piezas o aligerar), **B-027 + B-029** (motor diastólico y HP crónica de la eco) y **B-032** (competencias por año) | pendiente | 2026-10-27 | «Apruebo que se empiece esto, pero antes hay que hacer su /plan-socialista con sus gastos y su informe» (27/10) |
| `pif-ecg` | Cuaderno «ECG y arritmias» del PIF de Cardiología (con «La alegría de leer el ECG») | en curso (sesión abierta el 27/10) | 2026-10-27 | Recomendado por la bitácora: la rotación empieza el 01/11 |
| `jueces-topes` | Jueces que llevan cada mando de un modelo vivo a su tope (REGLAS §1.14) | hecha (27/10, en main): 7 de 8 modelos ✅; el ácido-base da pH 6,36 (tarea `topes-acidobase`) | 2026-10-27 | Técnica: directo a main |
| `pulmon-respirador` | **B-013 · Pulmón con respirador** | aparcada hasta después del bloque 3 | 2026-10-25 | |
| `bandeja` | **B-017 · Bandeja del Radar** (issue #27 de GitHub) | ⏸ bandeja creada; la tarea diaria, **pausada**: hay que crearla desde la app con el proyecto elegido (texto en `autonomo/radar/LEEME.md`) | 2026-10-25 | Opción A elegida por el usuario: 0 €, sin Telegram ni clave de pago |
| `formula-comun`, `potasio-prioritario`, `objetivos-casos`, `eco-vci-retenido`, `monitor-comun` | **B-018 a B-022**, mecánicas nuevas en los modelos vivos (informe de `vuelta-modelos`) | Objetivo V: cuatro hechas y en main (25-27/10); `monitor-comun`, aparcada hasta el bloque 3 | 2026-10-25 | «me parece todo perfecto, estoy de acuerdo en lo que dice el profesor» (25/10) |
| `notas-meta` | **B-023**, llegar al 8,75 sin gastar de más (modelos, tokens y vueltas) | hecha (27/10, PR #33): R1-R9 aprobadas y en `REGLAS.md` §4.8; R1 automático, tarea `jueces-movil` | 2026-10-25 | «apruebo todas las propuestas de regla de R1 a R9» (27/10) |
| `jueces-movil` | Juez automático del móvil (R1 de `notas-meta`) | hecha (27/10, en main) | 2026-10-27 | Técnica: directo a main |
| `movil-existente`, `propuestas-movil` | Arreglar en el móvil lo que cazó el juez nuevo (8 modelos vivos y Marino · Fundamentos) y la pieza común `verFrase()` | hechas (27/10, en main) | 2026-10-27 | |
| `reglas-27-10` | Las 3 propuestas de ahorro y las 5 reglas de los partes del 27/10, a las reglas del plan; límite de gasto: 18 % del uso semanal al día | hecha (27/10, en main) | 2026-10-27 | Antes de la parada 2 del `b3` |
| `topes-acidobase` | Ácido-base vivo: el pH 6,36 con varios mandos a tope, arreglado en su origen | hecha (27/10, en main): era «Bicarbonato IV» + PaCO₂ 90; el modelo ya lo rechazaba, el aviso escribía el pH imposible | 2026-10-27 | |
| `fuentes-b3` | Buscar y citar lo que la ficha no dice en las maquetas del `b3` (balón, distractores, topes) | hecha en `auto/b3` (27/10); entra en main con la PR del bloque | 2026-10-27 | Quedan 4 PDF (ver «Esperando algo tuyo») |
| `rea-eco` | **B-024**, ingeniería inversa de las webs de eco para un corazón más real | hecha: elegido el 26/10 (A1-A3, B4, B5 y D1 a la parada 2 de `eco-mega`) | 2026-10-25 | «aprueba B-024» (25/10) |
| `eco-anatomia` | **B-025**, corazón real (anatomía, fisiología y patología): informe con Fable 5.1 + plan socialista con su gasto | ✅ elegido el 26/10: el núcleo entra en la parada 2 de `eco-mega` (P1 potente, pericardio de las aurículas más real, P7 como forma grave con nota); PDF de los huecos los busca el usuario · https://claude.ai/artifact/TooB2RJcrwkf9CoFiPyqBi | 2026-10-26 | Pedido directo del usuario (26/10): «habría que generar un informe con fable 5.1… y apuntarlo en /bitacora» |

### ⏸ Dónde quedó tee-inversa

- **Informe**: https://claude.ai/artifact/6N5ChQF3E82Ca7DoNqEfaU (parte `autonomo/partes/2026-10-23-tee-inversa.md`).
- **Cómo está hecho su simulador**: corazón 3D de anatomía fija (Human Reference Atlas, CC BY 4.0) con Three.js; el
  esófago es una curva por 7 puntos; sonda con 5 mandos (avance, giro, ante/retroflexión, flexión lateral, multiplano);
  28 vistas + 7 vasculares que viajan entre sí; imagen dibujada (no ecografía); válvulas en A1-P3 y cúspides; rótulos
  que no se pisan. Ellos ganan en ETE y anatomía del corte; nosotros, en ecografía, fisiología, Doppler y enfermedad.
- **Esperando tu elección**: paquete **A** (recomendado: colores de estructura, rótulos con enlace al 3D y viaje entre
  vistas, en la ETT), **B** (ETE medioesofágico y transgástrico con reto) y/o **C** (segmentos de válvula), o números
  sueltos del 1 al 7.

### ⏸ Dónde quedó el bloque 3 (para retomarlo en la próxima sesión)

- **Hecho y en `main`** (PR #32 y #35, fusionadas por ti el 27/10): las 26 fichas con sus páginas y la vista Visual;
  Texto | Estudiar en las 9 del shock; y los tres modelos vivos en Libros → Marino → Modelos vivos (shock con
  Impella, balón y ECMO; corazón eléctrico; receptor vivo), cada uno con su Mayéutica, su caso y su prueba. Se abren
  también desde las fichas de Merino Cardiología. Notas del profesor ≥8,75; auditoría, 0 graves.
- **Siguiente: paso 4**, estudio en las fichas (`/plan-socialista b3` en una sesión nueva, con el día a cero), y el
  pulmón con respirador. El 3A (9 fichas) ya tiene su Estudiar; faltan 17, en 6 grupos (plan del 27/10,
  `autonomo/bloques/b3/plan-paso4.md`, revisado con B-031: 6 graves corregidos en el plan). Después, `b3-bradi` (bradicardias y bloqueos, guía ya en `docs/`) y `b3-ritmo-motor`.
- **Huecos**: los topes del ritmo (2 bolos, 30 min, 3 vagales) y los cortes por clase del shock siguen
  «ilustrativo» (ninguna guía los da); el hueco del caso de Amparo (control del foco, p. 11).
- Documentos: `autonomo/bloques/b3/` (encargo, cobertura, listas R2, juicio-app-*, auditoria-app).

El resto del tablero sigue `aparcada`.

## 3. Esperando algo tuyo

- **🔴 Bloque 3, paso 4** (plan del 27/10, `autonomo/bloques/b3/plan-paso4.md`): es más grande de lo que parecía.
  Faltan 17 fichas y **17 piezas nuevas** en los modelos (vagal, FA en el motor, adrenalina en la RCP, posparo,
  rotura del papilar y del septo, IAM de VD, etapas de la IC, CPAP, placa coronaria, trombólisis, disección, TEP con
  lisis, TVP con eco de compresión…): **≈35-40 M en 10-12 sesiones**. ¿Se hacen todas, o alguna ficha se queda con
  un modelo que ya existe (más barato)? **27/10: primero un informe con las opciones y su gasto** (`b3-paso4-opciones`,
  Objetivo P del tablero); después eliges.

- **✅ Decidido el 26/10, B-026 · Culprit** (https://claude.ai/artifact/Y6ewAZfAk5cPewnsnNcsAw): opción 1. A (ficha «Del
  vaso a la derivación») y B (preguntas «predice el ECG» y «coloca el trombo») entran en la Fase 1, después de Marino;
  C (modelo vivo 2D) cuando el motor de la eco tenga las coronarias; D después de C. **Falta**: el PDF de la ESC 2023
  de SCA (Byrne, Eur Heart J 2023;44:3720-3826, doi:10.1093/eurheartj/ehad191). El ECG llegó el 27/10 (López Ramírez 2012). Ya en `docs/`: ESC 2023 de SCA (2 partes),
  de Winter 2008, CONFIRM 2015 (dominancia) y Tamura 2014 (aVR). También Wagner 2009 (AHA, territorios) y Thygesen
  2018 (definición universal): **A y B ya tienen fuente completa**. Opcional: suplemento de la ESC (figuras S2-S3). Pendiente de su respuesta: three.js (3D) y el repaso espaciado (4.ª excepción de `localStorage`).


- **Decidido el 19/10**: Marino primero, por bloques (Objetivo M5). B-002, B-004, B-005 y B-006 esperan a terminar
  Marino. B-001 (preguntas) se hace como la **Mayéutica** de cada ficha, bloque a bloque. B-007 sigue sin aprobar.
- **Optimizar los agentes del plan** (pedido del usuario el 19/10: más fluido, menos gasto, mejor trabajo): propuesta
  en el chat, esperando su visto bueno.
- **Regla sin respuesta**: que los jueces midan también las tablas que se salen de su tarjeta (no solo la página).
  Salió en R5. ¿La apruebas?

- **✅ Decidido el 26/10, «Un corazón más real»**: entran en la parada 2 de `eco-mega` A1, A2, A3, B4, B5 y D1 (sin
  PDF); la malla de Visible Human, solo como referencia de forma. Detalle en el tablero.
- **Los PDF de la ASE ya están en `docs/`** (Lang 2015, Hahn 2013, Mor-Avi 2011 y Mitchell 2019, 26/10): no hace
  falta abrir `asecho.org` ni Wikimedia. B1, B2, B3 y C1 entran (B2 en potente). La pared por regiones y el
  infarto (C2) esperan a las coronarias en el motor (decidido el 26/10).
- **🔴 Megaproyecto «La UCI en el bolsillo»** (https://claude.ai/artifact/6XfQibZ3H4NwgjUFMJhTdU): tres pisos (Guardia en 30 s · Paciente vivo · Escuela)
  sobre los cimientos de siempre; 6 situaciones de guardia con su tarjeta; NV-Reason-CT en tres usos (lista de
  hallazgos, compañera de estudio con casos abiertos, asistente de nivel 3). Nueva **fase G** dentro del plan aprobado:
  G1 shock (puede empezar ya: Manual UMI y VExUS en `docs/`), G2 inestable y paro (AHA 2025), G3 marcapasos/SCA,
  G4 tras el dispositivo, G5 neurocrítico, G6 ETE. Espera: ¿puerta «Guardia» nueva en la raíz?, ¿G1 tras la fase 0?,
  PDF, y abrir `huggingface.co` y `arxiv.org`.
- **✅ Decidido el 25/10** («estoy de acuerdo con todo»): el plan de integración, el megaproyecto «La UCI en el bolsillo»,
  la v3 de los 3 modelos del bloque 3, la puerta «Guardia», G1 tras la fase 0, tocar el motor y la anatomía, y B-012 a
  B-016. Detalle en `autonomo/TABLERO.md` («Encargos aprobados el 25/10/2026») y `docs/historial/radar.md`.
  **Siguiente: abrir una sesión nueva y lanzar `/plan-socialista` (etapa A).**
- **🔴 Bandeja del Radar**: crear la tarea diaria **desde la app de Claude** con el proyecto elegido (texto en
  `autonomo/radar/LEEME.md`); la creada desde la sesión no tenía el repositorio y está pausada.
- **🔴 Red del entorno** (todo gratis): `x.com`, `*.twitter.com`, `*.twimg.com`, `threadreaderapp.com` (leer tuits e
  hilos); `huggingface.co`, `arxiv.org` (NV-Reason-CT); `heart.org` (AHA 2025); `zenodo.org`,
  `*.cancerimagingarchive.net`, `*.radiopaedia.org`, `registry.opendata.aws` (licencias de casos de imagen).
- **🔴 PDF que hacen falta**, por urgencia: Leung y Levine 1994 (opcional) · caps. 34-36 del Libro Azul (Sección IV, pp. 565-608) (los temarios del PIF no
  existen: ver B-005). (La guía de amiloidosis y el MAPSE ya están en `docs/` desde el 27/10; el ECG, desde el 27/10,
  3.ª tanda.)
- **✅ PDF recibidos el 27/10 (3.ª tanda)**, en `docs/` (página impresa = página del PDF + desplazamiento):
  - `lopez-ramirez-2012-alegria-leer-ecg-parte1/2/3.pdf`: López Ramírez JH. *La alegría de leer el
    electrocardiograma*, 3.ª ed. Bogotá: Celsus; 2012 (ISBN 978-958-9327-44-9). Pp. 1-195; parte 1: PDF − 10 (pdf 20
    = p. 10); parte 2: PDF + 59 (pdf 20 = p. 79); parte 3: PDF + 127 (pdf 20 = p. 147). Lo mandaste como el ECG
    básico: `pif-ecg` pasa a `pendiente` (si no es el de la rotación, dilo y se busca el otro).
  - `esc-2019-taquicardias-supraventriculares.pdf`: Brugada J, Katritsis DG, et al. 2019 ESC Guidelines for the
    management of patients with supraventricular tachycardia. Eur Heart J 2020;41:655-720
    (doi:10.1093/eurheartj/ehz467). Página impresa = PDF + 654 (pdf 10 = 664; pdf 40 = 694). Hueco de `fuentes-b3`.
  - `esc-2023-miocardiopatias-parte1/2.pdf`: Arbelo E, Protonotarios A, et al. 2023 ESC Guidelines for the management
    of cardiomyopathies. Eur Heart J 2023;44:3503-3626 (doi:10.1093/eurheartj/ehad194). Parte 1: PDF + 3501 (pdf 1 es
    la portada del repositorio; pdf 10 = 3511, pdf 40 = 3541); parte 2: PDF + 3564 (pdf 10 = 3574, pdf 40 = 3604).
    Hueco de `fuentes-b3`; sirve también a `hcm` (obstrucción del TSVI).
  - `tamagnone-pocus-ecografia-critica-muestra-parte1/2/3.pdf`: **muestra**, no el libro entero, sin año impreso.
    Junta: *POCUS. Manual práctico de ultrasonografía crítica*, 2.ª ed. (Tamagnone, Previgliano, Merlo, Benay; Corpus):
    cap. 2 «Funciones del equipo / Knobología» y el principio del cap. 3 (parte 1, pdf 3-19; impresa = PDF + 32);
    *POCUS II. Ecocardiografía crítica* (Merlo, Tamagnone, Benay; ASARUC): cap. 1 introducción (pdf 22-24, impresa =
    PDF + 0), cap. 3 técnicas y cuantificación de cavidades (parte 1 pdf 26 → parte 2 pdf 5, p. 33-65; impresa parte 1
    = PDF + 8 (pdf 28 = 36), parte 2 = PDF + 60 (pdf 3 = 63)), cap. 11 eco en el weaning (parte 2 pdf 7-17, p. 183-194, impresa = PDF + 177: pdf 9 = 186, pdf 12 = 189) y
    cap. 13 valoración hemodinámica del shock séptico por ETT (parte 2 pdf 19-46, p. 201-229, impresa = PDF + 183: pdf 20 = 203, pdf 40 = 223);
    y ~12 artículos de Cheong, Tamagnone y cols. (2021-2022: TEP en prono con *speckle tracking*, carótida en la UCI,
    elevación pasiva de piernas con ITV del TSVD subcostal, ITV del TSVI subcostal modificado, ETT en prono COVID,
    absceso pulmonar, *heart point* y *lung point* en neumotórax, sinusitis maxilar, disección carotídea, ventana
    paraesternal transhepática derecha), cada uno con su propia paginación de revista. Entre medias, páginas de
    publicidad de cursos. **No estaba pedido** y no es el libro de física de B-028; útil para Eco cardíaca (cavidades,
    weaning, shock séptico) cuando se apruebe algo que lo use.
- **✅ PDF de la ASE 2025 (27/10)**, en `docs/`:
  - `nagueh-2025-funcion-diastolica-hfpef-ase.pdf` (J Am Soc Echocardiogr 2025;38:537-569; página impresa = página
    del PDF + 536). **Lo había pedido**: el «ASE 2025 diastólica» de la fase 3 (`f3-calc-eco`, `echosuite.md` §4.6).
    Además, el atlas cap. 10 lo cita 14 veces sin tener el PDF: ahora se puede cotejar.
  - `taub-2025-informe-eco-estandarizado-ase.pdf` (2025;38:735-774; página impresa = PDF + 734). **No estaba pedido**
    en ninguna lista, pero el atlas ya lo cita en los caps. de función sistólica y VD (`taub2025`), y sirve para la
    ficha «cómo leer un informe» y los avisos críticos de la fase 3.
- **✅ PDF recibidos el 27/10 (2.ª tanda)**, en `docs/` (página impresa = página del PDF + desplazamiento):
  - `mukherjee-2025-corazon-derecho-hp-ase.pdf` (J Am Soc Echocardiogr 2025;38:141-186; +140): la PAD con
    ventilación mecánica (`eat-q032`), las calculadoras del VD (`f3-calc-eco`) y el índice de excentricidad y el grosor
    de la pared del VD (huecos de la parada 3 de `eco-mega`).
  - `zoghbi-2017-insuficiencias-valvulares-ase.pdf` (2017;30:303-371; +302): IM de la parada 3 (P5) y `mr` del atlas.
  - `klein-2013-pericardio-multimodal-ase.pdf` (2013;26:965-1027; +964): cifras del pericardio y del taponamiento.
  - `aha-2025-parte9-soporte-vital-avanzado.pdf` (Circulation 2025;152(supl. 2):S538-S577; S = PDF + 537): paro,
    taquiarritmia y bradicardia con pulso, cardioversión. `g2-paro` pasa a `pendiente`. Con
    `aha-2025-novedades-rcp.pdf` (resumen de novedades, sin paginar como la revista).
  - **Di Mario 2005**: de pago (60 €), el usuario no lo manda. `f2-angio` y `g3-sca` buscarán otra fuente de acceso
    libre para las proyecciones, o lo marcarán como hueco.
- **✅ PDF de la guía de marcapasos**: ya en `docs/` (`esc-2021-estimulacion-cardiaca.pdf`, 26/10). `b3-bradi` pasa a
  `pendiente`.
- **Simulador de arritmias (idea de RitmoLab)**: los PDF de los algoritmos **AHA 2025** (bradicardia, taquicardia,
  parada y la guía completa); heart.org está bloqueado desde el entorno. Decidido: puerta propia en la raíz
  («Arritmias»), enlazada desde Cardiología del PIF. Fases: 1) monitor, 17 ritmos y modo Estudio; 2) casos; 3) 12
  derivaciones. Antes de construir, maqueta para elegir. Detalle en `docs/historial/cardiologia.md`.
- **El Libro Azul**: solo faltan los **caps. 34-36 de la Sección IV** (Respiratorio, pp. 565-608: la parte 2 acaba
  en la p. 564 con la bibliografía del cap. 33, y la Sección V empieza en la p. 609 con el cap. 37). Las IV (caps.
  24-33), V, VI, VIII, IX y X llegaron el 27/10 (abajo). Orden que pediste: Marino (hecho), después El Libro Azul y después el PIF
  de R1.
- **✅ El Libro Azul, 27/10 (4.ª tanda)**, en `docs/`. Fuente: *El libro azul. Bases fisiopatológicas de la medicina
  crítica* (Medicucheando). Página impresa = página del PDF + desplazamiento (comprobado en dos páginas de cada uno):
  - `libro-azul-seccion-v-digestivo-parte1.pdf`: caps. 37-39 (tracto GI, ictericia, hepática), pp. 609-690; +608
    (pdf 5 = 613, pdf 41 = 649).
  - `libro-azul-seccion-v-digestivo-parte2.pdf`: caps. 40-42 (pancreatitis, sangrado digestivo, HIA), pp. 691-722;
    +690 (pdf 1 = 691, pdf 16 = 706).
  - `libro-azul-seccion-v-digestivo-parte3.pdf`: caps. 43-44 (nutrición según la fisiopatología, monitorización
    nutricional), pp. 723-808; +722 (pdf 5 = 727, pdf 43 = 765).
  - `libro-azul-seccion-vi-endocrino.pdf`: cap. 45 (respuesta endocrina al estrés), pp. 807-814; +806 (pdf 5 = 811).
  - `libro-azul-seccion-viii-neurologia-parte1.pdf`: caps. 49-52 (HTIC, hipoxia tisular cerebral, isquemia, edema),
    pp. 859-920; +858 (pdf 5 = 863, pdf 31 = 889, pdf 62 = 920).
  - `libro-azul-seccion-viii-neurologia-parte2.pdf`: caps. 53-56 (estado epiléptico, hemorragia cerebral, TCE,
    neuromonitorización multimodal), pp. 921-970; +920 (pdf 5 = 925, pdf 25 = 945).
  - `libro-azul-seccion-ix-embarazo.pdf`: cap. 57 (trastornos hemorrágicos del embarazo), pp. 969-982; +968 (pdf 5 =
    973, pdf 14 = 982).
  - `libro-azul-seccion-x-miscelaneos.pdf`: caps. 58-61 (caquexia, RCP, control de daños, gran quemado),
    pp. 983-1044; +982 (pdf 5 = 987, pdf 31 = 1013, pdf 62 = 1044).
  - `libro-azul-seccion-iv-respiratorio-parte1.pdf`: caps. 24-29 (fisiología respiratoria, hipoxemia e
    hipercapnia, IRA, EPOC, SDRA, NAV), pp. 385-464; +384 (pdf 5 = 389, pdf 60 = 444, pdf 80 = 464).
  - `libro-azul-seccion-iv-respiratorio-parte2.pdf`: caps. 30-33 (diafragma, ventilación mecánica y sus modos, modos
    nuevos, monitorización respiratoria), pp. 465-564; +464 (pdf 1 = 465, pdf 30 = 494, pdf 60 = 524).
  Desbloquea la segunda parte de B-004 (secciones nuevas, cuando la apruebes).
- **PIF de R1**: ya no se espera ningún PDF de temario (27/10): ver B-005.
- **TRR**: el PDF de Valdenebro 2021, para cotejar las 7 dudas anotadas en `docs/historial/nefrologia.md`.
- **Panel de subida**: la clave de la API y desplegar el Worker (`backend/README.md`).
- **Velocidad del plan socialista**: hay propuestas (dos constructores a la vez, pruebas largas al final, los jueces a
  la vez desde la 1.ª vuelta; de ~2 h 45 a ~1-1 h 15 por capítulo). Tu decisión del 14/10: **todavía no**.
- **Eco, paradas 1 y 2 ya en main (27/10)**: mirarlas en el móvil (Eco cardíaca → simulador: A4C, subcostal,
  «Derrame» y «Hemorragia» a fondo, TEP, «Señálalo → Festones y cúspides»). La parada 3 (F3, F4, N1, P5, P6) espera
  los PDF de los huecos. Si tienes la **ASE 2025** en PDF, también daría la PAD con ventilación mecánica.
- **Propuesta tuya (26/10), para la skill del plan**: al terminar una tarea, el director cierra su propia sesión sin
  esperar a que la valides, y te llega un informe de las sesiones cerradas (qué se hizo, qué quedó, qué decidir).
  ¿La apunto como tarea?
- **Propuestas de regla de los partes (25-27/10)**, ¿las apruebas?
  - Simuladores con revisión por objetivos: su prueba recorre un camino incompleto y uno correcto (potasio).
  - Un modelo que pausa su animación fuera de la vista: su prueba lo pone a la vista antes de medir (fórmula común).
  - En `/ingenieria-reversa`, probar antes el acceso a cada web; si está cerrada, pedirte abrirla (rea-eco).
  - Una skill nueva pedida en una tarea aprobada va en la PR de esa tarea (Radar).
  - Las vueltas de arreglo de una maqueta, con el modelo barato (eco-mega; lo mide `notas-meta`).
  - Al pasar una maqueta a la app, probarla en la app real con toque a 390 px, al lado de la maqueta (eco-mega).
  - Cada encargo de forma de la eco entrega una captura de cada vista junto a la eco real (eco-mega, parada 2).
  - Dos constructores a la vez: la suite de pruebas solo con el árbol limpio o en su propia copia (eco-mega).
  - El enlace «Ver en el móvil» lleva el commit completo, no el nombre de la rama (el 27/10 viste «No se pudo cargar
    el simulador» por piezas viejas mezcladas).
  - Los avisos de «medida imposible» se rotulan «control de la app» y solo cubren lo que rompe la fórmula
    (eco-vci-retenido).
  - Las pruebas miden la posición de una caja justo al contestar, no después de centrarla; y avisar al constructor
    de los commits suyos ya hechos (objetivos-casos).
  - Al pausar por límite de uso, los apuntes de los agentes se copian al repositorio (b3).
  - ¿Guardar en `autonomo/` el script del inventario para repetirlo cada cierto tiempo? (inventario).
- **Propuesta de regla nueva** (`topes-acidobase`, 27/10): un aviso de tope no escribe la cifra imposible, sino el
  límite que se habría cruzado (o que el juez de topes distinga un aviso de rechazo de una cifra del paciente).
  ¿La apruebas?
- **2 PDF para cerrar los huecos del bloque 3** (`fuentes-b3`, 27/10): AHA 2020 de soporte vital (o ERC 2021) y el
  consenso SCAI 2015. Sin ellos, esos puntos quedan marcados como hueco. (La ESC 2019 de TSV y la ESC 2023 de
  miocardiopatías ya están en `docs/`, 27/10: los huecos que cubren se pueden citar ya.)
- **Rutina nocturna** (que el plan trabaje solo de madrugada, ~3:00 de Canarias, con aviso al móvil): **no montarla
  aún**; límite fijado el 27/10: como mucho el 18 % del uso semanal en un día (tablero).

## 4. Mejoras de lo que ya existe

- **Eco, lo que dejó la parada 3 de `eco-mega`** (27/10; detalle en `autonomo/bloques/eco-mega/profesor-p3.md` y
  `p3-*.md`). Coste medio, para una parada 4 o un arreglo: (1) que el pliegue de la AD/VD del taponamiento se vea a
  390 px (frase viva, flecha o un modo M por la pared libre); (2) el índice de excentricidad en los criterios de la HP
  crónica; (3) el espectral de la IM continuo; (4) la válvula de Eustaquio casi no se ve (el plano `scVci` no pasa
  por el orificio de la VCI); (5) la «grasa del surco AV» tapa el seno coronario en el PLAX; (6) en el TEP el IE es
  igual en diástole y en sístole (debería ser algo mayor en sístole); (7) la FE del VD del TEP grave es 9-13 % con
  VTD del VD 200-330 mL; (8) el saco del derrame grande aún tiene un tramo recto largo en la pared inferior; (9) con
  el derrame a fondo, el botón de fase salta de E a A (no salen F ni G); (10) el TAPSE usa una curva ilustrativa.

- **Que cada versión nueva descargue todas sus piezas a la vez.** El 19/10, tras publicar los modelos vivos (PR #18),
  la app no arrancaba en el móvil del usuario: la portada se veía, pero tocar PIF no hacía nada. Se arregló sola al
  publicar la siguiente versión. Lo más probable es que el navegador mezclara piezas guardadas de la versión
  anterior con piezas nuevas: solo `main.js` y el CSS llevan `?v=`, el resto de módulos no.
  - Ya hecho: el arranque no se cae entero si falla una pieza, y sale un aviso rojo que dice cuál
    (`js/core/aviso-arranque.js`, y `diagnostico.html` para comprobarlo en el móvil).
  - Hecho el 20/10: todas las piezas llevan la versión (`autonomo/version.mjs`, lección 7 del bloque 1).

- **Ácido-base vivo, al entrar desde una ficha**: durante la animación (unos 3 s) la cabecera mini dice «paso 0»
  antes de pasar al estado (p. ej. «Vómitos»). Que diga el estado desde el principio.
- **La Mayéutica, al recargar**, empieza otra vez en la pregunta 1: recuerda aciertos y fallos, pero no por dónde ibas.
- **Una sola Mayéutica**: el río y mar, el capilar y el catéter tienen cada uno su propio motor de preguntas. Pasarlos a
  `core/mayeutica.js` (la pieza de las fichas) para que todos se comporten igual.
- **Dos detalles de las fichas de Marino**: `mar-resumen-cateteres` traduce «go-to catheters» como «de último recurso»
  (p. 11; pide nota de fidelidad), y el lorazepam dice «>0,1 mg/kg/h» donde el PDF (p. 26) dice «≥0,1».

- **Rótulos que pisan una línea del dibujo** (el juez de rótulos solo compara texto con texto; vistos al arreglar los
  12 fallos de forma, 20/10): en la inmersión (Conceptos), el anillo del medallón corta «la cara · Tabla 6.1» y roza
  «BPS 9», y con mar agitado la ola cruza «alerta y tranquilo · óptimo»; en el ácido-base (vómitos), la estela y la
  recta de compensación cruzan «alcalosis metabólica». Propuesta: que el juez C mire también el choque con trazos.

- **Ácido-base vivo con las piezas comunes**: «Ver en la ficha» (`core/citas.js`), explicación guiada en sus 24
  estados y el motor común de Mayéutica. Hoy tiene su propio motor y su propio guardado (`acidobase-vivo-v1`): pasarlo
  sin perder el progreso guardado obliga a rehacer parte del módulo (1.858 líneas).

- **Hiperpotasemia (PIF Nefrología)**: la ficha `fisio-hiperpotasemia` resume la Fig. 9 como «>8 → arritmias
  ventriculares»; De Sequera (p. 21) dice que por encima de 8 el QRS se funde con la T en una onda sinuosa y que con
  cualquier potasio puede haber arritmias fatales. Visto al hacer el corazón eléctrico (21/10); corregir con su página.

- **Reconvertir las preguntas viejas** al formato de estudio (`REGLAS.md` §8): hay **361 de redactar** entre ~2.600
  preguntas. **Cuando lo pidas** (lo dijiste el 14/10), por bloques, con tareas `estudio`.
- **Prueba intermitente del simulador de eco**: `navegador.test.mjs`, «la barra del ciclo tiene las 7 fases», falla
  a veces con el ordenador cargado. Endurecerla.
- **Eco cardíaca fuera del atlas**: calibrar la RVS, medir los fps en el móvil, más formas de enfermedad
  (`js/modules/eco/README.md`, «Pendiente»).

- **Visto de paso (25-26/10)**:
  - Potasio: el K⁺ del modelo no baja de 3,5 (ya avisa, pero el suelo sigue); la ficha no dice si repetir el calcio
    (hueco de fuente).
  - Capilar y río y mar: el renglón de la fórmula queda bajo el tablero; con la hoja de mandos abierta hay que bajar.
  - Eco: la torsión (~7°) y el engrosamiento (+44 %) del corazón no tienen fuente; el README cita Lang 2015 sin el
    PDF en `docs/`.
  - Eco: con 1 L de hemorragia, en sístole la cavidad del eje corto no llega a cerrarse (es el motor; revisar con
    Marino caps. 14-17 si se quiere el «beso» de los papilares).
  - Eco: con «Mandos de imagen» cerrado, «Señálalo» no se ve. Inofensivo.

- **Visto de paso (26-27/10)**:
  - Neutropenia febril: `tab-clinica` y `tab-micro` (tratamiento dirigido) son pestañas sin tarjeta (inventario).
  - Telar: que los agregados salgan ya en la consecuencia del paso 3; vaso: ver la microangiopatía antes de
    transfundir (objetivos-casos, opcional del profesor).
  - VCI con ventilación: el Manual UMI tiene dos filas que dan veredictos opuestos con los mismos diámetros y no dice
    cuál manda (lo explica `umi-q068b`).
  - Bloque 3, para cuando pase a la app: la cobertura del pulmón da PBW 50 para Eulalia y la Tabla 24.5 da 54; el dock
    plegado necesita dos toques y «Siguiente/Hecho» se sale a 360 px; la caja ART del receptor recorta «mmHg»; las
    citas del pulmón apuntan a ids `nep-*` que aún no existen; la adenosina tarda 0,4 s en reactivarse.

- **Visto de paso (27/10, tarde)**:
  - Cardiología `mc-vasopresores`: rótulos de 7,4-7,6 px en «Membrana celular con los receptores». Las piezas comunes
    `bolsa.js` y `particulas.js` pintan algunos rótulos justos: un suelo de letra en ellas lo arreglaría para todos.
  - Receptor: la ficha de fármacos (`receptor-vivo-data.js`) repite tres afirmaciones sin cita.
  - Balón: el juez no comprueba que «Compruébalo» deje marcado el botón de temporización correcto.
  - `comun/monitor.js` pinta una R doble al rellenar la pantalla (la consola la filtra); `may-prueba.mjs b3-shock` se
    atasca en la primera pregunta (prueba desfasada).
  - Respirador: subir la PEEP de 0 a 20 de golpe da un volumen de 100 mL unos 35 s; la PVC del shock sigue recortada
    a PCP − 1 en el soporte (recorte, no causa); `pagina.js` del shock ya tiene 697 líneas.

- **Visto de paso (27/10, noche)**:
  - Ácido-base: al rechazar un mando, vuelve a su valor anterior en vez de quedarse en el último valor posible
    (p. ej. PaCO₂ 33 con HCO₃⁻ 5).
  - Corazón eléctrico: la TV de Hugo cede siempre al primer choque; el sello «nunca 360 J» solo se ve forzando el
    contador.
  - Receptor: su explicación guiada es copia de la maqueta, no la pieza común `core/explicacion-guiada.js`.
  - Shock: «Siguiente» se ve antes de «Compruébalo» (es del motor común de la Mayéutica: afecta a todos).

## 5. 💡 Lo que yo propondría (no lo has pedido tú)

- **Ahorro · Contar las piezas en el código, no en la cobertura** (propuesto 2026-10-27 por /ahorro) · Visto en: eco-mega parada 3 (+70 %, 5,2 M de piezas que salieron en marcha) y b3 plan del paso 4 (la revisión del encargo pasó de 6 a 17 piezas: estimado de 22-26 M a 35-40 M) · Cambio: antes de estimar una parada o un paso, el director saca con `node -e` las claves de estado que ya tiene cada modelo y las cruza con lo que pide la cobertura; la lista de lo que falta va al encargo y al revisor del encargo (que así no relee los archivos de datos: 115 % de su presupuesto hoy) · Ahorro esperado: evita paradas que se alargan un 50-70 % sin aviso (1-5 M por parada) y ~0,05 M en cada revisión del encargo.
- (26/10, sigue en pie: toca ahora, en el paso 4) **Las preguntas viejas del bloque 3, a la vez.** Merino Cardiología (48) y Neumología (46) son los bancos con
  más preguntas «de redactar» (`js/data/merino-*-preguntas.js`) y son justo las fichas del bloque 3: reconvertirlas en
  la misma tanda evita tocar esas fichas dos veces.
- (23/10) Las dos propuestas que había (pulmón con respirador e inventario de estudio) te gustaron y pasan a
  «Apuntado» como B-013 y B-014.

## 6. Hecho (últimos 7 días)

- 2026-10-27 · **Revisar el encargo antes de gastar** (`encargo-revisado`, B-031, en main): cada tarea empieza con
  una revisión corta del encargo; `/bitacora` pasa una lista de calidad y te hace como mucho 5 preguntas.

- 2026-10-27 · **Bloque 3, parada 2** (`b3`, PR #35, en main): shock, corazón eléctrico y receptor ya son modelos
  vivos de la app, con Mayéutica y caso; los errores de temporización del balón, con fuente (Gillespie 2024).
  Profesor ≥8,75; auditor, 0 graves.
- 2026-10-27 · **Ácido-base, el pH 6,36** (`topes-acidobase`, en main): el aviso ya no escribe la cifra imposible.
- 2026-10-27 · **Reglas de la parada 2** (`reglas-b3p2`, en main): una sesión por modelo, botones estables, maqueta a
  la app en dos encargos, qué se puede tocar en `.claude/`.

- 2026-10-27 · **Jueces nuevos** (`jueces-topes` y `jueces-movil`, en main): cada mando de un modelo vivo, a su tope;
  y el móvil a 390 y 360 px (frase tapada, cortada, rótulos pequeños).
- 2026-10-27 · **Lo ya construido, arreglado en el móvil** (`movil-existente` y `propuestas-movil`, en main): 8 modelos
  vivos y Marino · Fundamentos en verde; pieza común `verFrase()`.
- 2026-10-27 · **Bloque 3: pantallas como las reales** (respirador y consola del balón, 8,7) y **fuentes buscadas**
  (`fuentes-b3`, temporización del balón con figura): maquetas en `main`, fichas en `auto/b3`.

- 2026-10-27 · **Eco, parada 3** (`eco-mega`, B-015, PR #34, en main): saco y colapso del taponamiento, tricúspide,
  HP crónica, AI dilatada con chorro de IM, venas pulmonares, fosa oval y TAPSE posible. Profesor 8,5-8,7; auditor
  0 graves. Pendiente: B-027 y B-029.
- 2026-10-27 · **Eco, paradas 1 y 2** (`eco-mega`, B-015, PR #30, en main): imagen realista con mandos de imagen y
  «Señálalo»; corazón con aurículas y tabique, pericardio, festones y cúspides, derrame, hemorragia y TEP.
  Profesor 8,1-8,4; auditor, 0 graves.
- 2026-10-27 · **VCI «retenida» con ventilación** (`eco-vci-retenido`, B-021, en main): Manual UMI → FATE.
- 2026-10-26 · **Casos con revisión por objetivos** (`objetivos-casos`, B-020, en main): inmersión, muralla, telar y
  vaso.
- 2026-10-26 · **Inventario de estudio** (`inventario`, B-014, PR #31): qué tiene cada una de las ~724 fichas.
- 2026-10-26 · **Bloque 3: maquetas v3 y topes de paciente real** (`b3`, PR #32, en main el 27/10).

- 2026-10-26 · **Radar** (`radar`, B-012, PR #28): norte, hoja de ruta única, fichas de triaje y skill `/radar`.
- 2026-10-25 · **Potasio, mecanismo prioritario** (`potasio-prioritario`, B-019, en main): el calcio protege, la
  insulina y el salbutamol meten, solo el riñón, las resinas o la diálisis sacan; al acabar el reloj, revisión por
  objetivos.
- 2026-10-25 · **«La fórmula con tus números»** (`formula-comun`, B-018, en main): capilar, río y mar, glomérulo,
  filtro de la TRR y eco (GC por ITV).
- 2026-10-25 · **Informe «Un corazón más real»** (`rea-eco`, B-024): https://claude.ai/artifact/LPr9m96QTCK7D53wJ4vkcg.
  Espera tu elección.

- 2026-10-25 · **Vuelta por los modelos vivos** (`vuelta-modelos`, PR #29): qué mecánica nueva encaja en cada uno de
  los 14. Informe https://claude.ai/artifact/5hpTv7763RnZUPt9hwMycW. Aprobadas sus 5 mejoras (B-018 a B-022). La app no
  cambió.
- 2026-10-25 · **Plan socialista más barato**: contador de gasto de tokens por tarea y por agente, y cuatro reglas de
  ahorro (una tarea o parada por sesión, encargos de una pieza con tope de ~100 pasos, modelo potente solo para lo
  nuevo, lecturas acotadas de REGLAS). Aprobadas B-012 a B-017 y el megaproyecto «La UCI en el bolsillo». La app no
  cambió.

- 2026-10-23 · **Ingeniería inversa de 6 simuladores** (anesthbeta, EchoSuite, AngioView, NavRad con imagen,
  Radiology Assistant, RitmoLab): 5 informes y el **informe final «Del simulador a la cama»**
  (https://claude.ai/artifact/3hnNvcEsvsotfViShnXLee). Skill nueva `/ingenieria-reversa` y 8 skills de terceros
  (`claim-check`, `sr-screening` y 6 de research-agent-skills). Memoria del día en `docs/historial/radar.md`. La app
  no cambió.

- 2026-10-20 · **«La cama 7» en la app** (PR #23) y **motor calibrado** (PR #22), aprobados y en main.
  - Muralla, telar e inmersión en Libros → Marino → Modelos vivos, con la misma cama y desde sus 5 fichas.
  - 11 formas nuevas en la tabla única. Si un modelo vivo falla, el resto de Libros sigue funcionando.
  - PVC normal 4,2 mmHg; elevación de piernas en la hemorragia +20 %.

- 2026-10-20 · **Marino, bloque 1 en modelos vivos** (PR #19, #20 y #21), aprobados y en main.
  - Mayéutica en las 23 fichas de Fundamentos (botón Texto | Visual | Mayéutica).
  - Capilar y oxígeno, y catéter vivo, en Libros → Marino → Modelos vivos y desde las fichas.
  - El motor del corazón lee Guyton, la elevación de piernas, el bolo, el catéter de AP y la termodilución.
  - Auditados con el PDF: 9 graves corregidos (ninguno de dosis).
