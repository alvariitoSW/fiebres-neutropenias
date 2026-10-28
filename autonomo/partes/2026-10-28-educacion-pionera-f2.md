# 2026-10-28 · educacion-pionera (fase 2, diseño y rúbrica)

**Resultado:** fase 2 hecha (diseños y rúbrica en `autonomo/ideas/educacion-pionera/`; sin PR: la PR y el Artifact llegan con la fase 3, el 02/11)
**Vueltas:** 1 + 1 tanda de arreglos de auditoría · **Jueces:** no aplica (no toca la app)

## Qué se hizo
Pedida por el usuario el 28/10 («si ya ha terminado la fase 1 empieza la fase 2»). Tres profesores (Fable) en paralelo,
con la skill `/mayeutica` y la evidencia de la fase 1:
- **A · POE en el shock vivo** → `diseno-a.md`: Amparo (sepsis) y Mateo (hemorragia clase III) de contraste; 6
  pantallas; 4 ciclos predecir → ver en el modelo → explicar el porqué con opciones; los tres formatos de §8. Nota
  visible: **no hay estudios de POE en médicos**; A se apoya en el efecto de pretest y la recuperación con feedback.
  Programa reutilizable `herramientas/lee-shock.mjs` (lee las constantes del modelo).
- **B · error productivo en el capilar vivo** → `diseno-b.md`: Carmen (71 a, IC, neumonía, Hb 7,4) transfunde sin
  guía; sello de sobrecarga por transfusión (TACO); **sin preguntas de ayuda durante el error** (Klein 2019); después,
  ejemplo resuelto en 6 pasos y 3 preguntas.
- **C · entrelazado y repaso en el río y mar** → `diseno-c.md`: Teresa (hemorragia digestiva) cruza cristaloides con
  hemorragia clase II; 5 preguntas de días atrás copiadas de bancos existentes; regla del repaso: campo
  `ultimo: 'AAAA-MM-DD'` en el registro del quiz; fallada → 1 día, después 3, 7 y 14. Notas visibles: entrelazado
  contradictorio en medicina (Hatala vs Monteiro) y «por fecha del último intento» es adaptación nuestra (Kerfoot
  espaciaba por calendario).
- **Rúbrica** → `rubrica.md`: §7-§8 + N1 predecir antes de ver, N2 explicar el porqué con opciones, N3 error con
  consecuencia y después enseñanza (10/8/5, cómo se mide, cita y fuerza), más el repaso y la prueba de 3 días.
- **Auditor** (sonnet) → `auditoria-f2.md`: 2 graves (en B: una frase contradecía sus cifras, ScvO₂ 69 % <70 %; un
  distractor era defendible) y 9 menores; **todos corregidos** por un constructor sonnet.
Revisión del encargo: la hice yo (no toca la app); riesgos: cifras sin página y respuestas dudosas → auditor.

## Para el usuario (el 04/11, con las maquetas)
- B: el mando «Transfundir» del capilar vivo **no tiene hoy tope ni sello**; la maqueta lo propone (Hb ≥7 sin
  indicación, p. 8). Si eliges B, habría que llevarlo al motor.
- B: el libro dice que el TACO no depende del número de unidades (p. 15): el sello castiga transfundir sin indicación,
  no «la 3.ª bolsa». Y el aviso de §1.14 al 80 % choca con «sin pistas» (Klein): queda como chip gris sin consejo.
- C: intervalos 1/3/7/14 días, decisión de diseño sin ensayo (se dice en pantalla).

## Visto de paso (no tocado)
- Shock vivo: en Mateo el gap venoarterial de CO₂ sale 6 (en el límite, p. 10), rotulado ilustrativo.
- Capilar vivo: en el TACO el gasto se queda quieto (una IC real lo bajaría): hueco del motor.

## Propuestas sobre las reglas
- Ninguna nueva.

## Vueltas
| Pieza | Vuelta | Nota profesor | Modelo | Pasos | Tokens eq. | Qué falló |
|---|---|---|---|---|---|---|
| Diseño A + rúbrica | 1 | — | fable | 26 | 0,66 M | 4 menores |
| Diseño B | 1 | — | fable | 12 | 0,27 M | 2 graves, 3 menores |
| Diseño C | 1 | — | fable | 16 | 0,40 M | 4 menores |
| Auditor | 1 | — | sonnet | 18 | 0,32 M | — |
| Arreglos | 1 | — | sonnet | 8 | 0,09 M | — |

## Gasto
Total **2,0 M** (presupuesto 2,35 M tras Hacienda; tope 2,5 M): desvío −15 %. Por papel: profesor fable ×3 1,3 M
(67 %) · auditor sonnet 0,32 M (16 %) · director ≈0,24 M (12 %) · constructor sonnet 0,09 M (5 %). Los que más
gastaron: A + rúbrica 0,66 M (presupuesto 0,7) · C 0,40 M (0,55) · auditor 0,32 M (0,3, +5 %: leyó 3 PDF).
Ahorro próxima vez: los profesores de B y C usaron la mitad de sus pasos; para diseños de una maqueta, 15 pasos /
0,4 M bastan.

## Cuentas
Presupuesto 2,5 M · Hacienda: rúbrica dentro del profesor A (−0,15 M) → 2,35 M · gastado 2,0 M · desvío −15 % (a
favor; sin pasada de `/ahorro` de después: el desvío es de ahorro y no cierra bloque) · queda de la tarea ≈2,7 M de
≈6 M (tope 8 M) para la fase 3 (02/11).
