# Hipertrofia del VI · qué enseña (profesor, 28/10/2026)
**Elección: (c), un mando de grado 1 a grado 2.** La HVI por HTA es la causa típica de relajación lenta: el R1 debe reconocer primero el grado 1 (E/A invertido con E/e′ normal). Con el mando aprende la lección que más confunde: al subir la PAI, E/A **vuelve a parecer normal** (seudonormal), y solo e′ baja y E/e′ alto lo delatan (Nagueh 2025 p.554). El atlas 10 ya enseña los 4 grados con la Figura 3 (`cap-diastolica.html` l.7-8, 22-24; `clasificar()` de `atlas/diastolica.mjs` l.112-119); la forma no lo contradice si cada punto cae en la rama que le toca. Hoy la forma es **fija** (sin `gravedad` en `escenarios.mjs` l.78-83): hay que darle una, como TEP o HP crónica. Ninguna banda llega a grado 3 (E/A ≥2, Nagueh p.554); eso lo enseña la dilatada.

| Punto del mando | E/A | e′ septal / lateral (medio) | E/e′ medio | IT / PAPs | PAI (PCP) | Rama de la Fig. 3 |
|---|---|---|---|---|---|---|
| 0 % · grado 1 leve | ≤0,8 (cerca de 0,8) | ≤6 / ≤7 cm/s (medio ≤6,5) | <14 (septal <15, lateral <13) | IT <2,8 m/s y PAPs <35 | normal | «solo e′ reducida» + E/A ≤0,8 → grado 1 |
| defecto · grado 1 franco | ≤0,8 (claramente invertido) | ≤6 / ≤7 (medio ≤6,5) | <14 | IT <2,8 y PAPs <35 | normal | grado 1 |
| 100 % · grado 2 | >0,8 y <2 | ≤6 / ≤7 (medio ≤6,5) | ≥14 (septal ≥15 o lateral ≥13) | IT ≥2,8 o PAPs ≥35 | elevada leve-moderada (PCP >15) | 3 de 3 anómalas → PAI elevada, E/A <2 → grado 2 |

Fuentes de la tabla: cortes de e′, E/e′, IT/PAPs y E/A, Figura 3 y texto, **Nagueh 2025 p.554** (PDF 18). «PAI normal» y «elevada leve-moderada» son las etiquetas de la Fig. 3 (p.554); el corte **PCP >15 mmHg** como presión de llenado elevada, Nagueh 2025 p.550 (PDF 14, fila de Vp). Hoy la forma tiene PCP 24: vale para el 100 %, no para el grado 1.
Contexto normal (para que la caída de e′ se vea): Tabla 5, **Nagueh 2025 p.551** (PDF 15). 20-39 años: E/A 0,88-2,73, e′ septal 7,2-16,4, lateral 9,9-22,1, medio 8,7-19,1, E/e′ medio 4,0-9,1. 40-60 años: E/A 0,69-2,07, e′ septal 5,7-13,5, lateral 7,5-17,5. El normal del motor (E/A 1,15, E/e′ 8,8) está en la banda de 20-39 años. Ojo: con 40-60 años un E/A de 0,7 aún es normal, así que lo que marca el grado 1 es e′ baja, no E/A solo (p.551 y p.554).
DT: la fuente solo da un DT corto <140 ms como signo restrictivo (Nagueh p.547, PDF 11). **Hueco**: no hay DT para los grados 1 y 2 en estas páginas. El juez pide solo DT ≥140 ms en los tres puntos, y el DT largo del grado 1 queda como `fisiología general` con aviso, o se busca y se cita (REGLAS §1.15).
Cifras exactas dentro de cada banda (p. ej. E/A 0,7 en el defecto): `ilustrativo`; la banda sí lleva su página.

**Qué debe mover el motor:** con g bajo, la **relajación** del VI (más lenta: baja e′, cae E y la A pesa más, con la AI contrayendo de verdad tras la pieza 1) y la PAI normal. Con g alto, sube además la **rigidez** (`vi.b`, hoy ×2,2 fijo) y el **volumen retenido**, para que la PAI pase de 15 y E se recupere (seudonormal). La masa y la pared quedan fijas en todo el recorrido, porque `CRITERIOS_FORMA.hipertrofia` debe cumplirse a 0, en el defecto y al 100 %.

**No comprobado / riesgo**
- No he medido el motor. El E/A 10 de hoy viene sobre todo de la AI que no contrae (pieza 1): se arregla antes, o la hipertrofia no cuadra con ningún parámetro.
- Entre el grado 1 y el 2, el mando pasa por la rama «e′ reducida y E/A >0,8» → paso 3 (sin S/D en el modelo) y el atlas puede dar «PAI normal, sin grado». Es fiel a Nagueh p.554, pero necesita una frase viva que lo explique.
- Al 100 % el grado 2 necesita IT ≥2,8 m/s o PAPs ≥35 con la PCP alta. Si la PAPs no llega, saldrán solo 2 de 3 anómalas y dependerá de que el volumen indexado de la AI pase de 34 mL/m² (Nagueh p.554).
- No he comprobado que el `clasificar()` del atlas use el e′ medio o el septal con los mismos cortes. El constructor debe correrlo en los tres puntos.
