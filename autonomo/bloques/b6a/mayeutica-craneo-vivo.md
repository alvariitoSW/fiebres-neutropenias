# Mayéutica del cráneo vivo (b6a) · clave `craneo-vivo`, prefijo `crv-` · rama wt/b6a-crv
Fuente: docs/marino-2024-neurologia-caps45-47.pdf (página del PDF). Libro Azul parte 1 (LA1) y RCEM para lo que Marino no trae.
## Hecho
- Modo «Preguntas» (`#crv-modo-preguntas`) en el modelo, sobre el motor común: guía 7 (G1-G7), examen 6 (E1-E6: apuesta, 2 «encuentra el error» con 2 errores cada uno, test de apnea, «piensa y destapa», hemicraniectomía) y 2 casos reutilizados (Abundio 5 pasos, Segismundo 4). Pacientes: Abundio, Segismundo, Clotilde, Petronila, Leovigildo.
- Test de apnea (E4, Abundio día 3, PAM 77, basal 42): confirma PaCO₂ 64 (+22), no 51 a los 3 min, no 58 (+16), no 62 con basal 55 (+7); p. 15-16. Nota: Tabla 45.6 pide >60 y >20 sobre la basal; el texto p. 16 solo ≥20 (la ficha ya lo anota).
- Archivos nuevos: `js/data/craneo-vivo-mayeutica.js`, `js/modules/libros/craneo-vivo/{mayeutica,mayeutica-css}.js`, `autonomo/pruebas/craneo-vivo-mayeutica.mjs`. Tocados: `pagina.js`, `craneo-vivo.html` (botón, sección, dock de progreso), `craneo-vivo-data.js` (1 id), `pruebas/craneo-vivo.mjs`, `jueces-forma.mjs` (solo líneas del cráneo). Versión 20261101-52 (los jueces la exigen con módulos nuevos).
- Cifras de los casos = monitor de la app (la prueba las imprime). Predicción: monitor `?` hasta contestar (comprobado). «Compruébalo» en G1-G4, G6, E1, E6.
- Para equilibrar la forma: opciones falsas de los casos algo más largas (mapa `MAS`) y rotación de partida (`ROT`): larga 4, corta 4, posiciones 5/5/6/2 de 18.
## Jueces
`--forma` en verde (cráneo: 18 tests). Prueba propia a 390: TODO EN VERDE (recorrido fallando G1/G4/E3, repaso, 2 casos, desborde y «sobre el dock» tras cada respuesta). `--modelo craneo-vivo`: ver entrega.
## Frases nuevas con su página (para el auditor)
- G1 caja cerrada, el volumen añadido lo ceden LCR y sangre y luego sube la PIC; curva no lineal; en agudos no hay compensación: LA1 p. 3-5 (otra-fuente.md 1-2). PIC <20: p. 45. «Pasa de 20 / llega a 20 con masa 50»: ilustrativo.
- G2 pupila fija = masa en expansión: p. 11; «lado de la masa»: inferencia (rotulada). Puntiformes sin reacción = protuberancia; medias fijas = hígado/anoxia/muerte encefálica: p. 11.
- G3 flexión (tálamo) → extensión (mesencéfalo-protuberancia alta) → flácido (tronco bajo): p. 10; el orden como secuencia temporal: inferencia (nota M3). Retirar al dolor no es del coma: p. 10.
- G4 salino 3 % 250 mL, Na⁺ 145-155, más eficaz que manitol: p. 41 (del ictus; extrapolado al hematoma: inferencia rotulada). «Saca agua del tejido»: SIN PÁGINA (fisiología general).
- G5 hematoma crece (p. 42); vitamina K 10 mg IV + CCP (p. 44); PAS <140 (p. 44).
- G6 resangrado, PAS >140, cerrar en 3 días, nunca >7-10, tranexámico no (p. 47); vasoespasmo días 4-14 (p. 48). «la PIC sube de golpe»: ilustrativo.
- G7 cautiverio (p. 3); ojos abiertos con/sin conciencia, coma sin apertura espontánea (p. 10). «Coma metabólico no obedece»: p. 10 (coma = ni consciente ni responde).
- E1 pupila/mano: p. 10-11. E2/E3 errores: p. 47-48 y p. 42-45 (textos de la maqueta, ya con página).
- E4 apnea: preoxigenar, +20 mmHg, 3 mmHg/min, 6-7 min, riesgos: p. 16; PAM ≥75, T >36, ≥48 h: p. 15. «Con basal 55 +7 no vale»: aplicación de la Tabla 45.6 (p. 15).
- E5 vasoespasmo días 4-14 + Doppler y nimodipino 60 mg/4 h oral 3 semanas: p. 48; resangrado temprano: p. 47.
- E6 hemicraniectomía ≤60 años y ≤48 h: RCEM (web), Marino p. 40 solo la nombra tras tPA; sin sensor de PIC en ictus: p. 40.
- Sin cita aparte: «saca agua del tejido» (G4); «Na⁺ 130-135 empeora el edema» (distractor G4, p. 41 solo da 145-155); «el 3.º bolo» (G4, ilustrativo).
## Huecos / visto de paso
- Los modos Apuesta/Error/Caso viejos siguen (duplican E1-E3 y los casos): quitarlos es decisión del director.
- Los efectos de las opciones de los casos (ef.hiper, dren…) no se aplican en el motor común.
## No comprobado / riesgo
Prueba propia solo a 390 en mi última pasada (360 lo corre `--modelo`); capturas vistas: G1 y caso 1 paso 2. Los distractores de G2/G3/G7 interpretan p. 10-11 con mis palabras: que el auditor los coteje.
