# El pulmón con respirador en papel (`mv-papel-pulmon`): qué mejora entra en cada encargo de `b3-pulmon-app`
Profesor (modo diseñar), 30/10/2026. Lo lee `b3-pulmon-app` antes de cada uno de sus 4 encargos. No rehace la maqueta M3
(`autonomo/maquetas/b3-pulmon/`, aprobada) ni repite la cobertura (`cobertura-3d.md`): la concreta en cifra, tope y juez.

## Qué cambia para el residente (en 10 líneas)
1. Antes de las curvas, una **lámina de entrada** en 2D: del tórax al alvéolo y a la membrana, con 3 cifras con página.
2. El monitor responde **en la respiración siguiente**, como el respirador real, y el mismo caso da siempre lo mismo.
3. La **PEEP se entiende viéndola**: un alvéolo que se abre a una presión y se cierra a otra más baja (histéresis).
4. La **constante de tiempo** deja de ser «fisiología general»: El Libro Azul la define y dice cuántas hacen falta.
5. El **corazón que falla mejora con la CPAP** y el sano empeora, con la misma insuflación (Marino cap. 26).
6. El paciente **respira**: dispara, pelea y se desacopla. Cuatro asincronías salen del motor, no de un dibujo.
7. Un **neumotórax a tensión** que se reconoce en el monitor y en la PA, y se descomprime en el sitio que dice Marino.
8. Ante un pico alto, la pregunta fija: **¿subió también la meseta?** (tubo o pulmón).
9. Dos palancas que no se mezclan: **oxigenar** (FiO₂, PEEP) y **ventilar** (Vt × FR).
10. Cada cifra lleva su rótulo: `ficha`, `fisiología general` o `ilustrativo`. Las de VentLoop, Antaa y Techartist, nunca.

## 0. Reglas de lectura de este informe
- «Idea de X (no fuente)»: VentLoop, Antaa o Techartist aportan la idea de enseñanza; la cifra sale de la columna fuente.
- **Páginas**: «pdf N = p. M». Los extractos de Marino (`docs/marino-2024-respiratory-management-caps22-26.pdf` = **M22**,
  `…caps27-30.pdf` = **M27**) **no llevan folio impreso** (comprobado con `pdftotext` en pdf 2-4, 11, 28 y 85): se cita la
  página del PDF, como ya hacen las fichas. El Libro Azul sí: **LA1** (`…parte1.pdf`) p. = pdf + 384; **LA2** (`…parte2.pdf`)
  p. = pdf + 464; **LA3** (`…parte3.pdf`) p. = pdf + 564 (comprobado en pdf 3, 12 y 30 de cada parte).
- Juez: **J** = `node autonomo/jueces.mjs --modelo pulmon-vivo` (prueba `autonomo/pruebas/pulmon-vivo.mjs`, a crear);
  **T** = su ajuste en `autonomo/jueces-topes.mjs`; **N** = prueba Node del motor (como `maquetas/b3-pulmon/pruebas.mjs`);
  **P** = profesor en modo juzgar; **A** = auditor ciego (cifras y páginas).
- Coste en M (millones de tokens), incremental sobre lo que la fila 10 ya contaba para cada encargo.

## 1. Encargo 1 · el ciclo y los canales `paw`, `flujo`, `vol`
Base (ya en la fila 10 y en M3): motor de 1 compartimento (`pulmon.mjs`), VCV/PCV, pausa y oclusión; `js/core/monitor.js`
**ya exporta** `canalesRespiratorios()` (paw 0-60, flujo ±120, vol 0-1000): la parte «monitor común» del encargo es menor
de lo que decía la cobertura §2. Base ≈3,0 M.

