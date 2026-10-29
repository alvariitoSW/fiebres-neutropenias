# Resumen · «Respirador fácil: cómo leer y usar el ventilador (nivel básico)» (Antaa Slide, 2026)

Ingeniería inversa de **contenido** (no de código) hecha el 29/10/2026 para el pulmón con respirador (`b3-pulmon-app`).
Resumen con mis palabras, no traducido literal. **Las cifras de la clase no son fuente de la app**: todas van «por
comprobar en Marino / El Libro Azul».

Leyenda: **[visto]** = está en el texto de las diapositivas; **[deducido]** = lo infiero de lo que dice;
**[desconocido]** = no lo he podido ver.

## Cabecera

| Campo | Dato |
|---|---|
| Qué es | Clase en diapositivas para residentes: «【わかりやすい呼吸器】人工呼吸器の読み方と使い方 ～基礎編：3つの波形・換気モード・初期設定～». Parte 1 de una serie (después, nivel intermedio y avanzado). [visto] |
| Enlace | https://slide.antaa.jp/article/view/7139b7d01bef4ea5 |
| Autor | Yuta Tsunemi (常見勇太), médico; Sapporo Heart Center / St. Luke's. Es el mismo autor de la clase de Impella (`impella-antaa.md`). [visto] |
| Fecha | Publicada el 18/10/2026. 51 diapositivas, unas 9.200 visitas, 74 «me gusta». [visto] |
| Idioma | Japonés. [visto] |
| Condiciones | Pública, sin cuenta. No he encontrado licencia ni condiciones de reutilización. La descripción dice que **las curvas son dibujos propios, no de libros**. Aviso de patrocinio: ninguno visto en esta clase. Por tanto: ideas sí; texto y figuras, no (CLAUDE.md §7.9). [visto] |
| Cómo se leyó | El texto de las 51 diapositivas viene incrustado en la página (JSON de la propia web). **No he mirado las imágenes**: no sé cómo dibuja las curvas. [visto / desconocido] |

## Lo que enseña

### 1. Dos tipos de insuficiencia respiratoria [visto]
- Tipo I: falla el **intercambio** (poco O₂). Tipo II: falla la **bomba** (CO₂ alto con acidosis).
- Al respirador le da una herramienta principal a cada uno: tipo I, FiO₂ y PEEP; tipo II, volumen y frecuencia.
- Avisa de que muchas veces vienen juntos, pero que separar los dos «mandos» evita líos.
- Cifras que da (PaO₂ <60, PaCO₂ >45): por comprobar en Marino / El Libro Azul.

### 2. Oxigenación y ventilación: dos mandos independientes [visto]
- Oxigenación: FiO₂ y presión media (PEEP). Ventilación: volumen corriente × frecuencia.
- Errores típicos que corrige: «SpO₂ baja, subo la frecuencia» (no); «CO₂ alto, subo la FiO₂» (no).
- Sobre esa base añade: **espacio muerto** (anatómico y alveolar; ventilación alveolar = (Vt − espacio muerto) × FR; por eso con Vt bajo hace falta más FR) y **V/Q frente a cortocircuito** (en el cortocircuito la FiO₂ 1,0 apenas sube la SpO₂ y el arma es la PEEP).
- Es la idea más útil para el monitor: son dos palancas y cada una mueve una cosa. Ya está en el ácido-base vivo y el capilar vivo (los gases); aquí solo hay que enlazarlos.

### 3. Compliance, resistencia y constante de tiempo [visto]
- Compliance: lo fácil que se hincha el pulmón. Agrupa sus causas por **sitio** (alvéolo, pleura, pared y abdomen, un solo pulmón ventilado). Señal: a igual Vt sube la meseta.
- Resistencia: lo difícil que es pasar el aire. Agrupa las causas **de cerca a lejos** (tubo mordido, tapón, agua en el circuito, broncoespasmo). Señal: sube el pico y la meseta no.
- Constante de tiempo (τ = R × C): a 1, 2 y 3 τ sale el 63 %, 86 % y 95 % del aire; hace falta espirar al menos 3 τ. EPOC y asma: R grande, τ larga, atrapamiento. SDRA: C pequeña, τ corta.
- Da rangos normales y de SDRA. Todos: por comprobar en Marino / El Libro Azul (Marino no da R ni τ: nota `r-tau` de la maqueta).
- Añade que el tubo estrecho pesa «a la cuarta potencia» del radio. [visto]; fórmula: por comprobar.

