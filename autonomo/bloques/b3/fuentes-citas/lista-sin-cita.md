# Lista de lo rotulado sin cita abrible · bloque 3 (fuentes-b3)
Maquetas = `autonomo/maquetas/b3-*/` (M); app = `js/modules/libros/{shock,ritmo,receptor}-vivo/` y `js/data/` (A). ⚑ = clínicamente importante. Pulmón: NO está en la app aún (solo maqueta).
Sin cita = la cifra o el mecanismo no tiene PDF con página ni artículo/guía abrible. «Marino» ya es fuente: solo cuenta lo que Marino no dice.

## SHOCK (A: sí, salvo indicación)
- S1 ⚑ Errores de temporización del balón (inflado/desinflado precoz y tardío): M `b3-shock/consola-balon.js:5-7,74` («Temporización: sin fuente en la app», botones ◄ Inflado ► / ◄ Desinflado ► desactivados). **Fuente ya elegida: Gillespie 2024, docs/gillespie-2024-balon-contrapulsacion-jscai.pdf.** Falta construir.
- S2 ⚑ G5 «¿por qué el Aumento supera la sistólica?» M `b3-shock/datos.js:409-417`: rótulo «fisiología general (el volumen desplazado se suma)». Buscar: revisión de contrapulsación (augmentación diastólica, Gillespie 2024 u otra revisión IABP; Krishna & Zacharowski, «Principles of IABP», Contin Educ Anaesth Crit Care Pain 2009).
- S3 ⚑ G6 «por qué la IAo empeora con el balón» M `datos.js:418-424`: rótulo «fisiología general, no dicho por el libro». Buscar: la misma revisión (contraindicaciones: IAo significativa, disección) o ficha técnica del fabricante.
- S4 ⚑ Distractor G5 «la media apenas se mueve» ya corregido según auditoria-pantallas-2; revisar que el «porque» cite p. 45 (Marino) y no solo mecanismo propio.
- S5 ⚑ «PVC >12: es raro que más volumen suba el gasto» M `b3-shock/topes.js:16-19` (origen «fisiología general»). Buscar: Marino cap. 11 / curva de Frank-Starling-PVC; metaanálisis Marik «Does CVP predict fluid responsiveness?» (Chest 2008) y Marik 2013.
- S6 ⚑ Sello «Edema de pulmón ≥1.000 mL, SpO₂, necesita intubación/PEEP/diurético» `topes.js:23-27` («fisiología general; líquido y SpO₂ ilustrativos»). Buscar: guía/revisión de edema pulmonar cardiogénico (ESC IC 2021/2026 sección edema agudo).
- S7 ⚑ PAM >110 con vasopresor (aviso) `topes.js:43-49` («fisiología general (el 110)»). Buscar: guías Surviving Sepsis 2021 (objetivo PAM 65) y revisión de hipertensión inducida por vasopresor; si no hay cifra, rotular ilustrativo.
- S8 ⚑ Tope ×1,5 de lo perdido en la hemorragia `topes.js:30-37`, `datos.js:154,270-273` («ilustrativo»). Buscar: ATLS 10.ª ed. (clases de hemorragia, relación 3:1 cristaloide) o guía europea de hemorragia traumática (Rossaint 2023).
- S9 ⚑ Cortes de FC/PA por clase (FC 95/120/140; PAS 90/70) `datos.js:133,196-207,337` («ilustrativas»; Marino solo da flechas). Buscar: ATLS (tabla de clases con FC y PA).
- S10 ⚑ SpO₂ con ECMO: mezcla/arlequín, brazo derecho `pagina.js:190`, `datos.js:348` («fisiología general, la ficha no lo dice»). Buscar: guía ELSO (VA-ECMO) o revisión de «Harlequin/North-South syndrome».
- S11 ⚑ Oxigenador al 98 %, edema 10 mmHg/100 mL de PaO₂, K_EDEMA `soporte.mjs:46,222-223` (ilustrativo). Trivial-modelo salvo el 98 %: ELSO.
- S12 ⚑ Impella: rpm, niveles P, purga, sensor; ECMO gas de barrido, cánula de reperfusión `datos.js:347` («no salen hasta tener fuente»). Buscar: ficha técnica Impella (Abiomed) / consenso SCAI-ELSO MCS.
- S13 ⚑ Tope ECMO 5-6 L/min tiene página de Marino (p. 48); sin problema. Flujo de Impella 2,5/5,5: mirar que tengan cita.
- S14 ⚑ Reloj 48 h, lactato (τ 2 h, +/h con PAM <65), diuresis (autorregulación a PAM 70) `topes.js:55-57`, `soporte.mjs:232-246` («ilustrativo»). Buscar: Surviving Sepsis 2021 (lactato; aclaramiento) para el lactato; 48 h: trivial.
- S15 «PCP con soporte mecánico: la fuente no da meta» `datos.js:91,344` y `pagina.js:116,179`. Buscar: consenso SCAI/ESC MCS (PCP/descarga con Impella). Medio.
- S16 Trivial (queda): dibujos/ilustrativos de forma del balón, ECG, batería, helio, rotor `consola-balon.js:172-175`, `aparatos.js:236,376,537` (cánula de venteo del VI).

