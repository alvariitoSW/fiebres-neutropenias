# Bitácora

La lleva la skill `/bitacora` (`.claude/skills/bitacora/SKILL.md`). Aquí está **lo que se quiere hacer y aún no está
aprobado**, lo que espera algo del usuario y lo hecho en la última semana. Lo aprobado vive en `TABLERO.md`, que es
lo único que trabaja el plan socialista. Lo hecho hace más de 7 días y lo descartado pasan a
`docs/historial/bitacora.md`.

Última sincronización: 2026-10-27, tarde (PR #34 de la eco, parada 3, en main; `jueces-topes`, `jueces-movil`,
`movil-existente` y `propuestas-movil` hechas en main; `fuentes-b3` y las pantallas del `b3` hechas en `auto/b3`).

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

### B-027 · Eco: el motor diastólico (E/A, aurícula y venas pulmonares) · apuntado 2026-10-27
- **Lo que dijiste** (27/10, al saber del E/A): «habría que hacer un informe sobre cómo mejorarlo mediante
  /plan-socialista, ver el gasto que supondría y aprender de este fallo que hemos ido arrastrando».
- **El fallo** (parada 3 de `eco-mega`, `autonomo/bloques/eco-mega/p3-f3b.md` y `profesor-p3.md`): en el panel del
  Doppler mitral, el E/A sale **10** en la hipertrofia (onda A casi nula: enseña la lección al revés; con mala
  relajación debería ser <1) y **3,9** en la dilatada (restrictivo posible). Además, el flujo de las venas pulmonares
  del motor es ~2-3 veces el real (pico de `qVp` ~600 mL/s; el área de las venas está achicada a 2,5 cm²
  «ilustrativo» para disimularlo), la onda a de la AI llega a ~15 mmHg, la D venosa del TEP sale 0 y la AD tiene el
  mismo defecto. Arreglarlo exige recalibrar la AI (contracción sumada a la curva pasiva, `rVp`, `rPul`) y, con
  ello, el TEP, el derrame y la HP crónica, que se calibraron encima (opción 1 de F3b: ~7 pruebas a recalibrar).
- **Cómo lo entiendo**: tipo `arreglo` grande del motor, en dos pasos. (1) **Informe** con `/plan-socialista`:
  qué está mal, la calibración objetivo con su fuente (Nagueh 2025, ya en `docs/`: patrones de llenado, E/A, S/D,
  Ar; Lang 2015 p. 24: bomba auricular 15-30 %), el orden y el **gasto estimado**. (2) La recalibración, si la
  apruebas. **Lección** para las reglas: ninguna prueba pedía un E/A ni un flujo venoso de paciente posible por
  forma, así que cada pieza se calibró sobre un error de base y se fue arrastrando; propuesta: una red «paciente
  posible del Doppler» (E/A, E/e′, S/D, TAPSE, velocidades) por forma, como la de PA y FC.
- **Depende de**: nada (las fuentes ya están). **Tamaño**: informe pequeño; la recalibración, 1 sesión.

### B-028 · Eco: bibliografía de física de los ultrasonidos para el realismo de la imagen · apuntado 2026-10-27
- **Lo que dijiste**: «¿Debería subir bibliografía sobre la ecografía para mejorar el realismo de las imágenes?».
- **Cómo lo entiendo**: hoy el moteado, las sombras, la reverberación, la ganancia y el desenfoque del haz son
  «fisiología general» o «ilustrativo». Un libro de física de los ultrasonidos con figuras (p. ej. un manual de
  principios e instrumentación de la ecografía) daría cifras y página a esas decisiones. Lo que más falta, por orden:
  (1) ese libro; (2) Leung y Levine 1994 (opcional). **Ya en `docs/` (27/10, en `main`)**: ESC/ERS 2022 de HP (2
  partes), ESC 2021 de amiloidosis, MAPSE (Cirin 2024, Falconer 2025): llenan los huecos de la parada 3 de `eco-mega`
  (IE >1,1 de la HP, forma «amiloidosis», MAPSE), para una parada 4 cuando la apruebes.
- **Espera**: el libro de física, cuando quieras; no corre prisa.

