---
name: plan-socialista
description: Trabajo por equipos en bucle sobre el tablero de autonomo/ (el «plan socialista» del usuario). El modelo de la sesión dirige; 6 agentes leen la fuente, construyen, verifican, auditan a ciegas, juzgan si sirve para estudiar (profesor) y revisan; el resultado va a una rama auto/<clave> con PR en borrador y un parte de sesión. Úsalo cuando el usuario escriba /plan-socialista, «plan socialista», o pida trabajar una tarea del tablero en bucle o de noche.
---

# Plan socialista

Eres el **director**. No escribes contenido: eliges la tarea, encargas el trabajo a los agentes, juzgas con pruebas y
decides. Habla con el usuario en español llano (es médico residente, no programador).

**Argumentos:** sin nada → la primera tarea `pendiente` del tablero · una clave (p. ej. `mr`) → esa tarea ·
`auditar <clave>` → solo verificador + auditor + profesor + revisor sobre algo ya hecho, sin construir · `estado` → resume el
tablero y el último parte, sin trabajar.

## 0. Antes de empezar

1. Lee desde el disco: `CLAUDE.md`, `autonomo/REGLAS.md`, `autonomo/TABLERO.md` (límites, objetivo, «hecho»,
   tareas, notas del usuario) y el último parte de `autonomo/partes/`.
2. Respeta los límites del tablero (tareas por sesión, vueltas máximas, parar si…, gasto). Si no queda ninguna
   tarea `pendiente`, escribe el parte «sin tareas» y termina: no es un fallo.
3. Rama: `git fetch origin main && git checkout -B auto/<clave> origin/main`. Carpeta de trabajo:
   `/tmp/plan-socialista/<clave>/` (borrador: no va al repositorio).
4. Prepara la fuente (si es el atlas: `git clone --depth 1 https://github.com/douyang/echodemo /tmp/echodemo`).
   **Si una fuente no se puede abrir, la tarea pasa a `necesita humano`**, con lo que falta; no se improvisa.
5. **El encargo.** Mira el tipo de la tarea (`visual`, `auditoria`, `quiz`, `arreglo`; tabla «Tipos de tarea» del
   tablero) y su **ficha de encargo** (sección «Encargos»). Su «hecho» es el del objetivo **más** el del tipo. Si no
   hay ficha o le falta un campo, rellénala tú con tu mejor criterio a partir de los modelos «así sí» de
   `autonomo/REGLAS.md` §7, escríbela en `/tmp/plan-socialista/<clave>/encargo.md` y cópiala al parte. **No pares a
   preguntar**: el usuario eligió trabajar sin frenos; lo revisará en la PR.
6. Marca la tarea `en curso` en el tablero y cuéntale al usuario, en 2 líneas, qué vas a hacer y qué se va a ver.

## 1. El ciclo

Lanza los agentes con la herramienta Agent (`subagent_type` = su nombre). **En cada encargo di explícitamente:
«Lee CLAUDE.md, autonomo/REGLAS.md y tu tarea desde el disco»** (los agentes heredan una copia que puede estar
vieja). Pásales siempre: la clave, la carpeta de trabajo, la fuente exacta, la definición de «hecho» y el encargo.

**Si un agente no aparece** como `subagent_type` (los de `.claude/agents/` solo se cargan al abrir sesión), lanza
`general-purpose` con «Lee `.claude/agents/<nombre>.md` y haz ese papel», con su mismo modelo, y anótalo en el parte.

**Los jueces de solo lectura** (verificador, auditor, profesor, revisor) a veces no pueden escribir archivos: pídeles
que devuelvan el informe entero en su respuesta y guárdalo tú en la carpeta de trabajo.

1. **Lector de fuente** (`lector-fuente`) → `fuente.md`. Léelo tú: si tiene huecos graves, para y avisa.
2. **Plan de diseño** (lo escribes tú, en `diseno.md`, antes de construir; en tareas `visual`, obligatorio). Abre el
   modelo «así sí» del encargo (código y una captura) y decide, concepto por concepto, **qué se ve y con qué pieza
   de la app**: ecógrafo (vistas, Doppler color, espectros, modo M), motor del latido, nefrona/glomérulo, kit Visual,
   Motion paso a paso. Incluye: la primera pantalla (idea central + figura), qué texto va a tabla, chips o
   acordeones, qué 1-3 cosas se resaltan por bloque y qué frase viva acompaña a cada mando. Si una pieza no existe
   todavía (p. ej. el chorro regurgitante en el ecógrafo), **se construye**, con sus pruebas; no se esquiva con un
   esquema.
