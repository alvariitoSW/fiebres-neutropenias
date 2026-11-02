// 154 · criterios de las fichas del TEP (como enfermedad.test.mjs «cumple los criterios»): imprime cada uno con su valor
const dir = process.argv[2] || new URL('../../../../../', import.meta.url).pathname;
const { crearMotor } = await import(dir + '/js/modules/eco/motor.mjs');
const { ESCENARIOS, evaluarForma, ASENTAR_FORMA } = await import(dir + '/js/modules/eco/escenarios.mjs');
const { estadoGeo, extraDeMotor } = await import(dir + '/js/modules/eco/formas.mjs');
const { medidasCorazon, medirVd } = await import(dir + '/js/modules/eco/ecografia.mjs');
const correr = (k, g) => { const m = crearMotor(); m.correr(12); if (g === undefined) ESCENARIOS[k].aplicar(m); else ESCENARIOS[k].aplicar(m, g); if (k !== 'normal') m.correr(ASENTAR_FORMA); return m; };
const td = (m) => m.onda.reduce((a, b) => (b.vvi > a.vvi ? b : a), m.onda[0]);
const medidas = (m) => medidasCorazon(estadoGeo(td(m), extraDeMotor(m)), m.p.sc);
const vdDe = (m) => { const est = (s) => estadoGeo(s, extraDeMotor(m)), o = m.onda; return { td: medirVd(est(td(m))), ts: medirVd(est(o.reduce((a, b) => (b.vvi < a.vvi ? b : a), o[0]))) }; };
const normal = correr('normal'), md0 = medidas(normal), vd0 = vdDe(normal);
for (const g of [undefined, 1]) { const m = correr('tep', g); const r = evaluarForma('tep', m.ultimo, medidas(m), normal.ultimo, md0, vdDe(m), vd0);
  console.log(`g=${g ?? 'def'} edvD ${m.ultimo.edvD.toFixed(0)} · ` + r.filter(x => /VD|Relaci/.test(x.texto)).map(x => `${x.ok ? 'OK' : 'NO'} ${x.texto.slice(0, 22)}=${x.v}`).join(' | ')); }
