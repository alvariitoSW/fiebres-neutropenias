// Largo del VD (Lvd), del VI (Le) y VD/VI basal: dibujo hoy y nuevo, normal/TEP/HP a g 0/0,5/1 (telediástole).
//   node autonomo/bloques/mv-eco/herramientas/diag-vd-largo.mjs
import { estadosForma } from '../../../../js/modules/eco/pruebas/geometria-juez.mjs';
import { baseGeometricaHoy } from '../../../../js/modules/eco/corazon-geo.mjs';
import { baseGeometrica2 } from '../../../../js/modules/eco/corazon-geo-2.mjs';
console.log('forma g | vvd vvi | VD/VI vol | hoy Lvd Le | nuevo Lvd Le | Lvd-Le (nuevo)');
for (const [k, gs] of [['normal', [undefined]], ['tep', [0, 0.5, 1]], ['hpcronica', [0, 0.5, 1]]]) for (const g of gs) {
  const { td } = estadosForma(k, g), h = baseGeometricaHoy(td), n = baseGeometrica2(td);
  console.log(k, g ?? '-', '|', td.vvd.toFixed(0), td.vvi.toFixed(0), '|', (td.vvd / td.vvi).toFixed(2), '|', h.Lvd.toFixed(1), h.vi.Le.toFixed(1), '|', n.Lvd.toFixed(1), n.vi.Le.toFixed(1), '|', (n.Lvd - n.vi.Le).toFixed(1));
}
