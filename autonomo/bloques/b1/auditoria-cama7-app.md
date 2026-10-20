# Auditoría ciega · La cama 7 en la app (muralla, telar, inmersión) · 20/10/2026

Fuentes: A = `docs/marino-2024-acceso-vascular-practicas-caps1-4.pdf` (págs. del PDF 57-73), B = `docs/marino-2024-practicas-monitorizacion-caps5-9.pdf` (págs. 1-32).
Leídos los dos tramos completos en texto, y las Figs. 5.1 y 6.1 en imagen. Archivos: `js/data/{muralla,telar,inmersion}-viva-data.js`,
los `*-viva.js`, `*-escena.js`, `*-viva.html` y `js/data/mayeutica/b1-sin-modelo.js` (tf-e3).

**Resumen: 1 grave (no clínico) · 4 huecos · 11 menores.** Ninguna cifra, dosis o umbral visible contradice la fuente.

## 1. Los graves de la auditoría anterior siguen corregidos

- **G1 del FP4 (telar)**: corregido. `telar-vivo-data.js:131` («sin dato»), `telar-vivo.js:142`, `telar-vivo-escena.js:430,641-643`,
  `telar-vivo.html:93`, `tl-g5` (:303-310) y el concepto «La TIH» (:230-235) dicen solo lo que da B p.8: se puede usar con TIH sospechada o previa,
  se ha usado en la confirmada, y el tratamiento aprobado es el argatrobán. Ya no sale «sin complejo no hay IgG».
- **M11 (TIH/argatrobán)**: corregido. Día 6 de Rosa (`telar-vivo-data.js:415,420`): «Piernas: sin edemas ni dolor» y «sin trombosis por ahora»;
  `tr-4` (:428) y «lo que te llevas» (:450) mandan al argatrobán si se confirma o hay trombosis (B p.8).
- **M23 (FDA 4 mg/kg/h)**: quitado; no queda en ninguno de los tres.
- **M4 (C. difficile «crece en el estómago»)**: corregido (`muralla-viva-data.js:185,290,324`: «×3», sin decir que crezca en el estómago; A p.70).
- **Nombres internos**: no hay «mar-…», «§», «Caso E…», rutas ni `<code>` a la vista (los `f:`/`fuente` pasan por `chipTxt`; los códigos de caso no se pintan).
  Queda **un** resto, abajo (G1).

## GRAVE

- **G1 · `inmersion-viva.html:86`**: nota plegable visible «Cambios frente al diseño. (1) … (2) … el plan con errores pedía tres …; las reglas de las
  preguntas permiten dos, así que el QTc de 520 se pregunta en el Examen … (3) …». Es texto del plan, no del libro (mismo criterio que T1-T6). Quitarla.

## MENOR

- **M1 · fondaparinux con ClCr 30-35 · `telar-vivo-data.js:76,437`, `telar-vivo.html:88`, `b1-sin-modelo.js:257-263` · B p.4 y 8.**
  Tabla 5.2: 1,5 mg con 35-50 y no usar con <30; texto: 1,5 mg con 20-50 y no usar con <20. A 32 la tabla calla (ni ajuste ni «no usar»); la calculadora
  dice «discrepan aquí (ClCr 32)» y la nota «Ninguna cubre el tramo 30-35» se lee como que el texto tampoco (el texto sí lo cubre). En `tf-e3`, la opción
  «2,5 mg al día» es la lectura literal de la tabla sola, y su «porque» («ni la tabla ni el texto dejan la dosis plena») no está en la fuente.
- **M2 · Tomás, semana 4 · `telar-vivo-data.js:523-532, 543, 549-551` · B p.2, 12, 13.** «La inflamación de la lesión ha cedido» es un dato inventado que la fuente
  no da (solo «riesgo alto 3-4 semanas» y «probablemente la inflamación»). La respuesta correcta de `tt-3` («se para») es la opinión del autor frente a la
  Tabla 5.1 (que lista la inmovilidad); la nota lo dice. Pero «lo que te llevas» nº 2 (:550), `tt-4` punto 1 (:536) y `tt-5` (:543, «Suspendo la enoxaparina» como buena)
  dan «después se suspende» como regla, sin «según el autor».
- **M3 · páginas de la cirugía bariátrica · `telar-vivo-data.js:181,566`.** Cita p.11; las dosis (40 mg/12 h con IMC 30-49, 60 mg con ≥50, ~2 semanas) están en B p.12
  (el encabezado queda al pie de la 11).
- **M4 · página de la Tabla 4.3 · `muralla-viva-data.js:132-136`, `muralla-viva.html:85`.** Cita p.68; el título está en A p.68 pero las filas con las dosis, en A p.69.
- **M5 · «(los cocos)» · `muralla-viva-data.js:251`.** La fuente dice «grampositivos» (A p.64); la glosa «los cocos» sin «del dibujo» lo restringe (`muralla-viva.js:168` sí lo cualifica).
- **M6 · `muralla-viva-data.js:534` (A p.63-64).** «La clorhexidina se mantiene mientras dependa del respirador» omite que las guías retiraron la recomendación (que la misma página, y la app en :257 y :523, sí dicen).
- **M7 · `inmersion-viva-data.js:541` (e8-5) y :380-385 (e4) · B p.27.** Se marca como error «es la benzodiacepina de elección en perfusión prolongada», que el capítulo afirma
  literalmente («Lorazepam is thus the benzodiazepine-of-choice»). La corrección («es el dato de un estudio») elige ganadora, y `inmersion-viva.html:78` dice que no elige. El error real es «dejarla como está» con >10 mg/h más de 48 h.
