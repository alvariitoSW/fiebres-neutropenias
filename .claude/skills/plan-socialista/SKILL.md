---
name: plan-socialista
description: Trabajo por equipos en bucle sobre el tablero de autonomo/ (el «plan socialista» del usuario). El modelo de la sesión dirige; 7 agentes leen la fuente, construyen o revisan lo ya construido (fuente, imágenes y código grave), verifican, auditan a ciegas, diseñan y juzgan la parte de estudio (profesor: mapa visual de un libro, modelos grandes, preguntas guiadas y casos clínicos) y revisan; el resultado va a una rama auto/<clave> con PR en borrador y un parte de sesión. Úsalo cuando el usuario escriba /plan-socialista, «plan socialista», o pida trabajar una tarea del tablero en bucle o de noche.
---

# Plan socialista

Eres el **director**. No escribes contenido: eliges la tarea, encargas el trabajo a los agentes, juzgas con pruebas y
decides. Habla con el usuario en español llano (es médico residente, no programador).

**Argumentos:** sin nada → la primera tarea `pendiente` del tablero · una clave (p. ej. `mr`) → esa tarea ·
`estudio <clave>` → fase A ligera y fase B sobre algo que ya está en la app · `revisar <clave>` → **fase R**
(revisar sin construir, abajo) · `mapa <libro>` → el profesor en modo mapa sobre un libro entero · `auditar <clave>` →
solo verificador + auditor + profesor (modo juzgar) + revisor sobre algo ya hecho, sin construir · `estado` → resume el
tablero y el último parte, sin trabajar.

## 0. Antes de empezar

1. Lee desde el disco: `CLAUDE.md`, `autonomo/REGLAS.md`, `autonomo/TABLERO.md` (límites, objetivo, «hecho»,
   tareas, notas del usuario) y el último parte de `autonomo/partes/`.
2. **Solo trabajas tareas del tablero**: ahí están las que el usuario aprobó (con `/bitacora` o escribiéndolas él). Lo
   que está en `autonomo/BITACORA.md` sin aprobar no se toca, aunque parezca urgente.
3. Respeta los límites del tablero (tareas por sesión, vueltas máximas, parar si…, gasto). Si no queda ninguna
   tarea `pendiente`, escribe el parte «sin tareas» y termina: no es un fallo.
4. Rama: `git fetch origin main && git checkout -B auto/<clave> origin/main`. **Si la tarea continúa una PR sin
   fusionar** (lo dice su fila del tablero), se trabaja sobre esa rama (`git fetch origin auto/<clave> && git
   checkout auto/<clave>`, fusionando antes `origin/main` si va por detrás) y se completa la misma PR. Carpeta de trabajo:
   `/tmp/plan-socialista/<clave>/` (borrador: no va al repositorio).
5. Prepara la fuente (si es el atlas: `git clone --depth 1 https://github.com/douyang/echodemo /tmp/echodemo`).
   **Si una fuente no se puede abrir, la tarea pasa a `necesita humano`**, con lo que falta; no se improvisa.
6. **El encargo.** Mira el tipo de la tarea (`visual`, `estudio`, `auditoria`, `arreglo`; tabla «Tipos de tarea» del
   tablero) y su **ficha de encargo** (sección «Encargos»). Su «hecho» es el del objetivo **más** el del tipo. Si no
   hay ficha o le falta un campo, rellénala tú con tu mejor criterio a partir de los modelos «así sí» de
   `autonomo/REGLAS.md` §7, escríbela en `/tmp/plan-socialista/<clave>/encargo.md` y cópiala al parte. **No pares a
   preguntar**: el usuario eligió trabajar sin frenos; lo revisará en la PR.
7. Marca la tarea `en curso` en el tablero y cuéntale al usuario, en 2 líneas, qué vas a hacer y qué se va a ver.

## 1. El ciclo

Lanza los agentes con la herramienta Agent (`subagent_type` = su nombre). **En cada encargo di explícitamente:
«Lee CLAUDE.md, autonomo/REGLAS.md y tu tarea desde el disco»** (los agentes heredan una copia que puede estar
vieja). Pásales siempre: la clave, la carpeta de trabajo, la fuente exacta, la definición de «hecho» y el encargo.

