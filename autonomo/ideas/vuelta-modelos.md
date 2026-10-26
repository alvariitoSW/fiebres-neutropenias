# Vuelta de modelos · profesor (modo juzgar, solo lectura) · 25/10/2026

Lista confirmada en el código: 7 de Libros (`modelosVivos` de `libros/index.js:220`), ácido-base (`nefrologia/index.js:125`),
eco (`eco/index.js:163`), y los paneles «propios» de la vista Visual (nefrona, nefronas que quedan, glomérulo, filtro, potasio
hiper/hipo) más los receptores animados. La cama 7 (`libros/cama7.js`) no es un modelo: es la pieza común de 3 escenas.
Mecánicas de: `ritmolab-2.md` §2 y §5 (mecanismo prioritario, orden, revisión por objetivos, velocidad), `echosuite-2.md` §2-§4
(fórmula con tus números, pares, «retenido»), `maquetas/comun/monitor.js` (monitor que solo dibuja lo que le dan).

| Modelo | Ya tiene ✅ | Mecánica 1 (para estudiar, ejemplo) | Mecánica 2 | Esfuerzo | Hueco de fuente |
|---|---|---|---|---|---|
| Río y mar (`agua-viva`) | ✅ 5 pestañas, 14 preg., 3 casos, guía | **Fórmula con tus números**: «Posm ef. = 2×Na + glucosa/18 = 2×128 + …» al mover el sodio (Ec. 35.3, ya calculada en `agua-viva-data.js:35`) | **Error con consecuencia**: salino 0,9 % en SIADH o corregir demasiado rápido → la escena avisa de desmielinización | P / M | Ritmo máximo de corrección: comprobar que la ficha lo da con página |
| Capilar y oxígeno | ✅ tablero tipo monitor; SpO₂ «sin onda» → null (retenido de hecho); CaO₂/DO₂ calculados (`capilar-vivo-data.js:94`) | **Fórmula con tus números**: «CaO₂ = 1,34×7×0,97 + 0,003×90» con la Hb que eligió (anemia: ver que el 1,5 % disuelto no salva) | **Monitor común** en lugar del tablero propio | P / M | — |
| Catéter vivo | ✅ tiempo en días, lupas, 3 casos | **Pares de prueba** calibre/longitud → flujo, con la tabla del libro (cap. 1): 14 G corto frente a CVC largo | **Fórmula**: Poiseuille con tus números (r⁴/L) | P | Flujos por calibre: usar solo los de la tabla de la ficha |
| Muralla de papel | ✅ consecuencia parcial (IBP/sucralfato con su coste) | **Mecanismo prioritario**: lo que protege es la nutrición enteral; el IBP sin factor de riesgo «no cambia nada» y trae neumonía/C. difficile | **Revisión por objetivos** al final del caso (en la cama 7) | M | Cifras de riesgo: solo las de la ficha |
| Telar de la trombina | ✅ calculadora en la escena (ClCr, IMC → dosis); pestaña reloj | **Error con consecuencia**: seguir con heparina en TIH → el telar trombosa más; enoxaparina con ClCr <15 → acumula (p. 11) | **Pares de prueba** ClCr/IMC → dosis (para el juez, no para el alumno) | P | Cuánto sangra/acumula: cualitativo, sin cifra inventada |
| La inmersión | ✅ consecuencia parcial (midazolam >48 h se acumula, `inmersion-viva.js:110`) | **Mecanismo prioritario**: sedar sin analgesia no baja el BPS 9 (Andrés con FC tranquila y dolor) | **Revisión por objetivos**: BPS, RASS objetivo, CAM-ICU al cerrar el caso | M | Tiempo de despertar del diazepam (hueco ya anotado) |
| Vaso que sangra | ✅ guía por estado, 3 casos, «predice y compruébalo» | **Mecanismo prioritario**: CID → tratar la causa; plasma o plaquetas sin causa tratada no cierran la red | **Error con consecuencia**: plaquetas en PTT → más trombos | M | Comprobar que Merino/Marino lo dicen con página |
| Ácido-base vivo | ✅ «combinación no fisiológica» (`acidobase-vivo.js:1273`); Ec. 31.x visibles; 4 casos | **«Retenido» con motivo**: gasometría cuyo pH no cuadra con [H⁺] = 24×PaCO₂/HCO₃⁻ → «no interpretes, repítela» | **Pares de prueba** (gasometría → trastorno) | P | Umbral de coherencia: buscar en cap. 31 |
| Nefrona viva | ✅ 3 zooms, NTA, obstrucción, fármacos | **Mecanismo prioritario**: en la obstrucción, los fluidos no cambian la orina; en la prerrenal sí | Pares de prueba estado → FENa/orina | M | FENa por estado: solo si la ficha lo da |
| Glomérulo vivo | ✅ consecuencias (AINE + IECA + depleción) | **Fórmula con tus números**: presión de filtración = PCG − Bowman − oncótica, al mover la PAM | — | P | Cifras de presiones: fisiología general, rotular «ilustrativo» |
| Filtro de la TRR | ✅ difusión/convección/híbrida, dosis | **Fórmula**: 25 ml/kg/h × 80 kg = 2000 ml/h de efluente | — | P | — |
| Potasio (hiper/hipo) | ✅ **reloj 12 h y ×4** (`hiperpotasemia-sim.js:83`), tiempos de la tabla | **Mecanismo prioritario**: el calcio protege la membrana pero no baja el K⁺; insulina y salbutamol lo meten un rato; solo riñón, resinas o diálisis lo sacan | **Revisión por objetivos** al acabar el reloj: ECG protegido, K⁺ en zona, salida iniciada | P-M | Cuántos mEq mueve cada medida: hueco ya avisado (`:97`) |
| Circulación viva + ecógrafo | ✅ motor, Doppler con ITV y GC, EPP 300 mL y bolos (`maniobras.mjs`) | **«Retenido»**: VCI en ventilación mecánica → «no uses el colapso solo» (umbrales 12/18/40 % del Manual UMI) | **Monitor común** que lee el motor (planeado en b3) | P / G | ASE 2025 de PAD: no está en `docs/` |
| Receptores animados | ✅ 5 pasos con Motion | **Monitor común**: PA y FC que cambian por fármaco (la maqueta común ya lo prevé) | — | M | Solo cualitativo (nivel 0-3): sin cifras de PA |

