// Los topes de los mandos del shock (autonomo/bloques/b3/limites-shock.md). Una función pura: de la lectura y los mandos
// sale el conjunto de topes que toca poner; pagina.js los pasa a la pieza común js/core/tope.js.
// Cada tope lleva su origen tal como lo da la tabla: ficha (con página), «fisiología general» o «ilustrativo».
import * as D from '../../../data/shock-vivo-data.js';
import { eroaDeG, civDeG, eesVdDeG } from './soporte.mjs';
const { C, TOPES: T } = D;
const VOL = ['[data-vol]', '[data-sangre]'];
const mL = (x) => Math.round(x).toLocaleString('es-ES');
const c2 = (x, d = 2) => (+x).toFixed(d).replace('.', ',');

let dadoVisto = 0;   // lo infundido en el cálculo anterior: distingue un bolo nuevo de un ECMO que sube la PCP solo
export function calcularTopes(R, X, horas, horaTxt = (h) => h + ' h') {
  const out = {}, inf = X.infundido, dado = inf.cris + inf.sangre, tipo = X.pac.tipo;
  const boloNuevo = dado > dadoVisto; dadoVisto = dado;
  // 1) volumen: PCP ≥ 20, o PVC > 12 habiendo subido ≥ 4 sobre la de entrada (aviso desde PCP 15 o PVC 11)
  const porPcp = R.pcp >= T.pcpAviso, ed = R.edema > 50 ? ` Edema en el pulmón: ${mL(R.edema)} mL (SpO₂ ${R.spo2} %).` : '';
  // el papilar y el septo llegan con la PCP en 20-30 sin volumen: es su cuadro; el sello llega con el primer bolo
  const llegaAlta = (tipo === 'papilar' || tipo === 'septo') && dado === 0;
  if (D.sobrecarga(R) && llegaAlta) {
    out.sobrecarga = { nivel: 'aviso', titulo: `PCP ${R.pcp}: sin volumen`, texto: `Llega con la PCP en ${R.pcp} sin haber dado volumen (${tipo === 'papilar' ? 'la sangre que vuelve a la aurícula' : 'el cortocircuito que inunda el pulmón'}): la ficha para el volumen en 18-20; no des más.${ed}`,
      cita: C.llenado, origen: 'ficha · p. 42 · la PCP de este paciente: modelo', bajo: '#shv-dock-panel .rejilla' };
  } else if (D.sobrecarga(R) && X.ajuste.soporte === 'ecmo' && !boloNuevo && R.pcp >= T.pcp) {
    // con el ECMO y sin volumen nuevo, la PCP sube por la poscarga del VI, no por el suero
    out.sobrecarga = { nivel: 'sello', titulo: 'El ECMO sube la poscarga del VI', texto: `PCP ${R.pcp}: el flujo retrógrado del ECMO le sube la poscarga al VI y el pulmón se encharca; ventea (un balón o un Impella a la vez, o drenar el VI).${ed}`,
      cita: C.ecmoPoscarga, origen: 'ficha · p. 48-49 · la cifra: modelo', deshabilita: VOL };
  } else if (D.sobrecarga(R)) {
    out.sobrecarga = R.pcp >= T.pcp
      ? { nivel: 'sello', titulo: 'Sobrecarga de volumen', texto: `PCP ${R.pcp}: pasa el techo de 18-20 de la ficha; más volumen ya no sube el gasto y encharca el pulmón.${ed}`,
          cita: C.llenado, origen: 'ficha · p. 42 y p. 11', deshabilita: VOL }
      : { nivel: 'sello', titulo: 'Sobrecarga de volumen', texto: `PVC ${R.pvc} (entró con ${R.pvc0}): la PVC predice mal la respuesta a volumen (Marik); el 12 es del modelo.${ed}`,
          origen: 'ilustrativo (el 12). La PVC predice mal la respuesta a volumen: Marik 2008, PMID 18628220; Marik 2013, PMID 23774337', deshabilita: VOL };
  } else if (D.avisoVolumen(R)) {
    const sinVol = tipo === 'posparo' && dado === 0 && porPcp;   // el aturdimiento ya llega con la PCP alta: no es consecuencia de un mando
    out.sobrecarga = { nivel: 'aviso', titulo: sinVol ? `PCP ${R.pcp}: sin volumen` : 'Cerca del techo',
      texto: sinVol ? `Llega con la PCP en ${R.pcp} sin haber dado volumen (el VI aturdido): la ficha para el volumen en 18-20; no des más.` : porPcp ? `PCP ${R.pcp}: la ficha para en 18-20.${ed}` : `PVC ${R.pvc}: la PVC predice mal la respuesta a volumen (Marik); el 12 es del modelo.`,
      cita: porPcp ? C.llenado : undefined, origen: porPcp ? 'ficha · p. 42' : 'ilustrativo (el 12). La PVC predice mal la respuesta a volumen: Marik 2008, PMID 18628220', bajo: '#shv-dock-panel .rejilla' };
  }
  // 1a) el mando de gravedad de los tres del infarto: aviso al acercarse al tope y sello al pasarlo
  if (tipo === 'papilar') {
    const e = eroaDeG(X.g);
    if (e > T.eroa) out.gravedad = { nivel: 'sello', titulo: 'Insuficiencia mitral masiva',
      texto: `Orificio de ${c2(e)} cm², más de ${c2(T.eroa, 1)}: PAM ${R.pam}, IC ${c2(R.ic, 1)}, PCP ${R.pcp}. La ficha solo dice que la IM aguda amenaza la vida.`,
      cita: C.papilar, origen: 'ficha · p. 38 (amenaza la vida) · el orificio y las cifras: ilustrativo', deshabilita: VOL };
    else if (e >= T.eroaAviso) out.gravedad = { nivel: 'aviso', titulo: 'En el tope del orificio',
      texto: `Orificio de ${c2(e)} cm²: el modelo llega a ${c2(T.eroa, 1)}; por encima, la IM ya es masiva.`, origen: 'ilustrativo (los cm²). La fuente solo da «insuficiencia mitral aguda» (p. 38)', bajo: '#shv-dock-panel .deslizador' };
  } else if (tipo === 'septo') {
    const c = civDeG(X.g);
    if (c >= T.civ - 1e-9) out.gravedad = { nivel: 'sello', titulo: 'Cortocircuito masivo: colapso',
      texto: `Orificio de ${c2(c)} cm²: Qp/Qs ${c2(R.qpqs, 1)}, PAM ${R.pam}, IC ${c2(R.ic, 1)}. El pulmón recibe ${c2(R.qpqs, 1)} veces lo que sale por la aorta.`,
      cita: C.septo, origen: 'ficha · p. 38 (desvía flujo de la circulación sistémica) · el orificio y las cifras: ilustrativo', deshabilita: VOL };
    else if (c >= T.civAviso) out.gravedad = { nivel: 'aviso', titulo: 'Cerca del cortocircuito masivo',
      texto: `Orificio de ${c2(c)} cm²: Qp/Qs ${c2(R.qpqs, 1)}; el sello llega con ${c2(T.civ, 1)} cm².`, origen: 'ilustrativo (los cm²). La fuente solo da «gran shunt izquierda-derecha» (p. 38)', bajo: '#shv-dock-panel .deslizador' };
  } else if (tipo === 'vd') {
    const ees = eesVdDeG(X.g);
    if (ees <= 0.1 + 1e-9) out.gravedad = { nivel: 'sello', titulo: 'VD sin fuerza',
      texto: `Ees del VD al ${Math.round(ees * 100)} % de la normal: PVC ${R.pvc}, PCP ${R.pcp}, IC ${c2(R.ic, 1)}. Por debajo, el modelo ya no es un paciente.`,
      cita: C.vd, origen: 'ficha · p. 40 (la dirección: sube la PVC) · el 10 % y las cifras: ilustrativo', deshabilita: VOL };
    else if (X.g >= T.vdGAviso) out.gravedad = { nivel: 'aviso', titulo: 'Cerca del límite del VD',
      texto: `Ees del VD al ${Math.round(ees * 100)} % de la normal: el modelo llega al 10 %.`, origen: 'ilustrativo (el 10 %). La fuente solo da la dirección (p. 40)', bajo: '#shv-dock-panel .deslizador' };
  }
  // 1b) el pulmón encharcado: con el edema por encima de 1.000 mL y la SpO₂ cayendo, el paciente no lo aguanta sin ventilar
  if (R.edema >= T.edemaSello) out.edema = { nivel: 'sello', titulo: 'Edema de pulmón',
    texto: `${mL(R.edema)} mL de líquido en el pulmón y SpO₂ ${R.spo2} %${R.spo2 >= 95 ? ' (el oxigenador del ECMO tapa la caída)' : ''}: así no se sostiene; necesitaría intubación y ventilación con PEEP, y diurético o ultrafiltración.`,
    origen: 'el edema por presión de llenado alta: Zanza 2023, PMID 37887077 · el tratamiento (intubación, PEEP, diurético, ultrafiltración): fisiología general · los 1.000 mL y la SpO₂: ilustrativos', deshabilita: VOL };
  // 2) el TEP: 500 mL con la PVC normal (4-6)
  if (tipo === 'tep') {
    if (inf.cris >= T.tepMl) out.tep = { nivel: 'sello', titulo: 'Tope de 500 mL',
      texto: `Con el VD que no puede, la ficha limita el volumen a 500 mL con la PVC normal (4-6); aquí la PVC es ${R.pvc}.`,
      cita: C.tepHemo, origen: 'ficha · cap. 22, p. 10-11', deshabilita: VOL };
    else if (inf.cris >= T.tepAviso) out.tep = { nivel: 'aviso', titulo: 'Volumen en el TEP',
      texto: `Llevas ${mL(inf.cris)} de los 500 mL que pone la ficha como tope.`, cita: C.tepHemo, origen: 'ficha · cap. 22, p. 10-11', bajo: '#shv-dock-panel .rejilla' };
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
      cita: C.volemia, origen: 'ficha · p. 21-23 · el ×1,5: ilustrativo', bajo: '#shv-dock-panel .rejilla' };
  }
  // 4) el vasopresor en un paciente que no lo necesita
  if (D.hipertensionVaso(R, X)) out.vaso = { nivel: 'sello', titulo: 'Hipertensión por vasopresor',
    texto: `PAM ${R.pam} con ${X.ajuste.na ? `noradrenalina a ${X.ajuste.na} µg/min` : 'vasopresina'}: baja la dosis.`,
    cita: C.na, origen: 'ilustrativo (el 110). En shock séptico o vasodilatador, un objetivo de PAM más alto se asoció a un 10 % más de mortalidad a 28 días (Mendes 2025, PMID 41276856) y a más FA (Asfar 2014, SEPSISPAM, PMID 24635770) · el fármaco: ficha p. 12-13' };
  else if (R.pam > 100 && (X.ajuste.na > 0 || X.ajuste.vaso)) out.vaso = { nivel: 'aviso', titulo: 'Presión alta con vasopresor',
    texto: `PAM ${R.pam}: el objetivo del shock es 65 o más; por encima de 110, baja la dosis.`, cita: C.na, origen: 'ilustrativo (el 110). En shock séptico o vasodilatador, un objetivo de PAM más alto se asoció a un 10 % más de mortalidad a 28 días (Mendes 2025, PMID 41276856) y a más FA (Asfar 2014, SEPSISPAM, PMID 24635770) · fármaco: ficha p. 12-13', bajo: '#shv-dock-panel .seg' };
  // 5) el reloj: 48 h
  if (tipo === 'posparo') {
    // el reloj es el de la RCE: 72 h («suele resolverse en 72 h», p. 65); pasado, las cifras ya no cambian
    if (X.hPos >= T.horasPosparo) out.reloj = { nivel: 'sello', titulo: 'Pasadas las 72 h',
      texto: 'El aturdimiento suele estar resuelto y las cifras ya no cambian. Si el paciente siguiera en shock, ya no sería aturdimiento: la fuente no dice más.', cita: C.posparo, origen: 'ficha · p. 65', deshabilita: ['[data-h]'] };
    else if (X.hPos >= T.horasPosparoAviso) out.reloj = { nivel: 'aviso', titulo: 'Casi 72 horas',
      texto: `${Math.round(X.hPos)} h tras la RCE: a las 72 h el aturdimiento suele estar resuelto.`, cita: C.posparo, origen: 'ficha · p. 65', bajo: '#shv-dock-panel .rejilla' };
  } else if (horas >= T.horas) out.reloj = { nivel: 'sello', titulo: 'Reloj agotado',
    texto: 'Dos días de seguimiento: el lactato y la diuresis ya no cuentan nada nuevo.', origen: 'ilustrativo', deshabilita: ['[data-h]'] };
  else if (horas >= T.horasAviso) out.reloj = { nivel: 'aviso', titulo: 'Casi dos días',
    texto: `${horaTxt()}: el lactato ya no cuenta nada nuevo.`, origen: 'ilustrativo', bajo: '#shv-dock-panel .rejilla' };
  return out;
}

// ¿Este bolo pasaría un tope que ya se sabe en mL? (el TEP y la reposición); y el de 2 L, ya cerca del techo de la PCP
export function bolosQueNoCaben(R, X) {
  const inf = X.infundido, tr = D.topeRepos(R, X), cerca = D.avisoVolumen(R);
  return (mL) => (X.pac.tipo === 'tep' && inf.cris + mL > T.tepMl) || (tr != null && inf.cris + inf.sangre + mL > tr) || (cerca && mL >= 2000);
}
