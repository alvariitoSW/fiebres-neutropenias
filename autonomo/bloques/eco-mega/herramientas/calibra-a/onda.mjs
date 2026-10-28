// Vuelca la diástole de una forma: t, fase, PAI, PVI, qMit, vvi, eVi, eAur (eco-calibra-a s2, dilfallo)
const R = new URL('../../../../../js/modules/eco/', import.meta.url).href;
const { ESCENARIOS, ASENTAR_FORMA } = await import(R + 'escenarios.mjs');
const { crearMotor } = await import(R + 'motor.mjs');
const [k, gs = 'def', extra = '', paso = '0.02'] = process.argv.slice(2);
const g = gs === 'def' ? undefined : Number(gs);
const m = crearMotor(); m.correr(12); ESCENARIOS[k].aplicar(m, g); new Function('m', extra)(m); m.correr(ESCENARIOS[k].forma ? ASENTAR_FORMA : 40);
const o = m.onda; let tn = -1;
for (const x of o) if (x.t >= tn + Number(paso)) { tn = x.t; console.log(x.t.toFixed(3), x.fase, 'pai', x.pai.toFixed(1), 'pvi', x.pvi.toFixed(1), 'qMit', (x.qMit ?? 0).toFixed(0), 'vvi', x.vvi.toFixed(0), 'vai', x.vai.toFixed(0), 'eVi', (x.eVi ?? 0).toFixed(3), 'qVp', (x.qVp ?? 0).toFixed(0), 'qReg', (x.qReg ?? 0).toFixed(0), 'pvp', (x.pvp ?? 0).toFixed(1)); }
