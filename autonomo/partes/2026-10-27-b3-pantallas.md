# 2026-10-27 · b3 (pantallas como las reales: respirador y consola del balón)

**Resultado:** en revisión (el usuario mira) · PR en borrador https://github.com/alvariitoSW/fiebres-neutropenias/pull/32
**Vueltas:** 3 por pantalla (construir, arreglos del juicio, arreglos finales) · **Notas del profesor:** respirador 8,4 → 8,7 · balón 8,0 → 8,7 (todos los apartados ≥8,75 salvo §1.14 del respirador 8,5, ya arreglado en la vuelta final, y §8 G4-G6 del balón 8, rehechas tras la auditoría) · **Jueces:** `chk.cjs` 0 desborde y 0 errores a 390/360 en las cuatro maquetas · `respirador-prueba`, `pulmon-prueba`, `limites-prueba pulmon/shock`, `shock-prueba`, `balon-prueba` 0 fallos a 390/360 · auditoría: 2 graves (G5 y G6 del balón), corregidos · `jueces.mjs` no aplica (maquetas, no la app)

## Qué se hizo
- Plan del profesor (Fable): `autonomo/bloques/b3/plan-pantallas.md`.
- **Respirador** (pieza común nueva `autonomo/maquetas/comun/respirador.js`, adaptador `b3-pulmon/pantalla.js`): fondo claro, barra con modo, Tubo, alarmas (la más grave + «+N»), curvas Paw/Flujo/Volumen rellenas con línea de Pmáx, 12 casillas con límites y origen, mandos redondos con deslizador, pestañas de modo (VC-AC y PC-AC vivas; el resto «no en este modelo»), teclas «Insp. mantenida» (EIP/meseta), «Esp. mantenida» (PEEP total y oculta), Congelar, Detener ventilación. mbar con nota «≈ cmH₂O». El pulmón queda como lupa. Topes nuevos: Pmáx 20-50, Ti ≥0,2 s y flujo ≤ tope según VT (ilustrativos).
- **Consola del balón** (`b3-shock/consola-balon.js`; `soporte.mjs` con razón 1:1/1:2/1:3): pantalla oscura con ECG, presión arterial y presión del balón, marcas de inflado/desinflado, letras A/n, aumento frente a sistólica propia, telediastólica asistida vs no asistida, panel táctil (lo que no tiene fuente, apagado). Estado guiado 1:2 de 4 pasos y 3 «Piensa» (G6 como «piensa y destapa»).
- Arreglados los dos fallos del dock del parte anterior (Guía al primer toque; «Siguiente/Hecho» dentro a 360).

## Qué no se pudo hacer o leer
- **Errores de temporización del balón** (inflar o desinflar pronto o tarde): ninguna fuente de `docs/` los trae (Marino cap. 16, ESC SCA 2023, ESC IC 2026, Libro Azul). Hueco: la temporización queda apagada «sin fuente en la app».
- La telediastólica asistida baja poco en el modelo (53 frente a 55): física del motor, rotulado «baja poco en este modelo»; no se inventó succión.
- Modos espontáneos (SIMV, CPAP/PS), FiO₂ y casillas espontáneas: interfaz sin modelo (vacías o «no en este modelo»). FR alta sin tope: la ficha no da uno.

## Para el usuario
1) Mira las dos pantallas en el móvil (enlaces abajo) y di si se parecen lo bastante a las de tu UCI o qué cambiarías. 2) ¿Te sirve el hueco de la temporización del balón o quieres mandar una fuente (PDF) que traiga los errores de inflado/desinflado? 3) Siguen pendientes las preguntas del parte anterior (¿shock, ritmo y receptor a la app?; deslizador del receptor en el sello; esquema del pulmón).
- Respirador: https://raw.githack.com/alvariitoSW/fiebres-neutropenias/auto/b3/autonomo/maquetas/b3-pulmon.html
- Balón: https://raw.githack.com/alvariitoSW/fiebres-neutropenias/auto/b3/autonomo/maquetas/b3-shock.html (paciente Aurelio → aparato «balón»)

## Visto de paso (no tocado)
- `comun/monitor.js` (`llenar`) emite una R doble al rellenar la pantalla: la consola la filtra; arreglarlo en el monitor.
- `may-prueba.mjs b3-shock` se atasca en la primera pregunta (también antes de esta sesión): arnés desfasado.
- VC: subir la PEEP de 0 a 20 de golpe da VTe 100 unos 35 s (el motor no lleva el pulmón a la PEEP en la espiración, `pulmon.mjs`).
- Shock: la PVC limitada a PCP − 1 en `soporte.mjs` `cerrar()` sigue (recorte, no causa).
- `pagina.js` del shock en 697 líneas: lo próximo que entre, en otro archivo.

## Propuestas sobre las reglas
- **Toda frase de mecanismo en un «Piensa» lleva su origen**, también en explicaciones y distractores (`ficha p. N`, `fisiología general` o `modelo`): los dos graves de la auditoría eran eso (un distractor que contradecía la fuente y un mecanismo sin rótulo). A la lista del constructor.
- **Los arneses de prueba matan su servidor por número de proceso**, nunca `pgrep -f`/`pkill -f` (un constructor se mató su propia orden). Ya está en REGLAS §4.6 para `pkill`; extenderlo a `pgrep -f … | xargs kill`.

## Gasto
`gasto.mjs --clave b3` (esta sesión): **5,5 M equivalentes** (la vuelta de límites: 18,6 M).

| Papel · modelo | Lanzados | Equivalente | % | Media |
|---|---|---|---|---|
| constructor · sonnet | 4 | 2,2 M | 40 % | 544 k |
| constructor · opus | 1 | 1,3 M | 24 % | 1,3 M |
| profesor · fable | 5 | 1,0 M | 18 % | 201 k |
| director · opus | 1 | 0,78 M | 14 % | 0,78 M |
| auditor · sonnet | 2 | 0,22 M | 4 % | 112 k |

Más caros: constructor respirador (opus, 1,3 M, 55 pasos: presupuesto 70 / 1,5 M, dentro), constructor consola (sonnet, 0,97 M, 55 pasos: presupuesto 50 / 0,9 M, algo por encima: pruebas largas de >2 min), arreglos consola (0,81 M, 55 pasos frente a 40 / 0,8 M: medir la física del motor y el estado guiado nuevo; el encargo tenía 7 arreglos y una pieza de estudio, partirlo).
Director 0,78 M: por primera vez dentro del presupuesto de una parada (0,9 M).
**Ahorro para la próxima vez:** los profesores de juicio rápido salen a ~0,2 M y los rejuicios a ~0,17 M: bajar presupuesto. Un auditor de frases después de cada tanda de «Piensa» es barato (74 k) y caza graves: mantenerlo.
**Presupuestos nuevos (90 %):** profesor plan corto de dos pantallas · fable 10 / 0,2 M · profesor juicio rápido · fable 15 / 0,25 M · rejuicio · fable 13 / 0,16 M · constructor primera pieza común de interfaz · opus 55 / 1,2 M · constructor pantalla que copia un patrón · sonnet 50 / 0,9 M · arreglos con pieza de estudio · sonnet 50 / 0,75 M · arreglos cortos · sonnet 18 / 0,2 M · auditor de frases · sonnet 15 / 0,12 M · director, una parada 0,8 M