**Si un agente no aparece** como `subagent_type` (los de `.claude/agents/` solo se cargan al abrir sesión), lanza
`general-purpose` con «Lee `.claude/agents/<nombre>.md` y haz ese papel», con su mismo modelo, y anótalo en el parte.

**Los agentes de solo lectura** (verificador, auditor, profesor, revisor) a veces no pueden escribir archivos: pídeles
que devuelvan el informe o el plan entero en su respuesta y guárdalo tú en la carpeta de trabajo.

Cada tarea tiene **dos fases**, en este orden. Las dos mandan igual: algo fiel que no se estudia bien no está
hecho, y algo bonito que no es fiel tampoco.

### Fase A · Fiel (el contenido y su fuente)

En las tareas `estudio` (el contenido ya está en la app) es **ligera**: solo el paso 3, la comprobación de fuentes
sobre lo que ya hay (cifras, páginas, bibliografía y enlaces `#page=` contra el PDF), con el auditor y el constructor
en el modelo barato. Lo grave se corrige antes de la fase B; lo que está bien no se reescribe. Si la tarea dice que
su fase A ya está hecha (p. ej. la continuación de un piloto), se salta.

1. **Lector de fuente** (`lector-fuente`) → `fuente.md`. Léelo tú: si tiene huecos graves, para y avisa.
2. **Constructor** (`constructor`) → el texto en la app, completo y con sus fuentes, siguiendo los archivos modelo.
3. **Auditor ciego** (`auditor-ciego`) → `auditoria-a.md`; dale la fuente original, no `fuente.md`. Si hay graves,
   vuelve al paso 2 con la lista exacta.

### Fase B · Para estudiar (lo visual y las preguntas)

4. **Profesor en modo diseñar** (`profesor`, siempre con el modelo más potente) → `plan-estudio.md`. Dale el texto
   ya fiel, la fuente, la auditoría y el encargo. Diseña lo visual con los modelos grandes de la app, la primera
   pantalla, el recorrido de preguntas y los casos clínicos (REGLAS §7 y §8). **Léelo tú** contra el encargo y el
   modelo: si propone un modelo nuevo grande (decisión del usuario), no lo construyas, anótalo en el parte y sigue
   con lo que sí se puede. Si una pieza del motor falta (p. ej. el chorro regurgitante en el ecógrafo), **se
   construye**, con sus pruebas; no se esquiva con un esquema.
5. **Constructor** (`constructor`, con `model: "opus"`) → lo visual, el texto reorganizado para estudiar y las
   preguntas, con el `plan-estudio.md` entero y el modelo de preguntas `autonomo/modelos/preguntas-para-estudiar.html`.
   Si las preguntas necesitan el botón «Preguntas» y sus formatos y la app aún no los tiene (tarea `preguntas` del
   tablero sin `hecha`), las preguntas se escriben en el formato de test actual con el estilo de §8 (razonamiento,
   distractores verosímiles, sin redactar), los casos se dejan escritos en `plan-estudio.md` y el parte lo dice.
6. **Jueces** en paralelo (lánzalos en el mismo mensaje):
   - **Verificador** (`verificador`) → `verificacion.md`; antes, pasa tú `node autonomo/jueces.mjs` con las opciones
     de la tarea (`--eco`, `--atlas <clave>`, `--ficha …`).
   - **Auditor ciego** (`auditor-ciego`) → `auditoria-b.md`: coteja con la fuente **las preguntas, las explicaciones,
     los casos y lo que dice cada figura** (el paciente del caso es inventado; su medicina no).
   - **Profesor en modo juzgar** (`profesor`) → `profesor.md`; dile cómo llegar a lo nuevo y qué modelo «así sí» usar.
7. **Decide.** Si hay ❌ del verificador, fallos de los jueces, hallazgos **graves** del auditor o **alguna nota del
   profesor por debajo de 4**: vuelve al paso 5 con la lista exacta (máximo las vueltas del tablero). Los huecos y
   menores se arreglan si es barato; si no, van al parte. Si tras las vueltas máximas sigue fallando →
   `necesita humano`.

### Modo bloque · Marino en modelos vivos (Objetivo M5, desde el 19/10/2026)

Es la prioridad del tablero. Un bloque de Marino se trabaja entero y se aprueba antes de empezar el siguiente. Todo
gira alrededor del **paquete del bloque** (`autonomo/bloques/<bN>/encargo.md`, ver `autonomo/bloques/LEEME.md`):
escríbelo tú antes de lanzar a nadie, y en cada encargo di «lee el paquete», no «lee todo el proyecto».

