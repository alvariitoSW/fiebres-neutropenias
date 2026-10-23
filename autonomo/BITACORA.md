# Bitácora

La lleva la skill `/bitacora` (`.claude/skills/bitacora/SKILL.md`). Aquí está **lo que se quiere hacer y aún no está
aprobado**, lo que espera algo del usuario y lo hecho en la última semana. Lo aprobado vive en `TABLERO.md`, que es
lo único que trabaja el plan socialista. Lo hecho hace más de 7 días y lo descartado pasan a
`docs/historial/bitacora.md`.

Última sincronización: 2026-10-23 (tee-inversa, fase 1: informe-propuesta; tres webs nuevas apuntadas para ingeniería inversa).

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
  - **Lo que falta**: cuando mandes los PDF del resto del temario, cada sección hace las dos fases completas (leer
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
- **Depende de**: B-001. Las rotaciones nuevas, de tus PDF.
- **Dudas**: ¿«completar el PIF» incluía repasar lo que ya está (Hematología y Nefrología), o solo las 7 rotaciones?

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

### B-012 · Radar: integrar webs, repositorios, Twitter e ideas con un plan sólido · apuntado 2026-10-23
- **Lo que dijiste**: «integrar estas y futuras páginas/repositorios/lo que vea en tuiter/lo que se me ocurra y de ahí
  desarrollar el proyecto bien con un plan sólido y sobre todo teniendo en cuenta lo que realmente se quiere conseguir».
- **Cómo lo entiendo**: un **proyecto permanente** (no una tarea que se acaba) con dos partes: un **norte** que no
  cambia y un **radar** por el que entra todo lo nuevo. Nada se construye porque «está chulo»: solo si acerca al norte.
  1. **El norte** (borrador, **(supongo)**; lo decides tú): «Que un R1 de UCI entienda y maneje al paciente crítico:
     en la cama, la respuesta en 30 segundos desde el móvil; para estudiar, el mecanismo que se ve y preguntas que
     obligan a pensar; todo fiel a su fuente con página, en español, sin cuenta ni servidor». De él salen las
     **situaciones de guardia** del informe final (shock, dolor torácico, arritmia inestable, comprobar un
     dispositivo, neurocrítico, quirófano cardíaco), que son la vara de medir.
  2. **Una sola puerta de entrada**: me pasas una web, un repositorio, un tuit o una idea, y queda apuntado en un
     registro (`autonomo/radar/`) con la fecha, lo que dijiste y el tipo. **(supongo)** una skill `/radar` que lo
     haga, o que `/bitacora apunta` lo mande allí.
  3. **Triaje con una ficha fija** para cada entrada: qué es; a qué situación de guardia, ficha o modelo vivo sirve;
     qué fuente lo respalda; licencia; coste; si encaja en una fase ya existente. Veredicto: **integrar en la fase N**,
     **idea suelta** (se guarda) o **descartar** (con motivo).
  4. **Cómo se estudia cada tipo**:
     - una web o una app → `/ingenieria-reversa` (como hoy);
     - un repositorio → leerlo, comprobar la licencia y, si es una herramienta, revisarla antes de instalarla (como
       las skills de hoy);
     - un tuit → no es fuente: se extrae la idea y se busca la fuente primaria con `claim-check` o `paper-lookup`;
     - una idea tuya → se convierte en ficha de encargo, con las preguntas mínimas.
  5. **Una hoja de ruta viva**: la del informe final «Del simulador a la cama» (fases 0-4) pasa a ser el documento
     único. Cada entrada nueva se encaja en una fase (o abre una), sin duplicar. Una página para el móvil que se
     republica en el mismo enlace.
  6. **Pocas paradas**: las decisiones se te llevan **por tandas** (p. ej. cada semana o cada 5 entradas), no una a
     una, como pediste para los bloques (REGLAS §2.3).
  7. **Medir si sirve**: cada fase se cierra con su situación de guardia «resuelta» (lo que se consulta en la cama y
     lo que se estudia, comprobado en el móvil) y con tu uso real en la rotación que toque.
- **Afinado el 23/10** (el usuario: «mejorarlo y abrir la puerta a seguir mejorándolo conforme avanza la IA y la
  tecnología»; «la IA de Nvidia para leer TC body… unirlas para crear… un agente de IA que ayude al médico radiólogo»;
  «poder pasar la información de ecocardio en tiempo real y realizar el máximo de cálculos posibles… y hacer
  literalmente magia»). El norte pasa a tener **tres niveles**, cada uno con su puerta:
  1. **Estudiar** (lo de hoy): modelos vivos, fichas, Mayéutica. Lo ya estudiado de las webs (eco, arritmias, ETE,
     coronarias, TC) ahorra diseño: se rehace sobre nuestros motores.
  2. **Ayudar en la guardia, en el móvil y sin datos del paciente**: metes las medidas de la eco que haces y la app
     calcula todo lo que se puede (VS, GC, E/e′, PAPS, TAPSE/PAPS, VExUS…), con su grado, su fórmula y la coherencia
     entre medidas, y **el motor se ajusta a esas medidas** para mostrar «tu paciente» latiendo (un gemelo
     hemodinámico). Cabe en la arquitectura actual (todo en el teléfono). **(supongo)** «tiempo real» = tú tecleas o
     dictas las medidas mientras exploras; conectar el ecógrafo directamente no es posible desde una web en el móvil.
  3. **Asistente con IA** (lo que llegue con la tecnología): leer imagen con modelos abiertos (p. ej. los de NVIDIA
     para TC, familia MONAI / VISTA-3D, **por comprobar** modelo y licencia) unidos al método de NavRad y Radiology
     Assistant; IA de eco. **Choca con reglas actuales** (sin backend; una sola librería) y abre temas legales: datos
     de salud de pacientes reales (anonimizar, mejor en el propio dispositivo o en un ordenador del hospital) y
     producto sanitario (una herramienta que ayuda a diagnosticar es regulada; en estudio no). Decisión del usuario.
  - **Datos de pacientes** (el usuario, 23/10): no guardar datos personales; sí usarlo para calcular y para ayudar a
    diagnosticar sin que se guarde; y usar las imágenes para «alimentar a Claude». Explicado y anotado en
    `docs/historial/radar.md` §3: cálculos sin identificar y sin guardar, sí; imágenes reales, solo anonimizadas y
    procesadas en el dispositivo o en el hospital; a un servicio de IA externo, no; «mejorarse» = biblioteca de casos
    anonimizados o abiertos dentro de la app.
  - **Vigía tecnológico** dentro del radar: cada avance (IA de imagen, de eco, modelos nuevos) entra como una
    entrada más y se tría contra el norte.
- **Lo que NO quiero** **(supongo)**: acumular proyectos sueltos; construir sin pasar por el norte; meter código,
  textos o imágenes ajenos; dar por fuente un tuit o una web; abrir 10 frentes a la vez.
- **Primeras entradas**: las 6 webs de hoy (anesthbeta, EchoSuite, AngioView, NavRad, Radiology Assistant, RitmoLab),
  las 3 herramientas (REA, leanrea → skill `/ingenieria-reversa`, y las skills de clinical-ai-skills y
  research-agent-skills), ya estudiadas: entran triadas en la fase que les toca.
- **Depende de**: que confirmes o corrijas el norte. La ejecución (fases 0-4) depende de lo que está en «Esperando algo
  tuyo» (informe final).
- **Tamaño**: grande y permanente. Trozos que propongo:
  1. **Norte** (pequeña): escribirlo contigo en una página corta y dejarlo fijo.
  2. **Montar el radar** (pequeña-mediana): registro, ficha de triaje, la skill `/radar` y la hoja de ruta viva.
  3. **Volcar lo de hoy** (pequeña): las 6 webs y las 3 herramientas como primeras entradas triadas.
  4. **Revisión periódica** (cada tanda): triar lo nuevo y re-priorizar contigo.
  Las fases 0-4 del informe final se aprueban aparte, como tareas del plan socialista.
- **Dudas**:
  1. ¿El norte de arriba es lo que quieres conseguir, o le falta algo (p. ej. el MIR, la docencia a otros, la consulta
     en la guardia frente al estudio)?
  2. ¿Cómo me pasarás lo de Twitter: enlace, captura o texto copiado? (x.com suele estar bloqueado desde aquí; una
     captura o el texto funcionan siempre.)
  3. ¿Cada cuánto quieres la tanda de decisiones: semanal o cada N entradas?
  4. ¿Te vale el nombre «Radar»?
  5. (23/10) Para el nivel 3: ¿aceptas cambiar «sin backend» para esa parte (un servidor o un ordenador con GPU), o
     prefieres solo lo que corra en el propio teléfono? ¿Uso solo docente con casos abiertos, o también con
     pacientes reales (requiere el visto bueno del hospital)?

### Cómo se trabaja (lo que haría el plan socialista con cada una)

| Fase | Quién | Para qué | Modelo |
|---|---|---|---|
| A completa (contenido nuevo) | lector de fuente → constructor → auditor ciego | el texto entero, fiel y con sus páginas | barato |
| A ligera (lo que ya está) | auditor ciego → (si hay algo grave) constructor | comprobar fuentes, cifras y bibliografía | barato |
| R (revisar lo ya construido) | auditor ciego + revisor de código + verificador, a la vez → (si hay algo grave) constructor | fuente, imágenes, código grave y móvil; ideas para el estudio | barato |
| Mapa (un libro entero) | profesor como director de arte | los pocos modelos grandes que lo explican; maquetas para que elijas | potente |
| B (estudio) | **profesor diseña** → constructor → verificador + auditor + **profesor juzga** | visual con los modelos grandes, texto para estudiar, recorrido de preguntas y casos | potente |
| Cierre | revisor → rama propia y propuesta (PR) en borrador con «Ver en el móvil» | que lo pruebes y apruebes | — |

- Si algo suspende (un juez en rojo, algo grave en las fuentes, una nota del profesor por debajo de 4), vuelve al
  constructor. Como mucho 3 vueltas; si no, «necesita humano».
- **Una tarea por sesión.** Con `/plan-socialista` hace la siguiente del tablero; con `/loop /plan-socialista`
  encadena varias, hasta el límite del tablero. Nada se publica sin que apruebes su PR, y la próxima vez que abras
  `/bitacora` lo marca como hecho.

## 2. En marcha (ya en el tablero)

| Clave | Qué | Estado | Desde | Nota |
|---|---|---|---|---|

| `b1-*` | **Objetivo M5 · bloque 1** (caps. 1-11) | hecho el 20/10 | 2026-10-19 | |
| `b2` | **Bloque 2** (caps. 12-13) | hecho el 21/10 (PR #26) | 2026-10-20 | |
| `b3` | **Bloque 3** (caps. 14-22) | ⏸ **parado en la parada 1** (23/10) | 2026-10-21 | Ver «Dónde quedó el bloque 3» abajo |
| `tee-inversa` | **Ingeniería inversa del simulador TEE** (anesthbeta) | ⏸ **fase 1 hecha, esperando tu elección** (23/10) | 2026-10-23 | Ver «Dónde quedó tee-inversa» abajo |
| `rea-*` | **Ingeniería inversa de EchoSuite, AngioView y NavRad** (B-009 a B-011) | ⏸ **fase 1 hecha, esperando tu elección** (23/10) | 2026-10-23 | Informe conjunto: https://claude.ai/artifact/T4WcxXWzjPGm911ShU3aiS |
| `rea-radiologyassistant`, `rea-ritmolab` | **Ingeniería inversa de Radiology Assistant y RitmoLab** | ⏸ **fase 1 hecha, esperando tu elección** (23/10) | 2026-10-23 | Informe: https://claude.ai/artifact/1GTkuwubZ22Hb9qu4PW4P5 |

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

- **Esperando al usuario (parada 1, 2.ª vuelta)**: las tres maquetas v2 ya pulidas, en `main` y en el móvil:
  `autonomo/maquetas/b3-shock.html` (monitor de UCI, Impella, balón y ECMO como objetos reales, «¿Qué shock es?»),
  `b3-ritmo.html` (corazón eléctrico: grafo de conducción y ECG generado) y `b3-receptor.html` (receptor vivo:
  arteriola y cerraduras de pines). Piezas comunes en `autonomo/maquetas/comun/`. Falta su «ok» o sus cambios.
- **Hecho y en la rama `auto/b3`** (sin PR aún): las 26 fichas con 290 ids por sección y su página, vista Visual en
  Merino Cardiología y Neumología, hallazgos de fidelidad arreglados, y Texto | Estudiar en las 9 del shock (152
  preguntas, casos de Mateo, Amparo, Nerea y Begoña), auditadas (0 graves) y corregidas.
- **Ya en `main`**: el motor del latido llega a shock sin romperse (2 vueltas), con entrada de soporte (Impella, ECMO,
  balón); el «← VOLVER A LA FICHA» del ecógrafo.
- **Siguiente, tras su «ok»**: construir en la app la cabecera del shock (pasar `comun/` a `js/core/`), el receptor
  vivo y el corazón eléctrico (sub-bloques 3A → 3B → 3C), con jueces, auditor y profesor; el hueco del caso de Amparo
  (control del foco, p. 11).
- **Lo que falta de él**: el PDF de la guía ESC 2021 de marcapasos (bradicardias y bloqueos AV).
- Documentos: `autonomo/bloques/b3/` (encargo, cobertura, farmacos, megaproyecto-*, juicio-maquetas-v2, auditoria-3a).

El resto del tablero sigue `aparcada`.

## 3. Esperando algo tuyo


- **Decidido el 19/10**: Marino primero, por bloques (Objetivo M5). B-002, B-004, B-005 y B-006 esperan a terminar
  Marino. B-001 (preguntas) se hace como la **Mayéutica** de cada ficha, bloque a bloque. B-007 sigue sin aprobar.
- **Optimizar los agentes del plan** (pedido del usuario el 19/10: más fluido, menos gasto, mejor trabajo): propuesta
  en el chat, esperando su visto bueno.
- **Regla sin respuesta**: que los jueces midan también las tablas que se salen de su tarjeta (no solo la página).
  Salió en R5. ¿La apruebas?

- **🔴 Propuestas de cambio de reglas (Radar, 23/10)**: el norte en `CLAUDE.md`, el radar en `REGLAS.md`, el modo
  guardia sin guardar nada, la excepción del nivel 3 (IA aparte, datos anonimizados) y la biblioteca de casos. Detalle
  en `docs/historial/radar.md` §4. Nada cambia hasta que las apruebes.
- **🔴 INFORME FINAL «Del simulador a la cama»** (https://claude.ai/artifact/3hnNvcEsvsotfViShnXLee; NavRad con imagen: https://claude.ai/artifact/2v4kHFM66eac8d5bYWZgtm): junta las 6 webs y sustituye a
  los informes parciales para decidir. Hoja de ruta única: fase 0 (ya, sin fuentes: acabado de producto en eco,
  calculadoras y corazón eléctrico, bibliografía de RA), fase 1 (noviembre, PIF Cardiología: corazón eléctrico en la
  app, el ritmo mueve el motor, territorios e IAM), fase 2 (coronariografía que late y ETE), fase 3 (calculadoras de
  eco de UCI), fase 4 (imagen real: visor ligero, «¿dónde está la punta?», recorridos, casos). Espera: arrancar fase 0,
  el «ok» a la maqueta v2 del corazón eléctrico, los PDF (lista en el informe), abrir en la red `zenodo.org`,
  `*.cancerimagingarchive.net`, `*.radiopaedia.org`, `registry.opendata.aws` y `heart.org`, y 6 decisiones grandes.
- **🔴 «Ritmo vivo y placa guiada»** (https://claude.ai/artifact/1GTkuwubZ22Hb9qu4PW4P5): recomendado ya (sin fuentes nuevas) pulir el corazón eléctrico
  (monitor latido a latido, regla PR/QRS/QT, velocidad 1×/5×/20×) y la bibliografía enlazada de Radiology Assistant en
  el PIF de Radiología (17 artículos con URL comprobada). El **PIF de Cardiología empieza el 01/11**: para su cuaderno
  «ECG y arritmias» falta el PDF de ECG básico de la rotación (¿cuál?). Además: AHA 2025 (5 algoritmos), ESC 2021 de
  estimulación, PDF de las rotaciones de Radiología de tórax y Neurorradiología. Decisiones: «ok» a la maqueta v2 del
  corazón eléctrico, que el ritmo mueva el motor, 12 derivaciones «ilustrativas», pila de imágenes como pieza nueva y
  figuras de RA con crédito (su Disclaimer las permite con fines docentes; los textos no).
- **🔴 «Un paciente, todas las pruebas»** (https://claude.ai/artifact/T4WcxXWzjPGm911ShU3aiS): elegir fase (0 acabado de producto, recomendada ya; 1 coronarias
  e IAM en el motor; 2 coronariografía y ETE; 3 calculadoras de eco de UCI; 4 visor de TC) o números sueltos. PDF que
  hacen falta: ESC de SCA, ASE/EACVI 2015 de cámaras, ASE 2025 de corazón derecho y diastólica, ASE/SCA 2013 de ETE,
  Di Mario y Sutaria 2005. Decisiones: tocar el motor y la anatomía congelada; visor de TC como pieza nueva; dónde vive
  el «paciente vivo». Incluye los paquetes de tee-inversa.
- **🔴 tee-inversa: elegir paquete A, B y/o C** (ver «Dónde quedó tee-inversa»). Para B y la mejora 7, el **PDF de la
  guía ASE/SCA 2013 de ETE completa** (Hahn y cols., J Am Soc Echocardiogr 2013); para B, si se añade el recorrido del
  esófago a la anatomía (está congelada); para C, si se parten las valvas. Y, si existe, el informe de ATRIA-EchoTrace
  (tarea #94) que citaba el encargo: no está en el repositorio. (El acceso a `tee-simulator.anesthbeta.com` ya
  funciona desde el 23/10.)
- **🔴 PDF de la guía de marcapasos (bradicardias y bloqueos AV)** · apuntado 21/10: el corazón eléctrico del bloque 3
  no puede enseñar bloqueos AV ni bradicardias sin fuente, y ninguna de la app los trae. Localizada: **2021 ESC
  Guidelines on cardiac pacing and cardiac resynchronization therapy** (Eur Heart J 2021;42:3427-3520), mejor la
  versión en español de Rev Esp Cardiol 2022;75:370-410. La red del entorno no deja descargarla. **Tú**: mandar el PDF
  cuando puedas (dijiste el 21/10: «cuando pueda, te mando los PDFs»). Hasta entonces sus estados quedan preparados y
  vacíos, rotulados «pendiente de fuente». Encaja también con la puerta de Arritmias (siguiente punto).
- **Simulador de arritmias (idea de RitmoLab)**: los PDF de los algoritmos **AHA 2025** (bradicardia, taquicardia,
  parada y la guía completa); heart.org está bloqueado desde el entorno. Decidido: puerta propia en la raíz
  («Arritmias»), enlazada desde Cardiología del PIF. Fases: 1) monitor, 17 ritmos y modo Estudio; 2) casos; 3) 12
  derivaciones. Antes de construir, maqueta para elegir. Detalle en `docs/historial/cardiologia.md`.
- **El Libro Azul**: los PDF de las secciones que faltan (hay I, II, III y VII). Orden que pediste: Marino (hecho),
  después El Libro Azul y después el PIF de R1.
- **PIF de R1**: los PDF de las 7 rotaciones sin contenido (Radiología de tórax, Neurorradiología, Cardiología,
  Medicina Interna, Infecciosas, Neurología, Neumología).
- **TRR**: el PDF de Valdenebro 2021, para cotejar las 7 dudas anotadas en `docs/historial/nefrologia.md`.
- **Panel de subida**: la clave de la API y desplegar el Worker (`backend/README.md`).
- **Velocidad del plan socialista**: hay propuestas (dos constructores a la vez, pruebas largas al final, los jueces a
  la vez desde la 1.ª vuelta; de ~2 h 45 a ~1-1 h 15 por capítulo). Tu decisión del 14/10: **todavía no**.
- **Rutina nocturna** (que el plan trabaje solo de madrugada, ~3:00 de Canarias, con aviso al móvil): **no montarla
  aún**; cuando se monte, hace falta que fijes un límite de gasto.

## 4. Mejoras de lo que ya existe

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

## 5. 💡 Lo que yo propondría (no lo has pedido tú)

- **Para el mapa visual de Marino**, ya hay ideas de los revisores de R1-R10 y dos tuyas («agua de río y de mar»
  para los fluidos; **ácido-base como proyecto propio sobre el riñón de PIF Nefrología**, «que sorprenda a nivel
  artístico») en `autonomo/ideas/marino.md`. Los revisores de R6 y R7 piden, los tres, un **pulmón con respirador**
  (caps. 23-30).
- **Inventario de estudio**: una tabla de qué fichas tienen vista Visual, cuáles tienen un modelo grande que las
  explique y cuáles tienen solo preguntas viejas. Por qué: sirve para ordenar las tareas `estudio` por lo que más
  ayuda. Es una tarea pequeña de solo lectura.

## 6. Hecho (últimos 7 días)

- 2026-10-20 · **«La cama 7» en la app** (PR #23) y **motor calibrado** (PR #22), aprobados y en main.
  - Muralla, telar e inmersión en Libros → Marino → Modelos vivos, con la misma cama y desde sus 5 fichas.
  - 11 formas nuevas en la tabla única. Si un modelo vivo falla, el resto de Libros sigue funcionando.
  - PVC normal 4,2 mmHg; elevación de piernas en la hemorragia +20 %.

- 2026-10-20 · **Marino, bloque 1 en modelos vivos** (PR #19, #20 y #21), aprobados y en main.
  - Mayéutica en las 23 fichas de Fundamentos (botón Texto | Visual | Mayéutica).
  - Capilar y oxígeno, y catéter vivo, en Libros → Marino → Modelos vivos y desde las fichas.
  - El motor del corazón lee Guyton, la elevación de piernas, el bolo, el catéter de AP y la termodilución.
  - Auditados con el PDF: 9 graves corregidos (ninguno de dosis).

- 2026-10-19 · **Ácido-base vivo y río y mar en la app** (PR #18), aprobados.
  - Dónde están:
    - el ácido-base, en PIF → Nefrología;
    - el río y mar, en Libros → Marino;
    - los dos, en el bloque «Modelos vivos» de los dos menús, en el buscador y con botones desde las fichas.
  - Mayéutica con 14 + 14 preguntas y 4 + 3 casos.
  - «← VOLVER A LA FICHA» lleva a la ficha de origen.
  - El título «HUD Clínico UCI», más pequeño, lleva al menú principal.
  - Regla nueva: los jueces miden el desborde también tras contestar (`--modelo`).

- 2026-10-19 · **Plan Marino, fase 2: mapa visual y maquetas v2** (PR #16), aprobado.
  - Ácido-base vivo unificado (A+B+C) y río y mar en crema y oro, con su Mayéutica.
  - Están en `autonomo/maquetas/`.
- 2026-10-19 · **Jueces con la vista Visual**: `jueces.mjs --ficha` abre también la vista Visual de cada bloque
  (regla aprobada).
  - Arreglados los 2 px de «Nefronas que quedan».
  - El salicilato ionizado y el no ionizado, que se distinguían solo por el color, ahora también por la forma.

- 2026-10-19 · **Una sola leyenda de formas de iones** en los modelos vivos (PR #17), aprobada y en la app.
  - Una tabla única (`js/data/formas-iones.js`) y un dibujo común (`js/core/particulas.js`), que usan la nefrona viva,
    el glomérulo, el filtro de la TRR, las nefronas que quedan y el potasio.
  - Leyenda nueva en tres modelos.
  - Arreglada la célula de la nefrona viva que se quedaba congelada.

- 2026-10-15 · **Plan Marino, revisiones R8-R13** (caps. 31-53 y apéndices, 79 fichas), aprobadas y en la app
  (PR #10-#15). **La fase 1 de Marino está terminada.**
  - R8: la gasometría de ejemplo se queda como en el libro, con su nota.
  - R9: la hipermagnesemia grave, consultada en la web (Manual Merck) y anotada.
  - R10: el Ringer lactato, consultado en la web (WikEM y StatPearls) y anotado.
  - R11: los topes de la reversión se quedan.
  - R12: las abreviaturas valen.
  - R13: las calculadoras de tóxicos, solo para adultos (20-300 kg).

- 2026-10-15 · **Reglas aprobadas tras R4-R10** (`autonomo/REGLAS.md` §1.8-1.10 y §2.5b, `CLAUDE.md` §5 y §7):
  - erratas de dosis: dosis habitual + nota visible, con consulta web si hay duda;
  - notas de interpretación siempre con fuente, y web si hay discordia;
  - umbrales de las calculadoras comparados redondeados;
  - SVG recreados con fondo propio.
- 2026-10-15 · **Plan Marino, revisiones R4-R7** (caps. 14-30, 47 fichas), aprobadas y en la app (PR #6-#9):
  - R4: vasopresina en U/min con nota, 3.er vasopresor = epinefrina, remisiones «Ficha N» → botones; después,
    el escenario de bradicardia repuesto con el texto de Marino (lo pediste);
  - R5: dabigatrán y HNF con nota de errata, CHA₂DS₂-VASc puntuable, tablas que cabían mal a 360 px;
  - R6: clasificador de riesgo de la EP fiel, esteroides del SDRA, figuras legibles;
  - R7: descontaminación oral (SOD), notas del manguito y la PImax, clasificador del derrame sin conducta inventada.
- 2026-10-14 · **Plan Marino, revisiones R1-R3** (caps. 1-13, 29 fichas), aprobadas y en la app (PR #3, #4 y #5):
  - R1: signo de la RASS, límites de las calculadoras y notas de fuentes (propofol con fuentes externas);
  - R2: los simuladores de fluidos y de retorno venoso ya dan pacientes posibles;
  - R3: 7 graves corregidos en Merino HEMATO (TRALI/TACO, PFC:hematíes, 4Ts, HIT) y lo que faltaba del libro.
- 2026-10-14 · **Mejoras del plan aprobadas**: el comprobador elige un puerto libre y ya no da falsas alarmas de
  imágenes; recetas Visual por id; primero los archivos modelo; dos tareas a la vez en carpetas aparte.

- 2026-10-14 · **Preguntas para estudiar**: maqueta aprobada, reglas (`REGLAS.md` §8) y el profesor que diseña y
  juzga.
- 2026-10-14 · **Plan socialista revisado** tras el piloto: rúbrica «sirve para estudiar», encargos y tipos de tarea.
- 2026-10-14 · **Plan socialista montado**: skill, agentes, jueces automáticos, regla «paciente posible» y enlace
  «Ver en el móvil».
- 2026-10-14 · **Receptores adrenérgicos animados** en Merino Cardiología (Motion).
- 2026-10-14 · **Atlas cap. 14** (ventrículo derecho) y huecos del Manual UMI.
- 2026-10-13 · **Atlas caps. 08, 09 y 10** sobre el motor; el atlas en español dentro de Eco cardíaca.
- 2026-10-13 · **Marino completo** en Libros (caps. 1-11, 31-53 y apéndices) con sus revisiones.
- 2026-10-13 · **Manual UMI**: bloque neurocrítico y meningitis.
