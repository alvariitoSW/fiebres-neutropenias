# 2026-10-27 · jueces-topes

**Resultado:** hecha, directo a `main` (tipo `arreglo`, técnico; sin PR)
**Vueltas:** 1 · **Jueces:** pruebas ✓ (`jueces.mjs` a secas en verde; trampa 6/6) · topes ✓ (el juez nuevo) · auditoría — (no aplica)

## Qué se hizo
Juez nuevo `autonomo/jueces-topes.mjs` (REGLAS §1.14), con los rangos de paciente posible en
`autonomo/jueces-topes-rangos.mjs` («fisiología general», amplios a propósito). Corre con `--modelo` y `--forma`, a
390 px: lleva cada deslizador a mín y máx, cada desplegable a la primera y la última opción, marca las casillas y pulsa
cada botón 15 veces. Falla si sale NaN/undefined/Infinity, una cifra fuera de lo humano, un error de consola,
desborde, o un botón que acumula y llega a su tope sin apagarse, sin sello y sin cambiar la frase viva.
Prueba trampa `autonomo/pruebas/jueces-topes-trampa.mjs` (6 trampas, todas cazadas). `jueces.mjs` a secas no cambia.
Encargo rellenado por el director (no había ficha): copiado en la sección de abajo.

## Qué no se pudo hacer o leer
Solo a 390 px y desde el estado inicial de cada modelo (no recorre casos ni combinaciones). Los filtros contra falsas
alarmas (cifras de botones, pH gástrico, Δ, ecuaciones) son por texto y podrían esconder alguna cifra imposible.

## Para el usuario
Un hallazgo real en lo ya construido (no arreglado, fuera de la tarea):
- **Ácido-base vivo**: tras llevar albúmina y osmolalidad a sus extremos, la PaCO₂ a 90 da **pH 6,36** (con PaCO₂ 90
  desde el inicio sale 7,05). Hay que ver qué combinación lo produce → propuesta de tarea `topes-acidobase` (sonnet).
Los otros 7 modelos (río y mar, capilar, catéter, muralla, telar, inmersión, vaso) salen ✅ en topes.

## Visto de paso (no tocado)
Nada nuevo; los ❌ del juez del móvil siguen (propuesta `movil-existente`).

## Propuestas sobre las reglas
- Cuando un bloque cree un modelo vivo con sello propio, que añada su selector a la tabla de ajustes de
  `jueces-topes.mjs` en vez de un arnés suelto en `herramientas/`.

## Vueltas
| Pieza | Vuelta | Nota profesor | Modelo | Pasos | Tokens eq. | Qué falló |
|---|---|---|---|---|---|---|
| jueces-topes.mjs | 1 | — (técnica) | sonnet | 44 | 756 k | nada; filtró falsas alarmas propias |

## Gasto
Total 795 k equivalentes (presupuesto del constructor 45 pasos / 0,55 M: gastó 44 / 756 k, un 137 % en tokens).

| Papel · modelo | Lanzados | Equivalente | % |
|---|---|---|---|
| constructor · sonnet | 1 | 756 k | 95 % |
| director · opus | 1 | 39 k | 5 % |

Se pasó en tokens por recorrer los 8 modelos con la máquina cargada (30 min, reintentos al abrir). Se ahorraría
calibrando con 2 modelos y pasando el resto una sola vez. Presupuesto para «constructor de un juez» · sonnet: se
mantiene 45 pasos / 0,6 M (90 % de lo medido sería 0,68 M; no se sube del 0,6 M para empujar a ahorrar).

## Encargo (rellenado por el director)