| Mejora | Idea de | Fuente clínica | Tope / cifra objetivo (origen) | La estrena | Juez | M | Prioridad |
|---|---|---|---|---|---|---|---|
| **Cambio en la respiración siguiente**: un mando movido a mitad de ciclo entra al empezar el siguiente | VentLoop §7.4 (no fuente) | fisiología general (así funciona el aparato; no es cifra clínica) | — | Mayéutica «piensa antes»: «subes la PEEP en plena inspiración: ¿cuándo cambia la curva?» | N (un cambio a t = Ti/2 no altera el ciclo en curso) | 0,15 | entra |
| **Semilla fija**: la variación entre respiraciones (si la hay) es reproducible | VentLoop §7.4 (no fuente) | — (técnica) | variación ilustrativa, rotulada | todos los casos (dan lo mismo cada vez) | N (dos corridas iguales, mismas cifras) | 0,05 | entra |
| **Lectura fija presión → flujo → volumen** y las **4 decisiones del ciclo** (disparo, límite, ciclado, espiración) como rótulos | Antaa §5 y «¿Nos sirve?» (no fuente) | M27 pdf 2 (Fig. 27.1), pdf 8-9 (disparo) | sin cifras nuevas | Guía del estado `normal-vcv` | P | 0,1 | entra |
| **Constante de tiempo con fuente**: τ = Cstat × R; un alvéolo se llena o vacía un 63,2 % en una τ; **4-5 τ eliminan la auto-PEEP** | VentLoop §3.1; Antaa §3 (no fuente) | **LA2 pdf 50-51 = p. 514-515** (antes «fisiología general»: REGLAS §1.15) | par: R 20, C 60 → τ 1,2 s; Te < 4 τ → flujo final ≠ 0 | Mayéutica: «FR 24 con τ 1,2 s: ¿cabe la espiración?»; caso Eulalia | N + A | 0,1 | entra |
| **Rohrer (R₂·Q²) con PSV**: la presión resistiva crece con el cuadrado del flujo; en PSV el flujo se despeja de la ecuación | VentLoop §3.1, §7.2 (no fuente) | fisiología general (Rohrer); **hueco** de cifra: LA2 pdf 26 (= p. 490) solo trae la referencia bibliográfica, no R₂; Marino no da R | R₂ ilustrativo, rotulado; tope del flujo 120 L/min (canal) | estado `psv-disparo`: corte al **25 % del flujo pico** (M22 pdf 78) | N (pico de VCV a 80 L/min > a 60 con igual Vt) | 0,4 | si sobra (el lineal ya da las curvas de Marino) |
| **PSV con ciclado por flujo** | Antaa §7 (no fuente) | M22 pdf 78-79 (25 % del pico; Fig. 26.2); M27 pdf 8 | disparo por presión negativa de 2 a 3 cmH₂O (M27 pdf 8); por flujo 1-10 L/min (M27 pdf 9) | ficha 10 `neumo-vni-metodos`; caso Herminia | N + J | 0,4 | entra |
| **«Vigila el lado que no está garantizado»** (VCV vigila presión; PCV, volumen) | Antaa «¿Nos sirve?» (no fuente) | M27 pdf 2-4 (en PCV el Vt baja si baja la compliance) | par: PCV 10/5, C 60 → Vt ≈ 600; C 19 → ≈ 190 (ya en M3) | «piensa antes»: «subo la resistencia en PCV: ¿qué cambia?» | N | 0,05 | entra |
| **Dos mandos**: oxigenar (FiO₂, PEEP) frente a ventilar (VM = Vt × FR) | Antaa §2 (no fuente) | M27 pdf 10-12 (PEEP y P/F); VM = Vt × FR: fisiología general trivial; PaCO₂ de la ficha (M22 pdf 49-50, hipercapnia permisiva 60-70) | sin cifra nueva de gases (ilustrativo, rotulado) | «SpO₂ 86 %, PaCO₂ 40: ¿qué mando tocas?» | P | 0,1 | entra |
| **Árbol «pico sube: ¿y la meseta?»** (resistencia o compliance) | Antaa §9-10 (no fuente) | M27 pdf 3-4 (Ec. 27.1-27.3: pico − meseta = Pres; meseta = Pel) | par: pico 28 → 42 con meseta 24: resistencia (ilustrativo) | «encuentra el error» (0-2 errores) del caso Rafael | N + P | 0,15 | entra |
| **Calculadora PBW, ΔP y Cstat** en el mismo sitio | VentLoop §7 «lo que cambiaría» 4 (no fuente) | PBW: M22 pdf 48 (Tabla 24.5) = M27 pdf 13-14 (Tabla 27.1); Cstat: M27 pdf 6-7 (50-80; <25; tubuladura 3 mL/cmH₂O); ΔP = meseta − PEEP: **sin objetivo** (Marino no lo da; cobertura §6) | Cstat corregida por tubuladura (ya en M3) | ficha 12; caso Isidro (576 mL = 6 × peso real) | N (Isidro 1,75 m → 70,5 kg) | 0,3 | entra (va con `js/data/ventilacion-data.js`) |

