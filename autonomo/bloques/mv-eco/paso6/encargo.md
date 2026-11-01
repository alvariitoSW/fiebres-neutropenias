# Encargo mv-eco-2a5 · paso 6 (B-045): el motor del corazón al realismo 9,85-10 y encender el dibujo nuevo
Decisión del usuario 01/11 (fila del tablero): ir al 9,5 con el motor; al pasar 9,5 encender `?dibujo=2` por defecto y seguir
a 9,85-10. Vía libre de gasto en esta tarea (presupuesto por encargo, jueces y cuentas siguen). Tipo: arreglo/visual del motor.
Base: main 096733f (versión 20261101-9). Rama auto/mv-eco-2a5. Punto de partida: juicio-2.md (paso 5) = 9,0.

## Piezas (una por encargo, sonnet, ≤60 pasos; motor siempre: pruebas de la eco + `jueces --modelo shock-vivo`)
- **M0 medir** (sonnet ≤10 pasos, REGLAS §4.14): curva pVD−pAD en sístole (normal, HP g=1, TEP g=1): forma (domo/meseta),
  momento del máximo; índice de excentricidad del VI por fases en la HP; amplitud regional pared libre basal/media/apical en TEP.
- **M1 domo de la IT** (motor.mjs, activación/elastancia del VD): la presión del VD sube, hace domo en mesosístole y baja; el
  gradiente VD−AD da un CW parabólico (Zoghbi 2017 Fig. 29, PDF p. 49). Sin cambiar vIT/PSAP de los escenarios más de ±5 %.
- **M2 tabique en sístole media en la HP** (motor.mjs, durVd o septo): D también en sístole (ESC/ERS 2022 Tabla 10 p. 3645,
  «sístole y/o diástole»); índice de excentricidad ≥1,1 en sístole media en la HP crónica g≥0,6; normal ~1,0.
- **M3 McConnell visible** (motor `regional` + lo que lea el dibujo): en el TEP, pared libre media acinética y ápex que se mueve,
  legible en 4 fotogramas (McConnell 1996; fuente en docs/ si existe, si no, cita web verificada).
- **D1 IM en domo**: muestra del CW de regmitral en el centro del chorro o máximo del haz (simulador.mjs:535, 783-793), sin
  escalones ni recorte a +100; espectro parabólico (Zoghbi 2017).
- **D2 base desplazable del CW**: la línea base baja para los chorros negativos/positivos (simulador.mjs:591): sin media
  pantalla vacía.
- **D3 escalera del SC4C** (torax.mjs): sin rayitas en escalera en el borde izquierdo del subcostal del derrame; paredes
  auriculares del TEP con grosor real, no alambre.
- **D4 dilatada esférica** (corazon-geo dibujo 2): el VI dilatado globular (índice de esfericidad ↑; Mitchell 2019 Fig. 8 p. 8).
- **Juicio de realismo** (profesor fable) con los 6 criterios y las herramientas `capturas-realismo.mjs` y
  `capturas-mov-doppler.mjs`; rejuicio solo de lo <9,85.
- **Encender** al ≥9,5 (media y ninguno <9): por defecto dibujo 2, regenerar instantánea, `--geometria` a la suite, versión,
  pruebas de la eco, shock-vivo, `--eco`. Después, vueltas hasta 9,85-10 (ningún criterio <9,5, lectura del director).

## Hecho
Media ≥9,85 (mín. 9,5) · interruptor encendido · juez geometría 0/147 · pruebas de la eco y shock-vivo en verde · `--eco` ✓ ·
VD/VI>1 en HP crónica grave · versión nueva · parte y SESIONES.
## Lo que NO quiero
Tapar con el dibujo una cifra mala del motor; romper la API del motor (shock vivo, atlas); bajar umbrales de jueces;
three.js; fotos con licencia restrictiva; cambiar cifras de escenarios sin fuente.
## Fuentes
Zoghbi 2017 (IT/IM CW, Fig. 29 p. 49), ESC/ERS 2022 Tabla 10 p. 3645, Lang 2015, Mitchell 2019 Fig. 8 p. 8, McConnell 1996 (buscar).
