// Maqueta C · generador de pacientes y de preguntas (lógica pura, sin DOM).
// Todo parte de normalizar() y describir() de la pieza común: no hay cifras nuevas.
import { ESTADO_INICIAL, normalizar, describir } from './estados.js';

const pick = (rnd, a) => a[Math.floor(rnd() * a.length)];
const baraja = (rnd, a) => { const x = [...a]; for (let i = x.length - 1; i > 0; i--) { const j = Math.floor(rnd() * (i + 1)); [x[i], x[j]] = [x[j], x[i]]; } return x; };

// Grupos de hallazgos del pulmón y la pleura; cada uno con sus estados posibles.
const GRUPOS = {
  ntx: ['pequeno', 'grande', 'tension'],
  derrame: ['pequeno', 'medio', 'grande'],
  patron: ['edema', 'sdra', 'sdraLoc'],
  consol: ['si'],
  atel: ['lii', 'pulmon'],
};

// Un paciente al azar que nunca es una combinación imposible (§3): el tubo selectivo excluye ntx y atelectasia;
// el neumotórax y la atelectasia son del mismo lado; la tensión no se mezcla con derrame; como mucho 3 cosas.
export function generar(rnd = Math.random) {
  const e = { ...ESTADO_INICIAL };
  e.postura = rnd() < 0.5 ? 'erguido' : 'supino';
  if (rnd() < 0.65) e.tubo = pick(rnd, ['bien', 'bien', 'bien', 'alto', 'selectivo']);
  const r = rnd(), n = r < 0.12 ? 0 : r < 0.65 ? 1 : 2;
  const elegidos = [];
  for (const g of baraja(rnd, Object.keys(GRUPOS))) {
    if (elegidos.length >= n) break;
    if (e.tubo === 'selectivo' && (g === 'ntx' || g === 'atel')) continue;
    if ((g === 'ntx' && elegidos.includes('atel')) || (g === 'atel' && elegidos.includes('ntx'))) continue;
    elegidos.push(g); e[g] = pick(rnd, GRUPOS[g]);
  }
  if (e.ntx === 'tension' && e.derrame !== 'no') e.derrame = 'no';
  if (rnd() < 0.5) e.via = pick(rnd, ['bien', 'bien', 'ad', 'pared', 'yugular']);
  if (rnd() < (e.tubo !== 'no' ? 0.6 : 0.15)) e.sng = pick(rnd, ['bien', 'bien', 'bronquio']);
  const { e: n2, d } = normalizar(e);
  const sexo = rnd() < 0.5 ? 'Mujer' : 'Varón', edad = 40 + Math.floor(rnd() * 45);
  const rango = e.ntx === 'tension' ? [82, 88] : (n2.atel === 'pulmon') ? [86, 90] : e.patron.startsWith('sdra') ? [87, 91] : e.patron === 'edema' ? [89, 93]
    : (e.derrame === 'grande' || e.consol === 'si') ? [90, 93] : [94, 98];
  const spo2 = rango[0] + Math.floor(rnd() * (rango[1] - rango[0] + 1));
  const vent = n2.tubo !== 'no';
  return { e: n2, d, ctx: `${sexo} de ${edad} años, ${vent ? 'con ventilación mecánica' : 'respirando por sí mismo'}, SpO₂ ${spo2} %. Placa portátil de control.` };
}

export const LETRAS = [
  { id: 'A', titulo: 'Vía aérea y tubo' },
  { id: 'B', titulo: 'Pulmón y pleura' },
  { id: 'C', titulo: 'Mediastino y vía central' },
  { id: 'D', titulo: 'Diafragmas y sonda' },
  { id: 'E', titulo: 'Lo demás: la postura' },
];

