// M0c: la HP crónica con bolos de 1.500 mL + EPP (maniobras.test.mjs, prueba 7), con y sin desplazamiento septal
const R = (p) => new URL('../../../../' + p, import.meta.url);
const { crearMotor } = await import(R('js/modules/eco/motor.mjs'));
const { aplicarEscenario } = await import(R('js/modules/eco/escenarios.mjs'));
const { epp, bolo, SEGUNDOS_MANIOBRA, faltaParaAsentar } = await import(R('js/modules/eco/maniobras.mjs'));
for (const k of (process.env.K ?? '0,1').split(',').map(Number)) {
  const m = crearMotor(); m.p.septoDesplaza = k; m.correr(12); aplicarEscenario(m, 'hpcronica'); m.correr(faltaParaAsentar(m));
  const v = (t) => { const u = m.ultimo; console.log(`k ${k} ${t}`.padEnd(20), `PAPs ${u.paps.toFixed(1)} PCP ${u.pcp.toFixed(1)} PVC ${u.pvc.toFixed(1)} pperi ${u.pperi.toFixed(1)} VI ${u.edv.toFixed(0)} VD ${u.edvD.toFixed(0)} GC ${u.gc.toFixed(2)}`); };
  v('basal'); bolo(m, 250); m.correr(SEGUNDOS_MANIOBRA); for (let i = 0; i < 2; i++) { bolo(m, 500); m.correr(SEGUNDOS_MANIOBRA); }
  bolo(m, 250); m.correr(SEGUNDOS_MANIOBRA); v('1500'); epp(m, true); m.correr(SEGUNDOS_MANIOBRA); v('1500+EPP');
}