1. **Cobertura** · profesor (potente), modo cobertura → `autonomo/bloques/<bN>/cobertura.md`. Léelo: si propone
   modelos nuevos, van a maqueta (el usuario elige).
2. **Maquetas** de los modelos nuevos · un constructor potente por maqueta, en paralelo → `autonomo/maquetas/`.
   Publícalas como Artifact y espera la elección del usuario.
3. **Modelos en la app** · constructor potente, uno por modelo, cada uno en su carpeta (`git worktree`) y con dueño
   fijo de cada archivo compartido. Copia el patrón del río y mar (`js/modules/libros/agua-viva*`) y añade su prueba
   en `autonomo/pruebas/<clave>.mjs` para `jueces --modelo`.
4. **Estudio en las fichas** · constructor **barato**, por grupos de fichas, siguiendo el modelo ya hecho: interruptor
   Texto | Visual | Mayéutica, Guía socrática y Examen, casos, «Para profundizar» y ruta del bloque.
5. **Jueces** (`--ficha` y `--modelo`, los pasas tú) · **auditor** (barato, solo lo nuevo) · **profesor** (potente,
   juzgar sobre la prueba guiada y capturas) en paralelo. Ya no hace falta el verificador como agente: solo si un
   simulador necesita mirar «paciente posible» a mano.

### Ahorro (aprobado por el usuario el 19/10/2026)

- **Lista de comprobación del constructor** (`.claude/agents/constructor.md`): la pasa antes de entregar. Si un juez
  encuentra algo que estaba en la lista, la vuelta la paga el constructor, no un juez más.
- **Informes de 40 líneas como mucho**, en la carpeta del bloque, con ✅/❌ y «No comprobado / riesgo» al final. Lee el
  archivo, no pidas el informe entero en el mensaje.
- **Modelos**: potente solo para el profesor y los modelos vivos o maquetas; barato para el auditor, la Mayéutica
  siguiendo un modelo, el revisor de código y el verificador.
- **Escalera antes de escribir código** (idea de Ponytail): reutilizar lo que ya hay antes de escribir nada nuevo. Vale
  para el código; el contenido médico y lo visual no se recortan.
- **Paralelo con dueño de archivo**: dos constructores a la vez, cada uno en su carpeta; los archivos compartidos los
  toca uno solo y tú juntas al fusionar.
- **Límite de uso**: si un agente se para por el límite, se reanuda con SendMessage cuando se reinicia; no se lanza
  otro desde cero.

### Fase R · Revisar lo ya construido (tareas `revision`)

Para lo que ya está en la app y ya tiene su fuente: **no se construye nada, se revisa**. Trabajadores revisores,
todos en el modelo barato, lanzados a la vez:
- **Auditor ciego** (`auditor-ciego`) → `auditoria.md`: cada ficha del bloque frente a su PDF y su página. ¿Están
  **todos los temas** del capítulo? ¿Las cifras? ¿Las **figuras e imágenes** del PDF que tocan, y cargan?
  ¿Bibliografía y enlaces `#page=` correctos?
- **Revisor de código** (`revisor-codigo`) → `codigo.md`: solo graves y, como mucho, 3 simplificaciones seguras.
- **Verificador** (`verificador`) → `verificacion.md`, con `jueces.mjs --ficha …` de cada ficha del bloque.

A los tres pídeles, además, **«Ideas para la parte de estudio»**: 2-3 líneas de qué imagen, mecanismo o modelo grande
ayudaría a estudiar lo que han visto. Tú las añades a `autonomo/ideas/<libro>.md` (las usa el profesor en modo mapa).

Decide: lo **grave** lo corrige el constructor (modelo barato, solo eso) y se repite el verificador; lo menor va
al parte (si son 3 o menos y baratos, se corrigen en la misma vuelta). Siempre hay PR en borrador, aunque solo lleve
el parte y las ideas: así llegan a `main` cuando el usuario la aprueba.

**Orden dentro de una serie de revisiones**: primero los **archivos modelo** de la app (`CLAUDE.md` §6). Sus fallos
se copian a otras fichas (Merino HEMATO, modelo de fichas con calculadora, tenía 7 graves).

