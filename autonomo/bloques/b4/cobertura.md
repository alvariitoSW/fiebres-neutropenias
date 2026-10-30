# Bloque 4 · Marino caps. 31-38 · Mapa de cobertura (profesor, 30/10/2026)

*Hecho con el texto completo de las 23 fichas `mr-*` (`js/modules/libros/marino-renal.html`, líneas 349-2294; ya traen 515 ids, no hace falta ponerlos), los dos PDF pasados a texto página a página (cap. 31 = p. 2-15, 32 = 16-31, 33 = 32-43, 34 = 44-60 del PDF `caps31-34`; cap. 35 = 1-17, 36 = 18-30, 37 = 31-41, 38 = 42-54 del PDF `caps35-38`) y los estados reales de los modelos leídos del código. Detalle por ficha, estados nuevos, casos y presupuesto: `cobertura-anexo.md`.*

## 0. El bloque en una pantalla

| # | Ficha | Modelo vivo y estados (✅ existe · ➕ estado nuevo · 🆕 maqueta) | Ideas | Cub. | % | En modelo |
|---|---|---|---|---|---|---|
| 1 | `mr-acidobase-analisis` | Ácido-base vivo ✅ `0-2`, Carmen `s1-s6`, `respAg/respCr/mixta` | 20 | 18 | 90 | 10 |
| 2 | `mr-acidobase-gaps` | Ácido-base vivo ✅ balanza `cad/lactica/salic/metanol/diarrea/atr1-2-4/acetazol`, `3/3b` (delta); nefrona ✅ `atr*` | 18 | 16 | 89 | 10 |
| 3 | `mr-lactato-bicarbonato` | Ácido-base vivo ✅ `lactica`, `bicarb` ➕ `titulacion` (Fig. 32.2); capilar ✅ `sepsis` | 22 | 18 | 82 | 8 |
| 4 | `mr-cetoacidosis` | Ácido-base vivo ✅ Lucía `0-3b` ➕ `caa`; iones vivos 🆕 `insulina-k` (Tabla 32.4); nefrona ✅ `hiperglucemia` | 24 | 21 | 88 | 12 |
| 5 | `mr-alcalosis-mecanismos` | Ácido-base vivo ✅ `4 vomitos`, `hiperaldo`; nefrona ✅ `furosemida/tiazida` ➕ `pendrina` (Fig. 33.1) | 20 | 18 | 90 | 11 |
| 6 | `mr-alcalosis-tratamiento` | Ácido-base vivo ✅ `5` (salino + ClK) ➕ `acetazolamida`, `hcl`, `mg-bajo` | 16 | 15 | 94 | 8 |
| 7 | `mr-fra-criterios` | Glomérulo ✅ ➕ lector `creatinina engaña` (masa muscular); calculadoras KDIGO y CG en el caso | 14 | 12 | 86 | 4 |
| 8 | `mr-fra-causas` | Glomérulo ➕ `congestion` (Pv) y `pia` (Fig. 34.2 viva); nefrona ✅ `nta` (Fig. 34.3) | 20 | 18 | 90 | 12 |
| 9 | `mr-fra-nefrotoxicos` | Nefrona ➕ `rabdo` (mioglobina, flujo tubular); glomérulo ✅ `aine` | 16 | 13 | 81 | 6 |
| 10 | `mr-fra-indices` | Nefrona ✅ `prerrenal/nta/obstruccion` ➕ `prerrenal+furosemida` (EFNa engaña, EFU decide) | 16 | 15 | 94 | 10 |
| 11 | `mr-trr` | Filtro vivo ✅ difusión/convección/híbrida ➕ `k-urgente` (1 mEq/L en 1 h) | 14 | 12 | 86 | 9 |
| 12 | `mr-osmolalidad` | Río y mar ✅ `osmolalidad` (urea no mueve agua); ácido-base ✅ `metanol` | 12 | 11 | 92 | 8 |
| 13 | `mr-hipernatremia` | Río y mar ✅ `hipernatremia` (neurona, osmolitos) ➕ `di`, `furosemida-glucosado`; nefrona ✅ DI | 22 | 19 | 86 | 12 |
| 14 | `mr-hiponatremia-dx` | Río y mar ✅ `hiperglucemia`, `hiponatremia` ➕ `pseudo` (fase no acuosa); nefrona ✅ `siadh` | 22 | 19 | 86 | 10 |
| 15 | `mr-hiponatremia-tto` | Río y mar ✅ `salino3` ➕ `sobrecorreccion` (diuresis acuosa) y `desmopresina` | 18 | 17 | 94 | 10 |
| 16 | `mr-hipopotasemia` | Iones vivos 🆕 (escena del potasio + Fig. 36.2 viva); ritmo ➕ `hipok` (U, T plana, QT); nefrona ✅ `furosemida` | 20 | 18 | 90 | 12 |
| 17 | `mr-hiperk-causas` | Ritmo ✅ `hiperk` ➕ escalera `hiperk-1..4` (Fig. 36.4); iones vivos 🆕 lupa `tubo` (ficticia) | 20 | 18 | 90 | 12 |
| 18 | `mr-hiperk-tratamiento` | Iones vivos 🆕 (hiperpotasemia-sim: calcio, insulina, salbutamol, SZC, HD con reloj ✅); ritmo `hiperk → calcio` | 18 | 17 | 94 | 12 |
| 19 | `mr-magnesio-deficit` | Iones vivos 🆕 Mg (Tabla 37.1, Fig. 37.1 viva); nefrona ➕ Mg en el asa; ritmo ✅ `torsade` | 24 | 20 | 83 | 10 |
| 20 | `mr-magnesio-reposicion` | Iones vivos 🆕 `reponer-mg` (50 % a la orina), `retencion`, `hipermg`; ritmo ✅ `pend-bav1/bav3` + gluconato | 18 | 16 | 89 | 10 |
| 21 | `mr-calcio-hipoca` | Iones vivos 🆕 Fig. 38.1 viva (albúmina, pH, citrato, bicarbonato), `sepsis`, `transfusion` | 22 | 19 | 86 | 12 |
| 22 | `mr-hipercalcemia` | Nefrona ✅ `hiperpara/hhf` ➕ `hiperca-diuresis` (hipovolemia → menos Ca fuera); río y mar ✅ | 14 | 13 | 93 | 6 |
| 23 | `mr-fosforo` | Iones vivos 🆕 `realimentar` (Fig. 38.2), `alcalosis-resp` (pulmón b3d); capilar ✅ curva de Hb (2,3-DPG) | 20 | 17 | 85 | 10 |
| **Bloque** | | **1 maqueta nueva** (iones vivos) · 5 modelos ampliados · 23 estados nuevos | **430** | **380** | **≈88 %** | **224 (52 %)** |

