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
  nada de su contenido. Constructor sonnet, arreglo corto: 18 pasos / 0,25 M. Prueba: `jueces --ficha` de las 9 fichas 3A (cambian los `import`).

## Grupos (uno por sesión; en este orden)

Primero el 3C, porque su modelo ya está entero; el 3B necesita antes piezas nuevas del motor.

| # | Grupo | Fichas | Modelo y estados que ya existen (clave real) | Piezas que faltan (un encargo por fenómeno) | Datos |
|---|---|---|---|---|---|
| 1 | 3C · taquiarritmias | `mc-taqui-reconocimiento`, `mc-fa-frecuencia`, `mc-fa-cardioversion`, `mc-otras-taqui` | `ritmo-vivo`: `sinusal`, `taquiSinusal`, `nodal`, `flutter`, `tam`, `fa`, `faF` (FA con fármaco), `wpw`, `tv`, `aberrancia`, `torsade`, `rama`; guiado `adenosina`; mando `#rtv-desfib` (cardioversión) | 1a · maniobra **vagal** (hoy solo texto y cita `C.vagal`) · 1b · **FA en el motor** (M9: sin patada auricular, RR irregular, déficit de pulso, con `hipertrofia`; Fig. 19.4 real al lado) · 1c · lupa de la cascada con **warfarina** (vaso; ya existe el estado `warfarina`: comprobar si basta) | `b3c-taqui-1.js` (15-16) y `b3c-taqui-2.js` (17-18): 4 fichas + casos C2 y C3 no caben en 700 líneas |
| 2 | 3C · la parada | `mc-paro-soporte`, `mc-paro-monitorizacion`, `mc-posresucitacion` | `ritmo-vivo`: `fv`, `aesp`, `asistolia`, `rce`, `rcp` (con ETCO₂); capilar `capno-rcp`; `shock-vivo` `tapon` | 2a · RCP con **adrenalina** y con **insuflaciones** (cobertura `rcp-adrenalina`, `rcp-insuflaciones`) · 2b · cabecera **`posparo`** (shock-vivo) · 2c · capilar, lupa del neutrófilo **`reperfusion`** | `b3c-paro.js` |
| 3 | 3B · cardiogénico y soporte | `mc-cardiogenico-fisio`, `mc-cardiogenico-farmaco`, `mc-soporte-mecanico` | `shock-vivo`: `cardio`, `cardio-pcp-baja`, `cardio-pcp-optima`, `tapon`, `balon`, `balon-1a2`, `impella*`, `ecmo*`, `ecmo-venteo`; `receptor-vivo` (dobutamina, milrinona, levosimendán) | 3a · **rotura del papilar** (M7; decisión del 25/10: IM aguda con `eroaMitral` y chorro en color, un caso corto propio con paciente distinto de Aurelio; hoy solo hay un parche `eroaMitral 0.8` en la hora 18 del caso de Aurelio) · 3b · **rotura del septo** (cortocircuito VI → VD) · 3c · **`iam-vd`** · (la rotura de pared libre = `tapon`, ya está) | `b3b-cardiogenico.js` |
| 4 | 3B · insuficiencia cardiaca | `mc-ic-tipos`, `mc-ic-manejo` | Circulación viva (`js/modules/eco/escenarios.mjs`): `hipertrofia`, `dilatada`, `tep`; `shock-vivo` `sobrecarga`; nefrona viva `furosemida` | 4a · **`ic-etapa-1/2/3`** · 4b · **CPAP como presión intratorácica** (M8, una sola vez: la usará el respirador del 3D) · 4c · glomérulo **`congestion`** | `b3b-ic.js` |
| 5 | 3B · SCA y disección | `mc-sca-diagnostico`, `mc-sca-tratamiento`, `mc-diseccion-aortica` | `ritmo-vivo` `stemi` | 5a · vaso con la **placa** (Fig. 20.1 viva; anatomía nueva: **primer modelo de algo nuevo → opus** en su primera vuelta, R6, con captura al lado de la figura real, R4) · 5b · `placa-antiagregantes` · 5c · `trombolisis` · 5d · cabecera **`diseccion`** (nicardipino solo frente a esmolol primero; hoy solo la cita `disec`, p. 50) | `b3b-sca.js` (justo: si pasa de 700, partir en `-sca` y `-diseccion`) |
| 6 | 3B · TEP | `neumo-ep-diagnostico`, `neumo-ep-manejo` | `shock-vivo`: `tep-alto`, `tep-intermedio`, `tep-bolo`; circulación viva `tep` | 6a · vaso `tep-lisis` · 6b · telar `tvp` con lupa de **eco de compresión** | `b3b-tep.js` (montado desde Neumología) |

**Equivalencias** (cobertura → código): `taqui-sinusal` = `taquiSinusal` · `fa-farmaco` = `faF` · `cardiogenico` =
`cardio` · `taponamiento` = `tapon` · `cardioversion` = mando `#rtv-desfib` (no es estado). Las preguntas y casos
citan **solo claves que existen** (la ficha llama a un estado inexistente y no pasa nada: ningún juez lo ve).

