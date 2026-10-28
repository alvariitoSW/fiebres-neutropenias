# Maqueta C · Entrelazado y repaso espaciado en el río y mar (diseño, fase 2 · 28/10/2026)

**Ficha**: XX «Cristaloides y sueros glucosados» (`mar-cristaloides`, Marino cap. 10). **Modelo**: río y mar (`agua-viva`),
estados que ya existen: `hemorragia`, `reanimacion`, `salino`, `ringer`. **Cruce**: hemorragia clase II (ficha
`mc-hemorragico-clasificacion` y `mc-hemorragico-fluidos`, Marino cap. 15). Es un cruce entre conceptos **parecidos**
(adónde va el fluido ↔ qué pierde el que sangra): el único entrelazado que la evidencia respalda (Brunmair 2019).
**Paciente nuevo** (nombre libre, no usado en ningún banco): **Teresa, 45 años, 60 kg, hemorragia digestiva alta
(melenas por úlcera duodenal)**. Mujer: volemia 60 mL/kg = 3,6 L (S pág. 21); plasma 36 mL/kg = 2.160 mL (S pág. 29).
Fuentes: F = `docs/marino-2024-fluidoterapia-caps10-11.pdf`, S = `docs/marino-2024-shock-caps14-17.pdf` (página del PDF).
La maqueta **no guarda nada**: las fechas de «días atrás» son fijas en el HTML (hoy = 04/11/2026). Formatos: solo los
tres de REGLAS §8 (modelo `autonomo/modelos/preguntas-para-estudiar.html`). Piezas: la cabecera de ficha del modelo,
el estuario (río, marisma, mar, herida, lectura) y los botones `may-*` del motor; el constructor los imita en HTML.

## La regla del repaso espaciado (lo que se añade y cómo se ve)
- **Qué se guarda**: en el registro que ya existe por pregunta (`crearGuardado` en `js/core/mayeutica-motor.js`:
  `{ aciertos, fallos, resultado, repasar, faltan }`) se añade **un solo campo**: `ultimo: 'AAAA-MM-DD'` (día local del
  último intento, sin hora). Aprobado por el usuario el 28/10 (`CLAUDE.md` §2). Nada más.
- **Cuándo vuelve una pregunta** (regla propia, deducida de Anki/FSRS; Kerfoot espaciaba por calendario fijo y nadie ha
  probado «ordenar por fecha del último intento»; se dice en pantalla):
  - último intento **fallado** (`resultado === 'mal'` o `repasar`) → vuelve **al día siguiente** (1 día);
  - acertado, con saldo `aciertos − fallos` = 0 o 1 → **3 días**; saldo 2 → **7 días**; saldo ≥3 → **14 días** (tope).
  - «toca» si hoy ≥ `ultimo` + intervalo. Contestada hoy, no toca hasta mañana.
- **Qué se elige al abrir «Estudiar» de una ficha**: entre las preguntas de **otras fichas** que tocan, primero las
  falladas (la más antigua antes), después las acertadas más atrasadas; **nunca dos seguidas de la misma ficha**
  (la regla de «hermanas» de Anki); como mucho **5**. Si tocan menos, se enseñan menos («hoy no toca nada más»); nunca
  se rellena con preguntas sin fecha.
- **Cómo se ve**: sobre cada pregunta, un chip: «Fallada hace 2 días» o «Acertada hace 8 días · tocaba a los 7». Al
  contestar, debajo de la explicación, una línea: «Vuelve en 3 días: la acertaste una vez» / «Vuelve mañana: fallada».
  En «piensa y destapa», marcar los puntos que tenías ya cuenta como acierto o fallo (sin campo nuevo).

## Pantalla 1 · «Antes de empezar: cinco de días atrás» (repaso, una pregunta por vez, contador 1/5)
Arriba: «Cinco preguntas de fichas que ya estudiaste. Volver a contestar días después fija más que releer (Larsen 2009,
d = 0,91 en residentes; Kerfoot 2010, 724 residentes). Las elige la fecha de tu último intento.» Modelo: sin estuario
(el río y mar aparece en la pantalla 2). Orden, con su chip (hoy 04/11):
1. `hcl-e6` «las notas» (error, ficha `mc-hemorragico-clasificacion`, `js/data/mayeutica/b3a-shock.js`) · chip «Fallada
   hace 2 días». Copiar tal cual: 5 frases, 2 errores («Clase II: diuresis <0,5» → no llega a oliguria, S pág. 22; «un
   Hto normal descarta una pérdida grande» → el Hto no cambia al principio, S pág. 23).