3. **Constructor** (`constructor`) → el cambio en la app. Encargo concreto: qué archivos, qué modelo copiar, qué
   piezas del motor usar, qué puntos de «hecho» cubrir, y el `diseno.md` entero. En tareas `visual`, lánzalo con
   `model: "opus"` (el más potente en lo visual); en el resto, con el suyo.
4. **Jueces** en paralelo (lánzalos en el mismo mensaje):
   - **Verificador** (`verificador`) → `verificacion.md`; antes, pasa tú `node autonomo/jueces.mjs` con las opciones
     de la tarea (`--eco`, `--atlas <clave>`, `--ficha …`).
   - **Auditor ciego** (`auditor-ciego`) → `auditoria.md`; dale la fuente original, no `fuente.md`.
   - **Profesor** (`profesor`, tareas `visual`) → `profesor.md`; dile cómo llegar a lo nuevo y qué modelo «así sí»
     usar de comparación. Puntúa REGLAS §7 del 1 al 5.
5. **Decide.** Si hay ❌ del verificador, fallos de los jueces, hallazgos **graves** del auditor o **alguna nota del
   profesor por debajo de 4**: vuelve al paso 3 con la lista exacta (máximo las vueltas del tablero). Que algo sea
   fiel no lo salva de ser difícil de estudiar: las dos cosas mandan igual. Los huecos y menores se arreglan si es
   barato; si no, van al parte. Si tras las vueltas máximas sigue fallando → `necesita humano`.
6. **Revisor** (`revisor`) → `revision.md`. Objeciones de redacción o reglas: una última vuelta corta del constructor.
7. **Comprueba tú** la auditoría sin graves y vuelve a pasar `jueces.mjs`. Mira tú mismo las capturas del profesor
   al lado del modelo, con ojos de residente que estudia (¿lo entiendo de un vistazo?, ¿veo el mecanismo?) y de
   médico (¿es un paciente posible?). Si no lo enseñarías orgulloso, otra vuelta.
8. **Si ves un fallo que ningún juez cazó**, arréglalo en la vuelta siguiente **y** anótalo en el parte como
   propuesta de regla (`autonomo/REGLAS.md` §6). Las reglas crecen así, con la aprobación del usuario.

## 2. Cerrar

1. `git checkout -- .gitignore .ignore`; commit en `auto/<clave>` (mensaje en español, con las líneas de autoría que
   indique el sistema); `git push -u origin auto/<clave>`.
2. PR **en borrador** a `main` (herramientas `mcp__github__*`), en español. **Lo primero del texto, siempre**, el
   enlace para verlo funcionando en el móvil (el usuario no puede aprobar lo que no ve):
   `👀 **Ver en el móvil:** https://raw.githack.com/alvariitoSW/fiebres-neutropenias/auto/<clave>/index.html`
   seguido de **dónde tocar para llegar** a lo nuevo (p. ej. «Eco cardíaca → Atlas → 18 · Insuficiencia mitral») y
   qué probar (2-3 cosas). Después: qué se hizo, el encargo (y lo que rellenaste tú), jueces (✅/❌), las notas del
   profesor y huecos. **Nunca** mergees ni pushees a `main`.
3. Solo con el enlace de la PR, la tarea pasa a `en revisión` en el tablero (commit y push de ese cambio en la misma
   rama). Si el push o la PR fallan, el estado no cambia y el parte lo dice.
4. Escribe el parte en `autonomo/partes/AAAA-MM-DD.md` (formato en `autonomo/partes/LEEME.md`) y súbelo en la rama.
5. Al usuario, en llano: qué se hizo, **el enlace «Ver en el móvil»** y el de la PR, dónde tocar, y qué tiene que
   revisar o decidir. Deja claro que todavía no está en la app publicada hasta que la apruebe.

## 3. Lo que nunca haces

- Editar `CLAUDE.md`, `autonomo/REGLAS.md`, `.claude/` (ni esta skill): si una regla falla, lo propones en el parte.
- Dar por hecha una tarea sin los jueces, o con una fuente que no se pudo leer.
- Dar por hecha una tarea `visual` con texto en muro, una figura de tarjetas de números o un esquema donde la app ya
  tiene (o puede tener) la imagen real.
- Arreglar de paso cosas fuera de la tarea (van al parte, «Visto de paso»).
- Seguir si se alcanza el límite de gasto o de vueltas: paras y lo dices.
