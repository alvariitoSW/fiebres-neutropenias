# Encargo · [b4-iones-app] iones vivos a la app (modelo con la mirada B + prueba)

Rama `auto/b4` (no `main`). Primer encargo de REGLAS §4.7: el modelo y su prueba. Sonnet, **90 pasos / 2,0 M**.
La Mayéutica, las miradas C («A pie de cama») y A («La célula por dentro») y los grupos de Estudiar van en sesiones aparte.

## Qué se lleva
La maqueta B aprobada (9,4): `autonomo/maquetas/b4-iones-b.html` + `autonomo/maquetas/b4-iones-b/` (datos, dibujo,
ecg, estilo, guia, modelo, pagina, pruebas; 645 líneas) y su programa `autonomo/bloques/b4/herramientas/iones-b.mjs`.
Lista R2 del profesor: `autonomo/bloques/b4/lista-r2-iones.md` (el constructor la tacha en su entrega).

## Dónde va (patrón: el corazón eléctrico, `js/modules/libros/ritmo-vivo/`)
- `js/modules/libros/iones-vivos/` (index.js, motor.js, pagina.js, dibujo.js, guia.js, iones-vivos.html…; ≤700 líneas cada uno).
  El motor nace con `avanzar(s, min)`, `vitales(s)` y flujos `kShift/pShift/mgShift` (dictamen de Educación §3.1) para
  que C y A sean pintores, no motores.
- Datos y fuentes en lista: `js/data/iones-vivos-data.js`.
- Registro: vista `#iones-vivos-view` en `index.html`, `modelosVivos.ionesVivos` en `js/modules/libros/index.js`,
  enlace `data-iones-vivos="<estado>"` (como `data-ritmo-vivo`; ver `home/index.js`), «← VOLVER» a la ficha de origen
  (`core/volver-ficha.js`). Entrada desde las fichas 16-23 de `js/modules/libros/marino-renal.html` (al menos un botón
  en cada ficha de iones: hipoK/hiperK, Mg, Ca, P).
- ECG: el del ritmo vivo, **importado** (`MOTOR` de `ritmo-vivo/motor.js`, `aplicarK` de `js/data/ritmo-vivo-data.js`).
  **No se edita nada de `js/modules/libros/ritmo-vivo/` ni del pulmón** (b3d va en paralelo).
- Topes: `js/core/tope.js`; frase viva: `js/core/frase-vista.js`; partículas: `js/core/particulas.js` + `js/data/formas-iones.js`.
- Ajuste de sello propio, si hace falta: `autonomo/jueces-topes.mjs`. Selector de frase viva: `autonomo/jueces-movil.mjs`.
  Clave de forma: `autonomo/jueces-forma.mjs` (como `ritmo-vivo`).
- Prueba: `autonomo/pruebas/iones-vivos.mjs` para `node autonomo/jueces.mjs --modelo iones-vivos` (patrón
  `autonomo/pruebas/ritmo-vivo.mjs`): desborde tras cada mando y paso de guía a 390 y 360, cifras de cada mando en
  mín/medio/máx, cada tope dispara su sello, apuesta/error/guía completos, consola limpia.
- Versión: `node autonomo/version.mjs 20261030-N` (N libre siguiente al de `index.html`).

## Los 4 pendientes del parte (se resuelven aquí)
1. Dock `pagina.js`: plegar ClK/Mg/Ca tras «Más mandos» o dock ≤240 px; paso de guía y foco a la vez a 390.
2. «Pendiente…» del ECG (hipoK, Mg, Ca) a un plegable bajo el ECG, no dentro del monitor.
3. `CRECIMIENTO[3]` (ECG de hipoK): destino ritmo vivo (`data-especialidad="libros" data-view="ritmoVivo"`), no `eco`.
4. Con sello «no fisiológica» el monitor pinta «<1,5» (o el límite), no la cifra imposible.

## Hecho
`jueces.mjs` en verde + `--modelo iones-vivos` + `--ficha` en 2 fichas de iones (hipoK y Mg) + `--forma`; lista R2
tachada entera; cifras idénticas a las de la maqueta (salida de `iones-b.mjs` vuelta 3: K 4·4,18·4,36; Mg 2,97/4,48/6;
Ca 90/180/270; Valentín 3,26→4,16; Adela 6,6→ECG 5,5; caso 5,83→5,94); cada dosis con la indicación de la página de la
que sale (propuesta del parte: el calcio de la hiperK es 90 mg, E p. 27). Profesor juzgar ≥8,75 (meta 9,5).

## Lo que NO quiero
Un segundo motor; editar ritmo-vivo o pulmón; ECG de hipoK inventado; nombres internos a la vista; cifras sin página;
listeners nuevos por módulo (el enlace cruzado es el delegado de `home/index.js`).
