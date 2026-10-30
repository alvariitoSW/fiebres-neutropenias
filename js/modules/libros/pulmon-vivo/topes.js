// Los topes de los mandos del pulmón (autonomo/bloques/b3/limites-pulmon.md). Funciones puras: de la lectura y los
// mandos sale el conjunto de topes que toca poner; pagina.js los pasa a la pieza común js/core/tope.js.
// Cada tope lleva su origen como lo da la tabla: ficha (con página), «fisiología general» o «ilustrativo».
// Solo topes del modelo: la pantalla del respirador se rehará más adelante.
import { simular } from './pulmon.mjs';
import * as D from '../../../data/pulmon-vivo-data.js';
const { C } = D;
const f1 = (n) => String(Math.round(n * 10) / 10).replace('.', ',');

export const T = { vmAviso: 16, vtkgAviso: 8, vtkgMax: 12, vtkgMin: 4, meseta: 30, pmaxAviso: 45, vmMin: 2, vmMax: 20, peepTotMax: 20, cMax: 80, pmaxMax: 50, pmaxMin: 20, tiMin: 0.2 };
const ORG_VT = 'ficha · Tabla 27.1 (cap. 27 p. 14) y cap. 23 p. 29';
const ORG_12 = 'ARDS Network, NEJM 2000 (PMID 10793162): brazo tradicional, 12 mL/kg inicial · ficha, cap. 24 p. 46: tradicional 12-15, normal 6-7';

// Estado estable de unos ajustes (sin maniobras): para decidir si un cambio de mando se acepta.
export function estable(resp, pulmon) {
  return simular(resp, { ...pulmon, rEsp: pulmon.rEsp ?? pulmon.r }, {}, { ciclos: 10, ventana: 0.01 }).lectura;
}
// ¿Pasa el tope duro? (el mando que lo rompe se queda donde estaba). Devuelve null o el tope que se pasa.
export function pasaDeTope(l, kg, mando = 'el último') {
  if (!l) return null;
  const kgVt = l.vtExh / kg;
  if (kgVt > T.vtkgMax) return { k: 'vtalto', titulo: 'Volumen no fisiológico', texto: `${f1(kgVt)} mL/kg de peso ideal (${Math.round(l.vtExh)} mL): el doble del volumen normal (6-7); el daño por volumen se explica en el SDRA. Mando «${mando}»: se queda donde estaba.`, cita: C.vtTrad, origen: ORG_12 };
  if (l.vm > T.vmMax) return { k: 'vmalto', titulo: 'Combinación no fisiológica', texto: `Volumen minuto de ${f1(l.vm)} L/min: por encima de 20 casi nadie lo mantiene. Mando «${mando}»: se queda donde estaba.`, cita: C.t271, origen: 'ilustrativo · el 20: Tuxen 1987 (PMID 3662241) llegó a 26 L/min en obstrucción grave, con hipotensión' };
  return null;
}

