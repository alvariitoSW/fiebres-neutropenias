# Auditoría ciega G5 (NAV, fichas 17-19) — Marino cap. 29, PDF págs. 35-48
Resultado: 2 graves, 2 huecos, 9 menores. Verificado contra el PDF (texto y Fig. 29.1 rasterizada).

## Graves
1. G-1 · b3d-nav-2.js:200-208 (dea-c6, día 13) · Fuente p.48 («7 days») no dice nada del derrame. La nota «La fuente no lo dice» deja el hueco sin buscar otra fuente (REGLAS §1.15; no trivial: empiema/derrame complicado por Pseudomonas, con segundo tubo y VATS). El caso da por «correcta» la opción de 7 días «completada» y castiga «mantenerlo mientras el tubo siga» como error: puede castigar una conducta defendible. Buscar: AATS 2017 (ref. 36 de Marino) y BTS pleural infection 2023 (duración en infección pleural). Además, datos del caso incoherentes: «7 días de cefepima dirigida» el día 13, cuando la cefepima empieza el día 9 (serían 4; 7 días solo si cuentan desde el día 6).
2. G-2 · b3d-nav.js (nvd-e2, opción 3 y su «porque») · «el aspirado necesita 10⁵ por su contaminación con la boca y el cepillo, 10³»: la fuente (p.42-43) da los umbrales sin justificarlos así (causal sin apoyo ni rótulo, §1.11). Además llama a 10³,10⁴,10⁵ «el orden inverso»: el inverso sería 10⁴,10³,10⁵. Bajo impacto clínico.

## Hueco
- H-1 · p.36 Tabla 29.1 fila «None identified» (25/22/38 %) y «Polymicrobial» por columna: en la Mira sí están (barras), pero ninguna pregunta usa que en la HAP el 38 % no tiene aislamiento.
- H-2 · p.46: la categoría 3 «también se llama derrame complicado» solo está en profundizar/explicación suelta (dea-e5), no en una pregunta de categorías.

## Menores
- M-1 · «Razón de probabilidades» (nvd-g1, e1, e5, c1, Mira 5C) traduce «diagnostic odds ratio» (p.40/43) sin «diagnóstica»; en estudio se confunde con la razón de verosimilitud. La ficha sí dice «razón de probabilidades diagnóstica» (merino-neumologia.html:357). Unificar.
- M-2 · nvd-g5 (distractor 3) cita p.42 para «antes del antibiótico»: esa frase está en p.45. nvd-g2 cita Fig. 29.3 en p.40; el rótulo está en p.41.
- M-3 · dea-g7: «La ficha dice "todo lo siguiente"» (p.47 «include all of the following» es una lista, no una condición); que basta uno es inferencia válida (el bajo riesgo exige ninguno) pero no es cita.
- M-4 · dea-g12 y Mira «La que elige»: «la tercera es la más apropiada» (p.48) es opinión de Marino; la explicación la dice sin rótulo «opinión del autor» (el enunciado sí dice «¿cuál elige?»).
- M-5 · nvd-c5 aplica el umbral 10⁴ (BAL) al mini-BAL; la fuente solo dice «rendimiento equivalente» (p.44), no da umbral propio. Rotular «umbral del BAL».
- M-6 · dea-g8 distractor 3: «toxicidad propia de un aminoglucósido» rotulado «fisiología general»; no es trivial para §1.15. Citar (p. ej. el capítulo de nefrotoxicidad de los PDF de Marino/KDIGO ya en docs/).
- M-7 · Fuente (p.36): «guías más recientes» de VAP desaconsejan clorhexidina y prefieren SOD con ref. (3) = Koulenti, estudio EU-VAP, no una guía. Las fichas 17 repiten «las guías ya no la recomiendan» (nvp-g5, g8, c3); falta una nota de fuente o una guía real (p. ej. SHEA/IDSA 2022 compendio).
- M-8 · Consecuencias de distractores sin apoyo (nvp-g1 «buscar gérmenes del respirador», dea-g5 «pauta pensada para otro ámbito», dea-e3 «vancomicina y un carbapenem de más», nvd-e3 «retrasaría el tratamiento dirigido»): razonables, no están en la fuente.
- M-9 · La Mira de ficha 19 (flujo Tabla 29.6) muestra B con pip-tazo/cefepima/meropenem y C con levofloxacino sin la nota de la discrepancia prosa/tabla (sí en dea-g9/e6). Antecedente «amoxicilina-clavulánico» es «iv» en ficha 17 (c5) y sin vía en ficha 19.

## Comprobado sin discrepancia
- SOD: colonización 52→22 %, neumonía 31→10 %, p ≤0,01 (Fig. 29.1, p.37): ✓, no cruzados.
- Umbrales 10⁵/10³/10⁴ y razones 6,6/5,1/9,6, sens/espec 76/68, 61/77, 71/80; >10 escamosas; >25 neutrófilos; 20 % del enjuague; cualitativo >90 %/15-40 %; BAL 120 mL, 6×20, ≤25 %, primero descartado; >3 % intracelulares >90 %; mini-BAL 50 cm, 10-20 mL: ✓.
- Tabla 29.3: 66/54/2,3; 64/59/2,6; 77/39/2,1; 89/26/2,8 ✓. Errata «Tabla 29.4» en p.40 rotulada bien (nvd-e1, e6); texto no corregido en silencio ✓.
- Tabla 29.5 (categorías, pH 7,20, glucosa 60, 10 mm, 50 %, tubo 8,5-14 y 28-36 Fr, −20 cmH₂O, fibrinolíticos, VATS) ✓. Cinco factores, 25 %, 90 días, regímenes Tabla 29.6, levofloxacino en C y nota de la prosa «β-lactámico», 7 días, cultivos negativos suspender ✓.
- Opiniones: cabecera (nvp-e3 nota, nvp-c1, Mira), método preferido (nvd-g12 nota, Mira «El autor») rotuladas como opinión; ningún caso castiga seguir la guía. La duda del paquete: el texto dice que el paquete reduce la NAV (p.37) y la duda del autor es solo de la cabecera ✓.
- «Cobertura» reescrito: sentido igual al de la Tabla 29.6 y al párrafo de alto riesgo (p.47) ✓.
- Sin distractor cierto según la fuente; solo dea-c6 (G-1) tiene opción defendible fuera de la fuente.

## No comprobado / riesgo
- No abrí los ids `nep-*` de merino-neumologia.html ni el selector `#neumo-cultivo-select` (fichas ya auditadas); no ejecuté jueces. Las erratas de la fuente que no se citan (p. ej. «ICI-acquired», ref. 3 mal etiquetada) solo las detecté en M-7.