### Entregas sin esperar (el usuario revisa mientras tú sigues)

En bucle (`/loop /plan-socialista`), cada tarea acaba en su propia PR pequeña. **No esperes a que el usuario la
apruebe**: avísale en el chat con el enlace «Ver en el móvil», dónde tocar y 2-3 cosas que mirar, y sigue con la
siguiente tarea. Si la siguiente depende de una PR aún sin fusionar, trabaja sobre la rama de esa PR y di en la nueva
«va encima de #N». Si el usuario contesta con cambios, se atienden en la vuelta siguiente de esa misma PR.

**Dos tareas a la vez**: la segunda trabaja en una carpeta aparte (`git worktree add /tmp/wt-<clave> -B auto/<clave>
origin/main`), con su propio servidor en otro puerto; así no se pisan los archivos. Al cerrarla,
`git worktree remove /tmp/wt-<clave>`. `jueces.mjs` elige solo un puerto libre, así que se puede pasar en las dos.

### Cierre del ciclo

8. **Revisor** (`revisor`) → `revision.md`. Objeciones de redacción o reglas: una última vuelta corta del constructor.
9. **Comprueba tú**: auditorías sin graves y `jueces.mjs` otra vez. Mira tú mismo las capturas del profesor al lado
   del modelo, con ojos de residente que estudia (¿lo entiendo de un vistazo?, ¿veo el mecanismo?, ¿las preguntas
   me obligan a pensar?) y de médico (¿es un paciente posible?). Si no lo enseñarías orgulloso, otra vuelta.
10. **Si ves un fallo que ningún juez cazó**, arréglalo en la vuelta siguiente **y** anótalo en el parte como
    propuesta de regla (`autonomo/REGLAS.md` §6). Las reglas crecen así, con la aprobación del usuario.

## 2. Cerrar

1. `git checkout -- .gitignore .ignore`; commit en `auto/<clave>` (mensaje en español, con las líneas de autoría que
   indique el sistema); `git push -u origin auto/<clave>`.
2. PR **en borrador** a `main` (herramientas `mcp__github__*`), en español. **Lo primero del texto, siempre**, el
   enlace para verlo funcionando en el móvil (el usuario no puede aprobar lo que no ve):
   `👀 **Ver en el móvil:** https://raw.githack.com/alvariitoSW/fiebres-neutropenias/auto/<clave>/index.html`
   seguido de **dónde tocar para llegar** a lo nuevo (p. ej. «Eco cardíaca → Atlas → 18 · Insuficiencia mitral») y
   qué probar (2-3 cosas, incluido un caso clínico entero si hay preguntas). Después: qué se hizo, el encargo (y lo
   que rellenaste tú), jueces (✅/❌), las notas del profesor, los modelos nuevos que propone (para que decidas) y
   huecos. **Nunca** mergees ni pushees a `main`.
3. Solo con el enlace de la PR, la tarea pasa a `en revisión (AAAA-MM-DD)` en el tablero (commit y push de ese cambio en la misma
   rama). Si el push o la PR fallan, el estado no cambia y el parte lo dice.
4. Escribe el parte en `autonomo/partes/AAAA-MM-DD.md` (formato en `autonomo/partes/LEEME.md`) y súbelo en la rama.
   Lo que necesites del usuario y las propuestas de regla, bien visibles: la bitácora los recoge de ahí.
5. Al usuario, en llano: qué se hizo, **el enlace «Ver en el móvil»** y el de la PR, dónde tocar, y qué tiene que
   revisar o decidir. Deja claro que todavía no está en la app publicada hasta que la apruebe.

## 3. Lo que nunca haces

- Editar `CLAUDE.md`, `autonomo/REGLAS.md`, `.claude/` (ni esta skill): si una regla falla, lo propones en el parte.
- Dar por hecha una tarea sin los jueces, o con una fuente que no se pudo leer.
- Dar por hecha una tarea `visual` o `estudio` con texto en muro, una figura de tarjetas de números o un esquema
  donde la app ya tiene (o puede tener) la imagen real, o con preguntas que se aciertan sin estudiar.
- Escribir preguntas de redactar, de completar huecos o de emparejar (REGLAS §8).
- Arreglar de paso cosas fuera de la tarea (van al parte, «Visto de paso»).
- Seguir si se alcanza el límite de gasto o de vueltas: paras y lo dices.
