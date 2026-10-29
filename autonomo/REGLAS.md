# Reglas del plan socialista (equipo autónomo)

Corto a propósito: todos los agentes lo leen en cada vuelta, junto con `CLAUDE.md` (las reglas del proyecto,
también cortas). La historia de cada parte está en `docs/historial/`: **no la leas entera**, busca con grep la
sección que necesites, y lee el `README.md` del módulo que toques (p. ej. `js/modules/eco/README.md`).

## 1. Contenido clínico

1. **Nunca inventes.** Toda cifra, dosis, umbral o afirmación clínica sale de una fuente que se puede abrir (PDF en
   `docs/`, el repositorio de origen, o una ficha de la app ya cotejada). Si no la encuentras, no la escribas:
   anótalo como hueco.
2. **Cada cifra visible tiene su origen** en la propia pantalla: `ficha` (de la fuente), `fisiología general` o
   `ilustrativo`. Si es ilustrativa, la pantalla lo dice.
3. **Si la fuente tiene una errata**, se reproduce tal cual y se añade una nota de fidelidad plegable
   (`<details class="nota-plegable">`) que la explica. Nunca se corrige en silencio.
4. **Si dos fuentes no coinciden**, se muestran las dos con una nota de fuentes. No se elige una ganadora.
5. **No resumas por debajo de la fuente**: cifras, fármacos y mecanismos con su detalle real.
6. **Código ajeno**: de echodemo (The Heart by Ultrasound) se traduce el texto, con permiso del autor y citado; el
   código nunca se copia: cada figura se reconstruye sobre los motores de la app. Nada de imágenes de pacientes con
   licencia restrictiva (CAMUS, EchoNet).
7. **Lo que muestra un simulador es un paciente posible** en todo el recorrido de sus mandos (extremos y punto
   medio): presión arterial, frecuencias, presiones, volúmenes y velocidades dentro de lo fisiológico para ese
   estado. **El límite es la propia fisiología humana.** Si una cifra no existe en un ser humano, está fuera de lo
   compatible con la vida o se aleja mucho de la realidad (p. ej. FEVI del 95 %, PAS de 300, un chorro de 12 m/s, un
   volumen negativo), **no basta con taparla ni con recortarla**: hay que comprobarla y **buscar dónde está el
   error** (el modelo, una unidad, una fórmula, un parámetro mal ajustado) y corregirlo en su origen. Si el modelo
   lleva a un estado posible pero que el texto no describe (p. ej. un shock), se ajusta el modelo o se dice en
   pantalla.
8. **Erratas de dosis.** Cuando la fuente imprime una dosis imposible o equivocada (U/h por U/min, «50 mg» por 150,
   «60 U» sin /kg), se muestra la dosis habitual y una nota plegable visible dice lo que imprime el libro y en qué
   página. Si hay duda sobre cuál es la dosis habitual, **se consulta la web** (CLAUDE §7.2: URL que salga
   literalmente en los resultados) y la nota cita esa fuente; si sale de conocimiento general, lo dice.
9. **Notas de interpretación, siempre con fuente.** Una nota que explica, matiza o concilia lleva la fuente de lo
   que afirma. Sin fuente, no se pone (o se rotula «conocimiento general, no de la fuente»). **Si algo genera mucha
   discordia** entre fuentes o con lo que se sabe, se busca en la web y se citan las fuentes encontradas, sin elegir
   una ganadora (regla 4).
10. **Calculadoras: los umbrales se comparan redondeados.** Un umbral clínico (≥0,3, ×1,5, <25 %) se compara con
    enteros o con el valor redondeado que se muestra, nunca restando decimales tal cual (2,3 − 2,0 da 0,2999 y falla
    justo en el límite). El texto del resultado no puede contradecir su propio veredicto por el redondeo.
11. **Cada frase nueva de mecanismo, con su página** (lección 1 del bloque 1). Al dibujar un mecanismo es fácil
    rellenar huecos con lo que «suena bien» («el fondaparinux no envuelve el FP4», «CK ↑»). El constructor entrega la
    lista de sus frases nuevas con su página; lo que no tenga página va rotulado «fisiología general» o se quita, y
    el auditor coteja esa lista frase por frase.
    **También en los «Piensa»** (aprobado por el usuario, 27/10/2026, `reglas-27-10`): toda frase de mecanismo de un
    «Piensa», de su explicación y de cada distractor lleva su origen, igual que el texto de la ficha.
12. **Las cifras del libro, en el contexto del libro** (lección 2). Una cifra cierta puesta donde no toca es un error
    (100 mL/s es de un 14 G, no de una luz de 18 G). En los casos, cada paso es un paciente posible (§1.7): las cifras
    encajan entre sí (p. ej. el enclavamiento nunca por encima de la diastólica pulmonar).
13. **Tres tipos de nota, cada una con su nombre** (lección 3): **las fuentes discrepan** (dicen cosas distintas),
    **la fuente no lo dice** (calla: no es una discrepancia) y **opinión del autor** (no es una regla). Nunca se marca
    como error algo que el libro afirma literalmente.
14. **Cada mando tiene su tope y su consecuencia** (el usuario, 26/10/2026: «si se pueden modificar los datos hasta el
    punto de superar lo real, es un fallo […] no puedes meter 20 litros a un paciente, se muere antes»). Vale para
    todo modelo vivo, simulador, maqueta y calculadora con mandos (volumen, fármacos y dosis, aparatos, reloj,
    respirador, gravedad…):
    - **Tope escrito y con origen**: la dosis o el límite de la ficha (con página); si la ficha no lo da, la
      fisiología (`fisiología general`) o `ilustrativo`, rotulado. Nada ilimitado.
    - **Al acercarse, avisa** (≈80 % del tope); **al pasarse, el paciente responde como un paciente real**: el sello
      con la consecuencia clínica y su cita (sobrecarga, edema, hipoxemia, crisis hipertensiva, «sin ventilación»…),
      el mando se apaga y la frase viva lo dice. No basta con «se encharca un poco»: cambian todas las constantes que
      cambiarían en la realidad (PVC, PCP, SpO₂, PA…), y si el paciente no lo sobreviviría, la pantalla lo dice.
    - **Ningún estado da una cifra imposible** (§1.7): si pasa, se corrige el motor, no se tapa con el tope.
    - **Ni con el dibujo** (aprobado por el usuario, 27/10/2026, `reglas-27-10`): un constructor que ve una cifra
      mala del motor no la tapa con un ajuste del dibujo (en el `b3`, venas a 2,5 cm² para esconderla); para e
      informa con la cifra y el estado que la da, y el arreglo va al motor.
    - **La prueba del modelo lleva cada mando a su tope** (y las acciones repetidas, a su máximo) y comprueba que sale
      el sello y que las cifras siguen siendo de un paciente posible. La pieza común es
      `js/core/tope.js` (aviso y sello).
    - **Un modelo vivo nuevo con sello propio añade su ajuste a `autonomo/jueces-topes.mjs`** (aprobado el
      27/10/2026, `reglas-27-10`), no un arnés de topes suelto: así `jueces.mjs --modelo <clave>` lo comprueba
      siempre.
