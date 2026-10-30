# 2026-10-30 · mv-papel-pulmon

## Qué se hizo
- Encargo (lo escribí yo; no había ficha) y revisión del encargo (Explore sonnet): 1 grave aplicado (la maqueta importa
  `js/core/monitor.js` y `dibujo-iso.js` en solo lectura; no están en `maquetas/comun/`) y el mapa pdf → página impresa.
- Informe `autonomo/bloques/b3/papel-pulmon.md` (profesor): cada mejora de VentLoop, Antaa y Techartist (marcadas «idea, no
  fuente») va a uno de los 4 encargos de `b3-pulmon-app` con su fuente y página, su tope, su caso, su juez y su coste; 10 pares
  de paciente posible; descartes. Auditor ciego: **0 graves**, 30 citas cotejadas; un signo corregido («negativa de 2 a 3 cmH₂O»).
- Maqueta `autonomo/maquetas/mv-papel-pulmon.html` (+ carpeta): 3 láminas (Entrada tórax → capilar con la Fig. 24.1 real;
  Histéresis con 4 unidades y PEEP; Asincronías en las curvas). Prueba propia en verde y Playwright a 390 y 360 px sin errores
  ni desborde. Vuelta 2: 4 frases sin cita quitadas o citadas, la ventana de las asincronías mostraba otro ciclo (fallo real,
  corregido) y dos rótulos pisados.
- Página para el móvil: https://claude.ai/artifact/GGXctiP2auygaBdG4JNJBU

## Qué no se pudo hacer o leer
- Sin profesor en modo juzgar (recorte de Hacienda): no hay nota de la maqueta. Por eso la PR queda en borrador (§4.15).
- Sin cita todavía: DOPE, «desconecta y espera 10-30 s», pico y meseta que suben juntos en el neumotórax a tensión.
- El auditor no leyó Marino caps. 22-26 pdf 88 entero ni El Libro Azul IV-2 pdf 39-41.

## Para el usuario
- **Coste**: lo que entra suma ≈18,4 M, por encima de la horquilla 12-18 M de `b3-pulmon-app`; con 2 recortes (neumotórax sobre
  el corazón del encargo 3, lámina a 3 niveles) ≈17,8 M. Lo «si sobra» (≈1,05 M) lo decides en la parada 2 del 3D.
- La maqueta es «para elegir»: mírala en el móvil si quieres; entra con el pulmón.

## Visto de paso (no tocado)
- `cobertura-3d.md` cita 4 páginas con desfase de 1 (disparo por presión M27 pdf 8, no 7; flujo pdf 9; meseta ≤30 pdf 4, no 5;
  atelectrauma M22 pdf 48, no 47). Comprobado por el auditor. Lo arregla `b3-pulmon-app` al construir.
- Erratas de El Libro Azul (nota de fidelidad): «convexa» en los dos casos del índice de estrés (IV-2 p. 551); «0,6 µm de
  diámetro» para el grosor de la membrana (IV-1 p. 390).

## Propuestas sobre las reglas
- Un informe «en papel» con maqueta, de 2 M, no cabe con profesor juez + vuelta de arreglos: presupuestar 2,5 M o que la maqueta
  la juzgue el mismo profesor que la diseñó en ≤10 pasos.

## Vueltas
| Pieza | Vueltas | Por qué |
|---|---|---|
| Informe | 1 | auditor sin graves; 1 menor arreglado por el director |
| Maqueta | 2 | frases sin cita, ventana de asincronías, rótulos (visto por el director en capturas) |

## Gasto
Total **2,5 M** (presupuesto 1,93; tope ≈2 M): **+29 %**, y no comparecí antes de la vuelta 2 (debí hacerlo).
| Papel · modelo | Lanzados | M | % |
|---|---|---|---|
| constructor · sonnet | 2 | 1,14 | 46 % |
| profesor · opus | 1 | 0,75 | 31 % |
| director · opus | 1 | 0,34 | 14 % |
| Explore · sonnet | 1 | 0,11 | 5 % |
| auditor-ciego · sonnet | 1 | 0,11 | 5 % |
Los 3 que más: constructor de la maqueta 0,97 M (presupuesto 0,6: 3 láminas con motor propio y arnés; la próxima, ≤2 láminas
o 70 pasos de presupuesto); profesor 0,75 M (presupuesto 0,55: leyó 5 PDF por tramos); director 0,34 M.

## Cuentas
Presupuesto 1,93 M · recortes: sin verificador, sin profesor juez, sin revisor · gastado 2,5 M · desvío +29 % (la maqueta y
la vuelta 2) · carril 2: Hacienda por delegación (≈25-40 M), quedan ≈22-37 M.
