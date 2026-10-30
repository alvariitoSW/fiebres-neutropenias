# rea-cierre (B-046) · Tres webs abiertas en la red (30/10/2026) — leídas con curl, sin copiar código

(Primera pasada fallida con WebFetch; rehecho con `curl`. Texto extraído de la propia página y del HTML del simulador.)

## 1. CardioRender (Dr Dinesh Raja Palanisamy) — cardiorender.com
- **Qué es**: 11 simuladores de navegador, un motor por curso, «un modelo guía todas las vistas». Los 3 grandes: Conducción y
  arritmias (56 módulos, v1.6), Cardiopatías congénitas (41, v2.1) y Mecánica cardíaca (35, v3.0). Más: anatomía del ECG,
  electrodo→ECG (inversión de cables), marcapasos (17 módulos + marcapasos vivo que se rompe y se arregla), electricidad→ECG
  (14), simulador de STEMI, ritmos, Einthoven, ultrasonido y Doppler (34).
- **Mecánica (el que interesa)**: elastancia variable en el tiempo (Suga-Sagawa; Burkhoff 2005), ESPVR lineal, EDPVR de Klotz,
  presión arterial tipo Windkessel, acople Ea/Ees (normal 0,61, EF 57 %, 111/77). Mandos: determinantes, preajuste, valvulopatía
  y gravedad, fármaco y dosis, soporte (Impella, VA-ECMO, ECPELLA; validado con Yahagi 2024), reflejos (9 mecanismos,
  consigna y ganancia). Muestra el lazo con área de trabajo, curva normal superpuesta y las fórmulas con las cifras. Enseña
  «predice antes de mover»; el shock como 4 formas de lazo, no 4 listas. Dice qué simplifica y que no se citen cifras de fármacos.
- **Arritmias**: ningún ritmo guionizado; todo sale de conducción, refractariedad y recuperación (curva decremental del nodo);
  un mando inicia/rompe la reentrada; 8 módulos «nivel EP» opcionales; cierre «Nombra el ritmo» con 10 trazados al azar.
- **Licencia**: © autor. Solo uso docente con atribución; **redistribuir archivos, uso comercial o modificar requiere permiso
  escrito**. No se copia nada; solo ideas y referencias (que son artículos reales, citables desde `docs/`).
- **Ya hay**: lazos P-V (Fisio UCI, Circulación viva, Merino Neumología), shock vivo. **Aporta**: acople Ea/Ees, reflejos como
  lazo externo amortiguado, «predice antes» con lazo, curva decremental del nodo.
- **Destino**: mecánica/acople/fármacos/soporte → tarea **`mv-eco`** (mejora de lo existente); shock en 4 lazos →
  **`guardia-shock`**; curva decremental, Wenckebach y «Nombra el ritmo» → **`pif-cardio`** (y `arritmias-maqueta` si se reabre);
  marcapasos vivo y electrodo→ECG → **aparcado hasta `g3-sca`/`g4-dispositivo`** (no hay tarea abierta).

## 2. LITFL — litfl.com/st-elevation-in-avr/
- **Licencia confirmada en su pie**: CC BY-NC-SA 4.0 (Ed Burns y Robert Buttner, 8/10/2024). La página: ↑ST en aVR con
  ↓ST multiderivación = isquemia subendocárdica (tronco, DA proximal, 3 vasos); es biblioteca de ECG, con enlaces y cursos de pago al lado.
- **Destino**: enlace `.biblio-link` + `.biblio-nota` en **`arteria-culpable`** (`culprit-a`); no es fuente de cifras (el aVR sale de
  Tamura 2014 y Wagner 2009 en `docs/`). Atribución visible; no se copia texto ni imágenes (SA obligaría a compartir igual).

## 3. intro2echo.com — The Heart by Ultrasound (D. Ouyang)
- **Qué hay**: una sola página con ~38 capítulos (`src/ch/*.js`): física del pulso, A/B-mode, artefactos, Doppler con Nyquist,
  9 planos con sonda y cuerpo 3D, Wiggers, lazo P-V con Ees/Ea, hemodinámica, VCI→PSAP, volúmenes (Simpson), segmentaria con
  arteria ocluida (LAD/RCA/Cx) y 17 segmentos, diastólica (algoritmo 2025), VD, masas, LVAD (4600-6200 rpm), EA, IA, IM, EM,
  IT, prótesis, endocarditis, pericardio, MCH, amiloide, TEE, TEER, TAVR, shunts, strain, estrés, informe; casos (amiloide, MCD
  isquémica, Barlow, bicúspide) y valores normales.
- **Ya en la app**: atlas con 9 capítulos (sistólica, diastólica, ciclo, Doppler, hemodinámica, imagen, pulso, VD, ASA).
- **Añade la web actual**: los capítulos valvulares, MCH, amiloide, masas, LVAD, TEE, TEER/TAVR, shunts, strain, estrés,
  endocarditis y prótesis; coinciden con las 21 aparcadas del tablero (`mr`, `as`, `ar`, `ms`, `hcm`, `lvad`…).
- **Destino**: **`eco-sueltas`** solo para citar bien al autor y apuntar la lista de capítulos como índice de pendientes;
  el resto, **aparcado hasta** que `mv-eco` abra las valvulopatías. La licencia de la web no se vio: usa el permiso ya dado.

## No comprobado / riesgo
- No se abrió el simulador de CardioRender en navegador (solo su HTML y texto): mandos y comportamiento de arritmias salen de sus descripciones.
- Licencia de intro2echo.com y del repo echodemo para el contenido nuevo: no leída; el permiso previo cubre lo ya traducido.
- Las cifras de CardioRender (0,61, 111/77) son suyas y ajustadas («constantes ajustadas, no medidas»): no usarlas como fuente.
