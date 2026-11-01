# b6b · Otra fuente para el eje hormonal (REGLAS §1.15)
Fecha 01/11/2026. Todo lo web se abrió con WebFetch. Citas literales en inglés se traducen abajo; las cifras van tal cual.

## 0. Fuente en el repo (la mejor: está en la app)
- Libro Azul, Sección VI Endocrino, cap. 45 «Respuesta endocrina al estrés», `docs/libro-azul-seccion-vi-endocrino.pdf` (PDF de 10 pp.; páginas impresas 810-811; eje suprarrenal en PDF p. 4, tiroideo en PDF p. 5-6).
- Eje suprarrenal: en la fase aguda sube el cortisol por más CRH y ACTH; desaparece la variación diurna; en la fase tardía «el hipercortisolismo persiste... los niveles de ACTH se reportan como normales o bajos» (disociación ACTH-cortisol; posible freno de la degradación del cortisol).
- Eje tiroideo: TRH hipotalámica → TSH (pulsátil) → T4 (principal producto) y T3 (la activa); desyodasas activan T4→T3 o la desvían a T3r inactiva; las hormonas tiroideas retroalimentan sobre TRH y TSH. Fase inicial: T3 baja rápido y T3r sube, TSH y T4 suben transitoriamente y se normalizan = «síndrome de T3 baja». Fase tardía: T3 y T4 bajas por pérdida de secreción pulsátil de TSH y menor expresión de TRH.
- El Manual UMI (partes 1 y 2) y `js/modules/fisio-uci/` no tratan estos puntos (grep sin resultados).

## 1. Supresión del eje por corticoides exógenos (HHS)
- Younes AK, Younes NK. «Recovery of steroid induced adrenal insufficiency». Transl Pediatr 2017;6(4):269-273. DOI 10.21037/tp.2017.10.01 · PMID 29184808 · https://pmc.ncbi.nlm.nih.gov/articles/PMC5682381
- Los glucocorticoides «exert negative feedback inhibition at the pituitary and hypothalamus levels» (inhiben hipotálamo e hipófisis). En la fase tardía de supresión (uso crónico) baja la transcripción de POMC y la síntesis de ACTH.
- «In the absence of ACTH, the adrenal glands undergo atrophy» (sin ACTH, la suprarrenal se atrofia).
- Recuperación: puede tardar «anywhere from 6-12 months» (resumen); si el corticoide duró <10-14 días, el eje «recovers fairly quickly»; en tratamiento prolongado no se detecta recuperación antes de ~4 semanas; reevaluar cada 1-2 meses.
- Dato extra visto solo en el fragmento de búsqueda, no abierto: 13 % con insuficiencia persistente a las 20 semanas (atribuido a este mismo artículo). Hueco: cifra por dosis/duración en adulto.

## 2. Eje tiroideo, desyodasas y eutiroideo enfermo
- Huang SA, Bianco AC. «Reawakened interest in type III iodothyronine deiodinase in critical illness and injury». Nat Clin Pract Endocrinol Metab 2008. PMID 18212764 · https://pmc.ncbi.nlm.nih.gov/articles/PMC3133953
- D1 y D2 convierten T4 en T3 activa; «D3 is the main inactivator of both T4 and T3» (D3 inactiva ambas; T4→rT3).
- Patrón: «low serum levels of T3 and high levels of the inactive metabolite reverse T3 (rT3)»; en el crítico «this is followed by a decrease in serum T4 and serum TSH levels».
- «D3 re-activation during illness is associated with a fall in serum T3 levels»; la D2 muscular está estable o aumentada.
- La cadena TRH→TSH→T4/T3 y la retroalimentación negativa están en el Libro Azul (sección 0); no hace falta otra fuente.
- Nota de fuentes: la causa (D1 baja vs D3 alta) se discute en la literatura; mostrar ambas, no elegir.

## 3. CBG, albúmina y cortisol libre en el crítico
- Langouche L, Téblick A, Gunst J, Van den Berghe G. «The Hypothalamus-pituitary-adrenocortical Response to Critical Illness: A Concept in Need of Revision». Endocr Rev 2023;44(6):1096-1106. PMID 37409973 · https://pmc.ncbi.nlm.nih.gov/articles/PMC10638597
- «The circulating levels of CBG fall within hours after onset of illness and remain low throughout the ICU stay»; la caída de CBG de alta afinidad es «proportionate to the severity of septic shock»; albúmina también baja.
- «Plasma free cortisol concentrations are high because of reduced cortisol plasma binding proteins»; cortisol total y libre elevados al ingreso.
- Vida media del cortisol «on average 8-fold longer» que en sanos; producción diurna «not increased or less than double»: ~30-60 mg/día (extrapolado por los autores).
- Hueco: cifra de CBG en mg/L o nmol/L con fuente abierta. Solo vista en resúmenes de búsqueda (no abierta): CBG <200 nmol/L en shock séptico (estudio de 2022, 3,2 veces más mortalidad) y PMID 11685298 (Intensive Care Med 2001, CBG muy baja, normal desde ~día 7).

## No comprobado / riesgo
- Springer y endocrine.org no resuelven en la sesión: PMID 11685298 y 30160799 no se abrieron.
- Páginas del PDF del Libro Azul sacadas con pdftotext, no vistas en el visor.
- Younes 2017 es pediátrico; los tiempos en adulto pueden variar. No se encontró StatPearls.
