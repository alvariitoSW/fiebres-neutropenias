# Plan de estudio · b6a · grupo 6C «La placa motora» (Marino cap. 46, 2.ª mitad) — profesor, modo diseñar, 01/11/2026

Fuente **N** = `docs/marino-2024-neurologia-caps45-47.pdf` (p. = página del PDF = `#page=N`; cotejado con `pdftotext` página a página, p. 24-31).
Ficha: `js/modules/libros/marino-neuro.html` (`mn-miastenia` l. 729, `mn-gbs-pnc` l. 792, `mn-relajantes` l. 848). Formato: cabecera de
`js/data/mayeutica/b1-fluidos.js`; motor `js/core/mayeutica-motor.js`. Archivo propuesto: `js/data/mayeutica/b6a-placa.js` (≈420 líneas), con `pag()`
y `enFicha()` de `b3a-shock-1.js` y `PDF` = N. Prefijos de id (sin choque en `js/`, grep): `mnm-` miastenia, `mng-` GBS y PNC/MCC, `mnr-` relajantes.
**Modelos**: UNM (placa) **espera a la placa** — estados con el nombre de la cobertura: `miastenia`, `hielo`, `piridostigmina`, `farmaco-que-empeora`,
`gbs`, `pnc`, `mcc`, `bloqueo`, `succinilcolina`, `rocuronio`, `cisatracurio`, `neostigmina`, `sugammadex`. Pulmón vivo ➕ `debilidad-neuromuscular`
(CV y PIM del paciente) **espera al estado del pulmón**. Ya en la app ✅: `mn-mg-farmaco-calc` (Tabla 46.5), `mn-mg-calc` (¿intubar?), `mn-gbsmg-calc`
(Tabla 46.6), `mn-bnm-calc` (dosis y reversión), Fig. 46.1 real (`mar-img-46-1`, p. 25), ritmo vivo `hiperk`, capilar vivo `sepsis`.
Mientras no exista la placa, «Compruébalo en el modelo» abre la calculadora de la ficha (`calculadora: { ir, nombre }`), nunca un modelo vacío.
**La hendidura** (pasos de la lupa): 1 llega el impulso, 2 salen las vesículas, 5 el músculo se relaja = **`fisiología general`** (Marino no los
describe); 3 la ACh (o el relajante) se une al receptor postsináptico = p. 29 (`mn-bnm-mecanismo`); 4 la acetilcolinesterasa rompe la ACh = p. 30-31 (`mn-bnm-neostigmina`).

## Ruta del grupo
**8 `mn-miastenia` → 9 `mn-gbs-pnc` → 10 `mn-relajantes`**. Primero la placa enferma (pocos receptores: fatiga), luego el nervio (mielina: lento
pero sin fatiga) y el músculo del crítico, y al final la placa tapada a propósito (relajantes) y destapada (reversión). La pregunta de guardia que
cose las tres: **¿dónde está la lesión y qué signo lo delata?** (Tabla 46.6, p. 27). La regla de intubar (CV ≤15 mL/kg o <1 L; PIM −20, p. 25) se
aprende en la 8 y se aplica en la 9.