### 4. La ecuación del movimiento [visto]
- Presión en la vía aérea = flujo × resistencia + volumen ÷ compliance + PEEP.
- La presenta como «la explicación de todas las curvas»: el primer término es lo que se ve en la diferencia pico-meseta; el segundo, en meseta menos PEEP; el tercero, en la línea base.
- Con auto-PEEP, se suma a la base.
- **Ya la tenemos** (maqueta: `Palv = V/C + PEEP`, Ec. 27.1-27.3 de Marino). Lo nuevo es el modo de contarla: tres términos, tres sitios donde mirar.

### 5. Las tres curvas [visto]
- Presión, flujo y volumen, **siempre en el mismo orden** (presión → flujo → volumen).
- Presión: se lee en tres puntos (línea base = PEEP, cima = pico, escalón de la pausa = meseta).
- Flujo: sobre la línea es inspiración, bajo la línea espiración (pasiva). Si el flujo no vuelve a cero antes del siguiente ciclo, hay atrapamiento. La forma del flujo inspiratorio delata el modo.
- Volumen: triángulo que sube y baja a cero. Si no vuelve a cero, hay fuga o atrapamiento.
- Una pantalla puede tener más de un problema.
- Cada ciclo se descompone en **cuatro decisiones**: qué lo inicia (disparo), qué se mantiene durante la entrada (límite), qué la termina (ciclado) y la espiración pasiva. Con eso se predice la curva de cualquier modo nuevo.
- Disparo por presión (−1 a −2) o por flujo (1-3 L/min). Muy sensible: autodisparo; poco: esfuerzo perdido. La muesca de presión antes del ciclo marca el disparo del paciente.
- Todas las cifras: por comprobar (Marino cap. 27 p. 8-9 ya da el disparo; ver `PROFUNDIZAR` de la maqueta).

### 6. VCV frente a PCV [visto]
- Reconocimiento visual: en volumen control el **flujo** es cuadrado y la presión sale como salga; en presión control la **presión** es cuadrada y el flujo decrece.
- Qué garantiza cada uno y qué hay que vigilar: VCV garantiza el volumen y se vigila la presión (pico y meseta); PCV garantiza la presión y se vigila el volumen.
- Trampa de VCV: flujo fijo; si el paciente pide más, «hambre de flujo» (lo deja para el nivel avanzado).
- Trampa de PCV: si el pulmón se pone rígido o hay una fuga, **el volumen baja en silencio**; si sube la resistencia, la presión no sube y la alarma de presión no suena.
- Forma del flujo (cuadrado o decreciente): cuadrado acorta la inspiración y deja más tiempo de espiración; decreciente baja el pico y sube la presión media.
- Resumen del autor: no hay ganador; hay que **vigilar el lado que no está garantizado**.
- La maqueta ya tiene VCV y PCV (estados `normal-vcv` y `normal-pcv`) y la pregunta de por qué el pico de VCV no rompe el alvéolo. Lo nuevo: el **«lado no garantizado»** como regla de lectura.

### 7. Modos y PSV [visto]
- Eje de máquina a paciente: A/C (todas forzadas, la primera elección en fase aguda), SIMV (cae en desuso) y PSV (todas disparadas por el paciente; recuperación y destete).
- Cómo distinguirlos en la curva de presión: todas iguales = A/C; grandes y pequeñas mezcladas = SIMV + PS; iguales pero irregulares = PSV.
- PSV tiene tres mandos: nivel de soporte, tiempo de subida y criterio de fin de inspiración (porcentaje del pico de flujo; más alto en EPOC, más bajo en restrictivos).
- Ya decidido (acta): SIMV y PRVC, descartados; PSV con ciclado por flujo, sí (encargo 1). Esta clase **refuerza que no hace falta SIMV**.

