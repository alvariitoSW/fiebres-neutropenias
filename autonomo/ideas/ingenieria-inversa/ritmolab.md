# RitmoLab (Farmacotips) · ingeniería inversa · 23/10/2026

Recorrido a 390×844 (Playwright, táctil), 5 escenarios en Simulación y Estudio, y lectura en memoria de su programa (sin source maps: 404; trozos leídos alrededor de nombres clave). Nada suyo guardado. Etiquetas: **visto** (dónde), **deducido**, **no visto**.

## 1. Qué es
- Simulador docente de arritmias para adultos, en español: 17 escenarios (TSV, FA rápida, flúter 2:1, FA preexcitada,
  TV estable/inestable, torsades, FV, TV sin pulso, bradicardia sinusal, BAV completo, Mobitz II, Mobitz I, asistolia,
  AESP, taquicardia sinusal, extrasístoles). Visto: portada y menú.
- Cada caso: paciente 3D, monitor (ECG II, FC, SpO₂, PA/PAM, pletismografía, FR, EtCO₂, T.ª), valoración a pie de cama,
  historia, ECG de 12 derivaciones con «lectura guiada», laboratorio e imagen (con retraso de 20 y 45 s), farmacia
  (14 fármacos con mecanismo y riesgo), desfibrilador/marcapasos, evolución (FC y PA cada 5 s) y revisión final.
- **Estudio** = Simulación + la «Ruta de manejo» visible (5 pasos con su guía; «Ir al siguiente paso»). En Simulación
  la ruta desaparece; el motor es el mismo. Velocidad 1×/5×/20×.
- Aviso (visto, «Guías y alcance»): «17 escenarios ficticios… maniquí 3D procedural, ECG sintético y respuestas
  simplificadas. No es un dispositivo médico… requiere revisión clínica experta». Sin aval de AHA/ACC/HRS.
  Fuentes que enlaza: AHA 2025 (SVA, taquiarritmia con pulso, cardioversión, paro, bradicardia), ACC/AHA/ACCP/HRS
  2023 FA, ACC/AHA/HRS 2015 TSV, ACC/AHA/HRS 2018 bradicardia, medidas de calidad FA 2026. Revisión: 06/09/2026.

## 2. Cómo está hecho
- **Tecnología** (visto): «vinext» (reimplementación de Next.js sobre Vite/rolldown con React Server Components),
  React, Base UI + Tailwind. Un trozo de 875 kB con todo, incluido **three.js r185**. ECG en Canvas 2D; pletismografía
  en SVG; pitido con WebAudio. Solo guarda el tema en `localStorage`; exporta la sesión en JSON. Analítica Google Tag
  Manager y Cloudflare Insights (bloqueadas por nuestro proxy). Registra herramientas WebMCP (`registerTool`) para que
  un agente de IA arranque casos. Sin desbordamiento a 390 px; el ECG de 12 (lienzo de 640 px) se corta en su tarjeta.
- **Generador de ECG: dos capas, reglas por ritmo, no un modelo de activación** (visto en el código):
  1. *Calendario de latidos*: una función da, para cada ventana de 1 s (con caché), la lista de sucesos «P», «QRS»
     y «P retrógrada», cada uno con su hora, anchura, RR, QT (QTc·√RR, Bazett, tope 0,65 s), «ancho» y «morfología».
     Cada ritmo es una regla: sinusal/bradi/TSV/TV/estimulado, periodo fijo; **flúter**, aurícula a 0,2 s (300/min) y
     conducción = redondeo de 300/FC; **Mobitz** en ciclos de 4 P con la 4.ª bloqueada, PR fijo 160 ms (II, QRS 140 ms)
     o 160→240→290 ms (Wenckebach); **BAV completo**, P a 80/min independientes y escape ancho a la FC; **TV**, P
     disociadas cada 0,83 s; **extrasístoles**, una cada 4 ciclos; **FA, WPW y torsades**, RR sacados de una serie
     fija de 30 000 intervalos entre 0,58 y 1,42 × el RR medio, hecha con un «azar» determinista (hash con seno).
  2. *Forma*: P y T son jorobas seno²; el QRS es una plantilla de tramos rectos (estrecha o ancha). Derivaciones de
     miembros: calculan dos números (I y II) y sacan III, aVR, aVL y aVF con las fórmulas de Einthoven/Goldberger.
     Precordiales: una tabla fija de amplitudes V1-V6 (progresión de R «simplificada», lo dicen). Fondo de FA = suma de
     dos senos; flúter = diente de sierra; **FV** = suma de senos a 22-64 rad/s mezclados por derivación; **torsades** =
     QRS ancho cuyo eje gira con el tiempo (coseno/seno de 1,1·t); **WPW** = subida lenta tipo delta, eje y anchura
     (130-200 ms) al azar por latido; **marcapasos** = espiga de 6 ms antes del QRS ancho. **Sin ruido ni artefacto de
     compresiones** (no visto en lo leído). El monitor guarda 30 s de II a 500 Hz en un anillo y reescala el tiempo al
     cambiar la FC para no romper el trazo. Los intervalos que muestra son nominales (tabla fija), no medidos.