// Etiquetas y consecuencias de leer mal (lo que le pasaría al paciente). Pág. = página del PDF de Marino.
const O = (rotulo, pasa) => ({ rotulo, pasa });
const TUBO = {
  no: O('Sin tubo', 'no mirarías la punta del tubo: un tubo alto se sale al mover el cuello (Marino cap. 28, pág. 18)'),
  bien: O('Tubo a 3-5 cm de la carina', 'dejarías sin corregir un tubo alto o en el bronquio derecho; con éste último el pulmón izquierdo sigue sin aire (Marino cap. 28, págs. 18-19)'),
  alto: O('Tubo alto, lejos de la carina', 'moverías un tubo que está bien puesto, con riesgo de sacarlo del todo'),
  selectivo: O('Tubo en el bronquio derecho', 'retirarías de más un tubo que está bien: quedaría alto y se saldría al mover el cuello (Marino cap. 28, pág. 18)'),
};
const PLEURA = {
  tension: O('Neumotórax a tensión', 'descomprimirías de urgencia un tórax sin tensión, con el riesgo de una punción sin necesidad (Marino cap. 28, pág. 29)'),
  ntx: O('Neumotórax sin desvío del mediastino', 'dejarías sin descomprimir un neumotórax a tensión: el paciente seguiría hipotenso (Marino cap. 28, pág. 29)'),
  derrame: O('Derrame pleural', 'punzarías un derrame de menos de 10 mm, que no se punciona (Marino cap. 29, pág. 46)'),
  edema: O('Edema cardiogénico', 'tratarías como cardiaco un SDRA: la placa sola no los distingue (Marino cap. 24, pág. 36)'),
  sdra: O('SDRA', 'tratarías como SDRA un edema cardiaco y no buscarías la causa en el corazón (Marino cap. 24, pág. 36)'),
  consol: O('Consolidación (neumonía)', 'pondrías antibiótico por una atelectasia: un infiltrado nuevo no confirma neumonía (Marino cap. 28, pág. 40)'),
  atel: O('Atelectasia', 'buscarías un tapón en una neumonía y retrasarías su tratamiento (Marino cap. 28, pág. 23)'),
  ninguno: O('Pulmones sin patología', 'darías por buena una placa con patología y no actuarías'),
};
const VIA = {
  bien: O('Punta en la cava, a la altura de la carina', 'darías por buena una vía contra la pared o subida al cuello (Marino cap. 2, págs. 36-37; cap. 3, pág. 45)'),
  ad: O('Punta en la aurícula derecha', 'recolocarías una punta que en 2.348 pacientes no dio problemas (Marino cap. 2, pág. 37)'),
  pared: O('Punta contra la pared de la cava', 'sospecharías una perforación en una vía bien puesta (Marino cap. 3, pág. 45)'),
  yugular: O('Punta subida a la yugular', 'recolocarías una vía que ya baja a la cava (Marino cap. 2, pág. 37)'),
};
const MED = {
  central: O('Mediastino en el centro', 'no buscarías el motivo del desvío: tensión, colapso o derrame grande'),
  der: O('Mediastino desviado a la derecha del paciente', 'buscarías el problema en el lado equivocado'),
  izq: O('Mediastino desviado a la izquierda del paciente', 'buscarías el problema en el lado equivocado'),
  ancho: O('Mediastino ensanchado', 'sospecharías una perforación o una masa en un mediastino normal (Marino cap. 3, pág. 45)'),
};
const SNG = {
  no: O('Sin sonda', 'no verías una sonda mal puesta antes de nutrir (Marino cap. 49, pág. 29)'),
  bien: O('Sonda recta, con la punta bajo la cúpula izquierda', 'empezarías la nutrición por una sonda que está en el pulmón (Marino cap. 49, pág. 29)'),
  bronquio: O('Sonda desviada a la derecha en la carina', 'retirarías una sonda que está bien puesta'),
};
const POSTURA = {
  erguido: O('Sentado', 'buscarías el neumotórax delante de las bases y el derrame sin menisco: leerías al revés (Marino cap. 2, pág. 34)'),
  supino: O('Tumbado', 'buscarías el aire en el vértice y el menisco del líquido; en tumbado no están (Marino cap. 2, pág. 34)'),
  lateral: O('De lado (decúbito lateral)', 'esperarías el líquido en la pared, como en la placa de lado (Marino cap. 29, pág. 46)'),
};

const HERMANAS = { tension: ['ntx', 'derrame'], ntx: ['tension', 'derrame'], derrame: ['consol', 'atel'], edema: ['sdra', 'derrame'], sdra: ['edema', 'consol'],
  consol: ['atel', 'edema'], atel: ['consol', 'derrame'], ninguno: ['atel', 'derrame', 'ntx'] };

