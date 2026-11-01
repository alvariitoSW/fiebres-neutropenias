# Encargos · b4 · piezas del grupo 4A en el ácido-base vivo (01/11, director)
Base: `revision-piezas-4a.md`. Modelo: ácido-base vivo (`js/modules/nefrologia/acidobase-vivo.js` 1880 l. — **no le añadas
código salvo ganchos de 1-3 líneas**; lo nuevo va en `js/modules/nefrologia/acidobase-vivo-b4.js`; datos en
`js/data/acidobase-vivo-data.js`, ≤700 l.). Prueba: `autonomo/pruebas/acidobase-vivo.mjs` (añade un caso por estado y barrido
de extremos de sus mandos). Fuente: **A** = `docs/marino-2024-acido-base-renal-caps31-34.pdf` (página = página del PDF) y el
texto de la ficha en `js/modules/libros/marino-renal.html`. Un estado por encargo («estado nuevo con barrido», REGLAS §4.14).
No toques: eco, pulmón, ritmo vivo, iones vivos, b5, b6a. No subas versión (lo hace el director al juntar).

## E1 · `caa` (cetoacidosis alcohólica) · sonnet 30 pasos / 0,5 M
Estado en `CAUSAS` con `anion:'ceto'` (ya existe): HA alto sin hiperglucemia, **nitroprusiato negativo** porque el cetoácido
dominante es el β-OHB (cociente redox), pH a menudo casi normal por alcalosis de los vómitos (mixto); tratamiento: salino con
glucosa + tiamina, no insulina. Ficha `mr-cetoacidosis` (y su `#mr-redox`), A p. 25-29 (comprueba la página exacta). Botón
de enlace `data-acidobase-vivo` desde la ficha al estado. Frase viva con cita.

## E2 · `hcl` (alcalosis grave: ácido clorhídrico) · sonnet 30 pasos / 0,5 M (tras E1, mismos archivos)
Fármaco en el tipo `farmaco` (ya existe): solo HCO₃⁻ >50 o pH >7,55; dosis 0,5·peso·(HCO₃⁻ − 24) mEq, ≤0,2 mEq/kg/h, por
vena central (Tabla 33.3, A p. 40). Tope con origen y consecuencia visible (§1.14). Ficha `mr-alcalosis-tratamiento`.

## E3 · `titulacion` (Fig. 32.2) · sonnet 40 pasos / 1,2 M (tras E2)
Curva de titulación del bicarbonato (pK 6,1): por qué el HCO₃⁻ tampona mal a pH 7,4; punto del paciente sobre la curva desde
el motor (`acidobase-vivo-calculo.js`), no inventado. Dibujo nuevo en `acidobase-vivo-b4.js` (rótulos ≥8 px a 360). Ficha
`mr-lactato-bicarbonato`, A p. 22 (Fig. 32.2).

## «Hecho» de cada uno
`node autonomo/jueces.mjs --modelo acidobase-vivo` (o `--ficha libros:marinoRenal:panel-marino-renal-tabs:<id>` de su ficha)
en verde a 390 y 360; cifras del motor con su página; lista de `.claude/agents/constructor.md`; commit en su rama `wt/b4-<clave>`
con las líneas de autoría; informe ≤25 líneas en `/tmp/plan-socialista/b4/pieza-<clave>.md` con frases nuevas y riesgos.