## 2. Encargo 2 · el racimo de alvéolos
Base: 12-16 alvéolos dibujados con tres poblaciones (abiertos, que abren y cierran, sobredistendidos). Base ≈2,5 M.

| Mejora | Idea de | Fuente clínica | Tope / cifra objetivo (origen) | La estrena | Juez | M | Prioridad |
|---|---|---|---|---|---|---|---|
| **Histéresis de apertura y cierre** con **1 compartimento** (o ≤4 unidades), no 64: cada unidad se abre por encima de su presión de apertura y se cierra por debajo de una de cierre **más baja**; cierra la nota `peep-lineal` | VentLoop §3.2, §7.3 (no fuente) | **LA1 pdf 66-67 = p. 450-451** (abrir pide más presión que sostener abierto: «histéresis»; abrir y cerrar ~30 000 veces al día); **LA2 pdf 86-87 = p. 550-551** (Fig. 19: puntos de inflexión inferior y superior; Amato: PEEP 2 cmH₂O por encima del inferior; el colapso empieza en la espiración por debajo del punto de máxima curvatura); M22 pdf 27 (Fig. 23.4: asas de histéresis) | presiones de apertura y cierre **ilustrativas**, rotuladas; PEEP 0-20 (M27 pdf 10: 5-10 evita el colapso, 10-20 abre lo colapsado) | estado `atelectrauma-zeep` y `mejor-peep`; «piensa antes»: «PEEP 5 → 12: ¿qué le pasa al alvéolo que se cerraba?» (Techartist §6.3) | N (ver pares §6) + J | 0,8 | entra |
| **Atelectrauma visible**: la población que abre y cierra cada ciclo, con su nombre | — | M22 pdf 48 (atelectrauma: cizalla al abrir y cerrar; la PEEP lo evita) | sello «abre y cierra cada ciclo» cuando PEEP < cierre (ilustrativo) | ficha 6 `neumo-sdra-ventilacion` | J | 0,1 | entra |
| **Índice de estrés** (curva de presión cóncava, recta o convexa en VCV) | — | LA2 pdf 87 = p. 551 (Ranieri; Fig. 20). **Errata**: la fuente dice «convexa» en los dos casos (<1 y >1): nota de fidelidad | sin cifra (forma) | — | A | 0,3 | no entra: un segundo indicador de la PEEP antes de que el residente domine el primero (la ΔP de la Fig. 27.5) |
| Unidades con peso (gradiente boca arriba/boca abajo) para el prono | VentLoop §3.2 (no fuente) | M22 pdf 38, 43-45 (Fig. 24.3; prono) | — | estado `prono` | — | 1,0 | no entra: con 1 compartimento el prono va como dibujo del racimo que gira (ya en la cobertura) |

## 3. Encargo 3 · enganche a la presión intratorácica (M8) y la CPAP que sube el gasto del corazón que falla
Base: entrada `pPleural(t)` del motor del latido, una vez (cobertura §2). Base ≈2,0 M. **La pieza aprobada el 30/10:**

