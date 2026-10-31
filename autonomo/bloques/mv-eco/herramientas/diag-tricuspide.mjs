// mv-eco-2a5 · vuelta 5: cuánto de los velos (mitral y tricúspide) corta el plano A4C en la fase A (telediástole).
import { usarDibujo, construirCorazon } from '../../../../js/modules/eco/corazon-geo.mjs';
import { estadosForma } from '../../../../js/modules/eco/pruebas/geometria-juez.mjs';
import { planoVista, cortarPieza } from '../../../../js/modules/eco/ecografia.mjs';
usarDibujo(2);
for (const [k, g] of [['normal'], ['hpcronica', 1], ['tep', 1]]) {
  const { td } = estadosForma(k, g), P = planoVista('a4c', td), partes = construirCorazon(td).partes;
  const out = [];
  for (const p of partes) { if (!/^(Mitral|Tricúspide)/.test(p.nombre) || !p.idx) continue; const c = cortarPieza(p, P);
    let L = 0; for (const s of c.seg) L += Math.hypot(s[0] - s[2], s[1] - s[3]) || 0; out.push(`${p.nombre}:${c.seg.length}seg`); }
  console.log(k, g ?? '-', 'aperturas', td.mitral, td.tricus, '|', out.join(' '));
}
