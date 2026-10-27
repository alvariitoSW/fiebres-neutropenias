# Bloque 3 · Plan del paso 4 (Estudiar en las fichas que faltan)

Escrito por el director el 27/10/2026, **sin construir** (el usuario lo pidió así: el día ya iba por encima del aviso de
gasto). Lo usa la sesión que empiece cada grupo (`/plan-socialista b3`).

## Dónde estamos

- **Hecho**: 3A · el shock, 9 fichas (`js/data/mayeutica/b3a-shock.js`, montado desde `js/data/mayeutica/b3.js`).
- **Modelos ya en la app** (parada 2, PR #35): `shock-vivo` (cabecera, cardiogénico, taponamiento, TEP alto e
  intermedio, balón, Impella, ECMO y venteo), `ritmo-vivo` (sinusal, taquicardia sinusal, nodal, flutter, FA, TAM,
  WPW, TV, aberrancia, torsade, FV, AESP, asistolia, RCE, STEMI…), `receptor-vivo`.
- **Faltan 17 fichas**: 3B · la bomba que falla (10) y 3C · el ritmo y la parada (7). Las 21 del pulmón con
  respirador (3D) no entran en este paso: tienen su cobertura propia (`cobertura-3d.md`) y van después.

## Antes del primer grupo

- **Partir `b3a-shock.js`** (1 688 líneas; el tope es 700, REGLAS §4.7) en tres archivos por capítulo, sin cambiar
  nada de su contenido. Constructor sonnet, arreglo corto: 18 pasos / 0,25 M. Prueba: `jueces --ficha` de 2 fichas 3A.

## Grupos (uno por sesión; en este orden)

Primero el 3C, porque su modelo ya está entero; el 3B necesita antes piezas nuevas del motor.

| # | Grupo | Fichas | Modelo y estados (cobertura §6) | ¿Falta pieza? | Datos |
|---|---|---|---|---|---|
| 1 | 3C · taquiarritmias | `mc-taqui-reconocimiento`, `mc-fa-frecuencia`, `mc-fa-cardioversion`, `mc-otras-taqui` | `ritmo-vivo`: sinusal, taquiSinusal, nodal, flutter, tam, fa, wpw, tv, aberrancia, torsade | Comprobar maniobras `vagal`, `adenosina`, `cardioversion` y la FA con fármaco (Fig. 19.5); si no están, se construyen primero (encargo aparte) | `b3c-taqui.js` |
| 2 | 3C · la parada | `mc-paro-soporte`, `mc-paro-monitorizacion`, `mc-posresucitacion` | `ritmo-vivo`: fv, aesp, asistolia, rce; capilar `capno-rcp` (ya existe); `shock-vivo` `tapon` | Comprobar RCP con ETCO₂ (Fig. 21.4) y adrenalina; si no, pieza antes | `b3c-paro.js` |
| 3 | 3B · cardiogénico y soporte | `mc-cardiogenico-fisio`, `mc-cardiogenico-farmaco`, `mc-soporte-mecanico` | `shock-vivo`: cardio, cardio-pcp-baja/optima, tapon, balon, impella, ecmo, ecmo-venteo; `receptor-vivo` (dobutamina, milrinona, levosimendán) | **Sí**: rotura del papilar (M7, decisión del usuario del 25/10: IM aguda con `eroaMitral` y chorro en color, más un caso corto propio, paciente distinto de Aurelio), rotura del septo (VI → VD) | `b3b-cardiogenico.js` |
| 4 | 3B · insuficiencia cardiaca | `mc-ic-tipos`, `mc-ic-manejo` | Circulación viva `hipertrofia`, `dilatada`, `tep`; `shock-vivo` `sobrecarga`; nefrona viva `furosemida` | **Sí**: `ic-etapa-1/2/3` y la CPAP como presión intratorácica (M8, una sola vez: la usará también el respirador del 3D); glomérulo `congestion` | `b3b-ic.js` |
| 5 | 3B · SCA y disección | `mc-sca-diagnostico`, `mc-sca-tratamiento`, `mc-diseccion-aortica` | `ritmo-vivo` `stemi`; `shock-vivo` (disección: nicardipino frente a esmolol primero) | **Sí**: vaso que sangra con la **placa** (Fig. 20.1 viva), `placa-antiagregantes`, `trombolisis`; estado `diseccion` | `b3b-sca.js` |
| 6 | 3B · TEP | `neumo-ep-diagnostico`, `neumo-ep-manejo` | `shock-vivo`: tep-intermedio, tep-alto, tep-bolo | **Sí** (pequeña): vaso `tep-lisis`; telar `tvp` con lupa de eco de compresión | `b3b-tep.js` (montado desde Neumología) |

