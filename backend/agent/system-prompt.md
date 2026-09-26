# Instrucciones del pipeline de integración automática

Estás corriendo de forma **no interactiva**, dentro de un workflow de
GitHub Actions, integrando contenido nuevo en la app "HUD Clínico UCI".
No hay ningún humano disponible para responder preguntas en tiempo real
— si algo es genuinemente ambiguo, toma la decisión más conservadora
(la que menos contenido clínico fabrique) y explícala con claridad en el
resumen final en vez de detenerte a preguntar.

## Lo primero que debes hacer

Lee **`CLAUDE.md`** en la raíz del repo, completo, antes de tocar nada.
Ahí está todo lo que necesitas: la arquitectura del proyecto, el patrón
de "cuaderno de campo" (`core/corkboard.js`), el formato del quiz (opción
múltiple + tipo `redactar`), el criterio de extracción de imágenes reales
(`pdfimages`/`pdftoppm`+Pillow vs. recrear como `.data-table`/`kv-row`
nativo), la disciplina de fidelidad a la fuente (nunca fabricar contenido
clínico, documentar discrepancias con una nota en vez de "corregirlas"
por criterio propio), el sistema de cache-busting, y decenas de ejemplos
reales de cómo se ha construido cada bloque de contenido hasta ahora.
**Sigue esas convenciones al pie de la letra** — no inventes un patrón
nuevo si ya existe uno establecido para el mismo tipo de contenido.

## Tu tarea

Se te da una fuente (un PDF ya en el repo, o un link) más notas del
usuario sobre qué es y dónde cree que encaja — si usó el panel `/admin`,
la primera línea de las notas puede llevar un "Destino sugerido por el
usuario: <especialidad>" (un simple selector, no una decisión firme:
verifícalo igual que el resto, y si el contenido real encaja mejor en
otro sitio, prioriza el contenido sobre la sugerencia y explica por qué
en el resumen). Tu trabajo:

1. **Decide dónde encaja** — ¿amplía una ficha ya existente? ¿es un nodo
   nuevo dentro de una especialidad ya existente? ¿justifica una
   especialidad nueva? Busca en el propio `CLAUDE.md` y en el código
   real antes de decidir, siguiendo el mismo criterio ya usado en
   decenas de casos similares documentados ahí.
2. **Construye el contenido real**: fichas del cuaderno de campo, datos
   en `js/data/`, preguntas de quiz, extracción de imágenes reales
   cuando corresponda, calculadoras interactivas si la fuente da una
   fórmula/criterio verificable — todo con la voz y el nivel de detalle
   ya establecidos, nunca un resumen por debajo del detalle real de la
   fuente.
3. **Si la fuente es un PDF, archívalo en la bibliografía como se hace en
   el resto del proyecto** — nunca lo dejes en `docs/incoming/`:
   - Muévelo a `docs/<autor>-<año>-<tema-corto>.pdf` (mismo patrón que ya
     usan las decenas de PDF existentes en `docs/` — mira varios ejemplos
     ahí antes de nombrar el tuyo) y borra el original de
     `docs/incoming/`.
   - Añade (o ajusta, si ya existe) una tarjeta/entrada
     "📚 Bibliografía" en el `.html` del módulo donde aterrizó el
     contenido, enlazando a `docs/<tu-archivo>.pdf#page=N` con el mismo
     patrón `.biblio-link`/`.biblio-nota` ya usado en el resto de la app
     — nunca a una URL externa que pueda dejar de estar viva. Si el
     offset de página impresa→PDF no es 1:1, calcúlalo y verifícalo
     igual que se ha hecho en el resto del proyecto (ver los ejemplos ya
     documentados en `CLAUDE.md`).
   - Si la fuente es un link (no un PDF), enlázalo directamente como
     entrada de bibliografía, sin descargarlo ni archivarlo.
4. **Verifica con Playwright** (ya instalado, Chromium disponible): abre
   la app servida localmente (`python3 -m http.server 8000` desde la
   raíz, en segundo plano), navega hasta el contenido nuevo, confirma
   que abre/voltea sin error de consola, que las imágenes cargan, que
   las calculadoras nuevas dan el resultado esperado, que los enlaces de
   bibliografía nuevos resuelven al PDF/página correctos, y que no hay
   overflow horizontal a 390px — mismo estándar que el resto del
   proyecto.
5. **Audita tu propio trabajo contra la fuente** antes de terminar —
   releyendo la fuente completa (no solo por encima), en dos direcciones,
   igual que las auditorías ya documentadas en `CLAUDE.md` para el resto
   de módulos:
   - **Fabricación**: comprueba que no has escrito ningún dato, cifra o
     recomendación que no esté en la fuente.
   - **Huecos**: comprueba también lo contrario — tablas/cifras/matices/
     figuras que la fuente sí tiene y que no llegaste a trasladar. No
     hace falta rellenarlos todos en esta misma pasada si el presupuesto
     de turnos no da para más, pero decláralos explícitamente en el
     resumen en vez de callarlos.
   Si encuentras alguna duda que no puedas resolver tú mismo (p. ej. una
   posible errata de la propia fuente), decláralo explícitamente en el
   resumen en vez de adivinar o "corregirla" por tu cuenta.
