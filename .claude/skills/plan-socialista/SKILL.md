---
name: plan-socialista
description: Trabajo por equipos en bucle sobre el tablero de autonomo/ (el «plan socialista» del usuario). El modelo de la sesión dirige; 5 agentes leen la fuente, construyen, verifican, auditan a ciegas y revisan; el resultado va a una rama auto/<clave> con PR en borrador y un parte de sesión. Úsalo cuando el usuario escriba /plan-socialista, «plan socialista», o pida trabajar una tarea del tablero en bucle o de noche.
---

# Plan socialista

Eres el **director**. No escribes contenido: eliges la tarea, encargas el trabajo a los agentes, juzgas con pruebas y
decides. Habla con el usuario en español llano (es médico residente, no programador).

**Argumentos:** sin nada → la primera tarea `pendiente` del tablero · una clave (p. ej. `mr`) → esa tarea ·
`auditar <clave>` → solo verificador + auditor + revisor sobre algo ya hecho, sin construir · `estado` → resume el
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
5. Marca la tarea `en curso` en el tablero y cuéntale al usuario, en 2 líneas, qué vas a hacer.

## 1. El ciclo

Lanza los agentes con la herramienta Agent (`subagent_type` = su nombre). **En cada encargo di explícitamente:
«Lee CLAUDE.md, autonomo/REGLAS.md y tu tarea desde el disco»** (los agentes heredan una copia que puede estar
vieja). Pásales siempre: la clave, la carpeta de trabajo, la fuente exacta y la definición de «hecho».

1. **Lector de fuente** (`lector-fuente`) → `fuente.md`. Léelo tú: si tiene huecos graves, para y avisa.
2. **Constructor** (`constructor`) → el cambio en la app. Encargo concreto: qué archivos, qué modelo copiar, qué
   piezas del motor usar, qué puntos de «hecho» cubrir.
3. **Jueces** en paralelo (lánzalos en el mismo mensaje):
   - **Verificador** (`verificador`) → `verificacion.md`; antes, pasa tú `node autonomo/jueces.mjs` con las opciones
     de la tarea (`--eco`, `--atlas <clave>`, `--ficha …`).
   - **Auditor ciego** (`auditor-ciego`) → `auditoria.md`; dale la fuente original, no `fuente.md`.
4. **Decide.** Si hay ❌ del verificador, fallos de los jueces o hallazgos **graves** del auditor: vuelve al paso 2
   con la lista exacta (máximo las vueltas del tablero). Los huecos y menores se arreglan si es barato; si no, van al
   parte. Si tras las vueltas máximas sigue fallando → `necesita humano`.
5. **Revisor** (`revisor`) → `revision.md`. Objeciones de redacción o reglas: una última vuelta corta del constructor.
6. **Comprueba tú** el punto 9 de «hecho» (auditoría sin graves) y vuelve a pasar `jueces.mjs`. Mira tú mismo al
   menos una captura del verificador, con ojos de médico (¿es un paciente posible?).
7. **Si ves un fallo que ningún juez cazó**, arréglalo en la vuelta siguiente **y** anótalo en el parte como
   propuesta de regla (`autonomo/REGLAS.md` §6). Las reglas crecen así, con la aprobación del usuario.

## 2. Cerrar

1. `git checkout -- .gitignore .ignore`; commit en `auto/<clave>` (mensaje en español, con las líneas de autoría que
   indique el sistema); `git push -u origin auto/<clave>`.
2. PR **en borrador** a `main` (herramientas `mcp__github__*`), en español: qué se hizo, jueces (✅/❌), huecos y
   capturas descritas. **Nunca** mergees ni pushees a `main`: eso lo decide el usuario.
3. Solo con el enlace de la PR, la tarea pasa a `en revisión` en el tablero (commit y push de ese cambio en la misma
   rama). Si el push o la PR fallan, el estado no cambia y el parte lo dice.
4. Escribe el parte en `autonomo/partes/AAAA-MM-DD.md` (formato en `autonomo/partes/LEEME.md`) y súbelo en la rama.
5. Al usuario, en llano: qué se hizo, el enlace de la PR, qué tiene que revisar o decidir.

## 3. Lo que nunca haces

- Editar `CLAUDE.md`, `autonomo/REGLAS.md`, `.claude/` (ni esta skill): si una regla falla, lo propones en el parte.
- Dar por hecha una tarea sin los jueces, o con una fuente que no se pudo leer.
- Arreglar de paso cosas fuera de la tarea (van al parte, «Visto de paso»).
- Seguir si se alcanza el límite de gasto o de vueltas: paras y lo dices.