## RITMO (A: sí)
- R1 ⚑ Límite de 2 bolos de amiodarona en TV `ritmo-vivo/topes.js` (M `b3-ritmo/topes.js:49-105`) «el límite de dos bolos es de esta pantalla»; la Fig. 19.8 p. 33 admite extras. Es tope propio: buscar ESC 2022 arritmias ventriculares / AHA 2020 (amiodarona 150 mg, repetible) o quitar el tope.
- R2 ⚑ «Choque con sinusal puede inducir FV» (M `topes.js:86`, «fisiología general»). Buscar: guía ESC 2019 TSV / AHA ACLS (cardioversión sincronizada; riesgo de FV).
- R3 ⚑ «Hipermagnesemia al repetir pauta» (M `topes.js:93-94`, «fisiología general»). Buscar: ficha técnica sulfato de magnesio / guía TdP (AHA 2010 TdP) / UpToDate-fuente abierta.
- R4 ⚑ Verapamilo: bradicardia/hipotensión (M `topes.js:100`); adrenalina con pulso → taquiarritmia (M `topes.js:109`, «fisiología general»). Buscar: ficha técnica verapamilo; AHA 2020 post-RCE.
- R5 ⚑ Tira de ETCO₂, presión, pulso en muñeca, cuánto alarga el QT cada fármaco, FC/QRS del monitor `datos.js:213,367`, `pagina.js:178-193` (ilustrativo). Buscar para QT: CredibleMeds / tabla de fármacos que alargan QT (AHA/ACC 2010).
- R6 ⚑ «Sin RCE a los 30 min» detiene el caso M `topes.js:114` («ilustrativo»; Marino no da 30 min). Buscar: AHA 2020 / ERC 2021 (duración de la RCP, criterios de cese). Aviso 20 min también.
- R7 ⚑ Adenosina «actúa en <30 s / aquí en segundos»; reloj de parada ×10; bloqueo AV «60 s» `datos.js:254,367`. Marino p. 30 cubre 1-2 min; resto trivial.
- R8 ⚑ Vía accesoria en el anillo mitral, carril lento-rápido de la reentrada nodal, circuito del flúter alrededor de la tricúspide `datos.js:362-366` («fisiología general»). Buscar: ESC 2019 TSV (anatomía/mecanismos) o Libro Azul (ya citado para conducción). Medio.
- R9 ⚑ Esquema: velocidades His 2 m/s, Purkinje 4 m/s, nodo 0,12 s ya citados al Libro Azul p. 7. Anillo fibroso, banda moderadora, velocidad del músculo: trivial.
- R10 Trivial: torsade que gira, escala 0,7 mm/unidad, ST/T sinuosa con K⁺, lesión corriente (`datos.js:207,218`, `motor.js:118,329,388`); «intento 3 de maniobras vagales» (M `topes.js:81`, tope propio ⚑ si se presenta como regla: buscar ESC 2019 TSV maniobra de Valsalva modificada).
- R11 Bradicardias/marcapasos: hueco declarado, vendrá de la guía ESC 2021 de estimulación (`datos.js:371`). Fuente ya elegida.

