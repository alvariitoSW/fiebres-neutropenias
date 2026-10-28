# constructor-eprima (eco-calibra-a) · commit y push hechos. Suite entera: 502 pruebas, 476 ok, 0 fallan, 26 todo (antes 29). Árbol limpio.
Cambios (antes → después)
- escenarios.mjs: `RELAJACION_LENTA = 2.8` (la misma `relajacion` del motor que alarga la cola del VI y que baja e′ en `ePrima`: una sola fisiología).
  dilatada: relajacion 1 → 2,8. fallo: 1 → rampa 1…2,8 hasta su defecto (`FALLO_DEFECTO` extraído, mismo valor). Resto de formas: 1 (e′ normal, banda c).
- escenarios.mjs hipertrofia: fija (b×2,2, sin g) → mando `gravedad` (defecto g=0,2) con `hviRecorrido`: relajación 3,2→2,8, `vi.b` ×(1+1,2g²), volumen retenido 300g² mL; masa/pared fijas.
- medir-forma.mjs: hipertrofia pasa a «con mando» (×3 puntos); bandas-paciente.mjs: quitado un comentario obsoleto.
- atlas/sistolica.mjs:31: la hipertrofia del atlas 9 se aplica con g=1 (grado 2 = la de antes; con el defecto su strain era −18,7 y la prueba pide >−16).
- guyton-tablas.mjs regenerado (curvas-guyton.mjs). README del motor: párrafo. PENDIENTES: quito J1 hipertrofia ×3 y reescribo la causa.
Tabla (E/A · e′ sep/lat · E/e′ · PCP · grado atlas 10 con clasificar())
| normal / hemorragia, derrame, TEP, HP crónica a 0 | 1,14 | 9,6/12,0 | 8,4 | 8,0 | 0 |
| hipertrofia 0 % | 0,67 | 4,8/6,0 | 11,4 | 8,9 | 1 (rama b) |
| hipertrofia defecto | 0,70 | 4,9/6,1 | 11,5 | 9,4 | 1 |
| hipertrofia 50 % (extra) | 0,84 | 5,0/6,2 | 12,3 | 12,7 | «PAI normal, sin grado» (rama c, el seudonormal a medias; frase viva pendiente) |
| hipertrofia 100 % | 1,58 | 5,2/6,5 | 16,3 | 26,3 | 2 (rama d) |
| dilatada | 1,38 | 5,2/6,5 | 13,5 | 28 | 2 (el atlas no la da grado 3: E/A <2) |
| fallo def / 1 | 0,98 / 0,43 | 5,2/6,5 | 10,0 / 5,1 | 22 / 33 | 2 / 2 |
| hpcronica def | 0,98 | 9,6/12,0 | 8,1 | 5,1 | (no es de VI) |
Hipertrofia: los 3 puntos pasan J1 y J2 y `CRITERIOS_FORMA.hipertrofia` (enfermedad.test, verde); IT 2,1-2,7 (PAPs 38 al 100 %), el grado 2 sale por la rama d.
Restrictivo del atlas 10: no tocado (el atlas fija su propia relajación; sus pruebas verdes).
PENDIENTES que quedan (15): J1 dilatada, hpcronica:def, hemorragia:1, fallo:def, fallo:1, derrame:1, tep:1 · J2 vasoplejia, hemorragia:def/1, derrame:def/1, tep:def/1, hpcronica:1.
Cifras malas del motor (paro y informo, no las tapo)
- dilatada: con e′ en banda salen E/A 1,38 (exige ≥2) y E/e′ 13,5 (≥14), DT 220. Probé rigidez ×1,5: E/e′ 14,8, DT 136, E/A 1,61, pero rompe 3 pruebas de la dilatada (PCP 35, PAM 74, criterios de la ficha). Bajar la Ees de la AI deja S=0. Con relajación lenta la A no cae.
- fallo def: E/e′ 10,0 (≥14) y S/D 1,42 (<1); rigidez ×2 da E/e′ 14 pero PAM 68, FC 108 (ya no es el defecto). fallo 1: E 30 con GC 2,4 → E/e′ 5,1 (≥14).
- hpcronica:def: E/e′ 8,11 frente a <8 (Mukherjee p.173) con e′ normal 10,8 y E 88; no lo fuerzo.
- Hipertrofia DT 552-584 ms en el grado 1 (diagnóstico, sin banda; muy largo, viene de la relajación 3,2).
Herramientas: /tmp/plan-socialista/eco-calibra-a/{dil,hip,fal,grado}.mjs (barridos y grado del atlas 10).
Visto de paso: el simulador no se miró en navegador; con mando nuevo en hipertrofia la interfaz de gravedad sale sola (texto: rigidez y volumen retenido).
No comprobado / riesgo: navegador.test.mjs verde pero sin captura del mando de hipertrofia; el defecto de hipertrofia ahora es grado 1 (antes PCP 24): quien use `aplicar` sin g ve otro paciente. Ramp del fallo entre 0 y defecto no probada punto a punto.
