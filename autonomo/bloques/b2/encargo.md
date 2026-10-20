# Bloque 2 · Marino caps. 12-13 (Anemia, transfusión, plaquetas y plasma) · paquete

Objetivo M5 del tablero. Empieza el 20/10/2026, con el bloque 1 terminado y en main. Antes de nada, lee
`autonomo/bloques/b1/lecciones.md`: es cómo se trabaja ahora.

## 1. Fichas (6), en PIF → Hematología → Merino HEMATO

Viven en `js/modules/merino-hemato/merino-hemato.html` (su vista Visual, en `visual.js` del mismo módulo). Son de
Marino aunque el cuaderno se llame «Merino HEMATO». Clave para los jueces: `--ficha home:merinoHemato:panel-merino-tabs:<id>`.

| Cap. | Ficha (`id`) | Título |
|---|---|---|
| 12 | `merino-anemia` | Anemia en el crítico |
| 12 | `merino-transfusion` | Umbral transfusional |
| 12 | `merino-riesgos` | Riesgos de la transfusión |
| 13 | `merino-trombocitopenia` | Trombocitopenia y HIT |
| 13 | `merino-microangiopatias` | Microangiopatías trombóticas |
| 13 | `merino-plaquetas-plasma` | Plaquetas y plasma |

## 2. Fuente (`docs/`)

- `marino-2024-anemia-transfusion-hemostasia-uci.pdf` (38 páginas): cap. 12 desde la p. 1 del PDF, cap. 13 desde la
  p. 20. Cada ficha ya cita su página con `#page=N`: úsala y compruébala.
- El Libro Azul tiene `fuci-anemia` y `fuci-trombocitopenia` (otra fuente): solo enlace cruzado, nunca se mezcla.

## 3. Modelos y piezas que ya existen

- **Capilar vivo** (`data-capilar-vivo="<estado>"`, `js/modules/libros/capilar-vivo*`, `js/data/capilar-vivo-data.js`):
  ya tiene el estado `anemia` (Hb a la mitad) y el transporte de O₂ (CaO₂, DO₂, extracción, SvO₂). Candidato natural
  para anemia y umbral transfusional. Es también **el archivo modelo** de un modelo vivo con Mayéutica.
- **Telar vivo** (`data-telar-vivo`, bloque 1): la cascada, el FP4 y la TIH ya dibujados (cap. 5). Ojo con lo que dice
  la auditoría del telar (G1): el libro no dice que el fondaparinux «no envuelva el FP4».
- **Formas de partícula**: `js/core/particulas.js` + `js/data/formas-iones.js` (tabla única).
- La Mayéutica de las fichas (Texto | Estudiar): `js/core/mayeutica.js` (puede cambiar de archivo por la tarea «un
  solo motor de Mayéutica»: lee CLAUDE.md §6 al empezar).
- Imágenes reales del cuaderno (frotis con esquistocitos y otras): mira lo que ya hay en la ficha y en el atlas de
  Hematología antes de proponer una figura.

## 4. Modelo nuevo previsto (lo decide el usuario con maqueta)

**Vaso que sangra** (mapa visual de Marino, `autonomo/ideas/marino.md` §4.3): el vaso roto, plaquetas que se adhieren
(FvW) y se agregan (GPIIb/IIIa), la fibrina que teje el tapón y, debajo, la cascada; estados HIT, PTT (ADAMTS-13),
CID (consumo) y el PFC como balanza. Explicaría también fichas de otros bloques (tromboprofilaxis, hemorragia, HIC).
El profesor decide si conviene, si basta con ampliar el telar, o algo mejor.

## 5. Decisiones del usuario

- 19/10: cada ficha con su modelo vivo en su estado; Mayéutica socrática + examen difícil (nivel MIR); lo que no se
  cubra (objetivo ≈85 %) a «Para profundizar».
- 20/10: Texto | Estudiar (5 pasos: Mira, Juega, Piensa, Examínate, Caso) en vez de Texto | Visual | Mayéutica.
- 20/10: **solo 4-5 paradas por bloque** (`REGLAS.md` §2.3): 1) este plan con sus maquetas; 2) el primer modelo nuevo
  construido; 3) el bloque entero; 4) los cambios que pida. Todo lo demás lo decide el director.

## 6. Reglas que más fallan

La lista de comprobación de `.claude/agents/constructor.md` (frases nuevas con página, cifras en su contexto, tipos
de nota, nada interno a la vista, rótulos ≥7,5 px, forma de las opciones) y los jueces `--forma`.

## 7. Pasos

| Paso | Quién | Sale en | Estado |
|---|---|---|---|
| 1 · Cobertura | profesor (modo cobertura) | `autonomo/bloques/b2/cobertura.md` | en curso |
| 2 · Maquetas (parada 1 del usuario) | constructor potente | `autonomo/maquetas/b2-*.html` + Artifact | pendiente |
| 3 · Modelos en la app (parada 2: el primero) | constructor potente | rama `auto/b2` | pendiente |
| 4 · Estudio en las 6 fichas | constructor | rama `auto/b2` | pendiente |
| 5 · Jueces, auditor y profesor (parada 3: el bloque entero) | — | `autonomo/bloques/b2/*.md`, una sola PR | pendiente |

## 8. Piezas comunes

Las fija la cobertura (§6 del profesor). Se construyen primero y los demás las copian.

## 9. Pacientes del bloque

Los fija la cobertura. No repetir los del bloque 1: Andrés (62, la cama 7) y la Sra. R. (64, sepsis abdominal).
