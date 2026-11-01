# Bitácora

La lleva la skill `/bitacora` (`.claude/skills/bitacora/SKILL.md`). Aquí está **lo que se quiere hacer y aún no está
aprobado**, lo que espera algo del usuario y lo hecho en la última semana. Lo aprobado vive en `TABLERO.md`, que es
lo único que trabaja el plan socialista. Lo hecho hace más de 7 días y lo descartado pasan a
`docs/historial/bitacora.md`.

Última sincronización: 2026-10-30, 19:00 (Congreso, Consejo 12.ª, acta `autonomo/consejo/2026-10-30-12.md`, página https://claude.ai/artifact/FDmogy5RHB419Z9iBXCoNP): PR #37, #40 y #41 fusionadas (solo `autonomo/`); #47 y los capítulos del atlas `as`, `tr`, `peri`, `ms`, `segments`, `strain` y `stress` ya en `main`; abiertas #42, #44, #46, #49 (tarea `fusiones-30-10`) y #51 (bloque 3, voto 11.ª con condiciones); partes del 30/10 leídos. **Marino: 38 de 155 en `main`, 55 al fusionar el `b3`**. Gasto de hoy ≈50-56 M (estimado con los partes; vía libre). Antes, 2026-10-30 (Consejo, 7.ª): sin PR nuevas fusionadas ni cerradas; PR #37 sigue en borrador. Antes, 2026-10-30 (rumbo): partes del 29 y 30/10 leídos (Ley de Ciencia, `educacion-pionera` f3, `b3-paso4` g3a, g3b y g4, `eco-reforma`); ninguna PR fusionada ni cerrada desde el 28/10; PR #37 (Educación) abierta en borrador; **Marino: 50 de 155** fichas con Estudiar (42 + 8 de los grupos 2-4, en `auto/b3`).

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
  - **27/10, noche, cambia otra vez**: «lo suyo sería que el contenido de marino y del libro azul con los modelos
    vivos […] poder rehacer así el contenido del PIF, con nuestro propio contenido». El PIF se monta **al final**,
    sobre lo de intensiva que ya habrá (Marino, El Libro Azul, modelos vivos, eco): cada objetivo de la rotación
    enlaza a esas fichas y modelos; solo lo que no cubran se busca fuera, **con pocas fuentes** (no mil).
    Cardiología ya no es prioridad («son 2 meses de rotación»).
- **Depende de**: B-001 (las preguntas). Ya no de tus PDF.
- **Dudas**:
  1. ¿«Completar el PIF» incluía repasar lo que ya está (Hematología y Nefrología), o solo las 7 rotaciones?
  2. ¿La fuente que falte la busco yo (guías y revisiones libres, que tú revisas) o la buscas tú y me la mandas?
     (supongo: la busco yo, y si es de pago te la pido).
  3. ¿Empiezo por Cardiología por la fecha de la rotación? (supongo: sí).

### B-006 · Atlas de eco: los 20 capítulos que faltan · apuntado 2026-10-14
- **30/10: fase A aprobada** (texto, `atlas-texto`). Aquí queda solo la fase B (figura y estudio con el ecógrafo nuevo).
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

### B-034 · PIF de Radiología: temario corto para estudiar y para mirar rápido en la guardia · apuntado 2026-10-27
- **Lo que dijiste**: «de radiología faltaría también hacer lo de la ingeniería reversa a las páginas web que he
  mandado de radiología y de Radiology Assistant, y por lo menos hacerles un pequeño temario de lo importante […]
  tanto para estudiar como para mirar así rápido en la guardia […]. No hace falta tampoco poner 1000 fuentes».
- **Cómo lo entiendo**: tipo `plan` primero (informe), después `contenido`. La ingeniería inversa **ya está hecha**
  (23/10: Radiology Assistant, https://claude.ai/artifact/1GTkuwubZ22Hb9qu4PW4P5; NavRad, en el informe conjunto
  https://claude.ai/artifact/T4WcxXWzjPGm911ShU3aiS). Falta convertirla en el cuaderno del PIF de Radiología (tórax y
  neurorradiología, objetivos de `js/data/pif-rotaciones.js`): un **temario corto** (lo que un R1 de UCI tiene que
  saber leer: Rx de tórax de UCI, dispositivos, TC de cráneo urgente…) y una **tarjeta de guardia** por situación
  (supongo). Reúne `f0-ra-biblio`, `g5-neuro` y `f4-recorridos`.
- **Modelo «así sí»**: cuaderno de campo + «lee este trazado» del ECG (PR #36), cambiando el trazado por la placa.
- **Lo que NO quiero**: mil fuentes (una o dos por tema, de acceso libre: Radiology Assistant como bibliografía
  enlazada, una revisión o guía si hace falta); copiar sus textos o figuras; imágenes de pacientes sin licencia.
- **Depende de**: casos de imagen con licencia (zenodo, TCIA, Radiopaedia, cerrados en la red del entorno). Sin ellos,
  esquemas recreados (supongo).
- **Tamaño**: mediana (informe ≈1 M; cuaderno, 2-3 sesiones).
- **Dudas**: (1) ¿tórax y neuro a la vez, o primero tórax? (supongo: tórax). (2) ¿Antes o después de El Libro Azul?
  (supongo: después, como el resto del PIF, salvo el informe, que es barato).
- **Lista de calidad**: sin simulador · cifras por caso: no aplica · «lo que NO quiero»: sí · fuentes: Radiology
  Assistant (URL verificada en su informe) · juez: `--ficha` de cada ficha nueva.

### B-047 · PDF por su cuenta y tuits del Radar dentro de la app · apuntado 2026-10-30
- **Lo que dijiste**: «estaría bien que pudieras conseguir los PDF por tu cuenta y que la parte de radar metiera los
  tuits que le voy pasando en la app, pero bueno, esto ahora es mínimo y no es prioritario».
- **Cómo lo entiendo**: dos cosas pequeñas.
  1. **PDF**: ya es regla (REGLAS §4.13: se buscan en abierto antes de pedirlos). Falta hacerlo de verdad con la
     lista de «Esperando algo tuyo» (punto 5): una pasada que busque cada uno en Europe PMC, PMC y la web de la
     sociedad, baje los que estén en abierto a `docs/` y te pida solo los de pago, con el enlace exacto (supongo).
  2. **Tuits**: hoy la Bandeja (issue #27) los lee y los apunta en `autonomo/radar/`, pero no llegan a la app. La idea:
     que cada tuit útil acabe en la ficha que toca, como «Visto en Twitter» con su enlace y lo que aporta (supongo),
     nunca como fuente clínica (artículo 2 de la reforma).
- **Lo que NO quiero**: copiar el texto o las imágenes del tuit; tuits sin destino.
- **Tamaño**: pequeña cada una (≈1-2 M la de PDF; ≈1-2 M la de tuits).
- **Depende de**: nada. **No es prioritario** (lo dijiste tú): espera a que digas cuándo.
- **30/10, parte 2 aprobada** (`radar-tuits`): «me gustaría que los mirases, si tienen PDF que lo consigas, y lo integrases en la parte de UCI Papers […] no corre prisa». Queda aquí la parte 1 (los PDF de la lista).

### B-049 · anatomyatelier.org para el motor del corazón (ingeniería inversa) · apuntado 2026-10-30
- **Lo que dijiste** (30/10): «he encontrado una web que puede ser útil para hacer el motor del corazón de manera
  realista». Fase 1 hecha el mismo día: informe https://claude.ai/artifact/PQDjwgQj5v7eMrQcqScTSk
  (`autonomo/ideas/ingenieria-inversa/anatomyatelier.md`).
- **Resultado**: no sirve para B-045. Es un corazón 3D de una sola pieza hecho con IA (Tripo AI), sin cavidades, sin
  válvulas que se muevan y sin latido; sin licencia escrita. **No cambia el contrato** de `mv-eco`.
- **Lo que propongo** (supongo): (1) una línea en el encargo de `mv-eco-2a5`: una malla hecha por IA nunca es
  referencia de proporciones ni de forma; (2) «aislar el corte» y (3) rótulos que siguen a cada pieza en la vista 3D,
  pequeñas, para después de B-045.
- **Lo que NO quiero**: su malla, código, imágenes o textos; three.js para esto.
- **Tamaño**: nada la (1); pequeña cada una la (2) y la (3).
- **Depende de**: tu respuesta; la (2) y la (3), de que B-045 esté hecho.
- **30/10**: «apruebo lo de añadir la línea 1» → añadida al «Encargo B-045» del tablero. Pidió además ver el corte y
  las capas: 2.ª pasada hecha (el corte quita media figura; las «capas» son la malla en alambre). La (2) y la (3): «que lo decida el ministerio del interior y el de educación» → aprobadas juntas como
  `eco-3d-lectura` (≈3 M, carril 2, tras `mv-eco-2a5`; tablero, tarea 15).

### B-050 · La gran reforma: terminar la app · apuntado 2026-10-30
- **30/10: aprobada como «plan de 2 semanas»** (actas 13.ª y 14.ª): meta 13/11, sin techos de dinero (límite semanal), Educación elige maquetas, bloques solapados, recortes de Hacienda; 6a y 6b siempre con su modelo vivo (desempate a favor de Educación). Queda pendiente solo el trozo (7) (ACOD y lazos P-V). La fase B del atlas entra si cabe, la semana siguiente.
- **Lo que dijiste**: «un plan general de la gran reforma para terminar la aplicación ya, de modo que solo queden El
  Libro Azul y cuatro cosas menores. Decid qué falta para llegar ahí y en qué fecha».
- **Cómo lo entiendo**: tipo `plan`, hecho por el Consejo 12.ª (página https://claude.ai/artifact/FDmogy5RHB419Z9iBXCoNP,
  sección «Gran reforma»). Falta ≈370-510 M: Marino 205-280 (aprobado) · eco 19-25 (aprobado) · atlas texto 5-7
  (aprobado) y **fase B 30-45 (B-006, por aprobar)** · carril 2 y webs 65-85 (casi todo aprobado) · PIF 22-34 (Radiología
  aprobada; las 5 rotaciones sin cuaderno, informe antes) · Educación 3-5 · menú 5-8 (maqueta antes; art. 7) · **preguntas
  viejas fuera de Marino, ≈267, 10-15 M (por aprobar)** · arreglos 5-8. Fecha objetivo 22/11 (lo grande) y 28/11
  (restos) si la vía libre sigue; con el 18 %, segunda quincena de diciembre.
- **Trozos nuevos que necesitan tu sí**: (1) prolongar la vía libre tras el 02/11; (2) techo de ≈165-230 M para lo que
  no es Marino; (3) fase B del atlas; (4) preguntas viejas fuera de Marino; (5) solapar mapa y maquetas de un bloque de
  Marino con la construcción del anterior; (6) maqueta de «iones vivos» del `b4`; (7) calculadora de ACOD y lazos P-V
  (de `rea-cierre`; recomendación: lazos dentro de `mv-eco`, ≈1-2 M; ACOD con `pif-cardio`); (8) quién elige las
  candidatas de `estudio-04-11` (recomendación: el Consejo).
- **Lo que NO quiero** (supongo): tocar El Libro Azul antes de su mapa; quitar la nota 8,75 ni los jueces para correr.
- **Depende de**: la PR #51 en `main` (desbloquea `mv-eco-2a5`, `b3d`, piezas del `b4` y `marino-unido`).
- **Tamaño**: grande: es la suma de los trozos de arriba, cada uno con su tarea.
- **Lista de calidad**: topes de los mandos: los de cada modelo (REGLAS §1.14) · cifras: en cada encargo · «lo que NO»:
  sí · fuentes: las de cada tarea · jueces: los de la suite y §4.15 para entrar en `main`.

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

### B-051 · Motor de radiología: Rx y TC recreadas con patologías, y estudio del análisis de imágenes · apuntado 2026-10-30
- **31/10, cambia**: el usuario rechaza las maquetas dibujadas («imágenes de coña que no tienen nada que ver con la realidad; te he pasado mil recursos para poder usar imágenes reales»). Fallo de la bitácora: «dibujadas por la app» era un «(supongo)» que no se le preguntó. Elige la **B**: parar el motor dibujado; imágenes reales de los PDF de `docs/` ya, y Radiopaedia cuando abra la red (`radiopaedia.org`, `prod-images-static.radiopaedia.org`) y se verifique su licencia. Tarea `radio-real` en el tablero (Objetivo L, 6d). **Lección**: en un encargo de imagen médica, «dibujada o real» es duda de las 5, nunca un «(supongo)». · **B-051a aprobada el 30/10 (`motor-radio`); B-051b sigue esperando**
- **Lo que dijiste**: «construir un motor con todas las páginas de radiología que te he mandado para que pueda incluso
  recrear patologías o ayude a estudiar o incluso se pueda en un futuro más adelante subir imágenes de TC o
  radiografías de pacientes y se pueda analizar la imagen». Elegiste «Motor + preparar el análisis».
- **Cómo lo entiendo** (dos trozos):
  - **B-051a · Motor de estudio** · tipo: modelo vivo (maqueta primero). Una Rx de tórax y una TC (tórax y cráneo)
    **dibujadas por la app** (supongo: SVG/canvas propio, como el motor de la eco), con mandos que ponen y quitan
    patologías: neumotórax (también en supino), derrame, edema cardiogénico frente a SDRA, consolidación y atelectasia,
    tubo y vía mal puestos, hematoma epidural/subdural, hemorragia, signos precoces de ictus, HTIC y hernias. Para
    qué: ver cómo cambia la imagen y por qué, y practicar «lee esta placa» con casos que se generan. Modelo «así sí»:
    el motor de la eco (`js/modules/eco/motor.mjs`) y «Lee esta placa» (PR #42). Se engancha a los cuadernos Tórax de
    UCI y Neuro urgente (PR #62) y a la placa de UCI. Fuentes: las cifras, de los PDF de `docs/` (Marino, Libro Azul,
    Manual UMI) y StatPearls ya verificado en `radio-fichas`; las webs que mandaste (Radiology Assistant, NavRad, los 6
    informes de radiología) **solo como ideas**: sin licencia para copiar textos, imágenes ni contornos. Primer paso:
    informe-propuesta con 2-3 maquetas para que elijas (supongo, ≈3-4 M); construir, después y por trozos.
  - **31/10, decidido (B-051b)**: el usuario quería un servidor para NV-Reason-CT con TC públicas y de sus pacientes, pero tiene un portátil sin tarjeta gráfica y no quiere pagar alquiler → **servidor descartado**; la regla «sin backend» sigue igual. **TC de pacientes: no** (recomendación de la bitácora: RGPD y el modelo no es producto sanitario; en el hospital sería cosa de informática o del comité de ética). Aprobada la versión sin servidor con TC públicas: tarea `ia-tc-publica` (Objetivo L, 6e). Espera a que abra `zenodo.org` y `huggingface.co`, y que ejecute él el cuaderno de Colab.
  - **B-051b · Estudio del análisis de imágenes** · tipo: informe (sin construir). Qué haría falta para subir una TC
    o una placa de un paciente y que la app la analice: servidor e IA (qué modelos existen, qué leen y qué no; NV-Reason
    ya dijo que no lee cráneo ni placa simple y que no es producto sanitario), privacidad (anonimizar, dónde se procesa),
    legalidad (RGPD, producto sanitario) y coste. **Choca hoy con dos reglas tuyas**: «sin backend» (`CLAUDE.md` §2) y
    «ningún dato de pacientes reales» (art. 3a de la reforma). El informe solo te da lo necesario para decidir si las
    cambias; nada se construye sin esa decisión.
- **Lo que NO quiero**: copiar imágenes, textos o contornos de Radiology Assistant, NavRad o Radiopaedia; cifras sin
  fuente con página; guardar imágenes de pacientes; un esquema donde la app puede tener la imagen real (las figuras de
  Marino se quedan al lado del dibujo, REGLAS §4.8 R4).
- **Depende de**: la PR #42 (Lee esta placa) y la PR #62 (`radio-fichas`) en `main`; para B-051b, nada.
- **Tamaño**: grande. Trozos: (1) informe + maquetas de B-051a; (2) informe B-051b; (3) motor de Rx de tórax;
  (4) TC de cráneo; (5) TC de tórax; (6) casos y Mayéutica.
- **Dudas**: 1) ¿Empezamos por la Rx de tórax o por la TC de cráneo? (supongo: Rx de tórax, la que más ves en UCI).
  2) ¿B-051b ya, o cuando el motor esté hecho? 3) Presupuesto del bloque (supongo: maquetas ≈3-4 M; el motor entero,
  a calcular en el informe).
- **Lista de calidad**: topes con fuente de cada mando (tamaño del neumotórax, derrame, desviación de línea media): a
  fijar en el informe · cifra que debe salir en cada forma: en el informe · «lo que NO quiero»: sí · fuentes con
  página: `docs/` + StatPearls por sección · juez: `--modelo` y prueba propia al construir; el informe, el profesor.

## 2. En marcha (ya en el tablero)

| Clave | Qué | Estado | Desde | Nota |
|---|---|---|---|---|
| `motor-radio` | **B-051a · Motor de radiología de estudio** (Rx y TC dibujadas con patologías); primer trozo, informe + 2-3 maquetas | aprobado por ti el 30/10 («haz ahora el B-051a») | 2026-10-30 | ≈3-4 M el primer trozo; B-051b (análisis de imágenes de pacientes) sigue apuntada |
| `b3-corazon-pr`, `b3d`, `b4-cobertura` | **B-044 · Terminar Marino ya**: la parte del corazón del `b3` a tu parada 3 y a `main` sin esperar al pulmón; el pulmón como bloque propio (`b3d`, horquilla ≈12-18 M); cobertura del `b4` ya | aprobado por ti el 30/10 (con lo recomendado: dos PR, dos sesiones de Marino a la vez durante la vía libre, 12-18 M) | 2026-10-30 | Mismo techo, 400 M. Acta `autonomo/consejo/2026-10-30-7.md` |
| `mv-eco-1`, `mv-eco-2a5` | **B-045 · El motor de la eco ya**: **dos motores** (corazón y eco) unidos por un contrato; realismo «como la eco del hospital», comparado lado a lado con imágenes reales; la «nave espacial» de la HP al máximo, con juez de geometría | aprobado por ti el 30/10; paso 1 ya, pasos 2-5 al fusionar el corazón del `b3` | 2026-10-30 | 20-26 M; comparece si el realismo pide más. Encargo en el tablero (Objetivo C) |
| `rea-cierre` | **B-046 · Ingeniería inversa de todas las webs**: lo que falta y la página «Todo lo estudiado» | **hecha (30/10)**: PR #40 en `main` (Consejo 12.ª), 58 recursos con destino, https://claude.ai/artifact/L9ACnf5rSyMPyow9KYLTVM | 2026-10-30 | ≈3-4 M. Las 3 webs cerradas, descartadas por escrito si no las abres (supongo) |
| `fusiones-30-10`, `radio-fichas` | **Consejo 12.ª (Congreso)**: fusionar #49, #44, #46 y #42 (las dos últimas tras subir a 8,75) · resto del temario de Radiología «ya» (tu decisión 4) | aprobadas el 30/10 | 2026-10-30 | ≈2-2,5 M y ≈7 M (tope 9). Acta `autonomo/consejo/2026-10-30-12.md` |
| `reglas-reforma` | **La reforma**: los 7 artículos con «sí» | **hecha el 30/10, en `main`** (con las 4 de Hacienda): REGLAS §4.15 y las demás | 2026-10-30 | ≈1,3 M, directo a `main` |
| `raiz-aortica` | **B-041 · Raíz aórtica**, en la eco | en revisión (PR #46; profesor 8,5: arreglo corto en `fusiones-30-10`) | 2026-10-30 | ≈0,8-1,2 M |
| `marino-unido` | **B-048 · Todo Marino en Libros → Marino**: tarjetas de Cardiología (14-21) y Neumología (22-30) en el índice, y los modelos vivos por temas | aprobado por ti el 30/10 | 2026-10-30 | ≈0,8-1,5 M, tras el corazón del `b3` en `main` |
| `atlas-texto` | **B-006, fase A**: el texto de los 20 capítulos del atlas de eco, uno por sesión; figuras y estudio, con el ecógrafo nuevo | en curso: 7 en `main` el 30/10 (16 de 30 en el atlas), `ar` en la PR #49; la cadena se cortó en `hcm` y la reabre el Consejo 12.ª | 2026-10-30 | ≈20-30 M en el carril 2 |
| `radar-tuits` | **B-047, parte 2**: los tuits que mandas, con su PDF, a UCI / Papers Tuiter | aprobado por ti el 30/10, sin prisa | 2026-10-30 | ≈1-2 M por tanda |
| `wiggers-movil` | Arreglo de la Wiggers a 360 px | **hecha (30/10, en `main`)** | 2026-10-30 | ≈0,3 M |
| `pif-cardio-minimo`, `eco-sueltas`, `arteria-culpable`, `guardia-shock`, `pif-cardio`, `radio-baratas`, `estudio-04-11`, `radar-hoja` | **Ley de Ciencia** (27 informes de ingeniería inversa en 7 proyectos) | validada por ti el 29/10: Objetivo L del tablero; `pif-cardio-minimo` **pasa al 31/10** (el 30/10 el día ya iba en ≈34 M: no se empezó), el resto en su turno | 2026-10-29 | ≈92-114 M en total, ≈17-23 M nuevos. https://claude.ai/artifact/YbR2Z9chFJBaye1HvtV9e3 |
| `educacion-pionera` | **B-040 · Educación pionera** (modelos vivos + preguntas socráticas; la IA diseña, la app no conversa) | fases 1, 2 y **3 hechas** (28-29/10): 3 maquetas juzgadas (A 7,75 no pasa; B 8,25; C 8,25), [página](https://claude.ai/artifact/GoHaq43vYu8echLwfqN6oe), [PR #37](https://github.com/alvariitoSW/fiebres-neutropenias/pull/37) en borrador; ≈8,4 M (5 % sobre el tope) | 2026-10-28 | 30/10: aprobadas A, B y C; elegimos la mezcla C+B primero y A después. A la app: `educacion-app` |
| `b3-pulmon-*`, `b3-cierre`, `b4`, `b5`, `b6a`, `b6b` | **B-035 · Plan Marino 100 %** (42 de 155 fichas con Estudiar el 28/10) | aprobado el 28/10: objetivo ≈212-328 M, **techo 400 M**, Hacienda en cada tarea | 2026-10-28 | Fin previsto entre el 22/11 y el 05/12. Objetivo M5, filas 9-16 |
| `eco-calibra-b`, `capilar-transfundir` | Los 3 huecos de la eco (TEP con escalón, shock cardiogénico coherente, DT del grado 1) y el tope del mando «Transfundir» del capilar vivo | aprobadas por el Consejo (28/10, 3.ª), **aparcadas**: la 1.ª espera el informe `eco-reforma`, la 2.ª la parada del 04/11 | 2026-10-28 | ≈3,5 M y ≈0,5 M. Acta `autonomo/consejo/2026-10-28-3.md` |
| `eco-reforma` | **B-039 · Reforma integral de la eco**: informe con maquetas visuales de los dos motores | **hecho el 30/10** (adelantado; 3,5 M de 4,4): [informe](https://claude.ai/artifact/BsV8RZpH6De3RcxhirNr7i), maquetas en `autonomo/maquetas/eco-reforma/` | 2026-10-28 **Elegiste la A el 30/10** (sin three.js): la obra, `mv-eco`, tras fusionar el bloque 3 |
| `consejo`, `mayeutica` | **B-037 y B-038**: Consejo de Ministros (poderes: todo menos presupuesto total, arquitectura, quitar contenido y la última parada de cada bloque) y Ministerio de Educación (`/mayeutica`: escuela, arte e ideas) | hechas (28/10, en main): REGLAS §4.12 y la skill; primer Consejo el 28/10 (acta `autonomo/consejo/2026-10-28.md`) | 2026-10-28 | Acuerdos: `mayeutica-pestana` el 29/10 antes del grupo 2; `b3-bradi` corta; `b3-ritmo-motor` y `f2-ete`, aparcadas hasta B-039 |
| `gobierno` | **B-036 · Trabajar como un gobierno**: Interior (`/plan-socialista`) presupuesta y rinde cuentas, Hacienda (`/ahorro`) recorta sola y lo deja escrito, Transportes (`/bitacora`) lleva el rumbo; tú apruebas el presupuesto de cada bloque; comparecer si se pasa >25 % | hecha (28/10, en main): REGLAS §4.10 y las tres skills | 2026-10-28 | Primera prueba: grupo 2 de `b3-paso4` (29/10) |
| `b1-*` | **Objetivo M5 · bloque 1** (caps. 1-11) | hecho el 20/10 | 2026-10-19 | |
| `b2` | **Bloque 2** (caps. 12-13) | hecho el 21/10 (PR #26) | 2026-10-20 | |
| `b3` | **Bloque 3** (caps. 14-30, con el pulmón con respirador) | paradas 1 y 2 **hechas y en main** (PR #32 y [#35](https://github.com/alvariitoSW/fiebres-neutropenias/pull/35), 27/10). **Paso 4: plan escrito, sin construir** (`autonomo/bloques/b3/plan-paso4.md`): 17 fichas en 6 grupos, 17 piezas nuevas, ≈35-40 M en 10-12 sesiones; espera tu decisión | 2026-10-21 | Ver «Dónde quedó el bloque 3» abajo |
| `reglas-b3p2` | Las 4 reglas de la parada 2 del `b3` (`.claude/`, una sesión por modelo, botones estables, maqueta a la app en dos encargos) | hecha (27/10, en main) | 2026-10-27 | aprobadas por el usuario el 27/10 |
| `encargo-revisado` | **B-031**, dos ideas de Spec Kit: revisar el encargo antes de gastar y lista de calidad del encargo (sin instalar Spec Kit) | hecha (27/10, en main) | 2026-10-27 | «vamos solamente con la B-031» (27/10) |
| `tee-inversa` | **Ingeniería inversa del simulador TEE** (anesthbeta) | **cerrada el 30/10**: C ya hecho (eco-mega, «Festones y cúspides»); A y B entran en la obra de la eco (`mv-eco`) | 2026-10-23 | |
| `rea-*` | **Ingeniería inversa de EchoSuite, AngioView y NavRad** (B-009 a B-011) | ✅ elegido el 25/10: entra en el plan de integración | 2026-10-23 | Informe conjunto: https://claude.ai/artifact/T4WcxXWzjPGm911ShU3aiS |
| `rea-radiologyassistant`, `rea-ritmolab` | **Ingeniería inversa de Radiology Assistant y RitmoLab** | ✅ elegido el 25/10: entra en el plan de integración | 2026-10-23 | Informe: https://claude.ai/artifact/1GTkuwubZ22Hb9qu4PW4P5 |
| `ecg-guardia`, `arritmias-*`, `ecg-vector-*` | **B-033 · ECG en tres caminos** (leer juntos en la guardia, laboratorio de arritmias, vector y 12 derivaciones). Plan: https://claude.ai/artifact/6bVRWXYtCi8rFx7NZZYB3c | aprobado el 27/10: 6 tareas en el tablero (Objetivo I, filas 28-33); Anatomy instalado como skill el 27/10; las 2 primeras, programadas para el 28/10 por la mañana | 2026-10-27 | «guarda el informe en tareas para hacer […] y que se programe para mañana por la mañana» (27/10). Decisiones: las recomendadas del plan (supongo; cámbialas antes de que arranquen si quieres otra) |
| `rea-2` | **Segunda pasada de las 6 webs + NV-Reason-CT** (método v2): megaproyecto «La UCI en el bolsillo» | ✅ elegido el 25/10: entra en el plan de integración | 2026-10-25 | Pedido el 25/10: «un megaproyecto faraónico para incluirlas y poder usarlas en la vida real… como médico intensivista y para estudiar» |
| `radar`, `vuelta-modelos` | **B-012 y B-016** | hechas (PR #28 y #29, en main) | 2026-10-25 | |
| `eco-mega` | **B-015 · Megaproyecto de la eco** | paradas 1, 2 y 3 **hechas y en main** (PR #30 y #34, 27/10). Siguiente: informe `eco-calibra` (B-027 + B-029, aprobado el 27/10) | 2026-10-25 | Maqueta: https://claude.ai/artifact/DMwoT6wzupV4e48KNN2R4b |
| `inventario` | **B-014 · Inventario de estudio** | hecha (26/10, PR #31) | 2026-10-25 | Informe https://claude.ai/artifact/894zY7AfqYQC3QWP1Yjxir |
| `pif-ecg` … `f4-recorridos` | **Objetivo I · Integración** (rumbo del Radar del 25/10): fase 1, fase 0, G1-G6 y fases 2-4, 26 tareas | pasado al tablero el 27/10: 13 `pendiente`, 13 `aparcada` (esperan PDF o terminar Marino) | 2026-10-27 | «sí, pásalo al tablero» (27/10). Orden: fase 1 → fase 0 → G1 |
| `b3-paso4-opciones`, `eco-calibra`, `competencias-r` | **Objetivo P**: informes con gasto antes de construir: paso 4 del `b3`, **B-027 + B-029** (motor diastólico y HP crónica de la eco) y **B-032** (competencias por año) | hechos (27/10); R2-R5 de competencias, a medias | 2026-10-27 | Elegiste: paso 4 opción A (17 piezas, ≈36 M) y eco opción A |
| `b3-paso4` | Paso 4 del `b3` por grupos | **grupos 1-4 hechos** en `auto/b3` (28-30/10: taquiarritmias, parada, shock cardiogénico, IC; profesor ≥8,25). Faltan la pieza del tabique y los grupos 5-6. Gastado 40,4 M de ≈51 M (+5 M aprobados por ti el 30/10) | 2026-10-28 | Parada 3 contigo tras el grupo 6. `eco-calibra-a`: hecha el 28/10 (14,5 M, en `main`) |
| `azul-cobertura`, `radio-informe` | **Objetivo P2**: mapa de El Libro Azul frente a Marino y propuesta del PIF de Radiología (B-034), solo informes | `radio-informe` **hecha** (30/10); `azul-cobertura`, sesión abierta por el Consejo 12.ª (30/10) | 2026-10-27 | «Sí a todo» (27/10, noche) |
| `ecg-*`, `arritmias-*`, `competencias-r2r5` | Cardiología del PIF y competencias R2-R5 | aparcadas el 27/10 por la prioridad nueva | 2026-10-27 | «Me quedo con la opción A…» (27/10) |
| `pif-ecg` | Cuaderno «ECG y arritmias» del PIF de Cardiología (con «La alegría de leer el ECG») | **hecha (28/10, en main)**: PR #36 aprobada por el usuario | 2026-10-27 | `ecg-guardia` (aparcada) seguirá en una PR nueva desde `main` |
| `jueces-topes` | Jueces que llevan cada mando de un modelo vivo a su tope (REGLAS §1.14) | hecha (27/10, en main): 7 de 8 modelos ✅; el ácido-base da pH 6,36 (tarea `topes-acidobase`) | 2026-10-27 | Técnica: directo a main |
| `pulmon-respirador` → `b3d` | **B-013 · Pulmón con respirador** | **en curso** en `auto/b3d` (aprobado de nuevo el 31/10) | 2026-10-25 | |
| `bandeja` | **B-017 · Bandeja del Radar** (issue #27 de GitHub) | ⏸ bandeja creada; **31/10: la tarea que la abría vivía en la sesión «Despertador», cerrada por el usuario: parada**; la tarea diaria, **pausada**: hay que crearla desde la app con el proyecto elegido (texto en `autonomo/radar/LEEME.md`) | 2026-10-25 | Opción A elegida por el usuario: 0 €, sin Telegram ni clave de pago |
| `formula-comun`, `potasio-prioritario`, `objetivos-casos`, `eco-vci-retenido`, `monitor-comun` | **B-018 a B-022**, mecánicas nuevas en los modelos vivos (informe de `vuelta-modelos`) | Objetivo V: cuatro hechas y en main (25-27/10); `monitor-comun`, aparcada hasta el bloque 3 | 2026-10-25 | «me parece todo perfecto, estoy de acuerdo en lo que dice el profesor» (25/10) |
| `notas-meta` | **B-023**, llegar al 8,75 sin gastar de más (modelos, tokens y vueltas) | hecha (27/10, PR #33): R1-R9 aprobadas y en `REGLAS.md` §4.8; R1 automático, tarea `jueces-movil` | 2026-10-25 | «apruebo todas las propuestas de regla de R1 a R9» (27/10) |
| `jueces-movil` | Juez automático del móvil (R1 de `notas-meta`) | hecha (27/10, en main) | 2026-10-27 | Técnica: directo a main |
| `movil-existente`, `propuestas-movil` | Arreglar en el móvil lo que cazó el juez nuevo (8 modelos vivos y Marino · Fundamentos) y la pieza común `verFrase()` | hechas (27/10, en main) | 2026-10-27 | |
| `reglas-27-10` | Las 3 propuestas de ahorro y las 5 reglas de los partes del 27/10, a las reglas del plan; límite de gasto: 18 % del uso semanal al día | hecha (27/10, en main) | 2026-10-27 | Antes de la parada 2 del `b3` |
| `topes-acidobase` | Ácido-base vivo: el pH 6,36 con varios mandos a tope, arreglado en su origen | hecha (27/10, en main): era «Bicarbonato IV» + PaCO₂ 90; el modelo ya lo rechazaba, el aviso escribía el pH imposible | 2026-10-27 | |
| `fuentes-b3` | Buscar y citar lo que la ficha no dice en las maquetas del `b3` (balón, distractores, topes) | hecha en `auto/b3` (27/10); entra en main con la PR del bloque | 2026-10-27 | Quedan 4 PDF (ver «Esperando algo tuyo») |
| `rea-eco` | **B-024**, ingeniería inversa de las webs de eco para un corazón más real | hecha: elegido el 26/10 (A1-A3, B4, B5 y D1 a la parada 2 de `eco-mega`) | 2026-10-25 | «aprueba B-024» (25/10) |
| `eco-anatomia` | **B-025**, corazón real (anatomía, fisiología y patología): informe con Fable 5.1 + plan socialista con su gasto | ✅ elegido el 26/10: el núcleo entra en la parada 2 de `eco-mega` (P1 potente, pericardio de las aurículas más real, P7 como forma grave con nota); PDF de los huecos los busca el usuario · https://claude.ai/artifact/TooB2RJcrwkf9CoFiPyqBi | 2026-10-26 | Pedido directo del usuario (26/10): «habría que generar un informe con fable 5.1… y apuntarlo en /bitacora» |

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

**Resuelto el 30/10 (Consejos 13.ª y 14.ª)**: puntos 2 a 7 de la lista de abajo (2 semanas, sin techos, maqueta del `b4` y demás las elige Educación, bloques solapados, atlas fase B si cabe, preguntas viejas fuera de Marino como están). **Nuevo**: captura de Ajustes → Uso el 31/10 por la noche y cada mañana.

**Resuelto el 01/11 (Consejo del 01/11, acta `autonomo/consejo/2026-11-01.md`, vídeo https://claude.ai/artifact/RTgGFnbio4SJAA52ZH6Lf3)**: (2) **vía libre hasta el 22/11**; dibujo nuevo de la eco: **seguir hasta el 9,5** (≈3 M; techo de `mv-eco` a ≈32 M) antes de encenderlo; atlas `mr`: **a `main` solo con su texto**; **los 6 recortes de /ahorro aprobados** (5 ya estaban en REGLAS; el 6.º, tarea `reglas-01-11`); Radiología parte 2, **aparcada**; Semiología: **el usuario manda el PDF**. Después, el mismo día: **techo de la gran reforma aprobado** (≈165-230 M aparte de Marino); MedMLX apuntado en el Radar para la Radiología; abiertas las sesiones de `mr` (texto a `main`) y `mv-eco-2a5` (al 9,5). Sigue esperando: el PDF de Semiología y los opcionales (8-10).

**Del Congreso (Consejo 12.ª, 30/10)**, lo más urgente primero (página https://claude.ai/artifact/FDmogy5RHB419Z9iBXCoNP):
1. **Semiología** (31/10): `www.ncbi.nlm.nih.gov` ya abre, pero el libro de Walker (*Clinical Methods*,
   https://www.ncbi.nlm.nih.gov/books/NBK201/) pone un reCAPTCHA antes del texto y la API oficial solo da fichas: no se
   salta. **Hace falta tu PDF**: el capítulo cardiovascular de Argente y Álvarez, *Semiología Médica* (el que usaste en la
   app del Negrín; recomendado), o los capítulos de exploración cardiovascular de Walker guardados desde tu móvil. Una IA
   no puede ser la fuente (acta 10.ª); tu repositorio `sobreviviendo_a_urgencias_en_el_Negrin` sirve de guion, no de
   fuente (no tiene páginas). Con el PDF en `docs/`, el Congreso lo monta (objetivo «Historia clínica» del PIF).
2. ✅ **Ritmo tras el 02/11**: vía libre hasta el 22/11 (el usuario, 01/11).
3. ✅ **Techo de la gran reforma** (B-050): ≈165-230 M aparte de Marino, **aprobado por el usuario el 01/11** («lo del techo de la gran reforma, apruebo el gasto»).
4. **`b4`**: maqueta de «iones vivos» (≈+8 M, recomendado) o directo.
5. **Solapar** mapa y maquetas de un bloque de Marino con la construcción del anterior.
6. **Fase B del atlas** (B-006, ≈30-45 M) cuando pase el ecógrafo nuevo.
7. **Preguntas viejas fuera de Marino** (≈267, 10-15 M).
8. **Calculadora de ACOD** y **lazos P-V** (de `rea-cierre`): ¿tarea?
9. **Candidatas del 04/11**: ¿tú o el Consejo?
10. Pegar los tuits #26-28 en la Bandeja #27 (x.com da 402); PDF de Helseth, Carden 2026 y Mireles-Cabodevila 2022.

Limpiado por el Consejo del 30/10 (7.ª, acta `autonomo/consejo/2026-10-30-7.md`): lo ya decidido está copiado entero
en `docs/historial/bitacora.md`. Aquí queda solo lo que de verdad espera de ti.

1. ✅ **B-044, B-045 y B-046**: aprobadas el 30/10 (ver «En marcha»).
2. ✅ **La reforma**: «sí a lo que dice el Consejo» (30/10), tarea `reglas-reforma`.
3. ✅ **Parada 3 del `b3`**: «apruebo todo el bloque 3» (30/10). Entra en `main` al terminar el grupo 6, `shock-scai` y `b3-bradi`.
4. ✅ **B-041**: en la eco (30/10), tarea `raiz-aortica`.
5. **Opcional, sin prisa**:
   - la prueba de 3 días con el caso de Teresa (`autonomo/ideas/educacion-pionera/prueba-3-dias.md`);
   - PDF que mejorarían fichas (se buscan antes en abierto, REGLAS §4.13): DanGer Shock 2024, ESC 2024 y ACC/AHA 2022
     de aorta, Devereux 2012, Hickling 2001, Mireles-Cabodevila 2022, Carden 2026, AHA 2020/ERC 2021, SCAI 2015,
     Valdenebro 2021, Leung y Levine 1994, un libro de física de los ultrasonidos (B-028) y el capítulo
     cardiovascular de Bates o Surós.
6. ✅ **B-049** (anatomyatelier.org): lección en el encargo B-045; «aislar el corte» y los rótulos 3D los decidieron
   Interior y Educación (30/10, por delegación tuya): tarea `eco-3d-lectura`, aparcada hasta `mv-eco-2a5`.

**Ya no te toca** (Consejo, 30/10, 7.ª; confirmado por ti el 30/10 en el Congreso): SCA y disección (mirados) · HP crónica de la eco (lo arregla `mv-eco`, entra en
su «hecho») · el «sigue» de `educacion-app` (lo manda quien fusione el `b3`) · Wiggers (aprobado, `wiggers-movil`).

## 4. Mejoras de lo que ya existe

- **Iones vivos (PR #65, fusionada el 31/10; acta `autonomo/consejo/2026-10-31-pr65.md`)**: Mayéutica sobre el motor común, mirada C «A pie de cama» y capa A «La célula por dentro» (sesión aparte); aviso de hiperK plegable y el dock que crece 31 px tras «Dar 90 mg»; móvil §7.7 de 9,3 a 9,5; `verFrase` con dos fotogramas en la rama `haz`; cotejar `PAG_FICHA` con el PDF; estados `hipok` y `hiperk-1..4` en el ritmo vivo con el ECG de hipoK, Mg y Ca. Propuestas de regla: choques de rótulos en los SVG en `jueces-movil.mjs`; `jueces.mjs --maqueta` con la prueba propia.

- **Visto de paso (29-30/10, `b3-paso4` g3-g4 y `eco-reforma`)** · ✅ aprobado el 30/10 (`mejoras-30-10`, `mv-eco`, `b3-pulmon-app`, `b3-cierre`):
  - Shock vivo: cambiar de paciente tarda 1-3 s (asienta 30 latidos) y el juez del móvil lo da por «mando no tocable»;
    ECMO + Impella da FC 56 y presión de pulso 1; el edema no llega a equilibrio (191 mL al abrir, 475 a los 80 s).
  - Pieza propuesta para `b3-pulmon-app`: **CPAP que sube el gasto del corazón que falla** (hoy el modelo no lo hace,
    con aviso de «límite del modelo»), con su fuente.
  - Glomérulo vivo con PAM 220: FG 163 mL/min (la ficha dice «sube, pero poco»).
  - Marino Fig. 18.3: VS × FC ≠ IC en la propia figura (nota de fidelidad, si se cita).
  - Eco: HP crónica con VD/VI 0,72 al defecto (la guía espera >1,0); el motor no calcula la VCI; las maquetas y las
    herramientas de `eco-mega` importan el motor y se romperán con la reforma.
  - Pruebas: `mayeutica-fichas.mjs` con `MAY_SOLO` da 3-4 rojos falsos; `shock-mide.mjs` apunta a una carpeta vieja.

- **Eco, visto de paso en `eco-calibra-a`** (28/10): el taponamiento no muestra la variación respiratoria de la E. (Los
  tres huecos de ese parte ya son la tarea `eco-calibra-b`, Consejo del 28/10.)
- **Corazón eléctrico, visto en el grupo 1 del `b3`** (28/10): el estado `tv` marca «Pulso 0» con ART 102/79; el enlace
  `ritmoVivo` no puede abrir la FA con «Llenado malo» ya puesto; `mayeutica-fichas.mjs` con 1-2 fichas da 2 rojos
  falsos; `--modelo mayeutica-fichas` tarda ~25 min por ficha.
- **Shock vivo, posparo de Virginia, visto en el grupo 2 del `b3`** (28/10): la PVC se queda en 2-4 mmHg y el plan
  pedía ≈12 (`autonomo/bloques/b3/plan-paso4-g2.md`). El modelo de la circulación solo sube la PVC si falla el
  ventrículo derecho; al endurecerlo caen la PCP y el IC. Hoy el aturdimiento es solo del izquierdo y no se ha tapado
  (REGLAS §1.11). Para que sea de los dos ventrículos (Marino cap. 21, p. 64) hay que cambiar ese modelo.

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

- **Visto de paso (`pif-ecg`, 27/10)**:
  - El quiz no admite imagen en el enunciado: los ejercicios con trazado viven en la ficha 11 y el quiz lleva la
    versión en texto.
  - López Ramírez, parte 3: las pp. 149-150 están repetidas (desplazamiento + 127 hasta la 150 y + 125 desde la 151).
  - Recortes `ej-74.png` y `ej-80.png` con texto del enunciado dentro; «Long-Ganong-Levine» (sic) sin nota visible en
    el caso 2.
  - Para `b3`: `abrirEstado` no acepta `extra.medir`; la tabla estado → ficha → página → trazado está lista para el
    corazón eléctrico (mejora 4 del debate).

## 5. 💡 Lo que yo propondría (no lo has pedido tú)

- **Ahorro · Pieza de motor nueva: barrido de extremos en su primera prueba** (propuesto 2026-10-31 por /ahorro) · Visto en: `b3-paso4` g4 (CPAP en Mateo, PAM 15) y `b3d` (alivio de la poscarga sin techo: VS 232 mL con 30 cmH₂O; neumotórax a saltos; 3 vueltas, ≈2,5 M) · Cambio: toda pieza de motor nueva lleva en su prueba un barrido de 0 al doble de su tope en cada paciente que la use, con «VS ≤ 1,4 × basal» y «paciente posible» (§1.14), antes de entregar · Ahorro esperado: ≈1,5-2,5 M por pieza de motor (una o dos vueltas de arreglos y un rejuicio).
- **Ahorro · Director: una sesión por mitad de la parada (piezas | arreglos y cierre), tope ≈150 pasos** (propuesto 2026-10-31 por /ahorro) · Visto en: `b3-paso4` g3a 1,1 · g3b 1,3 · g4 1,9 M y `b3d` 6,0 M (355 pasos; suite repetida tras dos fusiones de `main` y una batería cortada a la hora) · Cambio: el director cierra su sesión tras juntar las piezas (con `gasto.mjs`) y abre otra para arreglos, jueces y cierre; cada juez largo, lanzado por separado y nunca la batería entera de una vez · Ahorro esperado: ≈2-3 M por parada larga (cada paso del director relee su conversación).
- **Ahorro · Pieza de física del motor: presupuesto de «estado nuevo con barrido» y profesor al acabar la pieza** (propuesto 2026-10-31 por /ahorro) · Visto en: `mv-eco-2a` (P4 cola del latido 0,4 → 1,4 M, recalibró 5 formas) y `mv-eco-2b` (P1 e′ 0,9 → 1,4 M en 2 encargos; P6 shock 0,35 → 2,4 M en 3 vueltas: cumplió sus cifras pero cambió la enfermedad y solo lo vio el profesor al final) · Cambio: cada pieza que toca la física del motor o la escala g de un escenario se presupuesta a 1,2 M (no 0,4-0,9), su encargo lleva un programa corto que comprueba antes que los objetivos caben juntos en el motor, y el profesor (juicio rápido, 0,1 M) mira esa pieza antes de pasar a la siguiente · Ahorro esperado: ≈1-1,5 M por paso de motor (vueltas evitadas), y presupuestos que no se desvían +70-90 %.
- **✅ 30/10 (noche): aprobadas las 4 de Hacienda que quedaban** («quedan todas aprobadas») → `reglas-reforma`. Confirmado otra vez en el Congreso («acepto TODAS las propuestas pendientes de Hacienda»): ya estaban en REGLAS §4.14-§4.15; no queda ninguna propuesta de Hacienda pendiente.

- **Ahorro · Tareas técnicas del director: presupuesto con su pasada de jueces y una ruta de apertura** (propuesto 2026-10-30 por /ahorro) · Visto en: `reglas-30-10` (0,79 M frente a 0,3 M, +165 %) y `formula-juez` (≈0,95 M frente a 0,8 M, +19 %): en las dos se fue en buscar dónde estaba cada pieza (el origen de cada regla; cómo se abre cada modelo) y en las pasadas largas de jueces · Cambio: el presupuesto de un `arreglo` técnico que hace el director suma 0,2 M fijos por la pasada de jueces más 0,1 M por regla o modelo tocado, y el encargo trae la ruta de cada pieza (parte de origen, o «especialidad → ficha → Visual» de cada modelo) · Ahorro esperado: ≈0,2-0,3 M por tarea técnica (menos búsqueda) y presupuestos que ya no se pasan.
- **✅ 30/10: aprobadas todas las de abajo** (ahorros → `reglas-30-10`; preguntas viejas del bloque 3 → `b3-cierre`).
- **Ahorro · Las cifras de los casos se leen en el monitor de la app** (propuesto 2026-10-30 por /ahorro) · Visto en: `b3-paso4` g3b (vuelta 2 del caso de Remedios: la herramienta no leía lo mismo que la pantalla) y g4 (Ramiro: el programa daba PCP 30,8 y la app 32; lo cazó el profesor) · Cambio: el constructor de Estudiar copia las cifras de los casos con `autonomo/bloques/b3/herramientas/g4-app-cifras.mjs` (lee el monitor a 390 px), nunca con el programa del motor; línea en la lista del constructor · Ahorro esperado: ≈0,4 M por grupo (una vuelta de arreglos del caso).
- **Ahorro · Estados nuevos de un modelo vivo: uno por encargo y presupuesto real** (propuesto 2026-10-30 por /ahorro) · Visto en: `b3-paso4` g3a (3 estados en un encargo: 73 pasos, 2,9 M frente a 1,0) y g4 (3 etapas de la IC en un encargo: 71 pasos, 2,1 M frente a 0,5) · Cambio: un encargo por estado que pide calibrar el motor, presupuesto «estado nuevo con barrido» sonnet 30 pasos / 0,7 M en la tabla del tablero, y la prueba larga solo al final del último · Ahorro esperado: ≈0,8-1,2 M por grupo (menos relecturas de una conversación de 70 pasos).
- ✅ 01/11 **Ahorro · Pieza de motor: primero un script de dirección de 5 minutos** (propuesto 2026-10-30 por /ahorro) · Visto en: `b3-paso4` g3a (rotura del tabique: el motor bajaba la PCP, se vio tras construir) y g4 (CPAP: el VS bajaba en vez de subir; tres vueltas de motor, 1,4 M, y la interfaz esperando) · Cambio: antes de encargar la interfaz de una pieza de motor, un constructor sonnet de ≤10 pasos comprueba con un script que la cifra va en la dirección de la fuente; si no, el encargo es el motor, no la interfaz · Ahorro esperado: ≈0,5-0,8 M por pieza de motor que falla.

- ✅ 01/11 **Ahorro · Una pieza se presupuesta por lo que falta en el código** (propuesto 2026-10-28 por /ahorro) · Visto en: `b3-paso4` g1 (la cobertura citaba 5 estados que no existían; −1,5 M sobre lo previsto) y g2 (la «lupa reperfusion» era una lupa entera nueva: 1,2 M frente a 0,6; `posparo` era un tipo de paciente nuevo: 1,1 M frente a 0,6; desvío del grupo +29 %) · Cambio: antes de presupuestar, la revisión del encargo pega el `grep` de cada estado, lupa y escenario, y cada pieza se presupuesta como **estado** (0,5 M) solo si su lupa o su tipo ya existen; si no, como **modelo** (1,2 M); y el director mide antes las cifras del motor con un programa corto y da al constructor el objetivo que el motor puede dar · Ahorro esperado: no ahorra tokens de golpe, pero evita desvíos de 1-2 M por grupo (4 grupos quedan) y una comparecencia por grupo.
- (26/10, sigue en pie: toca ahora, en el paso 4) **Las preguntas viejas del bloque 3, a la vez.** Merino Cardiología (48) y Neumología (46) son los bancos con
  más preguntas «de redactar» (`js/data/merino-*-preguntas.js`) y son justo las fichas del bloque 3: reconvertirlas en
  la misma tanda evita tocar esas fichas dos veces.
- (23/10) Las dos propuestas que había (pulmón con respirador e inventario de estudio) te gustaron y pasan a
  «Apuntado» como B-013 y B-014.


- ✅ 01/11 **Ahorro · Medir el gasto tras las piezas, antes del Estudiar** (propuesto 2026-10-30 por /ahorro) · Visto en: b3-paso4 g2 (+29 %, medido al final) y g5 (+30 %, 11,7 M frente a 9,0, medido al final); en g3a se midió a mitad y se compareció a tiempo · Cambio: el director pasa `gasto.mjs --clave` al terminar las piezas y antes de lanzar el Estudiar, y comparece ahí si va a pasar del 25 % · Ahorro esperado: no baja tokens por sí solo, pero deja al usuario decidir antes de gastar ≈2-3 M de más por grupo.
- ✅ 01/11 **Ahorro · Hacienda no junta piezas con prueba propia en un encargo** (propuesto 2026-10-30 por /ahorro) · Visto en: g3a («estados», 3 en uno: 73 pasos, 2,9 M frente a 1,0) y g5 (5b+5c juntos por recorte de Hacienda: 80 pasos, 1,5 M frente a 0,9) · Cambio: en el modo presupuesto, Hacienda solo une piezas que no llevan prueba ni jueces propios; las que sí, un encargo cada una · Ahorro esperado: ≈0,5 M por grupo (menos esperas a jueces largos dentro de un mismo encargo).
- ✅ 01/11 **Ahorro · Director del paso 4 a 1,3 M** (propuesto 2026-10-30 por /ahorro) · Visto en: g3a 1,1 · g3b 1,3 · g4 1,9 · g5 1,3 M frente a 0,8-0,9 · Cambio: el presupuesto del director de un grupo con piezas + Estudiar pasa a 1,3 M en «Presupuestos vigentes» (o, si se quiere bajar, partir piezas y Estudiar en dos sesiones) · Ahorro esperado: ninguno directo; presupuestos realistas que evitan comparecer por el director.
- ✅ 01/11 **Ahorro · Continuar al mismo constructor solo si el primer encargo acabó en ≤30 pasos** (propuesto 2026-10-31 por /ahorro) · Visto en: `educacion-app` río (constructor continuado para E2 y dos vueltas: 72 pasos, 2,3 M frente a 1,4; +40 %) y `educacion-app` parte 3 (B1 33 pasos → B2 continuado hasta 78: 2,1 M frente a 1,6; +31 %); en el motor (E1+E2, 1,1 M frente a 1,8) sí ahorró porque el primero fue corto · Cambio: REGLAS §4.8 R5: el segundo encargo va al mismo constructor solo si el primero acabó en ≤30 pasos; si no, constructor sonnet nuevo con el informe del primero · Ahorro esperado: ≈0,5 M por tarea con dos encargos encadenados.

## 6. Hecho (últimos 7 días)

- 2026-11-01 · **Consejo del 01/11** (vídeo https://claude.ai/artifact/RTgGFnbio4SJAA52ZH6Lf3): vía libre hasta el 22/11; eco al 9,5 antes de encender el dibujo nuevo; `mr` a `main` solo con texto; 6 recortes de ahorro aprobados (`reglas-01-11`); Radiología parte 2 aparcada; Semiología espera tu PDF.

- 2026-10-30 · **Congreso (Consejo 12.ª)**: revisión de todas las sesiones de hoy, tres planes (Marino, motor de la eco,
  webs) y la gran reforma para terminar la app (B-050), en https://claude.ai/artifact/FDmogy5RHB419Z9iBXCoNP. PR #37
  (maquetas de Educación), #40 («Todo lo estudiado») y #41 (mapa del `b4`) fusionadas; `radio-informe` hecha; tus 4
  decisiones apuntadas (Hacienda, vía libre con topes, SCA y disección vistos, Radiología ya).
- 2026-10-30 · **Atlas de eco, fase A**: caps. 15, 19, 21, 17, 11, 13 y 12 traducidos y en `main` (16 de 30); el 16, en la PR #49.
- 2026-10-30 · **Radiología del PIF, días 2 y 3** (PR #42, por fusionar): rótulos en 6 Rx/TC, «TC de cráneo en 5
  preguntas» y «Lee esta placa». **Raíz aórtica** (PR #46, por fusionar) y **contrato de la eco** (`mv-eco-1`, PR #44).
- 2026-10-30 · **Wiggers en el móvil** (`wiggers-movil`, en `main`) y **la reforma en las reglas** (`reglas-reforma`).

- 2026-10-30 · **PR #47 en `main`** (el mínimo del PIF de Cardiología: 6 objetivos, «léelo en orden», tabla arteria → ECG y 8
  preguntas): Consejo 10.ª + tu excepción a la condición 3; versión 20261030-28, jueces a favor.
- 2026-10-30 · **Regla del código ajeno** (Consejo 8.ª): aprobada por el usuario con su cambio (permiso de palabra con nota
  en `docs/`); aplicada en `CLAUDE.md` §7.9 y REGLAS §1.6. Ventriculus: B + A (vara de medir fuera de la app y sus textos), no C.
- 2026-10-30 · **Parada 3 del bloque 3 aprobada** por ti (grupos 1-5 y los 3 modelos vivos, mirados en el móvil). Pedida la ingeniería inversa de anatomyatelier.org (sesión abierta, para `mv-eco`).

- 2026-10-30 · **Consejo, 7.ª reunión** («terminar ya», acta `autonomo/consejo/2026-10-30-7.md`): cabos sueltos
  cerrados; Wiggers aprobado (`wiggers-movil`); vía libre de gasto hasta el 02/11; radio día 2 hoy; B-044 a B-046
  apuntadas; recomendación de la reforma artículo a artículo.

- 2026-10-30 · **Reforma de la eco, informe** (`eco-reforma`, B-039): qué falla en el motor, ingeniería inversa de
  pulmonarypocus, opciones A/B/C y 3 maquetas vivas. 3,5 M (−20 %). Espera tu elección.
- 2026-10-28/30 · **Bloque 3, paso 4, grupos 2-4** (en `auto/b3`): Estudiar en 8 fichas más (parada; shock
  cardiogénico, fármacos y soporte; IC) con 6 casos; motor de la circulación arreglado (PVC, VD que falla, edema,
  rotura del septo); CPAP en el motor. Profesor 8,25-8,75. **Marino: 50 de 155.**
- 2026-10-29 · **Ley de Ciencia** validada entera (Objetivo L) y Consejos del 29/10 (VentLoop, raíz aórtica, Impella;
  dos carriles). Anatomy Atlas → `tecnicas-capitulos`.
- 2026-10-29 · **Educación pionera, fase 3**: 3 maquetas y página (PR #37, en borrador). Tu parada, el 04/11.
- 2026-10-28 · **Repaso espaciado**: decidiste guardar la fecha del último intento en el mismo registro de aciertos y fallos (en tu móvil; `CLAUDE.md` §2). **2.º Consejo**: encargo de Educación pionera (3 maquetas, ≈6 M; 30/10 y 02/11; parada el 04/11).
- 2026-10-28 · **Primer Consejo de Ministros** (acta `autonomo/consejo/2026-10-28.md`): resueltas las 5 dudas de Marino, el ETE se queda como fuente de lo que ya está en el tablero, informe de la eco recomendado y pestaña «Mayéutica» en toda la app (29/10). ≈0,5 M.
- 2026-10-28 · **Consejo de Ministros y Ministerio de Educación** (B-037, B-038, en main): REGLAS §4.12 y skill `/mayeutica`.
- 2026-10-28 · **Reforma del gobierno** (B-036, en main): `/plan-socialista` presenta presupuesto y rinde cuentas,
  `/ahorro` recorta sola antes de gastar (queda escrito), `/bitacora` lleva el rumbo con el gasto; apruebas por
  bloque; comparecer si se pasa más de un 25 % (REGLAS §4.10).
- 2026-10-28 · **24 reglas y 6 ahorros aprobados** (los puntos 7-12): en REGLAS §4.11 (jueces, cobertura, fuentes,
  constructores, sesiones).

- 2026-10-28 · **Cuaderno «ECG y arritmias»** (`pif-ecg`, PR #36, en main): PIF → Cardiología, 11 fichas del libro
  de López Ramírez con ~60 trazados reales, lector de ECG, 28 ejercicios, tarjeta «¿Rápido o lento?» y 125
  preguntas. Profesor 8,25-9; auditores, graves corregidos.

- 2026-10-27 · **Plan del ECG** (`ecg-plan`, B-033): 3 caminos (guardia, desde cero, laboratorio de arritmias) con
  piezas y gasto (https://claude.ai/artifact/6bVRWXYtCi8rFx7NZZYB3c). Aprobado: 6 tareas en el tablero; Anatomy, skill.
- 2026-10-27 · **Informes con gasto** (Objetivo P): paso 4 del `b3`, `eco-calibra` y competencias R1. Elegiste la A en
  los dos primeros.

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

- **30/10 · Mejoras del bloque 3 que dejó el Consejo 11.ª** (condición de Justicia al fusionar la PR #51; sin aprobar): piezas de los grupos 2-5 que el profesor puntuó entre 8 y 8,75 con la regla vieja (g2 2b/2c; g3 iam-vd, septo 7,75, fármacos, soporte, papilar; g4 f14 8,1, f13, ic-cpap; g5 SCA-diagnóstico, tabique, antiagregantes/lisis, disección): un rejuicio corto por grupo (R8) y lo que el profesor dijo que las subiría, ≈0,4-0,6 M por grupo. También: `js/modules/eco/pruebas/atlas.test.mjs` falla en `main` por el cap. 16 del atlas sin figura (sesiones `atlas-texto`).
