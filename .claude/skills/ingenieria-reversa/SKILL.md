---
name: ingenieria-reversa
description: Ingeniería inversa de una web, simulador o app médica ajena para entender qué hace y cómo está hecha, y proponer qué ideas traer a la app (sin copiar su código, textos ni imágenes). Sale un informe-propuesta para el móvil y el usuario elige. Úsalo cuando el usuario escriba /ingenieria-reversa, «ingeniería inversa», «ingeniería reversa», /reverse-engineer-anything o /leanrea, o pida estudiar cómo está hecha una página para mejorar la app.
---

# Ingeniería inversa

Estudias cómo está hecha una web o app ajena y propones qué traer a la nuestra. **No construyes nada**: el resultado es
un informe y una decisión del usuario. Habla en español llano (el usuario es residente de UCI, no programador).

El método sale de **leanrea** (`aicodeking/leanrea`, MIT: comandos directos, sin servidor) y de **REA**
(`morluto/rea`, MIT), adaptado a lo aprendido el 23/10/2026 con anesthbeta, EchoSuite, AngioView y NavRad
(`autonomo/ideas/ingenieria-inversa/`, partes `2026-10-23-tee-inversa.md` y `2026-10-23-rea.md`).

## 0. Antes de empezar

1. Lee `CLAUDE.md` (sobre todo §2, §5 y §7.9: ideas sí, código no) y busca en `autonomo/TABLERO.md` y
   `autonomo/BITACORA.md` si la web ya está apuntada. Si es nueva, apúntala con `/bitacora`; el usuario que pide el
   informe la está aprobando para la fase 1.
2. Carpeta de trabajo: `/tmp/plan-socialista/rea-<clave>/` (notas y capturas; nada de esto va al repositorio).

## 1. Llegar a la web (de lo barato a lo caro)

- **WebFetch** para las páginas de texto (portada, «about», licencias, `ATTRIBUTION.md`, `llms.txt`, `sitemap.xml`).
  Si da `ENOTFOUND`, no es que la web no exista: prueba el navegador del entorno.
- **Playwright** (instalado globalmente: `import { chromium } from '<npm root -g>/playwright/index.mjs'`; nunca
  `playwright install`), a **390×844**: registra la red (qué scripts, datos, mallas, imágenes y APIs carga), guarda
  capturas y lee el texto. Un solo script por web que haga todo de una vez.
- **REA**, solo si aporta: `npx -y rea-agents@latest analyze-web-bundle` necesita un Chromium con depuración remota
  (CDP). En EchoSuite dio el mapa de módulos; en el resto no hizo falta.
- Si el entorno bloquea el dominio (403 o no resuelve), díselo al usuario con el dominio exacto y lee la página de
  documentación de red del entorno; no inventes lo que no has visto.

## 2. Leer su código sin quedártelo

- Su JS se lee **en memoria** (texto de las respuestas en Playwright, o WebFetch del `.js` con una pregunta concreta).
  **Nunca** guardes sus scripts, mallas o imágenes en disco ni en el repositorio: el sistema de permisos lo bloquea
  y la regla §7.9 lo prohíbe.
- Si hay *source maps*, su `sourcesContent` da el código legible. Si no, busca cadenas y nombres de función y lee
  **trozos** alrededor (nunca un archivo minificado entero).
- Junta varias preguntas en una sola llamada y para cuando cada pregunta tenga su prueba.
- Etiqueta cada afirmación: **visto** (con dónde), **deducido** o **no visto**. Lo no encontrado es «no visto», no
  «no existe».

## 3. Qué averiguar siempre

1. **Qué enseña**: vistas, mandos, casos, preguntas, calculadoras, a quién va dirigido y en qué idiomas.
2. **Cómo está hecho**: tecnología (framework, 3D, WebGL), de dónde salen los datos (mallas, JSON, DICOM, vídeos),
   cómo se genera la imagen, cómo va en el móvil (calidad automática, ritmo, gestos), qué guarda y qué analítica usa.
3. **De dónde salen sus cifras**: guías y páginas que cita, estado de revisión clínica que declara.
4. **Licencias** de cada pieza (código, mallas, imágenes, vídeos, fuentes), copiadas tal cual y marcadas «sin
   verificar en origen» si no pudiste abrir la fuente.
5. **Frente a nosotros**: compáralo con la pieza nuestra que toque (eco: `js/modules/eco/README.md`; calculadoras,
   fichas, Mayéutica `js/core/mayeutica-motor.js`, modelos vivos). Di en qué ganan ellos y en qué ganamos nosotros.

## 4. Varias webs a la vez

Si son dos o más, lanza un investigador por web en paralelo (agente `general-purpose`, como mucho 3 a la vez), con
este archivo como encargo, su carpeta propia y un informe de **≤120 líneas** en
`/tmp/plan-socialista/rea-<clave>/<web>/informe.md`. Tú lees los informes y las capturas clave y escribes la síntesis.

## 5. El informe-propuesta

Una página Artifact para el móvil (las capturas, comprimidas e incrustadas), en este orden:
1. La **tesis** en una frase (qué tienen ellos que no tenemos, y al revés).
2. Cada web: captura, qué es, su truco principal, qué le falta.
3. **Tabla comparativa** con nosotros.
4. **Propuesta**: las mejoras ordenadas de lo barato a lo grande (o en fases si son muchas). Cada una con qué aporta
   para estudiar o a pie de cama, su esfuerzo (pequeño / medio / grande), y qué necesita: PDF de la fuente, una
   decisión de arquitectura del usuario o nada.
5. **Lo que no traería** (su código, textos e imágenes; librerías, cuentas, servidor o analítica que rompen §2).
6. **Lo que necesito de ti**: qué elegir, qué PDF, qué decisiones.
7. Al pie, cómo se hizo y **lo que no se pudo ver**.

Las cifras clínicas que aparezcan en sus webs no son fuente: sirven para saber qué buscar; en la app solo entran con su
PDF en `docs/` (§7.1-7.2).

## 6. Cerrar

- Copia los informes de cada web a `autonomo/ideas/ingenieria-inversa/<web>.md`.
- En el tablero, la tarea pasa a «⏸ parado en la fase 1» con el enlace del informe; en la bitácora, a «Esperando algo
  tuyo» con lo que tiene que elegir. Parte en `autonomo/partes/AAAA-MM-DD-<clave>.md`.
- Commit, push y merge a `main` (son documentos, no tocan la app).
- Al usuario, en llano: el enlace, la propuesta en 3-4 líneas y lo que tiene que decidir.

## Lo que nunca haces

- Copiar o guardar su código, sus textos, sus imágenes, sus vídeos o sus mallas derivadas.
- Usar una malla o imagen «abierta» sin comprobar su licencia en origen y sin la decisión del usuario.
- Construir en la app durante esta skill: eso es la fase 2, con `/plan-socialista` y lo que el usuario elija.
- Saltarse un bloqueo de red o de permisos por otra vía: se le dice al usuario qué falta.