15. **Lo que la ficha no dice, se busca y se cita** (el usuario, 27/10/2026: «lo que la fuente no dice, todo eso
    habría que buscarlo e incluirlo y minimizar ese apartado a un par de chorradas que falten; hay que mejorar esa fuga
    de info»). Un mecanismo, distractor, explicación, tope o cifra que hoy saldría rotulado `fisiología general`, «la
    fuente no lo dice» o «hueco» **se busca antes**: otro PDF de `docs/`, una guía o un artículo (§7.2 de `CLAUDE.md`:
    URL que salga literal en los resultados; con `/claim-check` y `/citation-verification` si hay acceso a PubMed), y
    se escribe con su cita. Si la fuente nueva es un PDF de acceso abierto, va a `docs/` con su `#page=`.
    - `fisiología general` sin cita queda **solo para lo trivial** (aritmética, definiciones de manual: VMe = VT × FR).
    - Un **hueco** solo cuando se buscó y no se encontró: el parte dice qué se buscó y dónde.
    - Las fuentes nuevas no se mezclan con la ficha (CLAUDE §2): van como segunda cita o nota de fuentes, con el nombre
      de la fuente a la vista.
    - El constructor entrega, junto a la lista de frases nuevas, la lista de las que quedan sin cita; el auditor marca
      **grave** una sin cita que no sea trivial.

## 2. La app

1. **Sin backend, sin build, sin dependencias nuevas.** HTML/CSS/JS que el navegador ejecuta tal cual. La única
   librería es Motion (`js/vendor/`), elegida por el usuario; otra, solo si él la pide.
2. **Móvil primero**: nada desborda a 390 ni a 360 px de ancho; toques de al menos 44 px.
3. **Reutiliza antes de crear**: enlaces cruzados con `[data-especialidad]`; ayudas de `js/core/ui.js` y
   `js/core/wizard.js`; clases ya existentes de `css/components.css`. Una clase o un componente nuevos solo si no hay
   ninguno que sirva.
4. **Ids únicos en toda la app** (todas las vistas están en el DOM a la vez): comprueba con grep antes de inventar
   uno.
5. **Si cambias una pieza de la app** (`.css`, módulo o fragmento de `js/`), `node autonomo/version.mjs AAAAMMDD-N`
   (en el plan socialista lo hace solo el director, §4.6).
5b. **SVG recreados con fondo propio** (`var(--bg-main)`): la caja de `.article-figure` es blanca y el texto claro de la
   app desaparece en ella.
6. **Motor del simulador de eco**: si lo tocas, todas sus pruebas siguen en verde y lo cuentas en
   `js/modules/eco/README.md`. Nunca cambies una referencia de `referencias.mjs` para que una prueba pase.
7. **Nada interno a la vista** (lección 5 del bloque 1): ni ids de ficha («mar-…»), ni «§», ni códigos del plan
   («Caso E1», «maqueta», «diseño», «REGLAS», «cobertura»), ni rutas de archivos, ni notas de trabajo. El chip de
   origen dice solo «ficha», «fisiología general» o «ilustrativo», más su página. Lo comprueba `jueces.mjs`.
8. **Rótulos de los dibujos legibles** (lección 6): a 390 px, ningún texto de un dibujo mide menos de 7,5 px de alto
   ni pisa a otro. Lo comprueba `jueces.mjs`.
9. **Cada modelo vivo arranca por separado** (lección 13): si uno falla, el resto de su especialidad sigue
   funcionando. Se hace con `arrancar(nombre, init)` de `core/ui.js` (Libros, Nefrología, Eco y las especialidades).

## 3. Redacción

1. Español claro, frases cortas y en voz activa. Sin muletillas («cabe destacar», «es importante señalar»).
2. Nombra las cosas como las conoce un médico, no como están hechas por dentro.
3. Los botones dicen lo que hacen («Comprobar», «Ver en el texto»).

## 4. Trabajo y git

1. **Solo la tarea encargada.** Si ves otro problema, anótalo en el informe de la sesión; no lo arregles de paso.
2. **Nada se da por hecho sin pasar los jueces**: `node autonomo/jueces.mjs` en verde (con `--eco`, `--atlas` o
   `--ficha` según la tarea) y los puntos de «hecho» del tablero.
3. **Pocas paradas para el usuario** (lo pidió el 20/10/2026: «pídemelo por bloque solo 4-5 veces en total»).
   - **Por bloque, como mucho 4-5 paradas** en las que el usuario decide:
     1. **El plan del bloque**: la cobertura, la ruta y los modelos nuevos con sus maquetas (elige).
     2. **El primer modelo o escena nueva ya construida**, para corregir el rumbo pronto (si el bloque no trae
        ninguno nuevo, esta parada no existe).
     3. **El bloque entero en la app**: lo prueba en el móvil y pide cambios.
     4. **Los cambios que pidió, hechos**: con su visto bueno, el bloque entra en `main`.
     La 5.ª solo para una duda grande que surja por el camino.
   - **El contenido del bloque** se acumula en una sola rama `auto/<bN>` con una sola PR en borrador; las paradas
     se ven en su enlace «Ver en el móvil». No se abre una PR por tarea.
   - **Todo lo demás lo decide y lo sube el director, sin pedir aprobación**, siempre con los jueces en verde:
     arreglos de auditoría, fallos de los jueces, mejoras técnicas y tareas técnicas ya aprobadas. Va directo a
     `main` (fast-forward desde la rama de trabajo, `CLAUDE.md` §10) y se cuenta al usuario en una línea.
   - **Se sigue preguntando siempre** lo grande o difícil de deshacer (`CLAUDE.md` §1): quitar contenido, cambiar la
     arquitectura, un modelo grande que no estaba en el plan aprobado o una duda clínica que la fuente no resuelve.
4. **`.gitignore` e `.ignore`**: una herramienta los ensucia; un gancho al abrir la sesión hace que git no los
   vigile. Si aun así salen modificados, `git checkout -- .gitignore .ignore` antes del commit.
