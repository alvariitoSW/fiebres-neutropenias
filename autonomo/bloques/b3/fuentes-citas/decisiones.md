# fuentes-b3 · qué se hace con cada cosa sin cita (director, 27/10/2026)

Base: `lista-sin-cita.md` (auditor) y los tres informes de búsqueda (`citas-shock.md`, `citas-ritmo-receptor.md`,
`citas-pulmon.md`), con PMID/DOI comprobados en PubMed o Crossref. Criterio (REGLAS §1.15, CLAUDE.md §7.5): lo que tiene
fuente se cita con su frase; si la fuente dice otra cosa, se cambia el texto; una cifra que no está en ninguna fuente no
se justifica: se rotula **«ilustrativo»** y, si lo hay, se añade el apoyo más cercano como nota. Lo que depende de una
guía que no se puede abrir desde aquí queda **pendiente del usuario** (PDF a `docs/`).

## Pulmón (solo maqueta `autonomo/maquetas/b3-pulmon/`) → lo aplica `wt/b3-citas`
| Id | Qué se hace |
|---|---|
| P3 | 12 mL/kg: cita ARDS Network NEJM 2000 (PMID 10793162; brazo tradicional, 12 inicial) + Marino cap. 22 p. 46 (12-15). Fuera «ilustrativo». |
| P5 | FR 35: Marino cap. 27 p. 14 (tabla 27.1). Por encima: Marino p. 55 (hiperinflación, auto-PEEP, menos gasto) + Tuxen 1987 (PMID 3662241). |
| P8 | Compliance 50-80 normal y <25 en edema/SDRA: Marino cap. 27 p. 6. El suelo 15: «ilustrativo». |
| P7 | Detener ventilación: cae la SpO₂ y sube el CO₂ en minutos: Farmery 1996 (PMID 8777112), Benumof 1997 (PMID 9357902), Eger 1961 (PMID 13725901). Sin cifras por minuto. |
| P2 | Mecanismo de la auto-PEEP: Marino p. 31-33. El tope 20: «ilustrativo» (Marini 2011, PMID 21700908, como lectura). |
| P1, P4, P6, P9 | VMe 2-20, alarma Pmáx 45/50, Ti 0,2 s, R 5/20: «ilustrativo» (ninguna fuente da esas cifras). En P4, nota: pico ≠ meseta (meseta ≤30, Marino p. 14; Tuxen 1987). |

## Shock (app `shock-vivo/`, archivos de la sesión «b3 parada 2») → los aplica esa sesión o, al liberarlos, esta tarea
| Id | Qué se hace |
|---|---|
| S2 | G5: Gillespie 2024 p. 8 «reach a peak higher than the previous systolic upstroke». ✅ |
| S3 | G6: contraindicación de la IAo, Trost & Hillis 2006 (PMID 16635618). El porqué sigue «fisiología general» (el resumen no lo da). |
| S5 | PVC >12: «ilustrativo» + nota «la PVC predice mal la respuesta a volumen» (Marik 2008, PMID 18628220; 2013, PMID 23774337). |
| S6 | Edema por presión de llenado alta: Zanza 2023 (PMID 37887077). 1.000 mL y cifra de SpO₂: «ilustrativo». |
| S7 | PAM >110: «ilustrativo» + nota: sin beneficio por encima de 65-70 y más FA (Asfar 2014, PMID 24635770; Mendes 2025, PMID 41276856). |
| S9 | Cortes por clase: siguen «ilustrativo» + nota «en la práctica FC y PAS cambian menos que la tabla» (Guly 2011, PMID 21349628; Mutschler 2014, PMID 25284231). |
| S10 | Arlequín y radial derecha: Torre & Pirri 2025 (PMID 40927093). ✅ |
| S8, S11, S13, S14 | ×1,5, oxigenador 98 %, τ del lactato, 0,2/h: siguen «ilustrativo». PAM 70 de la diuresis: Marino cap. 18 p. 7. |
| S12 | Impella/ECMO (rpm, niveles, purga, barrido): siguen fuera hasta abrir Rihal 2015 (PMID 25861963). |

## Ritmo y receptor (app `ritmo-vivo/`, `receptor-vivo/`) → igual que el shock
| Id | Qué se hace |
|---|---|
| C1 | Gq/Gi: Motiejunaite 2021 (PMID 32473788). ✅ |
| C2, C7 | Glucagón en anafilaxia resistente con betabloqueante: Ellis & Linton 2026 (PMID 41932748). Mecanismo: «fisiología general». |
| C5 | Vasopresina sin efecto en el sano: Barrett 2007 (PMID 17133186). ✅ |
| C6 | Lactato: Levy 2005 (PMID 15752531), con nota «el resumen habla de la glucólisis aerobia por la bomba Na-K, no nombra la adrenalina». |
| C8 | Dopamina «renal»: Bellomo 2000 (PMID 11191541). ✅ |
| R8 | Doble vía nodal: Brugada 2019 ESC (PMID 31504425) + Costantini 2018 (PMID 29912236). |
| R1, R7 | 2 bolos de amiodarona y 3 vagales: «ilustrativo» (tope de la pantalla, no de guía); la Valsalva modificada: REVERT 2015 (PMID 26314489). |
| R6 | 30 min sin RCE: «ilustrativo» + Goldberger 2012 (PMID 22958912) como contexto («no se puede definir una duración óptima»). |
| R3 | Hipermagnesemia: «ilustrativo» + nota: la revisión de Sangawa 2025 (PMID 41216399) no la encontró (0/46). |
| R4a | Verapamilo: nota Cochrane 2017 (PMID 29025197): hipotensión rara en TSV estable. |

## Pendiente del usuario (guías sin texto abrible desde aquí)
R2 (choque sobre sinusal → FV), R4b (adrenalina con pulso), C3 (dobutamina en la obstrucción del tracto de salida), el
texto de S6/S7/S8 en ESC 2021 IC, SSC 2021 y Rossaint 2023, y Rihal 2015 (S12). Hace falta el PDF de: ESC 2019 TSV,
AHA 2020 SVA (o ERC 2021), ESC 2023 miocardiopatías y el consenso SCAI 2015. Mientras, siguen rotulados como están.