export function calcularTopes(S, l, kg) {
  const out = {}, r = S.resp;
  if (!l) return out;
  const kgVt = l.vtExh != null ? l.vtExh / kg : null;
  // 1) volumen por kg (aviso por encima de 8 y por debajo de 4)
  if (kgVt != null && kgVt > T.vtkgAviso) out.vtkg = { nivel: 'aviso', titulo: 'Volumen alto', texto: `${f1(kgVt)} mL/kg de peso ideal: la ficha parte de 8 y baja a 6; en EPOC y asma, 6-8 como mucho.`, cita: C.t271, origen: ORG_VT };
  else if (kgVt != null && kgVt < T.vtkgMin && l.vm >= T.vmMin) out.vtkg = { nivel: 'aviso', titulo: 'Volumen bajo', texto: `${f1(kgVt)} mL/kg: por debajo del mínimo del protocolo (4 mL/kg).`, cita: C.t271, origen: 'ficha · Tabla 27.1 (cap. 27 p. 14)' };
  // 2) meseta por encima de 30
  if (l.meseta != null && l.meseta > T.meseta) out.meseta = { nivel: 'aviso', titulo: 'Meseta alta', texto: `Meseta ${f1(l.meseta)} cmH₂O: por encima de 30 hay riesgo de rotura alveolar.`, cita: C.riesgo, origen: 'ficha · cap. 27 p. 4; cap. 24 p. 48' };
  // 3) alarma de presión alta
  if ((r.pmax ?? 40) >= T.pmaxAviso) out.pmax = { nivel: 'aviso', titulo: 'Alarma muy alta', texto: `Con la alarma en ${r.pmax} cmH₂O deja pasar presiones que la ficha no acepta: quiere la meseta ≤30.`, cita: C.riesgo, origen: 'ilustrativo · el 45 y el 50 · el 30 es la meseta: ficha, cap. 27 p. 4 y p. 14; ojo, pico no es meseta (Tuxen 1987)' };
  // 3b) acercándose al tope de volumen minuto (80 % de 20 L/min) y espiración que no cabe (I:E ≥ 1:2)
  if (l.vm != null && l.vm >= T.vmAviso && l.vm <= T.vmMax) out.vm = { nivel: 'aviso', titulo: 'Volumen minuto muy alto', texto: `${f1(l.vm)} L/min: cerca del tope de ${T.vmMax}; por encima casi nadie lo mantiene.`, cita: C.t271, origen: 'ilustrativo · el 80 % del tope (16); VM alta ≥10 L/min: ficha, cap. 27 p. 14' };
  if (l.cabe === false) out.cabe = { nivel: 'aviso', titulo: 'No cabe la espiración', texto: `Con este Vt, flujo y frecuencia la espiración no cabe en el ciclo (FR real ${f1(l.frReal)}): el pulmón no se vacía.`, cita: C.flujoIE, origen: 'ficha · I:E ≥ 1:2, cap. 27 p. 14' };
  // 4) los sellos: uno solo a la vez (el más grave); los demás bajan a aviso
  const sellos = [];
  if (l.vm != null && l.vm < T.vmMin) sellos.push({ k: 'sinvent', titulo: 'Sin ventilación eficaz', texto: `Vt ${f1(l.vtExh)} mL y volumen minuto ${f1(l.vm)} L/min: el paciente no se ventila y el CO₂ sube. Baja la resistencia o sube la alarma de presión.`, cita: C.t245, origen: 'ilustrativo · el 2: la ficha no da un mínimo de VM (cap. 27 p. 14 habla de VM alta ≥10 L/min)' });
  if (l.vm != null && l.vm > T.vmMax) sellos.push({ k: 'vmalto', titulo: 'Combinación no fisiológica', texto: `Volumen minuto de ${f1(l.vm)} L/min: por encima de 20 casi nadie lo mantiene.`, cita: C.t271, origen: 'ilustrativo · el 20: Tuxen 1987 (PMID 3662241) llegó a 26 L/min en obstrucción grave, con hipotensión' });
  if (kgVt != null && kgVt > T.vtkgMax) sellos.push({ k: 'vtalto', titulo: 'Volumen no fisiológico', texto: `${f1(kgVt)} mL/kg de peso ideal: el doble del volumen normal (6-7); el daño por volumen se explica en el SDRA.`, cita: C.vtTrad, origen: ORG_12 });
  const pt = l.palvFinEsp;
  if (pt != null && pt > T.peepTotMax && pt - r.peep >= 2) sellos.push({ k: 'hiper', titulo: 'Hiperinflación', texto: `PEEP total ${f1(pt)} cmH₂O (${f1(pt - r.peep)} de PEEP oculta): el pulmón no se vacía; baja el gasto cardíaco y sube el riesgo de barotrauma.`, cita: C.vppConsec, origen: 'ficha · el mecanismo: cap. 23 p. 28; cap. 28 p. 31-33 · el 20 y la oculta ≥ 2: ilustrativo (lectura: Marini 2011, PMID 21700908)' });
  // el racimo (E2): unidades que se abren y se cierran en cada ciclo
  if (l.nAbreCierra > 0) sellos.push({ k: 'atelectrauma', titulo: 'Abre y cierra cada ciclo', texto: `${l.nAbreCierra} de 4 unidades se abren al inspirar y se colapsan al espirar: es el atelectrauma, que daña la vía aérea pequeña. La PEEP lo evita.`, cita: C.atelect, origen: 'ficha · cap. 24 p. 48 · presiones: ilustrativo' });
  const [s1, ...resto] = sellos;
  if (s1) out.sello = { k: s1.k, nivel: 'sello', titulo: s1.titulo, texto: s1.texto, cita: s1.cita, origen: s1.origen };
  resto.forEach((s, i) => { out['sello' + (i + 2)] = { k: s.k, nivel: 'aviso', titulo: s.titulo, texto: s.texto, cita: s.cita, origen: s.origen }; });
  return out;
}
