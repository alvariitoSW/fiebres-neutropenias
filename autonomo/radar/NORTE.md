# Radar · el norte

Fijo. Todo lo que entra al Radar se mide contra esto. Cambia solo si el usuario lo decide. Origen: aceptado el
23/10/2026 («todo lo que has puesto estoy de acuerdo»); detalle en `docs/historial/radar.md` §2-3.

## El norte (cita literal, `docs/historial/radar.md` §2)

> Que un R1 de UCI entienda y maneje al paciente crítico: en la cama, la respuesta en 30 segundos desde el móvil;
> para estudiar, el mecanismo que se ve y preguntas que obligan a pensar; todo fiel a su fuente con página, en español.

Añadido del usuario (23/10): mejorarlo y **abrir la puerta a seguir mejorándolo** conforme avanzan la IA y la tecnología.

## Tres niveles, cada uno con su puerta

1. **Estudiar** · puerta: modelos vivos, fichas y Mayéutica. Lo estudiado en las webs (eco, arritmias, ETE,
   coronarias, TC) se rehace sobre nuestros motores.
2. **Ayudar en la guardia** · puerta: «Guardia» en la raíz (decidido el 25/10). El usuario mete las medidas de la eco
   (teclea o dicta); la app calcula con grado, fórmula y coherencia entre medidas, y el motor muestra «su paciente»
   latiendo. Todo en el teléfono, sin guardar.
3. **Asistente con IA** · puerta: la que decida el usuario. Modelos abiertos que leen imagen (candidato:
   NV-Reason-CT; los MONAI / VISTA-3D siguen **sin verificar**). Decidido el 25/10: **solo en el teléfono hasta nueva
   decisión**; el servidor o la GPU no están aprobados.

## Vigía tecnológico

Cada avance de IA o de técnica entra como una entrada más en `ENTRADAS.md` y se tría contra este norte. Las webs ya
estudiadas se revisan por su «huella» (pesos y nombres de archivo anotados en cada informe de ingeniería inversa).

## La vara de medir: siete situaciones de guardia (G1-G7)

Del megaproyecto «La UCI en el bolsillo» (25/10/2026; G7 añadida por el usuario el 30/10/2026, artículo 12 de la
reforma, acta `autonomo/consejo/2026-10-29-reforma.md` §4). Una idea sirve si ayuda a resolver una de ellas.
- **G1 Shock e hipotensión**: cadena VCI → PAD → VS → GC → E/e′ → VExUS, cada paso con su fórmula.
- **G2 Arritmia inestable y paro**: algoritmo paso a paso, SYNC y energía, marcapasos, paro con reloj.
- **G3 Dolor torácico y SCA**: vaso → derivaciones → pared del VI → complicación; leer un informe de cateterismo.
- **G4 Tras colocar un dispositivo**: orden de lectura de la placa, punta del tubo o de la vía, neumotórax.
- **G5 Neurocrítico**: TC de cráneo en 5 preguntas (sangre, línea media, cisternas, ventrículos, hernias).
- **G6 Quirófano cardíaco y ETE**: qué vista pedir, su ángulo y lo que se ve; banco de la mitral.
- **G7 Paciente ventilado**: asincronías, SDRA y destete.

**Recurso de estudio puro** (mismo artículo): un recurso que solo sirve para estudiar (nivel 1) puede entrar aunque no
resuelva ninguna G; se tría por el norte (el mecanismo que se ve, fiel a su fuente), no por la vara.

## Datos de pacientes (decidido el 23/10/2026; `docs/historial/radar.md` §3)

- **Sin guardar y sin identificar**: se calcula con medidas sueltas, sin nombre, en el teléfono.
- Imágenes reales: solo anonimizadas y procesadas en el dispositivo o en un ordenador del hospital; a un servicio de
  IA externo, no. La herramienta es apoyo; el médico es el responsable.
- **«Alimentar a Claude» con imágenes de pacientes: descartado** (usuario, 23/10: «lo de alimentar a Claude lo
  olvidamos»). «Mejorarse» = que la app crezca con una biblioteca de casos anonimizados o abiertos.

## Lo que NO queremos

Del encargo B-012 (marcado «supongo» el 23/10; el usuario lo aprobó entero el 25/10):
- Acumular proyectos sueltos y abrir 10 frentes a la vez.
- Construir sin pasar por el norte («está chulo» no basta).
- Meter código, textos o imágenes ajenos (ideas y método, sí). Sin sus librerías, cuentas, servidores ni analítica.
- Dar por fuente un tuit o una web. Sus cifras sirven para saber qué buscar, nunca como fuente.
- IA en un servidor con datos de pacientes, ni nada que rompa «sin backend» sin decisión expresa del usuario.

## Cómo se tría una entrada

Ficha de triaje (`LEEME.md`) → ¿a qué nivel y a qué G sirve (o es estudio puro)? ¿qué fuente en PDF la respalda? → veredicto: integrar en
una fase de `HOJA-DE-RUTA.md`, idea suelta o descartar con motivo. Las decisiones van al usuario por tandas semanales.
