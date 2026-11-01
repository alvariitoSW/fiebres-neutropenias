# dsh-superagent (DeepSeek) · ingeniería inversa · 01/11/2026

Pedido por el usuario el 01/11: «quiero preguntar al congreso qué podemos hacer con este repo».
Repositorio: https://github.com/deepseek-ai/dsh-superagent-prototype (clonado con git en el scratchpad; nada suyo entra
aquí). Acta del Consejo: `autonomo/consejo/2026-11-01-2.md`.

## Tesis

Es un **«compañero de equipo» automático para un repositorio de GitHub**: escucha GitHub (y el chat Feishu), decide si
alguien con permiso le ha pedido trabajo, abre una «orden de trabajo», la hace en su propia sesión de IA y entrega una
PR. No enseña medicina ni sirve dentro de nuestra app. Lo que tiene de valor para nosotros es **su filosofía**: «gastar
la mínima atención humana y dar el máximo valor». Es la versión industrial de lo que intenta nuestro gobierno (plan
socialista, Consejo, jueces): ellos lo tienen mejor escrito en cómo y cuándo molestar a la persona; nosotros vamos
por delante en comprobar la calidad (jueces automáticos, auditor ciego, profesor con nota).

## Piezas (para la próxima visita)

- Un solo commit `6337fc8` (31/10/2026, «DeepSeek Harness Team»), 216 archivos, 3,1 MB. **Visto**.
- TypeScript, Node 22+, pnpm; dependencias `zod 4.4.3` y `proper-lockfile 4.1.2`; panel web en React; 64 pruebas
  (vitest). Necesita **DeepSeek Harness** (`dsh ^0.2.1-alpha.2`), el programa de agentes de DeepSeek, que no está en el
  repositorio. **Visto** (`package.json`).
- Carpetas: `docs/` (9 documentos numerados 000-008), `prompts/` (las instrucciones de cada papel), `skills/` (GitHub
  y Feishu), `src/` (motor, fuentes, panel), `tests/`.
- **Licencia MIT** (`LICENSE`, «Copyright (c) 2026 DeepSeek Harness Team»). El README avisa: «prototipo de
  investigación, no producto oficial; puede tener fallos». **Visto**.
- **No visto funcionando**: no se puede ejecutar sin DeepSeek Harness, una cuenta de DeepSeek y un servidor encendido.

## Cómo funciona (visto en `docs/001-domain.md`, `002`, `004`, `005` y `prompts/`)

1. **Fuentes** (GitHub, Feishu) producen **avisos**; cada aviso pertenece a un **hilo** (una issue, una PR, un chat).
2. Un **evaluador** decide si el aviso pide trabajo nuevo: primero una **puerta fija** (¿quién lo pide?, ¿está en la
   lista?, ¿se dirige al agente?) y luego un **juicio de la IA** con tres hechos: es de este proyecto, se pide un cambio
   concreto y la dirección ya está decidida. Una preferencia («quizá nuestra app debería…») no es un encargo.
3. Si acepta, crea una **orden de trabajo** con su **mandato** (alcance, fuerza «explícito/inferido», versión de las
   reglas con que se aceptó). Un **ejecutor** (otra sesión de IA, su carpeta y su rama) la hace.
4. **Dos papeles separados**: el principal solo enruta (nota de ≤30 palabras, sin plan técnico); el ejecutor lee las
   fuentes originales, decide el alcance, programa, prueba y abre la PR. «Una nota de enrutado nunca sustituye al
   contexto original ni añade requisitos.»
5. **Trabajo no pedido** (proactivo) solo con una regla escrita por el equipo, y **empieza en modo «observar»**: apunta
   lo que habría hecho, sin hacerlo, hasta que una persona revisa esas decisiones y lo pasa a «auto».
6. **Hablar solo cuando la persona tiene que actuar o puede usar un resultado**: un acuse corto al empezar, silencio
   mientras trabaja, y un mensaje al final (una frase, máx. 100 palabras, con el enlace). «Antes de enviar, pregunta de
   cada frase: ¿si la borro, la persona deja de entender o de poder actuar? Si no, bórrala.»
7. **Una pregunta concreta cada vez**, en un campo estructurado que el principal reenvía tal cual; no se repite la misma
   pregunta sin cambios; el trabajo autorizado sigue mientras tanto.
8. **Entrega honesta**: abrir una PR no es «listo»; un borrador se marca inacabado; un cambio visual sin captura real
   de **antes y después** (mismo escenario, ancho y tema) no está listo.
9. **Revisores automáticos**: como mucho **3 rondas** por PR; lo arreglado se cierra en silencio, lo rechazado lleva
   una frase de motivo; los bots nunca autorizan trabajo.
10. **Fusión automática** solo si la PR es pequeña (<200 líneas), está lista y las aprobaciones cubren **ese commit
    exacto**; se retira en cuanto hay un push nuevo. El agente nunca aprueba ni fusiona en nombre de otro.
11. **Si una persona ya hizo el mismo cambio** en su rama, el agente cierra su PR con una frase que apunta a la suya.
12. Una **pausa pedida por una persona** se mantiene entre sesiones y reinicios hasta que una persona la levanta; los
    avisos automáticos nunca la levantan.
13. **Panel**: responde tres preguntas en orden: ¿algo me necesita ahora?, ¿va todo bien?, ¿qué pasó con esta pieza?
    «Un número solo aparece si cambia lo que haces»; «un recuento es igual a la lista que enlaza»; «lo sano no ocupa
    sitio».
