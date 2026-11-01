# Profesor · juicio b5-5a (Estudiar de ma-fallo-hepatico-agudo, ma-encefalopatia-hepatica, ma-varices, ma-pbe-shr) · 01/11/2026
Cómo lo comprobé: copié el arnés del constructor en `prof-nav.mjs` (carga b5-5a-1 y b5-5a-2) y lo pasé a 390 y 360 px (`prof-nav.log`, capturas en `prof-cap/`; miré 4). 276 ✅. Los ❌ que vienen del arnés: la ficha sin Mayéutica, «vista Visual» y «días atrás», que buscan fichas del b1. El ❌ que es de verdad: «Repasar en la ficha» de Casimira apunta a `ma-eh-cvvh`, que está en otra ficha. Tests: la buena es la más larga en 7/27 y 6/30, y la más corta en 6/27 y 7/30 (bien). Sin desborde.

| Criterio | Nota | Por qué |
|---|---|---|
| §7.1 Primera vista (resumen + Mira con la figura real) | 9,0 | Como b1-fluidos: idea de una línea, 5 pasos y figuras 39.x arriba |
| §7.4/7.8 Modelo grande en su estado | 9,0 | hepatocito (casimira, edema, hilario, hilario:tips), shock hemo-iii/séptico, nefrona prerrenal, glomérulo; la frase dice qué estado falta |
| §7.5 Predice y comprueba | 8,75 | eh-g3 y var-g7 tapan la cifra y luego la enseña el modelo; falta capilarVivo 'sepsis' en la ficha 4 (lo pedía el plan) |
| §7.9 Cita → ficha | 8,75 | `fuente` da «Ver en el texto» en todas. b5-5a-2 casi no lleva `pag()` (3 frente a 9 en b3a-shock-1). Fallo de la pieza común: la etiqueta «PesoPrimera causa…» |
| §7.7 Móvil | 9,25 | Sin desborde en ningún paso a 390 ni a 360 |
| §8 Recorrido en orden y formatos | 9,0 | Guía en el orden de la ficha; los tres formatos; errores con 1-2 fallos y su frase buena |
| §8 Dificultad (Examen MIR) | 8,75 | El examen es fino (fha-e3 Tabla 39.1, pbe-e3 hematuria, pbe-e4 cmH₂O). En la guía hay distractores flojos: fha-g6 «corrige la bilirrubina», eh-g5 «laxante osmótico» |
| §8 Caso Casimira (ficha 1) | 7,75 | 3 de sus 6 pasos son de la ficha 2 (c2, c3, c5); 128 bajo CVVH frente a 300 en el modelo; vuelta a otra ficha |
| §8 Caso Rosendo (ficha 2) | 7,0 | El encargo (b5 §8) dice «Nadie inventa otro». No usa el VHB. Su giro (día 4, TC con amonio bajo bajo CVVH) es el de Casimira copiado |
| §8 Casos Hilario (fichas 3 y 4) | 9,25 | Línea de tiempo coherente: 03:10 → ligadura a las 9 h → TIPS día 2 → PBE nosocomial día 3 (WH 2 tras el TIPS) → SHR día 6-8 → PIA día 10. Las cuentas 105/70 g y −34 % se hacen con las calculadoras |
| §8 Lo que te llevas y vuelta | 8,5 | pbe-c2 `lleva[0]` (el TIPS) se enseña en var-c1, no en este caso |
| §1.12 Paciente posible / cifras | 8,0 | El amonio de Casimira y Rosendo choca con el modelo que abre el mismo paso |
**Global 8,5 / 10. Veredicto: no pasa** (Rosendo 7,0 y Casimira 7,75 están por debajo de 8). Lo demás, en meta o por encima.

**Decisiones:** (1) **Acepto** partir a Hilario en dos casos: mismo paciente y cifras que encajan. (2) **No acepto** a Rosendo: el encargo prohíbe pacientes nuevos y además repite el giro de Casimira. Arreglo exacto, en `b5-5a-1.js`:
- **Ficha 1, `fha-c` «Casimira I, hora 36 → día 3»** (5 pasos, todos de la ficha 1):
  1. Nuevo `fha-c0`, hora 36, la causa (test; calculadora `ma-fha-causa-resultado`, que pasa aquí desde c1). Datos: sin hipotensión previa, VHB y ANA negativos. Buena: paracetamol (p. 3). Distractores: isquémica, pide hipoperfusión (p. 4); vírica <10 % (p. 4-5); autoinmune, 80 % mujeres pero insidiosa y con ANA (p. 4).
  2. `fha-c1` (la NAC), tal cual. 3. Nuevo `fha-c3b`, día 1, error del R1 con 2 errores: «Suspendo la NAC: nivel indetectable» ✗ (p. 3) · «Albúmina 5 % si hay que dar volumen» ✓ · «Ringer lactato de mantenimiento» ✗ (hiponatremia → edema, p. 5) · «Vigilo la diuresis: FRA en el 70 %» ✓ · «Aviso a trasplante si progresa la encefalopatía» ✓ (p. 8).
  4. `fha-c4` (día 3, el giro renal y hemodinámico). 5. `fha-c6`, con la buena sin «ya tiene edema»: «si la encefalopatía progresa, trasplante: del 80 al 33 %». `volver.ancla`: `'ma-fha-hemodinamica'`.
