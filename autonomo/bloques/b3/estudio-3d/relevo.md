# Relevo del director · `b3-pulmon-estudio` · sesión 1 → sesión 2 (01/11)

REGLAS §4.16: director en dos sesiones por parada (≤150 pasos). La sesión 1 cerró aquí; todo está en `auto/b3d-estudio`.

## Hecho (sesión 1)
- Paquete, revisión, presupuesto (≈38,4 M), fase A ligera (0 graves), planes del profesor G1-G2 y G3-G5.
- **G1** (12, 13, 16): Estudiar + recetas + auditor + juicio + arreglos + rejuicio → ≥8,75 en todo.
- **G2** (3, 1, 2, 10, 11): Estudiar + recetas + 2 auditores + juicio; vuelta de arreglos A2 juntada (ver abajo si falta).
- Estados nuevos: `disparo-inverso` y recuperación gradual (P2), `hfno` (Pmus 14 → 12: el alto flujo baja la FR,
  no el Vt), `prono`, `fuga-cuff` (S3, con Benito). Juez `--modelo pulmon-vivo` en verde tras P2 + hfno.
- Gasto a la mitad: ≈19,9 M (`gasto.mjs --clave b3-pulmon-estudio`). Estudiar ≈1,0-1,25 M por ficha (presupuesto 0,7).

## Falta (sesión 2), en este orden
1. **Rejuicio R8 de G2** (profesor fable, 13 pasos) sobre `profesor-g2.md` tras A2. Si la ficha 10 sigue <8, es por el punto 2.
2. **Arreglar `cpap-eap` en el modelo** (constructor sonnet, 1,2 M): Herminia sale con VTe 0, VMe 0, I:E 1:67 (16 resp/min
   sin volumen; `resp.ps: 0` en `js/data/pulmon-vivo-data.js` y el mando `ps` con mínimo 5 en `pagina.js` ≈l. 248).
   Que respire con su Pmus (CPAP = presión constante, Vt del paciente). Barrido de extremos; `--modelo pulmon-vivo` y
   `--modelo shock-vivo`. Después devolver a `cpap-eap` los «Compruébalo» que A2 movió (vni-g2, vni-c2, vnu-g7, vnu-c2).
3. Estado `sbt-ansiedad` (plan-g3g5.md línea 115; Benito ya está en el modelo), 1,2 M.
4. **G3** (4, 6, 5), **G4** (7, 8, 9), **G5** (14, 15, 20, 21 · 17, 18, 19): por grupo, Estudiar (encargos de 2 fichas,
   **tope 50 pasos**; cada encargo trae su receta Visual, sin la cual el botón Estudiar no sale; archivos de datos
   nuevos registrados antes en `b3.js`, como `b3d-*.js`), auditor sonnet, profesor juicio, una vuelta de arreglos y
   rejuicio R8. Lecciones de G1-G2 en el encargo de cada constructor: la buena nunca la más larga; nada repetido
   entre guía, examen y caso; sin distractores absolutos; «error» del caso nunca respaldado por la fuente; nodos por
   id; colores del kit (verde, amarillo, rojo, purpura, dorado, gris); sin `LAMINAS` sin `<img>`; cifras del monitor.
5. P1 (dibujo del corazón y del neumotórax): **propuesto pasarlo a `b3-cierre`** si el gasto aprieta.
6. Suite de jueces (cada juez largo por separado), versión, PR en borrador, Consejo y cierre.

## Cuentas y aviso
Proyección ≈46 M (+20 % sobre 38,4): pasa el techo del `b3d` (70 M; gastados 26,3 en `b3-pulmon-app`) en ≈2 M.
Medir con `gasto.mjs` tras G3; si la proyección sigue pasando el techo, comparecer ante el Consejo (REGLAS §4.17)
antes de pasarlo.

## Visto de paso (al parte)
- Motor del corazón no monótono por encima de 13,5 cmH₂O de aire pleural (PAM 19,7 a 20; 34 a 40): arreglo del motor aparte.
- `mejor-peep`: la presión de conducción mínima sale con PEEP 10, no 12 (Fig. 27.5): el caso usa la ficha y lo avisa.
- Cobertura §5 da PBW 50 a Eulalia; el modelo, 54,2 (fórmula). Juez `--forma` tarda ≈10 min: redirigir a archivo.

## Tras A2 (fin de la sesión 1)
- A2 juntado: 5 graves ✅; profesor 1, 3-7 ✅; **8 ❌** (figura de la PSV en la Mira de la ficha 10, con enlace a
  `psv-disparo`) y el barajado de la ficha 2 sin tocar: van al rejuicio.
- `as1-e3` dice «MDI sin espaciador ≈32 µg (9 %)»: cuenta del constructor (9 % de la Tabla 23.1 sobre 0,36 mg). Quitar o
  rotular «ilustrativo: cuenta proporcional» con la tabla y la página.
- Ficha 10: «mask design» (p. 76) queda como «mejoras en las mascarillas» (el juez de nombres internos marca «diseño»
  en el texto; no se toca el juez). Un fallo «Navegador: page closed» salió en la pasada de A2 al final del barrido
  móvil: repetir `--ficha …neumo-vni-metodos` sola y ver si se reproduce.
