# Encargo · b4 · Mayéutica de iones vivos (01/11/2026, director)

**Tipo**: estudio, pieza 2 de REGLAS §4.7 («Mayéutica de un modelo desde su maqueta»: sonnet 50 pasos / 1,2 M).
**Rama**: `auto/b4` (sale de `main` 1ddf264; la PR #65 ya entró). En paralelo trabajan eco, pulmón, b5 y b6a: **no toques**
`js/modules/eco/`, `js/modules/libros/pulmon-vivo/`, `js/modules/libros/ritmo-vivo/` (se importa, no se edita), nada del b5
(hepatocito, termostato) ni del b6a (cráneo, placa).

## Qué
La Mayéutica del motor común en el modelo **iones vivos** (`js/modules/libros/iones-vivos/`, datos `js/data/iones-vivos-data.js`):
modo **Explorar | Preguntas** como el corazón eléctrico. Copia el patrón de `js/modules/libros/ritmo-vivo/mayeutica.js` (56 líneas)
+ `js/data/ritmo-vivo-preguntas.js` sobre `js/core/mayeutica-motor.js` (`crearMayeuticaModelo`; **no edites el motor común**).
- Datos nuevos: `js/data/iones-vivos-preguntas.js` (≤700 líneas). Módulo nuevo: `js/modules/libros/iones-vivos/mayeutica.js`.
- Lo que ya hay en `pruebas.js` (APUESTA, ERROR, CASO) **se reutiliza**: pásalo al formato del motor común; nada duplicado.
  Si el modo viejo Apuesta/Error/Caso queda sustituido por Preguntas, se quita (un solo camino).
- **Guía socrática** (piensa antes / piensa y destapa / encuentra el error, 0-2 errores), en el orden del texto de las fichas
  16-23 de `js/modules/libros/marino-renal.html` (`mr-hipopotasemia` … `mr-fosforo`): una por idea importante que el modelo
  enseña (iceberg del K⁺ Fig. 36.2, insulina/β₂ mueven K⁺ dentro, Mg que impide subir el K⁺, ClK y su tope por cava,
  reposición de Mg y 50 % a la orina, Ca total vs iónico Fig. 38.1 con albúmina/pH/citrato, fosfato y realimentación).
  Cada pregunta pone su **estado del modelo** y tapa las cifras hasta contestar. **Examen nivel MIR**: 6-10 preguntas.
- **Casos** (2-3, cobertura-anexo §7, sin inventar otro paciente): **Adela** (hiperK con IECA + espironolactona: tubo hemolizado,
  gluconato, insulina, el calcio se disipa a los 45 min, HD), **Valentín** (transfusión masiva: Ca iónico 0,82, K⁺ 5,9) y, si
  el motor lo da, **Rufino** (K⁺ 2,8 que no sube por Mg 1,0 → MgSO₄). Cifras de los casos: **las del monitor de la app**
  (lee lo que pinta `pagina.js`/`leer(s)`), nunca calculadas aparte (REGLAS §4.14). Si el motor no puede dar un paso del caso,
  no lo tapes con el dibujo: para e informa.
- Toda explicación y distractor con su cita (`#page=` del PDF E = `docs/marino-2024-electrolitos-caps35-38.pdf`, página del PDF;
  usa `PAG_FICHA`/`FUENTES` del archivo de datos). Lo que el libro no dice: otra fuente citada o fuera.
- **Los 2 pelos sueltos** del parte `autonomo/partes/2026-10-30-b4-iones-app.md`: (1) tras «Hazlo: Dar 90 mg de calcio» el aviso
  hace crecer el dock 31 px y tapa la fila de botones (`guia.js`, rama `haz`: `verFrase` dos fotogramas después); (2) aviso de
  hiperK bajo el dock en una línea plegable (ahorra ~60 px a 360).

## Jueces y registro
- `autonomo/jueces-forma.mjs`: el modelo pasa a tener modo `mayeutica` (línea 85) y entrada en `MODELOS` con sus datos (línea ~46,
  como el corazón eléctrico). **En commit aparte; ningún umbral baja.**
- Prueba `autonomo/pruebas/iones-vivos.mjs`: amplíala para recorrer la Mayéutica (desborde tras cada respuesta y cada paso de
  caso, 390 y 360), copiando lo que hace `autonomo/pruebas/ritmo-vivo.mjs` (o la del capilar) con la Mayéutica.
- Antes de entregar: `node autonomo/jueces.mjs --modelo iones-vivos --forma` en verde, `node autonomo/version.mjs 20261101-<N>`
  (N mayor que el de `main`), y la lista de comprobación de `.claude/agents/constructor.md`. Commit en `auto/b4` (sin push).

## Lo que NO quiero
Preguntas que se aciertan sin mirar el modelo; redactar, huecos o emparejar; nombres internos a la vista; cifras sin página; un
paciente nuevo; tocar archivos de otras sesiones; más de 50 pasos (si llegas a 45, para y entrega lo hecho con lo que falta).

## «Hecho»
Mayéutica entera recorrible a 390 y 360 sin desborde; jueces `--modelo iones-vivos --forma` en verde; cada pregunta con estado y cita;
casos con cifras del monitor; los 2 pelos arreglados. Informe ≤40 líneas en `/tmp/plan-socialista/b4/constructor-mayeutica.md`
con la lista de frases nuevas (para el auditor) y «No comprobado / riesgo».

## Decisiones del director tras la revisión del encargo (`revision-encargo-iones-mayeutica.md`)
1. **Casos: Adela y Valentín**; **Rufino fuera** (el motor no acopla Mg→K: `leer` no lo hace; va como pieza de motor del grupo 4D).
2. **Valentín**: K⁺ **5,8** (lo que pinta el monitor), Ca iónico 0,82; preset tal cual.
3. **Adela**: preset `dK 230` (K 6,6). «Tubo hemolizado 6,9 → repetir: 6,6» y «hemodiálisis (1 mEq/L en 1 h)» van como **preguntas sin dibujo nuevo** (el estado del modelo es el de Adela; la respuesta, con su cita). «El calcio se disipa»: usa `avanzar` del motor tal cual (anula el efecto a los 30 min) y redacta «pasan 45 minutos» (≥30: ya disipado). **No toques `motor.js`.**
4. **Alcance, por prioridad**: guía socrática 7 preguntas (una por idea de la lista) → examen 6 → los 2 casos → los 2 pelos sueltos. Si no cabe, lo último se queda fuera y lo dices.
5. `cita`: expórtala de `pagina.js` (es de este modelo); no importes nada de `ritmo-vivo/`.
6. HTML: `#iov-modo-preguntas` y `#iov-preg`; tapar cifras con `taparTodo` para todos los iones (hoy `oculto` solo K y Ca).
7. El modo viejo (Apuesta/Error/Caso, `opciones()`, `modoPrueba`, `#iov-modo-apuesta/-error/-caso`, `#iov-prueba`) se migra a Preguntas y se borra; la prueba `iones-vivos.mjs` l.85-96 se reescribe para la Mayéutica (cada pregunta y cada paso de caso, 390 y 360), copiando `autonomo/pruebas/ritmo-vivo.mjs` l.165-242.
8. `jueces-topes.mjs:36` `noPulsar`: añade los botones nuevos de Preguntas (commit aparte con `jueces-forma.mjs`).