5. **El contenedor se borra**: lo que no está en una rama subida a GitHub se pierde.
6. **Trabajo en paralelo** (lecciones 10-12 y 14 del bloque 1):
   - Como mucho **3 agentes pesados a la vez** (el límite de uso los corta a todos juntos), con encargos cortos: una
     pieza cada uno. El director hace una copia de seguridad (commit) cada vez que uno avanza.
   - Varios constructores en la misma carpeta: el director marca antes un **hueco** para cada uno en los archivos
     compartidos (`[HUECO <quién>: …]` en CSS, `index.html`, `index.js`, menús) y cada uno escribe solo en el suyo.
   - **Solo el director sube el `?v=`** de `index.html` y decide el **orden de fusión** de las ramas.
   - **Cada agente, en su subcarpeta temporal** (`/tmp/plan-socialista/<bloque>/<agente>/`): nunca en una común.
   - **Una carpeta aparte (`git worktree`) sale siempre de la rama del bloque**, no de `main` (aprobado por el usuario,
     27/10/2026): el primer paso del encargo es `git fetch origin auto/<bN> && git checkout -B <rama> origin/auto/<bN>`.
     El aislamiento automático de los agentes sale de `main`; en el `b3` dos constructores partieron una versión vieja
     y hubo que rehacerlo (≈1 M de gasto). Si cada agente tiene sus propios archivos, mejor sin carpeta aparte.
   - **Cada constructor, en su propio `git worktree`** que sale de la rama del bloque (aprobado por el usuario,
     27/10/2026, `reglas-27-10`), cuando hay más de uno trabajando a la vez: así no se pisan ni las pruebas ni el
     servidor.
   - **Pruebas: cada constructor pasa las suyas y las de lo que tocó; la suite entera la pasa el director una vez,
     al fusionar** (aprobado el 27/10/2026, `reglas-27-10`). Nunca más de **2 agentes con pruebas largas** (jueces,
     navegador) a la vez.
   - **Nunca `git stash` ni `pkill`/`kill` amplios en la carpeta compartida** (aprobado por el usuario, 27/10/2026): un
     stash arrastra el trabajo sin guardar de otro agente y un `pkill -f` amplio mata procesos ajenos (también la
     terminal del director). Cada agente para solo su propio servidor, por su puerto.
   - **Los arneses cierran su servidor por su número de proceso** (el que guardaron al lanzarlo), nunca con
     `pgrep -f … | xargs kill` (aprobado el 27/10/2026, `reglas-27-10`): en el `b3` un constructor se mató su propia
     orden.
   - **Los arneses de prueba leen el puerto de `PUERTO=`** (aprobado el 27/10): nunca un puerto fijo, que choca entre
     agentes.
   - **Los jueces completos, al final y sin otros agentes trabajando**. Un fallo de navegador se repite solo antes de
     darlo por roto (con la máquina cargada fallan pruebas que están bien).
   - **Una tarea, una sola sesión** (aprobado por el usuario, 27/10/2026): antes de empezar una tarea, el director
     mira las sesiones activas (`list_sessions` con `mine: true`, y `get_session` de las que trabajan) y la rama
     remota `auto/<clave>`. Si otra sesión activa ya lleva esa tarea (por su título, su rama o un «en curso» del
     tablero de otra sesión), no la empieza: no toca nada, se lo dice al usuario y termina. Antes de abrir la
     sesión siguiente con `create_session`, la misma comprobación. El 27/10 dos sesiones arrancaron `movil-existente`
     a la vez (las abrieron `jueces-movil` y `jueces-topes`, cada una por su lado).
   - **Citas o arreglos que cruzan archivos de otra sesión activa** (aprobado el 27/10/2026, `reglas-27-10`): una
     rama `wt/<bloque>-<modelo>` por modelo, que fusiona y versiona la sesión dueña de esos archivos. Así lo hizo
     `fuentes-b3` con las maquetas del `b3` mientras la parada 2 trabajaba en ellas.

7. **Gasto que baja** (decisión del usuario, 26/10/2026: «cada operación que hacemos que cueste X tokens, hay que
   hacer que la siguiente nos intente costar un poco menos»; vale para todas las sesiones y tareas). Un agente paga en
   cada paso releer todo lo que lleva en su conversación: 100 pasos cuestan mucho más del doble que 50.
   - **Presupuesto en cada encargo**: pasos y tokens equivalentes, el 90 % del último agente del mismo papel y modelo
     en una pieza parecida (tabla «Presupuestos vigentes» del tablero). Al llegar, el agente para y entrega lo hecho
     con lo que falta. El parte compara gasto y presupuesto, explica la diferencia y actualiza la tabla.
   - **Modelos**: Fable solo para pensar (profesor, cobertura). Constructores, arreglos, auditor y revisores, en sonnet;
     el primer modelo vivo de algo nuevo, en opus y con presupuesto.
   - **Profesor**: un agente por maqueta o pieza (no uno para todas); las cifras y los mandos los recorre un programa
     de prueba que devuelve un resumen en texto, y el profesor mira **como mucho 10 capturas**, las de lo que hay que ver
     con los ojos; comprueba lo pedido en el juicio anterior y lo nuevo, sin repetir la exploración entera.
   - **Constructor**: encargos con dirección exacta (archivo y función, o línea) que da el juez; archivos de **≤700
     líneas** por pieza (una maqueta o un modelo que pase de ahí se parte en módulos antes de la vuelta siguiente,
     como `autonomo/maquetas/b3-shock/`); lee solo la función que toca (`graft` o `sed -n`), nunca el archivo entero.
   - **Un encargo que nombra más de una estructura anatómica o más de un fenómeno del motor se parte** antes de
     lanzarlo, en encargos de **≤60 pasos** (aprobado por el usuario, 27/10/2026, `reglas-27-10`): los que pasaron de
     60 pasos llevaban dos piezas.
   - **Lo hecho no se repite**: los programas de prueba y arneses que escribe un agente se guardan en
     `autonomo/bloques/<bN>/herramientas/` (o `autonomo/pruebas/`) con un `LEEME.md`, y el siguiente los reutiliza.
   - **Reanudar mejor que relanzar**: si un agente se para (límite de uso, pausa), se reanuda con SendMessage; antes
     de una pausa larga escribe un apunte de 5 líneas que el director copia al repositorio.
   - **Una parada con varios modelos vivos, una sesión por modelo** (aprobado por el usuario, 27/10/2026,
     `reglas-b3p2`): cada modelo se lleva a la app en su propia sesión de director, y la sesión del bloque solo junta
     las ramas al final. El director de la parada 2 del `b3` gastó 5,1 M (frente a 0,8 M de una parada de un modelo)
     por fusionar 12 ramas en una sola conversación.
   - **Llevar una maqueta aprobada a la app son dos encargos** (mismo día, `reglas-b3p2`): primero el modelo, con su
     prueba (`autonomo/pruebas/<clave>.mjs`), y después su Mayéutica. Presupuestos de la parada 2 del `b3`: modelo
     sonnet 90 pasos / 2,0 M; Mayéutica sonnet 50 / 1,2 M.

