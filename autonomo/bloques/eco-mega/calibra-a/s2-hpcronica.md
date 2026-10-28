# s2-hpcronica · HP crónica a fondo y E/e′ del defecto (eco-calibra-a, sesión 2, pieza 4)
Antes → después (medidor `calibra-tabla.mjs`; 0 % no cambia):
| punto | PAM/FC | PVC/PCP | GC | E / A | E/e′ | TAPSE | VD TD/TS (FE) | fuera |
|---|---|---|---|---|---|---|---|---|
| def antes | 83/78 | 6,3/5,1 | 4,37 | 88/89 | 8,11 | 15,5 | 153/97 (37 %) | no |
| def ahora | 81/83 | 7,2/4,3 | 4,03 | 84/91 | 7,82 | 14,1 | 150/101 (32 %) | no |
| 100 % antes | 74/97 | 12,1/5,1 | 3,06 | 51/127 | 4,7 | 7,1 | 329/298 (10 %) | AI/AD 10 < 15 |
| 100 % ahora | 77/93 | 15,5/5,8 | 3,07 | 80/128 | 7,4 | 9,3 | 228/195 (15 %) | no |
Causa del 100 %: el VD no tenía tope por ninguna parte (v0 +160 mL, sin más rigidez) y la AI se vaciaba (PCP 5, bomba 93 %,
AI mínima 10 mL) porque el líquido y el VD absorbían el volumen. Arreglado en el origen (`hpcRecorrido`, `escenarios.mjs`):
- k (resistencia pulmonar) más empinado al principio (13,5·x hasta 0,55 → ×8,4 en el defecto) y llega al mismo ×12: el VI recibe menos y E baja (E/e′ <8, Nagueh p.548; Mukherjee p.173 T8). e′ sin tocar (10,8).
- Fase de claudicación (x >0,6): v0 del VD +60 (no +160) y rigidez ×1,4 (no ×1,2): VTD 228 mL (grave >170 mL, Mukherjee p.145 T1); líquido +1.200 mL (antes 700): PVC 15,5 (RAP ≥15 grave, ibíd., ahora cumple); tabique 0,05 → 0,20 (interdependencia con el VD dilatado) que mantiene la AI ≥15.
- Cifras nuevas = parámetros ilustrativos del motor; lo exigido son las bandas de los jueces (libro y página en `bandas-paciente.mjs`).
Archivos: `js/modules/eco/escenarios.mjs` (hpcRecorrido + aplicar: `m.p.tabique`), `guyton-tablas.mjs` (regenerada con `herramientas/curvas-guyton.mjs`; solo cambió la línea hpcronica), `pruebas/paciente-doppler.test.mjs`.
PENDIENTES: quitadas `J1:hpcronica:def` y `J2:hpcronica:1` (J1/J2 hpcronica 0/def/1 pasan; hpcronica:1 también J1).
Pruebas recalibradas: ninguna (ni umbrales ni referencias). Primer intento rompió 3 (PVC ≤16 en enfermedad, curva Guyton ±5 %, PAPs ≤110 con bolos+EPP): se ajustó el motor (líquido 1.200, k 13,5) y se regeneró la tabla Guyton.
Otras formas: tabla idéntica salvo hpcronica (diff de las 9 primeras columnas).
No comprobado / riesgo: FEVD 15 % a fondo es muy baja (banda: <32 %, «hueco» por abajo); PAPs 95-97 en el defecto (leve-moderado) ya era 92; la visual del VD con tabique alto no se miró en pantalla.
