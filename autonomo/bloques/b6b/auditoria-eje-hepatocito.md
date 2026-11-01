# Auditoría ciega · eje en la app + vías del hepatocito (sonnet, 01/11, sesión 2) · 2 graves, 6 medianos, 5 menores
Verificado sin hallazgo: dosis y cifras del eje (PTU, metimazol, propranolol, yodo, hidrocortisona 300+100/8 h, levotiroxina, liotironina, mortalidades, cortes 10/35, Δ9, 15-25/350 mg), páginas, ids y figuras.
## Graves
1. `hepatocito-vivo/modelo.js:62-63`: «>15 g tóxica casi segura (p. 5)» — p. 5 dice 7,5-15 g; >15 g «casi segura» no está. «10-30 g de aspirina serían mortales» — p. 14 «pueden ser mortales». Arreglo: «por encima de 15 g, fuera del rango habitual de dosis tóxica (7,5-15 g, p. 5)», tramo >15 ilustrativo; «pueden ser mortales».
2. `eje-vivo-data.js`, Policarpo paso 2: «la ficha dice que no requiere tratamiento» — p. 54 no da pauta. Rotular inferencia y citar otra fuente (ATA 2016, Ross et al., ref. del propio Marino) o quitarlo.
## Medianos
3. `hepatocito/modelo.js:75`, `pagina.js:94`: «el fomepizol no corrige el ácido que ya hay» → «bloquea la AD (p. 27); mejor en las primeras 4 h (p. 28)»; el resto, «inferencia del modelo».
4. `modelo.js:73,76`: fomepizol cada 4 h «con diálisis» → solo «si hacen falta varias sesiones» (Tabla 53.2, p. 28).
5. `modelo.js:65`, `pagina.js:88`: «sin NAC… mueren los hepatocitos» → añadir «efecto de la NAC y muerte celular: ilustrativo».
6. `hepatocito-vivo-data.js:62,86`, `pagina.js:86`: «90 %» → «≈90 % (el libro: "la mayor parte"; ≈10 % por el P450)».
7. `modelo.js:69`, `pagina.js:91`: alcohol → «induce el P450 y, por la mala nutrición, puede bajar el glutatión» (p. 5, «probablemente»).
8. `eje-vivo-data.js`, Toribio paso 2: quitar «por eso no se espera a la cifra» como razón de Marino; «inferencia» en el origen.
## Menores
9. Nodo «glutamato + cisteína + glicina»: nota «errata de la fuente», no «las fuentes discrepan».
10. Casimira `dosis 6` con `glut 10`: rotular «dosis acumulada de varios días, ilustrativo» o subir a 10 g.
11. Policarpo paso 4: «<10» frente a «8 µg/dL ilustrativo»: unificar.
12. PROFUNDIZAR del eje: efectos de PTU/metimazol en p. 54-55, no 55.
13. Toribio NA 0,4: unidad (µg/kg/min) en el monitor o «ilustrativo» frente a «vasopresor moderado» (p. 51).
No comprobado: `topes()` y textos de `pagina.js` del eje, Mayéutica; webs de Younes, Huang, Langouche.