---
## 8 · `mn-miastenia` (p. 24-26) — paciente **Serapio, 35 a, 70 kg** (miastenia: neumonía, gentamicina, crisis)
**Carril de 30 s** · Idea: anticuerpos destruyen los **receptores postsinápticos**; con menos receptores, la fuerza **cae con el uso y vuelve con el reposo** (p. 24).
Cifras: crisis miasténica en el **15-20 %** (p. 24) · intubar con **CV ≤15 mL/kg (o <1 L)** y **PIM −20 cmH₂O** (p. 25) · hielo 2 min, **+2 mm** = positivo (p. 24).
Figura: Fig. 46.1 real (`mar-img-46-1`, p. 25). Modelo: placa `miastenia` → `hielo` → `piridostigmina` → `farmaco-que-empeora` (**espera a la placa**).
**Mira/Juega**: Fig. 46.1 + calculadora Tabla 46.5 (`mn-mg-farmaco-calc`: elegir gentamicina) + `mn-mg-calc` con CV y PIM de Serapio. Con la placa: «estímulo repetido» y ver caer la fuerza.
**Piensa (guía)**
- g1 *test* `mn-mg-definicion · mn-mg-clinica` (`modelo: placa 'miastenia'`): «Serapio ve doble por la tarde y por la mañana no. ¿Qué explica que empeore con el uso?» → menos receptores de ACh en la placa: la debilidad empeora con la actividad y mejora con el reposo (p. 24). Distractores: «el nervio conduce más lento al cansarse» (eso sería desmielinización: GBS, conducción enlentecida y sin fatiga, Tabla 46.6 p. 27); «falta ACh en el terminal» (Marino sitúa la lesión en el receptor postsináptico, p. 24).
- g2 *test* `mn-mg-clinica`: «¿Qué músculos se afectan siempre?» → los oculares (párpado y oculomotores): diplopía y ptosis primero; en el 15 % se queda ahí (p. 24). Distractores: «los respiratorios primero» (llegan al progresar: crisis, p. 24); «los proximales de las piernas» (la debilidad de miembros viene después, p. 24).
- g3 *test* `mn-mg-hielo · mar-img-46-1` (`modelo: placa 'hielo'`): «Hielo 2 min con el ojo cerrado: ¿qué cuenta como positivo y cuánto vale?» → +2 mm de hendidura palpebral; S y E 80 % (p. 24-25). Distractores: «+5 mm» y «S 95 %» (cifras que no da la fuente). Nota: el mecanismo íntimo del frío no lo da Marino («el frío puede mejorar la transmisión», p. 24).
- g4 *destapa* «son dos cosas» `mn-mg-anticuerpos`: «Anti-AChR negativo: ¿descartas la miastenia?» → (1) no: el **10-15 %** no tiene anti-AChR; (2) pedir **anti-MuSK**, presente en un **40 %** de ellos (p. 25).
- g5 *test* `mn-mg-piridostigmina` (`modelo: placa 'piridostigmina'`): «¿Por qué no se usa piridostigmina en la crisis?» → aumenta las secreciones respiratorias (efecto colinérgico) (p. 26). Distractores: «no cruza a la placa» (sí actúa: es un inhibidor de la AChE para la leve-moderada, p. 26); «da hiperpotasemia» (eso es la succinilcolina, p. 30).
- g6 *test* `mn-mg-crisis`: «IgIV y plasmaféresis son igual de eficaces (70 %). ¿Por qué se prefiere la plasmaféresis?» → responde antes: tras la 2.ª sesión; la IgIV tarda 4-5 días (p. 26). Distractor: «más eficaz» (iguales, p. 26).
**Examínate (MIR)**
- e1 *test* `mn-tabla-46-5`: «¿Cuál NO está en la Tabla 46.5?» → correcta: un fármaco ausente de la tabla que la ficha no nombra como peligroso: **paracetamol** — *ojo*: la tabla no da «seguros»; la explicación dice «no figura en la Tabla 46.5 (p. 24)», no que sea seguro. Distractores: magnesio, litio, procainamida, corticoides a dosis altas (todos en la tabla, p. 24).
- e2 *test* `mn-tabla-46-5 · mn-mg-corticoides`: «¿Qué fármaco de la Tabla 46.5 también trata la miastenia?» → corticoides a dosis altas (p. 24; metilprednisolona 2 g/día ×2, discutida, p. 26). Distractores: anestésicos inhalados, calcioantagonistas.
- e3 *test* `mn-mg-intubacion`: «70 kg, CV 1.050 mL, PIM −24: ¿cumple?» → sí por CV (15 mL/kg = 1.050; ≤15, p. 25) aunque la PIM aún no llegue a −20. Distractores: «no, hacen falta <1 L» (es «≤15 mL/kg **o** <1 L»); «no, la PIM manda». Nota de la ficha (`mn-mg-intubacion`): el libro une CV y PIM con «y»; normal «>−100» reproducido como errata.
- e4 *test* `mn-mg-intubacion`: «¿Cuándo vale la BiPAP?» → solo si se espera mejoría en pocos días, lo que no suele pasar (p. 25). Distractores: «siempre antes de intubar», «si la PaCO₂ es normal».
- e5 *test* `mn-mg-crisis`: «Plasmaféresis: ¿qué pauta?» → 5 sesiones en 7-10 días, 1-1,5 volúmenes plasmáticos cada una (p. 26). Distractores: «IgIV 0,4 g/kg» (Marino da 2 g/kg en 2-5 días, p. 26); «3 sesiones en 3 días».
- e6 *test* `mn-mg-desencadenantes`: «¿Qué % de miastenias causa un timoma?» → 10 % (p. 24). Distractores: 15 % (solo ocular, p. 24), 15-20 % (crisis, p. 24).
- e7 *encuentra el error* (0 errores; trampa) `mn-mg-corticoides · mn-mg-otros`: «Metilprednisolona 2 g/día 2 días, discutida ✓ · retirarla si ya responde a plasmaféresis ✓ · enoxaparina 40 mg/día ✓ · evaluar la deglución si no está intubado ✓» (p. 26). Explicación: todas verdaderas; parecen error y no lo son.
**Caso Serapio** (vive aquí; 6 pasos; ficha: 35 a, 70 kg, ptosis y diplopía vespertinas)
1 · Consulta, día 0: ptosis derecha que empeora por la tarde, reflejos conservados; hielo 2 min: hendidura de 6 a 9 mm. *Test* ¿qué sugiere? (miastenia: +3 mm ≥2, p. 24-25; distractores: GBS «reflejos ↓, sin ocular» y Miller Fisher «oftalmoplejía **y ataxia**», p. 27). Calc `mn-gbsmg-calc`.
2 · Día 3, UCI intermedia: neumonía. *Error* (2) plan del R1: «Gentamicina 5 mg/kg/día ✗ (aminoglucósido, Tabla 46.5 p. 24: elige un antibiótico fuera de la tabla, con el antibiograma) · CV 1.300 mL (18,6 mL/kg) y PIM −28: aún no cumple ✓ (p. 25) · Mantener piridostigmina mientras respire bien ✓ (p. 26) · Si empeora, metilprednisolona antes que plasmaféresis ✗ (la primera opción es IgIV o plasmaféresis; los corticoides, discutidos, p. 26) · Enoxaparina 40 mg/día ✓ (p. 26)». Calc `mn-mg-farmaco-calc`.
3 · Día 4, 6 h después: disfagia, CV **950 mL** (13,6 mL/kg; <1 L), PIM **−18**, SpO₂ 95 % aire, PaCO₂ 41. *Test* ¿qué haces? (intubar: CV ≤15 y <1 L, PIM peor que −20; no esperar al in extremis, p. 25; distractores: «BiPAP y revalorar» —solo si mejoría en días—; «esperar a que suba la PaCO₂»). Calc `mn-mg-calc`; `modelo: pulmón 'debilidad-neuromuscular'` (espera).
4 · Intubado. *Destapa* «son tres cosas»: plasmaféresis 5 sesiones en 7-10 días (mejoría tras la 2.ª) · retirar la piridostigmina (secreciones) · retirar la gentamicina (Tabla 46.5) (p. 24, 26).
5 · **Giro**, día 9: tras la 3.ª sesión, CV 1.500 mL; TC de tórax con contraste: masa en el mediastino anterior. *Test* ¿qué cambia? (timoma, 10 % de las miastenias; la timectomía puede reducir la inmunoterapia y la decide neurología, p. 24, 26; distractores: «timectomía urgente en la crisis», «es paraneoplásica: no tratar la placa»).
6 · Día 14, extubado. *Test* pronóstico (95 % sobrevive al ingreso, pocos se recuperan del todo, p. 26; distractor «97 %, 10-15 % discapacidad»: es el GBS, p. 28).
**Lo que te llevas**: fatiga = placa · CV ≤15 mL/kg o <1 L, PIM −20: intubar antes del in extremis · la Tabla 46.5 se lee antes de prescribir. **Volver**: `ancla: 'mn-mg-intubacion'`, placa `miastenia` (espera).
**Para profundizar**: `mn-mg-otros` (deglución, TC y timectomía) · `mn-mg-pronostico` · `mn-mg-desencadenantes` (cirugía, estrés).