**Lo que no encaja (y por qué)**
- Velocidad 1×/5×/20×: no en glomérulo, ácido-base, capilar ni receptores (son estados estables, no hay tiempo que correr); el potasio
  ya la tiene (×4) y el catéter y el telar usan días: basta lo que hay.
- «Retenido»: no en muralla, telar ni inmersión (no hay medida con calidad que pueda fallar).
- Monitor común: no en nefrona, filtro, catéter ni muralla (no tienen constantes de cabecera; sería decorado).
- Revisión por objetivos: no en glomérulo, filtro ni receptores (no tienen caso que se juegue en el modelo).
- Pares de prueba: es una herramienta del juez (`autonomo/pruebas/*.mjs`), no una mecánica que vea el alumno.
- El «orden fijo» de RitmoLab (adrenalina tras el 2.º choque) solo vale para un modelo de ritmo con fuente AHA: no hay PDF.

**Orden recomendado (más estudio por menos esfuerzo)**
1. **Fórmula con tus números como pieza común** (`js/core/`, junto a `ui.js`): un renglón «fórmula → tus números → resultado» que
   copian capilar, río y mar, glomérulo, filtro y eco. Pequeño; los cálculos ya existen.
2. **Potasio: mecanismo prioritario + revisión por objetivos**: es el que mejor encaja (tiene reloj y tabla de tiempos). Pequeño-medio.
3. **Revisión final por objetivos dentro de los casos** del motor común (`core/mayeutica-motor.js`): sirve a todos los de Libros a
   la vez (inmersión, muralla, telar, vaso). Medio; sin nota numérica, solo «cumplido / falta y por qué».
4. **Eco: «retenido» de la VCI en ventilación mecánica**: pequeño y muy de guardia.
5. **Monitor común** (`maquetas/comun/monitor.js` → `js/core/`): cuando lo pida el bloque 3; luego capilar, eco, receptores y cama 7.
La consecuencia del error (telar, vaso, inmersión) conviene como opción del motor de casos: «si eliges mal, el modelo pasa a…».

**No comprobado / riesgo**
- No abrí la app ni vi capturas: todo sale de cabeceras y grep. Lo «✅» puede estar más completo (o menos) en pantalla.
- No verifiqué en las fichas las cifras de corrección del sodio, flujos por calibre, FENa ni el umbral de coherencia de la gasometría.
- El ácido-base tiene su motor de preguntas propio: la mejora 3 no le llega sin migrarlo.
- Los casos actuales son test sobre el modelo; la consecuencia del error obliga a enlazar la opción con un estado del modelo.
