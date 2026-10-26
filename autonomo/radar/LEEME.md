# Radar

Mapa: el norte en `NORTE.md` · la hoja de ruta única y viva en `HOJA-DE-RUTA.md` · el registro y las fichas de triaje
en `ENTRADAS.md` · la skill `/radar` (apunta, tanda, rumbo) en `.claude/skills/radar/SKILL.md`.

Todo lo que el usuario ve y quiere traer a la app (webs, repositorios, tuits, papers, ideas) entra por **una sola
puerta**: la **Bandeja del Radar**, el issue #27 de GitHub
(https://github.com/alvariitoSW/fiebres-neutropenias/issues/27). Un enlace por comentario, desde la app de GitHub del
móvil. Coste: 0 € (usa el plan de Claude que ya tiene el usuario). Aprobado el 25/10/2026 (B-012 y B-017).

**Hilos de Twitter/X**: un solo comentario con el enlace del primer tuit en la primera línea y, debajo, los enlaces de
los artículos del hilo (uno por línea), más una línea de contexto o una captura si quiere. Cada artículo cuenta como
una entrada aparte (comparten el contexto del hilo). Si solo viene el enlace del hilo, se intenta leer (vía pública
de incrustar o la captura) y sacar los artículos; si X no deja, se le pide en el issue que pegue los enlaces.

## Quién la procesa

Una **tarea programada de Claude Code**, una vez al día, en una sesión nueva. Solo mira los comentarios del usuario
que están **después de la última respuesta de Claude** en el issue. Como mucho **5 entradas por día**: las demás
quedan para el día siguiente, para no gastar demasiado del límite de uso del plan.

## Qué hace con cada entrada

1. **Clasifica**: paper · tuit · web/app · repositorio · idea.
2. **Paper** → se integra en *UCI / Papers Tuiter* con las reglas de siempre (`CLAUDE.md` y
   `js/modules/uci-papers/CLAUDE.md`; las preguntas nuevas siguen `CLAUDE.md` §8: nada de redactar). Necesita el
   **texto completo**: si es de acceso abierto y se puede descargar, a `docs/`; si no, se pide al usuario que adjunte
   el PDF en la propia bandeja. Rama `auto/bandeja-<AAAA-MM-DD>-<n>` y **PR en borrador**; nunca a `main` directamente.
3. **Tuit** → no es fuente. Se busca el **paper original** (DOI/PubMed; skills `paper-lookup` y `claim-check`) y se
   sigue como un paper. Si no hay paper detrás, va al Radar como idea.
4. **Web, app o repositorio** → se apunta en `ENTRADAS.md` con su ficha de triaje; la ingeniería inversa
   (`/ingenieria-reversa`) se hace solo si el usuario la pide.
5. **Idea** → se apunta en `ENTRADAS.md` y, si es una tarea, como entrada nueva en `autonomo/BITACORA.md` (Apuntado).
6. **Responde en el issue** con una línea por entrada: qué es, qué se hizo, el enlace de la PR o lo que falta.

## Ficha de triaje (una por entrada en `ENTRADAS.md`)

`fecha · tipo · enlace · lo que dijo el usuario · qué es · a qué situación de guardia o ficha sirve · fuente que lo
respalda · licencia · coste · veredicto (integrar en fase N / idea suelta / descartar con motivo)`.

El norte con el que se tría: `docs/historial/radar.md` §2.

## Encargo de la tarea diaria (para pegarlo al crearla desde la app)

La tarea creada desde una sesión (`trig_01SJ6yy2dka8BFevHR5aCNnF`) no se abría con el repositorio dentro y no podía
añadirlo sola (25/10: dos pruebas sin resultado); quedó **pausada**. Se crea desde la app de Claude (Claude Code →
tareas programadas), con el repositorio `alvariitoSW/fiebres-neutropenias` elegido, todos los días a las 6:42 (hora de
Canarias), en una sesión nueva, con este texto:

> Procesa la Bandeja del Radar: sigue al pie de la letra `autonomo/radar/LEEME.md`. Lee el issue #27 y toma solo los
> comentarios del usuario posteriores a tu última respuesta; si no hay ninguno, termina sin escribir nada. Como mucho
> 5 entradas. Papers a UCI / Papers Tuiter en rama propia con PR en borrador (nunca a `main`); notas del Radar
> directas a `main`. Responde una sola vez en el issue #27 con una línea por entrada. Español llano.