| Mejora | Idea de | Fuente clínica | Tope / cifra objetivo (origen) | La estrena | Juez | M | Prioridad |
|---|---|---|---|---|---|---|---|
| **CPAP que sube el gasto del corazón que falla**: la misma insuflación sube el VS del ventrículo que falla (le quita poscarga) y baja el del sano o hipovolémico (le quita precarga) | Antaa §11 (no fuente) | M22 **pdf 83** (EAP: la presión positiva sube el VS por menos poscarga del VI), **pdf 85** (Fig. 26.6), **pdf 86** (Fig. 26.7, precarga; la hipovolemia lo agrava), **pdf 87** (Ec. 26.1: poscarga = P cámara − P pleural), **pdf 88** (corazón normal: curva de precarga empinada; corazón que falla: curva de poscarga empinada); M27 pdf 10 (VPP sube el GC; IMV lo baja en disfunción del VI); 2.ª fuente LA2 pdf 39-41 = p. 503-505 (retorno venoso y PEEP, Fig. 9) | CPAP 5-10 (M22 pdf 77); tope 20 cmH₂O = PEEP máx. de M3 (M27 pdf 10); en el sano, al pasar de ~15, el GC baja y el sello «la PEEP le quita el llenado» (Fig. 27.6, M27 pdf 12); cifras de VS **ilustrativas** | caso Herminia (EAP, CPAP 10): giro «quítale la CPAP, que la PA ha subido» | J (la VS sube con CPAP en FEVI baja y baja en volemia baja) + P | 0,6 | entra (aprobada) |
| **Pulso paradójico**: Ppl muy negativa (asma) baja la PAS en inspiración >10 mmHg | — | M22 pdf 87 (>10 mmHg; discrepancia ya anotada con p. 16: 12) | umbral 10 mmHg con la nota de fuentes | caso Eulalia | A | 0,15 | entra |
| **Hipotensión tras intubar a un asmático: tres causas** (sedación, auto-PEEP, neumotórax) y «desconecta y espera» | Antaa §10 caso 3 (no fuente) | auto-PEEP y PVC falsa: M27 pdf 31-32 (Fig. 28.9); neumotórax: M27 pdf 28-29. «Desconectar y esperar 10-30 s»: **hueco** (Marino no lo dice; buscar en guía antes de usarlo, REGLAS §1.15) | — | pregunta de diagnóstico diferencial en el caso Eulalia | P | 0,2 | entra sin la cifra de 10-30 s |
| **PEEP ↑ → GC ↓** aunque suba el P/F | — | M27 pdf 12 (Fig. 27.6; DO₂ = GC × CaO₂) | PEEP 4 → 20 | caso Isidro («PEEP 18 porque sube el P/F»; ScvO₂ 58) | J | 0,1 | entra |

## 4. Encargo 4 · el paciente que respira, maniobras, asincronías y neumotórax a tensión
Base: esfuerzo del paciente, oclusión, cuff y aspiración (cobertura §3). Base ≈3,0 M.

| Mejora | Idea de | Fuente clínica | Tope / cifra objetivo (origen) | La estrena | Juez | M | Prioridad |
|---|---|---|---|---|---|---|---|
| **Esfuerzo del paciente (Pmus)** en la ecuación del movimiento | VentLoop §3.3, §7.2 (no fuente) | **LA2 pdf 47 = p. 511** (Pmus + Pvent = flujo × R + Vt/C + PEEP); LA3 pdf 25 = p. 589; PImax −120/−84, amenaza a −20/−30: M27 pdf 58 | Pmus 0-15 cmH₂O **ilustrativo** (aviso a 12); con Vt ≥ 9,5 mL/kg PBW, sello **P-SILI** (M22 pdf 40-42, Fig. 24.4) | estado `p-sili`; caso Elvira | T + J | 0,6 | entra |
| **Esfuerzo ineficaz**: el paciente empuja y no dispara (la más frecuente) | VentLoop §3.3 (no fuente) | LA2 **pdf 93 = p. 557**; M27 pdf 8 (con disparo por presión ~1/3 de los esfuerzos no dispara); con auto-PEEP, M22 pdf 27 | umbral de disparo presión negativa de 2 a 3 cmH₂O (M27 pdf 8) | «¿qué asincronía ves?» con la curva | N + P | 0,3 | entra |
| **Doble disparo**: dos inspiraciones en menos de la mitad del Ti | VentLoop (no fuente) | LA2 **pdf 94 = p. 558** (Fig. 27, en presión control) | Ti neural > Ti del respirador (ilustrativo) | Mayéutica: «Vt real doble: ¿protector?» | N + P | 0,25 | entra |
| **Disparo inverso**: el esfuerzo llega tras la insuflación; riesgo de sobredistensión | VentLoop (no fuente) | LA2 pdf 94-95 = p. 558-559 (Hering-Breuer, en investigación: rotular así) | — | caso Isidro sedado | N + P | 0,25 | entra |
| **Autodisparo** (por fuga o latido) | VentLoop (no fuente) | M27 **pdf 9** (fugas → autodisparo con disparo por flujo); LA2 pdf 94-95 (autodesencadenante; el latido imita esfuerzos) | — | «encuentra el error»: «sube la sedación» | P | 0,15 | si sobra |
| **Asincronía de flujo** (flujo insuficiente: presión cóncava) | — | LA2 pdf 93-94 = p. 557-558 | flujo 60 → ≥80 L/min (M27 pdf 14) | caso Benito | P | 0,2 | si sobra |
| **`fuga-pcv`**: el Vt espirado baja y la presión parece normal | Antaa §10 caso 2 (no fuente) | M27 **pdf 22** (fuga del cuff: la mide el respirador; cuff ≤25 cmH₂O al corregir; nota mmHg/cmH₂O ya anotada) | Vt espirado < inspirado; fuga >110 mL (M27 pdf 59, prueba de fuga, otro uso: no mezclar) | caso nuevo o Rafael | J | 0,3 | si sobra |
| **Neumotórax a tensión** como escena aparte (decisión del usuario) | VentLoop §3.4 (no fuente) | M27 **pdf 27-29**: hipoxemia o hipotensión inexplicadas en el ventilado (pdf 28), Fig. 28.7 real, aguja 14 G de 8 cm en el 5.º EIC por delante de la línea axilar media (pdf 29) | presión del neumotórax crece cada ciclo **ilustrativo**; tope = sello «neumotórax a tensión: sin gasto» con PA y SpO₂ que caen (M8); se desbloquea solo la descompresión | caso Rafael (error: «2.º EIC medioclavicular con 5 cm») | T + J | 0,6 | entra |
| **Pico y meseta suben juntos en el neumotórax** | Antaa §9 (no fuente) | **hueco**: Marino pdf 27-29 no lo dice; se deduce de Ec. 27.1-27.3 (M27 pdf 3-4). Buscar fuente (REGLAS §1.15) antes de escribirlo como frase | — | árbol pico/meseta (encargo 1) | A | 0,05 | entra como deducción rotulada, hasta tener cita |
| **DOPE(S)** como lista | VentLoop §7, Antaa §9 (no fuente) | **hueco**: no está en M22, M27 ni LA (grep) | — | — | A | 0,1 | no entra hasta tener cita |