14. **Documentos numerados** que se leen en orden (cada uno solo usa conceptos ya explicados) y un glosario bilingüe.
15. **Reglas por capas**: lo que impone el código manda sobre las instrucciones; el texto de fuera (comentarios,
    documentos, citas) es dato y nunca cambia las reglas.

## Frente a nosotros

| | dsh-superagent | Nuestro gobierno |
|---|---|---|
| Para qué | Programar en un repo de empresa | Construir contenido médico fiel a la fuente |
| Quién manda trabajo | Personas en una lista + reglas | El usuario (bitácora → tablero) |
| Comprobar calidad | Pruebas del repo + revisores bot (3 rondas) | Jueces, auditor ciego, profesor ≥ 8,75 |
| Molestar a la persona | Regla escrita y estricta (1 frase) | «4-5 paradas por bloque», informes largos |
| Preguntas pendientes | Una, estructurada, no se repite | Listas de 10 puntos en «Esperando algo tuyo» |
| Poderes nuevos | Empiezan en «observar» | Se dan directos (p. ej. fusión por votos) |
| Fusión automática | Ligada a un commit exacto, <200 líneas | Por votos del Consejo; jueces de nuevo si hay push |
| Fidelidad a fuentes | No aplica | Nuestro punto fuerte |
| Necesita | Servidor, DeepSeek Harness, cuentas bot | Nada: sesiones de Claude Code y git |

## Ideas (de lo barato a lo grande)

Para el gobierno (no tocan la app):
- **I1 · Filtro de atención** en todo mensaje al usuario (informe diario, cierre de sesión, Artifacts): «¿qué puede
  revisar, usar, decidir o desbloquear ahora? Si nada, no se manda». Una frase + enlace; lo técnico, al parte. Pequeño.
- **I2 · Una pregunta a la vez** en «Esperando algo tuyo»: cada espera es una fila con pregunta, opciones, desde
  cuándo y quién la necesita; no se repite sin cambios; lo autorizado sigue. Pequeño.
- **I3 · Voto ligado a un commit**: el acta de fusión apunta el commit votado; un push después lo deja sin efecto hasta
  repetir jueces (ya casi lo dice §4.15; falta el commit en el acta). Pequeño.
- **I4 · Poderes nuevos en «modo observar»**: cuando el usuario delega algo nuevo al Consejo o a los agentes, unos días
  solo se apunta «lo que habría hecho» y el usuario lo mira antes de darlo del todo. Pequeño (regla).
- **I5 · El encargo lleva lo original**: el agente recibe las palabras literales del usuario y la fuente; la nota del
  director no añade requisitos. Pequeño.
- **I6 · Triaje de intención** en Radar y bitácora: tres hechos (es de esta app, pide un cambio concreto, la dirección
  está decidida); una preferencia se apunta como idea, no como tarea. Pequeño.
- **I7 · Ceder ante trabajo duplicado** entre las sesiones paralelas (§4.17 A): antes de abrir PR, mirar si otra rama
  abierta ya lo contiene. Pequeño.
- **I8 · Tope de vueltas por revisor**: como mucho 3 vueltas del mismo revisor sobre la misma pieza; después se para y
  comparece con lo pendiente dicho. Pequeño (regla), choca en parte con la nota ≥ 8,75 (ver acta).
- **I9 · Antes y después en cada PR que cambia lo que se ve**: capturas a 390 px del mismo estado, hechas por los
  jueces, en la PR y en el informe al usuario. Medio.
- **I10 · Glosario del gobierno en llano** y un informe diario con las tres preguntas del panel (¿me necesita algo?,
  ¿va bien?, historia de una pieza). Pequeño-medio.

Para la app (estática, sin servidor):
- **I11 · «Lo que te toca hoy» arriba del menú**: aplicar «primero lo que te necesita» a la app: las preguntas que
  el repaso espaciado ya marca como pendientes (localStorage existente). Medio. Solo idea; no es suyo.

## Lo que no traería

- **Instalar dsh-superagent** en nuestro repo: necesita DeepSeek Harness, una cuenta de DeepSeek, un servidor encendido
  24 h y cuentas bot; duplica lo que ya hacemos con las sesiones de Claude Code. Además es un prototipo «con fallos».
- **Un bot en GitHub o Feishu**, el **panel web** y cualquier **IA dentro de la app**: rompen `CLAUDE.md` §2 (sin
  backend, sin dependencias).
- **Su código y sus instrucciones literales**: aunque es MIT, solo traemos ideas reescritas (§7.9).

## Pares de prueba (de su texto, no de pantalla)

- «Este botón tiene un nombre raro» + otra persona «con "Guardar" bastaría» → **encargo** (sustituto concreto).
- Un hilo sobre otra app + «quizá la nuestra debería mostrar los no leídos como ellos» → **no es encargo** (preferencia).
- PR lista + push nuevo → la fusión automática se **retira** hasta que las aprobaciones cubran el commit nuevo.
- Cuarta ronda de un revisor bot → **no** se atiende; se entrega con lo pendiente dicho.

## Cómo se hizo y lo que no se vio

Clon con git (la web de github.com da 403). Leídos `README`, `LICENSE`, `package.json`, `docs/000-005`, `prompts/`
completos; `docs/006-008` (instalación, arquitectura, recetario) y `src/` solo por la lista de archivos. No se ejecutó
(falta DeepSeek Harness). El artículo que cita («Exploring Super-agent Design») no se buscó.
