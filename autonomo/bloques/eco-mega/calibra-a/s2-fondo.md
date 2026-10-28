# s2-fondo (eco-calibra-a, sesión 2, pieza 5) · rama wt/eco-calibra-a-fondo
## 1. E = 0 a fondo: ARREGLADO (J1 hemorragia:1, derrame:1, tep:1 fuera de PENDIENTES)
Causa (medida, no supuesta): a FC 120-125 la mitral abre ya dentro de la A (pvi 4,6-6 mmHg > pai 2 a la P). La fase se etiquetaba «A» por
reloj (t < PR), así que todo el llenado caía en A y `medidasLatido` (E = pico en F/G) daba 0; la D pulmonar (también F/G) igual.
Arreglo: `motor.mjs fase()` + `_fusion` (mitral cerrada al empezar el latido): pasada la duración de la activación auricular, lo que
cruza la mitral es llenado (F/G), no A. `doppler.mjs medidasLatido`: sin TDE si la E cuelga de la rama descendente de la A (`fusion`).
Fuente: Nagueh 2025 p. 547 (11: fusión, no medir TDE) y p. 557 T7; el criterio de fase, fisiología general.
| FC / E / A / E/A / E/e′ / D pulm | antes | después |
| hemorragia 100 % | 124 / 0 / 111 / 0 / 0 / 0 | 124 / 90 / 110 / 0,82 / 8,4 / 12 |
| derrame 100 %    | 120 / 0 / 106 / 0 / 0 / 0 | 120 / 88 / 106 / 0,83 / 8,2 / 10 |
| TEP 100 %        | 120 / 0 / 117 / 0 / 0 / 0 | 120 / 91 / 117 / 0,77 / 8,4 / 15 |
Las demás filas de la tabla (`tabla-sesion2-fondo.txt`) son idénticas a la sesión 1 salvo el redondeo.
## 2. J2 por abajo: NO arreglado, PARO e informo (no toco LIMITES ni tapo con el dibujo)
Mínimos medidos (VD fin de sístole / AI / AD mL; el dibujo pide ≥45 / ≥15 / ≥15): vasoplejia 40 / 12 / 12; hemorragia def 36 / 17 / 12;
hemorragia 100 % 23 / 12 / 9; derrame def 44 / 18 / 12; derrame 100 % 26 / 9 / 9; TEP def AI 11; TEP 100 % AI 14; HP crónica 100 % AI 10.
Veredicto: son volúmenes de un paciente en shock, no un error del motor. El VI de esos mismos estados baja a 22-23 mL y el dibujo ya lo
admite (LIMITES.vi desde 8); el VD gemelo (VD/VI ≈ 1) a 23-26 mL es el mismo corazón vacío (VS 20 mL, FE 47 %). Sin fuente local de
volúmenes mínimos de VD/aurículas en shock (Lang 2015 da dimensiones, no estos mínimos): el hueco B2 de la tabla ya lo dice.
Probé la salida «en el motor»: subir el volumen sin tensión (v0) de AI (5→14) y AD (8→16), con vSangre y v0Peri compensados para no mover
ninguna presión. Deja AI/AD dentro en las 5 formas (y TEP def/100 % y HP crónica 100 % pasan J2), pero rompe: `geometria` «bomba auricular»
(AI se vacía a 0,63 del inicial, exige <0,6), `formas` «mezcla» (1,61 mm), `latido` AD máx 65 mL frente a ref 40-60 (referencia que no se toca).
Sin fuente para recalibrar esas tres, lo REVERTÍ. Opción para el director: elegir entre recalibrar esas pruebas con fuente (fracción de
vaciado activo de la AI) o bajar los pisos del dibujo (LIMITES). El VD no se puede subir igual: +22 mL de v0 sacaría la HP crónica del
tope 330 (pieza 4, otro constructor).
## 3. Vasoplejia, bomba AI 88 %: es un artefacto de la etiqueta, no fisiología
A FC 108 la E arranca al final del latido (F, 0,50 s) y su pico cae después del límite del ciclo, ya etiquetado «A» (t < PR): 87 % del
volumen mitral cuenta como «bomba». Contrafactual (AI sin contracción, 1 latido): el beneficio real ronda 13 % del llenado (aproximado,
sin reequilibrar). No lo toqué (no era el encargo y la etiqueta es la misma que arreglé): si se quiere, se aplica el criterio de fusión
a la mitral abierta con E aún subiendo en el límite del latido.
## Archivos / pruebas
Cambiados: `motor.mjs` (fase, _fusion), `doppler.mjs` (medidasLatido), `pruebas/paciente-doppler.test.mjs` (PENDIENTES: quito J1 hemorragia:1,
derrame:1, tep:1; reescrita la causa), `README.md` (párrafo), `tabla-sesion2-fondo.txt`. Sin pruebas recalibradas. LIMITES y referencias intactos.
Motor común: solo `fase()` (etiqueta de fase; no cambia ninguna presión ni flujo). Dilatada, fallo, hipertrofia, HP crónica: cifras idénticas.
Descartado: sumar la cola de relajación del latido anterior (eVi no se corta a 0 en el límite): continuo, pero a FC>120 bajaba el IC del
derrame a 1,18 (<1,2), saltos del TEP 7,5 mmHg y la apertura de la mitral del fallo (0,78 <0,8), y movía dilatada/fallo (de otros).
Suite eco: 502 pruebas, 479 ok, 0 fallan, 23 todo (antes 26). No comprobado / riesgo: el simulador no se miró en navegador (la E de la fusión se ve ahora en el Doppler: E≈0,8 A, sin TDE).
