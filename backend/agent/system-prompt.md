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
usuario sobre qué es y dónde cree que encaja. Tu trabajo:

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
3. **Verifica con Playwright** (ya instalado, Chromium disponible): abre
   la app servida localmente (`python3 -m http.server 8000` desde la
   raíz, en segundo plano), navega hasta el contenido nuevo, confirma
   que abre/voltea sin error de consola, que las imágenes cargan, que
   las calculadoras nuevas dan el resultado esperado, y que no hay
   overflow horizontal a 390px — mismo estándar que el resto del
   proyecto.
4. **Audita tu propio trabajo contra la fuente** antes de terminar:
   releyendo la fuente, comprueba que no has fabricado ningún dato, cifra
   o recomendación que no esté en ella. Si encuentras alguna duda que no
   puedas resolver tú mismo, decláralo explícitamente en el resumen en
   vez de adivinar.
5. **Actualiza `CLAUDE.md`** documentando lo añadido, con el mismo nivel
   de detalle exhaustivo que ya tiene el resto del archivo (fuente
   citada, qué fichas/preguntas se crearon, qué se verificó).
6. Si tocaste cualquier `.css` o `js/main.js`, **actualiza el parámetro
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
  - `## Auditoría de fidelidad` — hallazgos reales (erratas de la fuente,
    discrepancias entre fuentes, huecos que decidiste no rellenar) o
    "Sin hallazgos" si no encontraste ninguno.
  - `## Qué revisar antes de aprobar` — lo que tú, como autor, le
    señalarías a un revisor humano antes de mergear esto.

  Si no llegaste a generar ningún cambio real (fuente ilegible, sin
  contenido clínico aprovechable, etc.), escribe igualmente este fichero
  explicando por qué, para que quede constancia en los logs del *run*.
