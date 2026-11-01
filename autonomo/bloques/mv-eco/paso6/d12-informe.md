# D1+D2 · Doppler CW: IM en domo y base desplazable (rama wt/mv6-d12)
**D1.** `doppler.mjs` `fuenteEnMuestra`: el CW de la IM lee ahora el máximo del chorro (vena contracta) × cos θ, igual que la IT; `simulador.mjs` usa esa vía para regMitral y regTricus (`esReg`). API sin cambios.
Antes: pico en la muestra 209 cm/s (orificio 386), curva en escalones y con relleno de la mitral. Después (dilatada g=1): pico 361 cm/s = 386·cos 21°, domo liso (ΔP VI−AI 60 mmHg → √(60/4)=3,87 m/s ≈ 386 cm/s, Zoghbi 2017 Fig. 29).
**D2.** `modo-m.mjs`: `setBase(frac)` (línea de base desplazable; velDeY/yDeVel y marcas la respetan). `doppler.mjs` `columnaEspectro(..., base=0.5)`: el aliasing envuelve en el rango visible. Mando nuevo `#cv-d-base` (Centro/Arriba/Abajo) en `eco.html`; regmitral y regtricus ponen la base arriba (0,2) y los demás presets la devuelven al centro. Mando de escala intacto. Origen: ilustrativo (texto de la IM ajustado).
**Pruebas** (`pruebas/doppler-it.test.mjs`, +2): factor IM = ±cos θ en cualquier punto del chorro; curva lisa (salto < 20 % del pico) y pico = factor·máx. velRegMitral; columna con base arriba pone el chorro negativo en su fila y con base 0,5 es idéntica a la antigua. doppler-it: 7/7.
**Capturas** antes: `autonomo/bloques/mv-eco/paso6/d12-antes/`; después: `.../paso6/d12-despues/` (d-regmitral-dilatada, d-regmitral-fallo, d-it-cw-hpcronica; 390 px, sin errores de consola).
**Jueces** `--eco`: todo ✅ (390/360, ids, consola) salvo «Caché: ?v= sin subir», esperado (no se cambia la versión).
**Suite eco**: con la máquina cargada por otros constructores, `tiempo: la prueba entera < 60 s` (nº 64) falló por carga; el resto sin fallos hasta donde llegó el registro.
## No comprobado / riesgo
- Suite eco completa y `--modelo shock-vivo` no vistos hasta el final (carga); repetir con la máquina libre. No se tocó motor.mjs.
- Con la base arriba el rótulo «-50» queda bajo el cursor; la IT a ±500 deja ~40 % de pantalla sin uso (usar ±250 si vIT < 4,5 m/s). Revisar a 360 px solo por jueces, no a ojo.
- El CW de IM ya no mezcla el flujo mitral diastólico en el mismo espectro (solo el chorro), como la IT.
