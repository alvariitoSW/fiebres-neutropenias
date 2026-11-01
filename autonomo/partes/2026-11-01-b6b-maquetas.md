# 2026-11-01 · b6b (pasos 1 y 2: cobertura y maqueta del eje hormonal; Estudiar del grupo 6L)

**Resultado:** en revisión ([PR #81](https://github.com/alvariitoSW/fiebres-neutropenias/pull/81), borrador) · **Vueltas:** 3 (eje) + 1 (6L) ·
**Jueces:** `--ficha` de las 3 fichas del 6L ✅ · programas de las maquetas ✅ · auditoría eje B 0 graves, 6L 0 graves.

## Qué se hizo
- Cobertura de las 25 fichas (≈85 %; grupos 6E-6L). Fichas de consulta: `mu-vitaminas-oligo`, `mu-formulas`,
  `mu-npt-soluciones`, `mt-unidades`, `mt-referencias`, `mt-cuerpo`.
- Eje hormonal: 2 maquetas (el profesor propuso 2, no 3); Educación eligió **B «Dos glándulas, un enfermo»** (8,55 →
  9,1 → **9,5**) con los 6 injertos de A. Lista R2 en `bloques/b6b/lista-r2-eje.md`. Elección en `eleccion.md`.
- Hepatocito para los tóxicos: solo datos (anexo §5); espera a que el b5 entre en `main`.
- Estudiar 6L (apéndices) en la app, con caso de Visitación; auditado y arreglados sus 4 medianos.
- Otra fuente del eje: Libro Azul cap. 45 (en `docs/`) + Younes 2017, Huang-Bianco 2008, Langouche 2023. Hueco: cifra de CBG.
- Revisión del encargo (Explore): el hepatocito solo vive en `auto/b5`; sus vías apagadas apuntaban a otras fichas.

## Para el usuario
«Vale» o «cámbialo» a la maqueta B (enlace en la PR). Si no dice nada, se construye así.

## Pendiente
Los grupos 6E, 6F, 6G, 6J y 6K los llevan 5 sesiones (`auto/b6b-6e…6k`), que se juntan en `auto/b6b`. El eje en la
app (sonnet 2,0 M + Mayéutica 1,2 M) y las vías del hepatocito (6H, 6I) en sesiones nuevas tras el reinicio del lunes.

## Propuestas sobre las reglas
- **Constructor de Estudiar de consulta**: 62 pasos / 1,8 M frente a 50 / 1,2 M; pasó la suite `--ficha` varias veces
  durante el trabajo. Proponer que la pase una sola vez, al final.

## Vueltas
| Pieza | Vuelta | Nota | Constructor | Pasos | M | Qué falló |
|---|---|---|---|---|---|---|
| Eje A / B | 1 | 8,0 · 8,55 | sonnet ×2 | 28 · 36 | 1,83 | A cortada a 390 px; tratamiento sin efecto en el enfermo |
| Eje B | 2a + 2b | 9,1 | sonnet ×2 | 34 · 22 | 1,43 | chip y frase no seguían al caso; PAM 55 sin noradrenalina |
| Eje B | 3 | 9,5 | sonnet | 20 | 0,37 | — |
| 6L | 1 + arreglos | — | sonnet ×2 | 62 + ≤18 | ≈2,0 | 4 medianos de auditoría |

## Gasto
`gasto.mjs --clave b6b` antes del cierre: **≈11,2 M** (constructores sonnet 7,2 M · profesor fable 2,1 M · director
≈1,0 M · auditores, Explore y búsqueda 0,7 M). Los que más: Estudiar 6L 1,8 M, vuelta 2a 1,0 M, cobertura 1,0 M.
Ahorro: el 6L pasó la suite de jueces varias veces; pasarla solo al final.

## Cuentas
Presupuesto 10,05 M (Hacienda: hepatocito sin maqueta, −2,7 M; un juicio para las dos maquetas). Gastado ≈11,2 M:
**+11 %**, dentro del +25 %. Causa: el 6L (+0,6 M) y una vuelta 2a más larga. Bloque b6b: techo 30-45 M; quedan
≈19-34 M (la cobertura estima ≈38 M para el bloque entero).
