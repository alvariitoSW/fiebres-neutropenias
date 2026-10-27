# 2026-10-27 · eco-calibra

**Resultado:** hecha (informe; directo a `main`, sin PR, Objetivo P) · informe: https://claude.ai/artifact/SFfwNewLsWiwuRPxSRXCpw
**Vueltas:** 1 · **Jueces:** no aplica (no toca la app) · móvil: página a una columna con tablas en `overflow-x`

## Qué se hizo
Informe de B-027 + B-029 sin tocar el motor. Un lector (sonnet) sacó las cifras objetivo de Nagueh 2025, Lang 2015,
Mukherjee 2025 y ESC/ERS 2022 con su página (desplazamientos comprobados) y un medidor (sonnet) tabuló el motor actual
en las 9 formas a 0, defecto y 100 %. Revisión del encargo: hecha por el director sin agente (informe barato, no toca
la app). Copia de la página en `autonomo/bloques/eco-mega/calibra-informe.html`; herramienta de medida reutilizable en
`autonomo/bloques/eco-mega/herramientas/calibra-tabla.mjs` (`node …/calibra-tabla.mjs`).

Diagnóstico: cinco piezas del motor. (1) la AI no suma su contracción a la pasiva (hipertrofia E/A 10,2, bomba 1 %;
la AD igual); (2) freno de las venas pulmonares flojo (reflujo ~500 mL/s, flujo ×2-3); (3) **e′ fijo en todas las
formas** (relajación = 1; E/e′ no enseña nada; hallazgo nuevo); (4) HP crónica a fondo: VD 330 mL, justo el tope del
dibujo, VD/VI 5,4, FE VD 10 %; (5) a fondo E = 0 (TEP def E/A 0,09; hemorragia y derrame al 100 %). El aviso de
recorte del dibujo salta sobre todo **por abajo** (VD <45 mL, AI <15 mL) en 7 formas.

Opciones: A completa ≈5,5 M en 2 sesiones (recomendada) · B media ≈3,0 M · C mínima (jueces + HP crónica) ≈1,6 M.

## Qué no se pudo hacer o leer
Sin cifra en las fuentes de `docs/`: DT mitral normal, S/D y Ar normales de la vena pulmonar, onda a de la AI en mmHg,
bomba y onda a de la AD, tamaño máximo del VD, índice de excentricidad numérico en HP grave, McConnell y 60/60, E/A en
TEP, hemorragia y derrame. Mukherjee y ESC/ERS parte 2 se leyeron por búsqueda, no enteros.

## Para el usuario
1. Elegir A, B o C. 2. La hipertrofia: ¿grado I (bajar la PCP) o grado II (PCP 24, E/A 0,8-2, E/e′ ≥14), o el mando
de I a II? La construcción es otra tarea.

## Visto de paso (no tocado)
Discrepancias de fuente a reflejar al construir: LVEI anormal >1 (Mukherjee p.149) frente a >1,1 (p.173 y ESC p.3645);
DT de relajación alterada distinta entre las Tablas 1 y 6 de Mukherjee. Vasoplejia con bomba AI 91 % y E/A 0,47 a FC
107 (fusión E-A): mirar en la opción A.

## Propuestas sobre las reglas
Ninguna nueva; las dos propuestas de juez ya estaban en B-027/B-029 y van en el informe.

## Vueltas
| Pieza | Vuelta | Nota | Modelo | Pasos | Tokens eq. | Qué falló |
|---|---|---|---|---|---|---|
| lector de cifras | 1 | — | sonnet | 22 | 253 k | — |
| medidor del motor | 1 | — | sonnet | 15 | 297 k | — |

## Gasto
Total **660 k** (presupuesto implícito ~1,3 M). Medidor 297 k (45 %), lector 253 k (38 %), director ~111 k (17 %,
aproximado). Barata porque el director no leyó PDF ni código y reutilizó la herramienta F3b.