### B-029 · Eco: la HP crónica a fondo deforma el corazón (y el dibujo recorta el volumen) · apuntado 2026-10-27
- **Lo que dijiste** (27/10, con dos capturas del móvil: HP crónica con la gravedad al 100 %, A4C con sonda libre y
  corazón 3D): «ha deformado el corazón que parece una nave espacial y aquí falla con una regla y es que esto no es
  ni anatómico ni fisiológico […] hay que hacer muchas más mejoras en la parte de eco».
- **Lo que se ve**: a fondo, el 3D enseña el corazón aplastado en un disco con el aviso «⚠ volumen fuera del rango del
  dibujo: se muestra en su límite», y el A4C pierde la forma de las cámaras. Rompe `CLAUDE.md` §12: una cifra que se
  sale no se recorta en el dibujo; se busca el error en su origen (la resistencia pulmonar ×12 y la pared del VD ×2,4
  de la forma `hpcronica` llevan el VD a volúmenes que la geometría no sabe dibujar, y la FE del VD del TEP y la HP
  graves ya era de 9-13 %: ver §4, punto 7). Ningún juez lo cazó porque las pruebas miden cifras, no la silueta 3D
  a fondo.
- **Cómo lo entiendo**: tipo `arreglo` de la eco, con informe primero (va junto a B-027, el motor diastólico, porque
  los dos son calibración del motor y del dibujo en los extremos): (1) recalibrar `hpcronica` a fondo a un VD posible
  (Mukherjee 2025, ESC/ERS 2022 ya en `docs/`); (2) que el dibujo cubra todo el rango del motor sin recortar;
  (3) una prueba nueva: cada forma, a g 0, defecto y 1, sin el aviso de «fuera del rango del dibujo» y con la
  silueta 3D dentro de unos límites de forma; (4) repasar las demás formas a fondo con capturas del 3D.