---
## 9 · `mn-gbs-pnc` (p. 26-29) — paciente **Florentina, 52 a, 60 kg** (GBS tras Campylobacter → intubación → no se desteta)
**Carril de 30 s** · Idea: el GBS rompe la **mielina del nervio**: conducción lenta, reflejos abolidos, **sin fatiga ni ojos**; la neuromiopatía del crítico es el nervio o el músculo **que la inflamación rompe** (p. 27-28).
Cifras: fracaso respiratorio **25 %** (p. 27) · sobrevive **97 %**, **10-15 %** con discapacidad grave (p. 28) · PNC/MCC: recuperación completa en **la mitad, en meses** (p. 29).
Figura: Tabla 46.6 viva (`mn-tabla-46-6` + `mn-gbsmg-calc`); Marino no trae figura del GBS. Modelo: placa `gbs` / `miastenia` / `pnc` / `mcc` (**espera a la placa**).
**Mira/Juega**: la calculadora Tabla 46.6 con los signos de Florentina y luego con los de Serapio; con la placa: estímulo repetido en `gbs` (llega tarde, no decae) frente a `miastenia` (llega a tiempo, decae).
**Piensa (guía)**
- g1 *test* `mn-gbs-definicion`: «¿Qué precede al GBS y cuándo?» → infección aguda 1-3 semanas antes (Campylobacter jejuni, Zika, SARS-CoV-2), mimetismo molecular (p. 26-27). Distractores: «la vacuna en las 48 h previas» (no lo dice), «1-3 días».
- g2 *test* `mn-tabla-46-6` (`modelo: placa 'gbs'`): «La lesión está en la mielina. Predice: ¿qué no verás?» → debilidad que se fatiga (Tabla 46.6, p. 27). Distractores: conducción enlentecida, proteínas en el LCR, inestabilidad autonómica (las tres sí).
- g3 *test* `mn-gbs-clinica`: «Florentina tiene diplopía y ataxia. ¿Descarta el GBS?» → no: Miller Fisher, la variante con oftalmoplejía y ataxia (p. 27). Distractor: «sí: ocular = miastenia».
- g4 *destapa* «son dos cosas» `mn-gbs-tratamiento`: «¿A quién tratas y con qué?» → (1) si no camina sin ayuda o tiene fracaso respiratorio; (2) IgIV o plasmaféresis con las pautas de la miastenia, **sin preferencia** (p. 27).
- g5 *test* `mn-pnc-pnc · mn-pnc-mcc` (`modelo: placa 'pnc'` / `'mcc'`): «¿Dónde está la lesión en la PNC y en la MCC?» → PNC: axón (sensitivo y motor); MCC: el músculo (pierde miosina) (p. 28). Distractores: «PNC desmielinizante como el GBS», «MCC en la placa».
- g6 *test* `mn-pnc-mcc · mn-pnc-final`: «¿Qué comparten PNC y MCC?» → la inflamación sistémica grave; aparecen al no poder retirar el respirador (p. 28). Distractor: «los corticoides» (predisponen la MCC en asmáticos relajados, no la PNC, p. 28).
**Examínate (MIR)**
- e1 *test* `mn-gbs-clinica`: «¿Qué % de GBS resuelve solo?» → 80 %, a menudo con secuelas (p. 27). Distractores: 25 % (fracaso respiratorio), 97 % (supervivencia, p. 28).
- e2 *test* `mn-gbs-dolor`: «Dolor urente en piernas en la fase aguda: ¿qué pauta da la guía?» → gabapentina 300 mg tres veces al día; opioides para alivio inmediato (p. 28). Distractores: «solo AINE: el dolor es nociceptivo» (es neuropático, p. 28); «gabapentina 3.000 mg/día» (cifra de la abstinencia de gabapentina, cap. 45 p. 9).
- e3 *test* `mn-gbs-dx`: «¿Para qué es la punción lumbar?» → descartar otras causas; muestra proteínas elevadas (p. 27). Distractor: «confirma con pleocitosis» (no lo dice).
- e4 *test* `mn-pnc-pnc`: «¿Cuál es la neuropatía periférica más frecuente del crítico?» → la PNC (p. 28). Distractores: GBS, miastenia.
- e5 *test* `mn-pnc-mcc`: «¿Qué confirma la MCC?» → EMG miopático y biopsia con pérdida de miosina (p. 28). Distractor: «conducción lenta en fibras sensitivas y motoras» (es la PNC, p. 28).
- e6 *test* `mn-pnc-manejo`: «¿Qué tratamiento tiene la PNC/MCC?» → ninguno; movilización y nutrición propuestas, no validadas (p. 28-29). Distractores: IgIV (es del GBS), «control glucémico estricto que la revierte» (la hiperglucemia predispone, p. 28, pero no hay tratamiento validado).
**Caso Florentina** (vive aquí; 7 pasos; ficha: 52 a, 60 kg, diarrea hace 2 semanas)
1 · Día 0: parestesias y debilidad simétrica que sube en 4 días, arreflexia, sin ptosis. *Test* ¿dónde está la lesión? (mielina: GBS, p. 26-27; distractores: miastenia «ocular siempre, reflejos conservados»; PNC «secundaria a sepsis, aparece al no destetar», p. 28). Calc `mn-gbsmg-calc`.
2 · *Destapa* «son dos cosas»: qué pides y qué esperas → conducción enlentecida · LCR con proteínas altas (p. 27). Dato: proteínas 110 mg/dL (cifra del paciente).
3 · Día 1: no camina sin ayuda; CV **1.100 mL** (18 mL/kg), PIM −30. *Test* ¿y ahora? (IgIV 2 g/kg = **120 g** en 2-5 días o plasmaféresis, sin preferencia, p. 27; distractores: «vigilar: el 80 % resuelve solo» —no camina: indicación—; «solo plasmaféresis: la IgIV no sirve en el GBS»).
4 · Día 2: CV **850 mL** (14 mL/kg), PIM −22, SpO₂ 96 %. *Error* (2) plan del R1: «14 mL/kg y <1 L: cumple criterio ✓ (p. 25) · BiPAP nocturna y revalorar mañana ✗ (intubar: BiPAP solo si mejoría en días, p. 25, 27) · Seguir la IgIV, día 2 de 5 ✓ · Prueba del hielo para descartar miastenia ✗ (es para la ptosis, p. 24; la Tabla 46.6 ya separa) · Enoxaparina 40 mg/día ✓ (p. 26)». `modelo: pulmón 'debilidad-neuromuscular'` (espera).
5 · **Giro**, día 4, intubada: FC de 42 a 135 en horas y PA de 85/45 a 185/100 (cifras del paciente, `ilustrativo`). *Test* ¿qué es? (inestabilidad autonómica de los casos avanzados, p. 27; distractores: «sepsis: antibióticos y fluidos» —busca, pero la oscilación es del GBS—; «la miastenia también la da» —no, Tabla 46.6—). Otra fuente opcional para frecuencias: PubMed 3577674 (`b6a-otra-fuente-unm.md` §11).
6 · Día 8: dolor neuropático. *Test* (gabapentina 300 mg/8 h + opioide si urge, p. 28).
7 · Día 20: sepsis por catéter; mejora la fuerza de brazos pero no se desteta, flácida, arreflexia. *Destapa* «son tres cosas»: neuromiopatía del crítico añadida (la inflamación, p. 28) · conducción (PNC) y EMG/biopsia (MCC) para distinguir: la clínica no las separa (p. 28) · sin tratamiento; la mitad recupera del todo, en meses (p. 28-29). `modelo: capilarVivo 'sepsis'` (enlace ✅).
**Lo que te llevas**: nervio = sin fatiga, reflejos ↓, autonómico · intubar por CV y PIM, no por la gasometría · 97 % sobrevive, 10-15 % con discapacidad grave (p. 28). **Volver**: `ancla: 'mn-tabla-46-6'`, placa `gbs` (espera).
**Para profundizar**: `mn-gbs-definicion` (mimetismo molecular) · `mn-pnc-final` (la inflamación ataca de nuevo, Tabla 17.1) · `mn-gbs-pronostico`.