8. **Llegar al 8,75 a la primera** (R1-R9 de `notas-meta`, aprobadas por el usuario el 27/10/2026; datos en
   `autonomo/bloques/notas-meta/datos.md`: 1 de 7 tareas aprobaba a la primera, 0 de 7 llegaban a la meta, 2,4
   vueltas de media).
   - **R1 · Prueba del móvil antes de entregar**: a 390 y 360 px, la frase viva y el enunciado no quedan tapados por
     la barra de abajo, la imagen sigue a la vista al tocar sus mandos, ninguna frase sale cortada con «…» y ningún
     rótulo baja de 8 px (el usuario lo bajó de 9 a 8 el 27/10/2026). Los 8 px son en la pantalla: el SVG se pinta
     a escala (≈ 0,86 a 360 px), así que en coordenadas del dibujo el suelo es 8 / escala, **≈ 9,3** (aprobado el
     27/10/2026, `propuestas-movil`). La frase viva se trae a la vista con la pieza común `js/core/frase-vista.js`, no
     con una solución propia de cada modelo. La pasa el constructor con capturas antes de entregar; cuando exista, la pasa
     `jueces.mjs` (tarea `jueces-movil` del tablero).
   - **R2 · Lista de «lo que hace la maqueta»**: al aprobarse una maqueta, el profesor escribe la lista de lo que
     hace (cada mando, cada estado, lo que queda fijo en pantalla). El constructor que la lleva a la app la tacha
     punto por punto, con una captura de cada uno, y la entrega.
   - **R3 · El criterio clínico, escrito antes de construir**: todo aviso, objetivo o umbral nuevo lleva en el plan
     del profesor su regla exacta y su fuente (qué cuenta, durante cuánto tiempo, desde qué cifra). El constructor no
     lo decide; si falta, lo pide.
   - **R4 · Captura al lado de la imagen real**: en la eco y en los modelos con anatomía, el constructor entrega cada
     plano junto a una imagen real de uso libre (las de D1 de `eco-mega`) y se autopuntúa con la rúbrica (§7) antes
     de entregar.
   - **R5 · Vueltas de arreglo con un constructor nuevo**: la vuelta la hace un constructor sonnet nuevo con la lista
     exacta de fallos (archivo y función). Solo se continúa el mismo (SendMessage) si lleva menos de 60 pasos.
   - **R6 · Nada de opus en las vueltas**: opus solo en la primera vuelta de un modelo vivo nuevo. Si un arreglo
     necesita pensar, lo piensa el profesor en una lista y lo hace sonnet.
   - **R7 · Dónde obliga la meta**: el 8,75 obliga en lo que se copia después (modelos vivos nuevos, maquetas y los
     archivos modelo de `CLAUDE.md` §6). En fichas que siguen un modelo, arreglos e informes basta con 8; lo que falte
     hasta 8,75 va al parte si no cabe en una vuelta corta (≤15 pasos de constructor).
   - **R8 · Rejuicio corto**: en la segunda vuelta y siguientes, el profesor solo vuelve a puntuar los criterios que
     estaban por debajo de la meta, con el mismo programa de prueba y las capturas de la primera.
   - **R9 · Cada vuelta, en el parte**: tabla «Vueltas» con la nota mínima, el modelo, los pasos y los tokens de cada
     vuelta (formato en `autonomo/partes/LEEME.md`).