Cada archivo nuevo, ≤700 líneas, una línea en `js/data/mayeutica/b3.js`. Formato: el de `b1-fluidos.js`; modelo
de cómo quedó en el bloque: `b3a-shock.js`.

## Cada grupo, paso a paso

1. **Piezas que faltan**: un encargo por fenómeno (≤60 pasos), sonnet salvo la placa (5a). Cada encargo de pieza
   lleva su **lista de calidad** (REGLAS §4.9) escrita por el profesor en el plan corto (paso 2, que va **antes**):
   topes con fuente y su consecuencia visible (§1.14: CPAP, EROA del papilar, tamaño de la placa), la cifra que sale en
   cada estado (PAS, PCP, GC, EROA… de un paciente posible, §1.7), «lo que NO quiero» y qué juez mide cada punto.
   Prueba en `autonomo/pruebas/<modelo>.mjs` (`jueces --modelo`) y ajuste del sello en `autonomo/jueces-topes.mjs`.
   Cifra mala del motor → para e informa (REGLAS §1.11). Al aprobar una pieza, el profesor escribe la lista de lo que
   hace (R2) y el constructor la tacha.
2. **Profesor, plan corto** (va primero, antes de las piezas) (fable, 10 pasos / 0,2 M): la ruta del grupo con los criterios clínicos escritos con su
   fuente y página **antes** de construir (R3), y qué cifra sale en cada paso y en cada caso. Base: la tabla de la
   cobertura §6.B o §6.C y los casos de §7 (pacientes de §9; no repetir los del bloque).
3. **Constructor, Estudiar** (sonnet, presupuesto «Mayéutica de un modelo desde su maqueta»: 50 pasos / 1,2 M):
   Mira → Juega → Piensa → Examínate → Caso y «Para profundizar»; citas también en explicaciones y distractores
   (REGLAS §1.11); `--ficha` de cada ficha del grupo verde a 390 y 360 px antes de entregar (R1).
4. **Auditor** (sonnet, 25 pasos / 0,3 M): solo las frases nuevas, frente al PDF de Marino y su página.
5. **Profesor, juicio** (fable, 15 pasos / 0,7 M): meta 8 (8,75 solo obliga en modelos nuevos y archivos modelo, R7).
   Arreglos con un constructor sonnet nuevo y la lista exacta (R5, 35 pasos / 0,4 M).
6. Commit y push en `auto/b3` (la PR del bloque se abre en la parada 3, no antes).

## Lo que ningún juez automático mide (lo mira el director o se pide expresamente)

- Que el estado del modelo al volver del caso coincide con las cifras del paciente (§1.12): el profesor lo comprueba
  en el juicio con el programa de prueba que le da las cifras en texto.
- Que cada clave de estado que citan preguntas y casos existe: el constructor lo comprueba con un `grep` contra
  `*-vivo-data.js` y lo pega en su entrega.
- Las cifras leídas de un gráfico (Figs. 19.5, 21.3, 21.4): el auditor las coteja también, no solo las frases.
- Citas en distractores y explicaciones (§1.11) y la forma de los casos (6-7 pasos, un giro, un «encuentra el error»
  con su número de errores, un «piensa y destapa»): `jueces --forma` y el profesor.
- Gasto frente a presupuesto: se anota en el parte de cada sesión (R9).

## Fuentes (páginas en la cobertura §6)

- 3B y 3C: `docs/marino-2024-shock-caps14-17.pdf` (cap. 16) y `docs/marino-2024-cardiac-disorders-caps18-21.pdf`
  (caps. 18-21). TEP: `docs/marino-2024-respiratory-management-caps22-26.pdf` (cap. 22).
- Huecos que siguen sin fuente (tarea `fuentes-b3`): PDF de ESC 2019 TSV, AHA 2020/ERC 2021 SVA, ESC 2023
  miocardiopatías y SCAI 2015. Para el grupo 2 ya está en `docs/` `aha-2025-parte9-soporte-vital-avanzado.pdf`
  (página impresa S = PDF + 537): usarla solo como enlace cruzado o nota de fuentes, nunca mezclada con Marino.
  Hasta que lleguen los otros PDF, las fichas 18 y 22 citan solo Marino.

## Gasto previsto

Con los presupuestos vigentes del tablero (90 % del último agente igual): Estudiar de un grupo ~1,2 M (50 pasos:
corto para 4 fichas, por eso el grupo 1 va en dos encargos) + auditor 0,3 + profesor 0,2 + 0,7 + arreglos 0,4 ≈ 2,8 M,
más el director 0,8 M. Cada pieza: constructor de arreglos con pieza de estudio, sonnet 50 / 0,75 M (la placa en opus,
55 / 1,2 M). Hay 17 piezas: unas 13 M solo en piezas. Total del paso 4: **≈ 35-40 M en 10-12 sesiones**, repartidas en varios días para no
pasar del aviso de ~15 M al día. Después, paso 5 (parada 3): jueces, auditor y profesor del bloque entero y la PR.