- **Máquina de estados** (visto): un solo objeto «estado» (ritmo, FC, pulso, PAS/PAD, SpO₂, FR, EtCO₂, QTc, vía IV,
  parches, SYNC, energía, marcapasos, RCP y segundos, choques, dosis, efectos en curso, objetivos hechos, errores,
  historia, registro). Dos funciones: *tick* (cada intervalo, copia el estado y avanza) y *acción*.
  - Fármaco = «efecto» con inicio, duración (adenosina 8 s), éxito y ritmo/FC destino; las constantes van **en línea
    recta** hacia unas normales fijas (118/74, SpO₂ 97, FR 17, EtCO₂ 36). Adenosina en TSV: pausa (PA 82/48) entre el
    20 % y el 100 % de la ventana y luego sinusal a 82. En FA/flúter: frena a 55/50 y vuelve.
  - Reglas de error (cada una suma un error y avisa): bloqueador nodal o amiodarona en WPW → FV; amiodarona o
    procainamida en torsades → QTc +50; diltiazem/metoprolol con IC, BAV o PAS<90 → PA −28; dosis de paro con pulso →
    hipotensión; mezclar antiarrítmicos; límites de dosis e intervalos.
  - Eléctrica: sin parches, nada; asistolia/AESP no se descargan; FV/torsades/sin pulso exigen SYNC apagado; descarga
    no sincronizada sobre ritmo organizado → FV; FC<130 → «no indicada»; FA/flúter estable → aviso de anticoagulación;
    energía mínima 200 J (sin pulso, FA, flúter, WPW) o 100 J; 2 min de RCP entre choques. Marcapasos solo en bradi,
    BAV completo y Mobitz II; captura si corriente ≥70 mA. RCP: EtCO₂ sube 0,15/s hasta 23. **RCE** a los ≥120 s de RCP
    si se cumplió la lista (desfibrilable: ≥3 choques + adrenalina + amiodarona/lidocaína; no desfibrilable: causas +
    adrenalina). Caso hipotenso sin tratar: a partir de 150 s la PAS cae 0,08/s hasta 40 → paro. Torsades recurre si
    no se pone magnesio. Todo determinista («desenlaces didácticos y deterministas»).
- **Paciente 3D**: maniquí procedural (esferas, cilindros y un torso torneado), órbita táctil y partes tocables
  (tórax, piel, pulso, pupilas); los botones Conciencia/Pulso/Tórax/Perfusión devuelven frases según el estado.
- **Monitor**: pletismografía = dos gaussianas (sístole y dícrota) al ritmo de la FC; plana sin pulso. EtCO₂ solo
  número. Eco = esquema SVG de 4 cámaras que late según la FE. Rx reales de Wikimedia, ajenas al caso.
- **Revisión y puntuación** (visto): 100 × objetivos hechos ÷ objetivos − 8 por error; diagnóstico elegido en un
  desplegable; razonamiento del caso, la ruta con sus referencias y «decisiones para revisar». TSV con adenosina sin
  pasar por «evaluar» ni Valsalva: 50/100.