9. **El encargo, revisado antes de gastar** (B-031 `encargo-revisado`, aprobado por el usuario el 27/10/2026; dos
   ideas de Spec Kit, https://github.com/github/spec-kit, MIT, reescritas aquí sin instalarlo). Un fallo del encargo
   sale caro después: en el E/A de la eco (B-027) ningún encargo pedía un E/A de paciente posible por forma, así que
   ningún juez lo midió.
   - **Lista de calidad del encargo** (prueba el texto del encargo, no el resultado). La pasa `/bitacora` al apuntar
     y al aprobar, y el director al revisar el encargo:
     1. ¿Cada mando tiene **tope con fuente** y qué pasa al pasarse (§1.14)? (Solo si hay simulador o modelo vivo.)
     2. ¿Dice **qué cifra debe salir** en cada forma, estado o caso (valor o rango, con su fuente)?
     3. ¿Está **«lo que NO quiero»**?
     4. ¿Cada **fuente** tiene archivo (o URL verificada) y **página**?
     5. ¿**Qué juez comprueba** cada punto del «hecho» (`jueces.mjs` y sus opciones, topes, móvil, auditor,
        profesor)? Lo que ninguno mide se marca y se dice quién lo mira.
   - **Como mucho 5 preguntas al usuario por encargo**, las más importantes primero (las que más cambian el resultado
     o más cuesta deshacer). Lo demás lo decide quien escribe el encargo y lo marca «(supongo)».
   - **Revisión del encargo antes de construir**: al empezar cada tarea de `/plan-socialista` (y en un bloque, el
     paquete y cada encargo de modelo antes de lanzar su constructor), un paso de **solo lectura, barato** (sonnet,
     ~10 pasos / 0,15 M) cruza el encargo, el plan del director y la lista de piezas: huecos, contradicciones entre
     ellos o con estas reglas, la lista de calidad y, sobre todo, **lo que ningún juez va a medir**. Informe de ≤20
     líneas en la carpeta de trabajo (`revision-encargo.md`). **Lo grave para la tarea y se pregunta al usuario** (con
     el tope de 5 preguntas): una contradicción, una fuente que no se puede abrir o sin página, un simulador sin la
     cifra que debe salir o sin topes, algo del «hecho» de un modelo vivo que nadie mide. Lo menor se anota en el plan
     y se sigue. En un `arreglo` pequeño que no toca la app, la revisión la hace el propio director con la misma
     lista, sin agente.

10. **El gobierno** (B-036, aprobado por el usuario el 28/10/2026: «apruebo la reforma de gobierno […] la constitución
    ha sido aprobada por el pueblo»). Cada pieza del plan tiene un papel y unas cuentas:
    - **Gobierno central**: el usuario, con la sesión de la bitácora. Aprueba el **presupuesto de cada bloque** (no
      de cada tarea) y las paradas. Nadie más aprueba.
    - **Interior = `/plan-socialista`**: antes de gastar, escribe el **presupuesto de la tarea** (≤15 líneas: qué hará,
      qué agente y qué modelo en cada pieza, pasos y millones, y el total frente a lo que queda del bloque). Dentro del
      presupuesto del bloque gasta sin pedir permiso. Al cerrar, **rinde cuentas** en el parte («Cuentas»: previsto,
      gastado, desvío y por qué).
    - **Hacienda = `/ahorro`**: revisa el presupuesto **antes** de gastar (modo presupuesto, sin agentes, ≤0,1 M) y
      **puede recortar sola** (modelo más barato, pieza que ya existe, prueba corta, encargo partido), siempre que no
      baje la nota (8,75) ni la fidelidad. Cada recorte queda escrito en el parte («Hacienda: qué recortó y cuánto»)
      para que el gobierno central lo vea; si discrepa, se habla y se cambia. Al cerrar un bloque, un balance y una o
      dos propuestas. Sigue revisando lo ya gastado como antes.
      Hacienda **cuida también su propio gasto** (el usuario, 28/10: «si aparece constantemente y gasta dinero porque sí,
      tiene que valorar mejor cuándo aparecer»): el modo presupuesto solo en tareas de **2 M o más** (en las menores, el
      director aplica él mismo la lista de recortes, sin llamarla); la pasada de después, solo si la tarea se desvió
      **más de un 10 %** o al cerrar un bloque; nunca dos veces sobre lo mismo. Lo que gasta Hacienda va en «Cuentas» y
      no pasa del **2 %** de lo que revisa; si un recorte no compensa lo que cuesta buscarlo, no se busca.
    - **Transportes = `/bitacora`**: rumbo, cola y calendario. El informe diario es el Consejo de Ministros por
      escrito: dice el gasto del día, el acumulado frente al presupuesto y lo que recortó Hacienda.
    - **Exteriores = `/radar`** · **Ciencia = `/ingenieria-reversa`** · **Educación = `/mayeutica`** (con el profesor) · **Justicia = los
      jueces automáticos y el auditor ciego** (independientes: Hacienda no puede recortarlos ni saltarlos).
    - **Comparecer**: si una tarea va a pasarse **más de un 25 %** de su presupuesto, el director para antes de
      seguir y lo explica en una línea (al usuario, en el chat o en el informe diario). El tope de gasto por día
      (§5.6) sigue igual.
11. **Reglas aprobadas el 28/10/2026** (partes del 25 al 28/10 y `/ahorro`; el usuario: «del 7 al 12 se aprueban
    todas»):
    - **Jueces y pruebas**: `jueces --ficha` corre también la forma de `mayeutica-fichas` de esa ficha · los jueces
      miden también las tablas que se salen de su tarjeta, no solo la página · un simulador con revisión por
      objetivos se prueba con un camino incompleto y uno correcto · un modelo que pausa su animación fuera de la vista
      se pone a la vista antes de medir · las pruebas miden una caja justo al contestar, no después de centrarla ·
      mientras se itera, solo la prueba corta que nombra el encargo; la suite entera, una vez al entregar · la suite,
      con el árbol limpio o en la copia propia de cada constructor.
    - **Cobertura y encargos**: la cobertura pega el `grep` de cada clave de estado que cita · deja 2-3 pacientes de
      reserva (nombre y perfil) por grupo · antes de estimar, el director cuenta las piezas en el código (`node -e`
      con las claves de cada modelo) y la lista de lo que falta va al encargo · un «no se toca» lleva su razón; si
      cumplirlo rompe el paciente posible (§1.14), manda §1.14 y el parte lo dice · recortar figuras y escribir
      preguntas, dos encargos · un encargo que recalibra el motor trae su **rejilla** (parámetros y rangos) y el
      constructor la corre de una vez (`herramientas/barrido.sh` + `calibra-tabla.mjs`).
    - **Fuentes**: una cita que no se pudo abrir es un hueco, nunca con página · una consecuencia en un distractor
      también lleva página, o no va · el enunciado no nombra lo que se pregunta · antes de lanzar a quien busca una
      fuente o estudia una web, el director prueba en una llamada que se abre; si no, la pide al usuario.
    - **Constructores**: antes de entregar, «¿mi arreglo empeora otra cifra de la tabla de la forma?»; si sí, para e
      informa (una cifra mala no se tapa con otro parámetro) · un aviso de tope escribe el límite que se habría
      cruzado, nunca la cifra imposible · los avisos de «medida imposible» se rotulan «control de la app» y solo
      cubren lo que rompe la fórmula · cada lector en paralelo, en su subcarpeta · las vueltas de arreglo de una
      maqueta, con el modelo barato · al pasar una maqueta a la app, se prueba en la app real con toque a 390 px al
      lado de la maqueta · cada encargo de forma de la eco entrega una captura de cada vista junto a la eco real.
    - **Sesiones y entrega**: lo que pida el usuario a mitad de una tarea va a otra sesión (`create_session`) · al
      pausar por límite de uso, los apuntes de los agentes se copian al repositorio · el enlace «Ver en el móvil» lleva
      el commit completo, no el nombre de la rama · avisar al constructor de los commits suyos ya hechos · una skill
      nueva pedida en una tarea aprobada va en la PR de esa tarea · el script del inventario se guarda en `autonomo/`
      para repetirlo.

12. **El Consejo de Ministros** (B-037, aprobado por el usuario el 28/10/2026: poderes «todo menos 4 cosas»). Se
    reúne cuando hay asuntos (como mucho una vez al día; el primero, el 28/10). Lo convoca la bitácora (Transportes),
    que preside, fija el orden del día y escribe el acta en `autonomo/consejo/AAAA-MM-DD.md` (formato en su `LEEME.md`).
    - **Dictámenes** (≤15 líneas por asunto): Interior (`/plan-socialista`: si se puede hacer, cómo y con qué
      modelos), Hacienda (`/ahorro`: cuánto cuesta y qué recorta), Educación (`/mayeutica`: si sirve para estudiar),
      Justicia (si choca con `CLAUDE.md` o REGLAS) y Transportes (prioridad y calendario). Ciencia (`/ingenieria-reversa`)
      y Exteriores (`/radar`), si el asunto es suyo. Para ahorrar, un mismo agente barato puede dar dos dictámenes, y
      Hacienda y Transportes los da quien preside, sin agente. Gasto de una reunión: ≤2 M.
    - **Aprueba sin pasar por el usuario**: dudas de los planes, orden, tareas, opciones de los informes y cambios de
      estudio, **dentro del presupuesto que apruebe el usuario**. Lo acordado entra en el tablero con «(Consejo, fecha)».
    - **Reservado al gobierno central (el usuario)**: el presupuesto total, la arquitectura (`CLAUDE.md` §2, p. ej.
      separar motores), quitar contenido y la última parada de cada bloque (lo prueba en el móvil antes de `main`).
      En esos asuntos, el Consejo estudia y recomienda.
    - Si los ministerios no se ponen de acuerdo, decide quien preside y el acta lo dice; el usuario puede reabrirlo.
13. **Dos carriles** (artículo 13 del Consejo del 29/10/2026, aprobado por el usuario el 29/10: «bueno, se puede regular,
    pero vale»; acta `autonomo/consejo/2026-10-29-carriles.md`). Mientras dure Marino puede haber **dos directores a la
    vez**, en sesiones distintas:
    - **Carril 1, Marino**: manda; ≈70 % del gasto del día.
    - **Carril 2, modelos vivos con webs y guías**: como mucho ≈30 % del día y solo lo que Marino no use. Va por un
      semáforo por modelo: **rojo** (Marino lo construye ahora) y **ámbar** (Marino lo usará), solo informe y maqueta;
      **verde** (bloque cerrado o fuera de Marino), código por sus archivos propios. Nunca edita los motores compartidos
      (`js/core/mayeutica-motor.js`, `js/modules/eco/motor.mjs`): eso va a una sesión «motor» sola. Rama
      `auto/mv-<modelo>` desde `main`, una sesión por modelo; las ramas no tocan la versión (la sube quien fusiona); orden
      de fusión: arreglos → carril 1 → carril 2. Antes de cada sesión, comparar sus archivos con las ramas abiertas de
      Marino; si se solapan, para. El reparto se puede ajustar.
    - **Presupuesto** (el usuario, 29/10: «puede ser variable, Hacienda y yo tenemos la última palabra y yo delego en
      Hacienda»): el presupuesto del carril 2, y sus ajustes, los decide **Hacienda** (`/ahorro`) por delegación del
      usuario, sin bajar la nota (8,75), la fidelidad ni los jueces, y lo deja en el parte. El tope diario del 18 % no cambia.
    - **PDF** (el usuario, 29/10: «tienes que empezar a colaborar tú, no te puedo estar pasando constantemente PDF»): antes
      de pedir un PDF al usuario, quien lo necesita lo busca en abierto (Europe PMC por `www.ebi.ac.uk`, PubMed Central,
      la web del editor o de la sociedad) y anota dónde buscó. Solo se pide si es de pago o la red no lo deja bajar, y
      entonces con el enlace exacto para descargarlo con un toque.

## 5. Lo que el agente puede y no puede tocar

1. **Las reglas son de solo lectura** para el agente: nunca edita `autonomo/REGLAS.md`, `CLAUDE.md` (ni los de los
   módulos) ni sus propias instrucciones. Si cree que una regla falla, lo propone en su informe y el usuario decide.
   **Qué son «sus instrucciones» en `.claude/`** (aprobado por el usuario, 27/10/2026, `reglas-b3p2`): la prohibición
   vale para `.claude/agents/` y las skills del proyecto (`plan-socialista`, `bitacora`, `ahorro`, `radar`…). Lo que
   reescribe una herramienta instalada (graft en `.claude/settings.json` y su propia skill) lo sube el director en un
   **commit aparte**, después de comprobar con `git diff` que no se pierde ninguna orden del proyecto (si se perdió
   una, la vuelve a poner antes del commit). El entorno bloquea al agente su propia configuración: ese commit necesita
   el permiso del usuario en la sesión.
2. **El estado sí lo escribe**: los estados de `autonomo/TABLERO.md` y su parte en `autonomo/partes/`.
3. **No avanzar sin prueba**: una tarea solo pasa a `en revisión` cuando la PR existe en GitHub (con su enlace en el
   informe). Si el push o la PR fallan o no está claro que salieron, el estado no cambia y el informe lo dice.
4. **Lo que no se pudo leer es un hueco, no un hecho**: si una fuente no se abre (web bloqueada, PDF ilegible), la
   tarea no se marca hecha ni se salta en silencio; el informe dice qué faltó.
5. **«No había nada que hacer» no es un fallo**: si no queda tarea pendiente, el informe lo dice así.
6. **Límite de gasto**: si la sesión llega al límite del tablero, se para y deja el estado como está. Desde el
   27/10/2026 hay también un **límite por día**, sumando todas las sesiones: como mucho el **18 % del uso semanal**
   (tablero, «Límite de gasto por día»).

## 6. Cómo crecen estas reglas

Cuando un fallo se cuela por los jueces (lo ve el director, el revisor o el usuario después), no se arregla solo esa
vez:
1. El parte lo anota en «Propuestas sobre las reglas»: qué falló, por qué no lo vio ningún juez y qué regla o
   comprobación lo habría cazado (y en qué agente o en `autonomo/jueces.mjs`, si se puede automatizar).
2. **El usuario decide.** Si la aprueba, entra aquí, en el agente que debía verlo y, si aplica, en `CLAUDE.md` y en
   los jueces automáticos. El agente nunca la añade por su cuenta (§5.1).
3. Cada regla nacida así se apunta en la lista de abajo, con la tarea donde se vio.

**Reglas nacidas de fallos**
- §1.15 (lo que la ficha no dice, se busca y se cita): pantallas del `b3` (27/10/2026); la auditoría encontró
  mecanismos y distractores sin fuente rotulados «fisiología general» o «el libro no lo dice». Pedida por el usuario.
- §4.8 (llegar al 8,75 a la primera, R1-R9): medida de `notas-meta` (27/10/2026), aprobadas por el usuario
  («apruebo todas las propuestas de regla de R1 a R9»).
- §4.6 (carpeta aparte desde la rama del bloque; nada de `git stash` ni `pkill` amplios; puerto por `PUERTO=`):
  vuelta de límites del `b3` (27/10/2026), aprobadas por el usuario.
- §1.14 (topes y consecuencias): maquetas v3 del bloque 3 (`b3`, 26/10/2026). El usuario infundió 23 L de suero en el
  shock (PVC 87, edema de 7,6 L y la frase seguía en «Tras el cristaloide»); el pulmón dejaba Vt de 2.924 mL y el ritmo
  FC 0 sin aviso. Ningún juez lo vio porque las pruebas no llevaban los mandos al tope. Entró en el profesor, el
  constructor y `CLAUDE.md` §12, por petición expresa del usuario.
- §1.7 (paciente posible): capítulo 18 del atlas, `mr` (octubre 2026). Con el EROA máximo la figura daba PAS 73 mmHg
  y un chorro de 3,4 m/s; los dos jueces la aprobaron porque las cifras iban «en la dirección del texto». Lo vio el
  director en una captura. Entró en el verificador y en `CLAUDE.md` §12.
- Revisiones de Marino R1-R3 (octubre 2026), aprobadas por el usuario:
  - `jueces.mjs` daba falsas alarmas con las imágenes de los desplegables cerrados y chocaba con un puerto fijo.
    Arreglado: carga las imágenes en el momento y elige un puerto libre.
  - Recetas Visual por id (`CLAUDE.md` §5): «Fase I» encontraba la «Fase II».
  - En una serie de revisiones, primero los archivos modelo (Merino HEMATO tenía 7 graves).
  - Dos tareas a la vez en carpetas aparte (`git worktree`, skill del plan).
- Revisiones de Marino R4-R10 (octubre 2026), aprobadas por el usuario el 15/10:
  - §1.8 erratas de dosis (vasopresina, dabigatrán, HNF; R4-R5), con consulta web si hay duda.
  - §1.9 notas de interpretación con fuente (R10: tres notas sin fuente, una contradecía a Marino), con web si hay
    discordia.
  - §1.10 umbrales redondeados (R8: la KDIGO decía «no cumple» con 2,0 → 2,3).
  - §2: SVG recreados con fondo propio (R6: texto claro sobre la caja blanca de `.article-figure`).
- Formas de los iones (octubre 2026), aprobada por el usuario el 19/10: `jueces.mjs --ficha` abre también la
  vista Visual de cada bloque. Abría las fichas solo en Texto y no vio 2 px de desborde en la Visual de «Nefronas
  que quedan».
- **Lecciones del bloque 1 de Marino** (aprobadas por el usuario el 20/10; detalle en
  `autonomo/bloques/b1/lecciones.md`): §1.11-1.13 (frases con página, cifras en su contexto, tres tipos de nota),
  §2 (nada interno a la vista, rótulos legibles, modelos que arrancan por separado, versión en todas las piezas),
  §4.6 (trabajo en paralelo) y §8 (forma de las opciones, pacientes del bloque, Texto | Estudiar). Jueces nuevos en
  `jueces.mjs` (forma de las preguntas, nombres internos, rótulos).
- Modelos vivos (octubre 2026), aprobada por el usuario el 19/10: los jueces miden el desborde también **después de
  contestar** cada pregunta y en cada paso de los casos (`jueces.mjs --modelo`, pruebas en `autonomo/pruebas/`). El
  río y mar se iba 21-31 px de lado tras contestar y no lo vio nadie hasta el profesor.

## 7. Sirve para estudiar (rúbrica; manda tanto como la fidelidad)

Nació del piloto `mr` (capítulo 18): el texto era fiel y todo funcionaba, pero era un bloque de texto con una figura
pobre que no ayudaba a estudiar. Al usuario le importa **tanto que se entienda y se estudie bien como que sea fiel**.

**Los modelos «así sí» del usuario** (compara siempre con ellos, con capturas):
- Mecanismo animado paso a paso: `js/modules/cardiologia/receptores-animados.js` (Merino Cardiología, vasopresores).
- Simulación de la fisiología que se mueve: la nefrona viva (`js/modules/nefrologia/nefrona-viva.js`), el glomérulo,
  el potasio (`hiperpotasemia-sim.js`) y el filtro de la TRR.
- Capítulos del atlas ya hechos con el ecógrafo y el motor: 14 (`cap-vd.html` + `vd.mjs`) y 10 (`cap-diastolica.html`
  + `diastolica.mjs`).
- Vista Visual de las fichas: las recetas de `js/modules/merino-hemato/visual.js` y `js/modules/nefrologia/visual-*.js`.

**Cada pantalla de contenido cumple esto:**
1. **Primera vista**: arriba, la idea central en 1-2 frases y la figura. Nunca un muro de texto antes de la imagen.
2. **Nada de párrafos largos**: más de ~6 líneas en el móvil sin estructura es un fallo. Lo enumerable va en tablas
   (`.data-table`), campos con etiqueta (`kv-row`), chips, acordeones o un flujo de pasos.
3. **Resaltado**: en cada bloque, 1-3 conceptos o cifras clave resaltados con el color de su significado (`.hl-rojo`
   alarma, `.hl-verde` normal, `.hl-azul` mecanismo, `.hl-purpura` definición) o `<strong>`. Ni nada resaltado ni todo.
4. **Lo que el tema enseña se ve**: el mecanismo central del capítulo o la ficha tiene su imagen viva, al nivel de
   los modelos. Si existe la pieza en la app (ecógrafo con Doppler color, motor del latido, nefrona, kit Visual),
   **se usa**: p. ej. en una valvulopatía, el chorro en color en la vista ecográfica real, no un esquema de círculos.
5. **Interactivo que enseña**: los mandos cambian lo que el texto explica y una frase viva lo traduce a clínica.
   Números sueltos en tarjetas no cuentan como figura.
6. **Vista Visual** (Texto | Visual) en las fichas de cuaderno de campo.
7. **Móvil**: se lee bien a 390 px; nada se pisa ni queda diminuto.
8. **Un modelo grande, muchas fichas.** Antes que un gráfico nuevo para cada ficha, se usa (o se amplía) un modelo
   grande que ya explique mucho: la nefrona viva, el glomérulo, el corazón y el ecógrafo, el motor del latido. La
   ficha abre el modelo **en el estado de su tema** (p. ej. la nefrona con un diurético de asa actuando). Un número
   en una barra o en un indicador no es una figura. Si ningún modelo sirve y uno nuevo explicaría muchos temas (p. ej.
   un pulmón con respirador para toda la ventilación mecánica), se propone al usuario: es una decisión grande.

9. **Cada cita lleva a la app** (el usuario, 20/10/2026: «que te lleve directamente al párrafo o al sitio donde te
   viene explicado eso»). En un modelo vivo, una maqueta o una pregunta, cada cifra o concepto con su página del PDF
   lleva además **«Ver en la ficha»**: el enlace cruzado de siempre al párrafo exacto (`data-resaltar="#id"`), que
   está en español. Si el trozo no tiene id, se le pone. Si el concepto vive en otra parte de la app (otra ficha,
   otro libro, otro modelo), también se enlaza. El PDF queda como segunda opción, nunca como la única.
10. **Explorar explica, no solo enseña** (mismo día: «que te diga, pues mira, en una sepsis pasa esto, pasa esto,
    como puedes ver en la imagen»). Cada estado con nombre de un modelo vivo lleva su **explicación guiada**: 3-5
    pasos cortos que se leen uno a uno y, en cada paso, señalan en el dibujo lo que cuentan (resalte o lupa), con
    su «Ver en la ficha». No sustituye a la Mayéutica: Explorar explica; la Mayéutica pregunta.
11. **Modelos por concepto, no por libro** (mismo día: «estas maquetas en vivo quizá no solo valgan para este libro…
    que también te aparezca la sepsis en otro libro… y se pueda integrar dentro del molde visual»). Un modelo vivo
    se nombra y se construye por el **mecanismo** (la herida, el capilar, la nefrona), no por el capítulo. Cada
    estado guarda sus fuentes como una **lista** (libro, página, ficha), para que otro libro pueda añadir su estado o
    su matiz sin rehacer el modelo. Las fuentes nunca se funden: si dos libros dicen distinto, el estado muestra las
    dos con su nota (§1.8).

12. **Los modelos grandes son megaproyectos** (el usuario, 21/10/2026: «pensarlos como si fueran unos mega proyectos,
    que después de completar el Marino y tener la base hecha, habrá que completarlos con el resto de contenido de la
    app»). Un modelo nuevo nace con su **mapa de crecimiento**: qué conceptos de toda la app (Marino, Manual UMI, El
    Libro Azul, PIF, Merino, guías) podrá explicar, qué estados y mandos le añadirá cada fuente y qué piezas comunes
    necesita para crecer sin rehacerse. Se construye primero con Marino, pero su estructura (datos por estado con sus
    fuentes en lista, §7.11; escenas por capas; monitor y mandos comunes) ya debe aguantar lo demás. El nivel visual,
    el de los mejores modelos de la app o más: un objeto real hecho de muchas piezas pequeñas que se entiende al
    mirarlo (método «Anatomy», `autonomo/bloques/b3/encargo.md`), nunca un esquema de cajas.

**Cómo se juzga**: el agente `profesor` puntúa del 0 al 10 cada punto (y los de §8 si hay preguntas) mirando
capturas al lado de un modelo. Para pasar, **todos los puntos con 8 o más**; si
alguno queda por debajo, la tarea se repite: vuelve al constructor con lo que falta. **La meta es 8,75 o más**: en
los puntos entre 8 y 8,75, el profesor dice qué los subiría y se hace si es barato y quedan vueltas; si no, va al
parte (el usuario, 25/10/2026; antes era del 1 al 5 y se pasaba con 4).

## 8. Preguntas para estudiar

Aprobado por el usuario el 14/10/2026 sobre una maqueta. **El modelo es `autonomo/modelos/preguntas-para-estudiar.html`**
(ábrelo con el servidor de la app y míralo antes de escribir una sola pregunta). Las preguntas no son un examen
suelto: son **otra forma de estudiar el mismo contenido**, para cuando no apetece leer la ficha entera, y para
aprender casos que mañana aparecerán en la guardia.

**Dónde**: el interruptor de cada ficha pasa a ser **Texto | Visual | Preguntas**. «Preguntas» abre, sin salir de
la ficha, tres partes seguidas:
1. **El recorrido de la ficha**: una pregunta por cada idea importante, **en el orden del texto** (no se barajan),
   de lo básico a lo fino. Al acabarlo, has repasado la ficha entera.
2. **Otra vez lo que fallaste** o sabías a medias, solo eso.
3. **El caso clínico** (uno o varios).

**Los formatos (solo estos tres):**
- **Test con «piensa antes»**: el enunciado sale solo; las opciones aparecen al pulsar «Ya lo tengo: ver opciones».
  En los casos, siempre así. Cada opción falsa explica **qué le habría pasado al paciente** o por qué no.
- **Piensa y destapa**: pregunta de razonamiento («cómo lo harías y por qué», «qué cambia si…», «qué le contestas al
  adjunto»), nunca de definición. Dice cuántas cosas tiene la respuesta («son cuatro cosas»). La respuesta sale en
  2-4 puntos con su resaltado y el usuario marca **uno a uno** los que tenía. Si falta alguno, vuelve en la parte 2.
- **Encuentra el error**: un texto que suena real (nota de evolución, plan del residente de guardia, informe), de
  4-6 frases. **Puede haber 0, 1 o 2 errores**, y el enunciado lo dice. Marcar una verdadera también es fallo. Los
  errores son **confusiones reales** que la fuente aclara: una cifra cambiada, un sentido al revés (sube/baja,
  sensible/específico), un fármaco o una dosis del caso equivocado, un «siempre» o un «nunca» que la fuente niega.
  Nunca una frase absurda. Tras corregir, cada error pide pensar la frase buena antes de verla.

**Fuera**: las de redactar (nadie escribe en el móvil), completar huecos, emparejar y «explícaselo a otro».

**Dificultad**: las opciones falsas son verosímiles y salen de la propia ficha (lo que se confunde de verdad); la
correcta no es siempre la más larga. Si una pregunta se acierta sin haber estudiado, está mal hecha.

**El caso clínico** (el usuario lo quiere especialmente):
- Un paciente que **evoluciona** en 5-8 pasos, con día o momento («Día 7», «Alta de la UCI»). Su ficha (edad,
  motivo, fármacos, analítica) **se va rellenando** y lo nuevo de cada paso se marca en rojo.
- Hay que **interpretar los datos**: calcular (una caída en %, un balance), puntuar con la escala o la calculadora
  de la app que exista, abriéndola desde el caso, y decidir.
- **Mezcla los tres formatos**: incluye al menos un «encuentra el error» con el plan de otro residente y un «piensa y
  destapa».
- El cuadro tiene un giro que cambia la decisión (en el modelo, la trombosis que sube la 4Ts de 5 a 7).
- Termina con **«Lo que te llevas»** (3 puntos) y el camino de vuelta: a la ficha y, si lo hay, al modelo visual en el
  estado del paciente (la nefrona, el ecógrafo).
- **El paciente se inventa; la medicina, no.** Edad, día y cifras del paciente son del caso, y deben ser las de un
  paciente posible (§1.7). Toda conducta, dosis, umbral o mecanismo sale de la fuente, y el auditor lo coteja igual
  que el texto.
- Varios casos por ficha si la ficha da para ello.

**Cuántas**: el recorrido, una por idea importante (no un número fijo); al menos un caso por ficha o por bloque de
fichas cortas. Cada pregunta enlaza su sitio en el texto («Ver en el texto»).

**Mayéutica** (decisión del usuario, 19/10/2026; ya funciona en el ácido-base vivo y el río y mar):
- **Nombre e idea**: es la mayéutica socrática, la que cuenta Platón: aprender **a base de preguntas** que te llevan a
  entender por qué son las cosas. **Interruptor de la ficha: Texto | Estudiar** (decisión del 20/10/2026, sustituye
  a «Texto | Visual | Mayéutica»). Estudiar es un recorrido de 5 pasos: Mira (la vista Visual), Juega con el modelo
  (el modelo vivo en su estado), Piensa (Guía socrática), Examínate (Examen y repaso) y El caso; al final, siempre,
  «Para profundizar». El Texto sigue siendo la base completa de todo.
- **Pacientes del bloque**: el encargo de cada bloque trae la lista de pacientes (nombre, edad, ingreso) y todos la
  usan; nunca dos pacientes con el mismo nombre y datos distintos (lección 9).
- **Dos tipos de pregunta, los dos en cada ficha**:
  - **Guía socrática**: preguntas encadenadas que te llevan de la mano («¿qué pasa si…?», «¿por qué el riñón tarda
    días?»). Si da pereza leer, se aprende jugando con el modelo y siguiendo las preguntas.
  - **Examen**: difíciles, al nivel del MIR o de una oposición, con distractores finos que salen de la propia fuente.
    Pueden ser algo ambiguas si la fuente lo es, pero siempre con una respuesta defendible desde la fuente y su
    explicación. La correcta nunca se adivina por la forma: no es la más larga en más de ⅓ de los tests, ni la más
    corta en más de ⅓, ni cae en la misma posición en más de la mitad (lección 4 del bloque 1; lo mide `jueces.mjs`).
- **Predice y comprueba**: en las preguntas que se responden con el modelo, el modelo no enseña la cifra antes de
  contestar.
- **Cobertura**: la Mayéutica y los modelos vivos deben explicar la mayor parte de la ficha (objetivo ≈85 %). Lo que
  no cubren va al final como **«Para profundizar»**: una pestaña plegable con ese trozo de información, más el enlace
  directo a su sitio en el texto. Nunca se deja fuera sin decirlo.

**Las preguntas que ya hay** en la app (test sueltos y de redactar) se reconvierten más adelante, en una tarea que
pedirá el usuario. Hasta entonces no se tocan.
