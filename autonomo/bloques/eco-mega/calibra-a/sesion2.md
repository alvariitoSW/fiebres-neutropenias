# eco-calibra-a · sesión 2 (lo que queda) · escrito por el director de la sesión 1, 28/10/2026

Todo el material de la sesión 1 está aquí (`encargo.md` con «Firmado por el director», `bandas.md`, `plan-hipertrofia.md`,
los tres informes `constructor-*.md`, tablas `tabla-antes.txt` y `tabla-sesion1.txt`). Herramientas: `herramientas/
calibra-tabla.mjs` (usa `js/modules/eco/pruebas/medir-forma.mjs`), `herramientas/calibra-a/*.mjs` (barridos de
dilatada, fallo, hipertrofia, grado), `ovr-preload.mjs`, `barrido.sh`. Jueces: `js/modules/eco/pruebas/paciente-doppler.test.mjs`
(J1/J2, conjunto `PENDIENTES` → `todo`). Suite eco: 502 pruebas, 476 ok, 0 fallan, 26 todo (15 de J1/J2).

## Hecho en la sesión 1 (rama `auto/eco-calibra-a`, 3 commits del motor)
J1/J2 · piezas 1 y 2 (AI/AD aditivas, rVp 0,02, rPul 0,08 con `escalarRPul`) · pieza 3 (e′ = relajación del VI por
forma) · hipertrofia con mando grado 1 → 2 (pasa J1/J2 en 0/def/100 %).

## Queda, por orden
1. **Dilatada y fallo (nuevo, sale de la pieza 3)**: con e′ bajo la relajación lenta baja E: dilatada E/A 2,5 → 1,38
   (debe ≥2, grado III, Nagueh p.554; el profesor la quiere como el ejemplo de grado 3), E/e′ 13,5 (≥14), DT 220 (<140).
   Fallo def E/e′ 10 (≥14), S/D 1,42 (<1); fallo 100 % E/e′ 5,1. Rigidez ×1,5 en dilatada arregla el Doppler pero rompe
   3 pruebas (PCP 35, PAM 74, criterios de la ficha): mirar la fuente de esos topes antes de decidir; si chocan dos
   fuentes, nota. Sonnet lo intentó una vez: si vuelve a no cuadrar, la vuelta siguiente en potente (Ahorro medido 3).
2. **Hipertrofia grado 1: DT 552-584 ms** (no juzgado: sin banda de libro, pero imposible). Buscar DT del grado 1 con
   fuente (REGLAS §1.15) y bajar la relajación de g bajo hasta un DT de paciente real.
3. Pieza 4 · HP crónica a fondo (VD 330 = tope del dibujo; J2 hpcronica:1) · hpcronica:def E/e′ 8,11 frente a <8.
4. Pieza 5 · E >0 a fondo (hemorragia, derrame, TEP) y J2 por abajo (VD <45, AI/AD <15) en vasoplejia, hemorragia,
   derrame y TEP. Vasoplejia: bomba AI 88 % a FC 108 (fusión): mirar.
5. Pieza 6 · velocidad de las venas pulmonares con el área real de 4 venas (hoy 2,5 cm² «ilustrativo»).
6. Auditor (sonnet): `git diff origin/main -- js/modules/eco/referencias.mjs` (ninguna referencia cambiada), nº de
   pruebas ≥502, umbrales relajados en la sesión 1 sin fuente (balón >3 → >2 mmHg en `motor.test`; filas del tabique
   del TEP 30 → 20 en `geometria`; derrame máximo 388 → 383 mL), y las notas de las 4 discrepancias.
7. Frase viva del tramo medio de la hipertrofia («PAI normal, sin grado», Nagueh p.554) si la forma tiene texto vivo.
8. Juicio rápido del profesor · `PENDIENTES` vacío · suite entera y `jueces.mjs --eco` en verde · `version.mjs` ·
   README y `docs/historial/eco.md` · merge a `main` (arreglo técnico) · parte y SESIONES.
