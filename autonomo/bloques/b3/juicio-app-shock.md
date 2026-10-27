# Juicio del profesor · `shock-vivo` en la app (b3, parada 2) · 27/10/2026

Base: `node autonomo/pruebas/shock-vivo.mjs` (todo en verde a 390 y 360 px: topes, sellos, accesos, Mayéutica entera, caso, eco real, bucle parado), dos sondas propias (consola del balón con la temporización; el caso paso a paso leyendo el paciente del modelo) y 10 capturas. Comparado con la maqueta (`lista-shock.md`, 8,3-8,7): **nada se ha perdido al pasar; la consola gana la temporización con fuente (Gillespie 2024, `js/data/balon-temporizacion-data.js`)**, que en la maqueta estaba apagada.

| Criterio | Nota | Por qué |
|---|---|---|
| §7.1 Primera vista | 8,75 | Título, pestañas, pacientes y monitor arriba; la idea en 1-2 frases la da la frase viva del dock, no una línea bajo el título. |
| §7.2 Párrafos | 9 | Todo en chips, kv, sellos y plegables; la consola y la guía en frases cortas. |
| §7.3 Resaltado | 9 | Sello rojo con su cifra y origen; verde/rojo en IC, SvO₂, gap; la consola resalta «Aumento 84 · por encima de la sistólica». |
| §7.4 Lo que enseña se ve | 9,25 | Monitor con 6 trazas, corazón con VCI y arteriola, eco real A4C, tres aparatos por dentro y la consola con tres trazados. |
| §7.5 Interactivo que enseña | 8,5 | Cada mando cambia la frase viva. ❌ Con razón 1:3 el título sigue «Balón 1:2: un latido sí, otro no» (cuerpo: «uno de cada 3»). |
| §7.6 Abre en el estado del tema | 9 | 8 estados desde `mc-*`; `data-shock-vivo="balon"` abre con el balón y «← VOLVER» vuelve (prueba). |
| §7.7 Móvil | 9 | 0 px de desborde en todos los pasos a 390 y 360; rótulos ≥7,5 px. |
| §7.8 Modelo grande | 9,5 | Un modelo para 4 capítulos y 6 fichas, con 5 pacientes y 3 aparatos. |
| §7.9 Citas «Ver en la ficha» | 9,5 | Todas llegan a un párrafo que existe (prueba); el PDF, segunda opción. |
| §7.10 Explicación guiada | 9 | Guía por estado, 5 pasos, recuadro en el dibujo y cita (captura «Hemorragia, clase III»). |
| §8 Recorrido en orden y formatos | 9 | 11 preguntas en orden, velo «Primero predices», opciones solo tras «Ya lo tengo», repaso de las 3 falladas. |
| §8 Dificultad | 8,5 | G1, E2-E5 obligan a pensar. ❌ C4: «≈ 40» y «≈ 41» se distinguen por la interpretación, no por la cuenta; el 41 huele a relleno. |
| §8 Caso que evoluciona, giro, «Lo que te llevas» | 8,5 | Ficha que se rellena, IRVS, error del R1 (2 errores reales: milrinona «la mejor con hipotensión», levosimendán «72 h»), giro papilar, ECMO. ❌ Al acabar, el monitor vuelve a **«MATEO · AHORA»** bajo «Lo que te llevas · Aurelio». |

**Veredicto: pasa (mínimo 8,5); no llega a la meta 8,75 en tres criterios.** Nivel igual o superior a la maqueta.

## Arreglos (para el constructor)
1. ❌ **Final del caso con Mateo** · `js/modules/libros/shock-vivo/pagina.js` l. 658, `alTerminarCaso`: `prepararPregunta({ pac: D.PACIENTES[0].k })` → `prepararPregunta({ pac: 'aurelio', escena: 'corazon' })` (hora 0, sin aparato: así no quedan los sellos del paso 7 y el paciente es el del caso). El botón «Abrir el modelo con Aurelio en ECMO» ya hace el resto.
2. ❌ **Los dos sellos del ECMO (conocido) sí importan**: en el «Compruébalo» de C7 (ECMO 3,1 L/min, sin bolo nuevo) salen «Sobrecarga de **volumen** · PCP 21» y «Edema de pulmón 620 mL» tapando el monitor justo cuando el paso pide mirar SpO₂ 83 → 94 y PCP 18 → 21. El mecanismo es la **poscarga del VI por el ECMO** (p. 48-49), no el volumen: el sello lo contradice. `js/modules/libros/shock-vivo/topes.js`, `calcularTopes`: si `ajuste.soporte === 'ecmo'` y no ha entrado volumen desde el último cálculo, no disparar el tope de volumen; en su lugar, el aviso «el ECMO sube la poscarga del VI: PCP 21, ventea» con cita `C.ecmo`. El de edema puede quedarse (es la consecuencia que se ve).
3. ❌ **Título del balón fijo en 1:2** · `js/data/shock-vivo-data.js` l. 287 `ESTADOS['balon-1a2'].tit` → función de `X.ajuste.razon` («Balón 1:3: un latido de cada tres»), como ya hace `frase`. La clave se elige en l. 161.
4. C4 (`shock-vivo-data.js` l. 517-526): cambiar el distractor «≈ 41» por una cuenta equivocada real (p. ej. PAM/IC sin restar la PVC ≈ 41 con su lectura, o (PAM − PCP)/IC ≈ 31 «en meta») para que fallar enseñe.
5. C5 (`shock-vivo-data.js` l. 530): el enunciado repite «Toca las frases que creas falsas», que el motor ya añade debajo; quitar la frase del enunciado.
6. «Siguiente» a la vista antes de «Compruébalo» (conocido): importa poco (el velo sigue puesto hasta comprobar); al parte, no a esta vuelta.
7. Orden: `pagina.js` tiene 740 líneas (lista G4: ≤700); al parte.

## No comprobado / riesgo
- No abrí la ruta por menú (Libros → Marino → Modelos vivos): solo el enlace cruzado y el botón de `mc-soporte-mecanico` (prueba).
- No leí E1-E5 ni G2-G6 con los ojos (solo G1, C4, C5 y el final); la dificultad de los exámenes va por la prueba y el banco.
- La temporización nueva: miré «Correcta» e «Inflado precoz» (texto y trazado); los otros tres errores, no. Las cifras «15-20 mmHg» y «5 mmHg» son de Gillespie p. 8 según el dato; no lo coteje con el PDF.
- Las notas de la consola «el modelo no alcanza los 15-20 mmHg de bajada» están bien dichas; el auditor debería confirmar que Gillespie p. 8 dice eso tal cual.
