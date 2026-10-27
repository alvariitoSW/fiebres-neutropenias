# Busqueda IABP temporizacion (27/10/2026, PubMed via eutils)
Busqueda de partida: (intra-aortic balloon[tiab] OR intraaortic balloon[tiab] OR IABP[tiab]) AND timing[tiab] AND (inflation[tiab] OR deflation[tiab] OR waveform*[tiab]) = 48. Ampliada (counterpulsation/troubleshooting/review[pt]) = 131, poco especifica (shock cardiogenico, CIV). Tercera, con frases "early/late/premature inflation/deflation, delayed deflation" = 24. Busqueda en PMC (texto completo, acceso abierto) encontro la mejor revision.
Archivos: items.json, triage.html (8), cands.json, picker.html (6 pasajes), iabp-temporizacion.xlsx. Pasajes comprobados por cc.py.
## Mejores
1. PMID 39132456, DOI 10.1016/j.jscai.2024.101337. "The Intra-aortic Balloon Pump: A Focused Review..." (JSCAI 2024). PMC11307388, CC BY-NC-ND. PDF: https://pmc.ncbi.nlm.nih.gov/articles/PMC11307388/pdf/ (acceso directo da 403 desde aqui). Cubre los 4 errores, con figura de curvas.
2. PMID 36263076, DOI 10.36628/ijhf.2019.0015. Revision MCS en shock cardiogenico (Int J Heart Fail 2020). PMC9536734, CC BY-NC. PDF: https://pmc.ncbi.nlm.nih.gov/articles/PMC9536734/pdf/. Solo una frase-resumen de los 4 errores, sin curva.
3. PMID 36682892, DOI 10.1016/j.healun.2022.12.007. Desinflado retrasado (estudio clinico), solo resumen, no PMC. Matiza el desinflado tardio.
Otros en triage (solo resumen, sin PMC): 16881490 tutorial enfermeria 2006; 9095807 "Timing waveform analysis" 1996; 8194350 cinco puntos de la curva 1994; 10148160 tecnicas 1992; 25744191 ovejas (5 modos, nada uniformemente optimo); 21883317 retraso de la curva de la consola.
## Cobertura (39132456, pasajes literales de texto completo)
- Inflado precoz: cierre precoz de valvula, mas poscarga, menos GC; aumento diastolico antes de la muesca dicrotica, pierde la "V".
- Inflado tardio: aumento diastolico subOptimo, perfusion coronaria inadecuada; inflado bien despues de la muesca, pierde la "V"; PAD aumentada <= PAS no asistida.
- Desinflado precoz: menos reduccion de poscarga/demanda O2, flujo retrogrado coronario y carotideo posible; caida brusca tras el pico diastolico, PAS asistida >= no asistida.
- Desinflado tardio: balon aun inflado con valvula abierta, mas poscarga, isovolumetrica mas larga, mas demanda O2; PTD asistida >= no asistida, pico diastolico ensanchado.
36263076 confirma el efecto de los 4 (resumen). 
## Contradicciones / matices
- 36682892: retrasar el desinflado hasta inicio del QRS fue seguro y beneficioso (flujo cerebral +20 %, GC +15 %), frente a la idea de que "desinflado tardio" es siempre perjudicial (la revision lo define como balon aun inflado tras abrirse la valvula).
- 25744191 (ovejas sanas): la temporizacion convencional no fue uniformemente superior.
- 21883317: la curva de la consola va retrasada 70-175 ms respecto a la aorta, lo que limita el juicio visual.
No encontrado con esta busqueda: ninguno de los 4 errores falta; no se hallo en acceso abierto una descripcion de la curva de cada error mas antigua/clasica (tutoriales de enfermeria solo con resumen). Aviso: la "Tabla" xlsx no tiene filas en Evidence hasta que el usuario elija (no se ejecuto add).

## Elección del usuario y verificación (27/10/2026)
- El usuario eligió las cuatro: JSCAI 2024 (principal, PMID 39132456, PMC11307388, CC BY-NC-ND 4.0), Int J Heart Fail 2020 (PMID 36263076, segunda cita), J Heart Lung Transplant 2023 (PMID 36682892, matiz del desinflado tardío) y Artif Organs 2011 (PMID 21883317, retraso de la curva de la consola). Tabla: `iabp-temporizacion.xlsx` (7 filas, pasajes literales comprobados por `cc.py`); lista Vancouver: `referencias.md`.
- Verificación: título, autores, año y DOI salen del registro de PubMed (eutils). La comprobación cruzada con Crossref/OpenAlex (`/citation-verification`) no se pudo hacer: `api.crossref.org` está bloqueado en la red del entorno.
- PDF de la principal: no se pudo bajar (pmc.ncbi.nlm.nih.gov y europepmc.org bloqueados). Falta subirlo a `docs/` para enlazar con `#page=`.
- Pendiente (tarea `fuentes-b3`): construir los cuatro errores en la consola del balón con esta fuente (curvas recreadas, no la figura del artículo: licencia ND y regla de recrear gráficos).
