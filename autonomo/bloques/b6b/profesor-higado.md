# Profesor (juzgar) · vías del hepatocito y Estudiar 6I · 01/11 · **no pasa**: hepatocito 6,5 · 6I 7,5
Medido: 324 combinaciones sin cifra mala; 4 capturas a 390 px.
- Mecanismo 6,5: con la vía del paracetamol la pantalla sigue siendo de la urea (título cap. 39, NH₃ grande, West Haven, «carril de la urea paso a paso», colon, CVVH, TIPS, astrocito). Rótulos que se pisan («≈90 % orina≈10 % tóxico»), «porta»/«sinusoide» cortados, aspa sobre «cisteína». No se ve el metabolito tóxico acumularse.
- Figura 7,5: Fig. 52.2/53.3 en acordeón cerrado; la 39.2 sigue en su hueco.
- Paciente posible 6,0: `hemodialisis` (Mira de Eleuterio) monta a Eufrasia (frase y monitor de ella, sin encefalopatía, hd 0). 12 g con NAC a las 72 h da 100 % de hepatocitos: la NAC no resucita células.
- Guía 6,0: `nac`, `hemodialisis`, `fomepizol`, `coadyuvantes` sin frase propia; fomepizol/diálisis no cambian nada visible.
- 6I preguntas 8,5; casos 6,5: `hig-eu-n` 3 pasos sin destapa; `hig-el-n` 4 pasos sin evolución ni giro.
## Receta
1. `hepatocito-vivo-data.js`: preset `eleuterio` (38 a, 70 kg, 950, h≈72, func≈15 → West Haven ≥2, ALT/INR ilustrativos, nac 1, hd 1, txt) y `hemodialisis` → eleuterio.
2. `pagina.js`: con vía ≠ urea, título/subtítulo/cita de la vía (en `VIAS`); monitor grande glutatión % y paracetamol, o pH y hiatos; esconder NH₃, West Haven, lactulosa, 60/150, «carril de la urea paso a paso», leyenda y modos de la urea.
3. `abrirEstado` (l. 182): frase propia por estado (`txt` en `VIAS[].estados`); guía de 3-4 pasos por vía en `guia.js`.
4. `dibujo.js`: con vía tóxica, atenuar colon/CVVH/TIPS/astrocito (o rotularlos riñón: oxalato, retina); separar rótulos de estaciones 1-2; aspa fuera de «cisteína»; metabolito tóxico que se acumula con glutatión <30 %.
5. `pagina.js`: `IMG_VIA` en el hueco de la Fig. 39.2, abierta.
6. `modelo.js` `recalc`: la NAC frena la caída desde su hora, no devuelve hepatocitos muertos; fomepizol/coadyuvantes/diálisis cambian la frase y el sello `phdial` en pausa con diálisis en marcha.
7. `b6b-higado.js`: `hig-eu-n` a 5 pasos con destapa; `hig-el-n` a 5-6 con evolución y giro (encefalopatía que empeora → trasplante, p. 8).
8. `herramientas/mayeutica-6l.mjs:102`: `d.guia || []`.
