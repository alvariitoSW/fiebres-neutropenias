// Extremos locales (t, Paw) de un esfuerzo del doble disparo. Uso: node …/doble-extremos.mjs pmus tin vt flujo
import { crearPulmon } from '../../../../js/modules/libros/pulmon-vivo/pulmon.mjs';
const a = process.argv.slice(2).map(Number);
const resp = { ps: 10, frEsp: 16, retraso: null, peep: 5, pinsp: 10, ie: 2, pmax: 40, modo: 'vcv', vt: a[2] ?? 300, fr: 12, flujo: a[3] ?? 30, pmus: a[0] ?? 14, tin: a[1] ?? 2.2, frNeural: 12 };
const P = crearPulmon(resp, { c: +(process.env.C ?? 60), r: +(process.env.R ?? 8), rEsp: +(process.env.R ?? 8), racimo: 'sano' }, {});
for (let i = 0; i < 6000; i++) P.paso(0.005);
const y = []; for (let i = 0; i < 1100; i++) { P.paso(0.005); y.push(P.paw); }
const e = []; for (let i = 2; i < y.length - 2; i++) { const s = (y[i] - y[i - 2]) * (y[i + 2] - y[i]); if (s < 0 || (s === 0 && y[i] !== y[i + 2])) e.push(`${(i * 0.005).toFixed(2)}s:${y[i].toFixed(1)}`); }
console.log(e.join(' '));
const t = []; for (let i = 100; i < 520; i += 10) t.push(y[i].toFixed(0)); console.log('Paw cada 0,05 s desde 0,5 s:', t.join(' '));
import('../../../../js/modules/libros/pulmon-vivo/pulmon.mjs').then(({ simular }) => { const r = simular(resp, { c: +(process.env.C ?? 60), r: +(process.env.R ?? 8), rEsp: +(process.env.R ?? 8), racimo: 'sano' }, {}); console.log('esfuerzos:', JSON.stringify(r.ef?.slice(0, 3).map((e) => ({ tipo: e.tipo, vt: Math.round(e.vt), valle: e.valle && +e.valle.toFixed(2), ti: e.ti })))); });