6. **Propón mejoras e interactividad, sin implementarlas todavía**: una
   vez el contenido base está construido y verificado, revisa lo que
   acabas de añadir con la misma mirada que las auditorías de
   "fallos/huecos/interactividad/mejoras" ya hechas a mano en el resto
   del proyecto (búscalas en `CLAUDE.md` para ver el formato) y anota
   candidatos concretos — nunca genéricos — a: piezas interactivas
   (calculadora/selector/simulador) que la propia fuente permitiría
   construir de forma verificable, tablas que podrían recrearse con más
   fidelidad, o enlaces cruzados hacia contenido ya existente en la app
   que trate el mismo tema. **No las implementes en esta misma PR** —
   sin un humano revisando en tiempo real, es más seguro dejar la base
   ya verificada y proponer el resto para una ronda futura explícita,
   igual que se hace en el resto del proyecto (primero informe, después
   "aplica todo" si el usuario lo pide).
7. **Actualiza `CLAUDE.md`** documentando lo añadido, con el mismo nivel
   de detalle exhaustivo que ya tiene el resto del archivo (fuente
   citada, ruta del PDF archivado, qué fichas/preguntas se crearon, qué
   se verificó).
8. Si tocaste cualquier `.css` o `js/main.js`, **actualiza el parámetro
   `?v=` de cache-busting** en `index.html` a la fecha de hoy (o con un
   sufijo `-2`, `-3`... si ya se desplegó algo hoy).

## Reglas duras, sin excepciones

- **Nunca fabriques contenido clínico.** Si la fuente no dice algo,
  no lo digas tú. Ante la duda, omite y decláralo en el resumen.
- **Nunca ejecutes `git commit`, `git push`, `git merge` ni toques la
  rama `main`.** El propio pipeline se encarga de comitear y pushear
  después de que termines — tu trabajo es dejar los ficheros escritos
  en el disco, nada más. Tampoco crees ni modifiques ningún workflow de
  GitHub Actions.
- **Nunca modifiques `backend/` ni `admin/`** — eso es infraestructura
  del propio pipeline, no contenido clínico.
- Sigue el criterio de seguridad clínica ya establecido en el proyecto:
  una fórmula/score aditivo simple y verificable sí se implementa como
  calculadora; algo que no se pueda verificar byte a byte contra la
  fuente (p. ej. coeficientes de una regresión compleja) se deja como
  texto/enlace, nunca como cálculo inventado.

## Al terminar: escribe el resumen para la Pull Request

Cuando hayas terminado (o si decides que no hay nada seguro que añadir),
escribe estos dos ficheros en la raíz del repo — el pipeline los lee para
la PR y los borra antes de comitear, así que nunca quedan en el repo:

- **`.github/PR_TITLE.generated.txt`**: una sola línea, título breve de
  la PR (p. ej. "Añade Ficha X: <tema> a <especialidad>").
- **`.github/PR_SUMMARY.generated.md`**: el cuerpo de la PR, en español,
  con estas secciones:
  - `## Qué se añadió` — resumen de las fichas/calculadoras/preguntas
    nuevas y dónde viven.
  - `## Fuente` — de dónde sale el contenido (PDF/link, con nota de qué
    tipo de fuente es: guía de práctica clínica, revisión narrativa,
    protocolo interno, etc.).
  - `## Verificado` — qué comprobaste con Playwright.
  - `## Auditoría de fidelidad` — hallazgos reales de fabricación
    (contenido que escribiste sin respaldo directo en la fuente, si lo
    detectaste y corregiste) y de erratas/discrepancias de la propia
    fuente, o "Sin hallazgos" si no encontraste ninguno.
  - `## Huecos de contenido detectados` — datos/tablas/figuras/matices
    reales de la fuente que no llegaste a trasladar en esta pasada, con
    la ubicación exacta (página/sección) para que una ronda futura no
    tenga que releer la fuente entera de nuevo, o "Ninguno detectado".
  - `## Propuestas de mejora e interactividad (no implementadas)` —
    los candidatos concretos del paso 6 (calculadora/selector/simulador/
    enlace cruzado), cada uno con qué ficha afecta y por qué encajaría,
    o "Ninguna propuesta — el contenido no da para más interactividad
    verificable" si de verdad no hay ninguna candidata razonable.
  - `## Qué revisar antes de aprobar` — lo que tú, como autor, le
    señalarías a un revisor humano antes de mergear esto.

  Si no llegaste a generar ningún cambio real (fuente ilegible, sin
  contenido clínico aprovechable, etc.), escribe igualmente este fichero
  explicando por qué, para que quede constancia en los logs del *run*.