Qué: juez automático de topes (REGLAS §1.14). `node autonomo/jueces.mjs --modelo <clave>` (y `--forma`, que pasa
todos) debe, a 390 px, en cada modelo vivo que ya está en `main` (agua-viva, capilar-vivo, cateter-vivo,
muralla-viva, telar-vivo, inmersion-viva, vaso-vivo, acidobase-vivo, y los que encuentres en `modelosVivos`):
1. Llevar cada mando a sus extremos: `<input type=range>` a min y max (con input+change), `<select>` a la primera y
   la última opción, y pulsar cada botón de acción (suero, dosis, bolo…) repetidas veces (p. ej. 15) hasta que se
   desactive o deje de cambiar algo.
2. Tras cada tope, fallar si: aparece NaN/undefined/Infinity en el texto visible del modelo; hay errores de consola;
   desborde lateral > 0; una constante visible sale de lo humanamente posible (lista de rangos de paciente posible
   por cifra con rótulo reconocible: PAS 0-300, PAD 0-200, PAM 0-250, FC 0-300, SpO₂ 0-100, pH 6,5-8,0, pCO₂ 5-200,
   HCO₃ 1-60, Na 90-200, K 1-12, PVC -5-40, lactato 0-30, diuresis ≥0, volúmenes no negativos…; pon la tabla en un
   archivo de datos del juez y cita en comentario que es «fisiología general», el umbral es amplio a propósito);
   o una acción repetida (botón) llega a su tope y no hay **consecuencia visible**: ni se desactiva el botón, ni sale
   un sello/aviso, ni cambia la frase viva. Eso último es el «sin sello» de §1.14.
3. Informe por mando: qué tocó, valor, y ✅/❌ con el motivo. Sale con código 1 si hay ❌.

Cómo:
- Copia la idea (no el archivo) de `/tmp/plan-socialista/jueces-topes/limites-prueba.mjs` (arnés de las maquetas
  de b3; aquí los modelos van dentro de la app, no en maquetas). Lo genérico (descubrir mandos dentro del contenedor
  del modelo, leer cifras visibles) va en un archivo nuevo `autonomo/jueces-topes.mjs` (≤ 300 líneas), enganchado
  en `autonomo/jueces.mjs` igual que `autonomo/jueces-movil.mjs` (mira cómo lo engancha: `juzgarMovil`). Si algún
  modelo necesita un ajuste propio (selector de su contenedor, botones a no pulsar como «Reiniciar»), una tabla
  pequeña en el mismo archivo, no un listener ni cambios en el modelo.
- Cómo llegar a cada modelo: reutiliza lo que ya hacen `autonomo/pruebas/<clave>.mjs` / `jueces-movil.mjs` para
  abrirlo (no inventes otra navegación).
- Prueba trampa `autonomo/pruebas/jueces-topes-trampa.mjs` como `jueces-movil-trampa.mjs`: estropea a propósito un
  modelo en memoria (p. ej. inyecta NaN o quita el disabled de un botón con tope) y comprueba que el juez lo caza.
- `node autonomo/jueces.mjs` a secas no cambia (sigue rápido). No toques los modelos: los ❌ reales que salgan en lo
  ya construido se listan en tu informe (no se arreglan en esta tarea). Los ❌ previos de `jueces-movil` no son tuyos.
- Calibra con 2 modelos (agua-viva y capilar-vivo) y pasa el resto una sola vez al final. Nada de `--forma` entero
  mientras calibras. Servidor: `PUERTO=` libre, sin `pkill` amplios ni `git stash` (REGLAS §4.6).
- Depura falsas alarmas: un rango que dice «PA 0» en una parada real con sello es correcto, no un fallo.

Hecho: el juez existe, la trampa lo demuestra (todas las trampas cazadas), `node autonomo/jueces.mjs` a secas en
verde, y un informe ≤ 40 líneas en `/tmp/plan-socialista/jueces-topes/informe.md` con: qué hace, la tabla de ❌ reales
por modelo (mando, valor, motivo), falsas alarmas descartadas y «No comprobado / riesgo». Comentarios en español.
No hagas commit.

Presupuesto: 45 pasos / 0,55 M tokens. Al llegar, para y entrega lo hecho con la lista de lo que falta.
