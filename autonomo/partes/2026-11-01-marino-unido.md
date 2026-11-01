# 2026-11-01 · marino-unido (B-048)

**Resultado:** hecha · técnica/mejora, directo a `main` con los jueces en verde (sin PR)
**Qué se hizo:** portada de Marino (Libros → The ICU Book). Índice: dos tarjetas nuevas en su orden, «Corazón y shock» (caps. 14-21, 24 fichas, en Cardiología) y «Pulmón y respirador» (caps. 22-30, 23 fichas, en Neumología), enlace cruzado a Merino Cardiología y Merino Neumología, como «Sangre y hemostasia»; las fichas no se mueven. Cuentan fichas, progreso y modelos vivos, y ponen la tira «Modelos vivos de este bloque» arriba de cada cuaderno. Modelos vivos: 6 grupos por tema (accesos y cuidados · oxígeno, fluidos y agua · sangre y coagulación · corazón y shock · pulmón y respirador · riñón, ácido-base e iones), mismos botones e ids. Versión 20261101-8.
**Encargo:** revisado por el director sin agente (pieza pequeña, 3 archivos: `marino-portada.html`, `libros/index.js`, `components.css`). `PANEL_NAV` ya tenía los dos cuadernos: no hizo falta tocarlo. No comparte archivos con el pulmón ni con la eco.
**Jueces:** suite entera ✓ · prueba propia a 390 y 360 px ✓ (sin desborde ni errores; las dos tarjetas abren su cuaderno y la tira abre el shock vivo).

| Vueltas | 1 (sin arreglos) |
|---|---|
| **Gasto** | solo el director, sin agentes; ≈0,4 M estimado |
| **Cuentas** | presupuesto ≈0,8-1,5 M · gastado ≈0,4 M · desvío −50 % (no hizo falta constructor) |

**Para el usuario:** mira Libros → The ICU Book: Índice (las dos tarjetas nuevas) y Modelos vivos (los grupos). Los nombres de grupo los puse yo («supongo» en la tarea): dime si quieres otros.
