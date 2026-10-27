// Parada 3 · R3: la tricúspide abre en F (llenado rápido) y el VI del TEP a fondo no sale facetado.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { construirCorazon } from '../corazon-geo.mjs';
import { estadoGeo } from '../formas.mjs';
import { latido, puntasTric } from '../../../../autonomo/bloques/eco-mega/herramientas/r3-captura.mjs';
import { pacienteTep, septoMax, anguloMinimoVi } from '../../../../autonomo/bloques/eco-mega/herramientas/r3-contorno.mjs';
import { angulos } from '../../../../autonomo/bloques/eco-mega/herramientas/saco-contorno.mjs';

test('la tricúspide abre en F con las valvas separadas (> 6 mm entre puntas) y cierra en sístole', () => {
  const p = latido(), o = p.o;
  // apertura de la tricúspide tras la sístole: primera muestra con flujo AD→VD después de ≥ 100 ms sin él; F = su pico en los 150 ms siguientes
  let ini = -1, sinFlujo = 0;
  for (let i = 0; i < o.length; i++) { if (o[i].qTri > 0) { if (sinFlujo >= 50) { ini = i; break; } sinFlujo = 0; } else sinFlujo++; }
  assert.ok(ini > 0, 'el motor no da apertura de la tricúspide tras la sístole');
  const F = o.slice(ini, ini + 75).reduce((a, b) => (b.qTri > a.qTri ? b : a));
  const eF = estadoGeo(F, p.ex), sepF = Math.min(...puntasTric(construirCorazon(eF, { detalle: true })));
  assert.ok(F.qTri > 0 && eF.tricus >= 0.9, `en F la tricúspide abre ${eF.tricus.toFixed(2)} (flujo ${F.qTri.toFixed(0)} mL/s)`);
  assert.ok(sepF > 6, `en F las puntas de la tricúspide se separan ${sepF.toFixed(1)} mm (> 6)`);
  const S = o.reduce((a, b) => (b.qAo > a.qAo ? b : a)), eS = estadoGeo(S, p.ex), sepS = Math.max(...puntasTric(construirCorazon(eS, { detalle: true })));
  assert.equal(eS.tricus, 0, 'en sístole la tricúspide está cerrada');
  assert.ok(sepS < 0.5, `en sístole las puntas se tocan (${sepS.toFixed(2)} mm)`);
});

test('el VI del TEP a fondo, en el eje corto de papilares, sin esquinas (ningún ángulo < 150° con brazos de 3 mm)', () => {
  const p = pacienteTep(1), e = septoMax(p), r = anguloMinimoVi(e, { pericardio: true, detalle: true }, 1.5);
  assert.ok(e.septo > 0.95, `tabique aplanado del todo (${e.septo.toFixed(2)})`);
  const min = Math.min(...angulos(r.pts, 2));
  assert.ok(min >= 150, `ángulo mínimo del contorno endocárdico ${min.toFixed(0)}° (< 150: facetas)`);
});
