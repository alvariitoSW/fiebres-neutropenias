# 2026-10-30 · eco-reforma

**Resultado:** hecha (informe, no toca la app) · página para el móvil: https://claude.ai/artifact/BsV8RZpH6De3RcxhirNr7i · en el repo: `autonomo/maquetas/eco-reforma/index.html`
**Vueltas:** 1 de arreglos · **Jueces:** pruebas de las maquetas ✓ (390 y 360 px) · auditoría ✓ (1 grave corregido) · profesor M1 8,9 · M2 8,75 · M3 8,6 → arreglado

## Qué se hizo
- Ingeniería inversa de pulmonarypocus.com «Phone CP SIM» (`autonomo/ideas/ingenieria-inversa/pulmonarypocus.md`): laboratorio de Doppler color y espectral en canvas 2D, un archivo de 204 KB por la red, sin librerías; **separa el flujo (campo de velocidades) de la imagen**, que solo lo lee.
- Mapa del motor (`autonomo/maquetas/eco-reforma/mapa-motor.md`): quién usa `motor.mjs`, las 3 mezclas motor↔dibujo (volumen retocado por `suelo()`, TAPSE desde la geometría, e′ desde el atlas), cifras a fondo y signos de TEP e HP con página. 505 pruebas: 494 pasan, 11 pendientes, 0 fallan.
- Plan del profesor (`plan.md`): opciones A (dos motores con contrato, 20-26 M), B (pulir, 10-12 M), C (contrato primero ≈7 M + dibujo 11-17 M), three.js como sub-opción (+6-10 M, rompe CLAUDE §2), el contrato de 9 hilos y reglas de obra sin romper shock vivo, atlas ni los 69 enlaces `data-eco-*`.
- Tres maquetas vivas con el motor y el ecógrafo reales: M1 el corazón solo, M2 el cable, M3 TEP grave frente a HP crónica (5 signos con cifra, umbral y página).
- Revisión del encargo (Explore): 2 graves resueltos sin preguntar (fuente del TEP: Marino cap. 22 + ESC/ERS 2022; tope de gasto 5,5 M) y 9 menores al plan.

## Qué no se pudo hacer o leer
- pulmonarypocus.com y edwin1906-81.github.io estaban bloqueados por la red: el usuario los abrió (dos paradas). `/mmode-lab` y `/vexus-simulator` no se abrieron. Rendimiento en un móvil real, sin medir.
- Huecos sin fuente en `docs/`: MAPSE, torsión, techo de presión del VD agudo (la nota «~40/33» del código no tiene cita), LVEI en número.
- Sin rejuicio del profesor tras los arreglos (R8): eran exactamente sus 6 puntos; el director miró la captura de M3.

## Para el usuario
- **Elegir A, B o C, y si entra three.js** (la página lo explica; nada se da por elegido). Hasta entonces siguen aparcadas `eco-calibra-b`, `eco-sueltas` y `mv-eco`.
- Mirar en el móvil M3 con «HP crónica»: el sello rojo del VD/VI 0,72 es un fallo del motor de hoy, no de la fisiología.

## Visto de paso (no tocado)
- **HP crónica: VD/VI basal 0,72** al defecto (la guía espera >1,0); al 100 % 1,14. Va a quien arregle el motor (`eco-calibra-b` o la opción elegida).
- **E/e′ 1,8 en TEP defecto** pasa J1 porque esa celda es `diagnostico`: la prueba no lo para.
- El motor no calcula la VCI (el plan antiguo decía que sí).
- `autonomo/maquetas/*` y `bloques/eco-mega/herramientas/*` importan el motor: se romperán en cualquier obra.

## Propuestas sobre las reglas
- Al abrir una web para ingeniería inversa, probar también el dominio de su `<iframe>` antes de lanzar el agente (aquí costó una parada más al usuario).
- Las celdas `diagnostico` de J1 deberían fallar cuando la cifra queda fuera de **todos** los rangos de la guía (E/e′ 1,8).

## Vueltas
| Pieza | Vuelta | Nota mínima del profesor | Modelo | Pasos | Tokens eq. | Qué falló |
|---|---|---|---|---|---|---|
| M1+M2 | 1 | 8,75 (M2, texto con nombres de función) | sonnet | 21 | 454 k | jerga técnica, faltaba B/C |
| M3 | 1 | 8,6 (VD/VI 0,72 «normal» sin aviso) | sonnet | 14 | 229 k | sin sello en cifra mala |
| Arreglos | 2 | — (sin rejuicio) | sonnet | 8 | 98 k | banda E/e′ no literal (auditor) |

## Gasto
Total **3,5 M** (presupuesto 4,4 M; −20 %). Por papel: general-purpose sonnet 1,1 M (33 %) · director 1,0 M (30 %) · constructor sonnet 0,78 M (23 %) · profesor fable 0,27 M · Explore 0,12 M · auditor 0,11 M.
Los 3 que más: director 1,0 M · mapa del motor 0,67 M · inversa 0,47 M. La inversa gastó parte en un primer intento bloqueado por la red; probar los dominios del iframe antes lo habría ahorrado.

## Cuentas
Presupuesto 4,4 M (recortes: sin lector-fuente aparte, sin verificador ni revisor, un juicio rápido, maquetas en dos constructores baratos) · gastado 3,5 M · desvío −20 % (agentes con menos pasos de los previstos; constructores 0,78 M frente a 1,35 M). Tarea suelta (B-039), sin presupuesto de bloque.