- **Ficha 2, `eh-c` «Casimira II, la encefalopatía, día 1 → día 4»**, con el título, `paciente` y `sub` de Casimira (44 años, 60 kg). Los pasos de Rosendo pasan a Casimira, en este orden:
  1. `eh-c1`, día 1 noche, grado 1 («su hija dice que no es la misma»). 2. `eh-c3`, día 2 08:00, venoso 90 (el error). 3. `fha-c2`, día 2 10:00: arterial 165, grado 2, CVVH (`ma-cvvh-resultado`). 4. `eh-c2` (destapa de lactulosa y rifaximina); `fha-c3` sobra o queda como 6.º paso. 5. `fha-c5`, día 4, el giro. Borra `eh-c4` (la oliguria ya la pregunta eh-e3) y todo Rosendo; `lleva` y `volver` (`ma-eh-nh3`), como ahora.
- **El amonio del giro (día 4).** El modelo `edema` sin CVVH marca 300. Con la CVVH encendida marca 86 y salta el sello «la TC manda, no la cifra» (`modelo.js`, `topes`). Cambia «128 µmol/L» por «86 µmol/L bajo hemofiltración». Cambia el texto del botón por «🏭 El edema: enciende la CVVH y mira el sello «la TC manda»». Ajusta la nota de `fha-c5`. No hay que tocar el modelo.
- **Quita la nota de `fha-c3`** sobre el «umbral de 4»: si se queda como 6.º paso, su frase dice 5-6.

**Arreglos menores (para llegar a la meta):**
- `b5-5a-2.js`, `pbe-c2.lleva[0]` → «Albúmina en la PBE: 1,5 g/kg el día 1 y 1 g/kg el día 3, al 25 %».
- `pbe-g6`: añade `modeloVivo` `{ capilarVivo: 'sepsis', texto: '🧫 La sepsis aumenta la vasodilatación' }` (plan §1).
- Pon `pag(9|10|11|12|13)` en las explicaciones de b5-5a-2 que citan la Tabla 39.3 o 39.4 sin página: var-g2, var-g4, var-e1, var-e3 (quita «cap. 15, Tabla 15.1», que no está en la ficha), pbe-g1 a pbe-g8 y pbe-e1/e2/e6.
- Distractores más finos: `fha-g6` «corrige la bilirrubina» → «porque el FRA del fallo hepático es siempre una NTA por paracetamol» (la ficha da paracetamol **o** hipotensión, p. 5); `eh-g5` «laxante osmótico» → «antibiótico no absorbible, 400 mg ×3 hasta que el amonio sea <150» (no hay criterio de cifra; ≥10 días).
- `var-g3`, el porqué de «PAM 80»: no es de la ficha. Cámbialo por «la tabla fija PAM 65; ni el libro ni la ficha piden más».
- Fuera de este grupo, a la bitácora: la etiqueta «PesoPrimera causa…» de «Ver en el texto» junta el `<dt>` y el `<dd>` (`js/core/mayeutica.js`, la función que saca el texto del enlace).

**Rejuicio corto (R8):** solo los dos casos de las fichas 1-2, §1.12, «Lo que te llevas» y §7.9, con `prof-nav.mjs`.

## Rejuicio (R8) · 01/11/2026
Comprobado con `prof-nav.mjs` (`prof-nav2.log`): 278 ✅. «Repasar en la ficha» de Casimira I ya funciona (ancla `ma-fha-hemodinamica`). Los 3 ❌ que quedan son del arnés (fichas del b1: «vista Visual», ficha sin Mayéutica, «días atrás»). Rosendo está fuera.
| Criterio | Antes → ahora | Por qué |
|---|---|---|
| Caso Casimira I (ficha 1) | 7,75 → 9,0 | 5 pasos, todos de la ficha 1: causa con la calculadora, NAC, error del R1 con 2 errores, giro renal del día 3 y pronóstico con 75 % y 80→33 % |
| Caso Casimira II (ficha 2) | 7,0 → 9,0 | Grado 1 → error del amonio venoso → 165 arterial con la calculadora de CVVH → destapa → giro de la TC con 86. Mismos datos que Casimira I y que el caso del modelo |
| Paciente posible y cifras (§1.12) | 8,0 → 9,0 | 86 bajo hemofiltración = lo que marca el modelo `edema` con la CVVH; la nota lo dice. PIA 18 cmH₂O ≈ 13 mmHg supera el umbral con las dos lecturas |
| «Lo que te llevas» y vuelta | 8,5 → 9,0 | `pbe-c2.lleva[0]` es la albúmina de la PBE; Casimira I enlaza con Casimira II |
| Cita → ficha (§7.9) | 8,75 → 9,0 | `pag()` en b5-5a-2 (de 3 a 18); capilarVivo `sepsis` en pbe-g6 |
**Global 9,0. Veredicto: pasa y llega a la meta (todo ≥ 8,75).** Pulido opcional, al parte: el distractor de `fha-c0` «Vírica: la hepatitis B es la causa más frecuente…» mezcla un dato falso con la causa; mejor «Vírica: hepatitis B reactivada» (el porqué no cambia).
