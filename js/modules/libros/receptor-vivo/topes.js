// Los topes de los mandos del receptor (autonomo/bloques/b3/limites-receptor.md). Una función pura: del estado sale el
// conjunto de topes que toca poner; pagina.js los pasa a la pieza común js/core/tope.js.
// Cada tope lleva su origen tal como lo da la tabla: ficha (con página) o «fisiología general». Las cifras: las de la ficha.
import { C, ESTADO, FARMACOS, coma } from '../../../data/receptor-vivo-data.js';

// Por fármaco: el titulo del sello, su consecuencia, su cita y su origen (los deslizadores ya paran en la dosis de la fuente)
const SELLOS = {
  na: { titulo: 'Isquemia y arritmias', c: C.naSeg, origen: 'ficha · p. 13 · el monitor: fisiología general',
    texto: 'A 40 µg/min: isquemia y arritmias en ~10 %.', frase: 'A 40 µg/min: isquemia del miocardio, del cerebro o de un miembro, y arritmias (taqui y bradi) en ~10 %. La respuesta ya no sube desde 30: toca un segundo vasopresor. En el monitor, la FC sube: taquiarritmias (fisiología general).' },
  dopamina: { titulo: 'Taquicardia y taquiarritmias', c: C.dopa, origen: 'ficha · p. 14',
    texto: 'A 20 µg/kg/min: más taquicardia y FA.', frase: 'A 20 µg/kg/min: taquicardia y taquiarritmias (p. ej. FA), más que con los demás vasopresores.' },
  adrenalina: { titulo: 'Taquicardia y arritmias', c: C.adre, origen: 'ficha · pp. 13-14',
    texto: 'Dosis máxima: taquicardia y arritmias.', frase: 'A la dosis máxima: taquicardia y arritmias, e hipoperfusión esplácnica por el α.' },
  fenilefrina: { titulo: 'Bradicardia refleja', c: C.fenil, origen: 'ficha · p. 15',
    texto: 'A 200 µg/min: bradicardia refleja.', frase: 'A 200 µg/min: bradicardia refleja y menos volumen latido; menos riego en el riñón y el intestino.' },
  dobutamina: { titulo: 'Más FC, más oxígeno', c: C.dobuta, origen: 'ficha · p. 43',
    texto: 'A 20 µg/kg/min: la FC sube 5-15 lpm.', frase: 'A 20 µg/kg/min: la FC sube 5-15 lpm (a veces más de 30) y el corazón gasta más oxígeno.' },
  milrinona: { titulo: 'Hipotensión', c: C.milri, origen: 'ficha · p. 44',
    texto: 'A 0,75 µg/kg/min: hipotensión.', frase: 'A 0,75 µg/kg/min: su gran inconveniente es la hipotensión; la PAM baja.' },
};
const BEGONA = { titulo: 'Taquiarritmia e isquemia', c: C.anaShock, origen: 'ficha · pp. 66-67 · la consecuencia: del caso',
  texto: 'Máximo de la ficha: 15 µg/min.', frase: 'A 15 µg/min, el máximo de la ficha: pasarlo da taquiarritmias y una isquemia.' };

// Aviso al 80 % del tope (o, en la noradrenalina, al pasar de 30: la ficha añade ahí el segundo vasopresor)
export function calcularTopes(ST) {
  const out = {}, E = ESTADO[ST.id];
  for (const k of Object.keys(E.reg)) {
    const reg = FARMACOS[k].regimen[E.reg[k]], d = ST.f[k] ?? 0;
    if (!reg || reg.max === undefined || reg.tog || reg.fija !== undefined) continue;
    const S = k === 'adrenalina' && E.reg[k] === 'anafilaxia' ? BEGONA : SELLOS[k]; if (!S) continue;
    const u = reg.unidadVista || FARMACOS[k].unidad, tope = `${coma(reg.max, reg.paso < 1 ? 2 : 0)} ${u}`;
    if (d >= reg.max) out[k] = { nivel: 'sello', titulo: S.titulo, texto: S.texto, frase: S.frase, cita: S.c, origen: S.origen };
    else if (k === 'na' && d > 30) out[k] = { nivel: 'aviso', titulo: 'Más dosis apenas aprieta', texto: 'Por encima de 30 µg/min la ficha añade un segundo vasopresor (vasopresina): la respuesta ya no sube.', cita: C.naDosis, origen: 'ficha · p. 13' };
    else if (k !== 'na' && d >= 0.8 * reg.max - 1e-9) out[k] = { nivel: 'aviso', titulo: 'Cerca del tope', texto: `Tope de la ficha: ${tope}. Ahí: ${S.titulo.toLowerCase()}.`, cita: S.c, origen: S.origen };
  }
  // Combinaciones que la ficha contraindica
  if (ST.f.dobutamina && E.reg.dobutamina === 'tsvi') out.tsvi = { nivel: 'sello', titulo: 'Contraindicada', texto: 'Inotrópico: la FC sube y la PA cae.', frase: 'En la obstrucción dinámica del tracto de salida del VI los inotrópicos están contraindicados: la FC sube y la PA cae.', cita: C.csIno, origen: 'ficha · pp. 42-43 · las cifras: ilustrativo' };
  if (ST.f.betabloqueante && E.reg.betabloqueante) out.bbCocaina = { nivel: 'sello', titulo: 'Contraindicado', texto: 'Deja el α sin oposición: más isquemia.', frase: 'Con cocaína, el betabloqueante deja la vasoconstricción α sin oposición: más isquemia coronaria.', cita: C.cocaina, origen: 'ficha · cap. 20, p. 47' };
  return out;
}
// La frase viva en el tope: el primer sello en una línea
export function fraseTope(topes) {
  const s = Object.values(topes).find((t) => t.nivel === 'sello');
  if (!s) return '';
  const t = s.frase || s.texto, i = t.indexOf('. '), pri = i < 0 ? t : t.slice(0, i + 1), resto = i < 0 ? '' : t.slice(i + 1);
  return ` <b class="hl-rojo">${s.titulo}.</b> ${pri}${resto ? `<span class="rcv-resto">${resto}</span>` : ''}`;
}
