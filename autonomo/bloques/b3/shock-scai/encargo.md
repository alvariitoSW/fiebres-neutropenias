# Encargo · shock-scai (bloque 3, carril 1) · rama auto/b3-scai (desde origin/auto/b3)

Tipo: estudio (contenido sobre un modelo vivo que ya existe: el shock vivo, js/modules/libros/shock-vivo/).
Fila del tablero: Objetivo C, n.º 9 (Consejo 29/10, 2.ª). Presupuesto ≈1,5-2,5 M, sonnet.

## Qué se construye (4 piezas, todas en el shock vivo y su Mayéutica)
1. **Estadio SCAI A-E en el shock vivo.** Fuente: ESC 2026 IC parte 1 (docs/esc-2026-hf-guideline-parte1.pdf, pdf 44).
   Un rótulo «SCAI ·X» visible en el monitor/veredicto del modelo, asignado con reglas **cualitativas** de la
   definición de p. 44 (sin shock / hipotensión-taquicardia sin hipoperfusión / hipoperfusión que pide intervención /
   no responde a lo iniciado / refractario-parada). Ningún umbral numérico inventado: si una regla necesita cifra,
   la de la fuente con página (p. ej. lactato >2 de la ficha de IC, p. 44) o se rotula «modelo». Origen visible.
   **No duplicar la tabla**: botón de enlace cruzado (`data-especialidad="cardiologia"`, panel/ficha `ic-descompensada`
   de insuficiencia-cardiaca.html, con `data-resaltar` a la tabla SCAI si se puede) «Ver la escala SCAI (ESC 2026)».
2. **ECMO + Impella (descarga del VI)**: nota corta en el estado `ecmo-venteo` / `ecmo-carga` y una pregunta
   «piensa antes» en la Mayéutica. Fuente: Marino cap. 17 (docs/marino-2024-shock-caps14-17.pdf, pdf 48-49;
   ya citado en shock-vivo-data.js como C.ecmo / C.ecmoPoscarga).
3. **Caso clínico del fallo del VD** (paciente Fermín, `tipo: 'vd'`, estado `iam-vd`, ya existe): caso que evoluciona
   en 4-5 pasos (reconocer PVC>PCP, VD dilatado y tabique; volumen con cuidado; inotrópico/vasopresor; qué no
   hacer). Fuente: Marino cap. 16 desde pdf 39 (C.vd, p. 40). Formato: el de CASOS en shock-vivo-mayeutica.js
   (motor común `js/core/mayeutica-motor.js`), segundo caso junto al de Aurelio. Las cifras de los enunciados salen del
   monitor de la app (`autonomo/bloques/b3/herramientas/g4-app-cifras.mjs`), nunca del programa del motor.
4. **Pregunta de la succión del Impella**: SOLO si la fuente abrible la trae (Marino p. 47-48 o la ESC 2026). Si no,
   no se escribe y el parte lo dice.
5. Preguntas SCAI en la Mayéutica: 2-3 (una «piensa antes» por paciente: ¿qué estadio es?, y una «encuentra el error»).

## Lo que NO quiero
- Copiar la tabla SCAI de la ficha de IC; inventar umbrales; nada de la charla Impella-Antaa como fuente (solo ideas,
  `autonomo/ideas/ingenieria-inversa/impella-antaa.md`).
- Tocar el manejador de pacientes nuevo de pagina.js (setTimeout 0, contador `cambioPac`).
- Pasar de 700 líneas en shock-vivo-data.js (hoy 679): lo nuevo va a un archivo propio (`js/data/shock-vivo-scai.js`).
- Preguntas de redactar, huecos o emparejar (REGLAS §8). Ids duplicados.

## Hecho
- `node autonomo/jueces.mjs --modelo shock-vivo` y `--forma` en verde; prueba `autonomo/pruebas/shock-vivo.mjs`
  ampliada (rótulo SCAI en 3 pacientes, el caso de Fermín entero, desborde a 390/360).
- Toda cifra y afirmación con su página (incluidas explicaciones y distractores).
- `node autonomo/version.mjs 20261030-N` (N libre).
- Auditor sin graves; profesor ≥ 8,75.