2. `rv-g7` «la PVC no mide» (test, `mar-retorno-venoso`, `b1-hemodinamica.js`) · «Fallada hace 1 día». Copiar tal cual:
   correcta «Tampoco: no guarda relación con la volemia (r = 0,17)»; Fig. 11.4 y «nunca debe usarse», F pág. 27.
3. `rf-g5` «¿responder es estar seco?» (test, `mar-respuesta-fluidos`, `b1-hemodinamica.js`) · «Acertada hace 8 días ·
   tocaba a los 7». Copiar tal cual: correcta «No necesariamente: responde también el normovolémico»; 50 % responde,
   F pág. 31.
4. `rv-g5` «el déficit de verdad» (destapa, `mar-retorno-venoso`) · «A medias hace 4 días · tocaba a los 3». Copiar
   con sus 3 puntos (silente hasta 15 %; 450 mL en el varón; 2,25 L de Ringer, 1,8 L al intersticio) y sus dos notas
   (F pág. 25 y 26). Adaptación: el enunciado dice al final «(son tres cosas)».
5. `col-g4` «de dónde sale» (test, `mar-coloides`, `b1-fluidos.js`) · «Acertada hace 3 días · tocaba a los 3». Copiar
   tal cual: correcta «Del intersticio: la mueve de sitio, no la repone»; albúmina 25 %, COP 70, F pág. 13-14.
Tras cada una: explicación + «Ver en el texto» + la línea «Vuelve en …». Al acabar: «Repaso hecho. Ahora, Teresa.»
**Nota visible** (caja `nota-plegable` abierta): «Mezclar fichas (entrelazado) tiene evidencia contradictoria en
medicina: en ECG ayudó (Hatala 2003, 46 % frente a 30 %) y perjudicó (Monteiro 2017, 24 % frente a 34 % a los días).
Aquí solo se mezclan conceptos parecidos, y se mide contigo.»

## Pantalla 2 · Teresa llega (caso, paso 1 · «Urgencias · hora 0»)
Modelo: estuario con `paciente: 'mujer'`, `hemorragia: 20`, `reloj: '1h'`, anillo «herida» marcado; la lectura del Hto
**tapada** hasta contestar (predice y comprueba). Ficha de paciente (lo nuevo en rojo): Edad 45 · Peso 60 kg (volemia
≈ 3,6 L) · Motivo: melenas desde la madrugada · FC 112 · PA 112/68 · Diuresis 40 mL/h (0,67 mL/kg/h) · Lactato 1,4 ·
Hto 45 % (dato del caso; la Fig. 15.1 parte de 45 %, S pág. 24).
**P1 · test, piensa antes.** «Teresa pesa 60 kg y no sabes cuánto ha sangrado. Con la Tabla 15.1 en la cabeza: ¿qué
clase de hemorragia es y con qué se reanima?»
- «Clase I: el Hto es normal, así que ha perdido poco; observar» → porque: a la hora se pierde sangre entera y el Hto no
  cambia (S pág. 23); esperar deja sin reponer una pérdida que ya taquicardiza.
- «Clase II: taquicardia con PA mantenida y sin oliguria; cristaloides» → **correcta**.
- «Clase III: una FC >100 ya es shock; pedir sangre» → porque: la clase III es hipotensión, oliguria (<0,5 mL/kg/h, S
  pág. 2 y 17) y lactato alto (S pág. 22); transfundir aquí es tratar un shock que no tiene.
Explicación: volemia 60 mL/kg → 3,6 L (S pág. 21); clase II = 15-30 % (S pág. 22): FC ↑, PA sostenida por
vasoconstricción, lactato ↔ (Tabla 15.1, S pág. 22); se reanima con cristaloides (S pág. 26). Se destapa el Hto: 45 %.