### 8. Ajustes iniciales tras intubar [visto]
- Resumen de ocho pasos tras intubar: comprobar el tubo con capnografía y auscultación, poner los ajustes iniciales, mirar la tensión (el aire a presión y la sedación la bajan), ajustar alarmas, gasometría en 30 min, pausa inspiratoria para medir la meseta, radiografía y objetivo de sedación.
- Ajustes: Vt 6-8 mL/kg de **peso ideal**, FR 12-20, PEEP 5, FiO₂ 1,0 y bajar hasta SpO₂ objetivo, A/C, disparo por flujo, tiempo inspiratorio ~1 s (I:E ≈ 1:2).
- Fórmula del peso ideal por talla y sexo; ejemplo de 170 cm. **Ya está** (calculadora de PBW de la ficha).
- Matices por enfermedad: obstructivo, I:E 1:3 a 1:5, FR baja; SDRA, FR más alta con Vt bajo; hipoxemia, alargar la inspiración.
- Tabla FiO₂-PEEP (ARDSNet «baja PEEP / alta FiO₂»), límites de meseta y presión de conducción, y rango de alarmas: **todas las cifras por comprobar** en Marino / El Libro Azul. Marino ya da la meseta ≤30 y la nota `meseta-30`; la presión de conducción como umbral, **por buscar** [desconocido si Marino la trae].
- Regla de la primera medida: medir primero con pausa inspiratoria (sin esfuerzo del paciente).
- Dos reglas de buena práctica que vale la pena guardar como frases del caso: «el error más común es subir solo la FiO₂ y dejar la PEEP en 5» y «no cierres la alarma sin ver por qué suena».

### 9. Las dos fórmulas de lectura y la regla de «dos opciones» [visto]
- Compliance estática = Vt ÷ (meseta − PEEP total). Resistencia = (pico − meseta) ÷ flujo inspiratorio (con flujo constante).
- Árbol de decisión del pico alto: **pico ↑ con meseta igual = resistencia; pico ↑ con meseta ↑ = compliance.**
- Lista de causas en cada rama (tubo, tapón, broncoespasmo, mordedura frente a neumotórax, atelectasia, edema, abdomen).
- Caja de «cuando dudes»: DOPES (tubo desplazado, obstrucción, neumotórax, equipo, atrapamiento) y **bolsa manual** mientras buscas.
- Esto es el esqueleto del **caso 1** y de los distractores de sus preguntas. Ya está en la pregunta 1 (pausa inspiratoria) y el 4 (SDRA) de la maqueta. DOPES: por comprobar si Marino lo trae.

### 10. Los tres casos [visto]

**Caso 1 · Alarma de presión alta en VCV (neumonía).**
- El pico pasa de 28 a 42 y la SpO₂ baja un poco. Pausa inspiratoria: la meseta es 24, la diferencia con el pico es grande, luego es **resistencia**. Al aspirar sale mucha secreción espesa y el pico baja.
- Orden de búsqueda de la resistencia: tubo doblado o mordido → secreciones → agua en el circuito → broncoespasmo. Si pico y meseta están altos juntos: neumotórax, atelectasia, edema, abdomen, intubación selectiva.
- Moraleja: la alarma es la puerta de entrada a buscar la causa; ampliar el límite para que calle, lo último.

**Caso 2 · Alarma de volumen minuto bajo (PCV) con SpO₂ en descenso.**
- El volumen espirado baja de 420 a 260 mL y la curva de presión es la de siempre. El manguito marca 15; al rellenar a 20-30, el volumen se recupera.
- Orden de búsqueda de la fuga: conexión del circuito → manguito → profundidad del tubo → fuga por el drenaje torácico.
- Pista: comparar volumen inspirado y espirado; la curva de volumen que no vuelve a cero (se verá en el nivel intermedio).
- Moraleja: en PCV hay que vigilar el volumen; la alarma de volumen minuto es el salvavidas.

