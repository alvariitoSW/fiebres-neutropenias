# Maqueta B · error productivo en el capilar vivo · diseño (fase 2, 28/10/2026)

Ficha: `merino-transfusion` (Merino HEMATO, Marino cap. 12; PDF `docs/marino-2024-anemia-transfusion-hemostasia-uci.pdf`,
página impresa = página del PDF, comprobado con `#page=16` de la ficha). Modelo: capilar vivo en su grupo «Anemia y
transfusión» (`js/data/capilar-vivo-data.js`: estados `umbral-7`, `transfusion`, `taco`; mando real `#cpv-m-transf`
«Transfundir 1 CH», que hoy solo se apaga a Hb ≥17 y **no tiene tope clínico ni sello**: la maqueta lo añade).
Orden que manda la evidencia (`evidencia.md` §3): tratar sin guía → pasarse → consecuencia → **enseñanza después**
(Sinha y Kapur 2021, g 0,36; Willis 2020). Durante el error, **ni pistas ni preguntas** (Klein 2019).
Cifras del modelo calculadas con `derivar()` el 28/10 (gasto que compensa: ilustrativo, Fig. 12.3). La maqueta no guarda nada.

## La paciente (inventada; la medicina, no)
**Carmen, 71 años.** Ingresó hace 3 días por neumonía; hoy estable, sin vasoactivos, gafas nasales 2 L, no sangra.
Antecedente: insuficiencia cardíaca crónica (FEVI 35 %), sin cardiopatía isquémica. Analítica de las 3:00: Hb 7,4 g/dL
(ayer 7,9). Constantes de partida (ilustrativas, paciente posible): FC 92, PA 118/64, FR 20, SpO₂ 98 %, PVC 8, diuresis bien.
Por qué ella: es el «crítico estable sin cardiopatía isquémica» del umbral 7 (p. 8) y tiene la IC previa que hace
más probable el TACO (p. 15). Con una vía central normal (sin oximetría continua).

## El tope que se pasa (REGLAS §1.14)
- **Tope del mando «Transfundir 1 CH» en esta paciente: Hb <7 g/dL** (crítico estable sin cardiopatía isquémica; p. 8,
  `#mh-umbral-7`). Carmen está en 7,4: **cada bolsa pasa el tope**. Umbral 8 solo con cardiopatía isquémica o cirugía
  cardíaca/ortopédica (p. 8, `#mh-umbral-8`).
- **Aviso (≈80 %)**: tras la 1.ª bolsa, chip gris en el mando, sin consejo: «Hb 8,4 · umbrales de las guías: 7 y 8 g/dL (p. 8)».
  Es el dato que trae la hoja de laboratorio, no una pista socrática (los prompts de Klein eran de autoexplicación).
- **Consecuencia al pasarse (2.ª bolsa)**: sello **TACO**: edema pulmonar hidrostático con insuficiencia respiratoria
  hipoxémica en las primeras 6 h (p. 15-16); incidencia ≈1 %, más frecuente con IC o insuficiencia renal previas (p. 15-16); **sin relación con
  el número de unidades** (p. 15: el riesgo lo corrió en cada bolsa, también en la que no hacía falta); mortalidad 20 % y
  ventilación mecánica en 3 de cada 4 (p. 15-16). Tratamiento: parar la transfusión, avisar al banco, diurético de asa
  i.v., soporte (p. 16). El mando se apaga y la frase viva lo dice.
- **Nota honesta en el sello**: el libro no dice que 2 bolsas den más TACO que 1. Lo que el sello castiga es haber
  transfundido **sin indicación** (p. 8) a una paciente con el pulmón más fácil de encharcar (p. 15); la Rx y las
  constantes del edema son fisiología general, rotuladas.