## RECEPTOR (A: sí)
- C1 ⚑ Subtipos (β₁ de la NA, β₂ del mastocito, dobutamina, vasos) del Manual UMI (cita ya); cadenas Gq/IP₃ «fisiología general» `pagina.js:315`. Buscar: Katzung / Goodman & Gilman, receptores adrenérgicos.
- C2 ⚑ Bisoprolol cardioselectivo y cuánto tapa el β del mastocito `pagina.js:320`. Buscar: ficha técnica bisoprolol; revisión anafilaxia en betabloqueados (Lang, Ann Allergy 2008).
- C3 ⚑ Obstrucción del tracto de salida: la dobutamina baja la PA, cifras ilustrativas `pagina.js:322`, `datos.js:199` (dosisModelo 60). Buscar: guía ESC miocardiopatía hipertrófica 2023 / AHA-ACC HCM 2024.
- C4 ⚑ Cuánto mueve cada fármaco (cifras tras cada dosis) `pagina.js:323` y radio exagerado. Ilustrativo declarado; buscar Marino/Goodman si se quieren cifras.
- C5 ⚑ Vasopresina no sube la PA en sano; por qué `pagina.js:317`, `datos.js:339-343` («el libro no lo explica»). Buscar: Russell, N Engl J Med 2011 «Vasopressin in vasodilatory shock» / Barrett 2007 Crit Care Med.
- C6 ⚑ Lactato de la adrenalina `pagina.js:318`: buscar Totonchi / revisión β₂-adrenérgica y lactato (Levy, Intensive Care Med 2005).
- C7 ⚑ Glucagón en el mastocito: cómo `pagina.js:321`, `datos.js:408,478`. Buscar: Thomas, Anaphylaxis & β-blocker, o guía WAO 2020 de anafilaxia.
- C8 ⚑ Dopamina «renal» (no protege el riñón) `pagina.js:319`: buscar ANZICS/Bellomo, Lancet 2000.
- C9 Equivalencias 5 µg/min ↔ 0,05 µg/kg/min (100/60 kg) `pagina.js:314`: aritmética, trivial.
- C10 Corte β/α de la adrenalina ya con Manual UMI. Fenilefrina «útil» = opinión del autor, bien rotulada.

## PULMÓN / RESPIRADOR (A: no, solo maqueta)
- P1 ⚑ VMe 2-20 L/min: sello «Sin ventilación eficaz» (<2) y «no fisiológica» (>20) M `b3-pulmon/topes.js:10,23,43-44`, `pantalla.js:104,130`; rótulo «fisiología general». Buscar: fisiología respiratoria (West) / consenso de alarmas del respirador; VM normal 5-8 L/min (Marino Tabla 27.1 si lo da).
- P2 ⚑ PEEP total ≤20 + sello «Hiperinflación» (oculta ≥2) `topes.js:10,47`, `pantalla.js:99`. Buscar: Marino cap. 23/28 (consecuencias ya citadas) + revisión de auto-PEEP (Lopez-Padilla, Respir Care 2015) o Tobin.
- P3 ⚑ Tope VTe 12 mL/kg `topes.js:12,22,45` («tradicional 12-15 en p. 46»; el 12: ilustrativo). Buscar: ARDSNet 2000 (NEJM 342:1301) y guía ATS/ESICM/SCCM 2017 (6 mL/kg).
- P4 ⚑ Alarma Pmáx 30-50 (se pidió quitar 55-70) y aviso ≥45 `topes.js:10,37` (pmaxMax 50, «ilustrativo»). Buscar: manual del respirador / revisión de alarmas (Chatburn); meseta ≤30 ya es ficha.
- P5 ⚑ FR alta: «sin límite (la ficha no lo da)» `pantalla.js:130`; el mando llega a 35 (cap. 27 p. 14 = fuente). Falta decir qué pasa con FR >35 (autopeep, VM): ARDSNet (FR hasta 35).
- P6 ⚑ Ti mínimo 0,2 s (`tiMin`, flujo máximo derivado) `pantalla.js:67,116-121` («ilustrativo»). Buscar: tiempos inspiratorios típicos (Tobin, Principles of MV) o Marino cap. 27 p. 14.
- P7 ⚑ «Detener ventilación»: «CO₂ sube y la SpO₂ cae en minutos» M `pagina.js:236-242` («fisiología general»). Buscar: tiempo de apnea/desaturación (preoxigenación, Benumof 1997) y CO₂ ↑ 3-6 mmHg/min (Farmery/Eger).
- P8 ⚑ Compliance tope 80 (cMax) y suelo 15 `limites-pulmon.md` (ficha Cstat normal 50-80, p. 6: ya fuente; 15 ilustrativo). Menor.
- P9 R 5 (normal) y 20 (broncoespasmo), τ=R·C, resistencia espiratoria mayor `datos.js:53` («Marino no da»). Buscar: Marino cap. 24-25 / Tobin.
- P10 PEEP aplicada no reduce la oculta en un compartimento `datos.js:56` — es limitación del modelo, no afirmación clínica (Marino p. 33 ya citado).
- P11 Trivial: FiO₂/SpO₂ sin mando (hueco declarado), monitor congelado, lectura «midiendo…».

## «Fuente ya elegida»: S1 (Gillespie 2024), R11 (ESC 2021 estimulación).
## No comprobado / riesgo
- No abrí los 4 `pagina.js` enteros ni las Mayéuticas completas (R/C/P preguntas): puede haber más «fisiología general» dentro de `porque:` o `explica:` de preguntas (grep solo vio las líneas citadas). Los números de línea son de la copia /tmp/wt-fuentes-b3-lectura; la app puede diferir en pocas líneas. Las fuentes que propongo salen de memoria, ninguna verificada en la red (PubMed bloqueado).