**Caso 3 · Hipotensión (80/40) justo tras intubar a un asmático.**
- Tras ventilar «con ganas» con la bolsa: taquicardia e hipotensión, SpO₂ conservada. Al **desconectar el circuito**, la tensión se recupera: atrapamiento aéreo (auto-PEEP) que impide el retorno venoso.
- Tres posibles: efecto vasodilatador de la sedación, auto-PEEP, neumotórax a tensión. Primera maniobra: desconectar, esperar 10-30 s a que el tórax baje, y volumen rápido; mirar a la vez los signos de neumotórax.
- Ajustes después: FR 10, I:E 1:4 o más, Vt 6 mL/kg, hipercapnia permisiva.
- Moraleja: «ventilar de más» puede matar; en obstructivos, **dar tiempo a vaciar**.
- **Es el mismo caso que Eulalia** (nuestra maqueta ya lo tiene, con más profundidad y fuentes de Marino cap. 27-28). Lo nuevo es la **lista de tres causas** y la maniobra «desconecta y espera».

### 11. Lo demás que toca [visto]
- Efectos del aire a presión en el sistema circulatorio, riñón y cerebro (menos retorno venoso, ADH, CO₂ y presión intracraneal). Es el enganche con la presión intratorácica (M8).
- PEEP: mantiene alvéolos abiertos, baja el vaivén de abrir-cerrar y, si se pasa, produce sobredistensión y caída de tensión.
- Pausas inspiratoria y espiratoria: la primera enseña la presión alveolar (meseta), la segunda la PEEP oculta; solo fiables sin esfuerzo del paciente.
- Calentamiento y humidificación (filtro humidificador frente a humidificador activo), sedoanalgesia, mejoras de oxigenación (por seguridad, no por potencia), maneras de bajar el CO₂, SpO₂ y capnografía, VNI y alto flujo.
- Todo esto queda **fuera** del pulmón (ver «¿Nos sirve?»).

## ¿Nos sirve?

Para estudiar: sí, como **repaso de orden** (aviso de lo que enseñar en qué orden); para citar: no. Casi todo lo que cuenta ya lo tenemos; lo nuevo son **cinco ideas de enseñanza**.

### Lo que ya teníamos [visto en la maqueta, deducido por comparación]
- Ecuación del movimiento, pico-meseta-PEEP, compliance y resistencia por las fórmulas de Marino (cap. 27), VCV y PCV, pausa inspiratoria y oclusión espiratoria, PEEP oculta, PBW, SDRA protector, hipercapnia permisiva.
- El caso de asma con hipotensión (Eulalia) y sus preguntas.
- Gases: capilar vivo y ácido-base vivo. Circulación: el enganche M8.

### Lo que entra, por encargo de `b3-pulmon-app`

| Idea | Dónde | Estado |
|---|---|---|
| **Dos mandos**: oxigenación (FiO₂, PEEP) y ventilación (Vt × FR) como dos palancas con su efecto en SpO₂ y PaCO₂. Preguntas «SpO₂ baja: ¿qué mando?» | Mayéutica del encargo 1; enlace al ácido-base vivo | Entra como idea de enseñanza. Cifras de gases por comprobar |
| **Lectura fija: presión → flujo → volumen**, siempre en ese orden, en el monitor común (`paw`, `flujo`, `vol`) | Encargo 1 (canales) y la guía de la Mayéutica | Entra |
| **Las cuatro decisiones del ciclo** (disparo, límite, ciclado, espiración) como rótulos del ciclo | Encargo 1; sirve de base a PSV y a las asincronías del encargo 4 | Entra como rótulos; sin cifras nuevas |
| **«Vigila el lado que no está garantizado»**: VCV vigila la presión, PCV el volumen. Pregunta «piensa antes»: «subo la resistencia en PCV: ¿qué cambia y qué alarma no suena?» | Encargo 1 (estado `normal-pcv`) y Mayéutica | Entra. Complementa la pregunta 2 de la maqueta |
| **Árbol «pico sube: ¿la meseta también?»** (resistencia o compliance) y la lista de causas **de cerca a lejos** | Mayéutica (tipo «encuentra el error») y caso del intubado que desatura (el DOPE del acta) | Entra. DOPES: comprobar en Marino |
| **Fuga en PCV: el volumen espirado baja y la curva de presión parece normal** | Encargo 4 (maniobras del tubo) o caso nuevo | Entra como estado nuevo `fuga-pcv` si la fuga cabe en el motor; fuente de Marino cap. 27 por buscar [desconocido] |
| **Mando de FR en el obstructivo: «dale tiempo a vaciar»** y la τ con la regla de 3 τ | Encargo 1 (ya hay τ ilustrativa) | Ya estaba; la regla de 3 τ, por comprobar |
| **Hipotensión tras intubar: tres causas (sedación, auto-PEEP, neumotórax) y «desconecta y espera»** | Caso de Eulalia (ya existe) y encargo 3 (M8) | Se añade como pregunta de diagnóstico diferencial; el neumotórax a tensión es el encargo 4 |
| **PSV: tres mandos (soporte, subida, ciclado)** | Encargo 1 (ciclado por flujo, ya acordado) | Ya acordado; esta clase lo confirma, sin cifras |

