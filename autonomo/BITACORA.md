# Bitácora

La lleva la skill `/bitacora` (`.claude/skills/bitacora/SKILL.md`). Aquí está **lo que se quiere hacer y aún no está
aprobado**, lo que espera algo del usuario y lo hecho en la última semana. Lo aprobado vive en `TABLERO.md`, que es
lo único que trabaja el plan socialista. Lo hecho hace más de 7 días y lo descartado pasan a
`docs/historial/bitacora.md`.

Última sincronización: 2026-10-14.

---

## 1. Apuntado: espera tu visto bueno

*(Nada todavía. Cuéntale a `/bitacora` lo que haya que hacer y aparecerá aquí con su número.)*

<!-- Formato de cada entrada:
### B-00N · Título corto · apuntado AAAA-MM-DD
- **Lo que dijiste**: «…»
- **Cómo lo entiendo** (encargo): tipo · qué quiero · para qué · modelo «así sí» · lo visual que espero · modelo
  grande · preguntas que espero · lo que NO quiero · fuente. Lo supuesto, marcado «(supongo)».
- **Depende de**: …
- **Tamaño**: pequeña | mediana | grande (trozos: …)
- **Dudas**: …
-->

## 2. En marcha (ya en el tablero)

| Clave | Qué | Estado | Desde | Nota |
|---|---|---|---|---|
| `preguntas` | Botón «Preguntas» y los formatos de la maqueta, empezando por la ficha de HIT | pendiente | 2026-10-14 | Entró al tablero al escribir las reglas, antes de existir la bitácora: **confírmala** o dime que espere. |
| `mr` | Atlas, cap. 18 Insuficiencia mitral, rehecho con su encargo | pendiente | 2026-10-14 | El piloto (PR #2, borrador) se rechazó; su texto sirve de base. |
| Atlas | 20 capítulos más (Objetivo 1 del tablero) | pendiente | 2026-10-14 | 9 de 30 hechos. |

## 3. Esperando algo tuyo

- **PR #2 (piloto del cap. 18)**: decidir si se cierra o se deja abierta como base del texto para rehacer `mr`.
- **¿Lanzar ya `preguntas`?** (ver «En marcha»).
- **Simulador de arritmias (idea de RitmoLab)**: los PDF de los algoritmos **AHA 2025** (bradicardia, taquicardia,
  parada y la guía completa); heart.org está bloqueado desde el entorno. Decidido: puerta propia en la raíz
  («Arritmias»), enlazada desde Cardiología del PIF. Fases: 1) monitor, 17 ritmos y modo Estudio; 2) casos; 3) 12
  derivaciones. Antes de construir, maqueta para elegir. Detalle en `docs/historial/cardiologia.md`.
- **El Libro Azul**: los PDF de las secciones que faltan (hay I, II, III y VII). Orden que pediste: Marino (hecho),
  después El Libro Azul y después el PIF de R1.
- **PIF de R1**: los PDF de las 7 rotaciones sin contenido (Radiología de tórax, Neurorradiología, Cardiología,
  Medicina Interna, Infecciosas, Neurología, Neumología).
- **TRR**: el PDF de Valdenebro 2021, para cotejar las 7 dudas anotadas en `docs/historial/nefrologia.md`.
- **Panel de subida**: la clave de la API y desplegar el Worker (`backend/README.md`).
- **Velocidad del plan socialista**: hay propuestas (dos constructores a la vez, pruebas largas al final, los jueces a
  la vez desde la 1.ª vuelta; de ~2 h 45 a ~1-1 h 15 por capítulo). Tu decisión del 14/10: **todavía no**.
- **Rutina nocturna** (que el plan trabaje solo de madrugada, ~3:00 de Canarias, con aviso al móvil): **no montarla
  aún**; cuando se monte, hace falta que fijes un límite de gasto.

## 4. Mejoras de lo que ya existe

- **Reconvertir las preguntas viejas** al formato de estudio (`REGLAS.md` §8): hay **361 de redactar** entre ~2.600
  preguntas. **Cuando lo pidas** (lo dijiste el 14/10), por bloques, con tareas `estudio`.
- **Prueba intermitente del simulador de eco**: `navegador.test.mjs`, «la barra del ciclo tiene las 7 fases», falla
  a veces con el ordenador cargado. Endurecerla.
- **Eco cardíaca fuera del atlas**: calibrar la RVS, medir los fps en el móvil, más formas de enfermedad
  (`js/modules/eco/README.md`, «Pendiente»).

## 5. 💡 Lo que yo propondría (no lo has pedido tú)

- **Piloto de `estudio` en Merino HEMATO** cuando esté `preguntas`: el profesor diseña la parte de estudio de sus 6
  fichas (recorrido, casos y su visual). Por qué: es el cuaderno de la maqueta y el modelo de fichas de la app, así
  que sale el patrón para el resto.
- **Inventario de estudio**: una tabla de qué fichas tienen vista Visual, cuáles tienen un modelo grande que las
  explique y cuáles tienen solo preguntas viejas. Por qué: sirve para ordenar las tareas `estudio` por lo que más
  ayuda. Es una tarea pequeña de solo lectura.

## 6. Hecho (últimos 7 días)

- 2026-10-14 · **Preguntas para estudiar**: maqueta aprobada, reglas (`REGLAS.md` §8) y el profesor que diseña y
  juzga.
- 2026-10-14 · **Plan socialista revisado** tras el piloto: rúbrica «sirve para estudiar», encargos y tipos de tarea.
- 2026-10-14 · **Plan socialista montado**: skill, agentes, jueces automáticos, regla «paciente posible» y enlace
  «Ver en el móvil».
- 2026-10-14 · **Receptores adrenérgicos animados** en Merino Cardiología (Motion).
- 2026-10-14 · **Atlas cap. 14** (ventrículo derecho) y huecos del Manual UMI.
- 2026-10-13 · **Atlas caps. 08, 09 y 10** sobre el motor; el atlas en español dentro de Eco cardíaca.
- 2026-10-13 · **Marino completo** en Libros (caps. 1-11, 31-53 y apéndices) con sus revisiones.
- 2026-10-13 · **Manual UMI**: bloque neurocrítico y meningitis.
