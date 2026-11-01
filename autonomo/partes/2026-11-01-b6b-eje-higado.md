# 2026-11-01 · b6b sesión 2 (eje hormonal en la app, vías del hepatocito para tóxicos, Estudiar 6H y 6I)

**Resultado:** en la rama `auto/b6b` ([PR #81](https://github.com/alvariitoSW/fiebres-neutropenias/pull/81), borrador; la vota y fusiona la sesión de cierre del b6b) · **Vueltas:** 3 por pieza ·
**Jueces:** `--modelo eje-vivo` ✅ · `--modelo hepatocito-vivo` ✅ · `--ficha` de las 6 fichas ✅ (390 y 360) · `mayeutica-fichas` arreglado (ya no se cae; sus 3 fallos del 6E/6L los corrigió la sesión de cierre).
**Notas del profesor (final):** eje vivo **9,4** · Mayéutica del eje **8,6** · hepatocito (vías) **8,3** · 6H **8,75** · 6I **8,75**. Todo ≥8; dos piezas por debajo de 8,75 con receta corta en `bloques/b6b/rejuicio-final.md`, que pasa a la sesión de cierre (busca 9,5).
**Auditor:** 4 pasadas (eje+hígado, 6I, 6H, vueltas 2); todos los graves arreglados (entre ellos: «>15 g tóxica casi segura», agranulocitosis «solo del PTU» —el metimazol también la da, Cheung 2016—, Eufrasia y Eleuterio pacientes imposibles).

## Qué se hizo
- Fusionados `main` y `auto/b5` (hepatocito y termostato). Revisión del encargo (Explore): pieza del eje partida en 1a/1b, jueces y registro concretados.
- **Eje vivo en la app** (`js/modules/libros/eje-vivo/`, `js/data/eje-vivo-*.js`): lista R2 1-14 tachada; 7 pacientes, mandos con topes y página, reloj, mapa T4×TSH y barra del cortisol; prueba `autonomo/pruebas/eje-vivo.mjs` (barrido de extremos, 42 cambios de paciente, cifras R2 7-8); Mayéutica (7 de guía, 4 de examen, 2 apuestas, 2 errores, 2 casos); 7 botones en las fichas del cap. 51.
- **Hepatocito para los tóxicos**: vías del paracetamol y los alcoholes por datos (`VIAS`), pantalla y monitor propios por vía, figura real 52.2/53.3 en su hueco, metabolito tóxico que se acumula, NAC que frena pero no resucita, 4 presets nuevos (Eufrasia, Nicanor, Gumersindo, Ruperto) + Eleuterio; 4 botones en las fichas.
- **Estudiar 6H** (`b6b-eje*.js`, 7 casos de 5 pasos) y **6I** (`b6b-higado.js`, 7 casos; Eleuterio para la diálisis).
- Cifra mala del motor arreglada en su origen: con hidrocortisona la noradrenalina volvía a no contar (Toribio).

## Para el usuario
Nada que decidir. Para verlo: Libros → Marino → Nutrición y endocrino → `Suprarrenal` → «Ver a Toribio en el eje vivo»; Tóxicos → `Paracetamol` → botón del hepatocito (selector Paracetamol | Alcoholes).

## Propuestas sobre las reglas
- **El juez de la Mayéutica de fichas no registraba los bancos nuevos** (b6b) y se caía con archivos de ayuda: nadie vio los casos cortos del 6H. Propuesta: que `mayeutica-fichas.mjs` descubra solo los `js/data/mayeutica/*.js` con `guia` (ya hecho en código) y que el constructor de un Estudiar nuevo lo pase siempre.
- **Pacientes imposibles en casos con umbral** (950 µg/mL tras 12 g): el auditor debe recibir «¿cuadra la cifra con la dosis y la hora?» como pregunta fija en los casos de tóxicos.

## Vueltas
| Pieza | Vuelta | Nota | Constructor | Pasos | M | Qué falló |
|---|---|---|---|---|---|---|
| Eje 1a + 1b | 1 | 9,4 | sonnet ×2 | 27 + 63 | 1,75 | — |
| Mayéutica del eje | 1 · 2 | 8,25 · 8,6 | sonnet ×2 | 64 · 39 | 1,8 | poco banco; 3 pacientes sin pregunta; apuestas que se aciertan por la forma |
| Hepatocito vías | 1 · 2 · 3 | 6,5 · 8,4 · 8,3 | sonnet ×4 | 35 · 35+33 · 15 | 2,1 | pantalla de la urea con la vía tóxica; Eleuterio imposible / monitor sin encefalopatía |
| 6I | 1 · 2 · 3 | 7,5 · 8,5 · 8,75 | sonnet ×3 | 31 · 13+9 · (en fix3) | 1,3 | Eufrasia imposible; casos cortos |
| 6H | 1 · 2 · 3 | 7,8 · 8,5 · 8,75 | sonnet ×2 (+fix3) | 28 · 31 · 30 | 1,8 | casos de 2-4 pasos; frases inferidas sin rótulo |

## Gasto
`gasto.mjs --clave b6b` (esta sesión, antes del rejuicio final): **≈13,0 M** (constructores sonnet 8,9 M · director ≈2,2 M · auditores 1,0 M · profesor 0,75 M · Explore 0,18 M); + rejuicio final y arreglos últimos ≈0,6 M → **≈13,6 M**. Los que más: eje 1b 1,3 M (63 pasos), Mayéutica del eje 1,2 M (64), Estudiar 6I 1,0 M. Ahorro: el eje 1b y su Mayéutica pasaron de 60 pasos; partir la Mayéutica de un modelo en «portar de la maqueta» y «banco nuevo».

## Cuentas
Presupuesto 10,85 M (Hacienda: un auditor y un juicio para 6H+6I, vías sin juicio propio). Gastado ≈13,6 M: **+25 %**, en el límite del Consejo (REGLAS §4.17; anotado en SESIONES). Por qué: tres vueltas en el hepatocito y cuatro auditorías (los graves eran de paciente imposible). Bloque b6b: ≈11,2 (sesión 1) + 13,6 = ≈24,8 M de las sesiones del director 6b, sin las de 6E-6K; techo 30-45 M.
