# b6b · 6H «El eje que calla» · Estudiar (informe del constructor)
Rama `wt/b6b-6h` · versión 20261101-105 · presupuesto: ~35 pasos.
**Archivos**: `js/data/mayeutica/b6b-eje.js` (ficha 12 + registro del conjunto), `b6b-eje-tiroides.js` (fichas 13-14), `b6b-eje-comun.js` (helpers); `js/modules/libros/index.js` (import + 1 llamada); herramientas `cifras-6h.mjs`, `largos-6h.mjs`, `montaje-6h.mjs`.
**Contenido**: 3 fichas · 14+17+12 = 43 tests, con destapa y «encuentra el error» · guía 5/5/4, examen 6/6/6 · 7 casos (Bibiana, Toribio; Sinforoso, Lucrecia, Policarpo; Obdulia, Fulgencio) · «Para profundizar» 2/2/2.
Equilibrio medido (`largos-6h.mjs`): la correcta es la más larga en 3/4/3 de 14/17/12 y la más corta en 2/2/1; posiciones 6-5-3, 7-5-5, 4-5-3. Ids únicos y todos existen en la ficha.
Cifras de los casos: `window.__eje.leer()` a 390 px (Bibiana estrés 2: 89/46 · 112 · lactato 2,5; con hidrocortisona 115/59 · 102; Toribio con hc + 3 días: 99/51 · 95 · lactato 1,6; Sinforoso con metimazol + propranolol: FC 93; Lucrecia +7 días: T 37,4 · FC 80; Obdulia con hc + levotiroxina: 110/56). Ejemplos marcados «ilustrativo»: cortisol 18 y aumento 12 (examen), 33 tras ACTH (Bibiana, aumento 11), agranulocitosis día 10.
## Lista de comprobación
✅ cifras con origen · ✅ cada pregunta con «Ver en el texto» (`fuente` = id) y PDF `#page=` · ✅ no duplicadas las 4 apuestas del modelo (Bibiana: cirugía → aumento 11 hipotético, no el 22→28; Toribio: etomidato/fludrocortisona/retirada, no PA 78/40 ni día 5; Obdulia: 3 pasos distintos) · ✅ Notas con tipo («la fuente no lo dice») · ✅ sin redactar, huecos ni emparejar · ✅ balance largo/corto/posición · ✅ jueces `--ficha` en las 3 fichas (verde, 390 y 360 px; sin ids repetidos ni consola) · ✅ versión subida.
❌/pendiente: topes, botones estables y ficha nueva no aplican (no hay mando ni ficha nueva). R1/R4: sin capturas propias, solo los jueces (ver riesgo).
## Para el director (1 línea que falta fuera de mi alcance)
`js/core/mayeutica.js` no conoce `ejeVivo` en `MODELOS`: el botón «Compruébalo en el modelo» funciona (lleva `data-eje-vivo`), pero el paso «Juega» dice «no enlaza ningún modelo». Basta: `ejeVivo: { especialidad: 'libros', view: 'ejeVivo', nombre: '🧠 el eje vivo' },`. Cuando exista, `nombre` y el título saldrán solos.
## Frases nuevas (mecanismo/conducta que no copié literal de la ficha) y su fuente
- Bibiana: freno de hipotálamo e hipófisis, atrofia sin ACTH, 6-12 meses de recuperación, <10-14 días rápida: Younes 2017 (nota «la fuente no lo dice»).
- Relacionar la hipotensión de Bibiana con el estrés de la cirugía: inferencia (la ficha cita la retirada brusca, p. 50). Pauta del shock séptico aplicada a Bibiana: la ficha no trae otra (dicho en la pregunta).
- Distractores de dosis y cortes (×10, 25 µg, 6 min, «solo por la mañana»): erróneos a propósito; las cifras verdaderas, p. 50-51, 56-57.
- «Perderías el bloqueo de T4 a T3» (PTU), «el esmolol es para ajuste rápido»: Tabla 51.4 y 51.3, p. 54-55.
- «Que se dé una hora después (yodo) es del modelo; la ficha no fija el intervalo»: dicho en la explicación (no se afirma el orden).
- Policarpo: la T3 baja es inferencia (la ficha no da su valor); «no se trata» NO se afirma: «la ficha no trae pauta» (p. 54).
- Lucrecia día 7: "baja la fiebre y la FC" es el eje vivo (cuánto baja, ilustrativo); «volumen, hidrocortisona y desencadenante»: p. 55.
- Fulgencio: desyodasas y T3 inversa: Huang-Bianco 2008 (nota «la fuente no lo dice»); eutiroideo enfermo sin tratamiento, p. 56-57.
- Obdulia: creatinina por creatina muscular, p. 56.
- Distractores con consecuencia clínica («darías hormona a quien no tiene hipotiroidismo», «broncoespasmo», «rebote»): consecuencias razonadas desde las p. 54-57; ninguna cifra nueva.
- Sin cita (fisiología general, trivial): ninguna.
## No comprobado / riesgo
Páginas citadas tomadas de la cobertura y de las guías del eje (no releí el PDF página a página): las cifras de TSH en p. 52-53 y la tríada cardíaca p. 56 conviene cotejarlas. No miré capturas de las preguntas a 390 px (solo los jueces, que no abren los casos); el «Juega» depende de la línea de `MODELOS`.
