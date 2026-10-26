// Los topes de los mandos del shock (autonomo/bloques/b3/limites-shock.md). Una función pura: de la lectura y los mandos
// sale el conjunto de topes que toca poner; pagina.js los pasa a la pieza común comun/tope.js.
// Cada tope lleva su origen tal como lo da la tabla: ficha (con página), «fisiología general» o «ilustrativo».
import * as D from './datos.js';
const { C, TOPES: T } = D;
const VOL = ['[data-vol]', '[data-sangre]'];
const mL = (x) => Math.round(x).toLocaleString('es-ES');

export function calcularTopes(R, X, horas, horaTxt = (h) => h + ' h') {
  const out = {}, inf = X.infundido, dado = inf.cris + inf.sangre, tipo = X.pac.tipo;
  // 1) volumen: PCP ≥ 20 o PVC > 12 (aviso desde PCP 15 o PVC 11)
  if (D.sobrecarga(R)) {
    out.sobrecarga = { nivel: 'sello', titulo: 'Sobrecarga de volumen',
      texto: `PCP ${R.pcp} y PVC ${R.pvc}: la ficha para en 18-20 y más volumen ya no sube el gasto.${R.edema > 50 ? ` Edema: ${mL(R.edema)} mL.` : ''}`,
      cita: C.t162, origen: 'ficha · p. 42 y p. 11 · el 12 de PVC: fisiología general', deshabilita: VOL };
  } else if (R.pcp >= T.pcpAviso || R.pvc >= T.pvcAviso) {
    out.sobrecarga = { nivel: 'aviso', titulo: 'Cerca del techo',
      texto: R.pcp >= T.pcpAviso ? `PCP ${R.pcp}: la ficha para en 18-20.` : `PVC ${R.pvc}: por encima de 12 las venas no admiten más.`,
      cita: C.llenado, origen: R.pcp >= T.pcpAviso ? 'ficha · p. 42' : 'fisiología general', bajo: '#dock-panel .rejilla' };
  }
  // 2) el TEP: 500 mL con la PVC normal (4-6)
  if (tipo === 'tep') {
    if (inf.cris >= T.tepMl) out.tep = { nivel: 'sello', titulo: 'Tope de 500 mL',
      texto: `Con el VD que no puede, la ficha limita el volumen a 500 mL con la PVC normal (4-6); aquí la PVC es ${R.pvc}.`,
      cita: C.tepHemo, origen: 'ficha · cap. 22, p. 10-11', deshabilita: VOL };
    else if (inf.cris >= T.tepAviso) out.tep = { nivel: 'aviso', titulo: 'Volumen en el TEP',
      texto: `Llevas ${mL(inf.cris)} de los 500 mL que pone la ficha como tope.`, cita: C.tepHemo, origen: 'ficha · cap. 22, p. 10-11', bajo: '#dock-panel .rejilla' };
  }
  // 3) la reposición de la hemorragia: sangre + cristaloide ≤ 1,5 × lo perdido
  const tr = D.topeRepos(R, X);
  if (tr != null) {
    const perd = D.perdidoMl(X.pac, R);
    if (dado >= tr) out.reposicion = { nivel: 'sello', titulo: 'Más de lo perdido',
      texto: `Has dado ${mL(dado)} mL y perdió ≈ ${mL(perd)} mL: más de 1,5 veces lo perdido solo sobrecarga.`,
      cita: C.volemia, origen: 'ficha · p. 21-23 (66 mL/kg) · el ×1,5: ilustrativo', deshabilita: VOL };
    else if (tr - dado < 250) out.reposicion = { nivel: 'aviso', titulo: 'Reposición',
      texto: `Repuesto ${mL(dado)} mL de ≈ ${mL(perd)} mL perdidos: el tope es 1,5 veces lo perdido.`,
      cita: C.volemia, origen: 'ficha · p. 21-23 · el ×1,5: ilustrativo', bajo: '#dock-panel .rejilla' };
  }
  // 4) el vasopresor en un paciente que no lo necesita
  if (D.hipertensionVaso(R, X)) out.vaso = { nivel: 'sello', titulo: 'Hipertensión por vasopresor',
    texto: `PAM ${R.pam} con ${X.ajuste.na ? `noradrenalina a ${X.ajuste.na} µg/min` : 'vasopresina'}: baja la dosis.`,
    cita: C.na, origen: 'fisiología general (el 110) · el fármaco: ficha p. 12-13' };
  else if (R.pam > 100 && (X.ajuste.na > 0 || X.ajuste.vaso)) out.vaso = { nivel: 'aviso', titulo: 'Presión alta con vasopresor',
    texto: `PAM ${R.pam}: el objetivo del shock es 65 o más; por encima de 110, baja la dosis.`, cita: C.na, origen: 'fisiología general · fármaco: ficha p. 12-13', bajo: '#dock-panel .seg' };
  // 5) el reloj: 48 h
  if (horas >= T.horas) out.reloj = { nivel: 'sello', titulo: 'Reloj agotado',
    texto: 'Dos días de seguimiento: el lactato y la diuresis ya no cuentan nada nuevo.', origen: 'ilustrativo', deshabilita: ['[data-h]'] };
  else if (horas >= T.horasAviso) out.reloj = { nivel: 'aviso', titulo: 'Casi dos días',
    texto: `${horaTxt()}: el lactato ya no cuenta nada nuevo.`, origen: 'ilustrativo', bajo: '#dock-panel .rejilla' };
  return out;
}

// ¿Este bolo pasaría un tope que ya se sabe en mL? (el TEP y la reposición); y el de 2 L, ya cerca del techo de la PCP
export function bolosQueNoCaben(R, X) {
  const inf = X.infundido, tr = D.topeRepos(R, X), cerca = R.pcp >= T.pcpAviso || R.pvc >= T.pvcAviso;
  return (mL) => (X.pac.tipo === 'tep' && inf.cris + mL > T.tepMl) || (tr != null && inf.cris + inf.sangre + mL > tr) || (cerca && mL >= 2000);
}
