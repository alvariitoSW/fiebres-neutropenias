# Bloque 1 · Marino caps. 1-11 (Fundamentos) · paquete

Objetivo M5 del tablero, aprobado por el usuario el 19/10/2026. Prioridad única: no se empieza el bloque 2 hasta
que este esté aprobado.

## 1. Fichas (23), en Libros → Marino → Fundamentos

Viven en `js/modules/libros/marino-fundamentos.html`. Clave para los jueces:
`--ficha libros:marinoFundamentos:panel-marino-fund-tabs:<id>`.

| Grupo | Fichas (`id`) | Modelo vivo previsto |
|---|---|---|
| Fluidos (caps. 10-11) | `mar-cristaloides`, `mar-coloides` | **Río y mar** (`js/modules/libros/agua-viva*`, existe) |
| Hemodinámica (caps. 7-9, 11) | `mar-retorno-venoso`, `mar-respuesta-fluidos`, `mar-cateter-ap`, `mar-termodilucion` | **Circulación viva** (corazón, motor del latido y eco: `js/modules/eco/`, existe; hay que conectarlo) |
| Oxígeno (caps. 8-9) | `mar-oximetria`, `mar-capnografia`, `mar-transporte-o2`, `mar-extraccion-lactato` | **Capilar y oxígeno** (nuevo; mapa §4.2, `autonomo/ideas/marino.md`) |
| Accesos vasculares (caps. 1-3) | `mar-cateteres-flujo`, `mar-tipos-cateter`, `mar-eco-intraosea`, `mar-cvc-sitios`, `mar-cvc-complicaciones`, `mar-cateter-cuidados`, `mar-bacteriemia-cateter`, `mar-microbioma` | **Catéter vivo** (nuevo: flujo de Poiseuille con la Fig. 1.1, biopelícula y vías de colonización, Figs. 3.2-3.3) |
| Sin modelo claro (caps. 4-6) | `mar-ulcera-estres`, `mar-tromboprofilaxis-farmacos`, `mar-tromboprofilaxis-escenarios`, `mar-analgesia`, `mar-sedacion` | Mayéutica y casos; lo demás a «Para profundizar» (la escalera RASS ya existe) |

## 2. Fuentes (`docs/`)

- `marino-2024-acceso-vascular-practicas-caps1-4.pdf`
- `marino-2024-practicas-monitorizacion-caps5-9.pdf`
- `marino-2024-fluidoterapia-caps10-11.pdf`

Cada ficha ya cita su página con `#page=N`: úsala. Las fichas están revisadas y auditadas (R1-R2, PR #3 y #4).

## 3. Modelos vivos que ya existen

- **Río y mar** (`data-agua-viva="<estado>"`): estados `salino`, `glucosado`, `ringer`, `albumina25`, `hipertonico`,
  `hemorragia`, `hiponatremia`, `hipernatremia`, `salino3`, `hiperglucemia`, `inicio`.
- **Ácido-base vivo** (`data-acidobase-vivo="<estado>"`): no es de este bloque, pero el salino enlaza con él.
- **Circulación viva y eco**: `data-eco-vista/escenario/medir` (ver `js/modules/eco/CLAUDE.md`).
- **Formas de partícula**: `js/core/particulas.js` + `js/data/formas-iones.js` (tabla única; no dibujar formas propias).
- Cómo es un modelo vivo con Mayéutica en la app: `js/modules/libros/agua-viva.js` y su prueba
  `autonomo/pruebas/agua-viva.mjs`. **Es el modelo a copiar** (estructura, Mayéutica, casos, VOLVER a la ficha).

## 4. Decisiones del usuario (19/10/2026)

- «Lo del modelo de ácido-base y de la mayéutica ahora mismo es la clave de esta aplicación»: pasar de texto teórico
  a modelos vivos con su Mayéutica, «de todo el libro».
- «Si yo me meto desde la primera ficha, ¿qué modelo vivo me va a explicar la teoría de esa ficha?»: cada ficha con
  su modelo en su estado.
- Mayéutica socrática (la de Platón): Guía socrática + Examen difícil, nivel MIR u oposición (REGLAS §8).
- Lo que no se explique (objetivo, cubrir ≈85 %) va a «Para profundizar»: pestaña plegable con esa información y
  enlace directo.
- Maquetas de los modelos nuevos: sí, después del mapa de cobertura.

## 5. Pasos

| Paso | Quién | Sale en | Estado |
|---|---|---|---|
| 1 · Cobertura | profesor (modo cobertura) | `autonomo/bloques/b1/cobertura.md` | pendiente |
| 2 · Maquetas | constructor potente ×2 en paralelo | `autonomo/maquetas/b1-*.html` | pendiente |
| 3 · Modelos en la app | constructor potente | rama `auto/b1-modelos` | pendiente |
| 4 · Estudio en las 23 fichas | constructor barato, por grupos | rama `auto/b1-estudio` | pendiente |
| 5 · Jueces, auditor y profesor | — | `autonomo/bloques/b1/*.md` | pendiente |
