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

## 2. La app

1. **Sin backend, sin build, sin dependencias nuevas.** HTML/CSS/JS que el navegador ejecuta tal cual. La única
   librería es Motion (`js/vendor/`), elegida por el usuario; otra, solo si él la pide.
2. **Móvil primero**: nada desborda a 390 ni a 360 px de ancho; toques de al menos 44 px.
3. **Reutiliza antes de crear**: enlaces cruzados con `[data-especialidad]`; ayudas de `js/core/ui.js` y
   `js/core/wizard.js`; clases ya existentes de `css/components.css`. Una clase o un componente nuevos solo si no hay
   ninguno que sirva.
4. **Ids únicos en toda la app** (todas las vistas están en el DOM a la vez): comprueba con grep antes de inventar
   uno.
5. **Si cambias un `.css` o `js/main.js`**, sube la fecha `?v=` de `index.html`.
5b. **SVG recreados con fondo propio** (`var(--bg-main)`): la caja de `.article-figure` es blanca y el texto claro de la
   app desaparece en ella.
6. **Motor del simulador de eco**: si lo tocas, todas sus pruebas siguen en verde y lo cuentas en
   `js/modules/eco/README.md`. Nunca cambies una referencia de `referencias.mjs` para que una prueba pase.

## 3. Redacción

1. Español claro, frases cortas y en voz activa. Sin muletillas («cabe destacar», «es importante señalar»).
2. Nombra las cosas como las conoce un médico, no como están hechas por dentro.
3. Los botones dicen lo que hacen («Comprobar», «Ver en el texto»).

## 4. Trabajo y git

1. **Solo la tarea encargada.** Si ves otro problema, anótalo en el informe de la sesión; no lo arregles de paso.
2. **Nada se da por hecho sin pasar los jueces**: `node autonomo/jueces.mjs` en verde (con `--eco`, `--atlas` o
   `--ficha` según la tarea) y los puntos de «hecho» del tablero.
3. **El trabajo autónomo nunca va directo a `main`**: va en una rama `auto/<tarea>` con una propuesta (PR) en
   borrador. Solo el usuario la aprueba. (La regla de `CLAUDE.md` de «mergear siempre a main» es para las
   conversaciones normales, no para este modo.)
4. **Antes de cada commit**: `git checkout -- .gitignore .ignore` (las herramientas los ensucian).
5. **El contenedor se borra**: lo que no está en una rama subida a GitHub se pierde.

## 5. Lo que el agente puede y no puede tocar

1. **Las reglas son de solo lectura** para el agente: nunca edita `autonomo/REGLAS.md`, `CLAUDE.md` (ni los de los
   módulos) ni sus propias instrucciones. Si cree que una regla falla, lo propone en su informe y el usuario decide.
2. **El estado sí lo escribe**: los estados de `autonomo/TABLERO.md` y su parte en `autonomo/partes/`.
3. **No avanzar sin prueba**: una tarea solo pasa a `en revisión` cuando la PR existe en GitHub (con su enlace en el
   informe). Si el push o la PR fallan o no está claro que salieron, el estado no cambia y el informe lo dice.
4. **Lo que no se pudo leer es un hueco, no un hecho**: si una fuente no se abre (web bloqueada, PDF ilegible), la
   tarea no se marca hecha ni se salta en silencio; el informe dice qué faltó.
5. **«No había nada que hacer» no es un fallo**: si no queda tarea pendiente, el informe lo dice así.
6. **Límite de gasto**: si la sesión llega al límite del tablero, se para y deja el estado como está.

## 6. Cómo crecen estas reglas

Cuando un fallo se cuela por los jueces (lo ve el director, el revisor o el usuario después), no se arregla solo esa
vez:
1. El parte lo anota en «Propuestas sobre las reglas»: qué falló, por qué no lo vio ningún juez y qué regla o
   comprobación lo habría cazado (y en qué agente o en `autonomo/jueces.mjs`, si se puede automatizar).
2. **El usuario decide.** Si la aprueba, entra aquí, en el agente que debía verlo y, si aplica, en `CLAUDE.md` y en
   los jueces automáticos. El agente nunca la añade por su cuenta (§5.1).
3. Cada regla nacida así se apunta en la lista de abajo, con la tarea donde se vio.

**Reglas nacidas de fallos**
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

**Cómo se juzga**: el agente `profesor` puntúa del 1 al 5 cada punto (y los de §8 si hay preguntas) mirando
capturas al lado de un modelo. Si alguno queda por debajo de 4, la tarea vuelve al constructor con lo que falta.

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

**Las preguntas que ya hay** en la app (test sueltos y de redactar) se reconvierten más adelante, en una tarea que
pedirá el usuario. Hasta entonces no se tocan.
