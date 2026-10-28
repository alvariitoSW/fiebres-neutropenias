# 2026-10-28 · eco-calibra-a (sesión 2 de 2)

**Resultado:** hecha · arreglo técnico, en `main` (rama `auto/eco-calibra-a`, sin PR: va directo con los jueces en verde)
**Vueltas:** 1 por pieza (2 en fallo y J2) · **Jueces:** suite eco 505 pruebas, 0 fallan · `jueces.mjs --eco` ✓ · auditoría ✓ (1 grave arreglado)

## Qué se hizo
Los dos jueces nuevos de la eco (J1 «Doppler de paciente posible» y J2 «sin recorte del dibujo») pasan en las 9 formas a
0, defecto y 100 %: la lista de pendientes queda vacía. Seis constructores en ramas `wt/…`: la dilatada es ya el
ejemplo de grado III (E/A 2,35, DT 132, E/e′ alta); el fallo da grado II de libro (E/e′ 15, S/D 0,75); la HP crónica
grave tiene un VD de 228 mL (antes 330, el tope del dibujo); a FC 120 la E ya no sale 0 (la mitral abre dentro de la
contracción auricular y se cuenta como E fundida); el dibujo admite el VD pequeño del shock (piso 45 → 20 mL: el VD de
23 mL de la hemorragia es el del motor; forzarlo a 45 daba FEVD 29 %); la velocidad de las venas pulmonares sale del
calibre real de una vena (Cronin 2007). Tras el juicio del profesor, el panel ya no imprime un E/A imposible cuando E y
A se funden: dice «Fusión E-A (FC alta): E/A y TDE no medibles» (Nagueh 2025 p.547), y J1 exige E/e′ ≥4 y E/A ≥0,5
sin fusión (p.551). Revisión del encargo: hecha en la sesión 1 (`revision-encargo.md`).

## Qué no se pudo hacer o leer
- DT del grado 1 (relajación alterada): sin cifra en los PDF de `docs/`; la guía ASE/EAE 2009 (PMID 19187853) y la web
  docente no se abrieron (red de la sesión). La banda queda como hueco declarado, solo diagnóstico.
- Wierzbowska-Drabik 2010 (S normal de vena pulmonar) y ESC/ERS 2022 no se cotejaron en esta sesión.

## Para el usuario
Nada que decidir para que funcione. Tres huecos que propongo como tareas aparte (bitácora):
1. **Fallo al 100 % (shock cardiogénico) no es coherente** (profesor 5,5/10): PCP 33 con E 35 (ahora sale como fusión),
   e′ septal 2,0 cm/s (Nagueh p.561 da 3-4), S pulmonar 1 cm/s, FEVD 11 % con PVC 6,4. Y Ar 2 cm/s en el defecto con
   PCP 23 (con PAI alta, Ar sube). Pide un «shock cardiogénico restrictivo» coherente.
2. **TEP: no hay escalón submasivo → masivo** (profesor 6/10): el defecto ya tiene FEVD 13 % y TAPSE 8,4.
3. **Hipertrofia grado 1: DT ~420 ms** (atípico; lo didáctico 220-300) y e′ que sube al empeorar; al 100 % el VD se
   descompensa y distrae. Además, la HP crónica al 100 % cuenta como fusión a FC 93 (por la forma de la onda).
Notas del profesor: normal 9, dilatada 9, hemorragia 8, hipertrofia 7,5, derrame 7,5, HP crónica 7,5, vasoplejia 7
(antes del arreglo de la fusión), TEP 6, fallo 5,5.

## Visto de paso (no tocado)
- Las herramientas de la sesión 1 (`herramientas/calibra-a/*.mjs`) importan rutas absolutas del repositorio, no del
  worktree.
- La prueba del balón (`motor.test`, llenado >38 mL) queda a 38,05: frágil ante cualquier cambio del fallo al 100 %.
- El taponamiento no muestra la variación respiratoria de la E (el signo clave); si el motor no respira, anotarlo.

## Propuestas sobre las reglas
- **Decisión del director que cambia una regla firmada**: el encargo decía «LIMITES no se tocan»; lo cambié porque
  cumplirla obligaba a fabricar un VD imposible. Propuesta: en los encargos, «no se tocan» lleva su razón, y si
  cumplirla rompe §1.14 (paciente posible), manda §1.14 y el parte lo dice.
- Un constructor citó una guía «de memoria» con página sin verificar. Propuesta para la lista del constructor: una cita
  que no se pudo abrir se escribe como hueco, nunca con su página.

## Vueltas
| Pieza | Vuelta | Nota mín. profesor | Modelo | Pasos | Equiv. | Qué falló |
|---|---|---|---|---|---|---|
| dilatada + fallo | 1 | — | opus | 77 | 1,8 M | fallo sin cuadrar (rigidez rompe 9 pruebas) |
| fallo | 2 | 5,5 (fallo 100 %) | sonnet | 74 | 1,6 M | pasa J1; e′ 2 cm/s extrapolado |
| HP crónica | 1 | 7,5 | sonnet | 46 | 0,7 M | — |
| E a fondo + J2 | 1 | — | sonnet | 69 | 1,6 M | J2 por abajo sin arreglar (para e informa) |
| J2 volúmenes | 2 | — | sonnet | 81 | 1,4 M | suelo del VD daba FEVD 29 % (rechazado) |
| VD pequeño en el dibujo | 3 | — | sonnet | 31 | 0,36 M | 2 umbrales ilustrativos (los ajusté yo) |
| venas pulmonares | 1 | — | sonnet | 32 | 0,37 M | — |
| hipertrofia DT | 1 | 7,5 | sonnet | 41 | 0,71 M | DT 420; cita de memoria (cambiada a hueco) |
| fusión en el panel | 1 | — | sonnet | 27 | 0,28 M | — |

## Gasto
Total **10,9 M** en esta sesión (más 3,6 M de la sesión 1: 14,5 M frente a ≈5,5 M previstos; al límite del día).
Por papel: constructor sonnet 7,0 M (8 agentes, 65 %), director 1,8 M, constructor opus 1,8 M, profesor 0,15 M,
auditor 0,11 M. Los 3 más caros: dilatada y fallo (opus, 1,8 M), fallo (1,6 M), E a fondo (1,6 M). Dónde se fue: cada
constructor relanzaba la suite entera de la eco (>10 min, varias veces) y barría parámetros a mano; las piezas del
motor se pisan (e′, relajación, fase) y dos necesitaron segunda vuelta. Ahorro: una suite corta de calibración
(J1/J2 + las 20 pruebas que tocan el motor) para iterar, y la entera solo al entregar.
