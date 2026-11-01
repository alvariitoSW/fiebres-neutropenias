# Auditoría A (fuentes) · b3-pulmon-estudio · 21 fichas del pulmón con respirador (Marino 23-30)
Método: muestreo dirigido. Texto del PDF con pdftotext frente al texto de la app (`js/modules/neumologia/merino-neumologia.html`). Figuras de barras (24.5, 26.4, 26.5, 29.1, 30.4) leídas en imagen.
Resultado: **0 graves, 0 huecos, 3 menores.**

## Por ficha (✅ = cifras y dosis muestreadas coinciden con el PDF; ❌ = fallo)
- ✅ asma-epoc-basicos: tabla PEFR (≥70/40-69/<40), hipercapnia <25 %, <200 L/min, Tabla 23.1 (20/1/1, 66/10/78, 2/80/1, 12/9/20), 2,5 mg frente a 0,36 mg (4 puffs), 12 % frente a 20 %.
- ✅ asma-agudo: Fig. 23.3 (comparada con la imagen, p. 21), Tabla 23.2 (albuterol, levalbuterol, ipratropio, corticoides, Mg 2 g en 15-30 min), epinefrina 0,3-0,5 mg y terbutalina 0,25 mg, ketamina 0,1-0,2 mg/kg y 0,15-0,25 mg/kg/h, 12 h, >100 mg sin dosis-respuesta.
- ✅ epoc-vpp: 88-92 %, NNT 9 y 1 de cada 6, 40 mg 5 días, discrepancia 10 mmHg frente a 10 %, con su nota.
- ✅ sdra-diagnostico: Tabla 24.1 (60/16/8/14/4/4/6/2/2), Tabla 24.2 (5 criterios), cortes 300/200/100, mortalidad 35/40/45, 15-25 % Rx, VPN 47 %, wedge ≤18, 80 % intubados en 48 h.
- ✅ sdra-no-ventilatorio: Fig. 24.5 (22/42/47 y 16/45, imagen p. 42), ≥9,5 mL/kg, Tabla 24.3 (dexametasona 6 mg, metilpred 1 y 2 mg/kg/día), nota de la Tabla 24.4, prono 8 h y 16 h.
- ✅ sdra-ventilacion: Tabla 24.5 (pH 7,15-7,30, FR 35, Vt hasta 4 mL/kg, meseta 30), PaCO₂ 60-70, ECMO <80 durante ≥6 h o <50 durante ≥3 h, 10-15 %.
- ✅ o2-indicaciones: 88-92 / 90-94, Tabla 25.1 (8 pacientes, igual que el PDF, incluida la SaO₂ 55 del paciente 4), Everest 253 mmHg, CaO₂ 92 mL/L.
- ✅ o2-sistemas: Tabla 25.2 (6 filas completas), HFNO 40-60 L/min, 2-3 cmH₂O con la boca cerrada, 30 % del Vt. La discrepancia 35-50 % / 60 % está anotada.
- ✅ o2-toxicidad: 95 % a agua y 3 % de ROS, umbral del 60 %.
- ✅ vni-metodos: IPAP 10-20 y PEEP 5-10, corte al 25 %, 18 % de fracasos por mascarilla.
- ✅ vni-uso: Fig. 26.4 (34/12 y 18/10) y Fig. 26.5 (10/22/33/47/50) en imagen, 10-20 % no responden, 10 % a 1 h.
- ✅ vm-modos: Cstat 50-80, 35 % de pared torácica, 3 mL/cmH₂O × 40 = 120 y 500 → 380 mL.
- ✅ vm-ajuste: 1/3 de fallos de disparo, 1-10 L/min, flujo ≥80, PEEP 5-8, Tabla 27.1 (nota de «<30»).
- ✅ vias-artificiales: 21/23 cm, >12 h lesión laríngea en más de la mitad, cuff 25 mmHg / 25 cmH₂O (nota).
- ✅ cuidado-barotrauma: NAC 10 o 20 %, angiocatéter 14 G de 8 cm en 5.º EIC, tubo torácico 4.º-5.º EIC, sliding.
- ✅ peep-oculta: PEEP «justo por debajo» de la medida, ≤3 en SDRA.
- ✅ nav-prevencion: ≥48 h, 2-4 / ≥5 días, 80 % y 60 %, Fig. 29.1 (52/22 y 31/10, imagen p. 37), Candida no.
- ✅ nav-diagnostico: 10⁵/10³/10⁴ con sensibilidad y especificidad 76/68, 61/77, 71/80, >3 % intracelulares, >10 escamosas.
- ✅ derrame-antimicrobiano: categorías 1-4 (pH 7,20, glucosa 60, −20 cmH₂O), Tabla 29.6 completa (incluye el régimen C y su §), 7 días.
- ✅ sbt: Tabla 30.1 (60-105; PImax «>−20» con nota), ~80 % tras 2 h, ~50 % de fuerza a 3 días.
- ✅ weaning-extubacion: PImax −120/−84 y −20/−30, fuga >110 mL con 95 %, metilpred 20 mg/4 h desde 12 h antes (22→3 %), Fig. 30.4 (65/66 y 61/51), VNI inmediata.

## Enlaces `#page=N`
Probados con un script: cada pie de figura o tabla que enlaza a una página (Figs. 24.2, 24.3, 28.1, 28.5, 29.3, etc.) tiene en esa página de ese PDF el «FIGURE/TABLE» que cita. 0 fallos. Los 8 capítulos de la bibliografía (pp. 15, 32, 56, 76 / 1, 17, 35, 50) caen en la portada del capítulo correcto.

## Graves
Ninguno.

## Menores
1. Fig. 23.3, paso 3 (merino-neumologia.html, bloque «Exacerbación aguda de asma»): la app pone solo «Incompleta (PaCO₂ <42)» y «Pobre (PaCO₂ ≥42)» y omite el PEFR de esas dos cajas (la figura pone 40-69 % y <40 %). Matiz perdido; no afecta a la conducta.
2. Ficha sdra-diagnostico: el título del acordeón «Los 5 criterios» es de la Tabla 24.2; la cobertura §4 lo llama «Tabla 24.1». Solo aviso para el Estudiar (las anclas `tabla-24-1` y `tabla-24-2` no deben cruzarse).
3. La tasa 22→3 % de edema laríngeo (weaning) sale de la Fig. 30.5 (imagen); solo se comprobó el 7× y el −50 % de reintubación del pie de figura.

## No comprobado / riesgo
Muestreo, no frase a frase: sin cotejar el texto íntegro de las fichas ni Tablas 24.4 y 29.3-29.5 por completo, 27.1 fila a fila, bibliografía numerada interna de cada capítulo, ni las cifras de figuras de otros capítulos (Figs. 28.x, 30.1-30.3). Las calculadoras y los clasificadores de las fichas (límites de entrada) no se han ejecutado.
