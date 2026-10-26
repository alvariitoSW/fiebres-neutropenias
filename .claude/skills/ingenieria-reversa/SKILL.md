---
name: ingenieria-reversa
description: Ingeniería inversa de una web, simulador o app médica ajena para entender qué hace y cómo está hecha, y proponer qué ideas traer a la app (sin copiar su código, textos ni imágenes). Sale un informe-propuesta para el móvil y el usuario elige. Úsalo cuando el usuario escriba /ingenieria-reversa, «ingeniería inversa», «ingeniería reversa», /reverse-engineer-anything o /leanrea, o pida estudiar cómo está hecha una página para mejorar la app.
---

# Ingeniería inversa

Estudias cómo está hecha una web o app ajena y propones qué traer a la nuestra. **No construyes nada**: el resultado es
un informe y una decisión del usuario. Habla en español llano (el usuario es residente de UCI, no programador).

El método sale de **leanrea** (`aicodeking/leanrea`, MIT: comandos directos, sin servidor; guía completa releída el
25/10/2026) y de **REA** (`morluto/rea`, MIT), adaptado a lo aprendido con anesthbeta, EchoSuite, AngioView, NavRad,
Radiology Assistant y RitmoLab (`autonomo/ideas/ingenieria-inversa/`, partes del 23/10, `docs/historial/radar.md`).

## 0. Antes de empezar

1. Lee `CLAUDE.md` (sobre todo §2, §5 y §7.9: ideas sí, código no) y busca en `autonomo/TABLERO.md` y
   `autonomo/BITACORA.md` si la web ya está apuntada. Si es nueva, apúntala con `/bitacora`; el usuario que pide el
   informe la está aprobando para la fase 1.
2. **Reutiliza lo ya investigado.** Si la web ya tiene informe en `autonomo/ideas/ingenieria-inversa/<web>.md`,
   léelo primero y estudia solo lo que falte o lo que se pide ahora (así se hizo la 2.ª pasada de NavRad).
3. **Si es una web a la que volvemos** (vigía tecnológico del Radar): compara antes las **piezas** con las del informe
   anterior (lista de scripts y datos, su versión o su `?v=`, su peso). Estudia solo lo que cambió.
4. Carpeta de trabajo: `/tmp/plan-socialista/rea-<clave>/` (notas y capturas; nada de esto va al repositorio).

## 1. Presupuesto (regla de oro de leanrea: «cada paso cuesta más que lo que lees»)

- **2-4 llamadas por pregunta**: una exploración que lo junta todo en un solo script, uno o dos trozos concretos y la
  respuesta. Para cuando cada pregunta tenga su prueba. **No vuelvas a comprobar lo que ya viste.**
- **Imágenes, las justas**: son lo que más gasta. Como mucho **2 capturas por web** para el informe (más solo si una
  pantalla es la prueba de algo); comprimidas antes de leerlas o incrustarlas (JPEG, ≤440 px de ancho).
- **Investigadores con el modelo barato** (`model: "sonnet"` al lanzarlos). El potente, solo para la síntesis si
  hace falta.
- Informe de cada web: **≤120 líneas**.

## 2. Llegar a la web (de lo barato a lo caro)

- **WebFetch** para las páginas de texto (portada, «about», licencias, `ATTRIBUTION.md`, `llms.txt`, `sitemap.xml`).
  Si da `ENOTFOUND`, no es que la web no exista: prueba el navegador del entorno.
- **Playwright** (instalado globalmente: `import { chromium } from '<npm root -g>/playwright/index.mjs'`; nunca
  `playwright install`), a **390×844**, **un solo script por web** que haga todo de una vez:
  - **mapa de la red sin contenido**: de cada respuesta, solo `estado · tipo · URL · tamaño` (y de las que fallan,
    `requestfailed` con su error). Es el inventario de la web sin guardar ni una línea suya;
  - el texto visible, las capturas justas y, si hace falta, los pasos para llegar a una pantalla.
- **Las imágenes y los datos pueden venir de otro subdominio** (NavRad: `dicom.navigatingradiology.com`). Si la página
  carga pero sale en negro o vacía, mira en el mapa qué dominio falla antes de pensar que es la web.
- **REA**, solo si aporta: `npx -y rea-agents@latest analyze-web-bundle` necesita un Chromium con depuración remota
  (CDP). En EchoSuite dio el mapa de módulos; en el resto no hizo falta.
- Si el entorno bloquea el dominio (403, `ERR_TUNNEL_CONNECTION_FAILED` o no resuelve), díselo al usuario con el
  dominio exacto y lee la página de documentación de red del entorno; no inventes lo que no has visto.
- **Si el usuario te pasa una app de Android (`.apk`)**: la ruta de leanrea (`jadx -d X --show-bad-code a.apk` y
  buscar con `rg`; solo recursos: `apktool d --no-src`). Instalar esas herramientas, solo con su permiso.

## 3. Leer su código sin quedártelo

Su JS se lee **en memoria** (el texto de las respuestas en Playwright, o WebFetch del `.js` con una pregunta concreta).
**Nunca** guardes sus scripts, mallas, datos o imágenes en disco ni en el repositorio: el sistema de permisos lo bloquea
y la regla §7.9 lo prohíbe. En este orden:

1. **Mapas de código fuente primero.** Busca `sourceMappingURL` al final de cada `.js`. Si el `.map` responde y trae
   `sourcesContent`, ese es el código original legible: lee de ahí (nombres de archivo con `sources`), en memoria.
