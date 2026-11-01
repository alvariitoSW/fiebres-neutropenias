# M1 · vuelta 2 (constructor, wt/mv6-m1) · PARCIAL: forma lograda, quedan 3 pruebas rojas
Ventana = chorro de IT (racha más larga con pVD>pAD). Herramienta: `herramientas/m1-chorro.mjs` (6 escenarios; ajustes opcionales por JSON).
Cambio: motor.mjs `fSubidaVd/qSubidaVd` (null = la del VI; sin efecto en el normal) y `eVd` con ellos; escenarios.mjs: HP (`hpcronicaRecorrido`: fSubidaVd 0,55→0,47, durVd ×1,03, Ees ×1,08, interpolado en g/0,6) y TEP (`tepVd(u)`: fSubidaVd, durVd ×1,3-1,4, Ees ×1,05 en g≈0,5). `domo-septo.test.mjs`: 5 pruebas `todo` → ventana del chorro, +TEP 0,5, sin `todo` (12/12 verdes).
| caso | antes pico/r25/r75 | después | vIT antes→después | PSAP | FEVD | TAPSE | TA pulm |
|---|---|---|---|---|---|---|---|
| normal | 33/0,64/0,77 | igual (no se toca) | 2,07 | 22 | 52,8 | 22,9 | 145 |
| HP 0,6 | 69/0,34/0,97 | 61/0,39/0,83 | 4,80→4,89 | 101→105 | 32,1→31,4 | 14,0→13,9 | 73→67 |
| HP 0,8 | 68/0,32/0,97 | 61/0,35/0,84 | 4,81→4,91 | 106→110 | 22,9→22,5 | 12,0→11,9 | 69→65 |
| HP 1 | 70/0,31/0,97 | 62/0,32/0,84 | 4,42→4,53 | 95→99 | 14,1→14,1 | 9,1→9,1 | 63→61 |
| TEP 0,5 | 76/0,26/1,00 | 62/0,56/0,81 | 2,78→2,77 | 43→43 | 23,7→24,8 | 12,2→12,5 | 104→87 |
| TEP 1 | 60/0,38/0,27 | 61/0,37/0,65 | 2,71→2,72 | 43→43 | 9,0→9,2 | 6,5→6,6 | 88→86 |
Con la ventana del chorro (y no la sístole del VI) el normal ya cumplía (33 %, r25 0,64, r75 0,77): FEVD y TAPSE intactos. Hacía falta subida más temprana del VD solo en HP/TEP.
Para dar el pico antes hay que acortar la subida; eso baja FEVD/GC/PAPd, y se recompensa con durVd (poco: >1,04 hace saltar la E/e′ de la HP g=1 de 6,5 a 10) y Ees (sube la PSAP).
## Pendiente (pruebas aún rojas con estos parámetros)
1. `maniobras.test` 7 · HP: PSAP 112,5 > tope 112 con bolos de 1.500 mL + EPP. Sin subir el Ees (×1,0) da 112,0-111,6: no hay hueco con FEVD ≥ -5 %. Hace falta otro grado de libertad (qSubidaVd, lPul/kEyecVd) o decisión del director sobre el tope.
2. `e-prima.test` TEP g=0,95: `medirForma` da E=0 (el Doppler mitral de hoy es biestable entre g 0,94 y 0,96: ya lo era en la partida, entre 0,94 y 0,95; ahora cae justo en 0,95). Mover la transición con un pequeño ajuste de TEP (p. ej. Ees ×1,03 en g≥0,9) y comprobarlo con `medirForma`.
3. `instantanea-dibujo.test`: el dibujo de HP/TEP cambia (era de esperar); regenerar con `--congelar` solo con el visto bueno del director. NO regenerada.
4. «tiempo <60 s»: no es de este cambio.
Sin pasar aún: `jueces --modelo shock-vivo` NO ejecutado.
Contrato/tabla (`contrato.test`), `escenarios.test` (TEP def = escenario de siempre, Ees ×1,00 en g≥0,69), `doppler-it`, `domo-septo`: verdes en la última tanda.
HP g=0,6 con más vIT que g=1 sigue (4,89 vs 4,53): `hpcronicaRecorrido`, no tocado.
Visto de paso: TEP/HP con g<0,4 (fuera del encargo) tienen el pico en 30 %/70 %.
## No comprobado / riesgo
Suite completa tras el último ajuste (solo las pruebas arriba citadas); shock-vivo; capturas del dibujo. La E/e′ de la HP es frágil (salta con durVd ≥1,05).
