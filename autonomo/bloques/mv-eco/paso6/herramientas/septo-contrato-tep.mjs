// 154 · cifras del contrato (las de la TABLA de contrato.test.mjs) para el TEP 50 %, defecto y 100 %, antes y después
const dir = process.argv[2] || new URL('../../../../../', import.meta.url).pathname;
const { crearMotor } = await import(dir + '/js/modules/eco/motor.mjs');
const { ESCENARIOS, ASENTAR_FORMA } = await import(dir + '/js/modules/eco/escenarios.mjs');
const { contratoDe } = await import(dir + '/js/modules/eco/contrato.mjs');
const { puenteHoy } = await import(dir + '/js/modules/eco/contrato-puente-hoy.mjs');
for (const g of [0.5, undefined, 1]) {
  const m = crearMotor(); m.correr(12); ESCENARIOS.tep.aplicar(m, g); m.correr(ASENTAR_FORMA);
  const L = contratoDe(m, puenteHoy(m)).latido;
  console.log(`TEP ${g ?? 'def'}: ` + ['feVd', 'tapse', 'paps', 'papd', 'pvc', 'pam', 'gc', 'vdvi', 'pared.vd', 'eE', 'trv'].map(k => `${k} ${(+L[k]).toFixed(2)}`).join(' · '));
}
