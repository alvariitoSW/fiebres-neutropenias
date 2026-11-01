# Paquete del bloque 5 · Marino caps. 39-44 (hígado, páncreas, infecciones, temperatura)

Escrito por el director el 01/11/2026 (sesión `b5 · mapa y maquetas`). Lee esto y, de la cobertura, solo lo que te
nombre tu encargo. Esta sesión hace **solo los pasos 1 y 2** (mapa de cobertura y maquetas); construir los modelos y el
Estudiar esperan al `b4` (REGLAS §4.17, «Más rápido», 01/11).

## 1. Fichas del bloque
17 fichas `ma-*` en `js/modules/libros/marino-abdomen.html` (1518 líneas). `--ficha
libros:marinoAbdomen:panel-marino-abd-tabs:<id>`.
`ma-fallo-hepatico-agudo` · `ma-encefalopatia-hepatica` · `ma-varices` · `ma-pbe-shr` · `ma-pancreatitis-dx` ·
`ma-pancreatitis-tto` · `ma-colecistitis` · `ma-infeccion-abdominal` · `ma-cdifficile` · `ma-infecciones-nosocomiales` ·
`ma-itu-sonda` · `ma-candiduria` · `ma-fiebre-basicos` · `ma-antipireticos` · `ma-calor` · `ma-hipertermia-farmacos` ·
`ma-hipotermia`. Grupos de Estudiar: los propone la cobertura.

## 2. Fuente
- **B** = `docs/marino-2024-abdomen-temperatura-caps39-44.pdf` (74 páginas). Página = página del PDF; la cobertura
  apunta el rango de cada capítulo (39-44) y comprueba el desplazamiento con un `#page=` de la ficha.
- Capítulos (revisión del encargo, 01/11): 39 = p. 2-15 · 40 = 16-24 · 41 = 25-37 · 42 = 38-44 · 43 = 45-58 · 44 = 59-74.
  Anclas: amonio arterial >150 µmol/L (normal <60) p. 7 y criterio de trasplante p. 8 · termostato ±0,6 °C y «la fiebre
  es termorregulación normal» p. 45 · golpe de calor ≥41 °C p. 46-47 · Tabla 43.6 (hipotermia) p. 54 · Osborn: texto
  p. 55, Fig. 43.1 p. 56, imagen real ya en la app `js/modules/libros/img/mar-fig43-1-onda-osborn.jpg` · fiebre en la
  UCI ≥38,3 °C p. 60. Las 20 figuras reales de los caps. 39-44 están en `js/modules/libros/img/mar-fig39…44*`.
- Lo que el libro no dice se busca en otra fuente y se cita (REGLAS §1.15); si no, hueco anotado.

## 3. Modelos vivos
- **Existen** (se reutilizan o amplían; nunca se copian): nefrona viva y glomérulo (`js/data/nefrona-data.js`; SHR),
  filtro vivo (CVVH para el amonio), ácido-base vivo (cetoacidosis, lactato), capilar vivo (sepsis), shock vivo
  (`js/modules/libros/shock-vivo/`; shock séptico de la PBE o la colangitis), iones vivos (`js/modules/libros/iones-vivos/`),
  receptor vivo (`js/modules/libros/receptor-vivo/`) y receptores animados con Motion
  (`js/modules/cardiologia/receptores-animados.js`, el patrón pedido para el termostato), monitor y `js/core/tope.js`.
- **Nuevos, a maqueta (2-3 opciones cada uno; las elige Educación en el Consejo)**:
  - **Hepatocito vivo** (`autonomo/ideas/marino.md` §4.4 y M6): la célula hepática con sus vías encendibles (urea →
    amonio → astrocito; y, para otros bloques, paracetamol/glutatión, cetonas, alcoholes, lactato). **Es pieza común**:
    la usan después `mr-cetoacidosis`/`mr-lactato-bicarbonato` (b4) y `mt-paracetamol`/`mt-nac`/`mt-alcoholes` (b6b).
    En b5 manda el eje intestino → hígado → astrocito (amonio, lactulosa, rifaximina, TRR) y el fallo hepático agudo.
  - **Termostato** (§4.6 y R10): punto de ajuste del hipotálamo frente a la temperatura real; producción y pérdida de
    calor. Fiebre (sube el punto) frente a hipertermia (falla la regulación), golpe de calor, hipertermias por
    fármacos, hipotermia (Tabla 43.6, onda de Osborn real, Fig. 43.1), antipiréticos.

## 4. Decisiones del usuario y del Consejo
- 01/11 (REGLAS §4.17): el `b5` va **en paralelo** con el `b4`; el Consejo sube techos hasta +25 % sin parar al usuario;
  papeleo mínimo. Ahorros §4.16.
- 30/10 (actas `consejo/2026-10-30-13.md` y `-14.md`): **las maquetas las elige Educación** (Consejo), 2-3 por modelo,
  con tres preguntas: ¿se ve el mecanismo?, ¿se entiende a 390 px?, ¿admite apuesta, error y caso? Empate → la que
  reutiliza motores. Al usuario le llega la página después («vale» o «cámbialo»).
- Lección del `b4` (parte `2026-10-30-b4-iones.md`): maquetas **cortas** (≤40 pasos, sin Mayéutica completa); la vuelta
  2, el auditor y el rejuicio, solo en la elegida. Programa de prueba obligatorio (ningún juez mide las maquetas).
- Meta del profesor: 9,5 en maquetas (8,75 obliga).

## 5. Lo que NO quiero
Tarjetas de números, barras sueltas, un esquema donde la app tiene la imagen real, ni repetir lo que ya hace un modelo
grande (shock, nefrona, filtro, capilar): se enlaza o se importa. Cada maqueta declara qué motores y piezas reutiliza.

## 5b. Reglas que más fallan
Lista de comprobación de `.claude/agents/constructor.md`. Y: rótulos ≥8 px en pantalla; frase viva a la vista
(`js/core/frase-vista.js`); topes con origen y consecuencia visible (§1.14); cada cifra con su página (y cada dosis con
la indicación de la página de donde sale); ningún nombre interno a la vista; archivos ≤700 líneas; identidad nunca solo
por color.

## 6. Pasos
| Paso | Estado | Salida |
|---|---|---|
| 1 · Cobertura (profesor) | en curso | `cobertura.md` (+ `cobertura-anexo.md`) |
| 2 · Maquetas hepatocito y termostato | — | `autonomo/maquetas/b5-{hepatocito,termostato}-<x>.html` + carpeta |
| 2 · Juicio y elección (Educación, Consejo) | — | `juicio-*.md`, `eleccion.md` |
| 3 · Modelos en la app · 4 · Estudiar | tras el `b4` | sesiones aparte |

## 7. Piezas comunes
Las nombra la cobertura (§ «Piezas comunes»). De partida: el **hepatocito** como célula reutilizable por b4 y b6b; el
**monitor + `tope.js`**; un solo motor de Mayéutica; enlaces cruzados al filtro vivo, la nefrona y el shock vivo.

## 8. Pacientes del bloque
Los da la cobertura (§ «Pacientes»). Ninguno repite nombre de b1-b4 (listas en `autonomo/bloques/b{1,2,3}/encargo.md` § «Pacientes»; de b4: Sofía, Benito, Damián, Rufino,
Matilde, Gregorio, Casilda, Nicolás, Adela, Valentín, Encarna; más Lucía, Carmen y Teresa de los modelos).

## 9. Encargo de las maquetas
Se escribe tras la cobertura (abajo, §9a hepatocito y §9b termostato).
