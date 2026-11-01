# Paquete del bloque 6b · Marino caps. 48-53 y apéndices (nutrición, endocrino, tóxicos)

Escrito por el director el 01/11/2026 (sesión `b6b · mapa de cobertura y maquetas`, día libre de Marino). Lee esto y,
de la cobertura, solo lo que te nombre tu encargo. Esta sesión hace **los pasos 1 y 2** (mapa de cobertura y maquetas
del eje hormonal) y el **plan de reuso del hepatocito del b5** para los tóxicos; si queda presupuesto, el Estudiar del
**primer grupo de consulta**. Construir el modelo del eje en la app espera a otra sesión.

## 1. Fichas del bloque (25)
- **Nutrición y endocrino** (14 `mu-*`, `js/modules/libros/marino-nutricion.html`, 1115 líneas; lógica en
  `marino-nutricion.js`; `--ficha libros:marinoNutricion:panel-marino-nutri-tabs:<id>`): `mu-gasto-energetico` ·
  `mu-sustratos` · `mu-tiamina` · `mu-vitaminas-oligo` · `mu-enteral-indicaciones` · `mu-formulas` · `mu-pauta-enteral`
  · `mu-complicaciones-enteral` · `mu-npt-soluciones` · `mu-npt-pauta` · `mu-npt-complicaciones` · `mu-suprarrenal` ·
  `mu-tiroides` · `mu-hipotiroidismo`.
- **Tóxicos y apéndices** (11 `mt-*`, `js/modules/libros/marino-toxicos.html`, 934 líneas; `marino-toxicos.js`;
  `--ficha libros:marinoToxicos:panel-marino-tox-tabs:<id>`): `mt-paracetamol` · `mt-nac` · `mt-bzd-betabloq` ·
  `mt-opioides` · `mt-salicilatos` · `mt-co` · `mt-cianuro` · `mt-alcoholes` · `mt-unidades` · `mt-referencias` ·
  `mt-cuerpo`.
- Vista Visual ya hecha en `visual-marino-caps45-53.js` + `visual-marino-piezas-45-53.js`.

## 2. Fuente
- **NE** = `docs/marino-2024-nutricion-endocrino-caps48-51.pdf` (58 p.): cap. 48 = p. 2-17 · 49 = 18-35 · 50 = 36-46 ·
  **51 (suprarrenal y tiroides) = 47-58**.
- **TX** = `docs/marino-2024-toxicologia-caps52-53-apendices.pdf` (46 p.): cap. 52 = 2-18 · 53 = 19-31 · apéndice 1
  (unidades) = 32-36 · apéndice 2 (rangos) = 37-43 · apéndice 3 (el cuerpo) = 44-46.
- Página = página del PDF (los `#page=` de las fichas ya lo usan; la cobertura lo comprueba en uno).
- Figuras reales ya extraídas (`js/modules/libros/img/`): `mar-fig48-1` a `48-3`, `49-1` a `49-3`, `51-1`
  (supresión suprarrenal), `52-1` a `52-5` (52-2 metabolismo del paracetamol, 52-3 nomograma), `53-1` a `53-4`. Se
  usan; no se redibujan.
- Lo que Marino no dice (p. ej. el eje hipotálamo-hipófisis-suprarrenal con sus retroalimentaciones, la conversión
  T4→T3 si no viene) se busca en otra fuente y se cita (REGLAS §1.15) **en un encargo aparte**; si no, hueco anotado.

## 3. Modelos vivos
- **Existen** (se reutilizan o enlazan; nunca se copian): **hepatocito vivo** (b5, rama `auto/b5`, en la app en
  `js/modules/libros/hepatocito-vivo/` + `js/data/hepatocito-vivo-data.js`: ya trae **vías apagadas** «Paracetamol →
  glutatión» y «Alcoholes» reservadas para el b6b, y el hueco de la Fig. 52.2); termostato (b5); receptores animados
  con Motion (`js/modules/cardiologia/receptores-animados.js`, patrón del eje); receptor vivo; shock vivo (cama y
  monitor); ácido-base vivo (salicilatos, alcoholes, lactato del cianuro); pulmón vivo (opioides); monitor +
  `js/core/tope.js` + `js/core/frase-vista.js`; motor de Mayéutica; calculadoras de las fichas.
- **Nuevo, a maqueta** (2-3 opciones; **las elige Educación** en el Consejo): **eje hormonal con Motion**
  (hipotálamo → hipófisis → suprarrenal / tiroides, con retroalimentación; insuficiencia suprarrenal del crítico,
  supresión por corticoides (Fig. 51.1), tormenta tiroidea, coma mixedematoso, síndrome del eutiroideo enfermo). La
  cobertura dice cuántas opciones y cuáles.
