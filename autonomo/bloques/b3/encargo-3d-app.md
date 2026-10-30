# b3d · El pulmón con respirador a la app (`b3-pulmon-app`) · paquete de encargos
Director, 30/10/2026. Rama `auto/b3d` (desde `main` ebadbda + `auto/mv-papel-pulmon`, PR #60, absorbida). Horquilla 12-18 M.
**Lee esto, no el proyecto entero.** Base: maqueta aprobada M3 `autonomo/maquetas/b3-pulmon/` (motor `pulmon.mjs`, pantalla
`comun/respirador.js`, escena, topes, pruebas: 49 comprobaciones) y el informe `autonomo/bloques/b3/papel-pulmon.md` (qué
mejora entra en cada encargo, con fuente, tope, juez y coste; manda sobre `cobertura-3d.md` donde choquen). Lo «si sobra»
del informe (Rohrer, autodisparo, asincronía de flujo, `fuga-pcv`), el índice de estrés y DOPE **no entran**.

## Fuentes (páginas = página del PDF)
M22 = `docs/marino-2024-respiratory-management-caps22-26.pdf` · M27 = `docs/marino-2024-…caps27-30.pdf` · LA1/LA2 = El Libro
Azul IV partes 1 y 2 (p. impresa = pdf + 384 / + 464). VentLoop, Antaa y Techartist: ideas, nunca cifra visible.

## Dónde vive (copiar el patrón del shock vivo, `js/modules/libros/shock-vivo/`)
- Carpeta `js/modules/libros/pulmon-vivo/` (archivos ≤700 líneas): `pulmon.mjs` (motor, sin DOM), `respirador.js` (pantalla),
  `escena.js`, `topes.js`, `pagina.js`, `index.js`, `pulmon-vivo.html`; datos en `js/data/pulmon-vivo-data.js` y
  `js/data/ventilacion-data.js` (PBW, cortes de Marino, una sola vez). Monitor: `js/core/monitor.js` ya exporta
  `canalesRespiratorios()`: se usa, no se copia.
- Registro: `pulmonVivo` en `MODELOS` y en las vistas de `js/modules/libros/index.js`, como `shockVivo`; enlace
  `data-pulmon-vivo="<estado>"` resuelto en `home/index.js` (lista de modelos vivos); vista en `index.html`.
- Prueba `autonomo/pruebas/pulmon-vivo.mjs` para `jueces --modelo pulmon-vivo` (los 10 pares de `papel-pulmon.md` §6 que
  toque cada encargo; mide desborde a 390 y 360 px tras cada estado) y su sello en `autonomo/jueces-topes.mjs`; además, su entrada en `autonomo/jueces-movil.mjs` (tabla de frases, como `shock-vivo`) y en `autonomo/jueces-forma.mjs` (E1a), y `pulmonVivo` en `MODELOS` de `js/core/mayeutica.js` (M). Rutas de M3: `../../../js/core/` → `../../core/`; `comun/muestra-mayeutica.js` NO se lleva (se usa `crearMayeuticaModelo`).
- Estados mínimos del modelo (los que usan las fichas, `cobertura-3d.md` §1): `normal-vcv`, `pcv`, `pausa-inspiratoria`,
  `psv-disparo`, `cpap-eap`, `broncoespasmo-auto-peep`, `auto-peep-corregida`, `sdra-rigido`, `sdra-protector`,
  `volutrauma`, `atelectrauma-zeep`, `mejor-peep`, `p-sili`, `vpp-corazon-normal`, `neumotorax-tension`, `sbt-ok`,
  `sbt-fracaso`. Los demás de la cobertura (prono, hfno, imv, fuga-cuff, estridor…) los añade `b3-pulmon-estudio` si su ficha los pide.

## Encargos (uno por constructor, en este orden; commit y push al acabar cada uno)
- **E1a · Modelo a la app** (sonnet, 90 pasos / 2,0 M): M3 a la carpeta de arriba tal cual está aprobada, con la lista R2 del
  profesor (`autonomo/bloques/b3/lista-pulmon.md`, la escribe el profesor antes de E1a) tachada; VCV/PCV, pausa, oclusión espiratoria; topes de M3 (§1.14); prueba con pares 1-3 y 10.
- **E1b · El ciclo** (sonnet, 60 / 1,2 M): cambio en la respiración siguiente; semilla fija; PSV con disparo (−2 a −3 cmH₂O,
  M27 pdf 8) y ciclado al 25 % del pico (M22 pdf 78); τ con fuente (LA2 pdf 50-51); árbol «pico sube: ¿y la meseta?»
  (M27 pdf 3-4); dos mandos oxigenar/ventilar; calculadora PBW, Cstat, ΔP sin objetivo en `ventilacion-data.js`. Pares 4 y 6.
- **E2 · Racimo con histéresis** (sonnet, 60 / 1,5 M): ≤4 unidades con apertura y cierre más baja (LA1 pdf 66-67; LA2 pdf
  86-87; M22 pdf 27); atelectrauma visible (M22 pdf 48); estados `atelectrauma-zeep` y `mejor-peep`. Idea: lámina 2 de
  `maquetas/mv-papel-pulmon/histeresis.mjs`. Par 5.
- **E3 · Motor: la CPAP sube el VS del corazón que falla** (sonnet, 60 / 1,2 M; **motor compartido**, CLAUDE.md §5): hoy el
  motor del corazón no lo da (nota «Límite del modelo» en `shock-vivo/pagina.js:391`). Objetivo con fuente: con PCP ≥12 la
  CPAP 5 sube el VS (Bradley 1992, PMID 1736745: +22 % del VS indexado); con PCP <12 baja (IC 3,14 → 2,89); en el normal,
  15 cmH₂O bajan el VS ≈23 % (Jellinek 2000; hoy −24 %, no romperlo); Marino M22 pdf 83-88. Antes de tocar, ≤10 pasos para
  medir con un programa corto qué da hoy el motor y por qué (Ec. 26.1 ya está). Hoy ninguna prueba de la eco mide `pTorax`: **escribe `js/modules/eco/pruebas/torax.test.mjs`** (normal, 15 cmH₂O → VS −23 ± 5 %; PCP ≥12 con CPAP 5 → VS sube; PCP <12 → baja; `pTorax` 0 → cifras idénticas a hoy) y comprueba que la PaO₂ de `shock-vivo/soporte.mjs:323` no cambia sin querer. Pasa `node --test 'js/modules/eco/pruebas/*.test.mjs'`
  y `jueces --modelo shock-vivo`; API antigua intacta; actualiza la nota del shock vivo. La entrada `pTorax` ya existe y el shock vivo ya la usa (`soporte.mjs:285`); después, el pulmón le escribe la suya
  (P media de la vía aérea) al motor: estados `cpap-eap` y `vpp-corazon-normal`; PEEP 4 → 20 baja el GC (M27 pdf 12). Par 7.
- **E4a · El paciente que respira** (sonnet, 60 / 1,2 M): Pmus en la ecuación (LA2 pdf 47), 0-15 ilustrativo, sello P-SILI
  con Vt ≥9,5 mL/kg PBW (M22 pdf 40-42); esfuerzo ineficaz, doble disparo y disparo inverso (LA2 pdf 93-95, rotulado «en
  investigación» el inverso); `sbt-ok`/`sbt-fracaso` (f/Vt >105, M27 pdf 52). Par 8. Idea: `mv-papel-pulmon/asincronias.mjs`.
- **E4b · Neumotórax a tensión** (sonnet, 40 / 0,9 M): escena aparte sobre el M8 del E3 (sin corazón propio); presión que
  crece cada ciclo (ilustrativo); PA y SpO₂ caen; solo se desbloquea la descompresión, aguja 14 G de 8 cm en el 5.º EIC por
  delante de la línea axilar media (M27 pdf 27-29, Fig. 28.7 real). Par 9. «Pico y meseta suben juntos»: deducción rotulada.
- **L · Lámina de entrada** (sonnet, 60 / 1,8 M): 3 niveles (tórax → alvéolo → membrana y capilar), 2D, con la Fig. 24.1
  real; Vt 500 = 150 + 350 (LA1 pdf 5), membrana ~0,6 µm y 50-100 m² con la errata «de diámetro» en nota (LA1 pdf 6).
  Copia `maquetas/mv-papel-pulmon/pagina.js` (lámina 1). Antes de las curvas, plegable.
- **M · Mayéutica del modelo** (sonnet, 50 / 1,2 M): sobre `js/core/mayeutica-motor.js` (`crearMayeuticaModelo`, como
  `shock-vivo/mayeutica-shock.js`), casos de `papel-pulmon.md` (Isidro, Eulalia, Herminia, Rafael, Elvira), formato C con el
  error de B como paso del caso; citas también en distractores (§1.11). `pulmonVivo` en `MODELOS` de `core/mayeutica.js`.

## Topes de la CPAP y de la PEEP (no son el mismo)
CPAP en VNI: «usualmente 5-10» (M22 pdf 77); el shock vivo tiene tope 10 (`shock-vivo/topes.js`) y se queda así. PEEP en VM: 5-10 evita el colapso y 10-20 abre lo colapsado (M27 pdf 10): tope 20 en el pulmón. El estado `cpap-eap` usa la CPAP (tope 10, como el shock); los de VM, la PEEP.

## «Hecho»
Jueces enteros en verde (`--modelo pulmon-vivo`, `--modelo shock-vivo`, `--forma`, pruebas de la eco); auditor sin graves;
profesor ≥8,75 (meta 9,5: modelo vivo nuevo); a 390 y 360 px sin desborde; cada cifra con origen visible; versión nueva.

## Lo que NO quiero
Cifras de VentLoop/Antaa/Techartist visibles; 64 unidades; tabla FiO₂/PEEP; 3D real; texto en muro sobre la pantalla;
el motor del corazón copiado dentro del pulmón (se usa `eco/motor.mjs`); una curva tapando una cifra mala del motor.

## Cambios de Educación a la maqueta en papel (`juicio-papel-pulmon.md`: 7,8 · 8,9 · 8,4, «entra con cambios»)
- E4a: el doble disparo se ve como **dos picos con valle corto**, no una insuflación de 800 mL (LA2 Fig. 27).
- E2: con PEEP 20 la Cstat **baja** cuando todo está sobredistendido (la cola se aplana); el sello no tapa el rótulo «PEEP».
- E2 y L: **apuesta antes de la guía** (REGLAS §8): 3 opciones («PEEP 5 → 12: ¿qué le pasa al alvéolo que se cerraba?»;
  «Vt 300 a FR 30: ¿cuánto llega al alvéolo?» como «piensa antes»). L: sin animación en bucle; rótulo del diafragma separado.
- Todas: la nota de topes del dock, plegable (el dock no pasa del ~30 % de la pantalla).

## E3, partido (30/10, tras el informe del constructor; `herramientas/e3-cpap.mjs`)
Hoy el motor da, con CPAP 5: normal −7 % de VS, Ramiro (PCP 19-31) −0,8 a −2,4 %, seco (PCP 8) −10 %. Es decir, el
corazón que falla **casi no pierde** (Fig. 26.6 frente a 26.7, M22 pdf 85-86), pero **no sube** (Bradley: +22 %). Subirlo
exige más sensibilidad a la poscarga del VI que falla en `motor.mjs`, y eso mueve todos los estados de shock ya aprobados.
- **E3-enganche** (sonnet, 40 / 0,8 M, sin tocar el motor): el pulmón escribe `pTorax`; estados `cpap-eap` (Ramiro) y
  `vpp-corazon-normal` enseñan el contraste «el normal pierde, el que falla casi no», y PEEP 4 → 20 baja el GC; la nota
  «Límite del modelo» del shock vivo se copia tal cual.
- **E3-motor**: espera la decisión del usuario (cambio grande en un motor compartido; CLAUDE.md §1). La prueba
  `eco/pruebas/torax.test.mjs` ya lo deja escrito como `todo`.
