# Historial · Modo Estudio y reloj Pomodoro

> Texto movido tal cual desde el antiguo `CLAUDE.md` (octubre 2026). Es la historia de cómo se construyó
> esta parte: decisiones, fuentes, auditorías y verificaciones. Las reglas vigentes están en `CLAUDE.md`.

## Modo Estudio y reloj Pomodoro (`js/core/pomodoro.js`)

A petición explícita del usuario ("quiero añadir una actualización para
poder usar la app en modo estudio, que puedas seleccionar esa opción y en
cada apartado te ponga un estimado de pomodoros de 25 minutos con 5
minutos de descanso tardas en leer el contenido y luego lo que tardarias
en resolver las preguntas... un reloj tipo pomodoro, donde pueda ponerse
modo estudio y llevar una cuenta de los pomodoros que se han hecho"), se
añadió un **Modo Estudio** transversal a toda la app — no una calculadora
ni un módulo de contenido más, sino infraestructura genérica (mismo
espíritu que `core/corkboard.js`/`core/lightbox.js`): se implementa una
sola vez y aparece automáticamente en **todas** las fichas de **todas**
las especialidades, sin tocar el HTML/JS de ningún módulo concreto.

- **Botón de cabecera** (`#btn-modo-estudio`, junto a `#btn-escalas-generales`
  en `.header-row` de `index.html`, mismo patrón visual `.accordion-btn.
  nav-btn.corner-btn`) activa/desactiva `body.study-mode-on`. Con Modo
  Estudio activo aparecen dos cosas a la vez, ambas gobernadas por esa
  única clase CSS en `body` (nunca JS que muestre/oculte elemento a
  elemento): las etiquetas de pomodoros por ficha, y el reloj Pomodoro
  flotante — apagar Modo Estudio oculta ambas y, si el reloj estaba
  corriendo, lo pausa (nunca sigue corriendo en segundo plano sin que se
  vea).
- **Estimación de pomodoros por ficha, calculada de forma genérica, no
  hardcodeada por ficha**: `initStudyMode({ quizBanco })` (llamada una
  única vez desde `js/main.js`, justo después de la única llamada a
  `initQuiz()` — reutiliza el mismo `quizBancoCompleto` ya fusionado de
  las 6 asignaturas, sin volver a fusionar nada) recorre TODOS los
  `.field-card[data-tab]` ya presentes en el DOM (todas las fichas de
  todas las especialidades están cargadas desde el arranque, aunque
  ocultas — ver `js/core/include.js`) y para cada una calcula:
  - **Minutos de lectura**: `textContent` del `.tab-content` con el mismo
    id que el `data-tab` de la ficha (mismo mapeo 1:1 que ya usa
    `core/corkboard.js`), contado en palabras (`\S+`) y dividido entre
    180 palabras/minuto (estimación de lectura técnica en español).
  - **Minutos de preguntas**: se filtra `quizBanco` por
    `pregunta.tema === data-tab` (campo ya existente en cada pregunta,
    mismo que usa el selector de temas del quiz) y se pondera cada
    pregunta según su tipo — 1,2 min si es de opción múltiple, 2,5 min si
    es `tipo: 'redactar'` (más lenta de responder).
  - **Pomodoros** = `Math.ceil((minLectura + minPreguntas) / 25)`, mínimo
    1 si la ficha tiene contenido, 0 (sin etiqueta) si por lo que sea no
    tiene ni texto ni preguntas asociadas.
  Fichas de solo referencia sin preguntas propias (p. ej. la Ficha 12 de
  bibliografía de Cardiología, o `nefrotoxicidad.html`) muestran solo el
  tiempo de lectura, sin la parte de preguntas — el cálculo no fuerza un
  segundo número si no hay banco de quiz para ese `data-tab`.
- **Etiqueta visual** (`.pomo-badge`, inyectada una sola vez por
  `inyectarBadges()` dentro de cada `.card-face.front`, oculta por CSS —
  `display:none` hasta que `body.study-mode-on` — en vez de esperar al
  toggle para crearla, así no hay coste de recomputar nada al
  activar/desactivar el modo): "🍅×N" más una segunda línea con el
  desglose ("📖~X m ❓~Y m"), en la esquina superior **izquierda** de la
  ficha — deliberadamente el lado opuesto al check ✓ verde de "ya visto"
  que pinta `core/corkboard.js` en la esquina superior derecha, para que
  nunca se solapen.
- **Reloj Pomodoro flotante** (FAB `#pomodoro-fab`, 🍅, esquina inferior
  derecha, visible solo con `body.study-mode-on`; panel `#pomodoro-panel`
  que se abre/cierra con el propio FAB): 25 min de "Enfoque" → 5 min de
  "Descanso" → vuelta a "Enfoque", con los botones Iniciar/Pausar y
  Reiniciar ya estándar de la app (`.pomo-btn`, mismo lenguaje visual que
  `.pomo-btn`/`.tfg-estado`). La cuenta atrás se calcula a partir de una
  **hora de fin** (`Date.now() + duración`), nunca restando segundo a
  segundo en cada tick — así no acumula deriva si la pestaña pasa a
  segundo plano y el `setInterval` deja de dispararse puntualmente. Al
  completarse una fase de "Enfoque" se incrementa el contador de
  pomodoros completados; al completarse un "Descanso" se vuelve a
  "Enfoque" sin incrementar nada.
- **Contador de pomodoros completados persistente** (`localStorage`,
  clave `hud-pomodoros-completados`) — la única cifra de todo este módulo
  que sobrevive a un `location.reload()` o a cerrar la pestaña,
  deliberada y documentada como la segunda excepción a "sin persistencia"
  del proyecto (ver "Decisiones de arquitectura" al principio de este
  archivo) — igual que el quiz ya hace con aciertos/fallos por pregunta.
- Sin partial `.html` nuevo: el FAB y el panel se generan por JS
  (`construirWidget()`) y se anexan a `document.body` una sola vez, mismo
  criterio que otros widgets flotantes de la app (`.lightbox-overlay`, el
  modal del quiz) — no había ningún contenido estático que mereciera su
  propio `data-include`.
- Verificado con Playwright (viewport 390×844): el botón de cabecera
  activa/desactiva `body.study-mode-on` y la clase `.active` del propio
  botón; el FAB y el panel están ocultos (`display:none`) hasta activar
  el modo; las etiquetas de pomodoros aparecen con el desglose correcto
  en fichas de Reconocimiento (Hematología) y en las 18 fichas del
  cuaderno de fisiología de Nefrología (todas con etiqueta, formato
  "🍅×1 📖~Xm ❓~10m"); sin overflow horizontal a 390px con las etiquetas
  activas; el reloj cuenta hacia atrás correctamente (25:00→24:58 tras
  ~2s), se congela al pausar y no avanza mientras está en pausa, y
  "Reiniciar" lo devuelve a 25:00/Enfoque; el contador de pomodoros
  completados lee correctamente el valor guardado en `localStorage` tras
  recargar la página; al desactivar Modo Estudio el FAB se oculta y el
  panel se cierra; sin errores de consola ni de página en ningún punto
  del recorrido. Bump de cache-busting a `?v=20260910` (cambió
  `css/components.css` y `js/main.js`).
- **Duración editable + progreso de estudio persistente por ficha**, a
  petición explícita del usuario ("quiero que se pueda editar el
  pomodoro, que puedas poner los minutos que quieres estudiar y los que
  descansar. También quiero que se guarde el progreso de estudio y poder
  llevar un conteo de lo que llevo estudiando y lo que me falta por
  estudiar cuando me conecte en diferentes dias"):
  - **Enfoque/descanso editables** (`#pomo-cfg-enfoque`/`#pomo-cfg-descanso`,
    2 `<input type="number">` dentro del propio panel del reloj, debajo de
    Iniciar/Reiniciar), persistidos en `localStorage`
    (`hud-pomodoro-config`, `{enfoque, descanso}` en minutos) — sobreviven
    a recargar la página o volver otro día, igual que el resto de este
    módulo. Clamp 1-180 min (enfoque) / 1-60 min (descanso); un valor no
    numérico o vacío cae al valor por defecto (25/5). Si el reloj está
    **parado** y la fase visible es la que se acaba de editar, la cuenta
    atrás mostrada se actualiza al momento; si está **corriendo**, el
    cambio se guarda pero no toca la cuenta atrás en marcha (evita un
    salto brusco a mitad de sesión) — se aplica ya en la fase siguiente.
    Los `<input type="number">` del panel necesitaron el selector
    `.pomodoro-panel .pomo-config-input` (2 clases) para ganar
    especificidad sobre la regla global `input[type="number"] { width:
    100%; ... }` de `components.css` línea ~18 — un simple `.pomo-config-input`
    a secas no habría bastado (misma especificidad que la regla global,
    y esta es anterior en el archivo).
  - **Progreso de estudio por ficha, persistente entre sesiones**
    (`localStorage`, clave `hud-estudio-progreso`, `{ [dataTab]:
    pomodorosHechos }` — mismo módulo/excepción ya documentada arriba
    para Modo Estudio, que ahora guarda 3 claves en vez de 1: el contador
    de pomodoros completados, la configuración de duración, y este
    progreso por ficha): cada ficha ahora lleva la cuenta de cuántos de sus
    pomodoros estimados ya se han "invertido" en ella, de dos formas
    independientes y complementarias:
    1. **Automática**: al completarse una fase de Enfoque del reloj, se
       busca qué ficha está realmente visible en ese momento
       (`obtenerFichaActivaVisible()` — de entre todos los
       `.tab-content.active` del documento, que puede haber varios sueltos
       de otras vistas ocultas ya que cada especialidad tiene su propio
       grupo de pestañas independiente, se queda con el único cuyo `id`
       está en el mapa de estimaciones **y** es visible de verdad ahora
       mismo, comprobado con `offsetParent !== null`) y se le suma 1
       pomodoro (tope: su propia estimación, nunca de más).
    2. **Manual**: tocar la propia etiqueta `🍅 P/N` de cualquier ficha
       la marca/desmarca como "estudiada" (progreso = su estimación
       completa, o vuelve a 0) — pensado para cuando se lee sin el reloj
       corriendo, o para corregir a mano. La etiqueta pasó de
       `pointer-events:none` a ser un botón real (`cursor:pointer`, con
       `e.stopPropagation()` en su propio listener para no disparar
       también el volteo de la ficha, que escucha clicks en toda la
       `.field-card`).
    Con progreso ≥ estimación, la etiqueta cambia de "🍅 P/N" a
    "✅ P/N" y de color (`.pomo-badge.pomo-done`, borde/fondo
    `--accent-green`) — visualmente distinta de un vistazo del check ✓
    verde de "ya visto" de `core/corkboard.js` (esquina superior
    derecha; la etiqueta de pomodoro vive en la izquierda, así que nunca
    se solapan aunque ambas puedan estar activas a la vez en la misma
    ficha).
  - **Resumen global de progreso**, en el propio panel del reloj, debajo
    del contador de pomodoros completados: barra de progreso
    (`.pomo-progreso-fill`) + texto "Progreso: H/T 🍅 (P%)" + "Quedan ~R
    pomodoros por estudiar" (o "¡Todo estudiado! 🎉" si R=0) — `H`/`T`/`R`
    calculados sumando el progreso y la estimación de **todas** las
    fichas de **toda** la app (`calcularResumenProgreso()`), no solo la
    especialidad que se esté viendo en ese momento; se recalcula en cada
    cambio de progreso (fin de un pomodoro, toggle manual).
  - Verificado con Playwright: los inputs de duración arrancan en 25/5,
    aceptan un valor nuevo (probado con enfoque=1 min para no esperar 25
    minutos reales en el test) y lo clampan si se sale de rango
    (9999→180); con el reloj parado en fase Enfoque, cambiar el propio
    campo de enfoque actualiza la cuenta atrás ya mismo, mientras que
    cambiar el de descanso no la toca (fase distinta); tras dejar correr
    un pomodoro real de 1 minuto completo, el contador sube a 1, la fase
    pasa a Descanso, y la ficha que estaba abierta en ese momento
    (`fisio-anatomia`, con estimación 1/1) pasa automáticamente a
    "✅ 1/1" con `.pomo-done`; tocar la etiqueta de otra ficha
    (`fisio-filtracion`) la marca manualmente como estudiada sin voltear
    la ficha (confirmado que `.flipped` no se activa), y un segundo toque
    la desmarca; el resumen global pasa de "0/255" a "1/255 (0%)" tras el
    pomodoro automático y a "2/255 (1%)" tras el toggle manual; tras
    recargar la página (simulando "otro día"), la configuración de
    duración, el contador de pomodoros completados, el progreso de ambas
    fichas y el resumen global se leen correctamente de `localStorage` sin
    perder nada; sin overflow horizontal a 390px ni errores de consola en
    ningún punto. Bump de cache-busting a `?v=20260910-2` (segundo
    despliegue del mismo día que toca `css/components.css`).