## 5. Lámina de entrada (Ley de Ciencia, art. 6) · tórax → alvéolo → capilar, en 2D
| Mejora | Idea de | Fuente clínica | Tope / cifra objetivo (origen) | La estrena | Juez | M | Prioridad |
|---|---|---|---|---|---|---|---|
| **Viaje de escala en 4 láminas** con un anillo o una regla de nivel (tórax, vía aérea, alvéolo, membrana y capilar) y la receta de sala (5 frases → un gesto → 2 tarjetas) | Techartist §2, §6.1-6.3 (no fuente); **2D**, sin three.js (Techartist §6.4) | Vt 500 = 150 espacio muerto + 350 al alvéolo: **LA1 pdf 5 = p. 389**; membrana ~0,6 µm y 50-100 m²: **LA1 pdf 6 = p. 390** (Figs. 3-4, pdf 7 = p. 391); foto real Fig. 24.1 (M22 pdf 34, ya en `neumologia/img/`); HFNO lava el espacio muerto: M22 pdf 64-65 | sin cifras de tamaño de alvéolo (**hueco**: ni Marino ni LA dan diámetro ni número); la «pista de bádminton» de Techartist, no | Mayéutica «piensa antes»: «Vt 300 a FR 30: ¿cuánto llega al alvéolo?» (VM alveolar con 150 de espacio muerto) | P + A | 2,5 | entra (recortada a 2,5 de los 2,5-3,5 de la fila 10) |
| Nota de fidelidad: LA dice «0,6 µm **de diámetro**» para el grosor de la membrana | — | LA1 pdf 6 = p. 390 | se reproduce con nota | — | A | 0,02 | entra |

## 6. Suma de costes, pares de paciente posible, descartes y riesgos
**Suma** (M): base 3,0 + 2,5 + 2,0 + 3,0 = 10,5. Mejoras que **entran**: encargo 1 = 1,4; 2 = 0,9; 3 = 1,05; 4 = 2,05;
lámina = 2,52 → **7,9**. Total con lo que entra: **≈18,4 M**, por encima de la horquilla 12-18. Para caber, **recorte
propuesto**: neumotórax a tensión sobre el M8 del encargo 3, sin corazón propio (−0,2), y lámina a 3 niveles en vez de 4
(−0,4) → **≈17,8 M**. Lo «si sobra» (Rohrer 0,4; autodisparo 0,15; asincronía de flujo 0,2; `fuga-pcv` 0,3 = 1,05) **no
cabe**: queda para la parada 2 del 3D, donde el usuario decide la horquilla. Riesgo: sin margen; si el encargo 1 se pasa, cae primero la lámina.