## 3. Ellos frente a nosotros
| | RitmoLab | Maqueta b3-ritmo (corazón eléctrico) | Motor del latido (eco) |
|---|---|---|---|
| ECG | Reglas por ritmo + plantillas; 12 derivaciones | **Generado**: grafo de conducción con sucesos, cada trozo de músculo suma su frente proyectado; solo II, V2, V3 | No tiene ECG propio |
| Mecanismo visible | Ninguno (el ECG es un dibujo) | Onda por el corazón, nodo AV como torniquete, vía accesoria, circuitos de flúter y TV, refractariedad, conducción oculta | Presiones, volúmenes, válvulas, Wiggers |
| Ritmos | 17, con bradis y BAV | 17 estados con fuente; bradis, BAV y marcapasos **vacíos** («pendiente de fuente») | FC única; no hay ritmo |
| Latido → circulación | PA en línea recta a cifras fijas | Pulso y déficit por latido (llenado según RR, patada auricular) | Hemodinámica completa, pero un latido = periodo fijo 60/FC con aurícula siempre |
| Acciones | Farmacia, cardioversión SYNC/energía, desfibrilación, marcapasos, RCP | Adenosina, vagal, diltiazem, WPW→FV, RCP con EtCO₂, choque | Soporte (balón, Impella, ECMO) |
| Caso y revisión | Ruta AHA, registro, objetivos, errores, nota /100, exportar | Recorrido guiado + Mayéutica (predice y comprueba), caso de Teodoro | Mayéutica en fichas |
| Fuentes | Enlaces a guías USA; cifras sin página | Cada estado con su ficha y página (Marino 19-21, Libro Azul, De Sequera) | Fichas y PDF |
| Medir | Intervalos de tabla | Sin regla ni calibrador (falta) | Medidores de eco |
Ganan ellos: amplitud clínica (bradis, marcapasos, cardioversión), 12 derivaciones, flujo de caso con consecuencias y revisión. Ganamos nosotros: el ECG nace de la fisiología (PR del nodo, QRS ancho por el músculo, delta por el atajo), el mecanismo se ve, cada cifra tiene página, y hay un motor hemodinámico real detrás.
 ## 4. Ideas (de barata a grande)
1. **Monitor con latido real** (modelos vivos/puerta). Pletismografía y PA latido a latido desde `latidosMecanicos` (ya
   da el déficit de pulso en FA), marca de SYNC sobre cada R, EtCO₂ en curva durante la RCP. *Aporta*: ver por qué la
   FA no llega a la muñeca y qué sincroniza el SYNC. *Esfuerzo* pequeño. *Necesita*: nada (fuentes ya en la maqueta).
2. **Regla y calibrador** sobre la tira (PR, QRS, QT, RR; papel numerado; 25/50 mm/s y ganancia). *Aporta*: aprender a
   medir, lo básico del PIF. *Pequeño-medio*. *Necesita*: fuente de ECG básico para los normales (ver 3).
3. **PIF Cardiología · «ECG y arritmias»** (la rotación empieza el 01/11): cuaderno de lectura sistemática (ritmo, FC,
   eje, PR, QRS, QT, ST) con tiras del generador y «lectura guiada» propia que enlaza a la ficha de Marino o a la puerta.
   *Medio*. *Necesita*: el PDF de ECG básico que use la rotación (decide cuál) y ESC/AHA para los bloqueos.
4. **12 derivaciones desde el grafo**: dar a cada trozo de músculo una profundidad (anterior/posterior) y proyectar el
   frente sobre los 6 ejes del hexaxial y 6 precordiales; las de miembros por Einthoven, como ellos. *Aporta*: eje,
   bloqueos de rama y delta en V1, sin dibujar nada a mano. *Medio*. *Necesita*: nada nuevo de fuente para el método
   (fisiología general, rotulado); decisión: aceptar 12 derivaciones «ilustrativas».
