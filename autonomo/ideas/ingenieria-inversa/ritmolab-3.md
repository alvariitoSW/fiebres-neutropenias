# RitmoLab · 3.ª pasada · debate de profesores para `pif-ecg` · 27/10/2026

Sin volver a abrir la web: sobre `ritmolab.md` y `ritmolab-2.md`, el corazón eléctrico (`js/modules/libros/ritmo-vivo/`) y López Ramírez 2012. Dos profesores (A: leer el ECG; B: arritmia a pie de cama) y un moderador. Informe para el usuario: https://claude.ai/artifact/Pxwk2BgmS9GbDHacmz3mfM. Las mejoras 1-5 se construyeron en `pif-ecg`; la 6 (eje en el corazón) y la 7 (bradis, modo Guardia) quedan para el usuario y `b3-bradi`/`g2-paro`.

## 1. Dónde coinciden
- RitmoLab no aporta un modelo: aporta **orden mental** (un paso cada vez sobre el mismo ECG; pulso → estable → ancho/estrecho),
  ruta visible/oculta (ya es Guía/Examen) y amplitud clínica (bradis, marcapasos). Su «lectura guiada» en texto, su nota /100,
  el maniquí y sus cifras (70 mA, 200 J…) no entran.
- Los **trazados reales del libro** son la figura de las fichas (§7.7); nada sintético como figura principal.
- Los **ejercicios de los caps. 11-12** son el banco de la fase B y la cantera de los casos (§1.12): paciente inventado, ECG del libro.
- `pif-ecg` **no toca `motor.js` ni `pagina.js`**: todo lo del modelo va por `b3` con sus pruebas. El cuaderno abre el corazón en
  su estado (`data-ritmo-vivo`), y el corazón, más adelante, enseña el trazado del libro (es dato, `LAMINAS`).
- El cap. 8 no trae tratamiento: «deducirlo» de ESC 2019 sería un fallo de fidelidad; solo nota de fuentes donde choque.

## 2. Dónde chocan, con veredicto
**a) 12 derivaciones vivas en el motor (A, mejoras 4-5) frente a «no hacen falta» (B).** Veredicto: **B para esta tarea, A para
el futuro.** El encargo veta el motor y §7.7 manda registros reales: para el 01/11 el eje se estudia en los trazados del libro.
Pero A tiene razón en §7.4: el eje y la imagen especular no «se ven» hasta que el corazón proyecte sobre las frontales. Es
barato (5 vectores en `DERIV`) pero no inocente: con amplitudes ilustrativas, el eje calculado del vector neto sale **ilustrativo**,
no del libro, y las precordiales de tabla fija son lo que criticamos a RitmoLab. Va a maqueta y decisión del usuario (pregunta 1).
**b) «Lector sobre trazado real» (A1) frente a «tres chips de guardia» (B1).** Veredicto: **se funden en una pieza común.**
Misma estructura (figura real arriba, chips encima que señalan en el trazado y una frase viva) con dos juegos de chips: el
**método** (Frecuencia · Ritmo · Eje · Hipertrofias · Isquemia · Intervalos) en las fichas 1-7 y 9, y la **guardia** (rápido/lento ·
estrecho/ancho · regular/irregular, que es la secuencia del cap. 8) en la ficha 8 y en los ejercicios, donde se eligen **antes** de
ver el diagnóstico (predice y comprueba, §8). Límite realista para 5 días: el chip resalta **por derivación** (rejilla 3×4
semitransparente sobre la imagen; en tiras de una sola derivación, solo la frase) y marca milímetros solo en 2-3 trazados del
cap. 2 elegidos como ejemplo de regla. Capas finas en los 70 trazados no llegan al 01/11.
**c) Calculadora de FC y QTc: A no, B sí.** Veredicto: **B.** El encargo lo dice literal («si la da: sí, código propio, §7.10») y el
libro la da con fórmula y página. Además, los umbrales del libro (0,42/0,43) no son los de Merino (0,44): CLAUDE.md §2 («cada
calculadora es código específico», «nunca se fusiona contenido de fuentes distintas») obliga a una calculadora propia con los
umbrales del libro, **enlace cruzado** a `#mc-qtc` y nota de fuentes (libro 2012 · Marino/Merino 0,44 · ESC 2022 450/460 ms). Lo
que A salva: nada genérico, y el botón «Mídelo en la tira viva» hacia Medir del corazón (A2 sin la línea `extra.medir` de b3).
**d) Tarjeta de guardia con `initSiNoWizard` (B4; A no la propone).** Veredicto: **entra, con la condición de B.** Cada rama acaba en
reconocimiento del libro con página + enlace al estado del corazón; ni una dosis ni un julio hasta `g2-paro`. Es la pieza que
RitmoLab hace mejor y la más útil a las 3 a.m. Riesgo que vigila el auditor: que el constructor la «complete» con tratamiento.
**e) Bradis, BAV y marcapasos en el grafo (A6 = B5).** No chocan: ambos lo mandan a `b3-bradi`. Reparto de B (pif-ecg escribe fichas
e ids con los trazados; b3-bradi rellena `pend-*` citando el libro para el ECG y ESC 2021 para la conducta) queda como acuerdo.

