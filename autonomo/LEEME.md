# Plan socialista: guía para el usuario

Esta carpeta monta el **plan socialista**: un equipo de agentes que mejora la app en bucle. No hace falta saber programar para usarlo:
basta con saber qué pedir y revisar lo que entrega.

## Las piezas, en una frase cada una

| Pieza | Dónde está | Qué es |
|---|---|---|
| **El director** | `.claude/skills/plan-socialista/SKILL.md` | El manual de instrucciones del modelo superior. Se activa al escribir `/plan-socialista`. No escribe contenido: elige la tarea, reparte el trabajo, juzga y decide. |
| **Los 6 trabajadores** | `.claude/agents/*.md` | Agentes, cada uno con un solo papel: lector de fuente, constructor, verificador, auditor ciego, **profesor** y revisor. El profesor (el modelo más potente) diseña cómo se estudia cada tema y luego lo juzga. |
| **Los modelos** | `autonomo/modelos/` | Maquetas que tú aprobaste y que el equipo copia. La primera: las preguntas para estudiar. |
| **Los jueces** | `autonomo/jueces.mjs` | Comprobador automático: imágenes, quiz, caché y la app en el navegador a 390 y 360 px. Sirve también fuera del plan: `node autonomo/jueces.mjs`. |
| **Las reglas** | `autonomo/REGLAS.md` | Lo que nadie del equipo puede saltarse (no inventar, fidelidad a la fuente, móvil de 390 px…) y la **rúbrica «Sirve para estudiar»** (§7) con tus modelos «así sí». Es corto a propósito: los agentes lo leen en cada vuelta. |
| **La bitácora** | `autonomo/BITACORA.md` + skill `/bitacora` | Tu cuaderno de navegación: le cuentas lo que hay que hacer, lo convierte en tareas que esperan tu visto bueno y te dice «a dónde nos dirigimos». No toca la app. |
| **El tablero** | `autonomo/TABLERO.md` | Las tareas **aprobadas**, en orden, y qué significa «hecho». Es lo único que trabaja el plan. La bitácora mete aquí lo que apruebas. |
| **Los partes** | `autonomo/partes/AAAA-MM-DD.md` | Uno por sesión: qué se hizo, qué falló, qué no pudo leer y qué te deja para revisar. Es lo que lees por la mañana. |

## Cómo se usa

1. **Elige el modelo del director.** Al empezar una sesión de Claude Code, escribe `/model` y elige Opus (o Fable
   si lo tienes). Los trabajadores ya tienen su modelo fijado en su archivo.
2. **Lánzalo:**
   - `/plan-socialista`: coge la siguiente tarea pendiente del tablero.
   - `/plan-socialista mr`: hace una tarea concreta (aquí, el capítulo 18 del atlas, «Insuficiencia mitral»).
   - `/plan-socialista estudio <clave>`: solo la parte de estudio (visual y preguntas) de algo que ya está en la app.
   - `/plan-socialista auditar mr`: no construye nada; repasa una tarea ya hecha y te dice qué encuentra.
   - `/plan-socialista estado`: te resume el tablero y el último parte, sin trabajar.
3. **Mira cómo trabaja.** El director te va contando en qué vuelta está. Puedes interrumpirle cuando quieras con un
   mensaje: «para», «sáltate esa», «explícame por qué».
4. **Prueba y revisa la propuesta.** Al terminar, el director deja una propuesta de cambio (PR) en GitHub, en
   borrador. Arriba del todo lleva **«👀 Ver en el móvil»**: un enlace a una copia de la app con lo nuevo ya puesto,
   y dónde tocar para llegar. Lo pruebas en el móvil como si fuera la app. Si te convence, en la misma PR pulsas
   **«Ready for review»** y luego **«Merge pull request»** (o se lo dices al director); si no, escribes qué cambiar.
   **Nada llega a la app publicada sin que tú lo apruebes**, y la copia de prueba no toca la app real.

## Las dos fases de cada tarea

1. **Fiel.** El texto, completo y con sus fuentes, cotejado frase a frase por el auditor. Es la base y no se quita.
2. **Para estudiar.** Sobre ese texto ya fiel, el **profesor** diseña cómo se aprende el tema:
   - **lo visual**, usando los modelos grandes de la app (nefrona viva, ecógrafo, motor del latido…) en el estado
     del tema, en vez de gráficos de números;
   - **las preguntas**: el botón **Texto | Visual | Preguntas** de cada ficha abre un recorrido en el orden del
     texto, el repaso de lo fallado y un caso clínico que evoluciona (formatos: test pensando antes de ver las
     opciones, «piensa y destapa» y «encuentra el error»). Es lo de la maqueta que aprobaste.

   Después lo construye un constructor potente, el auditor comprueba que preguntas y casos no se inventan la
   medicina (el paciente sí es inventado) y el profesor lo juzga. Con un 3 en algo, vuelve a construirse.

Para mejorar lo que **ya está en la app** sin rehacer el texto: tarea de tipo `estudio` (solo la fase 2), o
`/plan-socialista estudio <clave>`.

## Cómo pedir una tarea: la ficha de encargo

