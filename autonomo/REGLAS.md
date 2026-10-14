# Reglas del equipo autónomo

Corto a propósito: todos los agentes lo leen en cada vuelta. `CLAUDE.md` es la historia completa del proyecto;
**no lo leas entero**: busca en él solo la sección que necesites (con grep), y lee el `README.md` del módulo
que toques (p. ej. `js/modules/eco/README.md`).

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

## 2. La app

1. **Sin backend, sin build, sin dependencias nuevas.** HTML/CSS/JS que el navegador ejecuta tal cual.
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

1. **Solo la tarea encargada.** Si ves otro problema, anótalo en la bitácora; no lo arregles de paso.
2. **Nada se da por hecho sin pasar los jueces** del tablero.
3. **El trabajo autónomo nunca va directo a `main`**: va en una rama `auto/<tarea>` con una propuesta (PR) en
   borrador. Solo el usuario la aprueba. (La regla de `CLAUDE.md` de «mergear siempre a main» es para las
   conversaciones normales, no para este modo.)
4. **Antes de cada commit**: `git checkout -- .gitignore .ignore` (las herramientas los ensucian).
5. **El contenedor se borra**: lo que no está en una rama subida a GitHub se pierde.