### Frases cortas para los casos (dichas con nuestras palabras)
- «Pico y meseta altos a la vez: es el pulmón. Solo el pico: es el tubo o el bronquio.»
- «En PCV, lo que falla se nota en el volumen, no en la presión.»
- «Hipotensión tras intubar a un asmático: desconecta y espera a que el tórax baje.»

### Lo que se descarta
- VNI, alto flujo, humidificación, sedoanalgesia, mejoras de oxigenación en lista, capnografía (fuera del modelo y de Marino cap. 22-30 en su mayor parte).
- Configuración de alarmas con rangos (el acta ya descartó la rejilla de alarmas; queda una sola alarma útil como frase del caso).
- SIMV, la tabla FiO₂-PEEP de ARDSNet y los umbrales de presión de conducción: sin fuente abierta aquí; si se quieren, primero buscar Marino / El Libro Azul.
- Texto, orden exacto de diapositivas y figuras: no se copian.
- Los niveles intermedio y avanzado (bucles P-V, presión transpulmonar, asincronías): **no están en esta clase** (solo se anuncian). Las asincronías del encargo 4 siguen con El Libro Azul IV-2 (pdf 93-94).

### Para el parte del Consejo
- Cierra el apartado de ideas de VentLoop con una segunda mirada: **sin coste nuevo** en la horquilla (las ideas son preguntas y rótulos, no piezas nuevas), salvo `fuga-pcv`, que es un estado más del encargo 1 o 4 (≈0,2-0,4 M).
- Cualquier cifra de arriba que se quiera usar: buscarla en Marino cap. 27 (`docs/marino-2024-respiratory-management-caps27-30.pdf`) o El Libro Azul IV-2 y citarla por página (CLAUDE.md §7.1-7.2).

## Lo que queda sin saber

- **Cómo dibuja las curvas** [desconocido]: no he abierto las imágenes (el texto estaba completo). Puede merecer mirar 2-3 diapositivas (13-15 y 18) si se quiere comparar con la maqueta.
- **Si Marino trae**: la presión de conducción como umbral, DOPES, la tabla FiO₂-PEEP, el peso del tubo «a la cuarta potencia», el rango de capnografía [desconocido].
- **Una fuente abierta para la fuga en PCV** (volumen espirado frente a inspirado) [desconocido].
- **Los niveles intermedio y avanzado** de la serie (bucles, transpulmonar, asincronías) [desconocido]: no los he buscado. Si salen, merecen otra revisión para el encargo 4.
- **Licencia** [desconocido]: la página no dice nada. Mientras tanto, solo ideas.
- **Cuánto de la clase es opinión del autor** [deducido]: hay reglas prácticas («fuga: primero el circuito, luego el manguito», «el pico de alarma = pico + 10») sin cita; las referencias finales son de ensayos y guías del SDRA, la VNI y el alto flujo, no de estas reglas.
