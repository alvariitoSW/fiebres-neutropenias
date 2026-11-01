// mv-eco-2a5 · P5s: EPSS en el PLAX en la apertura máxima de la mitral del latido (onda E, fase F): distancia de la punta del velo anterior
// al endocardio del tabique (parte del VI endocardio del lado anterior). uso: node diag-epss-p5s3.mjs [forma] [g]
import { crearMotor } from '../../../../js/modules/eco/motor.mjs';
import { ESCENARIOS, ASENTAR_FORMA } from '../../../../js/modules/eco/escenarios.mjs';
import { usarDibujo, construirCorazon } from '../../../../js/modules/eco/corazon-geo.mjs';
import { estadoGeo, extraDeMotor } from '../../../../js/modules/eco/formas.mjs';
import { planoVista, cortarPieza } from '../../../../js/modules/eco/ecografia.mjs';
usarDibujo(process.env.DIB ? 1 : 2);
const k = process.argv[2] || 'normal', g = process.argv[3] != null ? +process.argv[3] : undefined;
const m = crearMotor(); m.correr(12);
if (k !== 'normal') { ESCENARIOS[k].aplicar(m, g ?? 1); m.correr(ESCENARIOS[k].forma ? ASENTAR_FORMA : 40); }
const extra = extraDeMotor(m); const est = m.onda.map(s => estadoGeo(s, extra));
const st = est.reduce((a, b) => (b.mitral > a.mitral ? b : a)); const P = planoVista('plax', st);
const pts = (nom) => { const r = []; for (const p of construirCorazon(st).partes) { if (!p.idx || !nom.test(p.nombre)) continue; const c = cortarPieza(p, P); for (let i = 0; i < c.seg.length; i += 4) r.push([c.seg[i], c.seg[i + 1]], [c.seg[i + 2], c.seg[i + 3]]); } return r; };
const ant = pts(/^Mitral anterior/), vi = pts(/^VI endocardio/);
const anillo = ant.reduce((a, b) => (b[0] > a[0] ? b : a)); const tip = ant.reduce((a, b) => (Math.hypot(b[0] - anillo[0], b[1] - anillo[1]) > Math.hypot(a[0] - anillo[0], a[1] - anillo[1]) ? b : a));
// tabique: lado del VI anterior (y menor que el de la punta); el endocardio posterior queda a y mayor
const sep = vi.filter(s => s[1] < tip[1]);
let d = 1e9; for (const s of sep) d = Math.min(d, Math.hypot(s[0] - tip[0], s[1] - tip[1]));
console.log(k, 'mitral', st.mitral.toFixed(2), 'anillo', anillo.map(x => x.toFixed(1)), 'punta', tip.map(x => x.toFixed(1)), 'EPSS', d.toFixed(1), 'mm');
if (process.env.V) { const r = (a) => a.filter((_, i) => i % 6 == 0).map(p => p.map(x => x.toFixed(0)).join(',')).join(' '); console.log('velo', r(ant)); console.log('septo(y<punta)', r(sep.sort((a, b) => a[0] - b[0]))); }
