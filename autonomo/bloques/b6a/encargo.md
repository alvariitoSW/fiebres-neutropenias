# Paquete del bloque 6a · Marino caps. 45-47 (consciencia, movimiento, ictus)

Escrito por el director el 01/11/2026 (sesión `b6a · mapa y maquetas`). Lee esto y, de la cobertura, solo lo que te
nombre tu encargo. Esta sesión hace **solo los pasos 1 y 2** (mapa de cobertura y maquetas); construir los modelos y el
Estudiar esperan (REGLAS §4.17, cola del 01/11, en paralelo con el `b5`).

## 1. Fichas del bloque
14 fichas `mn-*` en `js/modules/libros/marino-neuro.html` (1223 líneas; lógica en `marino-neuro.js`; vista Visual ya
hecha en `visual-marino-caps45-53.js` + `visual-marino-piezas-45-53.js`). `--ficha
libros:marinoNeuro:panel-marino-neuro-tabs:<id>`.
`mn-consciencia` · `mn-delirio` · `mn-abstinencia` · `mn-coma` · `mn-muerte-encefalica` · `mn-convulsiones` ·
`mn-estado-epileptico` · `mn-miastenia` · `mn-gbs-pnc` · `mn-relajantes` · `mn-ictus-soporte` ·
`mn-ictus-complicaciones` · `mn-hic` · `mn-hsa`. Grupos de Estudiar: los propone la cobertura.

## 2. Fuente
- **N** = `docs/marino-2024-neurologia-caps45-47.pdf` (51 páginas). Página = página del PDF; la cobertura comprueba el
  desplazamiento con un `#page=` de una ficha.
- Capítulos: 45 = p. 2-18 · 46 = 19-33 · 47 = 34-51.
- Anclas (revisión del encargo): PIC <20 mmHg y PPC = PAM − PIC objetivo 50-70 (HIC) p. 45 · PIC <20 en la HSA p. 48 ·
  salino hipertónico mejor que manitol (Tabla 47.3) p. 41 · la VPP puede bajar la PPC p. 35 · edema vasogénico y
  citotóxico p. 47 · intubar si CV ≤15 mL/kg (<1 L) o PIM −20 cmH₂O p. 25 · rocuronio 1 mg/kg, sugammadex 16 mg/kg
  p. 30-31 · apnea: PaCO₂ +20 p. 16. **Marino no trae** Monro-Kellie, hiperventilación ni la curva de autorregulación
  (solo una mención, p. 45), ni objetivo de PPC fuera de la HIC: otra fuente en encargo aparte, o hueco y `fisiología
  general`/`ilustrativo` visible.
- Ya existen: `caraGlasgow` y las pupilas (`visual-marino-piezas-45-53.js`), `calcPpc()` con sellos
  (`marino-neuro.js`), `calcGcs()`. No hay pieza de PIC ni de placa motora.
- Figuras reales ya extraídas (`js/modules/libros/img/`): `mar-fig45-1-causas-consciencia`, `45-2-delirio`,
  `45-3-reflejos-oculares`, `46-1-prueba-hielo`, `47-1-burbujas-fop`, `47-2-hemorragia-tpa`, `47-3-hematoma`,
  `47-4-hsa` (.jpg). Usa la imagen real donde la haya; no la redibujes.
- Lo que el libro no dice se busca en otra fuente y se cita (REGLAS §1.15) **en un encargo aparte** (lección del b5);
  si no se encuentra, hueco anotado.

## 3. Modelos vivos
- **Existen** (se reutilizan o enlazan; nunca se copian): receptores animados con Motion
  (`js/modules/cardiologia/receptores-animados.js`, el patrón pedido para la unión neuromuscular), receptor vivo
  (`js/modules/libros/receptor-vivo/`), shock vivo (`js/modules/libros/shock-vivo/`, la cama y el monitor), pulmón vivo
  (`pulmon-vivo/`, para la capacidad vital y la intubación de la miastenia y el GBS), ritmo vivo, capilar vivo,
  iones vivos (hiponatremia de la HSA), monitor + `js/core/tope.js` + `js/core/frase-vista.js`, las calculadoras de la
  ficha (PPC, Glasgow, pupilas, reversión de anticoagulantes, nimodipino, bloqueantes) y la vista Visual existente.
