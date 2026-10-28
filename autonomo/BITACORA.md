# Bitácora

La lleva la skill `/bitacora` (`.claude/skills/bitacora/SKILL.md`). Aquí está **lo que se quiere hacer y aún no está
aprobado**, lo que espera algo del usuario y lo hecho en la última semana. Lo aprobado vive en `TABLERO.md`, que es
lo único que trabaja el plan socialista. Lo hecho hace más de 7 días y lo descartado pasan a
`docs/historial/bitacora.md`.

Última sincronización: 2026-10-28, tarde (sesión «Plan Marino 100 %»): partes del grupo 1 de `b3-paso4` y de `eco-calibra-a` (sesión 2) leídos; ninguna tarea en revisión.

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
| `educacion-pionera` | **B-040 · Educación pionera** (modelos vivos + preguntas socráticas; la IA diseña, la app no conversa) | aprobado: encargo del Consejo del 28/10 (2.ª reunión); ≈6 M, tope 8 M | 2026-10-28 | Fase 1 el 30/10, fases 2-3 el 02/11; **parada contigo el 04/11** con 3 maquetas |
| `b3-pulmon-*`, `b3-cierre`, `b4`, `b5`, `b6a`, `b6b` | **B-035 · Plan Marino 100 %** (42 de 155 fichas con Estudiar el 28/10) | aprobado el 28/10: objetivo ≈212-328 M, **techo 400 M**, Hacienda en cada tarea | 2026-10-28 | Fin previsto entre el 22/11 y el 05/12. Objetivo M5, filas 9-16 |
| `eco-reforma` | **B-039 · Reforma integral de la eco**: informe con maquetas visuales de los dos motores | aprobado el 28/10; programado el 01/11 (4-6 M) | 2026-10-28 | La decisión de arquitectura, después, es tuya. `f0-eco-*`, `f2-ete`, `b3-ritmo-motor` y el atlas esperan |
| `consejo`, `mayeutica` | **B-037 y B-038**: Consejo de Ministros (poderes: todo menos presupuesto total, arquitectura, quitar contenido y la última parada de cada bloque) y Ministerio de Educación (`/mayeutica`: escuela, arte e ideas) | hechas (28/10, en main): REGLAS §4.12 y la skill; primer Consejo el 28/10 (acta `autonomo/consejo/2026-10-28.md`) | 2026-10-28 | Acuerdos: `mayeutica-pestana` el 29/10 antes del grupo 2; `b3-bradi` corta; `b3-ritmo-motor` y `f2-ete`, aparcadas hasta B-039 |
| `gobierno` | **B-036 · Trabajar como un gobierno**: Interior (`/plan-socialista`) presupuesta y rinde cuentas, Hacienda (`/ahorro`) recorta sola y lo deja escrito, Transportes (`/bitacora`) lleva el rumbo; tú apruebas el presupuesto de cada bloque; comparecer si se pasa >25 % | hecha (28/10, en main): REGLAS §4.10 y las tres skills | 2026-10-28 | Primera prueba: grupo 2 de `b3-paso4` (29/10) |
| `b1-*` | **Objetivo M5 · bloque 1** (caps. 1-11) | hecho el 20/10 | 2026-10-19 | |
| `b2` | **Bloque 2** (caps. 12-13) | hecho el 21/10 (PR #26) | 2026-10-20 | |
| `b3` | **Bloque 3** (caps. 14-30, con el pulmón con respirador) | paradas 1 y 2 **hechas y en main** (PR #32 y [#35](https://github.com/alvariitoSW/fiebres-neutropenias/pull/35), 27/10). **Paso 4: plan escrito, sin construir** (`autonomo/bloques/b3/plan-paso4.md`): 17 fichas en 6 grupos, 17 piezas nuevas, ≈35-40 M en 10-12 sesiones; espera tu decisión | 2026-10-21 | Ver «Dónde quedó el bloque 3» abajo |
| `reglas-b3p2` | Las 4 reglas de la parada 2 del `b3` (`.claude/`, una sesión por modelo, botones estables, maqueta a la app en dos encargos) | hecha (27/10, en main) | 2026-10-27 | aprobadas por el usuario el 27/10 |
| `encargo-revisado` | **B-031**, dos ideas de Spec Kit: revisar el encargo antes de gastar y lista de calidad del encargo (sin instalar Spec Kit) | hecha (27/10, en main) | 2026-10-27 | «vamos solamente con la B-031» (27/10) |
| `tee-inversa` | **Ingeniería inversa del simulador TEE** (anesthbeta) | ✅ elegido el 25/10: entra en el plan de integración | 2026-10-23 | Ver «Dónde quedó tee-inversa» abajo |
| `rea-*` | **Ingeniería inversa de EchoSuite, AngioView y NavRad** (B-009 a B-011) | ✅ elegido el 25/10: entra en el plan de integración | 2026-10-23 | Informe conjunto: https://claude.ai/artifact/T4WcxXWzjPGm911ShU3aiS |
| `rea-radiologyassistant`, `rea-ritmolab` | **Ingeniería inversa de Radiology Assistant y RitmoLab** | ✅ elegido el 25/10: entra en el plan de integración | 2026-10-23 | Informe: https://claude.ai/artifact/1GTkuwubZ22Hb9qu4PW4P5 |
| `ecg-guardia`, `arritmias-*`, `ecg-vector-*` | **B-033 · ECG en tres caminos** (leer juntos en la guardia, laboratorio de arritmias, vector y 12 derivaciones). Plan: https://claude.ai/artifact/6bVRWXYtCi8rFx7NZZYB3c | aprobado el 27/10: 6 tareas en el tablero (Objetivo I, filas 28-33); Anatomy instalado como skill el 27/10; las 2 primeras, programadas para el 28/10 por la mañana | 2026-10-27 | «guarda el informe en tareas para hacer […] y que se programe para mañana por la mañana» (27/10). Decisiones: las recomendadas del plan (supongo; cámbialas antes de que arranquen si quieres otra) |
| `rea-2` | **Segunda pasada de las 6 webs + NV-Reason-CT** (método v2): megaproyecto «La UCI en el bolsillo» | ✅ elegido el 25/10: entra en el plan de integración | 2026-10-25 | Pedido el 25/10: «un megaproyecto faraónico para incluirlas y poder usarlas en la vida real… como médico intensivista y para estudiar» |
| `radar`, `vuelta-modelos` | **B-012 y B-016** | hechas (PR #28 y #29, en main) | 2026-10-25 | |
| `eco-mega` | **B-015 · Megaproyecto de la eco** | paradas 1, 2 y 3 **hechas y en main** (PR #30 y #34, 27/10). Siguiente: informe `eco-calibra` (B-027 + B-029, aprobado el 27/10) | 2026-10-25 | Maqueta: https://claude.ai/artifact/DMwoT6wzupV4e48KNN2R4b |
| `inventario` | **B-014 · Inventario de estudio** | hecha (26/10, PR #31) | 2026-10-25 | Informe https://claude.ai/artifact/894zY7AfqYQC3QWP1Yjxir |
| `pif-ecg` … `f4-recorridos` | **Objetivo I · Integración** (rumbo del Radar del 25/10): fase 1, fase 0, G1-G6 y fases 2-4, 26 tareas | pasado al tablero el 27/10: 13 `pendiente`, 13 `aparcada` (esperan PDF o terminar Marino) | 2026-10-27 | «sí, pásalo al tablero» (27/10). Orden: fase 1 → fase 0 → G1 |
| `b3-paso4-opciones`, `eco-calibra`, `competencias-r` | **Objetivo P**: informes con gasto antes de construir: paso 4 del `b3`, **B-027 + B-029** (motor diastólico y HP crónica de la eco) y **B-032** (competencias por año) | hechos (27/10); R2-R5 de competencias, a medias | 2026-10-27 | Elegiste: paso 4 opción A (17 piezas, ≈36 M) y eco opción A |
| `eco-calibra-a`, `b3-paso4` | Arreglar el motor de la eco (≈5,5 M, 28-29/10) y paso 4 del `b3` por grupos encadenados (≈36 M, grupos 1-6 del 28 al 30/10; parada 3 contigo el 31/10) | pendiente (programadas) |
| `azul-cobertura`, `radio-informe` | **Objetivo P2**: mapa de El Libro Azul frente a Marino y propuesta del PIF de Radiología (B-034), solo informes | pendiente (31/10) | 2026-10-27 | «Sí a todo» (27/10, noche) |
| `ecg-*`, `arritmias-*`, `competencias-r2r5` | Cardiología del PIF y competencias R2-R5 | aparcadas el 27/10 por la prioridad nueva | 2026-10-27 | «Me quedo con la opción A…» (27/10) |
| `pif-ecg` | Cuaderno «ECG y arritmias» del PIF de Cardiología (con «La alegría de leer el ECG») | **hecha (28/10, en main)**: PR #36 aprobada por el usuario | 2026-10-27 | `ecg-guardia` (aparcada) seguirá en una PR nueva desde `main` |
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

- **Recordar más adelante (pedido el 28/10)**: los puntos 18-22 de esa tarde: 2 papers del issue #27, abrir sitios
  de la red, PDF opcionales (AHA 2020/ERC 2021, SCAI 2015, Valdenebro 2021), clave del panel de subida y temas viejos
  (three.js, repaso espaciado, velocidad del plan, rutina nocturna). Aviso programado para el 04/11.


- **✅ Bloque 3, paso 4: decidido el 27/10**, opción A (las 17 piezas, ≈36 M). Tarea `b3-paso4`, empieza el 28/10.

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
- **Bandeja del Radar, arreglada el 27/10 (noche), por comprobar el 28/10**: la tarea diaria se lanzaba sin el
  repositorio ni permiso de escritura en GitHub. Borrada; la nueva (6:42 de Canarias) dispara en una sesión que sí lo
  tiene y abre la sesión de trabajo con el repositorio. Esperan 4 tuits del issue #27. `x.com` abierto el 27/10 (comprobado: se lee el texto del tuit); `twitter.com`,
  `*.twimg.com` y `threadreaderapp.com` siguen cerrados (no hacen falta para leer un tuit suelto).
  **Comprobado el 28/10**: la tarea corrió y leyó los 4 tuits (el texto va dentro de la página de `x.com`). No
  se pueden abrir `t.co`, `doi.org`, PubMed, Europe PMC ni criticalcarereviews.com: los papers se buscan por título
  en la web y, si no aparecen o son de pago, se pide el PDF en el issue. 2 papers esperan PDF/enlace del usuario.
- **Tareas programadas hasta el domingo** (27/10, noche, «sí a todo»), todas con ese mismo arreglo: 28/10 7:40 abre
  `b3-paso4` (grupo 1) y `eco-calibra-a` · 29 y 30/10 7:40, el siguiente grupo y la eco si falta · 31/10 8:13,
  `azul-cobertura`, `radio-informe` y el `b3` si falta. Los grupos del `b3` además se encadenan solos.
  La vieja de `arritmias-maqueta` la borró el usuario el 27/10 (comprobado).
- **AngioView (cateterismo)**: el informe está hecho (23/10, https://claude.ai/artifact/T4WcxXWzjPGm911ShU3aiS),
  pero sus tareas (`f2-coronarias`, `f2-angio`) están **aparcadas**: esperan las coronarias en el motor y una fuente
  de las proyecciones (Di Mario 2005 es de pago). Por eso no lo ves en la app.
- **Prioridad nueva (27/10, noche)**: Marino → El Libro Azul → lo de las webs (ingeniería inversa: eco, AngioView,
  RitmoLab…) y los modelos vivos → pulir la eco → el PIF rehecho con lo nuestro (B-005) y Radiología (B-034).
  Cardiología del PIF (ECG, laboratorio de arritmias) deja de ser prioridad.
- **🔴 Red del entorno** (todo gratis): `x.com`, `*.twitter.com`, `*.twimg.com`, `threadreaderapp.com` (leer tuits e
  hilos); `huggingface.co`, `arxiv.org` (NV-Reason-CT); `heart.org` (AHA 2025); `zenodo.org`,
  `*.cancerimagingarchive.net`, `*.radiopaedia.org`, `registry.opendata.aws` (licencias de casos de imagen).
- **🔴 PDF que hacen falta**, por urgencia: Leung y Levine 1994 (opcional) (los temarios del PIF no
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
- **El Libro Azul**: **completo** en `docs/` (secciones I a X, caps. 1-61). Las IV, V, VI, VIII, IX y X llegaron el
  27/10 (abajo). Orden que pediste: Marino (hecho), después El Libro Azul y después el PIF
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
  - `libro-azul-seccion-iv-respiratorio-parte3.pdf`: caps. 34-36 (bases de las técnicas, trabajo respiratorio,
    retirada de la ventilación mecánica), pp. 565-608; +564 (pdf 1 = 565, pdf 21 = 585, pdf 40 = 604).
  Desbloquea la segunda parte de B-004 (secciones nuevas, cuando la apruebes).
- **PIF de R1**: ya no se espera ningún PDF de temario (27/10): ver B-005.
- **TRR**: el PDF de Valdenebro 2021, para cotejar las 7 dudas anotadas en `docs/historial/nefrologia.md`.
- **Panel de subida**: la clave de la API y desplegar el Worker (`backend/README.md`).
- **Velocidad del plan socialista**: hay propuestas (dos constructores a la vez, pruebas largas al final, los jueces a
  la vez desde la 1.ª vuelta; de ~2 h 45 a ~1-1 h 15 por capítulo). Tu decisión del 14/10: **todavía no**.
- **Eco, paradas 1 y 2 ya en main (27/10)**: mirarlas en el móvil (Eco cardíaca → simulador: A4C, subcostal,
  «Derrame» y «Hemorragia» a fondo, TEP, «Señálalo → Festones y cúspides»). La parada 3 (F3, F4, N1, P5, P6) espera
  los PDF de los huecos. Si tienes la **ASE 2025** en PDF, también daría la PAD con ventilación mecánica.
- **Sesiones cerradas (hecho el 27/10)**: las sesiones del plan se cierran solas y cada una deja su fila en
  `autonomo/SESIONES.md` (tarea, qué salió, informe o PR, qué te toca, parte y enlace a la sesión archivada). El
  informe «Bitácora diaria» lo lee y ya no se archiva a sí mismo.
- **2 PDF para cerrar los huecos del bloque 3** (`fuentes-b3`, 27/10): AHA 2020 de soporte vital (o ERC 2021) y el
  consenso SCAI 2015. Sin ellos, esos puntos quedan marcados como hueco. (La ESC 2019 de TSV y la ESC 2023 de
  miocardiopatías ya están en `docs/`, 27/10: los huecos que cubren se pueden citar ya.)
- **Rutina nocturna** (que el plan trabaje solo de madrugada, ~3:00 de Canarias, con aviso al móvil): **no montarla
  aún**; límite fijado el 27/10: como mucho el 18 % del uso semanal en un día (tablero).

## 4. Mejoras de lo que ya existe

- **Eco, tres huecos que dejó `eco-calibra-a`** (28/10, para la sesión de la eco, no la de Marino): el fallo al 100 %
  (shock cardiogénico) no es coherente (profesor 5,5); el TEP no tiene escalón submasivo → masivo (6); la hipertrofia
  grado 1 da DT ~420 ms (7,5). Visto de paso: el taponamiento no muestra la variación respiratoria de la E.
- **Corazón eléctrico, visto en el grupo 1 del `b3`** (28/10): el estado `tv` marca «Pulso 0» con ART 102/79; el enlace
  `ritmoVivo` no puede abrir la FA con «Llenado malo» ya puesto; `mayeutica-fichas.mjs` con 1-2 fichas da 2 rojos
  falsos; `--modelo mayeutica-fichas` tarda ~25 min por ficha.

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

- (26/10, sigue en pie: toca ahora, en el paso 4) **Las preguntas viejas del bloque 3, a la vez.** Merino Cardiología (48) y Neumología (46) son los bancos con
  más preguntas «de redactar» (`js/data/merino-*-preguntas.js`) y son justo las fichas del bloque 3: reconvertirlas en
  la misma tanda evita tocar esas fichas dos veces.
- (23/10) Las dos propuestas que había (pulmón con respirador e inventario de estudio) te gustaron y pasan a
  «Apuntado» como B-013 y B-014.


## 6. Hecho (últimos 7 días)

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