- **Propuesta de regla**: los jueces de la eco abren cada forma al 100 % y fallan si sale el aviso de recorte.

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
| `b3` | **Bloque 3** (caps. 14-30, con el pulmón con respirador) | parada 1 **cerrada** (27/10, «sí a todo»): maquetas v3, topes, pantallas del respirador y del balón (8,7) y fuentes buscadas; **siguiente: parada 2** (shock, ritmo y receptor a la app). [PR #32](https://github.com/alvariitoSW/fiebres-neutropenias/pull/32) en borrador | 2026-10-21 | Ver «Dónde quedó el bloque 3» abajo |
| `tee-inversa` | **Ingeniería inversa del simulador TEE** (anesthbeta) | ✅ elegido el 25/10: entra en el plan de integración | 2026-10-23 | Ver «Dónde quedó tee-inversa» abajo |
| `rea-*` | **Ingeniería inversa de EchoSuite, AngioView y NavRad** (B-009 a B-011) | ✅ elegido el 25/10: entra en el plan de integración | 2026-10-23 | Informe conjunto: https://claude.ai/artifact/T4WcxXWzjPGm911ShU3aiS |
| `rea-radiologyassistant`, `rea-ritmolab` | **Ingeniería inversa de Radiology Assistant y RitmoLab** | ✅ elegido el 25/10: entra en el plan de integración | 2026-10-23 | Informe: https://claude.ai/artifact/1GTkuwubZ22Hb9qu4PW4P5 |
| `rea-2` | **Segunda pasada de las 6 webs + NV-Reason-CT** (método v2): megaproyecto «La UCI en el bolsillo» | ✅ elegido el 25/10: entra en el plan de integración | 2026-10-25 | Pedido el 25/10: «un megaproyecto faraónico para incluirlas y poder usarlas en la vida real… como médico intensivista y para estudiar» |
| `radar`, `vuelta-modelos` | **B-012 y B-016** | hechas (PR #28 y #29, en main) | 2026-10-25 | |
| `eco-mega` | **B-015 · Megaproyecto de la eco** | paradas 1, 2 y 3 **hechas y en main** (PR #30 y #34, 27/10). Siguiente, sin aprobar: B-027 y B-029 | 2026-10-25 | Maqueta: https://claude.ai/artifact/DMwoT6wzupV4e48KNN2R4b |
| `inventario` | **B-014 · Inventario de estudio** | hecha (26/10, PR #31) | 2026-10-25 | Informe https://claude.ai/artifact/894zY7AfqYQC3QWP1Yjxir |
| `pif-ecg` … `f4-recorridos` | **Objetivo I · Integración** (rumbo del Radar del 25/10): fase 1, fase 0, G1-G6 y fases 2-4, 26 tareas | pasado al tablero el 27/10: 13 `pendiente`, 13 `aparcada` (esperan PDF o terminar Marino) | 2026-10-27 | «sí, pásalo al tablero» (27/10). Orden: fase 1 → fase 0 → G1 |
| `jueces-topes` | Jueces que llevan cada mando de un modelo vivo a su tope (REGLAS §1.14) | hecha (27/10, en main): 7 de 8 modelos ✅; el ácido-base da pH 6,36 (tarea `topes-acidobase`) | 2026-10-27 | Técnica: directo a main |
| `pulmon-respirador` | **B-013 · Pulmón con respirador** | aparcada hasta después del bloque 3 | 2026-10-25 | |
| `bandeja` | **B-017 · Bandeja del Radar** (issue #27 de GitHub) | ⏸ bandeja creada; la tarea diaria, **pausada**: hay que crearla desde la app con el proyecto elegido (texto en `autonomo/radar/LEEME.md`) | 2026-10-25 | Opción A elegida por el usuario: 0 €, sin Telegram ni clave de pago |
| `formula-comun`, `potasio-prioritario`, `objetivos-casos`, `eco-vci-retenido`, `monitor-comun` | **B-018 a B-022**, mecánicas nuevas en los modelos vivos (informe de `vuelta-modelos`) | Objetivo V: cuatro hechas y en main (25-27/10); `monitor-comun`, aparcada hasta el bloque 3 | 2026-10-25 | «me parece todo perfecto, estoy de acuerdo en lo que dice el profesor» (25/10) |
| `notas-meta` | **B-023**, llegar al 8,75 sin gastar de más (modelos, tokens y vueltas) | hecha (27/10, PR #33): R1-R9 aprobadas y en `REGLAS.md` §4.8; R1 automático, tarea `jueces-movil` | 2026-10-25 | «apruebo todas las propuestas de regla de R1 a R9» (27/10) |
| `jueces-movil` | Juez automático del móvil (R1 de `notas-meta`) | hecha (27/10, en main) | 2026-10-27 | Técnica: directo a main |
| `movil-existente`, `propuestas-movil` | Arreglar en el móvil lo que cazó el juez nuevo (8 modelos vivos y Marino · Fundamentos) y la pieza común `verFrase()` | hechas (27/10, en main) | 2026-10-27 | |
| `reglas-27-10` | Las 3 propuestas de ahorro y las 5 reglas de los partes del 27/10, a las reglas del plan; límite de gasto: 18 % del uso semanal al día | pendiente (aprobada 27/10) | 2026-10-27 | Antes de la parada 2 del `b3` |
| `topes-acidobase` | Ácido-base vivo: el pH 6,36 con varios mandos a tope, arreglado en su origen | pendiente (aprobada 27/10) | 2026-10-27 | Pequeña, constructor barato |
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

- **Respondido el 27/10, «sí a todo»**: shock, corazón eléctrico y receptor pasan a la app (**parada 2, la
  siguiente**: `/plan-socialista b3` en una sesión nueva); el deslizador del receptor se queda como está; el esquema
  del pulmón vale; el neumotórax a tensión, escena aparte. Las **pantallas como las reales** (respirador y consola
  del balón, 8,7 las dos) están aprobadas y en `main` como maquetas; los errores de temporización del balón ya tienen
  fuente (`fuentes-b3`).
- **Hecho y en la rama `auto/b3`** (sin PR aún): las 26 fichas con 290 ids por sección y su página, vista Visual en
  Merino Cardiología y Neumología, hallazgos de fidelidad arreglados, y Texto | Estudiar en las 9 del shock (152
  preguntas, casos de Mateo, Amparo, Nerea y Begoña), auditadas (0 graves) y corregidas.
- **Ya en `main`**: el motor del latido llega a shock sin romperse (2 vueltas), con entrada de soporte (Impella, ECMO,
  balón); el «← VOLVER A LA FICHA» del ecógrafo.
- **Siguiente, tras su «ok»**: construir en la app la cabecera del shock (pasar `comun/` a `js/core/`), el receptor
  vivo y el corazón eléctrico (sub-bloques 3A → 3B → 3C), con jueces, auditor y profesor; el hueco del caso de Amparo
  (control del foco, p. 11).
- **Lo que falta de él**: nada de fuentes (la ESC 2021 de marcapasos ya está en `docs/` desde el 26/10).
- Documentos: `autonomo/bloques/b3/` (encargo, cobertura, farmacos, megaproyecto-*, juicio-maquetas-v2, auditoria-3a).

El resto del tablero sigue `aparcada`.

## 3. Esperando algo tuyo

- **✅ Decidido el 26/10, B-026 · Culprit** (https://claude.ai/artifact/Y6ewAZfAk5cPewnsnNcsAw): opción 1. A (ficha «Del
  vaso a la derivación») y B (preguntas «predice el ECG» y «coloca el trombo») entran en la Fase 1, después de Marino;
  C (modelo vivo 2D) cuando el motor de la eco tenga las coronarias; D después de C. **Falta**: el PDF de la ESC 2023
  de SCA (Byrne, Eur Heart J 2023;44:3720-3826, doi:10.1093/eurheartj/ehad191) y el de ECG de la rotación . Ya en `docs/`: ESC 2023 de SCA (2 partes),
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
- **🔴 PDF que hacen falta**, por urgencia: ECG básico de tu rotación de Cardiología (01/11) · guía de amiloidosis cardíaca ·
  fuente del MAPSE · Leung y Levine 1994 (opcional) · temarios de Radiología de tórax y Neurorradiología.
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
- **El Libro Azul**: los PDF de las secciones que faltan (hay I, II, III y VII). Orden que pediste: Marino (hecho),
  después El Libro Azul y después el PIF de R1.
- **PIF de R1**: los PDF de las 7 rotaciones sin contenido (Radiología de tórax, Neurorradiología, Cardiología,
  Medicina Interna, Infecciosas, Neurología, Neumología).
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
- **4 PDF para cerrar los huecos del bloque 3** (`fuentes-b3`, 27/10): ESC 2019 de taquicardias supraventriculares,
  AHA 2020 de soporte vital (o ERC 2021), ESC 2023 de miocardiopatías y el consenso SCAI 2015. Sin ellos, esos puntos
  quedan marcados como hueco.
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

## 5. 💡 Lo que yo propondría (no lo has pedido tú)

- (27/10: ya está en la PR #32, en borrador; falta que la mires) (26/10) **Publicar ya lo hecho del bloque 3.** La rama `auto/b3` tiene, sin PR desde el 23/10: las 26 fichas de
  Merino Cardiología y Neumología con sus páginas, la vista Visual y Texto | Estudiar en las 9 fichas del shock (152
  preguntas, 4 casos, auditadas con 0 graves). Hoy no lo ves en el móvil porque espera a las maquetas. Propongo
  sacarlo en una PR propia mientras decides las maquetas: así ya puedes estudiar el shock.
- (26/10) **Las preguntas viejas del bloque 3, a la vez.** Merino Cardiología (48) y Neumología (46) son los bancos con
  más preguntas «de redactar» (`js/data/merino-*-preguntas.js`) y son justo las fichas del bloque 3: reconvertirlas en
  la misma tanda evita tocar esas fichas dos veces.
- (23/10) Las dos propuestas que había (pulmón con respirador e inventario de estudio) te gustaron y pasan a
  «Apuntado» como B-013 y B-014.

## 6. Hecho (últimos 7 días)

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
- 2026-10-26 · **Bloque 3: maquetas v3 y topes de paciente real** (`b3`, PR #32 en borrador): espera tu respuesta.

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
