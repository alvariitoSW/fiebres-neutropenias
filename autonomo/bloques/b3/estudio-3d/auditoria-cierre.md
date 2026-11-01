# Auditoría ciega b3-cierre (frases nuevas) · rama auto/b3d-estudio 3d39722
Fuentes: Marino 2024 caps. 22-26 (A) y 27-30 (B), `pdftotext` de las páginas citadas. Resultado: 0 graves, 0 huecos, 9 menores.

## Cotejado y correcto
- ✅ Tope del balón (B p.21 «should not exceed 25 mm Hg»; p.22 «does not exceed 25 cm H2O»): la app usa 25 cmH₂O y lo dice en la nota `cuff-mmhg` (pulmon-vivo-data.js ~l.480, «discrepan») y en subglotica.js:18-19 («unos 25 mmHg»). Bien tratado; 25 mmHg ≈ 34 cmH₂O es correcto.
- ✅ Succión «usualmente no más de −20 cm H2O», puerto sobre el balón, 1992, menos NAV (B p.38) → subglotica.js:21,39; b3d-nav.js nvp-g9. Fuga por contacto no uniforme (p.22), biofilm y catéter (p.23, p.38) → nvp-g5, nvp-g8 bien.
- ✅ FiO₂ 60 % (A p.72 «threshold FIO2 ... set at 60%»), «mucho más bajo en el crítico» (p.72, lo infiere el propio libro), «lowest tolerable level». Rótulo «ficha» correcto; barras «ilustrativas».
- ✅ 6-12 h (ttraqueobronquitis, ↓CV), 3-4 días (5 comatosos), 4,5 días (1 voluntario) (A p.72): capilar-vivo-neutrofilo.js:92-99, tox-g5. ≥95 % / ~3 % ROS (A p.67). SOD pro-oxidante (p.69), GSH ×140 (p.70), vit. E (p.70-71): bien.
- ✅ Tabla 30.1 (B p.52): FiO₂ ≤50 %, PEEP ≤8, FR <40, FR/Vt 60–105, PImax > −20, Vt 4–6 mL/kg: sbt-g5, sbt-g6 y la nota de fidelidad PImax (tabla «> −20» vs. texto «−20 o −30») correctos. Distractor «PEEP cero» y «FiO₂ no importa» son falsos de verdad.
- ✅ as1-g6 (A p.15): «one of every four will not survive ... 40 % of survivors readmitted within a year ... need for mechanical ventilation strongest risk factor». Distractores falsos de verdad.
- ✅ dea-g7 (B p.47): los cinco factores (tardía, shock, MRSA/MDR previo, antibiograma 25 % resistentes, antibióticos <90 días) y la Tabla 29.6. El caso (60 días) cae dentro de los 90.
- ✅ nvd-g2 (B p.41, Fig. 29.3): espiración+supina, hemidiafragma elevado, confusión con neumonía basal.
- ✅ as1-g10 (B p.14-15): primero prolongar espiración (↑flujo, ↓Vt, ↓FR), PEEP externa «just below» la oculta solo si no basta. as2-c6 (A p.24 caps22-26): ketamina 0,1–0,2 mg/kg + 0,15–0,25 mg/kg/h 1–5 h; «mg/kg/min» falso de verdad. o2i-g2 (A p.57): 197/181/92 y la errata «64 %» (real 53 %) bien anotada. hipoxemia-60 (Marino cap. 9 p.68, 70-71): PaO₂ 45 → −20 %, Hb 7,5 → 10 mL/dL ✓.
- ✅ Mira de la 11 (A p.85-87): poscarga = P cámara − P pleural (Ec. 26.1), pulso paradójico >10 mmHg, hipovolemia magnifica el efecto. Correcto.

## Menores (con archivo:línea)
1. ❌ js/data/mayeutica/b3d-tubo-2.js:167-174 (baro-c4): enunciado y modelo dicen «PAM 52», la nota dice «La PAM de 59 sale del monitor». Cifra inventada incoherente consigo misma; unificar (cuál sale del monitor).
2. ❌ b3d-destete.js:186 (sbt-c5): «FR 34, Vt 173» y «cociente de 199»: 34/0,173 = 196,5 (≈197). Probable Vt sin redondear en el monitor; el lector que lo calcula no obtiene 199. Poner Vt 171 o cociente 197.
3. ❌ b3d-sdra-2.js:187-190 (snv-c3b): la advertencia de toxicidad por O₂ (FiO₂ ≥70 %, antioxidantes/glutatión, «idéntica al SDRA») está en A p.41, no en la p.40 que cita. Cambiar a p.41 (p.40 solo da «intubar antes que después»).
4. ❌ b3d-nav-2.js:63-71 (dea-g7), distractor 3: «La ficha dice «todo lo siguiente»: cada factor ... lleva al régimen de alto riesgo». El libro dice «include all of the following» (lista), no que baste uno; lo que lo apoya es la frase de B p.47 «without septic shock or any of the other risk factors» para bajo riesgo. Reformular con esa frase.
5. ❌ b3d-asma.js:53-60 (as1-g10), distractores: «Más FR acorta aún más la espiración y atrapa más aire (p.15)» y «caería su presión arterial» no están literales en p.14-15 (p.14 solo da subir flujo/bajar Vt/FR para mejorar I:E). Es deducción razonable; sin rótulo. Rotular «fisiología general» o citar B p.14 + Marino cap. 28 (PEEP oculta, p.31-33).
6. ❌ capilar-vivo-data.js:462 y capilar-vivo-neutrofilo.js:97: «a las 6-12 h hay traqueobronquitis» sin decir que es en voluntarios sanos con O₂ 100 % y que el libro lo atribuye a atelectasia por absorción; los 3-4 días son 5 pacientes en coma. Contexto de la cifra (§1.12): añadir «voluntarios sanos» / «en coma». (tox-g5 sí dice «voluntarios sanos».)
7. ❌ subglotica.js:18: «más presión no sella mejor y daña la tráquea»: el libro solo dice que >25 comprime capilares e isquemia; «no sella mejor» es deducción (la p.22 sí permite poner más aire si hay fuga). Rotular «ilustrativo/deducido».
8. ❌ subglotica.js:22,30: «un poco baja por los pliegues aunque esté inflado»: B p.38 dice solo que el balón «does not prevent aspiration». «Por los pliegues» y «un poco» son ilustrativos; el rótulo del pie lo cubre solo en parte («cifras del dibujo»).
9. ❌ pulmon-vivo-data.js:~472 y 489: tope de balón 25 cmH₂O con «ficha» en la etiqueta y el motivo (capilares 25 mmHg) en mmHg; coherente con la nota, pero el rótulo del mando (subglotica.js:38) dice «tope 25 … isquemia» en cmH₂O sin mencionar mmHg. Añadir «(el libro da 25 mmHg y 25 cmH₂O)».

## Casos clínicos
Ninguno pide algo que la fuente no diga; los datos de paciente van como «inventados/ilustrativo».

## No comprobado / riesgo
- No leí pulmon-vivo corazon.js/neumotorax.js (frase por pulsación, 7 pulsaciones al sello): solo baro-c4. No abrí la app en navegador, ni comprobé que todos los enlaces `#page=` abran la página exacta; confié en que `p()` usa página de PDF (coincidía en las ~20 comprobadas).
- as1-g6 (id `nep-asma-epoc-ominoso`) y los textos de fichas no se cotejaron; solo preguntas.
