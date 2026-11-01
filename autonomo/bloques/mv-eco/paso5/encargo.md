# Encargo mv-eco-2a5 · paso 5 (B-045): el dibujo nuevo al realismo 9,5 y encenderlo
Decisión del usuario 01/11 (acta autonomo/consejo/2026-11-01.md). Tipo: arreglo/visual del motor de imagen (sin fichas).
Base: main (paso 4 en main, versión 20261031-62). Rama auto/mv-eco-2a5. Interruptor ?dibujo=2.
Punto de partida (parte 2026-10-31-mv-eco-4.md): realismo 8,7 = proporciones 9 · forma 8,5 · textura 8,75 · extremos 8,5;
movimiento y Doppler SIN juzgar (no había capturas de vídeo ni Doppler).
## Piezas (una por encargo, sonnet, ≤40 pasos)
- P5-0 herramienta: capturas-realismo.mjs añade fin de sístole (mismas vistas), PSAX D sístole vs diástole, modo M TAPSE,
  y Doppler (mitral PW E/A normal y seudonormal-fallo, CW de IT en HP y TEP, PW TSVI) con las cifras del motor al lado.
  Volumen telediastólico (no el de la fase) en cifras.md.
- P5a VI pequeño (HP, TEP, derrame): borde endocárdico nítido, cavidad negra (no gris), papilares sin llenarla.
- P5b mitral: dos velos (anterior largo, posterior corto), sin gancho ni zigzag, abre en diástole (E y A) y cierra en sístole.
- P5c pared libre del VD: fina (≤5 mm, Lang 2015 Tabla 8 p.20) en el TEP agudo; gruesa (>5 mm) solo en la HP crónica
  (ESC/ERS 2022). Si el origen es anatomia.mjs/motor → pruebas de la eco + jueces --modelo shock-vivo (CLAUDE §5).
- Profesor (fable) juicio de realismo con los 6 criterios, lado a lado con figuras con página.
- P5d/e arreglos de movimiento y Doppler según el juicio (sonnet nuevo por vuelta, lista exacta).
- Rejuicio solo de lo <9.
- Encender (al ≥9,5 media y ningún criterio <9): por defecto dibujo 2, regenerar instantánea, --geometria a la suite,
  version.mjs, pruebas de la eco, shock-vivo, --eco.
## Hecho
Media ≥9,5 y ningún criterio <9 (6 criterios del encargo B-045) · juez geometría 0/147 con el nuevo · 505+ pruebas de la eco y
shock-vivo en verde · VD/VI>1,0 en HP crónica grave · interruptor encendido · versión nueva · parte y SESIONES.
## Lo que NO quiero
three.js; tapar con el dibujo una cifra mala del motor (si el motor está mal, se para y se informa); bajar umbrales del juez;
referencias de forma de mallas IA; fotos con licencia restrictiva; dejar el shock vivo o el atlas sin corazón.
## Fuentes
Lang 2015 (docs/lang-2015-cuantificacion-camaras-ase.pdf), ESC/ERS 2022 HP, Mukherjee 2025, Nagueh 2016 (diastólica) si existe en docs/, Hahn 2013.
## Tras la revisión (Explore sonnet, revision-encargo.md)
- GRAVE 1 → pieza nueva P5f: el Doppler no pinta la IT (qTriReg solo en motor.mjs:468). Se construye el chorro CW de IT en
  doppler.mjs (fuentesFlujo, curvaLatido, medidasLatido) desde el motor (qTriReg, dpTri: v = √(ΔP/4)), con prueba. Referencia
  real: Zoghbi 2017 Fig. 29 (PDF p. 49) y Fig. 4 (p. 9, PW TSVI).
- GRAVE 2 → movimiento y Doppler no tienen juez automático: P5-0 da al profesor capturas en 4 fases (A, sístole media, fin de
  sístole, E) y espectros con sus cifras en texto (E, A, E/A, DT, vIT, ITV TSVI, TAPSE de anatomia.mjs); el juicio es del profesor.
- E/A mitral y TSVI normal: no hay figura real con página en docs/ (Nagueh 2025 son algoritmos) → se juzga contra la forma
  descrita en la guía con su página; lo dice el parte.
- Menores: Nagueh 2025 (no 2016); P5c probablemente sin motor (TEP mioVd=1; atlas.test exige pared<5): primero medir;
  pleura doble del PLAX y manchas del subcostal del derrame, al juicio (si bajan nota, entran en el arreglo).
