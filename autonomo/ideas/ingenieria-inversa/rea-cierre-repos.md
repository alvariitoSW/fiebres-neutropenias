# rea-cierre · L3 · repos propios `simulador-UCI-` (Pygame) y `simulador-uci-3d` (Godot) · 30/10/2026

Lectura: README de ambos; `sim/patient.py`, `ventilator.py`, `drugs.py`, `cpr.py`; caso 1 (sepsis) entero, cabeceras de los casos 3 y 5; `ui/monitor.py` (`_push_sample`); `game_manager.gd`, inicio de `hud.gd`. Casos 2 y 4 no leídos.
Licencia: **ningún archivo LICENSE en ninguno** (código del propio usuario, sin licencia declarada). Se usan solo ideas; no se copia código.

## simulador-UCI- (2D, Python/Pygame, ~1300 líneas)
- Qué es: juego con monitor en vivo y 5 casos (shock séptico, SDRA, paro ACLS, sedación RASS, neutropenia febril SEIMC-SEHH 2020). Puntuación, estrellas, resumen «puntos clave». README: «modelos simplificados, no exactos».
- Modelo del paciente: sin ecuaciones fisiológicas. Cada constante vital va a una **meta** por reglas lineales y se acerca con `approach()` (exponencial, tasa 0,03-0,06/s). Ej. sepsis: `TAM_meta = 55 + 12·min(fluidos,3000)/3000 + 35·noradrenalina(mcg/kg/min) − 0,3·penaliz.`; `FC_meta = 150 − 4,2·(TAM−55)`; edema si fluidos >3000 ml (−6 TAM por litro extra, SpO2 −1,1 por punto). Derrota: TAM <50 durante 100 s; fluidos ≥7000 ml con SpO2 <80.
- Fuentes de las cifras: **ninguna citada** salvo el caso 5 (consenso SEIMC-SEHH 2020, objetivo antibiótico <60 min, red flags que invalidan MASCC) y ACLS (compresiones 100-120/min, epinefrina 1 mg/3 min, 200 J). Rangos normales: FC 60-100, TAM 65-105, SpO2 94-100, FR 12-20.
- Respirador: `PIP = PEEP + 1,6·Vt(ml/kg)/distensibilidad` y `SpO2 = 84 + 0,62·(FiO2−21) + 2·(PEEP−5) − 55·gravedad`. **No fisiológico**: la PIP ignora flujo, resistencia y meseta (se pierde la ecuación de movimiento); la SpO2 es lineal en FiO2, sin curva de disociación ni shunt. Usa «Vt por kg de peso ideal» (correcto en concepto: 6 ml/kg, ARDSnet).
- Cifras dudosas: sepsis arranca con TAM 59 y lactato 4,2 (plausible); noradrenalina hasta 1 mcg/kg/min con el efecto lineal ×35 (tope sin consecuencia propia: en la realidad >0,5 se considera refractario); propofol hasta 80 mcg/kg/min y fentanilo 200 mcg/h sin ficha. Probabilidad de descarga efectiva 0,55 − 0,35·(t/240 s) + 0,25·calidad RCP, acotada 0,05-0,9: **inventada**, sin fuente.
- Monitor: ECG por plantilla interpolada, periodo 60/FC; FV = ruido aleatorio; pletismografía con amplitud ∝ SpO2; respiración senoidal. Sin fuente ni escala clínica.
- Ideas útiles (no código): (1) meta + aproximación exponencial es lo que ya hace nuestro motor, pero aquí se ve el patrón de **fin de caso con tres derrotas con causa clínica** (shock refractario, edema por sobrecarga, tiempo) y **«puntos clave» finales**; (2) calidad de RCP medida con el ritmo de pulsaciones del usuario (100-120/min) como minijuego; (3) bono de «antibiótico <60 min» y «red flags antes de MASCC» como objetivos puntuables.

## simulador-uci-3d (Godot 4.3, 4 scripts, ~1300 líneas)
- Prototipo «Arsenal Farmacológico»: torreta 3D; cada antibiótico es un arma y cada microorganismo un blanco. Tabla fármaco → cobertura (amoxicilina→Gram+, ceftriaxona→Gram−, vancomicina→SARM, azitromicina→atípico, anfotericina B→hongo); acierto = daño alto, fallo = daño 8 y −6 estabilidad por muerte errónea, −12 por escape; 4 oleadas (6, 8, 10, 12). Sin fisiología. Cobertura **simplificada** (ceftriaxona no cubre Pseudomonas; amoxicilina no cubre SASM penicilinasa productor: el propio README lo da por «simplificación»).
- Ideas: ninguna aplicable al móvil (juego de disparo, no estudio). Se rescata solo la matriz «microorganismo × antibiótico» como ejercicio de emparejar.

## Destino de cada idea
| Idea | Destino |
|---|---|
| Caso que evoluciona con causa de derrota clínica y «puntos clave» | tarea `guardia-shock` (y `g2-paro`) |
| RCP: calidad por el ritmo de toques 100-120/min | aparcado hasta `g2-paro` (AHA 2025 ya en `docs/`; verificar cifra allí, no en el repo) |
| Sobrecarga de fluidos → edema como consecuencia visible | ya cubierto: `capilar-vivo` y el tope §1.14 (`capilar-transfundir`) |
| Respirador con fórmulas lineales | descartado: fórmulas no fisiológicas; el pulmón con respirador va en `b3d` con Marino 22-30 |
| Neutropenia febril como caso (red flags, <60 min) | aparcado hasta que haya un PIF/caso de Hematología en `preguntas`; contenido ya en la app desde SEIMC-SEHH |
| Matriz patógeno × antibiótico como emparejar | descartado: REGLAS §8 prohíbe emparejar |
| Juego de disparos 3D, puntuación, oleadas | descartado: no sirve para estudiar a pie de cama |

## No comprobado / riesgo
- No ejecuté ninguno de los dos juegos; casos 2 y 4, `widgets.py`, `main.gd`, `target.gd` sin leer.
- Sin licencia: no copiar código ni arte aunque sea del usuario si el repo pasara a público con otra autoría.
- Ninguna cifra del simulador debe entrar en la app sin fuente propia.