---
## 10 · `mn-relajantes` (p. 29-31) — paciente **Melquíades, 62 a, 70 kg (peso real = ideal)** (neumonía, FRA y hepatopatía: rocuronio sin vía aérea → cisatracurio)
**Carril de 30 s** · Idea: los relajantes ocupan el receptor: la succinilcolina lo **deja abierto** (despolariza) y los demás **lo tapan** (compiten); el TOF dice cuánto (p. 29-30).
Cifras: rocuronio 1 mg/kg **dura una hora** → sugammadex **16 mg/kg**, revierte en **2-3 min** (p. 30-31) · TOF objetivo **1-2 respuestas** (p. 30) · neostigmina **nunca >70 µg/kg** (p. 31).
Figura: Tabla 46.7 (`mn-tabla-46-7`). Modelo: placa `bloqueo` con `succinilcolina` / `rocuronio` / `cisatracurio` / `neostigmina` / `sugammadex` y TOF (**espera a la placa**).
**Mira/Juega**: `mn-bnm-calc` (70 kg, con y sin contraindicación, tres profundidades); con la placa: cada fármaco y el pulgar del TOF; succinilcolina con K⁺ alto → ritmo vivo `hiperk` ✅.
**Topes de la placa (R3, con su página; nada más)**: neostigmina >70 µg/kg → sello «nunca más de 70: efectos parasimpaticomiméticos» (p. 31) — **sin** «no revierte más» ni techo propio; el tope de 5 mg es de la ficha técnica FDA (nota de fuentes de `mn-bnm-neostigmina`), no de Marino · parálisis prolongada → aviso del ruego (p. 31) **sin horas** (Marino no da horas) · sugammadex con succinilcolina o cisatracurio → «solo aminoesteroides» (p. 31) · TOF 0 → «bloqueo excesivo» (p. 30).
**Piensa (guía)**
- g1 *test* `mn-bnm-mecanismo` (`modelo: placa 'succinilcolina'`): «¿Por qué la succinilcolina sube el K⁺?» → la despolarización mantenida saca K⁺ del músculo: hasta +0,5 mEq/L, sin consecuencias si no estaba alto (p. 29-30). Distractores: «libera histamina» (eso el atracurio, no el cisatracurio, p. 30); «bloquea la bomba renal».
- g2 *test* `mn-bnm-contra`: «¿Cuál NO contraindica la succinilcolina?» → fracaso renal con K⁺ 4,2 (no está en la lista) — distractores: rabdomiólisis, quemaduras, lesión medular con inmovilidad, hipertermia maligna (Tabla 46.7, p. 29-30).
- g3 *test* `mn-bnm-rocuronio`: «Rocuronio 1 mg/kg: ¿qué tiene de bueno y qué de malo para intubar?» → inicio equivalente a 1 mg/kg de succinilcolina; dura una hora (p. 30). Nota de fidelidad: duración 50-70 min en la Tabla 46.7 (p. 29) frente a 30-70 en el texto (p. 30); se muestran las dos.
- g4 *test* `mn-bnm-monitor` (`modelo: placa 'bloqueo'`, TOF): «Perfusión con TOF 0/4. ¿Qué significa?» → bloqueo excesivo; objetivo 1-2 respuestas (p. 30). Distractor: «el objetivo es 0: así no hay asincronía».
- g5 *test* `mn-bnm-neostigmina` (`modelo: placa 'neostigmina'`): «¿Cómo revierte la neostigmina?» → inhibe la AChE: la ACh acumulada gana la competición a los no despolarizantes (p. 30-31). Distractores: «se une al rocuronio» (es el sugammadex, p. 31); «piridostigmina sirve igual» (no se usa para revertir, p. 31).
- g6 *test* `mn-bnm-sugammadex` (`modelo: placa 'sugammadex'`): «¿Por qué el sugammadex es más rápido?» → se une directamente a los aminoesteroides (rocuronio, vecuronio; mucho menos pancuronio): 2-3 min a cualquier profundidad, sin efectos colinérgicos (p. 31).
- g7 *destapa* «son dos cosas» `mn-bnm-ruego`: «¿Por qué evitar la parálisis prolongada?» → (1) sin EEG continuo no sabes si la sedación y la analgesia bastan, y estar despierto paralizado es horrible; (2) más miopatía del crítico, neumonía hipostática, TEV y úlceras (p. 31).
**Examínate (MIR)**
- e1 *test* `mn-tabla-46-7`: «¿Cuál tiene inicio más lento?» → cisatracurio 5-7 min (p. 29). Distractores: rocuronio 1,5-3, succinilcolina 1-1,5.
- e2 *test* `mn-bnm-cisatracurio`: «Fallo renal y hepático: ¿qué perfusión?» → cisatracurio 1-3 µg/kg/min: ni riñón ni hígado (p. 29-30). Distractor: rocuronio 5-12 µg/kg/min (prolongado en el fallo hepático, p. 29-30).
- e3 *test* `mn-bnm-sugammadex`: «Bloqueo profundo con rocuronio en el quirófano, 70 kg: ¿dosis?» → 4 mg/kg = 280 mg (p. 31). Distractores: 2 mg/kg (moderado), 16 mg/kg (recién intubado).
- e4 *test* `mn-bnm-neostigmina`: «Neostigmina 70 µg/kg en un bloqueo moderado: ¿cuánto tarda?» → 8-45 min según relajante, profundidad y anestésico (p. 31). Distractor: 2-3 min (sugammadex).
- e5 *test* `mn-bnm-usos`: «¿Cuál NO es un uso de los relajantes en el libro?» → «tratar el estado epiléptico refractario». Distractores: intubar, evitar escalofríos en la hipotermia inducida, sincronizar al muy agitado (p. 29). Explicación sin afirmar lo que Marino no dice: «no figura entre los 3 usos (p. 29)».
- e6 *test* `mn-bnm-mecanismo`: «¿Con qué peso se dosifican?» → muchos expertos, con el ideal (p. 29). Distractor: «real, siempre».
- e7 *encuentra el error* (1) `mn-bnm-sugammadex · mn-bnm-neostigmina`: «Sugammadex revierte rocuronio y vecuronio ✓ · su efecto es más rápido que la recuperación espontánea de la succinilcolina ✓ · la neostigmina se puede repetir hasta 100 µg/kg si no revierte ✗ (nunca >70, p. 31) · el sugammadex no tiene efectos colinérgicos ✓» (p. 31).
**Caso Melquíades** (vive aquí; 6 pasos; ficha: 62 a, 70 kg, neumonía grave, FRA, cirrosis Child B)
1 · Día 0, 03:00: intubación urgente; K⁺ **6,1**, bilirrubina 4. *Test* ¿qué relajante y cuánto? (rocuronio 1 mg/kg = **70 mg**: succinilcolina contraindicada con hiperpotasemia —+0,5 sobre 6,1—, p. 30; distractores: succinilcolina 1,5 mg/kg «porque dura menos»; cisatracurio 0,2 mg/kg «porque no depende del hígado» —tarda 5-7 min—). Calc `mn-bnm-calc`; `modelo: ritmoVivo 'hiperk'`.
2 · **Giro**, 03:04: Cormack 4, no se intuba ni se ventila con mascarilla, SpO₂ 84 %. *Test* ¿qué das? (sugammadex 16 mg/kg = **1.120 mg**, 2-3 min, p. 30-31; distractores: neostigmina 70 µg/kg —bloqueo recién puesto, tarda 8-45 min—; sugammadex 2 mg/kg —es del moderado—; «esperar: el rocuronio es intermedio» —una hora—).
3 · 05:00, intubado con fibrobroncoscopio; SDRA con asincronía grave. *Test* perfusión (cisatracurio 0,15-0,2 mg/kg + 1-3 µg/kg/min: ni riñón ni hígado, p. 30; distractor rocuronio 5-12 µg/kg/min —prolongado en la hepatopatía—).
4 · Día 2: TOF 0/4. *Destapa* «son dos cosas»: bloqueo excesivo → bajar hasta 1-2 respuestas (p. 30) · sedación profunda y analgesia siempre; sin EEG no sabes si bastan (p. 31).
5 · Día 5, se plantea retirar. *Error* (2): «Parar la perfusión de cisatracurio ✓ · Revertir con sugammadex 4 mg/kg ✗ (solo aminoesteroides, p. 31) · Si no revierte, neostigmina 100 µg/kg ✗ (nunca >70, p. 31) · Contar con efectos parasimpaticomiméticos si se da neostigmina ✓ (p. 31) · Cuanto más dure la parálisis, más riesgo de miopatía ✓ (p. 31)».
6 · Día 9: despierto, flácido, arreflexia, no se desteta. *Test* (neuromiopatía del crítico: relajantes, sepsis e hiperglucemia predisponen a la MCC; conducción y EMG/biopsia para distinguir; sin tratamiento, p. 28; distractores: «bloqueo residual: sugammadex» —el cisatracurio dura 35-50 min—; «GBS: IgIV»).
**Lo que te llevas**: K⁺ alto = no succinilcolina · rocuronio dura una hora: sugammadex 16/4/2 mg/kg · TOF 1-2 y nunca paralizado sin sedación. **Volver**: `ancla: 'mn-bnm-sugammadex'`, placa `sugammadex` (espera).
**Para profundizar**: `mn-bnm-usos` · `mn-bnm-mecanismo` (peso ideal) · `mn-bnm-ruego` · Manual UMI, secuencia rápida (botón ya en la ficha).

