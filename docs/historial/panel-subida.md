# Historial · Panel de subida de contenido (backend/, admin/)

> Texto movido tal cual desde el antiguo `CLAUDE.md` (octubre 2026). Es la historia de cómo se construyó
> esta parte: decisiones, fuentes, auditorías y verificaciones. Las reglas vigentes están en `CLAUDE.md`.

## Panel de subida de contenido + integración automática (`backend/`, `admin/`)

A petición explícita del usuario ("me gustaría poder desarrollar una
skill en la app para poder subir directamente desde ahí... que la propia
app con Claude lo integre y además pueda revisar si el contenido subido
es correcto... poder mandar un link y se suba automático"), se construyó
un sistema para disparar la integración de contenido nuevo **desde un
panel dentro de la propia web**, sin tener que abrir una sesión de Claude
Code cada vez. Antes de tocar el repo se presentó un plan completo (modo
plan) que el usuario aprobó explícitamente, con 2 decisiones ya
confirmadas por él vía `AskUserQuestion`: el panel vive en la web real
(no un simple comando), y el resultado **nunca se mergea solo** — siempre
queda como una Pull Request en borrador pendiente de su aprobación.

- **Esto rompe deliberadamente "sin backend, sin base de datos"** — la
  única decisión de arquitectura del proyecto marcada como "no reabrir
  sin preguntar" que sí se reabrió aquí, con permiso explícito del
  usuario. El resto de la app (todas las calculadoras, fichas, quiz)
  sigue siendo 100% estática, sin backend ni base de datos — esta es una
  pieza nueva, separada y con su propio coste real (API de Anthropic +
  minutos de GitHub Actions), documentada aparte en `backend/README.md`.
- **Corrección técnica hecha explícita al usuario antes de construir**:
  Cloudflare Workers no tiene sistema de archivos ni puede ejecutar
  Python/`pdfimages`/Playwright — las herramientas que de verdad producen
  la calidad de contenido de este proyecto (extracción real de figuras,
  verificación con navegador). Por eso el Worker **no** llama
  directamente a la API de Claude para generar contenido en un solo paso
  (habría dado peor calidad que el resto de la app) — solo actúa como
  puerta de entrada protegida por contraseña + disparador. El trabajo
  pesado real corre en un **runner de GitHub Actions** (Linux completo y
  gratuito, con git/GitHub nativos), usando el **Claude Agent SDK**
  (`@anthropic-ai/claude-agent-sdk`, Node — el mismo motor que usa Claude
  Code, con acceso real a Bash/ficheros) para replicar, sin supervisión
  humana en tiempo real, el mismo proceso que ya se ha hecho a mano
  decenas de veces en este proyecto.

### Arquitectura

```
/admin (web, protegido por contraseña)
    → Cloudflare Worker (backend/worker/): valida contraseña, sube el PDF
      a una rama nueva vía API de GitHub, dispara workflow_dispatch
    → GitHub Actions (.github/workflows/integrate-content.yml):
      instala poppler-utils/Python/Playwright, corre el Claude Agent SDK
      (backend/agent/run.mjs) con acceso a Bash/ficheros, siguiendo
      backend/agent/system-prompt.md + este mismo CLAUDE.md (que el
      agente lee por su cuenta, igual que cualquier sesión de Claude
      Code) — construye fichas/quiz, extrae imágenes reales, verifica
      con Playwright, audita fidelidad contra la fuente, y abre una
      Pull Request en borrador a main (nunca mergea)
    → El usuario revisa y mergea la PR desde GitHub (web o móvil)
```

- **`backend/agent/system-prompt.md`**: instrucciones específicas del
  pipeline no interactivo (nunca ejecutar `git commit`/`push`/`merge` —
  eso lo hace el propio workflow después —, nunca tocar `backend/`/
  `admin/`, siempre escribir `.github/PR_SUMMARY.generated.md` y
  `.github/PR_TITLE.generated.txt` al terminar con el resumen para la
  PR). Deliberadamente **no** duplica las convenciones de contenido de
  este `CLAUDE.md` — le indica al agente que lo lea directamente con su
  propia herramienta `Read`, como hace cualquier sesión de Claude Code,
  para no tener dos copias de las convenciones que puedan desincronizarse.
- **`backend/agent/run.mjs`**: script driver que invoca `query()` del
  Agent SDK con `cwd` = raíz del repo, `permissionMode: 'bypassPermissions'`
  (necesario por correr sin supervisión humana), `allowedTools` acotado a
  `Bash`/`Read`/`Write`/`Edit`/`Glob`/`Grep`, y topes de coste/turnos
  (`maxTurns`/`maxBudgetUsd`, configurables vía variables de repo de
  GitHub Actions sin tocar código). Si el agente no escribe su fichero de
  resumen (por error o por no seguir la instrucción), el script genera
  uno de emergencia con su último texto visible, para que el fallo quede
  documentado en la propia PR/logs en vez de fallar en silencio. **Nota
  explícita dejada en el propio fichero**: se escribió siguiendo la
  documentación pública del Agent SDK sin haber podido ejecutarlo de
  verdad todavía (necesita `ANTHROPIC_API_KEY` real + un runner de
  GitHub Actions) — la primera prueba manual (ver `backend/README.md`,
  paso 4) es la que valida/corrige la forma exacta de las opciones.
- **`backend/worker/src/index.ts`**: el Worker en sí. Sin base de datos
  propia — GitHub (rama nueva + *run* de Actions + PR) es el único
  estado. Compara la contraseña en tiempo aproximadamente constante,
  crea la rama vía la API Git Data de GitHub (`git/refs`) antes de subir
  el PDF (la API de Contenidos no crea ramas nuevas por sí sola), y usa
  un token de GitHub de grano fino con permisos acotados solo a este
  repo (Contents/Pull requests/Actions, todos en escritura).
- **`admin/index.html` + `admin/admin.js`**: página nueva, deliberadamente
  **no enlazada** desde la navegación principal de la app (solo accesible
  por URL directa) — reutiliza `css/variables.css` para el mismo look
  oscuro del resto de la app, pero vive fuera del flujo de
  `index.html`/`main.js` para no acoplarla a la arquitectura estática del
  resto del sitio. Formulario simple: contraseña, pestañas PDF/Link,
  notas libres de contexto (mismo espíritu que hoy el usuario le da
  contexto a Claude al mandar un PDF a mano). Tras enviar, muestra el
  enlace a la pestaña de GitHub Actions para seguir el progreso desde el
  móvil.
- **Pendiente, requiere acción del propio usuario (no ejecutable desde
  una sesión de Claude Code)**: crear la cuenta de Cloudflare y hacer
  `wrangler deploy`, generar el token de GitHub de grano fino, añadir
  `ANTHROPIC_API_KEY` como secreto del repo, y sustituir la URL real del
  Worker desplegado en `admin/admin.js` (constante `WORKER_URL`) — todo
  documentado paso a paso en `backend/README.md`. El **orden de
  verificación acordado** es: primero validar el pipeline de Actions +
  Agent SDK disparándolo a mano (`workflow_dispatch` desde la UI de
  GitHub con un PDF corto ya subido) hasta que dé resultados de calidad
  aceptable, y solo entonces confiar en el panel `/admin` público — nunca
  al revés.
- **Primera prueba real, ya ejecutada**: se disparó el workflow a mano
  (`mcp__github__actions_run_trigger`, sin depender de `wrangler`/la
  cuenta de Cloudflare, que en esta sesión remota está bloqueada por la
  política de red del sandbox — `api.cloudflare.com` devuelve 403 en el
  túnel CONNECT del proxy) contra un PDF sintético de 2 páginas sin
  contenido clínico real (`docs/incoming/prueba-pipeline.pdf`, rama
  `content/test-pipeline`, `run_id` 35265950079). Resultado: **toda la
  parte mecánica funciona** — checkout, preparar la rama, instalar
  `poppler-utils`/Python/Pillow, Node, las dependencias del agente
  (`@anthropic-ai/claude-agent-sdk` con `"latest"` resuelve e instala
  bien) y Playwright con Chromium, todo en menos de un minuto — y el
  único fallo fue el esperado: `Falta ANTHROPIC_API_KEY`, porque ese
  secreto todavía no se había añadido al repo. Queda pendiente repetir
  esta misma prueba en cuanto el usuario añada el secreto, para validar
  por fin la llamada real al Agent SDK (`query()` en
  `backend/agent/run.mjs`), la única pieza que nunca se ha llegado a
  ejecutar de verdad.
- **Destino sugerido + archivado en bibliografía + auditoría de huecos +
  propuestas de mejora**, a petición explícita del usuario ("quiero
  añadir una función de que yo suba un documento que diga que vaya a
  tal... y guardes en la bibliografía el documento y después hagas una
  revisión... para valorar que está incluido todo... y qué mejoras
  puedes poner o partes interactivas"). 4 ampliaciones, ninguna requiere
  tocar el Worker ni el workflow:
  - **`admin/index.html`/`admin/admin.js`**: nuevo `<select id="destino">`
    (opcional, con las 6 especialidades + "especialidad nueva" +
    "No estoy seguro — que lo decida Claude") justo encima del campo de
    notas ya existente. `admin.js` antepone el valor elegido a las notas
    como una línea `Destino sugerido por el usuario: <especialidad>`
    antes de enviarlas — deliberadamente **no** se añadió como campo
    nuevo del formulario multipart ni como input nuevo del workflow, para
    no tener que redesplegar el Worker ni tocar
    `.github/workflows/integrate-content.yml`: desde el punto de vista
    del Worker/workflow sigue siendo el mismo campo `notes` de siempre.
  - **`backend/agent/system-prompt.md`**: el agente lee ese "destino
    sugerido" como una simple ayuda, nunca como una decisión firme — si
    el contenido real encaja mejor en otro sitio, prioriza el contenido y
    lo explica en el resumen (mismo criterio ya aplicado en el resto del
    proyecto: el contenido manda, nunca una etiqueta).
  - **Archivado real en la bibliografía** (paso 3 nuevo de "Tu tarea"):
    antes, el PDF se quedaba para siempre en `docs/incoming/` sin que
    nada lo moviera ni lo citara — ahora el agente debe moverlo a
    `docs/<autor>-<año>-<tema-corto>.pdf` (mismo patrón que ya usan las
    decenas de PDF existentes en `docs/`), borrar el original de
    `docs/incoming/`, y añadir/ajustar una tarjeta "📚 Bibliografía" con
    `.biblio-link`/`.biblio-nota` enlazando a `docs/<archivo>.pdf#page=N`
    en el módulo donde aterrizó el contenido — un link, nunca una fuente
    externa que pueda dejar de estar viva, mismo criterio que ya rige
    toda la bibliografía de la app.
  - **Auditoría en dos direcciones, no solo fabricación** (paso 5
    ampliado): antes solo se pedía comprobar que no se hubiera fabricado
    contenido; ahora se pide releer la fuente completa buscando también
    lo contrario — huecos reales (tablas/cifras/figuras que la fuente
    tiene y la app no llegó a recoger) — y declararlos con su ubicación
    exacta en una sección nueva del resumen (`## Huecos de contenido
    detectados`) en vez de callarlos, mismo criterio que las decenas de
    auditorías de contenido ya documentadas en este archivo para
    Nefrología/HTA/ERC/FRA/Cardiología/Fisiopatología UCI.
  - **Propuestas de mejora e interactividad, sin implementarlas** (paso 6
    nuevo): tras verificar el contenido base, el agente debe revisarlo
    con la misma mirada que los informes de
    "fallos/huecos/interactividad/mejoras" ya hechos a mano en el resto
    del proyecto, y anotar candidatos concretos (calculadora/selector/
    simulador/enlace cruzado) en una sección nueva del resumen (`##
    Propuestas de mejora e interactividad (no implementadas)`) —
    **deliberadamente sin construirlas en la misma PR**: sin un humano
    revisando en tiempo real es más seguro dejar la base ya verificada y
    proponer el resto para una ronda futura explícita, mismo patrón de
    "primero informe, después 'aplica todo' si se pide" ya usado en
    todas las rondas de auditoría manuales de este proyecto.
  - `backend/README.md` actualizado para reflejar las 4 ampliaciones y
    el estado real de la primera prueba (arriba).