Cada archivo nuevo, ≤700 líneas, una línea en `js/data/mayeutica/b3.js`. Formato: el de `b1-fluidos.js`; modelo
de cómo quedó en el bloque: `b3a-shock.js`.

## Cada grupo, paso a paso

1. **Pieza que falta** (si la hay): constructor sonnet, un encargo por pieza (≤60 pasos), con su prueba en el arnés
   del modelo (`jueces --modelo`). Cifra mala del motor → para e informa (REGLAS §1.11). Nada de opus: son estados
   nuevos de modelos que ya existen.
2. **Profesor, plan corto** (fable, 10 pasos / 0,2 M): la ruta del grupo con los criterios clínicos escritos con su
   fuente y página **antes** de construir (R3), y qué cifra sale en cada paso y en cada caso. Base: la tabla de la
   cobertura §6.B o §6.C y los casos de §7 (pacientes de §9; no repetir los del bloque).
3. **Constructor, Estudiar** (sonnet, presupuesto «Mayéutica de un modelo desde su maqueta»: 50 pasos / 1,2 M):
   Mira → Juega → Piensa → Examínate → Caso y «Para profundizar»; citas también en explicaciones y distractores
   (REGLAS §1.11); `--ficha` de cada ficha del grupo verde a 390 y 360 px antes de entregar (R1).
4. **Auditor** (sonnet, 25 pasos / 0,3 M): solo las frases nuevas, frente al PDF de Marino y su página.
5. **Profesor, juicio** (fable, 15 pasos / 0,7 M): meta 8 (8,75 solo obliga en modelos nuevos y archivos modelo, R7).
   Arreglos con un constructor sonnet nuevo y la lista exacta (R5, 35 pasos / 0,4 M).
6. Commit y push en `auto/b3` (la PR del bloque se abre en la parada 3, no antes).

## Fuentes (páginas en la cobertura §6)

- 3B y 3C: `docs/marino-2024-shock-caps14-17.pdf` (cap. 16) y `docs/marino-2024-cardiac-disorders-caps18-21.pdf`
  (caps. 18-21). TEP: `docs/marino-2024-respiratory-management-caps22-26.pdf` (cap. 22).
- Huecos que siguen sin fuente (tarea `fuentes-b3`): PDF de ESC 2019 TSV, AHA 2020/ERC 2021 SVA, ESC 2023
  miocardiopatías y SCAI 2015. Para el grupo 2 ya está en `docs/` `aha-2025-parte9-soporte-vital-avanzado.pdf`
  (página impresa S = PDF + 537): usarla solo como enlace cruzado o nota de fuentes, nunca mezclada con Marino.

## Gasto previsto

Por grupo sin pieza: ~2,5 M (constructor 1,2 + auditor 0,3 + profesor 0,9 + arreglos 0,4) + director ~0,8 M.
Con pieza: +1-1,5 M por pieza. Total del paso 4: **≈ 22-26 M en 6-7 sesiones**, repartidas en varios días para no
pasar del aviso de ~15 M al día. Después, paso 5 (parada 3): jueces, auditor y profesor del bloque entero y la PR.