## Las 6 pantallas (390 px)
**P1 · «Decide tú» (sin guía).** Arriba la ficha de la paciente (los datos de arriba). Debajo, el capilar vivo en
estado `{hb: 7.4, compensa: true, toma: 'scvo2'}`: tablero Hb 7,4 · gasto 7,6 L/min (ilustrativo) · DO₂ 742 ·
VO₂ 250 · extracción 34 % · ScvO₂ 65 % · lactato 1,0. Constantes a la derecha. Mandos: **[Transfundir 1 CH]**
(repetible) · **[Pedir ScvO₂ de control]** (solo redibuja el dato) · **[Dejar así y seguir la guardia]**.
Texto exacto: «3:00. Te llama la enfermera: "Carmen tiene la Hb en 7,4, ¿le pongo sangre?". Nadie más despierto.
Decide con el modelo.» Nada más: ni explicación, ni pregunta, ni «piensa antes».
**P2 · Gotea la 1.ª bolsa (2 h, p. 10).** La bolsa gotea; el gasto se queda quieto (fisiología general, ilustrativo; la Fig. 12.4 solo muestra DO₂ y VO₂). Tablero:
Hb 8,4 · DO₂ 843 · VO₂ 250 · extracción 30 % · ScvO₂ 69 %. Constantes iguales (FC 92, PA 120/66, SpO₂ 98, PVC 10:
ilustrativas). Aviso §1.14 (chip gris del tope, texto arriba). Mandos: **[Transfundir otro CH]** · **[Parar aquí]**.
Texto exacto: «5:10. Pasó la primera bolsa. Hb de control 8,4.» Si pulsa «Parar aquí» o «Dejar así» en P1, pasa a P3
con una línea: «El R1 de la mañana la ve "todavía baja" y cuelga otra bolsa a las 8:00.» (así todos ven el sello).
**P3 · El sello (4 h después de empezar la 2.ª bolsa).** Modelo en `{hb: 9.4, gcFijo: 7.6, pao2: 55, alveolo: 'taco'}`
con la lupa del alvéolo abierta (agua que cruza): Hb 9,4 · DO₂ 830 · extracción 30 % · SaO₂ 86 %. Constantes en rojo
(fisiología general / ilustrativas): FR 30, SpO₂ 86 % con gafas, FC 110, PA 152/90, PVC 16, crepitantes bilaterales,
Rx con edema pulmonar (p. 16). Sello grande: «TACO · sobrecarga circulatoria por la transfusión · edema
hidrostático en las primeras 6 h · ≈1 %, más con IC previa · mortalidad 20 %, VM en 3 de 4 (Marino cap. 12, p. 15-16)».
Mando «Transfundir» apagado. Frase viva: «La transfusión que no hacía falta le ha llenado el pulmón de agua.»
Veredicto corto, sin reproche (webs, idea 10): «Pasó. Ahora, por qué.» Botón **[Entender qué pasó]**.
**P4 · La enseñanza: el ejemplo resuelto.** Los mismos mandos, ahora guiados paso a paso (modelo en cada paso):
1. Hb 7,4 en crítico estable sin cardiopatía isquémica → **no se transfunde** (umbral 7, p. 8; umbral 8 solo con
   cardiopatía isquémica, p. 8). 2. Si dudas, mira al tejido, no a la Hb: extracción 34 %, lejos del 50 % que Marino
   propone como disparador (p. 6 y 8); ScvO₂ 65 %: algunas guías proponen <70 % (p. 8-9). **Las dos reglas no
   coinciden del todo en Carmen; el libro no las reconcilia** (nota de fuentes). Tras la 1.ª bolsa (ScvO₂ 69, ext.
   30 %) la extracción sigue lejos del 50 %; la ScvO₂ 69 % aún roza el 70 % propuesto: las reglas siguen sin coincidir (el libro no las reconcilia). 3. Transfundir sube el aporte (742 → 843), no el consumo (250): cae la extracción
   (Fig. 12.4, p. 10-11); «no es un método absoluto para oxigenar» (p. 11). 4. En 42 de 45 estudios los riesgos
   superan los beneficios; en 17 de 18, la transfusión fue factor de riesgo independiente (p. 16). 5. Lo que sí
   amenaza al tejido es la hipovolemia, no la anemia (p. 16-17). 6. TACO: parar, avisar al banco, diurético de asa
   i.v., soporte; antes de otra transfusión, corregir el balance positivo (p. 16).
**P5 · Recuperación con feedback (las 3 preguntas de abajo).** Cada distractor lleva su error previsto (webs, idea 1).
**P6 · Lo que te llevas + A/B/C.** Tres puntos: (1) la Hb no dice si el tejido recibe O₂: umbral 7, u 8 con
cardiopatía isquémica (p. 8); (2) transfundir sube el aporte, no el consumo (p. 10-11), y en el crítico sus riesgos
pesan más que sus beneficios (p. 16); (3) TACO en 6 h, más con IC previa, sin relación con el n.º de bolsas; parar y
diurético de asa (p. 15-16). Enlaces: `data-capilar-vivo="taco"` y `"umbral-7"`, y «Ver en la ficha»
(`#mh-umbral-7`, `#mh-efecto-transfusion`, `#mh-taco`). Pregunta final: «¿Con cuál estudiarías tú? A · B · C (o mezcla)».

## Las preguntas (P5)
**1 · Test con «piensa antes»** (gemela de Carmen: otro paciente, misma idea). «Don Julián, 68 años, día 2 de un
infarto sin elevación del ST, estable, Hb 7,6 g/dL, no sangra. ¿Qué haces?» → «Ya lo tengo: ver opciones».
- A. Nada: está por encima del umbral de 7 como Carmen. *(error previsto: aplica el umbral general a todos; p. 8:
  con cardiopatía isquémica el umbral es <8 → le dejarías anémico al miocardio que más lo necesita).*
- B. **Transfundir 1 CH y controlar la Hb** *(correcta: Hb <8 con cardiopatía isquémica, p. 8; 1 CH sube ≈1 g/dL,
  p. 10).*
- C. Transfundir 2 CH para pasar de 9. *(error previsto: el estándar de 10 g/dL de 1942 que duró 60 años, p. 7-8; la
  2.ª bolsa no está indicada y suma riesgo, p. 16).*
- D. Pedir ScvO₂ y no transfundir mientras sea ≥50 %. *(error previsto: ignora que con coronariopatía la guía
  indica transfundir a Hb <8 (p. 8); la extracción del 50 % es un disparador propuesto (p. 8), no anula el umbral).*