## Pantalla 3 · Cuánto, y adónde va lo que puso el R1 (pasos 2 y 3 · «hora 0-1»)
**P2 · test con calculadora** («Volumen de reanimación», ficha `mc-hemorragico-fluidos`, botón que abre `mc-vr-peso`).
Dato nuevo: «Pérdida estimada: 20 % (clase II)». «Tabla 15.4: ¿cuánto cristaloide?»
- «≈ 430 mL de Ringer: lo mismo que el déficit de plasma» → porque: eso es el volumen con coloide (×1); solo el 20-25 %
  del cristaloide se queda en el plasma (S pág. 29): repondrías ≈ 100 mL.
- «≈ 1,3 L de cristaloide, o ≈ 430 mL de coloide» → **correcta**.
- «3,6 L: su volemia» → porque: confunde volemia (3,6 L) con plasma (2,16 L) y repone la volemia entera: sobrecarga y
  edema (F pág. 26: el 80 % va al intersticio).
Explicación: PV = 36 × 60 = 2.160 mL; 20 % = 432 mL; ×3 = 1.296 mL ≈ 1,3 L; coloide ×1 (Tabla 15.4, S pág. 29).
Nota de fuentes (copiar de `w1-3`): ×3 «estimación conservadora» (S pág. 29) frente a ×5 del cap. 11 (F pág. 26).
**P3 · test, piensa antes + modelo.** Dato nuevo (rojo): «Fluidos: el R1 de guardia puso 2 L de salino 0,9 % a chorro».
«Predice antes de tocar el modelo: ¿cuánto de esos 2 L queda en el río de Teresa (su plasma mide 2 L, Tabla 10.1)?»
- «2.000 mL: es isotónico y se queda en el vaso» → porque: el sodio se reparte por todo su extracelular (10 L); el
  plasma es solo una parte (F pág. 4-6).
- «≈ 550 mL; unos 1.650 van a la marisma» → **correcta**.
- «≈ 1.400 mL (70 %)» → porque: eso lo hace la albúmina al 5 % (700 mL por litro, F pág. 13); la sal no se queda.
Tras elegir: «Compruébalo»: botón «Infundir 2 L de salino» en el modelo (`tocar`, como `w2-1`), mareógrafos tapados
hasta entonces; confirma «río ≈ +550, marisma ≈ +1.650, el mar baja ≈ 200». Explicación: 275 mL por litro al plasma,
825 al intersticio (Fig. 10.1, F pág. 6), proporcional (ilustrativo para 2 L); algo hipertónico (308 mOsm/L), saca agua
de las células (F pág. 4-6).

## Pantalla 4 · El giro (paso 4 · «hora 4»)
Modelo: estado anterior + `infusiones: [{ f: 'salino', ml: 2000 }]`, anillo «lectura». Datos nuevos (rojo): FC 118 ·
PA 108/64 · Hto **38 %** (cálculo del modelo: hematíes ÷ volemia; fisiología general, la Fig. 15.1 solo da la dirección) ·
Na⁺/Cl⁻/HCO₃⁻ 140/116/18 · PaCO₂ 37 · pH 7,31 · Lactato 1,6. El R1: «Ha resangrado y está acidótica por hipoperfusión».
**P4 · piensa y destapa** («son tres cosas»): «¿Qué le contestas al R1, con la ficha de cristaloides y la Tabla 15.1?»
1. El Hto baja por **dilución**: el cristaloide expande el plasma y no los hematíes; en las primeras horas refleja la
   reanimación, no la pérdida (S pág. 23). 2. La acidosis es **hiperclorémica** por el cloro del salino (154 frente a
   103 del plasma, Tabla 10.2, F pág. 4): en la Fig. 10.2 el pH bajó de 7,41 a 7,28 con salino a 30 mL/kg/h y no cambió
   con Ringer (F pág. 6). 3. El lactato es normal: en la clase II el lactato no sube (Tabla 15.1, S pág. 22); no hay dato
   de hipoperfusión. Explicación: «Lo que más importa es el cloro» (F pág. 6); el Ringer (Cl⁻ 109) no la produce (F pág. 7).

