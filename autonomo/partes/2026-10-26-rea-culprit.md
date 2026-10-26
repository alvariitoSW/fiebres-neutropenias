# Parte · 2026-10-26 · rea-culprit (B-026)

- **Encargo**: `/ingenieria-reversa` de https://www.cliffreid.com/culprit/#explore, pedido por el usuario el 26/10.
- **Red**: primero, `cliffreid.com` pasaba y `www.cliffreid.com` daba 403. El usuario lo arregló y la web abrió (200,
  414 kB). cdnjs sigue bloqueado: three.js r128 (MIT, idéntico) se sirvió desde el registro de npm solo para que la
  página arrancara en Playwright; no se guardó nada de la web.
- **Hecho**: recorrido a 390×844 de las 5 pestañas y 8 escenarios; lectura en memoria de trozos de su programa;
  2 capturas para el informe. Informe técnico en `autonomo/ideas/ingenieria-inversa/culprit.md` (con 9 pares de
  prueba y la lista de piezas). Informe-propuesta «Arteria culpable»: https://claude.ai/artifact/Y6ewAZfAk5cPewnsnNcsAw
- **Actualizado**: ficha de triaje en `autonomo/radar/ENTRADAS.md`; B-026 pasa a «Esperando algo tuyo» en la
  bitácora; fila `rea-culprit` en el tablero (⏸ fase 1).
- **Espera del usuario**: qué entra (A ficha, B preguntas, C modelo vivo 2D, D caso con reloj) y en qué fase; PDF de
  la ESC 2023 de SCA y de ECG de la rotación. Marino sigue primero.
- **No tocado**: la app (sin cambio de versión ni jueces: solo documentos).
