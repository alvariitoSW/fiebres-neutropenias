# Reglas del plan socialista (equipo autónomo)

Corto a propósito: todos los agentes lo leen en cada vuelta, junto con `CLAUDE.md` (las reglas del proyecto,
también cortas). La historia de cada parte está en `docs/historial/`: **no la leas entera**, busca con grep la
sección que necesites, y lee el `README.md` del módulo que toques (p. ej. `js/modules/eco/README.md`).

## 1. Contenido clínico

1. **Nunca inventes.** Toda cifra, dosis, umbral o afirmación clínica sale de una fuente que se puede abrir (PDF en
   `docs/`, el repositorio de origen, o una ficha de la app ya cotejada). Si no la encuentras, no la escribas:
   anótalo como hueco.
2. **Cada cifra visible tiene su origen** en la propia pantalla: `ficha` (de la fuente), `fisiología general` o
   `ilustrativo`. Si es ilustrativa, la pantalla lo dice.
3. **Si la fuente tiene una errata**, se reproduce tal cual y se añade una nota de fidelidad plegable
   (`<details class="nota-plegable">`) que la explica. Nunca se corrige en silencio.
4. **Si dos fuentes no coinciden**, se muestran las dos con una nota de fuentes. No se elige una ganadora.
5. **No resumas por debajo de la fuente**: cifras, fármacos y mecanismos con su detalle real.
6. **Código ajeno**: de echodemo (The Heart by Ultrasound) se traduce el texto, con permiso del autor y citado; el
   código nunca se copia: cada figura se reconstruye sobre los motores de la app. Nada de imágenes de pacientes con
   licencia restrictiva (CAMUS, EchoNet).
7. **Lo que muestra un simulador es un paciente posible** en todo el recorrido de sus mandos (extremos y punto
   medio): presión arterial, frecuencias, presiones y velocidades dentro de lo fisiológico para ese estado. Si el
   modelo lleva a algo que el texto no describe (p. ej. un shock), se ajusta el modelo o se dice en pantalla.

## 2. La app

1. **Sin backend, sin build, sin dependencias nuevas.** HTML/CSS/JS que el navegador ejecuta tal cual. La única
   librería es Motion (`js/vendor/`), elegida por el usuario; otra, solo si él la pide.
2. **Móvil primero**: nada desborda a 390 ni a 360 px de ancho; toques de al menos 44 px.
3. **Reutiliza antes de crear**: enlaces cruzados con `[data-especialidad]`; ayudas de `js/core/ui.js` y
   `js/core/wizard.js`; clases ya existentes de `css/components.css`. Una clase o un componente nuevos solo si no hay
   ninguno que sirva.
4. **Ids únicos en toda la app** (todas las vistas están en el DOM a la vez): comprueba con grep antes de inventar
   uno.
5. **Si cambias un `.css` o `js/main.js`**, sube la fecha `?v=` de `index.html`.
6. **Motor del simulador de eco**: si lo tocas, todas sus pruebas siguen en verde y lo cuentas en
   `js/modules/eco/README.md`. Nunca cambies una referencia de `referencias.mjs` para que una prueba pase.

## 3. Redacción

1. Español claro, frases cortas y en voz activa. Sin muletillas («cabe destacar», «es importante señalar»).
2. Nombra las cosas como las conoce un médico, no como están hechas por dentro.
3. Los botones dicen lo que hacen («Comprobar», «Ver en el texto»).

## 4. Trabajo y git

1. **Solo la tarea encargada.** Si ves otro problema, anótalo en el informe de la sesión; no lo arregles de paso.
2. **Nada se da por hecho sin pasar los jueces**: `node autonomo/jueces.mjs` en verde (con `--eco`, `--atlas` o
   `--ficha` según la tarea) y los puntos de «hecho» del tablero.
3. **El trabajo autónomo nunca va directo a `main`**: va en una rama `auto/<tarea>` con una propuesta (PR) en
   borrador. Solo el usuario la aprueba. (La regla de `CLAUDE.md` de «mergear siempre a main» es para las
   conversaciones normales, no para este modo.)
4. **Antes de cada commit**: `git checkout -- .gitignore .ignore` (las herramientas los ensucian).
5. **El contenedor se borra**: lo que no está en una rama subida a GitHub se pierde.

## 5. Lo que el agente puede y no puede tocar

1. **Las reglas son de solo lectura** para el agente: nunca edita `autonomo/REGLAS.md`, `CLAUDE.md` (ni los de los
   módulos) ni sus propias instrucciones. Si cree que una regla falla, lo propone en su informe y el usuario decide.
2. **El estado sí lo escribe**: los estados de `autonomo/TABLERO.md` y su parte en `autonomo/partes/`.
3. **No avanzar sin prueba**: una tarea solo pasa a `en revisión` cuando la PR existe en GitHub (con su enlace en el
   informe). Si el push o la PR fallan o no está claro que salieron, el estado no cambia y el informe lo dice.
4. **Lo que no se pudo leer es un hueco, no un hecho**: si una fuente no se abre (web bloqueada, PDF ilegible), la
   tarea no se marca hecha ni se salta en silencio; el informe dice qué faltó.
5. **«No había nada que hacer» no es un fallo**: si no queda tarea pendiente, el informe lo dice así.
6. **Límite de gasto**: si la sesión llega al límite del tablero, se para y deja el estado como está.

## 6. Cómo crecen estas reglas

Cuando un fallo se cuela por los jueces (lo ve el director, el revisor o el usuario después), no se arregla solo esa
vez:
1. El parte lo anota en «Propuestas sobre las reglas»: qué falló, por qué no lo vio ningún juez y qué regla o
   comprobación lo habría cazado (y en qué agente o en `autonomo/jueces.mjs`, si se puede automatizar).
2. **El usuario decide.** Si la aprueba, entra aquí, en el agente que debía verlo y, si aplica, en `CLAUDE.md` y en
   los jueces automáticos. El agente nunca la añade por su cuenta (§5.1).
3. Cada regla nacida así se apunta en la lista de abajo, con la tarea donde se vio.

**Reglas nacidas de fallos**
- §1.7 (paciente posible): capítulo 18 del atlas, `mr` (octubre 2026). Con el EROA máximo la figura daba PAS 73 mmHg
  y un chorro de 3,4 m/s; los dos jueces la aprobaron porque las cifras iban «en la dirección del texto». Lo vio el
  director en una captura. Entró en el verificador y en `CLAUDE.md` §12.