2. **Si no hay mapa, a trozos.** Nunca un archivo minificado entero: busca una palabra clave y lee solo ~200
   caracteres alrededor. En el mismo script de Playwright:
   ```js
   const trozos = (txt, palabra, n = 200) => [...txt.matchAll(new RegExp(`.{0,${n}}${palabra}.{0,${n}}`, 'g'))]
     .slice(0, 20).map(m => m[0]);
   ```
   Palabras útiles: los textos que se ven en pantalla, los nombres de los mandos, las unidades («mmHg», «cm/s»), los
   nombres de los datos que carga (`anatomy.json`, `coronary-left.json`).
3. Si un trozo es ilegible, embellécelo **en memoria** (pásalo por `npx -y prettier --parser babel` desde la entrada
   estándar), nunca a un archivo.
4. **Junta varias preguntas en una sola llamada** y para cuando cada pregunta tenga su prueba.
5. Etiqueta cada afirmación: **visto** (con dónde: archivo, trozo o pantalla), **deducido** o **no visto**. Lo no
   encontrado es «no visto», no «no existe». Leer su código no es verlo funcionar: lo que dependa de la ejecución se
   comprueba en la pantalla.

## 4. Qué averiguar siempre

1. **Qué enseña**: vistas, mandos, casos, preguntas, calculadoras, a quién va dirigido y en qué idiomas.
2. **Cómo está hecho**: tecnología (framework, 3D, WebGL), de dónde salen los datos (mallas, JSON, DICOM, vídeos),
   cómo se genera la imagen, cómo va en el móvil (calidad automática, ritmo, gestos), qué guarda y qué analítica usa.
3. **De dónde salen sus cifras**: guías y páginas que cita, estado de revisión clínica que declara.
4. **Licencias** de cada pieza (código, mallas, imágenes, vídeos, fuentes), copiadas tal cual y marcadas «sin
   verificar en origen» si no pudiste abrir la fuente.
5. **Frente a nosotros**: compáralo con la pieza nuestra que toque (eco: `js/modules/eco/README.md`; calculadoras,
   fichas, Mayéutica `js/core/mayeutica-motor.js`, modelos vivos). Di en qué ganan ellos y en qué ganamos nosotros.
6. **Pares de prueba** (para rehacer la idea después): de cada cálculo o comportamiento que propongas traer, apunta
   2-5 casos **observados en su pantalla**: entrada → salida (p. ej. «RAO 30 CAU 30 → la DA proximal se acorta un
   X %»; «adenosina en FA preexcitada → FV»). No son fuente clínica: sirven para que nuestra versión, hecha con
   nuestro código y nuestras fuentes, se pruebe con las mismas entradas y se compare (leanrea: «reimplementa lo
   mínimo y pruébalo contra el original»).

## 5. Varias webs a la vez

Si son dos o más, lanza un investigador por web en paralelo (agente `general-purpose` con `model: "sonnet"`, como
mucho 3 a la vez), con este archivo como encargo, su carpeta propia y un informe de **≤120 líneas** en
`/tmp/plan-socialista/rea-<clave>/<web>/informe.md`. Tú lees los informes y las 1-2 capturas clave de cada uno y
escribes la síntesis.

## 6. El informe-propuesta

Una página Artifact para el móvil (las capturas, comprimidas e incrustadas), en este orden:
1. La **tesis** en una frase (qué tienen ellos que no tenemos, y al revés).
2. Cada web: captura, qué es, su truco principal, qué le falta.
3. **Tabla comparativa** con nosotros.
4. **Propuesta**: las mejoras ordenadas de lo barato a lo grande (o en fases si son muchas). Cada una con qué aporta
   para estudiar o a pie de cama, su esfuerzo (pequeño / medio / grande), qué necesita (PDF de la fuente, una
   decisión de arquitectura del usuario o nada) y, si la hay, su **situación de guardia** (norte del Radar).
5. **Lo que no traería** (su código, textos e imágenes; librerías, cuentas, servidor o analítica que rompen §2).
6. **Lo que necesito de ti**: qué elegir, qué PDF, qué decisiones.
7. Al pie, cómo se hizo y **lo que no se pudo ver**.

Las cifras clínicas que aparezcan en sus webs no son fuente: sirven para saber qué buscar; en la app solo entran con su
PDF en `docs/` (§7.1-7.2).

## 7. Cerrar

- Copia los informes de cada web a `autonomo/ideas/ingenieria-inversa/<web>.md` (con sus pares de prueba y la lista
  de piezas, para la próxima visita).
- En el tablero, la tarea pasa a «⏸ parado en la fase 1» con el enlace del informe; en la bitácora, a «Esperando algo
  tuyo» con lo que tiene que elegir. Parte en `autonomo/partes/AAAA-MM-DD-<clave>.md`.
- Commit, push y merge a `main` (son documentos, no tocan la app).
- Al usuario, en llano: el enlace, la propuesta en 3-4 líneas y lo que tiene que decidir.

## Lo que nunca haces

- Copiar o guardar su código, sus textos, sus imágenes, sus vídeos, sus datos o sus mallas derivadas.
- Usar una malla o imagen «abierta» sin comprobar su licencia en origen y sin la decisión del usuario.
- Construir en la app durante esta skill: eso es la fase 2, con `/plan-socialista` y lo que el usuario elija.
- Saltarse un bloqueo de red o de permisos por otra vía: se le dice al usuario qué falta.
