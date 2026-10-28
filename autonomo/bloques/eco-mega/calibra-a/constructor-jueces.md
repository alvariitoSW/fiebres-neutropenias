# constructor-jueces (eco-calibra-a)
Archivos nuevos en js/modules/eco/pruebas/: medir-forma.mjs (medirForma, CASOS_FORMA), bandas-paciente.mjs (BANDAS), paciente-doppler.test.mjs.
Cambiados: autonomo/bloques/eco-mega/herramientas/calibra-tabla.mjs (importa medirForma; salida idéntica a tabla-antes.txt, diff vacío), js/modules/eco/referencias.mjs (4 discrepancias: comentario + DISCREPANCIAS_DOPPLER; ninguna referencia tocada).
Pruebas: 21 J1 + 21 J2 = 42 (12 pasan, 30 `todo`). Suite eco: 502 pruebas, 461 pasan, 0 fallan, 41 todo (30 mías). Commit y push hechos.
PENDIENTES (3 palabras):
J1: normal, hemorragia:0, fallo:0, derrame:0, tep:0, hpcronica:0 → A normal 82,9>82; dilatada → e′ fijo/E/e′ 12,5; fallo:def → e′ fijo, S/D 1,45; fallo:1 → e′ fijo, S/D 4,5; hemorragia:1, derrame:1, tep:1 → E=0 y D=0; hipertrofia:0/def/1 → sin mando, E/A 10.
J2: normal, hemorragia:0, fallo:0, derrame:0, tep:0, hpcronica:0 → AI/AD -1 mL; vasoplejia → VD y AI/AD bajo; hemorragia:def/1, derrame:def/1 → VD y AI/AD bajo; tep:def/1, hpcronica:def/1 → AI/AD bajo LIMITES.
Pasan hoy: J1 vasoplejia, hemorragia:def, derrame:def, tep:def, hpcronica:def, hpcronica:1 (ojo: tep:def pasa solo con los mínimos de hueco y TAPSE); J2 fallo:def, dilatada, hipertrofia ×3.
Decisiones: bandas "inf."/"fis.gen." con diagnostico:true (se imprimen en consola). Extras de medida: feVd, tapsePaps (J1 hpcronica:1: TAPSE/PAPs<0,19, FEVD<32, PAPs≥70, TAPSE≤10).
No comprobado / riesgo: A normal 82,9 frente a tope 82 (N p.551) falla por 0,9 cm/s en las 6 "normales" (borde del libro; el director puede dar tolerancia). J1 hpcronica:1 pasa hoy, quizá porque PAPs y bandas de VD son laxas; hipertrofia 0/1 miden igual que def hasta que haya mando. Las páginas de bandas.md no las releí en PDF.
