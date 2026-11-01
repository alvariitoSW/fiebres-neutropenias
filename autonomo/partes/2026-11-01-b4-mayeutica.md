# 2026-11-01 · b4 · Mayéutica de iones vivos y piezas del 4A (director, sesión 1 de 2)

**Resultado:** en `auto/b4` (a68f8ca, versión 20261101-17), sin PR todavía: la PR del bloque la lleva la sesión 2 del director al juntar 4A-4D
**Vueltas:** 3 (+ 2 líneas del director) · **Jueces:** `--modelo iones-vivos --forma` ✅ (exit 0) · `--modelo acidobase-vivo --ficha mr-cetoacidosis` ✅ (exit 0) · prueba `iones-vivos.mjs` ✅ 390/360 · auditores: 0 graves · profesor: ver «Vueltas»

## Qué se hizo
- **Iones vivos: Explorar | Preguntas** (motor común): 13 preguntas (7 de guía + 6 de examen), casos de **Adela** (5 pasos) y **Valentín** (3); el modo viejo Apuesta/Error/Caso, migrado y borrado; los 2 pelos sueltos del 30/10, arreglados.
- **Cifra del motor corregida**: la insulina baja el K⁺ **0,6 mEq/L por dosis** (p. 28; antes 0,5). Adela 6,6 → 6,0.
- **Piezas del 4A en el ácido-base vivo**: estados `caa`, `hcl` (con salino previo y «pH aceptable, p. ej. <7,5») y `titulacion` (Fig. 32.2, archivo nuevo `acidobase-vivo-b4.js`), con guía, prueba y botón en su ficha.
- Revisiones del encargo (`revision-encargo-iones-mayeutica.md`, `revision-piezas-4a.md`): Rufino fuera de los casos (el motor no acopla Mg→K), `pendrina` no se duplica en la nefrona, `mg-bajo` al 4D; el motor corrige dos pH del anexo (Sofía 7,18; Rufino 7,54).

## Qué no se pudo hacer o leer
- El acople Mg→K (Rufino: K⁺ que no sube sin Mg) no está en el motor: pieza del 4D.
- Menores sin tocar: la frase de la acción `ca` habla de hiperpotasemia también en el caso de Valentín; «Motivo: 10 concentrados» convive con «14» en su paso 3; el Mg²⁺ de G5/E4 no está en la primera pantalla del monitor.

## Para el usuario
Nada que decidir ahora. Para mirarlo: Libros → Marino → «Iones vivos» → Preguntas (caso de Adela entero); Nefrología → ácido-base vivo → «Cetoacidosis alcohólica», «Ácido clorhídrico» y «Curva de titulación».

## Propuestas sobre las reglas
- **Cambio de bitácora a mitad de sesión**: el 4A se partió en otra sesión cuando sus piezas ya estaban hechas aquí. Propuesta: antes de repartir un grupo, la bitácora mira la rama del bloque (`git log origin/auto/<bN>`).

## Vueltas
| Pieza | Vuelta | Nota mínima (criterio) | Constructor | Pasos | M | Qué falló |
|---|---|---|---|---|---|---|
| Mayéutica iones vivos | 1 | 6,8 (caso de Adela, §1.12) | sonnet | 54 | 2,1 | Adela: K⁺ que no baja con insulina; dificultad 7,5; forma (buena más larga) |
| Arreglos | 2 | 8,3 (estado del modelo al destapar) | sonnet | 38 | 0,74 | G1/G5/E4 sin efecto; frase viva arrastrada; citas dobles |
| Arreglos | 3 | 8,3 (Valentín: K⁺ tapado) | sonnet | 10 | 0,10 | el paso 3 pedía leer un K⁺ tapado |
| Línea del director | 4 | ver rejuicio2 | — | — | — | — |
| 4A `caa` + `hcl` | 1 | auditor 0 graves, 2 medianos | sonnet | 42 | 0,46 | caso de HCl sin salino previo |
| 4A `titulacion` | 1 | — | sonnet | 38 | 0,56 | — |

## Gasto
`gasto.mjs --clave b4` (esta sesión, antes del cierre): **6,9 M**. Por papel: constructor sonnet ×6 4,0 M (58 %) · director 1,7 M (26 %) · profesor ×3 0,46 · Explore ×2 0,34 · auditor ×2 0,31. Los que más: constructor de la Mayéutica 2,1 M (54 pasos de 50: el juez de forma completo se comió los últimos pasos; la próxima vez, el juez de forma solo con `--modelo`), director 1,7 M, arreglos 0,74.

## Cuentas
Presupuesto 4,35 M (sesión) + 2,75 M (piezas del 4A, añadidas en la sesión) = 7,1 M. Gastado ≈7,1 M (con el cierre). Desvío ≈0 %; la Mayéutica +75 % (2,1 de 1,2), compensada por vueltas cortas. Bloque b4: ≈18,3 M de 58; quedan ≈39,7 M para 4A-4D (que llevan otras sesiones), la unión y la PR.
