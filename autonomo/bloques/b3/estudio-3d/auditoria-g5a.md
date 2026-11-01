# Auditoría ciega G5 (fichas 14, 15, 20, 21) · Marino cap. 28 (p. 17-31) y cap. 30 (p. 50-61)
Resultado: 1 grave, 0 huecos, 8 menores. Páginas = páginas del PDF. Revisado todo `b3d-tubo*.js`, `b3d-destete*.js`, `visual-3d-g5.js`, `visual-3d-g5b.js`.

## Graves
- ❌ G1 `b3d-destete.js` sbt-c1 (puntos 3 y 4) y sbt-g5: «Estable: la noradrenalina no ha subido» y «RASS 0: despierto y cooperador» con hl-verde y cita pág. 52. La Tabla 30.1 y el texto (p. 52) solo dicen «Hemodynamically stable» y «awake or arousable and cooperative»: no definen estable ni admiten vasopresor, y no citan RASS. Decide la conducta (hacer la prueba) y falta nota «la fuente no define». Buscar y citar: Girard 2017 ATS/ACCP (ref. 2 del cap.) o Boles 2007 ERS/ATS (criterios de disposición con vasopresor a dosis bajas), y Sessler 2002 para RASS.

## Menores
- M1 `b3d-destete-2.js` ext-g3 (expl.) y ext-c1 (expl.): cifras SvO₂ 65-66 %, 61→51 % citadas pág. 56; están en la Fig. 30.4, que es la pág. 57 (la 56 solo nombra la figura). Valores correctos (leídos en la imagen).
- M2 `b3d-destete.js` sbt-e2 («valores aproximados del texto») y `visual-3d-g5b.js` (Figs. 30.2 y 30.4, «que da el texto de la ficha»): 50/40/90 J/L están en la figura (p. 53), no en el texto de Marino; en sbt-g7 se cita pág. 52-53 para la cifra. Rotular «de la figura».
- M3 `b3d-destete.js` sbt-c2/ext-c4 (PImax −30 como dato favorable): pág. 58 dice que la ventilación se amenaza «al caer a −20 o −30»; la tabla escribe «> −20». La nota de sbt-g6 lo recoge, pero el caso usa −30 sin aviso.
- M4 `b3d-destete.js` sbt-g10 (expl.): «Por eso la prueba se hace conectado al ventilador»; la fuente (p. 52-53) dice que es lo popular y que ningún método es mejor, el tubo en T también vale.
- M5 `b3d-tubo-2.js` baro-c1 (error 2) y su explicación: «su ausencia o presencia no es fiable», cita pág. 26. La fuente solo dice que la ausencia de ruidos es poco fiable (los ruidos del tubo se confunden); la presencia es una extensión razonable sin respaldo literal.
- M6 `b3d-tubo-2.js` baro-c4, distractor 3: el «porque» (subir PEEP/volumen empeora el gasto, cita pág. 27-28) no está en la fuente; es fisiología general sin rótulo.
- M7 `b3d-destete-2.js` ext-c5: «lleva siete días intubado» el día 9 del caso (el caso ya dice día 7 de ventilación el día 7). Incoherencia interna del paciente, no de la fuente.
- M8 `b3d-tubo.js` tubo-c1: el «hueco» 177,8-180,3 cm (70,9") es lectura de la ficha/calculadora sobre pulgadas enteras (p. 17 dice 5'10" y 5'11"). Está bien tratado; conviene rotularlo «lectura de la ficha», no «la fuente no da tamaño».

## Comprobado y correcto (✅)
- ✅ (1) Rafael 1,80 m: calculadora devuelve «hueco» (70,9"); distractores citan 177,8/180,3 y p. 17; tubo-e1 (185 cm → 8) bien.
- ✅ (2) 25 mmHg (p. 21) / 25 cmH₂O (p. 22): tubo-g11 y tubo-e4 con nota «las fuentes discrepan», no error del residente; en tubo-c5 el error es 40 cmH₂O (supera ambos). 25 mmHg ≈ 34 cmH₂O correcto.
- ✅ Cap. 28: T4-T5, 3-5 cm, ±2 cm, 21/23 cm, >½ laringe, >2 sem, traqueo 1.ª sem/2 sem, <1 %/<5 %/2-10 %, decanulación 1 semana, estenosis 0-15 %/6 meses, 14 G 8 cm 5.º espacio, 8,5-14 Fr, −20 cmH₂O, NAC 10 %/20 %, 300.000 colonias, 3-10 %/35 %: todo coincide. Todas las páginas de la ficha 15 verificadas.
- ✅ (3) Ficha 20: «sin PImax no se puede decidir» como error está respaldado (p. 58: dificultad para la maniobra, valor limitado); opiáceo sin dosis y rotulado «la fuente no da dosis»; PImax «>−20» frente a «−20 o −30» con nota de fidelidad (sbt-g6); Vt 4-6, FR<40, 60-105, ≥90 %/≤50 %/≤8, ~80 %, 5 cmH₂O, 50→40 J/L (figura): bien. Cálculos del caso (PBW 68, 6,6 mL/kg, 67, 136, 5,0 mL/kg, 65) correctos.
- ✅ (4) Ficha 21: 22→3 % edema y 8→4 % reintubación, N 343/355, p<0,001/0,02 (leído en Fig. 30.5, p. 60; el distractor «8→4 / 22→3» invertido es falso); metilprednisolona 20 mg/4 h, 1.ª dosis 12 h antes (p. 59); fuga 110 mL, >110 ≈95 %, <110 ×7 (p. 59); 40 % cardíaco (p. 55); estridor 50 %, 30 min/2 h (p. 60, «observación del autor» rotulado); ScvO₂ cae; CPAP, diuresis, nitroglicerina; Mg/P; −120/−84; papel 1-2 cm; edema 1-10 %; VNI inmediata. Sin otra opción también correcta detectada.
- ✅ Visual: Fig. 30.1 (controlada ≈50 % menos, asistida algo por debajo de la espontánea) coincide con la imagen p. 51; resto de nodos coinciden con la fuente.

## No comprobado / riesgo
- No abrí las fichas HTML (`nep-…`) ni comprobé que los enlaces `#page=N` abran la página; solo cotejé el texto de las preguntas con el PDF. Referencias bibliográficas del cap. 30 (Girard 2017, Boles 2007) no verificadas en la web.