## Criterios clínicos (R3) — la regla exacta, sin añadir
- Intubar en la debilidad neuromuscular: **CV ≤15 mL/kg (o <1 L)** y **PIM −20 cmH₂O** (normal «>−100», errata reproducida); BiPAP solo si mejoría en días (p. 25); igual en el GBS (p. 27). Ningún otro umbral; la CV normal no la da Marino (no se usa).
- Tabla 46.5 (p. 24): aminoglucósidos, fluoroquinolonas, macrólidos, penicilinas · BB, calcioantagonistas, Ia · relajantes · corticoides altos, inhalados, **magnesio**, litio. **Solo eso**: ni mecanismo ni umbral del Mg (el bloqueo por Mg >10 / parada >13 es de la ficha de magnesio de Marino renal, `iones-vivos-data.js` l. 21, y **no entra** en 6C).
- Crisis: IgIV 2 g/kg en 2-5 d · plasmaféresis 5 sesiones/7-10 d, 1-1,5 volúmenes · 70 % · IgIV 4-5 d frente a 2.ª sesión · piridostigmina no · metilprednisolona 2 g/d ×2 discutida (p. 26).
- Tabla 46.7 (p. 29) y texto (p. 30-31): succinilcolina 1-1,5 mg/kg, 60-90 s, 7-12 min, +0,5 K⁺ · rocuronio 1 mg/kg, 1,5-3 min, 50-70 (tabla) / 30-70 (texto) min, 5-12 µg/kg/min · cisatracurio 0,15-0,2, 5-7 min, 35-50 min, 1-3 µg/kg/min · TOF 2 Hz cubital, objetivo 1-2 · neostigmina 70 µg/kg, 8-45 min, nunca más · sugammadex 16/4/2 mg/kg, 2-3 min.