function presentes(e) {
  const p = [];
  if (e.ntx === 'tension') p.push(['tension', 'ntx']); else if (e.ntx !== 'no') p.push(['ntx', 'ntx']);
  if (e.atel !== 'no') p.push(['atel', 'atel']);
  if (e.derrame !== 'no') p.push(['derrame', 'derrame']);
  if (e.patron === 'edema') p.push(['edema', 'patron']); else if (e.patron !== 'no') p.push(['sdra', 'patron']);
  if (e.consol !== 'no') p.push(['consol', 'consol']);
  return p;
}

// Las 5 preguntas del recorrido para este paciente. `foco` es el mando de describir() que explica la respuesta.
export function preguntas(p, rnd = Math.random) {
  const { e, d } = p;
  const armar = (letra, enunciado, tabla, correcta, ids, foco, extra) => ({ letra, enunciado, tabla, correcta, foco, extra: extra || null,
    opciones: baraja(rnd, ids.includes(correcta) ? ids : [correcta, ...ids]).slice(0, 4).map(id => ({ id, ...tabla[id] })) });
  const q = [];
  q.push(armar('A', '¿Qué ves en la vía aérea?', TUBO, e.tubo, Object.keys(TUBO), 'tubo'));
  // B
  const pres = presentes(e), ids = pres.map(x => x[0]);
  const [lb, fb] = pres[0] || ['ninguno', 'patron'];
  const cand = [...HERMANAS[lb].filter(x => !ids.includes(x)), ...Object.keys(PLEURA).filter(x => x !== lb && !ids.includes(x) && !HERMANAS[lb].includes(x))];
  const resto = pres.slice(1).map(x => PLEURA[x[0]].rotulo);
  q.push(armar('B', '¿Qué es lo principal en el pulmón y la pleura?', PLEURA, lb, [lb, ...cand.slice(0, 3)], fb, resto.length ? `También hay: ${resto.join(', ')}.` : null));
  // C
  if (e.via !== 'no') q.push(armar('C', '¿Dónde acaba la punta de la vía central?', VIA, e.via, Object.keys(VIA), 'via'));
  else {
    const mc = d.desvio < -8 ? 'der' : d.desvio > 4 ? 'izq' : 'central';
    const fc = mc === 'der' ? 'ntx' : mc === 'izq' ? (e.atel !== 'no' ? 'atel' : 'derrame') : 'atel';
    q.push(armar('C', '¿Dónde está el mediastino?', MED, mc, Object.keys(MED), fc));
  }
  q.push(armar('D', '¿Qué ves en la sonda?', SNG, e.sng, Object.keys(SNG), 'sng'));
  q.push(armar('E', '¿En qué postura se hizo la placa?', POSTURA, e.postura, Object.keys(POSTURA), 'postura'));
  return q;
}

// Informe de «otro residente» sobre esta placa con 0, 1 o 2 frases falsas.
export function informe(qs, rnd = Math.random) {
  const r = rnd(), nErr = r < 0.25 ? 0 : r < 0.65 ? 1 : 2;
  const malas = new Set(baraja(rnd, qs.map((_, i) => i)).slice(0, nErr));
  const pref = { A: 'Vía aérea', B: 'Pulmón y pleura', C: 'Vía y mediastino', D: 'Sonda', E: 'Postura' };
  return qs.map((x, i) => {
    const falsa = malas.has(i);
    const otro = falsa ? x.opciones.filter(o => o.id !== x.correcta)[Math.floor(rnd() * (x.opciones.length - 1))] : null;
    const dicho = falsa ? otro : x.opciones.find(o => o.id === x.correcta);
    const real = x.tabla[x.correcta].rotulo;
    return { letra: x.letra, texto: `${pref[x.letra]}: ${/^[A-ZÁÉÍÓÚ][a-záéíóú]/.test(dicho.rotulo) ? dicho.rotulo.charAt(0).toLowerCase() + dicho.rotulo.slice(1) : dicho.rotulo}.`, error: falsa, real, foco: x.foco };
  });
}

export { describir };