- **Nuevos, a maqueta (las elige Educación en el Consejo)** (`autonomo/ideas/marino.md` R11):
  - **Cráneo vivo** (3 opciones): caja cerrada con cerebro, sangre y LCR (Monro-Kellie); PIC, PPC = PAM − PIC;
    hematoma que crece, edema, hidrocefalia, herniación con pupilas; autorregulación rota del ictus. Sirve para HIC,
    HSA, edema del ictus, coma y muerte encefálica. La cara de Glasgow y las pupilas de la ficha pueden ser su cara.
    **Es pieza común** del bloque.
  - **Unión neuromuscular con Motion** (2 opciones), como los receptores: acetilcolina, receptor, acetilcolinesterasa;
    miastenia (menos receptores), bloqueantes despolarizantes y no despolarizantes, reversión (neostigmina,
    sugammadex), GBS frente a miastenia (nervio frente a placa).

## 4. Decisiones del usuario y del Consejo
- 01/11 (REGLAS §4.17): en paralelo con el `b5`; el Consejo sube techos hasta +25 % sin parar al usuario; papeleo
  mínimo. Ahorros §4.16 (director partido si pasa de ≈150 pasos).
- 30/10 (actas `consejo/2026-10-30-13.md` y `-14.md`): **las maquetas las elige Educación** (Consejo), con tres
  preguntas: ¿se ve el mecanismo?, ¿se entiende a 390 px?, ¿admite apuesta, error y caso? Empate → la que reutiliza
  motores. Al usuario le llega la página después («vale» o «cámbialo»).
- Lecciones del `b5` (parte `2026-11-01-b5-maquetas.md`): **un juicio de Educación por modelo** (no uno por maqueta);
  la vuelta 2 de la elegida son **dos encargos** (arreglos + injertos de las perdedoras); una **vuelta 3 tras el
  auditor**; la búsqueda de otra fuente, en un encargo aparte. Programa de prueba obligatorio (ningún juez mide las
  maquetas) y que **mida solapes de texto** (cajas de los `<text>` del SVG; el b5 los cazó solo a ojo).
- Meta del profesor: 9,5 en maquetas (8,75 obliga).

## 5. Lo que NO quiero
Tarjetas de números, barras sueltas, un esquema donde la app tiene la imagen real (TC del hematoma, de la HSA, burbujas
del FOP), ni repetir lo que ya hace un modelo grande (shock, pulmón, receptores): se enlaza o se importa. Un cráneo que
dé una PIC o una PPC imposibles sin sello. Cada maqueta declara qué motores y piezas reutiliza.

## 5b. Reglas que más fallan
Lista de comprobación de `.claude/agents/constructor.md`. Y: rótulos ≥8 px en pantalla; frase viva a la vista
(`js/core/frase-vista.js`); topes con origen y consecuencia visible (§1.14); cada cifra con su página (y cada dosis con
la indicación de la página de donde sale); ningún nombre interno a la vista; archivos ≤700 líneas; identidad nunca solo
por color; ningún rótulo que se pise con otro.

## 6. Pasos
| Paso | Estado | Salida |
|---|---|---|
| 1 · Cobertura (profesor) | en curso | `cobertura.md` (+ `cobertura-anexo.md`) |
| 2 · Maquetas cráneo (A, B, C) y unión neuromuscular (A, B) | — | `autonomo/maquetas/b6a-{craneo,unm}-<x>.html` + carpeta |
| 2 · Juicio y elección (Educación, Consejo) | — | `juicio-*.md`, `eleccion.md` |
| 3 · Modelos en la app · 4 · Estudiar | más tarde | sesiones aparte |

## 7-9. Piezas comunes, pacientes y encargo de las maquetas
Los escribe la cobertura (`cobertura.md` «Piezas comunes» y «Pacientes»; `cobertura-anexo.md` § Maquetas). Pacientes:
nombres que no repitan los de b1-b5 (comprobar con grep en `autonomo/bloques/`). Nadie inventa otro.