Cada tarea del tablero lleva debajo una **ficha de encargo** de seis líneas. Es lo que evita que el equipo entregue
algo fiel pero que no te sirve:

```
**Encargo `<clave>`** · tipo: visual | estudio | auditoria | arreglo
- Qué quiero: una frase.
- Para qué: estudiar | consultar a pie de cama.
- Modelo «así sí»: qué parte de la app tiene que igualar (receptores animados, atlas 14, nefrona viva…).
- Lo visual que espero: qué se tiene que ver y dónde (p. ej. «el chorro en color en el ecógrafo»).
- Modelo grande que usar: nefrona, ecógrafo, motor… y en qué estado.
- Preguntas que espero: el recorrido y qué casos clínicos.
- Lo que NO quiero.
- Fuente.
```

- **El tipo** decide quién trabaja y cuándo está hecho. En las tareas `visual` y `estudio` el constructor es el
  modelo más potente y el **profesor** puntúa del 1 al 5 si se estudia bien (primera vista, párrafos cortos,
  resaltado, figura que enseña, modelo grande, mandos con frase viva, vista Visual, móvil, y si las preguntas
  obligan a pensar). Con un 3 en algo, vuelve a construirse.
- **Si dejas campos en blanco**, el director los rellena con su criterio y te lo dice en la PR (no se para a
  preguntar). Cuanto más concreta sea la línea «Lo visual que espero», más se parecerá a lo que tienes en la cabeza.
- Ejemplo completo: el encargo de `mr` en el tablero.

## La bitácora: apuntar, aprobar y no olvidar nada

La bitácora (`/bitacora`) y el plan socialista (`/plan-socialista`) van separados pero juntos: la bitácora decide
**qué** se hace; el plan lo **hace**.

- **Apuntar**: «/bitacora apunta: hay que hacer X, Y y Z» (o cuéntaselo sin más). Lo convierte en tareas con número
  (`B-001`…) y su encargo, y te dice cómo lo ha entendido. Puedes ir apuntando durante días.
- **Aprobar**: «/bitacora aprueba B-003». Solo entonces pasa al tablero y el plan puede hacerla.
- **Rumbo**: «/bitacora» o «¿a dónde nos dirigimos?». Te dice lo que está en marcha, lo que espera tu visto bueno,
  lo que espera algo tuyo (un PDF, una decisión), las mejoras pendientes de lo que ya existe, lo que propondría ella
  (aparte y marcado con 💡) y lo hecho esta semana.
- Lo hecho desaparece de la lista a los **7 días**, pero queda guardado en `docs/historial/bitacora.md`.

## Cómo darle órdenes sin escribir código

Todo se controla editando el tablero (`autonomo/TABLERO.md`), que es texto normal:

- **Cambiar el orden**: mueve las líneas de la lista.
- **Saltarse una tarea**: cambia su estado a `aparcada` y escribe por qué.
- **Decir qué quieres**: escribe o corrige su ficha de encargo.
- **Dar contexto**: añade una línea `Nota del usuario:` debajo de la tarea («el PDF de X está en docs/…»,
  «prioriza el Doppler», «esta figura no me gusta así»).
- **Cambiar el límite**: la línea «Límite por sesión» del principio.

También puedes decírselo al director en el chat; él actualiza el tablero.

## Los tres niveles de autonomía

1. **Supervisado (ahora).** Tú lanzas `/plan-socialista` y miras. Así aprendes cómo trabaja y ajustamos las reglas.
2. **En bucle.** `/loop /plan-socialista`: repite tareas hasta llegar al límite del tablero. Úsalo cuando el nivel 1 te
   convenza.
3. **Solo, cada noche.** Una rutina programada abre una sesión en la nube cada noche, ejecuta `/plan-socialista` y te deja la
   propuesta para revisar por la mañana. Se monta cuando los niveles 1 y 2 funcionen bien.

## Qué esperar (y qué no)

- **Va más lento que una conversación normal**, porque cada cosa la hacen y la revisan varios. Un capítulo del atlas
  puede llevar una hora larga de trabajo de agentes.
- **Gasta más**: varios modelos a la vez. Por eso los trabajadores son modelos baratos y hay un límite por sesión.
- **Se va a equivocar.** Para eso están los jueces automáticos, el auditor ciego y tu revisión final. Si ves un
  error que se repite, añade una regla en `REGLAS.md` y no volverá a pasar.
- **Cuando no puede**, no lo inventa: marca la tarea como «necesita humano» y te dice qué le falta (un PDF, una
  decisión tuya…).

## Antes de la primera sesión (lecciones de la prueba)

- **Abre una sesión nueva después de cambiar `CLAUDE.md`.** Una sesión lee las reglas al empezar y sus ayudantes
  heredan esa lectura: en la prueba, un agente lanzado desde una sesión antigua trabajó con el `CLAUDE.md` viejo.
- **La rutina nocturna se crea en pausa.** Primero una sesión supervisada; después una nocturna que revisas a la
  mañana siguiente; y solo entonces se deja activada. Necesita un límite de gasto fijado en el tablero.
- **El aviso por la mañana**: al terminar, la rutina puede mandarte una notificación o un correo con el informe.