## 3. Propuesta final (7 mejoras)
**Entra ya en `pif-ecg` (para el 01/11, sin tocar b3)**
| # | Mejora | Qué aporta | Esfuerzo | Quién |
|---|---|---|---|---|
| 1 | **Lector de ECG** sobre trazado real, pieza común (lección 8): chips del método y chips de guardia, resalte por derivación, frase viva, «Ver en el texto». Es la vista Visual de las 10 fichas (receta `montarVisual`, `fuente:'#id'`). | El método se ve en el ECG de verdad y la misma pieza servirá a Merino SCA y Marino 20 | Pequeño-medio | A1 + B1 |
| 2 | **«Lee este trazado»**: los ejercicios del cap. 11 (A cuenta 20 en el cap. 11, B ~71 en todo el libro; lo fija el lector de la parte 3) como test con «piensa antes»: primero los 3 chips de guardia, luego subpreguntas en orden del método, respuesta del cap. 12 con página y «Verlo latir» si hay estado; 4-6 «encuentra el error» (0-2 errores) con informes de otro residente. Los casos del cuaderno nacen de aquí. | El banco del encargo y el examen final; lo que hará en la guardia | Pequeño-medio | A3 + B1 |
| 3 | **Calculadora de FC (3 métodos, pp. 7-11) y QTc (p. 108)** con umbrales del libro, aviso «en FA solo el método 3», enlace a `#mc-qtc` y nota de fuentes; botón «Mídelo en la tira viva» → corazón, Medir. | Aprender a medir en papel y comprobarlo en un latido que se mueve | Pequeño | B3 + A2 |
| 4 | **Pares estado ↔ ficha**: id en cada párrafo de ritmo y, en el parte, la tabla «estado → #id → página → trazado del libro» para que b3 la vuelque en `ESTADOS[].fuentes` y `LAMINAS` (dato, 20 líneas). | El corazón y el libro se encuentran en los dos sentidos | Pequeño | B2 |
| 5 | **Tarjeta «¿Rápido o lento? ¿Estable?»** (`initSiNoWizard`, cap. 8 pp. 113-130): solo reconocimiento + enlace. | Reconocer en 30 s y saber a dónde ir | Medio | B4 |

**Decisión del usuario / va a otra tarea**
| # | Mejora | Qué aporta | Esfuerzo | Destino | Quién |
|---|---|---|---|---|---|
| 6 | **Frontales y eje en el corazón eléctrico** (5 vectores en `DERIV`, selector de 6 miniaturas, flecha del eje sobre el hexaxial rotulada «ilustrativa»); fase 2: ST e hipertrofia por territorio con profundidad en el grafo (nunca tabla fija). Maqueta antes. | El eje deja de ser mnemotecnia: se ve por qué el vector va donde va | Medio (+ medio-grande la fase 2) | `b3-ritmo-motor` o tarea nueva | A4-A5 |
| 7 | **Bradis, BAV y marcapasos** con el libro como fuente de ECG y ESC 2021 para la conducta (A6 = B5), y después el **modo Guardia** (¿pulso? ¿estable? en todos los ritmos, acciones con consecuencia, ruta visible/oculta, sin nota numérica), que no es tarea nueva: converge `b3-ritmo-motor` + `b3-bradi` + `g2-paro`. `pif-ecg` solo deja el gancho «Vive este caso» apagado. | Cierra el catálogo y da lo que RitmoLab gana de verdad | Grande | `b3-bradi`, `g2-paro` | A6 + B5-B6 |

Orden para el 01/11: 1 → 2 → 3 → 4 → 5 (la 5 es la primera que cae si falta presupuesto: va al parte). Ruta de estudio del
cuaderno: 1 Método → 2 Frecuencia (calculadora) → 3 Ritmo → 8 Arritmias (tarjeta) → 4-7 y 9 (lector) → 10 → ejercicios.

## 4. Lo que no se trae
- De RitmoLab: la «lectura guiada» en texto, Estudio/Simulación como dos modos, nota /100, maniquí 3D, constantes en línea recta,
  sus cifras (70 mA, 200 J, «FC<130 no se cardiovierte»), sus textos y pacientes. Solo marcan qué buscar en AHA 2025.
- Un ECG de 12 sintético como figura de ficha; precordiales de tabla fija presentadas como fisiología.
- Tratamiento «deducido» para el cap. 8; criterios de 2012 como vigentes (eje −30° a +110°, QTc 0,42, Brugada vs «si dudas, TV»):
  nota de fuentes con las dos, nunca fundidas.
- Un segundo simulador de ritmo dentro del cuaderno; una calculadora de eje o de hipertrofia (el libro da reglas, no fórmula).
- Para b3, en el parte: una línea en `abrirEstado` (`pagina.js:651`) para `extra.medir`, y volcar la tabla de la mejora 4.

## 5. Preguntas para el usuario
1. El eje: ¿quieres que el corazón eléctrico aprenda a dibujar las 6 derivaciones de los miembros con la flecha del eje (una
   maqueta primero; no llega al 01/11 y la flecha sería orientativa, no del libro), o te basta con los trazados reales del libro?
2. La tarjeta «¿rápido o lento? ¿estable?»: ¿la quieres ya, sabiendo que solo dirá qué ritmo es y a dónde ir (sin dosis ni julios
   hasta que entre la AHA 2025 con `g2-paro`), o prefieres esperar y tenerla completa de una vez?
3. Los ejercicios del libro: ¿todos como preguntas (más completo, más días) o primero los 20-30 que tienen pareja en el corazón
   eléctrico y el resto como galería de trazados para la siguiente vuelta?