## Huecos y riesgos
- **Fuente pendiente**: mecanismo del frío en la placa (Marino: «puede mejorar», p. 24); mecanismo del Mg y de los aminoglucósidos en la placa; CV normal; cifras de FC/PA de la disautonomía (las de Florentina son del paciente).
- **No usar**: «>48 h» de parálisis; «por encima de 70 no revierte más»; «hielo >2 min no añade»; «abrir los ojos bajo el relajante = sedación insuficiente» (no está en p. 31).
- Riesgo: toda la parte Juega de 6C **espera a la placa y al pulmón**; sin ellos, las calculadoras ✅ sostienen el recorrido. e1 de la miastenia (paracetamol) debe decir «no figura», nunca «seguro».

## Lo que tacha el constructor
3 fichas con `entrada`, guía en el orden del texto, examen, caso y profundizar · ids `mnm-`, `mng-`, `mnr-` · cada pregunta con `fuente` (ids reales de arriba) y página en la explicación · `modelo` de la placa y del pulmón solo cuando existan (si no, `calculadora`) · notas: PIM «>−100», rocuronio 50-70/30-70, neostigmina 5 mg = FDA · pasos de la hendidura 1, 2 y 5 con `origen: 'fisiología general'` · jueces `--ficha libros:marinoNeuro:panel-marino-neuro-tabs:mn-miastenia` (y las otras dos) en verde a 390/360.