**Piezas comunes** (se hacen primero; anexo §6): (1) **El ECG del ritmo vivo dentro de la escena del potasio**: un solo pintor de ondas (`ritmo-vivo-data.js` `hiperk`, `torsade`, `pend-bav*` ➕ `hipok`, `hiperk-1..4`), no el `onda()` propio de `potasio-escena.js`; (2) **La célula + plasma + riñón de la escena del potasio** como contenedor de K⁺, Mg²⁺, Ca²⁺ y fosfato (partículas con el mismo molde y colores de `formas-iones`): Mg, Ca y P son **estados y mandos nuevos de un modelo ampliado**, no tres modelos; (3) **El pulmón de b3d** presta la PaCO₂ al ácido-base vivo (bicarbonato → CO₂ 200 mmHg; alcalosis respiratoria → hipofosfatemia) y el **monitor + `js/core/tope.js`** de b3 se reutilizan tal cual; con `b3-corazon-pr` se comparte solo el ECG (pieza 1), ningún archivo del motor. **Pacientes** (anexo §7): Sofía 29 (CAD), Benito 63 (metformina), Damián 52 (alcohólico: CAA, realimentación), Rufino 74 (SNG + furosemida: alcalosis, hipoK, Mg), Matilde 69 (cardiorrenal + PIA), Gregorio 57 (rabdomiólisis), Casilda 81 (tiazida → salino 3 % → sobrecorrección), Nicolás 36 (HSA → DI), Adela 72 (hiperK con IECA + espironolactona; antes, ficticia), Valentín 45 (transfusión masiva: citrato, K⁺ de la bolsa), Encarna 59 (mieloma: hipercalcemia). Ninguno repite nombre de b1-b3 ni de Lucía/Carmen/Teresa (los casos de los modelos se quedan).
**Ruta (4 grupos de Estudiar)**: **4A La gasometría** (1 → 2 → 3 → 4 → 5 → 6) · **4B El riñón que falla** (7 → 8 → 10 → 9 → 11) · **4C El agua y el sodio** (12 → 13 → 14 → 15) · **4D Los iones de la célula** (16 → 17 → 18 → 19 → 20 → 21 → 22 → 23). Empezar por 4A (el modelo ya tiene Mayéutica) y 4C (río y mar casi listo); 4D espera a la maqueta de iones vivos y al ECG de b3-corazon-pr.
**Presupuesto estimado del b4** (anexo §9, con la tabla del TABLERO): cobertura 0,9 (hecho) · maqueta iones vivos 2 vueltas + app ≈ 15 · 5 ampliaciones ≈ 17 · 4 Estudiar ≈ 20 · director, jueces y PR ≈ 5 → **≈ 58 M** (45-72 ✅); con el atajo de no hacer maqueta y ampliar la escena del potasio directamente, ≈ 50 M.
**Hallazgos que cambian el plan**: ninguna ficha necesita ids nuevos ✅; el ácido-base vivo ya tiene Mayéutica y dos casos (Lucía CAD, Carmen EPOC) que 4A reutiliza ✅; `hiperpotasemia-sim.js` ya lleva fármacos con reloj ✅; el glomérulo **no tiene** `congestion` ni `pia` ❌ (R8 lo pidió); el ritmo vivo tiene `hiperk` pero **no** la escalera ni la hipoK ❌; la nefrona **no pinta** el Mg en el asa ni la célula de la pendrina ❌.

**No comprobado / riesgo**: no abrí los modelos en el navegador (solo código y datos); las páginas del PDF salen de la primera aparición de cada término, pueden bailar ±1; la cuenta de ideas es a ojo del profesor, el auditor debe cotejar los casos (cifras de pacientes posibles, §1.12); el estado «DI» de la nefrona sí existe (`id: 'di'` en `js/data/nefrona-data.js`, comprobado por el director).
