# P3 · P5a — AI dilatada medible e IM funcional (forma «Dilatada»)

**Qué cambia** (`escenarios.mjs`, `ecografia.mjs`, `formas.mjs`, `corazon-geo.mjs` solo la mitral, `guyton-tablas.mjs` regenerado, prueba en `enfermedad.test.mjs`).
- Dilatada: `eroaMitral` = 0,25 × dilatación del VI (v0 60 frente a 10 mL, /50), tope 0,35 cm²; `ai.v0` +20 mL × dilatación (AI remodelada). Defecto: IM moderada.
- `medidasCorazon` gana `volAI` (mL/m², máximo del latido ÷ `sc` del motor, 1,85 m²), `eroa` (cm²) y `volReg` (mL/latido). Los pasa `extraDeMotor` (`vaiMax`, `eroaMitral`, `vRegMitral`).
- Dos criterios nuevos en `CRITERIOS_FORMA.dilatada`: AI >34 mL/m² y EROA ≥0,20 cm² (al menos moderada), con nota y enlace al PDF.
- Tenting: `estado.tenting` (0-1, = EROA/0,35) baja 8 mm (ilustrativo) la línea de coaptación mitral con la válvula cerrada. Saco y pliegue de AD/VD sin tocar. El chorro de color, en P5b.

| Constante (asentado 40 s) | Normal | Dilatada (defecto) |
|---|---|---|
| Volumen máx. AI (mL/m²) | 26,8 | 43,8 (AI 81 mL) |
| EROA mitral (cm²) / vol. regurgitante (mL) | 0 / 0 | 0,25 / 36 (moderada) |
| PA (PAS/PAD/PAM) · FC | 106/67/86 · 69 | 93/69/81 · 84 |
| PVC · PCP · PAPs · GC | 4,3 · 7,5 · 22 · 5,0 | 9,3 · 26,7 · 41 · 3,8 |
| VI diástole (mm) · FEVI | 53 · 60 % | 66 · 21 % |

La dilatada **no tiene mando de gravedad (g)**: g 0 es el normal y el defecto es la única forma; no inventé un mando. Antes de P5a la dilatada daba PCP 23, AI 59 mL (31,9 mL/m², no pasaba de 34).

**Causa de la AI pequeña:** sin IM la AI de la dilatada solo subía por presión de llenado (pico 29 mmHg). Corregido en el origen: el reflujo entra en la AI (ya lo hacía el motor) y se remodela (`ai.v0`); no se recortó ninguna cifra.

**Frases nuevas (con fuente)**
- «Límite superior normal del volumen de la AI indexado: 34 mL/m² (antes 28), en telesístole, por discos» — Lang 2015 pp. 25 y 28.
- «EROA leve <0,20; moderada 0,20-0,39; grave ≥0,40 cm²; vol. regurgitante moderado 30-59, grave ≥60 mL» — Zoghbi 2017 Tabla 8, p. 332 (PDF 30).
- «En la secundaria, un corte de 0,30 cm² puede ser ya grave por PISA 2D» — Zoghbi p. 334 (PDF 32).
- Nota de fidelidad: «≥0,2 cm² empeora el pronóstico, pero Zoghbi NO redefine con él la IM grave secundaria» — Zoghbi p. 334.
- «Velos sanos; la dilatación del VI desplaza los papilares y tira de ambos velos hacia el ápex; el anillo dilatado deja más área que cubrir» — Zoghbi pp. 320-321. Tenting en mm: ilustrativo (Zoghbi no da cifras, p. 321).
- «Normal del modelo ~27 mL/m²» — cifra del propio modelo (ilustrativo).
- El enlace de los criterios va a Atlas 10 (AI >34) y Atlas 8 (regurgitación, cita a Zoghbi).

**Pruebas:** `enfermedad.test.mjs` 14/14 (par normal/dilatada: AI 26,8 <34 frente a 43,8 >34; EROA 0 frente a 0,25 y 36 mL; coaptación >5 mm más baja; constantes posibles). Suite entera: 438 pruebas, 426 ✅, 11 `todo`/`hueco` previos y 1 ❌ (papilares de la dilatada 0,92 frente a 0,9: la FE anterógrada baja a 21 % con la IM; tope de esa prueba 0,93 solo para la dilatada, a la vista del director). Ese archivo y `enfermedad` repetidos tras el arreglo: 151 ✅, 0 ❌. `guyton-tablas.mjs` regenerado (solo la fila dilatada).
**Capturas** (`/tmp/plan-socialista/eco-mega/capturas/`): `p5-dilatada-a4c-sis4.png` (valvas en tienda hacia el ápex, AI grande), `p5-normal-a4c-sis2.png`, `p5-dilatada-criterios.png` (lista a 390 px, sin desborde ni errores).

**No comprobado / riesgo:** PCP 26,7 es alto (edema inminente) y sube 3,7 respecto a antes; sin tope de fuente. La profundidad de tenting (8 mm) y la v0 de la AI son ilustrativas; el normal ya queda ~5 mm bajo el anillo por el abombamiento previo de las valvas. No contrasté el tenting con una eco real. Sin `?v=` ni push.