- **M8 · SIP · `inmersion-viva-data.js:391,393`, `inmersion-viva-escena.js:306,358` · B p.28.** «CK ↑» y «FEVI que cae de golpe» no están en la fuente (dice rabdomiólisis, insuficiencia cardíaca
  sistólica, acidosis láctica): inferencias razonables sin rótulo. La corrección de :393 se apoya en «inestabilidad hemodinámica», que la nota no plantea; el error real (más propofol ante un SIP) la fuente solo lo cubre con «soporte».
  La PA va «↓↓ · sin cifra» (bien), pero la FC del SIP sale con cifra ilustrativa (~83).
- **M9 · `e4-3` (`inmersion-viva-data.js:439-445`) · B p.19-20.** Con ClCr 25 la hidromorfona «sin ajuste» (Tabla 6.2; p.20) es también defendible; el fentanilo lleva «¿evitar?» en la insuficiencia renal. Solo se descarta
  «hidromorfona al 50 %». Defendible, pero la nota solo reconoce la duda del fentanilo.
- **M10 · `telar-vivo-escena.js:652`.** El tablero dice «Ya se puede: … enoxa» a las 24 h sin «1/día» (el anillo sí: «Enoxa 1/día»); con pauta cada 12 h la fuente no da cifra (B p.9-10).
- **M11 · `inmersion-viva.js:170` · B p.21, 28.** «Responde a líquidos o a pequeños bolos de vasopresor» es del texto de los opioides y se aplica también al propofol, de cuya hipotensión B p.28 no da tratamiento.

## HUECO

- **H1 · B p.19 (Tabla 6.2)**: bolos e infusiones de morfina (2-4 mg/1-2 h; 2-30 mg/h) e hidromorfona (0,2-0,6 mg; 0,5-3 mg/h) y el bolo del fentanilo (0,35-0,5 µg/kg/0,5-1 h): ni en la escena ni en «Para profundizar».
- **H2 · B p.11 (cirugía general)**: «dosis altas populares en alto riesgo (HNF 5.000 U/8 h; enoxaparina 30 mg/12 h) con CNI añadida». `telar-vivo-data.js:566` solo trae los tiempos.
- **H3 · B p.12 (bariátrica)**: ~80 % de las ETV posoperatorias ocurren tras el alta (la razón de la profilaxis extendida).
- **H4 · B p.23 (ketamina)**: náuseas e hipersalivación; `in-e3` (:334) cita solo PA, FC y broncodilatación.

## Comprobado sin diferencias (cifras en pantalla)

HNF 5.000 U/8-12 h y 7.500 U/8 h (IMC ≥40); enoxaparina 40 mg/día o 30 mg/12 h, 40 mg/12 h con IMC ≥40, 30 mg/día con ClCr <30 (HNF la mejor <20); dalteparina 2.500-5.000 U y su nota de B p.11;
fondaparinux 2,5 mg, 1,5 mg con 35-50, 17 h; ACOD y warfarina (Tabla 5.3); anti-Xa 0,2-0,5; reloj neuroaxial 12/24/24/48/48 h; medias 18/8 mmHg, CNI 35-40/20 mmHg cada 10 s, nunca sobre la diastólica;
Fig. 5.1 (60-80 / 40-80 / 40-60 / 20-50 / 15-40 / 10-30 %); morfina −50 % en IR, hidromorfona sin ajuste, fentanilo ×600; ketorolaco 30/15 mg; ketamina µg/kg/h con la errata anunciada; RASS −1/−2;
Tabla 6.7 (13 min/25 h, 34 min/59 h, 3,3/71 h, 3,4/74 h); midazolam ≤48 h; lorazepam >0,1 mg/kg/h o >10 mg/h más de 48 h, hiato >10; dexmedetomidina 6-10 min; SIP >80 µg/kg/min o >5 mg/kg/h, 36, 3 %, 30-35 %;
haloperidol 5/10 mg, 25 % cada 6 h (4-6 h), QTc >500, 3-4 %; Fig. 6.1 (~80 % y ~43 %); Tabla 4.2 (8-10/4-8/2-4/1-2 %) y su regla; famotidina −50 % con ClCr <50; Fig. 4.6 (4,2→2,5; 21,9 frente a 22,6; 3.298);
SDD (cefuroxima 4 días, −33/−67 %), probióticos (2 días, 19 estudios), Tabla 4.4, acidofobia (pH), FDA 2013.

**No comprobado / riesgo**: no pude abrir la app en un navegador (no hay Chromium aquí): lo visible lo deduje del código y de los `.html`; si algún `f:` llegara a pintarse sin pasar por `chipTxt` podría verse un «mar-…».
No cotejé las barras de las Figs. 4.4 y 4.5 ni las fichas de `marino-fundamentos.html`, ni los enlaces a Merino Neumología y Sobrevivir a la UMI (fuera de los PDF).