- **Hepatocito para los tóxicos**: **sin maqueta nueva**; la cobertura escribe qué datos (vías, estados, pacientes,
  fichas) añade el b6b al hepatocito del b5 (Hacienda del b5: «b6b añade datos, no dibujo»).

## 4. Decisiones del usuario y del Consejo
- 01/11 (día libre de Marino; REGLAS §4.17): carriles en paralelo; el Consejo sube el presupuesto hasta +25 % sin parar
  al usuario; papeleo mínimo.
- **Fichas «de consulta»** (petición del usuario para el b6b): las que se consultan más que se estudian (p. ej.
  unidades, rangos, fórmulas) llevan **Estudiar corto y un caso por grupo**, y pueden empezar su Estudiar sin esperar
  al modelo. La cobertura las marca.
- Maquetas: las elige Educación con tres preguntas (¿se ve el mecanismo?, ¿se entiende a 390 px?, ¿admite apuesta,
  error y caso?); empate → la que reutiliza motores. Un juicio de Educación por modelo; vuelta 2 en dos encargos
  (arreglos + injertos); vuelta 3 tras el auditor; programa de prueba obligatorio que mida solapes de texto y **el
  cambio de paciente** (avisos que no se limpian; lección del b6a). Meta 9,5 en maquetas (8,75 obliga).
- Maqueta con Motion: presupuesto 0,9 M (medido en el b6a: 0,82-1,0 M). `cargarMotion()` falla fuera de la raíz: las
  maquetas cargan `js/vendor/motion.js` a mano, como las del b6a.

## 5. Lo que NO quiero
Tarjetas de números, barras sueltas, un esquema donde la app tiene la imagen real, ni repetir lo que hace un modelo
grande (hepatocito, ácido-base, shock): se enlaza o se importa. Un eje que dé un cortisol, una TSH o una T4 imposibles
sin sello. Dosis sin su página. Cada maqueta declara qué motores y piezas reutiliza.

## 5b. Reglas que más fallan
Lista de comprobación de `.claude/agents/constructor.md`. Y: rótulos ≥8 px; frase viva a la vista
(`js/core/frase-vista.js`); topes con origen y consecuencia visible (§1.14); cada cifra con su página; ningún nombre
interno a la vista; archivos ≤700 líneas; identidad nunca solo por color; ningún rótulo que se pise con otro.

## 6. Pasos
| Paso | Estado | Salida |
|---|---|---|
| 1 · Cobertura (profesor) | en curso | `cobertura.md` (+ `cobertura-anexo.md`) |
| 2 · Maquetas del eje (2-3) | — | `autonomo/maquetas/b6b-eje-<x>.html` + carpeta |
| 2 · Juicio y elección | — | `juicio-eje.md`, `eleccion.md` |
| Plan del hepatocito para tóxicos | — | `cobertura-anexo.md` § Hepatocito |
| Estudiar del primer grupo de consulta | si queda presupuesto | `js/data/mayeutica/b6b-<grupo>.js` |

## 7-9. Piezas comunes, pacientes y encargo de las maquetas
Los escribe la cobertura (`cobertura.md` «Piezas comunes» y «Pacientes»; `cobertura-anexo.md` § Maquetas). Pacientes:
nombres que no repitan los de b1-b6a (`grep -ri` en `autonomo/bloques/` y en las ramas `origin/auto/b5`,
`origin/auto/b6a`). Nadie inventa otro.

## 10. Revisión del encargo (01/11; `revision-encargo.md`)
- El hepatocito solo existe en `origin/auto/b5` (sin fusionar): se lee con `git show origin/auto/b5:<ruta>`. Sus
  `VIAS_APAGADAS` apuntan «Paracetamol» a `ma-fha-paracetamol` (abdomen) y «Alcoholes» a `mt-alcoholes` con página 0:
  la cobertura decide cómo convive `mt-paracetamol` y pone páginas reales (Fig. 52.2, Fig. 53.3). **Casimira** ya es
  paciente del hepatocito: se reutiliza, no se repite.
- Las fichas del cap. 51 citan solo rangos de sección: la cobertura da página a cada cifra del eje.
- Marino no trae la retroalimentación negativa ni TRH → TSH → T4 → T3: otra fuente, encargo aparte; si no, `ilustrativo`.
- TSH: la unidad de la ficha (la fuente mezcla mU/mL y mU/dL). Propranolol IV sin dosis en Marino: no se dibuja un bolo.
- Caso que no puede salir mal: el cortisol aleatorio no descarta la supresión secundaria (p. 51).