**Pares que la prueba del modelo (N y J) debe pasar** (los tres primeros, ya verdes en `maquetas/b3-pulmon/pruebas.mjs`):
1. Normal: C 60, R 5, Vt 500 a 60 L/min, PEEP 5 → Pres ≈ 5, pico ≈ 18, meseta ≈ 13, Cstat ≈ 57 (M27 pdf 3-7).
2. SDRA: C 20, Vt 400, PEEP 5 → meseta ≈ 25; Isidro C 19, PEEP 10, Vt 420 → meseta ≈ 32, con 352 → <30 (M27 pdf 4, 14).
3. Broncoespasmo: R 20, FR 24 → flujo final ≠ 0, oclusión 5-8 (ilustrativo); FR 12, flujo 80 → vuelve a ≈0 (M27 pdf 31-32).
4. τ: R 20 × C 0,06 L/cmH₂O = 1,2 s; con Te ≥ 4-5 τ (≈5-6 s) la auto-PEEP es ≈0 (LA2 pdf 50-51 = p. 514-515).
5. Histéresis: a igual presión, el volumen en la rama espiratoria ≥ el de la inspiratoria; PEEP 0 con cierre ilustrativo
   8 → la unidad cierra cada ciclo y la Cstat baja; PEEP 2 por encima del punto inferior → abierta (LA2 pdf 87 = p. 551).
6. PSV: la inspiración termina al 25 % del flujo pico (M22 pdf 78).
7. CPAP 10: VS sube en FEVI baja; baja en normovolémico sano y más en hipovolémico (M22 pdf 85-88).
8. Asincronías: el esfuerzo ineficaz no da Vt; el doble disparo da ~2 Vt en < Ti/2 entre ambos (LA2 pdf 93-94).
9. Neumotórax: PA y SpO₂ caen con la presión intrapleural; tras la descompresión se recuperan (M27 pdf 28-29).
10. Topes (T): Vt 4-12 mL/kg PBW, PEEP ≤20, meseta 30, Pmus ≤15, CPAP ≤20: cada uno con sello y frase.

**Descartado**: 64 unidades y presión esofágica (VentLoop §3.2-3.3: caro, sin fuente en Marino para el balón); rejilla de
alarmas con rangos (VentLoop §5; ya descartada en acta); objetivo de presión de conducción (Marino no lo da: cobertura §6);
tabla FiO₂/PEEP (ARDSnet; solo enlace al Manual UMI); SIMV/PRVC como modos (Antaa los descarta; Marino solo IMV, pdf 9-10);
humidificación, sedoanalgesia y capnografía (Antaa); 3D real (Techartist §6.4); cifras de VentLoop (8 cmH₂O/L/s, Ecw 5,
×3,5 del broncoespasmo) y de Techartist (6 O₂/s, 70 m²) como cifra visible; el índice de estrés (§2).

**No comprobado / riesgo**
- No abrí la app ni hice capturas; los costes son estimación por analogía con M3 (49 comprobaciones en ≈100 pasos).
- Páginas de la cobertura con desfase de 1: disparo por presión es **M27 pdf 8** (no 7), flujo 1-10 L/min **pdf 9**,
  meseta ≤30 **pdf 4** (no 5), atelectrauma **M22 pdf 48** (no 47). Las fichas que citen 7 o 47 deben revisarse (A).
- Comprobado con `pdftotext`: P-SILI 9,5 mL/kg (M22 pdf 41), HFNO 30 % del Vt (pdf 65) y 40-60 L/min (pdf 64-66), CPAP
  5-10 (pdf 76-77). La CPAP «≤20» del tope es la PEEP máxima de M3, no una cifra de Marino para la CPAP.
- La 2.ª fuente de la CPAP (LA2 pdf 39-41) trata retorno venoso y precarga; no la leí entera para la poscarga del VI.
- «Desconecta y espera 10-30 s», «pico y meseta suben en el neumotórax» y DOPE: huecos; buscar antes de escribirlos.
