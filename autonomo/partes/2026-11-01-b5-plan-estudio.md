# Parte · 01/11/2026 · `b5` plan de Estudiar (día libre de Marino)

**Qué se hizo**: sin tocar la app, 4 profesores (fable, en paralelo) escribieron el plan de Estudiar de las 17 fichas
del bloque 5: `autonomo/bloques/b5/plan-estudio-5a.md` (hígado), `-5b.md` (abdomen), `-5c.md` (fiebre), `-5d.md`
(termostato). Cada uno: carril de 30 s, guía socrática en el orden de la ficha, examen MIR, 2-4 casos que evolucionan
con los pacientes del anexo, R3 con página del PDF comprobada con `pdftotext`, ruta y piezas que faltan.
**Lo que el constructor debe saber antes de empezar** (hallazgos de los profesores):
- No existen aún: filtro `amonio`, nefrona `shr`, glomérulo `pia`, termostato `iatrogenica` y `posparada`, mando de
  dantroleno. Los planes dan alternativa provisional (calculadoras reales, p. ej. `mr-pia-calc`) y coste (0,5 M c/u).
- `js/core/mayeutica.js` (`MODELOS`) no conoce `hepatocitoVivo` ni `termostatoVivo`: sin esa línea, «Compruébalo en el
  modelo» no abre nada (0,1 M).
- **Colisión de id**: `ma-calor-snc` es el `<select>` de la calculadora, pero `termostato-vivo-data.js` lo cita como
  párrafo (resaltaría un desplegable): citar `ma-calor-golpe` o `ma-tabla-43-1`.
- La cobertura dice `ma-col-*`; los ids reales son `ma-cole-*`.
- Paracetamol: el termostato cita el 4 g/día al cap. 52; la ficha, al cap. 6: que cite los dos.
**Sin auditor ni juicio** (es un plan): el auditor cotejará las cifras de los casos al construir.

## Vueltas
| Pieza | Vueltas | Por qué |
|---|---|---|
| 4 planes | 1 | — |

## Gasto
Profesores: 5A 137 k · 5B 150 k · 5C 154 k · 5D 151 k tokens (14-15 pasos medidos de 45 cada uno) ≈ 0,6 M + director ≈ 0,3 M.

## Cuentas
Presupuesto 4 × 0,9 + 0,4 = 4,0 M · gastado ≈ 0,9 M (−78 %): los profesores leyeron solo sus páginas y tenían el modelo
`plan-paso4-g1.md`. Próxima vez: 0,3 M por plan de grupo.
