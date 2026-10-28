# Encargo `eco-calibra-a` · arreglo del motor de la eco (técnico; a `main` con los jueces en verde)

Fila y ficha: `autonomo/TABLERO.md` (Objetivo P, decisiones del 27/10). Informe (diagnóstico, cifras objetivo con
página, orden, pruebas a recalibrar): `autonomo/bloques/eco-mega/calibra-informe.html` (texto plano en
`/tmp/plan-socialista/eco-calibra-a/informe.txt`). Medidor: `node autonomo/bloques/eco-mega/herramientas/calibra-tabla.mjs`
(9 formas a 0, defecto y 100 %).

Fuentes (PDF en `docs/`, página impresa (página PDF)): Nagueh 2025 `nagueh-2025-funcion-diastolica-hfpef-ase.pdf`
pp. 547-557 (11-21) · Lang 2015 `lang-2015-cuantificacion-camaras-ase.pdf` p. 24 (24) · Mukherjee 2025
`mukherjee-2025-corazon-derecho-hp-ase.pdf` pp. 145-173 (5-33) · ESC/ERS 2022 parte 1 pp. 3644-3657 (27-40).

## Qué se arregla (opción A entera)
1. La AI y la AD suman su contracción a la presión pasiva (hoy, distendidas, «contraer» las relaja: A desaparece).
2. Freno de las venas pulmonares: sin reflujo de ~500 mL/s; flujo venoso de libro.
3. e′ (y E/e′) cambia con la relajación de cada forma (hoy fijo 10,8 en todas).
4. HP crónica a fondo: VD grave pero posible (Mukherjee Tabla 1 p.145; ESC p.3657), sin aplastar el VD ni pasar del
   tope del dibujo.
5. A fondo (TEP, hemorragia, derrame), E nunca 0. La AD con el mismo arreglo que la AI.
6. Velocidad de las venas pulmonares en el panel con el área real de 4 venas (hoy «ilustrativo»).
Jueces: J1 «Doppler de paciente posible» por forma (E/A, E/e′, S/D, TAPSE, bomba AI, velocidades) a 0, defecto y
100 %; J2 cada forma al 100 % sin aviso de recorte del dibujo (`LIMITES` de `corazon-geo.mjs`). Ambos como pruebas en
`js/modules/eco/pruebas/` (las corre `jueces.mjs --eco`).

## Hipertrofia
La decide el profesor (grado I, grado II o mando I→II) con Nagueh 2025 y la deja escrita en
`/tmp/plan-socialista/eco-calibra-a/plan-hipertrofia.md`.

## Reparto en dos sesiones
- Sesión 1 (esta): J1 y J2 (en rojo, marcan la meta) · piezas 1 y 2 (motor) · recalibrar TEP, derrame y HP crónica y
  las pruebas que dependían del defecto · pieza 3 (e′) · hipertrofia.
- Sesión 2: piezas 4, 5 y 6 · auditor (cifras y notas) · juicio rápido del profesor · J1 y J2 en verde · merge a `main`.
Entre sesiones, todo en la rama `auto/eco-calibra-a` (no va a `main` con pruebas en rojo).

## Reglas que mandan
- `js/modules/eco/CLAUDE.md`: toda cifra con origen en `referencias.mjs`; **nunca cambiar una referencia para que una
  prueba pase**; una sola fisiología (motor).
- Pruebas que fijan la calibración vieja (informe §5) se recalibran **con su fuente**, no se borran.
- Cifra mala del motor: no se tapa con el dibujo; para e informa (REGLAS §1.14).
- Sin cifra en las fuentes (DT normal, S/D y Ar normales, onda a de la AI en mmHg, bomba AD, VD máximo, E/A en TEP,
  hemorragia y derrame): buscar y citar (REGLAS §1.15); si no, `fisiología general` con aviso o hueco con nota.
- Discrepancias con nota: LVEI >1 (Mukherjee p.149) frente a >1,1 (p.173 y ESC p.3645); DT de relajación alterada
  distinta en las Tablas 1 y 6 de Mukherjee.
- No tocar formas fuera de la lista (vasoplejia y fallo solo si se mueven por las piezas comunes; deben seguir en
  banda). Vasoplejia: fusión E-A a FC 107 (mirar, no forzar).

## Hecho
Las 9 formas a 0, defecto y 100 % dentro de banda (tabla de `calibra-tabla.mjs` en el parte) · J1 y J2 en verde en
`jueces.mjs --eco` · `node --test 'js/modules/eco/pruebas/*.test.mjs'` entero en verde · hipertrofia como decida el
profesor (E/A <1 si grado I) · párrafo en `js/modules/eco/README.md` y en `docs/historial/eco.md` · versión de la app ·
parte.

## Firmado por el director (28/10, tras revisión del encargo, bandas y profesor)
- Formas: 5 con mando (hemorragia, fallo, derrame, tep, hpcronica) × 0/defecto/100 % + hipertrofia con mando NUEVO
  (0/defecto/100 %, plan del profesor `plan-hipertrofia.md`) + 3 fijas (normal, vasoplejia, dilatada).
- J1 exige solo las celdas de `bandas.md` con cifra de libro y página, y en todos los casos el mínimo de hueco
  (E>0, A>0 salvo que la fuente diga otra cosa, S>0, D>0). Lo «inf.» y «fis.gen.» se imprime como diagnóstico, no falla.
  VD/VI en volumen: no se juzga (fuentes en diámetro/área). Edad: 20-60 años (unión).
- J2: cada forma en cada punto, todas las muestras del latido dentro de `LIMITES` de `corazon-geo.mjs` (no se tocan).
- Casos que hoy fallan: en un conjunto `PENDIENTES` del archivo de prueba → `todo`. Cada arreglo quita sus claves del
  conjunto. Al cerrar la sesión 2, `PENDIENTES` vacío.
- Discrepancias (4 de `bandas.md`): nota en `referencias.mjs`, sin elegir ganadora.
- Número de pruebas de la eco: no baja de 432.
