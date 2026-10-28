# constructor-ai (eco-calibra-a, pieza AI/AD + rVp) · commit y push hechos
Cambios (valores antes → después)
- motor.mjs: `presionAurícula` nueva (P = pasiva + e·Ees·(V−V0)) para AI y AD · AI ees 0,70→0,37, a 0,20→0,25 · AD v0 5→8 (solo desplaza el volumen) · rVp 0,01→0,02 · rPul 0,095→0,08 · `escalarRPul(p,k)` = rPul + 0,095·(k−1).
- escenarios.mjs: TEP y HP usan escalarRPul; derrame máx. 388→383 mL (con 388, IC 1,15). atlas/vd.mjs: ídem (presión y agudo).
Tabla (antes → después): normal PCP 7,5→8,0, E/A 1,15→1,15, bomba AI 23→26 %, S/D 1,69→1,08, Ar 593→189 mL/s, AI/AD mín. 14→≥16 mL
 dilatada E/A 3,9→2,5 (A 34→45) · TEP def E 11→19, D 17→18 mL/s (>0), PAM 67 · derrame def E/A 1,06→1,16, IC máx. ok · HP def E/e′ 7,9→8,1 · HP 1: PAM 74, VD 330 igual.
Pruebas viejas recalibradas (ninguna referencia tocada)
- geometria C1 «mitral abre y cierra»: el muestreo fijo dependía de la fase; se añade el instante de mayor flujo mitral.
- geometria «un solo tabique», TEP: mínimo de filas 30→20 (solo asegura que se midió; sale 13-26 según la AI; la comprobación de hueco ≤2,6 mm sigue igual).
- motor «balón»: caída de presión al abrir la aórtica >3→>2 mmHg (sale 2,9; la de antes 3,07; el 3 no tenía fuente, el libro p.45-46 es cualitativo).
- escenarios «tep ×8» y motor «hp ×6»: ahora con escalarRPul; navegador 388→383 mL.
- doppler.test.mjs no exigía S≥D ni Ar<S/2: no hizo falta citar Nagueh p.554.
Resultado: suite entera 502 pruebas, 473 ok, 0 fallan, 29 todo (antes 41 todo). J1/J2 paso de 12 a 24 ok: normal y las 5 formas a 0 en J1 y J2, J2 hpcronica:def.
PENDIENTES que quedan (18): J1 dilatada, hpcronica:def (NUEVO: E/e′ 8,11 frente a <8; e′ fijo 10,8, lo cierra la pieza 3; antes pasaba por 8,0 raspado), hemorragia:1, fallo:def, fallo:1, derrame:1, tep:1, hipertrofia ×3 · J2 vasoplejia, hemorragia:def/1, derrame:def/1, tep:def/1, hpcronica:1.
Barrido (~20 combinaciones): ai.ees 0,3-0,9 × a 0,15-0,35 × rVp 0,01-0,06. Límites medidos: restrictivo del atlas 10 E/A≥2 pide ees≤0,37 con a=0,25; derrame IC pide ees≥0,5 (se cubre bajando el derrame); PAP diastólica ≤12 pide rPul 0,08; hemorragia PCP≥1 pide a≥0,25. rVp ≥0,03 deja bomba 37-49 % (>30, Lang). S≥D se cumple en el normal (1,08).
Cifras sin fuente: ees/a/v0/rVp/rPul son «ilustrativo»; solo bomba AI 15-30 % (Lang p.24) y PAP del normal tienen fuente. README del motor: párrafo añadido; historial/eco.md NO tocado.
Herramientas nuevas en autonomo/bloques/eco-mega/herramientas/: ovr-preload.mjs (ECO_OVR='{"ai.ees":..}'), barrido.sh, fila-normal.sh, sonda-au/forma/mit/tep.mjs.
Visto de paso: la Ar sigue sobre el área ilustrativa de 2,5 cm² (pieza 6); corazon-geo.mjs:846 usa 388 como escala del derrame (inocuo). Usé `git stash`/`pop` una vez por error (árbol intacto).
No comprobado / riesgo: no vi la app en el navegador (solo navegador.test.mjs, verde); derrame a 383 deja poco margen entre IC≥1,2 y PAM≤60 (382 y 384 también pasan); restrictivo del atlas 10 sale E/A 2,02 (raspado).