Explicación: umbral 8 con cardiopatía isquémica o cirugía cardíaca/ortopédica; 7 en el resto del crítico estable (p. 8).
**2 · Piensa y destapa.** «Son las 4 h de la 2.ª bolsa de Carmen: disnea y SpO₂ 86 %. El adjunto, por teléfono: "¿TACO
o TRALI, y qué haces ya?". Son cuatro cosas.» Destapa, uno a uno:
- Parar la transfusión si no acabó y avisar al banco de sangre: vale para los dos (p. 14-16).
- Hacia **TACO**: IC previa, sobrecarga de líquido o insuficiencia renal (p. 16); hacia **TRALI**: PCR alta y ausencia
  de IC o de sobrecarga (p. 14-15). Los dos dan hipoxemia en 6 h y el TACO puede tener fiebre (30 %) (p. 16).
- Si es TACO: diurético de asa i.v. (p. 16). Si es TRALI: soporte como en el SDRA (p. 14-15).
- No pedir «otra bolsa más lenta»: el libro dice que el TACO no se relaciona con el número de unidades (p. 15; del ritmo de infusión no dice nada); antes
  de futuras transfusiones, corregir el balance positivo con diuréticos (p. 16).
**3 · Encuentra el error** (nota del R1 de la mañana; «hay 0, 1 o 2 errores»):
«Carmen, 71 a, IC crónica. Hb 8,4 tras 1 CH, todavía baja: cuelgo otro CH para dejarla por encima de 9. (1) Cada CH
sube la Hb ≈1 g/dL y el Hto ≈3 %. (2) Lo paso en 2 h, sin diluir: la dilución no hace falta en el paciente estable.
(3) Con solo 2 unidades el riesgo de TACO es despreciable, porque depende del número de bolsas. (4) Si hace disnea,
paro y pido Rx.» → Errores: la frase inicial (transfundir con Hb 8,4 en crítico estable sin isquemia: umbral 7, p. 8)
y la (3) (sin relación con el número de unidades; ≈1 % y más con IC previa, p. 15). (1) y (2) son ciertas (p. 10).
Tras marcar, cada error pide pensar la frase buena antes de verla.

## Nota visible de evidencia (en P4, plegable `.nota-plegable`)
«Por qué te dejamos equivocarte primero: resolver sin ayuda y recibir la explicación después mejora la comprensión
(fracaso productivo; evidencia **moderada**: 53 estudios, g 0,36, Sinha y Kapur 2021, Rev Educ Res). En medicina solo
hay un ensayo pequeño (42 estudiantes, sutura, Willis 2020, J Surg Educ). Durante el intento no te dimos pistas
porque añadirlas no mejoró el aprendizaje de los errores (Klein 2019, Adv Health Sci Educ). Sin esta explicación
después, el error solo no enseña.» (Referencias completas con DOI en `evidencia.md`.)

## Criterios clínicos para el constructor (REGLAS §4.8 R3)
| Regla | Cifra | Fuente |
|---|---|---|
| Tope del mando transfundir en Carmen | Hb ≥7 g/dL → fuera de indicación | p. 8 (`#mh-umbral-7`) |
| Aviso | tras la 1.ª bolsa, chip con los umbrales 7 y 8 | p. 8 |
| Sello | a las 4 h de la 2.ª bolsa; apaga el mando | p. 15-16 (`#mh-taco`) |
| Subida por bolsa | Hb +1 g/dL, Hto +3 %, ≈2 h por unidad | p. 10 |
| Modelo durante el goteo | gasto quieto (`gcFijo`), estado `transfusion` | fisiología general, ilustrativo (Fig. 12.4: solo DO₂ y VO₂) |
| TACO en el modelo | `pao2: 55, alveolo: 'taco'` (PaO₂ ilustrativa, ya rotulada en el modelo) | `ESTADOS.taco` |

## Huecos (no se rellenan; se anotan)
- Las constantes del edema (FR 30, PA 152/90, PVC 16, FC 110) y las de partida son fisiología general/ilustrativas:
  el libro solo da hipoxemia en 6 h, Rx con edema pulmonar y la IC previa (p. 15-16). Rotularlas.
- En el TACO el modelo deja el gasto en 7,6; en una IC real caería. El motor no modela el corazón que se encharca.
- ScvO₂ <70 % (algunas guías, p. 8-9) frente a extracción 50 % (Marino, p. 6-8): discrepan en Carmen (65 %, 34 %);
  se muestra la discrepancia, no se elige.
- Volumen de la bolsa y balance exacto: no en la ficha; no se dan cifras de balance.

## Lo que hace la maqueta (lista para tachar, R2)
Mando transfundir repetible (2 veces), ScvO₂ de control, «Dejar así» y «Parar aquí» con rama al mismo sello; aviso tras
la 1.ª bolsa; sello TACO con constantes y mando apagado; enseñanza en 6 pasos con el modelo; 3 preguntas en los 3
formatos con «Ver en la ficha»; «Lo que te llevas»; nota de evidencia; A/B/C. Sin texto libre, sin guardar nada.