5. **Bradicardias, BAV y marcapasos en el grafo**: Mobitz I = el torniquete se cansa (PR crece), Mobitz II = el His falla
   de golpe, BAV completo = foco de escape; marcapasos transcutáneo con umbral de captura eléctrica y mecánica. *Medio*.
   *Necesita*: **PDF ESC 2021 de estimulación** (Rev Esp Cardiol 2022) y **AHA 2025 bradicardia**.
6. **Modo Simulación con consecuencias**: el usuario actúa (parches, SYNC, energía, fármaco, RCP) y el grafo responde,
   con las ramas de error que ya enseñan (bloqueador nodal en WPW → FV; descarga sin SYNC sobre ritmo organizado → FV;
   SYNC en FV no descarga). Revisión final por objetivos con «Ver en la ficha», sin nota numérica (o con ella, si la
   quieres). Registro y línea temporal sin guardar nada. *Grande*. *Necesita*: **AHA 2025** (taquicardia, bradicardia,
   paro y cardioversión; los enlaces exactos salen en su código, pero heart.org da 403 desde aquí: mándalos tú).
7. **Ritmo que mueve el motor del latido** (eco + monitor a la vez): el motor acepta una lista de latidos del grafo
   (hora de la aurícula o ninguna, hora del ventrículo, PR) en vez de su reloj 60/FC. Sale solo: FA sin patada auricular
   y RR irregular (onda A ausente en el Doppler mitral), TV con llenado corto y caída del GC, BAV con FC 30 y disociación
   (ondas «cañón» en la AD), adenosina con pausa. *Grande*. *Necesita*: decisión (tocar el motor; sus pruebas en verde) y
   el puente en `js/core/`.
8. **Puerta «Arritmias»** (ya decidida): Monitor + catálogo por familias (Sinusal, Estrecho, Ancho, Parada, Lentos, Más,
   como la maqueta) + Estudio (ruta paso a paso con su página) + Casos (6). Fases: a) maqueta → app con 1-2-4; b) 5;
   c) 6 y 7. *Grande*. *Necesita*: tu «ok» a la maqueta v2, los PDF de 5 y 6, y dónde vive el monitor común.
9. **Velocidad 1×/5×/20×** para ver infusiones y ciclos de 2 min de RCP. *Pequeño*.

## 5. Qué NO traer
Su código, textos («lectura guiada», historias, frases), nombres de pacientes, Rx de Wikimedia y el maniquí 3D (pide three.js, rompe §2 y enseña poco). Sus cifras (70 mA, 200/100 J, «FC<130 no se cardiovierte», magnesio 2 g en 15 min, tiempos de RCE): solo indican qué buscar en el PDF. Las constantes en línea recta (tenemos motor). La analítica, WebMCP y la exportación JSON. Las plantillas de QRS dibujadas: nuestro ECG nace del grafo y eso es lo que enseña.

## 6. Lo no visto
Recorridos con clic: TSV, FA preexcitada, Mobitz II + marcapasos, BAV completo (12 derivaciones), FV + RCP + choque. No recorridos (solo código): flúter, FA rápida, TV estable/inestable, torsades, asistolia, AESP, extrasístoles, taquicardia sinusal, Mobitz I. No leídos: el trozo `index-*.js` (marco), el sonido, el contenido de laboratorio e imagen, el desplegable de diagnóstico por dentro, el tema oscuro, el RCE completo (necesita 2 min a 20×) y la tabla entera de casos y objetivos. Licencias: ninguna declarada en la web (sin verificar).

## Capturas (`/tmp/plan-socialista/rea-ra/ritmolab/`)
01 portada (Estudio, TSV) · 02/05 TSV en Simulación · 03 farmacia · 04 desfibrilador/marcapasos (sin parches) ·
06 adenosina: pausa · 07 TSV → sinusal · 08 revisión 50/100 · 09 WPW · 10 WPW + adenosina → FV · 11 Mobitz II ·
12a marcapasos 30 mA sin captura · 12 marcapasos 80 mA con captura · 13a BAV completo · 13 ECG 12 ampliado ·
14 FV · 15 FV con RCP · 16 desfibrilador con parches · 17 tras el choque · 18-19 WPW en Estudio con ruta ·
20 guías y alcance · 21 evolución. 