## Pantalla 5 · El plan de guardia y el día 2 (pasos 5 y 6)
**P5 · encuentra el error** («hay 0, 1 o 2 errores»). «Plan que deja escrito el R1 a las 4 h:»
1. «Hto 38 %: sigue sangrando; pido 2 concentrados ya.» → **error**; frase buena: el Hto a las 4 h refleja el salino,
   no la pérdida (S pág. 23); la clase II se reanima con cristaloides y la sangre es de la clase III (S pág. 22 y 26).
2. «Cambio el salino por Ringer lactato: su cloro (109) no produce acidosis hiperclorémica.» → verdadera (F pág. 7).
3. «El Ringer no: lleva 28 mmol/L de lactato y le subirá el lactato.» → **error**; frase buena: el hígado aclara unos
   100 mmol/h, lo que llevan 3,5 L de Ringer por hora (F pág. 8).
4. «Si repito el lactato, no lo saco por la vía del Ringer: sale falsamente alto.» → verdadera (F pág. 8).
5. «Si aparecen hipotensión, oliguria o lactato alto, pasa a clase III y se reanima con sangre.» → verdadera (S pág. 22).
Tras corregir, cada error pide pensar la frase buena antes de verla.
**P6 · test, piensa antes** («Día 2»). Datos nuevos: endoscopia: úlcera tratada, no sangra · FC 88 · PA 120/70 · Hto **31 %**.
Modelo: `reloj: 'dias'`, anillo «marisma». «Ya no sangra y el Hto sigue bajando. ¿Por qué?»
- «Resangrado oculto: hay que repetir la endoscopia» → porque: FC y PA normales; el Hto tarda 8-12 h en notar el relleno
  y días en completarlo (S pág. 23): bajar al día siguiente es lo esperado.
- «Relleno transcapilar (hasta 1 L) y retención de agua y sodio por ADH y aldosterona» → **correcta** (S pág. 21-23).
- «El salino de ayer sigue en el plasma y lo diluye» → porque: el 80 % del cristaloide se fue al intersticio (F pág. 26);
  lo que ahora diluye es el agua que el intersticio y el riñón devuelven al plasma.
Explicación: en el modelo, la marisma cede agua al río y los discos se separan (estado `hemorragia`, paso 4 de la guía).

## Pantalla 6 · Lo que te llevas y cuándo vuelve cada pregunta
«Lo que te llevas» (3): 1. En la clase II la PA aguanta y el lactato no sube: cristaloides, y la cantidad la da la Tabla
15.4 (×3). 2. Del salino solo ≈ 275 mL por litro quedan en el plasma, y su cloro (154) acidifica: Ringer si va a haber
litros. 3. El Hto de las primeras horas mide la reanimación, no la pérdida; al día siguiente baja por el relleno.
Camino de vuelta: «Ver la ficha» (`mar-cristaloides`) y «Ver el modelo en el estado de Teresa» (`agua-viva`,
`hemorragia` mujer 20 % + 2 L de salino). **Tabla «cuándo vuelve»** (simulada): P1-P6 y las 5 del repaso con su
resultado de hoy y «vuelve el …» según la regla de arriba, más una línea: «Regla nuestra, no de un ensayo: Kerfoot
espaciaba por calendario fijo». **Pregunta final al usuario**: «¿Con cuál te quedas? A · POE en el shock vivo · B · error
productivo en el capilar vivo · C · esta (repaso de días atrás + caso que cruza fichas) · o una mezcla (di cuál)».

## Huecos y lo no comprobado
- Comprobado en el PDF: «spuriously high» lactato y 0,9 mmol/L con 30 mL/kg de Ringer en sanos, F pág. 8; Fig. 11.4
  (r = 0,17) y «never be used», F pág. 27 (en el repaso `rv-g7`, citar pág. 27, no 26-27).
- Hto 45 % basal en una mujer es alto-normal: es el basal fijo del modelo (`HTO0`); el Hto 38 % de la hora 4 y el 31 %
  del día 2 son cálculo del caso (dilución + relleno), marcados como fisiología general, no cifras del libro.
- La regla de intervalos (1/3/7/14 días) y el saldo `aciertos − fallos` como racha son decisión de diseño: sin ensayo.
- Rúbrica (3 criterios nuevos) y fichas gemelas de la prueba de 3 días: fuera de esta pieza (van en el informe de fase 2).
